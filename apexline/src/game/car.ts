import * as THREE from 'three';
import type { CarSetup } from './types';
import { VEHICLE_MAP, variantOf, Variant } from '../data/vehicles';
import { COSMETIC_MAP } from '../data/cosmetics';
import { renderLivery } from './livery';
import { KIT, Kit, Section } from './kit';

/**
 * Car assembly. Car local frame: +X right, +Y up, -Z forward, origin on the ground under the car centre.
 * Everything is built from the supplied GLB kit (wheels, sections, wing/suspension dimensions) and scaled per vehicle (Variant),
 * as separate meshes so each cosmetic category maps to a real part: body paint, livery, rims, tyres, calipers, wings, splitter,
 * skirts, diffuser, engine cover, airbox, exhaust, bumpers/crash structures, lights, underglow.
 */

const tmpC = new THREE.Color();
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------------------------------------- geometry helpers
/** Lofts a chamfered 8-point section along z, flat-shaded (low-poly look). UV: u along the car (front->rear), v around the section. */
function loftSections(secs: { z: number; hwB: number; yB: number; hwT: number; yT: number; hwM?: number }[]): THREE.BufferGeometry {
  const ring = (s: typeof secs[0]): [number, number][] => {
    const hm = s.hwM ?? Math.max(s.hwB, s.hwT) * 1.0; const h = s.yT - s.yB;
    return [[-s.hwB, s.yB], [-hm, s.yB + h * 0.22], [-hm, s.yB + h * 0.62], [-s.hwT, s.yT], [s.hwT, s.yT], [hm, s.yB + h * 0.62], [hm, s.yB + h * 0.22], [s.hwB, s.yB]];
  };
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const rings = secs.map(ring); const m = rings[0].length;
  rings.forEach((r, i) => r.forEach((p, j) => { pos.push(p[0], p[1], secs[i].z); uv.push(i / (secs.length - 1), j / (m - 1)); }));
  for (let i = 0; i < secs.length - 1; i++) for (let j = 0; j < m - 1; j++) { const a = i * m + j, b = a + 1, c = a + m, d = c + 1; idx.push(a, c, b, b, c, d); }
  const cap = (r: [number, number][], z: number, flip: boolean) => {
    const base = pos.length / 3; let cx = 0, cy = 0; r.forEach(p => { cx += p[0]; cy += p[1]; }); cx /= r.length; cy /= r.length;
    pos.push(cx, cy, z); uv.push(0.5, 0.5); r.forEach(p => { pos.push(p[0], p[1], z); uv.push(0.5, 0.5); });
    for (let j = 0; j < r.length - 1; j++) flip ? idx.push(base, base + 2 + j, base + 1 + j) : idx.push(base, base + 1 + j, base + 2 + j);
    flip ? idx.push(base, base + 1, base + r.length) : idx.push(base, base + r.length, base + 1);
  };
  cap(rings[0], secs[0].z, false); cap(rings[rings.length - 1], secs[secs.length - 1].z, true);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  const f = g.toNonIndexed(); f.computeVertexNormals(); g.dispose(); return f;
}

/** Smooth interpolation (Catmull-Rom) of the kit's 4 body sections into n stations. */
function resample(src: Section[], n: number, zScale: number, map: (s: Section, t: number) => Section): Section[] {
  const out: Section[] = []; const z0 = src[0].z, z1 = src[src.length - 1].z;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), z = lerp(z0, z1, t);
    let k = 0; while (k < src.length - 2 && z > src[k + 1].z) k++;
    const a = src[Math.max(0, k - 1)], b = src[k], c = src[k + 1], d = src[Math.min(src.length - 1, k + 2)];
    const u = (z - b.z) / (c.z - b.z || 1);
    const cr = (p0: number, p1: number, p2: number, p3: number) => 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
    const s: Section = { z: z * zScale, hwB: cr(a.hwB, b.hwB, c.hwB, d.hwB), yB: cr(a.yB, b.yB, c.yB, d.yB), hwT: cr(a.hwT, b.hwT, c.hwT, d.hwT), yT: cr(a.yT, b.yT, c.yT, d.yT) };
    out.push(map(s, t));
  }
  return out;
}

export interface CarDynamics { speed: number; steer: number; slip: number; braking: number; airborne: boolean; boosting: boolean; time: number; throttle: number }
interface WheelRig { pivot: THREE.Group; spin: THREE.Group; front: boolean; side: number; r: number }

export class CarModel {
  group = new THREE.Group();
  inner = new THREE.Group();
  wheels: WheelRig[] = [];
  paintMat!: THREE.MeshPhysicalMaterial;
  brakeMats: THREE.MeshStandardMaterial[] = [];
  headMats: THREE.MeshStandardMaterial[] = [];
  glow?: THREE.Mesh; glowMat?: THREE.MeshBasicMaterial; glowColor = new THREE.Color(0, 0, 0);
  pattern = 'solid'; lightColor = new THREE.Color('#fff');
  wheelR = 0.36; frontZ = 0; rearZ = 0;
  exhaustPos: THREE.Vector3[] = []; wheelPos: THREE.Vector3[] = [];
  disposables: { dispose(): void }[] = [];
  liveryCanvas = document.createElement('canvas'); liveryTex?: THREE.CanvasTexture;
  hubOffset = 0.45; ghost = false;
  length = 3.6; width = 2.2; height = 1.2; v!: Variant;

  constructor(public setup: CarSetup, opts: { ghost?: boolean } = {}) { this.ghost = !!opts.ghost; this.group.add(this.inner); this.build(); }

  private mat<T extends THREE.Material>(m: T): T { this.disposables.push(m); return m; }
  private geom<T extends THREE.BufferGeometry>(g: T): T { this.disposables.push(g); return g; }

  private build() {
    const kit = KIT as Kit; const s = this.setup; const veh = VEHICLE_MAP[s.vehicle] ?? VEHICLE_MAP.pulse; const v = variantOf(veh); this.v = v;
    const g = this.inner; const B = s.body; const D = (id: string) => COSMETIC_MAP[id]?.data ?? {};
    const wide = 1 + (D(B.widebody).w ?? 0) * 0.55;
    const gh = <T extends THREE.Material>(m: T): T => { if (this.ghost) { m.transparent = true; (m as any).opacity = 0.35; m.depthWrite = false; } return m; };

    // ---- materials
    const fin = D(s.paint.finish).m !== undefined ? D(s.paint.finish) : { m: 0.15, r: 0.18, cc: 1 };
    renderLivery(this.liveryCanvas, s);
    this.liveryTex = new THREE.CanvasTexture(this.liveryCanvas); this.liveryTex.colorSpace = THREE.SRGBColorSpace; this.liveryTex.anisotropy = 8;
    const pbr = { metalness: fin.m, roughness: fin.r, clearcoat: fin.cc ?? 0, clearcoatRoughness: 0.08, iridescence: fin.iri ? 1 : 0, iridescenceIOR: 1.6, iridescenceThicknessMinimum: 200, iridescenceThicknessMaximum: fin.shift ? 900 : 500, envMapIntensity: 1.25, sheen: fin.iri ? 0.6 : 0, sheenColor: new THREE.Color(s.paint.accent), side: THREE.DoubleSide };
    const paint = gh(this.mat(new THREE.MeshPhysicalMaterial({ ...pbr, map: this.liveryTex }))); this.paintMat = paint;
    const paintPlain = gh(this.mat(new THREE.MeshPhysicalMaterial({ ...pbr, color: fin.carbon ? '#ffffff' : s.paint.primary, map: fin.carbon ? this.liveryTex : null })));
    if (fin.carbon) paintPlain.map = this.liveryTex;
    const secondary = gh(this.mat(new THREE.MeshPhysicalMaterial({ color: s.paint.secondary, metalness: Math.min(0.5, fin.m), roughness: Math.max(0.25, fin.r), clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide })));
    const accent = gh(this.mat(new THREE.MeshStandardMaterial({ color: s.paint.accent, metalness: 0.35, roughness: 0.4, side: THREE.DoubleSide })));
    const glass = gh(this.mat(new THREE.MeshPhysicalMaterial({ color: '#10141a', metalness: 0.85, roughness: 0.06, clearcoat: 1, envMapIntensity: 1.6, side: THREE.DoubleSide })));
    const dark = gh(this.mat(new THREE.MeshStandardMaterial({ color: '#15171b', roughness: 0.7, metalness: 0.3, side: THREE.DoubleSide })));
    const carbon = gh(this.mat(new THREE.MeshStandardMaterial({ color: '#1d2025', roughness: 0.35, metalness: 0.55, side: THREE.DoubleSide })));
    const chrome = gh(this.mat(new THREE.MeshStandardMaterial({ color: '#dfe3ea', roughness: 0.15, metalness: 1 })));

    const Lz = v.len, Wx = v.wid * wide, Hy = v.hgt, cl = v.clear;
    // ---- tub / nose (kit body sections resampled, with variant proportions)
    const bodySecs = resample(kit.body, 17, Lz, (sec, t) => {
      const nose = t < 0.4 ? lerp(0.62 * v.noseW, 1, t / 0.4) : 1; // front taper
      const h = (sec.yT - sec.yB) * Hy;
      return { z: sec.z, yB: sec.yB + cl, yT: sec.yB + cl + h * 1.08, hwB: sec.hwB * Wx * nose * 1.08, hwT: sec.hwT * Wx * nose * 1.08 };
    });
    // lengthen / shorten the nose cone independently
    bodySecs.forEach(sec => { if (sec.z < 0) sec.z *= 1 + (v.noseLen - 1) * (-sec.z / (1.65 * Lz)); });
    const tub = new THREE.Mesh(this.geom(loftSections(bodySecs)), paint); g.add(tub);
    const frontZ = bodySecs[0].z, rearZ = bodySecs[bodySecs.length - 1].z;

    // ---- sidepods (loft; width/height from the kit's sidepod box)
    const pod = kit.pod; const podW = (pod.x1 - pod.x0) * 1.5 * v.pods * (1 + (wide - 1) * 0.6), podH = (pod.y1 - pod.y0) * 1.6 * v.pods * Hy;
    const podX = (pod.x0 + pod.x1) / 2 * Wx * 1.02 + (wide - 1) * 0.15 + podW * 0.05; const podY0 = pod.y0 + cl - 0.03;
    const podSecs = [0, 0.3, 0.7, 1].map((t, i) => ({ z: lerp(pod.z0, pod.z1, t) * Lz, hwB: podW * (i === 0 ? 0.28 : 0.45) , yB: podY0, hwT: podW * (i === 0 ? 0.22 : 0.38), yT: podY0 + podH * (i === 0 ? 0.55 : i === 3 ? 0.85 : 1.0), hwM: podW * (i === 0 ? 0.3 : 0.5) }));
    const skirt = D(B.skirt); const podMat = paintPlain;
    for (const side of [-1, 1]) {
      const m = new THREE.Mesh(this.geom(loftSections(podSecs)), podMat); m.position.x = side * podX; g.add(m);
      // intake slot
      const slot = new THREE.Mesh(this.geom(new THREE.BoxGeometry(podW * 0.6, podH * 0.28, 0.04)), dark); slot.position.set(side * podX, podY0 + podH * 0.52, podSecs[0].z - 0.02); g.add(slot);
      if (skirt.h > 0) { const sk = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.03 + skirt.d * 0.6, 0.04 + skirt.h * 0.35, (pod.z1 - pod.z0) * Lz * 0.95)), s.body.skirt.includes('carbon') ? carbon : accent); sk.position.set(side * (podX + podW * 0.55), podY0 + 0.02, ((pod.z0 + pod.z1) / 2) * Lz); g.add(sk); }
    }

    // ---- cockpit shell, visor, halo / canopy, airbox, engine cover
    const ck = kit.cockpit;
    const cockSecs = resample(ck, 9, Lz, (sec, t) => ({ z: sec.z + (v.noseLen - 1) * -0.1, yB: sec.yB + cl, yT: sec.yB + cl + (sec.yT - sec.yB) * v.cockH * Hy, hwB: sec.hwB * Wx, hwT: sec.hwT * Wx }));
    const cockpit = new THREE.Mesh(this.geom(loftSections(cockSecs)), secondary); g.add(cockpit);
    const zc0 = cockSecs[0].z, zc1 = cockSecs[cockSecs.length - 1].z, yv = cockSecs[2].yT;
    const visor = new THREE.Mesh(this.geom(new THREE.BoxGeometry(cockSecs[2].hwT * 1.8, 0.07, (zc1 - zc0) * 0.3)), glass); visor.position.set(0, yv - 0.03, zc0 + (zc1 - zc0) * 0.18); visor.rotation.x = -0.28; g.add(visor);
    // helmet
    const helmet = new THREE.Mesh(this.geom(new THREE.SphereGeometry(0.15, 10, 8)), accent); helmet.position.set(0, cockSecs[2].yT + 0.02, zc0 + (zc1 - zc0) * 0.5); g.add(helmet);
    if (v.canopy) { const cap = new THREE.Mesh(this.geom(new THREE.SphereGeometry(0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), glass); cap.scale.set(0.42 * Wx, 0.34 * v.cockH, (zc1 - zc0) * 0.8); cap.position.set(0, cockSecs[1].yB + 0.02, (zc0 + zc1) / 2 - 0.05); g.add(cap); }
    if (v.halo) { const halo = new THREE.Mesh(this.geom(new THREE.TorusGeometry(0.3, 0.025, 6, 12, Math.PI)), carbon); halo.rotation.set(Math.PI / 2 - 0.35, 0, Math.PI / 2); halo.position.set(0, cockSecs[2].yT - 0.02, (zc0 + zc1) / 2 + 0.05); halo.rotation.set(0, Math.PI / 2, 0); halo.rotation.z = 0; g.add(halo); }
    const scoopK = D(B.scoop).kind ?? 'none'; const useBox = v.airbox || (scoopK !== 'none');
    if (useBox) {
      const kinds: Record<string, [number, number, number]> = { none: [0.26, 0.2, 0.5], low: [0.24, 0.12, 0.4], rally: [0.3, 0.2, 0.46], twin: [0.34, 0.15, 0.4], box: [0.32, 0.26, 0.5], tall: [0.22, 0.38, 0.36] };
      const [bw, bh, bl] = kinds[scoopK] ?? kinds.none;
      const ab = new THREE.Mesh(this.geom(new THREE.BoxGeometry(bw, bh, bl)), scoopK === 'box' || scoopK === 'tall' ? carbon : paintPlain); ab.position.set(0, cockSecs[4].yT + bh * 0.45, zc1 - bl * 0.4); g.add(ab);
      const ai = new THREE.Mesh(this.geom(new THREE.BoxGeometry(bw * 0.7, bh * 0.55, 0.03)), dark); ai.position.set(0, cockSecs[4].yT + bh * 0.5, zc1 - bl * 0.4 - bl / 2 - 0.01); g.add(ai);
      if (scoopK === 'twin') ab.scale.x = 0.6;
    }
    if (v.fin) { const fn = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.03, 0.34, 0.9)), accent); fn.position.set(0, cockSecs[4].yT + 0.18, zc1 + 0.3); g.add(fn); }
    // engine cover details from the hood cosmetic (on the nose)
    const hood = D(B.hood).kind ?? 'flat'; const noseTop = (z: number) => { const t = (z - frontZ) / (rearZ - frontZ); return bodySecs[Math.min(bodySecs.length - 1, Math.max(0, Math.round(t * (bodySecs.length - 1))))].yT; };
    const hz = frontZ + (zc0 - frontZ) * 0.55; const hy = noseTop(hz);
    const deco = (w: number, h: number, l: number, x: number, y: number, z: number, m: THREE.Material, rx = 0) => { const b = new THREE.Mesh(this.geom(new THREE.BoxGeometry(w, h, l)), m); b.position.set(x, y, z); b.rotation.x = rx; g.add(b); };
    switch (hood) {
      case 'bulge': deco(0.26, 0.06, 0.5, 0, hy + 0.02, hz, paintPlain); break; case 'vent': for (const sd of [-1, 1]) deco(0.1, 0.03, 0.4, sd * 0.12, hy + 0.01, hz, dark); break;
      case 'carbon': deco(0.36, 0.015, 0.6, 0, hy + 0.01, hz, carbon); break; case 'dome': deco(0.3, 0.1, 0.44, 0, hy + 0.04, hz, paintPlain); break;
      case 'louver': for (let k = 0; k < 5; k++) deco(0.3, 0.02, 0.04, 0, hy + 0.012, hz - 0.2 + k * 0.1, dark); break; case 'scoop': deco(0.24, 0.12, 0.3, 0, hy + 0.05, hz, paintPlain, 0.2); break;
      case 'race': deco(0.36, 0.015, 0.6, 0, hy + 0.01, hz, carbon); for (const sd of [-1, 1]) deco(0.09, 0.03, 0.28, sd * 0.13, hy + 0.02, hz - 0.1, dark); break;
    }

    // ---- wheels / tyres / rims / brakes / suspension
    const rim = D(s.wheel.design); const rimDef = rim.style ? rim : { style: 'spoke', spokes: 5, concave: 0 };
    const rimColor = D(s.wheel.color).color ?? '#C9CED6'; const calColor = D(s.wheel.caliper).color ?? '#1B1E24'; const tire = D(s.wheel.tire).text !== undefined ? D(s.wheel.tire) : { text: 'APEXLINE', color: '#F5F7FA', band: '' };
    const tireTex = tireTexture(tire as any); this.disposables.push(tireTex);
    const tireMat = gh(this.mat(new THREE.MeshStandardMaterial({ color: '#17191d', roughness: 0.85, metalness: 0 })));
    const sideMat = gh(this.mat(new THREE.MeshStandardMaterial({ map: tireTex, roughness: 0.8 })));
    const rimMat = gh(this.mat(new THREE.MeshStandardMaterial({ color: rimColor, roughness: 0.25, metalness: 0.9 })));
    const calMat = gh(this.mat(new THREE.MeshStandardMaterial({ color: calColor, roughness: 0.4, metalness: 0.2 })));
    const discMat = gh(this.mat(new THREE.MeshStandardMaterial({ color: '#8d939c', roughness: 0.4, metalness: 0.9 })));
    const armMat = gh(this.mat(new THREE.MeshStandardMaterial({ color: '#2b2f36', roughness: 0.5, metalness: 0.7 })));
    const axles = [{ k: kit.wheelF, sc: v.wheelF, front: true }, { k: kit.wheelR, sc: v.wheelR, front: false }];
    const tireSrc = kit.geo['Wheel_Front_L'];
    this.wheelPos = [];
    for (const ax of axles) for (const side of [-1, 1]) {
      const r = ax.k.r * ax.sc, w = ax.k.w * ax.sc * v.wheelW; const hx = (ax.k.x * Wx + (wide - 1) * 0.2) * side; const hz = ax.k.z * Lz * (ax.front ? v.noseLen ** 0.35 : 1);
      const pivot = new THREE.Group(); pivot.position.set(hx, r, hz);
      const spin = new THREE.Group(); pivot.add(spin);
      if (tireSrc) {
        const tg = tireSrc.clone(); tg.computeBoundingBox(); const c = tg.boundingBox!.getCenter(new THREE.Vector3()); tg.translate(-c.x, -c.y, -c.z); tg.scale(w / (kit.wheelF.w), r / kit.wheelF.r, r / kit.wheelF.r);
        this.disposables.push(tg); const tm = new THREE.Mesh(tg, tireMat); spin.add(tm);
      } else { const tg = this.geom(new THREE.CylinderGeometry(r, r, w, 16)); tg.rotateZ(Math.PI / 2); spin.add(new THREE.Mesh(tg, tireMat)); }
      const cap = this.geom(new THREE.CircleGeometry(r * 0.96, 24)); const cl1 = new THREE.Mesh(cap, sideMat); cl1.position.x = side * (w / 2 + 0.003); cl1.rotation.y = side * Math.PI / 2; spin.add(cl1);
      const rg = rimGeometry(rimDef as any, r * 0.64, w * 0.5); this.disposables.push(rg); const rm = new THREE.Mesh(rg, rimMat); rm.position.x = side * (w / 2 - 0.01); rm.scale.x = side; spin.add(rm);
      const disc = new THREE.Mesh(this.geom(new THREE.CylinderGeometry(r * 0.52, r * 0.52, 0.03, 18).rotateZ(Math.PI / 2)), discMat); disc.position.x = side * (w / 2 - 0.09); spin.add(disc);
      const cal = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.06, r * 0.5, r * 0.36)), calMat); cal.position.set(side * (w / 2 - 0.1), r * 0.3, ax.front ? -r * 0.45 : r * 0.45); pivot.add(cal);
      // suspension: upper + lower wishbone arms from the tub to the hub
      const bx = (kit.body[2].hwB * 0.7) * Wx * side;
      for (let k = 0; k < 2; k++) {
        const hub = new THREE.Vector3(hx - side * w * 0.5, r + (k ? -r * 0.4 : r * 0.35), hz), inb = new THREE.Vector3(bx, hub.y + (k ? 0.1 : -0.06) + cl * 0.5, hz + (k ? -0.14 : 0.14));
        const len = hub.distanceTo(inb); const arm = new THREE.Mesh(this.geom(new THREE.BoxGeometry(len, 0.05, 0.05)), armMat);
        arm.position.copy(hub).add(inb).multiplyScalar(0.5); arm.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), inb.clone().sub(hub).normalize()); g.add(arm);
      }
      g.add(pivot); this.wheels.push({ pivot, spin, front: ax.front, side, r }); this.wheelPos.push(new THREE.Vector3(hx, 0, hz));
    }
    this.wheelR = kit.wheelR.r * v.wheelR; this.frontZ = this.wheelPos[0].z; this.rearZ = this.wheelPos[2].z;

    // ---- wings
    const fwk = kit.frontWing, rwk = kit.rearWing;
    const sp = D(B.spoiler); const spl = D(B.splitter);
    // front wing (stack of planes + end plates + pylons); splitter cosmetic adds dive planes / a lower blade
    const fwSpan = fwk.span * v.fwSpan * Wx * 0.98, fwZ = frontZ - 0.1 + (fwk.z - kit.body[0].z) * 0.0; const fwY = fwk.y + cl * 0.4;
    for (let k = 0; k < v.fwPlanes; k++) { const pl = new THREE.Mesh(this.geom(new THREE.BoxGeometry(fwSpan, 0.035, fwk.chord * v.fwChord * (1 - k * 0.2))), k === 0 ? paintPlain : carbon); pl.position.set(0, fwY + k * 0.07, fwZ - k * 0.05); pl.rotation.x = -0.06 - k * 0.05; g.add(pl); }
    for (const sd of [-1, 1]) { const ep = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.035, 0.16 + v.fwPlanes * 0.06, fwk.chord * v.fwChord * 1.08)), accent); ep.position.set(sd * fwSpan / 2, fwY + 0.06 + v.fwPlanes * 0.03, fwZ); g.add(ep); const py = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.04, 0.12, 0.08)), carbon); py.position.set(sd * 0.1, fwY + 0.08, fwZ + 0.22); g.add(py); }
    if (spl.h > 0) {
      const bl = new THREE.Mesh(this.geom(new THREE.BoxGeometry(fwSpan * 1.02, 0.02, 0.1 + spl.d * 0.4)), carbon); bl.position.set(0, fwY - 0.05, fwZ - 0.12 - spl.d * 0.15); g.add(bl);
      for (const sd of [-1, 1]) { const dv = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.02, 0.1 + spl.h, 0.16 + spl.d * 0.3)), accent); dv.position.set(sd * (fwSpan * 0.32), fwY + 0.05, fwZ + 0.02); dv.rotation.z = sd * 0.35; g.add(dv); }
    }
    // rear wing: stock = kit proportions; spoiler cosmetic changes the style (planes, height, chord, plates)
    let planes = v.rwPlanes, rh = v.rwH, rc = v.rwChord, rs = v.rwSpan;
    if (sp.kind && sp.kind !== 'none') { const k = sp.kind as string; planes = k === 'ladder' ? 3 : k === 'dual' || k === 'big' ? 2 : 1; rh = k === 'lip' ? 0.62 : k === 'duck' ? 0.72 : 0.9 + (sp.h ?? 0.3) * 0.6; rc = (sp.chord ?? 0.3) / 0.3 * 0.9; rs = (sp.span ?? 1) * (k === 'big' ? 1.1 : 1); }
    const rwSpan = rwk.span * rs * Wx * 0.98, rwZ = rwk.z * Lz + 0.05, rwY = (rwk.y - 0.15) * rh + 0.2 + cl;
    for (let k = 0; k < planes; k++) { const pl = new THREE.Mesh(this.geom(new THREE.BoxGeometry(rwSpan, 0.04, rwk.chord * rc * (1 - k * 0.12))), k === planes - 1 ? paintPlain : carbon); pl.position.set(0, rwY - k * 0.14, rwZ + k * 0.04); pl.rotation.x = 0.1 + k * 0.05; g.add(pl); }
    for (const sd of [-1, 1]) {
      const ep = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.04, 0.26 + planes * 0.12, rwk.chord * rc * 1.15)), accent); ep.position.set(sd * rwSpan / 2, rwY - (planes - 1) * 0.07, rwZ); g.add(ep);
      const st = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.05, rwY - 0.55, 0.09)), carbon); st.position.set(sd * 0.22, 0.55 + (rwY - 0.55) / 2, rwZ - 0.05); g.add(st);
    }

    // ---- diffuser, exhaust, bumpers / crash structures, plate
    const df = D(B.diffuser); const rb = D(B.rbumper); const fb = D(B.fbumper);
    const bx0 = rearZ + 0.02;
    if (df.h > 0) { const base = new THREE.Mesh(this.geom(new THREE.BoxGeometry(Wx * 0.9, 0.04 + df.h * 0.3, 0.38)), carbon); base.position.set(0, cl + 0.12, bx0 + 0.12); base.rotation.x = -0.32; g.add(base); for (let k = 0; k < df.fins; k++) { const f = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.02, 0.06 + df.h * 0.5, 0.36)), dark); f.position.set((k - (df.fins - 1) / 2) * (Wx * 0.8 / Math.max(1, df.fins - 1)), cl + 0.14, bx0 + 0.13); f.rotation.x = -0.32; g.add(f); } }
    const crash = new THREE.Mesh(this.geom(new THREE.BoxGeometry(Wx * 0.5, 0.2 + rb.ext * 0.6, 0.18 + rb.ext)), rb.ext > 0 && s.body.rbumper.includes('carbon') ? carbon : paintPlain); crash.position.set(0, cl + 0.38, bx0 + 0.04 + rb.ext * 0.5); g.add(crash);
    for (let k = 0; k < (rb.vents ?? 0); k++) { const vt = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.1, 0.04, 0.03)), dark); vt.position.set((k - (rb.vents - 1) / 2) * 0.14, cl + 0.42, bx0 + 0.14 + rb.ext); g.add(vt); }
    if (fb.ext > 0 || fb.vents > 0) { const tip = new THREE.Mesh(this.geom(new THREE.BoxGeometry(bodySecs[0].hwB * 2.2 + fb.ext * 0.4, 0.1 + fb.ext * 0.3, 0.12 + fb.ext * 1.2)), s.body.fbumper.includes('carbon') ? carbon : accent); tip.position.set(0, bodySecs[0].yB + 0.08, frontZ - 0.04 - fb.ext * 0.6); g.add(tip); for (let k = 0; k < fb.vents; k++) { const vt = new THREE.Mesh(this.geom(new THREE.BoxGeometry(0.06, 0.04, 0.03)), dark); vt.position.set((k - (fb.vents - 1) / 2) * 0.09, bodySecs[0].yB + 0.1, frontZ - 0.12 - fb.ext * 1.2); g.add(vt); } }
    const ex = D(B.exhaust); this.exhaustPos = [];
    for (let k = 0; k < (ex.count ?? 1); k++) {
      const x = ex.center ? 0 : ((ex.count ?? 1) === 1 ? 0.12 : (k % 2 ? 1 : -1) * (0.1 + Math.floor(k / 2) * 0.1)); const y = cl + 0.46 + (k >= 2 ? 0.1 : 0);
      const geo = ex.shape === 'square' ? new THREE.BoxGeometry(0.1, 0.07, 0.12) : ex.shape === 'hex' ? new THREE.CylinderGeometry(0.055, 0.055, 0.12, 6).rotateX(Math.PI / 2) : ex.shape === 'cannon' ? new THREE.CylinderGeometry(0.07, 0.05, 0.28, 10).rotateX(Math.PI / 2) : new THREE.CylinderGeometry(0.045, 0.045, 0.12, 10).rotateX(Math.PI / 2);
      const m = new THREE.Mesh(this.geom(geo), chrome); m.position.set(x, y, bx0 + 0.2 + rb.ext); g.add(m); this.exhaustPos.push(new THREE.Vector3(x, y, bx0 + 0.34 + rb.ext));
    }
    if (!this.exhaustPos.length) this.exhaustPos.push(new THREE.Vector3(0, 0.5, bx0 + 0.3));
    const plate = D(s.plate.style).bg ? D(s.plate.style) : { bg: '#F5F5F3', fg: '#25282D' }; const ptex = plateTexture(s.plate.text, plate.bg, plate.fg); this.disposables.push(ptex);
    const pm = new THREE.Mesh(this.geom(new THREE.PlaneGeometry(0.4, 0.1)), this.mat(new THREE.MeshStandardMaterial({ map: ptex, roughness: 0.5 }))); pm.position.set(0, cl + 0.3, bx0 + 0.15 + rb.ext + 0.1); g.add(pm);

    // ---- lights
    const headC = D(s.lights.head).color ?? '#F5F7FF'; const tailD = D(s.lights.tail).style ? D(s.lights.tail) : { style: 'bar', color: '#FF1F1F' }; this.lightColor.set(headC);
    const headMat = gh(this.mat(new THREE.MeshStandardMaterial({ color: '#111', emissive: headC, emissiveIntensity: 2.2, roughness: 0.2 }))); const tailMat = gh(this.mat(new THREE.MeshStandardMaterial({ color: '#200', emissive: tailD.color, emissiveIntensity: 1.2, roughness: 0.3 })));
    this.brakeMats.push(tailMat); this.headMats.push(headMat);
    const hstyle = veh.shape.head; const hx0 = podX; const hy0 = podY0 + podH * 0.5; const hz0 = podSecs[0].z - 0.045;
    const sh = (geo: THREE.BufferGeometry, x: number, y: number, z: number, mat: THREE.Material, rz = 0) => { const m = new THREE.Mesh(this.geom(geo), mat); m.position.set(x, y, z); m.rotation.z = rz; g.add(m); };
    for (const sd of [-1, 1]) {
      const x = sd * hx0;
      switch (hstyle) {
        case 'bar': case 'slit': sh(new THREE.BoxGeometry(podW * 0.8, 0.035, 0.03), x, hy0, hz0, headMat, sd * 0.12); break;
        case 'round': sh(new THREE.CircleGeometry(0.075, 14).rotateY(Math.PI), x, hy0, hz0, headMat); break;
        case 'quad': for (const k of [-1, 1]) sh(new THREE.CircleGeometry(0.035, 10).rotateY(Math.PI), x + k * 0.05, hy0, hz0, headMat); break;
        case 'hex': sh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 6).rotateX(Math.PI / 2), x, hy0, hz0, headMat); break;
        default: sh(new THREE.CircleGeometry(0.05, 12).rotateY(Math.PI), x - sd * 0.04, hy0, hz0, headMat); sh(new THREE.CircleGeometry(0.03, 10).rotateY(Math.PI), x + sd * 0.04, hy0, hz0, headMat);
      }
    }
    const tz = bx0 + 0.15 + rb.ext + 0.02; const ty = cl + 0.46 + rb.ext * 0.1;
    switch (tailD.style) {
      case 'strip': sh(new THREE.BoxGeometry(Wx * 0.4, 0.03, 0.03), 0, ty, tz, tailMat); break; case 'rings': for (const sd of [-1, 1]) sh(new THREE.TorusGeometry(0.06, 0.015, 6, 14), sd * 0.18, ty, tz, tailMat); break;
      case 'seg': for (let k = 0; k < 5; k++) sh(new THREE.BoxGeometry(0.06, 0.05, 0.03), (k - 2) * 0.08, ty, tz, tailMat); break; default: sh(new THREE.BoxGeometry(Wx * 0.4, 0.06, 0.03), 0, ty, tz, tailMat);
    }
    sh(new THREE.BoxGeometry(0.05, 0.12, 0.03), 0, cl + 0.62, tz - 0.12, tailMat); // rain light

    // ---- underglow
    const ug = D(s.lights.underglow).color ?? ''; this.pattern = D(s.lights.pattern).mode ?? 'solid';
    if (ug) { this.glowColor.set(ug); this.glowMat = this.mat(new THREE.MeshBasicMaterial({ map: glowTexture(), color: ug, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 })); const gm = new THREE.Mesh(this.geom(new THREE.PlaneGeometry(Wx * 2.6, (rearZ - frontZ) * 1.45)), this.glowMat); gm.rotation.x = -Math.PI / 2; gm.position.y = 0.04; gm.renderOrder = 3; this.group.add(gm); this.glow = gm; }

    this.length = rearZ - frontZ + 0.6; this.width = (kit.wheelF.x * Wx + kit.wheelF.w) * 2; this.height = cockSecs[4].yT + (useBox ? 0.2 : 0.1);
    this.mergeStatic();
    g.traverse(o => { if ((o as THREE.Mesh).isMesh) o.castShadow = !this.ghost; });
  }

  /** Draw-call reduction: all body-fixed meshes that share a material are merged into one geometry (wheels and the glow quad stay separate because they animate). */
  private mergeStatic() {
    const g = this.inner; const groups = new Map<THREE.Material, THREE.Mesh[]>();
    for (const o of g.children) { const m = o as THREE.Mesh; if (!m.isMesh || m === this.glow || Array.isArray(m.material)) continue; const k = m.material as THREE.Material; (groups.get(k) ?? groups.set(k, []).get(k)!).push(m); }
    for (const [material, meshes] of groups) {
      if (meshes.length < 2) continue;
      const pos: number[] = [], nor: number[] = [], uv: number[] = [];
      for (const m of meshes) {
        m.updateMatrix(); const ng = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()); ng.applyMatrix4(m.matrix);
        if (!ng.getAttribute('normal')) ng.computeVertexNormals();
        const P = ng.getAttribute('position'), N = ng.getAttribute('normal'), U = ng.getAttribute('uv');
        for (let i = 0; i < P.count; i++) { pos.push(P.getX(i), P.getY(i), P.getZ(i)); nor.push(N.getX(i), N.getY(i), N.getZ(i)); if (U) uv.push(U.getX(i), U.getY(i)); else uv.push(0, 0); }
        ng.dispose(); g.remove(m);
      }
      const geo = this.geom(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geo.computeBoundingSphere(); g.add(new THREE.Mesh(geo, material));
    }
  }

  update(dt: number, d: CarDynamics, lean: { roll: number; pitch: number; heave: number }) {
    for (const w of this.wheels) {
      w.spin.rotation.x -= (d.speed / w.r) * dt * (d.airborne ? 0.9 : 1);
      if (w.front) w.pivot.rotation.y = d.steer;
    }
    this.inner.rotation.z += (lean.roll * 0.5 - this.inner.rotation.z) * Math.min(1, dt * 14);
    this.inner.rotation.x += (lean.pitch * 0.5 - this.inner.rotation.x) * Math.min(1, dt * 14);
    this.inner.position.y += (lean.heave * 0.4 - this.inner.position.y) * Math.min(1, dt * 14);
    const k = Math.min(1, d.braking);
    for (const m of this.brakeMats) m.emissiveIntensity = 0.9 + 3.2 * k;
    if (this.glowMat) {
      let a = 0.85; const t = d.time;
      switch (this.pattern) {
        case 'pulse': a = 0.55 + 0.45 * Math.sin(t * 5); break; case 'breathe': a = 0.5 + 0.5 * Math.sin(t * 1.6); break; case 'strobe': a = Math.sin(t * 22) > 0 ? 1 : 0.1; break;
        case 'flicker': a = 0.6 + 0.4 * Math.sin(t * 37) * Math.sin(t * 13); break; case 'speed': a = 0.35 + Math.min(0.65, d.speed / 70); break; case 'chase': a = 0.55 + 0.45 * Math.sin(t * 8); break;
        case 'rainbow': tmpC.setHSL((t * 0.25) % 1, 1, 0.55); this.glowMat.color.copy(tmpC); break;
      }
      if (this.pattern !== 'rainbow') this.glowMat.color.copy(this.glowColor);
      this.glowMat.opacity = Math.max(0, Math.min(1, a));
    }
  }
  dispose() { for (const d of this.disposables) d.dispose(); this.liveryTex?.dispose(); }
}

// ---------------------------------------------------------------------------------------------- rims / textures (unchanged designs)
function rimGeometry(rim: { style: string; spokes: number; concave: number }, r: number, depth: number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const lip = new THREE.TorusGeometry(r, 0.02, 6, 20); lip.rotateY(Math.PI / 2); parts.push(lip);
  const hub = new THREE.CylinderGeometry(r * 0.2, r * 0.2, 0.04, 10); hub.rotateZ(Math.PI / 2); hub.translate(-0.01 - rim.concave * 0.03, 0, 0); parts.push(hub);
  const n = Math.max(3, rim.spokes || 5);
  switch (rim.style) {
    case 'disc': { const d = new THREE.CircleGeometry(r, 20); d.rotateY(Math.PI / 2); d.translate(-rim.concave * 0.04, 0, 0); parts.push(d); break; }
    case 'mesh': { for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(0.012, r * 0.9, 0.012); b.translate(0, r * 0.45, 0); b.rotateX((i / n) * Math.PI * 2); parts.push(b); } const ring = new THREE.TorusGeometry(r * 0.55, 0.01, 4, 20); ring.rotateY(Math.PI / 2); parts.push(ring); break; }
    case 'turbine': { for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(0.018, r * 0.85, r * 0.2); b.translate(0, r * 0.47, 0); b.rotateX((i / n) * Math.PI * 2); parts.push(b); } break; }
    case 'ring': { const t = new THREE.TorusGeometry(r * 0.55, 0.03, 6, 20); t.rotateY(Math.PI / 2); parts.push(t); for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(0.02, r * 0.55, 0.025); b.translate(0, r * 0.3, 0); b.rotateX((i / n) * Math.PI * 2); parts.push(b); } break; }
    case 'split': { for (let i = 0; i < n; i++) for (const o of [-0.09, 0.09]) { const b = new THREE.BoxGeometry(0.02, r * 0.8, 0.03); b.translate(0, r * 0.45, o * r); b.rotateX((i / n) * Math.PI * 2); parts.push(b); } break; }
    default: { for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(0.025, r * 0.88, 0.04 + 0.1 / n); b.translate(0, r * 0.46, 0); b.rotateX((i / n) * Math.PI * 2); b.translate(-rim.concave * 0.03, 0, 0); parts.push(b); } }
  }
  void depth;
  const pos: number[] = []; const idx: number[] = []; let off = 0;
  for (const p of parts) { const pp = p.getAttribute('position'); for (let i = 0; i < pp.count; i++) pos.push(pp.getX(i), pp.getY(i), pp.getZ(i)); const ix = p.getIndex(); if (ix) for (let i = 0; i < ix.count; i++) idx.push(ix.getX(i) + off); else for (let i = 0; i < pp.count; i++) idx.push(i + off); off += pp.count; p.dispose(); }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setIndex(idx); out.computeVertexNormals(); return out;
}

function tireTexture(t: { text: string; color: string; band: string }): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
  x.fillStyle = '#17191d'; x.fillRect(0, 0, 128, 128);
  if (t.band) { x.strokeStyle = t.color; x.lineWidth = 7; x.beginPath(); x.arc(64, 64, 52, 0, Math.PI * 2); x.stroke(); }
  if (t.text) { x.fillStyle = t.color; x.font = '700 14px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; const n = t.text.length; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 - 0.55 + (i / Math.max(1, n - 1)) * 1.1; x.save(); x.translate(64 + Math.cos(a) * 52, 64 + Math.sin(a) * 52); x.rotate(a + Math.PI / 2); x.fillText(t.text[i], 0, 0); x.restore(); } }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}
function plateTexture(text: string, bg: string, fg: string): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d')!;
  x.fillStyle = bg; x.fillRect(0, 0, 256, 64); x.strokeStyle = fg; x.lineWidth = 3; x.strokeRect(3, 3, 250, 58);
  x.fillStyle = fg; x.font = '800 40px "Barlow Condensed", Impact, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText((text || 'APEXLINE').slice(0, 9).toUpperCase(), 128, 34);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
let _glow: THREE.CanvasTexture | null = null;
function glowTexture(): THREE.CanvasTexture {
  if (_glow) return _glow;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.55, 'rgba(255,255,255,0.25)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); _glow = new THREE.CanvasTexture(c); return _glow;
}
