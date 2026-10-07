import React from 'react';
import { CategoryId, SortOption } from '../types';
import { CATEGORIES } from '../data/menuData';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  showPromoOnly: boolean;
  onTogglePromoOnly: () => void;
  showPopularOnly: boolean;
  onTogglePopularOnly: () => void;
  totalResults: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  showPromoOnly,
  onTogglePromoOnly,
  showPopularOnly,
  onTogglePopularOnly,
  totalResults,
}) => {
  return (
    <div className="space-y-3">
      {/* Horizontal Category Strip with touch scrolling */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all select-none min-h-[44px] ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-sm font-bold scale-[1.02]'
                  : 'bg-white/90 text-stone-600 hover:text-stone-900 border border-stone-200/70 hover:bg-stone-50'
              }`}
            >
              <span className="text-base sm:text-lg leading-none">{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1">
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Promo Toggle */}
          <button
            onClick={onTogglePromoOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
              showPromoOnly
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
            }`}
          >
            <span>🏷️ Diskon Promo</span>
          </button>

          {/* Quick Popular Toggle */}
          <button
            onClick={onTogglePopularOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
              showPopularOnly
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
            }`}
          >
            <span>🔥 Paling Laris</span>
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
              aria-label="Urutkan menu berdasarkan"
              className="pl-8 pr-6 py-1.5 text-xs font-medium rounded-full bg-white border border-stone-200 text-stone-700 hover:border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer min-h-[36px] appearance-none"
            >
              <option value="popular">Terpopuler</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="price-asc">Harga: Murah ke Mahal</option>
              <option value="price-desc">Harga: Mahal ke Murah</option>
              <option value="fastest">Pengiriman Tercepat</option>
            </select>
          </div>
          <span className="text-xs text-stone-400 hidden sm:inline whitespace-nowrap">
            ({totalResults} menu)
          </span>
        </div>
      </div>
    </div>
  );
};
