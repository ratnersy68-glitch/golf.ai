// Front-end menus: main menu, round setup (golfer/course/tees), career,
// golfer customization, bag, settings, practice and results.
import { COURSES, TEE_SETS, coursePar, courseYards, getCourse } from '../data/courses.js';
import { PROS, SKIN_TONES, HAIR_STYLES, HAIR_COLORS, PALETTE, HATS, SHIRTS, LEGS, SHOES, GLOVES, ACCESSORIES, proAttrs, DEFAULT_LOOK } from '../data/golfers.js';
import { CLUB_TYPES, BRAND_MODELS, BALLS, buildBag } from '../data/clubs.js';
import { DIFFICULTIES, LEVEL_XP, customAttrs, resetProfile } from '../core/profile.js';
import { audio } from '../audio/audio.js';

const $ = (sel, root = document) => root.querySelector(sel);
const fmtToPar = (v) => v === 0 ? 'E' : v > 0 ? `+${v}` : `${v}`;
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const MODES = {
  round18: { name: 'Quick Round', sub: '18 holes · full round' },
  round9: { name: '9 Holes', sub: 'Front or back nine' },
  coursePractice: { name: 'Course Practice', sub: 'Pick any hole and replay it' },
  practice: { name: 'Practice', sub: 'Chipping · bunker · putting · approach' },
  range: { name: 'Driving Range', sub: 'Launch monitor · test every club' },
};

export function unlocksAt(lv) {
  return [
    ...COURSES.filter(x => x.unlock === lv).map(x => `⛳ ${x.short}`),
    ...Object.values(BRAND_MODELS).flat().filter(x => x.unlock === lv).map(x => `🏌 ${x.brand} ${x.model}`),
    ...BALLS.filter(x => x.unlock === lv).map(x => `⚪ ${x.brand} ${x.model}`),
    ...[...HATS, ...SHIRTS, ...LEGS, ...SHOES, ...GLOVES, ...ACCESSORIES].filter(x => x.unlock === lv).map(x => `👕 ${x.name}`),
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
      case 'golfer': return this.golfer();
      case 'bag': return this.bag();
      case 'settings': return this.settings();
      case 'stats': return this.career();
      default:
        if (MODES[where]) return this.startSetup(where);
    }
  }

  profileBadge() {
    const p = this.profile;
    const need = LEVEL_XP(p.level);
    return `<div class="badge glass">
      <div class="avatar" style="background:${p.look.shirt}">${esc((p.look.name || 'Y')[0])}</div>
      <div><div class="b-name">${esc(p.look.name)}</div><div class="b-lvl">LEVEL ${p.level}${p.skillPoints ? ` · <span class="pts">${p.skillPoints} skill pts</span>` : ''}</div>
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
          <button class="menu-item" data-go="round9"><b>9 HOLES</b><span>${MODES.round9.sub}</span></button>
          <button class="menu-item" data-go="coursePractice"><b>COURSE PRACTICE</b><span>${MODES.coursePractice.sub}</span></button>
          <button class="menu-item" data-go="practice"><b>PRACTICE</b><span>${MODES.practice.sub}</span></button>
          <button class="menu-item" data-go="range"><b>DRIVING RANGE</b><span>${MODES.range.sub}</span></button>
          <div class="menu-split">
            <button class="menu-item small" data-go="career"><b>CAREER</b><span>Skills · stats · unlocks</span></button>
            <button class="menu-item small" data-go="golfer"><b>MY GOLFER</b><span>Customize</span></button>
            <button class="menu-item small" data-go="bag"><b>MY BAG</b><span>Clubs & ball</span></button>
            <button class="menu-item small" data-go="settings"><b>SETTINGS</b><span>Difficulty · audio</span></button>
          </div>
        </div>
        ${last ? `<div class="last-round glass">LAST ROUND · ${esc(getCourse(last.course).short)} · ${last.holes} holes · <b>${last.score}</b> (${fmtToPar(last.toPar)})</div>` : ''}
        <div class="credits">Personal-use project. Course layouts are approximations of the real courses.</div>
      </div>`, 'main');
  }

  // ---------------- round setup ----------------
  startSetup(mode) {
    const s = this.profile.settings;
    this.setup = {
      mode, step: mode === 'range' ? 0 : 0,
      golfer: this.setup?.golfer || 'custom',
      courseId: s.lastCourse || 'augusta', teeId: s.lastTee || 'tour',
      difficulty: s.difficulty, wind: s.windSetting, pins: s.pins, nine: 'front', hole: 0, practiceKind: 'approach',
    };
    this.renderSetup();
  }

  renderSetup() {
    const st = this.setup;
    const steps = st.mode === 'range' ? ['GOLFER', 'SETUP'] : ['GOLFER', 'COURSE', 'SETUP'];
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
        <div class="gc-avatar" style="background:linear-gradient(160deg, ${look.shirt}, ${look.pants})"><span>${esc(name.split(' ').map(w => w[0]).join('').slice(0, 2))}</span></div>
        <div class="gc-name">${esc(name)}</div><div class="gc-sub">${sub}</div>
        <div class="attr-bars">${[['PWR', attrs.power], ['ACC', attrs.accuracy ?? attrs.approach], ['SHT', attrs.shortGame], ['PUT', attrs.putting], ['REC', attrs.recovery]].map(([k, v]) => `<div><span>${k}</span><i><b style="width:${v}%"></b></i><em>${Math.round(v)}</em></div>`).join('')}</div>${extra}
      </div>`;
    const ca = customAttrs(p);
    let html = `<div class="section-title">YOUR GOLFER</div><div class="golfer-grid">`;
    html += card('custom', p.look.name, `Career golfer · Level ${p.level}`, { power: ca.power, accuracy: ca.approach, shortGame: ca.shortGame, putting: ca.putting, recovery: ca.recovery }, p.look, '<div class="gc-tag">EARNS XP</div>');
    html += `</div><div class="section-title">TOUR PROS</div><div class="golfer-grid">`;
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
    if (st.mode !== 'range') {
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
    if (st.mode !== 'range') html += `<div class="opts">${opt('pins', 'easy', 'Easy Pins', 'Center of greens')}${opt('pins', 'medium', 'Medium Pins')}${opt('pins', 'sunday', 'Sunday Pins', 'Tucked & tough')}</div>`;
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
    let attrs, look, name;
    if (st.golfer === 'custom') { attrs = customAttrs(p); look = p.look; name = p.look.name; }
    else {
      const pro = PROS.find(x => x.id === st.golfer);
      attrs = proAttrs(pro); look = { ...DEFAULT_LOOK, ...pro.look, name: pro.name }; name = pro.name;
    }
    let holes = [...Array(18).keys()];
    if (st.mode === 'round9') holes = st.nine === 'front' ? holes.slice(0, 9) : holes.slice(9);
    if (st.mode === 'coursePractice' || st.mode === 'practice') holes = [st.hole];
    const cfg = {
      mode: st.mode, courseId: st.mode === 'range' ? 'range' : st.courseId, teeId: st.teeId, holes: st.mode === 'range' ? [0] : holes,
      difficulty: st.difficulty, attrs, look, golferName: name, custom: st.golfer === 'custom', practiceKind: st.practiceKind,
    };
    this.app.startRound(cfg);
  }

  // ---------------- career ----------------
  career() {
    const p = this.profile;
    const c = p.career;
    const need = LEVEL_XP(p.level);
    const pct = (a, b) => b ? `${Math.round(a / b * 100)}%` : '—';
    const skill = (k, label, desc) => `<div class="skill"><div class="sk-head"><b>${label}</b><span>${Math.round(p.skills[k])}</span></div>
      <div class="sk-bar"><i style="width:${p.skills[k]}%"></i></div><div class="sk-desc">${desc}</div>
      <button class="btn small" data-skill="${k}" ${p.skillPoints && p.skills[k] < 99 ? '' : 'disabled'}>+ UPGRADE</button></div>`;
    const unlocks = [];
    for (let lv = p.level + 1; lv <= p.level + 6; lv++) {
      const items = unlocksAt(lv);
      if (items.length) unlocks.push(`<div class="unl"><b>LEVEL ${lv}</b>${items.map(i => `<span>${esc(i)}</span>`).join('')}</div>`);
    }
    const bests = Object.entries(c.best).map(([k, v]) => { const [cid, holes] = k.split(':'); return `<tr><td>${esc(getCourse(cid).short)}</td><td>${holes}</td><td><b>${v.score}</b></td><td>${fmtToPar(v.toPar)}</td><td>${esc(v.golfer || '')}</td></tr>`; }).join('');
    const hist = p.history.slice(0, 10).map(h => `<tr><td>${new Date(h.date).toLocaleDateString()}</td><td>${esc(getCourse(h.course).short)}</td><td>${h.holes}</td><td><b>${h.score}</b></td><td>${fmtToPar(h.toPar)}</td><td>${esc(h.golfer || '')}</td></tr>`).join('');
    this.render(`
      <div class="page">
        <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">CAREER</div></div>
        <div class="career-top glass">
          <div class="lvl-big">${p.level}<small>LEVEL</small></div>
          <div class="lvl-info"><div class="xpbar big"><i style="width:${p.xp / need * 100}%"></i></div><div>${p.xp} / ${need} XP to level ${p.level + 1}</div>
          <div class="pts-left">${p.skillPoints} skill point${p.skillPoints === 1 ? '' : 's'} available</div></div>
        </div>
        <div class="cols">
          <div class="col glass"><div class="section-title">SKILLS</div>
            ${skill('driving', 'DRIVING', 'Distance & accuracy with woods')}
            ${skill('approach', 'APPROACH', 'Iron accuracy & sweet spot')}
            ${skill('shortGame', 'SHORT GAME', 'Wedges, chips, pitches, bunkers')}
            ${skill('putting', 'PUTTING', 'Stroke consistency on the greens')}
            ${skill('recovery', 'RECOVERY', 'Less penalty from rough, sand, straw')}
          </div>
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
    this.root.querySelectorAll('[data-skill]').forEach(b => b.onclick = () => {
      const k = b.dataset.skill;
      if (p.skillPoints > 0 && p.skills[k] < 99) { p.skillPoints--; p.skills[k] = Math.min(99, p.skills[k] + 3); this.app.save(); audio.jingle('great'); this.career(); }
    });
  }

  // ---------------- golfer customization ----------------
  golfer() {
    const p = this.profile;
    const L = p.look;
    this.app.golferPreview(L);
    const lvl = p.level;
    const choice = (key, list, label) => `<div class="cust-row"><label>${label}</label><div class="chips">${list.map(it => `<button class="chip ${L[key] === it.id ? 'on' : ''} ${it.unlock > lvl ? 'locked' : ''}" data-set="${key}" data-val="${it.id}" ${it.unlock > lvl ? `title="Unlocks at level ${it.unlock}"` : ''}>${esc(it.name)}${it.unlock > lvl ? ` 🔒${it.unlock}` : ''}</button>`).join('')}</div></div>`;
    const colors = (key, list, label) => `<div class="cust-row"><label>${label}</label><div class="swatches">${list.map(c => `<button class="sw ${L[key] === c ? 'on' : ''}" style="background:${c}" data-set="${key}" data-val="${c}"></button>`).join('')}</div></div>`;
    this.render(`
      <div class="page cust">
        <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">MY GOLFER</div></div>
        <div class="cust-panel glass">
          <div class="cust-row"><label>Name</label><input id="g-name" maxlength="20" value="${esc(L.name)}"></div>
          <div class="cust-row"><label>Gender</label><div class="chips">${[['M', 'Male'], ['F', 'Female']].map(([v, n]) => `<button class="chip ${L.gender === v ? 'on' : ''}" data-set="gender" data-val="${v}">${n}</button>`).join('')}</div></div>
          <div class="cust-row"><label>Skin tone</label><div class="swatches">${SKIN_TONES.map((c, i) => `<button class="sw ${L.skin === i ? 'on' : ''}" style="background:${c}" data-set="skin" data-val="${i}" data-num="1"></button>`).join('')}</div></div>
          ${choice('hair', HAIR_STYLES.map(h => ({ ...h, unlock: 1 })), 'Hair')}
          ${colors('hairColor', HAIR_COLORS, 'Hair color')}
          <div class="cust-row"><label>Beard</label><div class="chips"><button class="chip ${L.beard ? '' : 'on'}" data-set="beard" data-val="0" data-bool="1">None</button><button class="chip ${L.beard ? 'on' : ''}" data-set="beard" data-val="1" data-bool="1">Beard</button></div></div>
          ${choice('hat', HATS, 'Hat')}
          ${colors('hatColor', PALETTE, 'Hat color')}
          ${choice('shirtStyle', SHIRTS, 'Top')}
          ${colors('shirt', PALETTE, 'Shirt color')}
          ${colors('shirtAlt', PALETTE, 'Accent / vest')}
          ${choice('legs', LEGS, 'Bottoms')}
          ${colors('pants', PALETTE, 'Pants color')}
          ${choice('shoeModel', SHOES, 'Shoes')}
          ${colors('shoes', PALETTE, 'Shoe color')}
          ${choice('gloveModel', GLOVES, 'Glove')}
          ${colors('glove', ['#ffffff', '#111111', '#1c2a44', '#c1121f', '#f2c94c'], 'Glove color')}
          ${choice('accessory', ACCESSORIES, 'Accessories')}
          <div class="cust-row"><label>Build</label><input type="range" id="g-build" min="0.85" max="1.2" step="0.05" value="${L.build || 1}"></div>
        </div>
      </div>`, 'page-screen transparent');
    $('#g-name', this.root).oninput = (e) => { L.name = e.target.value || 'You'; this.app.save(); };
    $('#g-build', this.root).oninput = (e) => { L.build = +e.target.value; this.app.save(); this.app.golferPreview(L); };
    this.root.querySelectorAll('[data-set]').forEach(b => b.onclick = () => {
      if (b.classList.contains('locked')) { audio.tick(false); return; }
      let v = b.dataset.val;
      if (b.dataset.num) v = +v;
      if (b.dataset.bool) v = v === '1';
      L[b.dataset.set] = v;
      this.app.save();
      audio.click();
      this.golfer();
    });
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
            <div class="section-title">YARDAGES <small>(your career golfer)</small></div>
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
    $('#reset', this.root).onclick = () => {
      if (confirm('Reset all progress? This cannot be undone.')) { this.app.profile = resetProfile(); this.app.save(); this.main(); }
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
          ${award ? `<div class="rh-xp"><b>+${award.xp} XP</b>${award.levelUps.length ? `<div class="lvlup">LEVEL UP! → ${award.to} · +${award.levelUps.length * 3} skill points</div><div class="unl">${award.levelUps.flatMap(unlocksAt).map(i => `<span>${esc(i)}</span>`).join('')}</div>` : ''}<div class="xpbar big"><i style="width:${this.profile.xp / LEVEL_XP(this.profile.level) * 100}%"></i></div></div>` : '<div class="rh-xp dim">Tour pro round · no XP</div>'}
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
