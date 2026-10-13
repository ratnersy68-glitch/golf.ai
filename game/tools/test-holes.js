import { COURSES } from '../src/data/courses.js';
import { Hole, S, SURF_KEYS } from '../src/core/holeGen.js';
let tot = 0;
for (const c of COURSES) {
  const par = c.holes.reduce((a,h)=>a+h.p,0);
  const t0 = Date.now();
  for (let i = 0; i < c.holes.length; i++) {
    const h = new Hole(c, i, { teeFactor: 1, pinSeed: 3 });
    const counts = new Array(13).fill(0);
    for (const v of h.surf) counts[v]++;
    const ts = h.surfAt(h.tee[0], h.tee[1]), ps = h.surfAt(h.pin[0], h.pin[1]);
    if (ts !== S.TEE || ps !== S.GREEN) console.log('BAD', c.id, i+1, SURF_KEYS[ts], SURF_KEYS[ps]);
    if (process.argv[2] === c.id) console.log(i+1, h.par, h.yards, 'grid', h.gnx, h.gny, 'trees', h.trees.length, 'green', counts[5]/4|0, 'fw', counts[3]/4|0, 'sand', counts[7]/4|0, 'water', counts[9]/4|0, 'pinH', h.pinH.toFixed(1));
  }
  const dt = Date.now() - t0; tot += dt;
  console.log(c.id, 'par', par, 'ms/hole', (dt/18).toFixed(0));
}
