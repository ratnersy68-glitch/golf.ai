// Club definitions. Distances are "tour-ish amateur" baselines for a golfer
// with 50 power and are scaled by golfer attributes and equipment.
// carry: yards at full swing, launch: degrees, spin: rpm, roll: relative roll-out
// accuracy/forgiveness: 0..1 (higher = tighter dispersion / smaller mishit penalty)

export const CLUB_TYPES = [
  { id: 'DR', name: 'Driver', short: 'DR', cat: 'wood', loft: 10.5, carry: 252, launch: 11.5, spin: 2600, accuracy: 0.62, forgiveness: 0.7, teeOnly: false },
  { id: '3W', name: '3 Wood', short: '3W', cat: 'wood', loft: 15, carry: 232, launch: 11.5, spin: 3500, accuracy: 0.68, forgiveness: 0.65 },
  { id: '5W', name: '5 Wood', short: '5W', cat: 'wood', loft: 18, carry: 218, launch: 12.5, spin: 4300, accuracy: 0.71, forgiveness: 0.72 },
  { id: '7W', name: '7 Wood', short: '7W', cat: 'wood', loft: 21, carry: 206, launch: 14, spin: 4800, accuracy: 0.73, forgiveness: 0.76 },
  { id: '3H', name: '3 Hybrid', short: '3H', cat: 'hybrid', loft: 19, carry: 208, launch: 13, spin: 4500, accuracy: 0.73, forgiveness: 0.75 },
  { id: '4H', name: '4 Hybrid', short: '4H', cat: 'hybrid', loft: 22, carry: 198, launch: 14, spin: 4900, accuracy: 0.75, forgiveness: 0.76 },
  { id: '2I', name: '2 Iron', short: '2i', cat: 'iron', loft: 18, carry: 212, launch: 10.5, spin: 4200, accuracy: 0.66, forgiveness: 0.45 },
  { id: '3I', name: '3 Iron', short: '3i', cat: 'iron', loft: 21, carry: 203, launch: 11.5, spin: 4500, accuracy: 0.69, forgiveness: 0.5 },
  { id: '4I', name: '4 Iron', short: '4i', cat: 'iron', loft: 23, carry: 195, launch: 12.5, spin: 4800, accuracy: 0.72, forgiveness: 0.55 },
  { id: '5I', name: '5 Iron', short: '5i', cat: 'iron', loft: 26, carry: 185, launch: 13.5, spin: 5300, accuracy: 0.75, forgiveness: 0.6 },
  { id: '6I', name: '6 Iron', short: '6i', cat: 'iron', loft: 29, carry: 174, launch: 15, spin: 6200, accuracy: 0.78, forgiveness: 0.65 },
  { id: '7I', name: '7 Iron', short: '7i', cat: 'iron', loft: 33, carry: 162, launch: 16.5, spin: 7000, accuracy: 0.8, forgiveness: 0.7 },
  { id: '8I', name: '8 Iron', short: '8i', cat: 'iron', loft: 37, carry: 150, launch: 18.5, spin: 7800, accuracy: 0.82, forgiveness: 0.72 },
  { id: '9I', name: '9 Iron', short: '9i', cat: 'iron', loft: 41, carry: 138, launch: 21, spin: 8500, accuracy: 0.84, forgiveness: 0.74 },
  { id: 'PW', name: 'Pitching Wedge', short: 'PW', cat: 'wedge', loft: 46, carry: 126, launch: 24, spin: 9200, accuracy: 0.86, forgiveness: 0.76 },
  { id: 'GW', name: 'Gap Wedge', short: 'GW', cat: 'wedge', loft: 50, carry: 112, launch: 27, spin: 9700, accuracy: 0.87, forgiveness: 0.76 },
  { id: 'SW', name: 'Sand Wedge', short: 'SW', cat: 'wedge', loft: 56, carry: 97, launch: 31, spin: 10100, accuracy: 0.88, forgiveness: 0.78 },
  { id: 'LW', name: 'Lob Wedge', short: 'LW', cat: 'wedge', loft: 60, carry: 82, launch: 35, spin: 10400, accuracy: 0.88, forgiveness: 0.7 },
  { id: 'PT', name: 'Putter', short: 'PT', cat: 'putter', loft: 3, carry: 0, launch: 0, spin: 0, accuracy: 0.95, forgiveness: 0.9 },
];

// Fictional equipment (bible BRD-01..04, Pro Shop SKUs EQ-001..011). All brands, model names and designs are original.
// Every slot has a free "Origin" starter; shop items trade one strength for another (no straight upgrades).
// Modifiers: dist (multiplier), acc (+/-), forg (+/-), spin (mult), launch (+deg). price: Golf Coins (0 = starter).
// card: the ratings shown on the store card.
export const BRANDS_EQUIP = {
  vortex: { code: 'BRD-01', name: 'Vortex Golf', specialty: 'Drivers / woods', look: 'Modern aerodynamic' },
  alder: { code: 'BRD-02', name: 'Alder Forge', specialty: 'Irons / wedges', look: 'Forged precision' },
  northline: { code: 'BRD-03', name: 'Northline', specialty: 'Putters', look: 'Minimal engineered' },
  aeropeak: { code: 'BRD-04', name: 'AeroPeak', specialty: 'Balls', look: 'Tour performance' },
};
const VX = { crown: '#15181d', accent: '#18c3c9', face: '#4c525a' };
export const BRAND_MODELS = {
  driver: [
    { id: 'vx-origin-d', brand: 'Vortex', model: 'Origin', price: 0, dist: 1.0, acc: 0.02, forg: 0.06, spin: 1.0, launch: 0.3, look: { ...VX, crown: '#22262d', accent: '#7fd8dc' }, card: { Distance: 86, Accuracy: 86, Forgiveness: 84 }, blurb: 'A dependable all-rounder. Nothing flashy, nothing scary.' },
    { id: 'vx-glide', brand: 'Vortex', model: 'Glide', price: 1600, dist: 0.985, acc: 0.05, forg: 0.14, spin: 1.04, launch: 0.6, look: { ...VX, crown: '#1b2733', accent: '#9fe3e6' }, card: { Distance: 82, Accuracy: 92, Forgiveness: 95 }, blurb: 'Huge stability and a high, straight flight. Gives up a few yards.' },
    { id: 'vx-x9', sku: 'EQ-001', brand: 'Vortex', model: 'X9', price: 2500, dist: 1.03, acc: -0.01, forg: 0.03, spin: 0.97, launch: 0.2, look: VX, card: { Distance: 94, Accuracy: 82, Forgiveness: 80 }, blurb: 'Aerodynamic carbon crown built for maximum ball speed. Mishits wander.' },
  ],
  wood: [
    { id: 'vx-origin-fw', brand: 'Vortex', model: 'Origin Fairway', price: 0, dist: 1.0, acc: 0.02, forg: 0.06, spin: 1.0, launch: 0.3, look: { ...VX, crown: '#22262d', accent: '#7fd8dc' }, card: { Distance: 84, Control: 82, Forgiveness: 84 }, blurb: 'Easy-launching fairway woods for any lie.' },
    { id: 'vx-drift', sku: 'EQ-002', brand: 'Vortex', model: 'Drift', price: 1900, dist: 1.02, acc: 0.04, forg: 0.03, spin: 1.02, launch: 0.4, look: { ...VX, crown: '#1c2027', accent: '#9fe3e6' }, card: { Distance: 86, Control: 84, Forgiveness: 78 }, blurb: 'Shallow, stable head with extra carry and control. Less forgiving on thin strikes.' },
  ],
  hybrid: [
    { id: 'vx-origin-h', brand: 'Vortex', model: 'Origin Hybrid', price: 0, dist: 1.0, acc: 0.02, forg: 0.06, spin: 1.0, launch: 0.3, look: { ...VX, crown: '#22262d', accent: '#7fd8dc' }, card: { Distance: 84, Control: 84, Forgiveness: 84 }, blurb: 'A friendly long-iron replacement.' },
    { id: 'vx-apex', sku: 'EQ-003', brand: 'Vortex', model: 'Apex', price: 1500, dist: 0.99, acc: 0.03, forg: 0.12, spin: 1.03, launch: 0.5, look: VX, card: { Distance: 82, Control: 86, Forgiveness: 90 }, blurb: 'Low, deep weighting gets the ball up from any lie. A touch shorter.' },
  ],
  iron: [
    { id: 'al-origin', brand: 'Alder Forge', model: 'Origin', price: 0, dist: 1.0, acc: 0.02, forg: 0.04, spin: 1.0, launch: 0.1, look: { finish: '#c9ccd1', accent: '#8a6a4a', style: 'cavity' }, card: { Accuracy: 84, Forgiveness: 84, Distance: 84 }, blurb: 'Classic cavity-back irons. A solid place to start.' },
    { id: 'al-s2', sku: 'EQ-005', brand: 'Alder Forge', model: 'S2', price: 1800, dist: 1.02, acc: 0.0, forg: 0.1, spin: 0.98, launch: 0.3, look: { finish: '#c6c9ce', accent: '#b5652b', style: 'cavity' }, card: { Accuracy: 80, Forgiveness: 90, Distance: 88 }, blurb: 'Wide sole and perimeter weighting keep mishits flying. Harder to flight precisely.' },
    { id: 'al-f7', sku: 'EQ-004', brand: 'Alder Forge', model: 'F7', price: 3200, dist: 1.0, acc: 0.07, forg: -0.05, spin: 1.04, launch: 0, look: { finish: '#d3d6da', accent: '#b5652b', style: 'blade' }, card: { Accuracy: 91, Forgiveness: 78, Distance: 84 }, blurb: 'Compact forged blades for pinpoint control. Punishes off-center strikes.' },
  ],
  wedge: [
    { id: 'al-origin-w', brand: 'Alder Forge', model: 'Origin Wedges', price: 0, dist: 1.0, acc: 0.03, forg: 0.03, spin: 1.0, launch: 0, look: { finish: '#c4c8cd', accent: '#8a6a4a', style: 'wedge' }, grinds: { PW: 'F', GW: 'F', SW: 'M', LW: 'L' }, card: { Spin: 84, Control: 86, Forgiveness: 86 }, blurb: 'All-purpose wedges with a forgiving sole.' },
    { id: 'al-spin54', sku: 'EQ-006', brand: 'Alder Forge', model: 'Spin 54', price: 900, dist: 1.0, acc: 0.04, forg: 0.03, spin: 1.05, launch: 0, look: { finish: '#c4c8cd', accent: '#b5652b', style: 'wedge' }, grinds: { PW: 'F', GW: 'F', SW: 'M', LW: 'M' }, card: { Spin: 92, Control: 88, Forgiveness: 84 }, blurb: 'Mid-bounce set built around a 54° sand wedge. Bites without being twitchy.' },
    { id: 'al-spin60', sku: 'EQ-007', brand: 'Alder Forge', model: 'Spin 60', price: 950, dist: 1.0, acc: 0.05, forg: -0.02, spin: 1.08, launch: 0, look: { finish: '#bfc3c8', accent: '#b5652b', style: 'wedge' }, grinds: { PW: 'F', GW: 'S', SW: 'L', LW: 'L' }, card: { Spin: 95, Control: 90, Forgiveness: 76 }, blurb: 'Low-bounce, high-toe set built around a 60° lob wedge. Maximum stop, less margin.' },
  ],
  putter: [
    { id: 'nl-origin', brand: 'Northline', model: 'Origin', price: 0, dist: 1.0, acc: 0.04, forg: 0.03, spin: 1, launch: 0, look: { finish: '#c7cbd0', accent: '#8aa0b8', style: 'blade' }, putt: { pace: 0, line: 0 }, putter: { balance: 'Slight toe hang', toeHang: 'Slight arc', alignment: 'Single sight line', neck: 'Short neck' }, card: { Feel: 84, Forgiveness: 80 }, blurb: 'A simple, honest blade.' },
    { id: 'nl-axis', sku: 'EQ-008', brand: 'Northline', model: 'Axis', price: 1200, dist: 1.0, acc: 0.05, forg: 0.0, spin: 1, launch: 0, look: { finish: '#c7cbd0', accent: '#2c7be5', style: 'blade' }, putt: { pace: 0.12, line: -0.06 }, putter: { balance: 'Toe hang', toeHang: 'Moderate (arc stroke)', alignment: 'Single sight line', neck: 'Short neck' }, card: { Feel: 94, Forgiveness: 65 }, blurb: 'Milled blade with crisp feedback: a wider pace window, a stricter line.' },
    { id: 'nl-arc', sku: 'EQ-009', brand: 'Northline', model: 'Arc', price: 1350, dist: 1.0, acc: 0.06, forg: 0.08, spin: 1, launch: 0, look: { finish: '#2b2e33', accent: '#2c7be5', style: 'mallet' }, putt: { pace: -0.04, line: 0.14 }, putter: { balance: 'Face balanced', toeHang: 'None (straight stroke)', alignment: 'Triple line', neck: 'Low bend' }, card: { Feel: 85, Forgiveness: 93 }, blurb: 'High-stability mallet: a forgiving line window, a little less touch on pace.' },
  ],
};

export const BALLS = [
  { id: 'ap-origin', brand: 'AeroPeak', model: 'Origin', price: 0, dist: 1.0, spin: 1.0, color: '#ffffff', card: { Distance: 86, Spin: 84 }, blurb: 'A durable two-piece ball for every golfer.' },
  { id: 'ap-tour', sku: 'EQ-010', brand: 'AeroPeak', model: 'Tour', price: 300, dist: 0.995, spin: 1.06, color: '#ffffff', card: { Distance: 82, Spin: 92 }, blurb: 'Urethane cover: stops quickly on the greens, curves more in the wind.' },
  { id: 'ap-flight', sku: 'EQ-011', brand: 'AeroPeak', model: 'Flight', price: 200, dist: 1.015, spin: 0.92, color: '#fff7cf', card: { Distance: 94, Spin: 66 }, blurb: 'Low-spin distance ball: flies straighter and further, releases on landing.' },
];

// gameplay gloves (the glove's look/colour comes from the golfer's outfit)
export const GLOVE_MODELS = [
  { id: 'gl-basic', brand: 'Fairway Supply', model: 'Basic Glove', price: 0, grip: 0, card: { Grip: 80 }, blurb: 'A standard synthetic glove.' },
  { id: 'gl-classic', sku: 'EQ-012', brand: 'Fairway Supply', model: 'Fairway Classic', price: 250, grip: 0.02, card: { Grip: 88 }, blurb: 'Cabretta leather for a slightly more secure grip: a small boost to every timing window.' },
];

export const DEFAULT_BAG = ['DR', '3W', '5W', '3H', '5I', '6I', '7I', '8I', '9I', 'PW', 'GW', 'SW', 'LW', 'PT'];

export const DEFAULT_EQUIPMENT = {
  driver: 'vx-origin-d', wood: 'vx-origin-fw', hybrid: 'vx-origin-h', iron: 'al-origin', wedge: 'al-origin-w', putter: 'nl-origin', ball: 'ap-origin',
  glove: 'gl-basic', bag: 'bag-basic', headcover: 'hc-none',
};
// equipment slot used by each club
export const slotFor = (t) => (t.id === 'DR' ? 'driver' : t.cat);

export function clubType(id) { return CLUB_TYPES.find(c => c.id === id); }

export function modelFor(slot, equipment) {
  const list = BRAND_MODELS[slot];
  return list.find(m => m.id === equipment[slot]) || list[0];
}

// Build the playable bag with final stats given golfer attributes.
export function buildBag(bagIds, equipment, attrs) {
  const ball = BALLS.find(b => b.id === equipment.ball) || BALLS[0];
  const grip = (GLOVE_MODELS.find(g => g.id === equipment.glove) || GLOVE_MODELS[0]).grip;
  const order = CLUB_TYPES.map(c => c.id);
  return bagIds
    .slice()
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map(id => {
      const t = clubType(id);
      const m = modelFor(slotFor(t), equipment);
      // power 50 -> 1.0, 100 -> ~1.14, 0 -> 0.82
      const pw = attrs.power ?? 50;
      const powerMul = 0.82 + (pw / 100) * 0.32;
      const isLong = t.cat === 'wood' || t.cat === 'hybrid';
      const skill = isLong ? attrs.driving ?? attrs.accuracy ?? 50 : (t.cat === 'wedge' ? attrs.shortGame ?? 50 : attrs.approach ?? attrs.accuracy ?? 50);
      return {
        id, name: t.name, short: t.short, cat: t.cat, loft: t.loft,
        brand: m.brand, model: m.model, modelId: m.id, look: m.look || {}, blurb: m.blurb || '',
        bounce: t.cat === 'wedge' ? ({ PW: 5, GW: 10, SW: 12, LW: 8 })[id] ?? 10 : null,
        grind: t.cat === 'wedge' ? (m.grinds?.[id] || 'F') : null,
        putterSpec: t.cat === 'putter' ? m.putter : null,
        baseForg: t.forgiveness + m.forg,
        putt: t.cat === 'putter' ? (m.putt || { pace: 0, line: 0 }) : null,
        carry: t.carry * m.dist * ball.dist * (t.cat === 'putter' ? 1 : powerMul),
        launch: t.launch + m.launch,
        spin: t.spin * m.spin * ball.spin,
        accuracy: Math.min(0.99, t.accuracy + m.acc + (skill - 50) / 500),
        forgiveness: Math.min(0.99, t.forgiveness + m.forg + grip),
      };
    });
}
