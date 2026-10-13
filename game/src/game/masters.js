// The Granite Crown: a fictional four-round, 72-hole major at Blackstone Ridge against a simulated field.
// (Internally still called "masters" in saves and code paths so existing saves keep working.)
// The field's hole-by-hole scores are generated (seeded) when the tournament starts and are
// revealed in step with the player's own progress, so the leaderboard moves as you play.
import { mulberry32 } from '../core/noise.js';
import { PROS } from '../data/golfers.js';

export const ROUND_DAYS = ['THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
// tournament branding lives here so the event can be renamed in one place
export const MAJOR = {
  name: 'The Granite Crown', short: 'GRANITE CROWN', courseId: 'blackstone',
  venue: 'BLACKSTONE RIDGE', trophy: "Champion's Blazer", champion: 'GRANITE CROWN CHAMPION',
};
export const CUT_LINE = 30; // low 30 and ties make the weekend (field of ~50)

// expected scoring average for a hole of each par at a championship setup
export const AVG_OVER = { 3: 0.14, 4: 0.22, 5: -0.22 };

// Field beyond the playable golfers: fictional players (name, country, skill 0..1)
const FIELD_EXTRA = [
  ['Tomas Lindqvist', 'SWE', 0.78], ['Hiro Takeda', 'JPN', 0.76], ['Marcus Bell', 'USA', 0.74], ['Liam Doherty', 'IRL', 0.72],
  ['Pierre Laurent', 'FRA', 0.7], ['Jack Whitcombe', 'ENG', 0.73], ['Sam Kowalski', 'USA', 0.72], ['Diego Alvarez', 'ARG', 0.7],
  ['Ethan Brooks', 'USA', 0.66], ['Riku Nakamura', 'JPN', 0.64], ['Connor Walsh', 'IRL', 0.65], ['Min-jun Seo', 'KOR', 0.66],
  ['Lars Henning', 'GER', 0.62], ['Owen Fletcher', 'WAL', 0.64], ['Mason Hayes', 'USA', 0.63], ['Ben Archer', 'AUS', 0.63],
  ['Andres Molina', 'COL', 0.6], ['Tyler Grant', 'USA', 0.6], ['Felix Wagner', 'AUT', 0.6], ['Henry Calloway', 'USA', 0.65],
  ['Jordan Pike', 'CAN', 0.63], ['Kai Nguyen', 'AUS', 0.62], ['Ross McAllister', 'SCO', 0.62], ['Wes Harmon', 'USA', 0.6],
  ['Nikolai Petrov', 'BUL', 0.61], ['Chase Morrow', 'USA', 0.62], ['Julian Okafor', 'NGR', 0.61], ['Brett Sinclair', 'NZL', 0.6],
  ['Matias Rojas', 'CHI', 0.64], ['Aiden Shaw', 'USA', 0.6], ['Stefan Kral', 'CZE', 0.59], ['Dong-hyun Lim', 'KOR', 0.58],
  ['Mikkel Dahl', 'DEN', 0.57], ['Grant Holloway', 'USA', 0.58], ['Walter Pryce', 'USA', 0.42], ['Rex Calder', 'USA', 0.45],
  ['Gordon Ames', 'USA', 0.45], ['Phil Navarro', 'USA', 0.47], ['Danny Wexford', 'ENG', 0.44], ['Pieter van Wyk', 'RSA', 0.46],
];

export function holeScore(rng, par, avg, skill, sunday) {
  const mu = avg - par - (skill - 0.5) * 0.44 + (sunday ? 0.03 : 0); // expected strokes over par
  const e = par === 5 ? 0.02 + 0.04 * skill : par === 4 ? 0.003 : 0.001;
  const b = par === 5 ? 0.36 + 0.14 * skill : 0.12 + 0.1 * skill;
  const d = Math.max(0.01, 0.045 - 0.03 * skill + Math.max(0, mu) * 0.05);
  const o = Math.min(0.6, Math.max(0.02, mu + 2 * e + b - 2 * d));
  const r = rng();
  if (r < e) return par - 2;
  if (r < e + b) return par - 1;
  if (r < e + b + o) return par + 1;
  if (r < e + b + o + d) return par + 2 + (rng() < 0.15 ? 1 : 0);
  return par;
}

export function newTournament(course, difficulty, playerName, proId = null) {
  const seed = (Date.now() & 0x7fffffff) >>> 0;
  const rng = mulberry32(seed);
  const pars = course.holes.map(h => h.p);
  const pros = PROS.filter(p => p.id !== proId).map(p => [p.name, p.country, Math.min(0.95, ((p.power + p.accuracy + p.shortGame + p.putting) / 4 - 60) / 38)]);
  const field = [...pros, ...FIELD_EXTRA].map(([name, country, skill]) => {
    const form = (rng() - 0.5) * 0.2; // this week's form
    const rounds = [0, 1, 2, 3].map(rd => {
      const dayForm = (rng() - 0.5) * 0.3;
      return pars.map((par, i) => holeScore(rng, par, par + (AVG_OVER[par] ?? 0.2), Math.max(0, Math.min(1, skill + form + dayForm)), rd === 3));
    });
    return { name, country, skill, rounds };
  });
  return { v: 1, seed, round: 1, difficulty, playerName, proId, pars, field, player: { rounds: [] }, cutMade: null, finished: false, result: null, started: Date.now() };
}

const toParOf = (scores, pars) => scores.reduce((a, s, i) => a + (s - pars[i]), 0);
export const fmtPar = (v) => (v === 0 ? 'E' : v > 0 ? `+${v}` : `${v}`);

// rows for the leaderboard. round: 1..4 being played (or finished); thru: holes completed in it;
// live: the player's scores so far in the current round (array of strokes)
export function leaderboard(m, round, thru, live = []) {
  const pars = m.pars;
  const rows = [];
  const cutApplied = m.cutMade !== null && round >= 3;
  for (const f of m.field) {
    let tot = 0, today = 0, missed = false;
    for (let r = 0; r < round; r++) {
      const n = r < round - 1 ? 18 : thru;
      const sc = f.rounds[r].slice(0, n);
      const tp = toParOf(sc, pars);
      tot += tp;
      if (r === round - 1) today = tp;
    }
    if (cutApplied && f.missedCut) missed = true;
    rows.push({ name: f.name, country: f.country, toPar: tot, today, thru: missed ? null : thru, missed, isPlayer: false,
      total: f.rounds.slice(0, round).reduce((a, sc, r) => a + sc.slice(0, r < round - 1 ? 18 : thru).reduce((x, y) => x + y, 0), 0) });
  }
  // player
  let ptot = 0, ptoday = 0;
  for (let r = 0; r < round; r++) {
    const sc = r < round - 1 ? (m.player.rounds[r] || []) : live;
    const tp = toParOf(sc, pars);
    ptot += tp;
    if (r === round - 1) ptoday = tp;
  }
  rows.push({ name: m.playerName || 'You', country: '', toPar: ptot, today: ptoday, thru: live.length, missed: cutApplied && !m.cutMade, isPlayer: true });
  // made-cut players first, then by score
  rows.sort((a, b) => (a.missed - b.missed) || (a.toPar - b.toPar) || (b.isPlayer - a.isPlayer));
  let pos = 0, last = null;
  rows.forEach((r, i) => {
    if (r.missed) { r.pos = 'MC'; return; }
    if (r.toPar !== last) { pos = i + 1; last = r.toPar; }
    r.posN = pos;
  });
  for (const r of rows) if (!r.missed) r.pos = (rows.filter(x => !x.missed && x.posN === r.posN).length > 1 ? 'T' : '') + r.posN;
  return rows;
}

// call after the player finishes a round (strokes per hole)
export function completeRound(m, strokes) {
  m.player.rounds[m.round - 1] = strokes.slice();
  if (m.round === 2) {
    const rows = leaderboard(m, 2, 18, strokes);
    const line = rows[Math.min(rows.length, CUT_LINE) - 1].toPar;
    for (const f of m.field) f.missedCut = rows.find(r => r.name === f.name && !r.isPlayer).toPar > line;
    const me = rows.find(r => r.isPlayer);
    m.cutMade = me.toPar <= line;
    m.cutLine = line;
    if (!m.cutMade) {
      m.finished = true;
      m.result = { pos: 'MC', toPar: me.toPar };
      return m.result;
    }
  }
  if (m.round === 4) {
    const rows = leaderboard(m, 4, 18, strokes);
    const me = rows.find(r => r.isPlayer);
    const leaders = rows.filter(r => !r.missed && r.toPar === rows[0].toPar);
    let won = me.toPar === rows[0].toPar;
    let playoff = null;
    if (won && leaders.length > 1) {
      // sudden-death playoff on 18 and 10 — a coin flip weighted by how you finished
      const rng = mulberry32(m.seed ^ 0x51ed);
      won = rng() < 1 / leaders.length + 0.1;
      playoff = { against: leaders.filter(r => !r.isPlayer).map(r => r.name), won };
    }
    const champion = won ? (m.playerName || 'You') : (playoff ? playoff.against[0] : rows.find(r => !r.isPlayer).name);
    m.finished = true;
    m.result = { pos: won ? '1' : me.pos, toPar: me.toPar, won, playoff, champion, winningScore: rows[0].toPar };
    return m.result;
  }
  m.round++;
  return null;
}

// HTML for the tournament scoreboard
export function boardHtml(rows, { limit = 12, highlight = true, title = 'LEADERS', cutLine = null } = {}) {
  const me = rows.find(r => r.isPlayer);
  let show = rows.filter(r => !r.missed).slice(0, limit);
  if (highlight && me && !show.includes(me)) show = [...show.slice(0, limit - 1), me];
  const num = (v) => `<b class="${v < 0 ? 'under' : v > 0 ? 'over' : 'even'}">${v === 0 ? 'E' : Math.abs(v)}</b>`;
  return `<div class="mboard">
    <div class="mb-head"><span>${title}</span></div>
    <div class="mb-cols"><span>POS</span><span>PLAYER</span><span>TO PAR</span><span>TODAY</span><span>THRU</span></div>
    ${show.map(r => `<div class="mb-row ${r.isPlayer ? 'me' : ''}"><span class="pos">${r.pos}</span><span class="nm">${esc(r.name)}${r.country ? ` <i>${r.country}</i>` : ''}</span><span>${num(r.toPar)}</span><span class="td">${fmtPar(r.today)}</span><span class="th">${r.thru == null ? '—' : r.thru === 18 ? 'F' : r.thru}</span></div>`).join('')}
    ${cutLine != null ? `<div class="mb-cut">PROJECTED CUT ${fmtPar(cutLine)}</div>` : ''}
  </div>`;
}

export function projectedCut(rows) {
  const live = rows.filter(r => !r.missed);
  return live[Math.min(live.length, CUT_LINE) - 1]?.toPar ?? 0;
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
