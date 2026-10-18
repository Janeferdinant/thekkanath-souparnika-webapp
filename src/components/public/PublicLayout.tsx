import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Calendar, Phone, MessageCircle } from 'lucide-react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { VENUE_INFO } from '../../data/venueData';

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="public-luxury min-h-screen flex flex-col selection:bg-rose-700 selection:text-white relative font-sans">
      {/* Main sticky luxury navigation header */}
      <PublicHeader />

      {/* Main content body */}
      <main className="flex-1 pb-24 lg:pb-0 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <PublicFooter />

      {/* Mobile Fixed Bottom Navigation Dock (>=44px touch targets) */}
      <nav
        aria-label="Mobile quick actions"
        className="fixed bottom-2.5 inset-x-3 z-50 lg:hidden rounded-full bg-[#18070c]/85 backdrop-blur-xl border border-[rgba(226,184,178,0.24)] shadow-luxury py-1 px-2.5"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <Link
            to="/halls"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-full transition-all ${
              location.pathname === '/halls'
                ? 'text-[#2c0c15] font-bold bg-gradient-to-r from-[#e8c7bc] to-[#c58e91] shadow-sm'
                : 'text-[rgba(203,184,185,0.85)] hover:text-[#f7efe7]'
            }`}
          >
            <Building2 className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Venue</span>
          </Link>

          <Link
            to="/halls#sessions"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-full transition-all ${
              location.hash === '#sessions'
                ? 'text-[#2c0c15] font-bold bg-gradient-to-r from-[#e8c7bc] to-[#c58e91] shadow-sm'
                : 'text-[rgba(203,184,185,0.85)] hover:text-[#f7efe7]'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5 text-[#e7cfaf]" />
            <span className="text-[10px] tracking-tight">Sessions</span>
          </Link>

          <Link
            to="/enquire"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-full transition-all ${
              location.pathname.startsWith('/enquire')
                ? 'text-[#2c0c15] font-bold bg-gradient-to-r from-[#e8c7bc] to-[#c58e91] shadow-sm'
                : 'text-[rgba(203,184,185,0.85)] hover:text-[#f7efe7]'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5 text-[#c58e91]" />
            <span className="text-[10px] tracking-tight font-medium">Enquire</span>
          </Link>

          <a
            href={`tel:${VENUE_INFO.phones[0]}`}
            className="min-h-[44px] flex flex-col items-center justify-center py-1 rounded-full text-[rgba(203,184,185,0.85)] hover:text-[#f7efe7] hover:bg-white/5 transition-all"
          >
            <Phone className="w-4 h-4 mb-0.5 text-[#e2b8b2]" />
            <span className="text-[10px] tracking-tight">Call</span>
          </a>

          <a
            href={VENUE_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] flex flex-col items-center justify-center py-1 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-white/5 transition-all"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight font-medium">WhatsApp</span>
          </a>
        </div>
      </nav>
    </div>
  );
};
