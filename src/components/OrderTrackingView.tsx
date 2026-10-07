import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  Clock,
  Phone,
  MessageSquare,
  CheckCircle,
  ChefHat,
  Bike,
  ShoppingBag,
  RotateCcw,
  ChevronRight,
  MapPin,
  Navigation,
  Play,
  RotateCw,
  Receipt,
  Share2,
  AlertCircle
} from 'lucide-react';

interface OrderTrackingViewProps {
  orders: Order[];
  onAdvanceOrderStatus: (orderId: string) => void;
  onReorder: (order: Order) => void;
  onSwitchToExplore: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  onAdvanceOrderStatus,
  onReorder,
  onSwitchToExplore,
}) => {
  const [selectedOrderTab, setSelectedOrderTab] = useState<'active' | 'history'>('active');
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [receiptModalOrder, setReceiptModalOrder] = useState<Order | null>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([
    'Driver: Halo kak, pesanan sudah saya ambil dari resto YumYum dan otw ya!',
  ]);
  const [inputChat, setInputChat] = useState('');
  
  // Simulated driver position percentage (0 to 100) along the route
  const [driverProgress, setDriverProgress] = useState(55);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(640); // ~10 mins

  const activeOrders = orders.filter(
    (o) => o.status === 'placed' || o.status === 'cooking' || o.status === 'delivering'
  );
  const completedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  // Countdown timer effect for active orders
  useEffect(() => {
    if (activeOrders.length === 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeOrders.length]);

  // Automated delivery simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoSimulating && activeOrders.length > 0) {
      interval = setInterval(() => {
        setDriverProgress((prev) => {
          if (prev >= 95) {
            setIsAutoSimulating(false);
            if (activeOrders[0] && activeOrders[0].status === 'delivering') {
              onAdvanceOrderStatus(activeOrders[0].id);
            }
            return 100;
          }
          return prev + 5;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAutoSimulating, activeOrders, onAdvanceOrderStatus]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepStatus = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'placed':
        return 1;
      case 'cooking':
        return 2;
      case 'delivering':
        return 3;
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    setChatMessages((prev) => [...prev, `Anda: ${inputChat}`]);
    setInputChat('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        'Driver: Siap kak, sebentar lagi sampai di depan lobi/pagar 👍',
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-8">
      {/* Tab Switcher: Aktif vs Riwayat */}
      <div className="flex items-center gap-2 p-1 bg-stone-200/70 rounded-2xl max-w-xs mx-auto">
        <button
          onClick={() => setSelectedOrderTab('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            selectedOrderTab === 'active'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Pesanan Aktif ({activeOrders.length})
        </button>
        <button
          onClick={() => setSelectedOrderTab('history')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            selectedOrderTab === 'history'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Riwayat ({completedOrders.length})
        </button>
      </div>

      {/* ACTIVE ORDERS */}
      {selectedOrderTab === 'active' && (
        <>
          {activeOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs">
              <div className="text-5xl mb-3">🛵</div>
              <h3 className="text-base font-bold text-stone-800">
                Belum ada pesanan yang sedang berjalan
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                Pilih menu favoritmu dan selesaikan pesanan untuk melacak posisi driver dan rute pengiriman secara langsung.
              </p>
              <button
                onClick={onSwitchToExplore}
                className="px-5 py-2.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
              >
                Pesan Makanan Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => {
                const currentStep = getStepStatus(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4 overflow-hidden"
                  >
                    {/* Order Header & ETA Countdown */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-stone-900">
                            {order.id}
                          </span>
                          <span className="text-[11px] text-stone-400">· {order.createdAt}</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                            {order.status === 'placed' && 'Diterima Resto'}
                            {order.status === 'cooking' && 'Sedang Dimasak'}
                            {order.status === 'delivering' && 'Sedang Diantar'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          Tujuan: <span className="font-semibold text-stone-800">{order.deliveryAddress}</span>
                        </p>
                      </div>

                      {/* Live ETA Box */}
                      <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-500/10 px-3 py-1.5 rounded-2xl border border-amber-500/20">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                        <div>
                          <p className="text-[10px] text-amber-800 font-semibold uppercase leading-none">
                            Estimasi Tiba
                          </p>
                          <p className="text-xs font-black text-amber-900 tabular-nums leading-tight mt-0.5">
                            {order.status === 'delivering' ? formatCountdown(secondsRemaining) + ' mnt' : order.estimatedDeliveryTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* LIVE INTERACTIVE ROUTE MAP (Simulated Google Maps View) */}
                    <div className="relative rounded-2xl bg-[#E8ECEF] border border-stone-200/90 h-56 overflow-hidden shadow-inner">
                      {/* Stylized Map Grid and Streets */}
                      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#map-grid)" />
                        {/* City Roads */}
                        <path d="M -10 90 Q 150 70 300 130 T 700 100" fill="none" stroke="#FFFFFF" strokeWidth="16" />
                        <path d="M 80 -10 L 120 250" fill="none" stroke="#FFFFFF" strokeWidth="14" />
                        <path d="M 280 -10 L 260 250" fill="none" stroke="#FFFFFF" strokeWidth="12" />
                        <path d="M -10 180 Q 200 190 450 160 T 700 200" fill="none" stroke="#FFFFFF" strokeWidth="12" />
                      </svg>

                      {/* Green park zone in map */}
                      <div className="absolute top-4 right-10 w-28 h-20 bg-emerald-200/40 rounded-3xl -rotate-6 pointer-events-none" />

                      {/* Animated Delivery Polyline Path */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M 60 140 Q 160 50 250 120 T 460 70"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="5"
                          strokeDasharray="6 6"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Point A: Restaurant Pin */}
                      <div className="absolute left-10 top-28 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <div className="px-2 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-bold shadow-xs whitespace-nowrap mb-1">
                          Resto YumYum
                        </div>
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
                          🍳
                        </div>
                      </div>

                      {/* Moving Driver Marker */}
                      <div
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-all duration-700 ease-linear"
                        style={{
                          left: `${Math.min(85, Math.max(25, driverProgress))}%`,
                          top: `${48 + Math.sin(driverProgress / 10) * 8}%`,
                        }}
                      >
                        <div className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-extrabold text-[10px] shadow-sm whitespace-nowrap flex items-center gap-1 mb-1">
                          <Navigation className="w-3 h-3 text-stone-950 animate-pulse" />
                          <span>Driver ({driverProgress}%)</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-sm shadow-xl border-2 border-white ring-4 ring-amber-500/20 animate-bounce">
                          🛵
                        </div>
                      </div>

                      {/* Point B: Customer Destination Pin */}
                      <div className="absolute right-12 top-14 translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <div className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-xs whitespace-nowrap mb-1">
                          Lokasi Anda
                        </div>
                        <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Live Speed & Distance Overlay Badge */}
                      <div className="absolute bottom-2.5 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-stone-800 text-[11px] font-semibold border border-stone-200/80 shadow-xs flex items-center gap-3">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Driver Bergerak
                        </span>
                        <span className="text-stone-300">|</span>
                        <span>Kecepatan: 32 km/jam</span>
                        <span className="text-stone-300">|</span>
                        <span>Sisa: 1.2 km</span>
                      </div>

                      {/* Interactive Simulation Play/Pause Controls */}
                      <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => setIsAutoSimulating(!isAutoSimulating)}
                          className="px-2.5 py-1 rounded-xl bg-stone-900/90 hover:bg-stone-900 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-xs transition-colors"
                        >
                          {isAutoSimulating ? (
                            <>
                              <RotateCw className="w-3 h-3 animate-spin text-amber-400" />
                              <span>Simulasi Jalan...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>Tes Gerak Otomatis</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Stepper Progress Bar (4 Tahap) */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-stone-200 -z-0">
                          <div
                            className="h-full bg-amber-500 transition-all duration-500"
                            style={{
                              width:
                                currentStep === 1
                                  ? '0%'
                                  : currentStep === 2
                                  ? '33%'
                                  : currentStep === 3
                                  ? '66%'
                                  : '100%',
                            }}
                          />
                        </div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              currentStep >= 1
                                ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-100'
                                : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-semibold mt-1.5 text-stone-800">
                            Diterima
                          </span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              currentStep >= 2
                                ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-100'
                                : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            <ChefHat className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-semibold mt-1.5 text-stone-800">
                            Dimasak
                          </span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              currentStep >= 3
                                ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-100 animate-pulse'
                                : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            <Bike className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-semibold mt-1.5 text-stone-800">
                            Diantar
                          </span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              currentStep >= 4
                                ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                                : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-semibold mt-1.5 text-stone-800">
                            Sampai
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Card Info & Contact buttons */}
                    {order.driverName && (
                      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            🛵
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-extrabold text-stone-900">
                                {order.driverName}
                              </p>
                              <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                                ⭐ 4.9
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500">
                              {order.driverVehicle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setChatModalOpen(true)}
                            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-amber-600 hover:border-amber-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-2xs"
                            aria-label="Chat Driver"
                            title="Chat Driver"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <a
                            href={`tel:${order.driverPhone}`}
                            className="p-2.5 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-2xs"
                            aria-label="Telepon Driver"
                            title="Telepon Driver"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Ordered Items Accordion / Summary */}
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                          Rincian Makanan
                        </span>
                        <button
                          onClick={() => setReceiptModalOrder(order)}
                          className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Lihat Struk Lengkap</span>
                        </button>
                      </div>

                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.menuItem.foodEmoji}</span>
                            <span className="font-semibold text-stone-900">
                              {item.quantity}x {item.menuItem.name}
                            </span>
                          </div>
                          <span className="tabular-nums font-medium text-stone-700">
                            {formatCurrency(item.menuItem.price * item.quantity)}
                          </span>
                        </div>
                      ))}

                      <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs font-bold text-stone-900">
                        <span>Total Pembayaran ({order.paymentMethod})</span>
                        <span className="text-sm font-extrabold text-amber-700 tabular-nums">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Step Advance Interactive Simulator */}
                    {order.status !== 'completed' && (
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                        <span className="text-[11px] text-stone-400">
                          Fitur simulasi untuk menguji status pengantaran
                        </span>
                        <button
                          onClick={() => onAdvanceOrderStatus(order.id)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <span>Langkah Selanjutnya</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* COMPLETED ORDERS HISTORY */}
      {selectedOrderTab === 'history' && (
        <div className="space-y-3">
          {completedOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/80 p-6">
              <p className="text-xs text-stone-500">Belum ada riwayat pesanan selesai.</p>
            </div>
          ) : (
            completedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-4 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-800">{order.id}</span>
                    <span className="text-stone-400">· {order.createdAt}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                    Selesai
                  </span>
                </div>

                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-xs text-stone-600">
                      {item.quantity}x {item.menuItem.name}
                    </p>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 block">Total</span>
                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReceiptModalOrder(order)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50"
                    >
                      Struk
                    </button>
                    <button
                      onClick={() => onReorder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pesan Lagi</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Driver Chat Simulator Modal */}
      {chatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[70vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                  🛵
                </div>
                <div>
                  <h4 className="text-xs font-bold">Chat dengan Pak Budi</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online · Pengantar YumYum
                  </span>
                </div>
              </div>
              <button
                onClick={() => setChatModalOpen(false)}
                className="text-stone-300 hover:text-white text-xs font-semibold px-2 py-1 rounded"
              >
                Tutup
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-stone-50 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl max-w-[80%] ${
                    msg.startsWith('Anda:')
                      ? 'ml-auto bg-amber-500 text-stone-950 font-medium'
                      : 'bg-white border border-stone-200 text-stone-800'
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-stone-200 flex gap-2">
              <input
                type="text"
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Ketik pesan untuk driver..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 font-bold text-xs text-stone-950"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {receiptModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-stone-200 animate-in zoom-in-95">
            <div className="text-center pb-3 border-b border-dashed border-stone-200">
              <span className="text-2xl font-black">YumYum Express</span>
              <p className="text-xs text-stone-500 mt-0.5">Struk Transaksi Pesanan Makanan</p>
              <p className="font-mono text-xs font-bold text-stone-900 mt-1">
                No. Resi: {receiptModalOrder.id}
              </p>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-500">Waktu:</span>
                <span>{receiptModalOrder.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Metode Bayar:</span>
                <span className="font-semibold">{receiptModalOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tujuan:</span>
                <span className="max-w-[180px] text-right truncate">{receiptModalOrder.deliveryAddress}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs">
              {receiptModalOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span className="font-medium tabular-nums">{formatCurrency(item.menuItem.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-stone-500 pt-1">
                <span>Ongkos Kirim</span>
                <span>{formatCurrency(receiptModalOrder.deliveryFee)}</span>
              </div>
              {receiptModalOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Promo</span>
                  <span>- {formatCurrency(receiptModalOrder.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-dashed border-stone-200 flex justify-between font-extrabold text-sm text-stone-950">
                <span>Total Dibayar</span>
                <span className="tabular-nums text-amber-700">{formatCurrency(receiptModalOrder.total)}</span>
              </div>
            </div>

            <button
              onClick={() => setReceiptModalOrder(null)}
              className="w-full py-2.5 rounded-2xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
            >
              Tutup Struk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
