import type { HoleLayout } from '../types';
import { augusta12 } from './augusta-12';
import { augusta16 } from './augusta-16';
import { pebble07 } from './pebble-07';
import { sawgrass17 } from './sawgrass-17';

/** Every recreated real hole. Adding a hole = adding a data file and listing it here. */
export const HOLE_LAYOUTS: HoleLayout[] = [augusta12, augusta16, pebble07, sawgrass17];

export function getLayout(id: string): HoleLayout | undefined {
  return HOLE_LAYOUTS.find((h) => h.id === id);
}
