create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 600),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

-- El navegador nunca accede directamente a esta tabla.
-- La API de Express utiliza una clave secreta guardada solo en el servidor.
revoke all on table public.tasks from anon, authenticated;
grant all on table public.tasks to service_role;

create index if not exists tasks_completed_created_at_idx
  on public.tasks (completed, created_at desc);
