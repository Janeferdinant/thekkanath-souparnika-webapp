import { describe, it, expect } from 'vitest';
import {
  calculateReferralBonus,
  searchReferrers,
  transitionReferralStatus,
  ReferrerContact,
} from '../src/lib/referralEngine';

describe('Referral Engine - Calculation, Autocomplete & Lifecycle', () => {
  const SAMPLE_REFERRERS: ReferrerContact[] = [
    {
      id: 'ref-1',
      name: 'Rahul Varma',
      phone: '9446123456',
      email: 'rahul.varma@example.com',
      upiId: 'rahul@okhdfcbank',
      totalReferrals: 3,
    },
    {
      id: 'ref-2',
      name: 'Aiswarya Lakshmi',
      phone: '8129555666',
      email: 'aiswarya@gmail.com',
      totalReferrals: 1,
    },
    {
      id: 'ref-3',
      name: 'George Nellikunnu',
      phone: '9847111222',
      email: 'george@thekkanath.org',
      totalReferrals: 5,
    },
  ];

  it('calculates flat rupee referral bonus accurately', () => {
    const flatBonus = calculateReferralBonus('flat', 5000000, 250000); // base rent ₹50k, flat bonus ₹2.5k
    expect(flatBonus).toBe(250000);
  });

  it('calculates percentage of base rent referral bonus accurately', () => {
    // 5% of ₹1,00,000 (100,000 * 100 paise = 10,000,000 paise) = ₹5,000 (500,000 paise)
    const baseRentPaise = 100_000 * 100;
    const percentBonus = calculateReferralBonus('percentage', baseRentPaise, undefined, 5);
    expect(percentBonus).toBe(500_000);
  });

  it('autocompletes referrers by partial phone number, name, or email', () => {
    // Lookup by phone prefix
    const byPhone = searchReferrers('9446', SAMPLE_REFERRERS);
    expect(byPhone).toHaveLength(1);
    expect(byPhone[0].name).toBe('Rahul Varma');

    // Lookup by name (case-insensitive)
    const byName = searchReferrers('aiswarya', SAMPLE_REFERRERS);
    expect(byName).toHaveLength(1);
    expect(byName[0].phone).toBe('8129555666');

    // Lookup by email domain/part
    const byEmail = searchReferrers('thekkanath', SAMPLE_REFERRERS);
    expect(byEmail).toHaveLength(1);
    expect(byEmail[0].name).toBe('George Nellikunnu');

    // Empty query returns empty array
    expect(searchReferrers('', SAMPLE_REFERRERS)).toEqual([]);
  });

  it('enforces clean lifecycle status transitions', () => {
    // registered -> earned (when booking confirmed with advance)
    expect(transitionReferralStatus('registered', 'earned')).toBe(true);

    // earned -> payable (when event completed & settled)
    expect(transitionReferralStatus('earned', 'payable')).toBe(true);

    // payable -> disbursed (when payout sent)
    expect(transitionReferralStatus('payable', 'disbursed')).toBe(true);

    // Any non-terminal state can be voided upon cancellation
    expect(transitionReferralStatus('registered', 'voided')).toBe(true);
    expect(transitionReferralStatus('earned', 'voided')).toBe(true);

    // Disbursed or voided cannot be modified
    expect(transitionReferralStatus('disbursed', 'payable')).toBe(false);
    expect(transitionReferralStatus('voided', 'earned')).toBe(false);
  });
});
