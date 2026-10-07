// Club selection: swipeable bag carousel + animated club info card with a 3D model,
// full stat breakdown and a comparison against the club in hand.
import { BRAND_MODELS } from '../data/clubs.js';
import { fullCarry, computeLaunch } from '../game/shots.js';
import { flatCarry } from '../core/physics.js';
import { clubIcon } from './icons.js';
import { ClubViewer } from '../render/clubViewer.js';
import { audio } from '../audio/audio.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Stats for a club from the current lie (uses the same launch model as the game).
export function clubStats(play, c) {
  const m = (BRAND_MODELS[c.cat] || []).find(x => x.id === c.modelId) || {};
  if (c.cat === 'putter') {
    return { putter: true, model: m, forg: c.forgiveness, acc: c.accuracy, spec: c.putterSpec || m.putter || {} };
  }
  const carry = fullCarry(c, 'normal', play.surf, play.attrs.recovery);
  const L = computeLaunch({
    club: c, typeId: 'normal', power: 1, timing: 0, heading: 0, shape: 0, traj: 0, spin: { x: 0, y: 0 }, surf: play.surf,
    attrs: play.attrs, diff: { ...play.diff, disp: 0 }, rng: () => 0.5, noNoise: true,
  });
  const fc = flatCarry(L.speed, L.launchDeg, L.back);
  const firm = (play.hole?.firmness ?? 0.6) / 0.6;
  const rollPct = Math.pow(clamp((55 - fc.landAngle) / 55, 0, 1), 1.2) * 0.25 * Math.pow(3000 / Math.max(1500, L.back), 0.4) * firm;
  const roll = carry * rollPct;
  const disp = carry * (1 - c.accuracy) * 0.16 * play.diff.disp + 1.5;
  let shape = 'Neutral';
  if ((m.forg ?? 0) >= 0.1) shape = 'Straight · anti-slice';
  else if ((m.spin ?? 1) < 0.97) shape = 'Penetrating · low spin';
  else if (m.look?.style === 'blade' || (m.forg ?? 0) < 0) shape = 'Workable · shot-shaper';
  else if (c.cat === 'wedge') shape = 'High · soft landing';
  return {
    model: m, carry, total: carry + roll, roll, acc: c.accuracy, forg: c.forgiveness, launch: L.launchDeg, spin: L.back,
    ball: L.ballMph, disp, shape, apex: fc.apex,
  };
}

const ROWS = [
  // key, label, icon, norm(v) 0..1, fmt, better: 1 higher / -1 lower / 0 neutral
  ['carry', 'Carry', '➶', v => v / 320, v => `${Math.round(v)} yds`, 0],
  ['total', 'Total (est.)', '⤳', v => v / 340, v => `${Math.round(v)} yds`, 0],
  ['acc', 'Accuracy', '◎', v => v, v => `${Math.round(v * 100)}`, 1],
  ['forg', 'Forgiveness', '⛨', v => v, v => `${Math.round(v * 100)}`, 1],
  ['launch', 'Launch', '∠', v => v / 40, v => `${v.toFixed(1)}°`, 0],
  ['spin', 'Spin', '↻', v => v / 11000, v => `${Math.round(v).toLocaleString()} rpm`, 0],
  ['ball', 'Ball speed', '⚡', v => v / 190, v => `${Math.round(v)} mph`, 0],
  ['disp', 'Dispersion', '⊙', v => 1 - v / 32, v => `±${Math.round(v)} yds`, -1],
  ['roll', 'Roll', '⇥', v => v / 30, v => `${Math.round(v)} yds`, 0],
];

export class BagView {
  constructor(hud, app) {
    this.hud = hud;
    this.app = app;
    const el = this.el = document.createElement('div');
    el.className = 'bagview';
    el.id = 'bagview';
    el.innerHTML = `
      <div class="bv-top">
        <div class="bv-title">CLUB SELECTION<small id="bv-sub"></small></div>
        <div class="bv-dist" id="bv-dist"></div>
        <button class="bv-close" id="bv-close" title="Close (Esc)">✕</button>
      </div>
      <div class="bv-card" id="bv-card"><div class="bvc-inner" id="bvc-inner"></div></div>
      <div class="bv-rail"><div class="bv-track" id="bv-track"></div><div class="bv-hint">Swipe or ← → to browse · tap a club for details</div></div>`;
    hud.root.appendChild(el);
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'bv-canvas';
    this.track = el.querySelector('#bv-track');
    el.querySelector('#bv-close').onclick = () => { audio.click(); this.app.play.closeBag(null); };
    this.track.addEventListener('scroll', () => { if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.detectFocus(); }); }, { passive: true });
    // mouse-wheel scrolls the rail horizontally on desktop
    this.track.addEventListener('wheel', (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); this.track.scrollBy({ left: e.deltaY, behavior: 'auto' }); } }, { passive: false });
  }

  get play() { return this.app.play; }
  isOpen() { return this.el.classList.contains('open'); }

  open(bag, current) {
    this.bag = bag;
    this.current = current;
    this.stats = new Map(bag.map(c => [c, clubStats(this.play, c)]));
    const p = this.play;
    const toPin = p.distPin;
    this.el.querySelector('#bv-sub').textContent = `${p.lieName || ''}`;
    this.el.querySelector('#bv-dist').innerHTML = `<div><span>TO PIN</span><b>${toPin < 30 ? `${Math.round(toPin * 3)} FT` : `${Math.round(toPin)} Y`}</b></div><div><span>PLAYS LIKE</span><b>${Math.round(p.playsLikeNow ?? toPin)} Y</b></div><div><span>IN HAND</span><b>${esc(current.short)}</b></div>`;
    this.track.innerHTML = bag.map((c, i) => {
      const st = this.stats.get(c);
      const cur = c === current;
      return `<button class="bv-club ${cur ? 'current' : ''}" data-i="${i}" style="--i:${i}">
        <div class="bvk-ico">${clubIcon(c.cat)}</div>
        <div class="bvk-short">${esc(c.short)}</div>
        <div class="bvk-name">${esc(c.name)}</div>
        <div class="bvk-brand">${esc(c.brand)} ${esc(c.model)}</div>
        <div class="bvk-carry">${st.putter ? '—' : `<b>${Math.round(st.carry)}</b><small>YDS</small>`}</div>
        ${cur ? '<div class="bvk-tag">IN HAND</div>' : ''}
      </button>`;
    }).join('');
    this.track.querySelectorAll('.bv-club').forEach(b => b.onclick = () => {
      const c = this.bag[+b.dataset.i];
      audio.click();
      if (this.focus !== c) this.scrollTo(c, true);
      this.openCard(c);
    });
    this.hud.root.classList.add('bag-open');
    this.el.classList.remove('open'); void this.el.offsetWidth;
    this.el.classList.add('open');
    this.focus = null;
    this.closeCard(true);
    requestAnimationFrame(() => { this.scrollTo(current, false); this.setFocus(current); });
  }

  close() {
    this.closeCard();
    this.el.classList.remove('open');
    this.hud.root.classList.remove('bag-open');
    this.viewer?.stop();
  }

  cardEl(c) { return this.track.querySelector(`.bv-club[data-i="${this.bag.indexOf(c)}"]`); }

  scrollTo(c, smooth) {
    const b = this.cardEl(c);
    if (!b) return;
    const left = b.offsetLeft - (this.track.clientWidth - b.offsetWidth) / 2;
    this.track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  }

  detectFocus() {
    const mid = this.track.scrollLeft + this.track.clientWidth / 2;
    let best = null, bd = 1e9;
    this.track.querySelectorAll('.bv-club').forEach(b => {
      const d = Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid);
      if (d < bd) { bd = d; best = b; }
    });
    if (best) this.setFocus(this.bag[+best.dataset.i]);
  }

  setFocus(c) {
    if (this.focus === c) return;
    this.focus = c;
    this.track.querySelectorAll('.bv-club').forEach(b => b.classList.toggle('focus', this.bag[+b.dataset.i] === c));
    this.play.bagFocus(c, this.stats.get(c));
    if (this.cardOpen && this.cardClub !== c) this.openCard(c, true);
  }

  step(dir) {
    const i = clamp(this.bag.indexOf(this.focus || this.current) + dir, 0, this.bag.length - 1);
    const c = this.bag[i];
    this.scrollTo(c, true);
    this.setFocus(c);
    audio.click();
  }

  // ---------- info card ----------
  openCard(c, swap = false) {
    const card = this.el.querySelector('#bv-card');
    const inner = this.el.querySelector('#bvc-inner');
    const st = this.stats.get(c);
    const cur = this.current;
    const cs = this.stats.get(cur);
    this.cardClub = c;
    const isCur = c === cur;
    const delta = (key, better, fmtD) => {
      if (isCur || st.putter || cs.putter) return '';
      const d = st[key] - cs[key];
      if (Math.abs(d) < (key === 'acc' || key === 'forg' ? 0.005 : key === 'spin' ? 20 : 0.5)) return '<em class="dz">=</em>';
      const good = better === 0 ? 'neu' : (d > 0) === (better > 0) ? 'up' : 'down';
      return `<em class="${good}">${d > 0 ? '▲' : '▼'} ${fmtD(Math.abs(d))}</em>`;
    };
    const dfmt = { carry: v => Math.round(v), total: v => Math.round(v), acc: v => Math.round(v * 100), forg: v => Math.round(v * 100), launch: v => v.toFixed(1) + '°', spin: v => Math.round(v), ball: v => Math.round(v), disp: v => Math.round(v), roll: v => Math.round(v) };
    let rows = '';
    if (st.putter) {
      const sp = st.spec;
      rows = `<div class="bvc-specs">
        ${[['Face balance', sp.balance], ['Toe hang', sp.toeHang], ['Alignment', sp.alignment], ['Neck', sp.neck]].map(([k, v]) => `<div><span>${k}</span><b>${esc(v || '—')}</b></div>`).join('')}
      </div>
      <div class="bvc-row"><i>⛨</i><span>Forgiveness</span><div class="bar"><b style="--w:${Math.round(st.forg * 100)}%"></b></div><strong>${Math.round(st.forg * 100)}</strong></div>
      <div class="bvc-row"><i>◎</i><span>Accuracy</span><div class="bar"><b style="--w:${Math.round(st.acc * 100)}%"></b></div><strong>${Math.round(st.acc * 100)}</strong></div>`;
    } else {
      rows = ROWS.filter(r => r[0] !== 'carry' && r[0] !== 'total').map(([k, label, icon, norm, fmt, better]) =>
        `<div class="bvc-row"><i>${icon}</i><span>${label}</span><div class="bar"><b style="--w:${Math.round(clamp(norm(st[k]), 0.03, 1) * 100)}%"></b>${!isCur && !cs.putter ? `<u style="left:${Math.round(clamp(norm(cs[k]), 0, 1) * 100)}%"></u>` : ''}</div><strong>${fmt(st[k])}</strong>${delta(k, better, dfmt[k])}</div>`).join('');
      rows += `<div class="bvc-row text"><i>⌒</i><span>Shot shape</span><strong class="wide">${esc(st.shape)}</strong></div>`;
      if (c.cat === 'wedge') {
        rows = `<div class="bvc-specs">${[['Loft', `${c.loft}°`], ['Bounce', `${c.bounce}°`], ['Grind', c.grind || '—'], ['Finish', c.look?.finish === '#6b5b48' ? 'Raw' : c.look?.finish === '#2b2d31' ? 'Black' : 'Chrome']].map(([k, v]) => `<div><span>${k}</span><b>${esc(v)}</b></div>`).join('')}</div>` + rows;
      }
    }
    const maxCarry = Math.max(...[...this.stats.values()].filter(s => !s.putter).map(s => s.total), 1);
    const distBlock = st.putter ? `<div class="bvc-big"><div><span>ROLL CONTROL</span><b>${this.play.puttScale || 25}<small>FT SCALE</small></b></div></div>` : `
      <div class="bvc-big">
        <div><span>CARRY</span><b>${Math.round(st.carry)}<small>YDS</small></b>${delta('carry', 0, dfmt.carry)}</div>
        <div><span>TOTAL</span><b>${Math.round(st.total)}<small>YDS</small></b>${delta('total', 0, dfmt.total)}</div>
      </div>
      <div class="bvc-dbar"><b class="c" style="--w:${st.carry / maxCarry * 100}%"></b><b class="t" style="--w:${st.total / maxCarry * 100}%"></b>${!isCur && !cs.putter ? `<u style="left:${cs.carry / maxCarry * 100}%" title="${esc(cur.short)}"></u>` : ''}</div>`;
    inner.innerHTML = `
      <div class="bvc-head">
        <div><div class="bvc-brand">${esc(c.brand)}</div><div class="bvc-model">${esc(c.model)}</div><div class="bvc-club">${esc(c.name.toUpperCase())}${c.cat !== 'putter' ? ` · ${c.loft}°` : ''}</div></div>
        <button class="bvc-x" id="bvc-x" title="Close">✕</button>
      </div>
      <div class="bvc-view"><span class="bvc-hint">DRAG TO INSPECT</span></div>
      ${distBlock}
      ${!isCur ? `<div class="bvc-cmp">COMPARED WITH <b>${esc(cur.short)}</b> IN HAND</div>` : '<div class="bvc-cmp in">✓ THIS CLUB IS IN YOUR HANDS</div>'}
      <div class="bvc-stats">${rows}</div>
      <div class="bvc-blurb">${esc(c.blurb)}</div>
      <div class="bvc-actions"><button class="btn primary big" id="bv-select">${isCur ? 'KEEP CLUB' : 'SELECT CLUB'}</button></div>`;
    inner.querySelector('#bvc-x').onclick = () => { audio.click(); this.closeCard(); };
    inner.querySelector('#bv-select').onclick = () => { audio.click(); this.play.closeBag(c); };
    inner.querySelector('.bvc-view').prepend(this.canvas);
    if (!this.viewer) this.viewer = new ClubViewer(this.canvas);
    this.viewer.w = 0;
    this.viewer.setClub(c);
    this.viewer.start();
    if (swap) { inner.classList.remove('swap'); void inner.offsetWidth; inner.classList.add('swap'); }
    if (!this.cardOpen) { card.classList.remove('open'); void card.offsetWidth; card.classList.add('open'); }
    this.cardOpen = true;
    this.el.classList.add('card-open');
  }

  closeCard(instant = false) {
    const card = this.el.querySelector('#bv-card');
    this.cardOpen = false;
    this.cardClub = null;
    this.el.classList.remove('card-open');
    if (instant) { card.classList.remove('open'); this.viewer?.stop(); return; }
    card.classList.remove('open');
    setTimeout(() => { if (!this.cardOpen) this.viewer?.stop(); }, 300);
  }

  onKey(k) {
    if (k === 'ArrowLeft' || k === 'a') { this.step(-1); return true; }
    if (k === 'ArrowRight' || k === 'd') { this.step(1); return true; }
    if (k === 'Enter' || k === ' ') {
      if (this.cardOpen && this.cardClub) this.play.closeBag(this.cardClub);
      else if (this.focus) this.openCard(this.focus);
      return true;
    }
    if (k === 'Escape' || k === 'b' || k === 'B') {
      if (this.cardOpen) this.closeCard(); else this.play.closeBag(null);
      return true;
    }
    return false;
  }
}
