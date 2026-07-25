'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, ShieldCheck, ArrowUp } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface FooterProps {
  restaurantInfo: any;
}

export default function Footer({ restaurantInfo }: FooterProps) {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--background-color)] border-t border-[var(--border-glow-color)] pt-16 pb-12 text-[var(--muted-text-color)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 pb-12 border-b border-[var(--border-color)]">
          
          {/* Col 1: Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-gradient p-[1px]">
                <div className="w-full h-full bg-[var(--surface-color)] rounded-full flex items-center justify-center">
                  <span className="font-serif text-base font-bold text-gold-gradient">
                    {(restaurantInfo?.name || 'AURELIA').charAt(0)}
                  </span>
                </div>
              </div>
              <span className="font-serif text-xl font-bold tracking-widest text-[var(--text-color)]">
                {restaurantInfo?.name || 'AURELIA'}
              </span>
            </div>

            <p className="text-xs font-light leading-relaxed text-[var(--muted-text-color)]">
              {t('footer.description', 'Exquisite dining experience crafted with passion, elegance, and timeless culinary art.')}
            </p>

            <div className="flex items-center gap-3 text-[var(--primary-color)] pt-1">
              <a href={restaurantInfo?.instagram_url || '#'} className="p-2 rounded-full bg-[var(--surface-color)] hover:bg-[var(--primary-color)] hover:text-[var(--background-color)] transition-all border border-[var(--border-color)]">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={restaurantInfo?.facebook_url || '#'} className="p-2 rounded-full bg-[var(--surface-color)] hover:bg-[var(--primary-color)] hover:text-[var(--background-color)] transition-all border border-[var(--border-color)]">
                <Facebook className="w-4 h-4" />
              </a>
              <LanguageSwitcher compact />
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[var(--text-color)] uppercase tracking-wider">
              {t('footer.quickLinks', 'Quick Links')}
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#story" className="hover:text-[var(--primary-color)] transition-colors">{t('nav.story', 'Story')}</a></li>
              <li><a href="#menu" className="hover:text-[var(--primary-color)] transition-colors">{t('nav.menu', 'Menu')}</a></li>
              <li><a href="#promotions" className="hover:text-[var(--primary-color)] transition-colors">{t('nav.promotions', 'Promotions')}</a></li>
              <li><a href="#gallery" className="hover:text-[var(--primary-color)] transition-colors">{t('nav.gallery', 'Gallery')}</a></li>
              <li><a href="#reviews" className="hover:text-[var(--primary-color)] transition-colors">{t('nav.reviews', 'Reviews')}</a></li>
              <li><a href="#contact" className="hover:text-[var(--primary-color)] transition-colors">{t('nav.contact', 'Contact')}</a></li>
            </ul>
          </div>

          {/* Col 3: Management Access */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[var(--text-color)] uppercase tracking-wider">
              {t('footer.admin', 'Admin Portal')}
            </h4>
            <p className="text-xs text-[var(--muted-text-color)] leading-relaxed">
              Restaurant owner dashboard for menu updates, image uploads, promotions, and table QR code management.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-color)] border border-[var(--border-glow-color)] text-xs font-semibold text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-[var(--background-color)] transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('nav.adminDashboard', 'Admin Dashboard')}</span>
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted-text-color)]">
          <p>© {new Date().getFullYear()} {restaurantInfo?.name || 'AURELIA'}. {t('footer.rights', 'All rights reserved.')}</p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-[var(--background-color)] transition-all"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
