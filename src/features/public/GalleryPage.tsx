import React, { useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, X, ShieldCheck } from 'lucide-react';

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

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, filteredItems.length]);

  const nextPhoto = () => {
    if (activeIdx === null) return;
    setActiveIdx((activeIdx + 1) % filteredItems.length);
  };

  const prevPhoto = () => {
    if (activeIdx === null) return;
    setActiveIdx((activeIdx - 1 + filteredItems.length) % filteredItems.length);
  };

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
            onClick={() => setActiveIdx(idx)}
            className="group glass-panel rounded-3xl overflow-hidden border border-[rgba(226,184,178,0.22)] hover:border-[rgba(226,184,178,0.45)] cursor-pointer transition-all duration-300 flex flex-col hover:-translate-y-1"
          >
            <div className="lens-hover relative h-64 overflow-hidden bg-[#18070c]">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 glass-control text-[#E7CFAF] text-[11px] font-bold px-3 py-1 rounded-full border border-[rgba(226,184,178,0.3)] shadow-md">
                {item.categoryLabel}
              </div>
              <div className="absolute inset-0 bg-[#18070c]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-3.5 rounded-full glass-control text-[#e8c7bc] border border-[rgba(226,184,178,0.4)] shadow-xl">
                  <Eye className="w-5 h-5" />
                </span>
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

      {/* Fullscreen Lightbox Modal — Wine Glass & Gold */}
      {activeIdx !== null && filteredItems[activeIdx] && (
        <div
          className="fixed inset-0 z-50 bg-[#18070c]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-[#F7EFE7]">
            <div className="text-xs font-semibold text-[#E7CFAF]">
              Photo {activeIdx + 1} of {filteredItems.length}
            </div>
            <button
              onClick={() => setActiveIdx(null)}
              className="p-2.5 rounded-full glass-control text-[#F7EFE7] hover:border-[rgba(226,184,178,0.5)] transition-colors"
              aria-label="Close photo viewer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image with Navigation */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4">
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-4 z-10 p-3.5 rounded-full glass-control text-[#F7EFE7] hover:text-[#E7CFAF] border border-[rgba(226,184,178,0.35)] shadow-2xl transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={filteredItems[activeIdx].src}
              alt={filteredItems[activeIdx].title}
              className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl border border-[rgba(226,184,178,0.25)]"
            />

            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-4 z-10 p-3.5 rounded-full glass-control text-[#F7EFE7] hover:text-[#E7CFAF] border border-[rgba(226,184,178,0.35)] shadow-2xl transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption */}
          <div className="text-center max-w-xl space-y-1 text-[#F7EFE7] pb-2">
            <h4 className="font-serif text-xl sm:text-2xl font-light text-[#E7CFAF]">
              {filteredItems[activeIdx].title}
            </h4>
            <p className="text-xs text-[#CBB8B9] leading-relaxed">
              {filteredItems[activeIdx].description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
