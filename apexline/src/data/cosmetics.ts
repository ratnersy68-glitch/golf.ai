import type { Rarity } from './vehicles';
import { Rng, hashStr } from '../sim/dmath';

export type CosCat =
  | 'paint' | 'finish' | 'wheel' | 'wheelColor' | 'tire' | 'caliper'
  | 'spoiler' | 'splitter' | 'skirt' | 'diffuser' | 'hood' | 'scoop' | 'widebody' | 'exhaust' | 'fbumper' | 'rbumper'
  | 'headlight' | 'taillight' | 'underglow' | 'lightpattern'
  | 'livery' | 'trail' | 'flame' | 'smoke' | 'finishfx' | 'spawn' | 'victory'
  | 'garage' | 'banner' | 'avatar' | 'title' | 'plate';

export interface Price { credits?: number; tokens?: number }
export interface Cosmetic {
  id: string; cat: CosCat; name: string; rarity: Rarity; price: Price;
  shop: 'permanent' | 'rotating' | 'earned';
  earn?: string; // how an 'earned' item is obtained (shown in UI)
  data: Record<string, any>;
  default?: boolean; // owned from the start
}

export const CAT_LABEL: Record<CosCat, string> = {
  paint: 'Paint', finish: 'Finish', wheel: 'Rims', wheelColor: 'Rim Color', tire: 'Tires', caliper: 'Calipers',
  spoiler: 'Spoilers', splitter: 'Splitters', skirt: 'Side Skirts', diffuser: 'Diffusers', hood: 'Hoods', scoop: 'Roof Scoops',
  widebody: 'Widebody', exhaust: 'Exhaust Tips', fbumper: 'Front Bumpers', rbumper: 'Rear Bumpers',
  headlight: 'Headlights', taillight: 'Taillights', underglow: 'Underglow', lightpattern: 'Light Patterns',
  livery: 'Liveries', trail: 'Boost Trails', flame: 'Exhaust Flames', smoke: 'Tire Smoke', finishfx: 'Finish Effects',
  spawn: 'Spawn Effects', victory: 'Victory Animations', garage: 'Garage Backgrounds', banner: 'Profile Banners',
  avatar: 'Avatars', title: 'Player Titles', plate: 'License Plates',
};

/** Shop categories group the catalogue categories. */
export const SHOP_GROUPS: { id: string; label: string; cats: CosCat[] }[] = [
  { id: 'paints', label: 'Paints', cats: ['paint', 'finish'] },
  { id: 'wheels', label: 'Wheels', cats: ['wheel', 'wheelColor', 'tire', 'caliper'] },
  { id: 'body', label: 'Body Kits', cats: ['spoiler', 'splitter', 'skirt', 'diffuser', 'hood', 'scoop', 'widebody', 'exhaust', 'fbumper', 'rbumper'] },
  { id: 'liveries', label: 'Liveries', cats: ['livery'] },
  { id: 'trails', label: 'Trails & FX', cats: ['trail', 'flame', 'smoke', 'finishfx', 'spawn', 'victory'] },
  { id: 'underglow', label: 'Lighting', cats: ['underglow', 'headlight', 'taillight', 'lightpattern'] },
  { id: 'garage', label: 'Garage', cats: ['garage'] },
  { id: 'profile', label: 'Profile', cats: ['banner', 'avatar', 'title', 'plate'] },
];

const PRICE: Record<Rarity, number> = { common: 250, uncommon: 700, rare: 1500, epic: 5000, legendary: 12000, mythic: 30000 };
const TOKEN: Record<Rarity, number> = { common: 0, uncommon: 0, rare: 0, epic: 40, legendary: 150, mythic: 400 };

function hsl(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

const out: Cosmetic[] = [];
const rng = new Rng(hashStr('apexline-cosmetics'));
let seq = 0;

function add(cat: CosCat, id: string, name: string, rarity: Rarity, data: Record<string, any> = {}, opts: { shop?: Cosmetic['shop']; earn?: string; tokens?: boolean; def?: boolean; mult?: number } = {}): void {
  const shop = opts.def ? 'permanent' : opts.shop ?? (rng.next() < 0.45 ? 'rotating' : 'permanent');
  const price: Price = {};
  if (!opts.def && shop !== 'earned') {
    const m = opts.mult ?? 1;
    if (opts.tokens && TOKEN[rarity] > 0) price.tokens = TOKEN[rarity];
    else price.credits = Math.round(PRICE[rarity] * m / 50) * 50;
  }
  out.push({ id: `${cat}_${id}`, cat, name, rarity, price: opts.def ? {} : price, shop, earn: opts.earn, data, default: opts.def });
  seq++;
}
const rarityByIndex = (i: number, n: number): Rarity => {
  const t = i / n;
  return t < 0.4 ? 'common' : t < 0.66 ? 'uncommon' : t < 0.84 ? 'rare' : t < 0.94 ? 'epic' : t < 0.985 ? 'legendary' : 'mythic';
};

// ---------------------------------------------------------------------------------------------------------- paints
const FAMILIES: [string, number][] = [['Red', 2], ['Orange', 24], ['Amber', 42], ['Yellow', 55], ['Lime', 76], ['Green', 135], ['Teal', 172], ['Cyan', 190], ['Azure', 208], ['Blue', 225], ['Violet', 268], ['Magenta', 315]];
const TONES: [string, number, number][] = [['Candy', 88, 52], ['Signal', 100, 46], ['Deep', 78, 30], ['Dusk', 42, 38], ['Pastel', 62, 76], ['Midnight', 70, 16]];
{
  let i = 0;
  const total = FAMILIES.length * TONES.length + 18;
  for (const [fam, hue] of FAMILIES) for (const [tone, s, l] of TONES) {
    add('paint', `${fam.toLowerCase()}_${tone.toLowerCase()}`, `${tone} ${fam}`, rarityByIndex(i++, total), { color: hsl(hue, s, l) });
  }
  const NEUT: [string, string][] = [
    ['Ice White', '#F5F7FA'], ['Arctic Pearl', '#E6EBF2'], ['Titanium', '#A8AFBA'], ['Gunmetal', '#4A515C'], ['Graphite', '#272C34'], ['Carbon Black', '#101216'],
    ['Electric Lime', '#C6FF00'], ['Bronze Age', '#8C6A3F'], ['Champagne', '#D9C7A0'], ['Sandstone', '#C2A77A'], ['Olive Drab', '#55603A'], ['Racing Green', '#0B4D32'],
    ['Oxblood', '#4B0F1A'], ['Burnt Copper', '#B5502B'], ['Navy Pier', '#14284B'], ['Slate Blue', '#4C6385'], ['Sunburst Gold', '#FFC400'], ['Hot Coral', '#FF5E5B'],
  ];
  NEUT.forEach(([n, c], k) => add('paint', `n_${k}`, n, rarityByIndex(i++, total), { color: c }, { def: k === 0 || k === 5 || k === 6 }));
}
// ---------------------------------------------------------------------------------------------------------- finishes
add('finish', 'gloss', 'Gloss', 'common', { m: 0.15, r: 0.18, cc: 1 }, { def: true });
add('finish', 'satin', 'Satin', 'uncommon', { m: 0.2, r: 0.42, cc: 0.3 }, { mult: 1.5 });
add('finish', 'matte', 'Matte', 'uncommon', { m: 0.05, r: 0.88, cc: 0 }, { mult: 1.5 });
add('finish', 'metallic', 'Metallic', 'rare', { m: 0.85, r: 0.32, cc: 1 }, { mult: 1.5 });
add('finish', 'pearl', 'Pearlescent', 'epic', { m: 0.3, r: 0.22, cc: 1, iri: 1 }, { tokens: true });
add('finish', 'chrome', 'Chrome', 'epic', { m: 1, r: 0.04, cc: 0 }, { tokens: true });
add('finish', 'carbon', 'Carbon Fiber', 'legendary', { m: 0.4, r: 0.28, cc: 1, carbon: 1 }, { tokens: true });
add('finish', 'shift', 'Color-Shift', 'legendary', { m: 0.5, r: 0.2, cc: 1, iri: 1, shift: 1 }, { tokens: true });

// ---------------------------------------------------------------------------------------------------------- wheels
const RIMS: [string, string, number, number][] = [
  ['Turbine', 'turbine', 8, 0], ['Mesh', 'mesh', 14, 0], ['Five Star', 'spoke', 5, 0], ['Ten Spoke', 'spoke', 10, 0], ['Disc', 'disc', 0, 0], ['Blade', 'spoke', 7, 0.4],
  ['Split Six', 'split', 6, 0], ['Hex', 'spoke', 6, 0], ['Halo', 'ring', 5, 0], ['Fan', 'turbine', 12, 0], ['Cross', 'spoke', 4, 0], ['Dish', 'disc', 0, 1],
  ['Mono', 'disc', 0, 0], ['Vent', 'split', 8, 0], ['Slat', 'spoke', 9, 0.2], ['Gear', 'mesh', 18, 0], ['Bolt', 'spoke', 5, 0.3], ['Teardrop', 'turbine', 6, 0],
  ['Cog', 'mesh', 10, 0], ['Wave', 'split', 10, 0], ['Needle', 'spoke', 16, 0], ['Lattice', 'mesh', 20, 0], ['Apex Forged', 'spoke', 6, 0.1], ['Singular', 'ring', 3, 0],
];
RIMS.forEach(([n, style, spokes, concave], i) => add('wheel', n.toLowerCase().replace(/ /g, '_'), n, rarityByIndex(i, RIMS.length), { style, spokes, concave }, { def: i === 2 }));
const RIMCOL: [string, string][] = [
  ['Silver', '#C9CED6'], ['Gunmetal', '#3B4048'], ['Gloss Black', '#0C0E11'], ['White', '#F5F7FA'], ['Electric Lime', '#C6FF00'], ['Gold', '#E6B422'], ['Bronze', '#9A6B33'], ['Candy Red', '#D91E2C'],
  ['Cobalt', '#1E56D9'], ['Teal', '#0FA39B'], ['Violet', '#7A3FE0'], ['Hot Pink', '#FF3D9A'], ['Orange', '#FF7A00'], ['Chrome', '#EEF2F7'], ['Titanium', '#8E96A3'], ['Copper', '#B86A3C'],
  ['Midnight', '#141C33'], ['Forest', '#1F5A3A'], ['Sand', '#CDB88A'], ['Ice Blue', '#9FD6FF'], ['Crimson', '#8A0F25'], ['Neon Cyan', '#00E5FF'], ['Rose Gold', '#E0A39A'], ['Pitch', '#050607'],
];
RIMCOL.forEach(([n, c], i) => add('wheelColor', n.toLowerCase().replace(/ /g, '_'), n, rarityByIndex(i, RIMCOL.length), { color: c }, { def: i === 0 }));
const TIRES: [string, string, string, string][] = [
  ['Apexline Sport', 'APEXLINE', '#F5F7FA', ''], ['Lime Lettering', 'APEXLINE', '#C6FF00', ''], ['Red Line', 'REDLINE', '#FF3B30', ''], ['Blue Streak', 'SPEED', '#3A8DFF', ''],
  ['Gold Script', 'APEX', '#FFC400', ''], ['Whitewall', '', '#F5F7FA', 'band'], ['Redwall', '', '#FF3B30', 'band'], ['Stealth', '', '#1B1E24', ''],
  ['Rally Yellow', 'GRAVEL', '#FFD21F', ''], ['Slick Silver', 'SLICK', '#A8AFBA', ''], ['Ghost', 'MS', '#7A828F', 'band'], ['Hyper', 'HYPER', '#00E5FF', ''],
];
TIRES.forEach(([n, t, c, b], i) => add('tire', n.toLowerCase().replace(/ /g, '_'), n, rarityByIndex(i, TIRES.length), { text: t, color: c, band: b }, { def: i === 0 }));
const CAL: [string, string][] = [['Stock Black', '#1B1E24'], ['Signal Red', '#E5232E'], ['Lime', '#C6FF00'], ['Gold', '#FFC400'], ['Cobalt', '#2B6BFF'], ['Silver', '#C9CED6'], ['Orange', '#FF7A00'], ['Magenta', '#E0189B']];
CAL.forEach(([n, c], i) => add('caliper', n.toLowerCase().replace(/ /g, '_'), n, rarityByIndex(i, CAL.length), { color: c }, { def: i === 0 }));

// ---------------------------------------------------------------------------------------------------------- body kit
const SPOILERS: [string, string, number, number, number][] = [
  ['None', 'none', 0, 0, 0], ['Lip', 'lip', 0.06, 1, 0.16], ['Ducktail', 'duck', 0.14, 1, 0.22], ['GT Wing', 'gt', 0.34, 1, 0.3], ['Low Wing', 'wing', 0.24, 1, 0.34], ['Ladder', 'ladder', 0.42, 1, 0.4],
  ['Dual Plane', 'dual', 0.46, 1, 0.38], ['Big Wing', 'big', 0.54, 1.05, 0.46], ['Carbon Blade', 'gt', 0.3, 1.05, 0.22], ['Swan Neck', 'wing', 0.4, 1, 0.3], ['Triple Deck', 'dual', 0.5, 1.04, 0.34],
  ['Rally Ladder', 'ladder', 0.6, 1, 0.5], ['Endplate GT', 'gt', 0.38, 1.08, 0.36], ['Apex Spec', 'big', 0.5, 1.08, 0.5],
];
SPOILERS.forEach(([n, kind, h, span, chord], i) => add('spoiler', n.toLowerCase().replace(/ /g, '_'), n, i < 2 ? 'common' : rarityByIndex(i, SPOILERS.length), { kind, h, span, chord }, { def: i === 0 }));
const SPLIT: [string, number, number][] = [['None', 0, 0], ['Street Lip', 0.05, 0.1], ['Racing Splitter', 0.09, 0.22], ['Carbon Splitter', 0.1, 0.28], ['Dive Planes', 0.13, 0.3], ['Wide Splitter', 0.12, 0.34], ['Rally Guard', 0.16, 0.18], ['Apex Splitter', 0.14, 0.4]];
SPLIT.forEach(([n, h, d], i) => add('splitter', n.toLowerCase().replace(/ /g, '_'), n, i < 2 ? 'common' : rarityByIndex(i, SPLIT.length), { h, d }, { def: i === 0 }));
const SKIRT: [string, number, number][] = [['None', 0, 0], ['Street Skirts', 0.06, 0.05], ['Sport Skirts', 0.1, 0.07], ['Blade Skirts', 0.14, 0.04], ['Carbon Sills', 0.12, 0.09], ['Aero Skirts', 0.18, 0.1], ['Rally Rails', 0.16, 0.12], ['Apex Sills', 0.2, 0.14]];
SKIRT.forEach(([n, h, d], i) => add('skirt', n.toLowerCase().replace(/ /g, '_'), n, i < 2 ? 'common' : rarityByIndex(i, SKIRT.length), { h, d }, { def: i === 0 }));
const DIFF: [string, number, number][] = [['None', 0, 0], ['Street Diffuser', 0.06, 3], ['Sport Diffuser', 0.1, 4], ['Carbon Diffuser', 0.14, 5], ['Triple Fin', 0.16, 3], ['Race Tunnel', 0.2, 6], ['Wide Diffuser', 0.18, 7], ['Apex Diffuser', 0.24, 8]];
DIFF.forEach(([n, h, f], i) => add('diffuser', n.toLowerCase().replace(/ /g, '_'), n, i < 2 ? 'common' : rarityByIndex(i, DIFF.length), { h, fins: f }, { def: i === 0 }));
const HOOD: [string, string][] = [['Stock', 'flat'], ['Center Bulge', 'bulge'], ['Twin Vent', 'vent'], ['Carbon Hood', 'carbon'], ['Power Dome', 'dome'], ['Louvered', 'louver'], ['Scooped', 'scoop'], ['Apex Race Hood', 'race']];
HOOD.forEach(([n, kind], i) => add('hood', n.toLowerCase().replace(/ /g, '_'), n, i < 1 ? 'common' : rarityByIndex(i, HOOD.length), { kind }, { def: i === 0 }));
const SCOOP: [string, string][] = [['None', 'none'], ['Low Scoop', 'low'], ['Rally Scoop', 'rally'], ['Twin Snorkel', 'twin'], ['Race Airbox', 'box'], ['Apex Periscope', 'tall']];
SCOOP.forEach(([n, kind], i) => add('scoop', n.toLowerCase().replace(/ /g, '_'), n, i < 1 ? 'common' : rarityByIndex(i, SCOOP.length), { kind }, { def: i === 0 }));
const WIDE: [string, number][] = [['Stock Fenders', 0], ['Mild Flares', 0.04], ['Sport Flares', 0.07], ['Rivet Widebody', 0.1], ['Race Widebody', 0.13], ['Apex Widebody', 0.17]];
WIDE.forEach(([n, w], i) => add('widebody', n.toLowerCase().replace(/ /g, '_'), n, i < 1 ? 'common' : rarityByIndex(i, WIDE.length), { w, rivets: i >= 3 }, { def: i === 0 }));
const EXH: [string, string, number][] = [['Stock Pipe', 'round', 1], ['Dual Round', 'round', 2], ['Quad Round', 'round', 4], ['Square Dual', 'square', 2], ['Hex Tips', 'hex', 2], ['Center Exit', 'round', 1], ['Rally Cannon', 'cannon', 1], ['Apex Quad Slot', 'square', 4]];
EXH.forEach(([n, shape, count], i) => add('exhaust', n.toLowerCase().replace(/ /g, '_'), n, i < 2 ? 'common' : rarityByIndex(i, EXH.length), { shape, count, center: n === 'Center Exit' }, { def: i === 0 }));
const FB: [string, number, number][] = [['Stock Bumper', 0, 0], ['Sport Bumper', 0.04, 1], ['Race Bumper', 0.07, 2], ['Wide Intake', 0.09, 3], ['Carbon Bumper', 0.08, 2], ['Rally Bumper', 0.12, 4], ['Aero Bumper', 0.1, 5], ['Apex Bumper', 0.14, 6]];
FB.forEach(([n, ext, vents], i) => add('fbumper', n.toLowerCase().replace(/ /g, '_'), n, i < 1 ? 'common' : rarityByIndex(i, FB.length), { ext, vents }, { def: i === 0 }));
const RB: [string, number, number][] = [['Stock Bumper', 0, 0], ['Sport Bumper', 0.04, 1], ['Race Bumper', 0.07, 2], ['Vented Bumper', 0.09, 3], ['Carbon Bumper', 0.08, 2], ['Rally Bumper', 0.12, 4], ['Aero Bumper', 0.1, 5], ['Apex Bumper', 0.14, 6]];
RB.forEach(([n, ext, vents], i) => add('rbumper', n.toLowerCase().replace(/ /g, '_'), n, i < 1 ? 'common' : rarityByIndex(i, RB.length), { ext, vents }, { def: i === 0 }));

// ---------------------------------------------------------------------------------------------------------- lighting
const HL: [string, string][] = [['Xenon White', '#F5F7FF'], ['Warm Halogen', '#FFE7B0'], ['Ice Blue', '#BFE4FF'], ['Lime Beam', '#C6FF00'], ['Amber', '#FFB300'], ['Violet', '#B56BFF'], ['Cyan', '#00E5FF'], ['Rose', '#FF7AB6'], ['Crimson', '#FF2D4B'], ['Aurora Green', '#4CFFA0']];
HL.forEach(([n, c], i) => add('headlight', n.toLowerCase().replace(/ /g, '_'), n, rarityByIndex(i, HL.length), { color: c }, { def: i === 0 }));
const TL: [string, string, string][] = [['Stock Red', 'bar', '#FF1F1F'], ['Slim Strip', 'strip', '#FF1F1F'], ['Twin Rings', 'rings', '#FF2A2A'], ['Smoked Bar', 'bar', '#B80F0F'], ['Segment Scan', 'seg', '#FF3030'], ['Lime Strip', 'strip', '#C6FF00'], ['Amber Bar', 'bar', '#FFAA00'], ['White Strip', 'strip', '#F5F7FF']];
TL.forEach(([n, style, c], i) => add('taillight', n.toLowerCase().replace(/ /g, '_'), n, i < 2 ? 'common' : rarityByIndex(i, TL.length), { style, color: c }, { def: i === 0 }));
const UG: [string, string][] = [['None', ''], ['Lime', '#C6FF00'], ['Cyan', '#00E5FF'], ['Magenta', '#FF2DCB'], ['Red', '#FF2D2D'], ['Blue', '#2D6BFF'], ['Violet', '#9B4DFF'], ['Amber', '#FFB000'], ['White', '#F5F7FF'], ['Green', '#2DFF7A'], ['Pink', '#FF7AC0'], ['Orange', '#FF7A1F'], ['Teal', '#14E5C0'], ['Ice', '#9FD6FF'], ['Gold', '#FFD24D'], ['Crimson', '#E0123C']];
UG.forEach(([n, c], i) => add('underglow', n.toLowerCase(), n, i === 0 ? 'common' : rarityByIndex(i, UG.length), { color: c }, { def: i === 0 }));
const LP: [string, string][] = [['Solid', 'solid'], ['Pulse', 'pulse'], ['Breathe', 'breathe'], ['Chase', 'chase'], ['Strobe', 'strobe'], ['Rainbow', 'rainbow'], ['Flicker', 'flicker'], ['Speed Reactive', 'speed']];
LP.forEach(([n, mode], i) => add('lightpattern', mode, n, i < 1 ? 'common' : rarityByIndex(i, LP.length), { mode }, { def: i === 0, mult: 1.2 }));

// ---------------------------------------------------------------------------------------------------------- liveries (templates resolved in the livery renderer)
const LIV_TEMPLATES = ['none', 'stripes', 'dual', 'chevron', 'checker', 'flames', 'split', 'fade', 'hex', 'speed', 'roundel', 'bands', 'rally'];
const LIV_NAMES: string[] = [
  'Clean Sheet', 'Twin Stripe', 'Apex Chevron', 'Chequered Flag', 'Hellfire', 'Half and Half', 'Dawn Fade', 'Honeycomb', 'Speed Lines', 'Roundel 07', 'Triple Band', 'Stage Rally',
  'Night Stripe', 'Lime Rush', 'Pit Wall', 'Grid Start', 'Inferno', 'Diagonal Split', 'Dusk Fade', 'Carbon Cell', 'Slipstream', 'Heritage Roundel', 'Pinstripe', 'Gravel Special',
  'Moto Racing', 'Corner Cut', 'Arrowhead', 'Pole Position', 'Ember', 'Vertical Split', 'Horizon Fade', 'Hexline', 'Afterimage', 'Number One', 'Gold Bands', 'Service Park',
  'Monaco Night', 'Redline', 'Spearpoint', 'Qualifier', 'Wildfire', 'Corner Split', 'Aurora Fade', 'Hex Storm', 'Warp Lines', 'Lucky Seven', 'Platinum Bands', 'Dust Devil',
  'Mono Stripe', 'Kerb Strike', 'Slash', 'Parc Ferme', 'Blaze', 'Lightning Split', 'Cobalt Fade', 'Hex Grid', 'Blur', 'Championship', 'Diamond Bands', 'Endurance',
];
const PALS: [string, string][] = [['#F5F7FA', '#101216'], ['#C6FF00', '#101216'], ['#FF3B30', '#F5F7FA'], ['#3A8DFF', '#F5F7FA'], ['#FFC400', '#101216'], ['#101216', '#C6FF00'], ['#7C4DFF', '#F5F7FA'], ['#00E5FF', '#101216'], ['#FF8A00', '#101216'], ['#F5F7FA', '#E0123C']];
LIV_NAMES.forEach((n, i) => {
  const [c1, c2] = PALS[(i * 3 + 1) % PALS.length];
  add('livery', `l${String(i + 1).padStart(2, '0')}`, n, i === 0 ? 'common' : rarityByIndex(i, LIV_NAMES.length), { tpl: (i === 0 ? 'none' : LIV_TEMPLATES[1 + ((i - 1) % (LIV_TEMPLATES.length - 1))]), c1, c2, seed: i + 1 }, { def: i === 0, mult: 1.3 });
});

// ---------------------------------------------------------------------------------------------------------- effects
const TRAIL: [string, string, string, string][] = [
  ['Ion Wake', '#00E5FF', '#2D6BFF', 'ribbon'], ['Lime Streak', '#C6FF00', '#F5F7FA', 'ribbon'], ['Ember', '#FF7A1F', '#FFD24D', 'flame'], ['Plasma', '#B56BFF', '#FF2DCB', 'ribbon'],
  ['Frost', '#9FD6FF', '#F5F7FA', 'spark'], ['Solar', '#FFC400', '#FF3B30', 'flame'], ['Toxic', '#4CFFA0', '#C6FF00', 'spark'], ['Crimson Fade', '#E0123C', '#FF7A1F', 'ribbon'],
  ['Stardust', '#F5F7FF', '#9B4DFF', 'spark'], ['Pixel Run', '#2DFF7A', '#00E5FF', 'pixel'], ['Rainbow Road', '#FF2D2D', '#2D6BFF', 'rainbow'], ['Carbon Smoke', '#4A515C', '#101216', 'ribbon'],
  ['Aurora', '#4CFFA0', '#9B4DFF', 'ribbon'], ['Gold Rush', '#FFD24D', '#FFF2B0', 'spark'], ['Voltage', '#F5F7FF', '#2D6BFF', 'spark'], ['Apex Singularity', '#C6FF00', '#101216', 'rainbow'],
];
TRAIL.forEach(([n, c1, c2, style], i) => add('trail', n.toLowerCase().replace(/ /g, '_'), n, i === 0 ? 'common' : rarityByIndex(i, TRAIL.length), { c1, c2, style }, { def: i === 0, tokens: i >= 12 }));
const FLAME: [string, string, string][] = [['Stock Blue', '#4DA6FF', '#BFE4FF'], ['Classic Orange', '#FF7A1F', '#FFD24D'], ['Crimson', '#E0123C', '#FF7A1F'], ['Lime Burst', '#C6FF00', '#F5F7FA'], ['Violet', '#9B4DFF', '#FF2DCB'], ['White Hot', '#F5F7FF', '#BFE4FF'], ['Green Fire', '#2DFF7A', '#C6FF00'], ['Gold', '#FFC400', '#FFF2B0'], ['Cyan', '#00E5FF', '#F5F7FF'], ['Apex Inferno', '#FF3B30', '#C6FF00']];
FLAME.forEach(([n, c1, c2], i) => add('flame', n.toLowerCase().replace(/ /g, '_'), n, i === 0 ? 'common' : rarityByIndex(i, FLAME.length), { c1, c2 }, { def: i === 0, tokens: i >= 8 }));
const SMOKE: [string, string][] = [['White Smoke', '#F5F7FA'], ['Grey', '#8B93A0'], ['Black', '#2A2D33'], ['Red', '#FF3B30'], ['Blue', '#3A8DFF'], ['Lime', '#C6FF00'], ['Purple', '#9B4DFF'], ['Pink', '#FF7AC0'], ['Orange', '#FF8A00'], ['Gold', '#FFC400']];
SMOKE.forEach(([n, c], i) => add('smoke', n.toLowerCase().replace(/ /g, '_'), n, i === 0 ? 'common' : rarityByIndex(i, SMOKE.length), { color: c }, { def: i === 0 }));
const FFX: [string, string][] = [['Confetti', 'confetti'], ['Fireworks', 'firework'], ['Sparks', 'spark'], ['Streamers', 'streamer'], ['Lime Burst', 'burst'], ['Gold Rain', 'rain'], ['Smoke Donut', 'smoke'], ['Apex Nova', 'nova']];
FFX.forEach(([n, kind], i) => add('finishfx', kind, n, i === 0 ? 'common' : rarityByIndex(i, FFX.length), { kind }, { def: i === 0 }));
const SPAWN: [string, string][] = [['Fade In', 'fade'], ['Drop In', 'drop'], ['Light Ring', 'ring'], ['Scanline', 'scan'], ['Pixel Assemble', 'pixel'], ['Lightning', 'bolt'], ['Warp', 'warp'], ['Apex Portal', 'portal']];
SPAWN.forEach(([n, kind], i) => add('spawn', kind, n, i === 0 ? 'common' : rarityByIndex(i, SPAWN.length), { kind }, { def: i === 0 }));
const VICT: [string, string][] = [['Cruise', 'cruise'], ['Donut', 'donut'], ['Wheelie Pop', 'pop'], ['Victory Lap Spin', 'spin'], ['Burnout', 'burnout'], ['Salute', 'salute'], ['Drift Out', 'drift'], ['Apex Orbit', 'orbit']];
VICT.forEach(([n, kind], i) => add('victory', kind, n, i === 0 ? 'common' : rarityByIndex(i, VICT.length), { kind }, { def: i === 0 }));

// ---------------------------------------------------------------------------------------------------------- garage + profile
const GAR: [string, string, string, string][] = [
  ['Carbon Studio', '#101216', '#272C34', '#C6FF00'], ['Pit Lane', '#1B222B', '#3A4452', '#FFC400'], ['Neon Loft', '#0E0A1F', '#2A1B5C', '#FF2DCB'], ['Alpine Hangar', '#18212C', '#8FA6BF', '#9FD6FF'],
  ['Desert Bay', '#2A1D12', '#C28A4B', '#FF8A00'], ['Coastal Dock', '#0C1D2B', '#2B7BA6', '#00E5FF'], ['Forest Shed', '#0F1A12', '#2F5A38', '#4CFFA0'], ['Skyport', '#0B1530', '#4F7BE0', '#F5F7FF'],
  ['Industrial Floor', '#1A1A1A', '#5A5F66', '#FF7A1F'], ['Formula Garage', '#0C0D10', '#8A0F25', '#F5F7FA'], ['Hyper Vault', '#05060A', '#1D2A44', '#C6FF00'], ['Apex Showroom', '#F0F2F5', '#C9CED6', '#101216'],
];
GAR.forEach(([n, bg, floor, accent], i) => add('garage', n.toLowerCase().replace(/ /g, '_'), n, i === 0 ? 'common' : rarityByIndex(i, GAR.length), { bg, floor, accent }, { def: i === 0, mult: 1.6 }));
const BAN_COL: [string, string, string][] = [['Carbon', '#101216', '#272C34'], ['Lime Line', '#101216', '#C6FF00'], ['Sunset', '#FF7A1F', '#E0123C'], ['Ocean', '#0C3B66', '#00E5FF'], ['Dune', '#C28A4B', '#FFD24D'], ['Glacier', '#9FD6FF', '#F5F7FA'], ['Neon', '#2A1B5C', '#FF2DCB'], ['Forest', '#0F2A1A', '#4CFFA0']];
const BAN_PAT = ['stripes', 'chevron', 'grid'];
let bi = 0;
for (const pat of BAN_PAT) for (const [n, c1, c2] of BAN_COL) {
  add('banner', `${n.toLowerCase().replace(/ /g, '_')}_${pat}`, `${n} ${pat[0].toUpperCase() + pat.slice(1)}`, rarityByIndex(bi++, 24), { c1, c2, pattern: pat }, { def: bi === 1 });
}
const AV_G = ['bolt', 'wheel', 'helm', 'flag', 'gear', 'crown', 'skull', 'wing', 'star', 'flame', 'arrow', 'diamond'];
const AV_C: [string, string][] = [['#C6FF00', '#101216'], ['#F5F7FA', '#272C34']];
let ai = 0;
for (const [fg, bg] of AV_C) for (const g of AV_G) {
  add('avatar', `${g}_${fg === '#C6FF00' ? 'lime' : 'ice'}`, `${g[0].toUpperCase() + g.slice(1)} ${fg === '#C6FF00' ? 'Lime' : 'Ice'}`, rarityByIndex(ai++, 24), { glyph: g, fg, bg }, { def: ai === 1 });
}
// Titles — a mix of purchasable and achievement-earned
const TITLES_BUY = ['Time Attacker', 'Line Hunter', 'Late Braker', 'Apex Hunter', 'Weekend Racer', 'Night Driver', 'Gravel Rat', 'Drift Enjoyer', 'Clean Sweep', 'Pole Sitter', 'Slipstream Pilot', 'Chicane Specialist'];
TITLES_BUY.forEach((n, i) => add('title', n.toLowerCase().replace(/ /g, '_'), n, rarityByIndex(i, TITLES_BUY.length), { text: n }, { def: i === 0 }));
const TITLES_EARN: [string, string, Rarity][] = [
  ['Rookie of the Year', 'Complete Rookie Academy', 'uncommon'], ['Coastal Cruiser', 'Complete Coastal Circuit', 'uncommon'], ['Desert Fox', 'Complete Desert Rush', 'rare'], ['Frostbitten', 'Complete Alpine Assault', 'rare'],
  ['City Ghost', 'Complete Neon District', 'rare'], ['Steel Nerve', 'Complete Industrial Overdrive', 'rare'], ['Woodsman', 'Complete Forest Velocity', 'rare'], ['Cloud Walker', 'Complete Skybound', 'epic'],
  ['Precision Machine', 'Complete Formula Precision', 'epic'], ['Redline Royalty', 'Complete Hyperdrive', 'epic'], ['Gauntlet Survivor', 'Complete The Gauntlet', 'legendary'], ['Benchmark Breaker', 'Beat any simulated benchmark', 'legendary'],
  ['The Apex', 'Earn 50 Apex medals', 'mythic'], ['Level 100', 'Reach player level 100', 'epic'], ['Prestige Apex', 'Reach Apex prestige', 'mythic'], ['Millisecond Master', 'Win a run by under 10 ms', 'rare'], ['Track Architect', 'Publish a custom track', 'rare'], ['Collector', 'Own 100 cosmetics', 'epic'],
];
TITLES_EARN.forEach(([n, earn, r]) => add('title', 'e_' + n.toLowerCase().replace(/ /g, '_'), n, r, { text: n }, { shop: 'earned', earn }));
const PLATES: [string, string, string][] = [['Classic White', '#F5F7FA', '#101216'], ['Euro Blue', '#F5F7FA', '#1F3A8A'], ['Black Out', '#101216', '#F5F7FA'], ['Lime Tag', '#C6FF00', '#101216'], ['Gold Tag', '#FFC400', '#101216'], ['Crimson', '#B3003C', '#F5F7FA'], ['Carbon Plate', '#272C34', '#C6FF00'], ['Ice Plate', '#9FD6FF', '#101216'], ['Sunset Plate', '#FF7A1F', '#101216'], ['Apex Plate', '#101216', '#C6FF00']];
PLATES.forEach(([n, bg, fg], i) => add('plate', n.toLowerCase().replace(/ /g, '_'), n, rarityByIndex(i, PLATES.length), { bg, fg }, { def: i === 0 }));

// ---- Earned-only extras (level / achievement unlocks) so the whole 'earned' pool is real items
const EARN_EXTRA: [CosCat, string, string, Rarity, Record<string, any>, string][] = [
  ['livery', 'e_gold_medal', 'Gold Standard', 'epic', { tpl: 'bands', c1: '#FFC400', c2: '#101216', seed: 91 }, 'Earn 25 gold medals'],
  ['livery', 'e_platinum', 'Platinum Edition', 'legendary', { tpl: 'chevron', c1: '#E6EBF2', c2: '#101216', seed: 92 }, 'Earn 10 platinum medals'],
  ['livery', 'e_apex', 'Apex Hunter', 'mythic', { tpl: 'speed', c1: '#C6FF00', c2: '#101216', seed: 93 }, 'Earn an Apex medal'],
  ['livery', 'e_benchmark', 'Benchmark Breaker', 'mythic', { tpl: 'hex', c1: '#00E5FF', c2: '#101216', seed: 94 }, 'Beat a simulated benchmark'],
  ['trail', 'e_prestige', 'Prestige Wake', 'legendary', { c1: '#C6FF00', c2: '#FFC400', style: 'rainbow' }, 'Reach Prestige: Challenger'],
  ['spawn', 'e_champion', 'Champion Entrance', 'legendary', { kind: 'portal' }, 'Reach Prestige: Champion'],
  ['finishfx', 'e_wr', 'Record Holder', 'mythic', { kind: 'nova' }, 'Set a verified world record'],
  ['victory', 'e_ch11', 'Gauntlet Salute', 'legendary', { kind: 'salute' }, 'Complete The Gauntlet'],
  ['garage', 'e_lvl50', 'Level 50 Penthouse', 'epic', { bg: '#0B0D12', floor: '#2A2F3A', accent: '#FFC400' }, 'Reach player level 50'],
  ['garage', 'e_lvl150', 'Level 150 Vault', 'legendary', { bg: '#050608', floor: '#14243C', accent: '#C6FF00' }, 'Reach player level 150'],
  ['banner', 'e_lvl25', 'Level 25 Banner', 'rare', { c1: '#101216', c2: '#C6FF00', pattern: 'grid' }, 'Reach player level 25'],
  ['banner', 'e_lvl200', 'Level 200 Banner', 'epic', { c1: '#272C34', c2: '#FFC400', pattern: 'chevron' }, 'Reach player level 200'],
  ['avatar', 'e_wr', 'Record Crown', 'mythic', { glyph: 'crown', fg: '#FFC400', bg: '#101216' }, 'Set a verified world record'],
  ['avatar', 'e_lvl75', 'Level 75 Helm', 'epic', { glyph: 'helm', fg: '#C6FF00', bg: '#101216' }, 'Reach player level 75'],
  ['smoke', 'e_daily30', 'Dedication Smoke', 'epic', { color: '#C6FF00' }, 'Complete 30 daily challenges'],
  ['flame', 'e_weekly', 'Championship Flame', 'legendary', { c1: '#FFC400', c2: '#E0123C' }, 'Complete 5 weekly championships'],
  ['paint', 'e_ch5', 'Neon District Violet', 'rare', { color: '#8A2BE2' }, 'Complete Neon District'],
  ['paint', 'e_ch8', 'Skybound Azure', 'rare', { color: '#46A6FF' }, 'Complete Skybound'],
  ['wheel', 'e_ch9', 'Formula Forged', 'epic', { style: 'spoke', spokes: 6, concave: 0.2 }, 'Complete Formula Precision'],
  ['wheelColor', 'e_ch10', 'Hyperdrive Gold', 'epic', { color: '#FFD24D' }, 'Complete Hyperdrive'],
  ['underglow', 'e_ch6', 'Forge Orange', 'rare', { color: '#FF5A1F' }, 'Complete Industrial Overdrive'],
  ['spoiler', 'e_ch11', 'Gauntlet Wing', 'legendary', { kind: 'big', h: 0.52, span: 1.06, chord: 0.5 }, 'Complete The Gauntlet'],
  ['plate', 'e_lvl10', 'Level 10 Plate', 'uncommon', { bg: '#272C34', fg: '#C6FF00' }, 'Reach player level 10'],
  ['title', 'e_ranked', 'Ranked Contender', 'rare', { text: 'Ranked Contender' }, 'Finish ranked placements'],
];
for (const [cat, id, name, r, data, earn] of EARN_EXTRA) add(cat, id, name, r, data, { shop: 'earned', earn });

export const COSMETICS: Cosmetic[] = out;
export const COSMETIC_MAP: Record<string, Cosmetic> = Object.fromEntries(out.map(c => [c.id, c]));
export const COSMETICS_BY_CAT: Record<string, Cosmetic[]> = {};
for (const c of out) (COSMETICS_BY_CAT[c.cat] ??= []).push(c);
export const DEFAULT_OWNED: string[] = out.filter(c => c.default).map(c => c.id);

export const BUNDLES: { id: string; name: string; desc: string; items: string[]; discount: number }[] = [
  { id: 'b_night', name: 'Night Run', desc: 'Violet paint, lime wheels and neon trails for after-dark racing.', items: ['paint_violet_candy', 'wheelColor_electric_lime', 'underglow_violet', 'trail_plasma', 'livery_l13'], discount: 0.2 },
  { id: 'b_rally', name: 'Stage Special', desc: 'Gravel-ready look with a rally spoiler and yellow tires.', items: ['paint_amber_signal', 'spoiler_rally_ladder', 'tire_rally_yellow', 'scoop_rally_scoop', 'livery_l12'], discount: 0.2 },
  { id: 'b_track', name: 'Track Day', desc: 'Carbon splitter, diffuser and a GT wing for a focused circuit look.', items: ['splitter_carbon_splitter', 'diffuser_carbon_diffuser', 'spoiler_gt_wing', 'skirt_carbon_sills', 'finish_carbon'], discount: 0.15 },
  { id: 'b_lime', name: 'Lime Signature', desc: 'The APEXLINE signature look.', items: ['paint_n_6', 'wheelColor_electric_lime', 'caliper_lime', 'headlight_lime_beam', 'trail_lime_streak'], discount: 0.2 },
  { id: 'b_ghost', name: 'Ghost Protocol', desc: 'Matte graphite, stealth tires and ice-white lighting.', items: ['paint_n_4', 'finish_matte', 'tire_stealth', 'underglow_white', 'taillight_white_strip'], discount: 0.2 },
  { id: 'b_gold', name: 'Gold Standard', desc: 'Sunburst gold, chrome and a championship flame.', items: ['paint_n_16', 'finish_chrome', 'wheelColor_gold', 'flame_gold', 'plate_gold_tag'], discount: 0.15 },
].map(b => ({ ...b, items: b.items.filter(i => COSMETIC_MAP[i]) }));

export function rarityValue(c: Cosmetic): number { return ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'].indexOf(c.rarity); }
