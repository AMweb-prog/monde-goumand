alter table public.orders
  add column if not exists scheduled_date date,
  add column if not exists scheduled_time time;
