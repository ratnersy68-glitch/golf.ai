import { create } from 'zustand';
import { get as idbGet, set as idbSet, del as idbDel, keys as idbKeys } from 'idb-keyval';
import type { Profile, Settings, CarSetup, Challenge, SaveFile } from './types';
import {
  defaultProfile, defaultSettings, migrateSave, SAVE_VERSION, PRESETS, computeReward, RaceReward, levelFromXp, levelReward, dayId, weekId, rollChallenges,
  updateRanked, defaultSetup, MAX_LEVEL, sanitiseSetup, medalFor,
} from './progress';
import { COSMETIC_MAP, BUNDLES } from '../data/cosmetics';
import { VEHICLE_MAP } from '../data/vehicles';
import { ACHIEVEMENTS } from '../data/achievements';
import type { TrackMeta } from '../sim/campaign-types';
import { applyCosmetic } from './setup';

export type Screen = 'menu' | 'campaign' | 'garage' | 'shop' | 'profile' | 'settings' | 'ranked' | 'leaderboards' | 'editor' | 'modes' | 'achievements' | 'race' | 'replay' | 'challenges';
export type Mode = 'campaign' | 'timetrial' | 'ranked' | 'daily' | 'weekly' | 'endless' | 'freedrive' | 'stunt' | 'ghost' | 'custom';

export interface RaceSpec { mode: Mode; trackId: number; customId?: string; ghost?: string; seed?: number; practice?: boolean }
export interface Toast { id: number; kind: 'info' | 'reward' | 'achievement' | 'level' | 'error'; title: string; body?: string; rarity?: string }

export interface RaceResultInput {
  spec: RaceSpec; meta: TrackMeta; ms: number; crashes: number; respawns: number; topMps: number; distanceM: number; longestJump: number; airMs: number; driveMs: number;
  vehicle: string; standard: boolean; replay?: unknown;
}
export interface RaceOutcome { reward: RaceReward; levelUps: number[]; achievements: string[]; challengesDone: string[]; rankedDelta?: { before: number; after: number } }

interface State {
  ready: boolean;
  screen: Screen;
  prevScreen: Screen;
  race: RaceSpec | null;
  profile: Profile;
  settings: Settings;
  toasts: Toast[];
  lastOutcome: RaceOutcome | null;
  offlineNotice: boolean;

  init(): Promise<void>;
  go(s: Screen): void;
  startRace(spec: RaceSpec): void;
  patchProfile(fn: (p: Profile) => void): void;
  patchSettings(fn: (s: Settings) => void): void;
  applyPreset(p: Settings['preset']): void;
  toast(t: Omit<Toast, 'id'>): void;
  dismissToast(id: number): void;
  finishRace(r: RaceResultInput): RaceOutcome;
  noteRestart(): void;
  // economy
  canAfford(price: { credits?: number; tokens?: number }): boolean;
  buyCosmetic(id: string, discount?: number): boolean;
  buyVehicle(id: string): boolean;
  buyBundle(id: string): boolean;
  equip(cat: string, id: string): void;
  setSetup(fn: (s: CarSetup) => void): void;
  selectVehicle(id: string): void;
  toggleWishlist(id: string): void;
  toggleFavorite(id: number): void;
  claimChallenge(id: string): void;
  prestige(): boolean;
  exportSave(): Promise<string>;
  importSave(json: string): Promise<boolean>;
  resetAll(): Promise<void>;
}

let toastId = 1;
let saveTimer: any = 0;
const SAVE_KEY = 'apexline:save';

export const useStore = create<State>((set, get) => ({
  ready: false, screen: 'menu', prevScreen: 'menu', race: null, profile: defaultProfile(), settings: defaultSettings(), toasts: [], lastOutcome: null, offlineNotice: true,

  async init() {
    let raw: any = null;
    try { raw = await idbGet(SAVE_KEY); } catch { /* storage may be blocked */ }
    if (!raw) { try { const l = localStorage.getItem(SAVE_KEY); if (l) raw = JSON.parse(l); } catch { /* ignore */ } }
    const { profile, settings } = migrateSave(raw);
    rollIfNeeded(profile);
    set({ profile, settings, ready: true });
    get().patchProfile(() => { /* persist migrated + rolled data */ });
  },
  go(s) { set(st => ({ screen: s, prevScreen: st.screen })); },
  startRace(spec) { set(st => ({ race: spec, screen: 'race', prevScreen: st.screen, lastOutcome: null })); },
  patchProfile(fn) {
    const p = structuredClone(get().profile);
    fn(p); set({ profile: p }); scheduleSave();
  },
  patchSettings(fn) { const s = structuredClone(get().settings); fn(s); set({ settings: s }); scheduleSave(); },
  applyPreset(preset) { get().patchSettings(s => { Object.assign(s, PRESETS[preset]); s.preset = preset; }); },
  toast(t) {
    const id = toastId++;
    set(st => ({ toasts: [...st.toasts.slice(-4), { ...t, id }] }));
    setTimeout(() => get().dismissToast(id), t.kind === 'achievement' || t.kind === 'level' ? 5200 : 3600);
  },
  dismissToast(id) { set(st => ({ toasts: st.toasts.filter(x => x.id !== id) })); },
  noteRestart() { get().patchProfile(p => { p.stats.restarts++; }); },

  finishRace(r) {
    const st = get();
    const outcome: RaceOutcome = { reward: null as any, levelUps: [], achievements: [], challengesDone: [] };
    const practice = !!r.spec.practice;
    const ranked = r.spec.mode === 'ranked';
    const counted = r.standard || r.spec.mode === 'campaign' || r.spec.mode === 'timetrial';
    st.patchProfile(p => {
      rollIfNeeded(p);
      const prev = p.records[r.meta.id];
      const reward = computeReward(r.meta, r.ms, prev, ranked, practice);
      outcome.reward = reward;
      // records
      const rec = prev ?? { bestMs: r.ms, medal: 0, runs: 0, finishes: 0 };
      const today = dayId();
      rec.runsToday = (rec.runsDay === today ? (rec.runsToday ?? 0) : 0) + 1; rec.runsDay = today;
      rec.runs++; rec.finishes++; rec.lastMs = r.ms; rec.lastPlayed = Date.now();
      const isPb = !prev || r.ms < prev.bestMs;
      // Only standardised / campaign runs count toward records (cosmetics never matter; casual cars are class-separated)
      if (isPb) rec.bestMs = r.ms;
      rec.medal = Math.max(rec.medal, reward.medal);
      if (reward.newMedal && !practice) rec.firstPaid = reward.medal;
      if (reward.beatBench) rec.beatBench = true;
      p.records[r.meta.id] = rec;
      // stats
      const s = p.stats;
      s.races++; s.finishes++; s.driveMs += r.driveMs; s.distanceM += r.distanceM; s.topMps = Math.max(s.topMps, r.topMps);
      s.longestJump = Math.max(s.longestJump, r.longestJump); s.crashes += r.crashes; s.airMs += r.airMs;
      if (reward.pb && prev) { s.pbs++; if (prev.bestMs - r.ms < 10) s.milliWins++; }
      if (r.crashes === 0 && r.respawns === 0) s.cleanRuns++;
      if (reward.newMedal) { if (reward.medal >= 1) s.bronze++; if (reward.medal >= 2) s.silver++; if (reward.medal >= 3) s.gold++; if (reward.medal >= 4) s.platinum++; if (reward.medal >= 5) s.apex++; }
      if (reward.firstBench) s.benchmarks++;
      s.vehicleTime[r.vehicle] = (s.vehicleTime[r.vehicle] ?? 0) + r.driveMs;
      s.envTime[r.meta.env] = (s.envTime[r.meta.env] ?? 0) + r.driveMs;
      // payouts
      p.credits += reward.credits; p.tokens += reward.tokens; s.creditsEarned += reward.credits;
      p.xp += reward.xp;
      // ranked
      if (ranked && r.standard) {
        const before = p.ranked.rating;
        p.ranked = updateRanked(p.ranked, r.meta.id, r.ms, r.meta.bench.ms, r.meta.difficulty);
        const wk = `${weekId()}:${r.meta.id}`;
        p.ranked.weekRuns[wk] = Math.min(p.ranked.weekRuns[wk] ?? Infinity, r.ms);
        outcome.rankedDelta = { before, after: p.ranked.rating };
      }
      // ghost ladder
      if (r.spec.mode === 'ghost' && r.spec.ghost) {
        const g = r.spec.ghost; const target = g === 'bench' ? r.meta.bench.ms : (r.meta.medals as any)[g === 'platinum' ? 'platinum' : g];
        if (target && r.ms <= target) { p.stats.ghostWins++; const k = `ghost:${r.meta.id}:${g}`; if (!p.rewardsClaimed[k]) { p.rewardsClaimed[k] = true; p.credits += 400; p.xp += 150; p.stats.creditsEarned += 400; } }
      }
      // weekly championship score
      if (r.spec.mode === 'weekly') {
        p.weekly.champ[r.meta.id] = Math.min(p.weekly.champ[r.meta.id] ?? Infinity, r.ms);
      }
      // challenges
      const bump = (kind: string, n = 1, filter?: (c: Challenge) => boolean) => {
        for (const c of [...p.daily.list, ...p.weekly.list]) if (c.kind === kind && !c.done && (!filter || filter(c))) {
          c.progress = Math.min(c.target, c.progress + n); if (c.progress >= c.target) { c.done = true; outcome.challengesDone.push(c.desc); }
        }
      };
      bump('finish'); bump('env', 1, c => c.env === r.meta.env);
      if (reward.newMedal && reward.medal >= 3) bump('gold');
      if (reward.newMedal && reward.medal >= 4) bump('platinum');
      if (reward.pb && prev) bump('pb');
      if (r.crashes === 0 && r.respawns === 0) bump('clean');
      if (r.ms <= r.meta.medals.gold) bump('under');
      if (r.ms <= r.meta.medals.gold) bump('ghost');
      if (reward.firstBench) bump('bench');
      bump('distance', r.distanceM / 1000);
      if (r.spec.mode === 'weekly' && Object.keys(p.weekly.champ).length >= 5 && !p.weekly.champDone) { p.weekly.champDone = true; bump('champ'); p.stats.weeklyDone++; }
      applyLevels(p, outcome);
      checkAchievements(p, outcome);
    });
    set({ lastOutcome: outcome });
    for (const l of outcome.levelUps.slice(-1)) st.toast({ kind: 'level', title: `Level ${l}`, body: 'Level reward available' });
    for (const a of outcome.achievements) {
      const def = ACHIEVEMENTS.find(x => x.id === a)!;
      st.toast({ kind: 'achievement', title: def.name, body: def.desc, rarity: def.rarity });
    }
    return outcome;
  },

  canAfford(price) { const p = get().profile; return p.credits >= (price.credits ?? 0) && p.tokens >= (price.tokens ?? 0); },
  buyCosmetic(id, discount = 0) {
    const c = COSMETIC_MAP[id]; const st = get();
    const price = { credits: Math.round((c?.price.credits ?? 0) * (1 - discount)), tokens: Math.round((c?.price.tokens ?? 0) * (1 - discount)) };
    if (!c || st.profile.owned.includes(id) || c.shop === 'earned' || !st.canAfford(price)) return false;
    st.patchProfile(p => { p.credits -= price.credits; p.tokens -= price.tokens; p.owned.push(id); p.stats.purchases++; p.stats.creditsSpent += price.credits; p.wishlist = p.wishlist.filter(w => w !== id); checkAchievements(p, { achievements: [] } as any); });
    return true;
  },
  buyVehicle(id) {
    const v = VEHICLE_MAP[id]; const st = get(); const p = st.profile;
    if (!v || p.vehicles.includes(id) || p.level + (p.prestige ? 250 : 0) < v.unlockLevel || p.credits < v.price) return false;
    st.patchProfile(q => { q.credits -= v.price; q.vehicles.push(id); q.setups[id] = defaultSetup(id); q.stats.purchases++; q.stats.creditsSpent += v.price; });
    return true;
  },
  buyBundle(id) {
    const b = BUNDLES.find(x => x.id === id); const st = get(); if (!b) return false;
    const items = b.items.filter(i => !st.profile.owned.includes(i));
    const total = items.reduce((a, i) => a + (COSMETIC_MAP[i].price.credits ?? 0), 0);
    const tokens = items.reduce((a, i) => a + (COSMETIC_MAP[i].price.tokens ?? 0), 0);
    const cost = { credits: Math.round(total * (1 - b.discount)), tokens: Math.round(tokens * (1 - b.discount)) };
    if (!items.length || !st.canAfford(cost)) return false;
    st.patchProfile(p => { p.credits -= cost.credits; p.tokens -= cost.tokens; p.owned.push(...items); p.stats.purchases++; p.stats.creditsSpent += cost.credits; });
    return true;
  },
  equip(cat, id) {
    const c = COSMETIC_MAP[id]; if (!c || !get().profile.owned.includes(id)) return;
    if (!['title', 'avatar', 'banner', 'garage'].includes(c.cat)) get().patchProfile(p => { p.setups[p.selected] = applyCosmetic(p.setups[p.selected] ?? defaultSetup(p.selected), c); });
    if (c.cat === 'title') get().patchProfile(p => { p.title = id; });
    if (c.cat === 'avatar') get().patchProfile(p => { p.avatar = id; });
    if (c.cat === 'banner') get().patchProfile(p => { p.banner = id; });
    if (c.cat === 'garage') get().patchProfile(p => { p.rewardsClaimed['garage'] = true; (p as any).garageEnv = id; });
  },
  setSetup(fn) { get().patchProfile(p => { const s = p.setups[p.selected] ?? defaultSetup(p.selected); fn(s); p.setups[p.selected] = s; }); },
  selectVehicle(id) { get().patchProfile(p => { if (p.vehicles.includes(id)) p.selected = id; }); },
  toggleWishlist(id) { get().patchProfile(p => { p.wishlist = p.wishlist.includes(id) ? p.wishlist.filter(x => x !== id) : [...p.wishlist, id]; }); },
  toggleFavorite(id) { get().patchProfile(p => { p.favorites = p.favorites.includes(id) ? p.favorites.filter(x => x !== id) : [...p.favorites, id]; }); },
  claimChallenge(id) {
    get().patchProfile(p => {
      const c = [...p.daily.list, ...p.weekly.list].find(x => x.id === id);
      if (!c || !c.done || c.claimed) return;
      c.claimed = true; p.credits += c.reward.credits ?? 0; p.tokens += c.reward.tokens ?? 0; p.xp += c.reward.xp ?? 0; p.stats.creditsEarned += c.reward.credits ?? 0;
      if (p.daily.list.includes(c)) p.stats.dailyDone++;
      applyLevels(p, { levelUps: [] } as any); checkAchievements(p, { achievements: [] } as any);
    });
  },
  prestige() {
    const p = get().profile;
    if (p.level < MAX_LEVEL || p.prestige >= 8) return false;
    get().patchProfile(q => { q.prestige++; q.level = 1; q.xp = 0; q.claimedLevels = []; q.credits += 25000 * q.prestige; q.tokens += 50 * q.prestige; });
    return true;
  },
  async exportSave() {
    const st = get();
    const replays: Record<string, unknown> = {};
    try { for (const k of await idbKeys()) if (String(k).startsWith('replay:')) replays[String(k)] = await idbGet(k as any); } catch { /* ignore */ }
    const file: SaveFile & { replays: Record<string, unknown> } = { version: SAVE_VERSION, profile: st.profile, settings: st.settings, savedAt: Date.now(), replays };
    return JSON.stringify(file);
  },
  async importSave(json) {
    try {
      const raw = JSON.parse(json);
      if (typeof raw !== 'object' || !raw.profile) throw new Error('not a save');
      const { profile, settings } = migrateSave(raw);
      for (const id of Object.keys(profile.setups)) profile.setups[id] = sanitiseSetup(profile, profile.setups[id]);
      if (raw.replays) for (const [k, v] of Object.entries(raw.replays)) await idbSet(k, v);
      set({ profile, settings }); scheduleSave(); return true;
    } catch { return false; }
  },
  async resetAll() { try { await idbDel(SAVE_KEY); } catch { /* ignore */ } set({ profile: defaultProfile(), settings: defaultSettings() }); scheduleSave(); },
}));

function rollIfNeeded(p: Profile) {
  const d = dayId(), w = weekId();
  if (p.daily.day !== d) {
    const wasYesterday = p.daily.day && (Date.parse(d) - Date.parse(p.daily.day)) <= 86400000 * 1.5;
    p.daily = { day: d, list: rollChallenges(d, 3, true), streak: wasYesterday ? p.daily.streak + 1 : 1 };
  }
  if (p.weekly.week !== w) p.weekly = { week: w, list: rollChallenges(w, 3, false), champ: {}, champDone: false };
}

function applyLevels(p: Profile, o: Partial<RaceOutcome>) {
  const { level } = levelFromXp(p.xp);
  while (p.level < level) {
    p.level++;
    if (!p.claimedLevels.includes(p.level)) {
      const r = levelReward(p.level); p.credits += r.credits; p.tokens += r.tokens; p.stats.creditsEarned += r.credits;
      if (r.item && !p.owned.includes(r.item)) p.owned.push(r.item);
      p.claimedLevels.push(p.level);
    }
    o.levelUps?.push(p.level);
  }
}

function checkAchievements(p: Profile, o: Partial<RaceOutcome>) {
  for (const a of ACHIEVEMENTS) {
    const v = a.value(p);
    p.achProgress[a.id] = Math.min(a.target, v);
    if (!p.ach[a.id] && v >= a.target) {
      p.ach[a.id] = { at: Date.now(), seen: false }; p.credits += a.credits; p.tokens += a.tokens ?? 0; p.stats.creditsEarned += a.credits;
      o.achievements?.push(a.id);
    }
  }
  // chapter/title unlock items (earned cosmetics)
  const grant = (id: string, ok: boolean) => { if (ok && COSMETIC_MAP[id] && !p.owned.includes(id)) p.owned.push(id); };
  const done = (c: number) => Array.from({ length: 25 }, (_, i) => (c - 1) * 25 + i + 1).filter(id => p.records[id]?.finishes).length >= 25;
  grant('title_e_rookie_of_the_year', done(1)); grant('title_e_coastal_cruiser', done(2)); grant('title_e_desert_fox', done(3)); grant('title_e_frostbitten', done(4));
  grant('title_e_city_ghost', done(5)); grant('title_e_steel_nerve', done(6)); grant('title_e_woodsman', done(7)); grant('title_e_cloud_walker', done(8));
  grant('title_e_precision_machine', done(9)); grant('title_e_redline_royalty', done(10)); grant('title_e_gauntlet_survivor', done(11));
  grant('spoiler_e_ch11', done(11)); grant('victory_e_ch11', done(11)); grant('paint_e_ch5', done(5)); grant('paint_e_ch8', done(8)); grant('wheel_e_ch9', done(9)); grant('wheelColor_e_ch10', done(10)); grant('underglow_e_ch6', done(6));
  grant('title_e_benchmark_breaker', p.stats.benchmarks > 0); grant('livery_e_benchmark', p.stats.benchmarks > 0);
  grant('livery_e_gold_medal', p.stats.gold >= 25); grant('livery_e_platinum', p.stats.platinum >= 10); grant('livery_e_apex', p.stats.apex >= 1);
  grant('title_e_the_apex', p.stats.apex >= 50); grant('title_e_level_100', p.level >= 100 || p.prestige > 0); grant('title_e_collector', p.owned.length >= 100);
  grant('title_e_ranked_contender', p.ranked.placements >= 5); grant('title_e_track_architect', p.customTracks.some(t => t.verified));
  grant('title_e_millisecond_master', p.stats.milliWins > 0); grant('trail_e_prestige', p.prestige >= 2); grant('spawn_e_champion', p.prestige >= 6);
  grant('smoke_e_daily30', p.stats.dailyDone >= 30); grant('flame_e_weekly', p.stats.weeklyDone >= 5); grant('title_e_prestige_apex', p.prestige >= 8);
  grant('finishfx_e_wr', p.stats.wr > 0); grant('avatar_e_wr', p.stats.wr > 0);
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const st = useStore.getState();
    const file: SaveFile = { version: SAVE_VERSION, profile: st.profile, settings: st.settings, savedAt: Date.now() };
    try { await idbSet(SAVE_KEY, file); } catch { try { localStorage.setItem(SAVE_KEY, JSON.stringify(file)); } catch { /* storage unavailable */ } }
  }, 400);
}

export async function saveReplay(key: string, data: unknown) { try { await idbSet('replay:' + key, data); } catch { /* ignore */ } }
export async function loadReplay<T>(key: string): Promise<T | undefined> { try { return await idbGet('replay:' + key); } catch { return undefined; } }
export { medalFor };
