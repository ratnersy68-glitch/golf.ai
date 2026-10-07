import { frames, launch } from './util.js';
// Club info cards for a spread of the bag (driver → putter): checks the club models.
export default async function (page, SP) {
  await launch(page, { mode: 'round18', setup: { courseId: 'augusta', hole: 0 } });
  await page.waitForFunction(() => window.__app.play.state === 'aim', null, { timeout: 60000 });
  await page.evaluate(() => window.__app.play.openBag());
  await page.waitForTimeout(800);
  for (const want of ['DR', '3W', '3H', '5I', '9I', 'SW', 'LW', 'PT']) {
    const ok = await page.evaluate((id) => { const p = window.__app.play, bv = p.hud.bagView; const c = p.bag.find(x => x.id === id); if (!c) return false; bv.openCard(c); return true; }, want);
    if (!ok) continue;
    await page.waitForTimeout(900); await frames(page, 3);
    const box = await page.evaluate(() => { const c = document.querySelector('.bv-canvas'); if (!c) return null; const r = c.getBoundingClientRect(); return r.width ? { x: r.x, y: r.y, width: r.width, height: r.height } : null; });
    await page.screenshot({ path: `${SP}/club-${want}.png`, ...(box ? { clip: box } : {}) });
    await page.evaluate(() => window.__app.play.hud.bagView.closeCard());
    await page.waitForTimeout(300);
  }
}
