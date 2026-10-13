// Create Golfer / My Golfer: build a golfer (name, handedness, body, face, hair, clothes) with a live 3D
// preview, and place attribute points. The golfer is saved in profile.golfer and can be played in every mode.
import {
  SKIN_TONES, HAIR_COLORS, EYE_COLORS, HAIR_STYLES, FACE_SHAPES, EYE_SHAPES, BROWS, NOSES, MOUTHS, JAWS, FACIAL_HAIR, ACCESSORIES,
} from '../data/look.js';
import { TOPS, BOTTOMS, SHOES, HATS, GLOVES, ALL_ITEMS } from '../data/apparel.js';
import { ATTRS, ATTR_START, ATTR_CREATE_MAX, ATTR_MAX, golferOverall } from '../data/golfers.js';
import { newGolfer } from '../core/profile.js';
import { audio } from '../audio/audio.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clone = (o) => JSON.parse(JSON.stringify(o));
const TABS = [['profile', 'PROFILE'], ['body', 'BODY'], ['face', 'FACE'], ['hair', 'HAIR'], ['clothes', 'CLOTHES'], ['skills', 'SKILLS']];
const FOCUS = { profile: 'full', body: 'full', face: 'head', hair: 'head', clothes: 'full', skills: 'full' };
const CLOTH_COLORS = ['#f4f4f2', '#141516', '#1c2a44', '#2f5d9a', '#8cc4ea', '#1f5a3a', '#6aa04a', '#9cb59a', '#c1121f', '#6e1a2a', '#f2b8c6', '#f5dd7a', '#f28a3c', '#a9adb2', '#3c4046', '#0d7373', '#d8d0bf', '#6b4a2b'];
const TOP_LIST = () => TOPS.filter(t => !t.special);

export class Creator {
  constructor(menus) { this.menus = menus; }
  get app() { return this.menus.app; }
  get profile() { return this.menus.profile; }

  open(tab = null) {
    const p = this.profile;
    const isNew = !p.golfer;
    // a new golfer starts from the look saved in older versions of the game (or the default)
    const base = p.golfer ? clone(p.golfer) : newGolfer('', { ...p.look, name: '' });
    this.st = { g: base, saved: p.golfer ? clone(p.golfer.attrs) : null, isNew, tab: tab || 'profile', dirty: false, fromLevel: 0 };
    this.render();
  }

  // points still to place: creation points first, then level-up skill points
  points() {
    const { g } = this.st;
    return (g.pool || 0) + (this.st.isNew ? 0 : this.profile.skillPoints || 0);
  }

  render() {
    const { g, tab, isNew } = this.st;
    const ovr = golferOverall(g);
    const body = this[`tab_${tab}`]();
    this.menus.render(`
      <div class="creator">
        <div class="cr-panel glass">
          <div class="cr-head">
            <button class="btn ghost" id="cr-back">‹ ${isNew ? 'MENU' : 'BACK'}</button>
            <div class="cr-title">${isNew ? 'CREATE GOLFER' : 'MY GOLFER'}<small>${esc(g.name || 'Unnamed golfer')} · ${g.hand === 'L' ? 'Left' : 'Right'}-handed</small></div>
            <div class="cr-ovr"><b>${ovr}</b><span>OVR</span></div>
          </div>
          <div class="cr-tabs">${TABS.map(([id, n]) => `<button class="gtab ${tab === id ? 'on' : ''}" data-crtab="${id}">${n}${id === 'skills' && this.points() ? ` <i>${this.points()}</i>` : ''}</button>`).join('')}</div>
          <div class="cr-body">${body}</div>
          <div class="cr-foot">
            <button class="btn" id="cr-random">🎲 RANDOM LOOK</button>
            <button class="btn primary" id="cr-save">${isNew ? 'CREATE GOLFER ▸' : 'SAVE'}</button>
          </div>
          <div class="cr-msg" id="cr-msg"></div>
        </div>
        <div class="cr-hint">Drag to turn · scroll to zoom</div>
      </div>`, 'page-screen transparent creator-screen');
    this.bind();
    this.preview();
  }

  preview() {
    const { g, tab } = this.st;
    this.app.golferPreview({ ...g.look, hand: g.hand, name: g.name }, { focus: FOCUS[tab] || 'full', side: 0.3 });
  }

  // ---------- small UI builders ----------
  chips(key, list, cur) {
    return `<div class="chips">${list.map(([v, n]) => `<button class="chip ${cur === v ? 'on' : ''}" data-set="${key}" data-v="${esc(v)}">${esc(n)}</button>`).join('')}</div>`;
  }
  swatches(key, list, cur) {
    return `<div class="swatches">${list.map(c => { const v = Array.isArray(c) ? c[1] : c; return `<button class="sw ${String(cur).toLowerCase() === String(v).toLowerCase() ? 'on' : ''}" data-set="${key}" data-v="${v}" style="background:${v}" title="${Array.isArray(c) ? esc(c[0]) : v}"></button>`; }).join('')}</div>`;
  }
  slider(key, label, min, max, cur, lo, hi) {
    return `<div class="cr-row"><label>${label}</label><div class="cr-slide"><span>${lo}</span><input type="range" min="${min}" max="${max}" step="0.01" value="${cur}" data-range="${key}"><span>${hi}</span></div></div>`;
  }
  row(label, html) { return `<div class="cr-row"><label>${label}</label>${html}</div>`; }

  // ---------- tabs ----------
  tab_profile() {
    const { g } = this.st;
    return this.row('Name', `<input class="cr-name" id="cr-name" maxlength="18" placeholder="Your golfer's name" value="${esc(g.name)}">`)
      + this.row('Plays', this.chips('hand', [['R', 'Right-handed'], ['L', 'Left-handed']], g.hand))
      + `<div class="cr-note">Your golfer plays in Quick Round, 9 Holes, Practice and the Granite Crown. Rounds you play improve the matching skills, and every level gives you 3 skill points to place in Skills.</div>`;
  }
  tab_body() {
    const L = this.st.g.look;
    return this.row('Skin tone', this.swatches('skin', SKIN_TONES, SKIN_TONES[L.skin]))
      + this.slider('height', 'Height', 0.92, 1.08, L.height ?? 1, 'Shorter', 'Taller')
      + this.slider('build', 'Build', 0.88, 1.2, L.build ?? 1, 'Slim', 'Strong')
      + this.slider('shoulders', 'Shoulders', 0.9, 1.1, L.shoulders ?? 1, 'Narrow', 'Broad');
  }
  tab_face() {
    const L = this.st.g.look;
    return this.row('Face shape', this.chips('faceShape', FACE_SHAPES, L.faceShape))
      + this.row('Jaw', this.chips('jaw', JAWS, L.jaw))
      + this.row('Eyes', this.chips('eyeShape', EYE_SHAPES, L.eyeShape))
      + this.row('Eye color', this.swatches('eyeColor', EYE_COLORS, L.eyeColor))
      + this.row('Brows', this.chips('brows', BROWS, L.brows))
      + this.row('Nose', this.chips('nose', NOSES, L.nose))
      + this.row('Mouth', this.chips('mouth', MOUTHS, L.mouth))
      + this.row('Facial hair', this.chips('facialHair', FACIAL_HAIR, L.facialHair))
      + this.row('Accessories', this.chips('accessory', ACCESSORIES, L.accessory));
  }
  tab_hair() {
    const L = this.st.g.look;
    return this.row('Style', this.chips('hair', HAIR_STYLES, L.hair))
      + this.row('Color', this.swatches('hairColor', HAIR_COLORS, L.hairColor));
  }
  tab_clothes() {
    const o = this.st.g.look.outfit;
    const hatList = [['hat-none', 'No hat'], ...HATS.map(h => [h.id, h.sub])];
    const shoe = ALL_ITEMS[o.shoes.id] || SHOES[0];
    return this.row('Top', this.chips('top', TOP_LIST().map(t => [t.id, t.sub]), o.top.id))
      + this.row('Top color', this.swatches('topColor', CLOTH_COLORS, o.top.color))
      + this.row('Bottoms', this.chips('bottom', BOTTOMS.map(b => [b.id, b.sub]), o.bottom.id))
      + this.row('Bottoms color', this.swatches('bottomColor', CLOTH_COLORS, o.bottom.color))
      + this.row('Hat', this.chips('hat', hatList, o.hat.id))
      + (o.hat.id !== 'hat-none' ? this.row('Hat color', this.swatches('hatColor', CLOTH_COLORS, o.hat.color)) : '')
      + this.row('Shoes', this.chips('shoes', shoe.colorways.map((c, i) => [String(i), c.name]), String(o.shoes.colorway ?? 0)))
      + this.row('Glove', this.swatches('glove', GLOVES[0].colors.map(c => c[1]), o.glove.color))
      + `<div class="cr-note">Clothing is by Fairway Supply and Ridge &amp; Roll. More gear arrives with the Pro Shop.</div>`;
  }
  tab_skills() {
    const { g, saved, isNew } = this.st;
    const pts = this.points();
    const cap = isNew ? ATTR_CREATE_MAX : ATTR_MAX;
    return `<div class="cr-points ${pts ? 'has' : ''}"><b>${pts}</b> point${pts === 1 ? '' : 's'} to place${isNew ? ` · up to ${ATTR_CREATE_MAX} each when creating` : ''}</div>`
      + ATTRS.map(([k, n, d]) => {
        const v = Math.round(g.attrs[k]);
        const min = isNew ? ATTR_START : Math.round(saved?.[k] ?? ATTR_START);
        return `<div class="cr-attr">
          <div class="cr-attr-top"><b>${n}</b><span>${d}</span></div>
          <div class="cr-attr-bar"><button class="cr-pm" data-attr="${k}" data-d="-1" ${v <= min ? 'disabled' : ''}>−</button>
            <i><b style="width:${v}%"></b></i><em>${v}</em>
            <button class="cr-pm" data-attr="${k}" data-d="1" ${!pts || v >= cap ? 'disabled' : ''}>+</button></div>
        </div>`;
      }).join('');
  }

  // ---------- events ----------
  set(key, v) {
    const g = this.st.g, L = g.look, o = L.outfit;
    switch (key) {
      case 'hand': g.hand = v; break;
      case 'skin': L.skin = Math.max(0, SKIN_TONES.indexOf(v)); break;
      case 'top': o.top = { ...o.top, id: v }; break;
      case 'topColor': o.top = { ...o.top, color: v }; break;
      case 'bottom': o.bottom = { ...o.bottom, id: v }; break;
      case 'bottomColor': o.bottom = { ...o.bottom, color: v }; break;
      case 'hat': o.hat = v === 'hat-none' ? { id: 'hat-none' } : { id: v, color: o.hat.color || '#1c2a44', pattern: 'solid', logo: true, fit: 'Structured' }; break;
      case 'hatColor': o.hat = { ...o.hat, color: v }; break;
      case 'shoes': o.shoes = { ...o.shoes, colorway: +v }; break;
      case 'glove': o.glove = { ...o.glove, color: v }; break;
      default: L[key] = v;
    }
    this.st.dirty = true;
  }

  bind() {
    const root = this.menus.root, $ = (s) => root.querySelector(s);
    root.querySelectorAll('[data-crtab]').forEach(b => b.onclick = () => { audio.click(); this.st.tab = b.dataset.crtab; this.render(); });
    root.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { audio.click(); this.set(b.dataset.set, b.dataset.v); this.render(); });
    root.querySelectorAll('[data-range]').forEach(r => r.oninput = () => { this.st.g.look[r.dataset.range] = +r.value; this.st.dirty = true; this.preview(); });
    const name = $('#cr-name');
    if (name) name.oninput = () => { this.st.g.name = name.value.replace(/[<>]/g, '').slice(0, 18); this.st.dirty = true; };
    root.querySelectorAll('.cr-pm').forEach(b => b.onclick = () => this.spend(b.dataset.attr, +b.dataset.d));
    $('#cr-random').onclick = () => { audio.click(); this.randomLook(); this.render(); };
    $('#cr-save').onclick = () => this.save();
    $('#cr-back').onclick = () => {
      audio.click();
      // leaving without saving: give back any level-up points placed this session
      if (this.st.fromLevel) { this.profile.skillPoints += this.st.fromLevel; this.st.fromLevel = 0; }
      this.app.menuScene(); this.menus.main();
    };
  }

  // place or take back a point: creation points are used first, then level-up skill points.
  // Only points placed in this session can be taken back (st.fromLevel counts the level-up ones).
  spend(k, d) {
    const { g, saved, isNew } = this.st;
    const p = this.profile;
    const cap = isNew ? ATTR_CREATE_MAX : ATTR_MAX;
    const min = isNew ? ATTR_START : Math.round(saved?.[k] ?? ATTR_START);
    const v = Math.round(g.attrs[k]);
    if (d > 0) {
      if (v >= cap || !this.points()) return;
      if (g.pool > 0) g.pool--;
      else { p.skillPoints--; this.st.fromLevel = (this.st.fromLevel || 0) + 1; }
      g.attrs[k] = v + 1;
    } else {
      if (v <= min) return;
      g.attrs[k] = v - 1;
      if (this.st.fromLevel > 0) { p.skillPoints++; this.st.fromLevel--; } else g.pool++;
    }
    audio.tick?.(true);
    this.st.dirty = true;
    this.render();
  }

  randomLook() {
    const L = this.st.g.look, o = L.outfit, pick = (a) => a[Math.floor(Math.random() * a.length)];
    L.skin = Math.floor(Math.random() * SKIN_TONES.length);
    L.faceShape = pick(FACE_SHAPES)[0]; L.jaw = pick(JAWS)[0]; L.eyeShape = pick(EYE_SHAPES)[0]; L.eyeColor = pick(EYE_COLORS)[1];
    L.brows = pick(BROWS)[0]; L.nose = pick(NOSES)[0]; L.mouth = pick(MOUTHS)[0];
    L.facialHair = Math.random() < 0.6 ? 'none' : pick(FACIAL_HAIR)[0];
    L.accessory = Math.random() < 0.75 ? 'none' : pick(ACCESSORIES)[0];
    L.hair = pick(HAIR_STYLES)[0]; L.hairColor = pick(HAIR_COLORS);
    L.height = +(0.94 + Math.random() * 0.12).toFixed(2); L.build = +(0.92 + Math.random() * 0.22).toFixed(2); L.shoulders = +(0.94 + Math.random() * 0.12).toFixed(2);
    o.top = { id: pick(TOP_LIST()).id, color: pick(CLOTH_COLORS), pattern: 'solid' };
    o.bottom = { ...o.bottom, id: pick(BOTTOMS).id, color: pick(['#141516', '#1c2a44', '#3c4046', '#a9adb2', '#d8d0bf', '#f4f4f2']) };
    o.hat = Math.random() < 0.3 ? { id: 'hat-none' } : { id: pick(HATS).id, color: pick(CLOTH_COLORS), pattern: 'solid', logo: true, fit: 'Structured' };
    o.shoes = { ...o.shoes, colorway: Math.floor(Math.random() * (SHOES[0].colorways.length)) };
    this.st.dirty = true;
  }

  msg(t) { const m = this.menus.root.querySelector('#cr-msg'); if (m) { m.textContent = t; m.classList.add('show'); } }

  save() {
    const { g, isNew } = this.st;
    g.name = (g.name || '').trim();
    if (!g.name) { audio.tick?.(false); this.st.tab = 'profile'; this.render(); this.msg('Give your golfer a name first.'); return; }
    const p = this.profile;
    p.golfer = clone(g);
    p.look = clone(g.look); // keep the older field in step for anything still reading it
    this.app.save();
    audio.jingle?.('unlock');
    this.st = { ...this.st, g: clone(p.golfer), saved: clone(p.golfer.attrs), isNew: false, dirty: false, fromLevel: 0 };
    if (isNew) { this.st.tab = 'skills'; this.render(); this.msg(`${g.name} is ready. Place your points, then tee it up from the main menu.`); }
    else { this.render(); this.msg('Saved.'); }
  }
}
