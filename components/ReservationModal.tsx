'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, MapPin, Sparkles, X, CheckCircle, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-07-28');
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('Main Dining Salon');
  const [specialRequests, setSpecialRequests] = useState('');
  
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
        const ticketInfo = `AURELIA RESERVATION #${data.id}\nGuest: ${name}\nDate: ${date} at ${time}\nGuests: ${guests} (${seatingArea})`;
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
          className="relative w-full max-w-xl bg-[#12100d] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto no-scrollbar"
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
              <div className="w-16 h-16 rounded-full bg-[#181510] border border-[#c5a059] text-[#c5a059] flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-bold">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#f8f5ee]">
                  We Await Your Presence
                </h3>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="p-6 rounded-2xl bg-[#181510] border border-[#c5a059]/30 text-left space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-[#a39783]">Booking Reference</span>
                  <span className="text-xs font-bold text-[#c5a059] font-mono">#{confirmedReservation.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[#8c8273] uppercase tracking-wider block">Guest Name</span>
                    <span className="font-semibold text-white">{confirmedReservation.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8c8273] uppercase tracking-wider block">Party Size</span>
                    <span className="font-semibold text-white">{confirmedReservation.guests} Guests</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8c8273] uppercase tracking-wider block">Date & Time</span>
                    <span className="font-semibold text-white">{confirmedReservation.date} at {confirmedReservation.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8c8273] uppercase tracking-wider block">Seating Area</span>
                    <span className="font-semibold text-[#c5a059]">{confirmedReservation.seatingArea}</span>
                  </div>
                </div>

                {qrCodeDataUrl && (
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <img src={qrCodeDataUrl} alt="Reservation Pass QR" className="w-20 h-20 rounded-lg border border-white/10" />
                    <div className="text-right max-w-[180px]">
                      <span className="text-[10px] text-[#c5a059] uppercase font-bold tracking-wider block">Digital Entry QR</span>
                      <span className="text-[11px] text-[#a39783]">Present this QR pass upon arrival at reception.</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Done & Return to Site
              </button>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs text-[#c5a059] font-bold uppercase tracking-wider">
                  Table Booking
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#f8f5ee]">
                  Reserve A Table At Aurelia
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Evelyn St. Claire"
                    className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (310) 882-9010"
                    className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="evelyn@domain.com"
                  className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
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
                <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                  Dining Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        time === slot
                          ? 'bg-[#c5a059] text-[#0c0b09] border-[#c5a059]'
                          : 'bg-[#181510] text-[#a39783] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
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
                          ? 'bg-[#1f1b14] border-[#c5a059] text-[#c5a059]'
                          : 'bg-[#181510] border-white/5 text-[#a39783] hover:border-white/20'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                  Special Occasion or Dietary Notes
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Celebrating Anniversary, quiet booth preference..."
                  className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7b32] text-[#0c0b09] font-bold text-xs tracking-wider uppercase hover:shadow-xl transition-all"
              >
                {submitting ? 'Confirming Reservation...' : 'Confirm Reservation'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
