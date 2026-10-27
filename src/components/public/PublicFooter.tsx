import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#18070c] text-[#f7efe7] pt-16 pb-12 border-t border-[rgba(226,184,178,0.22)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[rgba(226,184,178,0.16)]">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/brand/logo_gold.png"
                alt="Thekkanath Souparnika Crest"
                className="w-12 h-12 object-contain logo-gold-glow"
              />
              <div>
                <h3 className="font-serif font-medium text-xl text-[#f7efe7]">Thekkanath Souparnika</h3>
                <p className="text-[10px] text-[#e7cfaf] uppercase tracking-widest font-semibold">{VENUE_INFO.descriptor}</p>
              </div>
            </div>
            <p className="text-xs text-[rgba(203,184,185,0.85)] leading-relaxed max-w-sm">
              A welcoming celebration venue at Market Junction, Nellikunnu, Thrissur, with four connected halls under one roof.
            </p>
            <div className="pt-2">
              <Link
                to="/enquire"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#e8c7bc] via-[#d8aba2] to-[#c58e91] text-[#2c0c15] hover:from-[#f3ded8] hover:to-[#d4a098] transition-all shadow-md"
              >
                <span>Make an Enquiry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#e7cfaf] mb-4">
              Explore Venue
            </h4>
            <ul className="space-y-2.5 text-xs text-[rgba(203,184,185,0.85)]">
              <li>
                <Link to="/halls" className="hover:text-[#e7cfaf] transition-colors">
                  Our Four Halls (Stage, Welcome, Dining, Open)
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-[#e7cfaf] transition-colors">
                  Facilities & Amenities
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#e7cfaf] transition-colors">
                  Photo Tour & Visual Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#e7cfaf] transition-colors">
                  Location & Driving Directions
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#e7cfaf] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#e7cfaf] mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs text-[rgba(203,184,185,0.85)]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#e2b8b2] shrink-0 mt-0.5" />
                <span>
                  Opposite RGLP School, Market Junction,<br />
                  Nellikunnu, Thrissur – 680005, Kerala
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e2b8b2] shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${VENUE_INFO.phones[0]}`} className="hover:text-[#e7cfaf]">
                    {VENUE_INFO.displayPhones[0]} (Ferdinant N.)
                  </a>
                  <a href={`tel:${VENUE_INFO.phones[1]}`} className="hover:text-[#e7cfaf]">
                    {VENUE_INFO.displayPhones[1]}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e2b8b2] shrink-0" />
                <a href={`mailto:${VENUE_INFO.email}`} className="hover:text-[#e7cfaf]">
                  {VENUE_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Venue Info & Reservations */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(226,184,178,0.22)] bg-[#240810]/75 backdrop-blur-md text-xs space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2 text-[#e7cfaf] font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Celebrations & Enquiries</span>
            </div>
            <p className="text-[11px] text-[rgba(203,184,185,0.85)] leading-relaxed">
              We host only one event at a time. When you reserve Thekkanath Souparnika, your family gets private use of all four halls.
            </p>
            <div className="pt-1">
              <Link
                to="/admin"
                className="text-[11px] text-[#e2b8b2] hover:text-[#f7efe7] underline font-medium"
              >
                Access Staff Management Studio ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[rgba(203,184,185,0.7)]">
          <div>
            © {new Date().getFullYear()} Thekkanath Souparnika · {VENUE_INFO.descriptor}. All rights reserved.
          </div>
          <span className="text-[11px]">Nellikunnu, Thrissur</span>
        </div>
      </div>
    </footer>
  );
};
