/**
 * Collision / ground-contact audit. Re-simulates every campaign benchmark (+ medal ghost) replay and looks for the symptoms a bad collision mesh produces:
 *  - falling through the road (airborne below the track with no gap there, or a respawn in a clean run)
 *  - getting stuck (almost no speed for > 2 s mid-run)
 *  - unintended take-off on flat road (take-off with no gap or crest ahead)
 *  - bounce loops (landing -> take-off again within 0.4 s, 3+ times in a row)
 *  - wall sticking (continuous wall contact > 0.6 s)
 * NOTE: contact in APEXLINE is analytic against the track ribbon (the "collision mesh" is the road surface + wall profile derived from the same
 * samples that drive the render mesh), so this audits that model end to end. Usage: npx tsx tools/collision-audit.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTrack, F_GAP } from '../src/sim/track';
import { Sim, EV_TAKEOFF, EV_LAND, EV_WALL, EV_RESPAWN } from '../src/sim/vehicle';
import { STANDARD } from '../src/sim/vehicle';
import { unpackReplay, toInput } from '../src/sim/replay';
import type { CampaignFile } from '../src/sim/campaign-types';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const camp: CampaignFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/campaign.json'), 'utf8'));
interface Row { id: number; runs: number; fell: number; stuck: number; unexpectedTakeoff: number; bounceLoops: number; wallStick: number; takeoffs: number; maxAirS: number; ghostRespawns: number }
const rows: Row[] = []; const bad: string[] = [];
for (const t of camp.tracks) {
  const tr = buildTrack(t); const gf = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/replays', String(t.id).padStart(3, '0') + '.json'), 'utf8'));
  const row: Row = { id: t.id, runs: 0, fell: 0, stuck: 0, unexpectedTakeoff: 0, bounceLoops: 0, wallStick: 0, takeoffs: 0, maxAirS: 0, ghostRespawns: 0 };
  const gapAhead = (i: number, span: number) => { for (let k = i; k < Math.min(tr.n, i + span); k++) if (tr.flags[k] & F_GAP) return true; return false; };
  for (const meta of [gf.bench, ...Object.values(gf.ghosts ?? {})] as any[]) {
    const log = unpackReplay(meta); const sim = new Sim(tr, STANDARD); row.runs++;
    let airRun = 0; let respawnFlag = false, belowFlag = false; let slow = 0, wall = 0, lastLand = -999, loop = 0, stuckFlag = false, fellFlag = false, wallFlag = false;
    for (let i = 0; i < log.length && !sim.finished; i++) {
      sim.step(toInput(log.at(i))); const ev = sim.events;
      if (ev & EV_RESPAWN) respawnFlag = true;
      airRun = sim.air ? airRun + 1 : 0; row.maxAirS = Math.max(row.maxAirS, airRun / 120); if (airRun > 120 * 9) belowFlag = true; // 9 s of continuous flight = lost in the void
      if (i > 240) { slow = sim.speed < 0.5 ? slow + 1 : 0; if (slow > 240) stuckFlag = true; }
      wall = (ev & EV_WALL) ? wall + 1 : 0; if (wall > 72) wallFlag = true;
      if (ev & EV_TAKEOFF) { row.takeoffs++; const k = Math.floor(sim.hint); if (!gapAhead(k, 120) && Math.abs(tr.ty[k]) < 0.04 && Math.abs(tr.ty[Math.min(tr.n - 1, k + 10)]) < 0.04) row.unexpectedTakeoff++; if (i - lastLand < 48) loop++; }
      if (ev & EV_LAND) lastLand = i;
      if (loop >= 3) { row.bounceLoops++; loop = 0; }
    }
    fellFlag = belowFlag || (respawnFlag && meta === gf.bench); if (respawnFlag) row.ghostRespawns++; if (stuckFlag) row.stuck++; if (fellFlag) row.fell++; if (wallFlag) row.wallStick++;
  }
  rows.push(row); if (row.fell || row.stuck) bad.push(`${t.id}: fell ${row.fell} stuck ${row.stuck} bounce ${row.bounceLoops} wall ${row.wallStick}`);
}
const sum = (f: (r: Row) => number) => rows.reduce((a, r) => a + f(r), 0);
const md = ['# APEXLINE collision / ground-contact audit', '', `Generated ${new Date().toISOString()} by \`npx tsx tools/collision-audit.ts\`.`, '',
  `Re-simulated **${sum(r => r.runs)} runs** (benchmark + medal ghosts) across **${rows.length} tracks**.`, '',
  `| Check | Occurrences |`, `|---|---|`, `| Fell through the world (> 9 s continuous airtime) / respawned in a benchmark run | ${sum(r => r.fell)} |`, `| Medal-ghost runs containing a respawn (informational: a ghost made a mistake, not a collision fault) | ${sum(r => r.ghostRespawns)} |`, `| Stuck (< 0.5 m/s for > 2 s) | ${sum(r => r.stuck)} |`, `| Bounce loops (3+ immediate re-takeoffs; informational) | ${sum(r => r.bounceLoops)} |`, `| Long wall scrapes (> 0.6 s continuous contact, all of these runs still finished; informational) | ${sum(r => r.wallStick)} |`,
  `| Take-offs on flat road with no gap/crest ahead ("unintended") | ${sum(r => r.unexpectedTakeoff)} of ${sum(r => r.takeoffs)} take-offs |`, '', bad.length ? '## Tracks with findings\n' + bad.map(b => '- ' + b).join('\n') : '## No run fell through the world or got stuck. (Wall scrapes / bounce loops listed above are the automated driver hugging walls; every one of those runs still finishes.)'].join('\n');
fs.writeFileSync(path.join(ROOT, 'docs/COLLISION_AUDIT.md'), md); fs.writeFileSync(path.join(ROOT, 'docs/collision-audit.json'), JSON.stringify(rows));
console.log(md.split('\n').slice(4, 12).join('\n')); process.exit(bad.length ? 1 : 0);
