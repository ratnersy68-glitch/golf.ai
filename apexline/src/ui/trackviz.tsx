import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Track } from '../sim/track';
import { F_GAP, F_BOOST, SURF_ICE, SURF_DIRT, SURF_GRASS, SURF_SAND } from '../sim/track';
import { getTrack } from '../game/campaign';
import { CHAPTERS_INFO } from '../data/chapters';

const thumbCache = new Map<string, string>();

/** Top-down rendered thumbnail drawn from the real track geometry (elevation-shaded). Cached as a data URL. */
export function thumbFor(tr: Track, accent: string, w = 320, h = 180): string {
  const key = tr.def.id + ':' + tr.def.seed + ':' + w;
  const c = thumbCache.get(key); if (c) return c;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d')!;
  const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#1a1e24'); g.addColorStop(1, '#101216'); x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.strokeStyle = 'rgba(168,175,186,.07)'; x.lineWidth = 1; for (let i = 0; i < w; i += 20) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } for (let i = 0; i < h; i += 20) { x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); }
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9, minY = 1e9, maxY = -1e9;
  for (let i = 0; i < tr.n; i += 2) { minX = Math.min(minX, tr.px[i]); maxX = Math.max(maxX, tr.px[i]); minZ = Math.min(minZ, tr.pz[i]); maxZ = Math.max(maxZ, tr.pz[i]); minY = Math.min(minY, tr.py[i]); maxY = Math.max(maxY, tr.py[i]); }
  const pad = 16; const s = Math.min((w - pad * 2) / (maxX - minX || 1), (h - pad * 2) / (maxZ - minZ || 1));
  const ox = (w - (maxX - minX) * s) / 2, oz = (h - (maxZ - minZ) * s) / 2;
  const P = (i: number): [number, number] => [ox + (tr.px[i] - minX) * s, oz + (tr.pz[i] - minZ) * s];
  x.lineCap = 'round'; x.lineJoin = 'round';
  x.strokeStyle = '#0a0b0d'; x.lineWidth = 7; x.beginPath(); for (let i = 0; i < tr.n; i += 2) { const [a, b] = P(i); i ? x.lineTo(a, b) : x.moveTo(a, b); } x.stroke();
  for (let i = 0; i < tr.n - 2; i += 2) {
    const [a, b] = P(i), [c2, d] = P(i + 2); const t = (tr.py[i] - minY) / (maxY - minY || 1);
    if (tr.flags[i] & F_GAP) { x.strokeStyle = 'rgba(245,247,250,.25)'; x.setLineDash([2, 4]); x.lineWidth = 2; }
    else {
      x.setLineDash([]); x.lineWidth = 4.2;
      const s2 = tr.surf[i]; x.strokeStyle = tr.flags[i] & F_BOOST ? '#C6FF00' : s2 === SURF_ICE ? '#9FD6FF' : s2 === SURF_DIRT ? '#a37a4e' : s2 === SURF_GRASS ? '#5da24a' : s2 === SURF_SAND ? '#d9bd80' : `hsl(${210 - t * 20},${10 + t * 8}%,${44 + t * 34}%)`;
    }
    x.beginPath(); x.moveTo(a, b); x.lineTo(c2, d); x.stroke();
  }
  x.setLineDash([]);
  const [sx, sz] = P(2); x.fillStyle = accent; x.beginPath(); x.arc(sx, sz, 4.2, 0, 7); x.fill();
  const [fx, fz] = P(tr.finish); x.fillStyle = '#F5F7FA'; x.fillRect(fx - 3.5, fz - 3.5, 7, 7);
  x.fillStyle = '#101216'; x.fillRect(fx - 1.5, fz - 1.5, 3, 3);
  const url = cv.toDataURL('image/png'); thumbCache.set(key, url); return url;
}

export function TrackThumb({ id, w = 320, h = 180, className = '' }: { id: number; w?: number; h?: number; className?: string }) {
  const tr = getTrack(id); const ch = CHAPTERS_INFO[tr.def.chapter - 1];
  return <img className={`thumb ${className}`} src={thumbFor(tr, ch.accent, w, h)} width={w} height={h} alt="" loading="lazy" />;
}

/** Rotatable 3D miniature of the course. */
export function TrackPreview3D({ id }: { id: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const tr = getTrack(id); const accent = CHAPTERS_INFO[tr.def.chapter - 1].accent;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(38, 1, 1, 8000);
    scene.add(new THREE.HemisphereLight('#ffffff', '#303844', 1.6)); const dl = new THREE.DirectionalLight('#ffffff', 2); dl.position.set(1, 2, 1); scene.add(dl);
    // ribbon geometry coloured by elevation
    let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9, minY = 1e9, maxY = -1e9;
    for (let i = 0; i < tr.n; i++) { minX = Math.min(minX, tr.px[i]); maxX = Math.max(maxX, tr.px[i]); minZ = Math.min(minZ, tr.pz[i]); maxZ = Math.max(maxZ, tr.pz[i]); minY = Math.min(minY, tr.py[i]); maxY = Math.max(maxY, tr.py[i]); }
    const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2, cy = (minY + maxY) / 2; const size = Math.max(maxX - minX, maxZ - minZ, maxY - minY, 50);
    const pos: number[] = [], col: number[] = []; const c = new THREE.Color(); const idx: number[] = [];
    const wv = 2.4;
    for (let i = 0; i < tr.n; i++) {
      const w = Math.max(tr.w[i] * 0.5, 5) * wv * 0.5; const t = (tr.py[i] - minY) / (maxY - minY || 1);
      c.setHSL(0.25 - t * 0.1, 0.1 + t * 0.6, 0.4 + t * 0.25); if (tr.flags[i] & F_BOOST) c.set('#C6FF00');
      if (tr.surf[i] === SURF_ICE) c.set('#9FD6FF'); if (tr.flags[i] & F_GAP) c.set('#222831');
      for (const sd of [-1, 1]) { pos.push(tr.px[i] - cx + tr.rx[i] * sd * w, tr.py[i] - cy + tr.ry[i] * sd * w, tr.pz[i] - cz + tr.rz[i] * sd * w); col.push(c.r, c.g, c.b); }
      if (i < tr.n - 1 && !(tr.flags[i] & F_GAP) && !(tr.flags[i + 1] & F_GAP)) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.6 })); scene.add(mesh);
    const mk = (i: number, color: string, r: number) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), new THREE.MeshBasicMaterial({ color })); m.position.set(tr.px[i] - cx, tr.py[i] - cy + r, tr.pz[i] - cz); scene.add(m); return m; };
    mk(2, accent, size * 0.012); mk(tr.finish, '#F5F7FA', size * 0.012); tr.cps.forEach(i => mk(i, '#8B93A0', size * 0.007));
    let yaw = 0.6, pitch = 0.9, dist = size * 1.35, drag = false, lx = 0, ly = 0, auto = true;
    const down = (e: PointerEvent) => { drag = true; auto = false; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!drag) return; yaw -= (e.clientX - lx) * 0.01; pitch = Math.max(0.1, Math.min(1.5, pitch + (e.clientY - ly) * 0.008)); lx = e.clientX; ly = e.clientY; };
    const up = () => { drag = false; };
    const wheel = (e: WheelEvent) => { dist = Math.max(size * 0.5, Math.min(size * 3, dist * (1 + e.deltaY * 0.001))); e.preventDefault(); };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('wheel', wheel, { passive: false });
    let raf = 0; const loop = () => {
      raf = requestAnimationFrame(loop); const w = cv.clientWidth, h = cv.clientHeight; if (w && (cv.width !== Math.round(w * renderer.getPixelRatio()))) { renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
      if (auto) yaw += 0.004;
      cam.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist); cam.lookAt(0, 0, 0); renderer.render(scene, cam);
    }; loop();
    return () => { cancelAnimationFrame(raf); cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('wheel', wheel); geo.dispose(); renderer.dispose(); };
  }, [id]);
  return <canvas ref={ref} className="preview3d" aria-label="3D track preview, drag to rotate" />;
}
