# Production Authentication & Admin Route Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lock down the Staff Studio (`/admin/*`) with real Supabase Authentication, replace the prototype simulator with a branded Burgundy Liquid Glass Login page (`/login`), protect all admin routes, and deploy to production.

**Architecture:** Integrate `@supabase/supabase-js` auth sessions into React `AuthContext`, store and sync user roles from `public.profiles`, build a `ProtectedRoute` component to intercept unauthenticated requests, and replace the mock role switcher in `AdminHeader` with real user details and a sign-out mechanism.

**Tech Stack:** React 18, React Router v6, TypeScript, `@supabase/supabase-js`, Tailwind CSS / Vanilla CSS, Vitest.

---

## Global Constraints
- No mock credentials or demo role simulation in production mode.
- Users must authenticate using Supabase `auth.signInWithPassword`.
- Unauthenticated requests to `/admin` or any nested admin route must redirect immediately to `/login`.
- Preserve Burgundy & Liquid Glass luxury aesthetic across the new Login page.
- Do not break any existing test suite (47/47 tests must remain passing).

---

## Review Focus
1. Unauthenticated direct URL navigation to `/admin/finance` or `/admin/bookings` redirects to `/login` with return destination preserved.
2. Invalid email or password display clear, non-cryptic error feedback without leaking internal exceptions.
3. Successful authentication immediately loads user profile with their assigned role (`super_admin`).
4. Logging out cleanly terminates Supabase session, clears local state, and navigates back to `/login`.
5. Public navigation links (e.g. Header & Footer "Staff Studio") remain intact and route to `/login` if unauthenticated.

---

### Task 1: Refactor `AuthContext` to Use Real Supabase Auth Sessions

**Files:**
- Modify: `src/context/AuthContext.tsx`
- Modify: `src/types/models.ts`

- [ ] **Step 1: Write unit test verifying auth state changes & role checking in `tests/auth.test.ts`**
- [ ] **Step 2: Run test to verify it fails**
  Run: `npm run test`
  Expected: FAIL (`auth.test.ts` missing or methods not implemented)
- [ ] **Step 3: Update `AuthContext.tsx` with Supabase session listener, real `signIn`, `signOut`, `isLoading`, and profile lookup**
- [ ] **Step 4: Run test to verify it passes**
  Run: `npm run test`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/context/AuthContext.tsx src/types/models.ts tests/auth.test.ts
  git commit -m "feat(auth): integrate real Supabase authentication session management"
  ```

---

### Task 2: Create `ProtectedRoute` Component

**Files:**
- Create: `src/components/auth/ProtectedRoute.tsx`
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Write component test verifying redirect to `/login` when unauthenticated in `tests/protectedRoute.test.ts`**
- [ ] **Step 2: Run test to verify it fails**
  Run: `npm run test`
- [ ] **Step 3: Implement `ProtectedRoute.tsx` handling `isLoading` spinner, `isAuthenticated` redirect to `/login`, and optional role checks**
- [ ] **Step 4: Update `src/app/routes.tsx` to wrap `/admin` and all child routes in `<ProtectedRoute>`**
- [ ] **Step 5: Run test to verify it passes**
  Run: `npm run test`
- [ ] **Step 6: Commit**
  ```bash
  git add src/components/auth/ProtectedRoute.tsx src/app/routes.tsx tests/protectedRoute.test.ts
  git commit -m "feat(auth): implement ProtectedRoute guard for all admin routes"
  ```

---

### Task 3: Build Burgundy Liquid Glass `LoginPage`

**Files:**
- Create: `src/features/auth/LoginPage.tsx`
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Implement `LoginPage.tsx` with branded Luxury aesthetic, email/password inputs, show/hide password toggle, and loading state**
- [ ] **Step 2: Add `/login` route to `src/app/routes.tsx`**
- [ ] **Step 3: Verify TypeScript compilation (`npm run typecheck`) and tests (`npm run test`)**
- [ ] **Step 4: Commit**
  ```bash
  git add src/features/auth/LoginPage.tsx src/app/routes.tsx
  git commit -m "feat(auth): create luxury Burgundy Liquid Glass LoginPage"
  ```

---

### Task 4: Decommission Prototype Simulator in `AdminHeader`

**Files:**
- Modify: `src/components/admin/AdminHeader.tsx`

- [ ] **Step 1: Remove "Demo Data Reset" button and mock "Switch Role" modal**
- [ ] **Step 2: Display active user's actual name and role badge (`Jane Ferdinant · Super Admin`)**
- [ ] **Step 3: Add real working "Sign Out" button that calls `logout()` and redirects to `/login`**
- [ ] **Step 4: Verify test suite and build (`npm run build`)**
- [ ] **Step 5: Commit**
  ```bash
  git add src/components/admin/AdminHeader.tsx
  git commit -m "refactor(admin): remove prototype simulator and connect real user sign out"
  ```

---

### Task 5: Final Production Verification & Deployment

**Files:**
- None (deployment and merge)

- [ ] **Step 1: Run complete test suite and production build**
  Run: `npm run test && npm run build`
  Expected: 0 errors, all tests pass
- [ ] **Step 2: Push changes to GitHub on `main`**
  Run: `git push origin main`
- [ ] **Step 3: Deploy fresh production build to Vercel**
  Run Vercel production deploy script
- [ ] **Step 4: Verify live authentication and `/admin` protection on `https://www.thekkanathsouparnika.com`**
