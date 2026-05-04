document.addEventListener('DOMContentLoaded', () => {
  const translations = {
    en: {
      appTitle: 'INP Store',
      appSubtitle: 'Buy the best PC Components',
      inventoryTitle: 'Available Products',
      loading: 'Loading products...',
      placeholderSearch: 'Search...',
      emptyTitle: 'No products found',
      stockOut: 'Out of Stock',
      stockIn: 'in stock',
      noDesc: 'No description provided.',
      addToCart: 'Add to Cart',
      cartTitle: 'Your Cart',
      cartTotal: 'Total:',
      checkout: 'Proceed to Checkout',
      logout: 'Logout',
      admin: 'Admin',
      loginRegister: 'Login / Register',
      cartEmpty: 'Cart is empty!',
      notEnoughStock: 'Not enough stock available',
      catCPU: 'CPU',
      catGPU: 'GPU',
      catRAM: 'RAM',
      catMotherboard: 'Motherboard',
      catStorage: 'Storage',
      catPSU: 'Power Supply',
      catCase: 'Case',
      catCooler: 'Cooling',
      catOther: 'Other'
    },
    es: {
      appTitle: 'Tienda INP',
      appSubtitle: 'Compra los mejores componentes de PC',
      inventoryTitle: 'Productos Disponibles',
      loading: 'Cargando productos...',
      placeholderSearch: 'Buscar...',
      emptyTitle: 'No se encontraron productos',
      stockOut: 'Agotado',
      stockIn: 'en stock',
      noDesc: 'Sin descripción.',
      addToCart: 'Añadir al Carrito',
      cartTitle: 'Tu Carrito',
      cartTotal: 'Total:',
      checkout: 'Proceder al Pago',
      logout: 'Cerrar Sesión',
      admin: 'Admin',
      loginRegister: 'Iniciar Sesión / Registrarse',
      cartEmpty: '¡El carrito está vacío!',
      notEnoughStock: 'No hay suficiente stock disponible',
      catCPU: 'CPU',
      catGPU: 'GPU',
      catRAM: 'RAM',
      catMotherboard: 'Placa Base',
      catStorage: 'Almacenamiento',
      catPSU: 'Fuente de Poder',
      catCase: 'Gabinete',
      catCooler: 'Refrigeración',
      catOther: 'Otro'
    }
  };

  let currentLang = localStorage.getItem('inp_lang') || 'en';
  let components = [];
  let cart = JSON.parse(localStorage.getItem('inp_cart')) || [];
  
  const componentsGrid = document.getElementById('components-grid');
  const loadingState = document.getElementById('loading');
  const emptyState = document.getElementById('empty-state');
  const searchInput = document.getElementById('search-input');
  
  const authActions = document.getElementById('auth-actions');
  const cartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total-price');
  const cartCountEl = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  const btnEn = document.getElementById('lang-en');
  const btnEs = document.getElementById('lang-es');

  // Apply initially saved language
  setLanguage(currentLang);

  // Check Auth
  const token = localStorage.getItem('inp_token');
  const user = JSON.parse(localStorage.getItem('inp_user'));

  if (token && user) {
    let adminLink = user.role === 'admin' ? `<a href="admin.html" class="btn" style="margin-right: 10px;"><i class="fa-solid fa-shield"></i> <span data-i18n="admin">${translations[currentLang].admin}</span></a>` : '';
    authActions.innerHTML = `${adminLink}<button id="logout-btn" class="btn btn-danger"><i class="fa-solid fa-sign-out-alt"></i> <span data-i18n="logout">${translations[currentLang].logout}</span></button>`;
    
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('inp_token');
      localStorage.removeItem('inp_user');
      window.location.reload();
    });
  } else {
    authActions.innerHTML = `<a href="auth.html" class="btn btn-primary"><i class="fa-solid fa-user"></i> <span data-i18n="loginRegister">${translations[currentLang].loginRegister}</span></a>`;
  }

  btnEn.addEventListener('click', () => setLanguage('en'));
  btnEs.addEventListener('click', () => setLanguage('es'));

  // Cart Handlers
  cartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
  closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
  checkoutBtn.addEventListener('click', () => {
    if(cart.length === 0) return alert(translations[currentLang].cartEmpty);
    window.location.href = 'checkout.html';
  });

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = components.filter(c => c.name.toLowerCase().includes(term) || c.category.toLowerCase().includes(term));
    renderComponents(filtered);
  });

  async function fetchComponents() {
    componentsGrid.classList.add('hidden');
    emptyState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    
    try {
      // Mocked with DB
      components = DB.getComponents();
      renderComponents(components);
    } catch (err) {
      console.error(err);
      loadingState.classList.add('hidden');
    }
  }

  function renderComponents(data) {
    loadingState.classList.add('hidden');
    if (data.length === 0) {
      emptyState.classList.remove('hidden');
      componentsGrid.classList.add('hidden');
      return;
    }
    
    emptyState.classList.add('hidden');
    componentsGrid.classList.remove('hidden');
    componentsGrid.innerHTML = '';

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'component-card';
      const outOfStock = item.quantity <= 0;
      
      const t = translations[currentLang];
      const stockText = outOfStock ? t.stockOut : `${item.quantity} ${t.stockIn}`;
      const displayCategory = t['cat' + item.category] || item.category;

      card.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${item.name}</h3>
          <span class="card-category">${displayCategory}</span>
        </div>
        <div class="card-price">$${Number(item.price).toFixed(2)}</div>
        <div class="card-stock ${outOfStock ? 'stock-out' : ''}">${stockText}</div>
        <div class="card-desc">${item.description || t.noDesc}</div>
        <div class="card-actions">
          <button class="btn btn-primary add-cart-btn" data-id="${item.id}" ${outOfStock ? 'disabled' : ''}>
            <i class="fa-solid fa-cart-plus"></i> <span data-i18n="addToCart">${t.addToCart}</span>
          </button>
        </div>
      `;
      componentsGrid.appendChild(card);
    });

    document.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });
  }

  function addToCart(id) {
    const item = components.find(c => c.id == id);
    if (!item) return;
    
    const existing = cart.find(c => c.id == id);
    if (existing) {
      if (existing.cartQty < item.quantity) {
        existing.cartQty++;
      } else {
        alert(translations[currentLang].notEnoughStock);
        return;
      }
    } else {
      cart.push({ ...item, cartQty: 1 });
    }
    
    saveCart();
    renderCart();
    cartSidebar.classList.add('open');
  }

  function removeFromCart(id) {
    cart = cart.filter(c => c.id != id);
    saveCart();
    renderCart();
  }

  function saveCart() {
    localStorage.setItem('inp_cart', JSON.stringify(cart));
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.price * item.cartQty;
      count += item.cartQty;
      
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">$${Number(item.price).toFixed(2)} x ${item.cartQty}</span>
        </div>
        <i class="fa-solid fa-trash remove-item" data-id="${item.id}"></i>
      `;
      cartItemsContainer.appendChild(el);
    });

    cartTotalEl.textContent = '$' + total.toFixed(2);
    cartCountEl.textContent = count;

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('inp_lang', lang);

    if (lang === 'en') {
      btnEn.classList.add('active');
      btnEs.classList.remove('active');
    } else {
      btnEs.classList.add('active');
      btnEn.classList.remove('active');
    }

    const t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.placeholder = t[key];
      }
    });

    // Sidebar titles and static checkout button
    const cartHeaderH2 = document.querySelector('.cart-header h2');
    if (cartHeaderH2) cartHeaderH2.textContent = t.cartTitle;
    
    const cartTotalSpan = document.querySelector('.cart-total span:first-child');
    if (cartTotalSpan) cartTotalSpan.textContent = t.cartTotal;
    
    if (checkoutBtn) checkoutBtn.textContent = t.checkout;

    // Refresh components UI
    if (components.length > 0) {
      const term = searchInput.value.toLowerCase();
      const filtered = components.filter(c => c.name.toLowerCase().includes(term) || c.category.toLowerCase().includes(term));
      renderComponents(filtered);
    } else {
      fetchComponents();
    }
    
    // Refresh auth actions UI
    const token = localStorage.getItem('inp_token');
    const user = JSON.parse(localStorage.getItem('inp_user'));
    if (token && user) {
      let adminLink = user.role === 'admin' ? `<a href="admin.html" class="btn" style="margin-right: 10px;"><i class="fa-solid fa-shield"></i> <span data-i18n="admin">${t.admin}</span></a>` : '';
      authActions.innerHTML = `${adminLink}<button id="logout-btn" class="btn btn-danger"><i class="fa-solid fa-sign-out-alt"></i> <span data-i18n="logout">${t.logout}</span></button>`;
      document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('inp_token');
        localStorage.removeItem('inp_user');
        window.location.reload();
      });
    } else {
      authActions.innerHTML = `<a href="auth.html" class="btn btn-primary"><i class="fa-solid fa-user"></i> <span data-i18n="loginRegister">${t.loginRegister}</span></a>`;
    }
  }

  fetchComponents();
  renderCart();
});
