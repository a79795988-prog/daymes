'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAssistant }) => {
  return (
    <footer className="mt-20 bg-[#040810] text-slate-400 text-xs border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2.5 text-white font-black text-lg">
            <div className="w-7 h-7 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black">
              <Plus className="w-4 h-4 stroke-[3.5]" />
            </div>
            <span>DAYMES</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
            Modern pharmacy and healthcare support platform streamlining prescriptions, refills, and medication reminders.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Quick Navigation</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                Home Portal
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('medicines')} className="hover:text-white transition-colors">
                Medicines Catalog
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('reorder')} className="hover:text-white transition-colors">
                Smart Refill System
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
                Order History
              </button>
            </li>
          </ul>
        </div>

        {/* Healthcare Services */}
        <div className="space-y-3">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Healthcare Services</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => onNavigate('healthcare')} className="hover:text-white transition-colors">
                Medication Schedule
              </button>
            </li>
            <li>
              <button onClick={onOpenAssistant} className="hover:text-white transition-colors text-teal-400 font-semibold">
                DAYMES Assistant
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                Pharmacist Consultation
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('medicines')} className="hover:text-white transition-colors">
                Prescription Upload
              </button>
            </li>
          </ul>
        </div>

        {/* Project Notice */}
        <div className="space-y-3">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Project Notice</h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            This project is a demonstration website prototype. No actual prescription dispenses, payment transactions, or medical advice are executed.
          </p>
          <p className="text-slate-500 text-[10px] pt-1">© 2026 DAYMES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
