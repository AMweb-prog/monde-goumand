(function () {
  const db = window.createMGClient ? window.createMGClient() : null;
  const state = { orders: [], reservations: [], products: [], categories: [], user: null };
  const $ = (id) => document.getElementById(id);
  const money = (value) => `${Number(value || 0).toFixed(Number(value || 0) % 1 ? 2 : 0)} Dh`;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const dt = (value) => value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '';
  const day = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  const orderTypeLabel = { sur_place: 'Sur place', a_emporter: 'A emporter', livraison: 'Livraison' };
  const orderStatuses = ['nouvelle', 'en_preparation', 'prete', 'terminee', 'annulee'];
  const reservationStatuses = ['nouvelle', 'confirmee', 'terminee', 'annulee'];

  function toast(message, icon = 'success') {
    if (!message) return;
    if (window.Swal) {
      window.Swal.fire({
        toast: true,
        position: 'top-end',
        icon,
        title: message,
        showConfirmButton: false,
        timer: 2800,
        timerProgressBar: true,
        customClass: { popup: 'mg-swal-toast' }
      });
      return;
    }
    const el = $('adminToast');
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2600);
  }

  async function confirmAction({ title, text, confirmText = 'Confirmer' }) {
    if (!window.Swal) return confirm(`${title}\n${text || ''}`);
    const result = await window.Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: 'mg-swal-popup',
        title: 'mg-swal-title',
        htmlContainer: 'mg-swal-text',
        confirmButton: 'mg-swal-confirm',
        cancelButton: 'mg-swal-cancel'
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  }

  function configured() {
    return Boolean(db);
  }

  async function init() {
    if (!configured()) {
      $('configWarning').textContent = '';
      return;
    }
    bindUI();
    const { data } = await db.auth.getSession();
    if (data.session?.user) {
      state.user = data.session.user;
      showApp();
      await loadAll();
      subscribeRealtime();
    }
  }

  function bindUI() {
    $('loginForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = $('loginEmail').value.trim();
      const password = $('loginPassword').value;
      const { data, error } = await db.auth.signInWithPassword({ email, password });
      if (error) return toast(error.message, 'error');
      state.user = data.user;
      showApp();
      await loadAll();
      subscribeRealtime();
    });

    $('logoutBtn').addEventListener('click', async () => {
      await db.auth.signOut();
      state.user = null;
      $('authScreen').classList.remove('is-hidden');
      $('appScreen').classList.add('is-hidden');
    });

    $('refreshBtn').addEventListener('click', loadAll);
    document.querySelectorAll('.nav-item').forEach((btn) => btn.addEventListener('click', () => setView(btn.dataset.view)));
    document.querySelectorAll('[data-jump]').forEach((btn) => btn.addEventListener('click', () => setView(btn.dataset.jump)));
    ['orderTypeFilter', 'orderStatusFilter', 'orderSearch'].forEach((id) => $(id).addEventListener('input', renderOrders));
    ['reservationStatusFilter', 'reservationSearch'].forEach((id) => $(id).addEventListener('input', renderReservations));
    ['productCollectionFilter', 'productSearch'].forEach((id) => $(id).addEventListener('input', renderProducts));

    $('ordersTable').addEventListener('change', onStatusChange);
    $('reservationsTable').addEventListener('change', onStatusChange);
    $('productsTable').addEventListener('click', onProductAction);
    $('productForm').addEventListener('submit', saveProduct);
    $('resetProductForm').addEventListener('click', resetProductForm);
    $('resetCategoryForm').addEventListener('click', resetCategoryForm);
    $('productCollection').addEventListener('change', () => renderCategorySelect());
    $('productImageFile').addEventListener('change', onProductImageChange);
    $('categoryCollection').addEventListener('change', () => {
      resetCategoryForm(false);
      renderManagedCategorySelect();
      renderCategoryList();
    });
    $('categoryName').addEventListener('change', syncCategoryFormFromSelected);
    $('categoryForm').addEventListener('submit', saveCategory);
    $('categoryList').addEventListener('click', onCategoryAction);
    $('categoryList').addEventListener('change', onCategoryOrderChange);
  }

  function showApp() {
    $('operatorEmail').textContent = state.user?.email || 'Admin';
    $('authScreen').classList.add('is-hidden');
    $('appScreen').classList.remove('is-hidden');
    $('appScreen').dataset.currentView = document.querySelector('.view-panel.is-active')?.dataset.panel || 'overview';
    runMotion();
  }

  function setView(view) {
    document.querySelectorAll('.nav-item').forEach((btn) => btn.classList.toggle('is-active', btn.dataset.view === view));
    document.querySelectorAll('.view-panel').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === view));
    $('appScreen').dataset.currentView = view;
    runMotion();
  }

  async function loadAll() {
    if (!configured()) return;
    const [orders, reservations, products, categories] = await Promise.all([
      db.from('orders').select('*').order('created_at', { ascending: false }).limit(200),
      db.from('event_reservations').select('*').order('created_at', { ascending: false }).limit(200),
      db.from('products').select('*').order('collection').order('category').order('sort_order', { ascending: true }),
      db.from('product_categories').select('*').order('collection').order('sort_order', { ascending: true }).order('name', { ascending: true })
    ]);
    if (orders.error) toast(orders.error.message, 'error');
    if (reservations.error) toast(reservations.error.message, 'error');
    if (products.error) toast(products.error.message, 'error');
    if (categories.error) toast('Table product_categories a creer dans Supabase.', 'warning');
    state.orders = orders.data || [];
    state.reservations = reservations.data || [];
    state.products = products.data || [];
    state.categories = categories.data?.length ? categories.data : deriveCategoriesFromProducts();
    $('lastSync').textContent = `Synchronise ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    renderAll();
  }

  function renderAll() {
    renderMetrics();
    renderRecent();
    renderOrders();
    renderReservations();
    renderCategorySelect();
    renderManagedCategorySelect();
    renderCategoryList();
    renderProducts();
  }

  function renderMetrics() {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = state.orders.filter((o) => String(o.created_at).slice(0, 10) === today);
    $('metricOrdersToday').textContent = todayOrders.length;
    $('metricDelivery').textContent = state.orders.filter((o) => o.order_type === 'livraison').length;
    $('metricOnSite').textContent = state.orders.filter((o) => o.order_type === 'sur_place').length;
    $('metricReservations').textContent = state.reservations.length;
    $('metricProducts').textContent = state.products.filter((p) => p.is_active).length;
  }

  function renderRecent() {
    $('recentOrders').innerHTML = state.orders.slice(0, 5).map((o) => compactItem(`${esc(o.customer_first_name)} ${esc(o.customer_last_name)}`, `${orderTypeLabel[o.order_type] || o.order_type} - ${money(o.total)}`, o.status)).join('') || emptyLine('Aucune commande');
    $('recentReservations').innerHTML = state.reservations.slice(0, 5).map((r) => compactItem(esc(r.customer_name), `${day(r.event_date)} - ${esc(r.event_type)} - ${r.guests} pers.`, r.status)).join('') || emptyLine('Aucune reservation');
  }

  function compactItem(title, meta, status) {
    return `<div class="compact-item"><div><strong>${title}</strong><span>${meta}</span></div><span class="pill ${statusClass(status)}">${statusLabel(status)}</span></div>`;
  }

  function emptyLine(text) {
    return `<p class="muted">${text}</p>`;
  }

  function renderOrders() {
    const type = $('orderTypeFilter').value;
    const status = $('orderStatusFilter').value;
    const q = $('orderSearch').value.trim().toLowerCase();
    const rows = state.orders.filter((o) => {
      const hay = `${o.customer_first_name} ${o.customer_last_name} ${o.phone}`.toLowerCase();
      return (type === 'all' || o.order_type === type) && (status === 'all' || o.status === status) && (!q || hay.includes(q));
    });
    $('ordersTable').innerHTML = rows.map(orderRow).join('') || `<tr><td colspan="7" class="muted">Aucune commande trouvee.</td></tr>`;
  }

  function orderRow(o) {
    const items = Array.isArray(o.items) ? o.items : [];
    const lines = items.map((it) => `${esc(it.name)} x${Number(it.qty || 1)}`).join('<br>');
    const schedule = o.order_type === 'livraison'
      ? esc(o.address || '-')
      : `${day(o.scheduled_date)}<br><span class="muted">${esc(o.scheduled_time || '')}</span>`;
    return `<tr>
      <td>${dt(o.created_at)}</td>
      <td><span class="pill">${orderTypeLabel[o.order_type] || esc(o.order_type)}</span></td>
      <td><strong>${esc(o.customer_first_name)} ${esc(o.customer_last_name)}</strong><span class="muted">${esc(o.phone)}</span></td>
      <td>${schedule}</td>
      <td class="items-cell">${lines || '-'}</td>
      <td><strong>${money(o.total)}</strong></td>
      <td>${statusSelect('orders', o.id, o.status, orderStatuses)}</td>
    </tr>`;
  }

  function renderReservations() {
    const status = $('reservationStatusFilter').value;
    const q = $('reservationSearch').value.trim().toLowerCase();
    const rows = state.reservations.filter((r) => {
      const hay = `${r.customer_name} ${r.phone} ${r.event_type}`.toLowerCase();
      return (status === 'all' || r.status === status) && (!q || hay.includes(q));
    });
    $('reservationsTable').innerHTML = rows.map(reservationRow).join('') || `<tr><td colspan="6" class="muted">Aucune reservation trouvee.</td></tr>`;
  }

  function reservationRow(r) {
    return `<tr>
      <td>${dt(r.created_at)}</td>
      <td><strong>${day(r.event_date)}</strong><span class="muted">${esc(r.event_time || '')}</span></td>
      <td><strong>${esc(r.customer_name)}</strong><span class="muted">${esc(r.phone)}<br>${esc(r.table_note || '')}</span></td>
      <td>${esc(r.event_type)}</td>
      <td>${Number(r.guests || 0)}</td>
      <td>${statusSelect('event_reservations', r.id, r.status, reservationStatuses)}</td>
    </tr>`;
  }

  function statusSelect(table, id, value, options) {
    return `<select class="status-select" data-table="${table}" data-id="${id}">${options.map((item) => `<option value="${item}" ${item === value ? 'selected' : ''}>${statusLabel(item)}</option>`).join('')}</select>`;
  }

  async function onStatusChange(event) {
    const target = event.target;
    if (!target.matches('.status-select')) return;
    const { table, id } = target.dataset;
    const { error } = await db.from(table).update({ status: target.value }).eq('id', id);
    if (error) return toast(error.message, 'error');
    toast('Statut mis a jour');
    await loadAll();
  }

  function deriveCategoriesFromProducts() {
    const seen = new Set();
    const rows = [];
    state.products.forEach((product) => {
      const key = `${product.collection}:${product.category}`;
      if (!product.category || seen.has(key)) return;
      seen.add(key);
      rows.push({
        id: key,
        collection: product.collection,
        name: product.category,
        sort_order: Math.min(...state.products.filter((p) => p.collection === product.collection && p.category === product.category).map((p) => Number(p.sort_order || 100))),
        is_active: true,
        derived: true
      });
    });
    return rows.sort((a, b) => a.collection.localeCompare(b.collection) || Number(a.sort_order) - Number(b.sort_order) || a.name.localeCompare(b.name));
  }

  function categoriesFor(collection) {
    return state.categories
      .filter((cat) => cat.collection === collection && cat.is_active !== false)
      .sort((a, b) => Number(a.sort_order || 100) - Number(b.sort_order || 100) || a.name.localeCompare(b.name));
  }

  function renderCategorySelect(selectedValue) {
    const collection = $('productCollection').value || 'gateau';
    const select = $('productCategory');
    const categories = categoriesFor(collection);
    const current = selectedValue ?? select.value;
    const options = categories.map((cat) => `<option value="${esc(cat.name)}">${esc(cat.name)}</option>`);
    if (current && !categories.some((cat) => cat.name === current)) {
      options.unshift(`<option value="${esc(current)}">${esc(current)}</option>`);
    }
    select.innerHTML = options.join('') || '<option value="">Ajoutez une categorie</option>';
    if (current) select.value = current;
  }

  function renderManagedCategorySelect(selectedValue) {
    const collection = $('categoryCollection').value || 'menu';
    const select = $('categoryName');
    const categories = categoriesFor(collection);
    const current = selectedValue ?? select.value;
    select.innerHTML = [
      '<option value="">Nouvelle categorie</option>',
      ...categories.map((cat) => `<option value="${esc(cat.name)}">${esc(cat.name)}</option>`)
    ].join('');
    if (current && categories.some((cat) => cat.name === current)) {
      select.value = current;
      syncCategoryFormFromSelected();
    }
  }

  function syncCategoryFormFromSelected() {
    const collection = $('categoryCollection').value || 'menu';
    const name = $('categoryName').value;
    const category = categoriesFor(collection).find((cat) => cat.name === name);
    $('categoryId').value = category && !category.derived ? category.id : '';
    $('categoryNewName').value = category ? category.name : '';
    $('categoryOrder').value = category ? (category.sort_order || 100) : 100;
  }

  function resetCategoryForm(renderSelect = true) {
    const collection = $('categoryCollection').value || 'menu';
    $('categoryForm').reset();
    $('categoryCollection').value = collection;
    $('categoryId').value = '';
    $('categoryName').value = '';
    $('categoryNewName').value = '';
    $('categoryOrder').value = 100;
    if (renderSelect) renderManagedCategorySelect('');
  }

  function renderCategoryList() {
    const collection = $('categoryCollection').value || 'menu';
    const rows = categoriesFor(collection);
    $('categoryList').innerHTML = rows.map((cat) => `<div class="category-item" data-id="${esc(cat.id)}">
      <strong>${esc(cat.name)}</strong>
      <input class="category-order-input" type="number" value="${Number(cat.sort_order || 100)}" data-id="${esc(cat.id)}" ${cat.derived ? 'disabled' : ''}>
      <div class="category-actions">
        <button class="small-btn" type="button" data-cat-action="edit" data-id="${esc(cat.id)}" ${cat.derived ? 'disabled' : ''}>Editer</button>
        <button class="small-btn danger" type="button" data-cat-action="delete" data-id="${esc(cat.id)}" ${cat.derived ? 'disabled' : ''}>Suppr.</button>
      </div>
    </div>`).join('') || '<p class="muted">Aucune categorie.</p>';
  }

  async function saveCategory(event) {
    event.preventDefault();
    const id = $('categoryId').value;
    const previousName = $('categoryName').value.trim();
    const payload = {
      collection: $('categoryCollection').value,
      name: $('categoryNewName').value.trim(),
      sort_order: Number($('categoryOrder').value || 100),
      is_active: true
    };
    if (!payload.name) return toast('Nom categorie obligatoire', 'warning');
    const result = id
      ? await db.from('product_categories').update(payload).eq('id', id)
      : await db.from('product_categories').upsert(payload, { onConflict: 'collection,name' });
    if (result.error) return toast(result.error.message, 'error');
    if (id && previousName && previousName !== payload.name) {
      const renameProducts = await db
        .from('products')
        .update({ category: payload.name })
        .eq('collection', payload.collection)
        .eq('category', previousName);
      if (renameProducts.error) return toast(renameProducts.error.message, 'error');
    }
    resetCategoryForm(false);
    toast('Categorie enregistree');
    await loadAll();
  }

  function onCategoryAction(event) {
    const btn = event.target.closest('[data-cat-action]');
    if (!btn) return;
    const category = state.categories.find((cat) => String(cat.id) === String(btn.dataset.id));
    if (!category || category.derived) return;
    if (btn.dataset.catAction === 'edit') {
      $('categoryId').value = category.id;
      $('categoryCollection').value = category.collection;
      renderManagedCategorySelect(category.name);
      $('categoryNewName').value = category.name;
      $('categoryOrder').value = category.sort_order || 100;
    }
    if (btn.dataset.catAction === 'delete') deleteCategory(category);
  }

  async function onCategoryOrderChange(event) {
    const input = event.target.closest('.category-order-input');
    if (!input || input.disabled) return;
    const { error } = await db.from('product_categories').update({ sort_order: Number(input.value || 100) }).eq('id', input.dataset.id);
    if (error) return toast(error.message, 'error');
    toast('Ordre categorie mis a jour');
    await loadAll();
  }

  async function deleteCategory(category) {
    const confirmed = await confirmAction({
      title: 'Supprimer cette categorie ?',
      text: category.name,
      confirmText: 'Supprimer'
    });
    if (!confirmed) return;
    const { error } = await db.from('product_categories').delete().eq('id', category.id);
    if (error) return toast(error.message, 'error');
    toast('Categorie supprimee');
    resetCategoryForm(false);
    await loadAll();
  }

  function renderProducts() {
    const collection = $('productCollectionFilter').value;
    const q = $('productSearch').value.trim().toLowerCase();
    const categoryOrder = new Map(state.categories.map((cat) => [`${cat.collection}:${cat.name}`, Number(cat.sort_order || 100)]));
    const rows = state.products.filter((p) => {
      const hay = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      return (collection === 'all' || p.collection === collection) && (!q || hay.includes(q));
    }).sort((a, b) => {
      const byCollection = String(a.collection).localeCompare(String(b.collection));
      if (byCollection) return byCollection;
      const byCategory = (categoryOrder.get(`${a.collection}:${a.category}`) ?? 1000) - (categoryOrder.get(`${b.collection}:${b.category}`) ?? 1000);
      if (byCategory) return byCategory;
      return Number(a.sort_order || 100) - Number(b.sort_order || 100);
    });
    $('productsTable').innerHTML = rows.map(productRow).join('') || `<tr><td colspan="6" class="muted">Aucun produit trouve.</td></tr>`;
  }

  function productRow(p) {
    return `<tr>
      <td><div class="product-cell"><img class="product-thumb" src="${esc(p.image_url || 'images/logo.webp')}" alt=""><div><strong>${esc(p.name)}</strong><span class="muted">${esc(p.description || '')}</span></div></div></td>
      <td><span class="pill">${esc(p.collection)}</span></td>
      <td>${esc(p.category)}</td>
      <td><strong>${money(p.price)}</strong></td>
      <td><span class="pill ${p.is_active ? 'green' : 'red'}">${p.is_active ? 'Actif' : 'Masque'}</span></td>
      <td><div class="row-actions"><button class="small-btn" data-action="edit" data-id="${p.id}">Editer</button><button class="small-btn danger" data-action="delete" data-id="${p.id}">Supprimer</button></div></td>
    </tr>`;
  }

  function onProductAction(event) {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    const product = state.products.find((p) => p.id === btn.dataset.id);
    if (!product) return;
    if (btn.dataset.action === 'edit') fillProductForm(product);
    if (btn.dataset.action === 'delete') deleteProduct(product);
  }

  function fillProductForm(p) {
    $('productFormTitle').textContent = 'Modifier produit';
    $('productId').value = p.id;
    $('productCollection').value = p.collection || 'gateau';
    renderCategorySelect(p.category || '');
    $('productName').value = p.name || '';
    $('productDescription').value = p.description || '';
    $('productImage').value = p.image_url || '';
    renderProductImagePreview(p.image_url || '');
    $('productPrice').value = p.price || 0;
    $('productOrder').value = p.sort_order || 100;
    $('productPromo').checked = Boolean(p.is_promo);
    $('productNew').checked = Boolean(p.is_new);
    $('productActive').checked = p.is_active !== false;
  }

  function resetProductForm() {
    $('productFormTitle').textContent = 'Gestion produits';
    $('productForm').reset();
    $('productId').value = '';
    $('productOrder').value = 100;
    $('productActive').checked = true;
    $('productImageFile').value = '';
    renderProductImagePreview('');
    renderCategorySelect();
  }

  async function onProductImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      event.target.value = '';
      return toast('Veuillez choisir une image valide', 'warning');
    }
    try {
      toast('Upload de l image...', 'info');
      const fileName = imageFileName(file);
      const saved = await uploadProductImage(file, fileName);
      const path = saved.path;
      $('productImage').value = path;
      renderProductImagePreview(path);
      toast('Image importee');
    } catch (error) {
      event.target.value = '';
      toast(error.message || 'Image non importee', 'error');
    }
  }

  function imageFileName(file) {
    const base = $('productName').value.trim() || file.name.replace(/\.[^.]+$/, '');
    return `${slugify(base)}-${Date.now()}.${imageExtension(file)}`;
  }

  function imageExtension(file) {
    const fromName = (file.name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase();
    if (fromName) return fromName === 'jpeg' ? 'jpg' : fromName;
    const fromType = (file.type.split('/')[1] || 'jpg').toLowerCase();
    return fromType === 'jpeg' ? 'jpg' : fromType;
  }

  function slugify(value) {
    return String(value || 'produit')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'produit';
  }

  async function uploadProductImage(file, fileName) {
    if (!db?.storage) throw new Error('Supabase Storage non disponible');
    const collection = slugify($('productCollection').value || 'produits');
    const storagePath = `products/${collection}/${fileName}`;
    const { error } = await db.storage
      .from('product-images')
      .upload(storagePath, file, {
        cacheControl: '31536000',
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });
    if (error) {
      const message = /bucket/i.test(error.message)
        ? 'Creez le bucket Supabase Storage product-images puis reessayez'
        : error.message;
      throw new Error(message);
    }
    const { data } = db.storage.from('product-images').getPublicUrl(storagePath);
    if (!data?.publicUrl) throw new Error('URL publique image introuvable');
    return { path: data.publicUrl };
  }

  function renderProductImagePreview(path) {
    $('productImagePath').textContent = path || 'Aucune image importee';
    $('productImageThumb').src = path || 'images/logo.webp';
  }

  async function saveProduct(event) {
    event.preventDefault();
    const id = $('productId').value;
    const payload = {
      collection: $('productCollection').value,
      category: $('productCategory').value.trim(),
      name: $('productName').value.trim(),
      description: $('productDescription').value.trim(),
      image_url: $('productImage').value.trim(),
      price: Number($('productPrice').value || 0),
      sort_order: Number($('productOrder').value || 100),
      is_promo: $('productPromo').checked,
      is_new: $('productNew').checked,
      is_active: $('productActive').checked
    };
    const result = id ? await db.from('products').update(payload).eq('id', id) : await db.from('products').insert(payload);
    if (result.error) return toast(result.error.message, 'error');
    toast('Produit enregistre');
    resetProductForm();
    await loadAll();
  }

  async function deleteProduct(product) {
    const confirmed = await confirmAction({
      title: 'Supprimer ce produit ?',
      text: product.name,
      confirmText: 'Supprimer'
    });
    if (!confirmed) return;
    const { error } = await db.from('products').delete().eq('id', product.id);
    if (error) return toast(error.message, 'error');
    toast('Produit supprime');
    await loadAll();
  }

  function statusLabel(value) {
    return String(value || '').replaceAll('_', ' ');
  }

  function statusClass(value) {
    if (['terminee', 'confirmee', 'prete'].includes(value)) return 'green';
    if (['annulee'].includes(value)) return 'red';
    return '';
  }

  function subscribeRealtime() {
    if (window._mgAdminChannel) return;
    window._mgAdminChannel = db.channel('admin-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_reservations' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_categories' }, loadAll)
      .subscribe();
  }

  function runMotion() {
    if (!window.gsap) return;
    window.gsap.fromTo('.view-panel.is-active .mg-panel', { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.55, ease: 'power3.out' });
    window.gsap.fromTo('.metric-card', { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: 'power2.out' });
    window.gsap.fromTo('.scrub-title', { opacity: 0.2, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }

  init();
})();
