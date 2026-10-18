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
    const iconClass = "w-6 h-6 text-[#e8c7bc]";
    switch (iconName) {
      case 'Droplets':
        return <Droplets className={iconClass} />;
      case 'Footprints':
        return <Footprints className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      case 'Car':
        return <Car className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'MapPin':
        return <MapPin className={iconClass} />;
      case 'Wind':
        return <Wind className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E7CFAF]">
          <ShieldCheck className="w-4 h-4 text-[#e8c7bc]" />
          <span>Venue Amenities & Comforts</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F7EFE7] tracking-tight leading-tight">
          Venue Facilities & Guest Comforts
        </h1>
        <p className="text-sm sm:text-base text-[#CBB8B9] leading-relaxed">
          We provide clear, dependable amenities and modern conveniences so hosts and guests enjoy a seamless celebration experience.
        </p>
      </div>

      {/* Facilities Grid — Liquid Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FACILITIES.map((fac) => (
          <div
            key={fac.id}
            className="glass-panel p-8 rounded-3xl border border-[rgba(226,184,178,0.22)] hover:border-[rgba(226,184,178,0.45)] transition-all duration-300 flex flex-col justify-between space-y-5 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#451323] to-[#18070c] flex items-center justify-center border border-[rgba(226,184,178,0.3)] shadow-md">
                {getIcon(fac.iconName)}
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E7CFAF]">
                  {fac.badge || fac.category}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#F7EFE7]">{fac.title}</h3>
              </div>

              <p className="text-xs sm:text-sm text-[#CBB8B9] leading-relaxed">{fac.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rooftop Special Policy Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[rgba(226,184,178,0.22)] space-y-3">
        <div className="flex items-center gap-2.5 text-[#E7CFAF] font-serif font-light text-xl sm:text-2xl">
          <Sparkles className="w-5 h-5 text-[#e8c7bc]" />
          <span>Rooftop & Changing Room Policy</span>
        </div>
        <p className="text-xs sm:text-sm text-[#CBB8B9] leading-relaxed max-w-3xl">
          The venue features a 4,000 sq ft truss-roofed upper structure. Please note: <strong className="text-[#F7EFE7]">the rooftop itself is strictly closed to event guests</strong> for safety. Dedicated private dress-change rooms can be arranged on the rooftop level upon prior request to management.
        </p>
      </div>

      {/* Custom Event Requirements Banner — Luxury Burgundy */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[rgba(226,184,178,0.3)] space-y-4">
        <div className="flex items-center gap-2 text-[#E7CFAF] font-semibold text-xs tracking-wider uppercase">
          <AlertTriangle className="w-4 h-4 text-[#e8c7bc]" />
          <span>Custom Event Requirements</span>
        </div>
        <p className="text-xs sm:text-sm text-[#CBB8B9] leading-relaxed max-w-2xl">
          If your event requires specific logistical support, outside catering coordination, or customized staging equipment, our management team is delighted to assist you in tailoring the setup.
        </p>
        <div className="pt-2">
          <Link to="/enquire">
            <Button variant="gold" size="md" className="glass-highlight" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Discuss Event Requirements With Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
