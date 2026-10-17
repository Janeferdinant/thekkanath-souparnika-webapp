import { Booking, FinancialAccount, UserRole } from '../types/models';
import { CEILING_TURNOVER_PAISE } from './financeEngine';

export interface AccountStats {
  totalTurnoverPaise: number;
  headroomPaise: number;
  percentUtilized: number;
  isNearCeiling: boolean;
  isLocked: boolean;
}

/**
 * Sorts bookings chronologically by event date.
 * Default is ascending (closest upcoming events first).
 */
export function sortBookingsByEventDate(bookings: Booking[], ascending: boolean = true): Booking[] {
  return [...bookings].sort((a, b) => {
    const timeA = new Date(a.eventDate).getTime();
    const timeB = new Date(b.eventDate).getTime();
    return ascending ? timeA - timeB : timeB - timeA;
  });
}

/**
 * Super Admin check for managing staff roles and team members.
 */
export function canManageStaff(role?: UserRole): boolean {
  return role === 'super_admin';
}

/**
 * Calculates real-time dual-account turnover dials against statutory ₹20 Lakh ceiling.
 */
export function calculateDualAccountStats(
  bookings: Booking[]
): Record<FinancialAccount, AccountStats> {
  const result: Record<FinancialAccount, AccountStats> = {
    account_1: {
      totalTurnoverPaise: 0,
      headroomPaise: CEILING_TURNOVER_PAISE,
      percentUtilized: 0,
      isNearCeiling: false,
      isLocked: false,
    },
    account_2: {
      totalTurnoverPaise: 0,
      headroomPaise: CEILING_TURNOVER_PAISE,
      percentUtilized: 0,
      isNearCeiling: false,
      isLocked: false,
    },
  };

  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    const account = b.allocatedAccount || 'account_1';
    if (result[account]) {
      result[account].totalTurnoverPaise += b.totalAgreedPaise || 0;
    }
  }

  for (const key of ['account_1', 'account_2'] as FinancialAccount[]) {
    const acc = result[key];
    acc.headroomPaise = Math.max(0, CEILING_TURNOVER_PAISE - acc.totalTurnoverPaise);
    acc.percentUtilized = Math.min(100, (acc.totalTurnoverPaise / CEILING_TURNOVER_PAISE) * 100);
    acc.isLocked = acc.percentUtilized >= 98;
    acc.isNearCeiling = acc.percentUtilized >= 90 && !acc.isLocked;
  }

  return result;
}
