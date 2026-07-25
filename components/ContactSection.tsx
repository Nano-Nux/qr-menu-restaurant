'use client';

import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Compass, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

interface ContactSectionProps {
  restaurantInfo: any;
}

export default function ContactSection({ restaurantInfo }: ContactSectionProps) {
  const { t } = useTranslation();
  const whatsappNumber = restaurantInfo?.whatsapp ? restaurantInfo.whatsapp.replace(/\D/g, '') : '447946091200';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Aurelia Fine Dining, I would like to inquire about table availability.')}`;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit message');
      }

      setSubmitSuccess(data.id);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[var(--background-color)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--primary-color)] font-medium block mb-2">
            Sanctuary & Coordinates
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--text-color)]">
            {t('contact.title', 'Contact & Location')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text-color)] mt-3 font-light">
            We look forward to welcoming you to our Mayfair dining salon and cellar.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Box */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-color)] space-y-3">
              <div className="flex items-center gap-3 text-[var(--primary-color)]">
                <MapPin className="w-5 h-5" />
                <h4 className="font-serif text-lg font-bold text-[var(--text-color)]">{t('contact.address', 'Address')}</h4>
              </div>
              <p className="text-xs text-[var(--muted-text-color)] font-light leading-relaxed pl-8">
                {restaurantInfo?.address || '450 Grand Avenue, Mayfair, London W1K 2HP'}
              </p>
            </div>

            {/* Hours Box */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-color)] space-y-3">
              <div className="flex items-center gap-3 text-[var(--primary-color)]">
                <Clock className="w-5 h-5" />
                <h4 className="font-serif text-lg font-bold text-[var(--text-color)]">{t('contact.hours', 'Opening Hours')}</h4>
              </div>
              <p className="text-xs text-[var(--muted-text-color)] font-light leading-relaxed pl-8">
                {restaurantInfo?.opening_hours || 'Mon - Sun: 17:30 - 23:30 | Weekend Lunch: 12:00 - 15:30'}
              </p>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${restaurantInfo?.phone || '+442079460912'}`}
                className="p-4 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-[var(--border-glow-color)] transition-all flex items-center gap-3"
              >
                <Phone className="w-4 h-4 text-[var(--primary-color)]" />
                <div>
                  <span className="text-[10px] text-[var(--muted-text-color)] uppercase tracking-wider block">{t('contact.phone', 'Phone')}</span>
                  <span className="text-xs font-bold text-[var(--text-color)]">{restaurantInfo?.phone || '+44 20 7946 0912'}</span>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#122216] border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center gap-3 text-emerald-400"
              >
                <MessageSquare className="w-4 h-4" />
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">WhatsApp VIP</span>
                  <span className="text-xs font-bold text-white">{t('contact.whatsapp', 'Direct WhatsApp')}</span>
                </div>
              </a>
            </div>

          </div>

          {/* Interactive Styled Map Card */}
          <div className="lg:col-span-7 glass-card rounded-3xl border border-[var(--border-glow-color)] h-[420px] lg:h-[450px] relative overflow-hidden group flex flex-col justify-between">
            {restaurantInfo?.map_embed_url ? (
              <div className="w-full h-full relative">
                <iframe
                  src={restaurantInfo.map_embed_url}
                  className="w-full h-full border-0 filter grayscale invert contrast-[1.2] brightness-[0.7]"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aurelia Location Map"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--background-color)]/90 border border-[var(--border-glow-color)] text-[var(--primary-color)] backdrop-blur-md">
                    Live Map
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 z-10">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(restaurantInfo?.address || 'Mayfair London')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-[var(--border-color)] text-[var(--primary-color)] font-bold text-[10px] tracking-wider uppercase hover:bg-[var(--primary-color)] hover:text-black transition-all flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{t('contact.getDirections', 'Get Directions')}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1000&auto=format&fit=crop&q=80')] bg-cover bg-center filter brightness-[0.35] contrast-[1.1] group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-color)] via-transparent to-[var(--background-color)]" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--background-color)]/80 border border-[var(--border-glow-color)] text-[var(--primary-color)]">
                    Coordinates
                  </span>
                  <span className="text-xs text-[var(--muted-text-color)] font-mono">
                    {restaurantInfo?.map_latitude && restaurantInfo?.map_longitude 
                      ? `${restaurantInfo.map_latitude}° N, ${restaurantInfo.map_longitude}° W`
                      : '51.5074° N, 0.1278° W'}
                  </span>
                </div>

                <div className="relative z-10 text-center py-12 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[var(--surface-color)] border-2 border-[var(--primary-color)] text-[var(--primary-color)] flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                    <Compass className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[var(--text-color)]">
                    {restaurantInfo?.name || 'Aurelia'}
                  </h3>
                  <p className="text-xs text-[var(--muted-text-color)] max-w-sm mx-auto font-light">
                    {restaurantInfo?.address || '450 Grand Avenue, Mayfair, London'}
                  </p>
                </div>

                <div className="relative z-10 pt-4 flex justify-center">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(restaurantInfo?.address || 'Mayfair London')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-full bg-gold-gradient text-[var(--background-color)] font-bold text-xs tracking-wider uppercase hover:shadow-lg transition-all"
                  >
                    {t('contact.getDirections', 'Get Directions')}
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Customer Support & Concierge Inquiry Form */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 border border-[var(--border-color)] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-color)]/5 rounded-full filter blur-3xl -z-10" />
            
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--primary-color)] font-mono block mb-2">
                Support Concierge
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-color)] mb-3">
                Send a Support Message or Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted-text-color)] font-light max-w-2xl mb-8 leading-relaxed">
                Whether you have dietary queries, custom menu arrangements, private salon requests, or general reservation questions, our guest relations officers will respond directly.
              </p>

              {submitSuccess ? (
                <div className="bg-[#122216]/50 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">Inquiry Received Successfully</h4>
                    <p className="text-xs text-emerald-300/80 mt-1">
                      Your support ticket has been registered. Ticket Ref ID: <span className="font-mono text-[var(--primary-color)] font-bold">{submitSuccess}</span>
                    </p>
                  </div>
                  <p className="text-xs text-[var(--muted-text-color)] max-w-md mx-auto font-light leading-relaxed">
                    Our team has been notified and will reply directly to your email address shortly. You can check back or view responses via your administrator dashboard.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-[var(--primary-color)] uppercase tracking-wider transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 flex items-center gap-3 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-text-color)] block mb-1.5">
                        Your Full Name <span className="text-[var(--primary-color)]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] focus:border-[var(--border-glow-color)] transition-all rounded-xl px-4 py-2.5 text-xs text-white"
                        placeholder="e.g. Elizabeth Bennet"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-text-color)] block mb-1.5">
                        Email Address <span className="text-[var(--primary-color)]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] focus:border-[var(--border-glow-color)] transition-all rounded-xl px-4 py-2.5 text-xs text-white"
                        placeholder="e.g. elizabeth@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-text-color)] block mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] focus:border-[var(--border-glow-color)] transition-all rounded-xl px-4 py-2.5 text-xs text-white"
                        placeholder="e.g. +44 20 7946 0912"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-text-color)] block mb-1.5">
                        Inquiry Topic <span className="text-[var(--primary-color)]">*</span>
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] focus:border-[var(--border-glow-color)] transition-all rounded-xl px-4 py-2.5 text-xs text-white appearance-none"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Dietary Arrangements">Dietary Arrangements</option>
                        <option value="Private Salon Booking">Private Salon Booking</option>
                        <option value="Special Occasion / Proposal">Special Occasion / Proposal</option>
                        <option value="Feedback / Complaints">Feedback & Guest Relations</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-text-color)] block mb-1.5">
                      Your Message <span className="text-[var(--primary-color)]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] focus:border-[var(--border-glow-color)] transition-all rounded-xl px-4 py-2.5 text-xs text-white resize-none"
                      placeholder="Type your message or special support requests here..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-gold-gradient text-[var(--background-color)] font-bold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Support Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

