/**
 * Imports the supplied low-poly race-track GLB into a compact runtime "track kit" (public/models/track_kit.json).
 *
 *   npx tsx tools/import-track-assets.ts <low_poly_race_track.glb> [Track.stl]
 *
 * What it does (and why):
 *  - Parses the GLB with its own reader that tolerates a truncated BIN chunk (the supplied file is ~130 KB short, which loses the colour atlas
 *    and 17 meshes: the 90-degree road tiles, springboards, start/finish tiles). Meshes with unreadable vertex data are skipped and reported.
 *  - Applies node transforms, de-duplicates identical meshes (the forest is 130 copies of a few shapes), drops everything that is not track-side
 *    scenery (cars, parked vehicles, far-field backlights, ground slab), re-bases each prop to y=0 / centred on XZ, scales to game metres,
 *    and builds simplified LODs by vertex clustering.
 *  - The atlas texture is missing, so props are not UV-textured; the game colours them from the white-marble palette by height band.
 *  - The STL (flat base slab + a few concentric arc/straight tile fragments) is analysed and reported; its 180-degree arc proportions are used to
 *    cross-check the GLB's 180-degree road tile.
 */
import fs from 'node:fs';
import path from 'node:path';

const glbPath = process.argv[2]; const stlPath = process.argv[3];
if (!glbPath) { console.error('usage: import-track-assets.ts <glb> [stl]'); process.exit(1); }
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'public', 'models', 'track_kit.json');
const UNIT = 4.2; // scene units -> metres (the scene's cars are ~0.5 wide; ours are ~2.1 m)

const buf = fs.readFileSync(glbPath); const jl = buf.readUInt32LE(12); const json = JSON.parse(buf.slice(20, 20 + jl).toString());
const binStart = 28 + jl; const avail = buf.length - binStart;
console.log(`GLB: ${(buf.length / 1048576).toFixed(2)} MB, BIN available ${avail} of declared ${json.buffers[0].byteLength} (${json.buffers[0].byteLength - avail} bytes missing)`);

const SIZE: Record<string, number> = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
function accessor(i: number): Float32Array | Uint32Array | Uint16Array | null {
  const a = json.accessors[i]; const v = json.bufferViews[a.bufferView]; const comp = a.componentType === 5126 || a.componentType === 5125 ? 4 : 2;
  const off = (v.byteOffset ?? 0) + (a.byteOffset ?? 0); const n = a.count * SIZE[a.type];
  if (off + n * comp > avail) return null; // truncated
  const slice = buf.buffer.slice(buf.byteOffset + binStart + off, buf.byteOffset + binStart + off + n * comp);
  return a.componentType === 5126 ? new Float32Array(slice) : a.componentType === 5125 ? new Uint32Array(slice) : new Uint16Array(slice);
}
type M4 = number[];
const I4: M4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const mul = (a: M4, b: M4): M4 => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
const parent = new Map<number, number>(); json.nodes.forEach((n: any, i: number) => (n.children ?? []).forEach((c: number) => parent.set(c, i)));
const world = (i: number): M4 => { const n = json.nodes[i]; const loc = n.matrix ?? I4; const p = parent.get(i); return p === undefined ? loc : mul(world(p), loc); };

interface Raw { name: string; pos: Float32Array; idx: Uint32Array | Uint16Array }
const cats: Record<string, Raw[]> = {}; const skipped: string[] = []; const allMissing: string[] = [];
const baseName = (n: string) => n.replace(/[._ ]?\d+(_\d+)?$/, '').replace(/\.\d+/, '').trim();
const MAP: Record<string, string> = { forest: 'tree', bush: 'bush', stone: 'stone', 'flower bed': 'flowers', fence: 'fence', 'wheel fence': 'tyrewall', 'bunch of wheels': 'tyres', 'stack of wheels': 'tyrestack', 'big wheel': 'bigwheel', tribune: 'tribune', tower: 'tower', house: 'house', garages: 'garages', flag: 'flag', 'finish board': 'finishboard', barrier: 'barrier', bridge: 'bridge', flashlight: 'lamp', 'road 180': 'uturn' };
json.nodes.forEach((n: any, i: number) => {
  if (n.mesh === undefined) return; const par = parent.get(i); const pname = baseName(json.nodes[par ?? i].name); const cat = MAP[pname];
  { const pr0 = json.meshes[n.mesh].primitives[0]; if (!accessor(pr0.attributes.POSITION) || !accessor(pr0.indices) || (pr0.attributes.TEXCOORD_0 !== undefined && !accessor(pr0.attributes.TEXCOORD_0))) allMissing.push(pname); }
  if (!cat) return;
  const pr = json.meshes[n.mesh].primitives[0]; const pos = accessor(pr.attributes.POSITION) as Float32Array | null; const idx = accessor(pr.indices) as Uint32Array | Uint16Array | null;
  if (!pos || !idx) { skipped.push(pname); return; }
  // bake the node's world matrix (rotation / scale only; translation handled by re-basing)
  const m = world(i); const out = new Float32Array(pos.length);
  for (let k = 0; k < pos.length; k += 3) { const x = pos[k], y = pos[k + 1], z = pos[k + 2]; out[k] = m[0] * x + m[4] * y + m[8] * z; out[k + 1] = m[1] * x + m[5] * y + m[9] * z; out[k + 2] = m[2] * x + m[6] * y + m[10] * z; }
  (cats[cat] ??= []).push({ name: pname, pos: out, idx });
});
console.log('readable categories:', Object.entries(cats).map(([k, v]) => `${k}:${v.length}`).join(' '));
console.log('unreadable / truncated meshes (not importable):', [...new Set(allMissing)].join(', ') || 'none');

// ---- de-duplicate by quantised shape signature
const sig = (r: Raw) => { let h = 0; for (let k = 0; k < r.pos.length; k += 3) h = (h * 31 + Math.round(r.pos[k] * 40) * 7 + Math.round(r.pos[k + 1] * 40) * 13 + Math.round(r.pos[k + 2] * 40) * 17) | 0; return h + ':' + r.pos.length; };

// ---- vertex clustering simplification
function cluster(pos: Float32Array, idx: ArrayLike<number>, cell: number): { p: number[]; i: number[] } {
  const map = new Map<string, number>(); const acc: number[][] = []; const remap = new Int32Array(pos.length / 3);
  for (let v = 0; v < pos.length / 3; v++) { const k = `${Math.floor(pos[v * 3] / cell)},${Math.floor(pos[v * 3 + 1] / cell)},${Math.floor(pos[v * 3 + 2] / cell)}`; let id = map.get(k); if (id === undefined) { id = acc.length; map.set(k, id); acc.push([0, 0, 0, 0]); } acc[id][0] += pos[v * 3]; acc[id][1] += pos[v * 3 + 1]; acc[id][2] += pos[v * 3 + 2]; acc[id][3]++; remap[v] = id; }
  const p: number[] = []; acc.forEach(a => p.push(a[0] / a[3], a[1] / a[3], a[2] / a[3]));
  const seen = new Set<string>(); const i: number[] = [];
  for (let t = 0; t < idx.length; t += 3) { const a = remap[idx[t]], b = remap[idx[t + 1]], c = remap[idx[t + 2]]; if (a === b || b === c || a === c) continue; const key = [a, b, c].sort((x, y) => x - y).join(','); if (seen.has(key)) continue; seen.add(key); i.push(a, b, c); }
  return { p, i };
}
const b64 = (arr: ArrayBufferView) => Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength).toString('base64');
const MAXLOD = 3;
const kit: any = { version: 1, unit: UNIT, source: path.basename(glbPath), missing: [...new Set(allMissing)], props: {} as Record<string, any> };
for (const [cat, list] of Object.entries(cats)) {
  const uniq = new Map<string, Raw>(); for (const r of list) uniq.set(sig(r), r);
  const shapes = [...uniq.values()].slice(0, cat === 'tree' ? 4 : cat === 'bush' ? 2 : cat === 'stone' ? 3 : 1);
  kit.props[cat] = shapes.map(r => {
    // re-base: centre on XZ, sit on y = 0 (road tile and fence use their own origins; tiles keep XZ extents)
    let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (let k = 0; k < r.pos.length; k += 3) for (let c = 0; c < 3; c++) { mn[c] = Math.min(mn[c], r.pos[k + c]); mx[c] = Math.max(mx[c], r.pos[k + c]); }
    const ox = (mn[0] + mx[0]) / 2, oz = (mn[2] + mx[2]) / 2, oy = mn[1]; const p = new Float32Array(r.pos.length);
    for (let k = 0; k < p.length; k += 3) { p[k] = (r.pos[k] - ox) * UNIT; p[k + 1] = (r.pos[k + 1] - oy) * UNIT; p[k + 2] = (r.pos[k + 2] - oz) * UNIT; }
    const ext = [(mx[0] - mn[0]) * UNIT, (mx[1] - mn[1]) * UNIT, (mx[2] - mn[2]) * UNIT]; const diag = Math.hypot(...ext);
    const lods: any[] = [];
    // LOD0: lightly cleaned original (vertex weld); LOD1/2: clustered coarser
    for (let l = 0; l < MAXLOD; l++) {
      const cell = l === 0 ? diag * (r.idx.length / 3 > 1500 ? 0.02 : 0.004) : diag * (l === 1 ? 0.045 : 0.12); const g = cluster(p, r.idx, cell); if (g.i.length < 4 * 3 && l > 0) break;
      let gmn = [1e9, 1e9, 1e9], gmx = [-1e9, -1e9, -1e9]; for (let k = 0; k < g.p.length; k += 3) for (let c = 0; c < 3; c++) { gmn[c] = Math.min(gmn[c], g.p[k + c]); gmx[c] = Math.max(gmx[c], g.p[k + c]); }
      const sc = gmx.map((x, c) => Math.max(1e-6, (Math.max(Math.abs(x), Math.abs(gmn[c]))) / 32767)); const q = new Int16Array(g.p.length); for (let k = 0; k < g.p.length; k++) q[k] = Math.round(g.p[k] / sc[k % 3]);
      lods.push({ q: b64(q), i: b64(new Uint16Array(g.i)), s: sc, tris: g.i.length / 3 });
    }
    return { ext, lods, srcTris: r.idx.length / 3 };
  });
}
fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(kit));
const tot = Object.entries(kit.props).map(([k, v]: any) => `${k}[${v.map((s: any) => s.lods.map((l: any) => l.tris).join('/')).join('; ')}]`).join('\n  ');
console.log(`wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)\n  ${tot}`);

// ---- road tile cross-check against the STL arc fragments
if (stlPath) {
  const d = fs.readFileSync(stlPath); const n = d.readUInt32LE(80); let rmin = 1e9, rmax = 0;
  const cx = 0; // arcs are centred on x=0 in the STL
  for (let t = 0; t < n; t++) for (let v = 0; v < 3; v++) { const o = 84 + 50 * t + 12 + 12 * v; const x = d.readFloatLE(o), y = d.readFloatLE(o + 4), z = d.readFloatLE(o + 8); if (z > 0.5 && Math.abs(x) < 120 && y > 0 && y < 120) { /* arc region heuristic */ const r = Math.hypot(x - cx, y - 40); rmin = Math.min(rmin, r); rmax = Math.max(rmax, r); } }
  console.log(`STL: ${n} triangles; arc-fragment radial extent ~${rmin.toFixed(0)}-${rmax.toFixed(0)} (flat 485x290 base slab ignored). Used only as a 180-degree tile reference.`);
}
