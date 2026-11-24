import { dsin, dcos, clamp, smooth01 } from './dmath';
import { Track, DS, F_GAP, F_BOOST, F_NOWALL, frameAt, locate } from './track';

export const TICK_RATE = 120;
export const DT = 1 / TICK_RATE;
export const G = 9.81;
const HUB = 0.45; // chassis centre height above the road surface
const HALF_W = 1.05; // half car width (wheel to wheel) used for walls

export interface VehicleParams {
  accel: number; // launch acceleration m/s^2
  power: number; // power / mass  (m^2/s^3)
  cd: number; // quadratic drag per unit mass (1/m)
  brake: number; // braking decel m/s^2
  mu: number; // lateral grip budget in g
  grip: number; // how fast sideways slip is killed (1/s) - high = planted
  yaw: number; // max yaw rate at low speed (rad/s)
  yawResp: number; // steering response (1/s) - high = immediate
  downforce: number; // aero downforce factor (1/m)
  airCtl: number; // air control multiplier
  hbGrip: number; // grip multiplier while the handbrake is held (small = tail slides)
  boost: number; // boost pad acceleration m/s^2
  offroad: number; // 0..1 how much of the loose-surface grip penalty is cancelled
}

/**
 * Arcade handling (PolyTrack-style): steering commands a yaw rate directly (immediate, speed-sensitive, capped by the grip budget so the car
 * understeers predictably instead of spinning), sideways slip is killed quickly (planted), acceleration is strong and braking constant.
 * The normalised vehicle below is used by every ranked / benchmark run so cosmetics and purchases can never change a record.
 */
export const STANDARD: VehicleParams = {
  accel: 15, power: 150, cd: 0.00046, brake: 22, mu: 1.7, grip: 18, yaw: 2.7, yawResp: 16,
  downforce: 0.0012, airCtl: 1, hbGrip: 0.3, boost: 28, offroad: 0,
};

export interface Input { thr: number; brk: number; steer: number; hb: number }
export const NEUTRAL: Input = { thr: 0, brk: 0, steer: 0, hb: 0 };

export const EV_CP = 1, EV_FINISH = 2, EV_LAND = 4, EV_WALL = 8, EV_CRASH = 16, EV_RESPAWN = 32, EV_BOOST = 64, EV_TAKEOFF = 128, EV_OBST = 256;

const MU_SURF = [1.0, 0.72, 0.5, 0.2, 0.62, 1.0];
const RR_SURF = [0.2, 0.7, 1.5, 0.1, 2.0, 0.15];
const STICK = 0.5; // arcade surface-magnet, in g (loops / wall rides)

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
    // contact normal acceleration. "stick" is an arcade magnet that keeps the car on loops and wall rides at believable speeds.
    const N = v2 * kn + G * uy + STICK * G;
    if (N < -0.6 && v2 > 4) { this.takeOff(); this.stepAir(inp); return; }
    if (uy < -0.2 && v2 < 4) { this.takeOff(); this.stepAir(inp); return; } // hanging upside down at a standstill

    const aV = Math.abs(vx);
    const dirV = vx >= 0 ? 1 : -1;
    const ms0 = MU_SURF[surf];
    const surfK = ms0 + (1 - ms0) * P.offroad * (surf === 3 ? 0.5 : 1);
    const hbOn = inp.hb & 1;
    // lateral grip budget (m/s^2): friction x (contact load + aero downforce)
    const aLatMax = Math.max(4, P.mu * surfK * (Math.max(N, 0) + G * 0.35 + P.downforce * v2)) * (hbOn ? P.hbGrip : 1);
    const gripK = P.grip * (0.35 + 0.65 * surfK) * (hbOn ? P.hbGrip : 1);

    // ---- steering: commands yaw rate directly, immediate response, authority capped by the grip budget
    const lowSpeed = clamp(aV / 3.5, 0, 1);
    const speedRoll = 1 / (1 + (aV / 52) * (aV / 52));
    const wCap = (0.96 * aLatMax) / Math.max(aV, 4);
    const wAuth = Math.min(P.yaw * speedRoll * (hbOn ? 1.3 : 1), wCap);
    const wTarget = inp.steer * wAuth * lowSpeed * dirV;
    this.w += (wTarget - this.w) * Math.min(1, P.yawResp * DT);
    // visual steering angle for the wheels
    this.steerA += (inp.steer * 0.42 - this.steerA) * Math.min(1, 24 * DT);

    // ---- longitudinal: strong, smooth acceleration; constant, predictable braking
    const thr = inp.thr, brk = inp.brk;
    let drive = 0, brakeD = 0;
    const accelAt = Math.min(P.accel, P.power / Math.max(aV, 1)) * (0.55 + 0.45 * Math.min(1, surfK * 1.4));
    if (vx > 0.8) { drive = thr * accelAt; brakeD = brk * P.brake * Math.min(1, 0.35 + surfK); }
    else if (vx < -0.8) { drive = -brk * 9; brakeD = thr * P.brake * Math.min(1, 0.35 + surfK); }
    else { drive = thr * accelAt - brk * 9; }
    if (vx < -16 && drive < 0) drive = 0;
    const spd = Math.sqrt(v2);
    const rr = RR_SURF[surf];
    let boostA = 0;
    if ((fl & F_BOOST) && Math.abs(this.d) < wid * 0.32) { boostA = P.boost; this.events |= EV_BOOST; this.boosted++; }

    // gravity in the road plane (world gravity = -y): along tangent and left, rotated into body axes
    const gT = -G * ty, gL = G * ry;
    const hc = this.hc, hs = this.hs;
    const gx = gT * hc + gL * hs, gy = -gT * hs + gL * hc;
    // sideways friction toward zero slip, limited by the grip budget (and a little by hard braking)
    const brakeLoad = brakeD > 0 ? 0.88 : 1;
    const ay = -clamp(gripK * vy, -aLatMax * brakeLoad, aLatMax * brakeLoad);
    const prevVx = vx;
    this.vx += (drive - dirV * brakeD - P.cd * spd * vx + gx + boostA * (vx >= 0 ? 1 : 0) + this.w * vy) * DT;
    this.vy += (ay + gy - P.cd * spd * vy - this.w * vx) * DT;
    if (Math.abs(this.vx) > 0.05) { const m = rr * DT; if (Math.abs(this.vx) <= m) this.vx = 0; else this.vx -= (this.vx > 0 ? 1 : -1) * m; }
    if (drive === 0 && brakeD > 0 && prevVx * this.vx < 0) this.vx = 0; // braking never flips the sign by itself
    this.axLong = clamp(drive - dirV * brakeD, -25, 25);
    if (Math.abs(this.vx) < 0.3 && Math.abs(this.vy) < 0.3 && drive === 0) { this.vy *= 0.8; this.w *= 0.8; }
    // slip indicator for effects / audio (slide only really happens on ice, loose surfaces or with the handbrake)
    this.slipR = clamp((Math.abs(this.vy) / (Math.abs(this.vx) + 3)) * 4.5, 0, 1);

    // ---- heading relative to the road
    const vT0 = this.vx * hc - this.vy * hs;
    const sd0 = Math.max(1 + kh * this.d, 0.3);
    const sdot0 = vT0 / sd0;
    const dpsi = (this.w - kh * sdot0) * DT;
    const cc = dcos(dpsi), ss = dsin(dpsi);
    let nhc = hc * cc - hs * ss, nhs = hs * cc + hc * ss;
    const nl = Math.sqrt(nhc * nhc + nhs * nhs); nhc /= nl; nhs /= nl;
    this.hc = nhc; this.hs = nhs;
    const vT = this.vx * nhc - this.vy * nhs;
    let vL = this.vx * nhs + this.vy * nhc;
    this.s += (vT / sd0) * DT;
    this.d += -vL * DT;
    if (this.s < 0.5) { this.s = 0.5; if (this.vx < 0) this.vx = 0; }

    // ---- walls: consistent response - kill the outward speed, scrub a little forward speed by impact angle, turn the car along the wall
    const lim = wid * 0.5 - HALF_W;
    if (!(fl & F_NOWALL) && Math.abs(this.d) > lim) {
      const right = this.d > 0;
      const into = right ? vL < 0 : vL > 0;
      this.d = right ? lim : -lim;
      if (into) {
        const imp = Math.abs(vL);
        const ang = imp / Math.max(Math.abs(vT), 6);
        const vT2 = vT * (1 - Math.min(0.35, 0.05 + ang * 0.5));
        vL = -vL * 0.08;
        // align heading with the wall (arcade: the car slides along it instead of spinning)
        const hdg = this.hs * 0.55; const hn = Math.sqrt(1 - Math.min(0.95, hdg * hdg)); this.hs = hdg; this.hc = hn;
        const c = this.hc, sn = this.hs;
        this.vx = vT2 * c + vL * sn; this.vy = -vT2 * sn + vL * c;
        this.w = 0;
        this.events |= EV_WALL; this.wallHits++; this.impact = Math.max(this.impact, imp);
        if (imp > 11) { this.events |= EV_CRASH; this.crashes++; }
      }
    }
    // ---- moving obstacles
    for (let k = 0; k < tr.obstacles.length; k++) {
      const o = tr.obstacles[k];
      if (Math.abs(this.s - o.s) > o.len + 2.4) continue;
      const oc = o.d0 + o.amp * dsin(6.283185307179586 * (this.tick * DT) / o.per + o.ph);
      const od = this.d - oc;
      if (Math.abs(od) < o.w + HALF_W) {
        const sgn = od >= 0 ? 1 : -1;
        this.d = oc + sgn * (o.w + HALF_W + 0.02);
        if (this.tick - this.lastObst > 90) {
          this.vx *= 0.5; this.vy *= 0.5; this.w = 0;
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
    // arcade landing assist: as the car comes down onto road it is eased level with the surface and pointed along its travel,
    // so jumps land predictably instead of flipping the car
    if (road && h < 9 && h > -1.5 && vn < 0 && Math.abs(dLat) <= wid * 0.5 + 4) {
      const pit = Math.abs(inp.brk - inp.thr);
      const k = Math.min(1, DT * (7 * (1 - Math.max(h, 0) / 9) + 2)) * (1 - 0.6 * pit);
      let px = this.vwx - vn * t.ux, py = this.vwy - vn * t.uy, pz = this.vwz - vn * t.uz; const pl = Math.sqrt(px * px + py * py + pz * pz);
      if (pl > 1) { px /= pl; py /= pl; pz /= pl; this.fx += (px - this.fx) * k; this.fy += (py - this.fy) * k; this.fz += (pz - this.fz) * k; }
      this.ux += (t.ux - this.ux) * k; this.uy += (t.uy - this.uy) * k; this.uz += (t.uz - this.uz) * k;
      let l2 = Math.sqrt(this.fx * this.fx + this.fy * this.fy + this.fz * this.fz); this.fx /= l2; this.fy /= l2; this.fz /= l2;
      const dd2 = this.ux * this.fx + this.uy * this.fy + this.uz * this.fz; this.ux -= this.fx * dd2; this.uy -= this.fy * dd2; this.uz -= this.fz * dd2;
      l2 = Math.sqrt(this.ux * this.ux + this.uy * this.uy + this.uz * this.uz); this.ux /= l2; this.uy /= l2; this.uz /= l2;
    }
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
