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

// Fictional equipment (bible BRD-01..04, starter SKUs EQ-001..011). All brands, model names and designs are original.
// Modifiers: dist (multiplier), acc (+/-), forg (+/-), spin (mult), launch (+deg)
export const BRANDS_EQUIP = {
  vortex: { code: 'BRD-01', name: 'Vortex Golf', specialty: 'Drivers / woods', look: 'Modern aerodynamic' },
  alder: { code: 'BRD-02', name: 'Alder Forge', specialty: 'Irons / wedges', look: 'Forged precision' },
  northline: { code: 'BRD-03', name: 'Northline', specialty: 'Putters', look: 'Minimal engineered' },
  aeropeak: { code: 'BRD-04', name: 'AeroPeak', specialty: 'Balls', look: 'Tour performance' },
};
export const BRAND_MODELS = {
  wood: [
    { id: 'vx-x9', sku: 'EQ-001', brand: 'Vortex', model: 'X9', dist: 1.03, acc: -0.01, forg: 0.04, spin: 0.97, launch: 0.2, unlock: 1, look: { crown: '#15181d', accent: '#18c3c9', face: '#4c525a' }, blurb: 'Aerodynamic carbon crown built for maximum ball speed. Distance 94 / Accuracy 82.' },
    { id: 'vx-drift', sku: 'EQ-002', brand: 'Vortex', model: 'Drift', dist: 1.0, acc: 0.04, forg: 0.08, spin: 1.02, launch: 0.4, unlock: 1, look: { crown: '#1c2027', accent: '#9fe3e6', face: '#565c64' }, blurb: 'Shallow, stable head that is easy to launch from the deck. Distance 86 / Control 84.' },
  ],
  hybrid: [
    { id: 'vx-apex', sku: 'EQ-003', brand: 'Vortex', model: 'Apex', dist: 1.0, acc: 0.03, forg: 0.12, spin: 1.0, launch: 0.4, unlock: 1, look: { crown: '#171a20', accent: '#18c3c9', face: '#4c525a' }, blurb: 'Low, deep weighting gets the ball up from any lie. Forgiveness 90.' },
  ],
  iron: [
    { id: 'al-f7', sku: 'EQ-004', brand: 'Alder Forge', model: 'F7', dist: 1.0, acc: 0.06, forg: -0.04, spin: 1.04, launch: 0, unlock: 2, look: { finish: '#d3d6da', accent: '#b5652b', style: 'blade' }, blurb: 'Compact forged cavity for players who shape every shot. Accuracy 91 / Forgiveness 78.' },
    { id: 'al-s2', sku: 'EQ-005', brand: 'Alder Forge', model: 'S2', dist: 1.02, acc: 0.0, forg: 0.08, spin: 0.98, launch: 0.3, unlock: 1, look: { finish: '#c6c9ce', accent: '#b5652b', style: 'cavity' }, blurb: 'Wide sole and perimeter weighting keep mishits flying. Accuracy 80 / Forgiveness 90.' },
  ],
  wedge: [
    { id: 'al-spin', sku: 'EQ-006/007', brand: 'Alder Forge', model: 'Spin', dist: 1.0, acc: 0.05, forg: 0.02, spin: 1.07, launch: 0, unlock: 1, look: { finish: '#c4c8cd', accent: '#b5652b', style: 'wedge' }, grinds: { PW: 'F', GW: 'F', SW: 'M', LW: 'L' }, blurb: 'Milled grooves for maximum bite around the greens. Spin 92 (54°) / 95 (60°).' },
  ],
  putter: [
    { id: 'nl-axis', sku: 'EQ-008', brand: 'Northline', model: 'Axis', dist: 1.0, acc: 0.05, forg: 0.0, spin: 1, launch: 0, unlock: 1, look: { finish: '#c7cbd0', accent: '#2c7be5', style: 'blade' }, putter: { balance: 'Toe hang', toeHang: 'Moderate (arc stroke)', alignment: 'Single sight line', neck: 'Short neck' }, blurb: 'Precision-milled blade with crisp feedback. Feel 94 / Forgiveness 65.' },
    { id: 'nl-arc', sku: 'EQ-009', brand: 'Northline', model: 'Arc', dist: 1.0, acc: 0.06, forg: 0.08, spin: 1, launch: 0, unlock: 2, look: { finish: '#2b2e33', accent: '#2c7be5', style: 'mallet' }, putter: { balance: 'Face balanced', toeHang: 'None (straight stroke)', alignment: 'Triple line', neck: 'Low bend' }, blurb: 'High-stability mallet that resists twisting. Feel 85 / Forgiveness 93.' },
  ],
};

export const BALLS = [
  { id: 'ap-tour', sku: 'EQ-010', brand: 'AeroPeak', model: 'Tour', dist: 1.0, spin: 1.05, unlock: 1, color: '#ffffff' },
  { id: 'ap-flight', sku: 'EQ-011', brand: 'AeroPeak', model: 'Flight', dist: 1.015, spin: 0.94, unlock: 1, color: '#ffffff' },
];

export const DEFAULT_BAG = ['DR', '3W', '5W', '3H', '5I', '6I', '7I', '8I', '9I', 'PW', 'GW', 'SW', 'LW', 'PT'];

export const DEFAULT_EQUIPMENT = {
  wood: 'vx-x9', hybrid: 'vx-apex', iron: 'al-s2', wedge: 'al-spin', putter: 'nl-axis', ball: 'ap-tour',
};

export function clubType(id) { return CLUB_TYPES.find(c => c.id === id); }

export function modelFor(cat, equipment) {
  const list = BRAND_MODELS[cat];
  return list.find(m => m.id === equipment[cat]) || list[0];
}

// Build the playable bag with final stats given golfer attributes.
export function buildBag(bagIds, equipment, attrs) {
  const ball = BALLS.find(b => b.id === equipment.ball) || BALLS[0];
  const order = CLUB_TYPES.map(c => c.id);
  return bagIds
    .slice()
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map(id => {
      const t = clubType(id);
      const m = modelFor(t.cat, equipment);
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
        carry: t.carry * m.dist * ball.dist * (t.cat === 'putter' ? 1 : powerMul),
        launch: t.launch + m.launch,
        spin: t.spin * m.spin * ball.spin,
        accuracy: Math.min(0.99, t.accuracy + m.acc + (skill - 50) / 500),
        forgiveness: Math.min(0.99, t.forgiveness + m.forg),
      };
    });
}
