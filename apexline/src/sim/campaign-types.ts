import type { TrackDef } from './track';

export interface Medals { bronze: number; silver: number; gold: number; platinum: number; apex: number }

export interface TrackMeta {
  id: number;
  name: string;
  chapter: number;
  env: string;
  description: string;
  features: string[];
  lengthM: number;
  checkpoints: number;
  difficulty: number; // 1.0 - 10.0
  estimatedSec: number; // typical decent human time (gold-ish)
  medals: Medals; // ms
  bench: {
    ms: number; // fastest validated simulated time on the standard vehicle
    peakKmh: number;
    floorMs: number; // loose heuristic floor: length / peak speed. NOT a proven bound.
    passes: number;
    evaluations: number;
    replayVerified: boolean;
    clean: boolean; // no crashes / respawns
  };
  validation: {
    geometry: boolean;
    completion: boolean;
    replay: boolean;
    attempts: number; // geometry attempts rejected before this one was accepted
    issues: string[];
  };
}

export type CampaignTrack = TrackDef & { meta: TrackMeta };

export interface CampaignFile {
  version: 1;
  generated: string;
  physics: string;
  tracks: CampaignTrack[];
}
