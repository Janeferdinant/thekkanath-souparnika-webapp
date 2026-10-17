# Thekkanath Souparnika — Implementation Plan
> **Authoritative Specification:** `Thekkanath_Souparnika_Antigravity_Full_App_Build_Prompt.md`
> **Target:** Complete Auditorium & Convention Centre Management Web App
> **Venue:** Thekkanath Souparnika, Hall & Events Venue, Market Junction, Nellikunnu, Thrissur – 680005, Kerala, India

---

## 1. System Architecture & Tech Stack

### Core Technologies
- **Runtime & Bundler:** Vite 6 + React 19 / 18 + TypeScript
- **Routing:** React Router v7 (`react-router-dom`) with typed public & protected admin routes
- **Styling & Design Tokens:** Tailwind CSS v3/v4 with custom Kerala hospitality palette:
  - Deep Forest Green (`#1b382b`, `#203b30`, `#2b4c3d`)
  - Warm Ivory & Paper Cream (`#fbf9f4`, `#f5f2e9`, `#eee8dc`)
  - Champagne Gold (`#c9a66a`, `#e2c890`, `#94763e`)
  - Dark Slate / Ink (`#1a2621`, `#2a3831`)
  - Semantic Statuses: Confirmed/Paid (`#2e7d32`), Pending/Review (`#b26a00`), Cancelled/Overdue (`#c62828`)
- **Icons:** `lucide-react` (uniform stroke, no emoji structural icons)
- **Forms & Validation:** `react-hook-form` + `zod`
- **Charts:** `recharts` for KPI trends, hall utilization, booking pipeline, financial summaries
- **Data & Auth Layer:**
  - Supabase client (`@supabase/supabase-js`) with full PostgreSQL schema, Row-Level Security (RLS) policies, atomic booking overlap prevention functions
  - Dynamic Dual-Mode Architecture: Live Supabase backend when `.env` is configured; fully interactive, high-fidelity Local Demo Engine with persistent browser storage (`localStorage` + mock seed data) when backend credentials are unconfigured or in demo mode. Clearly flagged with a persistent "Demo Mode" indicator.
- **Testing:** `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`

---

## 2. Directory Structure

```text
thekkanath-souparnika-webapp/
├── public/
│   └── assets/
│       └── venue/             # venue-000.jpg through venue-006.jpg (real venue photos)
├── src/
│   ├── app/
│   │   ├── routes.tsx         # Central Route definitions
│   │   ├── App.tsx            # App root, providers, error boundaries
│   │   └── main.tsx           # Entry point
│   ├── components/
│   │   ├── ui/                # Button, Modal, Badge, Card, Input, Select, Table, Toast
│   │   ├── public/            # PublicHeader, PublicFooter, HallCard, TourLightbox, ContactStrip
│   │   └── admin/             # AdminHeader, AdminSidebar, KPICard, ChartCard, AuditTable
│   ├── context/
│   │   ├── AuthContext.tsx    # Role-based auth (Owner, Admin, Booking Mgr, Accounts, etc.)
│   │   └── ToastContext.tsx   # Global toast notifications
│   ├── data/
│   │   ├── venueData.ts       # Verified brochure facts (Stage, Welcome, Dining, Open Hall)
│   │   └── demoSeed.ts        # Clearly labeled initial fixtures for demo mode
│   ├── features/
│   │   ├── public/
│   │   │   ├── HomePage.tsx
│   │   │   ├── HallsPage.tsx
│   │   │   ├── HallDetailPage.tsx
│   │   │   ├── FacilitiesPage.tsx
│   │   │   ├── GalleryPage.tsx
│   │   │   ├── EnquirePage.tsx   # Multi-step validated enquiry journey
│   │   │   ├── ContactPage.tsx
│   │   │   └── FAQPage.tsx
│   │   └── admin/
│   │       ├── OverviewPage.tsx
│   │       ├── EnquiriesPage.tsx
│   │       ├── CalendarPage.tsx
│   │       ├── BookingsPage.tsx
│   │       ├── CustomersPage.tsx
│   │       ├── OperationsPage.tsx
│   │       ├── FinancePage.tsx
│   │       ├── StaffPage.tsx
│   │       ├── VendorsPage.tsx
│   │       ├── MaintenancePage.tsx
│   │       ├── MarketingPage.tsx
│   │       ├── ReportsPage.tsx
│   │       ├── DocumentsPage.tsx
│   │       ├── SettingsPage.tsx
│   │       ├── AuditLogPage.tsx
│   │       └── AICopilotPage.tsx
│   ├── lib/
│   │   ├── supabase.ts        # Typed Supabase client & environment validator
│   │   ├── storage.ts         # Dual-mode store (Supabase or Local Persistence)
│   │   ├── bookingEngine.ts   # Overlap detection, time calculations, status state machine
│   │   └── formatters.ts      # INR (₹) Indian numbering, Asia/Kolkata date-time formatters
│   └── types/
│       ├── database.ts        # Database schema TypeScript types
│       └── models.ts          # Core domain models (Hall, Enquiry, Booking, Quote, Payment, etc.)
├── supabase/
│   ├── migrations/
│   │   └── 20261017000000_init_schema.sql  # Full PostgreSQL schema, constraints, RLS, functions
│   └── seed.sql               # Demo fixture seed data
├── docs/
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── DEPLOYMENT.md
│   ├── OWNER_SETUP_CHECKLIST.md
│   └── TEST_REPORT.md
├── tests/
│   ├── bookingEngine.test.ts
│   ├── formatters.test.ts
│   └── enquiryValidation.test.ts
├── .env.example
├── README.md
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Incremental Implementation Milestones

### Milestone 1: Project Scaffolding & Design Foundation
- [ ] Initialize Vite + React + TypeScript + Tailwind CSS project with strict typing.
- [ ] Install dependencies (`lucide-react`, `react-router-dom`, `recharts`, `date-fns`, `zod`, `react-hook-form`, `@supabase/supabase-js`, `vitest`).
- [ ] Configure Tailwind CSS tokens (`forest`, `gold`, `cream`, `ink`, `paper`) and typography.
- [ ] Transfer real venue assets from `Thekkanath_Souparnika_UI_UX_Prototype/assets/` to `public/assets/venue/`.
- [ ] Create core typed domain models and verified brochure constants in `src/data/venueData.ts`.

### Milestone 2: Public Website Pages & Multi-Step Enquiry Journey
- [ ] Implement responsive `PublicHeader`, `PublicFooter`, `ContactStrip`, and layout shell.
- [ ] Build **Home Page (`/`)**: Hero with real exterior photo, trust badges, hall grid, facilities preview, photo tour preview, location & directions CTA.
- [ ] Build **Halls Directory (`/halls`)** and **Hall Detail (`/halls/:slug`)**: Verified capacities (up to 100/hall, up to 300 overall), AC/non-AC status, soundproofing caveat for Open Hall, floor information, photo lightbox.
- [ ] Build **Facilities (`/facilities`)**: Wash area, grand staircase, solar hybrid power, tested well water, rooftop changing room note (rooftop closed to guests).
- [ ] Build **Photo Tour / Gallery (`/gallery`)**: Categorized photo gallery with responsive lightbox and accessibility tags.
- [ ] Build **Multi-Step Enquiry Form (`/enquire`)**:
  - Step 1: Event type, date, time slots, preferred hall, guest headcount.
  - Step 2: Customer name, phone (Indian format validation), email, special notes/requests.
  - Step 3: Review & consent disclaimer.
  - Submission generates unique enquiry reference (e.g. `TS-ENQ-2026-XXXX`), idempotency safeguard against double-submission, saves to backend/storage, shows confirmation screen.
- [ ] Build **Contact Page (`/contact`)** & **FAQ Page (`/faq`)**: Verified contact numbers, email, bus route directions, WhatsApp link.

### Milestone 3: Authentication & Security Architecture
- [ ] Create `AuthContext` with role-based access control (Super Admin / Owner, Admin, Booking Manager, Operations Manager, Accounts, Staff, Vendor).
- [ ] Build Sign-in modal/page (`/login`) with credential authentication and demo switcher for testing role views.
- [ ] Enforce protected route gates for `/admin/*`.
- [ ] Write complete PostgreSQL schema in `supabase/migrations/20261017000000_init_schema.sql` with RLS, foreign keys, and indexes.
- [ ] Write `supabase/seed.sql` with clearly labeled demo data.

### Milestone 4: Booking Engine & Conflict Prevention
- [ ] Implement robust date/time range conflict detection in `src/lib/bookingEngine.ts`:
  - `new_start < existing_end && new_end > existing_start` for same hall.
  - PostGreSQL `tstzrange` exclusion constraint / stored procedure for atomic server-side conflict prevention.
  - Tentative hold expiration logic.
- [ ] Build **Booking Calendar (`/admin/calendar`)**: Month/week/day views, hall filtering, visual conflict highlights, status badges.
- [ ] Build **Enquiry Pipeline (`/admin/enquiries`)**: Status transitions (New -> Contacted -> Quoted -> Converted -> Lost), timeline history, conversion to booking workflow.
- [ ] Build **Booking Management (`/admin/bookings`)**: Detailed booking view, edit, reschedule, cancellation with reason, quotation linkage.

### Milestone 5: Event Operations, CRM, Staff, Vendors & Maintenance
- [ ] Build **Event Operations (`/admin/operations`)**: Run sheets, pre/post event checklists, hall readiness sign-off.
- [ ] Build **Customers / CRM (`/admin/customers`)**: Customer profiles, booking history, contact preferences, notes.
- [ ] Build **Staff & Vendors (`/admin/staff`, `/admin/vendors`)**: Staff roster, task assignments, vendor contacts, work orders.
- [ ] Build **Facilities & Maintenance (`/admin/maintenance`)**: Maintenance tickets, scheduled maintenance blocks with calendar conflict checks.
- [ ] Build **Documents Management (`/admin/documents`)**: Private document repository with category tags and authorized access.

### Milestone 6: Finance, Invoicing, Quotations & Reports
- [ ] Build **Finance & Billing (`/admin/finance`)**:
  - Income / receipts ledger, expense tracking with categories (salaries, utilities, repairs, cleaning, etc.).
  - Distinguish invoiced amount vs cash collected vs outstanding vs refunded.
  - Currency formatting in INR (`₹`) with integer paise math.
- [ ] Build **Quotations Generator**: Line-item builder, terms disclaimer, printable/downloadable quotation view.
- [ ] Build **Reports & Analytics (`/admin/reports`)**: Recharts visualizations for booking volume, hall utilization, revenue breakdown, conversion funnel. CSV export capability.

### Milestone 7: AI Copilot, Settings, Audit Log & External Adapters
- [ ] Build **AI Management Copilot (`/admin/ai`)**: Deterministic calculations for venue metrics, prompt safeguards, transparent data grounding, clear "AI Not Connected / Demonstration Mode" fallback banner.
- [ ] Build **Venue Settings (`/admin/settings`)**: Configurable venue details, business hours, advance deposit rules, provider credentials status.
- [ ] Build **Audit Log (`/admin/audit`)**: Immutable log of security and business actions.
- [ ] Build integration adapters: WhatsApp prefilled chat generator, tel/mailto links, map link, email/SMS provider interfaces.

### Milestone 8: Testing, Production Build, Handover Documentation
- [ ] Write unit tests for booking conflict detection, INR currency calculations, and enquiry validation.
- [ ] Run `vitest run` and verify 100% test pass.
- [ ] Run TypeScript typecheck `tsc --noEmit` and production build `npm run build`.
- [ ] Create handover documentation: `README.md`, `.env.example`, `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/DEPLOYMENT.md`, `docs/OWNER_SETUP_CHECKLIST.md`, `docs/TEST_REPORT.md`.
