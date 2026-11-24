import type { LiveryLayer, CarSetup } from './types';
import { Rng } from '../sim/dmath';
import { COSMETIC_MAP } from '../data/cosmetics';

export const LIV_W = 1024, LIV_H = 512;
let lid = 0;
const L = (o: Partial<LiveryLayer> & Pick<LiveryLayer, 'type' | 'x' | 'y' | 'w' | 'h' | 'color'>): LiveryLayer => ({ id: `p${lid++}`, rot: 0, alpha: 1, mirror: true, ...o });

/** Resolves a livery preset template into drawable layers (uv space: x front->rear, y around the body, 0.5 = centre line over roof/hood). */
export function presetLayers(tpl: string, c1: string, c2: string, seed: number): LiveryLayer[] {
  const r = new Rng(seed * 977 + 13);
  const out: LiveryLayer[] = [];
  switch (tpl) {
    case 'stripes':
      out.push(L({ type: 'stripe', x: 0.5, y: 0.5, w: 1, h: 0.1, color: c1, mirror: false }), L({ type: 'stripe', x: 0.5, y: 0.5, w: 1, h: 0.025, color: c2, mirror: false, alpha: 0.9 }));
      break;
    case 'dual':
      for (const dy of [-0.07, 0.07]) out.push(L({ type: 'stripe', x: 0.5, y: 0.5 + dy, w: 1, h: 0.045, color: c1, mirror: false }));
      break;
    case 'chevron':
      for (let i = 0; i < 4; i++) out.push(L({ type: 'tri', x: 0.18 + i * 0.07, y: 0.27, w: 0.12, h: 0.16, rot: 90, color: i % 2 ? c2 : c1 }));
      break;
    case 'checker': {
      for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2 === 0) out.push(L({ type: 'rect', x: 0.07 + i * 0.03, y: 0.22 + j * 0.04, w: 0.03, h: 0.04, color: c1 }));
      break; }
    case 'flames':
      for (let i = 0; i < 6; i++) out.push(L({ type: 'tri', x: 0.12 + i * 0.05, y: 0.3 + (i % 2) * 0.02, w: 0.1 - i * 0.008, h: 0.05, rot: 0, color: i % 2 ? c2 : c1 }));
      for (let i = 0; i < 5; i++) out.push(L({ type: 'tri', x: 0.16 + i * 0.05, y: 0.26, w: 0.07, h: 0.035, rot: 0, color: c2, alpha: 0.9 }));
      break;
    case 'split':
      out.push(L({ type: 'rect', x: 0.5, y: 0.75, w: 1, h: 0.5, color: c1, mirror: false }));
      break;
    case 'fade':
      for (let i = 0; i < 10; i++) out.push(L({ type: 'rect', x: 0.5, y: 0.04 + i * 0.012, w: 1, h: 0.012, color: c1, alpha: 0.9 - i * 0.09 }));
      for (let i = 0; i < 10; i++) out.push(L({ type: 'rect', x: 0.5, y: 0.96 - i * 0.012, w: 1, h: 0.012, color: c1, alpha: 0.9 - i * 0.09 }));
      break;
    case 'hex':
      for (let i = 0; i < 14; i++) out.push(L({ type: 'ngon', sides: 6, x: 0.55 + r.range(-0.3, 0.4), y: 0.2 + r.range(0, 0.18), w: r.range(0.03, 0.07), h: r.range(0.04, 0.09), color: i % 3 ? c1 : c2, alpha: 0.85 }));
      break;
    case 'speed':
      for (let i = 0; i < 9; i++) out.push(L({ type: 'rect', x: 0.35 + r.range(0, 0.55), y: 0.15 + r.range(0, 0.2), w: r.range(0.1, 0.34), h: 0.008 + r.range(0, 0.012), color: i % 2 ? c1 : c2 }));
      break;
    case 'roundel':
      out.push(L({ type: 'ellipse', x: 0.52, y: 0.25, w: 0.1, h: 0.18, color: c1 }), L({ type: 'ellipse', x: 0.52, y: 0.25, w: 0.07, h: 0.13, color: c2 }), L({ type: 'text', text: '07', x: 0.52, y: 0.25, w: 0.07, h: 0.1, color: c1 }));
      break;
    case 'bands':
      for (let i = 0; i < 3; i++) out.push(L({ type: 'rect', x: 0.3 + i * 0.07, y: 0.5, w: 0.035, h: 1, color: i % 2 ? c2 : c1, mirror: false }));
      break;
    case 'rally':
      out.push(L({ type: 'rect', x: 0.5, y: 0.23, w: 0.9, h: 0.05, color: c1 }), L({ type: 'rect', x: 0.5, y: 0.31, w: 0.9, h: 0.02, color: c2 }), L({ type: 'ellipse', x: 0.5, y: 0.2, w: 0.09, h: 0.15, color: c2 }), L({ type: 'text', text: '7', x: 0.5, y: 0.2, w: 0.06, h: 0.1, color: c1 }));
      break;
  }
  return out;
}

function drawLayer(ctx: CanvasRenderingContext2D, l: LiveryLayer, mirror: boolean) {
  if (l.hidden) return;
  ctx.save();
  const y = mirror ? 1 - l.y : l.y;
  ctx.translate(l.x * LIV_W, y * LIV_H);
  ctx.rotate(((mirror ? -l.rot : l.rot) * Math.PI) / 180);
  ctx.globalAlpha = l.alpha; ctx.fillStyle = l.color; ctx.strokeStyle = l.color;
  const w = l.w * LIV_W, h = l.h * LIV_H;
  switch (l.type) {
    case 'rect': case 'stripe': ctx.fillRect(-w / 2, -h / 2, w, h); break;
    case 'line': ctx.fillRect(-w / 2, -2, w, 4); break;
    case 'ellipse': ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill(); break;
    case 'tri': ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(-w / 2, -h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill(); break;
    case 'ngon': { const n = l.sides ?? 6; ctx.beginPath(); for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const px = Math.cos(a) * w / 2, py = Math.sin(a) * h / 2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.fill(); break; }
    case 'text': ctx.font = `800 ${Math.max(8, h)}px "Barlow Condensed", Impact, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.save(); if (mirror) ctx.scale(-1, 1); ctx.fillText(l.text ?? '7', 0, 0); ctx.restore(); break;
  }
  ctx.restore();
}

function carbonPattern(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#16181c'; ctx.fillRect(0, 0, LIV_W, LIV_H);
  for (let y = 0; y < LIV_H; y += 8) for (let x = 0; x < LIV_W; x += 8) {
    const a = ((x + y) / 8) % 2 === 0;
    const g = ctx.createLinearGradient(x, y, a ? x + 8 : x, a ? y : y + 8);
    g.addColorStop(0, '#2c3038'); g.addColorStop(1, '#101216');
    ctx.fillStyle = g; ctx.fillRect(x, y, 7, 7);
  }
}

/** Renders the full livery canvas for a setup (base paint + preset layers + custom layers + number). */
export function renderLivery(canvas: HTMLCanvasElement, setup: CarSetup, withNumber = true): void {
  canvas.width = LIV_W; canvas.height = LIV_H;
  const ctx = canvas.getContext('2d')!;
  const fin = COSMETIC_MAP[setup.paint.finish];
  if (fin?.data.carbon) carbonPattern(ctx);
  else { ctx.fillStyle = setup.paint.primary; ctx.fillRect(0, 0, LIV_W, LIV_H); }
  // secondary colour on the roof/hood centre line (v = 0.5) for two-tone looks
  ctx.globalAlpha = 1; ctx.fillStyle = setup.paint.secondary;
  ctx.fillRect(0.38 * LIV_W, LIV_H * 0.44, 0.34 * LIV_W, LIV_H * 0.12); // roof panel
  const preset = COSMETIC_MAP[setup.livery.preset];
  if (setup.livery.useBase && preset?.data.tpl) {
    for (const l of presetLayers(preset.data.tpl, preset.data.c1 === '#101216' && false ? setup.paint.accent : tint(preset.data.c1, setup.paint.accent, preset.data.seed), preset.data.c2, preset.data.seed)) { drawLayer(ctx, l, false); if (l.mirror) drawLayer(ctx, l, true); }
  }
  for (const l of setup.livery.layers) { drawLayer(ctx, l, false); if (l.mirror) drawLayer(ctx, l, true); }
  if (withNumber) {
    const n = String(setup.number);
    for (const [x, y, m] of [[0.5, 0.27, false], [0.5, 0.73, true]] as const) {
      ctx.save(); ctx.translate(x * LIV_W, y * LIV_H); ctx.fillStyle = '#F5F7FA'; ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.ellipse(0, 0, 38, 36, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#101216'; ctx.font = '800 44px "Barlow Condensed", Impact, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (m) ctx.scale(-1, 1);
      ctx.fillText(n, 0, 3); ctx.restore();
    }
  }
}
/** Presets keep their authored colours unless they use the neutral carbon/black "c1": then the player's accent colour shows through. */
function tint(c1: string, accent: string, _seed: number): string { return c1.toUpperCase() === '#101216' ? accent : c1; }
