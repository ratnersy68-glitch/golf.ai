import type { Vec2 } from '../data/types';

/** Deterministic PRNG (mulberry32). Used everywhere randomness must be reproducible (scatter, replays, ghosts). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Closed centripetal-ish Catmull-Rom spline through control points. */
export function smoothClosed(points: Vec2[], samplesPerSegment = 8): Vec2[] {
  const n = points.length;
  if (n < 3) return points.slice();
  const out: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    for (let s = 0; s < samplesPerSegment; s++) {
      out.push(catmull(p0, p1, p2, p3, s / samplesPerSegment));
    }
  }
  return out;
}

/** Open Catmull-Rom spline (end points duplicated). */
export function smoothOpen(points: Vec2[], samplesPerSegment = 8): Vec2[] {
  const n = points.length;
  if (n < 2) return points.slice();
  const out: Vec2[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    for (let s = 0; s < samplesPerSegment; s++) out.push(catmull(p0, p1, p2, p3, s / samplesPerSegment));
  }
  out.push(points[n - 1]);
  return out;
}

function catmull(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])];
}

/** Turn a centre line + width into a closed polygon (for streams and paths). */
export function ribbonPolygon(path: Vec2[], width: number): Vec2[] {
  const left: Vec2[] = [];
  const right: Vec2[] = [];
  const hw = width / 2;
  for (let i = 0; i < path.length; i++) {
    const a = path[Math.max(0, i - 1)];
    const b = path[Math.min(path.length - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    // slight organic width variation
    const w = hw * (1 + 0.12 * Math.sin(i * 0.9));
    left.push([path[i][0] - dy * w, path[i][1] + dx * w]);
    right.push([path[i][0] + dy * w, path[i][1] - dx * w]);
  }
  return left.concat(right.reverse());
}

export function pointInPolygon(x: number, y: number, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = clamp(t, 0, 1);
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

export function distToPolyline(px: number, py: number, pts: Vec2[], closed = false): number {
  let d = Infinity;
  const n = pts.length;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    d = Math.min(d, distToSegment(px, py, a[0], a[1], b[0], b[1]));
  }
  return d;
}

/** Signed distance: negative inside the polygon. */
export function signedDistance(px: number, py: number, poly: Vec2[]): number {
  const d = distToPolyline(px, py, poly, true);
  return pointInPolygon(px, py, poly) ? -d : d;
}

export interface Bounds2 {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function polyBounds(poly: Vec2[], pad = 0): Bounds2 {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const [x, y] of poly) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
}

export function inBounds(b: Bounds2, x: number, y: number): boolean {
  return x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY;
}

export function polylineLength(pts: Vec2[]): number {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
}

/** Simple value noise for texture/terrain detail. */
export function valueNoise2(x: number, y: number, seed = 0): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const h = (i: number, j: number) => {
    let n = i * 374761393 + j * 668265263 + seed * 144269504;
    n = (n ^ (n >>> 13)) * 1274126177;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  };
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v);
}

export function fbm2(x: number, y: number, seed = 0, octaves = 4): number {
  let a = 0.5,
    f = 1,
    s = 0;
  for (let i = 0; i < octaves; i++) {
    s += a * valueNoise2(x * f, y * f, seed + i * 17);
    a *= 0.5;
    f *= 2;
  }
  return s;
}
