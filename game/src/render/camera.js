import * as THREE from 'three';
import { P } from './world.js';

const v3 = () => new THREE.Vector3();

// Smoothed camera rig with several broadcast-style modes.
export class CameraRig {
  constructor(camera) {
    this.cam = camera;
    this.pos = v3(); this.look = v3();
    this.dPos = v3(); this.dLook = v3();
    this.mode = 'address';
    this.rate = 4;
    this.orbitYaw = 0; this.orbitPitch = 0; this.zoom = 1; this.preview = 0;
    this.fov = 55;
    this.snapNext = true;
  }
  snap() { this.snapNext = true; }

  set(mode, opts = {}) {
    this.mode = mode;
    this.opts = opts;
    if (opts.snap) this.snapNext = true;
    this.rate = opts.rate ?? 4;
  }

  // ctx: {ball:[x,y,h], heading, hole, target:[x,y,h], vel:[vx,vy,vz], landing:[x,y,h], golfer}
  update(dt, ctx) {
    const hole = ctx.hole;
    const H = (x, y) => hole.heightAt(x, y);
    const [bx, by, bh] = ctx.ball;
    const hx = Math.sin(ctx.heading), hy = Math.cos(ctx.heading);
    let fov = 55;
    switch (this.mode) {
      case 'address': {
        const putt = ctx.putt;
        const yaw = ctx.heading + this.orbitYaw;
        const sx = Math.sin(yaw), sy = Math.cos(yaw);
        const pv = this.preview; // 0..1 flies along the aim line
        const dist = (putt ? 3.8 : 6.8) * this.zoom;
        const hgt = (putt ? 1.6 : 2.1) * this.zoom + this.orbitPitch * 4;
        if (pv > 0.01 && ctx.aimDist) {
          const d = ctx.aimDist * pv;
          const px = bx + hx * d, py = by + hy * d;
          const ch = Math.max(H(px - sx * 25, py - sy * 25), H(px, py));
          this.dPos.copy(P(px - sx * (25 + 10 * pv), py - sy * (25 + 10 * pv), ch + 10 + 18 * pv));
          const lx = bx + hx * Math.min(ctx.aimDist * 1.05, d + 40), ly = by + hy * Math.min(ctx.aimDist * 1.05, d + 40);
          this.dLook.copy(P(lx, ly, H(lx, ly)));
        } else {
          const rx = Math.cos(yaw), ry = -Math.sin(yaw);
          const side = putt ? 0.3 : 0.55;
          const cx = bx - sx * dist + rx * side, cy = by - sy * dist + ry * side;
          const ch = Math.max(H(cx, cy) + 0.6, bh + hgt);
          this.dPos.copy(P(cx, cy, ch));
          const la = putt ? Math.min(ctx.aimDist || 10, 12) : 60;
          const lx = bx + sx * la, ly = by + sy * la;
          this.dLook.copy(P(lx, ly, putt ? H(lx, ly) : bh + 1.5 + this.orbitPitch * -3));
        }
        fov = putt ? 50 : 52;
        break;
      }
      case 'player': {
        // TV angle: in front of the golfer, slightly toward target
        const rx = Math.cos(ctx.heading), ry = -Math.sin(ctx.heading);
        const cx = bx + rx * 4.5 + hx * 2.2, cy = by + ry * 4.5 + hy * 2.2;
        this.dPos.copy(P(cx, cy, Math.max(H(cx, cy), bh) + 1.3));
        this.dLook.copy(P(bx - rx * 0.8, by - ry * 0.8, bh + 0.9));
        fov = 45;
        break;
      }
      case 'follow': {
        const [vx, vy, vz] = ctx.vel || [hx, hy, 0];
        const sp = Math.hypot(vx, vy) + 1e-3;
        const ux = vx / sp, uy = vy / sp;
        const back = ctx.putt ? 2.5 : 9;
        const cx = bx - ux * back, cy = by - uy * back;
        const ch = Math.max(H(cx, cy) + 1.5, bh + (ctx.putt ? 1.0 : 2.5));
        this.dPos.copy(P(cx, cy, ch));
        this.dLook.copy(P(bx + ux * 3, by + uy * 3, bh));
        fov = 55;
        break;
      }
      case 'launch': {
        // behind the golfer, looking up the flight
        const o = this.opts;
        const cx = o.from[0] - hx * 7, cy = o.from[1] - hy * 7;
        this.dPos.copy(P(cx, cy, H(cx, cy) + 2.2));
        this.dLook.copy(P(bx, by, bh));
        fov = 50;
        break;
      }
      case 'landing': {
        const L = this.opts.at;
        if (this.opts.cam) {
          const c = this.opts.cam;
          this.dPos.copy(P(c[0], c[1], c[2]));
          this.dLook.copy(P(bx, by, bh));
          fov = 42;
          break;
        }
        const side = this.opts.side || 1;
        const rx = Math.cos(ctx.heading), ry = -Math.sin(ctx.heading);
        const cx = L[0] + hx * 16 + rx * 11 * side, cy = L[1] + hy * 16 + ry * 11 * side;
        this.dPos.copy(P(cx, cy, Math.max(H(cx, cy), L[2]) + 3.5));
        this.dLook.copy(P(bx, by, bh));
        fov = 42;
        break;
      }
      case 'green': {
        const pin = hole.pin;
        let dx = pin[0] - bx, dy = pin[1] - by;
        const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
        const cx = pin[0] + dx * 7, cy = pin[1] + dy * 7;
        this.dPos.copy(P(cx, cy, H(cx, cy) + 2.4));
        this.dLook.copy(P((bx + pin[0]) / 2, (by + pin[1]) / 2, H((bx + pin[0]) / 2, (by + pin[1]) / 2)));
        fov = 48;
        break;
      }
      case 'overhead': {
        const T = ctx.target || [hole.pin[0], hole.pin[1]];
        const mx = (bx + T[0]) / 2, my = (by + T[1]) / 2;
        const span = Math.max(40, Math.hypot(T[0] - bx, T[1] - by));
        const alt = span * 1.05 + 20;
        this.dPos.copy(P(mx - hx * span * 0.18, my - hy * span * 0.18, H(mx, my) + alt));
        this.dLook.copy(P(mx + hx * 2, my + hy * 2, H(mx, my)));
        fov = 55;
        break;
      }
      case 'flyover': {
        const o = this.opts;
        const t = Math.min(1, o.t);
        const s = -30 + (hole.L + 10) * t;
        const c = hole.at(Math.min(hole.L + 30, s));
        const ahead = hole.at(Math.min(hole.L + 20, s + 80));
        const alt = 45 - 25 * t;
        this.dPos.copy(P(c.x - c.tx * 20, c.y - c.ty * 20, Math.max(H(c.x, c.y), 0) + alt));
        this.dLook.copy(P(ahead.x, ahead.y, H(ahead.x, ahead.y)));
        this.rate = 3;
        fov = 55;
        break;
      }
      case 'orbitGolfer': {
        const t = this.opts.t || 0;
        const r = 3.4;
        const a = t * 0.3;
        const gx = this.opts.center[0], gy = this.opts.center[1], gh = this.opts.center[2];
        this.dPos.copy(P(gx + Math.sin(a) * r, gy + Math.cos(a) * r, gh + 1.35));
        this.dLook.copy(P(gx, gy, gh + 0.95));
        fov = 38;
        break;
      }
      case 'menu': {
        const t = this.opts.t || 0;
        const s = hole.L * (0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.03)));
        const c = hole.at(s);
        const side = Math.sin(t * 0.05);
        this.dPos.copy(P(c.x + c.ty * 60 * side, c.y - c.tx * 60 * side - 40, H(c.x, c.y) + 28));
        const g = hole.at(hole.L);
        this.dLook.copy(P(g.x, g.y, H(g.x, g.y)));
        this.rate = 0.8;
        fov = 50;
        break;
      }
      case 'thumb': {
        const o = this.opts;
        this.dPos.copy(o.pos); this.dLook.copy(o.look); fov = o.fov || 50;
        break;
      }
    }
    if (this.snapNext) {
      this.pos.copy(this.dPos); this.look.copy(this.dLook); this.fov = fov;
      this.snapNext = false;
    } else {
      const k = 1 - Math.exp(-this.rate * dt);
      this.pos.lerp(this.dPos, k);
      this.look.lerp(this.dLook, Math.min(1, k * 1.6));
      this.fov += (fov - this.fov) * k;
    }
    // never go below terrain
    const gh = hole.heightAt(this.pos.x, -this.pos.z);
    if (this.pos.y < gh + 0.4) this.pos.y = gh + 0.4;
    this.cam.position.copy(this.pos);
    this.cam.lookAt(this.look);
    if (Math.abs(this.cam.fov - this.fov) > 0.01) { this.cam.fov = this.fov; this.cam.updateProjectionMatrix(); }
  }
}
