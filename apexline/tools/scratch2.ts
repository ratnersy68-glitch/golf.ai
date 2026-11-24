import { buildTrack } from '../src/sim/track';
import { generateTrack, validateGeometry } from '../src/sim/trackgen';
import { optimise, evaluate, defaultGenes } from '../src/sim/driver';
import { STANDARD } from '../src/sim/vehicle';
const ids = process.argv.slice(2).map(Number);
for (const id of ids) {
  const t0=Date.now();
  const def = generateTrack(id);
  const tr = buildTrack(def);
  const kinds = def.pieces.map(p=>p.k).join(',');
  // quick eval default
  const r0 = evaluate(tr, STANDARD, defaultGenes(tr, 0.6));
  const t1=Date.now();
  console.log(`#${id} ${def.name} len=${tr.lengthM.toFixed(0)} cps=${tr.cps.length} default: fin=${r0.finished} ms=${r0.ms} prog=${r0.progress.toFixed(2)} resp=${r0.respawns} crash=${r0.crashes} (${t1-t0}ms)`);
  if(process.env.KINDS) console.log(kinds);
}
