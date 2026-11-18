/* BERNINI SPORT — navigazione multipagina, catalogo e carrello locale.
   DEMO: non esistono ordini reali, backend, pagamenti o invii email. */
(() => {
  'use strict';
  const products = Array.isArray(window.BERNINI_PRODUCTS) ? window.BERNINI_PRODUCTS : [];
  const config = window.BERNINI_CONFIG || {};
  const root = document.body.dataset.root || '';
  const page = document.body.dataset.page || '';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const money = new Intl.NumberFormat('it-IT', {style:'currency', currency:'EUR'});
  const euros = n => money.format(n);
  const escapeHTML = val => String(val ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storageKey = 'bernini-sport-demo-v1'; // compatibile con la precedente demo
  const categories = ['Tutti','Running','Fitness','Calcio','Outdoor','Tennis','Accessori','Offerte'];
  const categorySlugs = {'Tutti':'shop.html','Running':'categoria-running.html','Fitness':'categoria-fitness.html','Calcio':'categoria-calcio.html','Outdoor':'categoria-outdoor.html','Tennis':'categoria-tennis.html','Accessori':'categoria-accessori.html','Offerte':'offerte.html'};
  const urlForCategory = cat => root + (categorySlugs[cat] || 'shop.html');
  const urlForProduct = p => root + 'prodotti/' + p.slug + '.html';
  const findProduct = id => products.find(p => p.id === id);
  const keyFor = (id, size) => `${id}::${size || 'unica'}`;
  function readStore(){try{let v=JSON.parse(localStorage.getItem(storageKey));return v && typeof v==='object' ? v : {}}catch{return {}}}
  const stored = readStore();
  const state = {
    cart: stored.cart && typeof stored.cart==='object' && !Array.isArray(stored.cart) ? stored.cart : {},
    favorites: new Set(Array.isArray(stored.favorites) ? stored.favorites.filter(id => !!findProduct(id)) : []),
    sort: 'featured', maxPrice: 250, saleOnly: false, query: '', pageNum: 1, selectedSize: null, quantity: 1
  };
  let toastTimer;
  function save(){try{localStorage.setItem(storageKey, JSON.stringify({cart:state.cart,favorites:[...state.favorites]}))}catch{}}
  function sanitizeCart(){
    Object.entries(state.cart).forEach(([key,line]) => {
      if(!line || !findProduct(line.productId) || !Number.isInteger(line.quantity) || line.quantity<1 || line.quantity>99 || key!==keyFor(line.productId,line.size)) delete state.cart[key];
    });
  }
  function countCart(){sanitizeCart();return Object.values(state.cart).reduce((sum,line)=>sum+line.quantity,0)}
  function updateIndicators(){
    $$('.cart-badge').forEach(el=>el.textContent=countCart());
    $$('.fav-badge').forEach(el=>{el.hidden=state.favorites.size===0;el.textContent=state.favorites.size});
  }
  function notify(msg){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
  function imageMarkup(p,lazy=true){return `<img src="${escapeHTML(p.image || root+'assets/image-placeholder.svg')}" alt="${escapeHTML(p.name)}" ${lazy?'loading="lazy"':''} decoding="async">`}
  function productCard(p){
    return `<article class="product-card">
      <div class="product-photo"><a href="${urlForProduct(p)}" aria-label="Scopri ${escapeHTML(p.name)}">${imageMarkup(p)}</a>
      ${p.tag?`<span class="product-tag ${p.oldPrice?'discount':''}">${escapeHTML(p.tag)}</span>`:''}
      <button class="favorite-toggle ${state.favorites.has(p.id)?'selected':''}" type="button" data-favorite="${escapeHTML(p.id)}" aria-label="${state.favorites.has(p.id)?'Rimuovi dai':'Aggiungi ai'} preferiti" aria-pressed="${state.favorites.has(p.id)}"><svg viewBox="0 0 24 24"><path d="M20.5 5.5a5.5 5.5 0 0 0-7.7 0l-.8.8-.8-.8a5.5 5.5 0 0 0-7.7 7.8L12 21l8.5-7.7a5.5 5.5 0 0 0 0-7.8Z"/></svg></button></div>
      <div class="product-details"><div class="product-brand">${escapeHTML(p.brand)}</div><a class="product-title" href="${urlForProduct(p)}">${escapeHTML(p.name)}</a><div class="product-subtitle">${escapeHTML(p.subtitle)}</div>
      <div class="product-price-row"><div><span class="price">${euros(p.price)}</span>${p.oldPrice?`<span class="price-old">${euros(p.oldPrice)}</span>`:''}</div><button class="quick-add" type="button" data-quick-add="${escapeHTML(p.id)}" aria-label="${p.sizes.length?'Scegli la taglia per':'Aggiungi al carrello'}: ${escapeHTML(p.name)}">+</button></div></div></article>`;
  }
  function drawCards(node,list,empty='Non ci sono articoli da mostrare.'){
    if(!node)return;
    node.innerHTML=list.length?list.map(productCard).join(''):`<div class="empty-state"><strong>${escapeHTML(empty)}</strong><p>Esplora altri prodotti dal catalogo.</p><a class="btn btn-dark" href="${root}shop.html">VAI ALLO SHOP ↗</a></div>`;
  }
  function renderHome(){
    drawCards($('#featured-products'),products.slice().sort((a,b)=>a.featured-b.featured).slice(0,4));
    drawCards($('#offers-products'),products.filter(p=>p.oldPrice>p.price).slice(0,4));
  }
  function toggleFavorite(id){
    if(!findProduct(id))return;
    state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);
    save();updateIndicators();notify(state.favorites.has(id)?'Aggiunto ai preferiti':'Rimosso dai preferiti');
    $$("[data-favorite]").forEach(btn=>{if(btn.dataset.favorite===id){let selected=state.favorites.has(id);btn.classList.toggle('selected',selected);btn.setAttribute('aria-pressed',String(selected));btn.setAttribute('aria-label',selected?'Rimuovi dai preferiti':'Aggiungi ai preferiti')}});
    if(page==='favorites')renderFavorites();
  }
  function renderFavorites(){drawCards($('#favorites-products'),products.filter(p=>state.favorites.has(p.id)),'Non hai ancora salvato prodotti.');let n=$('#favorites-count');if(n)n.textContent=`${state.favorites.size} articoli salvati`}
  function renderCategoryLinks(active){
    let node=$('#category-links');if(!node)return;
    node.innerHTML=categories.map(cat=>`<a class="side-category ${cat===active?'active':''}" href="${urlForCategory(cat)}" ${cat===active?'aria-current="page"':''}><span>${cat}</span><span class="side-count">${cat==='Tutti'?products.length:products.filter(p=>cat==='Offerte'?p.oldPrice>p.price:p.category===cat).length}</span></a>`).join('');
  }
  function initializeCatalog(){
    const url=new URL(location.href);const isCategory=page==='category';const chosen=isCategory?document.body.dataset.category:'Tutti';
    const initialQ=!isCategory?(url.searchParams.get('q')||''):'';
    state.query=initialQ;
    let qInput=$('#catalog-query');if(qInput)qInput.value=initialQ;
    let sort=$('#catalog-sort');if(sort)sort.value=state.sort;
    let range=$('#price-range');if(range){range.value=state.maxPrice;$('#price-value').textContent=euros(state.maxPrice)}
    renderCategoryLinks(chosen);
    function refresh(){
      const q=state.query.trim().toLocaleLowerCase('it-IT');
      let list=products.filter(p=>(chosen==='Tutti'||(chosen==='Offerte'?p.oldPrice>p.price:p.category===chosen)) && p.price<=state.maxPrice && (!state.saleOnly || p.oldPrice>p.price) && (!q||[p.name,p.subtitle,p.brand,p.category].some(x=>String(x||'').toLocaleLowerCase('it-IT').includes(q))));
      if(state.sort==='price-asc')list.sort((a,b)=>a.price-b.price);
      else if(state.sort==='price-desc')list.sort((a,b)=>b.price-a.price);
      else if(state.sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name,'it'));
      else list.sort((a,b)=>a.featured-b.featured);
      const count=$('#catalog-count');if(count)count.textContent=`${list.length} ${list.length===1?'prodotto':'prodotti'} trovati`;
      const info=$('#catalog-query-caption');if(info)info.textContent=q?`Risultati per “${state.query.trim()}”`:'';
      const perPage=8;const pages=Math.max(1,Math.ceil(list.length/perPage));state.pageNum=Math.min(state.pageNum,pages);
      drawCards($('#catalog-products'),list.slice((state.pageNum-1)*perPage,state.pageNum*perPage),'Nessun articolo corrisponde ai filtri.');
      const pagination=$('#catalog-pages');if(pagination){pagination.innerHTML=list.length>perPage?Array.from({length:pages},(_,i)=>`<button type="button" data-page-num="${i+1}" class="${i+1===state.pageNum?'active':''}" aria-label="Pagina ${i+1}" ${i+1===state.pageNum?'aria-current="page"':''}>${i+1}</button>`).join(''):''}
    }
    $('#catalog-query')?.addEventListener('input',e=>{state.query=e.target.value;state.pageNum=1;refresh()});
    $('#catalog-sort')?.addEventListener('change',e=>{state.sort=e.target.value;state.pageNum=1;refresh()});
    $('#price-range')?.addEventListener('input',e=>{state.maxPrice=Number(e.target.value);$('#price-value').textContent=euros(state.maxPrice);state.pageNum=1;refresh()});
    $('#sale-only')?.addEventListener('change',e=>{state.saleOnly=e.target.checked;state.pageNum=1;refresh()});
    $('#catalog-pages')?.addEventListener('click',e=>{const b=e.target.closest('[data-page-num]');if(!b)return;state.pageNum=Number(b.dataset.pageNum);refresh();$('#catalog-anchor')?.scrollIntoView({behavior:'smooth'})});
    $('#reset-filters')?.addEventListener('click',()=>{state.query='';state.sort='featured';state.maxPrice=250;state.saleOnly=false;state.pageNum=1;$('#catalog-query').value='';$('#catalog-sort').value='featured';$('#price-range').value='250';$('#price-value').textContent=euros(250);$('#sale-only').checked=false;refresh()});
    refresh();
  }
  function addToCart(p,size,quantity=1){
    if(!p)return;
    if(p.sizes.length && !p.sizes.includes(size)){location.href=urlForProduct(p);return}
    const key=keyFor(p.id,size);if(!state.cart[key])state.cart[key]={productId:p.id,size:size||'unica',quantity:0};
    state.cart[key].quantity=Math.min(99,state.cart[key].quantity+quantity);save();updateIndicators();notify('✓ Articolo aggiunto al carrello');
  }
  function renderProduct(){
    const p=findProduct(document.body.dataset.productId);const panel=$('#product-content');if(!panel)return;
    if(!p){panel.innerHTML=`<div class="empty-state"><strong>Prodotto non trovato.</strong><a class="btn btn-dark" href="${root}shop.html">VAI ALLO SHOP</a></div>`;return}
    state.selectedSize=null;state.quantity=1;
    const crumb=$('#product-breadcrumb');if(crumb)crumb.innerHTML=`<a href="${root}index.html">Home</a> / <a href="${urlForCategory(p.category)}">${escapeHTML(p.category)}</a> / ${escapeHTML(p.name)}`;
    panel.innerHTML=`<div class="product-main"><div class="product-visual">${imageMarkup(p,false)}${p.tag?`<span class="product-tag ${p.oldPrice?'discount':''}">${escapeHTML(p.tag)}</span>`:''}</div>
    <div class="product-info"><div class="eyebrow">${escapeHTML(p.category)} / ${escapeHTML(p.brand)}</div><h1>${escapeHTML(p.name)}</h1><div class="subtitle">${escapeHTML(p.subtitle)}</div><div class="detail-price">${euros(p.price)} ${p.oldPrice?`<del>${euros(p.oldPrice)}</del>`:''}</div><p class="detail-desc">Questo articolo è parte del catalogo dimostrativo Bernini Sport. Le caratteristiche tecniche, le foto, i prezzi e le disponibilità definitive saranno inseriti con le informazioni reali del negozio.</p>
    ${p.sizes.length?`<div class="size-caption">SELEZIONA TAGLIA <span id="selected-size-label" style="color:var(--orange)"></span></div><div class="size-options">${p.sizes.map(s=>`<button class="size-option" type="button" data-select-size="${escapeHTML(s)}" aria-pressed="false">${escapeHTML(s)}</button>`).join('')}</div>`:'<div class="size-caption" style="margin-bottom:20px">TAGLIA UNICA</div>'}
    <div class="buy-controls"><div class="quantity-control"><button type="button" data-qty="-1" aria-label="Diminuisci quantità">−</button><span id="purchase-qty">1</span><button type="button" data-qty="1" aria-label="Aumenta quantità">+</button></div><button class="btn btn-dark" type="button" data-add-detail>AGGIUNGI AL CARRELLO ↗</button></div>
    <div class="demo-note">Prodotto, prezzo e disponibilità sono dimostrativi. Nessun acquisto reale è possibile.</div><div class="detail-extra"><strong>Per il sito definitivo:</strong> scheda tecnica, materiali, varianti, disponibilità, guida alle taglie, recensioni reali e spedizione da definire.</div></div></div>`;
    const sameCategory=products.filter(x=>x.category===p.category&&x.id!==p.id);
    drawCards($('#related-products'),(sameCategory.length?sameCategory:products.filter(x=>x.id!==p.id)).slice(0,4));
  }
  function modifyQuantity(key,delta){const line=state.cart[key];if(!line)return;line.quantity+=delta;if(line.quantity<1)delete state.cart[key];else line.quantity=Math.min(99,line.quantity);save();renderCart();updateIndicators()}
  function renderCart(){
    const wrap=$('#cart-list');const summary=$('#order-summary');if(!wrap||!summary)return;
    sanitizeCart();const lines=Object.entries(state.cart);const subtotal=lines.reduce((s,[,line])=>s+findProduct(line.productId).price*line.quantity,0);
    wrap.innerHTML=lines.length?`<div class="cart-heading"><span>PRODOTTO</span><span>QUANTITÀ</span><span>SUBTOTALE</span><span></span></div>`+lines.map(([key,line])=>{let p=findProduct(line.productId);return `<article class="cart-line"><div class="cart-ident">${imageMarkup(p)}<div><strong>${escapeHTML(p.name)}</strong><small>${line.size!=='unica'?'Taglia '+escapeHTML(line.size)+' · ':''}${euros(p.price)} cad.</small><a href="${urlForProduct(p)}">Dettagli prodotto ↗</a></div></div><div class="cart-quantity"><button data-cart-qty="-1" data-cart-key="${escapeHTML(key)}" aria-label="Diminuisci quantità">−</button><span>${line.quantity}</span><button data-cart-qty="1" data-cart-key="${escapeHTML(key)}" aria-label="Aumenta quantità">+</button></div><div class="cart-line-price">${euros(line.quantity*p.price)}</div><button class="remove-button" type="button" data-cart-remove="${escapeHTML(key)}" aria-label="Rimuovi ${escapeHTML(p.name)}">×</button></article>`}).join(''):`<div class="cart-empty"><h2>Il tuo carrello è vuoto.</h2><p>Scopri la collezione e aggiungi i tuoi prodotti preferiti.</p><a class="btn btn-dark" href="${root}shop.html">TORNA ALLO SHOP ↗</a></div>`;
    summary.innerHTML=`<div class="order-summary"><h2>Riepilogo ordine</h2><div class="summary-row"><span>Articoli</span><strong>${countCart()}</strong></div><div class="summary-row"><span>Subtotale</span><strong>${euros(subtotal)}</strong></div><div class="summary-row"><span>Spedizione</span><span>Da definire</span></div><div class="summary-total"><span>Subtotale</span><span>${euros(subtotal)}</span></div>${subtotal>0?`<button class="btn btn-dark" type="button" data-demo-checkout>CHECKOUT NON ATTIVO ↗</button>`:`<a class="btn btn-dark" href="${root}shop.html">SCOPRI I PRODOTTI ↗</a>`}<p class="summary-small">Demo: non vengono creati ordini, incassati pagamenti né calcolate imposte o tariffe di spedizione.</p></div>`;
  }
  document.addEventListener('click',event=>{
    const fav=event.target.closest('[data-favorite]');if(fav){event.preventDefault();toggleFavorite(fav.dataset.favorite);return}
    const quick=event.target.closest('[data-quick-add]');if(quick){let p=findProduct(quick.dataset.quickAdd);if(p){if(p.sizes.length)location.href=urlForProduct(p);else addToCart(p,null)}return}
    const size=event.target.closest('[data-select-size]');if(size){state.selectedSize=size.dataset.selectSize;$$('[data-select-size]').forEach(el=>{const on=el===size;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});let label=$('#selected-size-label');if(label)label.textContent='· '+state.selectedSize;return}
    const detail=event.target.closest('[data-add-detail]');if(detail){let p=findProduct(document.body.dataset.productId);if(p?.sizes.length && !state.selectedSize){notify('Seleziona prima una taglia');return}addToCart(p,state.selectedSize,state.quantity);return}
    const qty=event.target.closest('[data-qty]');if(qty){state.quantity=Math.max(1,Math.min(20,state.quantity+Number(qty.dataset.qty)));$('#purchase-qty').textContent=state.quantity;return}
    const cqty=event.target.closest('[data-cart-qty]');if(cqty){modifyQuantity(cqty.dataset.cartKey,Number(cqty.dataset.cartQty));return}
    const rm=event.target.closest('[data-cart-remove]');if(rm){delete state.cart[rm.dataset.cartRemove];save();renderCart();updateIndicators();return}
    if(event.target.closest('[data-demo-checkout]'))notify('Demo: il checkout non è ancora attivo.');
  });
  document.addEventListener('error',e=>{if(e.target?.tagName==='IMG' && !e.target.dataset.errorHandled){e.target.dataset.errorHandled='1';e.target.src=root+'assets/image-placeholder.svg'}},true);
  const menu=$('#menu-toggle');menu?.addEventListener('click',()=>{let opened=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!opened));$('#mobile-menu')?.classList.toggle('open',!opened)});
  $('#contact-form')?.addEventListener('submit',e=>{e.preventDefault();let output=$('#contact-feedback');if(output)output.textContent='Anteprima completata. In questa demo il messaggio non viene inviato: servirà configurare una casella email o un servizio di invio.';notify('Nessun messaggio inviato: modulo demo.');});
  $$('.year').forEach(el=>el.textContent=new Date().getFullYear());
  updateIndicators();
  if(page==='home')renderHome();
  if(page==='shop'||page==='category')initializeCatalog();
  if(page==='product')renderProduct();
  if(page==='cart')renderCart();
  if(page==='favorites')renderFavorites();
})();
