import type { TournamentData } from './types';

/** Tournaments are ordered lists of real holes. As more holes are recreated they are appended here. */
export const TOURNAMENTS: TournamentData[] = [
  {
    id: 'masters-mini',
    name: 'The Masters Mini',
    subtitle: 'Augusta National · the recreated holes of the back nine',
    courseIds: ['augusta'],
    holes: ['augusta-12', 'augusta-16'],
    plannedHoles: 18,
    entryTier: 'classic',
    reward: 400,
    palette: { primary: '#1b5e3b', accent: '#f2c94c' },
  },
  {
    id: 'par3-tour',
    name: 'Signature Par-3 Tour',
    subtitle: 'The four most famous one-shotters in golf, back to back',
    courseIds: ['augusta', 'pebble', 'sawgrass'],
    holes: ['augusta-12', 'pebble-07', 'augusta-16', 'sawgrass-17'],
    plannedHoles: 4,
    entryTier: 'classic',
    reward: 700,
    palette: { primary: '#0b3d5c', accent: '#7cc4e4' },
  },
  {
    id: 'island-challenge',
    name: 'The Island Challenge',
    subtitle: 'TPC Sawgrass 17 · three attempts, lowest total wins',
    courseIds: ['sawgrass'],
    holes: ['sawgrass-17', 'sawgrass-17', 'sawgrass-17'],
    plannedHoles: 3,
    entryTier: 'major',
    reward: 500,
    palette: { primary: '#062335', accent: '#e8d7a6' },
  },
];
