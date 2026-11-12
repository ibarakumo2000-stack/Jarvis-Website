-- JARVIS commerce schema for Supabase Postgres.
-- Run in the Supabase SQL editor. Keep service-role credentials server-side only.

create table if not exists public.jarvis_purchases (
  reference text primary key,
  email text not null,
  plan text not null check (plan in ('lifetime', 'monthly', 'yearly')),
  product_version text not null,
  status text not null default 'pending'
    check (status in ('pending', 'success', 'failed', 'review')),
  amount bigint not null default 0,
  currency text not null default 'NGN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jarvis_purchases_email_idx
  on public.jarvis_purchases (lower(email));

create table if not exists public.jarvis_entitlements (
  email text primary key,
  plan text not null check (plan in ('lifetime', 'monthly', 'yearly')),
  product_version text not null,
  status text not null check (status in ('active', 'inactive', 'past_due')),
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.jarvis_purchases enable row level security;
alter table public.jarvis_entitlements enable row level security;

-- No public or anon policies are created. The website uses the Supabase
-- service-role key exclusively in server-side route handlers.
