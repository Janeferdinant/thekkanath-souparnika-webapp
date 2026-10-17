import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Zap,
  Droplets,
  Car,
  Wind,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  MapPin,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { VENUE_INFO, HALLS, FACILITIES, FAQS } from '../../data/venueData';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const HomePage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const trustBadges = [
    {
      icon: Wind,
      title: 'Air-Conditioned Comfort',
      desc: 'Stage, Welcome & Dining halls are air-conditioned',
    },
    {
      icon: Zap,
      title: 'Solar Hybrid Power',
      desc: 'Dedicated battery backup system for continuous power',
    },
    {
      icon: Droplets,
      title: 'Tested Well Water',
      desc: 'Tested & approved by the water authority',
    },
    {
      icon: Car,
      title: 'On-Site Parking',
      desc: 'Compound parking for 40–50 cars on-site',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden min-h-[580px] sm:min-h-[620px] flex items-end shadow-luxury border border-forest-900/40 bg-forest-950 text-white">
          {/* Hero background image */}
          <img
            src="/assets/venue/venue-006.jpg"
            alt="Thekkanath Souparnika building entrance and facade in Thrissur"
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/50 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/30 text-gold-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>A Gracious Gathering Place in Thrissur</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-cream-50 leading-[1.05]">
              Make room for <br />
              <span className="italic font-normal text-gold-300">what matters most.</span>
            </h1>

            <p className="text-sm sm:text-base text-cream-200 leading-relaxed max-w-xl font-normal">
              Thoughtful spaces for wedding ceremonies, receptions, family feasts, seminars, and cultural programmes — situated at Nellikunnu Market Junction on the PWD bus route.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/enquire">
                <Button variant="gold" size="lg" leftIcon={<Calendar className="w-4 h-4" />}>
                  Check Date / Send Enquiry
                </Button>
              </Link>
              <Link to="/halls">
                <Button variant="outline" size="lg" className="border-cream-300 text-cream-100 hover:bg-forest-900/80">
                  Explore The Four Halls
                </Button>
              </Link>
            </div>

            {/* Bottom info strip inside hero */}
            <div className="pt-6 border-t border-forest-800/80 flex flex-wrap items-center gap-6 text-xs text-cream-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400"></span>
                <span>Four halls (Up to 100 guests per hall)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400"></span>
                <span>Best suited for gatherings up to 300</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400"></span>
                <span>Market Junction, Thrissur</span>
              </div>
            </div>
          </div>

          {/* Quick Info Floating Card */}
          <div className="hidden xl:block absolute right-12 top-12 max-w-xs p-6 rounded-2xl bg-forest-900/80 backdrop-blur-md border border-forest-700/60 shadow-xl space-y-3">
            <div className="font-serif text-2xl font-bold text-gold-300">4 Spaces</div>
            <p className="text-xs text-cream-200 leading-relaxed">
              Stage Hall, Welcome Hall, and Dining Hall are air-conditioned; Open Hall features marble-finish flooring and exhaust airflow.
            </p>
            <div className="text-[11px] text-cream-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Dedicated Event Spaces</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Badges Row */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustBadges.map((badge, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-cream-100/80 border border-cream-200/90 shadow-subtle flex items-start gap-4 transition-transform hover:-translate-y-1 duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0">
                <badge.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-forest-950 font-serif">{badge.title}</h4>
                <p className="text-xs text-ink-600 mt-1 leading-snug">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Four Halls Showcase */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cream-200 pb-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gold-700">Explore Spaces</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
              Four Distinct Halls for Your Gathering
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-600 max-w-md leading-relaxed">
            Every hall is described for up to 100 guests, with the venue best suited for gatherings of up to 300.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HALLS.map((hall) => (
            <div
              key={hall.id}
              className="group bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden shadow-subtle hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              {/* Hall Image */}
              <div className="relative h-48 overflow-hidden bg-forest-950">
                <img
                  src={hall.coverImage}
                  alt={hall.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-forest-900/90 backdrop-blur-sm text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-forest-700">
                  {hall.floor}
                </div>
                <div className="absolute bottom-3 right-3 bg-cream-50/95 text-forest-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow'}
                </div>
              </div>

              {/* Hall Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
                    {hall.name}
                  </h3>
                  <p className="text-xs text-ink-600 mt-2 line-clamp-3 leading-relaxed">
                    {hall.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-cream-200">
                  <div className="flex flex-wrap gap-1.5">
                    {hall.features.slice(0, 2).map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] bg-cream-200 text-ink-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/halls/${hall.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold text-forest-800 bg-cream-100 hover:bg-forest-800 hover:text-white transition-all border border-cream-300"
                  >
                    <span>View Hall Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Facilities Highlights */}
      <section className="bg-forest-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
              Practical Amenities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
              The Essentials Behind Smooth Events
            </h2>
            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
              Every detail is designed for guest comfort, safety, and seamless hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITIES.slice(0, 4).map((fac) => (
              <div
                key={fac.id}
                className="bg-forest-800/80 p-6 rounded-2xl border border-forest-700/60 space-y-3 shadow-md"
              >
                <div className="text-gold-400 font-semibold text-xs tracking-wider uppercase">
                  {fac.badge || fac.category}
                </div>
                <h3 className="font-serif text-lg font-bold text-cream-50">{fac.title}</h3>
                <p className="text-xs text-cream-300 leading-relaxed">{fac.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/facilities">
              <Button variant="gold" size="md" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Explore All Facilities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Guided Photo Tour Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gold-700">Photo Gallery</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
              Real Photographs of the Venue
            </h2>
          </div>
          <Link to="/gallery" className="text-xs font-semibold text-forest-800 hover:text-gold-700 inline-flex items-center gap-1">
            <span>View Full Gallery (All 7 Spaces)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { img: '/assets/venue/venue-000.jpg', title: 'Stage Hall — Raised Stage & Seating' },
            { img: '/assets/venue/venue-001.jpg', title: 'Welcome Hall — Front Entrance Area' },
            { img: '/assets/venue/venue-002.jpg', title: 'Dining Hall — Banquet Tables' },
            { img: '/assets/venue/venue-003.jpg', title: 'Open Hall — Polished Marble Flooring' },
            { img: '/assets/venue/venue-004.jpg', title: 'Dedicated Wash Basin Area' },
            { img: '/assets/venue/venue-005.jpg', title: 'Grand Staircase with Glass Railings' },
            { img: '/assets/venue/venue-006.jpg', title: 'Main Venue Exterior at Market Junction' },
          ].map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(photo.img)}
              className="group relative h-48 rounded-xl overflow-hidden cursor-pointer shadow-subtle border border-cream-300 bg-forest-900"
            >
              <img
                src={photo.img}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="text-white text-xs font-medium flex items-center justify-between w-full">
                  <span className="truncate">{photo.title}</span>
                  <Eye className="w-4 h-4 text-gold-400 shrink-0 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Location & Directions Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-cream-100/90 border border-cream-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-luxury">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 text-gold-700 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Easy to Locate in Thrissur</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
              Opposite RGLP School, Market Junction, Nellikunnu
            </h2>
            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              Situated right at the Market Junction bus stop along the main PWD bus route, with direct highway connectivity for easy arrival from Thrissur town and surrounding districts.
            </p>

            <div className="space-y-2 text-xs text-ink-800 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-700" />
                <span>On-site parking compound for 40 to 50 cars</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-700" />
                <span>Immediate PWD bus route connectivity</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-700" />
                <span>Thrissur – 680005, Kerala</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-forest-800 text-white hover:bg-forest-900 shadow-sm transition-colors"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link to="/contact">
                <Button variant="outline" size="sm">
                  View Full Address & Contacts
                </Button>
              </Link>
            </div>
          </div>

          <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-forest-900/10 border border-cream-300 relative flex items-center justify-center p-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-forest-800 text-gold-400 mx-auto flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-950">Market Junction, Nellikunnu</h3>
              <p className="text-xs text-ink-600 max-w-xs">
                Opposite RGLP School · PWD Bus Route · Thrissur – 680005
              </p>
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-semibold text-gold-700 hover:underline"
              >
                Click for Navigation Map ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-gold-700 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Helpful Information</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-forest-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS.slice(0, 4).map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <h4 className="font-serif text-base font-bold text-forest-950">{faq.question}</h4>
              <p className="text-xs text-ink-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link to="/faq" className="text-xs font-semibold text-forest-800 hover:text-gold-700 underline">
            View All Frequently Asked Questions ↗
          </Link>
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-14 bg-gold-500 text-forest-950 flex flex-col md:flex-row items-center justify-between gap-8 shadow-luxury">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-forest-900">
              Ready to Plan Your Event?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Share your event date and requirements.
            </h2>
            <p className="text-xs sm:text-sm text-forest-900/80 max-w-lg leading-relaxed">
              Our venue management team will verify availability, recommend suitable halls, and follow up promptly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/enquire">
              <Button variant="primary" size="lg" className="bg-forest-900 text-white hover:bg-forest-950">
                Check Date / Enquire Now
              </Button>
            </Link>
            <a href={VENUE_INFO.whatsappUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="lg" className="bg-white text-forest-900 hover:bg-cream-100">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <Modal
          isOpen={Boolean(selectedImage)}
          onClose={() => setSelectedImage(null)}
          title="Thekkanath Souparnika Venue Photograph"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt="Thekkanath Souparnika venue view"
              className="w-full max-h-[70vh] object-contain rounded-xl bg-forest-950"
            />
            <p className="text-xs text-ink-600 text-center">
              Venue celebration gallery at Thekkanath Souparnika.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
