/** Controllability check: a bot restricted to *digital* keyboard steering (with the same input smoothing as the game) tries the campaign. npm run test:keyboard */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { buildTrack } from '../src/sim/track'; import { Sim, STANDARD, DT } from '../src/sim/vehicle'; import { Driver, Genes } from '../src/sim/driver'; import { quantise, toInput } from '../src/sim/replay';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const camp = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/campaign.json'), 'utf8'));
const genes: Record<string, number[]> = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/cache/genes.json'), 'utf8'));
let done = 0, tot = 0; const rows: string[] = [];
for (const id of (process.argv[2] ? process.argv[2].split(',').map(Number) : [1, 5, 12, 25, 30, 60, 90, 130, 170, 200, 230, 260])) {
  const tr = buildTrack(camp.tracks[id - 1]); const g = Float64Array.from(genes[id]); g[0] *= 0.82; // 18% below the optimised grip usage: a human margin
  const drv = new Driver(tr, STANDARD, g as Genes); const sim = new Sim(tr, STANDARD); let key = 0; let ticks = 0;
  while (!sim.finished && ticks < 120 * 400 && sim.respawns < 4) {
    const c = drv.control(sim); const target = c.steer > 0.12 ? 1 : c.steer < -0.12 ? -1 : 0;
    const rate = (target !== 0 && Math.sign(target) === Math.sign(key || target) ? 6.5 : 11);
    key += Math.max(-rate * DT, Math.min(rate * DT, target - key));
    sim.step(toInput(quantise({ thr: c.thr > 0.5 ? 1 : 0, brk: c.brk > 0.5 ? 1 : 0, steer: key, hb: 0 }))); ticks++;
  }
  tot++; if (sim.finished && sim.cp >= tr.cps.length) done++;
  rows.push(`#${String(id).padStart(3, '0')} ${camp.tracks[id - 1].name.padEnd(18)} ${sim.finished ? 'finished ' + (sim.finishMs / 1000).toFixed(1) + 's' : 'DNF at ' + (sim.progress * 100).toFixed(0) + '%'} (bench ${(camp.tracks[id - 1].meta.bench.ms / 1000).toFixed(1)}s, resets ${sim.respawns}, crashes ${sim.crashes})`);
}
console.log(rows.join('\n')); console.log(`${done}/${tot} tracks finished with digital keyboard steering only`);
