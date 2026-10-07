// Captures the README screenshots into docs/
import { frames, launch, swing } from './util.js';
const OUT = new URL('../../docs/', import.meta.url).pathname;
const shot = async (page, name) => { await frames(page, 2); await page.screenshot({ path: `${OUT}${name}.jpg`, type: 'jpeg', quality: 78 }); };
export default async function (page, SP, logs) {
  await shot(page, 'menu');
  // Augusta 12 from the tee
  await launch(page, { mode: 'coursePractice', setup: { courseId: 'augusta', hole: 11 } });
  await page.evaluate(() => window.__app.rig.snap());
  await shot(page, 'augusta-12');
  await page.evaluate(() => window.__app.quitToMenu());
  // Sawgrass 17 overview
  await launch(page, { mode: 'coursePractice', setup: { courseId: 'sawgrass', hole: 16 } });
  await page.evaluate(() => {
    const app = window.__app, p = app.play, hole = p.hole; p.state = 'pose';
    const V = app.world.camera.position.constructor; const a = hole.at(Math.max(0, hole.L - 70));
    app.rig.set('thumb', { pos: new V(a.x + a.ty * 30, hole.heightAt(a.x, a.y) + 16, -(a.y - a.tx * 30)), look: new V(hole.G[0], hole.heightAt(hole.G[0], hole.G[1]), -hole.G[1]), fov: 50, snap: true });
    app.rig.snap(); app.hud.show(false);
  });
  await shot(page, 'sawgrass-17');
  await page.evaluate(() => { window.__app.hud.show(true); window.__app.quitToMenu(); });
  // Augusta 1 drive: follow camera
  await launch(page, { mode: 'coursePractice', setup: { courseId: 'augusta', hole: 0 } });
  await swing(page, 1000, 0.0);
  await page.evaluate(() => { const p = window.__app.play; p.shot.t = p.shot.result.events.find(e => e.type === 'land').t * 0.62; });
  await frames(page, 1); await page.evaluate(() => window.__app.rig.snap());
  await shot(page, 'drive');
  await page.evaluate(() => window.__app.quitToMenu());
  // Putting with the guide
  await launch(page, { mode: 'practice', setup: { courseId: 'pebble', hole: 17, practiceKind: 'putting' } });
  await page.evaluate(() => window.__app.rig.snap());
  await shot(page, 'putting');
  await page.evaluate(() => window.__app.quitToMenu());
}
