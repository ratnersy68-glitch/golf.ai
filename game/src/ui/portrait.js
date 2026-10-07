// Tiny SVG head-and-shoulders portrait drawn from a golfer's look (for the golfer cards).
import { normalizeLook, SKIN_TONES } from '../data/look.js';
import { ALL_ITEMS } from '../data/apparel.js';

const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f))).toString(16).padStart(2, '0');
  return `#${c(n >> 16)}${c((n >> 8) & 255)}${c(n & 255)}`;
};

export function portrait(rawLook, bg = '#13241a') {
  const L = normalizeLook(rawLook);
  const skin = SKIN_TONES[L.skin] || SKIN_TONES[2];
  const hairC = L.hairColor || '#3b2a1c';
  const top = L.outfit.top, topStyle = ALL_ITEMS[top.id]?.style || 'polo';
  const hatStyle = ALL_ITEMS[L.outfit.hat?.id]?.style || 'none';
  const hatC = L.outfit.hat?.color || '#1c2a44';
  const shirt = top.color || '#f4f4f2';
  const wide = 1 + ((L.build || 1) - 1) * 0.8;
  const sw = 34 * wide;
  let s = `<rect width="100" height="110" fill="${bg}"/>`;
  // shoulders and shirt
  s += `<path d="M${50 - sw} 112 Q${50 - sw} 80 ${50 - 12} 76 L${50 + 12} 76 Q${50 + sw} 80 ${50 + sw} 112 Z" fill="${shirt}"/>`;
  s += `<path d="M${50 - sw} 112 Q${50 - sw} 86 ${50 - 20} 80" stroke="${shade(shirt, 0.82)}" stroke-width="3" fill="none"/>`;
  s += `<rect x="43" y="64" width="14" height="16" rx="4" fill="${shade(skin, 0.9)}"/>`;
  if (topStyle === 'polo') s += `<path d="M40 76 L50 88 L60 76 L56 74 L50 80 L44 74 Z" fill="${shade(shirt, 0.9)}"/><path d="M50 84 L50 96" stroke="${shade(shirt, 0.7)}" stroke-width="1.2"/>`;
  else if (topStyle === 'mock' || topStyle === 'quarterzip') s += `<rect x="41" y="72" width="18" height="8" rx="3" fill="${shade(shirt, 0.9)}"/>${topStyle === 'quarterzip' ? '<path d="M50 74 L50 96" stroke="#bbb" stroke-width="1.4"/>' : ''}`;
  else s += `<path d="M41 76 Q50 84 59 76" stroke="${shade(shirt, 0.75)}" stroke-width="3" fill="none"/>`;
  // head
  s += `<ellipse cx="33" cy="47" rx="3.5" ry="5.5" fill="${shade(skin, 0.92)}"/><ellipse cx="67" cy="47" rx="3.5" ry="5.5" fill="${shade(skin, 0.92)}"/>`;
  s += `<path d="M34 40 Q34 22 50 22 Q66 22 66 40 L66 50 Q65 66 50 70 Q35 66 34 50 Z" fill="${skin}"/>`;
  const fh = L.facialHair;
  if (fh === 'full' || fh === 'short' || fh === 'stubble') s += `<path d="M35 50 Q37 68 50 71 Q63 68 65 50 Q62 60 50 62 Q38 60 35 50 Z" fill="${hairC}" opacity="${fh === 'stubble' ? 0.35 : 0.9}"/>`;
  // hair
  const hs = L.hair;
  if (hs !== 'bald' && hatStyle !== 'cap' && hatStyle !== 'flatcap' && hatStyle !== 'bucket' && hatStyle !== 'panama') {
    if (hs === 'curly' || hs === 'afro') s += `<path d="M31 42 Q28 18 50 15 Q72 18 69 42 Q66 30 50 30 Q34 30 31 42 Z" fill="${hairC}"/>${[36, 44, 52, 60].map(x => `<circle cx="${x + 2}" cy="${21 + (x % 8)}" r="6" fill="${hairC}"/>`).join('')}`;
    else if (hs === 'sidepart') s += `<path d="M33 42 Q31 19 50 18 Q69 19 67 40 Q63 28 47 27 Q40 28 38 34 Q36 38 33 42 Z" fill="${hairC}"/><path d="M41 21 Q44 25 47 27" stroke="${shade(hairC, 0.7)}" stroke-width="1"/>`;
    else if (hs === 'slick') s += `<path d="M33 40 Q32 18 50 17 Q68 18 67 40 Q64 26 50 25 Q36 26 33 40 Z" fill="${hairC}"/>`;
    else if (hs === 'ponytail' || hs === 'long' || hs === 'longwavy') s += `<path d="M31 62 Q26 18 50 17 Q74 18 69 62 L64 40 Q60 27 50 27 Q40 27 36 40 Z" fill="${hairC}"/>`;
    else s += `<path d="M33 40 Q32 19 50 18 Q68 19 67 40 Q64 28 50 28 Q36 28 33 40 Z" fill="${hairC}"/>`;
  } else if (hs !== 'bald') {
    s += `<path d="M33 46 L34 38 L38 38 L38 46 Z M67 46 L66 38 L62 38 L62 46 Z" fill="${hairC}"/>`;
  }
  // hats
  if (hatStyle === 'cap') s += `<path d="M32 38 Q32 17 50 17 Q68 17 68 38 Z" fill="${hatC}"/><path d="M30 38 Q50 33 72 38 Q70 43 50 41 Q32 43 30 38 Z" fill="${shade(hatC, 0.75)}"/><circle cx="50" cy="27" r="3.2" fill="${shade(hatC, 1.6)}" opacity="0.7"/>`;
  else if (hatStyle === 'flatcap') s += `<path d="M31 37 Q30 20 52 19 Q72 21 69 36 Z" fill="${hatC}"/><path d="M29 37 Q50 31 73 37 Q71 41 50 40 Q31 41 29 37 Z" fill="${shade(hatC, 0.8)}"/>`;
  else if (hatStyle === 'visor') s += `<path d="M32 33 L68 33 L68 37 L32 37 Z" fill="${hatC}"/><path d="M30 37 Q50 32 72 37 Q70 42 50 40 Q32 42 30 37 Z" fill="${shade(hatC, 0.8)}"/>`;
  else if (hatStyle === 'bucket' || hatStyle === 'panama') s += `<path d="M34 36 Q34 16 50 16 Q66 16 66 36 Z" fill="${hatC}"/><path d="M26 39 Q50 31 74 39 Q72 43 50 41 Q28 43 26 39 Z" fill="${shade(hatC, 0.8)}"/>`;
  // face
  s += `<path d="M40 40 L46 39 M54 39 L60 40" stroke="${shade(hairC, 0.9)}" stroke-width="1.8" stroke-linecap="round"/>`;
  if (L.accessory === 'sunglasses' || L.accessory === 'aviators' || L.accessory === 'both') s += `<rect x="38" y="42" width="24" height="6" rx="3" fill="#15181c"/>`;
  else s += `<circle cx="43.5" cy="45" r="1.6" fill="#1d1712"/><circle cx="56.5" cy="45" r="1.6" fill="#1d1712"/>`;
  s += `<path d="M50 46 L48.5 53 L51 54" stroke="${shade(skin, 0.75)}" stroke-width="1.2" fill="none"/>`;
  s += `<path d="M45 59 Q50 61.5 55 59" stroke="${shade(skin, 0.6)}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">${s}</svg>`;
}
