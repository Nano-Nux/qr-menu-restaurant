'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ChevronRight, Gift, Wine } from 'lucide-react';

interface PromotionsSectionProps {
  promotions: any[];
  onOpenReservation: () => void;
}

export default function PromotionsSection({ promotions, onOpenReservation }: PromotionsSectionProps) {
  if (!promotions || promotions.length === 0) return null;

  return (
    <section id="promotions" className="py-24 bg-[#0e0c0a] relative overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#c5a059] font-medium block mb-2">
            Curated Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5ee]">
            Seasonal Offers & Tasting Menus
          </h2>
          <p className="text-xs sm:text-sm text-[#b8ad9a] mt-3 font-light">
            Exclusive culinary journeys, sunset aperitivo hours, and private cellar wine pairings.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="glass-card-gold rounded-3xl overflow-hidden border border-[#c5a059]/30 p-6 sm:p-8 flex flex-col justify-between group hover:border-[#c5a059]/70 transition-all duration-500 shadow-2xl relative"
            >
              {/* Top Banner Content */}
              <div className="space-y-4">
                
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#c5a059] text-[#0c0b09] shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {promo.discount_tag || 'Limited Experience'}
                  </span>

                  <span className="text-xs text-[#c5a059] font-serif italic">
                    Exclusive Selection
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#f8f5ee] group-hover:text-[#c5a059] transition-colors leading-tight">
                  {promo.title}
                </h3>

                {promo.subtitle && (
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
                    {promo.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#d1c7b7] font-light leading-relaxed">
                  {promo.description}
                </p>

              </div>

              {/* Promotional Hero Image Preview */}
              <div className="my-6 relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#181510] border border-white/5">
                <img
                  src={promo.image || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-transparent to-transparent opacity-60" />
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-[#a39783] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#c5a059]" /> Advanced Booking Recommended
                </span>

                <button
                  onClick={onOpenReservation}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold text-xs tracking-wider uppercase hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Book Experience</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
