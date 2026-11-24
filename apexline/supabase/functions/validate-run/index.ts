// Supabase Edge Function: server-side replay validation. The client never sends a trusted time; it sends the input stream
// and this function re-simulates it with the SAME deterministic physics (copied by `npm run backend:sync`).
// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildTrack } from './sim/track.ts';
import { generateTrack } from './sim/trackgen.ts';
import { validateReplay } from './sim/replay.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type, apikey' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'content-type': 'application/json' } });
const season = () => { const d = new Date(); return `${d.getUTCFullYear()}-S${Math.floor(d.getUTCMonth() / 3) + 1}`; };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const url = Deno.env.get('SUPABASE_URL')!, service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const user = await createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }).auth.getUser();
  if (!user.data.user) return json({ ok: false, error: 'not signed in' }, 401);
  const { trackId, replay } = await req.json();
  if (!Number.isInteger(trackId) || trackId < 1 || trackId > 275) return json({ ok: false, error: 'bad track' }, 400);
  if (replay?.vehicle !== 'standard') return json({ ok: false, error: 'only standardised-physics runs are ranked' }, 400);
  // Tracks are regenerated from their permanent seed (the same function the build tool used) and never taken from the client.
  const track = buildTrack(generateTrack(trackId, 0));
  const v = validateReplay(track, replay);
  if (!v.ok) return json({ ok: false, error: v.reason });
  const admin = createClient(url, service);
  await admin.from('records').insert({ user_id: user.data.user.id, track_id: trackId, ms: v.ms, vehicle: 'standard', season: season(), replay, valid: true });
  return json({ ok: true, ms: v.ms });
});
