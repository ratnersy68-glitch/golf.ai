import React, { useRef, useState } from 'react';
import { useStore } from '../game/store';
import { campaignSync, dailyTrackId, weeklyTrackIds } from '../game/campaign';
import { dayId, weekId } from '../game/progress';
import { fmtTime } from '../sim/replay';
import { Back } from './Campaign';
import { Btn, Icon, MedalChip, Modal, Panel, Tabs } from './kit';
import { TrackThumb } from './trackviz';
import { VEHICLE_MAP } from '../data/vehicles';
import { parseTrackFile } from './Editor';

type Sub = null | 'timetrial' | 'stunt' | 'ghost' | 'weekly' | 'custom';
const LADDER: { kind: string; label: string }[] = [{ kind: 'bronze', label: 'Bronze' }, { kind: 'silver', label: 'Silver' }, { kind: 'gold', label: 'Gold' }, { kind: 'platinum', label: 'Platinum' }, { kind: 'bench', label: 'Simulated benchmark' }];

export function ModesScreen() {
  const st = useStore(); const p = st.profile; const camp = campaignSync()!;
  const [sub, setSub] = useState<Sub>(null); const [pick, setPick] = useState(1); const [std, setStd] = useState(true);
  const day = dayId(), week = weekId(); const did = dailyTrackId(day); const wids = weeklyTrackIds(week);
  const fileRef = useRef<HTMLInputElement>(null);
  const veh = VEHICLE_MAP[p.selected];
  const modes: { id: string; name: string; tag: string; desc: string; action: () => void }[] = [
    { id: 'tt', name: 'Time Trial', tag: 'UNLIMITED ATTEMPTS', desc: 'Pick any track and chase your personal best with ghosts and live deltas. Toggle standardised physics (counts for records) or your own car class (casual).', action: () => setSub('timetrial') },
    { id: 'daily', name: 'Daily Track', tag: `RESETS 00:00 UTC`, desc: `Today: #${String(did).padStart(3, '0')} ${camp.tracks[did - 1].name}. Standard car, your best today is tracked locally.`, action: () => st.startRace({ mode: 'daily', trackId: did }) },
    { id: 'weekly', name: 'Weekly Championship', tag: week, desc: 'Five tracks, cumulative score against the simulated benchmark. Complete all five for a big payout.', action: () => setSub('weekly') },
    { id: 'endless', name: 'Endless Road', tag: 'PROCEDURAL', desc: 'A generated road that gets harder every kilometre. Three crashes or one fall ends the run. Distance pays credits.', action: () => st.startRace({ mode: 'endless', trackId: 0, seed: Math.floor(Math.random() * 99999) }) },
    { id: 'free', name: 'Free Drive', tag: 'OPEN DECK', desc: 'A huge no-wall proving ground with ramps, banks, boost lanes and hills. Test your cars and cosmetics. No timer.', action: () => st.startRace({ mode: 'freedrive', trackId: 0 }) },
    { id: 'stunt', name: 'Stunt Mode', tag: '90 SECONDS', desc: 'Score for air time, flips, drifts and clean landings on any track. Your selected car’s handling applies.', action: () => setSub('stunt') },
    { id: 'ghost', name: 'Ghost Challenge', tag: 'LADDER', desc: 'Beat a recorded ghost at each tier — Bronze, Silver, Gold, Platinum, then the simulated benchmark.', action: () => setSub('ghost') },
    { id: 'custom', name: 'Custom Tracks', tag: `${p.customTracks.length} SAVED`, desc: 'Race tracks you built in the editor or imported from a .apxtrack file.', action: () => setSub('custom') },
  ];
  const TrackPick = ({ children }: { children?: React.ReactNode }) => (
    <Modal title="Choose a track" onClose={() => setSub(null)} wide>
      <div className="col"><div className="row"><select value={pick} onChange={e => setPick(+e.target.value)} aria-label="Track">{camp.tracks.map(t => <option key={t.id} value={t.id}>{String(t.id).padStart(3, '0')} · {t.name}</option>)}</select>
        <input type="number" min={1} max={275} value={pick} onChange={e => setPick(Math.max(1, Math.min(275, +e.target.value | 0)))} style={{ width: 80 }} aria-label="Track number" /></div>
        <div className="row" style={{ alignItems: 'flex-start' }}><div style={{ width: 280 }}><TrackThumb id={pick} w={280} h={140} /></div><div className="col grow">{children}</div></div></div>
    </Modal>
  );
  return (
    <div className="screen">
      <Back title="Play Modes" />
      <div className="modes">{modes.map(m => <div className="mode" key={m.id}><small>{m.tag}</small><h3>{m.name}</h3><p>{m.desc}</p><Btn kind="primary" icon="play" onClick={m.action}>Open</Btn></div>)}</div>
      {sub === 'timetrial' && <TrackPick>
        <label className="row"><input type="checkbox" checked={std} onChange={e => setStd(e.target.checked)} /> Standardised physics (record-legal). Off = {veh?.name} class handling (casual, separate).</label>
        <p className="muted">Personal best {fmtTime(p.records[pick]?.bestMs)} <MedalChip medal={p.records[pick]?.medal ?? 0} size={16} /></p>
        <Btn kind="primary" icon="play" onClick={() => st.startRace({ mode: 'timetrial', trackId: pick, practice: !std })}>Start</Btn></TrackPick>}
      {sub === 'stunt' && <TrackPick><p className="muted">Best stunt score: {p.stats.stuntBest.toLocaleString()}. Uses {veh?.name} handling.</p><Btn kind="primary" icon="play" onClick={() => st.startRace({ mode: 'stunt', trackId: pick, practice: true })}>Start stunt run</Btn></TrackPick>}
      {sub === 'ghost' && <TrackPick>
        <ul className="seq">{LADDER.map((l, i) => { const done = p.rewardsClaimed[`ghost:${pick}:${l.kind}`]; const prevDone = i === 0 || p.rewardsClaimed[`ghost:${pick}:${LADDER[i - 1].kind}`]; return (
          <li key={l.kind}><Icon name={done ? 'check' : prevDone ? 'ghost' : 'lock'} size={14} /><b>{l.label} ghost</b><em>{done ? 'beaten' : prevDone ? 'next' : 'locked'}</em>
            <Btn small kind={prevDone && !done ? 'primary' : 'default'} disabled={!prevDone} onClick={() => st.startRace({ mode: 'ghost', trackId: pick, ghost: l.kind })}>Race</Btn></li>); })}</ul></TrackPick>}
      {sub === 'weekly' && (
        <Modal title={`Weekly Championship — ${week}`} onClose={() => setSub(null)} wide>
          <div className="col">{wids.map(id => { const t = camp.tracks[id - 1]; const best = p.weekly.champ[id]; const pts = best ? Math.max(0, Math.round(1000 * Math.min(1.02, t.meta.bench.ms / best))) : 0; return (
            <div className="row" key={id} style={{ justifyContent: 'space-between' }}><span><b>#{String(id).padStart(3, '0')}</b> {t.name}</span><span className="mono">{fmtTime(best)}</span><span className="mono">{pts} pts</span><Btn small icon="play" onClick={() => st.startRace({ mode: 'weekly', trackId: id })}>Race</Btn></div>); })}
            <p><b>Total: {wids.reduce((a, id) => { const b = p.weekly.champ[id]; return a + (b ? Math.max(0, Math.round(1000 * Math.min(1.02, camp.tracks[id - 1].meta.bench.ms / b))) : 0); }, 0)} / 5000</b> {p.weekly.champDone && <span className="good">Championship complete</span>}</p></div>
        </Modal>)}
      {sub === 'custom' && (
        <Modal title="Custom tracks" onClose={() => setSub(null)} wide>
          <div className="col">
            <div className="row"><Btn icon="edit" onClick={() => st.go('editor')}>Open editor</Btn><Btn icon="up" onClick={() => fileRef.current?.click()}>Import .apxtrack</Btn>
              <input ref={fileRef} type="file" accept=".apxtrack,.json,application/json" hidden onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const t = parseTrackFile(await f.text()); if (t) st.patchProfile(q => { q.customTracks.push(t); }); else st.toast({ kind: 'error', title: 'Invalid track file' }); }} /></div>
            {p.customTracks.length === 0 && <p className="muted">No custom tracks yet.</p>}
            {p.customTracks.map(c => <div className="row" key={c.id} style={{ justifyContent: 'space-between' }}><b>{c.name}</b><span className="muted">{c.env} · {c.pieces.length} pieces {c.verified ? '· validated' : '· unvalidated'}</span><span className="mono">{fmtTime(c.bestMs)}</span><Btn small icon="play" onClick={() => st.startRace({ mode: 'custom', trackId: 0, customId: c.id, practice: true })}>Race</Btn></div>)}
            <p className="muted" style={{ fontSize: 12 }}>Community publishing and discovery (most played, top rated, trending) need the online backend — not available offline.</p>
          </div>
        </Modal>)}
    </div>
  );
}
