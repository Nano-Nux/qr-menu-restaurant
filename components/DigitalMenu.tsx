'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Sparkles, Plus, Check, Info, Flame, AlertCircle, Wine, X, Utensils, Wheat, Fish, Cake, UtensilsCrossed } from 'lucide-react';

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

  // Dietary filter options
  const dietaryOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'Vegetarian', label: 'Vegetarian' },
    { id: 'Vegan', label: 'Vegan' },
    { id: 'Gluten-Free', label: 'Gluten-Free' },
    { id: 'Chef Choice', label: 'Chef Choice' },
    { id: 'Bestseller', label: 'Bestseller' },
  ];

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
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesIng = item.ingredients?.toLowerCase().includes(query);
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
  }, [items, selectedCategory, searchQuery, activeDietaryFilter, showOnlyAvailable]);

  return (
    <section id="menu" className="py-20 bg-[#0c0b09] relative min-h-screen">
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#c5a059]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.35em] text-[#c5a059] font-medium block mb-2">
            Interactive Digital Gastronomy
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5ee]">
            The Digital QR Menu
          </h2>
          <p className="text-xs sm:text-sm text-[#b8ad9a] mt-3 font-light">
            Scan from your table to explore real-time availability, full ingredient notes, wine pairings, and dietary considerations.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 rounded-2xl mb-8 border border-[#c5a059]/20 shadow-2xl flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Bar Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-[#c5a059] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, caviars, truffles..."
              className="w-full bg-[#181510] border border-white/10 rounded-full py-2.5 pl-11 pr-10 text-xs sm:text-sm text-[#f8f5ee] placeholder-[#8c8273] focus:outline-none focus:border-[#c5a059] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8273] hover:text-white"
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
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold border-[#c5a059] shadow-md'
                    : 'bg-[#181510] text-[#b8ad9a] border-white/10 hover:border-[#c5a059]/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

        </div>

        {/* Sticky Category Horizontal Bar */}
        <div className="sticky top-[65px] z-30 py-3 bg-[#0c0b09]/95 backdrop-blur-xl border-y border-[#c5a059]/20 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border ${
                selectedCategory === 'all'
                  ? 'bg-[#c5a059] text-[#0c0b09] border-[#c5a059] shadow-lg shadow-[#c5a059]/20'
                  : 'bg-[#181510] text-[#d1c7b7] border-white/10 hover:border-[#c5a059]/50'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Full Menu ({items.length})</span>
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
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#a88238] text-[#0c0b09] border-[#c5a059] shadow-lg shadow-[#c5a059]/25'
                      : 'bg-[#181510] text-[#d1c7b7] border-white/10 hover:border-[#c5a059]/50 hover:text-[#f8f5ee]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[#0c0b09]/20 text-[#0c0b09]' : 'bg-white/10 text-[#a39783]'}`}>
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Results Status */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl border border-white/10 p-8 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-[#c5a059] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-[#f8f5ee]">No Dishes Found</h3>
            <p className="text-xs text-[#a39783] mt-2 mb-6">
              We couldn't find any dishes matching your current filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setActiveDietaryFilter('all');
              }}
              className="px-6 py-2.5 rounded-full bg-[#1c1813] border border-[#c5a059]/40 text-xs font-semibold text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0b09] transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Food Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredItems.map((item) => {
              const isInOrder = orderItemIds.includes(item.id);
              const isAvailable = item.available === 1;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`glass-card rounded-2xl p-5 border transition-all duration-300 hover:border-[#c5a059]/50 cursor-pointer flex flex-col sm:flex-row gap-5 group relative ${
                    !isAvailable ? 'opacity-65' : ''
                  }`}
                >
                  {/* Dish Thumbnail */}
                  <div className="relative w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-[#181510] shrink-0">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/80 via-transparent to-transparent" />

                    {!isAvailable && (
                      <div className="absolute inset-0 bg-[#0c0b09]/80 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-red-400 border border-red-500/40 px-2.5 py-1 rounded-full uppercase tracking-wider bg-red-950/40">
                          Sold Out
                        </span>
                      </div>
                    )}

                    {/* Spice Level Indicator */}
                    {item.spice_level > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#0c0b09]/80 backdrop-blur-md border border-orange-500/40 flex items-center gap-0.5">
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
                        <h3 className="font-serif text-lg font-bold text-[#f8f5ee] group-hover:text-[#c5a059] transition-colors leading-snug">
                          {item.name}
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
                              className="text-[9px] font-semibold text-[#c5a059] bg-[#1a1712] border border-[#c5a059]/20 px-2 py-0.5 rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-[#a39783] font-light leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                      <span className="text-[11px] text-[#8c8273] italic">
                        {item.allergens ? `Allergens: ${item.allergens}` : 'Seasonal Harvest'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAvailable) onAddToOrder(item);
                        }}
                        disabled={!isAvailable}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isInOrder
                            ? 'bg-[#182618] text-emerald-400 border border-emerald-500/40'
                            : isAvailable
                            ? 'bg-[#1c1813] hover:bg-[#c5a059] text-[#c5a059] hover:text-[#0c0b09] border border-[#c5a059]/40'
                            : 'bg-white/5 text-gray-500 border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {isInOrder ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Add to Order
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
