/**
 * Multiplayer-ready architecture (not networked yet).
 *
 * The physics is deterministic with a fixed timestep, so a whole round can be described by the
 * shots struck: { from, angle, power }. That single fact enables:
 *   - ghost rounds (replay someone's shots beside yours)
 *   - asynchronous 1v1 / 4-player matches (exchange shot lists, simulate locally)
 *   - server-verified leaderboards (server re-simulates submitted shot lists)
 *   - online tournaments (same holes, same seeds, compare cards)
 */

export interface ShotRecord {
  holeId: string;
  stroke: number;
  from: [number, number];
  /** the shot actually struck, after golfer variance */
  angle: number;
  power: number;
  speed: number;
  result: 'rest' | 'water' | 'holed';
}

export interface PlayerCard {
  playerId: string;
  displayName: string;
  golferId: string;
  shots: ShotRecord[];
  strokes: Record<string, number>;
}

export type MatchFormat = 'solo' | 'versus' | 'foursome' | 'ghost' | 'tournament';

/** A transport-agnostic match session. A future OnlineMatch implements this over WebSockets. */
export interface MatchSession {
  id: string;
  format: MatchFormat;
  holes: string[];
  seed: number;
  players: PlayerCard[];
  localPlayerId: string;
  submitShot(shot: ShotRecord): void;
  onRemoteShot(cb: (playerId: string, shot: ShotRecord) => void): void;
}

export interface LeaderboardEntry {
  playerId: string;
  displayName: string;
  golferId: string;
  toPar: number;
  strokes: number;
  date: string;
}

export interface LeaderboardService {
  submit(boardId: string, card: PlayerCard): Promise<void>;
  top(boardId: string, limit: number): Promise<LeaderboardEntry[]>;
}

/** Records every shot for replays and ghosts. */
export class ShotRecorder {
  shots: ShotRecord[] = [];
  record(s: ShotRecord): void {
    this.shots.push(s);
  }
  forHole(holeId: string): ShotRecord[] {
    return this.shots.filter((s) => s.holeId === holeId);
  }
  clear(): void {
    this.shots = [];
  }
}

/** Offline stand-in used today: a local solo session. */
export class LocalMatch implements MatchSession {
  id = `local-${Date.now()}`;
  format: MatchFormat = 'solo';
  seed = Math.floor(Math.random() * 1e9);
  players: PlayerCard[];
  localPlayerId = 'local';
  private listeners: ((p: string, s: ShotRecord) => void)[] = [];
  constructor(
    public holes: string[],
    golferId: string,
  ) {
    this.players = [{ playerId: 'local', displayName: 'You', golferId, shots: [], strokes: {} }];
  }
  submitShot(shot: ShotRecord): void {
    this.players[0].shots.push(shot);
  }
  onRemoteShot(cb: (playerId: string, shot: ShotRecord) => void): void {
    this.listeners.push(cb);
  }
}
