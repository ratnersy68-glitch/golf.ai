// Procedural golf stand bag (+ optional driver headcover) and a golf ball, for the Pro Shop preview
// and for standing beside the golfer on the tee. Units: metres, bag base at the origin, +Y up.
import * as THREE from 'three';
import { BAGS, HEADCOVERS } from '../data/shop.js';

const mat = (color, rough = 0.7, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

export function buildGolfBag(bagId = 'bag-basic', headcoverId = 'hc-none', { detail = 1 } = {}) {
  const def = BAGS.find(b => b.id === bagId) || BAGS[0];
  const hc = HEADCOVERS.find(h => h.id === headcoverId);
  const L = def.look;
  const seg = detail > 0.5 ? 20 : 10;
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);
  const H = 0.86, R = 0.12;
  // main tube, slightly wider at the top
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.92, H, seg), mat(L.body, 0.8));
  tube.position.y = H / 2; body.add(tube);
  // base and top cuff in the trim colour
  const base = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.95, R * 0.95, 0.08, seg), mat(L.strap, 0.6));
  base.position.y = 0.04; body.add(base);
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.08, R * 1.02, 0.1, seg), mat(L.trim, 0.55));
  cuff.position.y = H - 0.05; body.add(cuff);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.01, R * 1.01, 0.035, seg), mat(L.trim, 0.55));
  band.position.y = H * 0.55; body.add(band);
  // front pocket
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(R * 1.1, H * 0.42, 0.06), mat(L.body, 0.85));
  pocket.position.set(0, H * 0.32, R * 0.92); body.add(pocket);
  const zip = new THREE.Mesh(new THREE.BoxGeometry(R * 1.12, 0.012, 0.064), mat(L.trim, 0.4));
  zip.position.set(0, H * 0.53, R * 0.92); body.add(zip);
  // carry strap on the back
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.014, 6, 24, Math.PI * 0.85), mat(L.strap, 0.6));
  strap.rotation.set(0, Math.PI / 2, Math.PI * 0.58); strap.position.set(0, H * 0.55, -R * 1.05); body.add(strap);
  // clubs sticking out: grips + a driver head (or its headcover)
  const grip = mat('#1b1c1f', 0.9);
  const shafts = [[-0.05, 0.05], [0.02, 0.06], [0.06, 0.0], [-0.06, -0.03], [0.0, -0.05], [0.05, -0.05], [-0.02, 0.0]];
  shafts.forEach(([x, z], i) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.009, 0.2 + (i % 3) * 0.03, 8), grip);
    c.position.set(x, H + 0.08 + (i % 3) * 0.015, z); c.rotation.z = x * 0.8; c.rotation.x = -z * 0.8;
    body.add(c);
  });
  const dr = new THREE.Group();
  dr.position.set(-0.03, H + 0.2, 0.06);
  if (hc?.look) {
    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.16, seg), mat(hc.look.body, 0.95));
    sock.position.y = 0.0; dr.add(sock);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.065, seg, seg * 0.6), mat(hc.look.body, 0.95));
    head.scale.set(1, 0.8, 1.15); head.position.y = 0.1; dr.add(head);
    for (const y of [-0.05, 0.03]) {
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.018, seg), mat(hc.look.trim, 0.95));
      stripe.position.y = y; dr.add(stripe);
    }
    const pom = new THREE.Mesh(new THREE.IcosahedronGeometry(0.034, 1), mat(hc.look.pom, 1));
    pom.position.y = 0.17; dr.add(pom);
  } else {
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, seg, seg * 0.6), mat('#1a1d22', 0.35, 0.4));
    head.scale.set(1.15, 0.6, 0.95); head.position.y = 0.06; dr.add(head);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 8), mat('#1d1f24', 0.35));
    dr.add(sh);
  }
  body.add(dr);
  // stand legs (folded against the back)
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, H * 0.75, 6), mat('#2a2c30', 0.4, 0.6));
    leg.position.set(s * 0.05, H * 0.42, -R * 1.02); leg.rotation.z = s * 0.04; body.add(leg);
  }
  body.rotation.x = -0.12; // leaning on its stand
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

export function buildBall(color = '#ffffff') {
  const g = new THREE.Group();
  const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.0214, 4), new THREE.MeshStandardMaterial({ color, roughness: 0.35, flatShading: true }));
  g.add(ball);
  return g;
}

// The player's bag standing beside the tee: rebuilt only when the bag/headcover choice changes.
export class BagProp {
  constructor(scene) { this.scene = scene; this.root = new THREE.Group(); this.root.visible = false; scene?.add?.(this.root); this.key = ''; }
  set(bagId, headcoverId) {
    const key = `${bagId}|${headcoverId}`;
    if (key === this.key) return;
    this.key = key;
    while (this.root.children.length) {
      const o = this.root.children[0];
      this.root.remove(o);
      o.traverse(m => { m.geometry?.dispose(); m.material?.dispose(); });
    }
    this.root.add(buildGolfBag(bagId, headcoverId));
  }
  // behind the ball on the golfer's side of the target line. x/y/heading in course coords.
  place(hole, x, y, heading, lefty = false) {
    const side = lefty ? 1 : -1;
    const bx = x - Math.sin(heading) * 0.4 + Math.cos(heading) * 2.4 * side;
    const by = y - Math.cos(heading) * 0.4 - Math.sin(heading) * 2.4 * side;
    this.root.position.set(bx, hole.heightAt(bx, by), -by);
    this.root.rotation.y = heading + (lefty ? -0.9 : 0.9);
    this.root.visible = true;
  }
  hide() { this.root.visible = false; }
}
