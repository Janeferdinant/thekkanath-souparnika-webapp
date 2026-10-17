export type UserRole =
  | 'super_admin'
  | 'administrator'
  | 'booking_manager'
  | 'operations_manager'
  | 'accounts'
  | 'staff'
  | 'vendor'
  | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Hall {
  id: string;
  slug: string;
  name: string;
  floor: string;
  capacityText: string;
  capacityNumber: number; // Stated max 100
  airConditioned: boolean;
  coverImage: string;
  galleryImages: string[];
  description: string;
  suggestedUses: string[];
  features: string[];
  soundproofingNotes?: string;
  published: boolean;
  sortOrder: number;
}

export interface Facility {
  id: string;
  title: string;
  category: string;
  description: string;
  badge?: string;
  iconName: string;
}

export type EventType =
  | 'Wedding & Reception'
  | 'Ceremony / Ritual'
  | 'Cultural Programme'
  | 'Seminar / Conference'
  | 'Family Gathering'
  | 'Birthday / Anniversary'
  | 'Other';

export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'needs_info'
  | 'site_visit_scheduled'
  | 'quotation_in_progress'
  | 'quoted'
  | 'converted_to_booking'
  | 'lost'
  | 'closed';

export interface Enquiry {
  id: string;
  reference: string; // e.g. TS-ENQ-2026-1001
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: EventType;
  preferredDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  preferredHallId?: string; // hall id or 'any'
  estimatedGuests: number;
  specialRequests?: string;
  consentGiven: boolean;
  status: EnquiryStatus;
  lostReason?: string;
  assignedStaffId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'tentative_hold'
  | 'reviewing'
  | 'quotation_sent'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  reference: string; // e.g. TS-BKG-2026-001
  enquiryId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  hallId: string;
  hallName: string;
  eventType: EventType;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  guestCount: number;
  status: BookingStatus;
  holdExpiresAt?: string; // ISO string for tentative holds
  totalAgreedPaise?: number; // Integer paise
  advancePaidPaise?: number; // Integer paise
  specialRequirements?: string;
  assignedManagerId?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceBlock {
  id: string;
  hallId: string;
  hallName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  title: string;
  reason: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  assignedTo?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  totalBookings: number;
  notes?: string;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPricePaise: number;
  totalPaise: number;
}

export interface Quotation {
  id: string;
  reference: string;
  bookingId?: string;
  enquiryId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  hallName: string;
  eventDate: string;
  items: QuoteItem[];
  subtotalPaise: number;
  discountPaise: number;
  taxPaise: number; // Configurable by owner only
  totalPaise: number;
  status: 'draft' | 'approved_internally' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
  reference: string; // TS-RCP-2026-001
  bookingId: string;
  bookingReference: string;
  customerName: string;
  amountPaise: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'upi' | 'cheque';
  transactionReference?: string;
  status: 'completed' | 'pending' | 'refunded';
  notes?: string;
  recordedBy: string;
  receivedAt: string;
}

export interface ExpenseRecord {
  id: string;
  category:
    | 'Utilities (Electricity/Water)'
    | 'Salaries & Wages'
    | 'Repairs & Maintenance'
    | 'Cleaning & Housekeeping'
    | 'Supplies & Consumables'
    | 'Marketing & Promotion'
    | 'Software & Telecom'
    | 'Insurance & Taxes'
    | 'Other';
  description: string;
  amountPaise: number;
  vendorName?: string;
  expenseDate: string;
  paymentMethod: string;
  status: 'paid' | 'pending';
  recordedBy: string;
  createdAt: string;
}

export interface StaffTask {
  id: string;
  bookingId?: string;
  title: string;
  hallName?: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  stage: 'pre_event' | 'setup' | 'event_day' | 'cleanup' | 'post_event';
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
  dueDate: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Catering Equipment' | 'Sound & AV' | 'Florist / Decor' | 'Electrical' | 'Plumbing' | 'Cleaning' | 'Security';
  contactPerson: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  category: 'quotation' | 'receipt' | 'contract' | 'maintenance' | 'brochure' | 'license';
  fileSize: string;
  uploadedBy: string;
  linkedReference?: string;
  createdAt: string;
}
