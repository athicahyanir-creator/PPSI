import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { TicketType } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ShieldCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const TicketTypesAdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const destinations = storageService.getDestinations();
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || '');
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(() =>
    storageService.getTicketTypes()
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 15000,
    validity: '1 Hari Kunjungan',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  const refreshData = () => {
    setTicketTypes(storageService.getTicketTypes());
  };

  const currentDestinationTickets = ticketTypes.filter(
    (t) => !selectedDestId || t.destinationId === selectedDestId
  );

  const handleOpenAdd = () => {
    setEditingTicket(null);
    setFormData({
      name: '',
      price: 15000,
      validity: '1 Hari Kunjungan',
      description: 'Akses masuk gerbang dan fasilitas umum.',
      status: 'active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: TicketType) => {
    setEditingTicket(t);
    setFormData({
      name: t.name,
      price: t.price,
      validity: t.validity,
      description: t.description,
      status: t.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus kategori tiket ini?')) {
      storageService.deleteTicketType(id, currentUser);
      refreshData();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price <= 0) {
      alert('Nama tiket dan harga harus valid.');
      return;
    }

    const id = editingTicket ? editingTicket.id : `tkt-${Date.now()}`;
    const newTicket: TicketType = {
      id,
      destinationId: selectedDestId || destinations[0]?.id || 'dest-kiluan',
      name: formData.name,
      price: Number(formData.price),
      validity: formData.validity,
      description: formData.description,
      status: formData.status,
    };

    storageService.saveTicketType(newTicket, currentUser);
    setModalOpen(false);
    refreshData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider">
            Pengaturan Retribusi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Kategori & Tarif Tiket Masuk
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Konfigurasi jenis tiket, paket atraksi lokal, dan nilai retribusi per destinasi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Tiket</span>
        </button>
      </div>

      {/* Snapshotting Rule Alert */}
      <div className="bg-sand-100/90 border border-sand-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-charcoal">
        <ShieldCheck className="w-4 h-4 text-emerald-850 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-emerald-850 font-bold block">
            Aturan Bisnis: Snapshot Harga Transaksi
          </strong>
          <span className="text-muted leading-relaxed">
            Perubahan harga pada formulir ini hanya berlaku untuk pesanan baru. Seluruh riwayat pemesanan yang telah terjadi sebelumnya tetap menggunakan snapshot harga pada saat invoice dibuat.
          </span>
        </div>
      </div>

      {/* Destination Filter Select */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-charcoal w-full sm:w-auto">
          <MapPin className="w-4 h-4 text-emerald-850" />
          <span>Pilih Destinasi Wisata:</span>
        </div>
        <select
          value={selectedDestId}
          onChange={(e) => setSelectedDestId(e.target.value)}
          className="w-full sm:w-80 px-3.5 py-2 bg-ivory-50 border border-sand-200 rounded-xl text-xs font-semibold text-charcoal focus:ring-2 focus:ring-emerald-700"
        >
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.kecamatan})
            </option>
          ))}
        </select>
      </div>

      {/* Ticket List Table */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-50 border-b border-sand-200 text-muted uppercase font-bold text-[10px]">
                <th className="py-3.5 px-4">Nama Tiket / Paket</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4">Masa Berlaku</th>
                <th className="py-3.5 px-4">Tarif (Rp)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-medium text-charcoal">
              {currentDestinationTickets.map((t) => (
                <tr key={t.id} className="hover:bg-ivory-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="text-charcoal block">{t.name}</strong>
                    <span className="text-[10px] text-muted font-mono">{t.id}</span>
                  </td>
                  <td className="py-3 px-4 text-muted max-w-xs truncate">{t.description}</td>
                  <td className="py-3 px-4">{t.validity}</td>
                  <td className="py-3 px-4 font-bold text-emerald-850">
                    Rp {t.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 rounded-lg text-emerald-850 hover:bg-emerald-50 transition-colors"
                        title="Ubah Tarif Tiket"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Tiket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-sand-200 shadow-elevated space-y-6">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <h3 className="font-extrabold text-charcoal text-base">
                {editingTicket ? 'Ubah Tarif & Kategori Tiket' : 'Tambah Kategori Tiket Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-charcoal">Nama Kategori Tiket *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Tiket Masuk Reguler (Dewasa)"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal">Tarif Tiket (Rp) *</label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal">Masa Berlaku</label>
                <input
                  type="text"
                  value={formData.validity}
                  onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                  placeholder="Contoh: 1 Hari Kunjungan, Sesi Pagi"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal">Keterangan / Fasilitas Termasuk</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Contoh: Sudah termasuk asuransi retribusi dan akses fasilitas umum..."
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-sand-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-charcoal font-semibold bg-ivory-200 hover:bg-sand-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-850 hover:bg-emerald-900 text-white shadow-soft transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Tarif</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
