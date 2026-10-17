import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-cream-100 pt-16 pb-10 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-forest-900">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-800 border border-gold-500/80 flex items-center justify-center text-gold-400 font-serif font-bold text-lg">
                TS
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-white">Thekkanath Souparnika</h3>
                <p className="text-[10px] text-gold-400 uppercase tracking-widest">Hall & Events Venue</p>
              </div>
            </div>
            <p className="text-xs text-cream-300 leading-relaxed max-w-sm">
              Thoughtfully designed auditorium and events venue in Thrissur, Kerala. Featuring four distinct halls, air-conditioned comfort, solar hybrid power, and generous on-site parking.
            </p>
            <div className="pt-2">
              <Link
                to="/enquire"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gold-500 text-forest-950 hover:bg-gold-400 transition-colors"
              >
                <span>Make an Enquiry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Explore Venue
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-300">
              <li>
                <Link to="/halls" className="hover:text-gold-300 transition-colors">
                  Our Four Halls (Stage, Welcome, Dining, Open)
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-gold-300 transition-colors">
                  Facilities & Amenities
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold-300 transition-colors">
                  Photo Tour & Visual Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition-colors">
                  Location & Driving Directions
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs text-cream-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  Opposite RGLP School, Market Junction,<br />
                  Nellikunnu, Thrissur – 680005, Kerala
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${VENUE_INFO.phones[0]}`} className="hover:text-gold-300">
                    {VENUE_INFO.displayPhones[0]}
                  </a>
                  <a href={`tel:${VENUE_INFO.phones[1]}`} className="hover:text-gold-300">
                    {VENUE_INFO.displayPhones[1]}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${VENUE_INFO.email}`} className="hover:text-gold-300">
                  {VENUE_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Venue Info & Reservations */}
          <div className="bg-forest-900/60 p-4 rounded-xl border border-forest-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Celebrations & Enquiries</span>
            </div>
            <p className="text-[11px] text-cream-300 leading-relaxed">
              All hall spaces accommodate up to 100 guests each, and the venue is ideally suited for gatherings of up to 300 guests across coordinated areas. Rental packages, date availability, and arrangements are coordinated directly with our team.
            </p>
            <div className="pt-1">
              <Link
                to="/admin"
                className="text-[11px] text-gold-300 hover:text-white underline font-medium"
              >
                Access Staff Management Studio ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <div>
            © {new Date().getFullYear()} Thekkanath Souparnika · Hall & Events Venue. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Nellikunnu, Thrissur</span>
            <span>·</span>
            <span>Solar Hybrid Power</span>
            <span>·</span>
            <span>Water Authority Tested Water</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
