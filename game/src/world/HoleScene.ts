import * as THREE from 'three';
import type { Atmosphere, SurfaceType, TreeKind, Vec2 } from '../data/types';
import { Bounds2, inBounds, pointInPolygon, polyBounds, rng } from './geometry';
import { HoleModel } from './HoleModel';
import { buildBridges, buildFlag, buildLandmarks, buildRails, buildRocks, CrowdRig, FlagRig, layoutBlobs } from './Props';
import { buildLights, buildSky, Lights, sunDirection } from './Sky';
import { buildTerrain, shade } from './TerrainBuilder';
import { buildForest, buildGrass, TreeInstance } from './Vegetation';
import { createWaterMaterial, waterMeshFromPolygon } from './Water';

export interface HoleSceneOptions {
  diorama: boolean;
  quality: 'low' | 'high';
  atmosphere: Atmosphere;
  flagColor: string;
  leaderNames: string[];
}

/** The complete 3D recreation of one hole, built entirely from its data. */
export class HoleScene {
  readonly group = new THREE.Group();
  readonly model: HoleModel;
  readonly lights: Lights;
  readonly flag: FlagRig;
  readonly innerRect: Bounds2;
  private waterMats: THREE.ShaderMaterial[] = [];
  private grassUniforms?: { uTime: { value: number }; uWind: { value: number } };
  private crowds: CrowdRig[] = [];
  private cheerUntil = 0;
  private time = 0;
  private readonly opts: HoleSceneOptions;

  constructor(model: HoleModel, opts: HoleSceneOptions) {
    this.model = model;
    this.opts = opts;
    const layout = model.layout;
    const a = opts.atmosphere;
    this.group.name = `hole-${layout.id}`;

    const trees = this.placeTrees(opts.diorama);
    const terrain = buildTerrain(model, {
      diorama: opts.diorama,
      quality: opts.quality,
      shadowBlobs: [
        ...layoutBlobs(layout),
        ...trees.filter((t) => t.kind === 'loblolly' || t.kind === 'oak' || t.kind === 'magnolia').map((t) => ({ at: [t.x, t.y] as Vec2, r: 1.8 * t.scale })),
      ],
    });
    this.innerRect = terrain.innerRect;
    this.group.add(terrain.inner);
    if (terrain.outer) this.group.add(terrain.outer);
    if (terrain.skirt) this.group.add(terrain.skirt);

    if (!opts.diorama) this.group.add(buildSky(a));

    const focus = new THREE.Vector3((layout.tee.at[0] + model.cup[0]) / 2, 0, -(layout.tee.at[1] + model.cup[1]) / 2);
    const pb = polyBounds(model.bounds);
    const span = Math.max(pb.maxX - pb.minX, pb.maxY - pb.minY) * 0.62 + 6;
    this.lights = buildLights(a, focus, span, opts.quality === 'high' ? 4096 : 2048);
    this.group.add(this.lights.sun, this.lights.sun.target, this.lights.hemi, this.lights.fill);

    // water
    const sunDir = sunDirection(a);
    const clip = opts.diorama ? this.innerRect : null;
    for (const s of model.surfaces) {
      if (s.type !== 'water') continue;
      const m = createWaterMaterial({
        shallow: layout.grass.water,
        deep: layout.grass.deepWater,
        sky: a.sky.horizon,
        sunDir,
        sunColor: a.sky.sun,
        flow: s.name && /creek|burn|stream/i.test(s.name) ? [0.5, 0.05] : [0.08, 0.04],
      });
      this.waterMats.push(m);
      const poly = clip ? clipToRect(s.poly, clip) : s.poly;
      if (poly.length < 3) continue;
      this.group.add(waterMeshFromPolygon(poly, s.level, m));
    }

    this.group.add(buildForest(trees, true));
    if (opts.quality === 'high' || !opts.diorama) {
      const grass = this.placeGrass(opts.diorama ? 2500 : opts.quality === 'high' ? 14000 : 5000);
      const g = buildGrass(grass);
      this.grassUniforms = g.uniforms;
      this.group.add(g.mesh);
    }
    this.group.add(buildRails(model));
    this.group.add(buildBridges(model));
    this.group.add(buildRocks(model));
    const lm = buildLandmarks(model, opts.leaderNames);
    this.crowds = lm.crowds;
    if (opts.diorama) {
      // keep only what sits on the plinth
      lm.group.children = lm.group.children.filter((c) => {
        const p = new THREE.Vector3();
        c.getWorldPosition(p);
        return inBounds(this.innerRect, p.x, -p.z) || c instanceof THREE.InstancedMesh;
      });
    }
    this.group.add(lm.group);

    this.flag = buildFlag(model, opts.flagColor);
    this.group.add(this.flag.group);
  }

  private placeTrees(diorama: boolean): TreeInstance[] {
    const m = this.model;
    const layout = m.layout;
    const out: TreeInstance[] = [];
    const crop = polyBounds(m.bounds, 4);
    const keep = (x: number, y: number) => !diorama || inBounds(crop, x, y);
    const blocked: SurfaceType[] = ['water', 'green', 'fairway', 'bunker', 'tee', 'path'];
    for (const t of layout.trees) {
      if (!keep(t.at[0], t.at[1])) continue;
      out.push({ kind: t.kind, x: t.at[0], y: t.at[1], h: m.terrainHeightRaw(t.at[0], t.at[1]), scale: t.scale ?? 1, rot: t.at[0] * 3.1 + t.at[1], color: t.color });
    }
    for (const sc of layout.scatter) {
      const r = rng(sc.seed);
      const b = polyBounds(sc.area);
      let placed = 0;
      let guard = 0;
      while (placed < sc.count && guard++ < sc.count * 50) {
        const x = b.minX + r() * (b.maxX - b.minX);
        const y = b.minY + r() * (b.maxY - b.minY);
        if (!pointInPolygon(x, y, sc.area)) continue;
        if (m.insidePlay(x, y)) continue;
        if (distanceToBoundary(m.bounds, x, y) < minClearance(sc.kind)) continue;
        const surf = m.surfaceAt(x, y);
        if (blocked.includes(surf) && surf !== 'fairway') continue;
        if (surf === 'water') continue;
        placed++;
        if (!keep(x, y)) continue;
        const [s0, s1] = sc.scale ?? [0.9, 1.2];
        out.push({
          kind: sc.kind,
          x,
          y,
          h: m.terrainHeightRaw(x, y),
          scale: s0 + r() * (s1 - s0),
          rot: r() * Math.PI * 2,
          color: sc.colors ? sc.colors[Math.floor(r() * sc.colors.length)] : undefined,
        });
      }
    }
    return out;
  }

  private placeGrass(count: number) {
    const m = this.model;
    const r = rng(m.layout.number * 7 + 1);
    const rect = this.opts.diorama ? polyBounds(m.bounds, 3.5) : polyBounds(m.bounds, 9);
    const out: { x: number; y: number; h: number; color: THREE.Color; scale: number }[] = [];
    const base = new THREE.Color(m.layout.grass.rough);
    const light = new THREE.Color(shade(m.layout.grass.rough, 0.1));
    const dry = new THREE.Color('#9fa052');
    let guard = 0;
    while (out.length < count && guard++ < count * 6) {
      const x = rect.minX + r() * (rect.maxX - rect.minX);
      const y = rect.minY + r() * (rect.maxY - rect.minY);
      const s = m.surfaceAt(x, y);
      if (s !== 'rough' && s !== 'deepRough') continue;
      // keep the hedge line clean inside the course
      if (m.insidePlay(x, y) && distanceToBoundary(m.bounds, x, y) < 0.25) continue;
      if (m.nearGreen(x, y, 0.5)) continue;
      const c = base.clone().lerp(light, r()).lerp(dry, r() * 0.15);
      out.push({ x, y, h: m.terrainHeightRaw(x, y), color: c, scale: 0.8 + r() * 0.7 });
    }
    return out;
  }

  /** Crowd reaction for great shots. */
  cheer(duration = 3): void {
    this.cheerUntil = this.time + duration;
  }

  update(dt: number, wind = 1): void {
    this.time += dt;
    const t = this.time;
    for (const m of this.waterMats) m.uniforms.uTime.value = t;
    if (this.grassUniforms) {
      this.grassUniforms.uTime.value = t;
      this.grassUniforms.uWind.value = wind;
    }
    this.flag.update(t, wind);
    const cheering = t < this.cheerUntil;
    const tmp = new THREE.Matrix4();
    for (const c of this.crowds) {
      for (let i = 0; i < c.base.length; i++) {
        const ph = c.phase[i];
        const jump = cheering ? Math.max(0, Math.sin(t * 9 + ph)) * 0.35 : Math.sin(t * 1.3 + ph) * 0.01;
        tmp.copy(c.base[i]);
        tmp.elements[13] += jump;
        c.mesh.setMatrixAt(i, tmp);
        c.heads.setMatrixAt(i, tmp);
      }
      c.mesh.instanceMatrix.needsUpdate = true;
      c.heads.instanceMatrix.needsUpdate = true;
    }
  }

  dispose(): void {
    this.group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else if (m && !(m as THREE.MeshStandardMaterial).userData?.shared) {
        const sm = m as THREE.MeshStandardMaterial;
        sm.map?.dispose();
      }
    });
  }
}

function minClearance(kind: TreeKind): number {
  switch (kind) {
    case 'loblolly':
    case 'oak':
    case 'pine':
      return 1.1;
    case 'azalea':
    case 'shrub':
    case 'gorse':
      return 0.45;
    default:
      return 0.8;
  }
}

function distanceToBoundary(poly: Vec2[], x: number, y: number): number {
  let d = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i];
    const [bx, by] = poly[(i + 1) % poly.length];
    const dx = bx - ax,
      dy = by - ay;
    const l2 = dx * dx + dy * dy;
    let t = ((x - ax) * dx + (y - ay) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    d = Math.min(d, Math.hypot(x - ax - dx * t, y - ay - dy * t));
  }
  return d;
}

/** Sutherland-Hodgman polygon clip against an axis-aligned rect. */
export function clipToRect(poly: Vec2[], r: Bounds2): Vec2[] {
  const edges: [(p: Vec2) => boolean, (a: Vec2, b: Vec2) => Vec2][] = [
    [(p) => p[0] >= r.minX, (a, b) => inter(a, b, 0, r.minX)],
    [(p) => p[0] <= r.maxX, (a, b) => inter(a, b, 0, r.maxX)],
    [(p) => p[1] >= r.minY, (a, b) => inter(a, b, 1, r.minY)],
    [(p) => p[1] <= r.maxY, (a, b) => inter(a, b, 1, r.maxY)],
  ];
  let out = poly;
  for (const [inside, cut] of edges) {
    const input = out;
    out = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const prev = input[(i + input.length - 1) % input.length];
      if (inside(cur)) {
        if (!inside(prev)) out.push(cut(prev, cur));
        out.push(cur);
      } else if (inside(prev)) out.push(cut(prev, cur));
    }
    if (!out.length) break;
  }
  return out;
}

function inter(a: Vec2, b: Vec2, axis: 0 | 1, v: number): Vec2 {
  const t = (v - a[axis]) / (b[axis] - a[axis]);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
