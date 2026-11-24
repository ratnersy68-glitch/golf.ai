import React, { useEffect, useRef, useState } from 'react';
import { audio } from '../audio/audio';
import { MEDAL_COLORS, MEDAL_NAMES } from '../game/progress';
import { RARITY_COLOR, RARITY_LABEL, Rarity } from '../data/vehicles';

export const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const p: Record<string, string> = {
    back: 'M15 5l-7 7 7 7', close: 'M6 6l12 12M18 6L6 18', play: 'M8 5v14l11-7z', flag: 'M5 3v18M5 4h12l-2 4 2 4H5', star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    lock: 'M7 11V8a5 5 0 0110 0v3M5 11h14v10H5z', check: 'M5 13l4 4L19 7', heart: 'M12 20s-7-4.6-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.4-7 10-7 10z', search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5',
    cog: 'M12 8a4 4 0 100 8 4 4 0 000-8zM4 12h2M18 12h2M12 4v2M12 18v2', coin: 'M12 4a8 8 0 100 16 8 8 0 000-16zM9 12h6', trophy: 'M7 4h10v5a5 5 0 01-10 0zM5 5H3v2a3 3 0 003 3M19 5h2v2a3 3 0 01-3 3M12 14v4M8 20h8',
    car: 'M3 15l2-5a2 2 0 012-1.4h10a2 2 0 012 1.4l2 5v3h-3v-2H6v2H3z', bag: 'M5 8h14l-1 12H6zM9 8a3 3 0 016 0', edit: 'M4 20l4-1 11-11-3-3L5 16z', user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0', up: 'M12 5v14M6 11l6-6 6 6',
    down: 'M12 19V5M6 13l6 6 6-6', undo: 'M9 7L4 12l5 5M4 12h10a6 6 0 010 12', copy: 'M8 8h11v11H8zM5 16V5h11', trash: 'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13', save: 'M5 4h12l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6', ghost: 'M6 20V10a6 6 0 0112 0v10l-3-2-3 2-3-2z',
    bolt: 'M13 3L5 14h6l-1 7 8-11h-6z', clock: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v5l3 2', globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18', plus: 'M12 5v14M5 12h14', minus: 'M5 12h14',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z', rewind: 'M11 7L4 12l7 5zM20 7l-7 5 7 5z', ffwd: 'M13 7l7 5-7 5zM4 7l7 5-7 5z', pause: 'M8 5v14M16 5v14', mirror: 'M12 3v18M7 7l-4 5 4 5M17 7l4 5-4 5',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={p[name] ?? ''} /></svg>;
};

export function Btn({ children, onClick, kind = 'default', disabled, small, title, className = '', icon, active }: { children?: React.ReactNode; onClick?: (e: React.MouseEvent) => void; kind?: 'default' | 'primary' | 'ghost' | 'danger'; disabled?: boolean; small?: boolean; title?: string; className?: string; icon?: string; active?: boolean }) {
  return (
    <button className={`btn btn-${kind} ${small ? 'btn-sm' : ''} ${active ? 'is-active' : ''} ${className}`} disabled={disabled} title={title}
      onMouseEnter={() => audio.hover()} onClick={e => { if (disabled) return; audio.click(); onClick?.(e); }}>
      {icon && <Icon name={icon} size={small ? 14 : 16} />}{children}
    </button>
  );
}

export function Panel({ title, right, children, className = '', pad = true }: { title?: React.ReactNode; right?: React.ReactNode; children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={`panel ${className}`}>
      {(title || right) && <header className="panel-h"><h3>{title}</h3><div>{right}</div></header>}
      <div className={pad ? 'panel-b' : ''}>{children}</div>
    </section>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose?: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [onClose]);
  return (
    <div className="modal-back" onMouseDown={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-label={title}>
        <header className="panel-h"><h3>{title}</h3>{onClose && <button className="x" onClick={onClose} aria-label="Close"><Icon name="close" /></button>}</header>
        <div className="modal-b">{children}</div>
      </div>
    </div>
  );
}

export const RarityTag = ({ r }: { r: Rarity }) => <span className="rarity" style={{ ['--rc' as any]: RARITY_COLOR[r] }}>{RARITY_LABEL[r]}</span>;

export function MedalChip({ medal, size = 18 }: { medal: number; size?: number }) {
  const c = MEDAL_COLORS[medal];
  return (
    <span className="medal" title={MEDAL_NAMES[medal]} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <polygon points="12,1.5 21,6.8 21,17.2 12,22.5 3,17.2 3,6.8" fill={medal ? c : 'none'} stroke={medal ? '#00000066' : '#4a505a'} strokeWidth="1.4" />
        {medal === 5 && <path d="M12 6l2 4.2 4.5.6-3.3 3.1.8 4.5L12 16l-4 2.4.8-4.5L5.5 10.800l4.500-.6z" fill="#101216" />}
        {medal > 0 && medal < 5 && <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#101216" fontFamily="Barlow Condensed, sans-serif">{medal}</text>}
      </svg>
    </span>
  );
}

export function StatBar({ label, value, color }: { label: string; value: number; color?: string }) {
  return <div className="statbar"><span>{label}</span><i><b style={{ width: `${value}%`, background: color }} /></i><em>{value}</em></div>;
}

export function Currency({ credits, tokens, large }: { credits?: number; tokens?: number; large?: boolean }) {
  return (
    <span className={`cur ${large ? 'cur-l' : ''}`}>
      {credits !== undefined && <span className="cur-c"><i className="coin" />{credits.toLocaleString()}</span>}
      {tokens !== undefined && <span className="cur-t"><i className="coin tok" />{tokens.toLocaleString()}</span>}
    </span>
  );
}

export function Slider({ label, value, min, max, step = 0.01, onChange, fmt }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <label className="slider"><span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} />
      <em>{fmt ? fmt(value) : value.toFixed(2)}</em></label>
  );
}
export function Toggle({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="toggle" title={hint}><span>{label}</span>
      <button role="switch" aria-checked={value} className={value ? 'on' : ''} onClick={() => { audio.click(); onChange(!value); }}><i /></button></label>
  );
}
export function Segmented<T extends string | number>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return <div className="seg" role="tablist">{options.map(o => <button key={String(o.v)} role="tab" aria-selected={o.v === value} className={o.v === value ? 'on' : ''} onClick={() => { audio.click(); onChange(o.v); }}>{o.label}</button>)}</div>;
}
export function Tabs<T extends string>({ value, tabs, onChange }: { value: T; tabs: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return <nav className="tabs" role="tablist">{tabs.map(t => <button key={t.id} role="tab" aria-selected={t.id === value} className={t.id === value ? 'on' : ''} onClick={() => { audio.click(); onChange(t.id); }}>{t.label}</button>)}</nav>;
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const commit = (v: string) => { const m = /^#?([0-9a-fA-F]{6})$/.exec(v.trim()); if (m) onChange('#' + m[1].toUpperCase()); };
  return (
    <div className="colorfield">
      <span>{label}</span>
      <label className="swatch" style={{ background: value }}><input type="color" value={value} onChange={e => onChange(e.target.value.toUpperCase())} aria-label={`${label} colour`} /></label>
      <input className="hex" value={text} maxLength={7} spellCheck={false} onChange={e => { setText(e.target.value); commit(e.target.value); }} aria-label={`${label} hex`} />
    </div>
  );
}

export function useInterval(fn: () => void, ms: number) { const r = useRef(fn); r.current = fn; useEffect(() => { const id = setInterval(() => r.current(), ms); return () => clearInterval(id); }, [ms]); }

export function Empty({ children }: { children: React.ReactNode }) { return <div className="empty">{children}</div>; }

export const fmtInt = (n: number) => Math.round(n).toLocaleString();
