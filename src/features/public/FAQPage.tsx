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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#E7CFAF]">
          <HelpCircle className="w-4 h-4 text-[#e8c7bc]" />
          <span>Helpful Information</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#F7EFE7] tracking-tight leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-[#CBB8B9] leading-relaxed">
          Helpful answers to common questions about hall arrangements, seating capacity, sadhya dining, parking, and booking policies.
        </p>
      </div>

      {/* Accordion List — Liquid Glass Cards */}
      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-3xl border border-[rgba(226,184,178,0.22)] overflow-hidden shadow-subtle transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[rgba(226,184,178,0.05)] transition-colors focus:outline-none"
              >
                <h3 className="font-serif text-lg sm:text-xl font-light text-[#F7EFE7]">
                  {faq.question}
                </h3>
                <span className="p-2 rounded-full glass-control text-[#e8c7bc] shrink-0 border border-[rgba(226,184,178,0.25)]">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-[#CBB8B9] leading-relaxed border-t border-[rgba(226,184,178,0.15)] pt-4 bg-[#18070c]/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transparency Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[rgba(226,184,178,0.25)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E7CFAF]">
          <ShieldCheck className="w-4 h-4 text-[#e8c7bc]" />
          <span>Pricing & Booking Enquiries</span>
        </div>
        <p className="text-xs sm:text-sm text-[#CBB8B9] leading-relaxed">
          For hall availability, advance booking deposits, and event timing schedules, please reach out to us directly. We are happy to provide clear, upfront details tailored to your occasion.
        </p>
        <div className="pt-2">
          <Link to="/enquire">
            <Button variant="gold" size="sm" className="glass-highlight" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Submit Date Enquiry ↗
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
