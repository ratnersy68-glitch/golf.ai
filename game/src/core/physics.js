// Golf ball physics (units: yards, seconds, rpm).
// Flight: gravity + quadratic drag + Magnus lift, wind with height profile.
// Ground: bounce with restitution/friction/spin bite, then rolling with slope.

import { S } from './holeGen.js';
import { clamp } from './noise.js';

export const G = 9.81 / 0.9144;          // yd/s^2
const KD = 0.5 * 1.225 * Math.PI * 0.02134 ** 2 / 0.04593 * 0.9144; // drag factor per yard
const R_BALL = 0.02134 / 0.9144;         // yd
export const CUP_R = 0.054 / 0.9144;     // yd
export const MPH = 0.44704 / 0.9144;     // mph -> yd/s
const RPM = Math.PI * 2 / 60;

// Surface response table
const SURF = [];
const def = (id, e, mu, grip, roll) => { SURF[id] = { e, mu, grip, roll }; };
//  restitution, tangential friction at impact, spin bite, rolling resistance (fraction of g)
def(S.DEEP, 0.07, 0.75, 0.15, 0.9);
def(S.ROUGH, 0.14, 0.55, 0.3, 0.45);
def(S.FIRSTCUT, 0.24, 0.4, 0.6, 0.26);
def(S.FAIRWAY, 0.3, 0.32, 0.8, 0.19);
def(S.FRINGE, 0.26, 0.38, 0.9, 0.12);
def(S.GREEN, 0.22, 0.3, 1.0, 0.05);
def(S.TEE, 0.3, 0.35, 0.7, 0.19);
def(S.SAND, 0.03, 0.9, 0.2, 1.4);
def(S.WASTE, 0.16, 0.5, 0.3, 0.4);
def(S.WATER, 0, 1, 0, 5);
def(S.BRUSH, 0.05, 0.9, 0, 2);
def(S.STRAW, 0.18, 0.5, 0.2, 0.42);
def(S.PATH, 0.55, 0.2, 0.4, 0.06);

export function greenRollDecel(stimp) {
  // stimp (ft): ball at 6 ft/s (1.829 m/s) rolls stimp ft
  const v0 = 1.829 / 0.9144, d = stimp / 3;
  return (v0 * v0) / (2 * d); // yd/s^2
}

// Aerodynamic coefficients from spin factor
function coeffs(Sf) {
  const Cd = 0.215 + 0.26 * Sf;
  const Cl = Math.min(0.32, 1.9 * Sf - 2.6 * Sf * Sf);
  return [Cd, Math.max(0, Cl)];
}

/**
 * Simulate a full shot.
 * start: {x,y,h}
 * launch: {speed (yd/s), heading (rad, plan: 0 = +y, + = right), angle (rad), back (rpm), side (rpm, + curves right)}
 * env: {wind:[wx,wy] yd/s, firmness 0..1, stimp, assist:{cupMul, captureMul}, rng}
 * opts: {putt:boolean, flightOnly:boolean}
 */
export function simulate(hole, start, launch, env, opts = {}) {
  const dt = 1 / 240;
  const rec = 4; // record every 4 steps -> 60Hz
  const frames = [];
  const events = [];
  const rng = env.rng || Math.random;
  let x = start.x, y = start.y, h = start.h;
  const ch = Math.cos(launch.angle), sh = Math.sin(launch.angle);
  const hx = Math.sin(launch.heading), hy = Math.cos(launch.heading);
  let vx = launch.speed * ch * hx, vy = launch.speed * ch * hy, vz = launch.speed * sh;
  // spin axis: back about (f x up) = (hy, -hx, 0); side positive curves right => axis -up
  let back = launch.back * RPM, side = launch.side * RPM;
  const ax0 = hy, ay0 = -hx;
  let mode = opts.putt || launch.speed < 0.01 ? 'roll' : 'fly';
  if (opts.putt) vz = 0;
  const firm = env.firmness ?? 0.6;
  const greenDecel = greenRollDecel(env.stimp ?? 12);
  const cupR = CUP_R * (env.assist?.cupMul ?? 1);
  const capV = 1.78 * (env.assist?.captureMul ?? 1);
  const wind = env.wind || [0, 0];
  const pin = hole.pin;
  let t = 0, step = 0;
  let carry = null, apex = start.h, landed = false;
  let result = { holed: false, water: false, ob: false, penalty: false };
  let bounces = 0;
  let inTree = false;
  let lastSurf = hole.surfAt(x, y);
  const pushFrame = () => frames.push({ t, x, y, h, mode });
  pushFrame();
  const maxT = opts.flightOnly ? 15 : 40;
  let lastGroundH = hole.heightAt(x, y);
  let lipped = false;
  let pinHit = false;

  while (t < maxT) {
    t += dt; step++;
    if (mode === 'fly') {
      const gh = hole.heightAt(x, y);
      const above = Math.max(0, h - gh);
      const wf = 0.55 + 0.45 * Math.min(1, above / 25);
      const rvx = vx - wind[0] * wf, rvy = vy - wind[1] * wf, rvz = vz;
      const V = Math.hypot(rvx, rvy, rvz) + 1e-6;
      const w = Math.hypot(back, side);
      const Sf = R_BALL * w / V;
      const [Cd, Cl] = coeffs(Sf);
      // drag
      let axc = -KD * Cd * V * rvx, ayc = -KD * Cd * V * rvy, azc = -KD * Cd * V * rvz - G;
      if (w > 1) {
        // spin axis unit
        const sx = (back * ax0) / w, sy = (back * ay0) / w, sz = (-side) / w;
        // (s x v)/|v|
        const cx = sy * rvz - sz * rvy, cy = sz * rvx - sx * rvz, cz = sx * rvy - sy * rvx;
        const k = KD * Cl * V; // * V^2 / V
        axc += k * cx; ayc += k * cy; azc += k * cz;
      }
      vx += axc * dt; vy += ayc * dt; vz += azc * dt;
      x += vx * dt; y += vy * dt; h += vz * dt;
      back *= 1 - dt / 22; side *= 1 - dt / 22;
      if (h > apex) apex = h;

      // trees
      const trees = hole.treesNear(x, y);
      let nowInTree = false;
      for (let i = 0; i < trees.length; i++) {
        const tr = trees[i];
        const dx = x - tr.x, dy = y - tr.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > tr.cr * tr.cr) continue;
        const hz = h - tr.h0;
        if (hz < 0 || hz > tr.ht) continue;
        const d = Math.sqrt(d2);
        // trunk
        if (d < tr.tr + R_BALL && hz < tr.cb + 1) {
          const nx = dx / (d || 1), ny = dy / (d || 1);
          const vn = vx * nx + vy * ny;
          if (vn < 0) { vx -= 1.6 * vn * nx; vy -= 1.6 * vn * ny; vx *= 0.5; vy *= 0.5; }
          events.push({ t, type: 'trunk', x, y, h });
          continue;
        }
        if (hz > tr.cb) {
          // canopy volume (cone for pines, ellipsoid otherwise)
          const rel = (hz - tr.cb) / Math.max(1, tr.ht - tr.cb);
          const rad = tr.type === 'pine' || tr.type === 'longleaf' ? tr.cr * (1 - rel * 0.85) : tr.cr * Math.sqrt(Math.max(0, 1 - (rel * 2 - 1) ** 2));
          if (d < rad * 0.92) {
            nowInTree = true;
            const damp = Math.pow(0.12, dt);
            vx *= damp; vy *= damp; vz *= Math.pow(0.4, dt);
            vx += (rng() - 0.5) * 30 * dt; vy += (rng() - 0.5) * 30 * dt;
            back *= 0.98; side *= 0.95;
          }
        }
      }
      if (nowInTree && !inTree) events.push({ t, type: 'leaves', x, y, h });
      inTree = nowInTree;

      // flagstick
      if (pin && !pinHit) {
        const pdx = x - pin[0], pdy = y - pin[1];
        if (pdx * pdx + pdy * pdy < (0.035 + R_BALL) ** 2 && h - hole.pinH < 2.4 && h > hole.pinH + 0.05 && pdx * vx + pdy * vy < 0) {
          pinHit = true;
          vx *= -0.25; vy *= -0.25; vz *= 0.3;
          events.push({ t, type: 'pin', x, y, h });
        }
      }

      const g2 = hole.heightAt(x, y);
      // water check (water surface sits above the lake bed)
      const surf = hole.surfAt(x, y);
      if (surf === S.WATER) {
        const lvl = hole.waterLevelAt(x, y);
        if (lvl !== null && h <= lvl) {
          h = lvl;
          events.push({ t, type: 'splash', x, y, h });
          if (carry === null) carry = Math.hypot(x - start.x, y - start.y);
          result.water = true; result.penalty = true;
          pushFrame();
          break;
        }
      }
      if (h <= g2) {
        // ground contact
        h = g2;
        if (carry === null) {
          carry = Math.hypot(x - start.x, y - start.y); events.push({ t, type: 'land', x, y, h, surf });
          if (opts.flightOnly) { pushFrame(); break; }
        }
        else events.push({ t, type: 'bounce', x, y, h, surf, v: Math.hypot(vx, vy, vz) });
        bounces++;
        if (surf === S.BRUSH) {
          events.push({ t, type: 'brush', x, y, h });
          result.penalty = true; result.brush = true;
          pushFrame();
          break;
        }
        // dunk in the cup
        if (pin) {
          const pd = Math.hypot(x - pin[0], y - pin[1]);
          if (pd < cupR + R_BALL * 0.5 && Math.hypot(vx, vy) < 9) {
            result.holed = true; events.push({ t, type: 'cup', x: pin[0], y: pin[1], h: hole.pinH, dunk: true });
            x = pin[0]; y = pin[1]; h = hole.pinH - 0.1;
            pushFrame();
            break;
          }
        }
        const sp = SURF[surf] || SURF[S.ROUGH];
        const [gx, gy] = hole.gradAt(x, y);
        let nx = -gx, ny = -gy, nz = 1;
        const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
        const vn = vx * nx + vy * ny + vz * nz;
        let tx = vx - vn * nx, ty = vy - vn * ny, tz = vz - vn * nz;
        const impact = Math.abs(vn);
        let e = sp.e * (0.75 + 0.5 * firm) * clamp(1.25 - impact / 45, 0.45, 1.2);
        if (surf === S.GREEN || surf === S.FRINGE) e *= 0.9 + 0.3 * firm;
        // friction + spin "check": steep, high-spin landings on soft receptive turf stop quickly
        const mu = sp.mu * (1.15 - 0.3 * firm);
        const tl = Math.hypot(tx, ty, tz) || 1;
        const vtot = Math.hypot(vx, vy, vz) || 1;
        const steep2 = (impact / vtot) ** 2;
        const soft = 1.15 - 0.45 * firm;
        let ret;
        if (bounces === 1) {
          const spinF = Math.min(1.1, (back / RPM) / 10000);
          ret = 1 - mu - sp.grip * soft * (0.55 * steep2 + 0.55 * spinF);
          ret = Math.max(spinF > 0.75 && sp.grip >= 0.9 ? -0.12 : 0.02, Math.min(0.92, ret));
        } else {
          ret = Math.max(0, 1 - mu * 0.8 - sp.grip * soft * 0.25 * steep2);
        }
        tx = tx / tl * tl * ret; ty = ty / tl * tl * ret; tz = tz / tl * tl * ret;
        back *= 0.25; side *= 0.3;
        vx = tx + nx * impact * e; vy = ty + ny * impact * e; vz = tz + nz * impact * e;
        h = g2 + 0.001;
        if (impact * e < 1.2 || bounces > 8) {
          mode = 'roll';
          vz = 0;
        }
        if (!landed) landed = true;
      }
    } else {
      // rolling
      const surf = hole.surfAt(x, y);
      lastSurf = surf;
      const sp = SURF[surf] || SURF[S.ROUGH];
      const [gx, gy] = hole.gradAt(x, y);
      let rollA = surf === S.GREEN ? greenDecel : sp.roll * G * (surf === S.FAIRWAY || surf === S.FRINGE || surf === S.FIRSTCUT ? (1.25 - 0.5 * firm) : 1);
      if (surf === S.FRINGE) rollA = Math.max(rollA, greenDecel * 2.2);
      let sp2 = Math.hypot(vx, vy);
      // slope acceleration (5/7 for rolling sphere)
      const ax = -G * gx * 5 / 7, ay = -G * gy * 5 / 7;
      if (sp2 > 1e-4) {
        const dec = Math.min(rollA, sp2 / dt);
        vx += (ax - dec * vx / sp2) * dt;
        vy += (ay - dec * vy / sp2) * dt;
      } else {
        const slopeA = Math.hypot(ax, ay);
        if (slopeA < rollA * 1.05) { vx = 0; vy = 0; }
        else { vx += ax * dt; vy += ay * dt; }
      }
      x += vx * dt; y += vy * dt;
      h = hole.heightAt(x, y);
      sp2 = Math.hypot(vx, vy);

      // cup
      if (pin) {
        const pdx = x - pin[0], pdy = y - pin[1];
        const pd = Math.hypot(pdx, pdy);
        if (pd < cupR) {
          if (sp2 < capV) {
            result.holed = true;
            events.push({ t, type: 'cup', x: pin[0], y: pin[1], h: hole.pinH });
            x = pin[0]; y = pin[1]; h = hole.pinH - 0.08;
            pushFrame();
            break;
          } else if (!lipped) {
            // lip out: deflect and slow
            lipped = true;
            const ang = (rng() - 0.5) * 1.4;
            const c = Math.cos(ang), s = Math.sin(ang);
            const nvx = (vx * c - vy * s) * 0.55, nvy = (vx * s + vy * c) * 0.55;
            vx = nvx; vy = nvy;
            events.push({ t, type: 'lip', x, y, h });
          }
        } else if (pd > cupR * 3) lipped = false;
      }
      // water / penalty
      if (surf === S.WATER) {
        const lvl = hole.waterLevelAt(x, y);
        if (lvl !== null && h <= lvl + 0.05) {
          h = lvl;
          events.push({ t, type: 'splash', x, y, h, roll: true });
          result.water = true; result.penalty = true;
          pushFrame();
          break;
        }
      }
      if (surf === S.BRUSH) {
        events.push({ t, type: 'brush', x, y, h });
        result.penalty = true; result.brush = true;
        pushFrame();
        break;
      }
      if (sp2 < 0.01) {
        const slopeA = Math.hypot(ax, ay);
        if (slopeA < rollA * 1.05) { vx = vy = 0; pushFrame(); break; }
      }
    }
    if (step % rec === 0) pushFrame();
  }
  if (carry === null) carry = Math.hypot(x - start.x, y - start.y);
  const endSurf = hole.surfAt(x, y);
  if (!result.penalty && !result.holed && hole.isOB(x, y)) { result.ob = true; result.penalty = true; }
  events.push({ t, type: 'rest', x, y, h });
  return {
    frames, events, duration: t,
    end: { x, y, h }, surf: endSurf, carry, apex: apex - start.h,
    total: Math.hypot(x - start.x, y - start.y), ...result,
  };
}


// Flat-ground, no-wind carry for given launch (used to solve ball speed).
export function flatCarry(speed, angleDeg, backRpm) {
  const dt = 1 / 120;
  let x = 0, z = 0;
  const a = angleDeg * Math.PI / 180;
  let vx = speed * Math.cos(a), vz = speed * Math.sin(a);
  let back = backRpm * RPM;
  let apex = 0;
  for (let i = 0; i < 20 * 120; i++) {
    const V = Math.hypot(vx, vz) + 1e-6;
    const Sf = R_BALL * back / V;
    const [Cd, Cl] = coeffs(Sf);
    // lift perpendicular to velocity (rotate v by +90deg in x-z plane): (-vz, vx)
    const ax = -KD * Cd * V * vx + KD * Cl * V * (-vz);
    const az = -KD * Cd * V * vz + KD * Cl * V * vx - G;
    vx += ax * dt; vz += az * dt;
    x += vx * dt; z += vz * dt;
    back *= 1 - dt / 22;
    if (z > apex) apex = z;
    if (z < 0 && vz < 0) return { carry: x, apex, landAngle: Math.atan2(-vz, vx) * 180 / Math.PI, time: i * dt };
  }
  return { carry: x, apex, landAngle: 45, time: 20 };
}

const speedCache = new Map();
export function speedForCarry(carry, angleDeg, backRpm) {
  if (carry <= 0.5) return 0;
  const key = `${carry.toFixed(1)}|${angleDeg.toFixed(1)}|${Math.round(backRpm / 50)}`;
  if (speedCache.has(key)) return speedCache.get(key);
  let lo = 2, hi = 140;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (flatCarry(mid, angleDeg, backRpm).carry < carry) lo = mid; else hi = mid;
  }
  const v = (lo + hi) / 2;
  if (speedCache.size > 5000) speedCache.clear();
  speedCache.set(key, v);
  return v;
}
