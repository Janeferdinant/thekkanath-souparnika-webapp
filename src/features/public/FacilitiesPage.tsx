import React from 'react';
import { Link } from 'react-router-dom';
import { FACILITIES } from '../../data/venueData';
import {
  ShieldCheck,
  Droplets,
  Footprints,
  Zap,
  Car,
  Sparkles,
  MapPin,
  Wind,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/public/PageHeader';
import { GlassCard } from '../../glass/GlassCard';
import { GlassSurface } from '../../glass/GlassSurface';

const ICONS: Record<string, React.ElementType> = {
  Droplets,
  Footprints,
  Zap,
  ShieldCheck,
  Car,
  Sparkles,
  MapPin,
  Wind,
};

export const FacilitiesPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Venue Amenities & Comforts"
        icon={<ShieldCheck className="w-4 h-4" />}
        title="Venue Facilities & Amenities"
        intro="From uninterrupted solar backup power to certified drinking water, we take care of the essentials so you and your guests can enjoy your day."
      />

      <div className="surface-ivory py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACILITIES.map((fac) => {
              const Icon = ICONS[fac.iconName] ?? Sparkles;
              return (
                <GlassCard key={fac.id} tone="light" className="p-8 flex flex-col justify-between space-y-5 border-brand-champagne-500">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-burgundy-700 text-brand-champagne-300 flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-bronze-700">{fac.badge || fac.category}</span>
                      <h2 className="font-serif text-2xl font-light text-brand-charcoal-900">{fac.title}</h2>
                    </div>

                    <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed">{fac.description}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Rooftop Special Policy Banner */}
          <GlassSurface tone="light" elevation="raised" className="p-8 sm:p-10 space-y-3 border-brand-champagne-500">
            <h2 className="flex items-center gap-2.5 text-brand-burgundy-700 font-serif font-light text-xl sm:text-2xl">
              <Sparkles className="w-5 h-5" />
              <span>Rooftop & Changing Room Policy</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed max-w-3xl">
              The venue features a 4,000 sq ft truss-roofed upper structure. Please note: <strong className="text-brand-charcoal-900">the rooftop itself is closed to guests during events</strong> for safety. Private dressing and changing rooms can be opened on the rooftop floor whenever requested.
            </p>
          </GlassSurface>
        </div>
      </div>

      {/* Custom Event Requirements Banner */}
      <section className="surface-burgundy py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="flex items-center gap-2 text-brand-champagne-300 font-semibold text-xs tracking-wider uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>Custom Event Requirements</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-ivory-muted leading-relaxed max-w-2xl">
            Need early access for stage decorators, special catering arrangements, or customized setup? Just let us know—we are flexible and happy to accommodate your plans.
          </p>
          <div className="pt-2">
            <Link
              to="/enquire"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full text-xs font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 border border-brand-champagne-400 shadow-md glass-highlight"
            >
              <span>Discuss Event Requirements With Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
