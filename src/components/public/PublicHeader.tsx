import React, { useState, useEffect } from 'react';
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

  // Close mobile drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Essential Venue Strip */}
      <div className="bg-[#100408]/90 text-[rgba(203,184,185,0.9)] text-[11px] py-1.5 px-4 border-b border-[rgba(226,184,178,0.18)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[#f7efe7]/90 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#e7cfaf]" />
              Nellikunnu Market Junction, Thrissur
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[rgba(203,184,185,0.7)]">
              · On PWD Bus Route · 40–50 Compound Parking
            </span>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <a
              href={`tel:${VENUE_INFO.phones[0]}`}
              className="inline-flex items-center gap-1.5 hover:text-[#e7cfaf] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#e2b8b2]" />
              <span>{VENUE_INFO.displayPhones[0]}</span>
            </a>
            <a
              href={`mailto:${VENUE_INFO.email}`}
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-[#e7cfaf] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#e2b8b2]" />
              <span>{VENUE_INFO.email}</span>
            </a>
            <a
              href={VENUE_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#e7cfaf] hover:text-white font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Luxury Glass Navigation */}
      <header className="sticky top-0 z-40 bg-[#18070c]/80 backdrop-blur-xl border-b border-[rgba(226,184,178,0.22)] shadow-[0_12px_36px_rgba(0,0,0,0.28)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Editorial Typography */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-full overflow-hidden p-1 bg-gradient-to-br from-[#451323] via-[#2f0b16] to-[#18070c] border border-[rgba(226,184,178,0.38)] shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src="/assets/brand/lotus-emblem-burgundy.png"
                alt="Thekkanath Souparnika Lotus Emblem"
                className="w-full h-full object-contain filter drop-shadow"
                onError={(e) => {
                  // Fallback to ivory crest if burgundy lotus asset not found
                  (e.target as HTMLImageElement).src = '/assets/brand/lotus-crest-ivory-on-burgundy.png';
                }}
              />
            </div>
            <div>
              <div className="font-serif font-medium text-xl sm:text-2xl text-[#f7efe7] tracking-tight leading-none group-hover:text-[#e7cfaf] transition-colors">
                Thekkanath Souparnika
              </div>
              <div className="text-[9px] tracking-[0.18em] uppercase font-semibold text-[#e2b8b2] mt-1 flex items-center gap-1.5">
                <span>Auditorium & Events Venue</span>
                <span className="text-[rgba(226,184,178,0.4)]">·</span>
                <span className="text-[rgba(203,184,185,0.8)] font-normal">Thrissur</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-[rgba(203,184,185,0.9)]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 relative ${
                  isActive(link.path)
                    ? 'text-[#f7efe7] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#e7cfaf] after:to-[#c58e91]'
                    : 'hover:text-[#e7cfaf]'
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
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#2c0c15] bg-gradient-to-r from-[#e8c7bc] via-[#d8aba2] to-[#c58e91] hover:from-[#f3ded8] hover:to-[#d4a098] shadow-luxury border border-[rgba(226,184,178,0.5)] transition-all hover:scale-[1.02] glass-highlight"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Check Date / Enquire</span>
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-[rgba(203,184,185,0.85)] hover:text-[#f7efe7] bg-white/5 hover:bg-white/10 border border-[rgba(226,184,178,0.22)] transition-colors"
              title="Staff & Management Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#e7cfaf]" />
              <span className="hidden sm:inline">Staff Studio</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#f7efe7] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#e7cfaf]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[rgba(226,184,178,0.22)] bg-[#18070c]/95 backdrop-blur-2xl px-5 pt-4 pb-7 space-y-2.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center px-4 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-[#451323] to-[#2f0b16] text-[#f7efe7] font-bold border border-[rgba(226,184,178,0.3)] shadow-sm'
                    : 'text-[rgba(203,184,185,0.9)] hover:bg-white/5 hover:text-[#f7efe7]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[rgba(226,184,178,0.22)] flex flex-col gap-2.5">
              <Link
                to="/enquire"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-3 rounded-full text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-[#e8c7bc] to-[#c58e91] text-[#2c0c15] shadow-md"
              >
                Check Date / Send Enquiry ↗
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-full text-xs font-semibold text-[rgba(203,184,185,0.9)] bg-white/5 border border-[rgba(226,184,178,0.22)] hover:bg-white/10"
              >
                Staff Management Studio ↗
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Demo Mode Notification Badge */}
      {isDemoMode() && (
        <div className="bg-[#2f0b16]/90 text-[#e7cfaf] text-[11px] py-1 px-4 text-center font-medium border-b border-[rgba(226,184,178,0.2)] flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c58e91] animate-pulse"></span>
          <span>
            <strong>Interactive Demo Mode:</strong> Database credentials not set in .env. Enquiries, bookings, and operations persist locally in your browser.
          </span>
        </div>
      )}
    </>
  );
};
