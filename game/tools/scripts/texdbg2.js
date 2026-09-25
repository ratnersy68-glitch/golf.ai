import { frames, launch } from './util.js';
export default async function (page, SP, logs) {
  await launch(page, { mode: 'coursePractice', setup: { courseId: 'augusta', hole: 0 } });
  const info = await page.evaluate(() => {
    const app = window.__app, w = app.world;
    const t = w.terrain;
    t.geometry.computeBoundingSphere();
    const bs = t.geometry.boundingSphere;
    const inScene = !!w.scene.getObjectById(t.id);
    let parentChain = []; let o = t; while (o) { parentChain.push(o.type + (o.visible ? '' : '(hidden)')); o = o.parent; }
    const idx = t.geometry.index;
    return { bs: [bs.center.toArray().map(v => v | 0), bs.radius | 0], inScene, parentChain, idxCount: idx.count, idxType: idx.array.constructor.name, pos: t.geometry.attributes.position.count, dr: t.geometry.drawRange, layers: t.layers.mask, matVis: t.material.visible, side: t.material.side, tris: w.renderer.info.render.triangles, calls: w.renderer.info.render.calls, cam: w.camera.position.toArray().map(v => v | 0) };
  });
  logs.push(JSON.stringify(info));
}
