'use client';

import React, { useState, useEffect } from 'react';
import { BellRing, BookmarkCheck, Calendar, Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavbarProps {
  tableNumber: string | null;
  orderCount: number;
  onOpenOrderDrawer: () => void;
  onOpenCallServer: () => void;
  onOpenReservation: () => void;
  restaurantInfo: any;
}

export default function Navbar({
  tableNumber,
  orderCount,
  onOpenOrderDrawer,
  onOpenCallServer,
  onOpenReservation,
  restaurantInfo
}: NavbarProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.story', 'Story'), href: '#story' },
    { name: t('nav.menu', 'Menu'), href: '#menu' },
    { name: t('nav.promotions', 'Promotions'), href: '#promotions' },
    { name: t('nav.gallery', 'Gallery'), href: '#gallery' },
    { name: t('nav.reviews', 'Reviews'), href: '#reviews' },
    { name: t('nav.contact', 'Contact'), href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--background-color)]/95 backdrop-blur-md border-b border-[var(--border-glow-color)] py-3 shadow-2xl'
            : 'bg-gradient-to-b from-[var(--background-color)]/90 via-[var(--background-color)]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gold-gradient p-[1px] shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[var(--surface-color)] rounded-full flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-gold-gradient">
                  {(restaurantInfo?.name || 'AURELIA').charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-widest text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors">
                {restaurantInfo?.name || 'AURELIA'}
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[var(--primary-color)] uppercase font-medium">
                {t('nav.tagline', 'Fine Dining & Cellar')}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-[var(--muted-text-color)] hover:text-[var(--primary-color)] transition-colors relative font-medium group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--primary-color)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions & Language Switcher & QR Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Table Badge if QR Scanned */}
            {tableNumber && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface-color)] border border-[var(--border-glow-color)] text-xs font-semibold text-[var(--primary-color)] animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('nav.connectedTable', 'Table')} {tableNumber}</span>
              </div>
            )}

            {/* Call Server Button */}
            <button
              onClick={onOpenCallServer}
              className="p-2.5 rounded-full bg-[var(--surface-color)] hover:bg-[var(--surface-elevated)] border border-[var(--border-color)] hover:border-[var(--border-glow-color)] text-[var(--text-color)] transition-all relative group"
              title={t('nav.callServer', 'Call Server')}
              aria-label={t('nav.callServer', 'Call Server')}
            >
              <BellRing className="w-4 h-4 text-[var(--primary-color)] group-hover:scale-110 transition-transform" />
            </button>

            {/* Table Order Wishlist Button */}
            <button
              onClick={onOpenOrderDrawer}
              className="p-2.5 rounded-full bg-[var(--surface-color)] hover:bg-[var(--surface-elevated)] border border-[var(--border-color)] hover:border-[var(--border-glow-color)] text-[var(--text-color)] transition-all relative group"
              title={t('nav.tableOrder', 'Table Order')}
              aria-label={t('nav.tableOrder', 'Table Order')}
            >
              <BookmarkCheck className="w-4 h-4 text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors" />
              {orderCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-gradient text-[var(--background-color)] font-bold text-[11px] flex items-center justify-center shadow-md animate-bounce">
                  {orderCount}
                </span>
              )}
            </button>

            {/* Reserve Table CTA */}
            <button
              onClick={onOpenReservation}
              className="hidden lg:flex items-center gap-2 px-5 py-2 rounded-full bg-gold-gradient hover:opacity-95 text-[var(--background-color)] font-bold text-xs tracking-wider uppercase shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('nav.reserveTable', 'Reserve Table')}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-color)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-30 bg-[var(--background-color)]/95 backdrop-blur-xl border-b border-[var(--border-glow-color)] p-6 lg:hidden shadow-2xl space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]"
          >
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <span className="text-xs text-[var(--muted-text-color)] font-medium">Select Language</span>
              <LanguageSwitcher compact />
            </div>

            {tableNumber && (
              <div className="p-3 rounded-lg bg-[var(--surface-color)] border border-[var(--border-glow-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--muted-text-color)]">{t('nav.connectedTable', 'Connected Table')}</span>
                <span className="text-xs font-bold text-[var(--primary-color)] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Table {tableNumber}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-[var(--text-color)] hover:text-[var(--primary-color)] transition-colors py-2 border-b border-[var(--border-color)] flex items-center justify-between font-medium"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-[var(--primary-color)]/60" />
                </a>
              ))}

              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReservation();
                  }}
                  className="w-full py-3 rounded-full bg-gold-gradient text-[var(--background-color)] font-bold text-xs tracking-wider uppercase text-center flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('nav.reserveTable', 'Reserve Table')}</span>
                </button>

                <a
                  href="/admin"
                  className="w-full py-2.5 rounded-full bg-[var(--surface-color)] border border-[var(--border-color)] text-xs text-[var(--muted-text-color)] text-center hover:text-white transition-colors"
                >
                  {t('nav.adminDashboard', 'Admin Dashboard')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
