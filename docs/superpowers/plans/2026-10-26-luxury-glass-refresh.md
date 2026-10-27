# Golden-Hour Hero & Liquid-Glass Refresh (PR 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public site's hero around the supplied entrance photo, move the public palette to burgundy / champagne / ivory, and add a three-tier glass system with real WebGL refraction over known photos, while hitting the spec's performance and accessibility targets.

**Architecture:** Speed groundwork comes first: lazy routes, `AuthProvider` scoped to admin, committed image derivatives. Then design tokens, then a `src/glass/` module. That module holds a pure tier selector, a React provider that writes `<html data-glass-tier>`, CSS-driven glass surfaces, and a lazily loaded hand-written WebGL renderer. The renderer refracts the hero photo inside registered "lens" elements and renders on demand only. Pages are migrated to tokens one group at a time, with a test that forbids hard-coded colours and a pending list that shrinks to empty.

**Tech Stack:** React 18, React Router 6, TypeScript, Vite 6, Tailwind 3, WebGL 1 (no libraries), `sharp` (dev only), Vitest + Testing Library (jsdom).

**Spec:** `docs/superpowers/specs/2026-10-26-luxury-glass-refresh-design.md` (§5–§10, §12).

## Global Constraints

- Branch `feat/luxury-glass-refresh`, created from the tip of `fix/content-cleanup` (`rtk git branch -f feat/luxury-glass-refresh fix/content-cleanup` before Task 1; it has no commits of its own). PR base: `fix/content-cleanup`. Never merge, never deploy.
- PR 1's tests (`tests/contentCleanup.test.tsx`) must stay green throughout; the hero strings and once-per-page rules are fixed.
- Anchor colours: burgundy `#541B2A`, champagne `#C9A56A`, ivory `#F8F3EB`. Champagne is never text on ivory (2.1:1). Every text/background pair used meets 4.5:1 (3:1 for ≥24 px text and UI boundaries).
- Existing Tailwind scales (`burgundy`, `wine`, `plum`, `rose`, `gold`, `ivory`, `forest`, `cream`, `ink`) and existing `theme.css` variables stay unchanged (admin and `tests/theme.test.ts` use them). New tokens live under `--brand-*` / Tailwind `brand`.
- `src/features/admin/**`, `src/components/admin/**` and `src/components/ui/Modal.tsx` are not edited.
- Only new dependency: `sharp` (devDependency). No three.js, no Playwright or Lighthouse packages in `package.json`.
- Hero photo: never shown wider than 1086 CSS px; desktop frame ≤600 CSS px; no grading, no generative edits; exactly one hero image request; never lazy.
- Glass tiers: `enhanced | lite | fallback` on `document.documentElement.dataset.glassTier`; `?glass=<tier>` override; downgrades cached in `sessionStorage` key `ts-glass-tier`.
- WebGL: render on demand only (no perpetual loop); DPR cap 1.5 when `innerWidth < 768`, else 2; pause when `document.hidden` or hero off-screen; release all GPU objects on unmount.
- Initial homepage JS (entry chunk + its static imports) ≤ 130 KB gzip and contains neither Supabase nor recharts.
- Every task ends with `npm run typecheck && npx vitest run` green before its commit.

## Review Focus

1. Enquiry submission fails (Supabase/network error): the user sees an error and can retry; no success or "booked" text appears. Test in Task 10.
2. `sessionStorage` throws (Safari private mode, blocked storage): tier detection still returns a tier and nothing crashes. Test in Task 4.
3. WebGL context lost mid-visit (mobile tab switch): the canvas hides, the DOM photo stays visible, and the renderer re-initialises on restore. Test in Task 11.
4. Resize or orientation change: the canvas backing size and lens rectangles follow the frame, so the photo is never stretched. Test in Task 11.
5. The hero image is slow or fails to load: the renderer never mounts and the hero text stays readable on the burgundy background. Tests in Tasks 7 and 11.

---

### Task 1: Route code splitting and admin-only auth

**Files:**
- Modify: `src/app/routes.tsx`, `src/app/App.tsx`, `vite.config.ts` (`build.manifest: true`)
- Create: `src/app/RouteFallback.tsx`, `src/app/AdminRoot.tsx`, `scripts/check-bundle.mjs`
- Modify: `package.json` (script `"check:bundle": "node scripts/check-bundle.mjs"`)
- Test: `tests/routes.test.tsx`

**Interfaces:**
- Produces: `AdminRoot: React.FC<{ children: React.ReactNode }>` (wraps children in `AuthProvider`); `RouteFallback: React.FC` (minimal burgundy loading state, `role="status"`, text "Loading…").

- [ ] **Step 1: Write failing tests.** In `tests/routes.test.tsx`:
  - `it('does not import AuthContext or supabase from the public tree')`: read `src/app/App.tsx` and assert it does not contain `AuthProvider`.
  - `it('lazy-loads every non-home route')`: read `src/app/routes.tsx` and assert it has no static `import { … } from '../features/admin/…'`. Assert `/lazy\(\(\) => import\('..\/features\/admin\/OverviewPage'\)/` matches.
  - `it('renders the home route without auth')`: render `<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />` and assert the `h1` text is `Thekkanath Souparnika`.
- [ ] **Step 2:** `npx vitest run tests/routes.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement.** Export `routes: RouteObject[]` from `routes.tsx`, alongside `router = createBrowserRouter(routes)`.
  - `HomePage` and `PublicLayout` stay static imports.
  - Every other page, `AdminLayout`, `LoginPage` and `ProtectedRoute` become `React.lazy` imports. Named exports map through `.then((m) => ({ default: m.X }))`. Each lazy element is wrapped in `<Suspense fallback={<RouteFallback />}>`.
  - The `/admin` and `/login` elements are wrapped in `<AdminRoot>`. Remove `AuthProvider` from `App.tsx`. `ToastProvider` stays at the root.
- [ ] **Step 4: Bundle check.** `scripts/check-bundle.mjs` reads `dist/.vite/manifest.json` and finds the `index.html` entry. It recursively collects that entry's `file` plus its static `imports` (not `dynamicImports`) and gzips each with `node:zlib`. It fails (exit 1) if the total exceeds 130 KB, or if any collected chunk contains `supabase-js` or `recharts-wrapper`. It prints a table of the chunks and their gzip sizes.
- [ ] **Step 5:** `npx vitest run && npm run build && npm run check:bundle`. Expected: tests pass; the check prints a total ≤130 KB and exits 0. Record the number for the PR (baseline 316 KB gzip).
- [ ] **Step 6:** Click through `/`, `/halls`, `/enquire`, `/login` and `/admin` in dev (the admin redirect/login still works). Commit `perf(routes): lazy-load non-home routes and scope auth to admin`.

---

### Task 2: Image pipeline and `ResponsivePicture`

**Files:**
- Move: `public/assets/venue/Golden-Hour Thekkanath Souparnika Entrance.png` → `assets-src/venue/golden-hour-entrance.png` (`git add` the new path; the old one was never tracked)
- Create: `scripts/optimize-images.mjs`, `src/data/imageManifest.json` (generated), `src/components/public/ResponsivePicture.tsx`
- Generated: `public/assets/venue/hero/entrance-{480,768,1086}.{avif,webp,jpg}`, `public/assets/venue/og/entrance-og.jpg`, `public/assets/venue/opt/venue-00{0..6}-{640,1024,<native>}.{avif,webp,jpg}`
- Modify: `package.json` (`sharp` devDependency; script `"images": "node scripts/optimize-images.mjs"`)
- Test: `tests/images.test.tsx`

**Interfaces:**
- Produces:
  - `type ImageKey = 'hero-entrance' | 'venue-000' | … | 'venue-006'`.
  - Manifest entry: `{ width: number; height: number; alt: string; avif: string; webp: string; jpg: string; fallback: string }`. The `avif`/`webp`/`jpg` fields are full `srcset` strings. `width`/`height` are the source's intrinsic size; the `alt` text is taken from the current page usages.
  - `ResponsivePicture: React.FC<{ image: ImageKey; sizes: string; priority?: boolean; className?: string; imgClassName?: string; alt?: string; onLoad?: React.ReactEventHandler<HTMLImageElement>; imgRef?: React.Ref<HTMLImageElement> }>`.
- Script settings:
  - Hero widths `[480, 768, 1086]` (never above source).
  - Venue widths `[640, 1024, native]`.
  - Quality: AVIF 55, WebP 78, JPEG 82 (mozjpeg).
  - OG image: 1086×570 crop, region `{ left: 0, top: 260, width: 1086, height: 570 }` (signage and entrance), JPEG 85.
  - Resizing only. No colour operations.

- [ ] **Step 1: Write failing tests.**
  - `it('manifest lists only files that exist')`: for every srcset URL in the manifest, `fs.existsSync('public' + url)`.
  - `it('never upscales the hero')`: parse the `hero-entrance` srcset widths and expect them to equal `[480, 768, 1086]`.
  - `it('renders a prioritised hero picture')`: render `<ResponsivePicture image="hero-entrance" sizes="…" priority />`. Expect `source[type="image/avif"]` before `source[type="image/webp"]`, and the `img` to have `width="1086"`, `height="1448"`, `fetchpriority="high"` and no `loading` attribute.
  - `it('lazy-loads non-priority pictures')`: `img` has `loading="lazy"` and `decoding="async"`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** `npm i -D sharp`; implement the script and component; run `npm run images`.
- [ ] **Step 4:** Run the tests. Expected: PASS. View `entrance-og.jpg` and `entrance-768.webp` and confirm the signage and building are unaltered and uncropped in the hero variants.
- [ ] **Step 5:** Commit `perf(images): committed AVIF/WebP/JPEG derivatives and ResponsivePicture`.

---

### Task 3: Brand tokens, surfaces, and colour guards

**Files:**
- Modify: `src/styles/theme.css` (append the brand block), `tailwind.config.js` (add `brand`)
- Create: `src/styles/brandTokens.ts` (single source of the hex values, imported by the test and mirrored in CSS)
- Test: `tests/brandTokens.test.ts`, `tests/noHardcodedColours.test.ts`

**Interfaces:**
- Produces:
  - CSS variables `--brand-burgundy-{950:#1E0A10, 900:#2E0F19, 800:#3F1520, 700:#541B2A, 600:#6B2537}`.
  - `--brand-champagne-{300:#E6D3AE, 400:#D8BD8A, 500:#C9A56A}`, `--brand-bronze-700:#7A5A2E`.
  - `--brand-ivory-{50:#FCFAF6, 100:#F8F3EB, 200:#EFE6D8}`, `--brand-ivory-muted:#D9CBBF`.
  - `--brand-charcoal-{900:#2A2421, 600:#5C524C}`, `--brand-rosegold:#C8907A` (decorative only).
  - Tailwind `brand.burgundy.950…600`, `brand.champagne.300…500`, `brand.bronze.700`, `brand.ivory.50…200`, `brand.ivory.muted`, `brand.charcoal.900/600`, `brand.rosegold`, all as `var(--brand-…)`.
  - Surface classes: `.surface-ivory` (bg ivory-100, text charcoal-900), `.surface-ivory-alt` (ivory-200), `.surface-burgundy` (900→950 gradient, text ivory-100), each with a matching `:focus-visible` outline (burgundy-700 on ivory, champagne-400 on burgundy).
  - `brandTokens.ts` exports `BRAND: Record<string, string>` with the same keys/values.

- [ ] **Step 1: Write failing tests.**
  - `brandTokens.test.ts`: each `BRAND` entry appears verbatim in `theme.css` as `--brand-<key>: <value>`. A `contrast(fg, bg): number` (WCAG 2.x relative luminance) is ≥4.5 for:

    ```
    charcoal-900/ivory-100, charcoal-600/ivory-100, charcoal-600/ivory-200,
    bronze-700/ivory-100, burgundy-700/ivory-100, ivory-100/burgundy-700,
    champagne-500/burgundy-700, champagne-300/burgundy-900,
    ivory-muted/burgundy-900, burgundy-900/champagne-500
    ```

    It also asserts `contrast(champagne-500, ivory-100) < 3`, which documents the rule.
  - `noHardcodedColours.test.ts`: scan `src/features/public/*.tsx`, `src/components/public/*.tsx` and `src/glass/**/*.tsx` for `/#[0-9a-fA-F]{3,8}\b|rgba?\(/`. Files in an exported `PENDING_MIGRATION` array (initially every currently offending public file) are skipped. Any other file must have zero matches. A second `it` asserts that every `PENDING_MIGRATION` entry still exists, so stale entries fail.
- [ ] **Step 2:** Run them. Expected: FAIL (no brand tokens yet).
- [ ] **Step 3:** Implement the tokens, Tailwind mapping and surface classes.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit `feat(brand): burgundy/champagne/ivory tokens with contrast and hard-coded colour guards`.

---

### Task 4: Glass capability detection and tier provider

**Files:**
- Create: `src/glass/capabilities.ts`, `src/glass/GlassPerformanceManager.tsx`, `src/glass/useGlassCapabilities.ts`
- Modify: `src/components/public/PublicLayout.tsx` (wrap its content in `GlassPerformanceManager`)
- Test: `tests/glassCapabilities.test.tsx`

**Interfaces:**
- Produces:
  - `type GlassTier = 'enhanced' | 'lite' | 'fallback'`.
  - `interface GlassEnvironment { override: GlassTier | null; supportsBackdropFilter: boolean; webgl: boolean; reducedMotion: boolean; saveData: boolean; effectiveType: string | null; deviceMemory: number | null; hardwareConcurrency: number | null; sessionDowngrade: GlassTier | null }`.
  - `selectGlassTier(env: GlassEnvironment): { tier: GlassTier; reasons: string[] }`.
  - `readGlassEnvironment(win: Window): GlassEnvironment`. Never throws. Parses `?glass=`. WebGL probe: create a canvas, `getContext('webgl')`, then `WEBGL_lose_context`. `sessionStorage` is read in try/catch.
  - `persistDowngrade(tier: GlassTier, win: Window): void` (try/catch).
  - `useGlassCapabilities(): { tier: GlassTier; reasons: string[]; pageVisible: boolean; downgrade(to: GlassTier, reason: string): void }` from the provider. The provider sets `document.documentElement.dataset.glassTier` and tracks `visibilitychange`.
- Rules, in order: valid override → override. No backdrop-filter → `fallback`. `sessionDowngrade` → that tier. Any of these → `lite`: `!webgl`, `reducedMotion`, `saveData`, `effectiveType` in `['slow-2g','2g']`, `deviceMemory < 4`, `hardwareConcurrency < 4` (`null` = unknown, ignored). Otherwise → `enhanced`. Each applied rule appends a reason string.

- [ ] **Step 1: Write failing tests.** A table test over `selectGlassTier`, covering one row per rule plus:
  - an invalid `?glass=shiny` → auto detection;
  - `deviceMemory: null` + `hardwareConcurrency: null` → `enhanced`;
  - downgrade beats capability.

  `readGlassEnvironment` with a `sessionStorage` getter that throws returns `sessionDowngrade: null` and doesn't throw (Review Focus 2). Rendering the provider sets `data-glass-tier` on `<html>`, and calling `downgrade('lite','slow')` updates it and writes `ts-glass-tier`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit `feat(glass): capability-aware tier selection with session downgrade and ?glass override`.

---

### Task 5: Glass surfaces (CSS tiers) and base components

**Files:**
- Create: `src/styles/glass.css` (imported from `src/styles/index.css`), `src/glass/GlassSurface.tsx`, `src/glass/GlassCard.tsx`, `src/glass/GlassHeroPanel.tsx`, `src/glass/usePointerLight.ts`, `src/glass/lensRegistry.ts`
- Test: `tests/glassSurface.test.tsx`

**Interfaces:**
- Consumes: `useGlassCapabilities()` (Task 4).
- Produces:
  - `GlassSurface: React.FC<{ as?: keyof JSX.IntrinsicElements; tone: 'light' | 'dark'; elevation?: 'flat' | 'raised'; interactive?: boolean; lens?: boolean; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>>`. It renders `class="glass-surface"` with `data-tone`/`data-elevation`. When `lens` is set it also adds `data-glass-lens` and registers itself in `lensRegistry`.
  - `GlassCard` = `GlassSurface` with `tone` defaulting by context, `elevation="raised"`, `interactive`. `GlassHeroPanel` = dark, raised, `lens`.
  - `lensRegistry`: `registerLens(el: HTMLElement): () => void`, `getLenses(): HTMLElement[]`, `subscribe(fn: () => void): () => void`.
  - `usePointerLight(ref: React.RefObject<HTMLElement>, enabled: boolean): void`. It sets `--glass-light-x/y` (0–1) on rAF-throttled `pointermove`. It is enabled only when the tier is `enhanced`, `(pointer: fine)` matches, and reduced motion is off.
- CSS (`glass.css`) keys off `[data-glass-tier]`:
  - **lite / default:** translucent fill (`--glass-fill-light` ivory 72% / `--glass-fill-dark` burgundy-900 62%), `backdrop-filter: blur(12px) saturate(120%)`, 1 px edge highlight, soft shadow.
  - **enhanced:** adds layered specular via `::before`. The radial gradient sits at `--glass-light-x/y`. A Fresnel-style edge ring comes from an inset box-shadow plus a `::after` conic/linear gradient border that strengthens toward the edges. Inner edge darkening and a contact shadow are added. Inside a lens with the renderer active (`[data-glass-refracting]`), the fill drops to a 25% tint so the refracted canvas shows through.
  - **fallback** (and `@supports not (backdrop-filter…)`): no blur. Solid burgundy-900 at 96% or ivory-50 at 98%, a 1 px champagne-500 border at 35%, a top highlight gradient and a shadow.
  - `prefers-reduced-motion`: no transitions on glass.

- [ ] **Step 1: Write failing tests.**
  - `GlassSurface` renders the given tag with `data-tone`.
  - `lens` registers on mount and unregisters on unmount (`getLenses().length` goes 1 → 0).
  - `usePointerLight` attaches no listener when the tier is `lite` (spy on `addEventListener`).
  - Read `glass.css` and assert the `[data-glass-tier="fallback"] .glass-surface` block contains no `backdrop-filter`, and that an `@supports not` block exists.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run them. Expected: PASS. Screenshot one card in each tier using `?glass=` on a scratch route or the Facilities page.
- [ ] **Step 5:** Commit `feat(glass): tiered glass surfaces, pointer lighting and lens registry`.

---

### Task 6: Glass navigation, top strip and mobile dock

**Files:**
- Create: `src/glass/GlassNavigation.tsx`
- Modify: `src/components/public/PublicHeader.tsx` (uses `GlassNavigation`; token colours), `src/components/public/PublicLayout.tsx` (mobile dock tokens + glass), `tests/noHardcodedColours.test.ts` (remove `PublicHeader.tsx` and `PublicLayout.tsx` from `PENDING_MIGRATION`)
- Test: `tests/glassNavigation.test.tsx`

**Interfaces:**
- Produces: `GlassNavigation: React.FC<{ heroSentinelId?: string; children: React.ReactNode }>`.
  - With a sentinel id present in the DOM, it observes that element and sets `data-nav-state="over-hero"` while it is intersecting, `"scrolled"` otherwise. Without one it is always `"scrolled"`.
  - `over-hero` = transparent dark glass with the `lens` flag. `scrolled` = burgundy-900 glass at 88%.
  - The header becomes `position: fixed` on `/` only. Inner pages keep `sticky`, with no layout shift.

- [ ] **Step 1: Write failing tests.** With a mocked `IntersectionObserver`, the state is `over-hero` while intersecting and `scrolled` after. The mobile menu button toggles `aria-expanded`. Escape closes the menu **and returns focus to the toggle**. The menu contains every nav destination plus `/enquire`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. The top strip keeps location, phone, email and WhatsApp on burgundy-950. Touch targets are ≥44 px (including the Staff Studio link: `min-h-[44px]`).
- [ ] **Step 4:** Run them. Expected: PASS. Screenshots at 390 and 1440 on `/` (top and scrolled) and `/halls`.
- [ ] **Step 5:** Commit `feat(nav): glass navigation that firms up after the hero`.

---

### Task 7: Hero rebuild with the entrance photo

**Files:**
- Create: `src/components/public/HeroSection.tsx`
- Modify: `src/features/public/HomePage.tsx` (replace the hero section with `<HeroSection />`), `index.html` (preload)
- Delete: `src/components/public/AmbientParticles.tsx`. In `tests/ambientParticles.test.ts`, delete only the AmbientParticles `it` and keep the caterers `it`. Remove `AmbientParticles.tsx` from `PENDING_MIGRATION` in `tests/noHardcodedColours.test.ts`.
- Test: `tests/hero.test.tsx`

**Interfaces:**
- Consumes: `ResponsivePicture` (Task 2), `GlassHeroPanel` (Task 5), `useGlassCapabilities` (Task 4).
- Produces:
  - `HeroSection: React.FC`. It renders `<div id="hero-sentinel">` for Task 6, and the photo frame `<div data-hero-frame>`, which contains the `ResponsivePicture` (`priority`, sizes `(min-width:1024px) 600px, (min-width:768px) 600px, 100vw`).
  - It keeps `heroImageReady` state: true on `img` `load` when `naturalWidth > 0`, false on `error`. The state is mirrored as `data-ready` on the frame. It holds `frameRef` and `imgRef`, which Task 11 uses to mount the renderer inside the frame.
- Layout (Tailwind, per spec §5.3):
  - **≥1024:** `grid-cols-[1fr_minmax(0,600px)]`; the frame is top-aligned, `aspect-[3/4]`, rounded, with a hairline border in champagne-500 at 30%.
  - **768–1023 portrait:** stacked, frame `max-w-[600px] mx-auto`.
  - **<768:** frame full-width `aspect-[3/4]` with no side crop. The text block uses `-mt-[28%]` over a gradient from burgundy-950 to transparent covering the bottom 40% of the frame.
  - Hero panel: inside the frame at `bottom-4 inset-x-4` (desktop: `bottom-6 left-6 max-w-xs`). It shows the location line and a `Get Directions` link to `VENUE_INFO.googleMapsUrl` (new tab, `rel="noreferrer"`).
  - Text order and copy are unchanged from PR 1. Buttons stay as they are and get champagne/burgundy token styles.
- `index.html`: `<link rel="preload" as="image" type="image/avif" imagesrcset="<hero avif srcset>" imagesizes="<same sizes>" fetchpriority="high">`.

- [ ] **Step 1: Write failing tests.**
  - Exactly one `img` inside `[data-hero-frame]`, with `fetchpriority="high"`, no `loading` attribute, and `width`/`height` set.
  - The `Get Directions` link's `href` equals `VENUE_INFO.googleMapsUrl`.
  - `heroImageReady` stays false after an `error` event (Review Focus 5). Expose this through a `data-ready` attribute on the frame.
  - `index.html` contains `rel="preload"` with `entrance-1086.avif`.
  - No `AmbientParticles` import remains anywhere in `src`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the full suite (PR 1 hero tests included). Expected: PASS. Take Playwright screenshots at 360×740, 390×844, 820×1180, 1024×768, 1440×900 and 1920×1080. Check that the signage is fully visible and undistorted, both pillars are visible on mobile, and no text sits over the signage.
- [ ] **Step 5:** Commit `feat(hero): golden-hour entrance photo with responsive split composition`.

---

### Task 8: `GlassModal`, focus trap and shared lightbox

**Files:**
- Create: `src/glass/useFocusTrap.ts`, `src/glass/GlassModal.tsx`, `src/components/public/Lightbox.tsx`
- Modify: `src/features/public/HomePage.tsx` (gallery tiles become `<button>`s; use `Lightbox`), `src/features/public/GalleryPage.tsx` (use `Lightbox`), `src/features/public/HallDetailPage.tsx` (use `GlassModal`)
- Test: `tests/lightbox.test.tsx`

**Interfaces:**
- Produces:
  - `useFocusTrap(containerRef: React.RefObject<HTMLElement>, active: boolean, returnFocusTo?: HTMLElement | null): void`.
  - `GlassModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: 'md' | 'lg' | '2xl' | '5xl' }>`. It has `role="dialog"`, `aria-modal`, `aria-labelledby`, locks scroll, closes on Escape and backdrop click, and is a dark glass surface.
  - `Lightbox: React.FC<{ photos: { src: ImageKey | string; title: string }[]; index: number | null; onIndexChange(i: number | null): void }>`. Arrow keys move between photos (wrapping). A horizontal pointer swipe of |dx| ≥ 50 px with |dx| > |dy| moves too. It has visible prev/next buttons (≥44 px) and an "n of N" status in `aria-live="polite"`.

- [ ] **Step 1: Write failing tests.**
  - On open, focus is inside the dialog. Tab from the last focusable element wraps to the first. Escape closes and focus returns to the thumbnail button that opened it.
  - ArrowRight and ArrowLeft change the shown title.
  - `pointerdown` at x=200 then `pointerup` at x=100 advances one photo.
  - Homepage gallery tiles are buttons named after their photo titles.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. The Gallery page's existing keyboard handling moves into `Lightbox`.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit `feat(a11y): glass modal with focus trap and shared swipeable lightbox`.

---

### Task 9: Migrate layout, footer and homepage to tokens and section rhythm

**Files:**
- Modify: `src/components/public/PublicFooter.tsx`, `src/features/public/HomePage.tsx`, `tests/noHardcodedColours.test.ts` (remove these files from the pending list). `.public-luxury` keeps its dark base until Task 10, so inner pages are never half-migrated; every home section sets its own surface class.

- [ ] **Step 1: Shrink the guard.** Remove `PublicFooter.tsx` and `HomePage.tsx` from `PENDING_MIGRATION`. Run `npx vitest run tests/noHardcodedColours.test.ts`. Expected: FAIL, listing their literals.
- [ ] **Step 2: Migrate.** Home sections map as follows:
  - hero → `surface-burgundy` (Task 7)
  - highlights strip → `surface-ivory`, tiles as `GlassCard tone="light"`
  - four spaces → `surface-ivory`
  - facilities → `surface-burgundy` with `GlassCard tone="dark"`
  - walkthrough → `surface-ivory-alt`
  - gallery → `surface-ivory`
  - location → `surface-ivory-alt`
  - FAQ → `surface-ivory`
  - CTA → `surface-burgundy`
  - footer → `surface-burgundy`

  Sections become full-bleed bands with an inner `max-w-7xl`. Small accent text on ivory uses `brand-bronze-700` or `brand-burgundy-700`, never champagne. Hall card images use `ResponsivePicture`.
- [ ] **Step 3:** `npx vitest run`. Expected: PASS (the PR 1 content tests included).
- [ ] **Step 4:** Screenshot `/` at 390 and 1440 in each tier (`?glass=enhanced|lite|fallback`) and check that fallback looks deliberate.
- [ ] **Step 5:** Commit `feat(brand): ivory/burgundy editorial rhythm on home, layout and footer`.

---

### Task 10: Migrate inner pages; enquiry form states

**Files:**
- Modify: `src/features/public/{HallsPage,HallDetailPage,FacilitiesPage,FAQPage,ContactPage,GalleryPage,EnquirePage}.tsx`, `src/components/public/PreferredCaterersCard.tsx`, `tests/noHardcodedColours.test.ts` (`PENDING_MIGRATION` becomes `[]`), `src/styles/theme.css` (`.public-luxury` base becomes ivory-100 with charcoal-900 text, and its dark radial gradients move to `.surface-burgundy`; this is done last in this task, once every page wraps its content in surface classes)
- Test: `tests/enquireForm.test.tsx`

- [ ] **Step 1: Write failing enquiry tests.**
  - Every visible input on step 1 is reachable via `getByLabelText` (label `htmlFor` ↔ input `id`).
  - Submitting with guests `0` sets `aria-invalid="true"` on the input, and the error text is linked through `aria-describedby`.
  - With `StorageService.createEnquiry` (called at `EnquirePage.tsx:144`) mocked to throw, completing the form shows an error in `role="alert"`. It must not show the success heading or any text matching `/confirmed|booked/i` (Review Focus 1). While pending, the submit button is `disabled` and reads `Sending…`.
  - Shrink `PENDING_MIGRATION` to `[]`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Migrate each page:
  - Page-header band → `surface-burgundy` (eyebrow, h1, intro); body → `surface-ivory`.
  - Facility and hall cards → `GlassCard tone="light"`.
  - Gallery overlays → dark glass on images.
  - The Enquire form sits in a `GlassSurface tone="light"` panel.
  - Fix the label/id pairs and the aria attributes. Success copy must say the enquiry was received and that the team will confirm availability.
- [ ] **Step 4:** `npx vitest run`. Expected: PASS, with zero hard-coded colours in public files.
- [ ] **Step 5:** Screenshot each inner page at 390 and 1440. Commit `feat(brand): migrate inner pages; accessible enquiry states`.

---

### Task 11: WebGL hero refraction renderer (lazy)

**Files:**
- Create: `src/glass/renderer/shaders.ts`, `src/glass/renderer/webgl.ts`, `src/glass/renderer/lensUniforms.ts`, `src/glass/renderer/frameBudget.ts`, `src/glass/renderer/HeroRefraction.tsx`
- Modify: `src/components/public/HeroSection.tsx` (mount through `React.lazy(() => import('../../glass/renderer/HeroRefraction'))`, only when `tier === 'enhanced' && heroImageReady`, after `requestIdleCallback`, with a `setTimeout(…, 200)` fallback)
- Test: `tests/heroRefraction.test.ts`

**Interfaces:**
- Consumes: `getLenses`/`subscribe` (Task 5), `useGlassCapabilities` (Task 4), `frameRef` and the hero `img` (Task 7).
- Produces:
  - `assessFrameTimes(samplesMs: number[]): 'ok' | 'slow' | 'insufficient'`. Fewer than 12 samples → `insufficient`. Median > 24 → `slow`.
  - `toLensUniforms(lensRects: DOMRect[], frame: DOMRect, dpr: number, max = 4): Float32Array`. Per lens it packs `x, y, w, h` in device pixels with the canvas origin at the **bottom-left**, plus a radius. Lenses are clipped to the frame; lenses entirely outside are dropped.
  - `createHeroRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement, opts: { dpr: number; onFailure(reason: string): void }): HeroRenderer | null`. Returns null and calls `onFailure` if the context or a shader fails. `HeroRenderer = { render(lenses: Float32Array, light: [number, number]): void; resize(w: number, h: number): void; destroy(): void }`.
  - `HeroRefraction: React.FC<{ frame: HTMLElement; image: HTMLImageElement }>`.
- Fragment shader math (the part the signature doesn't decide):

```glsl
// per lens i: rounded-rect SDF d (px, <0 inside); bezel b = 18.0*dpr
float t = clamp(-d / b, 0.0, 1.0);              // 0 at edge → 1 past the bezel
vec2  n = normalize(sdfGradient);                // outward normal
float bend = (1.0 - t) * (1.0 - t);              // strongest at the rim
vec2  off = -n * bend * 14.0 * dpr / u_res;      // refraction offset in uv
// dispersion only inside the bezel band (decorative rim), never the interior
vec3 col = vec3(texture2D(u_img, uv + off*1.00).r,
                texture2D(u_img, uv + off*1.04).g,
                texture2D(u_img, uv + off*1.08).b);
float fres = pow(1.0 - t, 3.0);                  // Fresnel-like rim
float spec = pow(max(dot(n, normalize(u_light - p)), 0.0), 8.0) * fres;
col = mix(col, col * 0.88, (1.0 - t) * 0.5)      // edge darkening
    + vec3(1.0, 0.95, 0.86) * (0.22 * fres + 0.35 * spec);
// outside every lens: plain texture2D(u_img, uv)
```

  The texture is sampled with the same `object-fit: cover` mapping as the DOM image, so outside the lenses the canvas is pixel-identical to the photo.

- Lifecycle:
  - Canvas backing size = frame size × min(DPR, cap).
  - A `ResizeObserver` on the frame triggers `resize` + render.
  - Renders happen on: lens registry change, scroll (passive, rAF-coalesced, only while the frame intersects the viewport) and pointer move (enhanced + fine pointer).
  - The first 600 ms fade-in renders consecutive frames and records rAF deltas into `assessFrameTimes`. `slow` → `downgrade('lite', 'frame-budget')` and unmount. This is the only measurement, and the result is cached by Task 4.
  - `webglcontextlost` → `preventDefault`, hide the canvas, stop rendering. `webglcontextrestored` → re-create resources and render.
  - Unmount → `destroy()` (delete texture/buffer/program/shaders, `WEBGL_lose_context`), remove all listeners and observers.
  - `document.hidden` → no renders.
  - When active, set `data-glass-refracting` on each registered lens so Task 5's CSS reduces their fill.

- [ ] **Step 1: Write failing tests.**
  - `assessFrameTimes`: 11 samples → `insufficient`; median 16 → `ok`; median 30 → `slow`.
  - `toLensUniforms`: a lens at frame top-left 10,10 size 100×50 with frame height 400 and dpr 2 → `y = (400 - 10 - 50) * 2 = 680`. A lens fully outside the frame is dropped; a sixth lens beyond `max` is ignored.
  - `createHeroRenderer` with `getContext` returning null → returns null, and `onFailure` is called with `'no-webgl'`.
  - With a stub GL whose `getShaderParameter` returns false → null + `'shader-compile'`.
  - With a spy GL: `destroy()` calls `deleteTexture`, `deleteBuffer` and `deleteProgram` once each.
  - Dispatching `webglcontextlost` hides the canvas (`style.visibility === 'hidden'`) and calls `preventDefault` (Review Focus 3).
  - A `ResizeObserver` callback with a new size calls `resize` with the frame size × the capped DPR (Review Focus 4).
  - Rendering `HeroSection` with tier `enhanced` and then firing `error` on the hero `img` leaves no `canvas` in the frame (Review Focus 5).
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. Check that the dynamic import produces its own chunk (`npm run build`; a `HeroRefraction-*.js` file appears and is ≤15 KB gzip).
- [ ] **Step 4:** Run the tests and `npm run check:bundle`. Expected: PASS; the initial budget is still ≤130 KB.
- [ ] **Step 5:** In a browser at `/?glass=enhanced`:
  - Watch the panel, nav and CTAs bend the photo.
  - The text stays crisp.
  - The performance panel shows no frames while idle.
  - Switching tabs and returning still renders.
  - Simulate context loss with `WEBGL_lose_context.loseContext()` in the console; it recovers.
- [ ] **Step 6:** Commit `feat(glass): on-demand WebGL refraction for the hero`.

---

### Task 12: Shared refraction for gallery and hall overlays

**Files:**
- Create: `src/glass/renderer/cardRefraction.ts`, `src/glass/RefractiveOverlay.tsx`
- Modify: `src/features/public/HomePage.tsx` (hall card badges, gallery tile captions), `src/features/public/GalleryPage.tsx` (tile captions)
- Test: `tests/cardRefraction.test.ts`

**Interfaces:**
- Consumes: shaders and `webgl.ts` (Task 11), `useGlassCapabilities`.
- Produces:
  - `getCardRenderer(): CardRenderer | null`, a lazily created singleton holding one WebGL context on a detached canvas.
  - `CardRenderer.renderTo(target: HTMLCanvasElement, image: HTMLImageElement, lenses: Float32Array): void`. It renders into the shared GL canvas, then `target.getContext('2d').drawImage(...)`.
  - LRU texture cache of 8 entries.
  - `RefractiveOverlay: React.FC<{ imageRef: React.RefObject<HTMLImageElement>; children: React.ReactNode }>`. It wraps an overlay label as a lens and renders once when the card enters the viewport (IntersectionObserver) and on resize. It never animates.
- Budget gate: each `renderTo` duration is recorded. If the median of the first 8 exceeds 8 ms, the singleton disables itself (overlays keep the enhanced CSS look) and the reason goes into `useGlassCapabilities().reasons` as `'card-refraction-disabled'`. Report this in the PR if it triggers.

- [ ] **Step 1: Write failing tests.**
  - The singleton returns the same instance twice.
  - The texture cache evicts the least recently used entry on the ninth image (spy GL `deleteTexture` called once).
  - The budget gate disables after 8 renders when durations are mocked at 12 ms.
  - `RefractiveOverlay` doesn't render while off-screen (mocked IntersectionObserver).
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run them. Expected: PASS. Check visually at `/?glass=enhanced` and `/gallery?glass=enhanced`.
- [ ] **Step 5:** Commit `feat(glass): shared-context refraction for gallery and hall overlays`.

---

### Task 13: SEO metadata and per-route meta

**Files:**
- Modify: `index.html` (canonical, Open Graph, Twitter card, JSON-LD; trim the Google Fonts URL to the weights in use)
- Create: `src/data/pageMeta.ts`, `src/hooks/usePageMeta.ts`
- Modify: `src/components/public/PublicLayout.tsx` (call `usePageMeta`)
- Test: `tests/seo.test.tsx`

**Interfaces:**
- Produces:
  - `SITE_URL = 'https://www.thekkanathsouparnika.com'`.
  - `PAGE_META: Record<'/' | '/halls' | '/facilities' | '/gallery' | '/enquire' | '/contact' | '/faq', { title: string; description: string }>`.
  - `usePageMeta(pathname: string): void`. It sets `document.title`, `meta[name=description]` and `link[rel=canonical]` (`SITE_URL + pathname`, with no trailing slash except `/`). `/halls/:slug` uses `` `${hall.name} — Thekkanath Souparnika` `` and the hall's description.
- JSON-LD `EventVenue`: `name`, `url`, `image` (the OG image URL), `telephone` (both `VENUE_INFO.displayPhones`), `email`, `address` (`PostalAddress` from `VENUE_INFO.address`), `maximumAttendeeCapacity: 400`. No geo, no ratings, no price range.

- [ ] **Step 1: Write failing tests.**
  - `index.html` has `rel="canonical"` with `SITE_URL/` and an `og:image` whose path exists under `public/`.
  - The JSON-LD parses, `@type === 'EventVenue'`, `maximumAttendeeCapacity === 400`, and every `telephone` value is one of `VENUE_INFO.displayPhones`.
  - Rendering `PublicLayout` at `/halls` sets the canonical to `https://www.thekkanathsouparnika.com/halls` and the title to `PAGE_META['/halls'].title`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. Keep the existing title and description wording for `/`.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit `feat(seo): canonical, social cards, EventVenue JSON-LD and per-route meta`.

---

### Task 14: Verification report and PR 2

- [ ] **Step 1:** `npm run typecheck && npx vitest run && npm run build && npm run check:bundle`. Expected: all green; record the initial-JS gzip number.
- [ ] **Step 2: Browser matrix** (Playwright MCP against `npm run preview`):
  - The 6 sizes from Task 7 × tiers `enhanced`/`lite`/`fallback` on `/`.
  - 390 + 1440 for every inner page.
  - `prefers-reduced-motion: reduce` emulation on `/` (no pointer lighting, no fade).
  - A keyboard-only pass: skip through the nav, open and close the mobile menu, open the lightbox and navigate it with the arrow keys, and fill the Enquire step 1 by keyboard.
  - A WebGL-disabled check: `?glass=lite` plus, where possible, a Chromium launch with `--disable-webgl`.
  - Run whatever Firefox and WebKit engines are available. Record any engine that couldn't be run.
- [ ] **Step 3: Lighthouse.** Run `npx -y lighthouse@12 http://localhost:4173/ --preset=desktop` and the default mobile run, three times each, and take the median. Record Performance, LCP, CLS and TBT (INP proxy). If below target, record the cause; don't claim the target.
- [ ] **Step 4:** Admin smoke test: `/login` renders and `/admin` redirects or loads as before. Screenshot to compare with `main`.
- [ ] **Step 5:** Push `feat/luxury-glass-refresh` and run `gh pr create --base fix/content-cleanup`. The body includes:
  - the brief's 12-item checklist, each item verified or not verified with evidence;
  - before/after bundle and Lighthouse numbers;
  - the owner's manual checklist: real iPhone Safari, real Android Chrome, a browser without `backdrop-filter`, and the request for a higher-resolution photo.

  Do not merge.
