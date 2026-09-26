import * as THREE from 'three';
import type { HoleLayout, LandmarkData, Vec2 } from '../data/types';
import { pointInPolygon, polyBounds, rng, smoothOpen } from './geometry';
import { HoleModel } from './HoleModel';

const matCache = new Map<string, THREE.MeshStandardMaterial>();
export function mat(color: string, roughness = 0.8, metalness = 0): THREE.MeshStandardMaterial {
  const key = `${color}|${roughness}|${metalness}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    matCache.set(key, m);
  }
  return m;
}

/* ------------------------------------------------------------------ rails */

/** Mini-golf rails along the playable boundary. Hedges on land, stone where they cross water. */
export function buildRails(model: HoleModel): THREE.Group {
  const g = new THREE.Group();
  g.name = 'rails';
  const style = model.layout.railStyle;
  const b = model.bounds;
  const H = model.railHeight;
  const W = 0.26;
  const pieces: { x: number; y: number; ang: number; len: number; water: boolean }[] = [];
  for (let i = 0; i < b.length; i++) {
    const [ax, ay] = b[i];
    const [bx, by] = b[(i + 1) % b.length];
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.round(len / 0.5));
    for (let k = 0; k < n; k++) {
      const t0 = k / n;
      const t1 = (k + 1) / n;
      const x = ax + (bx - ax) * (t0 + t1) * 0.5;
      const y = ay + (by - ay) * (t0 + t1) * 0.5;
      pieces.push({ x, y, ang: Math.atan2(by - ay, bx - ax), len: len / n + 0.02, water: model.surfaceAt(x, y) === 'water' });
    }
  }
  const box = new THREE.BoxGeometry(1, 1, 1);
  const land = pieces.filter((p) => !p.water);
  const wet = pieces.filter((p) => p.water);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const makeRun = (list: typeof pieces, material: THREE.Material, height: number, width: number, sink: number) => {
    const mesh = new THREE.InstancedMesh(box, material, list.length);
    list.forEach((p, i) => {
      const h = model.terrainHeightRaw(p.x, p.y);
      e.set(0, p.ang, 0);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(p.x, Math.max(h, 0.06) + height / 2 - sink, -p.y), q, new THREE.Vector3(p.len, height + sink, width));
      mesh.setMatrixAt(i, m);
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };
  const railMat =
    style === 'hedge' ? mat('#2f6a2c', 0.95) : style === 'stone' ? mat('#a89c86', 0.9) : style === 'timber' ? mat('#8a5a34', 0.8) : mat('#d8cfb8', 0.9);
  if (land.length) g.add(makeRun(land, railMat, H, W, 0.25));
  if (wet.length) g.add(makeRun(wet, mat('#9d927e', 0.9), H + 0.05, W + 0.04, 0.8));

  if (style === 'hedge' && land.length) {
    // bushy boxwood lumps on top of the hedge
    const lump = new THREE.IcosahedronGeometry(0.17, 1);
    const count = land.length * 3;
    const lumps = new THREE.InstancedMesh(lump, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95 }), count);
    const r = rng(model.layout.number * 31);
    const c = new THREE.Color();
    let k = 0;
    for (const p of land) {
      for (let j = 0; j < 3; j++) {
        const off = (j - 1) * p.len * 0.33;
        const x = p.x + Math.cos(p.ang) * off;
        const y = p.y + Math.sin(p.ang) * off;
        const h = model.terrainHeightRaw(x, y);
        const s = 0.8 + r() * 0.5;
        m.compose(new THREE.Vector3(x + (r() - 0.5) * 0.06, h + H - 0.02, -y + (r() - 0.5) * 0.06), new THREE.Quaternion(), new THREE.Vector3(s, s * 0.8, s));
        lumps.setMatrixAt(k, m);
        c.set(r() < 0.5 ? '#35772f' : '#2b6027').multiplyScalar(0.9 + r() * 0.25);
        lumps.setColorAt(k, c);
        k++;
      }
    }
    lumps.castShadow = true;
    lumps.receiveShadow = true;
    g.add(lumps);
  }
  return g;
}

/* ------------------------------------------------------------------ bridges */

export function buildBridges(model: HoleModel): THREE.Group {
  const g = new THREE.Group();
  g.name = 'bridges';
  for (const br of model.bridges) {
    const stone = br.style === 'stone';
    const deckMat = mat(stone ? '#c9bfa8' : '#9a6a3e', 0.9);
    const wallMat = mat(stone ? '#a79a82' : '#7c5230', 0.85);
    const nx = -br.dirY;
    const ny = br.dirX;
    const segs = 24;
    const hw = br.width / 2;
    // deck surface as a strip
    const pos: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const cx = br.from[0] + br.dirX * br.length * t;
      const cy = br.from[1] + br.dirY * br.length * t;
      const h = model.bridgeHeight(cx, cy) ?? 0;
      for (const s of [-1, 1]) pos.push(cx + nx * hw * s * 1.08, h + 0.005, -(cy + ny * hw * s * 1.08));
      if (i < segs) {
        const a = i * 2;
        idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const deck = new THREE.BufferGeometry();
    deck.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    deck.setIndex(idx);
    deck.computeVertexNormals();
    // make sure normals face up
    const nrm = deck.getAttribute('normal');
    if (nrm.getY(0) < 0) {
      idx.reverse();
      deck.setIndex(idx);
      deck.computeVertexNormals();
    }
    const deckMesh = new THREE.Mesh(deck, deckMat);
    deckMesh.receiveShadow = true;
    g.add(deckMesh);

    // body under the deck and parapets as stacked stone blocks
    const block = new THREE.BoxGeometry(1, 1, 1);
    const blocks: THREE.Matrix4[] = [];
    const bodyBlocks: THREE.Matrix4[] = [];
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.atan2(br.dirY, br.dirX), 0));
    const n = 14;
    for (let i = 0; i < n; i++) {
      const t0 = i / n;
      const t1 = (i + 1) / n;
      const tm = (t0 + t1) / 2;
      const cx = br.from[0] + br.dirX * br.length * tm;
      const cy = br.from[1] + br.dirY * br.length * tm;
      const h = model.bridgeHeight(cx, cy) ?? 0;
      const tilt = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(br.dirY, 0, br.dirX).normalize(),
        Math.atan2((model.bridgeHeight(br.from[0] + br.dirX * br.length * t1, br.from[1] + br.dirY * br.length * t1) ?? 0) - (model.bridgeHeight(br.from[0] + br.dirX * br.length * t0, br.from[1] + br.dirY * br.length * t0) ?? 0), br.length / n),
      );
      const qq = tilt.clone().multiply(q);
      const segLen = br.length / n + 0.03;
      for (const s of [-1, 1]) {
        const wx = cx + nx * (hw + 0.1) * s;
        const wy = cy + ny * (hw + 0.1) * s;
        blocks.push(new THREE.Matrix4().compose(new THREE.Vector3(wx, h + 0.1, -wy), qq, new THREE.Vector3(segLen, 0.34, 0.2)));
      }
      // arch body: thicker near the ends, thin in the middle (an arch silhouette)
      const archDepth = 0.25 + 0.9 * Math.abs(tm - 0.5) * 2;
      bodyBlocks.push(new THREE.Matrix4().compose(new THREE.Vector3(cx, h - archDepth / 2 - 0.01, -cy), qq, new THREE.Vector3(segLen, archDepth, br.width + 0.42)));
    }
    const wall = new THREE.InstancedMesh(block, wallMat, blocks.length);
    blocks.forEach((mm, i) => wall.setMatrixAt(i, mm));
    wall.castShadow = true;
    wall.receiveShadow = true;
    g.add(wall);
    const body = new THREE.InstancedMesh(block, mat(stone ? '#978a73' : '#6d4726', 0.95), bodyBlocks.length);
    bodyBlocks.forEach((mm, i) => body.setMatrixAt(i, mm));
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);

    // plaque at the entrance
    if (br.name) {
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.03), mat('#8c7a4a', 0.4, 0.6));
      const px = br.from[0] + nx * (hw + 0.1) - br.dirX * 0.2;
      const py = br.from[1] + ny * (hw + 0.1) - br.dirY * 0.2;
      plaque.position.set(px, model.terrainHeightRaw(px, py) + 0.25, -py);
      plaque.rotation.y = Math.atan2(br.dirY, br.dirX) + Math.PI / 2;
      g.add(plaque);
    }
  }
  return g;
}

/* ------------------------------------------------------------------ flag & cup */

export interface FlagRig {
  group: THREE.Group;
  flag: THREE.Mesh;
  stick: THREE.Group;
  update(t: number, wind: number): void;
  setRaised(r: number): void;
}

export function buildFlag(model: HoleModel, flagColor: string): FlagRig {
  const [cx, cy] = model.cup;
  const h = model.terrainHeight(cx, cy);
  const group = new THREE.Group();
  group.position.set(cx, h, -cy);
  group.name = 'flag';

  // cup: dark disc with a white liner rim and a gradient to suggest depth
  const cupR = model.cupRadius;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const ctx = cv.getContext('2d')!;
  const grd = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
  grd.addColorStop(0, '#050505');
  grd.addColorStop(0.72, '#1b1b1b');
  grd.addColorStop(0.8, '#f2f2f2');
  grd.addColorStop(0.92, '#d9d9d9');
  grd.addColorStop(1, 'rgba(40,60,20,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(64, 64, 64, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(cupR * 1.22, 40),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }),
  );
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.012;
  disc.renderOrder = 3;
  group.add(disc);

  const stick = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.4, 10), mat('#f4f4f0', 0.35));
  pole.position.y = 1.2;
  pole.castShadow = true;
  stick.add(pole);
  const ferrule = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), mat('#d8b43c', 0.3, 0.8));
  ferrule.position.y = 2.41;
  stick.add(ferrule);

  const fw = 0.75;
  const fh = 0.48;
  const flagGeo = new THREE.PlaneGeometry(fw, fh, 12, 6);
  flagGeo.translate(fw / 2, 0, 0);
  const base = Float32Array.from(flagGeo.getAttribute('position').array as Float32Array);
  const flag = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({ color: flagColor, roughness: 0.7, side: THREE.DoubleSide }));
  flag.position.set(0.02, 2.12, 0);
  flag.castShadow = true;
  stick.add(flag);
  group.add(stick);

  return {
    group,
    flag,
    stick,
    update(t: number, wind: number) {
      const p = flagGeo.getAttribute('position');
      for (let i = 0; i < p.count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        const k = x / fw;
        p.setZ(i, Math.sin(t * 5.5 * wind + x * 7 - y * 1.5) * 0.07 * k * wind + Math.sin(t * 9 + x * 13) * 0.015 * k);
        p.setY(i, y - k * k * 0.05 * (1.2 - wind));
      }
      p.needsUpdate = true;
      flagGeo.computeVertexNormals();
    },
    setRaised(r: number) {
      stick.position.y = r * 1.4;
      stick.rotation.z = r * 0.5;
      stick.position.x = r * 0.5;
    },
  };
}

/* ------------------------------------------------------------------ rocks */

export function buildRocks(model: HoleModel): THREE.Group {
  const g = new THREE.Group();
  g.name = 'rocks';
  const r = rng(99);
  for (const rk of model.layout.rocks) {
    const geo = new THREE.DodecahedronGeometry(rk.radius, 1);
    const p = geo.getAttribute('position');
    for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) * ((rk.height ?? rk.radius) / rk.radius) * (0.8 + r() * 0.1));
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat('#8b8378', 0.95));
    m.position.set(rk.at[0], model.terrainHeightRaw(rk.at[0], rk.at[1]) + (rk.height ?? rk.radius) * 0.35, -rk.at[1]);
    m.rotation.y = r() * 6;
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
  }
  return g;
}

/* ------------------------------------------------------------------ landmarks */

function textTexture(lines: { text: string; color: string; size: number; weight?: string }[], w: number, h: number, bg: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  let y = 0;
  for (const l of lines) {
    y += l.size * 1.15;
    ctx.fillStyle = l.color;
    ctx.font = `${l.weight ?? '700'} ${l.size}px "Barlow Condensed", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(l.text, w / 2, y);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export interface CrowdRig {
  mesh: THREE.InstancedMesh;
  heads: THREE.InstancedMesh;
  base: THREE.Matrix4[];
  headBase: THREE.Matrix4[];
  phase: number[];
}

export function buildLandmarks(model: HoleModel, leaderNames: string[]): { group: THREE.Group; crowds: CrowdRig[] } {
  const layout = model.layout;
  const g = new THREE.Group();
  g.name = 'landmarks';
  const crowds: CrowdRig[] = [];
  for (const lm of layout.landmarks) {
    switch (lm.kind) {
      case 'scoreboard':
        g.add(scoreboard(model, lm, leaderNames));
        break;
      case 'crowd': {
        const c = crowd(model, lm);
        if (c) {
          g.add(c.mesh, c.heads);
          crowds.push(c);
        }
        break;
      }
      case 'teeMarkers': {
        const [x, y] = lm.at!;
        for (const s of [-1, 1]) {
          const mk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.18, 12), mat(lm.color ?? '#1b5e3b', 0.5));
          const mx = x + s * 1.3;
          mk.position.set(mx, model.terrainHeightRaw(mx, y) + 0.09, -y);
          mk.castShadow = true;
          g.add(mk);
        }
        break;
      }
      case 'ropeLine': {
        const pts = smoothOpen(lm.points!, 6);
        const posts = new THREE.Group();
        const curve: THREE.Vector3[] = [];
        pts.forEach(([x, y], i) => {
          const h = model.terrainHeightRaw(x, y);
          curve.push(new THREE.Vector3(x, h + 0.42, -y));
          if (i % 6 === 0) {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 6), mat('#2a5e38', 0.6));
            post.position.set(x, h + 0.25, -y);
            posts.add(post);
          }
        });
        const rope = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curve), 60, 0.015, 5), mat('#f0ead6', 0.8));
        g.add(posts, rope);
        break;
      }
      case 'sign': {
        const [x, y] = lm.at!;
        const t = textTexture(
          [
            { text: layout.number.toString(), color: '#ffffff', size: 110 },
            { text: `PAR ${layout.par}  ·  ${layout.realYards} YDS`, color: '#f4e7b0', size: 32, weight: '600' },
          ],
          256,
          200,
          lm.color ?? '#1b5e3b',
        );
        const board = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.05), [
          mat('#3a2a1a'),
          mat('#3a2a1a'),
          mat('#3a2a1a'),
          mat('#3a2a1a'),
          new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }),
          mat('#3a2a1a'),
        ]);
        const h = model.terrainHeightRaw(x, y);
        board.position.set(x, h + 0.75, -y);
        board.rotation.y = lm.rotation ? (lm.rotation * Math.PI) / 180 : -0.4;
        board.castShadow = true;
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.05), mat('#3a2a1a'));
        post.position.set(x, h + 0.25, -y);
        post.rotation.y = board.rotation.y;
        g.add(board, post);
        break;
      }
      case 'distantGreen': {
        // a flag on neighbouring greens (tees get nothing)
        if (lm.name && /green/i.test(lm.name) && lm.points) {
          const b = polyBounds(lm.points);
          const x = (b.minX + b.maxX) / 2;
          const y = (b.minY + b.maxY) / 2;
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2, 6), mat('#f4f4f0'));
          pole.position.set(x, model.terrainHeightRaw(x, y) + 1, -y);
          const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), new THREE.MeshStandardMaterial({ color: '#f2c94c', side: THREE.DoubleSide }));
          fl.position.set(x + 0.3, model.terrainHeightRaw(x, y) + 1.8, -y);
          g.add(pole, fl);
        }
        break;
      }
      case 'grandstand':
        g.add(grandstand(model, lm));
        break;
      case 'clubhouse':
        g.add(clubhouse(model, lm));
        break;
      case 'bulkhead':
        g.add(bulkhead(model, lm));
        break;
      case 'lighthouse':
      case 'cliff':
      case 'ocean':
      case 'bench':
        break;
    }
  }
  return { group: g, crowds };
}

function scoreboard(model: HoleModel, lm: LandmarkData, names: string[]): THREE.Group {
  const [x, y] = lm.at!;
  const [w, h] = lm.size ?? [8, 3];
  const grp = new THREE.Group();
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = Math.round((1024 * h) / w);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#f7f7f2';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#1b5e3b';
  ctx.fillRect(0, 0, c.width, 70);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 52px "Barlow Condensed", Arial';
  ctx.textAlign = 'center';
  ctx.fillText(lm.text ?? 'LEADERS', c.width / 2, 54);
  ctx.textAlign = 'left';
  const rowH = (c.height - 90) / Math.max(1, Math.min(6, names.length));
  names.slice(0, 6).forEach((n, i) => {
    const yy = 90 + i * rowH + rowH * 0.72;
    ctx.fillStyle = '#1a1a1a';
    ctx.font = `600 ${Math.floor(rowH * 0.62)}px "Barlow Condensed", Arial`;
    ctx.fillText(n.toUpperCase(), 40, yy);
    const score = 8 - i * 1 - (i > 2 ? 1 : 0);
    ctx.fillStyle = score > 0 ? '#c8102e' : '#1b5e3b';
    ctx.textAlign = 'right';
    ctx.fillText(score > 0 ? String(score) : 'E', c.width - 40, yy);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#d0d0c8';
    ctx.fillRect(30, 90 + (i + 1) * rowH - 2, c.width - 60, 2);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 }));
  face.position.z = 0.11;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, h + 0.3, 0.2), mat('#1f4d32', 0.7));
  frame.castShadow = true;
  const board = new THREE.Group();
  board.add(frame, face);
  const base = model.terrainHeightRaw(x, y);
  board.position.y = base + h / 2 + 1.3;
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.5, 0.25), mat('#1f4d32', 0.7));
    leg.position.set((s * w) / 2.6, base + 0.7, 0);
    grp.add(leg);
  }
  grp.add(board);
  grp.position.set(x, 0, -y);
  grp.rotation.y = ((lm.rotation ?? 0) * Math.PI) / 180;
  return grp;
}

function crowd(model: HoleModel, lm: LandmarkData): CrowdRig | null {
  if (!lm.points) return null;
  const poly = lm.points;
  const b = polyBounds(poly);
  const r = rng(lm.seed ?? 1);
  const count = lm.count ?? 30;
  const body = new THREE.CapsuleGeometry(0.2, 0.55, 4, 8);
  body.translate(0, 0.48, 0);
  const head = new THREE.SphereGeometry(0.17, 10, 8);
  head.translate(0, 1.12, 0);
  const shirts = ['#f4f1e8', '#e9d8a6', '#94b8d8', '#f2b5c4', '#b8d8a8', '#ffffff', '#2f5d8c', '#e8e0cc', '#d95d39', '#7aa874'];
  const skins = ['#f1c6a4', '#e0ac85', '#c68b62', '#8d5a3b', '#f5d3b8', '#a86f4c'];
  const mesh = new THREE.InstancedMesh(body, new THREE.MeshStandardMaterial({ roughness: 0.85 }), count);
  const heads = new THREE.InstancedMesh(head, new THREE.MeshStandardMaterial({ roughness: 0.7 }), count);
  const base: THREE.Matrix4[] = [];
  const headBase: THREE.Matrix4[] = [];
  const phase: number[] = [];
  const target = model.greenCenter;
  let placed = 0;
  let guard = 0;
  const c = new THREE.Color();
  while (placed < count && guard++ < count * 40) {
    const x = b.minX + r() * (b.maxX - b.minX);
    const y = b.minY + r() * (b.maxY - b.minY);
    if (!pointInPolygon(x, y, poly)) continue;
    const h = model.terrainHeightRaw(x, y);
    const s = 0.85 + r() * 0.3;
    const face = Math.atan2(target[0] - x, target[1] - y);
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, h, -y), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), face + Math.PI), new THREE.Vector3(s, s, s));
    mesh.setMatrixAt(placed, m);
    heads.setMatrixAt(placed, m);
    base.push(m.clone());
    headBase.push(m.clone());
    mesh.setColorAt(placed, c.set(shirts[Math.floor(r() * shirts.length)]));
    heads.setColorAt(placed, c.set(skins[Math.floor(r() * skins.length)]));
    phase.push(r() * Math.PI * 2);
    placed++;
  }
  mesh.count = placed;
  heads.count = placed;
  mesh.castShadow = true;
  heads.castShadow = true;
  return { mesh, heads, base, headBase, phase };
}

function grandstand(model: HoleModel, lm: LandmarkData): THREE.Group {
  const [x, y] = lm.at!;
  const [w, d] = lm.size ?? [10, 3];
  const g = new THREE.Group();
  const h0 = model.terrainHeightRaw(x, y);
  for (let i = 0; i < 5; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, d / 5), mat(i % 2 ? '#e8e8e2' : '#d4d4cc', 0.8));
    step.position.set(0, h0 + 0.2 + i * 0.35, -(i * d) / 5);
    step.castShadow = true;
    step.receiveShadow = true;
    g.add(step);
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.15, d + 0.6), mat(lm.color ?? '#1f4d32', 0.6));
  roof.position.set(0, h0 + 3.2, -d / 2 + 0.2);
  roof.castShadow = true;
  g.add(roof);
  g.position.set(x, 0, -y);
  g.rotation.y = ((lm.rotation ?? 0) * Math.PI) / 180;
  return g;
}

function clubhouse(model: HoleModel, lm: LandmarkData): THREE.Group {
  const [x, y] = lm.at!;
  const [w, d] = lm.size ?? [8, 5];
  const g = new THREE.Group();
  const h0 = model.terrainHeightRaw(x, y);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, 2.4, d), mat(lm.color ?? '#f4f1e8', 0.8));
  body.position.y = h0 + 1.2;
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.72, 1.6, 4), mat('#5d6b6b', 0.7));
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
  roof.position.y = h0 + 3.2;
  body.castShadow = roof.castShadow = true;
  g.add(body, roof);
  g.position.set(x, 0, -y);
  g.rotation.y = ((lm.rotation ?? 0) * Math.PI) / 180;
  return g;
}

/** Railroad-tie bulkhead ring (Pete Dye's signature) around a polygon's edge. */
function bulkhead(model: HoleModel, lm: LandmarkData): THREE.Group {
  const g = new THREE.Group();
  if (!lm.points) return g;
  const pts = lm.points;
  const tie = new THREE.BoxGeometry(1, 1, 1);
  const list: THREE.Matrix4[] = [];
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[(i + 1) % pts.length];
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.round(len / 0.22));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const x = ax + (bx - ax) * t;
      const y = ay + (by - ay) * t;
      const top = Math.max(0.12, model.terrainHeightRaw(x, y));
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.atan2(by - ay, bx - ax), 0));
      list.push(new THREE.Matrix4().compose(new THREE.Vector3(x, top / 2 - 0.2, -y), q, new THREE.Vector3(len / n - 0.015, top + 0.4, 0.12)));
    }
  }
  const mesh = new THREE.InstancedMesh(tie, mat('#5a4330', 0.95), list.length);
  list.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  g.add(mesh);
  return g;
}

export function layoutBlobs(layout: HoleLayout): { at: Vec2; r: number }[] {
  return layout.trees.map((t) => ({ at: t.at, r: 1.6 * (t.scale ?? 1) }));
}
