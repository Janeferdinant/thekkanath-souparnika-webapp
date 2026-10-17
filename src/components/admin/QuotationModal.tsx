import React, { useState, useEffect } from 'react';
import {
  Printer,
  Mail,
  Plus,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { Quotation, QuoteItem, BookingSession } from '../../types/models';
import { StorageService } from '../../lib/storage';
import { generateReference, formatINR } from '../../lib/formatters';
import { generateQuotationDocument, CLEANING_LIABILITY_CLAUSE } from '../../lib/documentGenerator';
import { sendQuotationEmail } from '../../lib/emailService';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingQuote?: Quotation | null;
  initialData?: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    hallName?: string;
    eventDate?: string;
    session?: BookingSession;
    baseRentRupees?: number;
  };
  onQuoteSaved?: (quote: Quotation) => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  existingQuote,
  initialData,
  onQuoteSaved,
}) => {
  const { success, error } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [hallName, setHallName] = useState('Thekkanath Souparnika (Full Venue)');
  const [session, setSession] = useState<BookingSession>('morning');
  const [eventDate, setEventDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [cautionDepositRupees, setCautionDepositRupees] = useState(10000);

  const [items, setItems] = useState<
    Array<{ id: string; description: string; quantity: number; unitPriceRupees: number }>
  >([
    {
      id: 'item-1',
      description: 'Auditorium Session Hire (Morning 8 AM - 3 PM)',
      quantity: 1,
      unitPriceRupees: 45000,
    },
  ]);

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (existingQuote) {
      setCustomerName(existingQuote.customerName);
      setCustomerPhone(existingQuote.customerPhone || '');
      setCustomerEmail(existingQuote.customerEmail || '');
      setHallName(existingQuote.hallName);
      setEventDate(existingQuote.eventDate);
      setValidUntil(existingQuote.validUntil);
      setItems(
        existingQuote.items.map((it) => ({
          id: it.id,
          description: it.description,
          quantity: it.quantity,
          unitPriceRupees: Math.round(it.unitPricePaise / 100),
        }))
      );
    } else if (initialData) {
      if (initialData.customerName) setCustomerName(initialData.customerName);
      if (initialData.customerPhone) setCustomerPhone(initialData.customerPhone);
      if (initialData.customerEmail) setCustomerEmail(initialData.customerEmail);
      if (initialData.hallName) setHallName(initialData.hallName);
      if (initialData.eventDate) setEventDate(initialData.eventDate);
      if (initialData.session) {
        setSession(initialData.session);
        const sessionLabel =
          initialData.session === 'evening'
            ? 'Evening 5 PM - 10 PM'
            : initialData.session === 'full_day'
            ? 'Full Day 8 AM - 10 PM'
            : 'Morning 8 AM - 3 PM';
        const baseAmount = initialData.baseRentRupees || 45000;
        setItems([
          {
            id: 'item-1',
            description: `Auditorium Session Hire (${sessionLabel})`,
            quantity: 1,
            unitPriceRupees: baseAmount,
          },
        ]);
      }
      // Valid for 7 days
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setValidUntil(d.toISOString().split('T')[0]);
    } else {
      // Default dates
      const today = new Date();
      today.setDate(today.getDate() + 14);
      setEventDate(today.toISOString().split('T')[0]);

      const valid = new Date();
      valid.setDate(valid.getDate() + 7);
      setValidUntil(valid.toISOString().split('T')[0]);
    }
  }, [existingQuote, initialData, isOpen]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: 'Optional Facility / Setup Service',
        quantity: 1,
        unitPriceRupees: 5000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      error('A quotation must contain at least one line item.');
      return;
    }
    setItems(items.filter((it) => it.id !== id));
  };

  const updateItem = (
    id: string,
    field: 'description' | 'quantity' | 'unitPriceRupees',
    value: any
  ) => {
    setItems(
      items.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const subtotalRupees = items.reduce(
    (acc, it) => acc + it.quantity * (it.unitPriceRupees || 0),
    0
  );
  const grandTotalRupees = subtotalRupees + (cautionDepositRupees || 0);

  const buildQuoteObject = (): Quotation => {
    const quoteItems: QuoteItem[] = items.map((it) => ({
      id: it.id,
      description: it.description,
      quantity: it.quantity,
      unitPricePaise: Math.round(it.unitPriceRupees * 100),
      totalPaise: Math.round(it.quantity * it.unitPriceRupees * 100),
    }));

    return {
      id: existingQuote ? existingQuote.id : `qte-${Date.now()}`,
      reference: existingQuote ? existingQuote.reference : generateReference('TS-QTE'),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'customer@example.com',
      hallName,
      eventDate,
      items: quoteItems,
      subtotalPaise: Math.round(subtotalRupees * 100),
      discountPaise: 0,
      taxPaise: 0,
      totalPaise: Math.round(subtotalRupees * 100),
      validUntil,
      status: existingQuote ? existingQuote.status : 'draft',
      createdAt: existingQuote ? existingQuote.createdAt : new Date().toISOString(),
    };
  };

  const handlePrint = () => {
    if (!customerName.trim() || !eventDate) {
      error('Please specify customer name and event date.');
      return;
    }
    const quote = buildQuoteObject();
    const result = generateQuotationDocument(quote, Math.round(cautionDepositRupees * 100));

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(result.html);
      printWin.document.close();
      printWin.focus();
      printWin.print();
      success('Quotation Document Ready', `Opening PDF print view for ${quote.reference}`);
    }
  };

  const handleSendEmail = async () => {
    if (!customerEmail.trim()) {
      error('Please provide a valid client email address to send the quote.');
      return;
    }
    const quote = buildQuoteObject();
    setIsSendingEmail(true);
    try {
      await sendQuotationEmail(quote, Math.round(cautionDepositRupees * 100));
      success('Quotation Dispatched', `Quotation ${quote.reference} sent to ${customerEmail}`);
    } catch {
      error('Failed to send quotation email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !eventDate) {
      error('Please complete all required fields.');
      return;
    }

    const quote = buildQuoteObject();
    if (!existingQuote) {
      StorageService.createQuote(quote);
    }
    if (onQuoteSaved) {
      onQuoteSaved(quote);
    }
    success('Quotation Saved', `Quotation ${quote.reference} saved to repository.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingQuote ? `Quotation: ${existingQuote.reference}` : 'Create Client Quotation'}
      subtitle="Generates an itemized estimate with separate caution deposit & catering cleanup clause."
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-ink-800">Customer Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Customer Phone *</label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Customer Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. client@example.com"
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Event Date *</label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Venue Selection *</label>
            <select
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              <option value="Thekkanath Souparnika (Full Venue)">Thekkanath Souparnika (Full Venue / All 4 Halls)</option>
              <option value="Stage Hall">Stage Hall</option>
              <option value="Welcome Hall">Welcome Hall</option>
              <option value="Dining Hall">Dining Hall</option>
              <option value="Open Hall">Open Hall</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Session *</label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value as BookingSession)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              <option value="morning">Morning Session (8:00 AM – 3:00 PM)</option>
              <option value="evening">Evening Session (5:00 PM – 10:00 PM)</option>
              <option value="full_day">Full Day (8:00 AM – 10:00 PM)</option>
            </select>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div className="space-y-2 pt-2 border-t border-cream-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-forest-950 text-sm">Itemized Quotation Breakdown</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-800 hover:text-forest-950"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((it) => (
              <div
                key={it.id}
                className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-cream-50 border border-cream-200"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    required
                    value={it.description}
                    onChange={(e) => updateItem(it.id, 'description', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-cream-300 bg-white text-xs"
                    placeholder="Description"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={it.quantity}
                    onChange={(e) => updateItem(it.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-2 py-1.5 rounded-lg border border-cream-300 bg-white text-xs text-center"
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={it.unitPriceRupees}
                    onChange={(e) => updateItem(it.id, 'unitPriceRupees', parseInt(e.target.value, 10) || 0)}
                    className="w-full px-2 py-1.5 rounded-lg border border-cream-300 bg-white text-xs text-right"
                    placeholder="Rate (₹)"
                  />
                </div>
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(it.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Separate Line Item: Caution / Cleaning Deposit */}
        <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-burgundy-950 block">
                Refundable Caution Deposit / Cleaning Deposit *
              </span>
              <p className="text-[10px] text-burgundy-800">
                Separate line item collected to guarantee venue integrity post-event.
              </p>
            </div>
            <div className="w-32">
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={cautionDepositRupees}
                onChange={(e) => setCautionDepositRupees(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-rose-300 bg-white text-right font-bold text-burgundy-950 text-xs"
              />
            </div>
          </div>

          {/* Mandatory Cleanup Clause Preview */}
          <div className="p-2.5 rounded-lg bg-white border border-rose-200/80 text-[11px] text-burgundy-900 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-burgundy-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Mandatory Cleaning Obligation Clause:</strong>
              <span>{CLEANING_LIABILITY_CLAUSE}</span>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-3.5 rounded-xl bg-cream-100 border border-cream-300 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-ink-600">Rental Subtotal:</span>
            <span className="font-semibold text-ink-900">{formatINR(subtotalRupees * 100)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-600">Refundable Caution Deposit:</span>
            <span className="font-semibold text-burgundy-900">+{formatINR(cautionDepositRupees * 100)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-forest-950 pt-1.5 border-t border-cream-300">
            <span>Total Estimate:</span>
            <span>{formatINR(grandTotalRupees * 100)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-cream-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5 text-forest-800" />}
            >
              Download / Print PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={isSendingEmail || !customerEmail.trim()}
              onClick={handleSendEmail}
              leftIcon={<Mail className="w-3.5 h-3.5 text-indigo-700" />}
            >
              {isSendingEmail ? 'Sending...' : 'Email to Client'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit">
              Save Quotation
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
