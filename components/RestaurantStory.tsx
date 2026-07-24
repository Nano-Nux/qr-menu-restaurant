'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Quote, Flame, HeartHandshake, Sparkles, Compass } from 'lucide-react';

interface StoryProps {
  restaurantInfo: any;
}

export default function RestaurantStory({ restaurantInfo }: StoryProps) {
  return (
    <section id="story" className="py-24 bg-[#0e0c0a] relative overflow-hidden">
      {/* Subtle Background Pattern & Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-medium block mb-2">
            The Culinary Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5ee]">
            Our Philosophy & Story
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mt-4" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Photography Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#c5a059]/20 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80"
                alt="Executive Chef Plating"
                className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-transparent to-transparent opacity-80" />
            </div>

            {/* Overlapping Floating Inset Image */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 w-56 h-64 rounded-xl overflow-hidden border-2 border-[#c5a059]/40 shadow-2xl bg-[#0c0b09]">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop&q=80"
                alt="Finishing Touch"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Chef Badge */}
            <div className="absolute top-6 left-6 p-4 rounded-xl bg-[#14120e]/90 backdrop-blur-md border border-[#c5a059]/30 shadow-xl max-w-xs">
              <p className="text-xs text-[#c5a059] font-serif font-bold uppercase tracking-wider">Executive Chef</p>
              <p className="text-sm font-semibold text-[#f8f5ee]">{restaurantInfo?.chef_name || 'Gabriel Laurent'}</p>
              <p className="text-[11px] text-[#b8ad9a] mt-0.5">Former Head Chef at 3-Star Michelin San Pellegrino Top 50</p>
            </div>
          </div>

          {/* Right Column: Narrative Text */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-base sm:text-lg text-[#d1c7b7] font-light leading-relaxed">
              {restaurantInfo?.description ||
                'Founded by Executive Chef Gabriel Laurent, Aurelia represents a culinary sanctuary celebrating coastal European gastronomy. Sourcing wild-caught Atlantic seafood, Périgord black truffles, and hand-picked organic botanicals, every plate is an intimate dialogue between nature and culinary precision.'}
            </p>

            {/* Quote Box */}
            <div className="p-6 rounded-xl bg-[#14120f] border-l-2 border-[#c5a059] space-y-3 my-6">
              <Quote className="w-8 h-8 text-[#c5a059]/40" />
              <p className="font-serif italic text-base sm:text-lg text-[#e6decb]">
                "True gastronomy is not about altering nature, but honoring its seasonal perfection with unyielding technique and soul."
              </p>
              <p className="text-xs font-bold text-[#c5a059] tracking-widest uppercase">— Chef Gabriel Laurent</p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-lg bg-[#14120f] border border-white/5 flex items-start gap-3">
                <Flame className="w-5 h-5 text-[#c5a059] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-semibold text-[#f8f5ee]">Japanese Binchotan Flame</h4>
                  <p className="text-xs text-[#a39783] mt-1">High-heat clean charcoal grilling for maximum flavor locking.</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#14120f] border border-white/5 flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#c5a059] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-semibold text-[#f8f5ee]">40-Yolk Artisanal Pasta</h4>
                  <p className="text-xs text-[#a39783] mt-1">Extruded fresh daily using heritage Italian semolina and organic yolks.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
