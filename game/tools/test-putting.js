// Putting model checks on a synthetic green: speed control, cup capture, lip-outs and break.
// Usage: node tools/test-putting.js
import { simulate } from '../src/core/physics.js';
import { computePutt } from '../src/game/shots.js';
import { S } from '../src/core/holeGen.js';

const FT = 1 / 3;
// planar green tilted by (gx, gy) yards per yard, pin at the origin
const green = (gx = 0, gy = 0) => ({
  pin: [0, 0], pinH: 0,
  surfAt: () => S.GREEN, gradAt: () => [gx, gy], heightAt: (x, y) => x * gx + y * gy,
  isOB: () => false, treesNear: () => [], waterLevelAt: () => null,
});
const env = { wind: [0, 0], stimp: 12, firmness: 0.6, assist: { cupMul: 1, captureMul: 1 } };
// putt from distance d ft straight below the pin (ball at y = -d), aim offset in degrees, power so that the
// ball would stop `past` ft beyond the hole on a flat green
function putt(hole, dFt, aimDeg = 0, pastFt = 1.5) {
  const scaleYd = 40 * FT;
  const power = ((dFt + pastFt) * FT) / scaleYd;
  const l = computePutt({ power, scaleYd, heading: aimDeg * Math.PI / 180, attrs: { putting: 200 }, diff: { putt: 0 }, stimp: env.stimp, rng: () => 0.5 });
  const r = simulate(hole, { x: 0, y: -dFt * FT, h: hole.heightAt(0, -dFt * FT) }, l, env, { putt: true });
  const f = r.frames[r.frames.length - 1];
  return { holed: r.holed, lip: r.events.some(e => e.type === 'lip'), leave: Math.hypot(f.x, f.y) / FT };
}
let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log('FAIL', msg); } };

const flat = green();
for (const d of [3, 6, 10, 20, 40]) {
  const r = putt(flat, d);
  check(r.holed, `${d} ft straight putt at good pace should drop`);
  const miss = putt(flat, d, 0, -0.8);
  check(!miss.holed && Math.abs(miss.leave - 0.8) < 0.25, `${d} ft putt left 0.8 ft short stops 0.8 ft short (got ${miss.leave.toFixed(2)})`);
}
// pace: centred putts drop up to ~4-5 ft past pace, then hop the cup
let maxPast = 0;
for (let p = 0.5; p < 12; p += 0.25) if (putt(flat, 10, 0, p).holed) maxPast = p;
console.log(`centred 10 ft putt drops up to ${maxPast} ft of pace past the hole`);
check(maxPast >= 3 && maxPast <= 7, 'capture pace window is realistic');
// aim: an off-centre putt needs softer pace
const edgeAim = Math.atan2(0.8 * 0.054 / 0.9144, 10 * FT) * 180 / Math.PI; // path 80% of the cup radius off centre
check(putt(flat, 10, edgeAim, 0.6).holed, 'edge putt dying at the hole drops');
const lip = putt(flat, 10, edgeAim, 4);
check(!lip.holed && lip.lip, 'firm edge putt lips out');
// deterministic
check(JSON.stringify(putt(flat, 10, edgeAim, 4)) === JSON.stringify(lip), 'lip-outs are deterministic');
// slopes: uphill needs more stroke, downhill less; side slope breaks the ball
const up = green(0, 0.02), down = green(0, -0.02);
check(putt(up, 10, 0, 1.5).leave < putt(flat, 10, 0, 1.5).leave || !putt(up, 10, 0, 1.5).holed, 'uphill putt comes up shorter');
check(putt(down, 10, 0, -1).leave >= 0, 'downhill putt rolls on');
const side = green(0.02, 0);
const sr = putt(side, 15, 0, 1.5);
check(!sr.holed, 'a straight-aimed putt on a side slope breaks away from the hole');
let made = null;
for (let a = -15; a <= 15; a += 0.05) if (putt(side, 15, a, 1.5).holed) { made = a; break; }
check(made !== null, 'there is a line that holes the breaking putt');
console.log(`15 ft putt across a 2% slope: hole it aiming ${made?.toFixed(1)}° (${made > 0 ? 'right' : 'left'})`);
console.log(fails ? `${fails} putting checks failed` : 'putting checks OK');
process.exit(fails ? 1 : 0);
