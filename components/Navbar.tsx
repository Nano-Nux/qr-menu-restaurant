'use client';

import React, { useState, useEffect } from 'react';
import { Utensils, BellRing, BookmarkCheck, Calendar, Menu, X, Sparkles, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    { name: 'Story', href: '#story' },
    { name: 'Menu', href: '#menu' },
    { name: 'Promotions', href: '#promotions' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0c0b09]/90 backdrop-blur-md border-b border-[#c5a059]/20 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-[#0c0b09]/90 via-[#0c0b09]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] via-[#c5a059] to-[#8c6d27] p-[1px] shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#12100d] rounded-full flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-gold-gradient">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-widest text-[#f8f5ee] group-hover:text-[#c5a059] transition-colors">
                {restaurantInfo?.name || 'AURELIA'}
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#c5a059] uppercase font-medium">
                Fine Dining & Cellar
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm tracking-wide text-[#d1c7b7] hover:text-[#c5a059] transition-colors relative font-medium group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions & QR Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Table Badge if QR Scanned */}
            {tableNumber && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1813] border border-[#c5a059]/40 text-xs font-semibold text-[#c5a059] animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Table {tableNumber}</span>
              </div>
            )}

            {/* Call Server Button */}
            <button
              onClick={onOpenCallServer}
              className="p-2.5 rounded-full bg-[#181613] hover:bg-[#26221c] border border-white/10 hover:border-[#c5a059]/40 text-[#e6decb] transition-all relative group"
              title="Call Server"
              aria-label="Call Server"
            >
              <BellRing className="w-4 h-4 text-[#c5a059] group-hover:scale-110 transition-transform" />
            </button>

            {/* Table Order Wishlist Button */}
            <button
              onClick={onOpenOrderDrawer}
              className="p-2.5 rounded-full bg-[#181613] hover:bg-[#26221c] border border-white/10 hover:border-[#c5a059]/40 text-[#e6decb] transition-all relative group"
              title="Table Order / Wishlist"
              aria-label="Table Order / Wishlist"
            >
              <BookmarkCheck className="w-4 h-4 text-[#e6decb] group-hover:text-[#c5a059] transition-colors" />
              {orderCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold text-[11px] flex items-center justify-center shadow-md animate-bounce">
                  {orderCount}
                </span>
              )}
            </button>

            {/* Reserve Table CTA */}
            <button
              onClick={onOpenReservation}
              className="hidden lg:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#a88238] hover:opacity-95 text-[#0c0b09] font-medium text-xs tracking-wider uppercase shadow-lg shadow-[#c5a059]/10 transition-all hover:shadow-[#c5a059]/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Table</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-[#181613] border border-white/10 text-[#e6decb]"
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
            className="fixed inset-x-0 top-[65px] z-30 bg-[#0c0b09]/95 backdrop-blur-xl border-b border-[#c5a059]/20 p-6 md:hidden shadow-2xl"
          >
            {tableNumber && (
              <div className="mb-4 p-3 rounded-lg bg-[#181510] border border-[#c5a059]/30 flex items-center justify-between">
                <span className="text-xs text-[#b8ad9a]">Connected Table</span>
                <span className="text-xs font-bold text-[#c5a059] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Table {tableNumber}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-[#e6decb] hover:text-[#c5a059] transition-colors py-2 border-b border-white/5 flex items-center justify-between font-medium"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#c5a059]/60" />
                </a>
              ))}

              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReservation();
                  }}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-semibold text-xs tracking-wider uppercase text-center flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Table</span>
                </button>

                <a
                  href="/admin"
                  className="w-full py-2.5 rounded-full bg-[#181613] border border-white/10 text-xs text-[#b8ad9a] text-center hover:text-white transition-colors"
                >
                  Restaurant Admin Dashboard
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
