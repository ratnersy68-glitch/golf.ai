import { frames, launch } from './util.js';
// Layout audit: visit every screen and report anything that spills outside the viewport.
// VW/VH/MOBILE pick the device; screenshots go to SP as fit-<w>x<h>-<screen>.png.
export default async function (page, SP, logs) {
  const tag = `${page.viewportSize().width}x${page.viewportSize().height}`;
  await page.waitForFunction(() => window.__app && !document.getElementById('boot'), null, { timeout: 30000 });
  const audit = async (name) => {
    await page.waitForTimeout(500); await frames(page, 2);
    const bad = await page.evaluate(() => {
      const vw = innerWidth, vh = innerHeight, out = [];
      const scrollsX = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if ((s.overflowX === 'auto' || s.overflowX === 'scroll') && p !== document.body && p !== document.documentElement) return true; } return false; };
      const scrollsY = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && p.scrollHeight > p.clientHeight) return true; } return false; };
      for (const el of document.querySelectorAll('#menus *, #hud *, .modal *, .bagview *')) {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        let hidden = false;
        for (let p = el; p; p = p.parentElement) { const ps = getComputedStyle(p); if (ps.display === 'none' || ps.visibility === 'hidden' || +ps.opacity === 0) { hidden = true; break; } }
        if (hidden) continue;
        const offX = r.right > vw + 1 || r.left < -1;
        const offY = r.bottom > vh + 1 || r.top < -1;
        if ((offX && !scrollsX(el)) || (offY && !scrollsY(el))) {
          const id = el.id ? '#' + el.id : '.' + [...el.classList].join('.');
          out.push(`${el.tagName.toLowerCase()}${id} [${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}]`);
        }
      }
      const de = document.documentElement;
      if (de.scrollWidth > vw + 1) out.unshift(`PAGE scrollWidth ${de.scrollWidth} > ${vw}`);
      // keep only the outermost offenders
      return out.slice(0, 12);
    });
    logs.push(`${tag} ${name}: ${bad.length ? bad.join(' | ') : 'OK'}`);
    await page.screenshot({ path: `${SP}/fit-${tag}-${name}.png` });
  };
  const m = (fn, arg) => page.evaluate(fn, arg);
  await m(() => window.__app.menus.main()); await audit('main');
  await m(() => window.__app.menus.startSetup('round18')); await audit('setup-golfer');
  await m(() => { const s = window.__app.menus; s.setup.step = 1; s.renderSetup(); }); await audit('setup-course');
  await m(() => { const s = window.__app.menus; s.setup.step = 2; s.renderSetup(); }); await audit('setup-options');
  await m(() => window.__app.menus.go('career')); await audit('career');
  await m(() => window.__app.menus.go('bag')); await audit('bag');
  await m(() => window.__app.menus.go('settings')); await audit('settings');
  await m(() => window.__app.menus.go('shop')); await audit('shop');
  await m(() => window.__app.menus.shop.open('apparel')); await audit('shop-apparel');
  await m(() => window.__app.menus.go('masters')); await audit('masters');
  await m(() => window.__app.menus.go('mygolfer')); await audit('creator');
  for (const t of ['clothes', 'skills']) { await m((t) => { const c = window.__app.menus.creator; c.st.tab = t; c.render(); }, t); await audit(`creator-${t}`); }
  await m(() => window.__app.menus.main());
  await launch(page);
  await audit('play-aim');
  await m(() => window.__app.play.openBag()); await page.waitForTimeout(1500); await audit('play-bag');
  await m(() => { const p = window.__app.play; if (p.state === 'bag') p.closeBag?.(); });
  await m(() => window.__app.hud.closeModal?.());
  await m(() => window.__app.pauseMenu()); await audit('play-pause');
  await m(() => { window.__app.hud.closeModal(); window.__app.hud.showScorecard?.(window.__app.play); }); await audit('play-scorecard');
  await m(() => { window.__app.hud.closeModal?.(); const play = window.__app.play; play.round.cards.forEach(c => { c.strokes = c.par; c.putts = 2; }); play.finishRound(); });
  await audit('results');
}
