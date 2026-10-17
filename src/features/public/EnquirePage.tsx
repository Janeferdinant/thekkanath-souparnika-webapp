import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { HALLS } from '../../data/venueData';
import { EventType, Enquiry } from '../../types/models';
import { StorageService } from '../../lib/storage';
import { generateReference, isValidIndianPhone, normalizeIndianPhone } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';

export const EnquirePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedHall = searchParams.get('hall') || 'any';

  // Step state: 1: Event Details, 2: Contact Details, 3: Review & Submit
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [eventType, setEventType] = useState<EventType>('Wedding & Reception');
  const [preferredDate, setPreferredDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('14:00');
  const [preferredHallId, setPreferredHallId] = useState(preselectedHall);
  const [estimatedGuests, setEstimatedGuests] = useState(80);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!preferredDate) {
      errs.preferredDate = 'Please select a preferred event date.';
    }
    if (!startTime || !endTime) {
      errs.time = 'Please select start and end times.';
    } else if (startTime >= endTime) {
      errs.time = 'Start time must be strictly before end time.';
    }
    if (!estimatedGuests || estimatedGuests < 10) {
      errs.estimatedGuests = 'Please specify at least 10 guests.';
    } else if (estimatedGuests > 300) {
      errs.estimatedGuests = 'The venue is best suited for gatherings up to 300 guests.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.customerName = 'Please enter your full name.';
    }
    if (!customerPhone.trim()) {
      errs.customerPhone = 'Please provide a contact phone number.';
    } else if (!isValidIndianPhone(customerPhone)) {
      errs.customerPhone = 'Please enter a valid 10-digit Indian phone number.';
    }
    if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errs.customerEmail = 'Please enter a valid email address.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setErrors({ consent: 'Please accept the privacy and contact consent to proceed.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate minor network dispatch delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newRef = generateReference('TS-ENQ');
      const saved = StorageService.createEnquiry({
        reference: newRef,
        customerName: customerName.trim(),
        customerPhone: normalizeIndianPhone(customerPhone),
        customerEmail: customerEmail.trim() || 'not-provided@customer.com',
        eventType,
        preferredDate,
        startTime,
        endTime,
        preferredHallId,
        estimatedGuests,
        specialRequests: specialRequests.trim(),
        consentGiven,
        status: 'new',
      });

      setSubmittedEnquiry(saved);
    } catch (err) {
      setErrors({ form: 'An error occurred while saving your enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefToClipboard = () => {
    if (submittedEnquiry) {
      navigator.clipboard.writeText(submittedEnquiry.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (submittedEnquiry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-cream-50 border border-cream-200 shadow-luxury text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
              Enquiry Received
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              Thank You, {submittedEnquiry.customerName}
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 max-w-md mx-auto leading-relaxed">
              Your booking enquiry has been recorded in our system. Submitting an enquiry does not automatically reserve a date; management will check availability and follow up.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-5 rounded-2xl bg-cream-100 border border-cream-300 max-w-sm mx-auto flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-ink-500">Enquiry Reference</span>
              <div className="font-mono text-lg font-bold text-forest-900">
                {submittedEnquiry.reference}
              </div>
            </div>
            <button
              onClick={copyRefToClipboard}
              className="p-2.5 rounded-xl hover:bg-cream-200 text-forest-800 transition-colors"
              title="Copy Reference"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Next Steps Card */}
          <div className="text-left bg-forest-900 text-cream-100 p-6 rounded-2xl space-y-3">
            <h4 className="font-serif text-base font-bold text-gold-300">What Happens Next?</h4>
            <ol className="list-decimal list-inside text-xs text-cream-200 space-y-1.5 leading-relaxed">
              <li>Our management team reviews your preferred date ({submittedEnquiry.preferredDate}) against existing bookings.</li>
              <li>We will contact you via phone or WhatsApp at <strong>+91 {submittedEnquiry.customerPhone}</strong>.</li>
              <li>You can arrange a venue visit to inspect the halls in person.</li>
              <li>Upon agreement on dates and rental details, your booking will be confirmed.</li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={`https://wa.me/918129764370?text=Hello%20Thekkanath%20Souparnika%2C%20I%20have%20submitted%20enquiry%20${submittedEnquiry.reference}%20for%20${submittedEnquiry.preferredDate}.`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="gold" size="md" leftIcon={<MessageCircle className="w-4 h-4" />}>
                Message on WhatsApp
              </Button>
            </a>
            <Link to="/">
              <Button variant="outline" size="md">
                Return to Home Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700">
          <Sparkles className="w-4 h-4" />
          <span>Plan Your Gathering</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900">
          Request a Booking Enquiry
        </h1>
        <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
          Tell us about your event. A booking request is not an instant confirmation; our team will verify hall schedules and follow up promptly.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs font-semibold">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            step === 1
              ? 'bg-forest-800 text-white border-forest-800 shadow-sm'
              : 'bg-cream-100 text-ink-600 border-cream-300'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-cream-50/20 text-center text-xs flex items-center justify-center font-bold">
            1
          </span>
          <span className="hidden sm:inline">Event Details</span>
        </div>
        <span className="text-cream-400">→</span>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            step === 2
              ? 'bg-forest-800 text-white border-forest-800 shadow-sm'
              : 'bg-cream-100 text-ink-600 border-cream-300'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-cream-50/20 text-center text-xs flex items-center justify-center font-bold">
            2
          </span>
          <span className="hidden sm:inline">Contact Information</span>
        </div>
        <span className="text-cream-400">→</span>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            step === 3
              ? 'bg-forest-800 text-white border-forest-800 shadow-sm'
              : 'bg-cream-100 text-ink-600 border-cream-300'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-cream-50/20 text-center text-xs flex items-center justify-center font-bold">
            3
          </span>
          <span className="hidden sm:inline">Review & Submit</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-cream-50 border border-cream-200 shadow-luxury">
        {/* Step 1: Event Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="font-serif text-2xl font-bold text-forest-900 border-b border-cream-200 pb-3">
              Step 1: Event Details & Schedule
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Type of Event *</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="Wedding & Reception">Wedding & Reception</option>
                  <option value="Ceremony / Ritual">Ceremony / Ritual (Engagement, Naming, etc.)</option>
                  <option value="Family Gathering">Family Gathering / Feast</option>
                  <option value="Seminar / Conference">Seminar / Conference</option>
                  <option value="Cultural Programme">Cultural Programme</option>
                  <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                  <option value="Other">Other Event</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Preferred Event Date *</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                    errors.preferredDate ? 'border-red-500' : 'border-cream-300'
                  }`}
                />
                {errors.preferredDate && (
                  <p className="text-[11px] text-red-600">{errors.preferredDate}</p>
                )}
              </div>

              {/* Start Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Proposed Start Time *</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {/* End Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Proposed End Time *</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
                {errors.time && <p className="text-[11px] text-red-600">{errors.time}</p>}
              </div>

              {/* Preferred Hall */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Preferred Hall</label>
                <select
                  value={preferredHallId}
                  onChange={(e) => setPreferredHallId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="any">Not sure yet / Recommend for me</option>
                  {HALLS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.floor} · {h.airConditioned ? 'AC' : 'Non-AC'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Expected Headcount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">
                  Estimated Guest Count (Max 300 recommended) *
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={estimatedGuests}
                  onChange={(e) => setEstimatedGuests(parseInt(e.target.value, 10) || 0)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                    errors.estimatedGuests ? 'border-red-500' : 'border-cream-300'
                  }`}
                />
                {errors.estimatedGuests ? (
                  <p className="text-[11px] text-red-600">{errors.estimatedGuests}</p>
                ) : (
                  <p className="text-[10px] text-ink-500">
                    Each hall holds up to 100 guests; the venue accommodates up to 300 overall.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Contact Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="font-serif text-2xl font-bold text-forest-900 border-b border-cream-200 pb-3">
              Step 2: Contact Information & Special Requests
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Nair"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                    errors.customerName ? 'border-red-500' : 'border-cream-300'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-red-600">{errors.customerName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Mobile Phone (WhatsApp Preferred) *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9847012345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                    errors.customerPhone ? 'border-red-500' : 'border-cream-300'
                  }`}
                />
                {errors.customerPhone ? (
                  <p className="text-[11px] text-red-600">{errors.customerPhone}</p>
                ) : (
                  <p className="text-[10px] text-ink-500">10-digit Indian mobile number.</p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-ink-800">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                    errors.customerEmail ? 'border-red-500' : 'border-cream-300'
                  }`}
                />
                {errors.customerEmail && (
                  <p className="text-[11px] text-red-600">{errors.customerEmail}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-ink-800">
                  Special Requests / Setup Details (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about stage setup, catering arrangements, dress-change room requests, etc. Note: requests require staff review and do not guarantee fulfillment."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-cream-200">
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Details
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Review & Confirm
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
            <h2 className="font-serif text-2xl font-bold text-forest-900 border-b border-cream-200 pb-3">
              Step 3: Review Your Enquiry
            </h2>

            {/* Summary Review Card */}
            <div className="p-6 rounded-2xl bg-cream-100 border border-cream-300 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-ink-500">Event Type:</span>
                <p className="font-bold text-forest-900 text-sm mt-0.5">{eventType}</p>
              </div>
              <div>
                <span className="text-ink-500">Preferred Date & Slot:</span>
                <p className="font-bold text-forest-900 text-sm mt-0.5">
                  {preferredDate} ({startTime} to {endTime})
                </p>
              </div>
              <div>
                <span className="text-ink-500">Selected Hall:</span>
                <p className="font-bold text-forest-900 text-sm mt-0.5">
                  {preferredHallId === 'any'
                    ? 'Flexible / Management Recommendation'
                    : HALLS.find((h) => h.id === preferredHallId)?.name}
                </p>
              </div>
              <div>
                <span className="text-ink-500">Guest Headcount:</span>
                <p className="font-bold text-forest-900 text-sm mt-0.5">{estimatedGuests} guests</p>
              </div>
              <div>
                <span className="text-ink-500">Customer Name:</span>
                <p className="font-bold text-forest-900 text-sm mt-0.5">{customerName}</p>
              </div>
              <div>
                <span className="text-ink-500">Contact Number:</span>
                <p className="font-bold text-forest-900 text-sm mt-0.5">+91 {customerPhone}</p>
              </div>
              {specialRequests && (
                <div className="sm:col-span-2 border-t border-cream-300 pt-2">
                  <span className="text-ink-500">Special Notes / Requirements:</span>
                  <p className="text-ink-800 mt-1">{specialRequests}</p>
                </div>
              )}
            </div>

            {/* Consent & Privacy Notice */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-forest-800 focus:ring-forest-600 border-cream-300"
                />
                <span className="text-xs text-ink-700 leading-relaxed">
                  I give permission for the venue management of Thekkanath Souparnika to contact me via phone, WhatsApp, or email regarding date availability, hall tours, and quotations. I understand that submitting this enquiry does not reserve or lock the requested date. *
                </span>
              </label>
              {errors.consent && <p className="text-[11px] text-red-600">{errors.consent}</p>}
              {errors.form && <p className="text-[11px] text-red-600">{errors.form}</p>}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-cream-200">
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={() => setStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                Back to Contact
              </Button>
              <Button
                variant="gold"
                size="lg"
                type="submit"
                isLoading={isSubmitting}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Submit Booking Enquiry
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
