import { buildTrack, DS } from '../src/sim/track';
import { generateTrack } from '../src/sim/trackgen';
import { defaultGenes, Driver } from '../src/sim/driver';
import { Sim, STANDARD } from '../src/sim/vehicle';
import { quantise, toInput } from '../src/sim/replay';
const id=Number(process.argv[2]), t0=Number(process.argv[3]), t1=Number(process.argv[4]), gl=Number(process.argv[5]??0.5);
const def=generateTrack(id); const tr=buildTrack(def); const g=defaultGenes(tr,gl); const drv=new Driver(tr,STANDARD,g); const sim=new Sim(tr,STANDARD);
for(let t=0;t<120*t1;t++){ const q=quantise(drv.control(sim)); sim.step(toInput(q)); if(t>=120*t0 && t%15==0) console.log((t/120).toFixed(2),'s',sim.s.toFixed(0),'d',sim.d.toFixed(2),'hs',sim.hs.toFixed(2),'v',sim.vx.toFixed(1),'vy',sim.vy.toFixed(2),'w',sim.w.toFixed(2),'st',q.steer,'thr',q.thr,'brk',q.brk,'line',drv.plan.line[Math.floor(sim.s/DS)].toFixed(1),'air',sim.air); }
