import { describe, it, expect, beforeEach } from 'vitest';
import {
  sendEnquiryAcknowledgmentEmail,
  sendBookingConfirmedEmail,
  getEmailLogs,
  clearEmailLogs,
} from '../src/lib/emailService';
import { Enquiry, Booking, PaymentReceipt } from '../src/types/models';

describe('Transactional Email Service - Resend & In-App Activity Drawer', () => {
  beforeEach(() => {
    clearEmailLogs();
  });

  const sampleEnquiry: Enquiry = {
    id: 'enq-101',
    reference: 'TS-ENQ-2026-101',
    customerName: 'Kavitha Nair',
    customerEmail: 'kavitha@example.com',
    customerPhone: '9847123456',
    eventType: 'Wedding & Reception',
    preferredDate: '2026-12-10',
    session: 'morning',
    estimatedGuests: 200,
    consentGiven: true,
    status: 'new',
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z',
  };

  const sampleBooking: Booking = {
    id: 'bkg-202',
    reference: 'TS-BKG-2026-202',
    customerId: 'cust-50',
    customerName: 'Deepak Varma',
    customerEmail: 'deepak@example.com',
    customerPhone: '9446987654',
    hallId: 'auditorium',
    hallName: 'Thekkanath Souparnika (Full Venue)',
    session: 'morning',
    eventType: 'Wedding & Reception',
    eventDate: '2026-12-15',
    startTime: '08:00',
    endTime: '15:00',
    guestCount: 250,
    status: 'confirmed',
    totalAgreedPaise: 7500000, // ₹75,000
    advancePaidPaise: 2500000, // ₹25,000
    createdAt: '2026-10-18T11:00:00Z',
    updatedAt: '2026-10-18T11:00:00Z',
  };

  const sampleReceipt: PaymentReceipt = {
    id: 'rcp-303',
    reference: 'TS-RCP-2026-303',
    bookingId: 'bkg-202',
    bookingReference: 'TS-BKG-2026-202',
    customerName: 'Deepak Varma',
    amountPaise: 2500000,
    paymentMethod: 'bank_transfer',
    transactionReference: 'UTR987654321',
    status: 'completed',
    recordedBy: 'Accounts Manager',
    receivedAt: '2026-10-18T11:30:00Z',
  };

  it('generates and records an enquiry acknowledgment email with session and address', async () => {
    const log = await sendEnquiryAcknowledgmentEmail(sampleEnquiry);

    expect(log.to).toBe('kavitha@example.com');
    expect(log.subject).toContain('Enquiry Acknowledgment');
    expect(log.subject).toContain('TS-ENQ-2026-101');
    expect(log.htmlBody).toContain('TS-ENQ-2026-101');
    expect(log.htmlBody).toContain('Morning Session');
    expect(log.htmlBody).toContain('Nellikunnu');
    expect(log.template).toBe('enquiry_ack');
    expect(['sent', 'simulated']).toContain(log.status);

    const logs = getEmailLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].id).toBe(log.id);
  });

  it('generates and records a booking confirmation email with financial breakdown and receipt', async () => {
    const log = await sendBookingConfirmedEmail(sampleBooking, sampleReceipt);

    expect(log.to).toBe('deepak@example.com');
    expect(log.subject).toContain('Booking Confirmation');
    expect(log.subject).toContain('TS-BKG-2026-202');
    expect(log.htmlBody).toContain('TS-BKG-2026-202');
    expect(log.htmlBody).toContain('TS-RCP-2026-303');
    expect(log.htmlBody).toContain('UTR987654321');
    expect(log.template).toBe('booking_confirmed');

    const logs = getEmailLogs();
    expect(logs).toHaveLength(1);
  });
});
