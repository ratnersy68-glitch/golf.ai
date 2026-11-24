import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../game/store';
import { VEHICLES, VEHICLE_MAP, CATEGORIES, RARITY_COLOR, RARITY_LABEL, Category } from '../data/vehicles';
import { COSMETICS_BY_CAT, COSMETIC_MAP, CAT_LABEL, CosCat, Cosmetic } from '../data/cosmetics';
import { defaultSetup, sanitiseSetup, ownsCosmetic } from '../game/progress';
import type { CarSetup, LiveryLayer } from '../game/types';
import { Back } from './Campaign';
import { Btn, ColorField, Currency, Icon, Panel, RarityTag, StatBar, Tabs, Slider, Toggle, Segmented } from './kit';
import { audio } from '../audio/audio';
import { presetLayers } from '../game/livery';

type Tab = 'paint' | 'wheels' | 'body' | 'lights' | 'livery' | 'fx' | 'me';

export function GarageScreen() {
  const st = useStore(); const p = st.profile;
  const [tab, setTab] = useState<Tab>('paint');
  const [viewing, setViewing] = useState<string>(p.selected);
  const owned = p.vehicles.includes(viewing); const v = VEHICLE_MAP[viewing];
  const setup = p.setups[p.selected] ?? defaultSetup(p.selected);
  // preview of a vehicle you do not own yet: show it in its default livery
  useEffect(() => {
    if (!owned) useStore.setState({ previewSetup: defaultSetup(viewing) } as any); else useStore.setState({ previewSetup: undefined } as any);
    return () => { useStore.setState({ previewSetup: undefined } as any); };
  }, [viewing, owned]);
  const lvl = p.level + (p.prestige ? 250 : 0);
  const canBuy = !owned && lvl >= v.unlockLevel && p.credits >= v.price;
  return (
    <div className="screen garage">
      <Back title="Garage" right={<Currency credits={p.credits} tokens={p.tokens} large />} />
      <div className="vlist" role="listbox" aria-label="Vehicles">
        {CATEGORIES.map(cat => (
          <React.Fragment key={cat}>
            <div className="vhead">{cat}</div>
            {VEHICLES.filter(x => x.category === cat).map(x => {
              const has = p.vehicles.includes(x.id);
              return (
                <button key={x.id} className={`vcard ${viewing === x.id ? 'on' : ''} ${has ? '' : 'locked'}`} style={{ ['--rc' as any]: RARITY_COLOR[x.rarity] }} onClick={() => { audio.click(); setViewing(x.id); if (has) st.selectVehicle(x.id); }}>
                  <b>{x.name}{p.selected === x.id && <Icon name="check" size={14} />}</b>
                  <small><span>{RARITY_LABEL[x.rarity]}</span>{has ? <span>Owned</span> : lvl < x.unlockLevel ? <span><Icon name="lock" size={11} /> Lv {x.unlockLevel}</span> : <span>{x.price.toLocaleString()} cr</span>}</small>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="garage-mid">
        <div className="vname"><small>{v.category} · {RARITY_LABEL[v.rarity]}</small><h2>{v.name}</h2></div>
        <div className="row" style={{ justifyContent: 'center' }}>
          {!owned && <Btn kind="primary" disabled={!canBuy} onClick={() => { if (st.buyVehicle(viewing)) { audio.purchase(); st.selectVehicle(viewing); st.toast({ kind: 'reward', title: `${v.name} added to garage` }); } else audio.denied(); }}>
            {lvl < v.unlockLevel ? `Requires level ${v.unlockLevel}` : `Buy · ${v.price.toLocaleString()} credits`}</Btn>}
          {owned && <span className="muted" style={{ fontSize: 12 }}>Drag to rotate · scroll to zoom</span>}
        </div>
      </div>
      <Panel className="opts-panel" title={owned ? 'Customise' : 'Vehicle'} pad={false}>
        <div className="panel-b">
          <p className="desc">{v.desc}</p>
          <div className="col" style={{ marginBottom: 10 }}>
            <StatBar label="Accel" value={v.stats.accel} /><StatBar label="Top" value={v.stats.top} /><StatBar label="Grip" value={v.stats.grip} /><StatBar label="Brake" value={v.stats.brake} /><StatBar label="Air" value={v.stats.air} /><StatBar label="Drift" value={v.stats.drift} />
            <p className="muted" style={{ fontSize: 12, margin: '4px 0 0' }}>Handling applies to casual modes. Ranked, campaign records, daily and weekly runs always use the standardised car, so no purchase or cosmetic can change a record.</p>
          </div>
          {owned ? (
            <>
              <Tabs value={tab} onChange={setTab} tabs={[{ id: 'paint', label: 'Paint' }, { id: 'wheels', label: 'Wheels' }, { id: 'body', label: 'Body' }, { id: 'lights', label: 'Lights' }, { id: 'livery', label: 'Livery' }, { id: 'fx', label: 'Effects' }, { id: 'me', label: 'Personal' }]} />
              {tab === 'paint' && <PaintTab setup={setup} />}
              {tab === 'wheels' && <><Pick cat="wheel" /><Pick cat="wheelColor" /><Pick cat="tire" /><Pick cat="caliper" /></>}
              {tab === 'body' && (['spoiler', 'splitter', 'skirt', 'diffuser', 'hood', 'scoop', 'widebody', 'exhaust', 'fbumper', 'rbumper'] as CosCat[]).map(c => <Pick key={c} cat={c} />)}
              {tab === 'lights' && <><Pick cat="headlight" /><Pick cat="taillight" /><Pick cat="underglow" /><Pick cat="lightpattern" /></>}
              {tab === 'livery' && <LiveryTab setup={setup} />}
              {tab === 'fx' && (['trail', 'flame', 'smoke', 'finishfx', 'spawn', 'victory'] as CosCat[]).map(c => <Pick key={c} cat={c} />)}
              {tab === 'me' && <PersonalTab setup={setup} />}
            </>
          ) : <p className="muted">Buy this vehicle to customise it.</p>}
        </div>
      </Panel>
    </div>
  );
}

function equippedId(setup: CarSetup, cat: CosCat): string {
  switch (cat) {
    case 'finish': return setup.paint.finish; case 'wheel': return setup.wheel.design; case 'wheelColor': return setup.wheel.color; case 'tire': return setup.wheel.tire; case 'caliper': return setup.wheel.caliper;
    case 'headlight': return setup.lights.head; case 'taillight': return setup.lights.tail; case 'underglow': return setup.lights.underglow; case 'lightpattern': return setup.lights.pattern;
    case 'livery': return setup.livery.preset; case 'trail': return setup.fx.trail; case 'flame': return setup.fx.flame; case 'smoke': return setup.fx.smoke; case 'finishfx': return setup.fx.finish; case 'spawn': return setup.fx.spawn; case 'victory': return setup.fx.victory; case 'plate': return setup.plate.style;
    default: return (setup.body as any)[cat] ?? '';
  }
}

export function Pick({ cat }: { cat: CosCat }) {
  const st = useStore(); const p = st.profile; const setup = p.setups[p.selected];
  const cur = equippedId(setup, cat);
  const list = COSMETICS_BY_CAT[cat] ?? [];
  const ownedN = list.filter(c => p.owned.includes(c.id)).length;
  return (
    <>
      <div className="sub"><span>{CAT_LABEL[cat]}</span><span className="muted">{ownedN}/{list.length}</span></div>
      <div className="opts">
        {list.map(c => {
          const own = p.owned.includes(c.id);
          return (
            <button key={c.id} className={`opt ${cur === c.id ? 'on' : ''} ${own ? '' : 'locked'}`} style={{ ['--rc' as any]: RARITY_COLOR[c.rarity] }} title={own ? c.name : `${c.name} — ${c.shop === 'earned' ? c.earn : 'buy in the shop'}`}
              onClick={() => { if (own) { audio.click(); st.equip(cat, c.id); } else { audio.denied(); st.toast({ kind: 'info', title: c.name, body: c.shop === 'earned' ? `Earn it: ${c.earn}` : 'Not owned — available in the Shop.' }); } }}>
              {c.data.color && <i className="sw" style={{ background: c.data.color }} />}
              {c.data.c1 && cat !== 'livery' && cat !== 'banner' && <i className="sw" style={{ background: `linear-gradient(90deg, ${c.data.c1}, ${c.data.c2 ?? c.data.c1})` }} />}
              <span>{c.name}</span>{!own && <i className="lk"><Icon name="lock" size={11} /></i>}
            </button>
          );
        })}
      </div>
    </>
  );
}

function PaintTab({ setup }: { setup: CarSetup }) {
  const st = useStore(); const p = st.profile; const [slot, setSlot] = useState<'primary' | 'secondary' | 'accent'>('primary');
  const paints = (COSMETICS_BY_CAT.paint ?? []).filter(c => p.owned.includes(c.id));
  return (
    <>
      <div className="col">
        <ColorField label="Primary" value={setup.paint.primary} onChange={c => st.setSetup(s => { s.paint.primary = c; })} />
        <ColorField label="Secondary" value={setup.paint.secondary} onChange={c => st.setSetup(s => { s.paint.secondary = c; })} />
        <ColorField label="Accent" value={setup.paint.accent} onChange={c => st.setSetup(s => { s.paint.accent = c; })} />
      </div>
      <div className="sub"><span>Owned paints</span><Segmented value={slot} onChange={setSlot} options={[{ v: 'primary', label: 'Primary' }, { v: 'secondary', label: 'Second' }, { v: 'accent', label: 'Accent' }]} /></div>
      <div className="opts">
        {paints.map(c => <button key={c.id} className="opt" style={{ ['--rc' as any]: RARITY_COLOR[c.rarity] }} title={c.name} onClick={() => { audio.click(); st.setSetup(s => { s.paint[slot] = c.data.color; }); }}><i className="sw" style={{ background: c.data.color, width: 40 }} /><span>{c.name}</span></button>)}
      </div>
      <Pick cat="finish" />
    </>
  );
}

function PersonalTab({ setup }: { setup: CarSetup }) {
  const st = useStore(); const p = st.profile;
  const own = (cat: CosCat) => (COSMETICS_BY_CAT[cat] ?? []).filter(c => p.owned.includes(c.id));
  return (
    <>
      <div className="col">
        <label className="field" style={{ gridTemplateColumns: '90px 1fr' }}><span>Player name</span><input type="text" maxLength={16} value={p.name} onChange={e => st.patchProfile(q => { q.name = e.target.value; })} /></label>
        <label className="field" style={{ gridTemplateColumns: '90px 1fr' }}><span>License plate</span><input type="text" maxLength={9} value={setup.plate.text} onChange={e => st.setSetup(s => { s.plate.text = e.target.value.toUpperCase(); })} /></label>
        <label className="field" style={{ gridTemplateColumns: '90px 1fr' }}><span>Driver number</span><input type="number" min={0} max={99} value={setup.number} onChange={e => st.setSetup(s => { s.number = Math.max(0, Math.min(99, +e.target.value | 0)); })} /></label>
      </div>
      <Pick cat="plate" />
      <div className="sub"><span>Player title</span></div>
      <div className="opts">{own('title').map(c => <button key={c.id} className={`opt ${p.title === c.id ? 'on' : ''}`} style={{ ['--rc' as any]: RARITY_COLOR[c.rarity] }} onClick={() => st.equip('title', c.id)}>{c.name}</button>)}</div>
      <div className="sub"><span>Avatar</span></div>
      <div className="opts">{own('avatar').map(c => <button key={c.id} className={`opt ${p.avatar === c.id ? 'on' : ''}`} style={{ ['--rc' as any]: RARITY_COLOR[c.rarity] }} onClick={() => st.equip('avatar', c.id)}><AvatarArt id={c.id} size={36} /></button>)}</div>
      <div className="sub"><span>Profile banner</span></div>
      <div className="opts">{own('banner').map(c => <button key={c.id} className={`opt ${p.banner === c.id ? 'on' : ''}`} style={{ ['--rc' as any]: RARITY_COLOR[c.rarity] }} onClick={() => st.equip('banner', c.id)}><i className="sw" style={{ background: `linear-gradient(90deg, ${c.data.c1}, ${c.data.c2})`, width: 54 }} />{c.name}</button>)}</div>
      <div className="sub"><span>Garage background</span></div>
      <div className="opts">{own('garage').map(c => <button key={c.id} className={`opt ${((p as any).garageEnv ?? 'garage_carbon_studio') === c.id ? 'on' : ''}`} style={{ ['--rc' as any]: RARITY_COLOR[c.rarity] }} onClick={() => st.equip('garage', c.id)}><i className="sw" style={{ background: c.data.bg, borderColor: c.data.accent, width: 40 }} />{c.name}</button>)}</div>
    </>
  );
}

export function AvatarArt({ id, size = 64 }: { id: string; size?: number }) {
  const c = COSMETIC_MAP[id]; const d = c?.data ?? { glyph: 'bolt', fg: '#C6FF00', bg: '#101216' };
  const g: Record<string, string> = {
    bolt: 'M13 2L4 14h6l-1 8 9-12h-6z', wheel: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 9a3 3 0 100 6 3 3 0 000-6zM12 3v6M12 15v6M3 12h6M15 12h6', helm: 'M4 14a8 8 0 0116 0v4H4zM8 12h8M12 6v6', flag: 'M5 3v18M5 4h14l-3 4 3 4H5', gear: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3', crown: 'M3 18l2-10 5 5 2-8 2 8 5-5 2 10z',
    skull: 'M12 3a8 8 0 00-5 14v3h10v-3a8 8 0 00-5-14zM9 12h.01M15 12h.01M10 17v2M14 17v2', wing: 'M3 16c4-8 10-10 18-9-3 2-5 4-6 7 2-1 4-1 6-1-5 5-12 6-18 3z', star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', flame: 'M12 3c1 5 6 6 6 12a6 6 0 01-12 0c0-3 2-4 3-7 1 1 2 2 3-5z', arrow: 'M4 12h14M12 5l7 7-7 7', diamond: 'M12 3l8 9-8 9-8-9z',
  };
  return <svg className="avatar" width={size} height={size} viewBox="0 0 24 24" style={{ background: d.bg, width: size, height: size }}><path d={g[d.glyph] ?? g.bolt} fill="none" stroke={d.fg} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" transform="translate(2.4 2.4) scale(.8)" /></svg>;
}

// ----------------------------------------------------------------------------------------------- livery editor
let layerSeq = 1;
function LiveryTab({ setup }: { setup: CarSetup }) {
  const st = useStore(); const p = st.profile;
  const layers = setup.livery.layers;
  const [sel, setSel] = useState<string | null>(null);
  const [past, setPast] = useState<LiveryLayer[][]>([]); const [future, setFuture] = useState<LiveryLayer[][]>([]);
  const commit = (next: LiveryLayer[]) => { setPast(h => [...h.slice(-49), layers]); setFuture([]); st.setSetup(s => { s.livery.layers = next; }); };
  const undo = () => { if (!past.length) return; const prev = past[past.length - 1]; setPast(past.slice(0, -1)); setFuture([layers, ...future]); st.setSetup(s => { s.livery.layers = prev; }); };
  const redo = () => { if (!future.length) return; const nx = future[0]; setFuture(future.slice(1)); setPast([...past, layers]); st.setSetup(s => { s.livery.layers = nx; }); };
  const add = (type: LiveryLayer['type'], extra: Partial<LiveryLayer> = {}) => { const l: LiveryLayer = { id: 'u' + layerSeq++ + Date.now(), type, x: 0.5, y: 0.27, w: 0.12, h: 0.12, rot: 0, color: setup.paint.accent, alpha: 1, mirror: true, ...extra }; commit([...layers, l]); setSel(l.id); };
  const cur = layers.find(l => l.id === sel);
  const edit = (patch: Partial<LiveryLayer>) => { if (!cur) return; commit(layers.map(l => l.id === cur.id ? { ...l, ...patch } : l)); };
  const move = (dir: -1 | 1) => { if (!cur) return; const i = layers.indexOf(cur); const j = i + dir; if (j < 0 || j >= layers.length) return; const n = [...layers]; [n[i], n[j]] = [n[j], n[i]]; commit(n); };
  const dup = () => { if (!cur) return; const c = { ...cur, id: 'u' + layerSeq++ + Date.now(), x: Math.min(1, cur.x + 0.03), y: Math.min(1, cur.y + 0.03) }; commit([...layers, c]); setSel(c.id); };
  const del = () => { if (!cur) return; commit(layers.filter(l => l.id !== cur.id)); setSel(null); };
  const [pname, setPname] = useState('My design');
  const num = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  return (
    <>
      <Pick cat="livery" />
      <Toggle label="Show preset livery under custom layers" value={setup.livery.useBase} onChange={v => st.setSetup(s => { s.livery.useBase = v; })} />
      <div className="sub"><span>Custom layers</span><span className="row">
        <Btn small icon="undo" onClick={undo} disabled={!past.length} title="Undo">Undo</Btn><Btn small onClick={redo} disabled={!future.length}>Redo</Btn></span></div>
      <div className="row">
        <Btn small icon="plus" onClick={() => add('rect')}>Rect</Btn><Btn small onClick={() => add('ellipse')}>Ellipse</Btn><Btn small onClick={() => add('tri')}>Triangle</Btn><Btn small onClick={() => add('ngon', { sides: 6 })}>Hex</Btn>
        <Btn small onClick={() => add('stripe', { x: 0.5, y: 0.5, w: 1, h: 0.06, mirror: false })}>Stripe</Btn><Btn small onClick={() => add('text', { text: String(setup.number), w: 0.08, h: 0.12 })}>Number</Btn><Btn small onClick={() => add('text', { text: 'APX', w: 0.12, h: 0.1 })}>Decal text</Btn>
        <Btn small onClick={() => add('tri', { rot: 180, w: 0.18, h: 0.07, color: '#FFC400' })}>Arrow decal</Btn>
      </div>
      <ul className="seq" style={{ marginTop: 8, maxHeight: 150, overflow: 'auto' }}>
        {[...layers].reverse().map(l => <li key={l.id} className={sel === l.id ? 'on' : ''} onClick={() => setSel(l.id)}><i style={{ width: 12, height: 12, background: l.color, display: 'inline-block' }} /><b>{l.type}{l.text ? ` “${l.text}”` : ''}</b><em>{Math.round(l.alpha * 100)}%</em></li>)}
        {layers.length === 0 && <li className="muted">No custom layers yet. Add a shape.</li>}
      </ul>
      {cur && (
        <div className="col" style={{ marginTop: 8 }}>
          <ColorField label="Colour" value={cur.color} onChange={c => edit({ color: c })} />
          <Slider label="Position X" value={cur.x} min={0} max={1} onChange={v => edit({ x: v })} /><Slider label="Position Y" value={cur.y} min={0} max={1} onChange={v => edit({ y: v })} />
          <Slider label="Width" value={cur.w} min={0.01} max={1.2} onChange={v => edit({ w: v })} /><Slider label="Height" value={cur.h} min={0.005} max={1} onChange={v => edit({ h: v })} />
          <Slider label="Rotation" value={cur.rot} min={-180} max={180} step={1} onChange={v => edit({ rot: v })} fmt={v => v + '°'} /><Slider label="Opacity" value={cur.alpha} min={0.05} max={1} onChange={v => edit({ alpha: v })} />
          {cur.type === 'text' && <label className="field" style={{ gridTemplateColumns: '90px 1fr' }}><span>Text</span><input type="text" maxLength={6} value={cur.text ?? ''} onChange={e => edit({ text: e.target.value })} /></label>}
          <Toggle label="Mirror to other side" value={!!cur.mirror} onChange={v => edit({ mirror: v })} />
          <div className="row"><Btn small icon="up" onClick={() => move(1)}>Forward</Btn><Btn small icon="down" onClick={() => move(-1)}>Back</Btn><Btn small icon="copy" onClick={dup}>Duplicate</Btn><Btn small kind="danger" icon="trash" onClick={del}>Delete</Btn></div>
        </div>
      )}
      <div className="sub"><span>Saved presets</span></div>
      <div className="row"><input type="text" value={pname} maxLength={20} onChange={e => setPname(e.target.value)} aria-label="Preset name" /><Btn small icon="save" onClick={() => { st.patchProfile(q => { q.presets.push({ id: 'p' + Date.now(), name: pname, setup: structuredClone(q.setups[q.selected]) }); }); st.toast({ kind: 'info', title: 'Preset saved', body: pname }); }}>Save look</Btn></div>
      <ul className="seq" style={{ marginTop: 6 }}>
        {p.presets.map(pr => <li key={pr.id}><b>{pr.name}</b><em>{VEHICLE_MAP[pr.setup.vehicle]?.name}</em>
          <Btn small onClick={() => { st.patchProfile(q => { const s = sanitiseSetup(q, { ...pr.setup, vehicle: q.selected }); q.setups[q.selected] = s; }); }}>Apply</Btn>
          <Btn small kind="ghost" icon="trash" onClick={() => st.patchProfile(q => { q.presets = q.presets.filter(x => x.id !== pr.id); })} /></li>)}
        {p.presets.length === 0 && <li className="muted">None saved.</li>}
      </ul>
    </>
  );
}
