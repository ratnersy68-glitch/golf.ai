import type { Appearance, GolferData } from './types';

/**
 * Golfer roster. Ratings are game ratings for this prototype, not official statistics.
 * Appearances are stylised, original character designs that evoke each player's on-course look;
 * a shipping build needs name-and-likeness licences (players / tours) before release.
 */

const base: Appearance = {
  skin: '#f1c6a4',
  hair: '#5a3b24',
  hairStyle: 'short',
  facialHair: 'none',
  eyes: '#3b2a1e',
  hat: 'cap',
  hatColor: '#ffffff',
  shirt: '#ffffff',
  shirtAccent: '#1b2a41',
  shirtStyle: 'polo',
  pants: '#2c3340',
  shoes: '#ffffff',
  glove: '#ffffff',
  build: 1,
  height: 1,
  accessory: 'none',
  bag: '#1b2a41',
  putter: 'blade',
};
const look = (o: Partial<Appearance>): Appearance => ({ ...base, ...o });

export const GOLFERS: GolferData[] = [
  {
    id: 'scheffler',
    name: 'Scottie Scheffler',
    shortName: 'Scheffler',
    nationality: 'United States',
    flag: '🇺🇸',
    stats: { power: 91, accuracy: 96, control: 94, spin: 90, putting: 89 },
    ability: { id: 'metronome', name: 'Metronome', description: 'Power stays remarkably consistent: shot strength variance halved.', kind: 'steadyPower', magnitude: 0.5 },
    appearance: look({ hair: '#6b4a2e', hatColor: '#1c2b4a', shirt: '#1c2b4a', shirtAccent: '#ffffff', pants: '#8c929c', bag: '#1c2b4a', build: 1.04, height: 1.04, putter: 'mallet' }),
    celebration: 'capTip',
    unlockCost: 0,
    bio: 'Relentless ball-striker. Rarely misses a green, never loses his rhythm.',
  },
  {
    id: 'mcilroy',
    name: 'Rory McIlroy',
    shortName: 'McIlroy',
    nationality: 'Northern Ireland',
    flag: '🇬🇧',
    stats: { power: 97, accuracy: 88, control: 90, spin: 91, putting: 87 },
    ability: { id: 'launch', name: 'Launch Pad', description: '+3% maximum shot power.', kind: 'extraPower', magnitude: 0.03 },
    appearance: look({ hairStyle: 'curly', hair: '#3a2718', hatColor: '#ffffff', shirt: '#9fd2f0', shirtAccent: '#0f2a44', pants: '#0f2a44', bag: '#e7e9ee', build: 0.98, height: 0.98 }),
    celebration: 'uppercut',
    unlockCost: 0,
    bio: 'Effortless speed and a swing built for the grandest stages.',
  },
  {
    id: 'woods',
    name: 'Tiger Woods',
    shortName: 'Woods',
    nationality: 'United States',
    flag: '🇺🇸',
    stats: { power: 93, accuracy: 94, control: 97, spin: 95, putting: 95 },
    ability: { id: 'sundayred', name: 'Sunday Red', description: 'Cup capture window +15% on the final hole of any round.', kind: 'clutch', magnitude: 0.15 },
    appearance: look({ skin: '#8d5a3b', hair: '#1b1410', hairStyle: 'buzz', hatColor: '#111111', shirt: '#c8102e', shirtAccent: '#111111', pants: '#111111', shoes: '#111111', bag: '#111111', build: 1.06, height: 1.0 }),
    celebration: 'fistPump',
    unlockCost: 2500,
    bio: 'Fifteen majors. The fist pump. The red shirt on Sunday.',
  },
  {
    id: 'spieth',
    name: 'Jordan Spieth',
    shortName: 'Spieth',
    nationality: 'United States',
    flag: '🇺🇸',
    stats: { power: 88, accuracy: 89, control: 92, spin: 91, putting: 96 },
    ability: { id: 'longrange', name: 'Go Get That', description: 'Longer putt preview line, and a larger capture window on putts over 15 ft.', kind: 'lagMaster', magnitude: 0.12 },
    appearance: look({ hair: '#7a5634', hatColor: '#ffffff', shirt: '#2b5fa8', shirtAccent: '#ffffff', pants: '#e8e4d8', bag: '#2b5fa8' }),
    celebration: 'point',
    unlockCost: 900,
    bio: 'Wizard with a putter and a magician from impossible spots.',
  },
  {
    id: 'rahm',
    name: 'Jon Rahm',
    shortName: 'Rahm',
    nationality: 'Spain',
    flag: '🇪🇸',
    stats: { power: 95, accuracy: 91, control: 90, spin: 92, putting: 90 },
    ability: { id: 'rahmbo', name: 'Rahmbo', description: 'Powers through rough: rough friction -20%.', kind: 'roughRider', magnitude: 0.2 },
    appearance: look({ skin: '#e6b48f', hair: '#231812', facialHair: 'beard', facialHairColor: '#231812', hatColor: '#0e1b2b', shirt: '#0e1b2b', shirtAccent: '#c9a45b', pants: '#0e1b2b', bag: '#0e1b2b', build: 1.14, height: 1.02, putter: 'mallet' }),
    celebration: 'fistPump',
    unlockCost: 1200,
    bio: 'Fiery Basque power with a short, compact swing.',
  },
  {
    id: 'thomas',
    name: 'Justin Thomas',
    shortName: 'Thomas',
    nationality: 'United States',
    flag: '🇺🇸',
    stats: { power: 90, accuracy: 90, control: 93, spin: 96, putting: 89 },
    ability: { id: 'spindoctor', name: 'Spin Doctor', description: 'Keeps 10% more speed off rails and walls.', kind: 'railMaster', magnitude: 0.1 },
    appearance: look({ hair: '#4a3222', hatColor: '#ffffff', shirt: '#f2f2f2', shirtAccent: '#c8102e', pants: '#1f2b3a', bag: '#ffffff', build: 0.94, height: 0.97 }),
    celebration: 'uppercut',
    unlockCost: 800,
    bio: 'Elite iron player with a feel for every kind of spin.',
  },
  {
    id: 'dechambeau',
    name: 'Bryson DeChambeau',
    shortName: 'DeChambeau',
    nationality: 'United States',
    flag: '🇺🇸',
    stats: { power: 99, accuracy: 85, control: 88, spin: 87, putting: 90 },
    ability: { id: 'scientist', name: 'The Scientist', description: 'Armlock putter: aim wobble reduced by 30%.', kind: 'pureStrike', magnitude: 0.3 },
    appearance: look({ hair: '#8a6a45', hat: 'flatcap', hatColor: '#d9d4c7', shirt: '#f0ede4', shirtAccent: '#1e3a5f', pants: '#1e3a5f', bag: '#1e3a5f', build: 1.16, height: 1.05, putter: 'armlock' }),
    celebration: 'armsUp',
    unlockCost: 1500,
    bio: 'The Scientist. Maximum speed, maximum data.',
  },
  {
    id: 'morikawa',
    name: 'Collin Morikawa',
    shortName: 'Morikawa',
    nationality: 'United States',
    flag: '🇺🇸',
    stats: { power: 87, accuracy: 97, control: 94, spin: 90, putting: 86 },
    ability: { id: 'ironman', name: 'Iron Precision', description: 'Aim wobble reduced by 25%.', kind: 'pureStrike', magnitude: 0.25 },
    appearance: look({ skin: '#e2b98f', hair: '#16110d', hatColor: '#ffffff', shirt: '#dfe9f2', shirtAccent: '#1d3557', pants: '#6e7784', bag: '#ffffff', build: 0.95, height: 0.96 }),
    celebration: 'capTip',
    unlockCost: 700,
    bio: 'Surgical with his irons. Pure, repeatable, precise.',
  },
  {
    id: 'schauffele',
    name: 'Xander Schauffele',
    shortName: 'Schauffele',
    nationality: 'United States',
    flag: '🇺🇸',
    stats: { power: 91, accuracy: 92, control: 93, spin: 91, putting: 91 },
    ability: { id: 'steadyx', name: 'Steady X', description: 'Bunker friction -25%: splashes out cleanly.', kind: 'sandEscape', magnitude: 0.25 },
    appearance: look({ skin: '#e9c09b', hair: '#1a1411', hatColor: '#1a1a1a', shirt: '#f5f5f5', shirtAccent: '#1a1a1a', pants: '#1a1a1a', bag: '#1a1a1a' }),
    celebration: 'fistPump',
    unlockCost: 1000,
    bio: 'Calm, complete, and clutch when the lights are brightest.',
  },
];

export const DEFAULT_CUSTOM_APPEARANCE: Appearance = look({
  skin: '#d9a47f',
  hair: '#3b2a1e',
  hairStyle: 'wavy',
  hat: 'cap',
  hatColor: '#1b5e3b',
  shirt: '#f4f1e8',
  shirtAccent: '#1b5e3b',
  pants: '#3a4150',
});

export function customGolfer(appearance: Appearance, name: string): GolferData {
  return {
    id: 'custom',
    name: name || 'Your Golfer',
    shortName: name || 'You',
    nationality: 'Custom',
    flag: '⛳',
    stats: { power: 86, accuracy: 86, control: 86, spin: 86, putting: 86 },
    appearance,
    celebration: 'armsUp',
    unlockCost: 0,
    bio: 'Your own creation. Grows with you as you level up.',
    isCustom: true,
  };
}

export function overall(g: GolferData): number {
  const s = g.stats;
  return Math.round((s.power + s.accuracy + s.control + s.spin + s.putting) / 5);
}
