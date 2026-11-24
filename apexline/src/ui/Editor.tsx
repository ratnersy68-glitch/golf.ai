import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useStore } from '../game/store';
import { PieceDef, buildTrack, Track, F_GAP, F_BOOST, F_NOWALL, F_CP, F_TUNNEL, F_BRIDGE, DS, SURF_ASPHALT, SURF_DIRT, SURF_GRASS, SURF_ICE, SURF_SAND, SURF_STEEL } from '../sim/track';
import { validateGeometry } from '../sim/trackgen';
import type { CustomTrackSave } from '../game/types';
import { Back } from './Campaign';
import { Btn, Icon, Panel, Slider, Toggle, Modal } from './kit';
import { CHAPTERS_INFO } from '../data/chapters';

const DEG = Math.PI / 180;
const ENVS = CHAPTERS_INFO.map(c => ({ v: c.env, label: c.name }));
const SURFS = [['Asphalt', SURF_ASPHALT], ['Dirt', SURF_DIRT], ['Grass', SURF_GRASS], ['Ice', SURF_ICE], ['Sand', SURF_SAND], ['Steel', SURF_STEEL]] as const;

const template = (): PieceDef[] => [{ k: 'start', l: 44, w: 14 }, { k: 'straight', l: 120, w: 14 }, { k: 'curve', l: 50, y: 0.9, w: 14 }, { k: 'straight', l: 100, w: 14, f: F_CP }, { k: 'straight', l: 70, w: 14, f: F_CP }, { k: 'finish', l: 60, w: 14 }];

const PALETTE: { id: string; label: string; make: (w: number) => PieceDef[] }[] = [
  { id: 'straight', label: 'Straight', make: w => [{ k: 'straight', l: 60, w }] },
  { id: 'cl', label: 'Curve Left', make: w => [{ k: 'curve', l: 48, y: 0.8, w }] }, { id: 'cr', label: 'Curve Right', make: w => [{ k: 'curve', l: 48, y: -0.8, w }] },
  { id: 'hp', label: 'Hairpin', make: w => [{ k: 'curve', l: 110, y: 3.0, w: w + 3 }] },
  { id: 'bl', label: 'Banked Left', make: w => [{ k: 'bank', l: 70, y: 1.1, b: 0.45, w }] }, { id: 'br', label: 'Banked Right', make: w => [{ k: 'bank', l: 70, y: -1.1, b: 0.45, w }] },
  { id: 'climb', label: 'Incline', make: w => [{ k: 'climb', l: 80, p: 0.12, w }] }, { id: 'drop', label: 'Decline', make: w => [{ k: 'drop', l: 80, p: -0.12, w }] },
  { id: 'jump', label: 'Jump', make: w => [{ k: 'straight', l: 80, w }, { k: 'ramp', l: 12, dp: 0.25, w }, { k: 'jump', l: 16, dp: -0.5, f: F_GAP, w }, { k: 'land', l: 16, dp: 0.25, w }, { k: 'straight', l: 40, w, f: F_CP }] },
  { id: 'loop', label: 'Full Loop', make: () => [{ k: 'straight', l: 120, f: F_BOOST, w: 12 }, { k: 'loop', l: 2 * Math.PI * 16, dp: 2 * Math.PI, y: 0.62, w: 12 }, { k: 'straight', l: 40, w: 12, f: F_CP }] },
  { id: 'cork', label: 'Corkscrew', make: () => [{ k: 'straight', l: 140, f: F_BOOST, w: 12 }, { k: 'cork', l: 2 * Math.PI * 22, dp: 2 * Math.PI, r: 0.8, y: 0.7, w: 12 }, { k: 'straight', l: 40, w: 12, f: F_CP }] },
  { id: 'pipe', label: 'Halfpipe', make: w => [{ k: 'halfpipe', l: 100, y: 1.2, b: 1.0, w: w + 8 }] },
  { id: 'boost', label: 'Boost Pad', make: w => [{ k: 'straight', l: 100, f: F_BOOST, w: w + 2 }] },
  { id: 'narrow', label: 'Narrow Bridge', make: () => [{ k: 'straight', l: 20, w: 14, w2: 7 }, { k: 'narrow', l: 90, w: 7, f: F_NOWALL }, { k: 'straight', l: 20, w: 7, w2: 14 }] },
  { id: 'ice', label: 'Ice Patch', make: w => [{ k: 'straight', l: 60, s: SURF_ICE, w }] }, { id: 'dirt', label: 'Dirt', make: w => [{ k: 'straight', l: 60, s: SURF_DIRT, w }] },
  { id: 'grass', label: 'Grass', make: w => [{ k: 'straight', l: 60, s: SURF_GRASS, w }] }, { id: 'tunnel', label: 'Tunnel', make: w => [{ k: 'straight', l: 100, f: F_TUNNEL, w }] },
  { id: 'bridge', label: 'Bridge', make: w => [{ k: 'straight', l: 100, f: F_BRIDGE, w }] },
];

export function parseTrackFile(text: string): CustomTrackSave | null {
  try {
    const j = JSON.parse(text);
    if (j.format !== 'apexline-track' || !Array.isArray(j.pieces) || j.pieces.length < 2 || j.pieces.length > 400) return null;
    const ok = j.pieces.every((p: any) => typeof p.k === 'string' && isFinite(p.l) && p.l > 0 && p.l < 2000);
    if (!ok) return null;
    return { id: 'c' + Date.now() + Math.floor(Math.random() * 999), name: String(j.name ?? 'Imported track').slice(0, 32), created: Date.now(), updated: Date.now(), pieces: j.pieces, env: String(j.env ?? 'formula'), obstacles: j.obstacles, author: String(j.author ?? 'Unknown').slice(0, 24), verified: false };
  } catch { return null; }
}

function Viewport({ track, sel }: { track: Track; sel: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<{ yaw: number; pitch: number; dist: number; target: THREE.Vector3; fit: boolean; update?: (t: Track, s: number[]) => void }>({ yaw: 0.7, pitch: 0.8, dist: 300, target: new THREE.Vector3(), fit: true });
  useEffect(() => {
    const cv = ref.current!; let renderer: THREE.WebGLRenderer; try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(45, 1, 1, 20000);
    scene.add(new THREE.HemisphereLight('#fff', '#303844', 1.5)); const dl = new THREE.DirectionalLight('#fff', 2); dl.position.set(1, 2, 1); scene.add(dl);
    const grid = new THREE.GridHelper(4000, 80, '#3a414c', '#242830'); scene.add(grid);
    let group: THREE.Group | null = null; const S = state.current;
    S.update = (tr: Track, selIdx: number[]) => {
      if (group) { scene.remove(group); group.traverse(o => { (o as THREE.Mesh).geometry?.dispose(); }); }
      group = new THREE.Group(); const pos: number[] = [], col: number[] = [], idx: number[] = []; const c = new THREE.Color();
      let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, minZ = 1e9, maxZ = -1e9;
      const selRanges = selIdx.map(k => [tr.pieceStart[k], (tr.pieceStart[k + 1] ?? tr.n)] as const);
      for (let i = 0; i < tr.n; i++) {
        minX = Math.min(minX, tr.px[i]); maxX = Math.max(maxX, tr.px[i]); minY = Math.min(minY, tr.py[i]); maxY = Math.max(maxY, tr.py[i]); minZ = Math.min(minZ, tr.pz[i]); maxZ = Math.max(maxZ, tr.pz[i]);
        const w = tr.w[i] / 2; const isSel = selRanges.some(([a, b]) => i >= a && i < b);
        c.set(isSel ? '#25282D' : tr.flags[i] & F_GAP ? '#D8DCE0' : tr.flags[i] & F_BOOST ? '#7fd1ff' : tr.surf[i] === SURF_ICE ? '#9FD6FF' : tr.surf[i] === SURF_DIRT ? '#a37a4e' : tr.surf[i] === SURF_GRASS ? '#5da24a' : '#8a919c');
        for (const sd of [-1, 1]) { pos.push(tr.px[i] + tr.rx[i] * sd * w, tr.py[i] + tr.ry[i] * sd * w, tr.pz[i] + tr.rz[i] * sd * w); col.push(c.r, c.g, c.b); }
        if (i < tr.n - 1 && !(tr.flags[i] & F_GAP) && !(tr.flags[i + 1] & F_GAP)) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
      group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: .7 })));
      const mk = (i: number, color: string, r: number) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ color })); m.position.set(tr.px[i], tr.py[i] + r, tr.pz[i]); group!.add(m); };
      mk(2, '#25282D', 5); mk(tr.finish, '#ffffff', 5); tr.cps.forEach(i => mk(i, '#ffb84d', 3));
      scene.add(group);
      grid.position.y = minY - 2;
      if (S.fit) { S.target.set((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2); S.dist = Math.max(120, Math.max(maxX - minX, maxZ - minZ, maxY - minY) * 1.25); S.fit = false; }
    };
    S.update(track, sel);
    let drag = false, lx = 0, ly = 0, pan = false;
    const down = (e: PointerEvent) => { drag = true; pan = e.button === 2 || e.shiftKey; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!drag) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      if (pan) { const r = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 0), u = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 1); S.target.addScaledVector(r, -dx * S.dist * 0.0015).addScaledVector(u, dy * S.dist * 0.0015); }
      else { S.yaw -= dx * 0.01; S.pitch = Math.max(0.05, Math.min(1.5, S.pitch + dy * 0.008)); } };
    const up = () => { drag = false; }; const wheel = (e: WheelEvent) => { S.dist = Math.max(30, Math.min(8000, S.dist * (1 + e.deltaY * 0.001))); e.preventDefault(); };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('wheel', wheel, { passive: false }); cv.addEventListener('contextmenu', e => e.preventDefault());
    let raf = 0; const loop = () => { raf = requestAnimationFrame(loop); const w = cv.clientWidth, h = cv.clientHeight; if (w && cv.width !== Math.round(w * renderer.getPixelRatio())) { renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
      cam.position.set(S.target.x + Math.sin(S.yaw) * Math.cos(S.pitch) * S.dist, S.target.y + Math.sin(S.pitch) * S.dist, S.target.z + Math.cos(S.yaw) * Math.cos(S.pitch) * S.dist); cam.lookAt(S.target); renderer.render(scene, cam); }; loop();
    return () => { cancelAnimationFrame(raf); cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('wheel', wheel); renderer.dispose(); S.update = undefined; };
  }, []);
  useEffect(() => { state.current.update?.(track, sel); }, [track, sel]);
  return <canvas ref={ref} className="preview3d" style={{ height: '100%', minHeight: 300 }} aria-label="Track editor viewport. Drag to orbit, shift-drag to pan, scroll to zoom." />;
}

export function EditorScreen() {
  const st = useStore(); const p = st.profile;
  const [pieces, setPieces] = useState<PieceDef[]>(template);
  const [sel, setSel] = useState<number[]>([1]);
  const [name, setName] = useState('My Track'); const [env, setEnv] = useState('formula'); const [id, setId] = useState<string | null>(null);
  const [past, setPast] = useState<PieceDef[][]>([]); const [future, setFuture] = useState<PieceDef[][]>([]);
  const [clip, setClip] = useState<PieceDef[]>([]);
  const [report, setReport] = useState<any>(null); const [busy, setBusy] = useState(false); const [showLoad, setShowLoad] = useState(false);
  const commit = (next: PieceDef[], s?: number[]) => { setPast(h => [...h.slice(-80), pieces]); setFuture([]); setPieces(next); if (s) setSel(s); setReport(null); };
  const track = useMemo(() => { try { return buildTrack({ id: 0, name, chapter: 0, env, seed: 1, pieces }); } catch { return buildTrack({ id: 0, name, chapter: 0, env, seed: 1, pieces: template() }); } }, [pieces, env, name]);
  const geo = useMemo(() => validateGeometry({ id: 0, name, chapter: 0, env, seed: 1, pieces }), [pieces, env, name]);
  const first = Math.min(...sel), last = Math.max(...sel); const cur = pieces[last];
  const lockedIdx = (i: number) => pieces[i]?.k === 'start' || pieces[i]?.k === 'finish';
  const insertAt = () => (sel.length ? Math.min(last + 1, pieces.length - 1) : pieces.length - 1);
  const curW = cur?.w ?? 14;
  const add = (mk: (w: number) => PieceDef[]) => { const at = insertAt(); const ps = mk(curW); const n = [...pieces.slice(0, at), ...ps, ...pieces.slice(at)]; commit(n, ps.map((_, i) => at + i)); };
  const edit = (patch: Partial<PieceDef>) => { if (lockedIdx(last) && ('y' in patch || 'dp' in patch || 'p' in patch)) return; commit(pieces.map((q, i) => sel.includes(i) ? { ...q, ...patch } : q)); };
  const del = () => { const keep = pieces.filter((_, i) => !sel.includes(i) || lockedIdx(i)); if (keep.length !== pieces.length) commit(keep, [Math.max(0, first - 1)]); };
  const dup = () => { const ps = sel.map(i => ({ ...pieces[i] })).filter(q => q.k !== 'start' && q.k !== 'finish'); if (!ps.length) return; const at = last + 1; commit([...pieces.slice(0, at), ...ps, ...pieces.slice(at)], ps.map((_, i) => at + i)); };
  const move = (dir: -1 | 1) => { const i = last; const j = i + dir; if (j < 1 || j >= pieces.length - 1 || lockedIdx(i) || sel.length !== 1) return; const n = [...pieces]; [n[i], n[j]] = [n[j], n[i]]; commit(n, [j]); };
  const undo = () => { if (!past.length) return; setFuture([pieces, ...future]); setPieces(past[past.length - 1]); setPast(past.slice(0, -1)); setReport(null); };
  const redo = () => { if (!future.length) return; setPast([...past, pieces]); setPieces(future[0]); setFuture(future.slice(1)); setReport(null); };
  const click = (i: number, e: React.MouseEvent) => { if (e.shiftKey && sel.length) { const a = Math.min(sel[0], i), b = Math.max(sel[0], i); setSel(Array.from({ length: b - a + 1 }, (_, k) => a + k)); } else if (e.ctrlKey || e.metaKey) setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]); else setSel([i]); };
  useEffect(() => { const h = (e: KeyboardEvent) => { const t = e.target as HTMLElement; if (t.tagName === 'INPUT' || t.tagName === 'SELECT') return; if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') { e.preventDefault(); e.shiftKey ? redo() : undo(); } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') { e.preventDefault(); redo(); } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC') setClip(sel.map(i => ({ ...pieces[i] })).filter(q => q.k !== 'start' && q.k !== 'finish')); else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyV') { e.preventDefault(); if (clip.length) add(() => clip.map(q => ({ ...q }))); } else if (e.code === 'Delete') del(); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); });
  const save = (verified?: boolean): string => {
    const sid = id ?? 'c' + Date.now(); setId(sid);
    st.patchProfile(q => { const ex = q.customTracks.find(t => t.id === sid); const rec: CustomTrackSave = { id: sid, name, env, pieces, created: ex?.created ?? Date.now(), updated: Date.now(), author: q.name, verified: verified ?? ex?.verified ?? false, bestMs: ex?.bestMs, plays: ex?.plays }; if (ex) Object.assign(ex, rec); else q.customTracks.push(rec); });
    return sid;
  };
  const validate = () => {
    setBusy(true); setReport(null);
    const w = new Worker(new URL('../sim/validate.worker.ts', import.meta.url), { type: 'module' });
    w.onmessage = e => { setReport(e.data); setBusy(false); w.terminate(); if (e.data.finished && e.data.replayOk) save(true); };
    w.onerror = () => { setReport({ finished: false, reason: 'validation worker failed' }); setBusy(false); };
    w.postMessage({ def: { id: 0, name, chapter: 0, env, seed: 1, pieces }, budget: 500 });
  };
  const exportFile = () => { const j = JSON.stringify({ format: 'apexline-track', version: 1, name, env, author: p.name, pieces }, null, 1); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([j], { type: 'application/json' })); a.download = `${name.replace(/\W+/g, '_')}.apxtrack`; a.click(); };
  const importRef = useRef<HTMLInputElement>(null);
  const num = (v: number | undefined, d = 0) => Number.isFinite(v as number) ? +(v as number).toFixed(d) : 0;
  return (
    <div className="screen editor">
      <Back title="Track Editor" right={<div className="row">
        <Btn small icon="undo" disabled={!past.length} onClick={undo}>Undo</Btn><Btn small disabled={!future.length} onClick={redo}>Redo</Btn>
        <Btn small icon="save" onClick={() => { save(); st.toast({ kind: 'info', title: 'Track saved', body: name }); }}>Save</Btn><Btn small onClick={() => setShowLoad(true)}>Load</Btn>
        <Btn small icon="up" onClick={exportFile}>Export</Btn><Btn small icon="down" onClick={() => importRef.current?.click()}>Import</Btn>
        <input ref={importRef} type="file" accept=".apxtrack,.json" hidden onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const t = parseTrackFile(await f.text()); if (t) { setPieces(t.pieces); setName(t.name); setEnv(t.env); setId(null); setSel([1]); setReport(null); } else st.toast({ kind: 'error', title: 'Invalid .apxtrack file' }); }} />
      </div>} />
      <Panel title="Pieces" pad={false}><div className="panel-b"><div className="pieces">{PALETTE.map(b => <button key={b.id} className="piece-b" onClick={() => add(b.make)}>{b.label}</button>)}</div>
        <p className="muted" style={{ fontSize: 11 }}>Inserts after the selection. Lengths snap to 2 m, angles to 5°. Ctrl+C/V copy-paste, Shift/Ctrl-click multi-select, Ctrl+Z undo.</p></div></Panel>
      <div className="col" style={{ minHeight: 0 }}>
        <div className="grow" style={{ minHeight: 280, border: '1px solid var(--line)', position: 'relative' }}>
          <Viewport track={track} sel={sel} />
          <div style={{ position: 'absolute', left: 10, bottom: 8, fontSize: 12 }} className="muted">{(track.lengthM / 1000).toFixed(2)} km · {track.cps.length} checkpoints · {pieces.length} pieces</div>
        </div>
        <div className="row"><span className={geo.ok ? 'good' : 'warn'}><Icon name={geo.ok ? 'check' : 'flag'} size={14} /> Geometry: {geo.ok ? 'connected, no crossings' : geo.reason}</span>
          <Btn small kind="primary" disabled={busy} onClick={validate} icon="bolt">{busy ? 'Validating…' : 'Validate with auto-driver'}</Btn>
          <Btn small icon="play" onClick={() => { const sid = save(); st.startRace({ mode: 'custom', trackId: 0, customId: sid, practice: true }); }}>Playtest</Btn></div>
        {report && <p className={report.finished ? 'good' : 'warn'}>{report.finished ? `Completable: automated driver finished in ${(report.ms / 1000).toFixed(2)} s with ${report.crashes} crash(es). Replay verified: ${report.replayOk ? 'yes' : 'no'}. Track marked validated.` : `Not validated: ${report.reason ?? 'driver could not finish cleanly'}. Playtest it yourself to confirm.`}</p>}
      </div>
      <Panel title={`Piece ${last} · ${cur?.k ?? ''}`} pad={false}><div className="panel-b">
        <label className="field" style={{ gridTemplateColumns: '90px 1fr' }}><span>Name</span><input type="text" maxLength={32} value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="field" style={{ gridTemplateColumns: '90px 1fr' }}><span>Environment</span><select value={env} onChange={e => setEnv(e.target.value)}>{ENVS.map(e => <option key={e.v} value={e.v}>{e.label}</option>)}</select></label>
        <div className="sub"><span>Selected ({sel.length})</span></div>
        <ul className="seq" style={{ maxHeight: 140, overflow: 'auto' }}>{pieces.map((q, i) => <li key={i} className={sel.includes(i) ? 'on' : ''} onClick={e => click(i, e)}><b>{q.k}</b><em>{Math.round(q.l)}m</em></li>)}</ul>
        {cur && (
          <div style={{ marginTop: 8 }}>
            <label className="field"><span>Length (m)</span><input type="range" min={2} max={400} step={2} value={cur.l} onChange={e => edit({ l: +e.target.value })} /><input type="number" step={2} value={num(cur.l)} onChange={e => edit({ l: Math.max(2, Math.round(+e.target.value / 2) * 2) })} /></label>
            <label className="field"><span>Turn (°)</span><input type="range" min={-540} max={540} step={5} value={num((cur.y ?? 0) / DEG)} onChange={e => edit({ y: +e.target.value * DEG })} /><input type="number" step={5} value={num((cur.y ?? 0) / DEG)} onChange={e => edit({ y: Math.round(+e.target.value / 5) * 5 * DEG })} /></label>
            <label className="field"><span>Hill (°)</span><input type="range" min={-25} max={25} step={1} value={num((cur.p ?? 0) / DEG)} onChange={e => edit({ p: +e.target.value * DEG })} /><input type="number" value={num((cur.p ?? 0) / DEG)} onChange={e => edit({ p: +e.target.value * DEG })} /></label>
            <label className="field"><span>Slope (°)</span><input type="range" min={-60} max={60} step={1} value={num((cur.dp ?? 0) / DEG)} onChange={e => edit({ dp: +e.target.value * DEG })} /><input type="number" value={num((cur.dp ?? 0) / DEG)} onChange={e => edit({ dp: +e.target.value * DEG })} /></label>
            <label className="field"><span>Banking (°)</span><input type="range" min={0} max={65} step={1} value={num((cur.b ?? 0) / DEG)} onChange={e => edit({ b: +e.target.value * DEG })} /><input type="number" value={num((cur.b ?? 0) / DEG)} onChange={e => edit({ b: +e.target.value * DEG })} /></label>
            <label className="field"><span>Width (m)</span><input type="range" min={4} max={40} step={1} value={cur.w ?? 14} onChange={e => edit({ w: +e.target.value, w2: undefined })} /><input type="number" value={num(cur.w ?? 14)} onChange={e => edit({ w: +e.target.value, w2: undefined })} /></label>
            <label className="field" style={{ gridTemplateColumns: '90px 1fr' }}><span>Surface</span><select value={cur.s ?? 0} onChange={e => edit({ s: +e.target.value })}>{SURFS.map(([n, v]) => <option key={n} value={v}>{n}</option>)}</select></label>
            {([['Checkpoint', F_CP], ['Boost pad', F_BOOST], ['Open edges (no walls)', F_NOWALL], ['Tunnel', F_TUNNEL], ['Bridge supports', F_BRIDGE], ['Gap (no road)', F_GAP]] as const).map(([l, f]) => <Toggle key={l} label={l} value={!!((cur.f ?? 0) & f)} onChange={v => edit({ f: v ? (cur.f ?? 0) | f : (cur.f ?? 0) & ~f })} />)}
            <div className="row" style={{ marginTop: 8 }}><Btn small icon="up" onClick={() => move(-1)}>Earlier</Btn><Btn small icon="down" onClick={() => move(1)}>Later</Btn><Btn small icon="copy" onClick={dup}>Duplicate</Btn><Btn small onClick={() => setClip(sel.map(i => ({ ...pieces[i] })).filter(q => q.k !== 'start' && q.k !== 'finish'))}>Copy</Btn><Btn small disabled={!clip.length} onClick={() => add(() => clip.map(q => ({ ...q })))}>Paste</Btn><Btn small kind="danger" icon="trash" onClick={del}>Delete</Btn></div>
          </div>
        )}
      </div></Panel>
      {showLoad && (
        <Modal title="Load track" onClose={() => setShowLoad(false)}>
          <div className="col">{p.customTracks.length === 0 && <p className="muted">No saved tracks.</p>}
            {p.customTracks.map(c => <div className="row" key={c.id} style={{ justifyContent: 'space-between' }}><b>{c.name}</b><span className="muted">{c.pieces.length} pieces</span>
              <Btn small onClick={() => { setPieces(c.pieces); setName(c.name); setEnv(c.env); setId(c.id); setSel([1]); setReport(null); setShowLoad(false); }}>Open</Btn>
              <Btn small kind="ghost" icon="trash" onClick={() => st.patchProfile(q => { q.customTracks = q.customTracks.filter(t => t.id !== c.id); })} /></div>)}</div>
        </Modal>)}
    </div>
  );
}
