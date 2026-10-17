import { Enquiry, Booking, PaymentReceipt } from '../types/models';
import { VENUE_INFO } from '../data/venueData';
import { formatCurrencyPaise } from './formatters';

export interface EmailLogEntry {
  id: string;
  to: string;
  subject: string;
  template: 'enquiry_ack' | 'booking_confirmed';
  htmlBody: string;
  status: 'sent' | 'simulated' | 'failed';
  error?: string;
  sentAt: string;
}

// In-memory activity log (persists to localStorage in browser environments)
let inMemoryEmailLogs: EmailLogEntry[] = [];

export function getEmailLogs(): EmailLogEntry[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem('thekkanath_email_logs');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback to in-memory
    }
  }
  return [...inMemoryEmailLogs];
}

export function clearEmailLogs(): void {
  inMemoryEmailLogs = [];
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem('thekkanath_email_logs');
    } catch {
      // Ignore
    }
  }
}

function saveEmailLog(entry: EmailLogEntry): void {
  inMemoryEmailLogs.unshift(entry);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const current = getEmailLogs();
      const updated = [entry, ...current.filter((l) => l.id !== entry.id)].slice(0, 50);
      window.localStorage.setItem('thekkanath_email_logs', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Builds HTML template with Burgundy and Rose Gold branding
 */
function buildEmailWrapper(title: string, subtitle: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #1A0510; }
    .email-container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(91, 29, 39, 0.1); border: 1px solid rgba(229, 169, 155, 0.3); }
    .email-header { background: linear-gradient(135deg, #4A0E17 0%, #5B1D27 100%); padding: 36px 24px; text-align: center; color: #FDFBF7; }
    .email-logo-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 700; letter-spacing: 0.05em; margin: 0; color: #FFFFFF; }
    .email-logo-subtitle { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #E5A99B; margin-top: 6px; }
    .email-body { padding: 32px 28px; line-height: 1.6; }
    .email-footer { background: #FAF7F2; padding: 24px; text-align: center; font-size: 12px; color: #7C2538; border-top: 1px solid #F2D6DC; }
    .details-box { background: #FDFBF7; border: 1px solid #F2D6DC; border-radius: 8px; padding: 18px 20px; margin: 20px 0; }
    .details-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #F2D6DC; font-size: 14px; }
    .details-row:last-child { border-bottom: none; }
    .details-label { color: #5B1D27; font-weight: 500; }
    .details-value { color: #1A0510; font-weight: 600; }
    .btn { display: inline-block; padding: 12px 24px; background: #5B1D27; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 16px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1 class="email-logo-title">${VENUE_INFO.name}</h1>
      <div class="email-logo-subtitle">H A L L & E V E N T S V E N U E</div>
    </div>
    <div class="email-body">
      <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; color: #5B1D27; margin-top: 0;">${subtitle}</h2>
      ${bodyContent}
    </div>
    <div class="email-footer">
      <p style="margin: 0 0 4px 0; font-weight: 600;">${VENUE_INFO.name}</p>
      <p style="margin: 0 0 8px 0;">${VENUE_INFO.address.fullFormatted}</p>
      <p style="margin: 0;">Phone: ${VENUE_INFO.displayPhones.join(' | ')} · Email: ${VENUE_INFO.email}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sends or simulates an Enquiry Acknowledgment Email
 */
export async function sendEnquiryAcknowledgmentEmail(enquiry: Enquiry): Promise<EmailLogEntry> {
  const sessionLabel =
    enquiry.session === 'morning'
      ? 'Morning Session (8:00 AM – 3:00 PM)'
      : enquiry.session === 'evening'
      ? 'Evening Session (5:00 PM – 10:00 PM)'
      : enquiry.session === 'full_day'
      ? 'Full Day (8:00 AM – 10:00 PM)'
      : 'To Be Decided';

  const bodyContent = `
    <p>Dear <strong>${enquiry.customerName}</strong>,</p>
    <p>Thank you for enquiring with <strong>${VENUE_INFO.name}</strong>. We have received your event enquiry and our reservations desk will review availability and contact you shortly.</p>
    
    <div class="details-box">
      <div class="details-row"><span class="details-label">Enquiry Reference:</span><span class="details-value">${enquiry.reference}</span></div>
      <div class="details-row"><span class="details-label">Preferred Date:</span><span class="details-value">${enquiry.preferredDate}</span></div>
      <div class="details-row"><span class="details-label">Selected Session:</span><span class="details-value">${sessionLabel}</span></div>
      <div class="details-row"><span class="details-label">Event Type:</span><span class="details-value">${enquiry.eventType}</span></div>
      <div class="details-row"><span class="details-label">Estimated Guests:</span><span class="details-value">${enquiry.estimatedGuests} guests</span></div>
    </div>

    <p style="font-size: 13px; color: #5B1D27;"><strong>Need catering recommendation?</strong> We partner with premier traditional Kerala Sadhya and multi-cuisine buffet caterers in Thrissur. Let us know during our call if you would like catering assistance.</p>
    
    <p>Warm regards,<br><strong>Reservations Desk</strong><br>${VENUE_INFO.name}</p>
  `;

  const htmlBody = buildEmailWrapper(
    'Enquiry Acknowledgment',
    `We Have Received Your Event Enquiry`,
    bodyContent
  );

  const logEntry: EmailLogEntry = {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    to: enquiry.customerEmail,
    subject: `Enquiry Acknowledgment [${enquiry.reference}] - ${VENUE_INFO.name}`,
    template: 'enquiry_ack',
    htmlBody,
    status: 'simulated',
    sentAt: new Date().toISOString(),
  };

  saveEmailLog(logEntry);
  return logEntry;
}

/**
 * Sends or simulates a Booking Confirmation Email with Payment Receipt
 */
export async function sendBookingConfirmedEmail(
  booking: Booking,
  receipt?: PaymentReceipt
): Promise<EmailLogEntry> {
  const sessionLabel =
    booking.session === 'morning'
      ? 'Morning Session (8:00 AM – 3:00 PM)'
      : booking.session === 'evening'
      ? 'Evening Session (5:00 PM – 10:00 PM)'
      : booking.session === 'full_day'
      ? 'Full Day (8:00 AM – 10:00 PM)'
      : `${booking.startTime} - ${booking.endTime}`;

  const advanceText = booking.advancePaidPaise
    ? formatCurrencyPaise(booking.advancePaidPaise)
    : 'Received';
  const totalText = booking.totalAgreedPaise
    ? formatCurrencyPaise(booking.totalAgreedPaise)
    : 'Agreed';

  const bodyContent = `
    <p>Dear <strong>${booking.customerName}</strong>,</p>
    <p>We are delighted to confirm your reservation at <strong>${VENUE_INFO.name}</strong>. Your event date and session are officially reserved on our calendar.</p>
    
    <div class="details-box">
      <div class="details-row"><span class="details-label">Booking Reference:</span><span class="details-value">${booking.reference}</span></div>
      <div class="details-row"><span class="details-label">Event Date:</span><span class="details-value">${booking.eventDate}</span></div>
      <div class="details-row"><span class="details-label">Reserved Session:</span><span class="details-value">${sessionLabel}</span></div>
      <div class="details-row"><span class="details-label">Venue:</span><span class="details-value">${booking.hallName}</span></div>
      <div class="details-row"><span class="details-label">Event Type:</span><span class="details-value">${booking.eventType}</span></div>
      <div class="details-row"><span class="details-label">Total Agreed Amount:</span><span class="details-value">${totalText}</span></div>
      <div class="details-row"><span class="details-label">Advance Paid:</span><span class="details-value">${advanceText}</span></div>
      ${
        receipt
          ? `<div class="details-row"><span class="details-label">Receipt Reference:</span><span class="details-value">${receipt.reference}</span></div>
             <div class="details-row"><span class="details-label">Transaction Reference:</span><span class="details-value">${receipt.transactionReference || 'Direct'}</span></div>`
          : ''
      }
    </div>

    <p style="font-size: 13px; color: #5B1D27;"><strong>Venue Access Guidelines:</strong> Arrive 30 minutes before your reserved session begins for stage and decorator handover. Our on-site manager will welcome your team at the Market Junction entrance.</p>
    
    <p>Warm regards,<br><strong>Management</strong><br>${VENUE_INFO.name}</p>
  `;

  const htmlBody = buildEmailWrapper(
    'Booking Confirmation & Receipt',
    `Your Booking is Confirmed!`,
    bodyContent
  );

  const logEntry: EmailLogEntry = {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    to: booking.customerEmail,
    subject: `Booking Confirmation [${booking.reference}] - ${VENUE_INFO.name}`,
    template: 'booking_confirmed',
    htmlBody,
    status: 'simulated',
    sentAt: new Date().toISOString(),
  };

  saveEmailLog(logEntry);
  return logEntry;
}
