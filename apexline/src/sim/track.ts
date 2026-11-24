import { dsin, dcos, clamp, smooth01, sign } from './dmath';

/** Sample spacing along the centreline in metres. */
export const DS = 2;

export const F_GAP = 1; // no road surface (jump gap)
export const F_BOOST = 2; // boost pad zone
export const F_NOWALL = 4; // open edge: driving off falls
export const F_CP = 8; // checkpoint at end of piece
export const F_TUNNEL = 16; // decorative tunnel shell
export const F_BRIDGE = 32; // decorative bridge supports

export const SURF_ASPHALT = 0;
export const SURF_DIRT = 1;
export const SURF_GRASS = 2;
export const SURF_ICE = 3;
export const SURF_SAND = 4;
export const SURF_STEEL = 5;

/** A modular track piece. Everything is expressed as turtle motions so loops, corkscrews, banks and ramps all share one code path. */
export interface PieceDef {
  k: string; // semantic kind for rendering/analysis: straight, curve, bank, climb, jump, land, loop, cork, ...
  l: number; // length (m)
  y?: number; // total yaw (rad), +left
  p?: number; // pitch envelope plateau (rad), returns to 0 at the end (hills / ramps)
  dp?: number; // permanent pitch change over the piece (rad)
  r?: number; // total roll over the piece (rad) - corkscrew
  b?: number; // bank envelope (rad), inward positive
  w?: number; // width at start (m)
  w2?: number; // width at end (m)
  s?: number; // surface id
  f?: number; // flags
}

export interface ObstacleDef {
  s: number; // position along track (m)
  d0: number; // lateral centre (m, +right)
  amp: number; // lateral swing amplitude (m)
  per: number; // period (s)
  ph: number; // phase (rad)
  w: number; // half width of block (m)
  len: number; // half length along track (m)
}

export interface TrackDef {
  id: number; // 1-based campaign number
  name: string;
  chapter: number; // 1-based
  env: string;
  seed: number;
  pieces: PieceDef[];
  obstacles?: ObstacleDef[];
}

export class Track {
  n = 0;
  px!: Float64Array; py!: Float64Array; pz!: Float64Array;
  tx!: Float64Array; ty!: Float64Array; tz!: Float64Array;
  ux!: Float64Array; uy!: Float64Array; uz!: Float64Array;
  rx!: Float64Array; ry!: Float64Array; rz!: Float64Array;
  kh!: Float64Array; kn!: Float64Array;
  w!: Float32Array; surf!: Int8Array; flags!: Uint8Array;
  cps: number[] = []; // sample indices of checkpoints (excl. finish)
  finish = 0; // sample index of finish line
  length = 0;
  minY = 0;
  obstacles: ObstacleDef[] = [];
  pieceStart: number[] = []; // sample index of each piece start
  constructor(public def: TrackDef) {}

  get lengthM(): number { return this.finish * DS; }
}

export function buildTrack(def: TrackDef): Track {
  const tr = new Track(def);
  let total = 1;
  for (const p of def.pieces) total += Math.max(1, Math.round(p.l / DS));
  const N = total;
  const mk = () => new Float64Array(N);
  tr.n = N;
  tr.px = mk(); tr.py = mk(); tr.pz = mk();
  tr.tx = mk(); tr.ty = mk(); tr.tz = mk();
  tr.ux = mk(); tr.uy = mk(); tr.uz = mk();
  tr.rx = mk(); tr.ry = mk(); tr.rz = mk();
  tr.kh = mk(); tr.kn = mk();
  tr.w = new Float32Array(N); tr.surf = new Int8Array(N); tr.flags = new Uint8Array(N);

  // Turtle state
  let Px = 0, Py = 0, Pz = 0;
  let Tx = 0, Ty = 0, Tz = -1;
  let Ux = 0, Uy = 1, Uz = 0;
  let Rx = 1, Ry = 0, Rz = 0;
  let w = def.pieces[0]?.w ?? 12;
  let idx = 0;
  const put = (surf: number, flags: number) => {
    tr.px[idx] = Px; tr.py[idx] = Py; tr.pz[idx] = Pz;
    tr.tx[idx] = Tx; tr.ty[idx] = Ty; tr.tz[idx] = Tz;
    tr.ux[idx] = Ux; tr.uy[idx] = Uy; tr.uz[idx] = Uz;
    tr.rx[idx] = Rx; tr.ry[idx] = Ry; tr.rz[idx] = Rz;
    tr.w[idx] = w; tr.surf[idx] = surf; tr.flags[idx] = flags;
    idx++;
  };
  put(def.pieces[0]?.s ?? 0, 0);

  const ramp = (u: number, e: number): number => {
    // plateau envelope with eased ramps of fraction e on each side
    if (e <= 0) return 1;
    const a = smooth01(u / e);
    const b = 1 - smooth01((u - (1 - e)) / e);
    return a < b ? a : b;
  };

  for (const pc of def.pieces) {
    const n = Math.max(1, Math.round(pc.l / DS));
    const yaw = pc.y ?? 0, pitchEnv = pc.p ?? 0, dpitch = pc.dp ?? 0, rollTot = pc.r ?? 0, bank = pc.b ?? 0;
    const w0 = pc.w ?? w, w1 = pc.w2 ?? w0;
    const surf = pc.s ?? SURF_ASPHALT, fl = pc.f ?? 0;
    const bankSign = yaw !== 0 ? -sign(yaw) : -1; // inward bank: tilt normal toward turn centre
    let prevP = 0, prevB = 0;
    for (let j = 1; j <= n; j++) {
      const u = j / n;
      const envP = ramp(u, 0.3), envB = ramp(u, 0.25);
      const dy = yaw / n;
      const dpi = pitchEnv * (envP - prevP) + dpitch / n;
      const dro = bankSign * bank * (envB - prevB) + rollTot / n;
      prevP = envP; prevB = envB;
      // yaw about U
      if (dy !== 0) {
        const c = dcos(dy), s = dsin(dy);
        const nTx = Tx * c - Rx * s, nTy = Ty * c - Ry * s, nTz = Tz * c - Rz * s;
        const nRx = Rx * c + Tx * s, nRy = Ry * c + Ty * s, nRz = Rz * c + Tz * s;
        Tx = nTx; Ty = nTy; Tz = nTz; Rx = nRx; Ry = nRy; Rz = nRz;
      }
      // pitch about R
      if (dpi !== 0) {
        const c = dcos(dpi), s = dsin(dpi);
        const nTx = Tx * c + Ux * s, nTy = Ty * c + Uy * s, nTz = Tz * c + Uz * s;
        const nUx = Ux * c - Tx * s, nUy = Uy * c - Ty * s, nUz = Uz * c - Tz * s;
        Tx = nTx; Ty = nTy; Tz = nTz; Ux = nUx; Uy = nUy; Uz = nUz;
      }
      // roll about T
      if (dro !== 0) {
        const c = dcos(dro), s = dsin(dro);
        const nUx = Ux * c + Rx * s, nUy = Uy * c + Ry * s, nUz = Uz * c + Rz * s;
        const nRx = Rx * c - Ux * s, nRy = Ry * c - Uy * s, nRz = Rz * c - Uz * s;
        Ux = nUx; Uy = nUy; Uz = nUz; Rx = nRx; Ry = nRy; Rz = nRz;
      }
      // re-orthonormalise (T, U, R=T x U)
      let l = Math.sqrt(Tx * Tx + Ty * Ty + Tz * Tz); Tx /= l; Ty /= l; Tz /= l;
      const d = Ux * Tx + Uy * Ty + Uz * Tz; Ux -= Tx * d; Uy -= Ty * d; Uz -= Tz * d;
      l = Math.sqrt(Ux * Ux + Uy * Uy + Uz * Uz); Ux /= l; Uy /= l; Uz /= l;
      Rx = Ty * Uz - Tz * Uy; Ry = Tz * Ux - Tx * Uz; Rz = Tx * Uy - Ty * Ux;
      Px += Tx * DS; Py += Ty * DS; Pz += Tz * DS;
      w = w0 + (w1 - w0) * u;
      put(surf, fl & ~F_CP);
    }
    if (fl & F_CP) tr.cps.push(idx - 1);
    tr.pieceStart.push(idx - 1 - n + 1);
  }
  // Curvatures
  for (let i = 0; i < N - 1; i++) {
    const dx = tr.tx[i + 1] - tr.tx[i], dy = tr.ty[i + 1] - tr.ty[i], dz = tr.tz[i + 1] - tr.tz[i];
    tr.kh[i] = -(dx * tr.rx[i] + dy * tr.ry[i] + dz * tr.rz[i]) / DS;
    tr.kn[i] = (dx * tr.ux[i] + dy * tr.uy[i] + dz * tr.uz[i]) / DS;
  }
  tr.kh[N - 1] = tr.kh[N - 2]; tr.kn[N - 1] = tr.kn[N - 2];
  tr.finish = N - 6;
  let minY = 1e9;
  for (let i = 0; i < N; i++) if (tr.py[i] < minY) minY = tr.py[i];
  tr.minY = minY;
  tr.length = (N - 1) * DS;
  tr.obstacles = def.obstacles ?? [];
  return tr;
}

/** Interpolation helper: index + fraction for a distance s (m). */
export function sIndex(tr: Track, s: number): number {
  return clamp(s / DS, 0, tr.n - 1.0001);
}

/**
 * Find the centreline coordinate nearest to a world point, searching near `hintIdx`.
 * Returns fractional sample index. Used for landing detection and respawn tests.
 */
export function locate(tr: Track, x: number, y: number, z: number, hintIdx: number): number {
  let i = clamp(Math.round(hintIdx), 0, tr.n - 1);
  for (let it = 0; it < 6; it++) {
    const t = (x - tr.px[i]) * tr.tx[i] + (y - tr.py[i]) * tr.ty[i] + (z - tr.pz[i]) * tr.tz[i];
    const step = Math.round(t / DS);
    if (step === 0) {
      return clamp(i + t / DS, 0, tr.n - 1.0001);
    }
    i = clamp(i + step, 0, tr.n - 1);
  }
  return i;
}

export interface Pose { x: number; y: number; z: number; fx: number; fy: number; fz: number; ux: number; uy: number; uz: number; }

/** Surface frame at fractional index (render/air use only). */
export function frameAt(tr: Track, fi: number, d: number, out: { px: number; py: number; pz: number; tx: number; ty: number; tz: number; ux: number; uy: number; uz: number; rx: number; ry: number; rz: number }): void {
  const i = clamp(Math.floor(fi), 0, tr.n - 2);
  const f = clamp(fi - i, 0, 1);
  const lerp = (a: Float64Array) => a[i] + (a[i + 1] - a[i]) * f;
  let tx = lerp(tr.tx), ty = lerp(tr.ty), tz = lerp(tr.tz);
  let ux = lerp(tr.ux), uy = lerp(tr.uy), uz = lerp(tr.uz);
  let l = Math.sqrt(tx * tx + ty * ty + tz * tz); tx /= l; ty /= l; tz /= l;
  const dd = ux * tx + uy * ty + uz * tz; ux -= tx * dd; uy -= ty * dd; uz -= tz * dd;
  l = Math.sqrt(ux * ux + uy * uy + uz * uz); ux /= l; uy /= l; uz /= l;
  const rx = ty * uz - tz * uy, ry = tz * ux - tx * uz, rz = tx * uy - ty * ux;
  out.tx = tx; out.ty = ty; out.tz = tz; out.ux = ux; out.uy = uy; out.uz = uz; out.rx = rx; out.ry = ry; out.rz = rz;
  out.px = lerp(tr.px) + rx * d; out.py = lerp(tr.py) + ry * d; out.pz = lerp(tr.pz) + rz * d;
}

export function surfaceName(s: number): string {
  return ['asphalt', 'dirt', 'grass', 'ice', 'sand', 'steel'][s] ?? 'asphalt';
}
