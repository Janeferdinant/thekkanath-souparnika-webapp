import React from 'react';

interface PageHeaderProps {
  eyebrow: string;
  icon?: React.ReactNode;
  title: string;
  intro?: React.ReactNode;
  /** Extra content under the intro (buttons, notes). */
  children?: React.ReactNode;
  align?: 'left' | 'center';
}

/** Burgundy band that opens every inner page: eyebrow, the page's single h1, and an intro. */
export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, icon, title, intro, children, align = 'left' }) => (
  <section className="surface-burgundy py-12 sm:py-16">
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${align === 'center' ? 'text-center' : ''}`}>
      <div className={`space-y-4 max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
        <div
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-champagne-300 ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          {icon}
          <span>{eyebrow}</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-brand-ivory-100 tracking-tight leading-tight">{title}</h1>
        {intro && <div className="text-sm sm:text-base text-brand-ivory-muted leading-relaxed">{intro}</div>}
        {children}
      </div>
    </div>
  </section>
);
