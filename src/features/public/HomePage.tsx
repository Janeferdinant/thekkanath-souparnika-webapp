import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Eye,
  MapPin,
  ChevronRight,
  HelpCircle,
  Compass,
  Users,
} from 'lucide-react';
import { VENUE_INFO, HALLS, FACILITIES, FAQS, HOME_FAQ_IDS } from '../../data/venueData';
import { Lightbox } from '../../components/public/Lightbox';
import { ResponsivePicture, imageKeyForSrc } from '../../components/public/ResponsivePicture';
import { HeroSection } from '../../components/public/HeroSection';

const GALLERY_PHOTOS = [
  { src: '/assets/venue/venue-000.jpg', title: 'Stage Hall — Raised Stage & Seating' },
  { src: '/assets/venue/venue-001.jpg', title: 'Welcome Hall — Front Entrance Area' },
  { src: '/assets/venue/venue-002.jpg', title: 'Dining Hall — Banquet Tables' },
  { src: '/assets/venue/venue-003.jpg', title: 'Open Hall — Polished Marble Flooring' },
  { src: '/assets/venue/venue-004.jpg', title: 'Dedicated Wash Basin Area' },
  { src: '/assets/venue/venue-005.jpg', title: 'Grand Staircase with Glass Railings' },
  { src: '/assets/venue/venue-006.jpg', title: 'Main Venue Exterior at Market Junction' },
];

export const HomePage: React.FC = () => {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const galleryTrigger = useRef<HTMLElement | null>(null);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero: golden-hour entrance photo */}
      <HeroSection />

      {/* 2. Venue Highlights — one strip of editorial metric tiles */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[rgba(226,184,178,0.22)] border border-[rgba(226,184,178,0.22)] rounded-3xl overflow-hidden shadow-luxury">
          <div className="bg-[#240810]/85 p-6 sm:p-8 text-center space-y-1">
            <strong className="block font-serif text-2xl sm:text-3xl font-medium text-[#e2b8b2]">
              4 Halls
            </strong>
            <span className="text-xs text-[rgba(203,184,185,0.85)]">
              Stage, Welcome, Dining &amp; Open
            </span>
          </div>
          <div className="bg-[#240810]/85 p-6 sm:p-8 text-center space-y-1">
            <strong className="block font-serif text-2xl sm:text-3xl font-medium text-[#e7cfaf]">
              250–300 Guests
            </strong>
            <span className="text-xs text-[rgba(203,184,185,0.85)]">
              Comfortable size, up to 400
            </span>
          </div>
          <div className="bg-[#240810]/85 p-6 sm:p-8 text-center space-y-1">
            <strong className="block font-serif text-2xl sm:text-3xl font-medium text-[#e2b8b2]">
              3 AC Halls
            </strong>
            <span className="text-xs text-[rgba(203,184,185,0.85)]">
              Stage, Welcome &amp; Dining
            </span>
          </div>
          <div className="bg-[#240810]/85 p-6 sm:p-8 text-center space-y-1">
            <strong className="block font-serif text-2xl sm:text-3xl font-medium text-[#e7cfaf]">
              One Event at a Time
            </strong>
            <span className="text-xs text-[rgba(203,184,185,0.85)]">
              All four halls reserved for you
            </span>
          </div>
        </div>
      </section>

      {/* 4. The Four Spaces Showcase — All Spaces Included */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(226,184,178,0.2)] pb-5">
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#e2b8b2] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#c58e91]" />
              <span>The Venue Spaces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f7efe7] tracking-tight">
              Four Spaces Designed for Your Entire Event
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] max-w-md leading-relaxed">
            When you book with us, all four halls are exclusively yours. Your guests can move smoothly from the ceremony in the Stage Hall, to the Welcome foyer, upstairs for a traditional sadhya feast, and out to the Open Hall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HALLS.filter((h) => h.id !== 'auditorium').map((hall) => (
            <div
              key={hall.id}
              className="group glass-panel rounded-3xl border border-[rgba(226,184,178,0.22)] overflow-hidden shadow-subtle hover:border-[rgba(226,184,178,0.5)] transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Hall Image with Lens Hover Effect */}
              <div className="relative h-52 overflow-hidden bg-[#240810] lens-hover">
                <img
                  src={hall.coverImage}
                  alt={hall.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#18070c]/85 backdrop-blur-md text-[#e7cfaf] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[rgba(226,184,178,0.3)] shadow-md">
                  {hall.floor}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#2f0b16]/90 backdrop-blur-sm text-[#f7efe7] text-[10px] font-medium px-2.5 py-1 rounded-full shadow-md border border-[rgba(226,184,178,0.2)]">
                  {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow'}
                </div>
              </div>

              {/* Hall Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between gap-1 mb-1">
                    <h3 className="font-serif text-2xl font-normal text-[#f7efe7] group-hover:text-[#e7cfaf] transition-colors">
                      {hall.name}
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#e7cfaf] mb-2">
                    <Users className="w-3.5 h-3.5 text-[#e8c7bc]" />
                    <span>{hall.capacityText}</span>
                  </div>

                  {hall.id === 'dining-hall' && (
                    <div className="mb-2">
                      <span className="text-[10px] bg-[#451323] text-[#F3E5AB] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full font-semibold">
                        Recommended for Feast / Sadhya
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-[rgba(203,184,185,0.85)] mt-1 line-clamp-3 leading-relaxed">
                    {hall.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[rgba(226,184,178,0.18)]">
                  <div className="flex flex-wrap gap-1.5">
                    {hall.features.slice(0, 2).map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] bg-white/5 text-[#e2b8b2] border border-[rgba(226,184,178,0.22)] px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/halls/${hall.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-semibold text-[#f7efe7] bg-white/5 hover:bg-gradient-to-r hover:from-[#e8c7bc] hover:to-[#c58e91] hover:text-[#2c0c15] transition-all border border-[rgba(226,184,178,0.24)] shadow-sm"
                  >
                    <span>View Space Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Facilities Highlights — Cinematic Dark Wine & Glass */}
      <section className="bg-gradient-to-b from-[#240810] via-[#1c070c] to-[#18070c] text-[#f7efe7] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-[rgba(226,184,178,0.18)]">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#e2b8b2] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#e7cfaf]" />
              <span>Thoughtful Comforts</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f7efe7] tracking-tight">
              Thoughtful Amenities for You and Your Guests
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] leading-relaxed">
              From uninterrupted solar backup power to certified drinking water, we take care of the essentials so your day runs smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITIES.slice(0, 4).map((fac) => (
              <div
                key={fac.id}
                className="glass-panel p-6 rounded-3xl border border-[rgba(226,184,178,0.22)] hover:border-[rgba(226,184,178,0.45)] space-y-3 shadow-luxury transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-[#e7cfaf] font-semibold text-xs tracking-wider uppercase">
                  {fac.badge || fac.category}
                </div>
                <h3 className="font-serif text-xl font-medium text-[#f7efe7]">{fac.title}</h3>
                <p className="text-xs text-[rgba(203,184,185,0.85)] leading-relaxed">{fac.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/facilities"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#f7efe7] bg-white/5 hover:bg-white/10 border border-[rgba(226,184,178,0.35)] backdrop-blur-md transition-all glass-control"
            >
              <span>Explore All Facilities</span>
              <ChevronRight className="w-4 h-4 text-[#e7cfaf]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Virtual Tour Entry Point */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 sm:p-12 rounded-3xl glass-panel border border-[rgba(226,184,178,0.22)] shadow-luxury">
          <div className="space-y-4">
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#e2b8b2] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#e7cfaf]" />
              <span>Venue Walkthrough</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#f7efe7] leading-tight">
              A Look Inside the Venue
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] leading-relaxed">
              Take a look at photos of our ceremonial stage, banquet dining hall, and welcoming reception foyer. You are always welcome to stop by Market Junction, Nellikunnu to see everything in person.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#2c0c15] bg-gradient-to-r from-[#e8c7bc] via-[#d8aba2] to-[#c58e91] hover:from-[#f3ded8] hover:to-[#d4a098] shadow-md transition-all glass-highlight"
              >
                <span>View Full Photo Tour</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#f7efe7] bg-white/5 hover:bg-white/10 border border-[rgba(226,184,178,0.24)] transition-all glass-control"
              >
                <span>Schedule In-Person Visit</span>
              </Link>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#240810] border border-[rgba(226,184,178,0.2)] lens-hover">
            <img
              src="/assets/venue/venue-000.jpg"
              alt="Stage Hall raised stage and cushioned seating"
              className="w-full h-full object-cover opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18070c]/90 via-transparent to-transparent flex items-end p-6">
              <div className="flex items-center justify-between w-full text-xs text-[#f7efe7]">
                <span>Stage Hall — Ground Floor Air-Conditioned</span>
                <span className="text-[10px] uppercase tracking-wider text-[#e7cfaf] font-bold">Featured Space</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Guided Photo Tour Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(226,184,178,0.2)] pb-5">
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#e2b8b2] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#c58e91]" />
              <span>Photo Gallery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#f7efe7] tracking-tight">
              Real Photographs of the Venue
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-semibold text-[#e2b8b2] hover:text-[#e7cfaf] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Gallery (All 7 Spaces)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <button
              type="button"
              key={photo.src}
              onClick={(e) => {
                galleryTrigger.current = e.currentTarget;
                setGalleryIndex(idx);
              }}
              className="group relative h-52 w-full text-left rounded-2xl overflow-hidden shadow-subtle border border-[rgba(226,184,178,0.22)] bg-[#240810] lens-hover"
            >
              <ResponsivePicture
                image={imageKeyForSrc(photo.src)!}
                alt={photo.title}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="block w-full h-full"
                imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#18070c]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-end p-4"
              >
                <div className="text-[#f7efe7] text-xs font-medium flex items-center justify-between w-full">
                  <span className="truncate">{photo.title}</span>
                  <Eye className="w-4 h-4 text-[#e7cfaf] shrink-0 ml-1.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 8. Location & Directions Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 glass-panel border border-[rgba(226,184,178,0.22)] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-luxury">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-[#e2b8b2] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#e7cfaf]" />
              <span>Easy to Locate in Thrissur</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#f7efe7] tracking-tight leading-tight">
              Easy to Find on the Main PWD Bus Route
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] leading-relaxed">
              Located right by the Market Junction bus stop along the main PWD bus route in Nellikunnu, with direct roads connecting to Thrissur town and the national highway.
            </p>

            <div className="space-y-2.5 text-xs text-[rgba(203,184,185,0.9)] pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c58e91]" />
                <span>Immediate PWD bus route stop connectivity</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c58e91]" />
                <span>Thrissur – 680005, Kerala, India</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-gradient-to-r from-[#e8c7bc] via-[#d8aba2] to-[#c58e91] text-[#2c0c15] shadow-md transition-all hover:scale-[1.02] glass-highlight"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-full text-xs font-medium text-[#f7efe7] bg-white/5 hover:bg-white/10 border border-[rgba(226,184,178,0.24)] glass-control"
              >
                <span>View Full Contacts</span>
              </Link>
            </div>
          </div>

          <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#240810]/80 border border-[rgba(226,184,178,0.22)] relative flex items-center justify-center p-6 text-center shadow-inner">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#451323] to-[#2f0b16] text-[#e7cfaf] border border-[rgba(226,184,178,0.3)] mx-auto flex items-center justify-center shadow-md">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-medium text-xl text-[#f7efe7]">Market Junction, Nellikunnu</h3>
              <p className="text-xs text-[rgba(203,184,185,0.85)] max-w-xs">
                Opposite RGLP School · PWD Bus Route · Thrissur – 680005
              </p>
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-semibold text-[#e2b8b2] hover:text-[#e7cfaf] hover:underline"
              >
                Click for Navigation Map ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#e2b8b2] flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#e7cfaf]" />
            <span>Helpful Information</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#f7efe7]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {HOME_FAQ_IDS.map((id) => FAQS.find((f) => f.id === id)!).map((faq) => (
            <div
              key={faq.id}
              className="p-6 rounded-3xl glass-panel border border-[rgba(226,184,178,0.22)] space-y-2 shadow-subtle hover:border-[rgba(226,184,178,0.45)] transition-colors"
            >
              <h4 className="font-serif text-lg font-medium text-[#f7efe7] leading-snug">
                {faq.question}
              </h4>
              <p className="text-xs text-[rgba(203,184,185,0.85)] leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/faq"
            className="text-xs font-semibold text-[#e2b8b2] hover:text-[#e7cfaf] underline transition-colors"
          >
            View All Frequently Asked Questions ↗
          </Link>
        </div>
      </section>

      {/* 10. Call to Action Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl sm:rounded-[2rem] p-8 sm:p-14 bg-gradient-to-r from-[#2f0b16] via-[#451323] to-[#240810] text-[#f7efe7] flex flex-col md:flex-row items-center justify-between gap-8 shadow-luxury border border-[rgba(226,184,178,0.24)]">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-[#e7cfaf]">
              Plan Your Special Occasion
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-[#f7efe7]">
              Planning an upcoming celebration?
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] max-w-lg leading-relaxed">
              Let us know your preferred date. We'll check the calendar, answer all your questions, and help you plan your booking without any hassle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full sm:w-auto">
            <Link
              to="/enquire"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#2c0c15] bg-gradient-to-r from-[#e8c7bc] via-[#d8aba2] to-[#c58e91] hover:from-[#f3ded8] hover:to-[#d4a098] shadow-luxury transition-all hover:scale-[1.02] glass-highlight text-center"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Check Date / Enquire Now</span>
            </Link>
            <a
              href={VENUE_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#f7efe7] bg-white/5 hover:bg-white/10 border border-[rgba(226,184,178,0.24)] transition-all glass-control text-center"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Shared photo lightbox */}
      <Lightbox photos={GALLERY_PHOTOS} index={galleryIndex} onIndexChange={setGalleryIndex} returnFocusRef={galleryTrigger} />
    </div>
  );
};
