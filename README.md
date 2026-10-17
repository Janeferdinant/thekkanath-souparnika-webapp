# Thekkanath Souparnika — Auditorium Management Web Application

> **Authoritative Production System & Master Operations Manual**  
> **Venue:** Thekkanath Souparnika Hall & Events Venue  
> **Location:** Opposite RGLP School, Market Junction, Nellikunnu, Thrissur, Kerala — 680005  
> **Direct Contacts:** +91 8129764370 / +91 9446143165 | **Email:** thekkanathsouparnika@gmail.com  
> **Architecture:** Vite 6 + React 18 + TypeScript + Tailwind CSS + PostgreSQL (Supabase) + Dual-Mode Engine

---

## 📑 Table of Contents

1. [Venue Identity & Stated Specifications](#1-venue-identity--stated-specifications)
2. [Complete Feature Catalog](#2-complete-feature-catalog)
3. [Initial Setup & Local Development](#3-initial-setup--local-development)
4. [Authentication & User Management (RBAC)](#4-authentication--user-management-rbac)
5. [Payment Gateway Setup (UPI, Netbanking, Cards)](#5-payment-gateway-setup-upi-netbanking-cards)
6. [Google Maps Integration Guide](#6-google-maps-integration-guide)
7. [Zero-Cost Production Deployment (Vercel + Supabase)](#7-zero-cost-production-deployment-vercel--supabase)
8. [Management & Staff Operations Manual](#8-management--staff-operations-manual)
9. [Customer & Guest Guide](#9-customer--guest-guide)
10. [Database Architecture & Conflict Engine](#10-database-architecture--conflict-engine)
11. [Testing & Quality Assurance](#11-testing--quality-assurance)

---

## 1. Venue Identity & Stated Specifications

Thekkanath Souparnika is an auditorium and celebration venue located at Market Junction in Nellikunnu, Thrissur. All specifications and operational parameters are strictly anchored in official venue records:

### 🏛️ The Four Event Halls
| Hall Name | Level / Floor | Climate Control | Stated Capacity | Ideal Use Cases |
| :--- | :--- | :---: | :---: | :--- |
| **Stage Hall** | Ground Floor | Air-Conditioned | Up to 100 guests | Ceremonies, engagements, marriage rituals, cultural programmes, seminars. Raised carpeted stage with ambient lighting. |
| **Welcome Hall** | Ground Floor | Air-Conditioned | Up to 100 guests | Reception foyer, senior guest welcoming, high-tea breakouts, intimate gatherings. Glass-door entrance and side seating. |
| **Dining Hall** | First Floor | Air-Conditioned | Up to 100 guests / batch | Traditional Kerala Sadhya feasts, banquets, and buffet dining. Long banquet tables, direct pantry connectivity, and wash counters. |
| **Open Hall** | Terrace Level | Natural Airflow (Non-AC) | Up to 100 guests | Informal receptions, exhibitions, flexible social functions. Polished marble-finish floor, ceiling fans, and 3 high-velocity exhaust fans. |

> **⚠️ Open Hall Acoustic Guidelines:** The Open Hall features a natural cross-ventilation design where sound passes through 3 large industrial exhaust fan openings. Amplified sound and microphones should adhere to local residential decibel standards.

### 🚗 On-Site Facilities & Operational Rules
- **On-Site Parking:** Dedicated parking for **40 to 50 cars** inside the venue compound, with direct access to the PWD bus route and Thrissur highway network.
- **Venue Capacity Ceiling:** Each individual hall accommodates up to **100 guests**. Across coordinated halls, the venue is best suited for gatherings of up to **300 guests**. *(Strictly never marketed as a 400-guest venue).*
- **Power Continuity:** Eco-friendly solar hybrid electrical system with dedicated battery backup for uninterrupted lighting and audio.
- **Tested Water:** Clean drinking and utility well water independently approved by the Kerala Water Authority.
- **Rooftop Safety Rule:** The 4,000 sq ft truss-roofed rooftop is **strictly closed to guests**. Private air-conditioned dress-change rooms can be arranged on the rooftop level upon prior request to management.

---

## 2. Complete Feature Catalog

### 🌐 Public Web Portal
- **Home (`/`):** Hero presentation, hall highlights, quick amenity pills, verified facts, guided tour preview, and booking enquiry CTAs.
- **Halls & Spaces (`/halls` & `/halls/:slug`):** Dedicated page per hall with high-resolution photography, floor locations, AC specifications, suggested setups, and layout notes.
- **Facilities (`/facilities`):** Highlights 40–50 car parking, solar hybrid backup power, certified well water, wash area, grand staircase, and dress-change room arrangements.
- **Photo Tour & Gallery (`/gallery`):** Interactive gallery with full-screen lightbox modal viewing of genuine venue photography.
- **Multi-Step Booking Enquiry (`/enquire`):** 3-step interactive booking wizard validating guest limits (max 300), date selection, time slots, customer contact details, and consent agreement, issuing an instant reference code (e.g. `TS-ENQ-2026-3469`) and direct WhatsApp confirmation.
- **Contact & Location (`/contact`):** PWD route coordinates, direct telephone links, email, operating hours, and one-tap Google Maps directions.
- **Frequently Asked Questions (`/faq`):** Accordion answering common guest questions on parking, AC, advance policies, catering pantry, and capacities.

### 🏢 Administrative Management Studio (`/admin`)
1. **Executive Overview Dashboard (`/admin`):** Real-time KPI summary cards (Confirmed Bookings, Active Enquiries, Monthly Revenue, Pending Tasks), recent lead feed, and upcoming calendar schedule.
2. **Staff Persona Switcher (Admin Header):** Instant role-switching dropdown to test or operate as *Super Admin*, *Administrator*, *Booking Manager*, *Operations Manager*, *Accounts*, or *Staff* with dynamic UI permission gating.
3. **Enquiries Pipeline (`/admin/enquiries`):** Kanban and list views of incoming inquiries categorized by status (*new*, *contacted*, *site_visit_scheduled*, *converted_to_booking*, *lost*). Features a **"Convert to Booking"** action that pre-fills reservation records.
4. **Interactive Booking Calendar (`/admin/calendar`):** Monthly grid view with hall-specific color badges, date navigation, and modal inspection of bookings and maintenance windows.
5. **Booking Management (`/admin/bookings`):** Complete reservation register with status filters (*confirmed*, *tentative_hold*, *in_progress*, *completed*, *cancelled*), advance payment tracking, and atomic overlap validation on creation.
6. **Customer CRM Directory (`/admin/customers`):** Central customer directory tracking contact numbers, email, addresses, cumulative booking frequency, and special customer preferences.
7. **Event Operations & Staging Tasks (`/admin/operations`):** Operational checklist engine organized by event lifecycle stages (*pre_event*, *setup*, *event_day*, *cleanup*, *post_event*) with assignee filtering and status toggles (*todo*, *in_progress*, *blocked*, *done*).
8. **Financial Ledger & Payments (`/admin/finance`):**
   - **Collections Ledger:** Advance deposits, balance payments, payment methods (*UPI*, *Bank Transfer*, *Cash*, *Cheque*), and bank transaction references (UTR).
   - **Expense Tracker:** Categorized operational disbursements (Utilities, Maintenance, Salaries, Supplies) with vendor attribution.
   - **Versioned Quotation Generator:** Produces itemized estimates for prospective clients.
   - **CSV Export:** One-click financial statement download.
9. **Staff Directory (`/admin/staff`):** Roster of authorized management personnel with assigned system roles, direct phone handles, and access permissions.
10. **Vendor Directory (`/admin/vendors`):** Approved vendor registry (HVAC technicians, generator support, florists, audio engineers, waste management).
11. **Maintenance Blackout Scheduler (`/admin/maintenance`):** Blocks halls from being booked during scheduled deep cleaning, marble floor buffing, or AC coil washings.
12. **Marketing Attribution (`/admin/marketing`):** Tracks lead sources (Website, WhatsApp, Phone Calls, Walk-ins) and conversion rates.
13. **Reports & Business Analytics (`/admin/reports`):** Interactive Recharts visualizations displaying hall utilization frequency, revenue contribution per hall, and event type distributions.
14. **Document Storage Registry (`/admin/documents`):** Private file repository for statutory certificates, water authority test approvals, floor plans, and contracts.
15. **Grounded AI Copilot (`/admin/ai`):** Context-aware deterministic assistant capable of querying live bookings, summarizing collections, inspecting leads, and quoting verified venue facts with zero hallucinated pricing.
16. **Venue & Content Settings (`/admin/settings`):** Global venue metadata, primary phone handles, Google Maps coordinate links, and system environment status.
17. **Immutable Audit Trail (`/admin/audit-log`):** Chronological compliance log recording who made changes, what entity was modified, and context notes with UTC timestamps.

---

## 3. Initial Setup & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher (tested on Node v20 and v24)
- **npm**: v9.0.0 or higher

### Step 1: Clone & Install
```bash
git clone https://github.com/<your-username>/thekkanath-souparnika-webapp.git
cd thekkanath-souparnika-webapp
npm install
```

### Step 2: Running in Zero-Config Local Demo Mode
No external database setup or credentials are required. The app includes an offline-first storage engine with pre-seeded fixtures:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser:
- Public web portal is available at `/`
- Management console is accessible at `/admin`
- Use the **Role Switcher** in the top navigation bar to test different staff roles.
- Click **"Reset Demo Data"** in the top admin bar anytime to restore clean sample records.

### Step 3: Connecting to Live Supabase (Production Mode)
1. Copy the environment configuration template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Supabase project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
   ```
3. Execute the database schema and sample fixtures in your Supabase SQL Editor:
   - Run `supabase/migrations/20261017000000_init_schema.sql`
   - Run `supabase/seed.sql`
4. Restart your Vite dev server:
   ```bash
   npm run dev
   ```

---

## 4. Authentication & User Management (RBAC)

### How Authentication Works
The system employs a dual-layered security model:
1. **Client Role Guard (`AuthContext.tsx`):** Protects routes and UI controls based on the active user's role.
2. **PostgreSQL Row-Level Security (`20261017000000_init_schema.sql`):** Guarantees data access boundaries at the database layer via stored procedures `public.has_role()` and `public.is_staff()`.

### Supported User Roles
| Role Code | Display Role | System Permissions |
| :--- | :--- | :--- |
| `super_admin` | **Super Admin / Owner** | Full unrestricted access to all modules, financial ledgers, settings, and staff provisioning. |
| `administrator` | **Administrator / GM** | Full operational, booking, and financial control; settings read-only. |
| `booking_manager` | **Booking Manager** | Manages inquiries, customer directory, quotation creation, and confirmed bookings. Read-only on ledger. |
| `operations_manager`| **Operations Supervisor**| Staging checklists, vendor coordination, maintenance blackout blocks, and operations expenses. |
| `accounts` | **Accounts Officer** | Full access to payment receipts, expense logging, quotation approval, and CSV export. |
| `staff` | **Floor Staff** | Read-only on schedules; checklist task execution and status updates. |
| `vendor` | **External Vendor** | Read-only on assigned tasks and logistical requirements. |
| `customer` | **Client / Host** | Self-service inquiry submission and receipt view. |

### Adding or Removing Staff Users in Production

#### Method A: Supabase Dashboard (Recommended)
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) -> Select your project.
2. Navigate to **Authentication** -> **Users**.
3. Click **Add user** -> **Create user** (enter staff email and password).
4. Navigate to **Table Editor** -> **`profiles`** table.
5. Locate the newly created user record and update the `role` column to the desired role string (e.g. `booking_manager` or `operations_manager`).
6. **To Revoke Access:** In **Authentication** -> **Users**, click `...` next to the staff member's email and select **Delete user**. PostgreSQL will automatically clean up their `public.profiles` record via cascading deletes.

#### Method B: Batch SQL Provisioning
Run this in the Supabase SQL Editor:
```sql
-- Update an existing staff member's role:
UPDATE public.profiles 
SET role = 'booking_manager', updated_at = now() 
WHERE email = 'manager@thekkanath.com';
```

---

## 5. Payment Gateway Setup (UPI, Netbanking, Cards)

The application models all monetary sums using **integer paise** (`amount_paise`, where ₹1.00 = 100 paise) to prevent IEEE 754 floating-point rounding errors. This matches standard Indian payment gateway requirements (Razorpay, Cashfree, PhonePe).

### Connecting Razorpay for Online Payments

1. **Create Merchant Account:** Register at [razorpay.com](https://razorpay.com) and complete business verification (firm PAN and current account bank details).
2. **Configure API Key:** Add your Razorpay key ID to `.env`:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
   ```
3. **Include SDK:** Ensure [index.html](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/index.html) loads the checkout script:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
4. **Trigger Checkout Modal:** When taking an advance or balance payment:
   ```typescript
   const options = {
     key: import.meta.env.VITE_RAZORPAY_KEY_ID,
     amount: booking.advancePaidPaise, // e.g. 1000000 for ₹10,000.00
     currency: 'INR',
     name: 'Thekkanath Souparnika',
     description: `Advance for ${booking.hallName} (${booking.reference})`,
     image: '/favicon.svg',
     handler: function (response: any) {
       StorageService.recordPayment({
         bookingId: booking.id,
         bookingReference: booking.reference,
         customerName: booking.customerName,
         amountPaise: booking.advancePaidPaise,
         paymentMethod: 'upi',
         transactionReference: response.razorpay_payment_id,
         recordedBy: 'Razorpay Online Gateway',
         notes: `Settled via Razorpay (ID: ${response.razorpay_payment_id})`,
       });
     },
     prefill: {
       name: booking.customerName,
       contact: booking.customerPhone,
       email: booking.customerEmail,
     },
     theme: { color: '#1b3328' }, // Venue Forest Green
   };
   const rzp = new (window as any).Razorpay(options);
   rzp.open();
   ```

### Zero-Fee Counter Payments via Dynamic UPI QR
To collect payments on-site at the venue office without paying gateway processing fees (0% MDR), generate a dynamic UPI QR code:
```
upi://pay?pa=thekkanathsouparnika@okhdfcbank&pn=Thekkanath+Souparnika&am=15000.00&cu=INR&tn=Advance-TS-BKG-2026-104
```

---

## 6. Google Maps Integration Guide

The venue coordinates and access notes are maintained in [src/data/venueData.ts](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/src/data/venueData.ts).

### Option A: Interactive Zero-Cost `<iframe>` Embed (Recommended)
You can embed an interactive Google Map on the Contact page without requiring a billing account or API key:
```tsx
<iframe
  title="Thekkanath Souparnika Map"
  src="https://www.google.com/maps?q=Thekkanath+Souparnika+Nellikunnu+Thrissur&output=embed"
  width="100%"
  height="400"
  className="rounded-2xl border border-cream-200 shadow-sm"
  style={{ border: 0 }}
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
```

### Option B: Google Cloud Maps Platform JavaScript API
1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Maps JavaScript API**.
3. Generate an API Key and restrict it to your production domain (`*.thekkanathsouparnika.com/*`).
4. Set the key in your `.env` file:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## 7. Zero-Cost Production Deployment (Vercel + Supabase)

The entire production stack can be hosted at **₹0/month** on industry-standard infrastructure:

```
┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐
│       Vercel / Cloudflare Pages      │     │         Supabase (AWS Mumbai)       │
│  • Free Hosting & Global Edge CDN    │────▶│  • 500 MB PostgreSQL Database       │
│  • Automatic HTTPS SSL Certificates  │     │  • 50,000 Monthly Active Users      │
│  • Continuous Git Deployments        │     │  • Daily Automated Backups          │
│  • Cost: ₹0 / month                  │     │  • Cost: ₹0 / month                 │
└──────────────────────────────────────┘     └─────────────────────────────────────┘
```

### Step-by-Step Deployment:
1. **Push Repository to GitHub:**
   ```bash
   git remote add origin https://github.com/<your-username>/thekkanath-souparnika-webapp.git
   git push -u origin main
   ```
2. **Deploy on Vercel:**
   - Sign in to [vercel.com](https://vercel.com) using GitHub.
   - Click **Add New...** -> **Project** -> Select `thekkanath-souparnika-webapp`.
   - Vercel automatically detects the Vite framework. The included `vercel.json` configures single-page application (SPA) rewrites.
   - In **Environment Variables**, provide:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click **Deploy**.
3. **Provision Database on Supabase:**
   - Create a free project at [supabase.com](https://supabase.com) in region **ap-south-1 (Mumbai)** for lowest latency to Kerala users.
   - Execute [20261017000000_init_schema.sql](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/supabase/migrations/20261017000000_init_schema.sql) in the SQL Editor.
4. **Map Custom Domain:**
   - Purchase `thekkanathsouparnika.com` or `.in` (~₹600–₹800/yr on Cloudflare or Namecheap).
   - In Vercel -> **Settings** -> **Domains**, add the domain. SSL certificates are provisioned and renewed automatically.

---

## 8. Management & Staff Operations Manual

For a complete, beginner-friendly walkthrough with actual application screenshots, vector flowcharts, and annotated callouts designed for non-technical business owners, refer to:
- **📄 Printable Business Owner's User Manual (PDF):** [docs/THEKKANATH_SOUPARNIKA_OWNER_MANUAL.pdf](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/docs/THEKKANATH_SOUPARNIKA_OWNER_MANUAL.pdf)
- **🌐 Interactive Web Manual (HTML):** [docs/THEKKANATH_SOUPARNIKA_OWNER_MANUAL.html](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/docs/THEKKANATH_SOUPARNIKA_OWNER_MANUAL.html)
- **🐍 PDF Generator Script:** [scripts/generate_owner_manual_pdf.py](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/scripts/generate_owner_manual_pdf.py)

### For General Manager & Super Admin
- **Dashboard Review:** Open `/admin` every morning to review new leads, confirmed booking revenue, and scheduled event turnover.
- **Audit Compliance:** Access `/admin/audit-log` to inspect staff actions, booking cancellations, and payment entries.
- **Content Updates:** Adjust venue phone numbers, addresses, and announcements in `/admin/settings`.

### For Booking Managers
- **Inquiry Handling:** Navigate to `/admin/enquiries`. Review incoming web leads, contact prospective hosts via phone/WhatsApp, and record notes.
- **Converting Leads:** Once a client agrees on a date, click **"Convert to Booking"** on their inquiry card. Enter agreed pricing and advance payment.
- **Conflict Prevention:** When taking bookings over the phone, use the **"New Booking"** button in `/admin/bookings`. The system will automatically block overlapping time slots for the same hall.
- **Tentative Holds:** For hosts requesting time to finalize auspicious times (Muhurtham), create a booking with status `tentative_hold` and assign a 48-hour expiration.

### For Accounts Officers
- **Recording Payments:** In `/admin/finance`, click **"Record Payment Receipt"** to log advances, token amounts, or balance payments against the booking reference.
- **Tracking Expenses:** Log daily operational disbursements (KSEB power bills, maintenance supplies, diesel refill) under **"Log Operational Expense"**.
- **Financial Reports:** Use **"Export Financial Ledger (CSV)"** to provide transaction spreadsheets to auditors.

### For Operations & Maintenance Supervisors
- **Staging Checklists:** Open `/admin/operations` to monitor setup stages for upcoming weddings or seminars. Verify stage audio, microphone batteries, and AC chillers 2 hours prior to guest arrival.
- **Maintenance Blackouts:** When scheduled maintenance is required (e.g. marble floor polishing), open `/admin/maintenance` and create a blackout block to prevent bookings on those dates.

### For All Staff: Using the Grounded AI Copilot
- Access `/admin/ai` to query system records using natural language:
  - *"Which halls have the highest booking utilization this month?"*
  - *"Summarize total cash collections versus expenses."*
  - *"List inquiries requiring follow-up."*
  - *"What are the acoustic considerations for Open Hall?"*

---

## 9. Customer & Guest Guide

### How Guests Browse & Enquire
1. **Explore Spaces:** Prospective hosts visit `/halls` to view capacities, photo galleries, and air-conditioning configurations.
2. **Submit Event Request:** On `/enquire`, guests complete the 3-step inquiry wizard:
   - Step 1: Event type, desired date, time slot, preferred hall, and guest count (up to 300).
   - Step 2: Contact name, mobile number, and special requests (Sadya seating batches, dressing room requirements).
   - Step 3: Consent confirmation and instant reference issuance.
3. **Immediate Assistance:** Guests can tap the **WhatsApp** or telephone buttons in the website header for immediate coordination with venue management.

---

## 10. Database Architecture & Conflict Engine

The database is built on 14 PostgreSQL tables enforcing referential integrity and check constraints:

```
PROFILES ───< BOOKINGS >─── PAYMENTS
                 │
                 ├───< STAFF_TASKS
                 │
                 └───< QUOTATIONS
CUSTOMERS ──< BOOKINGS
HALLS ──────< BOOKINGS
HALLS ──────< MAINTENANCE_BLOCKS
ENQUIRIES ──< BOOKINGS (Conversion)
```

### Atomic Overlap Prevention Stored Procedure
To eliminate double-bookings at the database layer under concurrent web requests, [check_hall_booking_conflict](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/supabase/migrations/20261017000000_init_schema.sql#L248-L290) evaluates interval collisions:
$$\text{Overlap} \iff (Start_A < End_B) \land (End_A > Start_B)$$
Any reservation overlapping with an existing booking, active tentative hold, or scheduled maintenance block is rejected with a descriptive conflict payload.

---

## 11. Testing & Quality Assurance

The codebase includes static type analysis, automated unit tests, and production build verification:

```bash
# 1. Static Typecheck (0 errors across all TypeScript files)
npm run typecheck

# 2. Automated Test Suite (17/17 tests passing)
npm test

# 3. Production Bundle Compilation (Output to dist/)
npm run build
```

Detailed test logs and verification records are preserved in [docs/TEST_REPORT.md](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/docs/TEST_REPORT.md).

---

## 12. 360° Virtual Tour Field Manual (Android Photo Sphere)

To create an interactive virtual tour for Thekkanath Souparnika without requiring expensive 360° spherical camera hardware, venue staff and photographers can capture high-resolution equirectangular panoramas using any modern Android smartphone.

We provide a complete, 3-page illustrated manual containing vector diagrams, nodal point geometry, viewfinder alignment walkthroughs, and venue floorplan maps:

- **📄 Printable PDF Field Manual:** [docs/THEKKANATH_SOUPARNIKA_360_PHOTOSPHERE_MANUAL.pdf](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/docs/THEKKANATH_SOUPARNIKA_360_PHOTOSPHERE_MANUAL.pdf)
- **🌐 Interactive Web HTML Version:** [docs/THEKKANATH_SOUPARNIKA_360_PHOTOSPHERE_MANUAL.html](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/docs/THEKKANATH_SOUPARNIKA_360_PHOTOSPHERE_MANUAL.html)
- **🐍 PDF Generator Script:** [scripts/generate_manual_pdf.py](file:///c:/Users/Asus/Documents/Antigravity-Projects/thekkanath-souparnika-webapp/scripts/generate_manual_pdf.py)

### Summary of the 6 Venue Capture Nodes:
1. **Compound Front Gate:** Main entry gate looking into the 40–50 car parking lot and exterior building facade.
2. **Welcome Hall Foyer:** Just inside the glass entrance doors showcasing elder accessibility and reception.
3. **Stage Hall (Audience):** Center aisle 15 ft back from stage showcasing decorated stage and air conditioning.
4. **On the Stage:** Standing center stage looking forward over the audience rows and main entrance.
5. **Dining Hall:** Center aisle between rows of banquet dining tables with garden window views.
6. **Open Hall Pavilion:** Center floor of the breezy covered rooftop terrace pavilion.

