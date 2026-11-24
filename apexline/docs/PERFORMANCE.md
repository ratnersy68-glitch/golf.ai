# APEXLINE performance report — before / after the optimisation pass

**Read first.** This environment has **no GPU**: Chromium renders with the SwiftShader software rasteriser, so wall-clock FPS here says nothing about real hardware and **no 60 / 120 / 144 / 240 FPS claim is made**. What *is* meaningful and was measured: draw calls, triangles, geometry/texture counts, JS time per frame (simulation + render submission), world-build and enter/restart times, heap and leak growth. Raw data: `docs/perf-before.json`, `docs/perf-after.json` (`node tools/perf.cjs <label>`; tracks 1, 60, 105, 185, 262 × presets high/low; 960×540).

## Before → after (averages over the 5 tracks)

| Metric | High: before → after | Low: before → after |
|---|---|---|
| Track load (click → driving), incl. dev-server module/replay fetch | 2.94 s → 1.91 s | 5.78 s → 1.24 s |
| World build | 223 ms → 95 ms | 258 ms → 69 ms |
| Race enter (world + car + FX + ghost profile) | 289 ms → 203 ms | 316 ms → 107 ms |
| Restart (sync part) | 0.06–0.2 ms → 0.08–0.56 ms (both ≪ 200 ms; the 120 Hz sim state reset is the only work) | same |
| Draw calls / frame | 182 → 163 | 102 → 86 |
| Triangles / frame | 116.6 k → 68.3 k | 64.6 k → 22.8 k |
| JS time per frame | 3.1 → 3.5 ms | 2.2 → 1.8 ms |
| Physics step cost per frame | 0.1–0.5 ms (unchanged; deterministic 120 Hz sim untouched) | |

Honest notes: high-preset draw calls fell only ~10 % (the car is 20 meshes of wheels/lights that animate; shadows double casters), and high-preset JS time rose slightly (culling + 4 K shadow-mode props). The largest wins are triangles (−41 % high, −65 % low), world build (−57 % / −73 %) and low-end load time. “Load < 2 s” was met on every track at both presets in this run (the first run on a cold page includes dev-server transforms). Track 1 on high is still the heaviest scene (192 k triangles: dense kit trees).

## Leaks (extended session: 30 restarts + 12 track switches after a warm-up pass)
| | Before | After |
|---|---|---|
| geometries | +23 | +2 |
| textures | +170 | +12 (bounded caches still filling, e.g. gate-label textures; flat at 23 across repeated showroom visits) |
| JS heap | +7.1 MB | +0.3 MB |
| scene children | 0 | 0 |

Fixed along the way: post-processing chain rebuilt (and ~12 render targets leaked) on every settings change; showroom light shadow maps, reflector and skid-mark geometry never disposed; per-track materials/textures re-created for every world (now shared caches). The “before” leak figure had no warm-up pass, so part of that +170 was one-time cache fill; the fixes above are still real (the composer and showroom leaks were found and verified individually).

## What was implemented
* **Chunked world** (`worldv2.ts`): road split into 80 m chunks, each with full and half-resolution LOD; far chunks are a single vertex-coloured draw call. Per-frame distance + frustum culling. Terrain tiled with a coarse far LOD. Props are instanced per 320 m cell with LOD geometry and size-based distance cut-offs; shared material/texture/geometry caches across tracks; gates share materials.
* **Track assets** (`tools/import-track-assets.ts` → `public/models/track_kit.json`, `trackkit.ts`): trees, bushes, stones, tyre walls/stacks, fences, lamps, tribune, garages, flags, towers from `low_poly_race_track.glb`, recoloured to the marble palette, vertex-cluster LODs, quantised. **Limits, stated plainly:** the supplied GLB is truncated (its binary chunk is ~134 KB short), so the atlas texture and 17 meshes (road 90, road 90 fix, crooked road, springboard, wheel, road, starting places, finish…) are unrecoverable; `Objects.mtl` was not attached; `Track.stl` is not a drivable track. Campaign tracks remain procedural ribbons, so geometry, physics and all 275 benchmarks are unchanged and still validate.
* **Collision**: contact stays analytic against the same ribbon samples that build the render mesh (no separate triangle mesh to drift). `tools/collision-audit.ts` re-simulates 1,375 runs (benchmark + medal ghosts × 275 tracks): 0 fall-throughs, 0 stuck runs, 0 unintended take-offs of 2,841, 1 bounce loop and 9 long wall scrapes by the automated driver (see `docs/COLLISION_AUDIT.md`).
* **Runtime**: car meshes merged by material (53 → 32 per car); allocation-free render loop; mini-map drawn from a store subscription with a cached base layer (no React re-render); RPM bar memoised; optional overlay; lazy-loaded secondary screens and on-demand GTAO; LRU track cache (6) and ghost cache (8) instead of caching all 275; PMREM environment cached per environment; real FPS limiter (30/60/120/144/165/240/unlimited — unlimited = display refresh, a browser cannot exceed it); adaptive resolution (0.55–1× steps with hysteresis, never touches physics).
* **Settings**: five presets (Performance, Low, Medium, High, Ultra) plus individual resolution scale, shadows, reflections, particles, render distance, ambient occlusion, bloom, motion blur, AA, FPS limit, adaptive toggle, overlay (F3 in a race). “Detect best settings” (and a one-time first-launch run) benchmarks a synthetic scene on the device and chooses a preset; it is a heuristic. Save v4 migrates `potato→performance`, `cinematic→ultra`.
* **Physics/input**: unchanged fixed 120 Hz deterministic step (≤12 catch-up steps), rendering interpolates; input is sampled at frame start and keyboard steering ramps are dt-based (frame-rate independent). No change to competitive physics, so no benchmark needed recomputation (`tools/validate.ts` still passes).

## Not done / not claimed
* No GPU-measured frame rates; targets (60 / 120 / 144–240 FPS) are unverified on real hardware.
* No KTX2/Basis texture compression (no toolchain here; textures are small procedural canvases, 128–256 px).
* Web Workers: only the existing editor validation worker. Ghost time-profile and finish validation still run on the main thread (≈ms).
* Ambient occlusion remains GTAO (ultra); no custom shader rewrite; no occlusion culling.
* No modular ramp/loop/corkscrew pieces were derived from the assets (the usable road meshes were the truncated ones).
