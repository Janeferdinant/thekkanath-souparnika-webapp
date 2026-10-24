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
  Compass,
  Users,
} from 'lucide-react';
import { VENUE_INFO, HALLS, FACILITIES, FAQS } from '../../data/venueData';
import { Modal } from '../../components/ui/Modal';
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
      {/* 1. Hero Section — Dark Burgundy + Rose Gold Editorial Experience */}
      <section className="pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl sm:rounded-[2rem] overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-end shadow-luxury border border-[rgba(226,184,178,0.22)] bg-gradient-to-br from-[#260811] via-[#431320] to-[#1c070c] text-[#f7efe7]">
          {/* Hero background image with luxury luminescence */}
          <img
            src="/assets/venue/venue-006.jpg"
            alt="Thekkanath Souparnika building entrance and facade in Thrissur"
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100 pointer-events-none"
            fetchPriority="high"
          />

          {/* Graded dark wine overlays for optimal editorial contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#18070c]/95 via-[#240810]/85 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18070c] via-[#240810]/70 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(226,184,178,0.15),transparent_35%)] pointer-events-none" />

          {/* Ambient Particles in Hero (Sparse, 28 desktop / 12 mobile, gentle bokeh) */}
          <AmbientParticles variant="hero" className="z-0 opacity-80" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-3xl space-y-6 sm:space-y-7">
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#e2b8b2]">
              <span className="w-6 h-[1px] bg-[#c58e91]" />
              <span>Traditional & Contemporary Celebrations in Thrissur</span>
            </div>

            {/* Cormorant Garamond Editorial Display Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#f7efe7] leading-[1.02]">
              Where family milestones <br />
              <em className="text-[#e2b8b2] not-italic font-normal">
                feel truly special.
              </em>
            </h1>

            <p className="text-sm sm:text-base text-[#e4d2d0] leading-relaxed max-w-xl font-normal">
              Four coordinated halls—three with continuous air-conditioning—designed for weddings, engagements, baptisms, and family gatherings. Featuring batch dining for 100 guests, safe ground-floor accessibility for elders, and ample on-site parking at Market Junction, Nellikunnu.
            </p>

            {/* Responsive Actions with Specular Highlight Sheen */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/halls"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#2c0c15] bg-gradient-to-r from-[#e8c7bc] via-[#d8aba2] to-[#c58e91] hover:from-[#f3ded8] hover:to-[#d4a098] shadow-luxury border border-[#e9c6b9] transition-all hover:scale-[1.02] glass-highlight"
              >
                <span>Explore Our Hall Spaces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#f7efe7] bg-[#2c0812]/50 hover:bg-[#2c0812]/80 border border-[rgba(226,184,178,0.35)] backdrop-blur-md transition-all glass-control"
              >
                <Calendar className="w-3.5 h-3.5 text-[#e7cfaf]" />
                <span>Check Date / Enquire</span>
              </Link>
            </div>

            {/* Key Venue Distinction Note */}
            <div className="pt-6 border-t border-[rgba(226,184,178,0.18)] flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[rgba(203,184,185,0.85)]">
              <div className="flex items-center gap-2 border-l border-[#8f4b58] pl-3">
                <Users className="w-3.5 h-3.5 text-[#e7cfaf]" />
                <span>Ideal for 250 to 300 Guests (Up to 400)</span>
              </div>
              <div className="flex items-center gap-2 border-l border-[#8f4b58] pl-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e7cfaf]" />
                <span>Three Air-Conditioned Halls</span>
              </div>
              <div className="flex items-center gap-2 border-l border-[#8f4b58] pl-3">
                <Car className="w-3.5 h-3.5 text-[#e7cfaf]" />
                <span>40–50 Dedicated On-Site Parking</span>
              </div>
            </div>
          </div>

          {/* Floating Liquid Glass Info Panel */}
          <div className="hidden xl:block absolute right-12 top-12 max-w-xs p-6 rounded-3xl glass-panel text-[#f7efe7] space-y-3 z-10 border border-[rgba(226,184,178,0.24)]">
            <div className="flex items-center justify-between">
              <div className="font-serif text-3xl font-medium text-[#e7cfaf]">
                4 Spaces
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <p className="text-xs text-[rgba(203,184,185,0.9)] leading-relaxed">
              Stage Hall, Welcome Hall, and Dining Hall are air-conditioned; Open Hall features natural airflow. Dining Hall features 100 seats in one sitting.
            </p>
            <div className="text-[11px] text-[#e2b8b2] flex items-center gap-1.5 pt-1 border-t border-[rgba(226,184,178,0.2)]">
              <ShieldCheck className="w-4 h-4 text-[#e7cfaf]" />
              <span>Single Unified Venue Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Details Row — 4 Refined Editorial Metric Tiles */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[rgba(226,184,178,0.22)] border border-[rgba(226,184,178,0.22)] rounded-3xl overflow-hidden shadow-luxury">
          <div className="bg-[#240810]/85 p-6 sm:p-8 text-center space-y-1">
            <strong className="block font-serif text-2xl sm:text-3xl font-medium text-[#e2b8b2]">
              4 Spaces
            </strong>
            <span className="text-xs text-[rgba(203,184,185,0.85)]">
              Stage, Welcome, Dining & Open
            </span>
          </div>
          <div className="bg-[#240810]/85 p-6 sm:p-8 text-center space-y-1">
            <strong className="block font-serif text-2xl sm:text-3xl font-medium text-[#e7cfaf]">
              250–300
            </strong>
            <span className="text-xs text-[rgba(203,184,185,0.85)]">
              Ideal gathering size (Up to 400)
            </span>
          </div>
          <div className="bg-[#240810]/85 p-6 sm:p-8 text-center space-y-1">
            <strong className="block font-serif text-2xl sm:text-3xl font-medium text-[#e2b8b2]">
              40–50 Cars
            </strong>
            <span className="text-xs text-[rgba(203,184,185,0.85)]">
              Dedicated compound parking
            </span>
          </div>
          <div className="bg-[#240810]/85 p-6 sm:p-8 text-center space-y-1">
            <strong className="block font-serif text-2xl sm:text-3xl font-medium text-[#e7cfaf]">
              Solar Hybrid
            </strong>
            <span className="text-xs text-[rgba(203,184,185,0.85)]">
              Uninterrupted battery backup
            </span>
          </div>
        </div>
      </section>

      {/* 3. Trust Badges Row — Translucent Liquid Glass Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trustBadges.map((badge, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-panel border border-[rgba(226,184,178,0.22)] shadow-subtle hover:border-[rgba(226,184,178,0.45)] transition-all duration-300 hover:-translate-y-1 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#451323] to-[#2f0b16] text-[#e7cfaf] border border-[rgba(226,184,178,0.3)] flex items-center justify-center shrink-0 shadow-md">
                <badge.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-serif font-medium text-[#f7efe7] leading-tight">
                  {badge.title}
                </h4>
                <p className="text-xs text-[rgba(203,184,185,0.85)] mt-1.5 leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. The Four Spaces Showcase — Coordinated Unified Venue */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(226,184,178,0.2)] pb-5">
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#e2b8b2] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#c58e91]" />
              <span>Coordinated Venue Spaces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f7efe7] tracking-tight">
              Four Coordinated Spaces in One Unified Hall
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] max-w-md leading-relaxed">
            Every booking includes private, exclusive access to all four coordinated spaces. Move smoothly between the air-conditioned ceremony hall, the welcoming foyer, the traditional sadhya dining hall, and the open gathering area.
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
              <span>Thoughtful Amenities</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f7efe7] tracking-tight">
              Comfort & Practical Amenities for Your Event
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] leading-relaxed">
              From reliable solar-hybrid power and tested drinking water to ample on-site parking, we take care of the essentials so you can focus on your guests.
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
              Take a Walk Through the Spaces
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] leading-relaxed">
              Browse real photographs of our ceremonial stage, dining hall, and welcoming reception foyer. You are always warmly invited to visit us in person at Market Junction, Nellikunnu.
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
              className="group relative h-52 rounded-2xl overflow-hidden cursor-pointer shadow-subtle border border-[rgba(226,184,178,0.22)] bg-[#240810] lens-hover"
            >
              <img
                src={photo.img}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18070c]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-[#f7efe7] text-xs font-medium flex items-center justify-between w-full">
                  <span className="truncate">{photo.title}</span>
                  <Eye className="w-4 h-4 text-[#e7cfaf] shrink-0 ml-1.5" />
                </div>
              </div>
            </div>
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
              Effortless Arrival on the Main PWD Bus Route
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] leading-relaxed">
              Situated right at the Market Junction bus stop along the main PWD bus route in Nellikunnu, with direct highway connectivity for easy arrival from Thrissur town and surrounding districts.
            </p>

            <div className="space-y-2.5 text-xs text-[rgba(203,184,185,0.9)] pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c58e91]" />
                <span>On-site compound parking for 40 to 50 cars</span>
              </div>
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
          {FAQS.slice(0, 4).map((faq, idx) => (
            <div
              key={idx}
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
              Let us know your event date and details.
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(203,184,185,0.85)] max-w-lg leading-relaxed">
              We will check availability right away, answer all your questions transparently, and help you reserve the venue smoothly.
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
              className="w-full max-h-[70vh] object-contain rounded-2xl bg-[#18070c] shadow-md"
            />
            <p className="text-xs text-[rgba(203,184,185,0.85)] text-center font-medium">
              Venue celebration gallery at Thekkanath Souparnika.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
