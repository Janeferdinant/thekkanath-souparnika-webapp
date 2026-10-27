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
 * The whole 3:4 photo is always shown (never cropped or stretched, never wider than 600 CSS px
 * on screens above phone width). Text never sits over the signage: on phones it starts over
 * the lower paving, on larger screens it sits beside or below the frame.
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
    <section className="surface-burgundy relative overflow-hidden -mt-20" aria-label="Welcome">
      {/* Covers the hero so the navigation knows when it is still over the photo */}
      <div id="hero-sentinel" aria-hidden="true" className="absolute inset-0 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto lg:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,min(600px,46%))] lg:gap-12 lg:items-start lg:pb-16">
        {/* Photo frame: phone = full width, tablet = centred, desktop = right column */}
        <div
          ref={frameRef}
          data-hero-frame
          data-ready={imageReady ? 'true' : 'false'}
          className="relative aspect-[3/4] md:mt-24 md:max-w-[600px] md:mx-auto md:rounded-3xl lg:mt-0 lg:mx-0 lg:max-w-none lg:order-2 overflow-hidden bg-brand-burgundy-900 md:border md:border-brand-champagne-500"
        >
          <ResponsivePicture
            image="hero-entrance"
            sizes="(min-width:1024px) 600px, (min-width:768px) 600px, 100vw"
            priority
            className="block w-full h-full"
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

          {/* Glass info panel over the wet paving, never over the signage or entrance */}
          <GlassHeroPanel className="hidden md:block absolute z-10 bottom-4 inset-x-4 lg:bottom-6 lg:left-6 lg:right-auto lg:max-w-xs p-5">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-brand-champagne-400 shrink-0" />
              <div className="text-xs leading-relaxed">
                <div className="font-semibold text-brand-ivory-100">Market Junction, Nellikunnu</div>
                <div className="text-brand-ivory-100">Opposite RGLP School</div>
              </div>
            </div>
            <a
              href={VENUE_INFO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-brand-champagne-300 hover:text-brand-ivory-100"
            >
              <span>Get Directions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </GlassHeroPanel>
        </div>

        {/* Text: starts over the lower paving on phones, then continues below or beside the frame */}
        <div className="relative z-10 -mt-[28%] md:mt-10 md:max-w-[600px] md:mx-auto lg:mx-0 lg:mt-0 lg:max-w-none lg:order-1 lg:pt-32 px-5 sm:px-8 lg:px-0 pb-12 lg:pb-0 space-y-6 sm:space-y-7">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-brand-champagne-300 leading-none">
            Thekkanath Souparnika
          </h1>

          <div className="inline-flex items-center gap-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-brand-champagne-400">
            <span className="w-6 h-[1px] bg-brand-champagne-500" />
            <span>Traditional & Contemporary Celebrations in Thrissur</span>
          </div>

          <p className="font-serif text-4xl sm:text-6xl xl:text-7xl font-normal tracking-tight text-brand-ivory-100 leading-[1.02]">
            Where family milestones <br />
            <em className="text-brand-champagne-300 not-italic font-normal">feel truly special.</em>
          </p>

          <p className="text-sm sm:text-base text-brand-ivory-muted leading-relaxed max-w-xl font-normal">
            Four connected halls—three fully air-conditioned—arranged for weddings, engagements, baptisms, and family celebrations. Includes 100-seat batch dining for traditional sadhya and easy ground-floor access for elders, at Market Junction, Nellikunnu.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/halls"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 shadow-luxury border border-brand-champagne-400 transition-all hover:scale-[1.02] glass-highlight"
            >
              <span>Explore the Halls</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/enquire"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-brand-ivory-100 bg-brand-burgundy-800 hover:bg-brand-burgundy-700 border border-brand-champagne-500 transition-all"
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
