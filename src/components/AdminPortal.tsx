import React, { useState } from 'react';
import { Order, MenuItem, PaymentSettings, OrderStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
import { DEFAULT_PAYMENT_SETTINGS } from '../data/menuData';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  CreditCard,
  QrCode,
  Wallet,
  Building,
  TrendingUp,
  LogOut,
  Save,
  RotateCcw,
  Plus,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  Store,
  Eye,
  Check,
  Search,
  AlertCircle
} from 'lucide-react';

interface AdminPortalProps {
  orders: Order[];
  menuItems: MenuItem[];
  paymentSettings: PaymentSettings;
  onSavePaymentSettings: (newSettings: PaymentSettings) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateMenuPrice: (itemId: number, newPrice: number) => void;
  onToggleMenuAvailability: (itemId: number) => void;
  onExitAdmin: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  orders,
  menuItems,
  paymentSettings,
  onSavePaymentSettings,
  onUpdateOrderStatus,
  onUpdateMenuPrice,
  onToggleMenuAvailability,
  onExitAdmin,
  onShowToast,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'payments' | 'menu' | 'reports'>('orders');
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [paymentForm, setPaymentForm] = useState<PaymentSettings>(paymentSettings);
  const [paymentSubTab, setPaymentSubTab] = useState<'qris' | 'dana' | 'bank'>('qris');
  const [menuSearch, setMenuSearch] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Calculations for Admin Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const activeOrders = orders.filter((o) => o.status === 'placed' || o.status === 'cooking' || o.status === 'delivering');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const handleSavePayments = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePaymentSettings(paymentForm);
    onShowToast('Data QRIS dan DANA berhasil disimpan!', 'success');
  };

  const handleResetPayments = () => {
    setPaymentForm(DEFAULT_PAYMENT_SETTINGS);
    onShowToast('Pengaturan pembayaran direset ke default', 'info');
  };

  const handleSavePrice = (id: number) => {
    const num = parseInt(tempPrice);
    if (!isNaN(num) && num > 0) {
      onUpdateMenuPrice(id, num);
      onShowToast('Harga menu berhasil diperbarui!', 'success');
    }
    setEditingPriceId(null);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-stone-900 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-stone-950 text-white sticky top-0 z-40 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Store Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-black text-xl flex items-center justify-center shadow-sm">
              Y
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  YumYum Back-Office
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Portal Admin
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Pusat Kontrol Restoran, Kasir & Pembayaran
              </p>
            </div>
          </div>

          {/* Center/Right Store Status & Exit to Customer Portal */}
          <div className="flex items-center gap-3">
            {/* Toggle Store Open/Close */}
            <button
              onClick={() => {
                setIsStoreOpen(!isStoreOpen);
                onShowToast(
                  !isStoreOpen ? 'Status resto: Buka (Menerima Pesanan)' : 'Status resto: Tutup Sementara',
                  'info'
                );
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isStoreOpen
                  ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                  : 'bg-rose-950 border border-rose-600 text-rose-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span>{isStoreOpen ? 'Toko Buka' : 'Toko Tutup'}</span>
            </button>

            {/* Switch / Exit to Customer Portal Button */}
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 text-xs font-black transition-all shadow-sm"
              title="Kembali ke halaman belanja pembeli"
            >
              <LogOut className="w-4 h-4" />
              <span>Ke Portal Pembeli</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 border-t border-stone-800/80 pt-1">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeAdminTab === 'orders'
                ? 'border-amber-500 text-amber-400 bg-stone-900 rounded-t-lg'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesanan Masuk</span>
            {activeOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeAdminTab === 'payments'
                ? 'border-amber-500 text-amber-400 bg-stone-900 rounded-t-lg'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Pengaturan QRIS & DANA</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('menu')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeAdminTab === 'menu'
                ? 'border-amber-500 text-amber-400 bg-stone-900 rounded-t-lg'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Kelola Menu & Harga</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeAdminTab === 'reports'
                ? 'border-amber-500 text-amber-400 bg-stone-900 rounded-t-lg'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Laporan & Omset</span>
          </button>
        </div>
      </header>

      {/* Admin Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* TAB 1: PESANAN MASUK (KITCHEN & POS DISPLAY) */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900">
                  Antrean Pesanan Masuk (Kitchen & POS)
                </h2>
                <p className="text-xs text-stone-500">
                  Perbarui status pesanan pelanggan secara langsung dari dapur.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {activeOrders.length} Pesanan Aktif
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {completedOrders.length} Selesai
                </span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <p className="text-stone-500 text-sm">Belum ada pesanan masuk.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className={`bg-white rounded-3xl p-5 border shadow-xs space-y-3.5 transition-all ${
                      ord.status === 'delivering'
                        ? 'border-amber-400 ring-2 ring-amber-100'
                        : ord.status === 'cooking'
                        ? 'border-orange-400'
                        : ord.status === 'placed'
                        ? 'border-blue-400 ring-2 ring-blue-50'
                        : 'border-stone-200 opacity-80'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-stone-900">
                            {ord.id}
                          </span>
                          <span className="text-[11px] text-stone-400">· {ord.createdAt}</span>
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                          📍 {ord.deliveryAddress}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${
                          ord.status === 'placed'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'cooking'
                            ? 'bg-orange-100 text-orange-800'
                            : ord.status === 'delivering'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ord.status === 'placed' && 'Baru Masuk'}
                        {ord.status === 'cooking' && 'Sedang Dimasak'}
                        {ord.status === 'delivering' && 'Sedang Diantar'}
                        {ord.status === 'completed' && 'Selesai'}
                      </span>
                    </div>

                    {/* Ordered Items List */}
                    <div className="bg-stone-50 rounded-2xl p-3 space-y-1.5 text-xs border border-stone-100">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between">
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-stone-900">{item.quantity}x</span>
                            <div>
                              <span className="text-stone-800 font-medium">{item.menuItem.name}</span>
                              {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
                                <span className="text-orange-600 text-[10px] ml-1 font-semibold">
                                  (Pedas Lv.{item.spicyLevel})
                                </span>
                              )}
                              {item.notes && (
                                <p className="text-[10px] text-stone-400 italic">"{item.notes}"</p>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold text-stone-600 tabular-nums">
                            {formatCurrency(item.menuItem.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Metode Pembayaran</span>
                        <span className="font-bold text-stone-800 text-[11px]">{ord.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">Total Pembayaran</span>
                        <span className="font-extrabold text-amber-800 text-sm tabular-nums">
                          {formatCurrency(ord.total)}
                        </span>
                      </div>
                    </div>

                    {/* Action Step Buttons */}
                    {ord.status !== 'completed' && (
                      <div className="pt-2 flex gap-1.5">
                        {ord.status === 'placed' && (
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'cooking')}
                            className="flex-1 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>Mulai Masak</span>
                          </button>
                        )}
                        {ord.status === 'cooking' && (
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'delivering')}
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Bike className="w-3.5 h-3.5" />
                            <span>Serahkan ke Driver</span>
                          </button>
                        )}
                        {ord.status === 'delivering' && (
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'completed')}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tandai Sampai</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PENGATURAN QRIS & DANA */}
        {activeAdminTab === 'payments' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900">
                  Pengaturan Pembayaran Toko (QRIS & DANA)
                </h2>
                <p className="text-xs text-stone-500">
                  Data yang Anda isi di sini akan langsung ditampilkan ke seluruh pembeli saat checkout.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Terhubung Langsung
              </span>
            </div>

            {/* Sub Tabs for Payments */}
            <div className="flex gap-2 p-1 bg-stone-200/80 rounded-2xl max-w-md">
              <button
                type="button"
                onClick={() => setPaymentSubTab('qris')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  paymentSubTab === 'qris' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-rose-600" />
                <span>QRIS Nasional</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentSubTab('dana')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  paymentSubTab === 'dana' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-[#118EEA]" />
                <span>Akun DANA</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentSubTab('bank')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  paymentSubTab === 'bank' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rekening Bank</span>
              </button>
            </div>

            <form onSubmit={handleSavePayments} className="bg-white rounded-3xl p-6 border border-stone-200 space-y-5 shadow-xs">
              {/* QRIS SECTION */}
              {paymentSubTab === 'qris' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nama Merchant QRIS (Tampil di Scanner Pelanggan)
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.qrisMerchantName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, qrisMerchantName: e.target.value })}
                        placeholder="Contoh: YumYum Express Official"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        NMID (National Merchant ID Bank Indonesia)
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.qrisNmid}
                        onChange={(e) => setPaymentForm({ ...paymentForm, qrisNmid: e.target.value })}
                        placeholder="Contoh: ID1024892100823"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Link / URL Gambar Barcode QR Kustom (Opsional)
                    </label>
                    <input
                      type="url"
                      value={paymentForm.qrisImageUrl}
                      onChange={(e) => setPaymentForm({ ...paymentForm, qrisImageUrl: e.target.value })}
                      placeholder="https://... (Kosongkan bila menggunakan generator QRIS otomatis bawaan)"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                    />
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Jika dikosongkan, sistem akan otomatis merender barcode QR digital resmi ASPI.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Petunjuk Pembayaran QRIS
                    </label>
                    <textarea
                      rows={2}
                      value={paymentForm.qrisInstructions}
                      onChange={(e) => setPaymentForm({ ...paymentForm, qrisInstructions: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* QRIS Live Preview Box */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 text-center w-48 shadow-2xs">
                      <span className="text-xs font-black text-rose-600 font-mono block">QRIS GPN</span>
                      <p className="text-xs font-extrabold text-stone-900 mt-1 line-clamp-1">{paymentForm.qrisMerchantName}</p>
                      <p className="text-[9px] font-mono text-stone-400">NMID: {paymentForm.qrisNmid}</p>
                      <div className="w-24 h-24 bg-stone-900 rounded-lg mx-auto my-2 flex items-center justify-center text-white text-xs font-bold">
                        [QR Code]
                      </div>
                    </div>
                    <div className="text-xs text-stone-600 space-y-1">
                      <p className="font-bold text-stone-900">Pratinjau Sisi Pembeli:</p>
                      <p>• Nama merchant: <span className="font-semibold text-stone-900">{paymentForm.qrisMerchantName}</span></p>
                      <p>• NMID: <span className="font-mono font-semibold">{paymentForm.qrisNmid}</span></p>
                      <p>• Siap di-scan oleh BCA, Mandiri, GoPay, OVO, ShopeePay, DANA.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DANA SECTION */}
              {paymentSubTab === 'dana' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nomor Akun DANA Resto (Nomor HP)
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.danaNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, danaNumber: e.target.value })}
                        placeholder="Contoh: 0812-9876-5432"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nama Pemilik Akun DANA (Atas Nama / A.N.)
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.danaAccountName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, danaAccountName: e.target.value })}
                        placeholder="Contoh: PT YumYum Kuliner Indonesia"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Panduan Transfer DANA
                    </label>
                    <textarea
                      rows={2}
                      value={paymentForm.danaInstructions}
                      onChange={(e) => setPaymentForm({ ...paymentForm, danaInstructions: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* DANA Live Preview */}
                  <div className="p-4 bg-gradient-to-r from-[#118EEA] to-[#0D72BC] text-white rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[10px] text-blue-100 uppercase tracking-wide block">DANA Dompet Digital</span>
                      <p className="text-lg font-mono font-black">{paymentForm.danaNumber}</p>
                      <p className="text-xs text-blue-100">a.n. {paymentForm.danaAccountName}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                      Tombol Salin Aktif
                    </span>
                  </div>
                </div>
              )}

              {/* BANK SECTION */}
              {paymentSubTab === 'bank' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nama Bank</label>
                      <input
                        type="text"
                        value={paymentForm.bankName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nomor Rekening</label>
                      <input
                        type="text"
                        value={paymentForm.bankAccountNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, bankAccountNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nama Pemilik Rekening</label>
                      <input
                        type="text"
                        value={paymentForm.bankAccountName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, bankAccountName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetPayments}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black shadow-sm transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan Pembayaran</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: KELOLA MENU & HARGA */}
        {activeAdminTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900">
                  Manajemen Menu & Penyesuaian Harga
                </h2>
                <p className="text-xs text-stone-500">
                  Atur ketersediaan stok menu dan perbarui harga jual secara langsung.
                </p>
              </div>

              {/* Quick Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Cari menu..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Menu Makanan</th>
                      <th className="px-4 py-3.5">Kategori</th>
                      <th className="px-4 py-3.5">Harga Jual</th>
                      <th className="px-4 py-3.5 text-center">Status Stok</th>
                      <th className="px-4 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.foodEmoji}</span>
                            <div>
                              <p className="font-bold text-stone-900">{item.name}</p>
                              <span className="text-[10px] text-stone-400">{item.tags.join(' · ')}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-600 capitalize">
                          {item.category}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-stone-900">
                          {editingPriceId === item.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-24 px-2 py-1 text-xs border border-amber-400 rounded-lg focus:outline-none"
                              />
                              <button
                                onClick={() => handleSavePrice(item.id)}
                                className="p-1 bg-amber-500 rounded text-stone-950 font-bold text-xs"
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => {
                                setEditingPriceId(item.id);
                                setTempPrice(String(item.price));
                              }}
                              className="cursor-pointer hover:underline text-amber-900"
                              title="Klik untuk ubah harga"
                            >
                              {formatCurrency(item.price)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => onToggleMenuAvailability(item.id)}
                            className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                          >
                            Tersedia
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setEditingPriceId(item.id);
                              setTempPrice(String(item.price));
                            }}
                            className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
                          >
                            Ubah Harga
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LAPORAN & OMSET */}
        {activeAdminTab === 'reports' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-stone-200">
              <h2 className="text-xl font-extrabold text-stone-900">
                Laporan Pendapatan & Ringkasan Toko
              </h2>
              <p className="text-xs text-stone-500">
                Statistik performa penjualan resto YumYum hari ini.
              </p>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Total Omset Penjualan
                </span>
                <p className="text-2xl font-black text-amber-700 mt-1 tabular-nums">
                  {formatCurrency(totalRevenue)}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  +18% dibandingkan kemarin
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Total Transaksi
                </span>
                <p className="text-2xl font-black text-stone-900 mt-1 tabular-nums">
                  {orders.length} Pesanan
                </p>
                <span className="text-[11px] text-stone-500 font-medium mt-1 block">
                  {completedOrders.length} berhasil selesai
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Rata-rata Order (AOV)
                </span>
                <p className="text-2xl font-black text-stone-900 mt-1 tabular-nums">
                  {formatCurrency(orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0)}
                </p>
                <span className="text-[11px] text-stone-500 font-medium mt-1 block">
                  Per pelanggan
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
