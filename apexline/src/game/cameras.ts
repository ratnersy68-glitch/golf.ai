import * as THREE from 'three';
import { Track, DS, locate, frameAt } from '../sim/track';

export const CAMERA_NAMES = ['Chase', 'Close Chase', 'Far Chase', 'Hood', 'Bumper', 'Cockpit', 'Cinematic', 'Free'];
export interface CamPose { p: THREE.Vector3; f: THREE.Vector3; u: THREE.Vector3 }

const v = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();

export class CameraRig {
  mode = 0;
  sf = new THREE.Vector3(0, 0, -1); su = new THREE.Vector3(0, 1, 0);
  pos = new THREE.Vector3(); look = new THREE.Vector3();
  shake = 0; shakeT = 0;
  fov = 68; init = false;
  cineAnchor = new THREE.Vector3(); cineIdx = -1;
  orbit = { yaw: 0, pitch: 0.3, dist: 8 };
  carLength = 4.4; carHeight = 1.3;
  reduced = false; shakeScale = 1;
  tmpFrame = { px: 0, py: 0, pz: 0, tx: 0, ty: 0, tz: 0, ux: 0, uy: 0, uz: 0, rx: 0, ry: 0, rz: 0 };

  reset() { this.init = false; this.cineIdx = -1; this.shake = 0; }
  impact(a: number) { this.shake = Math.min(1.2, this.shake + a * 0.04 * this.shakeScale); }

  update(cam: THREE.PerspectiveCamera, dt: number, pose: CamPose, speed: number, track: Track | null, hintIdx: number, airborne: boolean) {
    const kf = 1 - Math.exp(-dt * (airborne ? 2.4 : 7)), ku = 1 - Math.exp(-dt * 2.8);
    if (!this.init) { this.sf.copy(pose.f); this.su.copy(pose.u); this.init = true; this.pos.copy(pose.p); }
    this.sf.lerp(pose.f, kf).normalize();
    this.su.lerp(pose.u, ku); this.su.addScaledVector(this.sf, -this.su.dot(this.sf)).normalize();
    const mode = this.mode;
    let baseFov = 68 + Math.min(20, speed * 0.24);
    if (this.reduced) baseFov = 68 + Math.min(6, speed * 0.06);
    let desired = v.set(0, 0, 0), target = v2.set(0, 0, 0);
    let stiff = 12;
    switch (mode) {
      case 0: case 1: case 2: {
        const d = [6.4, 4.4, 9.8][mode], h = [2.2, 1.55, 3.4][mode];
        desired.copy(pose.p).addScaledVector(this.sf, -d).addScaledVector(this.su, h);
        target.copy(pose.p).addScaledVector(this.sf, 6 + speed * 0.07).addScaledVector(this.su, 0.9);
        break; }
      case 3: desired.copy(pose.p).addScaledVector(pose.f, this.carLength * 0.12).addScaledVector(pose.u, this.carHeight * 0.52); target.copy(desired).addScaledVector(this.sf, 30).addScaledVector(pose.u, -0.2); stiff = 60; baseFov += 8; break;
      case 4: desired.copy(pose.p).addScaledVector(pose.f, this.carLength * 0.5).addScaledVector(pose.u, -0.1); target.copy(desired).addScaledVector(this.sf, 30); stiff = 60; baseFov += 6; break;
      case 5: desired.copy(pose.p).addScaledVector(pose.f, -this.carLength * 0.02).addScaledVector(pose.u, this.carHeight * 0.45).addScaledVector(v3.crossVectors(pose.f, pose.u), -0.3); target.copy(desired).addScaledVector(this.sf, 30); stiff = 60; baseFov += 2; break;
      case 6: {
        // trackside cinematic cameras: pick an anchor ahead of the car and hold it until the car has passed
        if (track) {
          const fi = hintIdx;
          if (this.cineIdx < 0 || fi > this.cineIdx + 14 || fi < this.cineIdx - 70) {
            const ci = Math.min(track.n - 3, Math.round(fi + 22 + Math.random() * 20)); this.cineIdx = ci;
            frameAt(track, ci, 0, this.tmpFrame); const t = this.tmpFrame; const side = Math.random() < 0.5 ? 1 : -1; const off = track.w[ci] / 2 + 4 + Math.random() * 6;
            this.cineAnchor.set(t.px + t.rx * side * off + t.ux * (1 + Math.random() * 3), t.py + t.ry * side * off + t.uy * (1 + Math.random() * 3), t.pz + t.rz * side * off + t.uz * (1 + Math.random() * 3));
            this.pos.copy(this.cineAnchor);
          }
          desired.copy(this.cineAnchor); target.copy(pose.p).addScaledVector(pose.f, speed * 0.1); stiff = 100; baseFov = 40 + Math.max(0, 30 - speed * 0.3);
        } break; }
      case 7: {
        const o = this.orbit; const cy = Math.cos(o.pitch), sy = Math.sin(o.pitch);
        const right = v3.crossVectors(this.sf, this.su).normalize();
        desired.copy(pose.p).addScaledVector(this.sf, -Math.cos(o.yaw) * cy * o.dist).addScaledVector(right, Math.sin(o.yaw) * cy * o.dist).addScaledVector(this.su, sy * o.dist);
        target.copy(pose.p).addScaledVector(this.su, 0.6); stiff = 20; break; }
    }
    // position smoothing (first-person modes are rigidly attached)
    if (stiff >= 60) this.pos.copy(desired);
    else if (mode === 6) this.pos.copy(desired);
    else this.pos.lerp(desired, 1 - Math.exp(-dt * stiff));
    // keep the chase camera above the road surface (loops, jumps, wall-rides)
    if (track && mode !== 6 && stiff < 60) {
      const fi = locate(track, this.pos.x, this.pos.y, this.pos.z, hintIdx);
      frameAt(track, fi, 0, this.tmpFrame); const t = this.tmpFrame;
      const ox = this.pos.x - t.px, oy = this.pos.y - t.py, oz = this.pos.z - t.pz;
      const h = ox * t.ux + oy * t.uy + oz * t.uz, d = ox * t.rx + oy * t.ry + oz * t.rz;
      if (Math.abs(d) < track.w[Math.min(track.n - 1, Math.round(fi))] / 2 + 1 && h < 0.8 && h > -2) this.pos.addScaledVector(v3.set(t.ux, t.uy, t.uz), 0.8 - h);
    }
    this.look.lerp(target, mode >= 3 && mode <= 5 ? 1 : 1 - Math.exp(-dt * 16));
    if (!this.look.lengthSq()) this.look.copy(target);
    cam.position.copy(this.pos);
    // shake
    this.shake = Math.max(0, this.shake - dt * 2.2);
    this.shakeT += dt * 60;
    const sx = this.shake * 0.12 * Math.sin(this.shakeT * 1.7), sy2 = this.shake * 0.12 * Math.sin(this.shakeT * 2.3 + 1);
    const rumble = this.reduced ? 0 : Math.min(0.012, speed * 0.00006) * this.shakeScale;
    cam.position.x += sx + rumble * Math.sin(this.shakeT * 3.1); cam.position.y += sy2 + rumble * Math.sin(this.shakeT * 4.7);
    cam.up.copy(mode === 6 ? v.set(0, 1, 0) : this.su);
    cam.lookAt(this.look);
    cam.fov += (baseFov - cam.fov) * Math.min(1, dt * 4); cam.updateProjectionMatrix();
  }
}
