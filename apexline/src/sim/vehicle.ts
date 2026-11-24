import { dsin, dcos, clamp, smooth01 } from './dmath';
import { Track, DS, F_GAP, F_BOOST, F_NOWALL, frameAt, locate } from './track';

export const TICK_RATE = 120;
export const DT = 1 / TICK_RATE;
export const G = 9.81;
const HUB = 0.45; // chassis centre height above the road surface
const HALF_W = 0.95; // half car width used for walls

export interface VehicleParams {
  accel: number; // launch acceleration m/s^2
  power: number; // power / mass  (m^2/s^3)
  cd: number; // quadratic drag per unit mass (1/m)
  brake: number; // peak braking decel m/s^2
  mu: number; // tyre friction coefficient
  stiff: number; // cornering stiffness (1/rad)
  steerMax: number; // max steer angle at standstill (rad)
  steerSpeed: number; // speed (m/s) at which steering authority halves in rate
  steerRate: number; // rad/s steering actuator rate
  downforce: number; // aero downforce factor (1/m)
  inertia: number; // yaw radius of gyration^2 (m^2)
  airCtl: number; // air control multiplier
  hbGrip: number; // rear grip multiplier with handbrake
  driveRear: number; // fraction of drive torque at rear (1=RWD, .5=AWD, 0=FWD)
  boost: number; // boost pad acceleration m/s^2
  offroad: number; // 0..1 how much of the loose-surface grip penalty is cancelled
  a: number; b: number; h: number; // CG->front axle, CG->rear axle, CG height (m)
}

/** The normalised vehicle used by every ranked / benchmark run so cosmetics and purchases can never change a record. */
export const STANDARD: VehicleParams = {
  accel: 11.5, power: 125, cd: 0.00043, brake: 17, mu: 1.35, stiff: 7.5,
  steerMax: 0.5, steerSpeed: 17, steerRate: 5.5, downforce: 0.0011, inertia: 2.3,
  airCtl: 1, hbGrip: 0.42, driveRear: 0.7, boost: 26, offroad: 0, a: 1.25, b: 1.45, h: 0.52,
};

export interface Input { thr: number; brk: number; steer: number; hb: number }
export const NEUTRAL: Input = { thr: 0, brk: 0, steer: 0, hb: 0 };

export const EV_CP = 1, EV_FINISH = 2, EV_LAND = 4, EV_WALL = 8, EV_CRASH = 16, EV_RESPAWN = 32, EV_BOOST = 64, EV_TAKEOFF = 128, EV_OBST = 256;

const MU_SURF = [1.0, 0.72, 0.5, 0.2, 0.62, 1.0];
const RR_SURF = [0.2, 0.7, 1.5, 0.1, 2.0, 0.15];

export class Sim {
  tick = 0;
  air = false;
  // ground state (road coordinates)
  s = 0; d = 0; hc = 1; hs = 0; vx = 0; vy = 0; w = 0; steerA = 0; axLong = 0;
  // air state (world coordinates)
  px = 0; py = 0; pz = 0; vwx = 0; vwy = 0; vwz = 0;
  fx = 0; fy = 0; fz = -1; ux = 0; uy = 1; uz = 0;
  airTicks = 0; takeoffX = 0; takeoffZ = 0; hint = 0;
  // race state
  cp = 0; finished = false; finishMs = 0; crashes = 0; respawns = 0; wallHits = 0;
  topSpeed = 0; distance = 0; longestJump = 0; airTotal = 0; boosted = 0;
  events = 0; impact = 0; // events of the last step
  lastObst = -1000;
  slipR = 0; // rear slip magnitude (0..1) for FX / audio
  lastSlipF = 0;
  readonly tmp = { px: 0, py: 0, pz: 0, tx: 0, ty: 0, tz: 0, ux: 0, uy: 0, uz: 0, rx: 0, ry: 0, rz: 0 };

  constructor(public track: Track, public P: VehicleParams = STANDARD) { this.reset(); }

  reset(): void {
    this.tick = 0; this.air = false; this.s = 3; this.d = 0; this.hc = 1; this.hs = 0;
    this.vx = 0; this.vy = 0; this.w = 0; this.steerA = 0; this.axLong = 0;
    this.cp = 0; this.finished = false; this.finishMs = 0; this.crashes = 0; this.respawns = 0; this.wallHits = 0;
    this.topSpeed = 0; this.distance = 0; this.longestJump = 0; this.airTotal = 0; this.airTicks = 0; this.boosted = 0;
    this.events = 0; this.impact = 0; this.slipR = 0; this.lastObst = -1000; this.hint = this.s / DS;
  }

  get speed(): number { return this.air ? Math.sqrt(this.vwx * this.vwx + this.vwy * this.vwy + this.vwz * this.vwz) : Math.sqrt(this.vx * this.vx + this.vy * this.vy); }
  get timeMs(): number { return this.finished ? this.finishMs : this.tick * DT * 1000; }
  get progress(): number { return clamp((this.air ? this.hint : this.s / DS) / this.track.finish, 0, 1); }

  /** Respawn at the last checkpoint (or the start line). Timer keeps running like a time-trial reset. */
  respawn(): void {
    const tr = this.track;
    const idx = this.cp > 0 ? tr.cps[this.cp - 1] : 1;
    this.air = false; this.s = idx * DS + (this.cp > 0 ? 0 : 2); this.d = 0; this.hc = 1; this.hs = 0;
    this.vx = 0; this.vy = 0; this.w = 0; this.steerA = 0; this.airTicks = 0; this.axLong = 0;
    this.respawns++; this.events |= EV_RESPAWN;
  }

  private takeOff(): void {
    const tr = this.track;
    const fi = this.s / DS;
    frameAt(tr, fi, this.d, this.tmp);
    const t = this.tmp;
    const vT = this.vx * this.hc - this.vy * this.hs;
    const vL = this.vx * this.hs + this.vy * this.hc;
    this.px = t.px + t.ux * HUB; this.py = t.py + t.uy * HUB; this.pz = t.pz + t.uz * HUB;
    this.vwx = t.tx * vT - t.rx * vL; this.vwy = t.ty * vT - t.ry * vL; this.vwz = t.tz * vT - t.rz * vL;
    this.fx = t.tx * this.hc - t.rx * this.hs; this.fy = t.ty * this.hc - t.ry * this.hs; this.fz = t.tz * this.hc - t.rz * this.hs;
    this.ux = t.ux; this.uy = t.uy; this.uz = t.uz;
    this.air = true; this.airTicks = 0; this.hint = fi; this.takeoffX = this.px; this.takeoffZ = this.pz;
    this.events |= EV_TAKEOFF;
  }

  step(inp: Input): void {
    this.events = 0; this.impact = 0;
    if (this.finished) { this.tick++; return; }
    if (inp.hb & 2) { this.respawn(); this.tick++; return; } // manual checkpoint respawn (bit 1 of hb)
    const tr = this.track;
    const prevS = this.s;
    if (this.air) this.stepAir(inp); else this.stepGround(inp);
    this.tick++;
    const sp = this.speed;
    if (sp > this.topSpeed) this.topSpeed = sp;
    this.distance += sp * DT;
    // checkpoints / finish
    const fi = this.air ? this.hint : this.s / DS;
    if (this.cp < tr.cps.length && fi >= tr.cps[this.cp]) { this.cp++; this.events |= EV_CP; }
    if (this.cp >= tr.cps.length && fi >= tr.finish) {
      const sNow = this.air ? this.hint * DS : this.s;
      const sPrev = this.air ? Math.min(prevS, sNow - 0.01) : prevS;
      const fs = tr.finish * DS;
      const frac = clamp((fs - sPrev) / Math.max(sNow - sPrev, 1e-6), 0, 1);
      this.finished = true;
      this.finishMs = Math.round(((this.tick - 1) + frac) * DT * 1000);
      this.events |= EV_FINISH;
    }
  }

  private stepGround(inp: Input): void {
    const P = this.P, tr = this.track;
    let i = Math.floor(this.s / DS);
    if (i < 0) i = 0; if (i > tr.n - 2) i = tr.n - 2;
    const f = this.s / DS - i;
    const ty = tr.ty[i] + (tr.ty[i + 1] - tr.ty[i]) * f;
    const ry = tr.ry[i] + (tr.ry[i + 1] - tr.ry[i]) * f;
    const uy = tr.uy[i] + (tr.uy[i + 1] - tr.uy[i]) * f;
    const kh = tr.kh[i], kn = tr.kn[i];
    const wid = tr.w[i] + (tr.w[i + 1] - tr.w[i]) * f;
    const surf = tr.surf[i], fl = tr.flags[i];

    // lost the road: gap or driving off an open edge
    if ((fl & F_GAP) || ((fl & F_NOWALL) && Math.abs(this.d) > wid * 0.5 + 0.25)) { this.takeOff(); this.stepAir(inp); return; }

    const vx = this.vx, vy = this.vy, v2 = vx * vx + vy * vy;
    const N = v2 * kn + G * uy; // contact normal acceleration (<0 => detach)
    if (N < -0.6 && v2 > 4) { this.takeOff(); this.stepAir(inp); return; }
    if (uy < -0.2 && v2 < 4) { this.takeOff(); this.stepAir(inp); return; } // hanging upside down at a standstill

    const aV = Math.abs(vx);
    const ms0 = MU_SURF[surf];
    const muS = P.mu * (ms0 + (1 - ms0) * P.offroad * (surf === 3 ? 0.5 : 1));
    const Ntot = Math.max(N, 0) + P.downforce * v2;
    const L = P.a + P.b;
    let Nf = Ntot * P.b / L - this.axLong * P.h / L;
    let Nr = Ntot * P.a / L + this.axLong * P.h / L;
    const nmin = Ntot * 0.08;
    if (Nf < nmin) Nf = nmin; if (Nr < nmin) Nr = nmin;

    // steering (speed sensitive, rate limited)
    const target = inp.steer * P.steerMax / (1 + (aV / P.steerSpeed) * (aV / P.steerSpeed));
    const maxStep = P.steerRate * DT;
    this.steerA += clamp(target - this.steerA, -maxStep, maxStep);
    const dl = this.steerA;
    const cd = dcos(dl), sd = dsin(dl);

    // drive / brake demands (accel units, positive = forward)
    let drive = 0, brakeD = 0;
    const thr = inp.thr, brk = inp.brk;
    if (vx > 1) { drive = thr * Math.min(P.accel, P.power / Math.max(aV, 1)); brakeD = brk * P.brake; }
    else if (vx < -1) { drive = -brk * 6; brakeD = thr * P.brake; }
    else { drive = thr * Math.min(P.accel, P.power / Math.max(aV, 1)) - brk * 6; }
    if (vx < -14 && drive < 0) drive = 0;
    const dirV = vx >= 0 ? 1 : -1;
    const hbOn = inp.hb & 1;
    const hbD = hbOn * 11;
    // front: 60% brake, rear: 40% brake + handbrake
    // ideal-ish brake distribution follows dynamic axle load, so hard braking never unloads and spins the rear
    const frontShare = clamp(Nf / (Nf + Nr), 0.5, 0.95);
    const rearBrake = (1 - frontShare) * 0.85;
    let FxF = drive * (1 - P.driveRear) - dirV * brakeD * (1 - rearBrake);
    let FxR = drive * P.driveRear - dirV * (brakeD * rearBrake + hbD);
    const gripMul = hbOn ? P.hbGrip : 1;
    const capF = muS * Nf, capR = muS * Nr * gripMul;
    // keep sliding-friction direction consistent near standstill
    if (aV < 0.4 && drive === 0) { FxF = 0; FxR = 0; }
    const uF = clamp(FxF, -capF, capF), uR = clamp(FxR, -capR, capR);
    const latF = Math.sqrt(Math.max(capF * capF - uF * uF, 0));
    const latR = Math.sqrt(Math.max(capR * capR - uR * uR, 0));
    // slip angles use |vx| so lateral tyre force always opposes sliding, also when the car moves backwards
    const den = Math.max(aV, 2.5);
    const alF = (vy + P.a * this.w) / den - dl * dirV;
    const alR = (vy - P.b * this.w) / den;
    const xf = P.stiff * alF, xr = P.stiff * alR;
    const sF = xf / Math.sqrt(1 + xf * xf), sR = xr / Math.sqrt(1 + xr * xr);
    const FyF = -latF * sF, FyR = -latR * sR;
    this.slipR = Math.min(1, Math.abs(sR));
    this.lastSlipF = Math.min(1, Math.abs(sF));

    // gravity in road plane (world gravity = -y): along tangent and left
    const gT = -G * ty, gL = G * ry;
    const hc = this.hc, hs = this.hs;
    const gx = gT * hc + gL * hs, gy = -gT * hs + gL * hc;
    // drag + rolling resistance
    const spd = Math.sqrt(v2);
    const dragX = -P.cd * spd * vx, dragY = -P.cd * spd * vy;
    const rr = RR_SURF[surf];
    let boostA = 0;
    if ((fl & F_BOOST) && Math.abs(this.d) < wid * 0.32) { boostA = P.boost; this.events |= EV_BOOST; this.boosted++; }

    const axT = uF * cd - FyF * sd + uR + dragX + gx + boostA * (vx >= 0 ? 1 : 0);
    const ayT = FyF * cd + uF * sd + FyR + dragY + gy;
    const wdot = (P.a * (FyF * cd + uF * sd) - P.b * FyR) / P.inertia - 0.7 * this.w;
    const prevVx = vx;
    this.vx += (axT + this.w * vy) * DT;
    this.vy += (ayT - this.w * vx) * DT;
    this.w += wdot * DT;
    // rolling resistance: decelerates toward zero without sign flip
    if (aV > 0.05) {
      const m = rr * DT;
      if (Math.abs(this.vx) <= m) this.vx = 0; else this.vx -= (this.vx > 0 ? 1 : -1) * m;
    }
    // braking/reverse sign flip protection when no drive demand
    if (drive === 0 && prevVx * this.vx < 0) this.vx = 0;
    this.axLong = axT - dragX - gx; // longitudinal tyre acceleration for next-step weight transfer
    this.axLong = clamp(this.axLong, -20, 20);
    // kill tiny lateral creep at standstill
    if (Math.abs(this.vx) < 0.3 && Math.abs(this.vy) < 0.3 && drive === 0) { this.vy *= 0.8; this.w *= 0.8; }

    // heading relative to the road
    const vT0 = this.vx * hc - this.vy * hs;
    const sd0 = Math.max(1 + kh * this.d, 0.3);
    const sdot0 = vT0 / sd0;
    const dpsi = (this.w - kh * sdot0) * DT;
    const cc = dcos(dpsi), ss = dsin(dpsi);
    let nhc = hc * cc - hs * ss, nhs = hs * cc + hc * ss;
    const nl = Math.sqrt(nhc * nhc + nhs * nhs); nhc /= nl; nhs /= nl;
    this.hc = nhc; this.hs = nhs;
    // position update
    const vT = this.vx * nhc - this.vy * nhs;
    let vL = this.vx * nhs + this.vy * nhc;
    this.s += (vT / sd0) * DT;
    this.d += -vL * DT;
    if (this.s < 0.5) { this.s = 0.5; if (this.vx < 0) this.vx = 0; }

    // walls
    const lim = wid * 0.5 - HALF_W;
    if (!(fl & F_NOWALL) && Math.abs(this.d) > lim) {
      const right = this.d > 0;
      const into = right ? vL < 0 : vL > 0;
      this.d = right ? lim : -lim;
      if (into) {
        const imp = Math.abs(vL);
        let vT2 = vT * (1 - 0.1 * Math.min(1, imp / 7));
        vL = -vL * 0.25;
        const c = nhc, sn = nhs;
        this.vx = vT2 * c + vL * sn; this.vy = -vT2 * sn + vL * c;
        this.w *= 0.6;
        this.events |= EV_WALL; this.wallHits++; this.impact = Math.max(this.impact, imp);
        if (imp > 10) { this.events |= EV_CRASH; this.crashes++; }
      }
    }
    // moving obstacles
    for (let k = 0; k < tr.obstacles.length; k++) {
      const o = tr.obstacles[k];
      if (Math.abs(this.s - o.s) > o.len + 2.4) continue;
      const oc = o.d0 + o.amp * dsin(6.283185307179586 * (this.tick * DT) / o.per + o.ph);
      const od = this.d - oc;
      if (Math.abs(od) < o.w + HALF_W) {
        const sgn = od >= 0 ? 1 : -1;
        this.d = oc + sgn * (o.w + HALF_W + 0.02);
        if (this.tick - this.lastObst > 90) {
          this.vx *= 0.5; this.vy *= 0.5; this.w *= 0.4;
          this.events |= EV_OBST | EV_CRASH; this.crashes++; this.impact = Math.max(this.impact, 8);
        }
        this.lastObst = this.tick;
      }
    }
  }

  private stepAir(inp: Input): void {
    const P = this.P, tr = this.track;
    this.airTicks++; this.airTotal++;
    // gravity + drag
    const sp = Math.sqrt(this.vwx * this.vwx + this.vwy * this.vwy + this.vwz * this.vwz);
    const dr = P.cd * 0.5 * sp;
    this.vwx -= this.vwx * dr * DT; this.vwy -= (this.vwy * dr + G) * DT; this.vwz -= this.vwz * dr * DT;
    this.px += this.vwx * DT; this.py += this.vwy * DT; this.pz += this.vwz * DT;

    // air control (pitch from throttle/brake, yaw from steer) + weak aerodynamic alignment with velocity
    const pr = (inp.brk - inp.thr) * 0.9 * P.airCtl * DT; // +: nose up
    let rx = this.fy * this.uz - this.fz * this.uy, ry = this.fz * this.ux - this.fx * this.uz, rz = this.fx * this.uy - this.fy * this.ux;
    if (pr !== 0) {
      const c = dcos(pr), s = dsin(pr);
      const nfx = this.fx * c + this.ux * s, nfy = this.fy * c + this.uy * s, nfz = this.fz * c + this.uz * s;
      const nux = this.ux * c - this.fx * s, nuy = this.uy * c - this.fy * s, nuz = this.uz * c - this.fz * s;
      this.fx = nfx; this.fy = nfy; this.fz = nfz; this.ux = nux; this.uy = nuy; this.uz = nuz;
    }
    const yr = inp.steer * 1.1 * P.airCtl * DT; // +: yaw left about up
    if (yr !== 0) {
      const c = dcos(yr), s = dsin(yr);
      rx = this.fy * this.uz - this.fz * this.uy; ry = this.fz * this.ux - this.fx * this.uz; rz = this.fx * this.uy - this.fy * this.ux;
      const nfx = this.fx * c - rx * s, nfy = this.fy * c - ry * s, nfz = this.fz * c - rz * s;
      this.fx = nfx; this.fy = nfy; this.fz = nfz;
    }
    if (sp > 3) {
      const k = Math.min(0.9, 0.35 + sp * 0.006) * DT * (1 - 0.5 * Math.min(1, Math.abs(inp.brk - inp.thr)));
      this.fx += (this.vwx / sp - this.fx) * k; this.fy += (this.vwy / sp - this.fy) * k; this.fz += (this.vwz / sp - this.fz) * k;
    }
    let l = Math.sqrt(this.fx * this.fx + this.fy * this.fy + this.fz * this.fz); this.fx /= l; this.fy /= l; this.fz /= l;
    const dd = this.ux * this.fx + this.uy * this.fy + this.uz * this.fz;
    this.ux -= this.fx * dd; this.uy -= this.fy * dd; this.uz -= this.fz * dd;
    l = Math.sqrt(this.ux * this.ux + this.uy * this.uy + this.uz * this.uz); this.ux /= l; this.uy /= l; this.uz /= l;

    // progress / landing
    const fi = locate(tr, this.px, this.py, this.pz, this.hint);
    this.hint = fi;
    const i = clamp(Math.floor(fi), 0, tr.n - 2);
    frameAt(tr, fi, 0, this.tmp);
    const t = this.tmp;
    const ox = this.px - t.px, oy = this.py - t.py, oz = this.pz - t.pz;
    const dLat = ox * t.rx + oy * t.ry + oz * t.rz;
    const h = ox * t.ux + oy * t.uy + oz * t.uz - HUB;
    const wid = tr.w[i];
    const road = !(tr.flags[i] & F_GAP) && !(tr.flags[i + 1] & F_GAP);
    const vn = this.vwx * t.ux + this.vwy * t.uy + this.vwz * t.uz;
    if (road && Math.abs(dLat) <= wid * 0.5 + 0.2 && h <= 0 && h > -3.5 && vn < 1.5) {
      this.land(fi, dLat, vn);
      return;
    }
    // out of bounds -> respawn
    const dx = this.px - t.px, dz = this.pz - t.pz;
    if (this.py < tr.minY - 70 || this.airTicks > 840 || dx * dx + dz * dz > 160 * 160 + 0 || this.py < t.py - 90) {
      this.respawn();
    }
  }

  private land(fi: number, dLat: number, vn: number): void {
    const tr = this.track, t = this.tmp;
    // projected heading
    const fT = this.fx * t.tx + this.fy * t.ty + this.fz * t.tz;
    const fR = this.fx * t.rx + this.fy * t.ry + this.fz * t.rz;
    let hl = Math.sqrt(fT * fT + fR * fR);
    let hc = 1, hs = 0;
    if (hl > 1e-4) { hc = fT / hl; hs = -fR / hl; }
    const vT = this.vwx * t.tx + this.vwy * t.ty + this.vwz * t.tz;
    const vL = -(this.vwx * t.rx + this.vwy * t.ry + this.vwz * t.rz);
    const uAlign = this.ux * t.ux + this.uy * t.uy + this.uz * t.uz;
    const q = Math.abs(this.fx * t.ux + this.fy * t.uy + this.fz * t.uz); // nose pitch relative to road
    let loss = 1 - 0.55 * smooth01((q - 0.12) / 0.55);
    let crashed = false;
    if (uAlign < 0.35) { loss *= 0.35; crashed = true; }
    else loss *= 0.88 + 0.12 * uAlign;
    const nv = Math.max(0, -vn);
    this.s = fi * DS; this.d = dLat; this.hc = hc; this.hs = hs;
    const vT2 = vT * loss, vL2 = vL * loss;
    this.vx = vT2 * hc + vL2 * hs; this.vy = -vT2 * hs + vL2 * hc;
    this.w = 0; this.steerA = 0; this.air = false; this.axLong = 0;
    this.events |= EV_LAND; this.impact = nv;
    if (crashed) { this.events |= EV_CRASH; this.crashes++; }
    const jd = Math.sqrt((this.px - this.takeoffX) ** 2 + (this.pz - this.takeoffZ) ** 2);
    if (jd > this.longestJump) this.longestJump = jd;
  }

  /** World pose for rendering (centre of chassis + orthonormal basis). */
  pose(out: { x: number; y: number; z: number; fx: number; fy: number; fz: number; ux: number; uy: number; uz: number }): void {
    if (this.air) {
      out.x = this.px; out.y = this.py; out.z = this.pz;
      out.fx = this.fx; out.fy = this.fy; out.fz = this.fz; out.ux = this.ux; out.uy = this.uy; out.uz = this.uz;
      return;
    }
    const t = this.tmp;
    frameAt(this.track, this.s / DS, this.d, t);
    out.x = t.px + t.ux * HUB; out.y = t.py + t.uy * HUB; out.z = t.pz + t.uz * HUB;
    out.fx = t.tx * this.hc - t.rx * this.hs; out.fy = t.ty * this.hc - t.ry * this.hs; out.fz = t.tz * this.hc - t.rz * this.hs;
    out.ux = t.ux; out.uy = t.uy; out.uz = t.uz;
  }
}
