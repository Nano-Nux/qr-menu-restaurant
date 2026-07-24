'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Check, Flame, Award, AlertTriangle, Sparkles, Utensils, Heart } from 'lucide-react';

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-md">
        
        {/* Click backdrop to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#12100d] border border-[#c5a059]/30 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0c0b09]/80 border border-white/10 text-[#d1c7b7] hover:text-white hover:bg-[#1c1813] transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto no-scrollbar flex-1">
            
            {/* Header Image Banner */}
            <div className="relative h-64 sm:h-80 w-full bg-[#181510]">
              <img
                src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12100d] via-[#12100d]/40 to-transparent" />

              {/* Tag Overlay */}
              {item.tags && (
                <div className="absolute bottom-4 left-6 flex flex-wrap gap-2">
                  {item.tags.split(',').map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c0b09]/80 backdrop-blur-md text-[#c5a059] border border-[#c5a059]/40 shadow-lg"
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
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f8f5ee]">
                    {item.name}
                  </h2>
                  {item.calories && (
                    <p className="text-xs text-[#a39783] mt-1 font-mono">
                      Nutritional Energy: {item.calories} kcal
                    </p>
                  )}
                </div>

                <span className="font-serif text-3xl font-bold text-gold-gradient shrink-0">
                  ${item.price}
                </span>
              </div>

              {/* Main Description */}
              <p className="text-sm sm:text-base text-[#d1c7b7] font-light leading-relaxed">
                {item.description}
              </p>

              {/* Wine Pairing Box */}
              {item.wine_pairing && (
                <div className="p-4 rounded-xl bg-[#181510] border border-[#c5a059]/30 flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
                      Sommelier Wine Recommendation
                    </h4>
                    <p className="text-xs text-[#e6decb] mt-0.5 italic">
                      {item.wine_pairing}
                    </p>
                  </div>
                </div>
              )}

              {/* Ingredients & Allergens Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {item.ingredients && (
                  <div className="p-4 rounded-xl bg-[#181510] border border-white/5 space-y-1">
                    <span className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider block">
                      Artisanal Ingredients
                    </span>
                    <p className="text-xs text-[#a39783] leading-relaxed">
                      {item.ingredients}
                    </p>
                  </div>
                )}

                {item.allergens && (
                  <div className="p-4 rounded-xl bg-[#181510] border border-red-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Allergen Considerations
                    </span>
                    <p className="text-xs text-[#e2b8b8] leading-relaxed">
                      {item.allergens}
                    </p>
                  </div>
                )}

              </div>

              {/* Preparation Notes / Special Requests Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block">
                  Kitchen Preparation Request (Optional)
                </label>
                <input
                  type="text"
                  value={prepNotes}
                  onChange={(e) => setPrepNotes(e.target.value)}
                  placeholder="e.g. Extra truffle oil, dressing on the side, no butter..."
                  className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#f8f5ee] placeholder-[#8c8273] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="p-6 bg-[#0c0b09] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-[#181510] border border-white/10 rounded-full px-4 py-1.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 rounded-full text-[#c5a059] hover:bg-white/10 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-sm font-bold text-[#f8f5ee] w-6 text-center font-mono">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 rounded-full text-[#c5a059] hover:bg-white/10 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Total Price & Add Button */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-[#8c8273] uppercase tracking-wider block">Total Amount</span>
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
                    : 'bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7b32] text-[#0c0b09] hover:shadow-[#c5a059]/30'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Order!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add ${(item.price * quantity).toFixed(2)} to Table Order
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
