-- ============================================================
-- OMNES PODCAST — Esquema completo de base de datos
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- 1. USERS (auth.users sync)
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text not null default '',
  avatar      text not null default '',
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);
alter table public.users enable row level security;

-- 2. PODCASTS
create table if not exists public.podcasts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text not null default '',
  cover_image   text not null default '',
  trailer_url   text,
  color_primary   text not null default '#00d4ff',
  color_secondary text not null default '#0066ff',
  color_accent    text not null default '#7f00ff',
  vibe          text not null default '',
  category      text not null default '',
  created_at    timestamptz not null default now()
);
alter table public.podcasts enable row level security;

-- 3. HOSTS
create table if not exists public.hosts (
  id           uuid primary key default gen_random_uuid(),
  podcast_id   uuid not null references public.podcasts(id) on delete cascade,
  name         text not null,
  bio          text not null default '',
  photo        text not null default '',
  social_links jsonb not null default '{}'::jsonb
);
alter table public.hosts enable row level security;

-- 4. SEASONS
create table if not exists public.seasons (
  id          uuid primary key default gen_random_uuid(),
  podcast_id  uuid not null references public.podcasts(id) on delete cascade,
  number      integer not null,
  title       text not null,
  description text not null default ''
);
alter table public.seasons enable row level security;

-- 5. EPISODES
create table if not exists public.episodes (
  id            uuid primary key default gen_random_uuid(),
  season_id     uuid not null references public.seasons(id) on delete cascade,
  podcast_id    uuid not null references public.podcasts(id) on delete cascade,
  title         text not null,
  description   text not null default '',
  audio_url     text not null default '',
  video_url     text,
  duration      integer not null default 0,
  thumbnail     text not null default '',
  tags          text[] not null default '{}',
  category      text not null default '',
  published_at  timestamptz not null default now(),
  views         bigint not null default 0,
  likes         bigint not null default 0
);
alter table public.episodes enable row level security;

-- 6. GUESTS
create table if not exists public.guests (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  bio          text not null default '',
  photo        text not null default '',
  social_links jsonb not null default '{}'::jsonb
);
alter table public.guests enable row level security;

-- 7. EPISODE GUESTS (join table)
create table if not exists public.episode_guests (
  episode_id uuid not null references public.episodes(id) on delete cascade,
  guest_id   uuid not null references public.guests(id) on delete cascade,
  primary key (episode_id, guest_id)
);
alter table public.episode_guests enable row level security;

-- 8. CLIPS
create table if not exists public.clips (
  id          uuid primary key default gen_random_uuid(),
  episode_id  uuid not null references public.episodes(id) on delete cascade,
  title       text not null,
  video_url   text not null default '',
  duration    integer not null default 0,
  thumbnail   text not null default '',
  views       bigint not null default 0
);
alter table public.clips enable row level security;

-- 9. COMMENTS
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  episode_id  uuid not null references public.episodes(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  content     text not null,
  likes       bigint not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.comments enable row level security;

-- 10. CATEGORIES
create table if not exists public.categories (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);
alter table public.categories enable row level security;

-- 11. EPISODE TRANSCRIPTS (for AI search)
create table if not exists public.episode_transcripts (
  id         uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.episodes(id) on delete cascade unique,
  content    text not null,
  updated_at timestamptz not null default now()
);
alter table public.episode_transcripts enable row level security;

-- ============================================================
-- RLS POLICIES (public read, authenticated write)
-- ============================================================

create policy "Public read" on public.podcasts for select using (true);
create policy "Admin all" on public.podcasts for all using (auth.jwt()->>'role' = 'admin');

create policy "Public read" on public.episodes for select using (true);
create policy "Admin all" on public.episodes for all using (auth.jwt()->>'role' = 'admin');

create policy "Public read" on public.hosts for select using (true);
create policy "Admin all" on public.hosts for all using (auth.jwt()->>'role' = 'admin');

create policy "Public read" on public.guests for select using (true);
create policy "Admin all" on public.guests for all using (auth.jwt()->>'role' = 'admin');

create policy "Public read" on public.seasons for select using (true);
create policy "Admin all" on public.seasons for all using (auth.jwt()->>'role' = 'admin');

create policy "Public read" on public.clips for select using (true);
create policy "Admin all" on public.clips for all using (auth.jwt()->>'role' = 'admin');

create policy "Public read" on public.comments for select using (true);
create policy "Authenticated insert" on public.comments for insert with check (auth.role() = 'authenticated');
create policy "Own delete" on public.comments for delete using (auth.uid() = user_id);

create policy "Public read" on public.categories for select using (true);

create policy "Public read" on public.episode_transcripts for select using (true);
create policy "Admin all" on public.episode_transcripts for all using (auth.jwt()->>'role' = 'admin');

create policy "Public read" on public.episode_guests for select using (true);
create policy "Admin all" on public.episode_guests for all using (auth.jwt()->>'role' = 'admin');

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_episodes_podcast_id on public.episodes(podcast_id);
create index idx_episodes_published_at on public.episodes(published_at desc);
create index idx_episodes_tags on public.episodes using gin(tags);
create index idx_clips_episode_id on public.clips(episode_id);
create index idx_comments_episode_id on public.comments(episode_id);
create index idx_seasons_podcast_id on public.seasons(podcast_id);
create index idx_hosts_podcast_id on public.hosts(podcast_id);
