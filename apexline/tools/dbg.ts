import { buildTrack, DS } from '../src/sim/track';
import { generateTrack } from '../src/sim/trackgen';
import { defaultGenes, Driver } from '../src/sim/driver';
import { Sim, STANDARD, EV_CRASH, EV_RESPAWN, EV_LAND, EV_TAKEOFF, EV_WALL } from '../src/sim/vehicle';
import { quantise, toInput } from '../src/sim/replay';
const id = Number(process.argv[2]); const gl = Number(process.argv[3] ?? 0.6);
const def = generateTrack(id); const tr = buildTrack(def);
const g = defaultGenes(tr, gl); const drv = new Driver(tr, STANDARD, g); const sim = new Sim(tr, STANDARD);
const pieceAt = (i:number)=>{ let p=0; for(let k=0;k<tr.pieceStart.length;k++) if(i>=tr.pieceStart[k]) p=k; return p; };
let lastLog=0;
for (let t=0;t<120*200 && !sim.finished;t++){
  const q = quantise(drv.control(sim)); sim.step(toInput(q));
  const si = sim.air? sim.hint : sim.s/DS; const p = pieceAt(Math.floor(si));
  if (sim.events & (EV_CRASH|EV_RESPAWN|EV_TAKEOFF|EV_LAND)) console.log(`t=${(t/120).toFixed(1)} ev=${sim.events} piece#${p} ${def.pieces[p].k} s=${si.toFixed(0)} v=${sim.speed.toFixed(1)} d=${sim.d.toFixed(1)} air=${sim.air} vplan=${drv.plan.vplan[Math.floor(si)]?.toFixed(1)}`);
  if (sim.respawns>2) break;
}
console.log('fin',sim.finished,sim.finishMs,'prog',sim.progress.toFixed(2));
