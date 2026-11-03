import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storage';
import { BookingStatus } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const BookingsAdminPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bookings = storageService.getBookings();

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.destinationName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider">
            Monitoring Pemesanan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Daftar Pemesanan E-Tiket
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Semua transaksi pesanan tiket masuk yang telah tercatat dalam sistem informasi Tanggamus WisataPay.
          </p>
        </div>

        <button
          onClick={() => storageService.exportBookingsCSV()}
          className="inline-flex items-center gap-2 bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor CSV Pemesanan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode booking, nama pemesan, atau destinasi..."
            className="w-full pl-10 pr-4 py-2 bg-ivory-50 border border-sand-200 rounded-xl text-xs text-charcoal focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs text-muted font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-ivory-50 border border-sand-200 text-charcoal text-xs font-semibold py-2 px-3 rounded-xl focus:ring-2 focus:ring-emerald-700 w-full sm:w-auto"
          >
            <option value="all">Semua Status</option>
            <option value="paid">Lunas / Terverifikasi</option>
            <option value="pending">Menunggu Pembayaran</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-50 border-b border-sand-200 text-muted uppercase font-bold text-[10px]">
                <th className="py-3.5 px-4">Kode Booking</th>
                <th className="py-3.5 px-4">Data Pemesan</th>
                <th className="py-3.5 px-4">Destinasi</th>
                <th className="py-3.5 px-4">Tanggal Kunjungan</th>
                <th className="py-3.5 px-4">Total Tagihan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-medium text-charcoal">
              {filtered.map((b) => {
                const isExpanded = expandedId === b.id;
                return (
                  <React.Fragment key={b.id}>
                    <tr className="hover:bg-ivory-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-850">
                        {b.bookingCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold">{b.customerName}</div>
                        <div className="text-[10px] text-muted">{b.customerEmail} • {b.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">{b.destinationName}</td>
                      <td className="py-3.5 px-4">
                        {new Date(b.visitDate).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-850">
                        Rp {b.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/tiket/${b.bookingCode}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-teal hover:bg-teal-50"
                            title="Buka Halaman Tiket Digital"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : b.id)}
                            className="p-1.5 rounded-lg text-charcoal hover:bg-ivory-200"
                            title="Buka Rincian Item"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Snapshot Breakdown */}
                    {isExpanded && (
                      <tr className="bg-ivory-50/70 border-b border-sand-200">
                        <td colSpan={7} className="p-4 pl-8">
                          <div className="bg-white p-4 rounded-2xl border border-sand-200 space-y-2">
                            <div className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                              Rincian Snapshot Tiket ({b.bookingCode}):
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {b.items.map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-xl bg-ivory-50 border border-sand-200 text-xs">
                                  <div className="font-bold text-charcoal">{item.ticketTypeName}</div>
                                  <div className="text-muted text-[11px]">
                                    {item.quantity} tiket × Rp {item.unitPrice.toLocaleString('id-ID')}
                                  </div>
                                  <div className="font-extrabold text-emerald-850 mt-1">
                                    Subtotal: Rp {item.subtotal.toLocaleString('id-ID')}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {b.notes && (
                              <div className="text-[11px] text-muted pt-2 border-t border-sand-100">
                                Catatan pemesan: <em>"{b.notes}"</em>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
