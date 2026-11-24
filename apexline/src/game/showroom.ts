import * as THREE from 'three';
import { Gfx } from './gfx';
import { CarModel } from './car';
import type { CarSetup } from './types';
import { COSMETIC_MAP } from '../data/cosmetics';

/** Cinematic car presentation used by the main menu, garage, shop previews and profile. */
export class Showroom {
  group = new THREE.Group();
  car?: CarModel;
  platform = new THREE.Group();
  yaw = 0.6; pitch = 0.22; dist = 7.6; targetDist = 7.6; targetYaw = 0.6; auto = true; drag = false; lastX = 0; lastY = 0; t = 0; appear = 1;
  offsetX = 0; mode: 'menu' | 'garage' = 'menu';
  ring!: THREE.Mesh; ringMat!: THREE.MeshBasicMaterial; floorMat!: THREE.MeshStandardMaterial; backMat!: THREE.MeshBasicMaterial;
  accent = new THREE.Color('#C6FF00');
  lights: THREE.Light[] = [];
  setupKey = '';
  focus = new THREE.Vector3(0, 0.6, 0);
  entered = false;
  canvas: HTMLCanvasElement;
  private onDown = (e: PointerEvent) => { if (this.mode !== 'garage') return; this.drag = true; this.auto = false; this.lastX = e.clientX; this.lastY = e.clientY; };
  private onMove = (e: PointerEvent) => { if (!this.drag) return; this.targetYaw -= (e.clientX - this.lastX) * 0.008; this.pitch = Math.max(-0.1, Math.min(1.1, this.pitch + (e.clientY - this.lastY) * 0.005)); this.lastX = e.clientX; this.lastY = e.clientY; };
  private onUp = () => { this.drag = false; };
  private onWheel = (e: WheelEvent) => { if (this.mode !== 'garage') return; this.targetDist = Math.max(3.2, Math.min(12, this.targetDist + e.deltaY * 0.005)); };

  constructor(public gfx: Gfx, mode: 'menu' | 'garage') {
    this.mode = mode; this.canvas = gfx.canvas;
    this.group.add(this.platform);
    // floor + platform
    this.floorMat = new THREE.MeshStandardMaterial({ color: '#16181c', roughness: 0.22, metalness: 0.7 });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), this.floorMat); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.02; floor.receiveShadow = true; this.group.add(floor);
    const plat = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 0.18, 64), new THREE.MeshStandardMaterial({ color: '#20242b', roughness: 0.35, metalness: 0.9 }));
    plat.position.y = 0.0; plat.receiveShadow = true; this.platform.add(plat);
    this.ringMat = new THREE.MeshBasicMaterial({ color: '#C6FF00' });
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(3.65, 0.03, 8, 96), this.ringMat); this.ring.rotation.x = Math.PI / 2; this.ring.position.y = 0.1; this.platform.add(this.ring);
    // inner turntable marks
    const marks = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.04, 96), new THREE.MeshBasicMaterial({ color: '#A8AFBA', transparent: true, opacity: 0.35, side: THREE.DoubleSide })); marks.rotation.x = -Math.PI / 2; marks.position.y = 0.095; this.platform.add(marks);
    // back wall panels
    this.backMat = new THREE.MeshBasicMaterial({ color: '#C6FF00', transparent: true, opacity: 0.9 });
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI * 0.9 + (i / 6) * Math.PI * 0.8; const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, 5 + (i % 3), 0.12), this.backMat);
      p.position.set(Math.cos(a) * 14, 3, Math.sin(a) * 14 - 6); p.rotation.y = -a; this.group.add(p);
    }
    const strip = new THREE.Mesh(new THREE.BoxGeometry(30, 0.08, 0.08), this.backMat); strip.position.set(0, 0.08, -13); this.group.add(strip);
    // lights
    const key = new THREE.SpotLight('#ffffff', 95, 40, 0.5, 0.6, 1.6); key.position.set(6, 9, 6); key.target.position.set(0, 0.6, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0003;
    const rim = new THREE.SpotLight('#C6FF00', 22, 40, 0.6, 0.7, 1.6); rim.position.set(-8, 5, -7); rim.target.position.set(0, 0.8, 0);
    const fill = new THREE.PointLight('#8aa0ff', 8, 30, 1.8); fill.position.set(-6, 3, 6);
    this.group.add(key, key.target, rim, rim.target, fill); this.lights.push(key, rim, fill);
    canvas().addEventListener('pointerdown', this.onDown); window.addEventListener('pointermove', this.onMove); window.addEventListener('pointerup', this.onUp); canvas().addEventListener('wheel', this.onWheel, { passive: true });
    function canvas() { return gfx.canvas; }
  }

  enter() {
    this.gfx.setEnv('garage'); this.gfx.scene.add(this.group);
    this.gfx.scene.fog = new THREE.Fog('#101216', 18, 55);
    this.gfx.sun.intensity = 0.6; this.gfx.sun.castShadow = false; this.entered = true;
  }
  exit() {
    this.gfx.scene.remove(this.group); this.car && this.gfx.scene.remove(this.car.group); this.car?.dispose(); this.car = undefined; this.entered = false;
    this.canvas.removeEventListener('pointerdown', this.onDown); window.removeEventListener('pointermove', this.onMove); window.removeEventListener('pointerup', this.onUp); this.canvas.removeEventListener('wheel', this.onWheel);
    this.gfx.applySettings(this.gfx.settings);
  }

  setGarageEnv(id: string | undefined) {
    const d = COSMETIC_MAP[id ?? 'garage_carbon_studio']?.data ?? { bg: '#101216', floor: '#16181c', accent: '#C6FF00' };
    this.accent.set(d.accent); this.ringMat.color.copy(this.accent); this.backMat.color.copy(this.accent); this.floorMat.color.set(d.floor);
    (this.lights[1] as THREE.SpotLight).color.copy(this.accent);
    this.gfx.scene.fog = new THREE.Fog(d.bg, 18, 55);
    this.gfx.skyMat.uniforms.cTop.value.set(d.bg); this.gfx.skyMat.uniforms.cHor.value.set(d.bg); this.gfx.skyMat.uniforms.cBot.value.set(d.bg);
  }

  setSetup(setup: CarSetup, garageEnv?: string) {
    this.setGarageEnv(garageEnv);
    const key = JSON.stringify(setup);
    if (key === this.setupKey) return; const vehChanged = !this.car || this.car.setup.vehicle !== setup.vehicle; this.setupKey = key;
    if (this.car) { this.gfx.scene.remove(this.car.group); this.car.dispose(); }
    this.car = new CarModel(setup); this.gfx.scene.add(this.car.group); this.car.group.position.set(0, 0.09, 0);
    if (vehChanged) this.appear = 0;
  }

  frame(dt: number) {
    this.t += dt;
    if (this.auto) this.targetYaw += dt * (this.mode === 'menu' ? 0.22 : 0.3);
    this.yaw += (this.targetYaw - this.yaw) * Math.min(1, dt * 8); this.dist += (this.targetDist - this.dist) * Math.min(1, dt * 6);
    this.appear = Math.min(1, this.appear + dt * 2.2);
    const car = this.car;
    if (car) {
      const k = 1 - Math.pow(1 - this.appear, 3);
      car.group.rotation.y = 0; car.group.scale.setScalar(0.88 + 0.12 * k); car.group.position.y = 0.09 + (1 - k) * 0.6;
      const spin = dt * 0.8; for (const w of car.wheels) w.spin.rotation.x -= spin;
      car.update(dt, { speed: 0, steer: 0, slip: 0, braking: this.mode === 'garage' ? 0.5 + 0.5 * Math.sin(this.t * 2) : 0, airborne: false, boosting: false, time: this.t, throttle: 0 }, { roll: 0, pitch: 0, heave: 0 });
    }
    this.platform.rotation.y = this.t * 0.1;
    // camera
    const cam = this.gfx.camera; const cy = Math.cos(this.pitch), sy = Math.sin(this.pitch);
    const sway = this.mode === 'menu' ? Math.sin(this.t * 0.4) * 0.25 : 0;
    const d = this.dist;
    const off = this.mode === 'menu' ? this.offsetX : 0;
    cam.position.set(Math.sin(this.yaw + sway) * cy * d, 0.5 + sy * d + 0.6, Math.cos(this.yaw + sway) * cy * d);
    cam.fov = this.mode === 'menu' ? 36 : 42; cam.updateProjectionMatrix();
    cam.up.set(0, 1, 0); cam.lookAt(this.focus);
    if (off) { cam.translateX(off); }
    this.gfx.sky.position.copy(cam.position);
    this.gfx.render(0);
  }
}
