import React, { useState, useEffect, useRef } from 'react';
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
import { isDemoMode } from '../../lib/demoMode';
import { GlassNavigation } from '../../glass/GlassNavigation';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Our Halls', path: '/halls' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Photo Tour', path: '/gallery' },
  { label: 'Find Us', path: '/contact' },
  { label: 'FAQs', path: '/faq' },
];

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Escape closes the mobile drawer and hands focus back to the button that opened it
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Demo Mode Notification Badge */}
      {isDemoMode() && (
        <div className="bg-brand-burgundy-800 text-brand-champagne-300 text-[11px] py-1 px-4 text-center font-medium border-b border-brand-burgundy-700 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-champagne-500 animate-pulse"></span>
          <span>
            <strong>Interactive Demo Mode:</strong> Database credentials not set in .env. Enquiries, bookings, and operations persist locally in your browser.
          </span>
        </div>
      )}

      {/* Top Essential Venue Strip */}
      <div className="public-strip bg-brand-burgundy-950 text-brand-ivory-muted text-[11px] py-1.5 px-4 border-b border-brand-burgundy-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-brand-ivory-100 font-medium">
              <MapPin className="w-3.5 h-3.5 text-brand-champagne-400" />
              Nellikunnu Market Junction, Thrissur
            </span>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <a
              href={`tel:${VENUE_INFO.phones[0]}`}
              className="inline-flex items-center gap-1.5 min-h-[28px] hover:text-brand-champagne-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-champagne-400" />
              <span>{VENUE_INFO.displayPhones[0]}</span>
            </a>
            <a
              href={`mailto:${VENUE_INFO.email}`}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[28px] hover:text-brand-champagne-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-brand-champagne-400" />
              <span>{VENUE_INFO.email}</span>
            </a>
            <a
              href={VENUE_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[28px] text-brand-champagne-300 hover:text-brand-ivory-100 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Glass Navigation */}
      <GlassNavigation heroSentinelId={isHome ? 'hero-sentinel' : undefined}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Editorial Typography */}
          <Link to="/" className="flex items-center gap-3.5 group min-h-[44px]">
            <img
              src="/assets/brand/logo_gold.png"
              alt="Thekkanath Souparnika Lotus Emblem"
              className="w-11 h-11 object-contain logo-gold-glow"
            />
            <div>
              <div className="font-serif font-medium text-xl sm:text-2xl text-brand-ivory-100 tracking-tight leading-none whitespace-nowrap group-hover:text-brand-champagne-300 transition-colors">
                Thekkanath Souparnika
              </div>
              <div className="text-[9px] tracking-[0.18em] uppercase font-semibold text-brand-champagne-400 mt-1 flex items-center gap-1.5">
                <span>{VENUE_INFO.descriptor}</span>
                <span className="text-brand-champagne-500">·</span>
                <span className="text-brand-ivory-muted font-normal">Thrissur</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="Main"
            className="hidden xl:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-brand-ivory-muted"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`transition-colors py-3 relative ${
                  isActive(link.path)
                    ? 'text-brand-ivory-100 font-semibold after:absolute after:bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:bg-brand-champagne-500'
                    : 'hover:text-brand-champagne-300'
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
              className="hidden sm:inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-full text-xs font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 hover:from-brand-champagne-300 hover:to-brand-champagne-400 shadow-luxury border border-brand-champagne-400 transition-all hover:scale-[1.02] glass-highlight"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Check Date / Enquire</span>
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 rounded-full text-xs font-medium text-brand-ivory-muted hover:text-brand-ivory-100 bg-white/5 hover:bg-white/10 border border-brand-champagne-500 transition-colors"
              title="Staff & Management Portal"
            >
              <Lock className="w-3.5 h-3.5 text-brand-champagne-400" />
              <span className="hidden sm:inline">Staff Studio</span>
              <span className="sm:hidden sr-only">Staff Studio</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              ref={toggleRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl text-brand-ivory-100 hover:bg-white/10"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav"
            data-testid="mobile-nav"
            className="xl:hidden border-t border-brand-burgundy-700 bg-brand-burgundy-950 px-5 pt-4 pb-7 space-y-2.5 shadow-2xl"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`min-h-[44px] flex items-center px-4 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-brand-burgundy-700 text-brand-ivory-100 font-bold border border-brand-champagne-500'
                    : 'text-brand-ivory-muted hover:bg-white/5 hover:text-brand-ivory-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-brand-burgundy-700 flex flex-col gap-2.5">
              <Link
                to="/enquire"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] inline-flex items-center justify-center text-center px-4 rounded-full text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-brand-champagne-300 to-brand-champagne-500 text-brand-burgundy-900 shadow-md"
              >
                Check Date / Send Enquiry ↗
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] inline-flex items-center justify-center text-center px-4 rounded-full text-xs font-semibold text-brand-ivory-muted bg-white/5 border border-brand-champagne-500 hover:bg-white/10"
              >
                Staff Management Studio ↗
              </Link>
            </div>
          </div>
        )}
      </GlassNavigation>
    </>
  );
};
