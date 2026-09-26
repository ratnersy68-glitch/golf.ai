import { describe, expect, it } from 'vitest';
import type { HoleLayout } from '../src/data/types';
import { augusta12 } from '../src/data/holes/augusta-12';
import { createBall, NEUTRAL_MODIFIERS, PHYSICS_DT, simulateShot, stepBall, strike } from '../src/systems/BallPhysics';
import { HoleModel } from '../src/world/HoleModel';

/** A flat, rectangular test green with a cup and a strip of water. */
const flat: HoleLayout = {
  ...augusta12,
  id: 'test-flat',
  bounds: [[-5, -2], [5, -2], [5, 30], [-5, 30]],
  tee: { at: [0, 0], size: [2, 2] },
  cup: [0, 10],
  defaultSurface: 'rough',
  surfaces: [
    { type: 'green', points: [[-5, -2], [5, -2], [5, 20], [-5, 20]], smooth: false },
    { type: 'water', points: [[-5, 24], [5, 24], [5, 26], [-5, 26]], smooth: false, level: 0 },
  ],
  elevation: [{ kind: 'base', height: 1 }],
  bridges: [],
  trees: [],
  scatter: [],
  rocks: [],
  landmarks: [],
};

describe('ball physics', () => {
  const model = new HoleModel(flat);

  it('a soft putt stops before the cup', () => {
    const b = simulateShot(model, 0, 0, 0, 3);
    expect(b.moving).toBe(false);
    expect(b.holed).toBe(false);
    expect(b.y).toBeGreaterThan(0.5);
    expect(b.y).toBeLessThan(10);
  });

  it('a well-paced putt drops', () => {
    // find a pace that holes it: there must be a window
    const holed = [5, 5.5, 6, 6.5, 7, 7.5, 8].filter((v) => simulateShot(model, 0, 0, 0, v).holed);
    expect(holed.length).toBeGreaterThan(0);
  });

  it('a firm putt races past and a very firm one finds the water', () => {
    const fast = simulateShot(model, 0, 0, 0, 14);
    expect(fast.holed).toBe(false);
    const wet = simulateShot(model, 0, 0, 0.05, 22);
    expect(wet.inWater).toBe(true);
  });

  it('rails keep the ball inside the course', () => {
    const b = simulateShot(model, 0, 0, Math.PI / 2, 20);
    expect(model.insidePlay(b.x, b.y)).toBe(true);
  });

  it('is deterministic (replays and ghosts depend on it)', () => {
    const a = simulateShot(model, 0, 0, 0.3, 17);
    const b = simulateShot(model, 0, 0, 0.3, 17);
    expect([a.x, a.y, a.time]).toEqual([b.x, b.y, b.time]);
  });

  it('slopes pull the ball downhill', () => {
    const sloped = new HoleModel({ ...flat, id: 'test-slope', elevation: [{ kind: 'base', height: 1 }, { kind: 'rampX', x0: -5, x1: 5, h0: 0.5, h1: -0.5 }] });
    const b = createBall(sloped, 0, 0);
    strike(b, 0, 6);
    for (let i = 0; i < 480 * 3 && b.moving; i++) stepBall(b, sloped, NEUTRAL_MODIFIERS);
    expect(b.x).toBeGreaterThan(0.2);
    expect(PHYSICS_DT).toBeCloseTo(1 / 480);
  });
});

describe('Augusta 12 model', () => {
  const m = new HoleModel(augusta12);
  it("Rae's Creek separates tee and green", () => {
    expect(m.surfaceAt(0, 38.2)).toBe('water');
    expect(m.surfaceAt(0, 20)).toBe('fairway');
    expect(m.surfaceAt(augusta12.cup[0], augusta12.cup[1])).toBe('green');
  });
  it('the Hogan Bridge carries the ball over the creek', () => {
    const mid = [(augusta12.bridges[0].from[0] + augusta12.bridges[0].to[0]) / 2, (augusta12.bridges[0].from[1] + augusta12.bridges[0].to[1]) / 2];
    expect(m.surfaceAt(mid[0], mid[1])).toBe('bridge');
    expect(m.surfaceHeight(mid[0], mid[1])).toBeGreaterThan(m.terrainHeight(mid[0], mid[1]));
  });
  it('the tee sits above the creek and the green above the water', () => {
    expect(m.surfaceHeight(0, 0)).toBeGreaterThan(m.surfaceHeight(0, 37));
    expect(m.surfaceHeight(augusta12.cup[0], augusta12.cup[1])).toBeGreaterThan(0.5);
  });
  it('mini length matches the real yardage at the stated scale', () => {
    const realFeet = augusta12.realYards * 3;
    expect(Math.abs(m.miniFeet - realFeet / augusta12.scale)).toBeLessThan(realFeet / augusta12.scale * 0.12);
  });
});
