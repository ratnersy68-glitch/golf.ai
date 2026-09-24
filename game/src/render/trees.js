import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32 } from '../core/noise.js';

const CANOPY_COLORS = {
  pine: '#2d4a25', longleaf: '#3c5b29', oak: '#3b5d28', maple: '#4a6b2a', cypress: '#2a4a2d',
  palm: '#4f7c32', eucalyptus: '#667c4c', sycamore: '#557a38', torreypine: '#3b5a33',
};
const TRUNK_COLORS = {
  pine: '#5a3d28', longleaf: '#5b412c', oak: '#4a3a2a', maple: '#4d3b2b', cypress: '#4a3a30',
  palm: '#8a7458', eucalyptus: '#b7ab98', sycamore: '#bfb4a2', torreypine: '#5a4535',
};

function colorize(geo, base, rnd, darkBottom = 0.55) {
  const pos = geo.attributes.position;
  const cols = new Float32Array(pos.count * 3);
  const c = new THREE.Color(base);
  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) { minY = Math.min(minY, pos.getY(i)); maxY = Math.max(maxY, pos.getY(i)); }
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - minY) / Math.max(1e-3, maxY - minY);
    const outward = Math.min(1, Math.hypot(pos.getX(i), pos.getZ(i)));
    const k = (darkBottom + (1 - darkBottom) * t) * (0.8 + 0.25 * outward) * (0.9 + rnd() * 0.2);
    cols[i * 3] = c.r * k; cols[i * 3 + 1] = c.g * k; cols[i * 3 + 2] = c.b * k;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  return geo;
}

function jiggle(geo, amt, rnd) {
  const p = geo.attributes.position;
  const map = new Map();
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    if (!map.has(key)) map.set(key, [(rnd() - 0.5) * amt, (rnd() - 0.5) * amt, (rnd() - 0.5) * amt]);
    const o = map.get(key);
    p.setXYZ(i, p.getX(i) + o[0], p.getY(i) + o[1], p.getZ(i) + o[2]);
  }
  geo.computeVertexNormals();
  return geo;
}

function blob(r, x, y, z, sx = 1, sy = 1, sz = 1, detail = 1, rnd) {
  let g = new THREE.IcosahedronGeometry(r, detail);
  g = g.toNonIndexed ? g : g;
  g.scale(sx, sy, sz);
  g.translate(x, y, z);
  return g;
}

// Unit canopy geometry spanning y in [0,1], radius ~1
function canopyGeometry(type, variant) {
  const rnd = mulberry32(type.length * 131 + variant * 17);
  const parts = [];
  switch (type) {
    case 'pine': {
      for (let i = 0; i < 4; i++) {
        const y0 = i * 0.22, hgt = 0.42;
        const rr = 1 - i * 0.22;
        const g = new THREE.ConeGeometry(rr, hgt, 8, 1, true);
        g.translate((rnd() - 0.5) * 0.1, y0 + hgt / 2, (rnd() - 0.5) * 0.1);
        parts.push(g);
      }
      break;
    }
    case 'longleaf': {
      for (let i = 0; i < 5; i++) parts.push(blob(0.45, (rnd() - 0.5) * 1.1, 0.35 + rnd() * 0.45, (rnd() - 0.5) * 1.1, 1.1, 0.6, 1.1, 1, rnd));
      break;
    }
    case 'cypress': {
      const lean = (rnd() - 0.5) * 0.6;
      for (let i = 0; i < 4; i++) parts.push(blob(0.55, lean * i * 0.4 + (rnd() - 0.5) * 0.7, 0.2 + i * 0.22, (rnd() - 0.5) * 0.7, 1.6, 0.45, 1.3, 1, rnd));
      break;
    }
    case 'palm': {
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 + rnd() * 0.3;
        const g = new THREE.PlaneGeometry(1.0, 0.22, 4, 1);
        const p = g.attributes.position;
        for (let k = 0; k < p.count; k++) {
          const x = p.getX(k) + 0.5; // 0..1 along frond
          p.setY(k, p.getY(k));
          p.setZ(k, -x * x * 0.55);
          p.setX(k, x);
        }
        // lay flat: rotate so plane faces up
        g.rotateX(-Math.PI / 2);
        g.rotateZ(0);
        // droop: z already, now rotate around Y
        const m = new THREE.Matrix4().makeRotationY(a);
        g.applyMatrix4(m);
        g.translate(0, 0.75, 0);
        parts.push(g);
      }
      parts.push(blob(0.16, 0, 0.72, 0, 1, 1, 1, 0, rnd));
      break;
    }
    case 'eucalyptus':
    case 'torreypine': {
      const n = 5;
      for (let i = 0; i < n; i++) parts.push(blob(0.5, (rnd() - 0.5) * 1.1, 0.3 + rnd() * 0.5, (rnd() - 0.5) * 1.1, 1.0, 0.75, 1.0, 1, rnd));
      break;
    }
    default: { // oak, maple, sycamore
      parts.push(blob(0.62, 0, 0.5, 0, 1.05, 0.85, 1.05, 1, rnd));
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + rnd() * 0.5;
        parts.push(blob(0.42 + rnd() * 0.12, Math.cos(a) * 0.52, 0.35 + rnd() * 0.35, Math.sin(a) * 0.52, 1, 0.85, 1, 1, rnd));
      }
      parts.push(blob(0.4, 0, 0.8, 0, 1, 0.8, 1, 1, rnd));
    }
  }
  const nonIdx = parts.map(g => (g.index ? g.toNonIndexed() : g));
  nonIdx.forEach(g => { if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); });
  let geo = mergeGeometries(nonIdx.map(g => { const c = g.clone(); c.deleteAttribute('uv'); return c; }));
  if (type !== 'palm') jiggle(geo, 0.12, rnd);
  else geo.computeVertexNormals();
  colorize(geo, CANOPY_COLORS[type] || '#3b5d28', rnd, type === 'palm' ? 0.75 : 0.5);
  return geo;
}

function trunkGeometry(type) {
  const g = type === 'palm'
    ? new THREE.CylinderGeometry(0.75, 1, 1, 6, 4, true)
    : new THREE.CylinderGeometry(0.55, 1, 1, 6, 1, true);
  g.translate(0, 0.5, 0);
  if (type === 'palm') {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) + y * y * 3.0); }
    g.computeVertexNormals();
  }
  const rnd = mulberry32(3);
  colorize(g, TRUNK_COLORS[type] || '#4a3a2a', rnd, 0.7);
  return g;
}

export function buildTrees(hole, P) {
  const group = new THREE.Group();
  const byType = new Map();
  for (const t of hole.trees) {
    if (!byType.has(t.type)) byType.set(t.type, []);
    byType.get(t.type).push(t);
  }
  const canopyMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
  const trunkMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const col = new THREE.Color();
  const up = new THREE.Vector3(0, 1, 0);
  for (const [type, list] of byType) {
    const VAR = 3;
    for (let v = 0; v < VAR; v++) {
      const sub = list.filter((t, i) => i % VAR === v);
      if (!sub.length) continue;
      const cg = canopyGeometry(type, v);
      const cm = new THREE.InstancedMesh(cg, canopyMat, sub.length);
      const tg = trunkGeometry(type);
      const tm = new THREE.InstancedMesh(tg, trunkMat, sub.length);
      sub.forEach((t, i) => {
        const base = P(t.x, t.y, t.h0 - 0.3);
        // trunk: height up to canopy middle
        const trunkH = type === 'palm' ? t.ht * 0.97 : t.cb + (t.ht - t.cb) * 0.35;
        q.setFromAxisAngle(up, t.rot);
        const lean = type === 'palm' ? 0.06 : 0;
        s.set(t.tr * (type === 'palm' ? 1 : 1.2), trunkH, t.tr * (type === 'palm' ? 1 : 1.2));
        m.compose(base, q, s);
        tm.setMatrixAt(i, m);
        // canopy
        p.copy(base); p.y += t.cb;
        if (type === 'palm') { p.x += Math.cos(-t.rot) * trunkH * 0 + 0; }
        const ch = t.ht - t.cb;
        s.set(t.cr, type === 'palm' ? Math.max(3, ch) : ch, t.cr);
        if (type === 'palm') {
          // follow trunk bend (bend is in local +x of trunk, scaled by tr)
          const off = new THREE.Vector3(3.0 * t.tr * 1, 0, 0).applyQuaternion(q);
          p.copy(base).add(off); p.y += trunkH - 2.2;
          s.set(t.cr, 3, t.cr);
        }
        m.compose(p, q, s);
        cm.setMatrixAt(i, m);
        const tint = 0.85 + t.seed * 0.3;
        col.setRGB(tint, tint * (0.95 + t.seed * 0.1), tint * 0.95);
        cm.setColorAt(i, col);
      });
      cm.castShadow = true; cm.receiveShadow = true;
      tm.castShadow = true;
      cm.instanceMatrix.needsUpdate = true;
      if (cm.instanceColor) cm.instanceColor.needsUpdate = true;
      group.add(cm, tm);
    }
  }
  return group;
}

// Far-away tree band on the horizon (cheap, no shadows)
export function buildFarTrees(hole, P, heightFn) {
  const T = hole.theme.trees;
  if (!T.types.length) return null;
  const rnd = mulberry32(hole.seed ^ 1234);
  const type = T.types[0];
  const geo = canopyGeometry(type === 'palm' ? 'oak' : type, 0);
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
  const N = 900;
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  const cx = hole.gx0 + hole.gnx / 2, cy = hole.gy0 + hole.gny / 2;
  let n = 0;
  for (let i = 0; i < N * 3 && n < N; i++) {
    const a = rnd() * Math.PI * 2;
    const rx = hole.gnx / 2 + 10 + rnd() * 260, ry = hole.gny / 2 + 10 + rnd() * 260;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (hole.inGrid(x, y)) continue;
    const h = heightFn(x, y);
    if (h < (hole.theme.seaLevel ?? -1e9) + 1) continue;
    const ht = (type === 'pine' ? 24 : 15) * (0.8 + rnd() * 0.5);
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.28);
    s.set(ht * 0.4, ht, ht * 0.4);
    m.compose(P(x, y, h), q, s);
    mesh.setMatrixAt(n++, m);
  }
  mesh.count = n;
  return mesh;
}
