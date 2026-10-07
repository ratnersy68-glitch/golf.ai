// Golf apparel worn by the pros: the few garments their looks use, plus the Green Jacket.

export const BRANDS = {
  pm: { name: 'Peter Millar', logo: 'PM', font: 'serif' },
  nike: { name: 'Nike Golf', logo: 'NIKE', font: 'sans' },
  fj: { name: 'FootJoy', logo: 'FJ', font: 'serif' },
  rl: { name: 'Ralph Lauren', logo: 'RLX', font: 'serif' },
  jl: { name: 'J.Lindeberg', logo: 'J.L', font: 'sans' },
  titleist: { name: 'Titleist', logo: 'Titleist', font: 'script' },
  augusta: { name: 'Augusta National', logo: 'ANGC', font: 'serif' },
};

const L = (cat, brand, name, props) => ({ cat, brand, name, rarity: 'common', ...props });

// ---------- TOPS ----------
export const TOPS = [
  L('top', 'nike', 'Dri-FIT Victory Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Standard', patterns: ['solid', 'stripe', 'block'], n: 5 }),
  L('top', 'pm', 'Crafted Perth Quarter-Zip', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather', 'block'], rarity: 'rare', n: 2 }),
  L('top', 'nike', 'Tour Mock Neck', { sub: 'Performance', style: 'mock', collar: 'mock', sleeves: 'short', fit: 'Slim', patterns: ['solid', 'dots', 'block'], rarity: 'rare', n: 7 }),
  L('top', 'pm', 'Signature Merino Sweater', { sub: 'Sweater', style: 'sweater', collar: 'crew', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather', 'stripe'], rarity: 'epic', n: 3 }),
  L('top', 'fj', 'Heritage Sweater Vest', { sub: 'Vest', style: 'vest', collar: 'crew', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'heather', 'stripe'], rarity: 'rare', n: 21 }),
  L('top', 'augusta', 'The Green Jacket', { sub: 'Jacket', style: 'jacket', collar: 'classic', sleeves: 'long', fit: 'Classic', patterns: ['solid'], rarity: 'legendary', special: 'masters', fixedColor: '#1f6b3a', logoColor: '#f2c94c', n: 36 }),
];

// ---------- BOTTOMS ----------
export const BOTTOMS = [
  L('bottom', 'nike', 'Dri-FIT Victory Pant', { sub: 'Pants', style: 'pants', patterns: ['solid'], n: 3 }),
  L('bottom', 'pm', 'Crown Crafted Five-Pocket Pant', { sub: 'Pants', style: 'pants', patterns: ['solid', 'houndstooth', 'check'], rarity: 'uncommon', n: 0 }),
  L('bottom', 'pm', 'Salem High Drape Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid', 'check'], n: 2 }),
];

// ---------- SHOES ----------
const CW = (name, upper, accent, sole) => ({ name, upper, accent, sole });
const CLASSIC_CW = [CW('White/Black', '#f4f4f2', '#141516', '#f4f4f2'), CW('Triple White', '#f6f6f4', '#e2e2e0', '#ffffff'), CW('White/Navy', '#f4f4f2', '#1c2a44', '#1c2a44'), CW('Black/Gold', '#141516', '#c9a54a', '#141516'), CW('White/Brown Saddle', '#f2efe6', '#6b4a2b', '#6b4a2b'), CW('Grey/Blue', '#9aa0a6', '#1e56b8', '#f4f4f2')];
export const SHOES = [
  L('shoes', 'fj', 'Premiere Series Packard', { sub: 'Classic', style: 'classic', spikes: true, closure: 'laces', colorways: CLASSIC_CW, rarity: 'rare', n: 0 }),
];

// ---------- HATS ----------
export const HATS = [
  L('hat', 'titleist', 'Tour Performance Cap', { sub: 'Golf Cap', style: 'cap', patterns: ['solid', 'camo'], rarity: 'uncommon', n: 0 }),
  L('hat', 'titleist', 'Tour Visor', { sub: 'Visor', style: 'visor', patterns: ['solid'], n: 1 }),
  L('hat', 'fj', 'HydroLite Bucket Hat', { sub: 'Bucket', style: 'bucket', patterns: ['solid', 'camo'], n: 7 }),
  L('hat', 'jl', 'Tweed Flat Cap', { sub: 'Flat Cap', style: 'flatcap', patterns: ['solid', 'plaid'], rarity: 'legendary', n: 13 }),
  L('hat', 'rl', 'Straw Panama', { sub: 'Panama', style: 'panama', patterns: ['solid'], rarity: 'legendary', n: 14 }),
];

// ---------- GLOVES ----------
export const GLOVES = [
  L('glove', 'fj', 'StaSof', { sub: 'Cabretta Leather', colors: [['White', '#f4f4f2'], ['Black', '#141516'], ['Navy', '#1c2a44']], n: 0 }),
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

// the Green Jacket is only worn by the Masters champion
export const GREEN_JACKET = TOPS.find(t => t.special === 'masters');

export const DEFAULT_OUTFIT = {
  top: { id: TOPS[0].id, color: '#f4f4f2', pattern: 'solid' },
  bottom: { id: BOTTOMS[0].id, color: '#1d2638', pattern: 'solid', fit: 'Regular' },
  shoes: { id: SHOES[0].id, colorway: 0, spikes: true, closure: 'laces' },
  hat: { id: HATS[0].id, color: '#1c2a44', pattern: 'solid', logo: true, fit: 'Structured' },
  glove: { id: GLOVES[0].id, color: '#f4f4f2' },
};

