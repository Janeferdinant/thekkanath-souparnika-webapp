import React, { useState } from 'react';
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Printer,
  AlertCircle,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { PaymentReceipt, ExpenseRecord, Quotation } from '../../types/models';
import { formatINR, formatDate, generateReference } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { calculateDualAccountStats } from '../../lib/adminEngine';
import { generateTaxFilingReport } from '../../lib/documentGenerator';

export const FinancePage: React.FC = () => {
  const { success } = useToast();
  const [tab, setTab] = useState<'receipts' | 'expenses' | 'quotes'>('receipts');
  const [payments, setPayments] = useState<PaymentReceipt[]>(() => StorageService.getPayments());
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => StorageService.getExpenses());
  const [quotes, setQuotes] = useState<Quotation[]>(() => StorageService.getQuotes());
  const bookings = StorageService.getBookings();

  // Modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // New Payment Form
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id || '');
  const [paymentAmountRupees, setPaymentAmountRupees] = useState(15000);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank_transfer' | 'cash' | 'cheque'>('bank_transfer');
  const [txnRef, setTxnRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // New Expense Form
  const [expCategory, setExpCategory] = useState<ExpenseRecord['category']>('Utilities (Electricity/Water)');
  const [expDesc, setExpDesc] = useState('');
  const [expAmountRupees, setExpAmountRupees] = useState(5000);
  const [expVendor, setExpVendor] = useState('');
  const [expMethod, setExpMethod] = useState('Bank Transfer');

  // New Quote Form
  const [quoteCustomerName, setQuoteCustomerName] = useState('');
  const [quoteHallName, setQuoteHallName] = useState('Stage Hall');
  const [quoteEventDate, setQuoteEventDate] = useState('');
  const [quoteItemDesc, setQuoteItemDesc] = useState('Hall Rental Fee');
  const [quoteItemAmount, setQuoteItemAmount] = useState(35000);

  // Calculations
  const totalCollectionsPaise = payments.reduce((acc, p) => acc + p.amountPaise, 0);
  const totalExpensesPaise = expenses.reduce((acc, e) => acc + e.amountPaise, 0);
  const totalBookedRevenuePaise = bookings.reduce((acc, b) => acc + (b.totalAgreedPaise || 0), 0);
  const totalReceivablePaise = Math.max(0, totalBookedRevenuePaise - totalCollectionsPaise);
  const dualStats = calculateDualAccountStats(bookings);

  const handleExportTaxXlsx = () => {
    const report = generateTaxFilingReport('FY 2026-27', bookings, expenses);
    const blob = new Blob([report.csvReceipts + '\n\n' + report.csvExpenses], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CA_Tax_Filing_FY2026-27_No_GST.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Export Generated', 'Downloaded CA Tax Receipts & Expenses register without GST.');
  };

  const handlePrintTaxPdf = () => {
    const report = generateTaxFilingReport('FY 2026-27', bookings, expenses);
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(report.summaryHtml);
      printWin.document.close();
      printWin.focus();
      printWin.print();
    }
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const bkg = bookings.find((b) => b.id === selectedBookingId);
    if (!bkg) return;

    const newPayment = StorageService.createPayment({
      reference: generateReference('TS-RCP'),
      bookingId: bkg.id,
      bookingReference: bkg.reference,
      customerName: bkg.customerName,
      amountPaise: Math.round(paymentAmountRupees * 100),
      paymentMethod,
      transactionReference: txnRef.trim(),
      status: 'completed',
      notes: paymentNotes.trim(),
      recordedBy: 'Accounts Staff',
      receivedAt: new Date().toISOString(),
    });

    setPayments(StorageService.getPayments());
    setPaymentModalOpen(false);
    success('Payment Recorded', `Receipt ${newPayment.reference} of ${formatINR(newPayment.amountPaise)} created.`);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc.trim()) return;

    const newExp = StorageService.createExpense({
      category: expCategory,
      description: expDesc.trim(),
      amountPaise: Math.round(expAmountRupees * 100),
      vendorName: expVendor.trim(),
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMethod: expMethod,
      status: 'paid',
      recordedBy: 'Accounts Staff',
    });

    setExpenses(StorageService.getExpenses());
    setExpenseModalOpen(false);
    success('Expense Logged', `Recorded expense ${formatINR(newExp.amountPaise)} for ${newExp.category}`);
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteCustomerName.trim() || !quoteEventDate) return;

    const totalPaise = Math.round(quoteItemAmount * 100);
    const newQ = StorageService.createQuote({
      reference: generateReference('TS-QTE'),
      customerName: quoteCustomerName.trim(),
      customerEmail: 'customer@example.com',
      customerPhone: '9847012345',
      hallName: quoteHallName,
      eventDate: quoteEventDate,
      items: [
        {
          id: `qi-${Date.now()}`,
          description: quoteItemDesc.trim(),
          quantity: 1,
          unitPricePaise: totalPaise,
          totalPaise,
        },
      ],
      subtotalPaise: totalPaise,
      discountPaise: 0,
      taxPaise: 0,
      totalPaise,
      status: 'approved_internally',
      validUntil: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      approvedBy: 'Venue Manager',
    });

    setQuotes(StorageService.getQuotes());
    setQuoteModalOpen(false);
    success('Quotation Created', `Quotation ${newQ.reference} created for ${newQ.customerName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">Finance & Billing</h1>
          <p className="text-xs text-ink-500 mt-1">
            Collections received, operating expenses, quotes, and audit reconciliation in INR (₹)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportTaxXlsx}
            leftIcon={<Download className="w-3.5 h-3.5 text-forest-800" />}
          >
            CA Tax Export (.xlsx)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintTaxPdf}
            leftIcon={<Printer className="w-3.5 h-3.5 text-forest-800" />}
          >
            Print Tax Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpenseModalOpen(true)}
            leftIcon={<ArrowDownLeft className="w-3.5 h-3.5" />}
          >
            Record Expense
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setPaymentModalOpen(true)}
            leftIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
          >
            Record Payment Receipt
          </Button>
        </div>
      </div>

      {/* KPI Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
            Actual Cash Inflow (Receipts)
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-800">
            {formatINR(totalCollectionsPaise)}
          </div>
          <p className="text-[10px] text-ink-400">Total received collections</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
            Total Operational Outflow
          </span>
          <div className="text-2xl font-serif font-bold text-rose-800">
            {formatINR(totalExpensesPaise)}
          </div>
          <p className="text-[10px] text-ink-400">Salaries, utilities & repairs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
            Total Booked Event Valuation
          </span>
          <div className="text-2xl font-serif font-bold text-forest-900">
            {formatINR(totalBookedRevenuePaise)}
          </div>
          <p className="text-[10px] text-ink-400">Agreed value of all confirmed events</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
            Outstanding Receivable
          </span>
          <div className="text-2xl font-serif font-bold text-amber-800">
            {formatINR(totalReceivablePaise)}
          </div>
          <p className="text-[10px] text-ink-400">Due prior to / on event day</p>
        </div>
      </div>

      {/* Dual Account Load Balancing & ₹20L Statutory Limit Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account 1 */}
        <div
          className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
            dualStats.account_1.isNearCeiling
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-white border-cream-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-burgundy-100 text-burgundy-900 font-bold flex items-center justify-center text-xs">
                A1
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-forest-950">Primary Entity (Account 1)</h3>
                <span className="text-[10px] text-ink-500">Statutory ₹20L Annual Limit · No GST</span>
              </div>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-cream-100 text-forest-900">
              {dualStats.account_1.percentUtilized.toFixed(1)}% Used
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-forest-950">{formatINR(dualStats.account_1.totalTurnoverPaise)}</span>
              <span className="text-ink-400">Cap: ₹20,00,000</span>
            </div>
            <div className="w-full bg-cream-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  dualStats.account_1.isNearCeiling
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-burgundy-700 to-rose-600'
                }`}
                style={{ width: `${Math.min(100, dualStats.account_1.percentUtilized)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-ink-500 pt-0.5">
              <span>Remaining Headroom: <strong>{formatINR(dualStats.account_1.headroomPaise)}</strong></span>
              {dualStats.account_1.isNearCeiling && (
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Approaching Limit
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Account 2 */}
        <div
          className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
            dualStats.account_2.isNearCeiling
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-white border-cream-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 font-bold flex items-center justify-center text-xs">
                A2
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-forest-950">Secondary Entity (Account 2)</h3>
                <span className="text-[10px] text-ink-500">Statutory ₹20L Annual Limit · No GST</span>
              </div>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-cream-100 text-forest-900">
              {dualStats.account_2.percentUtilized.toFixed(1)}% Used
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-forest-950">{formatINR(dualStats.account_2.totalTurnoverPaise)}</span>
              <span className="text-ink-400">Cap: ₹20,00,000</span>
            </div>
            <div className="w-full bg-cream-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  dualStats.account_2.isNearCeiling
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-indigo-700 to-purple-600'
                }`}
                style={{ width: `${Math.min(100, dualStats.account_2.percentUtilized)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-ink-500 pt-0.5">
              <span>Remaining Headroom: <strong>{formatINR(dualStats.account_2.headroomPaise)}</strong></span>
              {dualStats.account_2.isNearCeiling && (
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Approaching Limit
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-2">
        <button
          onClick={() => setTab('receipts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            tab === 'receipts'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
          }`}
        >
          Payment Receipts ({payments.length})
        </button>
        <button
          onClick={() => setTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            tab === 'expenses'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
          }`}
        >
          Expenses Ledger ({expenses.length})
        </button>
        <button
          onClick={() => setTab('quotes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            tab === 'quotes'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
          }`}
        >
          Quotations ({quotes.length})
        </button>
      </div>

      {/* Receipts Table */}
      {tab === 'receipts' && (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Receipt / Customer</th>
                <th className="px-5 py-3">Linked Booking</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Payment Method</th>
                <th className="px-5 py-3">Date Received</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-cream-50/80">
                  <td className="px-5 py-4">
                    <div className="font-bold text-forest-950">{p.customerName}</div>
                    <div className="text-[11px] text-ink-500 font-mono mt-0.5">{p.reference}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-medium text-ink-700">
                    {p.bookingReference}
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-800 text-sm">
                    {formatINR(p.amountPaise)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="uppercase font-semibold text-ink-800">
                      {p.paymentMethod.replace('_', ' ')}
                    </div>
                    {p.transactionReference && (
                      <div className="text-[10px] text-ink-400 font-mono">
                        {p.transactionReference}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-ink-700">{formatDate(p.receivedAt)}</td>
                  <td className="px-5 py-4">
                    <Badge variant="success">Completed</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expenses Table */}
      {tab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Supplier / Vendor</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Payment Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-cream-50/80">
                  <td className="px-5 py-4">
                    <span className="font-bold text-forest-900">{e.category}</span>
                  </td>
                  <td className="px-5 py-4 text-ink-800">{e.description}</td>
                  <td className="px-5 py-4 text-ink-600">{e.vendorName || '—'}</td>
                  <td className="px-5 py-4 font-bold text-rose-800 text-sm">
                    {formatINR(e.amountPaise)}
                  </td>
                  <td className="px-5 py-4 text-ink-700">{e.expenseDate}</td>
                  <td className="px-5 py-4 text-ink-700 font-medium">{e.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quotations Table */}
      {tab === 'quotes' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="gold"
              size="sm"
              onClick={() => setQuoteModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Generate Quotation
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Reference / Customer</th>
                  <th className="px-5 py-3">Hall & Event Date</th>
                  <th className="px-5 py-3">Total Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Valid Until</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-cream-50/80">
                    <td className="px-5 py-4">
                      <div className="font-bold text-forest-950">{q.customerName}</div>
                      <div className="text-[11px] text-ink-500 font-mono mt-0.5">{q.reference}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink-900">{q.hallName}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">{q.eventDate}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-forest-900 text-sm">
                      {formatINR(q.totalPaise)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="gold">{q.status.replace('_', ' ').toUpperCase()}</Badge>
                    </td>
                    <td className="px-5 py-4 text-ink-600">{q.validUntil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Payment Receipt"
        subtitle="Record incoming advance or balance payment against an active booking."
        maxWidth="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-ink-800">Select Booking *</label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.reference} — {b.customerName} ({b.hallName} · {b.eventDate})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Amount Received (₹) *</label>
            <input
              type="number"
              min="100"
              required
              value={paymentAmountRupees}
              onChange={(e) => setPaymentAmountRupees(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Payment Method *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              <option value="bank_transfer">Bank Transfer (NEFT / RTGS)</option>
              <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
              <option value="cash">Cash Received at Office</option>
              <option value="cheque">Bank Cheque / DD</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Transaction Reference / UTR Number</label>
            <input
              type="text"
              placeholder="e.g. UTR-982103445"
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Receipt Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. 50% advance for wedding reception"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit">
              Save Payment Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Expense Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Log Operating Expense"
        subtitle="Record dated venue expenditures with category classification."
        maxWidth="md"
      >
        <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-ink-800">Expense Category *</label>
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              <option value="Utilities (Electricity/Water)">Utilities (Electricity/Water)</option>
              <option value="Salaries & Wages">Salaries & Wages</option>
              <option value="Repairs & Maintenance">Repairs & Maintenance</option>
              <option value="Cleaning & Housekeeping">Cleaning & Housekeeping</option>
              <option value="Supplies & Consumables">Supplies & Consumables</option>
              <option value="Marketing & Promotion">Marketing & Promotion</option>
              <option value="Software & Telecom">Software & Telecom</option>
              <option value="Insurance & Taxes">Insurance & Taxes</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. KSEB Monthly Power Bill"
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Amount (₹) *</label>
            <input
              type="number"
              min="1"
              required
              value={expAmountRupees}
              onChange={(e) => setExpAmountRupees(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Vendor / Payee Name</label>
            <input
              type="text"
              placeholder="e.g. Kerala State Electricity Board"
              value={expVendor}
              onChange={(e) => setExpVendor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Payment Method *</label>
            <select
              value={expMethod}
              onChange={(e) => setExpMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Log Expense
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Quote Modal */}
      <Modal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Create Versioned Quotation"
        subtitle="Generate itemized estimate for prospective customer"
        maxWidth="md"
      >
        <form onSubmit={handleCreateQuote} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-ink-800">Customer Name *</label>
            <input
              type="text"
              required
              value={quoteCustomerName}
              onChange={(e) => setQuoteCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Hall *</label>
            <select
              value={quoteHallName}
              onChange={(e) => setQuoteHallName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              <option value="Stage Hall">Stage Hall</option>
              <option value="Welcome Hall">Welcome Hall</option>
              <option value="Dining Hall">Dining Hall</option>
              <option value="Open Hall">Open Hall</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Event Date *</label>
            <input
              type="date"
              required
              value={quoteEventDate}
              onChange={(e) => setQuoteEventDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Line Item Description *</label>
            <input
              type="text"
              required
              value={quoteItemDesc}
              onChange={(e) => setQuoteItemDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Agreed Amount (₹) *</label>
            <input
              type="number"
              required
              value={quoteItemAmount}
              onChange={(e) => setQuoteItemAmount(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setQuoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit">
              Save Quotation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
