import { Gfx } from './gfx';
import type { Settings } from './types';

let gfx: Gfx | null = null;
export function initGfx(canvas: HTMLCanvasElement, settings: Settings): Gfx {
  if (!gfx) {
    gfx = new Gfx(canvas, settings);
    const onResize = () => gfx!.resize(canvas.clientWidth, canvas.clientHeight);
    window.addEventListener('resize', onResize); new ResizeObserver(onResize).observe(canvas); onResize();
  }
  return gfx;
}
export function getGfx(): Gfx { if (!gfx) throw new Error('gfx not ready'); return gfx; }
export function hasGfx(): boolean { return !!gfx; }
