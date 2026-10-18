import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';
import { StorageService } from '../../lib/storage';
import { generateReference } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { isValidIndianPhone, normalizeIndianPhone } from '../../lib/formatters';
import { VenueImage } from '../../components/public/VenueImage';
import { VENUE_MEDIA } from '../../data/venueMedia';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [estimatedGuests, setEstimatedGuests] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleQuickContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !isValidIndianPhone(phone) || !message.trim() || (estimatedGuests !== '' && (Number(estimatedGuests) < 1 || Number(estimatedGuests) > 300)) || !consentGiven) {
      setError('Please add your name, a valid 10-digit phone, a message, and contact consent. If you enter a guest count, use 1–300.');
      return;
    }
    setError('');

    StorageService.createEnquiry({
      reference: generateReference('TS-ENQ'),
      customerName: name.trim(),
      customerPhone: normalizeIndianPhone(phone),
      customerEmail: '',
      eventType: 'Other',
      preferredDate,
      estimatedGuests: estimatedGuests === '' ? 0 : Number(estimatedGuests),
      specialRequests: message.trim(),
      consentGiven,
      status: 'new',
    });

    setSent(true);
  };

  return (
    <div className="lux-legacy max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700">Find & Reach Us</span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-burgundy-950 tracking-tight leading-tight">
          Visit Thekkanath Souparnika
        </h1>
        <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
          Conveniently located at Market Junction in Nellikunnu, Thrissur. We welcome site inspections and in-person discussions by appointment.
        </p>
      </div>

      <figure className="lux-contact-banner"><VenueImage photo={VENUE_MEDIA[6]} /><figcaption>Building frontage · Thekkanath Souparnika, Nellikunnu</figcaption></figure>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Contact Info Cards — Liquid Glass */}
        <div className="space-y-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/80 shadow-luxury space-y-6">
            <h3 className="font-serif text-2xl font-bold text-burgundy-950 border-b border-rose-100 pb-3">
              Venue Contact Details
            </h3>

            <div className="space-y-5 text-sm text-ink-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burgundy-900 to-wine-950 text-gold-300 border border-gold-400/30 flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-burgundy-950 font-bold">Address</strong>
                  <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                    Thekkanath Souparnika, Hall & Events Venue<br />
                    Opposite RGLP School, Market Junction<br />
                    Nellikunnu, Thrissur – 680005, Kerala, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burgundy-900 to-wine-950 text-gold-300 border border-gold-400/30 flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-burgundy-950 font-bold">Telephone</strong>
                  <div className="flex flex-col gap-1 text-xs text-ink-700 mt-1">
                    <a href={`tel:${VENUE_INFO.phones[0]}`} className="hover:text-burgundy-900 font-medium">
                      +91 {VENUE_INFO.phones[0]} (Primary)
                    </a>
                    <a href={`tel:${VENUE_INFO.phones[1]}`} className="hover:text-burgundy-900 font-medium">
                      +91 {VENUE_INFO.phones[1]} (Secondary)
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burgundy-900 to-wine-950 text-gold-300 border border-gold-400/30 flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-burgundy-950 font-bold">Email</strong>
                  <a
                    href={`mailto:${VENUE_INFO.email}`}
                    className="text-xs text-burgundy-800 hover:text-rose-700 font-medium block mt-1"
                  >
                    {VENUE_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-rose-100 flex flex-wrap gap-3">
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-burgundy-900 to-wine-900 text-white hover:from-burgundy-950 hover:to-wine-950 transition-all shadow-md hover:scale-[1.02]"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={VENUE_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-400 via-gold-500 to-rose-400 text-burgundy-950 hover:from-gold-300 hover:to-rose-300 transition-all shadow-md hover:scale-[1.02]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Access Note Card */}
          <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/80 shadow-subtle text-xs text-ink-700 space-y-2">
            <h4 className="font-serif font-bold text-burgundy-950 text-base">Travel & Access Note</h4>
            <p className="leading-relaxed">
              The venue is situated directly on the PWD bus route with a stop at Market Junction in Nellikunnu. Highway access connects smoothly to Thrissur town centre, Paliyekkara bypass, and National Highway 544.
            </p>
          </div>
        </div>

        {/* Quick Message Form — Liquid Glass */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/80 shadow-luxury space-y-6">
          <h3 className="font-serif text-2xl font-bold text-burgundy-950 border-b border-rose-100 pb-3">
            Send a Quick Note
          </h3>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-emerald-950 text-lg">Message Saved</h4>
              <p className="text-xs text-emerald-800">
                Your message is saved in this browser. Send it to the venue team using one of the links below.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a className="lux-button lux-button-primary" href={`mailto:${VENUE_INFO.email}?subject=${encodeURIComponent('Venue question from ' + name)}&body=${encodeURIComponent(`${message.trim()}\n\n${name.trim()}\n${normalizeIndianPhone(phone)}`)}`}>Send by email</a>
                <a className="lux-button lux-button-outline" href={`${VENUE_INFO.whatsappUrl.split('?')[0]}?text=${encodeURIComponent(`${message.trim()}\n\n${name.trim()}\n${normalizeIndianPhone(phone)}`)}`} target="_blank" rel="noreferrer">Send by WhatsApp</a>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleQuickContact} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-burgundy-950">Your Name *</label>
                <input
                  type="text"
                  aria-label="Your name"
                  required
                  placeholder="e.g. Anand Menon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200/80 bg-white/90 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-burgundy-950">Phone Number *</label>
                <input
                  type="tel"
                  aria-label="Phone number"
                  required
                  placeholder="e.g. 9847012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200/80 bg-white/90 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-burgundy-950">Your Message or Question *</label>
                <textarea
                  aria-label="Your message or question"
                  required
                  rows={4}
                  placeholder="Tell us what you would like to know about our venue, dates, or facilities..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200/80 bg-white/90 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label htmlFor="quick-date" className="text-xs font-bold text-burgundy-950">Preferred Event Date (optional)</label><input id="quick-date" type="date" min={new Date().toISOString().split('T')[0]} value={preferredDate} onChange={e => setPreferredDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-rose-200/80" /></div>
                <div className="space-y-1.5"><label htmlFor="quick-guests" className="text-xs font-bold text-burgundy-950">Estimated Guests (optional)</label><input id="quick-guests" type="number" min="1" max="300" value={estimatedGuests} onChange={e => setEstimatedGuests(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-rose-200/80" /></div>
              </div>
              <label className="flex items-start gap-3 text-xs text-ink-700"><input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} required className="mt-0.5" /><span>I agree to be contacted by the venue team about this enquiry.</span></label>
              {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}

              <Button
                variant="primary"
                size="md"
                type="submit"
                className="w-full shadow-md"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message to Management
              </Button>

              <p className="text-[11px] text-rose-900/70 text-center leading-relaxed">This form saves a record in this browser. Please contact the venue directly to send your message. No date is reserved by this form.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
