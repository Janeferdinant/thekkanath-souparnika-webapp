import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { StorageService } from '../src/lib/storage';

const NEW = {
  reference: 'TS-ENQ-UNIT',
  customerName: 'Unit Test',
  customerPhone: '9847012345',
  customerEmail: 'unit@example.com',
  eventType: 'Other',
  preferredDate: '2030-01-01',
  session: 'morning',
  startTime: '08:00',
  endTime: '15:00',
  preferredHallId: 'auditorium',
  estimatedGuests: 100,
  specialRequests: '',
  consentGiven: true,
  status: 'new',
} as unknown as Parameters<typeof StorageService.createEnquiry>[0];

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('StorageService.createEnquiry', () => {
  it('persists the enquiry and returns it', () => {
    const saved = StorageService.createEnquiry(NEW);
    expect(saved.id).toMatch(/^enq-/);
    expect(StorageService.getEnquiries().some((e) => e.id === saved.id)).toBe(true);
  });

  it('throws instead of pretending it worked when the browser refuses the write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
    });
    expect(() => StorageService.createEnquiry(NEW)).toThrow();
  });
});
