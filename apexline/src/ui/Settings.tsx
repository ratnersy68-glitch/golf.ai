import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../game/store';
import { PRESETS, KEYS_DEFAULT } from '../game/progress';
import { Back } from './Campaign';
import { Btn, Panel, Slider, Toggle, Segmented, Tabs, Modal, Icon } from './kit';
import { audio } from '../audio/audio';
import { backendConfigured, signIn, currentUser, signOut, cloudPush, cloudPull } from '../net/backend';
import { CAMERA_NAMES } from '../game/cameras';
import { input } from './runtime';

const ACTIONS: [string, string][] = [['accel', 'Accelerate'], ['brake', 'Brake / Reverse'], ['left', 'Steer left'], ['right', 'Steer right'], ['handbrake', 'Handbrake'], ['restart', 'Restart track'], ['checkpoint', 'Restart from checkpoint'], ['camera', 'Change camera'], ['pause', 'Pause'], ['leaderboard', 'Leaderboard'], ['ghost', 'Toggle ghost']];
const codeName = (c: string) => c.replace('Key', '').replace('Arrow', '↔ ').replace('Digit', '');
const LV = ['Off', 'Low', 'Medium', 'High', 'Ultra'];

export function SettingsScreen() {
  const st = useStore(); const s = st.settings; const patch = st.patchSettings;
  const [tab, setTab] = useState<'gfx' | 'audio' | 'controls' | 'access' | 'data'>('gfx');
  const [listen, setListen] = useState<{ action: string; idx: number } | null>(null);
  const file = useRef<HTMLInputElement>(null); const [msg, setMsg] = useState(''); const [email, setEmail] = useState(''); const [user, setUser] = useState<string | null>(null);
  useEffect(() => { if (backendConfigured) currentUser().then(u => setUser(u?.email ?? null)); }, []);
  useEffect(() => {
    if (!listen) return;
    const h = (e: KeyboardEvent) => { e.preventDefault(); e.stopPropagation(); if (e.code !== 'Escape') patch(x => { const arr = x.keys[listen.action] ?? []; arr[listen.idx] = e.code; x.keys[listen.action] = arr.filter(Boolean); }); setListen(null); };
    window.addEventListener('keydown', h, true); return () => window.removeEventListener('keydown', h, true);
  }, [listen, patch]);
  const vol = (k: keyof typeof s.vol, label: string) => <Slider label={label} value={s.vol[k]} min={0} max={1} onChange={v => { patch(x => { x.vol[k] = v; }); }} fmt={v => Math.round(v * 100) + '%'} />;
  const lvl = (k: 'shadows' | 'reflections' | 'particles' | 'drawDistance', label: string) => <Slider label={label} value={s[k]} min={0} max={3} step={1} onChange={v => patch(x => { x[k] = v; x.preset = 'high'; })} fmt={v => LV[v]} />;
  return (
    <div className="screen">
      <Back title="Settings" />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'gfx', label: 'Graphics' }, { id: 'audio', label: 'Audio' }, { id: 'controls', label: 'Controls' }, { id: 'access', label: 'Gameplay & accessibility' }, { id: 'data', label: 'Save data & online' }]} />
      <div className="scroll"><div className="col" style={{ maxWidth: 760 }}>
        {tab === 'gfx' && (
          <>
            <div className="sub"><span>Preset</span></div>
            <Segmented value={s.preset} onChange={v => st.applyPreset(v)} options={(['potato', 'low', 'medium', 'high', 'ultra', 'cinematic'] as const).map(v => ({ v, label: v }))} />
            <Slider label="Resolution scale" value={s.resScale} min={0.4} max={1.5} step={0.05} onChange={v => patch(x => { x.resScale = v; })} fmt={v => Math.round(v * 100) + '%'} />
            {lvl('shadows', 'Shadow quality')}{lvl('reflections', 'Reflections')}{lvl('particles', 'Particles')}{lvl('drawDistance', 'Draw distance')}
            <Slider label="FPS limit" value={s.fpsLimit} min={0} max={240} step={30} onChange={v => patch(x => { x.fpsLimit = v; })} fmt={v => v === 0 ? 'Unlimited' : String(v)} />
            <Toggle label="Bloom" value={s.bloom} onChange={v => patch(x => { x.bloom = v; })} /><Toggle label="Ambient occlusion (GTAO)" value={s.ssao} onChange={v => patch(x => { x.ssao = v; })} />
            <Toggle label="Motion blur" value={s.motionBlur} onChange={v => patch(x => { x.motionBlur = v; })} /><Toggle label="Anti-aliasing (MSAA)" value={s.antialias} onChange={v => patch(x => { x.antialias = v; })} />
            <Toggle label="Show FPS counter" value={s.showFps} onChange={v => patch(x => { x.showFps = v; })} />
          </>
        )}
        {tab === 'audio' && <>{vol('master', 'Master')}{vol('music', 'Music')}{vol('engine', 'Engine')}{vol('env', 'Environment')}{vol('ui', 'Interface')}<Btn onClick={() => audio.checkpoint()}>Test sound</Btn></>}
        {tab === 'controls' && (
          <>
            <div className="sub"><span>Keyboard bindings (click a key to rebind; two slots per action)</span><Btn small onClick={() => patch(x => { x.keys = JSON.parse(JSON.stringify(KEYS_DEFAULT)); })}>Reset defaults</Btn></div>
            {ACTIONS.map(([a, label]) => <div className="bindrow" key={a}><span>{label}</span>{[0, 1].map(i => <button key={i} className="kbd" onClick={() => setListen({ action: a, idx: i })}>{listen?.action === a && listen.idx === i ? 'press key…' : codeName(s.keys[a]?.[i] ?? '—')}</button>)}</div>)}
            <div className="sub"><span>Gamepad {input.pad ? `— ${input.padName}` : '(none detected: press a button)'}</span></div>
            <p className="muted" style={{ fontSize: 12 }}>Xbox / PlayStation (standard mapping): RT / R2 accelerate, LT / L2 brake, left stick steer, A / Cross handbrake, Y / Triangle restart, B / Circle checkpoint, X / Square camera, LB ghost, Start pause, Select leaderboard.</p>
            <Slider label="Stick dead zone" value={s.deadzone} min={0} max={0.5} onChange={v => patch(x => { x.deadzone = v; })} /><Slider label="Steering sensitivity" value={s.steerSens} min={0.5} max={1.8} onChange={v => patch(x => { x.steerSens = v; })} />
            <Toggle label="Controller vibration" value={s.vibration} onChange={v => patch(x => { x.vibration = v; })} />
            <div className="sub"><span>Touch controls</span></div>
            <Slider label="Button size" value={s.touchScale} min={0.6} max={1.5} onChange={v => patch(x => { x.touchScale = v; })} /><Slider label="Opacity" value={s.touchOpacity} min={0.2} max={1} onChange={v => patch(x => { x.touchOpacity = v; })} />
            <Toggle label="Swap sides (pedals on the left)" value={s.touchLeft} onChange={v => patch(x => { x.touchLeft = v; })} />
          </>
        )}
        {tab === 'access' && (
          <>
            <Toggle label="Reduced motion (less FOV change, no shake, calmer UI)" value={s.reducedMotion} onChange={v => patch(x => { x.reducedMotion = v; if (v) x.cameraShake = 0; })} />
            <Slider label="Camera shake" value={s.cameraShake} min={0} max={1.5} onChange={v => patch(x => { x.cameraShake = v; })} />
            <div className="sub"><span>Colour-blind indicators</span></div>
            <Segmented value={s.colorblind} onChange={v => patch(x => { x.colorblind = v; })} options={[{ v: 'off', label: 'Off' }, { v: 'deuter', label: 'Deuteranopia' }, { v: 'protan', label: 'Protanopia' }, { v: 'tritan', label: 'Tritanopia' }]} />
            <p className="muted" style={{ fontSize: 12 }}>Time gained/lost also uses ± signs and arrows, never colour alone.</p>
            <div className="sub"><span>Speed unit</span></div><Segmented value={s.units} onChange={v => patch(x => { x.units = v; })} options={[{ v: 'kmh', label: 'km/h' }, { v: 'mph', label: 'mph' }]} />
            <div className="sub"><span>Default camera</span></div><Segmented value={s.camera} onChange={v => patch(x => { x.camera = v; })} options={CAMERA_NAMES.slice(0, 7).map((n, i) => ({ v: i, label: n }))} />
            <div className="sub"><span>HUD</span></div>
            <Toggle label="Speedometer" value={s.hud.speed} onChange={v => patch(x => { x.hud.speed = v; })} /><Toggle label="Mini-map" value={s.hud.minimap} onChange={v => patch(x => { x.hud.minimap = v; })} />
            <Toggle label="Time delta" value={s.hud.delta} onChange={v => patch(x => { x.hud.delta = v; })} /><Toggle label="Track progress bar" value={s.hud.progress} onChange={v => patch(x => { x.hud.progress = v; })} /><Toggle label="Input display" value={s.hud.keys} onChange={v => patch(x => { x.hud.keys = v; })} />
            <Slider label="HUD scale (0 = hidden / cinematic)" value={s.hud.scale} min={0} max={1.6} step={0.1} onChange={v => patch(x => { x.hud.scale = v; })} />
            <Toggle label="Ghost visible by default" value={s.ghost} onChange={v => patch(x => { x.ghost = v; })} />
            <div className="sub"><span>Default ghost</span></div>
            <Segmented value={s.ghostKind} onChange={v => patch(x => { x.ghostKind = v; })} options={[{ v: 'pb', label: 'Personal best' }, { v: 'gold', label: 'Gold' }, { v: 'platinum', label: 'Platinum' }, { v: 'bench', label: 'Benchmark' }]} />
            <Toggle label="Instant restart (short 0.9 s lead-in instead of a full countdown)" value={s.instantRestart} onChange={v => patch(x => { x.instantRestart = v; })} />
          </>
        )}
        {tab === 'data' && (
          <>
            <p className="muted">Progress saves automatically in this browser (IndexedDB) with versioned migrations. Export a backup or move it to another device.</p>
            <div className="row">
              <Btn icon="save" onClick={async () => { const j = await st.exportSave(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([j], { type: 'application/json' })); a.download = `apexline-save-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setMsg('Save exported.'); }}>Export save</Btn>
              <Btn icon="up" onClick={() => file.current?.click()}>Import save</Btn><input ref={file} type="file" accept="application/json" hidden onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const ok = await st.importSave(await f.text()); setMsg(ok ? 'Save imported.' : 'That file is not a valid APEXLINE save.'); }} />
              <Btn kind="danger" icon="trash" onClick={() => { if (confirm('Delete ALL progress on this device? This cannot be undone.')) st.resetAll(); }}>Reset all progress</Btn>
            </div>
            {msg && <p className="good">{msg}</p>}
            <div className="sub"><span>Online services</span></div>
            {!backendConfigured ? <p className="warn"><Icon name="globe" size={14} /> Not configured. Cloud sync, online leaderboards and multiplayer stay disabled until a Supabase project is connected (docs/BACKEND.md). Nothing online is simulated.</p> : (
              <div className="col">
                {user ? <><p>Signed in as <b>{user}</b></p><div className="row"><Btn onClick={async () => { const r = await cloudPush(JSON.parse(await st.exportSave())); setMsg(r.ok ? 'Uploaded to cloud.' : 'Upload failed: ' + r.error); }}>Upload save</Btn><Btn onClick={async () => { const r = await cloudPull(); if (r.ok && r.data) { await st.importSave(JSON.stringify(r.data)); setMsg('Cloud save loaded.'); } else setMsg('No cloud save: ' + (r.error ?? 'empty')); }}>Download save</Btn><Btn kind="ghost" onClick={async () => { await signOut(); setUser(null); }}>Sign out</Btn></div></> :
                  <div className="row"><input type="text" placeholder="email for magic link" value={email} onChange={e => setEmail(e.target.value)} /><Btn onClick={async () => { const r = await signIn(email); setMsg(r.ok ? 'Check your inbox for the sign-in link.' : r.error ?? 'failed'); }}>Send sign-in link</Btn></div>}
              </div>)}
          </>
        )}
      </div></div>
    </div>
  );
}
