import React from 'react';
import { MenuItem } from '../types';
import { ProductCard } from './ProductCard';
import { Heart } from 'lucide-react';

interface FavoritesViewProps {
  favoriteIds: number[];
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  onSwitchToExplore: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  menuItems,
  onSelectItem,
  onQuickAdd,
  onToggleFavorite,
  onSwitchToExplore,
}) => {
  const favoriteItems = menuItems.filter((item) => favoriteIds.includes(item.id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Menu Favorit Saya
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Makanan dan minuman kesukaanmu yang tersimpan rapi untuk dipesan ulang dengan cepat.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-100">
          {favoriteItems.length} Tersimpan
        </span>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-800">
            Belum ada menu favorit
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Ketuk ikon hati pada menu makanan favoritmu untuk menyimpannya di sini.
          </p>
          <button
            onClick={onSwitchToExplore}
            className="px-5 py-2.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            Jelajahi Menu Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {favoriteItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onQuickAdd={onQuickAdd}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
