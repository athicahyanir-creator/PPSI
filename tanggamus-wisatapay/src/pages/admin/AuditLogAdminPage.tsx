import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import {
  ScrollText,
  Search,
  ShieldCheck,
  User,
  Clock,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AuditLogAdminPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const logs = storageService.getAuditLogs();

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.entityId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-teal font-extrabold text-xs uppercase tracking-wider">
            Integritas & Keamanan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Audit Log Riwayat Sistem
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Pencatatan kronologis aktivitas krusial pengguna, perubahan data tarif, dan histori validasi tiket.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <ShieldCheck className="w-4 h-4 text-emerald-850" />
          <span>Total Tercatat: <strong className="text-charcoal">{logs.length}</strong> Entri</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari aksi, nama petugas, rincian aktivitas, atau ID entitas..."
          className="w-full text-xs text-charcoal bg-transparent focus:outline-none placeholder-muted"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-50 border-b border-sand-200 text-muted uppercase font-bold text-[10px]">
                <th className="py-3.5 px-4">Waktu (WIB)</th>
                <th className="py-3.5 px-4">Pengguna & Peran</th>
                <th className="py-3.5 px-4">Aksi Sistem</th>
                <th className="py-3.5 px-4">Entitas Terkait</th>
                <th className="py-3.5 px-4">Rincian Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100 font-medium text-charcoal">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-ivory-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-muted font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <strong className="text-charcoal block">{log.userName}</strong>
                    <span className="text-[10px] text-teal uppercase font-bold">{log.role}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-ivory-200 text-charcoal font-mono text-[11px] font-bold border border-sand-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-muted block text-[10px] uppercase font-semibold">
                      {log.entityType}
                    </span>
                    <span className="font-mono text-emerald-850 font-bold">{log.entityId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-muted leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
