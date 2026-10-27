import React, { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassModal } from '../../glass/GlassModal';
import { ResponsivePicture, imageKeyForSrc } from './ResponsivePicture';

export interface LightboxPhoto {
  /** An image key from the manifest, or a plain image URL. */
  src: string;
  title: string;
  description?: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

const SWIPE_MIN_PX = 50;

/** One lightbox for the homepage and the Gallery page: arrow keys, swipe, visible controls. */
export const Lightbox: React.FC<LightboxProps> = ({ photos, index, onIndexChange, returnFocusRef }) => {
  const open = index !== null && photos[index] !== undefined;
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (index === null || photos.length === 0) return;
      onIndexChange((index + delta + photos.length) % photos.length);
    },
    [index, photos.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, step]);

  if (!open || index === null) return null;
  const photo = photos[index];
  const key = imageKeyForSrc(photo.src);

  return (
    <GlassModal isOpen onClose={() => onIndexChange(null)} title={photo.title} maxWidth="5xl" returnFocusRef={returnFocusRef}>
      <div
        data-testid="lightbox-surface"
        className="relative flex items-center justify-center touch-pan-y select-none"
        onPointerDown={(e) => {
          swipeStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
        }}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous photo"
          className="absolute left-2 z-10 inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full bg-brand-burgundy-900 text-brand-ivory-100 border border-brand-champagne-500 hover:text-brand-champagne-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {key ? (
          <ResponsivePicture
            key={photo.src}
            image={key}
            alt={photo.title}
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
            className="block w-full"
            imgClassName="w-full h-auto max-h-[65vh] object-contain rounded-2xl"
          />
        ) : (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.title}
            className="w-full h-auto max-h-[65vh] object-contain rounded-2xl"
          />
        )}

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next photo"
          className="absolute right-2 z-10 inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full bg-brand-burgundy-900 text-brand-ivory-100 border border-brand-champagne-500 hover:text-brand-champagne-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center space-y-1">
        {photo.description && <p className="text-xs text-brand-ivory-muted leading-relaxed">{photo.description}</p>}
        <p role="status" aria-live="polite" className="text-xs font-semibold text-brand-champagne-300">
          {index + 1} of {photos.length}
        </p>
      </div>
    </GlassModal>
  );
};
