// Screenshots of signature holes on each course (hero view near the green + address view).
import { frames, launch } from './util.js';
export default async function (page, SP, logs) {
  const list = (process.env.HOLES || 'augusta:11,pebble:6,sawgrass:16,standrews:17,pinehurst:17,oakmont:2,riviera:5,torrey:2,bethpage:3,valhalla:12,pebble:17').split(',');
  for (const item of list) {
    const [c, h] = item.split(':');
    await launch(page, { mode: 'coursePractice', setup: { courseId: c, hole: +h } });
    await page.evaluate(() => {
      const app = window.__app, p = app.play, hole = p.hole;
      // hero camera: behind-side of green looking back down the fairway / toward green
      const s = Math.max(0, hole.L - 70);
      const a = hole.at(s);
      p.state = 'pose';
      app.rig.set('thumb', { pos: new (app.world.camera.position.constructor)(a.x + a.ty * 30, hole.heightAt(a.x, a.y) + 16, -(a.y - a.tx * 30)), look: new (app.world.camera.position.constructor)(hole.G[0], hole.heightAt(hole.G[0], hole.G[1]), -hole.G[1]), fov: 50, snap: true });
      app.rig.snap();
    });
    await frames(page, 2);
    await page.screenshot({ path: `${SP}/tour-${c}-${+h + 1}-hero.png` });
    await page.evaluate(() => { const p = window.__app.play; p.state = 'aim'; p.setCamera('address'); window.__app.rig.snap(); });
    await frames(page, 2);
    await page.screenshot({ path: `${SP}/tour-${c}-${+h + 1}-tee.png` });
    logs.push('done ' + item);
    await page.evaluate(() => window.__app.quitToMenu());
    await frames(page, 1);
  }
}
