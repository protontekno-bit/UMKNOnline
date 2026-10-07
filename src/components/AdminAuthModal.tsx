import React, { useState } from 'react';
import { X, Lock, KeyRound, ArrowRight } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Owner/Staff PIN is 1234
    if (pin === '1234' || pin === 'admin') {
      onSuccess();
      onClose();
      setPin('');
      setError(false);
      onShowToast('Berhasil masuk ke Portal Admin Resto', 'success');
    } else {
      setError(true);
      onShowToast('PIN salah! Gunakan PIN default: 1234', 'error');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 border border-stone-200 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <h3 id="auth-modal-title" className="text-sm font-extrabold text-stone-900">
              Autentikasi Staf / Pemilik Resto
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Portal Admin terpisah dari halaman pembeli untuk mengelola pesanan masuk, harga menu, dan QRIS/DANA.
          </p>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Masukkan PIN Kasir / Pemilik:
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="PIN Keamanan (Default: 1234)"
                className={`w-full px-4 py-2.5 text-center text-lg tracking-widest font-mono font-bold rounded-xl border focus:outline-none transition-all ${
                  error
                    ? 'border-rose-500 ring-2 ring-rose-200'
                    : 'border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                }`}
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-amber-800 font-medium mt-1 text-center bg-amber-50 py-1 rounded-lg">
              🔑 PIN Default Demo: <strong>1234</strong>
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Buka Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
