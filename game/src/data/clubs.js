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

// Real-world equipment. Modifiers: dist (multiplier), acc (+/-), forg (+/-), spin (mult), launch (+deg)
export const BRAND_MODELS = {
  wood: [
    { id: 'tm-qi10', brand: 'TaylorMade', model: 'Qi35 Max', dist: 1.0, acc: 0.03, forg: 0.12, spin: 1.05, launch: 0.5, unlock: 1, look: { crown: '#141518', accent: '#c8102e', face: '#5a5f66' }, blurb: 'Carbon face, max MOI for mishit protection.' },
    { id: 'cw-ai', brand: 'Callaway', model: 'Paradym Ai Smoke', dist: 1.01, acc: 0.0, forg: 0.08, spin: 1.0, launch: 0.2, unlock: 1, look: { crown: '#1b1d22', accent: '#35c2e8', face: '#3c4046' }, blurb: 'AI-designed face that holds speed across the face.' },
    { id: 'ti-gt3', brand: 'Titleist', model: 'GT3', dist: 1.02, acc: 0.04, forg: -0.04, spin: 0.95, launch: 0, unlock: 3, look: { crown: '#0f1012', accent: '#b8bcc2', face: '#6b7078' }, blurb: 'Adjustable CG track. Tour-preferred flight.' },
    { id: 'pg-g430', brand: 'Ping', model: 'G430 Max 10K', dist: 0.99, acc: 0.06, forg: 0.16, spin: 1.06, launch: 0.6, unlock: 2, look: { crown: '#111214', accent: '#b87333', face: '#5d6168' }, blurb: '10,000 MOI. The straightest driver in the bag.' },
    { id: 'cb-ds', brand: 'Cobra', model: 'Darkspeed LS', dist: 1.035, acc: -0.03, forg: -0.08, spin: 0.9, launch: -0.4, unlock: 5, look: { crown: '#0c0c0e', accent: '#f5d100', face: '#44484e' }, blurb: 'Low-spin speed machine for high swing speeds.' },
  ],
  hybrid: [
    { id: 'tm-qi10h', brand: 'TaylorMade', model: 'Qi35 Rescue', dist: 1.0, acc: 0.02, forg: 0.08, spin: 1.0, launch: 0.3, unlock: 1, look: { crown: '#16171a', accent: '#c8102e', face: '#5a5f66' }, blurb: 'Easy launch from any lie.' },
    { id: 'ti-gt2h', brand: 'Titleist', model: 'GT2 Hybrid', dist: 1.01, acc: 0.03, forg: 0.04, spin: 0.98, launch: 0, unlock: 2, look: { crown: '#101113', accent: '#b8bcc2', face: '#6b7078' }, blurb: 'Iron-like control, fairway-wood forgiveness.' },
    { id: 'pg-g430h', brand: 'Ping', model: 'G430 Hybrid', dist: 0.995, acc: 0.05, forg: 0.12, spin: 1.03, launch: 0.5, unlock: 3, look: { crown: '#121315', accent: '#b87333', face: '#5d6168' }, blurb: 'High-launching and very stable.' },
  ],
  iron: [
    { id: 'tm-p790', brand: 'TaylorMade', model: 'P790', dist: 1.02, acc: 0.0, forg: 0.08, spin: 0.97, launch: 0.3, unlock: 1, look: { finish: '#c9ccd1', accent: '#c8102e', style: 'hollow' }, blurb: 'Forged hollow body. Distance with a player\'s look.' },
    { id: 'ti-t100', brand: 'Titleist', model: 'T100', dist: 0.99, acc: 0.06, forg: -0.06, spin: 1.04, launch: 0, unlock: 2, look: { finish: '#d4d7db', accent: '#1c1c1c', style: 'blade' }, blurb: 'Tour-proven forged cavity. Pure feel.' },
    { id: 'mz-243', brand: 'Mizuno', model: 'Pro 243', dist: 1.0, acc: 0.05, forg: -0.02, spin: 1.03, launch: 0, unlock: 3, look: { finish: '#e1e3e6', accent: '#1c3f94', style: 'blade' }, blurb: 'Grain-flow forged in Hiroshima. Buttery soft.' },
    { id: 'sx-zx7', brand: 'Srixon', model: 'ZX7 Mk II', dist: 1.0, acc: 0.04, forg: 0.0, spin: 1.02, launch: 0.1, unlock: 2, look: { finish: '#cfd2d6', accent: '#e4002b', style: 'cavity' }, blurb: 'Forged with a tour cavity for precise shaping.' },
    { id: 'pg-i230', brand: 'Ping', model: 'i230', dist: 1.0, acc: 0.03, forg: 0.05, spin: 1.0, launch: 0.2, unlock: 1, look: { finish: '#b9bdc2', accent: '#b87333', style: 'cavity' }, blurb: 'Players iron with a touch of forgiveness.' },
    { id: 'cw-apex', brand: 'Callaway', model: 'Apex Ai200', dist: 1.03, acc: -0.01, forg: 0.1, spin: 0.96, launch: 0.4, unlock: 4, look: { finish: '#c5c8cc', accent: '#35c2e8', style: 'hollow' }, blurb: 'Fast face, forged feel, big distance.' },
  ],
  wedge: [
    { id: 'ti-sm10', brand: 'Titleist', model: 'Vokey SM10', dist: 1.0, acc: 0.05, forg: 0.0, spin: 1.06, launch: 0, unlock: 1, look: { finish: '#c8ccd1', accent: '#8b0000', style: 'wedge' }, grinds: { GW: 'F', SW: 'M', LW: 'L', PW: 'F' }, blurb: 'The tour\'s most-played wedge. Pick your grind.' },
    { id: 'cl-rtx6', brand: 'Cleveland', model: 'RTX 6 ZipCore', dist: 1.0, acc: 0.04, forg: 0.04, spin: 1.05, launch: 0, unlock: 1, look: { finish: '#bfc3c8', accent: '#e36c0a', style: 'wedge' }, grinds: { GW: 'MID', SW: 'FULL', LW: 'LOW', PW: 'MID' }, blurb: 'ZipCore for consistent spin on every strike.' },
    { id: 'cw-jaws', brand: 'Callaway', model: 'Jaws Raw', dist: 1.0, acc: 0.03, forg: 0.02, spin: 1.08, launch: 0.2, unlock: 2, look: { finish: '#6b5b48', accent: '#35c2e8', style: 'wedge' }, grinds: { GW: 'S', SW: 'W', LW: 'Z', PW: 'S' }, blurb: 'Raw face that rusts for maximum spin.' },
    { id: 'tm-mg4', brand: 'TaylorMade', model: 'MG4', dist: 1.0, acc: 0.04, forg: 0.02, spin: 1.07, launch: 0, unlock: 3, look: { finish: '#2b2d31', accent: '#c8102e', style: 'wedge' }, grinds: { GW: 'SB', SW: 'SB', LW: 'TW', PW: 'SB' }, blurb: 'Spin Tread face and raw finish.' },
  ],
  putter: [
    { id: 'sc-np2', brand: 'Scotty Cameron', model: 'Newport 2', dist: 1.0, acc: 0.04, forg: 0.0, spin: 1, launch: 0, unlock: 1, look: { finish: '#c7cbd0', accent: '#d7282f', style: 'blade' }, putter: { balance: 'Toe hang', toeHang: 'Moderate (arc stroke)', alignment: 'Single sight line', neck: 'Plumber\'s neck' }, blurb: 'The iconic tour blade. Milled 303 stainless.' },
    { id: 'bt-bb8', brand: 'Bettinardi', model: 'BB8 Flow', dist: 1.0, acc: 0.05, forg: 0.04, spin: 1, launch: 0, unlock: 2, look: { finish: '#2b2e33', accent: '#2c7be5', style: 'mid' }, putter: { balance: 'Slight toe hang', toeHang: 'Slight arc', alignment: 'Wing sight line', neck: 'Flow neck' }, blurb: 'Honeycomb face, precision milled in Baltimore.' },
    { id: 'od-7', brand: 'Odyssey', model: 'White Hot OG #7', dist: 1.0, acc: 0.05, forg: 0.06, spin: 1, launch: 0, unlock: 1, look: { finish: '#2f3237', accent: '#ffffff', style: 'fang' }, putter: { balance: 'Face balanced', toeHang: 'None (straight stroke)', alignment: 'Fang lines', neck: 'Double bend' }, blurb: 'Legendary White Hot insert feel.' },
    { id: 'pg-anser', brand: 'Ping', model: 'Anser', dist: 1.0, acc: 0.03, forg: 0.02, spin: 1, launch: 0, unlock: 1, look: { finish: '#bfc3c7', accent: '#1b1b1b', style: 'blade' }, putter: { balance: 'Toe hang', toeHang: 'Strong arc', alignment: 'Single dot line', neck: 'Plumber\'s neck' }, blurb: 'The original. Timeless heel-toe weighting.' },
    { id: 'tm-spider', brand: 'TaylorMade', model: 'Spider Tour X', dist: 1.0, acc: 0.06, forg: 0.08, spin: 1, launch: 0, unlock: 4, look: { finish: '#1c1d20', accent: '#c8102e', style: 'mallet' }, putter: { balance: 'Face balanced', toeHang: 'None (straight stroke)', alignment: 'True Path sight line', neck: 'Short slant' }, blurb: 'High-MOI mallet that refuses to twist.' },
    { id: 'sc-ph', brand: 'Scotty Cameron', model: 'Phantom 11', dist: 1.0, acc: 0.07, forg: 0.07, spin: 1, launch: 0, unlock: 6, look: { finish: '#34373c', accent: '#d7282f', style: 'mallet' }, putter: { balance: 'Face balanced', toeHang: 'Minimal', alignment: 'Tri-line alignment', neck: 'Low bend' }, blurb: 'Stable Phantom mallet with a wide stance.' },
  ],
};

export const BALLS = [
  { id: 'prov1', brand: 'Titleist', model: 'Pro V1', dist: 1.0, spin: 1.03, unlock: 1, color: '#ffffff' },
  { id: 'prov1x', brand: 'Titleist', model: 'Pro V1x', dist: 1.01, spin: 1.06, unlock: 2, color: '#ffffff' },
  { id: 'tp5', brand: 'TaylorMade', model: 'TP5x', dist: 1.012, spin: 1.0, unlock: 3, color: '#ffffff' },
  { id: 'chrome', brand: 'Callaway', model: 'Chrome Soft', dist: 1.0, spin: 1.0, unlock: 1, color: '#fff8d0' },
  { id: 'zstar', brand: 'Srixon', model: 'Z-Star XV', dist: 1.008, spin: 1.04, unlock: 4, color: '#ffffff' },
  { id: 'bxs', brand: 'Bridgestone', model: 'Tour B XS', dist: 1.004, spin: 1.05, unlock: 5, color: '#ffffff' },
  { id: 'optic', brand: 'Srixon', model: 'Q-Star Tour Divide', dist: 1.0, spin: 1.0, unlock: 2, color: '#f6ff3c' },
];

export const DEFAULT_BAG = ['DR', '3W', '5W', '3H', '5I', '6I', '7I', '8I', '9I', 'PW', 'GW', 'SW', 'LW', 'PT'];

export const DEFAULT_EQUIPMENT = {
  wood: 'tm-qi10', hybrid: 'tm-qi10h', iron: 'tm-p790', wedge: 'ti-sm10', putter: 'sc-np2', ball: 'prov1',
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
