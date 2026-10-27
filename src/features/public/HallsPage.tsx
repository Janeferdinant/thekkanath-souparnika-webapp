import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HALLS } from '../../data/venueData';
import { Users, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { PageHeader } from '../../components/public/PageHeader';
import { ResponsivePicture, imageKeyForSrc } from '../../components/public/ResponsivePicture';
import { GlassCard } from '../../glass/GlassCard';
import { GlassSurface } from '../../glass/GlassSurface';

type AcFilter = 'all' | 'ac' | 'non_ac';
type FloorFilter = 'all' | 'ground' | 'first';

/** A row of mutually exclusive filter buttons. */
function FilterGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center rounded-xl bg-brand-ivory-200 p-1 border border-brand-champagne-500 text-xs">
      {options.map(([id, text]) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`px-3 min-h-[44px] rounded-lg transition-all ${
            value === id
              ? 'bg-brand-burgundy-700 text-brand-ivory-100 font-semibold shadow-sm'
              : 'text-brand-charcoal-900 hover:bg-brand-ivory-50'
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export const HallsPage: React.FC = () => {
  const [acFilter, setAcFilter] = useState<AcFilter>('all');
  const [floorFilter, setFloorFilter] = useState<FloorFilter>('all');

  const filteredHalls = HALLS.filter((h) => h.id !== 'auditorium').filter((hall) => {
    if (acFilter === 'ac' && !hall.airConditioned) return false;
    if (acFilter === 'non_ac' && hall.airConditioned) return false;
    if (floorFilter === 'ground' && !hall.floor.toLowerCase().includes('ground')) return false;
    if (floorFilter === 'first' && !hall.floor.toLowerCase().includes('first')) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        eyebrow="All 4 Spaces Included"
        icon={<ShieldCheck className="w-4 h-4" />}
        title="Four Spaces Built for Your Celebration"
        intro="Three air-conditioned halls and a breezy open hall built to host your whole day under one roof—from stage ceremonies to the traditional sadhya feast. Comfortably laid out for 250 to 300 guests, and can host up to 400."
      >
        {/* Exclusive One-Event Policy Banner */}
        <GlassSurface tone="dark" elevation="raised" className="p-4 sm:p-5 text-xs space-y-1.5">
          <h2 className="flex items-center gap-2 text-brand-champagne-300 font-serif text-base">
            <ShieldCheck className="w-4 h-4" />
            <span>Only One Event at a Time</span>
          </h2>
          <p className="text-[11px] text-brand-ivory-muted leading-relaxed">
            We host only one celebration at a time. Your family gets the whole venue to yourselves—no sharing spaces with other parties, and no rush between programs.
          </p>
        </GlassSurface>
      </PageHeader>

      <div className="surface-ivory py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Filter Strip */}
          <GlassSurface tone="light" elevation="raised" className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-brand-champagne-500">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-burgundy-700">
              <Filter className="w-4 h-4" />
              <span>Filter Halls:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <FilterGroup<AcFilter>
                label="Air conditioning"
                value={acFilter}
                onChange={setAcFilter}
                options={[
                  ['all', 'All Types'],
                  ['ac', 'Air-Conditioned (3)'],
                  ['non_ac', 'Natural Airflow (1)'],
                ]}
              />
              <FilterGroup<FloorFilter>
                label="Floor"
                value={floorFilter}
                onChange={setFloorFilter}
                options={[
                  ['all', 'All Floors'],
                  ['ground', 'Ground Floor'],
                  ['first', 'First Floor'],
                ]}
              />
            </div>
          </GlassSurface>

          {/* Halls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredHalls.map((hall) => {
              const key = imageKeyForSrc(hall.coverImage);
              return (
                <GlassCard key={hall.id} tone="light" className="group overflow-hidden flex flex-col border-brand-champagne-500">
                  {/* Image with lens hover */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-brand-burgundy-900 lens-hover rounded-t-[inherit]">
                    {key && (
                      <ResponsivePicture
                        image={key}
                        alt={hall.name}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="block w-full h-full"
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-brand-burgundy-900 text-brand-champagne-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-brand-champagne-500 shadow-md">
                      {hall.floor}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-brand-burgundy-900 text-brand-ivory-100 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-brand-champagne-500 shadow-md">
                      {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow & Fans'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-charcoal-900">{hall.name}</h2>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-burgundy-700">
                          <Users className="w-4 h-4" />
                          <span>{hall.capacityText}</span>
                        </div>
                      </div>

                      {hall.id === 'dining-hall' && (
                        <div>
                          <span className="text-[11px] bg-brand-burgundy-700 text-brand-champagne-300 px-2.5 py-0.5 rounded-full font-semibold">
                            Recommended for Feast / Sadhya
                          </span>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed">{hall.description}</p>

                      {hall.soundproofingNotes && (
                        <div className="p-3.5 rounded-2xl bg-brand-ivory-200 border border-brand-champagne-500 text-xs text-brand-charcoal-600 leading-relaxed">
                          <strong className="text-brand-charcoal-900">Soundproofing note:</strong> {hall.soundproofingNotes}
                        </div>
                      )}

                      {/* Features */}
                      <div className="space-y-1.5 pt-2">
                        <div className="text-[11px] font-semibold text-brand-bronze-700 uppercase tracking-wider">Key Features:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {hall.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-brand-ivory-200 text-brand-charcoal-900 border border-brand-champagne-500 px-3 py-1 rounded-full font-medium"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Suggested uses */}
                      <div className="space-y-1 pt-1">
                        <div className="text-[11px] font-semibold text-brand-bronze-700 uppercase tracking-wider">Recommended For:</div>
                        <div className="text-xs text-brand-charcoal-600">{hall.suggestedUses.join(' · ')}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-brand-champagne-500 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        to={`/halls/${hall.slug}`}
                        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-full text-xs font-semibold text-brand-burgundy-700 border border-brand-burgundy-700 hover:bg-brand-burgundy-700 hover:text-brand-ivory-100 transition-all"
                      >
                        <span>Space Details & Photos</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to="/enquire"
                        className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full text-xs font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 border border-brand-champagne-400 shadow-md glass-highlight"
                      >
                        Enquire for Booking
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Capacity & Booking Availability Callout */}
          <GlassSurface tone="dark" elevation="raised" className="p-8 sm:p-10 space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-light text-brand-champagne-300">Booking Availability & Seating Capacity</h2>
            <p className="text-xs sm:text-sm text-brand-ivory-muted leading-relaxed max-w-4xl">
              Our hall can be booked for any number of guests, and no part of the venue is rented to another party during your event. Each hall has 100 seats arranged, and the air-conditioned First Floor Dining Hall seats 100 guests in one sitting, which keeps multi-batch traditional sadhyas and festive banquets running smoothly.
            </p>
          </GlassSurface>
        </div>
      </div>
    </div>
  );
};
