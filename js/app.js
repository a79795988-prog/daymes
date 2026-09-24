/**
 * DAYMES - Application Controller (Dark Theme & Healthcare Requirement Assistant)
 */

// ─── Safari & Private Browsing Compatibility Layer ────────────────────────
function getSafeStorageItem(key, defaultVal) {
  try {
    if (typeof window !== 'undefined') {
      if (typeof window.safeStorageGet === 'function') {
        const res = window.safeStorageGet(key);
        if (res !== null) return JSON.parse(res);
      } else if (window.localStorage) {
        const res = window.localStorage.getItem(key);
        if (res !== null) return JSON.parse(res);
      }
    }
  } catch (e) {
    console.warn('DAYMES: Storage read warning for key ' + key + ':', e);
  }
  return defaultVal;
}

function setSafeStorageItem(key, val) {
  try {
    const str = JSON.stringify(val);
    if (typeof window !== 'undefined') {
      if (typeof window.safeStorageSet === 'function') {
        window.safeStorageSet(key, str);
      } else if (window.localStorage) {
        window.localStorage.setItem(key, str);
      }
    }
  } catch (e) {
    console.warn('DAYMES: Storage write warning for key ' + key + ':', e);
  }
}

// Safe Lucide Icon Runner (prevents undefined errors if CDN is delayed or blocked in Safari)
function safeCreateIcons(options) {
  if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons(options);
    } catch (err) {
      console.warn('Lucide icon rendering warning:', err);
    }
  }
}

if (typeof window.lucide === 'undefined') {
  window.lucide = {
    createIcons: safeCreateIcons
  };
} else {
  const origCreate = window.lucide.createIcons;
  window.lucide.createIcons = function(opts) {
    try {
      if (typeof origCreate === 'function') origCreate(opts);
    } catch (e) {
      console.warn('Lucide icon error caught:', e);
    }
  };
}

// Re-run icons when window finishes full loading
window.addEventListener('load', () => {
  safeCreateIcons();
});


// State Container
const AppState = {
  activeTab: 'home',
  products: [...INITIAL_PRODUCTS],
  cart: getSafeStorageItem('medicare_cart', []),
  orders: getSafeStorageItem('medicare_orders', [...INITIAL_ORDERS]),
  reorderItems: getSafeStorageItem('medicare_reorder', [...INITIAL_REORDER_ITEMS]),
  schedule: getSafeStorageItem('medicare_schedule', [...INITIAL_MEDICATION_SCHEDULE]),
  chatMessages: getSafeStorageItem('medicare_chat', [
    { 
      sender: 'bot', 
      text: `
        <div class="space-y-3">
          <div class="flex items-center gap-2 pb-2 border-b border-slate-700/80">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              <i data-lucide="bot" class="w-4 h-4 text-white"></i>
            </div>
            <div>
              <h4 class="font-extrabold text-white text-xs">DAYMES Smart Health Assistant</h4>
              <p class="text-[10px] text-teal-300">24/7 Guidance, Symptom Assessment & Medicine Support</p>
            </div>
          </div>

          <p class="text-slate-200 leading-relaxed">
            Hi! I am your <strong>DAYMES Health Assistant</strong> 👋. How can I assist you today?
          </p>

          <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-1.5 text-xs">
            <span class="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider block">You can ask me about:</span>
            <ul class="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
              <li><strong>Symptoms:</strong> <em>“I have a headache”</em>, <em>“Cough and sore throat”</em></li>
              <li><strong>Medicine Requirements:</strong> <em>“I need my regular medicine”</em></li>
              <li><strong>General Health:</strong> <em>“What is Paracetamol?”</em>, <em>“How to stay hydrated?”</em></li>
            </ul>
          </div>

          <div class="space-y-1 pt-1">
            <button onclick="sendChatMessage('I have a headache.')" class="w-full p-2 bg-slate-800/90 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-sky-300 font-semibold flex items-center justify-between text-[11px] transition-all">
              <span>🤕 I have a headache</span>
              <span class="text-slate-400">→</span>
            </button>
            <button onclick="sendChatMessage('I need my regular medicine.')" class="w-full p-2 bg-slate-800/90 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-emerald-300 font-semibold flex items-center justify-between text-[11px] transition-all">
              <span>💊 I need my regular medicine</span>
              <span class="text-slate-400">→</span>
            </button>
            <button onclick="sendChatMessage('I have a cough and sore throat.')" class="w-full p-2 bg-slate-800/90 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-sky-300 font-semibold flex items-center justify-between text-[11px] transition-all">
              <span>🤧 Cough & sore throat</span>
              <span class="text-slate-400">→</span>
            </button>
          </div>

          <div class="text-[9px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800/90 text-center font-medium leading-tight">
            🛡️ <em>DAYMES Health Assistant provides general health information and is not a substitute for professional medical advice.</em>
          </div>
        </div>
      `, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ],
  reorderSelectedIds: new Set(['reorder-101', 'reorder-104']),
  searchQuery: '',
  selectedCategory: 'All',
  sortBy: 'featured',
  isChatOpen: false
};

// Storage Sync Helpers (Safari Private Mode Compatible)
function saveCart() {
  setSafeStorageItem('medicare_cart', AppState.cart);
  updateCartBadge();
}

function saveOrders() {
  setSafeStorageItem('medicare_orders', AppState.orders);
}

function saveReorder() {
  setSafeStorageItem('medicare_reorder', AppState.reorderItems);
}

function saveSchedule() {
  setSafeStorageItem('medicare_schedule', AppState.schedule);
}

function saveChat() {
  setSafeStorageItem('medicare_chat', AppState.chatMessages);
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
    subtotalEl.textContent = '₹0.00';
    totalEl.textContent = '₹0.00';
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
          <p class="text-xs font-semibold text-sky-400 mt-0.5">₹${item.price.toFixed(2)}</p>
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

  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal + shipping;

  subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  totalEl.textContent = `₹${grandTotal.toFixed(2)}`;

  const shippingNote = document.getElementById('cart-shipping-note');
  if (shippingNote) {
    if (shipping === 0) {
      shippingNote.innerHTML = '<span class="text-emerald-400 font-semibold">FREE Shipping Applied</span>';
    } else {
      shippingNote.innerHTML = `<span>Add ₹${(300 - subtotal).toFixed(2)} more for FREE shipping</span>`;
    }
  }

  lucide.createIcons();
}

// MEDICINES CATALOG VIEW
function renderMedicinesCatalog() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = AppState.products.filter(p => {
    const q = AppState.searchQuery.toLowerCase().trim();
    const pCat = (p.category || '').toLowerCase();
    const selectedCat = (AppState.selectedCategory || 'All').toLowerCase();
    
    let matchesCategory = selectedCat === 'all' || pCat === selectedCat;
    if (!matchesCategory) {
      if (selectedCat === 'cold & throat care' && (pCat === 'cold & nasal care' || (p.aliases && p.aliases.some(a => a.toLowerCase().includes('cold'))))) {
        matchesCategory = true;
      } else if (selectedCat === 'pain & fever' && (pCat === 'pain relief' || (p.aliases && p.aliases.some(a => a.toLowerCase().includes('pain'))))) {
        matchesCategory = true;
      }
    }

    if (!q) {
      return matchesCategory;
    }

    const matchesSearch = (p.name && p.name.toLowerCase().includes(q)) ||
                          (p.genericName && p.genericName.toLowerCase().includes(q)) ||
                          (p.description && p.description.toLowerCase().includes(q)) ||
                          (p.category && p.category.toLowerCase().includes(q)) ||
                          (p.form && p.form.toLowerCase().includes(q)) ||
                          (p.purpose && p.purpose.toLowerCase().includes(q)) ||
                          (p.aliases && p.aliases.some(a => a.toLowerCase().includes(q)));

    return matchesSearch && matchesCategory;
  });

  // Sort logic
  if (AppState.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.sortBy === 'name-az') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (AppState.sortBy === 'availability') {
    filtered.sort((a, b) => b.stock - a.stock);
  } else {
    // 'featured' / 'recommended'
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const resultsCount = document.getElementById('catalog-results-count');
  if (resultsCount) {
    resultsCount.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
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

  grid.innerHTML = filtered.map(product => {
    // Form Badge helper
    let formBadge = '';
    const formLower = (product.form || '').toLowerCase();
    if (formLower.includes('syrup') || formLower.includes('liquid')) {
      formBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-sky-950/90 text-sky-300 border border-sky-800/80 flex items-center gap-1"><i data-lucide="droplets" class="w-3 h-3"></i> ${product.form}</span>`;
    } else if (formLower.includes('sachet') || formLower.includes('pack')) {
      formBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-950/90 text-amber-300 border border-amber-800/80 flex items-center gap-1"><i data-lucide="package" class="w-3 h-3"></i> ${product.form}</span>`;
    } else if (formLower.includes('spray')) {
      formBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-teal-950/90 text-teal-300 border border-teal-800/80 flex items-center gap-1"><i data-lucide="wind" class="w-3 h-3"></i> Spray</span>`;
    } else if (formLower.includes('device')) {
      formBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-purple-950/90 text-purple-300 border border-purple-800/80 flex items-center gap-1"><i data-lucide="activity" class="w-3 h-3"></i> Device</span>`;
    } else if (formLower.includes('cream') || formLower.includes('jelly')) {
      formBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-pink-950/90 text-pink-300 border border-pink-800/80 flex items-center gap-1"><i data-lucide="sparkles" class="w-3 h-3"></i> ${product.form}</span>`;
    } else if (formLower.includes('drop')) {
      formBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 flex items-center gap-1"><i data-lucide="eye" class="w-3 h-3"></i> Drops</span>`;
    } else if (formLower.includes('lozenge')) {
      formBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 flex items-center gap-1"><i data-lucide="disc" class="w-3 h-3"></i> Lozenge</span>`;
    } else {
      formBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-indigo-950/90 text-indigo-300 border border-indigo-800/80 flex items-center gap-1"><i data-lucide="pill" class="w-3 h-3"></i> ${product.form || 'Tablet'}</span>`;
    }

    // Stock Badge helper
    let stockBadge = '';
    if (product.stock === 0) {
      stockBadge = `<span class="text-[11px] font-bold text-rose-400 block mt-0.5 flex items-center gap-1">🔴 Out of Stock</span>`;
    } else if (product.stock <= 20) {
      stockBadge = `<span class="text-[11px] font-bold text-amber-400 block mt-0.5 flex items-center gap-1">🟡 Low Stock (${product.stock} left)</span>`;
    } else {
      stockBadge = `<span class="text-[11px] font-bold text-emerald-400 block mt-0.5 flex items-center gap-1">🟢 In Stock</span>`;
    }

    // Prescription & Healthcare Guidance Notices
    let noticeBadge = '';
    if (product.requiresRx) {
      noticeBadge = `
        <div class="mt-2.5 p-2 rounded-xl bg-rose-950/60 border border-rose-800/80 text-[10px] text-rose-200 font-semibold leading-relaxed flex items-start gap-1.5">
          <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5"></i>
          <span>Prescription required — consult a qualified healthcare professional.</span>
        </div>
      `;
    } else if (product.category === 'Eye Care') {
      noticeBadge = `
        <div class="mt-2.5 p-2 rounded-xl bg-sky-950/60 border border-sky-800/80 text-[10px] text-sky-200 font-medium leading-relaxed flex items-start gap-1.5">
          <i data-lucide="info" class="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5"></i>
          <span>Healthcare Guidance: For general eye lubrication; consult an eye specialist if irritation persists.</span>
        </div>
      `;
    }

    return `
      <div id="product-card-${product.id}" class="bg-slate-900/90 backdrop-blur rounded-2xl border border-slate-800 hover:border-sky-500/50 shadow-card shadow-card-hover p-4 flex flex-col justify-between relative overflow-hidden group transition-all duration-300">
        <div>
          <!-- Product Image & Badges -->
          <div class="relative w-full h-44 mb-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/60">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            
            <div class="absolute top-2 left-2 flex flex-col gap-1">
              ${formBadge}
              ${product.requiresRx ? 
                '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-lg bg-rose-600/90 text-white shadow-sm flex items-center gap-1"><i data-lucide="file-text" class="w-3 h-3"></i> Rx Req.</span>' : 
                '<span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-600/90 text-white shadow-sm flex items-center gap-1"><i data-lucide="check" class="w-3 h-3"></i> OTC</span>'}
            </div>

            <span class="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-900/90 backdrop-blur text-slate-200 shadow-sm flex items-center gap-1 border border-slate-700">
              <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i> ${product.rating}
            </span>
          </div>

          <!-- Category & Form -->
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">${product.category}</span>
            <span class="text-[10px] font-semibold text-slate-400">${product.form}</span>
          </div>

          <!-- Medicine Name -->
          <h3 class="text-sm font-bold text-white group-hover:text-sky-400 transition-colors leading-snug">${product.name}</h3>
          
          <!-- Generic Name -->
          ${product.genericName ? `<p class="text-[11px] text-teal-400 font-medium mt-0.5 line-clamp-1 italic">${product.genericName}</p>` : ''}

          <!-- Short Description -->
          <p class="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">${product.description}</p>
          
          <!-- Notice Banner if Rx or Eye Care -->
          ${noticeBadge}

          <!-- Purpose / Dosage Highlight -->
          <div class="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 line-clamp-1">
            <i data-lucide="activity" class="w-3 h-3 text-sky-500 flex-shrink-0"></i>
            <span class="truncate">${product.purpose || product.dosage || 'Healthcare formulation'}</span>
          </div>
        </div>

        <!-- Price, Stock & Action Buttons -->
        <div class="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-lg font-extrabold text-white tracking-tight">₹${product.price}</span>
              ${stockBadge}
            </div>
            
            <!-- Quantity Selector on Card -->
            <div class="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
              <button onclick="adjustCardQty('${product.id}', -1)" class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold active:scale-95" title="Decrease quantity" aria-label="Decrease quantity">-</button>
              <span id="card-qty-${product.id}" class="w-7 text-center text-xs font-bold text-slate-200">1</span>
              <button onclick="adjustCardQty('${product.id}', 1)" class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold active:scale-95" title="Increase quantity" aria-label="Increase quantity">+</button>
            </div>
          </div>

          <!-- Add to Cart & Reorder Buttons -->
          <div class="grid grid-cols-2 gap-2">
            <button onclick="addCardProductToCart('${product.id}')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 hover:border-sky-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
              <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
              <span>Add to Cart</span>
            </button>
            <button onclick="instantReorderProduct('${product.id}')" class="px-3 py-2 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-950/50 transition-all flex items-center justify-center gap-1.5 active:scale-95">
              <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
              <span>Reorder</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function adjustCardQty(productId, delta) {
  const qtyEl = document.getElementById(`card-qty-${productId}`);
  if (!qtyEl) return;
  const product = AppState.products.find(p => p.id === productId);
  const maxStock = product ? (product.stock || 99) : 99;
  let current = parseInt(qtyEl.textContent) || 1;
  current += delta;
  if (current < 1) current = 1;
  if (current > maxStock) current = maxStock;
  qtyEl.textContent = current;
}

function addCardProductToCart(productId) {
  const qtyEl = document.getElementById(`card-qty-${productId}`);
  const qty = qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1;
  addToCart(productId, qty);
}

function instantReorderProduct(productId) {
  const qtyEl = document.getElementById(`card-qty-${productId}`);
  const qty = qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1;
  addToCart(productId, qty);
  openCheckoutModal();
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
            <span class="text-base font-extrabold text-white">₹${(item.price * item.defaultQty).toFixed(2)}</span>
            <span class="text-[10px] text-slate-400 block">₹${item.price.toFixed(2)} each</span>
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
  totalEl.textContent = `₹${total.toFixed(2)}`;

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
          <span class="text-lg font-extrabold text-sky-400">₹${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="py-4 space-y-2">
        ${order.items.map(item => `
          <div class="flex items-center justify-between text-xs py-1">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-slate-800 text-sky-400 font-bold flex items-center justify-center text-[11px] border border-slate-700">${item.qty}x</span>
              <span class="font-bold text-slate-200">${item.name}</span>
            </div>
            <span class="font-semibold text-slate-300">₹${(item.price * item.qty).toFixed(2)}</span>
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
        <span class="font-bold text-white">₹${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
  }).join('');

  const shipping = subtotal > 300 ? 0 : 40;
  const total = subtotal + shipping;

  document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
  document.getElementById('checkout-grand-total').textContent = `₹${total.toFixed(2)}`;

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
  const shipping = subtotal > 300 ? 0 : 40;
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
  setTimeout(async () => {
    // --- Backend Integration ---
    if (typeof DaymesAPI !== 'undefined' && backendAvailable) {
      try {
        const chatResult = await DaymesAPI.chat(text, AppState.chatMessages);
        if (chatResult && chatResult.reply) {
          showChatTyping(false);
          AppState.chatMessages.push({ sender: 'bot', text: chatResult.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
          saveChat();
          renderChatMessages();
          lucide.createIcons();
          return; // Skip local matchBotResponse
        }
      } catch (e) { console.warn('[Chat] Backend chatbot failed, using local:', e); }
    }
    // --- End Backend Integration ---

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
// DOCTOR CONSULTATION MODAL CONTROLLERS
function openDoctorConsultModal(specialty = 'General Physician', notes = '') {
  const modal = document.getElementById('doctor-consult-modal');
  if (!modal) return;
  
  const specialtySelect = document.getElementById('doc-specialty');
  if (specialtySelect && specialty) {
    specialtySelect.value = specialty;
  }

  const notesInput = document.getElementById('doc-notes');
  if (notesInput && notes) {
    notesInput.value = notes;
  }

  // Set default date to tomorrow
  const dateInput = document.getElementById('doc-date');
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeDoctorConsultModal() {
  const modal = document.getElementById('doctor-consult-modal');
  if (modal) modal.classList.add('hidden');
}

function handleDoctorBookingSubmit(event) {
  event.preventDefault();
  const specialty = document.getElementById('doc-specialty').value;
  const mode = document.getElementById('doc-mode').value;
  const date = document.getElementById('doc-date').value;
  
  closeDoctorConsultModal();
  showToast(`Appointment scheduled with ${specialty} (${mode}) on ${date}!`, 'success');
  
  // Add confirmation message in chat if open
  if (AppState.isChatOpen) {
    AppState.chatMessages.push({
      sender: 'bot',
      text: `
        <div class="space-y-2">
          <div class="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>Doctor Consultation Confirmed</span>
          </div>
          <p class="text-slate-200">
            Your appointment with a <strong>${specialty}</strong> via <strong>${mode}</strong> has been scheduled for <strong>${date}</strong>.
          </p>
          <p class="text-[11px] text-slate-400">
            A confirmation email and teleconsultation link have been sent to your registered account.
          </p>
          <div class="pt-1">
            <button onclick="navigateTo('healthcare')" class="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold rounded-xl text-[11px] border border-slate-700">
              View Profile & Care Schedule
            </button>
          </div>
        </div>
      `,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveChat();
    renderChatMessages();
    lucide.createIcons();
  }
}

// EMERGENCY & HOSPITAL LOCATOR MODAL CONTROLLERS
function openHospitalLocatorModal() {
  const modal = document.getElementById('emergency-hospital-modal');
  if (modal) {
    modal.classList.remove('hidden');
    lucide.createIcons();
  }
}

function closeHospitalLocatorModal() {
  const modal = document.getElementById('emergency-hospital-modal');
  if (modal) modal.classList.add('hidden');
}

function triggerEmergencyPrompt() {
  if (!AppState.isChatOpen) {
    toggleChatbot();
  }
  sendChatMessage('EMERGENCY HELP NEEDED');
}

function triggerEmergencyCall() {
  window.location.href = 'tel:911';
}

// ENHANCED SMART HEALTH CHATBOT ENGINE
function matchBotResponse(query) {
  const q = query.toLowerCase().trim();

  // 1. 🚨 CRITICAL EMERGENCY DETECTION (Highest Priority)
  const emergencyKeywords = [
    'chest pain', 'chest pressure', 'severe shortness of breath', 'difficulty breathing', 'cannot breathe', 'can\'t breathe',
    'sudden vision loss', 'severe bleeding', 'unconscious', 'passed out', 'fainting', 'fainted', 'stroke', 'seizure', 'convulsion',
    'heart attack', 'anaphylaxis', 'choking', 'killing myself', 'suicide', 'overdose', 'infant fever', 'blue lips',
    'numb face', 'slurred speech', 'emergency help needed', 'urgent emergency', 'emergency'
  ];

  if (emergencyKeywords.some(k => q.includes(k))) {
    return `
      <div class="space-y-3">
        <div class="bg-rose-950/90 border-2 border-rose-500 rounded-2xl p-4 text-white space-y-2.5 shadow-lg shadow-rose-950/60">
          <div class="flex items-center gap-2 text-rose-300 font-black text-xs sm:text-sm">
            <i data-lucide="alert-triangle" class="w-5 h-5 text-rose-400"></i>
            <span>🚨 URGENT MEDICAL ATTENTION REQUIRED</span>
          </div>
          <p class="text-xs text-rose-100 font-bold leading-relaxed">
            This may require urgent medical attention. Please contact emergency services or visit the nearest hospital immediately.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1.5">
            <a href="tel:911" class="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all text-center">
              <i data-lucide="phone-call" class="w-3.5 h-3.5"></i>
              <span>🚑 Emergency Help</span>
            </a>
            <button onclick="openHospitalLocatorModal()" class="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-rose-200 border border-rose-700/80 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="building-2" class="w-3.5 h-3.5"></i>
              <span>🏥 Find a Hospital</span>
            </button>
            <button onclick="openDoctorConsultModal('General Physician', 'Urgent medical symptoms reported')" class="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-sky-700/80 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
              <span>👨‍⚕️ Consult Doctor</span>
            </button>
          </div>
        </div>
        <div class="text-[10px] text-slate-400 text-center font-medium">
          ⚠️ Do not delay medical care. If you cannot reach emergency services, have someone take you to the nearest Emergency Room.
        </div>
      </div>
    `;
  }

  // 2. DIAGNOSIS & PRESCRIPTION RESTRICTION GUARD
  const strictMedicalKeywords = ['prescribe', 'prescription', 'can you prescribe', 'prescribe me', 'write prescription', 'diagnose me', 'what disease do i have', 'cure me completely', 'will this definitely cure', 'give me medicine'];
  if (strictMedicalKeywords.some(k => q.includes(k))) {
    return `
      <div class="space-y-2.5">
        <div class="p-3.5 bg-rose-950/60 rounded-2xl border border-rose-800/80 text-xs space-y-2">
          <p class="font-extrabold text-rose-300 flex items-center gap-1.5">
            <i data-lucide="shield-alert" class="w-4 h-4 text-rose-400"></i>
            <span>Prescription Notice</span>
          </p>
          <p class="text-slate-200 font-semibold leading-relaxed">
            Prescription required — consult a qualified healthcare professional.
          </p>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            DAYMES Health Assistant provides educational product information only and cannot prescribe medications or formulate clinical diagnoses.
          </p>
        </div>
        <div class="flex gap-2">
          <button onclick="openDoctorConsultModal('General Physician', 'Prescription consultation request')" class="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>👨‍⚕️ Consult Qualified Doctor</span>
          </button>
        </div>
      </div>
    `;
  }

  // 3. FOLLOW-UP RESPONSES EVALUATION (When user replies with duration, severity, etc.)
  if (q.includes('duration:') || q.includes('severity:') || q.includes('type:') || q.includes('< 24 hours') || q.includes('1–3 days') || q.includes('more than a week') || q.includes('mild / dull') || q.includes('severe / throbbing') || q.includes('dry tickly') || q.includes('productive with mucus')) {
    const isSevere = q.includes('severe') || q.includes('more than a week') || q.includes('> 3 days');
    return `
      <div class="space-y-3 text-xs">
        <div class="p-3.5 bg-slate-900 rounded-2xl border ${isSevere ? 'border-amber-700/80 bg-amber-950/20' : 'border-slate-800'} space-y-2">
          <h4 class="font-extrabold ${isSevere ? 'text-amber-300' : 'text-sky-300'} flex items-center gap-1.5">
            <i data-lucide="${isSevere ? 'alert-circle' : 'check-circle'}" class="w-4 h-4"></i>
            <span>Symptom Assessment Update</span>
          </h4>
          <p class="text-slate-200 leading-relaxed">
            ${isSevere ? 
              'Since your symptoms are severe or persistent (> 3-7 days), we strongly recommend having a certified healthcare professional evaluate your condition.' : 
              'Thank you for providing that context. For mild or recent symptoms, adequate rest, hydration, and monitoring are standard initial measures.'}
          </p>
          <div class="text-[11px] text-slate-300 pt-1 border-t border-slate-800 space-y-1">
            <p><strong>Recommended next steps:</strong></p>
            <ul class="list-disc list-inside space-y-0.5 text-slate-400">
              <li>Record when symptoms peak or worsen.</li>
              <li>Avoid self-medicating with multiple overlapping drugs.</li>
              <li>Seek prompt medical consultation if new symptoms develop.</li>
            </ul>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button onclick="openDoctorConsultModal('General Physician', 'Follow-up symptom review: ' + AppState.searchQuery)" class="py-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>👨‍⚕️ Consult a Doctor</span>
          </button>
          <button onclick="navigateTo('medicines')" class="py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <i data-lucide="pill" class="w-3.5 h-3.5"></i>
            <span>Browse Catalog</span>
          </button>
        </div>
      </div>
    `;
  }

  // 4. SYMPTOM: HEADACHE
  if (q.includes('headache') || q.includes('migraine') || q.includes('head hurt') || q.includes('head pain')) {
    return `
      <div class="space-y-3 text-xs">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div class="flex items-center gap-2 text-sky-400 font-extrabold">
            <i data-lucide="activity" class="w-4 h-4"></i>
            <span>Headache Guidance & Care</span>
          </div>
          <p class="text-slate-200 leading-relaxed">
            Headaches can be associated with tension, eye strain, dehydration, stress, lack of sleep, or sinus pressure.
          </p>
          <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <strong class="text-white">💡 Safe Self-Care Tips:</strong>
            <ul class="list-disc list-inside text-slate-400 space-y-0.5">
              <li>Rest in a quiet, dimly lit room.</li>
              <li>Drink 1–2 glasses of water to rule out dehydration.</li>
              <li>Apply a gentle cold or warm compress across your forehead.</li>
            </ul>
          </div>
        </div>

        <!-- Follow-up Questions Card -->
        <div class="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <p class="font-bold text-teal-300 text-[11px] flex items-center gap-1">
            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
            <span>Helpful follow-up questions for better guidance:</span>
          </p>
          <div class="space-y-1.5 text-[11px]">
            <p class="text-slate-400">⏱️ How long have you had this headache?</p>
            <div class="flex flex-wrap gap-1.5">
              <button onclick="sendChatMessage('Duration: < 24 hours')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">&lt; 24 hours</button>
              <button onclick="sendChatMessage('Duration: 1–3 days')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">1–3 days</button>
              <button onclick="sendChatMessage('Duration: More than a week')" class="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">&gt; 1 week</button>
            </div>
            
            <p class="text-slate-400 pt-1">⚡ How severe is the discomfort?</p>
            <div class="flex flex-wrap gap-1.5">
              <button onclick="sendChatMessage('Severity: Mild / Dull ache')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">Mild / Dull</button>
              <button onclick="sendChatMessage('Severity: Moderate pain')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">Moderate</button>
              <button onclick="sendChatMessage('Severity: Severe / Throbbing')" class="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">Severe / Throbbing</button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="openDoctorConsultModal('General Physician', 'Headache consultation')" class="py-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>👨‍⚕️ Consult Doctor</span>
          </button>
          <button onclick="sendChatMessage('What is Paracetamol?')" class="py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <i data-lucide="pill" class="w-3.5 h-3.5"></i>
            <span>Paracetamol Info</span>
          </button>
        </div>
      </div>
    `;
  }

  // 5. SYMPTOM: COUGH & SORE THROAT
  if (q.includes('cough') || q.includes('sore throat') || q.includes('throat') || q.includes('chest congestion') || q.includes('mucus')) {
    return `
      <div class="space-y-3 text-xs">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div class="flex items-center gap-2 text-sky-400 font-extrabold">
            <i data-lucide="activity" class="w-4 h-4"></i>
            <span>Cough & Throat Care Guidance</span>
          </div>
          <p class="text-slate-200 leading-relaxed">
            A cough and sore throat are commonly associated with viral upper respiratory infections, seasonal allergies, or dry air irritation.
          </p>
          <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <strong class="text-white">💡 Safe Soothing Measures:</strong>
            <ul class="list-disc list-inside text-slate-400 space-y-0.5">
              <li>Gargle with warm salt water 2–3 times a day.</li>
              <li>Sip warm water, herbal teas, or honey with lemon.</li>
              <li>Use a cool-mist humidifier in your sleeping area.</li>
            </ul>
          </div>
        </div>

        <!-- Follow-up Questions Card -->
        <div class="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <p class="font-bold text-teal-300 text-[11px] flex items-center gap-1">
            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
            <span>Follow-up questions to understand your symptoms:</span>
          </p>
          <div class="space-y-1.5 text-[11px]">
            <p class="text-slate-400">🔍 What kind of cough are you experiencing?</p>
            <div class="flex flex-wrap gap-1.5">
              <button onclick="sendChatMessage('Type: Dry tickly cough')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">Dry / Tickly</button>
              <button onclick="sendChatMessage('Type: Productive with mucus')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">Wet / Chest Mucus</button>
              <button onclick="sendChatMessage('Type: Sore throat with painful swallowing')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">Painful Swallowing</button>
            </div>
            
            <p class="text-slate-400 pt-1">⏱️ How long has it lasted?</p>
            <div class="flex flex-wrap gap-1.5">
              <button onclick="sendChatMessage('Duration: < 3 days')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">&lt; 3 days</button>
              <button onclick="sendChatMessage('Duration: 4–7 days')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">4–7 days</button>
              <button onclick="sendChatMessage('Duration: More than a week')" class="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">&gt; 1 week</button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="openDoctorConsultModal('ENT Specialist', 'Cough and sore throat consultation')" class="py-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>👨‍⚕️ Consult Doctor</span>
          </button>
          <button onclick="sendChatMessage('Cough Relief Syrup 100ml')" class="py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <i data-lucide="droplets" class="w-3.5 h-3.5"></i>
            <span>Cough Syrup Info</span>
          </button>
        </div>
      </div>
    `;
  }

  // 6. SYMPTOM: FEVER & BODY ACHES
  if (q.includes('fever') || q.includes('feverish') || q.includes('high temperature') || q.includes('chills') || q.includes('body ache')) {
    return `
      <div class="space-y-3 text-xs">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div class="flex items-center gap-2 text-sky-400 font-extrabold">
            <i data-lucide="thermometer" class="w-4 h-4"></i>
            <span>Fever & Body Temperature Guidance</span>
          </div>
          <p class="text-slate-200 leading-relaxed">
            Fever is commonly the body's natural immunological response when fighting viral or bacterial infections.
          </p>
          <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <strong class="text-white">💡 Safe Guidance:</strong>
            <ul class="list-disc list-inside text-slate-400 space-y-0.5">
              <li>Stay well hydrated with clean water, soups, or ORS electrolyte fluids.</li>
              <li>Dress in lightweight, breathable cotton fabrics.</li>
              <li>Rest and record temperature readings every 4 to 6 hours.</li>
            </ul>
          </div>
        </div>

        <!-- Follow-up Questions Card -->
        <div class="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <p class="font-bold text-teal-300 text-[11px] flex items-center gap-1">
            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
            <span>Clarifying questions:</span>
          </p>
          <div class="space-y-1.5 text-[11px]">
            <p class="text-slate-400">🌡️ What is your temperature range?</p>
            <div class="flex flex-wrap gap-1.5">
              <button onclick="sendChatMessage('Severity: Mild fever (< 100°F)')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">&lt; 100°F (Mild)</button>
              <button onclick="sendChatMessage('Severity: Moderate (100-102°F)')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">100–102°F</button>
              <button onclick="sendChatMessage('Severity: High fever (> 102°F)')" class="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">&gt; 102°F (High)</button>
            </div>
            
            <p class="text-slate-400 pt-1">⏱️ How many days have you had the fever?</p>
            <div class="flex flex-wrap gap-1.5">
              <button onclick="sendChatMessage('Duration: 1–2 days')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">1–2 days</button>
              <button onclick="sendChatMessage('Duration: More than 3 days')" class="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-lg text-slate-300 border border-slate-700 text-[10px] font-medium transition-all">&gt; 3 days (Doctor recommended)</button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="openDoctorConsultModal('General Physician', 'Fever assessment')" class="py-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>👨‍⚕️ Consult Doctor</span>
          </button>
          <button onclick="sendChatMessage('Paracetamol 500mg')" class="py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <i data-lucide="pill" class="w-3.5 h-3.5"></i>
            <span>Paracetamol Info</span>
          </button>
        </div>
      </div>
    `;
  }

  // 7. SYMPTOM: ACIDITY, HEARTBURN & DIGESTION
  if (q.includes('acidity') || q.includes('heartburn') || q.includes('acid reflux') || q.includes('indigestion') || q.includes('sour stomach') || q.includes('gas problem')) {
    return `
      <div class="space-y-3 text-xs">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div class="flex items-center gap-2 text-sky-400 font-extrabold">
            <i data-lucide="activity" class="w-4 h-4"></i>
            <span>Acidity & Heartburn Guidance</span>
          </div>
          <p class="text-slate-200 leading-relaxed">
            Heartburn and acid indigestion typically occur when stomach acid refluxes upward into the esophagus, often following rich/spicy meals or late-night dining.
          </p>
          <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <strong class="text-white">💡 Safe Guidance:</strong>
            <ul class="list-disc list-inside text-slate-400 space-y-0.5">
              <li>Stay upright for at least 2 hours following meals.</li>
              <li>Limit fried, excessively spicy, or highly acidic foods.</li>
              <li>Eat smaller, regular portions rather than heavy meals.</li>
            </ul>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="openDoctorConsultModal('Gastroenterologist', 'Acidity and heartburn consultation')" class="py-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>👨‍⚕️ Consult Doctor</span>
          </button>
          <button onclick="sendChatMessage('Antacid Chewable 500mg')" class="py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <i data-lucide="pill" class="w-3.5 h-3.5"></i>
            <span>Antacid Chewable Info</span>
          </button>
        </div>
      </div>
    `;
  }

  // 8. MEDICINE REQUIREMENT FLOW ("I need my regular medicine", "I need medicine", etc.)
  if (q.includes('regular medicine') || q.includes('i need my regular') || q.includes('i need medicine') || q.includes('need a medicine') || q.includes('order medicine') || q.includes('refill')) {
    const reorderListHTML = AppState.reorderItems.slice(0, 3).map(item => `
      <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-white block">${item.name}</span>
          <span class="text-[10px] text-teal-400 font-medium">₹${item.price.toFixed(2)} • ${item.daysRemaining} days remaining</span>
        </div>
        <button onclick="addToCart('${item.productId || 'prod-1'}'); navigateTo('reorder');" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all flex items-center gap-1">
          <i data-lucide="repeat" class="w-3 h-3"></i>
          <span>Reorder</span>
        </button>
      </div>
    `).join('');

    return `
      <div class="space-y-3 text-xs">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div class="flex items-center gap-2 text-emerald-400 font-extrabold">
            <i data-lucide="package" class="w-4 h-4"></i>
            <span>Medicine Requirement & Refill Portal</span>
          </div>
          <p class="text-slate-200 leading-relaxed">
            What medicine do you need? If this is for your regular routine medicines, here are items ready for repeat refill:
          </p>
          <div class="space-y-1.5">
            ${reorderListHTML}
          </div>
          <p class="text-[11px] text-slate-400 pt-1">
            ⚠️ <em>Prescription medicines (Rx) require a verified doctor's prescription before dispensing.</em>
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button onclick="navigateTo('medicines')" class="py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
            <i data-lucide="search" class="w-3.5 h-3.5"></i>
            <span>Search Catalog</span>
          </button>
          <button onclick="openDoctorConsultModal('Pharmacist Consultant', 'Prescription medicine refill assistance')" class="py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5"></i>
            <span>Consult Doctor</span>
          </button>
        </div>
      </div>
    `;
  }

  // 9. PRODUCT DATABASE LOOKUP (e.g. "What is Paracetamol?", "Cetirizine 10mg", etc.)
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
      <div class="space-y-3">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 class="font-extrabold text-white text-xs sm:text-sm">${matchedProduct.name}</h4>
              <span class="text-[10px] font-semibold text-teal-400 italic">${matchedProduct.genericName}</span>
            </div>
            <div class="text-right">
              <span class="text-sm font-extrabold text-white">₹${matchedProduct.price.toFixed(2)}</span>
              <span class="text-[10px] text-emerald-400 block">In Stock (${matchedProduct.stock})</span>
            </div>
          </div>

          <div class="flex items-center gap-2">${rxBadge}</div>
          ${matchedProduct.requiresRx ? `
            <div class="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-[11px] font-bold text-rose-200 flex items-start gap-1.5">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5"></i>
              <span>Prescription required — consult a qualified healthcare professional.</span>
            </div>
          ` : ''}

          <div class="text-xs space-y-1.5 text-slate-300">
            <p><strong class="text-white">🎯 Common Uses:</strong><br/><span class="text-slate-300">${matchedProduct.purpose}</span></p>
            <p><strong class="text-white">ℹ️ Overview:</strong><br/><span class="text-slate-300">${matchedProduct.description}</span></p>
            <p><strong class="text-white">📝 Dosage Note:</strong><br/><span class="text-slate-300">${matchedProduct.dosage}</span></p>
            <p><strong class="text-white">⚠️ Precautions:</strong><br/><span class="text-slate-300">${matchedProduct.precautions}</span></p>
            <p><strong class="text-white">⚡ Side Effects:</strong><br/><span class="text-slate-300">${matchedProduct.sideEffects}</span></p>
          </div>

          <div class="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button onclick="addToCart('${matchedProduct.id}');" class="py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
              <span>Add to Cart</span>
            </button>
            <button onclick="addToCart('${matchedProduct.id}'); openCheckoutModal();" class="py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
              <span>Reorder / Buy</span>
            </button>
          </div>

          <button onclick="openDoctorConsultModal('Pharmacist Consultant', 'Question regarding ' + '${matchedProduct.name}')" class="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all">
            <i data-lucide="stethoscope" class="w-3.5 h-3.5 text-teal-400"></i>
            <span>👨‍⚕️ Consult Doctor or Pharmacist</span>
          </button>
        </div>

        <div class="text-[9px] text-slate-400 text-center font-medium">
          📋 <em>Educational Medicine Information — Consult a doctor or pharmacist for medical advice.</em>
        </div>
      </div>
    `;
  }

  // 10. HEALTHCARE GUIDANCE & DOCTOR CONSULTATION
  if (q.includes('guidance') || q.includes('doctor') || q.includes('consult') || q.includes('appointment')) {
    return `
      <div class="space-y-3 text-xs">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <h4 class="font-extrabold text-white flex items-center gap-1.5 text-xs sm:text-sm">
            <i data-lucide="stethoscope" class="w-4 h-4 text-teal-400"></i>
            <span>Finding the Right Healthcare Professional</span>
          </h4>
          <ul class="space-y-1.5 text-slate-300 list-disc list-inside text-xs">
            <li><strong>General Physician:</strong> Consult for routine illnesses, fever, persistent headaches, or health evaluations.</li>
            <li><strong>Clinical Pharmacist:</strong> Consult for medication advice, dosage schedules, precautions, and drug interactions.</li>
            <li><strong>Medical Specialist:</strong> Consult for specialized care (ENT, Cardiology, Gastroenterology, Pediatrics).</li>
          </ul>
        </div>

        <div class="flex gap-2">
          <button onclick="openDoctorConsultModal()" class="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
            <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
            <span>👨‍⚕️ Book Doctor Consultation</span>
          </button>
          <button onclick="navigateTo('contact')" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs">
            Contact Support
          </button>
        </div>
      </div>
    `;
  }

  // 11. CATALOG LISTING
  if (q.includes('find a medicine') || q.includes('available medicines') || q.includes('list medicines') || q.includes('catalog')) {
    const productListHTML = AppState.products.map(p => `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800 last:border-0">
        <div>
          <span class="font-bold text-slate-200 block">${p.name}</span>
          <span class="text-[10px] text-teal-400 font-semibold">${p.form} • ${p.category}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-white">$${p.price.toFixed(2)}</span>
          <button onclick="addToCart('${p.id}')" class="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[10px] font-bold">Add</button>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-3">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <h4 class="font-extrabold text-white text-xs flex items-center gap-1.5">
            <i data-lucide="package" class="w-4 h-4 text-sky-400"></i>
            <span>Available Medicines Catalog (${AppState.products.length}):</span>
          </h4>
          <div class="max-h-48 overflow-y-auto pr-1">
            ${productListHTML}
          </div>
        </div>
        <button onclick="navigateTo('medicines')" class="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
          <span>Open Full Medicines Shopping Catalog</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  }

  // 12. MY ORDERS INQUIRIES
  if (q.includes('my orders') || q.includes('track') || q.includes('order status') || q.includes('orders')) {
    if (AppState.orders.length === 0) {
      return `You currently have no active orders. You can explore medicines from our catalog anytime!`;
    }

    const latestOrder = AppState.orders[0];
    return `
      <div class="space-y-3 text-xs">
        <div class="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <h4 class="font-extrabold text-white text-xs flex items-center gap-1.5">
            <i data-lucide="truck" class="w-4 h-4 text-sky-400"></i>
            <span>Latest Order Tracking Update:</span>
          </h4>
          <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <div class="flex justify-between items-center">
              <span class="font-bold text-white">${latestOrder.orderId}</span>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${latestOrder.statusClass}">${latestOrder.status}</span>
            </div>
            <p class="text-slate-400 text-[11px]">Date: ${latestOrder.date} | Total: $${latestOrder.total.toFixed(2)}</p>
          </div>
        </div>
        <button onclick="navigateTo('orders')" class="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs">
          View All Orders in Dashboard
        </button>
      </div>
    `;
  }

  // DEFAULT GENERAL ASSISTANT RESPONSE
  return `
    <div class="space-y-3 text-xs text-slate-200">
      <p>I am your <strong>DAYMES Health Assistant</strong>. How can I help you today?</p>
      <div class="grid grid-cols-1 gap-1.5">
        <button onclick="sendChatMessage('I have a headache.')" class="p-2 bg-slate-800/90 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-sky-300 font-semibold flex items-center gap-2">🤕 Describe Symptoms (e.g. Headache, Cough)</button>
        <button onclick="sendChatMessage('I need my regular medicine.')" class="p-2 bg-slate-800/90 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-emerald-300 font-semibold flex items-center gap-2">💊 Medicine Requirements & Refills</button>
        <button onclick="openDoctorConsultModal()" class="p-2 bg-slate-800/90 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-teal-300 font-semibold flex items-center gap-2">👨‍⚕️ Consult a Certified Doctor</button>
        <button onclick="sendChatMessage('Find a Medicine')" class="p-2 bg-slate-800/90 hover:bg-slate-700 rounded-xl text-left border border-slate-700 text-sky-300 font-semibold flex items-center gap-2">🔎 Browse Medicine Catalog</button>
      </div>
    </div>
  `;
}

function clearChatHistory() {
  AppState.chatMessages = [
    { 
      sender: 'bot', 
      text: `
        <div class="space-y-2 text-xs">
          <p class="text-slate-200 font-semibold">Chat history has been cleared.</p>
          <p class="text-slate-400">How can I assist your health and prescription needs today?</p>
          <div class="text-[9px] text-slate-500 bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-center">
            🛡️ <em>DAYMES Health Assistant provides general health information and is not a substitute for professional medical advice.</em>
          </div>
        </div>
      `, 
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
  // --- Backend Integration: Load medicines from server ---
  (async () => {
    if (typeof DaymesAPI !== 'undefined') {
      await checkBackendHealth();
      if (backendAvailable) {
        try {
          const medicines = await DaymesAPI.getMedicines();
          if (medicines && Array.isArray(medicines) && medicines.length > 0) {
            AppState.products = medicines;
            console.log('[DAYMES] Loaded', medicines.length, 'medicines from backend');
            if (AppState.activeTab === 'medicines') renderMedicinesCatalog();
          }
        } catch (e) { console.warn('[DAYMES] Could not load medicines from backend:', e); }
      }
    }
  })();

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

  // Initialize Smooth Moving / Running Background Particles & Neural Lines
  initRunningBackgroundParticles();

  lucide.createIcons();
});

// ─────────────────────────────────────────────────────────────
// SMOOTH RUNNING BACKGROUND PARTICLE & TELEMETRY ENGINE
// ─────────────────────────────────────────────────────────────
function initRunningBackgroundParticles() {
  const canvas = document.getElementById('bg-particle-canvas');
  if (!canvas) return;

  // Check prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery && mediaQuery.matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let animationFrameId = null;
  let isRunning = true;

  // Resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    }, 150);
  });

  // Pause on hidden tab to save battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      animate();
    }
  });

  // Color Palette (Medical / Tech Glow)
  const colors = [
    { r: 6,   g: 182, b: 212 }, // Cyan #06b6d4
    { r: 56,  g: 189, b: 248 }, // Sky #38bdf8
    { r: 20,  g: 184, b: 166 }, // Teal #14b8a6
    { r: 16,  g: 185, b: 129 }  // Emerald #10b981
  ];

  let particles = [];

  function createParticles() {
    particles = [];
    const isMobile = width < 640;
    const count = isMobile ? 22 : Math.min(50, Math.floor((width * height) / 32000));

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45 - 0.15, // slight upward float
        radius: Math.random() * 1.8 + 0.8,
        color: color,
        alpha: Math.random() * 0.45 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseVal: Math.random() * Math.PI * 2
      });
    }
  }

  createParticles();

  function animate() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    const maxDist = width < 640 ? 90 : 130;
    const pCount = particles.length;

    // Draw connecting lines between close particles
    for (let i = 0; i < pCount; i++) {
      for (let j = i + 1; j < pCount; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.14;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    for (let i = 0; i < pCount; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.pulseVal += p.pulseSpeed;

      // Wrap seamlessly around screen edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.12;
      const safeAlpha = Math.max(0.05, Math.min(0.65, currentAlpha));

      // Draw particle glow halo
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
      gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${safeAlpha * 0.7})`);
      gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw particle core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${safeAlpha})`;
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}
