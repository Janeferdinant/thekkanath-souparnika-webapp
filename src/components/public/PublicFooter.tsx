import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';
import { GlassSurface } from '../../glass/GlassSurface';

const FOOTER_LINK =
  'inline-flex items-center min-h-[44px] text-brand-ivory-muted hover:text-brand-champagne-300 transition-colors';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="surface-burgundy pt-16 pb-12 border-t border-brand-champagne-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-burgundy-700">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/brand/logo_gold.png"
                alt="Thekkanath Souparnika Crest"
                className="w-12 h-12 object-contain logo-gold-glow"
              />
              <div>
                <h3 className="font-serif font-medium text-xl text-brand-ivory-100">Thekkanath Souparnika</h3>
                <p className="text-[10px] text-brand-champagne-300 uppercase tracking-widest font-semibold">{VENUE_INFO.descriptor}</p>
              </div>
            </div>
            <p className="text-xs text-brand-ivory-muted leading-relaxed max-w-sm">
              A welcoming celebration venue at Market Junction, Nellikunnu, Thrissur, with four connected halls under one roof.
            </p>
            <div className="pt-2">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 text-brand-burgundy-900 border border-brand-champagne-400 shadow-md hover:scale-[1.02] transition-all"
              >
                <span>Make an Enquiry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <nav aria-label="Explore the venue">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-champagne-300 mb-3">Explore Venue</h4>
            <ul className="text-xs">
              <li>
                <Link to="/halls" className={FOOTER_LINK}>
                  Our Four Halls (Stage, Welcome, Dining, Open)
                </Link>
              </li>
              <li>
                <Link to="/facilities" className={FOOTER_LINK}>
                  Facilities & Amenities
                </Link>
              </li>
              <li>
                <Link to="/gallery" className={FOOTER_LINK}>
                  Photo Tour & Visual Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className={FOOTER_LINK}>
                  Location & Driving Directions
                </Link>
              </li>
              <li>
                <Link to="/faq" className={FOOTER_LINK}>
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </nav>

          {/* Col 3: Direct Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-champagne-300 mb-4">Direct Contact</h4>
            <div className="space-y-3 text-xs text-brand-ivory-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-champagne-400 shrink-0 mt-0.5" />
                <span>
                  Opposite RGLP School, Market Junction,<br />
                  Nellikunnu, Thrissur – 680005, Kerala
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-champagne-400 shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${VENUE_INFO.phones[0]}`} className="min-h-[24px] hover:text-brand-champagne-300">
                    {VENUE_INFO.displayPhones[0]} (Ferdinant N.)
                  </a>
                  <a href={`tel:${VENUE_INFO.phones[1]}`} className="min-h-[24px] hover:text-brand-champagne-300">
                    {VENUE_INFO.displayPhones[1]}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-champagne-400 shrink-0" />
                <a href={`mailto:${VENUE_INFO.email}`} className="hover:text-brand-champagne-300">
                  {VENUE_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Venue Info & Reservations */}
          <GlassSurface tone="dark" elevation="raised" className="p-5 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-brand-champagne-300 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Celebrations & Enquiries</span>
            </div>
            <p className="text-[11px] text-brand-ivory-muted leading-relaxed">
              We host only one event at a time. When you reserve Thekkanath Souparnika, your family gets private use of all four halls.
            </p>
            <div className="pt-1">
              <Link
                to="/admin"
                className="inline-flex items-center min-h-[44px] text-[11px] text-brand-champagne-300 hover:text-brand-ivory-100 underline font-medium"
              >
                Access Staff Management Studio ↗
              </Link>
            </div>
          </GlassSurface>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-ivory-muted">
          <div>
            © {new Date().getFullYear()} Thekkanath Souparnika · {VENUE_INFO.descriptor}. All rights reserved.
          </div>
          <span className="text-[11px]">Nellikunnu, Thrissur</span>
        </div>
      </div>
    </footer>
  );
};
