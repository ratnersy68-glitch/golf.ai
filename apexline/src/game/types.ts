export type FinishId = string;

export interface LiveryLayer {
  id: string;
  type: 'rect' | 'ellipse' | 'tri' | 'stripe' | 'text' | 'ngon' | 'line';
  x: number; y: number; w: number; h: number; // 0..1 canvas-space (x along car, y around)
  rot: number; // degrees
  color: string; alpha: number;
  text?: string; sides?: number; mirror?: boolean; hidden?: boolean;
}

export interface CarSetup {
  vehicle: string;
  paint: { primary: string; secondary: string; accent: string; finish: string }; // finish = cosmetic id
  wheel: { design: string; color: string; tire: string; caliper: string }; // cosmetic ids
  body: { spoiler: string; splitter: string; skirt: string; diffuser: string; hood: string; scoop: string; widebody: string; exhaust: string; fbumper: string; rbumper: string };
  lights: { head: string; tail: string; underglow: string; pattern: string };
  livery: { preset: string; layers: LiveryLayer[]; useBase: boolean };
  fx: { trail: string; flame: string; smoke: string; finish: string; spawn: string; victory: string };
  plate: { text: string; style: string };
  number: number;
}

export interface TrackRecord {
  bestMs: number; // personal best
  medal: number; // 0 none, 1 bronze, 2 silver, 3 gold, 4 platinum, 5 apex
  runs: number; finishes: number;
  lastMs?: number; lastPlayed?: number;
  beatBench?: boolean;
  runsToday?: number; runsDay?: string;
  firstPaid?: number; // highest medal already paid out as a first-time bonus
}

export interface Settings {
  preset: 'potato' | 'low' | 'medium' | 'high' | 'ultra' | 'cinematic';
  resScale: number; shadows: number; reflections: number; particles: number; drawDistance: number; fpsLimit: number;
  bloom: boolean; motionBlur: boolean; ssao: boolean; antialias: boolean;
  reducedMotion: boolean; cameraShake: number; colorblind: 'off' | 'deuter' | 'protan' | 'tritan'; units: 'kmh' | 'mph';
  vol: { master: number; music: number; engine: number; env: number; ui: number };
  keys: Record<string, string[]>;
  deadzone: number; steerSens: number; vibration: boolean; touchScale: number; touchOpacity: number; touchLeft: boolean;
  hud: { speed: boolean; minimap: boolean; delta: boolean; progress: boolean; keys: boolean; scale: number };
  camera: number; ghost: boolean; instantRestart: boolean; showFps: boolean; ghostKind: string;
}

export interface Challenge {
  id: string; kind: string; desc: string; target: number; progress: number; reward: { credits?: number; tokens?: number; xp?: number }; done: boolean; claimed: boolean;
  env?: string; tier?: number;
}

export interface RankedState {
  placements: number; // runs completed (0..5)
  perf: { id: number; v: number; w: number; day: string }[]; // recent performance ratings
  rating: number; peak: number;
  history: { t: number; rating: number; id: number; ms: number }[];
  weekRuns: Record<string, number>; // `${week}:${trackId}` -> best ms
  season: string;
}

export interface Profile {
  name: string; title: string; avatar: string; banner: string; plateText: string;
  credits: number; tokens: number; xp: number; level: number; prestige: number;
  owned: string[]; // cosmetic ids
  vehicles: string[]; // owned vehicles
  setups: Record<string, CarSetup>;
  selected: string; // selected vehicle
  presets: { id: string; name: string; setup: CarSetup }[];
  records: Record<number, TrackRecord>;
  favorites: number[]; wishlist: string[];
  stats: Stats;
  ach: Record<string, { at: number; seen: boolean }>;
  achProgress: Record<string, number>;
  daily: { day: string; list: Challenge[]; streak: number };
  weekly: { week: string; list: Challenge[]; champ: Record<number, number>; champDone: boolean };
  ranked: RankedState;
  customTracks: CustomTrackSave[];
  claimedLevels: number[];
  unlockedChapter: number[]; // informational
  seenIntro: boolean;
  rewardsClaimed: Record<string, boolean>;
  cloud?: { userId: string };
  lastRun?: { trackId: number; ms: number; at: number };
}

export interface Stats {
  races: number; finishes: number; driveMs: number; distanceM: number; topMps: number; longestJump: number; crashes: number; restarts: number;
  pbs: number; wr: number; benchmarks: number; creditsEarned: number; ghostWins: number; dailyDone: number; weeklyDone: number; purchases: number;
  airMs: number; platinum: number; apex: number; gold: number; silver: number; bronze: number;
  vehicleTime: Record<string, number>; envTime: Record<string, number>; milliWins: number; endless: number; stuntBest: number; published: number; ranks: number;
  cleanRuns: number; creditsSpent: number;
}

export interface CustomTrackSave { id: string; name: string; created: number; updated: number; pieces: any[]; env: string; obstacles?: any[]; author: string; bestMs?: number; plays?: number; verified?: boolean; replay?: any }

export interface SaveFile { version: number; profile: Profile; settings: Settings; savedAt: number }
