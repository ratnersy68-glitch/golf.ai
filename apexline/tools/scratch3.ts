import { buildTrack } from '../src/sim/track';
import { generateTrack } from '../src/sim/trackgen';
import { optimise } from '../src/sim/driver';
import { STANDARD } from '../src/sim/vehicle';
const budget = Number(process.env.B ?? 300);
for (const id of process.argv.slice(2).map(Number)) {
  const def = generateTrack(id); const tr = buildTrack(def);
  const t0 = Date.now();
  const r = optimise(tr, STANDARD, { budget, seed: id });
  console.log(`#${id} ${def.name} fin=${r.best.finished} ms=${r.best.ms} finishedRuns=${r.finishedRuns}/${r.evals} resp=${r.best.respawns} crash=${r.best.crashes} prog=${r.best.progress.toFixed(2)} time=${((Date.now()-t0)/1000).toFixed(1)}s`);
}
