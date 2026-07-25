'use client';

import React from 'react';
import { useTheme, ThemeName } from '@/lib/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themes: { id: ThemeName; label: string; previewBg: string; previewAcc: string }[] = [
    {
      id: 'default',
      label: t('themeSwitcher.default', 'Aurelia Luxury Gold'),
      previewBg: '#0c0b09',
      previewAcc: '#c5a059'
    },
    {
      id: 'modern',
      label: t('themeSwitcher.modern', 'Modern Slate & Amber'),
      previewBg: '#0f172a',
      previewAcc: '#38bdf8'
    },
    {
      id: 'royal',
      label: t('themeSwitcher.royal', 'Royal Emerald & Sapphire'),
      previewBg: '#062016',
      previewAcc: '#10b981'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[var(--primary-color)] flex items-center gap-1.5 uppercase tracking-wider">
        <Palette className="w-3.5 h-3.5" />
        <span>{t('themeSwitcher.themeLabel', 'Restaurant Branding Theme')}</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {themes.map((item) => {
          const isActive = theme === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-[var(--surface-elevated)] border-[var(--primary-color)] ring-1 ring-[var(--primary-color)]'
                  : 'bg-[var(--surface-color)] border-[var(--border-color)] hover:border-[var(--border-glow-color)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 shadow"
                  style={{ backgroundColor: item.previewBg }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.previewAcc }}
                  />
                </div>
                <span className="text-xs font-bold text-[var(--text-color)]">{item.label}</span>
              </div>
              {isActive && <Check className="w-4 h-4 text-[var(--primary-color)] shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
