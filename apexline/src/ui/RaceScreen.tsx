import React, { useEffect, useRef, useState } from 'react';
import { useStore, RaceSpec } from '../game/store';
import { useHud, RaceSession, GhostSrc, FinishInfo, RaceInit } from '../game/race';
import { getGfx } from '../game/host';
import { input } from './runtime';
import { getTrack, trackMeta, endlessTrack, freeTrack, loadGhostFile, dailyTrackId, syntheticMeta, campaignSync } from '../game/campaign';
import { unpackReplay, fmtTime, fmtDelta, InputLog, ReplayMeta } from '../sim/replay';
import { loadReplay, saveReplay } from '../game/store';
import { buildTrack, Track } from '../sim/track';
import type { TrackMeta } from '../sim/campaign-types';
import { MEDAL_NAMES, defaultSetup, sanitiseSetup, MEDAL_COLORS } from '../game/progress';
import { Btn, Icon, MedalChip, Modal, Slider, Currency } from './kit';
import { audio } from '../audio/audio';
import { VEHICLE_MAP, paramsFor } from '../data/vehicles';
import { STANDARD } from '../sim/vehicle';
import { Leaderboard } from './Leaderboards';
import type { RaceOutcome } from '../game/store';

const STANDARD_MODES = new Set(['campaign', 'ranked', 'daily', 'weekly', 'ghost']);

export function RaceScreen({ replay }: { replay?: { trackId: number; log: InputLog; ms: number; vehicle: string; label: string; compare?: string } }) {
  const spec = useStore(s => s.race)!;
  const store = useStore();
  const settings = useStore(s => s.settings);
  const profile = useStore(s => s.profile);
  const [sess, setSess] = useState<RaceSession | null>(null);
  const [result, setResult] = useState<{ info: FinishInfo; outcome: RaceOutcome | null; meta: TrackMeta } | null>(null);
  const [paused, setPaused] = useState(false);
  const [board, setBoard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<RaceSession | null>(null);
  const metaRef = useRef<TrackMeta | null>(null);

  useEffect(() => {
    let dead = false; let s: RaceSession | null = null;
    (async () => {
      try {
        const st = useStore.getState(); const p = st.profile;
        let track: Track, meta: TrackMeta, standard = STANDARD_MODES.has(spec.mode) || (spec.mode === 'timetrial' && !spec.practice);
        let free = false;
        if (replay) { track = getTrack(replay.trackId); meta = trackMeta(replay.trackId)!; standard = replay.vehicle === 'standard'; }
        else if (spec.mode === 'endless') { const e = endlessTrack(spec.seed ?? (Date.now() % 100000)); track = e.track; meta = e.meta; standard = false; }
        else if (spec.mode === 'freedrive') { const e = freeTrack(); track = e.track; meta = e.meta; standard = false; free = true; }
        else if (spec.mode === 'custom') {
          const c = p.customTracks.find(t => t.id === spec.customId); if (!c) throw new Error('Custom track not found');
          const def = { id: 0, name: c.name, chapter: 0, env: c.env, seed: 1, pieces: c.pieces, obstacles: c.obstacles }; track = buildTrack(def); meta = syntheticMeta(def, track, c.name); standard = false;
        } else { track = getTrack(spec.trackId); meta = trackMeta(spec.trackId)!; }
        metaRef.current = meta;
        const vehicle = replay ? replay.vehicle : (!standard ? p.selected : p.selected);
        const setup = sanitiseSetup(p, p.setups[p.selected] ?? defaultSetup(p.selected));
        const ghosts: GhostSrc[] = [];
        const campaign = !free && spec.mode !== 'endless' && spec.mode !== 'custom';
        if (campaign) {
          const pb = await loadReplay<ReplayMeta>(`pb:${meta.id}`); if (pb) ghosts.push({ kind: 'pb', label: 'Personal Best', log: unpackReplay(pb), ms: pb.ms });
          ghosts.push({ kind: 'prev', label: 'Previous Attempt', log: new InputLog(), ms: 0 });
          const gf = await loadGhostFile(meta.id);
          if (gf) {
            for (const [k, label] of [['bronze', 'Bronze Ghost'], ['silver', 'Silver Ghost'], ['gold', 'Gold Ghost'], ['platinum', 'Platinum Ghost']] as const) { const g = gf.ghosts?.[k]; if (g) ghosts.push({ kind: k, label, log: unpackReplay(g), ms: g.ms }); }
            ghosts.push({ kind: 'bench', label: 'Simulated Benchmark', log: unpackReplay(gf.bench), ms: gf.bench.ms });
          }
        }
        if (dead) return;
        const kind = spec.ghost ?? (ghosts.find(g => g.kind === settings.ghostKind)?.kind ?? (ghosts.find(g => g.kind === 'pb') ? 'pb' : 'bench'));
        const pbMs = campaign ? (p.records[meta.id]?.bestMs ?? null) : null;
        const init: RaceInit = {
          gfx: getGfx(), input, settings: st.settings, spec, track, meta, vehicle, standard: replay ? standard : standard, setup, ghosts, ghostKind: replay?.compare ?? kind, pbMs, free,
          replay: replay ? { log: replay.log, ms: replay.ms, params: replay.vehicle === 'standard' ? STANDARD : paramsFor(replay.vehicle), setup, vehicle: replay.vehicle } : undefined,
          onRestart: () => useStore.getState().noteRestart(),
          onPause: (v) => setPaused(v),
          onTab: () => setBoard(b => !b),
          onFinish: (info) => handleFinish(info, meta, standard, spec, vehicle),
        };
        s = new RaceSession(init);
        input.settings = st.settings;
        s.enter();
        ref.current = s; setSess(s); (window as any).__apx = { ...(window as any).__apx, race: s };
      } catch (e: any) { console.error(e); setError(String(e?.message ?? e)); }
    })();
    return () => { dead = true; s?.exit(); ref.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, replay]);

  const handleFinish = async (info: FinishInfo, meta: TrackMeta, standard: boolean, sp: RaceSpec, vehicle: string) => {
    const st = useStore.getState();
    if (sp.mode === 'stunt') { st.patchProfile(p => { p.stats.stuntBest = Math.max(p.stats.stuntBest, info.stunt ?? 0); p.stats.driveMs += info.driveMs; p.stats.distanceM += info.distanceM; p.stats.races++; const c = Math.round((info.stunt ?? 0) / 20); p.credits += c; p.stats.creditsEarned += c; }); setResult({ info, outcome: null, meta }); return; }
    if (sp.mode === 'endless') { st.patchProfile(p => { p.stats.endless = Math.max(p.stats.endless, info.endless ?? 0); p.stats.driveMs += info.driveMs; p.stats.distanceM += info.distanceM; p.stats.races++; const c = Math.round((info.endless ?? 0) / 8); p.credits += c; p.stats.creditsEarned += c; }); setResult({ info, outcome: null, meta }); return; }
    if (sp.mode === 'freedrive') return;
    if (sp.mode === 'custom') {
      st.patchProfile(p => { const c = p.customTracks.find(t => t.id === sp.customId); if (c && info.valid) { c.bestMs = Math.min(c.bestMs ?? Infinity, info.ms); c.plays = (c.plays ?? 0) + 1; } });
      setResult({ info, outcome: null, meta }); return;
    }
    if (!info.valid) { setResult({ info, outcome: null, meta }); return; }
    const practice = !standard || !!sp.practice;
    const prev = st.profile.records[meta.id];
    const outcome = st.finishRace({ spec: { ...sp, practice }, meta, ms: info.ms, crashes: info.crashes, respawns: info.respawns, topMps: info.topMps, distanceM: info.distanceM, longestJump: info.longestJump, airMs: info.airMs, driveMs: info.driveMs, vehicle, standard });
    if (outcome.reward.pb && info.replay && standard && !practice && (!prev || info.ms < prev.bestMs)) saveReplay(`pb:${meta.id}`, info.replay);
    if (outcome.achievements.length) audio.unlock();
    setResult({ info, outcome, meta });
    if (outcome.reward.beatBench) st.toast({ kind: 'achievement', title: 'Benchmark Breaker', body: `You beat the simulated benchmark on ${meta.name}.`, rarity: 'mythic' });
  };

  const leave = () => { useStore.getState().go(replay ? 'campaign' : (useStore.getState().prevScreen === 'race' ? 'menu' : useStore.getState().prevScreen)); };
  const retry = () => { setResult(null); ref.current?.restart(true); };

  if (error) return <div className="center-msg"><Modal title="Cannot start race" onClose={leave}><p>{error}</p><Btn onClick={leave}>Back</Btn></Modal></div>;
  return (
    <div className="race-root">
      {sess && <Hud sess={sess} paused={paused} replay={!!replay} label={replay?.label} />}
      {sess && settings.hud.keys && <KeyDisplay />}
      {sess && !replay && <TouchControls sess={sess} />}
      {paused && sess && <PauseMenu sess={sess} onQuit={leave} />}
      {board && metaRef.current && <Modal title={`Leaderboard — ${metaRef.current.name}`} onClose={() => setBoard(false)} wide><Leaderboard trackId={metaRef.current.id} /></Modal>}
      {result && <Results r={result} spec={spec} onRetry={retry} onLeave={leave} sess={sess!} />}
      {replay && sess && <ReplayBar sess={sess} onExit={leave} />}
    </div>
  );
}

// ------------------------------------------------------------------------------------------------ HUD
function Hud({ sess, paused, replay, label }: { sess: RaceSession; paused: boolean; replay: boolean; label?: string }) {
  const h = useHud();
  const settings = useStore(s => s.settings);
  const hud = settings.hud; const cinematic = h.camera === 'Cinematic' && false;
  const unit = settings.units === 'kmh' ? 'KM/H' : 'MPH';
  const spd = Math.round(h.speed * (settings.units === 'kmh' ? 3.6 : 2.23694));
  const cb = settings.colorblind;
  const good = cb === 'off' ? 'var(--good)' : '#4DA6FF', bad = cb === 'off' ? 'var(--bad)' : '#FF9A1F';
  const hidden = settings.hud.scale === 0;
  if (hidden) return null;
  const mini = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = mini.current; if (!c || !hud.minimap) return; const x = c.getContext('2d')!; const tr = sess.track; const W = c.width, H = c.height;
    x.clearRect(0, 0, W, H);
    const b = sess.miniB; const w = b.maxX - b.minX || 1, hh = b.maxZ - b.minZ || 1; const s = Math.max(w, hh); const pad = 8;
    const P = (px: number, pz: number) => [pad + ((px - b.minX) / s + (1 - w / s) / 2) * (W - pad * 2), pad + ((pz - b.minZ) / s + (1 - hh / s) / 2) * (H - pad * 2)];
    x.strokeStyle = 'rgba(245,247,250,.55)'; x.lineWidth = 3; x.lineJoin = 'round'; x.beginPath();
    for (let i = 0; i < tr.n; i += 3) { const [px, pz] = P(tr.px[i], tr.pz[i]); i ? x.lineTo(px, pz) : x.moveTo(px, pz); } x.stroke();
    x.strokeStyle = '#C6FF00'; x.lineWidth = 1.5; x.beginPath(); for (let i = 0; i < Math.floor(h.progress * tr.n); i += 3) { const [px, pz] = P(tr.px[i], tr.pz[i]); i ? x.lineTo(px, pz) : x.moveTo(px, pz); } x.stroke();
    tr.cps.forEach((ci) => { const [px, pz] = P(tr.px[ci], tr.pz[ci]); x.fillStyle = '#F5F7FA'; x.fillRect(px - 2, pz - 2, 4, 4); });
    if (h.mini) { if (h.mini.gx !== undefined) { x.fillStyle = 'rgba(198,255,0,.5)'; x.beginPath(); x.arc(pad + h.mini.gx * (W - pad * 2), pad + (h.mini.gy ?? 0) * (H - pad * 2), 3.5, 0, 7); x.fill(); } x.fillStyle = '#C6FF00'; x.beginPath(); x.arc(pad + h.mini.x * (W - pad * 2), pad + h.mini.y * (H - pad * 2), 5, 0, 7); x.fill(); x.strokeStyle = '#101216'; x.lineWidth = 2; x.stroke(); }
  });
  const showTimer = !h.free;
  const seg = 24; const lit = Math.round(h.rpm * seg);
  return (
    <div className="hud" style={{ ['--hs' as any]: settings.hud.scale }}>
      {h.phase === 'countdown' && !replay && <div className="countdown" key={h.countdown}>{h.countdown > 0 ? h.countdown : 'GO'}</div>}
      {h.phase === 'racing' && h.timeMs < 900 && !replay && <div className="countdown go">GO</div>}
      {showTimer && (
        <div className="hud-top">
          <div className="timer"><span>{fmtTime(h.timeMs)}</span></div>
          <div className="hud-sub">
            <span>CP {h.cp}/{h.cpTotal}</span>
            {h.pbMs != null && <span className="pbl">PB {fmtTime(h.pbMs)}</span>}
            {h.benchMs != null && <span className="pbl sim">SIM {fmtTime(h.benchMs)}</span>}
          </div>
          {hud.progress && <div className="prog"><i style={{ width: `${h.progress * 100}%` }} /></div>}
        </div>
      )}
      {hud.delta && h.delta != null && (
        <div className="delta" style={{ color: h.delta <= 0 ? good : bad }}>
          <Icon name={h.delta <= 0 ? 'down' : 'up'} size={20} /><b>{fmtDelta(h.delta)}</b><small>{h.deltaLabel}</small>
        </div>
      )}
      {h.split && <div className="split"><span>{h.split.label}</span>{!isNaN(h.split.ms) && <b style={{ color: h.split.ms <= 0 ? good : bad }}>{fmtDelta(h.split.ms)}</b>}</div>}
      {h.message && <div className="hud-msg">{h.message}</div>}
      {h.stunt && <div className="stunt"><small>STUNT SCORE</small><b>{h.stunt.score.toLocaleString()}</b><em>{h.stunt.combo}</em><span>{Math.max(0, 90 - Math.floor(h.timeMs / 1000))}s</span></div>}
      {h.endless && <div className="stunt"><small>DISTANCE</small><b>{h.endless.dist.toLocaleString()} m</b><span>{3 - h.crashes} lives</span></div>}
      {hud.speed && (
        <div className="speedo">
          <div className="rpm">{Array.from({ length: seg }).map((_, i) => <i key={i} className={i < lit ? (i > seg * 0.84 ? 'red on' : 'on') : ''} />)}</div>
          <div className="spd"><b>{spd}</b><small>{unit}</small><em>{h.gear}</em></div>
          <div className="pedals"><i className="g" style={{ height: `${h.thr * 100}%` }} /><i className="r" style={{ height: `${h.brk * 100}%` }} /></div>
        </div>
      )}
      {hud.minimap && <canvas ref={mini} className="minimap" width={180} height={180} />}
      <div className="hud-bl"><span>{h.camera}</span>{h.ghostName && <span className="gtag"><Icon name="ghost" size={13} />{h.ghostName}</span>}{h.respawns > 0 && <span>RESETS {h.respawns}</span>}</div>
      {settings.showFps && <div className="fps">{h.fps} FPS</div>}
      {!replay && h.phase !== 'finished' && <div className="hint">R Restart · Backspace Checkpoint · C Camera · G Ghost · Tab Leaderboard · Esc Pause</div>}
      {replay && <div className="rp-tag">REPLAY · {label}</div>}
    </div>
  );
}

function KeyDisplay() {
  const h = useHud();
  return <div className="keys"><i className={h.thr > 0.1 ? 'on' : ''}>W</i><i className={h.steer > 0.3 ? 'on' : ''}>A</i><i className={h.brk > 0.1 ? 'on' : ''}>S</i><i className={h.steer < -0.3 ? 'on' : ''}>D</i></div>;
}

// ------------------------------------------------------------------------------------------------ touch
function TouchControls({ sess }: { sess: RaceSession }) {
  const settings = useStore(s => s.settings);
  const [on, setOn] = useState(false);
  useEffect(() => { const coarse = window.matchMedia('(pointer: coarse)').matches; setOn(coarse); input.touch.active = coarse; return () => { input.touch.active = false; }; }, []);
  if (!on) return null;
  const hold = (k: 'left' | 'right' | 'gas' | 'brake' | 'hb') => ({
    onPointerDown: (e: React.PointerEvent) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); input.touch[k] = true; },
    onPointerUp: () => { input.touch[k] = false; }, onPointerCancel: () => { input.touch[k] = false; }, onPointerLeave: () => { input.touch[k] = false; },
  });
  const flip = settings.touchLeft;
  return (
    <div className="touch" style={{ opacity: settings.touchOpacity, ['--ts' as any]: settings.touchScale }}>
      <div className={`tgrp ${flip ? 'r' : 'l'}`}><button {...hold('left')} aria-label="Steer left">◀</button><button {...hold('right')} aria-label="Steer right">▶</button></div>
      <div className={`tgrp ${flip ? 'l' : 'r'}`}><button className="gas" {...hold('gas')} aria-label="Accelerate">GAS</button><button {...hold('brake')} aria-label="Brake">BRK</button><button {...hold('hb')} aria-label="Handbrake">HB</button></div>
      <div className="ttop"><button onClick={() => sess.restart(true)}>R</button><button onClick={() => sess.requestRespawn()}>CP</button><button onClick={() => sess.cycleCamera()}>CAM</button><button onClick={() => sess.togglePause()}>II</button></div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------ pause
function PauseMenu({ sess, onQuit }: { sess: RaceSession; onQuit: () => void }) {
  const settings = useStore(s => s.settings); const patch = useStore(s => s.patchSettings);
  return (
    <div className="modal-back">
      <div className="modal pause">
        <header className="panel-h"><h3>Paused</h3></header>
        <div className="modal-b col">
          <Btn kind="primary" onClick={() => sess.resume()} icon="play">Resume</Btn>
          <Btn onClick={() => { sess.resume(); sess.restart(true); }} icon="rewind">Restart Track</Btn>
          <Btn onClick={() => sess.cycleCamera()} icon="eye">Camera: {useHud.getState().camera}</Btn>
          <Btn onClick={() => sess.cycleGhost()} icon="ghost">Cycle Ghost</Btn>
          <Slider label="Master" value={settings.vol.master} min={0} max={1} onChange={v => { patch(s => { s.vol.master = v; }); audio.settings = useStore.getState().settings; audio.applyVolumes(); }} />
          <Slider label="Engine" value={settings.vol.engine} min={0} max={1} onChange={v => { patch(s => { s.vol.engine = v; }); audio.settings = useStore.getState().settings; audio.applyVolumes(); }} />
          <Btn kind="ghost" onClick={onQuit} icon="back">Quit to Menu</Btn>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------ results
function Results({ r, spec, onRetry, onLeave, sess }: { r: { info: FinishInfo; outcome: RaceOutcome | null; meta: TrackMeta }; spec: RaceSpec; onRetry: () => void; onLeave: () => void; sess: RaceSession }) {
  const st = useStore(); const { info, outcome, meta } = r;
  const rec = st.profile.records[meta.id];
  const isScore = spec.mode === 'stunt' || spec.mode === 'endless';
  const medal = outcome?.reward.medal ?? 0;
  const nextId = spec.mode === 'campaign' && meta.id < 275 ? meta.id + 1 : null;
  const watch = () => {
    if (!info.replay) return;
    st.go('replay'); (window as any).__replay = { trackId: meta.id, log: info.log, ms: info.ms, vehicle: info.replay.vehicle, label: 'Latest run' };
    st.patchProfile(() => {});
  };
  return (
    <div className="results">
      <div className="res-card">
        <header>
          <small>{meta.name} · {spec.mode.toUpperCase()}</small>
          {isScore ? <h2>{spec.mode === 'stunt' ? `${(info.stunt ?? 0).toLocaleString()} pts` : `${(info.endless ?? 0).toLocaleString()} m`}</h2>
            : <h2>{info.valid ? fmtTime(info.ms) : 'No valid time'}</h2>}
          {!info.valid && !isScore && spec.mode !== 'custom' && <p className="warn">This run did not produce a valid time (checkpoints missed or validation failed).</p>}
        </header>
        {outcome && (
          <>
            <div className="res-row">
              <div className="res-medal"><MedalChip medal={medal} size={56} /><b style={{ color: MEDAL_COLORS[medal] }}>{MEDAL_NAMES[medal]}</b></div>
              <dl>
                <div><dt>Personal best</dt><dd>{fmtTime(rec?.bestMs)}{outcome.reward.pb && <em className="new">NEW</em>}</dd></div>
                {outcome.reward.pbDelta != null && <div><dt>Improvement</dt><dd className="good">-{(outcome.reward.pbDelta / 1000).toFixed(3)}s</dd></div>}
                <div><dt>vs simulated benchmark</dt><dd className={info.ms <= meta.bench.ms ? 'good' : ''}>{fmtDelta(info.ms - meta.bench.ms)}s</dd></div>
                <div><dt>Gold target</dt><dd>{fmtTime(meta.medals.gold)}</dd></div>
              </dl>
            </div>
            <ul className="rewards">
              {outcome.reward.breakdown.map((b, i) => <li key={i}><span>{b.label}</span><span><Currency credits={b.credits} tokens={b.tokens} />{b.xp ? <em className="xp">+{b.xp} XP</em> : null}</span></li>)}
              <li className="tot"><span>Total</span><span><Currency credits={outcome.reward.credits} tokens={outcome.reward.tokens || undefined} /><em className="xp">+{outcome.reward.xp} XP</em></span></li>
            </ul>
            {outcome.rankedDelta && <p className="rk">Offline ranked rating {outcome.rankedDelta.before} → <b>{outcome.rankedDelta.after}</b></p>}
            {outcome.reward.firstBench && <p className="bb"><Icon name="trophy" /> Benchmark Breaker — you beat the calculated simulation time.</p>}
          </>
        )}
        {isScore && <p className="muted">Credits earned: {Math.round((isScore && spec.mode === 'stunt' ? (info.stunt ?? 0) / 20 : (info.endless ?? 0) / 8))}</p>}
        <footer>
          <Btn kind="primary" onClick={onRetry} icon="rewind">Retry (R)</Btn>
          {nextId && <Btn onClick={() => st.startRace({ mode: 'campaign', trackId: nextId })} icon="play">Next Track</Btn>}
          {info.replay && <Btn onClick={() => { (window as any).__replay = { trackId: meta.id, log: info.log, ms: info.ms, vehicle: info.replay!.vehicle, label: 'Latest run' }; st.go('replay'); }} icon="eye">Watch Replay</Btn>}
          <Btn kind="ghost" onClick={onLeave} icon="back">Exit</Btn>
        </footer>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------ replay controls
function ReplayBar({ sess, onExit }: { sess: RaceSession; onExit: () => void }) {
  const h = useHud(); const rp = h.replay; const [tel, setTel] = useState(true);
  if (!rp) return null;
  const speeds = [0.1, 0.25, 0.5, 1, 2, 4];
  return (
    <div className="rbar">
      <div className="rbar-row">
        <Btn small onClick={() => sess.togglePause()} icon={rp.playing ? 'pause' : 'play'}>{rp.playing ? 'Pause' : 'Play'}</Btn>
        <Btn small onClick={() => { sess.rp!.playing = false; sess.seek(rp.tick - 120); }} icon="rewind">-1s</Btn>
        <Btn small onClick={() => { sess.rp!.playing = false; sess.seek(rp.tick + 120); }} icon="ffwd">+1s</Btn>
        <div className="seg">{speeds.map(s => <button key={s} className={rp.speed === s ? 'on' : ''} onClick={() => sess.setReplaySpeed(s)}>{s}x</button>)}</div>
        <input className="scrub" type="range" min={0} max={rp.total} value={rp.tick} onChange={e => sess.seek(+e.target.value)} aria-label="Scrub replay" />
        <span className="mono">{fmtTime(rp.tick * 1000 / 120)} / {fmtTime(rp.total * 1000 / 120)}</span>
        <Btn small onClick={() => sess.cycleCamera()} icon="eye">{h.camera}</Btn>
        <Btn small onClick={() => sess.cycleGhost()} icon="ghost">Compare</Btn>
        <Btn small onClick={() => setTel(t => !t)}>Telemetry</Btn>
        <Btn small kind="ghost" onClick={onExit} icon="close">Close</Btn>
      </div>
      {tel && (
        <div className="tele">
          <div><small>SPEED</small><b>{Math.round(h.speed * 3.6)}</b></div>
          <div><small>THROTTLE</small><i><b style={{ width: `${h.thr * 100}%` }} /></i></div>
          <div><small>BRAKE</small><i className="r"><b style={{ width: `${h.brk * 100}%` }} /></i></div>
          <div><small>STEER</small><i className="s"><b style={{ left: `${50 - h.steer * 50}%` }} /></i></div>
          <div><small>GEAR</small><b>{h.gear}</b></div>
          <div><small>Δ vs ghost</small><b>{h.delta != null ? fmtDelta(h.delta) : '—'}</b></div>
          <div><small>LOST AT CP</small><b>{h.split && !isNaN(h.split.ms) ? fmtDelta(h.split.ms) : '—'}</b></div>
        </div>
      )}
    </div>
  );
}
