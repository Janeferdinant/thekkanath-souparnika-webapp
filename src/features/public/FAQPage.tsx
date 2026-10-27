import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQS } from '../../data/venueData';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/public/PageHeader';
import { GlassSurface } from '../../glass/GlassSurface';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const uid = useId();

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Helpful Information"
        icon={<HelpCircle className="w-4 h-4" />}
        title="Frequently Asked Questions"
        intro="Helpful answers to common questions about hall arrangements, seating capacity, sadhya dining, parking, and booking policies."
        align="center"
      />

      <div className="surface-ivory py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Accordion List */}
          <div className="space-y-3.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              const panelId = `${uid}-panel-${idx}`;
              return (
                <GlassSurface key={faq.id} tone="light" elevation="raised" className="overflow-hidden border-brand-champagne-500">
                  <h2>
                    <button
                      type="button"
                      onClick={() => toggle(idx)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full min-h-[44px] p-6 text-left flex items-center justify-between gap-4 hover:bg-brand-ivory-200 transition-colors"
                    >
                      <span className="font-serif text-lg sm:text-xl font-light text-brand-charcoal-900">{faq.question}</span>
                      <span className="p-2 rounded-full text-brand-burgundy-700 shrink-0 border border-brand-burgundy-700" aria-hidden="true">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>
                  </h2>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-label={faq.question}
                      className="px-6 pb-6 text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed border-t border-brand-champagne-500 pt-4 bg-brand-ivory-200"
                    >
                      {faq.answer}
                    </div>
                  )}
                </GlassSurface>
              );
            })}
          </div>

          {/* Transparency Banner */}
          <GlassSurface tone="dark" elevation="raised" className="p-8 sm:p-10 space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-champagne-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Pricing & Booking Enquiries</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-ivory-muted leading-relaxed">
              For hall availability, advance booking deposits, and event timing schedules, please reach out to us directly. We are happy to provide clear, upfront details tailored to your occasion.
            </p>
            <div className="pt-2">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full text-xs font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 border border-brand-champagne-400 shadow-md glass-highlight"
              >
                <span>Submit Date Enquiry ↗</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassSurface>
        </div>
      </div>
    </div>
  );
};
