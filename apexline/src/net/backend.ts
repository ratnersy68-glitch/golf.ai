import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ReplayMeta } from '../sim/replay';

/**
 * Optional online layer (Supabase). If VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set at build time
 * every function here reports "not configured" and the game stays fully playable offline. Nothing is faked.
 * Setup: see docs/BACKEND.md and supabase/schema.sql.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
let client: SupabaseClient | null = null;
export const backendConfigured = !!(url && key);
export function sb(): SupabaseClient | null { if (!backendConfigured) return null; client ??= createClient(url!, key!); return client; }

export interface BoardRow { rank: number; username: string; ms: number; vehicle: string; date: string; hasReplay: boolean; userId?: string }
export type BoardScope = 'global' | 'friends' | 'regional' | 'seasonal' | 'daily';

export async function fetchBoard(trackId: number, scope: BoardScope, season?: string): Promise<{ rows: BoardRow[]; error?: string }> {
  const c = sb(); if (!c) return { rows: [], error: 'not-configured' };
  try {
    let q = c.from('records').select('user_id, ms, vehicle, created_at, profiles(username)').eq('track_id', trackId).eq('valid', true).order('ms', { ascending: true }).limit(100);
    if (scope === 'seasonal' && season) q = q.eq('season', season);
    if (scope === 'daily') q = q.gte('created_at', new Date(Date.now() - 86400000).toISOString());
    const { data, error } = await q; if (error) return { rows: [], error: error.message };
    return { rows: (data ?? []).map((r: any, i: number) => ({ rank: i + 1, username: r.profiles?.username ?? 'Driver', ms: r.ms, vehicle: r.vehicle, date: r.created_at, hasReplay: true, userId: r.user_id })) };
  } catch (e: any) { return { rows: [], error: String(e?.message ?? e) }; }
}

/** Submits the replay (inputs), never just a time. The edge function re-simulates it with the shared deterministic physics. */
export async function submitRun(trackId: number, replay: ReplayMeta): Promise<{ ok: boolean; error?: string; ms?: number }> {
  const c = sb(); if (!c) return { ok: false, error: 'not-configured' };
  const { data, error } = await c.functions.invoke('validate-run', { body: { trackId, replay } });
  if (error) return { ok: false, error: error.message };
  return data as any;
}

export async function signIn(email: string): Promise<{ ok: boolean; error?: string }> {
  const c = sb(); if (!c) return { ok: false, error: 'not-configured' };
  const { error } = await c.auth.signInWithOtp({ email }); return error ? { ok: false, error: error.message } : { ok: true };
}
export async function currentUser() { const c = sb(); if (!c) return null; const { data } = await c.auth.getUser(); return data.user; }
export async function signOut() { await sb()?.auth.signOut(); }

export async function cloudPush(save: unknown): Promise<{ ok: boolean; error?: string }> {
  const c = sb(); if (!c) return { ok: false, error: 'not-configured' };
  const { data: u } = await c.auth.getUser(); if (!u.user) return { ok: false, error: 'not-signed-in' };
  const { error } = await c.from('saves').upsert({ user_id: u.user.id, data: save, updated_at: new Date().toISOString() }); return error ? { ok: false, error: error.message } : { ok: true };
}
export async function cloudPull(): Promise<{ ok: boolean; data?: any; error?: string }> {
  const c = sb(); if (!c) return { ok: false, error: 'not-configured' };
  const { data: u } = await c.auth.getUser(); if (!u.user) return { ok: false, error: 'not-signed-in' };
  const { data, error } = await c.from('saves').select('data').eq('user_id', u.user.id).maybeSingle(); return error ? { ok: false, error: error.message } : { ok: true, data: data?.data };
}
