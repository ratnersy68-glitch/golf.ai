// Road to Pro: high school -> recruiting -> college -> Q-School -> development tour -> elite tour & majors.
// Pure game logic (no DOM), stored in profile.rtp. Every event's field is simulated hole by hole from a seed;
// the player plays each round for real or (non-critical events only) simulates it from their golfer's rating.
import { mulberry32 } from '../core/noise.js';
import { getCourse } from '../data/courses.js';
import { PROS, golferOverall, ATTR_MAX } from '../data/golfers.js';
import { HIGH_SCHOOLS, UNIVERSITIES, TOURS, MAJORS, SPONSORS, randomName } from '../data/schools.js';
import { holeScore, AVG_OVER } from './masters.js';
import { post } from '../core/wallet.js';

export const HS_YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
export const MAJOR_CUT = 30;

// event formats. skill: field skill range (masters.js scale: ~0 = high-school standout, 0.9 = world-class)
export const KIND = {
  tryout: { label: 'Team Tryout', holes: 9, rounds: 1, field: 10, skill: [-0.75, 0.05], tee: 'member', tier: 0, critical: true, group: 'hs' },
  jv: { label: 'JV Match', holes: 9, rounds: 1, field: 10, skill: [-0.9, -0.2], tee: 'member', tier: 0.5, group: 'hs' },
  dual: { label: 'Dual Match', holes: 9, rounds: 1, field: 10, skill: [-0.6, 0.1], tee: 'member', tier: 1, group: 'hs' },
  hsinv: { label: 'Invitational', holes: 18, rounds: 1, field: 30, skill: [-0.6, 0.15], tee: 'member', tier: 2, group: 'hs' },
  hsreg: { label: 'Regionals', holes: 18, rounds: 1, field: 40, skill: [-0.45, 0.2], tee: 'member', tier: 3, qualify: 10, group: 'hs' },
  state: { label: 'State Finals', holes: 18, rounds: 1, field: 40, skill: [-0.3, 0.3], tee: 'member', tier: 5, critical: true, group: 'hs' },
  col: { label: 'College Invitational', holes: 18, rounds: 1, field: 45, skill: [-0.1, 0.42], tee: 'tour', tier: 3, group: 'college' },
  conf: { label: 'Conference Championship', holes: 18, rounds: 1, field: 40, skill: [-0.05, 0.48], tee: 'tour', tier: 4, group: 'college' },
  creg: { label: 'NCGA Regional', holes: 18, rounds: 1, field: 45, skill: [0.02, 0.52], tee: 'tour', tier: 4, qualify: 10, group: 'college' },
  nat: { label: 'National Championship', holes: 18, rounds: 2, field: 60, skill: [0.12, 0.6], tee: 'tour', tier: 7, critical: true, group: 'college' },
  q: { label: 'Q-School', holes: 18, rounds: 2, field: 80, skill: [0.18, 0.66], tee: 'tour', tier: 2, critical: true, group: 'q' },
  dev: { label: 'Ridgeline Tour event', holes: 18, rounds: 2, field: 60, skill: [0.28, 0.66], tee: 'tour', tier: 3, group: 'dev' },
  elite: { label: 'Crown Tour event', holes: 18, rounds: 2, field: 70, skill: [0.48, 0.9], tee: 'tour', tier: 6, group: 'elite' },
  major: { label: 'Major championship', holes: 18, rounds: 4, field: 60, skill: [0.55, 0.95], tee: 'champ', tier: 12, critical: true, group: 'major', pros: true },
};
// coins: [win, top 3, top 10, everyone else]
const PURSE = { hs: [300, 150, 80, 40], college: [500, 250, 120, 60], q: [800, 400, 200, 80], dev: [1500, 600, 300, 120], elite: [3000, 1200, 600, 250], major: [6000, 2400, 1200, 500] };

const COURSE_IDS = ['cedarvale', 'harborpoint', 'blackstone'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const skillFromOvr = (ovr) => (ovr - 62) / 36;
export const school = (c) => HIGH_SCHOOLS.find(s => s.id === c.school);
export const uni = (c) => UNIVERSITIES.find(u => u.id === c.uni);
export const fmtPar = (v) => (v === 0 ? 'E' : v > 0 ? `+${v}` : `${v}`);
export const posLabel = (r) => (r.cut ? 'MC' : r.dnq ? 'DNQ' : `${r.tied ? 'T' : ''}${r.pos}`);

// ---------- career + seasons ----------
export function newCareer(p, schoolId) {
  const seed = (Date.now() & 0x7fffffff) >>> 0;
  const rng = mulberry32(seed);
  const c = {
    v: 1, id: seed.toString(36), seed, created: Date.now(), golferName: p.golfer?.name || 'You',
    stage: 'hs', year: 1, school: schoolId, uni: null, tour: null, squad: 'varsity',
    teammates: Array.from({ length: 8 }, () => randomName(rng)), uniTeam: null,
    season: null, history: [], pts: 0, seasonPts: 0,
    stats: { events: 0, rounds: 0, simRounds: 0, holes: 0, toPar: 0, wins: 0, top10: 0, majorWins: 0, coins: 0 },
    hsScores: [], interest: {}, offers: null, trophies: [], sponsors: [], pending: null, seasons: 0,
  };
  c.season = buildSeason(c);
  return c;
}

export function seasonLabel(c) {
  if (c.stage === 'hs') return `${HS_YEARS[c.year - 1]} season`;
  if (c.stage === 'college') return `${HS_YEARS[c.year - 1]} season`;
  return `Season ${c.year}`;
}
export function teamName(c) {
  if (c.stage === 'hs') { const s = school(c); return `${s.short} ${s.mascot}`; }
  if (c.stage === 'college') { const u = uni(c); return `${u.short} ${u.mascot}`; }
  return TOURS[c.tour].name;
}

function ev(c, i, kind, name, courseId, extra = {}) {
  const K = KIND[kind];
  return { id: `s${c.seasons}e${i}`, kind, name, courseId, holes: K.holes, rounds: K.rounds, tee: K.tee, critical: !!K.critical, status: 'upcoming', seed: (c.seed + c.seasons * 977 + i * 131) >>> 0, player: { rounds: [] }, field: null, result: null, ...extra };
}

function buildSeason(c) {
  const rng = mulberry32(c.seed ^ (c.seasons * 7919 + 13));
  const pick = (a) => a[Math.floor(rng() * a.length)];
  const course = (i) => COURSE_IDS[(i + c.seasons) % COURSE_IDS.length];
  const events = [];
  const add = (kind, name, courseId, extra) => events.push(ev(c, events.length, kind, name, courseId, extra));
  if (c.stage === 'hs') {
    const s = school(c);
    const rivals = HIGH_SCHOOLS.filter(x => x.id !== s.id);
    const invNames = ['Fall Classic', 'Junior Invitational', 'County Championship', 'Tri-State Junior', 'Spring Shootout', 'Prep Masters Cup', 'Lakeside Invitational'];
    const reg = c.squad === 'jv' && c.year === 1;
    if (c.year === 1) add('tryout', `${s.short} Team Tryout`, s.home);
    for (let i = 0; events.length < 6; i++) {
      if (reg) { add('jv', `JV Match vs ${rivals[i % 4].short}`, course(i), { rival: rivals[i % 4].id }); continue; }
      if (i % 2 === 0) add('dual', `Dual Match vs ${rivals[(i / 2 + c.year) % 4 | 0].short}`, i === 0 ? s.home : course(i), { rival: rivals[(i / 2 + c.year) % 4 | 0].id });
      else add('hsinv', `${pick(invNames)}`, course(i));
    }
    add('hsreg', 'Regional Championship', course(1));
    add('state', 'State Finals', 'blackstone');
  } else if (c.stage === 'college') {
    const u = uni(c);
    const inv = ['Collegiate Classic', 'Fall Preview', 'Desert Duel', 'Intercollegiate', 'Spring Invitational', 'Coastal Collegiate', 'Ridge Classic'];
    add('col', `${u.short} Invitational`, u.home);
    for (let i = 1; i < 5; i++) add('col', pick(inv), course(i));
    add('conf', `${u.conference} Championship`, course(2));
    add('creg', 'NCGA Regional', course(0));
    add('nat', 'NCGA National Championship', 'blackstone');
  } else if (c.tour === 'q') {
    add('q', 'Crown Tour Qualifying School', 'harborpoint');
  } else if (c.tour === 'dev') {
    const names = ['Ridgeline Open', 'Valley Classic', 'Coastal Challenge', 'Heartland Championship', 'Pinewood Open', 'Summit Classic', 'Lakeshore Invitational', 'Ridgeline Tour Finals'];
    names.forEach((n, i) => add('dev', n, course(i)));
  } else {
    const regs = ['Crown Tour Opener', 'Pacific Invitational', 'Heritage Classic', 'Emerald Coast Open', 'Capital City Championship', 'Tour Championship'];
    let r = 0;
    for (let slot = 0; slot < 10; slot++) {
      const m = MAJORS.find(x => x.slot === slot);
      if (m) add('major', m.name, m.courseId, { major: m.key });
      else add('elite', regs[r++] || 'Crown Tour event', course(slot));
    }
  }
  return { label: seasonLabel(c), events, idx: 0 };
}

export const currentEvent = (c) => (c.season && !c.pending ? c.season.events[c.season.idx] : null);
export const canSimulate = (e) => !e.critical;

// ---------- fields ----------
function parsOf(e) { return getCourse(e.courseId).holes.slice(0, e.holes).map(h => h.p); }

function genField(c, e) {
  const K = KIND[e.kind];
  const rng = mulberry32(e.seed);
  const pars = parsOf(e);
  const boost = c.stage === 'college' && K.group === 'college' ? (uni(c)?.field || 0) : 0;
  const [lo, hi] = K.skill;
  const people = [];
  if (K.group === 'hs') {
    const s = school(c);
    const mine = c.teammates.slice(0, 4).map(n => [n, s.short]);
    if (e.kind === 'tryout') {
      c.teammates.slice(0, 9).forEach(n => people.push([n, s.short]));
      for (let i = people.length; i < K.field - 1; i++) people.push([randomName(rng), s.short]);
    } else if (e.kind === 'dual' || e.kind === 'jv') {
      const r = HIGH_SCHOOLS.find(x => x.id === e.rival);
      people.push(...mine);
      for (let i = 0; i < 5; i++) people.push([randomName(rng), r.short]);
    } else {
      people.push(...mine);
      for (let i = people.length; i < K.field - 1; i++) people.push([randomName(rng), HIGH_SCHOOLS[i % 5].short]);
    }
  } else if (K.group === 'college') {
    const u = uni(c);
    c.uniTeam.slice(0, 4).forEach(n => people.push([n, u.short]));
    for (let i = people.length; i < K.field - 1; i++) people.push([randomName(rng), UNIVERSITIES[i % 5].short]);
  } else {
    if (K.pros || K.group === 'elite') PROS.forEach(pr => people.push([pr.name, pr.country, clamp(((pr.power + pr.accuracy + pr.shortGame + pr.putting) / 4 - 60) / 38, 0.4, 0.95)]));
    for (let i = people.length; i < K.field - 1; i++) people.push([randomName(rng), '']);
  }
  e.field = people.slice(0, K.field - 1).map(([name, team, fixed]) => {
    const skill = fixed ?? lo + boost + (hi - lo) * Math.pow(rng(), 0.8);
    const form = (rng() - 0.5) * 0.2;
    const rounds = Array.from({ length: e.rounds }, (_, rd) => {
      const day = (rng() - 0.5) * 0.3;
      return pars.map(par => holeScore(rng, par, par + (AVG_OVER[par] ?? 0.2), clamp(skill + form + day, -1.2, 1), rd === 3));
    });
    return { name, team, skill: Math.round(skill * 100) / 100, rounds };
  });
}

export function startEvent(c) {
  const e = currentEvent(c);
  if (e && !e.field) { genField(c, e); e.status = 'live'; }
  return e;
}

// ---------- standings ----------
// rows after `thru` complete rounds for everyone (the player's rounds so far by default)
export function standings(c, e, thru = e.player.rounds.length) {
  const pars = parsOf(e);
  const par = pars.reduce((a, b) => a + b, 0);
  const rows = e.field.map(f => {
    const rs = f.rounds.slice(0, thru).map(r => r.reduce((a, b) => a + b, 0));
    return { name: f.name, team: f.team, rounds: rs, cut: !!f.cut, isPlayer: false };
  });
  const me = { name: c.golferName || 'You', team: c.stage === 'pro' ? '' : (c.stage === 'hs' ? school(c).short : uni(c).short), rounds: e.player.rounds.slice(0, thru).map(r => r.scores.reduce((a, b) => a + b, 0)), cut: !!e.player.cut, isPlayer: true };
  rows.push(me);
  for (const r of rows) { r.total = r.rounds.reduce((a, b) => a + b, 0); r.toPar = r.total - par * r.rounds.length; r.today = r.rounds.length ? r.rounds[r.rounds.length - 1] - par : 0; }
  rows.sort((a, b) => (a.cut - b.cut) || (b.rounds.length - a.rounds.length) || (a.toPar - b.toPar));
  rows.forEach((r, i) => {
    if (r.cut) { r.pos = '—'; return; }
    const first = rows.findIndex(x => !x.cut && x.toPar === r.toPar && x.rounds.length === r.rounds.length);
    r.pos = first + 1;
    r.tied = rows.filter(x => !x.cut && x.toPar === r.toPar && x.rounds.length === r.rounds.length).length > 1;
  });
  return rows;
}

// team score (best 4 of 5) for dual matches
export function teamResult(c, e) {
  if (e.kind !== 'dual' && e.kind !== 'jv') return null;
  const rows = standings(c, e);
  const mine = school(c).short;
  const totals = {};
  for (const r of rows) (totals[r.team] = totals[r.team] || []).push(r.total);
  const score = (t) => totals[t].sort((a, b) => a - b).slice(0, 4).reduce((a, b) => a + b, 0);
  const other = Object.keys(totals).find(t => t !== mine);
  return { us: score(mine), them: score(other), rival: other, won: score(mine) < score(other), tied: score(mine) === score(other) };
}

// ---------- playing ----------
// simulate the player's round from their golfer's overall rating
export function simulateRound(c, e, golfer) {
  const rng = mulberry32((e.seed ^ 0x9e3779b9) + e.player.rounds.length * 101);
  const skill = clamp(skillFromOvr(golferOverall(golfer)) + (rng() - 0.5) * 0.25, -1.2, 1);
  return parsOf(e).map(par => holeScore(rng, par, par + (AVG_OVER[par] ?? 0.2), skill, false));
}

// record one completed round (played or simulated). Returns { done, result }.
export function recordRound(p, scores, sim = false) {
  const c = p.rtp;
  const e = startEvent(c);
  e.player.rounds.push({ scores: scores.slice(0, e.holes), sim });
  c.stats.rounds++; if (sim) c.stats.simRounds++;
  c.stats.holes += e.holes;
  c.stats.toPar += scores.slice(0, e.holes).reduce((a, s, i) => a + s - parsOf(e)[i], 0);
  const n = e.player.rounds.length;
  // majors: low MAJOR_CUT and ties after round 2
  if (e.kind === 'major' && n === 2) {
    const rows = standings(c, e, 2);
    const line = rows[Math.min(rows.length, MAJOR_CUT) - 1].toPar;
    e.cutLine = line;
    for (const f of e.field) f.cut = rows.find(r => r.name === f.name && !r.isPlayer).toPar > line;
    if (rows.find(r => r.isPlayer).toPar > line) { e.player.cut = true; return { done: true, result: finishEvent(p, e) }; }
  }
  if (n >= e.rounds) return { done: true, result: finishEvent(p, e) };
  return { done: false };
}

const finishPts = (pos, n, tier) => Math.round(tier * 25 * Math.pow(Math.max(0, 1 - (pos - 1) / (n * 0.6)), 2) + (pos === 1 ? tier * 15 : 0));

function finishEvent(p, e) {
  const c = p.rtp;
  const K = KIND[e.kind];
  const rows = standings(c, e, e.player.cut ? 2 : e.rounds);
  const me = rows.find(r => r.isPlayer);
  let won = !me.cut && me.pos === 1;
  let playoff = null;
  if (won && me.tied) {
    const leaders = rows.filter(r => r.pos === 1 && !r.isPlayer);
    won = mulberry32(e.seed ^ 0x51ed)() < 1 / (leaders.length + 1) + 0.1;
    playoff = { against: leaders.map(r => r.name), won };
  }
  const pos = me.cut ? rows.length : (won ? 1 : (me.pos === 1 ? 2 : me.pos));
  const n = rows.length;
  const mult = c.stage === 'college' ? (uni(c)?.points || 1) : 1;
  const pts = me.cut ? 0 : Math.round(finishPts(pos, n, K.tier) * mult);
  const purse = PURSE[K.group];
  const coins = me.cut ? Math.round(purse[3] / 2) : purse[pos === 1 ? 0 : pos <= 3 ? 1 : pos <= 10 ? 2 : 3];
  const team = teamResult(c, e);
  e.result = { pos, tied: !won && me.tied && pos !== 1, cut: !!me.cut, toPar: me.toPar, total: me.total, won, playoff, pts, coins, team, n,
    winner: won ? me.name : rows.find(r => !r.isPlayer && !r.cut)?.name, winScore: rows[0].toPar };
  e.status = 'done';
  // career bookkeeping
  c.pts += pts; c.seasonPts += pts;
  c.stats.events++;
  const counts = e.kind !== 'tryout'; // the tryout decides the squad; it isn't a title
  if (won && counts) c.stats.wins++;
  if (pos <= 10 && !me.cut && counts) c.stats.top10++;
  if (c.stage === 'hs') c.hsScores.push(...e.player.rounds.map(r => (r.scores.reduce((a, b) => a + b, 0) - parsOf(e).reduce((a, b) => a + b, 0)) * (18 / e.holes)));
  if (won && counts) {
    c.trophies.unshift({ name: e.name, season: `${teamName(c)} · ${seasonLabel(c)}`, stage: c.stage, major: e.kind === 'major', state: e.kind === 'state', national: e.kind === 'nat', toPar: me.toPar, date: Date.now() });
    if (e.kind === 'major') c.stats.majorWins++;
  }
  if (team?.won && e.kind === 'dual') c.teamWins = (c.teamWins || 0) + 1;
  // Golf Coins: event payout (+ sponsors), each paid once
  post(p, `rtp:${c.id}:${e.id}`, coins, `${e.name}: ${posLabel(e.result)}`);
  const spons = c.sponsors.reduce((a, id) => a + (SPONSORS.find(s => s.id === id)?.perEvent || 0), 0);
  if (spons) post(p, `rtp:${c.id}:${e.id}:sp`, spons, 'Sponsor bonuses');
  e.result.sponsor = spons;
  c.stats.coins += coins + spons;
  // qualifying: regionals -> state / nationals
  if (K.qualify) {
    const nextKind = e.kind === 'hsreg' ? 'state' : 'nat';
    const nx = c.season.events.find(x => x.kind === nextKind);
    if (nx && (pos > K.qualify || me.cut)) { nx.status = 'dnq'; e.result.qualified = false; } else e.result.qualified = true;
  }
  if (e.kind === 'tryout') { c.squad = pos <= 5 ? 'varsity' : 'jv'; e.result.squad = c.squad; }
  if (c.stage === 'hs' && c.year >= 2) updateInterest(c);
  checkSponsors(c);
  // keep the save small: completed events keep only the leaderboard
  e.final = rows.slice(0, 15).map(r => ({ name: r.name, team: r.team, toPar: r.toPar, pos: r.pos, tied: r.tied, cut: r.cut, isPlayer: r.isPlayer }));
  if (!e.final.some(r => r.isPlayer)) e.final.push({ name: me.name, team: me.team, toPar: me.toPar, pos: me.pos, tied: me.tied, cut: me.cut, isPlayer: true });
  e.field = null;
  return e.result;
}

// after an event's result screen: move to the next event (skipping DNQs / JV-only rules) or end the season
export function advance(p) {
  const c = p.rtp;
  const s = c.season;
  // a freshman cut to JV plays the JV schedule
  const cur = s.events[s.idx];
  if (cur?.kind === 'tryout' && c.squad === 'jv') {
    const rest = buildSeason({ ...c, squad: 'jv' }).events.filter(x => x.kind === 'jv');
    s.events = [cur, ...rest.slice(0, 5).map((x, i) => ({ ...x, id: `s${c.seasons}e${i + 1}` }))];
    s.events.push(ev(c, 6, 'hsreg', 'Regional Championship', 'cedarvale', { status: 'dnq', note: 'Varsity only' }), ev(c, 7, 'state', 'State Finals', 'blackstone', { status: 'dnq', note: 'Varsity only' }));
  }
  s.idx++;
  while (s.idx < s.events.length && s.events[s.idx].status === 'dnq') s.idx++;
  if (s.idx >= s.events.length) endSeason(p);
}

// ---------- rankings ----------
const POOL = { hs: [600, 35, 500, 'Junior ranking'], college: [800, 45, 300, 'College ranking'], pro: [1500, 60, 400, 'World ranking'] };
export function ranking(c) {
  const [top, k, size, label] = POOL[c.stage];
  // pool point totals fall off exponentially; your rank is how many have more points than you
  const ahead = c.pts >= top ? 0 : Math.ceil(k * Math.log(top / Math.max(1, c.pts)));
  return { rank: Math.min(size, 1 + ahead), of: size, label };
}
export function devStanding(c) { return 1 + (c.seasonPts >= 520 ? 0 : Math.ceil(18 * Math.log(520 / Math.max(1, c.seasonPts)))); }

// ---------- recruiting ----------
export function recruitScore(c) {
  const s = c.hsScores;
  if (!s.length) return 0;
  const avg = s.reduce((a, b) => a + b, 0) / s.length;
  const sd = Math.sqrt(s.reduce((a, b) => a + (b - avg) ** 2, 0) / s.length);
  const { rank } = ranking(c);
  return Math.round(0.4 * clamp(100 - avg * 4.5, 0, 100) + 0.3 * clamp(100 - (rank - 1) * 0.6, 0, 100) + 0.15 * Math.min(100, c.stats.wins * 25) + 0.15 * clamp(100 - sd * 8, 0, 100));
}
export function updateInterest(c) {
  const sc = recruitScore(c);
  for (const u of UNIVERSITIES) c.interest[u.id] = Math.round(clamp(50 + (sc - u.bar) * 2.5, 0, 100));
}

// ---------- sponsors ----------
function checkSponsors(c) {
  const has = (id) => c.sponsors.includes(id);
  const add = (id) => { if (!has(id)) { c.sponsors.push(id); (c.newSponsors = c.newSponsors || []).push(id); } };
  if (c.stage === 'pro') {
    if (c.tour === 'dev' || c.tour === 'elite') add('fs');
    if (c.tour === 'elite') add('ap');
    const r = ranking(c).rank;
    if (r <= 50) add('al');
    if (r <= 10) add('vx');
    if (c.stats.majorWins) add('nl');
  }
}

// ---------- season end + decisions ----------
function endSeason(p) {
  const c = p.rtp;
  const evs = c.season.events.filter(e => e.status === 'done');
  const toPars = evs.map(e => e.result.toPar * (18 / e.holes) / e.rounds).filter(Number.isFinite);
  const summary = { label: `${teamName(c)} · ${seasonLabel(c)}`, stage: c.stage, events: evs.length, wins: evs.filter(e => e.result.won).length,
    avg: toPars.length ? Math.round(toPars.reduce((a, b) => a + b, 0) / toPars.length * 10) / 10 : null,
    best: evs.reduce((b, e) => (!b || e.result.pos < b.pos ? { pos: e.result.pos, name: e.name } : b), null), rank: ranking(c).rank, pts: c.seasonPts };
  c.history.unshift(summary);
  // training: college programmes develop their focus attributes every season
  const training = {};
  const g = p.golfer;
  if (c.stage === 'college' && g) {
    const u = uni(c);
    for (const k of u.train) training[k] = (training[k] || 0) + 2;
    if (u.allTrain) for (const k of Object.keys(g.attrs)) training[k] = (training[k] || 0) + u.allTrain;
    for (const [k, v] of Object.entries(training)) g.attrs[k] = Math.min(ATTR_MAX, g.attrs[k] + v);
    if (u.bonusPoints) p.skillPoints += u.bonusPoints;
  }
  summary.training = training;
  c.pending = { type: 'season', summary };
  if (c.stage === 'hs' && c.year === 4) {
    updateInterest(c);
    const offers = UNIVERSITIES.filter(u => (c.interest[u.id] ?? 0) >= 50).map(u => u.id);
    if (!offers.length) offers.push(UNIVERSITIES.slice().sort((a, b) => a.bar - b.bar)[0].id);
    c.offers = offers;
    c.pending = { type: 'offers', summary, offers };
  } else if (c.stage === 'college') {
    const natWin = evs.some(e => e.kind === 'nat' && e.result.won);
    const early = c.year < 4 && (natWin || ranking(c).rank <= 3);
    if (c.year === 4 || early) c.pending = { type: 'turnpro', summary, early };
  } else if (c.stage === 'pro') {
    if (c.tour === 'q') {
      const pos = evs[0]?.result.pos ?? 99;
      c.pending = { type: 'promotion', summary, to: pos <= 5 ? 'elite' : pos <= 25 ? 'dev' : 'q', pos };
    } else if (c.tour === 'dev') {
      const st = devStanding(c);
      c.pending = { type: 'promotion', summary, to: st <= 5 ? 'elite' : 'dev', standing: st };
    }
  }
  c.seasonPts = 0;
  c.pts = Math.round(c.pts * 0.6); // ranking points decay season to season
}

// resolve the pending decision and start the next season. choice: uni id / 'pro' / 'stay'
export function resolve(p, choice) {
  const c = p.rtp;
  const pd = c.pending;
  if (!pd) return;
  if (pd.type === 'offers') {
    const u = UNIVERSITIES.find(x => x.id === choice && pd.offers.includes(x.id));
    if (!u) return;
    c.uni = u.id; c.stage = 'college'; c.year = 1; c.pts = Math.round(c.pts * 0.3);
    const rng = mulberry32(c.seed ^ 0xc011e9e);
    c.uniTeam = Array.from({ length: 8 }, () => randomName(rng));
    post(p, `rtp:${c.id}:scholarship`, u.scholarship, `${u.name} scholarship`);
  } else if (pd.type === 'turnpro') {
    if (choice === 'stay' && pd.early) c.year++;
    else { c.turnedPro = { early: !!pd.early, after: HS_YEARS[c.year - 1], uni: c.uni }; c.stage = 'pro'; c.tour = 'q'; c.year = 1; c.pts = Math.round(c.pts * 0.15); }
  } else if (pd.type === 'promotion') {
    if (pd.to !== c.tour) c.year = 1; else c.year++;
    c.tour = pd.to;
  } else if (c.stage === 'pro') c.year++;
  else c.year++;
  c.pending = null;
  c.seasons++;
  c.season = buildSeason(c);
  checkSponsors(c);
}

export function stageTitle(c) {
  if (c.stage === 'hs') return 'HIGH SCHOOL';
  if (c.stage === 'college') return 'COLLEGE';
  return c.tour === 'q' ? 'QUALIFYING' : c.tour === 'dev' ? 'DEVELOPMENT TOUR' : 'CROWN TOUR';
}

// launch settings for a round of the current event
export function roundConfig(c, e) {
  const n = e.player.rounds.length + 1;
  return {
    mode: e.holes === 9 ? 'round9' : 'round18', courseId: e.courseId, teeId: e.tee,
    holes: [...Array(e.holes).keys()], wind: 'normal', pins: e.kind === 'major' && n === 4 ? 'sunday' : 'medium',
    rtp: { evId: e.id, round: n },
  };
}

// school/college uniform: team colours on the polo and cap
export function teamLook(c, look) {
  const t = c.stage === 'hs' ? school(c) : c.stage === 'college' ? uni(c) : null;
  if (!t) return look;
  const L = JSON.parse(JSON.stringify(look));
  L.outfit.top = { ...L.outfit.top, color: t.colors[0], pattern: 'solid' };
  if (L.outfit.hat && L.outfit.hat.id !== 'hat-none') L.outfit.hat = { ...L.outfit.hat, color: t.colors[0] === '#f4f4f2' ? t.colors[1] : t.colors[0] };
  return L;
}
