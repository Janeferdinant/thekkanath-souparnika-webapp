import React, { useId, useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';
import { StorageService } from '../../lib/storage';
import { generateReference } from '../../lib/formatters';
import { PageHeader } from '../../components/public/PageHeader';
import { GlassSurface } from '../../glass/GlassSurface';

const INPUT =
  'w-full px-4 py-2.5 rounded-xl border border-brand-charcoal-600 bg-brand-ivory-50 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-burgundy-700';
const LABEL = 'block text-xs font-bold text-brand-charcoal-900';

const ICON_TILE = 'w-12 h-12 rounded-2xl bg-brand-burgundy-700 text-brand-champagne-300 flex items-center justify-center shrink-0 shadow-md';

export const ContactPage: React.FC = () => {
  const uid = useId();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleQuickContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    try {
      StorageService.createEnquiry({
        reference: generateReference('TS-ENQ'),
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: 'contact-form@thekkanath.com',
        eventType: 'Other',
        preferredDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '14:00',
        estimatedGuests: 50,
        specialRequests: message.trim(),
        consentGiven: true,
        status: 'new',
      });
      setError('');
      setSent(true);
    } catch {
      setError('Sorry, your message could not be sent. Please try again, or call us on the numbers above.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Find & Reach Us"
        title="Visit Thekkanath Souparnika"
        intro="Located right at Market Junction in Nellikunnu, Thrissur. You are welcome to visit anytime to walk through the halls and meet us in person."
      />

      <div className="surface-ivory py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <GlassSurface tone="light" elevation="raised" className="p-8 sm:p-10 space-y-6 border-brand-champagne-500">
              <h2 className="font-serif text-2xl font-light text-brand-charcoal-900 border-b border-brand-champagne-500 pb-3">Venue Contact Details</h2>

              <div className="space-y-5 text-sm text-brand-charcoal-900">
                <div className="flex items-start gap-4">
                  <div className={ICON_TILE}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-brand-charcoal-900 font-semibold">Address</strong>
                    <p className="text-xs text-brand-charcoal-600 mt-1 leading-relaxed">
                      Thekkanath Souparnika, Hall & Events Venue<br />
                      Opposite RGLP School, Market Junction<br />
                      Nellikunnu, Thrissur – 680005, Kerala, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={ICON_TILE}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-brand-charcoal-900 font-semibold">Telephone</strong>
                    <div className="flex flex-col text-xs text-brand-charcoal-600 mt-1">
                      <a href={`tel:${VENUE_INFO.phones[0]}`} className="inline-flex items-center min-h-[44px] hover:text-brand-burgundy-700 font-medium transition-colors">
                        +91 {VENUE_INFO.phones[0]} (Primary)
                      </a>
                      <a href={`tel:${VENUE_INFO.phones[1]}`} className="inline-flex items-center min-h-[44px] hover:text-brand-burgundy-700 font-medium transition-colors">
                        +91 {VENUE_INFO.phones[1]} (Secondary)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={ICON_TILE}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-brand-charcoal-900 font-semibold">Email</strong>
                    <a
                      href={`mailto:${VENUE_INFO.email}`}
                      className="inline-flex items-center min-h-[44px] text-xs text-brand-burgundy-700 hover:text-brand-burgundy-600 font-medium transition-colors"
                    >
                      {VENUE_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-champagne-500 flex flex-wrap gap-3">
                <a
                  href={VENUE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full text-xs font-semibold text-brand-burgundy-700 border border-brand-burgundy-700 hover:bg-brand-burgundy-700 hover:text-brand-ivory-100 transition-all"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={VENUE_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full text-xs font-semibold text-brand-ivory-100 bg-brand-burgundy-700 hover:bg-brand-burgundy-800 border border-brand-burgundy-700 shadow-md"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </GlassSurface>

            {/* Access Note Card */}
            <GlassSurface tone="dark" elevation="raised" className="p-6 text-xs space-y-2">
              <h2 className="font-serif font-light text-brand-champagne-300 text-base">Travel & Access Note</h2>
              <p className="leading-relaxed text-brand-ivory-muted">
                The venue is right at the Market Junction bus stop on the main PWD bus route in Nellikunnu, with quick driving routes to Thrissur town, the bypass, and National Highway 544.
              </p>
            </GlassSurface>
          </div>

          {/* Quick Message Form */}
          <GlassSurface tone="light" elevation="raised" className="p-8 sm:p-10 space-y-6 border-brand-champagne-500">
            <h2 className="font-serif text-2xl font-light text-brand-charcoal-900 border-b border-brand-champagne-500 pb-3">Send a Quick Note</h2>

            {sent ? (
              <div role="status" className="p-6 rounded-2xl bg-brand-ivory-200 border border-brand-champagne-500 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-brand-burgundy-700 mx-auto" />
                <h3 className="font-serif font-medium text-brand-charcoal-900 text-lg">Message Received</h3>
                <p className="text-xs text-brand-charcoal-600">Thank you for contacting us. Our management team will call or message you back promptly.</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full text-xs font-semibold text-brand-burgundy-700 border border-brand-burgundy-700 hover:bg-brand-burgundy-700 hover:text-brand-ivory-100 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickContact} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor={`${uid}-name`} className={LABEL}>
                    Your Name *
                  </label>
                  <input
                    id={`${uid}-name`}
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Anand Menon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={INPUT}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor={`${uid}-phone`} className={LABEL}>
                    Phone Number *
                  </label>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="e.g. 9847012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={INPUT}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor={`${uid}-message`} className={LABEL}>
                    Your Message or Question
                  </label>
                  <textarea
                    id={`${uid}-message`}
                    rows={4}
                    placeholder="Tell us what you would like to know about our venue, dates, or facilities..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={INPUT}
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full text-xs font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 border border-brand-champagne-400 shadow-md glass-highlight"
                >
                  <span>Send Message to Management</span>
                  <Send className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-brand-charcoal-600 text-center leading-relaxed">
                  By sending this note, you authorize our team to contact you via telephone or WhatsApp regarding your query.
                </p>
              </form>
            )}
          </GlassSurface>
        </div>
      </div>
    </div>
  );
};
