import React, { useState } from 'react';
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
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const HallDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const hall = HALLS.find((h) => h.slug === slug);

  if (!hall) {
    return <Navigate to="/halls" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/halls"
          className="inline-flex items-center gap-2 text-xs font-semibold text-burgundy-900 hover:text-rose-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Halls</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-100/80 text-burgundy-950 px-3.5 py-1 rounded-full border border-rose-300/60">
              {hall.floor}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/80 text-burgundy-900 px-3.5 py-1 rounded-full border border-rose-200/70">
              {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow & Fans'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-burgundy-950 tracking-tight leading-tight">
            {hall.name}
          </h1>

          <p className="text-sm sm:text-base text-ink-700 leading-relaxed">{hall.description}</p>

          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-rose-200/80 shadow-subtle flex items-center gap-3.5">
            <Users className="w-5 h-5 text-gold-600 shrink-0" />
            <div className="text-xs">
              <strong className="text-burgundy-950 font-bold block">{hall.capacityText}</strong>
              <span className="text-ink-600">
                Venue is best suited to gatherings of up to 300 guests across the property.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <Link to={`/enquire?hall=${hall.id}`} className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full sm:w-auto" leftIcon={<Calendar className="w-4 h-4" />}>
                Check Date for {hall.name}
              </Button>
            </Link>
            <a href={VENUE_INFO.whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<MessageCircle className="w-4 h-4" />}>
                WhatsApp Team
              </Button>
            </a>
          </div>
        </div>

        {/* Featured Main Photo */}
        <div
          onClick={() => setSelectedPhoto(hall.coverImage)}
          className="relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-luxury border border-rose-200/80 group bg-wine-950"
        >
          <img
            src={hall.coverImage}
            alt={hall.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wine-950/80 via-transparent to-transparent flex items-end p-6">
            <div className="text-white text-xs font-medium flex items-center justify-between w-full">
              <span>Click to view photo in high resolution</span>
              <Eye className="w-4 h-4 text-gold-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery strip for this hall */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-burgundy-950">Venue Photographs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {hall.galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(img)}
              className="relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-subtle border border-rose-200/80 group bg-wine-950"
            >
              <img
                src={img}
                alt={`${hall.name} view ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-wine-950/20 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Features & Suggested Uses Details — Liquid Glass */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/80 space-y-4 shadow-subtle">
          <h3 className="font-serif text-2xl font-bold text-burgundy-950">Hall Features & Facilities</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-ink-700">
            {hall.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-burgundy-800 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          {hall.soundproofingNotes && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 mt-4 leading-relaxed">
              <strong>Soundproofing Note:</strong> {hall.soundproofingNotes}
            </div>
          )}
        </div>

        <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/80 space-y-4 shadow-subtle">
          <h3 className="font-serif text-2xl font-bold text-burgundy-950">Suggested Event Types</h3>
          <p className="text-xs text-ink-600 leading-relaxed">
            Ideal setups and recommended celebration types:
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-burgundy-950 font-medium">
            {hall.suggestedUses.map((use, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/70 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-gold-600" />
                <span>{use}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-burgundy-950 to-wine-950 text-white text-xs space-y-1.5 mt-4 border border-rose-300/30">
            <div className="flex items-center gap-1.5 text-gold-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Pricing & Booking Note</span>
            </div>
            <p className="text-[11px] text-cream-200 leading-relaxed">
              Rental rates, session options, and date availability are confirmed directly with our management team upon enquiry.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={Boolean(selectedPhoto)}
          onClose={() => setSelectedPhoto(null)}
          title={`${hall.name} — Photograph`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <img
              src={selectedPhoto}
              alt={hall.name}
              className="w-full max-h-[70vh] object-contain rounded-2xl bg-wine-950 shadow-md"
            />
            <p className="text-xs text-rose-900/80 text-center font-medium">
              Interior view of {hall.name} at Thekkanath Souparnika.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
