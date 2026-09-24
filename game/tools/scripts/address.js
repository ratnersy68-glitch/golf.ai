export default async function (page, SP, logs) {
  await page.evaluate(() => {
    const app = window.__app;
    app.profile.settings.flyover = false;
    app.menus.startSetup('round18');
    app.menus.setup.courseId = new URLSearchParams(location.search).get('c') || 'augusta';
    app.menus.launch();
  });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => {
    const app = window.__app, p = app.play, c = app.world.camera;
    return { state: p.state, cam: c.position.toArray().map(v => +v.toFixed(1)), ball: p.ball, rigMode: app.rig.mode, look: app.rig.look.toArray(), golfer: app.play.golfer.root.position.toArray(), terrainVis: app.world.terrain?.visible };
  });
  logs.push(JSON.stringify(info));
  await page.screenshot({ path: `${SP}/d-address.png` });
}
