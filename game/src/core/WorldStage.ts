import * as THREE from 'three';
import type { CourseData, GolferData, HoleLayout } from '../data/types';
import { BALL_RADIUS } from '../systems/BallPhysics';
import { CameraController } from '../systems/CameraController';
import { CourseDatabase } from '../systems/CourseDatabase';
import { VFXManager } from '../systems/VFXManager';
import { BALL_OFFSET_AT_ADDRESS, GolferModel } from '../world/GolferModel';
import { HoleModel } from '../world/HoleModel';
import { HoleScene } from '../world/HoleScene';
import type { Quality, Stage } from './Engine';

const FLAG_COLORS: Record<string, string> = { augusta: '#f2c94c', pebble: '#e8e0c8', sawgrass: '#e03a3e', standrews: '#e03a3e', pinehurst: '#d8d0b0' };

/** The 3D world a hole is played in: hole scene, golfer, ball, aim visuals, camera and VFX. */
export class WorldStage implements Stage {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.05, 900);
  readonly cam = new CameraController(this.camera);
  readonly vfx = new VFXManager();
  hole: HoleScene | null = null;
  model: HoleModel | null = null;
  course: CourseData | null = null;
  golfer: GolferModel | null = null;
  readonly ball = new THREE.Group();
  private ballMesh: THREE.Mesh;
  private ballShadow: THREE.Mesh;
  private aim = new THREE.Group();
  private arrow: THREE.Mesh;
  private dots: THREE.InstancedMesh;
  private ring: THREE.Mesh;
  private cache = new Map<string, HoleScene>();
  quality: Quality;
  wind = 1;
  private leaderNames: string[];

  constructor(quality: Quality, leaderNames: string[]) {
    this.quality = quality;
    this.leaderNames = leaderNames;
    this.scene.add(this.vfx.group);

    // ball: dimpled look via a tiny normal-ish bump using flat shading off + clearcoat
    const bc = document.createElement('canvas');
    bc.width = 256;
    bc.height = 128;
    const bx = bc.getContext('2d')!;
    bx.fillStyle = '#ffffff';
    bx.fillRect(0, 0, 256, 128);
    bx.fillStyle = 'rgba(0,0,0,0.07)';
    for (let j = 0; j < 12; j++) for (let i = 0; i < 26; i++) {
      bx.beginPath();
      bx.arc(i * 10 + (j % 2) * 5, j * 11 + 4, 3, 0, Math.PI * 2);
      bx.fill();
    }
    bx.fillStyle = '#1b5e3b';
    bx.fillRect(0, 61, 256, 6); // alignment line so you can see it roll
    const btex = new THREE.CanvasTexture(bc);
    btex.colorSpace = THREE.SRGBColorSpace;
    this.ballMesh = new THREE.Mesh(new THREE.SphereGeometry(BALL_RADIUS, 24, 16), new THREE.MeshPhysicalMaterial({ color: '#ffffff', map: btex, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 }));
    this.ballMesh.castShadow = true;
    this.ballShadow = new THREE.Mesh(
      new THREE.CircleGeometry(BALL_RADIUS * 1.5, 20),
      new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.3, depthWrite: false }),
    );
    this.ballShadow.rotation.x = -Math.PI / 2;
    this.ballShadow.renderOrder = 3;
    this.ball.add(this.ballMesh);
    this.scene.add(this.ball, this.ballShadow);

    // aim visuals
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(-0.05, 0);
    arrowShape.lineTo(0.05, 0);
    arrowShape.lineTo(0.05, 0.8);
    arrowShape.lineTo(0.14, 0.8);
    arrowShape.lineTo(0, 1);
    arrowShape.lineTo(-0.14, 0.8);
    arrowShape.lineTo(-0.05, 0.8);
    arrowShape.closePath();
    const ag = new THREE.ShapeGeometry(arrowShape);
    ag.rotateX(-Math.PI / 2);
    this.arrow = new THREE.Mesh(ag, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }));
    this.arrow.renderOrder = 5;
    this.dots = new THREE.InstancedMesh(new THREE.CircleGeometry(0.035, 12).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false }), 80);
    this.dots.renderOrder = 5;
    this.dots.frustumCulled = false;
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.24, 48, 1, 0, Math.PI * 2).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, depthWrite: false, toneMapped: false }));
    this.ring.renderOrder = 5;
    this.aim.add(this.arrow, this.dots, this.ring);
    this.aim.visible = false;
    this.scene.add(this.aim);
  }

  /** Build (or fetch cached) the 3D recreation of a real hole. */
  loadHole(layout: HoleLayout): void {
    if (this.hole) this.scene.remove(this.hole.group);
    const course = CourseDatabase.course(layout.courseId);
    this.course = course;
    let hs = this.cache.get(layout.id);
    if (!hs) {
      const model = new HoleModel(layout);
      hs = new HoleScene(model, { diorama: false, quality: this.quality, atmosphere: course.atmosphere, flagColor: FLAG_COLORS[course.id] ?? '#f2c94c', leaderNames: this.leaderNames });
      this.cache.set(layout.id, hs);
      // keep memory bounded on phones
      if (this.cache.size > 3) {
        const first = this.cache.keys().next().value as string;
        if (first !== layout.id) {
          this.cache.get(first)!.dispose();
          this.cache.delete(first);
        }
      }
    }
    this.hole = hs;
    this.model = hs.model;
    this.scene.add(hs.group);
    this.scene.fog = new THREE.Fog(course.atmosphere.fog, 70, 260);
    this.scene.background = new THREE.Color(course.atmosphere.sky.horizon);
  }

  setGolfer(data: GolferData): void {
    if (this.golfer) {
      this.scene.remove(this.golfer.root);
      this.golfer.dispose();
    }
    this.golfer = new GolferModel(data);
    this.scene.add(this.golfer.root);
  }

  setBallColor(color: string, trail: string): void {
    (this.ballMesh.material as THREE.MeshPhysicalMaterial).color.set(color);
    this.vfx.setTrailColor(trail);
  }

  /** hole-space -> world */
  world(x: number, y: number, h?: number): THREE.Vector3 {
    const hh = h ?? this.model!.surfaceHeight(x, y);
    return new THREE.Vector3(x, hh, -y);
  }

  placeBall(x: number, y: number, h: number, roll?: { dx: number; dy: number; angle: number }): void {
    this.ball.position.set(x, h + BALL_RADIUS, -y);
    this.ball.visible = true;
    this.ballShadow.position.set(x, h + 0.008, -y);
    this.ballShadow.visible = true;
    if (roll && roll.angle !== 0 && (roll.dx || roll.dy)) {
      // rolling axis = up x velocity, velocity in world = (dx, 0, -dy)
      const axis = new THREE.Vector3(-roll.dy, 0, -roll.dx).normalize();
      this.ballMesh.rotateOnWorldAxis(axis, roll.angle);
    }
  }

  sinkBall(depth: number, center?: THREE.Vector3): void {
    if (center) this.ball.position.x += (center.x - this.ball.position.x) * 0.3;
    if (center) this.ball.position.z += (center.z - this.ball.position.z) * 0.3;
    this.ball.position.y -= depth;
    this.ballShadow.visible = false;
  }

  hideBall(): void {
    this.ball.visible = false;
    this.ballShadow.visible = false;
  }

  /** Put the golfer at address for a putt along world direction `dir`. */
  addressBall(ball: THREE.Vector3, dir: THREE.Vector3): void {
    const g = this.golfer;
    if (!g || !this.model) return;
    const theta = Math.atan2(-dir.z, dir.x);
    g.root.rotation.set(0, theta, 0);
    const s = g.root.scale.x;
    const off = BALL_OFFSET_AT_ADDRESS.clone().multiplyScalar(s).applyAxisAngle(new THREE.Vector3(0, 1, 0), theta);
    const p = ball.clone().sub(off);
    const hx = p.x;
    const hy = -p.z;
    const ground = this.model.surfaceHeight(hx, hy);
    p.y = Math.max(ground, ball.y - BALL_RADIUS - 0.35, 0.04);
    g.root.position.copy(p);
    g.setMode('address');
  }

  /** golfer standing somewhere for menus / celebrations */
  standGolfer(pos: THREE.Vector3, face: THREE.Vector3): void {
    const g = this.golfer;
    if (!g) return;
    g.root.position.copy(pos);
    g.root.rotation.set(0, Math.atan2(face.x, face.z), 0);
  }

  showAim(visible: boolean): void {
    this.aim.visible = visible;
  }

  updateAim(ball: THREE.Vector3, dir: THREE.Vector3, power: number, path: [number, number, number][], dragging: boolean): void {
    this.aim.visible = true;
    const yaw = Math.atan2(dir.x, dir.z);
    this.arrow.position.copy(ball).add(new THREE.Vector3(0, 0.02 - BALL_RADIUS, 0));
    this.arrow.rotation.set(0, yaw + Math.PI, 0);
    const len = 0.35 + power * 2.2;
    this.arrow.scale.set(1 + power * 0.6, 1, len);
    this.arrow.visible = dragging && power > 0.02;
    const c = new THREE.Color().setHSL(0.33 - power * 0.33, 0.85, 0.55);
    (this.arrow.material as THREE.MeshBasicMaterial).color.copy(c);
    this.ring.position.copy(ball).add(new THREE.Vector3(0, 0.015 - BALL_RADIUS, 0));
    const pulse = 1 + Math.sin(performance.now() / 250) * 0.06;
    this.ring.scale.setScalar(pulse * (dragging ? 1 + power * 0.8 : 1));
    (this.ring.material as THREE.MeshBasicMaterial).color.copy(dragging ? c : new THREE.Color('#ffffff'));

    const m = new THREE.Matrix4();
    let n = 0;
    if (dragging) {
      for (let i = 1; i < path.length && n < 80; i++) {
        const [x, y, h] = path[i];
        const s = 1 - i / (path.length + 2);
        m.compose(new THREE.Vector3(x, h + 0.02, -y), new THREE.Quaternion(), new THREE.Vector3(s, s, s));
        this.dots.setMatrixAt(n++, m);
      }
    }
    this.dots.count = n;
    this.dots.instanceMatrix.needsUpdate = true;
  }

  /** shift the rendered subject horizontally (fraction of width, + = right) for menu layouts */
  frameShift = 0;
  private size = { w: 1, h: 1 };

  resize(w: number, h: number): void {
    this.size = { w, h };
  }

  update(dt: number): void {
    if (this.frameShift) this.camera.setViewOffset(this.size.w, this.size.h, -this.size.w * this.frameShift, 0, this.size.w, this.size.h);
    else if (this.camera.view?.enabled) this.camera.clearViewOffset();
    this.hole?.update(dt, this.wind);
    this.golfer?.update(dt);
    this.cam.update(dt);
    this.vfx.update(dt, this.camera);
  }
}
