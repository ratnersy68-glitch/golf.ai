import * as THREE from 'three';
import type { CourseData, GolferData, HoleLayout } from '../data/types';
import { AudioManager } from '../systems/AudioManager';
import { CourseDatabase } from '../systems/CourseDatabase';
import { BALLS } from '../systems/CustomizationSystem';
import { GolferDatabase } from '../systems/GolferDatabase';
import { HoleManager } from '../systems/HoleManager';
import { PlayerManager } from '../systems/PlayerManager';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { coinsFor, xpFor } from '../systems/ScoringSystem';
import { RoundSession, TournamentSystem } from '../systems/TournamentSystem';
import { UIManager } from '../ui/UIManager';
import { Engine } from './Engine';
import { PreviewStage } from './PreviewStage';
import { ShowcaseStage } from './ShowcaseStage';
import { WorldStage } from './WorldStage';

/**
 * Composition root. Owns every system and routes between screens:
 * Menu -> Courses -> Course -> Holes -> (flyover) Hole -> Result -> next / summary.
 */
export class Game {
  readonly engine: Engine;
  readonly save = new SaveSystem();
  readonly progression: ProgressionSystem;
  readonly audio = new AudioManager();
  readonly player: PlayerManager;
  readonly world: WorldStage;
  readonly showcase: ShowcaseStage;
  readonly preview: PreviewStage;
  readonly holes: HoleManager;
  readonly ui: UIManager;
  session: RoundSession | null = null;
  private playing = false;

  constructor(canvas: HTMLCanvasElement, uiRoot: HTMLElement) {
    this.engine = new Engine(canvas, this.save.data.settings.quality);
    this.progression = new ProgressionSystem(this.save);
    this.player = new PlayerManager(this.currentGolfer());
    this.world = new WorldStage(this.engine.quality, GolferDatabase.roster().map((g) => g.shortName));
    this.showcase = new ShowcaseStage(canvas);
    this.preview = new PreviewStage(canvas, this.engine.quality);
    this.holes = new HoleManager(this.world, this.audio, this.player, canvas);
    this.ui = new UIManager(uiRoot, this);
    this.audio.setLevels(this.save.data.settings.sfx, this.save.data.settings.ambience);
    this.holes.setTrajectory(this.save.data.settings.trajectory);
    this.audio.hapticsEnabled = this.save.data.settings.haptics;
    this.applyBall();

    this.engine.onFrame((dt) => {
      if (this.playing) this.holes.update(dt);
    });

    this.holes.events.on('complete', (r) => this.onHoleComplete(r.layoutId, r.strokes, r.par, r.name, r.tone));
    // resume audio on first interaction anywhere
    addEventListener('pointerdown', () => this.audio.unlock(), { once: false });
  }

  /* ------------------------------------------------------------ golfers */

  currentGolfer(): GolferData {
    const d = this.save.data;
    return GolferDatabase.get(d.currentGolfer, d.customGolfer);
  }

  golferById(id: string): GolferData {
    return GolferDatabase.get(id, this.save.data.customGolfer);
  }

  selectGolfer(id: string): void {
    this.save.data.currentGolfer = id;
    this.save.save();
    this.player.setGolfer(this.currentGolfer());
    this.world.setGolfer(this.currentGolfer());
  }

  applyBall(): void {
    const b = BALLS.find((x) => x.id === this.save.data.cosmetics.equipped.ball) ?? BALLS[0];
    this.world.setBallColor(b.color, b.trail);
  }

  /* ------------------------------------------------------------ stages */

  async boot(): Promise<void> {
    const first = this.save.data.lastHole ?? 'augusta-12';
    this.world.setGolfer(this.currentGolfer());
    await nextFrame();
    this.world.loadHole(CourseDatabase.layout(first));
    this.showMenuWorld();
    this.engine.setStage(this.world);
  }

  /** The hole becomes the menu backdrop: golfer on the tee, slow cinematic orbit. */
  showMenuWorld(): void {
    this.playing = false;
    this.holes.idle();
    const m = this.world.model!;
    const [tx, ty] = m.layout.tee.at;
    const tee = this.world.world(tx, ty);
    const green = this.world.world(m.greenCenter[0], m.greenCenter[1]);
    const toGreen = green.clone().sub(tee).setY(0).normalize();
    const side = new THREE.Vector3(-toGreen.z, 0, toGreen.x);
    const spot = tee.clone().addScaledVector(side, 1.2).addScaledVector(toGreen, 0.6);
    spot.y = m.surfaceHeight(spot.x, -spot.z);
    this.world.standGolfer(spot, side.clone().negate().addScaledVector(toGreen, -0.6).normalize());
    this.world.golfer?.setMode('idle');
    this.world.placeBall(tx, ty, m.surfaceHeight(tx, ty));
    this.world.cam.orbit(spot.clone().add(new THREE.Vector3(0, 2.4, 0)), 9, 2.2, 0.05, Math.atan2(side.x, side.z) - 0.9);
    this.world.cam.snap();
    // turn to the camera, like a player posing on the first tee
    const camPos = this.world.camera.position.clone().setY(spot.y);
    this.world.standGolfer(spot, camPos.sub(spot).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.35));
    this.world.frameShift = 0.16;
    this.audio.setAtmosphere(CourseDatabase.course(m.layout.courseId).atmosphere);
    this.engine.setStage(this.world);
  }

  showShowcase(golfer: GolferData): void {
    this.playing = false;
    this.showcase.show(golfer);
    this.engine.setStage(this.showcase);
  }

  showPreview(course: CourseData): void {
    this.playing = false;
    this.preview.show(course, CourseDatabase.signatureLayout(course.id));
    this.engine.setStage(this.preview);
  }

  /* ------------------------------------------------------------ play */

  quickPlay(): void {
    const id = this.save.data.lastHole ?? 'augusta-12';
    this.startSession(TournamentSystem.single(id));
  }

  startSession(session: RoundSession): void {
    this.session = session;
    this.playCurrent(true);
  }

  playCurrent(flyover: boolean): void {
    const s = this.session!;
    const layout = CourseDatabase.layout(s.current);
    const course = CourseDatabase.course(layout.courseId);
    this.ui.loading(true);
    // let the loading overlay paint before the heavy build
    requestAnimationFrame(() =>
      setTimeout(() => {
        this.player.setGolfer(this.currentGolfer());
        this.player.reseed(Date.now() % 1e6);
        if (!this.world.golfer || this.world.golfer.data.id !== this.currentGolfer().id) this.world.setGolfer(this.currentGolfer());
        this.world.frameShift = 0;
        this.holes.start(layout, course, { finalHole: s.isFinalHole && s.holes.length > 1, flyover });
        this.save.data.lastHole = layout.id;
        this.save.save();
        this.engine.setStage(this.world);
        this.playing = true;
        this.ui.loading(false);
        this.ui.showHud(layout, course, s);
      }, 30),
    );
  }

  restartHole(): void {
    if (!this.session) return;
    this.world.frameShift = 0;
    this.playCurrent(false);
  }

  private onHoleComplete(layoutId: string, strokes: number, par: number, name: string, tone: string): void {
    const rec = this.save.hole(layoutId);
    const newBest = rec.best === null || strokes < rec.best;
    rec.plays++;
    rec.completed = true;
    rec.lastScore = strokes;
    if (newBest) rec.best = strokes;
    if (strokes === 1) {
      rec.aces++;
      this.save.data.stats.aces++;
    }
    this.save.data.stats.holesPlayed++;
    this.save.data.stats.shots += strokes;
    this.save.data.stats.waterBalls += this.holes.recorder.shots.filter((s) => s.result === 'water').length;
    const coins = coinsFor(strokes, par);
    const xp = xpFor(strokes, par);
    const { tierUp } = this.progression.award(coins, xp);
    this.session?.record(strokes);
    this.ui.showHoleResult({ layoutId, strokes, par, name, tone, coins, xp, newBest, tierUp, session: this.session! });
  }

  nextHole(): void {
    const s = this.session;
    if (!s) return;
    if (s.advance()) this.playCurrent(true);
    else this.finishRound();
  }

  finishRound(): void {
    const s = this.session;
    if (!s) return;
    let bonus = 0;
    let best = false;
    if (s.tournament) {
      best = TournamentSystem.record(this.save, s, this.save.data.currentGolfer);
      bonus = s.tournament.reward + Math.max(0, -s.toPar) * 50;
      this.progression.award(bonus, 120);
    }
    this.ui.showRoundSummary(s, bonus, best);
  }

  quitToMenu(): void {
    this.playing = false;
    this.session = null;
    this.showMenuWorld();
    this.ui.go('menu');
  }

  layoutFor(courseId: string, holeNumber: number): HoleLayout | undefined {
    const h = CourseDatabase.course(courseId).holes.find((x) => x.number === holeNumber);
    return h?.layoutId ? CourseDatabase.layout(h.layoutId) : undefined;
  }

  setQuality(q: 'low' | 'high'): void {
    this.save.data.settings.quality = q;
    this.save.save();
    this.engine.setQuality(q);
  }
}

function nextFrame(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => r()));
}
