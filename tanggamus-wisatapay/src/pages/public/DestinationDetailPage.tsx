import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage';
import {
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Plus,
  Minus,
  Ticket,
  ArrowRight,
  ChevronLeft,
  Share2,
  Info,
} from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const destination = storageService.getDestinationBySlug(slug || '');
  const ticketTypes = storageService.getTicketTypes(destination?.id);

  // Booking state
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [visitDate, setVisitDate] = useState<string>(tomorrow);
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>(() => {
    // default 1 for the first ticket type
    if (ticketTypes.length > 0) {
      return { [ticketTypes[0].id]: 1 };
    }
    return {};
  });

  if (!destination) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-sand-200 text-center max-w-md space-y-4 shadow-card">
          <Info className="w-12 h-12 text-coral mx-auto" />
          <h2 className="text-xl font-bold text-charcoal">Destinasi Tidak Ditemukan</h2>
          <p className="text-sm text-muted">
            Destinasi wisata yang Anda cari tidak tersedia atau sedang dinonaktifkan oleh administrator.
          </p>
          <Link
            to="/destinasi"
            className="inline-block px-5 py-2.5 bg-emerald-850 text-white rounded-xl text-sm font-semibold"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (id: string, delta: number) => {
    setTicketQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedItems = ticketTypes
    .map((t) => ({
      ticketType: t,
      quantity: ticketQuantities[t.id] || 0,
    }))
    .filter((i) => i.quantity > 0);

  const totalTickets = selectedItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = selectedItems.reduce(
    (acc, i) => acc + i.ticketType.price * i.quantity,
    0
  );

  const handleProceedToBooking = () => {
    if (totalTickets === 0) {
      alert('Silakan pilih minimal 1 tiket kunjungan.');
      return;
    }

    // Pass data through navigation state
    navigate('/pesan-tiket', {
      state: {
        destination,
        visitDate,
        items: selectedItems.map((item) => ({
          ticketTypeId: item.ticketType.id,
          ticketTypeName: item.ticketType.name,
          quantity: item.quantity,
          unitPrice: item.ticketType.price,
        })),
      },
    });
  };

  return (
    <div className="min-h-screen bg-ivory-100 pb-20">
      
      {/* Top Breadcrumb & Actions */}
      <div className="bg-white border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <Link
            to="/destinasi"
            className="flex items-center gap-1.5 text-muted hover:text-emerald-850 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Wisata</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-muted">ID Destinasi: <code className="bg-ivory-200 px-1.5 py-0.5 rounded text-[11px]">{destination.id}</code></span>
          </div>
        </div>
      </div>

      {/* Hero Banner Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-sand-200 aspect-[16/8] sm:aspect-[21/9] bg-charcoal">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-850/90 text-teal-300 border border-teal/40 text-xs font-bold uppercase backdrop-blur-sm">
                {destination.category.replace('_', ' ')}
              </span>
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-sand-200 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{destination.rating}</span>
                <span className="text-[11px] text-sand-300/80">({destination.reviewsCount} ulasan)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {destination.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-sand-100/90">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-coral" />
                <span>{destination.address}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-300" />
                <span>Jam Buka: {destination.openingHours}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Details, Highlights, Facilities */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Description */}
            <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-charcoal">Tentang Destinasi</h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-charcoal">Daya Tarik Utama</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-ivory-100 border border-sand-200 text-xs sm:text-sm font-semibold text-charcoal"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-charcoal">Fasilitas yang Tersedia</h2>
              <div className="flex flex-wrap gap-2.5">
                {destination.facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-2 rounded-xl bg-ivory-100 text-charcoal text-xs sm:text-sm font-medium border border-sand-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {destination.gallery.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-soft space-y-4">
                <h2 className="text-xl font-bold text-charcoal">Dokumentasi Foto</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {destination.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand-100 border border-sand-200"
                    >
                      <img
                        src={img}
                        alt={`${destination.name} ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer box */}
            <div className="bg-ivory-200/60 p-5 rounded-2xl border border-sand-300/40 text-xs text-muted flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-850 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal block mb-0.5">Catatan Validasi Tiket Digital:</strong>
                Tiket yang dipesan memiliki kode unik terenkripsi dan token QR. Pastikan menunjukkan tiket melalui gawai Anda di pintu gerbang retribusi Pekon atau pos loket resmi. Tiket tidak dapat divalidasi ulang setelah gerbang dibuka.
              </div>
            </div>

          </div>

          {/* Right Column: Live Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 border border-sand-200 shadow-card space-y-6">
              
              <div className="border-b border-sand-100 pb-4">
                <div className="text-xs font-bold text-teal uppercase tracking-wider">
                  Pemesanan Tiket
                </div>
                <h3 className="text-xl font-extrabold text-charcoal mt-1">
                  Pilih Tiket & Jadwal
                </h3>
                <p className="text-xs text-muted mt-1">
                  Data tarif demo untuk pengujian sistem informasi.
                </p>
              </div>

              {/* Visit Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-850" />
                  <span>Tanggal Rencana Kunjungan:</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl text-sm font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Ticket Types List */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-charcoal block">
                  Kategori Tiket & Tarif:
                </label>

                {ticketTypes.length > 0 ? (
                  ticketTypes.map((type) => {
                    const qty = ticketQuantities[type.id] || 0;
                    return (
                      <div
                        key={type.id}
                        className="p-3.5 rounded-2xl bg-ivory-50 border border-sand-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="text-xs font-bold text-charcoal">{type.name}</div>
                          <div className="text-[11px] text-muted">{type.description}</div>
                          <div className="text-xs font-extrabold text-emerald-850 mt-1">
                            Rp {type.price.toLocaleString('id-ID')}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(type.id, -1)}
                            disabled={qty === 0}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              qty === 0
                                ? 'bg-sand-200 text-muted cursor-not-allowed'
                                : 'bg-white hover:bg-emerald-50 text-charcoal border border-sand-200 shadow-sm'
                            }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-charcoal">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(type.id, 1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-emerald-50 text-charcoal border border-sand-200 shadow-sm flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-muted text-center py-4 bg-ivory-50 rounded-xl">
                    Belum ada tarif tiket aktif untuk destinasi ini.
                  </div>
                )}
              </div>

              {/* Subtotal Calculation */}
              <div className="pt-4 border-t border-sand-100 space-y-2">
                <div className="flex justify-between text-xs text-muted">
                  <span>Total Tiket Dipilih:</span>
                  <span className="font-bold text-charcoal">{totalTickets} Tiket</span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>Biaya Layanan (Demo):</span>
                  <span className="font-bold text-emerald-850">Rp 0 (Gratis)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-sand-100">
                  <span className="text-sm font-bold text-charcoal">Total Estimasi:</span>
                  <span className="text-xl font-black text-emerald-850">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleProceedToBooking}
                disabled={totalTickets === 0}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-2 ${
                  totalTickets === 0
                    ? 'bg-sand-200 text-muted cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-850 to-forest-green hover:from-emerald-900 hover:to-emerald-800 text-white active:scale-98 shadow-card'
                }`}
              >
                <Ticket className="w-4 h-4 text-sand-200" />
                <span>Lanjutkan Pemesanan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-muted">
                Simulasi transaksi demo. Bebas biaya dan tidak ada potongan rekening.
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
