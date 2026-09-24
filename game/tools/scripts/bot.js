// Plays a whole round with a simple bot to smoke-test the full game loop.
import { frames } from './util.js';
export default async function (page, SP, logs) {
  const mode = process.env.MODE || 'round18';
  await page.evaluate((mode) => {
    const app = window.__app;
    app.profile.settings.flyover = false;
    app.profile.settings.quality = 'low'; app.world.setQuality('low');
    app.menus.startSetup(mode);
    app.menus.setup.courseId = new URLSearchParams(location.search).get('c') || window.__course || 'augusta';
    app.menus.launch();
  }, mode);
  let lastHole = -1, shots = 0;
  for (let iter = 0; iter < 3000; iter++) {
    const st = await page.evaluate(() => {
      const app = window.__app, p = app.play;
      return { mode: app.mode, state: p.state, hole: p.round?.idx, strokes: p.strokes, modal: app.hud.modalOpen() };
    });
    if (st.mode !== 'play') { logs.push('ROUND OVER'); break; }
    if (st.hole !== lastHole) { lastHole = st.hole; }
    if (st.state === 'aim') {
      const r = await page.evaluate(() => {
        const p = window.__app.play;
        // bot: aim at pin (or keep auto aim), power from meter target tick
        const putt = p.isPutt();
        let power;
        if (putt) power = Math.min(1, (p.distPin * 3 + 1.2) / p.puttScale);
        else {
          const tick = document.querySelector('#meter-target').style.display === 'none' ? 1 : null;
          const carry = p.club.carry;
          power = tick ? 1 : Math.min(1, Math.max(0.15, p.distPin / carry));
        }
        p.swingPress();
        p.meter.power = power;
        p.swingRelease();
        if (p.state === 'swing') { p.meter.marker = (Math.random() - 0.5) * 0.04; p.swingPress(); }
        const s = p.shot;
        return s ? `${p.hole.number}:${p.club.short}:${s.launch.rating}:${Math.round(s.result.total)}:${s.result.surf}${s.result.water ? 'W' : ''}${s.result.ob ? 'OB' : ''}${s.result.holed ? 'IN' : ''}` : 'noshot';
      });
      shots++;
      if (shots < 400) logs.push(r);
      await page.evaluate(() => { const p = window.__app.play; if (p.shot) p.shot.t = p.shot.result.duration + 1; });
      await frames(page, 2);
    } else if (st.state === 'result') {
      await page.evaluate(() => window.__app.play.continueAfterResult());
      await frames(page, 1);
    } else if (st.state === 'holed' && st.modal) {
      const sc = await page.evaluate(() => { const p = window.__app.play; return `HOLE ${p.hole.number} par ${p.hole.par}: ${p.card.strokes} putts ${p.card.putts}`; });
      logs.push(sc);
      await page.evaluate(() => { const f = window.__app.hud.pendingNext; window.__app.hud.pendingNext = null; f && f(); });
      await frames(page, 2);
    } else {
      await frames(page, 1);
    }
  }
  await page.screenshot({ path: `${SP}/bot-final.png` });
}
