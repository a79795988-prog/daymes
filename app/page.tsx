'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { MedicineCatalog } from '@/components/MedicineCatalog';
import { CartDrawer, CartItemEntry } from '@/components/CartDrawer';
import { AuthModals } from '@/components/AuthModals';
import { EmergencyModal } from '@/components/EmergencyModal';
import { DoctorConsultModal } from '@/components/DoctorConsultModal';
import { AuthService, UserSession } from '@/services/authService';
import { ApiService } from '@/services/api';
import { MedicineItem, MEDICINES } from '@/lib/data';

export default function HomePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [medicines, setMedicines] = useState<MedicineItem[]>(MEDICINES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItemEntry[]>([]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);

  // Sync auth state
  useEffect(() => {
    const unsub = AuthService.onAuthState((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Filter medicines
  useEffect(() => {
    ApiService.getMedicines(selectedCategory, searchQuery).then((data) => {
      setMedicines(data);
    });
  }, [selectedCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (medicine: MedicineItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { medicine, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.medicine.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItemEntry[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== id));
  };

  const handleCheckout = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    alert(`Thank you for your order, ${user.fullName}! Pharmacist dispatch in progress.`);
    setCart([]);
    setIsCartOpen(false);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        user={user}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onLogout={() => AuthService.logout()}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        <Hero
          onOpenDoctor={() => setIsDoctorOpen(true)}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />

        <MedicineCatalog
          medicines={medicines}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-16 text-center text-xs text-slate-500">
        <p>© 2026 DAYMES Healthcare Inc. All rights reserved.</p>
        <p className="mt-1">Licensed pharmacy prototype with integrated Firebase Authentication.</p>
      </footer>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      <AuthModals
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <DoctorConsultModal
        isOpen={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
      />
    </div>
  );
}
