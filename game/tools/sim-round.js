// Headless full-round simulation through the real Play controller (rendering stubbed).
// Usage: node tools/sim-round.js [courseId] [difficulty] [rounds]
import { Play } from '../src/game/play.js';
import { PROS, proAttrs, DEFAULT_LOOK } from '../src/data/golfers.js';
import { newProfile, customAttrs } from '../src/core/profile.js';
import * as THREE from 'three';

globalThis.document = { createElement: () => ({ getContext: () => null }) };
globalThis.window = {};
const realSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = (fn) => realSetTimeout(fn, 0);
const noop = () => {};
const stub = () => new Proxy({}, { get: (t, k) => (k in t ? t[k] : noop) });

const courseId = process.argv[2] || 'augusta';
const difficulty = process.argv[3] || 'normal';
const rounds = +(process.argv[4] || 1);
const proId = process.argv[5];

for (let rn = 0; rn < rounds; rn++) {
  const profile = newProfile();
  profile.settings.flyover = false;
  const world = stub();
  world.time = 0;
  world.tee = {};
  world.camera = new THREE.PerspectiveCamera();
  const hud = stub();
  let finished = null;
  hud.holeComplete = (play) => { setTimeout(() => play.nextHole(), 0); };
  hud.modalOpen = () => false;
  const rig = stub(); rig.opts = {};
  const app = { world, rig, hud, profile, save: noop, onRoundComplete: (round, st) => { finished = st; } };
  const play = new Play(app);
  play.golfer = { root: { visible: true }, build: noop, setClub: noop, address: noop, placeAtBall: noop, idle: noop, setBackswing: noop, setDownswing: noop, setFollow: noop, celebrate: noop, tick: noop, update: noop };
  const pro = proId ? PROS.find(p => p.id === proId) : null;
  play.start({
    mode: 'round18', courseId, teeId: 'tour', holes: [...Array(18).keys()], difficulty,
    attrs: pro ? proAttrs(pro) : customAttrs(profile), look: DEFAULT_LOOK, golferName: pro ? pro.name : 'Bot', custom: !pro,
  });
  const log = [];
  let guard = 0;
  const step = () => new Promise(r => realSetTimeout(r, 0));
  // bot loop
  while (!finished && guard++ < 20000) {
    await step();
    if (play.state === 'aim') {
      const putt = play.isPutt();
      // pick power: ideal (no wind) if available, else distance ratio
      let power = play.idealPower(false);
      if (power == null) power = putt ? Math.min(1, (play.distPin * 3 + 1.5) / play.puttScale) : 1;
      // human-ish timing error
      const timingErr = process.env.PERFECT ? 0 : (Math.random() - 0.5) * 1.4;
      const powerErr = process.env.PERFECT ? 1 : 1 + (Math.random() - 0.5) * 0.06;
      play.swingPress();
      play.meter.power = Math.min(1.05, power * powerErr);
      play.swingRelease();
      if (play.state === 'swing') {
        const w = 0.075;
        play.meter.marker = -timingErr * w;
        play.swingPress();
      }
      const s = play.shot;
      log.push(`${play.hole.number}.${play.strokes} ${play.club.short}/${play.typeId} ${s.launch.rating} ${Math.round(s.result.carry)}/${Math.round(s.result.total)} ->${['deep', 'rough', 'cut', 'fw', 'fringe', 'GREEN', 'tee', 'SAND', 'waste', 'WATER', 'BRUSH', 'straw', 'path'][s.result.surf]}${s.result.holed ? ' HOLED' : ''}${s.result.ob ? ' OB' : ''}`);
      s.t = s.result.duration + 1;
      play.update(0.016);
    } else if (play.state === 'result') {
      play.continueAfterResult();
    } else {
      play.update(0.05);
    }
  }
  if (!finished) { console.log('DID NOT FINISH', play.state, log.slice(-10)); process.exit(1); }
  if (rounds === 1) console.log(log.join('\n'));
  console.log(`${courseId} ${difficulty}: ${finished.strokes} (${finished.toPar >= 0 ? '+' : ''}${finished.toPar}) putts ${finished.putts} FIR ${finished.fairways}/${finished.fairwayChances} GIR ${finished.gir}/${finished.girChances} pen ${finished.penalties} birdies ${finished.birdies} eagles ${finished.eagles} bogeys ${finished.bogeys} dbl+ ${finished.doubles + finished.worse} drive ${finished.drives ? Math.round(finished.driveSum / finished.drives) : 0} sand ${finished.sandSaves}/${finished.sandChances} ud ${finished.upDowns}/${finished.upDownChances}`);
}
process.exit(0);
