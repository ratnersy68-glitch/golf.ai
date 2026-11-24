import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../game/store';
import { COSMETICS, COSMETIC_MAP, SHOP_GROUPS, BUNDLES, CAT_LABEL, Cosmetic, rarityValue } from '../data/cosmetics';
import { VEHICLES, RARITY_COLOR, RARITY_LABEL, RARITY_ORDER, Rarity } from '../data/vehicles';
import { dayId, weekId, defaultSetup, sanitiseSetup } from '../game/progress';
import { applyCosmetic } from '../game/setup';
import { dailyPicks, weeklyCollection } from './shopLogic';
import { Back } from './Campaign';
import { Btn, Currency, Icon, Modal, Panel, RarityTag, Segmented, Tabs } from './kit';
import { audio } from '../audio/audio';
import { getPreview, has3DPreview } from '../game/preview';
import { useInterval } from './kit';

function Thumb({ c }: { c: Cosmetic }) {
  const [src, setSrc] = useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!has3DPreview(c)) return; let live = true; const el = ref.current;
    const go = () => getPreview(c).then(u => { if (live) setSrc(u); });
    if (!el || !('IntersectionObserver' in window)) { go(); return () => { live = false; }; }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); go(); } }, { rootMargin: '120px' }); io.observe(el);
    return () => { live = false; io.disconnect(); };
  }, [c.id]);
  if (src) return <div ref={ref} className="pthumb"><img src={src} alt="" /></div>;
  if (c.data.color) return <div ref={ref}><i className="swatchbig" style={{ ['--c' as any]: c.data.color }} /></div>;
  if (c.data.c1) return <div ref={ref}><i className="swatchbig" style={{ background: `linear-gradient(90deg, ${c.data.c1}, ${c.data.c2 ?? c.data.c1})` }} /></div>;
  return <div ref={ref}><i className="swatchbig" style={{ background: 'repeating-linear-gradient(135deg,#E8EAED 0 6px,#F5F5F3 6px 12px)' }} /></div>;
}

type ShopTab = 'featured' | 'vehicles' | 'bundles' | 'wish' | string;

function timeLeft(): { d: string; w: string } {
  const now = new Date(); const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1); const ms = next - now.getTime();
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  const daysToMon = ((8 - now.getUTCDay()) % 7) || 7;
  return { d: `${h}h ${m}m`, w: `${daysToMon - 1}d ${h}h` };
}

export function ShopScreen() {
  const st = useStore(); const p = st.profile;
  const [tab, setTab] = useState<ShopTab>('featured');
  const [q, setQ] = useState(''); const [rar, setRar] = useState<string>('all'); const [sort, setSort] = useState<'rarity' | 'price' | 'name'>('rarity'); const [showOwned, setShowOwned] = useState(true);
  const [sel, setSel] = useState<Cosmetic | null>(null); const [confirm, setConfirm] = useState<{ c: Cosmetic; disc: number } | null>(null);
  const [, tick] = useState(0); useInterval(() => tick(x => x + 1), 30000);
  const day = dayId(), week = weekId();
  const daily = useMemo(() => dailyPicks(day), [day]); const weekly = useMemo(() => weeklyCollection(week), [week]);
  const weeklyIds = new Set(weekly.items.map(c => c.id)); const dailyIds = new Set(daily.map(c => c.id));
  const available = (c: Cosmetic) => c.shop === 'permanent' || dailyIds.has(c.id) || weeklyIds.has(c.id);
  const disc = (c: Cosmetic) => (weeklyIds.has(c.id) ? weekly.discount : 0);
  const tl = timeLeft();

  // live preview on the car
  useEffect(() => {
    if (!sel || ['title', 'avatar', 'banner', 'garage'].includes(sel.cat)) { useStore.setState({ previewSetup: undefined } as any); return; }
    const base = sanitiseSetup(p, p.setups[p.selected] ?? defaultSetup(p.selected));
    useStore.setState({ previewSetup: applyCosmetic(base, sel) } as any);
  }, [sel, p.selected]);
  useEffect(() => { useStore.setState({ shopFocus: sel ? sel.cat : null } as any); }, [sel]);
  useEffect(() => () => { useStore.setState({ previewSetup: undefined, shopFocus: null } as any); }, []);

  const group = SHOP_GROUPS.find(g => g.id === tab);
  let items: Cosmetic[] = [];
  if (group) items = COSMETICS.filter(c => group.cats.includes(c.cat) && (available(c) || c.shop === 'earned'));
  if (tab === 'wish') items = p.wishlist.map(id => COSMETIC_MAP[id]).filter(Boolean);
  items = items.filter(c => (rar === 'all' || c.rarity === rar) && (!q || c.name.toLowerCase().includes(q.toLowerCase()) || CAT_LABEL[c.cat].toLowerCase().includes(q.toLowerCase())) && (showOwned || !p.owned.includes(c.id)));
  items.sort((a, b) => sort === 'rarity' ? rarityValue(b) - rarityValue(a) || a.name.localeCompare(b.name) : sort === 'price' ? (a.price.credits ?? 0) + (a.price.tokens ?? 0) * 100 - ((b.price.credits ?? 0) + (b.price.tokens ?? 0) * 100) : a.name.localeCompare(b.name));
  const currentSetup = p.setups[p.selected];

  const Card = ({ c, d = 0 }: { c: Cosmetic; d?: number }) => {
    const own = p.owned.includes(c.id); const eq = JSON.stringify(currentSetup).includes(`"${c.id}"`) || p.title === c.id || p.avatar === c.id || p.banner === c.id;
    const wish = p.wishlist.includes(c.id);
    const price = { credits: c.price.credits ? Math.round(c.price.credits * (1 - d)) : undefined, tokens: c.price.tokens ? Math.round(c.price.tokens * (1 - d)) : undefined };
    return (
      <div className={`icard ${sel?.id === c.id ? 'on' : ''}`} style={{ ['--rc' as any]: RARITY_COLOR[c.rarity] }} onClick={() => { audio.click(); setSel(c); }} role="button" tabIndex={0}>
        {own ? <span className={`chip ${eq ? 'eq' : 'owned'}`}>{eq ? 'EQUIPPED' : 'OWNED'}</span> : c.shop === 'earned' ? <span className="chip earn">EARN</span> : null}
        <Thumb c={c} />
        <b>{c.name}</b>
        <span className="tag">{CAT_LABEL[c.cat]}</span>
        <div className="row" style={{ justifyContent: 'space-between' }}><RarityTag r={c.rarity} />{!own && c.shop !== 'earned' && <span>{d > 0 && <s className="muted" style={{ marginRight: 6, fontSize: 11 }}>{c.price.credits}</s>}<Currency credits={price.credits} tokens={price.tokens} /></span>}</div>
        <button className={`iconbtn ${wish ? 'on' : ''}`} style={{ position: 'absolute', right: 6, bottom: 40, width: 26, height: 26 }} aria-label="Wishlist" onClick={e => { e.stopPropagation(); st.toggleWishlist(c.id); }}><Icon name="heart" size={13} /></button>
      </div>
    );
  };

  const tabs = [{ id: 'featured', label: 'Featured' }, ...SHOP_GROUPS.map(g => ({ id: g.id, label: g.label })), { id: 'vehicles', label: 'Vehicles' }, { id: 'bundles', label: 'Bundles' }, { id: 'wish', label: `Wishlist (${p.wishlist.length})` }];
  const selOwn = sel ? p.owned.includes(sel.id) : false; const selDisc = sel ? disc(sel) : 0;
  const selPrice = sel ? { credits: sel.price.credits ? Math.round(sel.price.credits * (1 - selDisc)) : 0, tokens: sel.price.tokens ? Math.round(sel.price.tokens * (1 - selDisc)) : 0 } : { credits: 0, tokens: 0 };

  return (
    <div className="screen shop">
      <Back title="Shop" right={<Currency credits={p.credits} tokens={p.tokens} large />} />
      <div className="shop-bar" style={{ gridColumn: '1 / -1' }}>
        <Tabs value={tab} onChange={setTab} tabs={tabs} />
      </div>
      <div className="col" style={{ minHeight: 0 }}>
        {tab !== 'featured' && tab !== 'vehicles' && tab !== 'bundles' && (
          <div className="row">
            <label className="row" style={{ gap: 6 }}><Icon name="search" size={15} /><input type="search" placeholder="Search items" value={q} onChange={e => setQ(e.target.value)} aria-label="Search" /></label>
            <select value={rar} onChange={e => setRar(e.target.value)} aria-label="Rarity filter"><option value="all">All rarities</option>{RARITY_ORDER.map(r => <option key={r} value={r}>{RARITY_LABEL[r]}</option>)}</select>
            <Segmented value={sort} onChange={setSort} options={[{ v: 'rarity', label: 'Rarity' }, { v: 'price', label: 'Price' }, { v: 'name', label: 'Name' }]} />
            <label className="row" style={{ gap: 6, fontSize: 13 }}><input type="checkbox" checked={showOwned} onChange={e => setShowOwned(e.target.checked)} />Show owned</label>
          </div>
        )}
        <div className="scroll" style={{ paddingRight: 4 }}>
          {tab === 'featured' && (
            <>
              <div className="sub"><span>Weekly featured · {weekly.name} · −{Math.round(weekly.discount * 100)}%</span><span className="muted">resets in {tl.w}</span></div>
              <div className="items">{weekly.items.map(c => <Card key={c.id} c={c} d={weekly.discount} />)}</div>
              <div className="sub" style={{ marginTop: 18 }}><span>Daily rotation</span><span className="muted">resets in {tl.d}</span></div>
              <div className="items">{daily.map(c => <Card key={c.id} c={c} />)}</div>
              <p className="muted" style={{ fontSize: 12 }}>Everything here is bought with earned in-game currency. There are no loot boxes, no real-money purchases and no performance items.</p>
            </>
          )}
          {tab === 'vehicles' && (
            <div className="items">{VEHICLES.map(v => { const has = p.vehicles.includes(v.id); return (
              <div key={v.id} className="icard" style={{ ['--rc' as any]: RARITY_COLOR[v.rarity] }} role="button" tabIndex={0} onClick={() => st.go('garage')}>
                {has && <span className="chip owned">OWNED</span>}<b>{v.name}</b><span className="tag">{v.category}</span><RarityTag r={v.rarity} />
                {!has && <span className="row" style={{ justifyContent: 'space-between' }}><Currency credits={v.price} /><span className="muted" style={{ fontSize: 12 }}>Lv {v.unlockLevel}</span></span>}
              </div>); })}</div>
          )}
          {tab === 'bundles' && (
            <div className="items" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {BUNDLES.map(b => {
                const remaining = b.items.filter(i => !p.owned.includes(i)); const total = remaining.reduce((a, i) => a + (COSMETIC_MAP[i].price.credits ?? 0), 0); const tok = remaining.reduce((a, i) => a + (COSMETIC_MAP[i].price.tokens ?? 0), 0);
                const cost = { credits: Math.round(total * (1 - b.discount)), tokens: Math.round(tok * (1 - b.discount)) };
                return (
                  <div key={b.id} className="icard" style={{ ['--rc' as any]: '#25282D' }}>
                    <b>{b.name}</b><p className="desc" style={{ margin: 0 }}>{b.desc}</p>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--silver)' }}>{b.items.map(i => <li key={i} style={{ textDecoration: p.owned.includes(i) ? 'line-through' : 'none' }}>{COSMETIC_MAP[i].name} <em style={{ opacity: .6 }}>({CAT_LABEL[COSMETIC_MAP[i].cat]})</em></li>)}</ul>
                    <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">−{Math.round(b.discount * 100)}%</span><Btn small kind="primary" disabled={!remaining.length || !st.canAfford(cost)} onClick={() => { if (st.buyBundle(b.id)) { audio.purchase(); st.toast({ kind: 'reward', title: `${b.name} purchased` }); } }}>{remaining.length ? <>Buy <Currency credits={cost.credits} tokens={cost.tokens || undefined} /></> : 'Owned'}</Btn></div>
                  </div>);
              })}
            </div>
          )}
          {tab !== 'featured' && tab !== 'vehicles' && tab !== 'bundles' && (items.length ? <div className="items">{items.map(c => <Card key={c.id} c={c} d={disc(c)} />)}</div> : <div className="empty">{tab === 'wish' ? 'Your wishlist is empty. Tap the heart on any item.' : 'Nothing matches. Rotating items return on a later day.'}</div>)}
        </div>
      </div>
      <Panel title={sel ? sel.name : 'Item'} className="opts-panel">
        {!sel ? <p className="muted">Select an item to preview it on your {p.selected ? 'car' : 'vehicle'}.</p> : (
          <div className="col">
            <RarityTag r={sel.rarity} /><span className="muted">{CAT_LABEL[sel.cat]} · {sel.shop === 'earned' ? 'Earned reward' : sel.shop === 'rotating' ? (dailyIds.has(sel.id) ? 'Daily rotation' : weeklyIds.has(sel.id) ? 'Weekly featured' : 'Rotating (not in stock today)') : 'Permanent catalogue'}</span>
            {sel.shop === 'earned' && <p className="desc"><Icon name="trophy" size={14} /> {sel.earn}</p>}
            {['title', 'avatar', 'banner', 'garage'].includes(sel.cat) && <p className="muted" style={{ fontSize: 12 }}>This item appears on your profile / garage. Equip it after buying.</p>}
            {!selOwn && sel.shop !== 'earned' && <div className="row" style={{ justifyContent: 'space-between' }}><Currency credits={selPrice.credits || undefined} tokens={selPrice.tokens || undefined} large />{!available(sel) && <span className="warn">Not in stock today</span>}</div>}
            <div className="row">
              {selOwn ? <Btn kind="primary" icon="check" onClick={() => { st.equip(sel.cat, sel.id); audio.click(); st.toast({ kind: 'info', title: `${sel.name} equipped` }); }}>Equip</Btn>
                : sel.shop !== 'earned' && <Btn kind="primary" disabled={!available(sel) || !st.canAfford(selPrice)} onClick={() => setConfirm({ c: sel, disc: selDisc })}>{st.canAfford(selPrice) ? 'Buy' : 'Not enough currency'}</Btn>}
              <Btn icon="heart" onClick={() => st.toggleWishlist(sel.id)}>{p.wishlist.includes(sel.id) ? 'Remove from wishlist' : 'Wishlist'}</Btn>
            </div>
          </div>
        )}
      </Panel>
      {confirm && (
        <Modal title="Confirm purchase" onClose={() => setConfirm(null)}>
          <p>Buy <b>{confirm.c.name}</b> ({CAT_LABEL[confirm.c.cat]}) for</p>
          <p><Currency credits={Math.round((confirm.c.price.credits ?? 0) * (1 - confirm.disc)) || undefined} tokens={Math.round((confirm.c.price.tokens ?? 0) * (1 - confirm.disc)) || undefined} large /></p>
          <div className="row"><Btn kind="primary" onClick={() => { if (st.buyCosmetic(confirm.c.id, confirm.disc)) { audio.purchase(); st.toast({ kind: 'reward', title: `${confirm.c.name} purchased` }); } else audio.denied(); setConfirm(null); }}>Confirm</Btn><Btn kind="ghost" onClick={() => setConfirm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}
