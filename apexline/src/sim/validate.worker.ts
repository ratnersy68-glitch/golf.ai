/// <reference lib="webworker" />
import { buildTrack, TrackDef } from './track';
import { validateGeometry } from './trackgen';
import { optimise } from './driver';
import { STANDARD } from './vehicle';
import { packReplay, validateReplay } from './replay';

/** Editor validation: geometry checks + an automated-driver completion attempt, off the main thread. */
self.onmessage = (e: MessageEvent<{ def: TrackDef; budget?: number }>) => {
  const def = e.data.def;
  try {
    const geo = validateGeometry(def);
    if (!geo.ok && geo.reason !== 'repetitive piece runs' && geo.reason !== 'too little variety') { (self as any).postMessage({ geo, done: true, finished: false, reason: geo.reason }); return; }
    const tr = buildTrack(def);
    if (!def.pieces.length || def.pieces[def.pieces.length - 1].k !== 'finish') { (self as any).postMessage({ geo, done: true, finished: false, reason: 'track must end with a finish piece' }); return; }
    const r = optimise(tr, STANDARD, { budget: e.data.budget ?? 400, seed: 12345 });
    let replayOk = false; let ms = 0;
    if (r.best.finished && r.best.log) { const rep = packReplay(r.best.log, 0, 'standard', r.best.ms); replayOk = validateReplay(tr, rep).ok; ms = r.best.ms; }
    (self as any).postMessage({ geo, done: true, finished: r.best.finished && r.best.respawns === 0, ms, crashes: r.best.crashes, respawns: r.best.respawns, evals: r.evals, replayOk, lengthM: Math.round(tr.lengthM), progress: r.best.progress, reason: r.best.finished ? undefined : `driver reached ${(r.best.progress * 100).toFixed(0)}% of the track` });
  } catch (err: any) { (self as any).postMessage({ done: true, finished: false, reason: String(err?.message ?? err) }); }
};
