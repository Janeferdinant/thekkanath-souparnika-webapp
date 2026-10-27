import React, { useRef, useState } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GlassModal } from '../src/glass/GlassModal';
import { Lightbox } from '../src/components/public/Lightbox';
import { HomePage } from '../src/features/public/HomePage';
import { GalleryPage } from '../src/features/public/GalleryPage';

afterEach(() => {
  document.body.style.overflow = '';
});

const PHOTOS = [
  { src: '/assets/venue/venue-000.jpg', title: 'Stage Hall' },
  { src: '/assets/venue/venue-001.jpg', title: 'Welcome Hall' },
  { src: '/assets/venue/venue-002.jpg', title: 'Dining Hall' },
];

const ModalHarness: React.FC = () => {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={trigger} onClick={() => setOpen(true)}>
        open it
      </button>
      <GlassModal isOpen={open} onClose={() => setOpen(false)} title="A dialog" returnFocusRef={trigger}>
        <button>first</button>
        <button>second</button>
        <button>last</button>
      </GlassModal>
    </>
  );
};

describe('GlassModal', () => {
  it('is a labelled modal dialog and moves focus inside on open', () => {
    render(<ModalHarness />);
    const trigger = screen.getByText('open it');
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const labelId = dialog.getAttribute('aria-labelledby')!;
    expect(document.getElementById(labelId)!.textContent).toBe('A dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('traps Tab inside the dialog in both directions', () => {
    render(<ModalHarness />);
    fireEvent.click(screen.getByText('open it'));
    const dialog = screen.getByRole('dialog');
    const focusables = [...dialog.querySelectorAll<HTMLElement>('button')];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    last.focus();
    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
    first.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('closes on Escape and returns focus to the trigger', () => {
    render(<ModalHarness />);
    const trigger = screen.getByText('open it');
    fireEvent.click(trigger); // no focus() first: Safari does not focus buttons on click
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('locks page scroll while open and restores it', () => {
    document.body.style.overflow = 'auto';
    render(<ModalHarness />);
    fireEvent.click(screen.getByText('open it'));
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(document.body.style.overflow).toBe('auto');
  });

  it('closes on backdrop click but not on clicks inside', () => {
    const onClose = vi.fn();
    render(
      <GlassModal isOpen onClose={onClose} title="T">
        <button>inside</button>
      </GlassModal>,
    );
    fireEvent.click(screen.getByText('inside'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('glass-modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

const LightboxHarness: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const [index, setIndex] = useState<number | null>(start);
  return <Lightbox photos={PHOTOS} index={index} onIndexChange={setIndex} />;
};

const shownTitle = () => within(screen.getByRole('dialog')).getByRole('heading', { level: 2 }).textContent;

describe('Lightbox', () => {
  it('renders nothing while closed', () => {
    render(<Lightbox photos={PHOTOS} index={null} onIndexChange={() => undefined} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('moves between photos with the arrow keys, wrapping at both ends', () => {
    render(<LightboxHarness />);
    expect(shownTitle()).toBe('Stage Hall');
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(shownTitle()).toBe('Welcome Hall');
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(shownTitle()).toBe('Dining Hall');
  });

  it('announces the position politely', () => {
    render(<LightboxHarness start={1} />);
    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toBe('2 of 3');
  });

  it('has visible previous and next buttons with 44px targets', () => {
    render(<LightboxHarness />);
    for (const name of ['Previous photo', 'Next photo']) {
      expect(screen.getByRole('button', { name }).className).toContain('min-h-[44px]');
    }
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    expect(shownTitle()).toBe('Welcome Hall');
  });

  const swipe = (from: [number, number], to: [number, number]) => {
    const surface = screen.getByTestId('lightbox-surface');
    surface.dispatchEvent(new MouseEvent('pointerdown', { clientX: from[0], clientY: from[1], bubbles: true }));
    surface.dispatchEvent(new MouseEvent('pointerup', { clientX: to[0], clientY: to[1], bubbles: true }));
  };

  it('advances on a leftward swipe of at least 50px', () => {
    render(<LightboxHarness />);
    act(() => swipe([200, 100], [100, 105]));
    expect(shownTitle()).toBe('Welcome Hall');
  });

  it('goes back on a rightward swipe', () => {
    render(<LightboxHarness start={1} />);
    act(() => swipe([100, 100], [200, 100]));
    expect(shownTitle()).toBe('Stage Hall');
  });

  it('ignores short swipes and mostly-vertical drags', () => {
    render(<LightboxHarness />);
    act(() => swipe([200, 100], [170, 100]));
    expect(shownTitle()).toBe('Stage Hall');
    act(() => swipe([200, 100], [140, 260]));
    expect(shownTitle()).toBe('Stage Hall');
  });

  it('closes with Escape', () => {
    render(<LightboxHarness />);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the photo with alt text', () => {
    render(<LightboxHarness />);
    expect(within(screen.getByRole('dialog')).getByAltText('Stage Hall')).toBeInTheDocument();
  });
});

describe('gallery thumbnails', () => {
  it('homepage tiles are buttons named after their photo titles, and open the lightbox', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const tile = screen.getByRole('button', { name: 'Dining Hall — Banquet Tables' });
    fireEvent.click(tile);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(shownTitle()).toBe('Dining Hall — Banquet Tables');
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(tile);
  });

  it('gallery page tiles are buttons that open the same lightbox', () => {
    render(
      <MemoryRouter>
        <GalleryPage />
      </MemoryRouter>,
    );
    const tile = screen.getByRole('button', { name: 'Open Hall — Polished Marble Flooring & Airflow Fans' });
    fireEvent.click(tile);
    expect(shownTitle()).toBe('Open Hall — Polished Marble Flooring & Airflow Fans');
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(shownTitle()).toBe('Wash Area — Long Row of Basins with Mirrors');
  });
});
