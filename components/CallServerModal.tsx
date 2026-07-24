'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, GlassWater, Wine, CreditCard, Sparkles, X, Check, UtensilsCrossed } from 'lucide-react';

interface CallServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string | null;
}

export default function CallServerModal({ isOpen, onClose, tableNumber }: CallServerModalProps) {
  const [selectedRequest, setSelectedRequest] = useState<string>('Call Sommelier');
  const [tableInput, setTableInput] = useState<string>(tableNumber || '12');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const requestTypes = [
    { id: 'Call Sommelier', label: 'Call Sommelier (Wine Selection)', icon: Wine },
    { id: 'Request Water', label: 'Request Water (Still / Sparkling)', icon: GlassWater },
    { id: 'Request Bill', label: 'Request Bill & Payment Terminal', icon: CreditCard },
    { id: 'Clean Cutlery', label: 'Fresh Napkins / Cutlery', icon: UtensilsCrossed },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/server-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: tableInput,
          request_type: selectedRequest
        })
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#12100d] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#181510] border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center mx-auto">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#f8f5ee]">
              Request Server Assistance
            </h3>
            <p className="text-xs text-[#a39783]">
              Send an instant silent notification to the floor team or sommelier.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block mb-1">
                Your Table Number
              </label>
              <input
                type="text"
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                placeholder="e.g. Table 08"
                className="w-full bg-[#181510] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block">
                Type of Assistance
              </label>
              <div className="grid grid-cols-1 gap-2">
                {requestTypes.map((req) => {
                  const Icon = req.icon;
                  const isSelected = selectedRequest === req.id;
                  return (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() => setSelectedRequest(req.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-[#1f1b14] border-[#c5a059] text-[#c5a059]'
                          : 'bg-[#181510] border-white/5 text-[#d1c7b7] hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{req.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || sentSuccess}
              className={`w-full py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                sentSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0c0b09] hover:shadow-lg'
              }`}
            >
              {sentSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Assistance Dispatched!
                </>
              ) : submitting ? (
                'Dispatching Request...'
              ) : (
                'Send Server Alert'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
