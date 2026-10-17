# Venue Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full auditorium two-session bookings, referral bonus tracking, preferred catering directory, transactional email notifications with PDF payment receipts, super admin staff access controls, chronological booking sorting, automated dual-account revenue load balancing under ₹20 Lakhs without GST, tax and quotation generation with caution/cleaning clauses, brand asset deployment, and an ultra-premium Burgundy & Rose Gold theme with liquid glass refraction, ambient particles, and mobile-first layouts.

**Architecture:** Client-side TypeScript domain engines in `src/lib/` for session availability, financial allocation, and referral lifecycles; centralized Supabase client state; client-side document and PDF/XLSX generation; responsive React components styled with bespoke CSS variables, Tailwind tokens, and Google Fonts (`Cormorant Garamond` and `Inter`).

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Date-fns, Vitest, Resend API / In-App Email Inspector.

**Spec:** [docs/superpowers/specs/2026-10-18-venue-enhancements-design.md](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/docs/superpowers/specs/2026-10-18-venue-enhancements-design.md)

---

## Global Constraints

- **Language & Runtime:** TypeScript 5.7+ targeting React 18 on Vite 6.
- **Styling Architecture:** Vanilla CSS design variables defined in `src/styles/theme.css` / `src/index.css` surfaced through `tailwind.config.js` utility classes.
- **Typography:** Headlines in `Cormorant Garamond` (weights 400, 600, 700); UI and data in `Inter` (weights 400, 500, 600) with `tabular-nums`.
- **Session Timings:** Morning Session is strictly `08:00`–`15:00`; Turnaround buffer is `15:00`–`17:00`; Evening Session is `17:00`–`22:00`; Full Day is `08:00`–`22:00`.
- **Turnover Threshold:** Dual-account ceiling is fixed at ₹20,00,000 (20 Lakhs) per account per Financial Year (April 1 to March 31); no GST calculation or tax rates.
- **Cleaning & Caution Obligation:** Every quotation must distinctly frame the Refundable Caution / Cleaning Deposit with the mandatory clause regarding client/catering cleanliness responsibility.
- **Accessibility & Motion:** Respect `@media (prefers-reduced-motion: reduce)` by disabling canvas particles and transitions; all body copy meets WCAG AA contrast against deep burgundy and warm ivory.
- **Mobile First:** Responsive layouts supporting viewports down to 360px with touch targets $\ge 44 \times 44\text{ px}$.

---

## Review Focus

1. **Session Overlap Conflict:** When an enquiry or booking reserves the Auditorium for a Morning or Evening session, an attempt to book any individual hall (or the entire auditorium) in that same session must be flagged as an active conflict.
   - *Test:* `tests/bookingEngine.test.ts` exercises session overlap cascading across all four constituent halls.
2. **Turnover Headroom Boundary:** When an incoming booking amount would push Account 1 over ₹20,00,000, the allocation engine must automatically divert the booking to Account 2 if Account 2 has sufficient headroom.
   - *Test:* `tests/financeEngine.test.ts` exercises boundary conditions at ₹19.5L and ₹20.0L.
3. **Repeat Referrer Autocomplete & Duplication:** Typing a partial phone number or email of an existing referrer must return their exact saved record without creating duplicate referrer identities.
   - *Test:* `tests/referralEngine.test.ts` exercises case-insensitive and phone lookup matching.
4. **Mandatory Cleanup Clause in Quotes:** Quotations generated without a separated caution deposit or missing the external catering cleanup liability statement must be rejected by the validation schema.
   - *Test:* `tests/documentGenerator.test.ts` exercises quotation schema validation.
5. **Reduced-Motion Particle Suspension:** When `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true, the ambient particle canvas must not start the `requestAnimationFrame` render loop.
   - *Test:* `tests/ambientParticles.test.ts` exercises reduced-motion branch execution.

---

## Task Decomposition

### Task 1: Brand Assets Deployment & Visual Design Tokens
**Files:**
- Create: `public/assets/brand/` (directory containing copied lotus logos)
- Create: `src/styles/theme.css`
- Modify: `index.html`
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Test: `tests/theme.test.ts`

**Interfaces:**
- Produces: CSS variables `--color-wine`, `--color-burgundy`, `--color-plum`, `--color-rose-gold`, `--color-champagne`, `--color-ivory`, and Tailwind utility classes `bg-wine-900`, `text-gold-400`, `font-serif`, `font-sans`.

- [ ] **Step 1: Write the failing test for theme tokens and fonts**
  Create `tests/theme.test.ts` asserting that CSS custom properties for `--color-burgundy` (`#5B1D27`), `--color-rose-gold` (`#E5A99B`), and `--color-champagne` (`#D4AF37`) are defined in the design stylesheet.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/theme.test.ts`
  Expected: FAIL (missing theme.css or tokens)
- [ ] **Step 3: Deploy brand assets, update index.html, and configure theme tokens**
  - Copy `assests/logo/` files into `public/assets/brand/`.
  - Update `index.html` with Google Fonts preconnect for `Cormorant Garamond` and `Inter`, and set the page title to "Thekkanath Souparnika | Hall & Events Venue".
  - Define CSS variables in `src/styles/theme.css` and import into `src/index.css`.
  - Update `tailwind.config.js` to extend colors (`wine`, `burgundy`, `plum`, `rose`, `gold`, `ivory`) and fontFamily (`serif: ['Cormorant Garamond', 'serif']`, `sans: ['Inter', 'sans-serif']`).
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/theme.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add public/assets/brand index.html src/styles/theme.css src/index.css tailwind.config.js tests/theme.test.ts
  git commit -m "feat: setup burgundy and rose gold theme, fonts, and brand assets"
  ```

---

### Task 2: Auditorium Two-Session Booking & Cascading Conflict Engine
**Files:**
- Modify: `src/types/models.ts`
- Modify: `src/lib/bookingEngine.ts`
- Modify: `src/data/venueData.ts`
- Test: `tests/bookingEngine.test.ts`

**Interfaces:**
- Produces: `BookingSession = 'morning' | 'evening' | 'full_day'`; `SESSION_TIMES: Record<BookingSession, { startTime: string; endTime: string }>`.
- Produces: `checkAuditoriumAvailability(date: string, session: BookingSession, existingBookings: Booking[], existingMaintenance: MaintenanceBlock[]): ConflictCheckResult`.

- [ ] **Step 1: Write the failing test for auditorium session conflicts**
  In `tests/bookingEngine.test.ts`, add test cases:
  - Reserving the auditorium for `'morning'` (`08:00`–`15:00`) blocks an attempt to book `stage-hall` at `10:00`–`13:00`.
  - An event in the Morning session touches the buffer (`15:00`) but does NOT conflict with an Evening session starting at `17:00`.
  - Full Day booking blocks both Morning and Evening sessions across all halls.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/bookingEngine.test.ts`
  Expected: FAIL (`checkAuditoriumAvailability` not defined or session types missing)
- [ ] **Step 3: Implement auditorium session models and conflict cascading**
  - In `src/types/models.ts`, add `session?: 'morning' | 'evening' | 'full_day'` to `Enquiry` and `Booking`.
  - In `src/lib/bookingEngine.ts`, export `SESSION_TIMES` mapping `morning` (08:00–15:00), `evening` (17:00–22:00), and `full_day` (08:00–22:00).
  - Implement `checkAuditoriumAvailability` which validates against both whole-auditorium bookings and any individual hall booking on that date and session time range.
  - In `src/data/venueData.ts`, add an `auditorium` virtual venue entity representing the entire 4-hall facility.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/bookingEngine.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/types/models.ts src/lib/bookingEngine.ts src/data/venueData.ts tests/bookingEngine.test.ts
  git commit -m "feat: implement auditorium two-session booking engine and conflict cascading"
  ```

---

### Task 3: Dual-Account Financial Turnover Load Balancing Engine
**Files:**
- Create: `src/lib/financeEngine.ts`
- Modify: `src/types/models.ts`
- Test: `tests/financeEngine.test.ts`

**Interfaces:**
- Produces: `FinancialAccount = 'account_1' | 'account_2'`.
- Produces: `allocateBookingAccount(amountPaise: number, currentTurnoverAccount1Paise: number, currentTurnoverAccount2Paise: number, ceilingPaise?: number): FinancialAccount`.
- Produces: `calculateHeadroom(turnoverPaise: number, ceilingPaise?: number): { remainingPaise: number; percentageUsed: number; isWarning: boolean; isCapped: boolean }`.

- [ ] **Step 1: Write the failing test for dual-account balancing**
  Create `tests/financeEngine.test.ts`:
  - When Account 1 has ₹10L and Account 2 has ₹5L, a ₹2L booking routes to Account 2 (lower turnover).
  - When Account 1 has ₹19L and Account 2 has ₹12L, a ₹1.5L booking routes to Account 2 (Account 1 would exceed ₹20L ceiling).
  - Warning flag triggers at 90% utilization (₹18L).
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/financeEngine.test.ts`
  Expected: FAIL (`allocateBookingAccount` not found)
- [ ] **Step 3: Implement financeEngine.ts and update models**
  - In `src/types/models.ts`, add `allocatedAccount?: 'account_1' | 'account_2'` to `Booking` and `PaymentReceipt`.
  - In `src/lib/financeEngine.ts`, implement the headroom calculation and smart allocation logic with the ₹20,00,000 threshold.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/financeEngine.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/types/models.ts src/lib/financeEngine.ts tests/financeEngine.test.ts
  git commit -m "feat: implement dual-account 20-lakh load balancing engine"
  ```

---

### Task 4: Lead Referral Bonus Lifecycle & Autocomplete Engine
**Files:**
- Create: `src/lib/referralEngine.ts`
- Modify: `src/types/models.ts`
- Test: `tests/referralEngine.test.ts`

**Interfaces:**
- Produces: `ReferralStatus = 'registered' | 'earned' | 'payable' | 'disbursed' | 'voided'`.
- Produces: `ReferralRecord`, `ReferrerContact`.
- Produces: `calculateReferralBonus(scheme: 'flat' | 'percentage', baseRentPaise: number, flatAmountPaise?: number, percentageRate?: number): number`.
- Produces: `searchReferrers(query: string, existingReferrers: ReferrerContact[]): ReferrerContact[]`.

- [ ] **Step 1: Write the failing test for referral calculations and search**
  Create `tests/referralEngine.test.ts`:
  - Flat calculation returns exact rupee amount.
  - Percentage calculation yields exact percentage of base rent (e.g. 5% of ₹50,000 = ₹2,500).
  - `searchReferrers` autocompletes by partial phone number (`9446`), name (`Rahul`), or email.
  - State machine correctly advances `registered` -> `earned` -> `payable` -> `disbursed`.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/referralEngine.test.ts`
  Expected: FAIL (`referralEngine.ts` not found)
- [ ] **Step 3: Implement referralEngine.ts and data structures**
  - In `src/types/models.ts`, add `ReferralRecord` with fields (`id`, `bookingId`, `referrerName`, `referrerPhone`, `referrerEmail`, `upiId`, `scheme`, `bonusPaise`, `status`, `paidAt`, `transactionRef`).
  - In `src/lib/referralEngine.ts`, implement bonus math, state transition guards, and lookup search with debounce support.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/referralEngine.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/types/models.ts src/lib/referralEngine.ts tests/referralEngine.test.ts
  git commit -m "feat: implement referral bonus lifecycle and autocomplete engine"
  ```

---

### Task 5: Transactional Email Service & In-App Activity Drawer
**Files:**
- Create: `src/lib/emailService.ts`
- Create: `src/components/admin/EmailActivityDrawer.tsx`
- Modify: `src/types/models.ts`
- Test: `tests/emailService.test.ts`

**Interfaces:**
- Produces: `EmailLogEntry = { id: string; to: string; subject: string; template: 'enquiry_ack' | 'booking_confirmed'; htmlBody: string; status: 'sent' | 'simulated' | 'failed'; sentAt: string }`.
- Produces: `sendEnquiryAcknowledgmentEmail(enquiry: Enquiry): Promise<EmailLogEntry>`.
- Produces: `sendBookingConfirmedEmail(booking: Booking, receipt?: PaymentReceipt): Promise<EmailLogEntry>`.

- [ ] **Step 1: Write the failing test for email template generation**
  Create `tests/emailService.test.ts`:
  - Enquiry acknowledgment HTML contains Enquiry Reference, chosen session, and Thekkanath Souparnika address.
  - Booking confirmation HTML contains Booking Reference, payment summary, and banking details.
  - In local environment without API key, service safely falls back to status `'simulated'` and logs entry.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/emailService.test.ts`
  Expected: FAIL (`emailService.ts` not found)
- [ ] **Step 3: Implement emailService.ts and EmailActivityDrawer component**
  - Implement HTML email builders with Burgundy header (`#5B1D27`), Rose Gold accents, and responsive table styling.
  - Implement Resend API fetcher with automatic offline fallback to local in-memory log.
  - Build `EmailActivityDrawer.tsx` in `src/components/admin/` with preview modal and resend action.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/emailService.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/lib/emailService.ts src/components/admin/EmailActivityDrawer.tsx tests/emailService.test.ts
  git commit -m "feat: implement transactional email service with in-app activity drawer"
  ```

---

### Task 6: Tax Filing Document Generator & Quotation PDF Suite
**Files:**
- Create: `src/lib/documentGenerator.ts`
- Modify: `src/types/models.ts`
- Test: `tests/documentGenerator.test.ts`

**Interfaces:**
- Produces: `generateTaxFilingReport(financialYear: string, bookings: Booking[], expenses: ExpenseRecord[]): { csvReceipts: string; csvExpenses: string; summaryHtml: string }`.
- Produces: `generateQuotationDocument(quote: Quotation, cautionDepositPaise: number): { html: string; validationErrors: string[] }`.

- [ ] **Step 1: Write the failing test for tax exports and quotation clauses**
  Create `tests/documentGenerator.test.ts`:
  - Tax export groups receipts cleanly by `Account 1` and `Account 2` without GST tax columns.
  - Quotation generation enforces the separate caution deposit line item and includes the mandatory cleaning liability clause.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/documentGenerator.test.ts`
  Expected: FAIL (`documentGenerator.ts` not found)
- [ ] **Step 3: Implement documentGenerator.ts**
  - Implement CSV/Excel export string builders formatted for Chartered Accountants.
  - Implement HTML/PDF print template for Quotations featuring the Seven-Petal Lotus logo, Cormorant Garamond typography, itemized hire, separate caution deposit line, and cleanup liability terms.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/documentGenerator.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/lib/documentGenerator.ts tests/documentGenerator.test.ts
  git commit -m "feat: implement no-gst tax document generator and quotation pdf suite"
  ```

---

### Task 7: Public UI Luxury Transformation & Mobile Responsiveness
**Files:**
- Create: `src/components/public/AmbientParticles.tsx`
- Create: `src/components/public/PreferredCaterersCard.tsx`
- Modify: `src/features/public/EnquirePage.tsx`
- Modify: `src/components/public/PublicHeader.tsx`
- Modify: `src/components/public/PublicFooter.tsx`
- Modify: `src/components/public/PublicLayout.tsx`
- Test: `tests/ambientParticles.test.ts`

**Interfaces:**
- Produces: `<AmbientParticles />` rendering lightweight canvas bokeh.
- Produces: `<PreferredCaterersCard />` showing vetted catering partners with cuisine tags and direct WhatsApp action.

- [ ] **Step 1: Write the failing test for ambient particles reduced motion**
  Create `tests/ambientParticles.test.ts` testing that when `prefers-reduced-motion` is matched, the canvas render loop does not initiate animation frames.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/ambientParticles.test.ts`
  Expected: FAIL (`AmbientParticles.tsx` not found)
- [ ] **Step 3: Build AmbientParticles and update Public UI components**
  - Implement `AmbientParticles.tsx` using 2D canvas with 25 champagne gold floating bokeh orbs and motion-reduction guard.
  - Build `PreferredCaterersCard.tsx` showcasing partners (Kerala Sadhya, Buffet, High Tea) with direct WhatsApp links.
  - Update `EnquirePage.tsx` with Morning/Evening session selector cards, referral toggle, and catering partners.
  - Update `PublicHeader.tsx` and `PublicFooter.tsx` with the Seven-Petal Lotus crest, Cormorant Garamond headings, and mobile bottom navigation dock.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/ambientParticles.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/components/public/AmbientParticles.tsx src/components/public/PreferredCaterersCard.tsx src/features/public/EnquirePage.tsx src/components/public/PublicHeader.tsx src/components/public/PublicFooter.tsx src/components/public/PublicLayout.tsx tests/ambientParticles.test.ts
  git commit -m "feat: luxury public UI transformation with ambient particles and mobile dock"
  ```

---

### Task 8: Admin Console Workflows (Staff Management, Sorting, Referrals, Finance Dials)
**Files:**
- Modify: `src/features/admin/BookingsPage.tsx`
- Modify: `src/features/admin/StaffPage.tsx`
- Modify: `src/features/admin/FinancePage.tsx`
- Modify: `src/features/admin/MarketingPage.tsx`
- Modify: `src/features/admin/VendorsPage.tsx`
- Test: `tests/adminWorkflows.test.ts`

**Interfaces:**
- BookingsPage: Default sort by upcoming `eventDate` ascending with toggle controls.
- StaffPage: Restricted to `super_admin` role for creating, changing roles, and removing staff.
- FinancePage: Real-time dual-account progress dials (Account 1 & Account 2) with 90% alert and tax export buttons.
- MarketingPage: Dedicated Referrals & Commissions tab with payout action.

- [ ] **Step 1: Write the failing test for admin sorting and role gates**
  Create `tests/adminWorkflows.test.ts` asserting:
  - Default booking sort places closest upcoming event first.
  - Non-super-admin users cannot access staff role modification actions.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/adminWorkflows.test.ts`
  Expected: FAIL (missing sort functions or role guard logic)
- [ ] **Step 3: Update admin pages with requested workflows**
  - In `BookingsPage.tsx`, implement default chronological `eventDate` sorting and session badges.
  - In `StaffPage.tsx`, implement Super Admin access guard, Add Staff modal, role editor, and deactivation prompt.
  - In `FinancePage.tsx`, render dual-account capacity gauges and one-click XLS/PDF tax download buttons.
  - In `MarketingPage.tsx`, add Referrals management view with bonus disbursement modal.
  - In `VendorsPage.tsx`, add "Preferred Caterer" toggle and cuisine tags.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/adminWorkflows.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/features/admin/BookingsPage.tsx src/features/admin/StaffPage.tsx src/features/admin/FinancePage.tsx src/features/admin/MarketingPage.tsx src/features/admin/VendorsPage.tsx tests/adminWorkflows.test.ts
  git commit -m "feat: add staff access controls, booking sorting, referrals and dual-account finance dials"
  ```

---

### Task 9: Full Build Validation, Typecheck & Verification
**Files:**
- Test: All tests in `tests/`
- Command: `npm run typecheck`
- Command: `npm run build`

- [ ] **Step 1: Run comprehensive test suite**
  Run: `npm test`
  Expected: All unit and integration tests PASS.
- [ ] **Step 2: Run TypeScript typecheck**
  Run: `npm run typecheck`
  Expected: Clean type check with zero errors.
- [ ] **Step 3: Run production build**
  Run: `npm run build`
  Expected: Vite build completes successfully creating `dist/`.
- [ ] **Step 4: Commit**
  ```bash
  git add .
  git commit -m "chore: verify test suite, types, and production bundle"
  ```
