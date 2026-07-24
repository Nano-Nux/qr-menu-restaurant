'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Maximize2, Sparkles, Utensils, Wine, Eye } from 'lucide-react';

interface GallerySectionProps {
  gallery: any[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const categories = ['All', 'Culinary', 'Atmosphere', 'Wine & Bar'];

  const filteredGallery = activeCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-[#0c0b09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-[#c5a059] font-medium block mb-2">
            Visual Ambiance
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5ee]">
            Gallery & Atmosphere
          </h2>
          <p className="text-xs sm:text-sm text-[#b8ad9a] mt-3 font-light">
            A glimpse into our candlelit dining salons, open-flame culinary hearth, and private wine cellars.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border ${
                activeCategory === cat
                  ? 'bg-[#c5a059] text-[#0c0b09] border-[#c5a059] shadow-lg'
                  : 'bg-[#181510] text-[#b8ad9a] border-white/10 hover:border-[#c5a059]/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#c5a059]/50 transition-all duration-500 shadow-xl"
            >
              <img
                src={item.image}
                alt={item.caption || 'Aurelia Ambiance'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between z-10">
                <div>
                  <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <p className="font-serif text-base font-bold text-[#f8f5ee] line-clamp-1">
                    {item.caption || 'Aurelia Moment'}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-[#0c0b09]/80 border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setSelectedImage(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-[#12100d] rounded-3xl overflow-hidden border border-[#c5a059]/40 z-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-[#0c0b09]/80 text-white hover:bg-[#181510] border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.caption}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-[#0c0b09] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#c5a059] font-bold uppercase tracking-wider">
                    {selectedImage.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#f8f5ee] mt-1">
                    {selectedImage.caption}
                  </h3>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
