import * as THREE from 'three';
import type { Atmosphere } from '../data/types';
import { rng } from './geometry';

export function sunDirection(a: Atmosphere): THREE.Vector3 {
  const el = (a.sky.sunElevation * Math.PI) / 180;
  const az = (a.sky.sunAzimuth * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)).normalize();
}

export function buildSky(a: Atmosphere, radius = 400): THREE.Group {
  const g = new THREE.Group();
  g.name = 'sky';
  const sun = sunDirection(a);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color(a.sky.top) },
      uHorizon: { value: new THREE.Color(a.sky.horizon) },
      uSun: { value: new THREE.Color(a.sky.sun) },
      uSunDir: { value: sun },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 p = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * p;
        gl_Position.z = gl_Position.w;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uSun; uniform vec3 uSunDir;
      varying vec3 vDir;
      void main() {
        float t = clamp(vDir.y, 0.0, 1.0);
        vec3 c = mix(uHorizon, uTop, pow(t, 0.55));
        float s = max(dot(normalize(vDir), uSunDir), 0.0);
        c += uSun * (pow(s, 600.0) * 1.5 + pow(s, 12.0) * 0.18);
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16), mat);
  dome.renderOrder = -10;
  dome.frustumCulled = false;
  g.add(dome);

  // puffy stylised clouds
  const r = rng(5);
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#dfe8f0', emissiveIntensity: 0.55, fog: false });
  for (let i = 0; i < 9; i++) {
    const cloud = new THREE.Group();
    const n = 4 + Math.floor(r() * 4);
    for (let k = 0; k < n; k++) {
      const s = 6 + r() * 7;
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 2), cloudMat);
      puff.position.set((k - n / 2) * s * 0.9, r() * s * 0.4, (r() - 0.5) * s);
      puff.scale.y = 0.62;
      cloud.add(puff);
    }
    const ang = r() * Math.PI * 2;
    const dist = radius * (0.55 + r() * 0.3);
    cloud.position.set(Math.cos(ang) * dist, 55 + r() * 60, Math.sin(ang) * dist);
    cloud.lookAt(0, cloud.position.y, 0);
    g.add(cloud);
  }
  return g;
}

export interface Lights {
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  fill: THREE.DirectionalLight;
}

export function buildLights(a: Atmosphere, focus: THREE.Vector3, span: number, shadowSize: number): Lights {
  const dir = sunDirection(a);
  const sun = new THREE.DirectionalLight(a.sky.sun, a.sky.sunIntensity);
  sun.position.copy(focus).addScaledVector(dir, 80);
  sun.target.position.copy(focus);
  sun.castShadow = shadowSize > 0;
  if (shadowSize > 0) {
    sun.shadow.mapSize.set(shadowSize, shadowSize);
    const cam = sun.shadow.camera;
    cam.left = -span;
    cam.right = span;
    cam.top = span;
    cam.bottom = -span;
    cam.near = 10;
    cam.far = 200;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 4;
  }
  const hemi = new THREE.HemisphereLight(a.sky.top, '#6f8f4a', 1.5);
  const fill = new THREE.DirectionalLight('#bcd4ff', 0.35);
  fill.position.copy(focus).add(new THREE.Vector3(-dir.x * 50, 30, -dir.z * 50));
  fill.target.position.copy(focus);
  return { sun, hemi, fill };
}
