import type { HoleLayout } from '../types';
import { ellipse, grow, roundedRect } from './shapes';

/**
 * AUGUSTA NATIONAL — HOLE 12 "GOLDEN BELL"  ·  Par 3 · 155 yards
 *
 * Scale 1 : 10  (one mini foot = ten real feet).  155 yd = 465 ft  ->  ~46.5 mini ft to the Sunday pin.
 *
 * What is preserved (from the tee, looking north-east toward Amen Corner):
 *  - Tee shot plays across the low ground to Rae's Creek, which runs across the front of the green.
 *  - The green is shallow (~12-14 yd deep) and set on a diagonal: the left end is closer to the tee,
 *    the right end is farther away and shallowest.
 *  - One bunker front-centre between the creek and the green; two bunkers behind the green on the bank.
 *  - The bank in front of the green feeds short balls back into the creek.
 *  - The Hogan Bridge (stone) crosses the creek to the left end of the green.
 *  - Behind the green a steep bank of azaleas, dogwoods and tall loblolly pines.
 *  - To the left, the 11th green and its pond; the big leaderboard at Amen Corner.
 *  - Sunday hole location: back right, over the front bunker.
 */
const green = [
  [-6.8, 43.3],
  [-4.5, 42.4],
  [-1.5, 42.2],
  [1.5, 42.8],
  [4.5, 44.0],
  [7.2, 45.2],
  [8.3, 46.4],
  [7.6, 47.6],
  [5.2, 47.9],
  [2.5, 47.4],
  [-0.5, 46.9],
  [-3.5, 46.6],
  [-6.0, 45.9],
  [-7.3, 44.6],
] as [number, number][];

const creek: [number, number][] = [
  [-30, 33.6],
  [-20, 35.2],
  [-12, 36.3],
  [-7, 37.0],
  [-2, 37.8],
  [3, 38.7],
  [8, 39.8],
  [13, 40.8],
  [22, 41.6],
  [32, 41.0],
];

export const augusta12: HoleLayout = {
  id: 'augusta-12',
  courseId: 'augusta',
  number: 12,
  name: 'Golden Bell',
  par: 3,
  realYards: 155,
  scale: 10,
  description:
    "The most famous par 3 in golf. A short iron over Rae's Creek to a shallow, diagonal green at the heart of Amen Corner — with the wind swirling in the pines.",
  signatureFeatures: [
    "Rae's Creek across the front of the green",
    'Hogan Bridge to the left end of the green',
    'Shallow diagonal green, deepest on the left',
    'Front bunker plus two bunkers on the back bank',
    'Azalea bank and loblolly pines behind the green',
    'Sunday pin back-right over the bunker',
  ],
  playabilityAdjustments: [
    'Played as a ground game: the creek can only be crossed on the Hogan Bridge.',
    'Hogan Bridge widened about 2x so a putt can travel across it.',
    'Low boxwood hedges act as mini-golf rails around the playing area.',
    'Ball and cup are slightly oversized for readability.',
  ],

  bounds: [
    [-5.5, -3.2],
    [5.5, -3.2],
    [7.4, 8],
    [10.4, 22],
    [12.0, 34],
    [12.6, 43],
    [11.6, 50.2],
    [7.4, 52.4],
    [0, 51.9],
    [-7, 51.2],
    [-11.4, 48.6],
    [-12.8, 42],
    [-12.4, 33.5],
    [-9.4, 20],
    [-7.2, 8],
  ],
  railStyle: 'hedge',
  sceneryRadius: 75,

  tee: { at: [0, 0], size: [4.6, 3.2] },
  cup: [5.1, 46.4],
  pinName: 'Sunday — back right',
  altPins: [
    { name: 'Thursday — front left', at: [-4.6, 44.1] },
    { name: 'Middle', at: [0.4, 44.9] },
  ],

  defaultSurface: 'rough',
  surfaces: [
    // scenery beds outside the rails (visual only)
    { type: 'pinestraw', name: 'left pines', points: [[-30, -12], [-9, -12], [-9.8, 8], [-12.5, 22], [-15, 31], [-30, 30]] },
    { type: 'pinestraw', name: 'right pines', points: [[8, -12], [30, -12], [30, 36], [14.5, 33], [12.5, 20], [9.5, 6]] },
    { type: 'pinestraw', name: 'azalea bank', points: [[-18, 51.5], [-8, 53.5], [0, 54.5], [9, 54], [18, 50], [30, 50], [30, 80], [-30, 80], [-30, 50]] },
    // tee-side short grass sweeping down to the creek
    {
      type: 'fairway',
      name: 'approach',
      points: [[-5.0, 2.4], [5.0, 2.4], [8.0, 18], [10.8, 33.5], [6, 37.6], [0, 36.6], [-6, 35.6], [-11.2, 34.2], [-8.6, 18]],
    },
    // far bank between creek and green, wrapping the green complex
    {
      type: 'fairway',
      name: 'green surrounds',
      points: [[-12.2, 40.6], [-6.5, 39.6], [0, 40.4], [6, 41.6], [11.8, 43.2], [12.0, 46.8], [10.2, 49.2], [5, 50.4], [-2, 49.6], [-8.4, 48.8], [-12.2, 46]],
    },
    { type: 'tee', name: 'tee', points: roundedRect(0, 0, 4.6, 3.2, 0.5), smooth: false },
    { type: 'green', name: 'green', points: green },
    {
      type: 'bunker',
      name: 'front bunker',
      points: [[-2.6, 41.2], [-1.3, 40.6], [0.9, 40.5], [3.0, 40.9], [3.5, 41.7], [2.0, 42.3], [-0.4, 42.1], [-2.2, 41.95]],
    },
    {
      type: 'bunker',
      name: 'back-left bunker',
      points: [[-5.4, 47.3], [-3.0, 47.25], [-1.1, 47.8], [-1.5, 48.7], [-3.6, 49.0], [-5.5, 48.4]],
    },
    {
      type: 'bunker',
      name: 'back-right bunker',
      points: [[4.4, 48.55], [6.4, 48.35], [8.0, 47.95], [8.5, 48.8], [6.9, 49.6], [4.7, 49.5]],
    },
    { type: 'water', name: "Rae's Creek", path: creek, width: 2.3, level: 0.06 },
    { type: 'water', name: '11th green pond', points: ellipse(-24, 31.5, 5.5, 3.2, 12), level: 0.06 },
  ],

  elevation: [
    { kind: 'base', height: 0.7 },
    // the tee sits up; the ground falls away to the creek
    { kind: 'rampY', y0: 2, y1: 34, h0: 0.7, h1: -0.05 },
    // steep azalea bank rising behind the green
    { kind: 'rampY', y0: 48.5, y1: 58, h0: 0, h1: 3.2 },
    // hillsides framing the tee
    { kind: 'rampX', x0: -9, x1: -20, h0: 0, h1: 1.6 },
    { kind: 'rampX', x0: 10, x1: 22, h0: 0, h1: 1.3 },
    { kind: 'plateau', points: roundedRect(0, 0, 5.6, 4.2, 0.8), height: 1.55, falloff: 1.4 },
    // the green complex: raised above the creek, tilted toward the front (toward the water)
    { kind: 'plateau', points: grow(green, 0.5), height: 1.02, falloff: 2.0, tilt: [-0.004, 0.034], tiltOrigin: [0.5, 45] },
    { kind: 'undulate', points: green, amplitude: 0.045, wavelength: 3.2, seed: 12 },
    // bunkers are set down a touch
    { kind: 'mound', at: [0.4, 41.3], radius: 1.3, height: -0.14, stretch: [2.2, 0.7] },
    { kind: 'mound', at: [-3.3, 48.1], radius: 1.0, height: -0.12, stretch: [2.0, 0.8] },
    { kind: 'mound', at: [6.4, 48.9], radius: 1.0, height: -0.12, stretch: [2.0, 0.8] },
    // Rae's Creek: carved bed with banks
    { kind: 'channel', path: creek, width: 4.6, depth: 0, bedLevel: -0.5 },
    { kind: 'mound', at: [-24, 31.5], radius: 5, height: -0.8, stretch: [1.1, 0.7] },
  ],

  bridges: [{ name: 'Hogan Bridge', from: [-10.4, 33.8], to: [-8.3, 40.3], width: 1.45, archHeight: 0.38, style: 'stone', rails: true }],

  trees: [
    { kind: 'loblolly', at: [-4, 57], scale: 1.35 },
    { kind: 'loblolly', at: [3.5, 58.5], scale: 1.5 },
    { kind: 'loblolly', at: [10, 56], scale: 1.3 },
    { kind: 'loblolly', at: [-11, 55.5], scale: 1.25 },
    { kind: 'dogwood', at: [-7.5, 53.6], scale: 0.8 },
    { kind: 'dogwood', at: [5.5, 54.8], scale: 0.85 },
    { kind: 'dogwood', at: [13.8, 49], scale: 0.8 },
    { kind: 'loblolly', at: [-12.5, -1], scale: 1.2 },
    { kind: 'loblolly', at: [12, 2], scale: 1.25 },
    { kind: 'magnolia', at: [-15, 14], scale: 0.9 },
  ],
  scatter: [
    { kind: 'azalea', area: [[-13, 51.8], [-6, 53], [2, 53.6], [9, 53.4], [13.5, 50.2], [15, 53.5], [8, 56.5], [-2, 56.8], [-13, 55]], count: 48, seed: 1204, scale: [0.6, 1.1], colors: ['#e2457a', '#f06aa0', '#c9215d', '#ffffff', '#ff8aa8'] },
    { kind: 'loblolly', area: [[-26, 55], [26, 55], [26, 78], [-26, 78]], count: 40, seed: 1205, scale: [1.1, 1.6] },
    { kind: 'loblolly', area: [[-28, -10], [-10.5, -10], [-11.5, 10], [-14, 24], [-28, 26]], count: 34, seed: 1206, scale: [1.0, 1.5] },
    { kind: 'loblolly', area: [[10, -10], [28, -10], [28, 36], [14.5, 32], [12.5, 18], [10, 7]], count: 36, seed: 1207, scale: [1.0, 1.5] },
    { kind: 'azalea', area: [[-12, -8], [-8, -8], [-8.5, 6], [-11, 8]], count: 10, seed: 1208, scale: [0.5, 0.8], colors: ['#e2457a', '#ffffff', '#f06aa0'] },
    { kind: 'azalea', area: [[9, 6], [11.5, 5], [13, 18], [11, 18]], count: 8, seed: 1209, scale: [0.5, 0.8], colors: ['#e2457a', '#c9215d', '#ffffff'] },
    { kind: 'shrub', area: [[-30, 40], [-15, 42], [-15, 50], [-30, 50]], count: 12, seed: 1210, scale: [0.6, 1] },
    { kind: 'shrub', area: [[-28, -10], [-10, -10], [-11.5, 10], [-14, 24], [-28, 26]], count: 26, seed: 1211, scale: [0.6, 1.2], colors: ['#3b6a2d', '#4c7a34', '#2f5a28'] },
    { kind: 'shrub', area: [[10, -10], [28, -10], [28, 36], [14.5, 32], [12.5, 18], [10, 7]], count: 26, seed: 1212, scale: [0.6, 1.2], colors: ['#3b6a2d', '#4c7a34', '#2f5a28'] },
    { kind: 'dogwood', area: [[-28, -10], [-10, -10], [-12, 20], [-28, 26]], count: 5, seed: 1213, scale: [0.7, 0.9] },
    { kind: 'dogwood', area: [[11, -10], [28, -10], [28, 30], [13, 28]], count: 5, seed: 1214, scale: [0.7, 0.9] },
    { kind: 'loblolly', area: [[14, 36], [30, 36], [30, 55], [14, 52]], count: 10, seed: 1215, scale: [1.1, 1.5] },
    { kind: 'loblolly', area: [[-30, 30], [-14, 32], [-14, 55], [-30, 55]], count: 10, seed: 1216, scale: [1.1, 1.5] },
  ],
  rocks: [
    { at: [-12.8, 36.9], radius: 0.35, height: 0.3, collide: false },
    { at: [12.9, 41.1], radius: 0.3, height: 0.25, collide: false },
  ],
  landmarks: [
    { kind: 'scoreboard', name: 'Amen Corner leaderboard', at: [-21, 17], rotation: 55, size: [9, 3.2], text: 'AMEN CORNER' },
    { kind: 'distantGreen', name: '11th green', points: ellipse(-21, 25, 4.4, 2.6, 18), color: '#7cc653' },
    { kind: 'distantGreen', name: '13th tee', points: roundedRect(-15.5, 55, 4, 2.4, 0.4, -20), color: '#6aae45' },
    { kind: 'teeMarkers', at: [0, 0.9], color: '#1b5e3b' },
    { kind: 'ropeLine', points: [[-8, -5.2], [-3, -6.2], [3, -6.2], [8, -5.2]] },
    { kind: 'crowd', name: 'patrons behind the tee', points: [[-9, -6.5], [9, -6.5], [10, -10.5], [-10, -10.5]], count: 70, seed: 7 },
    { kind: 'crowd', name: 'patrons by the leaderboard', points: [[-19, 8], [-15, 8], [-16, 22], [-21, 24]], count: 32, seed: 8 },
    { kind: 'sign', at: [4.2, -1.9], text: '12', color: '#1b5e3b' },
  ],

  waterRule: 'previous',
  grass: {
    fairway: '#66b845',
    rough: '#3f8a36',
    green: '#86d05a',
    fringe: '#70bf4c',
    sand: '#f7f3e8',
    water: '#2e7a78',
    deepWater: '#174a4e',
  },
};
