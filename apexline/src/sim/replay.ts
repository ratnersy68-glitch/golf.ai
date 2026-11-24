import { Sim, Input, VehicleParams, STANDARD, TICK_RATE } from './vehicle';
import { Track } from './track';

/**
 * Replays are nothing but the quantised input stream. Because the simulation is deterministic
 * (fixed 120 Hz step, engine-independent trig), re-running the inputs reproduces the exact run.
 * That is also how a server validates a submitted time: it re-simulates, it never trusts the claimed time.
 */
export interface QInput { steer: number; thr: number; brk: number; hb: number } // ints: steer -100..100, thr/brk 0..100, hb 0/1

export const toInput = (q: QInput): Input => ({ steer: q.steer / 100, thr: q.thr / 100, brk: q.brk / 100, hb: q.hb });
export const quantise = (i: Input): QInput => ({
  steer: Math.max(-100, Math.min(100, Math.round(i.steer * 100))),
  thr: Math.max(0, Math.min(100, Math.round(i.thr * 100))),
  brk: Math.max(0, Math.min(100, Math.round(i.brk * 100))),
  hb: i.hb & 3,
});

export class InputLog {
  steer: number[] = []; thr: number[] = []; brk: number[] = []; hb: number[] = [];
  push(q: QInput): void { this.steer.push(q.steer); this.thr.push(q.thr); this.brk.push(q.brk); this.hb.push(q.hb); }
  get length(): number { return this.steer.length; }
  at(i: number): QInput { return { steer: this.steer[i], thr: this.thr[i], brk: this.brk[i], hb: this.hb[i] }; }
}

export interface ReplayMeta {
  v: 1;
  trackId: number;
  vehicle: string; // 'standard' for ranked
  ticks: number;
  ms: number; // claimed finish time (verified on replay)
  rate: number;
  data: string; // RLE channels, base64
}

function rle(vals: number[], bias: number): number[] {
  const out: number[] = [];
  let i = 0;
  while (i < vals.length) {
    let j = i;
    while (j < vals.length && vals[j] === vals[i] && j - i < 255) j++;
    out.push(vals[i] + bias, j - i);
    i = j;
  }
  return out;
}
function unrle(bytes: Uint8Array, pos: number, count: number, bias: number): { vals: number[]; pos: number } {
  const vals: number[] = [];
  const n = (bytes[pos] | (bytes[pos + 1] << 8) | (bytes[pos + 2] << 16) | (bytes[pos + 3] << 24)) >>> 0;
  pos += 4;
  const end = pos + n;
  while (pos < end) { const v = bytes[pos] - bias; const c = bytes[pos + 1]; for (let k = 0; k < c; k++) vals.push(v); pos += 2; }
  return { vals, pos };
}
function b64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64');
  let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s);
}
function unb64(s: string): Uint8Array {
  if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(s, 'base64'));
  const bin = atob(s); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out;
}

export function packReplay(log: InputLog, trackId: number, vehicle: string, ms: number): ReplayMeta {
  const chans = [rle(log.steer, 128), rle(log.thr, 0), rle(log.brk, 0), rle(log.hb, 0)];
  let total = 0; for (const c of chans) total += c.length + 4;
  const bytes = new Uint8Array(total);
  let p = 0;
  for (const c of chans) {
    bytes[p++] = c.length & 255; bytes[p++] = (c.length >> 8) & 255; bytes[p++] = (c.length >> 16) & 255; bytes[p++] = (c.length >>> 24) & 255;
    for (const v of c) bytes[p++] = v;
  }
  return { v: 1, trackId, vehicle, ticks: log.length, ms, rate: TICK_RATE, data: b64(bytes) };
}

export function unpackReplay(r: ReplayMeta): InputLog {
  const bytes = unb64(r.data);
  const log = new InputLog();
  let pos = 0;
  const a = unrle(bytes, pos, r.ticks, 128); pos = a.pos;
  const b = unrle(bytes, pos, r.ticks, 0); pos = b.pos;
  const c = unrle(bytes, pos, r.ticks, 0); pos = c.pos;
  const d = unrle(bytes, pos, r.ticks, 0);
  for (let i = 0; i < r.ticks; i++) log.push({ steer: a.vals[i], thr: b.vals[i], brk: c.vals[i], hb: d.vals[i] });
  return log;
}

export interface RunResult { finished: boolean; ms: number; ticks: number; crashes: number; respawns: number; cpOK: boolean; topSpeed: number }

/** Re-simulate an input log from scratch. Used for ghosts, validation and replay viewing. */
export function runLog(track: Track, log: InputLog, params: VehicleParams = STANDARD, maxTicks = 120 * 60 * 6): RunResult {
  const sim = new Sim(track, params);
  const n = Math.min(log.length, maxTicks);
  for (let i = 0; i < n && !sim.finished; i++) sim.step(toInput(log.at(i)));
  return { finished: sim.finished, ms: sim.finishMs, ticks: sim.tick, crashes: sim.crashes, respawns: sim.respawns, cpOK: sim.cp >= track.cps.length, topSpeed: sim.topSpeed };
}

export interface Validation { ok: boolean; reason?: string; ms?: number }
/** Server-style validation: claimed time must equal re-simulated time, with every checkpoint passed in order. */
export function validateReplay(track: Track, r: ReplayMeta, params: VehicleParams = STANDARD): Validation {
  if (r.v !== 1) return { ok: false, reason: 'unknown replay version' };
  if (r.rate !== TICK_RATE) return { ok: false, reason: 'tick rate mismatch' };
  if (r.ticks <= 0 || r.ticks > TICK_RATE * 60 * 10) return { ok: false, reason: 'invalid length' };
  let log: InputLog;
  try { log = unpackReplay(r); } catch { return { ok: false, reason: 'corrupt payload' }; }
  if (log.length !== r.ticks) return { ok: false, reason: 'length mismatch' };
  for (let i = 0; i < log.length; i++) {
    const q = log.at(i);
    if (q.steer < -100 || q.steer > 100 || q.thr < 0 || q.thr > 100 || q.brk < 0 || q.brk > 100 || (q.hb < 0 || q.hb > 3 || !Number.isInteger(q.hb))) return { ok: false, reason: 'input out of range' };
  }
  const res = runLog(track, log, params, r.ticks + 2);
  if (!res.finished) return { ok: false, reason: 'did not finish' };
  if (!res.cpOK) return { ok: false, reason: 'checkpoints skipped' };
  if (res.ms !== r.ms) return { ok: false, reason: `time mismatch (claimed ${r.ms}, simulated ${res.ms})`, ms: res.ms };
  return { ok: true, ms: res.ms };
}

export function fmtTime(ms: number | null | undefined): string {
  if (ms == null || !isFinite(ms)) return '--:--.---';
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), r = Math.floor(ms % 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(r).padStart(3, '0')}`;
}
export function fmtDelta(ms: number): string {
  const sgn = ms < 0 ? '-' : '+'; const a = Math.abs(ms);
  return `${sgn}${Math.floor(a / 1000)}.${String(Math.floor(a % 1000)).padStart(3, '0')}`;
}
