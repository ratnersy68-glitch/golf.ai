// Fictional golfer roster (GLF-01..12) and legends (LEG-01..03). All names, faces and careers are original and
// do not represent real players. Attributes are 0..100: power, accuracy, shortGame, putting, recovery.

export const PROS = [
  { id: 'adrian-vale', code: 'GLF-01', name: 'Adrian Vale', country: 'USA', hand: 'R', style: 'Power driver', power: 99, accuracy: 87, shortGame: 88, putting: 88, recovery: 91,
    look: { skin: 1, hair: 'short', hairColor: '#5a3d26', hat: 'cap', hatColor: '#14213d', shirt: '#f4f4f2', shirtStyle: 'polo', pants: '#14213d', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false, build: 1.12 } },
  { id: 'mateo-serrano', code: 'GLF-02', name: 'Mateo Serrano', country: 'ESP', hand: 'R', style: 'Iron precision', power: 87, accuracy: 96, shortGame: 90, putting: 88, recovery: 88,
    look: { skin: 2, hair: 'slick', hairColor: '#1a1410', hat: 'cap', hatColor: '#ffffff', shirt: '#8c1c2c', shirtStyle: 'polo', pants: '#e9e4d8', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'kenji-mori', code: 'GLF-03', name: 'Kenji Mori', country: 'JPN', hand: 'R', style: 'Putting specialist', power: 84, accuracy: 88, shortGame: 90, putting: 97, recovery: 86,
    look: { skin: 3, hair: 'short', hairColor: '#0e0e0e', hat: 'cap', hatColor: '#1f3b2d', shirt: '#ffffff', shirtStyle: 'mock', pants: '#1f3b2d', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'oliver-kade', code: 'GLF-04', name: 'Oliver Kade', country: 'ENG', hand: 'R', style: 'Links tactician', power: 86, accuracy: 90, shortGame: 89, putting: 88, recovery: 90,
    look: { skin: 0, hair: 'sidepart', hairColor: '#a07448', hat: 'flatcap', hatColor: '#6b6e73', shirt: '#2d3b52', shirtStyle: 'quarterzip', pants: '#6b6e73', legs: 'trousers', shoes: '#2a1d15', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'luca-moretti', code: 'GLF-05', name: 'Luca Moretti', country: 'ITA', hand: 'R', style: 'Creative short game', power: 83, accuracy: 83, shortGame: 96, putting: 88, recovery: 89,
    look: { skin: 2, hair: 'curly', hairColor: '#2a1d15', hat: 'none', shirt: '#1e6f8a', shirtStyle: 'polo', pants: '#f1efe8', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: true, glasses: false } },
  { id: 'noah-mercer', code: 'GLF-06', name: 'Noah Mercer', country: 'CAN', hand: 'R', style: 'Steady all-rounder', power: 86, accuracy: 87, shortGame: 86, putting: 86, recovery: 86,
    look: { skin: 0, hair: 'short', hairColor: '#7a5a3a', hat: 'cap', hatColor: '#b21e2b', shirt: '#e8edf2', shirtStyle: 'polo', pants: '#2b2f38', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'elias-berg', code: 'GLF-07', name: 'Elias Berg', country: 'SWE', hand: 'R', style: 'Ball striking', power: 91, accuracy: 91, shortGame: 83, putting: 82, recovery: 83,
    look: { skin: 0, hair: 'short', hairColor: '#d9b77a', hat: 'cap', hatColor: '#0f2b4c', shirt: '#0f2b4c', shirtStyle: 'quarterzip', pants: '#d8d2c4', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'rafael-costa', code: 'GLF-08', name: 'Rafael Costa', country: 'BRA', hand: 'R', style: 'Aggressive scorer', power: 92, accuracy: 80, shortGame: 85, putting: 86, recovery: 84,
    look: { skin: 3, hair: 'curly', hairColor: '#120d0a', hat: 'cap', hatColor: '#1d1d1d', shirt: '#f2c230', shirtStyle: 'polo', pants: '#1d1d1d', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: true, glasses: false } },
  { id: 'jin-park', code: 'GLF-09', name: 'Jin Park', country: 'KOR', hand: 'R', style: 'Accuracy', power: 81, accuracy: 94, shortGame: 85, putting: 84, recovery: 79,
    look: { skin: 2, hair: 'sidepart', hairColor: '#111111', hat: 'visor', hatColor: '#ffffff', shirt: '#ffffff', shirtStyle: 'polo', pants: '#24304a', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'callum-reid', code: 'GLF-10', name: 'Callum Reid', country: 'SCO', hand: 'R', style: 'Wind control', power: 84, accuracy: 88, shortGame: 84, putting: 82, recovery: 83,
    look: { skin: 0, hair: 'short', hairColor: '#9a3a1c', hat: 'cap', hatColor: '#2f4f3a', shirt: '#3c5a46', shirtStyle: 'sweater', pants: '#3a3d42', legs: 'trousers', shoes: '#2a1d15', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'darius-cole', code: 'GLF-11', name: 'Darius Cole', country: 'USA', hand: 'R', style: 'Long hitter', power: 98, accuracy: 76, shortGame: 80, putting: 80, recovery: 80,
    look: { skin: 5, hair: 'bald', hairColor: '#111111', hat: 'cap', hatColor: '#ffffff', shirt: '#5b2a86', shirtStyle: 'mock', pants: '#ffffff', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false, build: 1.15 } },
  { id: 'arjun-mehta', code: 'GLF-12', name: 'Arjun Mehta', country: 'IND', hand: 'R', style: 'Recovery specialist', power: 79, accuracy: 78, shortGame: 86, putting: 80, recovery: 95,
    look: { skin: 4, hair: 'short', hairColor: '#1a1410', hat: 'cap', hatColor: '#ff8c1a', shirt: '#24304a', shirtStyle: 'polo', pants: '#d8d2c4', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: true, glasses: false } },
];

// LEGENDS tab: fictional all-time greats in period dress. era/majors/feat are shown on their cards.
export const GOATS = [
  { id: 'victor-hale', code: 'LEG-01', goat: true, name: 'Victor Hale', country: 'USA', hand: 'R', style: 'Legend: precision', era: '1968–1990', majors: 12, feat: 'Won four straight championship titles; never missed a fairway in a final round', power: 95, accuracy: 100, shortGame: 96, putting: 95, recovery: 97,
    look: { skin: 1, hair: 'slick', hairColor: '#3b2a1c', hat: 'flatcap', hatColor: '#e9e4d8', shirt: '#e9e4d8', shirtStyle: 'polo', pants: '#5d6066', legs: 'trousers', shoes: '#2a1d15', glove: '#ffffff', beard: false, glasses: false, build: 0.95 } },
  { id: 'soren-black', code: 'LEG-02', goat: true, name: 'Soren Black', country: 'DEN', hand: 'R', style: 'Legend: putting', era: '1975–1996', majors: 10, feat: 'Holed more putts over 20 feet than any player of his era', power: 92, accuracy: 95, shortGame: 96, putting: 100, recovery: 94,
    look: { skin: 0, hair: 'sidepart', hairColor: '#e8cf98', hat: 'none', shirt: '#1c2a44', shirtStyle: 'sweater', pants: '#1c2a44', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: false, glasses: false } },
  { id: 'emilio-cruz', code: 'LEG-03', goat: true, name: 'Emilio Cruz', country: 'MEX', hand: 'R', style: 'Legend: creativity', era: '1982–2004', majors: 9, feat: 'Famous for impossible recovery shots from trees, sand and water', power: 93, accuracy: 90, shortGame: 100, putting: 94, recovery: 100,
    look: { skin: 3, hair: 'short', hairColor: '#111111', hat: 'none', shirt: '#ffffff', shirtStyle: 'polo', pants: '#2b2f38', legs: 'trousers', shoes: '#ffffff', glove: '#ffffff', beard: true, glasses: false } },
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
