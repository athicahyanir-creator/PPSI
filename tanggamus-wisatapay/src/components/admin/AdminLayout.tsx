import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Ticket,
  ClipboardList,
  CreditCard,
  QrCode,
  FileSpreadsheet,
  Users,
  ScrollText,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, switchRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname === path;
  };

  const navMenuItems = [
    { label: 'Dashboard Utama', path: '/admin', icon: LayoutDashboard },
    { label: 'Destinasi Wisata', path: '/admin/destinasi', icon: MapPin },
    { label: 'Kategori & Tarif Tiket', path: '/admin/tarif', icon: Ticket },
    { label: 'Daftar Pemesanan', path: '/admin/pemesanan', icon: ClipboardList },
    { label: 'Transaksi & Rekonsiliasi', path: '/admin/transaksi', icon: CreditCard },
    { label: 'Pos Validasi Gerbang', path: '/petugas/validasi', icon: QrCode },
    { label: 'Laporan & Ekspor CSV', path: '/admin/laporan', icon: FileSpreadsheet },
    { label: 'Manajemen Pengguna', path: '/admin/pengguna', icon: Users },
    { label: 'Audit Log Sistem', path: '/admin/audit-log', icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-charcoal text-white p-4 flex items-center justify-between border-b border-sand-300/20 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-850 flex items-center justify-center text-teal">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-sm text-white">
            WisataPay <span className="text-teal text-xs">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-sand-200 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-72 bg-charcoal text-ivory-100 flex flex-col justify-between border-r border-sand-300/20 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-850 to-emerald-700 flex items-center justify-center text-ivory-50 shadow-soft border border-teal/30">
              <Compass className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                Tanggamus <span className="text-teal font-black">WisataPay</span>
              </span>
              <span className="text-[10px] font-semibold text-sand-300 uppercase tracking-wider block">
                Panel Pengelola Wisata
              </span>
            </div>
          </div>

          {/* Active Persona Card */}
          <div className="bg-charcoal-700 p-3.5 rounded-2xl border border-sand-300/20 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>Akun Aktif:</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded uppercase">
                {currentUser.role}
              </span>
            </div>
            <div className="font-bold text-white text-xs line-clamp-1">{currentUser.name}</div>
            <div className="text-[10px] text-sand-200/80 line-clamp-1">{currentUser.department || 'Dinas Pariwisata Tanggamus'}</div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 pb-1">
              Menu Utama
            </div>
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-850 text-white shadow-soft font-bold'
                      : 'text-sand-200/80 hover:text-white hover:bg-charcoal-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-teal-300' : 'text-sand-300'}`} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-teal-300" />}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sand-300/20 space-y-2 bg-charcoal-800">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-charcoal-700 hover:bg-charcoal text-sand-200 hover:text-white border border-sand-300/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Halaman Publik</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar / Ganti Akun</span>
          </button>
        </div>

      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        {currentUser.role === 'tourist' ? (
          <div className="p-6 sm:p-12 max-w-2xl mx-auto my-12 bg-white rounded-3xl border-2 border-amber-300 shadow-card text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Akses Terbatas: Peran Wisatawan
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal mt-3">
                Panel Khusus Pengelola & Administrator
              </h2>
              <p className="text-xs text-muted mt-2 max-w-md mx-auto leading-relaxed">
                Akun yang sedang aktif saat ini adalah <strong>{currentUser.name} (Wisatawan)</strong>. Panel Dashboard Pengelola hanya dapat diakses oleh peran <strong>Administrator</strong> atau <strong>Manajer</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-850 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-soft transition-all"
              >
                Beralih ke Administrator (1-Klik Demo)
              </button>
              <button
                type="button"
                onClick={() => switchRole('manager')}
                className="w-full sm:w-auto px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-soft transition-all"
              >
                Beralih ke Manajer
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto px-5 py-2.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal rounded-xl text-xs font-semibold border border-sand-200 transition-colors"
              >
                Halaman Publik
              </Link>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

    </div>
  );
};
