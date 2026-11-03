export type UserRole = 'tourist' | 'staff' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatar?: string;
  department?: string;
}

export type DestinationCategory = 'bahari' | 'air_terjun' | 'perbukitan' | 'budaya' | 'konservasi';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  category: DestinationCategory;
  description: string;
  shortDescription: string;
  address: string;
  kecamatan: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  status: 'active' | 'inactive';
  image: string;
  gallery: string[];
  facilities: string[];
  highlights: string[];
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

export interface TicketType {
  id: string;
  destinationId: string;
  name: string;
  price: number;
  validity: string;
  description: string;
  status: 'active' | 'inactive';
}

export type BookingStatus = 'pending' | 'paid' | 'cancelled';

export interface BookingItem {
  id: string;
  bookingId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number; // Snapshot price
  subtotal: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerOrigin: string;
  destinationId: string;
  destinationName: string;
  visitDate: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  items: BookingItem[];
}

export type TicketStatus = 'valid' | 'used' | 'cancelled';

export interface Ticket {
  id: string;
  bookingId: string;
  bookingCode: string;
  destinationId: string;
  destinationName: string;
  visitDate: string;
  ticketTypeId: string;
  ticketTypeName: string;
  customerName: string;
  uniqueCode: string;
  qrPayload: string;
  status: TicketStatus;
  validatedAt?: string;
  validatedBy?: string;
}

export type PaymentMethod = 'qris_demo' | 'va_demo' | 'loket_demo';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Payment {
  id: string;
  bookingId: string;
  bookingCode: string;
  destinationName: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  reference: string;
  paidAt: string;
  isDemo: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  entityType: 'destination' | 'ticket_type' | 'booking' | 'ticket' | 'system' | 'user';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface ValidationResult {
  success: boolean;
  code: 'VALID' | 'ALREADY_USED' | 'NOT_FOUND' | 'CANCELLED' | 'WRONG_DATE';
  message: string;
  ticket?: Ticket;
  booking?: Booking;
}
