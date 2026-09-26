/** Standard golf scoring terms and scorecard maths. */

export function scoreName(strokes: number, par: number): string {
  if (strokes === 1) return 'Hole in One!';
  const d = strokes - par;
  switch (d) {
    case -4:
      return 'Condor!';
    case -3:
      return 'Albatross!';
    case -2:
      return 'Eagle!';
    case -1:
      return 'Birdie!';
    case 0:
      return 'Par';
    case 1:
      return 'Bogey';
    case 2:
      return 'Double Bogey';
    case 3:
      return 'Triple Bogey';
    default:
      return d > 0 ? `+${d}` : `${d}`;
  }
}

export type ScoreTone = 'ace' | 'eagle' | 'birdie' | 'par' | 'bogey' | 'worse';

export function scoreTone(strokes: number, par: number): ScoreTone {
  if (strokes === 1) return 'ace';
  const d = strokes - par;
  if (d <= -2) return 'eagle';
  if (d === -1) return 'birdie';
  if (d === 0) return 'par';
  if (d === 1) return 'bogey';
  return 'worse';
}

export function formatToPar(d: number): string {
  return d === 0 ? 'E' : d > 0 ? `+${d}` : `${d}`;
}

/** Mini-golf pickup rule: a hole ends at par + 4. */
export function maxStrokes(par: number): number {
  return par + 4;
}

export interface CardEntry {
  layoutId: string;
  number: number;
  par: number;
  strokes: number;
}

export function summarize(card: CardEntry[]) {
  const strokes = card.reduce((a, c) => a + c.strokes, 0);
  const par = card.reduce((a, c) => a + c.par, 0);
  const rel = card.map((c) => c.strokes - c.par);
  const bestIdx = rel.indexOf(Math.min(...rel));
  const worstIdx = rel.indexOf(Math.max(...rel));
  return {
    strokes,
    par,
    toPar: strokes - par,
    best: card[bestIdx],
    worst: card[worstIdx],
    birdiesOrBetter: rel.filter((r) => r < 0).length,
  };
}

/** Coins earned for a hole. */
export function coinsFor(strokes: number, par: number): number {
  const tone = scoreTone(strokes, par);
  return { ace: 250, eagle: 120, birdie: 60, par: 30, bogey: 15, worse: 8 }[tone];
}

export function xpFor(strokes: number, par: number): number {
  return 20 + Math.max(0, par - strokes + 2) * 15;
}
