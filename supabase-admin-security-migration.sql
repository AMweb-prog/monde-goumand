begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('admin@mondegourmand.ma')
on conflict (user_id) do nothing;

drop policy if exists "Authenticated admins can manage products" on public.products;
create policy "Authenticated admins can manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated admins can manage product categories" on public.product_categories;
create policy "Authenticated admins can manage product categories"
on public.product_categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated admins can manage orders" on public.orders;
create policy "Authenticated admins can manage orders"
on public.orders for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated admins can manage event reservations" on public.event_reservations;
create policy "Authenticated admins can manage event reservations"
on public.event_reservations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated admins can upload product images" on storage.objects;
create policy "Authenticated admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Authenticated admins can update product images" on storage.objects;
create policy "Authenticated admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Authenticated admins can delete product images" on storage.objects;
create policy "Authenticated admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

commit;
