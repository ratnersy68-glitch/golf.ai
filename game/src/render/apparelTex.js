// Fabric pattern & brand-logo textures for apparel (cached canvas textures).
import * as THREE from 'three';
import { BRANDS } from '../data/apparel.js';

const cache = new Map();
const lum = (hex) => { const v = parseInt(hex.slice(1), 16); return (0.299 * (v >> 16 & 255) + 0.587 * (v >> 8 & 255) + 0.114 * (v & 255)) / 255; };
export const contrast = (hex) => (lum(hex) > 0.6 ? '#1c2a44' : '#f4f4f2');
const shade = (hex, k) => { const v = parseInt(hex.slice(1), 16); const f = (c) => Math.max(0, Math.min(255, Math.round(c * k))); return `rgb(${f(v >> 16 & 255)},${f(v >> 8 & 255)},${f(v & 255)})`; };

function make(key, w, h, draw, repeat = [1, 1]) {
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  cache.set(key, t);
  return t;
}

// pattern: solid | stripe | pinstripe | gingham | heather | dots | palms | block | plaid | houndstooth | check | camo
export function fabricTexture(pattern, color, accent) {
  if (!pattern || pattern === 'solid') return null;
  accent = accent || contrast(color);
  const key = `${pattern}|${color}|${accent}`;
  return make(key, 64, 64, (ctx, w, h) => {
    ctx.fillStyle = color; ctx.fillRect(0, 0, w, h);
    switch (pattern) {
      case 'stripe': ctx.fillStyle = accent; for (let y = 0; y < h; y += 16) ctx.fillRect(0, y, w, 6); break;
      case 'pinstripe': ctx.fillStyle = accent; for (let x = 0; x < w; x += 8) ctx.fillRect(x, 0, 1.2, h); break;
      case 'gingham': ctx.globalAlpha = 0.45; ctx.fillStyle = accent; for (let i = 0; i < w; i += 16) { ctx.fillRect(i, 0, 8, h); ctx.fillRect(0, i, w, 8); } break;
      case 'heather': for (let i = 0; i < 900; i++) { ctx.fillStyle = Math.random() < 0.5 ? shade(color, 1.18) : shade(color, 0.82); ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } break;
      case 'dots': ctx.fillStyle = accent; for (let y = 4; y < h; y += 10) for (let x = (y / 10 % 2) * 5 + 3; x < w; x += 10) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill(); } break;
      case 'palms': ctx.fillStyle = accent; for (const [x, y] of [[14, 14], [46, 30], [22, 50]]) { for (let a = 0; a < 6; a++) { ctx.save(); ctx.translate(x, y); ctx.rotate(a * 1.05); ctx.fillRect(0, -1, 9, 2); ctx.restore(); } ctx.fillRect(x - 1, y, 2, 10); } break;
      case 'block': ctx.fillStyle = accent; ctx.fillRect(0, h * 0.55, w, h * 0.12); ctx.fillStyle = shade(color, 0.7); ctx.fillRect(0, h * 0.67, w, h * 0.33); break;
      case 'plaid': ctx.globalAlpha = 0.35; ctx.fillStyle = accent; ctx.fillRect(0, 10, w, 12); ctx.fillRect(10, 0, 12, h); ctx.globalAlpha = 0.6; ctx.fillStyle = shade(color, 0.6); ctx.fillRect(0, 40, w, 4); ctx.fillRect(40, 0, 4, h); ctx.globalAlpha = 0.8; ctx.fillStyle = '#c1121f'; ctx.fillRect(0, 54, w, 1.5); ctx.fillRect(54, 0, 1.5, h); break;
      case 'houndstooth': ctx.fillStyle = accent; for (let y = 0; y < h; y += 8) for (let x = 0; x < w; x += 8) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 4, y); ctx.lineTo(x + 8, y + 4); ctx.lineTo(x + 4, y + 4); ctx.lineTo(x + 4, y + 8); ctx.lineTo(x, y + 4); ctx.fill(); } break;
      case 'check': ctx.strokeStyle = accent; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; for (let i = 0; i < w; i += 12) { ctx.beginPath(); ctx.moveTo(i + 0.5, 0); ctx.lineTo(i + 0.5, h); ctx.moveTo(0, i + 0.5); ctx.lineTo(w, i + 0.5); ctx.stroke(); } break;
      case 'camo': { const cs = [shade(color, 0.7), shade(color, 1.25), accent]; for (let i = 0; i < 26; i++) { ctx.fillStyle = cs[i % 3]; ctx.globalAlpha = i % 3 === 2 ? 0.35 : 0.8; ctx.beginPath(); ctx.ellipse((i * 37) % w, (i * 23) % h, 8 + (i % 4) * 3, 5 + (i % 3) * 3, i, 0, 7); ctx.fill(); } break; }
    }
  }, pattern === 'block' ? [1, 1] : [3, 3]);
}

export function logoTexture(brandKey, fg = '#ffffff', bg = null) {
  const b = BRANDS[brandKey];
  if (!b) return null;
  return make(`logo|${brandKey}|${fg}|${bg}`, 128, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
    ctx.fillStyle = fg;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const size = b.logo.length > 6 ? 22 : b.logo.length > 3 ? 30 : 38;
    ctx.font = `${b.font === 'serif' ? 'bold italic' : b.font === 'script' ? 'italic bold' : '900'} ${size}px ${b.font === 'serif' || b.font === 'script' ? 'Georgia, serif' : 'Arial Black, Arial, sans-serif'}`;
    ctx.fillText(b.logo, w / 2, h / 2 + 2);
  });
}

// knit texture for sweaters (subtle cable pattern)
export function knitTexture(color) {
  return make(`knit|${color}`, 64, 64, (ctx, w, h) => {
    ctx.fillStyle = color; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = shade(color, 0.86); ctx.lineWidth = 1.5;
    for (let x = 4; x < w; x += 16) { ctx.beginPath(); for (let y = 0; y <= h; y += 8) ctx.lineTo(x + ((y / 8) % 2 ? 2.5 : -2.5), y); ctx.stroke(); }
    ctx.fillStyle = shade(color, 0.92); for (let x = 12; x < w; x += 16) ctx.fillRect(x, 0, 1, h);
  }, [6, 5]);
}
