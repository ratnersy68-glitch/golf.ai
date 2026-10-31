// Golf Coins wallet: an append-only, hash-chained ledger stored in the profile.
//  - coins and owned items are always *derived* from the ledger, never stored as editable totals
//  - every entry has a unique id (round:<id>, crown:<seed>:r2, ach:first_birdie, buy:<item>...),
//    so a reward can never be paid twice
//  - each entry carries a hash of the previous one; an edited/inserted entry breaks the chain and
//    everything from that point on is ignored
// This stops casual save editing only. Real anti-cheat needs the server (online mode, step 6).
const DIFF_NAME = { easy: 'Easy', normal: 'Normal', hard: 'Hard', realistic: 'Realistic' };

const SALT = 'gai-coins-v1';
function fnv(str) {
  let h1 = 0x811c9dc5, h2 = 0x1000193;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ (c + 31), 0x5bd1e995) >>> 0;
  }
  return h1.toString(36) + h2.toString(36);
}
const link = (prev, e) => fnv(`${SALT}|${prev}|${e.id}|${e.amt}|${e.t}`);

export function newWallet() { return { v: 1, ledger: [] }; }

// verify the chain; returns the trusted entries (drops anything after a broken link)
function verified(w) {
  const out = [];
  let prev = '';
  for (const e of Array.isArray(w?.ledger) ? w.ledger : []) {
    if (!e || typeof e.id !== 'string' || !Number.isFinite(e.amt) || e.h !== link(prev, e)) break;
    out.push(e); prev = e.h;
  }
  return out;
}

// rebuild derived state (p.coins, p.inventory, p.achievements) from the verified ledger
export function syncWallet(p) {
  if (!p.wallet) p.wallet = newWallet();
  const good = verified(p.wallet);
  if (good.length !== p.wallet.ledger.length) {
    console.warn(`wallet: ${p.wallet.ledger.length - good.length} invalid ledger entries ignored`);
    p.wallet.ledger = good;
  }
  let coins = 0;
  const inv = {}, ach = {};
  for (const e of good) {
    coins += e.amt;
    if (e.id.startsWith('buy:') || e.id.startsWith('grant:')) inv[e.id.slice(e.id.indexOf(':') + 1)] = e.t;
    if (e.id.startsWith('ach:')) ach[e.id.slice(4)] = e.t;
  }
  p.coins = Math.max(0, coins);
  p.inventory = inv;
  p.achievements = ach;
  return p;
}

export const hasEntry = (p, id) => p.wallet.ledger.some(e => e.id === id);

// append one entry; returns false if that id was already paid
export function post(p, id, amt, note = '') {
  if (!p.wallet) syncWallet(p);
  if (hasEntry(p, id)) return false;
  const led = p.wallet.ledger;
  const e = { id, amt: Math.round(amt), t: Date.now(), note };
  e.h = link(led.length ? led[led.length - 1].h : '', e);
  led.push(e);
  syncWallet(p);
  return true;
}

// ---------- purchases ----------
export function buy(p, item) {
  if (!item || !item.price) return { ok: true, free: true };
  syncWallet(p);
  if (p.inventory[item.id]) return { ok: false, reason: 'owned' };
  if (p.coins < item.price) return { ok: false, reason: 'coins', need: item.price - p.coins };
  post(p, `buy:${item.id}`, -item.price, item.name);
  return { ok: true };
}
// give an item for free (save migration / grandfathering)
export const grant = (p, id, note = 'grandfathered') => post(p, `grant:${id}`, 0, note);

// ---------- rewards ----------
export const ROUND_COINS = { 18: 150, 9: 60 };
export const SCORE_COINS = { birdie: 20, eagle: 75, ace: 300, albatross: 500, underPar: 15 };
export const DIFF_COIN_MUL = { easy: 0.8, normal: 1, hard: 1.25, realistic: 1.5 };
export const CROWN_PAYOUT = { win: 2500, top5: 1200, top10: 800, cut: 500, mc: 150 };
export const ACHIEVEMENTS = [
  { id: 'create_golfer', name: 'Tour Card', desc: 'Create your golfer', coins: 100 },
  { id: 'first_round', name: 'First Round', desc: 'Finish a 9 or 18-hole round', coins: 100 },
  { id: 'first_birdie', name: 'Birdie!', desc: 'Make your first birdie', coins: 100 },
  { id: 'first_eagle', name: 'Eagle Eye', desc: 'Make your first eagle', coins: 300 },
  { id: 'first_ace', name: 'Hole in One', desc: 'Make an ace', coins: 1000 },
  { id: 'break80', name: 'Break 80', desc: 'Shoot under 80 for 18 holes', coins: 200 },
  { id: 'break70', name: 'Break 70', desc: 'Shoot under 70 for 18 holes', coins: 500 },
  { id: 'under_par', name: 'Red Numbers', desc: 'Finish 18 holes under par', coins: 500 },
  { id: 'crown_cut', name: 'Weekend Pass', desc: 'Make the cut at the Granite Crown', coins: 300 },
  { id: 'crown_win', name: 'Granite Crown Champion', desc: 'Win the Granite Crown', coins: 1000 },
];
const ACH = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));

// coins for one completed round (lines are shown on the results screen)
export function roundCoins(st, diffKey, holes) {
  const mul = DIFF_COIN_MUL[diffKey] ?? 1;
  const lines = [];
  const base = holes >= 18 ? ROUND_COINS[18] : holes >= 9 ? ROUND_COINS[9] : 0;
  if (base) lines.push([`${holes} holes completed`, base]);
  const add = (label, n, each) => { if (n > 0) lines.push([`${label} ×${n}`, n * each]); };
  add('Birdies', st.birdies || 0, SCORE_COINS.birdie);
  add('Eagles', st.eagles || 0, SCORE_COINS.eagle);
  add('Holes in one', st.aces || 0, SCORE_COINS.ace);
  add('Albatross', st.albatross || 0, SCORE_COINS.albatross);
  if (st.toPar < 0) add('Strokes under par', -st.toPar, SCORE_COINS.underPar);
  const sub = lines.reduce((s, l) => s + l[1], 0);
  if (mul !== 1 && sub) lines.push([`${DIFF_NAME[diffKey] || diffKey} difficulty ×${mul}`, Math.round(sub * mul) - sub]);
  return { total: Math.round(sub * mul), lines };
}

function unlock(p, id, out) {
  const a = ACH[id];
  if (a && post(p, `ach:${id}`, a.coins, a.name)) out.push(a);
}

// achievements that a finished round can unlock
function roundAchievements(p, st, holes) {
  const got = [];
  if (holes >= 9) unlock(p, 'first_round', got);
  if (st.birdies) unlock(p, 'first_birdie', got);
  if (st.eagles || st.albatross) unlock(p, 'first_eagle', got);
  if (st.aces) unlock(p, 'first_ace', got);
  if (holes >= 18) {
    if (st.strokes < 80) unlock(p, 'break80', got);
    if (st.strokes < 70) unlock(p, 'break70', got);
    if (st.toPar < 0) unlock(p, 'under_par', got);
  }
  return got;
}

// pay out a normal round. roundId must be unique per round played (duplicate calls pay nothing).
export function payRound(p, roundId, st, diffKey, holes) {
  const r = roundCoins(st, diffKey, holes);
  const paid = r.total > 0 && post(p, `round:${roundId}`, r.total, `${holes}-hole round`);
  const achievements = roundAchievements(p, st, holes);
  return { coins: paid ? r.total : 0, lines: paid ? r.lines : [], achievements, balance: p.coins };
}

export function crownPayout(result) {
  if (!result) return null;
  if (result.pos === 'MC') return ['Missed cut', CROWN_PAYOUT.mc];
  if (result.won) return ['Champion', CROWN_PAYOUT.win];
  const n = parseInt(String(result.pos).replace(/\D/g, ''), 10) || 99;
  if (n <= 5) return ['Top 5 finish', CROWN_PAYOUT.top5];
  if (n <= 10) return ['Top 10 finish', CROWN_PAYOUT.top10];
  return ['Made cut', CROWN_PAYOUT.cut];
}

// pay a Granite Crown round (+ the final payout when the event ends)
export function payCrownRound(p, m, playedRound, st, diffKey, result) {
  const r = roundCoins(st, diffKey, st.holes);
  const lines = [], achievements = roundAchievements(p, st, st.holes);
  let coins = 0;
  if (r.total && post(p, `crown:${m.seed}:r${playedRound}`, r.total, `Granite Crown R${playedRound}`)) { coins += r.total; lines.push(...r.lines); }
  if (playedRound === 2 && m.cutMade) unlock(p, 'crown_cut', achievements);
  const pay = crownPayout(result);
  if (pay && post(p, `crown:${m.seed}:final`, pay[1], `Granite Crown: ${pay[0]}`)) { coins += pay[1]; lines.push([`Tournament: ${pay[0]}`, pay[1]]); }
  if (result?.won) unlock(p, 'crown_win', achievements);
  return { coins, lines, achievements, balance: p.coins };
}

export function payCreateGolfer(p) {
  const got = [];
  unlock(p, 'create_golfer', got);
  return got;
}

export const fmtCoins = (n) => Math.round(n).toLocaleString('en-US');
