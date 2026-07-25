'use client';

import React, { createContext, useContext, useState } from 'react';
import en from '@/locales/en/common.json';
import my from '@/locales/my/common.json';
import th from '@/locales/th/common.json';

export type SupportedLanguage = 'en' | 'my' | 'th';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' }
];

const dictionaryMap: Record<SupportedLanguage, any> = { en, my, th };

interface LanguageContextType {
  locale: SupportedLanguage;
  setLocale: (lang: SupportedLanguage) => void;
  t: (keyPath: string, fallback?: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (keyPath, fallback) => fallback || keyPath,
  languages: LANGUAGES
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('aurelia_locale') as SupportedLanguage;
      if (savedLang && ['en', 'my', 'th'].includes(savedLang)) {
        return savedLang;
      }
      const browserLang = window.navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('my') || browserLang.includes('burma')) {
        return 'my';
      }
      if (browserLang.startsWith('th')) {
        return 'th';
      }
    }
    return 'en';
  });

  const setLocale = (newLang: SupportedLanguage) => {
    setLocaleState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurelia_locale', newLang);
    }
  };

  // Helper for nested key resolution e.g. t('nav.menu') or t('hero.welcome')
  const t = (keyPath: string, fallback?: string): string => {
    const dict = dictionaryMap[locale] || dictionaryMap.en;
    const fallbackDict = dictionaryMap.en;

    const keys = keyPath.split('.');
    
    let current = dict;
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        current = undefined;
        break;
      }
    }

    if (typeof current === 'string') return current;

    // Fallback to English dictionary
    let fallbackVal = fallbackDict;
    for (const k of keys) {
      if (fallbackVal && typeof fallbackVal === 'object' && k in fallbackVal) {
        fallbackVal = fallbackVal[k];
      } else {
        fallbackVal = undefined;
        break;
      }
    }

    if (typeof fallbackVal === 'string') return fallbackVal;

    return fallback || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
