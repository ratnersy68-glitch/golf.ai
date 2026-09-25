import { frames, launch, swing } from './util.js';
export default async function (page, SP, logs) {
  const c = process.env.COURSE || 'augusta';
  await launch(page, { setup: { courseId: c } });
  await page.screenshot({ path: `${SP}/r-address.png` });
  await page.keyboard.press('c'); await frames(page, 3);
  await page.screenshot({ path: `${SP}/r-player.png` });
  await page.keyboard.press('c'); await frames(page, 3);
  await page.screenshot({ path: `${SP}/r-overhead.png` });
  await page.keyboard.press('c'); await page.keyboard.press('c'); await frames(page, 2);
  await swing(page, 1000, 0.01);
  await frames(page, 4);
  await page.screenshot({ path: `${SP}/r-launch.png` });
  // fast-forward flight
  const res = await page.evaluate(() => { const s = window.__app.play.shot; return { rating: s.launch.rating, carry: s.result.carry, total: s.result.total, surf: s.result.surf, dur: s.result.duration, ev: s.result.events.map(e => e.type).join(',') }; });
  logs.push('SHOT ' + JSON.stringify(res));
  await page.evaluate(() => { window.__app.play.shot.t = window.__app.play.shot.result.duration * 0.55; });
  await frames(page, 3);
  await page.screenshot({ path: `${SP}/r-flight.png` });
  await page.evaluate(() => { window.__app.play.shot.t = window.__app.play.shot.result.duration + 1; });
  await frames(page, 3);
  await page.screenshot({ path: `${SP}/r-result.png` });
  await page.evaluate(() => window.__app.play.continueAfterResult());
  await frames(page, 4);
  await page.screenshot({ path: `${SP}/r-second.png` });
  const st = await page.evaluate(() => { const p = window.__app.play; return { club: p.club.name, type: p.typeId, dist: p.distPin, surf: p.surf, strokes: p.strokes }; });
  logs.push('NEXT ' + JSON.stringify(st));
}
