import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export const TicketConfirmationPage: React.FC = () => {
  const { bookingCode = '' } = useParams<{ bookingCode: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const booking = storageService.getBookingByCode(bookingCode);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris_demo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(booking?.status === 'paid');

  if (!booking) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-sand-200 text-center max-w-md space-y-4 shadow-card">
          <Info className="w-12 h-12 text-coral mx-auto" />
          <h2 className="text-xl font-bold text-charcoal">Kode Booking Tidak Ditemukan</h2>
          <p className="text-sm text-muted">
            Kode pemesanan <code>{bookingCode}</code> tidak tercatat dalam database demo.
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

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const res = storageService.simulatePayment(booking.bookingCode, selectedMethod, currentUser);
      setIsProcessing(false);

      if (res.success) {
        setPaymentSuccess(true);
        // Confetti effect
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      } else {
        alert(res.message);
      }
    }, 800);
  };

  const paymentOptions: { id: PaymentMethod; name: string; desc: string; icon: any }[] = [
    {
      id: 'qris_demo',
      name: 'QRIS WisataPay (Simulasi Demo)',
      desc: 'Simulasi scan QR Standar Pembayaran Nasional.',
      icon: QrCode,
    },
    {
      id: 'va_demo',
      name: 'Virtual Account Bank Demo',
      desc: 'Simulasi transfer via Mandiri, BRI, BNI, atau Bank Lampung.',
      icon: Building2,
    },
    {
      id: 'loket_demo',
      name: 'Pembayaran Tunai di Loket Pekon',
      desc: 'Bayar langsung saat tiba di gerbang pos retribusi resmi.',
      icon: Banknote,
    },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-teal uppercase tracking-widest">
            {paymentSuccess ? 'Pemesanan Berhasil' : 'Menunggu Konfirmasi Pembayaran'}
          </span>
          <h1 className="text-3xl font-extrabold text-charcoal">
            {paymentSuccess ? 'Pembayaran Berhasil Dikonfirmasi!' : 'Simulasi Pembayaran Tiket'}
          </h1>
          <p className="text-xs text-muted">
            Kode Pemesanan Resmi: <strong className="text-charcoal font-mono">{booking.bookingCode}</strong>
          </p>
        </div>

        {paymentSuccess ? (
          /* Payment Success Card */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sand-200 shadow-card text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-soft">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-charcoal">
                Tiket Digital Siap Digunakan!
              </h2>
              <p className="text-sm text-muted max-w-md mx-auto">
                Terima kasih, pembayaran simulasi untuk kunjungan ke <strong className="text-charcoal">{booking.destinationName}</strong> telah berhasil diverifikasi dalam sistem.
              </p>
            </div>

            {/* Quick Ticket Summary Box */}
            <div className="p-5 rounded-2xl bg-ivory-50 border border-sand-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-muted">Nama Pemesan:</span>
                <span className="font-bold text-charcoal">{booking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tanggal Kunjungan:</span>
                <span className="font-bold text-charcoal">
                  {new Date(booking.visitDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Total Pembayaran:</span>
                <span className="font-black text-emerald-850">
                  Rp {booking.totalAmount.toLocaleString('id-ID')} (Lunas)
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-sand-100">
                <span className="text-muted">Status Tiket:</span>
                <StatusBadge status="paid" label="Siap Ditunjukkan di Loket" />
              </div>
            </div>

            {/* Next Action CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/tiket/${booking.bookingCode}`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-850 to-forest-green hover:from-emerald-900 hover:to-emerald-850 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-soft transition-all active:scale-95"
              >
                <QrCode className="w-5 h-5 text-sand-200" />
                <span>Buka Tiket Digital & QR Code</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/destinasi"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm bg-ivory-200 hover:bg-sand-200 text-charcoal transition-colors"
              >
                Kembali ke Katalog
              </Link>
            </div>

            <div className="text-[11px] text-muted-400">
              * Petugas pos gerbang dapat memvalidasi tiket melalui QR Code atau Kode Tiket unik.
            </div>
          </div>
        ) : (
          /* Payment Choice Flow */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Payment method options */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Mandatory Demo Disclaimer Alert */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 text-amber-950 flex items-start gap-4 shadow-soft">
                <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-sm text-amber-900">
                    PERHATIAN: Simulasi Pembayaran (Mode Demo)
                  </h4>
                  <p className="leading-relaxed text-amber-800">
                    Aplikasi ini adalah <strong>prototipe akademik sistem informasi</strong>. Seluruh proses pembayaran di bawah ini adalah simulasi dan <strong>tidak memotong saldo bank atau dompet digital Anda</strong>.
                  </p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft space-y-4">
                <h3 className="text-base font-bold text-charcoal">
                  Pilih Metode Pembayaran Simulasi:
                </h3>

                <div className="space-y-3">
                  {paymentOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedMethod === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-700 ring-2 ring-emerald-700/20'
                            : 'bg-ivory-50 hover:bg-ivory-100 border-sand-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setSelectedMethod(opt.id)}
                          className="mt-1 text-emerald-850 focus:ring-emerald-700"
                        />
                        <div className="w-9 h-9 rounded-xl bg-white border border-sand-200 flex items-center justify-center text-emerald-850 shrink-0 shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-charcoal flex items-center gap-2">
                            <span>{opt.name}</span>
                            <span className="text-[10px] bg-sand-200 text-charcoal px-2 py-0.5 rounded-full font-medium">
                              Demo
                            </span>
                          </div>
                          <div className="text-xs text-muted mt-0.5">{opt.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Confirm button */}
                <div className="pt-4 border-t border-sand-100">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-850 to-forest-green hover:from-emerald-900 hover:to-emerald-850 text-white shadow-soft transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Memverifikasi Simulasi Transaksi...</span>
                      </span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-sand-200" />
                        <span>Konfirmasi Simulasi Pembayaran (Demo)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-muted mt-2">
                    Mengklik tombol ini akan mengubah status pesanan menjadi Lunas dan menerbitkan tiket digital.
                  </p>
                </div>

              </div>

            </div>

            {/* Right Col: Bill details */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-4">
                <div className="border-b border-sand-100 pb-3">
                  <div className="text-xs text-muted uppercase font-bold">Rincian Tagihan</div>
                  <div className="text-sm font-extrabold text-charcoal mt-1">
                    {booking.destinationName}
                  </div>
                  <div className="text-xs text-muted">
                    {new Date(booking.visitDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {booking.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-muted">
                        {item.ticketTypeName} ({item.quantity}x)
                      </span>
                      <span className="font-semibold text-charcoal">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-sand-100">
                    <span className="text-muted">Biaya Layanan Demo:</span>
                    <span className="font-semibold text-emerald-850">Rp 0</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-sand-100 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-charcoal">Total Tagihan:</span>
                  <span className="text-lg font-black text-emerald-850">
                    Rp {booking.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="pt-2">
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
