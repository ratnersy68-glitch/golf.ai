// Small standalone renderer for the club info card: a slowly rotating, draggable club head.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildClubModel } from './clubModel.js';
import { clubLength } from './golfer.js';

export class ClubViewer {
  constructor(canvas) {
    this.canvas = canvas;
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    this.scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    const key = new THREE.DirectionalLight('#ffffff', 2.2); key.position.set(0.5, 1, 0.8);
    const rim = new THREE.DirectionalLight('#9fd8ff', 1.4); rim.position.set(-1, 0.4, -0.8);
    this.scene.add(key, rim, new THREE.AmbientLight('#ffffff', 0.35));
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.01, 10);
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);
    this.yaw = -0.6; this.pitch = 0.18; this.vel = 0.35; this.drag = null;
    this.bind();
  }

  bind() {
    const c = this.canvas;
    c.style.touchAction = 'none';
    c.addEventListener('pointerdown', (e) => { this.drag = { x: e.clientX, y: e.clientY }; c.setPointerCapture?.(e.pointerId); this.vel = 0; });
    c.addEventListener('pointermove', (e) => {
      if (!this.drag) return;
      const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y;
      this.drag = { x: e.clientX, y: e.clientY };
      this.yaw += dx * 0.012; this.pitch = Math.max(-0.6, Math.min(0.9, this.pitch + dy * 0.008));
      this.vel = dx * 0.6;
    });
    const up = () => { this.drag = null; if (Math.abs(this.vel) < 0.2) this.vel = 0.35; };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  }

  setClub(club) {
    while (this.pivot.children.length) {
      const o = this.pivot.children[0];
      this.pivot.remove(o);
      o.traverse(m => { if (m.geometry) m.geometry.dispose(); if (m.material) m.material.dispose(); });
    }
    const len = clubLength(club.cat, club.id);
    const model = buildClubModel(club, len, { detail: 1 });
    // center the head at the origin; the shaft rises out of frame
    const head = model.userData.head;
    const box = new THREE.Box3().setFromObject(head);
    const c = box.getCenter(new THREE.Vector3());
    model.position.set(-c.x, -c.y, -c.z);
    model.rotation.set(0, 0, 0);
    const holder = new THREE.Group();
    holder.add(model);
    holder.rotation.z = club.cat === 'putter' ? 0.12 : 0.35; // tilt the shaft back like a product shot
    this.pivot.add(holder);
    const size = box.getSize(new THREE.Vector3()).length();
    this.dist = Math.max(0.2, size * 2.4);
    this.pop = 0;
  }

  resize() {
    const w = this.canvas.clientWidth || 260, h = this.canvas.clientHeight || 170;
    if (this.w === w && this.h === h) return;
    this.w = w; this.h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this.running) return;
    this.running = true;
    let last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
      this.frame(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  stop() { this.running = false; }

  frame(dt) {
    this.resize();
    if (!this.drag) { this.yaw += this.vel * dt; this.vel += (0.35 * Math.sign(this.vel || 1) - this.vel) * Math.min(1, dt * 1.5); }
    this.pop = Math.min(1, (this.pop ?? 1) + dt * 3.5);
    const e = 1 - Math.pow(1 - this.pop, 3);
    this.pivot.rotation.set(this.pitch, this.yaw, 0);
    this.pivot.scale.setScalar(0.6 + 0.4 * e);
    const d = this.dist || 0.35;
    this.camera.position.set(0, d * 0.12, d);
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }
}
