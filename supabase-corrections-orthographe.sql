-- ═══════════════════════════════════════════════════════════════════════
-- Monde Gourmand — corrections d'orthographe et de majuscules (octobre 2026)
-- À exécuter UNE fois dans Supabase > SQL Editor > New query > Run.
--
-- Ce script modifie UNIQUEMENT les noms, descriptions et noms de catégories.
-- Les prix, photos, promos, nouveautés, statuts actifs et l'ordre d'affichage
-- ne sont PAS touchés.
--
-- Chaque produit n'est modifié que s'il a encore exactement le nom, la
-- description et la photo relevés le 24/10/2026 : si vous l'avez modifié
-- depuis dans l'admin, votre version est conservée.
-- Tout est dans une transaction : en cas d'erreur, rien n'est appliqué.
-- ═══════════════════════════════════════════════════════════════════════

begin;

-- 1) Produits : nom + description + catégorie

update public.products set name = 'New Year', description = 'À partir de'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'NEW YEAR' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'a partir de' and image_url = 'images/gateau/bucherouge.webp';
update public.products set name = 'Birthday', description = 'Gâteau d''anniversaire'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'BIRTHDAY' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'BIRTHDAY' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/birthday-1791474752022.jpg';
update public.products set name = 'Trompe-l''œil framboise', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''oeil framboise' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Framboise' and image_url = 'images/pat/fromboise.webp';
update public.products set name = 'Trompe-l''œil mangue', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''oeil mango' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Mangue' and image_url = 'images/pat/mangue.webp';
update public.products set name = 'Bûche forêt-noire', description = 'À partir de'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Bûche foret noir' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A partir de' and image_url = 'images/gateau/noel3.webp';
update public.products set name = 'Trompe-l''œil cacahuète', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''œil Cacahuète' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Cacahuète' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/trompe-l-il-cacahuete-1792770631279.jpg';
update public.products set name = 'Trompe-l''œil citron', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''oeil Citron' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Citron' and image_url = 'images/pat/citron.webp';
update public.products set name = 'Trompe-l''œil pistache', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''oeil Pistache' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Pistache' and image_url = 'images/pat/vert.webp';
update public.products set name = 'Trompe-l''œil datte', description = 'Datte, chocolat et vanille', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''oeil Datte' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Chocolat & Vanille Datte' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/trompe-l-oeil-datte-1792756215182.jpg';
update public.products set description = 'Pistache et framboise', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Pistachio' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Pistache & Framboise' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/pistachio-1792757079102.jpg';
update public.products set name = 'Red velvet', description = 'Red velvet', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'REDVELVET' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'REDVELVET' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/redvelvet-1791474200250.jpg';
update public.products set name = 'Cheesecake', description = 'Citron, framboise ou pistache', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Cheese-Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Citron; framboise; Pistache' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/cheese-cake-1791332254515.jpg';
update public.products set name = 'Blanche-Neige Cake', description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Blanche Neige Cake Design' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes) A partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/img-7023-1791558157444.jpg';
update public.products set name = 'Jad Is Here', description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JAD IS HERE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A partir de (10-12 personnes)' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/jad-is-here-1791974962708.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Aqua Mermaid Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) à partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/img-3860-1-1792073890462.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Sweet Kitty Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) a partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/sweet-kitty-cake-1792073297649.png';
update public.products set name = 'Frozen Cake', description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'FROZENE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes) a partir de' and image_url = 'images/gateau/frozene.webp';
update public.products set name = 'Happy Birthday Lina', description = 'Pour 20 à 25 personnes', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'HAPPY BIRTHDAY LINA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(20-25 personnes)' and image_url = 'images/gateau/birthdaylina.webp';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Douceur de rose' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes) a partir de' and image_url = 'images/gateau/happyb.webp';
update public.products set name = 'Mojito fruit de la passion', description = 'Fruit de la passion'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MOJITO FRUITS DE PASSION' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'FRUITS DE PASSION' and image_url = 'images/boi/fruis.webp';
update public.products set name = 'Mojito virgin'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MOJITO VIRGIN' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Menthe' and image_url = 'images/boi/mokhitofruispassion.webp';
update public.products set name = 'Mojito fruits rouges', description = 'Fruits rouges'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MOJITO FRUITS ROUGE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'FRUITS ROUGE' and image_url = 'images/boi/fruisrouge.webp';
update public.products set name = 'Cake design fruits', description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'cake design fruit' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes) a partir de' and image_url = 'images/gateau/FRAMBOISE.webp';
update public.products set name = 'Trompe-l''œil poire', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''oeil Poire' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Poire' and image_url = 'images/pat/poire.webp';
update public.products set name = 'Trompe-l''œil pomme', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''oeil Pomme' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Pomme' and image_url = 'images/pat/pomme.webp';
update public.products set name = 'Piña colada', description = 'Coco et ananas'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PINA COLADA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Coco et Ananas' and image_url = 'images/cocktail/pina.webp';
update public.products set description = 'Chocolat noir', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Brownies' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Chocolat Noir' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/brownies-1791543714688.jpg';
update public.products set name = 'Happy Birthday'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'HAPPY BIRTHDAY' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/happy-birthday-1791544692099.jpg';
update public.products set name = 'Gâteau New Year', description = 'À partir de'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Gâteau New YEAR' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A partir de' and image_url = 'images/gateau/newyear.webp';
update public.products set name = 'Spring Blue Mojito', description = 'À base de Red Bull'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'SPRING BLUE MOJITO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A base de redbull' and image_url = 'images/cocktail/SPRINGBLUEMOJITO.WEBP';
update public.products set description = 'Pour 20 à 25 personnes', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Cake design' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(20-25 personnes)' and image_url = 'images/gateau/goodluck.webp';
update public.products set name = 'Number Cake'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Cake Number' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/cake-number-1791890800668.jpg';
update public.products set name = 'Gâteau amande', description = 'À partir de'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Gâteau Amande' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A partir de' and image_url = 'images/gateau/mariage2.webp';
update public.products set name = 'Bûche New Year', description = 'À partir de'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Bûche new year' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A partir de' and image_url = 'images/gateau/buchedamour.webp';
update public.products set name = 'Cake design Birthday', description = 'Pour 20 à 25 personnes', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CAKE DESIGN BIRTHDAY' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(20-25 personnes)' and image_url = 'images/gateau/birthday.webp';
update public.products set name = 'Cake design mariage', description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'cake design mariage' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes) a partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/cake-design-mariage-1791545764777.png';
update public.products set name = 'Bûche de Noël', description = 'À partir de'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Bûche NOEL' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A partir de' and image_url = 'images/gateau/buchenoel.webp';
update public.products set name = 'Cake design', description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'cake design' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12) a partir de' and image_url = 'images/gateau/eidmobarak.webp';
update public.products set name = 'Bûche de Noël', description = 'À partir de'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Bûche NOEL' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'a partir de' and image_url = 'images/gateau/noel2.webp';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Cake design' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes) a partir de' and image_url = 'images/gateau/redheart.webp';
update public.products set description = 'À partir de'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Gâteau glacé' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A partir de' and image_url = 'images/gateau/love.webp';
update public.products set category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Amande' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Amande' and image_url = 'images/pat/amande.webp';
update public.products set name = 'Cookie framboise', description = 'Framboise', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Cookies framboise' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'framboise' and image_url = 'images/pat/cockie.webp';
update public.products set name = 'Cookie Lotus', description = 'Lotus', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Cookies lotus' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'lotus' and image_url = 'images/pat/cockieb.webp';
update public.products set name = 'Cookie chocolat', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Cookies chocolat' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Chocolat' and image_url = 'images/pat/cockien.webp';
update public.products set category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Tarte aux fruits' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Fruits' and image_url = 'images/pat/fruis.webp';
update public.products set name = 'Milkshake caramel', description = 'Caramel'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE CARAMEL' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CARAMEL' and image_url = 'images/MILKSHAKE/MILKSHAKECARAMEL.webp';
update public.products set name = 'Milkshake KitKat', description = 'KitKat'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE KITKAT' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'KITKAT' and image_url = 'images/MILKSHAKE/KITKAT.webp';
update public.products set name = 'Milkshake chocolat', description = 'Chocolat'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE CHOCOLAT' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CHOCOLAT' and image_url = 'images/MILKSHAKE/MILKSHAKECHOCOLAT.webp';
update public.products set name = 'Milkshake fraise', description = 'Fraise'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE FRAISE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'FRAISE' and image_url = 'images/MILKSHAKE/MILKSHAKEFRAISE.webp';
update public.products set name = 'Milkshake Oreo', description = 'Oreo'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE OREO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'OREO' and image_url = 'images/MILKSHAKE/MILKSHAKEOERO.webp';
update public.products set name = 'Milkshake vanille', description = 'Vanille'
  where collection = 'gateau' and category = 'Boissons' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE VANILLE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'VANILLE' and image_url = 'images/MILKSHAKE/milkshakevanille.webp';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Sweet Minnie Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) à partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/sweet-minnie-cake-1792073752389.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Celebration Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) à partir' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/img-3852-1792065974483.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Congrats Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '10-12personnes) à partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/congrats-cake-1792074536836.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Omra Mubarak Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes) a partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/img-3862-2-1792077511647.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Royal Romance' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes) a partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/c-1791544846825.jpg';
update public.products set name = 'Happy New Year'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'HAPPY NEW YEAR' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/happy-new-year-1791891085514.jpg';
update public.products set name = 'Fraisier royal'
  where collection = 'gateau' and category = 'Gâteaux' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Fraisier Royal' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/hello-chanel-1792075878791.png';
update public.products set description = 'Pour 20 à 25 personnes', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Enchanted Sea Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(20-25personnes)' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/img-3872-1792074779190.png';
update public.products set description = 'Pour 20 à 25 personnes', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Unicorn Fantasy' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(20-25personnes)' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/unicorn-fantasy-1792065711359.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Graduation Celebration Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) à partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/graduation-celebration-cake-1792074336925.png';
update public.products set name = 'Animalerie Cake', description = 'À partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Animalerie Cake design' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'A partir de 650' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/animalerie-cake-design-1791544522272.jpg';
update public.products set category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Cake carotte' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Carotte' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/cake-carotte-1791543743660.jpg';
update public.products set category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Snickers' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Snickers' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/snickers-1791461526849.jpg';
update public.products set name = 'Mystery Gift', description = 'Vanille, framboise et croustillant', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Mistery Gift' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Vanille & Framboise et Croustillant' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/brownies-1791543170493.jpg';
update public.products set name = 'Trompe-l''œil café', description = 'Café', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Trompe l''oeil Café' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CAFE' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/trompe-l-oeil-cafe-1791474306096.jpg';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Ocean Princess Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) à partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/ocean-princess-cake-1792073599228.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Golden Lotus Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) à partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/img-3848-1792074976567.png';
update public.products set name = 'Profession Cake', description = 'Pour 10 à 12 personnes', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PROFESSION CAKE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12 personnes)' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/collage-3-gateaux-format-carre-1792079731875.png';
update public.products set category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Glamour' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Glamour' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/glamour-1791461628728.jpg';
update public.products set name = 'Forêt-noire', description = 'Cake forêt-noire', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Fôret-Noire' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Cake Fôret-Noire' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/foret-noire-1791332845477.jpg';
update public.products set name = 'Hello Chanel', description = 'Pour 20 à 25 personnes', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'HELLO CHANEL' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(20-25personnes)' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/hello-chanel-1792075878791.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Barbie Pink Princess' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) a partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/barbie-pink-princess-1792064206709.png';
update public.products set name = 'Cheesecake Oreo San Sebastián', description = 'Oreo et San Sebastián', category = 'Pâtisseries'
  where collection = 'gateau' and category = 'Patisseries' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CheeseCake Oreo-San Sebastian' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Oreo & San Sebastian' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/cheese-cake-oreo-san-sebastian-1791543805485.jpg';
update public.products set description = 'Pour 20 à 25 personnes', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Royal Khitan Cake' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(20-25 personnes)' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/royal-khitan-cake-1792075717124.png';
update public.products set description = 'Pour 10 à 12 personnes · à partir de', category = 'Cake design'
  where collection = 'gateau' and category = 'CAKE DESIGN' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Sonic World' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '(10-12personnes) A partir de' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/gateau/sonic-world-1792063950493.png';
update public.products set name = 'Express', description = 'Boisson chaude · Jus d''orange · Viennoiserie · Bouteille d''eau', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'EXPRESS' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Boisson chaude · Jus d''orange · viennoiserie · Bouteille d''eau' and image_url = 'images/petitdej/express.webp';
update public.products set description = 'Boisson chaude · Jus d''orange · 2 œufs au plat · Huile d''olive · Jben · Panier de pain · Bouteille d''eau', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Nature' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Boisson chaude · Jus d''orange · 2 œufs au plat· Huile d''olive - Jben · Panier de pain · Bouteille d''eau' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/nature-1791561455286.png';
update public.products set name = 'Traditionnel', description = 'Boisson chaude · Jus d''orange · Msamen, harcha, rghifa · Olives · Miel · Fromage · Amlou · Panier de pain · Bouteille d''eau', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Traditionel' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Boisson chaude · Jus d''orange · Msamen, Harcha, Rghifa · Olive· Miel· Fromage· Amlou· Panier de pain · Bouteille d''eau' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/traditionel-1791557529925.jpg';
update public.products set name = 'Fassi', description = 'Boisson chaude · Jus d''orange · 2 œufs au plat au khlie · Huile d''olive · Olives · Panier de pain · Bouteille d''eau', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'FASSI' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Boisson Chaude, Jus d''orange, 2oeufs au plat avec khlie, Huile d''olive, Olive, Pain de pain, Bouteille d''eau' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/fassi-1791557735688.jpg';
update public.products set name = 'Kids', description = 'Bol de céréales · Salade de fruits · Baby pancakes Nutella Smarties · Chocolat chaud · Jus de saison · Bouteille d''eau', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'kids' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Bol de Cornflex, Salade fruits, Baby pancake Nutella Smarties, Bouteille d''eau, Chocolat Chaud, Jus de saison' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/kids-1791461746324.jpg';
update public.products set description = 'Boisson chaude · Jus d''orange · 2 œufs au plat · Fromage · Charcuterie · Jben · Huile d''olive · Olives · Panier de pain · Bouteille d''eau', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Chamali' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Boisson chaude · Jus d''orange · 2 oeuf au Plat · Fromage, Charcuterie, Jben · Huile d''olive , Olive · Panier de pain · Bouteille d''eau' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/chamali-1791560125074.jpg';
update public.products set name = 'Hollandais', description = 'Boisson chaude · Jus d''orange · Salade · 2 toasts œuf-fromage · Charcuterie · Bouteille d''eau', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'HOLLANDAIS' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Boisson chaude · Jus d''orange · Salade · 2 Toast oeuf au fromage · Charcuterie · Bouteille d''eau' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/hollandais-1791544446667.jpg';
update public.products set name = 'Brunch croque-monsieur', description = 'Jambon fumé · Œuf · Cheddar et tomates cerises · Pancakes Nutella · Boisson chaude · Jus de saison · Bouteille d''eau', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Brunch'' Croque MR' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Jambon fumé, Œuf; cheddar et tomate cerises; Pancakes nutella, Boisson chaude, Bouteille d''eau, Jus de saison' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/croque-mr-1791560175220.jpg';
update public.products set name = 'Toast fromage', description = 'Fromage', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'TOAST FROMAGE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'fromage' and image_url = 'images/petitdej/toastf.webp';
update public.products set name = 'Toast fromage charcuterie', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'TOAST FROMAGE CHARCUTERIE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Fromage · Charcuterie' and image_url = 'images/petitdej/toastfc..webp';
update public.products set name = 'Omelette nature', description = 'Nature', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'OMELETTES NATURE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'nature' and image_url = 'images/petitdej/omelettesn.webp';
update public.products set name = 'Omelette fromage', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'OMELETTES FROMAGE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Fromage' and image_url = 'images/petitdej/omelettesf.webp';
update public.products set name = 'Omelette fromage et charcuterie', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'OMELETTES FROMAGE ET CHARCUTERIE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Fromage · Charcuterie' and image_url = 'images/petitdej/omelettesch.webp';
update public.products set name = 'Omelette khlie', category = 'Petit déjeuner'
  where collection = 'menu' and category = 'PETIT DÉJEUNER' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'OMELETTES KHLIE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Khlie' and image_url = 'images/petitdej/omeletteskh.webp';
update public.products set name = 'Formule 1', description = 'Omelette fromage · Baby pancakes Nutella · Boisson chaude · Panier de pain · Bouteille d''eau', category = 'Formules'
  where collection = 'menu' and category = 'FORMULE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'FORMULE 1' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '· Omelette fromage · Baby pancakes Nutella · Boisson chaude · Panier de pain · Bouteille d''eau' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/formule-1-1791557413887.png';
update public.products set name = 'Formule 2', description = 'Croissant salé · Baby pancakes Nutella · Boisson chaude · Bouteille d''eau', category = 'Formules'
  where collection = 'menu' and category = 'FORMULE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'FORMULE 2' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '· Croissant Salé · Baby pancakes Nutella · Boisson chaude · bouteille d''eau ·' and image_url = 'images/petitdej/holondais.webp';
update public.products set name = 'Formule 3', description = 'Mini crêpe poulet · Pancake Nutella · Boisson chaude · Bouteille d''eau', category = 'Formules'
  where collection = 'menu' and category = 'FORMULE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'FORMULE 3' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '· Mini Crêpe Poulet · Pancake Nutella · Boisson chaude · Bouteille d''eau ·' and image_url = 'images/petitdej/fassi.webp';
update public.products set name = 'Mojito virgin', description = 'Le classique, sans alcool', category = 'Cocktails'
  where collection = 'menu' and category = 'COCKTAIL' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MOJITO ViRGIN' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Mojito virgin' and image_url = 'images/cocktail/virgin.webp';
update public.products set name = 'Mojito passion', description = 'Fruit de la passion', category = 'Cocktails'
  where collection = 'menu' and category = 'COCKTAIL' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MOJITO PASSION' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Fruits de passion' and image_url = 'images/cocktail/fruispa.webp';
update public.products set name = 'Mojito fruits rouges', description = 'Fruits rouges', category = 'Cocktails'
  where collection = 'menu' and category = 'COCKTAIL' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MOJITO FRUITS ROUGE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Fruits rouge' and image_url = 'images/cocktail/fruitro.webp';
update public.products set name = 'Spring Blue Mojito', description = 'À base de Red Bull', category = 'Cocktails'
  where collection = 'menu' and category = 'COCKTAIL' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'SPRING BLUE MOJITO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'SPRING BLUE' and image_url = 'images/cocktail/SPRINGBLUEMOJITO.WEBP';
update public.products set name = 'Piña colada', description = 'Coco et ananas', category = 'Cocktails'
  where collection = 'menu' and category = 'COCKTAIL' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PINA COLADA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Pina colada' and image_url = 'images/cocktail/pina.webp';
update public.products set name = 'Milkshake caramel', description = 'Caramel', category = 'Milkshakes'
  where collection = 'menu' and category = 'MILKSHAKE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE CARAMEL' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CARAMEL' and image_url = 'images/MILKSHAKE/MILKSHAKECARAMEL.webp';
update public.products set name = 'Milkshake fraise', description = 'Fraise', category = 'Milkshakes'
  where collection = 'menu' and category = 'MILKSHAKE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE FRAISE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'FRAISE' and image_url = 'images/MILKSHAKE/MILKSHAKEFRAISE.webp';
update public.products set name = 'Milkshake chocolat', description = 'Chocolat', category = 'Milkshakes'
  where collection = 'menu' and category = 'MILKSHAKE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE CHOCOLAT' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'chocolat' and image_url = 'images/MILKSHAKE/MILKSHAKECHOCOLAT.webp';
update public.products set name = 'Milkshake vanille', description = 'Vanille', category = 'Milkshakes'
  where collection = 'menu' and category = 'MILKSHAKE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'milkshake vanille' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'vanille' and image_url = 'images/MILKSHAKE/milkshakevanille.webp';
update public.products set name = 'Milkshake Oreo', description = 'Oreo', category = 'Milkshakes'
  where collection = 'menu' and category = 'MILKSHAKE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE OREO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'OREO' and image_url = 'images/MILKSHAKE/MILKSHAKEOERO.webp';
update public.products set name = 'Milkshake KitKat', description = 'KitKat', category = 'Milkshakes'
  where collection = 'menu' and category = 'MILKSHAKE' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MILKSHAKE KITKAT' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'KITKAT' and image_url = 'images/MILKSHAKE/KITKAT.webp';
update public.products set name = 'Ice tea pêche', description = 'Pêche', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'ICE TEA PEACH' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'PEACH' and image_url = 'images/BOISSONS SPECIALS/ice tea peach.webp';
update public.products set name = 'Ice tea citron', description = 'Citron', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'ICE TEA LEMON' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSONS SPECIALS/ice tea lemon.webp';
update public.products set name = 'Ice tea mangue-ananas', description = 'Mangue et ananas', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'ICE TEA MANGO-ANANAS' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'MANGO-ANANAS' and image_url = 'images/BOISSONS SPECIALS/ice tea mango ananas.webp';
update public.products set name = 'Ice coffee', description = 'Caramel, chocolat ou vanille', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'ICE COFFEE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'caramel or chocolat or vanille' and image_url = 'images/BOISSONS SPECIALS/ICE CARAMEL COFFEE.WEBP';
update public.products set name = 'Matcha latte', description = 'Matcha et lait', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MATCHA LATTE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'LATTE' and image_url = 'images/BOISSONS SPECIALS/MATCHA LATTE.webp';
update public.products set name = 'Espresso matcha', description = 'Matcha et espresso', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'ESPRESSO MATCHA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'ESPRESSO' and image_url = 'images/BOISSONS SPECIALS/espresso matcha.webp';
update public.products set name = 'Coconut matcha', description = 'Matcha et noix de coco', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'COCONUT MATCHA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'COCONUT' and image_url = 'images/BOISSONS SPECIALS/coconut matcha.webp';
update public.products set name = 'Strawberry matcha', description = 'Matcha et fraise', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'STRAWBERRY MATCHA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'STRAWBERRY' and image_url = 'images/BOISSONS SPECIALS/strawberry matcha.webp';
update public.products set name = 'Matcha mangue', description = 'Matcha et mangue', category = 'Boissons spéciales'
  where collection = 'menu' and category = 'BOISSONS SPECIALES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MANGUE MATCHA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'MANGUE' and image_url = 'images/BOISSONS SPECIALS/mangue matcha.webp';
update public.products set name = 'Espresso', category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'EXPRESSO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/EXPESSO.webp';
update public.products set category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'Thé à la menthe' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/thealamonthe.webp';
update public.products set name = 'Café allongé', category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'cafe allonge' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/cafe allonge.webp';
update public.products set name = 'Café crème', category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CAFE CREME' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/CAFE CREME.webp';
update public.products set name = 'Double espresso', category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'DOUBLE EXPRESSO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/DOUBLEEXPRESSO.webp';
update public.products set name = 'Café nes-nes', category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CAFE NES NES' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/CAFENESNES.webp';
update public.products set name = 'Chocolat chaud', category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CHOCOLAT CHAUD' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/CHOCOLATCHAUD.webp';
update public.products set name = 'Cappuccino', category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CAPPUCCINO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/CAPPUCCINO.webp';
update public.products set name = 'Chocolat fondu', category = 'Boissons chaudes'
  where collection = 'menu' and category = 'BOISSONS CHAUDES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CHOCOLAT FONDU' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/BOISSON/chocolat fondue.webp';
update public.products set name = 'Jus d''orange', category = 'Jus'
  where collection = 'menu' and category = 'JUS' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JUS D''ORANGE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/jus/jusdorange.webp';
update public.products set name = 'Jus de banane', description = '', category = 'Jus'
  where collection = 'menu' and category = 'JUS' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JUS DE BANANE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Jus de banane' and image_url = 'images/jus/banane.webp';
update public.products set name = 'Jus de pomme', description = '', category = 'Jus'
  where collection = 'menu' and category = 'JUS' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JUS DE POMME' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'POMME' and image_url = 'images/jus/pomme.webp';
update public.products set name = 'Jus de fraise', category = 'Jus'
  where collection = 'menu' and category = 'JUS' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JUS DE FRAISE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/jus/fraise.webp';
update public.products set name = 'Jus d''avocat', description = '', category = 'Jus'
  where collection = 'menu' and category = 'JUS' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JUS D''AVOCAT' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'AVOCAT' and image_url = 'images/jus/AVOCAT.webp';
update public.products set name = 'Jus de mangue', description = '', category = 'Jus'
  where collection = 'menu' and category = 'JUS' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JUS DE MANGUE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'MANGUE' and image_url = 'images/jus/mangue.webp';
update public.products set name = 'Jus d''ananas', description = '', category = 'Jus'
  where collection = 'menu' and category = 'JUS' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JUS D''ANANAS' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'ANANAS' and image_url = 'images/jus/ananas.webp';
update public.products set name = 'Jus panaché', description = 'Mélange de fruits', category = 'Jus'
  where collection = 'menu' and category = 'JUS' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JUS PANACHE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'PANACHE' and image_url = 'images/jus/panache.webp';
update public.products set name = 'Panini khlie', description = 'Khlie', category = 'Déjeuner (soda +8 Dh)'
  where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANINI KHLIE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'KHLIE' and image_url = 'images/DEJEUNER/PANINI MIXTE.WEBP';
update public.products set name = 'Panini charcuterie', description = 'Charcuterie', category = 'Déjeuner (soda +8 Dh)'
  where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANINI CHARCUTERIE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CHARCUTERIE' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/panini-charcuterie-1791461924621.jpg';
update public.products set name = 'Panini poulet', description = 'Poulet', category = 'Déjeuner (soda +8 Dh)'
  where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANINI POULET' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/DEJEUNER/PANINI POULET.WEBP';
update public.products set name = 'Panini viande hachée', description = 'Viande hachée', category = 'Déjeuner (soda +8 Dh)'
  where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANINI VIANDE HACHEE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'VIANDE HACHE' and image_url = 'images/DEJEUNER/PANINI VIANDE HACHE.WEBP';
update public.products set name = 'Panini mixte', description = 'Mixte', category = 'Déjeuner (soda +8 Dh)'
  where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANINI MIXTE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'MIXTE' and image_url = 'images/DEJEUNER/PANINI MIXTE.WEBP';
update public.products set name = 'Sandwich poulet', description = 'Poulet', category = 'Déjeuner (soda +8 Dh)'
  where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'SANDWICH POULET' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'POULET' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/sandwich-poulet-1785717928621.jpg';
update public.products set name = 'Sandwich viande hachée', description = 'Viande hachée', category = 'Déjeuner (soda +8 Dh)'
  where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'SANDWICH VIANDE HACHEE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'VIANDE HACHE' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/sandwich-viande-hachee-1785717952830.webp';
update public.products set name = 'Sandwich crispy', description = 'Crispy', category = 'Déjeuner (soda +8 Dh)'
  where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'SANDWICH CRISPY' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CRISPY' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/sandwich-crispy-1791461834789.jpg';
update public.products set name = 'Pancake nature', description = 'Nature', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE NATURE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'NATURE' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES NATURE.WEBP';
update public.products set name = 'Pancake amlou', description = 'Amlou', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE AMLOU' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES AMLOU.WEBP';
update public.products set name = 'Pancake miel et fruits secs', description = 'Miel et fruits secs', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE MIEL FRUITS SEC' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'PANCAKES MIEL FRUITS SEC' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES MIEL FRUITS SEC.WEBP';
update public.products set name = 'Pancake caramel beurre salé', description = 'Caramel beurre salé', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE CARAMEL BEURRE SALE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CARAMEL SALTY BUTTER' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES CARAMEL BEURRE SALE.WEBP';
update public.products set name = 'Pancake Nutella', description = 'Nutella', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE NUTELLA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'NUTELLA' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES NUTELLA.WEBP';
update public.products set name = 'Pancake Nutella banane', description = 'Nutella et banane', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE NUTELLA BANANE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'NUTELLA BANANE' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES NUTELLA BANANE.WEBP';
update public.products set name = 'Pancake Lotus', description = 'Lotus', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE LOTUS' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'LOTUS' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES LOTUS.WEBP';
update public.products set name = 'Pancake fruits de saison', description = 'Fruits de saison', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE FRUIT DE SAISON' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'FRUIT DE SAISON' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES FRUIT DE SAISON.WEBP';
update public.products set name = 'Pancake kunafa pistache', description = 'Kunafa et pistache', category = 'Pancakes'
  where collection = 'menu' and category = 'PANCAKES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'PANCAKE KUNAFA PISTACHE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'KUNAFA PISTACHE' and image_url = 'images/GAUFRES-PANCAKES/PANCAKES PISTACHE.WEBP';
update public.products set name = 'Crêpe nature', description = 'Nature', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE NATURE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'NATURE' and image_url = 'images/CREPE/CREPE NATURE.WEBP';
update public.products set name = 'Crêpe miel et fruits secs', description = 'Miel et fruits secs', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE MIEL FRUITS SEC' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CREPE MIEL FRUITS SEC' and image_url = 'images/CREPE/CREPE MIEL FRUITS SEC.WEBP';
update public.products set name = 'Crêpe caramel beurre salé', description = 'Caramel beurre salé', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE CARAMEL BEURRE SALE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CARAMEL BEURRE SALE' and image_url = 'images/CREPE/CREPE CARAMEL BEURRE SALE.WEBP';
update public.products set name = 'Crêpe Nutella', description = 'Nutella', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE NUTELLA' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'NUTELLA' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/crepe-nutella-1791557916730.png';
update public.products set name = 'Crêpe Nutella banane', description = 'Nutella et banane', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE NUTELLA BANANE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'NUTELLA BANANE' and image_url = 'images/CREPE/CREPE NUTELLA BANANE.WEBP';
update public.products set name = 'Crêpe Oreo', description = 'Oreo', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE OREO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'OREO' and image_url = 'images/CREPE/CREPE OREO.WEBP';
update public.products set name = 'Crêpe KitKat', description = 'KitKat', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE KITKAT' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/crepe-kitkat-1791461869174.jpg';
update public.products set name = 'Crêpe fruits de saison', description = 'Fruits de saison', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE FRUIT DE SAISON' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'FRUIT DE SAISON' and image_url = 'images/CREPE/CREPE FRUIT DE SAISON.WEBP';
update public.products set name = 'Crêpe Lotus', description = 'Lotus', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE LOTUS' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'LOTUS' and image_url = 'images/CREPE/CREPE LOTUS.WEBP';
update public.products set name = 'Crêpe Kinder Bueno', description = 'Kinder Bueno', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE KINDER BUENO' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'KINDER BUENO' and image_url = 'images/CREPE/CREPE KINDER BUENO.WEBP';
update public.products set name = 'Crêpe kunafa pistache', description = 'Kunafa et pistache', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE KUNAFA PISTACHE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'KUNAFA PISTACHE' and image_url = 'images/CREPE/CREPE KUNAFA PISTACHE.WEBP';
update public.products set name = 'Crêpe Monde Gourmand', description = 'KitKat, Oreo et pépites de chocolat', category = 'Crêpes sucrées'
  where collection = 'menu' and category = 'CREPES SUCREES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE MONDE GOURMAND' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'KITKAT, OREO, PEPITE' and image_url = 'images/pat/crepemondegourmand.webp';
update public.products set name = 'Crêpe fromage', description = 'Fromage', category = 'Crêpes salées'
  where collection = 'menu' and category = 'CREPES SALEES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE FROMAGE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'FROMAGE' and image_url = 'images/CREPE/CREPE FROMAGE.WEBP';
update public.products set name = 'Crêpe charcuterie fromage', description = 'Charcuterie et fromage', category = 'Crêpes salées'
  where collection = 'menu' and category = 'CREPES SALEES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE CHARCUTERIE FROMAGE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'CHARCUTERIE FROMAGE' and image_url = 'images/CREPE/CREPE CHARCUTERIE FROMAGE.WEBP';
update public.products set name = 'Crêpe poulet champignons', description = 'Poulet et champignons', category = 'Crêpes salées'
  where collection = 'menu' and category = 'CREPES SALEES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE POULET CHAMPIGNON' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'POULET CHAMPIGNON' and image_url = 'images/CREPE/CREPE POULET CHAMPIGNON.WEBP';
update public.products set name = 'Crêpe poulet', description = 'Poulet', category = 'Crêpes salées'
  where collection = 'menu' and category = 'CREPES SALEES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE POULET' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'POULET' and image_url = 'images/CREPE/CREPE POULET.WEBP';
update public.products set name = 'Crêpe viande hachée', description = 'Viande hachée de bœuf', category = 'Crêpes salées'
  where collection = 'menu' and category = 'CREPES SALEES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE VIANDE HACHEE BOEUF' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'VIANDE HACHEE BOEUF' and image_url = 'images/CREPE/CREPE VIANDE HACHEE BOEUF.WEBP';
update public.products set name = 'Crêpe mixte', description = 'Viande hachée et poulet', category = 'Crêpes salées'
  where collection = 'menu' and category = 'CREPES SALEES' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'CREPE MIXTE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'Viande Hachée et Poulet' and image_url = 'images/CREPE/CREPE MIXTE.WEBP';
update public.products set name = 'Eau minérale', category = 'Sodas & eaux'
  where collection = 'menu' and category = 'SODA' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'EAU MINERALE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'images/soda/eau.webp';
update public.products set name = 'Soda canette 25 cl', description = '', category = 'Sodas & eaux'
  where collection = 'menu' and category = 'SODA' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'SODA CANETTE 25CL' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'SODA CANETTE 25CL' and image_url = 'images/soda/soda.webp';
update public.products set name = 'Oulmès', description = 'Eau gazeuse', category = 'Sodas & eaux'
  where collection = 'menu' and category = 'SODA' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'OULMES' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'OULMES' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/oulmes-1785718547362.webp';
update public.products set name = 'Jben ou charcuterie', category = 'Suppléments'
  where collection = 'menu' and category = 'SUPLEMENT' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'JBEN OU CHARCUTERIE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = '' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/jben-ou-charcuterie-1785718364550.webp';
update public.products set name = 'Miel ou huile d''olive', description = '', category = 'Suppléments'
  where collection = 'menu' and category = 'SUPLEMENT' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'MIEL OU HUILE D OLIVE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'MIEL OU HUILE D OLIVE' and image_url = 'https://bqesiaketxtzfueeuwpc.supabase.co/storage/v1/object/public/product-images/products/menu/miel-ou-huile-d-olive-1785718488340.webp';
update public.products set name = 'Frites', description = '', category = 'Suppléments'
  where collection = 'menu' and category = 'SUPLEMENT' and regexp_replace(trim(name), '\s+', ' ', 'g') = 'FRITE' and regexp_replace(trim(coalesce(description, '')), '\s+', ' ', 'g') = 'FRITE' and image_url = 'images/frites.webp';

-- 2) Produits ajoutés après le 24/10 : on suit simplement le renommage de leur catégorie
update public.products set category = 'Pâtisseries' where collection = 'gateau' and category = 'Patisseries';
update public.products set category = 'Cake design' where collection = 'gateau' and category = 'CAKE DESIGN';
update public.products set category = 'Petit déjeuner' where collection = 'menu' and category = 'PETIT DÉJEUNER';
update public.products set category = 'Formules' where collection = 'menu' and category = 'FORMULE';
update public.products set category = 'Cocktails' where collection = 'menu' and category = 'COCKTAIL';
update public.products set category = 'Milkshakes' where collection = 'menu' and category = 'MILKSHAKE';
update public.products set category = 'Boissons spéciales' where collection = 'menu' and category = 'BOISSONS SPECIALES';
update public.products set category = 'Boissons chaudes' where collection = 'menu' and category = 'BOISSONS CHAUDES';
update public.products set category = 'Jus' where collection = 'menu' and category = 'JUS';
update public.products set category = 'Déjeuner (soda +8 Dh)' where collection = 'menu' and category = 'DEJEUNER ( SODA +8DH )';
update public.products set category = 'Pancakes' where collection = 'menu' and category = 'PANCAKES';
update public.products set category = 'Crêpes sucrées' where collection = 'menu' and category = 'CREPES SUCREES';
update public.products set category = 'Crêpes salées' where collection = 'menu' and category = 'CREPES SALEES';
update public.products set category = 'Sodas & eaux' where collection = 'menu' and category = 'SODA';
update public.products set category = 'Suppléments' where collection = 'menu' and category = 'SUPLEMENT';

-- 3) Catégories
update public.product_categories set name = 'Pâtisseries' where collection = 'gateau' and name = 'Patisseries';
update public.product_categories set name = 'Cake design' where collection = 'gateau' and name = 'CAKE DESIGN';
update public.product_categories set name = 'Petit déjeuner' where collection = 'menu' and name = 'PETIT DÉJEUNER';
update public.product_categories set name = 'Formules' where collection = 'menu' and name = 'FORMULE';
update public.product_categories set name = 'Cocktails' where collection = 'menu' and name = 'COCKTAIL';
update public.product_categories set name = 'Milkshakes' where collection = 'menu' and name = 'MILKSHAKE';
update public.product_categories set name = 'Boissons spéciales' where collection = 'menu' and name = 'BOISSONS SPECIALES';
update public.product_categories set name = 'Boissons chaudes' where collection = 'menu' and name = 'BOISSONS CHAUDES';
update public.product_categories set name = 'Jus' where collection = 'menu' and name = 'JUS';
update public.product_categories set name = 'Déjeuner (soda +8 Dh)' where collection = 'menu' and name = 'DEJEUNER ( SODA +8DH )';
update public.product_categories set name = 'Pancakes' where collection = 'menu' and name = 'PANCAKES';
update public.product_categories set name = 'Crêpes sucrées' where collection = 'menu' and name = 'CREPES SUCREES';
update public.product_categories set name = 'Crêpes salées' where collection = 'menu' and name = 'CREPES SALEES';
update public.product_categories set name = 'Sodas & eaux' where collection = 'menu' and name = 'SODA';
update public.product_categories set name = 'Suppléments' where collection = 'menu' and name = 'SUPLEMENT';

commit;

-- 4) Vérification : liste du menu après correction
select collection, category, name, description, price
from public.products
where is_active
order by collection, sort_order, name;
