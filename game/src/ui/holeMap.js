// Top-down "yardage book" drawing of a hole, rasterized on a small 2D canvas from the hole's
// layout (no terrain grid, no WebGL). Used for the course cards in the menus.
import { Hole, S, SURF_KEYS } from '../core/holeGen.js';
import { THEMES } from '../data/themes.js';

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

export function holeMap(course, idx, W = 230, Ht = 100) {
  const hole = new Hole(course, idx, { planOnly: true });
  const th = THEMES[course.theme];
  const pal = SURF_KEYS.map(k => hex(th[k] || th.rough));
  pal[S.PATH] = hex('#b9b4a6');
  pal[S.WATER] = hex(th.water);
  // frame: tee on the left, green on the right
  const tee = hole.at(hole.teeS), G = hole.G;
  let ux = G[0] - tee.x, uy = G[1] - tee.y;
  const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
  let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9;
  for (let i = 0; i < hole.nC; i += 4) {
    if (hole.cs[i] < hole.teeS - 5 || hole.cs[i] > hole.L + 5) continue;
    const dx = hole.cx[i] - tee.x, dy = hole.cy[i] - tee.y;
    const a = dx * ux + dy * uy, b = dx * -uy + dy * ux;
    a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b);
  }
  const scale = Math.max(Math.max(260, a1 - a0 + 60) / W, (b1 - b0 + 50) / (Ht * 0.7)); // yards per pixel
  // the card's title covers the bottom of the image, so sit the hole in the upper part
  const ac = (a0 + a1) / 2, bc = (b0 + b1) / 2 - Ht * 0.14 * scale;
  const treeAmt = (th.trees?.density ?? 0.5) * (th.links ? 0.3 : 1);
  const canopy = hex('#1d4a1f'), canopyHi = hex('#2e6a2a');
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = Ht;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(W, Ht);
  const px = img.data, tmp = [0, 0];
  for (let j = 0; j < Ht; j++) {
    for (let i = 0; i < W; i++) {
      const a = ac + (i - W / 2) * scale, b = bc - (j - Ht / 2) * scale;
      const x = tee.x + a * ux - b * uy, y = tee.y + a * uy + b * ux;
      hole.nearest(x, y, tmp);
      const sf = hole.classify(x, y, tmp[0], tmp[1]);
      let [r, g, bl] = pal[sf];
      // tree canopy in the deep rough (clumped, denser on wooded courses)
      if ((sf === S.DEEP || sf === S.ROUGH) && (Math.abs(tmp[1]) > hole.fwHalf(tmp[0]) + (sf === S.DEEP ? 6 : 13) || tmp[0] < hole.teeS - 12 || tmp[0] > hole.L + 24)) {
        const t = hole.noise.noise(x / 16, y / 16) + hole.noise.noise(x / 5, y / 5) * 0.35;
        if (t > 0.55 - treeAmt * 0.75) [r, g, bl] = hole.noise.noise(x / 3 + 7, y / 3) > 0.15 ? canopyHi : canopy;
      }
      if (sf === S.FAIRWAY && (Math.floor(tmp[0] / 9) & 1)) { r *= 1.08; g *= 1.08; bl *= 1.08; }
      const n = 1 + hole.noise.noise(x / 9, y / 9) * (sf === S.WATER ? 0.04 : 0.07);
      const k = (j * W + i) * 4;
      px[k] = r * n; px[k + 1] = g * n; px[k + 2] = bl * n; px[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // flag on the green
  const ga = (G[0] - tee.x) * ux + (G[1] - tee.y) * uy, gb = (G[0] - tee.x) * -uy + (G[1] - tee.y) * ux;
  const fx = W / 2 + (ga - ac) / scale, fy = Ht / 2 - (gb - bc) / scale;
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - 14); ctx.stroke();
  ctx.fillStyle = '#e8332d';
  ctx.beginPath(); ctx.moveTo(fx, fy - 14); ctx.lineTo(fx + 8, fy - 11); ctx.lineTo(fx, fy - 8); ctx.fill();
  return cv.toDataURL('image/png');
}
