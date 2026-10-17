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
      <div className="bg-forest-900 text-cream-100 text-xs py-2 px-4 border-b border-forest-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-cream-200">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              Nellikunnu Market Junction, Thrissur
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-cream-300">
              · On PWD Bus Route · Highway Access
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
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-200 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full bg-forest-800 border-2 border-gold-500/80 flex items-center justify-center text-gold-400 font-serif font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
              TS
            </div>
            <div>
              <div className="font-serif font-bold text-xl sm:text-2xl text-forest-900 tracking-tight leading-none">
                Thekkanath Souparnika
              </div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-gold-700 mt-1">
                Hall & Events Venue · Thrissur
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink-700">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 relative ${
                  isActive(link.path)
                    ? 'text-forest-900 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-500'
                    : 'hover:text-forest-800'
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
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-forest-800 text-cream-50 hover:bg-forest-900 shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>Check Date / Enquire</span>
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-ink-600 hover:text-forest-900 hover:bg-cream-200 border border-cream-300 transition-colors"
              title="Staff & Management Portal"
            >
              <Lock className="w-3.5 h-3.5 text-gold-600" />
              <span className="hidden sm:inline">Staff Studio</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-forest-900 hover:bg-cream-200 focus:outline-none"
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
