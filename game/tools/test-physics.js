import { flatCarry, speedForCarry, simulate, MPH } from '../src/core/physics.js';
import { CLUB_TYPES } from '../src/data/clubs.js';
import { COURSES } from '../src/data/courses.js';
import { Hole } from '../src/core/holeGen.js';
for (const c of CLUB_TYPES) {
  if (!c.carry) continue;
  const v = speedForCarry(c.carry, c.launch, c.spin);
  const r = flatCarry(v, c.launch, c.spin);
  console.log(c.id.padEnd(3), 'carry', c.carry, 'ball mph', (v/MPH).toFixed(0), 'apex yd', r.apex.toFixed(1), 'land°', r.landAngle.toFixed(0), 't', r.time.toFixed(1));
}
// full sim on Augusta 1 from tee with driver
const h = new Hole(COURSES[0], 0, {});
for (const [cid, pw] of [['DR',1],['7I',1],['PW',1],['SW',0.5]]) {
  const c = CLUB_TYPES.find(x=>x.id===cid);
  const v = speedForCarry(c.carry*pw, c.launch, c.spin);
  const hd = Math.atan2(h.teeDir[0], h.teeDir[1]);
  for (const firm of [0.3,0.6,0.9]) {
  const r = simulate(h, {x:h.tee[0], y:h.tee[1], h:h.heightAt(...h.tee)}, {speed:v, heading:hd, angle:c.launch*Math.PI/180, back:c.spin, side:0}, {wind:[0,0], firmness:firm, stimp:12});
  console.log(cid, 'firm', firm, 'carry', r.carry.toFixed(0), 'total', r.total.toFixed(0), 'surf', r.surf, 'dur', r.duration.toFixed(1), 'events', r.events.map(e=>e.type).join(','));
  }
}
