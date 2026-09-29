'use client';

import React from 'react';
import { MedicineItem } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { X, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

export interface CartItemEntry {
  medicine: MedicineItem;
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItemEntry[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.medicine.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 35 || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">Your Health Cart</h2>
            <p className="text-xs text-slate-400">
              {items.length} {items.length === 1 ? 'item' : 'items'} in order
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-sm font-bold text-slate-400">Your cart is empty.</p>
              <p className="text-xs text-slate-500">Explore our catalog to add your essentials.</p>
            </div>
          ) : (
            items.map(({ medicine, qty }) => (
              <div
                key={medicine.id}
                className="p-3.5 bg-slate-800/80 border border-slate-750 rounded-2xl flex items-center gap-3.5"
              >
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-950 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{medicine.name}</h4>
                  <p className="text-[11px] text-slate-400">{formatPrice(medicine.price)} each</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQty(medicine.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 flex items-center justify-center text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white px-1.5">{qty}</span>
                    <button
                      onClick={() => onUpdateQty(medicine.id, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 flex items-center justify-center text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white">{formatPrice(medicine.price * qty)}</p>
                  <button
                    onClick={() => onRemoveItem(medicine.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-slate-950/60 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={shipping === 0 ? 'text-emerald-400 font-bold' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="text-sky-400">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Certified pharmacy packaging & temperature safety.</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-extrabold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
