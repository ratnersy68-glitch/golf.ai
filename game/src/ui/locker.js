// Locker room: deep golfer customization with a live 3D preview.
// Body/face/hair edits apply instantly; apparel is browsed like a pro shop
// (tap to preview, EQUIP to keep, BACK to revert) and can be saved as outfits.
import {
  TOPS, BOTTOMS, SHOES, HATS, GLOVES, NO_HAT, ALL_ITEMS, BRANDS, RARITY, TOP_COLORS, BOTTOM_COLORS, TOP_PATTERNS,
  BOTTOM_PATTERNS, HAT_PATTERNS, FITS, HAT_FITS, itemUnlock, catalogueStats,
} from '../data/apparel.js';
import {
  SKIN_TONES, HAIR_COLORS, EYE_COLORS, HAIR_STYLES, FACE_SHAPES, EYE_SHAPES, BROWS, NOSES, MOUTHS, JAWS, FACIAL_HAIR,
  ACCESSORIES, normalizeLook,
} from '../data/look.js';
import { topIcon, bottomIcon, shoeIcon, hatIcon, gloveIcon, hairIcon } from './icons.js';
import { audio } from '../audio/audio.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clone = (o) => JSON.parse(JSON.stringify(o));
const pick = (a) => a[Math.floor(Math.random() * a.length)];

const TABS = [
  ['body', 'BODY', 'full'], ['face', 'FACE', 'head'], ['hair', 'HAIR', 'head'], ['top', 'TOPS', 'top'], ['bottom', 'BOTTOMS', 'legs'],
  ['shoes', 'SHOES', 'feet'], ['hat', 'HATS', 'head'], ['glove', 'GLOVES & ACC', 'hands'], ['outfits', 'OUTFITS', 'full'], ['closet', 'CLOSET', 'full'],
];
const LISTS = { top: TOPS, bottom: BOTTOMS, shoes: SHOES, hat: [NO_HAT, ...HATS], glove: GLOVES };
const CAT_NAME = { top: 'Top', bottom: 'Bottoms', shoes: 'Shoes', hat: 'Headwear', glove: 'Glove' };
const colorName = (hex, list = [...TOP_COLORS, ...BOTTOM_COLORS]) => (list.find(c => c[1].toLowerCase() === String(hex).toLowerCase()) || ['Custom'])[0];

export function iconFor(cat, it, cfg) {
  if (cat === 'top') return topIcon(it, cfg, BRANDS[it.brand]?.logo?.length <= 4 ? BRANDS[it.brand].logo : '');
  if (cat === 'bottom') return bottomIcon(it, cfg);
  if (cat === 'shoes') return shoeIcon(it, cfg);
  if (cat === 'hat') return hatIcon(it, cfg);
  return gloveIcon(it, cfg);
}

// sensible starting config when an item is first tried on (keeps the current color where it fits)
export function defaultCfg(cat, it, cur = {}) {
  switch (cat) {
    case 'top': return { id: it.id, color: cur.color || TOP_COLORS[0][1], pattern: it.patterns.includes(cur.pattern) ? cur.pattern : it.patterns[0] };
    case 'bottom': return { id: it.id, color: cur.color || BOTTOM_COLORS[1][1], pattern: it.patterns.includes(cur.pattern) ? cur.pattern : it.patterns[0], fit: cur.fit || 'Regular' };
    case 'shoes': return { id: it.id, colorway: 0, spikes: it.spikes, closure: it.closure };
    case 'hat': return it.id === 'hat-none' ? { id: 'hat-none' } : { id: it.id, color: it.style === 'panama' ? '#e8dcb5' : (cur.color || '#1c2a44'), pattern: it.patterns.includes(cur.pattern) ? cur.pattern : 'solid', logo: cur.logo ?? true, fit: cur.fit || 'Structured' };
    default: return { id: it.id, color: it.colors[0][1] };
  }
}

export class Locker {
  constructor(menus) {
    this.menus = menus;
    this.app = menus.app;
    this.tab = 'top';
    this.filter = 'ALL';
    this.brand = 'ALL';
    this.detail = null; // { cat, id }
  }
  get profile() { return this.app.profile; }
  get look() { return this.profile.look; }

  open() {
    const p = this.profile;
    p.look = normalizeLook(p.look);
    this.draft = null;
    const stats = catalogueStats();
    const faceCombos = SKIN_TONES.length * FACE_SHAPES.length * JAWS.length * EYE_SHAPES.length * EYE_COLORS.length * BROWS.length * NOSES.length * MOUTHS.length * FACIAL_HAIR.length;
    this.menus.render(`
      <div class="lk">
        <div class="lk-panel glass">
          <div class="lk-head">
            <button class="btn ghost" id="lk-exit">‹ MENU</button>
            <div class="lk-title">LOCKER ROOM<small>${stats.items} items · ${(stats.combos + faceCombos).toLocaleString()}+ looks</small></div>
            <button class="btn small" id="lk-random" title="Random look">🎲</button>
          </div>
          <div class="lk-namebox"><input id="lk-name" maxlength="20" value="${esc(p.look.name)}" aria-label="Golfer name"></div>
          <div class="lk-tabs" id="lk-tabs">${TABS.map(([k, n]) => `<button class="lk-tab ${k === this.tab ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('')}<i class="lk-ink"></i></div>
          <div class="lk-body">
            <div class="lk-content" id="lk-content"></div>
            <div class="lk-detail" id="lk-detail"></div>
          </div>
        </div>
        <div class="lk-view">
          <button class="lk-vbtn" data-view="0">FRONT</button><button class="lk-vbtn" data-view="1.5708">SIDE</button><button class="lk-vbtn" data-view="3.1416">BACK</button>
          <span class="lk-sep"></span>
          <button class="lk-vbtn round" data-zoom="-1">−</button><button class="lk-vbtn round" data-zoom="1">+</button>
          <span class="lk-hint">Drag to rotate</span>
        </div>
        <div class="lk-equipped glass" id="lk-equipped"></div>
        <div class="lk-toast" id="lk-toast"><b></b><span></span></div>
      </div>`, 'page-screen transparent locker-screen');
    this.menus.root.classList.add('locker-mode');
    const R = this.menus.root;
    R.querySelector('#lk-exit').onclick = () => { audio.click(); this.close(); this.menus.go('main'); };
    R.querySelector('#lk-name').oninput = (e) => { p.look.name = e.target.value || 'You'; this.app.save(); };
    R.querySelector('#lk-random').onclick = () => { audio.click(); this.randomize(); };
    R.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { audio.click(); this.setTab(b.dataset.tab); });
    R.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { audio.click(); this.app.lockerView({ yaw: +b.dataset.view }); });
    R.querySelectorAll('[data-zoom]').forEach(b => b.onclick = () => { audio.click(); this.app.lockerView({ zoom: (this.app.locker?.zoom || 1) * (b.dataset.zoom === '1' ? 0.85 : 1.18) }); });
    this.preview(p.look, true);
    this.setTab(this.tab, true);
  }

  toast(main, sub) {
    const t = this.menus.root.querySelector('#lk-toast');
    if (!t) return;
    t.querySelector('b').textContent = main; t.querySelector('span').textContent = sub;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(this.toastT); this.toastT = setTimeout(() => t.classList.remove('show'), 1600);
  }

  close() {
    this.menus.root.classList.remove('locker-mode');
  }

  focusFor(tab) { return (TABS.find(t => t[0] === tab) || TABS[0])[2]; }

  preview(look, first = false) {
    this.app.golferPreview(look, first ? { focus: this.focusFor(this.tab), yaw: 0.35, zoom: 1 } : {});
  }

  setTab(tab, instant = false) {
    this.tab = tab;
    this.filter = 'ALL'; this.brand = 'ALL';
    this.closeDetail(true);
    const R = this.menus.root;
    R.querySelectorAll('.lk-tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    const on = R.querySelector('.lk-tab.on');
    const ink = R.querySelector('.lk-ink');
    if (on && ink) { ink.style.width = `${on.offsetWidth}px`; ink.style.transform = `translateX(${on.offsetLeft}px)`; on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: instant ? 'auto' : 'smooth' }); }
    this.app.lockerView({ focus: this.focusFor(tab) });
    this.renderContent();
    this.renderEquipped();
  }

  renderContent() {
    const el = this.menus.root.querySelector('#lk-content');
    if (!el) return;
    let html = '';
    switch (this.tab) {
      case 'body': html = this.bodyTab(); break;
      case 'face': html = this.faceTab(); break;
      case 'hair': html = this.hairTab(); break;
      case 'outfits': html = this.outfitsTab(); break;
      case 'closet': html = this.closetTab(); break;
      case 'glove': html = this.shopTab('glove') + this.accTab(); break;
      default: html = this.shopTab(this.tab);
    }
    el.innerHTML = html;
    el.classList.remove('anim'); void el.offsetWidth; el.classList.add('anim');
    this.bindContent(el);
  }

  // ---------- look (body/face/hair) ----------
  setLook(key, val) {
    this.look[key] = val;
    this.app.save();
    this.preview(this.look);
  }
  row(label, inner) { return `<div class="lk-row"><label>${label}</label><div>${inner}</div></div>`; }
  chips(key, list, cur) { return `<div class="chips">${list.map(([v, n]) => `<button class="chip ${cur === v ? 'on' : ''}" data-look="${key}" data-val="${v}">${esc(n)}</button>`).join('')}</div>`; }
  swatches(key, list, cur, num = false) { return `<div class="swatches">${list.map((c, i) => { const hex = Array.isArray(c) ? c[1] : c; const v = num ? i : hex; return `<button class="sw ${cur === v ? 'on' : ''}" style="background:${hex}" data-look="${key}" data-val="${v}" ${num ? 'data-num="1"' : ''} title="${Array.isArray(c) ? esc(c[0]) : ''}"></button>`; }).join('')}</div>`; }
  slider(key, label, min, max, lo, hi) {
    const v = this.look[key] ?? 1;
    return `<div class="lk-row"><label>${label}</label><div class="lk-slider"><span>${lo}</span><input type="range" min="${min}" max="${max}" step="0.01" value="${v}" data-slide="${key}"><span>${hi}</span></div></div>`;
  }

  bodyTab() {
    const L = this.look;
    return `<div class="lk-sec">FRAME</div>
      ${this.row('Body', this.chips('gender', [['M', 'Masculine'], ['F', 'Feminine']], L.gender))}
      ${this.slider('height', 'Height', 0.9, 1.1, 'Short', 'Tall')}
      ${this.slider('build', 'Build', 0.85, 1.2, 'Lean', 'Heavy')}
      ${this.slider('shoulders', 'Shoulders', 0.88, 1.14, 'Narrow', 'Broad')}
      ${this.slider('legs', 'Proportions', 0.92, 1.08, 'Long torso', 'Long legs')}
      <div class="lk-sec">SKIN</div>
      ${this.row('Skin tone', this.swatches('skin', SKIN_TONES, L.skin, true))}`;
  }
  faceTab() {
    const L = this.look;
    return `<div class="lk-sec">FACE</div>
      ${this.row('Face shape', this.chips('faceShape', FACE_SHAPES, L.faceShape))}
      ${this.row('Jaw', this.chips('jaw', JAWS, L.jaw))}
      <div class="lk-sec">EYES</div>
      ${this.row('Eye shape', this.chips('eyeShape', EYE_SHAPES, L.eyeShape))}
      ${this.row('Eye color', this.swatches('eyeColor', EYE_COLORS, L.eyeColor))}
      ${this.row('Brows', this.chips('brows', BROWS, L.brows))}
      <div class="lk-sec">FEATURES</div>
      ${this.row('Nose', this.chips('nose', NOSES, L.nose))}
      ${this.row('Mouth', this.chips('mouth', MOUTHS, L.mouth))}
      ${this.row('Facial hair', this.chips('facialHair', FACIAL_HAIR, L.facialHair))}`;
  }
  hairTab() {
    const L = this.look;
    return `<div class="lk-sec">STYLE</div>
      <div class="lk-grid hair">${HAIR_STYLES.map(([v, n], i) => `<button class="lk-item ${L.hair === v ? 'eq' : ''}" data-look="hair" data-val="${v}" style="--i:${i}"><div class="lk-icon">${hairIcon(v, L.hairColor)}</div><div class="lk-name">${esc(n)}</div>${L.hair === v ? '<div class="lk-eq">✓</div>' : ''}</button>`).join('')}</div>
      <div class="lk-sec">COLOR</div>${this.swatches('hairColor', HAIR_COLORS, L.hairColor)}`;
  }
  accTab() {
    return `<div class="lk-sec">ACCESSORIES</div>${this.chips('accessory', ACCESSORIES, this.look.accessory)}`;
  }

  // ---------- pro shop ----------
  shopTab(cat) {
    const list = LISTS[cat];
    const subs = ['ALL', ...new Set(list.map(i => i.sub))];
    const brands = ['ALL', ...new Set(list.filter(i => i.brand).map(i => i.brand))];
    const eq = this.look.outfit[cat];
    const lvl = this.profile.level;
    const items = list.filter(i => (this.filter === 'ALL' || i.sub === this.filter) && (this.brand === 'ALL' || i.brand === this.brand || !i.brand));
    return `<div class="lk-filters">
        <div class="chips scroll">${subs.map(s => `<button class="chip ${this.filter === s ? 'on' : ''}" data-filter="${esc(s)}">${esc(s === 'ALL' ? 'All' : s)}</button>`).join('')}</div>
        <div class="chips scroll">${brands.map(b => `<button class="chip brand ${this.brand === b ? 'on' : ''}" data-brand="${b}">${b === 'ALL' ? 'All brands' : esc(BRANDS[b].name)}</button>`).join('')}</div>
      </div>
      <div class="lk-grid">${items.map((it, i) => {
        const cfg = eq?.id === it.id ? eq : defaultCfg(cat, it, eq);
        const locked = itemUnlock(it) > lvl;
        const r = RARITY[it.rarity || 'common'];
        const isEq = eq?.id === it.id;
        return `<button class="lk-item r-${it.rarity || 'common'} ${isEq ? 'eq' : ''} ${locked ? 'locked' : ''}" data-item="${it.id}" data-cat="${cat}" style="--rc:${r.color};--i:${Math.min(i, 24)}">
          <div class="lk-icon">${iconFor(cat, it, cfg)}</div>
          <div class="lk-brand">${esc(it.brand ? BRANDS[it.brand].name : '—')}</div>
          <div class="lk-name">${esc(it.name)}</div>
          <div class="lk-rar">${r.name}</div>
          ${isEq ? '<div class="lk-eq">✓</div>' : ''}${locked ? `<div class="lk-lock">🔒 LV ${itemUnlock(it)}</div>` : ''}
        </button>`;
      }).join('') || '<div class="dim pad">No items match these filters.</div>'}</div>`;
  }

  openDetail(cat, id, cfg = null) {
    const it = ALL_ITEMS[id];
    if (!it) return;
    if (itemUnlock(it) > this.profile.level) { audio.tick(false); this.toast('LOCKED', `Reach level ${itemUnlock(it)} to unlock ${RARITY[it.rarity].name.toLowerCase()} items`, 'info', 1800); return; }
    const eq = this.look.outfit[cat];
    this.draft = clone(this.look);
    this.draft.outfit[cat] = cfg ? clone(cfg) : eq?.id === id ? clone(eq) : defaultCfg(cat, it, eq);
    this.detail = { cat, id };
    this.app.lockerView({ focus: cat === 'glove' ? 'hands' : this.focusFor(cat) });
    this.preview(this.draft);
    this.renderDetail(true);
  }

  renderDetail(anim = false) {
    const el = this.menus.root.querySelector('#lk-detail');
    if (!el || !this.detail) return;
    const { cat, id } = this.detail;
    const it = ALL_ITEMS[id];
    const cfg = this.draft.outfit[cat];
    const r = RARITY[it.rarity || 'common'];
    const isEq = JSON.stringify(this.look.outfit[cat]) === JSON.stringify(cfg);
    const inCloset = this.profile.closet.some(c => c.cat === cat && JSON.stringify(c.cfg) === JSON.stringify(cfg));
    const opt = (key, list, cur, fmt = (v) => v) => `<div class="chips">${list.map(v => { const [val, name] = Array.isArray(v) ? v : [v, v]; return `<button class="chip ${cur === val ? 'on' : ''}" data-opt="${key}" data-val="${val}">${esc(fmt(name))}</button>`; }).join('')}</div>`;
    const sw = (key, list, cur) => `<div class="swatches">${list.map(([n, hex]) => `<button class="sw ${String(cur).toLowerCase() === hex.toLowerCase() ? 'on' : ''}" style="background:${hex}" data-opt="${key}" data-val="${hex}" title="${esc(n)}"></button>`).join('')}</div>`;
    let opts = '';
    let fit = '—', color = '—';
    if (cat === 'top') {
      opts += this.row('Color', sw('color', TOP_COLORS, cfg.color));
      opts += this.row('Pattern', opt('pattern', TOP_PATTERNS.filter(p => it.patterns.includes(p[0])), cfg.pattern));
      fit = it.fit; color = colorName(cfg.color, TOP_COLORS);
    } else if (cat === 'bottom') {
      opts += this.row('Color', sw('color', BOTTOM_COLORS, cfg.color));
      opts += this.row('Pattern', opt('pattern', BOTTOM_PATTERNS.filter(p => it.patterns.includes(p[0])), cfg.pattern));
      opts += this.row('Fit', opt('fit', FITS, cfg.fit));
      fit = cfg.fit; color = colorName(cfg.color, BOTTOM_COLORS);
    } else if (cat === 'shoes') {
      opts += this.row('Colorway', `<div class="chips">${it.colorways.map((c, i) => `<button class="chip cw ${cfg.colorway === i ? 'on' : ''}" data-opt="colorway" data-val="${i}" data-num="1"><i style="background:linear-gradient(135deg, ${c.upper} 50%, ${c.accent} 50%)"></i>${esc(c.name)}</button>`).join('')}</div>`);
      opts += this.row('Sole', opt('spikes', [['true', 'Spiked'], ['false', 'Spikeless']], String(cfg.spikes)));
      opts += this.row('Closure', opt('closure', [['laces', 'Laces'], ['boa', 'BOA Dial']], cfg.closure));
      fit = cfg.spikes ? 'Spiked' : 'Spikeless'; color = it.colorways[cfg.colorway]?.name || '';
    } else if (cat === 'hat' && id !== 'hat-none') {
      if (it.style !== 'panama') opts += this.row('Color', sw('color', TOP_COLORS, cfg.color));
      else opts += this.row('Straw', sw('color', [['Natural', '#e8dcb5'], ['Sand', '#d9c79a'], ['Ivory', '#f2ecd9'], ['Toast', '#b89a66']], cfg.color));
      if (it.patterns.length > 1) opts += this.row('Pattern', opt('pattern', HAT_PATTERNS.filter(p => it.patterns.includes(p[0])), cfg.pattern));
      if (['cap', 'golfcap', 'perf', 'flatbrim', 'visor', 'bucket'].includes(it.style)) opts += this.row('Logo', opt('logo', [['true', 'Logo'], ['false', 'Blank']], String(cfg.logo !== false)));
      if (['cap', 'golfcap', 'perf', 'flatbrim'].includes(it.style)) opts += this.row('Fit', opt('fit', HAT_FITS, cfg.fit));
      fit = cfg.fit || 'One size'; color = colorName(cfg.color, TOP_COLORS);
    } else if (cat === 'glove') {
      opts += this.row('Color', sw('color', it.colors, cfg.color));
      fit = 'Left hand'; color = colorName(cfg.color, it.colors);
    }
    el.innerHTML = `<div class="lkd">
      <div class="lkd-top"><button class="btn ghost small" id="lkd-back">‹ BACK</button><span class="rar-chip" style="--rc:${r.color}">${r.name}</span></div>
      <div class="lkd-hero r-${it.rarity || 'common'}" style="--rc:${r.color}"><div class="lkd-icon">${iconFor(cat, it, cfg)}</div></div>
      <div class="lkd-brand">${esc(it.brand ? BRANDS[it.brand].name : '')}</div>
      <div class="lkd-name">${esc(it.name)}</div>
      <div class="lkd-meta"><div><span>CATEGORY</span><b>${esc(CAT_NAME[cat])} · ${esc(it.sub)}</b></div><div><span>FIT</span><b>${esc(fit)}</b></div><div><span>COLOR</span><b>${esc(color)}</b></div></div>
      <div class="lkd-opts">${opts}</div>
      <div class="lkd-actions">
        <button class="btn primary" id="lkd-equip" ${isEq ? 'disabled' : ''}>${isEq ? '✓ EQUIPPED' : 'EQUIP'}</button>
        ${id !== 'hat-none' ? `<button class="btn" id="lkd-closet">${inCloset ? '♥ IN CLOSET' : '♡ ADD TO CLOSET'}</button>` : ''}
      </div>
      <div class="lkd-note">Cosmetic only — rarity never affects performance.</div>
    </div>`;
    if (anim) { el.classList.remove('open'); void el.offsetWidth; }
    el.classList.add('open');
    this.menus.root.querySelector('#lk-content')?.classList.add('behind');
    el.querySelector('#lkd-back').onclick = () => { audio.click(); this.closeDetail(); };
    el.querySelector('#lkd-equip').onclick = () => this.equipDraft();
    const cb = el.querySelector('#lkd-closet');
    if (cb) cb.onclick = () => { audio.click(); this.toggleCloset(cat, cfg); this.renderDetail(); };
    el.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => {
      let v = b.dataset.val;
      if (b.dataset.num) v = +v;
      if (v === 'true') v = true; else if (v === 'false') v = false;
      this.draft.outfit[cat][b.dataset.opt] = v;
      audio.click();
      this.preview(this.draft);
      this.renderDetail();
    });
  }

  closeDetail(silent = false) {
    const el = this.menus.root.querySelector('#lk-detail');
    const had = !!this.detail;
    this.detail = null;
    this.draft = null;
    if (el) el.classList.remove('open');
    this.menus.root.querySelector('#lk-content')?.classList.remove('behind');
    if (had) {
      this.preview(this.look);
      if (!silent) this.app.lockerView({ focus: this.focusFor(this.tab) });
    }
  }

  equipDraft() {
    if (!this.draft || !this.detail) return;
    const { cat } = this.detail;
    this.look.outfit[cat] = clone(this.draft.outfit[cat]);
    this.app.save();
    audio.jingle('great');
    this.toast('EQUIPPED', ALL_ITEMS[this.look.outfit[cat].id]?.name || '', 'good', 1400);
    const keep = this.detail;
    this.renderDetail();
    this.detail = keep;
    this.refreshGrid();
    this.renderEquipped();
  }

  refreshGrid() {
    // re-render the grid under the detail panel without losing the panel
    const el = this.menus.root.querySelector('#lk-content');
    if (!el) return;
    const behind = el.classList.contains('behind');
    const tmp = this.tab === 'glove' ? this.shopTab('glove') + this.accTab() : LISTS[this.tab] ? this.shopTab(this.tab) : null;
    if (tmp == null) return;
    el.innerHTML = tmp;
    this.bindContent(el);
    el.classList.toggle('behind', behind);
  }

  toggleCloset(cat, cfg) {
    const c = this.profile.closet;
    const i = c.findIndex(x => x.cat === cat && JSON.stringify(x.cfg) === JSON.stringify(cfg));
    if (i >= 0) c.splice(i, 1); else c.unshift({ cat, cfg: clone(cfg) });
    this.app.save();
  }

  // ---------- outfits & closet ----------
  outfitsTab() {
    const list = this.profile.outfits;
    const cur = JSON.stringify(this.look.outfit);
    const mini = (o) => ['hat', 'top', 'bottom', 'shoes'].map(cat => { const cfg = o[cat]; const it = ALL_ITEMS[cfg?.id]; return it ? `<span class="mini">${iconFor(cat, it, cfg)}</span>` : ''; }).join('');
    return `<div class="lk-sec">SAVE CURRENT OUTFIT</div>
      <div class="lk-save"><input id="lk-oname" maxlength="24" placeholder="Outfit name (e.g. Sunday Red)"><button class="btn primary small" id="lk-osave">SAVE</button></div>
      <div class="lk-sec">MY OUTFITS <small>${list.length}/12</small></div>
      <div class="lk-outfits">${list.map((o, i) => `<div class="lk-outfit ${JSON.stringify(o.outfit) === cur ? 'eq' : ''}" style="--i:${i}">
        <div class="lko-minis">${mini(o.outfit)}</div>
        <div class="lko-info"><input class="lko-name" data-rename="${o.id}" value="${esc(o.name)}" maxlength="24"><small>${ALL_ITEMS[o.outfit.top.id]?.name || ''}</small></div>
        <div class="lko-btns">
          <button class="btn primary small" data-oequip="${o.id}">${JSON.stringify(o.outfit) === cur ? '✓' : 'EQUIP'}</button>
          <button class="btn small" data-oupdate="${o.id}" title="Overwrite with what you're wearing">UPDATE</button>
          <button class="btn danger small" data-odel="${o.id}">✕</button>
        </div></div>`).join('') || '<div class="dim pad">No saved outfits yet. Put together a look and save it here.</div>'}</div>`;
  }
  closetTab() {
    const c = this.profile.closet;
    return `<div class="lk-sec">MY CLOSET <small>${c.length} saved items · tap to try on</small></div>
      <div class="lk-grid">${c.map((e, i) => {
        const it = ALL_ITEMS[e.cfg.id]; if (!it) return '';
        const r = RARITY[it.rarity || 'common'];
        const isEq = JSON.stringify(this.look.outfit[e.cat]) === JSON.stringify(e.cfg);
        return `<button class="lk-item r-${it.rarity || 'common'} ${isEq ? 'eq' : ''}" data-closet="${i}" style="--rc:${r.color};--i:${Math.min(i, 24)}">
          <div class="lk-icon">${iconFor(e.cat, it, e.cfg)}</div><div class="lk-brand">${esc(it.brand ? BRANDS[it.brand].name : '')}</div><div class="lk-name">${esc(it.name)}</div><div class="lk-rar">${r.name}</div>${isEq ? '<div class="lk-eq">✓</div>' : ''}</button>`;
      }).join('') || '<div class="dim pad">Your closet is empty. Use ♡ ADD TO CLOSET on any item to keep a favourite colorway.</div>'}</div>`;
  }

  bindContent(el) {
    el.querySelectorAll('[data-look]').forEach(b => b.onclick = () => {
      let v = b.dataset.val;
      if (b.dataset.num) v = +v;
      audio.click();
      this.setLook(b.dataset.look, v);
      const sc = el.scrollTop;
      this.renderContent();
      el.scrollTop = sc;
      el.classList.remove('anim');
    });
    el.querySelectorAll('[data-slide]').forEach(r => r.oninput = () => this.setLook(r.dataset.slide, +r.value));
    el.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { audio.click(); this.filter = b.dataset.filter; this.renderContent(); });
    el.querySelectorAll('[data-brand]').forEach(b => b.onclick = () => { audio.click(); this.brand = b.dataset.brand; this.renderContent(); });
    el.querySelectorAll('[data-item]').forEach(b => b.onclick = () => { audio.click(); this.openDetail(b.dataset.cat, b.dataset.item); });
    el.querySelectorAll('[data-closet]').forEach(b => b.onclick = () => { audio.click(); const e = this.profile.closet[+b.dataset.closet]; this.openDetail(e.cat, e.cfg.id, e.cfg); });
    const save = el.querySelector('#lk-osave');
    if (save) save.onclick = () => {
      const list = this.profile.outfits;
      if (list.length >= 12) { audio.tick(false); return; }
      const name = el.querySelector('#lk-oname').value.trim() || `Outfit ${list.length + 1}`;
      list.unshift({ id: `o${Date.now().toString(36)}`, name, outfit: clone(this.look.outfit) });
      this.app.save(); audio.jingle('great'); this.renderContent();
    };
    el.querySelectorAll('[data-oequip]').forEach(b => b.onclick = () => {
      const o = this.profile.outfits.find(x => x.id === b.dataset.oequip); if (!o) return;
      this.look.outfit = normalizeLook({ ...this.look, outfit: clone(o.outfit) }).outfit;
      this.app.save(); audio.click(); this.preview(this.look); this.renderContent(); this.renderEquipped();
    });
    el.querySelectorAll('[data-oupdate]').forEach(b => b.onclick = () => {
      const o = this.profile.outfits.find(x => x.id === b.dataset.oupdate); if (!o) return;
      o.outfit = clone(this.look.outfit); this.app.save(); audio.click(); this.renderContent();
    });
    el.querySelectorAll('[data-odel]').forEach(b => b.onclick = () => {
      if (!b.classList.contains('confirm')) { b.classList.add('confirm'); b.textContent = 'DELETE?'; setTimeout(() => { if (b.isConnected) { b.classList.remove('confirm'); b.textContent = '✕'; } }, 2500); return; }
      const card = b.closest('.lk-outfit');
      card.classList.add('leaving');
      setTimeout(() => { this.profile.outfits = this.profile.outfits.filter(x => x.id !== b.dataset.odel); this.app.save(); this.renderContent(); }, 220);
    });
    el.querySelectorAll('[data-rename]').forEach(i => i.onchange = () => {
      const o = this.profile.outfits.find(x => x.id === i.dataset.rename); if (!o) return;
      o.name = i.value.trim() || o.name; this.app.save();
    });
  }

  renderEquipped() {
    const el = this.menus.root.querySelector('#lk-equipped');
    if (!el) return;
    const o = this.look.outfit;
    el.innerHTML = `<div class="lke-title">EQUIPPED</div>${['hat', 'top', 'bottom', 'shoes', 'glove'].map(cat => {
      const it = ALL_ITEMS[o[cat]?.id]; if (!it) return '';
      return `<button class="lke-item" data-eqtab="${cat}" title="${esc(it.name)}"><span class="mini">${iconFor(cat, it, o[cat])}</span><span class="lke-txt"><b>${esc(it.brand ? BRANDS[it.brand].name : 'None')}</b>${esc(it.name)}</span></button>`;
    }).join('')}`;
    el.querySelectorAll('[data-eqtab]').forEach(b => b.onclick = () => { audio.click(); this.setTab(b.dataset.eqtab); });
  }

  randomize() {
    const L = this.look;
    const lvl = this.profile.level;
    const ok = (list) => list.filter(i => itemUnlock(i) <= lvl);
    Object.assign(L, {
      height: 0.94 + Math.random() * 0.12, build: 0.9 + Math.random() * 0.22, shoulders: 0.94 + Math.random() * 0.14, legs: 0.95 + Math.random() * 0.1,
      skin: Math.floor(Math.random() * SKIN_TONES.length), faceShape: pick(FACE_SHAPES)[0], jaw: pick(JAWS)[0], eyeShape: pick(EYE_SHAPES)[0],
      eyeColor: pick(EYE_COLORS)[1], brows: pick(BROWS)[0], nose: pick(NOSES)[0], mouth: pick(MOUTHS)[0], facialHair: pick(FACIAL_HAIR)[0],
      hair: pick(HAIR_STYLES)[0], hairColor: pick(HAIR_COLORS),
    });
    const top = pick(ok(TOPS)), bottom = pick(ok(BOTTOMS)), shoes = pick(ok(SHOES)), hat = Math.random() < 0.2 ? NO_HAT : pick(ok(HATS)), glove = pick(ok(GLOVES));
    L.outfit = {
      top: { ...defaultCfg('top', top), color: pick(TOP_COLORS)[1], pattern: pick(top.patterns) },
      bottom: { ...defaultCfg('bottom', bottom), color: pick(BOTTOM_COLORS)[1], pattern: Math.random() < 0.7 ? 'solid' : pick(bottom.patterns), fit: pick(FITS) },
      shoes: { ...defaultCfg('shoes', shoes), colorway: Math.floor(Math.random() * shoes.colorways.length) },
      hat: hat === NO_HAT ? { id: 'hat-none' } : { ...defaultCfg('hat', hat), color: pick(TOP_COLORS)[1] },
      glove: { ...defaultCfg('glove', glove), color: pick(glove.colors)[1] },
    };
    if (L.outfit.bottom.pattern && !bottom.patterns.includes(L.outfit.bottom.pattern)) L.outfit.bottom.pattern = 'solid';
    this.app.save();
    this.preview(L);
    this.closeDetail(true);
    this.renderContent();
    this.renderEquipped();
  }
}
