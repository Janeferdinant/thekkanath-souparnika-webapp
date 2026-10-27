# Design: Content Cleanup, Golden-Hour Hero & Liquid-Glass Refresh

**Date:** 2026-10-26
**Status:** Decisions approved by owner (all 16 recommendations accepted, 2026-10-26)
**Source brief:** "Antigravity Master Prompt: Thekkanath Souparnika Luxury Liquid Glass Website Upgrade" (pasted by owner)
**Repository:** `thekkanath-souparnika-webapp` (React 18 + Vite 6 + TypeScript + Tailwind 3, deployed on Vercel)
**Live site:** https://www.thekkanathsouparnika.com/

---

## 1. Intent

The public website already has a dark burgundy / rose-gold "liquid glass" look. The owner wants to:

1. Fix specific copy problems now: remove two phrases, and stop repeating the same parking and capacity figures everywhere (they appear ~20 times today).
2. Put the venue name and new wording into the homepage hero, and replace the hero photo with the newly supplied golden-hour entrance photograph.
3. Lift the whole public site to a premium hospitality feel: burgundy + champagne gold + warm ivory, editorial layouts, and glass that behaves like a real material (true refraction where it is technically honest, good fallbacks everywhere else).
4. Do this without hurting speed, accessibility, or anything that works today (enquiry form, admin, routes).

Success = the mandatory copy fixes are verifiably done, the hero shows the real building sharply on every screen size, the site looks deliberately luxurious on any device (including ones with no WebGL or blur), and measured performance is good (Lighthouse 90+ target, LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms), reported with real numbers.

## 2. Goals, non-goals, anti-goals

### Goals
- Mandatory content changes (§4) shipped first as a small, separate PR.
- New hero composition built around the supplied photo (§5).
- New public design tokens and an ivory/burgundy editorial rhythm (§6).
- Reusable glass system with three rendering tiers and capability detection (§7).
- Real WebGL refraction in the hero and on gallery/hall image overlays (§7.4).
- Route-level code splitting and a committed responsive image pipeline (§8).
- Accessibility fixes found in the audit (§9) and SEO additions (§10).

### Non-goals
- Restyling or changing the admin portal (`/admin/*`). It must keep working and look the same; it is only re-checked.
- New facts, facilities, capacities, prices, or availability claims of any kind.
- Server-side rendering / prerendering, CMS, analytics, new routes, or changes to the enquiry backend.
- Any edit to the photograph that changes the building (no generative fill, no reconstruction, no sky replacement, no heavy grading).
- Production deployment. Work ends at open PRs; the owner merges.

### Anti-goals (would be a failure even if "done")
- A soft/blurry hero from upscaling the 1086 px-wide photo.
- Signage, logo, or entrance cropped, stretched, or distorted on any screen size.
- Shaders that distort text, logos, signage, or controls.
- A continuous animation loop or GPU work while nothing is changing; battery drain on phones.
- A fallback mode that looks broken or unstyled.
- Any message implying a booking is confirmed when only an enquiry was sent.
- Regressions in the enquiry flow, admin, auth, or existing routes.

## 3. Constraints

- Keep the existing stack: React 18, Vite, TypeScript, Tailwind 3, lucide-react, Supabase. No UI framework or 3D library (no three.js). WebGL is hand-written.
- One new dev dependency is approved: `sharp` (image derivatives, run locally; outputs are committed so Vercel does not run it).
- Admin pages use the existing Tailwind colour scales (`burgundy`, `gold`, `ivory`, `cream`, `ink`, …). These scales must not change. New public tokens go in a new namespace.
- Fonts stay: Cormorant Garamond (display) + Inter (body).
- Work happens on branches; nothing is merged or deployed by the builder.

## 4. Content changes (PR 1)

### 4.1 Exact removals
| Location | Remove | Leave |
|---|---|---|
| `PublicHeader.tsx` top strip | the span `· On PWD Bus Route · 40–50 Compound Parking` | location, phone, email, WhatsApp |
| `PublicFooter.tsx` bottom bar | `Solar Hybrid Power`, `Water Authority Tested Water`, and both `·` separators | `Nellikunnu, Thrissur` |

Spacing around what remains must look intentional (no orphan separators or gaps).

### 4.2 Where each repeated fact lives after cleanup
**Capacity ("ideal for 250–300 guests, up to 400")** stays in exactly these places:
- Halls page intro (one sentence).
- Full-venue (`auditorium`) hall data `capacityText`, shown on the Halls page and its detail page.
- One stat in the merged homepage highlights strip (§4.3).
- Enquire form guest-count field label/hint (functional help for filling the form).
- FAQ answer "How many guests…" (it is the direct answer to that question).

Removed from: homepage hero note row, footer reservations card, Halls page bottom paragraph (keep its unique info: one event at a time, 100 seats per hall, dining 100 per sitting), the auditorium `description` text (capacity already shown beside it), the Enquire guest-field hint paragraph (the label keeps the figure), and the Hall detail sentence "Arranged for gatherings of 250 to 300 guests…" (it renders on every hall page; the full-venue page already shows it via `capacityText`).

Rule: the 250–300 figure appears **at most once per rendered page**. So the Dining Hall description ("serving 250 to 300+ guests easily in batches") and the Preferred Caterers chip ("250–300+ in Batches") are reworded to keep the batch-service meaning without the number. *(Builder's call: they render on pages that already show the figure.)*

**Homepage FAQ preview** shows four FAQs that are neither the capacity nor the parking question, so the homepage carries the capacity figure once (highlights strip) and no parking figure. FAQ entries gain a stable `id` so pages pick FAQs by id, not by array position.

**Parking ("40–50 cars")** stays in exactly:
- Facilities page parking card (`FACILITIES` id `on-site-parking`), stated **once** inside that card (today the title, badge and description each repeat it; keep it in the badge only).
- FAQ answer "What is the parking capacity?".

Removed from: header strip (§4.1), homepage hero paragraph ("ample on-site parking"), hero note row, homepage key-details tile, homepage trust badge, homepage location checklist, footer description, footer reservations card ("and the entire parking compound"), Enquire page paragraph, auditorium `features` list, and the vague "ample on-site parking" in the Facilities page intro and homepage facilities intro.

Edits must keep meaning; reword the surrounding sentence rather than leaving fragments.

### 4.3 Homepage repetition
Merge the "Key Details" tiles and the "Trust Badges" cards into one highlights strip. It covers: four connected halls; 250–300 guests (up to 400); three air-conditioned halls; one event at a time. Solar power and tested water remain in the homepage facilities section and on the Facilities page (they are not removed site-wide; only the footer phrase was requested).

Footer description becomes a short line with no facility list (e.g. venue type + location + four connected halls).

### 4.4 Hero copy
Hero contains, in this hierarchy, with this exact wording and punctuation:
1. **Thekkanath Souparnika** — brand heading. *(Builder's call, recorded: this is the page's `<h1>`, for SEO.)*
2. **Traditional & Contemporary Celebrations in Thrissur** — eyebrow/subtitle (replaces "A Warm Family Venue in Thrissur").
3. **Where family milestones / feel truly special.** — main display headline, visually the largest line, line break after "milestones" on wider screens.

Existing hero buttons ("Explore the Halls" → `/halls`, "Check Date / Enquire" → `/enquire`) and their behaviour stay. The supporting paragraph stays minus the parking phrase.

### 4.5 Venue descriptor
Use "Hall & Events Venue" everywhere public (header logo line, footer brand block), sourced from `VENUE_INFO.descriptor` rather than hard-coded.

## 5. Hero photo & composition (PR 2)

### 5.1 Source
- Supplied file: `public/assets/venue/Golden-Hour Thekkanath Souparnika Entrance.png`, 1086×1448 (portrait 3:4), 2.8 MB.
- Move the source out of `public/` to `assets-src/venue/golden-hour-entrance.png` (kept in the repo, not deployed).
- Use the photo as supplied. It is already golden-hour graded; apply no further colour grading. Readability comes from CSS overlays placed only over the paving/sky, never over signage.
- Never display the photo wider than 1086 **CSS** px. On high-density screens some softness is unavoidable from this source, so layouts keep the photo's CSS width small: desktop frame ≤600 CSS px wide (≈1.8 device px per source px at 2×), mobile full-width (390 CSS px → covers up to ~2.8×). *(Builder's call, recorded.)*
- Open request to owner (non-blocking): a higher-resolution original would allow larger frames later.

### 5.2 Derivatives (committed)
`scripts/optimize-images.mjs` (sharp) produces `public/assets/venue/hero/entrance-{480,768,1086}.{avif,webp,jpg}` and an Open Graph image (~1086×570 crop centred on the signage and entrance). The same script also produces AVIF/WebP/JPG width variants for `venue-000…006.jpg` (gallery and hall images). `npm run images` regenerates everything.

### 5.3 Layout per screen size
- **Desktop (≥1024 px):** full-bleed burgundy hero that starts under the transparent navigation. Two columns: text on the left; on the right a tall portrait frame showing the whole photo (aspect 3:4, ≤600 CSS px wide), top-aligned so the transparent navigation overlaps the sky above the roof. A glass info panel sits **inside** the frame over the lower wet paving, showing the location line (Market Junction, Nellikunnu · Opposite RGLP School) and a "Get Directions" link to `VENUE_INFO.googleMapsUrl`. This is new information next to a photo of the entrance, so it doesn't repeat the highlights strip. *(Builder's call: a panel straddling the frame edge would only be half over the photo, so only half of it could truly refract.)* Nothing overlaps the signage or entrance.
- **Tablet (768–1023 px):** portrait tablets stack a centred photo frame (≤600 CSS px wide, full 3:4 photo, no crop) above the text; landscape tablets use the desktop split.
- **Mobile (<768 px):** the photo spans the full width at its natural 3:4 ratio (no side cropping, so both pillars, the canopy, signage and entrance stay visible). The text starts over the lower paving with a burgundy gradient and continues below. Buttons stay ≥44 px tall and stacked.

### 5.4 Loading
`<picture>` with AVIF → WebP → JPG, `srcset` + `sizes`, explicit `width`/`height`, `fetchpriority="high"`, never lazy. `index.html` preloads the likely hero candidate. Below-the-fold images are `loading="lazy"` + `decoding="async"` with width/height set. Exactly one hero image request per page load.

## 6. Design system (PR 2)

### 6.1 Tokens
CSS custom properties in `theme.css`, exposed to Tailwind under a new `brand` colour namespace (existing scales untouched):
- Burgundy `#541B2A` (+ deeper shades for dark bands and surfaces).
- Champagne gold `#C9A56A` (+ a lighter and a deeper/bronze shade).
- Warm ivory `#F8F3EB` (+ a slightly darker ivory for alternating sections).
- Warm charcoal for body text on ivory.
- Muted bronze and rose-gold as small accents only.
- Glass tokens: light-glass fill (frosted ivory), dark-glass fill (burgundy tint), blur radius, edge highlight, specular strength, shadow, all switchable per rendering tier.

Rose-pink accents (`#e2b8b2`, `#c58e91`, `#e8c7bc` …) are replaced by champagne/bronze across the public site. All ~830 hard-coded colour literals in public pages and components are migrated to tokens.

### 6.2 Contrast rule (hard requirement)
Every text/background pairing meets WCAG 2.2 AA (4.5:1 normal text, 3:1 large text and UI boundaries). Measured anchors: champagne `#C9A56A` on ivory `#F8F3EB` is **2.1:1 → never used for text on ivory**; on burgundy `#541B2A` it is **5.8:1 → allowed**. Gold on ivory is for rules, icons at ≥3:1, and decoration only; small accent text on ivory uses burgundy or a bronze shade that passes 4.5:1. A unit test checks the token pairings actually used.

### 6.3 Section rhythm
Ivory is the default content surface (charcoal text, frosted-ivory glass). Burgundy bands are used for: hero, homepage facilities section, call-to-action banner, footer, and the page-header band on inner pages. The builder decides the exact section-by-section mapping on inner pages following this principle.

### 6.4 Navigation
Transparent dark glass over the hero; after scrolling past the hero (or on pages without a full-bleed hero) it becomes a more opaque burgundy glass that keeps the gold logo and links legible. The mobile menu, enquiry CTA, Escape-to-close, and keyboard/touch behaviour are preserved. The top contact strip stays (minus the removed phrase).

### 6.5 Motion
Restrained: nav transition, glass lighting, image fades, modal/lightbox transitions. `AmbientParticles` (continuous 2D canvas loop) is removed from the hero. `prefers-reduced-motion: reduce` disables pointer lighting, transforms, and shader animation. No content or function depends on hover or animation.

## 7. Glass system (PR 2)

### 7.1 Components and modules
`GlassSurface` (base), `GlassNavigation`, `GlassHeroPanel`, `GlassCard`, `GlassModal` (new; used by public pages only: homepage and Gallery lightboxes, Hall detail. The shared `src/components/ui/Modal.tsx` used by 13 admin files stays unchanged. *Builder's call, recorded.*), `GlassRenderer` (lazy WebGL; implemented as `HeroRefraction` for the hero plus a shared-context card renderer), `GlassPerformanceManager` (context: current tier, downgrade, visibility), `useGlassCapabilities`. Glass is used only on: navigation, hero panels, selected CTAs, venue/hall cards, gallery overlays, modals/enquiry surfaces. Plain sections stay plain.

### 7.2 Tiers
The tier is written to `<html data-glass-tier="enhanced|lite|fallback">` and all glass CSS keys off it.
- **enhanced:** lite glass plus layered specular, Fresnel-style edge lighting, restrained pointer lighting (desktop, fine pointer only), and WebGL refraction where §7.4 applies.
- **lite:** translucent fills, limited `backdrop-filter` blur, static edge highlight, simple shadows, no shader, no pointer tracking. This is also the pre-JS default.
- **fallback:** solid or lightly translucent burgundy/ivory surfaces with gradients, borders, highlights and shadows; no dependency on blur, canvas or WebGL. It is designed to look intentional, not like an error state.

### 7.3 Choosing the tier
- No `backdrop-filter` support → fallback.
- Reduced motion, Save-Data, slow connection (`effectiveType` 2g/slow-2g), low `deviceMemory` / `hardwareConcurrency` → at most lite.
- WebGL context creation fails, shader compile/link fails, or context lost → lite (or fallback if blur is also unsupported).
- One bounded performance check: frame times are sampled during the renderer's first real renders (no synthetic benchmark). If too slow, downgrade to lite. The result is cached in `sessionStorage` so it is never re-measured in the same session.
- User-agent strings are never the sole signal.
- QA override: `?glass=enhanced|lite|fallback` forces a tier (for testing and screenshots).

### 7.4 WebGL refraction scope
Real refraction only where the backdrop is a known image:
1. **Hero scene:** one canvas over the hero photo area renders the photo as a texture and refracts it inside registered lens regions: the hero info panel, the navigation while it overlaps the photo, and selected CTAs on the photo. DOM text sits above the canvas and is never distorted. The DOM `<img>` stays as the LCP element and the fallback; the canvas fades in only after successful initialisation.
2. **Gallery and hall image overlays:** a single shared WebGL context renders refraction for overlay labels on cards in view (IntersectionObserver), statically, re-rendering only on hover. If this cannot meet the performance budget, those overlays ship with enhanced CSS lighting instead, and the shortfall is reported.

Everywhere else, enhanced means CSS specular/Fresnel lighting, not refraction, and is never described as refraction.

Renderer rules: shader code is a lazily loaded chunk fetched after the hero image has loaded and the browser is idle. It renders on demand (resize, scroll while the hero is in view, pointer move) with no perpetual loop. Device-pixel ratio is capped (≤1.5 on mobile, ≤2 desktop). Rendering pauses when the page is hidden or the hero is off-screen. Context loss/restore is handled. All GPU resources are released on unmount. Subtle chromatic dispersion only on decorative edges.

## 8. Performance (PR 2)
- Baseline (measured 2026-10-26 on `main`): one JS chunk of 1,201 KB (316 KB gzip), CSS 72.5 KB (12.5 KB gzip).
- Route-level code splitting with `React.lazy`: Home stays eager; other public pages, `LoginPage`, and all admin pages/layout are lazy. `AuthProvider` (which imports Supabase and the storage engines) moves from wrapping the whole app to wrapping only `/admin/*` and `/login`, so the homepage chunk carries neither Supabase nor `recharts`. `isDemoMode` used by `PublicHeader` must not pull Supabase in.
- Trim Google Fonts weights to those actually used.
- Targets: Lighthouse performance ≥90 mobile and desktop; LCP ≤2.5 s, CLS ≤0.1, INP ≤200 ms under Lighthouse's standard mobile throttling; record the homepage initial JS (gzip) before and after.
- Baseline measurements are taken before any change so improvements are measured, not claimed.

## 9. Accessibility (PR 2)
- `GlassModal`: focus moves in on open, is trapped while open, Escape closes, and focus returns to the trigger.
- Homepage gallery thumbnails become `<button>`s with accessible names. One shared lightbox for the homepage and Gallery page: arrow keys, swipe (pointer events), visible controls, image alt text.
- Visible focus rings on both surfaces (champagne on burgundy, burgundy on ivory). Touch targets ≥44×44 px (includes the header "Staff Studio" link). Semantic headings in order.
- Enquiry form: keep existing integrations; make sure labels, inline validation messages (announced), loading, error and success states are clear. Success copy must say the enquiry was received, never that a booking is confirmed or a date is available.

## 10. SEO (PR 2)
- `index.html`: canonical `https://www.thekkanathsouparnika.com/`, Open Graph + Twitter card tags using the new entrance OG image, and `EventVenue` JSON-LD with only confirmed facts (name, address, phones, email, URL, image, maximum attendee capacity 400).
- A small hook (no new dependency) updates `document.title`, meta description and canonical per public route.
- Existing title, description, routes and redirects are preserved; the description is reworded only if it contradicts the cleanup.

## 11. Release plan
- **PR 1, branch `fix/content-cleanup` (from `main`):** this design doc, the implementation plan, and §4 only, with the hero still using the current photo. Includes tests that prove the removals.
- **PR 2, branch `feat/luxury-glass-refresh` (based on PR 1):** §5–§10. Opened as a stacked PR with base `fix/content-cleanup`, so its diff shows only PR 2 work; GitHub retargets it to `main` when PR 1 merges.
- The builder pushes branches and opens the PRs. Pushing may create Vercel preview deployments; that is expected and not production. The builder never merges.

## 12. Verification
Automated (Vitest): the removed phrases are absent from the rendered header/footer; the parking figure appears only in the allowed places; the hero contains the three required strings; tier selection logic under mocked capabilities; contrast of token pairs.

Browser checks (Playwright): screenshots at 390×844, 820×1180, 1024×768, 1440×900, 1920×1080; each glass tier via the `?glass=` override; reduced-motion emulation; keyboard-only pass through nav, gallery/lightbox and enquiry form; CPU and network throttling. Lighthouse mobile and desktop on a production build (`vite preview`), before and after.

Honesty about coverage: real iOS Safari and physical Android devices cannot be tested by the builder. Those, plus a real "browser without backdrop-filter", are listed for the owner to check on the PR preview. The final report states exactly what was run and the actual numbers, including anything that missed target.

Final checklist (verbatim from the brief), each marked verified / not verified with evidence in the PR description:
1. The exact solar-hybrid/water-authority phrase is absent from the footer.
2. The exact PWD bus-route/parking phrase is absent from the top area.
3. Duplicate parking and capacity descriptions have been consolidated.
4. "Thekkanath Souparnika" appears with the specified homepage hero text.
5. The newly supplied entrance image replaces the previous hero image.
6. The building architecture, signage, and proportions remain unchanged.
7. Desktop, tablet, and mobile crops have been checked.
8. Hero buttons and all existing functionality continue to work.
9. Enhanced liquid glass works where supported.
10. Lightweight glass and CSS-only fallback modes work independently.
11. Accessibility, performance, and responsive layouts have been tested.
12. The project builds successfully without introducing unrelated changes.

PR 1 covers items 1–4, 8 and 12; PR 2 covers all twelve.

Browser automation runs one-off through the Playwright tooling available to the builder; no Playwright dependency is added to the repo.

## 13. Left to the builder
Exact extra shades, component APIs and file layout, shader math, section-by-section surface mapping on inner pages, animation timings, and exact rewording needed to remove duplicates without changing meaning, all within the rules above.
