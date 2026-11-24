import type { CarSetup } from './types';
import type { Cosmetic } from '../data/cosmetics';

/** Pure: returns a copy of the setup with the cosmetic applied (used by equip and by shop previews). */
export function applyCosmetic(setup: CarSetup, c: Cosmetic): CarSetup {
  const s: CarSetup = structuredClone(setup);
  switch (c.cat) {
    case 'finish': s.paint.finish = c.id; break;
    case 'wheel': s.wheel.design = c.id; break; case 'wheelColor': s.wheel.color = c.id; break; case 'tire': s.wheel.tire = c.id; break; case 'caliper': s.wheel.caliper = c.id; break;
    case 'spoiler': case 'splitter': case 'skirt': case 'diffuser': case 'hood': case 'scoop': case 'widebody': case 'exhaust': case 'fbumper': case 'rbumper': (s.body as any)[c.cat] = c.id; break;
    case 'headlight': s.lights.head = c.id; break; case 'taillight': s.lights.tail = c.id; break; case 'underglow': s.lights.underglow = c.id; break; case 'lightpattern': s.lights.pattern = c.id; break;
    case 'livery': s.livery.preset = c.id; s.livery.layers = []; s.livery.useBase = true; break;
    case 'trail': s.fx.trail = c.id; break; case 'flame': s.fx.flame = c.id; break; case 'smoke': s.fx.smoke = c.id; break; case 'finishfx': s.fx.finish = c.id; break; case 'spawn': s.fx.spawn = c.id; break; case 'victory': s.fx.victory = c.id; break;
    case 'plate': s.plate.style = c.id; break;
    case 'paint': s.paint.primary = c.data.color; break;
    default: break;
  }
  return s;
}
