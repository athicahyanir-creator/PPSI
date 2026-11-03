import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { AlertCircle, UserCheck, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { storageService } from '../../services/storage';

export const DemoBanner: React.FC = () => {
  const { currentUser, switchRole, allUsers } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset semua data demo kembali ke kondisi awal? Semua pesanan baru akan direset ke sampel.')) {
      setResetting(true);
      storageService.initIfEmpty(true);
      window.location.reload();
    }
  };

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    tourist: { label: 'Wisatawan', badge: 'Publik', color: 'bg-teal/20 text-teal-600 border-teal/30' },
    staff: { label: 'Petugas Tiket', badge: 'Pos Gerbang', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    manager: { label: 'Manajer Pariwisata', badge: 'Monitoring', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    admin: { label: 'Administrator', badge: 'Sistem Penuh', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  };

  return (
    <div className="bg-charcoal text-ivory-100 text-xs py-2 px-4 border-b border-sand-300/20 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left disclaimer */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soft-coral opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
          </span>
          <span className="font-semibold text-sand-200">PROTOTIPE DEMO:</span>
          <span className="text-sand-100/80 hidden sm:inline">
            Sistem Informasi Wisata Kab. Tanggamus — Data simulasi & pembayaran tanpa transaksi nyata.
          </span>
        </div>

        {/* Right role switcher & reset */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sand-200 hidden md:inline">Peran Aktif:</span>

          {/* Quick role pills */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-charcoal-700 hover:bg-charcoal-900 px-3 py-1.5 rounded-lg border border-sand-300/30 text-ivory-50 transition-colors"
              title="Ganti peran pengguna untuk menguji hak akses"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal" />
              <span className="font-medium">{currentUser.name.split(' ')[0]}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${roleLabels[currentUser.role].color}`}>
                {roleLabels[currentUser.role].label}
              </span>
              <ChevronDown className="w-3 h-3 text-sand-200" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white text-charcoal rounded-xl shadow-elevated border border-sand-200 py-1.5 z-50">
                <div className="px-3 py-1.5 border-b border-sand-100 text-[11px] font-semibold text-muted">
                  PILIH PERAN DEMO (1-KLIK)
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchRole(u.role);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-ivory-100 transition-colors ${
                      currentUser.role === u.role ? 'bg-emerald-50 text-emerald-850 font-medium' : ''
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{u.name}</div>
                      <div className="text-[10px] text-muted">{u.department || roleLabels[u.role].label}</div>
                    </div>
                    {currentUser.role === u.role && <Check className="w-4 h-4 text-emerald-700" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 bg-charcoal-700 hover:bg-rose-950/40 text-sand-200 hover:text-rose-300 px-2.5 py-1.5 rounded-lg border border-sand-300/20 transition-colors"
            title="Kembalikan semua data ke sampel awal"
          >
            <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Data Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
