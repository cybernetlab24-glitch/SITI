/*
 * BERNINI SPORT — front-end mockup, zero dependencies.
 * DISCLAIMER: no payments, no backend, no orders sent to a merchant.
 */
(() => {
  'use strict';
  const products = Array.isArray(window.BERNINI_PRODUCTS) ? window.BERNINI_PRODUCTS : [];
  const config = window.BERNINI_CONFIG || { currency: 'EUR', demoShippingThreshold: 79 };
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const categories = ['Tutti', 'Running', 'Fitness', 'Calcio', 'Outdoor', 'Tennis', 'Accessori', 'Offerte'];
  const number = new Intl.NumberFormat('it-IT', { style: 'currency', currency: config.currency || 'EUR' });
  const euros = (value) => number.format(value);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const storageKey = 'bernini-sport-demo-v1';
  const restore = () => {
    try { const parsed = JSON.parse(localStorage.getItem(storageKey)); return parsed && typeof parsed === 'object' ? parsed : {}; }
    catch { return {}; }
  };
  const saved = restore();
  const state = {
    category: 'Tutti', query: '', sort: 'featured', favoritesOnly: false,
    favorites: new Set(Array.isArray(saved.favorites) ? saved.favorites.filter((id) => products.some((p) => p.id === id)) : []),
    cart: saved.cart && typeof saved.cart === 'object' ? saved.cart : {},
    activeProduct: null, activeSize: null
  };
  const findProduct = (id) => products.find((p) => p.id === id);
  const keyFor = (id, size) => `${id}::${size || 'unica'}`;
  const persist = () => {
    try { localStorage.setItem(storageKey, JSON.stringify({ favorites: [...state.favorites], cart: state.cart })); }
    catch { /* La demo resta utilizzabile senza archiviazione locale. */ }
  };
  const safeImg = (url) => escapeHTML(url || 'assets/image-placeholder.svg');
  const imgError = (image) => { image.onerror = null; image.src = 'assets/image-placeholder.svg'; };
  window.berniniImageFallback = imgError;
  let toastTimer;
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 2600);
  }
  function filteredProducts() {
    const q = state.query.trim().toLocaleLowerCase('it-IT');
    const result = products.filter((p) => {
      if (state.category === 'Offerte' && !(p.oldPrice && p.oldPrice > p.price)) return false;
      if (!['Tutti', 'Offerte'].includes(state.category) && p.category !== state.category) return false;
      if (state.favoritesOnly && !state.favorites.has(p.id)) return false;
      return !q || [p.name, p.brand, p.category, p.subtitle].some((text) => (text || '').toLocaleLowerCase('it-IT').includes(q));
    });
    if (state.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (state.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (state.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'it'));
    else result.sort((a, b) => a.featured - b.featured);
    return result;
  }
  function imageMarkup(p, lazy = true) {
    return `<img src="${safeImg(p.image)}" alt="${escapeHTML(p.name)}" ${lazy ? 'loading="lazy"' : ''} decoding="async" onerror="berniniImageFallback(this)">`;
  }
  function renderCatalog() {
    const items = filteredProducts();
    $('#catalog-filters').innerHTML = categories.map((category) => `<button type="button" class="filter-chip ${category === state.category ? 'active' : ''}" data-category="${escapeHTML(category)}">${category === 'Offerte' ? '⚡ ' : ''}${category}</button>`).join('');
    $$('.nav-link, .mobile-nav button').forEach((button) => button.classList.toggle('active', button.dataset.category === state.category));
    $('#favorites-toggle').classList.toggle('selected', state.favoritesOnly);
    $('#favorites-indicator').hidden = !state.favorites.size;
    $('#result-count').textContent = `${items.length} ${items.length === 1 ? 'prodotto' : 'prodotti'}`;
    $('#catalog-title').innerHTML = state.favoritesOnly ? 'I TUOI <span>PREFERITI.</span>' : state.query ? 'LA TUA <span>RICERCA.</span>' : state.category !== 'Tutti' ? `${escapeHTML(state.category.toUpperCase())}<span>.</span>` : 'SCELTI PER <span>TE.</span>';
    $('#catalog-description').textContent = state.favoritesOnly ? 'Gli articoli che hai salvato.' : state.query ? `Risultati per “${state.query}”` : 'Tutto quello che ti serve per dare il massimo.';
    $('#products-grid').innerHTML = items.length ? items.map((p) => `
      <article class="product-card">
        <div class="product-photo"><button class="product-image-open" type="button" data-open-product="${escapeHTML(p.id)}" aria-label="Visualizza ${escapeHTML(p.name)}">
          ${imageMarkup(p)}</button>
          ${p.tag ? `<span class="product-badge ${p.oldPrice ? 'discount' : ''}">${escapeHTML(p.tag)}</span>` : ''}
          <button class="heart-button ${state.favorites.has(p.id) ? 'liked' : ''}" type="button" data-favorite="${escapeHTML(p.id)}" aria-label="${state.favorites.has(p.id) ? 'Rimuovi dai' : 'Aggiungi ai'} preferiti"><svg viewBox="0 0 24 24"><path d="M20.5 5.5a5.5 5.5 0 0 0-7.7 0l-.8.8-.8-.8a5.5 5.5 0 0 0-7.7 7.8L12 21l8.5-7.7a5.5 5.5 0 0 0 0-7.8Z"/></svg></button>
        </div>
        <div class="product-details"><div class="product-brand">${escapeHTML(p.brand)}</div>
          <button class="product-name" type="button" data-open-product="${escapeHTML(p.id)}">${escapeHTML(p.name)}</button>
          <div class="product-subtitle">${escapeHTML(p.subtitle)}</div>
          <div class="product-footer"><div><span class="product-price">${euros(p.price)}</span>${p.oldPrice ? `<span class="product-old">${euros(p.oldPrice)}</span>` : ''}</div><button type="button" class="add-button" data-add="${escapeHTML(p.id)}" aria-label="Aggiungi ${escapeHTML(p.name)} al carrello">+</button></div>
        </div>
      </article>`).join('') : '<div class="empty-results"><strong>Nessun prodotto trovato.</strong><p>Prova a cambiare ricerca o categoria.</p><button class="btn btn-dark" data-action="reset">MOSTRA TUTTI ↗</button></div>';
    updateCount();
  }
  function scrollToId(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function selectCategory(category) {
    state.category = categories.includes(category) ? category : 'Tutti'; state.favoritesOnly = false;
    renderCatalog(); scrollToId('catalogo');
  }
  function reset() {
    state.category = 'Tutti'; state.favoritesOnly = false; state.query = ''; $('#search-input').value = '';
    state.sort = 'featured'; $('#sort-select').value = 'featured'; renderCatalog();
  }
  function switchFavorites() {
    state.favoritesOnly = !state.favoritesOnly; state.category = 'Tutti';
    renderCatalog(); scrollToId('catalogo');
  }
  function toggleFavorite(id) {
    if (!findProduct(id)) return;
    if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
    persist(); renderCatalog(); toast(state.favorites.has(id) ? 'Aggiunto ai preferiti' : 'Rimosso dai preferiti');
  }
  function validatedCart() {
    Object.entries(state.cart).forEach(([key, line]) => {
      if (!line || !findProduct(line.productId) || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99 || key !== keyFor(line.productId, line.size)) delete state.cart[key];
    });
  }
  function updateCount() {
    validatedCart();
    const count = Object.values(state.cart).reduce((sum, item) => sum + item.quantity, 0);
    $('#cart-count').textContent = count;
    $('#cart-label-count').textContent = `(${count})`;
  }
  function addToCart(id, size = null) {
    const p = findProduct(id); if (!p) return;
    if (p.sizes.length && !p.sizes.includes(size)) { openProduct(id); return; }
    const key = keyFor(id, size);
    if (!state.cart[key]) state.cart[key] = { productId: id, size: size || 'unica', quantity: 0 };
    state.cart[key].quantity = Math.min(99, state.cart[key].quantity + 1);
    persist(); updateCount(); toast('✓ Articolo aggiunto al carrello');
    if (!$('#cart-overlay').hidden) renderCart();
  }
  function updateQuantity(key, delta) {
    if (!state.cart[key]) return;
    state.cart[key].quantity += delta;
    if (state.cart[key].quantity < 1) delete state.cart[key];
    else state.cart[key].quantity = Math.min(99, state.cart[key].quantity);
    persist(); renderCart();
  }
  function renderCart() {
    validatedCart(); updateCount();
    const lines = Object.entries(state.cart);
    const total = lines.reduce((n, [, line]) => n + findProduct(line.productId).price * line.quantity, 0);
    $('#cart-items').innerHTML = lines.length ? lines.map(([key, line]) => {
      const p = findProduct(line.productId);
      return `<div class="cart-line">${imageMarkup(p)}<div class="cart-line-info"><strong>${escapeHTML(p.name)}</strong><small>${line.size !== 'unica' ? `Taglia: ${escapeHTML(line.size)} · ` : ''}${euros(p.price)}</small><div class="cart-line-quantity"><button data-quantity="-1" data-key="${escapeHTML(key)}" aria-label="Riduci quantità">−</button><b>${line.quantity}</b><button data-quantity="1" data-key="${escapeHTML(key)}" aria-label="Aumenta quantità">+</button><button class="remove" data-remove="${escapeHTML(key)}">Rimuovi</button></div></div></div>`;
    }).join('') : '<div class="cart-empty"><svg viewBox="0 0 24 24"><path d="M4.5 9h15l-1.2 12H5.7L4.5 9ZM8.5 9V6a3.5 3.5 0 0 1 7 0v3"/></svg><strong>Il carrello è vuoto.</strong><p>La prossima sfida inizia dalla giusta attrezzatura.</p><button class="btn btn-dark" data-action="close-cart">CONTINUA LO SHOPPING ↗</button></div>';
    $('#cart-summary').innerHTML = lines.length ? `<div class="shipping-note">${total >= config.demoShippingThreshold ? 'Soglia di spedizione demo raggiunta.' : `Ti mancano ${euros(config.demoShippingThreshold - total)} alla soglia demo di ${euros(config.demoShippingThreshold)}.`}</div><div class="cart-total"><span>Subtotale</span><span>${euros(total)}</span></div><button class="btn btn-dark" data-action="checkout">PROCEDI AL CHECKOUT <span>↗</span></button><p class="cart-disclaimer">Demo: non si effettuano pagamenti né ordini.</p>` : '';
  }
  function lockScroll(locked) { document.body.style.overflow = locked ? 'hidden' : ''; }
  function openCart() { renderCart(); $('#cart-overlay').hidden = false; lockScroll(true); $('#cart-overlay .close-icon').focus(); }
  function closeCart() { $('#cart-overlay').hidden = true; lockScroll(false); $('#cart-toggle').focus(); }
  function renderProductModal() {
    const p = state.activeProduct; if (!p) return;
    $('#product-modal-content').innerHTML = `
      <button class="close-icon modal-close" data-action="close-product" aria-label="Chiudi scheda prodotto">×</button>
      <div>${imageMarkup(p, false)}</div>
      <div class="modal-details"><div class="eyebrow">${escapeHTML(p.category.toUpperCase())} / ${escapeHTML(p.brand)}</div><h2 id="modal-product-title">${escapeHTML(p.name)}</h2><span>${escapeHTML(p.subtitle)}</span><div class="modal-price">${euros(p.price)} ${p.oldPrice ? `<span class="product-old">${euros(p.oldPrice)}</span>` : ''}</div><p>Questo è un articolo dimostrativo. Nello shop definitivo saranno disponibili descrizioni tecniche, informazioni sui materiali, taglie, foto reali e disponibilità di magazzino.</p>
      ${p.sizes.length ? `<div class="modal-size-title">SELEZIONA TAGLIA</div><div class="size-options">${p.sizes.map((s) => `<button class="size-option ${state.activeSize === s ? 'selected' : ''}" data-size="${escapeHTML(s)}">${escapeHTML(s)}</button>`).join('')}</div>` : '<div class="modal-size-title">TAGLIA UNICA</div>'}
      <button class="btn btn-dark" data-action="modal-add">AGGIUNGI AL CARRELLO <span>↗</span></button><p class="modal-note">Catalogo illustrativo · Acquisti non attivi</p></div>`;
    const img = $('#product-modal-content img'); if (img) img.classList.add('modal-image');
  }
  function openProduct(id) {
    const p = findProduct(id); if (!p) return;
    state.activeProduct = p; state.activeSize = p.sizes[0] || null;
    renderProductModal(); $('#product-overlay').hidden = false; lockScroll(true);
    $('#product-overlay .close-icon').focus();
  }
  function closeProduct() { $('#product-overlay').hidden = true; state.activeProduct = null; lockScroll(false); }
  function openInfo() { $('#info-overlay').hidden = false; lockScroll(true); $('#info-overlay .close-icon').focus(); }
  function closeInfo() { $('#info-overlay').hidden = true; lockScroll(false); }
  document.addEventListener('click', (event) => {
    const el = event.target.closest('button, [data-open-product], [data-action]'); if (!el) return;
    if (el.dataset.favorite) { event.stopPropagation(); toggleFavorite(el.dataset.favorite); return; }
    if (el.dataset.category) { selectCategory(el.dataset.category); return; }
    if (el.dataset.add) { addToCart(el.dataset.add); return; }
    if (el.dataset.openProduct) { openProduct(el.dataset.openProduct); return; }
    if (el.dataset.quantity) { updateQuantity(el.dataset.key, Number(el.dataset.quantity)); return; }
    if (el.dataset.remove) { delete state.cart[el.dataset.remove]; persist(); renderCart(); return; }
    if (el.dataset.size) { state.activeSize = el.dataset.size; renderProductModal(); return; }
    switch (el.dataset.action) {
      case 'home': event.preventDefault(); reset(); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      case 'reset': reset(); scrollToId('catalogo'); break;
      case 'close-cart': closeCart(); break;
      case 'close-product': closeProduct(); break;
      case 'modal-add': if (state.activeProduct) { addToCart(state.activeProduct.id, state.activeSize); closeProduct(); openCart(); } break;
      case 'close-info': closeInfo(); break;
      case 'info': openInfo(); break;
      case 'checkout': toast('Checkout non attivo: serve integrazione e-commerce e pagamenti.'); break;
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { if (!$('#product-overlay').hidden) closeProduct(); else if (!$('#cart-overlay').hidden) closeCart(); else if (!$('#info-overlay').hidden) closeInfo(); }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-open-product][role="button"]')) { event.preventDefault(); openProduct(event.target.dataset.openProduct); }
  });
  $('#cart-toggle').addEventListener('click', openCart);
  $('#favorites-toggle').addEventListener('click', switchFavorites);
  $('#hero-shop').addEventListener('click', () => scrollToId('catalogo'));
  $('#hero-categories').addEventListener('click', () => scrollToId('categorie'));
  $('#reset-filters').addEventListener('click', () => { reset(); scrollToId('catalogo'); });
  $('#sort-select').addEventListener('change', (event) => { state.sort = event.target.value; renderCatalog(); });
  $('#search-input').addEventListener('input', (event) => { state.query = event.target.value; state.favoritesOnly = false; renderCatalog(); });
  $('#search-form').addEventListener('submit', (event) => { event.preventDefault(); scrollToId('catalogo'); });
  $('#newsletter-form').addEventListener('submit', (event) => { event.preventDefault(); toast('Iscrizione dimostrativa: nessuna email è stata inviata.'); event.target.reset(); });
  $('#year').textContent = new Date().getFullYear();
  renderCatalog(); updateCount();
})();
