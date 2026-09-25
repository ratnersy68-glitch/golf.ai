import { frames, launch } from './util.js';
export default async function (page, SP, logs) {
  await frames(page, 3);
  await page.screenshot({ path: `${SP}/mob-menu.png` });
  logs.push('touch=' + await page.evaluate(() => document.body.classList.contains('touch')));
  await launch(page, { mode: 'coursePractice', setup: { courseId: 'pebble', hole: 17 } });
  await page.evaluate(() => window.__app.rig.snap());
  await frames(page, 2);
  await page.screenshot({ path: `${SP}/mob-play.png` });
  // shot panel
  await page.tap('#m-shot');
  await frames(page, 1);
  await page.screenshot({ path: `${SP}/mob-shotpanel.png` });
  await page.tap('#m-shot');
  // swing with the touch button: hold, release, tap
  const box = await page.locator('#m-swing').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.touchscreen.tap(cx, cy);
  logs.push('state after tap: ' + await page.evaluate(() => window.__app.play.state + ' ' + window.__app.play.meter.state));
  await page.evaluate(() => { const p = window.__app.play; if (p.state === 'swing') { p.meter.power = 0.9; p.swingRelease(); p.meter.marker = 0; p.swingPress(); } });
  logs.push('after swing: ' + await page.evaluate(() => window.__app.play.state));
  await page.setViewportSize({ width: 390, height: 844 });
  await frames(page, 2);
  await page.screenshot({ path: `${SP}/mob-portrait.png` });
}
