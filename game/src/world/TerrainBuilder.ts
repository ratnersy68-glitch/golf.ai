import * as THREE from 'three';
import type { HoleLayout, SurfaceType, Vec2 } from '../data/types';
import { Bounds2, fbm2, inBounds, pointInPolygon, polyBounds, rng, smoothClosed, valueNoise2 } from './geometry';
import { HoleModel } from './HoleModel';

/** Colours used for painting (texture) and vertex colouring (scenery). */
export function surfaceColor(layout: HoleLayout, type: SurfaceType): string {
  const g = layout.grass;
  switch (type) {
    case 'green':
      return g.green;
    case 'fringe':
      return g.fringe;
    case 'fairway':
    case 'tee':
      return g.fairway;
    case 'rough':
      return g.rough;
    case 'deepRough':
      return shade(g.rough, -0.12);
    case 'bunker':
      return g.sand;
    case 'water':
      return g.deepWater;
    case 'path':
      return '#cdb994';
    case 'pinestraw':
      return '#7d5a36';
    case 'rock':
      return '#8f877a';
    case 'bridge':
      return '#bdb3a0';
  }
}

export function shade(hex: string, amt: number): string {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amt)));
  return '#' + c.getHexString();
}

export interface TerrainResult {
  inner: THREE.Mesh;
  outer?: THREE.Mesh;
  skirt?: THREE.Mesh;
  innerRect: Bounds2;
  texture: THREE.CanvasTexture;
}

export interface TerrainOptions {
  diorama: boolean;
  quality: 'low' | 'high';
  /** extra blobs to darken (tree AO) */
  shadowBlobs: { at: Vec2; r: number }[];
}

/** Paints the hole's surfaces onto a 2D canvas. Used for the terrain texture and hole thumbnails. */
export function paintHole(
  model: HoleModel,
  rect: Bounds2,
  pxPerFt: number,
  opts: { noise: boolean; blobs?: { at: Vec2; r: number }[]; maxDim?: number },
): HTMLCanvasElement {
  const layout = model.layout;
  const wFt = rect.maxX - rect.minX;
  const hFt = rect.maxY - rect.minY;
  let ppf = pxPerFt;
  const maxDim = opts.maxDim ?? 2560;
  if (Math.max(wFt, hFt) * ppf > maxDim) ppf = maxDim / Math.max(wFt, hFt);
  const W = Math.round(wFt * ppf);
  const H = Math.round(hFt * ppf);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const X = (x: number) => (x - rect.minX) * ppf;
  const Y = (y: number) => (rect.maxY - y) * ppf;
  const pathOf = (poly: Vec2[]) => {
    const p = new Path2D();
    poly.forEach(([x, y], i) => (i ? p.lineTo(X(x), Y(y)) : p.moveTo(X(x), Y(y))));
    p.closePath();
    return p;
  };

  // base rough
  ctx.fillStyle = surfaceColor(layout, layout.defaultSurface);
  ctx.fillRect(0, 0, W, H);

  // rough clumps
  const r = rng(layout.number * 97 + 3);
  for (let i = 0; i < (W * H) / 900; i++) {
    const x = r() * W;
    const y = r() * H;
    ctx.fillStyle = r() < 0.5 ? shade(layout.grass.rough, -0.05) : shade(layout.grass.rough, 0.04);
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(x, y, ppf * (0.15 + r() * 0.3), ppf * (0.1 + r() * 0.2), r() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // landmark painted areas (neighbouring greens / tees) sit under everything else
  for (const lm of layout.landmarks) {
    if (lm.kind !== 'distantGreen' || !lm.points) continue;
    const poly = smoothClosed(lm.points, 6);
    ctx.fillStyle = shade(lm.color ?? layout.grass.green, -0.06);
    ctx.fill(pathOf(inflate(poly, 0.35)));
    ctx.fillStyle = lm.color ?? layout.grass.green;
    ctx.fill(pathOf(poly));
  }

  const stripe = 1.3;
  type Surf = (typeof model.surfaces)[number];
  const clipped = (s: Surf, fn: () => void) => {
    ctx.save();
    ctx.clip(pathOf(s.poly));
    fn();
    ctx.restore();
    ctx.globalAlpha = 1;
  };
  const painters: Partial<Record<SurfaceType, (s: Surf) => void>> = {
    pinestraw: (s) =>
      clipped(s, () => {
        // needle speckle
        ctx.fillStyle = surfaceColor(layout, 'pinestraw');
        ctx.fillRect(0, 0, W, H);
        const sb = s.bounds;
        const area = (sb.maxX - sb.minX) * (sb.maxY - sb.minY) * ppf * ppf;
        for (let i = 0; i < Math.min(area, W * H) / 260; i++) {
          const x = X(sb.minX) + r() * (sb.maxX - sb.minX) * ppf;
          const y = Y(sb.maxY) + r() * (sb.maxY - sb.minY) * ppf;
          ctx.strokeStyle = r() < 0.5 ? '#9a6f43' : '#5e4028';
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = Math.max(1, ppf * 0.03);
          const a = r() * Math.PI;
          const l = ppf * 0.25;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
          ctx.stroke();
        }
      }),
    path: (s) => {
      ctx.fillStyle = surfaceColor(layout, 'path');
      ctx.fill(pathOf(s.poly));
    },
    fairway: (s) =>
      clipped(s, () => {
        // mowing stripes along the line of play
        const base = s.type === 'tee' ? shade(layout.grass.fairway, 0.03) : layout.grass.fairway;
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = shade(base, 0.045);
        const sb = s.bounds;
        for (let x = Math.floor(sb.minX / stripe) * stripe; x < sb.maxX; x += stripe * 2) ctx.fillRect(X(x), 0, stripe * ppf, H);
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = shade(base, -0.03);
        for (let y = Math.floor(sb.minY / stripe) * stripe; y < sb.maxY; y += stripe * 2) ctx.fillRect(0, Y(y), W, stripe * ppf);
      }),
    fringe: (s) => {
      ctx.fillStyle = layout.grass.fringe;
      ctx.fill(pathOf(s.poly));
    },
    green: (s) => {
      // collar, then the green with a subtle checkerboard cut
      ctx.strokeStyle = layout.grass.fringe;
      ctx.lineJoin = 'round';
      ctx.lineWidth = 0.9 * ppf;
      ctx.stroke(pathOf(s.poly));
      clipped(s, () => {
        ctx.fillStyle = layout.grass.green;
        ctx.fillRect(0, 0, W, H);
        const cs = 0.7;
        ctx.fillStyle = shade(layout.grass.green, 0.03);
        for (let x = Math.floor(s.bounds.minX / cs) * cs; x < s.bounds.maxX; x += cs) {
          for (let y = Math.floor(s.bounds.minY / cs) * cs; y < s.bounds.maxY; y += cs) {
            if ((Math.round(x / cs) + Math.round(y / cs)) % 2 === 0) ctx.fillRect(X(x), Y(y + cs), cs * ppf, cs * ppf);
          }
        }
      });
    },
    bunker: (s) => {
      // dark lip, sand, rake marks
      ctx.strokeStyle = shade(layout.grass.rough, -0.1);
      ctx.lineWidth = 0.22 * ppf;
      ctx.stroke(pathOf(s.poly));
      clipped(s, () => {
        ctx.fillStyle = layout.grass.sand;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = shade(layout.grass.sand, -0.06);
        ctx.lineWidth = Math.max(1, ppf * 0.025);
        ctx.globalAlpha = 0.6;
        for (let y = s.bounds.minY; y < s.bounds.maxY; y += 0.12) {
          ctx.beginPath();
          for (let x = s.bounds.minX; x <= s.bounds.maxX; x += 0.2) {
            const yy = y + Math.sin(x * 1.3 + y) * 0.05;
            if (x === s.bounds.minX) ctx.moveTo(X(x), Y(yy));
            else ctx.lineTo(X(x), Y(yy));
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(120,100,70,0.25)';
        ctx.lineWidth = 0.35 * ppf;
        ctx.stroke(pathOf(s.poly));
      });
    },
    water: (s) => {
      // muddy banks, then the dark bed
      ctx.strokeStyle = '#6c5a3c';
      ctx.lineWidth = 0.55 * ppf;
      ctx.lineJoin = 'round';
      ctx.stroke(pathOf(s.poly));
      ctx.fillStyle = layout.grass.deepWater;
      ctx.fill(pathOf(s.poly));
    },
    rock: (s) => {
      ctx.fillStyle = surfaceColor(layout, 'rock');
      ctx.fill(pathOf(s.poly));
    },
  };
  painters.tee = painters.fairway;
  painters.rough = painters.deepRough = (s) => {
    ctx.fillStyle = surfaceColor(layout, s.type);
    ctx.fill(pathOf(s.poly));
  };

  // paint in data order so later layers win, exactly like HoleModel.surfaceAt
  for (const s of model.surfaces) painters[s.type]?.(s);

  // soft ambient occlusion under trees
  if (opts.blobs) {
    for (const b of opts.blobs) {
      const g = ctx.createRadialGradient(X(b.at[0]), Y(b.at[1]), 0, X(b.at[0]), Y(b.at[1]), b.r * ppf);
      g.addColorStop(0, 'rgba(20,30,10,0.35)');
      g.addColorStop(1, 'rgba(20,30,10,0)');
      ctx.fillStyle = g;
      ctx.fillRect(X(b.at[0]) - b.r * ppf, Y(b.at[1]) - b.r * ppf, b.r * 2 * ppf, b.r * 2 * ppf);
    }
  }

  if (opts.noise) {
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let j = 0; j < H; j++) {
      const y = rect.maxY - j / ppf;
      for (let i = 0; i < W; i++) {
        const x = rect.minX + i / ppf;
        const n = 0.9 + 0.2 * fbm2(x * 1.7, y * 1.7, 5, 3) + 0.07 * (valueNoise2(x * 14, y * 14, 9) - 0.5);
        const k = (j * W + i) * 4;
        d[k] = Math.min(255, d[k] * n);
        d[k + 1] = Math.min(255, d[k + 1] * n);
        d[k + 2] = Math.min(255, d[k + 2] * n);
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  return canvas;
}

function inflate(poly: Vec2[], a: number): Vec2[] {
  let cx = 0,
    cy = 0;
  for (const p of poly) {
    cx += p[0];
    cy += p[1];
  }
  cx /= poly.length;
  cy /= poly.length;
  return poly.map(([x, y]) => {
    const dx = x - cx,
      dy = y - cy,
      l = Math.hypot(dx, dy) || 1;
    return [x + (dx / l) * a, y + (dy / l) * a] as Vec2;
  });
}

/** Build the terrain meshes for a hole. */
export function buildTerrain(model: HoleModel, opts: TerrainOptions): TerrainResult {
  const layout = model.layout;
  const pad = opts.diorama ? 4 : 11;
  const pb = polyBounds(model.bounds, pad);
  const rect: Bounds2 = {
    minX: Math.floor(pb.minX),
    minY: Math.floor(pb.minY),
    maxX: Math.ceil(pb.maxX),
    maxY: Math.ceil(pb.maxY),
  };

  const canvas = paintHole(model, rect, opts.quality === 'high' ? 34 : 20, { noise: true, blobs: opts.shadowBlobs });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  const step = opts.quality === 'high' ? 0.2 : 0.33;
  const inner = gridMesh(model, rect, step, (x, y) => model.terrainHeight(x, y), true);
  inner.material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.92, metalness: 0 });
  inner.receiveShadow = true;
  inner.name = 'terrain-inner';

  const result: TerrainResult = { inner, innerRect: rect, texture };

  if (!opts.diorama) {
    const R = layout.sceneryRadius;
    const c = model.greenCenter;
    const cx = (layout.tee.at[0] + c[0]) / 2;
    const cy = (layout.tee.at[1] + c[1]) / 2;
    const orect: Bounds2 = { minX: Math.floor(cx - R), maxX: Math.ceil(cx + R), minY: Math.floor(cy - R), maxY: Math.ceil(cy + R) };
    const outer = gridMesh(
      model,
      orect,
      1,
      (x, y) => {
        const d = Math.hypot(x - cx, y - cy);
        // gentle rolling hills rising toward the horizon so the world feels enclosed
        const rise = Math.max(0, d - R * 0.45) * 0.09 + (fbm2(x * 0.05, y * 0.05, 3, 3) - 0.5) * 2 * Math.min(1, d / 40);
        return model.terrainHeightRaw(x, y) + rise - (inBounds(rect, x, y) ? 0.04 : 0);
      },
      false,
      rect,
    );
    // vertex colours by surface
    const pos = outer.geometry.getAttribute('position');
    const colors = new Float32Array(pos.count * 3);
    const col = new THREE.Color();
    const beds = model.surfaces;
    const distant = layout.landmarks.filter((l) => l.kind === 'distantGreen' && l.points).map((l) => ({ poly: smoothClosed(l.points!, 6), color: l.color! }));
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = -pos.getZ(i);
      let hex = layout.grass.rough;
      for (const s of beds) if (s.type !== 'water' && inBounds(s.bounds, x, y) && pointInPolygon(x, y, s.poly)) hex = surfaceColor(layout, s.type);
      for (const dgreen of distant) if (pointInPolygon(x, y, dgreen.poly)) hex = dgreen.color;
      col.set(hex);
      const n = 0.88 + 0.22 * fbm2(x * 0.3, y * 0.3, 11, 3);
      colors[i * 3] = col.r * n;
      colors[i * 3 + 1] = col.g * n;
      colors[i * 3 + 2] = col.b * n;
    }
    outer.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    outer.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
    outer.receiveShadow = true;
    outer.name = 'terrain-outer';
    result.outer = outer;
  } else {
    result.skirt = buildSkirt(model, rect);
  }
  return result;
}

/** Regular grid mesh in hole space, world-mapped (x, h, -y). Optionally skips cells inside `hole`. */
function gridMesh(
  _model: HoleModel,
  rect: Bounds2,
  step: number,
  height: (x: number, y: number) => number,
  uv: boolean,
  hole?: Bounds2,
): THREE.Mesh {
  const nx = Math.round((rect.maxX - rect.minX) / step) + 1;
  const ny = Math.round((rect.maxY - rect.minY) / step) + 1;
  const positions = new Float32Array(nx * ny * 3);
  const uvs = uv ? new Float32Array(nx * ny * 2) : null;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const x = rect.minX + i * step;
      const y = rect.minY + j * step;
      const k = j * nx + i;
      positions[k * 3] = x;
      positions[k * 3 + 1] = height(x, y);
      positions[k * 3 + 2] = -y;
      if (uvs) {
        uvs[k * 2] = (x - rect.minX) / (rect.maxX - rect.minX);
        uvs[k * 2 + 1] = (y - rect.minY) / (rect.maxY - rect.minY);
      }
    }
  }
  const indices: number[] = [];
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      if (hole) {
        const x0 = rect.minX + i * step;
        const y0 = rect.minY + j * step;
        if (x0 >= hole.minX + 1 && x0 + step <= hole.maxX - 1 && y0 >= hole.minY + 1 && y0 + step <= hole.maxY - 1) continue;
      }
      const a = j * nx + i;
      const b = a + 1;
      const c = a + nx;
      const d = c + 1;
      // world z = -y flips handedness, so wind the other way
      indices.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  if (uvs) geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo);
}

/** Earthy sides for the diorama plinth. */
function buildSkirt(model: HoleModel, rect: Bounds2): THREE.Mesh {
  const bottom = -2.2;
  const pts: Vec2[] = [];
  const s = 0.5;
  for (let x = rect.minX; x < rect.maxX; x += s) pts.push([x, rect.minY]);
  for (let y = rect.minY; y < rect.maxY; y += s) pts.push([rect.maxX, y]);
  for (let x = rect.maxX; x > rect.minX; x -= s) pts.push([x, rect.maxY]);
  for (let y = rect.maxY; y > rect.minY; y -= s) pts.push([rect.minX, y]);
  const positions: number[] = [];
  const colors: number[] = [];
  const top = new THREE.Color('#5b3d24');
  const bot = new THREE.Color('#2f1e12');
  const grass = new THREE.Color(model.layout.grass.rough);
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    const h0 = model.terrainHeightRaw(x0, y0);
    const h1 = model.terrainHeightRaw(x1, y1);
    const quad = [
      [x0, h0, -y0, grass],
      [x0, h0 - 0.18, -y0, top],
      [x1, h1, -y1, grass],
      [x1, h1, -y1, grass],
      [x0, h0 - 0.18, -y0, top],
      [x1, h1 - 0.18, -y1, top],
      [x0, h0 - 0.18, -y0, top],
      [x0, bottom, -y0, bot],
      [x1, h1 - 0.18, -y1, top],
      [x1, h1 - 0.18, -y1, top],
      [x0, bottom, -y0, bot],
      [x1, bottom, -y1, bot],
    ] as const;
    for (const [x, y, z, c] of quad) {
      positions.push(x, y, z);
      colors.push(c.r, c.g, c.b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide }));
  mesh.name = 'diorama-skirt';
  return mesh;
}
