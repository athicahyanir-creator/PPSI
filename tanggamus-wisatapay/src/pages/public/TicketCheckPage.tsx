import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/Badge';
import {
  Search,
  Ticket,
  QrCode,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export const TicketCheckPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [resultBooking, setResultBooking] = useState<any>(null);
  const [resultTicket, setResultTicket] = useState<any>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearched(true);
    const clean = query.trim().toUpperCase().replace('WISATAPAY-TGM-', '');

    // Check booking code
    const booking = storageService.getBookingByCode(clean);
    if (booking) {
      setResultBooking(booking);
      setResultTicket(null);
      return;
    }

    // Check ticket code
    const ticket = storageService.getTicketByCode(clean);
    if (ticket) {
      const parentBooking = storageService.getBookingByCode(ticket.bookingCode);
      setResultBooking(parentBooking);
      setResultTicket(ticket);
      return;
    }

    setResultBooking(null);
    setResultTicket(null);
  };

  const sampleCodes = [
    { label: 'Tiket Valid (Siap Uji)', code: 'TK-TGM-KIL-001-A' },
    { label: 'Tiket Sudah Digunakan', code: 'TK-TGM-WL-002-A' },
    { label: 'Kode Booking Lengkap', code: 'TGM-20261020-001' },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-teal uppercase tracking-widest">
            Layanan Wisatawan
          </span>
          <h1 className="text-3xl font-extrabold text-charcoal">
            Cek Status & Ambil Tiket Digital
          </h1>
          <p className="text-xs text-muted">
            Masukkan Kode Pemesanan (contoh: <code>TGM-...</code>) atau Kode Tiket Unik Anda untuk memeriksa status validitas dan mengunduh e-tiket.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan Kode Booking atau Kode Tiket..."
                className="w-full pl-11 pr-4 py-3 bg-ivory-50 border border-sand-200 rounded-2xl text-sm font-semibold uppercase tracking-wider text-charcoal focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-850 hover:bg-emerald-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-soft transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <span>Periksa Tiket</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Sample quick test pill clicks */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-muted">
            <span className="font-semibold text-charcoal">Klik Cepat Kode Demo:</span>
            {sampleCodes.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(s.code);
                }}
                className="px-2.5 py-1 rounded-lg bg-ivory-200 hover:bg-sand-200 text-charcoal font-mono text-[11px] border border-sand-300 transition-colors"
                title={`Gunakan contoh ${s.label}`}
              >
                {s.code} ({s.label})
              </button>
            ))}
          </div>
        </div>

        {/* Search Result */}
        {searched && (
          <div>
            {resultBooking ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-700/30 shadow-card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-teal uppercase tracking-wider">
                      Tiket Ditemukan
                    </span>
                    <h3 className="text-xl font-black text-charcoal mt-1">
                      {resultBooking.destinationName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={resultTicket ? resultTicket.status : resultBooking.status} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-ivory-50 border border-sand-200">
                    <span className="text-muted block">Nama Pemesan:</span>
                    <strong className="text-charcoal text-sm">{resultBooking.customerName}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-ivory-50 border border-sand-200">
                    <span className="text-muted block">Tanggal Kunjungan:</span>
                    <strong className="text-charcoal text-sm">
                      {new Date(resultBooking.visitDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-ivory-50 border border-sand-200">
                    <span className="text-muted block">Kode Booking:</span>
                    <strong className="text-charcoal font-mono text-sm">{resultBooking.bookingCode}</strong>
                  </div>
                </div>

                {/* If specific ticket searched */}
                {resultTicket && (
                  <div className="p-4 rounded-2xl bg-ivory-100 border border-sand-300/40 text-xs space-y-1">
                    <div className="font-bold text-charcoal">
                      Rincian Tiket: {resultTicket.ticketTypeName} ({resultTicket.uniqueCode})
                    </div>
                    {resultTicket.status === 'used' ? (
                      <div className="text-rose-700">
                        * Tiket ini telah divalidasi masuk pada {new Date(resultTicket.validatedAt).toLocaleString('id-ID')} oleh {resultTicket.validatedBy}.
                      </div>
                    ) : (
                      <div className="text-emerald-800 font-medium">
                        * Tiket valid dan siap digunakan di pos gerbang masuk.
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/tiket/${resultBooking.bookingCode}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-850 to-forest-green hover:from-emerald-900 hover:to-emerald-850 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-soft transition-all"
                  >
                    <QrCode className="w-4 h-4 text-sand-200" />
                    <span>Buka Tampilan Tiket Digital & QR</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-sand-200 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-coral mx-auto" />
                <h3 className="text-base font-bold text-charcoal">
                  Kode "{query}" Tidak Ditemukan
                </h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Periksa kembali penulisan kode booking atau kode tiket Anda. Pastikan tidak ada kesalahan spasi atau huruf.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
