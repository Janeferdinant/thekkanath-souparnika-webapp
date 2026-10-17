import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Calendar,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';
import { isDemoMode } from '../../lib/storage';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Our Halls', path: '/halls' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Photo Tour', path: '/gallery' },
    { label: 'Find Us', path: '/contact' },
    { label: 'FAQs', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Contact Strip */}
      <div className="bg-burgundy-950 text-cream-100 text-xs py-2 px-4 border-b border-burgundy-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-cream-200">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              Nellikunnu Market Junction, Thrissur
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-cream-300">
              · On PWD Bus Route · 40–50 Dedicated Parking
            </span>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <a
              href={`tel:${VENUE_INFO.phones[0]}`}
              className="inline-flex items-center gap-1.5 hover:text-gold-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>{VENUE_INFO.displayPhones[0]}</span>
            </a>
            <a
              href={`mailto:${VENUE_INFO.email}`}
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-gold-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              <span>{VENUE_INFO.email}</span>
            </a>
            <a
              href={VENUE_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-full overflow-hidden p-1 bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-wine-950 border border-gold-400/50 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src="/assets/brand/burgundy-lotus-emblem.png"
                alt="Thekkanath Souparnika Lotus Crest"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <div className="font-serif font-bold text-xl sm:text-2xl text-burgundy-950 tracking-tight leading-none group-hover:text-burgundy-800 transition-colors">
                Thekkanath Souparnika
              </div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-gold-700 mt-1 flex items-center gap-1.5">
                <span>Auditorium & Events Venue</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500 font-normal">Thrissur</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 relative ${
                  isActive(link.path)
                    ? 'text-burgundy-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gold-500 after:to-rose-400'
                    : 'hover:text-burgundy-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/enquire"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-burgundy-900 text-white hover:bg-burgundy-950 shadow-sm border border-gold-500/30 transition-all hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>Check Date / Enquire</span>
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-gray-600 hover:text-burgundy-950 hover:bg-burgundy-50 border border-gray-200 transition-colors"
              title="Staff & Management Portal"
            >
              <Lock className="w-3.5 h-3.5 text-gold-600" />
              <span className="hidden sm:inline">Staff Studio</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-burgundy-950 hover:bg-burgundy-50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-cream-200 bg-cream-50 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-forest-800 text-cream-50 font-bold'
                    : 'text-ink-800 hover:bg-cream-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-cream-200 flex flex-col gap-2">
              <Link
                to="/enquire"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-3 rounded-full text-sm font-bold bg-forest-800 text-cream-50 shadow-sm"
              >
                Check Date / Send Enquiry ↗
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-full text-xs font-semibold text-ink-700 bg-cream-200"
              >
                Staff Management Studio ↗
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Demo Mode Notification Badge */}
      {isDemoMode() && (
        <div className="bg-amber-100/90 text-amber-900 text-[11px] py-1 px-4 text-center font-medium border-b border-amber-200 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
          <span>
            <strong>Interactive Demo Mode:</strong> Database credentials not yet set in .env. Enquiries, bookings, and dashboard actions persist locally in your browser.
          </span>
        </div>
      )}
    </>
  );
};
