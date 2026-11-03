import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { storageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/Badge';
import {
  Compass,
  Printer,
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const DigitalTicketPage: React.FC = () => {
  const { bookingCode = '' } = useParams<{ bookingCode: string }>();
  const booking = storageService.getBookingByCode(bookingCode);
  const tickets = storageService.getTickets(bookingCode);

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-sand-200 text-center max-w-md space-y-4 shadow-card">
          <AlertCircle className="w-12 h-12 text-coral mx-auto" />
          <h2 className="text-xl font-bold text-charcoal">Tiket Tidak Ditemukan</h2>
          <p className="text-sm text-muted">
            Kode pemesanan <code>{bookingCode}</code> tidak ditemukan.
          </p>
          <Link
            to="/destinasi"
            className="inline-block px-5 py-2.5 bg-emerald-850 text-white rounded-xl text-sm font-semibold"
          >
            Lihat Katalog Wisata
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 py-10 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 print:p-0">
        
        {/* Navigation & Print Actions (Hidden on print) */}
        <div className="flex items-center justify-between mb-8 no-print">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-emerald-850 font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-ivory-200 text-charcoal border border-sand-200 rounded-xl text-xs font-bold shadow-soft transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-850" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>

        {/* Master Ticket Card */}
        <div className="ticket-card bg-white rounded-3xl border-2 border-sand-200 overflow-hidden shadow-card">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-850 to-forest-green p-6 sm:p-8 text-white relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-teal-300">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                    Tanggamus <span className="text-teal-300">WisataPay</span>
                  </h1>
                  <span className="text-[11px] text-sand-200 uppercase tracking-widest block font-medium">
                    E-Tiket Kunjungan Resmi (Demo Pass)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-sand-200 uppercase tracking-wider font-semibold">
                  Kode Pemesanan
                </div>
                <div className="font-mono text-base sm:text-lg font-black text-sand-100 tracking-wider">
                  {booking.bookingCode}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Meta Details */}
          <div className="p-6 sm:p-8 border-b-2 border-dashed border-sand-200 bg-ivory-50/70">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div>
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">
                  Destinasi Wisata
                </span>
                <span className="text-sm font-extrabold text-charcoal block mt-0.5">
                  {booking.destinationName}
                </span>
                <span className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-coral" />
                  <span>Kabupaten Tanggamus</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">
                  Tanggal Kunjungan
                </span>
                <span className="text-sm font-extrabold text-charcoal block mt-0.5">
                  {new Date(booking.visitDate).toLocaleDateString('id-ID', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-teal" />
                  <span>Sesuai Jam Operasional Pos</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">
                  Nama Pemesan
                </span>
                <span className="text-sm font-extrabold text-charcoal block mt-0.5">
                  {booking.customerName}
                </span>
                <span className="text-xs text-muted block mt-0.5">
                  Domisili: {booking.customerOrigin}
                </span>
              </div>

            </div>
          </div>

          {/* Individual Tickets Section */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-charcoal uppercase tracking-wider">
                Daftar Tiket & QR Code Masuk ({tickets.length} Tiket)
              </h2>
              <span className="text-xs text-muted">
                Tunjukkan QR code ini ke petugas di pintu gerbang masuk.
              </span>
            </div>

            <div className="space-y-6">
              {tickets.map((t, idx) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl border-2 border-sand-200 bg-white shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-700 transition-colors"
                >
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-xs font-black text-emerald-850 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Tiket #{idx + 1}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>

                    <div className="text-base font-extrabold text-charcoal">
                      {t.ticketTypeName}
                    </div>

                    <div className="text-xs text-muted space-y-1">
                      <div>
                        Kode Tiket Unik: <strong className="font-mono text-charcoal">{t.uniqueCode}</strong>
                      </div>
                      <div>
                        Atas Nama: <strong className="text-charcoal">{t.customerName}</strong>
                      </div>
                    </div>

                    {/* Validation log if used */}
                    {t.status === 'used' && (
                      <div className="mt-2 p-2.5 rounded-xl bg-zinc-100 text-[11px] text-zinc-700 space-y-0.5 border border-zinc-200">
                        <div className="font-bold flex items-center gap-1 text-zinc-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Sudah Divalidasi di Gerbang</span>
                        </div>
                        <div>Waktu: {new Date(t.validatedAt || '').toLocaleString('id-ID')}</div>
                        <div>Petugas: {t.validatedBy || 'Petugas Gerbang'}</div>
                      </div>
                    )}
                  </div>

                  {/* Right: QR Code Visual */}
                  <div className="shrink-0 flex flex-col items-center bg-ivory-50 p-4 rounded-2xl border border-sand-200">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-sand-200">
                      <QRCodeSVG
                        value={t.qrPayload}
                        size={120}
                        level="M"
                        includeMargin={false}
                        fgColor={t.status === 'used' ? '#7C8781' : '#124C3A'}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted mt-2 tracking-wider">
                      {t.uniqueCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Official Disclaimer */}
            <div className="pt-6 border-t border-sand-100 text-[11px] text-muted space-y-1.5">
              <div className="flex items-center gap-1.5 text-charcoal font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-850" />
                <span>Ketentuan Tiket Tanggamus WisataPay:</span>
              </div>
              <p>
                1. Tiket digital hanya berlaku untuk 1 (satu) kali validasi masuk per orang. Setelah gerbang dibuka, tiket akan terkunci otomatis.
              </p>
              <p>
                2. Data tiket ini tersimpan dalam basis data sistem informasi. Jangan memberikan kode tiket kepada pihak lain sebelum masuk.
              </p>
              <p>
                3. Penerimaan dan retribusi merupakan bagian dari tata kelola pariwisata terpadu Kabupaten Tanggamus (Mode Demo).
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
