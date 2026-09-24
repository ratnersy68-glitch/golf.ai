import * as THREE from 'three';
import { mulberry32 } from '../core/noise.js';
import { S } from '../core/holeGen.js';
import { canvasTexture } from './textures.js';

const std = (color, rough = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra });

const BUILD_STYLE = {
  antebellum: { wall: '#f4f2ea', roof: '#3f4a3f', trim: '#2f5d3a' },
  lodge: { wall: '#d9cdb8', roof: '#5a4b3c', trim: '#3d4a3a' },
  mediterranean: { wall: '#efe4d0', roof: '#b0553a', trim: '#6b5a44' },
  modern: { wall: '#d8d4cc', roof: '#4a4a4a', trim: '#2a2a2a' },
  colonial: { wall: '#f1eee6', roof: '#3a3a3a', trim: '#2a3a55' },
  rna: { wall: '#bfae8e', roof: '#4c4c50', trim: '#3a3a3a' },
  tudor: { wall: '#ece6d6', roof: '#4a3a30', trim: '#3a2a20' },
  spanish: { wall: '#f3eadb', roof: '#b4553a', trim: '#5a4430' },
};

function windowsTexture(wall, trim) {
  return canvasTexture(256, 128, (ctx, w, h) => {
    ctx.fillStyle = wall; ctx.fillRect(0, 0, w, h);
    for (let row = 0; row < 2; row++) for (let i = 0; i < 8; i++) {
      const x = 10 + i * 31, y = 18 + row * 58;
      ctx.fillStyle = trim; ctx.fillRect(x - 2, y - 2, 20, 36);
      ctx.fillStyle = '#28333d'; ctx.fillRect(x, y, 16, 32);
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(x, y, 16, 10);
    }
  });
}

export function buildDecor(hole, P) {
  const group = new THREE.Group();
  const rnd = mulberry32(hole.seed ^ 999);
  const H = (x, y) => hole.heightAt(x, y);
  const style = BUILD_STYLE[hole.theme.building] || BUILD_STYLE.colonial;

  for (const d of hole.decor) {
    switch (d.kind) {
      case 'clubhouse': group.add(clubhouse(d, P, H, style, rnd)); break;
      case 'stands': group.add(grandstand(d, P, H, rnd)); break;
      case 'cart': group.add(cart(d, P, H)); break;
      case 'bench': group.add(bench(d, P, H)); break;
      case 'bridge': group.add(bridge(d, P, H, hole)); break;
      case 'flowers': group.add(flowers(d, P, H, rnd, hole)); break;
      case 'gorse': group.add(gorse(d, P, H, rnd)); break;
      case 'wall': group.add(wall(d, P, H)); break;
      case 'hotel': group.add(hotel(d, P, H)); break;
      case 'crowd': group.add(crowdLine(d, P, H, rnd)); break;
      case 'target': group.add(target(d, P, H)); break;
    }
  }
  // tee markers
  const teeCols = ['#111111', '#1e56b8', '#f2f2f2', '#c62828'];
  hole.teeBoxes.forEach((tb, i) => {
    const c = hole.at(tb.s + 1.5);
    for (const side of [-1, 1]) {
      const x = c.x + c.ty * side * 3.2, y = c.y - c.tx * side * 3.2;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), std(teeCols[i], 0.4));
      m.position.copy(P(x, y, H(x, y) + 0.12));
      m.castShadow = true;
      group.add(m);
    }
  });
  // St Andrews town behind the 18th / 1st
  if (hole.theme.extras.includes('town') && (hole.number === 18 || hole.number === 1)) {
    const G = hole.G, T = hole.gT, N = hole.gN;
    const base = hole.number === 18 ? [G[0] + T[0] * 70, G[1] + T[1] * 70] : hole.at(-60);
    const bx = Array.isArray(base) ? base[0] : base.x, by = Array.isArray(base) ? base[1] : base.y;
    for (let i = -6; i <= 6; i++) {
      const x = bx + N[0] * i * 14, y = by + N[1] * i * 14;
      const hgt = 9 + rnd() * 6;
      const b = new THREE.Mesh(new THREE.BoxGeometry(12, hgt, 10), std(['#b8a88a', '#a89878', '#c7b89a', '#9f9480'][i & 3], 0.9));
      b.position.copy(P(x, y, H(x, y) + hgt / 2 - 0.5));
      b.rotation.y = Math.atan2(N[0], N[1]);
      b.castShadow = true; b.receiveShadow = true;
      group.add(b);
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 7.5, 5, 4), std('#4b4d52', 0.8));
      roof.position.copy(b.position); roof.position.y += hgt / 2 + 2.5;
      roof.rotation.y = b.rotation.y + Math.PI / 4;
      roof.scale.set(1.1, 1, 0.9);
      group.add(roof);
    }
  }
  // rough tufts / fescue
  const ex = hole.theme.extras;
  if (ex.includes('fescue') || ex.includes('wiregrass')) group.add(tufts(hole, P, H, rnd, ex.includes('wiregrass')));
  if (hole.oceanSide) group.add(rocks(hole, P, H, rnd));
  return group;
}

function clubhouse(d, P, H, style, rnd) {
  const g = new THREE.Group();
  const w = d.big ? 60 : 36, dp = d.big ? 26 : 18, ht = d.big ? 14 : 10;
  const wallMat = new THREE.MeshStandardMaterial({ map: windowsTexture(style.wall, style.trim), roughness: 0.85 });
  wallMat.map.wrapS = THREE.RepeatWrapping; wallMat.map.repeat.set(w / 30, 1);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, ht, dp), [wallMat, wallMat, std(style.roof), std(style.wall), wallMat, wallMat]);
  body.position.y = ht / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 1, 1, 4, 1), std(style.roof, 0.7));
  roof.scale.set(w * 0.75, 7, dp * 0.78);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = ht + 3.5;
  roof.castShadow = true;
  g.add(roof);
  // veranda columns
  for (let i = 0; i < 8; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, ht * 0.55, 8), std('#ffffff', 0.5));
    c.position.set(-w / 2 + 4 + i * (w - 8) / 7, ht * 0.275, dp / 2 + 3);
    c.castShadow = true;
    g.add(c);
  }
  const porch = new THREE.Mesh(new THREE.BoxGeometry(w - 4, 0.6, 7), std(style.roof));
  porch.position.set(0, ht * 0.56, dp / 2 + 3);
  g.add(porch);
  if (d.big) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 5, 12), std('#ffffff', 0.6));
    cup.position.set(0, ht + 8, 0);
    g.add(cup);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(style.trim, 0.5));
    dome.position.set(0, ht + 10.5, 0);
    g.add(dome);
    // flag on the roof
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8), std('#dddddd'));
    pole.position.set(0, ht + 15, 0); g.add(pole);
  }
  // umbrellas on the lawn
  for (let i = 0; i < 6; i++) {
    const u = new THREE.Group();
    const top = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1, 10), std(['#2f7d3a', '#ffffff', '#1c2a44'][i % 3], 0.6));
    top.position.y = 2.6; u.add(top);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6), std('#ddd'));
    pole.position.y = 1.3; u.add(pole);
    const tab = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.1, 12), std('#ffffff'));
    tab.position.y = 0.9; u.add(tab);
    u.position.set(-w / 2 + 6 + i * 9, 0, dp / 2 + 12 + (i % 2) * 5);
    u.traverse(o => { o.castShadow = true; });
    g.add(u);
  }
  g.position.copy(P(d.x, d.y, H(d.x, d.y) - 0.3));
  g.rotation.y = Math.atan2(d.face[0], -d.face[1]);
  return g;
}

let personGeo = null, headGeo = null;
function people(n, positions, rnd) {
  if (!personGeo) {
    personGeo = new THREE.CapsuleGeometry(0.22, 0.95, 4, 8); personGeo.translate(0, 0.72, 0);
    headGeo = new THREE.SphereGeometry(0.13, 8, 6); headGeo.translate(0, 1.52, 0);
  }
  const bodies = new THREE.InstancedMesh(personGeo, std('#ffffff', 0.8), n);
  const heads = new THREE.InstancedMesh(headGeo, std('#ffffff', 0.7), n);
  const m = new THREE.Matrix4(), c = new THREE.Color();
  const shirts = ['#ffffff', '#1c2a44', '#c1121f', '#2f7d3a', '#f2c94c', '#7fb3d5', '#f2b8c6', '#111111', '#e6e2d9', '#3a6ea5'];
  const skins = ['#f3d2b3', '#e0ac85', '#c68863', '#9b6a47', '#6b4630'];
  for (let i = 0; i < n; i++) {
    const [x, y, z, ry] = positions[i];
    m.makeRotationY(ry); m.setPosition(x, y, z);
    const sc = 0.92 + rnd() * 0.16;
    m.scale(new THREE.Vector3(sc, sc, sc));
    bodies.setMatrixAt(i, m); heads.setMatrixAt(i, m);
    bodies.setColorAt(i, c.set(shirts[Math.floor(rnd() * shirts.length)]));
    heads.setColorAt(i, c.set(skins[Math.floor(rnd() * skins.length)]));
  }
  bodies.castShadow = true;
  const g = new THREE.Group(); g.add(bodies, heads);
  g.userData.crowd = bodies;
  return g;
}

function grandstand(d, P, H, rnd) {
  const g = new THREE.Group();
  const rows = 7, w = 34;
  const face = Math.atan2(d.face[0], d.face[1]);
  const base = P(d.x, d.y, H(d.x, d.y));
  const mat = std('#e8e8e8', 0.6);
  const green = std('#1f5a33', 0.8);
  const pos = [];
  for (let r = 0; r < rows; r++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(w, 0.6, 1.4), r % 2 ? mat : green);
    step.position.set(0, r * 0.75 + 0.3, r * 1.4);
    step.castShadow = true; step.receiveShadow = true;
    g.add(step);
    for (let i = 0; i < 26; i++) if (rnd() < 0.85) pos.push([-w / 2 + 0.8 + i * (w - 1.6) / 25 + (rnd() - 0.5) * 0.3, r * 0.75 + 0.6, r * 1.4, Math.PI]);
  }
  const back = new THREE.Mesh(new THREE.BoxGeometry(w, 6, 0.4), green);
  back.position.set(0, 3, rows * 1.4);
  g.add(back);
  const crowd = people(pos.length, pos, rnd);
  crowd.rotation.y = 0;
  g.add(crowd);
  g.position.copy(base);
  g.rotation.y = Math.atan2(-d.face[0], d.face[1]);
  return g;
}

function crowdLine(d, P, H, rnd) {
  const pos = [];
  const g = new THREE.Group();
  const face = Math.atan2(d.dir[1], -d.dir[0]);
  for (let i = 0; i < d.len; i++) {
    for (let r = 0; r < 2; r++) {
      if (rnd() < 0.3) continue;
      const t = i - d.len / 2;
      const x = d.x + d.dir[0] * t + (rnd() - 0.5) * 0.8 + d.dir[1] * r * 1.1 * Math.sign(d.x || 1) * 0;
      const y = d.y + d.dir[1] * t + (rnd() - 0.5) * 0.8;
      const p = P(x, y, H(x, y) - 0.05);
      pos.push([p.x + r * 0.9 * d.dir[1], p.y, p.z + r * 0.9 * d.dir[0], rnd() * 0.6 - 0.3 + face]);
    }
  }
  g.add(people(pos.length, pos, rnd));
  // rope line
  const ropeMat = std('#f0f0f0', 0.5);
  for (let i = 0; i < d.len; i += 6) {
    const t = i - d.len / 2;
    const x = d.x + d.dir[0] * t, y = d.y + d.dir[1] * t;
    const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1), ropeMat);
    stake.position.copy(P(x, y, H(x, y) + 0.5));
    g.add(stake);
  }
  return g;
}

function target(d, P, H) {
  const g = new THREE.Group();
  const cols = { 50: '#e53935', 100: '#fdd835', 150: '#1e88e5', 200: '#ffffff', 250: '#8e24aa', 300: '#fb8c00' };
  const col = cols[d.dist] || '#ffffff';
  const ring = new THREE.Mesh(new THREE.RingGeometry(5.5, 6.2, 40), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; g.add(ring);
  const ring2 = new THREE.Mesh(new THREE.RingGeometry(2.6, 3.0, 32), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
  ring2.rotation.x = -Math.PI / 2; g.add(ring2);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.6), std('#ffffff'));
  pole.position.y = 1.3; g.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), new THREE.MeshStandardMaterial({ color: col, side: THREE.DoubleSide }));
  flag.position.set(0.4, 2.3, 0); g.add(flag);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshBasicMaterial({ map: canvasTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = '#1c2a44'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#fff'; ctx.font = 'bold 40px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(String(d.dist), w / 2, 46);
  }), side: THREE.DoubleSide }));
  sign.position.set(-4, 1.2, 0); g.add(sign);
  g.position.copy(P(d.x, d.y, H(d.x, d.y) + 0.05));
  return g;
}

function cart(d, P, H) {
  const g = new THREE.Group();
  const white = std('#f4f4f4', 0.35, { metalness: 0.1 });
  const dark = std('#222222', 0.6);
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.55, 2.4), white);
  body.position.y = 0.55; g.add(body);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.3, 0.6), std('#6b4a2b', 0.7));
  seat.position.set(0, 0.95, 0.15); g.add(seat);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 2.0), white);
  roof.position.set(0, 2.0, 0.1); g.add(roof);
  for (const [x, z] of [[-0.6, -0.8], [0.6, -0.8], [-0.6, 0.9], [0.6, 0.9]]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), dark);
    post.position.set(x, 1.4, z * 0.9); g.add(post);
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 12), dark);
    wheel.rotation.z = Math.PI / 2; wheel.position.set(x * 1.05, 0.22, z); g.add(wheel);
  }
  const bag = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.9, 10), std('#1c2a44', 0.6));
  bag.position.set(0.3, 1.1, 1.1); bag.rotation.x = 0.3; g.add(bag);
  g.traverse(o => { o.castShadow = true; });
  g.position.copy(P(d.x, d.y, H(d.x, d.y)));
  g.rotation.y = d.rot;
  return g;
}

function bench(d, P, H) {
  const g = new THREE.Group();
  const wood = std('#7a5a3a', 0.8);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.08, 0.5), wood); seat.position.y = 0.5; g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.06), wood); back.position.set(0, 0.8, -0.25); g.add(back);
  const washer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 8), std('#1f5a33', 0.5)); washer.position.set(1.6, 0.55, 0); g.add(washer);
  g.traverse(o => { o.castShadow = true; });
  g.position.copy(P(d.x, d.y, H(d.x, d.y)));
  g.rotation.y = d.rot;
  return g;
}

function bridge(d, P, H, hole) {
  const g = new THREE.Group();
  const stone = std('#8f877a', 0.95);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(4, 0.9, 6, 16, Math.PI), stone);
  arch.scale.set(1, 0.45, 1.3);
  g.add(arch);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.35, 2.4), stone);
  deck.position.y = 1.9; deck.scale.set(1, 1, 1);
  g.add(deck);
  g.traverse(o => { o.castShadow = true; o.receiveShadow = true; });
  const lvl = hole.waterLevelAt(d.x, d.y) ?? H(d.x, d.y);
  g.position.copy(P(d.x, d.y, lvl - 0.2));
  g.rotation.y = Math.atan2(d.dir[0], d.dir[1]) + Math.PI / 2;
  return g;
}

function flowers(d, P, H, rnd, hole) {
  const n = 40;
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const mesh = new THREE.InstancedMesh(geo, std('#ffffff', 0.85), n);
  const m = new THREE.Matrix4(), c = new THREE.Color();
  const cols = ['#e0457b', '#f06aa0', '#c2185b', '#ffffff', '#f8bbd0', '#d81b60'];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const a = rnd() * 6.28, r = Math.sqrt(rnd()) * d.r;
    const x = d.x + Math.cos(a) * r, y = d.y + Math.sin(a) * r;
    const su = hole.surfAt(x, y);
    if (su === S.WATER || su === S.FAIRWAY || su === S.GREEN || su === S.SAND) continue;
    const s = 0.7 + rnd() * 0.9;
    m.makeScale(s * 1.2, s * 0.8, s * 1.2);
    m.setPosition(P(x, y, H(x, y) + s * 0.4));
    mesh.setMatrixAt(k, m);
    mesh.setColorAt(k, c.set(cols[Math.floor(rnd() * cols.length)]));
    k++;
  }
  mesh.count = k;
  mesh.castShadow = true;
  return mesh;
}

function gorse(d, P, H, rnd) {
  const n = Math.min(160, Math.floor(d.rx * d.ry / 8));
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const mesh = new THREE.InstancedMesh(geo, std('#ffffff', 0.95), n);
  const m = new THREE.Matrix4(), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const a = rnd() * 6.28, r = Math.sqrt(rnd());
    const lx = Math.cos(a) * r * d.rx, ly = Math.sin(a) * r * d.ry;
    const cr = Math.cos(d.rot), sr = Math.sin(d.rot);
    const x = d.x + lx * cr + ly * sr, y = d.y - lx * sr + ly * cr;
    const s = 1.0 + rnd() * 1.4;
    m.makeScale(s * 1.3, s * 0.8, s * 1.3);
    m.setPosition(P(x, y, H(x, y) + s * 0.3));
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, c.set(rnd() < 0.35 ? '#b5a52a' : '#3f5626'));
  }
  mesh.castShadow = true;
  return mesh;
}

function wall(d, P, H) {
  const g = new THREE.Group();
  const stone = std('#8a7f70', 0.95);
  const n = Math.floor(d.len / 4);
  for (let i = 0; i < n; i++) {
    const t = (i - n / 2) * 4;
    const x = d.x + d.dir[0] * t, y = d.y + d.dir[1] * t;
    const b = new THREE.Mesh(new THREE.BoxGeometry(4.1, 1.5, 0.6), stone);
    b.position.copy(P(x, y, H(x, y) + 0.6));
    b.rotation.y = Math.atan2(d.dir[1], -d.dir[0]) + Math.PI / 2;
    b.castShadow = true;
    g.add(b);
  }
  return g;
}

function hotel(d, P, H) {
  const g = new THREE.Group();
  const tex = windowsTexture('#8f7a60', '#4a3a2a');
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 2);
  const b = new THREE.Mesh(new THREE.BoxGeometry(70, 20, 22), std('#ffffff', 0.9, { map: tex }));
  b.position.y = 10; b.castShadow = true;
  g.add(b);
  // green sheds (the famous hotel sheds on 17)
  const shed = new THREE.Mesh(new THREE.BoxGeometry(40, 6, 10), std('#2f4f2f', 0.8));
  shed.position.set(0, 3, -25);
  shed.castShadow = true;
  g.add(shed);
  g.position.copy(P(d.x, d.y, H(d.x, d.y)));
  g.rotation.y = d.rot;
  return g;
}

function tufts(hole, P, H, rnd, wire) {
  const n = 2500;
  const geo = new THREE.ConeGeometry(0.35, 1, 5, 1, true);
  geo.translate(0, 0.5, 0);
  const mesh = new THREE.InstancedMesh(geo, std(wire ? '#a39a5a' : '#b3a563', 1, { side: THREE.DoubleSide }), n);
  const m = new THREE.Matrix4(), c = new THREE.Color();
  let k = 0;
  for (let i = 0; i < n * 6 && k < n; i++) {
    const x = hole.gx0 + rnd() * hole.gnx, y = hole.gy0 + rnd() * hole.gny;
    const su = hole.surfAt(x, y);
    if (!(su === S.DEEP || (wire && su === S.WASTE))) continue;
    const s = 0.6 + rnd() * 0.9;
    m.makeScale(s * 1.4, s * (wire ? 0.9 : 1.3), s * 1.4);
    m.setPosition(P(x, y, H(x, y) - 0.05));
    mesh.setMatrixAt(k, m);
    mesh.setColorAt(k, c.setHSL(0.14 + rnd() * 0.05, 0.35, 0.45 + rnd() * 0.15));
    k++;
  }
  mesh.count = k;
  return mesh;
}

function rocks(hole, P, H, rnd) {
  const n = 300;
  const geo = new THREE.DodecahedronGeometry(1, 0);
  const mesh = new THREE.InstancedMesh(geo, std('#6f675d', 0.95, { flatShading: true }), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  let k = 0;
  const side = hole.oceanSide, off = hole.oceanOff;
  for (let i = 0; i < n * 3 && k < n; i++) {
    const sPos = -40 + rnd() * (hole.L + 120);
    const [x, y] = hole.offset(sPos, side * (off + 1 + rnd() * 6));
    const lvl = hole.theme.seaLevel ?? -8;
    const sc = 0.8 + rnd() * 3;
    q.setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3));
    s.set(sc, sc * 0.8, sc);
    m.compose(P(x, y, Math.max(lvl, H(x, y)) - sc * 0.2), q, s);
    mesh.setMatrixAt(k++, m);
  }
  mesh.count = k;
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}
