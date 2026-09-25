// Character appearance model: body, face, hair and the equipped outfit.
import { DEFAULT_OUTFIT, TOPS, BOTTOMS, SHOES, HATS, GLOVES, ALL_ITEMS } from './apparel.js';

export const SKIN_TONES = ['#f7dcc4', '#f3d2b3', '#eac29c', '#e0ac85', '#d49a70', '#c68863', '#b07650', '#9b6a47', '#83573a', '#6b4630', '#583a28', '#4a3021'];
export const HAIR_COLORS = ['#0e0e0e', '#2a1d15', '#3b2a1c', '#4a3322', '#6b4a2e', '#7a5a3a', '#a07448', '#b58a55', '#d9b77a', '#e8cf98', '#9a3a1c', '#b8502a', '#8c8c8c', '#c4c4c4', '#ececec'];
export const EYE_COLORS = [['Brown', '#4a2c16'], ['Dark Brown', '#2a180c'], ['Hazel', '#7a5a2a'], ['Green', '#3f7a4a'], ['Blue', '#3a6ea5'], ['Grey', '#7c8a94'], ['Amber', '#a0692a']];
export const HAIR_STYLES = [
  ['buzz', 'Buzz Cut'], ['crew', 'Crew Cut'], ['short', 'Short'], ['fade', 'Skin Fade'], ['sidepart', 'Side Part'],
  ['slick', 'Slicked Back'], ['quiff', 'Quiff'], ['crop', 'Textured Crop'], ['medium', 'Medium'], ['wavy', 'Wavy'],
  ['curly', 'Curly'], ['afro', 'Afro'], ['long', 'Long Straight'], ['longwavy', 'Long Wavy'], ['ponytail', 'Ponytail'],
  ['bun', 'Man Bun'], ['bob', 'Bob'], ['bald', 'Bald'],
];
export const FACE_SHAPES = [['oval', 'Oval'], ['round', 'Round'], ['square', 'Square'], ['long', 'Long'], ['heart', 'Heart']];
export const EYE_SHAPES = [['round', 'Round'], ['almond', 'Almond'], ['narrow', 'Narrow'], ['wide', 'Wide-set']];
export const BROWS = [['medium', 'Medium'], ['thin', 'Thin'], ['thick', 'Thick'], ['arched', 'Arched'], ['straight', 'Straight']];
export const NOSES = [['medium', 'Medium'], ['small', 'Small'], ['large', 'Large'], ['broad', 'Broad'], ['narrow', 'Narrow'], ['button', 'Button']];
export const MOUTHS = [['neutral', 'Neutral'], ['smile', 'Smile'], ['grin', 'Grin'], ['wide', 'Wide'], ['full', 'Full Lips']];
export const JAWS = [['normal', 'Normal'], ['narrow', 'Narrow'], ['strong', 'Strong'], ['chiselled', 'Chiselled']];
export const FACIAL_HAIR = [['none', 'Clean Shaven'], ['stubble', 'Stubble'], ['mustache', 'Mustache'], ['goatee', 'Goatee'], ['chinstrap', 'Chin Strap'], ['short', 'Short Beard'], ['full', 'Full Beard']];
export const ACCESSORIES = [['none', 'None'], ['sunglasses', 'Sport Sunglasses'], ['aviators', 'Aviators'], ['watch', 'Luxury Watch'], ['both', 'Sunglasses + Watch']];

export const DEFAULT_LOOK = {
  v: 2, name: 'You', gender: 'M',
  height: 1, build: 1, shoulders: 1, legs: 1,
  skin: 2, faceShape: 'oval', jaw: 'normal', eyeShape: 'almond', eyeColor: '#4a2c16', brows: 'medium', nose: 'medium', mouth: 'neutral',
  facialHair: 'none', hair: 'crew', hairColor: '#3b2a1c', accessory: 'none',
  outfit: JSON.parse(JSON.stringify(DEFAULT_OUTFIT)),
};

const oldHair = { short: 'short', buzz: 'buzz', curly: 'curly', long: 'long', ponytail: 'ponytail', bald: 'bald' };
const findStyle = (list, style, fallback) => (list.find(i => i.style === style) || fallback);

// Accepts both the new format and the original v1 look (and pro looks) and returns a v2 look.
export function normalizeLook(look = {}) {
  if (look.v === 2 && look.outfit) {
    const o = { ...DEFAULT_LOOK, ...look, outfit: { ...DEFAULT_LOOK.outfit, ...look.outfit } };
    for (const k of Object.keys(o.outfit)) if (!ALL_ITEMS[o.outfit[k]?.id]) o.outfit[k] = DEFAULT_LOOK.outfit[k];
    return JSON.parse(JSON.stringify(o));
  }
  const L = { ...DEFAULT_LOOK, outfit: JSON.parse(JSON.stringify(DEFAULT_OUTFIT)) };
  if (look.name) L.name = look.name;
  if (look.gender) L.gender = look.gender;
  if (typeof look.skin === 'number') L.skin = Math.min(SKIN_TONES.length - 1, [0, 1, 3, 5, 7, 9][look.skin] ?? 2);
  if (look.hair) L.hair = oldHair[look.hair] || 'short';
  if (look.hairColor) L.hairColor = look.hairColor;
  if (look.beard) L.facialHair = 'full';
  if (look.build) L.build = look.build;
  if (look.accessory || look.glasses) L.accessory = look.glasses ? 'sunglasses' : look.accessory;
  const st = look.shirtStyle || 'polo';
  const top = st === 'quarterzip' ? findStyle(TOPS, 'quarterzip', TOPS[5]) : st === 'vest' ? findStyle(TOPS, 'vest', TOPS[5]) : st === 'greenjacket' ? findStyle(TOPS, 'sweater', TOPS[5]) : TOPS[5];
  L.outfit.top = { id: top.id, color: look.shirt || '#f4f4f2', pattern: st === 'stripe' ? 'stripe' : 'solid' };
  const bst = look.legs === 'shorts' ? 'shorts' : look.legs === 'skirt' ? 'shorts' : 'pants';
  L.outfit.bottom = { id: findStyle(BOTTOMS, bst, BOTTOMS[3]).id, color: look.pants || '#1d2638', pattern: 'solid', fit: 'Regular' };
  L.outfit.shoes = { id: SHOES[0].id, colorway: look.shoes && look.shoes !== '#ffffff' && look.shoes !== '#f4f4f4' ? 1 : 0, spikes: true, closure: 'laces' };
  const hatStyle = { cap: 'cap', visor: 'visor', bucket: 'bucket', flatcap: 'flatcap', panama: 'panama' }[look.hat];
  L.outfit.hat = hatStyle ? { id: findStyle(HATS, hatStyle, HATS[0]).id, color: look.hatColor || '#1c2a44', pattern: 'solid', logo: true, fit: 'Structured' } : { id: 'hat-none' };
  L.outfit.glove = { id: GLOVES[0].id, color: look.glove || '#f4f4f2' };
  return L;
}
