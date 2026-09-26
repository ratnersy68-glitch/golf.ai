import type { BridgeData, ElevationFeature, HoleLayout, SurfaceType, Vec2 } from '../data/types';
import {
  Bounds2,
  clamp,
  distToPolyline,
  inBounds,
  lerp,
  pointInPolygon,
  polyBounds,
  ribbonPolygon,
  signedDistance,
  smoothClosed,
  smoothOpen,
  smoothstep,
  valueNoise2,
} from './geometry';

export interface ResolvedSurface {
  type: SurfaceType;
  name?: string;
  poly: Vec2[];
  bounds: Bounds2;
  level: number;
}

export interface Wall {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  /** extra restitution multiplier (hedges are softer than timber) */
  bounce: number;
  kind: 'rail' | 'bridge';
}

export interface CircleCollider {
  x: number;
  y: number;
  r: number;
  bounce: number;
}

interface ResolvedBridge extends BridgeData {
  dirX: number;
  dirY: number;
  length: number;
  h0: number;
  h1: number;
}

type ResolvedElevation =
  | { kind: 'base'; height: number }
  | { kind: 'rampY'; y0: number; y1: number; h0: number; h1: number }
  | { kind: 'rampX'; x0: number; x1: number; h0: number; h1: number }
  | { kind: 'mound'; at: Vec2; radius: number; height: number; sx: number; sy: number }
  | { kind: 'plateau'; poly: Vec2[]; bounds: Bounds2; height: number; falloff: number; tilt: Vec2; origin: Vec2 }
  | { kind: 'channel'; path: Vec2[]; bounds: Bounds2; width: number; depth: number; bedLevel?: number }
  | { kind: 'undulate'; poly: Vec2[]; bounds: Bounds2; amplitude: number; wavelength: number; seed: number };

/** Friction / behaviour per surface for the mini-golf ball. */
export const SURFACE_PHYSICS: Record<SurfaceType, { roll: number; drag: number; label: string }> = {
  green: { roll: 0.075, drag: 0.02, label: 'Green' },
  fringe: { roll: 0.11, drag: 0.03, label: 'Fringe' },
  fairway: { roll: 0.1, drag: 0.03, label: 'Fairway' },
  tee: { roll: 0.1, drag: 0.03, label: 'Tee' },
  path: { roll: 0.085, drag: 0.02, label: 'Path' },
  bridge: { roll: 0.085, drag: 0.02, label: 'Bridge' },
  rough: { roll: 0.2, drag: 0.08, label: 'Rough' },
  pinestraw: { roll: 0.28, drag: 0.1, label: 'Pine Straw' },
  deepRough: { roll: 0.34, drag: 0.12, label: 'Deep Rough' },
  bunker: { roll: 0.62, drag: 0.35, label: 'Bunker' },
  rock: { roll: 0.09, drag: 0.03, label: 'Rock' },
  water: { roll: 1.5, drag: 1, label: 'Water' },
};

const WORLD_RAIL_HEIGHT = 0.32;

/**
 * Runtime model of a hole: resolves the data into queryable geometry.
 * Shared by physics, rendering and camera so everything agrees on where things are.
 */
export class HoleModel {
  readonly layout: HoleLayout;
  readonly surfaces: ResolvedSurface[] = [];
  readonly bounds: Vec2[];
  readonly playBounds: Bounds2;
  readonly walls: Wall[] = [];
  readonly circles: CircleCollider[] = [];
  readonly bridges: ResolvedBridge[] = [];
  readonly greenPoly: Vec2[];
  readonly cup: Vec2;
  readonly cupRadius = 0.21;
  readonly teeHeight: number;
  readonly railHeight = WORLD_RAIL_HEIGHT;
  private elevation: ResolvedElevation[] = [];

  // baked heightfield for fast physics queries
  private hf!: Float32Array;
  private hfX0 = 0;
  private hfY0 = 0;
  private hfNX = 0;
  private hfNY = 0;
  private readonly hfStep = 0.1;

  constructor(layout: HoleLayout) {
    this.layout = layout;
    this.bounds = layout.bounds;
    this.playBounds = polyBounds(layout.bounds);
    this.cup = layout.cup;

    for (const e of layout.elevation) this.elevation.push(this.resolveElevation(e));

    for (const s of layout.surfaces) {
      let poly: Vec2[];
      if (s.path && s.width) poly = ribbonPolygon(smoothOpen(s.path, 6), s.width);
      else if (s.points) poly = s.smooth === false ? s.points : smoothClosed(s.points, 8);
      else continue;
      this.surfaces.push({ type: s.type, name: s.name, poly, bounds: polyBounds(poly), level: s.level ?? 0 });
    }
    const green = this.surfaces.find((s) => s.type === 'green');
    this.greenPoly = green ? green.poly : [];

    // rails
    const b = layout.bounds;
    for (let i = 0; i < b.length; i++) {
      const p = b[i];
      const q = b[(i + 1) % b.length];
      this.walls.push({ ax: p[0], ay: p[1], bx: q[0], by: q[1], bounce: layout.railStyle === 'hedge' ? 0.62 : 0.72, kind: 'rail' });
    }

    for (const t of layout.trees) {
      if (t.collide) this.circles.push({ x: t.at[0], y: t.at[1], r: 0.22 * (t.scale ?? 1), bounce: 0.55 });
    }
    for (const r of layout.rocks) {
      if (r.collide !== false && inBounds(this.playBounds, r.at[0], r.at[1]))
        this.circles.push({ x: r.at[0], y: r.at[1], r: r.radius, bounce: 0.6 });
    }

    // bridges need terrain heights at their ends -> resolve after elevation
    for (const br of layout.bridges) {
      const dx = br.to[0] - br.from[0];
      const dy = br.to[1] - br.from[1];
      const len = Math.hypot(dx, dy);
      const rb: ResolvedBridge = {
        ...br,
        dirX: dx / len,
        dirY: dy / len,
        length: len,
        h0: this.terrainHeightRaw(br.from[0], br.from[1]),
        h1: this.terrainHeightRaw(br.to[0], br.to[1]),
      };
      this.bridges.push(rb);
      if (br.rails) {
        const nx = -rb.dirY;
        const ny = rb.dirX;
        const hw = br.width / 2 + 0.06;
        // slightly inset so the ball can roll on from the ends
        const a0 = 0.15;
        const a1 = len - 0.15;
        for (const side of [-1, 1]) {
          this.walls.push({
            ax: br.from[0] + rb.dirX * a0 + nx * hw * side,
            ay: br.from[1] + rb.dirY * a0 + ny * hw * side,
            bx: br.from[0] + rb.dirX * a1 + nx * hw * side,
            by: br.from[1] + rb.dirY * a1 + ny * hw * side,
            bounce: 0.7,
            kind: 'bridge',
          });
        }
      }
    }

    this.teeHeight = this.terrainHeightRaw(layout.tee.at[0], layout.tee.at[1]);
    this.bakeHeightfield();
  }

  private resolveElevation(e: ElevationFeature): ResolvedElevation {
    switch (e.kind) {
      case 'mound':
        return { kind: 'mound', at: e.at, radius: e.radius, height: e.height, sx: e.stretch?.[0] ?? 1, sy: e.stretch?.[1] ?? 1 };
      case 'plateau': {
        const poly = smoothClosed(e.points, 6);
        return {
          kind: 'plateau',
          poly,
          bounds: polyBounds(poly, e.falloff),
          height: e.height,
          falloff: e.falloff,
          tilt: e.tilt ?? [0, 0],
          origin: e.tiltOrigin ?? centroid(poly),
        };
      }
      case 'channel': {
        const path = smoothOpen(e.path, 6);
        return { kind: 'channel', path, bounds: polyBounds(path, e.width), width: e.width, depth: e.depth, bedLevel: e.bedLevel };
      }
      case 'undulate': {
        const poly = smoothClosed(e.points, 6);
        return { kind: 'undulate', poly, bounds: polyBounds(poly, 1), amplitude: e.amplitude, wavelength: e.wavelength, seed: e.seed };
      }
      default:
        return e;
    }
  }

  /** Analytic terrain height (slow; used for baking and scenery). */
  terrainHeightRaw(x: number, y: number): number {
    let h = 0;
    for (const e of this.elevation) {
      switch (e.kind) {
        case 'base':
          h = e.height;
          break;
        case 'rampY':
          h += lerp(e.h0, e.h1, smoothstep(e.y0, e.y1, y)) - 0;
          break;
        case 'rampX':
          h += lerp(e.h0, e.h1, smoothstep(e.x0, e.x1, x));
          break;
        case 'mound': {
          const dx = (x - e.at[0]) / e.sx;
          const dy = (y - e.at[1]) / e.sy;
          const d2 = (dx * dx + dy * dy) / (e.radius * e.radius);
          if (d2 < 9) h += e.height * Math.exp(-d2 * 1.6);
          break;
        }
        case 'plateau': {
          if (!inBounds(e.bounds, x, y)) break;
          const sd = signedDistance(x, y, e.poly);
          const w = 1 - smoothstep(0, e.falloff, sd);
          if (w > 0) {
            const target = e.height + e.tilt[0] * (x - e.origin[0]) + e.tilt[1] * (y - e.origin[1]);
            h = lerp(h, target, w);
          }
          break;
        }
        case 'channel': {
          if (!inBounds(e.bounds, x, y)) break;
          const d = distToPolyline(x, y, e.path);
          const hw = e.width / 2;
          if (d < hw) {
            const t = 1 - smoothstep(0, hw, d);
            if (e.bedLevel !== undefined) h = lerp(h, Math.min(h, e.bedLevel), t);
            else h -= e.depth * t;
          }
          break;
        }
        case 'undulate': {
          if (!inBounds(e.bounds, x, y)) break;
          const sd = signedDistance(x, y, e.poly);
          const w = 1 - smoothstep(-0.6, 0.4, sd);
          if (w > 0) {
            const n = valueNoise2(x / e.wavelength, y / e.wavelength, e.seed) - 0.5;
            h += n * 2 * e.amplitude * w;
          }
          break;
        }
      }
    }
    return h;
  }

  private bakeHeightfield(): void {
    const b = polyBounds(this.bounds, 1.5);
    this.hfX0 = b.minX;
    this.hfY0 = b.minY;
    this.hfNX = Math.ceil((b.maxX - b.minX) / this.hfStep) + 2;
    this.hfNY = Math.ceil((b.maxY - b.minY) / this.hfStep) + 2;
    this.hf = new Float32Array(this.hfNX * this.hfNY);
    for (let j = 0; j < this.hfNY; j++) {
      for (let i = 0; i < this.hfNX; i++) {
        this.hf[j * this.hfNX + i] = this.terrainHeightRaw(this.hfX0 + i * this.hfStep, this.hfY0 + j * this.hfStep);
      }
    }
  }

  /** Terrain height (fast, bilinear from baked field inside the play area). */
  terrainHeight(x: number, y: number): number {
    const fx = (x - this.hfX0) / this.hfStep;
    const fy = (y - this.hfY0) / this.hfStep;
    const i = Math.floor(fx);
    const j = Math.floor(fy);
    if (i < 0 || j < 0 || i >= this.hfNX - 1 || j >= this.hfNY - 1) return this.terrainHeightRaw(x, y);
    const tx = fx - i;
    const ty = fy - j;
    const k = j * this.hfNX + i;
    const a = this.hf[k];
    const b = this.hf[k + 1];
    const c = this.hf[k + this.hfNX];
    const d = this.hf[k + this.hfNX + 1];
    return lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
  }

  /** If (x,y) is on a bridge deck, returns deck height, else null. */
  bridgeHeight(x: number, y: number): number | null {
    for (const br of this.bridges) {
      const rx = x - br.from[0];
      const ry = y - br.from[1];
      const along = rx * br.dirX + ry * br.dirY;
      const across = -rx * br.dirY + ry * br.dirX;
      if (along < 0 || along > br.length || Math.abs(across) > br.width / 2 + 0.02) continue;
      const t = along / br.length;
      return lerp(br.h0, br.h1, t) + br.archHeight * Math.sin(Math.PI * t);
    }
    return null;
  }

  /** Height of the rolling surface (bridge decks included). */
  surfaceHeight(x: number, y: number): number {
    const b = this.bridgeHeight(x, y);
    return b ?? this.terrainHeight(x, y);
  }

  /** Gradient of the rolling surface by central differences. */
  gradient(x: number, y: number, out: { x: number; y: number }): void {
    const e = 0.05;
    out.x = (this.surfaceHeight(x + e, y) - this.surfaceHeight(x - e, y)) / (2 * e);
    out.y = (this.surfaceHeight(x, y + e) - this.surfaceHeight(x, y - e)) / (2 * e);
  }

  surfaceAt(x: number, y: number): SurfaceType {
    if (this.bridgeHeight(x, y) !== null) return 'bridge';
    let result: SurfaceType = this.layout.defaultSurface;
    for (const s of this.surfaces) {
      if (!inBounds(s.bounds, x, y)) continue;
      if (pointInPolygon(x, y, s.poly)) result = s.type;
    }
    if (result === this.layout.defaultSurface && this.greenPoly.length) {
      // automatic collar around the green
      if (this.nearGreen(x, y, 0.45)) result = 'fringe';
    }
    return result;
  }

  nearGreen(x: number, y: number, margin: number): boolean {
    const gb = polyBounds(this.greenPoly, margin);
    if (!inBounds(gb, x, y)) return false;
    return signedDistance(x, y, this.greenPoly) < margin;
  }

  insidePlay(x: number, y: number): boolean {
    return pointInPolygon(x, y, this.bounds);
  }

  /** straight-line tee-to-cup distance in mini feet */
  get miniFeet(): number {
    return Math.hypot(this.cup[0] - this.layout.tee.at[0], this.cup[1] - this.layout.tee.at[1]);
  }

  /** centroid of the green for cameras */
  get greenCenter(): Vec2 {
    return this.greenPoly.length ? centroid(this.greenPoly) : this.cup;
  }

  clampHeightForRender(x: number, y: number): number {
    return clamp(this.terrainHeightRaw(x, y), -5, 50);
  }
}

export function centroid(poly: Vec2[]): Vec2 {
  let x = 0,
    y = 0;
  for (const p of poly) {
    x += p[0];
    y += p[1];
  }
  return [x / poly.length, y / poly.length];
}

/** Hole-space (x, y, h) -> world (X, Y, Z). */
export function toWorld(x: number, y: number, h: number): [number, number, number] {
  return [x, h, -y];
}
