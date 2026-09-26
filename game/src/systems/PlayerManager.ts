import type { GolferData, SurfaceType } from '../data/types';
import { rng } from '../world/geometry';
import { MAX_LAUNCH_SPEED, NEUTRAL_MODIFIERS, PhysicsModifiers } from './BallPhysics';

/**
 * Turns a golfer's stats and ability into gameplay. Everything is deliberately subtle:
 * the spread between the best and worst rated golfer is a few percent.
 */
export class PlayerManager {
  golfer: GolferData;
  private random: () => number;

  constructor(golfer: GolferData, seed = Date.now() % 100000) {
    this.golfer = golfer;
    this.random = rng(seed);
  }

  setGolfer(g: GolferData): void {
    this.golfer = g;
  }

  reseed(seed: number): void {
    this.random = rng(seed);
  }

  private ability(kind: string): number {
    const a = this.golfer.ability;
    return a && a.kind === kind ? a.magnitude : 0;
  }

  /** 100% power launch speed. POWER 85..99 -> ~0.98..1.02 */
  get maxSpeed(): number {
    const p = this.golfer.stats.power;
    return MAX_LAUNCH_SPEED * (1 + (p - 92) * 0.003) * (1 + this.ability('extraPower'));
  }

  /** Length of the dotted preview line in feet. PUTTING raises it a little. */
  get previewLength(): number {
    return (5 + (this.golfer.stats.putting - 85) * 0.18) * (1 + this.ability('lagMaster') * 2);
  }

  modifiers(context: { finalHole: boolean; distanceToCup: number }): PhysicsModifiers {
    const s = this.golfer.stats;
    const friction: Partial<Record<SurfaceType, number>> = {};
    const rough = this.ability('roughRider');
    if (rough) {
      friction.rough = 1 - rough;
      friction.deepRough = 1 - rough;
    }
    const sand = this.ability('sandEscape');
    if (sand) friction.bunker = 1 - sand;
    let capture = 1 + (s.putting - 90) * 0.006;
    if (context.finalHole) capture += this.ability('clutch');
    if (context.distanceToCup > 15) capture += this.ability('lagMaster');
    return {
      ...NEUTRAL_MODIFIERS,
      captureMultiplier: capture,
      railRestitution: 1 + (s.spin - 90) * 0.003 + this.ability('railMaster'),
      frictionScale: friction,
    };
  }

  /**
   * Apply human error to the intended shot. ACCURACY -> aim wobble, CONTROL -> power wobble.
   * Returns the shot actually struck (recorded for replays / ghosts).
   */
  execute(angle: number, power: number): { angle: number; power: number } {
    const s = this.golfer.stats;
    const gauss = () => (this.random() + this.random() + this.random() - 1.5) / 1.5;
    const aimSpread = ((100 - s.accuracy) * 0.045 * (1 - this.ability('pureStrike')) * Math.PI) / 180;
    const powerSpread = (100 - s.control) * 0.0016 * (1 - this.ability('steadyPower'));
    return {
      angle: angle + gauss() * aimSpread * (0.5 + power),
      power: Math.min(1, Math.max(0.02, power * (1 + gauss() * powerSpread))),
    };
  }
}
