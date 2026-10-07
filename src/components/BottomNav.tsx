import React from 'react';
import { Compass, Heart, Clock, User } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  favoritesCount: number;
  activeOrdersCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  favoritesCount,
  activeOrdersCount,
}) => {
  const tabs = [
    {
      id: 'explore' as NavTab,
      label: 'Menu',
      icon: Compass,
    },
    {
      id: 'favorites' as NavTab,
      label: 'Favorit',
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      id: 'orders' as NavTab,
      label: 'Pesanan',
      icon: Clock,
      hasDot: activeOrdersCount > 0,
    },
    {
      id: 'profile' as NavTab,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Navigasi Utama Smartphone"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 pb-safe md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 transition-all relative group select-none active:scale-95 ${
                isActive ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
                {tab.hasDot && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-all ${
                  isActive ? 'font-bold text-amber-700' : 'text-stone-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-4 h-1 bg-amber-500 rounded-full mt-0.5 animate-in fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
