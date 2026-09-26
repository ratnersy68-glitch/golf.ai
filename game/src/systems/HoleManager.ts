import * as THREE from 'three';
import { EventBus } from '../core/EventBus';
import type { WorldStage } from '../core/WorldStage';
import type { CourseData, HoleLayout } from '../data/types';
import { ShotRecorder } from '../net/Multiplayer';
import { SURFACE_PHYSICS } from '../world/HoleModel';
import type { AudioManager } from './AudioManager';
import { BALL_RADIUS, BallState, createBall, PHYSICS_DT, PhysicsEvent, PhysicsModifiers, predictPath, stepBall, strike } from './BallPhysics';
import type { PlayerManager } from './PlayerManager';
import { maxStrokes, scoreName, scoreTone } from './ScoringSystem';

export type HoleState = 'idle' | 'intro' | 'aim' | 'swing' | 'rolling' | 'penalty' | 'holed' | 'celebrate' | 'complete';

export interface HoleEvents {
  hud: { strokes: number; par: number; surface: string; toCup: number; state: HoleState };
  power: { power: number; dragging: boolean };
  message: { text: string; sub?: string; tone: 'info' | 'bad' | 'good'; ms?: number };
  intro: { layout: HoleLayout; course: CourseData };
  introDone: void;
  complete: { layoutId: string; strokes: number; par: number; name: string; tone: string; pickedUp: boolean };
  shot: { strokes: number };
}

/**
 * Rules and flow of playing one real hole as mini-golf:
 * flyover -> aim (drag back from the ball) -> roll -> penalties / next shot -> hole out -> celebration.
 */
export class HoleManager {
  readonly events = new EventBus<HoleEvents>();
  readonly recorder = new ShotRecorder();
  state: HoleState = 'idle';
  strokes = 0;
  private world: WorldStage;
  private audio: AudioManager;
  private player: PlayerManager;
  private layout!: HoleLayout;
  private ball!: BallState;
  private lastRest: [number, number] = [0, 0];
  private acc = 0;
  private mods!: PhysicsModifiers;
  private power = 0;
  private dragging = false;
  private dragStart = new THREE.Vector2();
  private orbiting = false;
  private orbitLast = new THREE.Vector2();
  private pinch = 0;
  private pointers = new Map<number, THREE.Vector2>();
  private swingT = 0;
  private pendingShot: { angle: number; power: number } | null = null;
  private stateT = 0;
  private lastPredict = 0;
  private predicted: [number, number, number][] = [];
  private finalHole = false;
  private overview = false;
  private showTrajectory = true;
  private canvas: HTMLCanvasElement;
  private lastSurface = '';

  constructor(world: WorldStage, audio: AudioManager, player: PlayerManager, canvas: HTMLCanvasElement) {
    this.world = world;
    this.audio = audio;
    this.player = player;
    this.canvas = canvas;
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: true });
  }

  setTrajectory(on: boolean): void {
    this.showTrajectory = on;
  }

  /** Begin a hole: flyover first unless skipped. */
  start(layout: HoleLayout, course: CourseData, opts: { finalHole: boolean; flyover: boolean }): void {
    this.layout = layout;
    this.finalHole = opts.finalHole;
    this.strokes = 0;
    this.recorder.clear();
    this.overview = false;
    this.world.loadHole(layout);
    const m = this.world.model!;
    this.ball = createBall(m, layout.tee.at[0], layout.tee.at[1]);
    this.lastRest = [...layout.tee.at];
    this.world.placeBall(this.ball.x, this.ball.y, this.ball.h);
    this.world.vfx.clearTrail();
    this.world.hole!.flag.setRaised(0);
    this.audio.setAtmosphere(course.atmosphere);
    const ballW = this.ballWorld();
    const cup = this.cupWorld();
    this.world.cam.aim(ballW, cup);
    this.world.cam.pointAt(cup);
    this.world.addressBall(ballW, this.world.cam.aimDir);
    if (opts.flyover) {
      this.setState('intro');
      this.events.emit('intro', { layout, course });
      this.playFlyover();
    } else {
      this.world.cam.aim(ballW, cup);
      this.world.cam.snap();
      this.toAim();
    }
    this.emitHud();
  }

  private playFlyover(): void {
    const m = this.world.model!;
    const tee = this.world.world(m.layout.tee.at[0], m.layout.tee.at[1]);
    const cup = this.cupWorld();
    const gc = m.greenCenter;
    const green = this.world.world(gc[0], gc[1]);
    const mid = tee.clone().lerp(green, 0.5);
    const fwd = new THREE.Vector3().subVectors(green, tee).setY(0).normalize();
    const side = new THREE.Vector3(-fwd.z, 0, fwd.x);
    const L = tee.distanceTo(green);
    const eyes = [
      tee.clone().addScaledVector(fwd, -L * 0.25).add(new THREE.Vector3(0, L * 0.35, 0)).addScaledVector(side, -L * 0.12),
      tee.clone().addScaledVector(fwd, L * 0.15).add(new THREE.Vector3(0, L * 0.28, 0)).addScaledVector(side, L * 0.18),
      mid.clone().add(new THREE.Vector3(0, L * 0.2, 0)).addScaledVector(side, L * 0.22),
      green.clone().addScaledVector(fwd, -L * 0.22).add(new THREE.Vector3(0, L * 0.11, 0)).addScaledVector(side, L * 0.1),
      green.clone().addScaledVector(fwd, L * 0.06).add(new THREE.Vector3(0, L * 0.09, 0)).addScaledVector(side, -L * 0.2),
    ];
    const looks = [tee.clone().addScaledVector(fwd, L * 0.3), mid, green.clone().lerp(mid, 0.3), cup, cup];
    this.world.cam.flyover(eyes, looks, 7.5, () => this.endIntro());
    this.audio.whoosh();
  }

  skipIntro(): void {
    if (this.state === 'intro') this.world.cam.skipFlyover();
  }

  private endIntro(): void {
    if (this.state !== 'intro') return;
    this.events.emit('introDone', undefined);
    this.world.cam.aim(this.ballWorld(), this.cupWorld());
    this.toAim();
  }

  private toAim(): void {
    this.setState('aim');
    const ballW = this.ballWorld();
    this.world.cam.aim(ballW, this.cupWorld());
    this.world.cam.pointAt(this.cupWorld());
    this.world.addressBall(ballW, this.world.cam.aimDir);
    this.world.showAim(true);
    this.lastSurface = this.ball.surface;
    this.mods = this.player.modifiers({ finalHole: this.finalHole, distanceToCup: this.distToCup() });
    this.emitHud();
  }

  private setState(s: HoleState): void {
    this.state = s;
    this.stateT = 0;
  }

  ballWorld(): THREE.Vector3 {
    return new THREE.Vector3(this.ball.x, this.ball.h + BALL_RADIUS, -this.ball.y);
  }

  cupWorld(): THREE.Vector3 {
    const m = this.world.model!;
    return new THREE.Vector3(m.cup[0], m.terrainHeight(m.cup[0], m.cup[1]), -m.cup[1]);
  }

  private distToCup(): number {
    const m = this.world.model!;
    return Math.hypot(m.cup[0] - this.ball.x, m.cup[1] - this.ball.y);
  }

  private emitHud(): void {
    if (!this.world.model) return;
    this.events.emit('hud', {
      strokes: this.strokes,
      par: this.layout.par,
      surface: SURFACE_PHYSICS[this.ball.surface].label,
      toCup: this.distToCup(),
      state: this.state,
    });
  }

  toggleOverview(): void {
    if (this.state !== 'aim') return;
    this.overview = !this.overview;
    if (this.overview) {
      const m = this.world.model!;
      const tee = this.world.world(m.layout.tee.at[0], m.layout.tee.at[1]);
      const cup = this.cupWorld();
      const mid = tee.clone().lerp(cup, 0.5);
      const L = tee.distanceTo(cup);
      this.world.cam.overview(mid.clone().add(new THREE.Vector3(0, L * 0.95, L * 0.35)), mid);
    } else {
      this.world.cam.aim(this.ballWorld(), this.cupWorld());
    }
  }

  /* ------------------------------------------------------------ input */

  private screenOfBall(): THREE.Vector2 {
    const p = this.ballWorld().project(this.world.camera);
    const r = this.canvas.getBoundingClientRect();
    return new THREE.Vector2(((p.x + 1) / 2) * r.width + r.left, ((1 - p.y) / 2) * r.height + r.top);
  }

  private groundPoint(sx: number, sy: number): THREE.Vector3 | null {
    const r = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((sx - r.left) / r.width) * 2 - 1, -((sy - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.world.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.ballWorld().y);
    const hit = new THREE.Vector3();
    return ray.ray.intersectPlane(plane, hit) ? hit : null;
  }

  private onDown = (e: PointerEvent) => {
    this.audio.unlock();
    this.pointers.set(e.pointerId, new THREE.Vector2(e.clientX, e.clientY));
    this.canvas.setPointerCapture?.(e.pointerId);
    if (this.state === 'intro') {
      this.skipIntro();
      return;
    }
    if (this.state !== 'aim') return;
    if (this.pointers.size === 2) {
      this.dragging = false;
      this.orbiting = false;
      const [a, b] = [...this.pointers.values()];
      this.pinch = a.distanceTo(b);
      this.power = 0;
      this.events.emit('power', { power: 0, dragging: false });
      return;
    }
    if (this.overview) this.toggleOverview();
    const bs = this.screenOfBall();
    const near = bs.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) < Math.max(90, Math.min(innerWidth, innerHeight) * 0.16);
    if (near) {
      this.dragging = true;
      this.dragStart.set(e.clientX, e.clientY);
      this.power = 0;
    } else {
      this.orbiting = true;
      this.orbitLast.set(e.clientX, e.clientY);
    }
  };

  private onMove = (e: PointerEvent) => {
    const p = this.pointers.get(e.pointerId);
    if (p) p.set(e.clientX, e.clientY);
    if (this.state !== 'aim') return;
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      const d = a.distanceTo(b);
      if (this.pinch > 0) this.world.cam.zoom = THREE.MathUtils.clamp(this.world.cam.zoom - (d - this.pinch) / 400, 0, 1);
      this.pinch = d;
      return;
    }
    if (this.orbiting) {
      const dx = e.clientX - this.orbitLast.x;
      const dy = e.clientY - this.orbitLast.y;
      this.orbitLast.set(e.clientX, e.clientY);
      this.world.cam.aimYaw += dx * 0.006;
      this.world.cam.zoom = THREE.MathUtils.clamp(this.world.cam.zoom + dy * 0.003, 0, 1);
      this.world.addressBall(this.ballWorld(), this.world.cam.aimDir);
      return;
    }
    if (!this.dragging) return;
    const bs = this.screenOfBall();
    const pointer = new THREE.Vector2(e.clientX, e.clientY);
    // pull-back vector measured from where the finger went down
    const drag = pointer.clone().sub(this.dragStart);
    const len = drag.length();
    const full = Math.min(innerWidth, innerHeight) * 0.42;
    this.power = THREE.MathUtils.clamp((len - 10) / full, 0, 1);
    if (len > 8) {
      // shot goes opposite the drag: project a point just "ahead" of the ball on screen onto the ground
      const ahead = bs.clone().addScaledVector(drag.normalize(), -30);
      const g = this.groundPoint(ahead.x, ahead.y);
      if (g) {
        const dir = g.sub(this.ballWorld()).setY(0);
        if (dir.lengthSq() > 1e-6) this.aimDir.copy(dir.normalize());
      }
    }
    this.events.emit('power', { power: this.power, dragging: true });
    this.world.golfer?.setStroke(-this.power);
  };

  private aimDir = new THREE.Vector3(0, 0, -1);

  private onUp = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinch = 0;
    if (this.orbiting) {
      this.orbiting = false;
      return;
    }
    if (!this.dragging) return;
    this.dragging = false;
    this.events.emit('power', { power: this.power, dragging: false });
    if (this.state !== 'aim' || this.power < 0.04) {
      this.world.golfer?.setStroke(0);
      this.power = 0;
      return;
    }
    // hole-space angle: 0 = +y, positive toward +x. world dir (x, -y)
    const angle = Math.atan2(this.aimDir.x, -this.aimDir.z);
    this.shoot(angle, this.power);
  };

  private onWheel = (e: WheelEvent) => {
    if (this.state !== 'aim') return;
    this.world.cam.zoom = THREE.MathUtils.clamp(this.world.cam.zoom + e.deltaY * 0.0008, 0, 1);
  };

  /* ------------------------------------------------------------ shot flow */

  shoot(angle: number, power: number): void {
    const executed = this.player.execute(angle, power);
    this.pendingShot = executed;
    this.setState('swing');
    this.swingT = 0;
    this.world.showAim(false);
    this.recorder.record({
      holeId: this.layout.id,
      stroke: this.strokes + 1,
      from: [this.ball.x, this.ball.y],
      angle: executed.angle,
      power: executed.power,
      speed: executed.power * this.player.maxSpeed,
      result: 'rest',
    });
  }

  private impact(): void {
    const s = this.pendingShot!;
    this.pendingShot = null;
    this.strokes++;
    this.lastRest = [this.ball.x, this.ball.y];
    strike(this.ball, s.angle, s.power * this.player.maxSpeed);
    this.audio.putt(s.power);
    this.audio.haptic(12);
    const bw = this.ballWorld();
    const dir = new THREE.Vector3(Math.sin(s.angle), 0, -Math.cos(s.angle));
    if (s.power > 0.45) this.world.vfx.grassBurst(bw.clone().setY(bw.y - BALL_RADIUS), dir, this.layout.grass.fairway, Math.floor(6 + s.power * 10));
    this.setState('rolling');
    this.world.cam.updateBall(bw, dir.clone().multiplyScalar(10), this.cupWorld());
    this.world.cam.follow();
    this.events.emit('shot', { strokes: this.strokes });
    this.emitHud();
  }

  private handlePhysicsEvent(ev: PhysicsEvent): void {
    const pos = (x: number, y: number) => this.world.world(x, y);
    switch (ev.type) {
      case 'wall':
        this.audio.wall(ev.speed, ev.kind);
        if (ev.speed > 3) this.world.vfx.grassBurst(pos(ev.x, ev.y), new THREE.Vector3(), '#2f6a2c', 4);
        break;
      case 'surface':
        if (ev.to === 'bunker') {
          this.audio.sand();
          this.world.vfx.sandPuff(pos(ev.x, ev.y), this.layout.grass.sand);
        }
        break;
      case 'lip':
        this.audio.lip();
        this.events.emit('message', { text: 'Lip out!', tone: 'bad', ms: 1200 });
        break;
      case 'water':
        break;
      case 'holed':
      case 'stopped':
        break;
    }
  }

  update(dt: number): void {
    this.stateT += dt;
    const w = this.world;
    switch (this.state) {
      case 'aim': {
        const bw = this.ballWorld();
        if (!this.dragging) this.aimDir.copy(w.cam.aimDir);
        else w.addressBall(bw, this.aimDir);
        const now = performance.now();
        if (this.dragging && now - this.lastPredict > 45) {
          this.lastPredict = now;
          const angle = Math.atan2(this.aimDir.x, -this.aimDir.z);
          this.predicted = this.showTrajectory
            ? predictPath(w.model!, this.ball.x, this.ball.y, angle, Math.max(0.05, this.power) * this.player.maxSpeed, this.mods, this.player.previewLength).points
            : [];
        }
        w.updateAim(bw, this.aimDir, this.power, this.predicted, this.dragging);
        break;
      }
      case 'swing': {
        this.swingT += dt;
        const p = this.pendingShot?.power ?? 0.5;
        const k = Math.min(1, this.swingT / 0.16);
        w.golfer?.setStroke(-p + k * (p + p * 0.6 + 0.1));
        if (k >= 1) this.impact();
        break;
      }
      case 'rolling': {
        this.acc += dt;
        const events: PhysicsEvent[] = [];
        const px = this.ball.x;
        const py = this.ball.y;
        let steps = 0;
        while (this.acc >= PHYSICS_DT && steps < 60) {
          stepBall(this.ball, w.model!, this.mods, events);
          this.acc -= PHYSICS_DT;
          steps++;
          if (!this.ball.moving) break;
        }
        const dx = this.ball.x - px;
        const dy = this.ball.y - py;
        w.placeBall(this.ball.x, this.ball.y, this.ball.h, { dx, dy, angle: Math.hypot(dx, dy) / BALL_RADIUS });
        for (const ev of events) this.handlePhysicsEvent(ev);
        const speed = Math.hypot(this.ball.vx, this.ball.vy);
        this.audio.setRoll(speed, this.ball.surface);
        const bw = this.ballWorld();
        w.vfx.pushTrail(bw);
        w.cam.updateBall(bw, new THREE.Vector3(this.ball.vx, 0, -this.ball.vy), this.cupWorld());
        if (this.stateT > 0.35) w.golfer?.setMode('idle');
        if (this.ball.surface !== this.lastSurface) {
          this.lastSurface = this.ball.surface;
          this.emitHud();
        }
        // raise the flag as the ball gets close
        const d = this.distToCup();
        w.hole!.flag.setRaised(d < 2.5 && speed > 0.5 ? THREE.MathUtils.clamp((2.5 - d) / 1.5, 0, 1) : 0);
        if (this.ball.holed) this.onHoled();
        else if (this.ball.inWater) this.onWater();
        else if (!this.ball.moving) this.onRest();
        break;
      }
      case 'penalty': {
        if (this.stateT < 0.8) w.sinkBall(dt * 0.3);
        if (this.stateT > 1.8) {
          const [x, y] = this.layout.waterRule === 'dropZone' && this.layout.dropZone ? this.layout.dropZone : this.lastRest;
          this.ball = createBall(w.model!, x, y);
          w.placeBall(x, y, this.ball.h);
          w.vfx.clearTrail();
          this.toAim();
          this.checkMax();
        }
        break;
      }
      case 'holed': {
        const cup = this.cupWorld();
        if (this.stateT < 0.35) w.sinkBall(dt * 0.6, cup);
        else w.hideBall();
        if (this.stateT > 1.6) this.celebrate();
        break;
      }
      case 'celebrate': {
        if (this.stateT > 3.6) this.finish(false);
        break;
      }
    }
    if (this.state !== 'rolling') {
      this.audio.setRoll(0, null);
      w.vfx.pushTrail(null);
    }
  }

  private onRest(): void {
    this.world.hole!.flag.setRaised(0);
    this.setState('aim');
    const d = this.distToCup();
    if (d < 1.2 && this.strokes > 0) this.events.emit('message', { text: 'Tap-in range', tone: 'info', ms: 1000 });
    if (!this.checkMax()) this.toAim();
  }

  /** Mini-golf pick-up rule. Returns true if the hole ended. */
  private checkMax(): boolean {
    if (this.strokes >= maxStrokes(this.layout.par) && this.state !== 'complete') {
      this.events.emit('message', { text: 'Picked up', sub: `Max ${maxStrokes(this.layout.par)} strokes`, tone: 'bad', ms: 1800 });
      this.finish(true);
      return true;
    }
    return false;
  }

  private onWater(): void {
    const w = this.world;
    this.strokes++;
    this.setState('penalty');
    const at = w.world(this.ball.x, this.ball.y, w.model!.surfaces.find((s) => s.type === 'water')?.level ?? this.ball.h);
    w.vfx.splash(at);
    this.audio.splash();
    this.audio.haptic(40);
    w.cam.watch(at);
    const waterName = w.model!.surfaces.find((s) => s.type === 'water' && s.poly && inside(s.poly, this.ball.x, this.ball.y))?.name ?? 'Water';
    this.events.emit('message', { text: `${waterName}!`, sub: '+1 stroke penalty', tone: 'bad', ms: 1800 });
    this.recorder.shots[this.recorder.shots.length - 1].result = 'water';
    this.emitHud();
  }

  private onHoled(): void {
    this.setState('holed');
    const w = this.world;
    this.audio.cup();
    this.audio.haptic(30);
    w.cam.watchCup(this.cupWorld());
    w.hole!.flag.setRaised(1);
    this.recorder.shots[this.recorder.shots.length - 1].result = 'holed';
    const tone = scoreTone(this.strokes, this.layout.par);
    const cup = this.cupWorld();
    if (tone === 'ace') {
      w.vfx.sparkles(cup.clone().add(new THREE.Vector3(0, 0.1, 0)), 120);
      w.vfx.confettiBurst(cup, 360, 4);
      w.cam.shake = 1;
      this.audio.cheer(2);
      w.hole!.cheer(5);
    } else if (tone === 'eagle' || tone === 'birdie') {
      w.vfx.confettiBurst(cup, tone === 'eagle' ? 260 : 150, 3);
      w.vfx.sparkles(cup, 40);
      this.audio.cheer(tone === 'eagle' ? 1.4 : 1);
      w.hole!.cheer(3.5);
    } else if (tone === 'par') {
      this.audio.cheer(0.45);
      w.hole!.cheer(1.5);
    } else this.audio.cheer(0.2);
    this.events.emit('message', { text: scoreName(this.strokes, this.layout.par), tone: tone === 'bogey' || tone === 'worse' ? 'info' : 'good', ms: 2600 });
  }

  private celebrate(): void {
    this.setState('celebrate');
    const w = this.world;
    const g = w.golfer!;
    const tone = scoreTone(this.strokes, this.layout.par);
    if (tone === 'bogey' || tone === 'worse') g.setMode('dejected');
    else g.celebrate(tone === 'ace' || tone === 'eagle');
    const facing = new THREE.Vector3(0, 0, 1).applyQuaternion(g.root.quaternion);
    w.cam.golfer(g.root.position, facing);
    // keep the golfer clear of the result card on the right
    w.frameShift = -0.2;
  }

  private finish(pickedUp: boolean): void {
    if (this.state === 'complete') return;
    this.setState('complete');
    this.world.showAim(false);
    this.events.emit('complete', {
      layoutId: this.layout.id,
      strokes: this.strokes,
      par: this.layout.par,
      name: pickedUp ? 'Picked Up' : scoreName(this.strokes, this.layout.par),
      tone: scoreTone(this.strokes, this.layout.par),
      pickedUp,
    });
  }

  /** park the camera somewhere cinematic when not playing (menus) */
  idle(): void {
    this.setState('idle');
    this.world.showAim(false);
  }
}

function inside(poly: [number, number][], x: number, y: number): boolean {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if (poly[i][1] > y !== poly[j][1] > y && x < ((poly[j][0] - poly[i][0]) * (y - poly[i][1])) / (poly[j][1] - poly[i][1]) + poly[i][0]) c = !c;
  }
  return c;
}
