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
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700">
          <HelpCircle className="w-4 h-4" />
          <span>Helpful Information</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900 leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
          Clear answers regarding our halls, capacities, air-conditioning, parking, and booking policies for your upcoming event.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-cream-200 bg-cream-50 overflow-hidden shadow-subtle transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-cream-100/60 transition-colors focus:outline-none"
              >
                <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950">
                  {faq.question}
                </h3>
                <span className="p-1.5 rounded-full bg-cream-200 text-forest-800 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-ink-700 leading-relaxed border-t border-cream-200/60 pt-3 bg-cream-50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transparency Banner */}
      <div className="p-6 rounded-2xl bg-cream-100 border border-cream-300 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-900">
          <ShieldCheck className="w-4 h-4 text-gold-600" />
          <span>Pricing & Cancellation Inquiries</span>
        </div>
        <p className="text-xs text-ink-600 leading-relaxed">
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
