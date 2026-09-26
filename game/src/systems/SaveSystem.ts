import { DEFAULT_CUSTOM_APPEARANCE } from '../data/golfers';
import type { Appearance } from '../data/types';

export interface HoleRecord {
  best: number | null;
  plays: number;
  completed: boolean;
  aces: number;
  lastScore: number | null;
}

export interface TournamentResult {
  date: string;
  golferId: string;
  strokes: number;
  toPar: number;
  holes: { layoutId: string; strokes: number; par: number }[];
}

export interface Settings {
  sfx: number;
  ambience: number;
  quality: 'low' | 'high';
  trajectory: boolean;
  haptics: boolean;
  leftHanded: boolean;
}

export interface SaveData {
  version: number;
  profile: { name: string; createdAt: string; xp: number };
  coins: number;
  currentGolfer: string;
  unlockedGolfers: string[];
  customGolfer: { name: string; appearance: Appearance };
  unlockedCourses: string[];
  holes: Record<string, HoleRecord>;
  tournaments: Record<string, { best: number | null; results: TournamentResult[] }>;
  cosmetics: { owned: string[]; equipped: { ball: string; putter: string; bag: string } };
  settings: Settings;
  lastHole: string | null;
  stats: { shots: number; holesPlayed: number; waterBalls: number; aces: number };
}

const KEY = 'mini-majors.save';
export const SAVE_VERSION = 2;

export function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    profile: { name: 'Player', createdAt: new Date().toISOString(), xp: 0 },
    coins: 300,
    currentGolfer: 'scheffler',
    unlockedGolfers: ['scheffler', 'mcilroy', 'custom'],
    customGolfer: { name: 'You', appearance: { ...DEFAULT_CUSTOM_APPEARANCE } },
    unlockedCourses: ['augusta'],
    holes: {},
    tournaments: {},
    cosmetics: { owned: ['ball-classic', 'putter-blade', 'bag-green'], equipped: { ball: 'ball-classic', putter: 'putter-blade', bag: 'bag-green' } },
    settings: { sfx: 0.8, ambience: 0.6, quality: 'high', trajectory: true, haptics: true, leftHanded: false },
    lastHole: null,
    stats: { shots: 0, holesPlayed: 0, waterBalls: 0, aces: 0 },
  };
}

/** Versioned migrations keep old saves loading forever. */
export function migrate(raw: Record<string, unknown>): SaveData {
  const base = defaultSave();
  const v = (raw.version as number) ?? 1;
  let data = { ...base, ...raw } as SaveData;
  if (v < 2) {
    // v1 had no stats / cosmetics
    data = { ...data, stats: base.stats, cosmetics: base.cosmetics };
  }
  data.settings = { ...base.settings, ...(data.settings ?? {}) };
  data.version = SAVE_VERSION;
  return data;
}

interface StorageLike {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

function storage(): StorageLike | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export class SaveSystem {
  data: SaveData;
  private store: StorageLike | null;

  constructor(store: StorageLike | null = storage()) {
    this.store = store;
    this.data = this.load();
  }

  private load(): SaveData {
    try {
      const raw = this.store?.getItem(KEY);
      if (raw) return migrate(JSON.parse(raw));
    } catch {
      /* corrupted save: start fresh */
    }
    return defaultSave();
  }

  save(): void {
    try {
      this.store?.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* storage full or unavailable: keep playing */
    }
  }

  reset(): void {
    this.data = defaultSave();
    this.save();
  }

  hole(id: string): HoleRecord {
    if (!this.data.holes[id]) this.data.holes[id] = { best: null, plays: 0, completed: false, aces: 0, lastScore: null };
    return this.data.holes[id];
  }
}
