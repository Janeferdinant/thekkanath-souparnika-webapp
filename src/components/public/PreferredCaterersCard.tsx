import React from 'react';
import { Utensils, MessageCircle, Phone, Award } from 'lucide-react';

export interface CatererPartner {
  name: string;
  specialty: string;
  phone: string;
  description: string;
  highlights: string[];
}

export const PREFERRED_CATERERS: CatererPartner[] = [
  {
    name: 'Sadhya Mandiram Caterers',
    specialty: 'Traditional Kerala Sadhya & Feast',
    phone: '9847123456',
    description: 'Specialists in authentic 26-item traditional wedding sadhyas with ceremonial leaf service.',
    highlights: ['26-Item Traditional Sadhya', 'Special Payasam Selection', 'Experienced Head Chefs'],
  },
  {
    name: 'Royal Heritage Banquets & Buffet',
    specialty: 'Multi-Cuisine Buffet & Live Counters',
    phone: '9446789012',
    description: 'North Indian, South Indian, and Continental buffet dining with live high-tea appam & dosa counters.',
    highlights: ['Live Counters', 'Continental & Indian Buffet', 'Elegant Chafing Presentation'],
  },
  {
    name: 'Thrissur Spice Craft',
    specialty: 'High-Tea, Receptions & Snacks',
    phone: '8129764370',
    description: 'Tailored refreshment packages for engagements, cultural programmes, seminars, and intimate gatherings.',
    highlights: ['High-Tea Delicacies', 'Welcome Drinks & Mocktails', 'Compact Custom Menus'],
  },
];

export const PreferredCaterersCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-[rgba(226,184,178,0.22)] shadow-subtle transition-all">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[rgba(226,184,178,0.15)]">
        <div className="w-10 h-10 rounded-xl bg-[#18070c] border border-[rgba(226,184,178,0.25)] flex items-center justify-center text-[#e8c7bc]">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-light text-[#F7EFE7]">
              Preferred Catering Partners
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full glass-control text-[#E7CFAF] border border-[rgba(226,184,178,0.3)]">
              <Award className="w-3 h-3 text-[#e8c7bc]" />
              Verified
            </span>
          </div>
          <p className="text-xs text-[#CBB8B9]">
            Trusted catering partners familiar with our banquet dining layout and kitchen protocols
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PREFERRED_CATERERS.map((caterer, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 rounded-xl bg-[#18070c]/60 border border-[rgba(226,184,178,0.2)] hover:border-[rgba(226,184,178,0.4)] transition"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#E7CFAF] mb-1">
                {caterer.specialty}
              </div>
              <h4 className="font-serif font-light text-base text-[#F7EFE7] mb-1.5">{caterer.name}</h4>
              <p className="text-xs text-[#CBB8B9] mb-3 line-clamp-2">{caterer.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {caterer.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium bg-[#240810]/80 px-2 py-0.5 rounded-md border border-[rgba(226,184,178,0.2)] text-[#F7EFE7]"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[rgba(226,184,178,0.15)]">
              <a
                href={`https://wa.me/91${caterer.phone}?text=Hello%20${encodeURIComponent(
                  caterer.name
                )}%2C%20I%20am%20planning%20an%20event%20at%20Thekkanath%20Souparnika%20and%20would%20like%20to%20discuss%20catering.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={`tel:+91${caterer.phone}`}
                className="inline-flex items-center justify-center p-2 rounded-lg text-xs font-semibold glass-control text-[#F7EFE7] border border-[rgba(226,184,178,0.25)] hover:border-[rgba(226,184,178,0.5)] transition"
                title={`Call ${caterer.name}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#e8c7bc]" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
