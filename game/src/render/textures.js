// Procedural textures: terrain splat from the hole surface map, detail noise,
// water normals, and small helper canvases.
import * as THREE from 'three';
import { S } from '../core/holeGen.js';
import { mulberry32 } from '../core/noise.js';

export function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function buildTerrainTexture(hole) {
  const T = hole.theme;
  const w = hole.snx, h = hole.sny;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const px = img.data;
  const col = [];
  col[S.DEEP] = hexToRgb(T.deep);
  col[S.ROUGH] = hexToRgb(T.rough);
  col[S.FIRSTCUT] = mix(hexToRgb(T.rough), hexToRgb(T.fairway), 0.55);
  col[S.FAIRWAY] = hexToRgb(T.fairway);
  col[S.FRINGE] = hexToRgb(T.fringe);
  col[S.GREEN] = hexToRgb(T.green);
  col[S.TEE] = hexToRgb(T.tee);
  col[S.SAND] = hexToRgb(T.sand);
  col[S.WASTE] = hexToRgb(T.waste);
  col[S.WATER] = mix(hexToRgb(T.water), [60, 70, 40], 0.4);
  col[S.BRUSH] = hexToRgb(T.brush);
  col[S.STRAW] = hexToRgb(T.straw);
  col[S.PATH] = [150, 146, 138];
  const fw2 = hexToRgb(T.fairway2);
  const rnd = mulberry32(hole.seed);
  const nz = hole.noise;
  const surf = hole.surf, stripe = hole.stripe;
  for (let j = 0; j < h; j++) {
    const y = hole.gy0 + j * 0.5;
    for (let i = 0; i < w; i++) {
      const x = hole.gx0 + i * 0.5;
      const k = j * w + i;
      const s = surf[k];
      let c = col[s];
      let r = c[0], g = c[1], b = c[2];
      const n1 = nz.noise(x / 23, y / 23);
      const n2 = nz.noise(x / 5.3 + 50, y / 5.3 + 50);
      const jit = (rnd() - 0.5);
      let m = 1 + n1 * 0.12 + n2 * 0.05;
      switch (s) {
        case S.FAIRWAY: case S.TEE:
          if (stripe[k]) { r = fw2[0]; g = fw2[1]; b = fw2[2]; }
          m += jit * 0.03;
          break;
        case S.GREEN: {
          const st = ((Math.floor(x / 3.5) + Math.floor(y / 3.5)) & 1) ? 1.035 : 0.975;
          m = m * 0.35 + 0.65; m *= st; m += jit * 0.02;
          break;
        }
        case S.FRINGE: m += jit * 0.03; break;
        case S.SAND: m = 1 + n2 * 0.04 + jit * 0.07; break;
        case S.WASTE: m = 1 + n1 * 0.15 + jit * 0.16; if (rnd() < 0.08) { r *= 0.6; g *= 0.75; b *= 0.45; } break;
        case S.ROUGH: m += jit * 0.1; break;
        case S.DEEP: m += jit * 0.18 + n2 * 0.08; if (T.links && rnd() < 0.05) { r += 30; g += 22; } break;
        case S.STRAW: m = 1 + n2 * 0.2 + jit * 0.3; break;
        case S.BRUSH: m = 1 + n2 * 0.3 + jit * 0.3; if (rnd() < 0.2) { r *= 0.7; g *= 0.9; b *= 0.6; } break;
        default: m += jit * 0.05;
      }
      px[k * 4] = clamp255(r * m);
      px[k * 4 + 1] = clamp255(g * m);
      px[k * 4 + 2] = clamp255(b * m);
      px[k * 4 + 3] = 255;
    }
  }
  // soften edges with a light blur, keeping stripes crisp enough
  blur(px, w, h);
  // dark bunker lips / green collar shading
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.userData.canvas = canvas;
  return tex;
}

function blur(px, w, h) {
  const src = new Uint8ClampedArray(px);
  for (let j = 1; j < h - 1; j++) {
    for (let i = 1; i < w - 1; i++) {
      const k = (j * w + i) * 4;
      for (let c = 0; c < 3; c++) {
        const v = src[k + c] * 4 + src[k + c - 4] + src[k + c + 4] + src[k + c - w * 4] + src[k + c + w * 4];
        px[k + c] = v >> 3;
      }
    }
  }
}

function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function clamp255(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

let _detail = null;
export function detailTexture() {
  if (_detail) return _detail;
  const N = 256;
  const c = document.createElement('canvas'); c.width = c.height = N;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(N, N);
  const r = mulberry32(77);
  // tileable noise from summed sinusoids + random speckle
  const waves = [];
  for (let i = 0; i < 14; i++) waves.push([Math.floor(r() * 12) + 1, Math.floor(r() * 12) + 1, r() * 6.28, 0.5 / (i * 0.4 + 1)]);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    let v = 0;
    for (const [a, b, p, amp] of waves) v += Math.sin((i * a + j * b) / N * Math.PI * 2 + p) * amp;
    v = 128 + v * 26 + (r() - 0.5) * 70;
    const k = (j * N + i) * 4;
    img.data[k] = img.data[k + 1] = img.data[k + 2] = clamp255(v);
    img.data[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  _detail = new THREE.CanvasTexture(c);
  _detail.wrapS = _detail.wrapT = THREE.RepeatWrapping;
  _detail.colorSpace = THREE.NoColorSpace;
  _detail.anisotropy = 8;
  return _detail;
}

let _waterN = null;
export function waterNormalTexture() {
  if (_waterN) return _waterN;
  const N = 256;
  const c = document.createElement('canvas'); c.width = c.height = N;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(N, N);
  const r = mulberry32(5);
  const waves = [];
  for (let i = 0; i < 18; i++) waves.push([Math.floor(r() * 16) - 8, Math.floor(r() * 16) - 8, r() * 6.28, 1 / (i * 0.3 + 1)]);
  const H = (i, j) => {
    let v = 0;
    for (const [a, b, p, amp] of waves) v += Math.sin((i * a + j * b) / N * Math.PI * 2 + p) * amp;
    return v;
  };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const dx = H(i + 1, j) - H(i - 1, j), dy = H(i, j + 1) - H(i, j - 1);
    const nx = -dx * 1.2, ny = -dy * 1.2, nz = 1;
    const l = Math.hypot(nx, ny, nz);
    const k = (j * N + i) * 4;
    img.data[k] = (nx / l * 0.5 + 0.5) * 255;
    img.data[k + 1] = (ny / l * 0.5 + 0.5) * 255;
    img.data[k + 2] = (nz / l * 0.5 + 0.5) * 255;
    img.data[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  _waterN = new THREE.CanvasTexture(c);
  _waterN.wrapS = _waterN.wrapT = THREE.RepeatWrapping;
  _waterN.colorSpace = THREE.NoColorSpace;
  return _waterN;
}

export function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
