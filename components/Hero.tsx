'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Calendar, Sparkles, Award, Wine, ArrowDown } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

interface HeroProps {
  restaurantInfo: any;
  tableNumber: string | null;
  onExploreMenu: () => void;
  onReserveTable: () => void;
}

export default function Hero({ restaurantInfo, tableNumber, onExploreMenu, onReserveTable }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={restaurantInfo?.hero_image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80"}
          alt="Restaurant Ambiance"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1] scale-105 animate-pulse"
          style={{ animationDuration: '10s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-color)] via-[var(--background-color)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-color)]/80 via-transparent to-[var(--background-color)]/80" />
      </div>

      {/* Decorative Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-color)]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Table Badge Indicator if QR Scanned */}
        {tableNumber && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-color)]/90 border border-[var(--border-glow-color)] shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[var(--primary-color)] animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs font-semibold text-[var(--text-color)]">
              {t('hero.welcome', 'Welcome to')} <span className="text-[var(--primary-color)] font-bold">{t('hero.tableConnected', 'Table')} {tableNumber}</span> — {t('hero.scanNotice', 'Digital Order Active')}
            </span>
          </motion.div>
        )}

        {/* Monogram Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-gradient p-[1px] shadow-2xl"
        >
          <div className="w-full h-full bg-[var(--background-color)] rounded-full flex items-center justify-center border border-[var(--border-glow-color)]">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient">
              {(restaurantInfo?.name || 'AURELIA').charAt(0)}
            </span>
          </div>
        </motion.div>

        {/* Tagline Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[var(--primary-color)] font-medium mb-4"
        >
          {restaurantInfo?.tagline || 'Where Mediterranean Elegance Meets Haute Cuisine'}
        </motion.span>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[var(--text-color)] tracking-tight leading-[1.1] mb-6 max-w-4xl"
        >
          An Artful Ode to <br className="hidden sm:inline" />
          <span className="text-gold-gradient italic font-normal">Coastal Gastronomy</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg text-[var(--muted-text-color)] max-w-2xl font-light leading-relaxed mb-10"
        >
          {t('hero.subtitle', 'An extraordinary culinary symphony crafted with passion, artful precision, and the world\'s finest organic ingredients.')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-gradient text-[var(--background-color)] font-bold text-sm tracking-widest uppercase shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
          >
            <Utensils className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>{t('hero.exploreMenu', 'Explore Digital Menu')}</span>
          </button>

          <button
            onClick={onReserveTable}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--surface-color)] hover:bg-[var(--surface-elevated)] text-[var(--text-color)] border border-[var(--border-glow-color)] font-medium text-sm tracking-widest uppercase transition-all backdrop-blur-md flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[var(--primary-color)]" />
            <span>{t('hero.reserveTable', 'Reserve A Table')}</span>
          </button>
        </motion.div>

        {/* Michelin & Craft Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 pt-8 border-t border-[var(--border-color)] w-full max-w-3xl"
        >
          <div className="flex items-center justify-center gap-3 text-left">
            <Award className="w-6 h-6 text-[var(--primary-color)] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[var(--text-color)] uppercase tracking-wider">{t('story.michelinBadge', '3-Star Pedigree')}</p>
              <p className="text-[11px] text-[var(--muted-text-color)]">Mastery by Chef Laurent</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <Sparkles className="w-6 h-6 text-[var(--primary-color)] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[var(--text-color)] uppercase tracking-wider">{t('story.organicIngredients', '100% Organic Sourcing')}</p>
              <p className="text-[11px] text-[var(--muted-text-color)]">Daily Artisanal Sourcing</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <Wine className="w-6 h-6 text-[var(--primary-color)] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[var(--text-color)] uppercase tracking-wider">Grand Reserve Cellar</p>
              <p className="text-[11px] text-[var(--muted-text-color)]">1,200 Vintage Labels</p>
            </div>
          </div>
        </motion.div>

        {/* Smooth Scroll Down Indicator */}
        <a
          href="#story"
          className="mt-12 p-3 rounded-full text-[var(--primary-color)]/60 hover:text-[var(--primary-color)] transition-colors animate-bounce"
          aria-label="Scroll to Restaurant Story"
        >
          <ArrowDown className="w-5 h-5" />
        </a>

      </div>
    </section>
  );
}
