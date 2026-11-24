import * as THREE from 'three';
import { create } from 'zustand';
import { Track, DS, SURF_ASPHALT } from '../sim/track';
import { Sim, DT, TICK_RATE, EV_CP, EV_FINISH, EV_LAND, EV_WALL, EV_CRASH, EV_RESPAWN, EV_BOOST, EV_TAKEOFF, EV_OBST, VehicleParams, STANDARD } from '../sim/vehicle';
import { InputLog, quantise, toInput, packReplay, ReplayMeta, validateReplay, QInput } from '../sim/replay';
import type { TrackMeta } from '../sim/campaign-types';
import { CarModel } from './car';
import { buildWorld, World } from './world';
import { CameraRig, CAMERA_NAMES } from './cameras';
import { ParticlePool, SkidMarks } from './fx';
import { Gfx } from './gfx';
import { InputManager } from './input';
import { audio } from '../audio/audio';
import { VEHICLE_MAP, paramsFor } from '../data/vehicles';
import { COSMETIC_MAP } from '../data/cosmetics';
import type { CarSetup, Settings } from './types';
import type { RaceSpec } from './store';

export interface GhostSrc { kind: string; label: string; log: InputLog; ms: number; color?: string }
export interface HudState {
  phase: 'countdown' | 'racing' | 'finished' | 'paused' | 'dead'; countdown: number; timeMs: number; speed: number; gear: number; rpm: number; cp: number; cpTotal: number; progress: number;
  delta: number | null; deltaLabel: string; pbMs: number | null; benchMs: number | null; steer: number; thr: number; brk: number; camera: string; fps: number; respawns: number; crashes: number;
  stunt?: { score: number; combo: string; air: number }; endless?: { dist: number }; split?: { label: string; ms: number } | null; free: boolean; mini: { x: number; y: number; gx?: number; gy?: number } | null;
  ghostName: string | null; message: string | null; replay?: { tick: number; total: number; speed: number; playing: boolean }; boosting: boolean; airborne: boolean; time: number;
}
export const useHud = create<HudState>(() => ({
  phase: 'countdown', countdown: 3, timeMs: 0, speed: 0, gear: 1, rpm: 0, cp: 0, cpTotal: 0, progress: 0, delta: null, deltaLabel: '', pbMs: null, benchMs: null, steer: 0, thr: 0, brk: 0, camera: 'Chase',
  fps: 60, respawns: 0, crashes: 0, free: false, mini: null, ghostName: null, message: null, boosting: false, airborne: false, time: 0,
}));

export interface RaceInit {
  gfx: Gfx; input: InputManager; settings: Settings; spec: RaceSpec; track: Track; meta: TrackMeta; vehicle: string; standard: boolean; setup: CarSetup;
  ghosts: GhostSrc[]; ghostKind: string; pbMs: number | null; free?: boolean; replay?: { log: InputLog; ms: number; params: VehicleParams; setup: CarSetup; vehicle: string };
  onFinish?: (r: FinishInfo) => void; onRestart?: () => void; onExit?: () => void; onTab?: () => void; onPause?: (p: boolean) => void;
}
export interface FinishInfo { ms: number; crashes: number; respawns: number; topMps: number; distanceM: number; longestJump: number; airMs: number; driveMs: number; log: InputLog; replay: ReplayMeta | null; valid: boolean; stunt?: number; endless?: number }

function timeProfile(track: Track, log: InputLog, params: VehicleParams): { t: Float32Array; ms: number } {
  const sim = new Sim(track, params); const t = new Float32Array(track.n).fill(-1); let filled = 0;
  for (let i = 0; i < log.length && !sim.finished; i++) {
    sim.step(toInput(log.at(i)));
    const idx = Math.min(track.n - 1, Math.floor(sim.air ? sim.hint : sim.s / DS));
    const now = (i + 1) * DT * 1000;
    while (filled <= idx) { t[filled++] = now; }
  }
  while (filled < track.n) t[filled++] = sim.finished ? sim.finishMs : (log.length * DT * 1000);
  return { t, ms: sim.finishMs };
}

interface PoseS { x: number; y: number; z: number; fx: number; fy: number; fz: number; ux: number; uy: number; uz: number }
const mkPose = (): PoseS => ({ x: 0, y: 0, z: 0, fx: 0, fy: 0, fz: -1, ux: 0, uy: 1, uz: 0 });

export class RaceSession {
  gfx: Gfx; track: Track; meta: TrackMeta; world!: World; car!: CarModel; ghostCar?: CarModel; ghostSim?: Sim; ghostLog?: InputLog; ghostProf?: { t: Float32Array; ms: number };
  sim!: Sim; params: VehicleParams; log = new InputLog(); rig = new CameraRig();
  smoke!: ParticlePool; glow!: ParticlePool; skid!: SkidMarks;
  phase: HudState['phase'] = 'countdown'; countdown = 3.2; acc = 0; time = 0; prev = mkPose(); cur = mkPose(); gprev = mkPose(); gcur = mkPose();
  raf = 0; lastNow = 0; fps = 60; hudAcc = 0; running = false; pausedAt = 0;
  init: RaceInit; setup: CarSetup;
  lastLog: InputLog | null = null; // previous attempt (for "previous attempt" ghost)
  splitMsg: { label: string; ms: number; until: number } | null = null; message: string | null = null; messageUntil = 0;
  finishInfo: FinishInfo | null = null; finishT = 0; finishPose = mkPose(); finishSpeed = 0;
  ghostOn = true; ghostIdx = 0; ghostList: GhostSrc[];
  // stunt
  stuntScore = 0; stuntCombo = ''; airT = 0; airRot = 0; flips = 0; stuntT = 90; driftT = 0; lastF = new THREE.Vector3(); lastU = new THREE.Vector3(); stuntBest = 0;
  endlessDist = 0;
  // replay viewer
  rp?: { log: InputLog; ms: number; tick: number; speed: number; playing: boolean; snaps: Map<number, Sim> };
  attempts = 0; driveMs = 0; airMs = 0; boosting = false;
  tmpV = new THREE.Vector3(); tmpV2 = new THREE.Vector3(); tmpQ = new THREE.Quaternion(); tmpM = new THREE.Matrix4(); tmpV3 = new THREE.Vector3();
  steerVis = 0; thrVis = 0; brkVis = 0; engineOn = false; lastGear = 1;
  fxCfg = { trail: { c1: '#00E5FF', c2: '#2D6BFF', style: 'ribbon' }, flame: { c1: '#4DA6FF', c2: '#BFE4FF' }, smoke: '#F5F7FA' };
  miniPath: { x: number; y: number }[] = []; miniB = { minX: 0, maxX: 1, minZ: 0, maxZ: 1 };
  cpFlash = 0; stopped = false; spawnT = 0; entered = false;
  fixedAcc = 0; autoCamCooldown = 0;
  cineT = 0; victoryT = 0;

  constructor(init: RaceInit) {
    this.init = init; this.gfx = init.gfx; this.track = init.track; this.meta = init.meta; this.setup = init.setup;
    this.params = init.replay ? init.replay.params : init.standard ? STANDARD : paramsFor(init.vehicle);
    this.ghostList = init.ghosts;
  }

  enter() {
    const { gfx, init, settings } = this as any as { gfx: Gfx; init: RaceInit; settings: Settings }; const st = init.settings;
    this.cleanupScene();
    gfx.setEnv(this.track.def.env);
    this.world = buildWorld(this.track, this.track.def.env, { particles: st.particles, distance: st.drawDistance });
    gfx.scene.add(this.world.group);
    const setup = init.replay ? init.replay.setup : init.setup; this.setup = setup;
    this.car = new CarModel(setup); gfx.scene.add(this.car.group);
    this.rig.carLength = this.car.length; this.rig.carHeight = this.car.height; this.rig.reduced = st.reducedMotion; this.rig.shakeScale = st.cameraShake;
    this.rig.mode = st.camera;
    const pc = [0, 400, 900, 2000][Math.min(3, st.particles)] || 0;
    this.smoke = new ParticlePool(Math.max(1, pc), false); this.glow = new ParticlePool(Math.max(1, pc), true); this.skid = new SkidMarks(pc ? 700 : 1);
    gfx.scene.add(this.smoke.points, this.glow.points, this.skid.mesh);
    this.smoke.points.visible = this.glow.points.visible = pc > 0; this.skid.mesh.visible = pc > 0;
    const f = setup.fx;
    this.fxCfg = { trail: (COSMETIC_MAP[f.trail]?.data as any) ?? this.fxCfg.trail, flame: (COSMETIC_MAP[f.flame]?.data as any) ?? this.fxCfg.flame, smoke: COSMETIC_MAP[f.smoke]?.data.color ?? '#F5F7FA' };
    // minimap
    const tr = this.track; let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
    for (let i = 0; i < tr.n; i += 3) { minX = Math.min(minX, tr.px[i]); maxX = Math.max(maxX, tr.px[i]); minZ = Math.min(minZ, tr.pz[i]); maxZ = Math.max(maxZ, tr.pz[i]); }
    this.miniB = { minX, maxX, minZ, maxZ };
    // engine
    const v = VEHICLE_MAP[init.vehicle]; if (v) audio.startEngine(v.engine); this.engineOn = true;
    audio.startMusic('race');
    init.input.handlers = {
      restart: () => this.restart(true), checkpoint: () => this.requestRespawn(), camera: () => this.cycleCamera(), pause: () => this.togglePause(), leaderboard: () => init.onTab?.(), ghost: () => this.toggleGhost(),
    };
    this.ghostOn = st.ghost; this.pickGhost(init.ghostKind);
    if (init.replay) { this.setupReplay(); } else this.reset(true);
    this.entered = true; this.running = true; this.lastNow = performance.now();
    const loop = (now: number) => { if (!this.running) return; this.raf = requestAnimationFrame(loop); this.frame(now); };
    this.raf = requestAnimationFrame(loop);
  }

  private cleanupScene() { /* scene children are removed in exit() */ }

  exit() {
    this.running = false; cancelAnimationFrame(this.raf);
    const s = this.gfx.scene;
    for (const o of [this.world?.group, this.car?.group, this.ghostCar?.group, this.smoke?.points, this.glow?.points, this.skid?.mesh]) if (o) s.remove(o);
    this.world?.dispose(); this.car?.dispose(); this.ghostCar?.dispose(); this.smoke?.dispose(); this.glow?.dispose();
    audio.stopEngine(); audio.stopMusic();
    this.init.input.handlers = {};
  }

  // ------------------------------------------------------------------------------------------------------ setup
  setupReplay() {
    const r = this.init.replay!;
    this.rp = { log: r.log, ms: r.ms, tick: 0, speed: 1, playing: true, snaps: new Map() };
    this.sim = new Sim(this.track, this.params); this.phase = 'racing'; this.syncPoses(); this.world.setCheckpointsPassed(0);
    this.rig.mode = 0; this.rig.reset();
    // optional comparison ghost
    if (this.ghostLog) this.makeGhost();
  }

  pickGhost(kind: string) {
    let g = this.ghostList.find(x => x.kind === kind) ?? null; if (g && g.log.length === 0) g = null;
    this.ghostLog = g?.log; this.ghostIdx = Math.max(0, this.ghostList.indexOf(g as any));
    if (g) { this.ghostProf = timeProfile(this.track, g.log, STANDARD); this.makeGhost(); } else { this.ghostProf = undefined; this.removeGhost(); }
  }
  private removeGhost() { if (this.ghostCar) { this.gfx.scene.remove(this.ghostCar.group); this.ghostCar.dispose(); this.ghostCar = undefined; } this.ghostSim = undefined; }
  private makeGhost() {
    this.removeGhost(); if (!this.ghostLog) return;
    const gs: CarSetup = { ...this.setup, paint: { ...this.setup.paint, primary: '#B8BDC4', secondary: '#25282D', accent: '#FFFFFF', finish: 'finish_gloss' }, livery: { preset: 'livery_l01', layers: [], useBase: false }, lights: { ...this.setup.lights, underglow: 'underglow_none' } };
    this.ghostCar = new CarModel(gs, { ghost: true }); this.gfx.scene.add(this.ghostCar.group);
    this.ghostSim = new Sim(this.track, STANDARD); this.ghostCar.group.visible = this.ghostOn;
  }
  toggleGhost() { this.ghostOn = !this.ghostOn; if (this.ghostCar) this.ghostCar.group.visible = this.ghostOn; this.say(this.ghostOn ? 'Ghost on' : 'Ghost off'); }
  cycleGhost() { if (!this.ghostList.length) return; this.ghostIdx = (this.ghostIdx + 1) % this.ghostList.length; const g = this.ghostList[this.ghostIdx]; this.pickGhost(g.kind); this.say(`Ghost: ${g.label}`); }
  cycleCamera() { this.rig.mode = (this.rig.mode + 1) % (this.rp ? 8 : 7); this.say(`Camera: ${CAMERA_NAMES[this.rig.mode]}`); }
  say(m: string) { this.message = m; this.messageUntil = performance.now() + 1800; }

  reset(first = false) {
    this.sim = new Sim(this.track, this.params); this.log = new InputLog();
    this.phase = 'countdown'; this.countdown = first ? 3.2 : (this.init.settings.instantRestart ? 0.9 : 3.2);
    this.fixedAcc = 0; this.time = 0; this.finishInfo = null; this.driveMs = 0; this.airMs = 0;
    this.stuntScore = 0; this.stuntCombo = ''; this.stuntT = 90; this.airT = 0; this.airRot = 0; this.flips = 0; this.driftT = 0; this.endlessDist = 0;
    this.world?.setCheckpointsPassed(0); this.syncPoses(); this.rig.reset(); this.skid?.clear(); this.smoke?.clear(); this.glow?.clear();
    this.ghostSim?.reset(); this.splitMsg = null; this.spawnT = 0; this.victoryT = 0; this.steerVis = 0;
    this.lastBeep = -1;
  }
  lastBeep = -1;

  restart(note = false) {
    if (this.rp) { this.rp.tick = 0; this.sim = new Sim(this.track, this.params); this.ghostSim?.reset(); this.skid.clear(); return; }
    if (note) this.init.onRestart?.();
    if (this.log.length > 600 && this.phase !== 'finished') { this.lastLog = this.log; const pg = this.ghostList.find(k => k.kind === 'prev'); if (pg) { pg.log = this.log; pg.ms = this.log.length * DT * 1000; if (this.ghostList[this.ghostIdx]?.kind === 'prev') this.pickGhost('prev'); } }
    this.attempts++;
    this.reset();
    audio.respawn();
  }
  requestRespawn() { if (this.phase === 'racing' && !this.rp) this.pendingRespawn = true; }
  pendingRespawn = false;
  /** Test hook: feeds recorded inputs instead of the live input device (used by the browser e2e test). */
  inputOverride?: (tick: number) => QInput;

  togglePause() {
    if (this.rp) { this.rp.playing = !this.rp.playing; return; }
    if (this.phase === 'paused') { this.phase = this.pausedFrom; this.lastNow = performance.now(); this.init.onPause?.(false); return; }
    if (this.phase === 'racing' || this.phase === 'countdown') { this.pausedFrom = this.phase; this.phase = 'paused'; this.init.onPause?.(true); }
  }
  pausedFrom: HudState['phase'] = 'racing';
  resume() { if (this.phase === 'paused') this.togglePause(); }

  // ------------------------------------------------------------------------------------------------------ poses
  private writePose(sim: Sim, out: PoseS) { sim.pose(out); }
  syncPoses() { this.writePose(this.sim, this.cur); Object.assign(this.prev, this.cur); if (this.ghostSim) { this.writePose(this.ghostSim, this.gcur); Object.assign(this.gprev, this.gcur); } }

  // ------------------------------------------------------------------------------------------------------ main loop
  frame(now: number) {
    let dt = Math.min(0.1, (now - this.lastNow) / 1000); this.lastNow = now;
    if (dt <= 0) return;
    const inp = this.init.input; inp.poll(dt);
    this.fps += (1 / dt - this.fps) * 0.05;
    const st = this.init.settings;
    if (st.fpsLimit > 0 && dt < 1 / st.fpsLimit - 0.0008) { /* simple soft limiter: skip render */ }
    if (this.rp) { this.frameReplay(dt); }
    else if (this.phase === 'paused') { /* frozen */ }
    else {
      if (this.phase === 'countdown') {
        this.countdown -= dt;
        const c = Math.ceil(this.countdown);
        if (c !== this.lastBeep && c <= 3 && c >= 1) { this.lastBeep = c; audio.beep(false); }
        if (this.countdown <= 0) { this.phase = 'racing'; audio.beep(true); this.lastBeep = 0; }
        this.world.update(0);
      }
      this.fixedAcc += dt;
      let steps = 0;
      while (this.fixedAcc >= DT && steps < 12) {
        this.fixedAcc -= DT; steps++;
        Object.assign(this.prev, this.cur); Object.assign(this.gprev, this.gcur);
        if (this.phase === 'racing') this.tickRace(); else if (this.phase === 'countdown') { this.sim.step({ thr: 0, brk: 0, steer: 0, hb: 0 }); this.sim.tick = 0; }
        this.writePose(this.sim, this.cur);
        if (this.ghostSim && this.ghostLog) { const gt = this.sim.tick; this.stepGhost(gt); this.writePose(this.ghostSim, this.gcur); }
      }
      if (steps === 12) this.fixedAcc = 0;
      if (this.phase === 'finished') { this.finishT += dt; this.victoryT += dt; }
    }
    this.render(dt);
  }

  private stepGhost(tick: number) {
    const g = this.ghostSim!, log = this.ghostLog!;
    if (tick > 0 && g.tick < tick && !g.finished) { const i = g.tick; if (i < log.length) g.step(toInput(log.at(i))); else g.step({ thr: 0, brk: 1, steer: 0, hb: 0 }); }
  }

  private tickRace() {
    const inp = this.init.input; const sim = this.sim;
    const q: QInput = this.inputOverride ? this.inputOverride(this.sim.tick) : quantise({ steer: inp.steer, thr: inp.thr, brk: inp.brk, hb: inp.hb });
    if (this.pendingRespawn) { q.hb |= 2; this.pendingRespawn = false; }
    this.log.push(q);
    sim.step(toInput(q));
    this.steerVis = sim.steerA; this.thrVis = q.thr / 100; this.brkVis = q.brk / 100;
    this.driveMs += DT * 1000; if (sim.air) this.airMs += DT * 1000;
    const ev = sim.events;
    if (ev & EV_CP) { this.world.setCheckpointsPassed(sim.cp); audio.checkpoint(); this.cpFlash = 1; this.recordSplit(`CP ${sim.cp}`); this.init.input.vibrate(0.2, 0.4, 120); }
    if (ev & EV_LAND) { audio.land(sim.impact); this.rig.impact(sim.impact); this.landFx(sim.impact); this.init.input.vibrate(Math.min(1, sim.impact / 25), 0.3, 120); }
    if (ev & (EV_WALL | EV_OBST)) { audio.hit(sim.impact); this.rig.impact(sim.impact * 0.6); this.sparkFx(sim.impact); this.init.input.vibrate(0.6, 0.6, 150); }
    if (ev & EV_RESPAWN) { audio.respawn(); this.say('Respawn'); this.skid.clear(); }
    if (ev & EV_BOOST && !this.boosting) { audio.boost(); this.boosting = true; this.rig.impact(8); } else if (!(ev & EV_BOOST)) this.boosting = false;
    this.fxTick();
    const mode = this.init.spec.mode;
    if (mode === 'stunt') this.stuntTick();
    if (mode === 'endless') { this.endlessDist = Math.max(this.endlessDist, (sim.air ? sim.hint : sim.s / DS) * DS); if (ev & EV_RESPAWN || sim.crashes >= 3) { this.endFinish(false, true); return; } }
    if (this.init.free) { /* no finish in free drive */ }
    if (ev & EV_FINISH) { this.endFinish(true); }
    if (mode === 'stunt' && this.sim.tick * DT >= 90) this.endFinish(true);
  }

  private recordSplit(label: string) {
    if (!this.ghostProf) { this.splitMsg = { label, ms: NaN, until: performance.now() + 2200 }; return; }
    const idx = Math.min(this.track.n - 1, this.track.cps[this.sim.cp - 1] ?? 0);
    this.splitMsg = { label, ms: this.sim.tick * DT * 1000 - this.ghostProf.t[idx], until: performance.now() + 2200 };
  }

  private endFinish(finished: boolean, dead = false) {
    const sim = this.sim;
    const spec = this.init.spec;
    const stunt = spec.mode === 'stunt' ? Math.round(this.stuntScore) : undefined;
    const endless = spec.mode === 'endless' ? Math.round(this.endlessDist) : undefined;
    let replay: ReplayMeta | null = null; let valid = finished && sim.cp >= this.track.cps.length;
    if (finished && !dead && spec.mode !== 'stunt' && spec.mode !== 'endless') {
      replay = packReplay(this.log, this.meta.id, this.init.standard ? 'standard' : this.init.vehicle, sim.finishMs);
      if (this.init.standard && this.meta.id > 0) { const v = validateReplay(this.track, replay, STANDARD); valid = v.ok; if (!v.ok) this.say('Run failed validation: ' + v.reason); }
    }
    this.finishInfo = { ms: sim.finishMs || sim.tick * DT * 1000, crashes: sim.crashes, respawns: sim.respawns, topMps: sim.topSpeed, distanceM: sim.distance, longestJump: sim.longestJump, airMs: this.airMs, driveMs: this.driveMs, log: this.log, replay, valid: valid && finished, stunt, endless };
    this.phase = dead ? 'dead' : 'finished'; this.finishT = 0; this.victoryT = 0;
    this.writePose(sim, this.finishPose); this.finishSpeed = sim.speed;
    if (finished && !dead) { audio.finish(); this.finishFx(); this.init.input.vibrate(0.5, 0.8, 400); }
    this.init.onFinish?.(this.finishInfo);
  }

  // ------------------------------------------------------------------------------------------------------ replay viewer
  private frameReplay(dt: number) {
    const rp = this.rp!;
    if (rp.playing) this.fixedAcc += dt * rp.speed; else this.fixedAcc = 0;
    let steps = 0;
    while (this.fixedAcc >= DT && steps < 40) {
      this.fixedAcc -= DT; steps++;
      Object.assign(this.prev, this.cur); Object.assign(this.gprev, this.gcur);
      if (rp.tick < rp.log.length && !this.sim.finished) { this.sim.step(toInput(rp.log.at(rp.tick))); rp.tick++; this.handleReplayEvents(); } else { rp.playing = false; }
      this.writePose(this.sim, this.cur);
      if (this.ghostSim && this.ghostLog) { this.stepGhost(rp.tick); this.writePose(this.ghostSim, this.gcur); }
    }
    if (!rp.playing && steps === 0) { /* paused */ }
    this.steerVis = this.sim.steerA; const q = rp.log.at(Math.max(0, Math.min(rp.log.length - 1, rp.tick))); this.thrVis = q.thr / 100; this.brkVis = q.brk / 100;
    this.fxTick();
  }
  private handleReplayEvents() {
    const ev = this.sim.events;
    if (ev & EV_CP) this.world.setCheckpointsPassed(this.sim.cp);
    if (ev & EV_LAND) { this.landFx(this.sim.impact); audio.land(this.sim.impact); }
    if (ev & (EV_WALL | EV_OBST)) this.sparkFx(this.sim.impact);
  }
  seek(tick: number) {
    const rp = this.rp!; tick = Math.max(0, Math.min(rp.log.length, Math.round(tick)));
    // use cached snapshots every 600 ticks
    let base = Math.floor(tick / 600) * 600; let snap: Sim | undefined;
    while (base > 0 && !(snap = rp.snaps.get(base))) base -= 600;
    const sim = new Sim(this.track, this.params);
    let t = 0; if (snap) { Object.assign(sim, snap); t = base; }
    for (; t < tick && t < rp.log.length; t++) { sim.step(toInput(rp.log.at(t))); if (t > 0 && t % 600 === 0 && !rp.snaps.has(t)) rp.snaps.set(t, Object.assign(Object.create(Object.getPrototypeOf(sim)), sim)); }
    this.sim = sim; rp.tick = tick; this.world.setCheckpointsPassed(sim.cp);
    this.writePose(sim, this.cur); Object.assign(this.prev, this.cur);
    if (this.ghostSim) { const g = new Sim(this.track, STANDARD); for (let i = 0; i < tick && i < this.ghostLog!.length && !g.finished; i++) g.step(toInput(this.ghostLog!.at(i))); this.ghostSim = g; this.writePose(g, this.gcur); Object.assign(this.gprev, this.gcur); }
    this.skid.clear(); this.rig.reset();
  }
  setReplaySpeed(s: number) { if (this.rp) this.rp.speed = s; }

  // ------------------------------------------------------------------------------------------------------ stunt scoring
  private stuntTick() {
    const sim = this.sim;
    if (sim.air) {
      this.airT += DT;
      // accumulate rotation about the car's right axis (flips) and the up axis (spins)
      if (this.airT > DT * 2) {
        const f0 = this.lastF, f1 = this.tmpV.set(sim.fx, sim.fy, sim.fz); const u1 = this.tmpV2.set(sim.ux, sim.uy, sim.uz);
        const cr = this.tmpV3.crossVectors(f0, f1); const rot = Math.asin(Math.max(-1, Math.min(1, cr.dot(u1))));
        this.airRot += Math.abs(rot);
      }
      this.lastF.set(sim.fx, sim.fy, sim.fz);
      this.stuntScore += DT * 40;
    } else {
      if (this.airT > 0.7) {
        const flips = Math.floor(this.airRot / (Math.PI * 1.7)); const clean = !(sim.events & EV_CRASH);
        const pts = Math.round(this.airT * 120 + flips * 600 + (clean ? 250 : 0)); this.stuntScore += pts;
        this.stuntCombo = `${flips ? flips + 'x Flip  ' : ''}${this.airT.toFixed(1)}s Air  ${clean ? 'Clean Landing' : ''}  +${pts}`; this.comboUntil = performance.now() + 2500;
      }
      if (sim.events & EV_CRASH) this.stuntScore = Math.max(0, this.stuntScore - 150);
      this.airT = 0; this.airRot = 0;
      if (sim.slipR > 0.55 && sim.speed > 16) { this.driftT += DT; this.stuntScore += DT * 90 * (1 + Math.min(2, this.driftT * 0.4)); } else this.driftT = Math.max(0, this.driftT - DT * 2);
    }
  }
  comboUntil = 0;

  // ------------------------------------------------------------------------------------------------------ effects
  private lastSmoke = 0;
  private fxTick() {
    const sim = this.sim; const lvl = this.init.settings.particles; if (!lvl) return;
    const pos = this.cur; const sp = sim.speed;
    const rear = this.tmpV.set(pos.fx, pos.fy, pos.fz);
    const rnd = () => Math.random() - 0.5;
    // tyre smoke + skid marks
    const slipping = !sim.air && sim.slipR > 0.45 && sp > 6;
    const wheels = this.car.wheels;
    const base = this.car.group.position;
    if (slipping) {
      for (let w = 2; w < 4; w++) {
        const wp = this.car.wheelPos[w]; const wx = this.carWorld(wp.x, 0.02, wp.z);
        if (Math.random() < 0.55 * lvl / 3) this.smoke.emit(wx.x, wx.y + 0.1, wx.z, rnd() * 1.5, 0.8 + Math.random(), rnd() * 1.5, 0.9 + Math.random() * 0.5, 0.6, 3.2, this.fxCfg.smoke, 0.5, 1.2, -0.3);
        const right = this.tmpV2.set(pos.fy * pos.uz - pos.fz * pos.uy, pos.fz * pos.ux - pos.fx * pos.uz, pos.fx * pos.uy - pos.fy * pos.ux);
        this.skid.add(w, wx.clone(), right.clone(), this.tmpV3.set(pos.ux, pos.uy, pos.uz).clone(), true, Math.min(1, sim.slipR));
      }
    } else { this.skid.add(2, base, base, base, false, 0); this.skid.add(3, base, base, base, false, 0); }
    // loose-surface dust
    const surf = this.track.surf[Math.min(this.track.n - 1, Math.floor(sim.s / DS))];
    if (!sim.air && surf !== SURF_ASPHALT && surf !== 5 && sp > 8 && Math.random() < 0.6) {
      const wp = this.car.wheelPos[2 + (Math.random() < 0.5 ? 0 : 1)]; const wx = this.carWorld(wp.x, 0.05, wp.z);
      const col = surf === 1 ? '#a98a64' : surf === 2 ? '#6aa04a' : surf === 3 ? '#eaf6ff' : '#e0c58f';
      this.smoke.emit(wx.x, wx.y, wx.z, rnd() * 2, 1 + Math.random(), rnd() * 2, 0.8, 0.7, 3.5, col, 0.45, 1.5, -0.4);
    }
    // exhaust flames on throttle lift / shifts, boost trail
    const thr = this.thrVis;
    const exp = this.car.exhaustPos[0];
    if (sp > 10 && (this.lastThr - thr > 0.5 || (sim.events & EV_BOOST))) {
      for (const ex of this.car.exhaustPos.slice(0, 2)) { const e = this.carWorld(ex.x, ex.y, ex.z); this.glow.emit(e.x, e.y, e.z, -pos.fx * 6 + rnd(), -pos.fy * 6 + rnd(), -pos.fz * 6 + rnd(), 0.16, 0.5, 0.1, this.fxCfg.flame.c1, 0.9, 2, 0); this.glow.emit(e.x, e.y, e.z, -pos.fx * 4, -pos.fy * 4, -pos.fz * 4, 0.1, 0.3, 0.05, this.fxCfg.flame.c2, 1, 2, 0); }
    }
    this.lastThr = thr;
    if ((sim.events & EV_BOOST) || (this.boostTrailT > 0)) {
      this.boostTrailT = (sim.events & EV_BOOST) ? 0.8 : this.boostTrailT - DT;
      const e = this.carWorld(0, 0.35, this.car.length / 2 + 0.3); const t = this.fxCfg.trail; const col = new THREE.Color(Math.random() < 0.5 ? t.c1 : t.c2);
      if (t.style === 'rainbow') col.setHSL((performance.now() / 600 + Math.random() * 0.2) % 1, 1, 0.55);
      const lifeMul = t.style === 'ribbon' ? 1.6 : t.style === 'flame' ? 0.5 : 0.9;
      this.glow.emit(e.x + rnd() * 0.4, e.y + rnd() * 0.2, e.z + rnd() * 0.4, -pos.fx * 3, -pos.fy * 3, -pos.fz * 3, 0.6 * lifeMul, t.style === 'pixel' ? 0.9 : 0.7, 0.05, col, 0.9, 1.2, 0);
    }
    // sparks off walls in the sim handled in sparkFx
    this.smoke.update(1 / 60); this.glow.update(1 / 60);
  }
  lastThr = 0; boostTrailT = 0;
  private carWorld(x: number, y: number, z: number): THREE.Vector3 { return this.car.group.localToWorld(new THREE.Vector3(x, y, z)); }
  private landFx(impact: number) {
    if (!this.init.settings.particles) return; const n = Math.min(24, Math.round(impact * 1.2));
    for (let i = 0; i < n; i++) { const wp = this.car.wheelPos[i % 4]; const w = this.carWorld(wp.x, 0.05, wp.z); this.smoke.emit(w.x, w.y, w.z, (Math.random() - 0.5) * 6, 1 + Math.random() * 2, (Math.random() - 0.5) * 6, 0.9, 0.8, 4, '#d8d2c8', 0.5, 2, -0.5); }
  }
  private sparkFx(impact: number) {
    if (!this.init.settings.particles) return; const n = Math.min(26, Math.round(6 + impact * 1.4)); const p = this.car.group.position;
    for (let i = 0; i < n; i++) this.glow.emit(p.x + (Math.random() - 0.5), p.y + 0.4, p.z + (Math.random() - 0.5), (Math.random() - 0.5) * 12, Math.random() * 6, (Math.random() - 0.5) * 12, 0.45, 0.22, 0.05, Math.random() < 0.5 ? '#ffcf5a' : '#ffffff', 1, 0.8, 18);
  }
  private finishFx() {
    if (!this.init.settings.particles) return; const kind = COSMETIC_MAP[this.setup.fx.finish]?.data.kind ?? 'confetti'; const p = this.car.group.position;
    const colors = ['#FFFFFF', '#E8EAED', '#D8DCE0', '#B8BDC4', '#C9A24D', '#7C98C9'];
    const n = kind === 'firework' || kind === 'nova' ? 160 : 120;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, e = kind === 'firework' || kind === 'nova' ? Math.random() * Math.PI : 0.9 + Math.random() * 0.5, sp = kind === 'burst' ? 14 : 8 + Math.random() * 10;
      this.glow.emit(p.x, p.y + 3, p.z, Math.cos(a) * Math.sin(e) * sp, Math.cos(e) * sp * (kind === 'rain' ? -0.3 : 1) + 6, Math.sin(a) * Math.sin(e) * sp, 1.6 + Math.random(), 0.5, 0.1, kind === 'spark' ? '#ffcf5a' : colors[i % colors.length], 1, 0.6, 8);
    }
  }

  // ------------------------------------------------------------------------------------------------------ rendering
  private render(dt: number) {
    const gfx = this.gfx, sim = this.sim; const st = this.init.settings;
    const alpha = this.phase === 'paused' || (this.rp && !this.rp.playing) ? 1 : Math.min(1, this.fixedAcc / DT);
    this.time += dt;
    const p = this.tmpV3;
    const a = this.prev, b = this.cur;
    const post = this.phase === 'finished' ? this.victoryPose(dt) : null;
    const x = a.x + (b.x - a.x) * alpha, y = a.y + (b.y - a.y) * alpha, z = a.z + (b.z - a.z) * alpha;
    const fx = a.fx + (b.fx - a.fx) * alpha, fy = a.fy + (b.fy - a.fy) * alpha, fz = a.fz + (b.fz - a.fz) * alpha;
    const ux = a.ux + (b.ux - a.ux) * alpha, uy = a.uy + (b.uy - a.uy) * alpha, uz = a.uz + (b.uz - a.uz) * alpha;
    const F = new THREE.Vector3(fx, fy, fz).normalize(); const U = new THREE.Vector3(ux, uy, uz); U.addScaledVector(F, -U.dot(F)).normalize();
    let pos = new THREE.Vector3(x, y, z);
    if (post) { pos = post.pos; F.copy(post.f); U.copy(post.u); }
    this.placeCar(this.car, pos, F, U, dt, sim);
    // ghost
    if (this.ghostCar && this.ghostSim) {
      const ga = this.gprev, gb = this.gcur;
      const gp = new THREE.Vector3(ga.x + (gb.x - ga.x) * alpha, ga.y + (gb.y - ga.y) * alpha, ga.z + (gb.z - ga.z) * alpha);
      const gF = new THREE.Vector3(ga.fx + (gb.fx - ga.fx) * alpha, ga.fy + (gb.fy - ga.fy) * alpha, ga.fz + (gb.fz - ga.fz) * alpha).normalize();
      const gU = new THREE.Vector3(ga.ux + (gb.ux - ga.ux) * alpha, ga.uy + (gb.uy - ga.uy) * alpha, ga.uz + (gb.uz - ga.uz) * alpha); gU.addScaledVector(gF, -gU.dot(gF)).normalize();
      this.placeCar(this.ghostCar, gp, gF, gU, dt, this.ghostSim);
    }
    // spawn effect
    if (this.phase === 'countdown' || this.spawnT < 1.2) this.spawnAnim(dt);
    // world + sun + camera
    this.world.update(sim.tick * DT);
    const hint = sim.air ? sim.hint : sim.s / DS;
    this.rig.update(gfx.camera, dt, { p: pos, f: F, u: U }, sim.speed, this.track, hint, sim.air && this.phase !== 'finished');
    gfx.applySun(pos);
    audio.resume();
    const eng = audio.updateEngine(sim.speed, this.phase === 'racing' ? this.thrVis : 0, sim.slipR, this.track.surf[Math.min(this.track.n - 1, Math.floor(sim.s / DS))], sim.air, dt);
    this.lastGear = eng.gear;
    gfx.render(st.motionBlur ? Math.min(0.12, sim.speed * 0.0014) : 0);
    // HUD at ~30 Hz
    this.hudAcc += dt;
    if (this.hudAcc > 0.033) { this.hudAcc = 0; this.pushHud(eng); }
  }

  private placeCar(car: CarModel, pos: THREE.Vector3, F: THREE.Vector3, U: THREE.Vector3, dt: number, sim: Sim) {
    const R = new THREE.Vector3().crossVectors(F, U).normalize();
    this.tmpM.makeBasis(R, U, this.tmpV2.copy(F).negate());
    car.group.quaternion.setFromRotationMatrix(this.tmpM);
    car.group.position.copy(pos).addScaledVector(U, -0.45);
    const ctl = car === this.car;
    const lean = { roll: -Math.max(-0.09, Math.min(0.09, sim.w * sim.vx * 0.0018)), pitch: Math.max(-0.05, Math.min(0.05, sim.axLong * 0.0028)), heave: sim.air ? 0.02 : Math.max(-0.03, Math.min(0.03, -sim.speed * 0.0002)) };
    car.update(dt, { speed: sim.speed * (sim.vx < 0 ? -1 : 1), steer: ctl ? this.steerVis : sim.steerA, slip: sim.slipR, braking: ctl ? Math.max(this.brkVis, sim.vx > 1 && this.brkVis > 0 ? 1 : 0) : 0, airborne: sim.air, boosting: !!(sim.events & EV_BOOST), time: this.time, throttle: this.thrVis }, lean);
  }

  private victoryPose(dt: number): { pos: THREE.Vector3; f: THREE.Vector3; u: THREE.Vector3 } {
    const kind = COSMETIC_MAP[this.setup.fx.victory]?.data.kind ?? 'cruise';
    const fp = this.finishPose; const t = this.victoryT;
    const F = new THREE.Vector3(fp.fx, fp.fy, fp.fz), U = new THREE.Vector3(fp.ux, fp.uy, fp.uz), pos = new THREE.Vector3(fp.x, fp.y, fp.z);
    const sp = Math.max(0, this.finishSpeed * Math.exp(-t * 0.9)); const travel = this.finishSpeed * (1 - Math.exp(-t * 0.9)) / 0.9;
    const Rr = new THREE.Vector3().crossVectors(F, U).normalize();
    switch (kind) {
      case 'donut': { const ang = t * 3; pos.addScaledVector(F, Math.min(travel, 12)); const q = new THREE.Quaternion().setFromAxisAngle(U, ang); F.applyQuaternion(q); pos.addScaledVector(Rr, Math.sin(ang) * 6 * Math.min(1, t)); break; }
      case 'spin': { pos.addScaledVector(F, travel); F.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(U, t * 6 * Math.exp(-t * 0.5))); break; }
      case 'pop': { pos.addScaledVector(F, travel); F.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(Rr, Math.max(0, 0.5 * Math.sin(Math.min(Math.PI, t * 2.5))))); break; }
      case 'burnout': { pos.addScaledVector(F, Math.min(travel, 6)); if (this.init.settings.particles && Math.random() < 0.8) { const w = this.carWorld(0, 0.1, this.car.length / 2 - 0.5); this.smoke.emit(w.x, w.y, w.z, (Math.random() - 0.5) * 2, 1.2, (Math.random() - 0.5) * 2, 1.2, 1, 4, this.fxCfg.smoke, 0.6, 1, -0.3); } break; }
      case 'salute': { pos.addScaledVector(F, travel); pos.addScaledVector(U, Math.abs(Math.sin(t * 5)) * 0.15 * Math.min(1, t)); break; }
      case 'drift': { const k = Math.min(1, t * 1.3); pos.addScaledVector(F, travel); F.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(U, 0.9 * k)); break; }
      case 'orbit': pos.addScaledVector(F, travel); break;
      default: pos.addScaledVector(F, travel);
    }
    if (kind === 'orbit' && this.rig.mode !== 7) { this.rig.mode = 7; this.rig.orbit.dist = 8; }
    if (kind === 'orbit') this.rig.orbit.yaw += dt * 0.6;
    void sp;
    return { pos, f: F.normalize(), u: U.normalize() };
  }

  private spawnAnim(dt: number) {
    this.spawnT += dt;
    const kind = COSMETIC_MAP[this.setup.fx.spawn]?.data.kind ?? 'fade';
    const k = Math.min(1, this.spawnT / 0.9);
    const g = this.car.group;
    if (kind === 'drop') g.position.y += (1 - k) * (1 - k) * 6;
    if (kind === 'warp' || kind === 'pixel') g.scale.setScalar(0.4 + 0.6 * k * k);
    else g.scale.setScalar(1);
    if ((kind === 'ring' || kind === 'portal' || kind === 'bolt' || kind === 'scan') && this.spawnT < 0.8 && this.init.settings.particles) {
      const p = g.position; const n = kind === 'bolt' ? 3 : 6;
      for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2; const r = kind === 'scan' ? 1.8 : 2.4 * (0.4 + this.spawnT); this.glow.emit(p.x + Math.cos(a) * r, p.y + (kind === 'scan' ? this.spawnT * 2 : 0.2), p.z + Math.sin(a) * r, 0, kind === 'bolt' ? 16 : 1, 0, 0.5, 0.5, 0.1, kind === 'portal' ? '#C6FF00' : '#9FD6FF', 0.9, 1, 0); }
    }
  }

  pushHud(eng: { gear: number; rpm: number; ratio: number }) {
    const sim = this.sim; const now = performance.now(); const tr = this.track;
    const idx = Math.min(tr.n - 1, Math.max(0, Math.floor(sim.air ? sim.hint : sim.s / DS)));
    let delta: number | null = null; let label = '';
    const nowMs = this.rp ? this.rp.tick * DT * 1000 : sim.tick * DT * 1000;
    if (this.ghostProf && this.ghostOn !== false && (this.phase === 'racing' || this.rp)) { delta = nowMs - this.ghostProf.t[idx]; label = this.ghostList[this.ghostIdx]?.label ?? ''; }
    const mini = this.miniPos(this.cur.x, this.cur.z); const gm = this.ghostSim ? this.miniPos(this.gcur.x, this.gcur.z) : null;
    useHud.setState({
      phase: this.phase, countdown: Math.max(0, Math.ceil(this.countdown)), timeMs: this.phase === 'finished' ? (this.finishInfo?.ms ?? sim.finishMs) : nowMs, speed: sim.speed, gear: eng.gear, rpm: Math.min(1, eng.ratio), cp: sim.cp, cpTotal: tr.cps.length,
      progress: sim.progress, delta, deltaLabel: label, pbMs: this.init.pbMs, benchMs: this.meta.bench.ms > 0 && this.meta.bench.replayVerified ? this.meta.bench.ms : null, steer: this.steerVis, thr: this.thrVis, brk: this.brkVis,
      camera: CAMERA_NAMES[this.rig.mode], fps: Math.round(this.fps), respawns: sim.respawns, crashes: sim.crashes, free: !!this.init.free,
      stunt: this.init.spec.mode === 'stunt' ? { score: Math.round(this.stuntScore), combo: now < this.comboUntil ? this.stuntCombo : '', air: this.airT } : undefined,
      endless: this.init.spec.mode === 'endless' ? { dist: Math.round(this.endlessDist) } : undefined,
      split: this.splitMsg && now < this.splitMsg.until ? { label: this.splitMsg.label, ms: this.splitMsg.ms } : null,
      mini: { x: mini.x, y: mini.y, gx: gm?.x, gy: gm?.y }, ghostName: this.ghostCar && this.ghostOn ? (this.ghostList[this.ghostIdx]?.label ?? null) : null,
      message: now < this.messageUntil ? this.message : null, boosting: !!(sim.events & EV_BOOST), airborne: sim.air, time: this.time,
      replay: this.rp ? { tick: this.rp.tick, total: this.rp.log.length, speed: this.rp.speed, playing: this.rp.playing } : undefined,
    });
  }
  miniPos(x: number, z: number) { const b = this.miniB; const w = b.maxX - b.minX || 1, h = b.maxZ - b.minZ || 1; const s = Math.max(w, h); return { x: (x - b.minX) / s + (1 - w / s) / 2, y: (z - b.minZ) / s + (1 - h / s) / 2 }; }
}

export { timeProfile };
