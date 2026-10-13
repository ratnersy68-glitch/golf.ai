// Procedural audio: ambience (wind, birds, gulls, surf, leaves, crowd murmur)
// and shot/reaction sound effects, all synthesized with WebAudio.

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.vol = { master: 0.8, sfx: 0.9, amb: 0.6 };
    this.timers = [];
  }

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { this.enabled = false; return; }
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = this.vol.master; this.master.connect(c.destination);
    this.sfx = c.createGain(); this.sfx.gain.value = this.vol.sfx; this.sfx.connect(this.master);
    this.amb = c.createGain(); this.amb.gain.value = this.vol.amb; this.amb.connect(this.master);
    this.white = this.makeNoise('white');
    this.brown = this.makeNoise('brown');
    this.pink = this.makeNoise('pink');
  }

  setVolumes(v) {
    Object.assign(this.vol, v);
    if (!this.ctx) return;
    this.master.gain.value = this.vol.master;
    this.sfx.gain.value = this.vol.sfx;
    this.amb.gain.value = this.vol.amb;
  }

  makeNoise(type) {
    const c = this.ctx, len = c.sampleRate * 3;
    const b = c.createBuffer(1, len, c.sampleRate);
    const d = b.getChannelData(0);
    let last = 0, b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (type === 'white') d[i] = w;
      else if (type === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else { b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0527; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2; }
    }
    return b;
  }

  noiseSrc(buf, loop = true) {
    const s = this.ctx.createBufferSource();
    s.buffer = buf; s.loop = loop;
    s.loopStart = Math.random() * 2;
    return s;
  }

  // ---------- ambience ----------
  startAmbience(theme, windMph, hasWater) {
    if (!this.ctx) return;
    this.stopAmbience();
    const c = this.ctx, now = c.currentTime;
    const nodes = this.ambNodes = [];
    // wind
    const wind = this.noiseSrc(this.brown);
    const wf = c.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 380 + windMph * 25;
    const wg = c.createGain(); wg.gain.value = 0.05 + Math.min(0.35, windMph * 0.018);
    const lfo = c.createOscillator(); lfo.frequency.value = 0.13;
    const lfoG = c.createGain(); lfoG.gain.value = wg.gain.value * 0.6;
    lfo.connect(lfoG); lfoG.connect(wg.gain);
    wind.connect(wf); wf.connect(wg); wg.connect(this.amb);
    wind.start(); lfo.start();
    nodes.push(wind, lfo);
    // leaves rustle
    if (!theme.links) {
      const lv = this.noiseSrc(this.white);
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4200; bp.Q.value = 0.7;
      const lg = c.createGain(); lg.gain.value = 0.012 + windMph * 0.0012;
      const l2 = c.createOscillator(); l2.frequency.value = 0.21;
      const l2g = c.createGain(); l2g.gain.value = lg.gain.value * 0.9;
      l2.connect(l2g); l2g.connect(lg.gain);
      lv.connect(bp); bp.connect(lg); lg.connect(this.amb);
      lv.start(); l2.start();
      nodes.push(lv, l2);
    }
    // surf / water
    if (theme.seaLevel !== undefined || hasWater) {
      const surf = this.noiseSrc(this.pink);
      const sf = c.createBiquadFilter(); sf.type = 'lowpass'; sf.frequency.value = theme.seaLevel !== undefined ? 900 : 1600;
      const sg = c.createGain(); sg.gain.value = theme.seaLevel !== undefined ? 0.12 : 0.025;
      const sl = c.createOscillator(); sl.frequency.value = theme.seaLevel !== undefined ? 0.09 : 0.3;
      const slg = c.createGain(); slg.gain.value = sg.gain.value * 0.85;
      sl.connect(slg); slg.connect(sg.gain);
      surf.connect(sf); sf.connect(sg); sg.connect(this.amb);
      surf.start(); sl.start();
      nodes.push(surf, sl);
    }
    // crowd murmur
    if (theme.crowd) {
      const cr = this.noiseSrc(this.pink);
      const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 520; f1.Q.value = 1.2;
      const cg = c.createGain(); cg.gain.value = 0.018 * theme.crowd;
      cr.connect(f1); f1.connect(cg); cg.connect(this.amb);
      cr.start();
      nodes.push(cr);
      this.crowdGain = cg;
    }
    // birds
    const birdLoop = () => {
      if (!this.ambNodes) return;
      if (theme.birds === 'gull') this.gull(); else this.songbird();
      this.timers.push(setTimeout(birdLoop, 1500 + Math.random() * (theme.birds === 'gull' ? 7000 : 3500)));
    };
    this.timers.push(setTimeout(birdLoop, 800));
  }

  stopAmbience() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    if (this.ambNodes) this.ambNodes.forEach(n => { try { n.stop(); } catch (e) { /* noop */ } });
    this.ambNodes = null;
  }

  songbird() {
    const c = this.ctx, t0 = c.currentTime;
    const notes = 2 + Math.floor(Math.random() * 5);
    const base = 2600 + Math.random() * 2200;
    const pan = c.createStereoPanner ? c.createStereoPanner() : null;
    if (pan) { pan.pan.value = Math.random() * 1.6 - 0.8; pan.connect(this.amb); }
    for (let i = 0; i < notes; i++) {
      const o = c.createOscillator(); o.type = 'sine';
      const g = c.createGain();
      const t = t0 + i * (0.09 + Math.random() * 0.05);
      const f = base * (0.85 + Math.random() * 0.4);
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * (Math.random() < 0.5 ? 1.35 : 0.7), t + 0.07);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.03, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.09);
      o.connect(g); g.connect(pan || this.amb);
      o.start(t); o.stop(t + 0.12);
    }
  }

  gull() {
    const c = this.ctx, t0 = c.currentTime;
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const t = t0 + i * 0.35;
      const o = c.createOscillator(); o.type = 'sawtooth';
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 3;
      const g = c.createGain();
      o.frequency.setValueAtTime(1300, t);
      o.frequency.linearRampToValueAtTime(1700, t + 0.08);
      o.frequency.linearRampToValueAtTime(1000, t + 0.3);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.02, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.32);
      o.connect(f); f.connect(g); g.connect(this.amb);
      o.start(t); o.stop(t + 0.35);
    }
  }

  // ---------- shot sounds ----------
  env(node, t, a, peak, d) {
    node.gain.setValueAtTime(0.0001, t);
    node.gain.linearRampToValueAtTime(peak, t + a);
    node.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  whoosh(power = 1) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const s = this.noiseSrc(this.white, false);
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.5;
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(2500 * (0.6 + power * 0.5), t + 0.18);
    const g = c.createGain();
    this.env(g, t, 0.12, 0.25 * power, 0.12);
    s.connect(f); f.connect(g); g.connect(this.sfx);
    s.start(t); s.stop(t + 0.35);
  }

  impact(cat, quality = 1, power = 1) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    // click transient
    const s = this.noiseSrc(this.white, false);
    const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = cat === 'wood' ? 1800 : 3000;
    const g = c.createGain();
    this.env(g, t, 0.001, (cat === 'putter' ? 0.25 : 0.7) * (0.6 + power * 0.4), cat === 'wood' ? 0.07 : 0.04);
    s.connect(hp); hp.connect(g); g.connect(this.sfx);
    s.start(t); s.stop(t + 0.15);
    // body resonance
    const o = c.createOscillator();
    o.type = cat === 'wood' ? 'triangle' : 'sine';
    const fr = cat === 'wood' ? 1450 : cat === 'putter' ? 1100 : cat === 'hybrid' ? 1900 : 2600;
    o.frequency.setValueAtTime(fr * (0.9 + quality * 0.15), t);
    o.frequency.exponentialRampToValueAtTime(fr * 0.7, t + 0.12);
    const og = c.createGain();
    this.env(og, t, 0.001, (cat === 'putter' ? 0.12 : 0.28) * quality, cat === 'wood' ? 0.22 : 0.1);
    o.connect(og); og.connect(this.sfx);
    o.start(t); o.stop(t + 0.3);
    if (quality < 0.8 && cat !== 'putter') {
      // thin/clunky strike
      const o2 = c.createOscillator(); o2.type = 'square'; o2.frequency.value = 180;
      const g2 = c.createGain(); this.env(g2, t, 0.001, 0.08, 0.08);
      o2.connect(g2); g2.connect(this.sfx); o2.start(t); o2.stop(t + 0.1);
    }
    if (cat !== 'putter' && power > 0.4) {
      // divot / turf thump for irons
      if (cat === 'iron' || cat === 'wedge') {
        const n = this.noiseSrc(this.brown, false);
        const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
        const ng = c.createGain(); this.env(ng, t + 0.01, 0.005, 0.35, 0.12);
        n.connect(lp); lp.connect(ng); ng.connect(this.sfx); n.start(t); n.stop(t + 0.2);
      }
    }
  }

  land(surf, speed = 10) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const vol = Math.min(0.5, 0.05 + speed * 0.012);
    const s = this.noiseSrc(surf === 'sand' ? this.white : this.brown, false);
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = surf === 'sand' ? 1500 : surf === 'path' ? 3000 : 700;
    const g = c.createGain();
    this.env(g, t, 0.002, vol, surf === 'sand' ? 0.2 : 0.08);
    s.connect(f); f.connect(g); g.connect(this.sfx);
    s.start(t); s.stop(t + 0.3);
  }

  rollStart() {
    if (!this.ctx || this.rollNode) return;
    const c = this.ctx;
    const s = this.noiseSrc(this.pink);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
    const g = c.createGain(); g.gain.value = 0;
    s.connect(f); f.connect(g); g.connect(this.sfx);
    s.start();
    this.rollNode = { s, g, f };
  }
  rollUpdate(speed, green) {
    if (!this.rollNode) return;
    const t = this.ctx.currentTime;
    this.rollNode.g.gain.setTargetAtTime(Math.min(0.12, speed * (green ? 0.03 : 0.015)), t, 0.05);
    this.rollNode.f.frequency.setTargetAtTime(green ? 900 : 450, t, 0.1);
  }
  rollStop() {
    if (!this.rollNode) return;
    const n = this.rollNode; this.rollNode = null;
    n.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    setTimeout(() => { try { n.s.stop(); } catch (e) { /* noop */ } }, 300);
  }

  cup() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    [0, 0.07, 0.13].forEach((d, i) => {
      const o = c.createOscillator(); o.type = 'triangle';
      o.frequency.value = [520, 440, 380][i];
      const g = c.createGain(); this.env(g, t + d, 0.001, 0.3 - i * 0.07, 0.12);
      o.connect(g); g.connect(this.sfx); o.start(t + d); o.stop(t + d + 0.2);
    });
  }

  splash() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const s = this.noiseSrc(this.white, false);
    const f = c.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(3500, t); f.frequency.exponentialRampToValueAtTime(300, t + 0.6);
    const g = c.createGain(); this.env(g, t, 0.01, 0.5, 0.6);
    s.connect(f); f.connect(g); g.connect(this.sfx); s.start(t); s.stop(t + 0.8);
    const o = c.createOscillator(); o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(200, t + 0.15);
    const og = c.createGain(); this.env(og, t, 0.005, 0.15, 0.15);
    o.connect(og); og.connect(this.sfx); o.start(t); o.stop(t + 0.2);
  }

  leaves() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const s = this.noiseSrc(this.white, false);
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 0.8;
    const g = c.createGain(); this.env(g, t, 0.02, 0.35, 0.4);
    s.connect(f); f.connect(g); g.connect(this.sfx); s.start(t); s.stop(t + 0.5);
  }
  knock() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.1);
    const g = c.createGain(); this.env(g, t, 0.001, 0.4, 0.12);
    o.connect(g); g.connect(this.sfx); o.start(t); o.stop(t + 0.2);
  }

  // crowd reactions: kind = cheer | roar | groan | applause | ooh
  crowd(kind, intensity = 1) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const dur = kind === 'roar' ? 4.5 : kind === 'applause' ? 3 : kind === 'groan' || kind === 'ooh' ? 1.4 : 2.8;
    const s = this.noiseSrc(this.pink, false);
    const f1 = c.createBiquadFilter(); f1.type = 'bandpass';
    f1.frequency.value = kind === 'applause' ? 2500 : kind === 'groan' ? 350 : 800; f1.Q.value = kind === 'applause' ? 0.6 : 1.1;
    const g = c.createGain();
    const peak = 0.3 * intensity * (kind === 'roar' ? 1.4 : 1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + (kind === 'roar' ? 0.25 : 0.12));
    g.gain.setTargetAtTime(peak * 0.6, t + 0.6, 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    if (kind === 'groan' || kind === 'ooh') {
      f1.frequency.setValueAtTime(kind === 'ooh' ? 500 : 420, t);
      f1.frequency.linearRampToValueAtTime(kind === 'ooh' ? 700 : 260, t + dur);
    }
    s.connect(f1); f1.connect(g); g.connect(this.sfx);
    s.start(t); s.stop(t + dur + 0.1);
    if (kind === 'applause' || kind === 'cheer' || kind === 'roar') {
      // clap texture: amplitude-modulated noise
      const s2 = this.noiseSrc(this.white, false);
      const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1500;
      const g2 = c.createGain(); g2.gain.value = 0;
      const lfo = c.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 13;
      const lg = c.createGain(); lg.gain.value = 0.06 * intensity;
      lfo.connect(lg); lg.connect(g2.gain);
      const ge = c.createGain(); this.env(ge, t + 0.2, 0.2, 1, dur);
      s2.connect(hp); hp.connect(g2); g2.connect(ge); ge.connect(this.sfx);
      s2.start(t); lfo.start(t); s2.stop(t + dur + 0.3); lfo.stop(t + dur + 0.3);
    }
  }

  jingle(kind) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const seqs = {
      birdie: [[659, 0], [784, 0.1], [988, 0.2], [1319, 0.32]],
      eagle: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3], [1319, 0.45], [1568, 0.6]],
      ace: [[523, 0], [659, 0.08], [784, 0.16], [1047, 0.24], [784, 0.4], [1047, 0.48], [1319, 0.56], [1568, 0.7], [2093, 0.9]],
      par: [[523, 0], [659, 0.12]],
      bogey: [[392, 0], [330, 0.15]],
      great: [[784, 0], [1175, 0.1]],
      unlock: [[880, 0], [1109, 0.1], [1319, 0.2], [1760, 0.34]],
    };
    const seq = seqs[kind] || seqs.par;
    for (const [f, d] of seq) {
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
      const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
      const g = c.createGain(); this.env(g, t + d, 0.01, 0.12, 0.45);
      const g2 = c.createGain(); g2.gain.value = 0.3;
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(this.sfx);
      o.start(t + d); o2.start(t + d); o.stop(t + d + 0.6); o2.stop(t + d + 0.6);
    }
  }

  click() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.frequency.value = 1400;
    const g = c.createGain(); this.env(g, t, 0.001, 0.05, 0.03);
    o.connect(g); g.connect(this.sfx); o.start(t); o.stop(t + 0.05);
  }
  tick(high) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = 'square'; o.frequency.value = high ? 1760 : 880;
    const g = c.createGain(); this.env(g, t, 0.001, 0.04, 0.04);
    o.connect(g); g.connect(this.sfx); o.start(t); o.stop(t + 0.06);
  }
}

export const audio = new AudioEngine();
