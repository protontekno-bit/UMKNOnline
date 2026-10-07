import React, { useState } from 'react';
import { MenuItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { X, Plus, Minus, Flame, Star, Clock, Heart } from 'lucide-react';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, spicyLevel: number, notes: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState(1);
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    onAddToCart(item, quantity, item.spicyAvailable ? spicyLevel : 0, notes);
    onClose();
  };

  const spicyLabels = [
    { level: 0, title: 'Tidak Pedas', desc: 'Aman untuk anak & perut sensitif' },
    { level: 1, title: 'Sedang (Normal)', desc: 'Sensasi gurih pedas nikmat' },
    { level: 2, title: 'Pedas Nendang', desc: 'Cabai rawit ekstra mantap' },
    { level: 3, title: 'Ekstra Pedas Max 🔥', desc: 'Bagi pencinta pedas sejati' },
  ];

  const subtotal = item.price * quantity;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-food-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200"
    >
      {/* Backdrop click area */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl z-10 animate-in slide-in-from-bottom-6 duration-200">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-3 shrink-0" />

        {/* Header with Close and Favorite */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-stone-100 shrink-0">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Detail Menu
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="p-2 text-stone-400 hover:text-rose-500 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Simpan ke favorit"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Tutup detail menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 flex-1">
          {/* Visual Showcase Banner */}
          <div
            className={`w-full h-44 rounded-2xl bg-gradient-to-br ${item.bgGradient} border border-stone-200/60 flex items-center justify-center relative overflow-hidden`}
          >
            <span className="text-7xl drop-shadow-lg select-none">{item.foodEmoji}</span>
            <div className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{item.calories} Kalori</span>
            </div>
            {item.isPromo && (
              <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                Promo Spesial
              </div>
            )}
          </div>

          {/* Title and Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1 text-amber-700 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{item.rating} ({item.reviewCount} ulasan)</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{item.deliveryTime}</span>
              </span>
            </div>

            <h2 id="modal-food-title" className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1 leading-snug">
              {item.name}
            </h2>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-amber-600 tabular-nums">
                {formatCurrency(item.price)}
              </span>
              {item.originalPrice && (
                <span className="text-sm text-stone-400 line-through tabular-nums">
                  {formatCurrency(item.originalPrice)}
                </span>
              )}
            </div>

            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {item.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Spicy Level Options */}
          {item.spicyAvailable && (
            <div className="pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                  Pilih Tingkat Kepedasan
                </label>
                <span className="text-xs text-amber-700 font-semibold">Wajib</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {spicyLabels.map((spicy) => (
                  <button
                    key={spicy.level}
                    type="button"
                    onClick={() => setSpicyLevel(spicy.level)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      spicyLevel === spicy.level
                        ? 'border-amber-500 bg-amber-50/70 text-stone-900 font-semibold ring-1 ring-amber-500'
                        : 'border-stone-200 hover:border-stone-300 text-stone-600'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{spicy.title}</span>
                      {spicyLevel === spicy.level && <span className="text-amber-600 text-xs">✓</span>}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">{spicy.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Notes Input */}
          <div className="pt-3 border-t border-stone-100">
            <label htmlFor="notes-input" className="block text-xs font-bold text-stone-800 uppercase tracking-wide mb-1.5">
              Catatan Pesanan (Opsional)
            </label>
            <input
              id="notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jangan pakai bawang, saus dipisah, es sedikit..."
              maxLength={120}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Footer Actions (Quantity & Submit) - Pinned in Thumb Zone */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-stone-200 p-1">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-40 transition-colors min-h-[36px]"
              aria-label="Kurangi jumlah"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm font-bold tabular-nums text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors min-h-[36px]"
              aria-label="Tambah jumlah"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold text-sm flex items-center justify-between shadow-md transition-all min-h-[48px]"
          >
            <span>Tambah ke Keranjang</span>
            <span className="tabular-nums font-extrabold">{formatCurrency(subtotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
