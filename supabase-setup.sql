-- Ripostiglio: preparazione dell'archivio su Supabase.
-- Incolla tutto in Supabase → SQL Editor → New query, poi premi "Run". Si esegue una volta sola.

-- 1) Oggetti
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null,
  cat         text,
  type        text,
  loc         text,
  use_when    text[] not null default '{}',
  bought      date,
  notes       text,
  photos      text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists items_user_idx on public.items(user_id);

alter table public.items enable row level security;
drop policy if exists "items: solo i propri" on public.items;
create policy "items: solo i propri" on public.items
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2) Elenchi personali (categorie, tipi, "quando lo usi")
create table if not exists public.settings (
  user_id     uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
alter table public.settings enable row level security;
drop policy if exists "settings: solo i propri" on public.settings;
create policy "settings: solo i propri" on public.settings
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3) Aggiornamento in tempo reale tra telefono e PC
do $$ begin
  alter publication supabase_realtime add table public.items;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.settings;
exception when duplicate_object then null; end $$;

-- 4) Foto: contenitore privato, ognuno vede solo la propria cartella
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "foto: leggere le proprie" on storage.objects;
drop policy if exists "foto: caricare le proprie" on storage.objects;
drop policy if exists "foto: modificare le proprie" on storage.objects;
drop policy if exists "foto: eliminare le proprie" on storage.objects;

create policy "foto: leggere le proprie" on storage.objects
  for select to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "foto: caricare le proprie" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "foto: modificare le proprie" on storage.objects
  for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "foto: eliminare le proprie" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- 5) Funzione minima usata dal "tieni sveglio" automatico (vedi LEGGIMI): non legge nessun dato.
create or replace function public.ping() returns text language sql stable as $$ select 'ok'::text $$;
grant execute on function public.ping() to anon, authenticated;
