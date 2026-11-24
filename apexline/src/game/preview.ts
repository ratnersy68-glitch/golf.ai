import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CarModel } from './car';
import { defaultSetup } from './progress';
import { applyCosmetic } from './setup';
import type { Cosmetic, CosCat } from '../data/cosmetics';

/** Renders each cosmetic on a real car (framed per category) into a cached thumbnail using one shared offscreen WebGL renderer. */
let renderer: THREE.WebGLRenderer | null = null; let scene: THREE.Scene; let cam: THREE.PerspectiveCamera;
const cache = new Map<string, string>(); const pending = new Map<string, Promise<string | null>>(); let chain: Promise<unknown> = Promise.resolve();

export const has3DPreview = (c: Cosmetic): boolean => !['title', 'avatar', 'banner', 'garage', 'plate', 'trail', 'flame', 'smoke', 'finishfx', 'spawn', 'victory'].includes(c.cat);

function init() {
  if (renderer) return;
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 200;
  renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, preserveDrawingBuffer: true }); renderer.setClearColor('#E9EBEE', 1);
  renderer.setPixelRatio(1); renderer.setSize(320, 200, false); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.85;
  scene = new THREE.Scene(); scene.background = new THREE.Color('#E9EBEE'); cam = new THREE.PerspectiveCamera(32, 320 / 200, 0.1, 100);
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.8; pm.dispose();
  const key = new THREE.DirectionalLight('#ffffff', 2.2); key.position.set(4, 6, 5); scene.add(key, new THREE.HemisphereLight('#ffffff', '#c8ccd2', 0.7));
  const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 40), new THREE.MeshStandardMaterial({ color: '#E8EAED', roughness: 0.3, metalness: 0.1 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.01; scene.add(floor);
}

/** [camera position, look-at] in car space (x right, y up, -z forward) per category. */
const FRAME: Partial<Record<CosCat, [number[], number[]]>> = {
  wheel: [[-2.1, 0.75, -1.9], [-0.9, 0.38, -1.1]], wheelColor: [[-2.1, 0.75, -1.9], [-0.9, 0.38, -1.1]], tire: [[-2.2, 0.7, -1.9], [-0.9, 0.38, -1.1]], caliper: [[-1.9, 0.6, -1.7], [-0.9, 0.38, -1.1]],
  spoiler: [[2.4, 1.9, 4.2], [0, 0.8, 1.4]], diffuser: [[2.2, 0.8, 4.2], [0, 0.4, 1.7]], exhaust: [[1.4, 0.9, 3.6], [0, 0.5, 1.7]], rbumper: [[2.2, 1.1, 4.0], [0, 0.45, 1.7]],
  splitter: [[2.6, 1.0, -3.8], [0, 0.35, -1.5]], fbumper: [[2.4, 1.1, -3.6], [0, 0.4, -1.5]], headlight: [[2.0, 0.9, -3.4], [0, 0.45, -0.8]], taillight: [[2.0, 1.1, 3.6], [0, 0.5, 1.7]],
  hood: [[2.2, 2.0, -2.6], [0, 0.5, -0.9]], scoop: [[2.2, 2.1, 1.8], [0, 0.9, 0.3]], skirt: [[3.1, 0.9, 0.6], [0, 0.45, -0.1]], widebody: [[3.4, 1.8, -3.2], [0, 0.5, 0]], underglow: [[3.0, 0.5, -3.0], [0, 0.1, 0]],
};
const DEFAULT_FRAME: [number[], number[]] = [[4.3, 2.0, -4.6], [0, 0.55, -0.1]];

export function getPreview(c: Cosmetic, vehicle = 'apex'): Promise<string | null> {
  const key = `${vehicle}:${c.id}`; const hit = cache.get(key); if (hit) return Promise.resolve(hit);
  const p = pending.get(key); if (p) return p;
  const job = new Promise<string | null>(resolve => {
    chain = chain.then(() => new Promise<void>(done => setTimeout(() => {
      try {
        init(); const base = defaultSetup(vehicle); base.paint.primary = '#8A929C'; base.paint.secondary = '#25282D'; base.paint.accent = '#F5F5F3';
        const setup = applyCosmetic(base, c); if (c.cat === 'paint') { setup.paint.primary = c.data.color; }
        const car = new CarModel(setup); scene.add(car.group);
        const [pos, look] = FRAME[c.cat] ?? DEFAULT_FRAME; cam.position.set(pos[0], pos[1], pos[2]); cam.lookAt(look[0], look[1], look[2]);
        car.update(0.016, { speed: 0, steer: 0, slip: 0, braking: c.cat === 'taillight' ? 1 : 0, airborne: false, boosting: false, time: 1.2, throttle: 0 }, { roll: 0, pitch: 0, heave: 0 });
        renderer!.render(scene, cam); const url = renderer!.domElement.toDataURL('image/jpeg', 0.86);
        scene.remove(car.group); car.dispose(); cache.set(key, url); resolve(url);
      } catch { resolve(null); }
      done();
    }, 0)));
  });
  pending.set(key, job); return job;
}
