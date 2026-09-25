// Professional golfers (personal-use roster) and appearance options.
// Attributes are 0..100: power, accuracy, shortGame, putting, recovery.

export const PROS = [
  { id: 'scheffler', name: 'Scottie Scheffler', country: 'USA', hand: 'R', power: 91, accuracy: 94, shortGame: 91, putting: 87, recovery: 93,
    look: { skin: 1, hair: 'short', hairColor: '#4a3322', hat: 'cap', hatColor: '#1c2a44', shirt: '#dfe7ef', shirtStyle: 'polo', pants: '#2b2f38', legs: 'trousers', shoes: '#f4f4f4', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'mcilroy', name: 'Rory McIlroy', country: 'NIR', hand: 'R', power: 97, accuracy: 85, shortGame: 86, putting: 85, recovery: 88,
    look: { skin: 1, hair: 'curly', hairColor: '#2a1d15', hat: 'cap', hatColor: '#ffffff', shirt: '#2a2a2a', shirtStyle: 'polo', pants: '#bfc3c8', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'rahm', name: 'Jon Rahm', country: 'ESP', hand: 'R', power: 93, accuracy: 89, shortGame: 91, putting: 86, recovery: 90,
    look: { skin: 2, hair: 'short', hairColor: '#1c1510', hat: 'cap', hatColor: '#0e1a33', shirt: '#0e1a33', shirtStyle: 'polo', pants: '#e6e2d9', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: true, glasses: false, build: 1.15 } },
  { id: 'dechambeau', name: 'Bryson DeChambeau', country: 'USA', hand: 'R', power: 100, accuracy: 80, shortGame: 82, putting: 87, recovery: 82,
    look: { skin: 0, hair: 'short', hairColor: '#8a6a45', hat: 'flatcap', hatColor: '#d9d4c7', shirt: '#f4f4f4', shirtStyle: 'polo', pants: '#1c1c1c', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false, build: 1.2 } },
  { id: 'spieth', name: 'Jordan Spieth', country: 'USA', hand: 'R', power: 85, accuracy: 80, shortGame: 94, putting: 93, recovery: 96,
    look: { skin: 0, hair: 'short', hairColor: '#4a3322', hat: 'cap', hatColor: '#ffffff', shirt: '#3a6ea5', shirtStyle: 'polo', pants: '#2b2f38', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'thomas', name: 'Justin Thomas', country: 'USA', hand: 'R', power: 89, accuracy: 87, shortGame: 92, putting: 86, recovery: 88,
    look: { skin: 0, hair: 'short', hairColor: '#3b2a1c', hat: 'cap', hatColor: '#111111', shirt: '#111111', shirtStyle: 'polo', pants: '#9aa0a6', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'morikawa', name: 'Collin Morikawa', country: 'USA', hand: 'R', power: 86, accuracy: 97, shortGame: 86, putting: 82, recovery: 85,
    look: { skin: 3, hair: 'short', hairColor: '#111111', hat: 'cap', hatColor: '#ffffff', shirt: '#ffffff', shirtStyle: 'polo', pants: '#1c2a44', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'hovland', name: 'Viktor Hovland', country: 'NOR', hand: 'R', power: 91, accuracy: 89, shortGame: 80, putting: 83, recovery: 84,
    look: { skin: 0, hair: 'short', hairColor: '#6d5237', hat: 'cap', hatColor: '#2a2a2a', shirt: '#c7d7e6', shirtStyle: 'polo', pants: '#2b2f38', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'schauffele', name: 'Xander Schauffele', country: 'USA', hand: 'R', power: 91, accuracy: 90, shortGame: 88, putting: 87, recovery: 89,
    look: { skin: 2, hair: 'short', hairColor: '#1a1410', hat: 'cap', hatColor: '#ffffff', shirt: '#7b1f2b', shirtStyle: 'polo', pants: '#ffffff', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'aberg', name: 'Ludvig Åberg', country: 'SWE', hand: 'R', power: 94, accuracy: 90, shortGame: 84, putting: 84, recovery: 85,
    look: { skin: 0, hair: 'short', hairColor: '#7a5a3a', hat: 'cap', hatColor: '#1c2a44', shirt: '#1c2a44', shirtStyle: 'quarterzip', pants: '#d4d0c5', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'korda', name: 'Nelly Korda', country: 'USA', hand: 'R', power: 84, accuracy: 91, shortGame: 88, putting: 87, recovery: 86,
    look: { skin: 0, gender: 'F', hair: 'ponytail', hairColor: '#d9b77a', hat: 'visor', hatColor: '#ffffff', shirt: '#f2b8c6', shirtStyle: 'polo', pants: '#ffffff', legs: 'skirt', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'woods', name: 'Tiger Woods', country: 'USA', hand: 'R', power: 88, accuracy: 90, shortGame: 97, putting: 92, recovery: 98,
    look: { skin: 4, hair: 'bald', hairColor: '#111', hat: 'cap', hatColor: '#111111', shirt: '#c1121f', shirtStyle: 'polo', pants: '#111111', legs: 'trousers', shoes: '#111111', glove: '#ffffff', beard: false, glasses: false } },
];

export const SKIN_TONES = ['#f3d2b3', '#e0ac85', '#c68863', '#9b6a47', '#6b4630', '#4a3021'];
export const HAIR_STYLES = [
  { id: 'short', name: 'Short' }, { id: 'buzz', name: 'Buzz' }, { id: 'curly', name: 'Curly' },
  { id: 'long', name: 'Long' }, { id: 'ponytail', name: 'Ponytail' }, { id: 'bald', name: 'Bald' },
];
export const HAIR_COLORS = ['#111111', '#2a1d15', '#4a3322', '#7a5a3a', '#b58a55', '#d9b77a', '#9a3a1c', '#9c9c9c', '#e9e9e9'];
export const PALETTE = ['#ffffff', '#111111', '#1c2a44', '#1e56b8', '#3a6ea5', '#7fb3d5', '#0d6e6e', '#2f7d3a', '#9ccc65', '#f2c94c', '#f2994a', '#c1121f', '#7b1f2b', '#f2b8c6', '#8e44ad', '#bfc3c8', '#6b4a2b', '#d4d0c5'];

// Cosmetic catalogue: unlock = profile level required.
export const HATS = [
  { id: 'none', name: 'No Hat', unlock: 1 },
  { id: 'cap', name: 'Tour Cap', unlock: 1 },
  { id: 'visor', name: 'Visor', unlock: 1 },
  { id: 'bucket', name: 'Bucket Hat', unlock: 2 },
  { id: 'flatcap', name: 'Flat Cap (Scottish)', unlock: 3 },
  { id: 'panama', name: 'Panama', unlock: 5 },
];
export const SHIRTS = [
  { id: 'polo', name: 'Tour Polo', unlock: 1 },
  { id: 'stripe', name: 'Striped Polo', unlock: 1 },
  { id: 'quarterzip', name: 'Quarter-Zip', unlock: 2 },
  { id: 'vest', name: 'Sweater Vest', unlock: 3 },
  { id: 'greenjacket', name: 'Green Jacket', unlock: 8, fixedColor: '#1f6b3a' },
];
export const LEGS = [
  { id: 'trousers', name: 'Trousers', unlock: 1 },
  { id: 'shorts', name: 'Shorts', unlock: 1 },
  { id: 'skirt', name: 'Skort', unlock: 1 },
  { id: 'plusfours', name: 'Plus Fours', unlock: 6 },
];
export const SHOES = [
  { id: 'fj', name: 'FootJoy Premiere Series', unlock: 1 },
  { id: 'ecco', name: 'ECCO Biom H5', unlock: 2 },
  { id: 'adidas', name: 'adidas Tour360 24', unlock: 3 },
  { id: 'jordan', name: 'Air Jordan 1 Low G', unlock: 5 },
];
export const GLOVES = [
  { id: 'fj', name: 'FootJoy StaSof', unlock: 1 },
  { id: 'titleist', name: 'Titleist Players', unlock: 2 },
  { id: 'tm', name: 'TaylorMade Tour Preferred', unlock: 3 },
  { id: 'none', name: 'No Glove', unlock: 1 },
];
export const ACCESSORIES = [
  { id: 'none', name: 'None', unlock: 1 },
  { id: 'sunglasses', name: 'Oakley Sunglasses', unlock: 2 },
  { id: 'watch', name: 'Rolex Watch', unlock: 4 },
  { id: 'both', name: 'Sunglasses + Watch', unlock: 7 },
];

export const DEFAULT_LOOK = {
  name: 'You', gender: 'M', skin: 1, hair: 'short', hairColor: '#4a3322',
  hat: 'cap', hatColor: '#1c2a44', shirt: '#ffffff', shirtStyle: 'polo', shirtAlt: '#1c2a44',
  pants: '#2b2f38', legs: 'trousers', shoes: '#ffffff', shoeModel: 'fj',
  glove: '#ffffff', gloveModel: 'fj', accessory: 'none', beard: false, build: 1.0,
};

// Convert a pro's attributes into the internal skill model.
export function proAttrs(p) {
  return {
    power: p.power, driving: Math.round((p.accuracy + p.power) / 2), approach: p.accuracy,
    shortGame: p.shortGame, putting: p.putting, recovery: p.recovery,
  };
}
