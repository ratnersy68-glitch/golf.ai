import { describe, expect, it } from 'vitest';
import { COURSES } from '../src/data/courses/courses';
import { GOLFERS } from '../src/data/golfers';
import { HOLE_LAYOUTS } from '../src/data/holes';
import { TOURNAMENTS } from '../src/data/tournaments';
import { PlayerManager } from '../src/systems/PlayerManager';
import { ProgressionSystem } from '../src/systems/ProgressionSystem';
import { defaultSave, migrate, SaveSystem } from '../src/systems/SaveSystem';
import { coinsFor, formatToPar, maxStrokes, scoreName, summarize } from '../src/systems/ScoringSystem';

const memory = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
};

describe('scoring', () => {
  it('names scores the golf way', () => {
    expect(scoreName(1, 3)).toBe('Hole in One!');
    expect(scoreName(2, 3)).toBe('Birdie!');
    expect(scoreName(3, 3)).toBe('Par');
    expect(scoreName(4, 3)).toBe('Bogey');
    expect(scoreName(5, 3)).toBe('Double Bogey');
    expect(scoreName(3, 5)).toBe('Eagle!');
    expect(scoreName(2, 5)).toBe('Albatross!');
  });
  it('formats relative to par', () => {
    expect(formatToPar(0)).toBe('E');
    expect(formatToPar(-2)).toBe('-2');
    expect(formatToPar(3)).toBe('+3');
  });
  it('summarises a card', () => {
    const s = summarize([
      { layoutId: 'augusta-12', number: 12, par: 3, strokes: 2 },
      { layoutId: 'augusta-16', number: 16, par: 3, strokes: 5 },
    ]);
    expect(s.strokes).toBe(7);
    expect(s.toPar).toBe(1);
    expect(s.best.layoutId).toBe('augusta-12');
    expect(s.worst.layoutId).toBe('augusta-16');
  });
  it('rewards better scores and caps strokes', () => {
    expect(coinsFor(1, 3)).toBeGreaterThan(coinsFor(2, 3));
    expect(maxStrokes(3)).toBe(7);
  });
});

describe('save system', () => {
  it('round-trips and survives corrupt data', () => {
    const store = memory();
    const a = new SaveSystem(store);
    a.data.coins = 1234;
    a.save();
    expect(new SaveSystem(store).data.coins).toBe(1234);
    store.setItem('mini-majors.save', '{not json');
    expect(new SaveSystem(store).data.coins).toBe(defaultSave().coins);
  });
  it('migrates v1 saves', () => {
    const v1 = { version: 1, coins: 50, currentGolfer: 'woods', unlockedGolfers: ['woods'] };
    const m = migrate(v1);
    expect(m.version).toBe(2);
    expect(m.coins).toBe(50);
    expect(m.stats.holesPlayed).toBe(0);
    expect(m.settings.quality).toBeDefined();
  });
});

describe('progression', () => {
  it('signature holes are always playable, full courses unlock by tier', () => {
    const save = new SaveSystem(memory());
    const p = new ProgressionSystem(save);
    expect(p.canPlayHole('sawgrass', 'sawgrass-17')).toBe(true);
    expect(p.canPlayHole('augusta', 'augusta-12')).toBe(true);
    const pebble = COURSES.find((c) => c.id === 'pebble')!;
    expect(p.isCourseUnlocked(pebble)).toBe(false);
    p.award(0, 5000);
    expect(p.isCourseUnlocked(pebble)).toBe(true);
    expect(p.tier).toBe('elite');
  });
  it('buying golfers costs coins', () => {
    const save = new SaveSystem(memory());
    const p = new ProgressionSystem(save);
    save.data.coins = 1000;
    expect(p.buyGolfer('woods', 2500)).toBe(false);
    expect(p.buyGolfer('spieth', 900)).toBe(true);
    expect(save.data.coins).toBe(100);
  });
});

describe('golfer stats stay subtle', () => {
  it('max speed spread between golfers is small', () => {
    const speeds = GOLFERS.map((g) => new PlayerManager(g, 1).maxSpeed);
    expect(Math.max(...speeds) / Math.min(...speeds)).toBeLessThan(1.1);
  });
  it('execution variance is small but present', () => {
    const pm = new PlayerManager(GOLFERS.find((g) => g.id === 'dechambeau')!, 42);
    let maxDev = 0;
    for (let i = 0; i < 200; i++) maxDev = Math.max(maxDev, Math.abs(pm.execute(0, 0.6).angle));
    expect(maxDev).toBeGreaterThan(0);
    expect(maxDev).toBeLessThan((3 * Math.PI) / 180);
  });
  it('no golfer is overpowered', () => {
    for (const g of GOLFERS) for (const v of Object.values(g.stats)) expect(v).toBeLessThanOrEqual(99);
  });
});

describe('data integrity', () => {
  it('every built layout is listed on its course with matching par and yardage', () => {
    for (const l of HOLE_LAYOUTS) {
      const c = COURSES.find((x) => x.id === l.courseId)!;
      const h = c.holes.find((x) => x.number === l.number)!;
      expect(h.layoutId).toBe(l.id);
      expect(h.par).toBe(l.par);
      expect(h.yards).toBe(l.realYards);
    }
  });
  it('courses have 18 holes and pars add up', () => {
    for (const c of COURSES) {
      expect(c.holes).toHaveLength(18);
      expect(c.holes.reduce((a, h) => a + h.par, 0)).toBe(c.par);
    }
  });
  it('tournaments reference built holes only', () => {
    const ids = new Set(HOLE_LAYOUTS.map((l) => l.id));
    for (const t of TOURNAMENTS) for (const h of t.holes) expect(ids.has(h)).toBe(true);
  });
});
