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
import { qualityFor, FPS_LIMITS, DRAW_DISTANCES } from '../src/game/quality';
import { AdaptiveRes } from '../src/game/adaptive';
import { PRESETS, defaultSettings } from '../src/game/progress';

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
const trStraight = buildTrack({ id: 0, name: 's', chapter: 1, env: 'academy', seed: 1, pieces: [{ k: 'start', l: 44, w: 16 }, { k: 'straight', l: 2400, w: 16, f: 8 }, { k: 'finish', l: 60, w: 16 }] } as any);
t('straight-line launch is plausible (0-100 km/h in 2-4.5 s)', () => {
  const s = new Sim(tr1); let t100 = 0; for (let i = 0; i < 120 * 10 && !s.finished; i++) { s.step({ thr: 1, brk: 0, steer: 0, hb: 0 }); if (!t100 && s.speed * 3.6 >= 100) t100 = i / TICK_RATE; }
  ok(t100 > 2 && t100 < 4.5, `0-100 took ${t100}`);
});
t('braking from speed stops the car quickly and stably', () => {
  const s = new Sim(trStraight); for (let i = 0; i < 120 * 5; i++) s.step({ thr: 1, brk: 0, steer: 0, hb: 0 }); const v0 = s.speed; ok(v0 > 25);
  let stopAt = -1; for (let i = 0; i < 120 * 8; i++) { s.step({ thr: 0, brk: 1, steer: 0, hb: 0 }); if (stopAt < 0 && s.speed < 1) stopAt = i / 120; ok(Math.abs(s.vy) < 12, 'lateral blow-up'); }
  ok(stopAt > 0 && stopAt < 5, `stop time ${stopAt}`);
});
t('sliding backwards is damped, never amplified (slip-sign regression)', () => {
  const s = new Sim(trStraight); s.vx = -15; s.vy = -20; for (let i = 0; i < 600; i++) s.step({ thr: 0, brk: 0, steer: 0, hb: 0 }); ok(s.speed < 25, `speed grew to ${s.speed}`);
});
t('identical inputs give bit-identical state (determinism)', () => {
  const run = () => { const s = new Sim(tr1); for (let i = 0; i < 3000; i++) s.step({ thr: 1, brk: i % 400 > 300 ? 1 : 0, steer: Math.sin(i / 90) * 0.4, hb: 0 }); return [s.s, s.d, s.vx, s.vy, s.w, s.hc, s.hs].join(','); };
  eq(run(), run());
});
t('vehicle classes differ but all derive from STANDARD', () => { const p = paramsFor('singularity'); ok(p.power > STANDARD.power * 1.5); eq(paramsFor('standard'), STANDARD); });

console.log('Arcade handling feel');
const cruise = (v: number, track = trStraight) => { const s = new Sim(track); for (let i = 0; i < 120 * 12 && s.speed < v; i++) s.step({ thr: 1, brk: 0, steer: 0, hb: 0 }); return s; };
t('steering is immediate: yaw reaches 85% of its value within 0.2 s', () => {
  const s = cruise(40); const w: number[] = []; for (let i = 0; i < 120 * 0.6; i++) { s.step({ thr: 0.3, brk: 0, steer: 1, hb: 0 }); w.push(s.w); }
  const final = w[w.length - 1]; ok(final > 0.3, 'no yaw'); ok(w[Math.round(120 * 0.2)] > final * 0.85, `yaw@0.2s ${w[24]} vs ${final}`);
});
t('cornering is planted: <6 degrees of slip in a sustained hard turn at 40 m/s', () => {
  const s = cruise(40); for (let i = 0; i < 240; i++) s.step({ thr: 0.3, brk: 0, steer: 1, hb: 0 }); ok(Math.abs(Math.atan2(s.vy, s.vx)) < 0.105, `slip ${Math.atan2(s.vy, s.vx)}`);
});
t('no input = dead straight at speed (no wander, no steering delay residue)', () => {
  const s = cruise(55); const d0 = s.d, h0 = s.hs; for (let i = 0; i < 600; i++) s.step({ thr: 0.5, brk: 0, steer: 0, hb: 0 }); ok(Math.abs(s.d - d0) < 0.01 && Math.abs(s.hs - h0) < 1e-6);
});
t('hard braking from 200+ km/h stays straight and stops in < 4 s', () => {
  const s = cruise(58); let tt = -1; for (let i = 0; i < 120 * 6; i++) { s.step({ thr: 0, brk: 1, steer: 0, hb: 0 }); if (s.speed < 1) { tt = i / 120; break; } } ok(tt > 0 && tt < 4, `stop ${tt}`); ok(Math.abs(s.d) < 0.05);
});
t('fuzzed keyboard-like inputs for 4 simulated minutes never blow up', () => {
  const s = new Sim(trStraight); let seed = 1; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; let st = 0, maxVy = 0, maxV = 0;
  for (let i = 0; i < 120 * 240; i++) { if (i % 18 === 0) st = rnd() < 0.4 ? 0 : rnd() < 0.5 ? 1 : -1; s.step({ thr: rnd() < 0.9 ? 1 : 0, brk: rnd() < 0.08 ? 1 : 0, steer: st, hb: rnd() < 0.03 ? 1 : 0 }); maxVy = Math.max(maxVy, Math.abs(s.vy)); maxV = Math.max(maxV, s.speed); if (s.finished) s.reset(); ok(isFinite(s.vx + s.vy + s.s + s.d), 'NaN'); }
  ok(maxVy < 18 && maxV < 120, `maxVy ${maxVy} maxV ${maxV}`);
});
t('jumps land predictably: random air-control inputs never flip the car (>= 90% clean landings)', () => {
  const jt = buildTrack({ id: 0, name: 'j', chapter: 1, env: 'academy', seed: 1, pieces: [{ k: 'start', l: 44, w: 16 }, { k: 'straight', l: 240, w: 16 }, { k: 'ramp', l: 12, dp: 0.25, w: 16 }, { k: 'jump', l: 26, dp: -0.5, f: 1, w: 16 }, { k: 'land', l: 16, dp: 0.25, w: 16 }, { k: 'straight', l: 120, w: 16, f: 8 }, { k: 'finish', l: 60, w: 16 }] } as any);
  let clean = 0; const N = 40; let seed = 7; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let n = 0; n < N; n++) { const s = new Sim(jt); let pit = 0, yawI = 0; for (let i = 0; i < 120 * 40 && !s.finished && s.respawns === 0; i++) { if (s.air && i % 12 === 0) { pit = rnd() * 2 - 1; yawI = rnd() * 2 - 1; } s.step({ thr: s.air ? Math.max(0, -pit) : 1, brk: s.air ? Math.max(0, pit) : 0, steer: s.air ? yawI : 0, hb: 0 }); } if (s.finished && s.crashes === 0 && s.respawns === 0) clean++; }
  ok(clean >= N * 0.9, `${clean}/${N} clean`);
});

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
console.log('Graphics / performance');
t('save migration renames potato/cinematic presets and keeps player choice', () => { eq(migrateSave({ version: 3, profile: {}, settings: { preset: 'potato' } }).settings.preset, 'performance'); eq(migrateSave({ version: 3, profile: {}, settings: { preset: 'cinematic' } }).settings.preset, 'ultra'); eq(migrateSave({ version: 3, profile: {}, settings: { preset: 'low' } }).settings.autoTuned, true); eq(migrateSave(null).settings.autoTuned, false); });
t('five presets exist and every preset produces strictly non-decreasing quality knobs', () => {
  const names = ['performance', 'low', 'medium', 'high', 'ultra'] as const; eq(Object.keys(PRESETS).length, 5);
  let prev: ReturnType<typeof qualityFor> | null = null;
  for (const n of names) { const st = { ...defaultSettings(), ...PRESETS[n], preset: n }; const q = qualityFor(st); if (prev) { ok(q.far >= prev.far && q.propDensity >= prev.propDensity && q.tier >= prev.tier && q.texSize >= prev.texSize, n + ' regressed'); } prev = q; }
});
t('render-distance steps map to increasing distances; FPS limit list is complete', () => { for (let i = 1; i < DRAW_DISTANCES.length; i++) ok(DRAW_DISTANCES[i] > DRAW_DISTANCES[i - 1]); eq(FPS_LIMITS.join(), '30,60,120,144,165,240,0'); });
t('adaptive resolution drops under sustained load, recovers with headroom, never leaves [0.55, 1] and is inert when disabled', () => {
  const a = new AdaptiveRes(); let s = 1; for (let i = 0; i < 2000; i++) { const r = a.update(30, 60, true); if (r !== null) s = r; } ok(s < 1 && s >= 0.55, 'did not downscale: ' + s);
  for (let i = 0; i < 6000; i++) { const r = a.update(5, 60, true); if (r !== null) s = r; } eq(s, 1, 'did not recover');
  const b = new AdaptiveRes(); let changed = 0; for (let i = 0; i < 2000; i++) if (b.update(40, 60, false) !== null) changed++; eq(changed, 0);
});
t('adaptive resolution does not oscillate on a steady on-budget frame time', () => { const a = new AdaptiveRes(); let ch = 0; for (let i = 0; i < 5000; i++) if (a.update(15.5 + (i % 3) * 0.3, 60, true) !== null) ch++; eq(ch, 0); });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
