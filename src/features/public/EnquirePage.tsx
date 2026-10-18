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
  Sun,
  Moon,
  Calendar,
  Gift,
} from 'lucide-react';
import { HALLS } from '../../data/venueData';
import { EventType, Enquiry, BookingSession } from '../../types/models';
import { StorageService } from '../../lib/storage';
import { generateReference, isValidIndianPhone, normalizeIndianPhone } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { SESSION_TIMES } from '../../lib/bookingEngine';
import { PreferredCaterersCard } from '../../components/public/PreferredCaterersCard';
import { sendEnquiryAcknowledgmentEmail } from '../../lib/emailService';
import { DEFAULT_REFERRERS, searchReferrers } from '../../lib/referralEngine';

export const EnquirePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedHall = searchParams.get('hall') || 'auditorium';

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
  const [preferredHallId, setPreferredHallId] = useState(preselectedHall);
  const [estimatedGuests, setEstimatedGuests] = useState(150);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Referral Fields from optional ?ref= query parameter
  const refQuery = searchParams.get('ref') || '';
  const initialReferrerMatch = refQuery ? searchReferrers(refQuery, DEFAULT_REFERRERS)[0] : undefined;

  const [hasReferrer, setHasReferrer] = useState(Boolean(refQuery));
  const [referrerName, setReferrerName] = useState(
    initialReferrerMatch ? initialReferrerMatch.name : ''
  );
  const [referrerPhone, setReferrerPhone] = useState(
    initialReferrerMatch ? initialReferrerMatch.phone : refQuery
  );
  const [referrerEmail, setReferrerEmail] = useState(
    initialReferrerMatch?.email || ''
  );

  // Handle session change
  const handleSessionChange = (newSession: BookingSession) => {
    setSession(newSession);
    setStartTime(SESSION_TIMES[newSession].startTime);
    setEndTime(SESSION_TIMES[newSession].endTime);
  };

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

    setIsSubmitting(true);

    try {
      // Simulate minor network dispatch delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newRef = generateReference('TS-ENQ');
      const referralNote = hasReferrer && referrerName.trim()
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
      <div className="lux-legacy max-w-3xl mx-auto px-4 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-cream-50 border border-cream-200 shadow-luxury text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
              Enquiry Saved
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
              Thank You, {submittedEnquiry.customerName}
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 max-w-md mx-auto leading-relaxed">
              Your enquiry is saved in this browser. Send the reference to the venue team by WhatsApp or call them directly so they can review your request. No date is reserved by this form.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-5 rounded-2xl bg-cream-100 border border-cream-300 max-w-sm mx-auto flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-ink-500">Enquiry Reference</span>
              <div className="font-mono text-lg font-bold text-burgundy-950">
                {submittedEnquiry.reference}
              </div>
            </div>
            <button
              onClick={copyRefToClipboard}
              className="p-2.5 rounded-xl hover:bg-cream-200 text-burgundy-900 transition-colors"
              title="Copy Reference"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Next Steps Card */}
          <div className="text-left bg-gradient-to-r from-burgundy-950 to-wine-950 text-cream-100 p-6 rounded-2xl space-y-3 border border-rose-300/30">
            <h4 className="font-serif text-base font-bold text-gold-300">What Happens Next?</h4>
            <ol className="list-decimal list-inside text-xs text-cream-200 space-y-1.5 leading-relaxed">
              <li>Send this enquiry reference and your preferred date ({submittedEnquiry.preferredDate}) to the venue team.</li>
              <li>The team can discuss availability and event details with you by phone or WhatsApp.</li>
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
    <div className="lux-legacy max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700">
          <Sparkles className="w-4 h-4" />
          <span>Plan Your Gathering</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-burgundy-950">
          Request a Booking Enquiry
        </h1>
        <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
          Tell us about your event. This form saves your details in this browser; share the reference with the venue team to discuss hall schedules and availability.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs font-semibold">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            step === 1
              ? 'bg-gradient-to-r from-burgundy-900 to-wine-900 text-white border-burgundy-900 shadow-sm'
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
              ? 'bg-gradient-to-r from-burgundy-900 to-wine-900 text-white border-burgundy-900 shadow-sm'
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
              ? 'bg-gradient-to-r from-burgundy-900 to-wine-900 text-white border-burgundy-900 shadow-sm'
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
                  aria-label="Type of event"
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
                  aria-label="Preferred event date"
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

              {/* Bookable Sessions */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-ink-800 flex items-center justify-between">
                  <span>Select Event Session *</span>
                  <span className="text-[11px] font-normal text-burgundy-700">Two fixed daily sessions available</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Morning Session */}
                  <button
                    type="button"
                    onClick={() => handleSessionChange('morning')}
                    aria-pressed={session === 'morning'}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      session === 'morning'
                        ? 'border-burgundy-700 bg-burgundy-50/60 shadow-sm ring-2 ring-burgundy-600/20'
                        : 'border-cream-300 bg-white hover:border-burgundy-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900">
                        8 AM - 3 PM
                      </span>
                    </div>
                    <div className="font-serif font-bold text-sm text-gray-900">Morning Session</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Ideal for weddings, ritual ceremonies, & traditional sadhya
                    </p>
                  </button>

                  {/* Evening Session */}
                  <button
                    type="button"
                    onClick={() => handleSessionChange('evening')}
                    aria-pressed={session === 'evening'}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      session === 'evening'
                        ? 'border-burgundy-700 bg-burgundy-50/60 shadow-sm ring-2 ring-burgundy-600/20'
                        : 'border-cream-300 bg-white hover:border-burgundy-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                        <Moon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100/80 text-indigo-900">
                        5 PM - 10 PM
                      </span>
                    </div>
                    <div className="font-serif font-bold text-sm text-gray-900">Evening Session</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Ideal for receptions, cultural programmes, & banquets
                    </p>
                  </button>

                  {/* Full Day */}
                  <button
                    type="button"
                    onClick={() => handleSessionChange('full_day')}
                    aria-pressed={session === 'full_day'}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      session === 'full_day'
                        ? 'border-burgundy-700 bg-burgundy-50/60 shadow-sm ring-2 ring-burgundy-600/20'
                        : 'border-cream-300 bg-white hover:border-burgundy-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100/80 text-rose-900">
                        8 AM - 10 PM
                      </span>
                    </div>
                    <div className="font-serif font-bold text-sm text-gray-900">Full Day Access</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Morning & evening combined with 3-5 PM turnaround buffer
                    </p>
                  </button>
                </div>
              </div>

              {/* Preferred Hall */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-ink-800">Booking Scope</label>
                <select
                  aria-label="Booking scope"
                  value={preferredHallId}
                  onChange={(e) => setPreferredHallId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="auditorium">Thekkanath Souparnika (Full Venue Auditorium - All Halls Included)</option>
                  {HALLS.filter((h) => h.id !== 'auditorium').map((h) => (
                    <option key={h.id} value={h.id}>
                      Individual Hall: {h.name} ({h.floor} · {h.airConditioned ? 'AC' : 'Non-AC'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Expected Headcount */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-ink-800">
                  Estimated Guest Count (Max 300 recommended) *
                </label>
                <input
                  type="number"
                  aria-label="Estimated guest count"
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
                    The full venue comfortably hosts gatherings of up to 300 guests with 40-50 dedicated on-site parking spaces.
                  </p>
                )}
              </div>
            </div>

            {/* Preferred Catering Section */}
            <div className="pt-4">
              <PreferredCaterersCard />
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
                  aria-label="Your full name"
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
                  aria-label="Mobile phone number"
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
                  aria-label="Email address, optional"
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

              {/* Referral Bonus Banner & Fields */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-burgundy-50/50 border border-burgundy-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-burgundy-100 text-burgundy-900 flex items-center justify-center">
                      <Gift className="w-4 h-4 text-burgundy-700" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Were you referred by a friend, vendor, or guest?</h4>
                      <p className="text-[11px] text-gray-500">
                        They are eligible for our venue referral appreciation incentive.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasReferrer}
                      onChange={(e) => setHasReferrer(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-700"></div>
                  </label>
                </div>

                {hasReferrer && (
                  <div className="pt-3 border-t border-burgundy-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">Referrer's Full Name *</label>
                      <input
                        type="text"
                        aria-label="Referrer's full name"
                        placeholder="e.g. Rahul Varma"
                        value={referrerName}
                        onChange={(e) => setReferrerName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border bg-white text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-burgundy-600 ${
                          errors.referrerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.referrerName && (
                        <p className="text-[10px] text-red-600">{errors.referrerName}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">Referrer's Mobile Phone *</label>
                      <input
                        type="tel"
                        aria-label="Referrer's mobile phone"
                        placeholder="e.g. 9446123456"
                        value={referrerPhone}
                        onChange={(e) => setReferrerPhone(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border bg-white text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-burgundy-600 ${
                          errors.referrerPhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.referrerPhone && (
                        <p className="text-[10px] text-red-600">{errors.referrerPhone}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">Referrer's Email / UPI (Optional)</label>
                      <input
                        type="text"
                        aria-label="Referrer's email or UPI, optional"
                        placeholder="e.g. rahul@example.com"
                        value={referrerEmail}
                        onChange={(e) => setReferrerEmail(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border bg-white text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-burgundy-600 ${
                          errors.referrerEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.referrerEmail && (
                        <p className="text-[10px] text-red-600">{errors.referrerEmail}</p>
                      )}
                    </div>

                    {/* Autocomplete Suggestions from repeat referrers */}
                    {(() => {
                      const query = (referrerName || referrerPhone).trim();
                      const matches = query ? searchReferrers(query, DEFAULT_REFERRERS) : [];
                      if (matches.length === 0) return null;
                      return (
                        <div className="sm:col-span-3 bg-white p-2.5 rounded-xl border border-burgundy-200 shadow-sm space-y-1">
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
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
                                className="px-2.5 py-1 rounded-lg bg-burgundy-50 hover:bg-burgundy-100 text-burgundy-900 text-xs border border-burgundy-200 text-left transition-colors flex items-center gap-1.5"
                              >
                                <span className="font-bold">{ref.name}</span>
                                <span className="text-[11px] text-gray-500">({ref.phone})</span>
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
                <label className="text-xs font-bold text-ink-800">
                  Special Requests / Setup Details (Optional)
                </label>
                <textarea
                  aria-label="Special requests or setup details, optional"
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
              {hasReferrer && referrerName && (
                <div className="sm:col-span-2 border-t border-cream-300 pt-2">
                  <span className="text-ink-500">Referred By:</span>
                  <p className="font-bold text-burgundy-900 text-sm mt-0.5">
                    {referrerName} (+91 {referrerPhone}){referrerEmail ? ` · ${referrerEmail}` : ''}
                  </p>
                </div>
              )}
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
