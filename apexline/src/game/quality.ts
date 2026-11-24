import type { Settings } from './types';

/** Distances (metres) for the five render-distance steps. */
export const DRAW_DISTANCES = [450, 700, 1000, 1500, 2400];
export const FPS_LIMITS = [30, 60, 120, 144, 165, 240, 0]; // 0 = unlimited

export interface Quality {
  tier: 0 | 1 | 2; // material tier: 0 Lambert (cheapest), 1 Standard, 2 Physical clearcoat (car paint)
  far: number; lodDist: number; propFar: number; propDensity: number; chunkSize: number; terrain: boolean; terrainStep: number; texSize: number; aniso: number; carDetail: number;
}

/** Derives all world / asset level-of-detail knobs from the player's settings. */
export function qualityFor(s: Settings): Quality {
  const dd = Math.max(0, Math.min(4, s.drawDistance));
  const tier: 0 | 1 | 2 = s.reflections === 0 && s.shadows <= 1 ? 0 : s.reflections <= 1 && s.shadows <= 1 ? 1 : 2;
  const far = DRAW_DISTANCES[dd];
  return {
    tier, far, lodDist: [90, 120, 160, 220, 300][dd], propFar: far * 0.7, propDensity: [0.18, 0.4, 0.7, 1, 1.35][dd], chunkSize: 40,
    terrain: true, terrainStep: dd === 0 ? 3 : dd === 1 ? 2 : 1, texSize: dd <= 1 ? 128 : 256, aniso: tier === 0 ? 1 : tier === 1 ? 4 : 8, carDetail: tier,
  };
}
