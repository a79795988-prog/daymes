'use client';

import React from 'react';
import { MedicineItem, CATEGORIES } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { Plus, Star, ShieldAlert } from 'lucide-react';

interface MedicineCatalogProps {
  medicines: MedicineItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (medicine: MedicineItem) => void;
}

export const MedicineCatalog: React.FC<MedicineCatalogProps> = ({
  medicines,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {medicines.map((med) => (
          <div
            key={med.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-sky-500/5 transition-all flex flex-col group"
          >
            {/* Image & Rx Tag */}
            <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
              <img
                src={med.image}
                alt={med.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {med.requiresRx ? (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black rounded-lg flex items-center gap-1 shadow-md">
                  <ShieldAlert className="w-3 h-3" />
                  Rx Required
                </span>
              ) : (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-lg shadow-md">
                  OTC Available
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                  {med.category}
                </span>
                <h3 className="text-sm font-extrabold text-white group-hover:text-sky-300 transition-colors">
                  {med.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">{med.dosage}</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold pt-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{med.rating}</span>
                  <span className="text-slate-500 font-normal">({med.reviewsCount})</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div>
                  <span className="text-base font-black text-white">{formatPrice(med.price)}</span>
                  {med.originalPrice && (
                    <span className="text-xs text-slate-500 line-through ml-2">
                      {formatPrice(med.originalPrice)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onAddToCart(med)}
                  className="p-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl flex items-center justify-center transition-all shadow-md shadow-sky-500/20 active:scale-95"
                  title="Add to cart"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
