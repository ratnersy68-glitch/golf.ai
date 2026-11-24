import React from 'react';
import { useStore } from '../game/store';
import { campaignSync, weeklyTrackIds } from '../game/campaign';
import { DIVISIONS, divisionOf, weekId, seasonId, perfRating } from '../game/progress';
import { fmtTime } from '../sim/replay';
import { Back } from './Campaign';
import { Btn, Icon, Panel, Currency } from './kit';
import { TrackThumb } from './trackviz';
import { RankChart } from './Profile';
import { backendConfigured } from '../net/backend';

const SEASON_REWARDS: { idx: number; credits: number; tokens: number; label: string }[] = [
  { idx: 3, credits: 2000, tokens: 0, label: 'Silver I' }, { idx: 6, credits: 5000, tokens: 5, label: 'Gold I' }, { idx: 9, credits: 12000, tokens: 15, label: 'Platinum I' },
  { idx: 12, credits: 25000, tokens: 40, label: 'Diamond I' }, { idx: 15, credits: 50000, tokens: 80, label: 'Master' }, { idx: 17, credits: 150000, tokens: 250, label: 'Apex' },
];

export function RankedScreen() {
  const st = useStore(); const p = st.profile; const rk = p.ranked; const camp = campaignSync()!;
  const week = weekId(); const ids = weeklyTrackIds(week); const div = divisionOf(rk.rating); const placed = rk.placements >= 5;
  return (
    <div className="screen">
      <Back title="Ranked" right={<span className="muted">{seasonId()} · {week}</span>} />
      <p className="warn"><Icon name="flag" size={14} />{backendConfigured ? 'Backend configured: verified results are submitted for server-side replay validation.' : 'Offline practice rating. No online backend is connected, so this rating is local and compares you with the calculated simulated benchmark only. No opponents are shown.'} All ranked runs use the standardised car.</p>
      <div className="row" style={{ alignItems: 'stretch', gap: 14 }}>
        <Panel title="Your rank" className="grow"><div className="col">
          <h2 style={{ fontSize: 44 }}>{placed ? div.name : 'Unplaced'}</h2>
          {placed ? <><span className="mono">Rating {rk.rating}{div.next ? ` / ${div.next}` : ' (max division)'}</span><div style={{ height: 6, background: '#2a2f38' }}><div style={{ height: '100%', background: 'var(--lime)', width: `${div.next ? ((rk.rating - div.min) / (div.next - div.min)) * 100 : 100}%` }} /></div></> : <span className="muted">Placement runs {rk.placements} / 5 — finish 5 weekly tracks to be placed.</span>}
          <span className="muted" style={{ fontSize: 12 }}>Rating blends your best recent runs relative to the simulated benchmark, weighted by track difficulty, so consistency across tracks counts. Hours played never count.</span>
          <RankChart />
        </div></Panel>
        <Panel title="Seasonal rewards" className="grow"><div className="col">
          {SEASON_REWARDS.map(r => { const key = `${seasonId()}:${r.idx}`; const reached = rk.peak >= DIVISIONS[r.idx].min && rk.placements >= 5; const claimed = p.rewardsClaimed[key];
            return <div className="row" key={key} style={{ justifyContent: 'space-between' }}><span>{r.label}</span><Currency credits={r.credits} tokens={r.tokens || undefined} />
              <Btn small kind={reached && !claimed ? 'primary' : 'default'} disabled={!reached || claimed} onClick={() => st.patchProfile(q => { q.rewardsClaimed[key] = true; q.credits += r.credits; q.tokens += r.tokens; q.stats.creditsEarned += r.credits; })}>{claimed ? 'Claimed' : reached ? 'Claim' : 'Locked'}</Btn></div>; })}
        </div></Panel>
      </div>
      <div className="sub"><span>Weekly ranked rotation</span><span className="muted">same five tracks for everyone this week</span></div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
        {ids.map(id => { const t = camp.tracks[id - 1]; const best = rk.weekRuns[`${week}:${id}`]; return (
          <div key={id} className="tcard" style={{ cursor: 'default' }}>
            <TrackThumb id={id} w={280} h={140} /><span className="num">{String(id).padStart(3, '0')}</span>
            <div className="tc-b"><b>{t.name}</b><div className="tc-t"><span>Week best {fmtTime(best)}</span><span>{best ? perfRating(best, t.meta.bench.ms) : '—'} pts</span></div>
              <Btn small kind="primary" icon="play" onClick={() => st.startRace({ mode: 'ranked', trackId: id })}>Ranked run</Btn></div>
          </div>); })}
      </div>
    </div>
  );
}
