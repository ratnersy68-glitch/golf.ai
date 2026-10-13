import { frames } from './util.js';
// Create Golfer flow: every tab, a few edits, skill points, save.
export default async function (page, SP, logs) {
  await page.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 30000 });
  await page.evaluate(() => { localStorage.clear(); const a = window.__app; a.profile.golfer = null; a.menus.main(); });
  await frames(page, 2);
  await page.click('[data-go="mygolfer"]');
  await page.waitForTimeout(1200); await frames(page, 3);
  await page.screenshot({ path: `${SP}/cr-profile.png` });
  await page.fill('#cr-name', 'Sam Fairway');
  await page.click('[data-set="hand"][data-v="L"]'); await page.waitForTimeout(600);
  for (const [tab, clicks] of [['body', ['[data-set="skin"]:nth-child(7)']], ['face', ['[data-set="facialHair"][data-v="short"]', '[data-set="accessory"][data-v="sunglasses"]']], ['hair', ['[data-set="hair"][data-v="curly"]', '[data-set="hairColor"]:nth-child(2)']], ['clothes', ['[data-set="top"]:nth-child(3)', '[data-set="topColor"]:nth-child(9)', '[data-set="hat"][data-v="hat-none"]']]]) {
    await page.click(`[data-crtab="${tab}"]`);
    for (const c of clicks) { await page.click(c); await page.waitForTimeout(250); }
    await page.waitForTimeout(900); await frames(page, 3);
    await page.screenshot({ path: `${SP}/cr-${tab}.png` });
  }
  await page.click('[data-crtab="skills"]');
  for (let i = 0; i < 12; i++) await page.click('[data-attr="putting"][data-d="1"]');
  for (let i = 0; i < 10; i++) await page.click('[data-attr="distance"][data-d="1"]');
  await page.click('[data-attr="distance"][data-d="-1"]');
  await frames(page, 2); await page.screenshot({ path: `${SP}/cr-skills.png` });
  await page.click('#cr-save'); await page.waitForTimeout(800); await frames(page, 2);
  await page.screenshot({ path: `${SP}/cr-saved.png` });
  logs.push(await page.evaluate(() => { const g = window.__app.profile.golfer; const raw = localStorage.getItem('golfai.profile.v1'); return JSON.stringify({ name: g?.name, hand: g?.hand, pool: g?.pool, attrs: g?.attrs, hair: g?.look.hair, savedName: raw && JSON.parse(raw).golfer?.name }); }));
  await page.click('#cr-back'); await page.waitForTimeout(500); await frames(page, 2);
  await page.screenshot({ path: `${SP}/cr-menu.png` });
}
