# Repository-specific UI/UX audit summary

## Verified structure
This repository currently uses Vite + React 18 + TypeScript (not Next.js), React Router, Tailwind CSS, Supabase, React Hook Form, Zod, `lucide-react`, Recharts and Vitest. Existing routes and files include:

- Shared public shell: `src/components/public/PublicHeader.tsx`, `PublicLayout.tsx`, `PublicFooter.tsx`
- Existing canvas particles: `src/components/public/AmbientParticles.tsx`
- Public pages: `src/features/public/HomePage.tsx`, `HallsPage.tsx`, `HallDetailPage.tsx`, `FacilitiesPage.tsx`, `GalleryPage.tsx`, `EnquirePage.tsx`, `ContactPage.tsx`, `FAQPage.tsx`
- Data: `src/data/venueData.ts`
- CSS: `src/styles/theme.css`, `src/styles/index.css`, `tailwind.config.js`
- The repository includes `/admin` routes, demo/offline storage mode, Supabase integration, tests, business documentation, brand assets, and a 360° photo sphere guide.

## UI observations from inspected source
- `PublicHeader.tsx` currently uses a burgundy/gold contact strip, but the main sticky nav uses a white/light background and gray text. This is a key theme inconsistency to resolve.
- `PublicLayout.tsx` applies a light cream background to the public site and mounts ambient particles globally. It also has a mobile fixed action dock. Review these together so the dark restyle remains coherent and does not obstruct content.
- `HomePage.tsx` already has a dark burgundy hero, an image overlay, glass-like badge, and an `AmbientParticles` canvas. Keep the good parts; refine typography, contrast, spacing, imagery, and effect restraint instead of layering multiple effect libraries.
- `AmbientParticles.tsx` already uses canvas + `requestAnimationFrame`, honors `prefers-reduced-motion`, and cleans up the resize listener and animation frame. Its global variant animates too and uses canvas shadow blur. Consider reducing global usage, capping device pixel ratio, reducing mobile counts, pausing while tab hidden, and preserving reduced-motion behavior.
- `EnquirePage.tsx` contains a multi-step inquiry flow including event/date/session, hall scope, guests, contact details, referrals, special requests, confirmation, and submission. Retain these fields, validation and data workflows; the job is styling and UI structure, not a form rewrite.
- Existing app data and the brochure may contain business assertions; verify claims against the latest approved source before making them more prominent.

## Preferred implementation strategy
Use current Tailwind/CSS and the existing canvas particles first. Do not add Motion, GSAP, Three.js, React Three Fiber or tsParticles by default. Add a new dependency only where a specific effect cannot be made well with current tools; explain bundle and performance impact. The requested premium look can be accomplished with a coherent token system, CSS glass layers, mask/opacity reveals, refined hover transitions, sparse canvas particles and perhaps a single localized SVG displacement effect.
