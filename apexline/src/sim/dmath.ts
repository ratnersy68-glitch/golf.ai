/**
 * Deterministic math helpers.
 *
 * Math.sin / Math.cos are NOT guaranteed bit-identical across JS engines
 * (V8 vs JavaScriptCore vs SpiderMonkey). Replays and benchmark validation need
 * identical results everywhere, so the simulation only uses +, -, *, /, sqrt
 * (all exactly specified by IEEE-754) and the polynomial trig below.
 */

const TWO_PI = 6.283185307179586;
const INV_TWO_PI = 0.15915494309189535;

/** sin(x) via range reduction + Taylor series (|err| < 1e-10). */
export function dsin(x: number): number {
  x = x - Math.floor(x * INV_TWO_PI + 0.5) * TWO_PI; // -> [-pi, pi]
  const x2 = x * x;
  // Nested Taylor form: 1 - x2/(2*3) (1 - x2/(4*5) (1 - ...)); only + - * / so it is exact IEEE.
  let t = 1;
  for (let k = 11; k >= 1; k--) {
    t = 1 - (x2 / ((2 * k) * (2 * k + 1))) * t;
  }
  return x * t;
}
export function dcos(x: number): number {
  x = x - Math.floor(x * INV_TWO_PI + 0.5) * TWO_PI;
  const x2 = x * x;
  let t = 1;
  for (let k = 11; k >= 1; k--) {
    t = 1 - (x2 / ((2 * k - 1) * (2 * k))) * t;
  }
  return t;
}

/** Atan approximation (|err| < 1e-5) built from basic arithmetic only. */
export function datan(x: number): number {
  const neg = x < 0;
  if (neg) x = -x;
  let inv = false;
  if (x > 1) { x = 1 / x; inv = true; }
  const x2 = x * x;
  let r = x * (0.9998660 + x2 * (-0.3302995 + x2 * (0.1801410 + x2 * (-0.0851330 + x2 * 0.0208351))));
  if (inv) r = 1.5707963267948966 - r;
  return neg ? -r : r;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
export function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
export function smooth01(t: number): number { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
export function sign(v: number): number { return v < 0 ? -1 : 1; }

/** Mulberry32 seeded PRNG (integer ops only => deterministic). */
export class Rng {
  private s: number;
  constructor(seed: number) { this.s = seed >>> 0; }
  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a: number, b: number): number { return a + (b - a) * this.next(); }
  int(a: number, b: number): number { return Math.floor(this.range(a, b + 1)); }
  pick<T>(arr: readonly T[]): T { return arr[Math.floor(this.next() * arr.length)]; }
  chance(p: number): boolean { return this.next() < p; }
  gauss(): number { return (this.next() + this.next() + this.next() + this.next() - 2) * 1.7320508; }
}

export function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}

export { TWO_PI };
