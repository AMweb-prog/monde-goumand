/* ============================================================
   MONDE GOURMAND — script.js (COMPLET ET CORRIGÉ)
   ============================================================ */

/* ── CURSOR ──────────────────────────────────────────────── */
const $cur = document.getElementById('cur');
const $ring = document.getElementById('cur-ring');
let rx = 0, ry = 0, cx = 0, cy = 0;
if ($cur && $ring) {
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    $cur.style.left = cx + 'px'; $cur.style.top = cy + 'px';
  });
  function animRing() {
    rx += (cx - rx) * 0.12; ry += (cy - ry) * 0.12;
    $ring.style.left = rx + 'px'; $ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.addEventListener('mousedown', () => $cur.style.transform = 'translate(-50%,-50%) scale(.4)');
  document.addEventListener('mouseup', () => $cur.style.transform = 'translate(-50%,-50%) scale(1)');
}

/* ── HEADER SCROLL ───────────────────────────────────────── */
const $hdr = document.getElementById('siteHeader');
if ($hdr) window.addEventListener('scroll', () => $hdr.classList.toggle('scrolled', scrollY > 60), { passive: true });

/* ── HAMBURGER ───────────────────────────────────────────── */
const $ham = document.getElementById('ham');
const $mobNav = document.getElementById('mobNav');
if ($ham && $mobNav) {
  $ham.addEventListener('click', () => {
    const on = $mobNav.classList.toggle('on');
    $ham.classList.toggle('on', on);
    document.body.style.overflow = on ? 'hidden' : '';
  });
}
function closeMob() {
  if ($mobNav) $mobNav.classList.remove('on');
  if ($ham) $ham.classList.remove('on');
  document.body.style.overflow = '';
}

/* ── LANG SWITCH ─────────────────────────────────────────── */
const TRANS = {
  fr: { home: 'Accueil', about: 'À propos', gateau: 'Gâteaux', menu: 'Menu', cart: 'Panier', wheel: 'La Roue', sub: "L'art du café & de la pâtisserie d'exception" },
  en: { home: 'Home', about: 'About Us', gateau: 'Cakes', menu: 'Menu', cart: 'Cart', wheel: 'Wheel', sub: 'The art of coffee & exceptional pastry' }
};
let lang = localStorage.getItem('mglang') || 'fr';
function applyLang(l) {
  lang = l; localStorage.setItem('mglang', l);
  const t = TRANS[l];
  document.querySelectorAll('[data-t="home"]').forEach(e => e.textContent = t.home);
  document.querySelectorAll('[data-t="about"]').forEach(e => e.textContent = t.about);
  document.querySelectorAll('[data-t="gateau"]').forEach(e => e.textContent = t.gateau);
  document.querySelectorAll('[data-t="cart"]').forEach(e => e.textContent = t.cart);
  document.querySelectorAll('[data-t="wheel"]').forEach(e => e.textContent = t.wheel);
  document.querySelectorAll('[data-t="sub"]').forEach(e => e.textContent = t.sub);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
}
document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
applyLang(lang);

/* ── CART ────────────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('mgcart') || '[]');
function saveCart() { localStorage.setItem('mgcart', JSON.stringify(cart)); refreshBadges(); }
function refreshBadges() {
  const n = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cbadge').forEach(e => e.textContent = n);
}
function addToCart(p) {
  const ex = cart.find(i => i.id == p.id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  showToast('✓  ' + p.name + ' ajouté au panier');
}
function removeFromCart(id) { cart = cart.filter(i => i.id != id); saveCart(); }
function changeQty(id, d) {
  const it = cart.find(i => i.id == id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) removeFromCart(id);
  else saveCart();
}
refreshBadges();

/* ── TOAST ───────────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function doReveal() {
  document.querySelectorAll('.rv:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight - 70) el.classList.add('in');
  });
}
window.addEventListener('scroll', doReveal, { passive: true });
setTimeout(doReveal, 200);

/* ── FAQ ─────────────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── BOOK DATA ───────────────────────────────────────────── */
const SPREADS = [
  { left: { tag: 'Boissons Chaudes', title: "L'Art du Café", items: [{ img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=80&h=80&fit=crop', name: 'Espresso', desc: 'Arabica · Torréfaction maison', price: '15 Dh' }, { img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=80&h=80&fit=crop', name: 'Cappuccino', desc: 'Espresso · Mousse veloutée · Cacao', price: '30 Dh' }, { img: 'https://images.unsplash.com/photo-1561882468-9110d70d7f48?w=80&h=80&fit=crop', name: 'Café Latte', desc: 'Double espresso · Lait vapeur', price: '35 Dh' }, { img: 'https://images.unsplash.com/photo-1542990253-a781e5583e61?w=80&h=80&fit=crop', name: 'Chocolat Chaud Belge', desc: 'Chocolat 60% · Crème fouettée', price: '28 Dh' }, { img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=80&h=80&fit=crop', name: 'Matcha Latte', desc: 'Matcha premium · Lait de coco', price: '38 Dh' }] }, right: { tag: 'Pâtisseries Vedettes', title: 'Nos Signatures', items: [{ img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop', name: 'Croissant au Beurre', desc: 'Pâte feuilletée · Beurre AOP', price: '18 Dh' }, { img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=80&h=80&fit=crop', name: 'Pain au Chocolat', desc: 'Chocolat noir 70% · Beurre AOP', price: '22 Dh' }, { img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop', name: 'Tarte aux Fraises', desc: 'Crème pâtissière · Fraises fraîches', price: '45 Dh' }, { img: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=80&h=80&fit=crop', name: 'Tarte Citron Meringuée', desc: 'Meringue italienne · Lemon curd', price: '50 Dh' }, { img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=80&h=80&fit=crop', name: 'Financier Amande', desc: 'Beurre noisette · Amandes · Miel', price: '20 Dh' }] } },
  { left: { tag: 'Gâteaux & Entremets', title: 'Créations Maison', items: [{ img: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=80&h=80&fit=crop', name: 'Forêt Noire', desc: 'Cerise · Chantilly · Génoise', price: '75 Dh' }, { img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=80&h=80&fit=crop', name: 'Tiramisu Classique', desc: 'Mascarpone · Espresso · Cacao', price: '55 Dh' }, { img: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=80&h=80&fit=crop', name: 'Mille-Feuille', desc: 'Feuilletage caramélisé · Crème diplomate', price: '65 Dh' }, { img: 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=80&h=80&fit=crop', name: 'Opéra Cake', desc: 'Joconde · Café · Ganache', price: '70 Dh' }, { img: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=80&h=80&fit=crop', name: 'Red Velvet', desc: 'Cream cheese frosting · Cacao', price: '80 Dh' }] }, right: { tag: 'Macarons & Petits Fours', title: 'Plaisirs Sucrés', items: [{ img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=80&h=80&fit=crop', name: 'Macaron Framboise', desc: 'Ganache framboise · Biscuit amande', price: '15 Dh' }, { img: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=80&h=80&fit=crop', name: 'Macaron Pistache', desc: 'Crème pistache · Éclats', price: '15 Dh' }, { img: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=80&h=80&fit=crop', name: 'Macaron Caramel Salé', desc: 'Caramel breton · Fleur de sel', price: '15 Dh' }, { img: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=80&h=80&fit=crop', name: 'Éclair au Chocolat', desc: 'Choux · Ganache · Fondant brillant', price: '30 Dh' }, { img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop', name: 'Paris-Brest', desc: 'Crème pralinée · Noisettes', price: '60 Dh' }] } },
  { left: { tag: 'Boissons Froides', title: 'Fraîcheur & Saveurs', items: [{ img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop', name: 'Iced Latte Caramel', desc: 'Espresso · Lait · Caramel salé', price: '40 Dh' }, { img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=80&h=80&fit=crop', name: 'Smoothie Mangue', desc: 'Mangue · Lait de coco · Menthe', price: '35 Dh' }, { img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=80&h=80&fit=crop', name: 'Limonade Artisanale', desc: 'Citron · Basilic · Gingembre', price: '25 Dh' }, { img: 'https://images.unsplash.com/photo-1572490122747-3b69b6b462ae?w=80&h=80&fit=crop', name: 'Milkshake Chocolat', desc: 'Glace artisanale · Chocolat belge', price: '38 Dh' }, { img: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=80&h=80&fit=crop', name: 'Smoothie Myrtille', desc: 'Myrtille · Banane · Lait d\'amande', price: '35 Dh' }] }, right: { tag: 'Formules & Offres', title: 'Nos Suggestions', items: [{ img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop', name: 'Formule Matin', desc: 'Café + viennoiserie au choix', price: '45 Dh' }, { img: 'https://images.unsplash.com/photo-1607920592519-bab2a80efd52?w=80&h=80&fit=crop', name: 'Formule Pause', desc: 'Thé + macaron × 2', price: '40 Dh' }, { img: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=80&h=80&fit=crop', name: 'Plateau Dégustation', desc: 'Assortiment 6 macarons', price: '80 Dh' }, { img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&h=80&fit=crop', name: 'Gâteau Entier', desc: 'Sur commande · Personnalisé', price: 'Sur devis' }, { img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=80&h=80&fit=crop', name: 'Formule Événement', desc: 'Buffet sucré · Traiteur', price: 'Nous appeler' }] } },
  { left: { tag: 'Thés & Infusions', title: 'Douceurs Chaudes', items: [{ img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=80&h=80&fit=crop', name: 'Thé à la Menthe', desc: 'Menthe fraîche · Sucre · Tradition', price: '18 Dh' }, { img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=80&h=80&fit=crop', name: 'Thé Earl Grey', desc: 'Bergamote · Lait · Miel', price: '22 Dh' }, { img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=80&h=80&fit=crop', name: 'Infusion Hibiscus', desc: 'Hibiscus · Rose · Gingembre', price: '20 Dh' }, { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop', name: 'Chaï Latte', desc: 'Épices · Lait vapeur · Cannelle', price: '32 Dh' }, { img: 'https://images.unsplash.com/photo-1617951653493-b30f60f55f12?w=80&h=80&fit=crop', name: 'Thé Vert Jasmin', desc: 'Jasmin · Fleur d\'oranger · Douceur', price: '20 Dh' }] }, right: { tag: 'Cheesecakes & Mousses', title: 'Légèreté & Gourmandise', items: [{ img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=80&h=80&fit=crop', name: 'Cheesecake Framboise', desc: 'Fromage frais · Coulis · Biscuit', price: '55 Dh' }, { img: 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=80&h=80&fit=crop', name: 'Cheesecake Citron', desc: 'Cream cheese · Zestes · Meringue', price: '55 Dh' }, { img: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=80&h=80&fit=crop', name: 'Mousse Chocolat Noir', desc: 'Chocolat 72% · Texture aérienne', price: '40 Dh' }, { img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop', name: 'Panna Cotta Vanille', desc: 'Vanille Bourbon · Coulis fruits rouges', price: '38 Dh' }, { img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=80&h=80&fit=crop', name: 'Bavarois Mangue', desc: 'Mousse mangue · Miroir fruit', price: '50 Dh' }] } },
  { left: { tag: 'Viennoiseries du Jour', title: 'Sortis du Four', items: [{ img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop', name: 'Croissant Amande', desc: 'Crème amandine · Amandes effilées', price: '25 Dh' }, { img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=80&h=80&fit=crop', name: 'Brioche Sucrée', desc: 'Beurre AOP · Mie filante · Vanille', price: '22 Dh' }, { img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=80&h=80&fit=crop', name: 'Chausson aux Pommes', desc: 'Compote maison · Feuilletage doré', price: '20 Dh' }, { img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=80&h=80&fit=crop', name: 'Kouign-Amann', desc: 'Beurre salé · Caramel croustillant', price: '28 Dh' }, { img: 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=80&h=80&fit=crop', name: 'Palmier au Sucre', desc: 'Feuilletage caramélisé · Croustillant', price: '15 Dh' }] }, right: { tag: 'Salé & Snacking', title: 'Pause Gourmande', items: [{ img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop', name: 'Quiche Lorraine', desc: 'Lardons · Gruyère · Pâte brisée', price: '40 Dh' }, { img: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=80&h=80&fit=crop', name: 'Sandwich Club', desc: 'Poulet · Avocat · Tomate · Mayo', price: '45 Dh' }, { img: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=80&h=80&fit=crop', name: 'Croque Monsieur', desc: 'Jambon · Béchamel · Fromage fondu', price: '38 Dh' }, { img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=80&h=80&fit=crop', name: 'Wrap Thon Avocat', desc: 'Thon · Avocat · Salade · Citron', price: '42 Dh' }, { img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=80&h=80&fit=crop', name: 'Salade Caesar', desc: 'Romaine · Parmesan · Croûtons', price: '48 Dh' }] } },
  { left: { tag: 'Glaces & Sorbets', title: 'Fraîcheur Glacée', items: [{ img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=80&h=80&fit=crop', name: 'Boule Vanille Bourbon', desc: 'Vanille Madagascar · Crème fraîche', price: '18 Dh' }, { img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=80&h=80&fit=crop', name: 'Sorbet Citron', desc: 'Citron frais · Menthe · Zestes', price: '18 Dh' }, { img: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=80&h=80&fit=crop', name: 'Coupe 3 Boules', desc: 'Au choix · Chantilly · Sauce chocolat', price: '45 Dh' }, { img: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=80&h=80&fit=crop', name: 'Sundae Caramel', desc: 'Glace vanille · Caramel · Noisettes', price: '48 Dh' }, { img: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=80&h=80&fit=crop', name: 'Affogato', desc: 'Glace vanille · Double espresso chaud', price: '38 Dh' }] }, right: { tag: 'Spécialités Marocaines', title: 'Saveurs du Maroc', items: [{ img: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=80&h=80&fit=crop', name: 'Cornes de Gazelle', desc: 'Pâte d\'amande · Eau de fleur d\'oranger', price: '12 Dh' }, { img: 'https://images.unsplash.com/photo-1627308595229-7830a5c18aba?w=80&h=80&fit=crop', name: 'Chebakia', desc: 'Miel · Sésame · Épices traditionnelles', price: '10 Dh' }, { img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=80&h=80&fit=crop', name: 'M\'hancha', desc: 'Serpentin amande · Cannelle · Orange', price: '55 Dh' }, { img: 'https://images.unsplash.com/photo-1617951653493-b30f60f55f12?w=80&h=80&fit=crop', name: 'Thé à la Menthe Royal', desc: 'Gunpowder · Menthe fraîche · Cérémonie', price: '25 Dh' }, { img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=80&h=80&fit=crop', name: 'Bastilla Sucrée', desc: 'Amandes · Cannelle · Feuille de brick', price: '65 Dh' }] } },
  { left: { tag: 'Cake Design', title: 'Créations Artistiques', items: [{ img: 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=80&h=80&fit=crop', name: 'Wedding Cake', desc: '3 étages · Fleurs sugar · Personnalisé', price: 'Sur devis' }, { img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&h=80&fit=crop', name: 'Gâteau Anniversaire', desc: 'Décoration sur mesure · Figurines', price: '150 Dh+' }, { img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=80&h=80&fit=crop', name: 'Number Cake', desc: 'Chiffres en biscuit · Crème · Fleurs', price: '200 Dh' }, { img: 'https://images.unsplash.com/photo-1607920592519-bab2a80efd52?w=80&h=80&fit=crop', name: 'Naked Cake', desc: 'Layers apparents · Fruits frais · Rustic', price: '180 Dh' }, { img: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=80&h=80&fit=crop', name: 'Drip Cake', desc: 'Glaçage coulant · Déco gourmande', price: '160 Dh' }] }, right: { tag: 'Événements & Réceptions', title: 'Service Traiteur', items: [{ img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=80&h=80&fit=crop', name: 'Buffet Sucré', desc: 'Assortiment · Présentation soignée', price: 'Nous appeler' }, { img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=80&h=80&fit=crop', name: 'Candy Bar', desc: 'Macarons · Cupcakes · Mini desserts', price: 'Devis gratuit' }, { img: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=80&h=80&fit=crop', name: 'Box Cadeau', desc: 'Sélection macarons · Emballage luxe', price: '120 Dh' }, { img: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=80&h=80&fit=crop', name: 'Table d\'Honneur', desc: 'Décoration florale · Pièce montée', price: 'Sur devis' }, { img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop', name: 'Pause Café Entreprise', desc: 'Viennoiseries · Café · Livraison', price: 'Nous appeler' }] } },
  { left: { tag: 'Boissons Santé', title: 'Bien-être & Vitalité', items: [{ img: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=80&h=80&fit=crop', name: 'Jus Détox Vert', desc: 'Épinard · Concombre · Pomme · Citron', price: '32 Dh' }, { img: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=80&h=80&fit=crop', name: 'Golden Latte', desc: 'Curcuma · Lait de coco · Miel', price: '35 Dh' }, { img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=80&h=80&fit=crop', name: 'Eau Infusée', desc: 'Concombre · Menthe · Citron · Détox', price: '15 Dh' }, { img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=80&h=80&fit=crop', name: 'Matcha Glacé', desc: 'Matcha premium · Lait d\'amande · Glace', price: '38 Dh' }, { img: 'https://images.unsplash.com/photo-1572490122747-3b69b6b462ae?w=80&h=80&fit=crop', name: 'Shake Protéiné', desc: 'Banane · Beurre de cacahuète · Cacao', price: '40 Dh' }] }, right: { tag: 'Brunch & Week-end', title: 'Le Grand Brunch', items: [{ img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop', name: 'Formule Brunch Classique', desc: 'Café · Jus · Viennoiseries · Oeufs', price: '85 Dh' }, { img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop', name: 'Eggs Benedict', desc: 'Oeuf poché · Hollandaise · Saumon', price: '65 Dh' }, { img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=80&h=80&fit=crop', name: 'Avocado Toast', desc: 'Pain grillé · Avocat · Oeuf · Za\'atar', price: '55 Dh' }, { img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=80&h=80&fit=crop', name: 'Pancakes Maison', desc: 'Myrtilles · Sirop d\'érable · Beurre', price: '50 Dh' }, { img: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=80&h=80&fit=crop', name: 'Formule Brunch Premium', desc: 'Tout inclus · Champagne · Dessert', price: '150 Dh' }] } }
];

function buildPageContent(data) {
  return `<span class="pg-tag">${data.tag}</span><div class="pg-title">${data.title}</div><div class="pg-items">${data.items.map(it => `<div class="mi"><div class="mi-photo"><img src="${it.img}" alt="${it.name}" loading="lazy"></div><div class="mi-info"><div class="mi-name">${it.name}</div><div class="mi-desc">${it.desc}</div></div><span class="mi-price">${it.price}</span></div>`).join('')}</div><div class="pg-foot">Monde Gourmand — Café &amp; Cake · Kénitra</div>`;
}

/* FLIP BOOK */
let _isFlipping = false;
let currentSpread = -1;

function showSpread(idx, direction) {
  const bookLeft = document.getElementById('bookLeft');
  const bookRight = document.getElementById('bookRight');
  if (!bookLeft || !bookRight) return;
  if (_isFlipping) return;
  let dir = direction;
  if (dir === undefined) dir = idx > currentSpread ? 'right' : 'left';
  if (idx === -1) {
    _animateFlipCover(bookLeft, bookRight, dir, () => {
      bookLeft.innerHTML = `<div class="page-face book-cover-face" id="coverFace" onclick="showSpread(0)"><div class="bc-photo"><img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop" alt="Café"></div><div class="bc-title">Notre<em>Menu</em></div><div class="bc-divider"></div><div class="bc-hint">Cliquez pour ouvrir →</div></div>`;
      bookRight.innerHTML = `<div class="page-face" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:linear-gradient(to left,#e8dcc8,#f6f0e2 4%,var(--white));"><img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=180&h=180&fit=crop" alt="Gâteau" style="width:80px;height:80px;border-radius:50%;object-fit:cover;opacity:.25;border:2px solid var(--gold);"><div style="font-family:var(--ff-head);font-size:.65rem;letter-spacing:4px;text-transform:uppercase;color:var(--text-light);opacity:.5;">Monde Gourmand</div></div>`;
    });
    currentSpread = -1;
    return;
  }
  const sp = SPREADS[idx];
  if (!sp) return;
  const newLeftContent = `<div class="page-face">${buildPageContent(sp.left)}<div class="corner-fold"></div></div>`;
  const newRightContent = `<div class="page-face">${buildPageContent(sp.right)}<div class="corner-fold" style="right:auto;left:0;border-left:1px solid #d8c8a8;border-right:none;box-shadow:4px 4px 12px rgba(0,0,0,.08);"></div></div>`;
  _animateFlipPages(bookLeft, bookRight, dir, newLeftContent, newRightContent, () => { currentSpread = idx; });
  document.querySelectorAll('.bnav-btn').forEach((b, i) => b.classList.toggle('on', i === idx));
}

function _animateFlipPages(leftEl, rightEl, dir, newLeftHTML, newRightHTML, onComplete) {
  _isFlipping = true;
  const bookPages = leftEl.closest('.bookPages') || leftEl.parentElement;
  const isTurningRight = (dir === 'right');
  let sourcePage, targetPage, newContent;
  if (isTurningRight) { sourcePage = rightEl; targetPage = leftEl; newContent = newLeftHTML; }
  else { sourcePage = leftEl; targetPage = rightEl; newContent = newRightHTML; }
  const flipOverlay = document.createElement('div');
  flipOverlay.style.cssText = `position:absolute;top:0;bottom:0;width:100%;background:${isTurningRight ? 'linear-gradient(to left,#e8dcc8,#f6f0e2 4%,#FEFCF5)' : 'linear-gradient(to right,#e8dcc8,#f6f0e2 4%,#FEFCF5)'};z-index:100;transform-origin:${isTurningRight ? 'left center' : 'right center'};transform-style:preserve-3d;pointer-events:none;box-shadow:${isTurningRight ? '-8px 0 20px rgba(0,0,0,.15)' : '8px 0 20px rgba(0,0,0,.15)'};border-radius:${isTurningRight ? '0 4px 4px 0' : '4px 0 0 4px'};`;
  const frontFace = document.createElement('div');
  frontFace.style.cssText = `position:absolute;inset:0;backface-visibility:hidden;background:inherit;display:flex;align-items:center;justify-content:center;`;
  frontFace.innerHTML = sourcePage.innerHTML;
  const backFace = document.createElement('div');
  backFace.style.cssText = `position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);background:${isTurningRight ? 'linear-gradient(to left,#e8dcc8,#f6f0e2 4%,#FEFCF5)' : 'linear-gradient(to right,#e8dcc8,#f6f0e2 4%,#FEFCF5)'};display:flex;align-items:center;justify-content:center;`;
  backFace.innerHTML = newContent;
  flipOverlay.appendChild(frontFace);
  flipOverlay.appendChild(backFace);
  const shadow = document.createElement('div');
  shadow.style.cssText = `position:absolute;top:0;bottom:0;width:60px;${isTurningRight ? 'right: -60px' : 'left: -60px'};background:${isTurningRight ? 'linear-gradient(to left,rgba(0,0,0,.3),transparent)' : 'linear-gradient(to right,rgba(0,0,0,.3),transparent)'};z-index:99;pointer-events:none;opacity:0;transition:opacity 0.25s ease;`;
  bookPages.style.position = 'relative';
  bookPages.appendChild(flipOverlay);
  bookPages.appendChild(shadow);
  requestAnimationFrame(() => {
    flipOverlay.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    shadow.style.opacity = '0.8';
    if (isTurningRight) flipOverlay.style.transform = 'rotateY(-180deg)';
    else flipOverlay.style.transform = 'rotateY(180deg)';
    setTimeout(() => {
      if (isTurningRight) leftEl.innerHTML = newLeftHTML;
      else rightEl.innerHTML = newRightHTML;
      flipOverlay.style.transition = '';
      flipOverlay.remove();
      shadow.remove();
      _isFlipping = false;
      if (onComplete) onComplete();
    }, 620);
  });
}

function _animateFlipCover(leftEl, rightEl, dir, onComplete) {
  _isFlipping = true;
  const bookPages = leftEl.closest('.bookPages') || leftEl.parentElement;
  const flipOverlay = document.createElement('div');
  flipOverlay.style.cssText = `position:absolute;top:0;bottom:0;width:50%;left:0;background:linear-gradient(150deg,#F0D080,#BF9B4E);z-index:100;transform-origin:left center;transform-style:preserve-3d;pointer-events:none;box-shadow:8px 0 20px rgba(28,16,5,.2);border-radius:0 4px 4px 0;`;
  const frontFace = document.createElement('div');
  frontFace.style.cssText = `position:absolute;inset:0;backface-visibility:hidden;background:inherit;`;
  frontFace.innerHTML = leftEl.innerHTML;
  const backFace = document.createElement('div');
  backFace.style.cssText = `position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);background:linear-gradient(150deg,#F0D080,#BF9B4E);display:flex;align-items:center;justify-content:center;`;
  backFace.innerHTML = `<div style="text-align:center;color:#1C1005;"><span style="font-size:2rem;">📖</span><div style="margin-top:10px;">Monde Gourmand</div></div>`;
  flipOverlay.appendChild(frontFace);
  flipOverlay.appendChild(backFace);
  bookPages.appendChild(flipOverlay);
  requestAnimationFrame(() => {
    flipOverlay.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
    flipOverlay.style.transform = 'rotateY(-180deg)';
    setTimeout(() => { onComplete(); flipOverlay.remove(); _isFlipping = false; }, 580);
  });
}

function prevSpread() { if (_isFlipping) return; const newIdx = currentSpread <= 0 ? SPREADS.length - 1 : currentSpread - 1; showSpread(newIdx, 'left'); }
function nextSpread() { if (_isFlipping) return; const newIdx = currentSpread >= SPREADS.length - 1 ? 0 : currentSpread + 1; showSpread(newIdx, 'right'); }

document.addEventListener('DOMContentLoaded', () => {
  showSpread(-1);
  document.querySelectorAll('.bnav-btn').forEach((btn, i) => btn.addEventListener('click', () => showSpread(i)));
  document.getElementById('bPrev')?.addEventListener('click', prevSpread);
  document.getElementById('bNext')?.addEventListener('click', nextSpread);
  document.addEventListener('keydown', e => { if (e.key === 'ArrowRight') nextSpread(); if (e.key === 'ArrowLeft') prevSpread(); });
});

/* GALLERY CARROUSEL */
(function () {
  const track = document.getElementById('gTrack');
  const dotsEl = document.getElementById('gDots');
  const btnP = document.getElementById('gPrev');
  const btnN = document.getElementById('gNext');
  if (!track) return;
  const items = track.querySelectorAll('.gi');
  const W = 260 + 12;
  const vis = Math.max(1, Math.floor((window.innerWidth - 96) / W));
  const maxIdx = Math.max(0, items.length - vis);
  let cur = 0, timer;
  const dotCount = Math.ceil(items.length / vis);
  for (let i = 0; i < dotCount; i++) {
    const d = document.createElement('div');
    d.className = 'g-dot' + (i === 0 ? ' on' : '');
    d.onclick = () => go(i * vis);
    dotsEl.appendChild(d);
  }
  function go(idx) { cur = Math.max(0, Math.min(maxIdx, idx)); track.style.transform = `translateX(-${cur * W}px)`; const di = Math.floor(cur / vis); dotsEl.querySelectorAll('.g-dot').forEach((d, i) => d.classList.toggle('on', i === di)); }
  function next() { go(cur + vis >= items.length ? 0 : cur + vis); }
  function prev() { go(cur - vis < 0 ? maxIdx : cur - vis); }
  btnN && btnN.addEventListener('click', () => { next(); reset(); });
  btnP && btnP.addEventListener('click', () => { prev(); reset(); });
  function start() { timer = setInterval(next, 3500); }
  function reset() { clearInterval(timer); start(); }
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', start);
  start();
})();

/* ── PRODUCTS ────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 1, name: ' NEW YEAR', img: 'images/gateau/bucherouge.webp', price: 150, cat: 'gateau', desc: ' a partir de ', promo: false, isNew: false },
  { id: 2, name: 'buche fouret noir', img: 'images/gateau/noel3.webp', price: 150, cat: 'gateau', desc: 'a partir de', promo: true, isNew: false },
  { id: 3, name: "trompe l'oeil citron", img: 'images/pat/citron.webp', price: 24, cat: 'patisserie', desc: 'citron', promo: false, isNew: false },
  { id: 11, name: "trompe l'oeil pistache", img: 'images/pat/pistache.webp', price: 26, cat: 'patisserie', desc: 'pistache', promo: true, isNew: false },
  { id: 12, name: 'cake design', img: 'images/gateau/eidmobarak.webp', price: 200, cat: 'gateau', desc: 'a partir de', promo: false, isNew: true },
  { id: 13, name: " cake design d'anniverssaire ", img: 'images/gateau/happyb.webp', price: 200, cat: 'gateau', desc: ' a partir de', promo: false, isNew: false },
  { id: 14, name: 'MOJITO FRUITS DE PASSION', img: 'images/boi/fruis.webp', price: 28, cat: 'boisson', desc: 'FRUITS DE PASSION', promo: false, isNew: false },
  { id: 15, name: 'MOJITO VERGIN', img: 'images/boi/mokhitofruispassion.webp', price: 25, cat: 'boisson', desc: 'VERGIN', promo: true, isNew: false },
  { id: 16, name: 'MOJITO FRUITS ROUGE', img: 'images/boi/fruisrouge.webp', price: 25, cat: 'boisson', desc: 'FRUITS ROUGE', promo: false, isNew: false },
  { id: 17, name: 'cake design fruit', img: 'images/gateau/FRAMBOISE.webp', price: 200, cat: 'gateau', desc: 'a partir de', promo: false, isNew: true },
  { id: 18, name: "trompe l'oeil poire ", img: 'images/pat/poire.webp', price: 22, cat: 'patisserie', desc: 'poire', promo: false, isNew: false },
  { id: 19, name: "trompe l'oeil pomme", img: 'images/pat/pomme.webp', price: 22, cat: 'patisserie', desc: 'pomme', promo: false, isNew: false },
  { id: 20, name: 'PINA COLADA', img: 'images/cocktail/pina.webp', price: 28, cat: 'boisson', desc: 'PINA COLADA . ANANS', promo: false, isNew: false },
  { id: 21, name: 'gateau glacé', img: 'images/gateau/newyear.webp', price: 150, cat: 'gateau', desc: ' a partir de', promo: false, isNew: true },
  { id: 23, name: 'SPRING BLUE MOJITO', img: 'images/cocktail/SPRINGBLUEMOJITO.WEBP', price: 45, cat: 'boisson', desc: 'SPRING BLUE', promo: false, isNew: false },
  { id: 24, name: 'cake design', img: 'images/gateau/goodluck.webp', price: 200, cat: 'gateau', desc: 'a partir de ', promo: false, isNew: false },
  { id: 25, name: "gateau amande", img: "images/gateau/mariage2.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 26, name: "buche new year'", img: "images/gateau/buchedamour.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 27, name: "CAKE DESIGN BIRTHDAY", img: "images/gateau/birthday.webp", price: 200, cat: 'gateau', desc: " a partir de", promo: false, isNew: false },
  { id: 28, name: "cake design mariage", img: "images/gateau/mariage.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 29, name: "HAPPY BIRTHDAY LINA", img: "images/gateau/birthdaylina.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 30, name: "buche NOEL", img: "images/gateau/buchenoel.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 31, name: "FROZENE", img: "images/gateau/frozene.webp", price: 200, cat: 'gateau', desc: "a partir de ", promo: false, isNew: false },
  { id: 32, name: "buche NOEL", img: "images/gateau/noel2.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 33, name: "wedding cake", img: "images/gateau/mariage2.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 34, name: "cake design", img: "images/gateau/redheart.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 35, name: "gateau glacé", img: "images/gateau/love.webp", price: 200, cat: 'gateau', desc: "a partir de", promo: false, isNew: false },
  { id: 37, name: "trompe l'oeil pistache", img: 'images/pat/vert.webp', price: 26, cat: 'patisserie', desc: 'pistahce', promo: false, isNew: true },
  { id: 38, name: 'Amonde', img: 'images/pat/amande.webp', price: 20, cat: 'patisserie', desc: 'Amonde', promo: false, isNew: true },
  { id: 39, name: 'Cockie framboise', img: 'images/pat/cockie.webp', price: 22, cat: 'patisserie', desc: 'framboise', promo: false, isNew: true },
  { id: 40, name: 'Cockie gateau', img: 'images/pat/cockieb.webp', price: 22, cat: 'patisserie', desc: 'gateau', promo: false, isNew: true },
  { id: 41, name: 'Cockie chocolat', img: 'images/pat/cockien.webp', price: 22, cat: 'patisserie', desc: 'chocolat', promo: false, isNew: true },
  { id: 42, name: "trompe l'oeil framboise", img: 'images/pat/fromboise.webp', price: 22, cat: 'patisserie', desc: 'Framboise', promo: false, isNew: true },
  { id: 43, name: 'tarte fruits', img: 'images/pat/fruis.webp', price: 20, cat: 'patisserie', desc: 'fruits', promo: false, isNew: true },
  { id: 44, name: "trompe l'oeil mango", img: 'images/pat/mangue.webp', price: 22, cat: 'patisserie', desc: 'mangue', promo: false, isNew: true },
  { id: 46, name: 'gateau pistache', img: 'images/pat/pistaches.webp', price: 25, cat: 'patisserie', desc: 'Pistache', promo: false, isNew: true },
  { id: 48, name: "trompe l'oeil citrouille", img: 'images/pat/tomatte.webp', price: 18, cat: 'patisserie', desc: 'citrouille', promo: false, isNew: true },
  { id: 49, name: "trompe l'oeil cacahuete", img: 'images/pat/n.webp', price: 22, cat: 'patisserie', desc: 'cacahuete', promo: false, isNew: true },
  { id: 50, name: 'MILKSHAKE CARAMEL', img: 'images/MILKSHAKE/MILKSHAKECARAMEL.webp', price: 28, cat: 'boisson', desc: 'CARAMEL', promo: false, isNew: false },
  { id: 51, name: 'MILKSHAKE KITKAT', img: 'images/MILKSHAKE/KITKAT.webp', price: 30, cat: 'boisson', desc: 'KITKAT', promo: false, isNew: false },
  { id: 52, name: 'MILKSHAKE CHOCOLAT', img: 'images/MILKSHAKE/MILKSHAKECHOCOLAT.webp', price: 28, cat: 'boisson', desc: 'CHOCOLAT', promo: false, isNew: false },
  { id: 53, name: 'MILKSHAKE FRAISE', img: 'images/MILKSHAKE/MILKSHAKEFRAISE.webp', price: 28, cat: 'boisson', desc: 'FRAISE', promo: false, isNew: false },
  { id: 54, name: 'MILKSHAKE OREO', img: 'images/MILKSHAKE/MILKSHAKEOERO.webp', price: 30, cat: 'boisson', desc: 'OREO', promo: false, isNew: false },
  { id: 55, name: 'MILKSHAKE VANILLE', img: 'images/MILKSHAKE/milkshakevanille.webp', price: 28, cat: 'boisson', desc: 'VANILLE', promo: false, isNew: false },

];

function renderProducts(cat) {
  const grid = document.getElementById('pgrid');
  if (!grid) return;
  const list = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  if (!list.length) { grid.innerHTML = '<div class="empty-st">Aucun produit dans cette catégorie.</div>'; return; }
  grid.innerHTML = list.map((p, i) => `<div class="pcard" style="animation-delay:${i * 50}ms">${p.promo ? '<div class="promo-badge">PROMO</div>' : ''}${p.isNew ? '<div class="new-badge">NOUVEAU</div>' : ''}<div class="pimg" onclick="openLB(${p.id})"><img src="${p.img}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:center;display:block;"><div class="pimg-ov"><span class="pimg-zoom">🔍</span></div></div><div class="pbody"><div class="pname">${p.name}</div><div class="pdesc">${p.desc}</div><div class="pfoot"><span class="pprice">${p.price} Dh</span><button class="padd" id="pa${p.id}" onclick="doAdd(${p.id})">+ Panier</button></div></div></div>`).join('');
}

document.querySelectorAll('.fb').forEach(b => b.addEventListener('click', function () {
  document.querySelectorAll('.fb').forEach(x => x.classList.remove('on'));
  this.classList.add('on');
  renderProducts(this.dataset.cat);
}));

function doAdd(id) {
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  addToCart({ id: p.id, name: p.name, emoji: '🎂', price: p.price, desc: p.desc });
  const btn = document.getElementById('pa' + id);
  if (btn) { btn.textContent = '✓ Ajouté'; btn.classList.add('ok'); setTimeout(() => { btn.textContent = '+ Panier'; btn.classList.remove('ok'); }, 1800); }
}

/* ── LIGHTBOX PRODUITS CORRIGÉE (IMAGE + ZOOM) ───────────── */
function closeLB() {
  const lb = document.getElementById('lb');
  if (lb) lb.classList.remove('on');
  document.body.style.overflow = '';
}

/* ── Lightbox image Menu ── */
function openMenuImg(imgEl, caption) {
  const lb   = document.getElementById('menu-img-lb');
  const big  = document.getElementById('menu-img-lb-img');
  const cap  = document.getElementById('menu-img-lb-caption');
  const src  = imgEl.src;
  big.src = src.includes('unsplash.com')
    ? src.replace(/w=\d+&h=\d+[^&]*/g, 'w=1200&h=900&fit=crop&q=90')
    : src;
  big.alt = caption;
  cap.textContent = caption;
  lb.classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeMenuImg() {
  const lb = document.getElementById('menu-img-lb');
  if (lb) lb.classList.remove('on');
  document.body.style.overflow = '';
}

function openLB(id) {
  console.log('openLB appelé avec id:', id);
  
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) {
    console.error('Produit non trouvé:', id);
    return;
  }
  
  console.log('Produit trouvé:', p.name, p.img);
  
  const lb = document.getElementById('lb');
  const lbIco = document.getElementById('lbIco');
  const lbName = document.getElementById('lbName');
  const lbDesc = document.getElementById('lbDesc');
  const lbPrice = document.getElementById('lbPrice');
  const lbAdd = document.getElementById('lbAdd');
  
  if (!lb) {
    console.error('Lightbox non trouvée');
    return;
  }
  
  // VIDER complètement le conteneur
  lbIco.innerHTML = '';
  
  // Créer un élément image propre
  const img = document.createElement('img');
  img.src = p.img;
  img.alt = p.name;
  img.style.width = '250px';
  img.style.height = '250px';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '20px';
  img.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
  img.style.display = 'block';
  img.style.margin = '0 auto';
  img.style.animation = 'zoomIn 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
  
  // Ajouter l'image au conteneur
  lbIco.appendChild(img);
  
  lbName.textContent = p.name;
  lbDesc.textContent = p.desc;
  lbPrice.textContent = p.price + ' Dh';
  lbAdd.onclick = function() { 
    doAdd(p.id); 
    closeLB(); 
  };
  
  lb.classList.add('on');
  document.body.style.overflow = 'hidden';
}

// Fermeture avec clic extérieur ou Echap
document.addEventListener('click', function(e) {
  const lb = document.getElementById('lb');
  if (lb && lb.classList.contains('on') && e.target === lb) closeLB();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeLB(); closeMenuImg(); }
});

renderProducts('all');

/* PANIER */
function renderCart() {
  const layout = document.getElementById('cartLayout');
  if (!layout) return;
  if (!cart || !cart.length) { layout.innerHTML = `<div class="cart-empty"><div class="cart-empty-ico">🛒</div><p class="cart-empty-h">Votre panier est vide</p></div>`; return; }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const qty = cart.reduce((s, i) => s + i.qty, 0);
  const items = cart.map((it, idx) => `<div class="ci" style="animation-delay:${idx * 55}ms"><div class="ci-thumb">${it.emoji || '🎂'}</div><div class="ci-info"><div class="ci-name">${it.name}</div><div class="ci-unit">${it.price} Dh / unité</div></div><div class="ci-qty"><button class="qbtn" onclick="doQty('${it.id}',-1)">−</button><span class="qnum">${it.qty}</span><button class="qbtn" onclick="doQty('${it.id}',1)">+</button></div><div class="ci-total">${it.price * it.qty} Dh</div><button class="ci-del" title="Supprimer" onclick="doDel('${it.id}')">✕</button></div>`).join('');
  const lines = cart.map(i => `<div class="csum-line"><span class="csl-label">${i.name} ×${i.qty}</span><span class="csl-val">${i.price * i.qty} Dh</span></div>`).join('');
  layout.innerHTML = `<div><div class="ci-head"><h2 class="ci-title">Articles sélectionnés</h2><span class="ci-count">${qty} article${qty > 1 ? 's' : ''}</span></div>${items}</div><aside class="csummary"><div class="csum-title">Résumé de commande</div>${lines}<hr class="csum-sep"><div class="csum-total"><span class="cst-label">Total</span><span class="cst-val">${total} Dh</span></div><form class="oform" onsubmit="return false"><div class="oform-header"><div class="oform-ornament">✦</div><div class="oform-title">Informations de Livraison</div><div class="oform-subtitle">Complétez vos coordonnées pour finaliser</div></div><div class="frow"><div class="ffield"><label class="flabel">Prénom</label><div class="finput-wrap"><svg class="finput-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><input class="finput" id="fn" placeholder="Votre prénom" required><div class="finput-line"></div></div></div><div class="ffield"><label class="flabel">Nom</label><div class="finput-wrap"><svg class="finput-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><input class="finput" id="ln" placeholder="Votre nom" required><div class="finput-line"></div></div></div></div><div class="ffield"><label class="flabel">Adresse complète</label><div class="finput-wrap"><svg class="finput-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><input class="finput" id="ad" placeholder="Rue, quartier, numéro…" required><div class="finput-line"></div></div></div><div class="ffield"><label class="flabel">Téléphone WhatsApp</label><div class="finput-wrap"><svg class="finput-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg><input class="finput" id="tel" type="tel" placeholder="+212 6XX XXX XXX" required><div class="finput-line"></div></div></div><button class="wa-btn" onclick="sendWA()"><span class="wa-btn-bg"></span><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span>Envoyer ma commande</span><svg class="wa-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button><div class="oform-secure"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Commande sécurisée · Kénitra, Maroc</div></form></aside>`;
}
function doQty(id, d) { changeQty(id, d); renderCart(); }
function doDel(id) { removeFromCart(id); renderCart(); }
function sendWA() {
  const fn = document.getElementById('fn')?.value?.trim() || '';
  const ln = document.getElementById('ln')?.value?.trim() || '';
  const ad = document.getElementById('ad')?.value?.trim() || '';
  const tel = document.getElementById('tel')?.value?.trim() || '';
  if (!fn || !ln || !ad || !tel) { showToast('⚠️ Veuillez remplir tous les champs'); return; }
  if (!cart?.length) { showToast('⚠️ Votre panier est vide'); return; }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = cart.map(i => `• ${i.name} ×${i.qty} = ${i.price * i.qty} Dh`).join('%0A');
  const msg = `🎂 *COMMANDE — MONDE GOURMAND*%0A%0A👤 *Client :* ${fn} ${ln}%0A📍 *Adresse :* ${ad}%0A📞 *Tél :* ${tel}%0A%0A🛒 *Produits :*%0A${lines}%0A%0A💰 *TOTAL : ${total} Dh*%0A%0AMerci de confirmer ma commande 🙏`;
  window.open(`https://wa.me/212663787499?text=${msg}`, '_blank');
  showConfirmPopup();
}

/* ── POP-UP DE CONFIRMATION (délai 48h) ─────────────────── */
function showConfirmPopup() {
  const p = document.getElementById('confirmPopup');
  if (p) p.classList.add('on');
}
function closeConfirmPopup() {
  const p = document.getElementById('confirmPopup');
  if (p) p.classList.remove('on');
}

/* ── RÉSERVATION D'ÉVÉNEMENT (page À propos) ────────────── */
function sendReservationWA() {
  const nom = document.getElementById('rNom')?.value?.trim() || '';
  const tel = document.getElementById('rTel')?.value?.trim() || '';
  const date = document.getElementById('rDate')?.value || '';
  const heure = document.getElementById('rHeure')?.value || '';
  const type = document.getElementById('rType')?.value || '';
  const prsn = document.getElementById('rPrsn')?.value || '';
  const table = document.getElementById('rTable')?.value?.trim() || '';
  if (!nom || !tel || !date || !heure || !type || !prsn) { showToast('⚠️ Veuillez remplir tous les champs'); return; }
  const dateFmt = new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const msg = `🎉 *RÉSERVATION ÉVÉNEMENT — MONDE GOURMAND*%0A%0A👤 *Nom :* ${nom}%0A📞 *Tél :* ${tel}%0A📅 *Date :* ${dateFmt}%0A🕐 *Heure :* ${heure}%0A🎊 *Type d'événement :* ${type}%0A👥 *Nombre de personnes :* ${prsn}%0A🍽️ *Table souhaitée :* ${table || 'À définir'}%0A%0AMerci de confirmer ma réservation 🙏`;
  window.open(`https://wa.me/212663787499?text=${msg}`, '_blank');
  showToast('✓ Réservation envoyée par WhatsApp');
}
renderCart();

/* SPA PAGE NAVIGATION */
function showPage(id) {
  const pages = ['home', 'about', 'gateau', 'menu', 'panier', 'wheel'];
  const curtain = document.getElementById('page-curtain');
  const current = pages.find(p => { const el = document.getElementById('page-' + p); return el && el.classList.contains('active'); });
  if (current === id) return;
  if (curtain) { curtain.classList.add('flash'); setTimeout(() => curtain.classList.remove('flash'), 200); }
  if (current) { const outEl = document.getElementById('page-' + current); if (outEl) { outEl.classList.add('leaving'); outEl.classList.remove('active'); setTimeout(() => outEl.classList.remove('leaving'), 300); } }
  setTimeout(() => {
    pages.forEach(p => { const el = document.getElementById('page-' + p); if (!el) return; if (p === id) { el.classList.add('active'); el.classList.remove('leaving'); } else { el.classList.remove('active'); } });
    pages.forEach(p => { const link = document.getElementById('nav-' + p); if (link) link.classList.toggle('on', p === id); });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 'gateau') renderProducts('all');
    if (id === 'panier') renderCart();
    if (id === 'menu') { setTimeout(doReveal, 100); }
    if (id === 'home') { showSpread(-1); document.querySelectorAll('.bnav-btn').forEach((btn, i) => btn.addEventListener('click', () => showSpread(i))); }
    if (id === 'wheel') { setTimeout(() => { if (typeof initWheel === 'function') initWheel(); else window._pendingWheelInit = true; setTimeout(doReveal, 100); }, 50); }
  }, 150);
}

/* ENHANCED GALLERY LIGHTBOX */
(function () {
  const GALLERY_ITEMS = document.querySelectorAll('#gTrack .gi');
  const GALLERY_DATA = Array.from(GALLERY_ITEMS).map(gi => ({ img: gi.querySelector('.gi-bg img')?.src || '', label: gi.querySelector('.gi-lbl')?.textContent?.trim() || '' }));
  let glbIdx = 0, touchStartX = 0;
  function buildGLB() {
    if (document.getElementById('glb')) return;
    const div = document.createElement('div'); div.id = 'glb';
    div.innerHTML = `<button class="glb-close" onclick="closeGLB()">✕</button><div class="glb-counter" id="glbCounter"></div><button class="glb-arrow prev" id="glbPrev" onclick="glbNav(-1)">←</button><div class="glb-stage"><img class="glb-real-img" id="glbImg" src=""><div class="glb-label" id="glbLabel"></div><div class="glb-gradient"></div><div class="glb-meta" id="glbMeta">Notre Galerie Gourmande</div></div><button class="glb-arrow next" id="glbNext" onclick="glbNav(1)">→</button><div class="glb-dots" id="glbDots"></div><div class="glb-swipe-hint">← Swipe ou touches fléchées →</div>`;
    document.body.appendChild(div);
    document.getElementById('glbPrev')?.addEventListener('click', () => glbNav(-1));
    document.getElementById('glbNext')?.addEventListener('click', () => glbNav(1));
    div.addEventListener('click', e => { if (e.target === div) closeGLB(); });
  }
  function updateDots() { const dots = document.getElementById('glbDots'); if (!dots) return; dots.innerHTML = ''; for (let i = 0; i < GALLERY_DATA.length; i++) { const d = document.createElement('div'); d.className = 'glb-dot' + (i === glbIdx ? ' on' : ''); d.onclick = () => { glbIdx = i; renderGLB(); }; dots.appendChild(d); } }
  function renderGLB() { const it = GALLERY_DATA[glbIdx]; document.getElementById('glbImg').src = it.img; document.getElementById('glbLabel').textContent = it.label; document.getElementById('glbCounter').textContent = `${glbIdx + 1} / ${GALLERY_DATA.length}`; document.querySelectorAll('.glb-dot').forEach((d, i) => d.classList.toggle('on', i === glbIdx)); }
  window.openGLB = function (idx) { buildGLB(); glbIdx = idx; renderGLB(); updateDots(); document.getElementById('glb').classList.add('on'); document.body.style.overflow = 'hidden'; };
  window.closeGLB = function () { const el = document.getElementById('glb'); if (el) el.classList.remove('on'); document.body.style.overflow = ''; };
  window.glbNav = function (dir) { glbIdx = (glbIdx + dir + GALLERY_DATA.length) % GALLERY_DATA.length; renderGLB(); updateDots(); };
  document.addEventListener('keydown', e => { if (document.getElementById('glb')?.classList.contains('on')) { if (e.key === 'ArrowRight') glbNav(1); if (e.key === 'ArrowLeft') glbNav(-1); if (e.key === 'Escape') closeGLB(); } });
  document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => { if (document.getElementById('glb')?.classList.contains('on')) { const diff = touchStartX - e.changedTouches[0].clientX; if (Math.abs(diff) > 50) glbNav(diff > 0 ? 1 : -1); } }, { passive: true });
  setTimeout(() => { document.querySelectorAll('#gTrack .gi').forEach((el, i) => { el.style.cursor = 'zoom-in'; el.onclick = () => openGLB(i); }); }, 500);
})();

/* CARROUSEL 3D */
(function () {
  const container = document.getElementById('carousel3d');
  if (!container) return;
  const cards = document.querySelectorAll('.carousel-card');
  const total = cards.length;
  if (total === 0) return;
  let currentAngle = 0, isDragging = false, startX = 0, startAngle = 0, autoTimer = null;
  const angleStep = 360 / total;
  function getRadius() { return Math.min(320, window.innerWidth * 0.42); }
  function update() { const radius = getRadius(); cards.forEach((card, i) => { const angle = currentAngle + i * angleStep; const rad = (angle * Math.PI) / 180; const x = Math.sin(rad) * radius; const z = Math.cos(rad) * radius; card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)`; }); }
  function startAuto() { if (autoTimer) clearInterval(autoTimer); autoTimer = setInterval(() => { if (!isDragging) { currentAngle = (currentAngle - 1) % 360; update(); } }, 40); }
  container.addEventListener('mousedown', (e) => { isDragging = true; startX = e.clientX; startAngle = currentAngle; container.style.cursor = 'grabbing'; });
  window.addEventListener('mousemove', (e) => { if (!isDragging) return; const delta = (e.clientX - startX) * 1.2; currentAngle = startAngle + delta; update(); });
  window.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; container.style.cursor = 'grab'; } });
  document.getElementById('carouselPrev3d')?.addEventListener('click', () => { currentAngle = (currentAngle + angleStep) % 360; update(); });
  document.getElementById('carouselNext3d')?.addEventListener('click', () => { currentAngle = (currentAngle - angleStep) % 360; update(); });
  container.addEventListener('touchstart', (e) => { isDragging = true; startX = e.touches[0].clientX; startAngle = currentAngle; });
  window.addEventListener('touchmove', (e) => { if (!isDragging) return; const delta = (e.touches[0].clientX - startX) * 1.2; currentAngle = startAngle + delta; update(); });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('resize', update);
  update(); startAuto();
})();

/* MENU FLOTTANT PAPIER */
(function () {
  const btn = document.getElementById('floatingPaperBtn');
  const overlay = document.getElementById('flyingPaperOverlay');
  const inner = document.getElementById('flyingPaperInner');
  const closeBtn = document.getElementById('closePaperBtn');
  if (!btn || !overlay) return;
  window.closeFlyingPaper = function () { overlay.style.display = 'none'; document.body.style.overflow = ''; };
  function openPaper() { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; setTimeout(() => { if (inner) inner.style.transform = 'translateY(0)'; }, 10); }
  btn.addEventListener('click', openPaper);
  if (closeBtn) closeBtn.addEventListener('click', closeFlyingPaper);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeFlyingPaper(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.style.display === 'flex') closeFlyingPaper(); });
})();

/* WHEEL PAGE LOGIC */
(function () {
  const WHEEL_TRANS = { fr: { 'wheel': 'La Roue', 'wheel-tag': 'Jouez & Gagnez', 'wheel-concept-tag': 'Comment ça marche ?', 'wheel-concept-h': 'Tentez votre chance !', 'wheel-concept-p': "Faites tourner la roue et découvrez votre surprise gourmande du jour ! Chaque tour est une opportunité de gagner une réduction, un dessert offert ou une surprise exclusive. Présentez votre résultat lors de votre prochaine commande !", 'wb1': 'Cadeaux réels', 'wb2': '1 tour / jour', 'wb3': 'Surprises exclusives', 'prizes-tag': 'Ce que vous pouvez gagner', 'prizes-h': 'Les Récompenses', 'wheel-spin': 'Faire tourner la roue', 'result-sub': 'Présentez ce résultat en boutique 🎉' }, en: { 'wheel': 'Wheel', 'wheel-tag': 'Play & Win', 'wheel-concept-tag': 'How does it work?', 'wheel-concept-h': 'Try your luck!', 'wheel-concept-p': "Spin the wheel and discover your sweet surprise of the day! Every spin is a chance to win a discount, a free dessert or an exclusive treat. Present your result on your next order!", 'wb1': 'Real gifts', 'wb2': '1 spin / day', 'wb3': 'Exclusive surprises', 'prizes-tag': 'What you can win', 'prizes-h': 'The Rewards', 'wheel-spin': 'Spin the wheel', 'result-sub': 'Show this result in store 🎉' } };
  const _origApplyLang = window.applyLang;
  window.applyLang = function (l) { if (_origApplyLang) _origApplyLang(l); const t = WHEEL_TRANS[l] || WHEEL_TRANS.fr; Object.keys(t).forEach(k => document.querySelectorAll('[data-t="' + k + '"]').forEach(el => el.textContent = t[k])); window._wheelLang = l; };
  const WHEEL_PRIZES = [{ text: '5% de réduction', textEn: '5% Discount', color: '#CBA135', emoji: '🎟️', sub: 'Sur votre prochaine commande', isWin: true }, { text: '10% de réduction', textEn: '10% Off', color: '#A47149', emoji: '💫', sub: 'Valable 7 jours', isWin: true }, { text: 'Café gratuit', textEn: 'Free Coffee ☕', color: '#6F4E37', emoji: '☕', sub: '1 café ou thé au choix', isWin: true }, { text: 'Dessert gratuit', textEn: 'Free Dessert 🍰', color: '#D9A441', emoji: '🍰', sub: 'Au choix sur la carte', isWin: true }, { text: 'Dessert gratuit', textEn: 'Free Dessert 🍰', color: '#B5651D', emoji: '🍰', sub: 'Au choix sur la carte', isWin: true }, { text: 'Essayez encore', textEn: 'Try again 😅', color: '#888', emoji: '🍀', sub: 'La chance sourit aux audacieux !', isWin: false }, { text: 'prochaine fois', textEn: 'Next time', color: '#8B5E3C', emoji: '☕', sub: 'Valable aujourd\'hui seulement', isWin: true }, { text: 'Boisson offerte', textEn: 'Free Drink 🧋', color: '#A0522D', emoji: '🧋', sub: 'Boisson froide ou chaude', isWin: true }];
  // Poids en % pour chaque case de WHEEL_PRIZES (même ordre, doit sommer à 100).
  // Ici : index 5 ("Essayez encore") = 93%, les 7 autres se partagent 1% chacun.
  const WHEEL_WEIGHTS = [10, 10, 10, 10, 10, 30, 10, 10];
  function pickWeightedIndex(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      if (r < weights[i]) return i;
      r -= weights[i];
    }
    return weights.length - 1;
  }
  let audioCtx = null;
  function getAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
  function playTick() { try { const ctx = getAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.setValueAtTime(600, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04); g.gain.setValueAtTime(0.18, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06); o.start(); o.stop(ctx.currentTime + 0.07); } catch (e) { } }
  function playWinSound() { try { const ctx = getAudio(); [523, 659, 784, 1047].forEach((freq, i) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = 'sine'; o.frequency.value = freq; const start = ctx.currentTime + i * 0.12; g.gain.setValueAtTime(0, start); g.gain.linearRampToValueAtTime(0.22, start + 0.04); g.gain.exponentialRampToValueAtTime(0.001, start + 0.3); o.start(start); o.stop(start + 0.35); }); } catch (e) { } }
  function playLoseSound() { try { const ctx = getAudio(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = 'sawtooth'; o.frequency.setValueAtTime(300, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4); g.gain.setValueAtTime(0.12, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45); o.start(); o.stop(ctx.currentTime + 0.5); } catch (e) { } }
  function launchConfetti() { const canvas = document.getElementById('confettiCanvas'); if (!canvas) return; const ctx2 = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight; canvas.style.display = 'block'; const COLORS = ['#CBA135', '#D9A441', '#e05252', '#f5c07a', '#6F4E37', '#fff', '#ffd080', '#B5651D']; const pieces = Array.from({ length: 120 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height, r: 4 + Math.random() * 7, d: 1 + Math.random() * 3, color: COLORS[Math.floor(Math.random() * COLORS.length)], tilt: Math.random() * 10 - 10, tiltAngle: 0, tiltSpeed: 0.1 + Math.random() * 0.1, shape: Math.random() > 0.5 ? 'rect' : 'circle', rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 6 })); let frame = 0; function draw() { ctx2.clearRect(0, 0, canvas.width, canvas.height); pieces.forEach(p => { ctx2.save(); ctx2.translate(p.x, p.y); ctx2.rotate((p.rot * Math.PI) / 180); ctx2.fillStyle = p.color; ctx2.globalAlpha = 0.9; if (p.shape === 'circle') { ctx2.beginPath(); ctx2.arc(0, 0, p.r, 0, 2 * Math.PI); ctx2.fill(); } else { ctx2.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); } ctx2.restore(); p.y += p.d; p.x += Math.sin(frame / 20) * 1.5; p.rot += p.rotSpeed; p.tiltAngle += p.tiltSpeed; p.tilt = Math.sin(p.tiltAngle) * 12; if (p.y > canvas.height + 20) p.y = -10; }); frame++; if (frame < 220) requestAnimationFrame(draw); else { ctx2.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; } } draw(); }
  function initCounter() { const el = document.getElementById('wheelCounter'); if (!el) return; let base = parseInt(localStorage.getItem('mgWheelCount') || '0') + Math.floor(Math.random() * 3 + 1); el.textContent = '👉 +' + base + ' clients ont gagné aujourd\'hui'; }
  function bumpCounter() { const el = document.getElementById('wheelCounter'); if (!el) return; let n = parseInt(el.textContent.replace(/\D/g, '')) || 17; n++; localStorage.setItem('mgWheelCount', n); el.textContent = '👉 +' + n + ' clients ont gagné aujourd\'hui'; el.classList.remove('counter-pulse'); void el.offsetWidth; el.classList.add('counter-pulse'); }
  let wheelBuilt = false;
  function initWheel() { const wheel = document.querySelector('#page-wheel .deal-wheel'); if (!wheel) return; const spinner = wheel.querySelector('.spinner'); const trigger = wheel.querySelector('.btn-spin'); const ticker = wheel.querySelector('.ticker'); if (!spinner || !trigger || !ticker) return; if (!wheelBuilt) { wheelBuilt = true; const prizeSlice = 360 / WHEEL_PRIZES.length; const prizeOffset = Math.floor(180 / WHEEL_PRIZES.length); const spinnerStyles = window.getComputedStyle(spinner); let tickerAnim, rotation = 0, currentSlice = 0, prizeNodes, spinStartTime = 0; let spinSoundInterval = null; spinner.setAttribute('style', `background: conic-gradient(from -90deg, ${WHEEL_PRIZES.map(({ color }, i) => `${color} 0 ${(100 / WHEEL_PRIZES.length) * (WHEEL_PRIZES.length - i)}%`).reverse()});`); WHEEL_PRIZES.forEach(({ text }, i) => { spinner.insertAdjacentHTML('beforeend', `<li class="prize" style="--rotate:${((prizeSlice * i) * -1) - prizeOffset}deg"><span class="text">${text}</span></li>`); }); prizeNodes = wheel.querySelectorAll('.prize'); const grid = document.getElementById('prizesGrid'); if (grid) { grid.innerHTML = ''; WHEEL_PRIZES.forEach(p => { const c = document.createElement('div'); c.className = 'prize-card'; c.innerHTML = `<div class="prize-card-color" style="background:${p.color}"></div><div class="prize-card-text">${p.emoji} ${p.text}</div>`; grid.appendChild(c); }); } initCounter(); function spinertia(min, max) { return Math.floor(Math.random() * (max - min + 1)) + Math.ceil(min); } function stopSpinSound() { if (spinSoundInterval) { clearInterval(spinSoundInterval); spinSoundInterval = null; } } function startSpinSound(durationMs) { stopSpinSound(); let elapsed = 0, interval = 80; spinSoundInterval = setInterval(() => { playTick(); elapsed += interval; if (elapsed < durationMs * 0.4) { interval = Math.max(30, interval - 4); } else if (elapsed > durationMs * 0.7) { interval = Math.min(300, interval + 18); } if (elapsed >= durationMs) { stopSpinSound(); } }, interval); } function runTicker() { const vals = spinnerStyles.transform.split('(')[1].split(')')[0].split(','); let rad = Math.atan2(+vals[1], +vals[0]); if (rad < 0) rad += 2 * Math.PI; const angle = Math.round(rad * (180 / Math.PI)); const slice = Math.floor(angle / prizeSlice); if (currentSlice !== slice) { ticker.style.animation = 'none'; setTimeout(() => ticker.style.animation = null, 10); currentSlice = slice; if (navigator.vibrate) navigator.vibrate(8); } tickerAnim = requestAnimationFrame(runTicker); } function selectPrize() { const idx = Math.floor(rotation / prizeSlice); const prize = WHEEL_PRIZES[idx]; prizeNodes[idx].classList.add('selected'); const lang = window._wheelLang || 'fr'; const t = WHEEL_TRANS[lang] || WHEEL_TRANS.fr; const txt = lang === 'en' ? (prize.textEn || prize.text) : prize.text; const ri = document.getElementById('wheelResultInner'); if (ri) { ri.innerHTML = `<span class="result-emoji">${prize.emoji}</span><span class="result-prize">${txt}</span><div class="result-sub">${prize.sub} — ${t['result-sub']}</div>`; ri.classList.add('visible'); if (prize.isWin) ri.classList.add('win'); else ri.classList.remove('win'); } if (prize.isWin) { playWinSound(); launchConfetti(); bumpCounter(); if (navigator.vibrate) navigator.vibrate([60, 30, 60, 30, 120]); } else { playLoseSound(); if (navigator.vibrate) navigator.vibrate([200]); } } trigger.addEventListener('click', () => { try { if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) { } trigger.disabled = true; const ri = document.getElementById('wheelResultInner'); if (ri) { ri.classList.remove('visible', 'win'); } const spinDuration = 8000; spinStartTime = Date.now(); const targetIdx = pickWeightedIndex(WHEEL_WEIGHTS); const sliceStart = targetIdx * prizeSlice; const margin = prizeSlice * 0.15; const withinSlice = margin + Math.random() * (prizeSlice - 2 * margin); const extraTurns = 360 * spinertia(6, 10); rotation = extraTurns + sliceStart + withinSlice; prizeNodes.forEach(p => p.classList.remove('selected')); wheel.classList.add('is-spinning'); spinner.style.setProperty('--rotate', rotation); ticker.style.animation = 'none'; runTicker(); startSpinSound(spinDuration); }); spinner.addEventListener('transitionend', () => { cancelAnimationFrame(tickerAnim); stopSpinSound(); trigger.disabled = false; trigger.focus(); rotation %= 360; selectPrize(); wheel.classList.remove('is-spinning'); spinner.style.setProperty('--rotate', rotation); }); } }
  window.initWheel = initWheel;
  if (window._pendingWheelInit) { window._pendingWheelInit = false; initWheel(); }
  if (document.getElementById('page-wheel')?.classList.contains('active')) initWheel();
})();

/* FALLBACK VIDEO */
(function () {
  const video = document.querySelector('.hero-video');
  if (video) {
    video.addEventListener('error', function () { console.log('Vidéo non trouvée, fallback sur image'); const heroBg = document.querySelector('.hero-bg'); if (heroBg) heroBg.style.display = 'block'; });
    video.addEventListener('loadeddata', function () { const heroBg = document.querySelector('.hero-bg'); if (heroBg) heroBg.style.display = 'none'; });
  }
})();

/* ══════════════════════════════════════════════════════════
     BOUTON "SCELLÉ À LA CIRE" - ANIMATION LUXUEUSE
     ══════════════════════════════════════════════════════════ */
(function() {
  const waxSeal = document.createElement('div');
  waxSeal.className = 'wax-seal';
  const waxRibbon = document.createElement('div');
  waxRibbon.className = 'wax-ribbon';
  document.body.appendChild(waxSeal);
  document.body.appendChild(waxRibbon);

  let sealAudioCtx = null;
  function playSealSound() {
    try {
      if (!sealAudioCtx) sealAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (sealAudioCtx.state === 'suspended') sealAudioCtx.resume();
      const now = sealAudioCtx.currentTime;
      const gain = sealAudioCtx.createGain();
      gain.connect(sealAudioCtx.destination);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      
      const bufferSize = 4096;
      const noiseNode = sealAudioCtx.createScriptProcessor(bufferSize, 1, 1);
      noiseNode.onaudioprocess = function(e) {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.3;
        }
      };
      const lowpass = sealAudioCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 400;
      lowpass.Q.value = 1;
      noiseNode.connect(lowpass);
      lowpass.connect(gain);
      noiseNode.connect(sealAudioCtx.destination);
      setTimeout(() => { try { noiseNode.disconnect(); } catch(e) {} }, 500);
    } catch(e) {}
  }

  window.showWaxSeal = function(x, y) {
    waxSeal.style.left = (x - 40) + 'px';
    waxSeal.style.top = (y - 40) + 'px';
    waxRibbon.style.left = (x - 15) + 'px';
    waxRibbon.style.top = (y - 20) + 'px';
    waxSeal.classList.remove('show');
    waxRibbon.classList.remove('show');
    void waxSeal.offsetWidth;
    waxSeal.classList.add('show');
    waxRibbon.classList.add('show');
    
    setTimeout(() => {
      waxSeal.classList.remove('show');
      waxRibbon.classList.remove('show');
    }, 800);
  };

  function hookWaxSealOnAddButtons() {
    document.querySelectorAll('.padd').forEach(btn => {
      if (btn.hasAttribute('data-wax-hooked')) return;
      btn.setAttribute('data-wax-hooked', 'true');
      const originalOnclick = btn.onclick;
      btn.onclick = function(e) {
        const rect = btn.getBoundingClientRect();
        showWaxSeal(rect.left + rect.width / 2, rect.top + rect.height / 2);
        if (originalOnclick) originalOnclick.call(btn, e);
      };
    });
  }

  const observer = new MutationObserver(hookWaxSealOnAddButtons);
  const pgrid = document.getElementById('pgrid');
  if (pgrid) observer.observe(pgrid, { childList: true, subtree: true });
  setTimeout(hookWaxSealOnAddButtons, 500);
})();

/* ══════════════════════════════════════════════════════════
     SIGNATURE LIQUIDE DORÉE (PLUME CALLIGRAPHIQUE)
     ══════════════════════════════════════════════════════════ */
(function() {
  let signatureCanvas = null;
  let signatureCtx = null;
  let signaturePoints = [];
  let signatureInterval = null;
  
  function initSignatureCanvas() {
    if (signatureCanvas) return;
    signatureCanvas = document.createElement('canvas');
    signatureCanvas.className = 'signature-canvas';
    signatureCanvas.width = window.innerWidth;
    signatureCanvas.height = window.innerHeight;
    signatureCtx = signatureCanvas.getContext('2d');
    document.body.appendChild(signatureCanvas);
  }
  
  function clearSignature() {
    if (!signatureCtx || !signatureCanvas) return;
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    signaturePoints = [];
  }
  
  function drawSignaturePath() {
    if (!signatureCtx || !signatureCanvas || signaturePoints.length < 2) return;
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    for (let i = 0; i < signaturePoints.length - 1; i++) {
      const p1 = signaturePoints[i];
      const p2 = signaturePoints[i + 1];
      const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const steps = Math.max(10, Math.floor(distance / 3));
      for (let step = 0; step <= steps; step++) {
        const t = step / steps;
        const x = p1.x * (1 - t) + p2.x * t;
        const y = p1.y * (1 - t) + p2.y * t;
        const progress = i / signaturePoints.length;
        const opacity = Math.sin(progress * Math.PI) * 0.7;
        const size = 8 * (1 - progress * 0.5);
        const gradient = signatureCtx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `rgba(212, 175, 106, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(240, 208, 128, ${opacity * 0.7})`);
        gradient.addColorStop(1, 'rgba(212, 175, 106, 0)');
        signatureCtx.beginPath();
        signatureCtx.arc(x, y, size / 2, 0, Math.PI * 2);
        signatureCtx.fillStyle = gradient;
        signatureCtx.fill();
      }
    }
  }
  
  const signatureLetterPoints = [
    { x: 0, y: 0 }, { x: 20, y: -15 }, { x: 40, y: -15 }, { x: 60, y: -15 },
    { x: 80, y: -15 }, { x: 100, y: -15 }, { x: 110, y: -10 }, { x: 130, y: -15 },
    { x: 150, y: -15 }, { x: 170, y: -15 }, { x: 190, y: -15 }, { x: 210, y: -15 },
    { x: 230, y: -15 }, { x: 250, y: -15 }
  ];
  
  let currentSigStep = 0;
  let startSigX = 0, startSigY = 0;
  
  function startSignature(targetX, targetY) {
    if (signatureInterval) clearInterval(signatureInterval);
    clearSignature();
    currentSigStep = 0;
    startSigX = targetX;
    startSigY = targetY;
    signaturePoints = [];
    signatureInterval = setInterval(() => {
      if (currentSigStep >= signatureLetterPoints.length) {
        clearInterval(signatureInterval);
        signatureInterval = null;
        setTimeout(() => {
          let fadeStep = 1;
          const fadeInterval = setInterval(() => {
            if (fadeStep <= 0) { clearInterval(fadeInterval); clearSignature(); }
            else { if (signatureCtx) { signatureCtx.globalAlpha = fadeStep; drawSignaturePath(); signatureCtx.globalAlpha = 1; } fadeStep -= 0.05; }
          }, 50);
        }, 2000);
        return;
      }
      const ratio = currentSigStep / (signatureLetterPoints.length - 1);
      const easeOut = 1 - Math.pow(1 - ratio, 2);
      const point = signatureLetterPoints[currentSigStep];
      const px = startSigX + point.x * easeOut;
      const py = startSigY + point.y * easeOut - 20;
      signaturePoints.push({ x: px, y: py });
      drawSignaturePath();
      currentSigStep++;
    }, 35);
  }
  
  function stopSignature() {
    if (signatureInterval) { clearInterval(signatureInterval); signatureInterval = null; }
    setTimeout(() => clearSignature(), 800);
  }
  
  const logoElement = document.querySelector('.logo');
  if (logoElement) {
    logoElement.addEventListener('mouseenter', (e) => {
      const rect = logoElement.getBoundingClientRect();
      startSignature(rect.left + rect.width / 2 - 120, rect.top + rect.height / 2 + 10);
    });
    logoElement.addEventListener('mouseleave', () => stopSignature());
  }
  
  window.addEventListener('resize', () => {
    if (signatureCanvas) { signatureCanvas.width = window.innerWidth; signatureCanvas.height = window.innerHeight; }
  });
  initSignatureCanvas();
})();

console.log('✅ Script chargé - ' + PRODUCTS.length + ' produits disponibles');