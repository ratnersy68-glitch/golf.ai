import { frames, launch } from './util.js';
// Checks the ☰ button / Esc in common states and that QUIT really leaves the round.
export default async function (page) {
  await launch(page, { mode: 'round18', flyover: true, setup: { courseId: process.env.COURSE || 'augusta' } });
  const st = () => page.evaluate(() => ({ state: window.__app.play.state, pause: window.__app.hud.pauseOpen() }));
  const tap = () => (process.env.MOBILE ? page.tap('#btn-pause') : page.click('#btn-pause'));
  console.log('start', await st());
  await tap(); console.log('flyover -> ☰', await st());
  await page.keyboard.press('Escape'); console.log('Esc closes', await st());
  await page.evaluate(() => window.__app.play.openBag());
  await tap(); console.log('bag -> ☰', await st());
  await page.click('#pm-quit');
  console.log('confirm shown', await page.isVisible('#pm-leave'));
  await page.click('#pm-leave');
  await page.waitForTimeout(800);
  console.log('after quit', await page.evaluate(() => [window.__app.mode, document.getElementById('menu').classList.contains('visible'), window.__app.play.state]));
}
