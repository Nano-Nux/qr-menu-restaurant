'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus, Star, Award, HeartHandshake, Eye } from 'lucide-react';

interface FeaturedDishesProps {
  items: any[];
  onSelectItem: (item: any) => void;
  onAddToOrder: (item: any) => void;
}

export default function FeaturedDishes({ items, onSelectItem, onAddToOrder }: FeaturedDishesProps) {
  // Filter items tagged with Chef Choice, Bestseller, or Signature
  const featured = items.filter(
    (item) =>
      item.tags?.includes('Chef Choice') ||
      item.tags?.includes('Bestseller') ||
      item.tags?.includes('Signature')
  ).slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 bg-[#0c0b09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/5 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-medium block mb-1">
              Culinary Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f8f5ee]">
              Signature Creations
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#b8ad9a] max-w-md mt-2 md:mt-0 font-light">
            Hand-crafted culinary masterpieces crafted with rare seasonal harvests and unyielding artisanal technique.
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-[#c5a059]/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges Container */}
                <div className="relative h-60 overflow-hidden bg-[#181510]">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {item.tags?.split(',').map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0c0b09]/80 backdrop-blur-md text-[#c5a059] border border-[#c5a059]/40 shadow-lg flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Quick View Button Overlay */}
                  <div className="absolute inset-0 bg-[#0c0b09]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-[#1c1813] border border-[#c5a059]/60 text-xs text-[#f8f5ee] font-medium flex items-center gap-2 shadow-2xl">
                      <Eye className="w-3.5 h-3.5 text-[#c5a059]" /> Inspect Dish
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#f8f5ee] group-hover:text-[#c5a059] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <span className="font-serif text-lg font-bold text-gold-gradient shrink-0">
                      ${item.price}
                    </span>
                  </div>

                  <p className="text-xs text-[#b8ad9a] font-light leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {item.wine_pairing && (
                    <div className="pt-2 text-[11px] text-[#c5a059]/90 italic flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span className="line-clamp-1">Pairing: {item.wine_pairing}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[11px] text-[#8c8273] uppercase tracking-wider font-mono">
                  {item.calories ? `${item.calories} kcal` : 'Chef Spec'}
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToOrder(item);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#1c1914] hover:bg-[#c5a059] text-[#c5a059] hover:text-[#0c0b09] border border-[#c5a059]/30 font-semibold text-xs transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Order
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
