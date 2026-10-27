import React, { useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { HALLS, VENUE_INFO } from '../../data/venueData';
import {
  Users,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  Eye,
  ShieldAlert,
  MessageCircle,
} from 'lucide-react';
import { GlassModal } from '../../glass/GlassModal';
import { GlassSurface } from '../../glass/GlassSurface';
import { GlassCard } from '../../glass/GlassCard';
import { ResponsivePicture, imageKeyForSrc } from '../../components/public/ResponsivePicture';

const CHIP = 'text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-brand-champagne-500';

/** A venue photo: optimised derivatives when we have them, the plain file otherwise. */
const VenuePhoto: React.FC<{ src: string; alt: string; sizes: string; imgClassName: string }> = ({ src, alt, sizes, imgClassName }) => {
  const key = imageKeyForSrc(src);
  return key ? (
    <ResponsivePicture image={key} alt={alt} sizes={sizes} className="block w-full h-full" imgClassName={imgClassName} />
  ) : (
    <img src={src} alt={alt} className={imgClassName} loading="lazy" decoding="async" />
  );
};

export const HallDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const photoTrigger = useRef<HTMLElement | null>(null);

  const hall = HALLS.find((h) => h.slug === slug);

  if (!hall) {
    return <Navigate to="/halls" replace />;
  }

  return (
    <div>
      {/* Hero header band */}
      <section className="surface-burgundy py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Link
            to="/halls"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-brand-champagne-500 text-xs font-semibold text-brand-champagne-300 hover:text-brand-ivory-100 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Halls</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`${CHIP} text-brand-champagne-300`}>{hall.floor}</span>
                <span className={`${CHIP} text-brand-ivory-100`}>{hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow & Fans'}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-brand-ivory-100 tracking-tight leading-tight">{hall.name}</h1>

              <p className="text-sm sm:text-base text-brand-ivory-muted leading-relaxed">{hall.description}</p>

              <GlassSurface tone="dark" elevation="raised" className="p-5 flex items-center gap-3.5">
                <Users className="w-5 h-5 text-brand-champagne-300 shrink-0" />
                <div className="text-xs">
                  <strong className="text-brand-ivory-100 font-semibold block">{hall.capacityText}</strong>
                </div>
              </GlassSurface>

              <GlassSurface tone="dark" className="p-4 text-xs space-y-1">
                <span className="font-semibold text-brand-champagne-300">Reserved Entirely for Your Event:</span>
                <p className="text-[11px] text-brand-ivory-muted leading-relaxed">
                  When you book Thekkanath Souparnika, you get private use of all four halls (Stage, Welcome, Dining, and Open Hall). We never take overlapping bookings, so your celebration stays completely private.
                </p>
              </GlassSurface>

              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <Link
                  to="/enquire"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full text-xs font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 border border-brand-champagne-400 shadow-md glass-highlight"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Check Date / Book Hall</span>
                </Link>
                <a
                  href={VENUE_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full text-xs font-semibold text-brand-ivory-100 border border-brand-champagne-500 hover:bg-white/10 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-brand-champagne-300" />
                  <span>WhatsApp Team</span>
                </a>
              </div>
            </div>

            {/* Featured main photo */}
            <button
              type="button"
              onClick={(e) => {
                photoTrigger.current = e.currentTarget;
                setSelectedPhoto(hall.coverImage);
              }}
              className="lens-hover relative block w-full text-left h-80 sm:h-96 rounded-3xl overflow-hidden shadow-luxury border border-brand-champagne-500 group bg-brand-burgundy-900"
            >
              <VenuePhoto
                src={hall.coverImage}
                alt={hall.name}
                sizes="(min-width: 1024px) 50vw, 100vw"
                imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy-950 via-transparent to-transparent flex items-end p-6">
                <div className="text-brand-ivory-100 text-xs font-medium flex items-center justify-between w-full">
                  <span className="text-brand-champagne-300">Click to view in high resolution</span>
                  <Eye className="w-4 h-4 text-brand-champagne-300" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <div className="surface-ivory py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Gallery strip for this hall */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-brand-charcoal-900">Venue Photographs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {hall.galleryImages.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={(e) => {
                    photoTrigger.current = e.currentTarget;
                    setSelectedPhoto(img);
                  }}
                  className="lens-hover relative block w-full text-left h-48 rounded-2xl overflow-hidden shadow-subtle border border-brand-champagne-500 group bg-brand-burgundy-900"
                >
                  <VenuePhoto
                    src={img}
                    alt={`${hall.name} view ${idx + 1}`}
                    sizes="(min-width: 640px) 33vw, 50vw"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Features & Suggested Uses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard tone="light" className="p-8 space-y-4 border-brand-champagne-500">
              <h2 className="font-serif text-2xl font-light text-brand-charcoal-900">Hall Features & Facilities</h2>
              <ul className="space-y-3 text-xs sm:text-sm text-brand-charcoal-600">
                {hall.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-burgundy-700 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {hall.soundproofingNotes && (
                <div className="p-4 rounded-2xl bg-brand-ivory-200 border border-brand-champagne-500 text-xs text-brand-charcoal-600 mt-4 leading-relaxed">
                  <strong className="text-brand-charcoal-900">Soundproofing Note:</strong> {hall.soundproofingNotes}
                </div>
              )}
            </GlassCard>

            <GlassCard tone="light" className="p-8 space-y-4 border-brand-champagne-500">
              <h2 className="font-serif text-2xl font-light text-brand-charcoal-900">Suggested Event Types</h2>
              <p className="text-xs text-brand-charcoal-600 leading-relaxed">Ideal setups and recommended celebration types:</p>
              <div className="space-y-2 text-xs sm:text-sm text-brand-charcoal-900 font-medium">
                {hall.suggestedUses.map((use, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-brand-ivory-200 border border-brand-champagne-500 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-brand-burgundy-700" />
                    <span>{use}</span>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl text-xs space-y-1.5 mt-4 border border-brand-champagne-500 bg-brand-ivory-50">
                <div className="flex items-center gap-1.5 text-brand-burgundy-700 font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Pricing & Booking Note</span>
                </div>
                <p className="text-[11px] text-brand-charcoal-600 leading-relaxed">
                  Rental rates, session options, and date availability are confirmed directly with our management team upon enquiry.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <GlassModal
          isOpen
          onClose={() => setSelectedPhoto(null)}
          title={`${hall.name} — Photograph`}
          maxWidth="2xl"
          returnFocusRef={photoTrigger}
        >
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-brand-burgundy-950 border border-brand-champagne-500">
              <VenuePhoto src={selectedPhoto} alt={hall.name} sizes="(min-width: 1024px) 672px, 100vw" imgClassName="w-full h-auto max-h-[70vh] object-contain" />
            </div>
            <p className="text-xs text-brand-ivory-muted text-center font-medium">Interior view of {hall.name} at Thekkanath Souparnika.</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};
