import {
  Enquiry,
  Booking,
  Customer,
  Quotation,
  PaymentReceipt,
  ExpenseRecord,
  StaffTask,
  Vendor,
  MaintenanceBlock,
  AuditLogEntry,
  DocumentRecord,
  UserProfile,
} from '../types/models';
import {
  DEMO_PROFILES,
  DEMO_CUSTOMERS,
  DEMO_ENQUIRIES,
  DEMO_BOOKINGS,
  DEMO_MAINTENANCE,
  DEMO_QUOTES,
  DEMO_PAYMENTS,
  DEMO_EXPENSES,
  DEMO_STAFF_TASKS,
  DEMO_VENDORS,
  DEMO_DOCUMENTS,
  DEMO_AUDIT_LOG,
} from '../data/demoSeed';
import { checkHallAvailability } from './bookingEngine';

const STORAGE_KEYS = {
  CURRENT_USER: 'ts_current_user',
  ENQUIRIES: 'ts_enquiries',
  BOOKINGS: 'ts_bookings',
  CUSTOMERS: 'ts_customers',
  QUOTES: 'ts_quotes',
  PAYMENTS: 'ts_payments',
  EXPENSES: 'ts_expenses',
  TASKS: 'ts_tasks',
  VENDORS: 'ts_vendors',
  MAINTENANCE: 'ts_maintenance',
  DOCUMENTS: 'ts_documents',
  AUDIT_LOG: 'ts_audit_log',
  SETTINGS: 'ts_venue_settings',
};

/**
 * Checks if Supabase environment variables are available and properly configured
 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 20);
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

/**
 * Generic local storage loader with default fallback
 */
function load<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultData;
  }
}

/**
 * Generic local storage saver
 */
function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving localStorage key "${key}":`, err);
  }
}

export const StorageService = {
  // Reset all local storage data back to demo seed fixtures
  resetAllDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(DEMO_ENQUIRIES));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(DEMO_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(DEMO_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(DEMO_QUOTES));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEMO_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEMO_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEMO_STAFF_TASKS));
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(DEMO_VENDORS));
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(DEMO_MAINTENANCE));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(DEMO_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(DEMO_AUDIT_LOG));
  },

  // Auth / Current User Profile
  getCurrentUser(): UserProfile {
    return load<UserProfile>(STORAGE_KEYS.CURRENT_USER, DEMO_PROFILES[0]);
  },

  setCurrentUser(user: UserProfile): void {
    save(STORAGE_KEYS.CURRENT_USER, user);
  },

  getAvailableProfiles(): UserProfile[] {
    return DEMO_PROFILES;
  },

  // Enquiries
  getEnquiries(): Enquiry[] {
    return load<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, DEMO_ENQUIRIES);
  },

  getEnquiryById(id: string): Enquiry | undefined {
    return this.getEnquiries().find((e) => e.id === id);
  },

  createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt'>): Enquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    enquiries.unshift(newEnquiry);
    save(STORAGE_KEYS.ENQUIRIES, enquiries);

    this.logAction('PUBLIC_ENQUIRY_CREATED', 'Enquiry', newEnquiry.id, `New enquiry ${newEnquiry.reference} from ${newEnquiry.customerName}`);
    return newEnquiry;
  },

  updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry | undefined {
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;

    enquiries[idx] = {
      ...enquiries[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    save(STORAGE_KEYS.ENQUIRIES, enquiries);
    this.logAction('ENQUIRY_UPDATED', 'Enquiry', id, `Updated enquiry ${enquiries[idx].reference}`);
    return enquiries[idx];
  },

  // Bookings
  getBookings(): Booking[] {
    return load<Booking[]>(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
  },

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id === id);
  },

  createBooking(
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; booking?: Booking; error?: string } {
    const bookings = this.getBookings();
    const maintenance = this.getMaintenanceBlocks();

    // Check conflict atomically
    const conflict = checkHallAvailability(
      bookingData.hallId,
      bookingData.eventDate,
      bookingData.startTime,
      bookingData.endTime,
      bookings,
      maintenance
    );

    if (conflict.hasConflict) {
      return { success: false, error: conflict.message };
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `bkg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    save(STORAGE_KEYS.BOOKINGS, bookings);

    // Update customer total bookings
    this.upsertCustomerFromBooking(newBooking);

    this.logAction(
      'BOOKING_CREATED',
      'Booking',
      newBooking.id,
      `Created booking ${newBooking.reference} for ${newBooking.customerName} on ${newBooking.eventDate}`
    );

    return { success: true, booking: newBooking };
  },

  updateBooking(
    id: string,
    updates: Partial<Booking>
  ): { success: boolean; booking?: Booking; error?: string } {
    const bookings = this.getBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return { success: false, error: 'Booking not found' };

    const current = bookings[idx];
    const candidateHallId = updates.hallId || current.hallId;
    const candidateDate = updates.eventDate || current.eventDate;
    const candidateStart = updates.startTime || current.startTime;
    const candidateEnd = updates.endTime || current.endTime;

    // Check conflicts if hall or time range changed
    if (
      updates.hallId ||
      updates.eventDate ||
      updates.startTime ||
      updates.endTime
    ) {
      const maintenance = this.getMaintenanceBlocks();
      const conflict = checkHallAvailability(
        candidateHallId,
        candidateDate,
        candidateStart,
        candidateEnd,
        bookings,
        maintenance,
        id // Exclude self
      );

      if (conflict.hasConflict) {
        return { success: false, error: conflict.message };
      }
    }

    bookings[idx] = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    save(STORAGE_KEYS.BOOKINGS, bookings);

    this.logAction(
      'BOOKING_UPDATED',
      'Booking',
      id,
      `Updated booking ${bookings[idx].reference} status to ${bookings[idx].status}`
    );

    return { success: true, booking: bookings[idx] };
  },

  // Customers
  getCustomers(): Customer[] {
    return load<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
  },

  upsertCustomerFromBooking(b: Booking): void {
    const customers = this.getCustomers();
    const existing = customers.find(
      (c) => c.phone === b.customerPhone || (b.customerEmail && c.email === b.customerEmail)
    );

    if (existing) {
      existing.totalBookings += 1;
      save(STORAGE_KEYS.CUSTOMERS, customers);
    } else {
      const newCust: Customer = {
        id: b.customerId || `cust-${Date.now()}`,
        name: b.customerName,
        phone: b.customerPhone,
        email: b.customerEmail,
        totalBookings: 1,
        createdAt: new Date().toISOString(),
      };
      customers.push(newCust);
      save(STORAGE_KEYS.CUSTOMERS, customers);
    }
  },

  // Payments & Receipts
  getPayments(): PaymentReceipt[] {
    return load<PaymentReceipt[]>(STORAGE_KEYS.PAYMENTS, DEMO_PAYMENTS);
  },

  createPayment(payment: Omit<PaymentReceipt, 'id'>): PaymentReceipt {
    const payments = this.getPayments();
    const newPayment: PaymentReceipt = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    payments.unshift(newPayment);
    save(STORAGE_KEYS.PAYMENTS, payments);

    // Update booking advance paid if linked
    const bookings = this.getBookings();
    const bkgIdx = bookings.findIndex((b) => b.id === payment.bookingId);
    if (bkgIdx !== -1) {
      bookings[bkgIdx].advancePaidPaise =
        (bookings[bkgIdx].advancePaidPaise || 0) + payment.amountPaise;
      save(STORAGE_KEYS.BOOKINGS, bookings);
    }

    this.logAction(
      'PAYMENT_RECORDED',
      'PaymentReceipt',
      newPayment.id,
      `Recorded payment ${newPayment.reference} of ₹${newPayment.amountPaise / 100} (${newPayment.paymentMethod})`
    );

    return newPayment;
  },

  // Expenses
  getExpenses(): ExpenseRecord[] {
    return load<ExpenseRecord[]>(STORAGE_KEYS.EXPENSES, DEMO_EXPENSES);
  },

  createExpense(expense: Omit<ExpenseRecord, 'id' | 'createdAt'>): ExpenseRecord {
    const expenses = this.getExpenses();
    const newExpense: ExpenseRecord = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    expenses.unshift(newExpense);
    save(STORAGE_KEYS.EXPENSES, expenses);

    this.logAction(
      'EXPENSE_RECORDED',
      'ExpenseRecord',
      newExpense.id,
      `Recorded expense ₹${newExpense.amountPaise / 100} for ${newExpense.description}`
    );

    return newExpense;
  },

  // Quotations
  getQuotes(): Quotation[] {
    return load<Quotation[]>(STORAGE_KEYS.QUOTES, DEMO_QUOTES);
  },

  createQuote(quote: Omit<Quotation, 'id' | 'createdAt'>): Quotation {
    const quotes = this.getQuotes();
    const newQuote: Quotation = {
      ...quote,
      id: `qte-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    quotes.unshift(newQuote);
    save(STORAGE_KEYS.QUOTES, quotes);

    this.logAction('QUOTE_CREATED', 'Quotation', newQuote.id, `Created quotation ${newQuote.reference}`);
    return newQuote;
  },

  // Staff Tasks
  getStaffTasks(): StaffTask[] {
    return load<StaffTask[]>(STORAGE_KEYS.TASKS, DEMO_STAFF_TASKS);
  },

  updateStaffTaskStatus(id: string, status: StaffTask['status']): void {
    const tasks = this.getStaffTasks();
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      save(STORAGE_KEYS.TASKS, tasks);
    }
  },

  createStaffTask(task: Omit<StaffTask, 'id' | 'createdAt'>): StaffTask {
    const tasks = this.getStaffTasks();
    const newTask: StaffTask = {
      ...task,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    save(STORAGE_KEYS.TASKS, tasks);
    return newTask;
  },

  // Vendors
  getVendors(): Vendor[] {
    return load<Vendor[]>(STORAGE_KEYS.VENDORS, DEMO_VENDORS);
  },

  createVendor(vendor: Omit<Vendor, 'id'>): Vendor {
    const vendors = this.getVendors();
    const newVendor: Vendor = {
      ...vendor,
      id: `ven-${Date.now()}`,
    };
    vendors.push(newVendor);
    save(STORAGE_KEYS.VENDORS, vendors);
    return newVendor;
  },

  // Maintenance
  getMaintenanceBlocks(): MaintenanceBlock[] {
    return load<MaintenanceBlock[]>(STORAGE_KEYS.MAINTENANCE, DEMO_MAINTENANCE);
  },

  createMaintenanceBlock(block: Omit<MaintenanceBlock, 'id' | 'createdAt'>): MaintenanceBlock {
    const blocks = this.getMaintenanceBlocks();
    const newBlock: MaintenanceBlock = {
      ...block,
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    blocks.unshift(newBlock);
    save(STORAGE_KEYS.MAINTENANCE, blocks);
    return newBlock;
  },

  // Documents
  getDocuments(): DocumentRecord[] {
    return load<DocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, DEMO_DOCUMENTS);
  },

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    return load<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOG, DEMO_AUDIT_LOG);
  },

  logAction(action: string, targetType: string, targetId: string, details: string): void {
    const logs = this.getAuditLogs();
    const user = this.getCurrentUser();
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorName: user.fullName || 'System',
      actorRole: user.role || 'administrator',
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(entry);
    save(STORAGE_KEYS.AUDIT_LOG, logs.slice(0, 500)); // Keep last 500
  },
};
