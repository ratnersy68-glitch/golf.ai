// Visual + physical identity for each course.
// Colors are sRGB hex. Terrain params drive the hole generator.

export const THEMES = {
  // CRS-01 Cedar Vale Municipal: friendly public parkland, oaks and maples, soft greens
  cedarvale: {
    fairway: '#56a03a', fairway2: '#62ad42', rough: '#3a7d2a', deep: '#336f25', green: '#63b247', fringe: '#55a33c',
    sand: '#efe6d2', waste: '#e2d4b4', water: '#24535a', brush: '#6d5a36', straw: '#7a5a34', tee: '#5aa63e',
    sky: ['#5596d8', '#d6e8f6'], fog: '#cfe0ed', fogDensity: 0.0011, sun: { elev: 50, az: 205, color: '#fff4e2', intensity: 3.1 },
    undulation: 5, undFreq: 1 / 120, lateralRise: 0.04, trees: { types: ['oak', 'oak', 'maple', 'pine'], density: 0.8, near: 22, lines: true },
    extras: [], birds: 'songbird', crowd: 0.35, roughType: 'rough', cartPath: true, building: 'colonial',
  },
  // CRS-02 Harbor Point Links: windy seaside dunes, fescue, gorse and pot bunkers
  harborpoint: {
    fairway: '#78a547', fairway2: '#85b050', rough: '#7b8b3f', deep: '#a39a5c', green: '#72ab49', fringe: '#6ca243',
    sand: '#e9dcbb', waste: '#e3d3a9', water: '#2a6283', brush: '#7a7a3c', straw: '#7a6a45', tee: '#76a247',
    sky: ['#6491bf', '#dfe7ed'], fog: '#d5dee5', fogDensity: 0.0013, sun: { elev: 38, az: 215, color: '#fff1dc', intensity: 2.9 },
    undulation: 4, undFreq: 1 / 38, lateralRise: 0.0, trees: { types: [], density: 0, near: 999, lines: false },
    extras: ['fescue'], birds: 'gull', crowd: 0.5, roughType: 'links', building: 'lodge', links: true, seaLevel: -12,
  },
  // CRS-08 Blackstone Ridge: championship course in an old granite quarry; dark rock, white sand, fast greens
  blackstone: {
    fairway: '#4e9536', fairway2: '#59a13e', rough: '#386f29', deep: '#3a5e2c', green: '#5aa943', fringe: '#4e9a39',
    sand: '#f2efe8', waste: '#cfc8b8', water: '#1e3f45', brush: '#5e5f60', straw: '#6d4d2b', tee: '#54a03a',
    sky: ['#4a7fbf', '#d4e0ea'], fog: '#cbd6e0', fogDensity: 0.0012, sun: { elev: 44, az: 210, color: '#fff2de', intensity: 3.1 },
    undulation: 6.5, undFreq: 1 / 110, lateralRise: 0.05, trees: { types: ['pine', 'oak', 'pine', 'maple'], density: 0.7, near: 24, lines: true },
    extras: ['fescue', 'granite'], birds: 'songbird', crowd: 0.8, roughType: 'thick', building: 'granite',
  },
};

// Lie behaviour per surface. dist: carry multiplier range, spin mult, disp mult
export const LIES = {
  tee: { name: 'TEE', dist: [1.0, 1.0], spin: 1.0, disp: 1.0, color: '#7fd06b' },
  fairway: { name: 'FAIRWAY', dist: [0.97, 1.0], spin: 1.0, disp: 1.0, color: '#7fd06b' },
  fringe: { name: 'FRINGE', dist: [0.95, 0.99], spin: 0.9, disp: 1.0, color: '#9bdc7a' },
  green: { name: 'GREEN', dist: [1, 1], spin: 1.0, disp: 1.0, color: '#b6f09a' },
  firstcut: { name: 'FIRST CUT', dist: [0.92, 0.97], spin: 0.85, disp: 1.1, color: '#c9d86b' },
  rough: { name: 'ROUGH', dist: [0.8, 0.9], spin: 0.55, disp: 1.35, color: '#e0c050' },
  deep: { name: 'DEEP ROUGH', dist: [0.6, 0.75], spin: 0.4, disp: 1.8, color: '#e08a40' },
  sand: { name: 'BUNKER', dist: [0.72, 0.85], spin: 0.6, disp: 1.4, color: '#f0dca0' },
  waste: { name: 'WASTE AREA', dist: [0.85, 0.93], spin: 0.7, disp: 1.2, color: '#e8cf90' },
  straw: { name: 'PINE STRAW', dist: [0.84, 0.92], spin: 0.65, disp: 1.25, color: '#d69a58' },
  path: { name: 'ROAD', dist: [0.9, 0.96], spin: 0.8, disp: 1.1, color: '#c0c0c0' },
  water: { name: 'WATER', dist: [0, 0], spin: 0, disp: 1, color: '#4aa3ff' },
  brush: { name: 'PENALTY AREA', dist: [0, 0], spin: 0, disp: 1, color: '#ff6a4a' },
};
