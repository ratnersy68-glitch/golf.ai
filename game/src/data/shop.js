// Pro Shop catalogue (bible SKUs EQ-001..015) + inventory ownership helpers.
// Every purchasable thing has a stable id; price 0 items are owned by everyone.
import { BRAND_MODELS, BALLS, GLOVE_MODELS } from './clubs.js';
import { TOPS, BOTTOMS, SHOES, HATS, FREE_COLORWAYS, COLORWAY_PRICE } from './apparel.js';

// Ridge & Roll (BRD-06) bags and accessories. Cosmetic only.
export const BAGS = [
  { id: 'bag-basic', brand: 'Fairway Supply', model: 'Carry Bag', price: 0, look: { body: '#2a2f36', trim: '#c9ccd1', strap: '#16191d' }, card: { Style: 70 }, blurb: 'A light stand bag with room for fourteen clubs.' },
  { id: 'bag-ridge', sku: 'EQ-014', brand: 'Ridge & Roll', model: 'Ridge Carry', price: 750, look: { body: '#1f3b2c', trim: '#d9c9a3', strap: '#6b4a2b' }, card: { Style: 92 }, blurb: 'Waxed canvas and leather trim. Purely cosmetic — it just looks great beside the tee.' },
];
export const HEADCOVERS = [
  { id: 'hc-none', brand: '—', model: 'No Headcover', price: 0, look: null, card: { Style: 50 }, blurb: 'Bare driver head.' },
  { id: 'hc-ridge', sku: 'EQ-015', brand: 'Ridge & Roll', model: 'Ridge Headcover', price: 180, look: { body: '#1f3b2c', trim: '#d9c9a3', pom: '#d9c9a3' }, card: { Style: 90 }, blurb: 'Knitted driver cover with a pom-pom. Cosmetic.' },
];

export const SHOP_TABS = [
  ['driver', 'Drivers'], ['wood', 'Woods'], ['hybrid', 'Hybrids'], ['iron', 'Irons'], ['wedge', 'Wedges'], ['putter', 'Putters'],
  ['ball', 'Balls'], ['apparel', 'Apparel'], ['accessory', 'Accessories'],
];

const BRAND_NAME = { fs: 'Fairway Supply', rr: 'Ridge & Roll', gc: 'Granite Crown' };
export const colorwayId = (shoeId, i) => `${shoeId}#cw${i}`;

// kind: 'equip' (equippable gameplay/cosmetic slot) | 'apparel' (worn via the creator) | 'colorway'
function build() {
  const out = [];
  for (const [slot, list] of Object.entries(BRAND_MODELS)) {
    for (const m of list) out.push({ id: m.id, tab: slot, kind: 'equip', slot, name: m.model, brand: m.brand, sku: m.sku, price: m.price, card: m.card, blurb: m.blurb, ref: m });
  }
  for (const b of BALLS) out.push({ id: b.id, tab: 'ball', kind: 'equip', slot: 'ball', name: b.model, brand: b.brand, sku: b.sku, price: b.price, card: b.card, blurb: b.blurb, ref: b });
  for (const g of GLOVE_MODELS) out.push({ id: g.id, tab: 'accessory', kind: 'equip', slot: 'glove', name: g.model, brand: g.brand, sku: g.sku, price: g.price, card: g.card, blurb: g.blurb, ref: g });
  for (const b of BAGS) out.push({ id: b.id, tab: 'accessory', kind: 'equip', slot: 'bag', name: b.model, brand: b.brand, sku: b.sku, price: b.price, card: b.card, blurb: b.blurb, ref: b });
  for (const h of HEADCOVERS) out.push({ id: h.id, tab: 'accessory', kind: 'equip', slot: 'headcover', name: h.model, brand: h.brand, sku: h.sku, price: h.price, card: h.card, blurb: h.blurb, ref: h });
  for (const it of [...TOPS, ...BOTTOMS, ...HATS]) {
    if (it.special) continue;
    out.push({ id: it.id, tab: 'apparel', kind: 'apparel', slot: it.cat, name: it.name, brand: BRAND_NAME[it.brand], sku: it.sku, price: it.price, card: null, blurb: `${it.sub}${it.patterns.length > 1 ? ` · ${it.patterns.length} patterns` : ''} · cosmetic`, ref: it });
  }
  for (const s of SHOES) {
    s.colorways.forEach((cw, i) => out.push({ id: colorwayId(s.id, i), tab: 'apparel', kind: 'colorway', slot: 'shoes', name: `${s.name} · ${cw.name}`, brand: BRAND_NAME[s.brand], price: i < FREE_COLORWAYS ? 0 : COLORWAY_PRICE, card: null, blurb: 'Shoe colourway · cosmetic', ref: s, colorway: i }));
  }
  return out;
}
export const CATALOG = build();
export const ITEM = Object.fromEntries(CATALOG.map(it => [it.id, it]));

// ---------- ownership ----------
export function owns(p, id) {
  const it = ITEM[id];
  if (!it) return id === 'hat-none';
  return !it.price || !!p.inventory?.[id];
}
export const ownsColorway = (p, shoeId, i) => owns(p, colorwayId(shoeId, i));

// apparel config (look.outfit) uses only owned pieces?
export function outfitOwned(p, outfit) {
  if (!outfit) return true;
  for (const k of ['top', 'bottom', 'hat']) if (outfit[k]?.id && !owns(p, outfit[k].id)) return false;
  if (outfit.shoes && !ownsColorway(p, outfit.shoes.id, outfit.shoes.colorway ?? 0)) return false;
  return true;
}
// every priced item an outfit wears (used to grandfather looks made before the shop existed)
export function outfitItemIds(outfit) {
  if (!outfit) return [];
  const ids = ['top', 'bottom', 'hat'].map(k => outfit[k]?.id).filter(Boolean);
  if (outfit.shoes?.id) ids.push(colorwayId(outfit.shoes.id, outfit.shoes.colorway ?? 0));
  return ids.filter(id => ITEM[id]?.price);
}
