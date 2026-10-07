import React from 'react';
import { MenuItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Plus, Heart, Star, Flame, Clock } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onSelect,
  onQuickAdd,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <article
      onClick={() => onSelect(item)}
      className="group bg-white rounded-3xl p-3.5 sm:p-4 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-amber-300 hover:shadow-[0_8px_24px_rgba(245,158,11,0.08)] transition-all cursor-pointer flex flex-col justify-between select-none relative"
    >
      <div>
        {/* Visual Showcase Container with Appetizing Visual Backdrop */}
        <div
          className={`relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${item.bgGradient} border border-stone-200/50 flex flex-col items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
        >
          {/* Decorative food illustration / emoji display */}
          <div className="text-5xl sm:text-6xl drop-shadow-md select-none transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
            {item.foodEmoji}
          </div>

          {/* Calorie Indicator tag */}
          <div className="absolute bottom-2 left-2 text-[11px] font-semibold text-stone-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Flame className="w-3 h-3 text-orange-500" />
            <span>{item.calories} kkal</span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => onToggleFavorite(item.id, e)}
            className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all min-h-[44px] min-w-[44px] -m-1 z-10 ${
              isFavorite
                ? 'text-rose-500 bg-white shadow-sm'
                : 'text-stone-400 hover:text-rose-500 bg-white/80 hover:bg-white backdrop-blur-xs'
            }`}
            aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isFavorite ? 'fill-rose-500 scale-110' : ''
              }`}
            />
          </button>

          {/* Promo or Popular indicator ribbon */}
          {item.isPromo && (
            <div className="absolute top-2 left-2 text-[10px] font-extrabold uppercase tracking-wide bg-rose-500 text-white px-2 py-0.5 rounded-md shadow-xs">
              Promo
            </div>
          )}
        </div>

        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1 text-amber-700 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{item.rating}</span>
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="flex items-center gap-1 text-stone-600">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{item.deliveryTime}</span>
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{item.distance}</span>
        </div>

        {/* Title */}
        <h3 className="mt-1.5 font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
          {item.name}
        </h3>

        {/* Subtle description preview */}
        <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed font-normal">
          {item.description}
        </p>
      </div>

      {/* Pricing and Quick Add Bar */}
      <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-extrabold text-stone-950 tabular-nums leading-none">
              {formatCurrency(item.price)}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatCurrency(item.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 font-medium">
            {item.tags[0]}
          </span>
        </div>

        {/* Add Button with generous 44x44px hitbox */}
        <button
          onClick={(e) => onQuickAdd(item, e)}
          className="w-10 h-10 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-90 text-stone-950 font-bold flex items-center justify-center transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label={`Tambah ${item.name} ke keranjang`}
          title="Tambah ke keranjang"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </article>
  );
};
