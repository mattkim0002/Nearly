-- ============================================
-- Makevo: Initial Schema Migration
-- Tables: categories, profiles, services
-- ============================================

-- ==================
-- categories
-- ==================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Public read access" on public.categories
  for select using (true);

-- ==================
-- profiles
-- ==================
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  is_pro boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public read access" on public.profiles
  for select using (true);

-- ==================
-- services
-- ==================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category_id uuid not null references public.categories(id) on delete restrict,
  price_starting numeric,
  price_type text check (price_type in ('starting_from', 'quote')),
  location text not null,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  image_url text,
  images text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Public read access" on public.services
  for select using (true);

-- ==================
-- Indexes
-- ==================
create index idx_services_category_id on public.services(category_id);
create index idx_services_provider_id on public.services(provider_id);
create index idx_services_location on public.services(location);
create index idx_categories_slug on public.categories(slug);
