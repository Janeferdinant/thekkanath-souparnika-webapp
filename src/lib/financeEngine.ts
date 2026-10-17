import { FinancialAccount } from '../types/models';

/**
 * Statutory ceiling for service tax exemption in India: ₹20,00,000 (in paise)
 */
export const CEILING_TURNOVER_PAISE = 20 * 100_000 * 100; // 200,000,000 paise = ₹20 Lakhs

/**
 * Visual warning threshold when approaching ceiling (90% = ₹18 Lakhs)
 */
export const WARNING_THRESHOLD_PERCENT = 90;

/**
 * Smart allocation engine that routes bookings between Account 1 and Account 2
 * to ensure neither account exceeds ₹20 Lakhs while balancing load smoothly.
 */
export function allocateBookingAccount(
  amountPaise: number,
  currentTurnoverAccount1Paise: number,
  currentTurnoverAccount2Paise: number,
  ceilingPaise: number = CEILING_TURNOVER_PAISE
): FinancialAccount {
  const headroom1 = Math.max(0, ceilingPaise - currentTurnoverAccount1Paise);
  const headroom2 = Math.max(0, ceilingPaise - currentTurnoverAccount2Paise);

  const canFit1 = amountPaise <= headroom1;
  const canFit2 = amountPaise <= headroom2;

  // If only one account has sufficient capacity, route directly to it
  if (canFit1 && !canFit2) return 'account_1';
  if (!canFit1 && canFit2) return 'account_2';

  // If both accounts can absorb the booking, balance by picking the one with lower turnover
  if (canFit1 && canFit2) {
    return currentTurnoverAccount1Paise <= currentTurnoverAccount2Paise ? 'account_1' : 'account_2';
  }

  // Spillover fallback: if booking exceeds both remaining rooms, pick the one with greater headroom
  return headroom1 >= headroom2 ? 'account_1' : 'account_2';
}

/**
 * Calculates financial headroom, percentage utilization, and alert status for an account.
 */
export function calculateHeadroom(
  turnoverPaise: number,
  ceilingPaise: number = CEILING_TURNOVER_PAISE
): {
  remainingPaise: number;
  percentageUsed: number;
  isWarning: boolean;
  isCapped: boolean;
} {
  const remainingPaise = Math.max(0, ceilingPaise - turnoverPaise);
  const rawPercentage = (turnoverPaise / ceilingPaise) * 100;
  const percentageUsed = Math.min(100, Math.round(rawPercentage * 10) / 10);
  const isWarning = percentageUsed >= WARNING_THRESHOLD_PERCENT && percentageUsed < 100;
  const isCapped = turnoverPaise >= ceilingPaise;

  return {
    remainingPaise,
    percentageUsed,
    isWarning,
    isCapped,
  };
}
