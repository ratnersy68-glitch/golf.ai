import { frames } from './util.js';
export default async function (page, SP, logs) {
  const shot = async (name) => { await frames(page, 2); await page.screenshot({ path: `${SP}/m-${name}.png` }); };
  await shot('main');
  await page.evaluate(() => window.__app.menus.go('golfer')); await frames(page, 3); await shot('golfer');
  await page.evaluate(() => window.__app.menus.go('career')); await shot('career');
  await page.evaluate(() => window.__app.menus.go('bag')); await shot('bag');
  await page.evaluate(() => window.__app.menus.go('settings')); await shot('settings');
  await page.evaluate(() => window.__app.menus.go('round18')); await shot('setup-golfer');
  await page.evaluate(() => { const m = window.__app.menus; m.setup.step = 1; m.renderSetup(); });
  await page.waitForFunction(() => Object.keys(window.__app.thumbs).length >= 10, null, { timeout: 600000, polling: 1000 });
  await page.evaluate(() => { const m = window.__app.menus; m.renderSetup(); });
  await shot('setup-course');
  await page.evaluate(() => { const m = window.__app.menus; m.setup.step = 2; m.renderSetup(); }); await shot('setup-options');
  await page.evaluate(() => {
    const app = window.__app;
    const st = { holes: 18, strokes: 74, par: 72, toPar: 2, putts: 31, fairways: 9, fairwayChances: 14, gir: 11, girChances: 18, drives: 14, driveSum: 3780, longestDrive: 301, longestPutt: 32, aces: 0, albatross: 0, eagles: 1, birdies: 3, pars: 9, bogeys: 4, doubles: 1, worse: 0, sandSaves: 1, sandChances: 3, upDowns: 3, upDownChances: 6, penalties: 1 };
    app.menus.results({ courseId: 'augusta', golferName: 'You' }, st, { xp: 640, levelUps: [2], from: 1, to: 2 }, { mode: 'round18' }, '<div class="dim">(scorecard)</div>');
  });
  await shot('results');
}
