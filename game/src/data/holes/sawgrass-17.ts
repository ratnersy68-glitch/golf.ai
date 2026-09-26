import type { HoleLayout } from '../types';
import { roundedRect } from './shapes';

/**
 * TPC SAWGRASS (STADIUM) — HOLE 17  ·  Par 3 · 137 yards  ·  scale 1:10
 *
 * Preserved:
 *  - Pete Dye's island green: water on every side, held by a railroad-tie bulkhead.
 *  - The single narrow walkway that connects the island to land.
 *  - The small pot bunker front-right on the island.
 *  - The spectator mounds of the "stadium" wrapping the lake.
 *  - Sunday hole location front-right, just over the pot bunker.
 */
const island: [number, number][] = [
  [-4.8, 38.0],
  [-2.5, 35.9],
  [1.5, 35.6],
  [4.6, 37.2],
  [5.6, 40.5],
  [5.0, 44.0],
  [2.4, 46.3],
  [-1.5, 46.6],
  [-4.6, 44.8],
  [-5.6, 41.2],
];
const green: [number, number][] = [
  [-4.0, 38.4],
  [-2.2, 36.7],
  [1.0, 36.6],
  [3.2, 38.4],
  [4.6, 40.8],
  [4.2, 43.6],
  [2.0, 45.5],
  [-1.4, 45.8],
  [-4.0, 44.2],
  [-4.8, 41.2],
];

export const sawgrass17: HoleLayout = {
  id: 'sawgrass-17',
  courseId: 'sawgrass',
  number: 17,
  name: 'Island Green',
  par: 3,
  realYards: 137,
  scale: 10,
  description: 'Nothing but a wedge — to the most terrifying target in golf. Miss the island and you are wet.',
  signatureFeatures: [
    'Island green surrounded by water',
    'Railroad-tie bulkhead around the island',
    'Single walkway connecting the island',
    'Pot bunker front-right',
    'Stadium spectator mounds',
  ],
  playabilityAdjustments: [
    'Played along the ground: the route runs around the lake up the right-hand bank and in over the walkway.',
    'Walkway widened for a rolling ball; its position is approximate.',
    'Low timber rails bound the lake; the island itself has no rails.',
    'Ball and cup are slightly oversized for readability.',
  ],

  bounds: [
    [-6.2, -3.4],
    [15.0, -3.4],
    [15.2, 30],
    [14.6, 50],
    [10.4, 53.6],
    [0, 53.2],
    [-9.4, 50.2],
    [-10.6, 40],
    [-9.8, 20],
    [-8.2, 4],
  ],
  railStyle: 'timber',
  sceneryRadius: 80,

  tee: { at: [0, 0], size: [4.2, 3.0] },
  cup: [2.2, 38.8],
  pinName: 'Sunday — front right',
  altPins: [{ name: 'Back left', at: [-2.2, 44] }],

  defaultSurface: 'rough',
  surfaces: [
    { type: 'water', name: 'The lake', points: [[-40, 3.4], [3.0, 3.4], [5.2, 5.0], [6.3, 12], [7.4, 28], [8.4, 40], [8.6, 44.4], [7.6, 46.4], [9.4, 49], [8.6, 58], [-40, 58]], smooth: false, level: 0.12 },
    { type: 'fairway', name: 'tee surround', points: [[-6, -3.2], [15, -3.2], [15, 3.2], [4.6, 3.2], [-6, 3.2]] },
    { type: 'fairway', name: 'right-hand bank', points: [[3.6, 3.0], [15, 3.0], [15, 30], [14.4, 49.6], [10.6, 52.8], [9.2, 49.6], [8.9, 46], [9.0, 40], [8.0, 28], [6.9, 12], [5.8, 5.4]] },
    { type: 'tee', name: 'tee', points: roundedRect(0, 0, 4.2, 3.0, 0.5), smooth: false },
    { type: 'fringe', name: 'island', points: island },
    { type: 'green', name: 'green', points: green },
    { type: 'path', name: 'walkway', path: [[4.4, 43.4], [7.0, 45.4], [10.4, 47.2]], width: 2.0 },
    { type: 'bunker', name: 'pot bunker', points: [[2.8, 36.3], [4.0, 36.9], [4.2, 37.9], [3.4, 38.1], [2.6, 37.3]] },
  ],

  elevation: [
    { kind: 'base', height: -0.6 },
    { kind: 'plateau', points: [[-8, -3.6], [15.4, -3.6], [15.4, 3.2], [-8, 2.9]], height: 0.72, falloff: 0.5 },
    { kind: 'plateau', points: roundedRect(0, 0, 5, 3.8, 0.6), height: 1.05, falloff: 1 },
    { kind: 'plateau', points: [[3.6, 3.0], [15.4, 3.0], [15.4, 50], [11, 53.6], [9.4, 49], [9.2, 40], [8.2, 28], [7.1, 12], [6, 5.4]], height: 0.62, falloff: 0.5, tilt: [-0.028, 0], tiltOrigin: [11, 25] },
    // spectator mounds beyond the right bank
    { kind: 'rampX', x0: 14.5, x1: 24, h0: 0, h1: 3.2 },
    { kind: 'rampY', y0: 52, y1: 62, h0: 0, h1: 2.6 },
    { kind: 'plateau', points: island, height: 0.6, falloff: 0.35, tilt: [-0.012, 0.018], tiltOrigin: [0, 41] },
    { kind: 'undulate', points: green, amplitude: 0.03, wavelength: 2.5, seed: 17 },
    { kind: 'mound', at: [3.4, 37.3], radius: 0.6, height: -0.15 },
    { kind: 'plateau', points: [[4.0, 42.4], [7.4, 44.4], [10.2, 46.2], [10.4, 48.2], [6.6, 46.4], [3.8, 44.4]], height: 0.6, falloff: 0.3 },
  ],

  bridges: [],
  trees: [
    { kind: 'palm', at: [16.5, 8], scale: 1.1 },
    { kind: 'palm', at: [17.5, 26], scale: 1.2 },
    { kind: 'palm', at: [16, 44], scale: 1.0 },
    { kind: 'palm', at: [-10, -6], scale: 1.1 },
    { kind: 'oak', at: [-14, 62], scale: 1.3 },
    { kind: 'oak', at: [6, 64], scale: 1.4 },
  ],
  scatter: [
    { kind: 'palm', area: [[-30, 60], [30, 60], [30, 80], [-30, 80]], count: 14, seed: 1701, scale: [0.9, 1.3] },
    { kind: 'oak', area: [[-30, 62], [30, 62], [30, 80], [-30, 80]], count: 12, seed: 1702, scale: [1.1, 1.5] },
    { kind: 'shrub', area: [[15.5, 0], [22, 0], [22, 50], [15.5, 50]], count: 18, seed: 1703, scale: [0.5, 0.9] },
    { kind: 'palm', area: [[-30, -12], [-10, -12], [-10, 2], [-30, 2]], count: 6, seed: 1704, scale: [0.9, 1.2] },
  ],
  rocks: [],
  landmarks: [
    { kind: 'bulkhead', name: 'island bulkhead', points: island },
    { kind: 'crowd', name: 'stadium mounds', points: [[16, 2], [23, 2], [23, 52], [16, 52]], count: 150, seed: 171 },
    { kind: 'crowd', name: 'behind the green', points: [[-8, 56], [12, 56], [12, 61], [-8, 61]], count: 70, seed: 172 },
    { kind: 'crowd', name: 'behind the tee', points: [[-7, -5], [7, -5], [8, -9], [-8, -9]], count: 40, seed: 173 },
    { kind: 'grandstand', name: 'hospitality', at: [-16, 30], rotation: 90, size: [16, 4], color: '#0b3d5c' },
    { kind: 'teeMarkers', at: [0, 0.9], color: '#0b3d5c' },
    { kind: 'sign', at: [4.0, -1.8], color: '#0b3d5c' },
  ],

  waterRule: 'previous',
  grass: {
    fairway: '#5fb24a',
    rough: '#3f8e3a',
    green: '#7fd05a',
    fringe: '#6cbd4a',
    sand: '#f4ecd8',
    water: '#2b6f86',
    deepWater: '#123f52',
  },
};
