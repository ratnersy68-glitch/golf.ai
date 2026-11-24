import React, { useState } from 'react';
import { useStore } from '../game/store';
import { levelFromXp, PRESTIGE_NAMES, MAX_LEVEL, levelReward, divisionOf, MEDAL_NAMES } from '../game/progress';
import { COSMETIC_MAP } from '../data/cosmetics';
import { VEHICLE_MAP } from '../data/vehicles';
import { ACHIEVEMENTS } from '../data/achievements';
import { campaignSync } from '../game/campaign';
import { fmtTime } from '../sim/replay';
import { Back } from './Campaign';
import { Btn, Currency, Icon, MedalChip, Panel, Tabs } from './kit';
import { AvatarArt } from './Garage';
import { audio } from '../audio/audio';

const fmtDur = (ms: number) => { const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000); return `${h}h ${m}m`; };
const top = (o: Record<string, number>) => Object.entries(o).sort((a, b) => b[1] - a[1])[0]?.[0];

export function ProfileScreen() {
  const st = useStore(); const p = st.profile; const lv = levelFromXp(p.xp); const s = p.stats;
  const [tab, setTab] = useState<'stats' | 'challenges' | 'rewards' | 'ranked'>('stats');
  const banner = COSMETIC_MAP[p.banner]?.data ?? { c1: '#E8EAED', c2: '#B8BDC4' };
  const camp = campaignSync()!;
  const recs = Object.entries(p.records).filter(([, r]) => r.finishes);
  const avg = recs.length ? recs.reduce((a, [, r]) => a + (r.lastMs ?? r.bestMs), 0) / recs.length : 0;
  const fav = top(s.vehicleTime), favEnv = top(s.envTime);
  const medals = [1, 2, 3, 4, 5].map(m => Object.values(p.records).filter(r => r.medal >= m).length);
  const div = divisionOf(p.ranked.rating);
  const stat = (k: string, v: React.ReactNode) => <div className="stat" key={k}><small>{k}</small><b>{v}</b></div>;
  return (
    <div className="screen">
      <Back title="Profile" right={<Btn small icon="trophy" onClick={() => st.go('achievements')}>Achievements ({Object.keys(p.ach).length}/{ACHIEVEMENTS.length})</Btn>} />
      <div className="banner" style={{ background: `linear-gradient(100deg, ${banner.c1}, ${banner.c2})` }}>
        <AvatarArt id={p.avatar} size={72} />
        <div style={{ textShadow: '0 2px 8px #000' }}>
          <h2 style={{ fontSize: 34 }}>{p.name}</h2>
          <span className="muted" style={{ color: '#fff' }}>{COSMETIC_MAP[p.title]?.name} · {p.prestige ? `Prestige ${PRESTIGE_NAMES[p.prestige]} · ` : ''}Level {lv.level}</span>
        </div>
        <div className="grow" />
        <Currency credits={p.credits} tokens={p.tokens} large />
      </div>
      <div className="row" style={{ gap: 14 }}>
        <div className="grow"><div className="row" style={{ justifyContent: 'space-between', fontSize: 12 }}><span>XP {lv.into.toLocaleString()} / {lv.need.toLocaleString()}</span><span className="muted">Level {lv.level} / {MAX_LEVEL}</span></div>
          <div style={{ height: 8, background: '#2a2f38' }}><div style={{ height: '100%', width: `${(lv.into / lv.need) * 100}%`, background: 'var(--lime)' }} /></div></div>
        {p.level >= MAX_LEVEL && p.prestige < 8 && <Btn kind="primary" onClick={() => { if (st.prestige()) { audio.unlock(); st.toast({ kind: 'level', title: `Prestige: ${PRESTIGE_NAMES[useStore.getState().profile.prestige]}`, body: 'Level reset, rewards granted.' }); } }}>Prestige → {PRESTIGE_NAMES[p.prestige + 1]}</Btn>}
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'stats', label: 'Career statistics' }, { id: 'challenges', label: 'Challenges' }, { id: 'rewards', label: 'Level rewards' }, { id: 'ranked', label: 'Competitive' }]} />
      <div className="scroll">
        {tab === 'stats' && (
          <>
            <div className="statgrid">
              {stat('Total races', s.races)}{stat('Driving time', fmtDur(s.driveMs))}{stat('Distance', `${(s.distanceM / 1000).toFixed(1)} km`)}{stat('Highest speed', `${Math.round(s.topMps * 3.6)} km/h`)}
              {stat('Medals', medals[0])}{stat('Avg. completion', fmtTime(avg))}{stat('Records broken', s.pbs)}{stat('World records held', s.wr)}
              {stat('Benchmarks beaten', s.benchmarks)}{stat('Favourite vehicle', fav ? VEHICLE_MAP[fav]?.name : '—')}{stat('Favourite environment', favEnv ?? '—')}{stat('Longest jump', `${Math.round(s.longestJump)} m`)}
              {stat('Total crashes', s.crashes)}{stat('Total restarts', s.restarts)}{stat('Credits earned', s.creditsEarned.toLocaleString())}{stat('Cars owned', `${p.vehicles.length}/24`)}
              {stat('Cosmetics owned', p.owned.length)}{stat('Ranked rating', p.ranked.placements >= 5 ? `${div.name} (${p.ranked.rating})` : 'Unplaced')}
            </div>
            <div className="sub"><span>Medal collection</span></div>
            <div className="row" style={{ gap: 22 }}>{[1, 2, 3, 4, 5].map(m => <span key={m} className="row"><MedalChip medal={m} size={26} /><b className="mono">{medals[m - 1]}</b><span className="muted">{MEDAL_NAMES[m]}</span></span>)}</div>
          </>
        )}
        {tab === 'challenges' && (
          <div className="row" style={{ alignItems: 'flex-start', gap: 20 }}>
            {([['Daily', p.daily.list, `Streak ${p.daily.streak} day${p.daily.streak === 1 ? '' : 's'} · resets 00:00 UTC`], ['Weekly', p.weekly.list, 'Resets Monday 00:00 UTC']] as const).map(([name, list, sub]) => (
              <Panel key={name} title={`${name} challenges`} right={<span className="muted" style={{ fontSize: 12 }}>{sub}</span>} className="grow">
                <div className="col">{list.map(c => (
                  <div key={c.id} className={`chall ${c.done ? 'done' : ''}`}>
                    <b>{c.desc}</b><span><Currency credits={c.reward.credits} tokens={c.reward.tokens} /> <em className="xp">+{c.reward.xp} XP</em></span>
                    <div className="bar"><u style={{ width: `${(Math.min(c.target, c.progress) / c.target) * 100}%` }} /></div>
                    <span className="muted" style={{ fontSize: 12 }}>{Math.floor(c.progress)}/{c.target}</span>
                    {c.done && !c.claimed ? <Btn small kind="primary" onClick={() => { st.claimChallenge(c.id); audio.purchase(); }}>Claim</Btn> : c.claimed ? <span className="good">Claimed</span> : <span />}
                  </div>))}</div>
              </Panel>))}
          </div>
        )}
        {tab === 'rewards' && (
          <div className="col">
            <p className="muted">Every level pays credits; every 5th adds tokens; milestone levels unlock exclusive cosmetics.</p>
            <div className="lvlgrid">{Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map(l => { const r = levelReward(l); return <i key={l} className={l <= p.level || p.prestige ? 'got' : ''} title={`Level ${l}: ${r.credits} credits${r.tokens ? `, ${r.tokens} tokens` : ''}${r.item ? ', ' + COSMETIC_MAP[r.item]?.name : ''}`}>{l}{r.item ? '★' : ''}</i>; })}</div>
            <p className="muted" style={{ fontSize: 12 }}>★ = cosmetic reward. Prestige tiers: {PRESTIGE_NAMES.slice(1).join(' → ')}.</p>
          </div>
        )}
        {tab === 'ranked' && (
          <div className="col">
            <p className="warn"><Icon name="flag" size={14} />Offline practice rating — local only. No online opponents or player counts are shown because none exist without a backend.</p>
            <div className="statgrid">{stat('Division', p.ranked.placements >= 5 ? div.name : `Placements ${p.ranked.placements}/5`)}{stat('Rating', p.ranked.rating)}{stat('Peak', p.ranked.peak)}{stat('Season', p.ranked.season)}</div>
            <div className="sub"><span>Rank history</span></div>
            <RankChart />
          </div>
        )}
      </div>
    </div>
  );
}

export function RankChart() {
  const h = useStore(s => s.profile.ranked.history);
  if (h.length < 2) return <div className="empty">Play ranked runs to build a history.</div>;
  const w = 560, ht = 120; const max = Math.max(...h.map(x => x.rating), 100), min = Math.min(...h.map(x => x.rating), 0);
  const pts = h.map((x, i) => `${(i / (h.length - 1)) * w},${ht - ((x.rating - min) / (max - min || 1)) * (ht - 10) - 5}`).join(' ');
  return <svg viewBox={`0 0 ${w} ${ht}`} width="100%" style={{ maxWidth: 640, background: '#FFFFFF' }}><polyline points={pts} fill="none" stroke="#25282D" strokeWidth="2" /></svg>;
}
