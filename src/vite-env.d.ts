/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_VENUE_TIMEZONE?: string;
  readonly VITE_PRIMARY_PHONE?: string;
  readonly VITE_SECONDARY_PHONE?: string;
  readonly VITE_WHATSAPP_PHONE?: string;
  readonly VITE_VENUE_EMAIL?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_EMAIL_PROVIDER_API_KEY?: string;
  readonly VITE_EMAIL_FROM_ADDRESS?: string;
  readonly VITE_PAYMENT_GATEWAY_KEY_ID?: string;
  readonly VITE_AI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
