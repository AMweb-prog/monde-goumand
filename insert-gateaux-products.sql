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

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_collection_legacy_id_key'
  ) then
    alter table public.products
      add constraint products_collection_legacy_id_key unique (collection, legacy_id);
  end if;
end $$;

insert into public.product_categories
  (collection, name, sort_order, is_active)
values
  ('gateau', 'gateau', 1, true),
  ('gateau', 'patisserie', 2, true),
  ('gateau', 'boisson', 3, true)
on conflict (collection, name) do update set
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.products
  (legacy_id, collection, category, name, description, image_url, price, is_promo, is_new, is_active, sort_order)
values
  (1,  'gateau', 'gateau',     'NEW YEAR',                    'a partir de',        'images/gateau/bucherouge.webp',                 150, false, false, true, 1),
  (2,  'gateau', 'gateau',     'buche foret noir',            'a partir de',        'images/gateau/noel3.webp',                      150, true,  false, true, 2),
  (3,  'gateau', 'patisserie', 'trompe l''oeil citron',       'citron',             'images/pat/citron.webp',                         24, false, false, true, 3),
  (11, 'gateau', 'patisserie', 'trompe l''oeil pistache',     'pistache',           'images/pat/pistache.webp',                       26, true,  false, true, 11),
  (12, 'gateau', 'gateau',     'cake design',                 'a partir de',        'images/gateau/eidmobarak.webp',                 200, false, true,  true, 12),
  (13, 'gateau', 'gateau',     'cake design d''anniversaire', 'a partir de',        'images/gateau/happyb.webp',                     200, false, false, true, 13),
  (14, 'gateau', 'boisson',    'MOJITO FRUITS DE PASSION',    'FRUITS DE PASSION',  'images/boi/fruis.webp',                          28, false, false, true, 14),
  (15, 'gateau', 'boisson',    'MOJITO VIRGIN',               'VIRGIN',             'images/boi/mokhitofruispassion.webp',             25, true,  false, true, 15),
  (16, 'gateau', 'boisson',    'MOJITO FRUITS ROUGE',         'FRUITS ROUGE',       'images/boi/fruisrouge.webp',                      25, false, false, true, 16),
  (17, 'gateau', 'gateau',     'cake design fruit',           'a partir de',        'images/gateau/FRAMBOISE.webp',                  200, false, true,  true, 17),
  (18, 'gateau', 'patisserie', 'trompe l''oeil poire',        'poire',              'images/pat/poire.webp',                          22, false, false, true, 18),
  (19, 'gateau', 'patisserie', 'trompe l''oeil pomme',        'pomme',              'images/pat/pomme.webp',                          22, false, false, true, 19),
  (20, 'gateau', 'boisson',    'PINA COLADA',                 'PINA COLADA . ANANAS','images/cocktail/pina.webp',                      28, false, false, true, 20),
  (21, 'gateau', 'gateau',     'gateau glace',                'a partir de',        'images/gateau/newyear.webp',                    150, false, true,  true, 21),
  (23, 'gateau', 'boisson',    'SPRING BLUE MOJITO',          'SPRING BLUE',        'images/cocktail/SPRINGBLUEMOJITO.WEBP',          45, false, false, true, 23),
  (24, 'gateau', 'gateau',     'cake design',                 'a partir de',        'images/gateau/goodluck.webp',                   200, false, false, true, 24),
  (25, 'gateau', 'gateau',     'gateau amande',               'a partir de',        'images/gateau/mariage2.webp',                   200, false, false, true, 25),
  (26, 'gateau', 'gateau',     'buche new year',              'a partir de',        'images/gateau/buchedamour.webp',                200, false, false, true, 26),
  (27, 'gateau', 'gateau',     'CAKE DESIGN BIRTHDAY',        'a partir de',        'images/gateau/birthday.webp',                   200, false, false, true, 27),
  (28, 'gateau', 'gateau',     'cake design mariage',         'a partir de',        'images/gateau/mariage.webp',                    200, false, false, true, 28),
  (29, 'gateau', 'gateau',     'HAPPY BIRTHDAY LINA',         'a partir de',        'images/gateau/birthdaylina.webp',               200, false, false, true, 29),
  (30, 'gateau', 'gateau',     'buche NOEL',                  'a partir de',        'images/gateau/buchenoel.webp',                  200, false, false, true, 30),
  (31, 'gateau', 'gateau',     'FROZENE',                     'a partir de',        'images/gateau/frozene.webp',                    200, false, false, true, 31),
  (32, 'gateau', 'gateau',     'buche NOEL',                  'a partir de',        'images/gateau/noel2.webp',                      200, false, false, true, 32),
  (33, 'gateau', 'gateau',     'wedding cake',                'a partir de',        'images/gateau/mariage2.webp',                   200, false, false, true, 33),
  (34, 'gateau', 'gateau',     'cake design',                 'a partir de',        'images/gateau/redheart.webp',                   200, false, false, true, 34),
  (35, 'gateau', 'gateau',     'gateau glace',                'a partir de',        'images/gateau/love.webp',                       200, false, false, true, 35),
  (37, 'gateau', 'patisserie', 'trompe l''oeil pistache',     'pistache',           'images/pat/vert.webp',                           26, false, true,  true, 37),
  (38, 'gateau', 'patisserie', 'Amande',                      'Amande',             'images/pat/amande.webp',                         20, false, true,  true, 38),
  (39, 'gateau', 'patisserie', 'Cookie framboise',            'framboise',          'images/pat/cockie.webp',                         22, false, true,  true, 39),
  (40, 'gateau', 'patisserie', 'Cookie gateau',               'gateau',             'images/pat/cockieb.webp',                        22, false, true,  true, 40),
  (41, 'gateau', 'patisserie', 'Cookie chocolat',             'chocolat',           'images/pat/cockien.webp',                        22, false, true,  true, 41),
  (42, 'gateau', 'patisserie', 'trompe l''oeil framboise',    'Framboise',          'images/pat/fromboise.webp',                      22, false, true,  true, 42),
  (43, 'gateau', 'patisserie', 'tarte fruits',                'fruits',             'images/pat/fruis.webp',                          20, false, true,  true, 43),
  (44, 'gateau', 'patisserie', 'trompe l''oeil mango',        'mangue',             'images/pat/mangue.webp',                         22, false, true,  true, 44),
  (46, 'gateau', 'patisserie', 'gateau pistache',             'Pistache',           'images/pat/pistaches.webp',                      25, false, true,  true, 46),
  (48, 'gateau', 'patisserie', 'trompe l''oeil citrouille',   'citrouille',         'images/pat/tomatte.webp',                        18, false, true,  true, 48),
  (49, 'gateau', 'patisserie', 'trompe l''oeil cacahuete',    'cacahuete',          'images/pat/n.webp',                              22, false, true,  true, 49),
  (50, 'gateau', 'boisson',    'MILKSHAKE CARAMEL',           'CARAMEL',            'images/MILKSHAKE/MILKSHAKECARAMEL.webp',         28, false, false, true, 50),
  (51, 'gateau', 'boisson',    'MILKSHAKE KITKAT',            'KITKAT',             'images/MILKSHAKE/KITKAT.webp',                   30, false, false, true, 51),
  (52, 'gateau', 'boisson',    'MILKSHAKE CHOCOLAT',          'CHOCOLAT',           'images/MILKSHAKE/MILKSHAKECHOCOLAT.webp',        28, false, false, true, 52),
  (53, 'gateau', 'boisson',    'MILKSHAKE FRAISE',            'FRAISE',             'images/MILKSHAKE/MILKSHAKEFRAISE.webp',          28, false, false, true, 53),
  (54, 'gateau', 'boisson',    'MILKSHAKE OREO',              'OREO',               'images/MILKSHAKE/MILKSHAKEOERO.webp',            30, false, false, true, 54),
  (55, 'gateau', 'boisson',    'MILKSHAKE VANILLE',           'VANILLE',            'images/MILKSHAKE/milkshakevanille.webp',         28, false, false, true, 55)
on conflict (collection, legacy_id) do update set
  category = excluded.category,
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  price = excluded.price,
  is_promo = excluded.is_promo,
  is_new = excluded.is_new,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
