import React, { useEffect, useRef, useState } from 'react';
import { useStore, Screen } from '../game/store';
import { initGfx, getGfx } from '../game/host';
import { Showroom } from '../game/showroom';
import { loadKit } from '../game/kit';
import { loadTrackKit } from '../game/trackkit';
import { recommendSettings } from '../game/recommend';
import { loadCampaign, campaignSync, dailyTrackId } from '../game/campaign';
import { input } from './runtime';
import { audio } from '../audio/audio';
import { defaultSetup, sanitiseSetup, levelFromXp, divisionOf, PRESTIGE_NAMES, dayId, MEDAL_NAMES } from '../game/progress';
import { Btn, Icon, Currency, Modal, MedalChip } from './kit';
import { RaceScreen } from './RaceScreen';
import { CampaignScreen } from './Campaign';
import { fmtTime } from '../sim/replay';
import { COSMETIC_MAP } from '../data/cosmetics';
import { VEHICLE_MAP } from '../data/vehicles';
import { Toasts } from './Toasts';
import { CHAPTERS_INFO } from '../data/chapters';

// Secondary screens are code-split: they are fetched the first time they are opened (and prefetched when the browser is idle).
const GarageScreen = React.lazy(() => import('./Garage').then(x => ({ default: x.GarageScreen })));
const ShopScreen = React.lazy(() => import('./Shop').then(x => ({ default: x.ShopScreen })));
const ProfileScreen = React.lazy(() => import('./Profile').then(x => ({ default: x.ProfileScreen })));
const SettingsScreen = React.lazy(() => import('./Settings').then(x => ({ default: x.SettingsScreen })));
const RankedScreen = React.lazy(() => import('./Ranked').then(x => ({ default: x.RankedScreen })));
const LeaderboardsScreen = React.lazy(() => import('./Leaderboards').then(x => ({ default: x.LeaderboardsScreen })));
const ModesScreen = React.lazy(() => import('./Modes').then(x => ({ default: x.ModesScreen })));
const EditorScreen = React.lazy(() => import('./Editor').then(x => ({ default: x.EditorScreen })));
const AchievementsScreen = React.lazy(() => import('./Achievements').then(x => ({ default: x.AchievementsScreen })));
const prefetchScreens = () => { for (const m of [() => import('./Garage'), () => import('./Shop'), () => import('./Settings'), () => import('./Profile')]) m().catch(() => {}); };

export function App() {
  const ready = useStore(s => s.ready); const screen = useStore(s => s.screen);
  const settings = useStore(s => s.settings);
  const init = useStore(s => s.init);
  const [loaded, setLoaded] = useState(false); const [err, setErr] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gfxReady, setGfxReady] = useState(false);

  useEffect(() => { init(); Promise.all([loadCampaign(), loadKit(), loadTrackKit().catch(() => null)]).then(() => { setLoaded(true); ((window as any).requestIdleCallback ?? setTimeout)(prefetchScreens, 1500); }).catch(e => setErr(String(e.message ?? e))); }, [init]);
  // first launch only: measure this device and pick a graphics preset (skipped under automation; can be re-run from Settings)
  useEffect(() => {
    if (!gfxReady || !loaded || settings.autoTuned || (navigator as any).webdriver) return;
    const id = setTimeout(async () => { const r = await recommendSettings(); const st = useStore.getState(); st.applyPreset(r.preset); st.patchSettings(x => { x.autoTuned = true; }); st.toast({ kind: 'info', title: 'Graphics tuned', body: `Preset “${r.preset}” chosen from a quick benchmark (${r.msPerFrame} ms). Change it in Settings.` }); }, 2500);
    return () => clearTimeout(id);
  }, [gfxReady, loaded, settings.autoTuned]);
  useEffect(() => {
    if (!ready || !canvasRef.current) return;
    try { const g = initGfx(canvasRef.current, useStore.getState().settings); audio.init(useStore.getState().settings); setGfxReady(true); void g; }
    catch (e: any) { setErr('WebGL 2 is required to run APEXLINE. ' + (e?.message ?? '')); }
  }, [ready]);
  useEffect(() => { input.settings = settings; audio.settings = settings; audio.applyVolumes(); if (gfxReady) { try { getGfx().applySettings(settings); } catch { /* ignore */ } } }, [settings, gfxReady]);
  useEffect(() => { document.documentElement.dataset.cb = settings.colorblind; document.documentElement.dataset.rm = settings.reducedMotion ? '1' : '0'; }, [settings.colorblind, settings.reducedMotion]);
  // unlock audio on first gesture
  useEffect(() => { const f = () => { audio.init(useStore.getState().settings); audio.resume(); audio.startMusic('menu'); window.removeEventListener('pointerdown', f); window.removeEventListener('keydown', f); }; window.addEventListener('pointerdown', f); window.addEventListener('keydown', f); return () => { window.removeEventListener('pointerdown', f); window.removeEventListener('keydown', f); }; }, []);

  const inRace = screen === 'race' || screen === 'replay';
  return (
    <div className="app">
      <canvas ref={canvasRef} className="gl" />
      {gfxReady && loaded && !inRace && <ShowroomHost screen={screen} />}
      {err && <div className="boot"><div className="boot-card"><h1>APEXLINE</h1><p>{err}</p></div></div>}
      {!err && (!ready || !loaded || !gfxReady) && <div className="boot"><div className="boot-card"><h1>APEXLINE</h1><p className="muted">Loading track data…</p><div className="loadbar"><i /></div></div></div>}
      {!err && ready && loaded && gfxReady && (
        <>
          <React.Suspense fallback={null}>
          {screen === 'menu' && <MenuScreen />}
          {screen === 'campaign' && <CampaignScreen />}
          {screen === 'garage' && <GarageScreen />}
          {screen === 'shop' && <ShopScreen />}
          {screen === 'profile' && <ProfileScreen />}
          {screen === 'achievements' && <AchievementsScreen />}
          {screen === 'settings' && <SettingsScreen />}
          {screen === 'ranked' && <RankedScreen />}
          {screen === 'leaderboards' && <LeaderboardsScreen />}
          {screen === 'modes' && <ModesScreen />}
          {screen === 'editor' && <EditorScreen />}
          {screen === 'race' && <RaceScreen />}
          {screen === 'replay' && <ReplayHost />}
          </React.Suspense>
        </>
      )}
      <FullscreenButton />
      <Toasts />
    </div>
  );
}

function ReplayHost() {
  const r = (window as any).__replay; const go = useStore(s => s.go);
  useEffect(() => { if (!r) go('campaign'); }, [r, go]);
  if (!r) return null;
  const spec = { mode: 'timetrial' as const, trackId: r.trackId, practice: true };
  // RaceScreen reads the active spec from the store; ensure it is set for the replay viewer
  if (useStore.getState().race?.trackId !== r.trackId) useStore.setState({ race: spec });
  return <RaceScreen replay={r} />;
}

/** Drives the 3D showroom behind the menu / garage / shop screens. */
function ShowroomHost({ screen }: { screen: Screen }) {
  const profile = useStore(s => s.profile);
  const ref = useRef<Showroom | null>(null);
  const preview = useStore(s => (s as any).previewSetup) as any;
  const mode = screen === 'garage' || screen === 'shop' ? 'garage' : 'menu';
  useEffect(() => {
    const gfx = getGfx(); const sr = new Showroom(gfx, mode); sr.enter(); ref.current = sr; (window as any).__apx = { ...(window as any).__apx, sr };
    let raf = 0, last = performance.now();
    sr.offsetX = mode === 'menu' ? -0.7 : 0;
    const loop = (t: number) => { raf = requestAnimationFrame(loop); const dt = Math.min(0.05, (t - last) / 1000); last = t; sr.frame(dt); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); sr.exit(); ref.current = null; };
  }, [mode]);
  useEffect(() => {
    const sr = ref.current; if (!sr) return;
    const base = sanitiseSetup(profile, profile.setups[profile.selected] ?? defaultSetup(profile.selected));
    sr.setSetup(preview ?? base, (profile as any).garageEnv);
  }, [profile, preview, mode]);
  const focusCat = useStore(s => (s as any).shopFocus) as string | null | undefined;
  useEffect(() => { const sr = ref.current; if (sr && mode === 'garage') sr.focusPart(focusCat ?? null); }, [focusCat, mode]);
  useEffect(() => { const sr = ref.current; if (!sr) return; sr.targetDist = screen === 'garage' ? 7.4 : screen === 'shop' ? 7.4 : screen === 'menu' ? 11 : 12; }, [screen]);
  return null;
}

// ------------------------------------------------------------------------------------------------ main menu
function MenuScreen() {
  const st = useStore(); const p = st.profile; const go = st.go;
  const lv = levelFromXp(p.xp); const div = divisionOf(p.ranked.rating);
  const camp = campaignSync()!;
  const day = dayId(); const dailyId = dailyTrackId(day); const daily = camp.tracks[dailyId - 1];
  const recent = Object.entries(p.records).filter(([, r]) => r.lastPlayed).sort((a, b) => (b[1].lastPlayed ?? 0) - (a[1].lastPlayed ?? 0))[0];
  const veh = VEHICLE_MAP[p.selected];
  // next unfinished campaign track
  let nextId = 1; for (let i = 1; i <= 275; i++) { if (!p.records[i]?.finishes) { nextId = i; break; } nextId = Math.min(275, i + 1); }
  const featured = camp.tracks[(Math.floor(Date.parse(day) / 86400000 * 7) % 275 + 275) % 275];
  const items: { id: Screen; label: string; icon: string }[] = [
    { id: 'campaign', label: 'Campaign', icon: 'flag' }, { id: 'modes', label: 'Play Modes', icon: 'play' }, { id: 'ranked', label: 'Ranked', icon: 'trophy' }, { id: 'garage', label: 'Garage', icon: 'car' }, { id: 'shop', label: 'Shop', icon: 'bag' },
    { id: 'editor', label: 'Track Editor', icon: 'edit' }, { id: 'leaderboards', label: 'Leaderboards', icon: 'globe' }, { id: 'profile', label: 'Profile', icon: 'user' }, { id: 'settings', label: 'Settings', icon: 'cog' },
  ];
  return (
    <div className="screen menu">
      <header className="menu-top">
        <div className="brand"><b>APEX<span>LINE</span></b><small>Every Millisecond Matters.</small></div>
        <div className="pstrip" onClick={() => go('profile')} role="button" tabIndex={0}>
          <div className="lvl"><b>{p.prestige ? PRESTIGE_NAMES[p.prestige].slice(0, 3).toUpperCase() : 'LV'} {lv.level}</b><i><u style={{ width: `${(lv.into / lv.need) * 100}%` }} /></i></div>
          <div className="rk"><small>RANK</small><b>{p.ranked.placements >= 5 ? div.name : 'Unplaced'}</b></div>
          <Currency credits={p.credits} tokens={p.tokens} />
        </div>
      </header>
      <nav className="menu-nav">
        <Btn kind="primary" className="big" onClick={() => st.startRace({ mode: 'campaign', trackId: nextId })} icon="play">Continue · Track {nextId}</Btn>
        {items.map(i => <button key={i.id} className="navitem" onMouseEnter={() => audio.hover()} onClick={() => { audio.click(); go(i.id); }}><Icon name={i.icon} />{i.label}</button>)}
      </nav>
      <aside className="menu-cards">
        <div className="mcard" onClick={() => daily && st.startRace({ mode: 'daily', trackId: dailyId })} role="button" tabIndex={0}>
          <small>DAILY TRACK · RESETS 00:00 UTC</small><h4>#{String(dailyId).padStart(3, '0')} {daily?.name}</h4>
          <p>{fmtTime(p.records[dailyId]?.bestMs)} <em>personal best</em></p>
        </div>
        <div className="mcard" onClick={() => go('profile')} role="button" tabIndex={0}>
          <small>DAILY CHALLENGES</small>
          {p.daily.list.map(c => <p key={c.id} className={c.done ? 'done' : ''}><Icon name={c.done ? 'check' : 'flag'} size={13} />{c.desc} <em>{c.progress >= 1 ? Math.floor(c.progress) : 0}/{c.target}</em></p>)}
        </div>
        <div className="mcard" onClick={() => featured && st.startRace({ mode: 'timetrial', trackId: featured.id })} role="button" tabIndex={0}>
          <small>FEATURED TRACK · {CHAPTERS_INFO[featured.chapter - 1].name.toUpperCase()}</small><h4>#{String(featured.id).padStart(3, '0')} {featured.name}</h4>
          <p>Simulated benchmark <em>{fmtTime(featured.meta.bench.ms)}</em></p>
        </div>
        {recent && (
          <div className="mcard" onClick={() => st.startRace({ mode: 'timetrial', trackId: +recent[0] })} role="button" tabIndex={0}>
            <small>RECENT PERSONAL BEST</small><h4>#{String(recent[0]).padStart(3, '0')} {camp.tracks[+recent[0] - 1]?.name}</h4>
            <p><MedalChip medal={recent[1].medal} size={16} /> {fmtTime(recent[1].bestMs)}</p>
          </div>
        )}
      </aside>
      <footer className="menu-foot"><span>{veh?.name} · {veh?.category}</span><span>Offline mode — online leaderboards need a backend (see README)</span></footer>
    </div>
  );
}

export { MEDAL_NAMES, COSMETIC_MAP, Modal };

export function toggleFullscreen() {
  const d = document as any, el = document.documentElement as any;
  if (document.fullscreenElement || d.webkitFullscreenElement) (document.exitFullscreen ?? d.webkitExitFullscreen)?.call(document);
  else (el.requestFullscreen ?? el.webkitRequestFullscreen)?.call(el)?.catch?.(() => {});
}

/** Always-visible fullscreen toggle (also bound to the F key). Works inside an iframe when the embed has allowfullscreen. */
function FullscreenButton() {
  const [fs, setFs] = useState(false);
  useEffect(() => {
    const on = () => setFs(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
    const key = (e: KeyboardEvent) => { const t = e.target as HTMLElement; if (e.code === 'KeyF' && !e.repeat && !e.ctrlKey && !e.metaKey && t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA') toggleFullscreen(); };
    document.addEventListener('fullscreenchange', on); document.addEventListener('webkitfullscreenchange', on); window.addEventListener('keydown', key);
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on); window.removeEventListener('keydown', key); };
  }, []);
  return <button className="fsbtn" onClick={() => { audio.click(); toggleFullscreen(); }} title="Fullscreen (F)" aria-label={fs ? 'Exit fullscreen' : 'Enter fullscreen'}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{fs ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}</svg></button>;
}
