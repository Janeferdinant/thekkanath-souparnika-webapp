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
        return <Droplets className="w-6 h-6 text-gold-500" />;
      case 'Footprints':
        return <Footprints className="w-6 h-6 text-gold-500" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-gold-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-gold-500" />;
      case 'Car':
        return <Car className="w-6 h-6 text-gold-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-gold-500" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-gold-500" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-gold-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-gold-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700">
          <ShieldCheck className="w-4 h-4" />
          <span>Venue Amenities & Comforts</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900 leading-tight">
          Venue Facilities & Comforts
        </h1>
        <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
          We provide clear, dependable amenities and modern conveniences so hosts and guests enjoy a seamless celebration experience.
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FACILITIES.map((fac) => (
          <div
            key={fac.id}
            className="p-6 rounded-2xl bg-cream-50 border border-cream-200/90 shadow-subtle hover:shadow-luxury transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center">
                {getIcon(fac.iconName)}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
                  {fac.badge || fac.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-forest-950">{fac.title}</h3>
              </div>

              <p className="text-xs text-ink-600 leading-relaxed">{fac.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rooftop Special Policy Banner */}
      <div className="p-8 rounded-3xl bg-cream-100 border border-cream-300 space-y-3">
        <div className="flex items-center gap-2 text-forest-900 font-serif font-bold text-lg">
          <Sparkles className="w-5 h-5 text-gold-600" />
          <span>Rooftop & Changing Room Policy</span>
        </div>
        <p className="text-xs sm:text-sm text-ink-700 leading-relaxed max-w-3xl">
          The venue features a 4,000 sq ft truss-roofed upper structure. Please note: <strong>the rooftop itself is strictly closed to event guests</strong> for safety. Dedicated private dress-change rooms can be arranged on the rooftop level upon prior request to management.
        </p>
      </div>

      {/* Unverified amenities disclosure */}
      <div className="p-6 rounded-2xl bg-forest-900 text-cream-100 border border-forest-800 space-y-3">
        <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs tracking-wider uppercase">
          <AlertTriangle className="w-4 h-4" />
          <span>Custom Event Requirements</span>
        </div>
        <p className="text-xs text-cream-200 leading-relaxed">
          If your event requires specific logistical support, outside catering coordination, or customized staging equipment, our management team is delighted to assist you in tailoring the setup.
        </p>
        <div className="pt-2">
          <Link to="/enquire">
            <Button variant="gold" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Discuss Event Requirements With Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
