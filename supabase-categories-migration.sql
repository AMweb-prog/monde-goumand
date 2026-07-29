create extension if not exists pgcrypto;

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists product_categories_set_updated_at on public.product_categories;
create trigger product_categories_set_updated_at before update on public.product_categories
for each row execute function public.set_updated_at();

alter table public.product_categories enable row level security;

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

create index if not exists product_categories_collection_sort_idx
on public.product_categories(collection, sort_order, name);
