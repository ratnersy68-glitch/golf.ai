import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Vehicle kit extracted from the supplied apexline_base_car.glb (open-wheel low-poly racer, Z-up in the file, nose toward +Y).
 * The GLB node matrices convert it to three.js axes: +X right, +Y up, -Z forward. Every vehicle in the game is assembled from these
 * parts (wheels, suspension, wings, end plates, sidepod / body / cockpit section data) with per-vehicle proportions.
 */
export interface Section { z: number; hwB: number; yB: number; hwT: number; yT: number }
export interface Kit {
  geo: Record<string, THREE.BufferGeometry>; // by GLB mesh name, in car space (y up, -z forward), flat-shaded
  body: Section[]; cockpit: Section[]; pod: { x0: number; x1: number; z0: number; z1: number; y0: number; y1: number };
  wheelF: { x: number; y: number; z: number; r: number; w: number }; wheelR: { x: number; y: number; z: number; r: number; w: number };
  frontWing: { z: number; y: number; span: number; chord: number; th: number }; rearWing: { z: number; y: number; span: number; chord: number; th: number };
  source: 'glb' | 'fallback';
}

// Measured from the supplied GLB (used if the file cannot be parsed, so the game still runs).
const FALLBACK: Omit<Kit, 'geo'> = {
  body: [{ z: -1.65, hwB: 0.26, yB: 0.27, hwT: 0.2, yT: 0.43 }, { z: -0.45, hwB: 0.54, yB: 0.28, hwT: 0.32, yT: 0.69 }, { z: 0.65, hwB: 0.71, yB: 0.3, hwT: 0.52, yT: 0.83 }, { z: 1.65, hwB: 0.63, yB: 0.32, hwT: 0.52, yT: 0.62 }],
  cockpit: [{ z: -0.35, hwB: 0.29, yB: 0.61, hwT: 0.21, yT: 0.8 }, { z: 0.3, hwB: 0.41, yB: 0.72, hwT: 0.28, yT: 1.14 }, { z: 0.75, hwB: 0.39, yB: 0.68, hwT: 0.29, yT: 1.02 }],
  pod: { x0: 0.47, x1: 0.83, z0: -0.225, z1: 0.925, y0: 0.345, y1: 0.615 },
  wheelF: { x: 0.91, y: 0.35, z: -1.12, r: 0.35, w: 0.3 }, wheelR: { x: 0.91, y: 0.39, z: 1.12, r: 0.39, w: 0.36 },
  frontWing: { z: -1.57, y: 0.25, span: 1.5, chord: 0.37, th: 0.1 }, rearWing: { z: 1.52, y: 0.99, span: 1.55, chord: 0.36, th: 0.12 }, source: 'fallback',
};

export let KIT: Kit | null = null;
export function kitReady(): boolean { return !!KIT; }

function flat(g: THREE.BufferGeometry): THREE.BufferGeometry { const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute('color'); n.computeVertexNormals(); return n; }

function sectionsOf(g: THREE.BufferGeometry): Section[] {
  const p = g.getAttribute('position'); const by = new Map<number, { x: number; y: number }[]>();
  for (let i = 0; i < p.count; i++) { const z = Math.round(p.getZ(i) * 1000) / 1000; (by.get(z) ?? by.set(z, []).get(z)!).push({ x: Math.abs(p.getX(i)), y: p.getY(i) }); }
  return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([z, v]) => { const ys = v.map(q => q.y); const lo = Math.min(...ys), hi = Math.max(...ys); const bot = v.filter(q => q.y - lo < 0.01), top = v.filter(q => hi - q.y < 0.01);
    return { z, yB: lo, yT: hi, hwB: Math.max(...bot.map(q => q.x)), hwT: Math.max(...top.map(q => q.x)) }; });
}

export function parseKit(buf: ArrayBuffer): Promise<Kit> {
  return new Promise((resolve, reject) => {
    new GLTFLoader().parse(buf, '', gltf => {
      try {
        gltf.scene.updateMatrixWorld(true);
        const geo: Record<string, THREE.BufferGeometry> = {}; const box: Record<string, THREE.Box3> = {};
        gltf.scene.traverse(o => { const m = o as THREE.Mesh; if (!m.isMesh) return; const g = m.geometry.clone(); g.applyMatrix4(m.matrixWorld); geo[m.name] = flat(g); g.computeBoundingBox(); box[m.name] = g.boundingBox!.clone(); });
        const need = ['Body', 'Cockpit', 'Wheel_Front_L', 'Wheel_Rear_L', 'FrontWing', 'RearWing', 'Sidepod_L'];
        for (const n of need) if (!geo[n]) throw new Error('GLB is missing mesh ' + n);
        const c = (b: THREE.Box3) => b.getCenter(new THREE.Vector3()), sz = (b: THREE.Box3) => b.getSize(new THREE.Vector3());
        const wf = box.Wheel_Front_L, wr = box.Wheel_Rear_L, sp = box.Sidepod_L, fw = box.FrontWing, rw = box.RearWing;
        const kit: Kit = {
          geo, body: sectionsOf(geo.Body), cockpit: sectionsOf(geo.Cockpit),
          pod: { x0: Math.abs(sp.max.x), x1: Math.abs(sp.min.x), z0: sp.min.z, z1: sp.max.z, y0: sp.min.y, y1: sp.max.y },
          wheelF: { x: Math.abs(c(wf).x), y: c(wf).y, z: c(wf).z, r: sz(wf).y / 2, w: sz(wf).x }, wheelR: { x: Math.abs(c(wr).x), y: c(wr).y, z: c(wr).z, r: sz(wr).y / 2, w: sz(wr).x },
          frontWing: { z: c(fw).z, y: c(fw).y, span: sz(fw).x, chord: sz(fw).z, th: sz(fw).y }, rearWing: { z: c(rw).z, y: c(rw).y, span: sz(rw).x, chord: sz(rw).z, th: sz(rw).y }, source: 'glb',
        };
        // sidepod box x-range is stored as absolute values of the left pod
        kit.pod.x0 = Math.min(Math.abs(sp.min.x), Math.abs(sp.max.x)); kit.pod.x1 = Math.max(Math.abs(sp.min.x), Math.abs(sp.max.x));
        resolve(kit);
      } catch (e) { reject(e); }
    }, err => reject(err));
  });
}

let loading: Promise<Kit> | null = null;
/** Loads the GLB once (embedded copy in the single-file build, else ./models/apexline_base_car.glb). Falls back to measured constants on failure. */
export function loadKit(): Promise<Kit> {
  if (KIT) return Promise.resolve(KIT);
  loading ??= (async () => {
    try {
      const emb = (window as any).__APEX_GLB as string | undefined;
      let buf: ArrayBuffer;
      if (emb) { const bin = atob(emb); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); buf = u.buffer; }
      else { const r = await fetch(`${import.meta.env.BASE_URL}models/apexline_base_car.glb`); if (!r.ok) throw new Error('glb missing'); buf = await r.arrayBuffer(); }
      KIT = await parseKit(buf);
    } catch (e) {
      console.warn('GLB kit unavailable, using measured fallback', e);
      KIT = { ...FALLBACK, geo: {} } as Kit;
    }
    return KIT!;
  })();
  return loading;
}
