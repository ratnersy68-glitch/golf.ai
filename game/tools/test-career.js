// Road to Pro: run whole careers through the engine (simulating every round; critical rounds get
// synthetic "played" scores) and check every stage transition happens.
import { newCareer, startEvent, currentEvent, recordRound, simulateRound, advance, resolve, ranking, standings } from '../src/game/career.js';
import { newProfile, newGolfer } from '../src/core/profile.js';
import { syncWallet } from '../src/core/wallet.js';
import { mulberry32 } from '../src/core/noise.js';
import { getCourse } from '../src/data/courses.js';
import { writeFileSync } from 'node:fs';

const assert = (c, m) => { if (!c) { console.error('FAIL', m); process.exit(1); } };
function run(seed, ovrBoost, label) {
  const p = newProfile();
  p.golfer = newGolfer('Sam Fairway');
  for (const k of Object.keys(p.golfer.attrs)) p.golfer.attrs[k] = 55 + ovrBoost;
  p.rtp = newCareer(p, 'HS-01');
  const rng = mulberry32(seed);
  const seen = new Set();
  let guard = 0;
  while (guard++ < 400) {
    const c = p.rtp;
    if (c.pending) {
      seen.add(c.pending.type + (c.pending.to ? ':' + c.pending.to : ''));
      if (c.stage === 'pro' && c.tour === 'elite' && c.year >= 2) {
        if (process.env.FIXTURE) { resolve(p, null); writeFileSync(process.env.FIXTURE, JSON.stringify({ rtp: p.rtp, golfer: p.golfer })); }
        break;
      }
      const choice = c.pending.type === 'offers' ? c.pending.offers[0] : c.pending.type === 'turnpro' ? 'pro' : null;
      resolve(p, choice);
      // golfer improves with the career (as XP/level-ups would)
      for (const k of Object.keys(p.golfer.attrs)) p.golfer.attrs[k] = Math.min(99, p.golfer.attrs[k] + 2.5);
      continue;
    }
    const e = startEvent(c);
    assert(e, 'no current event');
    seen.add(e.kind);
    let r;
    do {
      const sc = e.critical ? getCourse(e.courseId).holes.slice(0, e.holes).map(h => h.p + (rng() < 0.3 ? 1 : rng() < 0.15 ? -1 : 0)) : simulateRound(c, e, p.golfer);
      r = recordRound(p, sc, !e.critical);
    } while (!r.done);
    assert(Number.isFinite(r.result.pos) && Number.isFinite(r.result.toPar), 'bad result ' + JSON.stringify(r.result));
    advance(p);
  }
  syncWallet(p);
  const c = p.rtp;
  console.log(`${label}: stage ${c.stage}/${c.tour} y${c.year} · events ${c.stats.events} wins ${c.stats.wins} majors ${c.stats.majorWins} · ${ranking(c).label} #${ranking(c).rank} · coins ${p.coins} · trophies ${c.trophies.length} · sponsors ${c.sponsors.join(',')} · save ${JSON.stringify(c).length}B`);
  console.log('  seen:', [...seen].join(' '));
  return { c, seen };
}
const a = run(1, 0, 'average golfer');
const b = run(2, 25, 'strong golfer');
for (const k of ['tryout', 'dual', 'hsinv', 'hsreg', 'offers', 'col', 'conf', 'creg', 'turnpro', 'q']) assert(a.seen.has(k) || b.seen.has(k), 'never saw ' + k);
assert(b.seen.has('major') && b.seen.has('elite'), 'strong golfer never reached the Crown Tour');
console.log('career checks OK');
