import { describe, it, expect } from 'vitest';
import {
  allocateBookingAccount,
  calculateHeadroom,
  CEILING_TURNOVER_PAISE,
  WARNING_THRESHOLD_PERCENT,
} from '../src/lib/financeEngine';

describe('Finance Engine - Dual-Account Load Balancing (Under ₹20 Lakhs)', () => {
  const LAKH_PAISE = 100_000 * 100; // ₹1,00,000 in paise
  const TWENTY_LAKHS_PAISE = 20 * LAKH_PAISE; // ₹20,00,000 in paise

  it('exports correct ceiling constant (₹20 Lakhs in paise)', () => {
    expect(CEILING_TURNOVER_PAISE).toBe(TWENTY_LAKHS_PAISE);
    expect(WARNING_THRESHOLD_PERCENT).toBe(90);
  });

  it('allocates to account with lower current turnover when both have ample headroom', () => {
    // Account 1: ₹10L, Account 2: ₹5L. Booking: ₹2L -> Should route to Account 2
    const allocated = allocateBookingAccount(2 * LAKH_PAISE, 10 * LAKH_PAISE, 5 * LAKH_PAISE);
    expect(allocated).toBe('account_2');

    // Account 1: ₹4L, Account 2: ₹8L. Booking: ₹1L -> Should route to Account 1
    const allocated2 = allocateBookingAccount(1 * LAKH_PAISE, 4 * LAKH_PAISE, 8 * LAKH_PAISE);
    expect(allocated2).toBe('account_1');
  });

  it('diverts to Account 2 if assigning to Account 1 would exceed ₹20 Lakhs', () => {
    // Account 1: ₹19L (has ₹1L room), Account 2: ₹12L (has ₹8L room). Booking: ₹1.5L
    const allocated = allocateBookingAccount(1.5 * LAKH_PAISE, 19 * LAKH_PAISE, 12 * LAKH_PAISE);
    expect(allocated).toBe('account_2');
  });

  it('diverts to Account 1 if assigning to Account 2 would exceed ₹20 Lakhs', () => {
    // Account 1: ₹11L (has ₹9L room), Account 2: ₹19.5L (has ₹50k room). Booking: ₹1L
    const allocated = allocateBookingAccount(1 * LAKH_PAISE, 11 * LAKH_PAISE, 19.5 * LAKH_PAISE);
    expect(allocated).toBe('account_1');
  });

  it('falls back to the account with greater headroom when booking exceeds both individually', () => {
    // Account 1 has ₹1.5L room, Account 2 has ₹50k room. Booking is ₹2L (spillover case)
    const allocated = allocateBookingAccount(
      2 * LAKH_PAISE,
      18.5 * LAKH_PAISE,
      19.5 * LAKH_PAISE
    );
    expect(allocated).toBe('account_1');
  });

  it('calculates headroom and triggers 90% warning correctly', () => {
    // ₹10 Lakhs = 50%
    const statusHalf = calculateHeadroom(10 * LAKH_PAISE);
    expect(statusHalf.percentageUsed).toBe(50);
    expect(statusHalf.remainingPaise).toBe(10 * LAKH_PAISE);
    expect(statusHalf.isWarning).toBe(false);
    expect(statusHalf.isCapped).toBe(false);

    // ₹18.5 Lakhs = 92.5% -> warning true
    const statusWarn = calculateHeadroom(18.5 * LAKH_PAISE);
    expect(statusWarn.isWarning).toBe(true);
    expect(statusWarn.isCapped).toBe(false);

    // ₹20 Lakhs = 100% -> capped true
    const statusCapped = calculateHeadroom(20 * LAKH_PAISE);
    expect(statusCapped.percentageUsed).toBe(100);
    expect(statusCapped.remainingPaise).toBe(0);
    expect(statusCapped.isCapped).toBe(true);
  });
});
