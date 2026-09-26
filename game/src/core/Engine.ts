import * as THREE from 'three';

export interface Stage {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update(dt: number): void;
  resize?(w: number, h: number): void;
  dispose?(): void;
}

export type Quality = 'low' | 'high';

/** Owns the WebGL renderer and the frame loop; renders whichever Stage is active. */
export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  private stage: Stage | null = null;
  private last = performance.now();
  private listeners: ((dt: number) => void)[] = [];
  quality: Quality;
  fps = 60;

  constructor(canvas: HTMLCanvasElement, quality: Quality) {
    this.canvas = canvas;
    this.quality = quality;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.applyQuality();
    addEventListener('resize', () => this.resize());
    this.resize();
    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.fps = this.fps * 0.95 + (1 / Math.max(dt, 1e-3)) * 0.05;
      for (const l of this.listeners) l(dt);
      if (this.stage) {
        this.stage.update(dt);
        this.renderer.render(this.stage.scene, this.stage.camera);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  setQuality(q: Quality): void {
    this.quality = q;
    this.applyQuality();
  }

  private applyQuality(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, this.quality === 'high' ? 2 : 1.25);
    this.renderer.setPixelRatio(dpr);
    this.resize();
  }

  onFrame(fn: (dt: number) => void): void {
    this.listeners.push(fn);
  }

  setStage(stage: Stage): void {
    this.stage = stage;
    this.resize();
  }

  get activeStage(): Stage | null {
    return this.stage;
  }

  resize(): void {
    const w = this.canvas.clientWidth || innerWidth;
    const h = this.canvas.clientHeight || innerHeight;
    this.renderer.setSize(w, h, false);
    if (this.stage) {
      this.stage.camera.aspect = w / h;
      this.stage.camera.updateProjectionMatrix();
      this.stage.resize?.(w, h);
    }
  }
}
