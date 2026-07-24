'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, MessageSquare, PenTool, X, Send, Sparkles } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: any[];
  onReviewSubmitted: () => void;
}

export default function ReviewsSection({ reviews, onReviewSubmitted }: ReviewsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          rating,
          comment
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setModalOpen(false);
          setName('');
          setComment('');
          setRating(5);
          onReviewSubmitted();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-[#0e0c0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-[#c5a059] font-medium block mb-2">
              Diner Endorsements
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5ee]">
              Guest Experiences
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#f8f5ee]">4.9 / 5.0</span>
              <span className="text-xs text-[#a39783]">(380+ Verified Diners)</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 md:mt-0 px-6 py-3 rounded-full bg-[#1c1813] hover:bg-[#c5a059] text-[#c5a059] hover:text-[#0c0b09] border border-[#c5a059]/40 font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2"
          >
            <PenTool className="w-4 h-4" /> Write a Review
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-[#c5a059]/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8c8273]">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#d1c7b7] font-light leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* User Avatar & Name */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                <img
                  src={rev.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"}
                  alt={rev.customer_name}
                  className="w-10 h-10 rounded-full object-cover border border-[#c5a059]/40"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#f8f5ee]">
                    {rev.customer_name}
                  </h4>
                  {rev.verified === 1 && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified Diner
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#12100d] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs text-[#c5a059] font-bold uppercase tracking-wider">
                  Guest Feedback
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#f8f5ee]">
                  Share Your Culinary Review
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Harrison Vance"
                    className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                    Overall Experience Rating
                  </label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 transition-transform hover:scale-125"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                    Your Dining Comment & Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the dishes, presentation, wine pairings, and table QR menu experience..."
                    className="w-full bg-[#181510] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || success}
                  className={`w-full py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    success
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] hover:shadow-lg'
                  }`}
                >
                  {success ? (
                    'Review Published!'
                  ) : submitting ? (
                    'Publishing Review...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Review
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
