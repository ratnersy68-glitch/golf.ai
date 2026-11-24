import { COSMETICS, Cosmetic } from '../data/cosmetics';
import { RARITY_LABEL, Rarity } from '../data/vehicles';
import { Rng, hashStr } from '../sim/dmath';

/** Deterministic rotation: every player sees the same daily/weekly picks for the same date. */
export function dailyPicks(day: string): Cosmetic[] {
  const pool = COSMETICS.filter(c => c.shop === 'rotating'); const rng = new Rng(hashStr('shop-day-' + day));
  const out: Cosmetic[] = []; const used = new Set<string>();
  while (out.length < 8 && used.size < pool.length) { const c = pool[Math.floor(rng.next() * pool.length)]; if (!used.has(c.id)) { used.add(c.id); out.push(c); } }
  return out;
}
export function weeklyCollection(week: string): { name: string; items: Cosmetic[]; discount: number } {
  const rng = new Rng(hashStr('shop-week-' + week));
  const rars: Rarity[] = ['rare', 'epic', 'legendary'];
  const target = rars[Math.floor(rng.next() * rars.length)];
  const pool = COSMETICS.filter(c => c.shop === 'rotating' && c.rarity === target); const out: Cosmetic[] = []; const used = new Set<string>();
  while (out.length < 6 && used.size < pool.length) { const c = pool[Math.floor(rng.next() * pool.length)]; if (!used.has(c.id)) { used.add(c.id); out.push(c); } }
  const names = ['Midnight Collection', 'Circuit Series', 'Apex Drop', 'Redline Edit', 'Aero Works', 'Heritage Run', 'Stage Kit'];
  return { name: names[Math.floor(rng.next() * names.length)] + ` · ${RARITY_LABEL[target]}`, items: out, discount: 0.15 };
}
