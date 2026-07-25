'use client';

import React from 'react';
import { Sparkles, ChevronRight, Gift } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

interface PromotionsSectionProps {
  promotions: any[];
  onOpenReservation: (specialRequest?: string) => void;
}

export default function PromotionsSection({ promotions, onOpenReservation }: PromotionsSectionProps) {
  const { t, locale } = useTranslation();

  if (!promotions || promotions.length === 0) return null;

  const getPromoTitle = (p: any) => {
    if (locale === 'my' && p.title_my) return p.title_my;
    if (locale === 'th' && p.title_th) return p.title_th;
    return p.title;
  };

  const getPromoDesc = (p: any) => {
    if (locale === 'my' && p.description_my) return p.description_my;
    if (locale === 'th' && p.description_th) return p.description_th;
    return p.description;
  };

  return (
    <section id="promotions" className="py-24 bg-[var(--background-color)] relative overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--primary-color)]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--primary-color)] font-medium block mb-2">
            Curated Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--text-color)]">
            {t('promotions.title', 'Chef\'s Seasonal Tasting & Special Offers')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text-color)] mt-3 font-light">
            {t('promotions.subtitle', 'Exclusive epicurean journeys, curated wine pairings, and seasonal celebrations.')}
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promotions.map((promo) => {
            const displayTitle = getPromoTitle(promo);
            const displayDesc = getPromoDesc(promo);

            return (
              <div
                key={promo.id}
                className="glass-card-gold rounded-3xl overflow-hidden border border-[var(--border-glow-color)] p-6 sm:p-8 flex flex-col justify-between group hover:border-[var(--primary-color)] transition-all duration-500 shadow-2xl relative"
              >
                {/* Top Banner Content */}
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--primary-color)] text-[var(--background-color)] shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {promo.discount_tag || 'Limited Experience'}
                    </span>

                    <span className="text-xs text-[var(--primary-color)] font-serif italic">
                      Exclusive Selection
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors leading-tight">
                    {displayTitle}
                  </h3>

                  {promo.subtitle && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary-color)]">
                      {promo.subtitle}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-[var(--muted-text-color)] font-light leading-relaxed">
                    {displayDesc}
                  </p>

                </div>

                {/* Promotional Hero Image Preview */}
                <div className="my-6 relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                  <img
                    src={promo.image || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-color)] via-transparent to-transparent opacity-60" />
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <span className="text-xs text-[var(--muted-text-color)] flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-[var(--primary-color)]" /> Advanced Booking Recommended
                  </span>

                  <button
                    onClick={() => onOpenReservation(`Special Offer: ${displayTitle}`)}
                    className="px-6 py-2.5 rounded-full bg-gold-gradient text-[var(--background-color)] font-bold text-xs tracking-wider uppercase hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span>{t('promotions.claimOffer', 'Reserve for Special Offer')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
