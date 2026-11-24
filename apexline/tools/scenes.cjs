/* Captures an in-race screenshot per chapter (benchmark inputs drive the car). node tools/scenes.cjs [ids...] */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const URL = 'http://localhost:5173/'; const OUT = path.join(__dirname, '..', 'docs', 'screenshots'); fs.mkdirSync(OUT, { recursive: true });
const ids = process.argv.slice(2).map(Number); const list = ids.length ? ids : [6, 30, 60, 90, 105, 130, 160, 185, 210, 235, 262];
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await (await b.newContext({ viewport: { width: 960, height: 540 } })).newPage(); const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error' && !/GPU stall|Failed to load/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await page.goto(URL); await page.waitForFunction(() => window.__apx && window.__apx.useStore.getState().ready); await page.waitForTimeout(2000);
  await page.evaluate(() => { const s = window.__apx.useStore.getState(); s.applyPreset('medium'); s.patchSettings(x => { x.ghost = false; x.hud.minimap = true; }); });
  for (const id of list) {
    await page.evaluate(i => { window.__apx.race = null; window.__apx.useStore.getState().go('menu'); window.__apx.useStore.getState().startRace({ mode: 'timetrial', trackId: i, practice: true }); }, id);
    await page.waitForFunction(() => window.__apx.race && window.__apx.race.sim, null, { timeout: 30000 });
    await page.evaluate(async i => { const r = await (await fetch(`/data/replays/${String(i).padStart(3, '0')}.json`)).json(); const log = window.__apx.unpackReplay(r.bench); window.__apx.race.inputOverride = t => t < log.length ? log.at(t) : { steer: 0, thr: 0, brk: 100, hb: 0 }; }, id);
    await page.waitForFunction(() => window.__apx.race.phase === 'racing' && window.__apx.race.sim.tick > 360, null, { timeout: 90000 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `scene-${String(id).padStart(3, '0')}.png`) }); console.log('shot', id);
  }
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no errors'); await b.close();
})();
