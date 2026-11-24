import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../game/store';
import { campaignSync, loadGhostFile } from '../game/campaign';
import { fmtTime, fmtDelta } from '../sim/replay';
import { Btn, Panel, Tabs, MedalChip, Empty, Icon } from './kit';
import { backendConfigured, fetchBoard, BoardRow, BoardScope } from '../net/backend';
import { seasonId } from '../game/progress';
import { VEHICLE_MAP } from '../data/vehicles';
import { Back } from './Campaign';

/** One track's leaderboard. Local rows are real (your records + calculated benchmark); online rows come from the backend only when configured. */
export function Leaderboard({ trackId }: { trackId: number }) {
  const [scope, setScope] = useState<BoardScope | 'personal'>('personal');
  const meta = campaignSync()!.tracks[trackId - 1].meta; const p = useStore(s => s.profile); const rec = p.records[trackId];
  const [rows, setRows] = useState<BoardRow[] | null>(null); const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    setRows(null); setErr(null);
    if (scope === 'personal') return;
    fetchBoard(trackId, scope, seasonId()).then(r => { setRows(r.rows); if (r.error) setErr(r.error); });
  }, [scope, trackId]);
  const first = rows?.[0]?.ms;
  return (
    <div className="lb">
      <Tabs value={scope} onChange={setScope as any} tabs={[{ id: 'personal', label: 'Personal' }, { id: 'global', label: 'Global' }, { id: 'friends', label: 'Friends' }, { id: 'regional', label: 'Regional' }, { id: 'seasonal', label: 'Seasonal' }, { id: 'daily', label: 'Daily' }]} />
      {scope === 'personal' ? (
        <table className="tbl">
          <thead><tr><th>#</th><th>Entry</th><th>Time</th><th>Source</th><th>Δ vs first</th></tr></thead>
          <tbody>
            {[
              { n: 'Simulated benchmark', ms: meta.bench.ms, src: 'Calculated by the automated driver (standard car). Not a human record.' },
              { n: `${p.name} (you)`, ms: rec?.bestMs, src: 'Local personal best' },
              { n: 'Platinum target', ms: meta.medals.platinum, src: 'Medal target' }, { n: 'Gold target', ms: meta.medals.gold, src: 'Medal target' },
              { n: 'Silver target', ms: meta.medals.silver, src: 'Medal target' }, { n: 'Bronze target', ms: meta.medals.bronze, src: 'Medal target' },
            ].filter(r => r.ms).sort((a, b) => a.ms! - b.ms!).map((r, i, arr) => (
              <tr key={r.n} className={r.n.includes('(you)') ? 'me' : ''}><td>{i + 1}</td><td>{r.n}</td><td className="mono">{fmtTime(r.ms)}</td><td className="muted">{r.src}</td><td className="mono">{i === 0 ? '—' : fmtDelta(r.ms! - arr[0].ms!)}</td></tr>
            ))}
          </tbody>
        </table>
      ) : !backendConfigured ? (
        <Empty><Icon name="globe" size={28} /><b>Online leaderboards are not connected.</b><span>No online records are shown because no backend is configured, and none are invented. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see docs/BACKEND.md) to enable verified global boards.</span></Empty>
      ) : rows === null ? <Empty>Loading…</Empty> : err ? <Empty>Could not load board: {err}</Empty> : rows.length === 0 ? <Empty>No verified records yet. Be the first.</Empty> : (
        <table className="tbl">
          <thead><tr><th>Rank</th><th>Player</th><th>Time</th><th>Vehicle</th><th>Date</th><th>Replay</th><th>Δ</th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.rank}><td>{r.rank}</td><td>{r.username}</td><td className="mono">{fmtTime(r.ms)}</td><td>{VEHICLE_MAP[r.vehicle]?.name ?? 'Standard'}</td><td>{new Date(r.date).toLocaleDateString()}</td><td>{r.hasReplay ? 'Yes' : '—'}</td><td className="mono">{r.rank === 1 ? '—' : fmtDelta(r.ms - first!)}</td></tr>)}</tbody>
        </table>
      )}
    </div>
  );
}

export function LeaderboardsScreen() {
  const [id, setId] = useState(1); const camp = campaignSync()!; const p = useStore(s => s.profile);
  const sorted = useMemo(() => Object.entries(p.records).sort((a, b) => (b[1].lastPlayed ?? 0) - (a[1].lastPlayed ?? 0)).map(([k]) => +k), [p.records]);
  return (
    <div className="screen split">
      <Back title="Leaderboards" />
      <Panel title="Track" className="lb-side" pad={false}>
        <div className="scroll"><ul className="picklist">
          {(sorted.length ? sorted : []).slice(0, 8).map(t => <li key={'r' + t} className={t === id ? 'on' : ''} onClick={() => setId(t)}><b>{String(t).padStart(3, '0')}</b>{camp.tracks[t - 1].name}</li>)}
          {camp.tracks.map(t => <li key={t.id} className={t.id === id ? 'on' : ''} onClick={() => setId(t.id)}><b>{String(t.id).padStart(3, '0')}</b>{t.name}<MedalChip medal={p.records[t.id]?.medal ?? 0} size={14} /></li>)}
        </ul></div>
      </Panel>
      <Panel title={`#${String(id).padStart(3, '0')} ${camp.tracks[id - 1].name}`} right={<Btn small onClick={() => useStore.getState().startRace({ mode: 'timetrial', trackId: id })} icon="play">Race</Btn>}>
        <Leaderboard trackId={id} />
      </Panel>
    </div>
  );
}
