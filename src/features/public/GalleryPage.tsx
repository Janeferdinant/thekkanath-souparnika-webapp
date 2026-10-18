import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { VENUE_MEDIA, VenuePhoto } from '../../data/venueMedia';
import { VenueImage } from '../../components/public/VenueImage';

type Filter = 'all' | VenuePhoto['category'];
const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All photographs' }, { id: 'interior', label: 'Interiors' },
  { id: 'details', label: 'Details' }, { id: 'exterior', label: 'Exterior' },
];

export function GalleryPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const shown = VENUE_MEDIA.filter(photo => filter === 'all' || photo.category === filter);
  const photo = active === null ? null : shown[active];

  const close = () => { setActive(null); requestAnimationFrame(() => triggerRef.current?.focus()); };
  const open = (index: number, button: HTMLButtonElement) => { triggerRef.current = button; setActive(index); };
  const step = (direction: number) => setActive(index => index === null ? null : (index + direction + shown.length) % shown.length);

  useEffect(() => {
    if (active === null) return;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
      if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll<HTMLButtonElement>('.lux-lightbox button'));
        const current = controls.indexOf(document.activeElement as HTMLButtonElement);
        if (event.shiftKey && current <= 0) { event.preventDefault(); controls[controls.length - 1]?.focus(); }
        else if (!event.shiftKey && current === controls.length - 1) { event.preventDefault(); controls[0]?.focus(); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = priorOverflow; window.removeEventListener('keydown', handleKey); };
  }, [active, shown.length]);

  return <div className="lux-page lux-container">
    <header className="lux-page-heading"><span className="lux-eyebrow">ACTUAL VENUE PHOTOGRAPHY</span><h1>A genuine <em>look inside.</em></h1><p>Seven original photographs show the venue's rooms, details, and entrance. Open any image to see the full frame.</p></header>
    <div className="lux-filter-row" aria-label="Filter photographs">{filters.map(item => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => { setFilter(item.id); setActive(null); }}>{item.label}</button>)}</div>
    <div className="lux-gallery-grid">{shown.map((item, index) => <button className="lux-gallery-tile" key={item.id} type="button" onClick={event => open(index, event.currentTarget)} aria-label={`View full photograph: ${item.title}`}><VenueImage photo={item} small /><span><small>ACTUAL VENUE PHOTO · {item.id}</small><strong>{item.title}</strong></span></button>)}</div>
    <p className="lux-source-note">Every photo is from the seven original venue JPG files. The optimized WebP versions preserve the photographed spaces.</p>
    {photo && <div className="lux-lightbox" role="dialog" aria-modal="true" aria-label="Actual venue photograph viewer" onClick={event => { if (event.currentTarget === event.target) close(); }}>
      <div className="lux-lightbox-top"><span>PHOTOGRAPH {active! + 1} / {shown.length}</span><button ref={closeRef} type="button" aria-label="Close photo viewer" onClick={close}><X /></button></div>
      <div className="lux-lightbox-image"><button type="button" aria-label="Previous photograph" onClick={() => step(-1)}><ChevronLeft /></button><VenueImage photo={photo} loading="eager" /><button type="button" aria-label="Next photograph" onClick={() => step(1)}><ChevronRight /></button></div>
      <p>{photo.title} <span>· Original venue photograph</span></p>
    </div>}
  </div>;
}
