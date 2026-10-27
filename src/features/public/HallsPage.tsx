import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HALLS } from '../../data/venueData';
import { Users, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HallsPage: React.FC = () => {
  const [acFilter, setAcFilter] = useState<'all' | 'ac' | 'non_ac'>('all');
  const [floorFilter, setFloorFilter] = useState<'all' | 'ground' | 'first'>('all');

  const filteredHalls = HALLS.filter((h) => h.id !== 'auditorium').filter((hall) => {
    if (acFilter === 'ac' && !hall.airConditioned) return false;
    if (acFilter === 'non_ac' && hall.airConditioned) return false;
    if (floorFilter === 'ground' && !hall.floor.toLowerCase().includes('ground')) return false;
    if (floorFilter === 'first' && !hall.floor.toLowerCase().includes('first')) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E7CFAF]">
          <ShieldCheck className="w-4 h-4 text-[#e8c7bc]" />
          <span>All 4 Spaces Included</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F7EFE7] tracking-tight leading-tight">
          Four Spaces Built for Your Celebration
        </h1>
        <p className="text-sm sm:text-base text-[#CBB8B9] leading-relaxed">
          Three air-conditioned halls and a breezy open hall built to host your whole day under one roof—from stage ceremonies to the traditional sadhya feast. Comfortably laid out for 250 to 300 guests, and can host up to 400.
        </p>

        {/* Exclusive One-Event Policy Banner */}
        <div className="p-4 sm:p-5 rounded-2xl glass-control border border-[rgba(226,184,178,0.25)] bg-[#18070c]/80 text-xs text-[#F7EFE7] space-y-1.5">
          <div className="flex items-center gap-2 text-[#E7CFAF] font-serif text-base">
            <ShieldCheck className="w-4 h-4 text-[#e8c7bc]" />
            <span>Only One Event at a Time</span>
          </div>
          <p className="text-[11px] text-[#CBB8B9] leading-relaxed">
            We host only one celebration at a time. Your family gets the whole venue to yourselves—no sharing spaces with other parties, and no rush between programs.
          </p>
        </div>
      </div>

      {/* Filter Strip — Liquid Glass */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-[rgba(226,184,178,0.22)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E7CFAF]">
          <Filter className="w-4 h-4 text-[#e8c7bc]" />
          <span>Filter Halls:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* AC Filter */}
          <div className="flex items-center rounded-xl bg-[#18070c]/70 p-1 border border-[rgba(226,184,178,0.2)] text-xs">
            <button
              onClick={() => setAcFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                acFilter === 'all'
                  ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] font-semibold shadow-sm border border-[rgba(226,184,178,0.35)]'
                  : 'text-[#CBB8B9] hover:text-[#F7EFE7]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setAcFilter('ac')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                acFilter === 'ac'
                  ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] font-semibold shadow-sm border border-[rgba(226,184,178,0.35)]'
                  : 'text-[#CBB8B9] hover:text-[#F7EFE7]'
              }`}
            >
              Air-Conditioned (3)
            </button>
            <button
              onClick={() => setAcFilter('non_ac')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                acFilter === 'non_ac'
                  ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] font-semibold shadow-sm border border-[rgba(226,184,178,0.35)]'
                  : 'text-[#CBB8B9] hover:text-[#F7EFE7]'
              }`}
            >
              Natural Airflow (1)
            </button>
          </div>

          {/* Floor Filter */}
          <div className="flex items-center rounded-xl bg-[#18070c]/70 p-1 border border-[rgba(226,184,178,0.2)] text-xs">
            <button
              onClick={() => setFloorFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                floorFilter === 'all'
                  ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] font-semibold shadow-sm border border-[rgba(226,184,178,0.35)]'
                  : 'text-[#CBB8B9] hover:text-[#F7EFE7]'
              }`}
            >
              All Floors
            </button>
            <button
              onClick={() => setFloorFilter('ground')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                floorFilter === 'ground'
                  ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] font-semibold shadow-sm border border-[rgba(226,184,178,0.35)]'
                  : 'text-[#CBB8B9] hover:text-[#F7EFE7]'
              }`}
            >
              Ground Floor
            </button>
            <button
              onClick={() => setFloorFilter('first')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                floorFilter === 'first'
                  ? 'bg-gradient-to-r from-[#5A1B2E] to-[#451323] text-[#F7EFE7] font-semibold shadow-sm border border-[rgba(226,184,178,0.35)]'
                  : 'text-[#CBB8B9] hover:text-[#F7EFE7]'
              }`}
            >
              First Floor
            </button>
          </div>
        </div>
      </div>

      {/* Halls Grid — Liquid Glass Cards with Lens Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredHalls.map((hall) => (
          <div
            key={hall.id}
            className="group glass-panel rounded-3xl border border-[rgba(226,184,178,0.22)] overflow-hidden hover:border-[rgba(226,184,178,0.45)] transition-all duration-300 flex flex-col hover:-translate-y-1"
          >
            {/* Image with Lens Effect */}
            <div className="relative h-64 sm:h-72 overflow-hidden bg-[#18070c] lens-hover">
              <img
                src={hall.coverImage}
                alt={hall.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 glass-control text-[#E7CFAF] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[rgba(226,184,178,0.3)] shadow-md">
                {hall.floor}
              </div>
              <div className="absolute bottom-4 right-4 glass-control text-[#F7EFE7] text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[rgba(226,184,178,0.3)] shadow-md">
                {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow & Fans'}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F7EFE7]">
                    {hall.name}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E7CFAF]">
                    <Users className="w-4 h-4 text-[#e8c7bc]" />
                    <span>{hall.capacityText}</span>
                  </div>
                </div>

                {hall.id === 'dining-hall' && (
                  <div>
                    <span className="text-[11px] bg-[#451323] text-[#F3E5AB] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full font-semibold">
                      Recommended for Feast / Sadhya
                    </span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#CBB8B9] leading-relaxed">{hall.description}</p>

                {hall.soundproofingNotes && (
                  <div className="p-3.5 rounded-2xl bg-[#2F0B16]/70 border border-[rgba(226,184,178,0.25)] text-xs text-[#E7CFAF] leading-relaxed">
                    <strong className="text-[#F7EFE7]">Soundproofing note:</strong> {hall.soundproofingNotes}
                  </div>
                )}

                {/* Features */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-semibold text-[#E7CFAF] uppercase tracking-wider">
                    Key Features:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hall.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#240810]/80 text-[#F7EFE7] border border-[rgba(226,184,178,0.2)] px-3 py-1 rounded-full font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested uses */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-semibold text-[#E7CFAF] uppercase tracking-wider">
                    Recommended For:
                  </div>
                  <div className="text-xs text-[#CBB8B9]">
                    {hall.suggestedUses.join(' · ')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[rgba(226,184,178,0.15)] flex flex-wrap items-center justify-between gap-3">
                <Link to={`/halls/${hall.slug}`}>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold glass-control text-[#F7EFE7] hover:border-[rgba(226,184,178,0.5)] transition-all">
                    <span>Space Details & Photos</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#e8c7bc]" />
                  </button>
                </Link>

                <Link to="/enquire">
                  <Button variant="gold" size="sm" className="glass-highlight">
                    Enquire for Booking
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Capacity & Booking Availability Callout — Liquid Glass */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[rgba(226,184,178,0.25)] space-y-3">
        <h3 className="font-serif text-xl sm:text-2xl font-light text-[#E7CFAF]">
          Booking Availability & Seating Capacity
        </h3>
        <p className="text-xs sm:text-sm text-[#CBB8B9] leading-relaxed max-w-4xl">
          Our hall can be booked for any number of guests, and no part of the venue is rented to another party during your event. Each hall has 100 seats arranged, and the air-conditioned First Floor Dining Hall seats 100 guests in one sitting, which keeps multi-batch traditional sadhyas and festive banquets running smoothly.
        </p>
      </div>
    </div>
  );
};
