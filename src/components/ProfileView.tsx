import React, { useState } from 'react';
import { DeliveryAddress, PromoVoucher } from '../types';
import { VOUCHERS } from '../data/menuData';
import { User, MapPin, Tag, Bell, ShieldCheck, HelpCircle, ChevronRight, Copy, Check, Settings, QrCode } from 'lucide-react';

interface ProfileViewProps {
  addresses: DeliveryAddress[];
  onOpenAddressModal: () => void;
  onOpenAdmin: () => void;
  onApplyVoucherCode: (code: string) => void;
  onShowToast: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  addresses,
  onOpenAddressModal,
  onOpenAdmin,
  onApplyVoucherCode,
  onShowToast,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    onShowToast(`Kode promo ${code} berhasil disalin!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-10">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-black text-2xl flex items-center justify-center shadow-sm">
            AF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                Ahmad Faiz
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Gold Member
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              0812-3456-7890 · ahmad.faiz@example.com
            </p>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">
              ⭐ 1.450 Poin YumYum (Bisa ditukar diskon)
            </p>
          </div>
        </div>
      </div>

      {/* Admin Resto & Payment Settings Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Dashboard Admin & Kasir Resto
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Sesuaikan Link Barcode QRIS, Nomor DANA, dan Rekening Bank toko Anda.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAdmin}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5"
        >
          <Settings className="w-4 h-4" />
          <span>Buka Admin</span>
        </button>
      </div>

      {/* Saved Delivery Addresses Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900">
              Alamat Pengiriman Tersimpan
            </h3>
          </div>
          <button
            onClick={onOpenAddressModal}
            className="text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            Kelola / Tambah
          </button>
        </div>

        <div className="space-y-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-2 text-xs"
            >
              <div className="min-w-0">
                <span className="font-bold text-stone-900 block truncate">
                  {addr.label} {addr.isDefault && '• (Utama)'}
                </span>
                <span className="text-[11px] text-stone-500 line-clamp-1">
                  {addr.address}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Available Vouchers / Kupon Saya */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900">
            Voucher & Promo Spesial Saya
          </h3>
        </div>

        <div className="space-y-2.5">
          {VOUCHERS.map((voucher) => (
            <div
              key={voucher.code}
              className="p-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/40 flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                    {voucher.code}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Tersedia
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-tight">
                  {voucher.description}
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(voucher.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 text-xs font-bold transition-colors shrink-0"
              >
                {copiedCode === voucher.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification & Security Settings */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-stone-900">
          Pengaturan Aplikasi & Bantuan
        </h3>

        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-stone-500" />
              <span className="font-medium text-stone-800">
                Notifikasi Pengantaran & Promo
              </span>
            </div>
            <button
              onClick={() => {
                setNotificationsEnabled(!notificationsEnabled);
                onShowToast(
                  !notificationsEnabled
                    ? 'Notifikasi diaktifkan'
                    : 'Notifikasi dinonaktifkan'
                );
              }}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                notificationsEnabled ? 'bg-amber-500 justify-end' : 'bg-stone-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-stone-100 cursor-pointer hover:bg-stone-50 px-1 rounded-lg">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <span className="font-medium text-stone-800">
                Kebijakan Privasi & Jaminan Higienis
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>

          <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-stone-50 px-1 rounded-lg">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-stone-500" />
              <span className="font-medium text-stone-800">
                Pusat Bantuan & Layanan Pelanggan 24/7
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
