import { frames } from './util.js';
// Renders the locker-room golfer with a few looks/camera focuses.
export default async function (page, SP) {
  await page.evaluate(() => { const a = window.__app; a.world.setQuality('high'); a.menus.show(false); });
  const looks = JSON.parse(process.env.LOOKS || '[{}]');
  const focuses = (process.env.FOCUS || 'full,head').split(',');
  let i = 0;
  for (const patch of looks) {
    for (const f of focuses) {
      await page.evaluate(([patch, f, yaw]) => {
        const a = window.__app;
        const L = JSON.parse(JSON.stringify(a.profile.look));
        const deep = (o, p) => { for (const k in p) { if (p[k] && typeof p[k] === 'object' && !Array.isArray(p[k])) { o[k] = o[k] || {}; deep(o[k], p[k]); } else o[k] = p[k]; } };
        deep(L, patch);
        a.golferPreview(L, { focus: f, yaw });
        a.rig.snap();
        a.previewGolfer.build(L);
      }, [patch, f, +(process.env.YAW || 0.35)]);
      await frames(page, 3);
      await page.screenshot({ path: `${SP}/golfer-${i}-${f}.png` });
    }
    i++;
  }
}
