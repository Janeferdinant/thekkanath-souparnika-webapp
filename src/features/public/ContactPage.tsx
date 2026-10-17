import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';
import { StorageService } from '../../lib/storage';
import { generateReference } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleQuickContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

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

    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-gold-700">Find & Reach Us</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900 leading-tight">
          Visit Thekkanath Souparnika
        </h1>
        <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
          Conveniently located at Market Junction in Nellikunnu, Thrissur. We welcome site inspections and in-person discussions by appointment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-cream-50 border border-cream-200 shadow-subtle space-y-6">
            <h3 className="font-serif text-2xl font-bold text-forest-900 border-b border-cream-200 pb-3">
              Venue Contact Details
            </h3>

            <div className="space-y-5 text-sm text-ink-800">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-forest-950 font-bold">Address</strong>
                  <p className="text-xs text-ink-600 mt-0.5 leading-relaxed">
                    Thekkanath Souparnika, Hall & Events Venue<br />
                    Opposite RGLP School, Market Junction<br />
                    Nellikunnu, Thrissur – 680005, Kerala, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-forest-950 font-bold">Telephone</strong>
                  <div className="flex flex-col gap-1 text-xs text-ink-700 mt-0.5">
                    <a href={`tel:${VENUE_INFO.phones[0]}`} className="hover:text-forest-900 font-medium">
                      +91 {VENUE_INFO.phones[0]} (Primary)
                    </a>
                    <a href={`tel:${VENUE_INFO.phones[1]}`} className="hover:text-forest-900 font-medium">
                      +91 {VENUE_INFO.phones[1]} (Secondary)
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-forest-950 font-bold">Email</strong>
                  <a
                    href={`mailto:${VENUE_INFO.email}`}
                    className="text-xs text-forest-800 hover:text-gold-700 font-medium block mt-0.5"
                  >
                    {VENUE_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200 flex flex-wrap gap-3">
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-forest-800 text-white hover:bg-forest-900 transition-colors shadow-sm"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={VENUE_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-gold-500 text-forest-950 hover:bg-gold-400 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Access Note Card */}
          <div className="p-6 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-ink-700 space-y-2">
            <h4 className="font-serif font-bold text-forest-950 text-base">Travel & Access Note</h4>
            <p className="leading-relaxed">
              The venue is situated directly on the PWD bus route with a stop at Market Junction in Nellikunnu. Highway access connects smoothly to Thrissur town centre, Paliyekkara bypass, and National Highway 544.
            </p>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="p-8 rounded-3xl bg-cream-50 border border-cream-200 shadow-luxury space-y-6">
          <h3 className="font-serif text-2xl font-bold text-forest-900 border-b border-cream-200 pb-3">
            Send a Quick Note
          </h3>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-emerald-950 text-lg">Message Received</h4>
              <p className="text-xs text-emerald-800">
                Thank you for contacting us. Our management team will call or message you back shortly.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleQuickContact} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Menon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9847012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-800">Your Message or Question</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you would like to know about our venue, dates, or facilities..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                className="w-full"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message to Management
              </Button>

              <p className="text-[10px] text-ink-500 text-center leading-relaxed">
                By sending this note, you authorize our team to contact you via telephone or WhatsApp regarding your query.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
