import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Compass,
  ShieldCheck,
  User,
  LayoutDashboard,
  QrCode,
  Ticket,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { allUsers, switchUser, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSelectUser = (role: UserRole) => {
    const target = allUsers.find((u) => u.role === role);
    if (target) {
      switchUser(target);
      if (role === 'admin' || role === 'manager') {
        navigate('/admin');
      } else if (role === 'staff') {
        navigate('/petugas/validasi');
      } else {
        navigate('/destinasi');
      }
    }
  };

  const personaCards = [
    {
      role: 'admin' as UserRole,
      title: 'Administrator Sistem',
      badge: 'Akses Penuh',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: ShieldCheck,
      name: 'Rahmat Pratama, S.Kom.',
      email: 'admin@wisatapay.tanggamus.go.id',
      desc: 'Kelola destinasi wisata, atur tarif tiket, pantau audit log, dan konfigurasi master data.',
      targetRoute: '/admin',
    },
    {
      role: 'manager' as UserRole,
      title: 'Manajer Pariwisata / Pengelola',
      badge: 'Monitoring',
      badgeColor: 'bg-emerald-100 text-emerald-850 border-emerald-200',
      icon: LayoutDashboard,
      name: 'Dra. Hj. Nur Indahsari, M.M.',
      email: 'manager@wisatapay.tanggamus.go.id',
      desc: 'Pantau grafik tren kunjungan, evaluasi nilai transaksi, buka laporan berkala, dan ekspor CSV.',
      targetRoute: '/admin',
    },
    {
      role: 'staff' as UserRole,
      title: 'Petugas Gerbang & Loket',
      badge: 'Operasional',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: QrCode,
      name: 'Budi Kurniawan (Loket)',
      email: 'petugas.kiluan@wisatapay.tanggamus.go.id',
      desc: 'Validasi QR code tiket pengunjung, periksa kode unik tiket, dan catat check-in masuk.',
      targetRoute: '/petugas/validasi',
    },
    {
      role: 'tourist' as UserRole,
      title: 'Wisatawan (Publik)',
      badge: 'Publik',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: Ticket,
      name: 'Andi Saputra',
      email: 'wisatawan@gmail.com',
      desc: 'Jelajahi keindahan Tanggamus, pesan tiket secara online, dan dapatkan QR e-tiket digital.',
      targetRoute: '/destinasi',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-emerald-850 to-emerald-700 flex items-center justify-center text-white mx-auto shadow-soft">
            <Compass className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-charcoal tracking-tight">
            Login & Akses Hak Pengguna
          </h1>
          <p className="text-xs text-muted">
            Pilih salah satu profil demo di bawah untuk merasakan antarmuka dan hak akses yang berbeda dalam sistem Tanggamus WisataPay.
          </p>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personaCards.map((persona) => {
            const Icon = persona.icon;
            const isCurrent = currentUser.role === persona.role;

            return (
              <div
                key={persona.role}
                className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-soft hover:shadow-card flex flex-col justify-between space-y-4 ${
                  isCurrent ? 'border-emerald-700 ring-2 ring-emerald-700/20' : 'border-sand-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${persona.badgeColor}`}>
                      {persona.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[11px] font-extrabold text-emerald-850 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        ✓ Akun Sedang Aktif
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-ivory-100 border border-sand-200 flex items-center justify-center text-emerald-850 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-charcoal text-base">
                        {persona.title}
                      </h3>
                      <div className="text-xs font-semibold text-emerald-850 mt-0.5">
                        {persona.name}
                      </div>
                      <div className="text-[11px] text-muted font-mono">{persona.email}</div>
                    </div>
                  </div>

                  <p className="text-xs text-muted mt-3 leading-relaxed">
                    {persona.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectUser(persona.role)}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isCurrent
                      ? 'bg-emerald-850 text-white shadow-soft'
                      : 'bg-ivory-100 hover:bg-emerald-50 text-charcoal hover:text-emerald-850 border border-sand-200'
                  }`}
                >
                  <span>{isCurrent ? 'Lanjut ke Menu Peran Ini' : `Masuk sebagai ${persona.title}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted max-w-lg mx-auto">
          * Seluruh akun di atas beroperasi dalam mode prototipe lokal untuk keperluan pengujian dan evaluasi tugas sistem informasi.
        </div>

      </div>
    </div>
  );
};
