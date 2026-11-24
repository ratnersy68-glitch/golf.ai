/** Measures simulation / generation / driver throughput on this machine. npm run bench */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { buildTrack } from '../src/sim/track'; import { Sim, STANDARD } from '../src/sim/vehicle'; import { evaluate, defaultGenes } from '../src/sim/driver'; import { generateTrack } from '../src/sim/trackgen';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const camp = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/campaign.json'), 'utf8'));
const t0 = performance.now(); for (let i = 1; i <= 275; i++) buildTrack(camp.tracks[i - 1]); const build = (performance.now() - t0) / 275;
const tr = buildTrack(camp.tracks[100]); const s = new Sim(tr); const N = 200000; const a = performance.now(); for (let i = 0; i < N; i++) { s.step({ thr: 1, brk: 0, steer: Math.sin(i / 50) * 0.2, hb: 0 }); if (s.finished) s.reset(); } const tick = (performance.now() - a) / N * 1000;
const b = performance.now(); let e = 0; for (let i = 0; i < 40; i++) { evaluate(tr, STANDARD, defaultGenes(tr, 0.5 + (i % 5) * 0.05)); e++; } const ev = (performance.now() - b) / e;
const c = performance.now(); for (let i = 1; i <= 40; i++) generateTrack(i * 6); const gen = (performance.now() - c) / 40;
console.log(JSON.stringify({ node: process.version, buildTrackMs: +build.toFixed(2), simTickMicros: +tick.toFixed(2), simRealtimeFactor: +(1e6 / 120 / tick).toFixed(0), driverEvalMs: +ev.toFixed(1), generateTrackMs: +gen.toFixed(1) }, null, 1));
