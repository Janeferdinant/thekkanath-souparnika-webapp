import React from 'react';
import { Utensils, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';

export const PreferredCaterersCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-[rgba(226,184,178,0.22)] shadow-subtle transition-all space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-[rgba(226,184,178,0.15)]">
        <div className="w-10 h-10 rounded-xl bg-[#18070c] border border-[rgba(226,184,178,0.25)] flex items-center justify-center text-[#e8c7bc]">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-light text-[#F7EFE7]">
              Preferred Catering Partners & Dining Arrangements
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full glass-control text-[#E7CFAF] border border-[rgba(226,184,178,0.3)]">
              Open Policy
            </span>
          </div>
          <p className="text-xs text-[#CBB8B9]">
            Complete kitchen, pantry staging, and batch dining arrangements for your event
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#18070c]/60 border border-[rgba(226,184,178,0.2)] space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#E7CFAF]">
            Your Caterer of Choice
          </div>
          <h4 className="font-serif font-light text-base text-[#F7EFE7]">Full Freedom of Choice</h4>
          <p className="text-xs text-[#CBB8B9] leading-relaxed">
            You are completely free to bring your trusted caterer for Traditional Kerala Sadhya, multi-cuisine banquets, or high-tea counters.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] font-medium bg-[#240810]/80 px-2 py-0.5 rounded-md border border-[rgba(226,184,178,0.2)] text-[#F7EFE7] inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#e8c7bc]" /> No Royalty Fee
            </span>
            <span className="text-[10px] font-medium bg-[#240810]/80 px-2 py-0.5 rounded-md border border-[rgba(226,184,178,0.2)] text-[#F7EFE7] inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#e8c7bc]" /> Kitchen Access
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#18070c]/60 border border-[rgba(226,184,178,0.2)] space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#E7CFAF]">
            Air-Conditioned Dining
          </div>
          <h4 className="font-serif font-light text-base text-[#F7EFE7]">100 Seats in One Sitting</h4>
          <p className="text-xs text-[#CBB8B9] leading-relaxed">
            Dedicated first-floor banquet hall accommodating 100 guests per sitting with wide stainless tables, direct wash area, and service aisles.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] font-medium bg-[#240810]/80 px-2 py-0.5 rounded-md border border-[rgba(226,184,178,0.2)] text-[#F7EFE7] inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#e8c7bc]" /> 250–300+ in Batches
            </span>
            <span className="text-[10px] font-medium bg-[#240810]/80 px-2 py-0.5 rounded-md border border-[rgba(226,184,178,0.2)] text-[#F7EFE7] inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#e8c7bc]" /> AC Comfort
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#18070c]/60 border border-[rgba(226,184,178,0.2)] space-y-2 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#E7CFAF]">
              Need Recommendations?
            </div>
            <h4 className="font-serif font-light text-base text-[#F7EFE7]">Local Partner Network</h4>
            <p className="text-xs text-[#CBB8B9] leading-relaxed">
              Our venue management can connect you with proven local Thrissur caterers specializing in Traditional Kerala Sadhya, non-veg banquets, and high-tea.
            </p>
          </div>
          <div className="pt-3 border-t border-[rgba(226,184,178,0.15)] flex items-center gap-2">
            <a
              href={`https://wa.me/91${VENUE_INFO.phones[0]}?text=Hello%20Thekkanath%20Souparnika%2C%20I%20would%20like%20guidance%20on%20catering%20arrangements%20for%20my%20event.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Ask on WhatsApp
            </a>
            <a
              href={`tel:+91${VENUE_INFO.phones[0]}`}
              className="inline-flex items-center justify-center p-2 rounded-lg text-xs font-semibold glass-control text-[#F7EFE7] border border-[rgba(226,184,178,0.25)] hover:border-[rgba(226,184,178,0.5)] transition"
              title="Call Management"
            >
              <Phone className="w-3.5 h-3.5 text-[#e8c7bc]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
