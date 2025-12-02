// Basic site behavior: years, menu toggle, cart, search, contact form
document.addEventListener('DOMContentLoaded', () => {
  // Insert current year in all spans
  const year = new Date().getFullYear();
  ['year','yearShop','yearAbout','yearContact','yearCart'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = year;
  });

  // Menu toggle (multiple pages use same id pattern)
  const menuButtons = document.querySelectorAll('.menu-toggle');
  menuButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = document.getElementById('primaryNav');
      if(!nav) return;
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  });

  // Close nav on ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      const nav = document.getElementById('primaryNav');
      if(nav && nav.classList.contains('open')){
        nav.classList.remove('open');
        menuButtons.forEach(b=>b.setAttribute('aria-expanded','false'));
      }
    }
  });

  // SEARCH form (demo)
  const searchForm = document.getElementById('searchForm');
  if(searchForm){
    searchForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const q = document.getElementById('searchInput').value.trim().toLowerCase();
      if(!q) return alert('Enter a search term (demo).');
      // Simple client-side highlight: filter product cards
      const cards = document.querySelectorAll('.card');
      let found = 0;
      cards.forEach(card=>{
        const title = card.dataset.title || card.querySelector('h3')?.textContent || '';
        if(title.toLowerCase().includes(q)){
          card.style.display = '';
          found++;
        } else {
          card.style.display = 'none';
        }
      });
      alert('Search (demo): showing ' + found + ' result(s). To reset, refresh the page.');
    });
  }

  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      let ok = true;
      document.querySelectorAll('.error').forEach(el=>el.textContent='');

      const name = document.getElementById('fullName');
      const email = document.getElementById('emailAddr');
      const message = document.getElementById('message');

      if(!name.value.trim() || name.value.trim().length < 2){
        document.getElementById('err-name').textContent = 'Please enter your full name.';
        ok = false;
      }
      if(!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){
        document.getElementById('err-email').textContent = 'Please enter a valid email.';
        ok = false;
      }
      if(!message.value.trim() || message.value.trim().length < 10){
        document.getElementById('err-message').textContent = 'Message must be at least 10 characters.';
        ok = false;
      }
      if(!ok){
        const firstError = document.querySelector('.error:not(:empty)');
        if(firstError){
          const input = firstError.previousElementSibling || firstError.previousElementSibling;
          if(input) input.focus();
        }
        return;
      }

      // Simulate submission
      document.getElementById('formSuccess').hidden = false;
      contactForm.reset();
      setTimeout(()=>{ document.getElementById('formSuccess').hidden = true; },8000);
    });
  }

  // CART: load + display
  initCart();
  renderCartCounts();
  renderCartTable();
});

// CART FUNCTIONS — uses localStorage 'demoCart'
function getCart(){
  try{
    const raw = localStorage.getItem('demoCart');
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem('demoCart', JSON.stringify(cart));
  renderCartCounts();
  renderCartTable();
}
function addToCart(item){
  if(!item || !item.id) return;
  const cart = getCart();
  const existing = cart.find(i=>i.id === item.id);
  if(existing){
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({id:item.id,name:item.name,price:item.price,qty:1});
  }
  saveCart(cart);
  // small user feedback
  alert(item.name + ' added to cart (demo).');
}
function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id !== id);
  saveCart(cart);
}
function clearCart(){
  localStorage.removeItem('demoCart');
  renderCartCounts();
  renderCartTable();
}

// render cart count in header(s)
function renderCartCounts(){
  const count = getCart().reduce((s,i)=>s + (i.qty||0),0);
  document.querySelectorAll('#cartCount,#cartCountShop,#cartCountAbout,#cartCountContact').forEach(el=>{
    if(el) el.textContent = count;
  });
}

// render cart table on cart.html
function renderCartTable(){
  const table = document.getElementById('cartTable');
  if(!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  const cart = getCart();
  let grand = 0;
  if(cart.length === 0){
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = 'Your cart is empty.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    cart.forEach(item=>{
      const tr = document.createElement('tr');
      const tdName = document.createElement('td');
      tdName.textContent = item.name;
      const tdPrice = document.createElement('td');
      tdPrice.textContent = `$${Number(item.price).toFixed(2)}`;
      const tdQty = document.createElement('td');
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = 1;
      qtyInput.value = item.qty || 1;
      qtyInput.style.width = '60px';
      qtyInput.addEventListener('change', ()=>{
        const val = Number(qtyInput.value) || 1;
        item.qty = val;
        saveCart(cart);
      });
      tdQty.appendChild(qtyInput);
      const tdTotal = document.createElement('td');
      const line = (item.price * item.qty);
      tdTotal.textContent = `$${line.toFixed(2)}`;
      grand += line;
      const tdActions = document.createElement('td');
      const rem = document.createElement('button');
      rem.className = 'btn alt small';
      rem.textContent = 'Remove';
      rem.addEventListener('click', ()=>{ removeFromCart(item.id); });
      tdActions.appendChild(rem);

      tr.appendChild(tdName);
      tr.appendChild(tdPrice);
      tr.appendChild(tdQty);
      tr.appendChild(tdTotal);
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
  }
  const grandEl = document.getElementById('grandTotal');
  if(grandEl) grandEl.textContent = `$${grand.toFixed(2)}`;

  // attach clear cart button
  const clearBtn = document.getElementById('clearCart');
  if(clearBtn) clearBtn.onclick = ()=>{ if(confirm('Clear cart?')) clearCart(); };
}

// init cart page controls
function initCart(){
  const clearBtn = document.getElementById('clearCart');
  if(clearBtn) clearBtn.addEventListener('click', ()=>{ if(confirm('Clear cart?')) clearCart(); });

  // also wire checkout (demo)
  const checkout = document.getElementById('checkout');
  if(checkout) checkout.addEventListener('click', ()=>{ alert('Demo: checkout not implemented.'); });

  // render on page load
  renderCartCounts();
  renderCartTable();
}
