import React, { useState } from 'react';
import { DeliveryAddress } from '../types';
import { X, MapPin, Check, Plus } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: DeliveryAddress[];
  activeAddressId: string;
  onSelectAddress: (addr: DeliveryAddress) => void;
  onAddNewAddress: (addr: DeliveryAddress) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addresses,
  activeAddressId,
  onSelectAddress,
  onAddNewAddress,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNote, setNewNote] = useState('');

  if (!isOpen) return null;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newAddress.trim()) return;

    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: newLabel.trim(),
      recipient: 'Ahmad Faiz',
      phone: '0812-3456-7890',
      address: newAddress.trim(),
      note: newNote.trim(),
      isDefault: false,
    };

    onAddNewAddress(newAddr);
    onSelectAddress(newAddr);
    setIsAddingNew(false);
    setNewLabel('');
    setNewAddress('');
    setNewNote('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl z-10 animate-in slide-in-from-bottom-4 duration-200">
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-3 shrink-0" />

        <div className="px-5 py-3.5 flex items-center justify-between border-b border-stone-100 shrink-0">
          <h3 id="address-modal-title" className="text-base font-bold text-stone-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            Pilih Alamat Pengantaran
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {!isAddingNew ? (
            <>
              <div className="space-y-2.5">
                {addresses.map((addr) => {
                  const isSelected = addr.id === activeAddressId;
                  return (
                    <button
                      key={addr.id}
                      onClick={() => {
                        onSelectAddress(addr);
                        onClose();
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-semibold px-2 py-0.2 bg-stone-100 text-stone-600 rounded-md">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 leading-snug line-clamp-2">
                          {addr.address}
                        </p>
                        {addr.note && (
                          <p className="text-[11px] text-stone-400 italic">
                            Catatan: {addr.note}
                          </p>
                        )}
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-amber-500 text-stone-600 hover:text-amber-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Alamat Baru</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmitNew} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Label Alamat (misal: Apartemen, Rumah Nenek)
                </label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Nama Tempat"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Alamat Lengkap & Nomor Jalan
                </label>
                <textarea
                  required
                  rows={2}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Jl. ... No. ..., Kelurahan, Kota"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Petunjuk Driver / Patokan
                </label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Contoh: Titip di lobi satpam, bel warna merah"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-600"
                >
                  Simpan & Pilih
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
