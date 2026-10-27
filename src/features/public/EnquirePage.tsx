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
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[rgba(226,184,178,0.3)] shadow-luxury text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E7CFAF]">
              Enquiry Received
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#F7EFE7]">
              Thank You, {submittedEnquiry.customerName}
            </h1>
            <p className="text-xs sm:text-sm text-[#CBB8B9] max-w-md mx-auto leading-relaxed">
              We have received your enquiry! Our team will check the calendar for your date and get in touch with you shortly.
            </p>
          </div>

          {/* Reference Card */}
          <div className="glass-control p-5 rounded-2xl border border-[rgba(226,184,178,0.25)] max-w-sm mx-auto flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-[#E7CFAF]">Enquiry Reference</span>
              <div className="font-mono text-lg font-bold text-[#F7EFE7]">
                {submittedEnquiry.reference}
              </div>
            </div>
            <button
              onClick={copyRefToClipboard}
              className="p-2.5 rounded-xl glass-control text-[#F7EFE7] hover:border-[rgba(226,184,178,0.4)] transition-colors"
              title="Copy Reference"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-[#e8c7bc]" />}
            </button>
          </div>

          {/* Next Steps Card */}
          <div className="glass-panel text-left text-[#F7EFE7] p-6 rounded-2xl space-y-3 border border-[rgba(226,184,178,0.22)]">
            <h4 className="font-serif text-base font-light text-[#E7CFAF]">What Happens Next?</h4>
            <ol className="list-decimal list-inside text-xs text-[#CBB8B9] space-y-1.5 leading-relaxed">
              <li>We will check our bookings calendar for your preferred date ({submittedEnquiry.preferredDate}).</li>
              <li>We will call or WhatsApp you at <strong className="text-[#F7EFE7]">+91 {submittedEnquiry.customerPhone}</strong> to talk through your plans.</li>
              <li>You are always welcome to visit the venue to walk through the halls in person.</li>
              <li>Once timing and arrangements are finalized together, your date will be reserved.</li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={`https://wa.me/918129764370?text=Hello%20Thekkanath%20Souparnika%2C%20I%20have%20submitted%20enquiry%20${submittedEnquiry.reference}%20for%20${submittedEnquiry.preferredDate}.`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="gold" size="md" className="glass-highlight" leftIcon={<MessageCircle className="w-4 h-4" />}>
                Message on WhatsApp
              </Button>
            </a>
            <Link to="/">
              <button className="px-5 py-2.5 rounded-full text-xs font-semibold glass-control text-[#F7EFE7] hover:border-[rgba(226,184,178,0.5)] transition-all">
                Return to Home Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#E7CFAF]">
          <Sparkles className="w-4 h-4 text-[#e8c7bc]" />
          <span>Plan Your Gathering</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F7EFE7]">
          Request a Booking Enquiry
        </h1>
        <p className="text-xs sm:text-sm text-[#CBB8B9] leading-relaxed">
          Tell us a little about your celebration. We will check date availability right away and get in touch with you.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs font-semibold">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            step === 1
              ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] border-[rgba(226,184,178,0.4)] shadow-md'
              : 'glass-control text-[#CBB8B9] border-[rgba(226,184,178,0.2)]'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/10 text-center text-xs flex items-center justify-center font-bold">
            1
          </span>
          <span className="hidden sm:inline">Event Details</span>
        </div>
        <span className="text-[#CBB8B9]/40">→</span>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            step === 2
              ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] border-[rgba(226,184,178,0.4)] shadow-md'
              : 'glass-control text-[#CBB8B9] border-[rgba(226,184,178,0.2)]'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/10 text-center text-xs flex items-center justify-center font-bold">
            2
          </span>
          <span className="hidden sm:inline">Contact Information</span>
        </div>
        <span className="text-[#CBB8B9]/40">→</span>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            step === 3
              ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] border-[rgba(226,184,178,0.4)] shadow-md'
              : 'glass-control text-[#CBB8B9] border-[rgba(226,184,178,0.2)]'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/10 text-center text-xs flex items-center justify-center font-bold">
            3
          </span>
          <span className="hidden sm:inline">Review & Submit</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[rgba(226,184,178,0.22)] shadow-luxury">
        {/* Step 1: Event Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="font-serif text-2xl font-light text-[#F7EFE7] border-b border-[rgba(226,184,178,0.15)] pb-3">
              Step 1: Event Details & Schedule
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E7CFAF]">Type of Event *</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(226,184,178,0.25)] bg-[#18070c]/90 text-xs text-[#F7EFE7] focus:outline-none focus:ring-2 focus:ring-[#e8c7bc]"
                >
                  <option value="Wedding & Reception" className="bg-[#240810] text-[#F7EFE7]">Wedding & Reception</option>
                  <option value="Ceremony / Ritual" className="bg-[#240810] text-[#F7EFE7]">Ceremony / Ritual (Engagement, Naming, etc.)</option>
                  <option value="Family Gathering" className="bg-[#240810] text-[#F7EFE7]">Family Gathering / Feast</option>
                  <option value="Seminar / Conference" className="bg-[#240810] text-[#F7EFE7]">Seminar / Conference</option>
                  <option value="Cultural Programme" className="bg-[#240810] text-[#F7EFE7]">Cultural Programme</option>
                  <option value="Birthday / Anniversary" className="bg-[#240810] text-[#F7EFE7]">Birthday / Anniversary</option>
                  <option value="Other" className="bg-[#240810] text-[#F7EFE7]">Other Event</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E7CFAF]">Preferred Event Date *</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#18070c]/90 text-xs text-[#F7EFE7] focus:outline-none focus:ring-2 focus:ring-[#e8c7bc] ${
                    errors.preferredDate ? 'border-red-400' : 'border-[rgba(226,184,178,0.25)]'
                  }`}
                />
                {errors.preferredDate && (
                  <p className="text-[11px] text-red-400">{errors.preferredDate}</p>
                )}
              </div>

              {/* Bookable Sessions */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-[#E7CFAF] flex items-center justify-between">
                  <span>Select Event Session *</span>
                  <span className="text-[11px] font-normal text-[#CBB8B9]">Two fixed daily sessions available</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Morning Session */}
                  <button
                    type="button"
                    onClick={() => handleSessionChange('morning')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      session === 'morning'
                        ? 'border-[#e8c7bc] bg-[#451323]/50 shadow-md ring-2 ring-[#e8c7bc]/30'
                        : 'glass-control border-[rgba(226,184,178,0.2)] hover:border-[rgba(226,184,178,0.4)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#240810] text-[#e8c7bc] border border-[rgba(226,184,178,0.2)] flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#18070c] text-[#E7CFAF] border border-[rgba(226,184,178,0.2)]">
                        8 AM - 3 PM
                      </span>
                    </div>
                    <div className="font-serif font-light text-sm text-[#F7EFE7]">Morning Session</div>
                    <p className="text-[11px] text-[#CBB8B9] mt-0.5">
                      Ideal for weddings, ritual ceremonies, & traditional sadhya
                    </p>
                  </button>

                  {/* Evening Session */}
                  <button
                    type="button"
                    onClick={() => handleSessionChange('evening')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      session === 'evening'
                        ? 'border-[#e8c7bc] bg-[#451323]/50 shadow-md ring-2 ring-[#e8c7bc]/30'
                        : 'glass-control border-[rgba(226,184,178,0.2)] hover:border-[rgba(226,184,178,0.4)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#240810] text-[#e8c7bc] border border-[rgba(226,184,178,0.2)] flex items-center justify-center">
                        <Moon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#18070c] text-[#E7CFAF] border border-[rgba(226,184,178,0.2)]">
                        5 PM - 10 PM
                      </span>
                    </div>
                    <div className="font-serif font-light text-sm text-[#F7EFE7]">Evening Session</div>
                    <p className="text-[11px] text-[#CBB8B9] mt-0.5">
                      Ideal for receptions, cultural programmes, & banquets
                    </p>
                  </button>

                  {/* Full Day */}
                  <button
                    type="button"
                    onClick={() => handleSessionChange('full_day')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      session === 'full_day'
                        ? 'border-[#e8c7bc] bg-[#451323]/50 shadow-md ring-2 ring-[#e8c7bc]/30'
                        : 'glass-control border-[rgba(226,184,178,0.2)] hover:border-[rgba(226,184,178,0.4)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#240810] text-[#e8c7bc] border border-[rgba(226,184,178,0.2)] flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#18070c] text-[#E7CFAF] border border-[rgba(226,184,178,0.2)]">
                        8 AM - 10 PM
                      </span>
                    </div>
                    <div className="font-serif font-light text-sm text-[#F7EFE7]">Full Day Access</div>
                    <p className="text-[11px] text-[#CBB8B9] mt-0.5">
                      Morning & evening combined with 3-5 PM turnaround buffer
                    </p>
                  </button>
                </div>
              </div>


              {/* Expected Headcount */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#E7CFAF]">
                  Expected Guests * (Ideal for 250 to 300 guests; capacity up to 400)
                </label>
                <input
                  type="number"
                  min="1"
                  max="400"
                  value={estimatedGuests}
                  onChange={(e) => setEstimatedGuests(parseInt(e.target.value, 10) || 0)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#18070c]/90 text-xs text-[#F7EFE7] focus:outline-none focus:ring-2 focus:ring-[#e8c7bc] ${
                    errors.estimatedGuests ? 'border-red-400' : 'border-[rgba(226,184,178,0.25)]'
                  }`}
                  placeholder="e.g. 250"
                />
                {errors.estimatedGuests && (
                  <p className="text-[11px] text-red-400">{errors.estimatedGuests}</p>
                )}
              </div>
            </div>

            {/* Preferred Catering Section */}
            <div className="pt-4">
              <PreferredCaterersCard />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="gold"
                size="md"
                className="glass-highlight"
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
            <h2 className="font-serif text-2xl font-light text-[#F7EFE7] border-b border-[rgba(226,184,178,0.15)] pb-3">
              Step 2: Contact Information & Special Requests
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E7CFAF]">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Nair"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc] ${
                    errors.customerName ? 'border-red-400' : 'border-[rgba(226,184,178,0.25)]'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-red-400">{errors.customerName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E7CFAF]">Mobile Phone (WhatsApp Preferred) *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9847012345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc] ${
                    errors.customerPhone ? 'border-red-400' : 'border-[rgba(226,184,178,0.25)]'
                  }`}
                />
                {errors.customerPhone ? (
                  <p className="text-[11px] text-red-400">{errors.customerPhone}</p>
                ) : (
                  <p className="text-[10px] text-[#CBB8B9]">10-digit Indian mobile number.</p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#E7CFAF]">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc] ${
                    errors.customerEmail ? 'border-red-400' : 'border-[rgba(226,184,178,0.25)]'
                  }`}
                />
                {errors.customerEmail && (
                  <p className="text-[11px] text-red-400">{errors.customerEmail}</p>
                )}
              </div>

              {/* Referral Bonus Banner & Fields */}
              <div className="sm:col-span-2 glass-panel p-5 rounded-2xl border border-[rgba(226,184,178,0.25)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#18070c] border border-[rgba(226,184,178,0.2)] text-[#e8c7bc] flex items-center justify-center">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F7EFE7]">Were you referred by a friend, vendor, or guest?</h4>
                      <p className="text-[11px] text-[#CBB8B9]">
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
                    <div className="w-11 h-6 bg-[#18070c] border border-[rgba(226,184,178,0.3)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e8c7bc] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A1B2E]"></div>
                  </label>
                </div>

                {hasReferrer && (
                  <div className="pt-3 border-t border-[rgba(226,184,178,0.15)] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#E7CFAF]">Referrer's Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Varma"
                        value={referrerName}
                        onChange={(e) => setReferrerName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc] ${
                          errors.referrerName ? 'border-red-400' : 'border-[rgba(226,184,178,0.25)]'
                        }`}
                      />
                      {errors.referrerName && (
                        <p className="text-[10px] text-red-400">{errors.referrerName}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#E7CFAF]">Referrer's Mobile Phone *</label>
                      <input
                        type="tel"
                        placeholder="e.g. 9446123456"
                        value={referrerPhone}
                        onChange={(e) => setReferrerPhone(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc] ${
                          errors.referrerPhone ? 'border-red-400' : 'border-[rgba(226,184,178,0.25)]'
                        }`}
                      />
                      {errors.referrerPhone && (
                        <p className="text-[10px] text-red-400">{errors.referrerPhone}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#E7CFAF]">Referrer's Email / UPI (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. rahul@example.com"
                        value={referrerEmail}
                        onChange={(e) => setReferrerEmail(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc] ${
                          errors.referrerEmail ? 'border-red-400' : 'border-[rgba(226,184,178,0.25)]'
                        }`}
                      />
                      {errors.referrerEmail && (
                        <p className="text-[10px] text-red-400">{errors.referrerEmail}</p>
                      )}
                    </div>

                    {/* Autocomplete Suggestions from repeat referrers */}
                    {(() => {
                      const query = (referrerName || referrerPhone).trim();
                      const matches = query ? searchReferrers(query, DEFAULT_REFERRERS) : [];
                      if (matches.length === 0) return null;
                      return (
                        <div className="sm:col-span-3 bg-[#18070c]/80 p-2.5 rounded-xl border border-[rgba(226,184,178,0.2)] shadow-sm space-y-1">
                          <span className="text-[10px] font-semibold text-[#E7CFAF] uppercase tracking-wider">
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
                                className="px-2.5 py-1 rounded-lg glass-control text-[#F7EFE7] text-xs border border-[rgba(226,184,178,0.25)] text-left transition-colors flex items-center gap-1.5 hover:border-[rgba(226,184,178,0.5)]"
                              >
                                <span className="font-bold">{ref.name}</span>
                                <span className="text-[11px] text-[#CBB8B9]">({ref.phone})</span>
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
                <label className="text-xs font-bold text-[#E7CFAF]">
                  Special Requests / Setup Details (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about stage setup, catering arrangements, dress-change room requests, etc. Note: requests require staff review and do not guarantee fulfillment."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(226,184,178,0.25)] bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[rgba(226,184,178,0.15)]">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-xs font-semibold glass-control text-[#F7EFE7] hover:border-[rgba(226,184,178,0.5)] transition-all inline-flex items-center gap-2"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="w-4 h-4 text-[#e8c7bc]" />
                <span>Back to Details</span>
              </button>
              <Button
                variant="gold"
                size="md"
                className="glass-highlight"
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
            <h2 className="font-serif text-2xl font-light text-[#F7EFE7] border-b border-[rgba(226,184,178,0.15)] pb-3">
              Step 3: Review Your Enquiry
            </h2>

            {/* Summary Review Card */}
            <div className="glass-panel p-6 rounded-2xl border border-[rgba(226,184,178,0.2)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#E7CFAF]">Event Type:</span>
                <p className="font-medium text-[#F7EFE7] text-sm mt-0.5">{eventType}</p>
              </div>
              <div>
                <span className="text-[#E7CFAF]">Preferred Date & Slot:</span>
                <p className="font-medium text-[#F7EFE7] text-sm mt-0.5">
                  {preferredDate} ({startTime} to {endTime})
                </p>
              </div>
              <div>
                <span className="text-[#E7CFAF]">Guest Headcount:</span>
                <p className="font-medium text-[#F7EFE7] text-sm mt-0.5">{estimatedGuests} guests</p>
              </div>
              <div>
                <span className="text-[#E7CFAF]">Customer Name:</span>
                <p className="font-medium text-[#F7EFE7] text-sm mt-0.5">{customerName}</p>
              </div>
              <div>
                <span className="text-[#E7CFAF]">Contact Number:</span>
                <p className="font-medium text-[#F7EFE7] text-sm mt-0.5">+91 {customerPhone}</p>
              </div>
              {hasReferrer && referrerName && (
                <div className="sm:col-span-2 border-t border-[rgba(226,184,178,0.15)] pt-2">
                  <span className="text-[#E7CFAF]">Referred By:</span>
                  <p className="font-medium text-[#F7EFE7] text-sm mt-0.5">
                    {referrerName} (+91 {referrerPhone}){referrerEmail ? ` · ${referrerEmail}` : ''}
                  </p>
                </div>
              )}
              {specialRequests && (
                <div className="sm:col-span-2 border-t border-[rgba(226,184,178,0.15)] pt-2">
                  <span className="text-[#E7CFAF]">Special Notes / Requirements:</span>
                  <p className="text-[#CBB8B9] mt-1">{specialRequests}</p>
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
                  className="w-4 h-4 mt-0.5 rounded text-[#5A1B2E] focus:ring-[#e8c7bc] border-[rgba(226,184,178,0.3)] bg-[#18070c]"
                />
                <span className="text-xs text-[#CBB8B9] leading-relaxed">
                  I give permission for the venue management of Thekkanath Souparnika to contact me via phone, WhatsApp, or email regarding date availability, hall tours, and quotations. I understand that submitting this enquiry does not reserve or lock the requested date. *
                </span>
              </label>
              {errors.consent && <p className="text-[11px] text-red-400">{errors.consent}</p>}
              {errors.form && <p className="text-[11px] text-red-400">{errors.form}</p>}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-[rgba(226,184,178,0.15)]">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full text-xs font-semibold glass-control text-[#F7EFE7] hover:border-[rgba(226,184,178,0.5)] transition-all inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-[#e8c7bc]" />
                <span>Back to Contact</span>
              </button>
              <Button
                variant="gold"
                size="lg"
                type="submit"
                className="glass-highlight"
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
