import * as THREE from 'three';
import { Track, DS, F_GAP, F_BOOST, F_NOWALL, F_TUNNEL, F_BRIDGE, SURF_ASPHALT, SURF_DIRT, SURF_GRASS, SURF_ICE, SURF_SAND, SURF_STEEL } from '../sim/track';
import { Rng, hashStr } from '../sim/dmath';
import { ENV_STYLES } from './gfx';
import { CHAPTERS_INFO } from '../data/chapters';
import { Quality } from './quality';
import { kitGeo, kitLoaded, kitCount, kitExtent } from './trackkit';

/**
 * World builder (optimised). Differences from the first version:
 *  - the road is split into ~80 m chunks, each with a full-detail and a half-resolution LOD; chunks are frustum- and distance-culled
 *  - road / kerb / markings / walls / underside / tunnels are merged into two draw calls per chunk (road surface + vertex-coloured "trim")
 *  - scenery is instanced per 180 m cell (own bounding spheres => real frustum culling), with LOD geometry and a distance cutoff
 *  - materials, textures and prop geometries are shared across tracks (never re-created per track); the track-side kit comes from the supplied GLB
 *  - terrain is tiled with a coarse far LOD
 */
class Buf {
  pos: number[] = []; nor: number[] = []; uv: number[] = []; col: number[] = [];
  tri(a: number[], b: number[], c: number[], ua: number[], ub: number[], uc: number[], col?: THREE.Color) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    this.pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); this.nor.push(nx, ny, nz, nx, ny, nz, nx, ny, nz); this.uv.push(ua[0], ua[1], ub[0], ub[1], uc[0], uc[1]);
    if (col) this.col.push(col.r, col.g, col.b, col.r, col.g, col.b, col.r, col.g, col.b);
  }
  quad(a: number[], b: number[], c: number[], d: number[], uv: [number[], number[], number[], number[]] = [[0, 0], [1, 0], [1, 1], [0, 1]], col?: THREE.Color) { this.tri(a, b, c, uv[0], uv[1], uv[2], col); this.tri(a, c, d, uv[0], uv[2], uv[3], col); }
  get count() { return this.pos.length / 3; }
  geometry(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (this.col.length) g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3)); g.computeBoundingSphere(); return g;
  }
}

// ------------------------------------------------------------------------------------------------------ shared resources (never per-track)
const texCache = new Map<string, THREE.CanvasTexture>(); const matCache = new Map<string, THREE.Material>();
function canvasTex(key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat = true, aniso = 4): THREE.CanvasTexture {
  const k = `${key}:${w}:${aniso}`; const hit = texCache.get(k); if (hit) return hit;
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; texCache.set(k, t); return t;
}
function noiseFill(c: CanvasRenderingContext2D, w: number, h: number, base: string, amt: number, seed: number) {
  c.fillStyle = base; c.fillRect(0, 0, w, h); const r = new Rng(seed);
  for (let i = 0; i < w * h / 6; i++) { const v = r.next(); const g = v > 0.5 ? 255 : 0; c.fillStyle = `rgba(${g},${g},${g},${amt * Math.abs(v - 0.5)})`; c.fillRect(r.next() * w, r.next() * h, 1.5, 1.5); }
}
function mat<T extends THREE.Material>(key: string, make: () => T): T { let m = matCache.get(key) as T | undefined; if (!m) { m = make(); matCache.set(key, m); } return m; }
/** Free everything that is cached across tracks (called when graphics settings change tier, and on shutdown). */
export function disposeSharedWorldResources() { for (const t of texCache.values()) t.dispose(); for (const m of matCache.values()) m.dispose(); texCache.clear(); matCache.clear(); }

const SURF_COL: Record<number, { color: string; rough: number; metal: number }> = {
  [SURF_ASPHALT]: { color: '#5a6068', rough: 0.88, metal: 0 }, [SURF_DIRT]: { color: '#8a6440', rough: 1, metal: 0 }, [SURF_GRASS]: { color: '#4f8a3c', rough: 1, metal: 0 },
  [SURF_ICE]: { color: '#a9d8f0', rough: 0.06, metal: 0.1 }, [SURF_SAND]: { color: '#dcbf82', rough: 1, metal: 0 }, [SURF_STEEL]: { color: '#8c95a1', rough: 0.45, metal: 0.65 },
};
function surfaceMaterial(s: number, q: Quality): THREE.Material {
  return mat(`road:${s}:${q.tier}:${q.texSize}`, () => {
    const sp = SURF_COL[s]; const sz = q.texSize;
    const tex = canvasTex(`surf${s}`, sz, sz, c => {
      if (s === SURF_ASPHALT) noiseFill(c, sz, sz, '#6b7078', 0.55, 7); else if (s === SURF_DIRT) noiseFill(c, sz, sz, '#b08a5e', 0.9, 11); else if (s === SURF_GRASS) noiseFill(c, sz, sz, '#79c25a', 0.9, 12);
      else if (s === SURF_ICE) { noiseFill(c, sz, sz, '#e6f6ff', 0.25, 13); c.strokeStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo((i * 53) % sz, 0); c.lineTo((i * 97) % sz, sz); c.stroke(); } }
      else if (s === SURF_SAND) noiseFill(c, sz, sz, '#f0d9a0', 0.7, 14); else { noiseFill(c, sz, sz, '#c3cad3', 0.3, 15); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.strokeRect(0, 0, sz, sz); }
    }, true, q.aniso);
    if (q.tier === 0) return new THREE.MeshLambertMaterial({ map: tex, color: sp.color, side: THREE.DoubleSide });
    if (s === SURF_ICE && q.tier === 2) return new THREE.MeshPhysicalMaterial({ map: tex, color: sp.color, roughness: sp.rough, metalness: sp.metal, clearcoat: 1, side: THREE.DoubleSide });
    return new THREE.MeshStandardMaterial({ map: tex, color: sp.color, roughness: sp.rough, metalness: sp.metal, side: THREE.DoubleSide });
  });
}
const trimMaterial = (q: Quality) => mat(`trim:${q.tier}`, () => q.tier === 0
  ? new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })
  : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));

// ------------------------------------------------------------------------------------------------------ world
interface Chunk { lod: THREE.Group[]; center: THREE.Vector3; radius: number; shown: number }
interface PropCell { lod: THREE.InstancedMesh[]; center: THREE.Vector3; radius: number; shown: number; cutoff: number }
interface Tile { lod: THREE.Mesh[]; center: THREE.Vector3; radius: number; shown: number }

export class World {
  group = new THREE.Group();
  terrainH: (x: number, z: number) => number = () => 0;
  groundLevel = 0; hasTerrain = true;
  gates: { mesh: THREE.Group; idx: number; curtain: THREE.Mesh }[] = [];
  boostTex?: THREE.CanvasTexture; obstacles: THREE.Mesh[] = [];
  water?: THREE.Mesh; chunks: Chunk[] = []; cells: PropCell[] = []; tiles: Tile[] = [];
  own: { dispose(): void }[] = []; // per-track geometries only
  visibleChunks = 0;
  constructor(public track: Track, public env: string, public q: Quality) {}

  setCheckpointsPassed(n: number) {
    const pass = mat('gate:pass', () => new THREE.MeshBasicMaterial({ color: '#6FB58A', transparent: true, opacity: 0.06, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    const pend = mat('gate:pend', () => new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.22, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.gates.forEach((g, i) => { g.curtain.material = i < n ? pass : pend; });
  }
  update(time: number) {
    if (this.boostTex) this.boostTex.offset.y = -((time * 1.6) % 1);
    const tr = this.track;
    for (let k = 0; k < this.obstacles.length; k++) {
      const o = tr.obstacles[k]; const ph = 6.283185307179586 * time / o.per + o.ph; const d = o.d0 + o.amp * Math.sin(ph);
      const i = Math.min(tr.n - 2, Math.floor(o.s / DS));
      this.obstacles[k].position.set(tr.px[i] + tr.rx[i] * d + tr.ux[i] * 0.7, tr.py[i] + tr.ry[i] * d + tr.uy[i] * 0.7, tr.pz[i] + tr.rz[i] * d + tr.uz[i] * 0.7);
    }
  }
  /** Distance culling + LOD selection (frustum culling is automatic per mesh bounding sphere). */
  cull(cam: THREE.Vector3) {
    const far = this.q.far, ld = this.q.lodDist; let vis = 0;
    for (const c of this.chunks) { const d = c.center.distanceTo(cam) - c.radius; const want = d > far ? -1 : d > ld ? 1 : 0; if (want !== c.shown) { c.lod.forEach((g, i) => g.visible = i === want); c.shown = want; } if (want >= 0) vis++; }
    this.visibleChunks = vis;
    for (const c of this.cells) { const d = c.center.distanceTo(cam) - c.radius; const want = d > c.cutoff ? -1 : d > ld ? 1 : 0; if (want !== c.shown) { c.lod.forEach((m, i) => m.visible = i === want); c.shown = want; } }
    for (const t of this.tiles) { const d = t.center.distanceTo(cam) - t.radius; const want = d > far * 1.15 ? -1 : d > far * 0.45 ? 1 : 0; if (want !== t.shown) { t.lod.forEach((m, i) => m.visible = i === want); t.shown = want; } }
  }
  dispose() { for (const d of this.own) d.dispose(); this.own.length = 0; this.chunks.length = this.cells.length = this.tiles.length = 0; }
}

export function buildWorld(tr: Track, env: string, q: Quality): World {
  const W = new World(tr, env, q);
  const style = ENV_STYLES[env] ?? ENV_STYLES.academy; const accent = CHAPTERS_INFO.find(c => c.env === env)?.accent ?? '#8A929C';
  const n = tr.n; const rng = new Rng(hashStr('world' + tr.def.id + env));
  const pt = (i: number, d: number, h = 0): number[] => [tr.px[i] + tr.rx[i] * d + tr.ux[i] * h, tr.py[i] + tr.ry[i] * d + tr.uy[i] * h, tr.pz[i] + tr.rz[i] * d + tr.uz[i] * h];
  const kc1 = new THREE.Color('#F5F7FA'), kc2 = new THREE.Color('#D4C6C8'); const wallBase = new THREE.Color('#8e97a3'), wallLight = new THREE.Color('#d4d9e0'), wallAcc = new THREE.Color(accent), wallDark = new THREE.Color('#5b626c');
  const dark1 = new THREE.Color('#1d2025'), white = new THREE.Color('#f1f3f6'), tun = new THREE.Color(), tunLight = new THREE.Color('#fff4d0');
  const own = <T extends { dispose(): void }>(o: T) => { W.own.push(o); return o; };

  // ---------------------------------------------------------------- road chunks (2 LODs each)
  const CH = q.chunkSize; const nChunks = Math.ceil((n - 1) / CH);
  const roadMesh = (m: THREE.Material, g: THREE.BufferGeometry, shadow: boolean) => { const mesh = new THREE.Mesh(own(g), m); mesh.castShadow = shadow; mesh.receiveShadow = true; return mesh; };
  const surfC: Record<number, THREE.Color> = {}; for (const k of Object.keys(SURF_COL)) surfC[+k] = new THREE.Color(SURF_COL[+k].color); const boostC = new THREE.Color('#cdd3e0');
  /** far = true -> a single vertex-coloured mesh (1 draw call) for distant chunks */
  const genChunk = (i0: number, i1: number, step: number, trimOnlyEdges: boolean, far = false) => {
    const roads: Record<number, Buf> = {}; const trim = new Buf(); const boost = new Buf();
    for (let i = i0; i < i1 && i + step < n; i += step) {
      const j = Math.min(n - 1, i + step);
      let gap = false; for (let k = i; k <= j; k++) if (tr.flags[k] & F_GAP) { gap = true; break; } if (gap) continue;
      const w0 = tr.w[i] / 2, w1 = tr.w[j] / 2; const s = tr.surf[i]; const fl = tr.flags[i];
      if (far) trim.quad(pt(i, -w0), pt(i, w0), pt(j, w1), pt(j, -w1), undefined, surfC[s] ?? surfC[SURF_ASPHALT]);
      else (roads[s] ??= new Buf()).quad(pt(i, -w0), pt(i, w0), pt(j, w1), pt(j, -w1), [[-w0 / 6, (i * DS) / 6], [w0 / 6, (i * DS) / 6], [w1 / 6, (j * DS) / 6], [-w1 / 6, (j * DS) / 6]]);
      const th = 0.55;
      trim.quad(pt(i, w0, -th), pt(i, -w0, -th), pt(j, -w1, -th), pt(j, w1, -th), undefined, dark1);
      trim.quad(pt(i, -w0), pt(i, -w0, -th), pt(j, -w1, -th), pt(j, -w1), undefined, dark1); trim.quad(pt(i, w0, -th), pt(i, w0), pt(j, w1), pt(j, w1, -th), undefined, dark1);
      const kc = (Math.floor(i / 2) % 2) ? kc1 : kc2;
      if (s === SURF_ASPHALT || s === SURF_STEEL) {
        trim.quad(pt(i, -w0, 0.025), pt(i, -w0 + 0.85, 0.025), pt(j, -w1 + 0.85, 0.025), pt(j, -w1, 0.025), undefined, kc); trim.quad(pt(i, w0 - 0.85, 0.025), pt(i, w0, 0.025), pt(j, w1, 0.025), pt(j, w1 - 0.85, 0.025), undefined, kc);
        if (!trimOnlyEdges && Math.floor(i / 3) % 2 === 0) trim.quad(pt(i, -0.13, 0.03), pt(i, 0.13, 0.03), pt(j, 0.13, 0.03), pt(j, -0.13, 0.03), undefined, white);
        for (const sd of [-1, 1]) { const e0 = sd * (w0 - 1.15), e1 = sd * (w1 - 1.15); trim.quad(pt(i, e0 - 0.09, 0.03), pt(i, e0 + 0.09, 0.03), pt(j, e1 + 0.09, 0.03), pt(j, e1 - 0.09, 0.03), undefined, white); }
      }
      if (fl & F_BOOST && far) trim.quad(pt(i, -w0 * 0.6, 0.04), pt(i, w0 * 0.6, 0.04), pt(j, w1 * 0.6, 0.04), pt(j, -w1 * 0.6, 0.04), undefined, boostC);
      else if (fl & F_BOOST) { const bw = Math.min(w0, w1) * 0.62; const v0 = i * DS / 8, v1 = j * DS / 8; boost.quad(pt(i, -bw, 0.04), pt(i, bw, 0.04), pt(j, bw, 0.04), pt(j, -bw, 0.04), [[0, v0], [1, v0], [1, v1], [0, v1]]); }
      if (!(fl & F_NOWALL)) {
        const hgt = 0.95, th2 = 0.4; const col = (Math.floor(i / 4) % 2 === 0) ? wallBase : wallLight;
        for (const sd of [-1, 1]) { const a0 = sd * w0, a1 = sd * w1, b0 = sd * (w0 + th2), b1 = sd * (w1 + th2);
          trim.quad(pt(i, a0), pt(j, a1), pt(j, a1, hgt), pt(i, a0, hgt), undefined, col); trim.quad(pt(i, a0, hgt), pt(j, a1, hgt), pt(j, b1, hgt), pt(i, b0, hgt), undefined, wallAcc);
          if (!trimOnlyEdges) trim.quad(pt(i, b0, hgt), pt(j, b1, hgt), pt(j, b1), pt(i, b0), undefined, wallDark); }
      }
      if (fl & F_TUNNEL) {
        const R = Math.max(w0, w1) + 1.6, Hh = 6.2; const seg = trimOnlyEdges ? 6 : 10;
        for (let k = 0; k < seg; k++) { const a0 = (k / seg) * Math.PI, a1 = ((k + 1) / seg) * Math.PI; const p = (idx: number, a: number) => pt(idx, Math.cos(a) * R, Math.sin(a) * Hh); tun.setHSL(0, 0, 0.16 + 0.03 * ((i + k) % 2)); trim.quad(p(i, a0), p(j, a0), p(j, a1), p(i, a1), undefined, tun.clone()); }
        if (Math.floor(i / 5) !== Math.floor(j / 5) || i % 5 === 0) trim.quad(pt(i, -1.2, Hh - 0.35), pt(i, 1.2, Hh - 0.35), pt(j, 1.2, Hh - 0.35), pt(j, -1.2, Hh - 0.35), undefined, tunLight);
      }
    }
    const grp = new THREE.Group();
    for (const [s, b] of Object.entries(roads)) if (b.count) grp.add(roadMesh(surfaceMaterial(+s, q), b.geometry(), false));
    if (trim.count) grp.add(roadMesh(trimMaterial(q), trim.geometry(), true));
    if (boost.count) { W.boostTex ??= canvasTex('boost', 128, 256, c => { c.fillStyle = '#0b0d10'; c.fillRect(0, 0, 128, 256); c.strokeStyle = '#F5F5F3'; c.lineWidth = 16; c.lineJoin = 'miter'; for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(14, 70 + k * 128); c.lineTo(64, 20 + k * 128); c.lineTo(114, 70 + k * 128); c.stroke(); } }, true, q.aniso);
      const bm = mat(`boost:${q.tier}`, () => q.tier === 0 ? new THREE.MeshBasicMaterial({ map: W.boostTex!, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ map: W.boostTex!, emissive: '#9FB4D6', emissiveMap: W.boostTex!, emissiveIntensity: 1.1, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide }));
      grp.add(roadMesh(bm, boost.geometry(), false)); }
    return grp;
  };
  for (let c = 0; c < nChunks; c++) {
    const i0 = c * CH, i1 = Math.min(n - 1, (c + 1) * CH);
    const g0 = genChunk(i0, i1, 1, false), g1 = genChunk(i0, i1, 2, true, true); g1.visible = false; W.group.add(g0, g1);
    let cx = 0, cy = 0, cz = 0, cnt = 0; for (let i = i0; i <= i1; i += 2) { cx += tr.px[i]; cy += tr.py[i]; cz += tr.pz[i]; cnt++; } cx /= cnt; cy /= cnt; cz /= cnt;
    let r = 0; for (let i = i0; i <= i1; i += 2) r = Math.max(r, Math.hypot(tr.px[i] - cx, tr.py[i] - cy, tr.pz[i] - cz)); r += tr.w[i0] * 0.5 + 9;
    W.chunks.push({ lod: [g0, g1], center: new THREE.Vector3(cx, cy, cz), radius: r, shown: 0 });
  }

  // ---------------------------------------------------------------- gates (3 draw calls each, shared materials, merged geometry)
  const postM = mat('gate:post', () => q.tier === 0 ? new THREE.MeshLambertMaterial({ color: '#2f343b' }) : new THREE.MeshStandardMaterial({ color: '#2f343b', roughness: 0.4, metalness: 0.8 }));
  const addGate = (i: number, kind: 'cp' | 'start' | 'finish', label: string) => {
    const g = new THREE.Group(); const w = tr.w[i] / 2 + 0.7; const H = 7;
    const frame = new THREE.BufferGeometry(); { const b = new Buf(); const box = (cx: number, cy: number, sx: number, sy: number) => { const x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = -0.3, z1 = 0.3;
        const f = (a: number[], bb: number[], c: number[], d: number[]) => b.quad(a, bb, c, d); f([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]); f([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]); f([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]); f([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]); f([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]); };
      box(-w, H / 2, 0.5, H); box(w, H / 2, 0.5, H); box(0, H, w * 2 + 0.6, 1.1); const gg = b.geometry(); frame.copy(gg); gg.dispose(); }
    g.add(new THREE.Mesh(own(frame), postM));
    const lab = canvasTex(`label:${label}`, 512, 96, c => { c.fillStyle = '#25282D'; c.fillRect(0, 0, 512, 96); if (kind === 'finish') { for (let x = 0; x < 512; x += 24) for (let y = 0; y < 96; y += 24) { c.fillStyle = ((x + y) / 24) % 2 ? '#F5F5F3' : '#25282D'; c.fillRect(x, y, 24, 24); } c.fillStyle = 'rgba(37,40,45,.85)'; c.fillRect(150, 18, 212, 60); }
      c.fillStyle = '#F5F5F3'; c.font = '600 54px Jost, "Barlow Condensed", Impact, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(label, 256, 52); }, false, 2);
    const signM = mat(`gate:label:${label}`, () => new THREE.MeshBasicMaterial({ map: lab })); const sw = Math.min(8, w * 1.6);
    const sg = own(new THREE.PlaneGeometry(sw, 1.0)); const s1 = new THREE.Mesh(sg, signM); s1.position.set(0, H, -0.31); const s2 = new THREE.Mesh(sg, signM); s2.position.set(0, H, 0.31); s2.rotation.y = Math.PI; g.add(s1, s2);
    const curtain = new THREE.Mesh(own(new THREE.PlaneGeometry(w * 2, H - 0.6)), mat('gate:pend', () => new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.22, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })));
    curtain.position.y = (H - 0.6) / 2; curtain.visible = kind === 'cp'; g.add(curtain);
    g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(tr.rx[i], tr.ry[i], tr.rz[i]), new THREE.Vector3(tr.ux[i], tr.uy[i], tr.uz[i]), new THREE.Vector3(-tr.tx[i], -tr.ty[i], -tr.tz[i]))); g.position.set(tr.px[i], tr.py[i], tr.pz[i]);
    W.group.add(g); if (kind === 'cp') W.gates.push({ mesh: g, idx: i, curtain });
  };
  addGate(2, 'start', 'START'); tr.cps.forEach((c, k) => addGate(c, 'cp', `CHECKPOINT ${k + 1}`)); addGate(tr.finish, 'finish', 'FINISH'); W.setCheckpointsPassed(0);
  { // start grid / finish line decals share one geometry pair
    const chk = canvasTex('checker', 64, 64, c => { for (let x = 0; x < 64; x += 16) for (let y = 0; y < 64; y += 16) { c.fillStyle = ((x + y) / 16) % 2 ? '#fff' : '#111'; c.fillRect(x, y, 16, 16); } }, true, 2);
    const cm = mat('checker', () => new THREE.MeshBasicMaterial({ map: chk, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, side: THREE.DoubleSide }));
    for (const i of [tr.finish, 2]) { const b = new Buf(); const w0 = tr.w[i] / 2 - 0.9; b.quad(pt(i, -w0, 0.05), pt(i, w0, 0.05), pt(i + 1, w0, 0.05), pt(i + 1, -w0, 0.05), [[0, 0], [w0 / 1.5, 0], [w0 / 1.5, 1], [0, 1]]); W.group.add(new THREE.Mesh(own(b.geometry()), cm)); }
  }
  tr.obstacles.forEach(o => { const m = new THREE.Mesh(own(new THREE.BoxGeometry(o.w * 2, 1.4, o.len * 2)), mat('obstacle', () => new THREE.MeshStandardMaterial({ color: '#B8545F', roughness: 0.5, metalness: 0.2, emissive: '#7a2f38', emissiveIntensity: 0.4 }))); m.castShadow = true; W.group.add(m); W.obstacles.push(m); const k = Math.floor(o.s / DS); m.rotation.y = Math.atan2(tr.tx[k], tr.tz[k]); });

  // ---------------------------------------------------------------- terrain (tiled, coarse far LOD)
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
  for (let i = 0; i < n; i++) { minX = Math.min(minX, tr.px[i]); maxX = Math.max(maxX, tr.px[i]); minZ = Math.min(minZ, tr.pz[i]); maxZ = Math.max(maxZ, tr.pz[i]); }
  const ground = tr.minY - 7; W.groundLevel = ground; const pad = env === 'alpine' ? 700 : 520; minX -= pad; maxX += pad; minZ -= pad; maxZ += pad;
  const cell = Math.max(22, Math.max(maxX - minX, maxZ - minZ) / 120); const gx = Math.ceil((maxX - minX) / cell) + 1, gz = Math.ceil((maxZ - minZ) / cell) + 1;
  const dist = new Float32Array(gx * gz).fill(1e9), roadY = new Float32Array(gx * gz); const R = 150; const rc = Math.ceil(R / cell);
  for (let i = 0; i < n; i += 3) { const cx = Math.round((tr.px[i] - minX) / cell), cz = Math.round((tr.pz[i] - minZ) / cell);
    for (let a = cx - rc; a <= cx + rc; a++) for (let b = cz - rc; b <= cz + rc; b++) { if (a < 0 || b < 0 || a >= gx || b >= gz) continue; const d = Math.hypot(minX + a * cell - tr.px[i], minZ + b * cell - tr.pz[i]); const k = a + b * gx; if (d < dist[k]) { dist[k] = d; roadY[k] = tr.py[i]; } } }
  const reliefAmp: Record<string, number> = { academy: 5, coastal: 9, desert: 14, alpine: 38, neon: 0, industrial: 1.5, forest: 16, sky: 0, formula: 3, hyper: 0, gauntlet: 22 }; const amp = reliefAmp[env] ?? 5;
  const nz = (x: number, z: number) => { const f = (a: number, b: number, s: number) => Math.sin(a * s + 1.7) * Math.cos(b * s * 1.3 + 0.4) + Math.sin((a + b) * s * 0.7 + 2.1) * 0.7; return f(x, z, 0.004) * 0.6 + f(x, z, 0.011) * 0.3 + f(x, z, 0.03) * 0.1; };
  const heightAt = (x: number, z: number, k: number): number => {
    const d = dist[k]; const t = Math.min(1, Math.max(0, (d - 20) / 110)); const ts = t * t * (3 - 2 * t); const corridor = Math.min(roadY[k] - 2.7, ground + 16);
    let far = ground + nz(x, z) * amp * (0.25 + 0.75 * ts) + (env === 'coastal' ? -3 : 0);
    if (env === 'alpine' || env === 'gauntlet') far += Math.max(0, d - 160) * 0.12 * (0.5 + 0.5 * Math.abs(nz(x * 0.6, z * 0.6)));
    if (env === 'desert') { const m = Math.abs(nz(x * 1.7, z * 1.7)); if (m > 0.8 && d > 100) far += 22; }
    return corridor + (far - corridor) * ts;
  };
  const gidx = (x: number, z: number) => Math.max(0, Math.min(gx - 1, Math.round((x - minX) / cell))) + Math.max(0, Math.min(gz - 1, Math.round((z - minZ) / cell))) * gx;
  W.terrainH = (x, z) => heightAt(x, z, gidx(x, z)); const distAt = (x: number, z: number) => dist[gidx(x, z)];
  W.hasTerrain = env !== 'sky' && q.terrain;
  if (W.hasTerrain) {
    const lo = new THREE.Color(style.ground[0]), hi = new THREE.Color(style.ground[1]); const rock = new THREE.Color(env === 'alpine' ? '#7d8794' : '#6b6258'); const cc = new THREE.Color();
    const H = new Float32Array(gx * gz); for (let b = 0; b < gz; b++) for (let a = 0; a < gx; a++) { const k = a + b * gx; H[k] = heightAt(minX + a * cell, minZ + b * cell, k); }
    const colorAt = (x: number, z: number, h: number) => { const t = Math.min(1, Math.max(0, (h - ground) / (amp * 1.2 + 4))); cc.copy(lo).lerp(hi, t * 0.9 + 0.1 * Math.abs(nz(x * 3, z * 3))); if (env === 'alpine' && h > ground + 14) cc.lerp(new THREE.Color('#ffffff'), Math.min(1, (h - ground - 14) / 14)); else if (h > ground + amp * 0.6 && (env === 'desert' || env === 'gauntlet' || env === 'alpine')) cc.lerp(rock, 0.4); return cc; };
    const TS = 24; const tmat = mat(`terrain:${q.tier}`, () => q.tier === 0 ? new THREE.MeshLambertMaterial({ vertexColors: true }) : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
    const tile = (a0: number, b0: number, step: number) => { const bf = new Buf(); const a1 = Math.min(gx - 1, a0 + TS), b1 = Math.min(gz - 1, b0 + TS);
      for (let b = b0; b < b1; b += step) for (let a = a0; a < a1; a += step) { const aa = Math.min(a + step, a1), bb = Math.min(b + step, b1); const P = (A: number, B: number) => [minX + A * cell, H[A + B * gx], minZ + B * cell];
        const p00 = P(a, b), p10 = P(aa, b), p11 = P(aa, bb), p01 = P(a, bb); const hc = (p00[1] + p10[1] + p11[1] + p01[1]) / 4; const col = colorAt(p00[0], p00[2], hc).clone(); bf.tri(p00, p01, p10, [0, 0], [0, 0], [0, 0], col); bf.tri(p10, p01, p11, [0, 0], [0, 0], [0, 0], col); }
      const g = bf.geometry(); const m = new THREE.Mesh(own(g), tmat); m.receiveShadow = true; return m; };
    for (let b0 = 0; b0 < gz - 1; b0 += TS) for (let a0 = 0; a0 < gx - 1; a0 += TS) {
      const m0 = tile(a0, b0, q.terrainStep), m1 = tile(a0, b0, Math.max(3, q.terrainStep * 3)); m1.visible = false; W.group.add(m0, m1);
      const cxw = minX + (a0 + TS / 2) * cell, czw = minZ + (b0 + TS / 2) * cell; W.tiles.push({ lod: [m0, m1], center: new THREE.Vector3(cxw, ground + 6, czw), radius: TS * cell * 0.75 + 40, shown: 0 });
    }
  }
  if (style.water) { const wm = new THREE.Mesh(own(new THREE.PlaneGeometry(9000, 9000)), mat(`water:${q.tier}`, () => q.tier === 0 ? new THREE.MeshLambertMaterial({ color: style.water!, transparent: true, opacity: 0.9 }) : new THREE.MeshPhysicalMaterial({ color: style.water!, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.9, clearcoat: 1 }))); wm.rotation.x = -Math.PI / 2; wm.position.set((minX + maxX) / 2, ground + 1.5, (minZ + maxZ) / 2); W.group.add(wm); W.water = wm; }
  if (env === 'sky') { const cg = mat('cloudgeo', () => new THREE.MeshLambertMaterial({ color: '#ffffff', emissive: '#cfe6ff', emissiveIntensity: 0.25 })); const geo = own(new THREE.IcosahedronGeometry(1, 1)); const inst = new THREE.InstancedMesh(geo, cg, 160); const m4 = new THREE.Matrix4();
    for (let i = 0; i < 160; i++) { const s = rng.range(25, 70); m4.compose(new THREE.Vector3(rng.range(minX, maxX), ground - rng.range(10, 70), rng.range(minZ, maxZ)), new THREE.Quaternion(), new THREE.Vector3(s * 1.6, s * 0.45, s)); inst.setMatrixAt(i, m4); } inst.frustumCulled = false; W.group.add(inst); }

  // ---------------------------------------------------------------- instanced scenery in spatial cells
  buildProps(W, env, tr, rng, W.terrainH, distAt, ground, style.sky[1], own);
  return W;
}

// ====================================================================================================== props
function mergeColored(parts: { g: THREE.BufferGeometry; c: string; m?: THREE.Matrix4 }[]): THREE.BufferGeometry {
  const pos: number[] = [], nor: number[] = [], col: number[] = []; const c = new THREE.Color();
  for (const { g, c: cc, m } of parts) { const ng = g.index ? g.toNonIndexed() : g.clone(); if (m) ng.applyMatrix4(m); ng.computeVertexNormals(); const p = ng.getAttribute('position'), n = ng.getAttribute('normal'); c.set(cc);
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); col.push(c.r, c.g, c.b); } ng.dispose(); }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); out.computeBoundingSphere(); return out;
}
const T = (x: number, y: number, z: number) => new THREE.Matrix4().makeTranslation(x, y, z);
const protoCache = new Map<string, THREE.BufferGeometry[]>();
/** Shared prop geometries [lod0, lod1]; built once per page load. Kit props come from the supplied GLB, the rest are procedural. */
function proto(name: string, tier = 2): THREE.BufferGeometry[] {
  const ck = `${name}:${tier}`; const hit = protoCache.get(ck); if (hit) return hit;
  const cone = (r: number, h: number, seg = 7) => new THREE.ConeGeometry(r, h, seg), cyl = (r1: number, r2: number, h: number, seg = 7) => new THREE.CylinderGeometry(r1, r2, h, seg), ico = (r: number, d = 1) => new THREE.IcosahedronGeometry(r, d), box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
  const rockG = ico(1, 1); { const p = rockG.getAttribute('position'); for (let i = 0; i < p.count; i++) { const k = 1 + 0.25 * Math.sin(p.getX(i) * 5.1 + p.getY(i) * 3.3) * Math.cos(p.getZ(i) * 4.2); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.75, p.getZ(i) * k); } }
  const kitName = name.startsWith('kit:') ? name.slice(4).split('#') : null;
  let out: THREE.BufferGeometry[];
  if (kitName) { const a = kitGeo(kitName[0], +(kitName[1] ?? 0), tier >= 2 ? 0 : 1), b = kitGeo(kitName[0], +(kitName[1] ?? 0), 2) ?? a; out = a ? [a, b!] : []; }
  else {
    const P: Record<string, () => THREE.BufferGeometry[]> = {
      pine: () => [mergeColored([{ g: cyl(0.25, 0.35, 2), c: '#5a3c26', m: T(0, 1, 0) }, { g: cone(2.2, 3.4), c: '#2f6b3a', m: T(0, 3.2, 0) }, { g: cone(1.7, 3), c: '#378045', m: T(0, 5, 0) }, { g: cone(1.1, 2.6), c: '#3f9150', m: T(0, 6.8, 0) }]), mergeColored([{ g: cone(2.2, 7.5, 5), c: '#378045', m: T(0, 4.4, 0) }])],
      pineSnow: () => [mergeColored([{ g: cyl(0.25, 0.35, 2), c: '#4a3626', m: T(0, 1, 0) }, { g: cone(2.2, 3.4), c: '#dfe9f0', m: T(0, 3.2, 0) }, { g: cone(1.7, 3), c: '#eef4f8', m: T(0, 5, 0) }, { g: cone(1.1, 2.6), c: '#ffffff', m: T(0, 6.8, 0) }]), mergeColored([{ g: cone(2.2, 7.5, 5), c: '#e9f0f5', m: T(0, 4.4, 0) }])],
      palm: () => [mergeColored([{ g: cyl(0.2, 0.3, 6, 6), c: '#8a6a45', m: T(0, 3, 0) }, ...[0, 1, 2, 3, 4, 5].map(i => ({ g: cone(0.5, 3.2, 4), c: '#3d9a4a', m: new THREE.Matrix4().makeRotationZ(1.2).premultiply(new THREE.Matrix4().makeRotationY((i / 6) * Math.PI * 2)).premultiply(T(0, 6, 0)) }))]), mergeColored([{ g: cyl(0.25, 0.3, 6, 4), c: '#8a6a45', m: T(0, 3, 0) }, { g: cone(2, 1.5, 5), c: '#3d9a4a', m: T(0, 6.3, 0) }])],
      cactus: () => [mergeColored([{ g: cyl(0.4, 0.4, 4, 7), c: '#5c8a4a', m: T(0, 2, 0) }, { g: cyl(0.25, 0.25, 1.6, 6), c: '#5c8a4a', m: T(0.8, 2.6, 0) }, { g: cyl(0.25, 0.25, 1.2, 6), c: '#5c8a4a', m: T(-0.8, 1.9, 0) }]), mergeColored([{ g: cyl(0.4, 0.4, 4, 5), c: '#5c8a4a', m: T(0, 2, 0) }])],
      rock: () => [mergeColored([{ g: rockG, c: '#7a7468' }]), mergeColored([{ g: ico(1, 0), c: '#7a7468' }])], rockSnow: () => [mergeColored([{ g: rockG, c: '#9aa4b0' }, { g: ico(0.7, 1), c: '#ffffff', m: T(0, 0.55, 0) }]), mergeColored([{ g: ico(1, 0), c: '#aab3bd' }])],
      mesa: () => [mergeColored([{ g: cyl(6, 8, 18, 9), c: '#b5703b', m: T(0, 9, 0) }, { g: cyl(6.1, 6.2, 3, 9), c: '#d49a5a', m: T(0, 16, 0) }, { g: cyl(6.3, 6.6, 2.5, 9), c: '#8f4f2a', m: T(0, 6, 0) }]), mergeColored([{ g: cyl(6, 8, 18, 6), c: '#b5703b', m: T(0, 9, 0) }])],
      mountain: () => [mergeColored([{ g: cone(60, 80, 8), c: '#6f7886', m: T(0, 40, 0) }, { g: cone(24, 32, 8), c: '#ffffff', m: T(0, 66, 0) }]), mergeColored([{ g: cone(60, 80, 5), c: '#8a93a0', m: T(0, 40, 0) }])],
      spire: () => [mergeColored([{ g: cone(5, 40, 5), c: '#2a1d1a', m: T(0, 20, 0) }, { g: cone(1.4, 8, 5), c: '#B8545F', m: T(0, 38, 0) }]), mergeColored([{ g: cone(5, 40, 4), c: '#2a1d1a', m: T(0, 20, 0) }])],
      container: () => [box(2.4, 2.6, 6)], tank: () => [mergeColored([{ g: cyl(4, 4, 8, 14), c: '#b8bec6', m: T(0, 4, 0) }, { g: cyl(4.1, 4.1, 0.4, 14), c: '#7b828a', m: T(0, 8, 0) }]), mergeColored([{ g: cyl(4, 4, 8, 7), c: '#b8bec6', m: T(0, 4, 0) }])],
      stack: () => [mergeColored([{ g: cyl(2, 2.8, 36, 10), c: '#9a8f86', m: T(0, 18, 0) }, { g: cyl(2.1, 2.1, 3, 10), c: '#B8545F', m: T(0, 32, 0) }]), mergeColored([{ g: cyl(2, 2.8, 36, 5), c: '#9a8f86', m: T(0, 18, 0) }])],
      lamp: () => [mergeColored([{ g: cyl(0.12, 0.16, 8, 6), c: '#3a3f47', m: T(0, 4, 0) }, { g: box(1.6, 0.2, 0.4), c: '#ffffff', m: T(0.7, 8, 0) }]), mergeColored([{ g: cyl(0.14, 0.14, 8, 3), c: '#3a3f47', m: T(0, 4, 0) }])],
      pylon: () => [mergeColored([{ g: box(2.2, 60, 2.2), c: '#10243a', m: T(0, 30, 0) }, { g: box(2.4, 60, 0.4), c: '#9FB4D6', m: T(0, 30, 1.2) }]), mergeColored([{ g: box(2.2, 60, 2.2), c: '#10243a', m: T(0, 30, 0) }])],
      billboard: () => [mergeColored([{ g: cyl(0.3, 0.3, 14, 6), c: '#2a2d36', m: T(0, 7, 0) }, { g: box(12, 5, 0.4), c: '#9A6FC4', m: T(0, 15, 0) }])],
      island: () => [mergeColored([{ g: cone(14, 22, 8).rotateX(Math.PI), c: '#7c6a58', m: T(0, 0, 0) }, { g: cyl(14, 14, 2.5, 8), c: '#6fa37f', m: T(0, 11.2, 0) }]), mergeColored([{ g: cone(14, 22, 5).rotateX(Math.PI), c: '#7c6a58' }])],
      building: () => [box(1, 1, 1)],
    };
    out = P[name]?.() ?? [];
  }
  protoCache.set(ck, out); return out;
}

function buildProps(W: World, env: string, tr: Track, rng: Rng, hAt: (x: number, z: number) => number, distAt: (x: number, z: number) => number, ground: number, haze: string, own: <T extends { dispose(): void }>(o: T) => T) {
  const q = W.q; const n = tr.n; const night = env === 'neon' || env === 'hyper'; void haze;
  const stdMat = mat(`prop:${q.tier}`, () => q.tier === 0 ? new THREE.MeshLambertMaterial({ vertexColors: true }) : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true }));
  const winTex = canvasTex('windows', 128, 256, c => { c.fillStyle = '#10131a'; c.fillRect(0, 0, 128, 256); const r = new Rng(5); for (let yy = 4; yy < 252; yy += 10) for (let xx = 4; xx < 124; xx += 10) if (r.chance(0.55)) { c.fillStyle = r.chance(0.5) ? '#ffe9a8' : r.chance(0.5) ? '#cfe3ff' : '#f3d9ff'; c.fillRect(xx, yy, 6, 6); } }, true, 2);
  const bMat = mat(`bld:${night}:${q.tier}`, () => q.tier === 0 ? new THREE.MeshLambertMaterial({ map: winTex, emissive: '#ffffff', emissiveMap: winTex, emissiveIntensity: night ? 1.2 : 0.12, color: night ? '#555' : '#9aa4b0' }) : new THREE.MeshStandardMaterial({ map: winTex, emissiveMap: winTex, emissive: '#ffffff', emissiveIntensity: night ? 1.3 : 0.15, color: night ? '#444' : '#9aa4b0', roughness: 0.6, metalness: 0.2 }));
  const useKit = kitLoaded();
  interface Spec { geo: string; count: number; min: number; max: number; scale: [number, number]; minDist?: number; tint?: boolean; mat?: THREE.Material; shapes?: number; edge?: boolean }
  const kt = (c: string) => (useKit && kitCount(c) ? `kit:${c}` : '');
  const specs: Spec[] = [];
  const add = (s: Spec) => { if (s.geo) specs.push(s); };
  switch (env) {
    case 'academy': add({ geo: kt('tree') || 'pine', count: 150, min: 14, max: 130, scale: [0.8, 1.5], shapes: 4 }); add({ geo: kt('bush'), count: 110, min: 10, max: 60, scale: [0.9, 1.5], shapes: 2 }); add({ geo: kt('stone'), count: 30, min: 14, max: 90, scale: [0.9, 2], shapes: 3 }); add({ geo: kt('tyres'), count: 60, min: 7.6, max: 9, scale: [1.2, 1.2], edge: true }); add({ geo: kt('flowers'), count: 30, min: 9, max: 24, scale: [1, 1.4] }); break;
    case 'coastal': add({ geo: 'palm', count: 110, min: 12, max: 90, scale: [0.9, 1.6] }); add({ geo: 'rock', count: 90, min: 14, max: 160, scale: [1.5, 6] }); add({ geo: kt('lamp') || 'lamp', count: 40, min: 8, max: 9, scale: [1, 1], edge: true }); add({ geo: kt('bush'), count: 60, min: 10, max: 50, scale: [0.9, 1.4], shapes: 2 }); break;
    case 'desert': add({ geo: 'cactus', count: 160, min: 14, max: 130, scale: [0.8, 1.8] }); add({ geo: 'rock', count: 90, min: 14, max: 200, scale: [1.5, 7] }); add({ geo: kt('stone'), count: 50, min: 14, max: 120, scale: [1.2, 3], shapes: 3 }); add({ geo: 'mesa', count: 36, min: 90, max: 420, scale: [1.5, 5] }); break;
    case 'alpine': add({ geo: 'pineSnow', count: 380, min: 12, max: 220, scale: [0.8, 1.8] }); add({ geo: 'rockSnow', count: 90, min: 14, max: 200, scale: [1.5, 7] }); add({ geo: 'mountain', count: 26, min: 330, max: 700, scale: [1.2, 3.2], minDist: 280 }); add({ geo: kt('fence'), count: 40, min: 8, max: 9.5, scale: [1.6, 1.6], edge: true }); break;
    case 'neon': add({ geo: 'building', count: 320, min: 28, max: 330, scale: [1, 1], mat: bMat }); add({ geo: kt('lamp') || 'lamp', count: 70, min: 8, max: 9, scale: [1, 1], edge: true }); add({ geo: 'billboard', count: 30, min: 20, max: 70, scale: [0.9, 1.4] }); add({ geo: kt('tower'), count: 12, min: 40, max: 160, scale: [2.5, 4], shapes: 2 }); break;
    case 'industrial': add({ geo: 'container', count: 220, min: 16, max: 120, scale: [1, 1.1], tint: true }); add({ geo: 'tank', count: 24, min: 30, max: 160, scale: [1, 2] }); add({ geo: 'stack', count: 14, min: 80, max: 300, scale: [1, 1.5] }); add({ geo: 'building', count: 70, min: 40, max: 260, scale: [1, 1], mat: bMat }); add({ geo: kt('lamp') || 'lamp', count: 50, min: 8, max: 9, scale: [1, 1], edge: true }); add({ geo: kt('tower'), count: 14, min: 40, max: 200, scale: [2, 3.6], shapes: 2 }); add({ geo: kt('tyrestack'), count: 60, min: 8, max: 10, scale: [1.3, 1.3], edge: true }); add({ geo: kt('garages'), count: 8, min: 30, max: 90, scale: [1.4, 1.8] }); break;
    case 'forest': add({ geo: 'pine', count: 380, min: 10, max: 150, scale: [0.9, 2] }); add({ geo: kt('tree') || 'pine', count: 300, min: 10, max: 150, scale: [0.9, 1.9], shapes: 4 }); add({ geo: kt('stone'), count: 70, min: 12, max: 100, scale: [1.2, 3.4], shapes: 3 }); add({ geo: kt('bush'), count: 140, min: 9, max: 50, scale: [0.9, 1.6], shapes: 2 }); add({ geo: kt('flowers'), count: 40, min: 9, max: 30, scale: [1, 1.5] }); break;
    case 'sky': add({ geo: 'island', count: 30, min: 40, max: 420, scale: [0.8, 2.5] }); break;
    case 'formula': add({ geo: kt('tribune') || '', count: 8, min: 22, max: 40, scale: [2.6, 3.2] }); add({ geo: kt('tyres'), count: 140, min: 7.6, max: 9, scale: [1.2, 1.2], edge: true }); add({ geo: kt('tyrestack'), count: 40, min: 8, max: 10, scale: [1.3, 1.3], edge: true }); add({ geo: kt('tree') || 'pine', count: 120, min: 40, max: 200, scale: [1, 1.7], shapes: 4 }); add({ geo: kt('lamp') || 'lamp', count: 40, min: 8, max: 9, scale: [1, 1], edge: true }); add({ geo: kt('barrier'), count: 36, min: 8, max: 9, scale: [1.6, 1.6], edge: true }); break;
    case 'hyper': add({ geo: 'pylon', count: 90, min: 14, max: 160, scale: [0.8, 1.6] }); add({ geo: 'building', count: 120, min: 60, max: 340, scale: [1, 1], mat: bMat }); break;
    case 'gauntlet': add({ geo: 'spire', count: 130, min: 18, max: 240, scale: [0.7, 2.2] }); add({ geo: 'rock', count: 90, min: 12, max: 120, scale: [1.5, 6] }); add({ geo: kt('tyrestack'), count: 30, min: 8, max: 10, scale: [1.3, 1.3], edge: true }); break;
  }
  // start / finish dressing from the kit: grandstand, garages, house, flags
  if (useKit && env !== 'sky') {
    const mk = (cat: string, count: number, sc: number, i0: number, off: number, span: number) => { for (let k = 0; k < count; k++) { const i = Math.min(n - 3, i0 + Math.round(span * (k / Math.max(1, count - 1)))); const side = k % 2 ? 1 : -1; dec.push({ geo: `kit:${cat}`, i, side, off, sc }); } };
    const dec: { geo: string; i: number; side: number; off: number; sc: number }[] = [];
    if (kitCount('tribune')) mk('tribune', 2, 2.8, 6, tr.w[6] / 2 + 12, 30);
    if (kitCount('garages')) mk('garages', 2, 1.6, 12, tr.w[12] / 2 + 28, 20);
    if (kitCount('house') && env !== 'formula') mk('house', 1, 2, 20, tr.w[20] / 2 + 38, 1);
    for (const sd of [-1, 1]) if (kitCount('flag')) { dec.push({ geo: 'kit:flag', i: 4, side: sd, off: tr.w[4] / 2 + 1.6, sc: 2.2 }, { geo: 'kit:flag', i: tr.finish, side: sd, off: tr.w[tr.finish] / 2 + 1.6, sc: 2.2 }); }
    W_decor.push(...dec);
  }

  // ---- place instances, bucket per 180 m cell
  const CELL = 320; const buckets = new Map<string, { geo: string; mat: THREE.Material; mats: THREE.Matrix4[]; colors: THREE.Color[] | null; x: number; z: number; y: number }>();
  const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), col = new THREE.Color();
  const put = (geo: string, mt: THREE.Material, x: number, y: number, z: number, m: THREE.Matrix4, tint: boolean) => {
    const key = `${Math.floor(x / CELL)},${Math.floor(z / CELL)}|${geo}`; let b = buckets.get(key);
    if (!b) { b = { geo, mat: mt, mats: [], colors: tint ? [] : null, x: 0, y: 0, z: 0 }; buckets.set(key, b); }
    b.mats.push(m.clone()); b.x += x; b.y += y; b.z += z; if (tint) { col.setHSL(rng.pick([0.02, 0.08, 0.58, 0.35, 0.6, 0.12]), 0.35, 0.55); b.colors!.push(col.clone()); }
  };
  for (const sp of specs) {
    const names = sp.shapes && sp.geo.startsWith('kit:') ? Array.from({ length: sp.shapes }, (_, k) => `${sp.geo}#${k}`) : [sp.geo];
    const mt = sp.mat ?? stdMat; const cnt = Math.round(sp.count * q.propDensity * (1 + tr.length / 5000)); let placed = 0;
    for (let a = 0; a < cnt * 5 && placed < cnt; a++) {
      const i = Math.floor(rng.next() * (n - 8)) + 4; const side = rng.chance(0.5) ? 1 : -1; const geoName = names[Math.floor(rng.next() * names.length)];
      const base = sp.edge ? tr.w[i] / 2 + (sp.min + (sp.max - sp.min) * rng.next()) : tr.w[i] / 2 + rng.range(sp.min, sp.max);
      const x = tr.px[i] + tr.rx[i] * side * base + (sp.edge ? 0 : rng.range(-8, 8)), z = tr.pz[i] + tr.rz[i] * side * base + (sp.edge ? 0 : rng.range(-8, 8));
      if (sp.edge) { if (W.hasTerrain === false && env === 'sky') continue; const ey = tr.py[i] + tr.ry[i] * side * base; const tf = Math.atan2(tr.tx[i], tr.tz[i]); if (sp.geo.includes('tyre') && !(Math.abs(tr.kh[i]) > 0.004)) continue; qt.setFromAxisAngle(up, tf + (sp.geo.includes('lamp') && side < 0 ? Math.PI : 0)); const s = rng.range(sp.scale[0], sp.scale[1]); sc.set(s, s, s); ps.set(x, ey, z); m4.compose(ps, qt, sc); put(geoName, mt, x, ey, z, m4, false); placed++; continue; }
      if (env !== 'sky' && distAt(x, z) < Math.max(sp.min * 0.8, sp.minDist ?? 0)) continue;
      let y = hAt(x, z); if (env === 'sky') { y = ground - 15 - rng.range(0, 60); if (Math.abs(tr.py[i] - y) < 20) continue; }
      if (W.water && y < ground + 1.8) continue;
      const s = rng.range(sp.scale[0], sp.scale[1]); qt.setFromAxisAngle(up, rng.range(0, 6.28));
      if (sp.geo === 'building') { const h = rng.range(25, env === 'hyper' ? 150 : 110) * (0.6 + 0.4 * Math.max(0, 1 - distAt(x, z) / 300)); const w = rng.range(12, 30); sc.set(w, h, w * rng.range(0.7, 1.3)); ps.set(x, y + h / 2, z); }
      else if (sp.geo === 'container') { sc.set(s, s, s); ps.set(x, y + 1.3 * s, z); qt.setFromAxisAngle(up, Math.atan2(tr.tx[i], tr.tz[i]) + (rng.chance(0.5) ? 0 : Math.PI / 2)); }
      else { sc.set(s, s, s); ps.set(x, y - 0.1, z); }
      m4.compose(ps, qt, sc); put(geoName, mt, x, y, z, m4, !!sp.tint); placed++;
    }
  }
  for (const d of W_decor.splice(0)) { const i = d.i; const x = tr.px[i] + tr.rx[i] * d.side * d.off, z = tr.pz[i] + tr.rz[i] * d.side * d.off; const y = tr.py[i] + tr.ry[i] * d.side * d.off - (d.geo.includes('flag') ? 0 : 0.4); qt.setFromAxisAngle(up, Math.atan2(tr.tx[i], tr.tz[i]) + (d.side > 0 ? -Math.PI / 2 : Math.PI / 2)); sc.set(d.sc, d.sc, d.sc); ps.set(x, y, z); m4.compose(ps, qt, sc); put(d.geo, stdMat, x, y, z, m4, false); }

  const rad = new THREE.Sphere();
  for (const b of buckets.values()) {
    const protos = proto(b.geo, q.far >= 1500 ? 2 : 1); if (!protos.length) continue; const count = b.mats.length; const lods: THREE.InstancedMesh[] = [];
    const first = new THREE.InstancedMesh(protos[0], b.mat, count); b.mats.forEach((m, k) => first.setMatrixAt(k, m)); if (b.colors) b.colors.forEach((c, k) => first.setColorAt(k, c)); first.instanceMatrix.needsUpdate = true; first.computeBoundingSphere(); first.castShadow = q.tier > 0 || true; first.receiveShadow = true; lods.push(first); W.group.add(first);
    if (protos[1]) { const second = new THREE.InstancedMesh(protos[1], b.mat, count); second.instanceMatrix = first.instanceMatrix; if (first.instanceColor) second.instanceColor = first.instanceColor; second.count = count; second.computeBoundingSphere(); second.castShadow = false; second.visible = false; lods.push(second); W.group.add(second); }
    own(first); rad.copy(first.boundingSphere!); const pr = protos[0].boundingSphere ?? (protos[0].computeBoundingSphere(), protos[0].boundingSphere!); const avgS = Math.cbrt(Math.abs(b.mats[0].determinant())); W.cells.push({ lod: lods, center: rad.center.clone(), radius: rad.radius, shown: 0, cutoff: Math.min(q.propFar, 120 + 85 * pr.radius * avgS) });
  }
}
const W_decor: { geo: string; i: number; side: number; off: number; sc: number }[] = [];
