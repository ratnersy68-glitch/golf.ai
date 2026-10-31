// Golf apparel worn by the golfers (fictional brands BRD-05 Fairway Supply, BRD-06 Ridge & Roll), plus the
// Granite Crown champion's blazer.

export const BRANDS = {
  fs: { name: 'Fairway Supply', logo: 'FS', font: 'serif' },
  rr: { name: 'Ridge & Roll', logo: 'R&R', font: 'sans' },
  gc: { name: 'Granite Crown', logo: 'GC', font: 'serif' },
}

// price: Golf Coins in the Pro Shop (0 = free starter item)
const L = (cat, brand, name, props) => ({ cat, brand, name, rarity: 'common', price: 0, ...props });

// ---------- TOPS ----------
export const TOPS = [
  L('top', 'fs', 'Fairway Basic Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Standard', patterns: ['solid'], n: 5 }),
  L('top', 'fs', 'Fairway Tour Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Athletic', patterns: ['solid', 'stripe', 'pinstripe', 'block'], rarity: 'uncommon', sku: 'EQ-013', price: 400, n: 8 }),
  L('top', 'fs', 'Fairway Quarter-Zip', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather', 'block'], rarity: 'rare', price: 450, n: 2 }),
  L('top', 'fs', 'Fairway Mock Neck', { sub: 'Performance', style: 'mock', collar: 'mock', sleeves: 'short', fit: 'Slim', patterns: ['solid', 'dots', 'block'], rarity: 'rare', price: 400, n: 7 }),
  L('top', 'fs', 'Fairway Merino Sweater', { sub: 'Sweater', style: 'sweater', collar: 'crew', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather', 'stripe'], rarity: 'epic', price: 600, n: 3 }),
  L('top', 'fs', 'Fairway Heritage Vest', { sub: 'Vest', style: 'vest', collar: 'crew', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'heather', 'stripe'], rarity: 'rare', price: 500, n: 21 }),
  L('top', 'gc', "Champion's Blazer", { sub: 'Jacket', style: 'jacket', collar: 'classic', sleeves: 'long', fit: 'Classic', patterns: ['solid'], rarity: 'legendary', special: 'major', fixedColor: '#2c3038', logoColor: '#c9ccd1', n: 36 }),
];

// ---------- BOTTOMS ----------
export const BOTTOMS = [
  L('bottom', 'fs', 'Fairway Tour Pant', { sub: 'Pants', style: 'pants', patterns: ['solid'], n: 3 }),
  L('bottom', 'fs', 'Fairway Five-Pocket Pant', { sub: 'Pants', style: 'pants', patterns: ['solid', 'houndstooth', 'check'], rarity: 'uncommon', price: 300, n: 0 }),
  L('bottom', 'fs', 'Fairway Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid', 'check'], n: 2 }),
];

// ---------- SHOES ----------
const CW = (name, upper, accent, sole) => ({ name, upper, accent, sole });
const CLASSIC_CW = [CW('White/Black', '#f4f4f2', '#141516', '#f4f4f2'), CW('Triple White', '#f6f6f4', '#e2e2e0', '#ffffff'), CW('White/Navy', '#f4f4f2', '#1c2a44', '#1c2a44'), CW('Black/Gold', '#141516', '#c9a54a', '#141516'), CW('White/Brown Saddle', '#f2efe6', '#6b4a2b', '#6b4a2b'), CW('Grey/Blue', '#9aa0a6', '#1e56b8', '#f4f4f2')];
// the first FREE_COLORWAYS colourways of a shoe are free, the rest cost COLORWAY_PRICE each
export const FREE_COLORWAYS = 2;
export const COLORWAY_PRICE = 150;
export const SHOES = [
  L('shoes', 'fs', 'Fairway Classic Shoe', { sub: 'Classic', style: 'classic', spikes: true, closure: 'laces', colorways: CLASSIC_CW, rarity: 'rare', n: 0 }),
];

// ---------- HATS ----------
export const HATS = [
  L('hat', 'fs', 'Fairway Tour Cap', { sub: 'Golf Cap', style: 'cap', patterns: ['solid', 'camo'], rarity: 'uncommon', n: 0 }),
  L('hat', 'fs', 'Fairway Visor', { sub: 'Visor', style: 'visor', patterns: ['solid'], price: 200, n: 1 }),
  L('hat', 'rr', 'Ridge Bucket Hat', { sub: 'Bucket', style: 'bucket', patterns: ['solid', 'camo'], price: 250, n: 7 }),
  L('hat', 'fs', 'Fairway Tweed Flat Cap', { sub: 'Flat Cap', style: 'flatcap', patterns: ['solid', 'plaid'], rarity: 'legendary', price: 350, n: 13 }),
  L('hat', 'fs', 'Fairway Straw Panama', { sub: 'Panama', style: 'panama', patterns: ['solid'], rarity: 'legendary', price: 400, n: 14 }),
];

// ---------- GLOVES ----------
export const GLOVES = [
  L('glove', 'fs', 'Fairway Classic', { sub: 'Cabretta Leather', colors: [['White', '#f4f4f2'], ['Black', '#141516'], ['Navy', '#1c2a44']], n: 0 }),
];

export const ALL_ITEMS = {};
for (const [cat, list] of [['top', TOPS], ['bottom', BOTTOMS], ['shoes', SHOES], ['hat', HATS], ['glove', GLOVES]]) {
  list.forEach((it, i) => {
    it.id = `${cat}-${it.brand}-${it.n}`; // original catalogue index keeps ids stable
    ALL_ITEMS[it.id] = it;
  });
}
export const NO_HAT = { id: 'hat-none', cat: 'hat', brand: null, name: 'No Hat', sub: 'None', style: 'none', patterns: ['solid'], rarity: 'common' };
ALL_ITEMS['hat-none'] = NO_HAT;

// the champion's blazer is only worn by the Granite Crown champion
export const CHAMPION_BLAZER = TOPS.find(t => t.special === 'major');

export const DEFAULT_OUTFIT = {
  top: { id: TOPS[0].id, color: '#f4f4f2', pattern: 'solid' },
  bottom: { id: BOTTOMS[0].id, color: '#1d2638', pattern: 'solid', fit: 'Regular' },
  shoes: { id: SHOES[0].id, colorway: 0, spikes: true, closure: 'laces' },
  hat: { id: HATS[0].id, color: '#1c2a44', pattern: 'solid', logo: true, fit: 'Structured' },
  glove: { id: GLOVES[0].id, color: '#f4f4f2' },
};

