'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, LANGUAGES, SupportedLanguage } from '@/lib/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface-color)] hover:bg-[var(--surface-elevated)] border border-[var(--border-color)] hover:border-[var(--border-glow-color)] text-[var(--text-color)] transition-all text-xs font-medium ${
          compact ? 'py-1 px-2.5 text-[11px]' : ''
        }`}
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-[var(--primary-color)] shrink-0" />
        <span className="shrink-0">{activeLang.flag}</span>
        <span className="font-semibold text-[var(--text-color)]">{activeLang.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-[var(--muted-text-color)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-glow-color)] shadow-2xl backdrop-blur-xl z-50 p-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[var(--primary-color)] tracking-wider border-b border-[var(--border-color)] mb-1">
            Language / ဘာသာစကား
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === locale;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLocale(lang.code as SupportedLanguage);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[var(--surface-elevated)] text-[var(--primary-color)] font-bold'
                    : 'text-[var(--text-color)] hover:bg-[var(--surface-elevated)]/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <div className="flex flex-col text-left">
                    <span className="leading-tight">{lang.nativeName}</span>
                    <span className="text-[9px] text-[var(--muted-text-color)]">{lang.name}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--primary-color)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
