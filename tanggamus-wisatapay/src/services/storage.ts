import {
  Destination,
  TicketType,
  Booking,
  Ticket,
  Payment,
  AuditLog,
  ValidationResult,
  User,
  PaymentMethod,
} from '../types';
import {
  SEED_DESTINATIONS,
  SEED_TICKET_TYPES,
  SEED_BOOKINGS,
  SEED_TICKETS,
  SEED_PAYMENTS,
  SEED_AUDIT_LOGS,
  SEED_USERS,
} from '../data/seedData';

const STORAGE_KEYS = {
  DESTINATIONS: 'tgm_destinations_v1',
  TICKET_TYPES: 'tgm_ticket_types_v1',
  BOOKINGS: 'tgm_bookings_v1',
  TICKETS: 'tgm_tickets_v1',
  PAYMENTS: 'tgm_payments_v1',
  AUDIT_LOGS: 'tgm_audit_logs_v1',
  USERS: 'tgm_users_v1',
  CURRENT_USER: 'tgm_current_user_v1',
};

// Safe JSON parser with fallback
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

class StorageService {
  constructor() {
    this.initIfEmpty();
  }

  public initIfEmpty(forceReset = false): void {
    if (forceReset || !localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
      saveToStorage(STORAGE_KEYS.DESTINATIONS, SEED_DESTINATIONS);
      saveToStorage(STORAGE_KEYS.TICKET_TYPES, SEED_TICKET_TYPES);
      saveToStorage(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
      saveToStorage(STORAGE_KEYS.TICKETS, SEED_TICKETS);
      saveToStorage(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
      saveToStorage(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
      saveToStorage(STORAGE_KEYS.USERS, SEED_USERS);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]); // default admin
    } else if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      saveToStorage(STORAGE_KEYS.USERS, SEED_USERS);
    }
  }

  // --- Current User / Auth ---
  public getUsers(): User[] {
    return loadFromStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  public saveUser(user: User, adminUser: User): User {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    let updated: User[];

    if (idx >= 0) {
      updated = [...users];
      updated[idx] = user;
      this.logAction(adminUser, 'UPDATE_USER', 'user', user.id, `Memperbarui data pengguna ${user.name} (${user.role}).`);
    } else {
      updated = [user, ...users];
      this.logAction(adminUser, 'CREATE_USER', 'user', user.id, `Menambahkan akun pengguna baru ${user.name} (${user.role}).`);
    }

    saveToStorage(STORAGE_KEYS.USERS, updated);
    return user;
  }

  public deleteUser(userId: string, adminUser: User): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return false;

    if (target.id === adminUser.id) {
      return false;
    }

    const updated = users.filter((u) => u.id !== userId);
    saveToStorage(STORAGE_KEYS.USERS, updated);
    this.logAction(adminUser, 'DELETE_USER', 'user', userId, `Menghapus akun pengguna: ${target.name} (${target.role}).`);
    return true;
  }

  public toggleUserStatus(userId: string, adminUser: User): User | undefined {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return undefined;

    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    target.status = newStatus;
    saveToStorage(STORAGE_KEYS.USERS, users);
    this.logAction(adminUser, 'TOGGLE_USER_STATUS', 'user', userId, `Mengubah status akun ${target.name} menjadi ${newStatus}.`);
    return target;
  }

  public getCurrentUser(): User {
    return loadFromStorage(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]);
  }

  public setCurrentUser(user: User): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    this.logAction(user, 'SWITCH_ROLE', 'system', user.id, `Pengguna berganti profil/peran ke ${user.name} (${user.role}).`);
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public logAction(
    user: User,
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      userName: user.name,
      role: user.role,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  }

  // --- Destinations ---
  public getDestinations(): Destination[] {
    return loadFromStorage<Destination[]>(STORAGE_KEYS.DESTINATIONS, SEED_DESTINATIONS);
  }

  public getDestinationById(id: string): Destination | undefined {
    return this.getDestinations().find((d) => d.id === id);
  }

  public getDestinationBySlug(slug: string): Destination | undefined {
    return this.getDestinations().find((d) => d.slug === slug);
  }

  public saveDestination(destination: Destination, user: User): Destination {
    const destinations = this.getDestinations();
    const existingIndex = destinations.findIndex((d) => d.id === destination.id);

    let updatedList: Destination[];
    if (existingIndex >= 0) {
      updatedList = [...destinations];
      updatedList[existingIndex] = destination;
      this.logAction(user, 'UPDATE_DESTINATION', 'destination', destination.id, `Memperbarui data destinasi: ${destination.name}`);
    } else {
      updatedList = [destination, ...destinations];
      this.logAction(user, 'CREATE_DESTINATION', 'destination', destination.id, `Menambahkan destinasi baru: ${destination.name}`);
    }

    saveToStorage(STORAGE_KEYS.DESTINATIONS, updatedList);
    return destination;
  }

  public toggleDestinationStatus(id: string, user: User): Destination | undefined {
    const destinations = this.getDestinations();
    const dest = destinations.find((d) => d.id === id);
    if (!dest) return undefined;

    const newStatus = dest.status === 'active' ? 'inactive' : 'active';
    dest.status = newStatus;
    saveToStorage(STORAGE_KEYS.DESTINATIONS, destinations);
    this.logAction(user, 'TOGGLE_DESTINATION_STATUS', 'destination', id, `Mengubah status destinasi ${dest.name} menjadi ${newStatus}`);
    return dest;
  }

  // --- Ticket Types ---
  public getTicketTypes(destinationId?: string): TicketType[] {
    const all = loadFromStorage<TicketType[]>(STORAGE_KEYS.TICKET_TYPES, SEED_TICKET_TYPES);
    if (destinationId) {
      return all.filter((t) => t.destinationId === destinationId);
    }
    return all;
  }

  public saveTicketType(ticketType: TicketType, user: User): TicketType {
    const list = this.getTicketTypes();
    const idx = list.findIndex((t) => t.id === ticketType.id);
    let updated: TicketType[];

    if (idx >= 0) {
      updated = [...list];
      updated[idx] = ticketType;
      this.logAction(user, 'UPDATE_TICKET_TYPE', 'ticket_type', ticketType.id, `Memperbarui tiket "${ticketType.name}" seharga Rp ${ticketType.price.toLocaleString('id-ID')}`);
    } else {
      updated = [ticketType, ...list];
      this.logAction(user, 'CREATE_TICKET_TYPE', 'ticket_type', ticketType.id, `Menambahkan kategori tiket baru "${ticketType.name}" seharga Rp ${ticketType.price.toLocaleString('id-ID')}`);
    }

    saveToStorage(STORAGE_KEYS.TICKET_TYPES, updated);
    return ticketType;
  }

  public deleteTicketType(id: string, user: User): void {
    const list = this.getTicketTypes();
    const target = list.find((t) => t.id === id);
    if (!target) return;

    const updated = list.filter((t) => t.id !== id);
    saveToStorage(STORAGE_KEYS.TICKET_TYPES, updated);
    this.logAction(user, 'DELETE_TICKET_TYPE', 'ticket_type', id, `Menonaktifkan kategori tiket "${target.name}"`);
  }

  // --- Bookings & Tickets ---
  public getBookings(): Booking[] {
    const bookings = loadFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
    return [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBookingByCode(bookingCode: string): Booking | undefined {
    const bookings = this.getBookings();
    return bookings.find(
      (b) => b.bookingCode.toUpperCase() === bookingCode.trim().toUpperCase()
    );
  }

  public createBooking(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerOrigin: string;
    destinationId: string;
    destinationName: string;
    visitDate: string;
    items: { ticketTypeId: string; ticketTypeName: string; quantity: number; unitPrice: number }[];
    notes?: string;
  }): { booking: Booking; tickets: Ticket[] } {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `TGM-${dateStr}-${randomSuffix}`;
    const bookingId = `bkg-${Date.now()}`;

    // Snapshot total & items
    const bookingItems = data.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx + 1}`,
      bookingId,
      ticketTypeId: item.ticketTypeId,
      ticketTypeName: item.ticketTypeName,
      quantity: item.quantity,
      unitPrice: item.unitPrice, // Immutable snapshot price
      subtotal: item.unitPrice * item.quantity,
    }));

    const totalAmount = bookingItems.reduce((acc, curr) => acc + curr.subtotal, 0);

    const booking: Booking = {
      id: bookingId,
      bookingCode,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerOrigin: data.customerOrigin,
      destinationId: data.destinationId,
      destinationName: data.destinationName,
      visitDate: data.visitDate,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: data.notes,
      items: bookingItems,
    };

    // Generate individual tickets for each seat/ticket requested
    const generatedTickets: Ticket[] = [];
    let ticketCounter = 1;

    for (const item of bookingItems) {
      for (let i = 0; i < item.quantity; i++) {
        const uniqueCode = `TK-${bookingCode}-${ticketCounter++}`;
        generatedTickets.push({
          id: `tkt-${Date.now()}-${uniqueCode}`,
          bookingId,
          bookingCode,
          destinationId: data.destinationId,
          destinationName: data.destinationName,
          visitDate: data.visitDate,
          ticketTypeId: item.ticketTypeId,
          ticketTypeName: item.ticketTypeName,
          customerName: data.customerName,
          uniqueCode,
          qrPayload: `WISATAPAY-TGM-${uniqueCode}`,
          status: 'valid', // valid once paid
        });
      }
    }

    // Save
    const allBookings = this.getBookings();
    saveToStorage(STORAGE_KEYS.BOOKINGS, [booking, ...allBookings]);

    const allTickets = this.getTickets();
    saveToStorage(STORAGE_KEYS.TICKETS, [...generatedTickets, ...allTickets]);

    return { booking, tickets: generatedTickets };
  }

  public simulatePayment(
    bookingCode: string,
    method: PaymentMethod,
    user: User
  ): { success: boolean; message: string; payment?: Payment } {
    const bookings = this.getBookings();
    const bookingIndex = bookings.findIndex(
      (b) => b.bookingCode.toUpperCase() === bookingCode.trim().toUpperCase()
    );

    if (bookingIndex === -1) {
      return { success: false, message: 'Pesanan tidak ditemukan' };
    }

    const booking = bookings[bookingIndex];
    if (booking.status === 'paid') {
      return { success: true, message: 'Pesanan sudah berstatus lunas' };
    }

    booking.status = 'paid';
    bookings[bookingIndex] = booking;
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);

    // Create payment entry
    const methodPrefix = method === 'qris_demo' ? 'QRIS' : method === 'va_demo' ? 'VA' : 'POS';
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      destinationName: booking.destinationName,
      method,
      amount: booking.totalAmount,
      status: 'success',
      reference: `${methodPrefix}-DEMO-${Date.now().toString().slice(-6)}`,
      paidAt: new Date().toISOString(),
      isDemo: true,
    };

    const payments = this.getPayments();
    saveToStorage(STORAGE_KEYS.PAYMENTS, [payment, ...payments]);

    this.logAction(
      user,
      'SIMULATE_PAYMENT',
      'booking',
      booking.bookingCode,
      `Simulasi pembayaran ${method} berhasil untuk kode booking ${booking.bookingCode} (Rp ${booking.totalAmount.toLocaleString('id-ID')}).`
    );

    return { success: true, message: 'Simulasi pembayaran demo berhasil dikonfirmasi', payment };
  }

  public getTickets(bookingCode?: string): Ticket[] {
    const tickets = loadFromStorage<Ticket[]>(STORAGE_KEYS.TICKETS, SEED_TICKETS);
    if (bookingCode) {
      return tickets.filter(
        (t) => t.bookingCode.toUpperCase() === bookingCode.trim().toUpperCase()
      );
    }
    return tickets;
  }

  public getTicketByCode(code: string): Ticket | undefined {
    const cleanCode = code.trim().toUpperCase().replace('WISATAPAY-TGM-', '');
    return this.getTickets().find((t) => t.uniqueCode.toUpperCase() === cleanCode);
  }

  // --- Strict Ticket Validation (Single use, atomic check) ---
  public validateTicket(
    ticketOrBookingCode: string,
    staffUser: User
  ): ValidationResult {
    const clean = ticketOrBookingCode.trim().toUpperCase().replace('WISATAPAY-TGM-', '');
    const allTickets = this.getTickets();
    const allBookings = this.getBookings();

    // 1. Direct search by unique ticket code
    let ticket = allTickets.find((t) => t.uniqueCode.toUpperCase() === clean);

    // 2. Fallback search by booking code (pick first valid ticket from booking)
    if (!ticket) {
      const matchingBooking = allBookings.find((b) => b.bookingCode.toUpperCase() === clean);
      if (matchingBooking) {
        if (matchingBooking.status !== 'paid') {
          return {
            success: false,
            code: 'CANCELLED',
            message: `Pemesanan ${matchingBooking.bookingCode} belum lunas (Status: ${matchingBooking.status}). Tidak dapat divalidasi.`,
            booking: matchingBooking,
          };
        }
        // Find valid ticket in this booking
        ticket = allTickets.find((t) => t.bookingCode.toUpperCase() === clean && t.status === 'valid');
        if (!ticket) {
          // Check if already used
          const usedTicket = allTickets.find((t) => t.bookingCode.toUpperCase() === clean && t.status === 'used');
          if (usedTicket) {
            return {
              success: false,
              code: 'ALREADY_USED',
              message: `Seluruh tiket pada pemesanan ${clean} sudah pernah divalidasi dan digunakan!`,
              ticket: usedTicket,
              booking: matchingBooking,
            };
          }
        }
      }
    }

    if (!ticket) {
      return {
        success: false,
        code: 'NOT_FOUND',
        message: `Kode tiket/pemesanan "${ticketOrBookingCode}" tidak ditemukan dalam sistem!`,
      };
    }

    const booking = allBookings.find((b) => b.bookingCode === ticket!.bookingCode);

    if (ticket.status === 'used') {
      return {
        success: false,
        code: 'ALREADY_USED',
        message: `PERINGATAN: Tiket ${ticket.uniqueCode} SUDAH DIGUNAKAN sebelumnya pada ${new Date(
          ticket.validatedAt || ''
        ).toLocaleString('id-ID')} oleh ${ticket.validatedBy || 'Petugas'}!`,
        ticket,
        booking,
      };
    }

    if (ticket.status === 'cancelled') {
      return {
        success: false,
        code: 'CANCELLED',
        message: `Tiket ${ticket.uniqueCode} berstatus DIBATALKAN. Pengunjung tidak diperkenankan masuk.`,
        ticket,
        booking,
      };
    }

    // Atomic validate & prevent reuse
    const validatedAt = new Date().toISOString();
    const validatedBy = `${staffUser.name} (${staffUser.department || 'Petugas Loket'})`;

    ticket.status = 'used';
    ticket.validatedAt = validatedAt;
    ticket.validatedBy = validatedBy;

    saveToStorage(STORAGE_KEYS.TICKETS, allTickets);

    this.logAction(
      staffUser,
      'VALIDATE_TICKET',
      'ticket',
      ticket.uniqueCode,
      `Validasi sukses di gerbang masuk ${ticket.destinationName} untuk tiket ${ticket.uniqueCode} an. ${ticket.customerName}.`
    );

    return {
      success: true,
      code: 'VALID',
      message: `TIKET VALID! Akses masuk diizinkan untuk ${ticket.customerName} (${ticket.ticketTypeName}).`,
      ticket,
      booking,
    };
  }

  // --- Payments ---
  public getPayments(): Payment[] {
    const list = loadFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
    return [...list].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
  }

  // --- CSV Export (Genuine functional browser download) ---
  public exportBookingsCSV(): void {
    const bookings = this.getBookings();
    const headers = [
      'Kode Pemesanan',
      'Nama Pemesan',
      'Email',
      'No Telepon',
      'Asal Domisili',
      'Destinasi',
      'Tanggal Kunjungan',
      'Total Bayar (Rp)',
      'Status',
      'Waktu Pemesanan',
    ];

    const rows = bookings.map((b) => [
      `"${b.bookingCode}"`,
      `"${b.customerName}"`,
      `"${b.customerEmail}"`,
      `"${b.customerPhone}"`,
      `"${b.customerOrigin}"`,
      `"${b.destinationName}"`,
      `"${b.visitDate}"`,
      b.totalAmount,
      `"${b.status.toUpperCase()}"`,
      `"${b.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    this.downloadCSV(csvContent, `Laporan-Pemesanan-WisataPay-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  public exportTransactionsCSV(): void {
    const payments = this.getPayments();
    const headers = [
      'ID Transaksi',
      'Kode Booking',
      'Destinasi',
      'Metode Pembayaran',
      'Jumlah (Rp)',
      'Status Pembayaran',
      'Nomor Referensi',
      'Waktu Transaksi',
      'Status Demo',
    ];

    const rows = payments.map((p) => [
      `"${p.id}"`,
      `"${p.bookingCode}"`,
      `"${p.destinationName}"`,
      `"${p.method}"`,
      p.amount,
      `"${p.status.toUpperCase()}"`,
      `"${p.reference}"`,
      `"${p.paidAt}"`,
      p.isDemo ? '"SIMULASI DEMO"' : '"RESMI"',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    this.downloadCSV(csvContent, `Laporan-Transaksi-WisataPay-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  private downloadCSV(csvContent: string, fileName: string): void {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const storageService = new StorageService();
