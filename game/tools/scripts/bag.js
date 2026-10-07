import { frames, launch } from './util.js';
// Opens the bag view in a round, browses, opens the info card, selects a club.
export default async function (page, SP, logs) {
  await launch(page, { mode: 'round18', setup: { courseId: process.env.COURSE || 'augusta', hole: 0 } });
  const shot = async (n, snap = true) => { if (snap) await page.evaluate(() => window.__app.rig.snap()); await page.waitForTimeout(600); await frames(page, 3); await page.screenshot({ path: `${SP}/bag-${n}.png` }); };
  const tap = async (sel) => { if (process.env.MOBILE) await page.tap(sel); else await page.click(sel); };
  if (process.env.MOBILE) await tap('.mclub'); else await page.keyboard.press('b');
  await shot('open');
  for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(250); }
  await shot('browse');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  await shot('card');
  await tap('#bv-select');
  await page.waitForTimeout(1200);
  await shot('selected', false);
  console.log('club now', await page.evaluate(() => window.__app.play.club.id), 'state', await page.evaluate(() => window.__app.play.state));
}
