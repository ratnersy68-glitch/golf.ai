# APEXLINE — development log

Last updated with the first full vertical build. This file is deliberately blunt: **"done" means implemented and exercised by an automated check or a screenshot in the build environment; anything else is listed under partial / not implemented.**

## Verified by automation
| Area | Evidence |
|---|---|
| Deterministic 120 Hz physics, engine-independent trig | `npm run test:sim` (bit-identical re-runs; `dsin/dcos` vs `Math` < 1e-7) and the browser e2e (browser finish time == verified benchmark time to the millisecond) |
| 275 tracks / 11 chapters × 25, unique names, rising difficulty | `test:sim`, `docs/TRACK_VALIDATION_REPORT.md` |
| Per track: verified benchmark replay + platinum/gold/silver/bronze medal ghosts | `npm run campaign:validate` re-simulates all of them |
| Anti-cheat replay validation (faked time, tampered/out-of-range inputs, unfinished runs) | `test:sim` |
| Economy: anti-farming decay, one-time medal bonuses, benchmark reward, level curve, ranked rating | `test:sim` |
| Save migration, export/import, persistence across reload | `test:sim` + `tools/e2e.cjs` |
| Shop purchase, currency deduction, duplicate/insufficient-funds rejection, equip → stored on setup | `tools/e2e.cjs` |
| All screens render without console errors; no horizontal overflow at 390×844, 768×1024, 1024×600, 1920×1080 | `tools/e2e.cjs` (+ screenshots in `docs/screenshots/`) |
| Restart (R), checkpoint respawn (Backspace), pause (Esc), keyboard throttle | `tools/e2e.cjs` |

## Overhaul log (vehicles / physics / camera / marble identity)
* **Physics (`apexline-sim-3`)**: replaced the slip-angle bicycle model with a grip-budget arcade model (`src/sim/vehicle.ts`). Added landing assist, loop/wall-ride magnet, consistent wall response (outward speed removed, heading aligned with the wall). Benchmark finish rate during search rose from ~60-80% to ~95-100% of evaluations; 264/275 benchmark laps are crash-free (was 222). Feel is pinned by tests (steering reaches 85% yaw in 0.2 s, <6° slip in a hard corner at 40 m/s, dead-straight with no input, <4 s stop from 200+ km/h, no blow-ups under fuzzed input, ≥90% clean landings under random air control). Digital-keyboard bots finish 12/12 sample tracks within ~1-20% of the benchmark.
* **Vehicles**: `src/game/kit.ts` loads the supplied GLB; `src/game/car.ts` assembles every car from it. `src/game/carcheck.ts` + e2e verify all 24 cars (wheels at road level, facing forward, footprint within collision body, distinct silhouettes) and that all 534 cosmetics apply.
* **Camera**: placed behind/above, aimed ~11 m + speed ahead, no constant rumble, FOV 70→79, world-up blend while airborne; verified through a full loop.
* **Identity**: white-marble palette (`#FFFFFF #F5F5F3 #E8EAED #D8DCE0 #B8BDC4 #25282D`), procedural marble (`src/ui/marble.ts`), Jost/Inter typography, reflective marble showroom, 3D cosmetic thumbnails (`src/game/preview.ts`).
* **Data**: old records/replays/genes archived under `archive/physics-2/`; saves migrate v2→v3 by moving records into `profile.archive` (medal count high-water mark keeps chapters unlocked) and PB replays into `archive:*` IndexedDB keys.
* Regenerated all 275 tracks, benchmarks and medal ghosts with the new physics; `docs/TRACK_VALIDATION_REPORT.md` regenerated (275/275).

## Architecture
* `src/sim/` — pure TypeScript, runs identically in Node, browsers and (via `backend:sync`) Deno.
  * `track.ts` turtle-based modular track builder (straights, curves, banks, hills, ramps/gaps, full loops, corkscrew-style twisted loops, halfpipes, boost pads, ice/dirt/grass/sand/steel, tunnels/bridges, moving obstacles, checkpoints). The road is a ribbon; the car is simulated in road coordinates while grounded and in world space while airborne.
  * `vehicle.ts` bicycle-model tyre physics with friction circle, dynamic weight transfer, speed-sensitive steering, handbrake slides, aero drag/downforce, banking and slope from real gravity, centripetal detach (loops need real speed), air control, landing-quality speed loss, walls, moving obstacles, boost pads, checkpoints, sub-tick finish interpolation.
  * `driver.ts` the automated benchmark driver (see README). `trackgen.ts` seeded campaign generator with geometry validation. `replay.ts` input-stream replays + validation.
* `src/game/` rendering (Three.js: PBR cars lofted from per-vehicle silhouettes, per-environment worlds with terrain/props/water/sky, bloom/GTAO/motion-blur, particle pools, skid marks), race session (fixed-step loop with render interpolation), cameras, input, store/progression/economy, save.
* `src/ui/` React screens. `src/audio/` procedural WebAudio engine/SFX/music. `src/net/` optional Supabase layer.
* `tools/` campaign builder (worker threads), validator, tests, e2e, backend sync.

## Technical decisions
* **Custom physics instead of Rapier**: a ribbon-based custom model gives exact determinism (no engine floating-point variance), loops/banks as first-class geometry and ~2 ms per simulated minute, which is what makes thousands of benchmark simulations per track affordable.
* **Standardised ranked car**: all records use `STANDARD`; vehicle stats only affect casual modes.
* **Replay = inputs** (quantised, run-length encoded). Server and client share one simulation.
* **Tracks are generated from permanent seeds** and committed as JSON (`public/data/campaign.json`), so geometry never depends on the client machine.
* Benchmark medal tiers: Apex ≤ benchmark×1.01, Platinum ≈ ×1.05–1.07, Gold ≈ ×1.14–1.30 (more generous in early chapters), Silver/Bronze above. Beating the benchmark (strictly) pays tokens and unlocks the Benchmark Breaker rewards.

## Partial / not implemented (read this)
* **Multiplayer, friends, regional boards, community track publishing, rooms, spectating, friend ghosts: not implemented** (schema stub only). Online leaderboards/cloud save/validation function are written but **never deployed or run here** — see `docs/BACKEND.md`.
* **Track design gaps**: no split routes or shortcut branches; wall-riding exists only as steeply banked halfpipes (no dedicated wall-ride physics); corkscrews are loops with a partial twist (a full 360° roll cannot hold the car under the current contact model, found by test); tunnels/bridges are decorative; moving obstacles are sliding blocks only.
* **Benchmark engine**: evolutionary search over racing line + speed profile with deterministic simulation. Spline planning, beam search and shortcut discovery are not implemented. "Estimated floor" is a loose heuristic, not a bound.
* **Editor**: piece-sequence editor with live 3D view, undo/redo, copy/paste, multi-select, 2 m / 5° snapping, surfaces, flags, environment presets, validate-with-driver, playtest, export/import. **No terrain sculpting, freeform scenery placement, lighting sliders or obstacle placement UI.**
* **Graphics**: no WebGPU path, no texture compression, no LODs beyond instancing/draw distance, reflections are environment-map only, no planar/screen-space reflections. Ambient occlusion (GTAO) is wired but only checked for "does not crash".
* **Not verified on real hardware**: gamepads and rumble, touch controls, audio by ear, GPU frame rates (all runs here used software WebGL, ~14 fps at 800×450, so *no 60/120 FPS claim is made*).
* **Feel**: handling was validated by automated driving, bots with keyboard-style steering and the feel tests above (0–100 km/h ≈ 3.0 s), not by long human playtesting. Screenshots were taken in software WebGL. Economy numbers and vehicle balance are first-pass and have **not** been playtested.
* Casual vehicle classes do not have separate local leaderboards; casual runs are simply not counted toward records.
* Vehicles share one low-poly open-wheel kit (the supplied GLB) with per-car proportions, wings and parts, so the roster is a family of cars rather than 24 unrelated models. The GLB's Body/Cockpit were too simple to use as-is, so they are re-lofted (smoothed sections, chamfers, flat shading) from the GLB's own section data; wheels use the GLB tyre mesh. No interiors; cockpit camera has no dashboard model.
* Audio is synthesised (original, no licensed assets); it is functional but simple.

## Known issues
* Software-rendered test runs show the countdown/clock in slow motion when the frame rate is very low (frame time is clamped at 100 ms by design).
* Chromium logs "GPU stall due to ReadPixels" under SwiftShader when PMREM environment maps are regenerated at environment changes.
* `GTAOPass` with MSAA render targets is untested across drivers.

## Next steps (priority order)
1. Human playtest and tune handling feel, steering assist, camera; rebalance economy.
2. Deploy the Supabase project; wire friends + realtime rooms.
3. Branching routes + shortcut-aware benchmark driver; spline/beam-search planner.
4. Editor terrain/scenery/obstacle tools.
5. Hand-authored car meshes, interiors, recorded audio.
