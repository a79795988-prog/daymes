'use client';

import React from 'react';
import { RefreshCw, Bell, ShieldCheck, Bot } from 'lucide-react';

interface FeaturesProps {
  onNavigate: (tab: string) => void;
  onOpenAssistant: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({
  onNavigate,
  onOpenAssistant,
  onSelectCategory,
}) => {
  return (
    <section className="space-y-12 py-10">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Designed for Effortless Healthcare
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Smart tools to manage your family's prescriptions and daily wellness needs with complete peace of mind.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Easy Reordering */}
        <div
          onClick={() => onNavigate('reorder')}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 p-6 rounded-3xl cursor-pointer group transition-all hover:shadow-xl hover:shadow-sky-500/5"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-950/80 text-sky-400 border border-sky-800/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <RefreshCw className="w-5 h-5 text-sky-400" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
            Easy Reordering
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            1-click refill workflow for routine prescription and OTC medications with status reminders.
          </p>
        </div>

        {/* Card 2: Medicine Reminders */}
        <div
          onClick={() => onNavigate('healthcare')}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl cursor-pointer group transition-all hover:shadow-xl hover:shadow-emerald-500/5"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            Medicine Reminders
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Set dosage schedules, log daily intakes, and keep track of morning, afternoon, and evening pills.
          </p>
        </div>

        {/* Card 3: Secure Orders */}
        <div
          onClick={() => onNavigate('medicines')}
          className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl cursor-pointer group transition-all hover:shadow-xl hover:shadow-indigo-500/5"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
            Secure Orders
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Pharmacist-verified products, temperature-controlled packaging, and safe checkout protocols.
          </p>
        </div>

        {/* Card 4: Healthcare Support */}
        <div
          onClick={onOpenAssistant}
          className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 p-6 rounded-3xl cursor-pointer group transition-all hover:shadow-xl hover:shadow-teal-500/5"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-950/80 text-teal-400 border border-teal-800/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5 text-teal-400" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
            Healthcare Support
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Instant answers from DAYMES Assistant for medication questions, store policies, and refill help.
          </p>
        </div>
      </div>

      {/* Quick Category Shortcuts Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base sm:text-lg font-black text-white">
            Looking for specific health essential products?
          </h3>
          <p className="text-xs text-slate-400">
            Explore pain relievers, daily multivitamin supplements, or emergency first aid supplies.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => onSelectCategory('Pain Relief')}
            className="px-4 py-2 bg-slate-800/90 hover:bg-sky-500 hover:text-slate-950 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all shadow-sm"
          >
            Pain Relief
          </button>
          <button
            onClick={() => onSelectCategory('Vitamins & Supplements')}
            className="px-4 py-2 bg-slate-800/90 hover:bg-sky-500 hover:text-slate-950 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all shadow-sm"
          >
            Vitamins & Supplements
          </button>
          <button
            onClick={() => onSelectCategory('First Aid')}
            className="px-4 py-2 bg-slate-800/90 hover:bg-sky-500 hover:text-slate-950 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all shadow-sm"
          >
            First Aid & Care
          </button>
          <button
            onClick={() => onSelectCategory('Cardiovascular')}
            className="px-4 py-2 bg-slate-800/90 hover:bg-sky-500 hover:text-slate-950 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all shadow-sm"
          >
            Medical Devices
          </button>
        </div>
      </div>
    </section>
  );
};
