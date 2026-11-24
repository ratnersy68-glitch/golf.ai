import * as THREE from 'three';
import type { Settings } from './types';

export interface Recommendation { preset: Settings['preset']; msPerFrame: number; renderer: string; reason: string }

/**
 * Measures this device with a short synthetic render benchmark (a few hundred instanced, lit, shadow-casting meshes on a 960x540 target,
 * GPU-synchronised with a 1-pixel read-back) and maps the measured ms/frame to a preset. It is a heuristic, not a guarantee.
 */
export async function recommendSettings(): Promise<Recommendation> {
  const canvas = document.createElement('canvas'); canvas.width = 960; canvas.height = 540;
  let r: THREE.WebGLRenderer | null = null;
  try {
    r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    const gl = r.getContext(); const ext = gl.getExtension('WEBGL_debug_renderer_info'); const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : 'unknown GPU';
    r.setSize(960, 540, false); r.shadowMap.enabled = true;
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(70, 960 / 540, 0.5, 500); cam.position.set(0, 14, 40); cam.lookAt(0, 0, 0);
    const sun = new THREE.DirectionalLight(0xffffff, 2); sun.position.set(30, 60, 20); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun, new THREE.HemisphereLight(0xffffff, 0x445566, 0.6));
    const geo = new THREE.IcosahedronGeometry(1, 3), mat = new THREE.MeshStandardMaterial({ color: '#cfd6e0', roughness: 0.5, metalness: 0.3 });
    const N = 400; const im = new THREE.InstancedMesh(geo, mat, N); const m = new THREE.Matrix4();
    for (let i = 0; i < N; i++) { m.makeTranslation((i % 20 - 10) * 3, Math.floor(i / 20) % 4 * 1.5, -Math.floor(i / 80) * 7); im.setMatrixAt(i, m); } im.castShadow = im.receiveShadow = true; scene.add(im);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), mat); ground.rotation.x = -Math.PI / 2; ground.position.y = -1.2; ground.receiveShadow = true; scene.add(ground);
    const px = new Uint8Array(4); const sync = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    for (let i = 0; i < 4; i++) { r.render(scene, cam); sync(); } // warm-up (shader compile)
    const times: number[] = [];
    for (let i = 0; i < 14; i++) { im.rotation.y = i * 0.05; const t = performance.now(); r.render(scene, cam); sync(); times.push(performance.now() - t); await new Promise(res => setTimeout(res, 0)); }
    times.sort((a, b) => a - b); const ms = times[Math.floor(times.length / 2)]; // median
    const preset: Settings['preset'] = ms < 2.5 ? 'ultra' : ms < 5 ? 'high' : ms < 10 ? 'medium' : ms < 20 ? 'low' : 'performance';
    return { preset, msPerFrame: +ms.toFixed(2), renderer: name, reason: `benchmark scene ${ms.toFixed(1)} ms/frame on ${name}` };
  } catch (e) {
    return { preset: 'medium', msPerFrame: 0, renderer: 'unknown', reason: 'benchmark unavailable: ' + String((e as Error).message ?? e) };
  } finally { r?.dispose(); r?.forceContextLoss(); }
}
