import React from 'react';
import { ShoppingBag, MapPin, ChevronDown, Search, Heart, Clock, Settings } from 'lucide-react';
import { NavTab, DeliveryAddress } from '../types';
import { formatCurrency } from '../utils/formatters';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAddressModal: () => void;
  onOpenAdmin: () => void;
  activeAddress: DeliveryAddress;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoritesCount: number;
  activeOrdersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAddressModal,
  onOpenAdmin,
  activeAddress,
  searchQuery,
  onSearchChange,
  favoritesCount,
  activeOrdersCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('explore')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-black text-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                Y
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-stone-900 leading-none">
                  Yum<span className="text-amber-600">Yum</span>
                </span>
                <span className="text-[11px] font-medium text-stone-500 hidden sm:inline leading-tight mt-0.5">
                  Food Delivery Express
                </span>
              </div>
            </button>

            {/* Delivery Address Trigger - Mobile & Tablet */}
            <button
              onClick={onOpenAddressModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100/90 hover:bg-stone-200/80 transition-colors text-xs font-medium text-stone-700 max-w-[150px] sm:max-w-[220px] truncate"
              title="Ganti Alamat Pengiriman"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{activeAddress.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </button>
          </div>

          {/* Desktop Navigation Links (Zone 2) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-stone-600">
            <button
              onClick={() => onTabChange('explore')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === 'explore'
                  ? 'text-stone-900 bg-stone-100 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Menu & Resto
            </button>
            <button
              onClick={() => onTabChange('favorites')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'favorites'
                  ? 'text-stone-900 bg-stone-100 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              Favorit
              {favoritesCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-semibold">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('orders')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'orders'
                  ? 'text-stone-900 bg-stone-100 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-600" />
              Pesanan
              {activeOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => onTabChange('profile')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === 'profile'
                  ? 'text-stone-900 bg-stone-100 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Akun Saya
            </button>
          </nav>

          {/* Right Action: Search input on medium+, Admin button, Cart Trigger button */}
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block w-48 lg:w-60">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari menu favorit..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-100 border border-transparent focus:border-amber-400 focus:bg-white focus:outline-none transition-all placeholder:text-stone-400 font-medium"
              />
            </div>

            {/* Admin Resto Settings Trigger */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition-all min-h-[44px]"
              title="Dashboard Admin (Atur QRIS & DANA)"
              aria-label="Pengaturan Pembayaran Admin"
            >
              <Settings className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Admin Resto</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 active:scale-95 text-white transition-all shadow-sm min-h-[44px] min-w-[44px]"
              aria-label={`Keranjang belanja: ${cartCount} item`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold tabular-nums text-amber-100">
                {cartCount > 0 ? formatCurrency(cartTotal) : 'Keranjang'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
