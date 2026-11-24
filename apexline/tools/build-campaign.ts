/**
 * APEXLINE campaign builder / benchmark calculator (offline Node runner).
 *
 *   npm run campaign:build                      # all 275 tracks
 *   npm run campaign:build -- --tracks 1-25     # a chapter
 *   npm run campaign:track -- 47                # one track (recalculate benchmark, keeps best genes)
 *   npm run campaign:build -- --budget 4000 --passes 3 --resume
 *
 * For every track: generate seeded geometry -> validate geometry -> let the automated driver
 * (same deterministic physics as players) search for the fastest clean run -> verify the recorded replay by
 * re-simulation -> derive medal targets. Tracks that cannot be completed cleanly are rejected and regenerated.
 */
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { buildTrack } from '../src/sim/track';
import { generateTrack, describeTrack, difficultyFor, chapterOf } from '../src/sim/trackgen';
import { optimise, evaluate, Genes, layout } from '../src/sim/driver';
import { STANDARD } from '../src/sim/vehicle';
import { packReplay, validateReplay, runLog, unpackReplay, ReplayMeta } from '../src/sim/replay';
import { lerp } from '../src/sim/dmath';
import type { CampaignTrack, CampaignFile, Medals } from '../src/sim/campaign-types';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'data');
const CACHE = path.join(ROOT, 'tools', 'cache', 'genes.json');
export const PHYSICS_VERSION = 'apexline-sim-1';

interface Job { id: number; budget: number; passes: number; prevGenes?: number[]; startAttempt: number }
interface JobResult { id: number; track?: CampaignTrack; replay?: ReplayMeta; ghosts?: Record<string, ReplayMeta>; genes?: number[]; error?: string; ms: number }

function medalsFor(B: number, chapter: number): Medals {
  const t = (chapter - 1) / 10;
  const gold = lerp(1.3, 1.14, t);
  return {
    apex: Math.round(B * 1.01),
    platinum: Math.round(B * lerp(1.07, 1.05, t)),
    gold: Math.round(B * gold),
    silver: Math.round(B * (gold + 0.24)),
    bronze: Math.round(B * (gold + 0.65)),
  };
}


/** Medal ghosts: slow the benchmark driver down (scale all speed targets) until the clean run lands just under the medal time. */
function medalGhost(tr: ReturnType<typeof buildTrack>, genes: Genes, target: number, trackId: number): ReplayMeta | null {
  const L = layout(tr);
  const scaled = (a: number): Genes => { const g = Float64Array.from(genes); g[0] = Math.max(0.2, g[0] * a); for (let p = 0; p < L.nP; p++) g[5 + L.nW + p] = Math.max(0.3, g[5 + L.nW + p] * a); return g; };
  const H: { best: { ms: number; log: any } | null } = { best: null };
  const tryA = (a: number) => { const r = evaluate(tr, STANDARD, scaled(a), { record: true, tickLimit: 120 * 600 }); if (r.finished && r.respawns === 0 && r.ms <= target && (!H.best || r.ms > H.best.ms)) H.best = { ms: r.ms, log: r.log }; };
  for (let k = 0; k <= 48; k++) tryA(0.18 + (1 - 0.18) * (k / 48));          // coarse scan of the speed scale
  for (let k = 0; k < 24 && H.best && target - H.best.ms > target * 0.01; k++) tryA(0.18 + 0.82 * (0.05 + 0.9 * ((k * 0.618034) % 1))); // deterministic refinement
  if (!H.best) return null;
  const rep = packReplay(H.best.log, trackId, 'standard', H.best.ms);
  return validateReplay(tr, rep).ok ? rep : null;
}

function buildOne(job: Job): JobResult {
  const t0 = Date.now();
  const issues: string[] = [];
  let attempt = job.startAttempt;
  for (let tries = 0; tries < 14; tries++) {
    const def = generateTrack(job.id, attempt);
    const tr = buildTrack(def);
    const usedAttempt = (def as any).attempt as number;
    let bestGenes: Genes | undefined = job.prevGenes && tries === 0 ? Float64Array.from(job.prevGenes) : undefined;
    let best: ReturnType<typeof optimise> | null = null;
    let evals = 0, finishedRuns = 0;
    for (let p = 0; p < job.passes; p++) {
      const r = optimise(tr, STANDARD, { budget: job.budget, seed: job.id * 7919 + p * 104729 + tries, init: bestGenes });
      evals += r.evals; finishedRuns += r.finishedRuns;
      if (r.best.finished && (!best || r.best.fitness < best.best.fitness)) { best = r; bestGenes = r.genes; }
    }
    const ratio = evals ? finishedRuns / evals : 0;
    if (!best || !best.best.finished) { issues.push(`attempt ${usedAttempt}: driver could not finish`); attempt = usedAttempt + 1; continue; }
    if (best.best.respawns > 0) { issues.push(`attempt ${usedAttempt}: best run needed a respawn`); attempt = usedAttempt + 1; continue; }
    if (ratio < 0.02) { issues.push(`attempt ${usedAttempt}: too brittle (${(ratio * 100).toFixed(1)}% runs finish)`); attempt = usedAttempt + 1; continue; }
    const log = best.best.log!;
    const replay = packReplay(log, job.id, 'standard', best.best.ms);
    const v = validateReplay(tr, replay);
    if (!v.ok) { issues.push(`attempt ${usedAttempt}: replay validation failed (${v.reason})`); attempt = usedAttempt + 1; continue; }
    const rr = runLog(tr, unpackReplay(replay));
    const ch = chapterOf(job.id);
    const B = best.best.ms;
    const medals = medalsFor(B, ch.id);
    const features: string[] = [];
    const desc = describeTrack(def);
    const m = /Features (.*)\./.exec(desc); if (m) features.push(...m[1].split(', '));
    const d = difficultyFor(job.id);
    const meta = {
      id: job.id, name: def.name, chapter: ch.id, env: def.env, description: desc, features,
      lengthM: Math.round(tr.lengthM), checkpoints: tr.cps.length,
      difficulty: Math.round((1 + 9 * d) * 10) / 10, estimatedSec: Math.round(medals.gold / 1000),
      medals,
      bench: {
        ms: B, peakKmh: Math.round(rr.topSpeed * 3.6), floorMs: Math.round((tr.lengthM / Math.max(rr.topSpeed, 1)) * 1000),
        passes: job.passes, evaluations: evals, replayVerified: true, clean: best.best.crashes === 0,
      },
      validation: { geometry: true, completion: true, replay: true, attempts: tries, issues },
    };
    const ghosts: Record<string, ReplayMeta> = {};
    for (const [k, t] of [['platinum', medals.platinum], ['gold', medals.gold], ['silver', medals.silver], ['bronze', medals.bronze]] as const) { const g = medalGhost(tr, best.genes, t, job.id); if (g) ghosts[k] = g; }
    const track: CampaignTrack = { ...def, meta };
    delete (track as any).attempt;
    (track as any).geomAttempt = usedAttempt;
    return { id: job.id, track, replay, ghosts, genes: Array.from(best.genes, v => Math.round(v * 1000) / 1000), ms: Date.now() - t0 };
  }
  return { id: job.id, error: issues.join('; ') || 'failed', ms: Date.now() - t0 };
}

if (!isMainThread) {
  const jobs: Job[] = workerData.jobs;
  for (const j of jobs) {
    let res: JobResult;
    try { res = buildOne(j); } catch (e: any) { res = { id: j.id, error: String(e?.stack ?? e), ms: 0 }; }
    parentPort!.postMessage(res);
  }
} else {
  main();
}

function parseRange(s: string): number[] {
  const out: number[] = [];
  for (const part of s.split(',')) {
    const m = /^(\d+)-(\d+)$/.exec(part);
    if (m) for (let i = +m[1]; i <= +m[2]; i++) out.push(i); else out.push(+part);
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const get = (k: string, def?: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : def; };
  let ids: number[];
  const single = get('--track');
  if (single) ids = [Number(single)];
  else if (get('--tracks')) ids = parseRange(get('--tracks')!);
  else if (args.length && /^\d+$/.test(args[0])) ids = [Number(args[0])];
  else ids = Array.from({ length: 275 }, (_, i) => i + 1);
  const budget = Number(get('--budget', '1500'));
  const passes = Number(get('--passes', '2'));
  const nWorkers = Number(get('--workers', '4'));
  const resume = args.includes('--resume');

  fs.mkdirSync(path.join(OUT, 'replays'), { recursive: true });
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  const campaignPath = path.join(OUT, 'campaign.json');
  const file: CampaignFile = fs.existsSync(campaignPath) ? JSON.parse(fs.readFileSync(campaignPath, 'utf8')) : { version: 1, generated: '', physics: PHYSICS_VERSION, tracks: [] };
  const byId = new Map<number, CampaignTrack>(file.tracks.map(t => [t.id, t]));
  const genesCache: Record<string, number[]> = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  const stale = file.physics !== PHYSICS_VERSION;
  if (stale) { byId.clear(); }

  const todo = ids.filter(id => !(resume && byId.has(id) && !stale));
  console.log(`Building ${todo.length} track(s) with ${nWorkers} workers, budget=${budget}, passes=${passes}`);
  const jobs: Job[] = todo.map(id => ({ id, budget, passes, prevGenes: stale ? undefined : genesCache[id], startAttempt: byId.get(id) ? ((byId.get(id) as any).geomAttempt ?? 0) : 0 }));
  // interleave so every worker gets a mix of cheap and expensive tracks
  const buckets: Job[][] = Array.from({ length: Math.min(nWorkers, Math.max(1, jobs.length)) }, () => []);
  jobs.forEach((j, i) => buckets[i % buckets.length].push(j));

  let done = 0; const failed: string[] = [];
  const t0 = Date.now();
  const save = () => {
    file.tracks = Array.from(byId.values()).sort((a, b) => a.id - b.id);
    file.generated = new Date().toISOString(); file.physics = PHYSICS_VERSION;
    fs.writeFileSync(campaignPath, JSON.stringify(file));
    fs.writeFileSync(CACHE, JSON.stringify(genesCache));
  };
  await Promise.all(buckets.map(b => new Promise<void>((resolve) => {
    const w = new Worker(fileURLToPath(import.meta.url), { workerData: { jobs: b }, execArgv: process.execArgv });
    w.on('message', (r: JobResult) => {
      done++;
      if (r.error || !r.track) { failed.push(`#${r.id}: ${r.error}`); console.log(`[${done}/${todo.length}] #${r.id} FAILED ${r.error}`); }
      else {
        byId.set(r.id, r.track); genesCache[r.id] = r.genes!;
        fs.writeFileSync(path.join(OUT, 'replays', `${String(r.id).padStart(3, '0')}.json`), JSON.stringify({ bench: r.replay, ghosts: r.ghosts }));
        const m = r.track.meta;
        console.log(`[${done}/${todo.length}] #${r.id} ${m.name.padEnd(22)} ${(m.lengthM + 'm').padStart(6)} bench ${(m.bench.ms / 1000).toFixed(3)}s  gold ${(m.medals.gold / 1000).toFixed(1)}s  rejected=${m.validation.attempts} (${(r.ms / 1000).toFixed(1)}s)`);
      }
      if (done % 10 === 0) save();
    });
    w.on('error', (e) => { console.error('worker error', e); resolve(); });
    w.on('exit', () => resolve());
  })));
  save();
  console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(0)}s. ${byId.size} tracks in campaign.json, ${failed.length} failed.`);
  for (const f of failed) console.log('  ' + f);
  if (failed.length) process.exitCode = 1;
}
