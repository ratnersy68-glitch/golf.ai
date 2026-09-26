import type { HoleLayout } from '../types';
import { roundedRect } from './shapes';

/**
 * PEBBLE BEACH GOLF LINKS — HOLE 7  ·  Par 3 · 109 yards  ·  scale 1:10
 *
 * Preserved:
 *  - The shortest hole on the PGA TOUR rota: a steep drop from the elevated tee down to a tiny
 *    green on the tip of the peninsula, with Stillwater Cove / Carmel Bay on the right and behind.
 *  - Small, narrow green running away from the tee, ringed by bunkers (six in all).
 *  - Rocky shoreline and surf below the green; wind-bent Monterey cypress.
 */
const green: [number, number][] = [
  [-1.4, 27.2],
  [0.6, 26.8],
  [2.0, 28.0],
  [2.4, 30.6],
  [1.8, 33.0],
  [0.2, 34.0],
  [-1.6, 33.4],
  [-2.3, 31.0],
  [-2.2, 28.6],
];

export const pebble07: HoleLayout = {
  id: 'pebble-07',
  courseId: 'pebble',
  number: 7,
  name: 'Seventh',
  par: 3,
  realYards: 109,
  scale: 10,
  description: 'A wedge straight down to the edge of the Pacific. The shortest hole in championship golf — until the wind blows.',
  signatureFeatures: [
    'Steep drop from an elevated tee to the green',
    'Tiny green on the tip of the peninsula',
    'Six bunkers ringing the green',
    'Pacific surf and rocks right and long',
    'Wind-bent Monterey cypress',
  ],
  playabilityAdjustments: [
    'Played along the ground down the slope from the tee.',
    'Timber rails stand out on the rocks, so a ball that runs off the cliff right or long still drops into the Pacific.',
    'Ball and cup are slightly oversized for readability.',
  ],

  bounds: [
    [-4.6, -3.2],
    [4.6, -3.2],
    [5.2, 10],
    [5.6, 20],
    [7.8, 26],
    [8.4, 33],
    [5.6, 39.6],
    [-0.8, 40.6],
    [-5.2, 38.8],
    [-6.4, 32],
    [-6.0, 22],
    [-5.2, 10],
  ],
  railStyle: 'timber',
  sceneryRadius: 80,

  tee: { at: [0, 0], size: [3.6, 2.8] },
  cup: [0.2, 31.8],
  pinName: 'Back centre',
  altPins: [{ name: 'Front', at: [-0.2, 28.6] }],

  defaultSurface: 'rough',
  surfaces: [
    { type: 'fairway', name: 'slope', points: [[-2.8, 2.2], [2.8, 2.2], [3.4, 12], [3.2, 22], [2.8, 26.4], [-2.8, 26.4], [-3.6, 20], [-3.4, 10]] },
    { type: 'tee', name: 'tee', points: roundedRect(0, 0, 3.6, 2.8, 0.4), smooth: false },
    { type: 'green', name: 'green', points: green },
    { type: 'bunker', name: 'front-left bunker', points: [[-3.4, 26.2], [-2.0, 25.6], [-1.6, 26.7], [-2.6, 28.4], [-3.6, 28.0]] },
    { type: 'bunker', name: 'left bunker', points: [[-3.9, 29.2], [-2.8, 29.0], [-2.7, 31.6], [-3.4, 33.0], [-4.3, 31.6]] },
    { type: 'bunker', name: 'front-right bunker', points: [[1.4, 25.6], [2.9, 25.8], [3.3, 27.0], [2.4, 27.6], [1.3, 26.6]] },
    { type: 'bunker', name: 'right bunker', points: [[2.9, 28.6], [3.9, 28.8], [4.2, 31.2], [3.4, 32.2], [2.8, 30.6]] },
    { type: 'bunker', name: 'back-right bunker', points: [[2.2, 33.8], [3.6, 33.2], [3.9, 34.6], [2.6, 35.6], [1.6, 35.0]] },
    { type: 'bunker', name: 'back-left bunker', points: [[-2.9, 34.0], [-1.6, 34.8], [-1.8, 35.8], [-3.2, 35.6], [-3.6, 34.6]] },
    { type: 'rock', name: 'point rocks', points: [[4.6, 33.6], [6.2, 30.6], [7.4, 33.4], [6.4, 37.4], [3.8, 38.6], [1.8, 37.6]] },
    {
      type: 'water',
      name: 'The Pacific',
      points: [[6.4, 18], [30, 10], [60, 30], [60, 90], [-60, 90], [-60, 44], [-14, 40], [-5.2, 38.2], [-0.8, 39.4], [4.2, 38.8], [7.0, 35.2], [7.6, 28]],
      level: 0,
    },
  ],

  elevation: [
    { kind: 'base', height: 0.6 },
    // the tee sits well above the green
    { kind: 'rampY', y0: 1, y1: 25, h0: 3.6, h1: 0.3 },
    { kind: 'plateau', points: roundedRect(0, 0, 4.4, 3.6, 0.6), height: 4.3, falloff: 1.4 },
    { kind: 'plateau', points: green, height: 0.95, falloff: 1.8, tilt: [0.012, -0.03], tiltOrigin: [0, 30] },
    { kind: 'undulate', points: green, amplitude: 0.03, wavelength: 2.2, seed: 7 },
    // bunkers set down
    { kind: 'mound', at: [-3.1, 30.8], radius: 0.8, height: -0.14, stretch: [0.8, 2] },
    { kind: 'mound', at: [3.4, 30.4], radius: 0.8, height: -0.14, stretch: [0.8, 2] },
    { kind: 'mound', at: [-2.6, 27], radius: 0.8, height: -0.12 },
    { kind: 'mound', at: [2.3, 26.6], radius: 0.7, height: -0.12 },
    // the cliff drops away into the sea on the right and beyond the green
    { kind: 'rampX', x0: 5.2, x1: 9, h0: 0, h1: -2.6 },
    { kind: 'rampY', y0: 36, y1: 41, h0: 0, h1: -2.4 },
    { kind: 'rampX', x0: -6, x1: -14, h0: 0, h1: 1.2 },
  ],

  bridges: [],
  trees: [
    { kind: 'cypress', at: [-8.5, 4], scale: 1.1 },
    { kind: 'cypress', at: [-10.5, 16], scale: 1.25 },
    { kind: 'cypress', at: [-9, -7], scale: 1.0 },
    { kind: 'cypress', at: [8, -5], scale: 0.95 },
  ],
  scatter: [
    { kind: 'shrub', area: [[-16, -8], [-6, -8], [-7, 30], [-16, 36]], count: 26, seed: 701, scale: [0.5, 0.9], colors: ['#5c7a3a', '#6d8a44', '#4a6a30'] },
    { kind: 'shrub', area: [[5.5, -6], [12, -6], [8, 16], [6, 16]], count: 10, seed: 702, scale: [0.5, 0.8], colors: ['#5c7a3a', '#6d8a44'] },
    { kind: 'cypress', area: [[-30, -20], [-12, -20], [-12, 30], [-30, 30]], count: 10, seed: 703, scale: [0.9, 1.3] },
  ],
  rocks: [
    { at: [8.2, 30], radius: 0.9, height: 0.7, collide: false },
    { at: [9.5, 34.5], radius: 1.1, height: 0.9, collide: false },
    { at: [6.8, 38.5], radius: 0.8, height: 0.6, collide: false },
    { at: [3.4, 41], radius: 0.9, height: 0.6, collide: false },
    { at: [-2.5, 41.6], radius: 0.7, height: 0.5, collide: false },
    { at: [12, 27], radius: 1.4, height: 1.1, collide: false },
    { at: [14, 40], radius: 1.8, height: 1.3, collide: false },
    { at: [5.6, 35.6], radius: 0.45, height: 0.4, collide: false },
  ],
  landmarks: [
    { kind: 'crowd', name: 'gallery by the tee', points: [[-8, -4], [-5.5, -4], [-5.8, 8], [-8, 8]], count: 24, seed: 71 },
    { kind: 'teeMarkers', at: [0, 0.8], color: '#f4f1e8' },
    { kind: 'sign', at: [3.4, -1.6], color: '#0f4c6e' },
  ],

  waterRule: 'previous',
  grass: {
    fairway: '#6fb24a',
    rough: '#4f8a3a',
    green: '#8bcf5c',
    fringe: '#78bd50',
    sand: '#efe2c2',
    water: '#2b7fa6',
    deepWater: '#134d6e',
  },
};
