/** Re-validates every campaign track from scratch and writes docs/TRACK_VALIDATION_REPORT.md (+ .json). npm run campaign:validate */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTrack, F_GAP } from '../src/sim/track';
import { validateGeometry } from '../src/sim/trackgen';
import { validateReplay, runLog, unpackReplay, fmtTime } from '../src/sim/replay';
import type { CampaignFile } from '../src/sim/campaign-types';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const camp: CampaignFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/campaign.json'), 'utf8'));
interface Row { id: number; name: string; completion: string; ms: number; evals: number; replay: string; ghosts: string; geometry: string; determinism: string; issues: string[]; lengthM: number; difficulty: number }
const rows: Row[] = [];
let bad = 0;
for (const t of camp.tracks) {
  const issues: string[] = [...t.meta.validation.issues.map(i => 'build: ' + i)];
  const tr = buildTrack(t);
  const geo = validateGeometry(t);
  const gf = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/replays', String(t.id).padStart(3, '0') + '.json'), 'utf8'));
  const v = validateReplay(tr, gf.bench);
  const a = runLog(tr, unpackReplay(gf.bench)); const b = runLog(tr, unpackReplay(gf.bench));
  const det = a.ms === b.ms && a.ticks === b.ticks && a.topSpeed === b.topSpeed;
  let ghostOk = 0, ghostN = 0;
  for (const [k, g] of Object.entries(gf.ghosts ?? {})) { ghostN++; if (validateReplay(tr, g as any).ok) ghostOk++; else issues.push(`ghost ${k} failed validation`); }
  if (!v.ok) issues.push('benchmark replay invalid: ' + v.reason);
  if (!geo.ok) issues.push('geometry: ' + geo.reason);
  if (!det) issues.push('non-deterministic replay');
  if (gf.bench.ms !== t.meta.bench.ms) issues.push('meta/replay time mismatch');
  if (tr.cps.some((c, i) => i > 0 && c <= tr.cps[i - 1]) || (tr.cps.length && tr.cps[tr.cps.length - 1] >= tr.finish)) issues.push('checkpoint order');
  if (tr.cps.some(c => tr.flags[c] & F_GAP)) issues.push('checkpoint inside a gap');
  if (a.crashes > 0) issues.push(`benchmark run has ${a.crashes} crash(es) (not a clean lap)`);
  if (!t.meta.bench.clean && a.crashes === 0) issues.push('meta clean flag stale');
  const ok = v.ok && geo.ok && det && !issues.some(i => !i.startsWith('build:') && !i.includes('crash(es)'));
  if (!ok) bad++;
  rows.push({ id: t.id, name: t.name, completion: a.finished && a.cpOK && a.respawns === 0 ? 'PASS' : 'FAIL', ms: t.meta.bench.ms, evals: t.meta.bench.evaluations, replay: v.ok ? 'PASS' : 'FAIL', ghosts: `${ghostOk}/${ghostN}`, geometry: geo.ok ? 'PASS' : 'FAIL', determinism: det ? 'PASS' : 'FAIL', issues, lengthM: t.meta.lengthM, difficulty: t.meta.difficulty });
}
const md = [
  '# APEXLINE track validation report', '', `Generated ${new Date().toISOString()} by \`npm run campaign:validate\` (physics \`${camp.physics}\`).`, '',
  `**${rows.length - bad} / ${rows.length} tracks pass all checks** (geometry, completion, benchmark replay re-simulation, medal-ghost re-simulation, determinism, checkpoint order).`, '',
  'Benchmark times are produced by the automated driver on the standardised car. They are upper bounds found by heuristic search - **not proven optimal** and **not human records**.', '',
  '| ID | Track | Length | Diff | Completion | Fastest simulated | Sim evaluations | Replay | Ghost replays | Geometry | Determinism | Known issues |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map(r => `| ${String(r.id).padStart(3, '0')} | ${r.name} | ${r.lengthM} m | ${r.difficulty} | ${r.completion} | ${fmtTime(r.ms)} | ${r.evals} | ${r.replay} | ${r.ghosts} | ${r.geometry} | ${r.determinism} | ${r.issues.join('; ') || '-'} |`),
].join('\n');
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs/TRACK_VALIDATION_REPORT.md'), md);
fs.writeFileSync(path.join(ROOT, 'docs/track-validation.json'), JSON.stringify(rows));
console.log(`${rows.length - bad}/${rows.length} tracks pass. Report written to docs/TRACK_VALIDATION_REPORT.md`);
process.exit(bad ? 1 : 0);
