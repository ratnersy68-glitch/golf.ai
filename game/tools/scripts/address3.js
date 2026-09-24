export default async function (page, SP, logs) {
  await page.evaluate(() => {
    const app = window.__app;
    app.profile.settings.flyover = false;
    app.menus.startSetup('round18');
    app.menus.launch();
  });
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(700);
    const info = await page.evaluate(() => {
      const app = window.__app, p = app.play, r = app.rig;
      return { t: performance.now() | 0, st: p.state, mode: r.mode, pos: r.pos.toArray().map(v => v | 0), cam: app.world.camera.position.toArray().map(v => v | 0), appMode: app.mode };
    });
    logs.push(JSON.stringify(info));
  }
  await page.screenshot({ path: `${SP}/d-address.png` });
}
