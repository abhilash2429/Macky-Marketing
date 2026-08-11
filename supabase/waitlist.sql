-- Run this once in the Supabase SQL editor.
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'macky-marketing-waitlist',
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email)
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- Server uses the service role key, so RLS can stay on with no public policies.
alter table public.waitlist enable row level security;
