import * as THREE from 'three';
import type { CourseData, HoleLayout } from '../data/types';
import { polyBounds } from '../world/geometry';
import { HoleModel } from '../world/HoleModel';
import { HoleScene } from '../world/HoleScene';
import type { Quality, Stage } from './Engine';

/** A miniature diorama of a real hole on a plinth that the player can spin around. */
export class PreviewStage implements Stage {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.5, 800);
  private pivot = new THREE.Group();
  private hole: HoleScene | null = null;
  private yaw = -0.5;
  private pitch = 0.6;
  private vel = 0.08;
  private dragging = false;
  private last = new THREE.Vector2();
  private dist = 90;
  private cache = new Map<string, HoleScene>();
  private placeholder: THREE.Group | null = null;
  offset = 0.42;

  constructor(canvas: HTMLCanvasElement, private quality: Quality) {
    this.scene.background = new THREE.Color('#0d1f16');
    const hemi = new THREE.HemisphereLight('#e8f4ff', '#3b5a2a', 1.3);
    this.scene.add(hemi, this.pivot);
    canvas.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.last.set(e.clientX, e.clientY);
    });
    addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      this.vel = (e.clientX - this.last.x) * 0.008;
      this.yaw += this.vel;
      this.pitch = THREE.MathUtils.clamp(this.pitch + (e.clientY - this.last.y) * 0.004, 0.2, 1.3);
      this.last.set(e.clientX, e.clientY);
    });
    addEventListener('pointerup', () => (this.dragging = false));
    canvas.addEventListener('wheel', (e) => (this.dist = THREE.MathUtils.clamp(this.dist + e.deltaY * 0.05, 45, 150)), { passive: true });
  }

  show(course: CourseData, layout: HoleLayout | undefined): void {
    this.pivot.clear();
    this.scene.background = new THREE.Color(course.palette.ink);
    this.scene.fog = new THREE.Fog(course.palette.ink, 150, 320);
    if (!layout) {
      this.showPlaceholder(course);
      return;
    }
    let hs = this.cache.get(layout.id);
    if (!hs) {
      hs = new HoleScene(new HoleModel(layout), { diorama: true, quality: this.quality, atmosphere: course.atmosphere, flagColor: '#f2c94c', leaderNames: [] });
      this.cache.set(layout.id, hs);
    }
    this.hole = hs;
    const b = polyBounds(layout.bounds);
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    hs.group.position.set(-cx, 0, cy);
    this.pivot.add(hs.group);
    this.dist = Math.max(b.maxX - b.minX, b.maxY - b.minY) * 1.55 + 20;
  }

  private showPlaceholder(course: CourseData): void {
    this.hole = null;
    const g = new THREE.Group();
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(40, 4, 60), new THREE.MeshStandardMaterial({ color: '#4a321f', roughness: 1 }));
    plinth.position.y = -2;
    const top = new THREE.Mesh(new THREE.BoxGeometry(40, 0.3, 60), new THREE.MeshStandardMaterial({ color: '#3d7a35', roughness: 1 }));
    // survey grid: the hole is being measured
    const grid = new THREE.GridHelper(56, 14, new THREE.Color(course.palette.accent), new THREE.Color(course.palette.accent));
    grid.scale.set(40 / 56, 1, 60 / 56);
    grid.position.y = 0.2;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    const sun = new THREE.DirectionalLight('#ffffff', 2);
    sun.position.set(20, 40, 30);
    g.add(plinth, top, grid, sun);
    this.pivot.add(g);
    this.placeholder = g;
    this.dist = 110;
  }

  update(dt: number): void {
    if (!this.dragging) {
      this.vel += (0.12 * dt - this.vel) * 0.02;
      this.yaw += this.vel * (this.vel > 0.05 ? 1 : 1);
    }
    this.pivot.rotation.y = this.yaw;
    this.hole?.update(dt, 1);
    const aspect = this.camera.aspect;
    const shift = this.offset * this.dist * 0.28 * Math.min(1.5, aspect / 1.4);
    this.camera.position.set(-shift, Math.sin(this.pitch) * this.dist, Math.cos(this.pitch) * this.dist);
    this.camera.lookAt(-shift, 0, 0);
    void this.placeholder;
  }
}
