'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, Send, Sparkles, CheckCircle2, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TableOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: any[];
  tableNumber: string | null;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
}

export default function TableOrderDrawer({
  isOpen,
  onClose,
  orderItems,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder
}: TableOrderDrawerProps) {
  const [orderSent, setOrderSent] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const serviceCharge = subtotal * 0.12; // 12% discretion service charge
  const total = subtotal + serviceCharge;

  const handleSendOrder = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setOrderSent(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 right-0 max-w-md w-full bg-[#12100d] border-l border-[#c5a059]/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-semibold block">
                  Table Session
                </span>
                <h3 className="font-serif text-xl font-bold text-[#f8f5ee] flex items-center gap-2">
                  <span>Table Order Wishlist</span>
                  {tableNumber && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c5a059] text-[#0c0b09] font-sans font-bold">
                      Table {tableNumber}
                    </span>
                  )}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#181510] border border-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Items List or Success State */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {orderSent ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#f8f5ee]">
                    Order Dispatched to Kitchen!
                  </h4>
                  <p className="text-xs text-[#a39783] max-w-xs mx-auto">
                    Our sommelier and kitchen team have received your table order. Your server will confirm in person shortly.
                  </p>
                  <button
                    onClick={() => {
                      setOrderSent(false);
                      onClearOrder();
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#1c1813] border border-[#c5a059]/40 text-xs font-semibold text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0b09] transition-all mt-4"
                  >
                    Close Session
                  </button>
                </div>
              ) : orderItems.length === 0 ? (
                <div className="text-center py-16 text-[#8c8273] space-y-3">
                  <Utensils className="w-10 h-10 mx-auto text-[#c5a059]/40" />
                  <p className="text-sm">Your table order wishlist is empty.</p>
                  <p className="text-xs text-[#a39783]">Browse the QR menu to add dishes and drinks.</p>
                </div>
              ) : (
                orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#181510] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80"}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover border border-[#c5a059]/20 shrink-0"
                    />

                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-[#f8f5ee] line-clamp-1">
                        {item.name}
                      </h4>
                      <span className="text-xs text-gold-gradient font-serif font-bold">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#0c0b09] border border-white/10 rounded-full px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-0.5 text-[#c5a059] hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center font-mono">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-0.5 text-[#c5a059] hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {!orderSent && orderItems.length > 0 && (
              <div className="p-6 bg-[#0c0b09] border-t border-white/10 space-y-4">
                <div className="space-y-1.5 text-xs text-[#a39783]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discretionary Service (12%)</span>
                    <span className="font-mono text-white">${serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-[#f8f5ee]">
                    <span>Total Amount</span>
                    <span className="font-serif text-lg text-gold-gradient">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSendOrder}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7b32] text-[#0c0b09] font-bold text-xs tracking-wider uppercase hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Order To Kitchen</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
