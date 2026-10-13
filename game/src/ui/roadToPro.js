// Road to Pro screens: pick a high school, the career hub (schedule, standings, recruiting, sponsors,
// trophy room, history), decisions (college offers, turning pro, tour cards) and event results.
import { HIGH_SCHOOLS, UNIVERSITIES, TOURS, SPONSORS, crest } from '../data/schools.js';
import { getCourse, TEE_SETS } from '../data/courses.js';
import { golferOverall } from '../data/golfers.js';
import {
  newCareer, currentEvent, startEvent, canSimulate, simulateRound, recordRound, advance, resolve, standings, ranking, devStanding,
  school, uni, teamName, seasonLabel, stageTitle, roundConfig, teamLook, recruitScore, KIND, fmtPar, posLabel, HS_YEARS,
} from '../game/career.js';
import { awardXp } from '../core/profile.js';
import { fmtCoins } from '../core/wallet.js';
import { coinHtml } from './shop.js';
import { audio } from '../audio/audio.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ATTR_NAMES = { distance: 'Distance', accuracy: 'Driving accuracy', irons: 'Irons', wedges: 'Wedges', chipping: 'Chipping', putting: 'Putting', recovery: 'Recovery', mental: 'Mental' };
const teeName = (id) => TEE_SETS.find(t => t.id === id)?.name || id;
const ord = (n) => `${n}${[, 'st', 'nd', 'rd'][(n % 100 >> 3 ^ 1) && n % 10] || 'th'}`;

// stats for a simulated round, enough for XP
function simStats(scores, pars) {
  const st = { holes: scores.length, strokes: 0, par: 0, pars: 0, birdies: 0, eagles: 0, aces: 0, albatross: 0, fairways: 0, gir: 0, sandSaves: 0, upDowns: 0 };
  scores.forEach((s, i) => { st.strokes += s; st.par += pars[i]; const d = s - pars[i]; if (d === 0) st.pars++; else if (d === -1) st.birdies++; else if (d <= -2) st.eagles++; });
  st.toPar = st.strokes - st.par;
  return st;
}

export class RoadToPro {
  constructor(menus) { this.menus = menus; this.tab = 'schedule'; }
  get app() { return this.menus.app; }
  get p() { return this.menus.profile; }
  render(html) { this.menus.render(html, 'page-screen rtp-screen'); this.bind(); }
  bind() {
    const root = this.menus.root;
    root.querySelectorAll('[data-rtp]').forEach(b => b.onclick = () => { audio.init(); audio.click(); this.action(b.dataset.rtp, b.dataset.v); });
  }

  open() {
    const p = this.p;
    if (!p.golfer) return this.needGolfer();
    if (!p.rtp) return this.pickSchool();
    const c = p.rtp;
    if (currentEvent(c)?.status === 'done') { advance(p); this.app.save(); }
    if (c.pending) return this.decision();
    this.hub();
  }

  action(a, v) {
    const p = this.p;
    switch (a) {
      case 'school': this.sel = v; return this.pickSchool();
      case 'start': p.rtp = newCareer(p, this.sel || HIGH_SCHOOLS[0].id); this.app.save(); audio.jingle?.('unlock'); return this.open();
      case 'tab': this.tab = v; return this.hub();
      case 'play': return this.play();
      case 'sim': return this.simulate();
      case 'continue': advance(p); this.app.save(); return this.open();
      case 'resolve': resolve(p, v); this.app.save(); audio.jingle?.('unlock'); this.tab = 'schedule'; return this.open();
      case 'golfer': return this.menus.go('mygolfer');
      case 'hub': return this.open();
      case 'retire': if (v === 'yes') { p.rtpArchive = [...(p.rtpArchive || []), { ...p.rtp, season: null }].slice(-3); p.rtp = null; this.app.save(); return this.open(); } this.confirmRetire = !this.confirmRetire; return this.hub();
    }
  }

  // ---------- entry ----------
  needGolfer() {
    this.render(`<div class="page narrow">
      <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">ROAD TO PRO</div></div>
      <div class="glass rtp-intro">
        <div class="rtp-path">${['HIGH SCHOOL', 'COLLEGE', 'Q-SCHOOL', 'RIDGELINE TOUR', 'CROWN TOUR & MAJORS'].map(x => `<span>${x}</span>`).join('<i>›</i>')}</div>
        <p>Start on a high school team, earn college offers, turn pro and chase the four majors — as your own golfer.</p>
        <button class="btn primary big" data-rtp="golfer">CREATE YOUR GOLFER ▸</button>
      </div></div>`);
  }

  pickSchool() {
    const sel = this.sel || HIGH_SCHOOLS[0].id;
    this.render(`<div class="page">
      <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">ROAD TO PRO<small>Choose your high school</small></div><button class="btn primary" data-rtp="start">START CAREER ▸</button></div>
      <div class="rtp-path small">${['HIGH SCHOOL', 'COLLEGE', 'Q-SCHOOL', 'RIDGELINE TOUR', 'CROWN TOUR & MAJORS'].map(x => `<span>${x}</span>`).join('<i>›</i>')}</div>
      <div class="rtp-schools">${HIGH_SCHOOLS.map(s => `
        <button class="rtp-school glass ${s.id === sel ? 'sel' : ''}" data-rtp="school" data-v="${s.id}" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">
          ${crest(s, 44)}
          <div><b>${esc(s.name)}</b><span>${esc(s.mascot)} · ${esc(s.program)}</span><small>Home course: ${esc(getCourse(s.home).name)} · ${esc(s.coach)}</small></div>
        </button>`).join('')}</div>
      <div class="dim rtp-note">Four seasons of high school golf: tryouts, dual matches, invitationals, regionals and the State Finals. Play every event yourself or simulate the non-critical ones. All schools are fictional.</div>
    </div>`);
  }

  // ---------- hub ----------
  header(c) {
    const t = c.stage === 'hs' ? school(c) : c.stage === 'college' ? uni(c) : null;
    const r = ranking(c);
    return `<div class="rtp-head glass" ${t ? `style="--c1:${t.colors[0]};--c2:${t.colors[1]}"` : ''}>
      ${t ? crest(t, 42) : '<div class="rtp-tourmark">★</div>'}
      <div class="rh-main"><small>${stageTitle(c)} · ${esc(seasonLabel(c))}</small><b>${esc(teamName(c))}</b><span>${esc(c.golferName)} · ${golferOverall(this.p.golfer)} OVR${c.stage === 'hs' ? ` · ${c.squad === 'jv' ? 'JV' : 'Varsity'}` : ''}</span></div>
      <div class="rh-stats">
        <div><span>${r.label.toUpperCase()}</span><b>#${r.rank}</b></div>
        ${c.tour === 'dev' ? `<div><span>SEASON STANDING</span><b>${ord(devStanding(c))}</b></div>` : ''}
        <div><span>WINS</span><b>${c.stats.wins}</b></div>
        <div><span>EARNED</span>${coinHtml(c.stats.coins)}</div>
      </div></div>`;
  }

  hub() {
    const c = this.p.rtp;
    const tabs = [['schedule', 'SCHEDULE'], c.stage === 'hs' ? ['recruit', 'RECRUITING'] : c.stage === 'pro' ? ['sponsors', 'SPONSORS'] : null, ['trophies', `TROPHIES${c.trophies.length ? ` (${c.trophies.length})` : ''}`], ['history', 'CAREER']].filter(Boolean);
    if (!tabs.some(t => t[0] === this.tab)) this.tab = 'schedule';
    const body = this[`tab_${this.tab}`](c);
    this.render(`<div class="page rtp">
      <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">ROAD TO PRO</div>${coinHtml(this.p.coins, 'big')}</div>
      ${this.header(c)}
      <div class="gtabs rtp-tabs">${tabs.map(([k, n]) => `<button class="gtab ${this.tab === k ? 'on' : ''}" data-rtp="tab" data-v="${k}">${n}</button>`).join('')}</div>
      ${body}
    </div>`);
  }

  eventRow(c, e, i) {
    const cur = i === c.season.idx;
    const st = e.status === 'done' ? `<b class="rr-res ${e.result.won ? 'win' : ''}">${e.result.won ? '🏆 ' : ''}${posLabel(e.result)}</b><small>${fmtPar(e.result.toPar)}</small>`
      : e.status === 'dnq' ? `<span class="dim">${esc(e.note || 'Did not qualify')}</span>` : cur ? '<b class="rr-next">NEXT</b>' : '';
    return `<div class="rr ${cur ? 'cur' : ''} ${e.status}"><span class="rr-n">${i + 1}</span><div class="rr-name"><b>${esc(e.name)}</b><small>${esc(KIND[e.kind].label)} · ${esc(getCourse(e.courseId).short)} · ${e.holes} holes${e.rounds > 1 ? ` × ${e.rounds}` : ''}${e.critical ? ' · <em>must play</em>' : ''}</small></div><div class="rr-st">${st}</div></div>`;
  }

  tab_schedule(c) {
    const e = currentEvent(c);
    const s = c.season;
    let next = '';
    if (e) {
      const n = e.player.rounds.length + 1;
      const live = e.player.rounds.length && e.field ? this.board(c, e, 8) : '';
      next = `<div class="rtp-next glass">
        <small>${esc(KIND[e.kind].label.toUpperCase())}${e.rounds > 1 ? ` · ROUND ${n} OF ${e.rounds}` : ''}</small>
        <b>${esc(e.name)}</b>
        <div class="rn-meta"><span>⛳ ${esc(getCourse(e.courseId).name)}</span><span>${teeName(e.tee)} tees</span><span>${e.holes} holes</span><span>Field of ${KIND[e.kind].field}</span></div>
        ${e.kind === 'tryout' ? '<div class="rn-note">Finish in the top 5 to make varsity. Otherwise you start on JV.</div>' : ''}
        ${KIND[e.kind].qualify ? `<div class="rn-note">Top ${KIND[e.kind].qualify} advance to ${e.kind === 'hsreg' ? 'the State Finals' : 'the National Championship'}.</div>` : ''}
        ${e.kind === 'q' ? '<div class="rn-note">Top 5: Crown Tour card. Top 25: Ridgeline Tour card.</div>' : ''}
        ${e.kind === 'major' ? `<div class="rn-note">Four rounds. The low ${30} and ties make the cut after round 2.</div>` : ''}
        ${live}
        <div class="rn-btns"><button class="btn primary big" data-rtp="play">PLAY ${e.rounds > 1 ? `ROUND ${n}` : (e.holes === 9 ? '9 HOLES' : 'ROUND')} ▸</button>
        ${canSimulate(e) ? '<button class="btn" data-rtp="sim">SIMULATE</button>' : '<span class="rn-must">Critical event: play it yourself</span>'}</div>
      </div>`;
    }
    return `<div class="rtp-sched">
      <div class="rtp-list glass"><div class="section-title">${esc(s.label.toUpperCase())}</div>${s.events.map((x, i) => this.eventRow(c, x, i)).join('')}</div>
      ${next}
    </div>`;
  }

  tab_recruit(c) {
    const sc = recruitScore(c);
    const started = c.year >= 2 && Object.keys(c.interest).length;
    return `<div class="glass rtp-pad">
      <div class="section-title">COLLEGE RECRUITING <small>${c.year < 2 ? 'Recruiters start watching in your sophomore season' : `Recruiting score ${sc}`}</small></div>
      <div class="dim rtp-note">Interest comes from your scoring average, junior ranking, wins and consistency. Offers arrive after your senior season.</div>
      <div class="rtp-unis">${UNIVERSITIES.map(u => { const v = c.interest[u.id] ?? 0; return `<div class="rtp-uni" style="--c1:${u.colors[0]};--c2:${u.colors[1]}">${crest(u, 34)}<div><b>${esc(u.name)}</b><small>${esc(u.positioning)} · ${esc(u.conference)}</small><div class="minibar"><i style="width:${started ? v : 0}%"></i></div></div><em>${started ? `${v}%` : '—'}</em></div>`; }).join('')}</div>
    </div>`;
  }

  tab_sponsors(c) {
    return `<div class="glass rtp-pad"><div class="section-title">SPONSORS <small>paid in Golf Coins for every event you play</small></div>
      <div class="rtp-spons">${SPONSORS.map(s => `<div class="sp ${c.sponsors.includes(s.id) ? 'on' : ''}"><b>${esc(s.brand)}</b><span>${esc(s.what)}</span><small>${c.sponsors.includes(s.id) ? 'SIGNED' : esc(s.when)}</small>${coinHtml(s.perEvent)}<i>/event</i></div>`).join('')}</div></div>`;
  }

  tab_trophies(c) {
    if (!c.trophies.length) return '<div class="glass rtp-pad"><div class="section-title">TROPHY ROOM</div><div class="dim">No wins yet. Your trophies will live here.</div></div>';
    return `<div class="glass rtp-pad"><div class="section-title">TROPHY ROOM</div><div class="rtp-troph">${c.trophies.map(t => `<div class="tr ${t.major ? 'major' : t.state || t.national ? 'title' : ''}"><div class="tr-cup">${t.major ? '🏆' : t.state || t.national ? '🥇' : '🏅'}</div><b>${esc(t.name)}</b><small>${esc(t.season)}</small><span>${fmtPar(t.toPar)}</span></div>`).join('')}</div></div>`;
  }

  tab_history(c) {
    const s = c.stats;
    const avg = s.holes ? fmtPar(Math.round(s.toPar / s.holes * 18 * 10) / 10) : '—';
    return `<div class="rtp-hist">
      <div class="glass rtp-pad"><div class="section-title">CAREER STATS</div><div class="stat-grid">${[['Events', s.events], ['Rounds', `${s.rounds}${s.simRounds ? ` (${s.simRounds} sim)` : ''}`], ['Avg to par / 18', avg], ['Wins', s.wins], ['Top 10s', s.top10], ['Majors', s.majorWins], ['Coins earned', fmtCoins(s.coins)], ['Seasons', c.history.length]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>
        <div class="rtp-retire">${this.confirmRetire ? '<span>Start a brand-new career? This one is archived.</span><button class="btn danger small" data-rtp="retire" data-v="yes">YES, START OVER</button><button class="btn small" data-rtp="retire">CANCEL</button>' : '<button class="btn ghost small" data-rtp="retire">Start a new career…</button>'}</div></div>
      <div class="glass rtp-pad"><div class="section-title">SEASONS</div>${c.history.length ? c.history.map(h => `<div class="rr"><div class="rr-name"><b>${esc(h.label)}</b><small>${h.events} events · ${h.wins} wins · avg ${h.avg == null ? '—' : fmtPar(h.avg)} · rank #${h.rank}</small></div></div>`).join('') : '<div class="dim">Your first season is under way.</div>'}</div>
    </div>`;
  }

  board(c, e, limit = 10) {
    const rows = e.field ? standings(c, e) : e.final;
    const me = rows.find(r => r.isPlayer);
    let show = rows.filter(r => !r.cut).slice(0, limit);
    if (me && !show.includes(me)) show = [...show.slice(0, limit - 1), me];
    const num = (v) => `<b class="${v < 0 ? 'under' : v > 0 ? 'over' : 'even'}">${v === 0 ? 'E' : Math.abs(v)}</b>`;
    return `<div class="mboard rtp-board"><div class="mb-cols"><span>POS</span><span>PLAYER</span><span>TO PAR</span></div>
      ${show.map(r => `<div class="mb-row ${r.isPlayer ? 'me' : ''}"><span class="pos">${r.cut ? 'MC' : `${r.tied ? 'T' : ''}${r.pos}`}</span><span class="nm">${esc(r.name)}${r.team ? ` <i>${esc(r.team)}</i>` : ''}</span><span>${num(r.toPar)}</span></div>`).join('')}</div>`;
  }

  // ---------- playing ----------
  play() {
    const p = this.p, c = p.rtp;
    const e = startEvent(c);
    this.app.save();
    const me = this.menus.player('me');
    const cfg = roundConfig(c, e);
    this.app.startRound({ ...cfg, difficulty: p.settings.difficulty, attrs: me.attrs, look: teamLook(c, me.look), golferName: me.name, custom: true });
  }

  simulate() {
    const p = this.p, c = p.rtp;
    const e = startEvent(c);
    if (!canSimulate(e)) return;
    const scores = simulateRound(c, e, p.golfer);
    const pars = getCourse(e.courseId).holes.slice(0, e.holes).map(h => h.p);
    const award = awardXp(p, simStats(scores, pars), 'easy', e.holes, false);
    const r = recordRound(p, scores, true);
    this.app.save();
    this.afterRound(e, { strokes: scores.reduce((a, b) => a + b, 0), toPar: scores.reduce((a, s, i) => a + s - pars[i], 0), sim: true }, r, award, null);
  }

  // shown after every round (played or simulated)
  afterRound(e, mine, r, award, pay) {
    const c = this.p.rtp;
    const res = r.done ? e.result : null;
    const n = e.player.rounds.length;
    let head;
    if (!res) head = `<div class="rtp-final">ROUND ${n} · ${mine.strokes} (${fmtPar(mine.toPar)})<small>${e.cutLine != null && n === 2 ? `Made the cut (${fmtPar(e.cutLine)})` : `Round ${n + 1} of ${e.rounds} up next`}</small></div>`;
    else if (res.cut) head = `<div class="rtp-final mc">MISSED THE CUT<small>${fmtPar(res.toPar)} · the cut fell at ${fmtPar(e.cutLine)}</small></div>`;
    else head = `<div class="rtp-final ${res.won ? 'win' : ''}">${res.won ? (e.kind === 'tryout' ? 'TOP OF THE TRYOUT' : '🏆 CHAMPION') : `FINISHED ${posLabel(res)}`}<small>${fmtPar(res.toPar)}${res.playoff ? ` · ${res.won ? 'won' : 'lost'} a playoff` : ''}${!res.won && res.winner ? ` · ${esc(res.winner)} won at ${fmtPar(res.winScore)}` : ''}</small></div>`;
    const notes = [];
    if (res?.team) notes.push(res.team.won ? `Team win: ${res.team.us}–${res.team.them} over ${esc(res.team.rival)}` : res.team.tied ? `Team match halved ${res.team.us}–${res.team.them}` : `Team loss: ${res.team.us}–${res.team.them} to ${esc(res.team.rival)}`);
    if (res?.squad) notes.push(res.squad === 'varsity' ? 'You made VARSITY!' : 'You start on JV this season — make varsity next year.');
    if (res?.qualified === true) notes.push(e.kind === 'hsreg' ? 'Qualified for the State Finals!' : 'Qualified for the National Championship!');
    if (res?.qualified === false) notes.push(e.kind === 'hsreg' ? 'Missed out on the State Finals.' : 'Missed out on Nationals.');
    if (c.newSponsors?.length) { notes.push(...c.newSponsors.map(id => `New sponsor: ${SPONSORS.find(s => s.id === id).brand} signs you!`)); c.newSponsors = []; }
    const coins = (res ? res.coins + (res.sponsor || 0) : 0) + (pay?.coins || 0) + (pay?.achievements || []).reduce((a, x) => a + x.coins, 0);
    this.render(`<div class="page rtp">
      <div class="page-head"><div class="page-title">${esc(e.name.toUpperCase())}<small>${esc(teamName(c))} · ${mine.sim ? 'simulated round' : 'your round'}</small></div></div>
      ${head}
      ${notes.length ? `<div class="rtp-notes">${notes.map(x => `<div>${x}</div>`).join('')}</div>` : ''}
      <div class="rtp-after">
        <div class="glass rtp-pad">${this.board(c, e, innerHeight < 560 ? 7 : 12)}</div>
        <div class="glass rtp-pad rtp-earn">
          <div class="section-title">EARNED</div>
          ${coins ? `<div class="ea"><span>Golf Coins</span>${coinHtml(coins)}</div>` : ''}
          ${res ? `<div class="ea"><span>${esc(ranking(c).label)} points</span><b>+${res.pts}</b></div>` : ''}
          ${res?.sponsor ? `<div class="ea"><span>Sponsor bonuses</span>${coinHtml(res.sponsor)}</div>` : ''}
          ${award ? `<div class="ea"><span>XP</span><b>+${award.xp}</b></div>${award.levelUps.length ? `<div class="ea lv">LEVEL UP → ${award.to} · +${award.levelUps.length * 3} skill points</div>` : ''}` : ''}
          ${(pay?.achievements || []).map(a => `<div class="ea ach">🏆 ${esc(a.name)}</div>`).join('')}
          <div class="ea"><span>${esc(ranking(c).label)}</span><b>#${ranking(c).rank}</b></div>
        </div>
      </div>
      <div class="center">${res ? '<button class="btn primary big" data-rtp="continue">CONTINUE ▸</button>' : `<button class="btn primary big" data-rtp="play">PLAY ROUND ${n + 1} ▸</button>${canSimulate(e) ? '<button class="btn big" data-rtp="sim">SIMULATE</button>' : ''}<button class="btn big" data-rtp="hub">CAREER HUB</button>`}</div>
    </div>`);
    if (res) audio.jingle?.(res.won ? 'ace' : res.cut ? 'bogey' : 'great');
  }

  // ---------- decisions ----------
  decision() {
    const p = this.p, c = p.rtp, pd = c.pending;
    const sm = pd.summary;
    const summary = `<div class="glass rtp-pad rtp-sum"><div class="section-title">${esc(sm.label.toUpperCase())} · SEASON REVIEW</div>
      <div class="stat-grid">${[['Events', sm.events], ['Wins', sm.wins], ['Avg to par / 18', sm.avg == null ? '—' : fmtPar(sm.avg)], ['Best finish', sm.best ? `${ord(sm.best.pos)}` : '—'], ['Ranking', `#${sm.rank}`]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>
      ${Object.keys(sm.training || {}).length ? `<div class="rtp-train">Team training: ${Object.entries(sm.training).map(([k, v]) => `${ATTR_NAMES[k] || k} +${v}`).join(' · ')}</div>` : ''}</div>`;
    let body = '';
    if (pd.type === 'offers') {
      body = `<div class="section-title">COLLEGE OFFERS <small>${pd.offers.length} of ${UNIVERSITIES.length} schools want you</small></div>
        <div class="rtp-offers">${UNIVERSITIES.map(u => { const has = pd.offers.includes(u.id); return `<div class="rtp-offer glass ${has ? '' : 'none'}" style="--c1:${u.colors[0]};--c2:${u.colors[1]}">
          <div class="ro-top">${crest(u, 40)}<div><b>${esc(u.name)}</b><small>${esc(u.mascot)} · ${esc(u.positioning)}</small></div></div>
          <div class="ro-rows"><div><span>Scholarship</span>${coinHtml(u.scholarship)}</div><div><span>Training</span><b>${u.train.map(k => ATTR_NAMES[k]).join(' + ')}</b></div><div><span>Schedule</span><b>${u.field >= 0.07 ? 'Very tough' : u.field >= 0.03 ? 'Tough' : 'Moderate'} · ${u.points}× points</b></div><div><span>Home</span><b>${esc(getCourse(u.home).short)}</b></div></div>
          <div class="ro-perk">${esc(u.perk)}</div>
          ${has ? `<button class="btn primary" data-rtp="resolve" data-v="${u.id}">ACCEPT OFFER</button>` : `<div class="ro-no">No offer · interest ${c.interest[u.id] ?? 0}%</div>`}</div>`; }).join('')}</div>`;
    } else if (pd.type === 'turnpro') {
      body = `<div class="glass rtp-pad rtp-choice"><div class="section-title">${pd.early ? 'TURN PRO EARLY?' : 'GRADUATION'}</div>
        <p>${pd.early ? `You're one of the best college players in the country. You can turn professional now and head to Q-School, or stay for your ${HS_YEARS[c.year].toLowerCase()} season.` : 'Four seasons done. Time to turn professional: next stop, Crown Tour Qualifying School.'}</p>
        <div class="rn-btns"><button class="btn primary big" data-rtp="resolve" data-v="pro">TURN PRO ▸</button>${pd.early ? '<button class="btn big" data-rtp="resolve" data-v="stay">STAY IN COLLEGE</button>' : ''}</div></div>`;
    } else if (pd.type === 'promotion') {
      const msg = pd.to === 'elite' ? `You've earned a <b>${TOURS.elite.name}</b> card! The best players in the world and four majors await.`
        : pd.to === 'dev' ? (c.tour === 'q' ? `You finished ${ord(pd.pos)} at Q-School and earned a <b>${TOURS.dev.name}</b> card. Finish top 5 on its season standings to move up.` : `You finished ${ord(pd.standing)} on the ${TOURS.dev.name} standings. Top 5 move up: another season on the development tour.`)
        : `You finished ${ord(pd.pos)} at Q-School. Only the top 25 earn status — back to Q-School next year.`;
      body = `<div class="glass rtp-pad rtp-choice"><div class="section-title">TOUR STATUS</div><p>${msg}</p><div class="rn-btns"><button class="btn primary big" data-rtp="resolve">START NEXT SEASON ▸</button></div></div>`;
    } else {
      body = `<div class="rn-btns center"><button class="btn primary big" data-rtp="resolve">START ${c.stage === 'pro' ? 'NEXT SEASON' : `${HS_YEARS[c.year]?.toUpperCase() || 'NEXT'} SEASON`} ▸</button></div>`;
    }
    this.render(`<div class="page rtp">
      <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">ROAD TO PRO</div>${coinHtml(p.coins, 'big')}</div>
      ${this.header(c)}${summary}${body}</div>`);
  }
}
