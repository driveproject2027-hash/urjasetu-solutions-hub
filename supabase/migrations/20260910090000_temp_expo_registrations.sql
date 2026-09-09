-- ============================================================
-- TEMPORARY • DRE EXPO module (event-specific, safe to remove)
-- Single table holding both registration kinds. All form fields
-- live in `payload` jsonb so the module can be dropped wholesale
-- after the expo without touching any core table.
-- ============================================================

create table if not exists public.expo_registrations (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('entrepreneur', 'vendor')),
  payload jsonb not null default '{}'::jsonb,
  -- Denormalised for stall-power planning and quick admin filtering:
  requires_electricity boolean not null default false,
  power_requirement text,
  status text not null default 'new',
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists expo_registrations_kind_idx
  on public.expo_registrations (kind, created_at desc);
create index if not exists expo_registrations_electricity_idx
  on public.expo_registrations (requires_electricity) where requires_electricity;

alter table public.expo_registrations enable row level security;

-- Grants: writes happen ONLY through the server (service role), never from the browser.
revoke all on public.expo_registrations from anon, authenticated;
grant select on public.expo_registrations to authenticated;
grant all on public.expo_registrations to service_role;

-- Reads are restricted to administrators whose post includes the expo section.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'expo_registrations'
      and policyname = 'scoped admin read expo registrations'
  ) then
    create policy "scoped admin read expo registrations"
      on public.expo_registrations for select to authenticated
      using (public.has_admin_section(auth.uid(), 'expo'));
  end if;
end
$$;

-- TEMPORARY: drop everything again after the expo with:
--   drop table if exists public.expo_registrations;
