// Front-end menus: main menu, round setup (golfer/course/tees), career,
// golfer customization, bag, settings, practice and results.
import { COURSES, TEE_SETS, coursePar, courseYards, getCourse } from '../data/courses.js';
import { PROS, proAttrs, DEFAULT_LOOK } from '../data/golfers.js';
import { normalizeLook } from '../data/look.js';
import { TOPS, BOTTOMS, SHOES, HATS, GLOVES, RARITY, itemUnlock } from '../data/apparel.js';
import { newTournament, leaderboard, boardHtml, projectedCut, fmtPar, ROUND_DAYS } from '../game/masters.js';
import { GREEN_JACKET } from '../data/apparel.js';
import { CLUB_TYPES, BRAND_MODELS, BALLS, buildBag } from '../data/clubs.js';
import { DIFFICULTIES, LEVEL_XP, customAttrs, resetProfile } from '../core/profile.js';

const proById = (id) => PROS.find(x => x.id === id) || PROS[0];
const proLook = (pro) => normalizeLook({ ...DEFAULT_LOOK, ...pro.look, name: pro.name });
import { audio } from '../audio/audio.js';

const $ = (sel, root = document) => root.querySelector(sel);
const fmtToPar = (v) => v === 0 ? 'E' : v > 0 ? `+${v}` : `${v}`;
const lookColors = (look) => { const o = normalizeLook(look).outfit; return [o.top.color, o.bottom.color]; };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const MODES = {
  round18: { name: 'Quick Round', sub: '18 holes · full round' },
  round9: { name: '9 Holes', sub: 'Front or back nine' },
  coursePractice: { name: 'Course Practice', sub: 'Pick any hole and replay it' },
  practice: { name: 'Practice', sub: 'Chipping · bunker · putting · approach' },
};

export function unlocksAt(lv) {
  return [
    ...COURSES.filter(x => x.unlock === lv).map(x => `⛳ ${x.short}`),
    ...Object.values(BRAND_MODELS).flat().filter(x => x.unlock === lv).map(x => `🏌 ${x.brand} ${x.model}`),
    ...BALLS.filter(x => x.unlock === lv).map(x => `⚪ ${x.brand} ${x.model}`),
    ...Object.entries(RARITY).filter(([, r]) => r.unlock === lv && lv > 1).map(([k, r]) => `👕 ${[...TOPS, ...BOTTOMS, ...SHOES, ...HATS, ...GLOVES].filter(i => (i.rarity || 'common') === k).length} ${r.name.toLowerCase()} apparel items`),
  ];
}

export class Menus {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this.setup = null;
  }
  get profile() { return this.app.profile; }

  show(v) { this.root.classList.toggle('visible', v); }

  render(html, cls = '') {
    this.root.innerHTML = `<div class="screen ${cls}">${html}</div>`;
    this.root.scrollTop = 0;
    this.root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { audio.init(); audio.click(); this.go(b.dataset.go); }));
  }

  go(where) {
    if (where !== 'golfer') this.app.menuScene();
    switch (where) {
      case 'main': return this.main();
      case 'career': return this.career();
      case 'bag': return this.bag();
      case 'settings': return this.settings();
      case 'masters': return this.masters();
      case 'stats': return this.career();
      default:
        if (MODES[where]) return this.startSetup(where);
    }
  }

  profileBadge() {
    const p = this.profile;
    const need = LEVEL_XP(p.level);
    return `<div class="badge glass">
      <div class="avatar" style="background:#1f6b3a">⛳</div>
      <div><div class="b-name">Golf.ai Tour</div><div class="b-lvl">LEVEL ${p.level}</div>
      <div class="xpbar"><i style="width:${Math.min(100, p.xp / need * 100)}%"></i></div></div></div>`;
  }

  main() {
    this.app.menuScene();
    const p = this.profile;
    const last = p.history[0];
    this.render(`
      <div class="main-layout">
        <div class="logo">
          <div class="logo-mark">⛳</div>
          <div><div class="logo-title">GOLF<span>.AI</span></div><div class="logo-sub">CHAMPIONSHIP GOLF</div></div>
        </div>
        ${this.profileBadge()}
        <div class="main-menu">
          <button class="menu-item hero" data-go="round18"><b>QUICK ROUND</b><span>18 holes at a famous course</span></button>
          <button class="menu-item masters-item" data-go="masters"><b>THE MASTERS</b><span>${p.masters && !p.masters.finished ? `Round ${p.masters.round} · ${ROUND_DAYS[p.masters.round - 1].toLowerCase()} — continue your tournament` : '72 holes at Augusta National against the world\'s best'}</span></button>
          <button class="menu-item" data-go="round9"><b>9 HOLES</b><span>${MODES.round9.sub}</span></button>
          <button class="menu-item" data-go="coursePractice"><b>COURSE PRACTICE</b><span>${MODES.coursePractice.sub}</span></button>
          <button class="menu-item" data-go="practice"><b>PRACTICE</b><span>${MODES.practice.sub}</span></button>
          <div class="menu-split">
            <button class="menu-item small" data-go="career"><b>CAREER</b><span>Stats · unlocks</span></button>
            <button class="menu-item small" data-go="bag"><b>MY BAG</b><span>Clubs & ball</span></button>
            <button class="menu-item small" data-go="settings"><b>SETTINGS</b><span>Difficulty · audio</span></button>
          </div>
        </div>
        ${last ? `<div class="last-round glass">LAST ROUND · ${esc(COURSES.find(c => c.id === last.course)?.short || last.course)} · ${last.holes} holes · <b>${last.score}</b> (${fmtToPar(last.toPar)})</div>` : ''}
        <div class="credits">Personal-use project. Course layouts are approximations of the real courses.</div>
      </div>`, 'main');
  }

  // ---------------- round setup ----------------
  startSetup(mode) {
    const s = this.profile.settings;
    this.setup = {
      mode, step: 0,
      golfer: PROS.some(x => x.id === this.setup?.golfer) ? this.setup.golfer : PROS[0].id,
      courseId: getCourse(s.lastCourse).id, teeId: s.lastTee || 'tour',
      difficulty: s.difficulty, wind: s.windSetting, pins: s.pins, nine: 'front', hole: 0, practiceKind: 'approach',
    };
    this.renderSetup();
  }

  renderSetup() {
    const st = this.setup;
    const steps = ['GOLFER', 'COURSE', 'SETUP'];
    const stepName = steps[st.step];
    let body = '';
    if (stepName === 'GOLFER') body = this.golferPicker();
    else if (stepName === 'COURSE') body = this.coursePicker();
    else body = this.setupOptions();
    const isLast = st.step === steps.length - 1;
    this.render(`
      <div class="setup">
        <div class="setup-head">
          <button class="btn ghost" id="back">‹ BACK</button>
          <div class="setup-title">${MODES[st.mode].name.toUpperCase()}<small>${MODES[st.mode].sub}</small></div>
          <div class="steps">${steps.map((n, i) => `<div class="step ${i === st.step ? 'on' : i < st.step ? 'done' : ''}">${i + 1}. ${n}</div>`).join('')}</div>
          <button class="btn primary" id="next">${isLast ? 'TEE IT UP ▸' : 'NEXT ▸'}</button>
        </div>
        <div class="setup-body">${body}</div>
      </div>`, 'setup-screen');
    $('#back', this.root).onclick = () => { audio.click(); if (st.step === 0) this.main(); else { st.step--; this.renderSetup(); } };
    $('#next', this.root).onclick = () => { audio.init(); audio.click(); if (isLast) this.launch(); else { st.step++; this.renderSetup(); } };
    this.bindSetup(stepName);
  }

  golferPicker() {
    const st = this.setup;
    const p = this.profile;
    const card = (id, name, sub, attrs, look, extra = '') => `
      <div class="golfer-card ${st.golfer === id ? 'sel' : ''}" data-golfer="${id}">
        <div class="gc-avatar" style="background:linear-gradient(160deg, ${lookColors(look)[0]}, ${lookColors(look)[1]})"><span>${esc(name.split(' ').map(w => w[0]).join('').slice(0, 2))}</span></div>
        <div class="gc-name">${esc(name)}</div><div class="gc-sub">${sub}</div>
        <div class="attr-bars">${[['PWR', attrs.power], ['ACC', attrs.accuracy ?? attrs.approach], ['SHT', attrs.shortGame], ['PUT', attrs.putting], ['REC', attrs.recovery]].map(([k, v]) => `<div><span>${k}</span><i><b style="width:${v}%"></b></i><em>${Math.round(v)}</em></div>`).join('')}</div>${extra}
      </div>`;
    let html = `<div class="section-title">CHOOSE YOUR PRO</div><div class="golfer-grid">`;
    for (const pro of PROS) html += card(pro.id, pro.name, pro.country, pro, { ...DEFAULT_LOOK, ...pro.look });
    html += '</div>';
    return html;
  }

  coursePicker() {
    const st = this.setup;
    const p = this.profile;
    let html = `<div class="course-grid">`;
    for (const c of COURSES) {
      const locked = c.unlock > p.level;
      const best = p.career.best[`${c.id}:18`];
      const thumb = this.app.thumbs[c.id];
      html += `<div class="course-card ${st.courseId === c.id ? 'sel' : ''} ${locked ? 'locked' : ''}" data-course="${c.id}" style="--accent:${c.accent}">
        <div class="cc-img" style="${thumb ? `background-image:url(${thumb})` : ''}">${thumb ? '' : '<div class="shimmer"></div>'}</div>
        <div class="cc-body">
          <div class="cc-name">${esc(c.short)}</div>
          <div class="cc-loc">${esc(c.location)}</div>
          <div class="cc-meta"><span>18 HOLES</span><span>PAR ${coursePar(c)}</span><span>${courseYards(c).toLocaleString()} YDS</span></div>
          <div class="cc-blurb">${esc(c.blurb)}</div>
          ${best ? `<div class="cc-best">BEST ${best.score} (${fmtToPar(best.toPar)})</div>` : ''}
        </div>
        ${locked ? `<div class="lock">🔒 UNLOCKS AT LEVEL ${c.unlock}</div>` : ''}
      </div>`;
    }
    html += '</div>';
    return html;
  }

  setupOptions() {
    const st = this.setup;
    const c = getCourse(st.courseId);
    const opt = (key, val, label, sub = '') => `<button class="opt ${st[key] === val ? 'on' : ''}" data-k="${key}" data-v="${val}"><b>${label}</b>${sub ? `<span>${sub}</span>` : ''}</button>`;
    let html = '';
    {
      html += `<div class="section-title">${esc(c.name.toUpperCase())}</div><div class="setup-course-banner" style="--accent:${c.accent}"><div class="scb-img" style="background-image:url(${this.app.thumbs[c.id] || ''})"></div><div><b>${esc(c.location)}</b><div>${esc(c.designer)}</div><div>Stimp ${c.stimp} · Firmness ${Math.round(c.firmness * 10)}/10 · Wind ${c.wind[0]}–${c.wind[1]} mph</div></div></div>`;
      html += `<div class="section-title">TEES</div><div class="opts">${TEE_SETS.map(t => opt('teeId', t.id, `<i class="tee-dot" style="background:${t.color}"></i>${t.name}`, `${courseYards(c, t.factor).toLocaleString()} yds`)).join('')}</div>`;
    }
    if (st.mode === 'round9') html += `<div class="section-title">NINE</div><div class="opts">${opt('nine', 'front', 'Front Nine', 'Holes 1–9')}${opt('nine', 'back', 'Back Nine', 'Holes 10–18')}</div>`;
    if (st.mode === 'coursePractice' || st.mode === 'practice') {
      html += `<div class="section-title">HOLE</div><div class="hole-grid">${c.holes.map((h, i) => `<button class="hole-btn ${st.hole === i ? 'on' : ''} ${h.sig ? 'sig' : ''}" data-hole="${i}"><b>${i + 1}</b><span>Par ${h.p} · ${h.y}</span>${h.name ? `<em>${esc(h.name)}</em>` : ''}</button>`).join('')}</div>`;
    }
    if (st.mode === 'practice') {
      html += `<div class="section-title">DRILL</div><div class="opts">${opt('practiceKind', 'approach', 'Approach', '90–180 yds, fairway')}${opt('practiceKind', 'chipping', 'Chipping', 'Around the green')}${opt('practiceKind', 'bunker', 'Bunker', 'Greenside sand')}${opt('practiceKind', 'putting', 'Putting', '6–40 ft')}${opt('practiceKind', 'tee', 'Tee Shot', 'From the tee box')}</div>`;
    }
    html += `<div class="section-title">DIFFICULTY</div><div class="opts">${Object.entries(DIFFICULTIES).map(([k, d]) => opt('difficulty', k, d.name, { easy: 'Big sweet spot, full assist', normal: 'Balanced', hard: 'Small window, less assist', realistic: 'Minimal assist, real dispersion' }[k])).join('')}</div>`;
    html += `<div class="section-title">CONDITIONS</div><div class="opts">${opt('wind', 'calm', 'Calm', 'Light breeze')}${opt('wind', 'normal', 'Normal Wind', 'Course typical')}${opt('wind', 'windy', 'Windy', 'Bring your low ball')}</div>`;
    html += `<div class="opts">${opt('pins', 'easy', 'Easy Pins', 'Center of greens')}${opt('pins', 'medium', 'Medium Pins')}${opt('pins', 'sunday', 'Sunday Pins', 'Tucked & tough')}</div>`;
    return html;
  }

  bindSetup(stepName) {
    const st = this.setup;
    this.root.querySelectorAll('[data-golfer]').forEach(e => e.onclick = () => { st.golfer = e.dataset.golfer; audio.click(); this.renderSetup(); });
    this.root.querySelectorAll('[data-course]').forEach(e => e.onclick = () => {
      const c = getCourse(e.dataset.course);
      if (c.unlock > this.profile.level) { audio.tick(false); return; }
      st.courseId = c.id; audio.click(); this.renderSetup();
    });
    this.root.querySelectorAll('.opt[data-k]').forEach(e => e.onclick = () => { st[e.dataset.k] = e.dataset.v; audio.click(); this.renderSetup(); });
    this.root.querySelectorAll('[data-hole]').forEach(e => e.onclick = () => { st.hole = +e.dataset.hole; audio.click(); this.renderSetup(); });
    if (stepName === 'COURSE') this.app.ensureThumbs(() => { if (this.setup && this.root.querySelector('.course-grid')) this.refreshThumbs(); });
  }

  refreshThumbs() {
    this.root.querySelectorAll('.course-card').forEach(card => {
      const t = this.app.thumbs[card.dataset.course];
      const img = card.querySelector('.cc-img');
      if (t && !img.style.backgroundImage) { img.style.backgroundImage = `url(${t})`; img.innerHTML = ''; }
    });
  }

  launch() {
    const st = this.setup;
    const p = this.profile;
    p.settings.lastCourse = st.courseId; p.settings.lastTee = st.teeId;
    p.settings.difficulty = st.difficulty; p.settings.windSetting = st.wind; p.settings.pins = st.pins;
    this.app.save();
    const pro = proById(st.golfer);
    const attrs = proAttrs(pro), look = proLook(pro), name = pro.name;
    let holes = [...Array(18).keys()];
    if (st.mode === 'round9') holes = st.nine === 'front' ? holes.slice(0, 9) : holes.slice(9);
    if (st.mode === 'coursePractice' || st.mode === 'practice') holes = [st.hole];
    const cfg = {
      mode: st.mode, courseId: st.courseId, teeId: st.teeId, holes,
      difficulty: st.difficulty, attrs, look, golferName: name, practiceKind: st.practiceKind,
    };
    this.app.startRound(cfg);
  }

  // ---------------- the Masters ----------------
  mastersBoardFor(m) {
    if (!m) return '';
    const last = m.finished ? (m.result?.pos === 'MC' ? 2 : 4) : m.round - 1;
    if (last < 1) return '';
    const rows = leaderboard(m, last, 18, m.player.rounds[last - 1] || []);
    return boardHtml(rows, { limit: 14, title: m.finished ? 'FINAL LEADERBOARD' : `AFTER ROUND ${last}`, cutLine: !m.finished && last === 1 ? projectedCut(rows) : null });
  }

  masters() {
    const p = this.profile;
    const m = p.masters;
    const active = m && !m.finished;
    const days = ROUND_DAYS.map((d, i) => {
      const n = i + 1;
      const st = !m ? '' : (m.player.rounds[i] ? 'done' : active && m.round === n ? 'now' : '');
      const sc = m?.player.rounds[i] ? fmtPar(m.player.rounds[i].reduce((a, s, k) => a + s - m.pars[k], 0)) : '';
      return `<div class="md ${st}"><b>${d}</b><span>${sc || `ROUND ${n}`}</span></div>`;
    }).join('');
    const diffChips = Object.entries(DIFFICULTIES).map(([k, d]) => `<button class="chip ${(this.mDiff || p.settings.difficulty) === k ? 'on' : ''}" data-mdiff="${k}">${d.name}</button>`).join('');
    const hist = (p.mastersHistory || []).slice(0, 5).map(h => `<tr><td>${new Date(h.date).toLocaleDateString()}</td><td><b>${h.pos === '1' ? '🏆 WON' : h.pos}</b></td><td>${fmtPar(h.toPar)}</td><td class="dim">${h.won ? '' : esc(h.champion || '')}</td></tr>`).join('');
    let side;
    if (active) {
      const tot = m.player.rounds.reduce((a, r) => a + r.reduce((x, s, k) => x + s - m.pars[k], 0), 0);
      side = `<div class="section-title">${ROUND_DAYS[m.round - 1]} · ROUND ${m.round}</div>
        <div class="m-status"><div><span>YOUR TOTAL</span><b>${fmtPar(tot)}</b></div><div><span>DIFFICULTY</span><b>${DIFFICULTIES[m.difficulty]?.name || ''}</b></div><div><span>PINS</span><b>${m.round === 4 ? 'Sunday' : 'Tournament'}</b></div></div>
        <button class="btn primary big m-tee" id="m-tee">TEE OFF · ROUND ${m.round} ▸</button>
        <div class="m-note">Championship tees. Each round is 18 holes; the leaderboard moves as you play. Quitting a round restarts that round.</div>
        <button class="btn danger small" id="m-abandon">WITHDRAW FROM TOURNAMENT</button>`;
    } else {
      side = `${m?.finished ? `<div class="m-final ${m.result.won ? 'won' : ''}">${m.result.won ? 'MASTERS CHAMPION' : m.result.pos === 'MC' ? 'MISSED THE CUT' : `FINISHED ${m.result.pos}`}<small>${fmtPar(m.result.toPar)}${m.result.won ? '' : m.result.champion ? ` · Champion ${esc(m.result.champion)} ${fmtPar(m.result.winningScore)}` : ''}</small></div>` : ''}
        <div class="section-title">NEW TOURNAMENT</div>
        <div class="m-note">Four rounds at Augusta National from the championship tees against a field of ${51} of the world's best. Low 30 and ties make the cut after Friday. Sunday brings the toughest pins. Win and the Green Jacket is yours.</div>
        <div class="set-row"><div><b>Your pro</b></div><div class="chips">${PROS.filter(x => x.id !== 'korda').map(x => `<button class="chip ${(this.mPro || 'scheffler') === x.id ? 'on' : ''}" data-mpro="${x.id}">${esc(x.name)}</button>`).join('')}</div></div>
        <div class="set-row"><div><b>Difficulty</b></div><div class="chips">${diffChips}</div></div>
        <button class="btn primary big m-tee" id="m-start">START THE MASTERS ▸</button>`;
    }
    this.render(`
      <div class="page masters-page">
        <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button></div>
        <div class="m-hero">
          <div class="m-logo">The Masters</div>
          <div class="m-sub">AUGUSTA NATIONAL GOLF CLUB · AUGUSTA, GEORGIA</div>
          <div class="m-days">${days}</div>
          ${p.mastersWins ? `<div class="m-wins">🏆 ${p.mastersWins} Green Jacket${p.mastersWins > 1 ? 's' : ''}</div>` : ''}
        </div>
        <div class="cols two">
          <div class="col">${this.mastersBoardFor(m) || `<div class="mboard intro"><div class="mb-head"><span>THE FIELD</span></div><div class="m-field">${['Scottie Scheffler', 'Rory McIlroy', 'Jon Rahm', 'Bryson DeChambeau', 'Xander Schauffele', 'Ludvig Åberg', 'Collin Morikawa', 'Hideki Matsuyama', 'Jordan Spieth', 'Tiger Woods', 'Brooks Koepka', 'Tommy Fleetwood'].map(n => `<span>${n}</span>`).join('')}<span class="dim">…and 39 more</span></div></div>`}</div>
          <div class="col glass m-side">${side}${hist ? `<div class="section-title">PAST MASTERS</div><table class="list">${hist}</table>` : ''}</div>
        </div>
      </div>`, 'page-screen masters-screen');
    this.root.querySelectorAll('[data-mpro]').forEach(b => b.onclick = () => { this.mPro = b.dataset.mpro; audio.click(); this.masters(); });
    this.root.querySelectorAll('[data-mdiff]').forEach(b => b.onclick = () => { this.mDiff = b.dataset.mdiff; audio.click(); this.masters(); });
    const start = $('#m-start', this.root);
    if (start) start.onclick = () => {
      audio.init(); audio.click();
      const course = getCourse('augusta');
      const pro = proById(this.mPro || 'scheffler');
      p.masters = newTournament(course, this.mDiff || p.settings.difficulty, pro.name, pro.id);
      this.app.save();
      this.startMastersRound();
    };
    const tee = $('#m-tee', this.root);
    if (tee) tee.onclick = () => { audio.init(); audio.click(); this.startMastersRound(); };
    const ab = $('#m-abandon', this.root);
    if (ab) ab.onclick = () => {
      if (!ab.dataset.armed) { ab.dataset.armed = '1'; ab.textContent = 'TAP AGAIN TO WITHDRAW'; setTimeout(() => { if (ab.isConnected) { delete ab.dataset.armed; ab.textContent = 'WITHDRAW FROM TOURNAMENT'; } }, 3000); return; }
      p.masters = null; this.app.save(); this.masters();
    };
  }

  startMastersRound() {
    const p = this.profile;
    const m = p.masters;
    if (!m || m.finished) return;
    this.app.startRound({
      mode: 'round18', courseId: 'augusta', teeId: 'champ', holes: [...Array(18).keys()],
      difficulty: m.difficulty, attrs: proAttrs(proById(m.proId)), look: proLook(proById(m.proId)), golferName: m.playerName,
      masters: { round: m.round }, pins: m.round === 4 ? 'sunday' : 'medium', wind: 'normal',
    });
  }

  mastersAfterRound(played, st, award, result, scorecard) {
    const p = this.profile;
    const m = p.masters;
    const rows = leaderboard(m, played, 18, m.player.rounds[played - 1]);
    const me = rows.find(r => r.isPlayer);
    if (result?.won) return this.mastersCeremony(result, rows);
    let headline, sub;
    if (result?.pos === 'MC') { headline = 'MISSED THE CUT'; sub = `The cut fell at ${fmtPar(m.cutLine)}. You finished at ${fmtPar(result.toPar)}.`; }
    else if (result) { headline = `FINISHED ${result.pos}`; sub = `${esc(result.champion)} wins the Masters at ${fmtPar(result.winningScore)}.`; }
    else if (played === 2) { headline = 'MADE THE CUT'; sub = `${me.posN === 1 ? (me.pos.startsWith('T') ? 'You share the lead' : 'You lead') : `You're ${me.pos}`} at ${fmtPar(me.toPar)}. The cut fell at ${fmtPar(m.cutLine)}. On to the weekend.`; }
    else { headline = me.posN === 1 ? `${me.pos.startsWith('T') ? 'TIED FOR THE LEAD' : 'LEADING'} AFTER ${played === 1 ? 'THURSDAY' : 'SATURDAY'}` : `${me.pos} AFTER ${played === 1 ? 'THURSDAY' : 'SATURDAY'}`; sub = `${fmtPar(me.toPar)} for the tournament. ${played === 3 ? 'Sunday at Augusta awaits.' : ''}`; }
    this.render(`
      <div class="page masters-page">
        <div class="m-hero small"><div class="m-logo">The Masters</div><div class="m-sub">${ROUND_DAYS[played - 1]} · ROUND ${played} · YOU SHOT ${st.strokes} (${fmtPar(st.toPar)})</div></div>
        <div class="m-final ${result?.pos === 'MC' ? 'mc' : ''}">${headline}<small>${sub}</small></div>
        ${award ? `<div class="center dim">+${award.xp} XP${award.levelUps.length ? ` · LEVEL UP → ${award.to}` : ''}</div>` : ''}
        <div class="cols two">
          <div class="col">${boardHtml(rows, { limit: 14, title: result ? 'FINAL LEADERBOARD' : `LEADERBOARD · AFTER ROUND ${played}` })}</div>
          <div class="col glass sc-wrap">${scorecard}</div>
        </div>
        <div class="center">${!m.finished ? `<button class="btn primary big" id="m-next">TEE OFF · ${ROUND_DAYS[m.round - 1]} ▸</button> ` : ''}<button class="btn big" id="m-hub">MASTERS HOME</button> <button class="btn big" data-go="main">MAIN MENU</button></div>
      </div>`, 'page-screen masters-screen');
    const n = $('#m-next', this.root); if (n) n.onclick = () => { audio.click(); this.startMastersRound(); };
    $('#m-hub', this.root).onclick = () => { audio.click(); this.masters(); };
    audio.jingle(result?.pos === 'MC' ? 'bogey' : 'great');
  }

  mastersCeremony(result, rows) {
    const p = this.profile;
    // put the champion in the Green Jacket for the ceremony
    const look = proLook(proById(p.masters.proId));
    look.outfit.top = { id: GREEN_JACKET.id, color: GREEN_JACKET.fixedColor, pattern: 'solid' };
    this.render(`
      <div class="m-ceremony">
        <div class="mc-card">
          <div class="m-logo">The Masters</div>
          <div class="mc-title">MASTERS CHAMPION</div>
          <div class="mc-name">${esc(p.masters.playerName)}</div>
          <div class="mc-score">${fmtPar(result.toPar)}${result.playoff ? ` · won a playoff against ${esc(result.playoff.against.join(', '))}` : ''}</div>
          <div class="mc-jacket">Slip on the Green Jacket.</div>
          ${boardHtml(rows, { limit: 5, title: 'FINAL LEADERBOARD', highlight: false })}
          <div class="mc-btns"><button class="btn primary" id="m-hub">MASTERS HOME</button></div>
        </div>
      </div>`, 'page-screen transparent masters-ceremony');
    this.app.golferPreview(look, { focus: 'full', yaw: 0.25 });
    audio.jingle('ace'); audio.crowd?.('roar', 1.2);
    $('#m-hub', this.root).onclick = () => { audio.click(); this.app.menuScene(); this.masters(); };
  }

  // ---------------- career ----------------
  career() {
    const p = this.profile;
    const c = p.career;
    const need = LEVEL_XP(p.level);
    const pct = (a, b) => b ? `${Math.round(a / b * 100)}%` : '—';
    const unlocks = [];
    for (let lv = p.level + 1; lv <= p.level + 6; lv++) {
      const items = unlocksAt(lv);
      if (items.length) unlocks.push(`<div class="unl"><b>LEVEL ${lv}</b>${items.map(i => `<span>${esc(i)}</span>`).join('')}</div>`);
    }
    const bests = Object.entries(c.best).map(([k, v]) => { const [cid, holes] = k.split(':'); return `<tr><td>${esc(getCourse(cid).short)}</td><td>${holes}</td><td><b>${v.score}</b></td><td>${fmtToPar(v.toPar)}</td><td>${esc(v.golfer || '')}</td></tr>`; }).join('');
    const hist = p.history.slice(0, 10).map(h => `<tr><td>${new Date(h.date).toLocaleDateString()}</td><td>${esc(COURSES.find(c => c.id === h.course)?.short || h.course)}</td><td>${h.holes}</td><td><b>${h.score}</b></td><td>${fmtToPar(h.toPar)}</td><td>${esc(h.golfer || '')}</td></tr>`).join('');
    this.render(`
      <div class="page">
        <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">CAREER</div></div>
        <div class="career-top glass">
          <div class="lvl-big">${p.level}<small>LEVEL</small></div>
          <div class="lvl-info"><div class="xpbar big"><i style="width:${p.xp / need * 100}%"></i></div><div>${p.xp} / ${need} XP to level ${p.level + 1}</div>
</div>
        </div>
        <div class="cols">
          <div class="col glass"><div class="section-title">CAREER STATS</div>
            <div class="stat-grid">
              ${[['Rounds', c.rounds], ['Holes', c.holes], ['Scoring avg (18)', c.rounds18 ? (c.score18Sum / c.rounds18).toFixed(1) : '—'],
                ['Fairways hit', pct(c.fairways, c.fairwayChances)], ['Greens in reg.', pct(c.gir, c.girChances)], ['Putts / hole', c.puttHoles ? (c.putts / c.puttHoles).toFixed(2) : '—'],
                ['Avg drive', c.drives ? `${Math.round(c.driveSum / c.drives)} yds` : '—'], ['Longest drive', c.longestDrive ? `${Math.round(c.longestDrive)} yds` : '—'], ['Longest putt', c.longestPutt ? `${Math.round(c.longestPutt)} ft` : '—'],
                ['Aces', c.aces], ['Eagles', c.eagles], ['Birdies', c.birdies], ['Pars', c.pars], ['Bogeys', c.bogeys], ['Double+', c.doubles + c.worse],
                ['Sand saves', `${c.sandSaves}/${c.sandChances}`], ['Up & downs', `${c.upDowns}/${c.upDownChances}`], ['Penalties', c.penalties]]
                .map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}
            </div>
            <div class="section-title">BEST ROUNDS</div>
            <table class="list">${bests || '<tr><td class="dim">No rounds yet — get out there!</td></tr>'}</table>
            <div class="section-title">RECENT</div>
            <table class="list">${hist || '<tr><td class="dim">—</td></tr>'}</table>
          </div>
          <div class="col glass"><div class="section-title">UPCOMING UNLOCKS</div>${unlocks.join('') || '<div class="dim">Everything unlocked!</div>'}</div>
        </div>
      </div>`, 'page-screen');
  }

  // ---------------- bag ----------------
  bag() {
    const p = this.profile;
    const lvl = p.level;
    const bag = buildBag(p.bag, p.equipment, customAttrs(p));
    const slot = (cat, label) => `<div class="cust-row"><label>${label}</label><div class="chips">${BRAND_MODELS[cat].map(m => `<button class="chip ${p.equipment[cat] === m.id ? 'on' : ''} ${m.unlock > lvl ? 'locked' : ''}" data-eq="${cat}" data-val="${m.id}">${esc(m.brand)} <b>${esc(m.model)}</b>${m.unlock > lvl ? ` 🔒${m.unlock}` : ''}</button>`).join('')}</div></div>`;
    this.render(`
      <div class="page">
        <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">MY BAG</div><div class="bag-count">${p.bag.length}/14 CLUBS</div></div>
        <div class="cols two">
          <div class="col glass">
            <div class="section-title">CLUBS IN BAG <small>(max 14, putter required)</small></div>
            <div class="club-toggle">${CLUB_TYPES.map(c => `<button class="chip ${p.bag.includes(c.id) ? 'on' : ''}" data-club="${c.id}" ${c.id === 'PT' ? 'disabled' : ''}>${c.name}</button>`).join('')}</div>
            <div class="section-title">EQUIPMENT</div>
            ${slot('wood', 'Woods')}${slot('hybrid', 'Hybrids')}${slot('iron', 'Irons')}${slot('wedge', 'Wedges')}${slot('putter', 'Putter')}
            <div class="cust-row"><label>Golf ball</label><div class="chips">${BALLS.map(b => `<button class="chip ${p.equipment.ball === b.id ? 'on' : ''} ${b.unlock > lvl ? 'locked' : ''}" data-eq="ball" data-val="${b.id}">${esc(b.brand)} <b>${esc(b.model)}</b>${b.unlock > lvl ? ` 🔒${b.unlock}` : ''}</button>`).join('')}</div></div>
          </div>
          <div class="col glass">
            <div class="section-title">YARDAGES <small>(tour-average player)</small></div>
            <table class="list yardage">
              <tr class="hdr"><td>CLUB</td><td>MODEL</td><td>CARRY</td><td>LAUNCH</td><td>SPIN</td><td>ACCURACY</td></tr>
              ${bag.map(c => `<tr><td><b>${c.name}</b></td><td class="dim">${esc(c.brand)} ${esc(c.model)}</td><td><b>${c.cat === 'putter' ? '—' : Math.round(c.carry)}</b></td><td>${c.cat === 'putter' ? '—' : c.launch.toFixed(1) + '°'}</td><td>${c.cat === 'putter' ? '—' : Math.round(c.spin)}</td><td><div class="minibar"><i style="width:${c.accuracy * 100}%"></i></div></td></tr>`).join('')}
            </table>
          </div>
        </div>
      </div>`, 'page-screen');
    this.root.querySelectorAll('[data-club]').forEach(b => b.onclick = () => {
      const id = b.dataset.club;
      if (id === 'PT') return;
      const i = p.bag.indexOf(id);
      if (i >= 0) { if (p.bag.length > 2) p.bag.splice(i, 1); }
      else if (p.bag.length < 14) p.bag.push(id);
      else { audio.tick(false); return; }
      this.app.save(); audio.click(); this.bag();
    });
    this.root.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => {
      if (b.classList.contains('locked')) { audio.tick(false); return; }
      p.equipment[b.dataset.eq] = b.dataset.val; this.app.save(); audio.click(); this.bag();
    });
  }

  // ---------------- settings ----------------
  settings() {
    const s = this.profile.settings;
    const tog = (k, label, sub) => `<div class="set-row"><div><b>${label}</b><span>${sub}</span></div><button class="toggle ${s[k] ? 'on' : ''}" data-tog="${k}"><i></i></button></div>`;
    const slider = (k, label) => `<div class="set-row"><div><b>${label}</b></div><input type="range" min="0" max="1" step="0.05" value="${s[k]}" data-vol="${k}"></div>`;
    this.render(`
      <div class="page narrow">
        <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">SETTINGS</div></div>
        <div class="col glass">
          <div class="section-title">GAMEPLAY</div>
          <div class="set-row"><div><b>Default difficulty</b><span>Timing window, dispersion, assists</span></div><div class="chips">${Object.entries(DIFFICULTIES).map(([k, d]) => `<button class="chip ${s.difficulty === k ? 'on' : ''}" data-diff="${k}">${d.name}</button>`).join('')}</div></div>
          ${tog('puttGuide', 'Putting guide', 'Break preview line & slope arrows (G in game)')}
          ${tog('landingMarker', 'Landing marker', 'Show predicted carry & landing circle')}
          ${tog('tracer', 'Shot tracer', 'TV-style ball flight trail')}
          ${tog('flyover', 'Hole flyover', 'Preview each hole from the air')}
          ${tog('autoCamera', 'Broadcast camera', 'Automatic follow & landing cameras')}
          <div class="set-row"><div><b>Graphics quality</b><span>Lower it if the game stutters</span></div><div class="chips">${[['auto', 'Auto'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']].map(([k, n]) => `<button class="chip ${(s.quality || 'auto') === k ? 'on' : ''}" data-q="${k}">${n}</button>`).join('')}</div></div>
          <div class="section-title">AUDIO</div>
          ${slider('master', 'Master volume')}${slider('sfx', 'Effects')}${slider('amb', 'Ambience')}
          <div class="section-title">DATA</div>
          <div class="set-row"><div><b>Reset progress</b><span>Deletes your golfer, XP, stats and unlocks</span></div><button class="btn danger" id="reset">RESET</button></div>
        </div>
        <div class="controls-help glass">
          <div class="section-title">CONTROLS</div>
          <table class="list">
            <tr><td><kbd>Space</kbd> hold</td><td>Backswing — power meter fills</td></tr>
            <tr><td><kbd>Space</kbd> release</td><td>Start downswing</td></tr>
            <tr><td><kbd>Space</kbd> tap</td><td>Strike when the marker crosses the green sweet spot. Early = pull/hook, late = push/slice</td></tr>
            <tr><td><kbd>←</kbd> <kbd>→</kbd></td><td>Aim (hold to accelerate)</td></tr>
            <tr><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>Change club · putting: change putt length scale</td></tr>
            <tr><td><kbd>X</kbd></td><td>Cycle shot type (Normal, Punch, Chip, Pitch, Lob, Flop, Bunker)</td></tr>
            <tr><td><kbd>Q</kbd> / <kbd>E</kbd></td><td>Draw / Fade</td></tr><tr><td><kbd>T</kbd></td><td>Trajectory low / mid / high</td></tr>
            <tr><td><kbd>I J K L</kbd></td><td>Strike point: topspin / backspin / sidespin</td></tr>
            <tr><td><kbd>R</kbd></td><td>Aim straight at the pin</td></tr>
            <tr><td><kbd>C</kbd> / <kbd>M</kbd></td><td>Cycle camera / overhead map · click minimap to aim</td></tr>
            <tr><td>Mouse drag / wheel</td><td>Look around / scout ahead along the aim line</td></tr>
            <tr><td><kbd>Tab</kbd> · <kbd>Esc</kbd></td><td>Scorecard · pause menu</td></tr>
          </table>
        </div>
      </div>`, 'page-screen');
    this.root.querySelectorAll('[data-tog]').forEach(b => b.onclick = () => { s[b.dataset.tog] = !s[b.dataset.tog]; this.app.save(); audio.click(); this.settings(); });
    this.root.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { s.quality = b.dataset.q; this.app.world.setQuality(this.app.qualityFor(s.quality)); this.app.save(); audio.click(); this.settings(); });
    this.root.querySelectorAll('[data-diff]').forEach(b => b.onclick = () => { s.difficulty = b.dataset.diff; this.app.save(); audio.click(); this.settings(); });
    this.root.querySelectorAll('[data-vol]').forEach(r => r.oninput = () => { s[r.dataset.vol] = +r.value; audio.setVolumes({ [r.dataset.vol]: +r.value }); this.app.save(); });
    const rb = $('#reset', this.root);
    rb.onclick = () => {
      if (!rb.dataset.armed) { rb.dataset.armed = '1'; rb.textContent = 'TAP AGAIN TO RESET'; setTimeout(() => { if (rb.isConnected) { delete rb.dataset.armed; rb.textContent = 'RESET'; } }, 3000); return; }
      this.app.profile = resetProfile(); this.app.save(); this.main();
    };
  }

  // ---------------- results ----------------
  results(round, st, award, cfg, hudScorecard) {
    const pct = (a, b) => b ? `${a}/${b} (${Math.round(a / b * 100)}%)` : '—';
    const c = getCourse(round.courseId);
    this.render(`
      <div class="page">
        <div class="page-head"><div class="page-title">ROUND COMPLETE<small>${esc(c.name)} · ${esc(round.golferName)}</small></div></div>
        <div class="result-hero glass">
          <div class="rh-score">${st.strokes}<small>SCORE</small></div>
          <div class="rh-par ${st.toPar < 0 ? 'under' : st.toPar > 0 ? 'over' : ''}">${fmtToPar(st.toPar)}<small>TO PAR</small></div>
          ${award ? `<div class="rh-xp"><b>+${award.xp} XP</b>${award.levelUps.length ? `<div class="lvlup">LEVEL UP! → ${award.to}</div><div class="unl">${award.levelUps.flatMap(unlocksAt).map(i => `<span>${esc(i)}</span>`).join('')}</div>` : ''}<div class="xpbar big"><i style="width:${this.profile.xp / LEVEL_XP(this.profile.level) * 100}%"></i></div></div>` : '<div class="rh-xp dim">Tour pro round · no XP</div>'}
        </div>
        <div class="glass sc-wrap">${hudScorecard}</div>
        <div class="glass"><div class="section-title">STATISTICS</div><div class="stat-grid wide">
          ${[['Fairways hit', pct(st.fairways, st.fairwayChances)], ['Greens in regulation', pct(st.gir, st.girChances)], ['Total putts', st.putts], ['Putts per hole', (st.putts / Math.max(1, st.holes)).toFixed(2)],
            ['Avg driving distance', st.drives ? `${Math.round(st.driveSum / st.drives)} yds` : '—'], ['Longest drive', st.longestDrive ? `${Math.round(st.longestDrive)} yds` : '—'], ['Longest putt made', st.longestPutt ? `${Math.round(st.longestPutt)} ft` : '—'],
            ['Eagles', st.eagles + st.albatross + st.aces], ['Birdies', st.birdies], ['Pars', st.pars], ['Bogeys', st.bogeys], ['Double bogey+', st.doubles + st.worse],
            ['Sand saves', pct(st.sandSaves, st.sandChances)], ['Up & downs', pct(st.upDowns, st.upDownChances)], ['Penalty strokes', st.penalties],
            ['Scoring average (career)', this.profile.career.rounds18 ? (this.profile.career.score18Sum / this.profile.career.rounds18).toFixed(1) : '—']]
            .map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}
        </div></div>
        <div class="center"><button class="btn primary big" data-go="main">CONTINUE ▸</button> <button class="btn big" id="again">PLAY AGAIN</button></div>
      </div>`, 'page-screen');
    $('#again', this.root).onclick = () => this.app.startRound(cfg);
    if (award && award.levelUps.length) audio.jingle('unlock');
  }
}
