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
import { AmbientParticles } from '../../components/public/AmbientParticles';

export const HomePage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const trustBadges = [
    {
      icon: Wind,
      title: 'Air-Conditioned Comfort',
      desc: 'Stage, Welcome & Dining halls are climate-controlled with modern AC units',
    },
    {
      icon: Zap,
      title: 'Solar Hybrid Power',
      desc: 'Seamless uninterrupted power with solar hybrid inverter & battery reserve',
    },
    {
      icon: Droplets,
      title: 'Tested Well Water',
      desc: 'Tested and certified by Kerala Water Authority for absolute purity',
    },
    {
      icon: Car,
      title: 'On-Site Compound Parking',
      desc: 'Spacious secure compound parking for 40–50 cars on-site',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section — Burgundy & Rose Gold with Liquid Glass & Ambient Particles */}
      <section className="pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-end shadow-luxury border border-rose-300/30 bg-gradient-to-br from-wine-950 via-burgundy-950 to-plum-950 text-white">
          {/* Hero background image with luxury luminescence */}
          <img
            src="/assets/venue/venue-006.jpg"
            alt="Thekkanath Souparnika building entrance and facade in Thrissur"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100 pointer-events-none"
          />

          {/* Opulent burgundy gradients over image */}
          <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-wine-950/95 via-burgundy-950/70 to-transparent pointer-events-none" />

          {/* Ambient Particles floating in Hero */}
          <AmbientParticles variant="hero" count={35} className="z-0 opacity-75" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-3xl space-y-6 sm:space-y-7">
            {/* Top luxury badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-rose-300/40 text-gold-300 text-xs font-semibold tracking-wider uppercase shadow-glass">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>A Gracious Gathering Place in Thrissur</span>
            </div>

            {/* Cormorant Garamond luxury headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-cream-50 leading-[1.06]">
              Make room for <br />
              <span className="italic font-normal bg-gradient-to-r from-gold-300 via-rose-300 to-gold-400 bg-clip-text text-transparent">
                what matters most.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-cream-200 leading-relaxed max-w-xl font-normal">
              Thoughtful spaces for wedding ceremonies, receptions, family feasts, seminars, and cultural gatherings — situated at Nellikunnu Market Junction on the PWD bus route.
            </p>

            {/* Action buttons with mobile-first responsiveness */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link to="/enquire" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full sm:w-auto shadow-luxury hover:scale-[1.02]"
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Check Date / Send Enquiry
                </Button>
              </Link>
              <Link to="/halls" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-rose-200/40 text-cream-100 hover:bg-white/10 backdrop-blur-md"
                >
                  Explore The Four Halls
                </Button>
              </Link>
            </div>

            {/* Bottom info strip inside hero */}
            <div className="pt-6 border-t border-rose-300/20 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-cream-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400" />
                <span>Four coordinated halls (Up to 100 guests per hall)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Best suited for gatherings up to 300</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400" />
                <span>Nellikunnu Market Junction, Thrissur</span>
              </div>
            </div>
          </div>

          {/* Quick Info Floating Liquid Glass Card */}
          <div className="hidden xl:block absolute right-12 top-12 max-w-xs p-6 rounded-3xl bg-wine-950/70 backdrop-blur-xl border border-rose-300/30 shadow-[0_12px_40px_0_rgba(26,5,16,0.6)] space-y-3 z-10">
            <div className="flex items-center justify-between">
              <div className="font-serif text-3xl font-bold bg-gradient-to-r from-gold-300 to-rose-300 bg-clip-text text-transparent">
                4 Spaces
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <p className="text-xs text-cream-200 leading-relaxed">
              Stage Hall, Welcome Hall, and Dining Hall are air-conditioned; Open Hall features polished marble flooring with exhaust airflow.
            </p>
            <div className="text-[11px] text-rose-200/80 flex items-center gap-1.5 pt-1 border-t border-rose-300/20">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Full Auditorium or Coordinated Halls</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Badges Row — Liquid Glass Cards with Refraction Borders */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trustBadges.map((badge, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/70 shadow-[0_8px_30px_rgb(74,14,23,0.06)] hover:shadow-[0_16px_40px_rgb(74,14,23,0.14)] hover:border-gold-400/80 transition-all duration-300 hover:-translate-y-1 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burgundy-900 to-wine-950 text-gold-300 border border-gold-400/30 flex items-center justify-center shrink-0 shadow-md">
                <badge.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-burgundy-950 font-serif leading-tight">
                  {badge.title}
                </h4>
                <p className="text-xs text-ink-600 mt-1.5 leading-relaxed">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Four Halls Showcase — Liquid Glass Cards with Cormorant Garamond */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-rose-100 pb-5">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              <span>Explore Spaces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950 tracking-tight">
              Four Distinct Halls for Your Gathering
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-600 max-w-md leading-relaxed">
            Every hall is thoughtfully curated for up to 100 guests, with the venue best suited for gatherings of up to 300 overall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HALLS.map((hall) => (
            <div
              key={hall.id}
              className="group bg-white/80 backdrop-blur-xl rounded-3xl border border-rose-200/60 overflow-hidden shadow-[0_8px_30px_rgb(74,14,23,0.06)] hover:shadow-[0_20px_50px_rgb(74,14,23,0.16)] hover:border-gold-400/70 transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Hall Image */}
              <div className="relative h-52 overflow-hidden bg-wine-950">
                <img
                  src={hall.coverImage}
                  alt={hall.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-wine-950/85 backdrop-blur-md text-gold-300 text-[11px] font-bold px-3 py-1 rounded-full border border-gold-400/30 shadow-md">
                  {hall.floor}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-burgundy-950 text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-rose-100">
                  {hall.airConditioned ? 'Air-Conditioned' : 'Natural Airflow'}
                </div>
              </div>

              {/* Hall Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-burgundy-950 group-hover:text-burgundy-800 transition-colors">
                    {hall.name}
                  </h3>
                  <p className="text-xs text-ink-600 mt-2 line-clamp-3 leading-relaxed">
                    {hall.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-rose-100">
                  <div className="flex flex-wrap gap-1.5">
                    {hall.features.slice(0, 2).map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[11px] bg-rose-50 text-burgundy-900 border border-rose-200/60 px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/halls/${hall.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-semibold text-burgundy-900 bg-rose-50 hover:bg-gradient-to-r hover:from-burgundy-900 hover:to-wine-900 hover:text-white transition-all border border-rose-200/80 group-hover:border-burgundy-900 shadow-sm"
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

      {/* 4. Facilities Highlights — Opulent Deep Wine & Liquid Glass */}
      <section className="bg-gradient-to-b from-burgundy-950 via-wine-950 to-plum-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient subtle glow effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practical Amenities</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 tracking-tight">
              The Essentials Behind Smooth Events
            </h2>
            <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
              Every amenity is engineered for guest comfort, safety, and effortless hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACILITIES.slice(0, 4).map((fac) => (
              <div
                key={fac.id}
                className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-rose-300/20 hover:border-gold-400/50 space-y-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-gold-400 font-semibold text-xs tracking-wider uppercase">
                  {fac.badge || fac.category}
                </div>
                <h3 className="font-serif text-xl font-bold text-cream-50">{fac.title}</h3>
                <p className="text-xs text-cream-200 leading-relaxed">{fac.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-rose-100 pb-5">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              <span>Photo Gallery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950 tracking-tight">
              Real Photographs of the Venue
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-semibold text-burgundy-900 hover:text-gold-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Gallery (All 7 Spaces)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
              className="group relative h-52 rounded-2xl overflow-hidden cursor-pointer shadow-subtle border border-rose-200/80 bg-wine-950"
            >
              <img
                src={photo.img}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white text-xs font-medium flex items-center justify-between w-full">
                  <span className="truncate">{photo.title}</span>
                  <Eye className="w-4 h-4 text-gold-400 shrink-0 ml-1.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Location & Directions Section — Liquid Glass Container */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 bg-white/80 backdrop-blur-xl border border-rose-200/80 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-luxury">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Easy to Locate in Thrissur</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950 tracking-tight leading-tight">
              Opposite RGLP School, Market Junction, Nellikunnu
            </h2>
            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              Situated right at the Market Junction bus stop along the main PWD bus route, with direct highway connectivity for easy arrival from Thrissur town and surrounding districts.
            </p>

            <div className="space-y-2.5 text-xs text-ink-800 pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-burgundy-700" />
                <span>On-site compound parking for 40 to 50 cars</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-burgundy-700" />
                <span>Immediate PWD bus route stop connectivity</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-burgundy-700" />
                <span>Thrissur – 680005, Kerala, India</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-burgundy-900 to-wine-900 text-white hover:from-burgundy-950 hover:to-wine-950 shadow-md transition-all hover:scale-[1.02]"
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

          <div className="h-64 sm:h-80 rounded-3xl overflow-hidden bg-rose-50/70 border border-rose-200/80 relative flex items-center justify-center p-6 text-center shadow-inner">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-burgundy-900 to-wine-950 text-gold-300 mx-auto flex items-center justify-center shadow-md">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-xl text-burgundy-950">Market Junction, Nellikunnu</h3>
              <p className="text-xs text-ink-600 max-w-xs">
                Opposite RGLP School · PWD Bus Route · Thrissur – 680005
              </p>
              <a
                href={VENUE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-semibold text-rose-700 hover:text-burgundy-950 hover:underline"
              >
                Click for Interactive Navigation Map ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Helpful Information</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {FAQS.slice(0, 4).map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/70 space-y-2 shadow-subtle hover:border-gold-400/60 transition-colors"
            >
              <h4 className="font-serif text-lg font-bold text-burgundy-950 leading-snug">
                {faq.question}
              </h4>
              <p className="text-xs text-ink-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/faq"
            className="text-xs font-semibold text-burgundy-900 hover:text-rose-700 underline transition-colors"
          >
            View All Frequently Asked Questions ↗
          </Link>
        </div>
      </section>

      {/* 8. Call to Action Banner — Burgundy & Rose Gold Luxury */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-wine-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-luxury border border-rose-300/30">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-gold-400">
              Ready to Plan Your Event?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
              Share your event date and requirements.
            </h2>
            <p className="text-xs sm:text-sm text-cream-200/90 max-w-lg leading-relaxed">
              Our venue management team will verify availability, recommend suitable halls, and follow up promptly with formal terms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full sm:w-auto">
            <Link to="/enquire" className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="lg"
                className="w-full sm:w-auto shadow-luxury hover:scale-[1.02]"
              >
                Check Date / Enquire Now
              </Button>
            </Link>
            <a
              href={VENUE_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-white/90 text-burgundy-950 hover:bg-white"
              >
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
              className="w-full max-h-[70vh] object-contain rounded-2xl bg-wine-950 shadow-md"
            />
            <p className="text-xs text-rose-900/80 text-center font-medium">
              Venue celebration gallery at Thekkanath Souparnika.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
