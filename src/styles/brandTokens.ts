/**
 * Single source of the public brand palette. The same keys and values are mirrored as
 * `--brand-<key>` custom properties in theme.css (checked by tests/brandTokens.test.ts).
 * Existing admin colour scales are untouched; these tokens are for the public site only.
 */
export const BRAND: Record<string, string> = {
  'burgundy-950': '#1E0A10',
  'burgundy-900': '#2E0F19',
  'burgundy-800': '#3F1520',
  'burgundy-700': '#541B2A',
  'burgundy-600': '#6B2537',
  'champagne-300': '#E6D3AE',
  'champagne-400': '#D8BD8A',
  'champagne-500': '#C9A56A',
  'bronze-700': '#7A5A2E',
  'ivory-50': '#FCFAF6',
  'ivory-100': '#F8F3EB',
  'ivory-200': '#EFE6D8',
  'ivory-muted': '#D9CBBF',
  'charcoal-900': '#2A2421',
  'charcoal-600': '#5C524C',
  rosegold: '#C8907A',
};
