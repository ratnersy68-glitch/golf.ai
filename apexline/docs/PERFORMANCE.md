# Performance report

**Read first:** the build environment has no GPU. All rendering numbers below come from Chromium's *software* WebGL (SwiftShader) and say nothing about real hardware. **No 60 / 120 FPS claim is made.** Use Settings → "Show FPS counter" on your machine; the presets exist to trade quality for frame rate.

## Measured (this environment)
| Metric | Result |
|---|---|
| Simulation step (Node 22) | ≈ 0.5 µs per 120 Hz tick (`npm run bench`) → a 60 s lap simulates in ≈ 4 ms |
| Track build from pieces | ≈ 0.7 ms |
| One automated-driver evaluation (full lap, ≈ 1.5 km) | ≈ 2.7 ms |
| Seeded track generation + geometry validation | ≈ 4 ms |
| Full campaign build (275 tracks, budget 1500 × 2 passes, 4 workers) | ≈ 11.5 min |
| Production bundle | 1.14 MB JS (323 KB gzip) + 34 KB CSS + 22 KB validation worker |
| Campaign data | `campaign.json` 1.1 MB; replays 21 MB total (≈ 75 KB per track: benchmark + 4 medal ghosts), fetched per track on demand |
| Software-WebGL frame rate | ≈ 14 fps at 800×450 "Potato" (CPU rasteriser; not representative) |

The simulation is decoupled from rendering (fixed 120 Hz with interpolation, at most 12 catch-up steps per frame), so lap times are identical at any frame rate, and the physics cost is negligible next to rendering.

## What is implemented for performance
* Instanced meshes for all scenery; merged static geometry per surface type for roads, walls, kerbs, markings.
* Pooled particle systems (fixed-size ring buffers), ring-buffer skid marks.
* Quality presets: Potato / Low / Medium / High / Ultra / Cinematic controlling resolution scale, shadow-map size (off/1k/2k/4k), reflections (environment map on/off), particle count, draw distance (camera far plane + fog + prop density), bloom, GTAO, motion blur, MSAA, FPS limit.
* Pixel ratio capped at 2 × resolution scale; post-processing only built when needed.
* Shadow frustum follows the car; level-of-detail by distance fog/prop density.
* Replays are run-length encoded inputs (2–75 KB per run).

## Not implemented
Mesh LODs, GPU texture compression (all textures are small procedural canvases), occlusion culling, web-worker rendering, WebGPU path, adaptive resolution. Frame-time budgets on real GPUs have not been profiled.
