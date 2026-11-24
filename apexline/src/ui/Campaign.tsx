import React, { useMemo, useState } from 'react';
import { useStore } from '../game/store';
import { campaignSync } from '../game/campaign';
import { CHAPTERS_INFO, chapterUnlocked } from '../data/chapters';
import { fmtTime, fmtDelta } from '../sim/replay';
import { Btn, Icon, MedalChip, Panel, Segmented, Modal } from './kit';
import { TrackThumb, TrackPreview3D } from './trackviz';
import { MEDAL_NAMES, MEDAL_COLORS } from '../game/progress';
import { Leaderboard } from './Leaderboards';
import type { CampaignTrack } from '../sim/campaign-types';
import { audio } from '../audio/audio';

export function Back({ title, right }: { title: string; right?: React.ReactNode }) {
  const go = useStore(s => s.go);
  return (
    <header className="screen-top">
      <button className="backbtn" onClick={() => { audio.back(); go('menu'); }}><Icon name="back" /> Menu</button>
      <h1>{title}</h1>
      <div className="grow" />{right}
    </header>
  );
}

export function CampaignScreen() {
  const st = useStore(); const p = st.profile; const camp = campaignSync()!;
  const [chapter, setChapter] = useState(() => { for (let c = 1; c <= 11; c++) { for (let i = 1; i <= 25; i++) if (!p.records[(c - 1) * 25 + i]?.finishes) return c; } return 11; });
  const [sel, setSel] = useState<number>(() => { for (let i = 1; i <= 275; i++) if (!p.records[i]?.finishes) return i; return 1; });
  const [filter, setFilter] = useState<'all' | 'done' | 'todo' | 'fav'>('all');
  const [medalF, setMedalF] = useState<number>(-1); const [diff, setDiff] = useState<'all' | 'easy' | 'mid' | 'hard'>('all');
  const [board, setBoard] = useState(false);
  const medalCount = Math.max(Object.values(p.records).filter(r => r.medal > 0).length, p.unlockMedals ?? 0);
  const tracks = useMemo(() => camp.tracks.slice((chapter - 1) * 25, chapter * 25).filter(t => {
    const r = p.records[t.id];
    if (filter === 'done' && !r?.finishes) return false; if (filter === 'todo' && r?.finishes) return false; if (filter === 'fav' && !p.favorites.includes(t.id)) return false;
    if (medalF >= 0 && (r?.medal ?? 0) !== medalF) return false;
    if (diff === 'easy' && t.meta.difficulty > 4) return false; if (diff === 'mid' && (t.meta.difficulty <= 4 || t.meta.difficulty > 7)) return false; if (diff === 'hard' && t.meta.difficulty <= 7) return false;
    return true;
  }), [camp, chapter, filter, medalF, diff, p.records, p.favorites]);
  const cur = camp.tracks[sel - 1];
  return (
    <div className="screen campaign">
      <Back title="Campaign" right={<span className="muted">{medalCount} / 275 tracks medalled</span>} />
      <nav className="chapters" aria-label="Chapters">
        {CHAPTERS_INFO.map(c => {
          const unlocked = chapterUnlocked(c.id, medalCount); const done = Array.from({ length: 25 }, (_, i) => p.records[(c.id - 1) * 25 + i + 1]?.finishes ? 1 : 0).reduce((a: number, b) => a + b, 0);
          return (
            <button key={c.id} className={`chap ${chapter === c.id ? 'on' : ''} ${unlocked ? '' : 'locked'}`} style={{ ['--ac' as any]: c.accent }} onClick={() => { audio.click(); setChapter(c.id); setSel((c.id - 1) * 25 + 1); }}>
              <b>{String(c.id).padStart(2, '0')}</b><span>{c.name}</span><em>{unlocked ? `${done}/25` : <><Icon name="lock" size={12} /> {c.unlockMedals} medals</>}</em>
            </button>
          );
        })}
      </nav>
      <div className="camp-main">
        <div className="filters">
          <Segmented value={filter} onChange={setFilter} options={[{ v: 'all', label: 'All' }, { v: 'todo', label: 'Uncompleted' }, { v: 'done', label: 'Completed' }, { v: 'fav', label: 'Favorites' }]} />
          <Segmented value={diff} onChange={setDiff} options={[{ v: 'all', label: 'Any difficulty' }, { v: 'easy', label: 'Easy' }, { v: 'mid', label: 'Medium' }, { v: 'hard', label: 'Hard' }]} />
          <select value={medalF} onChange={e => setMedalF(+e.target.value)} aria-label="Medal filter"><option value={-1}>Any medal</option>{MEDAL_NAMES.map((m, i) => <option key={m} value={i}>{i === 0 ? 'No medal' : m}</option>)}</select>
        </div>
        <div className="grid">
          {tracks.map(t => <TrackCard key={t.id} t={t} sel={sel === t.id} onSel={() => { audio.click(); setSel(t.id); }} locked={!chapterUnlocked(t.chapter, medalCount)} />)}
          {tracks.length === 0 && <div className="empty">No tracks match these filters.</div>}
        </div>
      </div>
      {cur && <Detail t={cur} locked={!chapterUnlocked(cur.chapter, medalCount)} onBoard={() => setBoard(true)} />}
      {board && <Modal title={`Leaderboard — ${cur.name}`} onClose={() => setBoard(false)} wide><Leaderboard trackId={cur.id} /></Modal>}
    </div>
  );
}

function TrackCard({ t, sel, onSel, locked }: { t: CampaignTrack; sel: boolean; onSel: () => void; locked: boolean }) {
  const p = useStore(s => s.profile); const r = p.records[t.id]; const m = t.meta;
  return (
    <button className={`tcard ${sel ? 'on' : ''} ${locked ? 'locked' : ''}`} onClick={onSel} onDoubleClick={() => !locked && useStore.getState().startRace({ mode: 'campaign', trackId: t.id })}>
      <TrackThumb id={t.id} w={280} h={140} />
      <span className="num">{String(t.id).padStart(3, '0')}</span>
      {locked && <span className="lockbadge"><Icon name="lock" size={14} /></span>}
      <div className="tc-b">
        <b>{t.name}</b>
        <div className="tc-r"><span className="diff" title={`Difficulty ${m.difficulty}`}>{Array.from({ length: 5 }).map((_, i) => <i key={i} className={i < Math.ceil(m.difficulty / 2) ? 'on' : ''} />)}</span><MedalChip medal={r?.medal ?? 0} size={18} />{r?.finishes ? <Icon name="check" size={14} /> : null}</div>
        <div className="tc-t"><span>PB {fmtTime(r?.bestMs)}</span><span>SIM {fmtTime(m.bench.ms)}</span></div>
      </div>
    </button>
  );
}

function Detail({ t, locked, onBoard }: { t: CampaignTrack; locked: boolean; onBoard: () => void }) {
  const st = useStore(); const p = st.profile; const r = p.records[t.id]; const m = t.meta; const fav = p.favorites.includes(t.id);
  const rows: [string, number | undefined, number][] = [['Apex', m.medals.apex, 5], ['Platinum', m.medals.platinum, 4], ['Gold', m.medals.gold, 3], ['Silver', m.medals.silver, 2], ['Bronze', m.medals.bronze, 1]];
  return (
    <Panel className="detail" title={<>TRACK {String(t.id).padStart(3, '0')} — {t.name.toUpperCase()}</>} right={<button className={`iconbtn ${fav ? 'on' : ''}`} onClick={() => st.toggleFavorite(t.id)} aria-label="Favourite"><Icon name="heart" /></button>}>
      <TrackPreview3D id={t.id} />
      <p className="desc">{t.meta.description}</p>
      <dl className="facts">
        <div><dt>Environment</dt><dd>{CHAPTERS_INFO[t.chapter - 1].name}</dd></div><div><dt>Length</dt><dd>{(m.lengthM / 1000).toFixed(2)} km</dd></div>
        <div><dt>Difficulty</dt><dd>{m.difficulty.toFixed(1)} / 10</dd></div><div><dt>Est. time</dt><dd>{m.estimatedSec}s</dd></div><div><dt>Checkpoints</dt><dd>{m.checkpoints}</dd></div>
      </dl>
      <table className="medals">
        <tbody>
          {rows.map(([n, ms, mi]) => <tr key={n} className={(r?.medal ?? 0) >= mi ? 'got' : ''}><td><MedalChip medal={mi} size={16} /> {n}</td><td className="mono">{fmtTime(ms)}</td><td className="mono muted">{r?.bestMs ? (r.bestMs <= ms! ? '✓' : fmtDelta(r.bestMs - ms!)) : ''}</td></tr>)}
          <tr className="sim"><td title="Calculated by the automated driver on the standardised car using the same deterministic physics. It is NOT a human record and NOT proven optimal."><Icon name="bolt" size={14} /> Simulated benchmark</td><td className="mono">{fmtTime(m.bench.ms)}</td><td className="mono muted">{r?.bestMs ? fmtDelta(r.bestMs - m.bench.ms) : ''}</td></tr>
          <tr className="sim"><td title="Loose heuristic: track length divided by the benchmark's peak speed. An estimate only, never a proven bound."><Icon name="clock" size={14} /> Est. floor (heuristic)</td><td className="mono muted">{fmtTime(m.bench.floorMs)}</td><td /></tr>
          <tr><td>Verified world record</td><td className="mono muted" colSpan={2}>No record yet</td></tr>
          <tr className="pb"><td>Personal best</td><td className="mono"><b>{fmtTime(r?.bestMs)}</b></td><td /></tr>
        </tbody>
      </table>
      <div className="actions">
        {locked ? <p className="warn"><Icon name="lock" size={14} /> Chapter locked in the campaign — practice is always open.</p>
          : <Btn kind="primary" icon="play" onClick={() => st.startRace({ mode: 'campaign', trackId: t.id })}>Race (Campaign)</Btn>}
        <Btn icon="clock" onClick={() => st.startRace({ mode: 'timetrial', trackId: t.id, practice: locked })}>{locked ? 'Practice' : 'Time Trial'}</Btn>
        <Btn icon="ghost" onClick={() => st.startRace({ mode: 'ghost', trackId: t.id, ghost: 'bench' })}>Race Benchmark Ghost</Btn>
        <Btn icon="trophy" onClick={onBoard}>Leaderboard</Btn>
      </div>
    </Panel>
  );
}
