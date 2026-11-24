import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import type { GTAOPass as GTAOPassT } from 'three/addons/postprocessing/GTAOPass.js';
import type { Settings } from './types';
import { DRAW_DISTANCES } from './quality';

// GTAO is only needed on ultra: loaded on demand so it stays out of the start-up bundle
let GTAOCls: typeof GTAOPassT | null = null;

export interface EnvStyle {
  sky: [string, string, string]; // zenith, horizon, ground haze
  fog: string; fogDensity: number;
  sun: string; sunIntensity: number; sunDir: [number, number, number];
  hemi: [string, string, number];
  exposure: number; night?: boolean; stars?: boolean;
  ground: [string, string]; // low / high terrain colour
  water?: string; seaLevel?: number;
  bloom: number;
}

export const ENV_STYLES: Record<string, EnvStyle> = {
  academy: { sky: ['#4d8fe0', '#bfe0ff', '#dfe8ef'], fog: '#bcd6ee', fogDensity: 0.0012, sun: '#fff1d6', sunIntensity: 3.2, sunDir: [0.5, 0.75, 0.4], hemi: ['#bfdcff', '#4c6b3a', 0.55], exposure: 1, ground: ['#5b8a3a', '#7aa54a'], bloom: 0.15 },
  coastal: { sky: ['#3f6fb5', '#ffb98a', '#ffd9b3'], fog: '#f3c9a6', fogDensity: 0.0011, sun: '#ffb070', sunIntensity: 3.6, sunDir: [-0.7, 0.28, -0.4], hemi: ['#ffcfa0', '#335a73', 0.55], exposure: 1.05, ground: ['#c9b27c', '#6f9a4a'], water: '#2a7ea6', seaLevel: -12, bloom: 0.3 },
  desert: { sky: ['#3f87d6', '#f3d6a5', '#f0d9b0'], fog: '#ecd2a2', fogDensity: 0.0013, sun: '#fff0cf', sunIntensity: 3.8, sunDir: [0.4, 0.9, 0.2], hemi: ['#ffe9bf', '#a2703b', 0.5], exposure: 1.05, ground: ['#c98f52', '#e3b172'], bloom: 0.2 },
  alpine: { sky: ['#5c93d6', '#dcecff', '#eef4fa'], fog: '#d6e6f5', fogDensity: 0.0015, sun: '#f7fbff', sunIntensity: 3, sunDir: [0.3, 0.7, 0.6], hemi: ['#dcecff', '#9fb4c6', 0.7], exposure: 1.0, ground: ['#cfd8e2', '#f6f9fc'], bloom: 0.2 },
  neon: { sky: ['#07041a', '#2a0f4d', '#4a1a6a'], fog: '#1a0a33', fogDensity: 0.0023, sun: '#7a8cff', sunIntensity: 0.7, sunDir: [-0.4, 0.6, 0.3], hemi: ['#5a3a9a', '#12081f', 0.55], exposure: 1.05, night: true, stars: true, ground: ['#14101f', '#201a33'], bloom: 0.75 },
  industrial: { sky: ['#6b7d8f', '#c3c9cf', '#d0d4d8'], fog: '#aab2ba', fogDensity: 0.0017, sun: '#ffe0b8', sunIntensity: 2.4, sunDir: [0.3, 0.55, -0.5], hemi: ['#cfd6dd', '#4a4d52', 0.6], exposure: 0.98, ground: ['#4a4d52', '#6a6e74'], bloom: 0.25 },
  forest: { sky: ['#4f8ac4', '#cfe8d0', '#dfeadf'], fog: '#b9d4b6', fogDensity: 0.0022, sun: '#fff0c8', sunIntensity: 2.8, sunDir: [0.35, 0.65, 0.5], hemi: ['#d2f0d2', '#2e4a2a', 0.65], exposure: 1, ground: ['#2f5a2a', '#4d7a3a'], bloom: 0.15 },
  sky: { sky: ['#2d63c8', '#9fd0ff', '#e9f4ff'], fog: '#bcdcff', fogDensity: 0.0009, sun: '#fffbe8', sunIntensity: 3.6, sunDir: [0.3, 0.85, 0.3], hemi: ['#d4ebff', '#7fa8d8', 0.7], exposure: 1.05, ground: ['#f4f8ff', '#ffffff'], bloom: 0.25 },
  formula: { sky: ['#4a83d0', '#cfe2f5', '#e1eaf0'], fog: '#c8d9e8', fogDensity: 0.0011, sun: '#fff4e0', sunIntensity: 3.2, sunDir: [-0.4, 0.7, 0.4], hemi: ['#d6e6f5', '#3b5a2c', 0.55], exposure: 1, ground: ['#3f7a35', '#5a9a47'], bloom: 0.15 },
  hyper: { sky: ['#04061a', '#0d3a5e', '#134a7a'], fog: '#07203a', fogDensity: 0.0019, sun: '#6fd8ff', sunIntensity: 1.1, sunDir: [0.2, 0.5, 0.6], hemi: ['#2a7ab8', '#06121f', 0.6], exposure: 1.05, night: true, stars: true, ground: ['#06121f', '#0c2038'], bloom: 0.8 },
  gauntlet: { sky: ['#12080a', '#5a1a14', '#8a2a1a'], fog: '#2a0e0a', fogDensity: 0.0021, sun: '#ff7a3d', sunIntensity: 1.6, sunDir: [-0.5, 0.35, 0.5], hemi: ['#a04a2a', '#120808', 0.5], exposure: 1.02, night: true, ground: ['#1a0e0c', '#3a1a14'], bloom: 0.6 },
  garage: { sky: ['#F3F4F5', '#E9EAEC', '#D3D6DA'], fog: '#E4E6E9', fogDensity: 0.0, sun: '#ffffff', sunIntensity: 0.9, sunDir: [0.4, 0.8, 0.5], hemi: ['#ffffff', '#C4C8CE', 0.35], exposure: 0.72, ground: ['#E8EAED', '#FFFFFF'], bloom: 0 },
};

const SKY_VS = `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }`;
const SKY_FS = `varying vec3 vDir; uniform vec3 cTop; uniform vec3 cHor; uniform vec3 cBot; uniform vec3 sunDir; uniform vec3 sunCol; uniform float stars;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
void main(){
  vec3 d = normalize(vDir); float y = d.y;
  vec3 col = mix(cHor, cTop, pow(clamp(y,0.0,1.0), 0.55));
  col = mix(col, cBot, smoothstep(0.0,-0.35,y));
  float s = max(dot(d, normalize(sunDir)), 0.0);
  col += sunCol * (pow(s, 900.0) * 6.0 + pow(s, 12.0) * 0.28);
  if (stars > 0.5 && y > 0.02) { vec2 g = floor(vec2(atan(d.z,d.x)*220.0, y*220.0)); float r = h21(g); col += vec3(step(0.9972, r)) * smoothstep(0.0, 0.25, y) * (0.6 + 0.4*h21(g+3.0)); }
  gl_FragColor = vec4(col, 1.0);
}`;

const MotionBlurShader = {
  uniforms: { tDiffuse: { value: null as THREE.Texture | null }, strength: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float strength; varying vec2 vUv;
  void main(){ vec2 c = vUv - 0.5; float r = length(c); vec4 acc = vec4(0.0); float tot = 0.0;
    for(int i=0;i<8;i++){ float t = float(i)/7.0; float w = 1.0 - t*0.5; acc += texture2D(tDiffuse, vUv - c * strength * r * t) * w; tot += w; }
    gl_FragColor = acc / tot; }`,
};

export class Gfx {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, 1, 0.3, 4000);
  sun = new THREE.DirectionalLight(0xffffff, 3);
  hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
  sky!: THREE.Mesh;
  skyMat!: THREE.ShaderMaterial;
  composer?: EffectComposer;
  bloom?: UnrealBloomPass;
  blur?: ShaderPass;
  gtao?: GTAOPassT;
  settings!: Settings;
  style: EnvStyle = ENV_STYLES.academy;
  envName = 'academy';
  envCache = new Map<string, THREE.WebGLRenderTarget>();
  dynScale = 1;
  w = 1; h = 1;
  shadowSpan = 90;
  fps = 60; frameMs: number[] = [];
  canvas: HTMLCanvasElement;
  usePost = false;
  sunTarget = new THREE.Object3D();

  constructor(canvas: HTMLCanvasElement, settings: Settings) {
    this.canvas = canvas; this.settings = settings;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: settings.antialias, powerPreference: 'high-performance', stencil: false });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.scene.add(this.sun, this.sunTarget, this.hemi);
    this.sun.target = this.sunTarget;
    // sky dome (renders behind everything)
    this.skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false,
      uniforms: { cTop: { value: new THREE.Color() }, cHor: { value: new THREE.Color() }, cBot: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color() }, stars: { value: 0 } },
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1000, 32, 16), this.skyMat); this.sky.renderOrder = -10; this.sky.frustumCulled = false;
    this.scene.add(this.sky);
    this.applySettings(settings);
    this.setEnv('academy');
  }

  applySettings(s: Settings) {
    this.settings = s;
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * s.resScale * this.dynScale;
    this.renderer.setPixelRatio(dpr);
    const sm = [0, 1024, 2048, 4096][Math.min(3, s.shadows)] || 0;
    this.renderer.shadowMap.enabled = sm > 0;
    this.sun.castShadow = sm > 0;
    if (sm > 0) { this.sun.shadow.mapSize.set(sm, sm); this.sun.shadow.map?.dispose(); (this.sun.shadow as any).map = null; }
    this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.05;
    this.usePost = s.bloom || s.motionBlur || s.ssao;
    this.rebuildComposer();
    this.resize(this.w, this.h, true);
    this.camera.far = DRAW_DISTANCES[Math.max(0, Math.min(4, s.drawDistance))] * 1.15;
    this.camera.updateProjectionMatrix();
  }

  /** Adaptive resolution: multiplies the user's resolution scale without touching their settings. */
  setDynamicScale(f: number) {
    if (Math.abs(f - this.dynScale) < 0.001) return;
    this.dynScale = f; this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2) * this.settings.resScale * f);
    this.renderer.setSize(this.w, this.h, false); this.composer?.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2) * this.settings.resScale * f); this.composer?.setSize(this.w, this.h);
  }

  private rebuildComposer() {
    this.composer?.dispose(); this.composer = undefined; this.bloom = undefined; this.blur = undefined; this.gtao = undefined;
    if (!this.usePost) return;
    const s = this.settings;
    const size = this.renderer.getSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: s.antialias ? 4 : 0 });
    const c = new EffectComposer(this.renderer, rt);
    c.addPass(new RenderPass(this.scene, this.camera));
    if (s.ssao && !GTAOCls) import('three/addons/postprocessing/GTAOPass.js').then(m => { GTAOCls = m.GTAOPass; if (this.settings.ssao) { this.rebuildComposer(); this.composer?.setSize(this.w, this.h); } }).catch(() => {});
    if (s.ssao && GTAOCls) { try { this.gtao = new GTAOCls(this.scene, this.camera, size.x, size.y); this.gtao.output = GTAOCls.OUTPUT.Default; this.gtao.updateGtaoMaterial({ radius: 0.6, distanceExponent: 1, thickness: 1, scale: 1, samples: 8 }); c.addPass(this.gtao); } catch { /* unsupported */ } }
    if (s.bloom) { this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), this.style.bloom, 0.6, 0.85); c.addPass(this.bloom); }
    if (s.motionBlur && !s.reducedMotion) { this.blur = new ShaderPass(MotionBlurShader); c.addPass(this.blur); }
    c.addPass(new OutputPass());
    this.composer = c;
  }

  setEnv(name: string) {
    const st = ENV_STYLES[name] ?? ENV_STYLES.academy;
    this.style = st; this.envName = name;
    const u = this.skyMat.uniforms;
    u.cTop.value.set(st.sky[0]); u.cHor.value.set(st.sky[1]); u.cBot.value.set(st.sky[2]);
    u.sunDir.value.set(...st.sunDir).normalize(); u.sunCol.value.set(st.sun); u.stars.value = st.stars ? 1 : 0;
    this.sun.color.set(st.sun); this.sun.intensity = st.sunIntensity;
    this.hemi.color.set(st.hemi[0]); this.hemi.groundColor.set(st.hemi[1]); this.hemi.intensity = st.hemi[2];
    this.renderer.toneMappingExposure = st.exposure;
    const dd = [1.5, 1.15, 1, 0.8][Math.min(3, this.settings.drawDistance)];
    this.scene.fog = st.fogDensity > 0 ? new THREE.FogExp2(st.fog, st.fogDensity * dd) : null;
    if (this.bloom) this.bloom.strength = st.bloom;
    // environment reflections from the sky (generated once per environment and cached)
    const hit = this.envCache.get(name);
    if (hit) { this.scene.environment = this.settings.reflections > 0 ? hit.texture : null; this.scene.environmentIntensity = this.settings.reflections === 0 ? 0 : (name === 'garage' ? 0.55 : 0.9); this.applySun(new THREE.Vector3()); return; }
    const pm = new THREE.PMREMGenerator(this.renderer);
    const es = new THREE.Scene();
    const skyClone = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), this.skyMat.clone());
    (skyClone.material as THREE.ShaderMaterial).depthTest = true;
    es.add(skyClone);
    // add soft ground bounce so lower hemisphere is not black
    const envRT = pm.fromScene(es, 0.02); this.envCache.set(name, envRT);
    this.scene.environment = this.settings.reflections > 0 ? envRT.texture : null;
    this.scene.environmentIntensity = this.settings.reflections === 0 ? 0 : (name === 'garage' ? 0.55 : 0.9);
    pm.dispose(); (skyClone.material as THREE.Material).dispose(); skyClone.geometry.dispose();
    this.applySun(new THREE.Vector3());
  }

  /** Keep the shadow frustum centred on the focus point. */
  applySun(focus: THREE.Vector3) {
    const d = new THREE.Vector3(...this.style.sunDir).normalize();
    this.sunTarget.position.copy(focus);
    this.sun.position.copy(focus).addScaledVector(d, 160);
    const sc = this.sun.shadow.camera as THREE.OrthographicCamera;
    const sp = this.shadowSpan; sc.left = -sp; sc.right = sp; sc.top = sp; sc.bottom = -sp; sc.near = 10; sc.far = 400; sc.updateProjectionMatrix();
  }

  resize(w: number, h: number, force = false) {
    if (!force && w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h); this.camera.updateProjectionMatrix();
    this.composer?.setSize(w, h);
  }

  render(motion = 0) {
    this.sky.position.copy(this.camera.position);
    if (this.blur) this.blur.uniforms.strength.value = motion;
    if (this.composer) this.composer.render(); else this.renderer.render(this.scene, this.camera);
  }

  dispose() { this.composer?.dispose(); this.envCache.forEach(r => r.dispose()); this.envCache.clear(); this.renderer.dispose(); }
}
