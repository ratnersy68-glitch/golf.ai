import { frames, launch } from './util.js';
const OUT = new URL('../../docs/', import.meta.url).pathname;
export default async function (page, SP, logs) {
  await launch(page, { mode: 'practice', setup: { courseId: process.env.C || 'pebble', hole: +(process.env.H || 17), practiceKind: 'putting' } });
  await page.evaluate(() => window.__app.rig.snap());
  await frames(page, 2);
  await page.screenshot({ path: `${OUT}${process.env.NAME || 'putting'}.jpg`, type: 'jpeg', quality: 78 });
}
