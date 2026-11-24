import { buildTrack } from '../src/sim/track';
import { defaultGenes, Driver, evaluate } from '../src/sim/driver';
import { Sim, STANDARD } from '../src/sim/vehicle';
function mk(rollF:number, yawF:number, r:number, w:number){
  const def:any={id:1,name:'c',chapter:1,env:'x',seed:1,pieces:[
    {k:'straight',l:44,w},{k:'straight',l:180,w,f:2},
    {k:'cork',l:2*Math.PI*r,dp:2*Math.PI,r:rollF,y:yawF,w},
    {k:'straight',l:40,w,f:8},{k:'straight',l:70,w},{k:'finish',l:60,w}]};
  return buildTrack(def);
}
for (const rollF of [0,0.5,1.2,-1.2,2*Math.PI,-2*Math.PI]) for (const r of [18,24]) for (const yaw of [0.7]) {
  const tr = mk(rollF,yaw,r,12);
  let best:any=null;
  for (const gl of [0.4,0.6,0.8]) { const res = evaluate(tr,STANDARD,defaultGenes(tr,gl)); if(res.finished&&(!best||res.ms<best.ms)) best=res; }
  console.log(`roll=${rollF.toFixed(2)} r=${r} yaw=${yaw}: ${best?('OK '+best.ms+' crashes='+best.crashes):'FAIL'}`);
}
