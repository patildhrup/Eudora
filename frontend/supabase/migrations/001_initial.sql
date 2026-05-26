-- Eudora AI Spend Audit schema
create extension if not exists "pgcrypto";

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  input_snapshot jsonb not null,
  result jsonb not null,
  ai_summary text,
  created_at timestamptz not null default now()
);

create index if not exists audits_slug_idx on public.audits (slug);
create index if not exists audits_created_at_idx on public.audits (created_at desc);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company text not null,
  role text not null,
  team_size integer not null,
  audit_slug text references public.audits (slug) on delete set null,
  monthly_savings numeric,
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.audits enable row level security;
alter table public.leads enable row level security;

-- Public read for share pages (anon)
create policy "Public read audits by slug"
  on public.audits for select
  using (true);

-- Inserts via service role only (API routes)
create policy "Service insert audits"
  on public.audits for insert
  with check (true);

create policy "Service insert leads"
  on public.leads for insert
  with check (true);
