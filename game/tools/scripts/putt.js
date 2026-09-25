import { frames, launch } from './util.js';
const snapAt = async (page, SP, name, n = 2) => { await page.evaluate(() => window.__app.rig.snap()); await frames(page, n); await page.screenshot({ path: `${SP}/${name}.png` }); };
export default async function (page, SP, logs) {
  const c = process.env.COURSE || 'augusta';
  const hole = +(process.env.HOLE || 0);
  await launch(page, { mode: 'practice', setup: { courseId: c, hole, practiceKind: process.env.KIND || 'putting' } });
  await snapAt(page, SP, 'p-address');
  const info = await page.evaluate(() => { const p = window.__app.play; return { club: p.club.name, type: p.typeId, dist: p.distPin * 3, scale: p.puttScale, surf: p.surf }; });
  logs.push('SETUP ' + JSON.stringify(info));
  // putt with power = hole distance / scale (flat)
  const r = await page.evaluate(() => {
    const p = window.__app.play;
    p.swingPress();
    p.meter.power = Math.min(1, (p.distPin * 3 + 1.5) / p.puttScale);
    if (p.isPutt()) p.swingRelease(); else { p.swingRelease(); p.meter.marker = 0; p.swingPress(); }
    const s = p.shot;
    return { rating: s.launch.rating, total: s.result.total * 3, holed: s.result.holed, left: p.hole.distToPin(s.result.end.x, s.result.end.y) * 3, ev: s.result.events.map(e => e.type).join(',') };
  });
  logs.push('PUTT ' + JSON.stringify(r));
  await page.evaluate(() => { const p = window.__app.play; p.shot.t = p.shot.result.duration * 0.5; });
  await frames(page, 2);
  await snapAt(page, SP, 'p-roll');
  await page.evaluate(() => window.__app.play.setCamera && 0);
}
