/**
 * SHAIK LUXURY — CART SYSTEM
 */

(function () {
    const STORAGE_KEY = 'shaik_cart';

    // ===== CART DATA =====
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    function saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        updateCartUI();
        updateCartBadge();
    }

    function addToCart(id, name, price, image = '', size = '') {
        const existing = cart.find(item => item.id === id && item.size === size);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price, image, size, qty: 1 });
        }
        saveCart();
        showCartFlyAnimation();
        showToast && showToast('Added to Collection', `${name} has been added.`);

        // Bounce cart icon
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.style.animation = 'none';
            requestAnimationFrame(() => {
                badge.style.animation = 'cartBounce 0.5s ease';
            });
        }
    }

    function removeFromCart(id, size) {
        cart = cart.filter(item => !(item.id === id && item.size === size));
        saveCart();
        showToast && showToast('Removed', 'Item removed from collection.', 'info');
    }

    function updateQuantity(id, size, delta) {
        const item = cart.find(i => i.id === id && i.size === size);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) removeFromCart(id, size);
            else saveCart();
        }
    }

    function getTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function getCount() {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    // ===== UI =====
    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) badge.textContent = getCount();
    }

    function updateCartUI() {
        const cartItemsEl = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        const cartTotal = document.getElementById('cartTotal');
        if (!cartItemsEl) return;

        if (cart.length === 0) {
            cartItemsEl.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <p>Your collection is empty</p>
          <span>Discover our luxury pieces</span>
        </div>`;
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
          <div class="cart-item-img-wrap">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="cart-item-img" />` : `<div class="cart-item-img" style="background:#1a1a1a;display:flex;align-items:center;justify-content:center;font-size:24px;">👟</div>`}
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            ${item.size ? `<div class="cart-item-size">Size EU ${item.size}</div>` : ''}
            <div class="cart-item-qty" style="display:flex;align-items:center;gap:10px;margin-top:8px;">
              <button onclick="window.shaikCart.updateQuantity('${item.id}','${item.size}',-1)" style="width:24px;height:24px;border:1px solid rgba(201,168,76,0.3);border-radius:50%;color:#C9A84C;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;background:none;">−</button>
              <span style="font-size:13px;min-width:20px;text-align:center;">${item.qty}</span>
              <button onclick="window.shaikCart.updateQuantity('${item.id}','${item.size}',1)" style="width:24px;height:24px;border:1px solid rgba(201,168,76,0.3);border-radius:50%;color:#C9A84C;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;background:none;">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.shaikCart.removeFromCart('${item.id}','${item.size}')">×</button>
        </div>
      `).join('');
            if (cartFooter) {
                cartFooter.style.display = 'block';
                if (cartTotal) cartTotal.textContent = '₹' + getTotal().toLocaleString('en-IN');
            }
        }
    }

    // ===== SIDEBAR CONTROLS =====
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCloseBtn = document.getElementById('cartCloseBtn');

    function openCart() {
        if (cartSidebar) cartSidebar.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeCart() {
        if (cartSidebar) cartSidebar.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // ===== FLY ANIMATION =====
    function showCartFlyAnimation() {
        const cartBtn = document.getElementById('cartBtn');
        if (!cartBtn) return;
        const btnRect = cartBtn.getBoundingClientRect();
        const flyEl = document.createElement('div');
        flyEl.className = 'cart-fly-item';
        flyEl.style.cssText = `
      left: ${window.innerWidth / 2 - 25}px;
      top: ${window.innerHeight / 2 - 25}px;
      --tx: ${btnRect.left - window.innerWidth / 2 + btnRect.width / 2}px;
      --ty: ${btnRect.top - window.innerHeight / 2 + btnRect.height / 2}px;
    `;
        document.body.appendChild(flyEl);
        setTimeout(() => flyEl.remove(), 800);
    }

    // ===== ADD TO CART EVENT DELEGATION =====
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-add-cart]');
        if (!btn) return;
        const id = btn.dataset.id || 'product';
        const name = btn.dataset.name || 'SHAIK Sneaker';
        const price = parseInt(btn.dataset.price) || 89999;
        const image = btn.dataset.image || '';
        const selectedSize = btn.closest('section, .product-card')?.querySelector('.size-btn.active')?.dataset?.size || '';
        addToCart(id, name, price, image, selectedSize);
        openCart();
    });

    // Showcase add to cart
    const showcaseAddBtn = document.getElementById('showcaseAddToCart');
    if (showcaseAddBtn) {
        showcaseAddBtn.setAttribute('data-add-cart', '');
    }

    // ===== INIT =====
    updateCartBadge();
    updateCartUI();

    // Expose API
    window.shaikCart = { addToCart, removeFromCart, updateQuantity, getCart: () => cart, getTotal, getCount };
    window.openCart = openCart;
})();
