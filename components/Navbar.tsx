'use client';

import React, { useState } from 'react';
import { Pill, Search, ShoppingBag, ShieldAlert, User, LogOut, Flame, ChevronDown } from 'lucide-react';
import { UserSession } from '@/services/authService';

interface NavbarProps {
  user: UserSession | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenEmergency: () => void;
  onLogout: () => void;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenEmergency,
  onLogout,
  onSearchChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Pill className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">DAYMES</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-md">
                HEALTHCARE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Verified Pharmacy & Care</p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicines, vitamins, generics..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Emergency 24/7 Hotline */}
          <button
            onClick={onOpenEmergency}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold transition-all shadow-sm group"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Emergency 24/7</span>
          </button>

          {/* Cart Pill */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-white transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center overflow-hidden">
                  {user.picture ? (
                    <img src={user.picture} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.fullName.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-black text-white truncate">{user.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
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
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-sky-500/20 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
