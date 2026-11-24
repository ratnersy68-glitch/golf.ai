import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { Gfx } from './gfx';
import { CarModel } from './car';
import type { CarSetup } from './types';
import { COSMETIC_MAP } from '../data/cosmetics';
import { makeMarble } from '../ui/marble';

/** Luxury showroom: polished white marble floor with real reflections, white architecture, soft studio lighting and a rotating display platform. */
let floorTex: THREE.CanvasTexture | null = null;
const sharedTex: Record<string, THREE.CanvasTexture> = {};
/** One repeat-variant of the marble per use, created once for the page's lifetime (not per showroom visit). */
function sharedMarble(key: string, rep: number): THREE.CanvasTexture { if (!sharedTex[key]) { const t = marbleTexture().clone(); t.needsUpdate = true; t.repeat.set(rep, rep); sharedTex[key] = t; } return sharedTex[key]; }
function marbleTexture(): THREE.CanvasTexture {
  if (!floorTex) { floorTex = new THREE.CanvasTexture(makeMarble({ size: 1024, seed: 5, veinStrength: 1 })); floorTex.colorSpace = THREE.SRGBColorSpace; floorTex.wrapS = floorTex.wrapT = THREE.MirroredRepeatWrapping; floorTex.anisotropy = 8; }
  return floorTex;
}

export class Showroom {
  group = new THREE.Group();
  car?: CarModel;
  platform = new THREE.Group();
  yaw = 0.7; pitch = 0.2; dist = 7.6; targetDist = 7.6; targetYaw = 0.7; auto = true; drag = false; lastX = 0; lastY = 0; t = 0; appear = 1; swoop = 0;
  offsetX = 0; mode: 'menu' | 'garage' = 'menu';
  ringMat!: THREE.MeshStandardMaterial; wallMat!: THREE.MeshStandardMaterial; stripMat!: THREE.MeshBasicMaterial; floorOverlay!: THREE.MeshStandardMaterial;
  reflector?: Reflector;
  lights: THREE.Light[] = [];
  setupKey = '';
  focus = new THREE.Vector3(0, 0.6, 0); targetFocus = new THREE.Vector3(0, 0.6, 0); targetPitch = -1;
  entered = false;
  canvas: HTMLCanvasElement;
  private onDown = (e: PointerEvent) => { if (this.mode !== 'garage') return; this.drag = true; this.auto = false; this.lastX = e.clientX; this.lastY = e.clientY; };
  private onMove = (e: PointerEvent) => { if (!this.drag) return; this.targetYaw -= (e.clientX - this.lastX) * 0.008; this.pitch = Math.max(-0.05, Math.min(1.1, this.pitch + (e.clientY - this.lastY) * 0.005)); this.lastX = e.clientX; this.lastY = e.clientY; };
  private onUp = () => { this.drag = false; };
  private onWheel = (e: WheelEvent) => { if (this.mode !== 'garage') return; this.targetDist = Math.max(3.2, Math.min(12, this.targetDist + e.deltaY * 0.005)); };

  constructor(public gfx: Gfx, mode: 'menu' | 'garage') {
    this.mode = mode; this.canvas = gfx.canvas; this.group.add(this.platform);
    const refl = gfx.settings.reflections > 0;
    // ---- floor: reflective mirror under a translucent marble layer = polished marble
    if (refl) {
      this.reflector = new Reflector(new THREE.CircleGeometry(60, 64), { color: new THREE.Color(0x9a9ea4), textureWidth: Math.round(1024 * Math.min(1, gfx.settings.resScale)), textureHeight: Math.round(1024 * Math.min(1, gfx.settings.resScale)) });
      this.reflector.rotation.x = -Math.PI / 2; this.reflector.position.y = -0.03; this.group.add(this.reflector);
    }
    const tex = sharedMarble('floor', 6);
    this.floorOverlay = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.14, metalness: 0.05, transparent: refl, opacity: refl ? 0.78 : 1, envMapIntensity: 0.9 });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), this.floorOverlay); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.02; floor.receiveShadow = true; this.group.add(floor);
    // ---- display platform: raised marble disc with a brushed-silver rim
    const platTex = sharedMarble('plat', 1.2);
    const plat = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.6, 0.16, 72), new THREE.MeshStandardMaterial({ map: platTex, roughness: 0.12, metalness: 0.05 })); plat.position.y = 0.0; plat.receiveShadow = true; this.platform.add(plat);
    this.ringMat = new THREE.MeshStandardMaterial({ color: '#D8DCE0', metalness: 1, roughness: 0.28 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.56, 0.035, 10, 120), this.ringMat); ring.rotation.x = Math.PI / 2; ring.position.y = 0.085; this.platform.add(ring);
    const inlay = new THREE.Mesh(new THREE.RingGeometry(2.1, 2.13, 96), new THREE.MeshBasicMaterial({ color: '#B8BDC4', transparent: true, opacity: 0.8, side: THREE.DoubleSide })); inlay.rotation.x = -Math.PI / 2; inlay.position.y = 0.085; this.platform.add(inlay);
    // ---- architecture: curved white backdrop with slim vertical reveals, white columns and a ceiling light ring
    this.wallMat = new THREE.MeshStandardMaterial({ color: '#F5F5F3', roughness: 0.85, metalness: 0, side: THREE.BackSide });
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(26, 26, 18, 96, 1, true, Math.PI * 0.55, Math.PI * 0.9), this.wallMat); wall.position.y = 8.5; this.group.add(wall);
    const pillarMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.55, metalness: 0 });
    for (let i = 0; i < 11; i++) { const a = Math.PI * 0.6 + (i / 10) * Math.PI * 0.8; const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 16, 0.5), pillarMat); p.position.set(Math.cos(a) * 25.2, 8, Math.sin(a) * 25.2); p.rotation.y = -a; this.group.add(p); }
    this.stripMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
    const ceil = new THREE.Mesh(new THREE.TorusGeometry(9, 0.12, 8, 96), this.stripMat); ceil.rotation.x = Math.PI / 2; ceil.position.y = 12; this.group.add(ceil);
    const ceil2 = new THREE.Mesh(new THREE.TorusGeometry(16, 0.09, 8, 96), this.stripMat); ceil2.rotation.x = Math.PI / 2; ceil2.position.y = 13; this.group.add(ceil2);
    for (const s of [-1, 1]) { const sb = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 2.4), this.stripMat); sb.position.set(s * 6, 11.5, -2); this.group.add(sb); }
    // ---- studio lighting
    const key = new THREE.SpotLight('#ffffff', 70, 50, 0.55, 0.8, 1.5); key.position.set(6, 11, 7); key.target.position.set(0, 0.6, 0); key.castShadow = gfx.settings.shadows > 0; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0003; key.shadow.radius = 6;
    const rim = new THREE.SpotLight('#ffffff', 30, 50, 0.6, 0.9, 1.5); rim.position.set(-9, 6, -8); rim.target.position.set(0, 0.8, 0);
    const top = new THREE.SpotLight('#ffffff', 40, 40, 0.5, 0.9, 1.5); top.position.set(0, 14, 0.5); top.target.position.set(0, 0.5, 0);
    const fill = new THREE.PointLight('#e8eef8', 8, 40, 1.6); fill.position.set(-7, 3, 7);
    this.group.add(key, key.target, rim, rim.target, top, top.target, fill); this.lights.push(key, rim, top, fill);
    gfx.canvas.addEventListener('pointerdown', this.onDown); window.addEventListener('pointermove', this.onMove); window.addEventListener('pointerup', this.onUp); gfx.canvas.addEventListener('wheel', this.onWheel, { passive: true });
  }

  enter() {
    this.gfx.setEnv('garage'); this.gfx.scene.add(this.group);
    this.gfx.scene.fog = new THREE.Fog('#E4E6E9', 30, 80);
    this.gfx.sun.intensity = 0.5; this.gfx.sun.castShadow = false; this.entered = true;
  }
  exit() {
    this.gfx.scene.remove(this.group); this.car && this.gfx.scene.remove(this.car.group); this.car?.dispose(); this.car = undefined; this.entered = false;
    this.canvas.removeEventListener('pointerdown', this.onDown); window.removeEventListener('pointermove', this.onMove); window.removeEventListener('pointerup', this.onUp); this.canvas.removeEventListener('wheel', this.onWheel);
    const free = (o: THREE.Object3D) => { const m = o as THREE.Mesh; m.geometry?.dispose(); const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []; for (const mt of mats) mt.dispose(); };
    this.group.traverse(free); this.platform.traverse(free); this.reflector?.dispose(); for (const l of this.lights) { (l as any).shadow?.dispose(); l.dispose?.(); } this.lights.length = 0;
    this.gfx.applySettings(this.gfx.settings);
  }

  /** Garage backgrounds are cosmetics; their colours tint the (mostly white) architecture and the rim light. */
  setGarageEnv(id: string | undefined) {
    const d = COSMETIC_MAP[id ?? 'garage_carbon_studio']?.data ?? { bg: '#F5F5F3', floor: '#FFFFFF', accent: '#B8BDC4' };
    const white = new THREE.Color('#F5F5F3'); const bg = white.clone().lerp(new THREE.Color(d.bg), d.bg.toLowerCase() === '#f5f5f3' ? 0 : 0.14);
    this.wallMat.color.copy(bg); this.ringMat.color.set('#D8DCE0').lerp(new THREE.Color(d.accent), 0.25); this.stripMat.color.set('#FFFFFF').lerp(new THREE.Color(d.accent), 0.12);
    this.floorOverlay.color.set('#FFFFFF').lerp(new THREE.Color(d.floor), 0.1);
    this.gfx.scene.fog = new THREE.Fog(bg.getStyle(), 28, 70);
    for (const k of ['cTop', 'cHor', 'cBot'] as const) this.gfx.skyMat.uniforms[k].value.set(bg.getStyle());
  }

  /** Cinematic framing of the part being previewed (shop). null = free orbit around the whole car. */
  focusPart(cat: string | null) {
    const F: Record<string, [number, number, number, number[]]> = { // yaw, pitch, dist, focus
      rear: [0.55, 0.22, 4.4, [0, 0.75, 1.3]], front: [Math.PI - 0.55, 0.2, 4.4, [0, 0.5, -1.2]], wheel: [Math.PI - 1.15, 0.12, 3.6, [0.9, 0.42, -1.1]], side: [Math.PI / 2 + 0.2, 0.12, 5.2, [0, 0.55, 0]], top: [Math.PI - 0.6, 0.55, 4.6, [0, 0.7, -0.4]],
    };
    const map: Record<string, string> = { spoiler: 'rear', diffuser: 'rear', exhaust: 'rear', rbumper: 'rear', taillight: 'rear', splitter: 'front', fbumper: 'front', headlight: 'front', wheel: 'wheel', wheelColor: 'wheel', tire: 'wheel', caliper: 'wheel', skirt: 'side', widebody: 'side', livery: 'side', hood: 'top', scoop: 'top' };
    const k = cat ? map[cat] : undefined;
    if (!k) { this.targetFocus.set(0, 0.6, 0); this.targetDist = 7.4; this.targetPitch = -1; return; }
    const [yaw, pit, dist, f] = F[k]; this.auto = false; this.targetYaw = yaw + Math.round((this.yaw - yaw) / (Math.PI * 2)) * Math.PI * 2; this.targetPitch = pit; this.targetDist = dist; this.targetFocus.set(f[0], f[1], f[2]);
  }

  setSetup(setup: CarSetup, garageEnv?: string) {
    this.setGarageEnv(garageEnv);
    const key = JSON.stringify(setup);
    if (key === this.setupKey) return; const vehChanged = !this.car || this.car.setup.vehicle !== setup.vehicle; this.setupKey = key;
    if (this.car) { this.gfx.scene.remove(this.car.group); this.car.dispose(); }
    this.car = new CarModel(setup); this.gfx.scene.add(this.car.group); this.car.group.position.set(0, 0.08, 0);
    if (vehChanged) { this.appear = 0; this.swoop = 1; }
  }

  frame(dt: number) {
    this.t += dt;
    if (this.auto) this.targetYaw += dt * (this.mode === 'menu' ? 0.2 : 0.28);
    this.focus.lerp(this.targetFocus, Math.min(1, dt * 5)); if (this.targetPitch >= 0) this.pitch += (this.targetPitch - this.pitch) * Math.min(1, dt * 5);
    this.yaw += (this.targetYaw - this.yaw) * Math.min(1, dt * 8); this.dist += (this.targetDist - this.dist) * Math.min(1, dt * 5);
    this.appear = Math.min(1, this.appear + dt * 2.2); this.swoop = Math.max(0, this.swoop - dt * 1.3);
    const car = this.car;
    if (car) {
      const k = 1 - Math.pow(1 - this.appear, 3);
      car.group.rotation.y = 0; car.group.scale.setScalar(0.9 + 0.1 * k); car.group.position.y = 0.08 + (1 - k) * 0.5;
      for (const w of car.wheels) w.spin.rotation.x -= dt * 0.7;
      car.update(dt, { speed: 0, steer: Math.sin(this.t * 0.8) * 0.12, slip: 0, braking: 0, airborne: false, boosting: false, time: this.t, throttle: 0 }, { roll: 0, pitch: 0, heave: 0 });
    }
    this.platform.rotation.y = this.t * 0.08;
    // camera: cinematic swoop whenever the car changes
    const cam = this.gfx.camera; const e = this.swoop * this.swoop * (3 - 2 * this.swoop);
    const yaw = this.yaw + e * 0.9, pit = Math.max(0, this.pitch + e * 0.25), d = this.dist + e * 2.2;
    const cy = Math.cos(pit), sy = Math.sin(pit); const sway = this.mode === 'menu' ? Math.sin(this.t * 0.4) * 0.22 : 0;
    cam.position.set(Math.sin(yaw + sway) * cy * d, 0.5 + sy * d + 0.6, Math.cos(yaw + sway) * cy * d);
    cam.fov = this.mode === 'menu' ? 36 : 42; cam.updateProjectionMatrix();
    cam.up.set(0, 1, 0); cam.lookAt(this.focus);
    if (this.offsetX) cam.translateX(this.offsetX);
    this.gfx.sky.position.copy(cam.position);
    this.gfx.render(0);
  }
}
