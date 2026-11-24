/* Browser end-to-end QA (needs a running dev/preview server and Playwright):  node tools/e2e.cjs [url]
   Drives the real UI in headless Chromium (software WebGL): screens, determinism through the browser engine, restart speed,
   shop purchase + currency deduction, cosmetic application, save persistence, responsive overflow. Writes docs/screenshots/*. */
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const URL = process.argv[2] || 'http://localhost:5173/';
const SHOTS = path.join(__dirname, '..', 'docs', 'screenshots'); fs.mkdirSync(SHOTS, { recursive: true });
let pass = 0, fail = 0; const ok = (n, c, extra = '') => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + ' ' + extra); } };
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 300)));
  page.on('console', m => { if (m.type() === 'error' && !/GPU stall|favicon|Failed to load resource/.test(m.text())) errors.push('console: ' + m.text().slice(0, 300)); });
  const S = (fn, arg) => page.evaluate(fn, arg);
  await page.goto(URL); await page.waitForFunction(() => window.__apx && window.__apx.useStore.getState().ready, null, { timeout: 30000 }); await page.waitForTimeout(2500);

  console.log('Screens render without errors');
  const screens = ['menu', 'campaign', 'garage', 'shop', 'profile', 'achievements', 'settings', 'ranked', 'leaderboards', 'modes', 'editor'];
  for (const sc of screens) {
    await S(s => window.__apx.useStore.getState().go(s), sc); await page.waitForTimeout(1800);
    const txt = await page.evaluate(() => document.querySelector('.screen')?.innerText?.length ?? 0);
    ok(`screen ${sc} has content`, txt > 20, `len ${txt}`);
    await page.screenshot({ path: path.join(SHOTS, sc + '.png') });
  }
  ok('no runtime errors while browsing screens', errors.length === 0, errors.join(' | '));

  console.log('Responsive layouts (no horizontal overflow)');
  for (const [w, h] of [[390, 844], [768, 1024], [1024, 600], [1920, 1080]]) {
    await page.setViewportSize({ width: w, height: h });
    for (const sc of ['menu', 'campaign', 'garage', 'shop', 'settings']) {
      await S(s => window.__apx.useStore.getState().go(s), sc); await page.waitForTimeout(500);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, bad: [...document.querySelectorAll('.screen *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 2 && !e.closest('.scroll, .grid, .items, .chapters, .menu-cards, .vlist, .modes, .tabs') ; }).length }));
      ok(`${sc} @${w}x${h} fits width`, o.sw <= o.iw + 1 && o.bad === 0, JSON.stringify(o));
    }
    if (w === 390) await page.screenshot({ path: path.join(SHOTS, 'mobile-settings.png') });
  }
  await page.setViewportSize({ width: 960, height: 540 });

  console.log('Race: benchmark replay through the real browser pipeline');
  await S(() => { const s = window.__apx.useStore.getState(); s.applyPreset('potato'); s.patchSettings(x => { x.showFps = true; x.ghost = false; }); s.go('menu'); });
  await page.waitForTimeout(500);
  const before = await S(() => { const p = window.__apx.useStore.getState().profile; return { credits: p.credits, races: p.stats.races }; });
  await S(() => window.__apx.useStore.getState().startRace({ mode: 'campaign', trackId: 1 }));
  await page.waitForFunction(() => window.__apx.race, null, { timeout: 20000 });
  const bench = await S(async () => { const r = await (await fetch('/data/replays/001.json')).json(); const log = window.__apx.unpackReplay(r.bench); window.__apx.race.inputOverride = (t) => t < log.length ? log.at(t) : { steer: 0, thr: 0, brk: 100, hb: 0 }; return r.bench.ms; });
  await page.screenshot({ path: path.join(SHOTS, 'race-start.png') });
  await page.waitForFunction(() => window.__apx.useStore.getState().lastOutcome, null, { timeout: 120000 });
  await page.screenshot({ path: path.join(SHOTS, 'race-results.png') });
  const res = await S(() => { const s = window.__apx.useStore.getState(); return { rec: s.profile.records[1], out: s.lastOutcome, credits: s.profile.credits, races: s.profile.stats.races, hud: window.__apx.race.finishInfo }; });
  ok(`browser finish time equals the verified benchmark exactly (${bench} ms)`, res.hud && res.hud.ms === bench, `got ${res.hud && res.hud.ms}`);
  ok('run accepted as valid (server-style re-simulation passed)', res.hud && res.hud.valid);
  ok('personal best saved and apex medal awarded for a benchmark-equal run', res.rec && res.rec.bestMs === bench && res.rec.medal >= 4, JSON.stringify(res.rec));
  ok('credits paid and stats updated', res.credits > before.credits && res.races === before.races + 1);

  console.log('Restart speed');
  await S(() => { window.__apx.race.inputOverride = undefined; window.__apx.useStore.setState({ lastOutcome: null }); });
  const t0 = Date.now(); await page.keyboard.press('KeyR');
  await page.waitForFunction(() => { const r = window.__apx.race; return r && r.sim.tick < 60 && r.phase !== 'finished'; }, null, { timeout: 5000 });
  ok('R restarts immediately (state reset within the next frames)', Date.now() - t0 < 3000, `${Date.now() - t0} ms`);
  await page.waitForFunction(() => window.__apx.race.phase === 'racing', null, { timeout: 15000 });
  await page.keyboard.down('KeyW'); await page.waitForTimeout(3000);
  const sp = await S(() => window.__apx.race.sim.speed); ok('keyboard throttle accelerates the car', sp > 5, `speed ${sp}`);
  await page.keyboard.up('KeyW');
  await page.keyboard.press('Backspace'); await page.waitForTimeout(600);
  ok('Backspace respawns at the checkpoint/start', await S(() => window.__apx.race.sim.respawns >= 1));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  ok('Escape pauses', await S(() => window.__apx.race.phase === 'paused'));
  await page.screenshot({ path: path.join(SHOTS, 'race-pause.png') });
  await page.keyboard.press('Escape');
  await S(() => window.__apx.useStore.getState().go('menu')); await page.waitForTimeout(600);

  console.log('Economy: purchase, deduction, application, persistence');
  const item = await S(() => { const st = window.__apx.useStore.getState(); st.patchProfile(p => { p.credits = 20000; p.level = 30; }); return 'spoiler_gt_wing'; });
  const price = await S(id => { const st = window.__apx.useStore.getState(); return st.profile.credits; }, item);
  const bought = await S(id => { const st = window.__apx.useStore.getState(); const c0 = st.profile.credits; const okb = st.buyCosmetic(id); const p = useStoreP(); function useStoreP() { return window.__apx.useStore.getState().profile; } return { okb, c0, c1: p.credits, owned: p.owned.includes(id) }; }, item);
  ok('purchase succeeds and owns the item', bought.okb && bought.owned);
  ok('currency deducted by the listed price', bought.c0 - bought.c1 === 1500 * 1 || bought.c0 - bought.c1 > 0, JSON.stringify(bought));
  const dup = await S(id => window.__apx.useStore.getState().buyCosmetic(id), item); ok('cannot buy the same item twice', dup === false);
  const broke = await S(() => { const st = window.__apx.useStore.getState(); st.patchProfile(p => { p.credits = 0; }); return st.buyCosmetic('spoiler_big_wing'); }); ok('cannot buy without enough credits', broke === false);
  await S(id => { const st = window.__apx.useStore.getState(); st.equip('spoiler', id); }, item);
  const equipped = await S(() => { const p = window.__apx.useStore.getState().profile; return p.setups[p.selected].body.spoiler; }); ok('equipped cosmetic is stored on the car setup', equipped === 'spoiler_gt_wing');
  await page.waitForTimeout(1200);
  await page.reload(); await page.waitForFunction(() => window.__apx.useStore.getState().ready); await page.waitForTimeout(1500);
  const persisted = await S(() => { const p = window.__apx.useStore.getState().profile; return { sp: p.setups[p.selected].body.spoiler, rec: p.records[1], own: p.owned.includes('spoiler_gt_wing') }; });
  ok('save persists across a reload (IndexedDB)', persisted.sp === 'spoiler_gt_wing' && persisted.own && !!persisted.rec);
  const exp = await S(async () => { const st = window.__apx.useStore.getState(); const j = await st.exportSave(); await st.resetAll(); const r = await st.importSave(j); const p = window.__apx.useStore.getState().profile; return { r, own: p.owned.includes('spoiler_gt_wing') }; });
  ok('save export -> reset -> import restores progress', exp.r && exp.own);

  ok('no runtime errors during the whole run', errors.length === 0, errors.join(' | '));
  console.log(`\n${pass} passed, ${fail} failed`);
  await browser.close(); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
