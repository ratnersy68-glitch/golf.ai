import * as THREE from 'three';

const VS = `attribute float size; attribute vec4 color; varying vec4 vColor; uniform float scale;
void main(){ vColor = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * scale / -mv.z; gl_Position = projectionMatrix * mv; }`;
const FS = `varying vec4 vColor; void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5) discard; float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vColor.rgb, vColor.a * a); }`;

export class ParticlePool {
  points: THREE.Points;
  private pos: Float32Array; private col: Float32Array; private size: Float32Array;
  private vel: Float32Array; private life: Float32Array; private max: Float32Array; private s0: Float32Array; private s1: Float32Array; private a0: Float32Array; private rgb: Float32Array; private drag: Float32Array; private grav: Float32Array;
  private head = 0; mat: THREE.ShaderMaterial; geo = new THREE.BufferGeometry();
  constructor(public n: number, additive: boolean) {
    this.pos = new Float32Array(n * 3); this.col = new Float32Array(n * 4); this.size = new Float32Array(n); this.vel = new Float32Array(n * 3);
    this.life = new Float32Array(n); this.max = new Float32Array(n).fill(1); this.s0 = new Float32Array(n); this.s1 = new Float32Array(n); this.a0 = new Float32Array(n); this.rgb = new Float32Array(n * 3);
    this.drag = new Float32Array(n); this.grav = new Float32Array(n);
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('color', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, uniforms: { scale: { value: 600 } }, fog: false });
    this.points = new THREE.Points(this.geo, this.mat); this.points.frustumCulled = false; this.points.renderOrder = 5;
    for (let i = 0; i < n; i++) this.pos[i * 3 + 1] = -9999;
  }
  emit(x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, s0: number, s1: number, color: THREE.Color | string, alpha = 1, drag = 1, grav = 0) {
    const i = this.head; this.head = (this.head + 1) % this.n;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z; this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    this.life[i] = life; this.max[i] = life; this.s0[i] = s0; this.s1[i] = s1; this.a0[i] = alpha; this.drag[i] = drag; this.grav[i] = grav;
    const c = color instanceof THREE.Color ? color : tmpc.set(color); this.rgb[i * 3] = c.r; this.rgb[i * 3 + 1] = c.g; this.rgb[i * 3 + 2] = c.b;
  }
  update(dt: number) {
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) { if (this.size[i] !== 0) { this.size[i] = 0; this.col[i * 4 + 3] = 0; this.pos[i * 3 + 1] = -9999; } continue; }
      this.life[i] -= dt; const t = 1 - Math.max(0, this.life[i]) / this.max[i];
      const k = Math.max(0, 1 - this.drag[i] * dt);
      this.vel[i * 3] *= k; this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * k - this.grav[i] * dt; this.vel[i * 3 + 2] *= k;
      this.pos[i * 3] += this.vel[i * 3] * dt; this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt; this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t;
      this.col[i * 4] = this.rgb[i * 3]; this.col[i * 4 + 1] = this.rgb[i * 3 + 1]; this.col[i * 4 + 2] = this.rgb[i * 3 + 2]; this.col[i * 4 + 3] = this.a0[i] * (1 - t) * (t < 0.1 ? t * 10 : 1);
    }
    (this.geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true; (this.geo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true; (this.geo.getAttribute('size') as THREE.BufferAttribute).needsUpdate = true;
  }
  clear() { this.life.fill(0); }
  dispose() { this.geo.dispose(); this.mat.dispose(); }
}
const tmpc = new THREE.Color();

/** Ring-buffer of tyre-mark quads. */
export class SkidMarks {
  mesh: THREE.Mesh; private pos: Float32Array; private alpha: Float32Array; private geo = new THREE.BufferGeometry(); private head = 0;
  private last: (THREE.Vector3 | null)[] = [null, null, null, null];
  constructor(public n = 900) {
    this.pos = new Float32Array(n * 6 * 3); this.alpha = new Float32Array(n * 6);
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
      vertexShader: `attribute float alpha; varying float vA; void main(){ vA = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying float vA; void main(){ gl_FragColor = vec4(0.03,0.03,0.035, vA*0.6); }`, fog: false });
    this.mesh = new THREE.Mesh(this.geo, mat); this.mesh.frustumCulled = false; this.mesh.renderOrder = 2;
  }
  add(wheel: number, p: THREE.Vector3, right: THREE.Vector3, up: THREE.Vector3, active: boolean, intensity: number) {
    const prev = this.last[wheel];
    if (!active) { this.last[wheel] = null; return; }
    const cur = p.clone().addScaledVector(up, 0.045);
    if (prev && prev.distanceTo(cur) > 0.25 && prev.distanceTo(cur) < 6) {
      const hw = 0.13; const i = this.head; this.head = (this.head + 1) % this.n;
      const a = prev.clone().addScaledVector(right, -hw), b = prev.clone().addScaledVector(right, hw), c = cur.clone().addScaledVector(right, hw), d = cur.clone().addScaledVector(right, -hw);
      const v = [a, b, c, a, c, d];
      for (let k = 0; k < 6; k++) { this.pos[(i * 6 + k) * 3] = v[k].x; this.pos[(i * 6 + k) * 3 + 1] = v[k].y; this.pos[(i * 6 + k) * 3 + 2] = v[k].z; this.alpha[i * 6 + k] = intensity; }
      (this.geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true; (this.geo.getAttribute('alpha') as THREE.BufferAttribute).needsUpdate = true;
      this.last[wheel] = cur;
    } else if (!prev || prev.distanceTo(cur) >= 6) this.last[wheel] = cur;
  }
  clear() { this.alpha.fill(0); this.last = [null, null, null, null]; (this.geo.getAttribute('alpha') as THREE.BufferAttribute).needsUpdate = true; }
}
