'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, Send, CheckCircle2, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from '@/lib/LanguageContext';

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
  const { t, locale } = useTranslation();
  const [orderSent, setOrderSent] = useState(false);
  const [customTableNum, setCustomTableNum] = useState(tableNumber || '');
  const [prevTableNum, setPrevTableNum] = useState(tableNumber);
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (tableNumber !== prevTableNum) {
    setPrevTableNum(tableNumber);
    if (tableNumber) {
      setCustomTableNum(tableNumber);
    }
  }

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const serviceCharge = subtotal * 0.10; // 10% service charge & tax
  const total = subtotal + serviceCharge;

  const handleSendOrder = async () => {
    setError(null);
    if (!customTableNum.trim()) {
      setError('Please specify your table number.');
      return;
    }
    if (!customerName.trim()) {
      setError('Please specify your name or guest ID.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: customTableNum.trim(),
          customer_name: customerName.trim(),
          items: orderItems,
          total_amount: total
        })
      });
      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setOrderSent(true);
      } else {
        setError(data.error || 'Failed to dispatch table order.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to kitchen order system.');
    } finally {
      setSubmitting(false);
    }
  };

  const getItemName = (item: any) => {
    if (locale === 'my' && item.name_my) return item.name_my;
    if (locale === 'th' && item.name_th) return item.name_th;
    return item.name;
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
            className="absolute inset-y-0 right-0 max-w-md w-full bg-[var(--background-color)] border-l border-[var(--border-glow-color)] shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary-color)] font-semibold block">
                  {t('orderDrawer.tableLabel', 'Table Session')}
                </span>
                <h3 className="font-serif text-xl font-bold text-[var(--text-color)] flex items-center gap-2">
                  <span>{t('orderDrawer.title', 'Table Order / Wishlist')}</span>
                  {tableNumber && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--primary-color)] text-[var(--background-color)] font-sans font-bold">
                      {tableNumber}
                    </span>
                  )}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--muted-text-color)] hover:text-white"
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
                  <h4 className="font-serif text-2xl font-bold text-[var(--text-color)]">
                    {t('orderDrawer.orderSentSuccess', 'Order Dispatched to Kitchen!')}
                  </h4>
                  <p className="text-xs text-[var(--muted-text-color)] max-w-xs mx-auto">
                    Our kitchen team has received your table order. Your server will confirm in person shortly.
                  </p>
                  <button
                    onClick={() => {
                      setOrderSent(false);
                      onClearOrder();
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[var(--surface-color)] border border-[var(--border-glow-color)] text-xs font-semibold text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-[var(--background-color)] transition-all mt-4"
                  >
                    Close Session
                  </button>
                </div>
              ) : orderItems.length === 0 ? (
                <div className="text-center py-16 text-[var(--muted-text-color)] space-y-3">
                  <Utensils className="w-10 h-10 mx-auto text-[var(--primary-color)]/40" />
                  <p className="text-sm">{t('orderDrawer.emptyMessage', 'Your table order is empty.')}</p>
                </div>
              ) : (
                orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80"}
                      alt={getItemName(item)}
                      className="w-14 h-14 rounded-lg object-cover border border-[var(--border-glow-color)] shrink-0"
                    />

                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-[var(--text-color)] line-clamp-1">
                        {getItemName(item)}
                      </h4>
                      <span className="text-xs text-gold-gradient font-serif font-bold">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-[var(--background-color)] border border-[var(--border-color)] rounded-full px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-0.5 text-[var(--primary-color)] hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center font-mono">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-0.5 text-[var(--primary-color)] hover:text-white"
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
              <div className="p-6 bg-[var(--background-color)] border-t border-[var(--border-color)] space-y-4">
                {/* Identification & Table Inputs */}
                <div className="p-3.5 rounded-xl bg-[var(--surface-color)] border border-[var(--border-glow-color)] space-y-2">
                  <span className="text-[10px] text-[var(--primary-color)] font-bold uppercase tracking-wider block">
                    Diner & Table Identification
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[var(--muted-text-color)] block mb-1">
                        Table Number <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={customTableNum}
                        onChange={(e) => setCustomTableNum(e.target.value)}
                        placeholder="e.g. Table 08"
                        className="w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[var(--primary-color)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[var(--muted-text-color)] block mb-1">
                        Diner Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Guest Alexander"
                        className="w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[var(--primary-color)] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-[11px] text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-[var(--muted-text-color)]">
                  <div className="flex justify-between">
                    <span>{t('orderDrawer.subtotal', 'Subtotal')}</span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('orderDrawer.serviceTax', 'Service Charge (10%)')}</span>
                    <span className="font-mono text-white">${serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[var(--border-color)] text-sm font-bold text-[var(--text-color)]">
                    <span>{t('orderDrawer.total', 'Estimated Total')}</span>
                    <span className="font-serif text-lg text-gold-gradient">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSendOrder}
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full bg-gold-gradient text-[var(--background-color)] font-bold text-xs tracking-wider uppercase hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending to Kitchen...' : t('orderDrawer.sendToKitchen', 'Send Order To Kitchen')}</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
