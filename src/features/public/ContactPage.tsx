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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E7CFAF]">Find & Reach Us</span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F7EFE7] tracking-tight leading-tight">
          Visit Thekkanath Souparnika
        </h1>
        <p className="text-sm sm:text-base text-[#CBB8B9] leading-relaxed">
          Located right at Market Junction in Nellikunnu, Thrissur. You are welcome to visit anytime to walk through the halls and meet us in person.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Contact Info Cards — Liquid Glass */}
        <div className="space-y-6">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[rgba(226,184,178,0.22)] shadow-luxury space-y-6">
            <h3 className="font-serif text-2xl font-light text-[#F7EFE7] border-b border-[rgba(226,184,178,0.15)] pb-3">
              Venue Contact Details
            </h3>

            <div className="space-y-5 text-sm text-[#F7EFE7]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#451323] to-[#18070c] text-[#e8c7bc] border border-[rgba(226,184,178,0.3)] flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-[#F7EFE7] font-semibold">Address</strong>
                  <p className="text-xs text-[#CBB8B9] mt-1 leading-relaxed">
                    Thekkanath Souparnika, Hall & Events Venue<br />
                    Opposite RGLP School, Market Junction<br />
                    Nellikunnu, Thrissur – 680005, Kerala, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#451323] to-[#18070c] text-[#e8c7bc] border border-[rgba(226,184,178,0.3)] flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-[#F7EFE7] font-semibold">Telephone</strong>
                  <div className="flex flex-col gap-1 text-xs text-[#CBB8B9] mt-1">
                    <a href={`tel:${VENUE_INFO.phones[0]}`} className="hover:text-[#F7EFE7] font-medium transition-colors">
                      +91 {VENUE_INFO.phones[0]} (Primary)
                    </a>
                    <a href={`tel:${VENUE_INFO.phones[1]}`} className="hover:text-[#F7EFE7] font-medium transition-colors">
                      +91 {VENUE_INFO.phones[1]} (Secondary)
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#451323] to-[#18070c] text-[#e8c7bc] border border-[rgba(226,184,178,0.3)] flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-[#F7EFE7] font-semibold">Email</strong>
                  <a
                    href={`mailto:${VENUE_INFO.email}`}
                    className="text-xs text-[#E7CFAF] hover:text-[#F7EFE7] font-medium block mt-1 transition-colors"
                  >
                    {VENUE_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(226,184,178,0.15)] flex flex-wrap gap-3">
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold glass-control text-[#F7EFE7] hover:border-[rgba(226,184,178,0.5)] transition-all"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#e8c7bc]" />
              </a>

              <a
                href={VENUE_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="gold" size="md" className="glass-highlight" leftIcon={<MessageCircle className="w-3.5 h-3.5" />}>
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Access Note Card */}
          <div className="glass-panel p-6 rounded-3xl border border-[rgba(226,184,178,0.22)] shadow-subtle text-xs text-[#CBB8B9] space-y-2">
            <h4 className="font-serif font-light text-[#E7CFAF] text-base">Travel & Access Note</h4>
            <p className="leading-relaxed">
              The venue is right at the Market Junction bus stop on the main PWD bus route in Nellikunnu, with quick driving routes to Thrissur town, the bypass, and National Highway 544.
            </p>
          </div>
        </div>

        {/* Quick Message Form — Liquid Glass */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[rgba(226,184,178,0.22)] shadow-luxury space-y-6">
          <h3 className="font-serif text-2xl font-light text-[#F7EFE7] border-b border-[rgba(226,184,178,0.15)] pb-3">
            Send a Quick Note
          </h3>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-serif font-light text-emerald-200 text-lg">Message Received</h4>
              <p className="text-xs text-emerald-300/80">
                Thank you for contacting us. Our management team will call or message you back promptly.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleQuickContact} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E7CFAF]">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Menon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[rgba(226,184,178,0.25)] bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E7CFAF]">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9847012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[rgba(226,184,178,0.25)] bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E7CFAF]">Your Message or Question</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you would like to know about our venue, dates, or facilities..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[rgba(226,184,178,0.25)] bg-[#18070c]/90 text-xs text-[#F7EFE7] placeholder-[#CBB8B9]/40 focus:outline-none focus:ring-2 focus:ring-[#e8c7bc]"
                />
              </div>

              <Button
                variant="gold"
                size="md"
                type="submit"
                className="w-full glass-highlight shadow-md"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message to Management
              </Button>

              <p className="text-[11px] text-[#CBB8B9]/80 text-center leading-relaxed">
                By sending this note, you authorize our team to contact you via telephone or WhatsApp regarding your query.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
