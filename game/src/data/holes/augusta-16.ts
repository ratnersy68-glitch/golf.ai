import type { HoleLayout } from '../types';
import { roundedRect } from './shapes';

/**
 * AUGUSTA NATIONAL — HOLE 16 "REDBUD"  ·  Par 3 · 170 yards  ·  scale 1:10
 *
 * Preserved:
 *  - The pond runs from in front of the tee all the way down the left side to the green.
 *  - The green sits beyond the water with a pronounced ridge through the middle and a steep
 *    right-to-left tilt that feeds balls toward the pond (and toward the Sunday pin).
 *  - Bunkers: one small bunker front-left between the green and the pond, two on the right side.
 *  - The gallery hillside running up the right side; pines and redbuds framing the green.
 *  - Sunday hole location: back left, just above the water.
 */
const green: [number, number][] = [
  [-5.0, 44.6],
  [-2.4, 42.7],
  [1.2, 42.8],
  [3.6, 44.8],
  [4.3, 48.5],
  [3.3, 52.5],
  [0.5, 55.0],
  [-3.1, 55.3],
  [-5.3, 53.2],
  [-6.0, 49.5],
];

export const augusta16: HoleLayout = {
  id: 'augusta-16',
  courseId: 'augusta',
  number: 16,
  name: 'Redbud',
  par: 3,
  realYards: 170,
  scale: 10,
  description:
    'Sunday roars. A mid-iron over the pond to a green that tilts hard toward the water — the ball rides the slope down to the famous back-left pin.',
  signatureFeatures: [
    'Pond from the tee down the entire left side',
    'Green tilted right-to-left toward the water with a central ridge',
    'Front-left bunker above the pond, two bunkers right',
    'Gallery hillside on the right',
    'Sunday pin back-left',
  ],
  playabilityAdjustments: [
    'Played along the ground: the tee shot rolls down the right-side bank instead of carrying the pond.',
    'Low hedges act as mini-golf rails; stone kerbs where they cross the pond.',
    'Ball and cup are slightly oversized for readability.',
  ],

  bounds: [
    [-7.4, -3.6],
    [5.8, -3.6],
    [12.4, 4.5],
    [12.9, 30],
    [12.2, 45],
    [9.2, 56.2],
    [5.0, 59.8],
    [-2.0, 60.3],
    [-8.6, 58.6],
    [-10.2, 50],
    [-10.4, 30],
    [-10.2, 10],
    [-8.8, 0.5],
  ],
  railStyle: 'hedge',
  sceneryRadius: 75,

  tee: { at: [0, 0], size: [4.4, 3.2] },
  cup: [-3.3, 52.4],
  pinName: 'Sunday — back left',
  altPins: [{ name: 'Front right', at: [1.8, 45.0] }],

  defaultSurface: 'rough',
  surfaces: [
    { type: 'pinestraw', name: 'right hillside', points: [[14, -8], [30, -8], [30, 60], [11, 62], [13.5, 40], [14.5, 10]] },
    { type: 'pinestraw', name: 'behind the green', points: [[-20, 61], [12, 62], [20, 80], [-20, 80]] },
    { type: 'fairway', name: 'right-side bank', points: [[1.4, 2.6], [8, 3.5], [11.6, 12], [11.8, 30], [11.2, 42], [8.6, 52], [5.2, 56.4], [1.0, 42], [1.6, 30], [2.2, 14]] },
    { type: 'fairway', name: 'tee surround', points: [[-5, -2.8], [5, -2.8], [6.8, 2.4], [2.6, 3.2], [-5, 2.2]] },
    { type: 'tee', name: 'tee', points: roundedRect(0, 0, 4.4, 3.2, 0.5), smooth: false },
    { type: 'green', name: 'green', points: green },
    { type: 'bunker', name: 'front-left bunker', points: [[-6.0, 43.7], [-4.3, 41.9], [-2.7, 41.6], [-3.4, 42.9], [-5.0, 44.3]] },
    { type: 'bunker', name: 'right bunker', points: [[4.8, 45.2], [6.1, 46.1], [6.5, 49.2], [5.6, 51.4], [4.7, 50.4], [4.6, 47.6]] },
    { type: 'bunker', name: 'back-right bunker', points: [[2.4, 56.0], [4.4, 54.9], [5.4, 56.1], [4.0, 57.4], [2.2, 57.2]] },
    {
      type: 'water',
      name: 'The pond',
      points: [[-24, 2.2], [-4, 2.4], [0.6, 3.4], [1.4, 8], [1.4, 18], [0.6, 28], [-1.2, 36], [-3.8, 40.4], [-6.6, 44.4], [-7.2, 50], [-7.8, 56], [-9.8, 62], [-24, 62]],
      level: 0.1,
    },
  ],

  elevation: [
    { kind: 'base', height: 0.4 },
    // everything drains from the gallery hillside down to the pond
    { kind: 'rampX', x0: -3, x1: 13, h0: 0, h1: 0.7 },
    { kind: 'rampX', x0: 12, x1: 26, h0: 0, h1: 2.5 },
    { kind: 'plateau', points: roundedRect(0, 0, 5.2, 4, 0.8), height: 1.7, falloff: 1.4 },
    { kind: 'rampY', y0: 56, y1: 66, h0: 0, h1: 2.2 },
    // the green: tilted right-to-left toward the water, with the ridge across the middle
    { kind: 'plateau', points: green, height: 1.0, falloff: 1.8, tilt: [0.055, 0.012], tiltOrigin: [-1, 49] },
    { kind: 'mound', at: [0.2, 48.8], radius: 1.1, height: 0.16, stretch: [3.2, 0.55] },
    { kind: 'undulate', points: green, amplitude: 0.03, wavelength: 3, seed: 16 },
    { kind: 'mound', at: [5.5, 48.2], radius: 1.0, height: -0.14, stretch: [0.8, 2.4] },
    { kind: 'mound', at: [-4.2, 43], radius: 0.8, height: -0.12, stretch: [1.6, 0.8] },
    // pond bed
    { kind: 'mound', at: [-8, 20], radius: 9, height: -1.2, stretch: [1, 2.2] },
    { kind: 'mound', at: [-10, 48], radius: 6, height: -0.9, stretch: [1, 1.4] },
  ],

  bridges: [],
  trees: [
    { kind: 'loblolly', at: [-3, 64], scale: 1.4 },
    { kind: 'loblolly', at: [6, 65], scale: 1.5 },
    { kind: 'loblolly', at: [13, 58], scale: 1.3 },
    { kind: 'redbud', at: [9.6, 60], scale: 0.9 },
    { kind: 'redbud', at: [-7.5, 62.5], scale: 0.85 },
    { kind: 'redbud', at: [15, 20], scale: 0.9 },
    { kind: 'dogwood', at: [14.5, 34], scale: 0.85 },
    { kind: 'loblolly', at: [-11, -6], scale: 1.2 },
  ],
  scatter: [
    { kind: 'loblolly', area: [[-26, 62], [26, 62], [26, 80], [-26, 80]], count: 34, seed: 1601, scale: [1.1, 1.6] },
    { kind: 'loblolly', area: [[16, -8], [30, -8], [30, 60], [16, 60]], count: 26, seed: 1602, scale: [1.0, 1.5] },
    { kind: 'redbud', area: [[12, 50], [22, 50], [22, 62], [12, 62]], count: 5, seed: 1603, scale: [0.7, 0.95] },
    { kind: 'azalea', area: [[-9, 60.5], [9, 61], [12, 64], [-9, 64]], count: 22, seed: 1604, scale: [0.6, 1], colors: ['#e2457a', '#ffffff', '#f06aa0'] },
    { kind: 'loblolly', area: [[-30, -12], [-9, -10], [-10, 0], [-30, 0]], count: 10, seed: 1605, scale: [1, 1.4] },
    { kind: 'shrub', area: [[14, -8], [30, -8], [30, 60], [14, 60]], count: 24, seed: 1606, scale: [0.6, 1.1], colors: ['#3b6a2d', '#4c7a34'] },
  ],
  rocks: [],
  landmarks: [
    { kind: 'crowd', name: 'gallery on the right hillside', points: [[14, 2], [19, 2], [19.5, 48], [13.5, 48]], count: 110, seed: 16 },
    { kind: 'crowd', name: 'behind the tee', points: [[-7, -5], [7, -5], [8, -9], [-8, -9]], count: 40, seed: 17 },
    { kind: 'crowd', name: 'across the pond', points: [[-24, 10], [-15, 10], [-15, 40], [-24, 40]], count: 60, seed: 18 },
    { kind: 'ropeLine', points: [[13.2, 0], [13.6, 20], [13.4, 40], [12, 50]] },
    { kind: 'teeMarkers', at: [0, 0.9], color: '#1b5e3b' },
    { kind: 'sign', at: [4.4, -1.8], color: '#1b5e3b' },
  ],

  waterRule: 'previous',
  grass: {
    fairway: '#66b845',
    rough: '#3f8a36',
    green: '#86d05a',
    fringe: '#70bf4c',
    sand: '#f7f3e8',
    water: '#2f7c7d',
    deepWater: '#15474d',
  },
};
