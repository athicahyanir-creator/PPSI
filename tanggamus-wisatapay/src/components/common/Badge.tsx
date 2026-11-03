import React from 'react';
import { BookingStatus, TicketStatus, PaymentStatus } from '../../types';

interface BadgeProps {
  status: BookingStatus | TicketStatus | PaymentStatus | 'active' | 'inactive';
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, label, className = '' }) => {
  const configMap: Record<string, { bg: string; text: string; border: string; defaultLabel: string }> = {
    // Ticket / Booking statuses
    valid: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      defaultLabel: 'Tiket Valid (Siap Digunakan)',
    },
    used: {
      bg: 'bg-zinc-100',
      text: 'text-zinc-600',
      border: 'border-zinc-300',
      defaultLabel: 'Sudah Digunakan',
    },
    cancelled: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      defaultLabel: 'Dibatalkan',
    },
    paid: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      defaultLabel: 'Lunas / Terverifikasi',
    },
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      defaultLabel: 'Menunggu Pembayaran',
    },
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      defaultLabel: 'Berhasil',
    },
    failed: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      defaultLabel: 'Gagal',
    },
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      defaultLabel: 'Aktif',
    },
    inactive: {
      bg: 'bg-zinc-100',
      text: 'text-zinc-500',
      border: 'border-zinc-200',
      defaultLabel: 'Nonaktif',
    },
  };

  const current = configMap[status] || {
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-200',
    defaultLabel: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label || current.defaultLabel}
    </span>
  );
};
