import { frames, launch } from './util.js';
export default async function (page, SP, logs) {
  const [c, h] = (process.env.HOLE || 'pinehurst:17').split(':');
  await launch(page, { mode: 'coursePractice', setup: { courseId: c, hole: +h } });
  const info = await page.evaluate(() => {
    const app = window.__app, p = app.play, hole = p.hole;
    p.state = 'pose';
    const V = app.world.camera.position.constructor;
    const G = hole.G;
    app.rig.set('thumb', { pos: new V(G[0], hole.heightAt(G[0], G[1]) + 60, -G[1] + 30), look: new V(G[0], hole.heightAt(G[0], G[1]), -G[1]), fov: 50, snap: true });
    app.rig.snap();
    const t = app.world.terrain;
    return { tex: t.material.map.image.width + 'x' + t.material.map.image.height, verts: t.geometry.attributes.position.count, mapNull: !t.material.map, gh: hole.heightAt(G[0], G[1]), surf: hole.surfAt(G[0], G[1]) };
  });
  logs.push(JSON.stringify(info));
  await frames(page, 2);
  await page.screenshot({ path: `${SP}/topdown-${c}-${+h + 1}.png` });
}
