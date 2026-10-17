import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HALLS } from '../../data/venueData';
import { Users, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HallsPage: React.FC = () => {
  const [acFilter, setAcFilter] = useState<'all' | 'ac' | 'non_ac'>('all');
  const [floorFilter, setFloorFilter] = useState<'all' | 'ground' | 'first'>('all');

  const filteredHalls = HALLS.filter((hall) => {
    if (acFilter === 'ac' && !hall.airConditioned) return false;
    if (acFilter === 'non_ac' && hall.airConditioned) return false;
    if (floorFilter === 'ground' && !hall.floor.toLowerCase().includes('ground')) return false;
    if (floorFilter === 'first' && !hall.floor.toLowerCase().includes('first')) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700">
          <ShieldCheck className="w-4 h-4" />
          <span>Event Hall Spaces</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900 leading-tight">
          Our Four Event Halls
        </h1>
        <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
          Thekkanath Souparnika offers four distinct event spaces, each accommodating up to 100 guests. The entire venue is ideally suited for celebrations of up to 300 guests across coordinated halls.
        </p>
      </div>

      {/* Filter Strip */}
      <div className="p-4 rounded-2xl bg-cream-100/80 border border-cream-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink-700">
          <Filter className="w-4 h-4 text-gold-600" />
          <span>Filter Halls:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* AC Filter */}
          <div className="flex items-center rounded-lg bg-cream-50 p-1 border border-cream-300 text-xs">
            <button
              onClick={() => setAcFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                acFilter === 'all' ? 'bg-forest-800 text-white font-semibold' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setAcFilter('ac')}
              className={`px-3 py-1 rounded-md transition-colors ${
                acFilter === 'ac' ? 'bg-forest-800 text-white font-semibold' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Air-Conditioned (3)
            </button>
            <button
              onClick={() => setAcFilter('non_ac')}
              className={`px-3 py-1 rounded-md transition-colors ${
                acFilter === 'non_ac' ? 'bg-forest-800 text-white font-semibold' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Natural Airflow (1)
            </button>
          </div>

          {/* Floor Filter */}
          <div className="flex items-center rounded-lg bg-cream-50 p-1 border border-cream-300 text-xs">
            <button
              onClick={() => setFloorFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                floorFilter === 'all' ? 'bg-forest-800 text-white font-semibold' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              All Floors
            </button>
            <button
              onClick={() => setFloorFilter('ground')}
              className={`px-3 py-1 rounded-md transition-colors ${
                floorFilter === 'ground' ? 'bg-forest-800 text-white font-semibold' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Ground Floor
            </button>
            <button
              onClick={() => setFloorFilter('first')}
              className={`px-3 py-1 rounded-md transition-colors ${
                floorFilter === 'first' ? 'bg-forest-800 text-white font-semibold' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              First Floor
            </button>
          </div>
        </div>
      </div>

      {/* Halls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredHalls.map((hall) => (
          <div
            key={hall.id}
            className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden shadow-subtle hover:shadow-luxury transition-all duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-forest-950">
              <img
                src={hall.coverImage}
                alt={hall.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-forest-900/90 text-gold-300 text-xs font-bold px-3 py-1 rounded-full border border-forest-700">
                {hall.floor}
              </div>
              <div className="absolute bottom-4 right-4 bg-cream-50/95 text-forest-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow & Fans'}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-serif text-2xl font-bold text-forest-900">{hall.name}</h2>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700">
                    <Users className="w-4 h-4" />
                    <span>{hall.capacityText}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">{hall.description}</p>

                {hall.soundproofingNotes && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                    <strong>Soundproofing note:</strong> {hall.soundproofingNotes}
                  </div>
                )}

                {/* Features */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-semibold text-forest-800 uppercase tracking-wider">
                    Key Features:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hall.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-cream-200 text-ink-800 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested uses */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-semibold text-forest-800 uppercase tracking-wider">
                    Recommended For:
                  </div>
                  <div className="text-xs text-ink-600">
                    {hall.suggestedUses.join(' · ')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
                <Link to={`/halls/${hall.slug}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Hall Details & Gallery
                  </Button>
                </Link>

                <Link to={`/enquire?hall=${hall.id}`}>
                  <Button variant="gold" size="sm">
                    Enquire for this Hall
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Capacity Clarity Callout */}
      <div className="p-6 rounded-2xl bg-forest-900 text-cream-100 border border-forest-800 space-y-2">
        <h3 className="font-serif text-lg font-bold text-gold-300">
          Capacity & Nuance Commitment
        </h3>
        <p className="text-xs text-cream-200 leading-relaxed">
          The four halls are individual spaces accommodating up to 100 guests each. The venue is best suited for gatherings of up to 300 guests overall. Management does not market or combine all halls for a 400-guest single function, preserving safety, comfort, and service standards.
        </p>
      </div>
    </div>
  );
};
