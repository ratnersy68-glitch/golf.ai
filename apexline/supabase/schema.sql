-- APEXLINE online schema (Supabase / Postgres). Run in the SQL editor. See docs/BACKEND.md.
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text not null unique check (char_length(username) between 3 and 16),
  region text default 'XX',
  created_at timestamptz default now()
);
create table if not exists public.records (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_id int not null check (track_id between 1 and 275),
  ms int not null check (ms > 0),
  vehicle text not null default 'standard',
  season text not null,
  replay jsonb not null,           -- the input stream; the server re-simulates it
  valid boolean not null default false,
  created_at timestamptz default now()
);
create index if not exists records_board on public.records (track_id, valid, ms);
create table if not exists public.saves (user_id uuid primary key references auth.users on delete cascade, data jsonb not null, updated_at timestamptz default now());
create table if not exists public.friends (user_id uuid references public.profiles(id) on delete cascade, friend_id uuid references public.profiles(id) on delete cascade, primary key (user_id, friend_id));
create table if not exists public.community_tracks (
  id uuid primary key default gen_random_uuid(), author uuid references public.profiles(id) on delete cascade, name text not null, env text not null, pieces jsonb not null,
  plays int default 0, rating numeric default 0, created_at timestamptz default now(), validated boolean default false
);
create table if not exists public.rooms (code text primary key, host uuid references public.profiles(id), track_id int, state jsonb, created_at timestamptz default now());

alter table public.profiles enable row level security; alter table public.records enable row level security; alter table public.saves enable row level security;
alter table public.friends enable row level security; alter table public.community_tracks enable row level security; alter table public.rooms enable row level security;
create policy "profiles readable" on public.profiles for select using (true);
create policy "own profile write" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
-- records are INSERTED ONLY by the validate-run edge function (service role); clients can read valid ones.
create policy "valid records readable" on public.records for select using (valid);
create policy "own saves" on public.saves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own friends" on public.friends for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "community readable" on public.community_tracks for select using (validated);
create policy "own community write" on public.community_tracks for insert with check (auth.uid() = author);
create policy "rooms readable" on public.rooms for select using (true);
create policy "host manages room" on public.rooms for all using (auth.uid() = host) with check (auth.uid() = host);
