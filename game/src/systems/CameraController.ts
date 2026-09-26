import * as THREE from 'three';

export type CameraMode = 'free' | 'flyover' | 'aim' | 'follow' | 'cup' | 'golfer' | 'overview' | 'orbit' | 'watch';

const tmp = new THREE.Vector3();

/**
 * Cinematic camera: every mode produces a desired eye + look-at target and the rig eases toward it,
 * so cuts only happen when we want them to.
 */
export class CameraController {
  readonly camera: THREE.PerspectiveCamera;
  mode: CameraMode = 'free';
  private eye = new THREE.Vector3(0, 10, 10);
  private look = new THREE.Vector3();
  private wantEye = new THREE.Vector3();
  private wantLook = new THREE.Vector3();
  private stiffness = 4;
  private fovTarget = 50;

  // aim
  aimYaw = 0;
  zoom = 0.45;
  private ballPos = new THREE.Vector3();
  private velDir = new THREE.Vector3(0, 0, -1);
  private cupPos = new THREE.Vector3();
  private orbitCenter = new THREE.Vector3();
  private orbitRadius = 10;
  private orbitHeight = 5;
  private orbitAngle = 0;
  private orbitSpeed = 0.1;
  private golferPos = new THREE.Vector3();
  private golferFacing = new THREE.Vector3(0, 0, 1);
  private overviewEye = new THREE.Vector3();
  private overviewLook = new THREE.Vector3();

  // flyover
  private flyEye?: THREE.CatmullRomCurve3;
  private flyLook?: THREE.CatmullRomCurve3;
  private flyT = 0;
  private flyDur = 6;
  private flyDone?: () => void;
  shake = 0;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  snap(): void {
    this.computeWant(0);
    this.eye.copy(this.wantEye);
    this.look.copy(this.wantLook);
    this.apply();
  }

  set(eye: THREE.Vector3, look: THREE.Vector3, snap = false): void {
    this.mode = 'free';
    this.wantEye.copy(eye);
    this.wantLook.copy(look);
    if (snap) this.snap();
  }

  flyover(eyes: THREE.Vector3[], looks: THREE.Vector3[], duration: number, done?: () => void): void {
    this.mode = 'flyover';
    this.flyEye = new THREE.CatmullRomCurve3(eyes, false, 'centripetal');
    this.flyLook = new THREE.CatmullRomCurve3(looks, false, 'centripetal');
    this.flyT = 0;
    this.flyDur = duration;
    this.flyDone = done;
    this.eye.copy(eyes[0]);
    this.look.copy(looks[0]);
    this.apply();
  }

  skipFlyover(): void {
    if (this.mode === 'flyover') this.flyT = this.flyDur;
  }

  aim(ball: THREE.Vector3, cup: THREE.Vector3): void {
    this.mode = 'aim';
    this.ballPos.copy(ball);
    this.cupPos.copy(cup);
    this.stiffness = 3.2;
  }

  pointAt(target: THREE.Vector3): void {
    this.aimYaw = Math.atan2(target.x - this.ballPos.x, -(target.z - this.ballPos.z));
  }

  follow(): void {
    this.mode = 'follow';
    this.stiffness = 3;
  }

  updateBall(p: THREE.Vector3, v: THREE.Vector3, cup: THREE.Vector3): void {
    this.ballPos.copy(p);
    this.cupPos.copy(cup);
    if (v.lengthSq() > 0.25) this.velDir.lerp(tmp.copy(v).setY(0).normalize(), 0.04).normalize();
  }

  watchCup(cup: THREE.Vector3): void {
    this.mode = 'cup';
    this.cupPos.copy(cup);
    this.orbitAngle = Math.atan2(this.eye.x - cup.x, this.eye.z - cup.z);
    this.stiffness = 2.2;
  }

  watch(target: THREE.Vector3): void {
    this.mode = 'watch';
    this.wantLook.copy(target);
    this.stiffness = 2.5;
  }

  golfer(pos: THREE.Vector3, facing: THREE.Vector3): void {
    this.mode = 'golfer';
    this.golferPos.copy(pos);
    this.golferFacing.copy(facing).setY(0).normalize();
    this.stiffness = 2.4;
  }

  overview(eye: THREE.Vector3, look: THREE.Vector3): void {
    this.mode = 'overview';
    this.overviewEye.copy(eye);
    this.overviewLook.copy(look);
    this.stiffness = 2.5;
  }

  orbit(center: THREE.Vector3, radius: number, height: number, speed: number, angle?: number): void {
    this.mode = 'orbit';
    this.orbitCenter.copy(center);
    this.orbitRadius = radius;
    this.orbitHeight = height;
    this.orbitSpeed = speed;
    if (angle !== undefined) this.orbitAngle = angle;
    this.stiffness = 1.5;
  }

  get aimDir(): THREE.Vector3 {
    return new THREE.Vector3(Math.sin(this.aimYaw), 0, -Math.cos(this.aimYaw));
  }

  update(dt: number): void {
    if (this.mode === 'flyover') {
      this.updateFlyover(dt);
      return;
    }
    this.computeWant(dt);
    const a = 1 - Math.exp(-this.stiffness * dt);
    this.eye.lerp(this.wantEye, a);
    this.look.lerp(this.wantLook, Math.min(1, a * 1.6));
    this.camera.fov += (this.fovTarget - this.camera.fov) * a;
    this.camera.updateProjectionMatrix();
    this.apply();
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 2);
      this.camera.position.x += (Math.random() - 0.5) * this.shake * 0.08;
      this.camera.position.y += (Math.random() - 0.5) * this.shake * 0.08;
    }
  }

  private updateFlyover(dt: number): void {
    this.flyT += dt;
    const k = Math.min(1, this.flyT / this.flyDur);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    this.flyEye!.getPointAt(e, this.eye);
    this.flyLook!.getPointAt(e, this.look);
    this.apply();
    if (k >= 1) {
      this.mode = 'free';
      this.wantEye.copy(this.eye);
      this.wantLook.copy(this.look);
      const done = this.flyDone;
      this.flyDone = undefined;
      done?.();
    }
  }

  private computeWant(dt: number): void {
    switch (this.mode) {
      case 'aim': {
        const d = this.aimDir;
        const right = tmp.set(-d.z, 0, d.x);
        const dist = THREE.MathUtils.lerp(3.6, 12, this.zoom);
        const h = THREE.MathUtils.lerp(2.6, 8.5, this.zoom * this.zoom);
        // sit off the golfer's back shoulder so the line and the hole stay visible
        this.wantEye.copy(this.ballPos).addScaledVector(d, -dist).addScaledVector(right, THREE.MathUtils.lerp(1.5, 0.6, this.zoom)).add(new THREE.Vector3(0, h, 0));
        this.wantLook.copy(this.ballPos).addScaledVector(d, THREE.MathUtils.lerp(4.5, 9, this.zoom)).addScaledVector(right, 0.3).add(new THREE.Vector3(0, -0.4, 0));
        this.fovTarget = 52;
        break;
      }
      case 'follow': {
        const toCup = tmp.copy(this.cupPos).sub(this.ballPos);
        const near = toCup.setY(0).length();
        const close = THREE.MathUtils.clamp(1 - (near - 1) / 5, 0, 1);
        const dist = THREE.MathUtils.lerp(4.2, 2.4, close);
        const h = THREE.MathUtils.lerp(2.6, 1.0, close);
        this.wantEye.copy(this.ballPos).addScaledVector(this.velDir, -dist).add(new THREE.Vector3(0, h, 0));
        this.wantLook.copy(this.ballPos).addScaledVector(this.velDir, THREE.MathUtils.lerp(2.5, 0.8, close));
        this.fovTarget = THREE.MathUtils.lerp(52, 44, close);
        break;
      }
      case 'cup': {
        this.orbitAngle += dt * 0.35;
        this.wantEye.set(this.cupPos.x + Math.sin(this.orbitAngle) * 2.1, this.cupPos.y + 0.75, this.cupPos.z + Math.cos(this.orbitAngle) * 2.1);
        this.wantLook.copy(this.cupPos).add(tmp.set(0, 0.05, 0));
        this.fovTarget = 42;
        break;
      }
      case 'watch':
        break;
      case 'golfer': {
        const f = this.golferFacing;
        const side = new THREE.Vector3(-f.z, 0, f.x);
        this.wantEye.copy(this.golferPos).addScaledVector(f, 5.2).addScaledVector(side, -1.4).add(tmp.set(0, 3.0, 0));
        this.wantLook.copy(this.golferPos).add(tmp.set(0, 2.9, 0));
        this.fovTarget = 40;
        break;
      }
      case 'overview':
        this.wantEye.copy(this.overviewEye);
        this.wantLook.copy(this.overviewLook);
        this.fovTarget = 50;
        break;
      case 'orbit':
        this.orbitAngle += dt * this.orbitSpeed;
        this.wantEye.set(this.orbitCenter.x + Math.sin(this.orbitAngle) * this.orbitRadius, this.orbitCenter.y + this.orbitHeight, this.orbitCenter.z + Math.cos(this.orbitAngle) * this.orbitRadius);
        this.wantLook.copy(this.orbitCenter);
        break;
      case 'free':
      case 'flyover':
        break;
    }
  }

  private apply(): void {
    this.camera.position.copy(this.eye);
    this.camera.lookAt(this.look);
  }
}
