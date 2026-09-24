export default async function (page, SP, logs) {
  await page.evaluate(() => {
    const app = window.__app;
    app.profile.settings.flyover = false;
    app.menus.startSetup('round18');
    app.menus.launch();
  });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => {
    const app = window.__app, p = app.play, r = app.rig;
    return { preview: r.preview, zoom: r.zoom, yaw: r.orbitYaw, pitch: r.orbitPitch, dPos: r.dPos.toArray(), pos: r.pos.toArray(), heading: p.heading, aimDist: p.aimDist, same: r === p.rig };
  });
  logs.push(JSON.stringify(info));
}
