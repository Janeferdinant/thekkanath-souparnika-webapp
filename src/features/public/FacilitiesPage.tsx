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
import { Button } from '../../components/ui/Button';

export const FacilitiesPage: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-gold-400" />;
      case 'Footprints':
        return <Footprints className="w-6 h-6 text-gold-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-gold-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-gold-400" />;
      case 'Car':
        return <Car className="w-6 h-6 text-gold-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-gold-400" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-gold-400" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-gold-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-gold-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
          <ShieldCheck className="w-4 h-4 text-gold-500" />
          <span>Venue Amenities & Comforts</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-burgundy-950 tracking-tight leading-tight">
          Venue Facilities & Comforts
        </h1>
        <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
          We provide clear, dependable amenities and modern conveniences so hosts and guests enjoy a seamless celebration experience.
        </p>
      </div>

      {/* Facilities Grid — Liquid Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FACILITIES.map((fac) => (
          <div
            key={fac.id}
            className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/70 shadow-subtle hover:shadow-luxury hover:border-gold-400/70 transition-all duration-300 flex flex-col justify-between space-y-5 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-burgundy-900 to-wine-950 flex items-center justify-center border border-gold-400/30 shadow-md">
                {getIcon(fac.iconName)}
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  {fac.badge || fac.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-burgundy-950">{fac.title}</h3>
              </div>

              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">{fac.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rooftop Special Policy Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/80 shadow-subtle space-y-3">
        <div className="flex items-center gap-2.5 text-burgundy-950 font-serif font-bold text-xl">
          <Sparkles className="w-5 h-5 text-gold-600" />
          <span>Rooftop & Changing Room Policy</span>
        </div>
        <p className="text-xs sm:text-sm text-ink-700 leading-relaxed max-w-3xl">
          The venue features a 4,000 sq ft truss-roofed upper structure. Please note: <strong>the rooftop itself is strictly closed to event guests</strong> for safety. Dedicated private dress-change rooms can be arranged on the rooftop level upon prior request to management.
        </p>
      </div>

      {/* Custom Event Requirements Banner — Luxury Burgundy */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-wine-950 text-white border border-rose-300/30 shadow-luxury space-y-4">
        <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs tracking-wider uppercase">
          <AlertTriangle className="w-4 h-4" />
          <span>Custom Event Requirements</span>
        </div>
        <p className="text-xs sm:text-sm text-cream-200 leading-relaxed max-w-2xl">
          If your event requires specific logistical support, outside catering coordination, or customized staging equipment, our management team is delighted to assist you in tailoring the setup.
        </p>
        <div className="pt-2">
          <Link to="/enquire">
            <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Discuss Event Requirements With Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
