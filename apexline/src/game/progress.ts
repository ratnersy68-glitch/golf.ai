import type { Profile, Settings, CarSetup, TrackRecord, Stats, RankedState, Challenge } from './types';
import { VEHICLE_MAP, VEHICLES } from '../data/vehicles';
import { COSMETIC_MAP, DEFAULT_OWNED, COSMETICS_BY_CAT } from '../data/cosmetics';
import type { Medals, TrackMeta } from '../sim/campaign-types';
import { Rng, hashStr } from '../sim/dmath';

export const SAVE_VERSION = 3;
export const PHYSICS_VERSION = 'apexline-sim-3';
export const MAX_LEVEL = 250;
export const PRESTIGE_NAMES = ['None', 'Rookie', 'Challenger', 'Specialist', 'Expert', 'Elite', 'Champion', 'Legend', 'Apex'];
export const MEDAL_NAMES = ['None', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Apex'];
export const MEDAL_COLORS = ['#B8BDC4', '#B07A45', '#C3CAD4', '#FFC400', '#9FE8FF', '#25282D'];

// ------------------------------------------------------------------------------------------------ XP / levels
export const xpForLevel = (l: number): number => Math.round(150 + 12 * l + 0.12 * l * l);
export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  let l = 1, rem = xp;
  while (l < MAX_LEVEL && rem >= xpForLevel(l)) { rem -= xpForLevel(l); l++; }
  return { level: l, into: l >= MAX_LEVEL ? xpForLevel(l) : rem, need: xpForLevel(l) };
}
export function totalXpForLevel(level: number): number { let t = 0; for (let l = 1; l < level; l++) t += xpForLevel(l); return t; }

export interface LevelReward { credits: number; tokens: number; item?: string }
const LEVEL_ITEMS: Record<number, string> = {
  10: 'plate_e_lvl10', 25: 'banner_e_lvl25', 50: 'garage_e_lvl50', 75: 'avatar_e_lvl75', 150: 'garage_e_lvl150', 200: 'banner_e_lvl200',
};
export function levelReward(level: number): LevelReward {
  return { credits: 150 + level * 25 + (level % 10 === 0 ? 1000 : 0), tokens: level % 10 === 0 ? 5 + Math.floor(level / 25) * 2 : level % 5 === 0 ? 1 : 0, item: LEVEL_ITEMS[level] };
}

// ------------------------------------------------------------------------------------------------ defaults
export function defaultSetup(vehicle: string): CarSetup {
  const v = VEHICLE_MAP[vehicle] ?? VEHICLES[0];
  return {
    vehicle: v.id,
    paint: { primary: v.defaultColors[0], secondary: v.defaultColors[1], accent: v.defaultColors[2], finish: 'finish_gloss' },
    wheel: { design: 'wheel_five_star', color: 'wheelColor_silver', tire: 'tire_apexline_sport', caliper: 'caliper_stock_black' },
    body: { spoiler: 'spoiler_none', splitter: 'splitter_none', skirt: 'skirt_none', diffuser: 'diffuser_none', hood: 'hood_stock', scoop: 'scoop_none', widebody: 'widebody_stock_fenders', exhaust: 'exhaust_stock_pipe', fbumper: 'fbumper_stock_bumper', rbumper: 'rbumper_stock_bumper' },
    lights: { head: 'headlight_xenon_white', tail: 'taillight_stock_red', underglow: 'underglow_none', pattern: 'lightpattern_solid' },
    livery: { preset: 'livery_l01', layers: [], useBase: true },
    fx: { trail: 'trail_ion_wake', flame: 'flame_stock_blue', smoke: 'smoke_white_smoke', finish: 'finishfx_confetti', spawn: 'spawn_fade', victory: 'victory_cruise' },
    plate: { text: 'APEXLINE', style: 'plate_classic_white' },
    number: 7,
  };
}

export const defaultStats = (): Stats => ({
  races: 0, finishes: 0, driveMs: 0, distanceM: 0, topMps: 0, longestJump: 0, crashes: 0, restarts: 0, pbs: 0, wr: 0, benchmarks: 0, creditsEarned: 0, ghostWins: 0,
  dailyDone: 0, weeklyDone: 0, purchases: 0, airMs: 0, platinum: 0, apex: 0, gold: 0, silver: 0, bronze: 0, vehicleTime: {}, envTime: {}, milliWins: 0, endless: 0, stuntBest: 0, published: 0, ranks: 0, cleanRuns: 0, creditsSpent: 0,
});

export const defaultRanked = (): RankedState => ({ placements: 0, perf: [], rating: 0, peak: 0, history: [], weekRuns: {}, season: seasonId() });

export function defaultProfile(): Profile {
  return {
    name: 'Driver', title: 'title_time_attacker', avatar: 'avatar_bolt_lime', banner: 'banner_carbon_stripes', plateText: 'APEXLINE',
    credits: 1500, tokens: 0, xp: 0, level: 1, prestige: 0,
    owned: [...DEFAULT_OWNED], vehicles: ['pulse'], setups: { pulse: defaultSetup('pulse') }, selected: 'pulse', presets: [],
    records: {}, favorites: [], wishlist: [], stats: defaultStats(), ach: {}, achProgress: {},
    daily: { day: '', list: [], streak: 0 }, weekly: { week: '', list: [], champ: {}, champDone: false },
    ranked: defaultRanked(), customTracks: [], claimedLevels: [], unlockedChapter: [1], seenIntro: false, rewardsClaimed: {},
  };
}

export const KEYS_DEFAULT: Record<string, string[]> = {
  accel: ['KeyW', 'ArrowUp'], brake: ['KeyS', 'ArrowDown'], left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'], handbrake: ['Space'],
  restart: ['KeyR'], checkpoint: ['Backspace'], camera: ['KeyC'], pause: ['Escape'], leaderboard: ['Tab'], ghost: ['KeyG'],
};

export function defaultSettings(): Settings {
  return {
    preset: 'high', resScale: 1, shadows: 2, reflections: 2, particles: 2, drawDistance: 2, fpsLimit: 0, bloom: true, motionBlur: false, ssao: false, antialias: true,
    reducedMotion: false, cameraShake: 1, colorblind: 'off', units: 'kmh', vol: { master: 0.8, music: 0.5, engine: 0.8, env: 0.7, ui: 0.8 },
    keys: JSON.parse(JSON.stringify(KEYS_DEFAULT)), deadzone: 0.12, steerSens: 1, vibration: true, touchScale: 1, touchOpacity: 0.7, touchLeft: false,
    hud: { speed: true, minimap: true, delta: true, progress: true, keys: false, scale: 1 }, camera: 0, ghost: true, instantRestart: true, showFps: false, ghostKind: 'pb',
  };
}

export const PRESETS: Record<Settings['preset'], Partial<Settings>> = {
  potato: { resScale: 0.5, shadows: 0, reflections: 0, particles: 0, drawDistance: 0, bloom: false, motionBlur: false, ssao: false, antialias: false },
  low: { resScale: 0.75, shadows: 0, reflections: 0, particles: 1, drawDistance: 1, bloom: false, motionBlur: false, ssao: false, antialias: false },
  medium: { resScale: 1, shadows: 1, reflections: 1, particles: 1, drawDistance: 1, bloom: true, motionBlur: false, ssao: false, antialias: true },
  high: { resScale: 1, shadows: 2, reflections: 2, particles: 2, drawDistance: 2, bloom: true, motionBlur: false, ssao: false, antialias: true },
  ultra: { resScale: 1, shadows: 3, reflections: 3, particles: 3, drawDistance: 3, bloom: true, motionBlur: false, ssao: true, antialias: true },
  cinematic: { resScale: 1.25, shadows: 3, reflections: 3, particles: 3, drawDistance: 3, bloom: true, motionBlur: true, ssao: true, antialias: true },
};

/** Versioned save migrations: each function lifts version n -> n+1. Unknown fields are kept, missing fields get defaults. */
export function migrateSave(raw: any): { profile: Profile; settings: Settings } {
  const base = defaultProfile(), baseS = defaultSettings();
  const v = raw?.version ?? 0;
  let p = raw?.profile ?? {}, s = raw?.settings ?? {};
  if (v < 2) {
    // v1 -> v2: introduced prestige, ranked state, challenge streaks
    p.prestige ??= 0; p.ranked ??= defaultRanked(); p.daily ??= base.daily; p.weekly ??= base.weekly;
  }
  if (v < 3) {
    // v2 -> v3: new arcade physics. Old times / medals / replays no longer reproduce, so they are archived (not deleted) and records restart.
    const old = p.records ?? {};
    if (Object.keys(old).length) {
      p.archive = [...(p.archive ?? []), { physics: 'apexline-sim-2', at: Date.now(), records: old }];
      p.unlockMedals = Math.max(p.unlockMedals ?? 0, Object.values<any>(old).filter(r => r.medal > 0).length);
      p.records = {};
    }
  }
  const profile: Profile = { ...base, ...p, stats: { ...base.stats, ...(p.stats ?? {}) }, ranked: { ...base.ranked, ...(p.ranked ?? {}) } };
  const settings: Settings = { ...baseS, ...s, vol: { ...baseS.vol, ...(s.vol ?? {}) }, hud: { ...baseS.hud, ...(s.hud ?? {}) }, keys: { ...baseS.keys, ...(s.keys ?? {}) } };
  // ensure all default cosmetics are owned and every owned vehicle has a setup
  for (const id of DEFAULT_OWNED) if (!profile.owned.includes(id)) profile.owned.push(id);
  for (const veh of profile.vehicles) if (!profile.setups[veh]) profile.setups[veh] = defaultSetup(veh);
  if (!profile.vehicles.includes(profile.selected)) profile.selected = profile.vehicles[0] ?? 'pulse';
  return { profile, settings };
}

// ------------------------------------------------------------------------------------------------ dates
export function dayId(d = new Date()): string { return d.toISOString().slice(0, 10); }
export function weekId(d = new Date()): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - dayNum + 3);
  const first = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const wk = 1 + Math.round(((t.getTime() - first.getTime()) / 86400000 - 3 + ((first.getUTCDay() + 6) % 7)) / 7);
  return `${t.getUTCFullYear()}-W${String(wk).padStart(2, '0')}`;
}
export function seasonId(d = new Date()): string { const q = Math.floor(d.getUTCMonth() / 3) + 1; return `${d.getUTCFullYear()}-S${q}`; }

// ------------------------------------------------------------------------------------------------ medals and rewards
export function medalFor(ms: number, m: Medals): number {
  if (ms <= m.apex) return 5; if (ms <= m.platinum) return 4; if (ms <= m.gold) return 3; if (ms <= m.silver) return 2; if (ms <= m.bronze) return 1; return 0;
}

export interface RaceReward {
  credits: number; tokens: number; xp: number; medal: number; newMedal: boolean; pb: boolean; pbDelta: number | null; beatBench: boolean; firstBench: boolean;
  breakdown: { label: string; credits?: number; tokens?: number; xp?: number }[]; farmFactor: number;
}

const FIRST_MEDAL = [0, 100, 220, 450, 900, 1800];
const FIRST_MEDAL_TOKENS = [0, 0, 0, 2, 8, 25];

/**
 * Reward model. Credits for finishing decay on repeats of the same track in a day (so farming the easiest
 * track is never the best income); the large payouts are one-time medal milestones, personal-record bonuses and
 * benchmark beats, which all require actually improving.
 */
export function computeReward(meta: TrackMeta, ms: number, prev: TrackRecord | undefined, ranked = false, practice = false): RaceReward {
  const today = dayId();
  const runsToday = prev && prev.runsDay === today ? (prev.runsToday ?? 0) : 0;
  const farm = Math.max(0.1, [1, 0.6, 0.35, 0.2][runsToday] ?? 0.1);
  const medal = medalFor(ms, meta.medals);
  const prevMedal = prev?.medal ?? 0;
  const chap = 1 + 0.12 * (meta.chapter - 1);
  const breakdown: RaceReward['breakdown'] = [];
  const baseC = Math.round((30 + meta.difficulty * 14 + meta.lengthM / 60) * farm * chap * (practice ? 0.5 : 1));
  const baseX = Math.round((30 + meta.difficulty * 9) * farm * (practice ? 0.5 : 1));
  breakdown.push({ label: farm < 1 ? `Finish (x${farm.toFixed(2)} repeat)` : 'Finish', credits: baseC, xp: baseX });
  let credits = baseC, xp = baseX, tokens = 0;
  const paid = prev?.firstPaid ?? 0;
  const newMedal = medal > paid;
  if (newMedal && !practice) {
    for (let m = paid + 1; m <= medal; m++) {
      const c = Math.round(FIRST_MEDAL[m] * chap), t = FIRST_MEDAL_TOKENS[m], x = m * 60;
      credits += c; tokens += t; xp += x;
      breakdown.push({ label: `${MEDAL_NAMES[m]} medal (first time)`, credits: c, tokens: t || undefined, xp: x });
    }
  }
  const pb = !prev || ms < prev.bestMs;
  let pbDelta: number | null = null;
  if (pb && prev && prev.bestMs > 0) {
    pbDelta = prev.bestMs - ms;
    if (pbDelta >= 50 && !practice) {
      const bonus = Math.round(Math.min(400, 40 + pbDelta / 40) * chap);
      credits += bonus; xp += 40; breakdown.push({ label: 'Personal record', credits: bonus, xp: 40 });
    }
  }
  const beat = ms < meta.bench.ms;
  const firstBench = beat && !prev?.beatBench;
  if (firstBench && !practice) { tokens += 20; credits += 1500; xp += 400; breakdown.push({ label: 'Beat the simulated benchmark', credits: 1500, tokens: 20, xp: 400 }); }
  if (ranked) { xp += 30; breakdown.push({ label: 'Ranked bonus', xp: 30 }); }
  return { credits, tokens, xp, medal, newMedal, pb, pbDelta, beatBench: beat, firstBench, breakdown, farmFactor: farm };
}

// ------------------------------------------------------------------------------------------------ ranked
export const DIVISIONS: { name: string; min: number }[] = [];
['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].forEach((n, i) => ['I', 'II', 'III'].forEach((r, j) => DIVISIONS.push({ name: `${n} ${r}`, min: i * 450 + j * 150 })));
DIVISIONS.push({ name: 'Master', min: 2300 }, { name: 'Grandmaster', min: 2650 }, { name: 'Apex', min: 3000 });
export function divisionOf(rating: number): { name: string; index: number; next: number | null; min: number } {
  let idx = 0; for (let i = 0; i < DIVISIONS.length; i++) if (rating >= DIVISIONS[i].min) idx = i;
  return { name: DIVISIONS[idx].name, index: idx, next: DIVISIONS[idx + 1]?.min ?? null, min: DIVISIONS[idx].min };
}
/** Performance rating of a single run: relative to the simulated benchmark on the standard vehicle (0.5 ratio => 0, 1.0 => 3200). */
export function perfRating(ms: number, benchMs: number): number {
  const r = Math.min(1.04, benchMs / ms);
  if (r <= 0.5) return 0;
  return Math.round(3200 * Math.pow((r - 0.5) / 0.5, 1.7));
}
export function updateRanked(rk: RankedState, trackId: number, ms: number, bench: number, difficulty: number): RankedState {
  const v = perfRating(ms, bench);
  const w = 0.6 + difficulty / 10 * 0.8;
  const perf = [...rk.perf, { id: trackId, v, w, day: dayId() }].slice(-14);
  const placements = rk.placements + 1;
  const sorted = [...perf].sort((a, b) => b.v - a.v).slice(0, Math.max(3, Math.ceil(perf.length * 0.7))); // forgives a few bad runs, rewards consistency
  const wsum = sorted.reduce((a, b) => a + b.w, 0);
  const avg = sorted.reduce((a, b) => a + b.v * b.w, 0) / wsum;
  const rating = placements < 5 ? Math.round(avg * 0.85) : Math.round(avg);
  return { ...rk, perf, placements, rating, peak: Math.max(rk.peak, rating), history: [...rk.history, { t: Date.now(), rating, id: trackId, ms }].slice(-100) };
}

// ------------------------------------------------------------------------------------------------ challenges
const CH_TEMPLATES: { kind: string; desc: (t: number, env?: string) => string; targets: number[]; daily: boolean; reward: (t: number) => { credits: number; tokens?: number; xp: number } }[] = [
  { kind: 'finish', desc: t => `Complete ${t} tracks`, targets: [3, 5, 8], daily: true, reward: t => ({ credits: 150 * t, xp: 60 * t }) },
  { kind: 'gold', desc: t => `Earn ${t} gold medals`, targets: [2, 3, 5], daily: true, reward: t => ({ credits: 400 * t, xp: 150 * t }) },
  { kind: 'pb', desc: t => `Beat ${t} personal records`, targets: [1, 2, 3], daily: true, reward: t => ({ credits: 500 * t, xp: 120 * t }) },
  { kind: 'env', desc: (t, env) => `Complete ${t} ${env} tracks`, targets: [3, 5], daily: true, reward: t => ({ credits: 250 * t, xp: 90 * t }) },
  { kind: 'clean', desc: () => 'Complete a track without crashing', targets: [1], daily: true, reward: () => ({ credits: 600, xp: 200 }) },
  { kind: 'ghost', desc: () => 'Beat a medal ghost', targets: [1], daily: true, reward: () => ({ credits: 700, xp: 220 }) },
  { kind: 'under', desc: () => 'Beat the gold time on any track', targets: [1], daily: true, reward: () => ({ credits: 800, xp: 250 }) },
  { kind: 'platinum', desc: t => `Earn ${t} platinum medal${t > 1 ? 's' : ''}`, targets: [1, 2], daily: false, reward: t => ({ credits: 2500 * t, tokens: 8 * t, xp: 600 * t }) },
  { kind: 'distance', desc: t => `Drive ${t} km`, targets: [20, 50], daily: false, reward: t => ({ credits: 40 * t, xp: 25 * t }) },
  { kind: 'finish', desc: t => `Complete ${t} tracks`, targets: [25, 40], daily: false, reward: t => ({ credits: 120 * t, xp: 50 * t }) },
  { kind: 'gold', desc: t => `Earn ${t} gold medals`, targets: [8, 12], daily: false, reward: t => ({ credits: 350 * t, tokens: 4, xp: 120 * t }) },
  { kind: 'bench', desc: () => 'Beat a simulated benchmark', targets: [1], daily: false, reward: () => ({ credits: 3000, tokens: 25, xp: 1000 }) },
  { kind: 'champ', desc: () => 'Complete the weekly championship', targets: [1], daily: false, reward: () => ({ credits: 4000, tokens: 15, xp: 1200 }) },
  { kind: 'pb', desc: t => `Beat ${t} personal records`, targets: [6, 10], daily: false, reward: t => ({ credits: 300 * t, xp: 100 * t }) },
];
const ENVS = ['coastal', 'desert', 'alpine', 'neon', 'industrial', 'forest', 'sky', 'formula', 'hyper', 'academy', 'gauntlet'];
const ENV_LABEL: Record<string, string> = { coastal: 'coastal', desert: 'desert', alpine: 'alpine', neon: 'neon district', industrial: 'industrial', forest: 'forest', sky: 'sky', formula: 'formula', hyper: 'hyperdrive', academy: 'academy', gauntlet: 'gauntlet' };

export function rollChallenges(key: string, count: number, daily: boolean): Challenge[] {
  const rng = new Rng(hashStr('challenge/' + key + (daily ? 'd' : 'w')));
  const pool = CH_TEMPLATES.filter(t => t.daily === daily);
  const picked: Challenge[] = [];
  const used = new Set<string>();
  let guard = 0;
  while (picked.length < count && guard++ < 50) {
    const t = rng.pick(pool); const target = rng.pick(t.targets);
    const env = t.kind === 'env' ? rng.pick(ENVS) : undefined;
    const id = `${t.kind}:${target}:${env ?? ''}`;
    if (used.has(id)) continue; used.add(id);
    picked.push({ id: `${key}:${id}`, kind: t.kind, desc: t.desc(target, env ? ENV_LABEL[env] : undefined), target, progress: 0, reward: t.reward(target), done: false, claimed: false, env });
  }
  return picked;
}

// ------------------------------------------------------------------------------------------------ owned helpers
export function ownsCosmetic(p: Profile, id: string): boolean { return p.owned.includes(id) || !!COSMETIC_MAP[id]?.default; }
export function collectionCount(p: Profile): number { return p.owned.length; }

/** Sanitise a setup so it only references owned cosmetics (used when loading saves and importing presets). */
export function sanitiseSetup(p: Profile, s: CarSetup): CarSetup {
  const d = defaultSetup(s.vehicle);
  const pick = (id: string, fb: string) => (COSMETIC_MAP[id] && ownsCosmetic(p, id) ? id : fb);
  return {
    ...s,
    paint: { ...s.paint, finish: pick(s.paint.finish, d.paint.finish) },
    wheel: { design: pick(s.wheel.design, d.wheel.design), color: pick(s.wheel.color, d.wheel.color), tire: pick(s.wheel.tire, d.wheel.tire), caliper: pick(s.wheel.caliper, d.wheel.caliper) },
    body: Object.fromEntries(Object.entries(d.body).map(([k, fb]) => [k, pick((s.body as any)[k], fb)])) as CarSetup['body'],
    lights: Object.fromEntries(Object.entries(d.lights).map(([k, fb]) => [k, pick((s.lights as any)[k], fb)])) as CarSetup['lights'],
    livery: { ...s.livery, preset: pick(s.livery.preset, d.livery.preset) },
    fx: Object.fromEntries(Object.entries(d.fx).map(([k, fb]) => [k, pick((s.fx as any)[k], fb)])) as CarSetup['fx'],
    plate: { text: s.plate.text, style: pick(s.plate.style, d.plate.style) },
  };
}
export { COSMETICS_BY_CAT };
