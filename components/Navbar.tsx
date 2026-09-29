'use client';

import React, { useState } from 'react';
import { Plus, Search, ShoppingBag, LogIn, ChevronDown, Flame, LogOut, ShieldAlert } from 'lucide-react';
import { UserSession } from '@/services/authService';

interface NavbarProps {
  user: UserSession | null;
  cartCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cartCount,
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenAuth,
  onLogout,
  onSearchChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'medicines', label: 'Medicines' },
    { id: 'reorder', label: 'Reorder', badge: 'Smart' },
    { id: 'orders', label: 'My Orders' },
    { id: 'healthcare', label: 'Health Care' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#060d17]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-500/20">
            <Plus className="w-6 h-6 stroke-[3.5]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white block leading-none">DAYMES</span>
            <span className="text-[9px] font-extrabold tracking-widest text-teal-400 block mt-1 uppercase">
              Verified Healthcare
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative py-2 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-teal-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Search, Auth & Cart */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden md:block w-48 lg:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search medicines..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          {/* User / Sign In Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-white transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 text-slate-950 font-black text-[11px] flex items-center justify-center overflow-hidden">
                  {user.picture ? (
                    <img src={user.picture} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.fullName.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-black text-white truncate">{user.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        Firebase Auth
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full mt-1 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            className="p-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition-all relative"
            title="Open cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-400 text-slate-950 text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
