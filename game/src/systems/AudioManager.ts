import type { Atmosphere, SurfaceType } from '../data/types';

/**
 * Procedural audio: every sound is synthesised with WebAudio, so there are no asset files to license
 * and each course's ambience is generated from its Atmosphere profile.
 */
export class AudioManager {
  private ctx: AudioContext | null = null;
  private sfx!: GainNode;
  private amb!: GainNode;
  private white!: AudioBuffer;
  private brown!: AudioBuffer;
  private rollGain?: GainNode;
  private rollFilter?: BiquadFilterNode;
  private ambNodes: AudioNode[] = [];
  private ambTimers: number[] = [];
  private sfxLevel = 0.8;
  private ambLevel = 0.6;

  /** Must be called from a user gesture (browser autoplay policy). */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const master = this.ctx.createDynamicsCompressor();
    master.connect(this.ctx.destination);
    this.sfx = this.ctx.createGain();
    this.amb = this.ctx.createGain();
    this.sfx.gain.value = this.sfxLevel;
    this.amb.gain.value = this.ambLevel;
    this.sfx.connect(master);
    this.amb.connect(master);
    this.white = this.noise('white');
    this.brown = this.noise('brown');
    this.startRoll();
    if (this.pendingAtmosphere) this.setAtmosphere(this.pendingAtmosphere);
  }

  setLevels(sfx: number, amb: number): void {
    this.sfxLevel = sfx;
    this.ambLevel = amb;
    if (this.ctx) {
      this.sfx.gain.value = sfx;
      this.amb.gain.value = amb;
    }
  }

  private noise(kind: 'white' | 'brown'): AudioBuffer {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'white') d[i] = w;
      else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
    return buf;
  }

  private src(buf: AudioBuffer, loop = false): AudioBufferSourceNode {
    const s = this.ctx!.createBufferSource();
    s.buffer = buf;
    s.loop = loop;
    return s;
  }

  private env(g: GainNode, t: number, peak: number, attack: number, decay: number): void {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }

  private burst(opts: { type: BiquadFilterType; freq: number; q?: number; peak: number; attack?: number; decay: number; at?: number; sweepTo?: number; buf?: AudioBuffer }): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + (opts.at ?? 0);
    const s = this.src(opts.buf ?? this.white);
    const f = this.ctx.createBiquadFilter();
    f.type = opts.type;
    f.frequency.setValueAtTime(opts.freq, t);
    if (opts.sweepTo) f.frequency.exponentialRampToValueAtTime(opts.sweepTo, t + (opts.attack ?? 0.005) + opts.decay);
    f.Q.value = opts.q ?? 1;
    const g = this.ctx.createGain();
    this.env(g, t, opts.peak, opts.attack ?? 0.004, opts.decay);
    s.connect(f).connect(g).connect(this.sfx);
    s.start(t, Math.random() * 2);
    s.stop(t + (opts.attack ?? 0.005) + opts.decay + 0.05);
  }

  private tone(freq: number, peak: number, decay: number, at = 0, type: OscillatorType = 'sine', glideTo?: number, dest?: AudioNode): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + at;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + decay);
    const g = this.ctx.createGain();
    this.env(g, t, peak, 0.003, decay);
    o.connect(g).connect(dest ?? this.sfx);
    o.start(t);
    o.stop(t + decay + 0.05);
  }

  /* ---------------------------------------------------------------- sfx */

  putt(power: number): void {
    const p = 0.35 + power * 0.65;
    this.burst({ type: 'bandpass', freq: 3200, q: 1.5, peak: 0.55 * p, decay: 0.045 });
    this.tone(1250, 0.22 * p, 0.09);
    this.tone(2480, 0.06 * p, 0.05);
  }

  wall(speed: number, kind: string): void {
    const p = Math.min(1, speed / 10);
    if (kind === 'rail') {
      this.burst({ type: 'lowpass', freq: 520, peak: 0.5 * p + 0.05, decay: 0.09, buf: this.brown });
      this.burst({ type: 'bandpass', freq: 2400, q: 2, peak: 0.12 * p, decay: 0.05 });
    } else {
      this.tone(760 + Math.random() * 120, 0.28 * p + 0.04, 0.07, 0, 'triangle');
      this.burst({ type: 'highpass', freq: 2500, peak: 0.2 * p, decay: 0.03 });
    }
  }

  cup(): void {
    this.tone(980, 0.2, 0.06, 0, 'triangle');
    this.tone(860, 0.17, 0.06, 0.08, 'triangle');
    this.tone(720, 0.14, 0.05, 0.14, 'triangle');
    this.burst({ type: 'lowpass', freq: 260, peak: 0.6, decay: 0.18, at: 0.16, buf: this.brown });
  }

  splash(): void {
    this.burst({ type: 'lowpass', freq: 3000, sweepTo: 250, peak: 0.7, attack: 0.01, decay: 0.55 });
    for (let i = 0; i < 5; i++) this.tone(380 + Math.random() * 500, 0.06, 0.08, 0.15 + i * 0.07, 'sine', 900 + Math.random() * 600);
    this.crowdGroan();
  }

  sand(): void {
    this.burst({ type: 'bandpass', freq: 3800, q: 0.7, peak: 0.25, decay: 0.16 });
  }

  lip(): void {
    this.tone(1100, 0.15, 0.05, 0, 'triangle');
    this.tone(900, 0.1, 0.05, 0.05, 'triangle');
    this.crowdGroan();
  }

  ui(): void {
    this.tone(1800, 0.06, 0.03, 0, 'triangle');
  }

  whoosh(): void {
    this.burst({ type: 'bandpass', freq: 500, sweepTo: 2200, q: 1.2, peak: 0.18, attack: 0.25, decay: 0.35 });
  }

  crowdGroan(): void {
    this.burst({ type: 'bandpass', freq: 520, sweepTo: 300, q: 2.5, peak: 0.18, attack: 0.2, decay: 0.9, buf: this.brown, at: 0.1 });
  }

  cheer(size: number): void {
    if (!this.ctx) return;
    // roar
    this.burst({ type: 'bandpass', freq: 900, q: 0.8, peak: 0.28 * size, attack: 0.25, decay: 1.8 + size, at: 0.05 });
    this.burst({ type: 'bandpass', freq: 1800, q: 1, peak: 0.12 * size, attack: 0.2, decay: 1.4 + size });
    // applause: many tiny claps
    const n = Math.floor(40 + size * 80);
    for (let i = 0; i < n; i++) {
      this.burst({ type: 'bandpass', freq: 1400 + Math.random() * 2400, q: 2, peak: 0.05 + Math.random() * 0.05, decay: 0.03, at: 0.15 + Math.random() * (1.5 + size * 1.5) });
    }
    // whistle for aces
    if (size > 1.2) this.tone(2200, 0.05, 0.5, 0.4, 'sine', 3100);
  }

  /* ---------------------------------------------------------------- rolling */

  private startRoll(): void {
    const ctx = this.ctx!;
    const s = this.src(this.brown, true);
    this.rollFilter = ctx.createBiquadFilter();
    this.rollFilter.type = 'lowpass';
    this.rollFilter.frequency.value = 800;
    this.rollGain = ctx.createGain();
    this.rollGain.gain.value = 0;
    s.connect(this.rollFilter).connect(this.rollGain).connect(this.sfx);
    s.start();
  }

  setRoll(speed: number, surface: SurfaceType | null): void {
    if (!this.ctx || !this.rollGain || !this.rollFilter) return;
    const t = this.ctx.currentTime;
    const on = surface && surface !== 'water' ? Math.min(1, speed / 12) : 0;
    const freq: Partial<Record<SurfaceType, number>> = { green: 1100, fringe: 800, fairway: 750, tee: 750, rough: 380, deepRough: 300, bunker: 2600, bridge: 520, path: 1400, pinestraw: 600, rock: 1600 };
    const gainScale: Partial<Record<SurfaceType, number>> = { bunker: 0.4, bridge: 1.5, path: 1.2, rough: 0.8 };
    this.rollFilter.frequency.setTargetAtTime((surface && freq[surface]) || 800, t, 0.05);
    this.rollGain.gain.setTargetAtTime(on * 0.55 * ((surface && gainScale[surface]) || 1), t, 0.05);
  }

  /* ---------------------------------------------------------------- ambience */

  private pendingAtmosphere: Atmosphere | null = null;

  setAtmosphere(a: Atmosphere): void {
    this.pendingAtmosphere = a;
    if (!this.ctx) return;
    const ctx = this.ctx;
    this.ambNodes.forEach((n) => {
      try {
        (n as AudioScheduledSourceNode).stop?.();
      } catch {
        /* already stopped */
      }
      n.disconnect();
    });
    this.ambTimers.forEach((t) => clearTimeout(t));
    this.ambNodes = [];
    this.ambTimers = [];

    const loop = (buf: AudioBuffer, type: BiquadFilterType, freq: number, gain: number, lfoRate = 0, lfoDepth = 0, q = 1) => {
      if (gain <= 0) return;
      const s = this.src(buf, true);
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = gain;
      s.connect(f).connect(g).connect(this.amb);
      s.start(0, Math.random() * 2);
      this.ambNodes.push(s, f, g);
      if (lfoRate) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = lfoRate;
        const lg = ctx.createGain();
        lg.gain.value = gain * lfoDepth;
        lfo.connect(lg).connect(g.gain);
        lfo.start();
        this.ambNodes.push(lfo, lg);
      }
    };
    loop(this.white, 'bandpass', 520, a.wind * 0.05, 0.13, 0.8, 0.6);
    loop(this.brown, 'lowpass', 420, a.crowd * 0.06, 0.07, 0.4);
    loop(this.white, 'bandpass', 3200, a.water * 0.022, 3.1, 0.6, 0.9);
    loop(this.brown, 'lowpass', 600, a.ocean * 0.3, 0.14, 0.9);

    const birds = () => {
      if (!this.ctx) return;
      const base = 2400 + Math.random() * 2400;
      const n = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        this.tone(base, 0.022 * a.birds, 0.07, i * 0.11, 'sine', base * (1.3 + Math.random() * 0.5), this.amb);
      }
      this.ambTimers.push(window.setTimeout(birds, (1500 + Math.random() * 4500) / Math.max(0.2, a.birds)));
    };
    if (a.birds > 0) birds();
    const murmur = () => {
      if (!this.ctx) return;
      this.burst({ type: 'bandpass', freq: 300 + Math.random() * 300, q: 3, peak: 0.02 * a.crowd, attack: 0.3, decay: 0.8, buf: this.brown });
      this.ambTimers.push(window.setTimeout(murmur, 2000 + Math.random() * 5000));
    };
    if (a.crowd > 0) murmur();
  }

  hapticsEnabled = true;

  haptic(ms: number): void {
    if (!this.hapticsEnabled) return;
    try {
      navigator.vibrate?.(ms);
    } catch {
      /* unsupported */
    }
  }
}
