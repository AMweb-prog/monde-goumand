/* ============================================================
   MONDE GOURMAND — script.js (COMPLET ET CORRIGÉ)
   ============================================================ */

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
    $ham.setAttribute('aria-expanded', String(on));
    $ham.setAttribute('aria-label', on ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = on ? 'hidden' : '';
  });
}
function closeMob() {
  if ($mobNav) $mobNav.classList.remove('on');
  if ($ham) {
    $ham.classList.remove('on');
    $ham.setAttribute('aria-expanded', 'false');
    $ham.setAttribute('aria-label', 'Ouvrir le menu');
  }
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
  if (ex) {
    ex.qty++;
    if (p.img && !ex.img) ex.img = p.img;
  }
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

const mgDb = window.createMGClient ? window.createMGClient() : null;
function mgHasSupabase() { return Boolean(mgDb); }
function mgEsc(value) {
  return String(value ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function mgProductId(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
async function mgInsert(table, payload) {
  if (!mgHasSupabase()) return { skipped: true };
  const { error } = await mgDb.from(table).insert(payload);
  if (error) {
    console.warn('Supabase insert failed:', error.message);
    return { error };
  }
  return { ok: true };
}

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
document.querySelectorAll('.faq-q').forEach((btn, index) => {
  const panel = btn.nextElementSibling;
  const panelId = `faq-answer-${index + 1}`;
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', panelId);
  if (panel) {
    panel.id = panelId;
    panel.setAttribute('role', 'region');
  }
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* GALLERY CARROUSEL */
(function () {
  const track = document.getElementById('gTrack');
  const dotsEl = document.getElementById('gDots');
  const btnP = document.getElementById('gPrev');
  const btnN = document.getElementById('gNext');
  if (!track) return;
  let items = [], cur = 0, timer, scrollTimer, programmaticTimer, isProgrammatic = false;

  function buildPages() {
    items = Array.from(track.querySelectorAll('.gi'));
    if (!items.length) return;
    cur = Math.min(cur, items.length - 1);
    renderDots();
    syncCurrent();
  }

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    items.forEach((item, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'g-dot' + (i === cur ? ' on' : '');
      d.setAttribute('aria-label', `Afficher la création ${i + 1}`);
      d.onclick = () => go(i);
      dotsEl.appendChild(d);
    });
  }

  function syncCurrent() {
    dotsEl?.querySelectorAll('.g-dot').forEach((d, i) => d.classList.toggle('on', i === cur));
    dotsEl?.style.setProperty('--gallery-progress', `${((cur + 1) / Math.max(items.length, 1)) * 100}%`);
    items.forEach((item, i) => item.setAttribute('aria-current', i === cur ? 'true' : 'false'));
  }

  function go(idx, animate = true) {
    if (!items.length) return;
    cur = (idx + items.length) % items.length;
    const target = Math.max(0, Math.min(
      items[cur].offsetLeft - (track.clientWidth - items[cur].offsetWidth) / 2,
      track.scrollWidth - track.clientWidth
    ));
    isProgrammatic = true;
    clearTimeout(programmaticTimer);
    track.scrollTo({ left: target, behavior: animate ? 'smooth' : 'auto' });
    programmaticTimer = setTimeout(() => { isProgrammatic = false; }, animate ? 750 : 0);
    syncCurrent();
  }

  function next() { go(cur + 1); }
  function prev() { go(cur - 1); }
  btnN && btnN.addEventListener('click', () => { next(); reset(); });
  btnP && btnP.addEventListener('click', () => { prev(); reset(); });
  function start() { if (!timer && track.offsetWidth > 0 && items.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(next, 4200); }
  function stop() { clearInterval(timer); timer = null; }
  function reset() { stop(); start(); }
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  track.addEventListener('focusin', stop);
  track.addEventListener('focusout', start);
  track.addEventListener('scroll', () => {
    if (isProgrammatic) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const center = track.scrollLeft + track.clientWidth / 2;
      cur = items.reduce((best, item, i) => Math.abs(item.offsetLeft + item.offsetWidth / 2 - center) < Math.abs(items[best].offsetLeft + items[best].offsetWidth / 2 - center) ? i : best, 0);
      syncCurrent();
    }, 80);
  }, { passive: true });
  window.addEventListener('resize', () => { clearTimeout(window._mgGalleryResize); window._mgGalleryResize = setTimeout(buildPages, 150); });
  window.refreshGallery = () => { cur = 0; buildPages(); reset(); };
  buildPages();
  start();
})();

/* ── PRODUCTS ────────────────────────────────────────────── */
let PRODUCTS = [];
let activeProductCat = 'all';
let catalogueLoaded = false;
let catalogueLoading = false;
let catalogueError = false;

function mgCategoryKey(value) {
  return String(value || '').trim().toLocaleLowerCase('fr');
}

function renderProductFilters(categories, products) {
  const bar = document.getElementById('filtersBar');
  if (!bar) return;

  const configured = (categories || [])
    .filter(category => category.collection === 'gateau' && category.is_active !== false)
    .sort((a, b) => Number(a.sort_order || 100) - Number(b.sort_order || 100));
  const seen = new Set();
  const names = [];

  configured.forEach(category => {
    const name = String(category.name || '').trim();
    const key = mgCategoryKey(name);
    if (name && !seen.has(key)) {
      seen.add(key);
      names.push(name);
    }
  });

  // Keep products visible even when their category has not yet been configured.
  (products || []).forEach(product => {
    const name = String(product.cat || '').trim();
    const key = mgCategoryKey(name);
    if (name && !seen.has(key)) {
      seen.add(key);
      names.push(name);
    }
  });

  bar.style.display = names.length ? '' : 'none';
  if (!names.length) {
    bar.innerHTML = '';
    activeProductCat = 'all';
    return;
  }
  const activeKey = mgCategoryKey(activeProductCat);
  const activeExists = activeProductCat === 'all' || names.some(name => mgCategoryKey(name) === activeKey);
  if (!activeExists) activeProductCat = 'all';

  bar.innerHTML = [
    `<button class="fb ${activeProductCat === 'all' ? 'on' : ''}" data-cat="all" aria-pressed="${activeProductCat === 'all'}">${lang === 'en' ? 'All' : 'Tous'}</button>`,
    ...names.map(name => {
      const isActive = mgCategoryKey(name) === mgCategoryKey(activeProductCat);
      return `<button class="fb ${isActive ? 'on' : ''}" data-cat="${mgEsc(name)}" aria-pressed="${isActive}">${mgEsc(name)}</button>`;
    })
  ].join('');
}

const productFiltersBar = document.getElementById('filtersBar');
if (productFiltersBar) {
  productFiltersBar.addEventListener('click', event => {
    const button = event.target.closest('.fb');
    if (!button || !productFiltersBar.contains(button)) return;
    productFiltersBar.querySelectorAll('.fb').forEach(item => {
      item.classList.remove('on');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('on');
    button.setAttribute('aria-pressed', 'true');
    renderProducts(button.dataset.cat);
  });
}

function doAdd(id) {
  const p = PRODUCTS.find(x => String(x.id) === String(id)); if (!p) return;
  addToCart({ id: p.id, name: p.name, img: p.img, price: p.price, desc: p.desc });
  const btn = document.getElementById('pa' + id);
  if (btn) { btn.textContent = '✓ Ajouté'; btn.classList.add('ok'); setTimeout(() => { btn.textContent = '+ Panier'; btn.classList.remove('ok'); }, 1800); }
}

/* ── LIGHTBOX PRODUITS CORRIGÉE (IMAGE + ZOOM) ───────────── */
function renderProducts(cat) {
  const grid = document.getElementById('pgrid');
  if (!grid) return;
  activeProductCat = cat || activeProductCat || 'all';
  const list = activeProductCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => mgCategoryKey(p.cat) === mgCategoryKey(activeProductCat));
  if (!list.length) {
    grid.innerHTML = `<p class="catalogue-status" role="status">${activeProductCat === 'all' ? 'Aucun produit disponible pour le moment.' : 'Aucun produit dans cette catégorie.'}</p>`;
    return;
  }
  grid.innerHTML = list.map((p, i) => {
    const id = mgProductId(p.id);
    return `<article class="pcard" id="product-${encodeURIComponent(id)}" style="animation-delay:${i * 50}ms">
      ${p.promo ? '<div class="promo-badge">PROMO</div>' : ''}
      ${p.isNew ? '<div class="new-badge">NOUVEAU</div>' : ''}
      <div class="pimg" role="button" tabindex="0" aria-label="Agrandir ${mgEsc(p.name)}" onclick="openLB('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openLB('${id}');}">
        <img src="${mgEsc(p.img)}" alt="${mgEsc(p.name)}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;object-position:center;display:block;">
        <div class="pimg-ov"><span class="pimg-zoom">+</span></div>
      </div>
      <div class="pbody">
        <div class="pname">${mgEsc(p.name)}</div>
        <div class="pdesc">${mgEsc(p.desc)}</div>
        <div class="pfoot">
          <span class="pprice">${mgEsc(p.price)} Dh</span>
          <button class="padd" id="pa${id}" onclick="doAdd('${id}')" aria-label="Ajouter ${mgEsc(p.name)} au panier">+ Panier</button>
        </div>
      </div>
    </article>`;
  }).join('');
}

let activeDialogTrigger = null;

function closeLB() {
  const lb = document.getElementById('lb');
  if (lb) {
    lb.classList.remove('on');
    lb.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  activeDialogTrigger?.focus?.();
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
  activeDialogTrigger = imgEl;
  lb.classList.add('on');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lb.querySelector('.menu-img-lb-close')?.focus();
}

function closeMenuImg() {
  const lb = document.getElementById('menu-img-lb');
  if (lb) {
    lb.classList.remove('on');
    lb.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  activeDialogTrigger?.focus?.();
}

function openLB(id) {
  const p = PRODUCTS.find(x => String(x.id) === String(id));
  if (!p) {
    return;
  }
  
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
  
  lbIco.innerHTML = '';
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
  
  lbIco.appendChild(img);
  
  lbName.textContent = p.name;
  lbDesc.textContent = p.desc;
  lbPrice.textContent = p.price + ' Dh';
  lbAdd.onclick = function() { 
    doAdd(p.id); 
    closeLB(); 
  };
  
  activeDialogTrigger = document.activeElement;
  lb.classList.add('on');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lb.querySelector('.lb-close')?.focus();
}

// Fermeture avec clic extérieur ou Echap
document.addEventListener('click', function(e) {
  const lb = document.getElementById('lb');
  if (lb && lb.classList.contains('on') && e.target === lb) closeLB();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeLB(); closeMenuImg(); closeConfirmPopup(); }
});

function normalizeProduct(row) {
  return {
    id: row.legacy_id || row.id,
    name: row.name || '',
    img: row.image_url || 'images/logo.webp',
    price: Number(row.price || 0),
    cat: row.category || 'gateau',
    desc: row.description || '',
    promo: Boolean(row.is_promo),
    isNew: Boolean(row.is_new),
    sortOrder: Number(row.sort_order || 100)
  };
}

function renderProductStructuredData(products) {
  let script = document.getElementById('productStructuredData');
  if (!catalogueLoaded || !document.getElementById('page-gateau')?.classList.contains('active')) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = 'productStructuredData';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  const baseUrl = 'https://www.mondegourmand.com/';
  const itemListElement = (products || []).map((product, index) => {
    const productId = encodeURIComponent(String(product.id));
    const image = /^https?:\/\//i.test(product.img || '')
      ? product.img
      : new URL(String(product.img || 'images/logo.webp').replace(/^\//, ''), baseUrl).href;
    const item = {
      '@type': 'Product',
      '@id': `https://www.mondegourmand.com/gateaux#product-${productId}`,
      name: product.name,
      description: product.desc || `${product.name} par Monde Gourmand à Kénitra`,
      image,
      category: product.cat,
      brand: { '@id': 'https://www.mondegourmand.com/#organization' },
      url: `https://www.mondegourmand.com/gateaux#product-${productId}`
    };
    if (Number(product.price) > 0) {
      item.offers = {
        '@type': 'Offer',
        price: Number(product.price).toFixed(2),
        priceCurrency: 'MAD',
        url: item.url,
        seller: { '@id': 'https://www.mondegourmand.com/#organization' }
      };
    }
    return { '@type': 'ListItem', position: index + 1, item };
  });
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'https://www.mondegourmand.com/gateaux#catalogue',
    name: 'Catalogue de gâteaux et pâtisseries Monde Gourmand',
    url: 'https://www.mondegourmand.com/gateaux',
    numberOfItems: itemListElement.length,
    itemListElement
  });
}

function renderDynamicMenu(rows, categories) {
  const dyn = document.getElementById('supabaseMenuCategories');
  if (!dyn) return;
  if (!rows.length) {
    renderCatalogueNotice(dyn, 'Aucun article de menu disponible pour le moment.');
    return;
  }
  const groups = rows.reduce((acc, row) => {
    const key = row.category || 'Menu';
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  const orderMap = new Map((categories || []).filter(cat => cat.collection === 'menu').map(cat => [cat.name, Number(cat.sort_order || 100)]));
  const orderedCategories = Object.keys(groups).sort((a, b) => {
    const byOrder = (orderMap.get(a) ?? 1000) - (orderMap.get(b) ?? 1000);
    return byOrder || a.localeCompare(b);
  });
  dyn.innerHTML = orderedCategories.map((category, idx) => `<div class="menu-category rv in ${idx % 3 === 1 ? 'd1' : idx % 3 === 2 ? 'd2' : ''}">
    <div class="menu-cat-header">
      <span class="menu-cat-icon">MG</span>
      <h3 class="menu-cat-title">${mgEsc(category)}</h3>
      <div class="menu-cat-line"></div>
    </div>
    <div class="menu-items-grid">
      ${groups[category].map(item => `<div class="menu-item ${item.is_promo ? 'menu-item--promo' : ''} ${item.is_new ? 'menu-item--new' : ''}">
        <img class="menu-thumb" src="${mgEsc(item.image_url || 'images/logo.webp')}" alt="${mgEsc(item.name)}" loading="lazy" decoding="async" width="64" height="64" role="button" tabindex="0" aria-label="Agrandir ${mgEsc(item.name)}" onclick="openMenuImg(this,'${mgProductId(item.name)}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
        <div class="menu-item-info"><span class="menu-item-name">${mgEsc(item.name)}</span><span class="menu-item-desc">${mgEsc(item.description || '')}</span></div>
        <span class="menu-item-price">${mgEsc(item.price)} Dh</span>
      </div>`).join('')}
    </div>
  </div>`).join('');
  setTimeout(doReveal, 80);
}

function renderCatalogueNotice(container, message, retry = false) {
  if (!container) return;
  const retryButton = retry ? '<button type="button" class="catalogue-retry" data-retry-catalogue>Réessayer</button>' : '';
  container.innerHTML = `<div class="catalogue-status" role="status">${mgEsc(message)}${retryButton}</div>`;
}

function syncCartWithProducts() {
  const byId = new Map(PRODUCTS.map(product => [String(product.id), product]));
  const next = cart.flatMap(item => {
    const product = byId.get(String(item.id));
    return product ? [{ ...item, name: product.name, img: product.img, price: product.price, desc: product.desc }] : [];
  });
  if (JSON.stringify(next) !== JSON.stringify(cart)) {
    cart = next;
    saveCart();
  }
  if (document.getElementById('cartLayout')) renderCart();
}

async function loadPublicProducts() {
  if (catalogueLoading) return;
  catalogueLoading = true;
  catalogueLoaded = false;
  catalogueError = false;
  renderCatalogueNotice(document.getElementById('pgrid'), 'Chargement des produits...');
  renderCatalogueNotice(document.getElementById('supabaseMenuCategories'), 'Chargement du menu...');
  if (document.getElementById('cartLayout')) renderCart();
  try {
    if (!mgHasSupabase()) throw new Error('Configuration Supabase manquante');
    const [productsResult, categoriesResult] = await Promise.all([
      mgDb.from('products').select('*').eq('is_active', true)
        .order('collection', { ascending: true })
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true }),
      mgDb.from('product_categories').select('*').eq('is_active', true)
        .order('collection', { ascending: true })
        .order('sort_order', { ascending: true })
    ]);
    if (productsResult.error) throw productsResult.error;
    if (categoriesResult.error) console.warn('Catégories Supabase indisponibles:', categoriesResult.error.message);
    const data = productsResult.data || [];
    const categories = categoriesResult.data || [];
    const gateaux = data.filter(row => row.collection === 'gateau').map(normalizeProduct);
    const categoryOrder = new Map(
      categories
        .filter(category => category.collection === 'gateau')
        .map(category => [mgCategoryKey(category.name), Number(category.sort_order || 100)])
    );
    PRODUCTS = gateaux.sort((a, b) => {
      const byCategory = (categoryOrder.get(mgCategoryKey(a.cat)) ?? 1000) - (categoryOrder.get(mgCategoryKey(b.cat)) ?? 1000);
      return byCategory || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'fr');
    });
    catalogueLoaded = true;
    renderProductFilters(categories, PRODUCTS);
    renderProducts(activeProductCat);
    renderProductStructuredData(PRODUCTS);
    renderDynamicMenu(data.filter(row => row.collection === 'menu'), categories);
    syncCartWithProducts();
  } catch (error) {
    console.warn('Catalogue Supabase indisponible:', error.message || error);
    PRODUCTS = [];
    catalogueLoaded = false;
    catalogueError = true;
    renderProductFilters([], PRODUCTS);
    renderCatalogueNotice(document.getElementById('pgrid'), 'Catalogue momentanément indisponible.', true);
    renderCatalogueNotice(document.getElementById('supabaseMenuCategories'), 'Menu momentanément indisponible.', true);
    document.getElementById('productStructuredData')?.remove();
    if (document.getElementById('cartLayout')) renderCart();
  } finally {
    catalogueLoading = false;
  }
}

document.addEventListener('click', event => {
  if (event.target.closest('[data-retry-catalogue]')) loadPublicProducts();
});
loadPublicProducts();

function enhanceOrderForm() {
  const form = document.querySelector('#cartLayout .oform');
  if (!form || form.querySelector('#orderTypeGroup')) return;
  const firstRow = form.querySelector('.frow');
  if (!firstRow) return;
  firstRow.insertAdjacentHTML('afterend', `<div class="ffield order-mode-field" id="orderTypeGroup">
    <label class="flabel">Mode de commande</label>
    <div class="order-mode-options">
      <label class="order-mode-option"><input type="radio" name="orderFulfillment" value="sur_place"><span>Sur place</span></label>
      <label class="order-mode-option"><input type="radio" name="orderFulfillment" value="a_emporter"><span>A emporter</span></label>
      <label class="order-mode-option"><input type="radio" name="orderFulfillment" value="livraison" checked><span>Livraison</span></label>
    </div>
  </div>`);
  const modeField = document.getElementById('orderTypeGroup');
  modeField.insertAdjacentHTML('afterend', `<div class="order-schedule-grid" id="orderScheduleGroup">
    <div class="ffield">
      <label class="flabel">Date souhaitée</label>
      <div class="finput-wrap"><input class="finput" id="orderDate" type="date"><div class="finput-line"></div></div>
    </div>
    <div class="ffield">
      <label class="flabel">Heure souhaitée</label>
      <div class="finput-wrap"><input class="finput" id="orderTime" type="time"><div class="finput-line"></div></div>
    </div>
  </div>`);
  const subtitle = form.querySelector('.oform-subtitle');
  if (subtitle) subtitle.textContent = 'Choisissez le mode puis complétez vos coordonnées';
  const title = form.querySelector('.oform-title');
  if (title) title.textContent = 'Informations de commande';
  const telLabel = document.getElementById('tel')?.closest('.ffield')?.querySelector('.flabel');
  if (telLabel) telLabel.textContent = 'Téléphone';
  const submitBtn = form.querySelector('.wa-btn');
  if (submitBtn) {
    submitBtn.classList.add('order-submit-btn');
    submitBtn.innerHTML = '<span>Valider ma commande</span>';
  }
  const secure = form.querySelector('.oform-secure');
  if (secure) secure.textContent = 'Commande transmise à notre équipe · Kénitra, Maroc';
  const dateInput = document.getElementById('orderDate');
  if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('input[name="orderFulfillment"]').forEach(input => input.addEventListener('change', syncOrderFields));
  syncOrderFields();
}

function getOrderMode() {
  return document.querySelector('input[name="orderFulfillment"]:checked')?.value || 'livraison';
}

function syncOrderFields() {
  const mode = getOrderMode();
  const addressField = document.getElementById('ad')?.closest('.ffield');
  const addressInput = document.getElementById('ad');
  const scheduleGroup = document.getElementById('orderScheduleGroup');
  const dateInput = document.getElementById('orderDate');
  const timeInput = document.getElementById('orderTime');
  const isDelivery = mode === 'livraison';
  if (addressField) addressField.style.display = isDelivery ? '' : 'none';
  if (addressInput) addressInput.required = isDelivery;
  if (scheduleGroup) scheduleGroup.style.display = isDelivery ? 'none' : 'grid';
  if (dateInput) dateInput.required = !isDelivery;
  if (timeInput) timeInput.required = !isDelivery;
}

function getOrderSchedule() {
  return {
    date: document.getElementById('orderDate')?.value || null,
    time: document.getElementById('orderTime')?.value || null
  };
}

/* PANIER */
function renderCart() {
  const layout = document.getElementById('cartLayout');
  if (!layout) return;
  if (!cart || !cart.length) { layout.innerHTML = `<div class="cart-empty"><div class="cart-empty-ico">🛒</div><p class="cart-empty-h">Votre panier est vide</p></div>`; return; }
  if (!catalogueLoaded) {
    renderCatalogueNotice(layout, catalogueError ? 'Catalogue momentanément indisponible. Votre panier sera actualisé dès le retour du service.' : 'Synchronisation du panier...', catalogueError);
    return;
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const qty = cart.reduce((s, i) => s + i.qty, 0);
  const items = cart.map((it, idx) => {
    const product = PRODUCTS.find(p => String(p.id) === String(it.id));
    const image = it.img || product?.img || '';
    const thumb = image
      ? `<img src="${mgEsc(image)}" alt="${mgEsc(it.name)}" loading="lazy">`
      : `<span aria-hidden="true">${it.emoji || '🎂'}</span>`;
    return `<div class="ci" style="animation-delay:${idx * 55}ms"><div class="ci-thumb">${thumb}</div><div class="ci-info"><div class="ci-name">${mgEsc(it.name)}</div><div class="ci-unit">${mgEsc(it.price)} Dh / unité</div></div><div class="ci-qty"><button class="qbtn" onclick="doQty('${mgProductId(it.id)}',-1)" aria-label="Diminuer la quantité">−</button><span class="qnum">${it.qty}</span><button class="qbtn" onclick="doQty('${mgProductId(it.id)}',1)" aria-label="Augmenter la quantité">+</button></div><div class="ci-total">${it.price * it.qty} Dh</div><button class="ci-del" title="Supprimer" aria-label="Supprimer ${mgEsc(it.name)}" onclick="doDel('${mgProductId(it.id)}')">✕</button></div>`;
  }).join('');
  const lines = cart.map(i => `<div class="csum-line"><span class="csl-label">${i.name} ×${i.qty}</span><span class="csl-val">${i.price * i.qty} Dh</span></div>`).join('');
  layout.innerHTML = `<div><div class="ci-head"><h2 class="ci-title">Articles sélectionnés</h2><span class="ci-count">${qty} article${qty > 1 ? 's' : ''}</span></div>${items}</div><aside class="csummary"><div class="csum-title">Résumé de commande</div>${lines}<hr class="csum-sep"><div class="csum-total"><span class="cst-label">Total</span><span class="cst-val">${total} Dh</span></div><form class="oform" onsubmit="return false"><div class="oform-header"><div class="oform-ornament">✦</div><div class="oform-title">Informations de Livraison</div><div class="oform-subtitle">Complétez vos coordonnées pour finaliser</div></div><div class="frow"><div class="ffield"><label class="flabel">Prénom</label><div class="finput-wrap"><svg class="finput-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><input class="finput" id="fn" placeholder="Votre prénom" required><div class="finput-line"></div></div></div><div class="ffield"><label class="flabel">Nom</label><div class="finput-wrap"><svg class="finput-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><input class="finput" id="ln" placeholder="Votre nom" required><div class="finput-line"></div></div></div></div><div class="ffield"><label class="flabel">Adresse complète</label><div class="finput-wrap"><svg class="finput-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><input class="finput" id="ad" placeholder="Rue, quartier, numéro…" required><div class="finput-line"></div></div></div><div class="ffield"><label class="flabel">Téléphone WhatsApp</label><div class="finput-wrap"><svg class="finput-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg><input class="finput" id="tel" type="tel" placeholder="+212 6XX XXX XXX" required><div class="finput-line"></div></div></div><button class="wa-btn" onclick="sendWA()"><span class="wa-btn-bg"></span><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span>Envoyer ma commande</span><svg class="wa-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button><div class="oform-secure"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Commande sécurisée · Kénitra, Maroc</div></form></aside>`;
  enhanceOrderForm();
}
function doQty(id, d) { changeQty(id, d); renderCart(); }
function doDel(id) { removeFromCart(id); renderCart(); }
async function sendWA() {
  if (!catalogueLoaded) { showToast('⚠️ Catalogue indisponible, veuillez réessayer'); return; }
  const fn = document.getElementById('fn')?.value?.trim() || '';
  const ln = document.getElementById('ln')?.value?.trim() || '';
  const ad = document.getElementById('ad')?.value?.trim() || '';
  const tel = document.getElementById('tel')?.value?.trim() || '';
  const orderMode = getOrderMode();
  const needsAddress = orderMode === 'livraison';
  const schedule = getOrderSchedule();
  if (!fn || !ln || !tel || (needsAddress && !ad)) { showToast('⚠️ Veuillez remplir tous les champs'); return; }
  if (!needsAddress && (!schedule.date || !schedule.time)) { showToast('⚠️ Veuillez choisir la date et l’heure'); return; }
  if (!cart?.length) { showToast('⚠️ Votre panier est vide'); return; }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const result = await mgInsert('orders', {
    order_type: orderMode,
    customer_first_name: fn,
    customer_last_name: ln,
    phone: tel,
    address: needsAddress ? ad : '',
    scheduled_date: needsAddress ? null : schedule.date,
    scheduled_time: needsAddress ? null : schedule.time,
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, subtotal: i.price * i.qty })),
    total,
    source: 'site'
  });
  if (result.skipped) { showToast('⚠️ Configuration Supabase manquante'); return; }
  if (result.error) { showToast('⚠️ Commande non envoyée'); return; }
  showConfirmPopup();
}

/* ── POP-UP DE CONFIRMATION (délai 48h) ─────────────────── */
function showConfirmPopup() {
  const p = document.getElementById('confirmPopup');
  if (p) {
    activeDialogTrigger = document.activeElement;
    p.classList.add('on');
    p.setAttribute('aria-hidden', 'false');
    p.querySelector('.confirm-popup-btn')?.focus();
  }
}
function closeConfirmPopup() {
  const p = document.getElementById('confirmPopup');
  if (p) {
    p.classList.remove('on');
    p.setAttribute('aria-hidden', 'true');
  }
  activeDialogTrigger?.focus?.();
}

/* ── RÉSERVATION D'ÉVÉNEMENT (page À propos) ────────────── */
async function sendReservationWA() {
  const nom = document.getElementById('rNom')?.value?.trim() || '';
  const tel = document.getElementById('rTel')?.value?.trim() || '';
  const date = document.getElementById('rDate')?.value || '';
  const heure = document.getElementById('rHeure')?.value || '';
  const type = document.getElementById('rType')?.value || '';
  const prsn = document.getElementById('rPrsn')?.value || '';
  const table = document.getElementById('rTable')?.value?.trim() || '';
  if (!nom || !tel || !date || !heure || !type || !prsn) { showToast('⚠️ Veuillez remplir tous les champs'); return; }
  const result = await mgInsert('event_reservations', {
    customer_name: nom,
    phone: tel,
    event_date: date,
    event_time: heure,
    event_type: type,
    guests: Number(prsn),
    table_note: table,
    source: 'site'
  });
  if (result.skipped) { showToast('⚠️ Configuration Supabase manquante'); return; }
  if (result.error) { showToast('⚠️ Réservation non envoyée'); return; }
  showToast('✓ Demande envoyée : nous vous rappelons pour confirmer');
}
renderCart();

/* SPA PAGE NAVIGATION */
const MG_PAGES = ['home', 'about', 'gateau', 'menu', 'panier', 'wheel'];
const MG_ROUTES = window.MG_SEO_ROUTES || {
  home: { path: '/' }, about: { path: '/a-propos' }, gateau: { path: '/gateaux' },
  menu: { path: '/menu' }, panier: { path: '/panier' }, wheel: { path: '/roue-gourmande' }
};

function normalizePageId(value) {
  const raw = String(value || '').trim().toLowerCase();
  const cleanPath = raw.startsWith('/') ? (raw.replace(/\/$/, '') || '/') : '';
  const routePage = cleanPath && window.MG_ROUTE_PATHS?.[cleanPath];
  if (routePage) return routePage;
  const id = raw.replace(/^#/, '');
  const aliases = { cart: 'panier', cakes: 'gateau', gateaux: 'gateau', roues: 'wheel', 'roue-gourmande': 'wheel', 'a-propos': 'about' };
  const page = aliases[id] || id;
  return MG_PAGES.includes(page) ? page : '';
}

function pageFromLocation() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const pathPage = normalizePageId(path);
  const legacyHashPage = normalizePageId(window.location.hash);
  return pathPage || legacyHashPage || 'home';
}

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute('content', content);
}

function updatePageSEO(id) {
  const seo = MG_ROUTES[id] || MG_ROUTES.home;
  const canonicalUrl = `https://www.mondegourmand.com${seo.path || '/'}`;
  if (seo.title) document.title = seo.title;
  if (seo.description) {
    setMetaContent('#metaDescription', seo.description);
    setMetaContent('#ogDescription', seo.description);
    setMetaContent('#twitterDescription', seo.description);
  }
  if (seo.title) {
    setMetaContent('#ogTitle', seo.title);
    setMetaContent('#twitterTitle', seo.title);
  }
  setMetaContent('#ogUrl', canonicalUrl);
  setMetaContent('#metaRobots', seo.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
  const canonical = document.getElementById('canonicalUrl');
  if (canonical) canonical.href = canonicalUrl;

  let breadcrumbScript = document.getElementById('breadcrumbStructuredData');
  if (id === 'home') {
    breadcrumbScript?.remove();
  } else {
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'breadcrumbStructuredData';
      breadcrumbScript.type = 'application/ld+json';
      document.head.appendChild(breadcrumbScript);
    }
    const labels = { about: 'À propos', gateau: 'Gâteaux et pâtisseries', menu: 'Menu', panier: 'Panier', wheel: 'Roue Gourmande' };
    breadcrumbScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.mondegourmand.com/' },
        { '@type': 'ListItem', position: 2, name: labels[id], item: canonicalUrl }
      ]
    });
  }

  const skipLink = document.getElementById('skipLink');
  if (skipLink) skipLink.href = `#page-${id}`;
}

function showPage(id, options = {}) {
  id = normalizePageId(id) || 'home';
  const pages = MG_PAGES;
  const curtain = document.getElementById('page-curtain');
  const current = pages.find(p => { const el = document.getElementById('page-' + p); return el && el.classList.contains('active'); });
  const route = MG_ROUTES[id] || MG_ROUTES.home;
  const targetUrl = `${route.path || '/'}${options.anchor ? `#${options.anchor}` : ''}`;
  if (!document.getElementById('page-' + id)) {
    window.location.assign(targetUrl);
    return;
  }
  if (options.updateHistory !== false && `${window.location.pathname}${window.location.hash}` !== targetUrl) {
    history.pushState({ page: id }, '', targetUrl);
  }
  updatePageSEO(id);
  pages.forEach(page => {
    const link = document.getElementById('nav-' + page);
    if (!link) return;
    link.classList.toggle('on', page === id);
    if (page === id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('#mobNav a').forEach(link => {
    const isActive = link.getAttribute('href') === route.path;
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (current === id) {
    pages.forEach(page => {
      const section = document.getElementById('page-' + page);
      if (section) section.setAttribute('aria-hidden', String(page !== id));
    });
    if (options.anchor) document.getElementById(options.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (curtain) { curtain.classList.add('flash'); setTimeout(() => curtain.classList.remove('flash'), 200); }
  if (current) { const outEl = document.getElementById('page-' + current); if (outEl) { outEl.classList.add('leaving'); outEl.classList.remove('active'); setTimeout(() => outEl.classList.remove('leaving'), 300); } }
  setTimeout(() => {
    pages.forEach(p => {
      const el = document.getElementById('page-' + p);
      if (!el) return;
      const isActive = p === id;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-hidden', String(!isActive));
      if (isActive) el.classList.remove('leaving');
    });
    renderProductStructuredData(PRODUCTS);
    window.scrollTo({ top: 0, behavior: options.instant ? 'auto' : 'smooth' });
    if (id === 'gateau' && catalogueLoaded) renderProducts('all');
    if (id === 'panier') renderCart();
    if (id === 'menu') { setTimeout(doReveal, 100); }
    if (id === 'about') { setTimeout(() => { window.refreshGallery?.(); }, 80); }
    if (id === 'wheel') { setTimeout(() => { if (typeof initWheel === 'function') initWheel(); else window._pendingWheelInit = true; setTimeout(doReveal, 100); }, 50); }
    const anchor = options.anchor || (!normalizePageId(window.location.hash) ? window.location.hash.slice(1) : '');
    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }, 150);
}

window.addEventListener('hashchange', () => {
  const page = normalizePageId(window.location.hash);
  if (page) showPage(page, { updateHistory: false });
});
window.addEventListener('popstate', () => showPage(pageFromLocation(), { updateHistory: false, instant: true }));

setTimeout(() => {
  showPage(pageFromLocation(), { updateHistory: false, instant: true });
}, 0);

/* ENHANCED GALLERY LIGHTBOX */
(function () {
  const GALLERY_ITEMS = document.querySelectorAll('#gTrack .gi');
  const GALLERY_DATA = Array.from(GALLERY_ITEMS).map(gi => ({ img: gi.querySelector('.gi-bg img')?.src || '', label: gi.querySelector('.gi-lbl')?.textContent?.trim() || '' }));
  let glbIdx = 0, touchStartX = 0;
  function buildGLB() {
    if (document.getElementById('glb')) return;
    const div = document.createElement('div'); div.id = 'glb';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-modal', 'true');
    div.setAttribute('aria-labelledby', 'glbMeta');
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = `<button class="glb-close" onclick="closeGLB()" aria-label="Fermer la galerie">✕</button><div class="glb-counter" id="glbCounter"></div><button class="glb-arrow prev" id="glbPrev" onclick="glbNav(-1)" aria-label="Image précédente">←</button><div class="glb-stage"><img class="glb-real-img" id="glbImg" src=""><div class="glb-label" id="glbLabel"></div><div class="glb-gradient"></div><div class="glb-meta" id="glbMeta">Notre Galerie Gourmande</div></div><button class="glb-arrow next" id="glbNext" onclick="glbNav(1)" aria-label="Image suivante">→</button><div class="glb-dots" id="glbDots"></div><div class="glb-swipe-hint">← Swipe ou touches fléchées →</div>`;
    document.body.appendChild(div);
    document.getElementById('glbPrev')?.addEventListener('click', () => glbNav(-1));
    document.getElementById('glbNext')?.addEventListener('click', () => glbNav(1));
    div.addEventListener('click', e => { if (e.target === div) closeGLB(); });
  }
  function updateDots() { const dots = document.getElementById('glbDots'); if (!dots) return; dots.innerHTML = ''; for (let i = 0; i < GALLERY_DATA.length; i++) { const d = document.createElement('div'); d.className = 'glb-dot' + (i === glbIdx ? ' on' : ''); d.onclick = () => { glbIdx = i; renderGLB(); }; dots.appendChild(d); } }
  function renderGLB() { const it = GALLERY_DATA[glbIdx]; const image = document.getElementById('glbImg'); image.src = it.img; image.alt = it.label || 'Création Monde Gourmand'; document.getElementById('glbLabel').textContent = it.label; document.getElementById('glbCounter').textContent = `${glbIdx + 1} / ${GALLERY_DATA.length}`; document.querySelectorAll('.glb-dot').forEach((d, i) => d.classList.toggle('on', i === glbIdx)); }
  window.openGLB = function (idx) { buildGLB(); activeDialogTrigger = document.activeElement; glbIdx = idx; renderGLB(); updateDots(); const gallery = document.getElementById('glb'); gallery.classList.add('on'); gallery.setAttribute('aria-hidden', 'false'); gallery.querySelector('.glb-close')?.focus(); document.body.style.overflow = 'hidden'; };
  window.closeGLB = function () { const el = document.getElementById('glb'); if (el) { el.classList.remove('on'); el.setAttribute('aria-hidden', 'true'); } document.body.style.overflow = ''; activeDialogTrigger?.focus?.(); };
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
  const WHEEL_TRANS = { fr: { 'wheel': 'La Roue', 'wheel-tag': 'Jouez & Gagnez', 'wheel-concept-tag': 'Comment ça marche ?', 'wheel-concept-h': 'Tentez votre chance !', 'wheel-concept-p': "Faites tourner la roue et découvrez votre surprise gourmande ! Chaque tour est une opportunité de gagner une réduction, un dessert offert ou une surprise exclusive. À partir de votre 3ᵉ visite, vous bénéficiez d'un tour de roue gratuit : présentez-vous en boutique avec les 3 tickets de caisse de vos trois visites pour tenter votre chance.", 'wb1': 'Cadeaux réels', 'wb2': '1 tour offert dès 3 visites', 'wb3': 'Surprises exclusives', 'prizes-tag': 'Ce que vous pouvez gagner', 'prizes-h': 'Les Récompenses', 'wheel-spin': 'Faire tourner la roue', 'result-sub': 'Présentez ce résultat en boutique 🎉' }, en: { 'wheel': 'Wheel', 'wheel-tag': 'Play & Win', 'wheel-concept-tag': 'How does it work?', 'wheel-concept-h': 'Try your luck!', 'wheel-concept-p': "Spin the wheel and discover your sweet surprise! Every spin is a chance to win a discount, a free dessert or an exclusive treat. From your 3rd visit, you get a free spin: come to the shop with the 3 receipts from your three visits to try your luck.", 'wb1': 'Real gifts', 'wb2': '1 free spin after 3 visits', 'wb3': 'Exclusive surprises', 'prizes-tag': 'What you can win', 'prizes-h': 'The Rewards', 'wheel-spin': 'Spin the wheel', 'result-sub': 'Show this result in store 🎉' } };
  const _origApplyLang = window.applyLang;
  window.applyLang = function (l) { if (_origApplyLang) _origApplyLang(l); const t = WHEEL_TRANS[l] || WHEEL_TRANS.fr; Object.keys(t).forEach(k => document.querySelectorAll('[data-t="' + k + '"]').forEach(el => el.textContent = t[k])); window._wheelLang = l; };
  const WHEEL_PRIZES = [{ text: '5% de réduction', textEn: '5% Discount', color: '#CBA135', emoji: '🎟️', sub: 'Sur votre prochaine commande', isWin: true }, { text: '10% de réduction', textEn: '10% Off', color: '#A47149', emoji: '💫', sub: 'Valable 7 jours', isWin: true }, { text: 'Café gratuit', textEn: 'Free Coffee ☕', color: '#6F4E37', emoji: '☕', sub: '1 café ou thé au choix', isWin: true }, { text: 'Dessert gratuit', textEn: 'Free Dessert 🍰', color: '#D9A441', emoji: '🍰', sub: 'Au choix sur la carte', isWin: true }, { text: 'Dessert gratuit', textEn: 'Free Dessert 🍰', color: '#B5651D', emoji: '🍰', sub: 'Au choix sur la carte', isWin: true }, { text: 'Essayez encore', textEn: 'Try again 😅', color: '#888', emoji: '🍀', sub: 'La chance sourit aux audacieux !', isWin: false }, { text: 'Prochaine fois', textEn: 'Next time', color: '#8B5E3C', emoji: '☕', sub: 'Retentez votre chance à votre prochaine visite', isWin: false }, { text: 'Boisson offerte', textEn: 'Free Drink 🧋', color: '#A0522D', emoji: '🧋', sub: 'Boisson froide ou chaude', isWin: true }];
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
  function initWheel() { const wheel = document.querySelector('#page-wheel .deal-wheel'); if (!wheel) return; const spinner = wheel.querySelector('.spinner'); const trigger = wheel.querySelector('.btn-spin'); const ticker = wheel.querySelector('.ticker'); if (!spinner || !trigger || !ticker) return; if (!wheelBuilt) { wheelBuilt = true; const prizeSlice = 360 / WHEEL_PRIZES.length; const prizeOffset = Math.floor(180 / WHEEL_PRIZES.length); const spinnerStyles = window.getComputedStyle(spinner); let tickerAnim, rotation = 0, currentSlice = 0, prizeNodes, spinStartTime = 0; let spinSoundInterval = null; spinner.setAttribute('style', `background: conic-gradient(from -90deg, ${WHEEL_PRIZES.map(({ color }, i) => `${color} 0 ${(100 / WHEEL_PRIZES.length) * (WHEEL_PRIZES.length - i)}%`).reverse()});`); WHEEL_PRIZES.forEach(({ text }, i) => { spinner.insertAdjacentHTML('beforeend', `<li class="prize" style="--rotate:${((prizeSlice * i) * -1) - prizeOffset}deg"><span class="text">${text}</span></li>`); }); prizeNodes = wheel.querySelectorAll('.prize'); const grid = document.getElementById('prizesGrid'); if (grid) { grid.innerHTML = ''; const shownPrizes = new Set(); WHEEL_PRIZES.forEach(p => { if (!p.isWin || shownPrizes.has(p.text)) return; shownPrizes.add(p.text); const c = document.createElement('div'); c.className = 'prize-card'; c.innerHTML = `<div class="prize-card-color" style="background:${p.color}"></div><div class="prize-card-text">${p.emoji} ${p.text}</div>`; grid.appendChild(c); }); } initCounter(); function spinertia(min, max) { return Math.floor(Math.random() * (max - min + 1)) + Math.ceil(min); } function stopSpinSound() { if (spinSoundInterval) { clearInterval(spinSoundInterval); spinSoundInterval = null; } } function startSpinSound(durationMs) { stopSpinSound(); let elapsed = 0, interval = 80; spinSoundInterval = setInterval(() => { playTick(); elapsed += interval; if (elapsed < durationMs * 0.4) { interval = Math.max(30, interval - 4); } else if (elapsed > durationMs * 0.7) { interval = Math.min(300, interval + 18); } if (elapsed >= durationMs) { stopSpinSound(); } }, interval); } function runTicker() { const vals = spinnerStyles.transform.split('(')[1].split(')')[0].split(','); let rad = Math.atan2(+vals[1], +vals[0]); if (rad < 0) rad += 2 * Math.PI; const angle = Math.round(rad * (180 / Math.PI)); const slice = Math.floor(angle / prizeSlice); if (currentSlice !== slice) { ticker.style.animation = 'none'; setTimeout(() => ticker.style.animation = null, 10); currentSlice = slice; if (navigator.vibrate) navigator.vibrate(8); } tickerAnim = requestAnimationFrame(runTicker); } function selectPrize() { const idx = Math.floor(rotation / prizeSlice); const prize = WHEEL_PRIZES[idx]; prizeNodes[idx].classList.add('selected'); const lang = window._wheelLang || 'fr'; const t = WHEEL_TRANS[lang] || WHEEL_TRANS.fr; const txt = lang === 'en' ? (prize.textEn || prize.text) : prize.text; const ri = document.getElementById('wheelResultInner'); if (ri) { ri.innerHTML = `<span class="result-emoji">${prize.emoji}</span><span class="result-prize">${txt}</span><div class="result-sub">${prize.sub} — ${t['result-sub']}</div>`; ri.classList.add('visible'); if (prize.isWin) ri.classList.add('win'); else ri.classList.remove('win'); } if (prize.isWin) { playWinSound(); launchConfetti(); bumpCounter(); if (navigator.vibrate) navigator.vibrate([60, 30, 60, 30, 120]); } else { playLoseSound(); if (navigator.vibrate) navigator.vibrate([200]); } } trigger.addEventListener('click', () => { try { if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) { } trigger.disabled = true; const ri = document.getElementById('wheelResultInner'); if (ri) { ri.classList.remove('visible', 'win'); } const spinDuration = 8000; spinStartTime = Date.now(); const targetIdx = pickWeightedIndex(WHEEL_WEIGHTS); const sliceStart = targetIdx * prizeSlice; const margin = prizeSlice * 0.15; const withinSlice = margin + Math.random() * (prizeSlice - 2 * margin); const extraTurns = 360 * spinertia(6, 10); rotation = extraTurns + sliceStart + withinSlice; prizeNodes.forEach(p => p.classList.remove('selected')); wheel.classList.add('is-spinning'); spinner.style.setProperty('--rotate', rotation); ticker.style.animation = 'none'; runTicker(); startSpinSound(spinDuration); }); spinner.addEventListener('transitionend', () => { cancelAnimationFrame(tickerAnim); stopSpinSound(); trigger.disabled = false; trigger.focus(); rotation %= 360; selectPrize(); wheel.classList.remove('is-spinning'); spinner.style.setProperty('--rotate', rotation); }); } }
  window.initWheel = initWheel;
  if (window._pendingWheelInit) { window._pendingWheelInit = false; initWheel(); }
  if (document.getElementById('page-wheel')?.classList.contains('active')) initWheel();
})();

/* FALLBACK VIDEO */
(function () {
  const video = document.querySelector('.hero-video');
  if (video) {
    const showVideo = () => video.classList.add('is-playing');
    const showFallback = () => video.classList.remove('is-playing');
    const tryPlay = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      const promise = video.play();
      if (promise?.catch) promise.catch(showFallback);
    };
    video.addEventListener('playing', showVideo);
    video.addEventListener('canplay', tryPlay, { once: true });
    video.addEventListener('error', showFallback);
    video.addEventListener('stalled', showFallback);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
    tryPlay();
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
