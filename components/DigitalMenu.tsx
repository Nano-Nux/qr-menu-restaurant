'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, Flame, AlertCircle, Wine, X, Utensils, Wheat, Fish, Cake, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

interface DigitalMenuProps {
  categories: any[];
  items: any[];
  onSelectItem: (item: any) => void;
  onAddToOrder: (item: any) => void;
  orderItemIds: string[];
}

export default function DigitalMenu({
  categories,
  items,
  onSelectItem,
  onAddToOrder,
  orderItemIds
}: DigitalMenuProps) {
  const { t, locale } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDietaryFilter, setActiveDietaryFilter] = useState<string>('all');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Icon mapping helper
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('starter') || lower.includes('raw')) return UtensilsCrossed;
    if (lower.includes('pasta')) return Wheat;
    if (lower.includes('grill') || lower.includes('meat')) return Flame;
    if (lower.includes('seafood') || lower.includes('fish')) return Fish;
    if (lower.includes('dessert')) return Cake;
    if (lower.includes('cellar') || lower.includes('wine') || lower.includes('cocktail')) return Wine;
    return Utensils;
  };

  // Dietary filter options with i18n
  const dietaryOptions = [
    { id: 'all', label: t('menu.dietaryAll', 'All Dishes') },
    { id: 'Vegetarian', label: t('menu.dietaryVeg', 'Vegetarian') },
    { id: 'Vegan', label: 'Vegan' },
    { id: 'Gluten-Free', label: 'Gluten-Free' },
    { id: 'Chef Choice', label: t('menu.dietaryChef', 'Chef Choice') },
    { id: 'Bestseller', label: t('menu.popular', 'Bestseller') },
  ];

  // Helper to get localized item name & description
  const getItemName = (item: any) => {
    if (locale === 'my' && item.name_my) return item.name_my;
    if (locale === 'th' && item.name_th) return item.name_th;
    return item.name;
  };

  const getItemDescription = (item: any) => {
    if (locale === 'my' && item.description_my) return item.description_my;
    if (locale === 'th' && item.description_th) return item.description_th;
    return item.description;
  };

  const getCategoryName = (cat: any) => {
    if (locale === 'my' && cat.name_my) return cat.name_my;
    if (locale === 'th' && cat.name_th) return cat.name_th;
    return cat.name;
  };

  // Filtered menu items calculation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        let nameToMatch = item.name;
        if (locale === 'my' && item.name_my) nameToMatch = item.name_my;
        if (locale === 'th' && item.name_th) nameToMatch = item.name_th;

        let descToMatch = item.description || '';
        if (locale === 'my' && item.description_my) descToMatch = item.description_my;
        if (locale === 'th' && item.description_th) descToMatch = item.description_th;

        const itemName = nameToMatch.toLowerCase();
        const itemDesc = descToMatch.toLowerCase();
        const matchesName = itemName.includes(query) || item.name.toLowerCase().includes(query);
        const matchesDesc = itemDesc.includes(query) || (item.description || '').toLowerCase().includes(query);
        const matchesIng = (item.ingredients || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      // Dietary / Tag Filter
      if (activeDietaryFilter !== 'all') {
        const itemTags = item.tags ? item.tags.split(',').map((t: string) => t.trim()) : [];
        if (!itemTags.includes(activeDietaryFilter)) return false;
      }

      // Availability Filter
      if (showOnlyAvailable && item.available === 0) {
        return false;
      }

      return true;
    });
  }, [items, selectedCategory, searchQuery, activeDietaryFilter, showOnlyAvailable, locale]);

  return (
    <section id="menu" className="py-20 bg-[var(--background-color)] relative min-h-screen">
      {/* Decorative Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--primary-color)]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--primary-color)] font-medium block mb-2">
            {t('menu.sectionTitle', 'Gastronomic Collections')}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--text-color)]">
            {t('nav.menu', 'Digital Menu')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text-color)] mt-3 font-light">
            {t('menu.sectionSubtitle', 'Scan through our curated menu offerings, filter by preferences, or search for signature dishes.')}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 rounded-2xl mb-8 border border-[var(--border-glow-color)] shadow-2xl flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Bar Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-[var(--primary-color)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('menu.searchPlaceholder', 'Search dishes, ingredients, wine pairs...')}
              className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-full py-2.5 pl-11 pr-10 text-xs sm:text-sm text-[var(--text-color)] placeholder-[var(--muted-text-color)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-text-color)] hover:text-[var(--text-color)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dietary Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            {dietaryOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveDietaryFilter(opt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  activeDietaryFilter === opt.id
                    ? 'bg-gold-gradient text-[var(--background-color)] font-bold border-[var(--primary-color)] shadow-md'
                    : 'bg-[var(--surface-color)] text-[var(--muted-text-color)] border-[var(--border-color)] hover:border-[var(--border-glow-color)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

        </div>

        {/* Sticky Category Horizontal Bar */}
        <div className="sticky top-[65px] z-30 py-3 bg-[var(--background-color)]/95 backdrop-blur-xl border-y border-[var(--border-glow-color)] mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border ${
                selectedCategory === 'all'
                  ? 'bg-[var(--primary-color)] text-[var(--background-color)] border-[var(--primary-color)] shadow-lg'
                  : 'bg-[var(--surface-color)] text-[var(--muted-text-color)] border-[var(--border-color)] hover:border-[var(--border-glow-color)]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>{t('menu.allCategories', 'All Categories')} ({items.length})</span>
            </button>

            {categories.map((cat) => {
              const IconComp = getCategoryIcon(cat.name);
              const itemCount = items.filter((i) => i.category_id === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border ${
                    isSelected
                      ? 'bg-gold-gradient text-[var(--background-color)] border-[var(--primary-color)] shadow-lg'
                      : 'bg-[var(--surface-color)] text-[var(--muted-text-color)] border-[var(--border-color)] hover:border-[var(--border-glow-color)] hover:text-[var(--text-color)]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{getCategoryName(cat)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-[var(--muted-text-color)]'}`}>
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Results Status */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl border border-[var(--border-color)] p-8 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-[var(--primary-color)] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-[var(--text-color)]">{t('menu.noDishesFound', 'No dishes found matching your search.')}</h3>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setActiveDietaryFilter('all');
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-[var(--surface-color)] border border-[var(--border-glow-color)] text-xs font-semibold text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-[var(--background-color)] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Food Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredItems.map((item) => {
              const isInOrder = orderItemIds.includes(item.id);
              const isAvailable = item.available === 1;
              const displayName = getItemName(item);
              const displayDesc = getItemDescription(item);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`glass-card rounded-2xl p-5 border transition-all duration-300 hover:border-[var(--border-glow-color)] cursor-pointer flex flex-col sm:flex-row gap-5 group relative ${
                    !isAvailable ? 'opacity-65' : ''
                  }`}
                >
                  {/* Dish Thumbnail */}
                  <div className="relative w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-[var(--surface-elevated)] shrink-0">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-color)]/80 via-transparent to-transparent" />

                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-red-400 border border-red-500/40 px-2.5 py-1 rounded-full uppercase tracking-wider bg-red-950/40">
                          {t('menu.soldOut', 'Sold Out')}
                        </span>
                      </div>
                    )}

                    {/* Spice Level Indicator */}
                    {item.spice_level > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-orange-500/40 flex items-center gap-0.5">
                        {Array.from({ length: item.spice_level }).map((_, i) => (
                          <Flame key={i} className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details Body */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Name & Price */}
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-serif text-lg font-bold text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors leading-snug">
                          {displayName}
                        </h3>
                        <span className="font-serif text-lg font-bold text-gold-gradient shrink-0">
                          ${item.price}
                        </span>
                      </div>

                      {/* Tag Badges */}
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.split(',').map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[9px] font-semibold text-[var(--primary-color)] bg-[var(--surface-color)] border border-[var(--border-glow-color)] px-2 py-0.5 rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-[var(--muted-text-color)] font-light leading-relaxed line-clamp-2">
                        {displayDesc}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex items-center justify-between border-t border-[var(--border-color)]">
                      <span className="text-[11px] text-[var(--muted-text-color)] italic">
                        {item.allergens ? `${t('menu.allergens', 'Allergens')}: ${item.allergens}` : 'Fresh Preparation'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAvailable) onAddToOrder(item);
                        }}
                        disabled={!isAvailable}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isInOrder
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                            : isAvailable
                            ? 'bg-[var(--surface-color)] hover:bg-[var(--primary-color)] text-[var(--primary-color)] hover:text-[var(--background-color)] border border-[var(--border-glow-color)]'
                            : 'bg-white/5 text-gray-500 border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {isInOrder ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> {t('menu.inOrder', 'In Order')}
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> {t('menu.addToOrder', 'Add to Order')}
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
