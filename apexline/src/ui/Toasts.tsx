import React from 'react';
import { useStore } from '../game/store';
import { RARITY_COLOR, Rarity } from '../data/vehicles';
import { Icon } from './kit';

export function Toasts() {
  const toasts = useStore(s => s.toasts); const dismiss = useStore(s => s.dismissToast);
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.kind}`} style={{ ['--rc' as any]: t.rarity ? RARITY_COLOR[t.rarity as Rarity] : undefined }} onClick={() => dismiss(t.id)}>
          <i><Icon name={t.kind === 'achievement' ? 'trophy' : t.kind === 'level' ? 'up' : t.kind === 'reward' ? 'coin' : 'flag'} size={20} /></i>
          <div><small>{t.kind === 'achievement' ? 'ACHIEVEMENT UNLOCKED' : t.kind === 'level' ? 'LEVEL UP' : t.kind === 'reward' ? 'REWARD' : t.kind === 'error' ? 'ERROR' : 'INFO'}</small><b>{t.title}</b>{t.body && <p>{t.body}</p>}</div>
        </div>
      ))}
    </div>
  );
}
