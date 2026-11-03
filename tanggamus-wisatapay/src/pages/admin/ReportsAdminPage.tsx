import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storage';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Calendar,
  Building,
  ShieldAlert,
  TrendingUp,
  PieChart,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ReportsAdminPage: React.FC = () => {
  const destinations = storageService.getDestinations();
  const bookings = storageService.getBookings();
  const payments = storageService.getPayments();

  const [destFilter, setDestFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchDest = destFilter === 'all' || b.destinationId === destFilter;
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchDest && matchStatus;
    });
  }, [bookings, destFilter, statusFilter]);

  // Aggregate metrics
  const totalGrossBooking = filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const paidBookings = filteredBookings.filter((b) => b.status === 'paid');
  const totalVerifiedRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingBookings = filteredBookings.filter((b) => b.status === 'pending');
  const totalPendingAmount = pendingBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  // Revenue Sharing Simulation (e.g., 60% Pokdarwis/Pengelola Pekon, 25% Pemda/Retribusi Resmi, 15% Pemeliharaan/Asuransi)
  const pokdarwisShare = Math.round(totalVerifiedRevenue * 0.60);
  const pemdaShare = Math.round(totalVerifiedRevenue * 0.25);
  const maintenanceShare = totalVerifiedRevenue - pokdarwisShare - pemdaShare;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider">
            Akuntansi & Rekapitulasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Laporan Kinerja & Penerimaan Wisata
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Analisis nilai pemesanan, penerimaan terverifikasi, serta simulasi klasifikasi bagi hasil retribusi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => storageService.exportBookingsCSV()}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-850 border border-emerald-300 px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>CSV Pemesanan</span>
          </button>
          <button
            onClick={() => storageService.exportTransactionsCSV()}
            className="inline-flex items-center gap-1.5 bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all"
          >
            <Download className="w-4 h-4" />
            <span>CSV Transaksi</span>
          </button>
        </div>
      </div>

      {/* Mandatory Official PAD Regulatory Disclaimer */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 flex items-start gap-3.5 shadow-soft">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <strong className="text-amber-900 font-bold block text-sm">
            Prinsip Pelaporan & Klasifikasi Penerimaan (Aturan Wajib)
          </strong>
          <p className="leading-relaxed text-amber-900/90">
            Seluruh penjualan tiket <strong>tidak otomatis diklasifikasikan sebagai PAD (Pendapatan Asli Daerah) murni</strong>. Berdasarkan Peraturan Daerah dan tata kelola ekowisata Kabupaten Tanggamus, penerimaan tiket dibagi antara Kelompok Sadar Wisata (Pokdarwis)/BUMDes Pekon pengelola, premi asuransi keselamatan pengunjung, serta porsi retribusi resmi Pemda.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-charcoal">
          <Filter className="w-4 h-4 text-emerald-850" />
          <span>Filter Laporan:</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted">Destinasi:</span>
          <select
            value={destFilter}
            onChange={(e) => setDestFilter(e.target.value)}
            className="bg-ivory-50 border border-sand-200 rounded-xl px-3 py-1.5 font-semibold text-charcoal"
          >
            <option value="all">Semua Objek Wisata</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-ivory-50 border border-sand-200 rounded-xl px-3 py-1.5 font-semibold text-charcoal"
          >
            <option value="all">Semua Status</option>
            <option value="paid">Lunas / Terverifikasi</option>
            <option value="pending">Menunggu Bayar</option>
          </select>
        </div>
      </div>

      {/* Financial Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-1">
          <div className="text-[10px] text-muted font-bold uppercase tracking-wider">
            Total Nilai Pemesanan (Gross)
          </div>
          <div className="text-xl font-black text-charcoal">
            Rp {totalGrossBooking.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-muted">{filteredBookings.length} Total pesanan tercatat</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-soft space-y-1 bg-emerald-50/30">
          <div className="text-[10px] text-emerald-850 font-bold uppercase tracking-wider">
            Pembayaran Terverifikasi (Net)
          </div>
          <div className="text-xl font-black text-emerald-850">
            Rp {totalVerifiedRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">{paidBookings.length} Pesanan lunas terverifikasi</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-1">
          <div className="text-[10px] text-muted font-bold uppercase tracking-wider">
            Menunggu Pembayaran
          </div>
          <div className="text-xl font-black text-amber-800">
            Rp {totalPendingAmount.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-muted">{pendingBookings.length} Invoice pending</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-1">
          <div className="text-[10px] text-muted font-bold uppercase tracking-wider">
            Tingkat Konversi Pembayaran
          </div>
          <div className="text-xl font-black text-teal">
            {filteredBookings.length > 0
              ? Math.round((paidBookings.length / filteredBookings.length) * 100)
              : 0}%
          </div>
          <div className="text-[10px] text-muted">Rasio invoice lunas</div>
        </div>

      </div>

      {/* Revenue Classification Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
        <div className="border-b border-sand-100 pb-3">
          <h3 className="font-extrabold text-charcoal text-base">
            Simulasi Klasifikasi Bagi Hasil Penerimaan Tiket
          </h3>
          <p className="text-xs text-muted">
            Model alokasi transparansi pengelolaan wisata daerah Tanggamus (Berdasarkan Rp {totalVerifiedRevenue.toLocaleString('id-ID')} pembayaran lunas):
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-2xl bg-ivory-50 border border-sand-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal">
              <span>Pokdarwis & Pekon Pengelola (60%)</span>
              <span className="text-emerald-850">Operasional</span>
            </div>
            <div className="text-2xl font-black text-emerald-850">
              Rp {pokdarwisShare.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Dialokasikan untuk insentif pengelola lokal, perahu pemandu dolphin tour, kebersihan pantai, dan pemeliharaan pekon.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-ivory-50 border border-sand-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal">
              <span>Retribusi Pemda Tanggamus (25%)</span>
              <span className="text-teal font-bold">PAD Resmi</span>
            </div>
            <div className="text-2xl font-black text-teal">
              Rp {pemdaShare.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Porsi setoran retribusi daerah yang disetorkan ke Kas Daerah Kabupaten Tanggamus melalui dinas terkait.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-ivory-50 border border-sand-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal">
              <span>Asuransi & Pemeliharaan (15%)</span>
              <span className="text-coral font-bold">Proteksi</span>
            </div>
            <div className="text-2xl font-black text-coral">
              Rp {maintenanceShare.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Premi asuransi kecelakaan wisatawan di laut/curug serta dana pemeliharaan fasilitas gardu pandang.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
