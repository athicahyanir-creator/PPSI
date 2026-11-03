import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Ticket,
  QrCode,
  LayoutDashboard,
  Menu,
  X,
  LogIn,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Katalog Wisata', path: '/destinasi' },
    { label: 'Cek Tiket', path: '/cek-tiket' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sand-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-850 to-emerald-700 flex items-center justify-center text-ivory-50 shadow-soft group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-emerald-850 block leading-tight">
                Tanggamus <span className="text-teal font-black">WisataPay</span>
              </span>
              <span className="text-[11px] font-medium text-muted tracking-wider uppercase block">
                Kabupaten Tanggamus, Lampung
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-850 border border-emerald-100 shadow-sm'
                    : 'text-charcoal-700 hover:text-emerald-850 hover:bg-ivory-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Role-specific Nav Links */}
            {(currentUser.role === 'staff' || currentUser.role === 'admin') && (
              <Link
                to="/petugas/validasi"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/petugas/validasi')
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'text-amber-800 bg-amber-50/70 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <QrCode className="w-4 h-4 text-amber-700" />
                <span>Pos Validasi QR</span>
              </Link>
            )}

            {(currentUser.role === 'manager' || currentUser.role === 'admin') && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin')
                    ? 'bg-emerald-850 text-white shadow-soft'
                    : 'text-emerald-850 bg-emerald-100/70 hover:bg-emerald-200/80'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Pengelola</span>
              </Link>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/destinasi"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-850 to-forest-green hover:from-emerald-900 hover:to-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-soft hover:shadow-card transition-all active:scale-95"
            >
              <Ticket className="w-4 h-4 text-sand-200" />
              <span>Pesan Tiket Wisata</span>
            </Link>

            <Link
              to="/login"
              className="p-2.5 rounded-xl text-muted hover:text-charcoal hover:bg-ivory-200 transition-colors"
              title="Halaman Login & Pilihan Akses Role"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-charcoal hover:bg-ivory-200 transition-colors"
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-sand-200 px-4 pt-2 pb-6 space-y-2 shadow-card">
          <div className="py-2 border-b border-sand-100 mb-2">
            <div className="text-xs text-muted">Akun Masuk Saat Ini:</div>
            <div className="font-semibold text-charcoal text-sm">{currentUser.name}</div>
            <div className="text-xs text-teal font-medium uppercase">{currentUser.role}</div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-semibold ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-850 font-bold'
                  : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {(currentUser.role === 'staff' || currentUser.role === 'admin') && (
            <Link
              to="/petugas/validasi"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-amber-900 bg-amber-50"
            >
              <QrCode className="w-5 h-5" />
              <span>Pos Validasi QR</span>
            </Link>
          )}

          {(currentUser.role === 'manager' || currentUser.role === 'admin') && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-white bg-emerald-850"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard Pengelola</span>
            </Link>
          )}

          <div className="pt-4 border-t border-sand-100 flex flex-col gap-2">
            <Link
              to="/destinasi"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-emerald-850 text-white py-3 rounded-xl font-bold shadow-soft"
            >
              Pesan Tiket Sekarang
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-ivory-200 text-charcoal py-2.5 rounded-xl font-semibold text-sm"
            >
              Ganti Akun Demo / Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
