-- Run in Supabase SQL editor. Then: create a user (Auth > Users) and
-- insert into admins(user_id) values ('<that user uuid>');
create table if not exists admins(user_id uuid primary key references auth.users on delete cascade);
create or replace function is_admin() returns boolean language sql security definer stable as
$$ select exists(select 1 from admins where user_id = auth.uid()) $$;

create table if not exists profiles(id int primary key default 1 check(id=1),
 full_name text, headline text, intro text, about text[], languages text[] default '{}', location text, tagline text,
 photo_url text, resume_url text, cv_url text, published boolean default true, updated_at timestamptz default now());
create table if not exists projects(id uuid primary key default gen_random_uuid(),
 slug text unique not null, title text not null, category text, summary text, status text,
 featured boolean default false, tags text[] default '{}', tools text[] default '{}',
 metrics jsonb default '[]', sections jsonb default '[]', cover_url text, gallery text[] default '{}',
 sort int default 0, published boolean default false);
create table if not exists skills(id uuid primary key default gen_random_uuid(), category text not null, name text not null, learned_from text[] default '{}', sort int default 0, published boolean default false);
create table if not exists education(id uuid primary key default gen_random_uuid(), institution text, degree text not null, period text, note text, sort int default 0, published boolean default false);
create table if not exists certifications(id uuid primary key default gen_random_uuid(), title text not null, issuer text, year text, note text, sort int default 0, published boolean default false);
create table if not exists achievements(id uuid primary key default gen_random_uuid(), title text not null, description text, year text, sort int default 0, published boolean default false);
create table if not exists experience(id uuid primary key default gen_random_uuid(), title text not null, org text, date_label text, description text, sort int default 0, published boolean default false);
create table if not exists social_links(id uuid primary key default gen_random_uuid(), label text not null, url text not null, sort int default 0, published boolean default false);
create table if not exists sync_logs(id uuid primary key default gen_random_uuid(), source text, status text check(status in('success','failed','partial')), imported text[] default '{}', failed text[] default '{}', message text, created_at timestamptz default now());
create table if not exists sync_drafts(id uuid primary key default gen_random_uuid(), source text, raw_text text, fields jsonb default '{}', status text default 'pending' check(status in('pending','published','discarded')), created_at timestamptz default now());
create table if not exists messages(id uuid primary key default gen_random_uuid(), name text not null check(char_length(name) between 1 and 120), email text not null check(char_length(email) between 3 and 200), body text not null check(char_length(body) between 1 and 4000), created_at timestamptz default now());

do $$ declare t text; begin
 foreach t in array array['profiles','projects','skills','education','certifications','achievements','experience','social_links'] loop
  execute format('alter table %I enable row level security', t);
  execute format('drop policy if exists "public read" on %I', t);
  execute format('create policy "public read" on %I for select using (published or is_admin())', t);
  execute format('drop policy if exists "admin write" on %I', t);
  execute format('create policy "admin write" on %I for all using (is_admin()) with check (is_admin())', t);
 end loop;
 foreach t in array array['sync_logs','sync_drafts'] loop
  execute format('alter table %I enable row level security', t);
  execute format('drop policy if exists "admin all" on %I', t);
  execute format('create policy "admin all" on %I for all using (is_admin()) with check (is_admin())', t);
 end loop;
end $$;
alter table messages enable row level security;
drop policy if exists "anyone can send" on messages;
create policy "anyone can send" on messages for insert with check (true);
drop policy if exists "admin reads" on messages;
create policy "admin reads" on messages for select using (is_admin());
drop policy if exists "admin deletes" on messages;
create policy "admin deletes" on messages for delete using (is_admin());

insert into storage.buckets(id,name,public) values('portfolio','portfolio',true) on conflict do nothing;
drop policy if exists "public read files" on storage.objects;
create policy "public read files" on storage.objects for select using (bucket_id='portfolio');
drop policy if exists "admin write files" on storage.objects;
create policy "admin write files" on storage.objects for all using (bucket_id='portfolio' and is_admin()) with check (bucket_id='portfolio' and is_admin());
