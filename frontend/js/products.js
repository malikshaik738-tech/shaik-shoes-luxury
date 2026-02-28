/**
 * SHAIK LUXURY — PRODUCTS DATA & GRID
 */

(function () {
  const PRODUCTS = [
    {
      id: 'apex-pro-001',
      name: 'SHAIK APEX PRO',
      sub: 'Signature Series · 2024',
      price: 25000,
      originalPrice: 28000,
      badge: 'limited',
      badgeLabel: 'Limited',
      category: 'signature',
      rating: 5.0,
      reviews: 48,
      frameStart: 60,
      description: 'The ultimate expression of luxury sneaker craftsmanship.',
    },
    {
      id: 'noir-001',
      name: 'SHAIK NOIR',
      sub: 'Midnight Collection · 2024',
      price: 15000,
      originalPrice: 18000,
      badge: 'new',
      badgeLabel: 'New',
      category: 'limited',
      rating: 4.9,
      reviews: 32,
      frameStart: 80,
      description: 'Born from the darkest hours, crafted for the brightest moments.',
    },
    {
      id: 'aurum-001',
      name: 'SHAIK AURUM',
      sub: 'Gold Edition · Limited',
      price: 10000,
      originalPrice: null,
      badge: 'limited',
      badgeLabel: 'Exclusive',
      category: 'limited',
      rating: 5.0,
      reviews: 19,
      frameStart: 100,
      description: 'Pure gold accents meet Italian leather. Only 50 pairs exist.',
    },
    {
      id: 'classic-001',
      name: 'SHAIK CLASSIQUE',
      sub: 'Heritage Line · Evergreen',
      price: 10000,
      originalPrice: null,
      badge: 'new',
      badgeLabel: 'Classic',
      category: 'classic',
      rating: 4.8,
      reviews: 67,
      frameStart: 120,
      description: 'Timeless elegance, reinterpreted for the modern connoisseur.',
    },
    {
      id: 'phantom-001',
      name: 'SHAIK PHANTOM',
      sub: 'Shadow Series · 2024',
      price: 20000,
      originalPrice: 25000,
      badge: 'limited',
      badgeLabel: 'Limited',
      category: 'signature',
      rating: 4.9,
      reviews: 28,
      frameStart: 140,
      description: 'Dark as night, bright as ambition. The Phantom defies convention.',
    },
    {
      id: 'zenith-001',
      name: 'SHAIK ZENITH',
      sub: 'Pinnacle Collection',
      price: 30000,
      originalPrice: null,
      badge: 'limited',
      badgeLabel: 'Ultra Rare',
      category: 'limited',
      rating: 5.0,
      reviews: 11,
      frameStart: 160,
      description: 'The absolute pinnacle of sneaker luxury. 25 pairs worldwide.',
    },
  ];

  let currentFilter = 'all';
  let currentPage = 1;
  const ITEMS_PER_PAGE = 6;

  function getFrameUrl(frameNum) {
    const num = String(frameNum).padStart(3, '0');
    return `../../ezgif-frame-${num}.jpg`;
  }

  function renderProductCard(product) {
    const imgUrl = getFrameUrl(product.frameStart);
    const starsHtml = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');

    return `
      <div class="product-card reveal-up" data-category="${product.category}" data-id="${product.id}">
        <div class="product-card-img-wrap">
          <img 
            src="${imgUrl}" 
            alt="${product.name}" 
            class="product-card-img"
            loading="lazy"
            onmouseover="this.src='${getFrameUrl(product.frameStart + 20)}'"
            onmouseout="this.src='${imgUrl}'"
          />
          <div class="product-card-badge badge-${product.badge}">${product.badgeLabel}</div>
          <div class="product-card-overlay">
            <button class="product-quick-view" onclick="openProductModal('${product.id}')">Quick View</button>
          </div>
        </div>
        <div class="product-card-body">
          <h3 class="product-card-name">${product.name}</h3>
          <div class="product-card-sub">${product.sub}</div>
          <div class="product-rating">
            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}</span>
            <span class="rating-count">(${product.reviews})</span>
          </div>
          <div class="product-card-footer">
            <div>
              <div class="product-card-price">₹${product.price.toLocaleString('en-IN')}</div>
              ${product.originalPrice ? `<div style="font-size:11px;color:rgba(255,255,255,0.3);text-decoration:line-through;margin-top:2px;">₹${product.originalPrice.toLocaleString('en-IN')}</div>` : ''}
            </div>
            <button 
              class="product-card-add"
              data-add-cart
              data-id="${product.id}"
              data-name="${product.name}"
              data-price="${product.price}"
              data-image="${imgUrl}"
              title="Add to Cart"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function getFilteredProducts() {
    if (currentFilter === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === currentFilter);
  }

  function renderGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = getFilteredProducts();
    const start = 0;
    const end = currentPage * ITEMS_PER_PAGE;
    const toShow = filtered.slice(start, end);

    if (toShow.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:rgba(255,255,255,0.3);">No products found in this category.</div>`;
      return;
    }

    grid.innerHTML = toShow.map(renderProductCard).join('');

    // Re-init reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    // Re-init tilt effect
    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = end >= filtered.length ? 'none' : 'inline-flex';
    }
  }

  // ===== PRODUCT MODAL =====
  function openProductModal(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal-box" style="position:relative;padding:40px;display:grid;grid-template-columns:1fr 1fr;gap:32px;">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove();document.body.style.overflow='';">×</button>
        <div style="aspect-ratio:1;border-radius:8px;overflow:hidden;background:#111;border:1px solid rgba(201,168,76,0.15);">
          <img src="${getFrameUrl(product.frameStart)}" alt="${product.name}" style="width:100%;height:100%;object-fit:contain;" />
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div style="font-size:10px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase">${product.sub}</div>
          <h2 style="font-family:'Bebas Neue',Arial;font-size:40px;letter-spacing:0.1em;background:linear-gradient(135deg,#C9A84C,#E8C87A,#C9A84C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${product.name}</h2>
          <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.8;">${product.description}</p>
          <div style="font-family:'Cormorant Garamond',serif;font-size:32px;background:linear-gradient(135deg,#C9A84C,#E8C87A,#C9A84C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">₹${product.price.toLocaleString('en-IN')}</div>
          <div>
            <div style="font-size:10px;letter-spacing:0.3em;color:rgba(255,255,255,0.5);margin-bottom:12px;">SELECT SIZE (EU)</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${['40', '41', '42', '43', '44', '45'].map(s => `
                <button class="size-btn" data-size="${s}" style="width:44px;height:44px;border:1px solid rgba(255,255,255,0.15);border-radius:4px;font-size:13px;color:rgba(255,255,255,0.6);background:none;">${s}</button>
              `).join('')}
            </div>
          </div>
          <button 
            class="btn-primary" 
            data-add-cart
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${product.price}"
            data-image="${getFrameUrl(product.frameStart)}"
            style="justify-content:center;margin-top:auto;"
          >
            Add to Collection
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { overlay.remove(); document.body.style.overflow = ''; }
    });
  }

  // ===== FILTER =====
  window.filterProducts = function (filter) {
    currentFilter = filter;
    currentPage = 1;
    renderGrid();
  };

  // ===== LOAD MORE =====
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderGrid();
    });
  }

  // ===== EXPOSE =====
  window.openProductModal = openProductModal;
  window.SHAIK_PRODUCTS = PRODUCTS;

  // ===== INIT =====
  renderGrid();
})();
