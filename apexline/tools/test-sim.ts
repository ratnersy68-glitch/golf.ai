/** Headless test suite: physics determinism, replay validation, data integrity, economy, saves. npm run test:sim */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dsin, dcos, datan } from '../src/sim/dmath';
import { buildTrack } from '../src/sim/track';
import { Sim, STANDARD, TICK_RATE } from '../src/sim/vehicle';
import { packReplay, unpackReplay, validateReplay, runLog, InputLog, quantise, toInput } from '../src/sim/replay';
import { generateTrack, CHAPTERS } from '../src/sim/trackgen';
import { optimise } from '../src/sim/driver';
import type { CampaignFile } from '../src/sim/campaign-types';
import { COSMETICS, DEFAULT_OWNED, COSMETIC_MAP } from '../src/data/cosmetics';
import { VEHICLES, paramsFor } from '../src/data/vehicles';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { computeReward, levelFromXp, xpForLevel, migrateSave, defaultProfile, sanitiseSetup, defaultSetup, updateRanked, defaultRanked, perfRating, divisionOf, rollChallenges, MAX_LEVEL } from '../src/game/progress';
import { dailyPicks, weeklyCollection } from '../src/ui/shopLogic';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const t = (name: string, fn: () => void) => { try { fn(); pass++; console.log('  ok   ' + name); } catch (e: any) { fail++; console.log('  FAIL ' + name + ' -> ' + (e?.message ?? e)); } };
const eq = (a: any, b: any, m = '') => { if (a !== b) throw new Error(`${m} expected ${b}, got ${a}`); };
const ok = (c: any, m = 'assertion failed') => { if (!c) throw new Error(m); };

console.log('Math');
t('dsin/dcos match Math within 1e-7', () => { for (let x = -50; x < 50; x += 0.137) { ok(Math.abs(dsin(x) - Math.sin(x)) < 1e-7, `sin ${x}`); ok(Math.abs(dcos(x) - Math.cos(x)) < 1e-7, `cos ${x}`); } });
t('datan within 1e-4', () => { for (let x = -20; x < 20; x += 0.31) ok(Math.abs(datan(x) - Math.atan(x)) < 1e-4); });

console.log('Physics');
const camp: CampaignFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/campaign.json'), 'utf8'));
const tr1 = buildTrack(camp.tracks[0]);
t('straight-line launch is plausible (0-100 km/h in 2.5-6 s)', () => {
  const s = new Sim(tr1); let t100 = 0; for (let i = 0; i < 120 * 10 && !s.finished; i++) { s.step({ thr: 1, brk: 0, steer: 0, hb: 0 }); if (!t100 && s.speed * 3.6 >= 100) t100 = i / TICK_RATE; }
  ok(t100 > 2.5 && t100 < 6, `0-100 took ${t100}`);
});
t('braking from speed stops the car without reversing', () => {
  const s = new Sim(tr1); for (let i = 0; i < 120 * 5; i++) s.step({ thr: 1, brk: 0, steer: 0, hb: 0 }); const v0 = s.speed; for (let i = 0; i < 120 * 8; i++) s.step({ thr: 0, brk: 1, steer: 0, hb: 0 }); ok(v0 > 25); ok(s.vx >= -0.5, 'reversed');
});
t('identical inputs give bit-identical state (determinism)', () => {
  const run = () => { const s = new Sim(tr1); for (let i = 0; i < 3000; i++) s.step({ thr: 1, brk: i % 400 > 300 ? 1 : 0, steer: Math.sin(i / 90) * 0.4, hb: 0 }); return [s.s, s.d, s.vx, s.vy, s.w, s.hc, s.hs].join(','); };
  eq(run(), run());
});
t('vehicle classes differ but all derive from STANDARD', () => { const p = paramsFor('singularity'); ok(p.power > STANDARD.power * 1.5); eq(paramsFor('standard'), STANDARD); });

console.log('Campaign data');
t('275 tracks in 11 chapters of 25', () => { eq(camp.tracks.length, 275); for (let c = 1; c <= 11; c++) eq(camp.tracks.filter(x => x.chapter === c).length, 25, 'chapter ' + c); });
t('track names are unique and numbered 1..275', () => { eq(new Set(camp.tracks.map(x => x.name)).size, 275); camp.tracks.forEach((x, i) => eq(x.id, i + 1)); });
t('every track has medals ordered apex<plat<gold<silver<bronze and a verified benchmark', () => { for (const x of camp.tracks) { const m = x.meta.medals; ok(m.apex < m.platinum && m.platinum < m.gold && m.gold < m.silver && m.silver < m.bronze, 'medals ' + x.id); ok(x.meta.bench.replayVerified, 'bench ' + x.id); } });
t('track generation is deterministic (same seed -> same geometry)', () => { eq(JSON.stringify(generateTrack(47).pieces), JSON.stringify(generateTrack(47).pieces)); eq(JSON.stringify(generateTrack(47).pieces), JSON.stringify(camp.tracks[46].pieces.map(p => p))); });
t('difficulty rises through the campaign', () => { const d = (a: number, b: number) => camp.tracks.slice(a, b).reduce((s, x) => s + x.meta.difficulty, 0) / (b - a); ok(d(0, 25) < d(100, 125) && d(100, 125) < d(250, 275)); });
t('shipped benchmark replays validate by re-simulation', () => { for (const id of [1, 60, 140, 200, 275]) { const gf = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/replays', String(id).padStart(3, '0') + '.json'), 'utf8')); const v = validateReplay(buildTrack(camp.tracks[id - 1]), gf.bench); ok(v.ok, `track ${id}: ${v.reason}`); } });

console.log('Replay / anti-cheat');
const gf1 = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/replays/001.json'), 'utf8'));
t('pack/unpack round-trips the input stream', () => { const log = unpackReplay(gf1.bench); const re = packReplay(log, 1, 'standard', gf1.bench.ms); const log2 = unpackReplay(re); eq(log.length, log2.length); for (let i = 0; i < log.length; i += 37) eq(JSON.stringify(log.at(i)), JSON.stringify(log2.at(i))); });
t('a faked (faster) claimed time is rejected', () => { const bad = { ...gf1.bench, ms: gf1.bench.ms - 500 }; ok(!validateReplay(tr1, bad).ok); });
t('tampered inputs change or invalidate the result', () => { const log = unpackReplay(gf1.bench); for (let i = 500; i < 900; i++) log.steer[i] = 100; const r = packReplay(log, 1, 'standard', gf1.bench.ms); ok(!validateReplay(tr1, r).ok); });
t('out-of-range inputs are rejected', () => { const log = unpackReplay(gf1.bench); log.thr[10] = 250; const r = packReplay(log, 1, 'standard', gf1.bench.ms); ok(!validateReplay(tr1, r).ok); });
t('a replay that never reaches the finish is rejected', () => { const log = new InputLog(); for (let i = 0; i < 600; i++) log.push({ steer: 0, thr: 100, brk: 0, hb: 0 }); ok(!validateReplay(tr1, packReplay(log, 1, 'standard', 5000)).ok); });
t('driver is reproducible (same seed, same time)', () => { const a = optimise(tr1, STANDARD, { budget: 60, seed: 5 }), b = optimise(tr1, STANDARD, { budget: 60, seed: 5 }); eq(a.best.ms, b.best.ms); });

console.log('Content counts');
t('at least 24 vehicles in six categories', () => { ok(VEHICLES.length >= 24); eq(new Set(VEHICLES.map(v => v.category)).size, 6); eq(new Set(VEHICLES.map(v => JSON.stringify(v.shape))).size, VEHICLES.length, 'unique shapes'); });
t('at least 400 cosmetics, unique ids, all six rarities present', () => { ok(COSMETICS.length >= 400, String(COSMETICS.length)); eq(new Set(COSMETICS.map(c => c.id)).size, COSMETICS.length); eq(new Set(COSMETICS.map(c => c.rarity)).size, 6); });
t('at least 100 achievements, unique ids', () => { ok(ACHIEVEMENTS.length >= 100, String(ACHIEVEMENTS.length)); eq(new Set(ACHIEVEMENTS.map(a => a.id)).size, ACHIEVEMENTS.length); });
t('default cosmetics exist for every slot referenced by defaultSetup', () => { const s = defaultSetup('pulse'); const ids = [s.paint.finish, s.wheel.design, s.wheel.color, s.wheel.tire, s.wheel.caliper, ...Object.values(s.body), ...Object.values(s.lights), s.livery.preset, ...Object.values(s.fx), s.plate.style]; for (const id of ids) { ok(COSMETIC_MAP[id], 'missing ' + id); ok(DEFAULT_OWNED.includes(id), 'not default-owned ' + id); } });
t('no real-money / loot-box / pay-to-win fields exist on cosmetics', () => { for (const c of COSMETICS) { ok(!('usd' in c) && !('crate' in c)); ok(c.shop === 'earned' || c.price.credits !== undefined || c.price.tokens !== undefined || c.default, 'priced ' + c.id); } });

console.log('Economy / progression');
const meta = camp.tracks[10].meta;
t('repeat runs of the same track pay less (anti-farming)', () => {
  const r1 = computeReward(meta, meta.medals.bronze - 1, undefined);
  const prev = { bestMs: meta.medals.bronze - 1, medal: r1.medal, runs: 1, finishes: 1, runsToday: 1, runsDay: new Date().toISOString().slice(0, 10), firstPaid: r1.medal };
  const r2 = computeReward(meta, meta.medals.bronze - 1, prev); ok(r2.credits < r1.credits * 0.5, `${r2.credits} vs ${r1.credits}`);
  const prev5 = { ...prev, runsToday: 9 }; const r3 = computeReward(meta, meta.medals.bronze - 1, prev5); ok(r3.credits < r1.credits * 0.2);
});
t('first-time medal bonuses are paid once', () => { const first = computeReward(meta, meta.medals.gold - 1, undefined); ok(first.newMedal && first.credits > 400); const prev = { bestMs: meta.medals.gold - 1, medal: first.medal, runs: 1, finishes: 1, firstPaid: first.medal }; const again = computeReward(meta, meta.medals.gold - 1, prev); ok(!again.newMedal); });
t('beating the benchmark pays tokens once and is flagged', () => { const r = computeReward(meta, meta.bench.ms - 10, undefined); ok(r.beatBench && r.firstBench && r.tokens >= 20); });
t('level curve is monotone and level 250 is reachable', () => { let prev = 0; for (let l = 1; l < MAX_LEVEL; l++) { ok(xpForLevel(l) > prev); prev = xpForLevel(l); } eq(levelFromXp(1e9).level, MAX_LEVEL); });
t('ranked rating rewards benchmark-level performance and consistency', () => { ok(perfRating(meta.bench.ms, meta.bench.ms) > perfRating(meta.bench.ms * 1.3, meta.bench.ms)); let rk = defaultRanked(); for (let i = 0; i < 6; i++) rk = updateRanked(rk, 11, meta.bench.ms * 1.05, meta.bench.ms, 5); ok(rk.rating > 2000, String(rk.rating)); ok(divisionOf(rk.rating).index >= 12); });
t('challenges are deterministic per day/week', () => { eq(JSON.stringify(rollChallenges('2026-01-01', 3, true)), JSON.stringify(rollChallenges('2026-01-01', 3, true))); });
t('shop rotation is deterministic per day and week', () => { eq(dailyPicks('2026-03-03').map(c => c.id).join(), dailyPicks('2026-03-03').map(c => c.id).join()); ok(dailyPicks('2026-03-03').map(c => c.id).join() !== dailyPicks('2026-03-04').map(c => c.id).join()); eq(weeklyCollection('2026-W10').items.length, 6); });

console.log('Saves');
t('migration from an empty / old save keeps defaults', () => { const m = migrateSave({ version: 1, profile: { credits: 777, owned: [] }, settings: {} }); eq(m.profile.credits, 777); ok(m.profile.owned.length >= DEFAULT_OWNED.length); ok(m.profile.ranked && m.settings.vol); });
t('setups never reference cosmetics the player does not own', () => { const p = defaultProfile(); const s = defaultSetup('pulse'); s.body.spoiler = 'spoiler_big_wing'; s.paint.finish = 'finish_chrome'; const c = sanitiseSetup(p, s); eq(c.body.spoiler, 'spoiler_none'); eq(c.paint.finish, 'finish_gloss'); });
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
