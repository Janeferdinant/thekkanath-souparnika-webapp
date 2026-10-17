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
    <div className="bg-white rounded-2xl p-6 border border-rose-200/60 shadow-subtle hover:border-burgundy-300 transition-all">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-rose-100">
        <div className="w-10 h-10 rounded-xl bg-burgundy-50 flex items-center justify-center text-burgundy-700">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-burgundy-900">
              Preferred Catering Partners
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300">
              <Award className="w-3 h-3 text-gold-700" />
              Verified
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Trusted catering partners familiar with our banquet dining layout and kitchen protocols
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PREFERRED_CATERERS.map((caterer, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 rounded-xl bg-ivory-50 border border-rose-100/80 hover:bg-white hover:shadow-sm transition"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-burgundy-700 mb-1">
                {caterer.specialty}
              </div>
              <h4 className="font-serif font-bold text-base text-gray-900 mb-1.5">{caterer.name}</h4>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{caterer.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {caterer.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-md border border-gray-200 text-gray-700"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-rose-100/60">
              <a
                href={`https://wa.me/91${caterer.phone}?text=Hello%20${encodeURIComponent(
                  caterer.name
                )}%2C%20I%20am%20planning%20an%20event%20at%20Thekkanath%20Souparnika%20and%20would%20like%20to%20discuss%20catering.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={`tel:+91${caterer.phone}`}
                className="inline-flex items-center justify-center p-2 rounded-lg text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:border-burgundy-600 hover:text-burgundy-700 transition"
                title={`Call ${caterer.name}`}
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
