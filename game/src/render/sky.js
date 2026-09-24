import * as THREE from 'three';

// Gradient sky dome with sun glow and soft procedural clouds.
export function createSky(theme) {
  const geo = new THREE.SphereGeometry(9000, 48, 24);
  const sunDir = sunDirection(theme);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color(theme.sky[0]) },
      horizon: { value: new THREE.Color(theme.sky[1]) },
      sunDir: { value: sunDir },
      sunColor: { value: new THREE.Color(theme.sun.color) },
      cloudiness: { value: theme.links ? 0.75 : (theme.fogDensity > 0.0014 ? 0.6 : 0.4) },
      time: { value: 0 },
    },
    vertexShader: `
      varying vec3 vDir;
      void main(){
        vDir = normalize(position);
        vec4 p = modelViewMatrix * vec4(position,1.0);
        gl_Position = projectionMatrix * p;
        gl_Position.z = gl_Position.w * 0.99999;
      }`,
    fragmentShader: `
      uniform vec3 top; uniform vec3 horizon; uniform vec3 sunDir; uniform vec3 sunColor;
      uniform float cloudiness; uniform float time;
      varying vec3 vDir;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
      float fbm(vec2 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5;} return v; }
      void main(){
        vec3 d = normalize(vDir);
        float h = max(d.y, 0.0);
        vec3 col = mix(horizon, top, pow(h, 0.55));
        // below horizon: haze
        if (d.y < 0.0) col = horizon * 0.95;
        float sd = max(dot(d, sunDir), 0.0);
        col += sunColor * (pow(sd, 900.0) * 6.0 + pow(sd, 24.0) * 0.25 + pow(sd, 4.0) * 0.08);
        // clouds
        if (d.y > 0.0) {
          vec2 uv = d.xz / (d.y + 0.12) * 1.6 + vec2(time * 0.004, time * 0.002);
          float c = fbm(uv);
          float cov = smoothstep(1.0 - cloudiness, 1.0 - cloudiness + 0.35, c);
          vec3 cc = mix(vec3(1.0), horizon * 0.92, 0.35) + sunColor * pow(sd, 6.0) * 0.3;
          col = mix(col, cc, cov * smoothstep(0.0, 0.18, d.y) * 0.85);
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;
  return mesh;
}

export function sunDirection(theme) {
  const el = theme.sun.elev * Math.PI / 180, az = theme.sun.az * Math.PI / 180;
  return new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).normalize();
}
