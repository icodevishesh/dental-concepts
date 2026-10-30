-- Dental Concepts admin: Supabase schema
-- Run in the Supabase SQL editor. Each collection is one table holding a JSON document,
-- which matches data/store.js. Your developers can split this into typed columns later.

create extension if not exists pgcrypto;

do $$
declare t text;
begin
  foreach t in array array['posts','authors','leads','uploads','testimonials','events'] loop
    execute format('create table if not exists public.%I (
      id uuid primary key default gen_random_uuid(),
      data jsonb not null default ''{}''::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now())', t);
    execute format('alter table public.%I enable row level security', t);
    -- signed-in admins can do everything
    execute format('drop policy if exists admin_all on public.%I', t);
    execute format('create policy admin_all on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- visitors can read published content
drop policy if exists public_read on public.posts;
create policy public_read on public.posts for select to anon using (data->>'status' = 'published');
drop policy if exists public_read on public.events;
create policy public_read on public.events for select to anon using (data->>'status' = 'published');
drop policy if exists public_read on public.testimonials;
create policy public_read on public.testimonials for select to anon using (data->>'status' = 'published');
drop policy if exists public_read on public.authors;
create policy public_read on public.authors for select to anon using (true);

-- visitors can send leads and case uploads, but cannot read them back
drop policy if exists public_insert on public.leads;
create policy public_insert on public.leads for insert to anon with check (true);
drop policy if exists public_insert on public.uploads;
create policy public_insert on public.uploads for insert to anon with check (true);

-- storage: "media" is public (blog and event images), "case-files" is private (scans, RX forms)
insert into storage.buckets (id, name, public) values ('media','media', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('case-files','case-files', false) on conflict (id) do nothing;

drop policy if exists media_read on storage.objects;
create policy media_read on storage.objects for select using (bucket_id = 'media');
drop policy if exists media_admin on storage.objects;
create policy media_admin on storage.objects for all to authenticated using (bucket_id in ('media','case-files')) with check (bucket_id in ('media','case-files'));
drop policy if exists case_upload on storage.objects;
create policy case_upload on storage.objects for insert to anon with check (bucket_id = 'case-files');
