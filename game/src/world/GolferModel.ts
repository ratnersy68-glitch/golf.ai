import * as THREE from 'three';
import type { Appearance, GolferData } from '../data/types';

/**
 * Stylised, original 3D golfer character built from primitives (no external assets).
 * Proportions follow an animated-feature look: big head, expressive eyes, soft shapes.
 * Limbs use two-bone IK so poses are authored as hand/foot targets in the golfer's local space:
 *   +X = toward the target (golfer's left), +Z = facing direction (toward the ball), +Y = up.
 */

type V3 = [number, number, number];

export type GolferMode = 'idle' | 'address' | 'celebrate' | 'dejected' | 'showcase';
export type PutterHold = 'address' | 'rightHand' | 'leftHand' | 'ground';

interface Pose {
  hipDrop: number;
  lean: number;
  twist: number;
  sway: number;
  headYaw: number;
  headPitch: number;
  footL: V3;
  footR: V3;
  handL: V3;
  handR: V3;
  putterHead: V3;
  hold: PutterHold;
  lift: number;
  smile: number;
}

const matCache = new Map<string, THREE.MeshStandardMaterial>();
function M(color: string, rough = 0.62, metal = 0): THREE.MeshStandardMaterial {
  const k = `${color}${rough}${metal}`;
  let m = matCache.get(k);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    matCache.set(k, m);
  }
  return m;
}

const UNIT_CYL = new THREE.CylinderGeometry(1, 1, 1, 14, 1);
const UNIT_SPHERE = new THREE.SphereGeometry(1, 20, 14);
const UP = new THREE.Vector3(0, 1, 0);

function seg(mesh: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number): void {
  const d = new THREE.Vector3().subVectors(b, a);
  const len = d.length();
  mesh.position.copy(a).addScaledVector(d, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, d.normalize());
  mesh.scale.set(r, len, r);
}

function solveIK(a: THREE.Vector3, target: THREE.Vector3, l1: number, l2: number, pole: THREE.Vector3, outMid: THREE.Vector3, outEnd: THREE.Vector3): void {
  const dir = new THREE.Vector3().subVectors(target, a);
  let d = dir.length();
  const maxD = l1 + l2 - 0.001;
  if (d > maxD) d = maxD;
  if (d < 0.05) d = 0.05;
  dir.normalize();
  const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  const p = pole.clone().addScaledVector(dir, -pole.dot(dir)).normalize();
  outMid.copy(a).addScaledVector(dir, x).addScaledVector(p, h);
  outEnd.copy(a).addScaledVector(dir, d);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Where the ball sits relative to the golfer root when addressing a putt (unscaled). */
export const BALL_OFFSET_AT_ADDRESS = new THREE.Vector3(0.1, 0, 1.45);
/** Golfers are life-size next to the miniature course, trimmed slightly so the hole stays readable. */
export const GOLFER_SCALE = 0.82;

export class GolferModel {
  readonly root = new THREE.Group();
  readonly data: GolferData;
  mode: GolferMode = 'idle';
  private ap: Appearance;
  private torso = new THREE.Group();
  private head = new THREE.Group();
  private eyes = new THREE.Group();
  private mouth!: THREE.Mesh;
  private shoulderL = new THREE.Object3D();
  private shoulderR = new THREE.Object3D();
  private limbs: Record<string, THREE.Mesh> = {};
  private putter = new THREE.Group();
  private putterLen = 2.05;
  private pose: Pose;
  private from: Pose;
  private blend = 1;
  private t = 0;
  private modeTime = 0;
  private strokeAngle = 0;
  private celebration: GolferData['celebration'];
  private jump = 0;

  constructor(data: GolferData) {
    this.data = data;
    this.ap = data.appearance;
    this.celebration = data.celebration;
    this.root.name = `golfer-${data.id}`;
    this.build();
    this.pose = this.targetPose(0);
    this.from = { ...this.pose };
    this.apply(this.pose);
  }

  /* ------------------------------------------------------------ build */

  private build(): void {
    const ap = this.ap;
    const s = ap.height;
    const b = ap.build;
    this.root.scale.setScalar(s * GOLFER_SCALE);

    // torso group pivots at the hips
    this.root.add(this.torso);
    this.torso.position.set(0, 2.35, 0);

    const shirt = M(ap.shirt, 0.7);
    const accent = M(ap.shirtAccent, 0.6);
    const pants = M(ap.pants, 0.75);
    const skin = M(ap.skin, 0.55);

    const pelvis = new THREE.Mesh(new THREE.CapsuleGeometry(0.43, 0.18, 6, 16), pants);
    pelvis.scale.set(b, 1, 0.78);
    pelvis.position.y = 0.02;
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.1, 20), M('#1c1c1c', 0.4));
    belt.scale.set(b, 1, 0.8);
    belt.position.y = 0.2;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.03), M('#c9c3b5', 0.3, 0.9));
    buckle.position.set(0, 0.2, 0.37);
    const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 0.62, 8, 20), shirt);
    chest.scale.set(b * 1.02, 1, 0.74);
    chest.position.y = 0.72;
    const collar =
      ap.shirtStyle === 'mock' || ap.shirtStyle === 'quarterzip'
        ? new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.2, 18), ap.shirtStyle === 'mock' ? shirt : accent)
        : new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 8, 20), accent);
    if (collar.geometry.type === 'TorusGeometry') collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.32;
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.04), accent);
    placket.position.set(0, 1.12, 0.36);
    placket.rotation.x = -0.25;
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.505, 0.505, 0.07, 24, 1, true), accent);
    stripe.scale.set(b * 1.02, 1, 0.745);
    stripe.position.y = 0.9;
    this.torso.add(pelvis, belt, buckle, chest, collar, placket);
    if (ap.shirtStyle === 'sweater') this.torso.add(stripe);
    if (ap.shirtStyle === 'polo') {
      for (const side of [-1, 1]) {
        const flap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.12), accent);
        flap.position.set(side * 0.12, 1.3, 0.2);
        flap.rotation.set(-0.5, 0, side * 0.5);
        this.torso.add(flap);
      }
    }

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.3, 12), skin);
    neck.position.y = 1.42;
    this.torso.add(neck);

    this.shoulderL.position.set(0.5 * b, 1.18, 0);
    this.shoulderR.position.set(-0.5 * b, 1.18, 0);
    this.torso.add(this.shoulderL, this.shoulderR);
    for (const sh of [this.shoulderL, this.shoulderR]) {
      const cap = new THREE.Mesh(UNIT_SPHERE, shirt);
      cap.scale.setScalar(0.2);
      sh.add(cap);
    }

    // head
    this.head.position.set(0, 2.1, 0.02);
    this.torso.add(this.head);
    this.buildHead(skin);

    // limbs (root space)
    const limb = (name: string, material: THREE.Material, geo: THREE.BufferGeometry = UNIT_CYL) => {
      const m = new THREE.Mesh(geo, material);
      m.castShadow = true;
      this.limbs[name] = m;
      this.root.add(m);
      return m;
    };
    for (const side of ['L', 'R']) {
      limb(`upper${side}`, skin);
      limb(`sleeve${side}`, shirt);
      limb(`fore${side}`, skin);
      limb(`elbow${side}`, skin, UNIT_SPHERE);
      limb(`hand${side}`, side === 'L' ? M(ap.glove, 0.7) : skin, UNIT_SPHERE);
      limb(`thigh${side}`, pants);
      limb(`shin${side}`, pants);
      limb(`knee${side}`, pants, UNIT_SPHERE);
      const shoe = limb(`shoe${side}`, M(ap.shoes, 0.45), new THREE.CapsuleGeometry(0.15, 0.3, 4, 12));
      shoe.rotation.x = Math.PI / 2;
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.6), M('#2b2b2b', 0.8));
      sole.position.y = -0.1;
      this.limbs[`sole${side}`] = sole;
      this.root.add(sole);
    }
    if (ap.accessory === 'watch') {
      const w = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 6, 14), M('#d4af37', 0.3, 0.8));
      this.limbs.watch = w;
      this.root.add(w);
    }

    this.buildPutter();
    this.root.add(this.putter);

    this.root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  private buildHead(skin: THREE.Material): void {
    const ap = this.ap;
    const h = this.head;
    const skull = new THREE.Mesh(UNIT_SPHERE, skin);
    skull.scale.set(0.55, 0.6, 0.54);
    h.add(skull);
    const jaw = new THREE.Mesh(UNIT_SPHERE, skin);
    jaw.scale.set(0.45, 0.35, 0.44);
    jaw.position.set(0, -0.2, 0.06);
    h.add(jaw);
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(UNIT_SPHERE, skin);
      ear.scale.set(0.07, 0.13, 0.1);
      ear.position.set(side * 0.53, -0.02, 0);
      h.add(ear);
    }
    const nose = new THREE.Mesh(UNIT_SPHERE, M(new THREE.Color(ap.skin).multiplyScalar(0.93).getStyle(), 0.5));
    nose.scale.set(0.075, 0.09, 0.08);
    nose.position.set(0, -0.06, 0.54);
    h.add(nose);

    // eyes
    h.add(this.eyes);
    for (const side of [-1, 1]) {
      const white = new THREE.Mesh(UNIT_SPHERE, M('#ffffff', 0.25));
      white.scale.set(0.12, 0.14, 0.07);
      white.position.set(side * 0.19, 0.06, 0.5);
      const iris = new THREE.Mesh(UNIT_SPHERE, M(ap.eyes, 0.3));
      iris.scale.set(0.07, 0.08, 0.03);
      iris.position.set(side * 0.19, 0.05, 0.553);
      const pupil = new THREE.Mesh(UNIT_SPHERE, M('#0a0a0a', 0.2));
      pupil.scale.set(0.035, 0.04, 0.02);
      pupil.position.set(side * 0.19, 0.05, 0.575);
      const glint = new THREE.Mesh(UNIT_SPHERE, new THREE.MeshBasicMaterial({ color: '#ffffff' }));
      glint.scale.setScalar(0.017);
      glint.position.set(side * 0.19 - 0.025, 0.09, 0.59);
      this.eyes.add(white, iris, pupil, glint);
      const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.14, 4, 8), M(ap.facialHairColor ?? ap.hair, 0.8));
      brow.rotation.z = Math.PI / 2 + side * 0.12;
      brow.position.set(side * 0.2, 0.26, 0.52);
      h.add(brow);
    }

    // mouth: an arc we can flip for frowns
    this.mouth = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.017, 6, 16, Math.PI), M('#7a2e2a', 0.5));
    this.mouth.position.set(0, -0.22, 0.52);
    this.mouth.rotation.z = Math.PI;
    h.add(this.mouth);

    this.buildHair();
    this.buildFacialHair();
    this.buildHat();
    this.buildAccessory();
  }

  private buildHair(): void {
    const ap = this.ap;
    const hair = M(ap.hair, ap.hairStyle === 'slick' ? 0.3 : 0.8);
    const h = this.head;
    const cap = (r: number, thetaLen: number, tiltX = -0.35) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, thetaLen), hair);
      m.scale.set(1, 1.08, 1);
      m.rotation.x = tiltX;
      return m;
    };
    switch (ap.hairStyle) {
      case 'bald':
        return;
      case 'buzz':
        h.add(cap(0.565, Math.PI * 0.42));
        return;
      case 'short':
      case 'slick':
        h.add(cap(0.58, Math.PI * 0.45));
        {
          const fringe = new THREE.Mesh(UNIT_SPHERE, hair);
          fringe.scale.set(0.35, 0.12, 0.2);
          fringe.position.set(0.05, 0.42, 0.36);
          fringe.rotation.z = -0.2;
          h.add(fringe);
        }
        return;
      case 'wavy': {
        h.add(cap(0.59, Math.PI * 0.47));
        const swoop = new THREE.Mesh(UNIT_SPHERE, hair);
        swoop.scale.set(0.42, 0.16, 0.28);
        swoop.position.set(-0.08, 0.47, 0.3);
        swoop.rotation.z = 0.25;
        h.add(swoop);
        return;
      }
      case 'long': {
        h.add(cap(0.59, Math.PI * 0.5));
        const back = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.4, 6, 16), hair);
        back.position.set(0, -0.15, -0.2);
        back.scale.set(1.1, 1, 0.6);
        h.add(back);
        return;
      }
      case 'curly': {
        h.add(cap(0.57, Math.PI * 0.46));
        const g = new THREE.IcosahedronGeometry(0.1, 1);
        let seed = 7;
        const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        for (let i = 0; i < 60; i++) {
          const theta = Math.acos(1 - rand() * 0.9);
          const phi = rand() * Math.PI * 2;
          const dir = new THREE.Vector3(Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi));
          dir.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.35);
          if (dir.z > 0.2 && dir.y < 0.7) continue; // keep the face clear
          const c = new THREE.Mesh(g, hair);
          c.position.copy(dir.multiplyScalar(0.6));
          c.scale.setScalar(0.8 + rand() * 0.6);
          h.add(c);
        }
        return;
      }
    }
  }

  private buildFacialHair(): void {
    const ap = this.ap;
    if (ap.facialHair === 'none') return;
    const color = ap.facialHairColor ?? ap.hair;
    if (ap.facialHair === 'moustache') {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.16, 4, 8), M(color, 0.9));
      m.rotation.z = Math.PI / 2;
      m.position.set(0, -0.15, 0.55);
      this.head.add(m);
      return;
    }
    const mat =
      ap.facialHair === 'stubble'
        ? new THREE.MeshStandardMaterial({ color, roughness: 1, transparent: true, opacity: 0.45 })
        : M(color, 0.95);
    const beard = new THREE.Mesh(new THREE.SphereGeometry(0.56, 28, 14, Math.PI / 2 - 1.5, 3.0, Math.PI * 0.6, Math.PI * 0.32), mat);
    beard.scale.set(1, 1.02, 1.04);
    beard.position.y = -0.02;
    this.head.add(beard);
    if (ap.facialHair === 'beard') {
      const chin = new THREE.Mesh(UNIT_SPHERE, mat);
      chin.scale.set(0.3, 0.2, 0.25);
      chin.position.set(0, -0.44, 0.22);
      this.head.add(chin);
      const stache = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.16, 4, 8), mat);
      stache.rotation.z = Math.PI / 2;
      stache.position.set(0, -0.15, 0.55);
      this.head.add(stache);
      this.mouth.position.z = 0.56;
    }
  }

  private buildHat(): void {
    const ap = this.ap;
    if (ap.hat === 'none') return;
    const hm = M(ap.hatColor, 0.75);
    const h = this.head;
    const g = new THREE.Group();
    h.add(g);
    switch (ap.hat) {
      case 'cap':
      case 'capBack': {
        const crown = new THREE.Mesh(new THREE.SphereGeometry(0.61, 28, 12, 0, Math.PI * 2, 0, Math.PI * 0.42), hm);
        crown.scale.set(1, 1.02, 1);
        crown.position.y = 0.08;
        crown.rotation.x = -0.12;
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.035, 24, 1, false, -Math.PI / 2, Math.PI), hm);
        brim.scale.set(1, 1, 1.05);
        brim.position.set(0, 0.28, ap.hat === 'cap' ? 0.44 : -0.44);
        brim.rotation.x = ap.hat === 'cap' ? 0.18 : -0.18;
        if (ap.hat === 'capBack') brim.rotation.y = Math.PI;
        const button = new THREE.Mesh(UNIT_SPHERE, hm);
        button.scale.setScalar(0.05);
        button.position.set(0, 0.68, -0.08);
        const logo = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), M(ap.shirtAccent === ap.hatColor ? '#ffffff' : ap.shirtAccent, 0.5));
        logo.position.set(0, 0.42, 0.5);
        logo.rotation.x = -0.55;
        g.add(crown, brim, button);
        if (ap.hat === 'cap') g.add(logo);
        break;
      }
      case 'visor': {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.585, 0.585, 0.14, 28, 1, true), hm);
        band.position.y = 0.26;
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.035, 24, 1, false, -Math.PI / 2, Math.PI), hm);
        brim.position.set(0, 0.24, 0.45);
        brim.rotation.x = 0.18;
        g.add(band, brim);
        break;
      }
      case 'flatcap': {
        const crown = new THREE.Mesh(UNIT_SPHERE, hm);
        crown.scale.set(0.63, 0.26, 0.66);
        crown.position.set(0, 0.43, 0.04);
        crown.rotation.x = 0.15;
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.035, 24, 1, false, -Math.PI / 2, Math.PI), hm);
        brim.position.set(0, 0.36, 0.43);
        brim.rotation.x = 0.35;
        g.add(crown, brim);
        break;
      }
      case 'bucket': {
        const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.6, 0.45, 24), hm);
        crown.position.y = 0.45;
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.03, 28), hm);
        brim.position.y = 0.24;
        g.add(crown, brim);
        break;
      }
    }
  }

  private buildAccessory(): void {
    const ap = this.ap;
    if (ap.accessory === 'sunglasses' || ap.accessory === 'glasses') {
      const dark = ap.accessory === 'sunglasses';
      for (const side of [-1, 1]) {
        const lens = new THREE.Mesh(
          dark ? UNIT_SPHERE : new THREE.TorusGeometry(0.11, 0.018, 6, 18),
          dark ? M('#101418', 0.1, 0.6) : M('#222222', 0.4),
        );
        if (dark) lens.scale.set(0.13, 0.1, 0.04);
        lens.position.set(side * 0.19, 0.06, 0.56);
        this.head.add(lens);
      }
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), M('#222222'));
      bridge.position.set(0, 0.1, 0.57);
      this.head.add(bridge);
    }
  }

  private buildPutter(): void {
    const ap = this.ap;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), M('#d9dde2', 0.2, 0.9));
    shaft.name = 'shaft';
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.55, 10), M(ap.putter === 'armlock' ? '#e8e8e8' : '#1e1e1e', 0.7));
    grip.name = 'grip';
    let head: THREE.Mesh;
    if (ap.putter === 'mallet') {
      head = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.07, 20, 1, false, Math.PI, Math.PI), M('#3a3f45', 0.3, 0.8));
    } else {
      head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.34), M('#b8bec6', 0.25, 0.9));
    }
    head.name = 'head';
    this.putter.add(shaft, grip, head);
    this.putter.userData = { shaft, grip, head };
  }

  /* ------------------------------------------------------------ control */

  setMode(mode: GolferMode): void {
    if (mode === this.mode) return;
    this.from = { ...this.pose };
    this.blend = 0;
    this.mode = mode;
    this.modeTime = 0;
    this.jump = 0;
  }

  /** Stroke pendulum: -1 full backswing ... 0 address ... +1 follow through. */
  setStroke(angle: number): void {
    this.strokeAngle = angle;
  }

  celebrate(big: boolean): void {
    this.setMode('celebrate');
    this.jump = big ? 1 : 0;
  }

  update(dt: number): void {
    this.t += dt;
    this.modeTime += dt;
    this.blend = Math.min(1, this.blend + dt / 0.35);
    const target = this.targetPose(this.modeTime);
    const k = this.blend * this.blend * (3 - 2 * this.blend);
    this.pose = blendPose(this.from, target, k);
    this.apply(this.pose);
  }

  private targetPose(t: number): Pose {
    const breathe = Math.sin(this.t * 1.7) * 0.012;
    const base: Pose = {
      hipDrop: 0,
      lean: 0.05 + breathe,
      twist: 0,
      sway: Math.sin(this.t * 0.6) * 0.03,
      headYaw: Math.sin(this.t * 0.37) * 0.25 + Math.sin(this.t * 0.11) * 0.2,
      headPitch: -0.04,
      footL: [0.32, 0, 0.02],
      footR: [-0.32, 0, 0],
      handL: [0.72, 2.2, 0.12],
      handR: [-0.7, 2.22, 0.3],
      putterHead: [-0.95, 0.03, 0.9],
      hold: 'rightHand',
      lift: 0,
      smile: 1,
    };
    switch (this.mode) {
      case 'idle':
      case 'showcase': {
        if (this.mode === 'showcase') {
          // hero pose: putter planted, hand on hip
          base.handL = [0.62, 2.35, -0.1];
          base.headYaw *= 0.5;
        }
        return base;
      }
      case 'address': {
        const lean = 0.55;
        const pivot = new THREE.Vector3(0, 2.25 + 1.2 * Math.cos(lean), 1.2 * Math.sin(lean));
        const phi = this.strokeAngle * 0.42;
        const grip = new THREE.Vector3(0, 2.05, 0.95);
        const headP = new THREE.Vector3(BALL_OFFSET_AT_ADDRESS.x - 0.14, 0.05, BALL_OFFSET_AT_ADDRESS.z - 0.12);
        const rot = (v: THREE.Vector3) => {
          const rel = v.clone().sub(pivot);
          const c = Math.cos(phi);
          const s = Math.sin(phi);
          return new THREE.Vector3(rel.x * c - rel.y * s, rel.x * s + rel.y * c, rel.z).add(pivot);
        };
        const g2 = rot(grip);
        const h2 = rot(headP);
        const glance = Math.max(0, Math.sin(this.t * 0.9) - 0.6) * 2.2;
        return {
          ...base,
          hipDrop: 0.14,
          lean,
          sway: 0,
          twist: phi * 0.5,
          headYaw: glance * 0.9,
          headPitch: 0.55 - glance * 0.2,
          footL: [0.52, 0, 0.02],
          footR: [-0.52, 0, 0],
          handL: [g2.x, g2.y, g2.z],
          handR: [g2.x + (h2.x - g2.x) * 0.1, g2.y + (h2.y - g2.y) * 0.1, g2.z + (h2.z - g2.z) * 0.1],
          putterHead: [h2.x, h2.y, h2.z],
          hold: 'address',
        };
      }
      case 'celebrate':
        return this.celebratePose(t, base);
      case 'dejected': {
        const shake = Math.sin(t * 5) * 0.35 * Math.max(0, 1 - t / 2.5);
        return {
          ...base,
          lean: 0.12,
          headPitch: 0.35,
          headYaw: shake,
          handL: [0.52, 2.45, -0.05],
          handR: [-0.52, 2.45, -0.05],
          putterHead: [-1.1, 0.02, 0.6],
          hold: 'ground',
          smile: -1,
        };
      }
    }
  }

  private celebratePose(t: number, base: Pose): Pose {
    const hop = this.jump ? Math.max(0, Math.sin(Math.min(t, 2.4) * 7.5)) * 0.45 * Math.max(0, 1 - t / 2.4) : 0;
    const p: Pose = { ...base, lift: hop, headPitch: -0.15, headYaw: 0, handL: [0.72, 2.25, 0.15], putterHead: [0.9, 0.02, 0.8], hold: 'leftHand', smile: 1 };
    switch (this.celebration) {
      case 'fistPump': {
        const pump = t < 1.6 ? Math.abs(Math.sin(t * 7)) : 0.6;
        p.handR = [-0.5, 2.9 + pump * 1.1, 0.65];
        p.hipDrop = 0.12 * pump;
        p.lean = 0.12;
        return p;
      }
      case 'armsUp':
        p.handL = [0.8, 5.5, 0.2];
        p.handR = [-0.8, 5.5, 0.2];
        p.hold = 'ground';
        p.putterHead = [-1.2, 0.02, 0.4];
        p.headPitch = -0.35;
        return p;
      case 'capTip':
        p.handR = t < 1.8 ? [-0.2, 4.72, 0.72] : [-0.7, 2.22, 0.3];
        p.headPitch = t < 1.8 ? 0.2 : -0.05;
        return p;
      case 'point':
        p.handR = [-0.3, 3.95, 1.75];
        p.headYaw = -0.2;
        return p;
      case 'uppercut': {
        const k = Math.min(1, t / 0.5);
        p.handR = [-0.45 + k * 0.1, 2.3 + k * 1.8, 0.4 + k * 0.4];
        p.hipDrop = 0.1 * (1 - k);
        p.twist = -0.3 * k;
        return p;
      }
      case 'bow':
        p.lean = t < 2 ? 0.6 : 0.05;
        p.handR = [-0.1, 3.3, 0.55];
        return p;
    }
  }

  private apply(p: Pose): void {
    const r = this.root;
    this.torso.position.y = 2.35 - p.hipDrop + p.lift;
    this.torso.rotation.set(p.lean, p.twist, p.sway);
    this.head.rotation.set(p.headPitch - p.lean * 0.4, p.headYaw, 0);
    this.mouth.rotation.z = p.smile >= 0 ? Math.PI : 0;
    this.mouth.position.y = p.smile >= 0 ? -0.22 : -0.28;

    // blink
    const blink = (this.t % 3.7) < 0.12 ? 0.1 : 1;
    this.eyes.scale.y = blink;

    r.updateMatrixWorld(true);
    const toRoot = (o: THREE.Object3D) => {
      const v = new THREE.Vector3();
      o.getWorldPosition(v);
      return r.worldToLocal(v);
    };
    const hipY = 2.3 - p.hipDrop + p.lift;
    const b = this.ap.build;
    const mid = new THREE.Vector3();
    const end = new THREE.Vector3();

    // legs
    for (const [side, foot, sx] of [
      ['L', p.footL, 1],
      ['R', p.footR, -1],
    ] as const) {
      const hip = new THREE.Vector3(sx * 0.24 * b, hipY, 0);
      const f = new THREE.Vector3(foot[0], foot[1] + 0.2 + p.lift, foot[2]);
      solveIK(hip, f, 1.08, 1.05, new THREE.Vector3(sx * 0.15, 0, 1), mid, end);
      seg(this.limbs[`thigh${side}`], hip, mid, 0.2);
      seg(this.limbs[`shin${side}`], mid, end, 0.17);
      this.limbs[`knee${side}`].position.copy(mid);
      this.limbs[`knee${side}`].scale.setScalar(0.185);
      const shoe = this.limbs[`shoe${side}`];
      shoe.position.set(end.x + sx * 0.02, end.y - 0.1, end.z + 0.16);
      shoe.rotation.set(Math.PI / 2, 0, sx * -0.15);
      this.limbs[`sole${side}`].position.set(end.x + sx * 0.02, end.y - 0.19, end.z + 0.16);
      this.limbs[`sole${side}`].rotation.set(0, sx * 0.15, 0);
    }

    // arms
    const handPos: Record<'L' | 'R', THREE.Vector3> = { L: new THREE.Vector3(), R: new THREE.Vector3() };
    for (const [side, target, sx] of [
      ['L', p.handL, 1],
      ['R', p.handR, -1],
    ] as const) {
      const sh = toRoot(side === 'L' ? this.shoulderL : this.shoulderR);
      const tgt = new THREE.Vector3(target[0], target[1] + p.lift, target[2]);
      const pole = p.hold === 'address' ? new THREE.Vector3(sx * 1, -0.2, -0.3) : new THREE.Vector3(sx * 0.7, -0.4, -0.8);
      solveIK(sh, tgt, 0.86, 0.8, pole, mid, end);
      const sleeveEnd = sh.clone().lerp(mid, 0.55);
      seg(this.limbs[`upper${side}`], sh, mid, 0.14);
      seg(this.limbs[`sleeve${side}`], sh, sleeveEnd, 0.19);
      seg(this.limbs[`fore${side}`], mid, end, 0.12);
      this.limbs[`elbow${side}`].position.copy(mid);
      this.limbs[`elbow${side}`].scale.setScalar(0.13);
      const hand = this.limbs[`hand${side}`];
      hand.position.copy(end);
      hand.scale.set(0.13, 0.14, 0.13);
      handPos[side] = end.clone();
      if (side === 'L' && this.limbs.watch) {
        const w = this.limbs.watch;
        w.position.copy(mid.clone().lerp(end, 0.85));
        w.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), end.clone().sub(mid).normalize());
      }
    }

    // putter
    const head = new THREE.Vector3(p.putterHead[0], p.putterHead[1] + (p.hold === 'ground' ? 0 : p.lift), p.putterHead[2]);
    let grip: THREE.Vector3;
    if (p.hold === 'address') grip = handPos.L.clone().lerp(handPos.R, 0.5);
    else if (p.hold === 'rightHand') grip = handPos.R.clone();
    else if (p.hold === 'leftHand') grip = handPos.L.clone();
    else grip = new THREE.Vector3(p.putterHead[0] + 0.1, 0.05, p.putterHead[2] - this.putterLen);
    const dir = new THREE.Vector3().subVectors(head, grip);
    if (p.hold !== 'ground') dir.setLength(this.putterLen);
    else {
      head.y = 0.04;
      grip.y = 0.06;
    }
    const realHead = grip.clone().add(dir);
    const { shaft, grip: gripMesh, head: headMesh } = this.putter.userData as Record<string, THREE.Mesh>;
    seg(shaft, grip, realHead, 1);
    shaft.scale.x = shaft.scale.z = 1;
    const gEnd = grip.clone().addScaledVector(dir.clone().normalize(), 0.5);
    seg(gripMesh, grip.clone().addScaledVector(dir.clone().normalize(), -0.05), gEnd, 1);
    gripMesh.scale.x = gripMesh.scale.z = 1;
    gripMesh.scale.y = gEnd.distanceTo(grip) / 0.55;
    headMesh.position.copy(realHead).add(new THREE.Vector3(0, 0.02, 0.12));
  }

  /** world-space top of head, for cameras */
  headWorld(out = new THREE.Vector3()): THREE.Vector3 {
    return this.head.getWorldPosition(out);
  }

  dispose(): void {
    this.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.geometry !== UNIT_CYL && m.geometry !== UNIT_SPHERE) m.geometry.dispose();
    });
  }
}

function blendPose(a: Pose, b: Pose, k: number): Pose {
  return {
    hipDrop: lerp(a.hipDrop, b.hipDrop, k),
    lean: lerp(a.lean, b.lean, k),
    twist: lerp(a.twist, b.twist, k),
    sway: lerp(a.sway, b.sway, k),
    headYaw: lerp(a.headYaw, b.headYaw, k),
    headPitch: lerp(a.headPitch, b.headPitch, k),
    footL: lerp3(a.footL, b.footL, k),
    footR: lerp3(a.footR, b.footR, k),
    handL: lerp3(a.handL, b.handL, k),
    handR: lerp3(a.handR, b.handR, k),
    putterHead: lerp3(a.putterHead, b.putterHead, k),
    hold: k > 0.5 ? b.hold : a.hold,
    lift: lerp(a.lift, b.lift, k),
    smile: k > 0.5 ? b.smile : a.smile,
  };
}

/** Simple golf bag prop for menus. */
export function buildGolfBag(color: string): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 2.8, 20), M(color, 0.55));
  body.position.y = 1.4;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.25, 20), M('#ffffff', 0.5));
  band.position.y = 2.55;
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.2), M('#ffffff', 0.6));
  pocket.position.set(0, 1.2, 0.4);
  g.add(body, band, pocket);
  for (let i = 0; i < 5; i++) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), M('#cfd4da', 0.2, 0.8));
    const a = (i / 5) * Math.PI * 2;
    shaft.position.set(Math.cos(a) * 0.2, 3.2, Math.sin(a) * 0.2);
    const cover = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), M(i % 2 ? '#1a1a1a' : color, 0.6));
    cover.scale.set(1, 1.3, 1);
    cover.position.set(Math.cos(a) * 0.2, 3.85, Math.sin(a) * 0.2);
    g.add(shaft, cover);
  }
  g.rotation.z = 0.12;
  g.traverse((o) => ((o as THREE.Mesh).isMesh ? (o.castShadow = true) : null));
  return g;
}
