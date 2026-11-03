import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { User, UserRole } from '../../types';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Edit,
  Trash2,
  Power,
  X,
  Save,
  Check,
  ArrowRight,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';

export const UsersAdminPage: React.FC = () => {
  const { allUsers, currentUser, switchUser, refreshUsers } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff' as UserRole,
    department: '',
    status: 'active' as 'active' | 'inactive',
    avatar: '',
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      department: 'Petugas Pos Validasi Pintu Masuk',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
      status: user.status,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Nama dan Email wajib diisi.');
      return;
    }

    const id = editingUser ? editingUser.id : `usr-${Date.now()}`;
    const userToSave: User = {
      id,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department.trim() || undefined,
      status: formData.status,
      avatar: formData.avatar.trim() || undefined,
    };

    storageService.saveUser(userToSave, currentUser);
    refreshUsers();
    setModalOpen(false);
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser.id) {
      alert('Tidak dapat menghapus akun yang sedang Anda gunakan.');
      return;
    }

    if (window.confirm(`Hapus akun pengguna "${user.name}" (${user.role})?`)) {
      const ok = storageService.deleteUser(user.id, currentUser);
      if (ok) {
        refreshUsers();
      }
    }
  };

  const handleToggleStatus = (user: User) => {
    storageService.toggleUserStatus(user.id, currentUser);
    refreshUsers();
  };

  const filteredUsers = allUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider">
            Akses & Otoritas
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Manajemen Pengguna & Hak Akses
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Kelola akun pengelola, petugas loket, serta profil simulasi wisatawan pada Tanggamus WisataPay.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-2xl bg-ivory-50 border border-sand-200 text-xs text-muted flex items-start gap-3">
        <Info className="w-4 h-4 text-teal shrink-0 mt-0.5" />
        <div>
          <strong className="text-charcoal block mb-0.5">Mode Prototipe RBAC:</strong>
          Pengguna dapat ditambah, diubah perannya, atau dinonaktifkan. Anda juga dapat langsung menguji antarmuka setiap peran dengan menekan tombol <strong>"Beralih ke Akun Ini"</strong>.
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau unit tugas..."
            className="w-full pl-10 pr-4 py-2 bg-ivory-50 border border-sand-200 rounded-xl text-xs text-charcoal focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs text-muted font-medium">Peran:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-ivory-50 border border-sand-200 text-charcoal text-xs font-semibold py-2 px-3 rounded-xl focus:ring-2 focus:ring-emerald-700 w-full sm:w-auto"
          >
            <option value="all">Semua Peran ({allUsers.length})</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manajer</option>
            <option value="staff">Petugas Loket</option>
            <option value="tourist">Wisatawan</option>
          </select>
        </div>
      </div>

      {/* Grid of Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map((u) => {
          const isCurrent = currentUser.id === u.id;
          return (
            <div
              key={u.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-soft flex flex-col justify-between space-y-4 ${
                isCurrent ? 'border-emerald-700 ring-2 ring-emerald-700/20' : 'border-sand-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      u.role === 'admin'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : u.role === 'manager'
                        ? 'bg-emerald-50 text-emerald-850 border-emerald-200'
                        : u.role === 'staff'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}>
                      PERAN: {u.role}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>Sedang Aktif</span>
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={u.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-sand-200 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-charcoal text-base truncate">{u.name}</h3>
                    <div className="text-xs text-muted font-mono truncate">{u.email}</div>
                    <div className="text-xs text-teal font-medium mt-0.5 truncate">{u.department || 'Dinas Pariwisata Tanggamus'}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sand-100 text-xs text-muted">
                  <span className="font-bold text-charcoal block mb-1">Cakupan Akses:</span>
                  {u.role === 'admin' && 'Kelola seluruh destinasi, ubah tarif tiket, audit log, manajemen pengguna, dan dashboard.'}
                  {u.role === 'manager' && 'Akses dasbor monitoring tren kunjungan, evaluasi nilai transaksi, laporan keuangan, dan ekspor CSV.'}
                  {u.role === 'staff' && 'Validasi QR code e-tiket di gerbang masuk wisata, cek status tiket, dan catat check-in pengunjung.'}
                  {u.role === 'tourist' && 'Akses halaman katalog publik, pemesanan tiket, dan tiket digital ber-QR Code.'}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-sand-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(u)}
                    className="flex-1 py-2 px-3 rounded-xl border border-sand-200 hover:bg-ivory-100 text-xs font-bold text-charcoal flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-emerald-850" />
                    <span>Edit Profil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(u)}
                    className="p-2 rounded-xl border border-sand-200 hover:bg-ivory-100 text-xs font-bold text-muted hover:text-charcoal transition-colors"
                    title={u.status === 'active' ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna'}
                  >
                    <Power className={`w-3.5 h-3.5 ${u.status === 'active' ? 'text-emerald-700' : 'text-zinc-400'}`} />
                  </button>

                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleDelete(u)}
                      className="p-2 rounded-xl border border-sand-200 hover:bg-rose-50 text-xs font-bold text-rose-600 hover:border-rose-300 transition-colors"
                      title="Hapus Akun Pengguna"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => switchUser(u)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-850 cursor-default border border-emerald-200'
                      : 'bg-emerald-850 hover:bg-emerald-900 text-white shadow-soft'
                  }`}
                >
                  <span>{isCurrent ? 'Profil Sedang Digunakan' : `Beralih ke Akun Ini`}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-sand-200 shadow-card max-w-lg w-full p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-sand-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-850">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-charcoal text-base">
                    {editingUser ? 'Edit Akun Pengguna' : 'Tambah Pengguna Baru'}
                  </h3>
                  <span className="text-[11px] text-muted">
                    Sistem Hak Akses Berbasis Peran (RBAC) Tanggamus WisataPay
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-muted hover:text-charcoal hover:bg-ivory-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Rahmat Pratama, S.Kom."
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl text-xs text-charcoal focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Alamat Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@wisatapay.tanggamus.go.id"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl text-xs text-charcoal focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal">Peran / Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl text-xs text-charcoal focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="admin">Administrator (Akses Penuh)</option>
                    <option value="manager">Manajer (Monitoring & Laporan)</option>
                    <option value="staff">Petugas Loket (Validasi QR)</option>
                    <option value="tourist">Wisatawan (Publik)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl text-xs text-charcoal focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">Unit / Divisi / Instansi</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Contoh: Disparbud Tanggamus / Pokdarwis Kiluan Negeri"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl text-xs text-charcoal focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal">URL Foto Avatar (Opsional)</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl text-xs text-charcoal focus:ring-2 focus:ring-emerald-700 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-sand-200 text-xs font-bold text-charcoal hover:bg-ivory-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-850 hover:bg-emerald-900 text-white text-xs font-bold shadow-soft flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
