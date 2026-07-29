create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer,
  collection text not null default 'gateau' check (collection in ('gateau', 'menu')),
  category text not null default 'gateau',
  name text not null,
  description text default '',
  image_url text default '',
  price numeric(10,2) not null default 0,
  is_promo boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (collection in ('gateau', 'menu')),
  name text not null,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_categories_collection_name_key unique (collection, name)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_type text not null check (order_type in ('sur_place', 'a_emporter', 'livraison')),
  customer_first_name text not null,
  customer_last_name text not null,
  phone text not null,
  address text default '',
  scheduled_date date,
  scheduled_time time,
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  status text not null default 'nouvelle' check (status in ('nouvelle', 'en_preparation', 'prete', 'terminee', 'annulee')),
  source text not null default 'site',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  event_date date not null,
  event_time time not null,
  event_type text not null,
  guests integer not null,
  table_note text default '',
  status text not null default 'nouvelle' check (status in ('nouvelle', 'confirmee', 'terminee', 'annulee')),
  source text not null default 'site',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists product_categories_set_updated_at on public.product_categories;
create trigger product_categories_set_updated_at before update on public.product_categories
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists reservations_set_updated_at on public.event_reservations;
create trigger reservations_set_updated_at before update on public.event_reservations
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.orders enable row level security;
alter table public.event_reservations enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
using (is_active = true);

drop policy if exists "Authenticated admins can manage products" on public.products;
create policy "Authenticated admins can manage products"
on public.products for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active product categories" on public.product_categories;
create policy "Public can read active product categories"
on public.product_categories for select
using (is_active = true);

drop policy if exists "Authenticated admins can manage product categories" on public.product_categories;
create policy "Authenticated admins can manage product categories"
on public.product_categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders for insert
to anon
with check (true);

drop policy if exists "Authenticated admins can manage orders" on public.orders;
create policy "Authenticated admins can manage orders"
on public.orders for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create event reservations" on public.event_reservations;
create policy "Public can create event reservations"
on public.event_reservations for insert
to anon
with check (true);

drop policy if exists "Authenticated admins can manage event reservations" on public.event_reservations;
create policy "Authenticated admins can manage event reservations"
on public.event_reservations for all
to authenticated
using (true)
with check (true);

create index if not exists products_collection_category_idx on public.products(collection, category, sort_order);
create index if not exists product_categories_collection_sort_idx on public.product_categories(collection, sort_order, name);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_type_status_idx on public.orders(order_type, status);
create index if not exists reservations_created_at_idx on public.event_reservations(created_at desc);
