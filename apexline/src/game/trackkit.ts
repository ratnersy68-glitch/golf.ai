import * as THREE from 'three';

/**
 * Runtime side of the imported low-poly race-track kit (public/models/track_kit.json, produced by tools/import-track-assets.ts from the supplied GLB).
 * The source atlas texture was missing from the supplied file, so props are coloured here from the white-marble palette by height band / face normal.
 */
interface KitLod { q: string; i: string; s: number[]; tris: number }
interface KitShape { ext: number[]; lods: KitLod[]; srcTris: number }
interface KitJson { version: number; unit: number; props: Record<string, KitShape[]>; missing: string[] }

let kit: KitJson | null = null; let loading: Promise<KitJson | null> | null = null;
const geoCache = new Map<string, THREE.BufferGeometry>();

export function loadTrackKit(): Promise<KitJson | null> {
  if (kit) return Promise.resolve(kit);
  loading ??= (async () => {
    try {
      const emb = (window as any).__APEX_TRACKKIT as KitJson | undefined;
      if (emb) kit = emb; else { const r = await fetch(`${import.meta.env.BASE_URL}models/track_kit.json`); if (!r.ok) throw new Error('missing'); kit = await r.json(); }
    } catch { kit = null; }
    return kit;
  })();
  return loading;
}
export const kitLoaded = () => !!kit;
export const kitCount = (cat: string) => kit?.props[cat]?.length ?? 0;
export const kitExtent = (cat: string, shape = 0) => kit?.props[cat]?.[shape]?.ext ?? [1, 1, 1];

const un64 = (s: string) => { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; };
const C = (h: string) => new THREE.Color(h);
type Painter = (yN: number, ny: number, x: number, z: number, shape: number) => THREE.Color;
const P: Record<string, Painter> = {
  tree: (y, _n, _x, _z, s) => y < 0.3 ? C('#8B7355') : C(['#6F9A6C', '#7FAE78', '#5F8F63', '#86B07F'][s % 4]),
  bush: () => C('#7FA87A'), stone: () => C('#B1B5BB'), flowers: (y) => y < 0.45 ? C('#7FA87A') : C('#EAD8D3'),
  fence: (y) => y > 0.75 ? C('#25282D') : C('#F5F5F3'), barrier: (y) => (Math.floor(y * 6) % 2 ? C('#F5F5F3') : C('#B8545F')),
  tyres: (y, n) => y > 0.85 && n > 0.5 ? C('#F5F5F3') : C('#34373D'), tyrestack: (y, n) => y > 0.85 && n > 0.5 ? C('#F5F5F3') : C('#34373D'), tyrewall: (y, n) => y > 0.8 && n > 0.5 ? C('#E8EAED') : C('#34373D'), bigwheel: () => C('#2B2E33'),
  tribune: (y, n) => y > 0.78 ? C('#25282D') : y > 0.3 && y < 0.6 && n < 0.6 ? C('#B8BDC4') : C('#F0F1F3'),
  tower: (y) => y > 0.78 ? C('#25282D') : C('#F5F5F3'), house: (y, n) => y > 0.52 && n > 0.2 && n < 0.99 ? C('#B8545F') : C('#F5F5F3'),
  garages: (y, n) => y > 0.85 ? C('#25282D') : n < 0.2 ? C('#B8BDC4') : C('#EDEEF0'), flag: (_y, _n, x, z) => (Math.floor(x * 5) + Math.floor(z * 5)) % 2 ? C('#F5F5F3') : C('#25282D'),
  finishboard: (y, _n, x) => y > 0.82 || y < 0.12 || Math.abs(x) > 0.46 ? C('#F5F5F3') : C('#25282D'), lamp: (y) => y > 0.95 ? C('#FFFFFF') : C('#B8BDC4'), bridge: () => C('#E8EAED'), uturn: () => C('#6B717A'),
};

/** Geometry for kit prop `cat`, variant `shape`, level of detail `lod` (flat-shaded, vertex-coloured, y=0 base). */
export function kitGeo(cat: string, shape = 0, lod = 0): THREE.BufferGeometry | null {
  if (!kit) return null; const shapes = kit.props[cat]; if (!shapes?.length) return null; const sh = shapes[shape % shapes.length]; const L = sh.lods[Math.min(lod, sh.lods.length - 1)];
  const key = `${cat}:${shape % shapes.length}:${Math.min(lod, sh.lods.length - 1)}`; const hit = geoCache.get(key); if (hit) return hit;
  const q = new Int16Array(un64(L.q)); const idx = new Uint16Array(un64(L.i)); const p = new Float32Array(q.length);
  for (let k = 0; k < q.length; k++) p[k] = q[k] * L.s[k % 3];
  const H = Math.max(1e-3, sh.ext[1]); const paint = P[cat] ?? (() => C('#D8DCE0'));
  const pos = new Float32Array(idx.length * 3), nor = new Float32Array(idx.length * 3), col = new Float32Array(idx.length * 3);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  for (let t = 0; t < idx.length; t += 3) {
    a.fromArray(p, idx[t] * 3); b.fromArray(p, idx[t + 1] * 3); c.fromArray(p, idx[t + 2] * 3);
    n.crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize(); const cy = (a.y + b.y + c.y) / 3 / H; const cx = (a.x + b.x + c.x) / 3 / (sh.ext[0] || 1), cz = (a.z + b.z + c.z) / 3 / (sh.ext[2] || 1);
    const colr = paint(cy, n.y, cx, cz, shape);
    for (let k = 0; k < 3; k++) { const v = k === 0 ? a : k === 1 ? b : c; const o = (t + k) * 3; pos[o] = v.x; pos[o + 1] = v.y; pos[o + 2] = v.z; nor[o] = n.x; nor[o + 1] = n.y; nor[o + 2] = n.z; col[o] = colr.r; col[o + 1] = colr.g; col[o + 2] = colr.b; }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeBoundingSphere();
  geoCache.set(key, g); return g;
}
