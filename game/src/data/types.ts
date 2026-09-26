/**
 * Data schema for real courses, real holes and golfers.
 *
 * Coordinate convention for hole layouts (all values in MINI feet):
 *   x = lateral offset, positive to the right when standing on the tee looking at the green
 *   y = distance down-range from the tee, positive toward the green
 * Heights are in mini feet above an arbitrary datum (water surfaces usually sit near 0).
 *
 * Adding a new real hole = adding a HoleLayout data file. No gameplay code changes.
 */

export type Vec2 = [number, number];

export type SurfaceType =
  | 'green'
  | 'fringe'
  | 'fairway'
  | 'rough'
  | 'deepRough'
  | 'bunker'
  | 'water'
  | 'tee'
  | 'path'
  | 'pinestraw'
  | 'rock'
  | 'bridge';

export type Tier = 'classic' | 'major' | 'legendary' | 'elite';

/** Audio/visual atmosphere profile for a course. */
export interface Atmosphere {
  /** ambient sound layers and their relative levels (0..1) */
  birds: number;
  crowd: number;
  wind: number;
  water: number;
  ocean: number;
  /** sky + light mood */
  sky: { top: string; horizon: string; sun: string; sunIntensity: number; sunElevation: number; sunAzimuth: number };
  fog: string;
}

export interface HoleSummary {
  number: number;
  name?: string;
  par: number;
  /** championship yardage (approximate, see course.yardageNote) */
  yards: number;
  /** id of the built HoleLayout if this hole has been recreated, else undefined */
  layoutId?: string;
}

export interface CourseData {
  id: string;
  name: string;
  shortName: string;
  location: string;
  country: string;
  established: number;
  designers: string;
  tier: Tier;
  /** 1..5 */
  difficulty: number;
  par: number;
  holes: HoleSummary[];
  /** the hole used for previews / the free "signature hole" */
  signatureHole: number;
  /** colours for cards / UI */
  palette: { primary: string; accent: string; ink: string };
  blurb: string;
  yardageNote: string;
  atmosphere: Atmosphere;
}

/* ---------------- Hole layout ---------------- */

export interface SurfaceArea {
  type: SurfaceType;
  name?: string;
  /** closed polygon control points; smoothed with a closed Catmull-Rom spline unless smooth === false */
  points?: Vec2[];
  /** alternatively: a stream/path defined by a centre line and a width */
  path?: Vec2[];
  width?: number;
  smooth?: boolean;
  /** for water: surface level */
  level?: number;
}

export type ElevationFeature =
  /** constant base height */
  | { kind: 'base'; height: number }
  /** smooth ramp between two heights along the down-range axis (y) */
  | { kind: 'rampY'; y0: number; y1: number; h0: number; h1: number }
  /** smooth ramp along the lateral axis (x) */
  | { kind: 'rampX'; x0: number; x1: number; h0: number; h1: number }
  /** a gaussian mound (negative height = hollow) */
  | { kind: 'mound'; at: Vec2; radius: number; height: number; stretch?: Vec2 }
  /** flatten toward a height inside a polygon, blending over `falloff` feet, with an optional tilt (dh/dx, dh/dy) */
  | { kind: 'plateau'; points: Vec2[]; height: number; falloff: number; tilt?: Vec2; tiltOrigin?: Vec2 }
  /** carve a channel along a polyline (streams, swales) */
  | { kind: 'channel'; path: Vec2[]; width: number; depth: number; bedLevel?: number }
  /** adds a subtle undulation to a polygon area (green contours) */
  | { kind: 'undulate'; points: Vec2[]; amplitude: number; wavelength: number; seed: number };

export type TreeKind = 'pine' | 'loblolly' | 'dogwood' | 'azalea' | 'magnolia' | 'oak' | 'cypress' | 'palm' | 'shrub' | 'gorse' | 'redbud';

export interface TreePlacement {
  kind: TreeKind;
  at: Vec2;
  scale?: number;
  /** only for colliding trees inside the rails */
  collide?: boolean;
  color?: string;
}

export interface TreeScatter {
  kind: TreeKind;
  /** polygon in which to scatter */
  area: Vec2[];
  count: number;
  seed: number;
  scale?: [number, number];
  colors?: string[];
}

export interface BridgeData {
  name: string;
  from: Vec2;
  to: Vec2;
  width: number;
  archHeight: number;
  style: 'stone' | 'timber';
  /** walls along both long sides (the ball can't fall off) */
  rails: boolean;
}

export interface RockData {
  at: Vec2;
  radius: number;
  height?: number;
  collide?: boolean;
}

export interface LandmarkData {
  kind:
    | 'scoreboard'
    | 'grandstand'
    | 'clubhouse'
    | 'crowd'
    | 'teeMarkers'
    | 'ropeLine'
    | 'lighthouse'
    | 'cliff'
    | 'ocean'
    | 'distantGreen'
    | 'bulkhead'
    | 'bench'
    | 'sign';
  name?: string;
  at?: Vec2;
  rotation?: number;
  size?: Vec2;
  points?: Vec2[];
  count?: number;
  seed?: number;
  text?: string;
  color?: string;
}

export interface HoleLayout {
  id: string;
  courseId: string;
  number: number;
  name: string;
  par: number;
  realYards: number;
  /** real feet represented by one mini foot */
  scale: number;
  /** direction from which you see the hole on the tee, for flavour text */
  description: string;
  /** notable real features the recreation preserves */
  signatureFeatures: string[];
  /** every deviation from the real hole made for playability, stated honestly */
  playabilityAdjustments: string[];

  /** playable boundary (mini-golf rails). Not smoothed. */
  bounds: Vec2[];
  railStyle: 'hedge' | 'timber' | 'stone' | 'rope';
  /** areas of the playfield beyond which scenery is rendered */
  sceneryRadius: number;

  tee: { at: Vec2; size: Vec2; height?: number };
  /** the cup (Sunday hole location unless stated) */
  cup: Vec2;
  pinName: string;
  /** optional alternative hole locations */
  altPins?: { name: string; at: Vec2 }[];

  /** default surface inside the rails when nothing else matches */
  defaultSurface: SurfaceType;
  /** drawn / queried in order; later entries win */
  surfaces: SurfaceArea[];
  elevation: ElevationFeature[];
  bridges: BridgeData[];
  trees: TreePlacement[];
  scatter: TreeScatter[];
  rocks: RockData[];
  landmarks: LandmarkData[];

  /** after a water ball, where is the ball replayed from */
  waterRule: 'previous' | 'dropZone';
  dropZone?: Vec2;

  /** grass colour grading for the course's look */
  grass: { fairway: string; rough: string; green: string; fringe: string; sand: string; water: string; deepWater: string };
}

/* ---------------- Golfers ---------------- */

export interface GolferStats {
  power: number;
  accuracy: number;
  control: number;
  spin: number;
  putting: number;
}

export type HairStyle = 'short' | 'curly' | 'wavy' | 'buzz' | 'long' | 'slick' | 'bald';
export type HatStyle = 'none' | 'cap' | 'capBack' | 'visor' | 'flatcap' | 'bucket';

export interface Appearance {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  facialHair: 'none' | 'stubble' | 'beard' | 'moustache';
  facialHairColor?: string;
  eyes: string;
  hat: HatStyle;
  hatColor: string;
  hatLogo?: string;
  shirt: string;
  shirtAccent: string;
  shirtStyle: 'polo' | 'mock' | 'quarterzip' | 'sweater';
  pants: string;
  shoes: string;
  glove: string;
  build: number; // 0.9 slim .. 1.1 broad
  height: number; // relative, 1 = 6ft
  accessory: 'none' | 'glasses' | 'sunglasses' | 'watch' | 'necklace';
  bag: string;
  putter: 'blade' | 'mallet' | 'armlock';
}

export type AbilityKind =
  | 'steadyPower' // reduces power variance
  | 'extraPower' // small max-power bonus
  | 'longRead' // longer trajectory preview
  | 'clutch' // larger capture window on final hole of a round
  | 'railMaster' // rail bounces keep more speed
  | 'sandEscape' // less friction in bunkers
  | 'pureStrike' // lower aim variance
  | 'roughRider' // less friction in rough
  | 'lagMaster'; // larger capture window on long putts

export interface Ability {
  id: string;
  name: string;
  description: string;
  kind: AbilityKind;
  magnitude: number;
}

export interface GolferData {
  id: string;
  name: string;
  shortName: string;
  nationality: string;
  flag: string;
  stats: GolferStats;
  ability?: Ability;
  appearance: Appearance;
  celebration: 'fistPump' | 'armsUp' | 'capTip' | 'point' | 'uppercut' | 'bow';
  /** coins needed to sign this golfer; 0 = available from the start */
  unlockCost: number;
  bio: string;
  isCustom?: boolean;
}

/* ---------------- Tournaments ---------------- */

export interface TournamentData {
  id: string;
  name: string;
  subtitle: string;
  courseIds: string[];
  /** ordered hole layout ids */
  holes: string[];
  /** holes in the full real event, to show how much has been built */
  plannedHoles: number;
  entryTier: Tier;
  reward: number;
  palette: { primary: string; accent: string };
}
