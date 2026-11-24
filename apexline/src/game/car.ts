import * as THREE from 'three';
import type { CarSetup } from './types';
import { VEHICLE_MAP, Shape } from '../data/vehicles';
import { COSMETIC_MAP } from '../data/cosmetics';
import { renderLivery } from './livery';

/** Car local frame: +X right, +Y up, -Z forward. Origin = ground contact centre, so y=0 is the road surface. */

const tmpC = new THREE.Color();
const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

interface Station { z: number; yb: number; yt: number; hwb: number; hw: number; hwt: number }

/** Loft a closed ring cross-section between stations. Returns an indexed geometry with u = along (front->rear), v = around. */
function loft(st: Station[], ringFn: (s: Station) => [number, number][]): THREE.BufferGeometry {
  const rings = st.map(ringFn);
  const m = rings[0].length;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i < st.length; i++) for (let j = 0; j < m; j++) {
    pos.push(rings[i][j][0], rings[i][j][1], st[i].z);
    uv.push(i / (st.length - 1), j / (m - 1));
  }
  for (let i = 0; i < st.length - 1; i++) for (let j = 0; j < m - 1; j++) {
    const a = i * m + j, b = a + 1, c = a + m, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  // wrap bottom: ring is open between first and last point on the underside (hidden)
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  // end caps
  const capPos: number[] = [], capIdx: number[] = [];
  const addCap = (ring: [number, number][], z: number, flip: boolean) => {
    const base = capPos.length / 3;
    let cx = 0, cy = 0; for (const p of ring) { cx += p[0]; cy += p[1]; } cx /= ring.length; cy /= ring.length;
    capPos.push(cx, cy, z); for (const p of ring) capPos.push(p[0], p[1], z);
    for (let j = 0; j < ring.length - 1; j++) flip ? capIdx.push(base, base + 2 + j, base + 1 + j) : capIdx.push(base, base + 1 + j, base + 2 + j);
    flip ? capIdx.push(base, base + 1, base + ring.length) : capIdx.push(base, base + ring.length, base + 1);
  };
  addCap(rings[0], st[0].z, false); addCap(rings[rings.length - 1], st[st.length - 1].z, true);
  const cg = new THREE.BufferGeometry();
  cg.setAttribute('position', new THREE.Float32BufferAttribute(capPos, 3));
  cg.setIndex(capIdx);
  cg.setAttribute('uv', new THREE.Float32BufferAttribute(new Array(capPos.length / 3 * 2).fill(0.5), 2));
  const merged = mergeGeos([g, cg]);
  merged.computeVertexNormals();
  return merged;
}
function mergeGeos(gs: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  let off = 0;
  for (const g of gs) {
    const p = g.getAttribute('position'), u = g.getAttribute('uv');
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); uv.push(u ? u.getX(i) : 0, u ? u.getY(i) : 0); }
    const ix = g.getIndex()!;
    for (let i = 0; i < ix.count; i++) idx.push(ix.getX(i) + off);
    off += p.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  out.setIndex(idx);
  return out;
}

function topProfile(s: Shape, t: number): number {
  const pts: [number, number][] = [[0, s.nose], [s.cowl * 0.5, (s.nose + s.hood) / 2 + 0.01], [s.cowl, s.hood], [s.roofS, 1], [s.roofE, 1], [s.roofE + (1 - s.roofE) * 0.55, s.deck], [0.97, s.deck * 0.98], [1, s.tail]];
  for (let i = 0; i < pts.length - 1; i++) {
    if (t <= pts[i + 1][0]) { const [t0, h0] = pts[i], [t1, h1] = pts[i + 1]; const k = t1 === t0 ? 0 : (t - t0) / (t1 - t0); return h0 + (h1 - h0) * k; }
  }
  return pts[pts.length - 1][1];
}

const body8 = (s: Station): [number, number][] => {
  const ym = s.yb + (s.yt - s.yb) * 0.42;
  return [[-s.hwb, s.yb], [-s.hw, s.yb + (ym - s.yb) * 0.55], [-s.hw, ym], [-s.hwt, s.yt], [s.hwt, s.yt], [s.hw, ym], [s.hw, s.yb + (ym - s.yb) * 0.55], [s.hwb, s.yb]];
};

export interface CarDynamics { speed: number; steer: number; slip: number; braking: number; airborne: boolean; boosting: boolean; time: number; throttle: number }

interface WheelRig { pivot: THREE.Group; spin: THREE.Group; front: boolean; side: number }

export class CarModel {
  group = new THREE.Group();
  inner = new THREE.Group(); // body lean/suspension applies here
  wheels: WheelRig[] = [];
  paintMat!: THREE.MeshPhysicalMaterial;
  brakeMats: THREE.MeshStandardMaterial[] = [];
  headMats: THREE.MeshStandardMaterial[] = [];
  glow?: THREE.Mesh;
  glowMat?: THREE.MeshBasicMaterial;
  glowColor = new THREE.Color(0, 0, 0);
  pattern = 'solid';
  lightColor = new THREE.Color('#fff');
  shape!: Shape;
  wheelR = 0.34;
  frontZ = 0; rearZ = 0;
  exhaustPos: THREE.Vector3[] = [];
  wheelPos: THREE.Vector3[] = [];
  disposables: { dispose(): void }[] = [];
  liveryCanvas = document.createElement('canvas');
  liveryTex?: THREE.CanvasTexture;
  hubOffset = 0.45;
  ghost = false;
  spoilerGroup?: THREE.Group;
  length = 4; width = 1.8; height = 1.3;

  constructor(public setup: CarSetup, opts: { ghost?: boolean } = {}) {
    this.ghost = !!opts.ghost;
    this.group.add(this.inner);
    this.build();
  }

  private mat<T extends THREE.Material>(m: T): T { this.disposables.push(m); return m; }

  private build() {
    const s = this.setup, v = VEHICLE_MAP[s.vehicle] ?? VEHICLE_MAP.pulse;
    const sh = v.shape; this.shape = sh;
    const wide = 1 + (COSMETIC_MAP[s.body.widebody]?.data.w ?? 0);
    const L = sh.L, W = sh.W * wide, H = sh.H;
    this.length = L; this.width = W; this.height = H;
    const clear = sh.clear;
    const g = this.inner;
    const ghostMat = (m: THREE.Material) => { if (this.ghost) { m.transparent = true; (m as any).opacity = 0.35; m.depthWrite = false; } return m; };

    // ---- paint material
    const fin = COSMETIC_MAP[s.paint.finish]?.data ?? { m: 0.15, r: 0.18, cc: 1 };
    renderLivery(this.liveryCanvas, s);
    this.liveryTex = new THREE.CanvasTexture(this.liveryCanvas);
    this.liveryTex.colorSpace = THREE.SRGBColorSpace; this.liveryTex.anisotropy = 8;
    const paint = this.mat(new THREE.MeshPhysicalMaterial({
      map: this.liveryTex, metalness: fin.m, roughness: fin.r, clearcoat: fin.cc ?? 0, clearcoatRoughness: 0.08,
      iridescence: fin.iri ? 1 : 0, iridescenceIOR: 1.6, iridescenceThicknessMinimum: 200, iridescenceThicknessMaximum: fin.shift ? 900 : 500, envMapIntensity: 1.2, sheen: fin.iri ? 0.6 : 0, sheenColor: new THREE.Color(s.paint.accent), side: THREE.DoubleSide,
    }));
    if (fin.carbon) { paint.color.set('#ffffff'); }
    ghostMat(paint);
    this.paintMat = paint;
    const secondary = ghostMat(this.mat(new THREE.MeshPhysicalMaterial({ color: s.paint.secondary, metalness: Math.min(0.6, fin.m), roughness: Math.max(0.2, fin.r), clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide })));
    const accent = ghostMat(this.mat(new THREE.MeshStandardMaterial({ color: s.paint.accent, metalness: 0.3, roughness: 0.4 })));
    const glass = ghostMat(this.mat(new THREE.MeshPhysicalMaterial({ color: '#0a0d12', metalness: 0.9, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.6, side: THREE.DoubleSide })));
    const dark = ghostMat(this.mat(new THREE.MeshStandardMaterial({ color: '#0c0e12', roughness: 0.7, metalness: 0.3 })));
    const carbonMat = ghostMat(this.mat(new THREE.MeshStandardMaterial({ color: '#1a1d22', roughness: 0.35, metalness: 0.5 })));
    const chrome = ghostMat(this.mat(new THREE.MeshStandardMaterial({ color: '#d7dbe2', roughness: 0.15, metalness: 1 })));

    // ---- stations
    const N = 28; const stations: Station[] = [];
    const wid = (t: number) => {
      const head = sstep(0, 0.22, t), tailK = sstep(0.78, 1, t);
      return (sh.noseW + (1 - sh.noseW) * head) * (1 - (1 - sh.tailW) * tailK);
    };
    const cabEnd = sh.roofE + (1 - sh.roofE) * 0.55;
    const belt = (t: number) => {
      if (t < sh.cowl) return topProfile(sh, t);
      if (t > cabEnd) return topProfile(sh, t);
      const k = (t - sh.cowl) / (cabEnd - sh.cowl);
      return sh.hood + (sh.deck - sh.hood) * k * 0.9;
    };
    for (let i = 0; i <= N; i++) {
      const t = i / N; const hw = (W / 2) * wid(t);
      const topH = Math.max(belt(t) * H, clear + 0.18);
      stations.push({ z: -L / 2 + t * L, yb: clear, yt: topH, hwb: hw * 0.86, hw, hwt: hw * 0.9 });
    }
    // smooth heights
    for (let pass = 0; pass < 2; pass++) for (let i = 1; i < N; i++) stations[i].yt = (stations[i - 1].yt + stations[i].yt * 2 + stations[i + 1].yt) / 4;
    const bodyGeo = loft(stations, body8); this.disposables.push(bodyGeo);
    const body = new THREE.Mesh(bodyGeo, paint); body.castShadow = true; g.add(body);

    // ---- greenhouse
    const cab: Station[] = [];
    const c0 = Math.round(sh.cowl * N), c1 = Math.round(cabEnd * N);
    for (let i = c0; i <= c1; i++) {
      const t = i / N; const hw = (W / 2) * wid(t);
      const bt = Math.max(belt(t) * H, clear + 0.18);
      const roof = Math.max(topProfile(sh, t) * H, bt + 0.001);
      cab.push({ z: -L / 2 + t * L, yb: bt - 0.02, yt: roof, hwb: hw * 0.92, hw: hw * 0.9, hwt: hw * sh.cabW * 0.74 });
    }
    if (cab.length > 3 && !sh.open) {
      const cg = loft(cab, s2 => [[-s2.hwb, s2.yb], [-s2.hw, s2.yb + (s2.yt - s2.yb) * 0.15], [-s2.hwt, s2.yt - 0.001], [s2.hwt, s2.yt - 0.001], [s2.hw, s2.yb + (s2.yt - s2.yb) * 0.15], [s2.hwb, s2.yb]]);
      this.disposables.push(cg);
      const cm = new THREE.Mesh(cg, glass); cm.castShadow = true; g.add(cm);
      // painted roof slab
      const roofSt = cab.filter(c => { const t = (c.z + L / 2) / L; return t >= sh.roofS - 0.02 && t <= sh.roofE + 0.02; });
      if (roofSt.length > 2) {
        const rg = loft(roofSt.map(c => ({ ...c, yb: c.yt - 0.045, yt: c.yt + 0.012, hwb: c.hwt * 0.96, hw: c.hwt * 1.0, hwt: c.hwt * 0.94 })), body8);
        this.disposables.push(rg); g.add(new THREE.Mesh(rg, secondary));
      }
    } else if (sh.open) {
      // open-top buggy: roll cage + seat
      const cage = new THREE.Mesh(new THREE.TorusGeometry(W * 0.34, 0.03, 6, 14, Math.PI), carbonMat);
      cage.rotation.set(0, Math.PI / 2, 0); cage.position.set(0, H * 0.58, -L * 0.05); g.add(cage); this.disposables.push(cage.geometry);
    }
    if (sh.canopy) {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), glass);
      cap.scale.set(W * 0.42, H * 0.34, L * 0.22); cap.position.set(0, H * sh.hood * 0.98, -L * 0.04); g.add(cap); this.disposables.push(cap.geometry);
    }

    // ---- wheels
    const rimId = s.wheel.design, rim = COSMETIC_MAP[rimId]?.data ?? { style: 'spoke', spokes: 5, concave: 0 };
    const rimColor = COSMETIC_MAP[s.wheel.color]?.data.color ?? '#C9CED6';
    const calColor = COSMETIC_MAP[s.wheel.caliper]?.data.color ?? '#1B1E24';
    const tire = COSMETIC_MAP[s.wheel.tire]?.data ?? { text: 'APEXLINE', color: '#F5F7FA', band: '' };
    const wr = sh.wr, ww = sh.ww * (1 + (wide - 1) * 0.8);
    this.wheelR = wr; this.hubOffset = wr;
    const tireTex = tireTexture(tire as any);
    this.disposables.push(tireTex);
    const tireMat = this.mat(new THREE.MeshStandardMaterial({ color: '#15171b', roughness: 0.85, metalness: 0 }));
    const sideMat = this.mat(new THREE.MeshStandardMaterial({ map: tireTex, roughness: 0.8, metalness: 0 }));
    const rimMat = ghostMat(this.mat(new THREE.MeshStandardMaterial({ color: rimColor, roughness: 0.25, metalness: 0.9 })));
    const calMat = ghostMat(this.mat(new THREE.MeshStandardMaterial({ color: calColor, roughness: 0.4, metalness: 0.2 })));
    ghostMat(tireMat); ghostMat(sideMat);
    const axles: [number, boolean][] = [[-L / 2 + sh.wbF * L, true], [-L / 2 + sh.wbR * L, false]];
    this.frontZ = axles[0][0]; this.rearZ = axles[1][0];
    const trackX = W / 2 - ww / 2 + 0.02;
    const flareR = COSMETIC_MAP[s.body.widebody]?.data.w ?? 0;
    for (const [z, front] of axles) for (const side of [-1, 1]) {
      const pivot = new THREE.Group(); pivot.position.set(side * trackX, wr, z);
      const spin = new THREE.Group(); pivot.add(spin);
      const tg = new THREE.CylinderGeometry(wr, wr, ww, 28, 1, true); tg.rotateZ(Math.PI / 2);
      const t = new THREE.Mesh(tg, tireMat); t.castShadow = true; spin.add(t);
      const cap = new THREE.CircleGeometry(wr, 28);
      const cl = new THREE.Mesh(cap, sideMat); cl.position.x = side * ww / 2; cl.rotation.y = side * Math.PI / 2; spin.add(cl);
      const cl2 = new THREE.Mesh(cap, tireMat); cl2.position.x = -side * ww / 2; cl2.rotation.y = -side * Math.PI / 2; spin.add(cl2);
      // rim
      const rimG = rimGeometry(rim as any, wr * 0.72, ww * 0.5); this.disposables.push(rimG);
      const rm = new THREE.Mesh(rimG, rimMat); rm.position.x = side * (ww / 2 - 0.02); rm.scale.x = side; spin.add(rm);
      pivot.add(arch(wr, ww, side, flareR > 0 ? paint : dark, flareR));
      // caliper (does not spin)
      const cal = new THREE.Mesh(new THREE.BoxGeometry(0.05, wr * 0.5, wr * 0.35), calMat); cal.position.set(side * (ww / 2 - 0.09), wr * 0.2, front ? wr * 0.45 : -wr * 0.45); pivot.add(cal);
      this.disposables.push(tg, cap, cal.geometry);
      g.add(pivot); this.wheels.push({ pivot, spin, front, side });
      this.wheelPos.push(new THREE.Vector3(side * trackX, 0, z));
    }

    // ---- lights
    const headC = COSMETIC_MAP[s.lights.head]?.data.color ?? '#F5F7FF';
    const tailD = COSMETIC_MAP[s.lights.tail]?.data ?? { style: 'bar', color: '#FF1F1F' };
    this.lightColor.set(headC);
    const headMat = this.mat(new THREE.MeshStandardMaterial({ color: '#111', emissive: headC, emissiveIntensity: 2.2, roughness: 0.2 })); ghostMat(headMat);
    const tailMat = this.mat(new THREE.MeshStandardMaterial({ color: '#200', emissive: tailD.color, emissiveIntensity: 1.2, roughness: 0.3 })); ghostMat(tailMat);
    this.brakeMats.push(tailMat); this.headMats.push(headMat);
    const noseY = Math.max(sh.nose * H, clear + 0.25) * 0.8 + clear * 0.2;
    const fz = -L / 2 - 0.005;
    const hw0 = (W / 2) * sh.noseW;
    this.addLights(g, sh.head, headMat, hw0, noseY, fz, true, accent);
    const tailY = Math.max(sh.tail * H, clear + 0.3) * 0.8;
    this.addLights(g, sh.tailL as any, tailMat, (W / 2) * sh.tailW, tailY + 0.02, L / 2 + 0.005, false, accent, tailD.style);
    // grille / intake
    const fb = COSMETIC_MAP[s.body.fbumper]?.data ?? { ext: 0, vents: 0 };
    const rb = COSMETIC_MAP[s.body.rbumper]?.data ?? { ext: 0, vents: 0 };
    const grille = new THREE.Mesh(new THREE.BoxGeometry(hw0 * 1.1, 0.1 + 0.02 * fb.vents, 0.05), dark); grille.position.set(0, clear + 0.12 + (noseY - clear) * 0.18, fz - 0.01 - fb.ext * 0.3); g.add(grille);
    for (let k = 0; k < fb.vents; k++) { const v = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.05), dark); v.position.set((k - (fb.vents - 1) / 2) * (hw0 * 1.5 / Math.max(1, fb.vents)), clear + 0.07, fz - 0.02 - fb.ext * 0.4); g.add(v); this.disposables.push(v.geometry); }
    if (fb.ext > 0) { const bm = new THREE.Mesh(new THREE.BoxGeometry(W * sh.noseW * 0.98, 0.1, fb.ext + 0.12), s.body.fbumper.includes('carbon') ? carbonMat : paint); bm.position.set(0, clear + 0.04, fz - fb.ext / 2); g.add(bm); this.disposables.push(bm.geometry); }
    if (rb.ext > 0) { const bm = new THREE.Mesh(new THREE.BoxGeometry(W * sh.tailW * 0.98, 0.14, rb.ext + 0.12), s.body.rbumper.includes('carbon') ? carbonMat : paint); bm.position.set(0, clear + 0.08, L / 2 + rb.ext / 2); g.add(bm); this.disposables.push(bm.geometry); }
    for (let k = 0; k < rb.vents; k++) { const v = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.04), dark); v.position.set((k - (rb.vents - 1) / 2) * 0.28, clear + 0.18, L / 2 + rb.ext + 0.07); g.add(v); this.disposables.push(v.geometry); }
    // mirrors
    for (const side of [-1, 1]) { const mm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.1), secondary); mm.position.set(side * (W / 2 * 0.98), H * sh.hood + 0.08, -L / 2 + sh.cowl * L + 0.1); g.add(mm); this.disposables.push(mm.geometry); }

    // ---- body kit parts
    const B = s.body;
    const sp = COSMETIC_MAP[B.spoiler]?.data ?? { kind: 'none' };
    this.addSpoiler(g, sp, L, W, H, sh, accent, carbonMat, paint, secondary);
    const sl = COSMETIC_MAP[B.splitter]?.data ?? { h: 0 };
    if (sl.h > 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(W * sh.noseW * 1.02 + sl.d * 0.2, 0.025, sl.d + 0.18), carbonMat); m.position.set(0, clear * 0.7 + 0.02, fz - sl.d / 2 + 0.05 - fb.ext); g.add(m); this.disposables.push(m.geometry); }
    const sk = COSMETIC_MAP[B.skirt]?.data ?? { h: 0 };
    if (sk.h > 0) for (const side of [-1, 1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.05 + sk.d, sk.h, (this.rearZ - this.frontZ) * 0.9 - wr), s.body.skirt.includes('carbon') ? carbonMat : paint); m.position.set(side * (W / 2 * 0.98 + sk.d * 0.3), clear + 0.04, (this.frontZ + this.rearZ) / 2); g.add(m); this.disposables.push(m.geometry); }
    const df = COSMETIC_MAP[B.diffuser]?.data ?? { h: 0, fins: 0 };
    if (df.h > 0) {
      const base = new THREE.Mesh(new THREE.BoxGeometry(W * 0.62, df.h * 0.5, 0.35), carbonMat); base.position.set(0, clear * 0.8 + df.h * 0.3, L / 2 + 0.1 + rb.ext); base.rotation.x = -0.35; g.add(base); this.disposables.push(base.geometry);
      for (let k = 0; k < df.fins; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.02, df.h, 0.32), dark); f.position.set((k - (df.fins - 1) / 2) * (W * 0.55 / Math.max(1, df.fins - 1)), clear * 0.8 + df.h * 0.3, L / 2 + 0.12 + rb.ext); f.rotation.x = -0.35; g.add(f); this.disposables.push(f.geometry); }
    }
    this.addHood(g, COSMETIC_MAP[B.hood]?.data.kind ?? 'flat', L, W, H, sh, carbonMat, dark, paint);
    this.addScoop(g, COSMETIC_MAP[B.scoop]?.data.kind ?? 'none', L, W, H, sh, dark, paint, sh.scoop, sh.snorkel);
    const ex = COSMETIC_MAP[B.exhaust]?.data ?? { shape: 'round', count: 1 };
    for (let k = 0; k < ex.count; k++) {
      const side = ex.center ? 0 : ex.count === 1 ? 1 : (k % 2 === 0 ? -1 : 1);
      const row = ex.count > 2 ? (k < 2 ? 0 : 1) : 0;
      const x = ex.center ? 0 : side * (W * 0.26 + row * 0.12 + (ex.count > 2 ? -0.04 : 0));
      const geo = ex.shape === 'square' ? new THREE.BoxGeometry(0.16, 0.1, 0.14) : ex.shape === 'hex' ? new THREE.CylinderGeometry(0.08, 0.08, 0.14, 6) : ex.shape === 'cannon' ? new THREE.CylinderGeometry(0.1, 0.07, 0.3, 14) : new THREE.CylinderGeometry(0.065, 0.065, 0.14, 16);
      if (ex.shape !== 'square') geo.rotateX(Math.PI / 2);
      const m = new THREE.Mesh(geo, chrome); m.position.set(x, clear + 0.12 + row * 0.0, L / 2 + 0.05 + rb.ext); g.add(m); this.disposables.push(geo);
      this.exhaustPos.push(new THREE.Vector3(x, clear + 0.12, L / 2 + 0.2 + rb.ext));
    }
    if (this.exhaustPos.length === 0) this.exhaustPos.push(new THREE.Vector3(-0.4, clear + 0.12, L / 2 + 0.2));
    // plates
    const plate = COSMETIC_MAP[s.plate.style]?.data ?? { bg: '#F5F7FA', fg: '#101216' };
    const ptex = plateTexture(s.plate.text, plate.bg, plate.fg); this.disposables.push(ptex);
    const pm = this.mat(new THREE.MeshStandardMaterial({ map: ptex, roughness: 0.5 }));
    const rp = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.12), pm); rp.position.set(0, clear + 0.26 + 0.1 * (rb.ext > 0 ? 0 : 0), L / 2 + 0.012 + rb.ext * 0.0); rp.position.y = Math.max(sh.tail * H * 0.55, clear + 0.28); g.add(rp);
    this.disposables.push(rp.geometry);

    // ---- underglow
    const ug = COSMETIC_MAP[s.lights.underglow]?.data.color ?? '';
    this.pattern = COSMETIC_MAP[s.lights.pattern]?.data.mode ?? 'solid';
    if (ug) {
      this.glowColor.set(ug);
      this.glowMat = this.mat(new THREE.MeshBasicMaterial({ map: glowTexture(), color: ug, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 }));
      const gm = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.9, L * 1.35), this.glowMat); gm.rotation.x = -Math.PI / 2; gm.position.y = 0.04; gm.renderOrder = 3;
      this.group.add(gm); this.glow = gm; this.disposables.push(gm.geometry);
    }
    g.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = !this.ghost; } });
  }

  private addLights(g: THREE.Group, style: string, mat: THREE.Material, hw: number, y: number, z: number, front: boolean, accent: THREE.Material, tailStyle?: string) {
    const dirZ = front ? -1 : 1;
    const add = (geo: THREE.BufferGeometry, x: number, yy: number, rot = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, yy, z + dirZ * 0.01); m.rotation.z = rot; g.add(m); this.disposables.push(geo); return m; };
    const ts = tailStyle;
    if (!front && ts) {
      if (ts === 'strip' || ts === 'bar') { add(new THREE.BoxGeometry(hw * 1.7, ts === 'strip' ? 0.04 : 0.08, 0.03), 0, y); return; }
      if (ts === 'rings') { for (const s of [-1, 1]) { add(new THREE.TorusGeometry(0.09, 0.02, 6, 16), s * hw * 0.6, y); add(new THREE.TorusGeometry(0.04, 0.015, 6, 12), s * hw * 0.6, y); } return; }
      if (ts === 'seg') { for (let k = 0; k < 6; k++) for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.09, 0.06, 0.03), s * (hw * 0.25 + k * 0.1), y); return; }
    }
    const geoCircle = (r: number) => { const c = new THREE.CircleGeometry(r, 16); if (front) c.rotateY(Math.PI); return c; };
    switch (style) {
      case 'twin': for (const s of [-1, 1]) { add(geoCircle(0.1), s * hw * 0.68, y); add(geoCircle(0.05), s * hw * 0.5, y); } break;
      case 'round': for (const s of [-1, 1]) add(geoCircle(0.15), s * hw * 0.66, y); break;
      case 'quad': for (const s of [-1, 1]) for (const k of [0, 1]) add(geoCircle(0.065), s * (hw * 0.45 + k * 0.17), y); break;
      case 'bar': add(new THREE.BoxGeometry(hw * 1.7, 0.05, 0.03), 0, y + 0.02); break;
      case 'slit': for (const s of [-1, 1]) add(new THREE.BoxGeometry(hw * 0.7, 0.04, 0.03), s * hw * 0.58, y + 0.02, s * -0.12); break;
      case 'hex': for (const s of [-1, 1]) add(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 6).rotateX(Math.PI / 2), s * hw * 0.64, y); break;
      case 'strip': add(new THREE.BoxGeometry(hw * 1.7, 0.04, 0.03), 0, y); break;
      default: for (const s of [-1, 1]) add(geoCircle(0.1), s * hw * 0.65, y);
    }
  }

  private addSpoiler(g: THREE.Group, sp: any, L: number, W: number, H: number, sh: Shape, accent: THREE.Material, carbon: THREE.Material, paint: THREE.Material, secondary: THREE.Material) {
    if (!sp.kind || sp.kind === 'none') return;
    const grp = new THREE.Group(); this.spoilerGroup = grp;
    const zr = L / 2 - 0.12, yd = Math.max(sh.deck * H, sh.clear + 0.4);
    const span = W * 0.9 * (sp.span ?? 1);
    const mat = sp.kind === 'lip' || sp.kind === 'duck' ? paint : carbon;
    const plane = (w: number, chord: number, y: number, tilt: number, z = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.035, chord), mat); m.position.set(0, y, z); m.rotation.x = tilt; grp.add(m); this.disposables.push(m.geometry); return m;
    };
    if (sp.kind === 'lip') plane(span * 0.8, 0.12, yd + 0.03, -0.12, zr + 0.05);
    else if (sp.kind === 'duck') plane(span * 0.85, 0.2, yd + 0.07, -0.25, zr + 0.06);
    else {
      const hgt = sp.h ?? 0.4, ch = sp.chord ?? 0.3;
      const planes = sp.kind === 'dual' ? 2 : sp.kind === 'ladder' ? 3 : 1;
      for (let k = 0; k < planes; k++) plane(span, ch * (k === 0 ? 1 : 0.8), yd + hgt - k * (0.12 + hgt * 0.06), 0.08 - k * 0.05, zr);
      for (const s of [-1, 1]) {
        const ep = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.1 + hgt * 0.35 + planes * 0.05, ch * 1.12), accent); ep.position.set(s * span / 2, yd + hgt - 0.02, zr); grp.add(ep); this.disposables.push(ep.geometry);
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.05, hgt + 0.05, 0.08), carbon); st.position.set(s * span * 0.28, yd + hgt / 2, zr + 0.02); grp.add(st); this.disposables.push(st.geometry);
      }
    }
    g.add(grp);
  }

  private addHood(g: THREE.Group, kind: string, L: number, W: number, H: number, sh: Shape, carbon: THREE.Material, dark: THREE.Material, paint: THREE.Material) {
    const z0 = -L / 2 + sh.cowl * L * 0.55; const y = sh.hood * H * 0.99 + 0.005; const hwn = W / 2 * 0.75;
    const box = (w: number, h: number, d: number, x: number, yy: number, zz: number, m: THREE.Material, rx = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, yy, zz); b.rotation.x = rx; g.add(b); this.disposables.push(b.geometry); };
    switch (kind) {
      case 'bulge': box(W * 0.28, 0.05, L * 0.2, 0, y + 0.02, z0, paint, -0.04); break;
      case 'vent': for (const s of [-1, 1]) box(0.22, 0.03, L * 0.16, s * hwn * 0.45, y + 0.015, z0, dark); break;
      case 'carbon': box(W * 0.62, 0.012, L * 0.26, 0, y + 0.01, z0, carbon); break;
      case 'dome': { const d = new THREE.Mesh(new THREE.SphereGeometry(0.5, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), paint); d.scale.set(W * 0.34, 0.12, L * 0.18); d.position.set(0, y, z0); g.add(d); this.disposables.push(d.geometry); break; }
      case 'louver': for (let k = 0; k < 6; k++) box(W * 0.3, 0.02, 0.03, 0, y + 0.012, z0 - 0.2 + k * 0.1, dark); break;
      case 'scoop': box(W * 0.24, 0.1, 0.35, 0, y + 0.05, z0 - 0.05, paint, 0.2); box(W * 0.2, 0.06, 0.04, 0, y + 0.06, z0 - 0.23, dark, 0.2); break;
      case 'race': box(W * 0.6, 0.012, L * 0.26, 0, y + 0.01, z0, carbon); for (const s of [-1, 1]) box(0.2, 0.03, L * 0.12, s * hwn * 0.5, y + 0.02, z0 - 0.1, dark); break;
    }
  }

  private addScoop(g: THREE.Group, kind: string, L: number, W: number, H: number, sh: Shape, dark: THREE.Material, paint: THREE.Material, vehScoop?: boolean, snorkel?: boolean) {
    const zc = -L / 2 + (sh.roofS + sh.roofE) / 2 * L; const y = H;
    const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, yy: number, zz: number, rx = 0) => { const b = new THREE.Mesh(geo, m); b.position.set(x, yy, zz); b.rotation.x = rx; g.add(b); this.disposables.push(geo); };
    const k = kind !== 'none' ? kind : vehScoop ? 'low' : snorkel ? 'snork' : 'none';
    switch (k) {
      case 'low': add(new THREE.BoxGeometry(0.28, 0.1, 0.38), paint, 0, y + 0.05, zc, -0.18); add(new THREE.BoxGeometry(0.22, 0.06, 0.03), dark, 0, y + 0.07, zc - 0.2, -0.18); break;
      case 'rally': add(new THREE.BoxGeometry(0.34, 0.16, 0.42), paint, 0, y + 0.08, zc - 0.1, -0.22); add(new THREE.BoxGeometry(0.26, 0.1, 0.03), dark, 0, y + 0.1, zc - 0.31, -0.22); break;
      case 'twin': for (const s of [-1, 1]) add(new THREE.CylinderGeometry(0.06, 0.09, 0.3, 12), paint, s * 0.2, y + 0.14, zc - 0.05, -0.2); break;
      case 'box': add(new THREE.BoxGeometry(0.36, 0.2, 0.5), paint, 0, y + 0.1, zc); add(new THREE.BoxGeometry(0.3, 0.14, 0.03), dark, 0, y + 0.1, zc - 0.26); break;
      case 'tall': add(new THREE.BoxGeometry(0.22, 0.34, 0.3), paint, 0, y + 0.17, zc); add(new THREE.BoxGeometry(0.17, 0.2, 0.03), dark, 0, y + 0.2, zc - 0.16); break;
      case 'snork': add(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 10), dark, W * 0.45, H * 0.65, -L / 2 + sh.cowl * L + 0.05); break;
    }
  }

  /** Update visuals each frame. `lean` is body roll/pitch from simulated weight transfer. */
  update(dt: number, d: CarDynamics, lean: { roll: number; pitch: number; heave: number }) {
    const spinRate = d.speed / this.wheelR;
    for (const w of this.wheels) {
      w.spin.rotation.x -= spinRate * dt * (d.airborne ? 0.9 : 1);
      if (w.front) w.pivot.rotation.y = d.steer * 1.0;
      // suspension droop in air
      w.pivot.position.y = this.wheelR + (d.airborne ? -0.06 : 0) + lean.heave * 0.0;
    }
    this.inner.rotation.z += (lean.roll - this.inner.rotation.z) * Math.min(1, dt * 12);
    this.inner.rotation.x += (lean.pitch - this.inner.rotation.x) * Math.min(1, dt * 12);
    this.inner.position.y += (lean.heave - this.inner.position.y) * Math.min(1, dt * 14);
    const k = Math.min(1, d.braking);
    for (const m of this.brakeMats) m.emissiveIntensity = 0.9 + 3.2 * k;
    if (this.glowMat) {
      let a = 0.85; const t = d.time;
      switch (this.pattern) {
        case 'pulse': a = 0.55 + 0.45 * Math.sin(t * 5); break;
        case 'breathe': a = 0.5 + 0.5 * Math.sin(t * 1.6); break;
        case 'strobe': a = Math.sin(t * 22) > 0 ? 1 : 0.1; break;
        case 'flicker': a = 0.6 + 0.4 * Math.sin(t * 37) * Math.sin(t * 13); break;
        case 'speed': a = 0.35 + Math.min(0.65, d.speed / 70); break;
        case 'chase': a = 0.55 + 0.45 * Math.sin(t * 8); break;
        case 'rainbow': tmpC.setHSL((t * 0.25) % 1, 1, 0.55); this.glowMat.color.copy(tmpC); break;
      }
      if (this.pattern !== 'rainbow') this.glowMat.color.copy(this.glowColor);
      this.glowMat.opacity = Math.max(0, Math.min(1, a));
    }
  }

  dispose() { for (const d of this.disposables) d.dispose(); this.liveryTex?.dispose(); }
}

function arch(wr: number, ww: number, side: number, mat: THREE.Material, flare: number): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(wr * (1.1 + flare * 0.5), wr * (1.1 + flare * 0.5), ww * 1.1, 20, 1, true, -Math.PI / 2 - 0.15, Math.PI + 0.3);
  geo.rotateZ(Math.PI / 2);
  const m = new THREE.Mesh(geo, mat); (mat as any).side = THREE.DoubleSide;
  m.position.set(-side * 0.0, 0, 0);
  return m;
}

function rimGeometry(rim: { style: string; spokes: number; concave: number }, r: number, depth: number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const lip = new THREE.TorusGeometry(r, 0.02, 6, 24); lip.rotateY(Math.PI / 2); parts.push(lip);
  const hub = new THREE.CylinderGeometry(r * 0.2, r * 0.2, 0.04, 12); hub.rotateZ(Math.PI / 2); hub.translate(-0.01 - rim.concave * 0.03, 0, 0); parts.push(hub);
  const n = Math.max(3, rim.spokes || 5);
  switch (rim.style) {
    case 'disc': { const d = new THREE.CircleGeometry(r, 24); d.rotateY(Math.PI / 2); d.translate(-rim.concave * 0.04, 0, 0); parts.push(d); break; }
    case 'mesh': { for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(0.012, r * 0.9, 0.012); b.translate(0, r * 0.45, 0); b.rotateX((i / n) * Math.PI * 2); parts.push(b); }
      const ring = new THREE.TorusGeometry(r * 0.55, 0.01, 4, 24); ring.rotateY(Math.PI / 2); parts.push(ring); break; }
    case 'turbine': { for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(0.018, r * 0.85, r * 0.2); b.translate(0, r * 0.47, 0); b.rotateX((i / n) * Math.PI * 2); b.rotateY(0.0); parts.push(b.applyMatrix4(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), 0.0))); } break; }
    case 'ring': { const t = new THREE.TorusGeometry(r * 0.55, 0.03, 6, 24); t.rotateY(Math.PI / 2); parts.push(t); for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(0.02, r * 0.55, 0.025); b.translate(0, r * 0.3, 0); b.rotateX((i / n) * Math.PI * 2); parts.push(b); } break; }
    case 'split': { for (let i = 0; i < n; i++) for (const o of [-0.09, 0.09]) { const b = new THREE.BoxGeometry(0.02, r * 0.8, 0.03); b.translate(0, r * 0.45, o * r); b.rotateX((i / n) * Math.PI * 2); parts.push(b); } break; }
    default: { for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(0.025, r * 0.88, 0.04 + 0.1 / n); b.translate(0, r * 0.46, 0); b.rotateX((i / n) * Math.PI * 2); b.translate(-rim.concave * 0.03, 0, 0); parts.push(b); } }
  }
  // merge
  const pos: number[] = []; const idx: number[] = []; let off = 0;
  for (const p of parts) {
    const pp = p.getAttribute('position'); for (let i = 0; i < pp.count; i++) pos.push(pp.getX(i), pp.getY(i), pp.getZ(i));
    const ix = p.getIndex(); if (ix) for (let i = 0; i < ix.count; i++) idx.push(ix.getX(i) + off); else for (let i = 0; i < pp.count; i++) idx.push(i + off);
    off += pp.count; p.dispose();
  }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setIndex(idx); out.computeVertexNormals();
  return out;
}

function tireTexture(t: { text: string; color: string; band: string }): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
  x.fillStyle = '#15171b'; x.fillRect(0, 0, 128, 128);
  if (t.band) { x.strokeStyle = t.color; x.lineWidth = 7; x.beginPath(); x.arc(64, 64, 52, 0, Math.PI * 2); x.stroke(); }
  if (t.text) {
    x.fillStyle = t.color; x.font = '700 14px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    const n = t.text.length; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 - 0.55 + (i / Math.max(1, n - 1)) * 1.1 - 0.0; x.save(); x.translate(64 + Math.cos(a) * 52, 64 + Math.sin(a) * 52); x.rotate(a + Math.PI / 2); x.fillText(t.text[i], 0, 0); x.restore(); }
  }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}

function plateTexture(text: string, bg: string, fg: string): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d')!;
  x.fillStyle = bg; x.fillRect(0, 0, 256, 64); x.strokeStyle = fg; x.lineWidth = 3; x.strokeRect(3, 3, 250, 58);
  x.fillStyle = fg; x.font = '800 40px "Barlow Condensed", Impact, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText((text || 'APEXLINE').slice(0, 9).toUpperCase(), 128, 34);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

let _glow: THREE.CanvasTexture | null = null;
function glowTexture(): THREE.CanvasTexture {
  if (_glow) return _glow;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.55, 'rgba(255,255,255,0.25)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  _glow = new THREE.CanvasTexture(c); return _glow;
}
