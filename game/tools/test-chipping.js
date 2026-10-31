// Chipping model report: carry / roll / landing for each club off the fringe onto a flat green.
// Usage: node tools/test-chipping.js            (prints a table and checks the club-to-club ordering)
import { simulate } from '../src/core/physics.js';
import { computeLaunch, SHOT_TYPES } from '../src/game/shots.js';
import { buildBag, DEFAULT_BAG, DEFAULT_EQUIPMENT } from '../src/data/clubs.js';
import { S } from '../src/core/holeGen.js';

const flat = (surf = S.GREEN) => ({
  pin: null, pinH: 0, surfAt: (x, y) => (y < 0 ? S.FRINGE : surf), gradAt: () => [0, 0], heightAt: () => 0,
  isOB: () => false, treesNear: () => [], waterLevelAt: () => null,
});
const env = { wind: [0, 0], stimp: 12, firmness: 0.6 };
const diff = { disp: 0, window: 1, putt: 0 };
const attrs = { shortGame: 85, approach: 85, recovery: 85, driving: 85, putting: 85, power: 85 };
const CLUBS = buildBag(DEFAULT_BAG, DEFAULT_EQUIPMENT, attrs);
export function chip(clubId, typeId, carryYd, hole = flat()) {
  const club = CLUBS.find(c => c.id === clubId);
  const t = SHOT_TYPES[typeId];
  const power = carryYd / (club.carry * t.carryMul);
  const l = computeLaunch({ club, typeId, power, timing: 0, heading: 0, shape: 0, traj: 0, spin: { x: 0, y: 0 }, surf: S.FRINGE, attrs, diff, noNoise: true, rng: () => 0.5 });
  const r = simulate(hole, { x: 0, y: -0.5, h: 0 }, l, env, {});
  const land = r.events.find(e => e.type === 'land');
  return { club: clubId, type: typeId, launch: l.launchDeg, spin: Math.round(l.back), carry: r.carry, total: r.end.y + 0.5, roll: r.end.y - (land?.y ?? 0), apex: r.apex * 3 };
}
let fails = 0;
const rows = [];
for (const typeId of ['chip', 'pitch', 'lob']) {
  for (const id of ['LW', 'SW', 'GW', 'PW', '9I', '8I', '7I']) {
    if ((typeId === 'lob' && !['LW', 'SW', 'GW', 'PW'].includes(id)) || (typeId === 'pitch' && ['7I'].includes(id))) continue;
    for (const c of typeId === 'chip' ? [8, 15] : [25]) {
      const r = chip(id, typeId, c);
      rows.push(r);
      console.log(`${typeId.padEnd(5)} ${id.padEnd(3)} carry ${r.carry.toFixed(1).padStart(5)}  roll ${r.roll.toFixed(1).padStart(5)}  ratio 1:${(r.roll / r.carry).toFixed(2)}  launch ${r.launch.toFixed(1)}°  spin ${r.spin}  apex ${r.apex.toFixed(1)} ft`);
    }
  }
}
// ordering: for the same chip carry, less loft rolls further
const chips = rows.filter(r => r.type === 'chip' && Math.abs(r.carry - 8) < 2);
for (let i = 1; i < chips.length; i++) if (chips[i].roll <= chips[i - 1].roll) { fails++; console.log(`FAIL ${chips[i].club} should roll further than ${chips[i - 1].club}`); }
const lw = chips.find(r => r.club === 'LW'), i7 = chips.find(r => r.club === '7I');
if (!(lw.roll / lw.carry < 0.9)) { fails++; console.log('FAIL LW chip should be mostly carry'); }
if (!(i7.roll / i7.carry > 2.5)) { fails++; console.log('FAIL 7i chip should mostly roll'); }
console.log(fails ? `${fails} chipping checks failed` : 'chipping checks OK');
process.exit(fails ? 1 : 0);
