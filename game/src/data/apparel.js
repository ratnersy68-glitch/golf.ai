// Golf apparel catalogue: brands, product lines, colorways, patterns, fits and rarity.
// Every line comes in many colors x patterns, giving thousands of combinations.
// Rarity is cosmetic only (it never affects golf performance).

export const RARITY = {
  common: { name: 'COMMON', color: '#9aa4a0', unlock: 1 },
  uncommon: { name: 'UNCOMMON', color: '#3ddc84', unlock: 1 },
  rare: { name: 'RARE', color: '#4ab3ff', unlock: 2 },
  epic: { name: 'EPIC', color: '#b36bff', unlock: 4 },
  legendary: { name: 'LEGENDARY', color: '#f2b233', unlock: 6 },
};

export const BRANDS = {
  pm: { name: 'Peter Millar', logo: 'PM', font: 'serif' },
  nike: { name: 'Nike Golf', logo: 'NIKE', font: 'sans' },
  adidas: { name: 'adidas Golf', logo: 'adidas', font: 'sans' },
  ua: { name: 'Under Armour', logo: 'UA', font: 'sans' },
  fj: { name: 'FootJoy', logo: 'FJ', font: 'serif' },
  travis: { name: 'TravisMathew', logo: 'TM', font: 'sans' },
  rl: { name: 'Ralph Lauren', logo: 'RLX', font: 'serif' },
  jl: { name: 'J.Lindeberg', logo: 'J.L', font: 'sans' },
  lulu: { name: 'lululemon', logo: 'lulu', font: 'sans' },
  titleist: { name: 'Titleist', logo: 'Titleist', font: 'script' },
  callaway: { name: 'Callaway', logo: 'CALLAWAY', font: 'sans' },
  tmade: { name: 'TaylorMade', logo: 'TM', font: 'sans' },
  puma: { name: 'PUMA Golf', logo: 'PUMA', font: 'sans' },
  nb: { name: 'New Balance', logo: 'NB', font: 'sans' },
  ecco: { name: 'ECCO', logo: 'ECCO', font: 'sans' },
  malbon: { name: 'Malbon Golf', logo: 'MALBON', font: 'serif' },
  imperial: { name: 'Imperial', logo: 'IMPERIAL', font: 'serif' },
};

export const TOP_COLORS = [
  ['White', '#f4f4f2'], ['Black', '#141516'], ['Navy', '#1c2a44'], ['Royal', '#1e56b8'], ['Sky', '#8cc4ea'],
  ['Sage', '#9cb59a'], ['Forest', '#1f5a3a'], ['Masters Green', '#1f6b3a'], ['Red', '#c1121f'], ['Burgundy', '#6e1a2a'],
  ['Pink', '#f2b8c6'], ['Lavender', '#b7a6e0'], ['Butter', '#f5dd7a'], ['Orange', '#f28a3c'], ['Heather Grey', '#a9adb2'],
  ['Charcoal', '#3c4046'], ['Teal', '#0d7373'], ['Coral', '#f47c6b'], ['Cream', '#efe6d2'], ['Mint', '#b6ead3'],
];
export const BOTTOM_COLORS = [
  ['Black', '#16171a'], ['Navy', '#1d2638'], ['Khaki', '#c6b58d'], ['Stone', '#d8d0bf'], ['Grey', '#8e9399'],
  ['Charcoal', '#3b3f45'], ['White', '#f1f1ee'], ['Olive', '#5b6139'], ['Forest', '#24452f'], ['Light Blue', '#9ec0dc'],
  ['Burgundy', '#5e1b26'], ['Sand', '#e2cfa6'],
];

export const TOP_PATTERNS = [
  ['solid', 'Solid'], ['stripe', 'Stripe'], ['pinstripe', 'Pinstripe'], ['gingham', 'Gingham'],
  ['heather', 'Heather'], ['dots', 'Micro Print'], ['palms', 'Palm Print'], ['block', 'Color Block'],
];
export const BOTTOM_PATTERNS = [['solid', 'Solid'], ['plaid', 'Plaid'], ['stripe', 'Pinstripe'], ['houndstooth', 'Houndstooth'], ['check', 'Check']];
export const HAT_PATTERNS = [['solid', 'Solid'], ['camo', 'Camo'], ['plaid', 'Plaid'], ['stripe', 'Stripe']];

const ALLP = TOP_PATTERNS.map(p => p[0]);
const L = (cat, brand, name, props) => ({ cat, brand, name, rarity: 'common', ...props });

// ---------- TOPS ----------
// style: polo | perf | mock | quarterzip | longsleeve | sweater | vest
export const TOPS = [
  L('top', 'pm', 'Crown Sport Performance Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Athletic', patterns: ['solid', 'stripe', 'pinstripe', 'heather'], rarity: 'uncommon' }),
  L('top', 'pm', 'Solid Stretch Jersey Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'heather'] }),
  L('top', 'pm', 'Crafted Perth Quarter-Zip', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather', 'block'], rarity: 'rare' }),
  L('top', 'pm', 'Signature Merino Sweater', { sub: 'Sweater', style: 'sweater', collar: 'crew', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather', 'stripe'], rarity: 'epic' }),
  L('top', 'pm', 'Seaside Gingham Polo', { sub: 'Polo', style: 'polo', collar: 'buttondown', sleeves: 'short', fit: 'Classic', patterns: ['gingham', 'pinstripe'], rarity: 'rare' }),
  L('top', 'nike', 'Dri-FIT Victory Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Standard', patterns: ['solid', 'stripe', 'block'] }),
  L('top', 'nike', 'Dri-FIT Tour Striped Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Standard', patterns: ['stripe', 'pinstripe'], rarity: 'uncommon' }),
  L('top', 'nike', 'Tour Mock Neck', { sub: 'Performance', style: 'mock', collar: 'mock', sleeves: 'short', fit: 'Slim', patterns: ['solid', 'dots', 'block'], rarity: 'rare' }),
  L('top', 'nike', 'Dri-FIT ADV Half-Zip', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Slim', patterns: ['solid', 'heather'], rarity: 'uncommon' }),
  L('top', 'nike', 'TW Blade Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Athletic', patterns: ['solid', 'dots', 'block'], rarity: 'legendary' }),
  L('top', 'adidas', 'Ultimate365 Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Regular', patterns: ['solid', 'heather', 'stripe'] }),
  L('top', 'adidas', 'Go-To Printed Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Regular', patterns: ['dots', 'palms', 'gingham'], rarity: 'uncommon' }),
  L('top', 'adidas', '3-Stripes Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Regular', patterns: ['solid', 'block'] }),
  L('top', 'adidas', 'Elevated Quarter-Zip', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Regular', patterns: ['solid', 'heather', 'block'], rarity: 'rare' }),
  L('top', 'ua', 'Playoff 3.0 Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Loose', patterns: ALLP }),
  L('top', 'ua', 'Iso-Chill Polo', { sub: 'Performance', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Fitted', patterns: ['solid', 'heather', 'dots'], rarity: 'uncommon' }),
  L('top', 'ua', 'Storm Midlayer', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Loose', patterns: ['solid', 'heather'] }),
  L('top', 'ua', 'Spieth Tour Long Sleeve', { sub: 'Long Sleeve', style: 'longsleeve', collar: 'classic', sleeves: 'long', fit: 'Fitted', patterns: ['solid', 'stripe'], rarity: 'epic' }),
  L('top', 'fj', 'ProDry Solid Lisle Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Athletic', patterns: ['solid', 'heather'] }),
  L('top', 'fj', 'Stretch Pique Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Athletic', patterns: ['solid', 'stripe', 'pinstripe'] }),
  L('top', 'fj', 'ThermoSeries Mid-Layer', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Athletic', patterns: ['solid', 'heather', 'block'], rarity: 'uncommon' }),
  L('top', 'fj', 'Heritage Sweater Vest', { sub: 'Vest', style: 'vest', collar: 'crew', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'heather', 'stripe'], rarity: 'rare' }),
  L('top', 'travis', 'Heater Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'heather', 'stripe'] }),
  L('top', 'travis', 'Beach Club Print Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Classic', patterns: ['palms', 'dots'], rarity: 'rare' }),
  L('top', 'travis', 'Cloud Quarter-Zip', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather'], rarity: 'uncommon' }),
  L('top', 'rl', 'RLX Airflow Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'stripe', 'pinstripe'], rarity: 'uncommon' }),
  L('top', 'rl', 'Classic Fit Mesh Polo', { sub: 'Polo', style: 'polo', collar: 'buttondown', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'stripe'], rarity: 'rare' }),
  L('top', 'rl', 'Cable-Knit Cashmere Sweater', { sub: 'Sweater', style: 'sweater', collar: 'crew', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather'], rarity: 'legendary' }),
  L('top', 'rl', 'Pima Cotton Vest', { sub: 'Vest', style: 'vest', collar: 'crew', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'block'], rarity: 'epic' }),
  L('top', 'jl', 'Tour Tech Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Slim', patterns: ['solid', 'block', 'dots'], rarity: 'rare' }),
  L('top', 'jl', 'KV Regular Fit Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Regular', patterns: ['solid', 'stripe'] }),
  L('top', 'jl', 'Swing Mid-Layer', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Slim', patterns: ['solid', 'heather'], rarity: 'epic' }),
  L('top', 'lulu', 'Metal Vent Tech Polo', { sub: 'Performance', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Slim', patterns: ['solid', 'heather', 'stripe'], rarity: 'uncommon' }),
  L('top', 'lulu', 'Evolution Polo', { sub: 'Polo', style: 'polo', collar: 'classic', sleeves: 'short', fit: 'Classic', patterns: ['solid', 'pinstripe'] }),
  L('top', 'lulu', 'Engineered Warmth Half-Zip', { sub: 'Quarter-Zip', style: 'quarterzip', collar: 'zip', sleeves: 'long', fit: 'Classic', patterns: ['solid', 'heather', 'block'], rarity: 'rare' }),
  L('top', 'malbon', 'Buckets Mock Neck', { sub: 'Performance', style: 'mock', collar: 'mock', sleeves: 'long', fit: 'Relaxed', patterns: ['solid', 'dots', 'stripe'], rarity: 'epic' }),
];

// ---------- BOTTOMS ----------
// style: pants | trousers | joggers | shorts
export const BOTTOMS = [
  L('bottom', 'pm', 'Crown Crafted Five-Pocket Pant', { sub: 'Pants', style: 'pants', patterns: ['solid', 'houndstooth', 'check'], rarity: 'uncommon' }),
  L('bottom', 'pm', 'Surge Performance Trouser', { sub: 'Trousers', style: 'trousers', patterns: ['solid', 'stripe', 'plaid'], rarity: 'rare' }),
  L('bottom', 'pm', 'Salem High Drape Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid', 'check'] }),
  L('bottom', 'nike', 'Dri-FIT Victory Pant', { sub: 'Pants', style: 'pants', patterns: ['solid'] }),
  L('bottom', 'nike', 'Tour Repel Jogger', { sub: 'Joggers', style: 'joggers', patterns: ['solid', 'check'], rarity: 'uncommon' }),
  L('bottom', 'nike', 'Tour 8" Chino Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid', 'plaid'] }),
  L('bottom', 'adidas', 'Ultimate365 Tapered Pant', { sub: 'Pants', style: 'pants', patterns: ['solid', 'plaid', 'houndstooth'] }),
  L('bottom', 'adidas', 'Go-To Jogger', { sub: 'Joggers', style: 'joggers', patterns: ['solid', 'stripe'], rarity: 'uncommon' }),
  L('bottom', 'adidas', 'Ultimate365 8.5" Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid', 'check', 'plaid'] }),
  L('bottom', 'ua', 'Drive Tapered Pant', { sub: 'Pants', style: 'pants', patterns: ['solid', 'stripe'] }),
  L('bottom', 'ua', 'Drive Jogger', { sub: 'Joggers', style: 'joggers', patterns: ['solid'] }),
  L('bottom', 'ua', 'Iso-Chill Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid', 'check'] }),
  L('bottom', 'fj', 'Performance Tapered Trouser', { sub: 'Trousers', style: 'trousers', patterns: ['solid', 'plaid', 'houndstooth'], rarity: 'uncommon' }),
  L('bottom', 'fj', 'Lightweight Woven Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid'] }),
  L('bottom', 'travis', 'Open to Close Pant', { sub: 'Pants', style: 'pants', patterns: ['solid', 'check'], rarity: 'rare' }),
  L('bottom', 'travis', 'Wanderlust Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid', 'plaid'], rarity: 'uncommon' }),
  L('bottom', 'rl', 'RLX Tailored Golf Trouser', { sub: 'Trousers', style: 'trousers', patterns: ['solid', 'plaid', 'stripe', 'houndstooth'], rarity: 'epic' }),
  L('bottom', 'rl', 'Stretch Chino Short', { sub: 'Shorts', style: 'shorts', patterns: ['solid', 'plaid'], rarity: 'rare' }),
  L('bottom', 'jl', 'Elof Golf Pant', { sub: 'Pants', style: 'pants', patterns: ['solid', 'check', 'plaid'], rarity: 'rare' }),
  L('bottom', 'jl', 'Vent Tight Jogger', { sub: 'Joggers', style: 'joggers', patterns: ['solid'], rarity: 'epic' }),
  L('bottom', 'lulu', 'ABC Slim-Fit Golf Pant', { sub: 'Pants', style: 'pants', patterns: ['solid', 'houndstooth'], rarity: 'uncommon' }),
  L('bottom', 'lulu', 'Commission Jogger', { sub: 'Joggers', style: 'joggers', patterns: ['solid', 'check'], rarity: 'rare' }),
  L('bottom', 'malbon', 'Tartan Trouser', { sub: 'Trousers', style: 'trousers', patterns: ['plaid'], rarity: 'legendary' }),
];
export const FITS = ['Slim', 'Regular', 'Relaxed'];
export const HAT_FITS = ['Structured', 'Unstructured', 'Snapback'];

// ---------- SHOES ----------
const CW = (name, upper, accent, sole) => ({ name, upper, accent, sole });
const CLASSIC_CW = [CW('White/Black', '#f4f4f2', '#141516', '#f4f4f2'), CW('Triple White', '#f6f6f4', '#e2e2e0', '#ffffff'), CW('White/Navy', '#f4f4f2', '#1c2a44', '#1c2a44'), CW('Black/Gold', '#141516', '#c9a54a', '#141516'), CW('White/Brown Saddle', '#f2efe6', '#6b4a2b', '#6b4a2b'), CW('Grey/Blue', '#9aa0a6', '#1e56b8', '#f4f4f2')];
const SPORT_CW = [CW('White/Volt', '#f4f4f2', '#c8f031', '#f4f4f2'), CW('Black/White', '#141516', '#f4f4f2', '#f4f4f2'), CW('Navy/Red', '#1c2a44', '#c1121f', '#f4f4f2'), CW('Triple Black', '#141516', '#2b2d31', '#141516'), CW('Grey/Orange', '#8e9399', '#f28a3c', '#f4f4f2'), CW('White/Royal', '#f4f4f2', '#1e56b8', '#e5e5e3'), CW('Sky/White', '#8cc4ea', '#f4f4f2', '#f4f4f2'), CW('Sage/Cream', '#9cb59a', '#efe6d2', '#efe6d2')];
const JORDAN_CW = [CW('Chicago', '#f4f4f2', '#c1121f', '#141516'), CW('Bred', '#141516', '#c1121f', '#141516'), CW('Royal', '#f4f4f2', '#1e56b8', '#141516'), CW('Pine Green', '#f4f4f2', '#1f5a3a', '#f4f4f2'), CW('Shadow', '#3c4046', '#8e9399', '#141516'), CW('Wolf Grey', '#f4f4f2', '#a9adb2', '#f4f4f2')];
// style: classic | athletic | retro ; closure: laces | boa ; spikes: true/false
export const SHOES = [
  L('shoes', 'fj', 'Premiere Series Packard', { sub: 'Classic', style: 'classic', spikes: true, closure: 'laces', colorways: CLASSIC_CW, rarity: 'rare' }),
  L('shoes', 'fj', 'Tour Alpha', { sub: 'Tour', style: 'athletic', spikes: true, closure: 'boa', colorways: SPORT_CW, rarity: 'uncommon' }),
  L('shoes', 'fj', 'Pro|SL Carbon', { sub: 'Spikeless', style: 'athletic', spikes: false, closure: 'laces', colorways: SPORT_CW }),
  L('shoes', 'fj', 'DryJoys Premiere Field', { sub: 'Classic', style: 'classic', spikes: true, closure: 'laces', colorways: CLASSIC_CW, rarity: 'epic' }),
  L('shoes', 'nike', 'Air Jordan 1 Low G', { sub: 'Retro', style: 'retro', spikes: false, closure: 'laces', colorways: JORDAN_CW, rarity: 'legendary' }),
  L('shoes', 'nike', 'Air Max 90 G', { sub: 'Retro', style: 'retro', spikes: false, closure: 'laces', colorways: SPORT_CW, rarity: 'rare' }),
  L('shoes', 'nike', 'Victory Tour 3', { sub: 'Tour', style: 'athletic', spikes: true, closure: 'boa', colorways: SPORT_CW, rarity: 'uncommon' }),
  L('shoes', 'nike', 'Infinity G', { sub: 'Spikeless', style: 'athletic', spikes: false, closure: 'laces', colorways: SPORT_CW }),
  L('shoes', 'adidas', 'Tour360 24', { sub: 'Tour', style: 'athletic', spikes: true, closure: 'boa', colorways: SPORT_CW, rarity: 'rare' }),
  L('shoes', 'adidas', 'CodeChaos 25', { sub: 'Spikeless', style: 'athletic', spikes: false, closure: 'boa', colorways: SPORT_CW, rarity: 'uncommon' }),
  L('shoes', 'adidas', 'Samba Golf', { sub: 'Retro', style: 'retro', spikes: false, closure: 'laces', colorways: [CW('White/Green', '#f4f4f2', '#1f5a3a', '#c6a77a'), CW('Black/White', '#141516', '#f4f4f2', '#c6a77a'), CW('Navy/White', '#1c2a44', '#f4f4f2', '#c6a77a')], rarity: 'epic' }),
  L('shoes', 'puma', 'Phantomcat Nitro', { sub: 'Tour', style: 'athletic', spikes: true, closure: 'laces', colorways: SPORT_CW, rarity: 'uncommon' }),
  L('shoes', 'puma', 'Fusion Crush Sport', { sub: 'Spikeless', style: 'athletic', spikes: false, closure: 'laces', colorways: SPORT_CW }),
  L('shoes', 'ua', 'HOVR Drive 2', { sub: 'Tour', style: 'athletic', spikes: true, closure: 'laces', colorways: SPORT_CW }),
  L('shoes', 'ua', 'Spieth 5', { sub: 'Tour', style: 'athletic', spikes: true, closure: 'laces', colorways: SPORT_CW, rarity: 'rare' }),
  L('shoes', 'nb', 'Fresh Foam X Defender', { sub: 'Spikeless', style: 'athletic', spikes: false, closure: 'laces', colorways: SPORT_CW }),
  L('shoes', 'nb', '997 Golf', { sub: 'Retro', style: 'retro', spikes: false, closure: 'laces', colorways: [CW('Grey Day', '#a9adb2', '#8e9399', '#f4f4f2'), CW('Navy/Gum', '#1c2a44', '#f4f4f2', '#c6a77a'), CW('Sea Salt', '#efe6d2', '#1f5a3a', '#f4f4f2')], rarity: 'rare' }),
  L('shoes', 'ecco', 'Biom H5', { sub: 'Spikeless', style: 'athletic', spikes: false, closure: 'boa', colorways: CLASSIC_CW, rarity: 'uncommon' }),
  L('shoes', 'ecco', 'Golf Street Retro', { sub: 'Retro', style: 'retro', spikes: false, closure: 'laces', colorways: CLASSIC_CW }),
];

// ---------- HATS ----------
// style: cap | golfcap | visor | bucket | perf | flatbrim | flatcap | panama
export const HATS = [
  L('hat', 'titleist', 'Tour Performance Cap', { sub: 'Golf Cap', style: 'cap', patterns: ['solid', 'camo'], rarity: 'uncommon' }),
  L('hat', 'titleist', 'Tour Visor', { sub: 'Visor', style: 'visor', patterns: ['solid'] }),
  L('hat', 'nike', 'Aerobill Heritage86 Cap', { sub: 'Performance', style: 'perf', patterns: ['solid', 'camo'] }),
  L('hat', 'nike', 'Legacy91 Tour Cap', { sub: 'Baseball Cap', style: 'cap', patterns: ['solid', 'plaid'], rarity: 'uncommon' }),
  L('hat', 'adidas', 'Tour Snapback', { sub: 'Flat-Brim', style: 'flatbrim', patterns: ['solid', 'stripe'] }),
  L('hat', 'pm', 'Crown Sport Performance Cap', { sub: 'Golf Cap', style: 'cap', patterns: ['solid', 'plaid'], rarity: 'rare' }),
  L('hat', 'travis', 'Cruz Flat-Brim Snapback', { sub: 'Flat-Brim', style: 'flatbrim', patterns: ['solid', 'camo', 'stripe'], rarity: 'uncommon' }),
  L('hat', 'fj', 'HydroLite Bucket Hat', { sub: 'Bucket', style: 'bucket', patterns: ['solid', 'camo'] }),
  L('hat', 'callaway', 'Tour Authentic Visor', { sub: 'Visor', style: 'visor', patterns: ['solid', 'stripe'] }),
  L('hat', 'ua', 'Iso-Chill Driver Cap', { sub: 'Performance', style: 'perf', patterns: ['solid'] }),
  L('hat', 'rl', 'RLX Twill Cap', { sub: 'Baseball Cap', style: 'cap', patterns: ['solid', 'plaid'], rarity: 'rare' }),
  L('hat', 'imperial', 'Rope Golf Cap', { sub: 'Golf Cap', style: 'golfcap', patterns: ['solid', 'stripe'], rarity: 'epic' }),
  L('hat', 'malbon', 'Buckets Bucket Hat', { sub: 'Bucket', style: 'bucket', patterns: ['solid', 'plaid', 'camo'], rarity: 'epic' }),
  L('hat', 'jl', 'Tweed Flat Cap', { sub: 'Flat Cap', style: 'flatcap', patterns: ['solid', 'plaid'], rarity: 'legendary' }),
  L('hat', 'rl', 'Straw Panama', { sub: 'Panama', style: 'panama', patterns: ['solid'], rarity: 'legendary' }),
];

// ---------- GLOVES ----------
export const GLOVES = [
  L('glove', 'fj', 'StaSof', { sub: 'Cabretta Leather', colors: [['White', '#f4f4f2'], ['Black', '#141516'], ['Navy', '#1c2a44']] }),
  L('glove', 'titleist', 'Players', { sub: 'Cabretta Leather', colors: [['White', '#f4f4f2'], ['Black', '#141516']], rarity: 'uncommon' }),
  L('glove', 'tmade', 'Tour Preferred', { sub: 'Cabretta Leather', colors: [['White', '#f4f4f2'], ['Red Accent', '#c1121f']], rarity: 'uncommon' }),
  L('glove', 'callaway', 'Tour Authentic', { sub: 'Cabretta Leather', colors: [['White', '#f4f4f2'], ['Navy', '#1c2a44']] }),
  L('glove', 'nike', 'Tour Classic IV', { sub: 'Hybrid', colors: [['White', '#f4f4f2'], ['Black', '#141516'], ['Volt', '#c8f031']], rarity: 'rare' }),
];

export const ALL_ITEMS = {};
for (const [cat, list] of [['top', TOPS], ['bottom', BOTTOMS], ['shoes', SHOES], ['hat', HATS], ['glove', GLOVES]]) {
  list.forEach((it, i) => {
    it.id = `${cat}-${it.brand}-${i}`;
    ALL_ITEMS[it.id] = it;
  });
}
export const NO_HAT = { id: 'hat-none', cat: 'hat', brand: null, name: 'No Hat', sub: 'None', style: 'none', patterns: ['solid'], rarity: 'common' };
ALL_ITEMS['hat-none'] = NO_HAT;

export function itemUnlock(it) { return RARITY[it.rarity || 'common'].unlock; }

export const DEFAULT_OUTFIT = {
  top: { id: TOPS[5].id, color: '#f4f4f2', pattern: 'solid' },
  bottom: { id: BOTTOMS[3].id, color: '#1d2638', pattern: 'solid', fit: 'Regular' },
  shoes: { id: SHOES[0].id, colorway: 0, spikes: true, closure: 'laces' },
  hat: { id: HATS[0].id, color: '#1c2a44', pattern: 'solid', logo: true, fit: 'Structured' },
  glove: { id: GLOVES[0].id, color: '#f4f4f2' },
};

// how many combinations the catalogue offers (for the UI)
export function catalogueStats() {
  let combos = 0, items = 0;
  for (const t of TOPS) { items++; combos += TOP_COLORS.length * t.patterns.length; }
  for (const b of BOTTOMS) { items++; combos += BOTTOM_COLORS.length * b.patterns.length * FITS.length; }
  for (const s of SHOES) { items++; combos += s.colorways.length * 2 * 2; }
  for (const h of HATS) { items++; combos += TOP_COLORS.length * h.patterns.length * 2; }
  for (const g of GLOVES) { items++; combos += g.colors.length; }
  return { items, combos };
}
