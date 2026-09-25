// Procedural golfer model with a keyframe-free swing rig.
// Built in meters, facing +Z, target direction +X (right-handed golfer).
// Appearance is split into slots (top, bottom, shoes, hat, hair, face, beard, glove, acc)
// that cross-fade when changed, so edits never pop.
import * as THREE from 'three';
import { normalizeLook, SKIN_TONES } from '../data/look.js';
import { ALL_ITEMS } from '../data/apparel.js';
import { fabricTexture, logoTexture, knitTexture, contrast } from './apparelTex.js';
import { buildClubModel } from './clubModel.js';

const M2YD = 1 / 0.9144;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const FADE = 0.32;

function mat(color, rough = 0.75, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra });
}
function fabric(pattern, color, rough = 0.82, accent) {
  const map = fabricTexture(pattern, color, accent);
  return map ? mat('#ffffff', rough, { map }) : mat(color, rough);
}
const mesh = (geo, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); return o; };
const shadeHex = (hex, k) => { const c = new THREE.Color(hex); c.multiplyScalar(k); return `#${c.getHexString()}`; };

const FACE_SCALE = { oval: [0.92, 1.08, 1], round: [0.99, 1.01, 1], square: [0.97, 1.03, 0.98], long: [0.88, 1.16, 0.98], heart: [0.95, 1.07, 1] };
const JAW_SCALE = { normal: [0.95, 0.9, 1], narrow: [0.82, 0.95, 0.95], strong: [1.04, 0.84, 1.05], chiselled: [1.0, 0.96, 1.08] };
const EYE_SHAPE = { round: [1, 1, 0.034], almond: [1.2, 0.74, 0.035], narrow: [1.3, 0.56, 0.035], wide: [1.1, 0.84, 0.041] };
const BROW = { medium: [0.006, 0], thin: [0.0035, 0], thick: [0.0095, 0], arched: [0.006, 0.22], straight: [0.007, -0.04] };
const NOSE = { medium: [0.013, 1, 1, 1.15], small: [0.0105, 0.9, 0.9, 1], large: [0.017, 1.05, 1.1, 1.2], broad: [0.015, 1.45, 1, 1.05], narrow: [0.012, 0.72, 1.1, 1.25], button: [0.011, 1.1, 0.9, 0.9] };
const TOP_FIT = { Slim: 0.95, Fitted: 0.96, Athletic: 0.98, Standard: 1, Regular: 1, Classic: 1.01, Loose: 1.06, Relaxed: 1.07 };
const BOTTOM_FIT = { Slim: 0.9, Regular: 1, Relaxed: 1.13 };
const BIG_HAIR = new Set(['afro', 'quiff', 'wavy', 'curly', 'bun', 'medium', 'longwavy']);

export class Golfer {
  constructor(look, opts = {}) {
    this.root = new THREE.Group();
    this.model = new THREE.Group();
    this.model.scale.setScalar(M2YD);
    this.root.add(this.model);
    this.pose = { turn: 0, hip: 0, arm: 0, hinge: 0, head: 0, rise: 0, lean: 0, stand: 0 };
    this.clubCat = 'iron';
    this.clubLen = 0.95;
    this.fades = [];
    this.armSets = [];
    this.slots = {};
    this.sigs = {};
    this.shared = {
      skin: mat('#e0ac85', 0.6), lip: mat('#b06a5a', 0.55), hair: mat('#3b2a1c', 0.9), eye: mat('#4a2c16', 0.25),
    };
    for (const m of Object.values(this.shared)) m.userData.shared = true;
    this.colorT = {};
    this.buildRig();
    this.build(look);
    this.setClub('iron', 0.95);
  }

  // ---------- persistent skeleton ----------
  buildRig() {
    const m = this.model;
    this.legGroup = new THREE.Group(); m.add(this.legGroup);
    this.feet = new THREE.Group(); m.add(this.feet);
    const pelvis = this.pelvis = new THREE.Group();
    pelvis.position.set(0, 0.95, 0); m.add(pelvis);
    this.pelvisBody = new THREE.Group(); pelvis.add(this.pelvisBody);
    const spine = this.spine = new THREE.Group(); pelvis.add(spine);
    const torso = this.torso = new THREE.Group(); spine.add(torso);
    this.torsoBody = new THREE.Group(); torso.add(this.torsoBody);
    this.shoulderL = new THREE.Object3D(); this.shoulderL.position.set(0.2, 0.5, 0.02); torso.add(this.shoulderL);
    this.shoulderR = new THREE.Object3D(); this.shoulderR.position.set(-0.2, 0.5, 0.02); torso.add(this.shoulderR);
    const neck = mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.12, 12), this.shared.skin, 0, 0.64, 0);
    torso.add(neck);
    const head = this.head = new THREE.Group();
    head.position.y = 0.76; torso.add(head);
    const pivot = this.pivot = new THREE.Group();
    pivot.position.set(0, 0.47, 0.06); torso.add(pivot);
    const hands = this.hands = new THREE.Group();
    hands.position.set(0, -0.6, 0); pivot.add(hands);
    this.clubPivot = new THREE.Group(); hands.add(this.clubPivot);
    this.armGeo = new THREE.CylinderGeometry(1, 1, 1, 12);
    this.armGeo.translate(0, 0.5, 0);
    this.armGeo.userData.keep = true;
    neck.castShadow = true;
  }

  // ---------- appearance ----------
  build(look) { this.apply(look, false); }
  update(look) { this.apply(look, true); }

  apply(look, animate) {
    if (!animate) this.finishFades();
    const L = this.look = normalizeLook(look);
    const o = L.outfit;
    const fem = L.gender === 'F' ? 0.92 : 1;
    this.bodyT = { height: L.height ?? 1, build: L.build ?? 1, shoulders: (L.shoulders ?? 1) * fem, legs: L.legs ?? 1 };
    if (!animate || !this.body) this.body = { ...this.bodyT };
    const skin = SKIN_TONES[L.skin] ?? (typeof L.skin === 'string' ? L.skin : SKIN_TONES[2]);
    const colors = { skin, lip: mixHex(skin, '#9a3e3e', 0.35), hair: L.hairColor, eye: L.eyeColor };
    for (const [k, c] of Object.entries(colors)) {
      if (animate) this.colorT[k] = new THREE.Color(c);
      else { this.shared[k].color.set(c); delete this.colorT[k]; }
    }
    const hatOn = o.hat && o.hat.id !== 'hat-none';
    const want = {
      top: [o.top], bottom: [o.bottom], shoes: [o.shoes], hat: [o.hat], glove: [o.glove],
      hair: [L.hair, hatOn], face: [L.faceShape, L.jaw, L.eyeShape, L.brows, L.nose, L.mouth],
      beard: [L.facialHair, L.faceShape, L.jaw], acc: [L.accessory, L.faceShape],
    };
    for (const [slot, sig] of Object.entries(want)) {
      const s = JSON.stringify(sig);
      if (this.sigs[slot] === s && this.slots[slot]) continue;
      this.sigs[slot] = s;
      this.setSlot(slot, this['make_' + slot](L), animate);
    }
    this.applyPose();
  }

  // parts: array of [parent, group]; wraps each group so it can be faded/scaled independently
  setSlot(name, parts, animate) {
    const old = this.slots[name];
    const wrapped = parts.map(([parent, grp]) => {
      grp.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
      parent.add(grp);
      return grp;
    });
    this.slots[name] = wrapped;
    if (old) {
      if (animate) this.fade(old, 1, 0);
      else old.forEach(g => this.disposeGroup(g));
    }
    if (animate) this.fade(wrapped, 0, 1);
  }

  fade(groups, from, to) {
    const items = [];
    for (const g of groups) {
      g.traverse(o => {
        if (!o.isMesh) return;
        const orig = o.material;
        if (orig.userData.baseOpacity === undefined) { orig.userData.baseOpacity = orig.transparent ? orig.opacity : 1; orig.userData.wasTransparent = orig.transparent; }
        const m = orig.userData.shared ? orig.clone() : orig;
        m.transparent = true; m.opacity = from * orig.userData.baseOpacity;
        o.material = m;
        items.push({ o, orig, m });
      });
      g.scale.setScalar(from ? 1 : 0.975);
    }
    this.fades.push({ groups, items, from, to, t: 0 });
  }

  disposeGroup(g) {
    g.parent?.remove(g);
    g.traverse(o => {
      if (o.geometry && !o.geometry.userData.keep) o.geometry.dispose();
      if (o.material && !o.material.userData.shared) o.material.dispose();
    });
    this.armSets = this.armSets.filter(a => a.group !== g);
  }

  finishFades() { if (this.fades.length) { for (const f of this.fades) f.t = 1 - 1e-9; this.tick(1e-6 + FADE); } for (const k of Object.keys(this.colorT)) { this.shared[k].color.copy(this.colorT[k]); delete this.colorT[k]; } }

  // advance cross-fades and tweens (call every frame)
  tick(dt) {
    let posed = false;
    if (this.fades.length) {
      for (const f of this.fades) {
        f.t = Math.min(1, f.t + dt / FADE);
        const e = f.t * f.t * (3 - 2 * f.t);
        const a = lerp(f.from, f.to, e);
        for (const it of f.items) it.m.opacity = a * (it.orig.userData.baseOpacity ?? 1);
        for (const g of f.groups) g.scale.setScalar(f.to ? lerp(0.975, 1, e) : lerp(1, 1.025, e));
        if (f.t >= 1) {
          if (f.to === 0) f.groups.forEach(g => this.disposeGroup(g));
          else {
            for (const it of f.items) {
              if (it.m !== it.orig) { it.o.material = it.orig; it.m.dispose(); }
              else { it.m.opacity = it.orig.userData.baseOpacity ?? 1; it.m.transparent = !!it.orig.userData.wasTransparent; }
            }
          }
        }
      }
      this.fades = this.fades.filter(f => f.t < 1);
      posed = true;
    }
    const k = 1 - Math.exp(-dt * 9);
    for (const [key, c] of Object.entries(this.colorT)) {
      this.shared[key].color.lerp(c, k);
      for (const f of this.fades) for (const it of f.items) if (it.orig === this.shared[key]) it.m.color.copy(this.shared[key].color);
      if (Math.abs(this.shared[key].color.r - c.r) + Math.abs(this.shared[key].color.g - c.g) + Math.abs(this.shared[key].color.b - c.b) < 0.002) {
        this.shared[key].color.copy(c); delete this.colorT[key];
      }
    }
    if (this.bodyT) {
      let d = 0;
      for (const key of Object.keys(this.bodyT)) { const n = lerp(this.body[key], this.bodyT[key], k); d += Math.abs(n - this.body[key]); this.body[key] = Math.abs(n - this.bodyT[key]) < 1e-4 ? this.bodyT[key] : n; }
      if (d > 1e-5) posed = true;
    }
    if (posed) this.applyPose();
  }

  // ----- slot builders (return [[parent, group], ...]) -----
  make_top(L) {
    const t = L.outfit.top, it = ALL_ITEMS[t.id];
    const style = it.style, fitK = TOP_FIT[it.fit] || 1;
    const knit = style === 'sweater' || style === 'vest';
    const body = knit ? (t.pattern && t.pattern !== 'solid' ? fabric(t.pattern, t.color, 0.95) : mat('#ffffff', 0.95, { map: knitTexture(t.color) })) : fabric(t.pattern, t.color, 0.82);
    const g = new THREE.Group();
    const tucked = style === 'polo' || style === 'mock' || style === 'longsleeve';
    const chest = mesh(new THREE.CapsuleGeometry(0.17, 0.34, 6, 18), body, 0, tucked ? 0.32 : 0.29, 0);
    chest.scale.set(1.18 * fitK, 1, 0.72 * fitK);
    g.add(chest);
    const sh = mesh(new THREE.CapsuleGeometry(0.09, 0.3, 4, 12), body, 0, 0.5, 0);
    sh.rotation.z = Math.PI / 2; sh.scale.set(1, 1, 0.9);
    g.add(sh);
    const frontZ = (y) => { const c = tucked ? 0.32 : 0.29; const top = c + 0.17; const dy = Math.max(0, y - top); return Math.sqrt(Math.max(0, 0.0289 - dy * dy)) * 0.72 * fitK; };
    const under = style === 'vest' || style === 'sweater' ? mat('#f4f4f2', 0.8) : body; // polo collar under knitwear
    const collar = it.collar;
    const trim = mat(t.pattern === 'solid' || !t.pattern ? shadeHex(t.color, 0.88) : t.color, 0.85);
    if (collar === 'classic' || collar === 'buttondown' || style === 'vest' || style === 'sweater') {
      const cm = style === 'vest' || style === 'sweater' ? under : trim;
      const band = mesh(new THREE.CylinderGeometry(0.07, 0.092, 0.055, 20, 1, true), cm, 0, 0.615, 0.004);
      band.material.side = THREE.DoubleSide; g.add(band);
      for (const s of [-1, 1]) {
        const fz = frontZ(0.585);
        const tri = new THREE.Shape([new THREE.Vector2(0, 0.012), new THREE.Vector2(s * 0.05, 0.022), new THREE.Vector2(s * 0.016, -0.04)]);
        const flap = mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.004, bevelEnabled: false }), cm, s * 0.012, 0.585, fz + 0.002);
        flap.rotation.x = -0.32; g.add(flap);
        if (collar === 'buttondown') g.add(mesh(new THREE.SphereGeometry(0.004, 6, 4), mat('#e8e6df', 0.4), s * 0.05, 0.568, fz + 0.012));
      }
      if (style !== 'sweater') {
        const pl = mesh(new THREE.BoxGeometry(0.03, 0.1, 0.004), cm, 0, 0.52, frontZ(0.52) + 0.002);
        g.add(pl);
        for (let i = 0; i < 2; i++) g.add(mesh(new THREE.SphereGeometry(0.0055, 8, 6), mat('#e9e7e1', 0.35), 0, 0.545 - i * 0.04, frontZ(0.545 - i * 0.04) + 0.005));
      }
    }
    if (collar === 'mock') {
      g.add(mesh(new THREE.CylinderGeometry(0.072, 0.082, 0.07, 18), trim, 0, 0.63, 0.005));
    }
    if (collar === 'zip') {
      g.add(mesh(new THREE.CylinderGeometry(0.075, 0.088, 0.09, 18), body, 0, 0.635, 0.005));
      const zm = mat('#c8ccd1', 0.25, { metalness: 0.9 });
      g.add(mesh(new THREE.BoxGeometry(0.007, 0.21, 0.004), zm, 0, 0.56, frontZ(0.56) + 0.004));
      g.add(mesh(new THREE.BoxGeometry(0.012, 0.022, 0.006), zm, 0, 0.66, 0.088));
    }
    if (style === 'sweater' || style === 'vest') {
      const rib = mat(shadeHex(t.color, 0.82), 0.95);
      const neckR = mesh(new THREE.TorusGeometry(0.078, 0.013, 6, 20), rib, 0, 0.6, 0.012);
      neckR.rotation.x = Math.PI / 2 - 0.3; g.add(neckR);
      const hem = mesh(new THREE.CylinderGeometry(0.2 * fitK, 0.2 * fitK, 0.035, 20, 1, true), rib, 0, -0.02, 0);
      hem.scale.set(1.0, 1, 0.72 / 1.18 * 1.18); g.add(hem);
    }
    if (it.style === 'block' || t.pattern === 'block') { /* texture handles the color block */ }
    // chest logo (golfer's left = +X)
    const lt = logoTexture(it.brand, contrast(t.color));
    if (lt) {
      const lg = mesh(new THREE.PlaneGeometry(0.052, 0.026), new THREE.MeshStandardMaterial({ map: lt, transparent: true, roughness: 0.7, depthWrite: false }), 0.075, 0.46, frontZ(0.46) + 0.004);
      g.add(lg);
    }
    // arms
    const armG = new THREE.Group();
    const longS = it.sleeves === 'long';
    const sleeveMat = style === 'vest' ? under : body;
    const set = { group: armG, arms: [], long: longS };
    for (let i = 0; i < 2; i++) {
      const sleeve = new THREE.Mesh(this.armGeo, sleeveMat);
      const fore = new THREE.Mesh(this.armGeo, longS ? body : this.shared.skin);
      armG.add(sleeve, fore);
      let cuff = null;
      if (longS) { cuff = new THREE.Mesh(this.armGeo, style === 'sweater' || style === 'vest' ? mat(shadeHex(t.color, 0.82), 0.95) : trim); armG.add(cuff); }
      set.arms.push({ sleeve, fore, cuff });
    }
    this.armSets.push(set);
    return [[this.torsoBody, g], [this.model, armG]];
  }

  make_bottom(L) {
    const b = L.outfit.bottom, it = ALL_ITEMS[b.id];
    const pat = b.pattern === 'stripe' ? 'pinstripe' : b.pattern;
    const cloth = fabric(pat, b.color, 0.85);
    const fk = BOTTOM_FIT[b.fit] || 1;
    const legs = new THREE.Group();
    const style = it.style;
    for (const side of [-1, 1]) {
      const x = side * 0.12;
      if (style === 'shorts') {
        const skinT = mesh(new THREE.CapsuleGeometry(0.075, 0.36, 4, 10), this.shared.skin, x, 0.72, 0.03);
        skinT.rotation.x = -0.12; legs.add(skinT);
        const sh = mesh(new THREE.CylinderGeometry(0.098 * fk, 0.108 * fk, 0.3, 14), cloth, x, 0.75, 0.025);
        sh.rotation.x = -0.12; legs.add(sh);
        const shin = mesh(new THREE.CapsuleGeometry(0.06, 0.38, 4, 10), this.shared.skin, x * 1.05, 0.3, 0.06);
        shin.rotation.x = 0.16; legs.add(shin);
        legs.add(mesh(new THREE.CylinderGeometry(0.063, 0.063, 0.06, 12), mat('#f4f4f2', 0.9), x * 1.08, 0.1, 0.075));
      } else {
        const thigh = mesh(new THREE.CapsuleGeometry(0.086 * fk, 0.36, 4, 12), cloth, x, 0.72, 0.03);
        thigh.rotation.x = -0.12; legs.add(thigh);
        const taper = style === 'joggers' ? 0.84 : style === 'trousers' ? 1.04 : 0.94;
        const shin = mesh(new THREE.CylinderGeometry(0.075 * fk, 0.066 * fk * taper, 0.48, 12), cloth, x * 1.05, 0.33, 0.06);
        shin.rotation.x = 0.16; legs.add(shin);
        if (style === 'joggers') {
          legs.add(mesh(new THREE.CylinderGeometry(0.052, 0.05, 0.05, 12), mat(shadeHex(b.color, 0.75), 0.95), x * 1.08, 0.105, 0.078));
        }
        if (style === 'trousers') {
          const crease = mesh(new THREE.BoxGeometry(0.003, 0.46, 0.003), mat(shadeHex(b.color, 0.7), 0.9), x * 1.05, 0.33, 0.06 + 0.073 * fk);
          crease.rotation.x = 0.16; legs.add(crease);
        }
      }
    }
    const hips = new THREE.Group();
    const h = mesh(new THREE.CapsuleGeometry(0.15, 0.12, 4, 12), cloth);
    h.rotation.z = Math.PI / 2; h.scale.set(1, 1, 0.75 * (fk > 1 ? 1.03 : 1)); hips.add(h);
    const beltC = ['#1a1a1a', '#5a3a22', '#f1f1ee'][(it.name.length + (b.color.charCodeAt(2) || 0)) % 3 === 2 && b.color !== '#f1f1ee' ? 2 : ['#c6b58d', '#d8d0bf', '#e2cfa6', '#5b6139'].includes(b.color) ? 1 : 0];
    const belt = mesh(new THREE.CylinderGeometry(0.168, 0.168, 0.04, 20), mat(beltC, 0.4), 0, 0.085, 0);
    belt.scale.set(1.08, 1, 0.82); hips.add(belt);
    hips.add(mesh(new THREE.BoxGeometry(0.04, 0.03, 0.01), mat('#c9ccd1', 0.2, { metalness: 0.95 }), 0, 0.085, 0.14));
    return [[this.legGroup, legs], [this.pelvisBody, hips]];
  }

  make_shoes(L) {
    const s = L.outfit.shoes, it = ALL_ITEMS[s.id];
    const cw = it.colorways[s.colorway] || it.colorways[0];
    const g = new THREE.Group();
    const upper = mat(cw.upper, it.style === 'classic' ? 0.3 : 0.55);
    const accent = mat(cw.accent, 0.45);
    const sole = mat(cw.sole, 0.7);
    const spikes = s.spikes ?? it.spikes;
    const closure = s.closure || it.closure;
    for (const side of [-1, 1]) {
      const x = side * 0.132;
      const f = new THREE.Group(); f.position.set(x, 0, 0.1); f.rotation.y = side * 0.08; g.add(f);
      const up = mesh(new THREE.CapsuleGeometry(0.047, 0.15, 4, 14), upper, 0, 0.06, -0.01);
      up.rotation.x = Math.PI / 2; up.scale.set(1.0, 1, 0.95); f.add(up);
      const toeB = mesh(new THREE.SphereGeometry(0.047, 14, 10), upper, 0, 0.042, 0.085); toeB.scale.set(1, 0.72, 1.25); f.add(toeB);
      const heel = mesh(new THREE.SphereGeometry(0.048, 12, 8), upper, 0, 0.075, -0.08); heel.scale.set(0.98, 1.2, 0.9); f.add(heel);
      const so = mesh(new THREE.CapsuleGeometry(0.05, 0.19, 4, 14), sole, 0, 0.014, 0.0);
      so.rotation.x = Math.PI / 2; so.scale.set(1.02, 1, it.style === 'athletic' ? 0.34 : 0.26); f.add(so);
      if (it.style === 'classic') {
        const saddle = mesh(new THREE.CylinderGeometry(0.0485, 0.0485, 0.07, 16, 1, false, -Math.PI * 0.62, Math.PI * 1.24), accent, 0, 0.06, 0.0);
        saddle.rotation.x = Math.PI / 2; saddle.scale.set(1.02, 1, 0.96); f.add(saddle);
        const cap = mesh(new THREE.SphereGeometry(0.0475, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.35), accent, 0, 0.042, 0.085);
        cap.rotation.x = Math.PI / 2; cap.scale.set(1.01, 1.26, 0.73); f.add(cap);
      } else if (it.style === 'retro') {
        for (const sx of [-1, 1]) {
          const panel = mesh(new THREE.BoxGeometry(0.003, 0.03, 0.11), accent, sx * 0.047, 0.05, 0.0);
          f.add(panel);
        }
        f.add(mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), accent, 0, 0.07, -0.13));
      } else {
        for (const sx of [-1, 1]) {
          const sw = mesh(new THREE.BoxGeometry(0.003, 0.012, 0.12), accent, sx * 0.048, 0.05, 0.0);
          sw.rotation.x = -0.25; f.add(sw);
        }
        f.add(mesh(new THREE.BoxGeometry(0.094, 0.012, 0.05), accent, 0, 0.034, -0.1));
      }
      if (closure === 'boa') {
        const dial = mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.012, 14), mat('#1a1a1a', 0.3), 0, 0.1, 0.02);
        dial.rotation.x = -0.4; f.add(dial);
        f.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.014, 10), mat(cw.accent, 0.4), 0, 0.104, 0.021));
      } else {
        const lace = mat(cw.upper === '#141516' ? '#2b2d31' : '#f6f6f4', 0.8);
        for (let i = 0; i < 4; i++) f.add(mesh(new THREE.BoxGeometry(0.05, 0.005, 0.008), lace, 0, 0.098 - i * 0.004, 0.01 + i * 0.025));
      }
      if (spikes) {
        const sp = mat('#2a2c30', 0.6);
        for (const [sx, sz] of [[-0.03, 0.09], [0.03, 0.09], [0, 0.05], [-0.03, 0.01], [0.03, 0.01], [-0.025, -0.09], [0.025, -0.09]]) {
          f.add(mesh(new THREE.CylinderGeometry(0.008, 0.006, 0.008, 8), sp, sx, -0.002, sz));
        }
      }
      const lt = logoTexture(it.brand, cw.accent === cw.upper ? contrast(cw.upper) : cw.accent);
      if (lt) {
        const lg = mesh(new THREE.PlaneGeometry(0.05, 0.025), new THREE.MeshStandardMaterial({ map: lt, transparent: true, depthWrite: false }), side * 0.0495, 0.07, -0.075);
        lg.rotation.y = side * Math.PI / 2; f.add(lg);
      }
    }
    return [[this.feet, g]];
  }

  make_hat(L) {
    const h = L.outfit.hat;
    const g = new THREE.Group();
    if (!h || h.id === 'hat-none') return [[this.head, g]];
    g.position.set(0, 0.022, -0.004);
    const it = ALL_ITEMS[h.id];
    const style = it.style;
    const hm = style === 'panama' ? mat('#ffffff', 0.9, { map: fabricTexture('check', h.color || '#e8dcb5', '#b8a77a') }) : fabric(h.pattern, h.color, 0.72);
    const trim = mat(shadeHex(h.color, 0.8), 0.7);
    const fitH = h.fit === 'Unstructured' ? 0.86 : h.fit === 'Snapback' ? 1.06 : 1;
    let logoPos = null;
    if (style === 'cap' || style === 'golfcap' || style === 'perf' || style === 'flatbrim') {
      const tall = (style === 'flatbrim' ? 1.1 : style === 'perf' ? 0.9 : 1) * fitH;
      const crown = mesh(new THREE.SphereGeometry(0.118, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), hm, 0, 0.022, 0);
      crown.scale.set(0.97, 0.8 * tall, 1.05); g.add(crown);
      for (let i = 0; i < 6; i++) { // panel seams
        const seam = mesh(new THREE.TorusGeometry(0.119, 0.0012, 3, 16, Math.PI / 2), trim, 0, 0.022, 0);
        seam.rotation.set(0, i * Math.PI / 3, Math.PI / 2); seam.scale.set(0.8 * tall, 0.97, 1.05); g.add(seam);
      }
      g.add(mesh(new THREE.SphereGeometry(0.011, 8, 6), hm, 0, 0.022 + 0.118 * 0.8 * tall, 0));
      const flat = style === 'flatbrim';
      const brim = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.01, 20, 1, false, -Math.PI / 2, Math.PI), flat ? trim : hm, 0, 0.03, 0.078);
      brim.scale.set(flat ? 1.08 : 1, 1, flat ? 1.1 : 0.95); brim.rotation.x = flat ? 0.02 : 0.16; g.add(brim);
      if (!flat) { // curved brim edge
        const edge = mesh(new THREE.TorusGeometry(0.094, 0.006, 5, 18, Math.PI), hm, 0, 0.022, 0.078);
        edge.rotation.set(Math.PI / 2 + 0.16, 0, 0); edge.scale.set(1.02, 0.95, 1); g.add(edge);
      }
      if (style === 'golfcap') {
        const rope = mesh(new THREE.TorusGeometry(0.1, 0.004, 5, 20, Math.PI * 0.7), mat(contrast(h.color), 0.8), 0, 0.045, 0.02);
        rope.rotation.set(Math.PI / 2 + 0.2, 0, Math.PI * 0.15 + Math.PI); rope.rotation.z = -Math.PI * 0.85; g.add(rope);
      }
      if (style === 'perf') {
        for (const s of [-1, 1]) g.add(mesh(new THREE.CircleGeometry(0.018, 10), mat(shadeHex(h.color, 0.6), 0.8), s * 0.1, 0.07, -0.02).rotateY(s * Math.PI / 2));
      }
      if (h.fit === 'Snapback') {
        g.add(mesh(new THREE.BoxGeometry(0.05, 0.012, 0.01), mat('#1a1a1a', 0.5), 0, 0.035, -0.118));
      }
      logoPos = [0, 0.022 + 0.05 * tall, 0.104, -0.42];
    } else if (style === 'visor') {
      const band = mesh(new THREE.CylinderGeometry(0.113, 0.113, 0.04, 22, 1, true), hm, 0, 0.045, 0);
      band.scale.set(0.97, 1, 1.05); g.add(band);
      const brim = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.01, 20, 1, false, -Math.PI / 2, Math.PI), hm, 0, 0.03, 0.078);
      brim.rotation.x = 0.16; g.add(brim);
      logoPos = [0, 0.048, 0.118, 0];
    } else if (style === 'bucket') {
      const crown = mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.1 * fitH, 22), hm, 0, 0.085, 0);
      g.add(crown);
      const brim = mesh(new THREE.CylinderGeometry(0.125, 0.185, 0.05, 26, 1, true), hm, 0, 0.02, 0);
      brim.material.side = THREE.DoubleSide; g.add(brim);
      logoPos = [0, 0.075, 0.116, -0.1];
    } else if (style === 'flatcap') {
      const crown = mesh(new THREE.SphereGeometry(0.125, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.42), hm, 0, 0.03, 0.015);
      crown.scale.set(1, 0.72 * fitH, 1.15); g.add(crown);
      const brim = mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.01, 16, 1, false, -Math.PI / 2, Math.PI), hm, 0, 0.04, 0.09);
      brim.scale.set(1, 1, 0.6); g.add(brim);
    } else if (style === 'panama') {
      g.add(mesh(new THREE.CylinderGeometry(0.098, 0.116, 0.11 * fitH, 22), hm, 0, 0.095, 0));
      const brim = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.008, 28), hm, 0, 0.042, 0);
      g.add(brim);
      g.add(mesh(new THREE.CylinderGeometry(0.117, 0.117, 0.026, 22, 1, true), mat('#1a1a1a', 0.6), 0, 0.058, 0));
    }
    if (logoPos && h.logo !== false) {
      const lt = logoTexture(it.brand, contrast(h.color));
      if (lt) {
        const lg = mesh(new THREE.PlaneGeometry(0.07, 0.035), new THREE.MeshStandardMaterial({ map: lt, transparent: true, depthWrite: false }), logoPos[0], logoPos[1], logoPos[2] + 0.006);
        lg.rotation.x = logoPos[3]; g.add(lg);
      }
    }
    return [[this.head, g]];
  }

  make_hair(L) {
    const g = new THREE.Group();
    const style = L.hair;
    if (style === 'bald') return [[this.head, g]];
    const hm = this.shared.hair;
    const hatOn = L.outfit.hat && L.outfit.hat.id !== 'hat-none';
    const rMax = hatOn ? 0.109 : 1;
    const cap = (r, th, tilt = -0.62, sc = [0.95, 1.08, 1.04], y = 0.012) => {
      const c = mesh(new THREE.SphereGeometry(Math.min(r, rMax), 22, 14, 0, Math.PI * 2, 0, Math.PI * th), hm, 0, y, 0);
      c.rotation.x = tilt; c.scale.set(...sc); g.add(c); return c;
    };
    const blob = (r, x, y, z, sc = [1, 1, 1]) => { const b = mesh(new THREE.SphereGeometry(r, 10, 8), hm, x, y, z); b.scale.set(...sc); g.add(b); return b; };
    const big = BIG_HAIR.has(style) && !hatOn;
    switch (style) {
      case 'buzz': cap(0.108, 0.46, -0.5); break;
      case 'crew': cap(0.111, 0.5, -0.6); if (!hatOn) blob(0.03, 0, 0.09, 0.055, [2, 0.5, 1]); break;
      case 'short': cap(0.114, 0.52); break;
      case 'fade': cap(0.116, 0.36, -0.45, [0.95, 1.1, 1.04], 0.016); cap(0.1065, 0.5, -0.6); break;
      case 'sidepart': cap(0.114, 0.52); if (!hatOn) blob(0.06, 0.02, 0.09, 0.03, [1.5, 0.45, 1.3]); break;
      case 'slick': cap(0.116, 0.5, -0.66, [0.95, 1.02, 1.1], 0.01); break;
      case 'quiff': cap(0.114, 0.52); if (big) { const q = blob(0.05, 0, 0.1, 0.05, [1.5, 0.85, 1.1]); q.rotation.x = -0.4; } break;
      case 'crop': cap(0.114, 0.52); { const fr = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16, 1, false, -Math.PI * 0.3, Math.PI * 0.6), hm, 0, 0.068, 0.014); fr.scale.set(0.92, 1, 1.04); g.add(fr); } break;
      case 'medium': cap(big ? 0.12 : 0.115, 0.58, -0.75); if (big) for (const s of [-1, 1]) blob(0.045, s * 0.08, 0.0, -0.02, [0.6, 1.2, 1.2]); break;
      case 'wavy': cap(big ? 0.12 : 0.115, 0.58, -0.75); if (big) for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; blob(0.03, Math.cos(a) * 0.08, 0.085 + Math.sin(i * 2.3) * 0.012, Math.sin(a) * 0.08 - 0.02); } break;
      case 'curly':
        cap(0.114, 0.54, -0.65);
        if (big) for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; blob(0.034, Math.cos(a) * 0.086, 0.075 + Math.sin(i * 1.7) * 0.02, Math.sin(a) * 0.086 - 0.02); }
        break;
      case 'afro':
        if (big) { const a = cap(0.15, 0.62, -0.95, [1, 0.95, 1], 0.03); a.position.z = -0.03; } else cap(0.116, 0.54, -0.65);
        break;
      case 'long': case 'longwavy': {
        cap(0.117, 0.6, -0.8);
        const back = mesh(new THREE.CapsuleGeometry(0.09, 0.2, 4, 12), hm, 0, -0.08, -0.055); back.scale.set(1.12, 1, 0.55); g.add(back);
        for (const s of [-1, 1]) { const lock = mesh(new THREE.CapsuleGeometry(0.03, 0.14, 4, 8), hm, s * 0.088, -0.04, -0.015); lock.scale.set(0.8, 1, 1); g.add(lock); }
        if (style === 'longwavy') for (let i = 0; i < 7; i++) blob(0.028, (i - 3) * 0.028, -0.15 - (i % 2) * 0.015, -0.07);
        break;
      }
      case 'ponytail': {
        cap(0.115, 0.54, -0.66, [0.95, 1.06, 1.06], 0.01);
        g.add(mesh(new THREE.TorusGeometry(0.014, 0.005, 6, 10), mat('#1a1a1a', 0.6), 0, 0.005, -0.112));
        const tail = mesh(new THREE.CapsuleGeometry(0.032, 0.17, 4, 10), hm, 0, -0.08, -0.13); tail.rotation.x = 0.35; g.add(tail);
        break;
      }
      case 'bun': cap(0.115, 0.54, -0.66, [0.95, 1.05, 1.06], 0.01); if (big) blob(0.045, 0, 0.105, -0.075); else blob(0.04, 0, 0.0, -0.12); break;
      case 'bob': {
        cap(0.12, 0.58, -0.75);
        const sides = mesh(new THREE.CylinderGeometry(0.114, 0.126, 0.13, 22, 1, true, Math.PI * 0.32, Math.PI * 1.36), hm, 0, -0.03, -0.005);
        g.add(sides);
        break;
      }
      default: cap(0.114, 0.52);
    }
    // sideburns for short styles
    if (['crew', 'short', 'sidepart', 'slick', 'quiff', 'crop', 'fade', 'buzz'].includes(style)) {
      for (const s of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(0.01, 0.035, 0.018), hm, s * 0.094, -0.005, 0.01));
    }
    return [[this.head, g]];
  }

  faceScale(L) { return FACE_SCALE[L.faceShape] || FACE_SCALE.oval; }
  surfZ(L, x, y) {
    const [sx, sy, sz] = this.faceScale(L);
    const u = x / (sx * 0.105), v = y / (sy * 0.105);
    return sz * 0.105 * Math.sqrt(Math.max(0.05, 1 - u * u - v * v));
  }

  make_face(L) {
    const g = new THREE.Group();
    const sk = this.shared.skin;
    const fs = this.faceScale(L);
    const skull = mesh(new THREE.SphereGeometry(0.105, 26, 20), sk);
    skull.scale.set(...fs); g.add(skull);
    const js = [...(JAW_SCALE[L.jaw] || JAW_SCALE.normal)];
    if (L.faceShape === 'heart') js[0] *= 0.86;
    if (L.faceShape === 'square') js[0] *= 1.06;
    if (L.faceShape === 'long') js[1] *= 1.12;
    const jaw = mesh(new THREE.SphereGeometry(0.09, 20, 12, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), sk, 0, -0.03, 0.012);
    jaw.scale.set(...js); g.add(jaw);
    this.jawScale = js;
    for (const s of [-1, 1]) {
      const ear = mesh(new THREE.SphereGeometry(0.022, 10, 8), sk, s * 0.1 * fs[0], 0, 0);
      ear.scale.set(0.45, 1, 0.8); g.add(ear);
    }
    // eyes
    const [ex, ey, sp] = EYE_SHAPE[L.eyeShape] || EYE_SHAPE.almond;
    const white = mat('#f3f1ec', 0.3);
    const dark = mat('#0d0d0d', 0.2);
    for (const s of [-1, 1]) {
      const x = s * sp, y = 0.018, z = this.surfZ(L, x, y) - 0.006;
      const e = new THREE.Group(); e.position.set(x, y, z); e.rotation.y = s * 0.22; g.add(e);
      const w = mesh(new THREE.SphereGeometry(0.0175, 14, 10), white); w.scale.set(ex, ey, 0.55); e.add(w);
      const iris = mesh(new THREE.CircleGeometry(0.0092 * Math.min(1, ey * 1.25), 16), this.shared.eye, 0, 0, 0.0098); e.add(iris);
      e.add(mesh(new THREE.CircleGeometry(0.0042, 12), dark, 0, 0, 0.0101));
      e.add(mesh(new THREE.CircleGeometry(0.0014, 6), mat('#ffffff', 0.1, { emissive: '#ffffff', emissiveIntensity: 0.4 }), 0.0028, 0.0028, 0.0104));
      const lid = mesh(new THREE.SphereGeometry(0.0185, 14, 6, 0, Math.PI * 2, 0, Math.PI * 0.4), sk, 0, 0.001, 0); lid.scale.set(ex * 1.05, ey * 1.1, 0.62); e.add(lid);
      // brow
      const [bt, arch] = BROW[L.brows] || BROW.medium;
      const bx = x, by = 0.043 + (arch > 0 ? 0.003 : 0);
      const brow = mesh(new THREE.BoxGeometry(0.034, bt, 0.008), this.shared.hair, bx, by, this.surfZ(L, bx, by) + 0.001);
      brow.rotation.set(-0.2, s * 0.2, -s * (0.08 + arch * 0.5)); g.add(brow);
    }
    // nose
    const [nr, nsx, nsy, nsz] = NOSE[L.nose] || NOSE.medium;
    const nz = this.surfZ(L, 0, -0.01);
    const bridge = mesh(new THREE.BoxGeometry(0.014 * nsx, 0.04 * nsy, 0.02), sk, 0, 0.008, nz - 0.004);
    bridge.rotation.x = -0.25; g.add(bridge);
    const tip = mesh(new THREE.SphereGeometry(nr, 12, 10), sk, 0, -0.014, nz + nr * 0.35);
    tip.scale.set(nsx, nsy, nsz); if (L.nose === 'button') tip.rotation.x = -0.3; g.add(tip);
    for (const s of [-1, 1]) { const nost = mesh(new THREE.SphereGeometry(nr * 0.55, 8, 6), sk, s * nr * 0.8 * nsx, -0.02, nz + nr * 0.1); g.add(nost); }
    // mouth
    const my = -0.047, mz = this.surfZ(L, 0, my) + 0.004;
    const lip = this.shared.lip;
    const mouth = L.mouth;
    if (mouth === 'smile' || mouth === 'grin') {
      const sm = mesh(new THREE.TorusGeometry(0.019, mouth === 'grin' ? 0.0045 : 0.0028, 6, 14, Math.PI), lip, 0, my + 0.012, mz - 0.002);
      sm.rotation.z = Math.PI; sm.scale.set(1, 0.55, 1); g.add(sm);
      if (mouth === 'grin') { const teeth = mesh(new THREE.BoxGeometry(0.028, 0.006, 0.004), mat('#f6f4ee', 0.3), 0, my + 0.002, mz); g.add(teeth); }
    } else {
      const w = mouth === 'wide' ? 0.052 : 0.038, th = mouth === 'full' ? 0.009 : 0.005;
      g.add(mesh(new THREE.BoxGeometry(w, th, 0.008), lip, 0, my, mz - 0.002));
      if (mouth === 'full') g.add(mesh(new THREE.BoxGeometry(w * 0.9, 0.007, 0.008), lip, 0, my - 0.009, mz - 0.003));
    }
    return [[this.head, g]];
  }

  make_beard(L) {
    const g = new THREE.Group();
    const fh = L.facialHair;
    if (!fh || fh === 'none') return [[this.head, g]];
    const js = [...(JAW_SCALE[L.jaw] || JAW_SCALE.normal)];
    if (L.faceShape === 'heart') js[0] *= 0.86;
    if (L.faceShape === 'square') js[0] *= 1.06;
    if (L.faceShape === 'long') js[1] *= 1.12;
    const shell = (phiS, phiL, thS, thL, k, m) => {
      const s = mesh(new THREE.SphereGeometry(0.09, 20, 12, phiS, phiL, thS, thL), m, 0, -0.03, 0.012);
      s.scale.set(js[0] * k, js[1] * k, js[2] * k); g.add(s); return s;
    };
    const hm = this.shared.hair;
    const my = -0.047, mz = this.surfZ(L, 0, my);
    const stache = () => g.add(mesh(new THREE.BoxGeometry(0.046, 0.009, 0.012), hm, 0, my + 0.011, mz + 0.004));
    switch (fh) {
      case 'stubble': {
        const sm = mat(this.look.hairColor, 1, { transparent: true, opacity: 0.4, depthWrite: false });
        shell(-0.15, Math.PI + 0.3, Math.PI * 0.5, Math.PI * 0.5, 1.025, sm);
        break;
      }
      case 'mustache': stache(); break;
      case 'goatee': stache(); shell(Math.PI * 0.36, Math.PI * 0.28, Math.PI * 0.72, Math.PI * 0.28, 1.05, hm); break;
      case 'chinstrap': shell(-0.1, Math.PI + 0.2, Math.PI * 0.8, Math.PI * 0.2, 1.05, hm); for (const s of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(0.012, 0.07, 0.02), hm, s * 0.093 * js[0], -0.03, 0.02)); break;
      case 'short': stache(); shell(-0.1, Math.PI + 0.2, Math.PI * 0.62, Math.PI * 0.38, 1.05, hm); break;
      case 'full': stache(); shell(-0.2, Math.PI + 0.4, Math.PI * 0.52, Math.PI * 0.48, 1.1, hm); for (const s of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(0.014, 0.07, 0.03), hm, s * 0.095 * js[0], -0.02, 0.015)); break;
    }
    return [[this.head, g]];
  }

  make_glove(L) {
    const gl = L.outfit.glove;
    const g = new THREE.Group();
    const glove = mat(gl?.color || '#f4f4f2', 0.6);
    const l = mesh(new THREE.SphereGeometry(0.045, 12, 10), glove, 0, 0.03, 0); l.scale.set(1, 1.3, 1); g.add(l);
    const tab = mesh(new THREE.BoxGeometry(0.03, 0.018, 0.01), mat(contrast(gl?.color || '#f4f4f2'), 0.6), 0, 0.07, 0.04); g.add(tab);
    const r = mesh(new THREE.SphereGeometry(0.043, 12, 10), this.shared.skin, 0, -0.04, 0); r.scale.set(1, 1.3, 1); g.add(r);
    return [[this.hands, g]];
  }

  make_acc(L) {
    const g = new THREE.Group(), hg = new THREE.Group();
    const a = L.accessory;
    const fs = this.faceScale(L);
    if (a === 'sunglasses' || a === 'both') {
      const lens = mat('#1a2230', 0.08, { metalness: 0.7, envMapIntensity: 1.5 });
      const wrap = mesh(new THREE.CylinderGeometry(0.106 * fs[0] / 0.92, 0.106 * fs[0] / 0.92, 0.03, 24, 1, true, -Math.PI * 0.32, Math.PI * 0.64), lens, 0, 0.02, 0.0);
      wrap.scale.set(1, 1, fs[2] * 1.02); wrap.material.side = THREE.DoubleSide; g.add(wrap);
      for (const s of [-1, 1]) { const arm = mesh(new THREE.BoxGeometry(0.004, 0.006, 0.09), mat('#111', 0.3), s * 0.1 * fs[0], 0.025, -0.03); g.add(arm); }
    } else if (a === 'aviators') {
      const gold = mat('#c9a54a', 0.2, { metalness: 1 });
      const lens = mat('#3a2a1a', 0.05, { metalness: 0.5, transparent: true, opacity: 0.85 });
      for (const s of [-1, 1]) {
        const x = s * 0.036, z = this.surfZ(L, x, 0.012) + 0.012;
        const l = mesh(new THREE.CircleGeometry(0.02, 18), lens, x, 0.012, z); l.scale.set(1.1, 0.92, 1); l.rotation.y = s * 0.2; g.add(l);
        const rim = mesh(new THREE.TorusGeometry(0.02, 0.0018, 5, 20), gold, x, 0.012, z); rim.scale.set(1.1, 0.92, 1); rim.rotation.y = s * 0.2; g.add(rim);
        g.add(mesh(new THREE.BoxGeometry(0.003, 0.003, 0.1), gold, s * 0.098 * fs[0], 0.02, -0.02));
      }
      g.add(mesh(new THREE.BoxGeometry(0.024, 0.003, 0.003), gold, 0, 0.028, this.surfZ(L, 0, 0.028) + 0.012));
    }
    if (a === 'watch' || a === 'both') {
      const w = mesh(new THREE.TorusGeometry(0.036, 0.009, 6, 16), mat('#c8ccd1', 0.2, { metalness: 0.95 }), 0, 0.105, 0);
      w.rotation.x = Math.PI / 2; hg.add(w);
      const face = mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.008, 14), mat('#1c2a44', 0.2, { metalness: 0.5 }), 0, 0.105, 0.04);
      face.rotation.x = Math.PI / 2; hg.add(face);
    }
    return [[this.head, g], [this.hands, hg]];
  }

  // ---------- club ----------
  // club: optional { id, loft, look } for brand-accurate heads
  setClub(cat, len, club = null, animate = false) {
    this.clubCat = cat; this.clubLen = len;
    const cp = this.clubPivot;
    const old = this.club;
    if (old && animate) this.fade([old], 1, 0);
    else if (old) this.disposeGroup(old);
    const g = new THREE.Group();
    const model = buildClubModel({ cat, id: club?.id || (len > 1.12 ? 'DR' : ''), loft: club?.loft ?? { wood: 12, hybrid: 21, iron: 30, wedge: 54, putter: 3 }[cat], look: club?.look || {} }, len, { detail: 1 });
    model.position.y = 0.06;
    g.add(model);
    const head = model.userData.head;
    // lie: tilt shaft forward toward the ball, keep the sole flat
    const extra = cat === 'putter' ? 0.14 : cat === 'wood' ? 0.42 : cat === 'hybrid' ? 0.36 : cat === 'wedge' ? 0.24 : 0.3;
    g.rotation.x = -extra;
    head.rotation.x = extra;
    const toeC = { wood: len > 1.12 ? 0.06 : 0.048, hybrid: 0.04, iron: 0.039, wedge: 0.037, putter: 0.05 }[cat] ?? 0.04;
    const sweet = new THREE.Object3D(); sweet.position.set(0.024, 0.021, toeC);
    head.add(sweet);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    cp.add(g);
    this.club = g;
    this.clubHead = sweet;
    if (animate) this.fade([g], 0, 1);
    this.applyPose();
    this.computeAddressOffset();
  }

  // ---------- pose ----------
  applyBody() {
    const b = this.body || { height: 1, build: 1, shoulders: 1, legs: 1 };
    this.model.scale.setScalar(M2YD * b.height);
    this.legGroup.scale.set(b.build, b.legs, b.build);
    this.feet.scale.set(0.5 + b.build * 0.5, 1, 1);
    this.pelvisBody.scale.set(b.build, 1, b.build);
    this.torsoBody.scale.set(b.build * b.shoulders, 1, b.build);
    this.shoulderL.position.x = 0.2 * b.build * b.shoulders;
    this.shoulderR.position.x = -0.2 * b.build * b.shoulders;
    // keep the club head at ground level whatever the leg length
    this.hands.position.y = -(0.6 + 0.95 * (b.legs - 1) / 0.91);
    return b;
  }

  // pose params: turn (shoulders), hip, arm (swing angle), hinge, head, rise, lean, stand (0 address .. 1 upright)
  applyPose() {
    const p = this.pose;
    const b = this.applyBody();
    const putt = this.clubCat === 'putter';
    const s = p.stand || 0;
    this.pelvis.rotation.y = p.hip;
    this.pelvis.position.y = 0.95 * b.legs + p.rise * 0.05 + s * 0.02;
    this.pelvis.position.x = p.lean * 0.08;
    this.spine.rotation.x = lerp(putt ? 0.62 : 0.52 - p.rise * 0.25, 0.04, s);
    this.torso.rotation.y = p.turn - p.hip;
    this.head.rotation.y = p.head;
    this.head.rotation.x = lerp(-0.3 + p.rise * 0.3, 0.04, s);
    // arms hang ~vertically (forward of the chest), independent of spine tilt
    const armA = putt ? 0.16 : 0.42;
    this.pivot.rotation.x = lerp(-(armA + this.spine.rotation.x), -0.3, s);
    this.pivot.rotation.z = p.arm;
    this.clubPivot.rotation.z = p.hinge;
    this.clubPivot.rotation.x = s * 0.12;
    // update arms after matrices refresh
    this.root.updateMatrixWorld(true);
    const inv = this._inv || (this._inv = new THREE.Matrix4());
    inv.copy(this.model.matrixWorld).invert();
    const sL = new THREE.Vector3().setFromMatrixPosition(this.shoulderL.matrixWorld).applyMatrix4(inv);
    const sR = new THREE.Vector3().setFromMatrixPosition(this.shoulderR.matrixWorld).applyMatrix4(inv);
    const h = new THREE.Vector3().setFromMatrixPosition(this.hands.matrixWorld).applyMatrix4(inv);
    const up = new THREE.Vector3(0, 1, 0);
    const bw = b.build;
    [sL, sR].forEach((sh, i) => {
      const dir = new THREE.Vector3().subVectors(h, sh);
      const len = dir.length();
      dir.normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir);
      for (const set of this.armSets) {
        const a = set.arms[i];
        a.sleeve.position.copy(sh); a.sleeve.quaternion.copy(q);
        a.sleeve.scale.set(0.06 * bw, len * 0.45, 0.06 * bw);
        const mid = sh.clone().addScaledVector(dir, len * 0.45);
        a.fore.position.copy(mid); a.fore.quaternion.copy(q);
        a.fore.scale.set((set.long ? 0.049 : 0.043) * bw, len * (set.long ? 0.47 : 0.55), (set.long ? 0.049 : 0.043) * bw);
        if (a.cuff) {
          a.cuff.position.copy(sh).addScaledVector(dir, len * 0.86); a.cuff.quaternion.copy(q);
          a.cuff.scale.set(0.052 * bw, len * 0.07, 0.052 * bw);
        }
      }
    });
  }

  computeAddressOffset() {
    const saved = { ...this.pose };
    Object.assign(this.pose, { turn: 0, hip: 0, arm: 0, hinge: 0, head: 0, rise: 0, lean: 0, stand: 0 });
    this.applyPose();
    const p = new THREE.Vector3();
    this.clubHead.getWorldPosition(p);
    this.root.worldToLocal(p);
    this.addrOffset = p; // local (yards)
    Object.assign(this.pose, saved);
    this.applyPose();
  }

  // Place golfer so the club head sits at the ball, facing perpendicular to aim heading.
  placeAtBall(ballVec, heading) {
    // local +X -> world: (cos y, 0, -sin y) ; want (sin h, 0, -cos h) => y = pi/2 - h
    this.root.rotation.set(0, Math.PI / 2 - heading, 0);
    this.root.position.set(0, 0, 0);
    this.root.updateMatrixWorld(true);
    const off = this.addrOffset.clone().applyEuler(this.root.rotation);
    this.root.position.set(ballVec.x - off.x, ballVec.y - 0.02, ballVec.z - off.z);
    this.baseY = this.root.position.y;
  }

  // ---- swing animation helpers ----
  setBackswing(u) {
    const putt = this.clubCat === 'putter';
    if (putt) {
      Object.assign(this.pose, { turn: -0.12 * u, hip: 0, arm: -0.42 * u, hinge: 0, head: 0.12 * u, rise: 0, lean: 0, stand: 0 });
    } else {
      Object.assign(this.pose, {
        turn: -1.45 * u, hip: -0.62 * u, arm: -2.05 * u,
        hinge: -1.55 * smooth(0.12, 0.8, u), head: 1.0 * u, rise: 0.05 * u, lean: -0.3 * u, stand: 0,
      });
    }
    this.applyPose();
  }
  // f: 1 = at top (u), 0 = impact
  setDownswing(u, f) {
    const putt = this.clubCat === 'putter';
    if (putt) { this.setBackswing(u * f); return; }
    const top = { turn: -1.45 * u, hip: -0.62 * u, arm: -2.05 * u, hinge: -1.55 * smooth(0.12, 0.8, u), head: 1.0 * u, rise: 0.05 * u, lean: -0.3 * u };
    const imp = { turn: 0.25, hip: 0.5, arm: -0.1, hinge: 0, head: -0.2, rise: 0, lean: 0.5 };
    const g = 1 - f; // progress to impact
    const hipT = smooth(0, 0.6, g);
    const armT = g * g;
    const hingeT = smooth(0.45, 1, g);
    this.pose.turn = lerp(top.turn, imp.turn, smooth(0, 0.85, g));
    this.pose.hip = lerp(top.hip, imp.hip, hipT);
    this.pose.arm = lerp(top.arm, imp.arm, armT * 0.4 + g * 0.6);
    this.pose.hinge = lerp(top.hinge, imp.hinge, hingeT);
    this.pose.head = lerp(top.head, imp.head, g);
    this.pose.rise = lerp(top.rise, imp.rise, g);
    this.pose.lean = lerp(top.lean, imp.lean, hipT);
    this.pose.stand = 0;
    this.applyPose();
  }
  // v: 0 = impact, 1 = finish
  setFollow(v, putt = this.clubCat === 'putter', amp = 1) {
    if (putt) {
      Object.assign(this.pose, { turn: 0.14 * v * amp, hip: 0, arm: 0.5 * v * amp, hinge: 0, head: v > 0.6 ? (v - 0.6) * 1.2 : 0, rise: 0, lean: 0, stand: 0 });
    } else {
      const e = smooth(0, 1, v);
      Object.assign(this.pose, {
        turn: lerp(0.25, 1.65, e), hip: lerp(0.5, 1.35, e), arm: lerp(-0.1, 2.35 * amp + 0.2, e),
        hinge: lerp(0, 1.45, smooth(0.15, 0.85, v)), head: lerp(-0.2, 1.3, smooth(0.25, 0.9, v)),
        rise: lerp(0, 1, e), lean: lerp(0.5, 1.1, e), stand: 0,
      });
    }
    this.applyPose();
  }
  address() { this.setBackswing(0); }

  // fist-pump celebration: club raised overhead
  celebrate(t) {
    const pump = Math.max(0, Math.sin(t * 7));
    Object.assign(this.pose, { turn: 0.9, hip: 0.6, arm: 2.2 + pump * 0.5, hinge: 0.4, head: 0.5, rise: 1, lean: 0.4, stand: 0 });
    this.applyPose();
  }

  idle(t) {
    // gentle breathing/waggle
    const w = Math.sin(t * 1.4) * 0.03;
    this.pose.arm = -Math.max(0, Math.sin(t * 0.7)) * 0.06;
    this.pose.hinge = w;
    this.applyPose();
  }

  // relaxed upright showcase pose (locker room / customization)
  standIdle(t) {
    const br = Math.sin(t * 1.6);
    Object.assign(this.pose, { turn: 0.04 * Math.sin(t * 0.5), hip: 0.02 * Math.sin(t * 0.5 + 1), arm: 0.02 * br, hinge: 0, head: 0.06 * Math.sin(t * 0.37), rise: 0, lean: 0.05 * Math.sin(t * 0.45), stand: 1 });
    this.applyPose();
    this.torsoBody.scale.y = 1 + br * 0.006;
  }

  dispose() {
    this.root.traverse(o => { if (o.geometry && !o.geometry.userData.keep) o.geometry.dispose(); });
  }
}

function mixHex(a, b, t) { return `#${new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString()}`; }

export function clubLength(cat, id) {
  if (cat === 'putter') return 0.86;
  if (id === 'DR') return 1.15;
  if (cat === 'wood') return 1.08;
  if (cat === 'hybrid') return 1.0;
  const n = parseInt(id, 10);
  if (!isNaN(n)) return 0.99 - (n - 4) * 0.0125;
  return 0.9;
}
