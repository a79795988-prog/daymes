'use client';

import React from 'react';
import { Pill, ShieldCheck, Stethoscope, Clock, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenDoctor: () => void;
  onOpenEmergency: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDoctor, onOpenEmergency }) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-12 sm:py-16 border-b border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-950/70 border border-sky-800/60 rounded-full text-xs font-bold text-sky-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Smart Pharmacy • Verified Prescriptions • 24/7 Care</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your Health, Prescriptions & Doctors — <span className="bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">In One Trusted Place</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Order authentic medicines, schedule teleconsultations with licensed physicians, and track daily medications with intelligent reminders.
          </p>

          {/* Quick Action Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:border-sky-500/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2.5">
                <Pill className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Genuine Medicine</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">100% verified pharmacy</p>
            </div>

            <button
              onClick={onOpenDoctor}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:border-teal-500/50 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Doctor Consult</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Book teleconsultation</p>
            </button>

            <button
              onClick={onOpenEmergency}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:border-rose-500/50 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Emergency ER</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">24/7 Trauma response</p>
            </button>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:border-emerald-500/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Rx Verification</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Pharmacist reviewed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
