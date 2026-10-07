import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, CategoryId, SortOption, NavTab, DeliveryAddress, PaymentSettings, PaymentMethodType } from './types';
import { MENU_ITEMS, SAVED_ADDRESSES, INITIAL_ORDERS, DEFAULT_PAYMENT_SETTINGS } from './data/menuData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingView } from './components/OrderTrackingView';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import { AddressModal } from './components/AddressModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { AdminPortal } from './components/AdminPortal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { PaymentModal } from './components/PaymentModal';
import { Toast, ToastMessage } from './components/Toast';
import { formatCurrency } from './utils/formatters';
import { Search, ShoppingBag, Sparkles, X, ChevronRight, Lock } from 'lucide-react';

export default function App() {
  // Portal Mode: Separated Customer Portal vs Admin Back-Office Portal
  const [portalMode, setPortalMode] = useState<'customer' | 'admin'>('customer');
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  // Dynamic Menu Items (can be modified by Admin)
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS);

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavTab>('explore');
  const [activeAddress, setActiveAddress] = useState<DeliveryAddress>(SAVED_ADDRESSES[0]);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(SAVED_ADDRESSES);

  // Admin & Payment Settings State (Configurable in Dashboard Admin)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('yumyum_payment_settings');
      return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_SETTINGS;
    } catch {
      return DEFAULT_PAYMENT_SETTINGS;
    }
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Pending Payment state for QRIS/DANA payment confirmation
  const [pendingPayment, setPendingPayment] = useState<{
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethodType: PaymentMethodType;
    paymentMethodLabel: string;
    deliveryAddress: string;
  } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Cart & Order State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 3]);

  // Filters & Search State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('popular');
  const [showPromoOnly, setShowPromoOnly] = useState(false);
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  // Modals & Drawers
  const [selectedProductDetail, setSelectedProductDetail] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: String(Date.now()), message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 2800);
  };

  // Cart Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'placed' || o.status === 'cooking' || o.status === 'delivering'
  ).length;

  // Add to cart from card
  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartItems((prev) => {
      const existing = prev.find(
        (ci) => ci.menuItem.id === item.id && (!ci.spicyLevel || ci.spicyLevel === 0) && !ci.notes
      );
      if (existing) {
        return prev.map((ci) =>
          ci.id === existing.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          menuItem: item,
          quantity: 1,
          spicyLevel: item.spicyAvailable ? 1 : 0,
        },
      ];
    });
    showToast(`1x ${item.name} ditambahkan ke keranjang`);
  };

  // Add to cart from detailed modal
  const handleAddFromModal = (
    item: MenuItem,
    quantity: number,
    spicyLevel: number,
    notes: string
  ) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItem: item,
        quantity,
        spicyLevel,
        notes,
      },
    ]);
    showToast(`${quantity}x ${item.name} ditambahkan`);
  };

  // Update quantity in cart
  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.id === id) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove item from cart
  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== id));
  };

  // Clear all cart
  const handleClearCart = () => {
    setCartItems([]);
    showToast('Keranjang telah dikosongkan', 'info');
  };

  // Toggle favorite
  const handleToggleFavorite = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Dihapus dari menu favorit', 'info');
        return prev.filter((fid) => fid !== id);
      } else {
        showToast('Disimpan ke menu favorit! ❤️', 'success');
        return [...prev, id];
      }
    });
  };

  // Save payment settings from Admin Dashboard
  const handleSavePaymentSettings = (newSettings: PaymentSettings) => {
    setPaymentSettings(newSettings);
    try {
      localStorage.setItem('yumyum_payment_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  // Step 1: User clicks checkout in CartDrawer -> Opens Payment Modal (QRIS, DANA, Transfer, etc)
  const handleProceedToPayment = (orderData: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethodType: PaymentMethodType;
    paymentMethodLabel: string;
    deliveryAddress: string;
  }) => {
    setPendingPayment(orderData);
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Step 2: User confirms payment in Payment Modal -> Creates active order & goes to live Order Tracking
  const handleConfirmPayment = () => {
    if (!pendingPayment) return;
    handleCheckoutSuccess({
      items: pendingPayment.items,
      subtotal: pendingPayment.subtotal,
      deliveryFee: pendingPayment.deliveryFee,
      discount: pendingPayment.discount,
      total: pendingPayment.total,
      paymentMethod: pendingPayment.paymentMethodLabel,
      deliveryAddress: pendingPayment.deliveryAddress,
    });
    setIsPaymentModalOpen(false);
    setPendingPayment(null);
  };

  // Handle Checkout success
  const handleCheckoutSuccess = (orderData: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethod: string;
    deliveryAddress: string;
  }) => {
    const newOrder: Order = {
      id: `YUM-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Baru Saja',
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount,
      total: orderData.total,
      status: 'placed',
      estimatedDeliveryTime: '25-30 menit lagi',
      driverName: 'Pak Budi Santoso',
      driverPhone: '0813-8899-7711',
      driverVehicle: 'Honda Vario B 4921 SKL',
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setCurrentTab('orders');
    showToast('Pesanan berhasil dibuat! Driver segera memproses pesananmu 🚀', 'success');
  };

  // Advance simulated order status
  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (ord.status === 'placed') {
            showToast(`Pesanan ${ord.id}: Makanan sedang dimasak chef resto! 🍳`, 'info');
            return { ...ord, status: 'cooking' as const };
          }
          if (ord.status === 'cooking') {
            showToast(`Pesanan ${ord.id}: Driver sedang meluncur ke alamatmu! 🛵`, 'info');
            return { ...ord, status: 'delivering' as const };
          }
          if (ord.status === 'delivering') {
            showToast(`Pesanan ${ord.id}: Telah sampai di tujuan! Selamat menikmati 🎉`, 'success');
            return { ...ord, status: 'completed' as const };
          }
        }
        return ord;
      })
    );
  };

  // Reorder from history
  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      setCartItems((prev) => [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          menuItem: item.menuItem,
          quantity: item.quantity,
          spicyLevel: item.spicyLevel,
          notes: item.notes,
        },
      ]);
    });
    setIsCartOpen(true);
    showToast(`${order.items.length} item dimasukkan ke keranjang`, 'success');
  };

  // Admin handlers
  const handleUpdateMenuPrice = (itemId: number, newPrice: number) => {
    setMenuList((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
  };

  const handleToggleMenuAvailability = (itemId: number) => {
    setMenuList((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const isCurrentlyAvailable = !item.tags.includes('Habis');
          const nextTags = isCurrentlyAvailable
            ? [...item.tags, 'Habis']
            : item.tags.filter((t) => t !== 'Habis');
          return { ...item, tags: nextTags };
        }
        return item;
      })
    );
    showToast('Status ketersediaan menu diperbarui!', 'info');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Status pesanan ${orderId} berhasil diubah!`, 'success');
  };

  // Filtered & Sorted Menu
  const filteredProducts = useMemo(() => {
    let result = [...menuList];

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Promo Only
    if (showPromoOnly) {
      result = result.filter((item) => item.isPromo);
    }

    // Popular Only
    if (showPopularOnly) {
      result = result.filter((item) => item.isPopular);
    }

    // Sorting
    switch (selectedSort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'fastest':
        result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, showPromoOnly, showPopularOnly, selectedSort]);

  // If Admin Portal Mode is active, render full-screen Admin Back-Office
  if (portalMode === 'admin') {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <AdminPortal
          orders={orders}
          menuItems={menuList}
          paymentSettings={paymentSettings}
          onSavePaymentSettings={handleSavePaymentSettings}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateMenuPrice={handleUpdateMenuPrice}
          onToggleMenuAvailability={handleToggleMenuAvailability}
          onExitAdmin={() => setPortalMode('customer')}
          onShowToast={showToast}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col text-stone-900 pb-20 md:pb-10 selection:bg-amber-200">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        onOpenAdmin={() => setIsAdminAuthOpen(true)}
        activeAddress={activeAddress}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favoriteIds.length}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex-1 w-full">
        {/* VIEW 1: EXPLORE / HOME */}
        {currentTab === 'explore' && (
          <div className="space-y-6">
            {/* Hero Banner - Mobile & Desktop friendly */}
            <section className="relative rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-stone-950 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
              {/* Decorative radial blur */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-xs text-xs font-bold text-stone-900 mb-3 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                  <span>Gratis Ongkir Pesanan Pertama</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-950 leading-tight">
                  Lapar? <br className="sm:hidden" />
                  Pesan lezatnya <span className="underline decoration-stone-900/40">sekarang!</span> 🍔
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-stone-900/90 font-medium leading-relaxed max-w-md">
                  Ratusan menu favorit diantar cepat, higienis, dan masih hangat sampai ke depan pintumu.
                </p>

                {/* Mobile Search Bar Trigger inside Hero */}
                <div className="mt-4 md:hidden relative max-w-md">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari burger, pizza, boba..."
                    className="w-full pl-10 pr-9 py-2.5 text-xs rounded-full bg-white text-stone-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-stone-900 placeholder:text-stone-400 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Trust Points (Desktop & Tablet) */}
                <div className="hidden sm:flex items-center gap-4 mt-5 text-xs font-semibold text-stone-900/80">
                  <span>⚡ Rata-rata 20 Menit</span>
                  <span>·</span>
                  <span>⭐ Resto Pilihan Terbaik</span>
                  <span>·</span>
                  <span>💯 Jaminan Hangat</span>
                </div>
              </div>

              {/* Decorative culinary visual on right */}
              <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 text-8xl drop-shadow-xl select-none animate-in fade-in zoom-in-75 duration-300">
                🍔🍕🍗
              </div>
            </section>

            {/* Category & Filter Navigation */}
            <section aria-label="Kategori dan Penyortiran Menu">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedSort={selectedSort}
                onSelectSort={setSelectedSort}
                showPromoOnly={showPromoOnly}
                onTogglePromoOnly={() => setShowPromoOnly(!showPromoOnly)}
                showPopularOnly={showPopularOnly}
                onTogglePopularOnly={() => setShowPopularOnly(!showPopularOnly)}
                totalResults={filteredProducts.length}
              />
            </section>

            {/* Product Grid Section */}
            <section aria-label="Daftar Makanan">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="text-base font-bold text-stone-800">
                    Menu tidak ditemukan
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                    Tidak ada makanan yang cocok dengan kata kunci atau filter yang Anda pilih.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setShowPromoOnly(false);
                      setShowPopularOnly(false);
                    }}
                    className="px-5 py-2.5 rounded-full bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-xs"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {filteredProducts.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onSelect={setSelectedProductDetail}
                      onQuickAdd={handleQuickAdd}
                      isFavorite={favoriteIds.includes(item.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: FAVORITES */}
        {currentTab === 'favorites' && (
          <FavoritesView
            favoriteIds={favoriteIds}
            menuItems={menuList}
            onSelectItem={setSelectedProductDetail}
            onQuickAdd={handleQuickAdd}
            onToggleFavorite={handleToggleFavorite}
            onSwitchToExplore={() => setCurrentTab('explore')}
          />
        )}

        {/* VIEW 3: ORDERS */}
        {currentTab === 'orders' && (
          <OrderTrackingView
            orders={orders}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onReorder={handleReorder}
            onSwitchToExplore={() => setCurrentTab('explore')}
          />
        )}

        {/* VIEW 4: PROFILE */}
        {currentTab === 'profile' && (
          <ProfileView
            addresses={addresses}
            onOpenAddressModal={() => setIsAddressModalOpen(true)}
            onOpenAdmin={() => setIsAdminAuthOpen(true)}
            onApplyVoucherCode={(code) => {
              setIsCartOpen(true);
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Customer Portal Footer with Discrete Back-Office Portal Entry */}
      <footer className="mt-12 py-6 border-t border-stone-200/80 bg-white/60 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-900">YumYum Express</span>
            <span>· Portal Pemesanan Makanan Online</span>
          </div>
          <button
            onClick={() => setIsAdminAuthOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors font-medium"
          >
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Portal Khusus Kasir & Admin Resto</span>
          </button>
        </div>
      </footer>

      {/* FLOATING QUICK CART PILL ON SMARTPHONES (When browsing menu with items in cart) */}
      {cartCount > 0 && currentTab === 'explore' && !isCartOpen && (
        <div className="fixed bottom-20 left-4 right-4 z-30 max-w-md mx-auto md:hidden pointer-events-auto animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-stone-900 text-white rounded-2xl py-3 px-4 flex items-center justify-between shadow-2xl active:scale-98 transition-transform min-h-[48px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">
                  {cartCount} Menu di Keranjang
                </p>
                <p className="text-[11px] text-amber-300 font-semibold tabular-nums">
                  {formatCurrency(cartTotal)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold bg-amber-500 text-stone-950 px-3 py-1.5 rounded-xl">
              <span>Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddFromModal}
        isFavorite={selectedProductDetail ? favoriteIds.includes(selectedProductDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        activeAddress={activeAddress}
        onOpenAddressModal={() => {
          setIsCartOpen(false);
          setIsAddressModalOpen(true);
        }}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Address Switcher Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        activeAddressId={activeAddress.id}
        onSelectAddress={(addr) => {
          setActiveAddress(addr);
          showToast(`Alamat diubah ke: ${addr.label}`, 'info');
        }}
        onAddNewAddress={(newAddr) => {
          setAddresses((prev) => [newAddr, ...prev]);
        }}
      />

      {/* Admin Security PIN Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => setPortalMode('admin')}
        onShowToast={showToast}
      />

      {/* Admin Settings Modal (Dashboard Admin Pembayaran) */}
      <AdminSettingsModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={paymentSettings}
        onSaveSettings={handleSavePaymentSettings}
        onShowToast={showToast}
      />

      {/* Payment Confirmation Modal (QRIS / DANA / Transfer) */}
      {pendingPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          method={pendingPayment.paymentMethodType}
          totalAmount={pendingPayment.total}
          paymentSettings={paymentSettings}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {/* SMARTPHONE BOTTOM NAVIGATION BAR (Thumb Zone Anchor) */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        favoritesCount={favoriteIds.length}
        activeOrdersCount={activeOrdersCount}
      />
    </div>
  );
}
