# Design Specification: Thekkanath Souparnika Venue Enhancements

**Date:** 2026-10-18  
**Topic:** Auditorium Two-Session Booking, Referral Bonus Engine, Dual-Account Financial Balancing, Tax & Quotation Generation, Luxury Burgundy & Rose Gold Design System  
**Status:** Approved for Implementation Planning  
**Target Repository:** `thekkanath-souparnika-webapp`

---

## 1. Intent and the "Why"

Thekkanath Souparnika is an upscale celebration and event venue in Nellikunnu, Thrissur. As the venue scales operations and strengthens its brand position, management requires a cohesive upgrade that addresses:
1. **Operational Venue Utilization:** Transitioning from fragmented single-hall bookings to whole-auditorium bookings operated on two predictable daily sessions (Morning and Evening) with a structured turnaround window.
2. **Growth & Referral Incentives:** Motivating local event planners, community members, and past clients to bring in leads via a transparent referral bonus tracking and disbursement workflow.
3. **Client Convenience & Trust:** Providing vetted, preferred catering contacts during enquiry and booking, followed by automated transactional email notifications and receipts.
4. **Governance & Access Control:** Restricting administrative operations, user deactivations, and role modifications exclusively to the Super Admin.
5. **Tax & Financial Compliance (No GST):** Maintaining eligibility for the ₹20 Lakh service turnover threshold by intelligently balancing booking revenue across two distinct financial accounts, and generating Chartered Accountant-ready tax filing documents and itemized quotations.
6. **Luxury Brand Elevation:** Elevating the digital experience to match a premier banquet hall through a bespoke **Burgundy & Rose Gold** design system, Cormorant Garamond typography, Liquid Glass UI, subtle ambient particles, and mobile-first responsiveness.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Full Auditorium Booking Model:** Book the entire venue across two fixed daily sessions: **Morning (8:00 AM – 3:00 PM)** and **Evening (5:00 PM – 10:00 PM)**, with an automatic 2-hour housekeeping and sanitation buffer between sessions.
- **Unified Conflict Engine:** Reserving a session automatically blocks all 4 halls (Stage Hall, Welcome Hall, Dining Hall, Open Hall) for that duration.
- **Referral Bonus Lifecycle:** Support both flat rewards (e.g. ₹2,500/₹5,000) and percentage of base rent (e.g. 3–5%), autocompleting repeat referrers (Name, Email, Phone), and tracking payouts across *Registered → Earned → Payable → Disbursed*.
- **Preferred Catering Directory:** Display trusted caterers with cuisine specialties and direct WhatsApp/phone contacts on public enquiry and booking flows, managed via the admin console.
- **Transactional Emails & Receipts:** Automated, elegantly styled emails for enquiry acknowledgments and confirmed bookings with PDF payment receipts (powered by Resend with an in-app inspection drawer).
- **Super Admin Staff Control:** Dedicated panel for Super Admins to invite staff, assign roles (`super_admin`, `booking_manager`, `operations_manager`, `accounts`, `staff`), and revoke access.
- **Booking Sorting:** Default chronological sorting by upcoming `eventDate` ascending, with fast toggles for creation date, reference, and customer name.
- **Dual-Account Financial Routing (Under ₹20 Lakhs):** Smart allocation algorithm that assigns each booking to Account 1 or Account 2 based on remaining financial year headroom, ensuring neither account exceeds ₹20 Lakhs.
- **Tax Filing Exports (No GST):** Downloadable gross receipts ledgers, expense registers, and annual net income summaries in formatted Excel (`.xlsx`) and PDF formats for Chartered Accountant filing.
- **Quotation Generator:** Branded PDF quotations with an explicit, separate clause and line item for **Refundable Caution Deposit / Cleaning Deposit** (covering customer or catering cleanup obligations), sendable directly via email.
- **Luxury Aesthetic & Performance:** Burgundy & Rose Gold color palette, Cormorant Garamond + Inter typography, Liquid Glass UI, ambient particle veil, `prefers-reduced-motion` compliance, and mobile-first responsiveness.

### Non-Goals
- **GST Calculations & Invoicing:** Tax filing documents and quotes intentionally omit GST calculations, tax rates, and GSTIN registration fields because both entities operate under the statutory ₹20 Lakh exemption threshold.
- **Split Invoicing on a Single Booking:** Bookings are assigned as a single whole to the account with headroom, rather than splitting one booking into two separate half-invoices.
- **Automated Payment Gateway:** Online card/UPI checkout is out of scope; bookings are confirmed via bank transfer/UPI UTR reference verification by management.

### Anti-Goals
- No sluggish canvas/WebGL performance or high battery drain on mobile devices.
- No cluttered booking forms that overwhelm clients with complicated hall configurations.
- No accidental overflow of an account beyond ₹20 Lakhs annual turnover.

---

## 3. Technical Constraints & Architecture

- **Framework:** React 18 with Vite and TypeScript.
- **Styling:** Vanilla CSS design tokens combined with Tailwind CSS utility classes.
- **Icons & Visuals:** `lucide-react` for iconography; HTML5 2D Canvas for lightweight ambient particles.
- **Typography:** Google Fonts: `Cormorant Garamond` (display/headings, weights 400, 600, 700) and `Inter` (body, forms, tables, weights 400, 500, 600).
- **Backend / Database:** Supabase (`@supabase/supabase-js`) with client-side reactive state management and fallback offline seed data.
- **Documents & Exports:** Clean client-side PDF generation (HTML-to-Canvas / styled print-ready templates) and SheetJS/CSV-based formatted Excel (`.xlsx`) generation.
- **Email Service:** Resend API integration with an in-app interactive Email Preview Drawer for testing.

---

## 4. Detailed Feature Specifications

### 4.1. Entire Auditorium Booking & Two Sessions Engine
- **Session Timings:**
  - **Morning Session:** 08:00 to 15:00 (8:00 AM to 3:00 PM).
  - **Turnaround Buffer:** 15:00 to 17:00 (Housekeeping, floor sanitization, waste clearing, catering reset).
  - **Evening Session:** 17:00 to 22:00 (5:00 PM to 10:00 PM).
  - **Full Day:** 08:00 to 22:00 (Includes both sessions and intervening buffer).
- **Availability & Conflict Detection:**
  - When the Auditorium is booked for a session, all constituent halls (`stage-hall`, `welcome-hall`, `dining-hall`, `open-hall`) are automatically marked as occupied for that window.
  - The booking engine updates `checkHallAvailability` to evaluate session-level overlaps rather than arbitrary open-ended hours.
- **Public UI:**
  - On `/enquire` and booking modals, replace open start/end time pickers with intuitive session cards:
    - `[Morning Session · 8 AM - 3 PM]`
    - `[Evening Session · 5 PM - 10 PM]`
    - `[Full Day · 8 AM - 10 PM]`
  - Real-time indicator displaying *"Available"* or *"Booked"* for each session upon date selection.
- **Admin Calendar:**
  - Daily calendar views render two horizontal bars per day representing Morning and Evening sessions for instantaneous visual capacity audits.

### 4.2. Referral Bonus for Lead Generation
- **Referrer Profile:**
  - `referrerName`: string
  - `referrerEmail`: string
  - `referrerPhone`: string
  - `upiId`: optional string
  - `notes`: optional string
- **Calculation Schemes:**
  - **Flat Incentive:** Fixed rupee amount (e.g. ₹2,500 for single session, ₹5,000 for full day).
  - **Percentage Incentive:** Percentage of base auditorium hire (e.g. 3%–5%).
  - Configurable in Admin Settings with a per-booking manual override.
- **Attribution Touchpoints:**
  - *Public Form:* Optional toggle *"Referred by a friend or planner?"* with auto-search or new entry.
  - *Shareable Link:* `thekkanath.com/enquire?ref=<PHONE_OR_CODE>`.
  - *Admin Drawer:* Autocomplete search input by name, phone, or email when entering walk-in/phone leads.
- **Lifecycle States:**
  1. `registered`: Lead created with referrer attached.
  2. `earned`: Booking confirmed and advance deposit cleared.
  3. `payable`: Event date completed and final balance collected.
  4. `disbursed`: Management records payment reference (UPI/NEFT) and marks settled.
- **Console Interface:**
  - Sub-tab under Management Console: **Referrals & Commissions**.
  - Shows Total Referrers, Active Referrals, Total Commission Paid, and Pending Payouts.
  - "Disburse Bonus" action opens a settlement modal recording transaction ID and notes.

### 4.3. Preferred Catering Service Providers
- **Public Display:**
  - Section displayed during enquiry and booking: *"Preferred Catering Partners"*.
  - Displays caterer name, logo/avatar, cuisine specialties (e.g., *Traditional Kerala Sadhya*, *North Indian & Continental Buffet*, *Live Counters & High Tea*), contact person, phone number, and a direct *"WhatsApp Caterer"* action.
- **Admin Management:**
  - Under Admin > Vendors, add a toggle `isPreferredCaterer: boolean` and `cuisineSpecialties: string[]`.
  - Ability to reorder preferred caterers and manage contact numbers directly.

### 4.4. Automated Email Notifications & Payment Receipts
- **Architecture:**
  - Client-side or edge service connecting to Resend API (`RESEND_API_KEY`).
  - Interactive **Email Activity Log** drawer in Admin Console to inspect, view HTML previews, and resend messages.
- **Templates:**
  1. **Enquiry Acknowledgment:**
     - Header: Burgundy banner with gold Thekkanath Souparnika crest.
     - Body: Thank you message, Enquiry Reference (e.g. `TS-ENQ-2026-104`), Selected Date & Session, Estimated Guests, Manager Contact, and Preferred Caterer contact sheet.
  2. **Booking Confirmation with Payment Receipt:**
     - Header: Luxury booking confirmation badge.
     - Body: Booking Reference (e.g. `TS-BKG-2026-042`), Event Date, Session Timings, Venue Access Instructions, Financial Summary (Agreed Amount, Advance Paid, Balance Due, Due Date), Bank/UPI payment details.
     - Downloadable/Printable PDF Payment Receipt with serial reference, seal, and authorization.

### 4.5. Super Admin Staff Management
- **Permissions Gate:**
  - Only users with `role === 'super_admin'` can view and manage staff accounts.
  - Other roles (`administrator`, `booking_manager`, etc.) see a read-only or restricted view.
- **Operations:**
  - **Add Staff:** Name, Email, Phone, Role assignment (`super_admin`, `booking_manager`, `operations_manager`, `accounts`, `staff`).
  - **Edit Role:** Change permissions dynamically.
  - **Deactivate / Remove:** Terminate access with confirmation prompt.
  - **Audit Logging:** Every role change or staff removal is logged into the `audit_logs` table.

### 4.6. Booking Management Sorting
- **Default Behavior:**
  - Sort bookings chronologically by `eventDate` in **ascending order** (next upcoming event at the top).
- **Sort Options:**
  - Event Date (Closest First / Furthest First)
  - Date Created (Newest First / Oldest First)
  - Customer Name (A–Z / Z–A)
  - Total Booking Amount (High to Low / Low to High)
  - Status (Active holds / Confirmed first)
- **UI:** A sleek sort dropdown with quick-toggle arrow next to the search and filter controls.

### 4.7. Dual-Account Financial Load Balancing (Turnover Under ₹20 Lakhs)
- **Entities / Accounts:**
  - **Account 1** (e.g. *Thekkanath Events / Account A*)
  - **Account 2** (e.g. *Souparnika Celebrations / Account B*)
- **Turnover Threshold & Financial Year:**
  - Ceiling: ₹20,00,000 (20 Lakhs) per account per Financial Year (April 1 to March 31).
  - Headroom: `Headroom = ₹20,00,000 - FYTurnover`.
- **Automatic Allocation Algorithm:**
  ```typescript
  function allocateBookingAccount(
    bookingAmount: number,
    account1Turnover: number,
    account2Turnover: number,
    ceiling = 2000000
  ): 'Account 1' | 'Account 2' {
    const headroom1 = Math.max(0, ceiling - account1Turnover);
    const headroom2 = Math.max(0, ceiling - account2Turnover);

    const canFit1 = bookingAmount <= headroom1;
    const canFit2 = bookingAmount <= headroom2;

    if (canFit1 && !canFit2) return 'Account 1';
    if (!canFit1 && canFit2) return 'Account 2';
    if (canFit1 && canFit2) {
      // Load balance: pick the account with lower current turnover
      return account1Turnover <= account2Turnover ? 'Account 1' : 'Account 2';
    }
    // Spillover fallback: pick the account with largest remaining headroom
    return headroom1 >= headroom2 ? 'Account 1' : 'Account 2';
  }
  ```
- **Console Monitoring:**
  - Dual gauge / progress bars in Admin > Finance:
    - `Account 1: ₹13,40,000 / ₹20,00,000 [67%]`
    - `Account 2: ₹9,80,000 / ₹20,00,000 [49%]`
  - Yellow warning alert when an account reaches 90% (₹18 Lakhs); Red lock alert if reaching 98%.
  - Manual override toggle for Super Admin / Accounts manager.

### 4.8. Tax Filing Document Generation (No GST, XLS & PDF)
- **Context:** Neither entity is registered for GST; documentation is designed for annual Income Tax Returns (ITR) and CA audit under ₹20 Lakh exemption.
- **Exported Records:**
  1. **Gross Receipts Register:** Date, Booking Ref, Customer Name, Event Date, Session, Total Received, Mode (Bank/UPI/Cash), Transaction ID/UTR, Assigned Account.
  2. **Operating Expense Register:** Date, Category, Vendor, Amount, Voucher No.
  3. **Reconciliation & Turnover Summary:** Total receipts per account, verified under the ₹20L threshold.
- **Formats:**
  - Multi-tab Excel file (`Thekkanath_Tax_Summary_FY2026-27.xlsx`).
  - Printable, signed audit-ready PDF report.

### 4.9. Client Quotation Generation (PDF & Email)
- **Structure:**
  - Formal venue header, quotation number, issue date, validity window (7 days).
  - Client & Event details: Event type, session (Morning / Evening / Full Day), date, guest count.
  - **Itemized Pricing Breakdown:**
    - Auditorium Session Hire (Base hire charge).
    - Optional lighting / AV add-ons.
    - **Separate Line Item:** *Refundable Caution Deposit / Cleaning Deposit*.
- **Mandatory Cleaning & Caution Clause:**
  - Distinctly framed clause: *"Refundable Caution Deposit of ₹X,XXX is collected to guarantee venue integrity. Please note: The customer and their external catering team are responsible for leaving the dining hall, kitchen area, and wash facilities clean and free of leftover food waste. If the facility requires deep sanitization or waste removal due to catering negligence, professional cleaning expenses will be deducted from this deposit prior to refund."*
- **Payment & Bank Transfer Details:**
  - Advance deposit required.
  - Designated bank account and UPI QR matching the assigned Account 1 or Account 2.
- **Actions:**
  - One-click "Download PDF" (high-resolution print styling).
  - One-click "Send via Email to Client" (attaches quote and sends via Resend).

### 4.10. Luxury Burgundy & Rose Gold Visual Design System
- **Color Palette Tokens:**
  - Primary Wine / Burgundy: `#4A0E17` (Deep Wine), `#6B1D2F` (Rich Burgundy), `#8B263E` (Crimson Rose)
  - Deep Plum Canvas: `#1A0510` (Dark background), `#2A081B` (Plum surface)
  - Rose Blush Accents: `#C47A88` (Muted Rose), `#F2D6DC` (Soft Blush), `#FBF2F4` (Blush highlight)
  - Warm Ivory & Cream: `#FDFBF7` (Ivory canvas), `#F5EFEB` (Warm cream)
  - Rose Gold & Antique Champagne: `#D4AF37` (Champagne Gold), `#E5A99B` (Rose Gold), `#8C6D37` (Antique Bronze)
- **Liquid Glass UI & Refraction Effects:**
  - Translucent glass panels with `backdrop-filter: blur(16px) saturate(180%)`.
  - Multi-layered borders with subtle linear gradient angles mimicking optical refraction (`border: 1px solid rgba(229, 169, 155, 0.25)`).
  - Specular highlight gradients on card hover.
- **Ambient Particle System:**
  - Lightweight HTML5 Canvas overlay rendering 25–40 floating champagne gold bokeh particles with subtle drift and pulse.
  - CPU/GPU optimized: Automatically disabled when `prefers-reduced-motion: reduce` is detected or on mobile screens (<640px).
  - Automatically paused via `IntersectionObserver` when the hero section scrolls out of view.

### 4.11. Typography System
- **Display & Headings:** `Cormorant Garamond`
  - Used for `h1`, `h2`, `h3`, hero titles, section titles, and modal headers.
  - Elegant serif with high contrast, generous letter-spacing, and regal Kerala banquet poise.
- **Body, UI & Data:** `Inter`
  - Used for body paragraphs, forms, session chips, data tables, and badges.
  - Tabular numbers enabled (`font-variant-numeric: tabular-nums`) for currency figures and time slots.

### 4.12. Performance & Accessibility Guardrails
- **Reduced Motion:** Full `@media (prefers-reduced-motion: reduce)` support instantly substituting CSS animations and particle scripts with static luxury gradients.
- **Color Contrast:** All body text meets WCAG AA standards (4.5:1 ratio for normal text, 3:1 for large display titles) against dark plum and warm ivory surfaces.

### 4.13. Mobile-Ready Responsive Experience
- Responsive breakpoints tailored for mobile (`360px–640px`), tablet (`641px–1024px`), and desktop (`>1024px`).
- Mobile bottom navigation bar for quick access to *Venue, Sessions, Enquire, Call, WhatsApp*.
- Touch-friendly tap targets ($\ge 44 \times 44\text{ px}$) on session selection chips.
- Responsive horizontal swipe for caterer cards and calendar schedules on small viewports.

### 4.14. Brand Assets & Adaptive Visual Styling
The official Seven-Petal Lotus Emblem from the `assests/` directory serves as the core symbol of Thekkanath Souparnika, with full creative freedom to tune colors, gradients, and typography for optimal visual harmony with the website's luxury theme:

- **Seven-Petal Lotus Emblem Harmonization:**
  - The seven-petal geometry is rendered as both high-resolution PNGs and dynamic SVG/CSS-masked vector assets.
  - Colors are dynamically styled across components:
    - **Rose Gold & Champagne Foil Gradient:** For hero crests, luxury navigation badge, and public highlights (`background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #E5A99B 100%)`).
    - **Deep Wine / Burgundy (`#4A0E17`, `#5B1D27`):** For printable documents, quotation PDFs, and light-theme receipts.
    - **Warm Ivory (`#FDFBF7`):** For dark plum cards, liquid glass surfaces, and dark admin layouts.
- **Curated Luxury Typography Pairing:**
  - **Headings & Display (`font-serif`):** `Cormorant Garamond` — an opulent, high-contrast serif with graceful serifs and regal proportion, evoking traditional Kerala heritage paired with high-fashion banquet grandeur.
  - **Overlines & Accents:** Widely tracked uppercase (`letter-spacing: 0.25em` to `0.35em`) with Champagne Gold highlights.
  - **Body, UI & Tables (`font-sans`):** `Inter` — engineered for pristine readability, responsive forms, and tabular numerals (`tabular-nums`) across booking prices, time slots, and financial balances.
- **Verified Venue Details (Incorporated from Business Card):**
  - **Owner:** Ferdinant Nallengara (`OWNER | THEKKANATH SOUPARNIKA`)
  - **Primary Mobile:** `+91 81297 64370` | `+91 94461 43165`
  - **Official Emails:** `thekkanathsouparnika@gmail.com` | `nallengara@gmail.com`
  - **Location:** `Opposite RGLP School, Market Junction, Nellikunnu, Thrissur – 680005, Kerala, India`
- **Asset Integration Architecture:**
  - In implementation, copy assets into `public/assets/brand/`:
    - `public/assets/brand/lotus-emblem-burgundy.png`
    - `public/assets/brand/lotus-crest-ivory-on-burgundy.png`
    - `public/assets/brand/lotus-emblem-ivory-on-black.png`
  - Surface the lotus crest across:
    - Public navigation header and mobile header.
    - Public footer signature mark.
    - PDF Quotation and PDF Payment Receipt document headers.
    - Resend HTML email headers.
    - Browser favicon and apple-touch-icon.

---

## 5. What is Left to the Builder

- Implementing the state machine updates in `bookingEngine.ts` to support the two fixed sessions and auditorium-wide locking.
- Creating the migration or updating Supabase types / schemas to add `referrals`, `account_turnovers`, and `preferred_caterers`.
- Copying and configuring brand assets from `assests/` to `public/assets/brand/` and updating the favicon and page title.
- Implementing the React UI components for:
  - Session selection cards in `EnquirePage.tsx` and admin booking modal.
  - Referrals management tab and disburse modal in the Admin console.
  - Preferred caterer showcase card in public and admin views.
  - Financial allocation dials and tax export suite in `FinancePage.tsx`.
  - Quotation builder modal with the specialized cleaning/caution deposit clause.
  - Staff management panel restricted to Super Admin in `StaffPage.tsx`.
- Updating the global design system CSS variables in `index.css` and `tailwind.config.js` with the Burgundy & Rose Gold palette, Cormorant Garamond typography, and liquid glass styling.
- Adding the lightweight ambient particle canvas component with motion-reduction checks.

