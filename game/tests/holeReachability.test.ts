import { describe, expect, it } from 'vitest';
import { HOLE_LAYOUTS } from '../src/data/holes';
import { validateHole } from '../src/tools/HoleValidator';

/**
 * Every recreated real hole must be finishable as mini-golf within par + 1 by a searching player,
 * with a sane tee and cup. The printed report doubles as a difficulty readout for authors.
 */
describe.each(HOLE_LAYOUTS.map((l) => [l.id, l] as const))('%s', (_id, layout) => {
  it('is playable', () => {
    const r = validateHole(layout);
    console.log(
      `${r.id}: holed in ${r.bestStrokes}, green in ${r.strokesToGreen}, tee->water ${(r.teeWaterRate * 100).toFixed(0)}%, tee->green ${(r.teeGreenRate * 100).toFixed(1)}%, aces ${r.aceShots}${r.notes.length ? ' | ' + r.notes.join('; ') : ''}`,
    );
    expect(r.notes).toEqual([]);
    expect(r.bestStrokes).toBeLessThanOrEqual(layout.par + 1);
  }, 600000);
});
