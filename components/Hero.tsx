'use client';

import React from 'react';
import { ShieldCheck, ArrowRight, RefreshCw, Activity } from 'lucide-react';

interface HeroProps {
  onOrderMedicines: () => void;
  onReorder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderMedicines, onReorder }) => {
  return (
    <div className="relative bg-gradient-to-br from-[#0c2336] via-[#091522] to-[#0a273b] rounded-3xl p-8 sm:p-12 lg:p-14 text-white overflow-hidden shadow-2xl border border-sky-900/30">
      {/* Background medical glow */}
      <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-40 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-sky-200">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Licensed Online Pharmacy & Smart Healthcare Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Your Medicines, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
            Order medicines, manage refills, track daily medication schedules, and get instant healthcare guidance from our DAYMES Assistant in one trusted place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOrderMedicines}
              className="px-7 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Order Medicines</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onReorder}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl text-xs sm:text-sm border border-white/20 backdrop-blur transition-all flex items-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Reorder Now</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
            <div>
              <span className="text-xl sm:text-2xl font-black text-white">100%</span>
              <p className="text-[11px] text-slate-400">Verified Products</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">24/7</span>
              <p className="text-[11px] text-slate-400">Care Assistant Support</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-sky-400">Express</span>
              <p className="text-[11px] text-slate-400">Prescription Delivery</p>
            </div>
          </div>
        </div>

        {/* Right Graphic Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-6 rounded-3xl shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">DAYMES Care Portal</h4>
                <p className="text-[10px] text-slate-400">Live Refill & Order Health Status</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="bg-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs border border-slate-700/60">
                <span className="font-semibold text-slate-200">Paracetamol 500mg</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  Refill Ready
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs border border-slate-700/60">
                <span className="font-semibold text-slate-200">Vitamin C Daily</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-md">
                  On Schedule
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400 font-medium">Over 25,000+ satisfied healthcare orders delivered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
