'use client';

import React from 'react';
import { Instagram, Facebook, ShieldCheck, ArrowUp } from 'lucide-react';

interface FooterProps {
  restaurantInfo: any;
}

export default function Footer({ restaurantInfo }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080706] border-t border-[#c5a059]/20 pt-16 pb-12 text-[#b8ad9a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-white/5">
          
          {/* Col 1: Branding */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8c6d27] p-[1px]">
                <div className="w-full h-full bg-[#0c0b09] rounded-full flex items-center justify-center">
                  <span className="font-serif text-base font-bold text-gold-gradient">A</span>
                </div>
              </div>
              <span className="font-serif text-xl font-bold tracking-widest text-[#f8f5ee]">
                {restaurantInfo?.name || 'AURELIA'}
              </span>
            </div>

            <p className="text-xs font-light leading-relaxed text-[#a39783]">
              Where Mediterranean elegance meets haute cuisine. Digital QR menu experience & fine dining cellar.
            </p>

            <div className="flex items-center gap-3 text-[#c5a059]">
              <a href={restaurantInfo?.instagram_url || '#'} className="p-2 rounded-full bg-[#181510] hover:bg-[#c5a059] hover:text-[#0c0b09] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={restaurantInfo?.facebook_url || '#'} className="p-2 rounded-full bg-[#181510] hover:bg-[#c5a059] hover:text-[#0c0b09] transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#f8f5ee] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#story" className="hover:text-[#c5a059] transition-colors">Culinary Story</a></li>
              <li><a href="#menu" className="hover:text-[#c5a059] transition-colors">Digital QR Menu</a></li>
              <li><a href="#promotions" className="hover:text-[#c5a059] transition-colors">Seasonal Specials</a></li>
              <li><a href="#gallery" className="hover:text-[#c5a059] transition-colors">Ambiance Gallery</a></li>
              <li><a href="#reviews" className="hover:text-[#c5a059] transition-colors">Diner Testimonials</a></li>
              <li><a href="#contact" className="hover:text-[#c5a059] transition-colors">Location & Hours</a></li>
            </ul>
          </div>

          {/* Col 3: Hours & Address */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#f8f5ee] uppercase tracking-wider">
              Hours & Location
            </h4>
            <p className="text-xs text-[#a39783] leading-relaxed">
              {restaurantInfo?.address || '450 Grand Avenue, Mayfair, London'}
            </p>
            <p className="text-xs text-[#c5a059] italic pt-1">
              {restaurantInfo?.opening_hours || 'Mon - Sun: 17:30 - 23:30'}
            </p>
          </div>

          {/* Col 4: Management Access */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#f8f5ee] uppercase tracking-wider">
              Restaurant Portal
            </h4>
            <p className="text-xs text-[#a39783] leading-relaxed">
              Restaurant owner and manager portal for live menu CRUD, promotions, and table QR code generation.
            </p>
            <a
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181510] border border-[#c5a059]/40 text-xs font-semibold text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0b09] transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Dashboard</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c8273]">
          <p>© {new Date().getFullYear()} {restaurantInfo?.name || 'AURELIA'} Fine Dining & Cellar. All Rights Reserved.</p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-[#181510] border border-white/10 text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0b09] transition-all"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
