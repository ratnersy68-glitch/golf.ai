// A perfect stroke (pace inside the gold band, aim on the read) must hole every putt; any other stroke rolls
// exactly as struck, with no randomness and no wind. Usage: node tools/test-putt-perfect.js
import { Play } from '../src/game/play.js';
import { DEFAULT_LOOK, PROS, proAttrs } from '../src/data/golfers.js';
import { newProfile } from '../src/core/profile.js';
import { COURSES } from '../src/data/courses.js';
import { S, Hole } from '../src/core/holeGen.js';
import { simulate } from '../src/core/physics.js';
import * as THREE from 'three';

globalThis.document = { createElement: () => ({ getContext: () => null }) };
globalThis.window = {};
const noop = () => {};
const stub = () => new Proxy({}, { get: (t, k) => (k in t ? t[k] : noop) });
const profile = newProfile();
profile.settings.flyover = false;
const world = stub(); world.time = 0; world.tee = {}; world.camera = new THREE.PerspectiveCamera();
const rig = stub(); rig.opts = {};
const app = { world, rig, hud: stub(), profile, save: noop, onRoundComplete: noop };
let made = 0, tried = 0, fails = 0, offMade = 0, offTried = 0;
for (const diff of ['normal', 'realistic']) for (const c of COURSES) {
  const play = new Play(app);
  play.golfer = new Proxy({ root: { visible: true } }, { get: (t, k) => (k in t ? t[k] : noop) });
  play.start({ mode: 'coursePractice', courseId: c.id, teeId: 'tour', holes: [0, 3, 6, 9, 12, 15], difficulty: diff, attrs: proAttrs(PROS[0]), look: DEFAULT_LOOK, golferName: 'T' });
  for (const idx of [0, 3, 6, 9, 12, 15]) {
    const hole = play.hole = new Hole(c, idx, { pinSeed: 11 + idx });
    hole.stimp = c.stimp + (diff === 'realistic' ? 0.5 : 0); hole.firmness = c.firmness;
    for (const [r, a] of [[2.5, 0.7], [6, 2.1], [11, 4.2]]) {
      const x = hole.pin[0] + Math.sin(a) * r, y = hole.pin[1] + Math.cos(a) * r;
      if (hole.surfAt(x, y) !== S.GREEN) continue;
      play.ball = { x, y, h: hole.heightAt(x, y) };
      play.wind = [9, -7]; // a strong wind must not matter
      play.club = play.bag.find(b => b.cat === 'putter'); play.typeId = 'putt';
      play.puttSol = null; play.puttScale = play.puttScaleFor();
      const sol = play.puttSolution();
      // perfect: on the read, pace at the edge of the band
      play.heading = sol.heading + 0.4 * play.puttTolerance().line / sol.D;
      const st = play.puttStroke(play.puttPerfectPower() * (1 + play.puttTolerance().pace * 0.8));
      const res = simulate(hole, play.ball, st, play.env(true), { putt: true });
      tried++;
      if (st.perfect && res.holed) made++; else { fails++; console.log('FAIL', diff, c.id, hole.number, (r * 3).toFixed(0) + 'ft', st.rating, res.holed); }
      // a clearly mis-hit putt is graded and rolls as struck
      play.heading = sol.heading;
      const bad = play.puttStroke(play.puttPerfectPower() * 1.4);
      offTried++; if (!bad.perfect && bad.rating.includes('FIRM')) offMade++;
    }
  }
}
console.log(`perfect strokes holed ${made}/${tried}; firm strokes graded ${offMade}/${offTried}`);
process.exit(fails || offMade !== offTried ? 1 : 0);
