import type { Appearance } from '../data/types';

/** Options for the create-a-golfer screen and cosmetic catalogue. */
export interface CustomOption<K extends keyof Appearance = keyof Appearance> {
  key: K;
  label: string;
  kind: 'color' | 'choice';
  values: { value: Appearance[K]; label: string }[];
}

const colors = (list: [string, string][]) => list.map(([value, label]) => ({ value, label }));

export const CUSTOM_OPTIONS: CustomOption[] = [
  { key: 'skin', label: 'Skin', kind: 'color', values: colors([['#f5d3b8', 'Porcelain'], ['#f1c6a4', 'Light'], ['#e0ac85', 'Warm'], ['#c68b62', 'Tan'], ['#a86f4c', 'Bronze'], ['#8d5a3b', 'Brown'], ['#5e3a26', 'Deep']]) },
  { key: 'hairStyle', label: 'Hair', kind: 'choice', values: [{ value: 'short', label: 'Short' }, { value: 'wavy', label: 'Wavy' }, { value: 'curly', label: 'Curly' }, { value: 'buzz', label: 'Buzz' }, { value: 'slick', label: 'Slick' }, { value: 'long', label: 'Long' }, { value: 'bald', label: 'Bald' }] },
  { key: 'hair', label: 'Hair Colour', kind: 'color', values: colors([['#16110d', 'Black'], ['#3b2a1e', 'Dark Brown'], ['#6b4a2e', 'Brown'], ['#a0703c', 'Light Brown'], ['#d9b26f', 'Blonde'], ['#b5532a', 'Ginger'], ['#bdbdbd', 'Silver']]) },
  { key: 'facialHair', label: 'Facial Hair', kind: 'choice', values: [{ value: 'none', label: 'None' }, { value: 'stubble', label: 'Stubble' }, { value: 'beard', label: 'Beard' }, { value: 'moustache', label: 'Moustache' }] },
  { key: 'eyes', label: 'Eyes', kind: 'color', values: colors([['#3b2a1e', 'Brown'], ['#2f6fa8', 'Blue'], ['#3f7a4a', 'Green'], ['#6b6b6b', 'Grey'], ['#8a5a2b', 'Hazel']]) },
  { key: 'hat', label: 'Hat', kind: 'choice', values: [{ value: 'cap', label: 'Cap' }, { value: 'capBack', label: 'Backwards' }, { value: 'visor', label: 'Visor' }, { value: 'flatcap', label: 'Flat Cap' }, { value: 'bucket', label: 'Bucket' }, { value: 'none', label: 'None' }] },
  { key: 'hatColor', label: 'Hat Colour', kind: 'color', values: colors([['#ffffff', 'White'], ['#111111', 'Black'], ['#1c2b4a', 'Navy'], ['#1b5e3b', 'Augusta Green'], ['#c8102e', 'Red'], ['#d9d4c7', 'Stone'], ['#f2c94c', 'Gold']]) },
  { key: 'shirtStyle', label: 'Top', kind: 'choice', values: [{ value: 'polo', label: 'Polo' }, { value: 'mock', label: 'Mock Neck' }, { value: 'quarterzip', label: '1/4 Zip' }, { value: 'sweater', label: 'Sweater' }] },
  { key: 'shirt', label: 'Shirt', kind: 'color', values: colors([['#ffffff', 'White'], ['#f4f1e8', 'Cream'], ['#9fd2f0', 'Sky'], ['#2b5fa8', 'Royal'], ['#1c2b4a', 'Navy'], ['#c8102e', 'Sunday Red'], ['#f2b5c4', 'Azalea'], ['#6aa84f', 'Fairway'], ['#111111', 'Black'], ['#f2c94c', 'Yellow']]) },
  { key: 'shirtAccent', label: 'Trim', kind: 'color', values: colors([['#1b2a41', 'Navy'], ['#ffffff', 'White'], ['#1b5e3b', 'Green'], ['#c8102e', 'Red'], ['#c9a45b', 'Gold'], ['#111111', 'Black']]) },
  { key: 'pants', label: 'Pants', kind: 'color', values: colors([['#2c3340', 'Charcoal'], ['#111111', 'Black'], ['#e8e4d8', 'Khaki'], ['#8c929c', 'Grey'], ['#1c2b4a', 'Navy'], ['#ffffff', 'White'], ['#6b5a3e', 'Tobacco']]) },
  { key: 'shoes', label: 'Shoes', kind: 'color', values: colors([['#ffffff', 'White'], ['#111111', 'Black'], ['#7a4a2a', 'Brown Saddle'], ['#c8102e', 'Red']]) },
  { key: 'glove', label: 'Glove', kind: 'color', values: colors([['#ffffff', 'White'], ['#111111', 'Black'], ['#f2c94c', 'Gold']]) },
  { key: 'accessory', label: 'Accessory', kind: 'choice', values: [{ value: 'none', label: 'None' }, { value: 'sunglasses', label: 'Shades' }, { value: 'glasses', label: 'Glasses' }, { value: 'watch', label: 'Watch' }] },
  { key: 'putter', label: 'Putter', kind: 'choice', values: [{ value: 'blade', label: 'Blade' }, { value: 'mallet', label: 'Mallet' }, { value: 'armlock', label: 'Arm-lock' }] },
  { key: 'bag', label: 'Bag', kind: 'color', values: colors([['#1b5e3b', 'Green'], ['#1b2a41', 'Navy'], ['#111111', 'Black'], ['#ffffff', 'Tour White'], ['#c8102e', 'Red']]) },
  { key: 'build', label: 'Build', kind: 'choice', values: [{ value: 0.92, label: 'Slim' }, { value: 1, label: 'Athletic' }, { value: 1.12, label: 'Strong' }] },
];

export interface BallCosmetic {
  id: string;
  name: string;
  color: string;
  trail: string;
  cost: number;
}

export const BALLS: BallCosmetic[] = [
  { id: 'ball-classic', name: 'Tour White', color: '#ffffff', trail: '#ffffff', cost: 0 },
  { id: 'ball-yellow', name: 'Optic Yellow', color: '#f4f06a', trail: '#fff59a', cost: 150 },
  { id: 'ball-azalea', name: 'Azalea Pink', color: '#f59ab8', trail: '#ffc2d6', cost: 250 },
  { id: 'ball-sunday', name: 'Sunday Red', color: '#e0303f', trail: '#ff7a84', cost: 400 },
  { id: 'ball-gold', name: 'Green Jacket Gold', color: '#e6c35c', trail: '#ffe7a0', cost: 900 },
];

export function applyOption(a: Appearance, key: keyof Appearance, value: unknown): Appearance {
  return { ...a, [key]: value } as Appearance;
}
