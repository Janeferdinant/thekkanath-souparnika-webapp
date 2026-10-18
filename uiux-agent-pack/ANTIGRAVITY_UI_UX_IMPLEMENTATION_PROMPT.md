# Antigravity Agent Brief — Thekkanath Souparnika Luxury UI/UX Upgrade

> **Repository:** `https://github.com/Janeferdinant/thekkanath-souparnika-webapp`  
> **Primary goal:** Upgrade the existing public-facing venue website to a premium dark burgundy + rose-gold luxury editorial experience with restrained liquid glass, localized lens/refraction effects, ambient particles, cinematic motion, and polished responsive layouts.  
> **Critical constraint:** This is an enhancement of an existing application, not a greenfield rewrite.

## 0. Mandatory workflow

1. Inspect the entire current repository before editing. Read `package.json`, routes, existing public components, the venue data source, global style files, tests, existing documentation, the brochure in `docs/reference/`, and the current public page implementations.
2. Create a new branch named `feat/luxury-glass-ui` from the current default branch. Do not commit design changes directly to `main`.
3. Preserve current working behaviour and business logic. The app is a Vite + React + TypeScript application using React Router, Tailwind CSS, Supabase, React Hook Form, Zod and an existing custom canvas `AmbientParticles` component. Do **not** migrate to Next.js or replace the router.
4. Implement one coherent design system, then upgrade public layout and pages in small, verifiable increments.
5. Run `npm run typecheck`, `npm test`, and `npm run build`. Fix regressions before finalizing. If a command fails for an unrelated pre-existing reason, state the evidence and do not conceal it.
6. Provide a completion summary with files changed, visual effects implemented, tested commands/results, and any remaining manual setup.

## 1. Source-of-truth and content integrity

Use the actual repository as the first source of truth:
- `src/data/venueData.ts`
- `src/features/public/*`
- `src/components/public/*`
- `src/styles/theme.css`
- `src/styles/index.css`
- `tailwind.config.js`
- `docs/reference/Thekkanath_Souparnika_Brochure_Revised_v6.pdf`
- `assests/business-card.pdf` and brand assets if relevant.

Use existing brand logos in `public/assets/brand/`. Do not redraw or replace the lotus identity without a clear reason.

Keep verified contact information and venue metadata data-driven through `VENUE_INFO`, `HALLS`, `FACILITIES`, `FAQS`, or the repository's current equivalent. Do not hardcode duplicate contact details into components.

**Do not invent factual marketing claims.** Hall names, capacity, floor, air-conditioning, parking, power backup, certifications, amenities, pricing, awards, ratings, opening hours, availability, testimonials, or virtual-tour coverage may be shown only when verified in the brochure/current curated data. Existing data can contain assumptions; verify it against source documentation before surfacing it as fact. If a visual mock requires unknown details, mark them as internal placeholders or omit them from the live UI. Never publish labels such as “Popular” or capacity values without verification.

The contact values found in the previously supplied business card/brochure context include:
- Business: Thekkanath Souparnika
- Address: Opposite RGLP School, Market Junction, Nellikunnu, Thrissur - 680005
- Phone: 8129764370 and 9446143165
- Emails: thekkanathsouparnika@gmail.com and nallengara@gmail.com
Confirm these against the repo's source-of-truth before modifying; preserve existing verified phone/email routing.

## 2. Brand art direction

Build a **cinematic, dark luxury editorial design**, suited to weddings, receptions, family functions, cultural events and other gatherings. It should feel refined and tactile—not like a gaming UI, nightclub, casino, generic SaaS dashboard, or effects demo.

### Palette (CSS custom properties)
Use this palette as the starting point; test contrast and tune where required:
- `--color-ink`: `#18070C` (near-black burgundy)
- `--color-wine-950`: `#240810`
- `--color-burgundy-950`: `#2F0B16`
- `--color-burgundy-900`: `#451323`
- `--color-burgundy-800`: `#5A1B2E`
- `--color-rose-700`: `#8F4B58`
- `--color-rose-500`: `#C58E91`
- `--color-rose-300`: `#E2B8B2`
- `--color-champagne`: `#E7CFAF`
- `--color-ivory`: `#F7EFE7`
- `--color-muted`: `#CBB8B9`
- `--color-border`: `rgba(226, 184, 178, 0.22)`

Dark sections should use multiple burgundy values, not flat black. Use warm ivory for long-form text, muted rose for secondary copy, and rose/champagne for restrained action accents. Gold should support rose gold rather than dominate it. Maintain readable contrast.

### Typography
- Headlines: Cormorant Garamond or existing compatible editorial serif.
- Body/UI: Inter or the current sans-serif.
- Use fluid sizes with `clamp()`, balanced line lengths, optical spacing, and real hierarchy.
- Prefer refined short overlines, elegant headline wrapping, generous vertical rhythm, asymmetrical editorial image/text compositions, and subtle ornamental dividers.
- Avoid excessive uppercase tracking in body text.

### Shape, borders, shadows
- Editorial section containers: 20–32px corners, not every small control fully pill-shaped.
- Glass cards: translucent wine surface, faint rose border, soft inner highlight, physically plausible blur, dark fallback.
- Rose-gold glow must be low intensity and limited to selected edges/CTAs.
- Image crops should be intentional and consistent; do not distort aspect ratios.

## 3. Public IA and page layout

Keep all existing public routes and their functionality; improve hierarchy, responsive polish and visual unity across:
- `/` Home
- `/halls` and any existing hall detail route
- `/facilities`
- `/gallery`
- `/enquire`
- `/contact`
- `/faq`

### Public header
- Redesign `PublicHeader` as a dark translucent glass navigation surface with a hairline rose-gold border and backdrop blur.
- On desktop, use a refined logo lockup, uncluttered navigation, and one clear enquiry CTA.
- Ensure active navigation indicator is elegant and clear.
- Keep phone, email and WhatsApp available without overcrowding.
- Mobile menu must be keyboard-accessible, close after navigation, trap focus only if implemented as a dialog, support Escape, and maintain 44px+ targets.
- Preserve staff/admin entry point, but make it visually secondary to customer enquiry.

### Home hero
- Make the first viewport the signature moment: broad architectural/venue imagery, dark wine overlays for text contrast, large editorial serif headline, short grounded supporting copy, clear “Explore Halls” and “Enquire” actions.
- The main image should remain the visual star. Use a soft image reveal, subtle scale easing, or restrained mask transition.
- Use glass for one compact overline badge or floating CTA panel; do not put every content element in glass.
- Place ambient particles behind text and above the image overlay with low opacity and no blocking.
- A virtual tour entry point can be promoted only if a real panorama/tour is configured. Otherwise label it clearly as “Tour coming soon” / placeholder in development; do not show a broken play button.
- Do not autoplay audio/video.

### Home sections
- “Our Spaces” / Halls: editorial cards with photo, verified title, verified features, clear detail CTA. Use existing hall records; if images are generic mock assets, do not imply they are actual venue photos.
- Event types: use only categories grounded in verified venue data.
- Facilities: minimal iconography, short verified details, balanced grid.
- Gallery: responsive masonry or horizontally scrollable set with modal/lightbox, proper keyboard navigation and accessible image descriptions.
- About: explain venue location and purpose only from verified content.
- CTA panel: discreet glass-on-wine panel with “Ask about your date”.
- Contact/footer: verified contact details, accessible map link/embed, phone and email anchors, WhatsApp action, concise information architecture.

### Enquiry form
- Preserve all current form fields, validation, referral attribution, session selection, hall selection and submit/storage/email behaviour.
- Skin the existing flow to the new dark editorial system; do not rewrite the booking/business logic just for aesthetics.
- Keep form labels and validation readable; focus rings visible; errors not conveyed only by color.
- Use a glass shell only if contrast stays high. Inputs can use opaque/darker solid fills for legibility.
- Clearly explain that submitting an enquiry is not confirmation of a booking, wherever currently required.
- Ensure mobile keyboard use does not hide submit actions.

### Hall and facilities pages
- Reuse source data. Give each page one clear hero/introduction, real photographs where available, consistent image ratios, useful details and a clear enquiry CTA.
- Avoid inventing prices, capacities or “availability” states.
- Do not use placeholders as live venue photographs.

### Gallery
- Keep filters functional if present.
- Lightbox should support Escape, arrow navigation if reasonable, focus management, close control and alt text.
- Use a subtle lens/magnify interaction only on hover-capable devices.

## 4. Visual-effects specification

### A. Liquid glass (restrained)
Implement through reusable classes such as `.glass-panel`, `.glass-nav`, `.glass-control`, `.glass-highlight`.
- Base fill: `rgba(47, 11, 22, 0.62)` or a similarly readable deep-wine value.
- `backdrop-filter: blur(16px) saturate(125%)` with `-webkit-backdrop-filter`.
- 1px border in a subtle rose tint; use an inner top highlight and soft ambient shadow.
- Include a solid burgundy fallback via `@supports not (backdrop-filter: blur(1px))`.
- Avoid backdrop blur across every card or full-page fixed layers; it can be GPU expensive.
- Never use glass behind body-sized blocks of text when the contrast becomes inadequate.

### B. Lens / refraction
Progressive enhancement only:
1. Default: a controlled image zoom or gentle specular highlight in CSS.
2. Optional: SVG displacement filter on a single feature image or hero detail; keep distortion subtle and disable on small/touch devices if it impacts usability.
3. Do not introduce Three.js/React Three Fiber by default. Add them only if repository analysis shows an actual need and a measured performance budget permits it.
4. Do not create a cursor follower that blocks clicks, text selection, or keyboard access.
5. Provide fallback and reduced-motion behavior.

### C. Ambient particles
The repository already has `src/components/public/AmbientParticles.tsx`; inspect and extend it rather than adding another particle library initially.
- Keep particles sparse, low-contrast, rose/champagne, and behind content.
- Use only in the hero and optionally a very faint background accent on selected public sections—not as a high-opacity global overlay on every page.
- Use `requestAnimationFrame` with cleanup, responsive resizing, pause while the tab is hidden if feasible, and a sensible DPR cap.
- Current implementation animates continuously and uses canvas shadow blur; profile before increasing particle counts. Reduce counts on mobile and low-power environments.
- Respect `prefers-reduced-motion` and provide a static/hidden fallback.
- Ensure Canvas has no pointer events and remains `aria-hidden`.
- Avoid flashing, high density and strong particle trails.

### D. Animation choreography
Use CSS transitions or a small, stable Motion library integration only when the benefit justifies adding a dependency.
- Keep existing stack unless a library is demonstrably needed.
- Favor opacity, transform, clip-path masks and small translation; avoid animating layout, large filter changes, or backdrop filters every frame.
- Sequence hero badge → headline → paragraph → actions in a short, calm entrance.
- Use section reveal-once animations, modest hover image scale, and restrained CTA highlights.
- No exaggerated scroll hijacking, forced pinned scroll, auto-moving sliders, cursor confetti, or constant attention-demanding movement.
- Do not add GSAP, Three.js, tsParticles, or another library merely because it is mentioned in a prompt. Inspect bundle impact and existing capabilities first.

### E. Reduced motion and low-end devices
- All non-essential animation must be disabled/reduced when `prefers-reduced-motion: reduce`.
- On mobile/touch, simplify parallax and cursor-oriented lens effects.
- For small screens, lower visual effect intensity and particle count; protect battery, scroll performance and form usability.

## 5. Technical implementation constraints

Current app is Vite, React 18, TypeScript, React Router and Tailwind CSS. Maintain that stack.
- Continue using `lucide-react` for icons.
- Preserve Supabase integration, offline/demo mode, route model and all `/admin` functionality.
- Do not change the storage model or role guard as part of a visual upgrade.
- Do not expose service secrets, environment values, admin-only data or payment credentials.
- Avoid adding a dependency if CSS/canvas/existing libraries can safely deliver the effect.
- Consolidate theme variables rather than introducing duplicate competing palettes.
- Do not delete existing docs, manuals, test files, brand assets, redirects, or business workflows.
- Use semantic sections, headings, links and buttons.
- Ensure all interactive controls have accessible names, visible keyboard focus and meaningful hover/focus states.
- Images must have aspect-ratio rules, lazy-loading where appropriate, and correctly descriptive alt text. Hero image should not be lazy-loaded if that harms LCP.
- No inline secrets; no fake testimonials/reviews.

## 6. Suggested implementation sequence

### Phase 1 — Audit & baseline
- Check branch, working tree, scripts, current app preview, public route structure and existing tests.
- Establish a baseline of `npm run typecheck`, `npm test`, `npm run build`.
- Record known failures before edits.

### Phase 2 — Token foundation
- Establish the burgundy/rose-gold CSS variables and readable dark surfaces.
- Align `tailwind.config.js`, `src/styles/theme.css`, and `src/styles/index.css` so only one token system is authoritative.
- Add reusable glass, highlight, focus, motion-safe and reduced-motion styles.

### Phase 3 — Public shell
- Update `PublicLayout`, `PublicHeader`, `PublicFooter`, mobile dock and particles for consistent dark luxury branding.
- Keep admin visual identity and routes stable unless an existing shared style forces a change; prefer public-scoped classes.

### Phase 4 — Public pages
- Upgrade Home first, then Halls/Detail, Facilities, Gallery, Enquire, Contact and FAQ.
- Validate route behaviour after each change.
- Maintain working interactive forms, filters, modals, map/links and admin navigation.

### Phase 5 — Motion and performance
- Add hero reveal, section entries, CTA highlights and image hover.
- Refine current canvas particles rather than layering multiple particle systems.
- Add localized lens effect only if it remains lightweight and accessible.
- Measure bundle and performance after changes.

### Phase 6 — Verification
- Run all typecheck/tests/build.
- Check widths: 360px, 390px, 768px, 1024px, 1440px.
- Verify keyboard-only operation, visible focus, reduced-motion mode, mobile navigation and enquiry submission.
- Confirm `/admin` still loads and its role-based flows are unchanged.
- Inspect console warnings/errors and broken image paths.
- Provide screenshots or a concise page-by-page visual test summary if browser tooling is available.

## 7. Acceptance criteria

- [ ] Premium dark burgundy/rose-gold look with restrained editorial serif type.
- [ ] Responsive desktop and mobile layouts; no horizontal overflow at 360px width.
- [ ] Existing logo assets and verified business information retained.
- [ ] Glass nav and a small set of glass panels with accessible contrast and fallbacks.
- [ ] Hero-first venue photography and hierarchy; no invented factual claims.
- [ ] Ambient particles subtle, efficient, and reduced-motion aware.
- [ ] Lens/refraction effect is local, optional, and non-blocking.
- [ ] Gallery filters/lightbox and hall navigation continue to work.
- [ ] Enquiry form values, validation, submission and persistence behaviour preserved.
- [ ] Public contact data comes from existing venue data.
- [ ] `/admin`, auth, Supabase/demo mode and business logic remain functional.
- [ ] `npm run typecheck`, `npm test`, and `npm run build` pass, or deviations are documented honestly.
- [ ] No unnecessary framework migration or gratuitous animation dependency.

## 8. Final response expected from the coding agent

Return:
1. Summary of the upgraded experience.
2. Files created/modified.
3. Dependencies added/avoided and why.
4. Typecheck/test/build output summary.
5. Routes and interactions manually verified.
6. Any remaining placeholders (especially venue images or virtual tour panoramas).
7. Clear instructions to preview and deploy the change.
