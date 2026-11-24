import { buildTrack } from '../src/sim/track';
import { Sim, STANDARD } from '../src/sim/vehicle';
const def:any = { id:1,name:'t',chapter:1,env:'x',seed:1,pieces:[
 {k:'straight',l:1200,w:14,f:8},{k:'straight',l:50,f:0}] };
const tr = buildTrack(def);
const sim = new Sim(tr);
let t100=0,t200=0;
for(let i=0;i<120*40;i++){ sim.step({thr:1,brk:0,steer:0,hb:0}); const v=sim.speed*3.6; if(!t100&&v>=100)t100=i/120; if(!t200&&v>=200)t200=i/120; }
console.log('0-100',t100,'0-200',t200,'v',(sim.speed*3.6).toFixed(0),'s',sim.s.toFixed(0), 'fin',sim.finished);
// braking
for(let i=0;i<120*10;i++) sim.step({thr:0,brk:1,steer:0,hb:0});
console.log('after brake v', sim.speed.toFixed(2),'s',sim.s.toFixed(0));
// corner: curve left radius 60
const def2:any={id:2,name:'c',chapter:1,env:'x',seed:1,pieces:[{k:'straight',l:200,w:14},{k:'curve',l:60*Math.PI/2,y:Math.PI/2,w:14},{k:'straight',l:300,f:8}]};
const tr2=buildTrack(def2); const s2=new Sim(tr2);
for(let i=0;i<120*60&&!s2.finished;i++){ 
  const v=s2.speed; const steer = (s2.s>180&&s2.s<300)? 0.25:0; 
  s2.step({thr: v<30?1:0.3,brk:0,steer:steer,hb:0}); if(i%120==0) console.log(i/120|0,'s',s2.s.toFixed(0),'d',s2.d.toFixed(1),'v',v.toFixed(1),'psi',s2.hs.toFixed(2),'w',s2.w.toFixed(2),'air',s2.air); }
