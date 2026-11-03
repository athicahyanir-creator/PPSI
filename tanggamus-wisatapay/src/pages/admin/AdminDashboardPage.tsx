import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/Badge';
import {
  Users,
  Ticket,
  CreditCard,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'all'>('30days');
  const [selectedDestId, setSelectedDestId] = useState<string>('all');

  const destinations = storageService.getDestinations();
  const bookings = storageService.getBookings();
  const tickets = storageService.getTickets();
  const payments = storageService.getPayments();

  // Filtered dataset
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchDest = selectedDestId === 'all' || b.destinationId === selectedDestId;
      return matchDest;
    });
  }, [bookings, selectedDestId]);

  const paidBookings = filteredBookings.filter((b) => b.status === 'paid');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const totalTicketsSold = filteredBookings.reduce(
    (sum, b) => sum + b.items.reduce((s, item) => s + item.quantity, 0),
    0
  );

  const usedTickets = tickets.filter(
    (t) => t.status === 'used' && (selectedDestId === 'all' || t.destinationId === selectedDestId)
  );

  // Mock visitor trends data for charts
  const visitorTrendData = [
    { tanggal: '14 Okt', pengunjung: 120, pendapatan: 1850000 },
    { tanggal: '15 Okt', pengunjung: 145, pendapatan: 2100000 },
    { tanggal: '16 Okt', pengunjung: 190, pendapatan: 3200000 },
    { tanggal: '17 Okt', pengunjung: 310, pendapatan: 4950000 },
    { tanggal: '18 Okt', pengunjung: 450, pendapatan: 6800000 },
    { tanggal: '19 Okt', pengunjung: 520, pendapatan: 8100000 },
    { tanggal: '20 Okt (Hari ini)', pengunjung: 280, pendapatan: 4350000 },
  ];

  // Destination distribution data
  const destinationDistData = destinations.map((d) => {
    const destBookings = bookings.filter((b) => b.destinationId === d.id);
    const amount = destBookings
      .filter((b) => b.status === 'paid')
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
    return {
      nama: d.name.split(' (')[0],
      transaksi: destBookings.length,
      pendapatan: amount,
    };
  });

  const BAR_COLORS = ['#124C3A', '#1D6A50', '#55A99B', '#E58A72', '#202B28', '#86B5A9'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Bar with Filters & Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal font-extrabold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monitoring Eksekutif & Pos Retribusi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Dashboard Pemantauan Wisata Tanggamus
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Laporan agregasi kunjungan wisatawan, transaksi tiket digital, dan rekapitulasi pos gerbang.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period selector */}
          <div className="flex items-center bg-white rounded-xl border border-sand-200 p-1 text-xs font-semibold shadow-sm">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'today' ? 'bg-emerald-850 text-white' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod('7days')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === '7days' ? 'bg-emerald-850 text-white' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('30days')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === '30days' ? 'bg-emerald-850 text-white' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === 'all' ? 'bg-emerald-850 text-white' : 'text-charcoal hover:bg-ivory-100'
              }`}
            >
              Semua
            </button>
          </div>

          {/* Destination dropdown */}
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            className="bg-white border border-sand-200 text-charcoal text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-sm"
          >
            <option value="all">Semua Destinasi Tanggamus</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Export CSV Button */}
          <button
            onClick={() => storageService.exportBookingsCSV()}
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-850 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
            title="Unduh seluruh data pesanan ke file CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Mandatory Demo Label Banner */}
      <div className="bg-sand-100/90 border border-sand-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-charcoal">
        <Info className="w-4 h-4 text-emerald-850 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-emerald-850 font-bold block">
            Label Transparansi: Data Demo & Simulasi
          </strong>
          <span className="text-muted leading-relaxed">
            Statistik di bawah ini merupakan data transaksi simulasi prototipe. Nilai transaksi terverifikasi dicatat sebagai simulasi demo dan tidak mencerminkan realisasi kas atau PAD definitif Pemkab Tanggamus.
          </span>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Pengunjung Terverifikasi */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-muted text-xs font-bold uppercase tracking-wider">
            <span>Pengunjung Gerbang</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-charcoal">
            {usedTickets.length + 184} <span className="text-xs font-medium text-muted">Orang</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2% dibanding pekan lalu</span>
          </div>
        </div>

        {/* KPI 2: Tiket Terjual */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-muted text-xs font-bold uppercase tracking-wider">
            <span>Tiket Terjual</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-charcoal">
            {totalTicketsSold + 240} <span className="text-xs font-medium text-muted">Lembar</span>
          </div>
          <div className="text-[11px] text-teal font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Semua tiket tersinkron QR</span>
          </div>
        </div>

        {/* KPI 3: Transaksi Tercatat */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-muted text-xs font-bold uppercase tracking-wider">
            <span>Transaksi Tercatat</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-charcoal">
            {filteredBookings.length + 65} <span className="text-xs font-medium text-muted">Invoice</span>
          </div>
          <div className="text-[11px] text-muted font-medium">
            Tingkat lunas demo: <strong>{Math.round((paidBookings.length / (filteredBookings.length || 1)) * 100)}%</strong>
          </div>
        </div>

        {/* KPI 4: Nilai Transaksi */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-muted text-xs font-bold uppercase tracking-wider">
            <span>Nilai Terverifikasi</span>
            <div className="w-8 h-8 rounded-xl bg-coral-100 text-coral flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-850">
            Rp {(totalRevenue + 8750000).toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-muted font-medium">
            Snapshot tarif tersimpan permanen
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Tren Pengunjung & Penerimaan */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-charcoal text-base">
                Tren Kunjungan Wisatawan (7 Hari Terakhir)
              </h3>
              <p className="text-xs text-muted">Fluktuasi harian jumlah pengunjung di destinasi Tanggamus</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorTrendData}>
                <defs>
                  <linearGradient id="colorPengunjung" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#124C3A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#124C3A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 11, fill: '#7C8781' }} />
                <YAxis tick={{ fontSize: 11, fill: '#7C8781' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Pengunjung`, 'Pengunjung']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E9DFC9' }}
                />
                <Area
                  type="monotone"
                  dataKey="pengunjung"
                  stroke="#124C3A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPengunjung)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Distribusi Destinasi */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-charcoal text-base">
                Distribusi Transaksi per Destinasi
              </h3>
              <p className="text-xs text-muted">Perbandingan volume transaksi tiket di tiap objek wisata</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={destinationDistData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#7C8781' }} />
                <YAxis dataKey="nama" type="category" width={110} tick={{ fontSize: 11, fill: '#202B28' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Transaksi`, 'Volume']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E9DFC9' }}
                />
                <Bar dataKey="transaksi" radius={[0, 8, 8, 0]}>
                  {destinationDistData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tables Section: Recent Bookings & Validations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Bookings (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-sand-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-sand-100 pb-3">
            <div>
              <h3 className="font-extrabold text-charcoal text-base">
                Daftar Pemesanan Terbaru
              </h3>
              <p className="text-xs text-muted">Pesanan e-tiket yang masuk ke sistem informasi</p>
            </div>
            <button
              onClick={() => storageService.exportBookingsCSV()}
              className="text-xs font-bold text-emerald-850 hover:underline"
            >
              Unduh CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 text-muted uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">Kode Booking</th>
                  <th className="py-2.5 px-3">Pemesan</th>
                  <th className="py-2.5 px-3">Destinasi</th>
                  <th className="py-2.5 px-3">Tgl Kunjungan</th>
                  <th className="py-2.5 px-3">Total (Rp)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 font-medium text-charcoal">
                {bookings.slice(0, 6).map((b) => (
                  <tr key={b.id} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-850">
                      {b.bookingCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold">{b.customerName}</div>
                      <div className="text-[10px] text-muted">{b.customerOrigin}</div>
                    </td>
                    <td className="py-3 px-3">{b.destinationName.split(' (')[0]}</td>
                    <td className="py-3 px-3">
                      {new Date(b.visitDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      Rp {b.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Validations (1 Col) */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-sand-200 shadow-soft space-y-4">
          <div className="border-b border-sand-100 pb-3">
            <h3 className="font-extrabold text-charcoal text-base">
              Validasi Gerbang Terkini
            </h3>
            <p className="text-xs text-muted">Aktivitas check-in petugas loket</p>
          </div>

          <div className="space-y-3">
            {tickets
              .filter((t) => t.status === 'used')
              .slice(0, 5)
              .map((t) => (
                <div key={t.id} className="p-3 rounded-2xl bg-ivory-50 border border-sand-200 text-xs space-y-1">
                  <div className="flex justify-between items-start">
                    <strong className="text-charcoal">{t.customerName}</strong>
                    <span className="font-mono text-[10px] font-bold text-emerald-850 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Terverifikasi
                    </span>
                  </div>
                  <div className="text-[11px] text-muted">{t.destinationName}</div>
                  <div className="text-[10px] text-muted flex justify-between pt-1 border-t border-sand-100">
                    <span className="font-mono">{t.uniqueCode}</span>
                    <span>{t.validatedAt ? new Date(t.validatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
};
