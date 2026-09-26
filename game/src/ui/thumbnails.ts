import type { HoleLayout } from '../data/types';
import { polyBounds } from '../world/geometry';
import { HoleModel } from '../world/HoleModel';
import { paintHole } from '../world/TerrainBuilder';

const cache = new Map<string, HTMLCanvasElement>();

/** Top-down thumbnail of a real hole, painted from the same data as the 3D terrain (tee left, green right). */
export function holeThumbnail(layout: HoleLayout, w = 320, h = 200): HTMLCanvasElement {
  const key = `${layout.id}-${w}x${h}`;
  const hit = cache.get(key);
  if (hit) return cloneCanvas(hit);
  const model = new HoleModel(layout);
  const rect = polyBounds(layout.bounds, 2.5);
  const src = paintHole(model, rect, 8, { noise: false, maxDim: 700 });
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d')!;
  ctx.fillStyle = layout.grass.rough;
  ctx.fillRect(0, 0, w, h);
  // rotate: hole-y (up in src) -> right
  const scale = Math.min(w / src.height, h / src.width) * 1.02;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(Math.PI / 2);
  ctx.scale(scale, scale);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  // cup & tee markers in src pixel space
  const ppf = src.width / (rect.maxX - rect.minX);
  const px = (x: number, y: number) => [(x - rect.minX) * ppf - src.width / 2, (rect.maxY - y) * ppf - src.height / 2];
  const [cx, cy] = px(layout.cup[0], layout.cup[1]);
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(cx, cy, 2.2 / scale + 1.5, 0, Math.PI * 2);
  ctx.fill();
  const [tx, ty] = px(layout.tee.at[0], layout.tee.at[1]);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(tx, ty, 2 / scale + 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // soft vignette
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(0,0,0,0.25)');
  g.addColorStop(0.4, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  cache.set(key, out);
  return cloneCanvas(out);
}

function cloneCanvas(c: HTMLCanvasElement): HTMLCanvasElement {
  const n = document.createElement('canvas');
  n.width = c.width;
  n.height = c.height;
  n.getContext('2d')!.drawImage(c, 0, 0);
  return n;
}
