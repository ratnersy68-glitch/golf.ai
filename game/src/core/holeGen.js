// Turns a compact hole description into a playable hole:
// centerline, height field, surface map, hazards, trees, decorations, pin.
// Plan coordinates: x = right, y = forward (from the tee), units = yards.
// Height h is also in yards.

import { Noise2D, mulberry32, hashString, clamp, lerp, smoothstep } from './noise.js';
import { THEMES } from '../data/themes.js';

export const S = {
  DEEP: 0, ROUGH: 1, FIRSTCUT: 2, FAIRWAY: 3, FRINGE: 4, GREEN: 5, TEE: 6,
  SAND: 7, WASTE: 8, WATER: 9, BRUSH: 10, STRAW: 11, PATH: 12,
};
export const SURF_KEYS = ['deep', 'rough', 'firstcut', 'fairway', 'fringe', 'green', 'tee', 'sand', 'waste', 'water', 'brush', 'straw', 'path'];

const DEG = Math.PI / 180;
const STEP = 2; // centerline sample spacing (yards)

export class Hole {
  constructor(course, holeIdx, opts = {}) {
    this.course = course;
    this.idx = holeIdx;
    this.def = course.holes[holeIdx];
    this.number = holeIdx + 1;
    this.par = this.def.p;
    this.theme = THEMES[course.theme];
    this.teeFactor = opts.teeFactor ?? 1;
    this.seed = hashString(course.id + ':' + holeIdx);
    this.rng = mulberry32(this.seed);
    this.noise = new Noise2D(this.seed);
    this.links = !!this.theme.links;
    this.cartSide = (this.seed & 1) ? 1 : -1;
    this.L = this.def.y;
    this.buildCenterline();
    this.buildGreen();
    this.buildHazards();
    this.buildTees();
    this.buildGrid();
    this.placeTrees();
    this.buildDecor();
    this.setPin(opts.pinSeed ?? 1, opts.pinDifficulty ?? 0.5);
    this.yards = Math.round(this.L - this.teeS);
  }

  // ---------- centerline ----------
  buildCenterline() {
    const h = this.def;
    const L = this.L;
    let hd = (h.ang || 0) * DEG;
    const raw = [[0, 0]];
    let x = 0, y = 0;
    const walk = (len) => {
      for (let i = 0; i < len; i++) { x += Math.sin(hd); y += Math.cos(hd); raw.push([x, y]); }
    };
    let used = 0;
    if (h.p > 3 && h.dl && h.at) {
      walk(h.at); used = h.at; hd += h.dl * DEG;
      if (h.dl2 && h.at2) { walk(h.at2 - h.at); used = h.at2; hd += h.dl2 * DEG; }
    }
    walk(Math.max(10, L - used));
    // smooth corners
    let pts = raw;
    for (let pass = 0; pass < 4; pass++) {
      const out = pts.map(p => p.slice());
      const W = 22;
      for (let i = 1; i < pts.length - 1; i++) {
        let sx = 0, sy = 0, n = 0;
        for (let k = -W; k <= W; k++) {
          const j = clamp(i + k, 0, pts.length - 1);
          sx += pts[j][0]; sy += pts[j][1]; n++;
        }
        out[i][0] = sx / n; out[i][1] = sy / n;
      }
      pts = out;
    }
    // arc length + rescale so length == L
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const sc = L / len;
    pts = pts.map(p => [p[0] * sc, p[1] * sc]);
    // resample every STEP yards with extension behind the tee and past the green
    const res = [];
    const t0 = norm2(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
    const n = pts.length;
    const t1 = norm2(pts[n - 1][0] - pts[n - 6][0], pts[n - 1][1] - pts[n - 6][1]);
    const PRE = 60, POST = 90;
    for (let s = -PRE; s < 0; s += STEP) res.push([t0[0] * s, t0[1] * s, s]);
    let acc = 0, j = 1, sNext = 0;
    res.push([pts[0][0], pts[0][1], 0]); sNext = STEP;
    while (j < n) {
      const seg = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
      while (acc + seg >= sNext && sNext <= L) {
        const f = (sNext - acc) / seg;
        res.push([lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f), sNext]);
        sNext += STEP;
      }
      acc += seg; j++;
    }
    const end = pts[n - 1];
    if (res[res.length - 1][2] < L - 0.01) res.push([end[0], end[1], L]);
    for (let s = STEP; s <= POST; s += STEP) res.push([end[0] + t1[0] * s, end[1] + t1[1] * s, L + s]);
    const m = res.length;
    this.cx = new Float32Array(m); this.cy = new Float32Array(m); this.cs = new Float32Array(m);
    this.tx = new Float32Array(m); this.ty = new Float32Array(m);
    for (let i = 0; i < m; i++) { this.cx[i] = res[i][0]; this.cy[i] = res[i][1]; this.cs[i] = res[i][2]; }
    for (let i = 0; i < m; i++) {
      const a = Math.max(0, i - 2), b = Math.min(m - 1, i + 2);
      const t = norm2(this.cx[b] - this.cx[a], this.cy[b] - this.cy[a]);
      this.tx[i] = t[0]; this.ty[i] = t[1];
    }
    this.nC = m;
    this.endT = t1;
    this.chordLen = Math.hypot(end[0], end[1]);
    this.chordDir = norm2(end[0], end[1]);
  }

  // point on centerline at s
  at(s) {
    const i0 = this.indexAt(s);
    const i1 = Math.min(this.nC - 1, i0 + 1);
    const f = clamp((s - this.cs[i0]) / Math.max(1e-6, this.cs[i1] - this.cs[i0]), 0, 1);
    return {
      x: lerp(this.cx[i0], this.cx[i1], f), y: lerp(this.cy[i0], this.cy[i1], f),
      tx: lerp(this.tx[i0], this.tx[i1], f), ty: lerp(this.ty[i0], this.ty[i1], f),
    };
  }
  indexAt(s) {
    // samples are nearly uniform
    let i = Math.floor((s - this.cs[0]) / STEP);
    i = clamp(i, 0, this.nC - 2);
    while (i > 0 && this.cs[i] > s) i--;
    while (i < this.nC - 2 && this.cs[i + 1] < s) i++;
    return i;
  }
  offset(s, off) {
    const c = this.at(s);
    return [c.x + c.ty * off, c.y - c.tx * off];
  }

  // nearest centerline projection: returns [s, d] (d > 0 = right side)
  nearest(x, y, out = [0, 0]) {
    const cx = this.cx, cy = this.cy, n = this.nC;
    let best = 1e18, bi = 0;
    for (let i = 0; i < n; i += 5) {
      const dx = x - cx[i], dy = y - cy[i];
      const d2 = dx * dx + dy * dy;
      if (d2 < best) { best = d2; bi = i; }
    }
    const a = Math.max(0, bi - 6), b = Math.min(n - 2, bi + 6);
    best = 1e18;
    let bs = 0, bd = 0;
    for (let i = a; i <= b; i++) {
      const x0 = cx[i], y0 = cy[i], x1 = cx[i + 1], y1 = cy[i + 1];
      const vx = x1 - x0, vy = y1 - y0;
      const L2 = vx * vx + vy * vy;
      let t = ((x - x0) * vx + (y - y0) * vy) / L2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = x0 + vx * t, py = y0 + vy * t;
      const dx = x - px, dy = y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < best) {
        best = d2;
        bs = this.cs[i] + t * (this.cs[i + 1] - this.cs[i]);
        // sign: right normal of segment = (vy, -vx)
        const sgn = (dx * vy - dy * vx) >= 0 ? 1 : -1;
        bd = Math.sqrt(d2) * sgn;
      }
    }
    // beyond extensions, extrapolate s along the end tangents
    out[0] = bs; out[1] = bd;
    return out;
  }

  // fairway half width at s
  fwHalf(s) {
    const fw = this.def.fw || 32;
    return fw / 2 * (1 + 0.16 * this.noise.n1(s / 38 + 11.3));
  }

  // ---------- green ----------
  buildGreen() {
    const d = this.def, r = this.rng;
    const gw = d.gw || 1;
    const G = this.at(this.L);
    this.G = [G.x, G.y];
    this.gT = [this.endT[0], this.endT[1]];
    this.gN = [this.endT[1], -this.endT[0]];
    this.grx = (12.5 + r() * 3) * gw * (d.p === 3 ? 0.95 : 1);
    this.gry = (15.5 + r() * 4) * gw * (d.p === 3 ? 0.9 : 1);
    this.grot = (r() - 0.5) * 0.5;
    this.gcos = Math.cos(this.grot); this.gsin = Math.sin(this.grot);
    const gs = d.gs ?? 1;
    const a = r() * Math.PI * 2;
    // default tilt: back-to-front plus random component (yards per yard)
    const mag = (0.008 + r() * 0.013) * gs;
    this.gTilt = [Math.cos(a) * mag * 0.7, 0];
    this.gTilt[1] = -(0.006 + r() * 0.01) * gs; // lower at front (toward tee) => rises to the back
    this.gTier = r() < 0.3 * gs ? { off: (r() - 0.3) * this.gry * 0.7, h: (0.14 + r() * 0.14) * Math.min(1.4, gs), ang: (r() - 0.5) * 0.8 } : null;
    this.gUnd = 0.1 * gs;
    this.dome = !!d.dome;
  }
  // green local coords (lat, dep) before rotation
  greenLocal(x, y) {
    const vx = x - this.G[0], vy = y - this.G[1];
    let l = vx * this.gN[0] + vy * this.gN[1];
    let p = vx * this.gT[0] + vy * this.gT[1];
    const lr = l * this.gcos - p * this.gsin;
    const pr = l * this.gsin + p * this.gcos;
    return [lr, pr];
  }
  greenSdf(x, y) {
    const gd = Math.hypot(x - this.G[0], y - this.G[1]);
    const gm = Math.max(this.grx, this.gry);
    if (gd > gm * 1.35 + 14) return gd - gm * 1.2;
    const [l, p] = this.greenLocal(x, y);
    const nx = l / this.grx, ny = p / this.gry;
    const r = Math.sqrt(nx * nx + ny * ny) + 1e-6;
    const edge = 1 + 0.09 * this.noise.noise(nx / r * 1.3 + 40, ny / r * 1.3 + 40) * 1.6;
    return (r / edge - 1) * Math.min(this.grx, this.gry);
  }
  greenEdgeDist(dirx, diry) {
    // distance from green center to edge along world dir
    const l = dirx * this.gN[0] + diry * this.gN[1];
    const p = dirx * this.gT[0] + diry * this.gT[1];
    const lr = l * this.gcos - p * this.gsin, pr = l * this.gsin + p * this.gcos;
    return 1 / Math.sqrt((lr / this.grx) ** 2 + (pr / this.gry) ** 2);
  }
  greenDir(angDeg) {
    const a = angDeg * DEG;
    // 0 = front (toward tee), 90 = right, 180 = back
    return norm2(-this.gT[0] * Math.cos(a) + this.gN[0] * Math.sin(a), -this.gT[1] * Math.cos(a) + this.gN[1] * Math.sin(a));
  }

  // ---------- hazards ----------
  buildHazards() {
    const r = this.rng;
    this.shapes = []; // {surf, sdf(x,y,s,d), depth, kind, level?}
    this.fixedTrees = [];
    this.decorSpec = [];
    this.oceanSide = 0;
    const T = this.theme;
    const E = (fn) => fn;
    const ellipse = (cx, cy, rx, ry, rot, noiseAmp = 0.12) => {
      const c = Math.cos(rot), s = Math.sin(rot);
      const nz = this.noise, o = r() * 100;
      const mn = Math.min(rx, ry);
      return (x, y) => {
        const dx = x - cx, dy = y - cy;
        const u = (dx * c - dy * s) / rx, v = (dx * s + dy * c) / ry;
        const rr = Math.sqrt(u * u + v * v) + 1e-6;
        const e = 1 + noiseAmp * nz.noise(u / rr * 1.4 + o, v / rr * 1.4 + o) * 1.8;
        return (rr / e - 1) * mn;
      };
    };
    const rotAt = (s) => { const c = this.at(s); return Math.atan2(c.tx, c.ty); };
    const add = (o) => { this.shapes.push(o); return o; };
    const baseAt = (x, y) => this.baseHeight(x, y);

    for (const hz of this.def.hz || []) {
      const k = hz[0];
      if (k === 'fb' || k === 'pot' || k === 'waste') {
        const s = hz[1], off = hz[2];
        const [cx, cy] = this.offset(s, off);
        let rx, ry, depth, surf = S.SAND, na = 0.14;
        if (k === 'fb') { rx = hz[3] || 6 + r() * 3; ry = hz[4] || 9 + r() * 5; depth = 0.7; }
        else if (k === 'pot') { rx = ry = 2.2 + r() * 0.6; depth = 1.3; na = 0.05; }
        else { rx = hz[3]; ry = hz[4]; depth = 0.2; surf = S.WASTE; na = 0.25; }
        if (k === 'waste' && this.links) { surf = S.DEEP; depth = -0.6; this.decorSpec.push({ kind: 'gorse', x: cx, y: cy, rx, ry, rot: rotAt(s) }); }
        add({ surf, depth, kind: k, cx, cy, rad: Math.max(rx, ry) * 1.3, sdf: ellipse(cx, cy, rx, ry, rotAt(s) + (r() - 0.5) * 0.4, na) });
      } else if (k === 'gb') {
        const size = hz[2] || 1;
        const dir = this.greenDir(hz[1] + (r() - 0.5) * 10);
        const rEdge = this.greenEdgeDist(dir[0], dir[1]);
        const bx = (4.5 + r() * 2) * size, by = (8 + r() * 4) * size;
        const dist = rEdge + 1.6 + bx * 0.85;
        const cx = this.G[0] + dir[0] * dist, cy = this.G[1] + dir[1] * dist;
        // long axis tangential to green: ellipse's "x" axis along dir
        const rot = Math.atan2(dir[0], dir[1]) + Math.PI / 2;
        add({ surf: S.SAND, depth: 0.9 * Math.min(1.3, size), kind: 'gb', cx, cy, rad: by * 1.3, sdf: ellipse(cx, cy, by, bx, rot, 0.16) });
      } else if (k === 'xb') {
        const s = hz[1], depthY = hz[2];
        const [cx, cy] = this.offset(s, (r() - 0.5) * 8);
        const rx = this.fwHalf(s) + 10;
        add({ surf: S.SAND, depth: 0.9, kind: 'xb', cx, cy, rad: rx * 1.3, sdf: ellipse(cx, cy, rx, depthY / 2 + 2, rotAt(s) + (r() - 0.5) * 0.5, 0.2) });
      } else if (k === 'pews') {
        const [s1, s2, side] = [hz[1], hz[2], hz[3]];
        const sm = (s1 + s2) / 2;
        const [cx, cy] = this.offset(sm, side * (this.fwHalf(sm) + 14));
        const rot = rotAt(sm);
        const f = ellipse(cx, cy, 13, (s2 - s1) / 2, rot, 0.08);
        add({ surf: S.SAND, depth: 0.6, kind: 'pews', cx, cy, rad: (s2 - s1) * 0.7, s1, sdf: f });
      } else if (k === 'pond') {
        const [cx, cy] = this.offset(hz[1], hz[2]);
        const sh = add({ surf: S.WATER, depth: 1.5, kind: 'pond', cx, cy, rad: Math.max(hz[3], hz[4]) * 1.3, sdf: ellipse(cx, cy, hz[3], hz[4], rotAt(hz[1]), 0.15) });
        sh.levelAt = [cx, cy];
      } else if (k === 'gpond') {
        const size = hz[2] || 1;
        const dir = this.greenDir(hz[1]);
        const rEdge = this.greenEdgeDist(dir[0], dir[1]);
        const tw = 16 * size, dp = 11 * size;
        const dist = rEdge + 3 + dp * 0.8;
        const cx = this.G[0] + dir[0] * dist, cy = this.G[1] + dir[1] * dist;
        const rot = Math.atan2(dir[0], dir[1]) + Math.PI / 2;
        const sh = add({ surf: S.WATER, depth: 1.5, kind: 'pond', cx, cy, rad: tw * 1.4, sdf: ellipse(cx, cy, tw, dp, rot, 0.12) });
        sh.levelAt = [cx, cy];
      } else if (k === 'lat' || k === 'ocean' || k === 'canyon') {
        const side = hz[1];
        const off = k === 'lat' ? hz[4] : hz[2];
        const s1 = k === 'lat' ? hz[2] : (hz[3] ?? -200);
        const s2 = k === 'lat' ? hz[3] : (hz[4] ?? this.L + 300);
        const width = k === 'lat' ? 38 : 2000;
        const nz = this.noise, o = r() * 50;
        const sdf = (x, y, s, d) => {
          let v = off + 4 * nz.n1(s / 45 + o) - side * d;
          v = Math.max(v, s1 - s, s - s2);
          if (k === 'lat') v = Math.max(v, side * d - (off + width));
          return v;
        };
        if (k === 'ocean') { this.oceanSide = side; this.oceanOff = off; }
        const sh = add({ surf: k === 'canyon' ? S.BRUSH : S.WATER, depth: k === 'canyon' ? 7 : 1.6, kind: k, sdf, band: true, side, off, s1, s2 });
        const sm = clamp((s1 + s2) / 2, 0, this.L);
        sh.levelAt = this.offset(sm, side * (off + 8));
      } else if (k === 'cross' || k === 'xcanyon') {
        const s1 = hz[1], s2 = hz[2];
        const nz = this.noise, o = r() * 50;
        const sdf = (x, y, s, d) => {
          const ss = s + 3 * nz.n1(d / 18 + o);
          return Math.max(s1 - ss, ss - s2, Math.abs(d) - 110);
        };
        const sh = add({ surf: k === 'cross' ? S.WATER : S.BRUSH, depth: k === 'cross' ? 1.3 : 3, kind: k, sdf, band: true, s1, s2 });
        sh.levelAt = this.offset((s1 + s2) / 2, 0);
        if (k === 'cross') this.crossings = (this.crossings || []).concat([[s1, s2]]);
      } else if (k === 'island') {
        const R = Math.max(this.grx, this.gry) + 24;
        const G = this.G;
        const sdf = (x, y) => Math.max(Math.hypot(x - G[0], y - G[1]) - R, -(this.greenSdf(x, y) - 3.2));
        const sh = add({ surf: S.WATER, depth: 1.8, kind: 'island', cx: G[0], cy: G[1], rad: R + 4, sdf });
        const d0 = this.greenDir(0);
        sh.levelAt = [G[0] + d0[0] * (R - 4), G[1] + d0[1] * (R - 4)];
        this.island = true;
      } else if (k === 'tree') {
        const [x, y] = this.offset(hz[1], hz[2]);
        this.fixedTrees.push({ x, y, r: hz[3] || 7 });
      } else if (k === 'gcb') {
        const cx = this.G[0] + this.gN[0] * 1.5, cy = this.G[1] + this.gN[1] * 1.5;
        add({ surf: S.SAND, depth: 0.9, kind: 'gcb', cx, cy, rad: 5, sdf: ellipse(cx, cy, 3.4, 2.8, 0, 0.05), inGreen: true });
      } else if (k === 'road') {
        const G = this.G, T = this.gT, N = this.gN;
        const ry = this.gry;
        const sdf = (x, y) => {
          const vx = x - G[0], vy = y - G[1];
          const p = vx * T[0] + vy * T[1], l = vx * N[0] + vy * N[1];
          return Math.max(Math.abs(p - (ry + 6)) - 2.5, Math.abs(l) - 60);
        };
        add({ surf: S.PATH, depth: 0.1, kind: 'road', cx: G[0] + T[0] * (ry + 6), cy: G[1] + T[1] * (ry + 6), rad: 70, sdf });
        this.decorSpec.push({ kind: 'wall', x: G[0] + T[0] * (ry + 10), y: G[1] + T[1] * (ry + 10), dir: [N[0], N[1]], len: 110 });
        const hx = this.offset(150, 45);
        this.decorSpec.push({ kind: 'hotel', x: hx[0], y: hx[1], rot: rotAt(150) });
      } else if (k === 'valley') {
        this.valley = true;
      } else if (k === 'stands') {
        const dir = this.greenDir(hz[1]);
        const dist = this.greenEdgeDist(dir[0], dir[1]) + 24;
        this.decorSpec.push({ kind: 'stands', x: this.G[0] + dir[0] * dist, y: this.G[1] + dir[1] * dist, face: [-dir[0], -dir[1]] });
      } else if (k === 'bridge') {
        const c = this.at(hz[1]);
        const [x, y] = this.offset(hz[1], -this.fwHalf(hz[1]) * 0.6);
        this.decorSpec.push({ kind: 'bridge', x, y, dir: [c.tx, c.ty] });
      } else if (k === 'target') {
        const [x, y] = this.offset(hz[1], hz[2]);
        this.decorSpec.push({ kind: 'target', x, y, dist: hz[1] });
      } else if (k === 'flowers') {
        const [x, y] = this.offset(hz[1], hz[2]);
        this.decorSpec.push({ kind: 'flowers', x, y, r: 14 });
      }
    }
    // fairway start
    const p = this.def.p;
    this.fStart = this.def.range ? 12 : p === 3 ? this.L - 40 : (this.links ? 30 : Math.min(150, this.L * 0.38));
    // water levels
    for (const sh of this.shapes) {
      if (sh.surf === S.WATER) {
        if (sh.kind === 'ocean') sh.level = T.seaLevel ?? -8;
        else {
          const [lx, ly] = sh.levelAt;
          sh.level = this.baseHeight(lx, ly) - 0.9;
          if (sh.kind === 'island') sh.level = Math.min(sh.level, this.baseHeight(this.G[0], this.G[1]) - 1.2);
        }
      } else if (sh.surf === S.BRUSH && sh.levelAt) {
        const [lx, ly] = sh.levelAt;
        sh.level = this.baseHeight(lx, ly);
      }
    }
    this.waterShapes = this.shapes.filter(s => s.surf === S.WATER);
  }

  buildTees() {
    this.teeS = this.L * (1 - this.teeFactor);
    // tee boxes for all standard tee sets
    this.teeBoxes = [1.0, 0.93, 0.86, 0.75].map(f => ({ s: this.L * (1 - f), f }));
    const tp = this.at(this.teeS);
    this.tee = [tp.x, tp.y];
    this.teeDir = [tp.tx, tp.ty];
  }

  // ---------- heights ----------
  // smooth base terrain available everywhere (no local features)
  baseHeight(x, y) {
    const T = this.theme;
    const el = (this.def.el || 0) / 3;
    const sc = (x * this.chordDir[0] + y * this.chordDir[1]) / this.chordLen;
    const E = el * smoothstep(0.1, 0.92, sc);
    const f = T.undFreq;
    let U = T.undulation * this.noise.fbm(x * f + 17.3, y * f - 4.1, 4);
    if (this.links) U += 1.1 * this.noise.fbm(x / 11 + 3.1, y / 11 + 8.7, 3);
    return E + U;
  }

  heightFeatures(x, y, s, d, far = false) {
    const T = this.theme;
    const base = this.baseHeight(x, y);
    let h = far ? base - 1.0 : base;
    const ad = Math.abs(d);
    const w = this.fwHalf(s);
    const inPlay = s > -30 && s < this.L + 40;
    let gs = 99;
    if (!far) {
      // soften undulation on the playing corridor, rise at the edges
      const calm = inPlay ? lerp(0.45, 1, smoothstep(w, w + 40, ad)) : 1;
      const sc = (x * this.chordDir[0] + y * this.chordDir[1]) / this.chordLen;
      const E = (this.def.el || 0) / 3 * smoothstep(0.1, 0.92, sc);
      h = E + (base - E) * calm;
      h += (T.lateralRise || 0) * clamp(ad - (w + 10), 0, 70);
      // green complex
      gs = this.greenSdf(x, y);
      if (gs < 12) {
        const wg = 1 - smoothstep(0, 10, gs);
        h = lerp(h, this.greenHeight(x, y), wg);
      }
      // tee boxes
      for (const tb of this.teeBoxes) {
        const q = Math.max(Math.abs(s - tb.s) - 6, ad - 5);
        if (q < 4) {
          const c = this.at(tb.s);
          const th = this.teeHeight(tb);
          h = lerp(h, th, 1 - smoothstep(0, 4, q));
        }
      }
      if (this.valley) {
        const vx = this.G[0] - this.gT[0] * (this.gry + 5), vy = this.G[1] - this.gT[1] * (this.gry + 5);
        const r2 = (x - vx) ** 2 + (y - vy) ** 2;
        h -= 1.3 * Math.exp(-r2 / (2 * 36)) * smoothstep(-6, 2, gs);
      }
    }
    // hazards
    for (const sh of this.shapes) {
      if (sh.rad && !sh.band) {
        const dx = x - sh.cx, dy = y - sh.cy;
        if (dx * dx + dy * dy > (sh.rad + 8) ** 2) continue;
      }
      const v = sh.sdf(x, y, s, d);
      // keep putting surfaces smooth: hazards fade out approaching the green
      const gk = sh.inGreen ? 1 : smoothstep(0, 2.5, gs);
      if (sh.surf === S.WATER) {
        const L = sh.level;
        if (v < 0) h = Math.min(h, L - 0.05 - sh.depth * smoothstep(0, 4, -v));
        else if (sh.kind === 'ocean') {
          if (v < 3.5) h = lerp(L - 1.2, Math.max(h, L + 3), smoothstep(0, 3.5, v));
          else h = Math.max(h, L + 3 + (v - 3.5) * 0.05);
        } else if (v < 6) h = lerp(h, Math.max(h, L + 0.12 + v * 0.07), gk);
      } else if (far) {
        continue;
      } else if (sh.surf === S.BRUSH) {
        if (v < 0) {
          const dep = sh.depth * smoothstep(0, 10, -v);
          h -= dep + 0.8 * this.noise.noise(x / 5, y / 5) * smoothstep(0, 4, -v);
        }
      } else if (sh.surf === S.SAND) {
        if (gk <= 0) continue;
        if (v < 0) {
          h -= sh.depth * smoothstep(0, 2.0, -v) * gk;
          if (sh.kind === 'pews') {
            const k = ((s - sh.s1) / 7) % 1;
            if (k > 0.72) h += sh.depth * 0.9;
          }
        } else if (v < 1.6) h += 0.22 * (1 - v / 1.6) * (sh.inGreen ? 0.3 : gk);
      } else if (sh.surf === S.WASTE) {
        if (v < 0) h -= sh.depth * smoothstep(0, 3, -v);
      } else if (sh.surf === S.DEEP && sh.depth < 0) {
        if (v < 0) h -= sh.depth * smoothstep(0, 5, -v); // gorse mounds
      }
    }
    return h;
  }

  greenHeight(x, y) {
    if (this._gh0 === undefined) this._gh0 = this.baseHeight(this.G[0], this.G[1]) + 0.35;
    const [l, p] = this.greenLocal(x, y);
    let h = this._gh0 + this.gTilt[0] * l + this.gTilt[1] * p;
    h += this.gUnd * this.noise.fbm(x / 17 + 91, y / 17 + 7, 2);
    if (this.gTier) {
      const t = this.gTier;
      const q = p * Math.cos(t.ang) + l * Math.sin(t.ang) - t.off;
      h += t.h * smoothstep(-3.2, 3.2, q);
    }
    if (this.dome) {
      const nx = l / this.grx, ny = p / this.gry;
      h -= 0.42 * (nx * nx + ny * ny);
    }
    return h;
  }
  teeHeight(tb) {
    if (!tb.h) {
      const c = this.at(tb.s);
      tb.h = this.baseHeight(c.x, c.y) + 0.45;
    }
    return tb.h;
  }

  // ---------- surface ----------
  classify(x, y, s, d) {
    const ad = Math.abs(d);
    let sand = false, waste = false, path = false, pews = false;
    for (const sh of this.shapes) {
      if (sh.rad && !sh.band) {
        const dx = x - sh.cx, dy = y - sh.cy;
        if (dx * dx + dy * dy > sh.rad * sh.rad) continue;
      }
      const v = sh.sdf(x, y, s, d);
      if (v >= 0) continue;
      if (sh.surf === S.WATER) return S.WATER;
      if (sh.surf === S.BRUSH) return S.BRUSH;
      if (sh.surf === S.SAND) {
        if (sh.inGreen) return S.SAND;
        if (sh.kind === 'pews' && ((s - sh.s1) / 7) % 1 > 0.72) pews = true;
        else sand = true;
      } else if (sh.surf === S.WASTE) waste = true;
      else if (sh.surf === S.PATH) path = true;
      else if (sh.surf === S.DEEP) return S.DEEP;
    }
    const gs = this.greenSdf(x, y);
    if (gs < 0) return S.GREEN;
    if (sand) return S.SAND;
    if (pews) return S.ROUGH;
    if (path) return S.PATH;
    if (gs < 1.8) return S.FRINGE;
    if (waste) return S.WASTE;
    for (const tb of this.teeBoxes) {
      if (Math.abs(s - tb.s) < 6 && ad < 5) return S.TEE;
    }
    const w = this.fwHalf(s);
    if (this.theme.cartPath && s > 12 && s < this.L - 30 && !this.def.range) {
      const off = this.cartSide * (w + 21 + 3 * this.noise.n1(s / 60 + 3));
      if (Math.abs(d - off) < 1.3) return S.PATH;
    }
    const inRange = s > this.fStart && s < this.L + 4;
    if (inRange && ad < w) return S.FAIRWAY;
    if (gs < 5.5 || (inRange && ad < w + 2.2)) return S.FIRSTCUT;
    if (this.links && s > -10 && s < this.L + 30 && ad < w + 3) return S.FIRSTCUT;
    const rw = 22 + 7 * this.noise.n1(s / 30 + 5);
    if (ad < w + rw && s > -25 && s < this.L + 40) {
      if (this.theme.sandyRough && this.noise.noise(x / 14, y / 14) > 0.05) return S.WASTE;
      return S.ROUGH;
    }
    if (this.theme.sandyRough) return S.WASTE;
    return S.DEEP;
  }

  // ---------- grid ----------
  buildGrid() {
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (let i = 0; i < this.nC; i++) {
      if (this.cs[i] < -40 || this.cs[i] > this.L + 70) continue;
      minX = Math.min(minX, this.cx[i]); maxX = Math.max(maxX, this.cx[i]);
      minY = Math.min(minY, this.cy[i]); maxY = Math.max(maxY, this.cy[i]);
    }
    const M = 140;
    minX = Math.floor(minX - M); maxX = Math.ceil(maxX + M);
    minY = Math.floor(minY - 90); maxY = Math.ceil(maxY + 100);
    this.gx0 = minX; this.gy0 = minY;
    this.gnx = maxX - minX + 1; this.gny = maxY - minY + 1;
    const nx = this.gnx, ny = this.gny, N = nx * ny;
    this.gS = new Float32Array(N); this.gD = new Float32Array(N); this.gH = new Float32Array(N);
    const tmp = [0, 0];
    const EDGE = 34;
    for (let j = 0; j < ny; j++) {
      const y = minY + j;
      for (let i = 0; i < nx; i++) {
        const x = minX + i;
        this.nearest(x, y, tmp);
        const k = j * nx + i;
        this.gS[k] = tmp[0]; this.gD[k] = tmp[1];
        let h = this.heightFeatures(x, y, tmp[0], tmp[1]);
        const e = Math.min(i, j, nx - 1 - i, ny - 1 - j);
        if (e < EDGE) {
          const fh = this.heightFeatures(x, y, tmp[0], tmp[1], true);
          h = lerp(fh, h, smoothstep(2, EDGE, e));
        }
        this.gH[k] = h;
      }
    }
    // surface at half-yard resolution
    this.snx = nx * 2 - 1; this.sny = ny * 2 - 1;
    this.surf = new Uint8Array(this.snx * this.sny);
    this.stripe = new Uint8Array(this.snx * this.sny);
    for (let j = 0; j < this.sny; j++) {
      const y = minY + j * 0.5;
      const j0 = j >> 1, j1 = Math.min(ny - 1, j0 + (j & 1));
      for (let i = 0; i < this.snx; i++) {
        const x = minX + i * 0.5;
        const i0 = i >> 1, i1 = Math.min(nx - 1, i0 + (i & 1));
        const a = j0 * nx + i0, b = j0 * nx + i1, c = j1 * nx + i0, dd = j1 * nx + i1;
        let s = (this.gS[a] + this.gS[b] + this.gS[c] + this.gS[dd]) * 0.25;
        let d = (this.gD[a] + this.gD[b] + this.gD[c] + this.gD[dd]) * 0.25;
        // avoid averaging across sign flips far from the line
        if (Math.sign(this.gD[a]) !== Math.sign(this.gD[dd]) && Math.abs(this.gD[a]) > 5) { s = this.gS[a]; d = this.gD[a]; }
        const k = j * this.snx + i;
        this.surf[k] = this.classify(x, y, s, d);
        this.stripe[k] = (Math.floor(s / 9) & 1);
      }
    }
  }

  // bilinear (s, d) from the 1-yard grid, then classify
  classifyAt(x, y) {
    const fx = clamp(x - this.gx0, 0, this.gnx - 1.001), fy = clamp(y - this.gy0, 0, this.gny - 1.001);
    const i = Math.floor(fx), j = Math.floor(fy), u = fx - i, v = fy - j;
    const nx = this.gnx, k = j * nx + i;
    const S0 = this.gS, D0 = this.gD;
    if (Math.sign(D0[k]) !== Math.sign(D0[k + nx + 1]) && Math.abs(D0[k]) > 5) return this.classify(x, y, S0[k], D0[k]);
    const s = (S0[k] * (1 - u) + S0[k + 1] * u) * (1 - v) + (S0[k + nx] * (1 - u) + S0[k + nx + 1] * u) * v;
    const d = (D0[k] * (1 - u) + D0[k + 1] * u) * (1 - v) + (D0[k + nx] * (1 - u) + D0[k + nx + 1] * u) * v;
    return this.classify(x, y, s, d);
  }

  inGrid(x, y) {
    return x >= this.gx0 && y >= this.gy0 && x <= this.gx0 + this.gnx - 1 && y <= this.gy0 + this.gny - 1;
  }

  heightAt(x, y) {
    const fx = clamp(x - this.gx0, 0, this.gnx - 1.001), fy = clamp(y - this.gy0, 0, this.gny - 1.001);
    const i = Math.floor(fx), j = Math.floor(fy);
    const u = fx - i, v = fy - j;
    const nx = this.gnx, H = this.gH;
    const k = j * nx + i;
    const h00 = H[k], h10 = H[k + 1], h01 = H[k + nx], h11 = H[k + nx + 1];
    return (h00 * (1 - u) + h10 * u) * (1 - v) + (h01 * (1 - u) + h11 * u) * v;
  }
  // gradient (dh/dx, dh/dy)
  gradAt(x, y) {
    const e = 0.5;
    return [(this.heightAt(x + e, y) - this.heightAt(x - e, y)) / (2 * e), (this.heightAt(x, y + e) - this.heightAt(x, y - e)) / (2 * e)];
  }
  surfAt(x, y) {
    if (!this.inGrid(x, y)) return S.DEEP;
    const i = Math.round((x - this.gx0) * 2), j = Math.round((y - this.gy0) * 2);
    return this.surf[clamp(j, 0, this.sny - 1) * this.snx + clamp(i, 0, this.snx - 1)];
  }
  sdAt(x, y) { return this.nearest(x, y, [0, 0]); }

  isOB(x, y) {
    const m = 6;
    if (x < this.gx0 + m || y < this.gy0 + m || x > this.gx0 + this.gnx - m || y > this.gy0 + this.gny - m) return true;
    const [s, d] = this.nearest(x, y);
    const lim = this.links ? 120 : 100;
    return Math.abs(d) > lim + (this.def.fw || 32) / 2 || s < -45 || s > this.L + 75;
  }

  waterLevelAt(x, y) {
    const [s, d] = this.nearest(x, y);
    for (const sh of this.waterShapes) if (sh.sdf(x, y, s, d) < 0) return sh.level;
    return null;
  }

  // ---------- trees ----------
  placeTrees() {
    const T = this.theme.trees;
    const r = mulberry32(this.seed ^ 0x9e3779b9);
    this.trees = [];
    const types = T.types;
    const push = (x, y, type, scale = 1) => {
      const tr = makeTree(type, x, y, r, scale);
      tr.h0 = this.heightAt(x, y);
      this.trees.push(tr);
    };
    for (const ft of this.fixedTrees) push(ft.x, ft.y, types[0] === 'palm' ? 'oak' : (types.includes('oak') ? 'oak' : types[0] || 'cypress'), ft.r / 7);
    if (types.length && T.density > 0) {
      const sp = 8.5 / Math.sqrt(T.density);
      for (let y = this.gy0 + 4; y < this.gy0 + this.gny - 4; y += sp) {
        for (let x = this.gx0 + 4; x < this.gx0 + this.gnx - 4; x += sp) {
          const px = x + (r() - 0.5) * sp * 0.9, py = y + (r() - 0.5) * sp * 0.9;
          const gi = Math.round(px - this.gx0), gj = Math.round(py - this.gy0);
          const k = gj * this.gnx + gi;
          const s = this.gS[k], d = this.gD[k];
          const su = this.surfAt(px, py);
          if (!(su === S.ROUGH || su === S.DEEP || su === S.WASTE)) continue;
          const w = this.fwHalf(clamp(s, 0, this.L));
          const dd = Math.abs(d) - w;
          const nearLim = T.near + 6 * this.noise.noise(px / 40, py / 40);
          if (s > -15 && s < this.L + 25 && dd < nearLim) continue;
          if (s < -15 && Math.abs(d) < 14) continue;
          const gdist = Math.hypot(px - this.G[0], py - this.G[1]);
          if (gdist < Math.max(this.grx, this.gry) + 20) continue;
          if (Math.hypot(px - this.tee[0], py - this.tee[1]) < 14) continue;
          let clear = true;
          for (const sh of this.shapes) {
            if (sh.surf === S.WATER || sh.surf === S.SAND || sh.surf === S.BRUSH) {
              if (sh.sdf(px, py, s, d) < 4) { clear = false; break; }
            }
          }
          if (!clear) continue;
          const cluster = 0.5 + this.noise.noise(px / 55 + 3, py / 55 + 9) * 1.2;
          const prob = (T.lines ? (dd < nearLim + 40 ? 0.8 : 0.45) : 0.3) * cluster;
          if (r() > prob) continue;
          push(px, py, types[Math.floor(r() * types.length)]);
          if (this.trees.length > 2600) break;
        }
      }
    }
    // straw beneath pines
    if (this.theme.extras.includes('straw')) {
      for (const t of this.trees) {
        const R = t.cr * 1.25;
        for (let yy = -R; yy <= R; yy += 0.5) for (let xx = -R; xx <= R; xx += 0.5) {
          if (xx * xx + yy * yy > R * R) continue;
          const i = Math.round((t.x + xx - this.gx0) * 2), j = Math.round((t.y + yy - this.gy0) * 2);
          if (i < 0 || j < 0 || i >= this.snx || j >= this.sny) continue;
          const k = j * this.snx + i;
          if (this.surf[k] === S.ROUGH || this.surf[k] === S.DEEP) this.surf[k] = S.STRAW;
        }
      }
    }
    // spatial hash for collisions
    this.treeHash = new Map();
    for (const t of this.trees) {
      const R = t.cr + 1;
      for (let gx = Math.floor((t.x - R) / 10); gx <= Math.floor((t.x + R) / 10); gx++)
        for (let gy = Math.floor((t.y - R) / 10); gy <= Math.floor((t.y + R) / 10); gy++) {
          const key = gx * 100003 + gy;
          if (!this.treeHash.has(key)) this.treeHash.set(key, []);
          this.treeHash.get(key).push(t);
        }
    }
  }
  treesNear(x, y) {
    return this.treeHash.get(Math.floor(x / 10) * 100003 + Math.floor(y / 10)) || EMPTY;
  }

  buildDecor() {
    const r = mulberry32(this.seed ^ 0x51f15e);
    this.decor = this.decorSpec.slice();
    const n = this.number;
    const course = this.course;
    // clubhouse near 1st tee / 18th green, halfway house near 9/10
    if (n === 18 || n === 9) {
      const G = this.G, T = this.gT, N = this.gN;
      const side = n === 18 ? 1 : -1;
      this.decor.push({ kind: 'clubhouse', x: G[0] + T[0] * (this.gry + 70) + N[0] * side * 20, y: G[1] + T[1] * (this.gry + 70) + N[1] * side * 20, face: [-T[0], -T[1]], big: n === 18 });
    }
    if (n === 1 || n === 10) {
      const t = this.at(-40);
      this.decor.push({ kind: 'clubhouse', x: t.x - t.ty * 45, y: t.y + t.tx * 45 - 20, face: [t.tx, t.ty], big: n === 1 });
    }
    // carts parked by the tee
    const tp = this.at(this.teeS - 10);
    for (let i = 0; i < 2; i++) {
      this.decor.push({ kind: 'cart', x: tp.x + tp.ty * (13 + i * 2.2), y: tp.y - tp.tx * (13 + i * 2.2) - i * 0.5, rot: Math.atan2(tp.tx, tp.ty) + (r() - 0.5) * 0.3 });
    }
    // tee markers & bench
    this.decor.push({ kind: 'bench', x: tp.x - tp.ty * 9, y: tp.y + tp.tx * 9, rot: Math.atan2(tp.tx, tp.ty) });
    // azaleas / extras
    if (this.theme.extras.includes('azalea')) {
      for (let i = 0; i < 18; i++) {
        const s = r() * this.L;
        const side = r() < 0.5 ? -1 : 1;
        const [x, y] = this.offset(s, side * (this.fwHalf(s) + this.theme.trees.near + 2 + r() * 6));
        if (this.surfAt(x, y) === S.WATER) continue;
        this.decor.push({ kind: 'flowers', x, y, r: 5 + r() * 5 });
      }
    }
    // gallery ropes / crowd along signature holes near the green
    if (this.def.sig) {
      for (let i = 0; i < 2; i++) {
        const side = i ? 1 : -1;
        const s = this.L - 60;
        const [x, y] = this.offset(s, side * (this.fwHalf(s) + 16));
        this.decor.push({ kind: 'crowd', x, y, len: 60, dir: [this.gT[0], this.gT[1]] });
      }
    }
  }

  // ---------- pin ----------
  setPin(pinSeed, difficulty = 0.5) {
    const r = mulberry32(this.seed ^ Math.imul(pinSeed, 2654435761));
    let best = null, bestScore = 1e9;
    for (let i = 0; i < 40; i++) {
      const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * lerp(0.35, 0.72, difficulty);
      const l = Math.cos(a) * rr * this.grx, p = Math.sin(a) * rr * this.gry;
      // local rotated -> world
      const lr = l * this.gcos + p * this.gsin, pr = -l * this.gsin + p * this.gcos;
      const x = this.G[0] + this.gN[0] * lr + this.gT[0] * pr;
      const y = this.G[1] + this.gN[1] * lr + this.gT[1] * pr;
      if (this.surfAt(x, y) !== S.GREEN || this.greenSdf(x, y) > -3) continue;
      let ok = true;
      for (const sh of this.shapes) if (sh.inGreen && sh.sdf(x, y) < 3) ok = false;
      if (!ok) continue;
      const g = this.gradAt(x, y);
      const slope = Math.hypot(g[0], g[1]);
      const score = Math.max(0, slope - 0.025) * 100 + r() * 0.5;
      if (score < bestScore) { bestScore = score; best = [x, y]; }
    }
    this.pin = best || [this.G[0], this.G[1]];
    this.pinH = this.heightAt(this.pin[0], this.pin[1]);
  }

  distToPin(x, y) { return Math.hypot(this.pin[0] - x, this.pin[1] - y); }
}

const EMPTY = [];

function norm2(x, y) { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; }

function makeTree(type, x, y, r, scale = 1) {
  // trunk height th, total height ht, canopy radius cr, canopy bottom cb
  let ht, cr, cb, tr = 0.35;
  switch (type) {
    case 'pine': ht = 22 + r() * 10; cr = 3.5 + r() * 1.5; cb = ht * 0.55; tr = 0.4; break;
    case 'longleaf': ht = 20 + r() * 8; cr = 3.2 + r() * 1.3; cb = ht * 0.68; tr = 0.32; break;
    case 'oak': ht = 12 + r() * 6; cr = 6 + r() * 3; cb = 4 + r() * 1.5; tr = 0.55; break;
    case 'maple': ht = 13 + r() * 5; cr = 5 + r() * 2; cb = 4; tr = 0.45; break;
    case 'cypress': ht = 9 + r() * 4; cr = 6 + r() * 3; cb = 4.5; tr = 0.6; break;
    case 'palm': ht = 11 + r() * 6; cr = 3.2 + r() * 1; cb = ht - 3; tr = 0.3; break;
    case 'eucalyptus': ht = 18 + r() * 8; cr = 5 + r() * 2; cb = 7; tr = 0.5; break;
    case 'sycamore': ht = 14 + r() * 5; cr = 6 + r() * 2; cb = 5; tr = 0.5; break;
    case 'torreypine': ht = 9 + r() * 4; cr = 5 + r() * 2; cb = 4; tr = 0.4; break;
    default: ht = 14; cr = 5; cb = 5;
  }
  ht *= scale; cr *= scale; cb *= scale;
  return { type, x, y, ht, cr, cb, tr, rot: r() * Math.PI * 2, seed: r() };
}
