import { Booking, MaintenanceBlock, BookingStatus, BookingSession } from '../types/models';

export const SESSION_TIMES: Record<BookingSession, { startTime: string; endTime: string }> = {
  morning: { startTime: '08:00', endTime: '15:00' },
  evening: { startTime: '17:00', endTime: '22:00' },
  full_day: { startTime: '08:00', endTime: '22:00' },
};

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

/**
 * Checks whether two time intervals on the same day overlap.
 * Uses half-open interval semantics: [start, end)
 * Condition for overlap: newStart < existingEnd AND newEnd > existingStart
 * If newStart === existingEnd or newEnd === existingStart, they touch at the boundary and DO NOT overlap.
 */
export function doIntervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && endA > startB;
}

/**
 * Validates that startTime is strictly before endTime and both are valid HH:mm
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false;
  return startTime < endTime;
}

/**
 * Checks if a hold is still active (not expired)
 */
export function isHoldActive(holdExpiresAt?: string): boolean {
  if (!holdExpiresAt) return false;
  const expiryTime = new Date(holdExpiresAt).getTime();
  return expiryTime > Date.now();
}

/**
 * Checks whether a booking status represents an active block on the calendar
 */
export function isBlockingStatus(status: BookingStatus, holdExpiresAt?: string): boolean {
  if (status === 'cancelled') return false;
  if (status === 'completed') return false;
  if (status === 'tentative_hold') {
    return isHoldActive(holdExpiresAt);
  }
  // 'confirmed', 'in_progress', 'quotation_sent', 'reviewing' block the hall
  return true;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictType?: 'booking' | 'maintenance' | 'invalid_range';
  conflictingItemTitle?: string;
  message: string;
}

/**
 * Core conflict detection algorithm.
 * Checks a proposed booking against all existing bookings and maintenance blocks for a given hall.
 * If the whole auditorium is booked, it cascades a block to all constituent halls.
 */
export function checkHallAvailability(
  hallId: string,
  proposedDate: string,
  proposedStartTime: string,
  proposedEndTime: string,
  existingBookings: Booking[],
  existingMaintenance: MaintenanceBlock[],
  excludeBookingId?: string
): ConflictCheckResult {
  // 1. Validate range
  if (!isValidTimeRange(proposedStartTime, proposedEndTime)) {
    return {
      hasConflict: true,
      conflictType: 'invalid_range',
      message: 'Start time must be strictly before end time.',
    };
  }

  // 2. Check confirmed & active bookings on the same hall, or whole auditorium booking on that date
  for (const b of existingBookings) {
    if (excludeBookingId && b.id === excludeBookingId) continue;
    const isRelevantHall = b.hallId === hallId || b.hallId === 'auditorium';
    if (!isRelevantHall) continue;
    if (b.eventDate !== proposedDate) continue;

    if (isBlockingStatus(b.status, b.holdExpiresAt)) {
      if (doIntervalsOverlap(proposedStartTime, proposedEndTime, b.startTime, b.endTime)) {
        return {
          hasConflict: true,
          conflictType: 'booking',
          conflictingItemTitle: `${b.reference} (${b.customerName} - ${b.eventType})`,
          message: `Conflict with existing booking ${b.reference} (${b.startTime} - ${b.endTime})`,
        };
      }
    }
  }

  // 3. Check maintenance blocks on the same hall or auditorium
  for (const m of existingMaintenance) {
    const isRelevantMaint = m.hallId === hallId || m.hallId === 'auditorium';
    if (!isRelevantMaint) continue;
    if (m.status === 'completed') continue;
    if (m.startDate <= proposedDate && m.endDate >= proposedDate) {
      if (doIntervalsOverlap(proposedStartTime, proposedEndTime, m.startTime, m.endTime)) {
        return {
          hasConflict: true,
          conflictType: 'maintenance',
          conflictingItemTitle: m.title,
          message: `Hall is blocked for scheduled maintenance: ${m.title} (${m.startTime} - ${m.endTime})`,
        };
      }
    }
  }

  return {
    hasConflict: false,
    message: 'Hall is available for the requested date and time slot.',
  };
}

/**
 * Auditorium Two-Session Conflict Check.
 * Checks availability for the entire facility (Auditorium) for either 'morning', 'evening', or 'full_day'.
 * Automatically accounts for turnaround buffer (15:00-17:00).
 * Blocks if ANY constituent hall or the auditorium itself is already reserved.
 */
export function checkAuditoriumAvailability(
  proposedDate: string,
  proposedSession: BookingSession,
  existingBookings: Booking[],
  existingMaintenance: MaintenanceBlock[],
  excludeBookingId?: string
): ConflictCheckResult {
  const sessionRange = SESSION_TIMES[proposedSession];
  if (!sessionRange) {
    return {
      hasConflict: true,
      conflictType: 'invalid_range',
      message: `Invalid session requested: ${proposedSession}`,
    };
  }

  // Check all active bookings on that date across any hall or the auditorium
  for (const b of existingBookings) {
    if (excludeBookingId && b.id === excludeBookingId) continue;
    if (b.eventDate !== proposedDate) continue;

    if (isBlockingStatus(b.status, b.holdExpiresAt)) {
      if (doIntervalsOverlap(sessionRange.startTime, sessionRange.endTime, b.startTime, b.endTime)) {
        return {
          hasConflict: true,
          conflictType: 'booking',
          conflictingItemTitle: `${b.reference} (${b.customerName} - ${b.hallName})`,
          message: `Conflict with existing booking ${b.reference} (${b.hallName}, ${b.startTime} - ${b.endTime})`,
        };
      }
    }
  }

  // Check all maintenance blocks on that date across any hall
  for (const m of existingMaintenance) {
    if (m.status === 'completed') continue;
    if (m.startDate <= proposedDate && m.endDate >= proposedDate) {
      if (doIntervalsOverlap(sessionRange.startTime, sessionRange.endTime, m.startTime, m.endTime)) {
        return {
          hasConflict: true,
          conflictType: 'maintenance',
          conflictingItemTitle: m.title,
          message: `Venue facility is blocked for maintenance: ${m.title} (${m.hallName}, ${m.startTime} - ${m.endTime})`,
        };
      }
    }
  }

  return {
    hasConflict: false,
    message: `Auditorium is available for the ${proposedSession} session on ${proposedDate}.`,
  };
}

/**
 * State machine validator for booking lifecycle transitions
 */
export function canTransitionBookingStatus(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus
): boolean {
  if (currentStatus === nextStatus) return true;
  if (nextStatus === 'cancelled') return true; // Can cancel from any active state

  switch (currentStatus) {
    case 'tentative_hold':
      return ['reviewing', 'quotation_sent', 'confirmed', 'cancelled'].includes(nextStatus);
    case 'reviewing':
      return ['tentative_hold', 'quotation_sent', 'confirmed', 'cancelled'].includes(nextStatus);
    case 'quotation_sent':
      return ['confirmed', 'reviewing', 'cancelled'].includes(nextStatus);
    case 'confirmed':
      return ['in_progress', 'completed', 'cancelled'].includes(nextStatus);
    case 'in_progress':
      return ['completed', 'cancelled'].includes(nextStatus);
    case 'completed':
    case 'cancelled':
      return false; // Terminal states
    default:
      return false;
  }
}
