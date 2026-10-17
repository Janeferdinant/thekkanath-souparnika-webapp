import { Booking, ExpenseRecord, Quotation } from '../types/models';
import { VENUE_INFO } from '../data/venueData';
import { paiseToRupees, formatINR } from './formatters';

export const CLEANING_LIABILITY_CLAUSE =
  'Refundable Caution Deposit is collected to guarantee venue integrity. Please note: The customer and their external catering team are responsible for leaving the dining hall, kitchen area, and wash facilities clean and free of leftover food waste. If the facility requires deep sanitization or waste removal due to catering negligence, professional cleaning expenses will be deducted from this deposit prior to refund.';

/**
 * Generates Chartered Accountant tax filing records (Gross Receipts & Expenses)
 * formatted for Income Tax Returns under the ₹20 Lakh exemption threshold (No GST).
 */
export function generateTaxFilingReport(
  financialYear: string,
  bookings: Booking[],
  expenses: ExpenseRecord[]
): {
  csvReceipts: string;
  csvExpenses: string;
  summaryHtml: string;
  account1TurnoverPaise: number;
  account2TurnoverPaise: number;
} {
  // 1. Calculate Gross Receipts per Account
  let account1TurnoverPaise = 0;
  let account2TurnoverPaise = 0;

  const receiptRows = [
    'Booking Reference,Customer Name,Event Date,Session,Account,Amount (INR)',
  ];

  bookings.forEach((b) => {
    const isAccount1 = b.allocatedAccount !== 'account_2';
    const accountName = isAccount1 ? 'Account 1' : 'Account 2';
    const amountPaise = b.totalAgreedPaise || 0;

    if (isAccount1) {
      account1TurnoverPaise += amountPaise;
    } else {
      account2TurnoverPaise += amountPaise;
    }

    const rupees = (paiseToRupees(amountPaise)).toFixed(2);
    receiptRows.push(
      `"${b.reference}","${b.customerName}","${b.eventDate}","${b.session || 'full_day'}","${accountName}",${rupees}`
    );
  });

  const csvReceipts = receiptRows.join('\n');

  // 2. Calculate Operating Expenses
  let totalExpensesPaise = 0;
  const expenseRows = ['Category,Description,Amount (INR),Date'];

  expenses.forEach((e) => {
    totalExpensesPaise += e.amountPaise;
    const rupees = (paiseToRupees(e.amountPaise)).toFixed(2);
    expenseRows.push(`"${e.category}","${e.description}",${rupees},"${e.expenseDate}"`);
  });

  const csvExpenses = expenseRows.join('\n');

  // 3. CA Summary HTML
  const totalTurnoverPaise = account1TurnoverPaise + account2TurnoverPaise;
  const netIncomePaise = totalTurnoverPaise - totalExpensesPaise;

  const summaryHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tax Summary FY ${financialYear} - ${VENUE_INFO.name}</title>
      <style>
        body { font-family: 'Inter', sans-serif; padding: 24px; color: #1a0510; }
        h1, h2 { font-family: 'Cormorant Garamond', serif; color: #5B1D27; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #e5a99b; padding: 10px; text-align: left; }
        th { background: #5B1D27; color: #fff; }
        .highlight { font-weight: bold; background: #faf7f2; }
      </style>
    </head>
    <body>
      <h1>${VENUE_INFO.name} — Income Tax Reconciliation FY ${financialYear}</h1>
      <p>Prepared for Chartered Accountant review under statutory Service Exemption Threshold (₹20,00,000 per entity).</p>
      
      <table>
        <tr><th>Account / Legal Entity</th><th>FY Turnover (INR)</th><th>Exemption Limit</th><th>Compliance Status</th></tr>
        <tr>
          <td>Account 1 Gross Receipts</td>
          <td>${formatINR(account1TurnoverPaise)}</td>
          <td>₹20,00,000</td>
          <td>${account1TurnoverPaise <= 200000000 ? '✅ Compliant (Under 20L)' : '⚠️ Exceeded Threshold'}</td>
        </tr>
        <tr>
          <td>Account 2 Gross Receipts</td>
          <td>${formatINR(account2TurnoverPaise)}</td>
          <td>₹20,00,000</td>
          <td>${account2TurnoverPaise <= 200000000 ? '✅ Compliant (Under 20L)' : '⚠️ Exceeded Threshold'}</td>
        </tr>
        <tr class="highlight">
          <td>Total Gross Business Receipts</td>
          <td>${formatINR(totalTurnoverPaise)}</td>
          <td>₹40,00,000 (Combined)</td>
          <td>Exemption Threshold (₹20,00,000) maintained across 2 accounts</td>
        </tr>
        <tr>
          <td>Total Operational Expenses</td>
          <td>${formatINR(totalExpensesPaise)}</td>
          <td>-</td>
          <td>Documented Deductions</td>
        </tr>
        <tr class="highlight">
          <td>Net Taxable Business Profit</td>
          <td>${formatINR(netIncomePaise)}</td>
          <td>-</td>
          <td>ITR Business Income</td>
        </tr>
      </table>
    </body>
    </html>
  `.trim();

  return {
    csvReceipts,
    csvExpenses,
    summaryHtml,
    account1TurnoverPaise,
    account2TurnoverPaise,
  };
}

/**
 * Generates an official, print-ready branded quotation document (PDF printable HTML).
 * Mandates explicit separation of Refundable Caution Deposit / Cleaning Deposit
 * and incorporates the catering cleanup obligation clause.
 */
export function generateQuotationDocument(
  quote: Quotation,
  cautionDepositPaise: number
): {
  html: string;
  validationErrors: string[];
} {
  const validationErrors: string[] = [];

  if (!cautionDepositPaise || cautionDepositPaise <= 0) {
    validationErrors.push(
      'Caution deposit / cleaning charges must be explicitly specified and greater than zero.'
    );
  }

  const grandTotalPaise = quote.totalPaise + (cautionDepositPaise || 0);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quotation ${quote.reference} — ${VENUE_INFO.name}</title>
  <style>
    @media print {
      body { padding: 0; background: #fff; }
      .no-print { display: none; }
    }
    body { font-family: 'Inter', system-ui, sans-serif; background: #FAF7F2; margin: 0; padding: 40px; color: #1A0510; }
    .quote-card { max-width: 800px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; box-shadow: 0 12px 36px rgba(91, 29, 39, 0.08); border: 1px solid #F2D6DC; padding: 48px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #5B1D27; padding-bottom: 24px; margin-bottom: 32px; }
    .venue-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 700; color: #5B1D27; margin: 0; }
    .venue-sub { font-size: 13px; text-transform: uppercase; letter-spacing: 0.25em; color: #8C6D37; margin-top: 4px; font-weight: 600; }
    .quote-meta { text-align: right; font-size: 14px; }
    .meta-ref { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: #5B1D27; }
    .client-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; padding: 20px; background: #FDFBF7; border-radius: 8px; border: 1px solid #F2D6DC; }
    .section-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 700; color: #5B1D27; margin: 0 0 8px 0; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th { background: #5B1D27; color: #FFFFFF; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 16px; text-align: left; }
    td { padding: 14px 16px; border-bottom: 1px solid #F2D6DC; font-size: 14px; }
    .caution-row { background: #FBF2F4; font-weight: 600; color: #7C2538; }
    .totals-area { margin-left: auto; width: 340px; margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; }
    .grand-total { border-top: 2px solid #5B1D27; font-size: 18px; font-weight: 700; color: #5B1D27; padding-top: 12px; margin-top: 6px; }
    .clause-box { margin-top: 36px; padding: 20px; background: #FFF9FA; border-left: 4px solid #B84D64; border-radius: 4px; font-size: 13px; line-height: 1.6; color: #4A0E17; }
    .signatures { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 20px; border-top: 1px dashed #F2D6DC; }
    .sig-block { text-align: center; width: 200px; }
    .sig-line { border-top: 1px solid #1A0510; margin-top: 50px; padding-top: 6px; font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="quote-card">
    <div class="header">
      <div>
        <h1 class="venue-title">${VENUE_INFO.name}</h1>
        <div class="venue-sub">H A L L & E V E N T S V E N U E</div>
        <p style="font-size: 13px; color: #666; margin: 8px 0 0 0;">${VENUE_INFO.address.fullFormatted}</p>
        <p style="font-size: 13px; color: #666; margin: 4px 0 0 0;">Ph: ${VENUE_INFO.displayPhones.join(', ')}</p>
      </div>
      <div class="quote-meta">
        <div class="meta-ref">${quote.reference}</div>
        <div style="margin-top: 4px; color: #666;">Date: ${quote.createdAt}</div>
        <div style="margin-top: 4px; color: #666;">Valid Until: ${quote.validUntil}</div>
      </div>
    </div>

    <div class="client-grid">
      <div>
        <div class="section-title">Client Details</div>
        <div style="font-weight: 600;">${quote.customerName}</div>
        <div style="font-size: 14px; color: #555;">Phone: ${quote.customerPhone}</div>
        <div style="font-size: 14px; color: #555;">Email: ${quote.customerEmail}</div>
      </div>
      <div>
        <div class="section-title">Event Schedule</div>
        <div style="font-weight: 600;">${quote.hallName}</div>
        <div style="font-size: 14px; color: #555;">Event Date: ${quote.eventDate}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Rate</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${quote.items
          .map(
            (item) => `
          <tr>
            <td>${item.description}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${formatINR(item.unitPricePaise)}</td>
            <td style="text-align: right;">${formatINR(item.totalPaise)}</td>
          </tr>
        `
          )
          .join('')}
        <tr class="caution-row">
          <td>
            <strong>Refundable Caution Deposit / Cleaning Deposit</strong>
            <div style="font-size: 12px; color: #7C2538; font-weight: normal;">Refundable post-event subject to catering cleanup and hall sanitization inspection.</div>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">${formatINR(cautionDepositPaise)}</td>
          <td style="text-align: right;">${formatINR(cautionDepositPaise)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals-area">
      <div class="total-row"><span>Venue Rental Subtotal:</span><span>${formatINR(quote.subtotalPaise)}</span></div>
      ${quote.discountPaise ? `<div class="total-row"><span>Discount:</span><span>-${formatINR(quote.discountPaise)}</span></div>` : ''}
      <div class="total-row"><span>Refundable Caution Deposit:</span><span>${formatINR(cautionDepositPaise)}</span></div>
      <div class="total-row grand-total"><span>Total Payable:</span><span>${formatINR(grandTotalPaise)}</span></div>
    </div>

    <div class="clause-box">
      <strong>Important Terms & Cleaning Obligations:</strong>
      <p style="margin: 6px 0 0 0;">${CLEANING_LIABILITY_CLAUSE}</p>
    </div>

    <div class="signatures">
      <div class="sig-block">
        <div class="sig-line">Client Acceptance</div>
      </div>
      <div class="sig-block">
        <div class="sig-line">Authorized Signatory<br>${VENUE_INFO.name}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    html,
    validationErrors,
  };
}
