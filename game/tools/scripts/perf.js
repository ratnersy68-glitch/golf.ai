import { frames, launch } from './util.js';
// Rendering cost of a few holes: draw calls, triangles, geometries, textures and hole build time.
export default async function (page) {
  for (const item of (process.env.HOLES || 'augusta:0,pebble:6,sawgrass:16,standrews:17').split(',')) {
    const [c, h] = item.split(':');
    const t0 = Date.now();
    await launch(page, { mode: 'coursePractice', setup: { courseId: c, hole: +h } });
    const built = Date.now() - t0;
    await page.evaluate(() => { window.__app.play.setCamera('address'); window.__app.rig.snap(); });
    await frames(page, 3);
    const info = await page.evaluate(() => {
      const w = window.__app.world, r = w.renderer;
      let meshes = 0, inst = 0;
      w.scene.traverse(o => { if (o.isMesh) { meshes++; if (o.isInstancedMesh) inst += o.count; } });
      return { calls: r.info.render.calls, tris: r.info.render.triangles, geos: r.info.memory.geometries, tex: r.info.memory.textures, meshes, instances: inst, shadowMap: w.sun.shadow.mapSize.x, quality: w.quality };
    });
    console.log(item, 'loadMs', built, JSON.stringify(info));
  }
  console.log('heapMB', await page.evaluate(() => Math.round((performance.memory?.usedJSHeapSize || 0) / 1e6)));
}
