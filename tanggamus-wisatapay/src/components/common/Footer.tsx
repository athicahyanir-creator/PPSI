import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-ivory-100 border-t border-sand-300/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-850 flex items-center justify-center text-ivory-50 border border-teal/30">
                <Compass className="w-5 h-5 text-teal-400" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Tanggamus <span className="text-teal font-black">WisataPay</span>
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Prototipe sistem informasi digital pemesanan tiket wisata, monitoring transaksi, dan validasi gerbang terpadu untuk Kabupaten Tanggamus, Provinsi Lampung.
            </p>
            <div className="flex items-center gap-2 text-xs text-sand-200">
              <MapPin className="w-4 h-4 text-coral shrink-0" />
              <span>Kota Agung, Kabupaten Tanggamus, Lampung 35384</span>
            </div>
          </div>

          {/* Destinasi Populer */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-sand-300/20 pb-2">
              Destinasi Unggulan
            </h4>
            <ul className="space-y-2.5 text-sm text-sand-100/80">
              <li>
                <Link to="/destinasi/teluk-kiluan" className="hover:text-teal transition-colors">
                  Teluk Kiluan (Dolphin Sanctuary)
                </Link>
              </li>
              <li>
                <Link to="/destinasi/pantai-gigi-hiu" className="hover:text-teal transition-colors">
                  Pantai Gigi Hiu (Pegadungan)
                </Link>
              </li>
              <li>
                <Link to="/destinasi/air-terjun-way-lalaan" className="hover:text-teal transition-colors">
                  Air Terjun Way Lalaan
                </Link>
              </li>
              <li>
                <Link to="/destinasi/bendungan-batu-tegi" className="hover:text-teal transition-colors">
                  Waduk & Bendungan Batu Tegi
                </Link>
              </li>
              <li>
                <Link to="/destinasi/bukit-idaman-gisting" className="hover:text-teal transition-colors">
                  Bukit Idaman Gisting
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan & Akses */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-sand-300/20 pb-2">
              Akses & Petugas
            </h4>
            <ul className="space-y-2.5 text-sm text-sand-100/80">
              <li>
                <Link to="/destinasi" className="hover:text-teal transition-colors">
                  Katalog Pemesanan Tiket
                </Link>
              </li>
              <li>
                <Link to="/cek-tiket" className="hover:text-teal transition-colors">
                  Cek & Validasi Tiket Digital
                </Link>
              </li>
              <li>
                <Link to="/petugas/validasi" className="hover:text-teal transition-colors flex items-center gap-1.5">
                  <span>Pos Validasi QR Petugas</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Loket</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-teal transition-colors flex items-center gap-1.5">
                  <span>Dashboard Pengelola</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Manajer</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal transition-colors">
                  Ganti Akun Demo / Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Batasan Demo & Transparansi */}
          <div className="bg-charcoal-700 p-5 rounded-2xl border border-sand-300/20">
            <div className="flex items-center gap-2 text-coral font-bold text-xs uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparansi Prototipe</span>
            </div>
            <p className="text-xs text-sand-200/90 leading-relaxed mb-3">
              Aplikasi ini adalah media studi rancang bangun sistem informasi. Data transaksi, harga tiket, dan QR code beroperasi dalam mode simulasi (sandbox).
            </p>
            <div className="text-[11px] text-muted-400 border-t border-sand-300/20 pt-2">
              Bukan aplikasi perbankan langsung atau klaim PAD resmi Pemkab Tanggamus.
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="border-t border-sand-300/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} Tanggamus WisataPay. Dirancang untuk Ekowisata Berkelanjutan Kabupaten Tanggamus.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sand-300/40">•</span>
            <span>Versi Prototipe 1.0 (Demo Mode)</span>
            <span className="text-sand-300/40">•</span>
            <span>React + TypeScript + Tailwind</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
