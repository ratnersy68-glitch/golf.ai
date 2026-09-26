# Mini Majors

**Real golf courses → shrunk down into mini-golf.** A mobile-first 3D game where every hole is a
miniature recreation of an actual championship hole, played with drag-and-release mini-golf putting, as real
professional golfers.

The identity of the game: **real courses + real golfers + mini-golf gameplay + stylized 3D visuals.**

```
cd game
npm install
npm run dev        # http://localhost:5173 (use --host to test on a phone on the same Wi-Fi)
npm test           # unit tests + hole playability validator
npm run build      # static build in dist/ (deploy anywhere, wrap with Capacitor for app stores)
```

Built with TypeScript, Three.js and Vite. There are no external art or audio assets. Every mesh, texture and
sound is generated from data at runtime, so the whole game is about 200 KB gzipped.

---

## What's in this build

| Area | Status |
| --- | --- |
| **First playable hole** | **Augusta National #12 "Golden Bell"** (155 yd par 3 → 47 ft mini, 1:10). Rae's Creek, Hogan Bridge, the diagonal shallow green, the front bunker and two back bunkers, the azalea bank, loblolly pines, the 11th green and pond, the Amen Corner leaderboard, patrons |
| More recreated holes | Augusta #16 "Redbud", Pebble Beach #7, TPC Sawgrass #17 (island green), all from the same pipeline |
| Courses | 8 real courses with full 18-hole scorecards (par and yardage): Augusta National, Pebble Beach, TPC Sawgrass, St Andrews Old Course, Pinehurst No. 2, Bethpage Black, Torrey Pines South, Valhalla |
| Gameplay | Drag-back aiming, power, predicted putt line, deterministic ball physics (slopes, grass/rough/sand/fringe, water penalties, rails, bridges, lip-outs, cup capture) |
| Golfers | 9 real pros plus your own custom golfer. Stylized 3D characters with IK rigs, idle/putting/celebration/dejected animations, stats and signature abilities |
| Presentation | Cinematic flyover with title card, follow cam, cup cam, golfer celebration cam, confetti/sparkles/splashes/sand/grass VFX, crowd reactions |
| Screens | Main menu, Courses, 3D course diorama (rotatable), Hole select (18 per course), HUD, Hole result, Round/Tournament summary, Golfers, Customize, Tournaments, Profile, Settings, Pause |
| Systems | Save (versioned + migrations), progression tiers, coins/XP, tournaments, cosmetics (balls), procedural audio with per-course ambience |
| Future multiplayer | Deterministic physics + shot records (`src/net/Multiplayer.ts`) for ghosts, async matches and verified leaderboards |

### Controls (landscape, one-handed friendly)

* **Touch near the ball and pull back.** Direction and power follow your finger, and a dotted line previews the first few feet.
* **Release** to putt. Pull-back length sets power (the meter is on the right edge).
* **Drag anywhere else** to swing the camera around the ball; drag vertically or **pinch** to zoom.
* 🗺️ overview of the whole hole · ↺ restart · ❚❚ pause. Tap during the flyover to skip it.

---

## Architecture

```
src/
  data/                     ← content. Pure data, no rendering code
    types.ts                  schema for courses, holes, golfers, tournaments
    courses/courses.ts        real courses + 18-hole scorecards (+ which holes are built)
    holes/*.ts                one file per recreated real hole  ← ADD HOLES HERE
    golfers.ts                real golfer roster (stats, abilities, appearance)
    tournaments.ts            ordered lists of real holes
  world/                    ← turns data into a 3D world
    HoleModel.ts              resolved hole: heights, surfaces, walls, bridges (shared by physics + render)
    TerrainBuilder.ts         painted terrain texture + meshes (also paints thumbnails)
    HoleScene.ts              assembles terrain, water, forest, grass, rails, bridges, flag, landmarks, crowd
    Vegetation.ts Water.ts Props.ts Sky.ts
    GolferModel.ts            procedural golfer character + IK + animation poses
  systems/                  ← game systems (each one is independent)
    BallPhysics.ts            deterministic fixed-step physics (480 Hz)
    HoleManager.ts            rules/state machine for one hole (intro → aim → roll → penalty/hole-out)
    CameraController.ts       cinematic camera modes
    CourseDatabase.ts GolferDatabase.ts PlayerManager.ts (stats → gameplay)
    ScoringSystem.ts TournamentSystem.ts ProgressionSystem.ts CustomizationSystem.ts
    SaveSystem.ts AudioManager.ts VFXManager.ts
  core/                     ← engine + composition
    Engine.ts (renderer/loop) · Game.ts (composition root + navigation)
    WorldStage.ts (play) · PreviewStage.ts (course diorama) · ShowcaseStage.ts (golfer studio)
  ui/                       ← DOM UI over the canvas (UIManager, styles, thumbnails)
  net/Multiplayer.ts        ← match/leaderboard interfaces, shot recorder
  tools/HoleValidator.ts    ← authoring tool: proves a hole is playable
```

**Coordinates.** Hole data is authored in *mini feet*. `x` is lateral (right is positive, looking from the tee)
and `y` is down-range from the tee. World space is `(x, height, -y)`. Everything is in one unit, so
`real yards × 3 ÷ scale = mini feet`.

---

## Adding a real hole (no gameplay code)

1. Create `src/data/holes/<course>-<nn>.ts` exporting a `HoleLayout`. Start from `augusta-12.ts`.
2. Trace the real hole from an aerial or yardage-book view at your chosen scale (1:10 suits par 3s):
   * `bounds`: the mini-golf rails around the playable area
   * `surfaces`: fairway, green, bunkers, water (polygon or `path` + `width` for creeks), paths, tee, and
     scenery beds. Control points are smoothed automatically.
   * `elevation`: base height, ramps, plateaus (greens/tees) with tilt, mounds, channels (creek beds),
     undulations
   * `bridges`, `trees` + `scatter` (loblolly, dogwood, azalea, cypress, palm, redbud…), `rocks`,
     `landmarks` (leaderboard, crowd, grandstand, rope lines, bulkheads, neighbouring greens, signs)
   * `cup` (+ `altPins`), `waterRule`, `grass` colours
   * `signatureFeatures` and **`playabilityAdjustments`**: write down every deviation from the real hole
3. Register it in `src/data/holes/index.ts` and set `layoutId` on the course's scorecard row in
   `courses/courses.ts`.
4. Run `npm test`. The validator searches shots to prove the hole can be finished within par + 1 and prints
   tee-to-water and tee-to-green rates as a difficulty readout. A data-integrity test checks that the
   par and yardage match the scorecard.

Tournaments are lists of hole ids (`data/tournaments.ts`). They grow as holes are added.

---

## Design notes

* **Faithful first.** Layout shape, hazards, elevation and landmarks come from the real hole. Mini-golf
  only adds rails and, where a hole must be crossed along the ground, a route that already exists on the
  real hole (the Hogan Bridge on 12, the right-side bank on 16, the walkway to the island at Sawgrass).
  Each hole lists these adjustments in its data.
* **Stats are subtle.** Across the whole roster, max putt speed differs by less than 10%. Accuracy and
  control add a small aim/pace wobble (under about 1.5°), putting widens the cup capture window by a few
  percent, and spin improves rail rebounds. The unit tests enforce these limits.
* **Deterministic physics** (fixed 1/480 s step, seeded variance) makes replays, ghosts, async multiplayer
  and server-verified leaderboards possible without changing gameplay code.
* **Progression:** Classic → Major Championship → Legendary → Elite, earned with XP. Every course's
  signature hole is open from the start, so every real course can always be reached. Full courses
  unlock by tier or with coins.

## Licensing and accuracy

This is a prototype. Hole geometry is hand-authored from public references, and yardages are
approximate championship figures (each course notes its source). Course names, hole names and golfer
names identify real places and people. A commercial release needs licences from the clubs and tours
and name-and-likeness agreements with the players. The golfer models are original stylized characters,
not scans or likenesses.
