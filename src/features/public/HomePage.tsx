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
import { GlassCard } from '../../glass/GlassCard';
import { GlassSurface } from '../../glass/GlassSurface';
import { RefractiveOverlay } from '../../glass/RefractiveOverlay';
import type { Hall } from '../../types/models';

const GALLERY_PHOTOS = [
  { src: '/assets/venue/venue-000.jpg', title: 'Stage Hall — Raised Stage & Seating' },
  { src: '/assets/venue/venue-001.jpg', title: 'Welcome Hall — Front Entrance Area' },
  { src: '/assets/venue/venue-002.jpg', title: 'Dining Hall — Banquet Tables' },
  { src: '/assets/venue/venue-003.jpg', title: 'Open Hall — Polished Marble Flooring' },
  { src: '/assets/venue/venue-004.jpg', title: 'Dedicated Wash Basin Area' },
  { src: '/assets/venue/venue-005.jpg', title: 'Grand Staircase with Glass Railings' },
  { src: '/assets/venue/venue-006.jpg', title: 'Main Venue Exterior at Market Junction' },
];

const BTN = 'inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-all text-center';
const BTN_GOLD = `${BTN} text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 border border-brand-champagne-400 shadow-luxury hover:scale-[1.02] glass-highlight`;
const BTN_BURGUNDY = `${BTN} text-brand-ivory-100 bg-brand-burgundy-700 hover:bg-brand-burgundy-800 border border-brand-burgundy-700 shadow-md`;
const BTN_OUTLINE_LIGHT = `${BTN} text-brand-burgundy-700 border border-brand-burgundy-700 hover:bg-brand-burgundy-700 hover:text-brand-ivory-100`;
const BTN_OUTLINE_DARK = `${BTN} text-brand-ivory-100 border border-brand-champagne-500 hover:bg-white/10`;

const CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

/** Small eyebrow label: bronze on ivory surfaces, champagne on burgundy. */
const Eyebrow: React.FC<{ tone: 'light' | 'dark'; icon?: React.ReactNode; children: React.ReactNode }> = ({ tone, icon, children }) => (
  <div
    className={`inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] ${
      tone === 'light' ? 'text-brand-bronze-700' : 'text-brand-champagne-400'
    }`}
  >
    {icon ?? <span className="w-4 h-[1px] bg-brand-champagne-500" />}
    <span>{children}</span>
  </div>
);

/** A hall card's photo with its floor and air-conditioning badges. */
const HallCardImage: React.FC<{ hall: Hall }> = ({ hall }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const key = imageKeyForSrc(hall.coverImage);
  return (
    <div className="relative h-52 overflow-hidden bg-brand-burgundy-900 lens-hover rounded-t-[inherit]">
      {key && (
        <ResponsivePicture
          image={key}
          alt={hall.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="block w-full h-full"
          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          imgRef={imgRef}
        />
      )}
      <RefractiveOverlay
        imageRef={imgRef}
        className="absolute top-3 left-3 text-brand-champagne-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
      >
        {hall.floor}
      </RefractiveOverlay>
      <RefractiveOverlay
        imageRef={imgRef}
        className="absolute bottom-3 right-3 text-brand-ivory-100 text-[10px] font-medium px-2.5 py-1 rounded-full"
      >
        {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow'}
      </RefractiveOverlay>
    </div>
  );
};

/** One photo in the homepage gallery: a button that opens the lightbox, with a caption on hover. */
const GalleryTile: React.FC<{ photo: { src: string; title: string }; onOpen: (trigger: HTMLElement) => void }> = ({ photo, onOpen }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      className="group relative h-52 w-full text-left rounded-2xl overflow-hidden shadow-subtle border border-brand-champagne-500 bg-brand-burgundy-900 lens-hover"
    >
      <ResponsivePicture
        image={imageKeyForSrc(photo.src)!}
        alt={photo.title}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="block w-full h-full"
        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        imgRef={imgRef}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-burgundy-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-end p-3"
      >
        <RefractiveOverlay
          imageRef={imgRef}
          className="text-brand-ivory-100 text-xs font-medium flex items-center justify-between w-full rounded-xl px-3 py-2"
        >
          <span className="truncate">{photo.title}</span>
          <Eye className="w-4 h-4 text-brand-champagne-300 shrink-0 ml-1.5" />
        </RefractiveOverlay>
      </div>
    </button>
  );
};

export const HomePage: React.FC = () => {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const galleryTrigger = useRef<HTMLElement | null>(null);

  return (
    <div>
      {/* 1. Hero: golden-hour entrance photo (burgundy) */}
      <HeroSection />

      {/* 2. Venue highlights: one strip of metric tiles (ivory) */}
      <section className="surface-ivory pt-12 sm:pt-16">
        <div className={CONTAINER}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              ['4 Halls', 'Stage, Welcome, Dining & Open'],
              ['250–300 Guests', 'Comfortable size, up to 400'],
              ['3 AC Halls', 'Stage, Welcome & Dining'],
              ['One Event at a Time', 'All four halls reserved for you'],
            ].map(([value, caption]) => (
              <GlassSurface key={value} tone="light" elevation="raised" className="p-6 sm:p-8 text-center space-y-1 border-brand-champagne-500">
                <strong className="block font-serif text-2xl sm:text-3xl font-medium text-brand-burgundy-700">{value}</strong>
                <span className="block text-xs text-brand-charcoal-600">{caption}</span>
              </GlassSurface>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The four spaces (ivory) */}
      <section className="surface-ivory py-16 sm:py-24">
        <div className={`${CONTAINER} space-y-8`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-champagne-500 pb-5">
            <div className="space-y-1">
              <Eyebrow tone="light">The Venue Spaces</Eyebrow>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-charcoal-900 tracking-tight">
                Four Spaces Designed for Your Entire Event
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-charcoal-600 max-w-md leading-relaxed">
              When you book with us, all four halls are exclusively yours. Your guests can move smoothly from the ceremony in the Stage Hall, to the Welcome foyer, upstairs for a traditional sadhya feast, and out to the Open Hall.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HALLS.filter((h) => h.id !== 'auditorium').map((hall) => {
              return (
                <GlassCard key={hall.id} tone="light" className="group overflow-hidden flex flex-col border-brand-champagne-500">
                  <HallCardImage hall={hall} />

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl font-normal text-brand-charcoal-900 mb-1">{hall.name}</h3>

                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-burgundy-700 mb-2">
                        <Users className="w-3.5 h-3.5" />
                        <span>{hall.capacityText}</span>
                      </div>

                      {hall.id === 'dining-hall' && (
                        <div className="mb-2">
                          <span className="text-[10px] bg-brand-burgundy-700 text-brand-champagne-300 px-2 py-0.5 rounded-full font-semibold">
                            Recommended for Feast / Sadhya
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-brand-charcoal-600 mt-1 line-clamp-3 leading-relaxed">{hall.description}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-brand-champagne-500">
                      <div className="flex flex-wrap gap-1.5">
                        {hall.features.slice(0, 2).map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[10px] bg-brand-ivory-200 text-brand-charcoal-900 border border-brand-champagne-500 px-2.5 py-0.5 rounded-full font-medium"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      <Link to={`/halls/${hall.slug}`} className={`${BTN_OUTLINE_LIGHT} w-full`}>
                        <span>View Space Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Facilities highlights (burgundy, dark glass) */}
      <section className="surface-burgundy py-20">
        <div className={`${CONTAINER} space-y-12`}>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-champagne-400 font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-champagne-300" />
              <span>Thoughtful Comforts</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-ivory-100 tracking-tight">
              Thoughtful Amenities for You and Your Guests
            </h2>
            <p className="text-xs sm:text-sm text-brand-ivory-muted leading-relaxed">
              From uninterrupted solar backup power to certified drinking water, we take care of the essentials so your day runs smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITIES.slice(0, 4).map((fac) => (
              <GlassCard key={fac.id} tone="dark" className="p-6 space-y-3">
                <div className="text-brand-champagne-300 font-semibold text-xs tracking-wider uppercase">{fac.badge || fac.category}</div>
                <h3 className="font-serif text-xl font-medium text-brand-ivory-100">{fac.title}</h3>
                <p className="text-xs text-brand-ivory-muted leading-relaxed">{fac.description}</p>
              </GlassCard>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link to="/facilities" className={BTN_OUTLINE_DARK}>
              <span>Explore All Facilities</span>
              <ChevronRight className="w-4 h-4 text-brand-champagne-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Venue walkthrough (alternate ivory) */}
      <section className="surface-ivory-alt py-16 sm:py-24">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Eyebrow tone="light" icon={<Compass className="w-4 h-4 text-brand-bronze-700" />}>
                Venue Walkthrough
              </Eyebrow>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal-900 leading-tight">A Look Inside the Venue</h2>
              <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed">
                Take a look at photos of our ceremonial stage, banquet dining hall, and welcoming reception foyer. You are always welcome to stop by Market Junction, Nellikunnu to see everything in person.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/gallery" className={BTN_BURGUNDY}>
                  <span>View Full Photo Tour</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/contact" className={BTN_OUTLINE_LIGHT}>
                  <span>Schedule In-Person Visit</span>
                </Link>
              </div>
            </div>

            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-brand-burgundy-900 border border-brand-champagne-500 lens-hover">
              <ResponsivePicture
                image="venue-000"
                alt="Stage Hall raised stage and cushioned seating"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="block w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy-950 via-transparent to-transparent flex items-end p-6">
                <div className="flex items-center justify-between w-full text-xs text-brand-ivory-100">
                  <span>Stage Hall — Ground Floor Air-Conditioned</span>
                  <span className="text-[10px] uppercase tracking-wider text-brand-champagne-300 font-bold">Featured Space</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Photo gallery preview (ivory) */}
      <section className="surface-ivory py-16 sm:py-24">
        <div className={`${CONTAINER} space-y-8`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-champagne-500 pb-5">
            <div className="space-y-1">
              <Eyebrow tone="light">Photo Gallery</Eyebrow>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal-900 tracking-tight">
                Real Photographs of the Venue
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-xs font-semibold text-brand-burgundy-700 hover:text-brand-burgundy-600 inline-flex items-center gap-1.5 min-h-[44px] transition-colors"
            >
              <span>View Full Gallery (All 7 Spaces)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {GALLERY_PHOTOS.map((photo, idx) => (
              <GalleryTile
                key={photo.src}
                photo={photo}
                onOpen={(trigger) => {
                  galleryTrigger.current = trigger;
                  setGalleryIndex(idx);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Location and directions (alternate ivory) */}
      <section className="surface-ivory-alt py-16 sm:py-24">
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`}>
          <div className="space-y-5">
            <Eyebrow tone="light" icon={<MapPin className="w-4 h-4 text-brand-bronze-700" />}>
              Easy to Locate in Thrissur
            </Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal-900 tracking-tight leading-tight">
              Easy to Find on the Main PWD Bus Route
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed">
              Located right by the Market Junction bus stop along the main PWD bus route in Nellikunnu, with direct roads connecting to Thrissur town and the national highway.
            </p>

            <div className="space-y-2.5 text-xs text-brand-charcoal-900 pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-burgundy-700" />
                <span>Immediate PWD bus route stop connectivity</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-burgundy-700" />
                <span>Thrissur – 680005, Kerala, India</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a href={VENUE_INFO.googleMapsUrl} target="_blank" rel="noreferrer" className={BTN_BURGUNDY}>
                <span>Open in Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link to="/contact" className={BTN_OUTLINE_LIGHT}>
                <span>View Full Contacts</span>
              </Link>
            </div>
          </div>

          <GlassSurface tone="dark" elevation="raised" className="h-64 sm:h-80 relative flex items-center justify-center p-6 text-center">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-burgundy-700 text-brand-champagne-300 border border-brand-champagne-500 mx-auto flex items-center justify-center shadow-md">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-medium text-xl text-brand-ivory-100">Market Junction, Nellikunnu</h3>
              <p className="text-xs text-brand-ivory-muted max-w-xs">Opposite RGLP School · PWD Bus Route · Thrissur – 680005</p>
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center min-h-[44px] text-xs font-semibold text-brand-champagne-300 hover:text-brand-ivory-100 hover:underline"
              >
                Click for Navigation Map ↗
              </a>
            </div>
          </GlassSurface>
        </div>
      </section>

      {/* 8. Frequently asked questions preview (ivory) */}
      <section className="surface-ivory py-16 sm:py-24">
        <div className={`${CONTAINER} space-y-6`}>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Eyebrow tone="light" icon={<HelpCircle className="w-4 h-4 text-brand-bronze-700" />}>
              Helpful Information
            </Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal-900">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {HOME_FAQ_IDS.map((id) => FAQS.find((f) => f.id === id)!).map((faq) => (
              <GlassCard key={faq.id} tone="light" className="p-6 space-y-2 border-brand-champagne-500">
                <h3 className="font-serif text-lg font-medium text-brand-charcoal-900 leading-snug">{faq.question}</h3>
                <p className="text-xs text-brand-charcoal-600 leading-relaxed">{faq.answer}</p>
              </GlassCard>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/faq"
              className="inline-flex items-center min-h-[44px] text-xs font-semibold text-brand-burgundy-700 hover:text-brand-burgundy-600 underline transition-colors"
            >
              View All Frequently Asked Questions ↗
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Call to action (burgundy) */}
      <section className="surface-burgundy py-16 sm:py-20">
        <div className={`${CONTAINER} flex flex-col md:flex-row items-center justify-between gap-8`}>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-brand-champagne-300">
              Plan Your Special Occasion
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-brand-ivory-100">
              Planning an upcoming celebration?
            </h2>
            <p className="text-xs sm:text-sm text-brand-ivory-muted max-w-lg leading-relaxed">
              Let us know your preferred date. We'll check the calendar, answer all your questions, and help you plan your booking without any hassle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full sm:w-auto">
            <Link to="/enquire" className={BTN_GOLD}>
              <Calendar className="w-3.5 h-3.5" />
              <span>Check Date / Enquire Now</span>
            </Link>
            <a href={VENUE_INFO.whatsappUrl} target="_blank" rel="noreferrer" className={BTN_OUTLINE_DARK}>
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
