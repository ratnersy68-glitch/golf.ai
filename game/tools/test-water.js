// Audits every water hazard on every course: inside each water shape the terrain must sit
// below the water surface (otherwise the water is invisible but still a penalty), and the
// fairway/green must not be underwater. Usage: node tools/test-water.js [courseId]
import { COURSES } from '../src/data/courses.js';
import { Hole, S } from '../src/core/holeGen.js';
const only = process.argv[2];
let bad = 0;
for (const c of COURSES) {
  if (only && c.id !== only) continue;
  for (let i = 0; i < c.holes.length; i++) {
    const h = new Hole(c, i, { teeFactor: 1, pinSeed: 3 });
    for (const sh of h.waterShapes) {
      if (sh.kind === 'ocean') continue;
      let inside = 0, hidden = 0, dry = 0, flooded = 0, play = 0;
      const tmp = [0, 0];
      for (let y = h.gy0; y < h.gy0 + h.gny; y += 2) for (let x = h.gx0; x < h.gx0 + h.gnx; x += 2) {
        h.nearest(x, y, tmp);
        const v = sh.sdf(x, y, tmp[0], tmp[1]);
        // grass showing water on top of it: outside the hazard but under the drawn water sheet
        if (v >= 0 && v < 2.5) {
          const su = h.surfAt(x, y);
          if (su !== S.WATER) { play++; if (h.heightAt(x, y) < sh.level - 0.02) flooded++; }
        }
        if (v >= -1) continue;
        inside++;
        const t = h.heightAt(x, y);
        if (t > sh.level + 0.02) hidden++;
        if (h.surfAt(x, y) !== S.WATER) dry++;
      }
      const pct = inside ? hidden / inside : 0;
      const fl = play ? flooded / play : 0;
      const isBad = pct > 0.03 || fl > 0.05;
      if (isBad || process.env.ALL) {
        if (isBad) bad++;
        console.log(`${isBad ? 'BAD ' : 'ok  '}${c.id} #${i + 1} ${sh.kind} cells=${inside} hidden=${(pct * 100).toFixed(0)}% flooded=${(fl * 100).toFixed(0)}% level=${sh.level.toFixed(1)}`);
      }
    }
  }
}
console.log(bad ? `${bad} water hazards with hidden water` : 'all water hazards OK');
