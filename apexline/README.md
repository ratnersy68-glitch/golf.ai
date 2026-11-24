# APEXLINE — Every Millisecond Matters.

A browser time-attack racing game: deterministic fixed-timestep driving physics, 275 seeded campaign tracks with simulation-derived medal targets and a verified benchmark ghost on every one, 24 vehicles, 530+ cosmetics, garage, shop, progression, ranked (offline practice rating), ghosts and replays, and a track editor. TypeScript, Vite, Three.js, React, Zustand.

```bash
npm install
npm start            # dev server (vite --host)  ->  http://localhost:5173
npm run build && npm run preview   # production build
```
Needs a modern desktop browser with WebGL 2 (Chrome, Edge, Firefox, Safari). The campaign data in `public/data` is committed, so no build step is needed to play.

## Controls (remappable in Settings)
W/↑ accelerate · S/↓ brake/reverse · A/D or ←/→ steer · Space handbrake · **R** restart · **Backspace** restart from checkpoint · **C** camera · **G** ghost · **Tab** leaderboard · **Esc** pause. Xbox/PlayStation pads (vibration supported) and on-screen touch controls are supported.

## How the competitive side works
* Physics runs at a fixed **120 Hz** with engine-independent maths (`src/sim/dmath.ts`), so a recorded input stream always reproduces the same run. Finish time is interpolated to the millisecond.
* **Ranked, campaign records, daily and weekly runs use one standardised car.** Purchases and cosmetics cannot change a record. Casual modes (Stunt, Endless, Free Drive, casual Time Trial) use each vehicle's own handling.
* A **replay is just the inputs**. Validation re-simulates it (`validateReplay`), which is what the optional server does too.
* **Simulated benchmark**: an automated driver (pure-pursuit steering on an evolved racing line, braking-planned speed profile, per-piece speed genes, air-attitude control, (μ+λ) evolution strategy) searches the *same* physics. Its time is an upper bound found by heuristic search — **not a human record and not proven optimal**. The "estimated floor" shown in the UI is a loose heuristic (length ÷ the benchmark's peak speed). Verified world records say "No record yet" until an online backend supplies them.

## Tools
```bash
npm run campaign:build                 # regenerate + re-optimise all 275 tracks (parallel workers)
npm run campaign:build -- --tracks 1-25 --budget 4000 --passes 3 --resume   # a chapter, deeper search
npm run campaign:track -- 47           # recalculate one track (continues from the best saved genes)
npm run campaign:validate              # re-simulate everything -> docs/TRACK_VALIDATION_REPORT.md
npm test                               # typecheck + headless test-suite (physics determinism, replay anti-cheat, data, economy, saves)
```

## Docs
`DEVELOPMENT.md` (status, decisions, known issues) · `docs/BACKEND.md` (Supabase setup, deployment) · `docs/TRACK_FORMAT.md` · `docs/TRACK_VALIDATION_REPORT.md` · `docs/PERFORMANCE.md`.

## Honest status
See **DEVELOPMENT.md → Not implemented / partial** before assuming a feature exists. Notably: no online multiplayer, no split-route tracks, no terrain sculpting in the editor, audio is procedural (no recorded samples), and visual/physics "feel" has been verified by automated runs and screenshots, not by extended human playtesting.
