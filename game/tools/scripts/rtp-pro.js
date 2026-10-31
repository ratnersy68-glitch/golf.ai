// Road to Pro, pro stage: loads a Crown Tour career (made by FIXTURE=... node tools/test-career.js) and checks hub tabs, a simulated event and a major round.
import { frames } from './util.js';
import { readFileSync } from 'node:fs';
export default async function (page, SP, logs) {
  page.setDefaultTimeout(30000);
  const fx = JSON.parse(readFileSync(new URL('./rtp-pro-fixture.json', import.meta.url)));
  const tag = `${page.viewportSize().width}x${page.viewportSize().height}`;
  const shot = async (n) => { await page.waitForTimeout(400); await frames(page, 2); await page.screenshot({ path: `${SP}/pro-${tag}-${n}.png` }); };
  await page.waitForFunction(() => window.__app && !document.getElementById('boot'), null, { timeout: 30000 });
  await page.evaluate((fx) => { const a = window.__app; a.profile.golfer = fx.golfer; a.profile.rtp = fx.rtp; a.profile.settings.flyover = false; a.save(); a.menus.main(); }, fx);
  await shot('menu');
  await page.evaluate(() => window.__app.menus.go('rtp')); await shot('hub');
  await page.evaluate(() => window.__app.menus.rtp.action('tab', 'sponsors')); await shot('sponsors');
  await page.evaluate(() => window.__app.menus.rtp.action('tab', 'trophies')); await shot('trophies');
  await page.evaluate(() => window.__app.menus.rtp.action('tab', 'history')); await shot('history');
  await page.evaluate(() => window.__app.menus.rtp.action('tab', 'schedule'));
  // first event (regular) simulate, then the major: play round 1
  await page.click('[data-rtp="sim"]'); await page.waitForSelector('[data-rtp="sim"], [data-rtp="continue"]'); await shot('sim-r1');
  await page.click('[data-rtp="sim"]'); await page.waitForSelector('[data-rtp="continue"]'); await shot('sim-final');
  await page.click('[data-rtp="continue"]'); await shot('hub-major');
  await page.click('[data-rtp="play"]');
  await page.waitForFunction(() => ['aim', 'flyover'].includes(window.__app.play.state), null, { timeout: 120000, polling: 300 });
  await shot('major-play');
  await page.evaluate(() => { const play = window.__app.play; play.round.cards.forEach((c, i) => { c.strokes = c.par - (i % 6 === 0 ? 1 : 0); c.putts = 2; }); play.finishRound(); });
  await page.waitForSelector('[data-rtp="play"]'); await shot('major-r1');
  logs.push('pro ok ' + await page.evaluate(() => JSON.stringify(window.__app.profile.rtp.season.events.slice(0, 2).map(e => [e.name, e.status, e.player.rounds.length]))));
}
