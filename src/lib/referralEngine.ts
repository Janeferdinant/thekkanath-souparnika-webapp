import { ReferralScheme, ReferralStatus } from '../types/models';

export interface ReferrerContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  upiId?: string;
  totalReferrals?: number;
  totalPaidPaise?: number;
}

/**
 * Default flat reward: ₹2,500 (in paise)
 */
export const DEFAULT_FLAT_BONUS_PAISE = 250_000;

/**
 * Default commission rate: 5% of base rent
 */
export const DEFAULT_PERCENTAGE_RATE = 5;

/**
 * Calculates referral bonus based on flat incentive or percentage of base rent.
 */
export function calculateReferralBonus(
  scheme: ReferralScheme,
  baseRentPaise: number,
  flatAmountPaise: number = DEFAULT_FLAT_BONUS_PAISE,
  percentageRate: number = DEFAULT_PERCENTAGE_RATE
): number {
  if (scheme === 'flat') {
    return Math.max(0, flatAmountPaise);
  }
  if (scheme === 'percentage') {
    return Math.max(0, Math.round((baseRentPaise * percentageRate) / 100));
  }
  return 0;
}

/**
 * Search and autocomplete repeat referrers by name, phone, or email.
 */
export function searchReferrers(
  query: string,
  existingReferrers: ReferrerContact[]
): ReferrerContact[] {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim().toLowerCase();
  const digitQuery = cleanQuery.replace(/\D/g, '');

  return existingReferrers.filter((ref) => {
    // 1. Check Name
    if (ref.name.toLowerCase().includes(cleanQuery)) return true;

    // 2. Check Email
    if (ref.email && ref.email.toLowerCase().includes(cleanQuery)) return true;

    // 3. Check Phone (clean digits)
    if (digitQuery.length > 0) {
      const cleanPhone = ref.phone.replace(/\D/g, '');
      if (cleanPhone.includes(digitQuery)) return true;
    }

    return false;
  });
}

/**
 * State machine validator for referral lifecycle progression.
 * Lifecycle: registered -> earned -> payable -> disbursed (or voided upon cancellation).
 */
export function transitionReferralStatus(
  currentStatus: ReferralStatus,
  newStatus: ReferralStatus
): boolean {
  if (currentStatus === newStatus) return true;

  // Terminal states cannot be transitioned
  if (currentStatus === 'disbursed' || currentStatus === 'voided') {
    return false;
  }

  // Any non-terminal status can be voided if booking cancels
  if (newStatus === 'voided') {
    return true;
  }

  const validTransitions: Record<ReferralStatus, ReferralStatus[]> = {
    registered: ['earned', 'voided'],
    earned: ['payable', 'voided'],
    payable: ['disbursed', 'voided'],
    disbursed: [],
    voided: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}
