/** Live performance counters (written by the race loop, read by the overlay and the profiling harness). Plain object: no React involved. */
export interface PerfStats {
  fps: number; frameMs: number; frameMax: number; simMs: number; renderMs: number; jsMs: number; calls: number; tris: number; geos: number; textures: number; heapMB: number;
  resScale: number; worldBuildMs: number; enterMs: number; restartMs: number; frames: number; longFrames: number; chunksVisible: number; chunksTotal: number; lod: string;
}
export const perf: PerfStats = { fps: 0, frameMs: 0, frameMax: 0, simMs: 0, renderMs: 0, jsMs: 0, calls: 0, tris: 0, geos: 0, textures: 0, heapMB: 0, resScale: 1, worldBuildMs: 0, enterMs: 0, restartMs: 0, frames: 0, longFrames: 0, chunksVisible: 0, chunksTotal: 0, lod: '' };
export const now = (): number => performance.now();
export function heapMB(): number { const m = (performance as any).memory; return m ? m.usedJSHeapSize / 1048576 : 0; }
