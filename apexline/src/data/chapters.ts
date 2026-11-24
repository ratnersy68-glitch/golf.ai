/** Chapter display info (UI-safe; the generator config lives in sim/trackgen.ts). */
export const CHAPTERS_INFO = [
  { id: 1, name: 'Rookie Academy', env: 'academy', accent: '#8A929C', unlockMedals: 0 },
  { id: 2, name: 'Coastal Circuit', env: 'coastal', accent: '#C98B5A', unlockMedals: 12 },
  { id: 3, name: 'Desert Rush', env: 'desert', accent: '#C9A24D', unlockMedals: 28 },
  { id: 4, name: 'Alpine Assault', env: 'alpine', accent: '#7FA3C4', unlockMedals: 46 },
  { id: 5, name: 'Neon District', env: 'neon', accent: '#9A6FC4', unlockMedals: 66 },
  { id: 6, name: 'Industrial Overdrive', env: 'industrial', accent: '#C27A3A', unlockMedals: 88 },
  { id: 7, name: 'Forest Velocity', env: 'forest', accent: '#6FA37F', unlockMedals: 112 },
  { id: 8, name: 'Skybound', env: 'sky', accent: '#7C98C9', unlockMedals: 138 },
  { id: 9, name: 'Formula Precision', env: 'formula', accent: '#B34A55', unlockMedals: 166 },
  { id: 10, name: 'Hyperdrive', env: 'hyper', accent: '#5FA3B8', unlockMedals: 196 },
  { id: 11, name: 'The Gauntlet', env: 'gauntlet', accent: '#25282D', unlockMedals: 226 },
];
/** Medals (any tier) needed across the campaign to unlock a chapter. Practice mode ignores this. */
export const chapterUnlocked = (chapter: number, medalCount: number): boolean => medalCount >= CHAPTERS_INFO[chapter - 1].unlockMedals;
