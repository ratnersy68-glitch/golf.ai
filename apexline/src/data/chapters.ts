/** Chapter display info (UI-safe; the generator config lives in sim/trackgen.ts). */
export const CHAPTERS_INFO = [
  { id: 1, name: 'Rookie Academy', env: 'academy', accent: '#C6FF00', unlockMedals: 0 },
  { id: 2, name: 'Coastal Circuit', env: 'coastal', accent: '#FF9A5C', unlockMedals: 12 },
  { id: 3, name: 'Desert Rush', env: 'desert', accent: '#FFC34D', unlockMedals: 28 },
  { id: 4, name: 'Alpine Assault', env: 'alpine', accent: '#9FD6FF', unlockMedals: 46 },
  { id: 5, name: 'Neon District', env: 'neon', accent: '#FF2DCB', unlockMedals: 66 },
  { id: 6, name: 'Industrial Overdrive', env: 'industrial', accent: '#FF7A1F', unlockMedals: 88 },
  { id: 7, name: 'Forest Velocity', env: 'forest', accent: '#4CFFA0', unlockMedals: 112 },
  { id: 8, name: 'Skybound', env: 'sky', accent: '#7FA8FF', unlockMedals: 138 },
  { id: 9, name: 'Formula Precision', env: 'formula', accent: '#E0123C', unlockMedals: 166 },
  { id: 10, name: 'Hyperdrive', env: 'hyper', accent: '#00E5FF', unlockMedals: 196 },
  { id: 11, name: 'The Gauntlet', env: 'gauntlet', accent: '#F5F7FA', unlockMedals: 226 },
];
/** Medals (any tier) needed across the campaign to unlock a chapter. Practice mode ignores this. */
export const chapterUnlocked = (chapter: number, medalCount: number): boolean => medalCount >= CHAPTERS_INFO[chapter - 1].unlockMedals;
