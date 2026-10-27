# Content Cleanup (PR 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the brief's mandatory copy fixes: remove two phrases, consolidate repeated parking/capacity figures, and add the venue name and new eyebrow to the homepage hero, without any visual redesign.

**Architecture:** Pure content edits in existing React pages, `venueData.ts`, and the public header/footer. One new render-level test file pins every removal and the "appears once" rules so PR 2's redesign cannot silently reintroduce them.

**Tech Stack:** React 18, React Router 6, TypeScript, Vitest + Testing Library (jsdom).

**Spec:** `docs/superpowers/specs/2026-10-26-luxury-glass-refresh-design.md` (§4 and §11 apply to this PR).

## Global Constraints

- Branch: `fix/content-cleanup` (from `main`). PR targets `main`. Never merge.
- Phrases that must disappear: header `On PWD Bus Route`, `40–50 Compound Parking`; footer `Solar Hybrid Power`, `Water Authority Tested Water`, plus their `·` separators.
- Hero strings, verbatim: `Thekkanath Souparnika` (the `<h1>`), `Traditional & Contemporary Celebrations in Thrissur` (eyebrow), `Where family milestones` + line break + `feel truly special.` (display headline).
- Parking pattern `/40\s*(?:–|-|to)\s*50/g` renders only on the Facilities page (once) and the FAQ page (once).
- Capacity pattern `/250\s*(?:–|-|to)\s*300/g` renders at most once per page.
- No new facts. Rewording keeps meaning. Use the exact replacement copy in this plan.
- Hero image stays `/assets/venue/venue-006.jpg` in this PR. No colour or layout redesign; new elements reuse the class strings of the elements they replace.
- Do not edit `src/features/admin/**` or `src/components/admin/**`.
- Descriptor text comes from `VENUE_INFO.descriptor` (`'Hall & Events Venue'`).

## Review Focus

1. Orphan separators or uneven gaps left in the header strip (md+ widths) and footer bottom bar after removal. Expect a balanced row. Checked by screenshots in Task 4.
2. Hero on a 360 px phone: the new `<h1>` + eyebrow + headline must wrap cleanly without overflow or clipped text. Checked by a 360×740 screenshot in Task 4.
3. FAQ selection by id: a mistyped id would silently render fewer FAQs. Expect exactly four homepage FAQs. Test in Task 2.
4. The `/halls/auditorium` page still shows the capacity figure exactly once after removing the duplicate sentence. Test in Task 1's table.
5. Hero and CTA links keep their destinations (`/halls`, `/enquire`). Test in Task 3.

---

### Task 1: Content regression tests + header/footer fixes

**Files:**
- Create: `tests/contentCleanup.test.tsx`
- Modify: `src/components/public/PublicHeader.tsx:55-57` (strip span), `:103` (descriptor)
- Modify: `src/components/public/PublicFooter.tsx:21`, `:24-26`, `:111-113`, `:128-136`

**Interfaces:**
- Produces (test helpers inside the test file, reused by Tasks 2–3): `PARKING: RegExp`, `CAPACITY: RegExp`, `count(text: string, re: RegExp): number`, `renderText(ui: React.ReactElement, path?: string, routePath?: string): string`. `renderText` wraps the element in `MemoryRouter initialEntries={[path]}` + `Routes`/`Route path={routePath ?? path}` and returns `container.textContent ?? ''`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe('header and footer', () => {
  it('header top strip no longer shows the bus-route/parking phrase', () => {
    const text = renderText(<PublicHeader />);
    expect(text).not.toContain('On PWD Bus Route');
    expect(text).not.toContain('40–50 Compound Parking');
    expect(text).toContain('Nellikunnu Market Junction, Thrissur');
  });
  it('footer drops the solar/water phrase and repeated figures', () => {
    const text = renderText(<PublicFooter />);
    expect(text).not.toContain('Solar Hybrid Power');
    expect(text).not.toContain('Water Authority Tested Water');
    expect(count(text, PARKING)).toBe(0);
    expect(count(text, CAPACITY)).toBe(0);
    expect(text).toContain('Nellikunnu, Thrissur');
  });
  it('header and footer use the Hall & Events Venue descriptor', () => {
    for (const ui of [<PublicHeader />, <PublicFooter />]) {
      const text = renderText(ui);
      expect(text).toContain('Hall & Events Venue');
      expect(text).not.toContain('Auditorium & Events Venue');
    }
  });
});

// [name, element, path, routePath, parking (exact), capacity [min, max]]
const PAGES = [
  ['Home', <HomePage />, '/', '/', 0, [1, 1]],
  ['Halls', <HallsPage />, '/halls', '/halls', 0, [1, 1]],
  ['Stage Hall detail', <HallDetailPage />, '/halls/stage-hall', '/halls/:slug', 0, [0, 0]],
  ['Dining Hall detail', <HallDetailPage />, '/halls/dining-hall', '/halls/:slug', 0, [0, 0]],
  ['Full venue detail', <HallDetailPage />, '/halls/auditorium', '/halls/:slug', 0, [1, 1]],
  ['Facilities', <FacilitiesPage />, '/facilities', '/facilities', 1, [0, 0]],
  ['FAQ', <FAQPage />, '/faq', '/faq', 1, [1, 1]],
  ['Enquire', <EnquirePage />, '/enquire', '/enquire', 0, [1, 1]],
  ['Contact', <ContactPage />, '/contact', '/contact', 0, [0, 0]],
  ['Gallery', <GalleryPage />, '/gallery', '/gallery', 0, [0, 0]],
] as const;

describe.each(PAGES)('%s page repeated facts', (_n, ui, path, routePath, parking, [min, max]) => {
  it('shows the parking figure only where allowed', () => {
    expect(count(renderText(ui, path, routePath), PARKING)).toBe(parking);
  });
  it('shows the capacity figure at most once', () => {
    const c = count(renderText(ui, path, routePath), CAPACITY);
    expect(c).toBeGreaterThanOrEqual(min);
    expect(c).toBeLessThanOrEqual(max);
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run tests/contentCleanup.test.tsx`
Expected: FAIL on the header/footer phrase tests and on several page counts (e.g. Home parking 6+).

- [ ] **Step 3: Fix the header and footer**

- `PublicHeader.tsx`: delete the `hidden md:inline-flex` span containing `· On PWD Bus Route · 40–50 Compound Parking`. Replace the hard-coded `Auditorium & Events Venue` with `{VENUE_INFO.descriptor}`.
- `PublicFooter.tsx`:
  - Brand subtitle → `{VENUE_INFO.descriptor}`.
  - Description → `A welcoming celebration venue at Market Junction, Nellikunnu, Thrissur, with four connected halls under one roof.`
  - Reservations card paragraph → `We host only one event at a time. When you reserve Thekkanath Souparnika, your family gets private use of all four halls.`
  - Bottom bar right side → a single `<span className="text-[11px]">Nellikunnu, Thrissur</span>` (no separators).
  - Copyright line uses `{VENUE_INFO.descriptor}`.

- [ ] **Step 4: Run the header/footer tests and confirm they pass**

Run: `npx vitest run tests/contentCleanup.test.tsx -t "header and footer"`
Expected: PASS (3 tests). Page-count tests still fail; Tasks 2–3 fix them.

- [ ] **Step 5: Commit**

```bash
rtk git add tests/contentCleanup.test.tsx src/components/public/PublicHeader.tsx src/components/public/PublicFooter.tsx
rtk git commit -m "fix(content): remove bus-route/parking and solar/water phrases from header and footer"
```

---

### Task 2: Data and inner-page de-duplication

**Files:**
- Modify: `src/data/venueData.ts` (auditorium `description` + `features`, dining `description`, `on-site-parking` facility, `FAQS` ids, new `HOME_FAQ_IDS`)
- Modify: `src/features/public/HallsPage.tsx:228-230`, `src/features/public/HallDetailPage.tsx:61-63`, `src/features/public/FacilitiesPage.tsx:55`, `src/features/public/EnquirePage.tsx:455-460`, `src/components/public/PreferredCaterersCard.tsx:56`
- Test: `tests/contentCleanup.test.tsx`

**Interfaces:**
- Produces: `FAQS: { id: FaqId; question: string; answer: string }[]`; `type FaqId = 'capacity' | 'separate-halls' | 'air-conditioning' | 'parking' | 'availability' | 'rooftop' | 'soundproofing' | 'power-backup'` (ids in current array order); `HOME_FAQ_IDS: readonly FaqId[] = ['separate-halls', 'air-conditioning', 'availability', 'rooftop']`. Both exported from `src/data/venueData.ts`.

- [ ] **Step 1: Add the FAQ-id test**

```tsx
it('every homepage FAQ id resolves to exactly one FAQ', () => {
  const ids = FAQS.map((f) => f.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(HOME_FAQ_IDS.map((id) => FAQS.filter((f) => f.id === id).length)).toEqual([1, 1, 1, 1]);
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run tests/contentCleanup.test.tsx -t "FAQ id"`
Expected: FAIL (`HOME_FAQ_IDS` not exported).

- [ ] **Step 3: Apply the data and page edits (exact copy)**

- Auditorium `description`: delete the final sentence ` Comfortably accommodates 250 to 300 guests, up to 400.` Auditorium `features`: delete `'Dedicated on-site parking (40–50 cars)'`.
- Dining `description`: replace `Specially planned for traditional Kerala sadhya and buffet feasts, serving 250 to 300+ guests easily in batches.` with `Specially planned for traditional Kerala sadhya and buffet feasts, served easily in batches.`
- `on-site-parking`: `title: 'On-Site Compound Parking'`, `description: 'Dedicated parking directly inside the venue compound, with easy entry and exit right at Market Junction.'`, badge unchanged (`'40–50 Cars Inside'`).
- Add `id` to each FAQ and export `FaqId` and `HOME_FAQ_IDS` as specified above.
- HallsPage bottom paragraph → `Our hall can be booked for any number of guests, and no part of the venue is rented to another party during your event. Each hall has 100 seats arranged, and the air-conditioned First Floor Dining Hall seats 100 guests in one sitting, which keeps multi-batch traditional sadhyas and festive banquets running smoothly.`
- HallDetailPage: delete the `<span>` reading `Arranged for gatherings of 250 to 300 guests (accommodating up to 400 across all spaces).`
- FacilitiesPage intro → `From uninterrupted solar backup power to certified drinking water, we take care of the essentials so you and your guests can enjoy your day.`
- EnquirePage guest field: delete the non-error hint `<p>`; render the error `<p>` only when `errors.estimatedGuests` is set. Leave the label unchanged.
- PreferredCaterersCard chip `250–300+ in Batches` → `Multi-Batch Service`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/contentCleanup.test.tsx`
Expected: FAQ-id test PASS; all page rows PASS except Home (fixed in Task 3).

- [ ] **Step 5: Commit**

```bash
rtk git add src/data/venueData.ts src/features/public src/components/public/PreferredCaterersCard.tsx tests/contentCleanup.test.tsx
rtk git commit -m "fix(content): state parking and capacity once per page across inner pages"
```

---

### Task 3: Homepage hero copy and de-duplication

**Files:**
- Modify: `src/features/public/HomePage.tsx` (hero `:72-123`, sections 2–3 `:145-205`, facilities intro `:311`, location checklist `:459-462`, FAQ preview `:527`, `trustBadges` `:27-48`, imports)
- Test: `tests/contentCleanup.test.tsx`

**Interfaces:**
- Consumes: `FAQS`, `HOME_FAQ_IDS` from Task 2.

- [ ] **Step 1: Write the failing hero tests**

```tsx
describe('homepage hero', () => {
  it('uses the venue name as the h1 with the required hero lines', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Thekkanath Souparnika');
    expect(screen.getByText('Traditional & Contemporary Celebrations in Thrissur')).toBeInTheDocument();
    const body = document.body.textContent ?? '';
    expect(body).toContain('Where family milestones');
    expect(body).toContain('feel truly special.');
    expect(body).not.toContain('A Warm Family Venue in Thrissur');
  });
  it('keeps the hero actions', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /Explore the Halls/ })).toHaveAttribute('href', '/halls');
    expect(screen.getAllByRole('link', { name: /Check Date \/ Enquire/ })[0]).toHaveAttribute('href', '/enquire');
  });
  it('previews four FAQs without the capacity or parking questions', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.queryByText('What is the parking capacity?')).toBeNull();
    expect(screen.queryByText('How many guests can Thekkanath Souparnika accommodate?')).toBeNull();
    for (const id of HOME_FAQ_IDS) {
      expect(screen.getByText(FAQS.find((f) => f.id === id)!.question)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `npx vitest run tests/contentCleanup.test.tsx -t "homepage hero"`
Expected: FAIL (h1 is currently the headline).

- [ ] **Step 3: Edit the homepage**

- Hero order: `<h1>` `Thekkanath Souparnika` (serif, champagne `#e7cfaf`, `text-2xl sm:text-3xl lg:text-4xl`), then the eyebrow row with the new text, then the existing headline styles on a `<p>` with the same text and `<br />` / `<em>` structure.
- Hero paragraph → `Four connected halls—three fully air-conditioned—arranged for weddings, engagements, baptisms, and family celebrations. Includes 100-seat batch dining for traditional sadhya and easy ground-floor access for elders, at Market Junction, Nellikunnu.`
- Delete the hero "Key Venue Distinction Note" row (capacity, AC, parking).
- Replace sections 2 and 3 with one highlights strip using section 2's grid and tile classes, with these tiles (value / caption): `4 Halls` / `Stage, Welcome, Dining & Open`; `250–300 Guests` / `Comfortable size, up to 400`; `3 AC Halls` / `Stage, Welcome & Dining`; `One Event at a Time` / `All four halls reserved for you`. Delete `trustBadges` and any lucide imports left unused (`tsc` has `noUnusedLocals`).
- Facilities intro → `From uninterrupted solar backup power to certified drinking water, we take care of the essentials so your day runs smoothly.`
- Location checklist: delete the `On-site compound parking for 40 to 50 cars` item.
- FAQ preview: map over `HOME_FAQ_IDS`, looking each up in `FAQS`, instead of `FAQS.slice(0, 4)`.

- [ ] **Step 4: Run the whole test file and the suite**

Run: `npx vitest run`
Expected: PASS, all tests (49 existing + new).

- [ ] **Step 5: Commit**

```bash
rtk git add src/features/public/HomePage.tsx tests/contentCleanup.test.tsx
rtk git commit -m "feat(home): add venue name and new eyebrow to hero, merge repeated highlights"
```

---

### Task 4: Verify, document, open PR 1

**Files:**
- Add: `docs/superpowers/specs/2026-10-26-luxury-glass-refresh-design.md`, `docs/superpowers/plans/2026-10-26-content-cleanup.md`, `docs/superpowers/plans/2026-10-26-luxury-glass-refresh.md`

- [ ] **Step 1: Typecheck, test, build**

Run: `npm run typecheck && npx vitest run && npm run build`
Expected: no type errors, all tests pass, build succeeds.

- [ ] **Step 2: Visual check (one-off, Playwright MCP against `npm run dev`)**

Screenshot `/` at 360×740, 768×1024 and 1440×900 (top strip, hero, highlights strip, footer bottom bar), plus `/facilities` and `/halls` at 1440×900. Expected: no orphan `·`, balanced spacing, hero text not clipped, buttons visible. Save the images in the scratchpad (not the repo).

- [ ] **Step 3: Search for anything the render tests could miss**

Run: `rtk grep "On PWD Bus Route|Compound Parking|Water Authority Tested Water" src/components src/features/public`
Expected: no matches.

- [ ] **Step 4: Commit the docs**

```bash
rtk git add docs/superpowers/specs/2026-10-26-luxury-glass-refresh-design.md docs/superpowers/plans/2026-10-26-content-cleanup.md docs/superpowers/plans/2026-10-26-luxury-glass-refresh.md
rtk git commit -m "docs: design and plans for content cleanup and liquid-glass refresh"
```

- [ ] **Step 5: Push and open the PR**

Run: `rtk git push -u origin fix/content-cleanup`, then `gh pr create --base main --head fix/content-cleanup`. In the body, mark brief checklist items 1–4, 8 and 12 with evidence (test names, screenshot notes) and list the copy changes. Expected: PR URL printed. Do not merge.
