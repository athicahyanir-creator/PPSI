import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { ValidationResult, Ticket } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  UserCheck,
  Calendar,
  MapPin,
  Clock,
  Camera,
  Search,
  Sparkles,
} from 'lucide-react';

export const StaffValidationPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [inputCode, setInputCode] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // List of validated tickets in storage
  const allTickets = storageService.getTickets();
  const recentValidations = allTickets
    .filter((t) => t.status === 'used' && t.validatedAt)
    .sort((a, b) => new Date(b.validatedAt || '').getTime() - new Date(a.validatedAt || '').getTime())
    .slice(0, 10);

  const handleValidate = (codeToTest?: string) => {
    const code = (codeToTest || inputCode).trim();
    if (!code) {
      alert('Masukkan atau scan kode tiket terlebih dahulu.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const res = storageService.validateTicket(code, currentUser);
      setResult(res);
      setIsProcessing(false);
      if (res.success) {
        setInputCode('');
      }
    }, 400);
  };

  const sampleTestButtons = [
    {
      label: '1. Uji Tiket Valid (Teluk Kiluan)',
      code: 'TK-TGM-KIL-001-A',
      badge: 'Valid',
      color: 'bg-emerald-50 text-emerald-850 border-emerald-300',
    },
    {
      label: '2. Uji Tiket Sudah Dipakai (Way Lalaan)',
      code: 'TK-TGM-WL-002-A',
      badge: 'Deteksi Dobel',
      color: 'bg-zinc-100 text-zinc-700 border-zinc-300',
    },
    {
      label: '3. Uji Kode Tiket Palsu / Tidak Ada',
      code: 'TK-PALSU-999-XYZ',
      badge: 'Tidak Ditemukan',
      color: 'bg-rose-50 text-rose-700 border-rose-300',
    },
    {
      label: '4. Uji Booking Belum Lunas',
      code: 'TGM-20261020-003',
      badge: 'Pending',
      color: 'bg-amber-50 text-amber-800 border-amber-300',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Officer Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-850 to-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-card mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Pos Pemeriksaan & Gerbang Masuk Tiket Wisata</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Validasi E-Tiket Pengunjung
            </h1>
            <p className="text-xs text-sand-200">
              Periksa keabsahan tiket, catat akses masuk secara realtime, dan cegah penyalahgunaan tiket ganda.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs space-y-1">
            <div className="text-sand-200 font-medium">Petugas Aktif:</div>
            <div className="font-extrabold text-white text-sm">{currentUser.name}</div>
            <div className="text-[11px] text-teal-300">{currentUser.department || 'Petugas Pos Retribusi'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Validation Form & Scanner */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft space-y-6">
              
              <div className="flex items-center justify-between border-b border-sand-100 pb-4">
                <div className="flex items-center gap-2 font-extrabold text-charcoal text-base">
                  <QrCode className="w-5 h-5 text-emerald-850" />
                  <span>Pindai QR atau Ketik Kode Tiket</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isCameraActive
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'bg-ivory-100 hover:bg-sand-200 text-charcoal border-sand-300'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isCameraActive ? 'Tutup Kamera Web' : 'Buka Kamera Web (Demo)'}</span>
                </button>
              </div>

              {/* Camera simulation viewport */}
              {isCameraActive && (
                <div className="bg-charcoal text-white rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
                  <div className="w-48 h-48 mx-auto border-2 border-dashed border-teal-400 rounded-2xl flex items-center justify-center relative">
                    <div className="absolute inset-x-2 top-0 h-0.5 bg-teal-400 animate-bounce" />
                    <span className="text-xs text-sand-200 font-mono">Arahkan QR ke Kotak</span>
                  </div>
                  <p className="text-xs text-sand-200">
                    Mode simulasi scanner aktif. Anda juga dapat menggunakan tombol klik cepat atau mengetik kode di bawah.
                  </p>
                </div>
              )}

              {/* Input Form */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-charcoal block">
                  Masukkan Kode Tiket Unik atau Kode Pemesanan:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                      placeholder="Contoh: TK-TGM-KIL-001-A atau TGM-20261020-001"
                      className="w-full pl-11 pr-4 py-3 bg-ivory-50 border border-sand-200 rounded-2xl text-sm font-mono uppercase tracking-wider text-charcoal focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleValidate()}
                    disabled={isProcessing}
                    className="bg-emerald-850 hover:bg-emerald-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-soft transition-all shrink-0 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-sand-200" />
                        <span>Validasi Tiket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Fast 1-Click Simulation Buttons */}
              <div className="space-y-2 pt-2 border-t border-sand-100">
                <div className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal" />
                  <span>Tombol Uji Alur Petugas (1-Klik):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleTestButtons.map((btn, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setInputCode(btn.code);
                        handleValidate(btn.code);
                      }}
                      className={`text-left p-3 rounded-xl border text-xs font-semibold hover:shadow-soft transition-all flex items-center justify-between ${btn.color}`}
                    >
                      <div>
                        <div className="font-bold">{btn.label}</div>
                        <div className="font-mono text-[11px] opacity-80">{btn.code}</div>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/70">
                        {btn.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Validation Result Box */}
            {result && (
              <div
                className={`rounded-3xl p-6 sm:p-8 border-2 shadow-card transition-all ${
                  result.code === 'VALID'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : result.code === 'ALREADY_USED'
                    ? 'bg-amber-50 border-amber-500 text-amber-950'
                    : 'bg-rose-50 border-rose-500 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${
                      result.code === 'VALID'
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : result.code === 'ALREADY_USED'
                        ? 'bg-amber-600 text-white border-amber-700'
                        : 'bg-rose-600 text-white border-rose-700'
                    }`}
                  >
                    {result.code === 'VALID' ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : result.code === 'ALREADY_USED' ? (
                      <AlertTriangle className="w-8 h-8" />
                    ) : (
                      <XCircle className="w-8 h-8" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/80 border">
                        STATUS: {result.code}
                      </span>
                      <span className="text-xs opacity-75 font-mono">
                        {new Date().toLocaleTimeString('id-ID')} WIB
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold leading-tight">
                      {result.message}
                    </h3>

                    {result.ticket && (
                      <div className="bg-white/90 p-4 rounded-2xl border border-sand-300 text-xs text-charcoal space-y-2 mt-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-muted block text-[10px] uppercase">Destinasi</span>
                            <strong>{result.ticket.destinationName}</strong>
                          </div>
                          <div>
                            <span className="text-muted block text-[10px] uppercase">Nama Wisatawan</span>
                            <strong>{result.ticket.customerName}</strong>
                          </div>
                          <div>
                            <span className="text-muted block text-[10px] uppercase">Kategori Tiket</span>
                            <strong>{result.ticket.ticketTypeName}</strong>
                          </div>
                          <div>
                            <span className="text-muted block text-[10px] uppercase">Kode Tiket</span>
                            <strong className="font-mono">{result.ticket.uniqueCode}</strong>
                          </div>
                        </div>

                        {result.ticket.status === 'used' && (
                          <div className="pt-2 border-t border-sand-200 text-[11px] text-zinc-600">
                            Waktu validasi masuk: <strong>{new Date(result.ticket.validatedAt || '').toLocaleString('id-ID')}</strong> oleh <strong>{result.ticket.validatedBy}</strong>.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Today's Validation Log */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-soft space-y-4">
              
              <div className="flex items-center justify-between border-b border-sand-100 pb-3">
                <div className="flex items-center gap-2 font-extrabold text-charcoal text-sm">
                  <History className="w-4 h-4 text-emerald-850" />
                  <span>Riwayat Masuk Terkini</span>
                </div>
                <span className="text-xs text-teal font-bold">{recentValidations.length} Pengunjung</span>
              </div>

              {recentValidations.length > 0 ? (
                <div className="space-y-3">
                  {recentValidations.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-ivory-50 border border-sand-200 text-xs space-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-charcoal line-clamp-1">{t.customerName}</span>
                        <span className="font-mono text-[10px] text-emerald-850 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Masuk
                        </span>
                      </div>
                      <div className="text-[11px] text-muted line-clamp-1">{t.destinationName}</div>
                      <div className="text-[10px] text-muted flex items-center justify-between pt-1 border-t border-sand-100">
                        <span>{t.uniqueCode}</span>
                        <span className="font-mono">
                          {t.validatedAt ? new Date(t.validatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-muted">
                  Belum ada tiket yang divalidasi hari ini.
                </div>
              )}

              <div className="pt-3 border-t border-sand-100 text-[11px] text-muted">
                * Data validasi tercatat otomatis ke audit log sistem untuk rekonsiliasi retribusi.
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
