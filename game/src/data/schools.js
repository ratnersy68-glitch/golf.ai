// Road to Pro: fictional high schools (HS-01..05), universities (UNI-01..05), pro tours and majors.
// All names, crests, colours and events are original.

export const HIGH_SCHOOLS = [
  { id: 'HS-01', name: 'Westbridge Preparatory', short: 'Westbridge Prep', mascot: 'Falcons', colors: ['#1c2a5a', '#d4a72c'], program: 'Elite private academy', home: 'cedarvale', coach: 'Coach Harlan Price', prestige: 5 },
  { id: 'HS-02', name: 'Pinecrest Academy', short: 'Pinecrest', mascot: 'Stags', colors: ['#1f5a3a', '#f4f4f2'], program: 'Traditional championship program', home: 'cedarvale', coach: 'Coach Dale Morrow', prestige: 4 },
  { id: 'HS-03', name: 'Summit Ridge High', short: 'Summit Ridge', mascot: 'Wolves', colors: ['#141516', '#a9adb2'], program: 'Athletic powerhouse', home: 'blackstone', coach: 'Coach Renee Ostrow', prestige: 4 },
  { id: 'HS-04', name: 'St. Andrews Hills Prep', short: 'St. Andrews Hills', mascot: 'Hawks', colors: ['#6e1a2a', '#efe4cc'], program: 'Historic prep school', home: 'harborpoint', coach: 'Coach Malcolm Reid', prestige: 3 },
  { id: 'HS-05', name: 'Oceanview Pacific Academy', short: 'Oceanview Pacific', mascot: 'Tides', colors: ['#5aa9e6', '#f4f4f2'], program: 'Coastal golf program', home: 'harborpoint', coach: 'Coach Lani Kealoha', prestige: 3 },
];

// Offer trade-offs: stronger programmes play tougher fields (harder to win, more ranking points);
// every school trains two attributes each season and pays a one-off scholarship in Golf Coins.
export const UNIVERSITIES = [
  { id: 'UNI-01', name: 'Kingsley University', short: 'Kingsley', mascot: 'Kings', colors: ['#9b1b30', '#f4f4f2'], positioning: 'Historic powerhouse', conference: 'Heritage Conference', home: 'blackstone', coach: 'Coach Edmund Hale',
    bar: 82, scholarship: 1500, train: ['mental', 'putting'], field: 0.1, points: 1.3, perk: 'Toughest schedule in the country — the biggest ranking points' },
  { id: 'UNI-02', name: 'Pacific Coast University', short: 'Pacific Coast', mascot: 'Mariners', colors: ['#1e56b8', '#d4a72c'], positioning: 'West Coast elite', conference: 'Pacific Seaboard Conference', home: 'harborpoint', coach: 'Coach Tessa Marlow',
    bar: 74, scholarship: 1200, train: ['distance', 'irons'], field: 0.07, points: 1.2, perk: 'Links training on the coast builds power and iron play' },
  { id: 'UNI-03', name: 'Northbridge University', short: 'Northbridge', mascot: 'Owls', colors: ['#1c2a44', '#c9ccd1'], positioning: 'Academic prestige', conference: 'Ivy Ridge Conference', home: 'cedarvale', coach: 'Coach Simon Achterberg',
    bar: 68, scholarship: 900, train: ['accuracy', 'wedges'], field: 0.03, points: 1.1, perk: 'Sports-science programme: 2 extra skill points every season', bonusPoints: 2 },
  { id: 'UNI-04', name: 'Southern Magnolia University', short: 'Southern Magnolia', mascot: 'Lynx', colors: ['#5b2a86', '#d4a72c'], positioning: 'Southern contender', conference: 'Delta Conference', home: 'cedarvale', coach: 'Coach Beau Treadwell',
    bar: 50, scholarship: 800, train: ['chipping', 'recovery'], field: 0, points: 1.0, perk: 'Softer conference: more chances to win titles' },
  { id: 'UNI-05', name: 'Grand Lakes University', short: 'Grand Lakes', mascot: 'Storm', colors: ['#1f6b3a', '#141516'], positioning: 'Modern championship program', conference: 'Great Lakes Conference', home: 'harborpoint', coach: 'Coach Nadia Brandt',
    bar: 60, scholarship: 1000, train: ['distance', 'mental'], field: 0.04, points: 1.15, perk: 'New performance centre: +1 to every attribute each season', allTrain: 1 },
];

export const TOURS = {
  q: { name: 'Tour Qualifying School', short: 'Q-SCHOOL' },
  dev: { name: 'Ridgeline Tour', short: 'RIDGELINE TOUR', blurb: 'The development tour. Finish top 5 on the season points list to earn a Crown Tour card.' },
  elite: { name: 'Crown Tour', short: 'CROWN TOUR', blurb: 'The elite tour: the best players in the world and the four majors.' },
};

// four fictional majors (the Granite Crown is the same event as the standalone tournament mode)
export const MAJORS = [
  { key: 'founders', name: 'The Founders Championship', courseId: 'cedarvale', slot: 1 },
  { key: 'crown', name: 'The Granite Crown', courseId: 'blackstone', slot: 4 },
  { key: 'harbor', name: 'The Harbor Open', courseId: 'harborpoint', slot: 6 },
  { key: 'continental', name: 'The Continental', courseId: 'blackstone', slot: 9 },
];

// sponsors (fictional brands from the Pro Shop). Unlocked by career milestones; each pays per event played.
export const SPONSORS = [
  { id: 'fs', brand: 'Fairway Supply', what: 'Apparel', when: 'Earn a Ridgeline Tour card', perEvent: 60 },
  { id: 'ap', brand: 'AeroPeak', what: 'Golf ball', when: 'Earn a Crown Tour card', perEvent: 120 },
  { id: 'al', brand: 'Alder Forge', what: 'Irons & wedges', when: 'Reach the world top 50', perEvent: 220 },
  { id: 'vx', brand: 'Vortex Golf', what: 'Woods & driver', when: 'Reach the world top 10', perEvent: 400 },
  { id: 'nl', brand: 'Northline', what: 'Putter', when: 'Win a major', perEvent: 300 },
];

const FIRST = ['Aiden', 'Blake', 'Caleb', 'Dante', 'Eli', 'Finn', 'Gavin', 'Hugo', 'Isaac', 'Jonah', 'Kian', 'Leo', 'Miles', 'Nico', 'Owen', 'Parker', 'Quinn', 'Reid', 'Silas', 'Theo', 'Uriel', 'Vince', 'Wyatt', 'Xavi', 'Yusuf', 'Zane',
  'Ana', 'Bea', 'Cora', 'Dara', 'Elena', 'Faye', 'Gemma', 'Hana', 'Iris', 'Jade', 'Kira', 'Lena', 'Maya', 'Nora', 'Opal', 'Priya', 'Rosa', 'Sasha', 'Tess', 'Vera', 'Wren', 'Yara', 'Zoe',
  'Arjun', 'Bastian', 'Cristo', 'Dmitri', 'Emeka', 'Farid', 'Goran', 'Haruto', 'Ibrahim', 'Joaquin', 'Kenji', 'Luca', 'Mateus', 'Nikolai', 'Oskar', 'Pablo', 'Rafa', 'Soren', 'Tariq', 'Viktor'];
const LAST = ['Abbott', 'Barlow', 'Castell', 'Dunmore', 'Ellery', 'Fairbank', 'Garrow', 'Holloway', 'Ingram', 'Jessop', 'Kilbride', 'Larkin', 'Merriweather', 'Northcott', 'Oakes', 'Pendleton', 'Quarry', 'Rowntree', 'Sallow', 'Thackeray',
  'Upton', 'Varga', 'Whitlock', 'Yardley', 'Zeller', 'Ashby', 'Brannigan', 'Corliss', 'Dovey', 'Everhart', 'Fenwick', 'Galloway', 'Hartigan', 'Iverson', 'Juniper', 'Kettering', 'Lindell', 'Mallory', 'Nyberg', 'Okonkwo',
  'Prentice', 'Ravenscroft', 'Stroud', 'Tamura', 'Underhill', 'Vasquez', 'Wexley', 'Achebe', 'Bergstrom', 'Calderon', 'Delacroix', 'Esposito', 'Fujimoto', 'Halvorsen', 'Kowalczyk', 'Moreau', 'Novak', 'Petrakis', 'Sandoval', 'Takahashi'];
export const randomName = (rng) => `${FIRST[Math.floor(rng() * FIRST.length)]} ${LAST[Math.floor(rng() * LAST.length)]}`;

// shield crest as inline SVG
export function crest(school, size = 48) {
  const [a, b] = school.colors;
  const letters = school.short.split(/[\s.]+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 2);
  return `<svg class="crest" width="${size}" height="${size * 1.15}" viewBox="0 0 40 46" aria-hidden="true">
    <path d="M20 1 L38 6 V22 C38 34 30 41 20 45 C10 41 2 34 2 22 V6 Z" fill="${a}" stroke="${b}" stroke-width="2.4"/>
    <path d="M2.5 18 H37.5" stroke="${b}" stroke-width="1.2" opacity=".55"/>
    <text x="20" y="31" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="${letters.length > 1 ? 15 : 19}" fill="${b}">${letters}</text>
  </svg>`;
}
