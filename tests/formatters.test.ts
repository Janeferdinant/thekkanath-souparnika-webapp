import { describe, it, expect } from 'vitest';
import {
  formatINR,
  paiseToRupees,
  rupeesToPaise,
  isValidIndianPhone,
  normalizeIndianPhone,
  formatTime12h,
} from '../src/lib/formatters';

describe('Formatters - Currency & Math', () => {
  it('converts between rupees and integer paise accurately without float errors', () => {
    expect(rupeesToPaise(1500)).toBe(150000);
    expect(rupeesToPaise(25000.5)).toBe(2500050);
    expect(paiseToRupees(150000)).toBe(1500);
    expect(paiseToRupees(2500050)).toBe(25000.5);
  });

  it('formats currency in Indian Rupees format', () => {
    const formatted = formatINR(15000000); // 1,50,000 rupees
    expect(formatted).toContain('1,50,000');
    expect(formatted).toMatch(/₹|INR/);
  });
});

describe('Formatters - Indian Phone Validation', () => {
  it('accepts valid 10-digit Indian numbers starting with 6, 7, 8, or 9', () => {
    expect(isValidIndianPhone('9847012345')).toBe(true);
    expect(isValidIndianPhone('8129764370')).toBe(true);
    expect(isValidIndianPhone('9446143165')).toBe(true);
    expect(isValidIndianPhone('+919847012345')).toBe(true);
    expect(isValidIndianPhone('+91 81297 64370')).toBe(true);
    expect(isValidIndianPhone('08129764370')).toBe(true);
  });

  it('rejects invalid or international non-Indian formats', () => {
    expect(isValidIndianPhone('123456')).toBe(false);
    expect(isValidIndianPhone('5551234567')).toBe(false); // Does not start with 6-9
    expect(isValidIndianPhone('abc8129764370')).toBe(false);
  });

  it('normalizes phone number to 10 digits', () => {
    expect(normalizeIndianPhone('+918129764370')).toBe('8129764370');
    expect(normalizeIndianPhone('08129764370')).toBe('8129764370');
    expect(normalizeIndianPhone('8129764370')).toBe('8129764370');
  });
});

describe('Formatters - Time Formatting', () => {
  it('formats 24h time to 12h AM/PM format', () => {
    expect(formatTime12h('09:30')).toBe('9:30 AM');
    expect(formatTime12h('12:00')).toBe('12:00 PM');
    expect(formatTime12h('15:45')).toBe('3:45 PM');
    expect(formatTime12h('20:00')).toBe('8:00 PM');
  });
});
