// The Masters: a four-round, 72-hole tournament at Augusta National against a simulated field.
// The field's hole-by-hole scores are generated (seeded) when the tournament starts and are
// revealed in step with the player's own progress, so the leaderboard moves as you play.
import { mulberry32 } from '../core/noise.js';
import { PROS } from '../data/golfers.js';

export const ROUND_DAYS = ['THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
export const CUT_LINE = 30; // low 30 and ties make the weekend (field of ~50)

// Scoring average of each hole at Augusta (approximate long-term tournament averages)
const HOLE_AVG = [4.23, 4.78, 4.08, 3.27, 4.26, 3.14, 4.15, 4.82, 4.10, 4.30, 4.30, 3.29, 4.75, 4.18, 4.78, 3.13, 4.15, 4.23];

// Field beyond the playable pros: name, country, skill 0..1
const FIELD_EXTRA = [
  ['Hideki Matsuyama', 'JPN', 0.78], ['Patrick Cantlay', 'USA', 0.76], ['Tommy Fleetwood', 'ENG', 0.74], ['Shane Lowry', 'IRL', 0.7],
  ['Tyrrell Hatton', 'ENG', 0.7], ['Brooks Koepka', 'USA', 0.75], ['Cameron Smith', 'AUS', 0.72], ['Will Zalatoris', 'USA', 0.68],
  ['Max Homa', 'USA', 0.62], ['Sahith Theegala', 'USA', 0.62], ['Wyndham Clark', 'USA', 0.64], ['Sungjae Im', 'KOR', 0.66],
  ['Tom Kim', 'KOR', 0.62], ['Matt Fitzpatrick', 'ENG', 0.66], ['Justin Rose', 'ENG', 0.64], ['Adam Scott', 'AUS', 0.63],
  ['Sergio Garcia', 'ESP', 0.58], ['Dustin Johnson', 'USA', 0.6], ['Patrick Reed', 'USA', 0.6], ['Russell Henley', 'USA', 0.66],
  ['Corey Conners', 'CAN', 0.64], ['Min Woo Lee', 'AUS', 0.62], ['Robert MacIntyre', 'SCO', 0.62], ['Keegan Bradley', 'USA', 0.6],
  ['Sam Burns', 'USA', 0.63], ['Tony Finau', 'USA', 0.63], ['Jason Day', 'AUS', 0.62], ['Cameron Young', 'USA', 0.62],
  ['Joaquin Niemann', 'CHI', 0.66], ['Akshay Bhatia', 'USA', 0.6], ['Sepp Straka', 'AUT', 0.6], ['Byeong Hun An', 'KOR', 0.58],
  ['Nicolai Højgaard', 'DEN', 0.57], ['Harris English', 'USA', 0.58], ['Fred Couples', 'USA', 0.4], ['Bubba Watson', 'USA', 0.45],
  ['Zach Johnson', 'USA', 0.45], ['Phil Mickelson', 'USA', 0.48], ['Danny Willett', 'ENG', 0.44], ['Charl Schwartzel', 'RSA', 0.46],
];

function holeScore(rng, par, avg, skill, sunday) {
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
      return pars.map((par, i) => holeScore(rng, par, HOLE_AVG[i] ?? par, Math.max(0, Math.min(1, skill + form + dayForm)), rd === 3));
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

// HTML for an Augusta-style scoreboard
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
