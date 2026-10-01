import { frames, launch } from './util.js';
// Chipping drill: screenshot the aim preview and report preview vs pin distance.
export default async function (page, SP) {
  await launch(page, { mode: 'practice', setup: { courseId: 'augusta', hole: 8, practiceKind: 'chipping' } });
  for (let i = 0; i < 2; i++) {
    const info = await page.evaluate(() => { const p = window.__app.play; window.__app.rig.snap(); return { club: p.club.id, type: p.typeId, pin: Math.round(p.distPin), landing: Math.round(p.aimDist), power: +(p.previewPower || 1).toFixed(2) }; });
    console.log(JSON.stringify(info));
    await frames(page, 3);
    await page.screenshot({ path: `${SP}/chip-${i}.png` });
    await page.evaluate(() => window.__app.play.newPracticeSpot());
    await frames(page, 2);
  }
}
