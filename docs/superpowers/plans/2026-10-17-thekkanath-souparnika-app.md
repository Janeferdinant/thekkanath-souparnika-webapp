# Thekkanath Souparnika Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete production-grade Auditorium Management Web App for Thekkanath Souparnika Hall & Events Venue with public customer portal, authenticated administrative operations, finance, calendar, booking conflict engine, and real brochure assets.

**Architecture:** React 19 + TypeScript + Vite + Tailwind CSS frontend with React Router; Supabase PostgreSQL schema with RLS and atomic conflict constraints; resilient dual-mode state layer with local persistent demo fallback.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Lucide React, React Hook Form, Zod, Recharts, Vitest.

**Spec:** `docs/reference/Thekkanath_Souparnika_Antigravity_Full_App_Build_Prompt.md`

## Global Constraints
- Preserve exact brochure facts: Four halls (Stage, Welcome, Dining, Open), up to 100 guests per hall, best suited up to 300 guests overall.
- Never invent prices, deposits, package rates, cancellation policies, or catering options.
- Prevent same-hall overlapping confirmed bookings transactionally.
- Never use emojis for structural icons; use Lucide vector icons.
- Currency formatted in INR (₹) using integer paise calculations.

---

### Task 1: Initialize Project Scaffolding, Assets & Design System
- Transfer real venue photos from `Thekkanath_Souparnika_UI_UX_Prototype/assets/` to `public/assets/venue/`.
- Configure `package.json`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`, `index.html`.
- Set up Tailwind design tokens (forest green, warm ivory, champagne gold).

### Task 2: Core Domain Models & Brochure Data
- Define TypeScript types for Venue, Hall, Enquiry, Booking, Customer, Quote, Payment, Expense, Staff, Vendor, AuditLog.
- Create `src/data/venueData.ts` with verified facts.
- Create initial demo fixtures in `src/data/demoSeed.ts`.

### Task 3: Dual-Mode Persistence & Booking Engine
- Implement `src/lib/bookingEngine.ts` with interval overlap detection and status transitions.
- Write unit tests `tests/bookingEngine.test.ts` following TDD.
- Implement `src/lib/storage.ts` with Supabase client and localStorage demo engine.

### Task 4: Public Customer Experience
- Public navigation, header, footer, contact bar.
- Home page (`/`), Halls directory (`/halls`), Hall detail (`/halls/:slug`), Facilities (`/facilities`), Gallery/Tour (`/gallery`), Contact (`/contact`), FAQ (`/faq`).
- Multi-step booking enquiry form (`/enquire`) with Indian phone validation and idempotency.

### Task 5: Authentication & Admin Layout
- AuthContext with roles (Super Admin, Booking Manager, Operations, Accounts, Staff).
- Login modal with demo credentials quick-switch.
- Admin shell with responsive sidebar, KPI cards, notifications, search.

### Task 6: Booking & Calendar Management
- Calendar view (`/admin/calendar`) with day/week/month views and hall filters.
- Enquiry management (`/admin/enquiries`) with pipeline stages and conversion to booking.
- Bookings management (`/admin/bookings`) with conflict check and status progression.

### Task 7: Operations, CRM, Staff, Vendors, Maintenance, Documents
- Event Operations (`/admin/operations`) with checklists and run-sheets.
- CRM (`/admin/customers`), Staff (`/admin/staff`), Vendors (`/admin/vendors`).
- Facilities & Maintenance (`/admin/maintenance`) with calendar blocking.
- Documents (`/admin/documents`).

### Task 8: Finance, Billing & Analytics
- Finance overview, income receipts, expenses by category, balance tracking.
- Quotation generator with line items and printable view.
- Reports & Analytics (`/admin/reports`) with Recharts visual graphs.

### Task 9: AI Copilot, Settings & External Adapters
- AI Copilot (`/admin/ai`) with deterministic metrics calculation and clear demo status.
- Venue Settings (`/admin/settings`) and Audit Log (`/admin/audit`).
- Adapters for WhatsApp, tel/mailto, maps, notifications.

### Task 10: PostgreSQL Schema, Migrations, Documentation & Build Verification
- Create `supabase/migrations/20261017000000_init_schema.sql` and `supabase/seed.sql`.
- Create `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/DEPLOYMENT.md`, `docs/OWNER_SETUP_CHECKLIST.md`, `docs/TEST_REPORT.md`.
- Run Vitest tests, run TypeScript check, run Vite production build.
