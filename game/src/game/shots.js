// Shot types, lies, and converting player input into launch conditions.
import { S, SURF_KEYS } from '../core/holeGen.js';
import { LIES } from '../data/themes.js';
import { speedForCarry, greenRollDecel, MPH } from '../core/physics.js';
import { clamp } from '../core/noise.js';

export const SHOT_TYPES = {
  normal: { id: 'normal', name: 'Normal', carryMul: 1, launchAdd: 0, launchMul: 1, spinMul: 1, windowMul: 1, desc: 'Full swing' },
  punch: { id: 'punch', name: 'Punch', carryMul: 0.78, launchAdd: -5, launchMul: 1, spinMul: 0.55, windowMul: 1.1, desc: 'Low, under the wind & branches' },
  chip: { id: 'chip', name: 'Chip', carryMul: 0.36, launchAdd: 0, launchMul: 0.6, spinMul: 0.45, windowMul: 1.45, desc: 'Low runner around the green' },
  pitch: { id: 'pitch', name: 'Pitch', carryMul: 0.62, launchAdd: 1, launchMul: 1.05, spinMul: 0.9, windowMul: 1.25, desc: 'Controlled partial wedge' },
  lob: { id: 'lob', name: 'Lob', carryMul: 0.55, launchAdd: 9, launchMul: 1, spinMul: 1.0, windowMul: 1.0, desc: 'High & soft' },
  flop: { id: 'flop', name: 'Flop', carryMul: 0.4, launchAdd: 20, launchMul: 1, spinMul: 0.85, windowMul: 0.75, desc: 'Sky-high, stops dead. Risky.' },
  bunker: { id: 'bunker', name: 'Bunker', carryMul: 0.48, launchAdd: 12, launchMul: 1, spinMul: 0.75, windowMul: 1.1, desc: 'Splash it out on a cushion of sand' },
  putt: { id: 'putt', name: 'Putt', carryMul: 0, launchAdd: 0, launchMul: 0, spinMul: 0, windowMul: 1, desc: 'Roll it' },
};

export function lieInfo(surf) {
  const key = SURF_KEYS[surf];
  return { key, ...(LIES[key] || LIES.rough) };
}

export function availableTypes(surf, club, distToPin) {
  const wedge = club.cat === 'wedge';
  const putter = club.cat === 'putter';
  if (putter) return ['putt'];
  let t;
  switch (surf) {
    case S.TEE: t = ['normal', 'punch']; if (distToPin < 120) t.push('pitch', 'lob'); break;
    case S.GREEN: t = ['chip']; break;
    case S.FRINGE: t = ['chip', 'pitch', 'lob', 'flop']; break;
    case S.SAND: t = ['bunker', 'normal', 'punch']; break;
    case S.DEEP: t = ['normal', 'punch', 'pitch', 'chip']; break;
    case S.ROUGH: case S.STRAW: case S.WASTE: t = ['normal', 'punch', 'pitch', 'chip', 'lob']; break;
    default: t = ['normal', 'punch', 'pitch', 'chip', 'lob', 'flop'];
  }
  return t.filter(k => {
    if ((k === 'lob' || k === 'flop') && !wedge) return false;
    if (k === 'pitch' && !(wedge || club.id === '9I' || club.id === '8I')) return false;
    if (k === 'bunker' && club.cat === 'wood') return false;
    return true;
  });
}

// carry at 100% meter for a club/type/lie (no randomness)
export function fullCarry(club, typeId, surf, recovery = 50) {
  if (club.cat === 'putter') return 0;
  const t = SHOT_TYPES[typeId] || SHOT_TYPES.normal;
  return club.carry * t.carryMul * lieMultiplier(surf, typeId, club, recovery, 0.5);
}

export function lieMultiplier(surf, typeId, club, recovery, r = Math.random()) {
  if (surf === S.SAND && typeId === 'bunker') return 1;
  const L = lieInfo(surf);
  let [lo, hi] = L.dist;
  if (surf === S.SAND && club.cat === 'wood') { lo *= 0.7; hi *= 0.75; }
  if (surf === S.TEE && club.cat !== 'wood') { lo = hi = 1; }
  if ((surf === S.ROUGH || surf === S.DEEP) && (typeId === 'chip' || typeId === 'pitch')) { lo = lo * 0.5 + 0.5; hi = hi * 0.5 + 0.5; }
  const shift = (recovery - 50) / 100 * 0.6; // better recovery narrows penalty
  lo = lo + (hi - lo) * clamp(shift + 0.2, 0, 0.9);
  return lo + (hi - lo) * r;
}

export function lieRangeText(surf, typeId, club, recovery) {
  if (surf === S.GREEN) return '100%';
  const a = Math.round(lieMultiplier(surf, typeId, club, recovery, 0) * 100);
  const b = Math.round(lieMultiplier(surf, typeId, club, recovery, 1) * 100);
  return a === b ? `${a}%` : `${a}-${b}%`;
}

const catSkill = (club, attrs) => club.cat === 'wood' || club.cat === 'hybrid' ? attrs.driving : club.cat === 'wedge' ? attrs.shortGame : club.cat === 'putter' ? attrs.putting : attrs.approach;

// half-width of the sweet spot on the meter (1.0 = full meter)
export function timingWindow(club, typeId, surf, attrs, diff, power = 1) {
  const t = SHOT_TYPES[typeId] || SHOT_TYPES.normal;
  const skill = catSkill(club, attrs);
  let w = 0.075 * diff.window * (0.7 + skill / 100 * 0.65) * (0.75 + club.forgiveness * 0.4) * t.windowMul;
  w /= Math.sqrt(lieInfo(surf).disp);
  if (power > 1) w *= Math.max(0.35, 1 - (power - 1) * 4);
  return w;
}

export function gaussRand(r = Math.random) {
  let u = 0, v = 0;
  while (u === 0) u = r();
  while (v === 0) v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Build launch conditions.
 * input: {club, typeId, power, timing (e: -early..+late, in window units), heading, shape: -1 draw..1 fade,
 *         traj: -1 low..1 high, spin:{x,y}, surf, attrs, diff, rng}
 */
export function computeLaunch(inp) {
  const { club, typeId, power, timing: e, surf, attrs, diff } = inp;
  const rng = inp.rng || Math.random;
  const gauss = inp.noNoise ? () => 0 : gaussRand;
  const t = SHOT_TYPES[typeId] || SHOT_TYPES.normal;
  const lie = lieInfo(surf);
  const DEG = Math.PI / 180;
  const ae = Math.abs(e);
  let rating, quality;
  if (ae < 0.18) { rating = 'PERFECT'; quality = 1.015; }
  else if (ae < 0.55) { rating = 'GREAT'; quality = 1.0 - 0.02 * ae; }
  else if (ae <= 1) { rating = e < 0 ? 'EARLY' : 'LATE'; quality = 0.985 - 0.05 * ae; }
  else { rating = e < 0 ? 'HOOK' : 'SLICE'; quality = Math.max(0.62, 0.92 - 0.12 * (ae - 1)); }
  if (ae > 2.2) rating = e < 0 ? 'SNAP HOOK' : 'SHANK';

  const catF = club.cat === 'wood' ? 1 : club.cat === 'hybrid' ? 0.85 : club.cat === 'iron' ? 0.75 : 0.45;
  const forg = club.forgiveness;
  // face / path from timing
  const eC = clamp(e, -3, 3);
  let startDeg = eC * 1.0 * (1.35 - forg * 0.6);
  let sideRpm = eC * (Math.abs(eC) > 1 ? 950 : 750) * catF * (1.35 - forg * 0.6);
  // intentional shape
  const shapeScale = club.cat === 'wood' ? 1.15 : club.cat === 'hybrid' ? 1.0 : club.cat === 'iron' ? 0.9 : 0.35;
  startDeg += -inp.shape * 1.6 * shapeScale;
  sideRpm += inp.shape * 620 * shapeScale;
  // ball-spin widget
  const sp = inp.spin || { x: 0, y: 0 };
  sideRpm += sp.x * 380 * shapeScale;
  // dispersion
  const accuracy = club.accuracy;
  const overs = Math.max(0, power - 1);
  const sigDir = (1 - accuracy) * 5.5 * diff.disp * lie.disp * (1 + overs * 5) * (typeId === 'chip' || typeId === 'pitch' ? 0.6 : 1);
  startDeg += gauss(rng) * sigDir * 0.6;
  sideRpm += gauss(rng) * sigDir * 70 * catF;
  const sigCarry = 0.022 * diff.disp * lie.disp;
  // launch & spin
  let launch = club.launch * t.launchMul + t.launchAdd;
  let spin = club.spin * t.spinMul * lie.spin;
  if (inp.traj > 0) { launch += 3.5 * inp.traj; spin *= 1 + 0.12 * inp.traj; }
  if (inp.traj < 0) { launch += 3.5 * inp.traj; spin *= 1 + 0.15 * inp.traj; }
  spin *= 1 - 0.42 * sp.y;
  launch -= 1.5 * sp.y;
  if (surf === S.SAND && typeId === 'bunker') spin *= 0.8;
  if (surf === S.ROUGH || surf === S.DEEP) launch += 1.2;
  launch = Math.max(typeId === 'chip' ? 5 : 4, launch);
  // lower power -> slightly lower launch & spin
  if (power < 1) { launch *= 0.85 + 0.15 * power; spin *= 0.6 + 0.4 * power; }
  const recovery = attrs.recovery ?? 50;
  const lieMul = lieMultiplier(surf, typeId, club, recovery, inp.noNoise ? 0.5 : rng());
  const trajMul = inp.traj ? 0.97 : 1;
  const carry = club.carry * t.carryMul * power * lieMul * quality * trajMul * (1 + gauss(rng) * sigCarry);
  const speed = speedForCarry(Math.max(1, carry), launch, spin);
  return {
    speed, heading: inp.heading + startDeg * DEG, angle: launch * DEG, back: spin, side: sideRpm,
    rating, quality, lieMul, targetCarry: carry, ballMph: speed / MPH, launchDeg: launch,
  };
}

// putting: returns launch for rolling ball
export function computePutt(inp) {
  const { power, scaleYd, heading, attrs, diff, stimp } = inp;
  const rng = inp.rng || Math.random;
  const a = greenRollDecel(stimp);
  const D = Math.max(0.05, power * scaleYd);
  const skill = attrs.putting ?? 50;
  const errDir = gaussRand(rng) * (1.25 - skill / 100) * 0.55 * diff.putt * (0.6 + Math.min(1, D / 15) * 0.6);
  const errSpd = 1 + gaussRand(rng) * 0.03 * diff.putt * (1.2 - skill / 120);
  const v0 = Math.sqrt(2 * a * D) * errSpd;
  const offBy = Math.abs(errDir);
  return { speed: v0, heading: heading + errDir * Math.PI / 180, angle: 0, back: 0, side: 0, rating: offBy < 0.3 ? 'PURE' : offBy < 0.7 ? 'GOOD' : errDir < 0 ? 'PULLED' : 'PUSHED', quality: 1 };
}

export const PUTT_SCALES_FT = [8, 15, 25, 40, 60, 90, 130];
export function pickPuttScale(distYd) {
  const ft = distYd * 3 * 1.3;
  for (const s of PUTT_SCALES_FT) if (s >= ft) return s;
  return PUTT_SCALES_FT[PUTT_SCALES_FT.length - 1];
}

// "plays like" distance from elevation and wind
export function playsLike(dist, elevYd, windAlong) {
  // uphill adds distance; headwind (negative along) adds ~1% per mph
  return dist + elevYd * 1.0 - windAlong / MPH * dist * 0.009;
}

// recommend club for a target distance
export function recommendClub(bag, dist, surf, recovery, typeId = 'normal') {
  const clubs = bag.filter(c => c.cat !== 'putter');
  let best = clubs[clubs.length - 1];
  const sorted = clubs.slice().sort((a, b) => a.carry - b.carry);
  for (const c of sorted) {
    if (surf !== S.TEE && c.id === 'DR') continue;
    const fc = fullCarry(c, typeId, surf, recovery);
    if (fc >= dist * 0.98) { best = c; break; }
    best = c;
  }
  return best;
}
