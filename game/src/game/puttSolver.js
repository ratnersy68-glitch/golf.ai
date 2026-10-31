// Putt solver: finds the line and pace that hole a putt on the real green (slope, green speed),
// so the game can show the true roll and reward a perfect stroke with a holed putt.
import { simulate, greenRollDecel, CUP_R } from '../core/physics.js';

const NO_CUP = { cupMul: 0.001, captureMul: 0.001 };
// a perfect putt arrives at the hole with enough pace to finish ~1.3 ft past (on the flat)
const PAST_YD = 0.45;

// roll a putt with the cup switched off and report the closest approach to the hole
export function rollProbe(hole, ball, heading, speed, stimp) {
  const env = { wind: [0, 0], stimp, firmness: 0.6, assist: NO_CUP };
  return simulate(hole, ball, { speed, heading, angle: 0, back: 0, side: 0 }, env, { putt: true, probe: true });
}

// pace for a given line: the starting speed that brings the ball past the hole at the ideal speed
function paceFor(hole, ball, heading, stimp, vIdeal, vMax, near = 0) {
  // nearby lines need nearly the same pace: search a narrow bracket around the last answer
  let lo = near ? near * 0.8 : 0.05, hi = near ? Math.min(vMax, near * 1.25) : vMax;
  for (let i = 0, n = near ? 10 : 15; i < n; i++) {
    const v = (lo + hi) / 2;
    const p = rollProbe(hole, ball, heading, v, stimp).probe;
    // stopped short of its closest approach (or never reached the hole) -> needs more pace
    if (p.v < vIdeal) lo = v; else hi = v;
  }
  return (lo + hi) / 2;
}

/**
 * Returns { heading, speed, dist (yards of roll on the flat at that speed), holed, breakYd }.
 * heading: aim line that holes the putt at perfect pace; speed: that pace (yd/s).
 */
export function solvePutt(hole, ball, stimp) {
  const a = greenRollDecel(stimp);
  const vIdeal = Math.sqrt(2 * a * PAST_YD);
  const direct = Math.atan2(hole.pin[0] - ball.x, hole.pin[1] - ball.y);
  const D = Math.hypot(hole.pin[0] - ball.x, hole.pin[1] - ball.y);
  const vMax = Math.sqrt(2 * a * (D * 3 + 8));
  const side = (h, near = 0) => {
    const v = paceFor(hole, ball, h, stimp, vIdeal, vMax, near);
    const p = rollProbe(hole, ball, h, v, stimp).probe;
    return { h, v, s: p.side * p.d, d: p.d };
  };
  // bracket the line between two aims that miss on opposite sides, then bisect
  let span = 0.35;
  let A = side(direct - span), B = side(direct + span);
  while (Math.sign(A.s) === Math.sign(B.s) && span < 1.2) {
    span += 0.35;
    A = side(direct - span); B = side(direct + span);
  }
  let best = Math.abs(A.s) < Math.abs(B.s) ? A : B;
  if (Math.sign(A.s) !== Math.sign(B.s)) {
    for (let i = 0; i < 22 && best.d > CUP_R * 0.05; i++) {
      const M = side((A.h + B.h) / 2, (A.v + B.v) / 2);
      if (Math.abs(M.s) < Math.abs(best.s)) best = M;
      if (Math.sign(M.s) === Math.sign(A.s)) A = M; else B = M;
    }
  }
  // confirm with the real cup that this line and pace drop
  const check = simulate(hole, ball, { speed: best.v, heading: best.h, angle: 0, back: 0, side: 0 },
    { wind: [0, 0], stimp, firmness: 0.6, assist: { cupMul: 1, captureMul: 1 } }, { putt: true });
  // the aim point: where the line would be at the hole's distance (shows how much it breaks)
  const breakYd = Math.sin(best.h - direct) * D;
  return { heading: best.h, speed: best.v, dist: best.v * best.v / (2 * a), holed: check.holed, breakYd, direct, D };
}
