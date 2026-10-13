// Pro Shop: browse the catalogue by category, preview an item in 3D and buy / equip it with Golf Coins.
import { CATALOG, ITEM, SHOP_TABS, owns } from '../data/shop.js';
import { buildBag } from '../data/clubs.js';
import { customAttrs } from '../core/profile.js';
import { buy, fmtCoins } from '../core/wallet.js';
import { portrait } from './portrait.js';
import { ClubViewer } from '../render/clubViewer.js';
import { buildGolfBag, buildBall } from '../render/bagModel.js';
import { normalizeLook } from '../data/look.js';
import { audio } from '../audio/audio.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// the club shown for each equipment slot
const SHOWCASE = { driver: 'DR', wood: '3W', hybrid: '3H', iron: '7I', wedge: 'SW', putter: 'PT' };
const ICON = { driver: '🏌', wood: '🏌', hybrid: '🏌', iron: '🏌', wedge: '🏌', putter: '⛳', ball: '⚪', glove: '🧤', bag: '🎒', headcover: '🧦', top: '👕', bottom: '👖', hat: '🧢', shoes: '👟' };
export const coinHtml = (n, cls = '') => `<span class="coins ${cls}"><i class="coin-ico">G</i>${fmtCoins(n)}</span>`;

export class ProShop {
  constructor(menus) { this.menus = menus; this.tab = 'driver'; this.sel = null; }
  get app() { return this.menus.app; }
  get p() { return this.menus.profile; }

  // the outfit currently worn by the player's golfer
  outfit() { const p = this.p; return (p.golfer ? p.golfer.look : p.look).outfit; }

  state(it) {
    const p = this.p;
    if (it.kind === 'equip') return p.equipment[it.slot] === it.id ? 'equipped' : owns(p, it.id) ? 'owned' : 'shop';
    const o = this.outfit();
    const worn = it.kind === 'colorway' ? o.shoes?.id === it.ref.id && (o.shoes.colorway ?? 0) === it.colorway : o[it.slot]?.id === it.id;
    return worn ? 'equipped' : owns(p, it.id) ? 'owned' : 'shop';
  }

  open(tab, itemId) {
    if (tab) this.tab = tab;
    const items = CATALOG.filter(i => i.tab === this.tab);
    this.sel = itemId && ITEM[itemId] ? itemId : (items.find(i => this.state(i) === 'equipped') || items[0]).id;
    this.render();
  }

  tag(it) {
    const s = this.state(it);
    if (s === 'equipped') return '<span class="sh-tag eq">EQUIPPED</span>';
    if (s === 'owned') return '<span class="sh-tag own">OWNED</span>';
    return it.price ? coinHtml(it.price, this.p.coins >= it.price ? '' : 'short') : '<span class="sh-tag own">FREE</span>';
  }

  bars(card) {
    if (!card) return '';
    return `<div class="sh-bars">${Object.entries(card).map(([k, v]) => `<div class="sh-bar"><span>${esc(k)}</span><div class="minibar"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join('')}</div>`;
  }

  render() {
    const p = this.p;
    const items = CATALOG.filter(i => i.tab === this.tab);
    const it = ITEM[this.sel] || items[0];
    const st = this.state(it);
    const action = st === 'equipped' ? '<button class="btn" disabled>EQUIPPED</button>'
      : st === 'owned' ? `<button class="btn primary" id="sh-equip">${it.kind === 'equip' ? 'EQUIP' : 'WEAR'}</button>`
        : `<button class="btn primary" id="sh-buy" ${p.coins < it.price ? 'disabled' : ''}>BUY · ${coinHtml(it.price)}</button>${p.coins < it.price ? `<div class="sh-need">You need ${fmtCoins(it.price - p.coins)} more coins — earn them by finishing rounds.</div>` : ''}`;
    this.menus.render(`
      <div class="page shop">
        <div class="page-head"><button class="btn ghost" data-go="main">‹ MENU</button><div class="page-title">PRO SHOP</div>${coinHtml(p.coins, 'big')}</div>
        <div class="sh-tabs chips">${SHOP_TABS.map(([k, n]) => `<button class="chip ${this.tab === k ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('')}</div>
        <div class="sh-layout">
          <div class="sh-grid">${items.map(i => `
            <button class="sh-card glass ${i.id === it.id ? 'sel' : ''} ${this.state(i)}" data-item="${esc(i.id)}">
              <div class="sh-ico">${ICON[i.slot] || '🛍'}</div>
              <div class="sh-name"><small>${esc(i.brand)}${i.sku ? ` · ${i.sku}` : ''}</small><b>${esc(i.name)}</b></div>
              ${this.bars(i.card)}
              <div class="sh-foot">${this.tag(i)}</div>
            </button>`).join('')}</div>
          <div class="sh-detail glass">
            <div class="sh-preview">${this.previewHtml(it)}</div>
            <div class="sh-dname"><small>${esc(it.brand)}${it.sku ? ` · ${it.sku}` : ''}</small><b>${esc(it.name)}</b></div>
            ${this.bars(it.card)}
            <div class="sh-blurb">${esc(it.blurb)}</div>
            ${it.kind === 'apparel' && it.ref.patterns?.length > 1 ? `<div class="dim">Patterns: ${it.ref.patterns.join(' · ')}</div>` : ''}
            <div class="sh-actions">${action}</div>
            <div class="sh-note dim">Golf Coins are earned in play only. No real money, ever.</div>
          </div>
        </div>
      </div>`, 'page-screen');
    const root = this.menus.root;
    root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { audio.click(); this.open(b.dataset.tab); });
    root.querySelectorAll('[data-item]').forEach(b => b.onclick = () => { audio.click(); this.sel = b.dataset.item; this.render(); });
    const bb = root.querySelector('#sh-buy');
    if (bb) bb.onclick = () => this.buy(it);
    const eb = root.querySelector('#sh-equip');
    if (eb) eb.onclick = () => { this.equip(it); audio.click(); this.render(); };
    this.mountViewer(it);
  }

  previewHtml(it) {
    if (it.kind === 'equip' && it.slot !== 'glove') return '<canvas class="sh-canvas"></canvas>';
    if (it.kind === 'colorway') {
      const cw = it.ref.colorways[it.colorway];
      return `<div class="sh-swatch">${['upper', 'accent', 'sole'].map(k => `<i style="background:${cw[k]}"></i>`).join('')}<span>${esc(cw.name)}</span></div>`;
    }
    if (it.kind === 'apparel') {
      const look = normalizeLook(JSON.parse(JSON.stringify(this.p.golfer ? { ...this.p.golfer.look, hand: this.p.golfer.hand } : this.p.look)));
      this.wearOn(look.outfit, it);
      return `<div class="sh-portrait">${portrait(look)}</div>`;
    }
    return `<div class="sh-bigico">${ICON[it.slot] || '🛍'}</div>`;
  }

  // one canvas + WebGL context for the whole shop, moved into each new detail panel
  mountViewer(it) {
    const slot = this.menus.root.querySelector('.sh-canvas');
    if (!slot) { this.viewer?.stop(); return; }
    try {
      if (!this.canvas) { this.canvas = document.createElement('canvas'); this.canvas.className = 'sh-canvas'; this.viewer = new ClubViewer(this.canvas); }
      slot.replaceWith(this.canvas);
      this.viewer.w = 0;
      const eq = this.p.equipment;
      if (SHOWCASE[it.slot]) {
        const club = buildBag([SHOWCASE[it.slot]], { ...eq, [it.slot]: it.id }, customAttrs(this.p))[0];
        this.viewer.setClub(club);
      } else if (it.slot === 'ball') this.viewer.setModel(buildBall(it.ref.color));
      else if (it.slot === 'bag') this.viewer.setModel(buildGolfBag(it.id, eq.headcover));
      else if (it.slot === 'headcover') this.viewer.setModel(buildGolfBag(eq.bag, it.id));
      this.viewer.start();
      // stop rendering once the shop is gone
      clearInterval(this.watch);
      this.watch = setInterval(() => { if (!this.canvas.isConnected) { this.viewer.stop(); clearInterval(this.watch); } }, 500);
    } catch (e) { console.warn('shop preview failed', e); }
  }

  buy(it) {
    const r = buy(this.p, it);
    if (!r.ok) { audio.tick(false); return; }
    this.equip(it);
    audio.jingle?.('unlock');
    this.app.save();
    this.render();
    this.menus.toast?.(`Purchased ${it.name}`);
  }

  // dress the outfit object in an apparel piece / shoe colourway
  wearOn(o, it) {
    if (it.kind === 'colorway') { o.shoes = { ...o.shoes, id: it.ref.id, colorway: it.colorway }; return; }
    const cur = o[it.slot] || {};
    const pattern = it.ref.patterns.includes(cur.pattern) ? cur.pattern : 'solid';
    if (it.slot === 'hat') o.hat = { color: '#1c2a44', logo: true, fit: 'Structured', ...(cur.id === 'hat-none' ? {} : cur), id: it.id, pattern };
    else o[it.slot] = { ...cur, id: it.id, pattern };
  }

  equip(it) {
    const p = this.p;
    if (!owns(p, it.id)) return;
    if (it.kind === 'equip') p.equipment[it.slot] = it.id;
    else {
      if (p.golfer) this.wearOn(p.golfer.look.outfit, it);
      this.wearOn(p.look.outfit, it);
    }
    this.app.save();
  }
}

// club categories in the bag screen, with the slot each belongs to
export const BAG_SLOTS = [['driver', 'Driver'], ['wood', 'Fairway woods'], ['hybrid', 'Hybrids'], ['iron', 'Irons'], ['wedge', 'Wedges'], ['putter', 'Putter'], ['ball', 'Golf ball'], ['glove', 'Glove'], ['bag', 'Golf bag'], ['headcover', 'Headcover']];
