// Procedural golf-club models (meters). Grip at y=0, club head at y=-len.
// Face points toward +X (target), toe extends toward +Z.
import * as THREE from 'three';

const M = (color, rough = 0.3, metal = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });

function bladeShape(w, h, toeUp = 0.012, round = 0.012) {
  // heel at z=0 -> toe at z=w, sole at y=0 -> top at y=h (toe higher)
  const s = new THREE.Shape();
  s.moveTo(0, 0.004);
  s.lineTo(w - round, 0);
  s.quadraticCurveTo(w + 0.004, 0.002, w, round + 0.004);
  s.lineTo(w - 0.002, h + toeUp - round);
  s.quadraticCurveTo(w - 0.004, h + toeUp, w - round * 1.6, h + toeUp);
  s.lineTo(0.012, h * 0.82);
  s.lineTo(0, h * 0.7);
  s.lineTo(0, 0.004);
  return s;
}

function grooves(group, w, h, x, count, color = '#555a61') {
  const mat = M(color, 0.6, 0.5);
  for (let i = 0; i < count; i++) {
    const g = new THREE.Mesh(new THREE.BoxGeometry(0.0006, 0.0012, w * 0.62), mat);
    g.position.set(x, 0.008 + i * (h * 0.72 / count), w * 0.52);
    group.add(g);
  }
}

// cat: wood|hybrid|iron|wedge|putter ; look: {crown, accent, face, finish, style}
export function buildHead(cat, look = {}, opts = {}) {
  const head = new THREE.Group();
  const detail = opts.detail ?? 1;
  const seg = detail > 0.5 ? 32 : 14;
  const loft = (opts.loft ?? 10) * Math.PI / 180;
  if (cat === 'wood' || cat === 'hybrid') {
    const big = opts.driver;
    const L = big ? 0.118 : cat === 'hybrid' ? 0.078 : 0.092; // heel-to-toe
    const D = big ? 0.108 : cat === 'hybrid' ? 0.062 : 0.078; // front-to-back
    const H = big ? 0.06 : cat === 'hybrid' ? 0.036 : 0.04;
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, seg, seg / 2), M(look.crown || '#16171a', 0.22, 0.55));
    body.scale.set(D, H, L);
    body.position.set(-D * 0.45, H * 0.52, L * 0.52);
    head.add(body);
    // flatten sole a bit with a plate
    const sole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.006, seg), M('#8d9197', 0.35, 0.9));
    sole.scale.set(D * 0.92, 1, L * 0.92); sole.position.set(-D * 0.45, 0.003, L * 0.52);
    head.add(sole);
    // face plate
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.004, H * 0.78, L * 0.72), M(look.face || '#4d5157', 0.45, 0.85));
    face.position.set(0.004, H * 0.46, L * 0.52);
    head.add(face);
    if (detail > 0.5) {
      // crown alignment accent + sole weight
      const acc = new THREE.Mesh(new THREE.BoxGeometry(D * 0.3, 0.002, 0.004), M(look.accent || '#c8102e', 0.4, 0.3));
      acc.position.set(-D * 0.2, H * 0.99, L * 0.52); head.add(acc);
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.012, 6, seg, Math.PI), M(look.accent || '#c8102e', 0.4, 0.4));
      band.scale.set(D * 0.9, L * 0.9, 1); band.rotation.set(Math.PI / 2, 0, Math.PI / 2); band.position.set(-D * 0.45, H * 0.35, L * 0.52);
      head.add(band);
      const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 16), M('#d9dce0', 0.2, 1));
      weight.rotation.z = Math.PI / 2; weight.position.set(-D * 0.92, H * 0.22, L * 0.5); head.add(weight);
    }
    const hosel = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.008, 0.05, 12), M('#1a1b1e', 0.4, 0.6));
    hosel.position.set(-0.006, H * 0.7, -0.004); hosel.rotation.x = 0.25;
    head.add(hosel);
  } else if (cat === 'iron' || cat === 'wedge') {
    const W = cat === 'wedge' ? 0.074 : 0.078, Hh = cat === 'wedge' ? 0.05 : 0.044;
    const style = look.style || 'cavity';
    const shape = bladeShape(W, Hh, cat === 'wedge' ? 0.016 : 0.01);
    const thick = style === 'blade' ? 0.008 : style === 'hollow' ? 0.02 : 0.013;
    const geo = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: true, bevelSize: 0.0018, bevelThickness: 0.0016, bevelSegments: 2, curveSegments: 10 });
    geo.rotateY(-Math.PI / 2); // extrude along -x (back of the face)
    const mat = M(look.finish || '#c9ccd1', cat === 'wedge' && look.finish === '#6b5b48' ? 0.7 : 0.18, 0.95);
    const blade = new THREE.Mesh(geo, mat);
    head.add(blade);
    if (detail > 0.5) {
      grooves(head, W, Hh, 0.0019, cat === 'wedge' ? 12 : 10);
      if (style !== 'blade') {
        const cav = new THREE.Mesh(new THREE.BoxGeometry(0.004, Hh * 0.42, W * 0.6), M('#2a2c30', 0.5, 0.6));
        cav.position.set(-thick - 0.001, Hh * 0.38, W * 0.5); head.add(cav);
        const badge = new THREE.Mesh(new THREE.BoxGeometry(0.002, Hh * 0.12, W * 0.28), M(look.accent || '#c8102e', 0.4, 0.3));
        badge.position.set(-thick - 0.0035, Hh * 0.4, W * 0.5); head.add(badge);
      }
    }
    const hosel = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0075, 0.06, 12), mat);
    hosel.position.set(-0.004, Hh * 0.9, -0.002); hosel.rotation.x = 0.35;
    head.add(hosel);
  } else {
    // putters
    const style = look.style || 'blade';
    const fin = M(look.finish || '#c7cbd0', 0.25, 0.95);
    if (style === 'mallet' || style === 'fang') {
      const g = new THREE.CylinderGeometry(0.058, 0.058, 0.022, seg, 1, false, 0, Math.PI);
      const mal = new THREE.Mesh(g, fin);
      mal.rotation.set(0, Math.PI / 2, 0); mal.position.set(-0.004, 0.011, 0.05);
      head.add(mal);
      if (style === 'fang') {
        for (const z of [0.02, 0.08]) {
          const prong = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, 0.018), fin);
          prong.position.set(-0.05, 0.01, z); head.add(prong);
        }
      }
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.001, 0.004), M(look.accent || '#ffffff', 0.5, 0));
      line.position.set(-0.03, 0.0225, 0.05); head.add(line);
    } else {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.024, 0.1), fin);
      blade.position.set(-0.006, 0.012, 0.05); head.add(blade);
      const flange = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.094), fin);
      flange.position.set(-0.028, 0.004, 0.05); head.add(flange);
      const dot = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.001, 0.002), M(look.accent || '#d7282f', 0.4, 0));
      dot.position.set(-0.022, 0.0085, 0.05); head.add(dot);
      if (style === 'mid') { flange.scale.set(1.8, 1, 1); flange.position.x = -0.04; }
    }
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.02, 0.09), M('#dadde1', 0.5, 0.7));
    face.position.set(0.0065, 0.012, 0.05); head.add(face);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.05, 10), fin);
    neck.position.set(-0.004, 0.035, 0.012); head.add(neck);
  }
  // loft: tilt the face up around the heel-toe axis
  const wrap = new THREE.Group();
  head.rotation.z = cat === 'putter' ? 0.05 : loft * 0.6;
  wrap.add(head);
  return wrap;
}

export function buildClubModel(club, len, opts = {}) {
  const cat = club.cat;
  const g = new THREE.Group();
  const graphite = cat === 'wood' || cat === 'hybrid';
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0085, len - 0.24, opts.detail > 0.5 ? 14 : 8),
    graphite ? M('#1d1f24', 0.35, 0.3) : M('#d4d8dd', 0.18, 0.95));
  shaft.position.y = -0.24 - (len - 0.24) / 2 + 0.02;
  g.add(shaft);
  if (graphite && opts.detail > 0.5) {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.0082, 0.0082, 0.12, 12), M(club.look?.accent || '#c8102e', 0.4, 0.3));
    band.position.y = -0.45; g.add(band);
  }
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.0135, 0.011, 0.26, 14), M('#18191b', 0.85, 0));
  grip.position.y = -0.1;
  g.add(grip);
  if (opts.detail > 0.5) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.0135, 0.0135, 0.006, 14), M('#e9e9e9', 0.6, 0));
    cap.position.y = 0.03; g.add(cap);
  }
  const head = buildHead(cat, club.look || {}, { driver: club.id === 'DR', loft: club.loft, detail: opts.detail ?? 0 });
  head.position.y = -len;
  g.add(head);
  g.userData.head = head;
  return g;
}
