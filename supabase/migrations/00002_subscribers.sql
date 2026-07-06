create table if not exists public.subscribers (
  id        bigint generated always as identity primary key,
  email     text unique not null,
  created_at timestamptz default now()
);

alter table public.subscribers enable row level security;

create policy "Anyone can insert subscribers"
  on public.subscribers for insert
  with check (true);

create index if not exists idx_subscribers_email on public.subscribers (email);
