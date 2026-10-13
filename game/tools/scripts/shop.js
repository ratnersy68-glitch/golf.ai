import { frames, launch } from './util.js';
// Golf Coins + Pro Shop: earn coins from a round (paid once), buy + equip items, tamper check, v2 save migration.
export default async function (page, SP, logs) {
  page.setDefaultTimeout(20000);
  const shot = async (n) => { await frames(page, 3); await page.screenshot({ path: `${SP}/shop-${n}.png` }); };
  const state = () => page.evaluate(() => { const p = window.__app.profile; return JSON.stringify({ coins: p.coins, inv: Object.keys(p.inventory), ach: Object.keys(p.achievements), eq: p.equipment, ledger: p.wallet.ledger.length }); });
  await page.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 30000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__app && !document.getElementById('boot'), null, { timeout: 30000 });
  await shot('menu-0');
  logs.push('fresh: ' + await state());

  // a fast 18 on hard: 4 birdies, an eagle, everything else par
  await launch(page, { setup: { difficulty: 'hard' } });
  await page.evaluate(() => {
    const play = window.__app.play;
    play.round.cards.forEach((c, i) => { c.strokes = c.par - (i < 4 ? 1 : i === 4 && c.par === 5 ? 2 : 0); c.putts = 2; });
    play.finishRound();
  });
  await page.waitForTimeout(800); await shot('results');
  logs.push('after round: ' + await state());
  // the same round id again pays nothing
  await page.evaluate(() => { const a = window.__app; a.onRoundComplete(a.play.round, a.play.round.stats, a.play.cfg); });
  logs.push('duplicate round: ' + await state());

  await page.evaluate(() => window.__app.menus.main()); await shot('menu-1');
  await page.click('[data-go="shop"].menu-item'); await page.waitForTimeout(800); await shot('driver');
  for (const [tab, item] of [['wedge', 'al-spin60'], ['accessory', 'hc-ridge'], ['apparel', 'top-fs-8'], ['ball', 'ap-flight']]) {
    await page.click(`[data-tab="${tab}"]`);
    await page.click(`[data-item="${item}"]`); await page.waitForTimeout(500);
    await page.click('#sh-buy'); await page.waitForTimeout(700);
    await shot(`${tab}`);
  }
  logs.push('after buys: ' + await state());
  await page.click('[data-tab="accessory"]'); await page.click('[data-item="bag-ridge"]'); await page.waitForTimeout(700); await shot('bag-locked');

  await page.evaluate(() => window.__app.menus.go('bag')); await page.waitForTimeout(500); await shot('mybag');
  await page.evaluate(() => window.__app.menus.go('mygolfer'));
  await page.waitForTimeout(800);
  await page.fill('#cr-name', 'Sam Fairway');
  await page.click('[data-crtab="clothes"]'); await page.waitForTimeout(1200); await shot('creator-clothes');
  await page.click('#cr-save'); await page.waitForTimeout(800);
  logs.push('after create: ' + await state());

  // tamper: bump the coin total and an entry amount in the saved JSON, reload
  await page.evaluate(() => {
    const k = 'golfai.profile.v1', p = JSON.parse(localStorage.getItem(k));
    p.coins = 999999; p.inventory['vx-x9'] = 1;
    p.wallet.ledger[p.wallet.ledger.length - 1].amt = 50000;
    localStorage.setItem(k, JSON.stringify(p));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__app && !document.getElementById('boot'), null, { timeout: 30000 });
  logs.push('after tamper: ' + await state());

  // a v2 save (before the shop) keeps its X9s (now the driver) and the clothes it was wearing
  await page.evaluate(() => {
    const k = 'golfai.profile.v1', p = JSON.parse(localStorage.getItem(k));
    delete p.wallet; delete p.coins; delete p.inventory;
    p.version = 2; p.equipment = { wood: 'vx-x9', wedge: 'al-spin', ball: 'ap-tour', iron: 'al-f7', hybrid: 'vx-origin-h', putter: 'nl-arc' };
    p.look.outfit.hat = { id: 'hat-fs-13', color: '#1c2a44', pattern: 'plaid' };
    localStorage.setItem(k, JSON.stringify(p));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__app && !document.getElementById('boot'), null, { timeout: 30000 });
  logs.push('v2 migrated: ' + await state());
  await page.evaluate(() => window.__app.menus.main()); await shot('menu-2');
}
