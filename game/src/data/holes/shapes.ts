import type { Vec2 } from '../types';

/** Helpers for authoring hole data. All return polygons in hole space (mini feet). */

export function rect(cx: number, cy: number, w: number, h: number, rotationDeg = 0): Vec2[] {
  const r = (rotationDeg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c] as Vec2);
}

/** Rounded rectangle, returned un-smoothed (use smooth:false). */
export function roundedRect(cx: number, cy: number, w: number, h: number, radius: number, rotationDeg = 0): Vec2[] {
  const r = (rotationDeg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const pts: Vec2[] = [];
  const corners: [number, number, number][] = [
    [w / 2 - radius, h / 2 - radius, 0],
    [-w / 2 + radius, h / 2 - radius, 90],
    [-w / 2 + radius, -h / 2 + radius, 180],
    [w / 2 - radius, -h / 2 + radius, 270],
  ];
  for (const [ox, oy, a0] of corners) {
    for (let i = 0; i <= 4; i++) {
      const a = ((a0 + (i * 90) / 4) * Math.PI) / 180;
      pts.push([ox + Math.cos(a) * radius, oy + Math.sin(a) * radius]);
    }
  }
  return pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c] as Vec2);
}

export function ellipse(cx: number, cy: number, rx: number, ry: number, rotationDeg = 0, n = 10): Vec2[] {
  const r = (rotationDeg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const pts: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    pts.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return pts;
}

/** Offset every point of a polygon away from its centroid (quick "expand"). */
export function grow(poly: Vec2[], amount: number): Vec2[] {
  let cx = 0,
    cy = 0;
  for (const p of poly) {
    cx += p[0];
    cy += p[1];
  }
  cx /= poly.length;
  cy /= poly.length;
  return poly.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const l = Math.hypot(dx, dy) || 1;
    return [x + (dx / l) * amount, y + (dy / l) * amount] as Vec2;
  });
}
