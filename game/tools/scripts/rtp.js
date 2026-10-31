import { frames, launch } from './util.js';
// Road to Pro flow: create golfer, pick school, play the tryout for real, simulate/play through four
// high-school seasons to the college offers, accept one, play into college.
export default async function (page, SP, logs) {
  page.setDefaultTimeout(30000);
  const tag = `${page.viewportSize().width}x${page.viewportSize().height}`;
  const shot = async (n) => { await page.waitForTimeout(400); await frames(page, 2); await page.screenshot({ path: `${SP}/rtp-${tag}-${n}.png` }); };
  await page.waitForFunction(() => window.__app && !document.getElementById('boot'), null, { timeout: 30000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__app && !document.getElementById('boot'), null, { timeout: 30000 });
  await page.evaluate(() => { const a = window.__app; a.profile.settings.flyover = false; a.menus.main(); });
  await shot('menu');
  await page.click('[data-go="rtp"]'); await shot('need-golfer');
  await page.evaluate(() => { const a = window.__app; a.menus.go('mygolfer'); });
  await page.waitForTimeout(800);
  await page.fill('#cr-name', 'Sam Fairway'); await page.click('#cr-save'); await page.waitForTimeout(600);
  await page.evaluate(() => window.__app.menus.go('rtp'));
  await page.click('[data-rtp="school"][data-v="HS-03"]'); await shot('schools');
  await page.click('[data-rtp="start"]'); await shot('hub');
  // play events: critical ones via a real (fast-forwarded) round, the rest simulated
  let guard = 0, offersSeen = false, collegeEvents = 0;
  while (guard++ < 80) {
    const st = await page.evaluate(() => { const c = window.__app.profile.rtp; const e = c.season?.events[c.season.idx]; return { pending: c.pending?.type || null, stage: c.stage, critical: !!e?.critical, kind: e?.kind }; });
    if (st.pending === 'offers') { offersSeen = true; await shot('offers'); await page.click('[data-rtp="resolve"]'); await shot('college-hub'); continue; }
    if (st.pending) { if (guard < 12) await shot(`decision-${guard}`); await page.click('[data-rtp="resolve"]'); continue; }
    if (st.stage === 'college' && ++collegeEvents > 2) break;
    if (st.critical || st.kind === 'col') {
      await page.click('[data-rtp="play"]');
      await page.waitForFunction(() => ['aim', 'flyover'].includes(window.__app.play.state), null, { timeout: 120000, polling: 300 });
      if (guard < 3) await shot('playing');
      await page.evaluate(() => { const play = window.__app.play; play.round.cards.forEach((c, i) => { c.strokes = c.par + (i % 5 === 0 ? -1 : i % 4 === 0 ? 1 : 0); c.putts = 2; }); play.finishRound(); });
      await page.waitForSelector('[data-rtp="continue"], [data-rtp="play"]');
      if (guard < 3 || st.kind === 'col') await shot(`after-${st.kind}`);
    } else {
      await page.click('[data-rtp="sim"]');
      await page.waitForSelector('[data-rtp="continue"], [data-rtp="sim"]');
      if (guard < 4) await shot(`sim-${guard}`);
    }
    const btn = await page.$('[data-rtp="continue"]');
    if (btn) await btn.click(); else await page.click('[data-rtp="hub"]');
  }
  await page.evaluate(() => window.__app.menus.rtp.action('tab', 'trophies')); await shot('trophies');
  await page.evaluate(() => window.__app.menus.rtp.action('tab', 'history')); await shot('history');
  logs.push(`${tag} rtp: ` + await page.evaluate(() => { const p = window.__app.profile, c = p.rtp; return JSON.stringify({ stage: c.stage, uni: c.uni, year: c.year, events: c.stats.events, wins: c.stats.wins, coins: p.coins, interest: c.interest, trophies: c.trophies.length }); }) + ` offersSeen=${offersSeen}`);
}
