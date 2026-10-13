// Save/load + progression (XP, levels, skills, unlocks, career stats).
import { DEFAULT_LOOK, normalizeLook } from '../data/look.js';
import { DEFAULT_BAG, DEFAULT_EQUIPMENT } from '../data/clubs.js';
import { ITEM, owns, outfitItemIds } from '../data/shop.js';
import { newWallet, syncWallet, grant } from './wallet.js';
import { COURSES } from '../data/courses.js';
import { ATTRS, ATTR_START, ATTR_POOL, ATTR_MAX, golferAttrs } from '../data/golfers.js';

const KEY = 'golfai.profile.v1';

export const DIFFICULTIES = {
  easy: { name: 'Easy', window: 1.8, disp: 0.5, putt: 0.4, wind: 0.6, cupMul: 1.45, captureMul: 1.35, landing: 'wind', puttPreview: 1.0, xp: 0.7, gimme: 2 },
  normal: { name: 'Normal', window: 1.0, disp: 0.85, putt: 0.8, wind: 1.0, cupMul: 1.15, captureMul: 1.15, landing: 'nowind', puttPreview: 1.0, xp: 1.0, gimme: 0 },
  hard: { name: 'Hard', window: 0.72, disp: 1.1, putt: 1.1, wind: 1.15, cupMul: 1.0, captureMul: 1.0, landing: 'line', puttPreview: 0.55, xp: 1.3, gimme: 0 },
  realistic: { name: 'Realistic', window: 0.55, disp: 1.4, putt: 1.4, wind: 1.35, cupMul: 1.0, captureMul: 0.95, landing: 'none', puttPreview: 0.3, xp: 1.6, gimme: 0 },
};

// v2: original (fictional) courses, golfers, brands and tournament.
// v3: Pro Shop — Golf Coins wallet + owned inventory.
// v4: Road to Pro career (profile.rtp). Older saves are migrated, never wiped.
export const PROFILE_VERSION = 4;

export const LEVEL_XP = (lvl) => 500 + (lvl - 1) * 300; // xp needed to go from lvl -> lvl+1
export const MAX_LEVEL = 30;

export function newProfile() {
  return syncWallet({
    version: PROFILE_VERSION,
    look: normalizeLook(DEFAULT_LOOK),
    outfits: [], // saved outfits: { id, name, outfit }
    closet: [], // favourited items: { cat, cfg }
    golfer: null, // the player's created golfer (see newGolfer); null until created
    masters: null, // tournament in progress (see game/masters.js)
    rtp: null, // Road to Pro career (see game/career.js)
    mastersWins: 0, mastersHistory: [],
    level: 1, xp: 0, skillPoints: 0,
    skills: { driving: 50, approach: 50, shortGame: 50, putting: 50, recovery: 50 },
    bag: DEFAULT_BAG.slice(),
    equipment: { ...DEFAULT_EQUIPMENT },
    wallet: newWallet(), // Golf Coins ledger (coins/inventory/achievements are derived from it, see core/wallet.js)
    settings: {
      difficulty: 'normal', puttGuide: true, landingMarker: true, tracer: true, flyover: true,
      autoCamera: true, quality: 'auto', master: 0.8, sfx: 0.9, amb: 0.6, windSetting: 'normal', pins: 'medium', lastCourse: COURSES[0].id, lastTee: 'tour',
    },
    career: {
      rounds: 0, rounds18: 0, holes: 0, strokes: 0, parSum: 0, score18Sum: 0,
      fairways: 0, fairwayChances: 0, gir: 0, girChances: 0, putts: 0, puttHoles: 0,
      drives: 0, driveSum: 0, longestDrive: 0, longestPutt: 0,
      aces: 0, albatross: 0, eagles: 0, birdies: 0, pars: 0, bogeys: 0, doubles: 0, worse: 0,
      sandSaves: 0, sandChances: 0, upDowns: 0, upDownChances: 0, penalties: 0,
      best: {},
    },
    history: [],
  });
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return newProfile();
    const p = migrate(JSON.parse(raw));
    const base = newProfile();
    // shallow merge for forward compatibility
    const out = {
      ...base, ...p,
      look: normalizeLook(p.look || base.look),
      golfer: p.golfer ? { ...p.golfer, look: normalizeLook(p.golfer.look), attrs: { ...newGolfer().attrs, ...p.golfer.attrs } } : null,
      outfits: Array.isArray(p.outfits) ? p.outfits : [],
      closet: Array.isArray(p.closet) ? p.closet : [],
      skills: { ...base.skills, ...p.skills },
      equipment: { ...base.equipment, ...p.equipment },
      settings: { ...base.settings, ...p.settings },
      career: { ...base.career, ...p.career, best: { ...(p.career?.best || {}) } },
      wallet: p.wallet && Array.isArray(p.wallet.ledger) ? p.wallet : newWallet(),
    };
    syncWallet(out);
    // never equip something the ledger says you don't own
    for (const slot of Object.keys(DEFAULT_EQUIPMENT)) {
      if (!ITEM[out.equipment[slot]] || ITEM[out.equipment[slot]].slot !== slot || !owns(out, out.equipment[slot])) out.equipment[slot] = DEFAULT_EQUIPMENT[slot];
    }
    return out;
  } catch (e) {
    console.warn('profile load failed', e);
    return newProfile();
  }
}

// Bring an older save up to date. Anything that no longer applies is moved to p.legacy, not deleted.
function migrate(p) {
  if (!p || typeof p !== 'object') return p;
  if ((p.version || 1) < 2) {
    p.legacy = { ...(p.legacy || {}), fromVersion: p.version || 1, migrated: Date.now() };
    // tournament records from the old real-course event
    if (p.masters || p.mastersWins || (p.mastersHistory || []).length) {
      p.legacy.tournament = { inProgress: p.masters || null, wins: p.mastersWins || 0, history: p.mastersHistory || [] };
    }
    p.masters = null; p.mastersWins = 0; p.mastersHistory = [];
    // equipment from real brands -> the fictional equivalents (old picks kept in legacy)
    const eq = p.equipment || {};
    const valid = (cat, id) => ITEM[id]?.slot === cat || (cat === 'wood' && id === 'vx-x9') || (cat === 'wedge' && id === 'al-spin');
    const old = {};
    for (const cat of Object.keys(eq)) if (eq[cat] && !valid(cat, eq[cat])) { old[cat] = eq[cat]; eq[cat] = DEFAULT_EQUIPMENT[cat]; }
    if (Object.keys(old).length) p.legacy.equipment = old;
    p.equipment = eq;
    if (p.settings && !COURSES.some(c => c.id === p.settings.lastCourse)) p.settings.lastCourse = COURSES[0].id;
    p.version = 2;
  }
  if (p.version < 3) {
    // the shop arrives: anything already equipped or worn is kept for free
    const eq = { ...DEFAULT_EQUIPMENT, ...(p.equipment || {}) };
    if (eq.wood === 'vx-x9') { eq.driver = 'vx-x9'; eq.wood = DEFAULT_EQUIPMENT.wood; } // v2 X9 woods -> X9 driver
    if (eq.wedge === 'al-spin') eq.wedge = 'al-spin60';
    for (const slot of Object.keys(eq)) if (ITEM[eq[slot]]?.slot !== slot) eq[slot] = DEFAULT_EQUIPMENT[slot];
    p.equipment = eq;
    p.wallet = newWallet();
    const keep = new Set(Object.values(eq).filter(id => ITEM[id]?.price));
    for (const o of [p.look?.outfit, p.golfer?.look?.outfit, ...(p.outfits || []).map(x => x.outfit)]) outfitItemIds(o).forEach(id => keep.add(id));
    for (const id of keep) grant(p, id);
    p.version = 3;
  }
  if (p.version < 4) {
    p.rtp = null; // Road to Pro starts fresh; nothing older to carry over
    p.version = 4;
  }
  return p;
}

export function saveProfile(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { console.warn('save failed', e); }
}

export function resetProfile() {
  try { localStorage.removeItem(KEY); } catch (e) { /* noop */ }
  return newProfile();
}

// a freshly created golfer: every attribute at ATTR_START with ATTR_POOL points still to place
export function newGolfer(name = 'My Golfer', look = {}) {
  return {
    v: 1, created: Date.now(), name, hand: 'R',
    look: normalizeLook({ ...look, v: 2 }),
    attrs: Object.fromEntries(ATTRS.map(([k]) => [k, ATTR_START])),
    pool: ATTR_POOL, // creation points not yet placed (level-up points live in p.skillPoints)
  };
}

// attributes for playing as your own golfer
export function customAttrs(p) {
  if (p.golfer) return golferAttrs(p.golfer);
  const s = p.skills;
  return { power: s.driving, driving: s.driving, approach: s.approach, shortGame: s.shortGame, putting: s.putting, recovery: s.recovery };
}

// Award XP after a round; returns summary with level-ups.
export function awardXp(p, stats, diffKey, holesPlayed, asGolfer = false) {
  const d = DIFFICULTIES[diffKey] || DIFFICULTIES.normal;
  let xp = holesPlayed * 18
    + stats.pars * 10 + stats.birdies * 45 + stats.eagles * 140 + stats.aces * 600 + (stats.albatross || 0) * 800
    + stats.fairways * 6 + stats.gir * 9 + stats.sandSaves * 20 + stats.upDowns * 15;
  const toPar = stats.toPar;
  if (holesPlayed >= 9) xp += Math.max(0, (holesPlayed / 18) * 200 - Math.max(0, toPar) * 8);
  xp = Math.round(xp * d.xp);
  const before = p.level;
  p.xp += xp;
  const unlocksGained = [];
  while (p.level < MAX_LEVEL && p.xp >= LEVEL_XP(p.level)) {
    p.xp -= LEVEL_XP(p.level);
    p.level++;
    p.skillPoints += 3;
    unlocksGained.push(p.level);
  }
  // gradual improvement from play: rounds played as your own golfer sharpen the matching attributes
  if (asGolfer && p.golfer) {
    const a = p.golfer.attrs;
    const bump = (k, v) => { a[k] = Math.min(ATTR_MAX, Math.round((a[k] + v) * 10) / 10); };
    if (stats.fairwayChances) bump('accuracy', 0.4 * stats.fairways / stats.fairwayChances);
    if (stats.girChances) bump('irons', 0.5 * stats.gir / stats.girChances);
    if (stats.upDownChances) bump('chipping', 0.6 * stats.upDowns / Math.max(1, stats.upDownChances));
    if (stats.puttHoles) bump('putting', Math.max(0, 0.6 * (2.1 - stats.putts / stats.puttHoles)));
    if (stats.sandChances) bump('recovery', 0.3);
    if (holesPlayed >= 18 && stats.toPar <= 0) bump('mental', 0.5);
  }
  return { xp, levelUps: unlocksGained, from: before, to: p.level };
}

export function recordRound(p, round) {
  const c = p.career;
  const st = round.stats;
  c.rounds++;
  c.holes += st.holes;
  c.strokes += st.strokes; c.parSum += st.par;
  if (st.holes === 18) { c.rounds18++; c.score18Sum += st.strokes; }
  for (const k of ['fairways', 'fairwayChances', 'gir', 'girChances', 'putts', 'aces', 'eagles', 'birdies', 'pars', 'bogeys', 'doubles', 'worse', 'sandSaves', 'sandChances', 'upDowns', 'upDownChances', 'penalties', 'albatross']) c[k] += st[k] || 0;
  c.puttHoles += st.puttHoles || st.holes;
  c.drives += st.drives; c.driveSum += st.driveSum;
  c.longestDrive = Math.max(c.longestDrive, st.longestDrive);
  c.longestPutt = Math.max(c.longestPutt, st.longestPutt);
  const key = `${round.courseId}:${st.holes}`;
  const best = c.best[key];
  if (!best || st.toPar < best.toPar) c.best[key] = { score: st.strokes, toPar: st.toPar, date: Date.now(), golfer: round.golferName, tee: round.tee };
  p.history.unshift({ course: round.courseId, holes: st.holes, score: st.strokes, toPar: st.toPar, date: Date.now(), golfer: round.golferName, diff: round.difficulty });
  p.history = p.history.slice(0, 30);
}
