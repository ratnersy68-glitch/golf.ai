import type { Profile } from '../game/types';
import type { Rarity } from './vehicles';
import { CHAPTERS_INFO } from './chapters';

export interface Achievement { id: string; name: string; desc: string; rarity: Rarity; target: number; value: (p: Profile) => number; credits: number; tokens?: number }

const A: Achievement[] = [];
const add = (id: string, name: string, desc: string, rarity: Rarity, target: number, value: (p: Profile) => number, credits = 500, tokens = 0) => A.push({ id, name, desc, rarity, target, value, credits, tokens });
const R = (p: Profile) => Object.entries(p.records).map(([k, v]) => ({ id: +k, ...v }));
const medalCount = (p: Profile, min: number) => R(p).filter(r => r.medal >= min).length;
const chapterIds = (c: number) => Array.from({ length: 25 }, (_, i) => (c - 1) * 25 + i + 1);
const chapterDone = (p: Profile, c: number) => chapterIds(c).filter(id => p.records[id]?.finishes).length;
const chapterGold = (p: Profile, c: number) => chapterIds(c).filter(id => (p.records[id]?.medal ?? 0) >= 3).length;
const chapterPlat = (p: Profile, c: number) => chapterIds(c).filter(id => (p.records[id]?.medal ?? 0) >= 4).length;

// ---- race milestones
add('first_finish', 'First Finish', 'Complete your first track.', 'common', 1, p => p.stats.finishes, 300);
[[10, 'Getting Warm', 'common'], [50, 'Regular', 'uncommon'], [150, 'Seasoned', 'rare'], [500, 'Veteran', 'epic'], [1500, 'Lifer', 'legendary']].forEach(([n, name, r]) =>
  add(`finishes_${n}`, name as string, `Complete ${n} tracks.`, r as Rarity, n as number, p => p.stats.finishes, (n as number) * 8, (n as number) >= 500 ? 10 : 0));
[[10, 'Retry Button', 'common'], [100, 'Try, Try Again', 'uncommon'], [500, 'Restart Addict', 'rare'], [2000, 'One More Go', 'epic']].forEach(([n, name, r]) =>
  add(`restarts_${n}`, name as string, `Restart ${n} times.`, r as Rarity, n as number, p => p.stats.restarts, (n as number) * 2));
// ---- speed / air
[[200, 'Speed Demon', 'common'], [300, 'Triple Digits Plus', 'uncommon'], [400, 'Terminal', 'rare'], [500, 'Warp Factor', 'epic']].forEach(([n, name, r]) =>
  add(`speed_${n}`, name as string, `Reach ${n} km/h.`, r as Rarity, n as number, p => Math.round(p.stats.topMps * 3.6), (n as number) * 3));
[[30, 'Airborne', 'common'], [60, 'Hang Time', 'uncommon'], [100, 'Long Jumper', 'rare'], [150, 'Skybound', 'epic'], [220, 'Orbital', 'legendary']].forEach(([n, name, r]) =>
  add(`jump_${n}`, name as string, `Land a ${n} m jump.`, r as Rarity, n as number, p => Math.round(p.stats.longestJump), (n as number) * 6));
[[60, 'Airtime', 'common'], [600, 'Frequent Flyer', 'rare']].forEach(([n, name, r]) => add(`air_${n}`, name as string, `Spend ${n} seconds airborne in total.`, r as Rarity, n as number, p => Math.round(p.stats.airMs / 1000), (n as number) * 5));
// ---- clean running
[[1, 'Clean Racer', 'common'], [10, 'Spotless', 'uncommon'], [50, 'Immaculate', 'rare'], [200, 'Untouchable', 'epic']].forEach(([n, name, r]) =>
  add(`clean_${n}`, name as string, `Finish ${n} track${(n as number) > 1 ? 's' : ''} without a single crash.`, r as Rarity, n as number, p => p.stats.cleanRuns, (n as number) * 25));
// ---- distance and time
[[10, 'Warm-up Lap', 'common'], [100, 'Road Trip', 'uncommon'], [500, 'Cross Country', 'rare'], [2000, 'Around the World', 'epic']].forEach(([n, name, r]) =>
  add(`dist_${n}`, name as string, `Drive ${n} km in total.`, r as Rarity, n as number, p => Math.round(p.stats.distanceM / 1000), (n as number) * 6));
[[1, 'First Hour', 'common'], [10, 'Dedicated', 'uncommon'], [50, 'Obsessed', 'rare'], [200, 'No Life', 'epic']].forEach(([n, name, r]) =>
  add(`hours_${n}`, name as string, `Spend ${n} hour${(n as number) > 1 ? 's' : ''} driving.`, r as Rarity, n as number, p => Math.floor(p.stats.driveMs / 3600000), (n as number) * 60));
// ---- medals
[[1, 'Podium', 'common'], [10, 'Bronze Collector', 'common'], [25, 'Silver Lining', 'uncommon'], [50, 'Medal Hoarder', 'rare'], [100, 'Trophy Case', 'epic'], [250, 'Medal Machine', 'legendary']].forEach(([n, name, r]) =>
  add(`medals_${n}`, name as string, `Earn medals on ${n} track${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => medalCount(p, 1), (n as number) * 10));
[[1, 'Golden Touch', 'uncommon'], [10, 'Gold Rush', 'rare'], [50, 'Golden Era', 'epic'], [150, 'Midas', 'legendary']].forEach(([n, name, r]) =>
  add(`gold_${n}`, name as string, `Earn gold or better on ${n} track${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => medalCount(p, 3), (n as number) * 30, (n as number) >= 50 ? 10 : 0));
[[1, 'Platinum Champion', 'rare'], [10, 'Platinum Club', 'epic'], [50, 'Platinum Legend', 'legendary']].forEach(([n, name, r]) =>
  add(`plat_${n}`, name as string, `Earn platinum or better on ${n} track${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => medalCount(p, 4), (n as number) * 80, (n as number) * 2));
[[1, 'The Apex', 'epic'], [10, 'Apex Predator', 'legendary'], [50, 'Apexline', 'mythic']].forEach(([n, name, r]) =>
  add(`apex_${n}`, name as string, `Earn an Apex medal on ${n} track${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => medalCount(p, 5), (n as number) * 120, (n as number) * 5));
// ---- records & benchmarks
[[1, 'Personal Best', 'common'], [25, 'Shaving Time', 'uncommon'], [100, 'Millisecond Master', 'rare'], [400, 'Perfectionist', 'epic']].forEach(([n, name, r]) =>
  add(`pb_${n}`, name as string, `Beat your personal record ${n} time${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => p.stats.pbs, (n as number) * 12));
[[1, 'Benchmark Breaker', 'epic'], [5, 'Machine Hunter', 'epic'], [25, 'Better Than Code', 'legendary'], [100, 'Ghost Slayer', 'mythic']].forEach(([n, name, r]) =>
  add(`bench_${n}`, name as string, `Beat the simulated benchmark on ${n} track${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => p.stats.benchmarks, (n as number) * 150, (n as number) * 3));
add('ghost_win', 'Ghost Hunter', 'Beat a ghost in a Ghost Challenge.', 'uncommon', 1, p => p.stats.ghostWins, 600);
add('ghost_10', 'Haunted', 'Beat 10 ghosts.', 'rare', 10, p => p.stats.ghostWins, 2000);
add('milli', 'Millisecond Miracle', 'Beat a previous best by less than 10 ms.', 'rare', 1, p => p.stats.milliWins, 1000);
add('perfect_line', 'Perfect Line', 'Finish a track within 3% of the simulated benchmark.', 'epic', 1, p => medalCount(p, 5) + (p.stats.benchmarks ? 1 : 0) > 0 ? 1 : 0, 2000);
// ---- chapters
CHAPTERS_INFO.forEach((c, i) => {
  const n = i + 1;
  add(`ch${n}_done`, `${c.name}: Graduate`, `Finish all 25 tracks of ${c.name}.`, n <= 4 ? 'uncommon' : n <= 8 ? 'rare' : n <= 10 ? 'epic' : 'legendary', 25, p => chapterDone(p, n), 1500 + n * 250, 2 + n);
  add(`ch${n}_gold`, `${c.name}: Gold Standard`, `Earn gold or better on 10 ${c.name} tracks.`, n <= 4 ? 'rare' : 'epic', 10, p => chapterGold(p, n), 2500 + n * 300, 4 + n);
  add(`ch${n}_plat`, `${c.name}: Platinum`, `Earn platinum on 5 ${c.name} tracks.`, n <= 6 ? 'epic' : 'legendary', 5, p => chapterPlat(p, n), 4000 + n * 400, 8 + n);
});
// ---- garage / economy
[[3, 'Garage Starter', 'common'], [8, 'Garage Collector', 'uncommon'], [16, 'Dealer', 'rare'], [24, 'Full Roster', 'legendary']].forEach(([n, name, r]) =>
  add(`cars_${n}`, name as string, `Own ${n} vehicles.`, r as Rarity, n as number, p => p.vehicles.length, (n as number) * 100, (n as number) >= 16 ? 20 : 0));
[[25, 'Fresh Paint', 'common'], [100, 'Customiser', 'uncommon'], [250, 'Style Icon', 'rare'], [400, 'Wardrobe', 'epic']].forEach(([n, name, r]) =>
  add(`cos_${n}`, name as string, `Own ${n} cosmetic items.`, r as Rarity, n as number, p => p.owned.length, (n as number) * 15));
[[1, 'First Purchase', 'common'], [25, 'Shopper', 'uncommon'], [100, 'Big Spender', 'rare']].forEach(([n, name, r]) =>
  add(`buy_${n}`, name as string, `Make ${n} shop purchase${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => p.stats.purchases, (n as number) * 20));
[[10000, 'Pocket Money', 'common'], [100000, 'Six Figures', 'rare'], [1000000, 'Millionaire', 'legendary']].forEach(([n, name, r]) =>
  add(`earn_${n}`, name as string, `Earn ${n.toLocaleString()} credits.`, r as Rarity, n as number, p => p.stats.creditsEarned, 500, (n as number) >= 1000000 ? 25 : 0));
// ---- levels
[[5, 'Learner', 'common'], [10, 'Level 10', 'common'], [25, 'Level 25', 'uncommon'], [50, 'Level 50', 'rare'], [100, 'Level 100', 'epic'], [150, 'Level 150', 'epic'], [200, 'Level 200', 'legendary'], [250, 'Maximum Level', 'mythic']].forEach(([n, name, r]) =>
  add(`level_${n}`, name as string, `Reach player level ${n}.`, r as Rarity, n as number, p => p.level + (p.prestige > 0 ? 250 : 0), (n as number) * 20, (n as number) >= 100 ? 10 : 0));
add('prestige_1', 'Prestige', 'Prestige for the first time.', 'epic', 1, p => p.prestige, 5000, 25);
add('prestige_8', 'Apex Prestige', 'Reach Apex prestige.', 'mythic', 8, p => p.prestige, 50000, 200);
// ---- challenges / modes
[[1, 'Daily Habit', 'common'], [10, 'Reliable', 'uncommon'], [30, 'Dedication', 'epic']].forEach(([n, name, r]) =>
  add(`daily_${n}`, name as string, `Complete ${n} daily challenge${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => p.stats.dailyDone, (n as number) * 60));
[[1, 'Weekly Warrior', 'uncommon'], [5, 'Season Regular', 'epic']].forEach(([n, name, r]) =>
  add(`weekly_${n}`, name as string, `Complete ${n} weekly challenge${(n as number) > 1 ? 's' : ''}.`, r as Rarity, n as number, p => p.stats.weeklyDone, (n as number) * 400));
[[500, 'Endless Beginner', 'common'], [3000, 'Endless Runner', 'rare'], [10000, 'Endless Legend', 'epic']].forEach(([n, name, r]) =>
  add(`endless_${n}`, name as string, `Travel ${n} m in Endless Road.`, r as Rarity, n as number, p => p.stats.endless, (n as number) / 4));
[[5000, 'Stuntman', 'uncommon'], [25000, 'Daredevil', 'epic']].forEach(([n, name, r]) =>
  add(`stunt_${n}`, name as string, `Score ${n.toLocaleString()} in Stunt Mode.`, r as Rarity, n as number, p => p.stats.stuntBest, (n as number) / 5));
add('architect', 'Track Architect', 'Build, validate and save a custom track.', 'rare', 1, p => p.customTracks.filter(t => t.verified).length, 2500);
add('architect_5', 'Master Builder', 'Save 5 validated custom tracks.', 'epic', 5, p => p.customTracks.filter(t => t.verified).length, 6000);
add('ranked_place', 'Placed', 'Finish your ranked placement runs.', 'uncommon', 5, p => p.ranked.placements, 1000);
add('ranked_gold', 'Gold League', 'Reach Gold I in offline ranked practice.', 'rare', 900, p => p.ranked.peak, 3000);
add('ranked_diamond', 'Diamond League', 'Reach Diamond I in offline ranked practice.', 'epic', 1800, p => p.ranked.peak, 8000, 15);
add('ranked_master', 'Master', 'Reach Master in offline ranked practice.', 'legendary', 2300, p => p.ranked.peak, 20000, 40);
add('ranked_apex', 'Apex League', 'Reach the Apex division in offline ranked practice.', 'mythic', 3000, p => p.ranked.peak, 60000, 100);
add('wr', 'Record Holder', 'Hold a verified online world record.', 'mythic', 1, p => p.stats.wr, 20000, 100);
add('night_owl', 'Night Owl', 'Complete 25 Neon District tracks.', 'rare', 25, p => chapterDone(p, 5), 2500);
add('fav_5', 'Curator', 'Favourite 5 tracks.', 'common', 5, p => p.favorites.length, 200);
add('wish_5', 'Dreamer', 'Add 5 items to your wishlist.', 'common', 5, p => p.wishlist.length, 200);
add('all_chapters', 'The Whole Campaign', 'Finish every one of the 275 campaign tracks.', 'mythic', 275, p => R(p).filter(r => r.finishes > 0).length, 50000, 150);
add('gold_all', 'Golden Campaign', 'Earn gold or better on all 275 tracks.', 'mythic', 275, p => medalCount(p, 3), 100000, 300);

export const ACHIEVEMENTS: Achievement[] = A;
