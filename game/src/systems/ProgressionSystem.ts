import type { CourseData, Tier } from '../data/types';
import { CourseDatabase } from './CourseDatabase';
import type { SaveSystem } from './SaveSystem';

/**
 * Progression: Classic -> Major Championship -> Legendary -> Elite.
 * Every course's signature hole is playable from day one (so every real course is always reachable);
 * full courses and tournaments unlock by tour tier (earned with XP) or by spending coins.
 */
export const TIER_ORDER: Tier[] = ['classic', 'major', 'legendary', 'elite'];
export const TIER_XP: Record<Tier, number> = { classic: 0, major: 600, legendary: 1600, elite: 3200 };
export const TIER_LABEL: Record<Tier, string> = { classic: 'Classic', major: 'Major Championship', legendary: 'Legendary', elite: 'Elite' };
export const COURSE_UNLOCK_COINS: Record<Tier, number> = { classic: 0, major: 800, legendary: 1500, elite: 2500 };

export class ProgressionSystem {
  constructor(private save: SaveSystem) {}

  get xp(): number {
    return this.save.data.profile.xp;
  }

  get level(): number {
    return Math.floor(this.xp / 250) + 1;
  }

  get levelProgress(): number {
    return (this.xp % 250) / 250;
  }

  get tier(): Tier {
    let t: Tier = 'classic';
    for (const k of TIER_ORDER) if (this.xp >= TIER_XP[k]) t = k;
    return t;
  }

  nextTier(): { tier: Tier; xp: number } | null {
    const i = TIER_ORDER.indexOf(this.tier);
    const n = TIER_ORDER[i + 1];
    return n ? { tier: n, xp: TIER_XP[n] } : null;
  }

  tierReached(t: Tier): boolean {
    return this.xp >= TIER_XP[t];
  }

  isCourseUnlocked(c: CourseData): boolean {
    return this.tierReached(c.tier) || this.save.data.unlockedCourses.includes(c.id);
  }

  canPlayHole(courseId: string, layoutId: string): boolean {
    const c = CourseDatabase.course(courseId);
    const sig = c.holes.find((h) => h.number === c.signatureHole);
    if (sig?.layoutId === layoutId) return true;
    // a course's only built hole is treated as its signature
    if (CourseDatabase.builtHoles(courseId)[0]?.layoutId === layoutId) return true;
    return this.isCourseUnlocked(c);
  }

  buyCourse(c: CourseData): boolean {
    const cost = COURSE_UNLOCK_COINS[c.tier];
    if (this.save.data.coins < cost) return false;
    this.save.data.coins -= cost;
    this.save.data.unlockedCourses.push(c.id);
    this.save.save();
    return true;
  }

  isGolferUnlocked(id: string): boolean {
    return this.save.data.unlockedGolfers.includes(id);
  }

  buyGolfer(id: string, cost: number): boolean {
    if (this.save.data.coins < cost || this.isGolferUnlocked(id)) return false;
    this.save.data.coins -= cost;
    this.save.data.unlockedGolfers.push(id);
    this.save.save();
    return true;
  }

  award(coins: number, xp: number): { tierUp: Tier | null } {
    const before = this.tier;
    this.save.data.coins += coins;
    this.save.data.profile.xp += xp;
    this.save.save();
    const after = this.tier;
    return { tierUp: after !== before ? after : null };
  }
}
