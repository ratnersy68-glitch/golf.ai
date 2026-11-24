# Online backend setup (Supabase)

APEXLINE is fully playable offline. Online features (global/friends/regional/seasonal leaderboards, server-verified records, cloud saves, community tracks, rooms) activate **only** when a Supabase project is configured. Without it the UI says so; no online data is ever simulated.

## 1. Create the project
1. Create a Supabase project, copy the *Project URL* and *anon key*.
2. Run `supabase/schema.sql` in the SQL editor (tables + row-level security; clients can only read valid records; only the edge function inserts them).
3. Auth → enable *Email* (magic link). Add your site URL to the redirect list.

## 2. Deploy server-side replay validation
```bash
npm run backend:sync              # copies src/sim -> supabase/functions/validate-run/sim (same physics as the client)
supabase link --project-ref <ref>
supabase functions deploy validate-run
```
The function never trusts a client time: it receives the **input stream**, rebuilds the track from its permanent seed, re-simulates at 120 Hz with the deterministic physics and only then inserts the record. It rejects out-of-range inputs, missing checkpoints, wrong lengths and any time that differs from the simulated one by even 1 ms. Ranked/leaderboard runs must use the standardised vehicle.

> The edge function and `backend:sync` could not be executed in the build environment (no Deno / Supabase project there). The shared simulation code is covered by `npm run test:sim`; the deployment step itself is untested.

## 3. Configure the client
Create `.env.local` (or set CI variables) before building:
```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

## What is and is not implemented
| Feature | Status |
|---|---|
| Replay submission + server re-simulation, global / seasonal / daily boards, cloud save sync, sign-in | client + function + schema written; needs your project to run |
| Friends, regional boards, community track publishing, rooms, live multiplayer (16 players), spectating | schema tables exist; **no client UI or realtime netcode** is implemented yet |
| Asynchronous ghost racing | local ghosts work offline; friend ghosts need the backend (not wired) |

Multiplayer is intentionally *not* presented as working.

## Deployment (static hosting)
`npm run build` produces `dist/` (static files + `data/` JSON). Host on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). No server is required for offline play.
