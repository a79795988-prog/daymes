/**
 * DAYMES - Application Controller (Dark Theme & Healthcare Requirement Assistant)
 */

// State Container
const AppState = {
  activeTab: 'home',
  products: [...INITIAL_PRODUCTS],
  cart: JSON.parse(localStorage.getItem('medicare_cart')) || [],
  orders: JSON.parse(localStorage.getItem('medicare_orders')) || [...INITIAL_ORDERS],
  reorderItems: JSON.parse(localStorage.getItem('medicare_reorder')) || [...INITIAL_REORDER_ITEMS],
  schedule: JSON.parse(localStorage.getItem('medicare_schedule')) || [...INITIAL_MEDICATION_SCHEDULE],
  chatMessages: JSON.parse(localStorage.getItem('medicare_chat')) || [
    { 
      sender: 'bot', 
      text: 'Hi! I’m the <strong>DAYMES Assistant</strong> 👋. How can I help you today?<br/><br/><span class="text-[10px] text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700 block">DAYMES Assistant provides general healthcare and medicine information. It does not diagnose conditions or prescribe medicines. For personalized medical advice, consult a qualified doctor or pharmacist.</span>', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ],
  reorderSelectedIds: new Set(['reorder-101', 'reorder-104']),
  searchQuery: '',
  selectedCategory: 'All',
  sortBy: 'featured',
  isChatOpen: false
};

// LocalStorage Sync Helpers
function saveCart() {
  localStorage.setItem('medicare_cart', JSON.stringify(AppState.cart));
  updateCartBadge();
}

function saveOrders() {
  localStorage.setItem('medicare_orders', JSON.stringify(AppState.orders));
}

function saveReorder() {
  localStorage.setItem('medicare_reorder', JSON.stringify(AppState.reorderItems));
}

function saveSchedule() {
  localStorage.setItem('medicare_schedule', JSON.stringify(AppState.schedule));
}

function saveChat() {
  localStorage.setItem('medicare_chat', JSON.stringify(AppState.chatMessages));
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-sky-700';
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';

  toast.className = `${bgClass} text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium toast-enter z-50`;
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-5 h-5 text-white flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons({ props: { scope: toast } });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global Cart Badge Counter
function updateCartBadge() {
  const totalCount = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    b.textContent = totalCount;
    if (totalCount > 0) {
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  });
}

// Tab Switching Controller
function navigateTo(tabName) {
  AppState.activeTab = tabName;
  
  // Hide all view containers
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => v.classList.add('hidden'));

  // Show active container
  const activeView = document.getElementById(`view-${tabName}`);
  if (activeView) {
    activeView.classList.remove('hidden');
  }

  // Update Nav Link Highlight
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.tab === tabName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Close mobile menu
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.add('hidden');

  // Scroll smooth to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-render specific views if necessary
  if (tabName === 'medicines') renderMedicinesCatalog();
  if (tabName === 'reorder') renderReorderPage();
  if (tabName === 'orders') renderOrdersPage();
  if (tabName === 'healthcare') renderHealthcareDashboard();
  
  lucide.createIcons();
}

// Auth-gated navigation: show login gate if not signed in
function requireAuth(tabName) {
  if (typeof isLoggedIn === 'function' && isLoggedIn()) {
    navigateTo(tabName);
  } else {
    const gate = document.getElementById('auth-gate-modal');
    if (gate) {
      gate.dataset.pendingTab = tabName;
      gate.classList.remove('hidden');
      lucide.createIcons();
    }
  }
}

function closeAuthGate() {
  const gate = document.getElementById('auth-gate-modal');
  if (gate) gate.classList.add('hidden');
}

// Override toggleProfileDropdown to also populate name/email
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profile-dropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('hidden');
  if (!dropdown.classList.contains('hidden')) {
    // Populate dropdown with current session info
    const session = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (session) {
      const nameEl  = document.getElementById('profile-dropdown-name');
      const emailEl = document.getElementById('profile-dropdown-email');
      if (nameEl)  nameEl.textContent  = session.fullName;
      if (emailEl) emailEl.textContent = session.email;
    }
    lucide.createIcons();
  }
}

// CART MANAGEMENT
function addToCart(productId, qty = 1) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = AppState.cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    AppState.cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      requiresRx: product.requiresRx,
      qty: qty
    });
  }

  saveCart();
  renderCartDrawer();
  showToast(`Added ${product.name} to cart!`, 'success');
}

function updateCartQty(productId, newQty) {
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = AppState.cart.find(i => i.productId === productId);
  if (item) {
    item.qty = newQty;
    saveCart();
    renderCartDrawer();
  }
}

function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(i => i.productId !== productId);
  saveCart();
  renderCartDrawer();
  showToast('Item removed from cart', 'info');
}

function toggleCartDrawer(open = true) {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (open) {
    renderCartDrawer();
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
  } else {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
  }
}

function renderCartDrawer() {
  const cartList = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  if (!cartList) return;

  if (AppState.cart.length === 0) {
    cartList.innerHTML = `
      <div class="py-16 text-center text-slate-400 flex flex-col items-center">
        <i data-lucide="shopping-bag" class="w-16 h-16 text-slate-600 stroke-1 mb-3"></i>
        <p class="text-base font-semibold text-slate-200">Your shopping cart is empty</p>
        <p class="text-xs text-slate-400 max-w-xs mt-1">Explore our medicines section to order healthcare supplies and daily essential supplements.</p>
        <button onclick="toggleCartDrawer(false); navigateTo('medicines')" class="mt-5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">Browse Medicines</button>
      </div>
    `;
    subtotalEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    lucide.createIcons();
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

  let subtotal = 0;
  cartList.innerHTML = AppState.cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700/80 rounded-2xl shadow-sm">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-slate-700 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <h4 class="text-xs font-bold text-slate-100 truncate">${item.name}</h4>
            ${item.requiresRx ? '<span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-950 text-rose-300 border border-rose-800">Rx</span>' : ''}
          </div>
          <p class="text-xs font-semibold text-sky-400 mt-0.5">$${item.price.toFixed(2)}</p>
          <div class="flex items-center gap-2 mt-2">
            <div class="flex items-center border border-slate-700 rounded-lg bg-slate-900">
              <button onclick="updateCartQty('${item.productId}', ${item.qty - 1})" class="px-2 py-0.5 text-slate-300 hover:bg-slate-700 rounded-l-lg font-bold">-</button>
              <span class="px-2 text-xs font-bold text-slate-100">${item.qty}</span>
              <button onclick="updateCartQty('${item.productId}', ${item.qty + 1})" class="px-2 py-0.5 text-slate-300 hover:bg-slate-700 rounded-r-lg font-bold">+</button>
            </div>
            <button onclick="removeFromCart('${item.productId}')" class="text-slate-400 hover:text-rose-400 text-xs font-medium ml-auto">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const shipping = subtotal > 30 || subtotal === 0 ? 0 : 2.99;
  const grandTotal = subtotal + shipping;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${grandTotal.toFixed(2)}`;

  const shippingNote = document.getElementById('cart-shipping-note');
  if (shippingNote) {
    if (shipping === 0) {
      shippingNote.innerHTML = '<span class="text-emerald-400 font-semibold">FREE Shipping Applied</span>';
    } else {
      shippingNote.innerHTML = `<span>Add $${(30 - subtotal).toFixed(2)} more for FREE shipping</span>`;
    }
  }

  lucide.createIcons();
}

// MEDICINES CATALOG VIEW
function renderMedicinesCatalog() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = AppState.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(AppState.searchQuery.toLowerCase());
    const matchesCategory = AppState.selectedCategory === 'All' || p.category === AppState.selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  if (AppState.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.sortBy === 'name-az') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const resultsCount = document.getElementById('catalog-results-count');
  if (resultsCount) {
    resultsCount.textContent = `Showing ${filtered.length} products`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400 flex flex-col items-center">
        <i data-lucide="search-x" class="w-16 h-16 text-slate-600 stroke-1 mb-3"></i>
        <h3 class="text-lg font-bold text-slate-200">No medicines found</h3>
        <p class="text-xs text-slate-400 max-w-sm mt-1">We couldn't find any products matching "${AppState.searchQuery}". Try adjusting your category filters or search keywords.</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 bg-slate-800 text-sky-400 rounded-xl text-xs font-semibold hover:bg-slate-700 border border-slate-700">Reset Filters</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <div id="product-card-${product.id}" class="bg-slate-900 rounded-2xl border border-slate-800 shadow-card shadow-card-hover p-4 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div class="relative w-full h-44 mb-3 rounded-xl overflow-hidden bg-slate-950">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div class="absolute top-2 left-2 flex gap-1">
            ${product.requiresRx ? 
              '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-lg bg-rose-600 text-white shadow-sm flex items-center gap-1"><i data-lucide="file-text" class="w-3 h-3"></i> Prescription Req.</span>' : 
              '<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-600 text-white shadow-sm flex items-center gap-1"><i data-lucide="check" class="w-3 h-3"></i> OTC Product</span>'}
          </div>
          <span class="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-900/90 backdrop-blur text-slate-200 shadow-sm flex items-center gap-1 border border-slate-700">
            <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i> ${product.rating}
          </span>
        </div>

        <div class="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1">${product.category}</div>
        <h3 class="text-sm font-bold text-white line-clamp-1 group-hover:text-sky-400 transition-colors">${product.name}</h3>
        <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">${product.description}</p>
        <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3 text-slate-500"></i> ${product.dosage}</p>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-lg font-extrabold text-white">$${product.price.toFixed(2)}</span>
          <span class="text-[10px] text-slate-400 font-medium block">In Stock (${product.stock})</span>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="addToCart('${product.id}')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1">
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
            <span>Add</span>
          </button>
          <button onclick="buyNow('${product.id}')" class="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function setCategoryFilter(cat) {
  AppState.selectedCategory = cat;
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(p => {
    if (p.dataset.category === cat) {
      p.className = 'category-pill px-4 py-2 bg-sky-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all';
    } else {
      p.className = 'category-pill px-4 py-2 bg-slate-900 text-slate-300 border border-slate-800 font-semibold rounded-xl text-xs hover:bg-slate-800 hover:text-white transition-all';
    }
  });
  renderMedicinesCatalog();
}

function handleSearchInput(val) {
  AppState.searchQuery = val;
  if (AppState.activeTab !== 'medicines') {
    navigateTo('medicines');
  } else {
    renderMedicinesCatalog();
  }
}

function resetFilters() {
  AppState.searchQuery = '';
  AppState.selectedCategory = 'All';
  AppState.sortBy = 'featured';
  const input1 = document.getElementById('global-search-input');
  if (input1) input1.value = '';
  const input2 = document.getElementById('catalog-search-input');
  if (input2) input2.value = '';
  setCategoryFilter('All');
}

function buyNow(productId) {
  addToCart(productId, 1);
  openCheckoutModal();
}

// SMART REORDERING PAGE
function renderReorderPage() {
  const container = document.getElementById('reorder-items-list');
  if (!container) return;

  if (AppState.reorderItems.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center text-slate-400">
        <i data-lucide="refresh-cw" class="w-12 h-12 text-slate-600 stroke-1 mx-auto mb-2"></i>
        <p class="text-sm font-semibold text-slate-200">No reorder items found in your history.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.reorderItems.map(item => {
    const isChecked = AppState.reorderSelectedIds.has(item.id);
    return `
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-sky-500">
        <div class="flex items-center gap-4">
          <input type="checkbox" onchange="toggleReorderSelect('${item.id}', this.checked)" ${isChecked ? 'checked' : ''} class="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 border-slate-700 bg-slate-800 cursor-pointer" />
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-slate-800 flex-shrink-0" />
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-bold text-white">${item.name}</h3>
              <span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full ${item.statusClass}">${item.status}</span>
              ${item.requiresRx ? '<span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-950 text-rose-300 border border-rose-800">Rx Valid</span>' : ''}
            </div>
            <p class="text-xs text-slate-400 mt-1">Last ordered: <span class="font-medium text-slate-200">${item.lastOrderDate}</span> | Refill window: <span class="font-semibold text-sky-400">${item.daysRemaining} days remaining</span></p>
          </div>
        </div>

        <div class="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400 font-medium">Quantity:</span>
            <div class="flex items-center border border-slate-700 rounded-xl bg-slate-800">
              <button onclick="changeReorderQty('${item.id}', ${item.defaultQty - 1})" class="px-2.5 py-1 text-slate-300 hover:bg-slate-700 rounded-l-xl font-bold text-xs">-</button>
              <span class="px-3 text-xs font-bold text-white">${item.defaultQty}</span>
              <button onclick="changeReorderQty('${item.id}', ${item.defaultQty + 1})" class="px-2.5 py-1 text-slate-300 hover:bg-slate-700 rounded-r-xl font-bold text-xs">+</button>
            </div>
          </div>

          <div class="text-right min-w-[80px]">
            <span class="text-base font-extrabold text-white">$${(item.price * item.defaultQty).toFixed(2)}</span>
            <span class="text-[10px] text-slate-400 block">$${item.price.toFixed(2)} each</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateReorderSummary();
  lucide.createIcons();
}

function toggleReorderSelect(id, checked) {
  if (checked) {
    AppState.reorderSelectedIds.add(id);
  } else {
    AppState.reorderSelectedIds.delete(id);
  }
  updateReorderSummary();
}

function toggleSelectAllReorder(checked) {
  if (checked) {
    AppState.reorderItems.forEach(i => AppState.reorderSelectedIds.add(i.id));
  } else {
    AppState.reorderSelectedIds.clear();
  }
  renderReorderPage();
}

function changeReorderQty(id, newQty) {
  if (newQty < 1) return;
  const item = AppState.reorderItems.find(i => i.id === id);
  if (item) {
    item.defaultQty = newQty;
    saveReorder();
    renderReorderPage();
  }
}

function updateReorderSummary() {
  const selectedCount = AppState.reorderSelectedIds.size;
  const countEl = document.getElementById('reorder-selected-count');
  const totalEl = document.getElementById('reorder-total-amount');
  const actionBtn = document.getElementById('reorder-submit-btn');

  if (!countEl) return;

  let total = 0;
  AppState.reorderItems.forEach(item => {
    if (AppState.reorderSelectedIds.has(item.id)) {
      total += item.price * item.defaultQty;
    }
  });

  countEl.textContent = `${selectedCount} item${selectedCount === 1 ? '' : 's'} selected`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  if (selectedCount === 0) {
    actionBtn.disabled = true;
    actionBtn.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    actionBtn.disabled = false;
    actionBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

function executeReorderSelected() {
  if (AppState.reorderSelectedIds.size === 0) return;

  const selectedItems = AppState.reorderItems.filter(i => AppState.reorderSelectedIds.has(i.id));
  const newOrderId = 'DAY-' + Math.floor(10000 + Math.random() * 90000);
  const totalCost = selectedItems.reduce((sum, item) => sum + (item.price * item.defaultQty), 0);

  const newOrder = {
    orderId: newOrderId,
    date: new Date().toISOString().split('T')[0],
    status: 'Confirmed',
    statusClass: 'status-confirmed',
    total: totalCost,
    items: selectedItems.map(i => ({ name: i.name, qty: i.defaultQty, price: i.price })),
    address: '742 Evergreen Terrace, Springfield, IL',
    paymentMethod: 'Auto-Refill Payment'
  };

  AppState.orders.unshift(newOrder);
  saveOrders();

  // Show confirmation modal
  const modal = document.getElementById('reorder-success-modal');
  document.getElementById('reorder-success-id').textContent = newOrderId;
  document.getElementById('reorder-success-count').textContent = `${selectedItems.length} items`;
  document.getElementById('reorder-success-total').textContent = `$${totalCost.toFixed(2)}`;
  modal.classList.remove('hidden');

  showToast('Reorder successful! Your order has been placed.', 'success');
}

function closeReorderModal() {
  document.getElementById('reorder-success-modal').classList.add('hidden');
  navigateTo('orders');
}

// MY ORDERS PAGE
function renderOrdersPage() {
  const container = document.getElementById('orders-list');
  if (!container) return;

  if (AppState.orders.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-slate-400 flex flex-col items-center">
        <i data-lucide="package" class="w-16 h-16 text-slate-600 stroke-1 mb-3"></i>
        <h3 class="text-base font-bold text-slate-200">No order history available</h3>
        <p class="text-xs text-slate-400 max-w-sm mt-1">Orders placed online or through smart refills will appear here with live tracking updates.</p>
        <button onclick="navigateTo('medicines')" class="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold">Start Shopping</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = AppState.orders.map(order => `
    <div class="bg-slate-900 rounded-2xl border border-slate-800 shadow-card p-5 transition-all">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div class="flex items-center gap-3">
            <span class="text-base font-extrabold text-white">${order.orderId}</span>
            <span class="px-2.5 py-1 text-xs font-extrabold rounded-full ${order.statusClass}">${order.status}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">Placed on <span class="font-medium text-slate-200">${order.date}</span> | Paid via ${order.paymentMethod}</p>
        </div>
        <div class="sm:text-right">
          <span class="text-xs text-slate-400 block font-medium">Total Amount</span>
          <span class="text-lg font-extrabold text-sky-400">$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="py-4 space-y-2">
        ${order.items.map(item => `
          <div class="flex items-center justify-between text-xs py-1">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-slate-800 text-sky-400 font-bold flex items-center justify-center text-[11px] border border-slate-700">${item.qty}x</span>
              <span class="font-bold text-slate-200">${item.name}</span>
            </div>
            <span class="font-semibold text-slate-300">$${(item.price * item.qty).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>

      <div class="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-1.5 text-slate-400">
          <i data-lucide="map-pin" class="w-4 h-4 text-slate-500 flex-shrink-0"></i>
          <span class="truncate max-w-xs">${order.address}</span>
        </div>
        <div class="flex items-center gap-2">
          ${order.status === 'Delivered' ? `
            <button onclick="repeatOrder('${order.orderId}')" class="px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold rounded-xl flex items-center gap-1.5 transition-all">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>Reorder Again</span>
            </button>
          ` : `
            <button onclick="showToast('Tracking update: Order ${order.orderId} is currently ${order.status}', 'info')" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition-all">
              <i data-lucide="truck" class="w-3.5 h-3.5"></i>
              <span>Track Delivery</span>
            </button>
          `}
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function repeatOrder(orderId) {
  const order = AppState.orders.find(o => o.orderId === orderId);
  if (!order) return;

  order.items.forEach(item => {
    const prod = AppState.products.find(p => p.name === item.name);
    if (prod) {
      addToCart(prod.id, item.qty);
    }
  });

  toggleCartDrawer(true);
  showToast(`Items from order ${orderId} re-added to cart!`, 'success');
}

// HEALTHCARE DASHBOARD & MEDICATION SCHEDULE
function renderHealthcareDashboard() {
  const container = document.getElementById('medication-schedule-list');
  if (!container) return;

  const takenCount = AppState.schedule.filter(s => s.status === 'Taken').length;
  const totalCount = AppState.schedule.length;
  const progressPct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  const progressBar = document.getElementById('schedule-progress-bar');
  const progressText = document.getElementById('schedule-progress-text');
  if (progressBar) progressBar.style.width = `${progressPct}%`;
  if (progressText) progressText.textContent = `${takenCount} of ${totalCount} doses taken today (${progressPct}%)`;

  container.innerHTML = AppState.schedule.map(item => `
    <div class="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm transition-all hover:border-sky-500">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 text-sky-400 font-bold flex items-center justify-center flex-shrink-0 border border-slate-700">
          <i data-lucide="clock" class="w-6 h-6"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-white">${item.medicine}</h4>
            <span class="px-2 py-0.5 text-[10px] font-bold rounded-lg ${item.statusBadge}">${item.status}</span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">${item.instruction}</p>
          <span class="text-[11px] font-semibold text-sky-400 mt-1 block">${item.time}</span>
        </div>
      </div>

      <div>
        ${item.status === 'Taken' ? `
          <button onclick="toggleScheduleStatus('${item.id}')" class="px-3.5 py-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-all">
            <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
            <span>Completed</span>
          </button>
        ` : `
          <button onclick="toggleScheduleStatus('${item.id}')" class="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all">
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>Mark as Taken</span>
          </button>
        `}
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function toggleScheduleStatus(id) {
  const item = AppState.schedule.find(s => s.id === id);
  if (item) {
    if (item.status === 'Taken') {
      item.status = 'Pending';
      item.statusBadge = 'bg-amber-950 text-amber-300 border-amber-800';
    } else {
      item.status = 'Taken';
      item.statusBadge = 'bg-emerald-950 text-emerald-300 border-emerald-800';
      showToast(`Logged dosage for ${item.medicine}`, 'success');
    }
    saveSchedule();
    renderHealthcareDashboard();
  }
}

// CHECKOUT MODAL FLOW
function openCheckoutModal() {
  if (AppState.cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }

  toggleCartDrawer(false);
  const modal = document.getElementById('checkout-modal');
  renderCheckoutSummary();
  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkout-items-summary');
  if (!summaryEl) return;

  let subtotal = 0;
  let hasRx = false;

  summaryEl.innerHTML = AppState.cart.map(item => {
    subtotal += item.price * item.qty;
    if (item.requiresRx) hasRx = true;
    return `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
        <span class="text-slate-300 font-medium">${item.qty}x ${item.name}</span>
        <span class="font-bold text-white">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
  }).join('');

  const shipping = subtotal > 30 ? 0 : 2.99;
  const total = subtotal + shipping;

  document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('checkout-grand-total').textContent = `$${total.toFixed(2)}`;

  const rxBanner = document.getElementById('checkout-rx-upload-section');
  if (rxBanner) {
    if (hasRx) {
      rxBanner.classList.remove('hidden');
    } else {
      rxBanner.classList.add('hidden');
    }
  }
}

function submitCheckoutOrder(event) {
  event.preventDefault();

  const name = document.getElementById('checkout-name').value;
  const address = document.getElementById('checkout-address').value;
  const phone = document.getElementById('checkout-phone').value;
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

  if (!name || !address || !phone) {
    showToast('Please complete all required delivery details.', 'error');
    return;
  }

  const newOrderId = 'DAY-' + Math.floor(10000 + Math.random() * 90000);
  let subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal > 30 ? 0 : 2.99;
  const total = subtotal + shipping;

  const newOrder = {
    orderId: newOrderId,
    date: new Date().toISOString().split('T')[0],
    status: 'Confirmed',
    statusClass: 'status-confirmed',
    total: total,
    items: AppState.cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
    address: `${address} (Recipient: ${name}, Tel: ${phone})`,
    paymentMethod: paymentMethod
  };

  AppState.orders.unshift(newOrder);
  saveOrders();

  // Clear Cart
  AppState.cart = [];
  saveCart();

  closeCheckoutModal();

  // Show Order Placed Success Modal
  const successModal = document.getElementById('order-placed-success-modal');
  document.getElementById('placed-order-id').textContent = newOrderId;
  successModal.classList.remove('hidden');

  showToast('Order placed successfully!', 'success');
}

function closeOrderPlacedModal() {
  document.getElementById('order-placed-success-modal').classList.add('hidden');
  navigateTo('orders');
}

// AI HEALTHCARE CHATBOT ("DAYMES Assistant")
function toggleChatbot() {
  AppState.isChatOpen = !AppState.isChatOpen;
  const widget = document.getElementById('chatbot-widget');
  if (AppState.isChatOpen) {
    widget.classList.remove('hidden');
    renderChatMessages();
    const badge = document.getElementById('chatbot-unread-dot');
    if (badge) badge.classList.add('hidden');
  } else {
    widget.classList.add('hidden');
  }
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  container.innerHTML = AppState.chatMessages.map(msg => {
    const isUser = msg.sender === 'user';
    return `
      <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3">
        <div class="max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
          isUser ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
        }">
          ${msg.text}
        </div>
        <span class="text-[10px] text-slate-500 mt-1 px-1">${msg.time}</span>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function sendChatMessage(textOverride = null) {
  const input = document.getElementById('chat-input-field');
  const text = textOverride || input.value.trim();
  if (!text) return;

  if (!textOverride && input) input.value = '';

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Add User Message
  AppState.chatMessages.push({ sender: 'user', text: text, time: timeStr });
  saveChat();
  renderChatMessages();

  // Show Typing Indicator
  showChatTyping(true);

  // Generate Bot Response
  setTimeout(() => {
    showChatTyping(false);
    const botReply = matchBotResponse(text);
    AppState.chatMessages.push({ 
      sender: 'bot', 
      text: botReply, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    });
    saveChat();
    renderChatMessages();
    lucide.createIcons();
  }, 500);
}

function showChatTyping(show) {
  const typingEl = document.getElementById('chat-typing-indicator');
  if (!typingEl) return;
  if (show) {
    typingEl.classList.remove('hidden');
  } else {
    typingEl.classList.add('hidden');
  }
}

// ENHANCED BOT INTELLIGENCE ENGINE (HEALTHCARE REQUIREMENT ASSISTANT)
function matchBotResponse(query) {
  const q = query.toLowerCase().trim();

  // 1. EMERGENCY SAFETY CHECK (Brief response for potentially serious emergency symptoms)
  const emergencyKeywords = ['chest pain', 'severe shortness of breath', 'difficulty breathing', 'sudden vision loss', 'severe bleeding', 'unconscious', 'stroke', 'seizure', 'heart attack', 'anaphylaxis'];
  if (emergencyKeywords.some(k => q.includes(k))) {
    return `
      <div class="space-y-2">
        <div class="flex items-center gap-1.5 text-rose-400 font-extrabold text-xs">
          <i data-lucide="siren" class="w-4 h-4"></i>
          <span>EMERGENCY MEDICAL NOTICE</span>
        </div>
        <p class="text-slate-100 font-bold leading-relaxed">
          ⚠️ Please seek immediate emergency medical attention or contact emergency services (e.g. 911 / 112) right away. Do not rely on automated messaging for severe or life-threatening symptoms.
        </p>
      </div>
    `;
  }

  // 2. GENERAL SAFETY CHECK: Diagnosis, Prescribing, Dosage alteration requests
  const generalSafetyKeywords = ['diagnose me', 'what disease do i have', 'prescribe me', 'tell me to stop taking', 'should i stop taking', 'should i change dose'];
  if (generalSafetyKeywords.some(k => q.includes(k))) {
    return `
      <div class="space-y-2">
        <div class="flex items-center gap-1.5 text-rose-400 font-extrabold text-xs">
          <i data-lucide="shield-alert" class="w-4 h-4"></i>
          <span>Medical Safety Disclaimer</span>
        </div>
        <p class="text-slate-200">
          DAYMES Assistant is an automated healthcare information guide. I am <strong>NOT</strong> permitted to diagnose conditions, prescribe medicines, or modify existing prescription dosages.
        </p>
        <p class="text-slate-200 font-semibold bg-rose-950/80 p-2 rounded-xl border border-rose-800">
          👩‍⚕️ Please consult a qualified physician or pharmacist for medical diagnosis or prescription adjustments.
        </p>
      </div>
    `;
  }

  // 3. ILLNESS & SYMPTOM MEDICINE RECOMMENDATIONS
  // A. Fever / High Temperature / Chills
  if (q.includes('fever') || q.includes('temperature') || q.includes('feverish') || q.includes('chills') || q.includes('shivering')) {
    const med = AppState.products.find(p => p.id === 'prod-1') || {
      id: 'prod-1',
      name: 'Paracetamol 500mg Extra Strength',
      price: 4.99,
      dosage: '1 tablet (500mg) every 4-6 hours as needed (Max 4,000mg/day)',
      purpose: 'Fast-acting fever reduction and body ache relief'
    };

    return `
      <div class="space-y-2.5 text-xs">
        <div class="p-3 bg-slate-800 rounded-2xl border border-teal-500/40 space-y-2">
          <div class="flex items-center gap-2 text-teal-300 font-extrabold">
            <i data-lucide="thermometer" class="w-4 h-4 text-teal-400"></i>
            <span>AI Healthcare Recommendation: Fever Relief</span>
          </div>
          <p class="text-slate-200 leading-relaxed">
            For fever and high body temperature, <strong>Paracetamol 500mg</strong> (Acetaminophen) is the primary recommended antipyretic medicine.
          </p>
          <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 space-y-1">
            <p><strong>• Adult Dosage:</strong> 1 to 2 tablets (500mg–1000mg) every 4 to 6 hours with water.</p>
            <p><strong>• Max Limit:</strong> Never exceed 8 tablets (4,000mg) within 24 hours.</p>
            <p><strong>• Safe Care:</strong> Drink plenty of water or electrolyte fluids and rest well.</p>
          </div>
        </div>

        <!-- Medicine Recommendation Card -->
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between gap-2 shadow-sm">
          <div>
            <h5 class="font-bold text-white text-xs">${med.name}</h5>
            <p class="text-[10px] text-teal-400">Recommended for Fever & Pain Relief</p>
            <span class="text-xs font-black text-white">$${med.price.toFixed(2)}</span>
          </div>
          <button onclick="addToCart('${med.id}'); showToast('Added Paracetamol to Cart!', 'success');" class="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-md transition-all active:scale-95">
            <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
            <span>+ Add to Cart</span>
          </button>
        </div>

        <p class="text-[10px] text-amber-300/90">
          ⚠️ <em>If fever exceeds 102°F (38.9°C) or lasts over 3 days, please consult a certified doctor.</em>
        </p>

        <div class="flex gap-2 pt-1">
          <button onclick="openDoctorConsultModal('General Physician', 'Fever symptoms consultation')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>Consult Doctor</span>
          </button>
          <button onclick="navigateTo('medicines')" class="py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold">
            Browse Catalog
          </button>
        </div>
      </div>
    `;
  }

  // B. Headache / Migraine / Body Pain
  if (q.includes('headache') || q.includes('migraine') || q.includes('head pain') || q.includes('body pain') || q.includes('body ache') || q.includes('toothache')) {
    const med = AppState.products.find(p => p.id === 'prod-1');
    const ibup = AppState.products.find(p => p.id === 'prod-4');

    return `
      <div class="space-y-2.5 text-xs">
        <div class="p-3 bg-slate-800 rounded-2xl border border-sky-500/40 space-y-2">
          <div class="flex items-center gap-2 text-sky-300 font-extrabold">
            <i data-lucide="activity" class="w-4 h-4 text-sky-400"></i>
            <span>AI Healthcare Recommendation: Pain Relief</span>
          </div>
          <p class="text-slate-200 leading-relaxed">
            For headaches, tension, and mild body aches, <strong>Paracetamol 500mg</strong> is gentle on the stomach. For muscular swelling or toothaches, <strong>Ibuprofen 400mg</strong> (NSAID) taken with food is also effective.
          </p>
        </div>

        ${med ? `
        <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between gap-2 shadow-sm">
          <div>
            <h5 class="font-bold text-white text-xs">${med.name}</h5>
            <span class="text-xs font-black text-white">$${med.price.toFixed(2)}</span>
          </div>
          <button onclick="addToCart('${med.id}'); showToast('Added Paracetamol to Cart!', 'success');" class="px-2.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-xs">
            + Add to Cart
          </button>
        </div>` : ''}

        ${ibup ? `
        <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between gap-2 shadow-sm">
          <div>
            <h5 class="font-bold text-white text-xs">${ibup.name}</h5>
            <span class="text-xs font-black text-white">$${ibup.price.toFixed(2)}</span>
          </div>
          <button onclick="addToCart('${ibup.id}'); showToast('Added Ibuprofen to Cart!', 'success');" class="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-lg text-xs">
            + Add to Cart
          </button>
        </div>` : ''}
      </div>
    `;
  }

  // C. Cold / Allergy / Sneezing
  if (q.includes('cold') || q.includes('allergy') || q.includes('sneezing') || q.includes('runny nose')) {
    const med = AppState.products.find(p => p.id === 'prod-6');
    return `
      <div class="space-y-2.5 text-xs">
        <div class="p-3 bg-slate-800 rounded-2xl border border-teal-500/40 space-y-2">
          <div class="flex items-center gap-2 text-teal-300 font-extrabold">
            <i data-lucide="wind" class="w-4 h-4 text-teal-400"></i>
            <span>AI Healthcare Recommendation: Allergy & Cold</span>
          </div>
          <p class="text-slate-200 leading-relaxed">
            For sneezing, runny nose, and allergic reactions, <strong>Cetirizine 10mg</strong> provides 24-hour non-drowsy relief. Take 1 tablet once daily with water.
          </p>
        </div>
        ${med ? `
        <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between gap-2 shadow-sm">
          <div>
            <h5 class="font-bold text-white text-xs">${med.name}</h5>
            <span class="text-xs font-black text-white">$${med.price.toFixed(2)}</span>
          </div>
          <button onclick="addToCart('${med.id}'); showToast('Added Cetirizine to Cart!', 'success');" class="px-2.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-xs">
            + Add to Cart
          </button>
        </div>` : ''}
      </div>
    `;
  }

  // 4. SPECIFIC REORDER REQUEST FLOW: "I need to reorder [Medicine]" / "reorder [Medicine]"
  if (q.includes('reorder') && (q.includes('paracetamol') || q.includes('omeprazole') || q.includes('vitamin c') || q.includes('cetirizine'))) {
    const matched = AppState.products.find(p => p.aliases.some(a => q.includes(a)));
    if (matched) {
      return `
        <div class="space-y-2.5">
          <h4 class="font-extrabold text-white text-xs flex items-center gap-1">
            <i data-lucide="refresh-cw" class="w-4 h-4 text-emerald-400"></i>
            <span>Reorder ${matched.name}</span>
          </h4>
          <p class="text-xs text-slate-300">
            I located <strong>${matched.name}</strong> ($${matched.price.toFixed(2)}) in your history & database catalog.
          </p>
          <div class="flex gap-2">
            <button onclick="addToCart('${matched.id}'); navigateTo('reorder');" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>Reorder ${matched.name} Now</span>
            </button>
          </div>
        </div>
      `;
    }
  }

  // 5. PRODUCT DATABASE LOOKUP (e.g. "What is Paracetamol?", "Show me Vitamin C")
  const matchedProduct = AppState.products.find(p => {
    const nameMatch = q.includes(p.name.toLowerCase());
    const aliasMatch = p.aliases && p.aliases.some(a => q.includes(a.toLowerCase()));
    return nameMatch || aliasMatch;
  });

  if (matchedProduct) {
    const rxBadge = matchedProduct.requiresRx 
      ? '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-rose-950 text-rose-300 border border-rose-800">Prescription Required (Rx)</span>'
      : '<span class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">Over-The-Counter (OTC)</span>';

    return `
      <div class="space-y-2.5">
        <div class="flex items-center justify-between pb-2 border-b border-slate-700">
          <div>
            <h4 class="font-extrabold text-white text-xs">${matchedProduct.name}</h4>
            <span class="text-[10px] font-bold text-sky-400 uppercase tracking-wider">${matchedProduct.category}</span>
          </div>
          <span class="text-xs font-extrabold text-white">$${matchedProduct.price.toFixed(2)}</span>
        </div>

        <div class="mb-1">${rxBadge}</div>

        <div class="text-xs space-y-1.5">
          <p><strong class="text-white">🎯 Common Uses:</strong><br/><span class="text-slate-300">${matchedProduct.purpose}</span></p>
          <p><strong class="text-white">ℹ️ Overview:</strong><br/><span class="text-slate-300">${matchedProduct.description}</span></p>
          <p><strong class="text-white">📝 Dosage Note:</strong><br/><span class="text-slate-300">${matchedProduct.dosage}</span></p>
          <p><strong class="text-white">⚠️ Precautions:</strong><br/><span class="text-slate-300">${matchedProduct.precautions}</span></p>
          <p><strong class="text-white">⚡ Known Side Effects:</strong><br/><span class="text-slate-300">${matchedProduct.sideEffects}</span></p>
          <p><strong class="text-white">🔄 Drug Interactions:</strong><br/><span class="text-slate-300">${matchedProduct.drugInteractions}</span></p>
        </div>

        <div class="pt-2 border-t border-slate-700 flex items-center justify-between gap-2">
          <button onclick="addToCart('${matchedProduct.id}');" class="flex-1 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-[11px] transition-all">
            + Add to Cart ($${matchedProduct.price.toFixed(2)})
          </button>
          <button onclick="navigateTo('medicines'); setCategoryFilter('${matchedProduct.category}');" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-xl text-[11px]">
            View in Catalog
          </button>
        </div>

        <div class="text-[9px] text-slate-400 text-center font-medium">
          📋 Educational Medicine Information — Consult a doctor or pharmacist for medical advice.
        </div>
      </div>
    `;
  }

  // 6. HEALTHCARE GUIDANCE & PROFESSIONAL FINDER
  if (q.includes('guidance') || q.includes('doctor') || q.includes('healthcare professional') || q.includes('consult')) {
    return `
      <div class="space-y-2 text-xs">
        <h4 class="font-extrabold text-white flex items-center gap-1">
          <i data-lucide="stethoscope" class="w-4 h-4 text-sky-400"></i>
          <span>Finding the Right Healthcare Professional:</span>
        </h4>
        <ul class="space-y-1 text-slate-300 list-disc list-inside">
          <li><strong>General Practitioner (GP / Family Doctor):</strong> Consult for routine illnesses, fever, persistent pain, or general health evaluations.</li>
          <li><strong>Pharmacist:</strong> Consult for advice on over-the-counter medicines, dosage administration, precautions, and drug interactions.</li>
          <li><strong>Medical Specialist:</strong> Consult for specialized care (Cardiology, Gastroenterology, Dermatology, etc.).</li>
        </ul>
        <div class="pt-2 border-t border-slate-700 flex flex-col gap-1.5">
          <p class="text-slate-400 text-[11px]">DAYMES Pharmacy Hotline: <strong>+1 (800) 555-DAYZ</strong></p>
          <button onclick="navigateTo('contact')" class="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs">
            Connect with DAYMES Support Team
          </button>
        </div>
      </div>
    `;
  }

  // 7. CATALOG LISTING: "find a medicine", "available medicines", "show medicines"
  if (q.includes('find a medicine') || q.includes('available') || q.includes('list medicines') || q.includes('catalog')) {
    const productListHTML = AppState.products.map(p => `
      <div class="flex items-center justify-between text-xs py-1 border-b border-slate-700">
        <span class="font-bold text-slate-200 truncate max-w-[170px]">${p.name}</span>
        <div class="flex items-center gap-1.5">
          <span class="font-semibold text-sky-400">$${p.price.toFixed(2)}</span>
          ${p.requiresRx ? '<span class="text-[9px] font-bold text-rose-300 bg-rose-950 px-1 rounded">Rx</span>' : '<span class="text-[9px] font-bold text-emerald-300 bg-emerald-950 px-1 rounded">OTC</span>'}
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-2">
        <h4 class="font-extrabold text-white text-xs flex items-center gap-1">
          <i data-lucide="package" class="w-4 h-4 text-sky-400"></i>
          <span>Available Medicines in Demo Catalog (${AppState.products.length}):</span>
        </h4>
        <div class="max-h-48 overflow-y-auto pr-1">
          ${productListHTML}
        </div>
        <button onclick="navigateTo('medicines')" class="w-full mt-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs">
          Open Medicines Shopping Catalog
        </button>
      </div>
    `;
  }

  // 8. REORDER SYSTEM INQUIRIES
  if (q.includes('reorder medicine') || q.includes('how to reorder')) {
    return `
      <div class="space-y-2">
        <h4 class="font-extrabold text-white text-xs flex items-center gap-1">
          <i data-lucide="refresh-cw" class="w-4 h-4 text-emerald-400"></i>
          <span>How to Reorder Medicines:</span>
        </h4>
        <ol class="list-decimal list-inside text-xs text-slate-300 space-y-1">
          <li>Click on <strong>Reorder</strong> in the top navigation bar.</li>
          <li>Review items flagged as <span class="text-amber-400 font-bold">Refill Due Soon</span> or <span class="text-emerald-400 font-bold">Refill Available</span>.</li>
          <li>Select the checkboxes for medicines you need.</li>
          <li>Adjust quantities and click <strong>Reorder Selected</strong>.</li>
        </ol>
        <button onclick="navigateTo('reorder')" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs">
          Go to Smart Reorder Portal
        </button>
      </div>
    `;
  }

  // 9. MY ORDERS INQUIRIES
  if (q.includes('my orders') || q.includes('track') || q.includes('order status')) {
    if (AppState.orders.length === 0) {
      return `You currently have no active orders placed. You can order items from our Medicines page anytime!`;
    }

    const latestOrder = AppState.orders[0];
    return `
      <div class="space-y-2">
        <h4 class="font-extrabold text-white text-xs flex items-center gap-1">
          <i data-lucide="truck" class="w-4 h-4 text-sky-400"></i>
          <span>Latest Order Tracking Update:</span>
        </h4>
        <div class="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-xs space-y-1">
          <div class="flex justify-between">
            <span class="font-bold text-white">${latestOrder.orderId}</span>
            <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${latestOrder.statusClass}">${latestOrder.status}</span>
          </div>
          <p class="text-slate-400">Date: ${latestOrder.date} | Total: $${latestOrder.total.toFixed(2)}</p>
        </div>
        <button onclick="navigateTo('orders')" class="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs">
          View All Orders in Dashboard
        </button>
      </div>
    `;
  }

  // DEFAULT / GENERAL ASSISTANT RESPONSE
  return `
    <div class="space-y-2 text-xs text-slate-200">
      <p>I am your <strong>DAYMES Assistant</strong>. How can I assist you today?</p>
      <p class="text-slate-400">Select an option below or type a query:</p>
      <div class="grid grid-cols-1 gap-1">
        <button onclick="sendChatMessage('Find a Medicine')" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-sky-300 font-semibold flex items-center gap-2">🔎 Find a Medicine in Catalog</button>
        <button onclick="sendChatMessage('What is Paracetamol?')" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-sky-300 font-semibold flex items-center gap-2">💊 Educational Medicine Information</button>
        <button onclick="sendChatMessage('Reorder Medicine')" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-sky-300 font-semibold flex items-center gap-2">🔄 Smart Reorder Portal</button>
        <button onclick="sendChatMessage('Healthcare Guidance')" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-sky-300 font-semibold flex items-center gap-2">🩺 Healthcare Professional Guidance</button>
      </div>
    </div>
  `;
}

function clearChatHistory() {
  AppState.chatMessages = [
    { 
      sender: 'bot', 
      text: 'Chat history cleared. How can I help you today?<br/><br/><span class="text-[10px] text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700 block">DAYMES Assistant provides general healthcare and medicine information. It does not diagnose conditions or prescribe medicines. For personalized medical advice, consult a qualified doctor or pharmacist.</span>', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ];
  saveChat();
  renderChatMessages();
}

// CONTACT FORM SUBMISSION
function handleContactSubmit(event) {
  event.preventDefault();
  showToast('Thank you! Your message has been sent to DAYMES support team.', 'success');
  event.target.reset();
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderMedicinesCatalog();
  renderReorderPage();
  renderOrdersPage();
  renderHealthcareDashboard();

  // Listeners for Category Pills
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      setCategoryFilter(e.target.dataset.category);
    });
  });

  // Listeners for Global Search Inputs
  const globalInput = document.getElementById('global-search-input');
  if (globalInput) {
    globalInput.addEventListener('input', (e) => handleSearchInput(e.target.value));
  }

  const catalogInput = document.getElementById('catalog-search-input');
  if (catalogInput) {
    catalogInput.addEventListener('input', (e) => handleSearchInput(e.target.value));
  }

  const sortSelect = document.getElementById('catalog-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      renderMedicinesCatalog();
    });
  }

  // FAQ Accordion listener
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  lucide.createIcons();
});
