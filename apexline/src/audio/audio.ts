import type { Settings } from '../game/types';
import type { Engine } from '../data/vehicles';

/** Fully procedural audio (original synthesis, no sampled or licensed assets). */
export class AudioSys {
  ctx: AudioContext | null = null;
  master!: GainNode; music!: GainNode; engineBus!: GainNode; env!: GainNode; ui!: GainNode;
  osc1?: OscillatorNode; osc2?: OscillatorNode; sub?: OscillatorNode; eGain?: GainNode; eFilter?: BiquadFilterNode; whine?: OscillatorNode; whineG?: GainNode;
  noiseBuf?: AudioBuffer;
  skidG?: GainNode; skidF?: BiquadFilterNode; windG?: GainNode; windF?: BiquadFilterNode; roadG?: GainNode; roadF?: BiquadFilterNode;
  engine: Engine = { base: 50, cyl: 4, rough: 0.4, whine: 0, max: 7000 };
  gear = 1; rpm = 1000; lastShift = 0;
  musicTimer: any = 0; musicStep = 0; musicOn = false; musicMood: 'menu' | 'race' = 'menu';
  settings!: Settings;
  started = false;

  init(settings: Settings) {
    this.settings = settings;
    if (this.ctx) { this.applyVolumes(); return; }
    const AC = window.AudioContext || (window as any).webkitAudioContext; if (!AC) return;
    this.ctx = new AC();
    const c = this.ctx;
    this.master = c.createGain(); this.music = c.createGain(); this.engineBus = c.createGain(); this.env = c.createGain(); this.ui = c.createGain();
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    for (const b of [this.music, this.engineBus, this.env, this.ui]) b.connect(this.master);
    this.master.connect(comp); comp.connect(c.destination);
    // shared noise
    const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noiseBuf = nb;
    this.applyVolumes();
  }
  applyVolumes() {
    if (!this.ctx) return; const v = this.settings.vol;
    this.master.gain.value = v.master; this.music.gain.value = v.music * 0.5; this.engineBus.gain.value = v.engine; this.env.gain.value = v.env; this.ui.gain.value = v.ui;
  }
  /** Must be called from a user gesture at least once. */
  resume() { this.ctx?.resume(); }
  private noise(loop = true): AudioBufferSourceNode { const s = this.ctx!.createBufferSource(); s.buffer = this.noiseBuf!; s.loop = loop; return s; }

  startEngine(e: Engine) {
    if (!this.ctx) return; this.stopEngine(); const c = this.ctx; this.engine = e;
    this.eFilter = c.createBiquadFilter(); this.eFilter.type = 'lowpass'; this.eFilter.frequency.value = 800; this.eFilter.Q.value = 2;
    this.eGain = c.createGain(); this.eGain.gain.value = 0;
    this.osc1 = c.createOscillator(); this.osc1.type = e.whine >= 1 ? 'sine' : 'sawtooth';
    this.osc2 = c.createOscillator(); this.osc2.type = e.whine >= 1 ? 'triangle' : 'square';
    this.sub = c.createOscillator(); this.sub.type = 'sine';
    const g1 = c.createGain(), g2 = c.createGain(), g3 = c.createGain(); g1.gain.value = 0.5; g2.gain.value = 0.22 * e.rough + 0.05; g3.gain.value = 0.4;
    this.osc1.connect(g1).connect(this.eFilter); this.osc2.connect(g2).connect(this.eFilter); this.sub.connect(g3).connect(this.eFilter);
    this.eFilter.connect(this.eGain).connect(this.engineBus);
    this.osc1.start(); this.osc2.start(); this.sub.start();
    // turbo/electric whine
    this.whine = c.createOscillator(); this.whine.type = 'sine'; this.whineG = c.createGain(); this.whineG.gain.value = 0; this.whine.connect(this.whineG).connect(this.engineBus); this.whine.start();
    // tyre / wind / road
    this.skidF = c.createBiquadFilter(); this.skidF.type = 'bandpass'; this.skidF.frequency.value = 1100; this.skidF.Q.value = 3; this.skidG = c.createGain(); this.skidG.gain.value = 0;
    const sn = this.noise(); sn.connect(this.skidF).connect(this.skidG).connect(this.env); sn.start();
    this.windF = c.createBiquadFilter(); this.windF.type = 'lowpass'; this.windF.frequency.value = 600; this.windG = c.createGain(); this.windG.gain.value = 0;
    const wn = this.noise(); wn.connect(this.windF).connect(this.windG).connect(this.env); wn.start();
    this.roadF = c.createBiquadFilter(); this.roadF.type = 'lowpass'; this.roadF.frequency.value = 300; this.roadG = c.createGain(); this.roadG.gain.value = 0;
    const rn = this.noise(); rn.connect(this.roadF).connect(this.roadG).connect(this.env); rn.start();
    this.gear = 1; this.rpm = 1000;
  }
  stopEngine() {
    for (const n of [this.osc1, this.osc2, this.sub, this.whine]) { try { n?.stop(); } catch { /* already stopped */ } }
    this.osc1 = this.osc2 = this.sub = this.whine = undefined;
    try { this.skidG?.disconnect(); this.windG?.disconnect(); this.roadG?.disconnect(); this.eGain?.disconnect(); } catch { /* ok */ }
  }

  /** Per-frame update. speed m/s, throttle 0..1. Returns { gear, rpm } for HUD. */
  updateEngine(speed: number, throttle: number, slip: number, surface: number, airborne: boolean, dt: number): { gear: number; rpm: number; ratio: number } {
    const e = this.engine; const ev = e.whine >= 1;
    // simulated 6-speed box: ratio by speed bands
    const bands = ev ? [999] : [14, 27, 41, 56, 72, 999];
    let g = 1; while (g < bands.length && speed > bands[g - 1]) g++;
    const lo = g === 1 ? 0 : bands[g - 2], hi = bands[g - 1] > 900 ? lo + 40 : bands[g - 1];
    const ratio = Math.max(0, Math.min(1, (speed - lo) / (hi - lo)));
    const target = ev ? 1500 + speed * 150 : 1800 + ratio * (e.max - 2300) + throttle * 400;
    this.rpm += (target - this.rpm) * Math.min(1, dt * 9);
    if (g !== this.gear && !ev) { this.shift(); this.gear = g; this.rpm *= 0.78; }
    if (!this.ctx || !this.osc1) return { gear: g, rpm: this.rpm, ratio: this.rpm / e.max };
    const t = this.ctx.currentTime;
    const hz = Math.max(18, (this.rpm / 60) * (e.cyl / 2) * (e.base / 50 > 1.5 ? 0.6 : 1));
    const f = ev ? 60 + speed * 11 : hz;
    this.osc1.frequency.setTargetAtTime(f, t, 0.03); this.osc2!.frequency.setTargetAtTime(f * (ev ? 2.01 : 1.005), t, 0.03); this.sub!.frequency.setTargetAtTime(f * 0.5, t, 0.03);
    this.eFilter!.frequency.setTargetAtTime(500 + this.rpm * 0.4 + throttle * 900, t, 0.05);
    this.eGain!.gain.setTargetAtTime(airborne ? 0.12 : 0.1 + 0.22 * throttle, t, 0.05);
    this.whine!.frequency.setTargetAtTime(500 + speed * (ev ? 70 : 40), t, 0.05);
    this.whineG!.gain.setTargetAtTime(e.whine > 0 ? Math.min(0.06, e.whine * 0.02 + throttle * 0.03 * e.whine) : 0, t, 0.08);
    this.skidG!.gain.setTargetAtTime(airborne ? 0 : Math.max(0, slip - 0.35) * 0.55, t, 0.04);
    this.skidF!.frequency.setTargetAtTime(900 + slip * 500, t, 0.05);
    this.windG!.gain.setTargetAtTime(Math.min(0.5, (speed / 90) ** 2 * 0.5), t, 0.1); this.windF!.frequency.setTargetAtTime(300 + speed * 22, t, 0.1);
    const rough = [0.5, 1.2, 1.5, 0.15, 1.3, 0.7][surface] ?? 0.5;
    this.roadG!.gain.setTargetAtTime(airborne ? 0 : Math.min(0.3, speed / 100 * 0.2 * rough), t, 0.08); this.roadF!.frequency.setTargetAtTime(150 + speed * 6, t, 0.1);
    return { gear: g, rpm: this.rpm, ratio: this.rpm / e.max };
  }

  // ---- one-shots ---------------------------------------------------------------------------------------------------
  private tone(freq: number, dur: number, type: OscillatorType, vol: number, dest: GainNode, delay = 0, slideTo?: number) {
    if (!this.ctx) return; const c = this.ctx; const t = c.currentTime + delay;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest); o.start(t); o.stop(t + dur + 0.05);
  }
  private burst(dur: number, freq: number, q: number, vol: number, dest: GainNode, delay = 0, sweepTo?: number) {
    if (!this.ctx) return; const c = this.ctx; const t = c.currentTime + delay;
    const n = this.noise(false); const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q; f.frequency.setValueAtTime(freq, t); if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); n.connect(f).connect(g).connect(dest); n.start(t, Math.random()); n.stop(t + dur + 0.05);
  }
  shift() { this.burst(0.06, 2400, 2, 0.12, this.engineBus); }
  click() { this.tone(1800, 0.04, 'square', 0.05, this.ui); }
  hover() { this.tone(1200, 0.025, 'sine', 0.025, this.ui); }
  back() { this.tone(500, 0.07, 'triangle', 0.06, this.ui, 0, 300); }
  checkpoint() { this.tone(880, 0.12, 'triangle', 0.14, this.env); this.tone(1320, 0.18, 'triangle', 0.14, this.env, 0.08); }
  beep(go = false) { this.tone(go ? 1320 : 660, go ? 0.5 : 0.16, 'square', 0.12, this.env); }
  finish() { [660, 880, 1100, 1320].forEach((f, i) => this.tone(f, 0.35, 'triangle', 0.14, this.env, i * 0.09)); this.tone(1760, 0.7, 'sine', 0.1, this.env, 0.4); }
  unlock() { [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.12, this.ui, i * 0.07)); }
  purchase() { this.tone(988, 0.08, 'square', 0.07, this.ui); this.tone(1480, 0.2, 'triangle', 0.1, this.ui, 0.07); }
  denied() { this.tone(180, 0.2, 'sawtooth', 0.08, this.ui, 0, 120); }
  boost() { this.burst(0.5, 400, 1.5, 0.22, this.env, 0, 3200); }
  land(impact: number) { const v = Math.min(0.6, impact / 25); this.burst(0.18, 120, 1, v, this.env); this.tone(70, 0.2, 'sine', v, this.env, 0, 40); }
  hit(impact: number) { const v = Math.min(0.6, impact / 18); this.burst(0.25, 900, 0.7, v, this.env); this.tone(110, 0.15, 'sawtooth', v * 0.5, this.env, 0, 60); }
  respawn() { this.burst(0.35, 1600, 1, 0.12, this.env, 0, 300); }

  // ---- generative music (original) ------------------------------------------------------------------------------------
  startMusic(mood: 'menu' | 'race') {
    if (!this.ctx) return; this.musicMood = mood; if (this.musicOn) return; this.musicOn = true; this.musicStep = 0;
    const tempo = () => (this.musicMood === 'race' ? 136 : 104);
    const bass = [0, 0, 7, 0, 5, 0, 3, 5], lead = [12, 15, 19, 15, 14, 12, 10, 12];
    const tick = () => {
      if (!this.musicOn || !this.ctx) return; const c = this.ctx; const step = this.musicStep++; const s16 = 60 / tempo() / 4;
      const root = [43, 41, 38, 41][Math.floor(step / 32) % 4]; const f = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
      const t0 = 0;
      if (step % 2 === 0) { const n = root + bass[(step / 2) % 8]; this.tone(f(n), s16 * 1.8, 'sawtooth', this.musicMood === 'race' ? 0.16 : 0.12, this.music, t0, f(n) * 0.98); }
      if (step % 4 === 0) this.tone(55, 0.22, 'sine', 0.5, this.music, t0, 38);
      if (step % 4 === 2) this.burst(0.05, 7000, 1, 0.1, this.music);
      if (step % 8 === 4) this.burst(0.16, 1800, 1, 0.12, this.music);
      if (this.musicMood === 'race' && step % 2 === 1 && step % 16 > 7) this.tone(f(root + 24 + lead[(step >> 1) % 8]), s16 * 1.4, 'square', 0.04, this.music);
      if (step % 32 === 0) { for (const iv of [0, 3, 7]) this.tone(f(root + 24 + iv), s16 * 30, 'triangle', 0.03, this.music); }
      this.musicTimer = setTimeout(tick, s16 * 1000);
    };
    tick();
  }
  stopMusic() { this.musicOn = false; clearTimeout(this.musicTimer); }
}
export const audio = new AudioSys();
