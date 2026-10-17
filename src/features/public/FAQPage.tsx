import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQS } from '../../data/venueData';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
          <HelpCircle className="w-4 h-4 text-gold-500" />
          <span>Helpful Information</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-burgundy-950 tracking-tight leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
          Clear answers regarding our halls, capacities, air-conditioning, parking, and booking policies for your upcoming event.
        </p>
      </div>

      {/* Accordion List — Liquid Glass Cards */}
      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-3xl border border-rose-200/80 bg-white/80 backdrop-blur-xl overflow-hidden shadow-subtle transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-rose-50/60 transition-colors focus:outline-none"
              >
                <h3 className="font-serif text-lg sm:text-xl font-bold text-burgundy-950">
                  {faq.question}
                </h3>
                <span className="p-2 rounded-full bg-rose-100 text-burgundy-900 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-ink-700 leading-relaxed border-t border-rose-100/80 pt-4 bg-white/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transparency Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/80 shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy-950">
          <ShieldCheck className="w-4 h-4 text-gold-600" />
          <span>Pricing & Cancellation Inquiries</span>
        </div>
        <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
          For rental prices, package rates, advance booking deposit percentages, cancellation/refund terms, and custom event scheduling, please contact management directly. We provide exact quotes tailored to your event requirements.
        </p>
        <div className="pt-2">
          <Link to="/enquire">
            <Button variant="gold" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Submit Date Enquiry ↗
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
