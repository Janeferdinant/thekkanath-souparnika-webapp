# Thekkanath Souparnika — Luxury Public UI/UX Refresh

This bundle guides an AI coding agent through a visual upgrade to the existing Vite + React + TypeScript application. It intentionally preserves the current architecture and business workflows.

## Start here
1. Read `ANTIGRAVITY_UI_UX_IMPLEMENTATION_PROMPT.md` first. It is the main implementation brief.
2. Open `reference/index.html` in a browser to review the target visual direction.
3. Refer to `reference/luxury-theme.css` for initial CSS variables and reusable effect classes.
4. Refer to `reference/theme-tokens.json` for structured color, type, motion and effect tokens.
5. Refer to `reference/HTML_REFERENCE_NOTES.md` for how the static prototype maps to the app.

## Repository findings (reviewed)
- Repository: [thekkanath-souparnika-webapp](https://github.com/Janeferdinant/thekkanath-souparnika-webapp)
- Default branch observed: `main`
- Existing stack: Vite, React 18, TypeScript, React Router, Tailwind CSS, Supabase client, React Hook Form, Zod, lucide-react, Recharts and Vitest.
- Existing public routes/components include `HomePage`, `HallsPage`, `HallDetailPage`, `FacilitiesPage`, `GalleryPage`, `EnquirePage`, `ContactPage`, `FAQPage`, `PublicHeader`, `PublicFooter`, `PublicLayout`, and `AmbientParticles`.
- Existing source files include `src/styles/theme.css`, `src/styles/index.css`, `tailwind.config.js`, `src/data/venueData.ts`, and `src/components/public/AmbientParticles.tsx`.
- Current public header is largely light-themed, while the home hero already uses burgundy overlays, glass-like accents and an existing canvas particle component. The upgrade should unify and refine rather than add duplicate effect systems.
- The home page has venue/hall/facility content and an enquiry CTA. The existing enquiry workflow includes multi-step data entry and validation. Do not replace its business logic for styling.
- The repository README documents public and `/admin` workflows, demo mode and Supabase integration. Preserve these.

## Important content safety
Treat app data and the brochure as the factual source. Do not elevate unverified hall capacities, amenities, pricing, ratings, review quotes, opening hours, or tour content into public claims. The static mockup labels generic hall information as placeholders.

## Quick use
Copy this entire folder into the project or hand the ZIP to the AI agent. The agent must examine the current repository before editing, create a feature branch, preserve the admin app and run typecheck, tests and build.
