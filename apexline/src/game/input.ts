import type { Settings } from './types';

export type Action = 'restart' | 'checkpoint' | 'camera' | 'pause' | 'leaderboard' | 'ghost';

/** Keyboard + gamepad + touch input. Produces analog steer/throttle/brake; the race controller quantises these before they reach the deterministic sim. */
export class InputManager {
  held = new Set<string>();
  steer = 0; thr = 0; brk = 0; hb = 0;
  touch = { left: false, right: false, gas: false, brake: false, hb: false, steerAxis: 0, active: false };
  pad: Gamepad | null = null;
  padName = '';
  handlers: Partial<Record<Action, () => void>> = {};
  settings: Settings;
  private padPrev: boolean[] = [];
  private steerKey = 0;
  usingKeyboard = true;
  private down = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.code === 'Tab' || e.code === 'Space' || e.code.startsWith('Arrow') || e.code === 'Backspace') e.preventDefault();
    if (!e.repeat) { this.held.add(e.code); this.fireKey(e.code); }
    this.usingKeyboard = true;
  };
  private up = (e: KeyboardEvent) => { this.held.delete(e.code); };
  private blur = () => { this.held.clear(); };
  constructor(settings: Settings) {
    this.settings = settings;
    window.addEventListener('keydown', this.down); window.addEventListener('keyup', this.up); window.addEventListener('blur', this.blur);
  }
  dispose() { window.removeEventListener('keydown', this.down); window.removeEventListener('keyup', this.up); window.removeEventListener('blur', this.blur); }
  private isHeld(action: string): boolean { return (this.settings.keys[action] ?? []).some(c => this.held.has(c)); }
  private fireKey(code: string) {
    for (const a of ['restart', 'checkpoint', 'camera', 'pause', 'leaderboard', 'ghost'] as Action[]) if ((this.settings.keys[a] ?? []).includes(code)) this.handlers[a]?.();
  }
  vibrate(strong: number, weak: number, ms: number) {
    if (!this.settings.vibration || !this.pad) return;
    const act = (this.pad as any).vibrationActuator; if (act?.playEffect) act.playEffect('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: weak }).catch(() => {});
  }
  /** Sample inputs; dt in seconds. */
  poll(dt: number) {
    // keyboard
    let thr = this.isHeld('accel') ? 1 : 0, brk = this.isHeld('brake') ? 1 : 0, hb = this.isHeld('handbrake') ? 1 : 0;
    const l = this.isHeld('left'), r = this.isHeld('right');
    const target = (l ? 1 : 0) - (r ? 1 : 0);
    const sens = this.settings.steerSens;
    const rate = (target !== 0 && Math.sign(target) === Math.sign(this.steerKey || target) ? 6.5 : 11) * sens;
    this.steerKey += Math.max(-rate * dt, Math.min(rate * dt, target - this.steerKey));
    let steer = this.steerKey;
    // touch
    if (this.touch.active) {
      if (this.touch.gas) thr = 1; if (this.touch.brake) brk = 1; if (this.touch.hb) hb = 1;
      const t = (this.touch.left ? 1 : 0) - (this.touch.right ? 1 : 0) + this.touch.steerAxis;
      if (t !== 0) steer = Math.max(-1, Math.min(1, t));
    }
    // gamepad
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    this.pad = null;
    for (const p of pads) if (p && p.connected) { this.pad = p; break; }
    if (this.pad) {
      const p = this.pad; this.padName = p.id;
      const dz = this.settings.deadzone;
      const ax = (v: number) => { const a = Math.abs(v); return a < dz ? 0 : Math.sign(v) * (a - dz) / (1 - dz); };
      const sx = ax(p.axes[0] ?? 0);
      const rt = p.buttons[7]?.value ?? 0, lt = p.buttons[6]?.value ?? 0;
      if (Math.abs(sx) > 0.02 || rt > 0.05 || lt > 0.05 || p.buttons[0]?.pressed) {
        this.usingKeyboard = false;
        if (sx !== 0) steer = -Math.sign(sx) * Math.pow(Math.abs(sx), 1.25) * sens;
        thr = Math.max(thr, rt); brk = Math.max(brk, lt);
        if (p.buttons[0]?.pressed) hb = 1;
      }
      const pressed = p.buttons.map(b => b.pressed);
      const edge = (i: number) => pressed[i] && !this.padPrev[i];
      if (edge(3) || edge(2) && false) this.handlers.restart?.();
      if (edge(1)) this.handlers.checkpoint?.();
      if (edge(2)) this.handlers.camera?.();
      if (edge(9)) this.handlers.pause?.();
      if (edge(8)) this.handlers.leaderboard?.();
      if (edge(4)) this.handlers.ghost?.();
      this.padPrev = pressed;
    }
    this.steer = Math.max(-1, Math.min(1, steer)); this.thr = thr; this.brk = brk; this.hb = hb;
  }
}
