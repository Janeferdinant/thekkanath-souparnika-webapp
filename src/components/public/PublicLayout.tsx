import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Calendar, Phone, MessageCircle } from 'lucide-react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { AmbientParticles } from './AmbientParticles';
import { VENUE_INFO } from '../../data/venueData';

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-ink-900 selection:bg-gold-500 selection:text-white relative">
      {/* Subtle luxury ambient bokeh canvas */}
      <AmbientParticles />

      {/* Main header */}
      <PublicHeader />

      {/* Main content body */}
      <main className="flex-1 pb-20 lg:pb-0 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <PublicFooter />

      {/* Mobile Fixed Bottom Navigation Dock */}
      <nav
        aria-label="Mobile quick actions"
        className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 backdrop-blur-lg border-t border-rose-100/90 shadow-luxury py-2 px-2"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <Link
            to="/halls"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              location.pathname === '/halls'
                ? 'text-burgundy-950 font-bold bg-burgundy-50'
                : 'text-gray-600 hover:text-burgundy-900'
            }`}
          >
            <Building2 className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Venue</span>
          </Link>

          <Link
            to="/halls#sessions"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              location.hash === '#sessions'
                ? 'text-burgundy-950 font-bold bg-burgundy-50'
                : 'text-gray-600 hover:text-burgundy-900'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5 text-amber-600" />
            <span className="text-[10px] tracking-tight">Sessions</span>
          </Link>

          <Link
            to="/enquire"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              location.pathname.startsWith('/enquire')
                ? 'text-burgundy-950 font-bold bg-burgundy-50'
                : 'text-gray-600 hover:text-burgundy-900'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5 text-gold-600" />
            <span className="text-[10px] tracking-tight font-medium">Enquire</span>
          </Link>

          <a
            href={`tel:${VENUE_INFO.phones[0]}`}
            className="flex flex-col items-center justify-center py-1 rounded-xl text-gray-600 hover:text-burgundy-900 hover:bg-burgundy-50 transition-colors"
          >
            <Phone className="w-4 h-4 mb-0.5 text-burgundy-700" />
            <span className="text-[10px] tracking-tight">Call</span>
          </a>

          <a
            href={VENUE_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center py-1 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight font-medium">WhatsApp</span>
          </a>
        </div>
      </nav>
    </div>
  );
};
