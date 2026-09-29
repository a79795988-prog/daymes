'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Check } from 'lucide-react';
import { MedicineItem, MEDICINES } from '@/lib/data';

interface ReorderCardItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  lastOrderDate: string;
  daysRemaining: number;
  status: string;
  statusType: 'due' | 'available' | 'recent';
  requiresRx?: boolean;
  unitPrice: number;
  quantity: number;
  selected: boolean;
}

const INITIAL_REORDER_ITEMS: ReorderCardItem[] = [
  {
    id: 'reorder-101',
    productId: 'med-000',
    name: 'Paracetamol 500mg Extra Strength',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    lastOrderDate: '2026-07-28',
    daysRemaining: 4,
    status: 'Refill Due Soon',
    statusType: 'due',
    requiresRx: false,
    unitPrice: 4.99,
    quantity: 2,
    selected: true,
  },
  {
    id: 'reorder-102',
    productId: 'med-003',
    name: 'Omeprazole 20mg Heartburn Relief',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80',
    lastOrderDate: '2026-07-15',
    daysRemaining: 12,
    status: 'Refill Available',
    statusType: 'available',
    requiresRx: true,
    unitPrice: 15.40,
    quantity: 1,
    selected: false,
  },
  {
    id: 'reorder-103',
    productId: 'med-005',
    name: 'Vitamin C 1000mg + Zinc Effervescent',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    lastOrderDate: '2026-08-10',
    daysRemaining: 22,
    status: 'Recently Ordered',
    statusType: 'recent',
    requiresRx: false,
    unitPrice: 12.50,
    quantity: 1,
    selected: false,
  },
];

interface ReorderPortalProps {
  onAddToCart: (medicine: MedicineItem, quantity?: number) => void;
  onOpenCart: () => void;
}

export const ReorderPortal: React.FC<ReorderPortalProps> = ({ onAddToCart, onOpenCart }) => {
  const [items, setItems] = useState<ReorderCardItem[]>(INITIAL_REORDER_ITEMS);
  const [reorderedSuccess, setReorderedSuccess] = useState(false);

  const allSelected = items.length > 0 && items.every((item) => item.selected);

  const toggleSelectAll = (checked: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const toggleSelectItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const selectedItems = items.filter((item) => item.selected);
  const selectedCount = selectedItems.length;
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleExecuteReorder = () => {
    if (selectedItems.length === 0) return;

    selectedItems.forEach((item) => {
      const match =
        MEDICINES.find((m) => m.id === item.productId) ||
        MEDICINES.find((m) => m.name.toLowerCase().includes('paracetamol')) ||
        MEDICINES[0];

      onAddToCart(match, item.quantity);
    });

    setReorderedSuccess(true);
    setTimeout(() => {
      setReorderedSuccess(false);
      onOpenCart();
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Hero Banner Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold border border-white/20">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automated Refill System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Smart Reorder Portal</h1>
          <p className="text-xs text-teal-200/90 max-w-xl leading-relaxed">
            View past routine medications, monitor refill schedules, select items, and place
            single-click repeat orders with automatic stock allocation.
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur border border-slate-700/80 p-5 rounded-2xl text-center min-w-[200px] flex-shrink-0 shadow-lg relative z-10">
          <span className="text-xs text-teal-300 font-semibold block mb-1">Active Refills Due</span>
          <span className="text-2xl sm:text-3xl font-black text-white">2 Medicines</span>
        </div>
      </div>

      {/* Reorder Table Controls Bar */}
      <div className="flex items-center justify-between px-2">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200 hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => toggleSelectAll(e.target.checked)}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-700 bg-slate-800 cursor-pointer"
          />
          <span>Select All Medicines</span>
        </label>
        <span className="text-xs font-medium text-slate-400">
          Refill recommendations based on your usage timeline
        </span>
      </div>

      {/* Success Notification */}
      {reorderedSuccess && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700 text-emerald-200 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              Successfully added {selectedCount} refill items to cart! Opening checkout…
            </span>
          </div>
        </div>
      )}

      {/* Reorder Cards List */}
      <div className="space-y-4">
        {items.map((item) => {
          const itemTotal = item.unitPrice * item.quantity;
          const isSelected = item.selected;

          return (
            <div
              key={item.id}
              className={`bg-slate-900/90 rounded-2xl border p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isSelected
                  ? 'border-sky-500 shadow-sky-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Left Info Column */}
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectItem(item.id)}
                  className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 border-slate-700 bg-slate-800 cursor-pointer flex-shrink-0"
                />

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>

                    {/* Status Badges */}
                    {item.statusType === 'due' && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                        {item.status}
                      </span>
                    )}
                    {item.statusType === 'available' && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {item.status}
                      </span>
                    )}
                    {item.statusType === 'recent' && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.status}
                      </span>
                    )}

                    {item.requiresRx && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-950 text-rose-300 border border-rose-800">
                        Rx Valid
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    Last ordered: <span className="font-medium text-slate-200">{item.lastOrderDate}</span>
                    <span className="mx-1.5">|</span>
                    Refill window:{' '}
                    <span className="font-semibold text-sky-400">
                      {item.daysRemaining} days remaining
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Controls Column */}
              <div className="flex items-center justify-between md:justify-end gap-8 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">Quantity:</span>
                  <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 rounded-l-xl font-bold text-xs transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-white min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 rounded-r-xl font-bold text-xs transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-right min-w-[80px]">
                  <span className="text-base font-extrabold text-white block">
                    ${itemTotal.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ${item.unitPrice.toFixed(2)} each
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Reorder Summary Bar */}
      <div className="sticky bottom-6 z-30 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-medium block">
            {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleExecuteReorder}
          disabled={selectedCount === 0}
          className={`px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-lg transition-all flex items-center gap-2 ${
            selectedCount > 0
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 cursor-pointer active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>Reorder Selected</span>
        </button>
      </div>
    </div>
  );
};
