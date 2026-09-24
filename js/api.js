const API_BASE_URL = 'http://localhost:8080/api';
let backendAvailable = null;

async function checkBackendHealth() {
  try {
    const res = await fetch(API_BASE_URL + '/medicines', { method: 'HEAD', signal: AbortSignal.timeout(2000) });
    backendAvailable = res.ok;
  } catch (e) {
    backendAvailable = false;
  }
}

async function apiRequest(endpoint, options = {}) {
  if (backendAvailable === false) return null;
  const token = localStorage.getItem('daymes_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const fetchOptions = { ...options, headers: { ...headers, ...options.headers } };
  
  try {
    const res = await fetch(API_BASE_URL + endpoint, fetchOptions);
    if (!res.ok) {
      let errorBody = 'Error ' + res.status;
      try {
        const errJson = await res.json();
        errorBody = errJson.message || errJson.error || errorBody;
      } catch (e) {}
      return { error: true, status: res.status, message: errorBody };
    }
    // Return empty object for 204 No Content
    if (res.status === 204) return {};
    return await res.json();
  } catch (e) {
    backendAvailable = false;
    console.warn(`[DAYMES API] Network error on ${endpoint}:`, e);
    return null;
  }
}

const DaymesAPI = {
  // Auth
  async register({ fullName, email, mobile, password }) {
    const res = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ fullName, email, mobile, password }) });
    if (res && res.success && res.token) { localStorage.setItem('daymes_auth_token', res.token); }
    return res;
  },
  async login({ email, password }) {
    const res = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (res && res.success && res.token) { localStorage.setItem('daymes_auth_token', res.token); }
    return res;
  },
  async logout() {
    await apiRequest('/auth/logout', { method: 'POST' });
    localStorage.removeItem('daymes_auth_token');
  },
  async getMe() {
    return await apiRequest('/auth/me');
  },

  // Medicines
  async getMedicines({ search, category, sort } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    return await apiRequest('/medicines' + (qs ? '?' + qs : ''));
  },
  async getMedicineById(id) {
    return await apiRequest('/medicines/' + id);
  },

  // Cart
  async getCart() { return await apiRequest('/cart'); },
  async addToCart(productId, qty) { return await apiRequest('/cart', { method: 'POST', body: JSON.stringify({ productId, qty }) }); },
  async updateCartItem(productId, qty) { return await apiRequest('/cart/' + productId, { method: 'PUT', body: JSON.stringify({ qty }) }); },
  async removeCartItem(productId) { return await apiRequest('/cart/' + productId, { method: 'DELETE' }); },

  // Orders
  async getOrders() { return await apiRequest('/orders'); },
  async placeOrder({ name, phone, address, paymentMethod }) { return await apiRequest('/orders', { method: 'POST', body: JSON.stringify({ name, phone, address, paymentMethod }) }); },
  async reorder(orderId) { return await apiRequest('/orders/' + orderId + '/reorder', { method: 'POST' }); },

  // Cabinet (Smart Reorder)
  async getCabinet() { return await apiRequest('/cabinet'); },
  async cabinetReorder(itemIds) { return await apiRequest('/cabinet', { method: 'POST', body: JSON.stringify({ itemIds }) }); },

  // Reminders (Medication Schedule)
  async getReminders() { return await apiRequest('/reminders'); },
  async addReminder({ medicine, time, instruction }) { return await apiRequest('/reminders', { method: 'POST', body: JSON.stringify({ medicine, time, instruction }) }); },
  async toggleReminder(id) { return await apiRequest('/reminders/' + id, { method: 'PATCH' }); },

  // Chatbot
  async chat(message, history) { return await apiRequest('/chatbot', { method: 'POST', body: JSON.stringify({ message, history }) }); }
};

console.log('[DAYMES API] API service layer loaded. Backend URL:', API_BASE_URL);
checkBackendHealth().then(() => {
  console.log('[DAYMES API] Backend status:', backendAvailable ? '✅ Connected' : '⚠️ Offline (using local data)');
});
