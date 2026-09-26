import type { SurfaceType } from '../data/types';
import { HoleModel, SURFACE_PHYSICS } from '../world/HoleModel';

export const BALL_RADIUS = 0.085;
export const GRAVITY = 32.2; // ft/s^2
export const MAX_LAUNCH_SPEED = 23; // ft/s at 100% power
export const PHYSICS_DT = 1 / 480;

export interface BallState {
  x: number;
  y: number;
  h: number;
  vx: number;
  vy: number;
  moving: boolean;
  holed: boolean;
  inWater: boolean;
  surface: SurfaceType;
  time: number;
  /** distance travelled this shot */
  travelled: number;
  /** spin for visuals: accumulated roll angle */
  roll: number;
}

export type PhysicsEvent =
  | { type: 'wall'; speed: number; x: number; y: number; kind: 'rail' | 'bridge' | 'tree' | 'rock' }
  | { type: 'surface'; from: SurfaceType; to: SurfaceType; speed: number; x: number; y: number }
  | { type: 'water'; x: number; y: number }
  | { type: 'lip'; speed: number }
  | { type: 'holed'; speed: number }
  | { type: 'stopped'; x: number; y: number };

/** Modifiers from golfer stats and abilities. All ~1.0 — stats should be felt, not dominate. */
export interface PhysicsModifiers {
  captureMultiplier: number;
  railRestitution: number;
  frictionScale: Partial<Record<SurfaceType, number>>;
}

export const NEUTRAL_MODIFIERS: PhysicsModifiers = { captureMultiplier: 1, railRestitution: 1, frictionScale: {} };

export function createBall(model: HoleModel, x: number, y: number): BallState {
  return {
    x,
    y,
    h: model.surfaceHeight(x, y),
    vx: 0,
    vy: 0,
    moving: false,
    holed: false,
    inWater: false,
    surface: model.surfaceAt(x, y),
    time: 0,
    travelled: 0,
    roll: 0,
  };
}

/** Launch. angle: radians, 0 = straight down-range (+y), positive = toward +x. */
export function strike(ball: BallState, angle: number, speed: number): void {
  ball.vx = Math.sin(angle) * speed;
  ball.vy = Math.cos(angle) * speed;
  ball.moving = true;
  ball.time = 0;
  ball.travelled = 0;
}

const grad = { x: 0, y: 0 };

/**
 * Advance one fixed physics step. Deterministic: same inputs -> same outputs on every device,
 * which is what makes ghost rounds and replays possible.
 */
export function stepBall(ball: BallState, model: HoleModel, mods: PhysicsModifiers, events?: PhysicsEvent[]): void {
  if (!ball.moving) return;
  const dt = PHYSICS_DT;
  const surf = ball.surface;
  const sp = SURFACE_PHYSICS[surf];
  const fscale = mods.frictionScale[surf] ?? 1;

  model.gradient(ball.x, ball.y, grad);
  const g2 = grad.x * grad.x + grad.y * grad.y;
  const slopeNorm = 1 / Math.sqrt(1 + g2);
  // rolling sphere on an incline: 5/7 g sin(theta)
  const k = (5 / 7) * GRAVITY * slopeNorm * slopeNorm;
  let ax = -k * grad.x;
  let ay = -k * grad.y;

  // cup: a gentle funnel so balls that catch the edge can fall in
  const cdx = model.cup[0] - ball.x;
  const cdy = model.cup[1] - ball.y;
  const cd = Math.hypot(cdx, cdy);
  const cupR = model.cupRadius;
  if (cd < cupR + BALL_RADIUS * 0.5 && cd > 1e-4) {
    const pull = 24 * (1 - cd / (cupR + BALL_RADIUS * 0.5));
    ax += (cdx / cd) * pull;
    ay += (cdy / cd) * pull;
  }

  ball.vx += ax * dt;
  ball.vy += ay * dt;

  let speed = Math.hypot(ball.vx, ball.vy);
  if (speed > 0) {
    const decel = (sp.roll * fscale * GRAVITY * slopeNorm + sp.drag * fscale * speed) * dt;
    const ns = Math.max(0, speed - decel);
    ball.vx *= ns / speed;
    ball.vy *= ns / speed;
    speed = ns;
  }

  const px = ball.x;
  const py = ball.y;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  const moved = Math.hypot(ball.x - px, ball.y - py);
  ball.travelled += moved;
  ball.roll += moved / BALL_RADIUS;
  ball.time += dt;

  // walls (rails, bridge rails)
  for (const w of model.walls) collideSegment(ball, w.ax, w.ay, w.bx, w.by, w.bounce * mods.railRestitution, w.kind, events);
  for (const c of model.circles) collideCircle(ball, c.x, c.y, c.r, c.bounce * mods.railRestitution, events);

  // keep inside the rails no matter what
  if (!model.insidePlay(ball.x, ball.y)) {
    ball.x = px;
    ball.y = py;
    ball.vx *= -0.5;
    ball.vy *= -0.5;
  }

  ball.h = model.surfaceHeight(ball.x, ball.y);
  const ns = model.surfaceAt(ball.x, ball.y);
  if (ns !== ball.surface) {
    events?.push({ type: 'surface', from: ball.surface, to: ns, speed, x: ball.x, y: ball.y });
    ball.surface = ns;
  }

  if (ns === 'water') {
    ball.inWater = true;
    ball.moving = false;
    ball.vx = ball.vy = 0;
    events?.push({ type: 'water', x: ball.x, y: ball.y });
    return;
  }

  // cup capture
  const cd2 = Math.hypot(model.cup[0] - ball.x, model.cup[1] - ball.y);
  if (cd2 < cupR) {
    const capture = 3.6 * mods.captureMultiplier * (1 - 0.35 * (cd2 / cupR));
    if (speed < capture) {
      ball.holed = true;
      ball.moving = false;
      events?.push({ type: 'holed', speed });
      return;
    }
  }
  if (cd >= cupR && cd2 < cupR * 0.98 && speed >= 3.6 * mods.captureMultiplier) {
    // racing over the hole: a lip-out that knocks off some pace
    events?.push({ type: 'lip', speed });
    ball.vx *= 0.72;
    ball.vy *= 0.72;
  }

  // come to rest
  const slopeAccel = k * Math.sqrt(g2);
  const staticFriction = sp.roll * fscale * GRAVITY * 1.15;
  if (speed < 0.09 && slopeAccel < staticFriction) {
    ball.moving = false;
    ball.vx = ball.vy = 0;
    events?.push({ type: 'stopped', x: ball.x, y: ball.y });
  } else if (ball.time > 30) {
    ball.moving = false;
    ball.vx = ball.vy = 0;
    events?.push({ type: 'stopped', x: ball.x, y: ball.y });
  }
}

function collideSegment(
  ball: BallState,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  bounce: number,
  kind: 'rail' | 'bridge',
  events?: PhysicsEvent[],
): void {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = ((ball.x - ax) * dx + (ball.y - ay) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + dx * t;
  const cy = ay + dy * t;
  let nx = ball.x - cx;
  let ny = ball.y - cy;
  const d = Math.hypot(nx, ny);
  if (d >= BALL_RADIUS || d < 1e-6) return;
  nx /= d;
  ny /= d;
  resolve(ball, nx, ny, BALL_RADIUS - d, bounce, kind, events);
}

function collideCircle(ball: BallState, cx: number, cy: number, r: number, bounce: number, events?: PhysicsEvent[]): void {
  let nx = ball.x - cx;
  let ny = ball.y - cy;
  const d = Math.hypot(nx, ny);
  const min = r + BALL_RADIUS;
  if (d >= min || d < 1e-6) return;
  nx /= d;
  ny /= d;
  resolve(ball, nx, ny, min - d, bounce, r > 0.3 ? 'rock' : 'tree', events);
}

function resolve(
  ball: BallState,
  nx: number,
  ny: number,
  pen: number,
  bounce: number,
  kind: 'rail' | 'bridge' | 'tree' | 'rock',
  events?: PhysicsEvent[],
): void {
  ball.x += nx * pen;
  ball.y += ny * pen;
  const vn = ball.vx * nx + ball.vy * ny;
  if (vn >= 0) return;
  const e = Math.min(0.95, bounce);
  // reflect normal component, keep most of the tangential
  const tx = ball.vx - vn * nx;
  const ty = ball.vy - vn * ny;
  ball.vx = tx * 0.94 - vn * e * nx;
  ball.vy = ty * 0.94 - vn * e * ny;
  if (-vn > 0.4) events?.push({ type: 'wall', speed: -vn, x: ball.x, y: ball.y, kind });
}

/** Run a full shot headlessly (tests, validation, AI, ghosts). */
export function simulateShot(
  model: HoleModel,
  startX: number,
  startY: number,
  angle: number,
  speed: number,
  mods: PhysicsModifiers = NEUTRAL_MODIFIERS,
  maxTime = 30,
): BallState {
  const b = createBall(model, startX, startY);
  strike(b, angle, speed);
  const steps = Math.ceil(maxTime / PHYSICS_DT);
  for (let i = 0; i < steps && b.moving; i++) stepBall(b, model, mods);
  return b;
}

/** Sample the predicted path (for the aiming guide). */
export function predictPath(
  model: HoleModel,
  startX: number,
  startY: number,
  angle: number,
  speed: number,
  mods: PhysicsModifiers,
  maxLength: number,
): { points: [number, number, number][]; endsInWater: boolean } {
  const b = createBall(model, startX, startY);
  strike(b, angle, speed);
  const pts: [number, number, number][] = [[b.x, b.y, b.h]];
  let lastX = b.x;
  let lastY = b.y;
  const maxSteps = Math.ceil(12 / PHYSICS_DT);
  for (let i = 0; i < maxSteps && b.moving; i++) {
    stepBall(b, model, mods);
    if (Math.hypot(b.x - lastX, b.y - lastY) > 0.25) {
      pts.push([b.x, b.y, b.h]);
      lastX = b.x;
      lastY = b.y;
    }
    if (b.travelled > maxLength) break;
  }
  pts.push([b.x, b.y, b.h]);
  return { points: pts, endsInWater: b.inWater };
}
