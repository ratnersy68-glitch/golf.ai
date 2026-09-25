import { frames, launch } from './util.js';
// Checks the ☰ button in every common state: aim, bag view, flyover, and toggling closed.
export default async function (page) {
  await launch(page, { mode: 'round18', flyover: true, setup: { courseId: 'augusta' } });
  const st = () => page.evaluate(() => ({ state: window.__app.play.state, pause: window.__app.hud.pauseOpen() }));
  const tap = () => (process.env.MOBILE ? page.tap('#btn-pause') : page.click('#btn-pause'));
  console.log('start', await st());
  await tap(); console.log('flyover -> tap', await st());
  await tap(); console.log('tap again (close)', await st());
  await page.evaluate(() => window.__app.play.openBag());
  await tap(); console.log('bag -> tap', await st());
  await page.evaluate(() => { const a = window.__app; const o = a.quitToMenu.bind(a); a.quitToMenu = () => { console.log('QUIT CALLED'); try { o(); } catch (e) { console.log('QUIT ERR', e.message, e.stack); } }; });
  await page.click('#pm-quit'); console.log('armed text', await page.textContent('#pm-quit')); await page.click('#pm-quit'); await page.waitForTimeout(500);
  console.log('quit twice ->', await page.evaluate(() => [window.__app.mode, document.getElementById('menu').classList.contains('visible'), window.__app.play.state]));
}
