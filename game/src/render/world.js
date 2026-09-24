import * as THREE from 'three';
import { createSky, sunDirection } from './sky.js';
import { buildTerrainTexture, detailTexture, waterNormalTexture } from './textures.js';
import { buildTrees, buildFarTrees } from './trees.js';
import { buildDecor } from './decor.js';
import { S } from '../core/holeGen.js';

// plan (x right, y forward, h up) -> three (x, h, -y)
export const P = (x, y, h) => new THREE.Vector3(x, h, -y);

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.05, 12000);
    this.clock = new THREE.Clock();
    this.time = 0;
    this.holeGroup = new THREE.Group();
    this.scene.add(this.holeGroup);
    this.fx = [];
    this.pmrem = new THREE.PMREMGenerator(r);
    this.setupLights();
    this.setupBall();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  setQuality(q) {
    this.quality = q;
    const dpr = window.devicePixelRatio || 1;
    const r = this.renderer;
    r.setPixelRatio(q === 'high' ? Math.min(dpr, 2) : q === 'medium' ? Math.min(dpr, 1.25) : 1);
    r.shadowMap.enabled = q !== 'low';
    const size = q === 'high' ? 2048 : 1024;
    if (this.sun.shadow.mapSize.x !== size) {
      this.sun.shadow.mapSize.set(size, size);
      if (this.sun.shadow.map) { this.sun.shadow.map.dispose(); this.sun.shadow.map = null; }
    }
    this.scene.traverse(o => { if (o.material) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { m.needsUpdate = true; }); } });
    this.resize();
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  setupLights() {
    this.hemi = new THREE.HemisphereLight(0xcfe6ff, 0x4a5a30, 1.1);
    this.scene.add(this.hemi);
    const sun = this.sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const c = sun.shadow.camera;
    c.left = -70; c.right = 70; c.top = 70; c.bottom = -70; c.near = 1; c.far = 900;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.05;
    this.scene.add(sun, sun.target);
  }

  setupBall() {
    const geo = new THREE.SphereGeometry(0.0233 * 1.0, 20, 14);
    this.ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, emissive: 0x222222 });
    this.ball = new THREE.Mesh(geo, this.ballMat);
    this.ball.castShadow = true;
    this.scene.add(this.ball);
    // oversized halo so the ball reads from far away
    const halo = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, depthWrite: false }));
    this.ballHalo = halo;
    this.scene.add(halo);
    // tracer
    this.trailMax = 1200;
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.trailMax * 3), 3));
    tg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.trailMax * 3), 3));
    tg.setDrawRange(0, 0);
    this.trail = new THREE.Line(tg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }));
    this.trail.frustumCulled = false;
    this.scene.add(this.trail);
    this.trailN = 0;
    // tee peg
    this.tee = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.002, 0.06, 6), new THREE.MeshStandardMaterial({ color: 0xf2f2f2 }));
    this.scene.add(this.tee);
  }

  setBallStyle(color) { this.ballMat.color.set(color || '#ffffff'); }

  setCourseEnv(course, theme) {
    this.theme = theme;
    if (this.sky) { this.scene.remove(this.sky); this.sky.geometry.dispose(); this.sky.material.dispose(); }
    this.sky = createSky(theme);
    this.scene.add(this.sky);
    this.scene.fog = new THREE.FogExp2(new THREE.Color(theme.fog), theme.fogDensity * 0.7);
    const sd = sunDirection(theme);
    this.sunDir = sd;
    this.sun.color.set(theme.sun.color);
    this.sun.intensity = theme.sun.intensity;
    this.hemi.color.set(theme.sky[1]);
    this.hemi.groundColor.set(theme.rough).multiplyScalar(0.6);
    // environment map from sky for reflections
    const envScene = new THREE.Scene();
    const s2 = createSky(theme);
    s2.scale.setScalar(0.01);
    envScene.add(s2);
    if (this.envRT) this.envRT.dispose();
    this.envRT = this.pmrem.fromScene(envScene, 0.02);
    this.scene.environment = this.envRT.texture;
    this.scene.environmentIntensity = 0.55;
  }

  clearHole() {
    const g = this.holeGroup;
    g.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(m => { if (m.map && m.map !== this._detail) m.map.dispose(); m.dispose(); });
      }
    });
    while (g.children.length) g.remove(g.children[0]);
    this.water = [];
  }

  loadHole(hole, info = {}) {
    this.clearHole();
    this.hideGrass();
    this.hole = hole;
    const g = this.holeGroup;
    g.add(this.buildTerrain(hole));
    g.add(this.buildFarTerrain(hole));
    for (const w of this.buildWater(hole)) g.add(w);
    g.add(buildTrees(hole, P));
    const far = buildFarTrees(hole, P, (x, y) => hole.heightFeatures(x, y, ...hole.nearest(x, y), true));
    if (far) g.add(far);
    const decor = buildDecor(hole, P, info);
    g.add(decor);
    this.crowds = [];
    decor.traverse(o => { if (o.userData.crowd) this.crowds.push(o); });
    g.add(this.buildFlag(hole));
    this.aimGroup = new THREE.Group();
    g.add(this.aimGroup);
    this.clearTrail();
  }

  buildTerrain(hole) {
    const STEP = 1.5;
    const nx = Math.floor((hole.gnx - 1) / STEP) + 1, ny = Math.floor((hole.gny - 1) / STEP) + 1;
    const pos = new Float32Array(nx * ny * 3), uv = new Float32Array(nx * ny * 2);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = hole.gx0 + i * STEP, y = hole.gy0 + j * STEP;
      const k = j * nx + i;
      pos[k * 3] = x; pos[k * 3 + 1] = hole.heightAt(x, y); pos[k * 3 + 2] = -y;
      uv[k * 2] = (x - hole.gx0) / (hole.gnx - 1);
      uv[k * 2 + 1] = (y - hole.gy0) / (hole.gny - 1);
    }
    const idx = new Uint32Array((nx - 1) * (ny - 1) * 6);
    let q = 0;
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
      idx[q++] = a; idx[q++] = b; idx[q++] = c;
      idx[q++] = b; idx[q++] = d; idx[q++] = c;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeVertexNormals();
    const map = buildTerrainTexture(hole);
    this.terrainCanvas = map.userData.canvas;
    const mat = new THREE.MeshStandardMaterial({ map, roughness: 0.93, metalness: 0 });
    this.addDetail(mat, 1.0);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.terrain = mesh;
    return mesh;
  }

  addDetail(mat, strength) {
    const det = this._detail = detailTexture();
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.detailMap = { value: det };
      sh.uniforms.detailStrength = { value: strength };
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed,1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nuniform sampler2D detailMap;\nuniform float detailStrength;')
        .replace('#include <map_fragment>', `#include <map_fragment>
          float d1 = texture2D(detailMap, vWPos.xz * 0.9).r;
          float d2 = texture2D(detailMap, vWPos.xz * 0.11).r;
          float d3 = texture2D(detailMap, vWPos.xz * 0.013).r;
          float camDist = length(vWPos - cameraPosition);
          float nearF = 1.0 - smoothstep(10.0, 60.0, camDist);
          diffuseColor.rgb *= mix(1.0, 0.72 + d1 * 0.56, detailStrength * (0.35 + 0.65 * nearF));
          diffuseColor.rgb *= mix(1.0, 0.86 + d2 * 0.28, detailStrength);
          diffuseColor.rgb *= 0.92 + d3 * 0.16;`);
    };
  }

  buildFarTerrain(hole) {
    const R = 2600, N = 160;
    const geo = new THREE.PlaneGeometry(R * 2, R * 2, N, N);
    geo.rotateX(-Math.PI / 2);
    const cx = hole.gx0 + hole.gnx / 2, cy = hole.gy0 + hole.gny / 2;
    geo.translate(cx, 0, -cy);
    const p = geo.attributes.position;
    const col = new Float32Array(p.count * 3);
    const base = new THREE.Color(hole.theme.deep).lerp(new THREE.Color(hole.theme.rough), 0.5);
    const tmp = [0, 0];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = -p.getZ(i);
      hole.nearest(x, y, tmp);
      let h = hole.heightFeatures(x, y, tmp[0], tmp[1], true);
      if (hole.inGrid(x, y)) {
        // tuck under the detailed terrain
        const ex = Math.min(x - hole.gx0, hole.gx0 + hole.gnx - 1 - x, y - hole.gy0, hole.gy0 + hole.gny - 1 - y);
        if (ex > 12) h -= 4;
      }
      p.setY(i, h);
      const v = 0.85 + 0.15 * hole.noise.noise(x / 90, y / 90);
      col[i * 3] = base.r * v; col[i * 3 + 1] = base.g * v; col[i * 3 + 2] = base.b * v;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
    this.addDetail(mat, 0.8);
    const m = new THREE.Mesh(geo, mat);
    m.receiveShadow = true;
    return m;
  }

  buildWater(hole) {
    const out = [];
    const T = hole.theme;
    const normal = waterNormalTexture();
    const mk = (geo, color) => {
      const c = new THREE.Color(color);
      const hsl = {}; c.getHSL(hsl);
      c.setHSL(hsl.h, Math.min(1, hsl.s * 1.1), Math.min(0.5, hsl.l * 1.35));
      const mat = new THREE.MeshStandardMaterial({
        color: c, roughness: 0.1, metalness: 0.35,
        normalMap: normal, normalScale: new THREE.Vector2(0.3, 0.3),
        envMapIntensity: 1.6,
      });
      const m = new THREE.Mesh(geo, mat);
      m.receiveShadow = true;
      this.water.push(m);
      return m;
    };
    let hasOcean = false;
    for (const sh of hole.waterShapes) {
      if (sh.kind === 'ocean') { hasOcean = true; continue; }
      // masked grid mesh
      const STEP = 2;
      const verts = [], idx = [];
      let x0 = hole.gx0, x1 = hole.gx0 + hole.gnx - 1, y0 = hole.gy0, y1 = hole.gy0 + hole.gny - 1;
      if (sh.rad && !sh.band) { x0 = Math.max(x0, sh.cx - sh.rad - 6); x1 = Math.min(x1, sh.cx + sh.rad + 6); y0 = Math.max(y0, sh.cy - sh.rad - 6); y1 = Math.min(y1, sh.cy + sh.rad + 6); }
      const nx = Math.ceil((x1 - x0) / STEP) + 1, ny = Math.ceil((y1 - y0) / STEP) + 1;
      const inside = new Uint8Array(nx * ny);
      const tmp = [0, 0];
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const x = x0 + i * STEP, y = y0 + j * STEP;
        hole.nearest(x, y, tmp);
        inside[j * nx + i] = sh.sdf(x, y, tmp[0], tmp[1]) < 2.5 ? 1 : 0;
      }
      const vmap = new Int32Array(nx * ny).fill(-1);
      const vid = (i, j) => {
        const k = j * nx + i;
        if (vmap[k] < 0) { vmap[k] = verts.length / 3; verts.push(x0 + i * STEP, sh.level, -(y0 + j * STEP)); }
        return vmap[k];
      };
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        if (!(inside[j * nx + i] || inside[j * nx + i + 1] || inside[(j + 1) * nx + i] || inside[(j + 1) * nx + i + 1])) continue;
        const a = vid(i, j), b = vid(i + 1, j), c = vid(i, j + 1), d = vid(i + 1, j + 1);
        idx.push(a, b, c, b, d, c);
      }
      if (!idx.length) continue;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      const uvs = new Float32Array(verts.length / 3 * 2);
      for (let i = 0; i < verts.length / 3; i++) { uvs[i * 2] = verts[i * 3] / 30; uvs[i * 2 + 1] = verts[i * 3 + 2] / 30; }
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      out.push(mk(geo, T.water));
    }
    if (hasOcean) {
      const lvl = T.seaLevel ?? -8;
      const geo = new THREE.PlaneGeometry(9000, 9000, 1, 1);
      geo.rotateX(-Math.PI / 2);
      const uv = geo.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 300, uv.getY(i) * 300);
      const m = mk(geo, T.water);
      m.position.set(hole.G[0], lvl, -hole.G[1]);
      out.push(m);
      // surf foam line
    }
    return out;
  }

  buildFlag(hole) {
    const g = new THREE.Group();
    const [x, y] = hole.pin;
    const h = hole.pinH;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.4, 8), new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.4 }));
    pole.position.copy(P(x, y, h + 1.2));
    pole.castShadow = true;
    g.add(pole);
    const flagGeo = new THREE.PlaneGeometry(0.6, 0.4, 10, 4);
    flagGeo.translate(0.3, 0, 0);
    const flagCol = { augusta: '#f2c94c', pebble: '#c1121f', sawgrass: '#f2c94c', standrews: '#c1121f', oakmont: '#f2c94c', riviera: '#c1121f' }[hole.course.id] || '#c1121f';
    const flag = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({ color: flagCol, side: THREE.DoubleSide, roughness: 0.8 }));
    flag.position.copy(P(x, y, h + 2.15));
    flag.castShadow = true;
    this.flag = flag;
    this.flagBase = flagGeo.attributes.position.array.slice();
    g.add(flag);
    const cup = new THREE.Mesh(new THREE.CircleGeometry(0.059, 20), new THREE.MeshBasicMaterial({ color: 0x0a0a0a }));
    cup.rotation.x = -Math.PI / 2;
    cup.position.copy(P(x, y, h + 0.006));
    const [gx, gy] = hole.gradAt(x, y);
    cup.lookAt(cup.position.clone().add(new THREE.Vector3(-gx, 1, gy)));
    g.add(cup);
    const rim = new THREE.Mesh(new THREE.RingGeometry(0.059, 0.066, 24), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    rim.position.copy(cup.position); rim.quaternion.copy(cup.quaternion);
    g.add(rim);
    // big pin marker visible from far away
    this.pinMarker = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 }));
    this.pinMarker.position.copy(P(x, y, h + 0.05));
    g.add(this.pinMarker);
    return g;
  }

  // ---------- close-up grass around the ball ----------
  placeGrass(hole, cx, cy) {
    if (this.quality === 'low') return;
    const N = 9000;
    if (!this.grass) {
      const geo = new THREE.BufferGeometry();
      // single blade: thin triangle, height 1, width 0.06
      const pos = new Float32Array([-0.03, 0, 0, 0.03, 0, 0, 0.0, 1, 0.02, 0, 0, -0.03, 0, 0, 0.03, 0.02, 1, 0]);
      const col = new Float32Array([0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 1.1, 1.1, 1.0, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 1.1, 1.1, 1.0]);
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.9 });
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uTime = { value: 0 };
        this.grassUniforms = sh.uniforms;
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
          .replace('#include <begin_vertex>', `#include <begin_vertex>
            vec4 ip = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
            float sway = sin(uTime * 2.2 + ip.x * 0.7 + ip.z * 0.5) * 0.12 * position.y;
            transformed.x += sway; transformed.z += sway * 0.6;`);
      };
      this.grass = new THREE.InstancedMesh(geo, mat, N);
      this.grass.frustumCulled = false;
      this.grass.receiveShadow = true;
      this.scene.add(this.grass);
    }
    const T = hole.theme;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), c = new THREE.Color();
    const heights = { [S.ROUGH]: 0.09, [S.DEEP]: 0.22, [S.FIRSTCUT]: 0.05, [S.FAIRWAY]: 0.025, [S.TEE]: 0.02, [S.FRINGE]: 0.03, [S.STRAW]: 0.02 };
    const cols = { [S.ROUGH]: T.rough, [S.DEEP]: T.deep, [S.FIRSTCUT]: T.rough, [S.FAIRWAY]: T.fairway, [S.TEE]: T.tee, [S.FRINGE]: T.fringe, [S.STRAW]: T.straw };
    let k = 0;
    const R = 14;
    for (let i = 0; i < N * 1.5 && k < N; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * R;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      const su = hole.surfAt(x, y);
      const hh = heights[su];
      if (!hh) continue;
      const sc = hh * (0.6 + Math.random() * 0.8);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * 6.28);
      s.set(1 + Math.random(), sc, 1);
      m.compose(new THREE.Vector3(x, hole.heightAt(x, y) - 0.005, -y), q, s);
      this.grass.setMatrixAt(k, m);
      c.set(cols[su]).multiplyScalar(0.8 + Math.random() * 0.4);
      this.grass.setColorAt(k, c);
      k++;
    }
    this.grass.count = k;
    this.grass.instanceMatrix.needsUpdate = true;
    if (this.grass.instanceColor) this.grass.instanceColor.needsUpdate = true;
    this.grass.visible = true;
  }
  hideGrass() { if (this.grass) this.grass.visible = false; }

  // ---------- ball & trail ----------
  setBall(x, y, h, onTee = false) {
    this.ball.position.copy(P(x, y, h + 0.0233 + (onTee ? 0.03 : 0)));
    this.tee.visible = onTee;
    if (onTee) this.tee.position.copy(P(x, y, h + 0.02));
  }
  clearTrail() { this.trailN = 0; this.trail.geometry.setDrawRange(0, 0); }
  pushTrail(x, y, h, color) {
    if (this.trailN >= this.trailMax) return;
    const pa = this.trail.geometry.attributes.position, ca = this.trail.geometry.attributes.color;
    pa.setXYZ(this.trailN, x, h + 0.02, -y);
    ca.setXYZ(this.trailN, color[0], color[1], color[2]);
    this.trailN++;
    pa.needsUpdate = true; ca.needsUpdate = true;
    this.trail.geometry.setDrawRange(0, this.trailN);
  }

  // ---------- aim visuals ----------
  clearAim() {
    const g = this.aimGroup;
    if (!g) return;
    g.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    while (g.children.length) g.remove(g.children[0]);
  }
  showAim({ path, landing, radius, color = '#ffffff', ground = [] }) {
    this.clearAim();
    const g = this.aimGroup;
    if (path && path.length > 1) {
      const pts = path.map(p => P(p[0], p[1], p[2]));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const dashes = new THREE.LineDashedMaterial({ color, dashSize: 1.6, gapSize: 1.2, transparent: true, opacity: 0.85, depthTest: false });
      const line = new THREE.Line(geo, dashes);
      line.computeLineDistances();
      line.renderOrder = 10;
      g.add(line);
    }
    if (ground.length > 1) {
      const pts = ground.map(p => P(p[0], p[1], p[2] + 0.03));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, depthTest: false }));
      line.renderOrder = 10;
      g.add(line);
    }
    if (landing) {
      const [x, y, h] = landing;
      const ring = new THREE.Mesh(new THREE.RingGeometry(radius * 0.9, radius, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthTest: false }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(P(x, y, h + 0.15));
      ring.renderOrder = 11;
      g.add(ring);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.9, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthTest: false }));
      disc.rotation.x = -Math.PI / 2;
      disc.position.copy(ring.position);
      disc.renderOrder = 11;
      g.add(disc);
      const dot = new THREE.Mesh(new THREE.CircleGeometry(Math.max(0.3, radius * 0.08), 16), new THREE.MeshBasicMaterial({ color, depthTest: false }));
      dot.rotation.x = -Math.PI / 2;
      dot.position.copy(ring.position);
      dot.renderOrder = 12;
      g.add(dot);
      this.landingRing = ring;
    }
  }

  // Putting green slope grid: arrows showing fall line
  showSlopeGrid(hole, cx, cy, radius, strength = 1) {
    const g = this.aimGroup;
    const pts = [], cols = [];
    const step = radius > 12 ? 1.5 : 1;
    for (let y = cy - radius; y <= cy + radius; y += step) for (let x = cx - radius; x <= cx + radius; x += step) {
      if ((x - cx) ** 2 + (y - cy) ** 2 > radius * radius) continue;
      const su = hole.surfAt(x, y);
      if (su !== S.GREEN && su !== S.FRINGE) continue;
      const [gx, gy] = hole.gradAt(x, y);
      const m = Math.hypot(gx, gy);
      if (m < 0.002) continue;
      const len = Math.min(0.9, m * 22) * step * strength;
      const dx = -gx / m * len, dy = -gy / m * len;
      const h = hole.heightAt(x, y) + 0.03;
      const t = Math.min(1, m / 0.04);
      const c = new THREE.Color().setHSL(0.6 - t * 0.6, 0.9, 0.6);
      pts.push(x - dx / 2, h, -(y - dy / 2), x + dx / 2, hole.heightAt(x + dx / 2, y + dy / 2) + 0.03, -(y + dy / 2));
      cols.push(c.r * 0.5, c.g * 0.5, c.b * 0.5, c.r, c.g, c.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, depthTest: true }));
    g.add(lines);
  }

  // ---------- effects ----------
  spawnBurst(x, y, h, kind) {
    const n = kind === 'splash' ? 70 : kind === 'sand' ? 50 : kind === 'confetti' ? 220 : 20;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3), vel = [];
    const cols = new Float32Array(n * 3);
    const base = kind === 'splash' ? new THREE.Color('#e8f4ff') : kind === 'sand' ? new THREE.Color(this.theme?.sand || '#eee') : kind === 'leaves' ? new THREE.Color('#3d5a2a') : new THREE.Color('#8a6a4a');
    for (let i = 0; i < n; i++) {
      pos[i * 3] = x; pos[i * 3 + 1] = h; pos[i * 3 + 2] = -y;
      const a = Math.random() * Math.PI * 2;
      const sp = kind === 'confetti' ? 3 + Math.random() * 6 : 1 + Math.random() * 3;
      vel.push([Math.cos(a) * sp * 0.6, (kind === 'confetti' ? 8 : 3) + Math.random() * (kind === 'splash' ? 6 : 3), Math.sin(a) * sp * 0.6]);
      const c = kind === 'confetti' ? new THREE.Color().setHSL(Math.random(), 0.85, 0.6) : base;
      cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const mat = new THREE.PointsMaterial({ size: kind === 'confetti' ? 0.25 : kind === 'splash' ? 0.18 : 0.12, vertexColors: true, transparent: true, opacity: 1, depthWrite: false });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    this.scene.add(pts);
    this.fx.push({ pts, vel, life: kind === 'confetti' ? 4 : 1.6, t: 0, floor: h });
    if (kind === 'splash') {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.35, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(x, h + 0.02, -y);
      this.scene.add(ring);
      this.fx.push({ ring, life: 2, t: 0 });
    }
  }

  updateFx(dt) {
    for (let i = this.fx.length - 1; i >= 0; i--) {
      const f = this.fx[i];
      f.t += dt;
      if (f.pts) {
        const p = f.pts.geometry.attributes.position;
        for (let k = 0; k < f.vel.length; k++) {
          const v = f.vel[k];
          v[1] -= 9 * dt;
          p.setXYZ(k, p.getX(k) + v[0] * dt, Math.max(f.floor - 0.5, p.getY(k) + v[1] * dt), p.getZ(k) + v[2] * dt);
        }
        p.needsUpdate = true;
        f.pts.material.opacity = Math.max(0, 1 - f.t / f.life);
      }
      if (f.ring) {
        const s = 1 + f.t * 4;
        f.ring.scale.set(s, s, s);
        f.ring.material.opacity = Math.max(0, 0.8 - f.t / f.life);
      }
      if (f.t > f.life) {
        const o = f.pts || f.ring;
        this.scene.remove(o); o.geometry.dispose(); o.material.dispose();
        this.fx.splice(i, 1);
      }
    }
  }

  update(dt, focus) {
    this.time += dt;
    if (this.sky) this.sky.material.uniforms.time.value = this.time;
    if (this.grassUniforms) this.grassUniforms.uTime.value = this.time;
    // water animation
    for (const w of this.water || []) {
      const n = w.material.normalMap;
      if (n) { n.offset.x = this.time * 0.01; n.offset.y = this.time * 0.006; }
    }
    // flag wave
    if (this.flag) {
      const p = this.flag.geometry.attributes.position;
      const b = this.flagBase;
      const ws = this.windStrength ?? 0.5;
      for (let i = 0; i < p.count; i++) {
        const x = b[i * 3];
        p.setZ(i, Math.sin(x * 6 - this.time * (4 + ws * 6)) * 0.05 * x * (0.5 + ws));
      }
      p.needsUpdate = true;
      if (this.windDir !== undefined) this.flag.rotation.y = this.windDir;
    }
    // shadows follow the focus point
    if (focus) {
      const s = this.sun;
      const snap = 2;
      const fx = Math.round(focus.x / snap) * snap, fz = Math.round(focus.z / snap) * snap;
      s.target.position.set(fx, focus.y, fz);
      s.position.set(fx + this.sunDir.x * 400, focus.y + this.sunDir.y * 400, fz + this.sunDir.z * 400);
      s.target.updateMatrixWorld();
    }
    // ball halo scales with distance for visibility
    const d = this.camera.position.distanceTo(this.ball.position);
    const hs = Math.max(0.0233, d * 0.0035);
    this.ball.scale.setScalar(hs / 0.0233 > 1 ? Math.min(6, hs / 0.0233) : 1);
    this.updateFx(dt);
  }

  render() { this.renderer.render(this.scene, this.camera); }
}
