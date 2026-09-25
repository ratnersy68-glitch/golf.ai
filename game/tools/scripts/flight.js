import { frames, launch, swing } from './util.js';
const snapAt = async (page, SP, name, n = 2) => { await page.evaluate(() => window.__app.rig.snap()); await frames(page, n); await page.screenshot({ path: `${SP}/${name}.png` }); };
export default async function (page, SP, logs) {
  const c = process.env.COURSE || 'augusta';
  const hole = +(process.env.HOLE || 0);
  await launch(page, { mode: 'coursePractice', setup: { courseId: c, hole } });
  await snapAt(page, SP, 'f-address');
  await page.evaluate(() => window.__app.play.setCamera('player'));
  await snapAt(page, SP, 'f-player');
  await page.evaluate(() => window.__app.play.setCamera('overhead'));
  await snapAt(page, SP, 'f-overhead');
  await page.evaluate(() => window.__app.play.setCamera('address'));
  await snapAt(page, SP, 'f-address2');
  await swing(page, 1000, 0.0);
  const res = await page.evaluate(() => { const s = window.__app.play.shot; return { rating: s.launch.rating, carry: s.result.carry, total: s.result.total, apex: s.result.apex, surf: s.result.surf, dur: s.result.duration, ev: s.result.events.map(e => e.type).join(',') }; });
  logs.push('SHOT ' + JSON.stringify(res));
  for (const [f, name] of [[0.1, 'f-t1'], [0.3, 'f-t2'], [0.6, 'f-t3'], [0.85, 'f-t4']]) {
    await page.evaluate((f) => { const p = window.__app.play; p.shot.t = p.shot.result.events.find(e => e.type === 'land').t * f; }, f);
    await frames(page, 1);
    await snapAt(page, SP, name, 2);
  }
}
