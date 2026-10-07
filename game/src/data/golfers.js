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
  { id: 'schauffele', name: 'Xander Schauffele', country: 'USA', hand: 'R', power: 91, accuracy: 90, shortGame: 88, putting: 87, recovery: 89,
    look: { skin: 2, hair: 'short', hairColor: '#1a1410', hat: 'cap', hatColor: '#ffffff', shirt: '#7b1f2b', shirtStyle: 'polo', pants: '#ffffff', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'aberg', name: 'Ludvig Åberg', country: 'SWE', hand: 'R', power: 94, accuracy: 90, shortGame: 84, putting: 84, recovery: 85,
    look: { skin: 0, hair: 'short', hairColor: '#7a5a3a', hat: 'cap', hatColor: '#1c2a44', shirt: '#1c2a44', shirtStyle: 'quarterzip', pants: '#d4d0c5', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
];

// 🐐 GOAT tab: all-time greats in period dress. era/majors/feat are shown on their cards.
export const GOATS = [
  { id: 'woods', goat: true, name: 'Tiger Woods', country: 'USA', hand: 'R', era: '1996–2019', majors: 15, feat: '"Tiger Slam" — held all four majors at once', power: 95, accuracy: 90, shortGame: 98, putting: 96, recovery: 99,
    look: { skin: 4, hair: 'bald', hairColor: '#111', hat: 'cap', hatColor: '#111111', shirt: '#c1121f', shirtStyle: 'mock', pants: '#111111', legs: 'trousers', shoes: '#111111', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'nicklaus', goat: true, name: 'Jack Nicklaus', country: 'USA', hand: 'R', era: '1962–1986', majors: 18, feat: 'Record 18 majors, six Green Jackets', power: 94, accuracy: 93, shortGame: 88, putting: 95, recovery: 90,
    look: { skin: 0, hair: 'sidepart', hairColor: '#d9b77a', hat: 'none', shirt: '#f1d34a', shirtStyle: 'polo', pants: '#3a5a8a', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false, build: 1.1 } },
  { id: 'hogan', goat: true, name: 'Ben Hogan', country: 'USA', hand: 'R', era: '1946–1959', majors: 9, feat: 'Won 3 majors in 1953 — the "Hogan Slam"', power: 86, accuracy: 99, shortGame: 88, putting: 84, recovery: 92,
    look: { skin: 1, hair: 'slick', hairColor: '#2a1d15', hat: 'flatcap', hatColor: '#f2f0ea', shirt: '#f2f0ea', shirtStyle: 'polo', pants: '#6b6e73', legs: 'trousers', shoes: '#2a1d15', glove: '#ffffff', beard: false, glasses: false, build: 0.92 } },
  { id: 'palmer', goat: true, name: 'Arnold Palmer', country: 'USA', hand: 'R', era: '1955–1973', majors: 7, feat: 'The King — four Masters titles', power: 91, accuracy: 85, shortGame: 89, putting: 90, recovery: 96,
    look: { skin: 1, hair: 'sidepart', hairColor: '#4a3322', hat: 'none', shirt: '#eef2f6', shirtStyle: 'polo', pants: '#2b2f38', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'seve', goat: true, name: 'Seve Ballesteros', country: 'ESP', hand: 'R', era: '1976–1995', majors: 5, feat: 'Short-game magician, 3 Open Championships', power: 88, accuracy: 80, shortGame: 99, putting: 91, recovery: 100,
    look: { skin: 2, hair: 'short', hairColor: '#111111', hat: 'none', shirt: '#1c2a44', shirtStyle: 'sweater', pants: '#1c2a44', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
];

export const ALL_GOLFERS = [...PROS, ...GOATS];
export const golferById = (id) => ALL_GOLFERS.find(x => x.id === id) || PROS[0];
export const overall = (p) => Math.round(p.power * 0.22 + p.accuracy * 0.24 + p.shortGame * 0.2 + p.putting * 0.22 + p.recovery * 0.12);

// Pro looks above use the original (v1) look format; data/look.js converts them.
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
