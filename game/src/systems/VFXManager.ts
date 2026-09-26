import * as THREE from 'three';

interface Particle {
  alive: boolean;
  p: THREE.Vector3;
  v: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
  life: number;
  max: number;
  size: number;
  gravity: number;
  drag: number;
  floor: number;
}

class Pool {
  readonly mesh: THREE.InstancedMesh;
  private parts: Particle[] = [];
  private cursor = 0;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private s = new THREE.Vector3();

  constructor(geo: THREE.BufferGeometry, mat: THREE.Material, size: number) {
    this.mesh = new THREE.InstancedMesh(geo, mat, size);
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < size; i++) {
      this.parts.push({ alive: false, p: new THREE.Vector3(), v: new THREE.Vector3(), rot: new THREE.Euler(), spin: new THREE.Vector3(), life: 0, max: 1, size: 1, gravity: 0, drag: 0, floor: -99 });
      this.mesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
      this.mesh.setColorAt(i, new THREE.Color('#ffffff'));
    }
  }

  spawn(o: { p: THREE.Vector3; v: THREE.Vector3; life: number; size: number; gravity?: number; drag?: number; color?: THREE.Color | string; spin?: number; floor?: number }): void {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.parts.length;
    const part = this.parts[i];
    part.alive = true;
    part.p.copy(o.p);
    part.v.copy(o.v);
    part.life = 0;
    part.max = o.life;
    part.size = o.size;
    part.gravity = o.gravity ?? 32;
    part.drag = o.drag ?? 0.5;
    part.floor = o.floor ?? -99;
    const sp = o.spin ?? 0;
    part.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    part.spin.set((Math.random() - 0.5) * sp, (Math.random() - 0.5) * sp, (Math.random() - 0.5) * sp);
    if (o.color) this.mesh.setColorAt(i, o.color instanceof THREE.Color ? o.color : new THREE.Color(o.color));
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  update(dt: number): void {
    let any = false;
    this.parts.forEach((part, i) => {
      if (!part.alive) return;
      any = true;
      part.life += dt;
      if (part.life >= part.max) {
        part.alive = false;
        this.mesh.setMatrixAt(i, this.m.makeScale(0, 0, 0));
        return;
      }
      part.v.y -= part.gravity * dt;
      part.v.multiplyScalar(Math.max(0, 1 - part.drag * dt));
      part.p.addScaledVector(part.v, dt);
      if (part.p.y < part.floor) {
        part.p.y = part.floor;
        part.v.set(part.v.x * 0.3, 0, part.v.z * 0.3);
      }
      part.rot.x += part.spin.x * dt;
      part.rot.y += part.spin.y * dt;
      part.rot.z += part.spin.z * dt;
      const k = part.life / part.max;
      const fade = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
      this.s.setScalar(part.size * fade);
      this.q.setFromEuler(part.rot);
      this.m.compose(part.p, this.q, this.s);
      this.mesh.setMatrixAt(i, this.m);
    });
    if (any) this.mesh.instanceMatrix.needsUpdate = true;
  }
}

/** Tasteful, pooled particle effects: splashes, sand, grass, confetti, sparkles, rings and the ball trail. */
export class VFXManager {
  readonly group = new THREE.Group();
  private droplets: Pool;
  private dust: Pool;
  private bits: Pool;
  private confetti: Pool;
  private sparks: Pool;
  private rings: { mesh: THREE.Mesh; life: number; max: number }[] = [];
  private trail: THREE.Mesh;
  private trailPts: THREE.Vector3[] = [];
  private trailColor = new THREE.Color('#ffffff');

  constructor() {
    this.group.name = 'vfx';
    const sphere = new THREE.IcosahedronGeometry(1, 1);
    this.droplets = new Pool(sphere, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, transparent: true, opacity: 0.85 }), 220);
    this.dust = new Pool(sphere, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, transparent: true, opacity: 0.8 }), 160);
    this.bits = new Pool(new THREE.BoxGeometry(1, 0.2, 0.4), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }), 160);
    this.confetti = new Pool(new THREE.PlaneGeometry(1, 0.6), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6, side: THREE.DoubleSide }), 500);
    this.sparks = new Pool(new THREE.OctahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), 200);
    this.group.add(this.droplets.mesh, this.dust.mesh, this.bits.mesh, this.confetti.mesh, this.sparks.mesh);

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(64 * 2 * 3), 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(64 * 2 * 4), 4));
    const idx: number[] = [];
    for (let i = 0; i < 63; i++) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    trailGeo.setIndex(idx);
    this.trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    this.trail.frustumCulled = false;
    this.trail.renderOrder = 4;
    this.group.add(this.trail);
  }

  setTrailColor(c: string): void {
    this.trailColor.set(c);
  }

  splash(at: THREE.Vector3): void {
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random();
      this.droplets.spawn({
        p: at.clone().add(new THREE.Vector3(Math.cos(a) * 0.05, 0.02, Math.sin(a) * 0.05)),
        v: new THREE.Vector3(Math.cos(a) * r * 3, 3 + Math.random() * 5, Math.sin(a) * r * 3),
        life: 0.6 + Math.random() * 0.5,
        size: 0.025 + Math.random() * 0.035,
        gravity: 30,
        color: Math.random() < 0.5 ? '#e8f6ff' : '#9fd6e8',
        floor: at.y,
      });
    }
    for (let k = 0; k < 3; k++) this.ring(at, 0.8 + k * 0.5, k * 0.12);
  }

  sandPuff(at: THREE.Vector3, color: string): void {
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      this.dust.spawn({
        p: at.clone(),
        v: new THREE.Vector3(Math.cos(a) * (0.6 + Math.random()), 1 + Math.random() * 2.5, Math.sin(a) * (0.6 + Math.random())),
        life: 0.5 + Math.random() * 0.5,
        size: 0.03 + Math.random() * 0.05,
        gravity: 9,
        drag: 3,
        color,
        floor: at.y,
      });
    }
  }

  grassBurst(at: THREE.Vector3, dir: THREE.Vector3, color: string, amount = 14): void {
    for (let i = 0; i < amount; i++) {
      const v = dir.clone().multiplyScalar(-(0.5 + Math.random() * 1.5));
      v.x += (Math.random() - 0.5) * 1.6;
      v.z += (Math.random() - 0.5) * 1.6;
      v.y = 1 + Math.random() * 2;
      this.bits.spawn({ p: at.clone(), v, life: 0.5 + Math.random() * 0.4, size: 0.05 + Math.random() * 0.04, gravity: 14, drag: 2, color, spin: 20, floor: at.y - 0.02 });
    }
  }

  confettiBurst(at: THREE.Vector3, amount = 180, spread = 3): void {
    const colors = ['#f2c94c', '#e2457a', '#ffffff', '#2d9cdb', '#27ae60', '#eb5757', '#bb6bd9'];
    for (let i = 0; i < amount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * spread;
      this.confetti.spawn({
        p: at.clone().add(new THREE.Vector3(0, 0.2, 0)),
        v: new THREE.Vector3(Math.cos(a) * r, 6 + Math.random() * 7, Math.sin(a) * r),
        life: 2.5 + Math.random() * 1.5,
        size: 0.08 + Math.random() * 0.06,
        gravity: 7,
        drag: 1.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        spin: 14,
        floor: at.y - 0.5,
      });
    }
  }

  sparkles(at: THREE.Vector3, amount = 60): void {
    for (let i = 0; i < amount; i++) {
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9, Math.random() - 0.5).normalize();
      this.sparks.spawn({ p: at.clone(), v: dir.multiplyScalar(2 + Math.random() * 5), life: 0.8 + Math.random() * 0.8, size: 0.03 + Math.random() * 0.04, gravity: 3, drag: 2.5, color: Math.random() < 0.5 ? '#fff3b0' : '#ffd24a', spin: 8 });
    }
  }

  ring(at: THREE.Vector3, max = 1, delay = 0): void {
    const mesh = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 40), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.7, depthWrite: false }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.copy(at).add(new THREE.Vector3(0, 0.02, 0));
    mesh.scale.setScalar(0.01);
    this.group.add(mesh);
    this.rings.push({ mesh, life: -delay, max });
  }

  /** feed the ball position every frame while it moves */
  pushTrail(p: THREE.Vector3 | null): void {
    if (p) {
      const last = this.trailPts[this.trailPts.length - 1];
      if (!last || last.distanceTo(p) > 0.05) this.trailPts.push(p.clone());
      if (this.trailPts.length > 64) this.trailPts.shift();
    } else if (this.trailPts.length) {
      this.trailPts.shift();
      if (this.trailPts.length) this.trailPts.shift();
    }
  }

  clearTrail(): void {
    this.trailPts = [];
  }

  update(dt: number, cam?: THREE.Camera): void {
    this.droplets.update(dt);
    this.dust.update(dt);
    this.bits.update(dt);
    this.confetti.update(dt);
    this.sparks.update(dt);
    this.rings = this.rings.filter((r) => {
      r.life += dt;
      if (r.life < 0) return true;
      const k = r.life / 0.9;
      r.mesh.scale.setScalar(0.05 + k * r.max);
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - k);
      if (k >= 1) {
        this.group.remove(r.mesh);
        r.mesh.geometry.dispose();
        (r.mesh.material as THREE.Material).dispose();
        return false;
      }
      return true;
    });

    // ribbon trail, flat and camera-facing-ish (wide on the ground)
    const pos = this.trail.geometry.getAttribute('position') as THREE.BufferAttribute;
    const col = this.trail.geometry.getAttribute('color') as THREE.BufferAttribute;
    const n = this.trailPts.length;
    const camPos = cam ? (cam as THREE.PerspectiveCamera).position : new THREE.Vector3(0, 10, 0);
    for (let i = 0; i < 64; i++) {
      const k = Math.min(i, n - 1);
      if (n < 2) {
        pos.setXYZ(i * 2, 0, -100, 0);
        pos.setXYZ(i * 2 + 1, 0, -100, 0);
        continue;
      }
      const p = this.trailPts[k];
      const a = this.trailPts[Math.max(0, k - 1)];
      const b = this.trailPts[Math.min(n - 1, k + 1)];
      const t = new THREE.Vector3().subVectors(b, a).normalize();
      const view = new THREE.Vector3().subVectors(camPos, p).normalize();
      const side = new THREE.Vector3().crossVectors(t, view).normalize();
      const f = k / (n - 1);
      const w = 0.04 * f;
      pos.setXYZ(i * 2, p.x + side.x * w, p.y + 0.04 + side.y * w, p.z + side.z * w);
      pos.setXYZ(i * 2 + 1, p.x - side.x * w, p.y + 0.04 - side.y * w, p.z - side.z * w);
      const alpha = i < n ? f * 0.4 : 0;
      col.setXYZW(i * 2, this.trailColor.r, this.trailColor.g, this.trailColor.b, alpha);
      col.setXYZW(i * 2 + 1, this.trailColor.r, this.trailColor.g, this.trailColor.b, alpha);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }
}
