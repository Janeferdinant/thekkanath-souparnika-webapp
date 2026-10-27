import React, { useEffect, useId, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sun,
  Moon,
  Calendar,
  Gift,
} from 'lucide-react';
import { EventType, Enquiry, BookingSession } from '../../types/models';
import { StorageService } from '../../lib/storage';
import { generateReference, isValidIndianPhone, normalizeIndianPhone } from '../../lib/formatters';
import { SESSION_TIMES } from '../../lib/bookingEngine';
import { PreferredCaterersCard } from '../../components/public/PreferredCaterersCard';
import { sendEnquiryAcknowledgmentEmail } from '../../lib/emailService';
import { DEFAULT_REFERRERS, searchReferrers } from '../../lib/referralEngine';
import { GlassSurface } from '../../glass/GlassSurface';

const INPUT =
  'w-full px-3.5 py-2.5 rounded-xl border bg-brand-ivory-50 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-burgundy-700';
const INPUT_OK = 'border-brand-charcoal-600';
const INPUT_BAD = 'border-red-700';
const LABEL = 'block text-xs font-bold text-brand-charcoal-900';
const ERROR_TEXT = 'text-[11px] text-red-700';
const HINT_TEXT = 'text-[11px] text-brand-charcoal-600';

const BTN = 'inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full text-xs font-semibold transition-all';
const BTN_PRIMARY = `${BTN} text-brand-ivory-100 bg-brand-burgundy-700 hover:bg-brand-burgundy-800 border border-brand-burgundy-700 shadow-md disabled:opacity-70 disabled:cursor-not-allowed`;
const BTN_SECONDARY = `${BTN} text-brand-burgundy-700 border border-brand-burgundy-700 hover:bg-brand-burgundy-700 hover:text-brand-ivory-100 disabled:opacity-70 disabled:cursor-not-allowed`;
const BTN_GOLD = `${BTN} text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 border border-brand-champagne-400 shadow-md glass-highlight`;

const SESSIONS: { id: BookingSession; title: string; hours: string; blurb: string; Icon: React.ElementType }[] = [
  { id: 'morning', title: 'Morning Session', hours: '8 AM - 3 PM', blurb: 'Ideal for weddings, ritual ceremonies, & traditional sadhya', Icon: Sun },
  { id: 'evening', title: 'Evening Session', hours: '5 PM - 10 PM', blurb: 'Ideal for receptions, cultural programmes, & banquets', Icon: Moon },
  { id: 'full_day', title: 'Full Day Access', hours: '8 AM - 10 PM', blurb: 'Morning & evening combined with 3-5 PM turnaround buffer', Icon: Calendar },
];

export const EnquirePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  // Step state: 1: Event Details, 2: Contact Details, 3: Review & Submit
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [eventType, setEventType] = useState<EventType>('Wedding & Reception');
  const [preferredDate, setPreferredDate] = useState('');
  const [session, setSession] = useState<BookingSession>('morning');
  const [startTime, setStartTime] = useState(SESSION_TIMES.morning.startTime);
  const [endTime, setEndTime] = useState(SESSION_TIMES.morning.endTime);
  const preferredHallId = 'auditorium';
  const [estimatedGuests, setEstimatedGuests] = useState(250);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Referral Fields from optional ?ref= query parameter
  const refQuery = searchParams.get('ref') || '';
  const initialReferrerMatch = refQuery ? searchReferrers(refQuery, DEFAULT_REFERRERS)[0] : undefined;

  const [hasReferrer, setHasReferrer] = useState(Boolean(refQuery));
  const [referrerName, setReferrerName] = useState(initialReferrerMatch ? initialReferrerMatch.name : '');
  const [referrerPhone, setReferrerPhone] = useState(initialReferrerMatch ? initialReferrerMatch.phone : refQuery);
  const [referrerEmail, setReferrerEmail] = useState(initialReferrerMatch?.email || '');

  // Handle session change
  const handleSessionChange = (newSession: BookingSession) => {
    setSession(newSession);
    setStartTime(SESSION_TIMES[newSession].startTime);
    setEndTime(SESSION_TIMES[newSession].endTime);
  };

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Keep keyboard and screen-reader users oriented: new step heading gets focus, and a failed
  // validation moves focus to the first invalid field.
  useEffect(() => {
    stepHeadingRef.current?.focus({ preventScroll: false });
  }, [step, submittedEnquiry]);

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    firstInvalid?.focus();
  }, [errors]);

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
    if (!estimatedGuests || estimatedGuests < 1) {
      errs.estimatedGuests = 'Please specify your expected number of guests.';
    } else if (estimatedGuests > 400) {
      errs.estimatedGuests = 'For gatherings exceeding 400 guests, please contact venue management directly.';
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

    if (hasReferrer) {
      if (!referrerName.trim()) {
        errs.referrerName = "Please enter the referrer's name.";
      }
      if (!referrerPhone.trim()) {
        errs.referrerPhone = "Please enter the referrer's contact phone number.";
      } else if (!isValidIndianPhone(referrerPhone)) {
        errs.referrerPhone = 'Please enter a valid 10-digit Indian mobile number for the referrer.';
      }
      if (referrerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referrerEmail)) {
        errs.referrerEmail = 'Please enter a valid email address for the referrer.';
      }
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

    setErrors({});
    setIsSubmitting(true);

    try {
      // Simulate minor network dispatch delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newRef = generateReference('TS-ENQ');
      const referralNote =
        hasReferrer && referrerName.trim()
          ? `[Referred by: ${referrerName.trim()} · Ph: ${referrerPhone.trim()} · Email: ${referrerEmail.trim() || 'N/A'}]`
          : '';
      const combinedNotes = [specialRequests.trim(), referralNote].filter(Boolean).join(' ');

      const saved = StorageService.createEnquiry({
        reference: newRef,
        customerName: customerName.trim(),
        customerPhone: normalizeIndianPhone(customerPhone),
        customerEmail: customerEmail.trim() || 'not-provided@customer.com',
        eventType,
        preferredDate,
        session,
        startTime,
        endTime,
        preferredHallId,
        estimatedGuests,
        specialRequests: combinedNotes,
        consentGiven,
        status: 'new',
      });

      // Automatically dispatch / log transactional email
      try {
        await sendEnquiryAcknowledgmentEmail(saved);
      } catch {
        // Non-blocking for UI submission
      }

      setSubmittedEnquiry(saved);
    } catch {
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

  /** Props that tie an input to its label, its validity and its message. */
  const field = (name: string, error?: string, hintId?: string) => ({
    id: fid(name),
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? fid(`${name}-error`) : hintId,
  });
  const fieldError = (name: string, error?: string, small = false) =>
    error ? (
      <p id={fid(`${name}-error`)} role="alert" className={small ? 'text-[10px] text-red-700' : ERROR_TEXT}>
        {error}
      </p>
    ) : null;

  if (submittedEnquiry) {
    return (
      <div className="surface-ivory py-16 min-h-[70vh]">
        <div className="max-w-3xl mx-auto px-4">
          <GlassSurface tone="light" elevation="raised" className="p-8 sm:p-12 text-center space-y-6 border-brand-champagne-500">
            <div className="w-16 h-16 rounded-full bg-brand-burgundy-700 text-brand-champagne-300 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-bronze-700">Enquiry Received</span>
              <h1
                ref={stepHeadingRef}
                tabIndex={-1}
                className="font-serif text-3xl sm:text-4xl font-light text-brand-charcoal-900 focus:outline-none"
              >
                Thank You, {submittedEnquiry.customerName}
              </h1>
              <p className="text-xs sm:text-sm text-brand-charcoal-600 max-w-md mx-auto leading-relaxed">
                We have received your enquiry! Our team will check the calendar for your date and get in touch with you shortly.
              </p>
            </div>

            {/* Reference Card */}
            <div className="p-5 rounded-2xl border border-brand-champagne-500 bg-brand-ivory-50 max-w-sm mx-auto flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-brand-bronze-700">Enquiry Reference</span>
                <div className="font-mono text-lg font-bold text-brand-charcoal-900">{submittedEnquiry.reference}</div>
              </div>
              <button
                onClick={copyRefToClipboard}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border border-brand-burgundy-700 text-brand-burgundy-700 hover:bg-brand-burgundy-700 hover:text-brand-ivory-100 transition-colors"
                aria-label="Copy enquiry reference"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Next Steps Card */}
            <div className="text-left text-brand-charcoal-900 p-6 rounded-2xl space-y-3 border border-brand-champagne-500 bg-brand-ivory-200">
              <h2 className="font-serif text-base font-medium text-brand-burgundy-700">What Happens Next?</h2>
              <ol className="list-decimal list-inside text-xs text-brand-charcoal-600 space-y-1.5 leading-relaxed">
                <li>We will check our bookings calendar for your preferred date ({submittedEnquiry.preferredDate}).</li>
                <li>
                  We will call or WhatsApp you at <strong className="text-brand-charcoal-900">+91 {submittedEnquiry.customerPhone}</strong> to talk through your plans.
                </li>
                <li>You are always welcome to visit the venue to walk through the halls in person.</li>
                <li>Once timing and arrangements are agreed together, we will confirm availability for your date with you.</li>
              </ol>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href={`https://wa.me/918129764370?text=Hello%20Thekkanath%20Souparnika%2C%20I%20have%20submitted%20enquiry%20${submittedEnquiry.reference}%20for%20${submittedEnquiry.preferredDate}.`}
                target="_blank"
                rel="noreferrer"
                className={BTN_PRIMARY}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
              <Link to="/" className={BTN_SECONDARY}>
                Return to Home Page
              </Link>
            </div>
          </GlassSurface>
        </div>
      </div>
    );
  }

  const stepClass = (n: number) =>
    step === n
      ? 'bg-brand-burgundy-700 text-brand-ivory-100 border-brand-burgundy-700 shadow-md'
      : 'bg-brand-ivory-200 text-brand-charcoal-600 border-brand-champagne-500';

  return (
    <div>
      {/* Page header band */}
      <section className="surface-burgundy pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-brand-champagne-300">
            <Sparkles className="w-4 h-4" />
            <span>Plan Your Gathering</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-brand-ivory-100">Request a Booking Enquiry</h1>
          <p className="text-xs sm:text-sm text-brand-ivory-muted leading-relaxed">
            Tell us a little about your celebration. We will check date availability right away and get in touch with you.
          </p>
        </div>
      </section>

      <section className="surface-ivory py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Progress Steps */}
          <ol className="flex items-center justify-center gap-2 sm:gap-6 text-xs font-semibold" aria-label="Enquiry progress">
            {[
              [1, 'Event Details'],
              [2, 'Contact Information'],
              [3, 'Review & Submit'],
            ].map(([n, label], i) => (
              <React.Fragment key={n}>
                {i > 0 && (
                  <li aria-hidden="true" className="text-brand-charcoal-600">
                    →
                  </li>
                )}
                <li
                  aria-current={step === n ? 'step' : undefined}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${stepClass(n as number)}`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 text-center text-xs flex items-center justify-center font-bold">{n}</span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden sr-only">{label}</span>
                </li>
              </React.Fragment>
            ))}
          </ol>

          {/* Form Container */}
          <GlassSurface tone="light" elevation="raised" className="p-6 sm:p-10 border-brand-champagne-500">
            <div ref={formRef}>
              {/* Step 1: Event Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="font-serif text-2xl font-light text-brand-charcoal-900 border-b border-brand-champagne-500 pb-3 focus:outline-none"
                  >
                    Step 1: Event Details & Schedule
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Event Type */}
                    <div className="space-y-1.5">
                      <label htmlFor={fid('eventType')} className={LABEL}>
                        Type of Event *
                      </label>
                      <select
                        id={fid('eventType')}
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as EventType)}
                        className={`${INPUT} ${INPUT_OK}`}
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
                      <label htmlFor={fid('preferredDate')} className={LABEL}>
                        Preferred Event Date *
                      </label>
                      <input
                        {...field('preferredDate', errors.preferredDate)}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className={`${INPUT} ${errors.preferredDate ? INPUT_BAD : INPUT_OK}`}
                      />
                      {fieldError('preferredDate', errors.preferredDate)}
                    </div>

                    {/* Bookable Sessions */}
                    <div role="group" aria-labelledby={fid('session-label')} className="space-y-2 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <span id={fid('session-label')} className={LABEL}>
                          Select Event Session *
                        </span>
                        <span className="text-[11px] text-brand-charcoal-600">Two fixed daily sessions available</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {SESSIONS.map(({ id, title, hours, blurb, Icon }) => {
                          const selected = session === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => handleSessionChange(id)}
                              className={`p-4 rounded-2xl border text-left transition-all min-h-[44px] ${
                                selected
                                  ? 'border-brand-burgundy-700 bg-brand-burgundy-700 text-brand-ivory-100 shadow-md'
                                  : 'border-brand-charcoal-600 bg-brand-ivory-50 text-brand-charcoal-900 hover:border-brand-burgundy-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div
                                  className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                                    selected ? 'border-brand-champagne-500 text-brand-champagne-300' : 'border-brand-champagne-500 text-brand-burgundy-700'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                    selected ? 'border-brand-champagne-500 text-brand-champagne-300' : 'border-brand-champagne-500 text-brand-bronze-700'
                                  }`}
                                >
                                  {hours}
                                </span>
                              </div>
                              <div className="font-serif font-medium text-sm">{title}</div>
                              <p className={`text-[11px] mt-0.5 ${selected ? 'text-brand-ivory-muted' : 'text-brand-charcoal-600'}`}>{blurb}</p>
                            </button>
                          );
                        })}
                      </div>
                      {fieldError('time', errors.time)}
                    </div>

                    {/* Expected Headcount */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor={fid('estimatedGuests')} className={LABEL}>
                        Expected Guests * (Ideal for 250 to 300 guests; capacity up to 400)
                      </label>
                      <input
                        {...field('estimatedGuests', errors.estimatedGuests)}
                        type="number"
                        min="1"
                        max="400"
                        value={estimatedGuests}
                        onChange={(e) => setEstimatedGuests(parseInt(e.target.value, 10) || 0)}
                        className={`${INPUT} ${errors.estimatedGuests ? INPUT_BAD : INPUT_OK}`}
                        placeholder="e.g. 250"
                      />
                      {fieldError('estimatedGuests', errors.estimatedGuests)}
                    </div>
                  </div>

                  {/* Preferred Catering Section */}
                  <div className="pt-4">
                    <PreferredCaterersCard />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      className={BTN_GOLD}
                      onClick={() => {
                        if (validateStep1()) setStep(2);
                      }}
                    >
                      <span>Continue to Contact Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="font-serif text-2xl font-light text-brand-charcoal-900 border-b border-brand-champagne-500 pb-3 focus:outline-none"
                  >
                    Step 2: Contact Information & Special Requests
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor={fid('customerName')} className={LABEL}>
                        Your Full Name *
                      </label>
                      <input
                        {...field('customerName', errors.customerName)}
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Ramesh Nair"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`${INPUT} ${errors.customerName ? INPUT_BAD : INPUT_OK}`}
                      />
                      {fieldError('customerName', errors.customerName)}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor={fid('customerPhone')} className={LABEL}>
                        Mobile Phone (WhatsApp Preferred) *
                      </label>
                      <input
                        {...field('customerPhone', errors.customerPhone, fid('customerPhone-hint'))}
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. 9847012345"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className={`${INPUT} ${errors.customerPhone ? INPUT_BAD : INPUT_OK}`}
                      />
                      {fieldError('customerPhone', errors.customerPhone) ?? (
                        <p id={fid('customerPhone-hint')} className={HINT_TEXT}>
                          10-digit Indian mobile number.
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor={fid('customerEmail')} className={LABEL}>
                        Email Address (Optional)
                      </label>
                      <input
                        {...field('customerEmail', errors.customerEmail)}
                        type="email"
                        autoComplete="email"
                        placeholder="e.g. ramesh@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className={`${INPUT} ${errors.customerEmail ? INPUT_BAD : INPUT_OK}`}
                      />
                      {fieldError('customerEmail', errors.customerEmail)}
                    </div>

                    {/* Referral Bonus Banner & Fields */}
                    <div className="sm:col-span-2 p-5 rounded-2xl border border-brand-champagne-500 bg-brand-ivory-200 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-brand-burgundy-700 text-brand-champagne-300 flex items-center justify-center">
                            <Gift className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 id={fid('referral-label')} className="text-xs font-bold text-brand-charcoal-900">
                              Were you referred by a friend, vendor, or guest?
                            </h3>
                            <p className="text-[11px] text-brand-charcoal-600">They are eligible for our venue referral appreciation incentive.</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-center">
                          <input
                            type="checkbox"
                            role="switch"
                            aria-labelledby={fid('referral-label')}
                            checked={hasReferrer}
                            onChange={(e) => setHasReferrer(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-brand-ivory-50 border border-brand-charcoal-600 rounded-full peer peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-burgundy-700 peer-checked:bg-brand-burgundy-700 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[7px] after:bg-brand-burgundy-700 peer-checked:after:bg-brand-champagne-300 after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                      </div>

                      {hasReferrer && (
                        <div className="pt-3 border-t border-brand-champagne-500 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label htmlFor={fid('referrerName')} className="block text-[11px] font-bold text-brand-charcoal-900">
                              Referrer's Full Name *
                            </label>
                            <input
                              {...field('referrerName', errors.referrerName)}
                              type="text"
                              placeholder="e.g. Rahul Varma"
                              value={referrerName}
                              onChange={(e) => setReferrerName(e.target.value)}
                              className={`${INPUT} ${errors.referrerName ? INPUT_BAD : INPUT_OK}`}
                            />
                            {fieldError('referrerName', errors.referrerName, true)}
                          </div>

                          <div className="space-y-1">
                            <label htmlFor={fid('referrerPhone')} className="block text-[11px] font-bold text-brand-charcoal-900">
                              Referrer's Mobile Phone *
                            </label>
                            <input
                              {...field('referrerPhone', errors.referrerPhone)}
                              type="tel"
                              placeholder="e.g. 9446123456"
                              value={referrerPhone}
                              onChange={(e) => setReferrerPhone(e.target.value)}
                              className={`${INPUT} ${errors.referrerPhone ? INPUT_BAD : INPUT_OK}`}
                            />
                            {fieldError('referrerPhone', errors.referrerPhone, true)}
                          </div>

                          <div className="space-y-1">
                            <label htmlFor={fid('referrerEmail')} className="block text-[11px] font-bold text-brand-charcoal-900">
                              Referrer's Email / UPI (Optional)
                            </label>
                            <input
                              {...field('referrerEmail', errors.referrerEmail)}
                              type="text"
                              placeholder="e.g. rahul@example.com"
                              value={referrerEmail}
                              onChange={(e) => setReferrerEmail(e.target.value)}
                              className={`${INPUT} ${errors.referrerEmail ? INPUT_BAD : INPUT_OK}`}
                            />
                            {fieldError('referrerEmail', errors.referrerEmail, true)}
                          </div>

                          {/* Autocomplete Suggestions from repeat referrers */}
                          {(() => {
                            const query = (referrerName || referrerPhone).trim();
                            const matches = query ? searchReferrers(query, DEFAULT_REFERRERS) : [];
                            if (matches.length === 0) return null;
                            return (
                              <div className="sm:col-span-3 bg-brand-ivory-50 p-2.5 rounded-xl border border-brand-champagne-500 space-y-1">
                                <span className="text-[10px] font-semibold text-brand-bronze-700 uppercase tracking-wider">
                                  Suggested repeat referrers:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {matches.map((ref) => (
                                    <button
                                      key={ref.id}
                                      type="button"
                                      onClick={() => {
                                        setReferrerName(ref.name);
                                        setReferrerPhone(ref.phone);
                                        if (ref.email) setReferrerEmail(ref.email);
                                      }}
                                      className="px-2.5 min-h-[44px] rounded-lg text-brand-charcoal-900 text-xs border border-brand-charcoal-600 text-left transition-colors flex items-center gap-1.5 hover:border-brand-burgundy-700"
                                    >
                                      <span className="font-bold">{ref.name}</span>
                                      <span className="text-[11px] text-brand-charcoal-600">({ref.phone})</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor={fid('specialRequests')} className={LABEL}>
                        Special Requests / Setup Details (Optional)
                      </label>
                      <textarea
                        id={fid('specialRequests')}
                        rows={3}
                        placeholder="Tell us about stage setup, catering arrangements, dress-change room requests, etc. Note: requests require staff review and do not guarantee fulfillment."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className={`${INPUT} ${INPUT_OK}`}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-brand-champagne-500">
                    <button type="button" className={BTN_SECONDARY} onClick={() => setStep(1)}>
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Details</span>
                    </button>
                    <button
                      type="button"
                      className={BTN_GOLD}
                      onClick={() => {
                        if (validateStep2()) setStep(3);
                      }}
                    >
                      <span>Review Enquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <h2
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="font-serif text-2xl font-light text-brand-charcoal-900 border-b border-brand-champagne-500 pb-3 focus:outline-none"
                  >
                    Step 3: Review Your Enquiry
                  </h2>

                  {/* Summary Review Card */}
                  <dl className="p-6 rounded-2xl border border-brand-champagne-500 bg-brand-ivory-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <dt className="text-brand-bronze-700 font-semibold">Event Type:</dt>
                      <dd className="font-medium text-brand-charcoal-900 text-sm mt-0.5">{eventType}</dd>
                    </div>
                    <div>
                      <dt className="text-brand-bronze-700 font-semibold">Preferred Date & Slot:</dt>
                      <dd className="font-medium text-brand-charcoal-900 text-sm mt-0.5">
                        {preferredDate} ({startTime} to {endTime})
                      </dd>
                    </div>
                    <div>
                      <dt className="text-brand-bronze-700 font-semibold">Guest Headcount:</dt>
                      <dd className="font-medium text-brand-charcoal-900 text-sm mt-0.5">{estimatedGuests} guests</dd>
                    </div>
                    <div>
                      <dt className="text-brand-bronze-700 font-semibold">Customer Name:</dt>
                      <dd className="font-medium text-brand-charcoal-900 text-sm mt-0.5">{customerName}</dd>
                    </div>
                    <div>
                      <dt className="text-brand-bronze-700 font-semibold">Contact Number:</dt>
                      <dd className="font-medium text-brand-charcoal-900 text-sm mt-0.5">+91 {customerPhone}</dd>
                    </div>
                    {hasReferrer && referrerName && (
                      <div className="sm:col-span-2 border-t border-brand-champagne-500 pt-2">
                        <dt className="text-brand-bronze-700 font-semibold">Referred By:</dt>
                        <dd className="font-medium text-brand-charcoal-900 text-sm mt-0.5">
                          {referrerName} (+91 {referrerPhone}){referrerEmail ? ` · ${referrerEmail}` : ''}
                        </dd>
                      </div>
                    )}
                    {specialRequests && (
                      <div className="sm:col-span-2 border-t border-brand-champagne-500 pt-2">
                        <dt className="text-brand-bronze-700 font-semibold">Special Notes / Requirements:</dt>
                        <dd className="text-brand-charcoal-600 mt-1">{specialRequests}</dd>
                      </div>
                    )}
                  </dl>

                  {/* Consent & Privacy Notice */}
                  <div className="space-y-3 pt-2">
                    <label htmlFor={fid('consent')} className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        {...field('consent', errors.consent)}
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="w-5 h-5 mt-0.5 shrink-0 rounded accent-brand-burgundy-700 border-brand-charcoal-600"
                      />
                      <span className="text-xs text-brand-charcoal-600 leading-relaxed">
                        I give permission for the venue management of Thekkanath Souparnika to contact me via phone, WhatsApp, or email regarding date availability, hall tours, and quotations. I understand that submitting this enquiry does not reserve or lock the requested date. *
                      </span>
                    </label>
                    {fieldError('consent', errors.consent)}
                    {errors.form && (
                      <p role="alert" className="text-xs font-semibold text-red-700">
                        {errors.form}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-between border-t border-brand-champagne-500">
                    <button type="button" onClick={() => setStep(2)} disabled={isSubmitting} className={BTN_SECONDARY}>
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Contact</span>
                    </button>
                    <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={`${BTN_GOLD} disabled:opacity-70 disabled:cursor-not-allowed`}>
                      <span>{isSubmitting ? 'Sending…' : 'Submit Booking Enquiry'}</span>
                      {!isSubmitting && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </GlassSurface>
        </div>
      </section>
    </div>
  );
};
