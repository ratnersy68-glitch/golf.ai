import { frames } from './util.js';
// Pros-only flow: main menu, golfer step of a quick round, Masters with a chosen pro.
export default async function (page, SP) {
  const shot = async (n) => { await page.waitForTimeout(600); await frames(page, 2); await page.screenshot({ path: `${SP}/pros-${n}.png` }); };
  await shot('main');
  await page.evaluate(() => window.__app.menus.go('round18'));
  await shot('setup');
  await page.evaluate(() => window.__app.menus.go('masters'));
  await page.$eval('[data-mpro="mcilroy"]', b => b.click());
  await shot('masters');
  await page.$eval('#m-start', b => b.click());
  await page.waitForFunction(() => ['aim', 'flyover'].includes(window.__app.play.state), null, { timeout: 120000 });
  console.log(await page.evaluate(() => JSON.stringify({ name: window.__app.play.golferName, inField: window.__app.profile.masters.field.some(f => f.name === 'Rory McIlroy'), attrs: window.__app.play.attrs })));
}
