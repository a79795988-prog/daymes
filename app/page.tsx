'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { MedicineCatalog } from '@/components/MedicineCatalog';
import { CartDrawer, CartItemEntry } from '@/components/CartDrawer';
import { AuthModals } from '@/components/AuthModals';
import { EmergencyModal } from '@/components/EmergencyModal';
import { DoctorConsultModal } from '@/components/DoctorConsultModal';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { Footer } from '@/components/Footer';
import { AuthService, UserSession } from '@/services/authService';
import { ApiService } from '@/services/api';
import { MedicineItem, MEDICINES } from '@/lib/data';
import { RefreshCw, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
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
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

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
    alert(`Thank you for your order, ${user.fullName}! Pharmacist verification in progress.`);
    setCart([]);
    setIsCartOpen(false);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#050b14] text-slate-100 selection:bg-teal-400 selection:text-slate-950 font-sans">
      {/* Navigation */}
      <Navbar
        user={user}
        cartCount={totalCartCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => AuthService.logout()}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onOrderMedicines={() => setActiveTab('medicines')}
              onReorder={() => setActiveTab('reorder')}
            />

            {/* Designed for Effortless Healthcare & Category Shortcuts */}
            <Features
              onNavigate={setActiveTab}
              onOpenAssistant={() => setIsAssistantOpen(true)}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveTab('medicines');
              }}
            />

            {/* Featured Medicines Preview */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white">Popular Health Essentials</h3>
                  <p className="text-xs text-slate-400">Authentic medicines with fast prescription delivery</p>
                </div>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  View full catalog →
                </button>
              </div>

              <MedicineCatalog
                medicines={medicines.slice(0, 4)}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onAddToCart={handleAddToCart}
              />
            </div>
          </>
        )}

        {activeTab === 'medicines' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-black text-white">Medicines & Healthcare Catalog</h2>
              <p className="text-xs text-slate-400 mt-1">
                Browse verified pharmaceutical medicines, vitamins, and healthcare supplies.
              </p>
            </div>

            <MedicineCatalog
              medicines={medicines}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {activeTab === 'reorder' && (
          <div className="space-y-6 max-w-3xl mx-auto py-8">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Smart 1-Click Reorder Cabinet</h2>
                <p className="text-xs text-slate-400">Routine medications scheduled for automated refill</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Amoxicillin 500mg', lastOrder: '18 days ago', status: 'Refill Recommended', rx: true },
                { name: 'Atorvastatin 20mg', lastOrder: '25 days ago', status: 'Refill Due Soon', rx: true },
                { name: 'Vitamin D3 5000 IU', lastOrder: '1 month ago', status: 'Refill Ready', rx: false },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Last ordered: {item.lastOrder}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 rounded-md">
                      {item.status}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const found = MEDICINES.find((m) => m.name.includes(item.name.split(' ')[0]));
                      if (found) handleAddToCart(found);
                    }}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all active:scale-95"
                  >
                    1-Click Refill
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'healthcare' && (
          <div className="space-y-6 max-w-3xl mx-auto py-8">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Daily Medication Schedule & Reminders</h2>
                <p className="text-xs text-slate-400">Track your doses, timings, and intake compliance</p>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { time: '08:00 AM', med: 'Atorvastatin 20mg', instruction: 'Take 1 tablet after breakfast', taken: true },
                { time: '01:00 PM', med: 'Vitamin D3 + K2', instruction: 'Take with lunch', taken: true },
                { time: '08:30 PM', med: 'Metformin HCl 500mg', instruction: 'Take with dinner and water', taken: false },
              ].map((dose, idx) => (
                <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-sky-400 bg-sky-950 px-2.5 py-1 rounded-xl">
                      {dose.time}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{dose.med}</h4>
                      <p className="text-[11px] text-slate-400">{dose.instruction}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-xl flex items-center gap-1 ${
                    dose.taken ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {dose.taken ? 'Taken' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 max-w-3xl mx-auto py-8">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white">My Order History</h2>
              <p className="text-xs text-slate-400">Track verified shipments and prescription verifications</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="font-bold text-white">Order #ORD-781923</span>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full font-bold text-[10px]">
                  Pharmacist Verified • Out for Delivery
                </span>
              </div>
              <p className="text-xs text-slate-300">Amoxicillin 500mg (x1), Vitamin D3 (x1)</p>
              <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                <span>Estimated Arrival: Today, by 6:00 PM</span>
                <span className="text-white font-bold">$40.94</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6 max-w-2xl mx-auto py-8 text-xs">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white">Contact & Pharmacy Support</h2>
              <p className="text-xs text-slate-400">Reach certified pharmacists and customer care 24/7</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Pharmacy Helpline (Toll-Free)</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Available 24 hours a day, 7 days a week</p>
                </div>
                <a href="tel:18005550199" className="px-3 py-1.5 bg-sky-500 text-slate-950 font-bold rounded-xl">
                  Call Now
                </a>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">AI Health Care Chatbot</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Get instant answers to medication questions</p>
                </div>
                <button
                  onClick={() => setIsAssistantOpen(true)}
                  className="px-3 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-xl"
                >
                  Open Assistant
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setActiveTab}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Floating AI DAYMES Assistant */}
      <ChatbotWidget
        isOpen={isAssistantOpen}
        onToggle={() => setIsAssistantOpen(!isAssistantOpen)}
        onNavigateMedicines={() => setActiveTab('medicines')}
        onNavigateReorder={() => setActiveTab('reorder')}
      />

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
