import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { PaymentMethod } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  CreditCard,
  Download,
  Search,
  ShieldCheck,
  Building2,
  QrCode,
  Banknote,
  Sparkles,
} from 'lucide-react';

export const TransactionsAdminPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const payments = storageService.getPayments();

  const filtered = payments.filter(
    (p) =>
      p.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.destinationName.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

  const methodIcons: Record<PaymentMethod, any> = {
    qris_demo: QrCode,
    va_demo: Building2,
    loket_demo: Banknote,
  };

  const methodLabels: Record<PaymentMethod, string> = {
    qris_demo: 'QRIS (Simulasi Demo)',
    va_demo: 'Virtual Account (Demo)',
    loket_demo: 'Tunai di Loket (Demo)',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider">
            Rekonsiliasi Keuangan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Transaksi Pembayaran Masuk
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Log riwayat pembayaran tiket, nomor referensi transaksi, dan metode bayar yang terverifikasi.
          </p>
        </div>

        <button
          onClick={() => storageService.exportTransactionsCSV()}
          className="inline-flex items-center gap-2 bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor CSV Transaksi</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <div className="text-xs text-muted font-bold uppercase">Total Transaksi Lunas</div>
          <div className="text-xl font-black text-charcoal mt-1">{filtered.length} Transaksi</div>
          <div className="text-[10px] text-muted">Seluruh pembayaran terverifikasi</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <div className="text-xs text-muted font-bold uppercase">Total Nilai Pembayaran</div>
          <div className="text-xl font-black text-emerald-850 mt-1">
            Rp {totalAmount.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-teal font-semibold">Mode Simulasi (Data Demo)</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <div className="text-xs text-muted font-bold uppercase">Kanal Terpopuler</div>
          <div className="text-xl font-black text-charcoal mt-1">QRIS WisataPay</div>
          <div className="text-[10px] text-muted">65% transaksi via QRIS</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari referensi transaksi, kode booking, atau destinasi..."
          className="w-full text-xs text-charcoal bg-transparent focus:outline-none placeholder-muted"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-50 border-b border-sand-200 text-muted uppercase font-bold text-[10px]">
                <th className="py-3.5 px-4">No. Referensi Pembayaran</th>
                <th className="py-3.5 px-4">Kode Booking</th>
                <th className="py-3.5 px-4">Destinasi</th>
                <th className="py-3.5 px-4">Metode Pembayaran</th>
                <th className="py-3.5 px-4">Nominal (Rp)</th>
                <th className="py-3.5 px-4">Waktu Transaksi</th>
                <th className="py-3.5 px-4 text-center">Status Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-medium text-charcoal">
              {filtered.map((pay) => {
                const Icon = methodIcons[pay.method] || CreditCard;
                return (
                  <tr key={pay.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="font-mono text-charcoal block">{pay.reference}</strong>
                      <span className="text-[10px] text-muted font-mono">{pay.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-850">
                      {pay.bookingCode}
                    </td>
                    <td className="py-3.5 px-4">{pay.destinationName}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-teal shrink-0" />
                        <span>{methodLabels[pay.method]}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-850">
                      Rp {pay.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {new Date(pay.paidAt).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        SIMULASI DEMO
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
