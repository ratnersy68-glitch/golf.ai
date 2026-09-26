import * as THREE from 'three';
import type { Vec2 } from '../data/types';

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uWave;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  void main() {
    vec3 p = position;
    float w = sin(p.x * 0.35 + uTime * 0.9) * 0.5 + sin(p.z * 0.27 - uTime * 0.7) * 0.5;
    p.y += w * uWave;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    vNormalW = vec3(0.0, 1.0, 0.0);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const frag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  uniform vec3 uSky;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec2 uFlow;
  uniform float uScale;
  uniform float uOpacity;
  uniform vec3 fogColor;
  uniform float fogNear;
  uniform float fogFar;
  varying vec3 vWorld;

  float h(vec2 p) {
    vec2 f = uFlow * uTime;
    float s = 0.0;
    s += sin(dot(p + f, vec2(1.3, 0.7)) * 1.9 * uScale + uTime * 1.3) * 0.5;
    s += sin(dot(p + f * 1.3, vec2(-0.6, 1.4)) * 2.7 * uScale - uTime * 1.7) * 0.35;
    s += sin(dot(p - f * 0.7, vec2(0.9, -1.1)) * 4.3 * uScale + uTime * 2.3) * 0.2;
    s += sin(dot(p + f * 2.0, vec2(-1.7, -0.4)) * 7.1 * uScale + uTime * 3.1) * 0.1;
    return s;
  }

  void main() {
    vec2 p = vWorld.xz;
    float e = 0.05;
    vec3 n = normalize(vec3(-(h(p + vec2(e, 0.0)) - h(p - vec2(e, 0.0))) * 0.35 / e * 0.1,
                            1.0,
                            -(h(p + vec2(0.0, e)) - h(p - vec2(0.0, e))) * 0.35 / e * 0.1));
    vec3 v = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    vec3 col = mix(uDeep, uShallow, 0.35 + 0.25 * h(p * 0.5));
    col = mix(col, uSky, fres * 0.75);
    vec3 r = reflect(-uSunDir, n);
    float spec = pow(max(dot(r, v), 0.0), 180.0);
    col += uSunColor * spec * 1.6;
    // sparkle
    float sp = step(0.985, fract(sin(dot(floor(p * 18.0), vec2(12.9898, 78.233)) + floor(uTime * 6.0)) * 43758.5453));
    col += sp * spec * 4.0;
    float alpha = mix(uOpacity, 1.0, fres);
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogF = smoothstep(fogNear, fogFar, depth);
    col = mix(col, fogColor, fogF);
    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export interface WaterOptions {
  shallow: string;
  deep: string;
  sky: string;
  sunDir: THREE.Vector3;
  sunColor: string;
  flow?: [number, number];
  wave?: number;
  scale?: number;
  opacity?: number;
}

export function createWaterMaterial(o: WaterOptions): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWave: { value: o.wave ?? 0 },
      uShallow: { value: new THREE.Color(o.shallow) },
      uDeep: { value: new THREE.Color(o.deep) },
      uSky: { value: new THREE.Color(o.sky) },
      uSunDir: { value: o.sunDir.clone().normalize() },
      uSunColor: { value: new THREE.Color(o.sunColor) },
      uFlow: { value: new THREE.Vector2(...(o.flow ?? [0.3, 0])) },
      uScale: { value: o.scale ?? 1 },
      uOpacity: { value: o.opacity ?? 0.86 },
      fogColor: { value: new THREE.Color('#ffffff') },
      fogNear: { value: 1 },
      fogFar: { value: 1000 },
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    fog: true,
  });
}

/** Flat water surface from a hole-space polygon. */
export function waterMeshFromPolygon(poly: Vec2[], level: number, mat: THREE.Material): THREE.Mesh {
  const shape = new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x, y)));
  const geo = new THREE.ShapeGeometry(shape, 1);
  // shape is in XY plane with y = hole-y; rotate so hole-y -> -Z
  geo.rotateX(-Math.PI / 2);
  // rotateX(-90): (x, y, 0) -> (x, 0, -y). exactly our mapping.
  geo.translate(0, level, 0);
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = 2;
  return m;
}
