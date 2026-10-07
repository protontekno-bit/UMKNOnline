import React, { useState } from 'react';
import { CartItem, DeliveryAddress, PromoVoucher, PaymentMethodType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { X, Plus, Minus, Trash2, Tag, ChevronRight, CheckCircle2, MapPin, CreditCard, Wallet, Banknote, QrCode } from 'lucide-react';
import { VOUCHERS } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  activeAddress: DeliveryAddress;
  onOpenAddressModal: () => void;
  onProceedToPayment: (orderData: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethodType: PaymentMethodType;
    paymentMethodLabel: string;
    deliveryAddress: string;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  activeAddress,
  onOpenAddressModal,
  onProceedToPayment,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<PromoVoucher | null>(null);
  const [promoError, setPromoError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 10000 : 0;

  // Discount calculation
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountPercent) {
      discount = Math.round((subtotal * appliedVoucher.discountPercent) / 100);
    } else if (appliedVoucher.discountAmount) {
      discount = appliedVoucher.discountAmount;
    }
  }
  // Discount can't exceed subtotal
  discount = Math.min(discount, subtotal);
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyVoucher = (voucher: PromoVoucher) => {
    if (subtotal < voucher.minSpend) {
      setPromoError(`Minimal belanja ${formatCurrency(voucher.minSpend)} untuk kupon ini`);
      return;
    }
    setAppliedVoucher(voucher);
    setPromoError('');
    setPromoCodeInput(voucher.code);
  };

  const handleManualVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    const found = VOUCHERS.find((v) => v.code === code);
    if (!found) {
      setPromoError('Kode promo tidak valid atau telah kedaluwarsa');
      return;
    }

    if (subtotal < found.minSpend) {
      setPromoError(`Minimal belanja ${formatCurrency(found.minSpend)} untuk kupon ini`);
      return;
    }

    setAppliedVoucher(found);
    setPromoError('');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const paymentLabels: Record<PaymentMethodType, string> = {
        qris: 'QRIS Nasional (Semua Bank & E-Wallet)',
        dana: 'DANA Dompet Digital',
        transfer: 'Transfer Bank / Virtual Account',
        cod: 'Bayar Tunai di Tempat (COD)',
      };

      onProceedToPayment({
        items: cartItems,
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethodType: selectedPayment,
        paymentMethodLabel: paymentLabels[selectedPayment],
        deliveryAddress: `${activeAddress.label} - ${activeAddress.address}`,
      });
      onClose();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-md h-[92vh] sm:h-full bg-white rounded-t-3xl sm:rounded-none flex flex-col overflow-hidden shadow-2xl z-10 animate-in slide-in-from-bottom-6 sm:slide-in-from-right duration-200">
        {/* Mobile handle */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-3 shrink-0" />

        {/* Top Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2">
            <h2 id="cart-drawer-heading" className="text-base sm:text-lg font-bold text-stone-900">
              Keranjang Belanja
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} item
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Hapus Semua
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Cart Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 flex-1">
          {/* Delivery Address Banner */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-stone-900">
                  Kirim ke: {activeAddress.label}
                </p>
                <p className="text-[11px] text-stone-500 line-clamp-1 leading-tight mt-0.5">
                  {activeAddress.address}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAddressModal}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline shrink-0 whitespace-nowrap"
            >
              Ubah
            </button>
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="text-5xl">🛍️</div>
              <h3 className="font-bold text-stone-800 text-base">Keranjangmu masih kosong</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Yuk pilih sajian lezat dari menu YumYum sekarang dan nikmati promo menariknya!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-xs hover:bg-amber-600 transition-colors"
              >
                Jelajahi Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Daftar Makanan
              </h3>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-stone-200/80 bg-white flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.menuItem.bgGradient} flex items-center justify-center text-2xl shrink-0 border border-stone-200/60`}
                    >
                      {item.menuItem.foodEmoji}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate leading-snug">
                        {item.menuItem.name}
                      </h4>
                      <p className="text-xs font-bold text-amber-700 tabular-nums">
                        {formatCurrency(item.menuItem.price)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-stone-500">
                        {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
                          <span className="text-orange-600 font-semibold">
                            Pedas Lv.{item.spicyLevel}
                          </span>
                        )}
                        {item.notes && (
                          <span className="truncate max-w-[120px] text-stone-400">
                            • {item.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center bg-stone-100 rounded-xl p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold tabular-nums text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                      aria-label="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <>
              {/* Promo & Voucher Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    Voucher Diskon
                  </span>
                  {appliedVoucher && (
                    <button
                      onClick={() => {
                        setAppliedVoucher(null);
                        setPromoCodeInput('');
                      }}
                      className="text-[11px] text-rose-500 font-medium hover:underline"
                    >
                      Lepas Kupon
                    </button>
                  )}
                </div>

                <form onSubmit={handleManualVoucher} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode promo (misal: YUMMY20)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shrink-0"
                  >
                    Terapkan
                  </button>
                </form>

                {promoError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{promoError}</p>
                )}

                {/* Available Quick Vouchers */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mt-2 pt-1 pb-1">
                  {VOUCHERS.map((v) => {
                    const isSelected = appliedVoucher?.code === v.code;
                    return (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleApplyVoucher(v)}
                        className={`p-2 rounded-xl text-left border shrink-0 text-xs transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <div className="font-mono font-bold text-amber-700 flex items-center gap-1">
                          <span>{v.code}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                          {v.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <span className="text-xs font-bold text-stone-800 block mb-2">
                  Metode Pembayaran
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* QRIS */}
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('qris')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedPayment === 'qris'
                        ? 'border-amber-500 bg-amber-50/70 font-semibold ring-1 ring-amber-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <QrCode className="w-4 h-4 text-rose-600" />
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-stone-100 rounded text-stone-700">
                        QRIS
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">QRIS Nasional</p>
                      <p className="text-[10px] text-stone-500">BCA, GoPay, OVO, Shopee</p>
                    </div>
                  </button>

                  {/* DANA */}
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('dana')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedPayment === 'dana'
                        ? 'border-blue-500 bg-blue-50/70 font-semibold ring-1 ring-blue-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Wallet className="w-4 h-4 text-[#118EEA]" />
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-[#118EEA] rounded">
                        DANA
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">DANA Indonesia</p>
                      <p className="text-[10px] text-stone-500">Transfer No. Ponsel</p>
                    </div>
                  </button>

                  {/* Virtual Account / Bank */}
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('transfer')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedPayment === 'transfer'
                        ? 'border-amber-500 bg-amber-50/70 font-semibold ring-1 ring-amber-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600 mb-1" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Transfer Bank</p>
                      <p className="text-[10px] text-stone-500">BCA, Mandiri, BRI</p>
                    </div>
                  </button>

                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('cod')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedPayment === 'cod'
                        ? 'border-amber-500 bg-amber-50/70 font-semibold ring-1 ring-amber-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-amber-600 mb-1" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Tunai (COD)</p>
                      <p className="text-[10px] text-stone-500">Bayar ke Driver</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Pesanan</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Biaya Pengantaran</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon Kupon</span>
                    <span className="tabular-nums">- {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-stone-900 text-sm">Total Bayar</span>
                  <span className="text-base sm:text-lg font-black text-stone-950 tabular-nums">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-stone-200/80 shadow-lg shrink-0">
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-extrabold text-sm flex items-center justify-between shadow-md transition-all min-h-[48px] disabled:opacity-70"
            >
              <div className="text-left">
                <span className="text-xs font-medium block leading-tight text-stone-800">
                  Konfirmasi Pembayaran
                </span>
                <span className="text-base font-black tabular-nums">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                {isSubmitting ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>Pesan Sekarang</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
