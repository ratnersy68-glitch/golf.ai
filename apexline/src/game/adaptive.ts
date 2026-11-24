/**
 * Adaptive resolution controller. Watches smoothed frame time and nudges a render-scale multiplier (never below 0.55)
 * down when the device cannot hold the target, and back up when there is clear headroom. Hysteresis + cooldown keep it
 * from oscillating; it never touches the simulation, only how many pixels are drawn.
 */
export class AdaptiveRes {
  scale = 1; private slow = 0; private fast = 0; private cooldown = 0; private ema = 16.7;
  reset() { this.slow = this.fast = 0; this.cooldown = 1.5; }
  /** @returns new scale if it changed, else null */
  update(dtMs: number, targetFps: number, enabled: boolean): number | null {
    this.ema += (Math.min(dtMs, 100) - this.ema) * 0.08;
    if (!enabled) { if (this.scale !== 1) { this.scale = 1; return 1; } return null; }
    this.cooldown -= dtMs / 1000; if (this.cooldown > 0) return null;
    const budget = 1000 / targetFps;
    if (this.ema > budget * 1.18) { this.slow++; this.fast = 0; } else if (this.ema < budget * 0.72) { this.fast++; this.slow = 0; } else { this.slow = this.fast = 0; }
    if (this.slow > 45 && this.scale > 0.56) { this.scale = Math.max(0.55, +(this.scale - 0.1).toFixed(2)); this.slow = 0; this.cooldown = 1.2; return this.scale; }
    if (this.fast > 240 && this.scale < 1) { this.scale = Math.min(1, +(this.scale + 0.05).toFixed(2)); this.fast = 0; this.cooldown = 2; return this.scale; }
    return null;
  }
}
