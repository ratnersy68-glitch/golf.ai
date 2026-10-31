// Small SVG club icons for the bag carousel.
const svg = (body, defs = '', vb = '0 0 64 64') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;

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
