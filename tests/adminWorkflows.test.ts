import { describe, it, expect } from 'vitest';
import { sortBookingsByEventDate, canManageStaff, calculateDualAccountStats } from '../src/lib/adminEngine';
import { Booking, UserRole } from '../src/types/models';

describe('Admin Console Workflows - Staff Gates, Sorting & Dual Account Dials', () => {
  const SAMPLE_BOOKINGS: Partial<Booking>[] = [
    {
      id: 'b-1',
      reference: 'TS-BK-001',
      customerName: 'Anoop Kumar',
      eventDate: '2026-11-20',
      totalAmountPaise: 4500000,
      allocatedAccount: 'Account 1',
      status: 'confirmed',
    },
    {
      id: 'b-2',
      reference: 'TS-BK-002',
      customerName: 'Priya Menon',
      eventDate: '2026-10-25',
      totalAmountPaise: 6000000,
      allocatedAccount: 'Account 2',
      status: 'confirmed',
    },
    {
      id: 'b-3',
      reference: 'TS-BK-003',
      customerName: 'Deepak Varma',
      eventDate: '2026-12-05',
      totalAmountPaise: 3500000,
      allocatedAccount: 'Account 1',
      status: 'confirmed',
    },
  ];

  it('sorts bookings chronologically by upcoming eventDate ascending by default', () => {
    const sortedAsc = sortBookingsByEventDate(SAMPLE_BOOKINGS as Booking[], true);
    expect(sortedAsc.map((b) => b.eventDate)).toEqual(['2026-10-25', '2026-11-20', '2026-12-05']);

    const sortedDesc = sortBookingsByEventDate(SAMPLE_BOOKINGS as Booking[], false);
    expect(sortedDesc.map((b) => b.eventDate)).toEqual(['2026-12-05', '2026-11-20', '2026-10-25']);
  });

  it('restricts staff modification permissions strictly to super_admin', () => {
    expect(canManageStaff('super_admin')).toBe(true);
    expect(canManageStaff('administrator')).toBe(false);
    expect(canManageStaff('manager')).toBe(false);
    expect(canManageStaff('caretaker')).toBe(false);
    expect(canManageStaff('viewer')).toBe(false);
  });

  it('computes dual-account turnover dials against ₹20L threshold with 90% warning flag', () => {
    // Account 1 has ₹45,000 + ₹35,000 = ₹80,000
    // Account 2 has ₹60,000
    const stats = calculateDualAccountStats(SAMPLE_BOOKINGS as Booking[]);
    expect(stats['Account 1'].totalTurnoverPaise).toBe(8000000);
    expect(stats['Account 1'].percentUtilized).toBeCloseTo((8000000 / 200_000_000) * 100, 2);
    expect(stats['Account 1'].isNearCeiling).toBe(false);

    // Test near-ceiling booking (₹18.5 Lakhs)
    const highBooking: Partial<Booking>[] = [
      {
        id: 'b-high',
        totalAmountPaise: 185_000_000, // ₹18.5L
        allocatedAccount: 'Account 1',
        status: 'confirmed',
      },
    ];
    const highStats = calculateDualAccountStats(highBooking as Booking[]);
    expect(highStats['Account 1'].isNearCeiling).toBe(true);
  });
});
