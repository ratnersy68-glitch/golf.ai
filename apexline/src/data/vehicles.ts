import { STANDARD, VehicleParams } from '../sim/vehicle';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type Category = 'Street' | 'Sport' | 'Supercar' | 'Hypercar' | 'Rally' | 'Experimental';

/** Parametric silhouette. All fractions run front (0) -> rear (1) along the car. */
export interface Shape {
  L: number; W: number; H: number; // length, width, overall height (m)
  nose: number; hood: number; deck: number; tail: number; // heights as fraction of H (nose tip, cowl, rear deck, tail tip)
  cowl: number; roofS: number; roofE: number; // windshield base, roof start, roof end (x fraction)
  noseW: number; tailW: number; cabW: number; // width fractions
  clear: number; // ground clearance (m)
  wr: number; ww: number; // wheel radius, width (m)
  wbF: number; wbR: number; // axle positions (x fraction)
  spoiler: string; // default spoiler id from the body-part generator
  head: 'twin' | 'bar' | 'slit' | 'round' | 'quad' | 'hex';
  tailL: 'bar' | 'twin' | 'round' | 'strip' | 'quad';
  canopy?: boolean; // single-seat bubble
  scoop?: boolean; snorkel?: boolean; rake?: number; fin?: boolean; open?: boolean;
}

export interface Stats { accel: number; top: number; grip: number; brake: number; air: number; drift: number }
export interface Engine { base: number; cyl: number; rough: number; whine: number; max: number } // synth parameters

export interface VehicleDef {
  id: string; name: string; category: Category; rarity: Rarity; price: number; unlockLevel: number;
  desc: string; shape: Shape; engine: Engine; mods: Partial<Record<keyof VehicleParams, number>>;
  offroad?: number; // 0..1 loose-surface grip bonus
  defaultColors: [string, string, string]; // primary, secondary, accent
  stats: Stats; // 20-100 display ratings (derived)
}

const sh = (o: Partial<Shape> & Pick<Shape, 'L' | 'W' | 'H'>): Shape => ({
  nose: 0.46, hood: 0.62, deck: 0.7, tail: 0.5, cowl: 0.34, roofS: 0.46, roofE: 0.68, noseW: 0.82, tailW: 0.86, cabW: 0.78,
  clear: 0.12, wr: 0.34, ww: 0.24, wbF: 0.2, wbR: 0.8, spoiler: 'lip', head: 'twin', tailL: 'bar', ...o,
});

const RAR: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const eng = (base: number, cyl: number, rough = 0.4, whine = 0, max = 7200): Engine => ({ base, cyl, rough, whine, max });

type Mods = Partial<Record<keyof VehicleParams, number>>;
const V = (id: string, name: string, category: Category, rarity: Rarity, price: number, unlockLevel: number, desc: string, shape: Shape, engine: Engine, mods: Mods, colors: [string, string, string], offroad = 0): VehicleDef =>
  ({ id, name, category, rarity, price, unlockLevel, desc, shape, engine, mods, offroad, defaultColors: colors, stats: { accel: 0, top: 0, grip: 0, brake: 0, air: 0, drift: 0 } });

export const VEHICLES: VehicleDef[] = [
  // ---- Street ---------------------------------------------------------------------------------------------------
  V('pulse', 'Pulse', 'Street', 'common', 0, 1, 'Light, honest hatchback. Forgiving everywhere, brilliant for learning the line.',
    sh({ L: 3.9, W: 1.74, H: 1.46, nose: 0.5, hood: 0.66, deck: 0.82, tail: 0.6, cowl: 0.3, roofS: 0.4, roofE: 0.8, cabW: 0.84, spoiler: 'lip', head: 'round', tailL: 'twin', wr: 0.31, ww: 0.2 }),
    eng(52, 4, 0.5, 0.1, 6800), { power: 0.78, accel: 0.92, mu: 1.0, brake: 0.9, hbGrip: 1.15 }, ['#2F333A', '#E8EAED', '#B8BDC4']),
  V('vector', 'Vector', 'Street', 'common', 3000, 2, 'A sharp-edged compact coupe with a quick-turning front end.',
    sh({ L: 4.1, W: 1.76, H: 1.38, nose: 0.44, hood: 0.6, deck: 0.74, tail: 0.54, cowl: 0.33, roofS: 0.44, roofE: 0.72, head: 'slit', tailL: 'strip', spoiler: 'duck' }),
    eng(56, 4, 0.45, 0.1, 7000), { power: 0.8, accel: 0.95, mu: 1.03, brake: 0.92, yawResp: 1.1 }, ['#3A8DFF', '#25282D', '#F5F7FA']),
  V('striker', 'Striker', 'Street', 'uncommon', 5500, 4, 'Rear-driven sedan with a long hood and a tail that loves to rotate.',
    sh({ L: 4.5, W: 1.8, H: 1.4, nose: 0.46, hood: 0.62, deck: 0.7, tail: 0.58, cowl: 0.38, roofS: 0.48, roofE: 0.7, cabW: 0.8, head: 'quad', tailL: 'twin', spoiler: 'lip' }),
    eng(46, 6, 0.4, 0.05, 7200), { power: 0.86, accel: 0.95, mu: 1.0, hbGrip: 0.9 }, ['#FF3B30', '#25282D', '#A8AFBA']),
  V('volt', 'Volt', 'Street', 'rare', 8000, 6, 'Electric hot-hatch: instant torque, whisper-quiet, a touch heavier through corners.',
    sh({ L: 4.0, W: 1.78, H: 1.44, nose: 0.52, hood: 0.64, deck: 0.8, tail: 0.58, cowl: 0.32, roofS: 0.42, roofE: 0.78, head: 'bar', tailL: 'bar', spoiler: 'lip', clear: 0.14 }),
    eng(110, 2, 0.05, 1, 12000), { power: 0.82, accel: 1.18, mu: 0.98, cd: 0.9, yaw: 0.93 }, ['#00E5FF', '#F5F7FA', '#272C34']),
  // ---- Sport ----------------------------------------------------------------------------------------------------
  V('raptor', 'Raptor', 'Sport', 'uncommon', 14000, 8, 'Muscular two-door with a wide stance and a roar to match.',
    sh({ L: 4.7, W: 1.9, H: 1.3, nose: 0.44, hood: 0.58, deck: 0.68, tail: 0.52, cowl: 0.4, roofS: 0.5, roofE: 0.72, head: 'twin', tailL: 'quad', spoiler: 'duck', wr: 0.35, ww: 0.27 }),
    eng(40, 8, 0.7, 0, 6800), { power: 1.0, accel: 1.05, mu: 1.05, hbGrip: 0.9 }, ['#FF8A00', '#25282D', '#F5F7FA']),
  V('apex', 'Apex', 'Sport', 'rare', 18000, 10, 'The benchmark sports coupe. Balanced, communicative and quick everywhere.',
    sh({ L: 4.3, W: 1.84, H: 1.28, nose: 0.42, hood: 0.56, deck: 0.66, tail: 0.5, cowl: 0.38, roofS: 0.48, roofE: 0.7, head: 'slit', tailL: 'strip', spoiler: 'gt' }),
    eng(48, 6, 0.35, 0.05, 8200), { power: 1.0, accel: 1.02, mu: 1.1, brake: 1.05, yawResp: 1.1 }, ['#8A929C', '#25282D', '#FFFFFF']),
  V('vortex', 'Vortex', 'Sport', 'epic', 24000, 14, 'Turbocharged all-wheel-drive. Monstrous exits, stable under braking.',
    sh({ L: 4.4, W: 1.86, H: 1.32, nose: 0.46, hood: 0.6, deck: 0.7, tail: 0.54, cowl: 0.4, roofS: 0.5, roofE: 0.74, head: 'hex', tailL: 'twin', spoiler: 'wing', scoop: true, wr: 0.35 }),
    eng(44, 4, 0.55, 0.9, 7800), { power: 1.05, accel: 1.12, mu: 1.1, hbGrip: 1.1 }, ['#7C6FD8', '#25282D', '#E8EAED']),
  V('phantom', 'Phantom', 'Sport', 'epic', 28000, 16, 'Low, black, silent in the mirrors. A razor-focused track coupe.',
    sh({ L: 4.45, W: 1.88, H: 1.22, nose: 0.38, hood: 0.52, deck: 0.62, tail: 0.46, cowl: 0.42, roofS: 0.52, roofE: 0.72, head: 'slit', tailL: 'bar', spoiler: 'ladder' }),
    eng(50, 6, 0.3, 0.2, 8800), { power: 1.04, accel: 1.05, mu: 1.14, brake: 1.08, yaw: 1.05 }, ['#25282D', '#E8EAED', '#B8BDC4']),
  // ---- Supercar -------------------------------------------------------------------------------------------------
  V('tempest', 'Tempest', 'Supercar', 'epic', 40000, 20, 'Mid-engine thriller with scissor-sharp creases and a screaming V10.',
    sh({ L: 4.5, W: 1.96, H: 1.14, nose: 0.34, hood: 0.5, deck: 0.8, tail: 0.5, cowl: 0.3, roofS: 0.42, roofE: 0.6, cabW: 0.72, head: 'slit', tailL: 'strip', spoiler: 'gt', scoop: true, wr: 0.36, ww: 0.3, wbF: 0.19, wbR: 0.79 }),
    eng(36, 10, 0.3, 0.3, 9500), { power: 1.18, accel: 1.15, mu: 1.2, downforce: 1.25, brake: 1.1 }, ['#FF3B30', '#25282D', '#F5F7FA']),
  V('velocity', 'Velocity', 'Supercar', 'epic', 46000, 24, 'Long-tail grand tourer built for 300 km/h straights.',
    sh({ L: 4.8, W: 1.94, H: 1.18, nose: 0.36, hood: 0.52, deck: 0.7, tail: 0.46, cowl: 0.36, roofS: 0.48, roofE: 0.7, head: 'bar', tailL: 'bar', spoiler: 'lip', wr: 0.36, ww: 0.29 }),
    eng(34, 12, 0.25, 0.2, 9000), { power: 1.3, accel: 1.1, mu: 1.15, cd: 0.9, downforce: 1.1 }, ['#6F7782', '#F5F5F3', '#25282D']),
  V('eclipse', 'Eclipse', 'Supercar', 'legendary', 60000, 28, 'A wide, flat-floored wedge that sticks to the road like a shadow.',
    sh({ L: 4.4, W: 2.02, H: 1.08, nose: 0.3, hood: 0.46, deck: 0.82, tail: 0.46, cowl: 0.32, roofS: 0.44, roofE: 0.62, cabW: 0.68, head: 'slit', tailL: 'strip', spoiler: 'wing', wr: 0.36, ww: 0.32, wbF: 0.19, wbR: 0.8, rake: 1 }),
    eng(38, 8, 0.25, 0.4, 9800), { power: 1.2, accel: 1.18, mu: 1.28, downforce: 1.5, yawResp: 1.1 }, ['#25282D', '#B8BDC4', '#FFFFFF']),
  V('spectre', 'Spectre', 'Supercar', 'legendary', 70000, 32, 'Gullwing silhouette, ghostly paint, unholy acceleration.',
    sh({ L: 4.6, W: 1.98, H: 1.12, nose: 0.34, hood: 0.5, deck: 0.74, tail: 0.5, cowl: 0.34, roofS: 0.46, roofE: 0.66, head: 'hex', tailL: 'quad', spoiler: 'dual', fin: true, wr: 0.36, ww: 0.3 }),
    eng(42, 8, 0.45, 0.6, 9200), { power: 1.28, accel: 1.22, mu: 1.2, yaw: 1.09, hbGrip: 0.9 }, ['#A8AFBA', '#25282D', '#00E5FF']),
  // ---- Hypercar -------------------------------------------------------------------------------------------------
  V('nova', 'Nova', 'Hypercar', 'legendary', 100000, 40, 'Carbon monocoque, hybrid assist and a 1,000 hp punch.',
    sh({ L: 4.7, W: 2.0, H: 1.06, nose: 0.3, hood: 0.44, deck: 0.8, tail: 0.44, cowl: 0.3, roofS: 0.4, roofE: 0.6, cabW: 0.64, head: 'slit', tailL: 'strip', spoiler: 'wing', wr: 0.37, ww: 0.33, wbF: 0.18, wbR: 0.8 }),
    eng(44, 8, 0.25, 0.8, 10500), { power: 1.5, accel: 1.3, mu: 1.3, downforce: 1.6, brake: 1.15 }, ['#B8BDC4', '#25282D', '#FFFFFF']),
  V('zenith', 'Zenith', 'Hypercar', 'legendary', 125000, 48, 'Peak combustion engineering: lightest, loudest, most precise.',
    sh({ L: 4.6, W: 2.0, H: 1.04, nose: 0.28, hood: 0.42, deck: 0.78, tail: 0.42, cowl: 0.3, roofS: 0.4, roofE: 0.58, cabW: 0.62, head: 'slit', tailL: 'bar', spoiler: 'big', scoop: true, wr: 0.37, ww: 0.34 }),
    eng(30, 12, 0.2, 0.2, 11500), { power: 1.55, accel: 1.28, mu: 1.35, yaw: 1.14, downforce: 1.7 }, ['#FFC400', '#25282D', '#F5F7FA']),
  V('oblivion', 'Oblivion', 'Hypercar', 'mythic', 160000, 60, 'A track-only weapon: aggressive aero, absurd power, zero forgiveness.',
    sh({ L: 4.8, W: 2.05, H: 1.0, nose: 0.26, hood: 0.4, deck: 0.84, tail: 0.46, cowl: 0.28, roofS: 0.38, roofE: 0.56, cabW: 0.6, head: 'hex', tailL: 'quad', spoiler: 'big', fin: true, wr: 0.38, ww: 0.36, rake: 1 }),
    eng(32, 10, 0.5, 0.6, 11000), { power: 1.7, accel: 1.35, mu: 1.32, downforce: 1.9, hbGrip: 0.8, yawResp: 1.15 }, ['#B3003C', '#25282D', '#A8AFBA']),
  V('singularity', 'Singularity', 'Hypercar', 'mythic', 220000, 80, 'The final word in speed. Bends light, bends rules, barely touches the ground.',
    sh({ L: 4.9, W: 2.06, H: 0.98, nose: 0.24, hood: 0.38, deck: 0.7, tail: 0.4, cowl: 0.3, roofS: 0.42, roofE: 0.58, cabW: 0.6, head: 'bar', tailL: 'strip', spoiler: 'dual', canopy: true, wr: 0.38, ww: 0.36 }),
    eng(90, 4, 0.1, 1, 14000), { power: 1.85, accel: 1.4, mu: 1.4, downforce: 2.1, cd: 0.85, yaw: 1.11 }, ['#25282D', '#F5F5F3', '#B8BDC4']),
  // ---- Rally ----------------------------------------------------------------------------------------------------
  V('ridge', 'Ridge', 'Rally', 'uncommon', 15000, 9, 'Compact gravel hero with long-travel suspension and a roof scoop.',
    sh({ L: 4.0, W: 1.8, H: 1.46, nose: 0.5, hood: 0.66, deck: 0.8, tail: 0.6, cowl: 0.34, roofS: 0.44, roofE: 0.78, head: 'quad', tailL: 'twin', spoiler: 'duck', scoop: true, clear: 0.22, wr: 0.36, ww: 0.24 }),
    eng(48, 4, 0.6, 0.8, 7400), { power: 0.9, accel: 1.05, mu: 0.98, airCtl: 1.1 }, ['#3A8DFF', '#F5F7FA', '#FFC400'], 0.65),
  V('outlaw', 'Outlaw', 'Rally', 'rare', 22000, 13, 'Group-B inspired brute. Huge wing, huge noise, huge slides.',
    sh({ L: 4.1, W: 1.86, H: 1.42, nose: 0.46, hood: 0.62, deck: 0.8, tail: 0.6, cowl: 0.34, roofS: 0.44, roofE: 0.76, head: 'quad', tailL: 'quad', spoiler: 'big', scoop: true, clear: 0.2, wr: 0.37, ww: 0.28 }),
    eng(42, 5, 0.8, 0.9, 7600), { power: 1.08, accel: 1.1, mu: 1.0, hbGrip: 1.15 }, ['#FF3B30', '#F5F7FA', '#25282D'], 0.75),
  V('terra', 'Terra', 'Rally', 'epic', 32000, 18, 'Purpose-built off-roader that keeps its grip when the tarmac ends.',
    sh({ L: 4.3, W: 1.9, H: 1.55, nose: 0.52, hood: 0.66, deck: 0.82, tail: 0.64, cowl: 0.36, roofS: 0.46, roofE: 0.82, head: 'round', tailL: 'round', spoiler: 'lip', snorkel: true, clear: 0.28, wr: 0.4, ww: 0.3 }),
    eng(44, 6, 0.6, 0.2, 6800), { power: 0.95, accel: 1.0, mu: 0.98, yaw: 0.89 }, ['#7A8F3A', '#272C34', '#FFC400'], 1.0),
  V('nomad', 'Nomad', 'Rally', 'legendary', 55000, 26, 'A dune-hopping prototype with extreme suspension and air-control tuning.',
    sh({ L: 4.2, W: 1.92, H: 1.5, nose: 0.5, hood: 0.62, deck: 0.8, tail: 0.6, cowl: 0.36, roofS: 0.46, roofE: 0.8, head: 'bar', tailL: 'bar', spoiler: 'ladder', open: true, scoop: true, clear: 0.3, wr: 0.42, ww: 0.32 }),
    eng(38, 6, 0.65, 0.5, 7800), { power: 1.1, accel: 1.15, mu: 1.02, airCtl: 1.6 }, ['#FFC400', '#25282D', '#F5F7FA'], 0.9),
  // ---- Experimental ---------------------------------------------------------------------------------------------
  V('zero', 'Zero', 'Experimental', 'rare', 35000, 22, 'A single-seat pod: absurdly light, twitchy, and a joy in the air.',
    sh({ L: 3.4, W: 1.56, H: 1.1, nose: 0.5, hood: 0.7, deck: 0.8, tail: 0.5, cowl: 0.4, roofS: 0.5, roofE: 0.66, noseW: 0.6, tailW: 0.7, cabW: 0.6, head: 'round', tailL: 'round', canopy: true, spoiler: 'none', wr: 0.3, ww: 0.22, wbF: 0.14, wbR: 0.86 }),
    eng(80, 3, 0.2, 1, 10500), { power: 0.95, accel: 1.35, mu: 1.05, yaw: 1.43, airCtl: 1.45, brake: 1.05, yawResp: 1.3 }, ['#F5F5F3', '#B8BDC4', '#25282D']),
  V('ion', 'Ion', 'Experimental', 'epic', 52000, 30, 'Teardrop EV with seamless torque and a drag figure that bends the wind.',
    sh({ L: 4.6, W: 1.9, H: 1.2, nose: 0.4, hood: 0.58, deck: 0.62, tail: 0.4, cowl: 0.34, roofS: 0.44, roofE: 0.76, head: 'bar', tailL: 'strip', spoiler: 'none', fin: true, wr: 0.35, ww: 0.26 }),
    eng(120, 2, 0.02, 1, 13000), { power: 1.15, accel: 1.3, mu: 1.1, cd: 0.7, yaw: 0.95 }, ['#00E5FF', '#25282D', '#F5F7FA']),
  V('quantum', 'Quantum', 'Experimental', 'legendary', 90000, 44, 'Delta-wing downforce machine. Corners on rails at speeds that should not work.',
    sh({ L: 4.5, W: 2.1, H: 1.0, nose: 0.22, hood: 0.38, deck: 0.6, tail: 0.36, cowl: 0.32, roofS: 0.42, roofE: 0.58, noseW: 0.6, tailW: 1.0, cabW: 0.5, head: 'slit', tailL: 'strip', canopy: true, spoiler: 'big', wr: 0.37, ww: 0.36, rake: 1 }),
    eng(70, 4, 0.1, 1, 12500), { power: 1.4, accel: 1.2, mu: 1.45, downforce: 2.6, brake: 1.2, yawResp: 1.1 }, ['#7C4DFF', '#25282D', '#00E5FF']),
  V('projectx', 'Project X', 'Experimental', 'mythic', 250000, 100, 'Unmarked prototype. Nobody admits who built it. Everybody wants to drive it.',
    sh({ L: 4.8, W: 2.04, H: 1.02, nose: 0.28, hood: 0.42, deck: 0.7, tail: 0.44, cowl: 0.34, roofS: 0.42, roofE: 0.62, cabW: 0.6, head: 'hex', tailL: 'quad', spoiler: 'dual', fin: true, canopy: true, wr: 0.38, ww: 0.36 }),
    eng(60, 6, 0.3, 0.7, 12000), { power: 1.6, accel: 1.3, mu: 1.35, downforce: 1.8, airCtl: 1.3, yaw: 1.18, yawResp: 1.2 }, ['#E8EAED', '#25282D', '#C0392B']),
];

/** Proportions of a vehicle built from the shared GLB kit (all values are multipliers on the base racer unless stated). */
export interface Variant {
  len: number; wid: number; hgt: number; clear: number; pods: number; noseW: number; noseLen: number;
  fwSpan: number; fwPlanes: number; fwChord: number; rwSpan: number; rwPlanes: number; rwH: number; rwChord: number;
  wheelF: number; wheelR: number; wheelW: number; cockH: number; halo: boolean; canopy: boolean; airbox: boolean; fin: boolean; snorkel: boolean;
}
const hash01 = (id: string, salt: number) => { let h = 2166136261 ^ salt; for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; };
const CAT_BASE: Record<Category, Partial<Variant>> = {
  Street: { len: 0.92, wid: 0.97, hgt: 1.12, pods: 0.8, wheelF: 0.92, wheelR: 0.95, cockH: 1.1, fwPlanes: 1, rwPlanes: 1, rwH: 0.85 },
  Sport: { len: 1.0, wid: 1.0, hgt: 1.0, pods: 1.0, wheelF: 1, wheelR: 1, cockH: 1, fwPlanes: 1, rwPlanes: 1, rwH: 1 },
  Supercar: { len: 1.04, wid: 1.02, hgt: 0.94, pods: 1.2, wheelF: 1.05, wheelR: 1.06, cockH: 0.95, fwPlanes: 2, rwPlanes: 2, rwH: 1.05, fwSpan: 1.05, rwSpan: 1.05 },
  Hypercar: { len: 1.1, wid: 1.04, hgt: 0.88, pods: 1.3, wheelF: 1.1, wheelR: 1.12, cockH: 0.9, fwPlanes: 2, rwPlanes: 2, rwH: 1.1, fwSpan: 1.1, rwSpan: 1.12, halo: true },
  Rally: { len: 0.98, wid: 1.02, hgt: 1.1, clear: 0.14, pods: 0.85, wheelF: 1.2, wheelR: 1.18, wheelW: 1.05, cockH: 1.08, fwPlanes: 1, rwPlanes: 1, rwH: 1.12, airbox: true },
  Experimental: { len: 1.0, wid: 1.0, hgt: 0.95, pods: 1.0, wheelF: 1, wheelR: 1, cockH: 1, fwPlanes: 1, rwPlanes: 1, rwH: 1 },
};
const RW_BY_SPOILER: Record<string, Partial<Variant>> = { none: {}, lip: { rwChord: 0.8, rwH: 0.75 }, duck: { rwChord: 0.9, rwH: 0.8 }, gt: { rwPlanes: 1, rwH: 1.1 }, wing: { rwSpan: 1.0 }, ladder: { rwPlanes: 3, rwChord: 0.75 }, dual: { rwPlanes: 2 }, big: { rwPlanes: 2, rwChord: 1.2, rwSpan: 1.12, rwH: 1.15 } };
const SPECIAL: Record<string, Partial<Variant>> = {
  zero: { len: 0.84, wid: 0.88, hgt: 0.98, canopy: true, pods: 0.6, fwSpan: 0.85, rwSpan: 0.85, wheelF: 0.95, wheelR: 0.95 },
  ion: { len: 1.1, hgt: 0.88, fin: true, pods: 0.9, rwPlanes: 1, rwH: 0.9, fwPlanes: 1 },
  quantum: { wid: 1.08, len: 1.02, hgt: 0.86, canopy: true, fwSpan: 1.25, fwPlanes: 3, rwPlanes: 3, rwSpan: 1.2, pods: 1.35, noseW: 1.25 },
  projectx: { len: 1.12, wid: 1.05, hgt: 0.88, fin: true, halo: true, canopy: false, fwPlanes: 3, rwPlanes: 3, rwChord: 1.2, pods: 1.35 },
  singularity: { canopy: true, len: 1.14, hgt: 0.84 }, spectre: { fin: true }, oblivion: { fin: true, rwChord: 1.25 }, terra: { snorkel: true, hgt: 1.16 }, nomad: { clear: 0.2, wheelF: 1.28, wheelR: 1.26 },
};
export function variantOf(v: VehicleDef): Variant {
  const base: Variant = { len: 1, wid: 1, hgt: 1, clear: 0, pods: 1, noseW: 1, noseLen: 1, fwSpan: 1, fwPlanes: 1, fwChord: 1, rwSpan: 1, rwPlanes: 1, rwH: 1, rwChord: 1, wheelF: 1, wheelR: 1, wheelW: 1, cockH: 1, halo: false, canopy: false, airbox: false, fin: false, snorkel: false };
  const o = { ...base, ...CAT_BASE[v.category], ...(RW_BY_SPOILER[v.shape.spoiler] ?? {}), ...(SPECIAL[v.id] ?? {}) } as Variant;
  // deterministic per-car jitter so no two cars share a silhouette
  o.len *= 0.96 + hash01(v.id, 1) * 0.08; o.hgt *= 0.97 + hash01(v.id, 2) * 0.06; o.noseLen = 0.9 + hash01(v.id, 3) * 0.22; o.fwChord = 0.9 + hash01(v.id, 4) * 0.25;
  o.pods *= 0.95 + hash01(v.id, 5) * 0.1; o.wid *= 0.985 + hash01(v.id, 6) * 0.03;
  if (v.shape.scoop) o.airbox = true;
  return o;
}

export const VEHICLE_MAP: Record<string, VehicleDef> = Object.fromEntries(VEHICLES.map(v => [v.id, v]));

/** Derive handling parameters for a (casual) vehicle. Ranked always uses STANDARD. */
export function paramsFor(id: string | 'standard'): VehicleParams {
  if (id === 'standard') return STANDARD;
  const v = VEHICLE_MAP[id];
  if (!v) return STANDARD;
  const p: VehicleParams = { ...STANDARD };
  for (const k of Object.keys(v.mods) as (keyof VehicleParams)[]) p[k] = p[k] * (v.mods[k] as number);
  p.offroad = v.offroad ?? 0;
  return p;
}

// display ratings: raw handling numbers min-max normalised across the roster (20..100)
{
  const raw = VEHICLES.map(v => {
    const p = paramsFor(v.id);
    const topSpeed = Math.cbrt(p.power / p.cd);
    return {
      accel: 0.6 * p.accel / STANDARD.accel + 0.4 * p.power / STANDARD.power,
      top: topSpeed / Math.cbrt(STANDARD.power / STANDARD.cd),
      grip: (p.mu / STANDARD.mu) * (p.grip / STANDARD.grip) ** 0.5 * (0.85 + 0.15 * p.downforce / STANDARD.downforce),
      brake: (p.brake / STANDARD.brake) * (p.mu / STANDARD.mu),
      air: p.airCtl,
      drift: 2 - p.hbGrip / STANDARD.hbGrip + (p.yaw / STANDARD.yaw - 1) * 0.6,
    };
  });
  (Object.keys(raw[0]) as (keyof Stats)[]).forEach(k => {
    const vals = raw.map(r => r[k]); const lo = Math.min(...vals), hi = Math.max(...vals);
    VEHICLES.forEach((v, i) => { v.stats[k] = Math.round(20 + 80 * ((raw[i][k] - lo) / Math.max(hi - lo, 1e-6))); });
  });
}

export const CATEGORIES: Category[] = ['Street', 'Sport', 'Supercar', 'Hypercar', 'Rally', 'Experimental'];
export const RARITY_ORDER = RAR;
export const RARITY_COLOR: Record<Rarity, string> = {
  common: '#8B93A0', uncommon: '#3DDC84', rare: '#3A8DFF', epic: '#A64DFF', legendary: '#FFC400', mythic: '#E0123C',
};
export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Common', uncommon: 'Uncommon', rare: 'Rare', epic: 'Epic', legendary: 'Legendary', mythic: 'Mythic',
};
