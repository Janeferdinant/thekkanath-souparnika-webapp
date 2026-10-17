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
          className="inline-flex items-center gap-2 text-xs font-semibold text-forest-800 hover:text-gold-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Halls</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-gold-100 text-gold-800 px-3 py-1 rounded-full border border-gold-300">
              {hall.floor}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-cream-200 text-ink-800 px-3 py-1 rounded-full border border-cream-300">
              {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow & Fans'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900 leading-tight">
            {hall.name}
          </h1>

          <p className="text-sm sm:text-base text-ink-700 leading-relaxed">{hall.description}</p>

          <div className="p-4 rounded-xl bg-cream-100 border border-cream-300 flex items-center gap-3">
            <Users className="w-5 h-5 text-gold-700 shrink-0" />
            <div className="text-xs">
              <strong className="text-forest-950 font-bold block">{hall.capacityText}</strong>
              <span className="text-ink-600">
                Venue is best suited to gatherings of up to 300 guests across the property.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to={`/enquire?hall=${hall.id}`}>
              <Button variant="gold" size="lg" leftIcon={<Calendar className="w-4 h-4" />}>
                Check Date for {hall.name}
              </Button>
            </Link>
            <a href={VENUE_INFO.whatsappUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg" leftIcon={<MessageCircle className="w-4 h-4" />}>
                WhatsApp Team
              </Button>
            </a>
          </div>
        </div>

        {/* Featured Main Photo */}
        <div
          onClick={() => setSelectedPhoto(hall.coverImage)}
          className="relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-luxury border border-cream-300 group bg-forest-950"
        >
          <img
            src={hall.coverImage}
            alt={hall.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent flex items-end p-6">
            <div className="text-white text-xs font-medium flex items-center justify-between w-full">
              <span>Click to view photo in high resolution</span>
              <Eye className="w-4 h-4 text-gold-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery strip for this hall */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-forest-900">Venue Photographs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {hall.galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(img)}
              className="relative h-44 rounded-xl overflow-hidden cursor-pointer shadow-subtle border border-cream-200 group bg-forest-950"
            >
              <img
                src={img}
                alt={`${hall.name} view ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-forest-950/20 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Features & Suggested Uses Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-cream-50 border border-cream-200 space-y-4 shadow-subtle">
          <h3 className="font-serif text-xl font-bold text-forest-900">Hall Features & Facilities</h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-ink-700">
            {hall.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          {hall.soundproofingNotes && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mt-4 leading-relaxed">
              <strong>Soundproofing Note:</strong> {hall.soundproofingNotes}
            </div>
          )}
        </div>

        <div className="p-8 rounded-3xl bg-cream-50 border border-cream-200 space-y-4 shadow-subtle">
          <h3 className="font-serif text-xl font-bold text-forest-900">Suggested Event Types</h3>
          <p className="text-xs text-ink-600 leading-relaxed">
            Ideal setups and recommended celebration types:
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-forest-950 font-medium">
            {hall.suggestedUses.map((use, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-cream-100 border border-cream-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-600"></span>
                <span>{use}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-forest-900 text-cream-100 text-xs space-y-1.5 mt-4">
            <div className="flex items-center gap-1.5 text-gold-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Pricing & Booking Note</span>
            </div>
            <p className="text-[11px] text-cream-300 leading-relaxed">
              Rental rates, package options, and date availability are confirmed directly with our management team upon enquiry.
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
              className="w-full max-h-[70vh] object-contain rounded-xl bg-forest-950"
            />
            <p className="text-xs text-ink-600 text-center">
              Interior view of {hall.name} at Thekkanath Souparnika.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
