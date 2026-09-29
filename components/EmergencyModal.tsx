'use client';

import React from 'react';
import { X, Siren, PhoneCall, ShieldAlert, Building2, Phone } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border-2 border-rose-600/80 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-7 space-y-5 text-left my-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-950 text-rose-400 border border-rose-700 flex items-center justify-center font-bold flex-shrink-0 animate-pulse">
              <Siren className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-rose-300">🚨 Emergency Medical Assistance</h3>
              <p className="text-xs text-rose-200/80">Immediate emergency contacts & nearby 24/7 trauma centers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hotlines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:911"
            className="p-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs flex items-center justify-between shadow-lg shadow-rose-950 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-sm font-black">Call 911 / 112</span>
                <span className="text-[10px] text-rose-100 font-normal">National Emergency</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-extrabold">Instant</span>
          </a>

          <a
            href="tel:18002221222"
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-2xl font-bold text-xs flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-xs font-bold text-white">Poison Control</span>
                <span className="text-[10px] text-slate-400 font-normal">1-800-222-1222</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-slate-700 rounded-md text-[10px] font-bold text-amber-300">24/7</span>
          </a>
        </div>

        {/* Hospitals */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Nearest 24/7 Emergency Trauma Centers:</span>
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <h5 className="font-bold text-white">Springfield Memorial Hospital & ER</h5>
                <p className="text-[11px] text-slate-400">1200 Healthcare Blvd • 1.2 miles away</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Open 24/7 • Trauma Level 1
                </span>
              </div>
              <a
                href="tel:5550199"
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" /> Call ER
              </a>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <h5 className="font-bold text-white">City Central Urgent Care & Trauma</h5>
                <p className="text-[11px] text-slate-400">450 North Medical Center Ave • 2.8 miles away</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Open 24/7 • Avg wait: 8 mins
                </span>
              </div>
              <a
                href="tel:5550244"
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" /> Call ER
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-xl text-xs transition-all"
        >
          Close Emergency Window
        </button>
      </div>
    </div>
  );
};
