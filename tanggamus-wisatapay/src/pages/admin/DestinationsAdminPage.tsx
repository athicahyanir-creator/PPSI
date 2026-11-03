import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { Destination, DestinationCategory } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  MapPin,
  Plus,
  Edit,
  Eye,
  Power,
  X,
  Save,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

export const DestinationsAdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>(() => storageService.getDestinations());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'bahari' as DestinationCategory,
    kecamatan: '',
    address: '',
    openingHours: '07.00 - 18.00 WIB',
    shortDescription: '',
    description: '',
    image: '',
    status: 'active' as 'active' | 'inactive',
  });

  const refreshData = () => {
    setDestinations(storageService.getDestinations());
  };

  const handleOpenAdd = () => {
    setEditingDest(null);
    setFormData({
      name: '',
      category: 'bahari',
      kecamatan: '',
      address: '',
      openingHours: '07.00 - 18.00 WIB',
      shortDescription: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      status: 'active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (dest: Destination) => {
    setEditingDest(dest);
    setFormData({
      name: dest.name,
      category: dest.category,
      kecamatan: dest.kecamatan,
      address: dest.address,
      openingHours: dest.openingHours,
      shortDescription: dest.shortDescription,
      description: dest.description,
      image: dest.image,
      status: dest.status,
    });
    setModalOpen(true);
  };

  const handleToggleStatus = (dest: Destination) => {
    storageService.toggleDestinationStatus(dest.id, currentUser);
    refreshData();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.kecamatan.trim()) {
      alert('Nama destinasi dan kecamatan wajib diisi.');
      return;
    }

    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = editingDest ? editingDest.id : `dest-${Date.now()}`;

    const newDest: Destination = {
      id,
      name: formData.name,
      slug,
      category: formData.category,
      kecamatan: formData.kecamatan,
      address: formData.address || `Kecamatan ${formData.kecamatan}, Kabupaten Tanggamus, Lampung`,
      openingHours: formData.openingHours,
      shortDescription: formData.shortDescription || 'Objek wisata alam unggulan di Kabupaten Tanggamus.',
      description: formData.description || formData.shortDescription,
      latitude: editingDest ? editingDest.latitude : -5.5,
      longitude: editingDest ? editingDest.longitude : 104.8,
      status: formData.status,
      image: formData.image,
      gallery: editingDest ? editingDest.gallery : [formData.image],
      facilities: editingDest ? editingDest.facilities : ['Toilet Bersih', 'Area Parkir', 'Pusat Informasi'],
      highlights: editingDest ? editingDest.highlights : ['Pemandangan Alam', 'Spot Foto'],
      rating: editingDest ? editingDest.rating : 4.8,
      reviewsCount: editingDest ? editingDest.reviewsCount : 12,
      featured: editingDest ? editingDest.featured : false,
    };

    storageService.saveDestination(newDest, currentUser);
    setModalOpen(false);
    refreshData();
  };

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.kecamatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider">
            Manajemen Master Data
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Destinasi Wisata Kabupaten Tanggamus
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Tambah objek wisata baru, perbarui profil, atau nonaktifkan untuk publikasi katalog.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Destinasi Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari destinasi atau kecamatan..."
          className="w-full text-xs text-charcoal bg-transparent focus:outline-none placeholder-muted"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-50 border-b border-sand-200 text-muted uppercase font-bold text-[10px]">
                <th className="py-3.5 px-4">Foto & Nama Destinasi</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Kecamatan</th>
                <th className="py-3.5 px-4">Jam Buka</th>
                <th className="py-3.5 px-4">Status Katalog</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-medium text-charcoal">
              {filtered.map((dest) => (
                <tr key={dest.id} className="hover:bg-ivory-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-xl overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <strong className="text-charcoal block text-xs">{dest.name}</strong>
                        <span className="text-[10px] text-muted font-mono">{dest.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize">{dest.category.replace('_', ' ')}</td>
                  <td className="py-3 px-4">{dest.kecamatan}</td>
                  <td className="py-3 px-4 text-muted">{dest.openingHours}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={dest.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(dest)}
                        className="p-1.5 rounded-lg text-emerald-850 hover:bg-emerald-50 transition-colors"
                        title="Ubah Data Destinasi"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(dest)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          dest.status === 'active'
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                        title={dest.status === 'active' ? 'Nonaktifkan Destinasi' : 'Aktifkan Destinasi'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-sand-200 shadow-elevated space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <h3 className="font-extrabold text-charcoal text-lg">
                {editingDest ? 'Ubah Destinasi Wisata' : 'Tambah Destinasi Wisata Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-charcoal hover:bg-ivory-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-charcoal">Nama Objek Wisata *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Teluk Kiluan, Pantai Gigi Hiu"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-charcoal">Kategori Wisata</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  >
                    <option value="bahari">Bahari & Teluk</option>
                    <option value="air_terjun">Air Terjun Alami</option>
                    <option value="perbukitan">Perbukitan & Danau</option>
                    <option value="budaya">Wisata Budaya & Sejarah</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-charcoal">Kecamatan di Tanggamus *</label>
                  <input
                    type="text"
                    required
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    placeholder="Contoh: Kelumbayan, Kota Agung, Gisting"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-charcoal">Alamat Lengkap / Pekon</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Contoh: Pekon Kiluan Negeri, Kec. Kelumbayan"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-charcoal">Jam Operasional</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    placeholder="Contoh: 06.00 - 18.00 WIB"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-charcoal">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  >
                    <option value="active">Aktif (Tampil di Katalog)</option>
                    <option value="inactive">Nonaktif (Disembunyikan)</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-charcoal">URL Foto Banner (Unsplash / Gambar)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-charcoal">Deskripsi Singkat</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Ringkasan 1 kalimat yang memikat wisatawan..."
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-charcoal">Deskripsi Lengkap</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Informasi detail mengenai daya tarik alam dan panduan berkunjung..."
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-emerald-700 text-charcoal text-xs"
                  />
                </div>

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
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
