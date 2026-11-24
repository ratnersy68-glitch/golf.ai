import * as THREE from 'three';
import { Track, DS, F_GAP, F_BOOST, F_NOWALL, F_TUNNEL, F_BRIDGE, SURF_ASPHALT, SURF_DIRT, SURF_GRASS, SURF_ICE, SURF_SAND, SURF_STEEL } from '../sim/track';
import { Rng, hashStr } from '../sim/dmath';
import { ENV_STYLES } from './gfx';
import { CHAPTERS_INFO } from '../data/chapters';

class Buf {
  pos: number[] = []; nor: number[] = []; uv: number[] = []; col: number[] = [];
  tri(a: number[], b: number[], c: number[], uva: number[], uvb: number[], uvc: number[], col?: THREE.Color) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    this.pos.push(...a, ...b, ...c); this.nor.push(nx, ny, nz, nx, ny, nz, nx, ny, nz); this.uv.push(...uva, ...uvb, ...uvc);
    if (col) this.col.push(col.r, col.g, col.b, col.r, col.g, col.b, col.r, col.g, col.b);
  }
  quad(a: number[], b: number[], c: number[], d: number[], uv: [number[], number[], number[], number[]] = [[0, 0], [1, 0], [1, 1], [0, 1]], col?: THREE.Color) {
    this.tri(a, b, c, uv[0], uv[1], uv[2], col); this.tri(a, c, d, uv[0], uv[2], uv[3], col);
  }
  get count() { return this.pos.length / 3; }
  geometry(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (this.col.length) g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.computeBoundingSphere(); return g;
  }
}

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat = true): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}
function noiseFill(c: CanvasRenderingContext2D, w: number, h: number, base: string, amt: number, seed: number) {
  c.fillStyle = base; c.fillRect(0, 0, w, h);
  const r = new Rng(seed);
  for (let i = 0; i < w * h / 6; i++) { const v = r.next(); c.fillStyle = `rgba(${v > 0.5 ? 255 : 0},${v > 0.5 ? 255 : 0},${v > 0.5 ? 255 : 0},${amt * Math.abs(v - 0.5)})`; c.fillRect(r.next() * w, r.next() * h, 1.5, 1.5); }
}

export class World {
  group = new THREE.Group();
  terrainH: (x: number, z: number) => number = () => 0;
  groundLevel = 0;
  gates: { mesh: THREE.Group; mat: THREE.MeshBasicMaterial; idx: number }[] = [];
  boostTex?: THREE.CanvasTexture;
  obstacles: THREE.Mesh[] = [];
  water?: THREE.Mesh;
  clouds?: THREE.Group;
  disposables: { dispose(): void }[] = [];
  hasTerrain = true;
  constructor(public track: Track, public env: string, public quality: { particles: number; distance: number }) {}

  setCheckpointsPassed(n: number) {
    this.gates.forEach((g, i) => { const on = i < n; g.mat.color.set(on ? '#2dff7a' : '#C6FF00'); g.mat.opacity = on ? 0.06 : 0.22; });
  }
  update(time: number) {
    if (this.boostTex) this.boostTex.offset.y = -((time * 1.6) % 1);
    if (this.water) (this.water.material as THREE.MeshStandardMaterial).normalScale?.set(1, 1);
    const tr = this.track;
    for (let k = 0; k < this.obstacles.length; k++) {
      const o = tr.obstacles[k];
      const ph = 6.283185307179586 * time / o.per + o.ph;
      const d = o.d0 + o.amp * Math.sin(ph);
      const fi = o.s / DS; const i = Math.min(tr.n - 2, Math.floor(fi));
      this.obstacles[k].position.set(tr.px[i] + tr.rx[i] * d + tr.ux[i] * 0.7, tr.py[i] + tr.ry[i] * d + tr.uy[i] * 0.7, tr.pz[i] + tr.rz[i] * d + tr.uz[i] * 0.7);
    }
  }
  dispose() { this.group.traverse(o => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); }); for (const d of this.disposables) d.dispose(); }
}

const SURF_COL: Record<number, { color: string; rough: number; metal: number }> = {
  [SURF_ASPHALT]: { color: '#3a3f47', rough: 0.88, metal: 0 }, [SURF_DIRT]: { color: '#8a6440', rough: 1, metal: 0 }, [SURF_GRASS]: { color: '#4f8a3c', rough: 1, metal: 0 },
  [SURF_ICE]: { color: '#a9d8f0', rough: 0.06, metal: 0.1 }, [SURF_SAND]: { color: '#dcbf82', rough: 1, metal: 0 }, [SURF_STEEL]: { color: '#8c95a1', rough: 0.45, metal: 0.65 },
};

export function buildWorld(tr: Track, env: string, quality: { particles: number; distance: number }): World {
  const W = new World(tr, env, quality);
  const style = ENV_STYLES[env] ?? ENV_STYLES.academy;
  const accent = CHAPTERS_INFO.find(c => c.env === env)?.accent ?? '#C6FF00';
  const n = tr.n;
  const rng = new Rng(hashStr('world' + tr.def.id + env));

  // ---------------------------------------------------------------- road, kerbs, markings, walls
  const roadBufs: Record<number, Buf> = {}; const under = new Buf(); const kerb = new Buf(); const mark = new Buf(); const wall = new Buf(); const boost = new Buf(); const tunnel = new Buf(); const lights = new Buf();
  const pt = (i: number, d: number, h = 0): number[] => [tr.px[i] + tr.rx[i] * d + tr.ux[i] * h, tr.py[i] + tr.ry[i] * d + tr.uy[i] * h, tr.pz[i] + tr.rz[i] * d + tr.uz[i] * h];
  const kc1 = new THREE.Color('#F5F7FA'), kc2 = new THREE.Color(accent === '#F5F7FA' ? '#E0123C' : '#E0123C');
  const wallBase = new THREE.Color('#8e97a3'), wallAcc = new THREE.Color(accent);
  const wallDark = new THREE.Color('#5b626c'); const wallLight = new THREE.Color('#d4d9e0');
  for (let i = 0; i < n - 1; i++) {
    const gap = (tr.flags[i] & F_GAP) || (tr.flags[i + 1] & F_GAP);
    if (gap) continue;
    const w0 = tr.w[i] / 2, w1 = tr.w[i + 1] / 2; const s = tr.surf[i];
    const sc = (i * DS) / 6, sc1 = ((i + 1) * DS) / 6;
    (roadBufs[s] ??= new Buf()).quad(pt(i, -w0), pt(i, w0), pt(i + 1, w1), pt(i + 1, -w1), [[-w0 / 6, sc], [w0 / 6, sc], [w1 / 6, sc1], [-w1 / 6, sc1]]);
    // underside + edges
    const th = 0.55;
    under.quad(pt(i, w0, -th), pt(i, -w0, -th), pt(i + 1, -w1, -th), pt(i + 1, w1, -th));
    under.quad(pt(i, -w0), pt(i, -w0, -th), pt(i + 1, -w1, -th), pt(i + 1, -w1));
    under.quad(pt(i, w0, -th), pt(i, w0), pt(i + 1, w1), pt(i + 1, w1, -th));
    // kerbs
    const kc = (Math.floor(i / 2) % 2) ? kc1 : kc2;
    if (s === SURF_ASPHALT || s === SURF_STEEL) {
      kerb.quad(pt(i, -w0, 0.025), pt(i, -w0 + 0.85, 0.025), pt(i + 1, -w1 + 0.85, 0.025), pt(i + 1, -w1, 0.025), undefined, kc);
      kerb.quad(pt(i, w0 - 0.85, 0.025), pt(i, w0, 0.025), pt(i + 1, w1, 0.025), pt(i + 1, w1 - 0.85, 0.025), undefined, kc);
    }
    // markings
    if (s === SURF_ASPHALT || s === SURF_STEEL) {
      if (Math.floor(i / 3) % 2 === 0) mark.quad(pt(i, -0.13, 0.03), pt(i, 0.13, 0.03), pt(i + 1, 0.13, 0.03), pt(i + 1, -0.13, 0.03));
      for (const sd of [-1, 1]) { const e0 = sd * (w0 - 1.15), e1 = sd * (w1 - 1.15); mark.quad(pt(i, e0 - 0.09, 0.03), pt(i, e0 + 0.09, 0.03), pt(i + 1, e1 + 0.09, 0.03), pt(i + 1, e1 - 0.09, 0.03)); }
    }
    if (tr.flags[i] & F_BOOST) {
      const bw = Math.min(w0, w1) * 0.62; const v0 = i * DS / 8, v1 = (i + 1) * DS / 8;
      boost.quad(pt(i, -bw, 0.04), pt(i, bw, 0.04), pt(i + 1, bw, 0.04), pt(i + 1, -bw, 0.04), [[0, v0], [1, v0], [1, v1], [0, v1]]);
    }
    // walls (guardrail): inner face, top, outer face
    if (!(tr.flags[i] & F_NOWALL) && s !== SURF_ICE || (s === SURF_ICE && !(tr.flags[i] & F_NOWALL))) {
      const hgt = 0.95, th2 = 0.4;
      const col = (Math.floor(i / 4) % 2 === 0) ? wallBase : wallLight;
      for (const sd of [-1, 1]) {
        const a0 = sd * w0, a1 = sd * w1, b0 = sd * (w0 + th2), b1 = sd * (w1 + th2);
        wall.quad(pt(i, a0), pt(i + 1, a1), pt(i + 1, a1, hgt), pt(i, a0, hgt), undefined, col);                       // inner
        wall.quad(pt(i, a0, hgt), pt(i + 1, a1, hgt), pt(i + 1, b1, hgt), pt(i, b0, hgt), undefined, wallAcc);         // top rail (accent)
        wall.quad(pt(i, b0, hgt), pt(i + 1, b1, hgt), pt(i + 1, b1), pt(i, b0), undefined, wallDark);                  // outer
      }
    }
    // tunnel shell
    if (tr.flags[i] & F_TUNNEL) {
      const R = Math.max(w0, w1) + 1.6, Hh = 6.2; const seg = 10;
      for (let k = 0; k < seg; k++) {
        const a0 = (k / seg) * Math.PI, a1 = ((k + 1) / seg) * Math.PI;
        const p = (idx: number, a: number) => pt(idx, Math.cos(a) * R, Math.sin(a) * Hh);
        tunnel.quad(p(i, a0), p(i + 1, a0), p(i + 1, a1), p(i, a1), undefined, new THREE.Color().setHSL(0, 0, 0.16 + 0.03 * ((i + k) % 2)));
      }
      if (i % 5 === 0) lights.quad(pt(i, -1.2, Hh - 0.35), pt(i, 1.2, Hh - 0.35), pt(i + 1, 1.2, Hh - 0.35), pt(i + 1, -1.2, Hh - 0.35));
    }
  }
  const matAsphaltTex = canvasTex(256, 256, c => { noiseFill(c, 256, 256, '#6b7078', 0.55, 7); });
  const matTex: Record<number, THREE.CanvasTexture> = {
    [SURF_ASPHALT]: matAsphaltTex,
    [SURF_DIRT]: canvasTex(256, 256, c => { noiseFill(c, 256, 256, '#b08a5e', 0.9, 11); }),
    [SURF_GRASS]: canvasTex(256, 256, c => { noiseFill(c, 256, 256, '#79c25a', 0.9, 12); }),
    [SURF_ICE]: canvasTex(256, 256, c => { noiseFill(c, 256, 256, '#e6f6ff', 0.25, 13); c.strokeStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(Math.random() * 256, 0); c.lineTo(Math.random() * 256, 256); c.stroke(); } }),
    [SURF_SAND]: canvasTex(256, 256, c => { noiseFill(c, 256, 256, '#f0d9a0', 0.7, 14); }),
    [SURF_STEEL]: canvasTex(256, 256, c => { noiseFill(c, 256, 256, '#c3cad3', 0.3, 15); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.strokeRect(0, 0, 256, 256); c.strokeRect(128, 0, 1, 256); }),
  };
  W.disposables.push(...Object.values(matTex));
  const add = (buf: Buf, mat: THREE.Material, shadow = true, recv = true) => {
    if (!buf.count) return null; const m = new THREE.Mesh(buf.geometry(), mat); m.castShadow = shadow; m.receiveShadow = recv; W.group.add(m); W.disposables.push(mat); return m;
  };
  for (const [s, b] of Object.entries(roadBufs)) {
    const sp = SURF_COL[+s];
    const m = new THREE.MeshPhysicalMaterial({ map: matTex[+s], color: sp.color, roughness: sp.rough, metalness: sp.metal, clearcoat: +s === SURF_ICE ? 1 : 0, side: THREE.DoubleSide });
    if (+s === SURF_ASPHALT) m.color.set('#5a6068');
    add(b, m, false, true);
  }
  add(under, new THREE.MeshStandardMaterial({ color: '#1d2025', roughness: 0.9, side: THREE.DoubleSide }), true, false);
  add(kerb, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), false, true);
  add(mark, new THREE.MeshStandardMaterial({ color: '#f1f3f6', roughness: 0.5, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), false, true);
  add(wall, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, metalness: 0.7, side: THREE.DoubleSide }), true, true);
  add(tunnel, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide }), true, true);
  add(lights, new THREE.MeshBasicMaterial({ color: '#fff4d0', side: THREE.DoubleSide }), false, false);
  if (boost.count) {
    W.boostTex = canvasTex(128, 256, c => {
      c.fillStyle = '#0b0d10'; c.fillRect(0, 0, 128, 256);
      c.strokeStyle = '#C6FF00'; c.lineWidth = 16; c.lineJoin = 'miter';
      for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(14, 70 + k * 128); c.lineTo(64, 20 + k * 128); c.lineTo(114, 70 + k * 128); c.stroke(); }
    });
    W.disposables.push(W.boostTex);
    const bm = new THREE.MeshStandardMaterial({ map: W.boostTex, emissive: '#C6FF00', emissiveMap: W.boostTex, emissiveIntensity: 1.6, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide });
    add(boost, bm, false, false);
  }

  // ---------------------------------------------------------------- gates
  const addGate = (i: number, kind: 'cp' | 'start' | 'finish', label: string, num?: number) => {
    const g = new THREE.Group();
    const w = tr.w[i] / 2 + 0.7; const H = 7;
    const postM = new THREE.MeshStandardMaterial({ color: '#272C34', roughness: 0.4, metalness: 0.8 });
    const glow = new THREE.MeshBasicMaterial({ color: kind === 'finish' ? '#F5F7FA' : '#C6FF00', transparent: true, opacity: kind === 'cp' ? 0.22 : 0.0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    for (const sd of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, H, 0.5), postM); p.position.set(sd * w, H / 2, 0); g.add(p); W.disposables.push(p.geometry); }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w * 2 + 0.6, 1.1, 0.6), postM); bar.position.y = H; g.add(bar); W.disposables.push(bar.geometry);
    const lab = canvasTex(512, 96, c => {
      c.fillStyle = '#101216'; c.fillRect(0, 0, 512, 96);
      if (kind === 'finish') { for (let x = 0; x < 512; x += 24) for (let y = 0; y < 96; y += 24) { c.fillStyle = ((x + y) / 24) % 2 ? '#F5F7FA' : '#101216'; c.fillRect(x, y, 24, 24); } c.fillStyle = 'rgba(16,18,22,.8)'; c.fillRect(150, 18, 212, 60); }
      c.fillStyle = kind === 'finish' ? '#F5F7FA' : '#C6FF00'; c.font = '800 58px "Barlow Condensed", Impact, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(label, 256, 52);
    }, false);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(8, w * 1.6), 1.0), new THREE.MeshBasicMaterial({ map: lab })); sign.position.set(0, H, -0.31); g.add(sign);
    const sign2 = sign.clone(); sign2.position.z = 0.31; sign2.rotation.y = Math.PI; g.add(sign2);
    W.disposables.push(lab, sign.geometry);
    const curtain = new THREE.Mesh(new THREE.PlaneGeometry(w * 2, H - 0.6), glow); curtain.position.y = (H - 0.6) / 2; g.add(curtain); W.disposables.push(curtain.geometry);
    const m4 = new THREE.Matrix4().makeBasis(new THREE.Vector3(tr.rx[i], tr.ry[i], tr.rz[i]), new THREE.Vector3(tr.ux[i], tr.uy[i], tr.uz[i]), new THREE.Vector3(-tr.tx[i], -tr.ty[i], -tr.tz[i]));
    g.quaternion.setFromRotationMatrix(m4); g.position.set(tr.px[i], tr.py[i], tr.pz[i]);
    W.group.add(g);
    if (kind === 'cp') W.gates.push({ mesh: g, mat: glow, idx: i });
    W.disposables.push(postM, glow);
  };
  addGate(2, 'start', 'START');
  tr.cps.forEach((c, k) => addGate(c, 'cp', `CHECKPOINT ${k + 1}`));
  addGate(tr.finish, 'finish', 'FINISH');
  W.setCheckpointsPassed(0);
  // start grid / finish line decals
  {
    const chk = canvasTex(64, 64, c => { for (let x = 0; x < 64; x += 16) for (let y = 0; y < 64; y += 16) { c.fillStyle = ((x + y) / 16) % 2 ? '#fff' : '#111'; c.fillRect(x, y, 16, 16); } });
    const mat = new THREE.MeshBasicMaterial({ map: chk, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, side: THREE.DoubleSide }); W.disposables.push(mat, chk);
    for (const i of [tr.finish, 2]) {
      const b = new Buf(); const w0 = tr.w[i] / 2 - 0.9;
      b.quad(pt(i, -w0, 0.05), pt(i, w0, 0.05), pt(i + 1, w0, 0.05), pt(i + 1, -w0, 0.05), [[0, 0], [w0 / 1.5, 0], [w0 / 1.5, 1], [0, 1]]);
      const m = new THREE.Mesh(b.geometry(), mat); W.group.add(m);
    }
  }
  // obstacles
  tr.obstacles.forEach(o => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(o.w * 2, 1.4, o.len * 2), new THREE.MeshStandardMaterial({ color: '#FF9A1F', roughness: 0.5, metalness: 0.2, emissive: '#ff6a00', emissiveIntensity: 0.4 }));
    m.castShadow = true; W.group.add(m); W.obstacles.push(m); W.disposables.push(m.geometry, m.material as THREE.Material);
    const ang = Math.atan2(tr.tx[Math.floor(o.s / DS)], tr.tz[Math.floor(o.s / DS)]); m.rotation.y = ang;
  });

  // ---------------------------------------------------------------- terrain
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
  for (let i = 0; i < n; i++) { minX = Math.min(minX, tr.px[i]); maxX = Math.max(maxX, tr.px[i]); minZ = Math.min(minZ, tr.pz[i]); maxZ = Math.max(maxZ, tr.pz[i]); }
  const ground = tr.minY - 7; W.groundLevel = ground;
  const pad = env === 'alpine' ? 700 : 520;
  minX -= pad; maxX += pad; minZ -= pad; maxZ += pad;
  const cell = Math.max(22, Math.max(maxX - minX, maxZ - minZ) / 120);
  const gx = Math.ceil((maxX - minX) / cell) + 1, gz = Math.ceil((maxZ - minZ) / cell) + 1;
  const dist = new Float32Array(gx * gz).fill(1e9), roadY = new Float32Array(gx * gz);
  const R = 150; const rc = Math.ceil(R / cell);
  for (let i = 0; i < n; i += 2) {
    const cx = Math.round((tr.px[i] - minX) / cell), cz = Math.round((tr.pz[i] - minZ) / cell);
    for (let a = cx - rc; a <= cx + rc; a++) for (let b = cz - rc; b <= cz + rc; b++) {
      if (a < 0 || b < 0 || a >= gx || b >= gz) continue;
      const dx = minX + a * cell - tr.px[i], dz = minZ + b * cell - tr.pz[i]; const d = Math.hypot(dx, dz);
      const k = a + b * gx; if (d < dist[k]) { dist[k] = d; roadY[k] = tr.py[i]; }
    }
  }
  const reliefAmp: Record<string, number> = { academy: 5, coastal: 9, desert: 14, alpine: 38, neon: 0, industrial: 1.5, forest: 16, sky: 0, formula: 3, hyper: 0, gauntlet: 22 };
  const amp = reliefAmp[env] ?? 5;
  const nz = (x: number, z: number) => {
    const f = (a: number, b: number, s: number) => Math.sin(a * s + 1.7) * Math.cos(b * s * 1.3 + 0.4) + Math.sin((a + b) * s * 0.7 + 2.1) * 0.7;
    return (f(x, z, 0.004) * 0.6 + f(x, z, 0.011) * 0.3 + f(x, z, 0.03) * 0.1);
  };
  const W_hasTerrain = env !== 'sky';
  W.hasTerrain = W_hasTerrain;
  const heightAt = (x: number, z: number, k: number): number => {
    const d = dist[k]; const t = Math.min(1, Math.max(0, (d - 20) / 110)); const ts = t * t * (3 - 2 * t);
    const corridor = Math.min(roadY[k] - 2.7, ground + 16);
    let far = ground + nz(x, z) * amp * (0.25 + 0.75 * ts) + (env === 'coastal' ? -3 : 0);
    if (env === 'alpine' || env === 'gauntlet') far += Math.max(0, d - 160) * 0.12 * (0.5 + 0.5 * Math.abs(nz(x * 0.6, z * 0.6)));
    if (env === 'desert') { const m = Math.abs(nz(x * 1.7, z * 1.7)); if (m > 0.8 && d > 100) far += 22; }
    return corridor + (far - corridor) * ts;
  };
  const sample = (x: number, z: number): number => {
    const fx = (x - minX) / cell, fz = (z - minZ) / cell; const a = Math.max(0, Math.min(gx - 1, Math.round(fx))), b = Math.max(0, Math.min(gz - 1, Math.round(fz)));
    return heightAt(x, z, a + b * gx);
  };
  W.terrainH = sample;
  const distAt = (x: number, z: number): number => { const a = Math.max(0, Math.min(gx - 1, Math.round((x - minX) / cell))), b = Math.max(0, Math.min(gz - 1, Math.round((z - minZ) / cell))); return dist[a + b * gx]; };
  if (W_hasTerrain) {
    const tg = new THREE.PlaneGeometry(1, 1, gx - 1, gz - 1); tg.rotateX(-Math.PI / 2);
    const pos = tg.getAttribute('position'); const col = new Float32Array(pos.count * 3);
    const lo = new THREE.Color(style.ground[0]), hi = new THREE.Color(style.ground[1]); const rock = new THREE.Color(env === 'alpine' ? '#7d8794' : '#6b6258'); const c = new THREE.Color();
    for (let b = 0; b < gz; b++) for (let a = 0; a < gx; a++) {
      const k = a + b * gx; const x = minX + a * cell, z = minZ + b * cell; const h = heightAt(x, z, k);
      pos.setXYZ(k, x, h, z);
      const t = Math.min(1, Math.max(0, (h - ground) / (amp * 1.2 + 4))); c.copy(lo).lerp(hi, t * 0.9 + 0.1 * Math.abs(nz(x * 3, z * 3)));
      if (env === 'alpine' && h > ground + 14) c.lerp(new THREE.Color('#ffffff'), Math.min(1, (h - ground - 14) / 14));
      else if (h > ground + amp * 0.6 && (env === 'desert' || env === 'gauntlet' || env === 'alpine')) c.lerp(rock, 0.4);
      col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
    }
    tg.setAttribute('color', new THREE.BufferAttribute(col, 3)); tg.computeVertexNormals();
    const terr = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
    terr.receiveShadow = true; W.group.add(terr); W.disposables.push(terr.material as THREE.Material);
  }
  if (style.water) {
    const wm = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), new THREE.MeshPhysicalMaterial({ color: style.water, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.9, clearcoat: 1 }));
    wm.rotation.x = -Math.PI / 2; wm.position.set((minX + maxX) / 2, ground + 1.5, (minZ + maxZ) / 2); W.group.add(wm); W.water = wm; W.disposables.push(wm.material as THREE.Material);
  }
  if (env === 'sky') {
    // cloud sea below + floating rocks
    W.clouds = new THREE.Group();
    const cm = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#cfe6ff', emissiveIntensity: 0.25 });
    const cg = new THREE.IcosahedronGeometry(1, 1);
    const inst = new THREE.InstancedMesh(cg, cm, 260); const m4 = new THREE.Matrix4();
    for (let i = 0; i < 260; i++) { const s = rng.range(25, 70); m4.compose(new THREE.Vector3(rng.range(minX, maxX), ground - rng.range(10, 70), rng.range(minZ, maxZ)), new THREE.Quaternion(), new THREE.Vector3(s * 1.6, s * 0.45, s)); inst.setMatrixAt(i, m4); }
    W.group.add(inst); W.disposables.push(cg, cm);
  }

  // ---------------------------------------------------------------- pylons under elevated sections
  {
    const pm = new THREE.MeshStandardMaterial({ color: env === 'neon' || env === 'hyper' ? '#1c1f2a' : '#8c9299', roughness: 0.8 }); W.disposables.push(pm);
    const geo = new THREE.BoxGeometry(1.3, 1, 1.3); geo.translate(0, -0.5, 0); W.disposables.push(geo);
    const list: THREE.Matrix4[] = [];
    for (let i = 6; i < n - 6; i += 14) {
      if ((tr.flags[i] & F_GAP)) continue;
      const gh = env === 'sky' ? ground - 40 : sample(tr.px[i], tr.pz[i]);
      const hgt = tr.py[i] - 0.55 - gh;
      if (hgt > 6 && hgt < 200 && Math.abs(tr.uy[i]) > 0.7 && (tr.flags[i] & F_BRIDGE || hgt > 9)) {
        const m = new THREE.Matrix4().compose(new THREE.Vector3(tr.px[i], tr.py[i] - 0.55, tr.pz[i]), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(tr.tx[i], tr.tz[i])), new THREE.Vector3(1, hgt, 1));
        list.push(m);
      }
    }
    if (list.length) { const inst = new THREE.InstancedMesh(geo, pm, list.length); list.forEach((m, k) => inst.setMatrixAt(k, m)); inst.castShadow = true; W.group.add(inst); }
  }

  // ---------------------------------------------------------------- scenery props
  buildProps(W, env, tr, rng, sample, distAt, ground, style.sky[1], accent);
  return W;
}

// ======================================================================================================= props
function mergeColored(parts: { g: THREE.BufferGeometry; c: string; m?: THREE.Matrix4 }[]): THREE.BufferGeometry {
  const pos: number[] = [], nor: number[] = [], col: number[] = [];
  const c = new THREE.Color();
  for (const { g, c: cc, m } of parts) {
    const ng = g.index ? g.toNonIndexed() : g.clone(); if (m) ng.applyMatrix4(m); ng.computeVertexNormals();
    const p = ng.getAttribute('position'), n = ng.getAttribute('normal'); c.set(cc);
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); col.push(c.r, c.g, c.b); }
    ng.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return out;
}
const T = (x: number, y: number, z: number) => new THREE.Matrix4().makeTranslation(x, y, z);

function propGeos(): Record<string, THREE.BufferGeometry> {
  const cone = (r: number, h: number, seg = 7) => new THREE.ConeGeometry(r, h, seg);
  const cyl = (r1: number, r2: number, h: number, seg = 7) => new THREE.CylinderGeometry(r1, r2, h, seg);
  const ico = (r: number, d = 1) => new THREE.IcosahedronGeometry(r, d);
  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
  const rockG = ico(1, 1); { const p = rockG.getAttribute('position'); for (let i = 0; i < p.count; i++) { const k = 1 + 0.25 * Math.sin(p.getX(i) * 5.1 + p.getY(i) * 3.3) * Math.cos(p.getZ(i) * 4.2); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.75, p.getZ(i) * k); } }
  return {
    pine: mergeColored([{ g: cyl(0.25, 0.35, 2), c: '#5a3c26', m: T(0, 1, 0) }, { g: cone(2.2, 3.4), c: '#2f6b3a', m: T(0, 3.2, 0) }, { g: cone(1.7, 3), c: '#378045', m: T(0, 5, 0) }, { g: cone(1.1, 2.6), c: '#3f9150', m: T(0, 6.8, 0) }]),
    pineSnow: mergeColored([{ g: cyl(0.25, 0.35, 2), c: '#4a3626', m: T(0, 1, 0) }, { g: cone(2.2, 3.4), c: '#dfe9f0', m: T(0, 3.2, 0) }, { g: cone(1.7, 3), c: '#eef4f8', m: T(0, 5, 0) }, { g: cone(1.1, 2.6), c: '#ffffff', m: T(0, 6.8, 0) }]),
    tree: mergeColored([{ g: cyl(0.3, 0.4, 3), c: '#6b4a2f', m: T(0, 1.5, 0) }, { g: ico(2.2, 1), c: '#4a9a3f', m: T(0, 4.4, 0) }, { g: ico(1.5, 1), c: '#5cb04c', m: T(0.9, 5.3, 0.4) }]),
    palm: mergeColored([{ g: cyl(0.2, 0.3, 6, 6), c: '#8a6a45', m: T(0, 3, 0) }, ...[0, 1, 2, 3, 4, 5].map(i => ({ g: cone(0.5, 3.2, 4), c: '#3d9a4a', m: new THREE.Matrix4().makeRotationZ(1.2).premultiply(new THREE.Matrix4().makeRotationY((i / 6) * Math.PI * 2)).premultiply(T(0, 6, 0)) }))]),
    cactus: mergeColored([{ g: cyl(0.4, 0.4, 4, 7), c: '#5c8a4a', m: T(0, 2, 0) }, { g: cyl(0.25, 0.25, 1.6, 6), c: '#5c8a4a', m: T(0.8, 2.6, 0) }, { g: cyl(0.25, 0.25, 1.2, 6), c: '#5c8a4a', m: T(-0.8, 1.9, 0) }]),
    rock: mergeColored([{ g: rockG, c: '#7a7468' }]),
    rockSnow: mergeColored([{ g: rockG, c: '#9aa4b0' }, { g: ico(0.7, 1), c: '#ffffff', m: T(0, 0.55, 0) }]),
    mesa: mergeColored([{ g: cyl(6, 8, 18, 9), c: '#b5703b', m: T(0, 9, 0) }, { g: cyl(6.1, 6.2, 3, 9), c: '#d49a5a', m: T(0, 16, 0) }, { g: cyl(6.3, 6.6, 2.5, 9), c: '#8f4f2a', m: T(0, 6, 0) }]),
    mountain: mergeColored([{ g: cone(60, 80, 8), c: '#6f7886', m: T(0, 40, 0) }, { g: cone(24, 32, 8), c: '#ffffff', m: T(0, 66, 0) }]),
    spire: mergeColored([{ g: cone(5, 40, 5), c: '#2a1d1a', m: T(0, 20, 0) }, { g: cone(1.4, 8, 5), c: '#ff5a2a', m: T(0, 38, 0) }]),
    building: box(1, 1, 1),
    container: box(2.4, 2.6, 6),
    tank: mergeColored([{ g: cyl(4, 4, 8, 14), c: '#b8bec6', m: T(0, 4, 0) }, { g: cyl(4.1, 4.1, 0.4, 14), c: '#7b828a', m: T(0, 8, 0) }]),
    stack: mergeColored([{ g: cyl(2, 2.8, 36, 10), c: '#9a8f86', m: T(0, 18, 0) }, { g: cyl(2.1, 2.1, 3, 10), c: '#c0392b', m: T(0, 32, 0) }]),
    lamp: mergeColored([{ g: cyl(0.12, 0.16, 8, 6), c: '#3a3f47', m: T(0, 4, 0) }, { g: box(1.6, 0.2, 0.4), c: '#ffffff', m: T(0.7, 8, 0) }]),
    cone: mergeColored([{ g: cone(0.35, 0.8, 8), c: '#ff6a1f', m: T(0, 0.4, 0) }, { g: cyl(0.4, 0.4, 0.06, 8), c: '#222', m: T(0, 0.03, 0) }]),
    tyres: mergeColored([{ g: cyl(0.5, 0.5, 0.45, 12), c: '#14161a', m: T(0, 0.25, 0) }, { g: cyl(0.5, 0.5, 0.45, 12), c: '#e0123C', m: T(0, 0.7, 0) }, { g: cyl(0.5, 0.5, 0.45, 12), c: '#14161a', m: T(0, 1.15, 0) }]),
    stand: mergeColored([{ g: box(30, 1, 10), c: '#8a919a', m: T(0, 0.5, 0) }, { g: box(30, 6, 1), c: '#c9ced6', m: T(0, 3.5, -4.6) }, { g: box(30, 0.6, 10), c: '#E0123C', m: T(0, 2, 0.5) }, { g: box(30, 0.6, 7), c: '#F5F7FA', m: T(0, 3.5, -1) }, { g: box(32, 0.5, 12), c: '#272C34', m: T(0, 7, -1) }]),
    pylon: mergeColored([{ g: box(2.2, 60, 2.2), c: '#10243a', m: T(0, 30, 0) }, { g: box(2.4, 60, 0.4), c: '#00e5ff', m: T(0, 30, 1.2) }]),
    billboard: mergeColored([{ g: cyl(0.3, 0.3, 14, 6), c: '#2a2d36', m: T(0, 7, 0) }, { g: box(12, 5, 0.4), c: '#ff2dcb', m: T(0, 15, 0) }]),
    bush: mergeColored([{ g: ico(1.2, 1), c: '#3f8a3a', m: T(0, 0.8, 0) }, { g: ico(0.9, 1), c: '#4fa047', m: T(0.9, 0.6, 0.3) }]),
    island: mergeColored([{ g: cone(14, 22, 8).rotateX(Math.PI), c: '#7c6a58', m: T(0, 0, 0) }, { g: cyl(14, 14, 2.5, 8), c: '#5ea04a', m: T(0, 11.2, 0) }]),
  };
}

function buildProps(W: World, env: string, tr: Track, rng: Rng, hAt: (x: number, z: number) => number, distAt: (x: number, z: number) => number, ground: number, haze: string, accent: string) {
  const q = Math.max(0.35, [0.4, 0.7, 1, 1.4][Math.min(3, W.quality.distance)]);
  const geos = propGeos();
  const stdMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true });
  W.disposables.push(stdMat, ...Object.values(geos));
  const winTex = new THREE.CanvasTexture((() => { const c = document.createElement('canvas'); c.width = 128; c.height = 256; const x = c.getContext('2d')!; x.fillStyle = '#10131a'; x.fillRect(0, 0, 128, 256); const r = new Rng(5); for (let yy = 4; yy < 252; yy += 10) for (let xx = 4; xx < 124; xx += 10) { if (r.chance(0.55)) { x.fillStyle = r.chance(0.5) ? '#ffe9a8' : r.chance(0.5) ? '#7fe9ff' : '#ff8fe0'; x.fillRect(xx, yy, 6, 6); } } return c; })());
  winTex.colorSpace = THREE.SRGBColorSpace; winTex.wrapS = winTex.wrapT = THREE.RepeatWrapping;
  const night = env === 'neon' || env === 'hyper';
  const bMat = new THREE.MeshStandardMaterial({ map: winTex, emissiveMap: winTex, emissive: '#ffffff', emissiveIntensity: night ? 1.3 : 0.15, color: night ? '#444' : '#9aa4b0', roughness: 0.6, metalness: 0.2 });
  const glowMat = new THREE.MeshBasicMaterial({ color: accent });
  W.disposables.push(winTex, bMat, glowMat);
  const n = tr.n;
  interface Spec { geo: string; count: number; min: number; max: number; scale: [number, number]; minDist?: number; tint?: boolean; mat?: THREE.Material; sy?: [number, number]; hMax?: number }
  const specs: Spec[] = [];
  switch (env) {
    case 'academy': specs.push({ geo: 'tree', count: 140, min: 14, max: 120, scale: [0.8, 1.5] }, { geo: 'bush', count: 120, min: 10, max: 60, scale: [0.7, 1.3] }, { geo: 'cone', count: 50, min: 7, max: 9, scale: [1.2, 1.2], minDist: 0 }, { geo: 'tyres', count: 80, min: 7.2, max: 8.6, scale: [1, 1] }); break;
    case 'coastal': specs.push({ geo: 'palm', count: 110, min: 12, max: 90, scale: [0.9, 1.6] }, { geo: 'rock', count: 90, min: 14, max: 160, scale: [1.5, 6] }, { geo: 'lamp', count: 40, min: 8, max: 9, scale: [1, 1] }); break;
    case 'desert': specs.push({ geo: 'cactus', count: 160, min: 14, max: 130, scale: [0.8, 1.8] }, { geo: 'rock', count: 120, min: 14, max: 200, scale: [1.5, 7] }, { geo: 'mesa', count: 36, min: 90, max: 420, scale: [1.5, 5] }); break;
    case 'alpine': specs.push({ geo: 'pineSnow', count: 380, min: 12, max: 220, scale: [0.8, 1.8] }, { geo: 'rockSnow', count: 90, min: 14, max: 200, scale: [1.5, 7] }, { geo: 'mountain', count: 26, min: 330, max: 700, scale: [1.2, 3.2], minDist: 280 }); break;
    case 'neon': specs.push({ geo: 'building', count: 320, min: 28, max: 330, scale: [1, 1], mat: bMat }, { geo: 'lamp', count: 70, min: 8, max: 9, scale: [1, 1] }, { geo: 'billboard', count: 30, min: 20, max: 70, scale: [0.9, 1.4] }); break;
    case 'industrial': specs.push({ geo: 'container', count: 220, min: 16, max: 120, scale: [1, 1.1], tint: true }, { geo: 'tank', count: 24, min: 30, max: 160, scale: [1, 2] }, { geo: 'stack', count: 14, min: 80, max: 300, scale: [1, 1.5] }, { geo: 'building', count: 70, min: 40, max: 260, scale: [1, 1], mat: bMat }, { geo: 'lamp', count: 50, min: 8, max: 9, scale: [1, 1] }); break;
    case 'forest': specs.push({ geo: 'pine', count: 520, min: 10, max: 150, scale: [0.9, 2] }, { geo: 'tree', count: 260, min: 10, max: 150, scale: [0.9, 1.8] }, { geo: 'rock', count: 70, min: 12, max: 100, scale: [1, 4] }, { geo: 'bush', count: 140, min: 9, max: 50, scale: [0.8, 1.4] }); break;
    case 'sky': specs.push({ geo: 'island', count: 40, min: 40, max: 420, scale: [0.8, 2.5], hMax: 0 }); break;
    case 'formula': specs.push({ geo: 'stand', count: 10, min: 22, max: 40, scale: [1, 1.4] }, { geo: 'tyres', count: 140, min: 7.4, max: 9, scale: [1, 1] }, { geo: 'tree', count: 120, min: 40, max: 200, scale: [1, 1.6] }, { geo: 'lamp', count: 40, min: 8, max: 9, scale: [1, 1] }); break;
    case 'hyper': specs.push({ geo: 'pylon', count: 90, min: 14, max: 160, scale: [0.8, 1.6] }, { geo: 'building', count: 120, min: 60, max: 340, scale: [1, 1], mat: bMat }); break;
    case 'gauntlet': specs.push({ geo: 'spire', count: 130, min: 18, max: 240, scale: [0.7, 2.2] }, { geo: 'rock', count: 90, min: 12, max: 120, scale: [1.5, 6] }); break;
  }
  const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), col = new THREE.Color();
  for (const sp of specs) {
    const cnt = Math.round(sp.count * q * (1 + tr.length / 5000));
    const inst = new THREE.InstancedMesh(geos[sp.geo], sp.mat ?? stdMat, cnt);
    let placed = 0;
    for (let a = 0; a < cnt * 5 && placed < cnt; a++) {
      const i = Math.floor(rng.next() * (n - 8)) + 4;
      const side = rng.chance(0.5) ? 1 : -1; const off = tr.w[i] / 2 + rng.range(sp.min, sp.max);
      const x = tr.px[i] + tr.rx[i] * side * off + rng.range(-8, 8), z = tr.pz[i] + tr.rz[i] * side * off + rng.range(-8, 8);
      const dd = distAt(x, z); if (dd < Math.max(sp.min * 0.8, sp.minDist ?? 0) && env !== 'sky') continue;
      let y = hAt(x, z);
      if (env === 'sky') { y = ground - 15 - rng.range(0, 60); if (Math.abs(tr.py[i] - y) < 20) continue; }
      if (W.water && y < ground + 1.8) continue;
      const s = rng.range(sp.scale[0], sp.scale[1]); qt.setFromAxisAngle(up, rng.range(0, 6.28));
      if (sp.geo === 'building') { const h = rng.range(25, env === 'hyper' ? 150 : 110) * (0.6 + 0.4 * Math.max(0, 1 - dd / 300)); const w = rng.range(12, 30); sc.set(w, h, w * rng.range(0.7, 1.3)); ps.set(x, y + h / 2, z); }
      else if (sp.geo === 'container') { sc.set(s, s, s); ps.set(x, y + 1.3 * s, z); qt.setFromAxisAngle(up, Math.atan2(tr.tx[i], tr.tz[i]) + (rng.chance(0.5) ? 0 : Math.PI / 2)); }
      else if (sp.geo === 'cone' || sp.geo === 'tyres' || sp.geo === 'lamp') {
        if (side < 0 && sp.geo === 'lamp') qt.setFromAxisAngle(up, Math.PI);
        const o2 = tr.w[i] / 2 + (sp.geo === 'lamp' ? 1.6 : 0.9); const sd = side; sc.set(s, s, s);
        ps.set(tr.px[i] + tr.rx[i] * sd * o2, tr.py[i] + tr.ry[i] * sd * o2, tr.pz[i] + tr.rz[i] * sd * o2);
        if (sp.geo !== 'lamp') { if (!(Math.abs(tr.kh[i]) > 0.006)) continue; } else { qt.setFromAxisAngle(up, Math.atan2(tr.rx[i] * -sd, tr.rz[i] * -sd) + Math.PI / 2); }
        if (sp.geo === 'tyres') ps.y = tr.py[i] + tr.ry[i] * sd * o2 + 0.0;
      } else { sc.set(s, s * (sp.sy ? rng.range(...sp.sy) : 1), s); ps.set(x, y - 0.1, z); }
      m4.compose(ps, qt, sc); inst.setMatrixAt(placed, m4);
      if (sp.tint) { col.setHSL(rng.pick([0.02, 0.08, 0.58, 0.35, 0.6, 0.12]), 0.55, 0.45); inst.setColorAt(placed, col); }
      placed++;
    }
    inst.count = placed; inst.castShadow = true; inst.receiveShadow = true; inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    if (sp.geo === 'container' && !inst.instanceColor) { /* tint set above */ }
    W.group.add(inst);
  }
  // street-light glow heads for night scenes
  if (night) {
    const g = new THREE.SphereGeometry(0.4, 8, 6); const inst = new THREE.InstancedMesh(g, glowMat, 80); let k = 0;
    for (let i = 8; i < n - 8 && k < 80; i += 12) for (const sd of [-1, 1]) { if (k >= 80) break; const o = tr.w[i] / 2 + 1.6; m4.makeTranslation(tr.px[i] + tr.rx[i] * sd * o, tr.py[i] + tr.ry[i] * sd * o + 8, tr.pz[i] + tr.rz[i] * sd * o); inst.setMatrixAt(k++, m4); }
    inst.count = k; W.group.add(inst); W.disposables.push(g);
  }
}
