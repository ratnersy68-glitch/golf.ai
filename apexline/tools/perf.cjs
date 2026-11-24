/* Performance profiling harness (Chromium via Playwright). Usage: node tools/perf.cjs <label> [url]
   Measures, per track and graphics preset: world build time, enter time, restart time, draw calls, triangles, geometries/textures,
   JS time per frame (simulation + render submission, independent of the GPU), JS heap, and extended-session leak growth.
   NOTE: headless CI has no GPU (software rasteriser), so wall-clock FPS here is NOT representative; the JS/CPU-side numbers, draw calls and
   triangles are. Results are written to docs/perf-<label>.json */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const label = process.argv[2] || 'run'; const URL = process.argv[3] || 'http://localhost:5173/';
const TRACKS = (process.env.TRACKS || '1,60,105,185,262').split(',').map(Number); const PRESETS = (process.env.PRESETS || 'high,low').split(',');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-precise-memory-info', '--js-flags=--expose-gc'] });
  const page = await (await b.newContext({ viewport: { width: 960, height: 540 } })).newPage(); const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await page.goto(URL); await page.waitForFunction(() => window.__apx && window.__apx.useStore.getState().ready && document.querySelector('.menu'), null, { timeout: 90000 }); await page.waitForTimeout(1500);
  const out = { label, at: new Date().toISOString(), results: [], leak: null };
  for (const preset of PRESETS) for (const tid of TRACKS) {
    await page.evaluate(([p]) => { const s = window.__apx.useStore.getState(); s.applyPreset(p); s.patchSettings(x => { x.ghost = false; }); s.go('menu'); }, [preset]);
    await page.waitForTimeout(400);
    const t0 = Date.now();
    await page.evaluate(([tid]) => window.__apx.useStore.getState().startRace({ mode: 'timetrial', trackId: tid, practice: true }), [tid]);
    await page.waitForFunction(() => window.__apx.race && window.__apx.race.sim && window.__apx.race.running, null, { timeout: 120000 }); const loadMs = Date.now() - t0;
    await page.evaluate(async tid => { const r = await (await fetch(`./data/replays/${String(tid).padStart(3, '0')}.json`)).json(); const log = window.__apx.unpackReplay(r.bench); window.__apx.race.inputOverride = t => t < log.length ? log.at(t) : { steer: 0, thr: 0, brk: 100, hb: 0 }; }, tid);
    await page.waitForFunction(() => window.__apx.race.phase === 'racing' && window.__apx.race.sim.tick > 360, null, { timeout: 160000 });
    // sample ~120 frames of steady racing
    const f0 = await page.evaluate(() => window.__apx.perf.frames); await page.waitForFunction(f => window.__apx.perf.frames > f + 90, f0, { timeout: 160000 });
    const m = await page.evaluate(() => ({ ...window.__apx.perf }));
    // restart latency (sync part) measured 5 times
    const rs = await page.evaluate(() => { const r = window.__apx.race; const a = []; for (let i = 0; i < 5; i++) { r.restart(false); a.push(window.__apx.perf.restartMs); } return a; });
    out.results.push({ preset, track: tid, loadMs, worldBuildMs: +m.worldBuildMs.toFixed(1), enterMs: +m.enterMs.toFixed(1), restartMs: +(rs.reduce((x, y) => x + y, 0) / rs.length).toFixed(2), drawCalls: m.calls, triangles: m.tris, geometries: m.geos, textures: m.textures, jsFrameMs: +m.jsMs.toFixed(2), simMs: +m.simMs.toFixed(3), renderSubmitMs: +m.renderMs.toFixed(2), heapMB: +m.heapMB.toFixed(1), chunks: `${m.chunksVisible}/${m.chunksTotal}`, resScale: +m.resScale.toFixed(2) });
    console.log(JSON.stringify(out.results[out.results.length - 1]));
  }
  // leak test: 30 restarts + 12 track switches, then compare geometries/textures/heap
  await page.evaluate(() => { const s = window.__apx.useStore.getState(); s.applyPreset('medium'); s.go('menu'); });
  const sample = () => page.evaluate(async () => { if (window.gc) window.gc(); await new Promise(r => setTimeout(r, 300)); const r = window.__apx.race; const i = r.gfx.renderer.info; return { geos: i.memory.geometries, tex: i.memory.textures, heap: (performance.memory || {}).usedJSHeapSize / 1048576 || 0, sceneChildren: r.gfx.scene.children.length }; });
  await page.evaluate(() => window.__apx.useStore.getState().startRace({ mode: 'timetrial', trackId: 30, practice: true })); await page.waitForFunction(() => window.__apx.race && window.__apx.race.running, null, { timeout: 90000 }); await page.waitForTimeout(1500);
  const a = await sample();
  for (let k = 0; k < 30; k++) await page.evaluate(() => window.__apx.race.restart(false));
  for (const tid of [5, 60, 100, 140, 180, 220, 260, 30, 75, 120, 190, 30]) { await page.evaluate(() => window.__apx.useStore.getState().go('menu')); await page.waitForTimeout(250); await page.evaluate(t => window.__apx.useStore.getState().startRace({ mode: 'timetrial', trackId: t, practice: true }), tid); await page.waitForFunction(() => window.__apx.race && window.__apx.race.running, null, { timeout: 90000 }); await page.waitForTimeout(400); }
  await page.waitForTimeout(1500); const c = await sample();
  out.leak = { before: a, after: c, geometriesGrowth: c.geos - a.geos, texturesGrowth: c.tex - a.tex, heapGrowthMB: +(c.heap - a.heap).toFixed(1), sceneChildrenGrowth: c.sceneChildren - a.sceneChildren };
  console.log('leak', JSON.stringify(out.leak)); out.errors = errs; fs.writeFileSync(path.join(__dirname, '..', 'docs', `perf-${label}.json`), JSON.stringify(out, null, 1)); await b.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(2); });
