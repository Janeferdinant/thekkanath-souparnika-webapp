import React, { useRef, useState } from 'react';
import { Eye, ShieldCheck } from 'lucide-react';
import { Lightbox } from '../../components/public/Lightbox';
import { PageHeader } from '../../components/public/PageHeader';
import { ResponsivePicture, imageKeyForSrc } from '../../components/public/ResponsivePicture';
import { GlassCard } from '../../glass/GlassCard';
import { RefractiveOverlay } from '../../glass/RefractiveOverlay';

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

type Filter = 'all' | 'halls' | 'facilities' | 'exterior';

const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Photos (7)' },
  { id: 'halls', label: 'Event Halls (4)' },
  { id: 'facilities', label: 'Facilities & Amenities (2)' },
  { id: 'exterior', label: 'Exterior & Entrance (1)' },
];

/** One gallery card: the photo opens the lightbox, the category chip sits on the photo. */
const GalleryCard: React.FC<{ item: GalleryItem; onOpen: (trigger: HTMLElement) => void }> = ({ item, onOpen }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <GlassCard tone="light" className="group overflow-hidden flex flex-col border-brand-champagne-500">
      <div className="relative rounded-t-[inherit] overflow-hidden">
        <button
          type="button"
          onClick={(e) => onOpen(e.currentTarget)}
          className="lens-hover relative block w-full h-64 overflow-hidden bg-brand-burgundy-900 text-left"
        >
          <ResponsivePicture
            image={imageKeyForSrc(item.src)!}
            alt={item.title}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="block w-full h-full"
            imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            imgRef={imgRef}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-brand-burgundy-950 opacity-0 group-hover:opacity-60 group-focus-within:opacity-60 transition-opacity flex items-center justify-center"
          >
            <span className="p-3.5 rounded-full text-brand-champagne-300 border border-brand-champagne-500">
              <Eye className="w-5 h-5" />
            </span>
          </div>
        </button>
        <RefractiveOverlay
          imageRef={imgRef}
          className="absolute top-3 left-3 pointer-events-none text-brand-champagne-300 text-[11px] font-bold px-3 py-1 rounded-full"
        >
          {item.categoryLabel}
        </RefractiveOverlay>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
        <h2 className="font-serif text-xl font-light text-brand-charcoal-900 group-hover:text-brand-burgundy-700 transition-colors">{item.title}</h2>
        <p className="text-xs text-brand-charcoal-600 leading-relaxed">{item.description}</p>
      </div>
    </GlassCard>
  );
};

export const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const lightboxTrigger = useRef<HTMLElement | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Real Venue Photographs"
        icon={<ShieldCheck className="w-4 h-4" />}
        title="Visual Tour & Photo Gallery"
        intro="Browse real photographs of all four halls, the dining area, staircase, wash facilities, and exterior compound. Every picture shows the venue as it actually is."
      />

      <div className="surface-ivory py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Tabs */}
          <div role="group" aria-label="Photo categories" className="flex flex-wrap items-center gap-2.5 border-b border-brand-champagne-500 pb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={filter === tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  setActiveIdx(null);
                }}
                className={`px-4 min-h-[44px] rounded-full text-xs font-semibold transition-all border ${
                  filter === tab.id
                    ? 'bg-brand-burgundy-700 text-brand-ivory-100 border-brand-burgundy-700 shadow-md'
                    : 'text-brand-burgundy-700 border-brand-burgundy-700 hover:bg-brand-ivory-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                onOpen={(trigger) => {
                  lightboxTrigger.current = trigger;
                  setActiveIdx(idx);
                }}
              />
            ))}
          </div>
        </div>
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
