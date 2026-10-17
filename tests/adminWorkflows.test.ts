import { describe, it, expect } from 'vitest';
import { sortBookingsByEventDate, canManageStaff, calculateDualAccountStats } from '../src/lib/adminEngine';
import { Booking } from '../src/types/models';

describe('Admin Console Workflows - Staff Gates, Sorting & Dual Account Dials', () => {
  const SAMPLE_BOOKINGS: Partial<Booking>[] = [
    {
      id: 'b-1',
      reference: 'TS-BK-001',
      customerName: 'Anoop Kumar',
      eventDate: '2026-11-20',
      totalAgreedPaise: 4500000,
      allocatedAccount: 'account_1',
      status: 'confirmed',
    },
    {
      id: 'b-2',
      reference: 'TS-BK-002',
      customerName: 'Priya Menon',
      eventDate: '2026-10-25',
      totalAgreedPaise: 6000000,
      allocatedAccount: 'account_2',
      status: 'confirmed',
    },
    {
      id: 'b-3',
      reference: 'TS-BK-003',
      customerName: 'Deepak Varma',
      eventDate: '2026-12-05',
      totalAgreedPaise: 3500000,
      allocatedAccount: 'account_1',
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
    expect(canManageStaff('booking_manager')).toBe(false);
    expect(canManageStaff('operations_manager')).toBe(false);
    expect(canManageStaff('staff')).toBe(false);
  });

  it('computes dual-account turnover dials against ₹20L threshold with 90% warning flag', () => {
    // Account 1 has ₹45,000 + ₹35,000 = ₹80,000
    // Account 2 has ₹60,000
    const stats = calculateDualAccountStats(SAMPLE_BOOKINGS as Booking[]);
    expect(stats.account_1.totalTurnoverPaise).toBe(8000000);
    expect(stats.account_1.percentUtilized).toBeCloseTo((8000000 / 200_000_000) * 100, 2);
    expect(stats.account_1.isNearCeiling).toBe(false);

    // Test near-ceiling booking (₹18.5 Lakhs)
    const highBooking: Partial<Booking>[] = [
      {
        id: 'b-high',
        totalAgreedPaise: 185_000_000, // ₹18.5L
        allocatedAccount: 'account_1',
        status: 'confirmed',
      },
    ];
    const highStats = calculateDualAccountStats(highBooking as Booking[]);
    expect(highStats.account_1.isNearCeiling).toBe(true);
  });
});
