import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { TreeKind } from '../data/types';
import { rng } from './geometry';

/**
 * Stylised vegetation. Each kind is a template of parts; every part becomes one InstancedMesh,
 * so a whole forest is a handful of draw calls.
 */

interface Part {
  geo: THREE.BufferGeometry;
  color: string;
  /** instance colour replaces this part's colour (flower variants) */
  tint?: boolean;
  roughness?: number;
  bark?: boolean;
}

function blob(r: number, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, detail = 1, seed = 1): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(r, detail);
  // lumpy
  const p = g.getAttribute('position');
  const rand = rng(seed);
  const offsets = new Map<string, number>();
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    let o = offsets.get(key);
    if (o === undefined) {
      o = 0.85 + rand() * 0.3;
      offsets.set(key, o);
    }
    p.setXYZ(i, p.getX(i) * o * sx, p.getY(i) * o * sy, p.getZ(i) * o * sz);
  }
  g.translate(x, y, z);
  g.computeVertexNormals();
  return g;
}

function trunk(rBottom: number, rTop: number, h: number, lean = 0): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(rTop, rBottom, h, 7, 3);
  g.translate(0, h / 2, 0);
  if (lean) {
    const p = g.getAttribute('position');
    for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + (p.getY(i) / h) ** 2 * lean);
    g.computeVertexNormals();
  }
  return g;
}

function merge(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const clean = geos.map((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal') n.deleteAttribute(k);
    return n;
  });
  return mergeGeometries(clean, false)!;
}

const TEMPLATES: Record<TreeKind, () => Part[]> = {
  loblolly: () => {
    const crown: THREE.BufferGeometry[] = [];
    const r = rng(42);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      crown.push(blob(1.1 + r() * 0.4, Math.cos(a) * 1.0, 10.2 + r() * 1.6, Math.sin(a) * 1.0, 1.1, 0.55, 1.1, 1, i + 3));
    }
    crown.push(blob(1.3, 0, 11.8, 0, 1, 0.6, 1, 1, 9));
    const branches = [trunk(0.05, 0.03, 1.5), trunk(0.05, 0.03, 1.4)];
    branches[0].rotateZ(0.9);
    branches[0].translate(0, 9.3, 0);
    branches[1].rotateZ(-0.9);
    branches[1].translate(0, 9.8, 0);
    return [
      { geo: merge([trunk(0.32, 0.16, 11.5), ...branches]), color: '#7f5c45', roughness: 1, bark: true },
      { geo: merge(crown), color: '#4a7a3a' },
    ];
  },
  pine: () => {
    const layers: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 4; i++) {
      const c = new THREE.ConeGeometry(1.5 - i * 0.3, 2.2, 8, 1);
      c.translate(0, 3 + i * 1.3, 0);
      layers.push(c);
    }
    return [
      { geo: trunk(0.22, 0.12, 4), color: '#6b4226', bark: true },
      { geo: merge(layers), color: '#2d5a31' },
    ];
  },
  dogwood: () => {
    const r = rng(7);
    const flowers: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 7; i++) flowers.push(blob(0.9 + r() * 0.3, (r() - 0.5) * 2.2, 3.4 + r() * 1.3, (r() - 0.5) * 2.2, 1, 0.7, 1, 1, i + 20));
    return [
      { geo: trunk(0.14, 0.08, 3.4, 0.3), color: '#5b4032', bark: true },
      { geo: merge(flowers), color: '#fbf6ee', tint: true },
    ];
  },
  redbud: () => {
    const r = rng(8);
    const flowers: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 6; i++) flowers.push(blob(0.8 + r() * 0.3, (r() - 0.5) * 2, 3.2 + r() * 1.2, (r() - 0.5) * 2, 1, 0.75, 1, 1, i + 40));
    return [
      { geo: trunk(0.13, 0.07, 3.2, -0.25), color: '#4f3a2e', bark: true },
      { geo: merge(flowers), color: '#c95fa0', tint: true },
    ];
  },
  azalea: () => {
    const r = rng(11);
    const flowers: THREE.BufferGeometry[] = [];
    const leaves: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 5; i++) {
      const x = (r() - 0.5) * 1.1;
      const z = (r() - 0.5) * 1.1;
      leaves.push(blob(0.55, x, 0.35, z, 1, 0.8, 1, 1, i + 60));
      flowers.push(blob(0.5, x * 1.05, 0.5 + r() * 0.2, z * 1.05, 1.05, 0.8, 1.05, 1, i + 70));
    }
    return [
      { geo: merge(leaves), color: '#2f5b2c' },
      { geo: merge(flowers), color: '#e2457a', tint: true },
    ];
  },
  magnolia: () => {
    const r = rng(13);
    const crown: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 6; i++) crown.push(blob(1.4 - i * 0.12, (r() - 0.5) * 0.8, 2.2 + i * 0.9, (r() - 0.5) * 0.8, 1, 0.8, 1, 1, i + 80));
    const blossoms: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 14; i++) {
      const a = r() * Math.PI * 2;
      const y = 2.4 + r() * 4;
      const rad = 1.35 - (y - 2.4) * 0.14;
      blossoms.push(blob(0.16, Math.cos(a) * rad, y, Math.sin(a) * rad, 1, 1, 1, 0, i + 90));
    }
    return [
      { geo: trunk(0.2, 0.12, 2.6), color: '#5d4a3a', bark: true },
      { geo: merge(crown), color: '#244a26', roughness: 0.55 },
      { geo: merge(blossoms), color: '#fff8ec' },
    ];
  },
  oak: () => {
    const r = rng(17);
    const crown: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 7; i++) crown.push(blob(1.5 + r() * 0.5, (r() - 0.5) * 2.6, 4.6 + r() * 1.5, (r() - 0.5) * 2.6, 1, 0.8, 1, 1, i + 100));
    return [
      { geo: trunk(0.35, 0.2, 4.8), color: '#5a4332', bark: true },
      { geo: merge(crown), color: '#3c6b2f' },
    ];
  },
  cypress: () => {
    // Monterey cypress: windswept, flat-topped, leaning away from the sea
    const r = rng(19);
    const crown: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 6; i++) crown.push(blob(1.1 + r() * 0.4, 0.6 + i * 0.55, 4.0 + r() * 0.8 + (i < 3 ? 0.4 : 0), (r() - 0.5) * 1.6, 1.2, 0.45, 1, 1, i + 120));
    return [
      { geo: trunk(0.3, 0.14, 4.2, 1.6), color: '#6a5646', bark: true },
      { geo: merge(crown), color: '#2b4a33' },
    ];
  },
  palm: () => {
    const fronds: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 8; i++) {
      const f = new THREE.ConeGeometry(0.28, 2.6, 4, 1);
      f.rotateZ(Math.PI / 2 + 0.35);
      f.translate(1.2, 0, 0);
      f.scale(1, 0.35, 1);
      f.rotateY((i / 8) * Math.PI * 2);
      f.translate(0.5, 6.6, 0);
      fronds.push(f);
    }
    return [
      { geo: trunk(0.22, 0.16, 6.6, 0.5), color: '#8a7358', bark: true },
      { geo: merge(fronds), color: '#3d7a35' },
    ];
  },
  shrub: () => {
    const r = rng(23);
    const b: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 4; i++) b.push(blob(0.55 + r() * 0.2, (r() - 0.5) * 0.9, 0.35, (r() - 0.5) * 0.9, 1, 0.75, 1, 1, i + 140));
    return [{ geo: merge(b), color: '#3b6a2d', tint: true }];
  },
  gorse: () => {
    const r = rng(29);
    const b: THREE.BufferGeometry[] = [];
    const f: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 4; i++) {
      const x = (r() - 0.5) * 1.2;
      const z = (r() - 0.5) * 1.2;
      b.push(blob(0.6, x, 0.35, z, 1, 0.7, 1, 1, i + 160));
      f.push(blob(0.45, x, 0.55, z, 1.1, 0.6, 1.1, 1, i + 170));
    }
    return [
      { geo: merge(b), color: '#2f4a25' },
      { geo: merge(f), color: '#e8c332', tint: true },
    ];
  },
};

export interface TreeInstance {
  kind: TreeKind;
  x: number;
  y: number;
  h: number;
  scale: number;
  rot: number;
  color?: string;
}

const templateCache = new Map<TreeKind, Part[]>();

export function buildForest(trees: TreeInstance[], castShadow: boolean): THREE.Group {
  const group = new THREE.Group();
  group.name = 'forest';
  const byKind = new Map<TreeKind, TreeInstance[]>();
  for (const t of trees) {
    if (!byKind.has(t.kind)) byKind.set(t.kind, []);
    byKind.get(t.kind)!.push(t);
  }
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const c = new THREE.Color();
  for (const [kind, list] of byKind) {
    let parts = templateCache.get(kind);
    if (!parts) {
      parts = TEMPLATES[kind]();
      templateCache.set(kind, parts);
    }
    for (const part of parts) {
      const mat = new THREE.MeshStandardMaterial({ color: part.tint ? '#ffffff' : part.color, roughness: part.roughness ?? 0.85 });
      if (!part.bark) {
        // foliage glows a little so canopies never read as black holes
        mat.emissive.set(part.tint ? '#ffffff' : part.color);
        mat.emissiveIntensity = part.tint ? 0.08 : 0.28;
      }
      const mesh = new THREE.InstancedMesh(part.geo, mat, list.length);
      const rand = rng(list.length * 13 + kind.length);
      list.forEach((t, i) => {
        q.setFromAxisAngle(up, t.rot);
        s.setScalar(t.scale);
        p.set(t.x, t.h - 0.05, -t.y);
        m.compose(p, q, s);
        mesh.setMatrixAt(i, m);
        c.set(part.tint ? (t.color ?? part.color) : part.color);
        // natural variation
        const v = 0.9 + rand() * 0.2;
        c.multiplyScalar(v);
        mesh.setColorAt(i, c);
      });
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
      group.add(mesh);
    }
  }
  return group;
}

/** Instanced grass blades that sway in the wind. */
export function buildGrass(points: { x: number; y: number; h: number; color: THREE.Color; scale: number }[]): {
  mesh: THREE.InstancedMesh;
  uniforms: { uTime: { value: number }; uWind: { value: number } };
} {
  // a tuft: three crossed curved blades
  const blades: THREE.BufferGeometry[] = [];
  for (let k = 0; k < 3; k++) {
    const g = new THREE.PlaneGeometry(0.03, 0.16, 1, 3);
    const pos = g.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) + 0.08;
      const t = y / 0.16;
      pos.setXYZ(i, pos.getX(i) * (1 - t * 0.9), y, t * t * 0.05);
    }
    g.rotateY((k / 3) * Math.PI + 0.3);
    g.translate(Math.cos(k * 2.1) * 0.03, 0, Math.sin(k * 2.1) * 0.03);
    blades.push(g);
  }
  const geo = merge(blades);
  const uniforms = { uTime: { value: 0 }, uWind: { value: 1 } };
  const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, side: THREE.DoubleSide });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uWind = uniforms.uWind;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uWind;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec2 ip = vec2(instanceMatrix[3].x, instanceMatrix[3].z);
        #else
          vec2 ip = vec2(0.0);
        #endif
        float sway = sin(uTime * 2.2 + ip.x * 0.8 + ip.y * 0.6) * 0.5 + sin(uTime * 3.7 + ip.x * 1.7) * 0.25;
        float bend = position.y / 0.16;
        transformed.x += sway * 0.035 * bend * bend * uWind;
        transformed.z += sway * 0.02 * bend * bend * uWind;`,
      );
  };
  const mesh = new THREE.InstancedMesh(geo, mat, points.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  points.forEach((pt, i) => {
    q.setFromAxisAngle(up, (i * 2.399) % (Math.PI * 2));
    s.set(pt.scale, pt.scale * (0.8 + ((i * 7) % 5) * 0.1), pt.scale);
    p.set(pt.x, pt.h - 0.01, -pt.y);
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, pt.color);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.receiveShadow = true;
  mesh.computeBoundingSphere();
  mesh.name = 'grass';
  return { mesh, uniforms };
}
