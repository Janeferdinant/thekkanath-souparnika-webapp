import { describe, it, expect } from 'vitest';
import {
  doIntervalsOverlap,
  isValidTimeRange,
  checkHallAvailability,
  canTransitionBookingStatus,
} from '../src/lib/bookingEngine';
import { Booking, MaintenanceBlock } from '../src/types/models';

describe('Booking Engine - Interval Overlap Logic', () => {
  it('detects direct overlapping intervals', () => {
    expect(doIntervalsOverlap('10:00', '14:00', '11:00', '13:00')).toBe(true);
    expect(doIntervalsOverlap('10:00', '14:00', '12:00', '16:00')).toBe(true);
    expect(doIntervalsOverlap('10:00', '14:00', '08:00', '11:00')).toBe(true);
  });

  it('correctly allows non-overlapping disjoint intervals', () => {
    expect(doIntervalsOverlap('09:00', '11:00', '13:00', '16:00')).toBe(false);
  });

  it('allows adjacent intervals where end time equals start time [half-open interval)', () => {
    expect(doIntervalsOverlap('10:00', '14:00', '14:00', '18:00')).toBe(false);
    expect(doIntervalsOverlap('14:00', '18:00', '10:00', '14:00')).toBe(false);
  });

  it('validates start time strictly precedes end time', () => {
    expect(isValidTimeRange('09:00', '15:00')).toBe(true);
    expect(isValidTimeRange('15:00', '09:00')).toBe(false);
    expect(isValidTimeRange('12:00', '12:00')).toBe(false);
  });
});

describe('Booking Engine - checkHallAvailability', () => {
  const existingBookings: Booking[] = [
    {
      id: 'bkg-1',
      reference: 'TS-BKG-2026-001',
      customerId: 'cust-1',
      customerName: 'Anil Kumar',
      customerPhone: '9847012345',
      customerEmail: 'anil@example.com',
      hallId: 'stage-hall',
      hallName: 'Stage Hall',
      eventType: 'Wedding & Reception',
      eventDate: '2026-11-15',
      startTime: '10:00',
      endTime: '15:00',
      guestCount: 90,
      status: 'confirmed',
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01',
    },
    {
      id: 'bkg-2',
      reference: 'TS-BKG-2026-002',
      customerId: 'cust-2',
      customerName: 'Suresh Varma',
      customerPhone: '9447098765',
      customerEmail: 'suresh@example.com',
      hallId: 'dining-hall',
      hallName: 'Dining Hall',
      eventType: 'Family Gathering',
      eventDate: '2026-11-15',
      startTime: '11:00',
      endTime: '14:00',
      guestCount: 60,
      status: 'confirmed',
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01',
    },
    {
      id: 'bkg-3-cancelled',
      reference: 'TS-BKG-2026-003',
      customerId: 'cust-3',
      customerName: 'Maya Menon',
      customerPhone: '9847111222',
      customerEmail: 'maya@example.com',
      hallId: 'stage-hall',
      hallName: 'Stage Hall',
      eventType: 'Ceremony / Ritual',
      eventDate: '2026-11-15',
      startTime: '16:00',
      endTime: '20:00',
      guestCount: 50,
      status: 'cancelled',
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01',
    },
  ];

  const existingMaintenance: MaintenanceBlock[] = [
    {
      id: 'maint-1',
      hallId: 'stage-hall',
      hallName: 'Stage Hall',
      startDate: '2026-11-16',
      endDate: '2026-11-16',
      startTime: '08:00',
      endTime: '12:00',
      title: 'AC Servicing & Filter Replacement',
      reason: 'Scheduled routine AC check',
      status: 'scheduled',
      createdAt: '2026-10-01',
    },
  ];

  it('rejects an overlapping booking on the same hall and date', () => {
    const result = checkHallAvailability(
      'stage-hall',
      '2026-11-15',
      '12:00',
      '16:00',
      existingBookings,
      existingMaintenance
    );
    expect(result.hasConflict).toBe(true);
    expect(result.conflictType).toBe('booking');
    expect(result.message).toContain('Conflict with existing booking TS-BKG-2026-001');
  });

  it('allows a booking on a different hall on the same date and time', () => {
    const result = checkHallAvailability(
      'welcome-hall',
      '2026-11-15',
      '10:00',
      '15:00',
      existingBookings,
      existingMaintenance
    );
    expect(result.hasConflict).toBe(false);
  });

  it('allows an adjacent booking on the same hall once the previous event finishes', () => {
    const result = checkHallAvailability(
      'stage-hall',
      '2026-11-15',
      '15:00',
      '19:00',
      existingBookings,
      existingMaintenance
    );
    expect(result.hasConflict).toBe(false);
  });

  it('ignores cancelled bookings on the same hall and slot', () => {
    const result = checkHallAvailability(
      'stage-hall',
      '2026-11-15',
      '16:00',
      '20:00',
      existingBookings,
      existingMaintenance
    );
    expect(result.hasConflict).toBe(false);
  });

  it('rejects booking that conflicts with scheduled maintenance', () => {
    const result = checkHallAvailability(
      'stage-hall',
      '2026-11-16',
      '09:00',
      '11:00',
      existingBookings,
      existingMaintenance
    );
    expect(result.hasConflict).toBe(true);
    expect(result.conflictType).toBe('maintenance');
    expect(result.message).toContain('AC Servicing & Filter Replacement');
  });
});

describe('Booking Status Transitions', () => {
  it('allows valid lifecycle progressions', () => {
    expect(canTransitionBookingStatus('tentative_hold', 'confirmed')).toBe(true);
    expect(canTransitionBookingStatus('reviewing', 'quotation_sent')).toBe(true);
    expect(canTransitionBookingStatus('quotation_sent', 'confirmed')).toBe(true);
    expect(canTransitionBookingStatus('confirmed', 'completed')).toBe(true);
    expect(canTransitionBookingStatus('confirmed', 'cancelled')).toBe(true);
  });

  it('disallows invalid transitions from terminal states', () => {
    expect(canTransitionBookingStatus('completed', 'confirmed')).toBe(false);
    expect(canTransitionBookingStatus('cancelled', 'confirmed')).toBe(false);
  });
});
