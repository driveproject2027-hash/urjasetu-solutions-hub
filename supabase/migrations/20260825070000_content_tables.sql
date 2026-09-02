  -- Content tables that back the previously hardcoded frontend catalog data
-- (solutions, demo providers, demo stories, open needs, opportunities, schemes,
-- resource articles). All public read; only service role / admins write.

create table if not exists public.dre_solutions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  summary text not null,
  what text,
  solves text[] not null default '{}',
  who text[] not null default '{}',
  how text,
  benefits text[] not null default '{}',
  limits text[] not null default '{}',
  applications text[] not null default '{}',
  problems text[] not null default '{}',
  sort_order int not null default 0
);

create table if not exists public.demo_providers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city text not null,
  state text not null,
  is_verified boolean not null default false,
  rating numeric(2,1) not null default 0,
  projects int not null default 0,
  technologies text[] not null default '{}',
  industries text[] not null default '{}',
  service_areas text[] not null default '{}',
  about text
);

create table if not exists public.demo_stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  headline text not null,
  person text not null,
  role text not null,
  location text not null,
  business text not null,
  problem_id text not null,
  solution_slug text not null,
  problem text not null,
  needed text not null,
  mattered text not null,
  journey text not null,
  changed text,
  image text not null default 'textile'
);

create table if not exists public.business_opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  problem text not null,
  opportunity text not null,
  users text not null,
  tech text not null,
  sort_order int not null default 0
);

create table if not exists public.schemes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  what text not null
);

create table if not exists public.resource_articles (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null,
  category_name text not null,
  category_tagline text not null default '',
  category_intro text not null default '',
  slug text not null,
  title text not null,
  summary text not null,
  tags text[] not null default '{}',
  body jsonb not null default '[]'::jsonb,
  source_label text,
  source_url text,
  updated text,
  unique (category_slug, slug)
);

-- Public read for everyone; service role keeps full access.
alter table public.dre_solutions enable row level security;
alter table public.demo_providers enable row level security;
alter table public.demo_stories enable row level security;
alter table public.business_opportunities enable row level security;
alter table public.schemes enable row level security;
alter table public.resource_articles enable row level security;

create policy "public read" on public.dre_solutions for select to anon, authenticated using (true);
create policy "public read" on public.demo_providers for select to anon, authenticated using (true);
create policy "public read" on public.demo_stories for select to anon, authenticated using (true);
create policy "public read" on public.business_opportunities for select to anon, authenticated using (true);
create policy "public read" on public.schemes for select to anon, authenticated using (true);
create policy "public read" on public.resource_articles for select to anon, authenticated using (true);

grant select on public.dre_solutions, public.demo_providers, public.demo_stories,
  public.business_opportunities, public.schemes, public.resource_articles to anon, authenticated;
grant all on public.dre_solutions, public.demo_providers, public.demo_stories,
  public.business_opportunities, public.schemes, public.resource_articles to service_role;
