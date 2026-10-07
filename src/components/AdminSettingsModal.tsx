import React, { useState } from 'react';
import { PaymentSettings } from '../types';
import { DEFAULT_PAYMENT_SETTINGS } from '../data/menuData';
import {
  X,
  Save,
  RotateCcw,
  QrCode,
  Wallet,
  Building,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PaymentSettings;
  onSaveSettings: (newSettings: PaymentSettings) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onShowToast,
}) => {
  const [form, setForm] = useState<PaymentSettings>(settings);
  const [activeTab, setActiveTab] = useState<'qris' | 'dana' | 'bank'>('qris');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    onShowToast('Pengaturan pembayaran QRIS & DANA berhasil disimpan!', 'success');
    onClose();
  };

  const handleReset = () => {
    setForm(DEFAULT_PAYMENT_SETTINGS);
    onShowToast('Pengaturan dikembalikan ke bawaan resto', 'info');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl z-10 animate-in slide-in-from-bottom-6 duration-200">
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-3 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-stone-100 shrink-0 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center shadow-xs">
              ⚙️
            </div>
            <div>
              <h3 id="admin-modal-title" className="text-sm sm:text-base font-extrabold leading-tight">
                Dashboard Admin: Pengaturan Pembayaran
              </h3>
              <p className="text-[11px] text-stone-300">
                Sesuaikan Link QRIS, Nomor DANA, dan Rekening Resto Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Tutup dashboard admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-5 pt-2 gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('qris')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'qris'
                ? 'border-amber-500 text-amber-800 bg-white rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <QrCode className="w-4 h-4 text-rose-600" />
            <span>Pengaturan QRIS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dana')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dana'
                ? 'border-amber-500 text-amber-800 bg-white rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Wallet className="w-4 h-4 text-blue-600" />
            <span>Pengaturan DANA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'bank'
                ? 'border-amber-500 text-amber-800 bg-white rounded-t-xl'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Building className="w-4 h-4 text-emerald-600" />
            <span>Rekening Bank</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: QRIS SETTINGS */}
          {activeTab === 'qris' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Data QRIS ini akan langsung tampil saat pembeli memilih metode <strong>QRIS</strong> ketika checkout. Anda bisa mengganti nama merchant, NMID, atau menautkan link gambar barcode QR toko Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Merchant QRIS (Tampil di Scanner)
                </label>
                <input
                  type="text"
                  required
                  value={form.qrisMerchantName}
                  onChange={(e) => setForm({ ...form, qrisMerchantName: e.target.value })}
                  placeholder="Contoh: YumYum Express Official / Resto Berkah"
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
                  value={form.qrisNmid}
                  onChange={(e) => setForm({ ...form, qrisNmid: e.target.value })}
                  placeholder="Contoh: ID1024892100823"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  URL / Link Gambar Barcode QR Kustom (Opsional)
                </label>
                <input
                  type="url"
                  value={form.qrisImageUrl}
                  onChange={(e) => setForm({ ...form, qrisImageUrl: e.target.value })}
                  placeholder="https://domain-anda.com/qris-barcode.png (Kosongkan untuk pakai QR digital interaktif)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Jika dikosongkan, aplikasi akan merender QRIS digital standar ASPI/GPN secara otomatis.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Petunjuk Pembayaran untuk Pelanggan
                </label>
                <textarea
                  rows={2}
                  value={form.qrisInstructions}
                  onChange={(e) => setForm({ ...form, qrisInstructions: e.target.value })}
                  placeholder="Panduan bagi pembeli saat memindai QRIS..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  Pratinjau QRIS di Sisi Pembeli:
                </span>
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-center max-w-xs mx-auto shadow-2xs">
                  <span className="text-xs font-black text-rose-600 font-mono block">QRIS GPN</span>
                  <p className="text-xs font-extrabold text-stone-900 mt-1">{form.qrisMerchantName || 'Nama Merchant'}</p>
                  <p className="text-[10px] font-mono text-stone-500">NMID: {form.qrisNmid || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DANA SETTINGS */}
          {activeTab === 'dana' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900">
                <Wallet className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p>
                  Nomor DANA ini akan diberikan kepada pembeli untuk melakukan transfer langsung melalui aplikasi <strong>DANA</strong> beserta tombol salin instan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nomor Telepon Akun DANA Restoran
                </label>
                <input
                  type="text"
                  required
                  value={form.danaNumber}
                  onChange={(e) => setForm({ ...form, danaNumber: e.target.value })}
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
                  value={form.danaAccountName}
                  onChange={(e) => setForm({ ...form, danaAccountName: e.target.value })}
                  placeholder="Contoh: YumYum Kuliner Indonesia / Budi Resto"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Panduan Transfer DANA
                </label>
                <textarea
                  rows={2}
                  value={form.danaInstructions}
                  onChange={(e) => setForm({ ...form, danaInstructions: e.target.value })}
                  placeholder="Langkah transfer via DANA..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  Pratinjau DANA di Sisi Pembeli:
                </span>
                <div className="p-3 bg-gradient-to-r from-[#118EEA] to-[#0D72BC] text-white rounded-xl text-center max-w-xs mx-auto shadow-2xs">
                  <span className="text-[11px] font-bold block">DANA Dompet Digital</span>
                  <p className="text-sm font-mono font-black mt-1">{form.danaNumber || '08xx-xxxx-xxxx'}</p>
                  <p className="text-[10px] text-blue-100">a.n. {form.danaAccountName || 'Nama Pemilik'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANK SETTINGS */}
          {activeTab === 'bank' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Bank
                </label>
                <input
                  type="text"
                  required
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  placeholder="Contoh: BCA / Mandiri / BRI"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nomor Rekening Bank
                </label>
                <input
                  type="text"
                  required
                  value={form.bankAccountNumber}
                  onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                  placeholder="Contoh: 8921-0044-3321"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  required
                  value={form.bankAccountName}
                  onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                  placeholder="Contoh: PT YumYum Selera Nusantara"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 border border-stone-200 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
