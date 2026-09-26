import { TOURNAMENTS } from '../data/tournaments';
import type { TournamentData } from '../data/types';
import { CourseDatabase } from './CourseDatabase';
import type { SaveSystem, TournamentResult } from './SaveSystem';
import { CardEntry, summarize } from './ScoringSystem';

export type RoundKind = 'single' | 'course' | 'tournament';

/** A sequence of real holes played back to back (single hole, course round, or tournament). */
export class RoundSession {
  readonly kind: RoundKind;
  readonly title: string;
  readonly holes: string[];
  readonly tournament?: TournamentData;
  index = 0;
  card: CardEntry[] = [];

  constructor(kind: RoundKind, title: string, holes: string[], tournament?: TournamentData) {
    this.kind = kind;
    this.title = title;
    this.holes = holes;
    this.tournament = tournament;
  }

  get current(): string {
    return this.holes[this.index];
  }

  get isFinalHole(): boolean {
    return this.index === this.holes.length - 1;
  }

  get finished(): boolean {
    return this.card.length >= this.holes.length;
  }

  record(strokes: number): void {
    const l = CourseDatabase.layout(this.current);
    this.card.push({ layoutId: l.id, number: l.number, par: l.par, strokes });
  }

  advance(): boolean {
    if (this.index < this.holes.length - 1) {
      this.index++;
      return true;
    }
    return false;
  }

  get toPar(): number {
    return this.card.reduce((a, c) => a + c.strokes - c.par, 0);
  }

  summary() {
    return summarize(this.card);
  }
}

export const TournamentSystem = {
  all(): TournamentData[] {
    return TOURNAMENTS;
  },
  get(id: string): TournamentData {
    return TOURNAMENTS.find((t) => t.id === id)!;
  },
  start(t: TournamentData): RoundSession {
    return new RoundSession('tournament', t.name, t.holes, t);
  },
  courseRound(courseId: string): RoundSession {
    const c = CourseDatabase.course(courseId);
    return new RoundSession('course', c.shortName, CourseDatabase.builtHoles(courseId).map((h) => h.layoutId!));
  },
  single(layoutId: string): RoundSession {
    const l = CourseDatabase.layout(layoutId);
    return new RoundSession('single', `${CourseDatabase.course(l.courseId).shortName} · Hole ${l.number}`, [layoutId]);
  },
  /** store a finished tournament; returns whether it is a new best */
  record(save: SaveSystem, session: RoundSession, golferId: string): boolean {
    if (!session.tournament) return false;
    const s = session.summary();
    const res: TournamentResult = {
      date: new Date().toISOString(),
      golferId,
      strokes: s.strokes,
      toPar: s.toPar,
      holes: session.card.map((c) => ({ layoutId: c.layoutId, strokes: c.strokes, par: c.par })),
    };
    const rec = (save.data.tournaments[session.tournament.id] ??= { best: null, results: [] });
    rec.results.unshift(res);
    rec.results = rec.results.slice(0, 10);
    const isBest = rec.best === null || s.toPar < rec.best;
    if (isBest) rec.best = s.toPar;
    save.save();
    return isBest;
  },
};
