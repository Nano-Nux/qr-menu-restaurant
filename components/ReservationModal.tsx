'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { useTranslation } from '@/lib/LanguageContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSpecialRequest?: string;
}

export default function ReservationModal({ isOpen, onClose, initialSpecialRequest }: ReservationModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-07-28');
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('Main Dining Salon');
  const [specialRequests, setSpecialRequests] = useState(initialSpecialRequest || '');
  const [prevInitialRequest, setPrevInitialRequest] = useState(initialSpecialRequest);

  if (initialSpecialRequest !== prevInitialRequest && isOpen) {
    setPrevInitialRequest(initialSpecialRequest);
    setSpecialRequests(initialSpecialRequest || '');
  }
  
  const [submitting, setSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<any | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const timeSlots = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
  const seatingAreas = ['Main Dining Salon', "Chef's Hearth Counter", 'Garden Terrace', 'Private Wine Cellar'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: name,
          email,
          phone,
          date,
          time,
          guests,
          seating_area: seatingArea,
          special_requests: specialRequests
        })
      });

      const data = await res.json();
      if (data.success) {
        // Generate QR code for ticket
        const ticketInfo = `RESERVATION #${data.id}\nGuest: ${name}\nDate: ${date} at ${time}\nGuests: ${guests} (${seatingArea})`;
        const qrUrl = await QRCode.toDataURL(ticketInfo, { width: 200, margin: 1 });
        setQrCodeDataUrl(qrUrl);

        setConfirmedReservation({
          id: data.id,
          name,
          date,
          time,
          guests,
          seatingArea
        });

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto py-10">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-[var(--background-color)] border border-[var(--border-glow-color)] rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {confirmedReservation ? (
            /* Reservation Success Confirmation Ticket */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-color)] border border-[var(--primary-color)] text-[var(--primary-color)] flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.25em] text-[var(--primary-color)] font-bold">
                  {t('reservationModal.success', 'Reservation Confirmed')}
                </span>
                <h3 className="font-serif text-3xl font-bold text-[var(--text-color)]">
                  We Await Your Presence
                </h3>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-glow-color)] text-left space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <span className="text-xs text-[var(--muted-text-color)]">Booking Reference</span>
                  <span className="text-xs font-bold text-[var(--primary-color)] font-mono">#{confirmedReservation.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--muted-text-color)] uppercase tracking-wider block">{t('reservationModal.name', 'Full Name')}</span>
                    <span className="font-semibold text-white">{confirmedReservation.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--muted-text-color)] uppercase tracking-wider block">{t('reservationModal.guests', 'Guests')}</span>
                    <span className="font-semibold text-white">{confirmedReservation.guests} Guests</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--muted-text-color)] uppercase tracking-wider block">{t('reservationModal.date', 'Date')} & {t('reservationModal.time', 'Time')}</span>
                    <span className="font-semibold text-white">{confirmedReservation.date} at {confirmedReservation.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--muted-text-color)] uppercase tracking-wider block">Seating Area</span>
                    <span className="font-semibold text-[var(--primary-color)]">{confirmedReservation.seatingArea}</span>
                  </div>
                </div>

                {qrCodeDataUrl && (
                  <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                    <img src={qrCodeDataUrl} alt="Reservation Pass QR" className="w-20 h-20 rounded-lg border border-[var(--border-color)]" />
                    <div className="text-right max-w-[180px]">
                      <span className="text-[10px] text-[var(--primary-color)] uppercase font-bold tracking-wider block">Digital Entry QR</span>
                      <span className="text-[11px] text-[var(--muted-text-color)]">Present this QR pass upon arrival.</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-full bg-gold-gradient text-[var(--background-color)] font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Done & Return to Site
              </button>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs text-[var(--primary-color)] font-bold uppercase tracking-wider">
                  Table Booking
                </span>
                <h3 className="font-serif text-2xl font-bold text-[var(--text-color)]">
                  {t('reservationModal.title', 'Reserve A Table')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                    {t('reservationModal.name', 'Full Name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Evelyn St. Claire"
                    className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary-color)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                    {t('reservationModal.phone', 'Phone Number')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (310) 882-9010"
                    className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary-color)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="evelyn@domain.com"
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary-color)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                    {t('reservationModal.date', 'Preferred Date')}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary-color)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                    {t('reservationModal.guests', 'Number of Guests')}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary-color)]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                  {t('reservationModal.time', 'Preferred Time')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        time === slot
                          ? 'bg-[var(--primary-color)] text-[var(--background-color)] border-[var(--primary-color)]'
                          : 'bg-[var(--surface-color)] text-[var(--muted-text-color)] border-[var(--border-color)] hover:border-[var(--border-glow-color)]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                  Seating Environment Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {seatingAreas.map((area) => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => setSeatingArea(area)}
                      className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                        seatingArea === area
                          ? 'bg-[var(--surface-elevated)] border-[var(--primary-color)] text-[var(--primary-color)]'
                          : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--muted-text-color)] hover:border-[var(--border-glow-color)]'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                  {t('reservationModal.notes', 'Special Occasion / Dietary Notes')}
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Celebrating Anniversary..."
                  className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary-color)]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gold-gradient text-[var(--background-color)] font-bold text-xs tracking-wider uppercase hover:shadow-xl transition-all"
              >
                {submitting ? t('reservationModal.submitting', 'Processing...') : t('reservationModal.submit', 'Confirm Reservation Request')}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
