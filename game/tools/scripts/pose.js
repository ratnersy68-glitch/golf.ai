import { frames, launch } from './util.js';
export default async function (page, SP, logs) {
  await launch(page, { mode: 'coursePractice', setup: { courseId: 'augusta', hole: 1 } });
  const poses = [['address', 'g.address()'], ['top', 'g.setBackswing(1)'], ['half', 'g.setDownswing(1, 0.4)'], ['impact', 'g.setDownswing(1, 0)'], ['finish', 'g.setFollow(1)']];
  for (const cam of ['player', 'address']) {
    await page.evaluate((cam) => { window.__app.play.setCamera(cam); window.__app.rig.snap(); }, cam);
    for (const [n, code] of poses) {
      await page.evaluate((code) => { const p = window.__app.play; p.state = 'pose'; const g = p.golfer; eval(code); window.__app.rig.snap(); }, code);
      await frames(page, 2);
      await page.screenshot({ path: `${SP}/pose-${cam}-${n}.png`, clip: { x: 340, y: 100, width: 600, height: 560 } });
    }
  }
}
