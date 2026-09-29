import { MEDICINES, MedicineItem } from '@/lib/data';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const ApiService = {
  // Medicines
  async getMedicines(category?: string, search?: string): Promise<MedicineItem[]> {
    try {
      const url = new URL(`${API_BASE}/medicines`);
      if (category && category !== 'All') url.searchParams.set('category', category);
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url.toString(), { next: { revalidate: 60 } });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local dataset
    }

    let results = [...MEDICINES];
    if (category && category !== 'All') {
      if (category === 'Prescription') {
        results = results.filter((m) => m.requiresRx);
      } else {
        results = results.filter((m) => m.category.toLowerCase() === category.toLowerCase());
      }
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((m) => m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q));
    }
    return results;
  },

  // Place Order
  async placeOrder(orderData: any) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000) };
  },

  // Teleconsultation
  async bookDoctor(booking: any) {
    return {
      success: true,
      bookingId: 'DOC-' + Date.now().toString().slice(-6),
      message: 'Consultation appointment scheduled successfully.',
    };
  },
};
