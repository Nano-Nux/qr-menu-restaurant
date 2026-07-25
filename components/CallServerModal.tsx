'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, GlassWater, Wine, CreditCard, X, Check, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from '@/lib/LanguageContext';

interface CallServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string | null;
}

export default function CallServerModal({ isOpen, onClose, tableNumber }: CallServerModalProps) {
  const { t } = useTranslation();
  const [selectedRequest, setSelectedRequest] = useState<string>('water');
  const [tableInput, setTableInput] = useState<string>(tableNumber || '12');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const requestTypes = [
    { id: 'water', label: t('callServerModal.water', 'Refill Water'), icon: GlassWater },
    { id: 'bill', label: t('callServerModal.bill', 'Request Bill / Payment'), icon: CreditCard },
    { id: 'wine', label: 'Call Sommelier (Wine)', icon: Wine },
    { id: 'custom', label: t('callServerModal.custom', 'Assistance / General Request'), icon: UtensilsCrossed },
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
          className="relative w-full max-w-md bg-[var(--background-color)] border border-[var(--border-glow-color)] rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-color)] border border-[var(--border-glow-color)] text-[var(--primary-color)] flex items-center justify-center mx-auto">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[var(--text-color)]">
              {t('callServerModal.title', 'Call Table Attendant')}
            </h3>
            <p className="text-xs text-[var(--muted-text-color)]">
              {t('callServerModal.subtitle', 'Select the service you need at Table')} {tableInput}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block mb-1">
                {t('orderDrawer.tableLabel', 'Table Number')}
              </label>
              <input
                type="text"
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                placeholder="e.g. Table 08"
                className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[var(--primary-color)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider block">
                Assistance Type
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
                          ? 'bg-[var(--surface-elevated)] border-[var(--primary-color)] text-[var(--primary-color)]'
                          : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--text-color)] hover:border-[var(--border-glow-color)]'
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
                  : 'bg-gold-gradient text-[var(--background-color)] hover:shadow-lg'
              }`}
            >
              {sentSuccess ? (
                <>
                  <Check className="w-4 h-4" /> {t('callServerModal.success', 'Server notified!')}
                </>
              ) : submitting ? (
                t('callServerModal.calling', 'Notifying Staff...')
              ) : (
                t('callServerModal.sendCall', 'Call Attendant Now')
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
