import { frames, launch } from './util.js';
export default async function (page, SP, logs) {
  await launch(page, { mode: 'coursePractice', setup: { courseId: 'augusta', hole: 0 } });
  const info = await page.evaluate(() => {
    const app = window.__app, w = app.world, hole = app.play.hole;
    const kids = w.holeGroup.children.map(c => `${c.type}:${c.material?.type || ''}:${c.material?.map ? 'map' : ''}:${c.visible}`);
    const gl = w.renderer.getContext();
    return { kids, err: gl.getError(), maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE), info: JSON.stringify(w.renderer.info.memory), prog: w.renderer.info.programs.length };
  });
  logs.push(JSON.stringify(info, null, 1));
  await page.evaluate(() => {
    const app = window.__app, p = app.play, hole = p.hole;
    p.state = 'pose';
    const V = app.world.camera.position.constructor;
    const G = hole.G;
    app.rig.set('thumb', { pos: new V(G[0], hole.heightAt(G[0], G[1]) + 60, -G[1] + 30), look: new V(G[0], hole.heightAt(G[0], G[1]), -G[1]), fov: 50, snap: true });
    app.rig.snap();
    app.world.holeGroup.children[1].visible = false; // far terrain
  });
  await frames(page, 2);
  await page.screenshot({ path: `${SP}/texdbg-nofar.png` });
}
