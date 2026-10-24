# Repository Cleanup & Dummy Data Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the repository by removing outdated/unnecessary files and directories, organizing assets, and removing all dummy values, mock fixtures, and seed data from both the website and the Supabase database.

**Architecture:** 
1. Database Cleanup: Execute SQL scripts to clear dummy data in `payments`, `bookings`, `enquiries`, `customers`, `expenses`, and `vendors`, while preserving authentic venue settings, real halls, and authenticated staff profiles (`Jane Ferdinant` & `Ferdinant Nallengara`).
2. Codebase & Storage Cleanup: Transition `src/lib/storage.ts` to clean empty production fallbacks (`[]`), update `StaffPage.tsx` to read real Supabase staff profiles, update `DEFAULT_REFERRERS` to empty, update `PreferredCaterersCard.tsx` with authentic catering guidelines, and remove `src/data/demoSeed.ts`.
3. File & Directory Organization: Relocate `assests/business-card.pdf` to `docs/reference/`, delete the misspelled `assests/` folder, delete `uiux-agent-pack/`, remove duplicate brand asset files, and clean up temporary scratch files.
4. Verification & Deployment: Run typecheck, unit tests, and production build, commit to `main`, push to GitHub, and deploy to Vercel production.

**Tech Stack:** TypeScript, React, Supabase PostgreSQL, Vite, TailwindCSS.

**Spec:** User instruction: "cleanup repo, remove all outdated and unncessary files, organize files and folders. remove all dummy values from the website and database".

## Global Constraints
- Do NOT delete the 2 real super admin accounts (`Jane Ferdinant` and `Ferdinant Nallengara`) in `public.profiles` or `auth.users`.
- Do NOT delete or modify authentic venue data: `public.venue_settings` (Nellikunnu, Thrissur) or `public.halls` (Stage, Welcome, Dining, Open).
- Store no credentials in repo files.
- Ensure all 49 vitest tests pass and TypeScript check passes.

## Review Focus
- Database integrity: Foreign key cascading and constraints when deleting bookings and customers.
- LocalStorage initialization: When a fresh visitor arrives, localStorage must default to empty arrays rather than crashing on undefined.
- Public UI consistency: Verify no placeholder phone numbers (e.g., `9847123456`, `9446789012`) appear on public pages.
- Authentication integrity: Verify staff management page continues displaying the 2 authenticated super admins.
- Build & Deployment: Verify zero missing imports after deleting `demoSeed.ts`.

---

### Task 1: Clean Up Live Supabase Database Dummy Records

**Files:**
- Modify: `supabase/seed.sql`
- Script: `scratch_clean_db.mjs` (temporary execution script)

**Interfaces:**
- Clears dummy rows from: `payments`, `bookings`, `enquiries`, `customers`, `expenses`, `vendors`.
- Preserves: `profiles`, `auth.users`, `venue_settings`, `halls`.

- [ ] **Step 1: Write database cleanup script targeting only dummy seed records**
- [ ] **Step 2: Obtain confirmation under accidental-data-loss-prevention guidelines**
- [ ] **Step 3: Execute cleanup query on PostgreSQL and verify table row counts**
- [ ] **Step 4: Update `supabase/seed.sql` to remove dummy customer/booking/payment fixtures**

---

### Task 2: Remove Dummy Values from Frontend and Storage Service

**Files:**
- Modify: `src/lib/storage.ts`
- Modify: `src/lib/referralEngine.ts`
- Modify: `src/components/public/PreferredCaterersCard.tsx`
- Modify: `src/features/admin/StaffPage.tsx`
- Delete: `src/data/demoSeed.ts`

**Interfaces:**
- `StorageService`: returns empty arrays `[]` when no local storage records exist.
- `DEFAULT_REFERRERS`: empty array `[]`.
- `PreferredCaterersCard`: provides authentic venue catering guidance and real contact numbers instead of fake placeholder phones.

- [ ] **Step 1: Refactor `src/lib/storage.ts` to remove `demoSeed` imports and default to `[]`**
- [ ] **Step 2: Remove `src/data/demoSeed.ts`**
- [ ] **Step 3: Update `DEFAULT_REFERRERS` in `src/lib/referralEngine.ts` to empty array**
- [ ] **Step 4: Update `PreferredCaterersCard.tsx` with authentic venue catering guidelines**
- [ ] **Step 5: Connect `StaffPage.tsx` to `useAuth()` to display live Supabase staff roster**
- [ ] **Step 6: Run `npm run typecheck` and `npm test` to verify zero regression**

---

### Task 3: Organize Files & Remove Outdated Directories and Assets

**Files to Relocate:**
- `assests/business-card.pdf` -> `docs/reference/business-card.pdf`

**Files & Directories to Remove:**
- Directory: `assests/` (misspelled, duplicate logos)
- Directory: `uiux-agent-pack/` (obsolete prototyping agent pack)
- Duplicate brand assets in `public/assets/brand/`:
  - `Burgundy Seven-Petal Lotus Emblem.png`
  - `Ivory Lotus Crest on Burgundy.png`
  - `Ivory Lotus Emblem on Black.png`
  - `burgundy-lotus-emblem.png`
  - `ivory-lotus-black.png`
  - `ivory-lotus-crest.png`
- Scratch inspection scripts:
  - `scratch_check_db.mjs`
  - `scratch_pg_check.mjs`
  - `scratch_auth_check.mjs`

- [ ] **Step 1: Move `business-card.pdf` to `docs/reference/`**
- [ ] **Step 2: Remove `assests/` and `uiux-agent-pack/`**
- [ ] **Step 3: Remove duplicate asset files from `public/assets/brand/`**
- [ ] **Step 4: Remove all root scratch scripts**

---

### Task 4: Verification, Git Commit, and Production Deployment

- [ ] **Step 1: Run `npm run typecheck` (`tsc --noEmit`)**
- [ ] **Step 2: Run `npm test` (`vitest run`)**
- [ ] **Step 3: Run `npm run build`**
- [ ] **Step 4: Commit changes to `main` and push to GitHub**
- [ ] **Step 5: Deploy to Vercel production and verify HTTP 200**
