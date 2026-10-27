import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';
import { ResponsivePicture } from './ResponsivePicture';
import { GlassHeroPanel } from '../../glass/GlassHeroPanel';
import { useGlassCapabilities } from '../../glass/useGlassCapabilities';

// Shader code is its own chunk, fetched only on enhanced devices after the photo has loaded. It is purely
// decorative, so if the chunk cannot be fetched (flaky network, or gone after a redeploy) the hero simply stays
// the plain photo instead of the whole page failing.
const HeroRefraction = lazy(() =>
  import('../../glass/renderer/HeroRefraction').catch(() => ({ default: () => null })),
);

/**
 * Homepage hero built around the golden-hour entrance photo.
 *
 * The photo is never stretched and never wider than 681 CSS px on desktops (the source is 1086 px wide).
 * Phones and tablets show the whole 3:4 photo; desktops put it in the right 54% of the page width, right
 * after the title and ending where the navigation ends, as tall as the text beside it (trimming a little
 * sky and paving equally). Text never sits over the signage: on phones it starts over the lower paving,
 * on tablets it sits below the photo, on desktops beside it. Every photo edge that meets the page fades
 * into the burgundy instead of being framed.
 */
export const HeroSection: React.FC = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [rendererWanted, setRendererWanted] = useState(false);
  const { tier } = useGlassCapabilities();

  // A cached image can finish loading before React attaches onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setImageReady(true);
  }, []);

  // Start the WebGL layer only when the device can afford it, the photo is really on screen, the page
  // has finished loading, and the browser is idle, so setting up the context, compiling the shader and
  // uploading the texture never compete with anything the first view needs. Any other case leaves the
  // plain photo, which is complete on its own.
  useEffect(() => {
    if (tier !== 'enhanced' || !imageReady) {
      setRendererWanted(false);
      return;
    }

    let cancelled = false;
    let cancelIdle = () => {};

    const whenIdle = () => {
      if (cancelled) return;
      const want = () => {
        if (!cancelled) setRendererWanted(true);
      };
      if (typeof window.requestIdleCallback === 'function') {
        const handle = window.requestIdleCallback(want, { timeout: 1500 });
        cancelIdle = () => window.cancelIdleCallback(handle);
      } else {
        const timer = window.setTimeout(want, 200);
        cancelIdle = () => window.clearTimeout(timer);
      }
    };

    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', whenIdle);
      cancelIdle();
    };
  }, [tier, imageReady]);

  return (
    <section className="surface-burgundy hero-surface relative overflow-hidden -mt-20" aria-label="Welcome">
      {/* Covers the hero so the navigation knows when it is still over the photo */}
      <div id="hero-sentinel" aria-hidden="true" className="absolute inset-0 pointer-events-none" />

      {/* Desktop: the photo takes the right 54% of the navigation's max-w-7xl width, right after the title */}
      <div className="relative max-w-7xl mx-auto lg:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_54%] lg:items-start lg:pb-8">
        {/* Photo frame: phone = full width, tablet = centred, desktop = right column, as tall as the text beside
            it (between a near-square and the full 3:4 photo, see .hero-photo-fade; centre-cropped, which the
            refraction shader mirrors) */}
        <div
          ref={frameRef}
          data-hero-frame
          data-ready={imageReady ? 'true' : 'false'}
          className="hero-photo-fade relative aspect-[3/4] md:mt-24 md:max-w-[600px] md:mx-auto lg:mt-0 lg:mx-0 lg:-ml-6 lg:max-w-none lg:aspect-auto lg:self-stretch lg:order-2 overflow-hidden bg-brand-burgundy-900"
        >
          <ResponsivePicture
            image="hero-entrance"
            sizes="(min-width:1280px) 681px, (min-width:1024px) calc(54vw - 11px), (min-width:768px) 600px, 100vw"
            priority
            className="block w-full h-full lg:absolute lg:inset-0"
            imgClassName={`w-full h-full object-cover ${imageFailed ? 'opacity-0' : ''}`}
            imgRef={imgRef}
            onLoad={(e) => {
              if (e.currentTarget.naturalWidth > 0) {
                setImageReady(true);
                setImageFailed(false);
              }
            }}
            onError={() => {
              setImageReady(false);
              setImageFailed(true);
            }}
          />

          {rendererWanted && frameRef.current && imgRef.current && (
            <Suspense fallback={null}>
              <HeroRefraction frame={frameRef.current} image={imgRef.current} />
            </Suspense>
          )}

          {/* Phones: burgundy gradient over the paving so the text can start on the photo */}
          {/* z-[2]: it must paint above the refraction canvas (z-1) or the text would sit on raw photo */}
          <div
            data-hero-scrim
            className="md:hidden absolute z-[2] inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-brand-burgundy-950 to-transparent pointer-events-none"
          />

          {/* Tablet and up: no frame; the photo's bottom fades into the burgundy page (its other edges are masked,
              see .hero-photo-fade). Same z-[2] as the scrim: above the canvas, below the card. */}
          <div
            data-hero-blend
            className="hidden md:block absolute z-[2] inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-brand-burgundy-950 to-transparent pointer-events-none"
          />

          {/* Small, clear location card over the wet paving at the lower right, never over the signage or entrance.
              Kept inside the masked side fades. */}
          <GlassHeroPanel className="hero-location-card hidden md:block absolute z-10 bottom-5 right-[12%] lg:bottom-8 max-w-[11rem] px-2 pt-2 pb-1.5">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3 h-3 mt-px text-brand-champagne-300 shrink-0" />
              <div className="text-[10px] leading-snug">
                <div className="font-semibold text-brand-ivory-100">Market Junction, Nellikunnu</div>
                <div className="text-brand-ivory-100">Opposite RGLP School</div>
              </div>
            </div>
            {/* Compact link; its ::after layer keeps the touch target 44px tall */}
            <a
              href={VENUE_INFO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="relative mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-champagne-300 hover:text-brand-ivory-100 after:absolute after:-inset-x-2 after:-inset-y-4"
            >
              <span>Get Directions</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </GlassHeroPanel>
        </div>

        {/* Text: starts over the lower paving on phones, then continues below or beside the frame */}
        <div className="relative z-10 -mt-[28%] md:mt-10 md:max-w-[600px] md:mx-auto lg:mx-0 lg:mt-0 lg:max-w-none lg:order-1 lg:pt-[8.75rem] px-5 sm:px-8 lg:px-0 pb-12 lg:pb-0 space-y-6 sm:space-y-7 lg:space-y-5">
          {/* The venue name is the headline: two lines of metallic champagne gold ("Souparnika" the larger, as in
              the mockup), a small glint and a hairline ornament the width of the name (see .hero-venue-name).
              Its text content stays "Thekkanath Souparnika". The desktop size scales with the text column. */}
          <div className="relative flex flex-col w-fit max-w-full text-[2.6rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[clamp(3.5rem,7.4vw,6.25rem)]">
            {/* warm light behind the name that slowly breathes (see .hero-name-glow) */}
            <span aria-hidden="true" className="hero-name-glow" />
            <h1 className="hero-venue-name flex flex-col items-start font-serif font-bold text-brand-champagne-300 leading-[0.78]">
              <span className="relative">
                Thekkanath
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="hero-glint absolute -right-[0.36em] bottom-[0.62em] w-[0.3em] h-[0.3em]"
                >
                  <path fill="currentColor" d="M12 0C12.4 8 16 11.6 24 12 16 12.4 12.4 16 12 24 11.6 16 8 12.4 0 12 8 11.6 11.6 8 12 0z" />
                </svg>
              </span>{' '}
              <span className="text-[1.22em]">Souparnika</span>
            </h1>
            {/* clears the descender of the "p" */}
            <div aria-hidden="true" className="mt-[0.34em] flex items-center gap-2 w-full">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-champagne-500" />
              <span className="w-1.5 h-1.5 rotate-45 border border-brand-champagne-400" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-champagne-500" />
            </div>
          </div>

          <div className="text-[10px] sm:text-xs lg:text-[10px] xl:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.14em] xl:tracking-[0.18em] font-semibold text-brand-champagne-400 text-balance">
            Traditional & Contemporary Celebrations in Thrissur
          </div>

          <p className="font-serif text-3xl sm:text-[2.75rem] lg:text-[3rem] xl:text-[3.25rem] font-normal tracking-tight text-brand-ivory-100 leading-[1.05]">
            Where family milestones <br />
            <em className="text-brand-champagne-400 not-italic font-normal">feel truly special.</em>
          </p>

          <p className="text-sm sm:text-base text-brand-ivory-muted leading-relaxed max-w-xl font-normal">
            Four connected halls—three fully air-conditioned—arranged for weddings, engagements, baptisms, and family celebrations. Includes 100-seat batch dining for traditional sadhya and easy ground-floor access for elders, at Market Junction, Nellikunnu.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/halls"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 shadow-luxury border border-brand-champagne-400 transition-all hover:scale-[1.02] glass-highlight"
            >
              <span>Explore the Halls</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/enquire"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-brand-ivory-100 bg-brand-burgundy-800 hover:bg-brand-burgundy-700 border border-brand-champagne-500 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-champagne-300" />
              <span>Check Date / Enquire</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
