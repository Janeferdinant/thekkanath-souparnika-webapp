import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { GlassSurface } from './GlassSurface';
import { useFocusTrap } from './useFocusTrap';

const WIDTHS = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  '2xl': 'max-w-2xl',
  '5xl': 'max-w-5xl',
} as const;

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: keyof typeof WIDTHS;
  /** Element to focus on close. Safari and Firefox do not focus a button when it is clicked, so pages record the trigger. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Dark glass dialog for public pages. Focus moves in on open and is trapped, Escape and a
 * backdrop click close it, page scroll is locked, and focus goes back to the trigger on close.
 * The admin portal keeps using components/ui/Modal.
 */
export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '2xl',
  returnFocusRef,
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, isOpen, () => returnFocusRef?.current);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Portalled to <body>: the page's <main> is its own stacking context, which would trap the
  // backdrop below the sticky navigation.
  return createPortal(
    <div
      data-testid="glass-modal-backdrop"
      className="glass-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto font-public"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full ${WIDTHS[maxWidth]} my-auto`}
      >
        <GlassSurface tone="dark" elevation="raised" className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-serif text-xl sm:text-2xl font-light text-brand-champagne-300">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full text-brand-ivory-100 border border-brand-champagne-500 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </GlassSurface>
      </div>
    </div>,
    document.body,
  );
};
