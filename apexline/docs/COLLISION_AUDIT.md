# APEXLINE collision / ground-contact audit

Generated 2026-11-24T21:11:09.812Z by `npx tsx tools/collision-audit.ts`.

Re-simulated **1375 runs** (benchmark + medal ghosts) across **275 tracks**.

| Check | Occurrences |
|---|---|
| Fell through the world (> 9 s continuous airtime) / respawned in a benchmark run | 0 |
| Medal-ghost runs containing a respawn (informational: a ghost made a mistake, not a collision fault) | 0 |
| Stuck (< 0.5 m/s for > 2 s) | 0 |
| Bounce loops (3+ immediate re-takeoffs; informational) | 1 |
| Long wall scrapes (> 0.6 s continuous contact, all of these runs still finished; informational) | 9 |
| Take-offs on flat road with no gap/crest ahead ("unintended") | 0 of 2841 take-offs |

## No run fell through the world or got stuck. (Wall scrapes / bounce loops listed above are the automated driver hugging walls; every one of those runs still finishes.)