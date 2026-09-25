import { frames } from './util.js';
// Walks through the locker room tabs, opens an item detail and equips it.
export default async function (page, SP) {
  await page.evaluate(() => { window.__app.world.setQuality(process?.env ? 'high' : 'high'); }).catch(() => {});
  await page.evaluate(() => { window.__app.profile.level = +(process.env.LVL || 1); }).catch(() => {});
  await page.evaluate((lvl) => { window.__app.profile.level = lvl; window.__app.menus.go('golfer'); }, +(process.env.LVL || 1));
  await frames(page, 4);
  const shot = async (n) => { await page.waitForTimeout(700); await frames(page, 2); await page.screenshot({ path: `${SP}/locker-${n}.png` }); };
  const tabs = (process.env.TABS || 'top,face').split(',');
  for (const t of tabs) {
    await page.click(`[data-tab="${t}"]`);
    await page.evaluate(() => window.__app.rig.snap());
    await shot(t);
  }
  if (process.env.DETAIL) {
    await page.click(`[data-tab="top"]`);
    await page.click('[data-item="top-pm-3"]');
    await page.waitForTimeout(400);
    await page.click('[data-opt="color"][data-val="#6e1a2a"]');
    await page.evaluate(() => window.__app.rig.snap());
    await shot('detail');
    await page.click('#lkd-equip');
    await shot('equipped');
    await page.click('[data-tab="outfits"]');
    await page.fill('#lk-oname', 'Burgundy Sweater');
    await page.click('#lk-osave');
    await shot('outfits');
  }
}
