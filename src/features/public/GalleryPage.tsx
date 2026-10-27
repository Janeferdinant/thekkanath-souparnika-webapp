import React, { useRef, useState } from 'react';
import { Eye, ShieldCheck } from 'lucide-react';
import { Lightbox } from '../../components/public/Lightbox';
import { ResponsivePicture, imageKeyForSrc } from '../../components/public/ResponsivePicture';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: 'halls' | 'facilities' | 'exterior';
  categoryLabel: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'stage-hall',
    src: '/assets/venue/venue-000.jpg',
    title: 'Stage Hall — Raised Carpeted Stage & Cushioned Seating',
    category: 'halls',
    categoryLabel: 'Event Halls',
    description: 'Ground floor air-conditioned hall with 100 cushioned seats arranged, dedicated stage, and soft lighting.',
  },
  {
    id: 'welcome-hall',
    src: '/assets/venue/venue-001.jpg',
    title: 'Welcome Hall — Front Glass Entrance & Side Seating',
    category: 'halls',
    categoryLabel: 'Event Halls',
    description: 'Front hall on the ground floor with glass doors, air conditioning, and 100 cushioned seats arranged on both sides.',
  },
  {
    id: 'dining-hall',
    src: '/assets/venue/venue-002.jpg',
    title: 'Dining Hall — Banquet Tables & Tree Outlook',
    category: 'halls',
    categoryLabel: 'Event Halls',
    description: 'First floor air-conditioned dining area with 100 seats in one sitting, ideal for traditional Kerala Sadhya and wedding feasts.',
  },
  {
    id: 'open-hall',
    src: '/assets/venue/venue-003.jpg',
    title: 'Open Hall — Polished Marble Flooring & Airflow Fans',
    category: 'halls',
    categoryLabel: 'Event Halls',
    description: 'Bright open hall with 100 seats arranged, polished marble-finish flooring, ceiling fans, and three exhaust fans.',
  },
  {
    id: 'wash-area',
    src: '/assets/venue/venue-004.jpg',
    title: 'Wash Area — Long Row of Basins with Mirrors',
    category: 'facilities',
    categoryLabel: 'Amenities',
    description: 'Spacious dedicated wash area with natural light and ventilation for dining guests.',
  },
  {
    id: 'grand-staircase',
    src: '/assets/venue/venue-005.jpg',
    title: 'Grand Staircase — Glass Railings & Safety Reel',
    category: 'facilities',
    categoryLabel: 'Amenities',
    description: 'Wide architectural staircase connecting floors, equipped with glass railings and a fire hose reel.',
  },
  {
    id: 'venue-exterior',
    src: '/assets/venue/venue-006.jpg',
    title: 'Thekkanath Souparnika — Building Facade & Compound',
    category: 'exterior',
    categoryLabel: 'Exterior & Access',
    description: 'Front building exterior situated at Nellikunnu Market Junction on the PWD bus route.',
  },
];

export const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'halls' | 'facilities' | 'exterior'>('all');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const lightboxTrigger = useRef<HTMLElement | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E7CFAF]">
          <ShieldCheck className="w-4 h-4 text-[#e8c7bc]" />
          <span>Real Venue Photographs</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F7EFE7] tracking-tight leading-tight">
          Visual Tour & Photo Gallery
        </h1>
        <p className="text-sm sm:text-base text-[#CBB8B9] leading-relaxed">
          Browse real photographs of all four halls, the dining area, staircase, wash facilities, and exterior compound. Every picture shows the venue as it actually is.
        </p>
      </div>

      {/* Category Tabs — Liquid Glass */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[rgba(226,184,178,0.15)] pb-4">
        {[
          { id: 'all', label: 'All Photos (7)' },
          { id: 'halls', label: 'Event Halls (4)' },
          { id: 'facilities', label: 'Facilities & Amenities (2)' },
          { id: 'exterior', label: 'Exterior & Entrance (1)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setFilter(tab.id as any);
              setActiveIdx(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === tab.id
                ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] border border-[rgba(226,184,178,0.4)] shadow-md'
                : 'glass-control text-[#CBB8B9] hover:text-[#F7EFE7] border border-[rgba(226,184,178,0.2)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid — Liquid Glass Cards with Lens Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className="group glass-panel rounded-3xl overflow-hidden border border-[rgba(226,184,178,0.22)] hover:border-[rgba(226,184,178,0.45)] transition-all duration-300 flex flex-col hover:-translate-y-1"
          >
            <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                lightboxTrigger.current = e.currentTarget;
                setActiveIdx(idx);
              }}
              className="lens-hover relative block w-full h-64 overflow-hidden bg-[#18070c] text-left"
            >
              <ResponsivePicture
                image={imageKeyForSrc(item.src)!}
                alt={item.title}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="block w-full h-full"
                imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#18070c]/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span className="p-3.5 rounded-full glass-control text-[#e8c7bc] border border-[rgba(226,184,178,0.4)] shadow-xl">
                  <Eye className="w-5 h-5" />
                </span>
              </div>
            </button>
              <div className="absolute top-3 left-3 pointer-events-none glass-control text-[#E7CFAF] text-[11px] font-bold px-3 py-1 rounded-full border border-[rgba(226,184,178,0.3)] shadow-md">
                {item.categoryLabel}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
              <h3 className="font-serif text-xl font-light text-[#F7EFE7] group-hover:text-[#E7CFAF] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#CBB8B9] leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shared photo lightbox */}
      <Lightbox
        photos={filteredItems.map((i) => ({ src: i.src, title: i.title, description: i.description }))}
        index={activeIdx}
        onIndexChange={setActiveIdx}
        returnFocusRef={lightboxTrigger}
      />
    </div>
  );
};
