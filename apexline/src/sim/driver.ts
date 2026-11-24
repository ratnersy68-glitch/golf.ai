import { Track, DS, F_GAP, F_BOOST } from './track';
import { Sim, Input, VehicleParams, STANDARD, G, TICK_RATE, EV_FINISH } from './vehicle';
import { InputLog, quantise, toInput, QInput } from './replay';
import { Rng, clamp } from './dmath';

/**
 * Automated benchmark driver.
 *
 * A parametrised controller (pure-pursuit steering along an optimisable racing line, a braking-planned
 * speed profile, per-piece speed scaling and air attitude control) drives the *same* deterministic
 * simulation humans use. An evolutionary strategy mutates the parameters ("genes"); the fastest
 * validated run becomes the simulated benchmark. It is a heuristic search: results are upper bounds on
 * the optimal time, never proven optimal.
 */

const MU_SURF = [1.0, 0.72, 0.5, 0.2, 0.62, 1.0];
export const WP_SPACING = 24; // metres between racing-line waypoints
const NG = 5; // global genes

export interface GeneLayout { nW: number; nP: number; total: number }
export function layout(tr: Track): GeneLayout {
  const nW = Math.ceil(tr.lengthM / WP_SPACING) + 1;
  const nP = tr.def.pieces.length;
  return { nW, nP, total: NG + nW + nP };
}

export type Genes = Float64Array;

export function defaultGenes(tr: Track, gLat = 0.62): Genes {
  const L = layout(tr);
  const g = new Float64Array(L.total);
  g[0] = gLat; g[1] = 7; g[2] = 0.16; g[3] = 0.8; g[4] = 1.0;
  // heuristic racing line: sit on the inside of long corners, centre otherwise
  for (let k = 0; k < L.nW; k++) {
    const i = Math.min(tr.n - 1, Math.round((k * WP_SPACING) / DS));
    let kh = 0; let c = 0;
    for (let q = -12; q <= 12; q++) { const j = clamp(i + q, 0, tr.n - 1); kh += tr.kh[j]; c++; }
    kh /= c;
    g[NG + k] = clamp(-kh * 90, -3.5, 3.5); // inside offset (left turn => negative d)
  }
  for (let p = 0; p < L.nP; p++) g[NG + L.nW + p] = 1;
  return g;
}

export interface Plan { line: Float64Array; vplan: Float64Array; pieceOf: Int32Array }

/** Per-sample derived data from genes (racing line + speed plan). */
export function makePlan(tr: Track, g: Genes, P: VehicleParams): Plan {
  const L = layout(tr);
  const n = tr.n;
  const line = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * DS) / WP_SPACING; const k = Math.min(L.nW - 2, Math.floor(x)); const f = x - k;
    const a = g[NG + k], b = g[NG + k + 1];
    const t = f * f * (3 - 2 * f);
    const lim = Math.max(0, tr.w[i] * 0.5 - 1.9);
    line[i] = clamp(a + (b - a) * t, -lim, lim);
  }
  const pieceOf = new Int32Array(n);
  {
    let p = 0;
    for (let i = 0; i < n; i++) { while (p + 1 < tr.pieceStart.length && i >= tr.pieceStart[p + 1]) p++; pieceOf[i] = p; }
  }
  const gLat = g[0];
  const vmax = 110;
  const vplan = new Float64Array(n).fill(vmax);
  // curvature of the offset line
  for (let i = 0; i < n; i++) {
    const i0 = Math.max(0, i - 2), i1 = Math.min(n - 1, i + 2);
    const dpp = (line[i1] - 2 * line[i] + line[i0]) / ((((i1 - i0) * DS) / 2) ** 2);
    const kappa = Math.abs(tr.kh[i] / Math.max(0.25, 1 + tr.kh[i] * line[i]) - dpp);
    const muS = P.mu * MU_SURF[tr.surf[i]];
    const assist = G * tr.ry[i] * (tr.kh[i] >= 0 ? 1 : -1);
    const aLat = gLat * muS * G * Math.max(0.3, tr.uy[i]) + Math.max(-0.4 * G, assist) * 0.9 + 0.5;
    let v = kappa > 1e-4 ? Math.sqrt(Math.max(aLat, 2) / kappa) : vmax;
    // inverted / loop sections need a speed floor so the car stays on the road: N = v^2 kn + g uy >= 0
    if (tr.kn[i] > 0.008 && tr.uy[i] < 0.3) { const need = Math.sqrt(G / tr.kn[i]) * 1.35 + 2; if (v < need) v = need; }
    vplan[i] = Math.min(v, vmax);
  }
  // jump gaps: required launch speed (override plan over the run-up)
  for (let i = 1; i < n; ) {
    if ((tr.flags[i] & F_GAP) && !(tr.flags[i - 1] & F_GAP)) {
      let j = i; while (j < n && (tr.flags[j] & F_GAP)) j++;
      const gapLen = (j - i) * DS;
      const th = Math.max(0.05, Math.asin(clamp(tr.ty[i - 1], -0.95, 0.95)));
      const vreq = Math.sqrt((G * gapLen) / Math.max(Math.sin(2 * th), 0.25)) * 1.06 + 1.5;
      const sc = g[NG + L.nW + pieceOf[i]];
      const target = vreq * sc;
      for (let q = Math.max(0, i - 28); q < j; q++) vplan[q] = target;
      i = j;
    } else i++;
  }
  // per-piece speed scale
  for (let i = 0; i < n; i++) {
    if (tr.flags[i] & F_GAP) continue;
    const sc = g[NG + L.nW + pieceOf[i]];
    if (sc !== 1) vplan[i] *= sc;
  }
  // backward braking pass
  const bf = g[3];
  for (let i = n - 2; i >= 0; i--) {
    const muS = P.mu * MU_SURF[tr.surf[i]];
    const decel = Math.min(P.brake, muS * G * 1.05) * bf;
    const cap = Math.sqrt(vplan[i + 1] * vplan[i + 1] + 2 * decel * DS);
    if (vplan[i] > cap) vplan[i] = cap;
  }
  return { line, vplan, pieceOf };
}

export class Driver {
  plan: Plan;
  constructor(public tr: Track, public P: VehicleParams, public g: Genes) { this.plan = makePlan(tr, g, P); }

  /** Compute the next control input for a simulation state. */
  control(sim: Sim): Input {
    const tr = this.tr, P = this.P, g = this.g;
    const n = tr.n;
    if (sim.air) {
      const hi = clamp(Math.floor(sim.hint), 0, n - 2);
      // attitude control: align nose with the road direction at the predicted landing area
      const ahead = clamp(hi + Math.round(clamp(sim.speed * 0.9, 8, 40) / DS), 0, n - 1);
      const wantY = tr.ty[ahead];
      const fy = sim.fy;
      const e = fy - wantY; // + => nose too high
      const thr = e > 0.03 ? clamp(e * 4, 0, 1) : 0;
      const brk = e < -0.03 ? clamp(-e * 4, 0, 1) : 0;
      const lat = sim.fx * tr.rx[ahead] + sim.fy * tr.ry[ahead] + sim.fz * tr.rz[ahead];
      const steer = clamp(lat * 3, -1, 1);
      return { thr, brk, steer, hb: 0 };
    }
    const v = Math.abs(sim.vx);
    const i = clamp(Math.floor(sim.s / DS), 0, n - 2);
    // recovery: pointing away from the road direction -> reverse around
    if (sim.hc < 0.25 && v < 14) return { thr: 0, brk: 1, steer: sim.hs >= 0 ? 1 : -1, hb: 0 };
    const Ld = g[1] + g[2] * v;
    const j = clamp(i + Math.round(Ld / DS), 0, n - 1);
    const khMid = tr.kh[clamp(i + ((j - i) >> 1), 0, n - 1)];
    const dyL = (sim.d - this.plan.line[j]) + 0.5 * khMid * Ld * Ld;
    const dxT = Ld;
    const bx = dxT * sim.hc + dyL * sim.hs;
    const by = -dxT * sim.hs + dyL * sim.hc;
    const kappa = (2 * by) / (bx * bx + by * by);
    const dWant = (P.a + P.b) * kappa * g[4];
    const dMax = P.steerMax / (1 + (v / P.steerSpeed) * (v / P.steerSpeed));
    let steer = dWant / dMax;
    // damp sideslip / yaw oscillation
    steer -= 0.35 * (sim.vy / Math.max(v, 6));
    steer = clamp(steer, -1, 1);
    // longitudinal: track the speed plan
    const ia = clamp(i + 1 + Math.round(v * 0.02 / DS * 10), 0, n - 1);
    const vt = this.plan.vplan[ia];
    const err = v - vt;
    let thr = 0, brk = 0;
    if (err > 0.6) brk = clamp(err / 5, 0, 1);
    else thr = clamp((vt - v) / 2.5 + 0.35, 0, 1);
    if (sim.vx < 1.5 && vt < 2) { thr = 0.3; }
    return { thr, brk, steer, hb: 0 };
  }
}

export interface EvalResult { fitness: number; finished: boolean; ms: number; ticks: number; progress: number; crashes: number; respawns: number; log?: InputLog }

export function evaluate(tr: Track, P: VehicleParams, g: Genes, opts: { record?: boolean; tickLimit?: number } = {}): EvalResult {
  const sim = new Sim(tr, P);
  const drv = new Driver(tr, P, g);
  const log = opts.record ? new InputLog() : undefined;
  const limit = opts.tickLimit ?? TICK_RATE * 300;
  let stuckS = 0, stuckTick = 0;
  while (!sim.finished && sim.tick < limit) {
    const q: QInput = quantise(drv.control(sim));
    sim.step(toInput(q));
    if (log) log.push(q);
    // abort hopeless runs: lots of resets or no progress
    if (sim.respawns > 3) break;
    if ((sim.tick & 255) === 0) {
      const s = sim.air ? sim.hint * DS : sim.s;
      if (s < stuckS + 3 && sim.tick - stuckTick >= 1024) break;
      if (s >= stuckS + 3) { stuckS = s; stuckTick = sim.tick; }
    }
  }
  const progress = sim.progress;
  const finished = sim.finished && sim.cp >= tr.cps.length;
  const pen = sim.respawns * 30000 + sim.crashes * 400;
  const fitness = finished ? sim.finishMs + pen : 1e7 - progress * 1e6 + sim.tick * 0.1;
  return { fitness, finished, ms: sim.finishMs, ticks: sim.tick, progress, crashes: sim.crashes, respawns: sim.respawns, log };
}

export interface OptOptions { budget: number; seed: number; init?: Genes; onProgress?: (best: EvalResult, evals: number) => void }
export interface OptResult { best: EvalResult; genes: Genes; evals: number; attempts: number; finishedRuns: number }

export function optimise(tr: Track, P: VehicleParams, opt: OptOptions): OptResult {
  const rng = new Rng(opt.seed);
  const L = layout(tr);
  let evals = 0, finishedRuns = 0;
  let best: { g: Genes; r: EvalResult } | null = null;

  const consider = (g: Genes, r: EvalResult) => {
    evals++; if (r.finished) finishedRuns++;
    if (!best || r.fitness < best.r.fitness) best = { g, r };
  };

  if (opt.init && opt.init.length === L.total) {
    const r = evaluate(tr, P, opt.init);
    consider(Float64Array.from(opt.init), r);
  }
  // Stage 1: find a conservative parameter set that finishes
  const ladder = [0.5, 0.58, 0.66, 0.75, 0.62, 0.45, 0.38, 0.3];
  let lj = (best && (best as any).r.finished) ? 99 : 0;
  for (const gl of (lj ? [] : ladder)) {
    for (const ld of [7, 11, 4.5]) {
      const g = defaultGenes(tr, gl); g[1] = ld;
      const r = evaluate(tr, P, g, { tickLimit: best ? Math.min(TICK_RATE * 300, (best as any).r.ticks * 1.2 + 120) : undefined });
      consider(g, r);
      if (best && (best as any).r.finished && lj++ > 4) break;
    }
    if (best && (best as any).r.finished && lj > 4) break;
  }
  if (!best || !(best as any).r.finished) {
    return { best: (best as any).r, genes: (best as any).g, evals, attempts: evals, finishedRuns };
  }

  // Stage 2: (mu + lambda) evolution strategy
  const MU = 4, LAMBDA = 14;
  let parents: { g: Genes; r: EvalResult }[] = [best];
  let sigma = 1;
  let stall = 0;
  while (evals < opt.budget) {
    const kids: { g: Genes; r: EvalResult }[] = [];
    for (let c = 0; c < LAMBDA && evals < opt.budget; c++) {
      const par = parents[Math.floor(rng.next() * parents.length)];
      const g = Float64Array.from(par.g);
      const mode = rng.next();
      if (mode < 0.2) { // globals
        g[0] = clamp(g[0] + rng.gauss() * 0.04 * sigma, 0.35, 1.25);
        g[1] = clamp(g[1] + rng.gauss() * 1.2 * sigma, 2.5, 16);
        g[2] = clamp(g[2] + rng.gauss() * 0.03 * sigma, 0.03, 0.45);
        g[3] = clamp(g[3] + rng.gauss() * 0.05 * sigma, 0.45, 1.05);
        g[4] = clamp(g[4] + rng.gauss() * 0.06 * sigma, 0.6, 1.6);
      } else if (mode < 0.65) { // racing line window
        const a = rng.int(0, L.nW - 1), len = rng.int(1, 6);
        const dv = rng.gauss() * 1.4 * sigma;
        for (let k = a; k < Math.min(L.nW, a + len); k++) g[NG + k] += dv * (0.6 + 0.4 * rng.next());
      } else if (mode < 0.9) { // piece speed scale
        const p = rng.int(0, L.nP - 1);
        g[NG + L.nW + p] = clamp(g[NG + L.nW + p] * (1 + rng.gauss() * 0.06 * sigma), 0.5, 1.7);
      } else { // everything a little
        for (let k = NG; k < g.length; k++) g[k] += rng.gauss() * (k < NG + L.nW ? 0.25 : 0.01) * sigma;
        for (let p = 0; p < L.nP; p++) g[NG + L.nW + p] = clamp(g[NG + L.nW + p], 0.5, 1.7);
      }
      const tl = Math.floor((best as any).r.ticks * 1.15 + 120);
      const r = evaluate(tr, P, g, { tickLimit: tl });
      kids.push({ g, r }); consider(g, r);
    }
    const pool = parents.concat(kids).sort((a, b) => a.r.fitness - b.r.fitness);
    const before = parents[0].r.fitness;
    parents = pool.slice(0, MU);
    if (parents[0].r.fitness < before - 1) { stall = 0; sigma = Math.min(1.5, sigma * 1.05); }
    else { stall++; sigma = Math.max(0.25, sigma * 0.96); }
    opt.onProgress?.((best as any).r, evals);
  }
  const b = best as { g: Genes; r: EvalResult };
  // Final: re-run with recording
  const rec = evaluate(tr, P, b.g, { record: true });
  return { best: rec, genes: b.g, evals, attempts: evals, finishedRuns };
}
