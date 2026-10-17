import React from 'react';
import { Globe, MessageCircle, Phone, Footprints, ShieldAlert } from 'lucide-react';

export const MarketingPage: React.FC = () => {

  // Lead Source breakdown
  const sources = [
    { label: 'Public Website Submissions', count: 18, conversionRate: '44%', icon: Globe },
    { label: 'Direct WhatsApp Enquiries', count: 14, conversionRate: '50%', icon: MessageCircle },
    { label: 'Direct Telephone Calls', count: 9, conversionRate: '33%', icon: Phone },
    { label: 'Walk-in / Local Referrals', count: 6, conversionRate: '66%', icon: Footprints },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">Marketing & Lead Channels</h1>
          <p className="text-xs text-ink-500 mt-1">
            Source attribution and conversion metrics for incoming event inquiries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((src, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center">
                <src.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {src.conversionRate} Conv.
              </span>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-forest-950">{src.count}</div>
              <h4 className="text-xs font-semibold text-ink-800 mt-1">{src.label}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Policy Notice */}
      <div className="p-6 rounded-2xl bg-forest-900 text-cream-100 border border-forest-800 space-y-2">
        <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Lead Attribution & Channels</span>
        </div>
        <p className="text-xs text-cream-300 leading-relaxed">
          Inquiries are attributed directly to communication channels (website submissions, direct WhatsApp messages, telephone calls, and in-person walk-ins) to provide management with transparent conversion insights.
        </p>
      </div>
    </div>
  );
};
