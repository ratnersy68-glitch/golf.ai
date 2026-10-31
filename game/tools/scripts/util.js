export async function frames(page, n = 3) {
  const f0 = await page.evaluate(() => window.__app.frames);
  await page.waitForFunction((t) => window.__app.frames >= t, f0 + n, { timeout: 120000, polling: 200 });
}
export async function launch(page, opts = {}) {
  await page.evaluate((o) => {
    const app = window.__app;
    app.profile.settings.flyover = !!o.flyover;
    app.menus.startSetup(o.mode || 'round18');
    Object.assign(app.menus.setup, o.setup || {});
    app.menus.launch();
  }, opts);
  await page.waitForFunction(() => window.__app.play.state === 'aim' || window.__app.play.state === 'flyover', null, { timeout: 120000, polling: 300 });
  await frames(page, 3);
}
export async function swing(page, holdMs = 950, tapDelay = null) {
  // hold space -> release -> tap exactly when marker reaches 0 (computed from game state)
  await page.keyboard.down('Space');
  await page.waitForFunction(() => true);
  // drive meter with virtual time instead of wall-clock for determinism
  await page.evaluate((holdMs) => {
    const p = window.__app.play;
    p.meter.power = Math.min(1, holdMs / 1000 * 0.95);
  }, holdMs);
  await page.keyboard.up('Space');
  await page.evaluate((tapDelay) => {
    const p = window.__app.play;
    if (p.state === 'swing' && p.meter.state === 'down') { p.meter.marker = tapDelay ?? 0; p.swingPress(); }
  }, tapDelay);
}
