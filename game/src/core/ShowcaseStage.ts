import * as THREE from 'three';
import type { GolferData } from '../data/types';
import { buildGolfBag, GolferModel } from '../world/GolferModel';
import type { Stage } from './Engine';

/** Studio stage: a large golfer on a turf podium for the golfer select and create-a-golfer screens. */
export class ShowcaseStage implements Stage {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 200);
  golfer: GolferModel | null = null;
  private bag: THREE.Group | null = null;
  private spin = 0;
  private spinVel = 0;
  private dragging = false;
  private lastX = 0;
  private pivot = new THREE.Group();
  /** horizontal placement of the model in the frame (-1 left .. 1 right) */
  offset = 0.45;

  constructor(canvas: HTMLCanvasElement) {
    this.scene.background = new THREE.Color('#0f2a1c');
    this.scene.fog = new THREE.Fog('#0f2a1c', 18, 40);
    // backdrop gradient
    const bg = new THREE.Mesh(
      new THREE.SphereGeometry(60, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { a: { value: new THREE.Color('#2f6e46') }, b: { value: new THREE.Color('#081a10') } },
        vertexShader: 'varying vec3 v; void main(){ v = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: 'uniform vec3 a; uniform vec3 b; varying vec3 v; void main(){ float t = smoothstep(-0.2, 0.6, v.y); vec2 c = v.xz; float spot = 1.0 - smoothstep(0.0, 0.9, length(c - vec2(0.0, -0.6))); vec3 col = mix(a, b, t) + spot * 0.08; gl_FragColor = vec4(col, 1.0); #include <colorspace_fragment> }',
      }),
    );
    this.scene.add(bg);

    const podium = new THREE.Group();
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 2.9, 0.6, 48), new THREE.MeshStandardMaterial({ color: '#4a321f', roughness: 1 }));
    soil.position.y = -0.32;
    const turf = new THREE.Mesh(new THREE.CylinderGeometry(3.12, 3.12, 0.08, 48), new THREE.MeshStandardMaterial({ color: '#6fbf4a', roughness: 0.9 }));
    turf.position.y = 0;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.12, 0.05, 8, 64), new THREE.MeshStandardMaterial({ color: '#f2c94c', roughness: 0.3, metalness: 0.8 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.03;
    const cupDisc = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), new THREE.MeshBasicMaterial({ color: '#111' }));
    cupDisc.rotation.x = -Math.PI / 2;
    cupDisc.position.set(1.6, 0.045, 1.2);
    soil.receiveShadow = turf.receiveShadow = true;
    podium.add(soil, turf, ring, cupDisc);
    this.pivot.add(podium);
    this.scene.add(this.pivot);

    const key = new THREE.DirectionalLight('#fff4e0', 2.6);
    key.position.set(4, 9, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -5;
    key.shadow.camera.right = key.shadow.camera.top = 5;
    const rim = new THREE.DirectionalLight('#9fd0ff', 1.6);
    rim.position.set(-6, 5, -6);
    const hemi = new THREE.HemisphereLight('#dff0ff', '#2e4a22', 1.2);
    this.scene.add(key, rim, hemi);

    canvas.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.lastX = e.clientX;
    });
    addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      this.spinVel = (e.clientX - this.lastX) * 0.012;
      this.spin += this.spinVel;
      this.lastX = e.clientX;
    });
    addEventListener('pointerup', () => (this.dragging = false));
  }

  show(data: GolferData): void {
    if (this.golfer) {
      this.pivot.remove(this.golfer.root);
      this.golfer.dispose();
    }
    if (this.bag) this.pivot.remove(this.bag);
    this.golfer = new GolferModel(data);
    this.golfer.setMode('showcase');
    this.golfer.root.position.set(0, 0.04, 0);
    this.pivot.add(this.golfer.root);
    this.bag = buildGolfBag(data.appearance.bag);
    this.bag.position.set(-1.9, 0.04, -0.8);
    this.bag.scale.setScalar(0.85);
    this.pivot.add(this.bag);
  }

  celebrate(): void {
    this.golfer?.celebrate(false);
    setTimeout(() => this.golfer?.setMode('showcase'), 2600);
  }

  update(dt: number): void {
    if (!this.dragging) {
      this.spinVel *= 0.94;
      this.spin += this.spinVel;
      this.spin += (0 - this.spin) * (this.spinVel === 0 ? 0 : 0) + Math.sin(performance.now() / 3000) * 0.0008;
    }
    this.pivot.rotation.y = this.spin;
    this.golfer?.update(dt);
    const aspect = this.camera.aspect;
    // frame the character; shift to the right for the UI panel on the left
    const sx = -this.offset * 2.6 * Math.min(1.6, aspect / 1.4);
    this.camera.position.set(sx, 3.2, 11.5);
    this.camera.lookAt(sx, 1.9, 0);
  }
}
