# APEXLINE track file format (`.apxtrack`)

UTF-8 JSON. Produced by the in-game editor (Export) and accepted by Import / Custom Tracks.

```json
{
  "format": "apexline-track",
  "version": 1,
  "name": "My Track",
  "env": "formula",
  "author": "Driver",
  "pieces": [ { "k": "start", "l": 44, "w": 14 }, { "k": "straight", "l": 120, "w": 14 }, { "k": "finish", "l": 60, "w": 14 } ]
}
```

## Pieces
A track is a list of *turtle motions*. Every piece is a length plus optional rotations, so banks, hills, loops and corkscrews share one code path.

| field | meaning |
|---|---|
| `k` | semantic kind (`start`, `straight`, `curve`, `bank`, `climb`, `drop`, `ramp`, `jump`, `land`, `loop`, `cork`, `halfpipe`, `narrow`, `finish`) - used for rendering/analysis; geometry comes from the numeric fields |
| `l` | length in metres (sampled every 2 m) |
| `y` | total yaw in radians (+ = left) |
| `p` | pitch *envelope* in radians (hill: rises and returns to level) |
| `dp` | permanent pitch change over the piece (ramps, loops use `2*PI`) |
| `r` | total roll in radians (corkscrews) |
| `b` | bank envelope in radians (inward positive) |
| `w`, `w2` | width at start / end (m) |
| `s` | surface: 0 asphalt, 1 dirt, 2 grass, 3 ice, 4 sand, 5 steel |
| `f` | bit flags: 1 gap (no road), 2 boost pad, 4 open edges (no walls), 8 checkpoint at end, 16 tunnel, 32 bridge supports |

The first piece must be `start`, the last `finish`. `obstacles` (optional) are moving blocks `{ s, d0, amp, per, ph, w, len }`.

## Validation
`validateGeometry` rejects self-intersecting roads, excessive elevation and repetitive layouts; the editor's *Validate* button then asks the automated driver to complete the track with the deterministic physics. Only tracks that pass are marked *validated*.
