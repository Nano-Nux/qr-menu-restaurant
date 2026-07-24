'use client';

import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Instagram, Facebook, Compass } from 'lucide-react';

interface ContactSectionProps {
  restaurantInfo: any;
}

export default function ContactSection({ restaurantInfo }: ContactSectionProps) {
  const whatsappNumber = restaurantInfo?.whatsapp ? restaurantInfo.whatsapp.replace(/\D/g, '') : '447946091200';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Aurelia Fine Dining, I would like to inquire about table availability.')}`;

  return (
    <section id="contact" className="py-24 bg-[#0c0b09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#c5a059] font-medium block mb-2">
            Sanctuary & Coordinates
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5ee]">
            Contact & Location
          </h2>
          <p className="text-xs sm:text-sm text-[#b8ad9a] mt-3 font-light">
            We look forward to welcoming you to our Mayfair dining salon and cellar.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Box */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-[#c5a059]">
                <MapPin className="w-5 h-5" />
                <h4 className="font-serif text-lg font-bold text-[#f8f5ee]">Restaurant Address</h4>
              </div>
              <p className="text-xs text-[#d1c7b7] font-light leading-relaxed pl-8">
                {restaurantInfo?.address || '450 Grand Avenue, Mayfair, London W1K 2HP'}
              </p>
            </div>

            {/* Hours Box */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-[#c5a059]">
                <Clock className="w-5 h-5" />
                <h4 className="font-serif text-lg font-bold text-[#f8f5ee]">Opening Hours</h4>
              </div>
              <p className="text-xs text-[#d1c7b7] font-light leading-relaxed pl-8">
                {restaurantInfo?.opening_hours || 'Mon - Sun: 17:30 - 23:30 | Weekend Lunch: 12:00 - 15:30'}
              </p>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${restaurantInfo?.phone || '+442079460912'}`}
                className="p-4 rounded-xl bg-[#181510] border border-white/10 hover:border-[#c5a059]/40 transition-all flex items-center gap-3"
              >
                <Phone className="w-4 h-4 text-[#c5a059]" />
                <div>
                  <span className="text-[10px] text-[#8c8273] uppercase tracking-wider block">Direct Line</span>
                  <span className="text-xs font-bold text-[#f8f5ee]">{restaurantInfo?.phone || '+44 20 7946 0912'}</span>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#122216] border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center gap-3 text-emerald-400"
              >
                <MessageSquare className="w-4 h-4" />
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">WhatsApp VIP</span>
                  <span className="text-xs font-bold text-white">Direct Chat</span>
                </div>
              </a>
            </div>

          </div>

          {/* Interactive Styled Map Card */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-[#c5a059]/30 h-full min-h-[380px] flex flex-col justify-between relative overflow-hidden group">
            
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1000&auto=format&fit=crop&q=80')] bg-cover bg-center filter brightness-[0.35] contrast-[1.1] group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-transparent to-[#0c0b09]" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0c0b09]/80 border border-[#c5a059]/40 text-[#c5a059]">
                Mayfair Coordinates
              </span>
              <span className="text-xs text-[#d1c7b7] font-mono">51.5074° N, 0.1278° W</span>
            </div>

            <div className="relative z-10 text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#181510] border-2 border-[#c5a059] text-[#c5a059] flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#f8f5ee]">
                Aurelia Mayfair
              </h3>
              <p className="text-xs text-[#d1c7b7] max-w-sm mx-auto font-light">
                450 Grand Avenue, Mayfair, London
              </p>
            </div>

            <div className="relative z-10 pt-4 flex justify-center">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(restaurantInfo?.address || 'Mayfair London')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold text-xs tracking-wider uppercase hover:shadow-lg transition-all"
              >
                Open in Google Maps
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
