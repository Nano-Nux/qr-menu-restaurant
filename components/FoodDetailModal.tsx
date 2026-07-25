'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Check, Award, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

interface FoodDetailModalProps {
  item: any | null;
  onClose: () => void;
  onAddToOrder: (item: any, quantity: number, notes?: string) => void;
  isInOrder: boolean;
}

export default function FoodDetailModal({
  item,
  onClose,
  onAddToOrder,
  isInOrder
}: FoodDetailModalProps) {
  const { t, locale } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [prepNotes, setPrepNotes] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!item) return null;

  const handleAdd = () => {
    onAddToOrder(item, quantity, prepNotes);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const getItemName = (item: any) => {
    if (locale === 'my' && item.name_my) return item.name_my;
    if (locale === 'th' && item.name_th) return item.name_th;
    return item.name;
  };

  const getItemDescription = (item: any) => {
    if (locale === 'my' && item.description_my) return item.description_my;
    if (locale === 'th' && item.description_th) return item.description_th;
    return item.description;
  };

  const displayName = getItemName(item);
  const displayDesc = getItemDescription(item);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        
        {/* Click backdrop to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[var(--background-color)] border border-[var(--border-glow-color)] rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[var(--background-color)]/80 border border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--surface-color)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto no-scrollbar flex-1">
            
            {/* Header Image Banner */}
            <div className="relative h-64 sm:h-80 w-full bg-[var(--surface-elevated)]">
              <img
                src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"}
                alt={displayName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-color)] via-[var(--background-color)]/40 to-transparent" />

              {/* Tag Overlay */}
              {item.tags && (
                <div className="absolute bottom-4 left-6 flex flex-wrap gap-2">
                  {item.tags.split(',').map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--background-color)]/80 backdrop-blur-md text-[var(--primary-color)] border border-[var(--border-glow-color)] shadow-lg"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Title & Price Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-color)] pb-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-color)]">
                    {displayName}
                  </h2>
                  {item.calories && (
                    <p className="text-xs text-[var(--muted-text-color)] mt-1 font-mono">
                      Nutritional Energy: {item.calories} kcal
                    </p>
                  )}
                </div>

                <span className="font-serif text-3xl font-bold text-gold-gradient shrink-0">
                  ${item.price}
                </span>
              </div>

              {/* Main Description */}
              <p className="text-sm sm:text-base text-[var(--muted-text-color)] font-light leading-relaxed">
                {displayDesc}
              </p>

              {/* Wine Pairing Box */}
              {item.wine_pairing && (
                <div className="p-4 rounded-xl bg-[var(--surface-color)] border border-[var(--border-glow-color)] flex items-start gap-3">
                  <Award className="w-5 h-5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--primary-color)] uppercase tracking-wider">
                      Sommelier Wine Pairing
                    </h4>
                    <p className="text-xs text-[var(--text-color)] mt-0.5 italic">
                      {item.wine_pairing}
                    </p>
                  </div>
                </div>
              )}

              {/* Ingredients & Allergens Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {item.ingredients && (
                  <div className="p-4 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[11px] font-bold text-[var(--primary-color)] uppercase tracking-wider block">
                      Ingredients
                    </span>
                    <p className="text-xs text-[var(--muted-text-color)] leading-relaxed">
                      {item.ingredients}
                    </p>
                  </div>
                )}

                {item.allergens && (
                  <div className="p-4 rounded-xl bg-[var(--surface-color)] border border-red-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {t('menu.allergens', 'Allergen Considerations')}
                    </span>
                    <p className="text-xs text-red-300 leading-relaxed">
                      {item.allergens}
                    </p>
                  </div>
                )}

              </div>

              {/* Preparation Notes / Special Requests Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block">
                  {t('orderDrawer.notesPlaceholder', 'Kitchen Instructions (Optional)')}
                </label>
                <input
                  type="text"
                  value={prepNotes}
                  onChange={(e) => setPrepNotes(e.target.value)}
                  placeholder="e.g. Extra spicy, no onions..."
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[var(--muted-text-color)] focus:outline-none focus:border-[var(--primary-color)]"
                />
              </div>

            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="p-6 bg-[var(--background-color)] border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-full px-4 py-1.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 rounded-full text-[var(--primary-color)] hover:bg-white/10 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-sm font-bold text-white w-6 text-center font-mono">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 rounded-full text-[var(--primary-color)] hover:bg-white/10 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Total Price & Add Button */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-[var(--muted-text-color)] uppercase tracking-wider block">Total Amount</span>
                <span className="font-serif text-xl font-bold text-gold-gradient">
                  ${(item.price * quantity).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAdd}
                disabled={addedSuccess}
                className={`flex-1 sm:flex-initial px-8 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gold-gradient text-[var(--background-color)]'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> {t('menu.inOrder', 'Added to Order!')}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> {t('menu.addToOrder', 'Add to Order')} (${(item.price * quantity).toFixed(2)})
                  </>
                )}
              </button>
            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
