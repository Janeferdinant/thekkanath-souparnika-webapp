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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/halls"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-control text-xs font-semibold text-[#E7CFAF] hover:text-[#F7EFE7] hover:border-[rgba(226,184,178,0.4)] transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#e8c7bc]" />
          <span>Back to All Halls</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider glass-control text-[#E7CFAF] px-3.5 py-1 rounded-full border border-[rgba(226,184,178,0.3)]">
              {hall.floor}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider glass-control text-[#F7EFE7] px-3.5 py-1 rounded-full border border-[rgba(226,184,178,0.3)]">
              {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow & Fans'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F7EFE7] tracking-tight leading-tight">
            {hall.name}
          </h1>

          <p className="text-sm sm:text-base text-[#CBB8B9] leading-relaxed">{hall.description}</p>

          <div className="glass-panel p-5 rounded-2xl border border-[rgba(226,184,178,0.22)] flex items-center gap-3.5">
            <Users className="w-5 h-5 text-[#e8c7bc] shrink-0" />
            <div className="text-xs">
              <strong className="text-[#F7EFE7] font-semibold block">{hall.capacityText}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-control border border-[rgba(226,184,178,0.25)] bg-[#18070c]/80 text-xs text-[#F7EFE7] space-y-1">
            <span className="font-semibold text-[#E7CFAF]">Reserved Entirely for Your Event:</span>
            <p className="text-[11px] text-[#CBB8B9] leading-relaxed">
              When you book Thekkanath Souparnika, you get private use of all four halls (Stage, Welcome, Dining, and Open Hall). We never take overlapping bookings, so your celebration stays completely private.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <Link to="/enquire" className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full sm:w-auto glass-highlight" leftIcon={<Calendar className="w-4 h-4" />}>
                Check Date / Book Hall
              </Button>
            </Link>
            <a href={VENUE_INFO.whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold glass-control text-[#F7EFE7] hover:border-[rgba(226,184,178,0.5)] transition-all">
                <MessageCircle className="w-4 h-4 text-[#e8c7bc]" />
                <span>WhatsApp Team</span>
              </button>
            </a>
          </div>
        </div>

        {/* Featured Main Photo with Lens Hover */}
        <div
          onClick={() => setSelectedPhoto(hall.coverImage)}
          className="lens-hover relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-luxury border border-[rgba(226,184,178,0.25)] group bg-[#18070c]"
        >
          <img
            src={hall.coverImage}
            alt={hall.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18070c]/90 via-transparent to-transparent flex items-end p-6">
            <div className="text-[#F7EFE7] text-xs font-medium flex items-center justify-between w-full">
              <span className="text-[#E7CFAF]">Click to view in high resolution</span>
              <Eye className="w-4 h-4 text-[#e8c7bc]" />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery strip for this hall */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F7EFE7]">Venue Photographs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {hall.galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(img)}
              className="lens-hover relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-subtle border border-[rgba(226,184,178,0.2)] group bg-[#18070c]"
            >
              <img
                src={img}
                alt={`${hall.name} view ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#18070c]/30 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Features & Suggested Uses Details — Liquid Glass */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-[rgba(226,184,178,0.22)] space-y-4">
          <h3 className="font-serif text-2xl font-light text-[#F7EFE7]">Hall Features & Facilities</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-[#CBB8B9]">
            {hall.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#e8c7bc] shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          {hall.soundproofingNotes && (
            <div className="p-4 rounded-2xl bg-[#2F0B16]/80 border border-[rgba(226,184,178,0.25)] text-xs text-[#E7CFAF] mt-4 leading-relaxed">
              <strong className="text-[#F7EFE7]">Soundproofing Note:</strong> {hall.soundproofingNotes}
            </div>
          )}
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-[rgba(226,184,178,0.22)] space-y-4">
          <h3 className="font-serif text-2xl font-light text-[#F7EFE7]">Suggested Event Types</h3>
          <p className="text-xs text-[#CBB8B9] leading-relaxed">
            Ideal setups and recommended celebration types:
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-[#F7EFE7] font-medium">
            {hall.suggestedUses.map((use, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#18070c]/60 border border-[rgba(226,184,178,0.2)] flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#e8c7bc]" />
                <span>{use}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel p-5 rounded-2xl text-[#F7EFE7] text-xs space-y-1.5 mt-4 border border-[rgba(226,184,178,0.25)]">
            <div className="flex items-center gap-1.5 text-[#E7CFAF] font-semibold">
              <ShieldAlert className="w-4 h-4 text-[#e8c7bc]" />
              <span>Pricing & Booking Note</span>
            </div>
            <p className="text-[11px] text-[#CBB8B9] leading-relaxed">
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
              className="w-full max-h-[70vh] object-contain rounded-2xl bg-[#18070c] shadow-md border border-[rgba(226,184,178,0.2)]"
            />
            <p className="text-xs text-[#CBB8B9] text-center font-medium">
              Interior view of {hall.name} at Thekkanath Souparnika.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
