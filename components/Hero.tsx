'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Calendar, Sparkles, Award, Wine, ArrowDown } from 'lucide-react';

interface HeroProps {
  restaurantInfo: any;
  tableNumber: string | null;
  onExploreMenu: () => void;
  onReserveTable: () => void;
}

export default function Hero({ restaurantInfo, tableNumber, onExploreMenu, onReserveTable }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={restaurantInfo?.hero_image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80"}
          alt="Aurelia Dining Ambiance"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1] scale-105 animate-pulse"
          style={{ animationDuration: '10s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0b09]/80 via-transparent to-[#0c0b09]/80" />
      </div>

      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c5a059]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Table Badge Indicator if QR Scanned */}
        {tableNumber && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181510]/90 border border-[#c5a059]/50 shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#c5a059] animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs font-semibold text-[#f8f5ee]">
              Welcome to <span className="text-[#c5a059] font-bold">Table {tableNumber}</span> — Digital Order Ready
            </span>
          </motion.div>
        )}

        {/* Monogram Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#f3e5ab] via-[#c5a059] to-[#8c6d27] p-[1px] shadow-2xl"
        >
          <div className="w-full h-full bg-[#0c0b09] rounded-full flex items-center justify-center border border-[#c5a059]/30">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient">A</span>
          </div>
        </motion.div>

        {/* Tagline Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#c5a059] font-medium mb-4"
        >
          {restaurantInfo?.tagline || 'Where Mediterranean Elegance Meets Haute Cuisine'}
        </motion.span>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#f8f5ee] tracking-tight leading-[1.1] mb-6 max-w-4xl"
        >
          An Artful Ode to <br className="hidden sm:inline" />
          <span className="text-gold-gradient italic font-normal">Coastal Gastronomy</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg text-[#d1c7b7] max-w-2xl font-light leading-relaxed mb-10"
        >
          Curated by Executive Chef Gabriel Laurent. Sourcing wild Atlantic catch, Périgord black truffles, and hand-selected botanicals from Provence.
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
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7b32] text-[#0c0b09] font-semibold text-sm tracking-widest uppercase shadow-2xl shadow-[#c5a059]/20 hover:shadow-[#c5a059]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
          >
            <Utensils className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Explore Digital QR Menu</span>
          </button>

          <button
            onClick={onReserveTable}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#181511]/80 hover:bg-[#24201a] text-[#e6decb] border border-[#c5a059]/30 hover:border-[#c5a059]/70 font-medium text-sm tracking-widest uppercase transition-all backdrop-blur-md flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#c5a059]" />
            <span>Reserve A Table</span>
          </button>
        </motion.div>

        {/* Michelin & Craft Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 pt-8 border-t border-[#c5a059]/15 w-full max-w-3xl"
        >
          <div className="flex items-center justify-center gap-3 text-left">
            <Award className="w-6 h-6 text-[#c5a059] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#f8f5ee] uppercase tracking-wider">3-Star Pedigree</p>
              <p className="text-[11px] text-[#b8ad9a]">Mastery by Chef Gabriel Laurent</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <Sparkles className="w-6 h-6 text-[#c5a059] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#f8f5ee] uppercase tracking-wider">Wild & Organic</p>
              <p className="text-[11px] text-[#b8ad9a]">Daily Artisanal Sourcing</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <Wine className="w-6 h-6 text-[#c5a059] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#f8f5ee] uppercase tracking-wider">Grand Reserve Cellar</p>
              <p className="text-[11px] text-[#b8ad9a]">1,200 Vintage Labels</p>
            </div>
          </div>
        </motion.div>

        {/* Smooth Scroll Down Indicator */}
        <a
          href="#story"
          className="mt-12 p-3 rounded-full text-[#c5a059]/60 hover:text-[#c5a059] transition-colors animate-bounce"
          aria-label="Scroll to Restaurant Story"
        >
          <ArrowDown className="w-5 h-5" />
        </a>

      </div>
    </section>
  );
}
