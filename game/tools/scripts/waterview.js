import { frames, launch } from './util.js';
// Overhead views of a hole's water hazards (HOLE=course:index).
export default async function (page, SP) {
  for (const item of (process.env.HOLES || 'augusta:12').split(',')) {
    const [c, h] = item.split(':');
    await launch(page, { mode: 'coursePractice', setup: { courseId: c, hole: +h } });
    const info = await page.evaluate(() => {
      const app = window.__app, p = app.play, hole = p.hole, w = app.world;
      p.state = 'pose';
      const V = w.camera.position.constructor;
      const sh = hole.waterShapes.filter(s => s.kind !== 'ocean');
      const meshes = w.water.map(m => { m.geometry.computeBoundingBox(); const b = m.geometry.boundingBox; return [b.min.x | 0, b.max.x | 0, -b.max.z | 0, -b.min.z | 0, +b.min.y.toFixed(1)]; });
      // frame the middle of the hole from high above
      const a = hole.at(hole.L * 0.62);
      app.rig.set('thumb', { pos: new V(a.x - 60, hole.heightAt(a.x, a.y) + 230, -(a.y - 120)), look: new V(a.x, hole.heightAt(a.x, a.y), -a.y), fov: 55, snap: true });
      app.rig.snap();
      return { shapes: sh.map(s => [s.kind, +s.level.toFixed(1)]), meshes, visible: w.water.map(m => m.visible && m.parent != null) };
    });
    console.log(item, JSON.stringify(info));
    await frames(page, 3);
    await page.screenshot({ path: `${SP}/water-${c}-${+h + 1}.png` });
  }
}
