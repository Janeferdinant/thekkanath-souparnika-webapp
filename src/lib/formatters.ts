/**
 * Utilities for formatting Currency in INR (₹) using integer paise,
 * formatting dates and times in Asia/Kolkata timezone, and generating human-readable references.
 */

export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Format currency in Indian Rupees using standard Indian numbering system (e.g. ₹1,25,000)
 */
export function formatINR(paise: number, showDecimals: boolean = false): string {
  const rupees = paiseToRupees(paise);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(rupees);
}

export const formatCurrencyPaise = formatINR;

/**
 * Validates Indian Phone Numbers (10 digits with optional +91 or 0 prefix)
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Matches +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, or XXXXXXXXXX where X is 6-9 followed by 9 digits
  const indianPhoneRegex = /^(?:\+?91|0)?[6-9]\d{9}$/;
  return indianPhoneRegex.test(cleaned);
}

/**
 * Normalizes phone numbers to standard 10-digit or +91 display format
 */
export function normalizeIndianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+91')) {
    return cleaned.slice(3);
  }
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned.slice(2);
  }
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Formats date into readable string in Asia/Kolkata timezone (e.g., "Saturday, 25 October 2026")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats time string (HH:mm) into 12-hour AM/PM format
 */
export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Generate sequential-like unique reference for enquiries, bookings, and receipts
 */
export function generateReference(prefix: 'TS-ENQ' | 'TS-BKG' | 'TS-QTE' | 'TS-RCP' | 'TS-DOC'): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomSuffix}`;
}
