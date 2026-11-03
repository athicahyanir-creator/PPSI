import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { storageService } from '../../services/storage';
import { Destination } from '../../types';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Compass,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';

interface BookingLocationState {
  destination?: Destination;
  visitDate?: string;
  items?: { ticketTypeId: string; ticketTypeName: string; quantity: number; unitPrice: number }[];
}

export const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as BookingLocationState) || {};

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerOrigin, setCustomerOrigin] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user navigates directly without state, redirect to catalog
  useEffect(() => {
    if (!state.destination || !state.items || state.items.length === 0) {
      navigate('/destinasi');
    }
  }, [state, navigate]);

  if (!state.destination || !state.items) {
    return null;
  }

  const { destination, visitDate = new Date().toISOString().split('T')[0], items } = state;
  const totalAmount = items.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = 'Nama pemesan wajib diisi.';
    if (!customerEmail.trim()) {
      newErrors.customerEmail = 'Alamat email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      newErrors.customerEmail = 'Format email tidak valid.';
    }
    if (!customerPhone.trim()) {
      newErrors.customerPhone = 'Nomor WhatsApp / telepon wajib diisi.';
    } else if (customerPhone.length < 9) {
      newErrors.customerPhone = 'Nomor telepon minimal 9 digit.';
    }
    if (!customerOrigin.trim()) newErrors.customerOrigin = 'Asal kota / domisili wajib diisi.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = storageService.createBooking({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerOrigin: customerOrigin.trim(),
        destinationId: destination.id,
        destinationName: destination.name,
        visitDate,
        items,
        notes: notes.trim() || undefined,
      });

      // Redirect to simulated payment page
      navigate(`/konfirmasi/${result.booking.bookingCode}`);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses pesanan.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/destinasi/${destination.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-emerald-850 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Detail Destinasi</span>
          </Link>
        </div>

        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-teal uppercase tracking-widest">
            Formulir Pemesanan
          </span>
          <h1 className="text-3xl font-extrabold text-charcoal">
            Data Pemesan Tiket
          </h1>
          <p className="text-xs text-muted">
            Pastikan data yang Anda isi benar agar tiket digital dan notifikasi konfirmasi dapat diterima dengan tepat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft space-y-6"
            >
              <h2 className="text-lg font-bold text-charcoal border-b border-sand-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-850" />
                <span>Identitas Pemesan</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-charcoal flex items-center justify-between">
                    <span>Nama Lengkap Pemesan *</span>
                    {errors.customerName && (
                      <span className="text-rose-600 text-[11px] font-normal">{errors.customerName}</span>
                    )}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className={`w-full pl-10 pr-4 py-2.5 bg-ivory-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all ${
                        errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-sand-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal flex items-center justify-between">
                    <span>Email Aktif *</span>
                    {errors.customerEmail && (
                      <span className="text-rose-600 text-[11px] font-normal">{errors.customerEmail}</span>
                    )}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-ivory-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all ${
                        errors.customerEmail ? 'border-rose-400 bg-rose-50/30' : 'border-sand-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal flex items-center justify-between">
                    <span>Nomor WhatsApp / HP *</span>
                    {errors.customerPhone && (
                      <span className="text-rose-600 text-[11px] font-normal">{errors.customerPhone}</span>
                    )}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="081234567890"
                      className={`w-full pl-10 pr-4 py-2.5 bg-ivory-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all ${
                        errors.customerPhone ? 'border-rose-400 bg-rose-50/30' : 'border-sand-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Origin */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-charcoal flex items-center justify-between">
                    <span>Asal Kota / Domisili Wisatawan *</span>
                    {errors.customerOrigin && (
                      <span className="text-rose-600 text-[11px] font-normal">{errors.customerOrigin}</span>
                    )}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerOrigin}
                      onChange={(e) => setCustomerOrigin(e.target.value)}
                      placeholder="Contoh: Bandar Lampung, Jakarta Selatan, Pringsewu"
                      className={`w-full pl-10 pr-4 py-2.5 bg-ivory-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all ${
                        errors.customerOrigin ? 'border-rose-400 bg-rose-50/30' : 'border-sand-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-charcoal">
                    Catatan Khusus Kunjungan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Membawa lansia, rencana tiba jam 7 pagi, butuh sewa perahu tambahan..."
                    className="w-full px-4 py-2.5 bg-ivory-50 border border-sand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
                  />
                </div>
              </div>

              {/* Data Demo Disclaimer */}
              <div className="p-4 rounded-2xl bg-ivory-100 border border-sand-300/40 text-xs text-muted flex items-start gap-3">
                <Info className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal block mb-0.5">Keamanan Data Demo:</strong>
                  Data pemesan disimpan dalam penyimpanan lokal peramban Anda untuk simulasi alur prototipe Tanggamus WisataPay dan tidak diunggah ke pihak ketiga.
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-850 to-forest-green hover:from-emerald-900 hover:to-emerald-800 text-white shadow-soft transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Konfirmasi & Lanjut ke Simulasi Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-sand-200 shadow-card space-y-6">
              
              <div>
                <span className="text-xs font-bold text-teal uppercase tracking-wider">
                  Ringkasan Pesanan
                </span>
                <h3 className="text-lg font-extrabold text-charcoal mt-1">
                  {destination.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted mt-1">
                  <MapPin className="w-3.5 h-3.5 text-coral shrink-0" />
                  <span>Kec. {destination.kecamatan}, Tanggamus</span>
                </div>
              </div>

              {/* Visit date badge */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-ivory-100 border border-sand-200 text-xs">
                <Calendar className="w-4 h-4 text-emerald-850 shrink-0" />
                <div>
                  <div className="text-muted text-[10px] uppercase font-semibold">Tanggal Kunjungan</div>
                  <div className="font-bold text-charcoal">
                    {new Date(visitDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Ticket Items Snapshot */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-charcoal">Rincian Tiket:</div>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-2 border-b border-sand-100 last:border-0"
                  >
                    <div>
                      <div className="font-semibold text-charcoal">{item.ticketTypeName}</div>
                      <div className="text-[11px] text-muted">
                        {item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="font-bold text-charcoal">
                      Rp {(item.quantity * item.unitPrice).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-4 border-t border-sand-100 space-y-2">
                <div className="flex justify-between text-xs text-muted">
                  <span>Biaya Layanan Gerbang (Demo):</span>
                  <span className="font-bold text-emerald-850">Rp 0 (Gratis)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-sand-100">
                  <span className="text-sm font-bold text-charcoal">Total Tagihan:</span>
                  <span className="text-xl font-black text-emerald-850">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
