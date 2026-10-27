import React from 'react';
import { Utensils, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';

const TILE = 'p-4 rounded-xl bg-brand-ivory-50 border border-brand-champagne-500 space-y-2';
const TILE_EYEBROW = 'text-xs font-bold uppercase tracking-wider text-brand-bronze-700';
const CHIP = 'text-[10px] font-medium bg-brand-ivory-200 px-2 py-0.5 rounded-md border border-brand-champagne-500 text-brand-charcoal-900 inline-flex items-center gap-1';

export const PreferredCaterersCard: React.FC = () => {
  return (
    <div className="rounded-2xl p-6 border border-brand-champagne-500 bg-brand-ivory-200 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-brand-champagne-500">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-burgundy-700 flex items-center justify-center text-brand-champagne-300">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg font-medium text-brand-charcoal-900">
              Preferred Catering Partners & Dining Arrangements
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-burgundy-700 text-brand-champagne-300">
              Open Policy
            </span>
          </div>
          <p className="text-xs text-brand-charcoal-600">
            Complete kitchen, pantry staging, and batch dining arrangements for your event
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={TILE}>
          <div className={TILE_EYEBROW}>Your Caterer of Choice</div>
          <h4 className="font-serif font-medium text-base text-brand-charcoal-900">Full Freedom of Choice</h4>
          <p className="text-xs text-brand-charcoal-600 leading-relaxed">
            You are completely free to bring your trusted caterer for Traditional Kerala Sadhya, multi-cuisine banquets, or high-tea counters.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className={CHIP}>
              <CheckCircle2 className="w-3 h-3 text-brand-burgundy-700" /> No Royalty Fee
            </span>
            <span className={CHIP}>
              <CheckCircle2 className="w-3 h-3 text-brand-burgundy-700" /> Kitchen Access
            </span>
          </div>
        </div>

        <div className={TILE}>
          <div className={TILE_EYEBROW}>Air-Conditioned Dining</div>
          <h4 className="font-serif font-medium text-base text-brand-charcoal-900">100 Seats in One Sitting</h4>
          <p className="text-xs text-brand-charcoal-600 leading-relaxed">
            Dedicated first-floor banquet hall accommodating 100 guests per sitting with wide stainless tables, direct wash area, and service aisles.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className={CHIP}>
              <CheckCircle2 className="w-3 h-3 text-brand-burgundy-700" /> Multi-Batch Service
            </span>
            <span className={CHIP}>
              <CheckCircle2 className="w-3 h-3 text-brand-burgundy-700" /> AC Comfort
            </span>
          </div>
        </div>

        <div className={`${TILE} flex flex-col justify-between`}>
          <div>
            <div className={TILE_EYEBROW}>Need Recommendations?</div>
            <h4 className="font-serif font-medium text-base text-brand-charcoal-900">Local Partner Network</h4>
            <p className="text-xs text-brand-charcoal-600 leading-relaxed">
              Our venue management can connect you with proven local Thrissur caterers specializing in Traditional Kerala Sadhya, non-veg banquets, and high-tea.
            </p>
          </div>
          <div className="pt-3 border-t border-brand-champagne-500 flex items-center gap-2">
            <a
              href={`https://wa.me/91${VENUE_INFO.phones[0]}?text=Hello%20Thekkanath%20Souparnika%2C%20I%20would%20like%20guidance%20on%20catering%20arrangements%20for%20my%20event.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Ask on WhatsApp
            </a>
            <a
              href={`tel:+91${VENUE_INFO.phones[0]}`}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-xs font-semibold text-brand-burgundy-700 border border-brand-burgundy-700 hover:bg-brand-burgundy-700 hover:text-brand-ivory-100 transition"
              aria-label="Call venue management"
              title="Call Management"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
