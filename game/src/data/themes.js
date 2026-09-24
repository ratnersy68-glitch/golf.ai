// Visual + physical identity for each course.
// Colors are sRGB hex. Terrain params drive the hole generator.

export const THEMES = {
  augusta: {
    fairway: '#4e9a34', fairway2: '#5aa83d', rough: '#2f6e22', deep: '#2a5e1f', green: '#5fb043', fringe: '#4f9f38',
    sand: '#f4f1ea', waste: '#e8dcc0', water: '#1f4d4a', brush: '#6d5a36', straw: '#8a5a2b', tee: '#57a53b',
    sky: ['#4f8fd6', '#cfe4f5'], fog: '#c9dcea', fogDensity: 0.0011, sun: { elev: 48, az: 210, color: '#fff4e0', intensity: 3.1 },
    undulation: 7, undFreq: 1 / 130, lateralRise: 0.06, trees: { types: ['pine', 'pine', 'pine', 'oak'], density: 1.0, near: 16, lines: true },
    extras: ['azalea', 'straw'], birds: 'songbird', crowd: 0.6, roughType: 'rough', building: 'antebellum',
  },
  pebble: {
    fairway: '#6a9a3e', fairway2: '#76a646', rough: '#4d7a2e', deep: '#5a6b35', green: '#6aa446', fringe: '#5f9a3c',
    sand: '#e9dcc0', waste: '#dccda8', water: '#1a4e6e', brush: '#7a7048', straw: '#7a6a45', tee: '#6aa040',
    sky: ['#6f9cc9', '#e1e8ee'], fog: '#d5dfe6', fogDensity: 0.0016, sun: { elev: 38, az: 230, color: '#fff2dc', intensity: 2.9 },
    undulation: 4, undFreq: 1 / 90, lateralRise: 0.02, trees: { types: ['cypress', 'cypress', 'pine'], density: 0.35, near: 26, lines: false },
    extras: ['rocks'], birds: 'gull', crowd: 0.4, roughType: 'rough', cartPath: true, building: 'lodge', seaLevel: -11,
  },
  sawgrass: {
    fairway: '#4f9636', fairway2: '#5ca33f', rough: '#3a7a28', deep: '#2f6a22', green: '#5dab41', fringe: '#4e9c38',
    sand: '#f1eadb', waste: '#d9c9a2', water: '#1d4f53', brush: '#6d5a36', straw: '#8a5a2b', tee: '#55a03a',
    sky: ['#3d86d8', '#d7e8f5'], fog: '#d3e3ee', fogDensity: 0.001, sun: { elev: 55, az: 200, color: '#fff6e6', intensity: 3.3 },
    undulation: 2.2, undFreq: 1 / 60, lateralRise: 0.035, trees: { types: ['palm', 'oak', 'pine', 'palm'], density: 0.75, near: 18, lines: true },
    extras: ['straw'], birds: 'songbird', crowd: 0.7, roughType: 'rough', cartPath: true, building: 'mediterranean',
  },
  torrey: {
    fairway: '#6c9a3c', fairway2: '#79a646', rough: '#56822f', deep: '#687a36', green: '#65a444', fringe: '#5a9a3b',
    sand: '#eadfc6', waste: '#d7c7a0', water: '#285f7a', brush: '#8a7a4c', straw: '#7a6a45', tee: '#68a03e',
    sky: ['#86a9c8', '#e6e9ea'], fog: '#dfe3e3', fogDensity: 0.0019, sun: { elev: 42, az: 220, color: '#fff0da', intensity: 2.7 },
    undulation: 3.5, undFreq: 1 / 100, lateralRise: 0.02, trees: { types: ['torreypine', 'eucalyptus'], density: 0.3, near: 30, lines: false },
    extras: [], birds: 'gull', crowd: 0.4, roughType: 'kikuyu', cartPath: true, building: 'modern', seaLevel: -30,
  },
  bethpage: {
    fairway: '#4d8e33', fairway2: '#579a3b', rough: '#35712a', deep: '#607a38', green: '#5aa33f', fringe: '#4d9536',
    sand: '#efe6d3', waste: '#e4d6b5', water: '#23443e', brush: '#6d5a36', straw: '#6d4d2b', tee: '#529a38',
    sky: ['#7b9cbf', '#dfe6ec'], fog: '#d5dde3', fogDensity: 0.0013, sun: { elev: 40, az: 210, color: '#fff1dc', intensity: 2.8 },
    undulation: 8, undFreq: 1 / 120, lateralRise: 0.07, trees: { types: ['oak', 'oak', 'maple', 'pine'], density: 1.0, near: 20, lines: true },
    extras: ['fescue'], birds: 'songbird', crowd: 0.7, roughType: 'thick', building: 'colonial',
  },
  pinehurst: {
    fairway: '#679b3c', fairway2: '#72a644', rough: '#8e8a55', deep: '#8e8a55', green: '#63a443', fringe: '#5b9a3c',
    sand: '#efe3c7', waste: '#e2d0a6', water: '#2a4d48', brush: '#8a7a4c', straw: '#8a5a2b', tee: '#60a03c',
    sky: ['#5b95d0', '#dbe8f2'], fog: '#d9e3ea', fogDensity: 0.0011, sun: { elev: 50, az: 205, color: '#fff3dd', intensity: 3.1 },
    undulation: 3.2, undFreq: 1 / 90, lateralRise: 0.02, trees: { types: ['longleaf', 'longleaf', 'pine'], density: 0.6, near: 34, lines: true },
    extras: ['wiregrass', 'straw'], birds: 'songbird', crowd: 0.5, roughType: 'sandy', building: 'colonial', sandyRough: true,
  },
  standrews: {
    fairway: '#7aa447', fairway2: '#88b050', rough: '#768a3c', deep: '#9a8f55', green: '#74ab48', fringe: '#6fa244',
    sand: '#d9c9a0', waste: '#6f7a34', water: '#35505a', brush: '#6b7a30', straw: '#7a6a45', tee: '#7aa048',
    sky: ['#7f9ab3', '#dfe5e8'], fog: '#d3dade', fogDensity: 0.0011, sun: { elev: 34, az: 200, color: '#f7f0e2', intensity: 2.8 },
    undulation: 2.4, undFreq: 1 / 28, lateralRise: 0.0, trees: { types: [], density: 0, near: 999, lines: false },
    extras: ['gorse', 'fescue', 'town'], birds: 'gull', crowd: 0.5, roughType: 'links', building: 'rna', links: true,
  },
  valhalla: {
    fairway: '#4a9435', fairway2: '#56a03e', rough: '#327328', deep: '#2d6522', green: '#58aa40', fringe: '#4a9a37',
    sand: '#f2ebdb', waste: '#e4d6b5', water: '#2b5550', brush: '#6d5a36', straw: '#6d4d2b', tee: '#50a03a',
    sky: ['#4a88cf', '#d5e6f3'], fog: '#cfe0ec', fogDensity: 0.0011, sun: { elev: 52, az: 200, color: '#fff4e2', intensity: 3.2 },
    undulation: 5, undFreq: 1 / 110, lateralRise: 0.04, trees: { types: ['oak', 'maple', 'oak'], density: 0.75, near: 22, lines: true },
    extras: [], birds: 'songbird', crowd: 0.7, roughType: 'thick', cartPath: true, building: 'modern',
  },
  oakmont: {
    fairway: '#5a9a3a', fairway2: '#65a542', rough: '#3c7a2c', deep: '#4f7a32', green: '#62ac48', fringe: '#55a03c',
    sand: '#e3d5b5', waste: '#dccca8', water: '#2b4a45', brush: '#6d5a36', straw: '#6d4d2b', tee: '#58a03c',
    sky: ['#6c95c4', '#dde6ee'], fog: '#d4dde6', fogDensity: 0.0012, sun: { elev: 44, az: 210, color: '#fff2de', intensity: 3.0 },
    undulation: 6, undFreq: 1 / 110, lateralRise: 0.03, trees: { types: ['oak', 'maple'], density: 0.25, near: 45, lines: false },
    extras: ['fescue'], birds: 'songbird', crowd: 0.6, roughType: 'thick', building: 'tudor',
  },
  riviera: {
    fairway: '#679a3a', fairway2: '#72a543', rough: '#557f2c', deep: '#4d7428', green: '#5fa443', fringe: '#579a3b',
    sand: '#efe3c8', waste: '#8a7a4c', water: '#2a5566', brush: '#8a7a4c', straw: '#7a6a45', tee: '#63a03d',
    sky: ['#4f92d8', '#e9e6dc'], fog: '#e3e0d6', fogDensity: 0.0012, sun: { elev: 46, az: 225, color: '#fff0d6', intensity: 3.2 },
    undulation: 4.5, undFreq: 1 / 100, lateralRise: 0.05, trees: { types: ['eucalyptus', 'eucalyptus', 'sycamore', 'palm'], density: 0.65, near: 22, lines: true },
    extras: [], birds: 'songbird', crowd: 0.7, roughType: 'kikuyu', cartPath: true, building: 'spanish',
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
