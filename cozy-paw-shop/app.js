const products = [
  {id:'nest',name:'Cuccia Cozy Nest',category:'nanna',label:'Nanna',price:89,image:'../cozy-paw/img/hero-1.jpg',position:'78% 67%',description:'Un posticino soffice per i suoi sonnellini più belli.'},
  {id:'knit',name:'Maglioncino Cozy Knit',category:'wear',label:'Da indossare',price:49,image:'../cozy-paw/img/servizi-3.jpg',position:'72% 45%',description:'Caldo, morbido e pronto per le passeggiate.'},
  {id:'bandana',name:'Bandana Paw Chic',category:'accessori',label:'Piccoli dettagli',price:24,image:'../cozy-paw/img/servizi-3.jpg',position:'28% 50%',description:'Un tocco di colore per il suo stile quotidiano.'},
  {id:'together',name:'Set Cozy Together',category:'accessori',label:'Insieme è meglio',price:129,image:'../cozy-paw/img/chi-siamo-2.jpg',position:'center',description:'Un accessorio coordinato, da condividere.'}
];
const money = value => new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(value);
const grid = document.querySelector('#product-grid');
let cart = loadCart();
let toastTimer;

function loadCart(){try{return JSON.parse(localStorage.getItem('cozy-paw-cart')||'{}')}catch{return {}}}
function saveCart(){localStorage.setItem('cozy-paw-cart',JSON.stringify(cart));renderCart()}
function renderProducts(category='tutti'){
  grid.innerHTML=products.filter(product=>category==='tutti'||product.category===category).map(product=>`<article class="product-card"><div class="product-image"><img src="${product.image}" alt="${product.name}, accessorio artigianale Cozy Paw" style="object-position:${product.position}" loading="lazy"><span class="product-tag">${product.label}</span></div><div class="product-info"><span class="category">Fatto a mano</span><h3>${product.name}</h3><p>${product.description}</p><div class="product-buy"><span class="price">${money(product.price)}</span><button type="button" class="add-button" data-add="${product.id}">Aggiungi +</button></div></div></article>`).join('');
}
function totalItems(){return Object.values(cart).reduce((sum,quantity)=>sum+quantity,0)}
function renderCart(){
  document.querySelectorAll('[data-cart-count]').forEach(node=>node.textContent=totalItems());
  const items=document.querySelector('#cart-items');
  const entries=products.filter(product=>cart[product.id]);
  items.innerHTML=entries.map(product=>`<article class="cart-line"><img src="${product.image}" alt=""><div><h3>${product.name}</h3><span class="line-price">${money(product.price)} · ${money(product.price*cart[product.id])}</span><div class="quantity"><button type="button" data-quantity="${product.id}" data-delta="-1" aria-label="Rimuovi un ${product.name}">−</button><span>${cart[product.id]}</span><button type="button" data-quantity="${product.id}" data-delta="1" aria-label="Aggiungi un ${product.name}">+</button></div></div><button class="remove-item" type="button" data-remove="${product.id}" aria-label="Rimuovi ${product.name}">×</button></article>`).join('');
  document.querySelector('#cart-empty').classList.toggle('show',entries.length===0);
  document.querySelector('#cart-footer').classList.toggle('hidden',entries.length===0);
  document.querySelector('#cart-subtotal').textContent=money(entries.reduce((sum,product)=>sum+product.price*cart[product.id],0));
}
function openCart(){document.querySelector('#cart-drawer').classList.add('open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','false');document.querySelector('[data-cart-close]').hidden=false;document.body.classList.add('drawer-open')}
function closeCart(){document.querySelector('#cart-drawer').classList.remove('open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','true');document.querySelector('[data-cart-close]').hidden=true;document.body.classList.remove('drawer-open')}
function toast(message){const node=document.querySelector('#toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),2200)}

renderProducts();renderCart();document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(item=>item.classList.remove('active'));button.classList.add('active');renderProducts(button.dataset.filter)}));
grid.addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(!button)return;cart[button.dataset.add]=(cart[button.dataset.add]||0)+1;saveCart();toast('Aggiunto al carrello, con amore ♡')});
document.querySelector('[data-cart-open]').addEventListener('click',openCart);
document.querySelectorAll('[data-cart-close]').forEach(node=>node.addEventListener('click',closeCart));
document.querySelector('#cart-items').addEventListener('click',event=>{const quantity=event.target.closest('[data-quantity]');const remove=event.target.closest('[data-remove]');if(quantity){const id=quantity.dataset.quantity;cart[id]=(cart[id]||0)+Number(quantity.dataset.delta);if(cart[id]<=0)delete cart[id];saveCart()}if(remove){delete cart[remove.dataset.remove];saveCart()}});
document.querySelector('[data-checkout]').addEventListener('click',()=>{const summary=products.filter(product=>cart[product.id]).map(product=>`${cart[product.id]} × ${product.name} — ${money(cart[product.id]*product.price)}`).join('<br>');document.querySelector('#order-summary').innerHTML=`${summary}<hr><strong>Subtotale: ${document.querySelector('#cart-subtotal').textContent}</strong>`;closeCart();document.querySelector('#checkout-dialog').showModal()});
document.querySelector('#checkout-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const lines=products.filter(product=>cart[product.id]).map(product=>`${cart[product.id]} x ${product.name} (${money(cart[product.id]*product.price)})`).join('\n');const subject=`Richiesta d'ordine Cozy Paw — ${data.get('customer')}`;const body=`Ciao Cozy Paw,\n\nvorrei ordinare:\n${lines}\n\nSubtotale: ${document.querySelector('#cart-subtotal').textContent}\n\nNome: ${data.get('customer')}\nEmail: ${data.get('email')}\nIndirizzo: ${data.get('address')}\n\nAttendo conferma di disponibilità, spedizione e modalità di pagamento. Grazie!`;document.querySelector('#checkout-status').textContent='Il riepilogo è pronto. Collega l’indirizzo email ufficiale Cozy Paw nel codice per inviare la richiesta.';const mailto=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;window.location.href=mailto;});
document.querySelector('#custom-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const subject=`Richiesta su misura Cozy Paw — ${data.get('name')}`;const body=`Ciao Cozy Paw,\n\n${data.get('message')}\n\nPet: ${data.get('pet')||'da specificare'}\nTipo di creazione: ${data.get('item')}\nNome: ${data.get('name')}\nEmail: ${data.get('email')}`;document.querySelector('#form-status').textContent='La richiesta è pronta nel tuo programma email. Collega l’indirizzo Cozy Paw per completare l’invio.';window.location.href=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
document.querySelector('#newsletter-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#newsletter-status').textContent='Grazie! Per attivare gli invii collega il servizio newsletter Cozy Paw.';event.currentTarget.reset()});
const menuToggle=document.querySelector('.menu-toggle');menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));document.querySelector('.main-nav').classList.toggle('open',open);menuToggle.setAttribute('aria-label',open?'Chiudi menu':'Apri menu')});
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.main-nav').classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}));
