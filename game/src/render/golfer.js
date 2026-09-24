// Procedural golfer model with a keyframe-free swing rig.
// Built in meters, facing +Z, target direction +X (right-handed golfer).
import * as THREE from 'three';
import { SKIN_TONES } from '../data/golfers.js';

const M2YD = 1 / 0.9144;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function mat(color, rough = 0.75, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra });
}

function stripeTexture(a, b) {
  const c = document.createElement('canvas'); c.width = 16; c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = a; ctx.fillRect(0, 0, 16, 64);
  ctx.fillStyle = b; for (let i = 0; i < 64; i += 16) ctx.fillRect(0, i, 16, 6);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 3);
  return t;
}

export class Golfer {
  constructor(look) {
    this.root = new THREE.Group();
    this.model = new THREE.Group();
    this.model.scale.setScalar(M2YD);
    this.root.add(this.model);
    this.pose = { turn: 0, hip: 0, arm: 0, hinge: 0, head: 0, rise: 0, lean: 0 };
    this.clubCat = 'iron';
    this.clubLen = 0.95;
    this.build(look);
    this.setClub('iron', 0.95);
  }

  build(look) {
    const L = this.look = { ...look };
    const m = this.model;
    while (m.children.length) m.remove(m.children[0]);
    const build = L.build || 1;
    const fem = L.gender === 'F';
    const skin = mat(SKIN_TONES[L.skin] ?? L.skin ?? SKIN_TONES[1], 0.6);
    const shirtCol = L.shirtStyle === 'greenjacket' ? '#1f6b3a' : L.shirt;
    const shirt = L.shirtStyle === 'stripe'
      ? mat('#ffffff', 0.8, { map: stripeTexture(L.shirt, L.shirtAlt || '#1c2a44') })
      : mat(shirtCol, 0.8);
    const pants = mat(L.pants, 0.85);
    const shoe = mat(L.shoes, 0.4);
    const hatM = mat(L.hatColor, 0.7);
    const hairM = mat(L.hairColor, 0.9);
    const glove = mat(L.glove || '#ffffff', 0.6);
    this.mats = { skin, shirt, pants, shoe };
    const sw = (fem ? 0.9 : 1) * build; // shoulder width factor

    // legs (attached to root/model, feet planted)
    const legGroup = new THREE.Group();
    m.add(legGroup);
    const shorts = L.legs === 'shorts' || L.legs === 'skirt';
    for (const side of [-1, 1]) {
      const x = side * 0.12 * build;
      const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.085 * build, 0.36, 4, 10), pants);
      thigh.position.set(x, 0.72, 0.03); thigh.rotation.x = -0.12;
      legGroup.add(thigh);
      const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.065 * build, 0.38, 4, 10), shorts ? skin : pants);
      shin.position.set(x * 1.05, 0.3, 0.06); shin.rotation.x = 0.16;
      legGroup.add(shin);
      if (L.legs === 'plusfours') {
        const sock = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.2, 4, 8), mat('#b43b3b', 0.9));
        sock.position.set(x * 1.05, 0.22, 0.07); legGroup.add(sock);
      }
      const sh = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.28), shoe);
      sh.position.set(x * 1.1, 0.04, 0.1);
      legGroup.add(sh);
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.02, 0.29), mat('#222'));
      sole.position.set(x * 1.1, 0.005, 0.1); legGroup.add(sole);
    }
    if (L.legs === 'skirt') {
      const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.27, 0.36, 14), pants);
      sk.position.set(0, 0.82, 0.02); legGroup.add(sk);
    }
    if (L.legs === 'shorts') {
      for (const side of [-1, 1]) {
        const s = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * build, 0.11 * build, 0.3, 10), pants);
        s.position.set(side * 0.12 * build, 0.72, 0.02); legGroup.add(s);
      }
    }
    // pelvis
    const pelvis = this.pelvis = new THREE.Group();
    pelvis.position.set(0, 0.95, 0);
    m.add(pelvis);
    const hips = new THREE.Mesh(new THREE.CapsuleGeometry(0.15 * build, 0.12 * sw, 4, 10), pants);
    hips.rotation.z = Math.PI / 2; hips.scale.set(1, 1, 0.75);
    pelvis.add(hips);
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.165 * build, 0.165 * build, 0.04, 16), mat('#1a1a1a', 0.4));
    belt.position.y = 0.08; belt.scale.set(1.05, 1, 0.8); pelvis.add(belt);

    // torso (spine tilt applied here)
    const spine = this.spine = new THREE.Group();
    pelvis.add(spine);
    const torso = this.torso = new THREE.Group();
    spine.add(torso);
    const chestGeo = new THREE.CapsuleGeometry(0.17 * sw, 0.34, 6, 14);
    const chest = new THREE.Mesh(chestGeo, shirt);
    chest.position.y = 0.3; chest.scale.set(1.18, 1, 0.72);
    torso.add(chest);
    if (L.shirtStyle === 'vest') {
      const vest = new THREE.Mesh(chestGeo, mat(L.shirtAlt || '#1c2a44', 0.9));
      vest.position.y = 0.28; vest.scale.set(1.22, 0.92, 0.76); torso.add(vest);
    }
    if (L.shirtStyle === 'quarterzip' || L.shirtStyle === 'greenjacket') {
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.025, 6, 14), shirt);
      collar.rotation.x = Math.PI / 2; collar.position.y = 0.6; torso.add(collar);
    }
    const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.3 * sw, 4, 10), shirt);
    shoulders.rotation.z = Math.PI / 2; shoulders.position.y = 0.5; shoulders.scale.set(1, 1, 0.9);
    torso.add(shoulders);
    this.shoulderL = new THREE.Object3D(); this.shoulderL.position.set(0.2 * sw, 0.5, 0.02); torso.add(this.shoulderL);
    this.shoulderR = new THREE.Object3D(); this.shoulderR.position.set(-0.2 * sw, 0.5, 0.02); torso.add(this.shoulderR);
    // neck + head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 10), skin);
    neck.position.y = 0.64; torso.add(neck);
    const head = this.head = new THREE.Group();
    head.position.y = 0.76; torso.add(head);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 16), skin);
    skull.scale.set(0.92, 1.08, 1); head.add(skull);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), skin);
    nose.position.set(0, -0.01, 0.105); head.add(nose);
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), skin);
      ear.position.set(side * 0.097, 0, 0); ear.scale.set(0.5, 1, 0.8); head.add(ear);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), mat('#1a1a1a', 0.3));
      eye.position.set(side * 0.035, 0.02, 0.095); head.add(eye);
    }
    if (L.beard) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.4), hairM);
      b.position.set(0, -0.005, 0.01); b.scale.set(0.95, 1.05, 1.02); head.add(b);
    }
    // hair
    const hairStyle = L.hair;
    if (hairStyle !== 'bald') {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.112, 18, 12, 0, Math.PI * 2, 0, Math.PI * (hairStyle === 'buzz' ? 0.45 : 0.55)), hairM);
      cap.position.y = 0.012; cap.rotation.x = -0.25; cap.scale.set(0.95, 1.08, 1.04);
      head.add(cap);
      if (hairStyle === 'curly') {
        for (let i = 0; i < 14; i++) {
          const a = i / 14 * Math.PI * 2;
          const c = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), hairM);
          c.position.set(Math.cos(a) * 0.09, 0.07 + Math.sin(i * 1.7) * 0.02, Math.sin(a) * 0.09 - 0.01);
          head.add(c);
        }
      }
      if (hairStyle === 'long') {
        const back = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.18, 4, 10), hairM);
        back.position.set(0, -0.08, -0.05); back.scale.set(1.1, 1, 0.6); head.add(back);
      }
      if (hairStyle === 'ponytail') {
        const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.16, 4, 8), hairM);
        tail.position.set(0, -0.05, -0.12); tail.rotation.x = 0.5; head.add(tail);
      }
    }
    // hats
    const hat = L.hat;
    if (hat === 'cap' || hat === 'visor') {
      if (hat === 'cap') {
        const crown = new THREE.Mesh(new THREE.SphereGeometry(0.118, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), hatM);
        crown.position.y = 0.025; crown.scale.set(0.97, 0.9, 1.05); head.add(crown);
        const button = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 4), hatM); button.position.y = 0.13; head.add(button);
      } else {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.113, 0.113, 0.035, 18, 1, true), hatM);
        band.position.y = 0.045; head.add(band);
      }
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.012, 16, 1, false, -Math.PI / 2, Math.PI), hatM);
      brim.position.set(0, 0.035, 0.08); brim.scale.set(1, 1, 0.95); brim.rotation.x = 0.12; head.add(brim);
      const logo = new THREE.Mesh(new THREE.CircleGeometry(0.02, 12), mat('#ffffff', 0.5));
      logo.position.set(0, 0.08, 0.108); logo.rotation.x = -0.4; head.add(logo);
    } else if (hat === 'bucket' || hat === 'panama') {
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.118, 0.1, 18), hatM);
      crown.position.y = 0.09; head.add(crown);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.01, 22), hatM);
      brim.position.y = 0.045; head.add(brim);
      if (hat === 'panama') {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.119, 0.119, 0.025, 18, 1, true), mat('#1a1a1a'));
        band.position.y = 0.06; head.add(band);
      }
    } else if (hat === 'flatcap') {
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.125, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.42), hatM);
      crown.position.set(0, 0.03, 0.015); crown.scale.set(1, 0.7, 1.15); head.add(crown);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.01, 16, 1, false, -Math.PI / 2, Math.PI), hatM);
      brim.position.set(0, 0.04, 0.09); brim.scale.set(1, 1, 0.6); head.add(brim);
    }
    if (L.accessory === 'sunglasses' || L.accessory === 'both' || L.glasses) {
      const g = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.035, 0.02), mat('#101010', 0.1, { metalness: 0.6 }));
      g.position.set(0, 0.02, 0.1); head.add(g);
    }

    // swing pivot at sternum
    const pivot = this.pivot = new THREE.Group();
    pivot.position.set(0, 0.47, 0.06);
    torso.add(pivot);
    const hands = this.hands = new THREE.Group();
    hands.position.set(0, -0.6, 0);
    pivot.add(hands);
    const gl = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), L.gloveModel === 'none' ? skin : glove);
    gl.scale.set(1, 1.3, 1); gl.position.y = 0.03; hands.add(gl);
    const hr = new THREE.Mesh(new THREE.SphereGeometry(0.043, 10, 8), skin);
    hr.scale.set(1, 1.3, 1); hr.position.y = -0.04; hands.add(hr);
    if (L.accessory === 'watch' || L.accessory === 'both') {
      const w = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 6, 12), mat('#c9b037', 0.3, { metalness: 0.9 }));
      w.position.set(0, 0.1, 0); w.rotation.x = Math.PI / 2; hands.add(w);
    }
    this.clubPivot = new THREE.Group();
    hands.add(this.clubPivot);

    // arms (dynamic)
    const armGeo = new THREE.CylinderGeometry(1, 1, 1, 10);
    armGeo.translate(0, 0.5, 0);
    this.arms = [];
    for (let i = 0; i < 2; i++) {
      const sleeve = new THREE.Mesh(armGeo, L.shirtStyle === 'vest' ? mat(L.shirt, 0.8) : shirt);
      const fore = new THREE.Mesh(armGeo, L.shirtStyle === 'quarterzip' || L.shirtStyle === 'greenjacket' ? shirt : skin);
      m.add(sleeve, fore);
      this.arms.push({ sleeve, fore });
    }
    this.root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
    this.applyPose();
  }

  setClub(cat, len) {
    this.clubCat = cat; this.clubLen = len;
    const cp = this.clubPivot;
    while (cp.children.length) cp.remove(cp.children[0]);
    const club = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.008, len, 8), mat('#cfd3d8', 0.25, { metalness: 0.9 }));
    shaft.position.y = -len / 2 + 0.08;
    club.add(shaft);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.26, 10), mat('#1b1b1b', 0.8));
    grip.position.y = 0.02; club.add(grip);
    let head;
    if (cat === 'wood') {
      const big = len > 1.1;
      head = new THREE.Mesh(new THREE.SphereGeometry(big ? 0.062 : 0.048, 16, 10), mat('#18191c', 0.25, { metalness: 0.6 }));
      head.scale.set(1.0, 0.6, 1.25);
      head.position.set(0, -len + 0.06, 0.045);
    } else if (cat === 'hybrid') {
      head = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 10), mat('#202226', 0.3, { metalness: 0.6 }));
      head.scale.set(0.8, 0.65, 1.4);
      head.position.set(0, -len + 0.06, 0.04);
    } else if (cat === 'putter') {
      head = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.028, 0.11), mat('#b8bcc2', 0.2, { metalness: 0.95 }));
      head.position.set(0, -len + 0.08, 0.035);
    } else {
      head = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, 0.085), mat('#c9ccd1', 0.15, { metalness: 0.95 }));
      head.position.set(0, -len + 0.08, 0.035);
      head.rotation.x = 0.2;
    }
    head.castShadow = true; shaft.castShadow = true;
    club.add(head);
    this.clubHead = head;
    // lie: tilt shaft forward toward the ball
    const extra = cat === 'putter' ? 0.14 : cat === 'wood' ? 0.42 : cat === 'hybrid' ? 0.36 : cat === 'wedge' ? 0.24 : 0.3;
    club.rotation.x = -extra;
    cp.add(club);
    this.club = club;
    this.applyPose();
    this.computeAddressOffset();
  }

  // pose params: turn (shoulders), hip, arm (swing angle), hinge, head, rise, lean
  applyPose() {
    const p = this.pose;
    const putt = this.clubCat === 'putter';
    this.pelvis.rotation.y = p.hip;
    this.pelvis.position.y = 0.95 + p.rise * 0.05;
    this.pelvis.position.x = p.lean * 0.08;
    this.spine.rotation.x = putt ? 0.62 : 0.52 - p.rise * 0.25;
    this.torso.rotation.y = p.turn - p.hip;
    this.head.rotation.y = p.head;
    this.head.rotation.x = -0.3 + p.rise * 0.3;
    // arms hang ~vertically (forward of the chest), independent of spine tilt
    const armA = putt ? 0.16 : 0.42;
    this.pivot.rotation.x = -(armA + this.spine.rotation.x);
    this.pivot.rotation.z = p.arm;
    this.clubPivot.rotation.z = p.hinge;
    // update arms after matrices refresh
    this.root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(this.model.matrixWorld).invert();
    const sL = new THREE.Vector3().setFromMatrixPosition(this.shoulderL.matrixWorld).applyMatrix4(inv);
    const sR = new THREE.Vector3().setFromMatrixPosition(this.shoulderR.matrixWorld).applyMatrix4(inv);
    const h = new THREE.Vector3().setFromMatrixPosition(this.hands.matrixWorld).applyMatrix4(inv);
    const up = new THREE.Vector3(0, 1, 0);
    [sL, sR].forEach((s, i) => {
      const a = this.arms[i];
      const dir = new THREE.Vector3().subVectors(h, s);
      const len = dir.length();
      dir.normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir);
      a.sleeve.position.copy(s); a.sleeve.quaternion.copy(q);
      a.sleeve.scale.set(0.058, len * 0.45, 0.058);
      const mid = s.clone().addScaledVector(dir, len * 0.45);
      a.fore.position.copy(mid); a.fore.quaternion.copy(q);
      a.fore.scale.set(0.043, len * 0.55, 0.043);
    });
  }

  computeAddressOffset() {
    const saved = { ...this.pose };
    Object.assign(this.pose, { turn: 0, hip: 0, arm: 0, hinge: 0, head: 0, rise: 0, lean: 0 });
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
    // target (+X local) must point along heading; golfer faces +Z local
    // world forward for plan heading: (sin h, 0, -cos h)
    const yaw = Math.atan2(-Math.cos(heading), -Math.sin(heading)); // rotate +X to heading
    this.root.rotation.set(0, yaw + Math.PI, 0);
    this.root.rotation.y = -heading + Math.PI / 2 - Math.PI / 2;
    // local +X -> world: (cos y, 0, -sin y) ; want (sin h, 0, -cos h) => y = pi/2 - h
    this.root.rotation.y = Math.PI / 2 - heading;
    this.root.position.set(0, 0, 0);
    this.root.updateMatrixWorld(true);
    const off = this.addrOffset.clone().applyEuler(this.root.rotation);
    this.root.position.set(ballVec.x - off.x, ballVec.y - this.addrOffset.y * 0 - 0.02, ballVec.z - off.z);
    this.baseY = this.root.position.y;
  }

  // ---- swing animation helpers ----
  setBackswing(u) {
    const putt = this.clubCat === 'putter';
    if (putt) {
      Object.assign(this.pose, { turn: -0.12 * u, hip: 0, arm: -0.42 * u, hinge: 0, head: 0.12 * u, rise: 0, lean: 0 });
    } else {
      Object.assign(this.pose, {
        turn: -1.45 * u, hip: -0.62 * u, arm: -2.05 * u,
        hinge: -1.55 * smooth(0.12, 0.8, u), head: 1.0 * u, rise: 0.05 * u, lean: -0.3 * u,
      });
    }
    this.applyPose();
  }
  // f: 1 = at top (u), 0 = impact
  setDownswing(u, f) {
    const putt = this.clubCat === 'putter';
    if (putt) { this.setBackswing(u * f); return; }
    const top = { turn: -1.45 * u, hip: -0.62 * u, arm: -2.05 * u, hinge: -1.55 * smooth(0.12, 0.8, u), head: 1.0 * u, rise: 0.05 * u, lean: -0.3 * u };
    const imp = { turn: 0.3, hip: 0.55, arm: 0.05, hinge: 0, head: -0.2, rise: 0, lean: 0.6 };
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
    this.applyPose();
  }
  // v: 0 = impact, 1 = finish
  setFollow(v, putt = this.clubCat === 'putter', amp = 1) {
    if (putt) {
      Object.assign(this.pose, { turn: 0.14 * v * amp, hip: 0, arm: 0.5 * v * amp, hinge: 0, head: v > 0.6 ? (v - 0.6) * 1.2 : 0, rise: 0, lean: 0 });
    } else {
      const e = smooth(0, 1, v);
      Object.assign(this.pose, {
        turn: lerp(0.3, 1.65, e), hip: lerp(0.55, 1.35, e), arm: lerp(0.05, 2.35 * amp + 0.2, e),
        hinge: lerp(0, 1.45, smooth(0.15, 0.85, v)), head: lerp(-0.2, 1.3, smooth(0.25, 0.9, v)),
        rise: lerp(0, 1, e), lean: lerp(0.6, 1.1, e),
      });
    }
    this.applyPose();
  }
  address() { this.setBackswing(0); }

  idle(t) {
    // gentle breathing/waggle
    const w = Math.sin(t * 1.4) * 0.03;
    this.pose.arm = -Math.max(0, Math.sin(t * 0.7)) * 0.06;
    this.pose.hinge = w;
    this.applyPose();
  }

  dispose() {
    this.root.traverse(o => { if (o.geometry) o.geometry.dispose(); });
  }
}

export function clubLength(cat, id) {
  if (cat === 'putter') return 0.86;
  if (id === 'DR') return 1.15;
  if (cat === 'wood') return 1.08;
  if (cat === 'hybrid') return 1.0;
  const n = parseInt(id, 10);
  if (!isNaN(n)) return 0.99 - (n - 4) * 0.0125;
  return 0.9;
}
