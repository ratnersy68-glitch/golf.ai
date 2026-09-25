// Small SVG product icons for the locker-room grid (tinted with the item's colors/pattern).
let uid = 0;
const lum = (hex) => { const v = parseInt((hex || '#888888').slice(1), 16); return (0.299 * (v >> 16 & 255) + 0.587 * (v >> 8 & 255) + 0.114 * (v & 255)) / 255; };
const ink = (hex) => (lum(hex) > 0.6 ? '#1c2a44' : '#f4f4f2');
const dark = (hex, k = 0.75) => { const v = parseInt(hex.slice(1), 16); const f = (c) => Math.round(c * k).toString(16).padStart(2, '0'); return `#${f(v >> 16 & 255)}${f(v >> 8 & 255)}${f(v & 255)}`; };

// returns [defs, fill]
function paint(pattern, color, accent) {
  if (!pattern || pattern === 'solid') return ['', color];
  const id = `pt${++uid}`;
  const a = accent || ink(color);
  const P = (w, h, body) => `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><rect width="${w}" height="${h}" fill="${color}"/>${body}</pattern>`;
  let d;
  switch (pattern) {
    case 'stripe': d = P(8, 8, `<rect y="0" width="8" height="3" fill="${a}"/>`); break;
    case 'pinstripe': d = P(5, 5, `<rect width="0.8" height="5" fill="${a}"/>`); break;
    case 'gingham': d = P(8, 8, `<rect width="4" height="8" fill="${a}" opacity=".4"/><rect width="8" height="4" fill="${a}" opacity=".4"/>`); break;
    case 'heather': d = P(4, 4, `<rect width="1" height="1" fill="${dark(color, 0.85)}"/><rect x="2" y="2" width="1" height="1" fill="${dark(color, 1.15 > 1 ? 0.92 : 1)}"/>`); break;
    case 'dots': d = P(6, 6, `<circle cx="3" cy="3" r="1" fill="${a}"/>`); break;
    case 'palms': d = P(14, 14, `<path d="M7 4 l0 7 M7 4 l-3 -2 M7 4 l3 -2 M7 4 l-4 1 M7 4 l4 1" stroke="${a}" stroke-width="1.1" fill="none"/>`); break;
    case 'block': return [`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="${color}"/><stop offset=".55" stop-color="${a}"/><stop offset=".67" stop-color="${a}"/><stop offset=".67" stop-color="${dark(color, 0.7)}"/></linearGradient>`, `url(#${id})`];
    case 'plaid': d = P(12, 12, `<rect y="2" width="12" height="3" fill="${a}" opacity=".35"/><rect x="2" width="3" height="12" fill="${a}" opacity=".35"/><rect y="9" width="12" height="1" fill="#c1121f" opacity=".8"/><rect x="9" width="1" height="12" fill="#c1121f" opacity=".8"/>`); break;
    case 'houndstooth': d = P(6, 6, `<path d="M0 0h3l3 3h-3v3l-3-3z" fill="${a}" opacity=".7"/>`); break;
    case 'check': d = P(6, 6, `<path d="M0 .5h6M.5 0v6" stroke="${a}" stroke-width=".6" opacity=".6"/>`); break;
    case 'camo': d = P(16, 16, `<ellipse cx="4" cy="4" rx="4" ry="2.5" fill="${dark(color, 0.7)}"/><ellipse cx="12" cy="10" rx="4" ry="3" fill="${dark(color, 1)}" opacity=".6"/><ellipse cx="6" cy="13" rx="3" ry="2" fill="${a}" opacity=".35"/>`); break;
    default: return ['', color];
  }
  return [d, `url(#${id})`];
}
const svg = (body, defs = '', vb = '0 0 64 64') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;

export function topIcon(it, cfg, brandLogo = '') {
  const [defs, fill] = paint(it.style === 'sweater' || it.style === 'vest' ? (cfg.pattern === 'solid' ? 'heather' : cfg.pattern) : cfg.pattern, cfg.color);
  const line = dark(cfg.color, 0.6);
  const long = it.sleeves === 'long';
  const vest = it.style === 'vest';
  const sleeves = vest ? '' : long
    ? `<path d="M18 13 L6 22 L4 50 L12 51 L16 30 Z M46 13 L58 22 L60 50 L52 51 L48 30 Z" fill="${fill}" stroke="${line}" stroke-width="1"/>`
    : `<path d="M18 13 L5 24 L11 32 L18 27 Z M46 13 L59 24 L53 32 L46 27 Z" fill="${fill}" stroke="${line}" stroke-width="1"/>`;
  let collar = '';
  if (it.collar === 'classic' || it.collar === 'buttondown') collar = `<path d="M24 10 L32 20 L40 10 L36 8 L32 12 L28 8 Z" fill="${fill}" stroke="${line}" stroke-width="1"/><path d="M32 20 V30" stroke="${line}" stroke-width="1.4"/><circle cx="32" cy="23" r="1" fill="${ink(cfg.color)}"/><circle cx="32" cy="27" r="1" fill="${ink(cfg.color)}"/>`;
  if (it.collar === 'mock') collar = `<rect x="25" y="6" width="14" height="6" rx="2" fill="${fill}" stroke="${line}"/>`;
  if (it.collar === 'zip') collar = `<path d="M24 5 L40 5 L41 12 L23 12 Z" fill="${fill}" stroke="${line}"/><path d="M32 6 V32" stroke="#c8ccd1" stroke-width="1.6"/><rect x="30.5" y="12" width="3" height="4" fill="#c8ccd1"/>`;
  if (it.collar === 'crew') collar = vest
    ? `<path d="M25 10 L32 24 L39 10" fill="#f4f4f2" stroke="${line}"/><path d="M26 9 L32 7 L38 9 L36 12 L32 10 L28 12 Z" fill="#f4f4f2" stroke="#bbb"/>`
    : `<path d="M24 10 Q32 17 40 10" fill="none" stroke="${line}" stroke-width="2.5"/>`;
  const body = `<path d="M18 13 L24 9 Q32 14 40 9 L46 13 L47 56 Q32 59 17 56 Z" fill="${fill}" stroke="${line}" stroke-width="1"/>`;
  const logo = brandLogo ? `<text x="40" y="24" font-size="4" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" fill="${ink(cfg.color)}">${brandLogo}</text>` : '';
  return svg(sleeves + body + collar + logo, defs);
}

export function bottomIcon(it, cfg) {
  const [defs, fill] = paint(cfg.pattern === 'stripe' ? 'pinstripe' : cfg.pattern, cfg.color);
  const line = dark(cfg.color, 0.6);
  const w = cfg.fit === 'Slim' ? -2 : cfg.fit === 'Relaxed' ? 2 : 0;
  let body;
  if (it.style === 'shorts') body = `<path d="M16 8 H48 L${52 + w} 38 L34 40 L32 22 L30 40 L${12 - w} 38 Z" fill="${fill}" stroke="${line}"/>`;
  else {
    const hem = it.style === 'joggers' ? 4 : it.style === 'trousers' ? 1 : 2;
    body = `<path d="M16 6 H48 L${50 + w} 58 L${36 + hem} 58 L32 20 L${28 - hem} 58 L${14 - w} 58 Z" fill="${fill}" stroke="${line}"/>`;
    if (it.style === 'joggers') body += `<rect x="${14 - w}" y="55" width="${14 + hem - 4}" height="4" rx="1" fill="${dark(cfg.color, 0.75)}"/><rect x="${36 + hem}" y="55" width="${14 + w - hem + 4}" height="4" rx="1" fill="${dark(cfg.color, 0.75)}"/>`;
  }
  body += `<rect x="16" y="6" width="32" height="4" fill="#1a1a1a"/><rect x="30" y="6" width="4" height="4" fill="#c9ccd1"/>`;
  return svg(body, defs);
}

export function shoeIcon(it, cfg) {
  const cw = it.colorways[cfg.colorway] || it.colorways[0];
  const line = dark(cw.upper, 0.6);
  let body = `<path d="M6 40 Q6 28 16 26 L30 22 Q36 20 40 26 L52 32 Q60 35 60 42 L60 46 L6 46 Z" fill="${cw.upper}" stroke="${line}"/>`;
  body += `<path d="M5 45 H61 Q61 50 56 50 H9 Q5 50 5 45 Z" fill="${cw.sole}" stroke="${dark(cw.sole, 0.6)}"/>`;
  if (it.style === 'classic') body += `<path d="M24 25 L34 22 Q38 30 36 44 L24 44 Q22 34 24 25 Z" fill="${cw.accent}"/><path d="M48 31 Q58 34 60 42 L60 45 L50 45 Q50 36 48 31 Z" fill="${cw.accent}"/>`;
  else if (it.style === 'retro') body += `<path d="M18 30 L40 28 L46 42 L20 42 Z" fill="${cw.accent}" opacity=".9"/><path d="M6 32 L14 28 L14 44 L6 44 Z" fill="${cw.accent}"/>`;
  else body += `<path d="M16 40 Q34 28 54 34" stroke="${cw.accent}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if ((cfg.closure || it.closure) === 'boa') body += `<circle cx="32" cy="27" r="4" fill="#1a1a1a"/><circle cx="32" cy="27" r="2.2" fill="${cw.accent}"/>`;
  else body += `<path d="M26 27 l6 -3 M29 30 l6 -3 M32 33 l6 -3" stroke="${lum(cw.upper) > 0.5 ? '#bbb' : '#eee'}" stroke-width="1.3"/>`;
  if (cfg.spikes ?? it.spikes) body += [12, 22, 34, 46, 55].map(x => `<rect x="${x}" y="50" width="3" height="2.5" fill="#333"/>`).join('');
  return svg(body);
}

export function hatIcon(it, cfg) {
  if (!it || it.style === 'none') return svg(`<circle cx="32" cy="32" r="18" fill="none" stroke="#667" stroke-width="3"/><path d="M19 45 L45 19" stroke="#667" stroke-width="3"/>`);
  const [defs, fill] = it.style === 'panama' ? ['', cfg.color || '#e8dcb5'] : paint(cfg.pattern, cfg.color);
  const line = dark(cfg.color || '#e8dcb5', 0.6);
  let body;
  switch (it.style) {
    case 'visor': body = `<path d="M12 34 H44 V40 H12 Z" fill="${fill}" stroke="${line}"/><path d="M40 34 Q58 36 60 44 L42 42 Z" fill="${fill}" stroke="${line}"/>`; break;
    case 'bucket': body = `<path d="M18 38 Q18 16 32 16 Q46 16 46 38 Z" fill="${fill}" stroke="${line}"/><path d="M8 46 L18 36 H46 L56 46 Z" fill="${fill}" stroke="${line}"/>`; break;
    case 'flatcap': body = `<path d="M10 38 Q14 22 34 22 Q52 24 56 36 L58 40 H10 Z" fill="${fill}" stroke="${line}"/><path d="M44 38 Q56 38 60 42 L44 42 Z" fill="${dark(cfg.color, 0.85)}"/>`; break;
    case 'panama': body = `<path d="M20 36 L22 20 Q32 16 42 20 L44 36 Z" fill="${fill}" stroke="${line}"/><rect x="21" y="30" width="22" height="5" fill="#1a1a1a"/><ellipse cx="32" cy="38" rx="28" ry="5" fill="${fill}" stroke="${line}"/>`; break;
    default: {
      const flat = it.style === 'flatbrim';
      const top = (it.style === 'perf' ? 20 : 16) - (cfg.fit === 'Unstructured' ? -3 : 0);
      body = `<path d="M10 40 Q10 ${top} 32 ${top} Q50 ${top} 50 40 Z" fill="${fill}" stroke="${line}"/>`;
      body += flat ? `<path d="M46 38 H62 V42 H46 Z" fill="${dark(cfg.color || '#333', 0.85)}" stroke="${line}"/>` : `<path d="M44 38 Q58 38 62 44 L46 43 Z" fill="${fill}" stroke="${line}"/>`;
      body += `<circle cx="30" cy="${top + 1}" r="2" fill="${fill}" stroke="${line}"/>`;
      if (it.style === 'golfcap') body += `<path d="M36 36 Q42 30 48 36" stroke="${ink(cfg.color)}" stroke-width="1.5" fill="none"/>`;
    }
  }
  if (cfg.logo !== false && ['cap', 'golfcap', 'perf', 'flatbrim', 'visor', 'bucket'].includes(it.style)) body += `<circle cx="36" cy="${it.style === 'visor' ? 37 : 30}" r="3" fill="${ink(cfg.color)}" opacity=".85"/>`;
  return svg(body, defs);
}

export function gloveIcon(it, cfg) {
  const c = cfg.color || '#f4f4f2';
  const line = dark(c, 0.6);
  return svg(`<path d="M20 58 L20 34 L14 26 Q12 22 16 21 L22 26 L22 10 Q22 7 25 7 Q28 7 28 10 L28 24 L29 6 Q29 3 32 3 Q35 3 35 6 L35 24 L36 8 Q36 5 39 5 Q42 5 42 8 L42 26 L43 13 Q43 10 46 10 Q49 10 49 13 L48 40 Q48 50 44 58 Z" fill="${c}" stroke="${line}"/><rect x="26" y="44" width="14" height="7" rx="2" fill="${ink(c)}" opacity=".7"/>`);
}

export function hairIcon(style, color) {
  const face = '#e6b48f';
  const h = color;
  const head = `<ellipse cx="32" cy="36" rx="14" ry="17" fill="${face}"/>`;
  const shapes = {
    buzz: `<path d="M18 32 Q18 18 32 18 Q46 18 46 32 Q40 24 32 24 Q24 24 18 32 Z" fill="${h}" opacity=".85"/>`,
    crew: `<path d="M17 32 Q17 16 32 16 Q47 16 47 32 Q42 22 32 23 Q22 22 17 32 Z" fill="${h}"/>`,
    short: `<path d="M17 34 Q15 14 32 14 Q49 14 47 34 Q44 22 32 22 Q20 22 17 34 Z" fill="${h}"/>`,
    fade: `<path d="M18 30 Q18 14 32 14 Q46 14 46 30 Q42 20 32 21 Q22 20 18 30 Z" fill="${h}"/><path d="M18 30 V38 M46 30 V38" stroke="${h}" stroke-width="2" opacity=".4"/>`,
    sidepart: `<path d="M17 34 Q15 14 32 14 Q49 14 47 34 Q45 22 38 20 L36 16 L34 21 Q22 21 17 34 Z" fill="${h}"/>`,
    slick: `<path d="M17 32 Q16 12 34 13 Q50 15 47 32 Q44 20 32 20 Q22 20 17 32 Z" fill="${h}"/>`,
    quiff: `<path d="M17 33 Q16 16 28 14 Q30 6 42 10 Q50 14 47 33 Q44 22 32 22 Q22 22 17 33 Z" fill="${h}"/>`,
    crop: `<path d="M17 33 Q16 14 32 14 Q48 14 47 33 L44 27 L40 28 L36 26 L32 28 L28 26 L24 28 L20 27 Z" fill="${h}"/>`,
    medium: `<path d="M15 42 Q12 12 32 12 Q52 12 49 42 L46 42 Q46 22 32 22 Q18 22 18 42 Z" fill="${h}"/>`,
    wavy: `<path d="M15 42 Q10 30 14 22 Q16 10 32 10 Q48 10 50 22 Q54 30 49 42 L46 42 Q46 22 32 22 Q18 22 18 42 Z" fill="${h}"/><path d="M20 16 q4 4 8 0 q4 4 8 0 q4 4 8 0" stroke="${dark(h, 0.7)}" fill="none"/>`,
    curly: [...Array(9)].map((_, i) => `<circle cx="${18 + i * 3.5}" cy="${18 + Math.abs(4 - i) * 1.4}" r="5" fill="${h}"/>`).join(''),
    afro: `<circle cx="32" cy="26" r="21" fill="${h}"/>`,
    long: `<path d="M14 58 Q10 12 32 12 Q54 12 50 58 L45 58 Q46 24 32 23 Q18 24 19 58 Z" fill="${h}"/>`,
    longwavy: `<path d="M14 58 q-4 -6 0 -12 q-4 -8 0 -16 Q14 12 32 12 Q50 12 50 30 q4 8 0 16 q4 6 0 12 L45 58 Q46 24 32 23 Q18 24 19 58 Z" fill="${h}"/>`,
    ponytail: `<path d="M17 34 Q15 14 32 14 Q49 14 47 34 Q44 22 32 22 Q20 22 17 34 Z" fill="${h}"/><path d="M46 22 Q58 26 54 44 Q50 34 46 30 Z" fill="${h}"/>`,
    bun: `<circle cx="32" cy="10" r="7" fill="${h}"/><path d="M17 34 Q15 14 32 14 Q49 14 47 34 Q44 22 32 22 Q20 22 17 34 Z" fill="${h}"/>`,
    bob: `<path d="M13 46 Q10 12 32 12 Q54 12 51 46 L45 46 Q46 22 32 22 Q18 22 19 46 Z" fill="${h}"/>`,
    bald: `<ellipse cx="28" cy="24" rx="5" ry="2.5" fill="#fff" opacity=".35"/>`,
  };
  const s = shapes[style] || shapes.short;
  const behind = ['afro', 'long', 'longwavy', 'bob', 'medium', 'wavy'].includes(style);
  return svg(behind && style === 'afro' ? s + head : head + s);
}

export function clubIcon(cat) {
  const head = {
    wood: '<ellipse cx="44" cy="52" rx="13" ry="7" fill="#26282c" stroke="#8d9197"/>',
    hybrid: '<ellipse cx="44" cy="52" rx="10" ry="5.5" fill="#303236" stroke="#8d9197"/>',
    iron: '<path d="M36 46 L54 50 L54 56 L36 56 Z" fill="#c9ccd1" stroke="#777"/>',
    wedge: '<path d="M36 44 L53 48 L54 57 L36 57 Z" fill="#b8bcc2" stroke="#777"/>',
    putter: '<rect x="34" y="50" width="22" height="7" rx="2" fill="#c7cbd0" stroke="#777"/>',
  }[cat] || '';
  return svg(`<path d="M20 6 L38 50" stroke="#d4d8dd" stroke-width="2"/><path d="M18 4 L24 18" stroke="#18191b" stroke-width="5" stroke-linecap="round"/>${head}`);
}
