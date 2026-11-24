import React, { useState } from 'react';
import { useStore } from '../game/store';
import { ACHIEVEMENTS } from '../data/achievements';
import { RARITY_COLOR, RARITY_ORDER, RARITY_LABEL } from '../data/vehicles';
import { Back } from './Campaign';
import { Icon, Segmented, Currency } from './kit';

export function AchievementsScreen() {
  const p = useStore(s => s.profile); const [f, setF] = useState<'all' | 'done' | 'todo'>('all'); const [r, setR] = useState('all');
  const list = ACHIEVEMENTS.filter(a => (f === 'all' || (f === 'done') === !!p.ach[a.id]) && (r === 'all' || a.rarity === r)).sort((a, b) => (!!p.ach[b.id] ? 1 : 0) - (!!p.ach[a.id] ? 1 : 0) || RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
  return (
    <div className="screen">
      <Back title={`Achievements ${Object.keys(p.ach).length}/${ACHIEVEMENTS.length}`} />
      <div className="row"><Segmented value={f} onChange={setF} options={[{ v: 'all', label: 'All' }, { v: 'todo', label: 'In progress' }, { v: 'done', label: 'Unlocked' }]} />
        <select value={r} onChange={e => setR(e.target.value)} aria-label="Rarity"><option value="all">All rarities</option>{RARITY_ORDER.map(x => <option key={x} value={x}>{RARITY_LABEL[x]}</option>)}</select></div>
      <div className="scroll"><div className="items" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {list.map(a => { const got = p.ach[a.id]; const v = Math.min(a.target, p.achProgress[a.id] ?? a.value(p)); return (
          <div key={a.id} className={`ach ${got ? '' : 'locked'}`} style={{ ['--rc' as any]: RARITY_COLOR[a.rarity] }}>
            <i><Icon name={got ? 'trophy' : 'lock'} size={20} /></i>
            <div><b>{a.name}</b><p>{a.desc}</p><div className="bar"><u style={{ width: `${(v / a.target) * 100}%` }} /></div>
              <small className="muted">{got ? `Unlocked ${new Date(got.at).toLocaleDateString()}` : `${v.toLocaleString()} / ${a.target.toLocaleString()}`}</small></div>
            <div style={{ textAlign: 'right' }}><div style={{ color: RARITY_COLOR[a.rarity], fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em' }}>{RARITY_LABEL[a.rarity]}</div><Currency credits={a.credits} tokens={a.tokens || undefined} /></div>
          </div>); })}
      </div></div>
    </div>
  );
}
