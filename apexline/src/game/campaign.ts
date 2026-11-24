import type { CampaignFile, CampaignTrack, TrackMeta } from '../sim/campaign-types';
import type { ReplayMeta } from '../sim/replay';
import { buildTrack, Track, TrackDef } from '../sim/track';
import { generateEndless, freeDriveTrack, describeTrack } from '../sim/trackgen';
import { medalFor } from './progress';

const BASE = import.meta.env.BASE_URL;
let file: CampaignFile | null = null;
let loading: Promise<CampaignFile> | null = null;
const trackCache = new Map<number, Track>();

export async function loadCampaign(): Promise<CampaignFile> {
  if (file) return file;
  const inline = (window as any).__APEX_CAMPAIGN as CampaignFile | undefined; // single-file build embeds the campaign
  if (inline) { file = inline; return file; }
  loading ??= fetch(`${BASE}data/campaign.json`).then(r => { if (!r.ok) throw new Error('campaign.json missing - run npm run campaign:build'); return r.json(); }).then((f: CampaignFile) => { file = f; return f; });
  return loading;
}
export function campaignSync(): CampaignFile | null { return file; }
export function trackMeta(id: number): TrackMeta | undefined { return file?.tracks[id - 1]?.meta; }
export function trackDef(id: number): CampaignTrack | undefined { return file?.tracks[id - 1]; }
/** Built tracks are cached in a small LRU (only the current track + a few recents stay in memory; the other ~270 are rebuilt on demand in a few ms). */
const TRACK_LRU = 6;
export function getTrack(id: number): Track {
  let t = trackCache.get(id);
  if (t) { trackCache.delete(id); trackCache.set(id, t); return t; } // refresh recency
  t = buildTrack(file!.tracks[id - 1]); trackCache.set(id, t);
  while (trackCache.size > TRACK_LRU) trackCache.delete(trackCache.keys().next().value as number);
  return t;
}

export interface GhostFile { bench: ReplayMeta; ghosts?: Partial<Record<'platinum' | 'gold' | 'silver' | 'bronze', ReplayMeta>> }
const ghostCache = new Map<number, GhostFile>();
export async function loadGhostFile(id: number): Promise<GhostFile | null> {
  if (ghostCache.has(id)) return ghostCache.get(id)!;
  try { const r = await fetch(`${BASE}data/replays/${String(id).padStart(3, '0')}.json`); if (!r.ok) return null; let j = await r.json(); if (j.data) j = { bench: j }; ghostCache.set(id, j); while (ghostCache.size > 8) ghostCache.delete(ghostCache.keys().next().value as number); return j; } catch { return null; }
}

/** Synthetic meta for modes that are not part of the campaign (no medals, benchmarks or records). */
export function syntheticMeta(def: TrackDef, tr: Track, name: string): TrackMeta {
  const ms = Math.round(tr.lengthM / 40 * 1000);
  return {
    id: def.id, name, chapter: def.chapter, env: def.env, description: describeTrack(def), features: [], lengthM: Math.round(tr.lengthM), checkpoints: tr.cps.length, difficulty: 5, estimatedSec: Math.round(ms / 1000),
    medals: { apex: ms, platinum: ms, gold: ms, silver: ms, bronze: ms }, bench: { ms, peakKmh: 0, floorMs: ms, passes: 0, evaluations: 0, replayVerified: false, clean: true },
    validation: { geometry: true, completion: true, replay: true, attempts: 0, issues: [] },
  };
}
export function endlessTrack(seed: number): { def: TrackDef; track: Track; meta: TrackMeta } { const def = generateEndless(seed); const track = buildTrack(def); return { def, track, meta: syntheticMeta(def, track, 'Endless Road') }; }
export function freeTrack(): { def: TrackDef; track: Track; meta: TrackMeta } { const def = freeDriveTrack(); const track = buildTrack(def); return { def, track, meta: syntheticMeta(def, track, 'Proving Ground') }; }

export { medalFor };

/** Deterministic daily / weekly selections (everyone gets the same ones for the same date). */
export function dailyTrackId(day: string): number { let h = 0; for (const c of day) h = (h * 31 + c.charCodeAt(0)) >>> 0; return 1 + (h % 275); }
export function weeklyTrackIds(week: string): number[] { let h = 7; for (const c of week) h = (h * 33 + c.charCodeAt(0)) >>> 0; const out: number[] = []; let x = h; while (out.length < 5) { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; const id = 1 + (x % 275); if (!out.includes(id)) out.push(id); } return out; }
