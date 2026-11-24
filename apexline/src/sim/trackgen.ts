import { PieceDef, ObstacleDef, TrackDef, buildTrack, DS, F_GAP, F_BOOST, F_NOWALL, F_CP, F_TUNNEL, F_BRIDGE, SURF_ASPHALT, SURF_DIRT, SURF_GRASS, SURF_ICE, SURF_SAND, SURF_STEEL } from './track';
import { Rng, clamp, lerp, hashStr } from './dmath';

/**
 * Procedural-with-constraints campaign generator. Every track is permanently seeded:
 * (chapter, index, attempt) -> identical geometry on every machine. Generated candidates must pass
 * geometry validation here and then a completion run by the automated driver (tools/build-campaign.ts).
 */

export interface ChapterCfg {
  id: number; name: string; env: string; tagline: string;
  surf: number; w: [number, number]; len: [number, number]; d: [number, number];
  weights: Record<string, number>;
  maxGap: number; ice: number; obst: number; narrow: number; speed: number; tunnel: number; bridge: number;
  names: string[]; suffix?: string[]; blurb: string;
}

const W = (o: Record<string, number>) => o;

export const CHAPTERS: ChapterCfg[] = [
  {
    id: 1, name: 'Rookie Academy', env: 'academy', tagline: 'Learn the basics, find the line.',
    surf: SURF_ASPHALT, w: [16, 20], len: [500, 1100], d: [0.02, 0.2], maxGap: 14, ice: 0, obst: 0, narrow: 0, speed: 1.35, tunnel: 0, bridge: 0,
    weights: W({ straight: 3, sweeper: 4, chicane: 1.5, hill: 1.5, jump: 1.0, esses: 1.0, bankedTurn: 1 }),
    blurb: 'A training course for steering, braking, racing lines and your first small jumps.',
    names: ['Ignition', 'Cone Alley', 'Gentle Bend', 'Throttle School', 'Brake Point', 'First Chicane', 'Slow In Fast Out', 'Hill Start', 'Little Hop', 'Racing Line', 'Checkpoint Drill', 'Wide Open', 'Left Right Left', 'Cadet Circuit', 'Speed Bump', 'Corner Entry', 'Late Apex', 'Cruise Control', 'Tight Squeeze', 'Rolling Start', 'Double Hop', 'Final Exam', 'Graduation Run', 'Pit Exit', 'Cap and Gown'],
  },
  {
    id: 2, name: 'Coastal Circuit', env: 'coastal', tagline: 'Sun, salt and seaside straights.',
    surf: SURF_ASPHALT, w: [14, 18], len: [800, 1500], d: [0.15, 0.32], maxGap: 22, ice: 0, obst: 0, narrow: 0.02, speed: 1.2, tunnel: 0.06, bridge: 0.15,
    weights: W({ straight: 2.5, sweeper: 4, bankedTurn: 2, hill: 2, jump: 1.5, chicane: 1.2, bridgeRun: 1.5, esses: 1.5, valley: 1 }),
    blurb: 'Ocean views, clifftop sweepers and long bridges as the sun sets over the water.',
    names: ['Cliffside', 'Pier Pressure', 'Lighthouse Run', 'Marina Dash', 'Seagull Sprint', 'Tidewater', 'Driftwood Drive', 'Salt Flats Bend', 'Breakwater', 'Harbor Lights', 'Dune Crest', 'Sunset Boulevard', 'Coral Cut', 'Boardwalk', 'Kelp Hollow', 'Seawall', 'Headland', 'Surf Road', 'Shoreline', 'Bluff Pass', 'Anchor Point', 'Cove Run', 'Low Tide', 'High Tide', 'Horizon'],
  },
  {
    id: 3, name: 'Desert Rush', env: 'desert', tagline: 'Heat haze and horizon-long straights.',
    surf: SURF_ASPHALT, w: [16, 22], len: [1100, 1900], d: [0.25, 0.42], maxGap: 34, ice: 0, obst: 0.05, narrow: 0.03, speed: 0.95, tunnel: 0, bridge: 0.05,
    weights: W({ straight: 4, sweeper: 3, jump: 2.5, bigJump: 1, hill: 2, sandPatch: 1.2, bankedTurn: 1.5, boostStrip: 1, esses: 1, valley: 1.2 }),
    blurb: 'Sandstone canyons and endless desert highway built for high-speed jumps.',
    names: ['Mesa Run', 'Dust Devil', 'Canyon Floor', 'Sidewinder', 'Scorpion Pass', 'Mirage', 'Oasis Dash', 'Red Rock', 'Dry Wash', 'Sandstone', 'Cactus Alley', 'Salt Pan', 'Hoodoo', 'Arroyo', 'Dune Sea', 'Dustbowl', 'Caravan', 'Buttes', 'Heatwave', 'Sunbaked', 'Wadi', 'Badlands', 'Tumbleweed', 'Noon Sun', 'Sirocco'],
  },
  {
    id: 4, name: 'Alpine Assault', env: 'alpine', tagline: 'Thin air, thinner grip.',
    surf: SURF_ASPHALT, w: [13, 17], len: [1000, 1800], d: [0.32, 0.5], maxGap: 24, ice: 0.18, obst: 0, narrow: 0.05, speed: 1.35, tunnel: 0.1, bridge: 0.1,
    weights: W({ straight: 1.8, sweeper: 3, hairpin: 2.2, hill: 3, valley: 2, iceStretch: 2.5, chicane: 1.8, bankedTurn: 1.3, jump: 1, esses: 1.5 }),
    blurb: 'Snow-covered passes with icy patches, hairpins and dramatic elevation changes.',
    names: ['Whiteout', 'Frostbite', 'Glacier Pass', 'Switchback', 'Avalanche Line', 'Ice Bridge', 'Summit Push', 'Snowline', 'Crevasse', 'Powder Run', 'Chairlift', 'Black Diamond', 'Hairpin Hollow', 'Pine Ridge', 'Cold Front', 'Icicle', 'Ridgeline', 'Drift', 'Permafrost', 'Lodge Road', 'Tundra', 'Cornice', 'Alpenglow', 'Col du Nord', 'Blizzard'],
  },
  {
    id: 5, name: 'Neon District', env: 'neon', tagline: 'The city never lifts.',
    surf: SURF_ASPHALT, w: [14, 18], len: [1000, 1800], d: [0.4, 0.56], maxGap: 30, ice: 0, obst: 0.15, narrow: 0.06, speed: 1.1, tunnel: 0.3, bridge: 0.2,
    weights: W({ straight: 2, sweeper: 2.5, chicane: 2.5, tunnel: 2, bridgeRun: 1.5, jump: 2, loop: 0.8, bankedTurn: 2, esses: 2, hill: 1.5, boostStrip: 1 }),
    blurb: 'Night streets, tunnels and rooftop gaps between glowing skyscrapers.',
    names: ['Night Shift', 'Skyline', 'Rooftop Rush', 'Neon Alley', 'Subway Sprint', 'Glass Canyon', 'Midnight Grid', 'Overpass', 'Downtown Drop', 'Chrome Avenue', 'Signal Fire', 'Tower Run', 'Backstreet', 'Parking Deck', 'Rain Slick', 'Metro Line', 'Billboard', 'Static', 'Afterhours', 'Crosswalk', 'Transit', 'Laser Mile', 'Pulse', 'Harbor Bridge', 'Blackout'],
  },
  {
    id: 6, name: 'Industrial Overdrive', env: 'industrial', tagline: 'Steel, sparks and tight tolerances.',
    surf: SURF_ASPHALT, w: [12, 16], len: [1100, 1900], d: [0.45, 0.62], maxGap: 30, ice: 0, obst: 0.4, narrow: 0.1, speed: 1.2,  tunnel: 0.25, bridge: 0.15,
    weights: W({ straight: 1.8, sweeper: 2, chicane: 2.5, jump: 2.2, loop: 1.2, slalom: 1.5, narrow: 1.5, bankedTurn: 1.5, hill: 1.5, boostStrip: 1.5, hairpin: 1.2 }),
    blurb: 'Warehouses, shipping yards and factories packed with technical obstacles.',
    names: ['Forge', 'Container Yard', 'Smokestack', 'Assembly', 'Dockside', 'Rivet', 'Conveyor', 'Foundry', 'Crane Walk', 'Slag Heap', 'Gantry', 'Boiler Room', 'Pipe Dream', 'Warehouse 9', 'Steelworks', 'Loading Bay', 'Turbine', 'Scrapyard', 'Welding Line', 'Hydraulic', 'Ironworks', 'Blast Furnace', 'Cargo Hook', 'Girder', 'Overdrive'],
  },
  {
    id: 7, name: 'Forest Velocity', env: 'forest', tagline: 'Loose surfaces, living walls.',
    surf: SURF_DIRT, w: [13, 17], len: [1100, 1900], d: [0.5, 0.66], maxGap: 26, ice: 0, obst: 0, narrow: 0.1, speed: 1.4, tunnel: 0.05, bridge: 0.3,
    weights: W({ straight: 1.5, sweeper: 3.5, esses: 3, hill: 3, valley: 2, bridgeRun: 2, jump: 1.8, hairpin: 1.6, chicane: 1.5, grassPatch: 1.3, bankedTurn: 1 }),
    blurb: 'Dense woods, dirt roads and wooden bridges beside tumbling waterfalls.',
    names: ['Pinecone', 'Fern Hollow', 'Timber Trail', 'Mossy Bridge', 'Waterfall Run', 'Hollow Log', 'Deer Crossing', 'Canopy', 'Muddy Boots', 'Lumber Mill', 'Creekside', 'Birch Bend', 'Mushroom Mile', 'Redwood', 'Foxfire', 'Trailhead', 'Bramble', 'Moonlit Glade', 'Stumpjump', 'Woodland Dash', 'Brook', 'Cedar Climb', 'Understory', 'Elk Run', 'Thicket'],
  },
  {
    id: 8, name: 'Skybound', env: 'sky', tagline: 'Gravity is a suggestion.',
    surf: SURF_STEEL, w: [11, 15], len: [1200, 2000], d: [0.55, 0.74], maxGap: 52, ice: 0, obst: 0.1, narrow: 0.15, speed: 1.0, tunnel: 0, bridge: 0,
    weights: W({ straight: 1.5, sweeper: 2, jump: 3.5, bigJump: 2.5, loop: 2.2, cork: 1.6, halfpipe: 1.6, bankedTurn: 2, boostStrip: 1.5, narrow: 1.2, chicane: 1 }),
    blurb: 'Floating platforms with enormous jumps, wall rides, loops and precision landings.',
    names: ['Cloud Nine', 'Skyway', 'Updraft', 'Stratosphere', 'Orbit', 'Zero Gravity', 'Cirrus', 'Sky Ladder', 'Floating Gardens', 'Vertigo', 'Apogee', 'Ascent', 'Windward', 'Contrail', 'Aerie', 'Halo', 'Starlane', 'Meteor', 'Thin Air', 'Eclipse Ring', 'Tailwind', 'Comet', 'Skyhook', 'Free Fall', 'Zenith Gate'],
  },
  {
    id: 9, name: 'Formula Precision', env: 'formula', tagline: 'Every apex is a decision.',
    surf: SURF_ASPHALT, w: [14, 18], len: [1500, 2400], d: [0.62, 0.8], maxGap: 18, ice: 0, obst: 0, narrow: 0, speed: 1.0, tunnel: 0.04, bridge: 0,
    weights: W({ straight: 1.6, sweeper: 3.5, chicane: 4, hairpin: 2.5, esses: 3, slalom: 1.5, bankedTurn: 1.6, hill: 0.6, jump: 0.2 }),
    blurb: 'A pure driving test: braking points, chicanes and apex optimisation on a circuit.',
    names: ['Apex One', 'Chicane Lab', 'Late Braking', 'Hairpin Theory', 'Sector Three', 'Pit Straight', 'Parabolica', 'Trail Brake', 'Clipping Point', 'Tarmac', 'Double Apex', 'Slipstream', 'Kerb Strike', 'Grid Slot', 'Esses', 'Podium', 'Pole Lap', 'Rotation', 'Undercut', 'Overcut', 'Downforce', 'Brake Bias', 'Qualifying', 'Fastest Lap', 'Checkered'],
  },
  {
    id: 10, name: 'Hyperdrive', env: 'hyper', tagline: 'Beyond sensible speeds.',
    surf: SURF_ASPHALT, w: [18, 26], len: [1900, 3000], d: [0.7, 0.88], maxGap: 60, ice: 0, obst: 0.15, narrow: 0.05, speed: 0.75, tunnel: 0.15, bridge: 0.1,
    weights: W({ straight: 2, sweeper: 3, boostStrip: 3.5, bankedTurn: 3, halfpipe: 2, jump: 2.5, bigJump: 2.2, loop: 1.6, esses: 1.2, cork: 1, valley: 1 }),
    blurb: 'Massive boost sections, extreme banking and aerial manoeuvres at terrifying speed.',
    names: ['Redline', 'Afterburn', 'Warp Lane', 'Terminal Velocity', 'Mach One', 'Overclock', 'Ion Storm', 'Light Speed', 'Boost Alley', 'Slingshot', 'Surge', 'Turbo Tunnel', 'Photon', 'Thruster', 'Velocity Wall', 'Nitro Run', 'Hyperloop', 'Blur', 'Flatout', 'Rail Gun', 'Supercharge', 'Singularity Run', 'Kinetic', 'Sonic Boom', 'Event Horizon'],
  },
  {
    id: 11, name: 'The Gauntlet', env: 'gauntlet', tagline: 'Only the exact survive.',
    surf: SURF_ASPHALT, w: [10, 14], len: [2400, 4200], d: [0.82, 1.0], maxGap: 56, ice: 0.1, obst: 0.5, narrow: 0.3, speed: 1.05, tunnel: 0.12, bridge: 0.1,
    weights: W({ straight: 1, sweeper: 2, chicane: 2.5, hairpin: 1.8, jump: 2.5, bigJump: 2, loop: 1.8, cork: 1.2, narrow: 3, slalom: 2, iceStretch: 1, halfpipe: 1, boostStrip: 1.2, bankedTurn: 1.5, esses: 1.5, hill: 1 }),
    blurb: 'Elite tracks: narrow roads, endurance runs and complex stunt combinations.',
    names: ['Trial by Fire', "Razor's Edge", 'Iron Will', 'Knife Ridge', 'No Mercy', 'The Wall', 'Crucible', 'Endurance', 'Hellbent', 'Last Stand', 'Needle Eye', 'Grand Slam', 'Pressure Cooker', 'Meat Grinder', 'Thin Line', 'Marathon', 'Maelstrom', 'Black Flag', "Dead Man's Curve", 'Breaking Point', 'Final Trial', 'Zero Margin', 'Ultimatum', 'Apex Predator', 'The Apexline'],
  },
];

class TG {
  pieces: PieceDef[] = [];
  kinds: string[] = [];
  w: number;
  dist = 0;
  sinceCp = 0;
  heading = 0; // cumulative yaw to avoid spiralling
  hazards = 0;
  loops = 0; jumps = 0; ices = 0;
  d: number;
  constructor(public rng: Rng, public cfg: ChapterCfg, d: number) { this.d = d; this.w = rng.range(cfg.w[0], cfg.w[1]) * (1 - 0.18 * d); }
  add(p: PieceDef, macro?: string): void {
    p.w = p.w ?? this.w;
    if (p.w2 === undefined) p.w2 = p.w;
    this.pieces.push(p);
    const l = Math.max(1, Math.round(p.l / DS)) * DS;
    this.dist += l; this.sinceCp += l;
    this.heading += p.y ?? 0;
    if (macro) this.kinds.push(macro);
  }
  dir(preferBack = true): number {
    if (preferBack && Math.abs(this.heading) > 2.2) return this.heading > 0 ? -1 : 1;
    return this.rng.chance(0.5) ? 1 : -1;
  }
  /** corner radius in metres for this difficulty */
  radius(scale = 1): number {
    const r = this.rng;
    const base = lerp(95, 34, this.d) * this.cfg.speed;
    return Math.max(18, base * r.range(0.65, 1.7) * scale);
  }
  surf(): number { return this.cfg.surf; }
}

type Macro = (g: TG) => void;

const rng1 = (g: TG) => g.rng.range(0.4, 1.2);
const MACROS: Record<string, Macro> = {
  straight(g) {
    g.add({ k: 'straight', l: g.rng.range(50, 90 + 150 * (1 - g.d * 0.4)) * g.cfg.speed, s: g.surf() }, 'straight');
  },
  sweeper(g) {
    const dir = g.dir(), r = g.radius(1.1), a = g.rng.range(0.45, 1.5);
    g.add({ k: 'curve', l: r * a, y: dir * a, s: g.surf() }, 'sweeper');
  },
  bankedTurn(g) {
    const dir = g.dir(), r = g.radius(1.0), a = g.rng.range(0.7, 1.9), b = g.rng.range(0.25, 0.5 + 0.2 * g.d);
    g.add({ k: 'bank', l: r * a, y: dir * a, b, s: g.surf() }, 'bankedTurn');
  },
  chicane(g) {
    const dir = g.dir(), r = g.radius(0.9), a = g.rng.range(0.4, 0.8);
    g.add({ k: 'curve', l: r * a, y: dir * a, s: g.surf() });
    g.add({ k: 'curve', l: r * a * 1.6, y: -dir * a * 1.6, s: g.surf() });
    g.add({ k: 'curve', l: r * a, y: dir * a * 0.6, s: g.surf() }, 'chicane');
  },
  esses(g) {
    const n = g.rng.int(2, 3 + Math.round(g.d * 2));
    let dir = g.dir(); const r = g.radius(0.9), a = g.rng.range(0.35, 0.65);
    for (let i = 0; i < n; i++) { g.add({ k: 'curve', l: r * a, y: dir * a, s: g.surf() }); dir = -dir; }
    g.kinds.push('esses');
  },
  slalom(g) {
    const n = g.rng.int(3, 4 + Math.round(g.d * 3)); let dir = g.dir();
    const r = g.radius(0.6), a = g.rng.range(0.28, 0.5);
    for (let i = 0; i < n; i++) { g.add({ k: 'curve', l: r * a, y: dir * a, s: g.surf() }); dir = -dir; }
    g.kinds.push('slalom'); g.hazards++;
  },
  hairpin(g) {
    const dir = g.dir(false), r = clamp(g.radius(0.55), 20, 55), a = g.rng.range(2.6, 3.1);
    g.add({ k: 'curve', l: r * a, y: dir * a, w: g.w + 3, s: g.surf() }, 'hairpin');
    g.hazards++;
  },
  hill(g) {
    const th = g.rng.range(0.07, 0.15 + 0.05 * g.d), l = g.rng.range(55, 110);
    g.add({ k: 'climb', l, p: th, s: g.surf() });
    g.add({ k: 'drop', l: l * g.rng.range(0.9, 1.15), p: -th, s: g.surf() }, 'hill');
  },
  valley(g) {
    const th = g.rng.range(0.07, 0.14), l = g.rng.range(55, 100);
    g.add({ k: 'drop', l, p: -th, s: g.surf() });
    g.add({ k: 'climb', l: l * g.rng.range(0.9, 1.1), p: th, s: g.surf() }, 'valley');
  },
  jump(g) {
    const th = g.rng.range(0.2, 0.3), gap = Math.min(g.cfg.maxGap, g.rng.range(8, 14) + g.d * 16);
    g.add({ k: 'straight', l: g.rng.range(60, 120), s: g.surf() });
    g.add({ k: 'ramp', l: 12, dp: th, s: g.surf() });
    g.add({ k: 'jump', l: gap, dp: -2 * th, f: F_GAP, s: g.surf() });
    g.add({ k: 'land', l: 16, dp: th, s: g.surf() });
    g.add({ k: 'straight', l: 40, s: g.surf(), f: F_CP });
    g.kinds.push('jump'); g.jumps++; g.sinceCp = 0;
  },
  bigJump(g) {
    const th = g.rng.range(0.28, 0.4), gap = Math.min(g.cfg.maxGap, g.rng.range(24, 36) + g.d * 20);
    g.add({ k: 'straight', l: g.rng.range(120, 200), w: g.w + 3, s: g.surf() });
    g.add({ k: 'ramp', l: 16, dp: th, w: g.w + 3, s: g.surf() });
    g.add({ k: 'jump', l: gap, dp: -2 * th, f: F_GAP, w: g.w + 3, s: g.surf() });
    g.add({ k: 'land', l: 22, dp: th, w: g.w + 3, s: g.surf() });
    g.add({ k: 'straight', l: 60, w: g.w + 3, s: g.surf(), f: F_CP });
    g.kinds.push('bigJump'); g.jumps++; g.sinceCp = 0; g.hazards++;
  },
  loop(g) {
    const r = g.rng.range(14, 20), dir = g.rng.chance(0.5) ? 1 : -1;
    const ww = clamp(g.w, 10, 13);
    g.add({ k: 'straight', l: g.rng.range(110, 150), f: F_BOOST, w: ww, s: g.surf() });
    g.add({ k: 'loop', l: 2 * Math.PI * r, dp: 2 * Math.PI, y: dir * 0.62, w: ww, s: g.surf() });
    g.add({ k: 'straight', l: 40, w: ww, s: g.surf(), f: F_CP });
    g.kinds.push('loop'); g.loops++; g.hazards++; g.sinceCp = 0;
  },
  cork(g) {
    const r = g.rng.range(20, 26), dir = g.rng.chance(0.5) ? 1 : -1;
    const ww = clamp(g.w, 11, 14);
    g.add({ k: 'straight', l: g.rng.range(120, 160), f: F_BOOST, w: ww, s: g.surf() });
    g.add({ k: 'cork', l: 2 * Math.PI * r, dp: 2 * Math.PI, r: dir * rng1(g), y: dir * 0.7, w: ww, s: g.surf() });
    g.add({ k: 'straight', l: 40, w: ww, s: g.surf(), f: F_CP });
    g.kinds.push('cork'); g.loops++; g.hazards++; g.sinceCp = 0;
  },
  halfpipe(g) {
    const dir = g.dir(), r = g.radius(1.4), a = g.rng.range(0.9, 1.7);
    g.add({ k: 'halfpipe', l: r * a, y: dir * a, b: 1.0, w: g.w + 8, s: g.surf() }, 'halfpipe');
  },
  boostStrip(g) {
    g.add({ k: 'straight', l: g.rng.range(90, 160), f: F_BOOST, w: g.w + 2, s: g.surf() }, 'boostStrip');
  },
  narrow(g) {
    const nw = clamp(lerp(7.5, 4.8, g.d), 4.5, 8);
    g.add({ k: 'straight', l: 20, w: g.w, w2: nw, s: g.surf() });
    g.add({ k: 'narrow', l: g.rng.range(70, 140), w: nw, f: F_NOWALL, s: g.surf() });
    if (g.rng.chance(0.5)) g.add({ k: 'narrow', l: g.rng.range(40, 70), y: g.dir() * g.rng.range(0.3, 0.7), w: nw, f: F_NOWALL, s: g.surf() });
    g.add({ k: 'straight', l: 20, w: nw, w2: g.w, s: g.surf() });
    g.kinds.push('narrow'); g.hazards++;
  },
  iceStretch(g) {
    const dir = g.dir(), r = g.radius(1.5), a = g.rng.range(0.4, 0.9);
    g.add({ k: 'straight', l: g.rng.range(40, 70), s: SURF_ICE });
    g.add({ k: 'curve', l: r * a, y: dir * a, s: SURF_ICE });
    g.add({ k: 'straight', l: 30, s: g.surf() }, 'ice'); g.ices++; g.hazards++;
  },
  sandPatch(g) {
    g.add({ k: 'straight', l: g.rng.range(50, 90), s: SURF_SAND });
    g.add({ k: 'straight', l: 30, s: g.surf() }, 'sand');
  },
  grassPatch(g) {
    g.add({ k: 'straight', l: g.rng.range(40, 80), s: SURF_GRASS });
    g.add({ k: 'straight', l: 30, s: g.surf() }, 'grass');
  },
  tunnel(g) {
    const dir = g.dir(), r = g.radius(1.2), a = g.rng.range(0.3, 0.9);
    g.add({ k: 'straight', l: g.rng.range(60, 100), f: F_TUNNEL, s: g.surf() });
    g.add({ k: 'curve', l: r * a, y: dir * a, f: F_TUNNEL, s: g.surf() });
    g.add({ k: 'straight', l: g.rng.range(50, 90), f: F_TUNNEL, s: g.surf() }, 'tunnel');
  },
  bridgeRun(g) {
    const dir = g.dir(), r = g.radius(1.5), a = g.rng.range(0.2, 0.6);
    g.add({ k: 'straight', l: g.rng.range(100, 180), f: F_BRIDGE | F_NOWALL * 0, s: g.surf() });
    g.add({ k: 'curve', l: r * a, y: dir * a, f: F_BRIDGE, s: g.surf() }, 'bridge');
  },
};

function pickMacro(g: TG): string {
  const keys = Object.keys(g.cfg.weights);
  let total = 0; const ws: number[] = [];
  for (const k of keys) {
    let w = g.cfg.weights[k];
    // avoid immediate repetition of the same macro and cap repeats
    const last = g.kinds[g.kinds.length - 1];
    if (last === k || (k === 'sandPatch' && last === 'sand') || (k === 'grassPatch' && last === 'grass')) w *= 0.12;
    const cnt = g.kinds.filter(x => x === k).length;
    w *= Math.pow(0.78, cnt);
    // difficulty gating
    if ((k === 'jump' || k === 'bigJump') && g.jumps >= 1 + Math.round(g.d * 6)) w *= 0.15;
    if ((k === 'loop' || k === 'cork') && g.loops >= 1 + Math.round(g.d * 2)) w *= 0.1;
    if (k === 'cork' && g.d < 0.5) w *= 0.3;
    ws.push(w); total += w;
  }
  let x = g.rng.next() * total;
  for (let i = 0; i < keys.length; i++) { x -= ws[i]; if (x <= 0) return keys[i]; }
  return keys[0];
}

export interface GenInfo { attempts: number; features: Record<string, number> }

function generateOnce(chapter: ChapterCfg, idx: number, seed: number, d: number, targetLen: number): TrackDef {
  const rng = new Rng(seed);
  const g = new TG(rng, chapter, d);
  g.add({ k: 'start', l: 44, s: chapter.surf, w: g.w });
  const cpGap = lerp(230, 330, rng.next());
  while (g.dist < targetLen) {
    const m = pickMacro(g);
    const startPieces = g.pieces.length;
    MACROS[m](g);
    // plain extra surface variety: only for chapters with ice/narrow tendencies
    if (m !== 'jump' && m !== 'bigJump' && m !== 'loop' && m !== 'cork') {
      if (g.sinceCp > cpGap) {
        // place a checkpoint on the last safe piece (never on gaps, ramps, loops)
        for (let i = g.pieces.length - 1; i >= startPieces; i--) {
          const p = g.pieces[i];
          if (p.k === 'straight' || p.k === 'curve' || p.k === 'bank' || p.k === 'narrow' || p.k === 'climb' || p.k === 'drop') {
            if (!(p.f && p.f & F_GAP)) { p.f = (p.f ?? 0) | F_CP; g.sinceCp = 0; break; }
          }
        }
      }
    }
    // random decor
    if (rng.chance(chapter.tunnel * 0.4) && m === 'straight') g.pieces[g.pieces.length - 1].f = (g.pieces[g.pieces.length - 1].f ?? 0) | F_TUNNEL;
  }
  g.add({ k: 'straight', l: 70, s: chapter.surf, f: F_CP });
  g.add({ k: 'finish', l: 60, s: chapter.surf });
  const def: TrackDef = { id: 0, name: '', chapter: chapter.id, env: chapter.env, seed, pieces: g.pieces };
  // moving obstacles on long straights
  if (chapter.obst > 0 && rng.chance(chapter.obst + d * 0.3)) {
    const obs: ObstacleDef[] = [];
    let dist = 2; // start sample
    for (const p of g.pieces) {
      const l = Math.max(1, Math.round(p.l / DS)) * DS;
      if (p.k === 'straight' && l >= 90 && !(p.f && (p.f & (F_BOOST | F_GAP))) && dist > 150 && obs.length < 2 + Math.round(d * 3) && rng.chance(0.4)) {
        const w = p.w ?? g.w;
        obs.push({ s: dist + l * 0.5, d0: rng.range(-w * 0.1, w * 0.1), amp: w * rng.range(0.14, 0.22), per: rng.range(2.4, 4.2), ph: rng.range(0, 6.28), w: w * 0.1, len: 1.5 });
      }
      dist += l;
    }
    if (obs.length) def.obstacles = obs;
  }
  return def;
}

export interface GeomReport { ok: boolean; reason?: string; length: number; selfIntersect: boolean; heightRange: number; repetition: number }

/** Geometry/variety checks that run before the driver ever attempts the track. */
export function validateGeometry(def: TrackDef): GeomReport {
  const tr = buildTrack(def);
  const n = tr.n;
  const rep: GeomReport = { ok: true, length: tr.lengthM, selfIntersect: false, heightRange: 0, repetition: 0 };
  // spatial hash for self-intersection (road crossing / overlapping other road far along the track)
  const cell = 12; const map = new Map<string, number[]>();
  const key = (x: number, z: number) => `${Math.floor(x / cell)},${Math.floor(z / cell)}`;
  for (let i = 0; i < n; i++) {
    for (let dx = -1; dx <= 1 && !rep.selfIntersect; dx++) for (let dz = -1; dz <= 1; dz++) {
      const list = map.get(`${Math.floor(tr.px[i] / cell) + dx},${Math.floor(tr.pz[i] / cell) + dz}`);
      if (!list) continue;
      for (const j of list) {
        if (i - j < 110) continue;
        const ddx = tr.px[i] - tr.px[j], ddy = tr.py[i] - tr.py[j], ddz = tr.pz[i] - tr.pz[j];
        const clearance = 0.5 * (tr.w[i] + tr.w[j]) + 3;
        if (ddx * ddx + ddz * ddz < clearance * clearance && Math.abs(ddy) < 14) { rep.selfIntersect = true; break; }
      }
      if (rep.selfIntersect) break;
    }
    const k = key(tr.px[i], tr.pz[i]);
    const l = map.get(k); if (l) l.push(i); else map.set(k, [i]);
  }
  let minY = 1e9, maxY = -1e9;
  for (let i = 0; i < n; i++) { minY = Math.min(minY, tr.py[i]); maxY = Math.max(maxY, tr.py[i]); }
  rep.heightRange = maxY - minY;
  // repetition: histogram of piece kinds
  const hist = new Map<string, number>();
  for (const p of def.pieces) hist.set(p.k, (hist.get(p.k) ?? 0) + 1);
  const distinct = hist.size;
  const kinds = def.pieces.filter(p => p.k !== 'start' && p.k !== 'finish');
  let maxRun = 1, run = 1;
  for (let i = 1; i < kinds.length; i++) { if (kinds[i].k === kinds[i - 1].k && kinds[i].k !== 'curve') { run++; maxRun = Math.max(maxRun, run); } else run = 1; }
  rep.repetition = maxRun;
  if (rep.selfIntersect) { rep.ok = false; rep.reason = 'road self-intersects'; }
  else if (rep.heightRange > 260) { rep.ok = false; rep.reason = 'excessive elevation'; }
  else if (distinct < 3) { rep.ok = false; rep.reason = 'too little variety'; }
  else if (maxRun > 4) { rep.ok = false; rep.reason = 'repetitive piece runs'; }
  return rep;
}

export function chapterOf(id: number): ChapterCfg { return CHAPTERS[Math.floor((id - 1) / 25)]; }

/** Deterministic difficulty (0..1) for a campaign id: monotone ramp globally, with a within-chapter ramp. */
export function difficultyFor(id: number): number {
  const ch = chapterOf(id); const idx = (id - 1) % 25;
  return lerp(ch.d[0], ch.d[1], idx / 24);
}

export function generateTrack(id: number, attempt = 0): TrackDef {
  const ch = chapterOf(id); const idx = (id - 1) % 25;
  const d = difficultyFor(id);
  const t = idx / 24;
  const targetLen = lerp(ch.len[0], ch.len[1], t) * (0.92 + 0.16 * new Rng(hashStr('len' + id)).next());
  for (let a = attempt; a < attempt + 200; a++) {
    const seed = hashStr(`APEXLINE/${id}/${a}`);
    const def = generateOnce(ch, idx, seed, d, targetLen);
    def.id = id; def.name = ch.names[idx];
    const rep = validateGeometry(def);
    if (rep.ok) { (def as any).attempt = a; return def; }
  }
  throw new Error(`could not generate a valid geometry for track ${id}`);
}

export function describeTrack(def: TrackDef): string {
  const ch = CHAPTERS[def.chapter - 1];
  const cnt: Record<string, number> = {};
  for (const p of def.pieces) {
    if (p.f && (p.f & F_GAP)) cnt.jumps = (cnt.jumps ?? 0) + 1;
    if (p.k === 'loop') cnt.loops = (cnt.loops ?? 0) + 1;
    if (p.k === 'cork') cnt.corkscrews = (cnt.corkscrews ?? 0) + 1;
    if (p.k === 'halfpipe') cnt.halfpipes = (cnt.halfpipes ?? 0) + 1;
    if (p.k === 'narrow') cnt.narrow = (cnt.narrow ?? 0) + 1;
    if (p.k === 'bank') cnt.banked = (cnt.banked ?? 0) + 1;
    if (p.k === 'ramp' && false) cnt.ramps = 0;
    if ((p.f ?? 0) & F_BOOST) cnt.boost = (cnt.boost ?? 0) + 1;
    if (p.s === SURF_ICE) cnt.ice = 1;
    if (p.s === SURF_SAND) cnt.sand = 1;
    if (p.s === SURF_GRASS) cnt.grass = 1;
  }
  const bits: string[] = [];
  if (cnt.jumps) bits.push(`${cnt.jumps} jump${cnt.jumps > 1 ? 's' : ''}`);
  if (cnt.loops) bits.push(`${cnt.loops} loop${cnt.loops > 1 ? 's' : ''}`);
  if (cnt.corkscrews) bits.push('a corkscrew');
  if (cnt.halfpipes) bits.push('halfpipe walls');
  if (cnt.banked) bits.push('banked turns');
  if (cnt.narrow) bits.push('narrow open-edge sections');
  if (cnt.boost) bits.push('boost pads');
  if (cnt.ice) bits.push('ice');
  if (cnt.sand) bits.push('loose sand');
  if (cnt.grass) bits.push('grass');
  if (def.obstacles?.length) bits.push('moving obstacles');
  return `${ch.blurb}${bits.length ? ' Features ' + bits.join(', ') + '.' : ''}`;
}

/** Endless Road: one long seeded track whose difficulty ramps from gentle to brutal. */
export function generateEndless(seed: number, length = 9000): TrackDef {
  const base = CHAPTERS[1];
  for (let a = 0; a < 60; a++) {
    const rng = new Rng(hashStr(`endless/${seed}/${a}`));
    const ch: ChapterCfg = { ...base, id: 2, weights: { straight: 2, sweeper: 4, chicane: 1.5, jump: 1.2, hill: 1.5, esses: 1.5, bankedTurn: 1.5, hairpin: 0.8, iceStretch: 0.4, narrow: 0.5, loop: 0.5, boostStrip: 1, slalom: 0.8 }, speed: 1.1, obst: 0, maxGap: 36 };
    const g = new TG(rng, ch, 0.05);
    g.add({ k: 'start', l: 44, s: 0, w: g.w });
    while (g.dist < length) {
      g.d = Math.min(1, 0.05 + (g.dist / length) * 0.95);
      const m = pickMacro(g);
      MACROS[m](g);
      if (g.sinceCp > 280 && g.pieces[g.pieces.length - 1].k === 'straight') { g.pieces[g.pieces.length - 1].f = (g.pieces[g.pieces.length - 1].f ?? 0) | F_CP; g.sinceCp = 0; }
    }
    g.add({ k: 'straight', l: 70, s: 0, f: F_CP }); g.add({ k: 'finish', l: 60, s: 0 });
    const def: TrackDef = { id: 0, name: 'Endless Road', chapter: 0, env: 'coastal', seed, pieces: g.pieces };
    if (validateGeometry(def).ok) return def;
  }
  throw new Error('endless generation failed');
}

/** Free-drive playground: a very wide open deck with ramps, a loop and boost lanes. No walls on the edges, so it is possible to fall (and respawn). */
export function freeDriveTrack(): TrackDef {
  const w = 70, P: PieceDef[] = [];
  const add = (p: PieceDef) => P.push({ w, ...p });
  add({ k: 'start', l: 80, f: F_NOWALL });
  add({ k: 'straight', l: 200, f: F_BOOST | F_NOWALL });
  add({ k: 'ramp', l: 14, dp: 0.28, f: F_NOWALL }); add({ k: 'jump', l: 30, dp: -0.56, f: F_GAP | F_NOWALL }); add({ k: 'land', l: 18, dp: 0.28, f: F_NOWALL });
  add({ k: 'straight', l: 160, f: F_NOWALL });
  add({ k: 'curve', l: 140 * 1.4, y: 1.4, f: F_NOWALL }); add({ k: 'straight', l: 120, f: F_NOWALL });
  add({ k: 'bank', l: 160 * 1.2, y: -1.2, b: 0.5, f: F_NOWALL });
  add({ k: 'straight', l: 160, f: F_NOWALL | F_CP }); add({ k: 'hill', l: 90, p: 0.12, f: F_NOWALL }); add({ k: 'drop', l: 90, p: -0.12, f: F_NOWALL });
  add({ k: 'straight', l: 300, f: F_NOWALL });
  add({ k: 'curve', l: 150, y: 1.0, f: F_NOWALL }); add({ k: 'straight', l: 400, f: F_NOWALL | F_BOOST });
  add({ k: 'finish', l: 200, f: F_NOWALL });
  return { id: 0, name: 'Proving Ground', chapter: 0, env: 'formula', seed: 1, pieces: P };
}
