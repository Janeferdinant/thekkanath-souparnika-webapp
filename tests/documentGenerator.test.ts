import { describe, it, expect } from 'vitest';
import {
  generateTaxFilingReport,
  generateQuotationDocument,
  CLEANING_LIABILITY_CLAUSE,
} from '../src/lib/documentGenerator';
import { Booking, ExpenseRecord, Quotation } from '../src/types/models';

describe('Document Generator - Tax Filing (No GST) & Branded Quotations', () => {
  const sampleBookings: Booking[] = [
    {
      id: 'bkg-1',
      reference: 'TS-BKG-2026-001',
      customerId: 'cust-1',
      customerName: 'Pradeep Kumar',
      customerPhone: '9847011223',
      customerEmail: 'pradeep@example.com',
      hallId: 'auditorium',
      hallName: 'Thekkanath Souparnika (Full Venue)',
      session: 'morning',
      eventType: 'Wedding & Reception',
      eventDate: '2026-11-20',
      startTime: '08:00',
      endTime: '15:00',
      guestCount: 250,
      status: 'completed',
      totalAgreedPaise: 8000000, // ₹80,000
      advancePaidPaise: 8000000,
      allocatedAccount: 'account_1',
      createdAt: '2026-10-01',
      updatedAt: '2026-11-20',
    },
    {
      id: 'bkg-2',
      reference: 'TS-BKG-2026-002',
      customerId: 'cust-2',
      customerName: 'Shibu Thomas',
      customerPhone: '9446022334',
      customerEmail: 'shibu@example.com',
      hallId: 'auditorium',
      hallName: 'Thekkanath Souparnika (Full Venue)',
      session: 'evening',
      eventType: 'Cultural Programme',
      eventDate: '2026-11-25',
      startTime: '17:00',
      endTime: '22:00',
      guestCount: 200,
      status: 'completed',
      totalAgreedPaise: 6000000, // ₹60,000
      advancePaidPaise: 6000000,
      allocatedAccount: 'account_2',
      createdAt: '2026-10-05',
      updatedAt: '2026-11-25',
    },
  ];

  const sampleExpenses: ExpenseRecord[] = [
    {
      id: 'exp-1',
      category: 'Utilities (Electricity/Water)',
      description: 'KSEB Electricity Bill for November',
      amountPaise: 1850000, // ₹18,500
      expenseDate: '2026-11-10',
      paymentMethod: 'bank_transfer',
      status: 'paid',
      recordedBy: 'Accounts Manager',
      createdAt: '2026-11-10',
    },
  ];

  const sampleQuote: Quotation = {
    id: 'quo-1',
    reference: 'TS-QUO-2026-001',
    customerName: 'Meera Nambiar',
    customerEmail: 'meera@example.com',
    customerPhone: '9847998877',
    hallName: 'Thekkanath Souparnika (Full Venue)',
    eventDate: '2026-12-28',
    items: [
      {
        id: 'item-1',
        description: 'Auditorium Morning Session Rental (8:00 AM - 3:00 PM)',
        quantity: 1,
        unitPricePaise: 7500000,
        totalPaise: 7500000,
      },
    ],
    subtotalPaise: 7500000,
    discountPaise: 0,
    taxPaise: 0,
    totalPaise: 7500000,
    status: 'sent',
    validUntil: '2026-11-01',
    createdAt: '2026-10-18',
  };

  it('generates tax filing export CSV with separate Account 1 and Account 2 tracking and NO GST columns', () => {
    const report = generateTaxFilingReport('2026-27', sampleBookings, sampleExpenses);

    // Receipts CSV
    expect(report.csvReceipts).toContain('Booking Reference,Customer Name,Event Date,Session,Account,Amount (INR)');
    expect(report.csvReceipts).toContain('"TS-BKG-2026-001","Pradeep Kumar","2026-11-20","morning","Account 1",80000.00');
    expect(report.csvReceipts).toContain('"TS-BKG-2026-002","Shibu Thomas","2026-11-25","evening","Account 2",60000.00');
    expect(report.csvReceipts).not.toContain('GST');
    expect(report.csvReceipts).not.toContain('CGST');

    // Expenses CSV
    expect(report.csvExpenses).toContain('Category,Description,Amount (INR),Date');
    expect(report.csvExpenses).toContain('"Utilities (Electricity/Water)","KSEB Electricity Bill for November",18500.00,"2026-11-10"');

    // Summary HTML for CA
    expect(report.summaryHtml).toContain('Account 1 Gross Receipts');
    expect(report.summaryHtml).toContain('Account 2 Gross Receipts');
    expect(report.summaryHtml).toContain('Exemption Threshold (₹20,00,000)');
  });

  it('validates quotation and includes mandatory Refundable Caution / Cleaning Deposit clause', () => {
    const cautionDepositPaise = 1000000; // ₹10,000 refundable caution deposit
    const result = generateQuotationDocument(sampleQuote, cautionDepositPaise);

    expect(result.validationErrors).toHaveLength(0);
    expect(result.html).toContain('TS-QUO-2026-001');
    expect(result.html).toContain('Refundable Caution Deposit / Cleaning Deposit');
    expect(result.html).toContain('₹10,000');
    expect(result.html).toContain(CLEANING_LIABILITY_CLAUSE);
    expect(result.html).toContain('external catering team are responsible for leaving the dining hall, kitchen area, and wash facilities clean');
  });

  it('flags validation error if quotation has negative or missing caution deposit', () => {
    const invalidResult = generateQuotationDocument(sampleQuote, 0);
    expect(invalidResult.validationErrors.length).toBeGreaterThan(0);
    expect(invalidResult.validationErrors[0]).toContain('Caution deposit');
  });
});
