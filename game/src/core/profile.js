// Save/load + progression (XP, levels, skills, unlocks, career stats).
import { DEFAULT_LOOK } from '../data/golfers.js';
import { DEFAULT_BAG, DEFAULT_EQUIPMENT } from '../data/clubs.js';

const KEY = 'golfai.profile.v1';

export const DIFFICULTIES = {
  easy: { name: 'Easy', window: 1.8, disp: 0.5, putt: 0.4, wind: 0.6, cupMul: 1.45, captureMul: 1.35, landing: 'wind', puttPreview: 1.0, xp: 0.7, gimme: 2 },
  normal: { name: 'Normal', window: 1.0, disp: 0.85, putt: 0.8, wind: 1.0, cupMul: 1.15, captureMul: 1.15, landing: 'nowind', puttPreview: 0.6, xp: 1.0, gimme: 0 },
  hard: { name: 'Hard', window: 0.72, disp: 1.1, putt: 1.1, wind: 1.15, cupMul: 1.0, captureMul: 1.0, landing: 'line', puttPreview: 0.3, xp: 1.3, gimme: 0 },
  realistic: { name: 'Realistic', window: 0.55, disp: 1.4, putt: 1.4, wind: 1.35, cupMul: 1.0, captureMul: 0.95, landing: 'none', puttPreview: 0, xp: 1.6, gimme: 0 },
};

export const LEVEL_XP = (lvl) => 500 + (lvl - 1) * 300; // xp needed to go from lvl -> lvl+1
export const MAX_LEVEL = 30;

export function newProfile() {
  return {
    version: 1,
    look: { ...DEFAULT_LOOK },
    level: 1, xp: 0, skillPoints: 0,
    skills: { driving: 50, approach: 50, shortGame: 50, putting: 50, recovery: 50 },
    bag: DEFAULT_BAG.slice(),
    equipment: { ...DEFAULT_EQUIPMENT },
    settings: {
      difficulty: 'normal', puttGuide: true, landingMarker: true, tracer: true, flyover: true,
      autoCamera: true, quality: 'high', master: 0.8, sfx: 0.9, amb: 0.6, windSetting: 'normal', pins: 'medium', lastCourse: 'augusta', lastTee: 'tour',
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
  };
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return newProfile();
    const p = JSON.parse(raw);
    const base = newProfile();
    // shallow merge for forward compatibility
    return {
      ...base, ...p,
      look: { ...base.look, ...p.look },
      skills: { ...base.skills, ...p.skills },
      equipment: { ...base.equipment, ...p.equipment },
      settings: { ...base.settings, ...p.settings },
      career: { ...base.career, ...p.career, best: { ...(p.career?.best || {}) } },
    };
  } catch (e) {
    console.warn('profile load failed', e);
    return newProfile();
  }
}

export function saveProfile(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { console.warn('save failed', e); }
}

export function resetProfile() {
  try { localStorage.removeItem(KEY); } catch (e) { /* noop */ }
  return newProfile();
}

// attributes for a custom golfer based on skills
export function customAttrs(p) {
  const s = p.skills;
  return { power: s.driving, driving: s.driving, approach: s.approach, shortGame: s.shortGame, putting: s.putting, recovery: s.recovery };
}

// Award XP after a round; returns summary with level-ups.
export function awardXp(p, stats, diffKey, holesPlayed) {
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
  // gradual automatic improvement from practice
  const s = p.skills;
  const bump = (k, v) => { s[k] = Math.min(99, Math.round((s[k] + v) * 10) / 10); };
  if (stats.fairwayChances) bump('driving', 0.4 * stats.fairways / stats.fairwayChances);
  if (stats.girChances) bump('approach', 0.5 * stats.gir / stats.girChances);
  if (stats.upDownChances) bump('shortGame', 0.6 * stats.upDowns / Math.max(1, stats.upDownChances));
  if (stats.puttHoles) bump('putting', Math.max(0, 0.6 * (2.1 - stats.putts / stats.puttHoles)));
  if (stats.sandChances || stats.recoveries) bump('recovery', 0.3);
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
