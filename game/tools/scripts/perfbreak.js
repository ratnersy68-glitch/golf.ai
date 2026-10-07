import { frames, launch } from './util.js';
// Triangle/draw-call breakdown by object for one hole.
export default async function (page) {
  const [c, h] = (process.env.HOLE || 'sawgrass:16').split(':');
  await launch(page, { mode: 'coursePractice', setup: { courseId: c, hole: +h } });
  console.log(await page.evaluate(() => {
    const w = window.__app.world;
    const rows = {};
    w.scene.traverse(o => {
      if (!o.isMesh && !o.isPoints && !o.isLine) return;
      const g = o.geometry; const n = g.index ? g.index.count / 3 : g.attributes.position.count / 3;
      const cnt = o.isInstancedMesh ? o.count : 1;
      let key = o.name || o.userData.kind || '';
      let p = o; while (!key && p.parent) { p = p.parent; key = p.name || p.userData.kind || ''; }
      key = (key || 'unnamed') + ':' + (g.type || '') + (o.isInstancedMesh ? '(inst)' : '');
      rows[key] = rows[key] || { meshes: 0, tris: 0 };
      rows[key].meshes++; rows[key].tris += Math.round(n * cnt);
    });
    const inst = []; w.scene.traverse(o => { if (o.isInstancedMesh) { const g = o.geometry; const n = g.index ? g.index.count / 3 : g.attributes.position.count / 3; inst.push(`${o.count} x ${n} tris = ${Math.round(o.count * n)}  mat=${o.material.type} color=${o.material.color?.getHexString()} shadow=${o.castShadow}`); } });
    return inst.join('\n') + '\n---\n' + Object.entries(rows).sort((a, b) => b[1].tris - a[1].tris).slice(0, 25).map(([k, v]) => `${String(v.tris).padStart(8)} tris ${String(v.meshes).padStart(4)} meshes  ${k}`).join('\n');
  }));
}
