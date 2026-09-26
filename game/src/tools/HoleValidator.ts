import type { HoleLayout } from '../data/types';
import { HoleModel } from '../world/HoleModel';
import { MAX_LAUNCH_SPEED, simulateShot } from '../systems/BallPhysics';

export interface ValidationReport {
  id: string;
  /** fewest strokes in which the search holed out (Infinity if never) */
  bestStrokes: number;
  /** fewest strokes to reach the green */
  strokesToGreen: number;
  /** share of first shots that find water */
  teeWaterRate: number;
  /** share of first shots finishing on the green */
  teeGreenRate: number;
  aceShots: number;
  notes: string[];
}

/**
 * Authoring tool: a beam search over shots proves a recreated hole is playable as mini-golf,
 * and reports how punishing it is. Run it for every new real hole (see tests/holeValidator.test.ts).
 */
export function validateHole(layout: HoleLayout, opts = { beam: 8, angleStep: 5, powerStep: 0.1, maxStrokes: 5 }): ValidationReport {
  const model = new HoleModel(layout);
  const notes: string[] = [];
  const [cx, cy] = layout.cup;
  let frontier: { x: number; y: number }[] = [{ x: layout.tee.at[0], y: layout.tee.at[1] }];
  let bestStrokes = Infinity;
  let strokesToGreen = Infinity;
  let teeWater = 0;
  let teeGreen = 0;
  let teeTotal = 0;
  let aces = 0;

  if (!model.insidePlay(layout.tee.at[0], layout.tee.at[1])) notes.push('tee is outside the rails');
  if (model.surfaceAt(cx, cy) !== 'green') notes.push('cup is not on the green');

  for (let stroke = 1; stroke <= opts.maxStrokes && bestStrokes === Infinity; stroke++) {
    const results = new Map<string, { x: number; y: number; d: number }>();
    for (const start of frontier) {
      for (let a = 0; a < 360; a += opts.angleStep) {
        for (let p = opts.powerStep; p <= 1.0001; p += opts.powerStep) {
          const b = simulateShot(model, start.x, start.y, (a * Math.PI) / 180, p * MAX_LAUNCH_SPEED);
          if (stroke === 1) {
            teeTotal++;
            if (b.inWater) teeWater++;
            else if (b.holed) aces++;
            else if (b.surface === 'green') teeGreen++;
          }
          if (b.holed) {
            bestStrokes = Math.min(bestStrokes, stroke);
            continue;
          }
          if (b.inWater) continue;
          if (b.surface === 'green') strokesToGreen = Math.min(strokesToGreen, stroke);
          const key = `${Math.round(b.x * 2)},${Math.round(b.y * 2)}`;
          const d = Math.hypot(b.x - cx, b.y - cy);
          if (!results.has(key)) results.set(key, { x: b.x, y: b.y, d });
        }
      }
    }
    // keep a diverse beam: closest positions plus a few on the green
    const all = [...results.values()].sort((u, v) => u.d - v.d);
    frontier = all.slice(0, opts.beam);
  }
  return {
    id: layout.id,
    bestStrokes,
    strokesToGreen,
    teeWaterRate: teeTotal ? teeWater / teeTotal : 0,
    teeGreenRate: teeTotal ? teeGreen / teeTotal : 0,
    aceShots: aces,
    notes,
  };
}
