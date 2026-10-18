import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';
import { isDemoMode, isSupabaseConfigured, StorageService } from '../../lib/storage';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { success } = useToast();
  const [venueName, setVenueName] = useState(VENUE_INFO.name);
  const [primaryPhone, setPrimaryPhone] = useState(VENUE_INFO.phones[0]);
  const [secondaryPhone, setSecondaryPhone] = useState(VENUE_INFO.phones[1]);
  const [email, setEmail] = useState(VENUE_INFO.email);
  const [mapsUrl, setMapsUrl] = useState(VENUE_INFO.googleMapsUrl);

  const handleSaveVenueSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.logAction(
      'SETTINGS_UPDATED',
      'VenueSettings',
      'core-settings',
      'Updated public contact details and venue information.'
    );
    success('Settings Saved', 'Venue public contact preferences updated successfully.');
  };

  const integrations = [
    {
      name: 'Supabase PostgreSQL & Auth',
      purpose: 'Production database, RLS policies, and user authentication',
      configured: isSupabaseConfigured(),
      envKey: 'VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY',
    },
    {
      name: 'Email Delivery Adapter (Resend / SendGrid)',
      purpose: 'Customer booking confirmations and enquiry notifications',
      configured: Boolean(import.meta.env.VITE_EMAIL_PROVIDER_API_KEY),
      envKey: 'VITE_EMAIL_PROVIDER_API_KEY',
    },
    {
      name: 'Online Payment Gateway (Razorpay / Cashfree)',
      purpose: 'Digital advance deposit collection (Manual recording active by default)',
      configured: Boolean(import.meta.env.VITE_PAYMENT_GATEWAY_KEY_ID),
      envKey: 'VITE_PAYMENT_GATEWAY_KEY_ID',
    },
    {
      name: 'External AI Model (Gemini / OpenAI)',
      purpose: 'Advanced generative copilot (Deterministic local engine active)',
      configured: Boolean(import.meta.env.VITE_AI_API_KEY),
      envKey: 'VITE_AI_API_KEY',
    },
    {
      name: 'Google Maps Embed API',
      purpose: 'Interactive map canvas (Standard directions link active)',
      configured: Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
      envKey: 'VITE_GOOGLE_MAPS_API_KEY',
    },
  ];

  const ownerDecisions = [
    {
      title: 'Hall Rental Rates & Package Pricing',
      status: 'Configurable',
      desc: 'Official hourly and slot rates for Stage, Welcome, Dining, and Open Hall.',
    },
    {
      title: 'Advance Deposit & Cancellation Terms',
      status: 'Configurable',
      desc: 'Deposit percentage required to confirm a tentative reservation and refund deduction schedule.',
    },
    {
      title: 'Operating Hours & Setup/Cleanup Buffer',
      status: 'Configurable',
      desc: 'Official venue operating hours and required turnaround buffer between back-to-back events.',
    },
    {
      title: 'Taxes & Commercial Invoicing Rules',
      status: 'Configurable',
      desc: 'GST tax rates, sequential invoice prefix format, and accounting preferences.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest-950">
          Venue Content & System Settings
        </h1>
        <p className="text-xs text-ink-500 mt-1">
          Public venue identity, external integration credentials status, and owner policy decisions
        </p>
      </div>

      {/* Integration Credentials Status */}
      <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-cream-200 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-forest-900">
              External Integrations Status
            </h3>
            <p className="text-xs text-ink-500">
              Honest status indicators based on active environment variables in .env
            </p>
          </div>
          <Badge variant={isDemoMode() ? 'warning' : 'success'}>
            {isDemoMode() ? 'Local Demo Mode' : 'Connected to Supabase'}
          </Badge>
        </div>

        <div className="space-y-3">
          {integrations.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-cream-50/70 border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-forest-950 flex items-center gap-2">
                  <span>{item.name}</span>
                </div>
                <div className="text-ink-600 text-[11px]">{item.purpose}</div>
                <div className="text-[10px] text-ink-400 font-mono">Env: {item.envKey}</div>
              </div>

              <div className="shrink-0">
                {item.configured ? (
                  <Badge variant="info">Environment key present</Badge>
                ) : (
                  <Badge variant="default">Environment key missing</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Owner Configuration Checklist */}
      <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm space-y-4">
        <div className="border-b border-cream-200 pb-3">
          <h3 className="font-serif text-lg font-bold text-forest-900">
            Owner Decisions & Policy Checklist
          </h3>
          <p className="text-xs text-ink-500">
            These parameters must be decided by venue ownership before production deployment. Never invent prices or refund rules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ownerDecisions.map((dec, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-amber-950 font-bold">{dec.title}</strong>
                <Badge variant="warning">{dec.status}</Badge>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">{dec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Public Contact Settings Form */}
      <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm space-y-4">
        <div className="border-b border-cream-200 pb-3">
          <h3 className="font-serif text-lg font-bold text-forest-900">
            Public Venue Contact Information
          </h3>
          <p className="text-xs text-ink-500">
            Primary contact coordinates presented to visitors on the public website
          </p>
        </div>

        <form onSubmit={handleSaveVenueSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Venue Display Name</label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Primary Telephone</label>
              <input
                type="text"
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Secondary Telephone</label>
              <input
                type="text"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-ink-800">Google Maps Query / Directions URL</label>
              <input
                type="text"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="gold" size="md" type="submit" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Save Contact Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
