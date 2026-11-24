/** Procedural white marble (warm white base, soft grey veining). Used for UI surfaces (CSS variable --marble) and the showroom floor. */
function hash(x: number, y: number, s: number): number { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; h = h ^ (h >>> 16); return (h >>> 0) / 4294967295; }
function vnoise(x: number, y: number, s: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number, s: number, oct = 5): number { let a = 0.5, f = 1, r = 0; for (let i = 0; i < oct; i++) { r += a * vnoise(x * f, y * f, s + i * 17); a *= 0.5; f *= 2.03; } return r; }

export interface MarbleOpts { size?: number; seed?: number; veinStrength?: number; tint?: [number, number, number] }
export function makeMarble(o: MarbleOpts = {}): HTMLCanvasElement {
  const size = o.size ?? 512, seed = o.seed ?? 7, vs = o.veinStrength ?? 1, tint = o.tint ?? [245, 245, 243];
  const cv = document.createElement('canvas'); cv.width = cv.height = size; const ctx = cv.getContext('2d')!; const img = ctx.createImageData(size, size); const d = img.data;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const nx = x / size, ny = y / size;
    const warp = fbm(nx * 3.2, ny * 3.2, seed, 5);
    // two vein systems at different scales, domain-warped by fbm so they meander like real marble
    const t1 = (nx * 2.1 + ny * 1.1 + warp * 2.6) * Math.PI; const v1 = Math.pow(1 - Math.abs(Math.sin(t1)), 22);
    const t2 = (nx * -1.2 + ny * 3.3 + warp * 3.4 + 1.7) * Math.PI; const v2 = Math.pow(1 - Math.abs(Math.sin(t2)), 30);
    const t3 = (nx * 5.0 + ny * 2.0 + fbm(nx * 9, ny * 9, seed + 5, 4) * 2.2) * Math.PI; const v3 = Math.pow(1 - Math.abs(Math.sin(t3)), 40);
    const cloud = fbm(nx * 6, ny * 6, seed + 9, 4) - 0.5; // soft mottling
    const vein = Math.min(1, (v1 * 0.55 + v2 * 0.4 + v3 * 0.22) * vs);
    const base = cloud * 14;
    const g = 150 + (1 - vein) * 0; void g;
    const r = tint[0] + base - vein * (tint[0] - 160), gg = tint[1] + base - vein * (tint[1] - 164), b = tint[2] + base - vein * (tint[2] - 170);
    const i = (y * size + x) * 4; d[i] = Math.max(0, Math.min(255, r)); d[i + 1] = Math.max(0, Math.min(255, gg)); d[i + 2] = Math.max(0, Math.min(255, b)); d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0); return cv;
}

/** Installs --marble / --marble-soft CSS variables (data URLs). */
export function installMarbleCss(): void {
  try {
    const big = makeMarble({ size: 768, seed: 11 }).toDataURL('image/jpeg', 0.86);
    const soft = makeMarble({ size: 512, seed: 23, veinStrength: 0.55 }).toDataURL('image/jpeg', 0.82);
    const r = document.documentElement.style; r.setProperty('--marble', `url(${big})`); r.setProperty('--marble-soft', `url(${soft})`);
  } catch { /* canvas unavailable: flat colours remain */ }
}
