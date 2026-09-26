import { customGolfer, GOLFERS } from '../data/golfers';
import type { Appearance, GolferData } from '../data/types';

/** Real golfers plus the player's own custom golfer. */
export const GolferDatabase = {
  roster(): GolferData[] {
    return GOLFERS;
  },
  get(id: string, custom?: { appearance: Appearance; name: string }): GolferData {
    if (id === 'custom' && custom) return customGolfer(custom.appearance, custom.name);
    return GOLFERS.find((g) => g.id === id) ?? GOLFERS[0];
  },
};
