import fs from 'node:fs'; import { buildTrack } from '../src/sim/track'; import { generateTrack } from '../src/sim/trackgen'; import { optimise, evaluate, defaultGenes } from '../src/sim/driver'; import { STANDARD, Sim, DT } from '../src/sim/vehicle';
const ids = (process.argv[2] ?? '1,26,76,126,151,201,251,275').split(',').map(Number); const budget = +(process.argv[3] ?? 300);
for (const id of ids) { const def = generateTrack(id); const tr = buildTrack(def); const t0 = Date.now(); const r = optimise(tr, STANDARD, { budget, seed: id });
  console.log(`#${id} ${def.name.padEnd(18)} fin=${r.best.finished} ${(r.best.ms/1000).toFixed(2)}s ok-runs=${r.finishedRuns}/${r.evals} resp=${r.best.respawns} crash=${r.best.crashes} (${((Date.now()-t0)/1000).toFixed(1)}s)`); }
