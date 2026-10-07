import React, { useState, useEffect } from 'react';
import { PaymentSettings, PaymentMethodType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { X, Copy, Check, QrCode, Download, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: PaymentMethodType;
  totalAmount: number;
  paymentSettings: PaymentSettings;
  onConfirmPayment: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  method,
  totalAmount,
  paymentSettings,
  onConfirmPayment,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(900); // 15 mins
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirm = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onConfirmPayment();
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl z-10 animate-in slide-in-from-bottom-6 duration-200">
        {/* Mobile handle */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-3 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-stone-100 shrink-0">
          <div>
            <h3 id="payment-modal-title" className="text-base font-extrabold text-stone-900 leading-tight">
              {method === 'qris' && 'Pembayaran QRIS Nasional'}
              {method === 'dana' && 'Pembayaran DANA Indonesia'}
              {method === 'transfer' && 'Transfer Virtual Account'}
              {method === 'cod' && 'Bayar Tunai di Tempat (COD)'}
            </h3>
            <span className="text-[11px] text-stone-500">
              Selesaikan transaksi dalam waktu{' '}
              <span className="font-mono font-bold text-amber-700">{formatTimer(timerSeconds)}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Tutup pembayaran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Total Tagihan Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wide block">
                Total Pembayaran
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-950 tabular-nums">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <button
              onClick={() => handleCopy(String(totalAmount), 'total')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white text-amber-900 text-xs font-bold border border-amber-200 shadow-2xs hover:bg-amber-100 transition-colors"
            >
              {copiedField === 'total' ? (
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

          {/* METHOD 1: QRIS */}
          {method === 'qris' && (
            <div className="space-y-4">
              {/* QRIS Card Presentation */}
              <div className="p-4 rounded-3xl bg-white border-2 border-stone-200 shadow-sm flex flex-col items-center text-center">
                {/* QRIS Badge Header */}
                <div className="w-full flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs tracking-wider text-rose-600 font-mono">
                      QRIS
                    </span>
                    <span className="text-[9px] text-stone-400 font-semibold">
                      STANDAR PEMBAYARAN NASIONAL
                    </span>
                  </div>
                  <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono font-bold">
                    GPN
                  </span>
                </div>

                {/* Merchant Name & NMID from Admin Settings */}
                <h4 className="text-sm font-extrabold text-stone-900">
                  {paymentSettings.qrisMerchantName}
                </h4>
                <p className="text-[11px] font-mono text-stone-500 mt-0.5">
                  NMID: {paymentSettings.qrisNmid}
                </p>

                {/* Visual QR Code Display */}
                <div className="my-3 p-3 bg-white rounded-2xl border border-stone-300 shadow-xs relative group flex flex-col items-center">
                  {paymentSettings.qrisImageUrl ? (
                    <img
                      src={paymentSettings.qrisImageUrl}
                      alt="QRIS Code"
                      className="w-48 h-48 object-contain rounded-lg"
                    />
                  ) : (
                    /* High-fidelity Stylized QR Code with QRIS Logo */
                    <div className="w-48 h-48 bg-stone-950 p-2 rounded-xl flex flex-col items-center justify-center relative">
                      {/* Stylized QR Matrix Pattern */}
                      <div className="w-full h-full bg-white p-2 rounded-lg grid grid-cols-6 grid-rows-6 gap-1 relative overflow-hidden">
                        {/* Corner Target 1 */}
                        <div className="col-span-2 row-span-2 border-4 border-stone-900 rounded-sm p-1 flex items-center justify-center">
                          <div className="w-3 h-3 bg-stone-900 rounded-xs" />
                        </div>
                        <div className="col-span-2 bg-stone-900 h-2 mt-1" />
                        {/* Corner Target 2 */}
                        <div className="col-span-2 row-span-2 border-4 border-stone-900 rounded-sm p-1 flex items-center justify-center">
                          <div className="w-3 h-3 bg-stone-900 rounded-xs" />
                        </div>

                        {/* Middle Random Modules */}
                        <div className="w-3 h-3 bg-stone-900 rounded-xs m-auto" />
                        <div className="w-3 h-3 bg-stone-900 rounded-xs m-auto" />
                        <div className="w-3 h-3 bg-stone-900 rounded-xs m-auto" />
                        <div className="w-3 h-3 bg-stone-900 rounded-xs m-auto" />

                        {/* Center Brand Emblem */}
                        <div className="absolute inset-0 m-auto w-10 h-10 bg-amber-500 text-stone-950 font-black text-xs rounded-xl flex items-center justify-center border-2 border-white shadow-md">
                          YUM
                        </div>

                        {/* Corner Target 3 */}
                        <div className="col-span-2 row-span-2 border-4 border-stone-900 rounded-sm p-1 flex items-center justify-center">
                          <div className="w-3 h-3 bg-stone-900 rounded-xs" />
                        </div>
                        <div className="w-3 h-3 bg-stone-900 rounded-xs m-auto" />
                        <div className="w-3 h-3 bg-stone-900 rounded-xs m-auto" />
                        <div className="col-span-2 bg-stone-900 h-2 mt-auto" />
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-stone-400 mt-2 font-medium">
                    Dicetak resmi oleh Bank Indonesia & ASPI
                  </span>
                </div>

                {/* Compatibility apps strip */}
                <p className="text-[10px] text-stone-500 max-w-xs leading-relaxed">
                  Bisa di-scan dari aplikasi BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, DANA, LinkAja.
                </p>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
                <p className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Petunjuk Pembayaran QRIS:
                </p>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {paymentSettings.qrisInstructions}
                </p>
              </div>
            </div>
          )}

          {/* METHOD 2: DANA */}
          {method === 'dana' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#118EEA] to-[#0D72BC] text-white shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#118EEA] font-black text-xs flex items-center justify-center shadow-xs">
                      DANA
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm leading-none">DANA Indonesia</h4>
                      <span className="text-[10px] text-blue-100">Dompet Digital Resmi</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                    Terverifikasi
                  </span>
                </div>

                {/* Account Number Box */}
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-blue-100 uppercase tracking-wide block">
                      Nomor Akun DANA Resto
                    </span>
                    <span className="text-lg font-mono font-black tracking-wider text-white">
                      {paymentSettings.danaNumber}
                    </span>
                    <p className="text-[11px] text-blue-100 font-medium mt-0.5">
                      a.n. {paymentSettings.danaAccountName}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(paymentSettings.danaNumber, 'dana')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#118EEA] font-extrabold text-xs shadow-sm hover:bg-blue-50 transition-colors"
                  >
                    {copiedField === 'dana' ? (
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

                <div className="text-[11px] text-blue-50 leading-relaxed space-y-1">
                  <p className="font-bold text-white">Langkah Transfer DANA:</p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Buka aplikasi DANA di smartphone Anda</li>
                    <li>Pilih menu <strong>Kirim</strong> lalu <strong>Kirim ke Nomor Telepon</strong></li>
                    <li>Tempel nomor DANA resto di atas</li>
                    <li>Masukkan nominal persis: <strong>{formatCurrency(totalAmount)}</strong></li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* METHOD 3: TRANSFER BANK */}
          {method === 'transfer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-stone-900 text-white space-y-3">
                <span className="text-xs font-bold text-stone-400 block uppercase">
                  Rekening Bank Restoran
                </span>
                <div className="p-3.5 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-stone-300">{paymentSettings.bankName}</p>
                    <p className="text-base font-mono font-black text-amber-400">
                      {paymentSettings.bankAccountNumber}
                    </p>
                    <p className="text-[11px] text-stone-400">a.n. {paymentSettings.bankAccountName}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(paymentSettings.bankAccountNumber, 'bank')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                  >
                    {copiedField === 'bank' ? 'Tersalin' : 'Salin Rekening'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* METHOD 4: COD */}
          {method === 'cod' && (
            <div className="p-4 rounded-3xl bg-stone-50 border border-stone-200 text-stone-700 space-y-2 text-xs">
              <p className="font-bold text-stone-900">Pembayaran Tunai di Tempat (COD)</p>
              <p className="text-stone-600 leading-relaxed">
                Mohon siapkan uang tunai sejumlah <strong>{formatCurrency(totalAmount)}</strong> saat Driver mengantarkan pesanan ke alamat Anda.
              </p>
            </div>
          )}
        </div>

        {/* Footer Confirmation */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 shrink-0">
          <button
            onClick={handleConfirm}
            disabled={isVerifying}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all min-h-[48px] disabled:opacity-70"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                Memverifikasi Pembayaran...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {method === 'qris' && 'Saya Sudah Bayar via QRIS'}
                  {method === 'dana' && 'Saya Sudah Kirim Saldo DANA'}
                  {method === 'transfer' && 'Saya Sudah Transfer Bank'}
                  {method === 'cod' && 'Konfirmasi Pesanan COD'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
