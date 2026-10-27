import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Calendar, Phone, MessageCircle } from 'lucide-react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { VENUE_INFO } from '../../data/venueData';
import { GlassPerformanceManager } from '../../glass/GlassPerformanceManager';
import { GlassSurface } from '../../glass/GlassSurface';

const DOCK_ITEM =
  'min-h-[44px] flex flex-col items-center justify-center py-1 rounded-full transition-all';
const DOCK_ACTIVE = 'text-brand-burgundy-900 font-bold bg-gradient-to-r from-brand-champagne-300 to-brand-champagne-500 shadow-sm';
const DOCK_IDLE = 'text-brand-ivory-muted hover:text-brand-ivory-100 hover:bg-white/5';

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <GlassPerformanceManager>
      <div className="public-luxury min-h-screen flex flex-col selection:bg-brand-champagne-500 selection:text-brand-burgundy-900 relative font-sans">
        {/* Strip + sticky glass navigation */}
        <PublicHeader />

        {/* Main content body */}
        <main className="flex-1 pb-24 lg:pb-0 relative z-10">
          <Outlet />
        </main>

        {/* Footer */}
        <PublicFooter />

        {/* Mobile Fixed Bottom Navigation Dock (>=44px touch targets) */}
        <GlassSurface
          as="nav"
          tone="dark"
          elevation="raised"
          aria-label="Mobile quick actions"
          className="glass-dock fixed bottom-2.5 inset-x-3 z-50 lg:hidden py-1 px-2.5"
        >
          <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
            <Link
              to="/halls"
              className={`${DOCK_ITEM} ${location.pathname === '/halls' ? DOCK_ACTIVE : DOCK_IDLE}`}
            >
              <Building2 className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Venue</span>
            </Link>

            <Link
              to="/halls#sessions"
              className={`${DOCK_ITEM} ${location.hash === '#sessions' ? DOCK_ACTIVE : DOCK_IDLE}`}
            >
              <Calendar className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Sessions</span>
            </Link>

            <Link
              to="/enquire"
              className={`${DOCK_ITEM} ${location.pathname.startsWith('/enquire') ? DOCK_ACTIVE : DOCK_IDLE}`}
            >
              <Calendar className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight font-medium">Enquire</span>
            </Link>

            <a href={`tel:${VENUE_INFO.phones[0]}`} className={`${DOCK_ITEM} ${DOCK_IDLE}`}>
              <Phone className="w-4 h-4 mb-0.5 text-brand-champagne-400" />
              <span className="text-[10px] tracking-tight">Call</span>
            </a>

            <a
              href={VENUE_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={`${DOCK_ITEM} text-emerald-400 hover:text-emerald-300 hover:bg-white/5`}
            >
              <MessageCircle className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight font-medium">WhatsApp</span>
            </a>
          </div>
        </GlassSurface>
      </div>
    </GlassPerformanceManager>
  );
};
