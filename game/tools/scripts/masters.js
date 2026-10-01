import { frames } from './util.js';
// Walks a Masters tournament: hub, round 1 in play (ticker), fast-forwarded rounds, cut, ceremony.
export default async function (page, SP) {
  const shot = async (n) => { await page.waitForTimeout(700); await frames(page, 2); await page.screenshot({ path: `${SP}/masters-${n}.png` }); };
  await page.evaluate(() => window.__app.menus.go('masters'));
  await shot('hub');
  await page.$eval('#m-start', b => b.click());
  await page.waitForFunction(() => window.__app.play.state === 'aim' || window.__app.play.state === 'flyover', null, { timeout: 120000 });
  await page.evaluate(() => { const p = window.__app.play; if (p.state === 'flyover') p.endFlyover(); });
  // pretend we birdied the first hole
  await page.evaluate(() => { const p = window.__app.play; p.strokes = p.hole.par - 1; p.holeOut(3, true); });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.__app.rig.snap());
  await shot('ticker');
  // finish the rest of each round quickly with a hot score (-1 on every par 5, -1 on 2 others)
  const finish = (score) => page.evaluate((score) => {
    const p = window.__app.play;
    p.round.cards.forEach((c, i) => { if (c.strokes == null) c.strokes = c.par + (score[i] ?? 0); });
    p.finishRound();
  }, score);
  const hot = [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, -1, -1, 0, 0];
  await finish(hot);
  await shot('after1');
  for (let r = 2; r <= 4; r++) {
    await page.$eval('#m-next', b => b.click());
    await page.waitForFunction(() => window.__app.play.state === 'aim' || window.__app.play.state === 'flyover', null, { timeout: 120000 });
    await finish(hot);
    await shot(`after${r}`);
  }
  console.log(await page.evaluate(() => JSON.stringify(window.__app.profile.masters.result)), 'wins', await page.evaluate(() => window.__app.profile.mastersWins));
}
