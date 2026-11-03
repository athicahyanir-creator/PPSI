import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage';
import {
  Compass,
  Search,
  ArrowRight,
  ShieldCheck,
  QrCode,
  MapPin,
  Star,
  Users,
  Calendar,
  Sparkles,
  Waves,
  Mountain,
  Trees,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const destinations = storageService.getDestinations().filter((d) => d.status === 'active');
  const featuredDestinations = destinations.filter((d) => d.featured).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/destinasi?q=${encodeURIComponent(searchTerm)}`);
  };

  const categoryTags = [
    { label: 'Semua Destinasi', icon: Compass, query: '' },
    { label: 'Bahari & Teluk', icon: Waves, query: 'bahari' },
    { label: 'Air Terjun Alami', icon: Sparkles, query: 'air_terjun' },
    { label: 'Perbukitan & Danau', icon: Mountain, query: 'perbukitan' },
  ];

  return (
    <div className="min-h-screen bg-ivory-100">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-850 to-charcoal text-white pt-16 pb-28 lg:pt-24 lg:pb-36">
        {/* Ambient background glow & pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#55A99B_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-teal/30 text-teal-300 text-xs font-semibold backdrop-blur-sm shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-sand-200" />
              <span>E-Ticketing & Gerbang Masuk Digital Resmi Kabupaten Tanggamus</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Jelajahi Pesona <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sand-200 to-coral">
                Tanggamus Nan Alami
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-sand-100/90 leading-relaxed font-normal">
              Dari tarian lumba-lumba liar Teluk Kiluan, deburan ombak karang Gigi Hiu, hingga sejuknya air terjun lereng Gunung Tanggamus. Pesan tiket digital dengan mudah, aman, dan tanpa antre.
            </p>

            {/* Quick Search Card */}
            <div className="pt-4 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-elevated border border-sand-200/50 flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex items-center gap-3 px-3 w-full">
                  <Search className="w-5 h-5 text-muted shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari wisata (contoh: Kiluan, Gigi Hiu, Air Terjun)..."
                    className="w-full bg-transparent text-charcoal placeholder-muted text-sm sm:text-base focus:outline-none py-1.5"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-emerald-850 to-forest-green hover:from-emerald-900 hover:to-emerald-800 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-soft flex items-center justify-center gap-2"
                >
                  <span>Cari Destinasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-sand-200">
                <span className="text-sand-300/80">Kategori Populer:</span>
                {categoryTags.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(cat.query ? `/destinasi?cat=${cat.query}` : '/destinasi')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-ivory-100 border border-white/10 transition-colors"
                  >
                    <cat.icon className="w-3 h-3 text-teal-400" />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Advantage Strip */}
      <section className="-mt-12 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-sand-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-850 flex items-center justify-center shrink-0 border border-emerald-100">
              <QrCode className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal text-base">Tiket QR Mandiri</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Langsung terima tiket digital ber-QR unik ke smartphone tanpa perlu cetak karcis manual di gerbang.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-100">
              <ShieldCheck className="w-6 h-6 text-teal" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal text-base">Validasi Anti-Ganda</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Sistem gerbang memastikan tiap tiket hanya berlaku 1 kali, mencatat riwayat petugas dan waktu masuk secara transparan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100">
              <Trees className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal text-base">Ekowisata Tanggamus</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Mendukung pelestarian habitat lumba-lumba, hutan lindung Bukit Barisan Selatan, dan pemberdayaan pekon lokal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-teal font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Destinasi Favorit Wisatawan</span>
            </div>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
              Pesona Pilihan di Tanggamus
            </h2>
            <p className="text-muted text-sm mt-1 max-w-xl">
              Rekomendasi tempat wisata alam terbaik yang dapat langsung Anda pesan tiketnya sekarang.
            </p>
          </div>

          <Link
            to="/destinasi"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-850 hover:text-emerald-700 transition-colors"
          >
            <span>Lihat Semua Destinasi ({destinations.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Image banner */}
              <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-850 shadow-sm">
                  {dest.category === 'bahari'
                    ? '🌊 Bahari & Teluk'
                    : dest.category === 'air_terjun'
                    ? '💧 Air Terjun'
                    : '⛰️ Perbukitan'}
                </div>
                <div className="absolute top-3 right-3 bg-charcoal/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-sand-200 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-coral shrink-0" />
                    <span>Kec. {dest.kecamatan}</span>
                  </div>
                  <h3 className="font-bold text-charcoal text-base group-hover:text-emerald-850 transition-colors line-clamp-1">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                    {dest.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-sand-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted block uppercase font-medium">Mulai dari</span>
                    <span className="text-sm font-extrabold text-emerald-850">
                      Rp 10.000 <span className="text-[10px] font-normal text-muted">/orang</span>
                    </span>
                  </div>

                  <Link
                    to={`/destinasi/${dest.slug}`}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-850 hover:text-white text-emerald-850 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    <span>Pesan</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-sand-100/60 border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-emerald-850 uppercase tracking-widest">
              Langkah Sederhana
            </span>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
              Cara Pemesanan Tiket di WisataPay
            </h2>
            <p className="text-sm text-muted">
              Hanya butuh 3 langkah singkat dari ponsel Anda untuk mendapatkan tiket resmi kunjungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-soft text-center relative space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-850 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-soft">
                1
              </div>
              <h3 className="font-bold text-lg text-charcoal">Pilih Destinasi & Tanggal</h3>
              <p className="text-xs text-muted leading-relaxed">
                Tentukan objek wisata di Tanggamus yang ingin dikunjungi, pilih tanggal kunjungan, dan jumlah tiket yang dibutuhkan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-soft text-center relative space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-soft">
                2
              </div>
              <h3 className="font-bold text-lg text-charcoal">Isi Data & Bayar Simulasi</h3>
              <p className="text-xs text-muted leading-relaxed">
                Lengkapi nama pemesan dan nomor kontak. Lakukan konfirmasi pembayaran melalui simulasi QRIS atau Virtual Account.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-soft text-center relative space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-coral text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-soft">
                3
              </div>
              <h3 className="font-bold text-lg text-charcoal">Tunjukkan QR di Pintu Masuk</h3>
              <p className="text-xs text-muted leading-relaxed">
                Simpan tiket digital Anda. Setibanya di pos gerbang wisata, petugas loket akan memvalidasi QR code Anda secara instan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Tanggamus Local Tourism Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-charcoal text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-card">
          <div className="max-w-xl space-y-6 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-teal/20 text-teal-300 text-xs font-semibold border border-teal/30">
              Tips Wisata Tanggamus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Waktu Terbaik Menyapa Kawanan Lumba-Lumba Kiluan
            </h2>
            <p className="text-sand-100/90 text-sm sm:text-base leading-relaxed">
              Kawanan lumba-lumba hidung botol dan paruh panjang di Teluk Kiluan paling aktif berenang di permukaan laut antara pukul 06.00 hingga 08.30 pagi WIB. Disarankan berangkat subuh atau menginap di homestay pekon terdekat.
            </p>
            <div className="pt-2">
              <Link
                to="/destinasi/teluk-kiluan"
                className="inline-flex items-center gap-2 bg-teal hover:bg-teal-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-soft transition-all active:scale-95"
              >
                <span>Lihat Informasi Teluk Kiluan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 hidden lg:block pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80"
              alt="Lumba-lumba"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
};
