// The in-round gameplay controller: hole flow, aiming, swing meter,
// shot playback, penalties, scoring and statistics.
import * as THREE from 'three';
import { Hole, S } from '../core/holeGen.js';
import { simulate, MPH, greenRollDecel } from '../core/physics.js';
import { mulberry32, clamp } from '../core/noise.js';
import { buildBag } from '../data/clubs.js';
import { THEMES } from '../data/themes.js';
import { TEE_SETS, getCourse } from '../data/courses.js';
import { DIFFICULTIES } from '../core/profile.js';
import {
  SHOT_TYPES, availableTypes, computeLaunch, computePutt, fullCarry, lieInfo, lieRangeText,
  pickPuttScale, PUTT_SCALES_FT, playsLike, recommendClub, timingWindow,
} from './shots.js';
import { Golfer, clubLength } from '../render/golfer.js';
import { P } from '../render/world.js';
import { audio } from '../audio/audio.js';

const DEG = Math.PI / 180;
const YD2FT = 3;

export function scoreName(diff, strokes) {
  if (strokes === 1) return 'HOLE IN ONE';
  if (diff <= -4) return 'CONDOR';
  if (diff === -3) return 'ALBATROSS';
  if (diff === -2) return 'EAGLE';
  if (diff === -1) return 'BIRDIE';
  if (diff === 0) return 'PAR';
  if (diff === 1) return 'BOGEY';
  if (diff === 2) return 'DOUBLE BOGEY';
  if (diff === 3) return 'TRIPLE BOGEY';
  return `+${diff}`;
}

export class Play {
  constructor(app) {
    this.app = app;
    this.world = app.world;
    this.rig = app.rig;
    this.hud = app.hud;
    this.state = 'off';
    this.keys = new Set();
    this.speedMul = 1;
    this.golfer = null;
  }

  // ---------------- round lifecycle ----------------
  start(cfg) {
    const app = this.app;
    const prof = app.profile;
    this.cfg = cfg;
    this.course = getCourse(cfg.courseId);
    this.theme = THEMES[this.course.theme];
    this.tee = TEE_SETS.find(t => t.id === cfg.teeId) || TEE_SETS[1];
    this.diffKey = cfg.difficulty || prof.settings.difficulty;
    this.diff = DIFFICULTIES[this.diffKey];
    this.attrs = cfg.attrs;
    this.look = cfg.look;
    this.golferName = cfg.golferName;
    this.bag = buildBag(cfg.bagIds || prof.bag, prof.equipment, this.attrs);
    this.rng = mulberry32((Date.now() & 0xffffffff) >>> 0);
    this.pinSeed = Math.floor(this.rng() * 1e6);
    this.round = {
      courseId: this.course.id, tee: this.tee.id, holes: cfg.holes, idx: 0,
      cards: cfg.holes.map(i => ({ hole: i, par: this.course.holes[i].p, yards: 0, strokes: null, putts: 0, fairway: null, gir: false, penalties: 0 })),
      stats: null, golferName: cfg.golferName, difficulty: this.diffKey,
    };
    if (!this.golfer) {
      this.golfer = new Golfer(this.look);
      this.world.scene.add(this.golfer.root);
    } else {
      this.golfer.build(this.look);
    }
    this.golfer.root.visible = true;
    this.world.setCourseEnv(this.course, this.theme);
    const ball = app.profile.equipment.ball;
    this.world.setBallStyle(ball === 'optic' ? '#f6ff3c' : ball === 'chrome' ? '#fff8d0' : '#ffffff');
    this.state = 'loading';
    this.hud.show(true);
    this.loadHole(0);
  }

  stop() {
    this.state = 'off';
    audio.rollStop();
    audio.stopAmbience();
    this.hud.show(false);
    if (this.golfer) this.golfer.root.visible = false;
  }

  get card() { return this.round.cards[this.round.idx]; }

  loadHole(i) {
    this.round.idx = i;
    const idx = this.round.holes[i];
    const hdef = this.course.holes[idx];
    this.state = 'loading';
    this.hud.loading(true, { course: this.course, number: idx + 1, par: hdef.p, yards: Math.round(hdef.y * this.tee.factor), name: hdef.name, tip: hdef.tip, sig: hdef.sig });
    setTimeout(() => {
      const t0 = performance.now();
      const hole = this.hole = new Hole(this.course, idx, {
        teeFactor: this.tee.factor, pinSeed: this.pinSeed + idx * 7,
        pinDifficulty: { easy: 0.2, medium: 0.5, sunday: 0.95 }[this.app.profile.settings.pins] ?? 0.5,
      });
      this.world.loadHole(hole, { name: this.golferName, toPar: this.roundToPar() });
      console.log(`hole ${idx + 1} built in ${(performance.now() - t0).toFixed(0)}ms`);
      this.card.yards = hole.yards;
      // wind
      const [wmin, wmax] = this.course.wind;
      const setting = { calm: 0.3, normal: 1, windy: 1.7 }[this.app.profile.settings.windSetting] ?? 1;
      const r = mulberry32(this.pinSeed ^ (idx * 977));
      this.windBaseMph = (wmin + r() * (wmax - wmin)) * setting * this.diff.wind;
      this.windDirPlan = r() * Math.PI * 2; // direction the wind blows toward (plan angle, 0 = +y)
      this.hole.stimp = this.course.stimp + (this.diffKey === 'realistic' ? 0.5 : this.diffKey === 'easy' ? -1 : 0);
      this.hole.firmness = this.course.firmness;
      // ball
      this.strokes = 0;
      this.holeLog = { shots: [], sandFrom: null, aroundFrom: null, onGreenAt: null };
      const [tx, ty] = hole.tee;
      this.ball = { x: tx, y: ty, h: hole.heightAt(tx, ty) };
      this.prevBall = { ...this.ball };
      this.teeShot = true;
      this.shapeSel = 0; this.trajSel = 0; this.spin = { x: 0, y: 0 };
      this.hud.setHoleInfo(this.holeHeader());
      audio.startAmbience(this.theme, this.windBaseMph, hole.waterShapes.length > 0);
      this.world.windStrength = Math.min(1, this.windBaseMph / 20);
      this.hud.loading(false);
      if (this.cfg.mode === 'practice') { this.placePractice(); return; }
      if (this.app.profile.settings.flyover && this.cfg.mode !== 'range') this.startFlyover();
      else this.beginShot(true);
    }, 60);
  }

  holeHeader() {
    const c = this.card;
    const toPar = this.roundToPar();
    return {
      number: this.hole.number, par: this.hole.par, yards: this.hole.yards, name: this.hole.def.name,
      stroke: this.strokes + 1, toPar, course: this.course.short, mode: this.cfg.mode,
      holeIdx: this.round.idx, holeCount: this.round.holes.length,
    };
  }

  roundToPar() {
    let tp = 0;
    for (const c of this.round.cards) if (c.strokes != null) tp += c.strokes - c.par;
    return tp;
  }

  startFlyover() {
    this.state = 'flyover';
    this.flyT = 0;
    this.golfer.root.visible = false;
    this.world.setBall(this.ball.x, this.ball.y, this.ball.h, true);
    this.world.clearAim();
    this.rig.set('flyover', { t: 0, snap: true });
    this.hud.holeIntro(true, this.holeHeader(), this.hole.def.tip);
  }

  // ---------------- shot setup ----------------
  beginShot(snap = false) {
    const hole = this.hole;
    this.state = 'aim';
    this.hud.holeIntro(false);
    this.golfer.root.visible = true;
    this.surf = hole.surfAt(this.ball.x, this.ball.y);
    if (this.surf === S.WATER || this.surf === S.BRUSH) this.surf = S.ROUGH;
    const onTee = this.teeShot && this.strokes === 0;
    if (onTee) this.surf = S.TEE;
    this.distPin = hole.distToPin(this.ball.x, this.ball.y);
    this.gust = 0.85 + this.rng() * 0.3;
    this.wind = this.windVec();
    const recovery = this.attrs.recovery;
    // default club / aim
    const onGreen = this.surf === S.GREEN;
    const nearPutt = (this.surf === S.FRINGE && this.distPin < 16) || onGreen;
    let club, heading, type;
    const toPinHeading = Math.atan2(hole.pin[0] - this.ball.x, hole.pin[1] - this.ball.y);
    if (nearPutt) {
      club = this.bag.find(c => c.cat === 'putter');
      type = 'putt';
      heading = toPinHeading;
      this.puttScale = pickPuttScale(this.distPin);
    } else {
      // realistic club limits from poor lies
      const allowed = (c) => c.cat !== 'putter' && (onTee || c.id !== 'DR')
        && !(this.surf === S.SAND && (c.cat === 'wood' || c.cat === 'hybrid'))
        && !((this.surf === S.DEEP || this.surf === S.BRUSH) && c.cat === 'wood')
        && !((this.surf === S.ROUGH || this.surf === S.STRAW) && (c.id === '3W'));
      const longest = this.bag.filter(allowed).sort((a, b) => b.carry - a.carry)[0] || this.bag[0];
      const reach = fullCarry(longest, 'normal', this.surf, recovery) * 1.08;
      const [bs] = hole.nearest(this.ball.x, this.ball.y);
      if (this.distPin <= reach) {
        heading = toPinHeading;
        const el = hole.pinH - this.ball.h;
        const target = playsLike(this.distPin, el, this.windAlong(toPinHeading));
        const sg = !onTee && this.surf !== S.SAND ? this.shortGameChoice(this.distPin) : null;
        if (sg) { club = sg.club; type = sg.type; }
        else {
          club = recommendClub(this.bag, target, this.surf, recovery);
          type = this.defaultType(club, this.distPin);
        }
        if (onTee && this.hole.par === 3) type = 'normal';
      } else {
        club = onTee ? (this.bag.find(c => c.id === 'DR') || longest) : longest;
        const est = fullCarry(club, 'normal', this.surf, recovery) + (onTee ? 18 : 10);
        const s = Math.min(hole.L - 25, bs + est);
        const aimPt = hole.at(s);
        heading = Math.atan2(aimPt.x - this.ball.x, aimPt.y - this.ball.y);
        type = this.surf === S.SAND ? 'normal' : 'normal';
      }
    }
    this.club = club;
    this.heading = heading;
    this.typeId = type;
    this.ensureType();
    this.shapeSel = 0; this.trajSel = 0; this.spin = { x: 0, y: 0 };
    this.rig.orbitYaw = 0; this.rig.orbitPitch = 0; this.rig.zoom = 1; this.rig.preview = 0;
    this.meter = { state: 'idle', power: 0, marker: 0 };
    this.placeGolfer();
    this.world.clearTrail();
    this.world.setBall(this.ball.x, this.ball.y, this.ball.h, onTee);
    this.world.placeGrass(hole, this.ball.x, this.ball.y);
    this.rig.set('address', { snap: true });
    this.camMode = 'address';
    this.updateAim();
    this.refreshHud();
    this.hud.meterShow(true, this.club.cat === 'putter');
  }

  // pick a sensible club + technique around the green
  shortGameChoice(dist) {
    if (dist > 75) return null;
    const find = (ids) => ids.map(id => this.bag.find(c => c.id === id)).find(Boolean);
    const good = this.surf === S.FRINGE || this.surf === S.FIRSTCUT || this.surf === S.FAIRWAY;
    let club, type;
    if (dist <= 32 && good) { club = find(dist < 16 ? ['SW', 'GW', 'PW', 'LW'] : ['PW', '9I', 'GW', 'SW']); type = 'chip'; }
    else if (dist <= 45) { club = find(['SW', 'LW', 'GW', 'PW']); type = 'pitch'; }
    else { club = find(['GW', 'SW', 'PW']); type = dist > 60 ? 'normal' : 'pitch'; }
    if (!club) return null;
    const avail = availableTypes(this.surf, club, dist);
    if (!avail.includes(type)) type = avail.includes('pitch') ? 'pitch' : avail[0];
    return { club, type };
  }

  // Power that finishes nearest the pin (no wind) - used for the meter marker on easier levels
  idealPower(useWind) {
    const hole = this.hole;
    const putt = this.isPutt();
    const key = [this.club.id, this.typeId, this.shapeSel, this.trajSel, this.spin.x, this.spin.y, Math.round(this.heading * 200), putt ? this.puttScale : 0, useWind].join('|');
    if (this._idealKey === key) return this._ideal;
    const sim = (pw) => {
      let l;
      if (putt) l = computePutt({ power: pw, scaleYd: this.puttScale / YD2FT, heading: this.heading, attrs: { putting: 200 }, diff: { putt: 0 }, stimp: hole.stimp, rng: () => 0.5 });
      else l = computeLaunch({ club: this.club, typeId: this.typeId, power: pw, timing: 0, heading: this.heading, shape: this.shapeSel, traj: this.trajSel, spin: this.spin, surf: this.surf, attrs: this.attrs, diff: { ...this.diff, disp: 0 }, rng: () => 0.5, noNoise: true });
      if (putt) { l.heading = this.heading; l.speed = Math.sqrt(2 * greenRollDecel(hole.stimp) * pw * this.puttScale / YD2FT); }
      const r = simulate(hole, this.ball, l, { ...this.env(!useWind), assist: { cupMul: 0.01, captureMul: 0.01 } }, { putt });
      // signed progress along the line to the pin
      const hx = hole.pin[0] - this.ball.x, hy = hole.pin[1] - this.ball.y;
      const d = Math.hypot(hx, hy) || 1;
      return ((r.end.x - this.ball.x) * hx + (r.end.y - this.ball.y) * hy) / d - d;
    };
    let lo = 0.03, hi = putt ? 1 : 1.1;
    if (sim(hi) < 0) { this._idealKey = key; this._ideal = null; return null; }
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2;
      if (sim(mid) < 0) lo = mid; else hi = mid;
    }
    this._idealKey = key; this._ideal = (lo + hi) / 2;
    return this._ideal;
  }

  defaultType(club, dist) {
    if (this.surf === S.SAND) return dist < 60 ? 'bunker' : 'normal';
    const avail = availableTypes(this.surf, club, dist);
    if (club.cat === 'wedge' && dist < 45 && avail.includes('chip') && (this.surf === S.FRINGE || this.surf === S.FIRSTCUT || this.surf === S.FAIRWAY)) return 'chip';
    if (club.cat === 'wedge' && dist < club.carry * 0.7 && avail.includes('pitch')) return 'pitch';
    return avail[0];
  }

  ensureType() {
    if (this.club.cat === 'putter') { this.typeId = 'putt'; return; }
    const avail = availableTypes(this.surf, this.club, this.distPin);
    if (!avail.includes(this.typeId)) this.typeId = avail[0];
  }

  placeGolfer() {
    const g = this.golfer;
    g.setClub(this.club.cat, clubLength(this.club.cat, this.club.id));
    g.address();
    g.placeAtBall(P(this.ball.x, this.ball.y, this.ball.h), this.heading);
  }

  windVec() {
    const s = this.windBaseMph * this.gust * MPH;
    return [Math.sin(this.windDirPlan) * s, Math.cos(this.windDirPlan) * s];
  }
  windAlong(heading) {
    const w = this.windVec();
    return w[0] * Math.sin(heading) + w[1] * Math.cos(heading);
  }

  isPutt() { return !!this.club && this.club.cat === 'putter'; }

  env(noWind = false) {
    return {
      wind: noWind ? [0, 0] : this.wind,
      firmness: this.hole.firmness, stimp: this.hole.stimp,
      assist: { cupMul: this.diff.cupMul, captureMul: this.diff.captureMul },
      rng: this.rng,
    };
  }

  // ---------------- aim preview ----------------
  updateAim() {
    const hole = this.hole;
    const w = this.world;
    w.clearAim();
    const settings = this.app.profile.settings;
    if (this.isPutt()) {
      this.puttScale = this.puttScale || pickPuttScale(this.distPin);
      const frac = this.diff.puttPreview;
      if (settings.puttGuide) {
        const D = this.distPin + 0.4;
        const power = D / (this.puttScale / YD2FT);
        const l = computePutt({ power, scaleYd: this.puttScale / YD2FT, heading: this.heading, attrs: { putting: 200 }, diff: { putt: 0 }, stimp: hole.stimp, rng: () => 0.5 });
        l.heading = this.heading; l.speed = Math.sqrt(2 * greenRollDecel(hole.stimp) * Math.min(D, this.puttScale / YD2FT));
        const sim = simulate(hole, this.ball, l, this.env(true), { putt: true });
        const n = Math.max(2, Math.floor(sim.frames.length * (frac > 0 ? frac : 0.12)));
        const ground = sim.frames.slice(0, n).map(f => [f.x, f.y, f.h]);
        w.showAim({ ground });
        w.showSlopeGrid(hole, (this.ball.x + hole.pin[0]) / 2, (this.ball.y + hole.pin[1]) / 2, Math.min(18, this.distPin / 2 + 4));
      } else {
        const ground = [];
        for (let d = 0; d <= Math.min(3, this.distPin); d += 0.25) {
          const x = this.ball.x + Math.sin(this.heading) * d, y = this.ball.y + Math.cos(this.heading) * d;
          ground.push([x, y, hole.heightAt(x, y)]);
        }
        w.showAim({ ground });
      }
      this.previewLanding = null;
      this.hud.drawMap(this);
      return;
    }
    const mode = settings.landingMarker ? this.diff.landing : 'line';
    const launch = computeLaunch({
      club: this.club, typeId: this.typeId, power: 1, timing: 0, heading: this.heading,
      shape: this.shapeSel, traj: this.trajSel, spin: this.spin, surf: this.surf,
      attrs: this.attrs, diff: { ...this.diff, disp: 0 }, rng: () => 0.5, noNoise: true,
    });
    const sim = simulate(hole, this.ball, launch, this.env(mode !== 'wind'), { flightOnly: true });
    const land = sim.end;
    this.previewLanding = [land.x, land.y, land.h];
    this.aimDist = Math.hypot(land.x - this.ball.x, land.y - this.ball.y);
    const radius = Math.max(2, sim.carry * (1 - this.club.accuracy) * 0.16 * this.diff.disp + 1.5);
    if (mode === 'wind' || mode === 'nowind') {
      const path = sim.frames.filter((f, i) => i % 3 === 0).map(f => [f.x, f.y, f.h]);
      path.push([land.x, land.y, land.h]);
      w.showAim({ path, landing: [land.x, land.y, land.h], radius, color: mode === 'wind' ? '#7dffb0' : '#ffffff' });
    } else if (mode === 'line') {
      const ground = [];
      const L = sim.carry;
      for (let d = 2; d <= L; d += 4) {
        const x = this.ball.x + Math.sin(this.heading) * d, y = this.ball.y + Math.cos(this.heading) * d;
        ground.push([x, y, hole.heightAt(x, y) + 0.1]);
      }
      w.showAim({ ground });
    } else {
      const ground = [];
      for (let d = 2; d <= 25; d += 1) {
        const x = this.ball.x + Math.sin(this.heading) * d, y = this.ball.y + Math.cos(this.heading) * d;
        ground.push([x, y, hole.heightAt(x, y) + 0.1]);
      }
      w.showAim({ ground });
    }
    this.hud.drawMap(this);
  }

  refreshHud(light = false) {
    const hole = this.hole;
    const lie = lieInfo(this.surf);
    const el = hole.pinH - this.ball.h;
    const toPinHeading = Math.atan2(hole.pin[0] - this.ball.x, hole.pin[1] - this.ball.y);
    const pl = playsLike(this.distPin, el, this.windAlong(toPinHeading));
    const putt = this.isPutt();
    const carry = putt ? 0 : fullCarry(this.club, this.typeId, this.surf, this.attrs.recovery);
    this.hud.setInfo({
      lie: this.teeShot && this.strokes === 0 ? 'TEE' : lie.name, lieColor: lie.color,
      liePct: lieRangeText(this.surf, this.typeId, this.club, this.attrs.recovery),
      toPin: this.distPin, playsLike: pl, elevFt: el * 3, putt,
      club: this.club, carry, typeId: this.typeId, typeName: SHOT_TYPES[this.typeId].name,
      types: putt ? ['putt'] : availableTypes(this.surf, this.club, this.distPin),
      shape: this.shapeSel, traj: this.trajSel, spin: this.spin, puttScale: this.puttScale,
      bag: this.bag, clubIdx: this.bag.indexOf(this.club),
      aimOff: Math.atan2(Math.sin(this.heading - toPinHeading), Math.cos(this.heading - toPinHeading)),
    });
    this.hud.setHoleInfo(this.holeHeader());
    if (light) return;
    // meter target tick
    let tick = null;
    const dk = this.diffKey;
    if (putt) {
      tick = dk === 'easy' ? this.idealPower(false) : this.distPin * YD2FT / this.puttScale;
    } else if (carry > 0) {
      if ((dk === 'easy' || dk === 'normal') && this.distPin < carry * 1.15) tick = this.idealPower(dk === 'easy');
      else if (dk !== 'realistic') {
        const toPin = playsLike(this.distPin, el, this.windAlong(toPinHeading));
        tick = toPin / carry;
      }
      if (tick != null && tick > 1.12) tick = null;
    }
    this.hud.meterTarget(tick, putt ? this.puttScale : null);
    this.hud.meterWindow(putt ? 0 : timingWindow(this.club, this.typeId, this.surf, this.attrs, this.diff, 1));
  }

  // ---------------- input ----------------
  onKeyDown(e) {
    if (this.state === 'off' || this.state === 'loading') return false;
    const k = e.key;
    if (this.state === 'flyover') {
      if (k === ' ' || k === 'Enter' || k === 'Escape') { this.endFlyover(); return true; }
      return false;
    }
    if (this.state === 'result' && (k === 'Enter' || k === ' ')) { this.continueAfterResult(); return true; }
    if (this.state === 'flight' && (k === ' ' || k === 'Enter')) { this.speedMul = this.speedMul > 1 ? 8 : 3; return true; }
    if (this.state !== 'aim' && this.state !== 'swing') return false;
    if (k === ' ') { if (!e.repeat) this.swingPress(); return true; }
    if (this.state !== 'aim') return false;
    const lk = k.toLowerCase();
    switch (lk) {
      case 'arrowleft': case 'a': this.keys.add('left'); return true;
      case 'arrowright': case 'd': this.keys.add('right'); return true;
      case 'arrowup': case 'w': this.cycleClub(-1); return true;
      case 'arrowdown': case 's': this.cycleClub(1); return true;
      case 'q': this.setShape(this.shapeSel === -1 ? 0 : -1); return true;
      case 'e': this.setShape(this.shapeSel === 1 ? 0 : 1); return true;
      case 't': this.setTraj(this.trajSel === 1 ? -1 : this.trajSel + 1); return true;
      case 'x': this.cycleType(); return true;
      case 'c': this.cycleCamera(); return true;
      case 'v': case 'm': this.setCamera(this.camMode === 'overhead' ? 'address' : 'overhead'); return true;
      case 'g': this.app.profile.settings.puttGuide = !this.app.profile.settings.puttGuide; this.app.save(); this.updateAim(); this.hud.toast(this.app.profile.settings.puttGuide ? 'Putting guide ON' : 'Putting guide OFF', '', 'info', 900); return true;
      case 'i': this.setSpin(this.spin.x, clamp(this.spin.y + 0.25, -1, 1)); return true;
      case 'k': this.setSpin(this.spin.x, clamp(this.spin.y - 0.25, -1, 1)); return true;
      case 'j': this.setSpin(clamp(this.spin.x - 0.25, -1, 1), this.spin.y); return true;
      case 'l': this.setSpin(clamp(this.spin.x + 0.25, -1, 1), this.spin.y); return true;
      case 'r': this.autoAim(); return true;
    }
    return false;
  }
  onKeyUp(e) {
    const lk = e.key.toLowerCase();
    if (lk === 'arrowleft' || lk === 'a') this.keys.delete('left');
    if (lk === 'arrowright' || lk === 'd') this.keys.delete('right');
    if (e.key === ' ' && this.state === 'swing') this.swingRelease();
    if ((e.key === ' ' || e.key === 'Enter') && this.state === 'flight') this.speedMul = 1;
  }

  autoAim() {
    this.heading = Math.atan2(this.hole.pin[0] - this.ball.x, this.hole.pin[1] - this.ball.y);
    this.afterAimChange();
  }

  aimAt(x, y) {
    if (this.state !== 'aim') return;
    this.heading = Math.atan2(x - this.ball.x, y - this.ball.y);
    this.afterAimChange();
  }

  afterAimChange() {
    this.golfer.placeAtBall(P(this.ball.x, this.ball.y, this.ball.h), this.heading);
    this.updateAim();
    this.refreshHud();
  }

  cycleClub(dir) {
    if (this.isPutt() && this.surf === S.GREEN) {
      // change putt scale instead
      const i = PUTT_SCALES_FT.indexOf(this.puttScale);
      this.puttScale = PUTT_SCALES_FT[clamp(i + dir, 0, PUTT_SCALES_FT.length - 1)];
      this.updateAim(); this.refreshHud();
      audio.click();
      return;
    }
    let i = this.bag.indexOf(this.club);
    for (let n = 0; n < this.bag.length; n++) {
      i = (i + dir + this.bag.length) % this.bag.length;
      const c = this.bag[i];
      if (c.id === 'DR' && !(this.teeShot && this.strokes === 0) && this.surf !== S.FAIRWAY && this.surf !== S.TEE) continue;
      break;
    }
    this.selectClub(this.bag[i]);
  }
  selectClub(c) {
    this.club = c;
    if (c.cat === 'putter') { this.typeId = 'putt'; this.puttScale = pickPuttScale(this.distPin); }
    else {
      if (this.typeId === 'putt') this.typeId = this.defaultType(c, this.distPin);
      this.ensureType();
    }
    this.placeGolfer();
    this.hud.meterShow(true, this.isPutt());
    this.updateAim(); this.refreshHud();
    audio.click();
  }
  cycleType() {
    if (this.isPutt()) return;
    const avail = availableTypes(this.surf, this.club, this.distPin);
    const i = avail.indexOf(this.typeId);
    this.setType(avail[(i + 1) % avail.length]);
  }
  setType(t) { this.typeId = t; this.ensureType(); this.updateAim(); this.refreshHud(); audio.click(); }
  setShape(v) { this.shapeSel = v; this.updateAim(); this.refreshHud(); audio.click(); }
  setTraj(v) { this.trajSel = v; this.updateAim(); this.refreshHud(); audio.click(); }
  setSpin(x, y) { this.spin = { x, y }; this.updateAim(); this.refreshHud(); }

  cycleCamera() {
    const order = ['address', 'player', 'overhead', 'green'];
    const i = order.indexOf(this.camMode);
    this.setCamera(order[(i + 1) % order.length]);
  }
  setCamera(m) {
    this.camMode = m;
    this.rig.set(m, { rate: 5 });
    this.hud.toast({ address: 'Shot Camera', player: 'Player Camera', overhead: 'Overhead Map', green: 'Green Camera' }[m], '', 'info', 700);
  }

  // mouse drag orbit / wheel look-ahead
  onDrag(dx, dy) {
    if (this.state !== 'aim') return;
    if (this.camMode !== 'address') { this.camMode = 'address'; this.rig.set('address', { rate: 5 }); }
    this.rig.orbitYaw = clamp(this.rig.orbitYaw + dx * 0.005, -Math.PI, Math.PI);
    this.rig.orbitPitch = clamp(this.rig.orbitPitch - dy * 0.004, -0.3, 1.5);
  }
  onWheel(d) {
    if (this.state !== 'aim') return;
    if (this.camMode !== 'address') { this.camMode = 'address'; this.rig.set('address', { rate: 5 }); }
    if (this.rig.preview <= 0.001 && d < 0 && this.rig.zoom > 0.6) { this.rig.zoom = clamp(this.rig.zoom + d * 0.0015, 0.6, 3); return; }
    this.rig.zoom = 1;
    this.rig.preview = clamp(this.rig.preview + d * 0.0012, 0, 1);
  }

  // ---------------- swing ----------------
  swingPress() {
    audio.init();
    if (this.state === 'aim') {
      this.state = 'swing';
      this.meter = { state: 'back', power: 0, marker: 0, t: 0 };
      this.rig.preview = 0; this.rig.orbitYaw = 0; this.rig.orbitPitch = 0;
      if (this.camMode === 'overhead' || this.camMode === 'green') { this.camMode = 'address'; this.rig.set('address', { rate: 6 }); }
      this.hud.meterReset();
      return;
    }
    if (this.state === 'swing' && this.meter.state === 'down') {
      const w = timingWindow(this.club, this.typeId, this.surf, this.attrs, this.diff, this.meter.power);
      const e = -this.meter.marker / w; // positive = late
      this.hit(e);
    }
  }
  swingRelease() {
    if (this.state !== 'swing' || this.meter.state !== 'back') return;
    const m = this.meter;
    if (m.power < 0.02) { this.state = 'aim'; m.state = 'idle'; this.golfer.address(); this.hud.meterReset(); return; }
    if (this.isPutt()) { this.hit(0); return; }
    m.state = 'down';
    m.marker = m.power;
    audio.whoosh(m.power);
  }

  updateSwing(dt) {
    const m = this.meter;
    const putt = this.isPutt();
    if (m.state === 'back') {
      m.t += dt;
      const rate = putt ? 0.8 : 0.95;
      if (m.power < 1) m.power = Math.min(1, m.power + rate * dt);
      else m.power += rate * 0.45 * dt;
      const maxP = putt ? 1 : 1.12;
      if (m.power >= maxP) { m.power = maxP; if (!putt) this.swingRelease(); else this.hit(0); return; }
      this.golfer.setBackswing(putt ? m.power : Math.min(1.1, m.power));
      this.hud.meterUpdate(m.power, m.power, 'back');
    } else if (m.state === 'down') {
      const speed = 1.3 + m.power * 0.7;
      m.marker -= speed * dt;
      this.golfer.setDownswing(Math.min(1.1, m.power), clamp(m.marker / Math.max(0.05, m.power), 0, 1));
      this.hud.meterUpdate(m.power, m.marker, 'down');
      if (m.marker < -0.32) {
        const w = timingWindow(this.club, this.typeId, this.surf, this.attrs, this.diff, m.power);
        this.hit(Math.max(2.5, 0.32 / w));
      }
    }
  }

  // ---------------- hit & flight ----------------
  hit(e) {
    const hole = this.hole;
    const m = this.meter;
    m.state = 'done';
    const putt = this.isPutt();
    let launch;
    if (putt) {
      launch = computePutt({ power: m.power, scaleYd: this.puttScale / YD2FT, heading: this.heading, attrs: this.attrs, diff: this.diff, stimp: hole.stimp, rng: this.rng });
    } else {
      launch = computeLaunch({
        club: this.club, typeId: this.typeId, power: m.power, timing: e, heading: this.heading,
        shape: this.shapeSel, traj: this.trajSel, spin: this.spin, surf: this.surf,
        attrs: this.attrs, diff: this.diff, rng: this.rng,
      });
    }
    this.lastLaunch = launch;
    this.lastTiming = e;
    const startSurf = this.surf;
    const result = simulate(hole, { ...this.ball }, launch, this.env(false), { putt });
    this.shot = { launch, result, t: 0, startBall: { ...this.ball }, startSurf, club: this.club, typeId: this.typeId, evIdx: 0, landingCamSet: false, power: m.power, rolling: false };
    this.strokes++;
    this.prevBall = { ...this.ball };
    this.state = 'flight';
    this.speedMul = 1;
    this.world.clearAim();
    this.world.clearTrail();
    this.world.tee.visible = false;
    this.hud.meterUpdate(m.power, putt ? 0 : m.marker, 'hit', launch.rating);
    this.hud.meterShow(false);
    audio.impact(this.club.cat, launch.quality, putt ? m.power * 0.5 : m.power);
    if (!putt) this.hud.toast(launch.rating, '', ratingKind(launch.rating), 1100);
    this.followT = 0;
    // camera choice
    const auto = this.app.profile.settings.autoCamera;
    if (putt || this.typeId === 'chip') this.rig.set(auto ? 'follow' : this.camMode, { rate: 3 });
    else this.rig.set('launch', { from: [this.ball.x, this.ball.y], rate: 6 });
    this.hud.setHoleInfo(this.holeHeader());
  }

  updateFlight(dt) {
    const sh = this.shot;
    const r = sh.result;
    sh.t += dt * this.speedMul;
    const fr = r.frames;
    // find frame
    const t = Math.min(sh.t, r.duration);
    let i = Math.min(fr.length - 2, Math.floor(t * 60));
    while (i > 0 && fr[i].t > t) i--;
    while (i < fr.length - 2 && fr[i + 1].t < t) i++;
    const a = fr[i], b = fr[i + 1] || a;
    const f = b.t > a.t ? clamp((t - a.t) / (b.t - a.t), 0, 1) : 1;
    const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f, h = a.h + (b.h - a.h) * f;
    const vx = (b.x - a.x) * 60, vy = (b.y - a.y) * 60, vz = (b.h - a.h) * 60;
    this.world.setBall(x, y, h);
    this.ballNow = [x, y, h];
    this.ballVel = [vx, vy, vz];
    const putt = this.isPutt();
    // tracer (flight only)
    if (!putt && a.mode === 'fly' && this.app.profile.settings.tracer) {
      const q = sh.launch.quality;
      this.world.pushTrail(x, y, h, q >= 1 ? [1, 0.85, 0.3] : [1, 1, 1]);
    }
    // events
    const evs = r.events;
    while (sh.evIdx < evs.length && evs[sh.evIdx].t <= t) {
      this.onEvent(evs[sh.evIdx]);
      sh.evIdx++;
    }
    // rolling sound
    if (a.mode === 'roll' && !sh.rolling) { sh.rolling = true; audio.rollStart(); }
    if (sh.rolling) audio.rollUpdate(Math.hypot(vx, vy), this.hole.surfAt(x, y) === S.GREEN);
    // golfer follow-through
    this.followT += dt;
    const ft = clamp(this.followT / (putt ? 0.9 : 1.1), 0, 1);
    this.golfer.setFollow(ft, putt, putt ? sh.power : Math.min(1, 0.6 + sh.power * 0.4));
    // camera sequencing
    if (!putt && this.app.profile.settings.autoCamera) {
      const land = r.events.find(e => e.type === 'land' || e.type === 'splash');
      const tl = land ? land.t : r.duration;
      if (sh.t > 0.9 && sh.t < tl - 1.4 && this.rig.mode === 'launch' && tl > 2.5) this.rig.set('follow', { rate: 2.5 });
      if (!sh.landingCamSet && land && sh.t > tl - 1.4 && tl > 2) {
        sh.landingCamSet = true;
        this.rig.set('landing', { at: [land.x, land.y, land.h], cam: this.pickLandingCam(land), rate: 2 });
        this.rig.snap();
      }
    }
    if (sh.t >= r.duration + 0.25) this.finishShot();
  }

  // choose a broadcast camera spot near the landing area with a clear view
  pickLandingCam(land) {
    const hole = this.hole;
    const hx = Math.sin(this.heading), hy = Math.cos(this.heading);
    const rx = hy, ry = -hx;
    let best = null, bestScore = -1e9;
    const blocked = (x, y, h) => {
      for (const t of hole.treesNear(x, y)) {
        const d = Math.hypot(x - t.x, y - t.y);
        if (d < t.cr + 1.5 && h > t.h0 - 1 && h < t.h0 + t.ht + 1) return true;
      }
      return false;
    };
    for (const side of [1, -1]) for (const ahead of [18, 10, 26, 2]) for (const lat of [12, 7, 18]) {
      const x = land.x + hx * ahead + rx * lat * side, y = land.y + hy * ahead + ry * lat * side;
      const h = Math.max(hole.heightAt(x, y), land.h) + 3.5;
      let score = 0;
      if (blocked(x, y, h)) score -= 100;
      for (let k = 1; k < 8; k++) {
        const f = k / 8;
        const px = x + (land.x - x) * f, py = y + (land.y - y) * f, ph = h + (land.h + 1 - h) * f;
        if (blocked(px, py, ph)) score -= 12;
        if (hole.heightAt(px, py) > ph) score -= 20;
      }
      const su = hole.surfAt(x, y);
      if (su === S.WATER) score -= 3;
      score -= Math.abs(ahead - 16) * 0.1 + Math.abs(lat - 11) * 0.1;
      if (score > bestScore) { bestScore = score; best = [x, y, h]; }
    }
    return best;
  }

  onEvent(ev) {
    const w = this.world;
    switch (ev.type) {
      case 'land': case 'bounce': {
        const surfKey = ev.surf === S.SAND ? 'sand' : ev.surf === S.PATH ? 'path' : 'grass';
        audio.land(surfKey, ev.v || 12);
        if (ev.surf === S.SAND && ev.type === 'land') w.spawnBurst(ev.x, ev.y, ev.h, 'sand');
        else if (ev.type === 'land' && (ev.surf === S.FAIRWAY || ev.surf === S.ROUGH || ev.surf === S.DEEP)) w.spawnBurst(ev.x, ev.y, ev.h, 'dirt');
        break;
      }
      case 'splash': audio.splash(); w.spawnBurst(ev.x, ev.y, ev.h, 'splash'); if (this.theme.crowd) audio.crowd('groan', 0.7); break;
      case 'leaves': audio.leaves(); w.spawnBurst(ev.x, ev.y, ev.h, 'leaves'); break;
      case 'trunk': audio.knock(); break;
      case 'pin': audio.knock(); break;
      case 'lip': audio.knock(); if (this.theme.crowd) audio.crowd('ooh', 0.8); break;
      case 'cup': audio.rollStop(); audio.cup(); break;
    }
  }

  finishShot() {
    audio.rollStop();
    const sh = this.shot;
    const r = sh.result;
    const hole = this.hole;
    const startDist = hole.distToPin(sh.startBall.x, sh.startBall.y);
    const log = this.holeLog;
    const startedOnGreen = sh.startSurf === S.GREEN;
    log.shots.push({ club: sh.club.id, from: sh.startSurf, dist: startDist, carry: r.carry, total: r.total, putt: this.isPutt() || startedOnGreen, holed: r.holed, penalty: r.penalty });
    if (startedOnGreen) this.card.putts++;
    let msg = '', sub = '', kind = 'info';
    // penalties
    if (r.water || r.brush) {
      this.strokes++;
      this.card.penalties++;
      const drop = this.findDrop(r);
      this.ball = drop;
      msg = r.water ? 'WATER HAZARD' : 'PENALTY AREA'; sub = '1-stroke penalty · Take a drop'; kind = 'bad';
      if (this.cfg.mode !== 'range') this.teeShot = false;
    } else if (r.ob) {
      this.strokes++;
      this.card.penalties++;
      this.ball = { ...sh.startBall };
      msg = 'OUT OF BOUNDS'; sub = 'Stroke and distance'; kind = 'bad';
      // replay from the same spot (tee stays a tee)
    } else {
      this.ball = { x: r.end.x, y: r.end.y, h: r.end.h };
      this.teeShot = false;
    }
    const restSurf = hole.surfAt(this.ball.x, this.ball.y);
    const toPin = hole.distToPin(this.ball.x, this.ball.y);
    // hole-level stats bookkeeping
    if (!r.penalty && log.shots.length === 1 && hole.par >= 4) {
      log.fairway = restSurf === S.FAIRWAY;
      if (sh.club.cat === 'wood' || sh.club.cat === 'hybrid') log.drive = r.total;
    }
    if (log.onGreenAt == null && (restSurf === S.GREEN || r.holed) && !r.penalty) log.onGreenAt = this.strokes;
    if (r.holed) {
      this.holeOut(startDist, startedOnGreen);
      return;
    }
    // sand / around-green chances
    if (restSurf === S.SAND && toPin < 45 && log.sandFrom == null) log.sandFrom = this.strokes;
    if (restSurf !== S.GREEN && toPin < 55 && !r.penalty) log.aroundFrom = this.strokes;
    // message
    if (!msg) {
      if (this.isPutt() || startedOnGreen) {
        msg = toPin < 0.34 ? 'TAP-IN' : `${Math.round(toPin * 3)} FT LEFT`;
        sub = r.total > startDist ? 'Past the hole' : 'Short';
        kind = toPin * 3 < 3 ? 'good' : 'info';
      } else {
        msg = lieInfo(restSurf).name;
        const carry = Math.round(r.carry), tot = Math.round(r.total);
        sub = `Carry ${carry} · Total ${tot} yds · ${restSurf === S.GREEN ? Math.round(toPin * 3) + ' ft to pin' : Math.round(toPin) + ' yds to pin'}`;
        kind = restSurf === S.GREEN || restSurf === S.FAIRWAY ? 'good' : restSurf === S.SAND || restSurf === S.DEEP ? 'bad' : 'info';
        if (restSurf === S.GREEN && toPin * 3 < 10) { audio.crowd('applause', this.theme.crowd || 0.5); msg = 'STIFFED IT!'; }
        const bigDrive = log.shots.length === 1 && sh.club.cat === 'wood' && r.total > Math.max(290, sh.club.carry * 1.15);
        if (bigDrive && (restSurf === S.FAIRWAY || restSurf === S.FIRSTCUT)) {
          msg = 'WHAT A DRIVE!'; kind = 'great';
          audio.jingle('great'); audio.crowd('cheer', (this.theme.crowd || 0.5) * 0.8);
        } else if (this.cfg.mode === 'range' && r.total > 280) audio.jingle('great');
      }
    }
    this.hud.toast(msg, sub, kind, 2200);
    this.lastResult = { r, toPin };
    // gimme (tap-ins inside 9 inches are always given)
    const gimmeFt = Math.max(0.75, this.diff.gimme || 0);
    if (restSurf === S.GREEN && toPin * 3 <= gimmeFt && this.cfg.mode !== 'range') {
      this.strokes++;
      this.card.putts++;
      setTimeout(() => { this.hud.toast(toPin * 3 < 0.8 ? 'TAP-IN' : 'GIMME', '', 'good', 1000); this.holeOut(toPin, true, true); }, 700);
      this.state = 'wait';
      return;
    }
    // max strokes pick-up
    if (this.strokes >= Math.max(10, hole.par * 2 + 2) && this.cfg.mode !== 'range' && this.cfg.mode !== 'practice') {
      this.hud.toast('PICKED UP', 'Maximum strokes reached', 'bad', 1800);
      this.state = 'wait';
      setTimeout(() => this.holeOut(0, false, true), 1400);
      return;
    }
    this.state = 'result';
    if (this.cfg.mode === 'range' || this.cfg.mode === 'practice') this.hud.practiceResult(this, r, sh);
    this.resultTimer = this.cfg.mode === 'range' || this.cfg.mode === 'practice' ? 99 : 1.9;
  }

  findDrop(r) {
    const hole = this.hole;
    const fr = r.frames;
    const wet = (x, y) => { const s = hole.surfAt(x, y); return s === S.WATER || s === S.BRUSH; };
    // where the ball's ground track crossed into the penalty area
    let i = fr.length - 1;
    while (i > 0 && wet(fr[i].x, fr[i].y)) i--;
    let ex = fr[i].x, ey = fr[i].y;
    let dx = fr[Math.max(0, i - 3)].x - ex, dy = fr[Math.max(0, i - 3)].y - ey;
    let dl = Math.hypot(dx, dy);
    if (dl < 1e-3) { dx = this.shot.startBall.x - ex; dy = this.shot.startBall.y - ey; dl = Math.hypot(dx, dy) || 1; }
    dx /= dl; dy /= dl;
    for (let k = 0; k < 600; k++) {
      const x = ex + dx * k * 0.5, y = ey + dy * k * 0.5;
      let ok = !wet(x, y);
      for (let a = 0; a < 8 && ok; a++) if (wet(x + Math.cos(a) * 2, y + Math.sin(a) * 2)) ok = false;
      if (ok && !hole.isOB(x, y)) return { x, y, h: hole.heightAt(x, y) };
    }
    return { ...this.shot.startBall };
  }

  continueAfterResult() {
    if (this.state !== 'result') return;
    this.hud.practiceResult(null);
    if (this.cfg.mode === 'range') {
      const [tx, ty] = this.hole.tee;
      this.ball = { x: tx, y: ty, h: this.hole.heightAt(tx, ty) };
      this.strokes = 0; this.teeShot = true;
      const keep = { club: this.club, typeId: this.typeId, heading: this.heading };
      this.beginShot();
      if (keep.club.cat !== 'putter') { this.selectClub(keep.club); this.heading = keep.heading; this.afterAimChange(); }
      return;
    }
    if (this.cfg.mode === 'practice' && this.practiceSpot && !this.playingOut) {
      this.ball = { ...this.practiceSpot.ball };
      this.strokes = 0; this.teeShot = !!this.practiceSpot.tee;
      this.beginShot();
      return;
    }
    this.beginShot();
  }

  // ---------------- hole end ----------------
  holeOut(lastPuttDist, fromGreen, picked = false) {
    const hole = this.hole;
    const card = this.card;
    const log = this.holeLog;
    const strokes = this.strokes;
    const diff = strokes - hole.par;
    if (this.cfg.mode === 'practice' || this.cfg.mode === 'range') {
      this.playingOut = false;
      this.hud.toast(strokes === 1 ? 'IN THE HOLE!' : 'HOLED!', '', 'great', 1800);
      audio.jingle('birdie');
      this.world.spawnBurst(hole.pin[0], hole.pin[1], hole.pinH, 'confetti');
      this.state = 'result';
      this.hud.practiceResult(this, this.shot.result, this.shot);
      return;
    }
    card.strokes = strokes;
    card.fairway = hole.par >= 4 ? !!log.fairway : null;
    card.gir = log.onGreenAt != null && log.onGreenAt <= hole.par - 2;
    card.drive = log.drive || 0;
    card.longPutt = fromGreen && !picked ? lastPuttDist * 3 : 0;
    card.sandChance = log.sandFrom != null;
    card.sandSave = log.sandFrom != null && strokes - log.sandFrom <= 2;
    card.upDownChance = !card.gir && log.aroundFrom != null;
    card.upDown = card.upDownChance && strokes - log.aroundFrom <= 2;
    const name = scoreName(diff, strokes);
    this.state = 'holed';
    let kind = diff < 0 ? 'great' : diff === 0 ? 'good' : 'bad';
    // celebrations
    const crowd = this.theme.crowd || 0.5;
    if (strokes === 1) {
      audio.jingle('ace'); audio.crowd('roar', 1.3);
      this.world.spawnBurst(hole.pin[0], hole.pin[1], hole.pinH, 'confetti');
      setTimeout(() => this.world.spawnBurst(hole.pin[0], hole.pin[1], hole.pinH, 'confetti'), 700);
    } else if (diff <= -2) {
      audio.jingle('eagle'); audio.crowd('roar', crowd * 1.2);
      this.world.spawnBurst(hole.pin[0], hole.pin[1], hole.pinH, 'confetti');
    } else if (diff === -1) {
      audio.jingle('birdie'); audio.crowd('cheer', crowd);
      this.world.spawnBurst(hole.pin[0], hole.pin[1], hole.pinH, 'confetti');
    } else if (diff === 0) {
      audio.jingle('par'); audio.crowd('applause', crowd * 0.6);
    } else {
      audio.jingle('bogey'); audio.crowd('applause', crowd * 0.3);
    }
    if (fromGreen && lastPuttDist * 3 > 25 && !picked) { audio.crowd('roar', crowd); }
    const sub = picked ? '' : fromGreen && lastPuttDist > 0.5 ? `${Math.round(lastPuttDist * 3)} ft putt` : strokes > 1 && !fromGreen ? `Holed from ${Math.round(lastPuttDist)} yds!` : '';
    this.hud.banner(name, sub, kind);
    this.celebrateT = diff < 0 || (fromGreen && lastPuttDist * 3 > 20) ? 0 : null;
    this.hud.setHoleInfo(this.holeHeader());
    // golfer celebration pose
    this.rig.set('green', { rate: 1.5 });
    setTimeout(() => {
      if (this.state !== 'holed') return;
      const last = this.round.idx >= this.round.holes.length - 1;
      if (this.cfg.mode === 'coursePractice') {
        this.hud.holeComplete(this, { last: false, practice: true });
      } else {
        this.hud.holeComplete(this, { last });
      }
    }, 2600);
  }

  nextHole() {
    if (this.round.idx >= this.round.holes.length - 1) { this.finishRound(); return; }
    this.loadHole(this.round.idx + 1);
  }
  replayHole() {
    this.card.strokes = null; this.card.putts = 0; this.card.penalties = 0;
    this.loadHole(this.round.idx);
  }

  computeStats() {
    const cards = this.round.cards.filter(c => c.strokes != null);
    const st = {
      holes: cards.length, strokes: 0, par: 0, toPar: 0, putts: 0, puttHoles: cards.length,
      fairways: 0, fairwayChances: 0, gir: 0, girChances: cards.length,
      drives: 0, driveSum: 0, longestDrive: 0, longestPutt: 0,
      aces: 0, albatross: 0, eagles: 0, birdies: 0, pars: 0, bogeys: 0, doubles: 0, worse: 0,
      sandSaves: 0, sandChances: 0, upDowns: 0, upDownChances: 0, penalties: 0,
    };
    for (const c of cards) {
      st.strokes += c.strokes; st.par += c.par;
      st.putts += c.putts; st.penalties += c.penalties;
      if (c.fairway !== null) { st.fairwayChances++; if (c.fairway) st.fairways++; }
      if (c.gir) st.gir++;
      if (c.drive) { st.drives++; st.driveSum += c.drive; st.longestDrive = Math.max(st.longestDrive, c.drive); }
      st.longestPutt = Math.max(st.longestPutt, c.longPutt || 0);
      const d = c.strokes - c.par;
      if (c.strokes === 1) st.aces++;
      if (d <= -3) st.albatross++; else if (d === -2) st.eagles++; else if (d === -1) st.birdies++; else if (d === 0) st.pars++; else if (d === 1) st.bogeys++; else if (d === 2) st.doubles++; else st.worse++;
      if (c.sandChance) { st.sandChances++; if (c.sandSave) st.sandSaves++; }
      if (c.upDownChance) { st.upDownChances++; if (c.upDown) st.upDowns++; }
    }
    st.toPar = st.strokes - st.par;
    return st;
  }

  finishRound() {
    const st = this.round.stats = this.computeStats();
    this.state = 'final';
    this.app.onRoundComplete(this.round, st, this.cfg);
  }

  // ---------------- practice placement ----------------
  placePractice() {
    const hole = this.hole;
    const kind = this.cfg.practiceKind || 'approach';
    const r = this.rng;
    let spot = null;
    const tries = 400;
    const G = hole.pin;
    for (let i = 0; i < tries && !spot; i++) {
      let x, y;
      if (kind === 'putting') {
        const a = r() * Math.PI * 2, d = 2 + r() * 12;
        x = G[0] + Math.cos(a) * d; y = G[1] + Math.sin(a) * d;
        if (hole.surfAt(x, y) !== S.GREEN) continue;
      } else if (kind === 'chipping') {
        const a = r() * Math.PI * 2, d = 12 + r() * 22;
        x = G[0] + Math.cos(a) * d; y = G[1] + Math.sin(a) * d;
        const s = hole.surfAt(x, y);
        if (!(s === S.FRINGE || s === S.FIRSTCUT || s === S.ROUGH || s === S.FAIRWAY)) continue;
      } else if (kind === 'bunker') {
        const a = r() * Math.PI * 2, d = 8 + r() * 30;
        x = G[0] + Math.cos(a) * d; y = G[1] + Math.sin(a) * d;
        if (hole.surfAt(x, y) !== S.SAND) continue;
        // not too deep in: need neighbour sand
      } else if (kind === 'approach') {
        const d = 90 + r() * 90;
        const s = hole.L - d;
        const c = hole.offset(s, (r() - 0.5) * hole.fwHalf(s));
        [x, y] = c;
        if (hole.surfAt(x, y) !== S.FAIRWAY) continue;
      } else {
        [x, y] = hole.tee;
      }
      spot = { ball: { x, y, h: hole.heightAt(x, y) }, tee: kind === 'tee' };
    }
    if (!spot) {
      const c = hole.offset(Math.max(0, hole.L - 120), 0);
      spot = { ball: { x: c[0], y: c[1], h: hole.heightAt(c[0], c[1]) } };
      this.hud.toast('No such lie on this hole', 'Placed on the fairway instead', 'info', 1800);
    }
    this.practiceSpot = spot;
    this.playingOut = false;
    this.ball = { ...spot.ball };
    this.teeShot = !!spot.tee;
    this.strokes = 0;
    this.beginShot(true);
  }
  newPracticeSpot() {
    this.hud.practiceResult(null);
    if (this.cfg.mode === 'practice') this.placePractice();
  }

  endFlyover() {
    if (this.state !== 'flyover') return;
    this.beginShot(true);
  }

  // ---------------- frame update ----------------
  update(dt) {
    if (this.state === 'off' || this.state === 'loading' || !this.hole) return;
    const hole = this.hole;
    if (this.state === 'flyover') {
      this.flyT += dt / 7.5;
      this.rig.opts.t = this.flyT;
      if (this.flyT >= 1.05) this.endFlyover();
    }
    if (this.state === 'aim') {
      const turn = (this.isPutt() ? 0.12 : 0.35) * DEG * 60 * dt * (this.keys.size ? (1 + Math.min(3, (this.aimHold = (this.aimHold || 0) + dt) * 2)) : 1);
      if (this.keys.has('left') || this.keys.has('right')) {
        this.heading += this.keys.has('left') ? -turn : turn;
        this.aimDirty = true;
        this.golfer.placeAtBall(P(this.ball.x, this.ball.y, this.ball.h), this.heading);
        if (this.aimRefreshT > 0.06) this.refreshHud(true);
      } else {
        this.aimHold = 0;
        if (this.aimDirty) { this.aimDirty = false; this.updateAim(); this.refreshHud(); }
      }
      this.aimRefreshT = (this.aimRefreshT || 0) + dt;
      if (this.aimDirty && this.aimRefreshT > 0.08) { this.aimRefreshT = 0; this.updateAim(); }
      this.golfer.idle(this.world.time);
    }
    if (this.state === 'swing') this.updateSwing(dt);
    if (this.state === 'flight') this.updateFlight(dt);
    if (this.state === 'holed' && this.celebrateT != null) {
      this.celebrateT += dt;
      if (this.celebrateT < 2.4) this.golfer.celebrate(this.celebrateT);
    }
    if (this.state === 'result') {
      this.resultTimer -= dt;
      if (this.resultTimer <= 0) this.continueAfterResult();
    }
    // camera context
    const ball = this.state === 'flight' ? this.ballNow : [this.ball.x, this.ball.y, this.ball.h];
    this.rig.update(dt, {
      hole, ball, heading: this.heading, vel: this.ballVel, putt: this.club && this.isPutt(),
      aimDist: this.isPutt() ? this.distPin : (this.aimDist || 150),
      target: this.previewLanding || hole.pin,
    });
    // wind arrow relative to camera
    const cam = this.world.camera;
    const fwd = new THREE.Vector3(); cam.getWorldDirection(fwd);
    const camHeading = Math.atan2(fwd.x, -fwd.z);
    this.hud.setWind(this.windDirPlan - camHeading, this.windBaseMph * (this.gust || 1));
    this.world.windDir = -(this.windDirPlan) + Math.PI / 2;
    // flag ~ faces wind
    if (this.state === 'flight' || this.state === 'aim' || this.state === 'swing') this.hud.drawMapBall(this, ball);
  }
}

function ratingKind(r) {
  if (r === 'PERFECT' || r === 'PURE') return 'great';
  if (r === 'GREAT' || r === 'GOOD') return 'good';
  if (r === 'EARLY' || r === 'LATE') return 'info';
  return 'bad';
}
