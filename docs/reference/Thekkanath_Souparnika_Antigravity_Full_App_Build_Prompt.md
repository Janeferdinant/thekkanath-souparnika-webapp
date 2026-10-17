# ANTIGRAVITY MASTER BUILD PROMPT
## Thekkanath Souparnika — Complete Auditorium & Convention Centre Management Web App

> **Instruction to the coding agent:** Treat this document as the authoritative product specification. Build the real, working application in the current workspace—not just a static landing page, visual mockup, or collection of disconnected screens. Read the instructions fully before editing files. Inspect the existing workspace and preserve useful assets. Work incrementally, test the app, fix errors, and finish with clear setup and deployment instructions.

---

## 0. Mission and definition of success

Build a production-minded, responsive web application for **Thekkanath Souparnika, Hall & Events Venue**, located at Nellikunnu Market Junction, Thrissur, Kerala, India.

The product has two connected interfaces that share one secure backend:

1. **Public/customer website** — showcases the venue with real photos, hall details, facilities, tour/gallery, contact options, and a guided booking-enquiry journey.
2. **Authenticated management application** — lets authorized staff manage enquiries, bookings, customers, event operations, payments, expenses, staff, vendors, maintenance, marketing, reports, venue content, and AI-assisted analysis.

The application must be useful on desktop, tablet, and mobile. The customer experience should feel premium and welcoming; the management experience should be fast, consistent, accessible, and data-driven.

### Non-negotiable quality rules

- Build real routes, forms, validation, persisted records, and meaningful loading/empty/error/success states. Do not make every button a visual placeholder.
- Use the existing UI/UX prototype as a visual/product reference, not as the final implementation. Rebuild its useful designs as clean, maintainable components in the chosen stack.
- Do not invent venue facts, prices, package costs, tax rules, hall dimensions, policies, live availability, customer testimonials, or service guarantees.
- Do not present demo data as real business data. Seed/demo records must be clearly labeled **Demo data** and be easy to remove.
- Never confirm a booking just because a form was submitted. The default workflow is **enquiry → staff review → availability verification → quote → approval/confirmation**.
- Never allow overlapping confirmed bookings for the same hall and overlapping time range. Enforce this on the backend/database, not only in the UI.
- Do not integrate payments, messaging, email delivery, maps, AI or external services using fake credentials. Build working adapters/interfaces, use environment variables, and show a truthful configuration status when credentials are missing.
- Do not claim that a service was sent, a payment was taken, or a booking was saved unless the operation actually succeeded.
- Protect personal, customer, financial and document data with authentication, authorization, validation, audit trails, and secure storage.
- Do not stop after scaffolding or after implementing the homepage. Continue until the acceptance checklist at the end has been addressed, or explicitly document any true external blocker.

---

## 1. Inspect the workspace before coding

First inspect the current project tree, package configuration, source files, existing branches and assets. Do not overwrite or delete useful work without checking it.

Likely existing reference files (paths may differ depending on where this prompt is run):

- `Thekkanath_Souparnika_Brochure_Revised_v6(2).pdf` — authoritative venue brochure.
- `Thekkanath_Souparnika_UI_UX_Mockup.html` — standalone combined customer/admin mockup.
- `Thekkanath_Souparnika_UI_UX_Prototype/index.html` — earlier prototype source.
- `Thekkanath_Souparnika_UI_UX_Prototype/assets/venue-000.jpg` through `venue-006.jpg` — venue photographs extracted for the prototype.
- `Thekkanath_Souparnika_UI_UX_Prototype/README.md` — prototype scope and limitations.

If these files exist, inspect them before implementation. Reuse real photographs and useful interaction/design ideas. Copy the relevant assets into the app's public/assets directory while preserving descriptive names. Do not embed a 4 MB HTML mockup as the finished product. Do not use generic stock images when supplied real venue photographs are available.

Create a concise `IMPLEMENTATION_PLAN.md` and `README.md`. Then implement the app in working increments. If an existing repository has an established stack, first assess whether it is reasonable to retain; do not blindly replace a functioning project.

---

## 2. Source-of-truth venue content

Use the supplied brochure as the source of truth for public-facing venue details. The following facts are supported by it:

### Venue identity and contact

- **Display name:** Thekkanath Souparnika
- **Descriptor:** Hall & Events Venue
- **Address:** Opposite RGLP School, Market Junction, Nellikunnu, Thrissur – 680005, Kerala, India
- **Telephone:** 8129764370 and 9446143165
- **Email:** thekkanathsouparnika@gmail.com
- **Access:** On the PWD bus route, at the Market Junction bus stop in Nellikunnu, with highway access.
- **Overall capacity wording:** Four halls are described as accommodating up to 100 guests each; the venue is presented as best suited to gatherings of up to 300. Keep this nuance. Never advertise a combined 400-person function or imply every hall can be booked together for a 400-person event.
- **On-site parking:** The brochure states parking for 40–50 cars. It also mentions roadside parking on the highway for more; do not guarantee roadside parking availability.

### Hall details

**Stage Hall**
- Up to 100 guests as stated in the brochure.
- Ground floor; air-conditioned.
- Dedicated hall with a raised, carpeted stage, cushioned seating and soft ceiling lighting.
- Suggested uses: programmes, ceremonies and cultural events.

**Welcome Hall**
- Up to 100 guests as stated in the brochure.
- Ground floor; air-conditioned.
- Front hall with a glass-door entrance and seating along both sides.
- Described as a warm first welcome for guests.

**Dining Hall**
- Up to 100 guests as stated in the brochure.
- First floor; air-conditioned.
- Long tables, cushioned chairs and large windows with a green outlook.
- Described as suitable for receptions and family feasts.

**Open Hall**
- Up to 100 guests as stated in the brochure.
- Not air-conditioned.
- Wide, bright hall with polished marble-finish flooring, ceiling fans and three exhaust fans for airflow.
- Described as easy to arrange for an event.
- Although the brochure says all four halls are soundproofed, it specifically notes that some sound can pass through the Open Hall’s exhaust fans. Preserve this nuance; never make an absolute sound-isolation claim for this hall.

### Other facilities and details

- **Wash area:** Long row of wash basins with wall mirrors, natural light and ventilation.
- **Grand staircase:** Glass railings; a fire-safety hose reel is shown on the landing.
- **Power:** Solar hybrid system with battery backup, as described in the brochure.
- **Water:** Well water tested and approved by the water authority, as described in the brochure.
- **Sound:** The brochure describes all four halls as soundproofed, with the Open Hall caveat above.
- **Rooftop changing rooms:** The brochure describes a 4,000 sq ft truss-roofed rooftop. The rooftop is **not open to guests**. Dress-change rooms can be arranged there on request. Do not show or market it as an event space, public recreation area, guest-access rooftop, or bookable hall.
- **Air-conditioning:** Stage, Welcome and Dining halls are air-conditioned; Open Hall is not.

### Content integrity restrictions

Do not invent or imply the venue has any of the following unless the owner later supplies confirmation: rental prices, deposits, package prices, catering, decoration, kitchen facilities, generator details, lift/elevator access, wheelchair accessibility, hall dimensions, event time limits, opening hours, cancellation/refund terms, advance payment percentages, discounts, taxes, booking rules, testimonials, awards, ratings, or other facilities.

Where the application needs a policy/value that has not been supplied, create an admin-editable setting and show a clear **Not configured** or **Contact management to confirm** state on the public site. Keep sample/demo values explicitly marked as demo and never publish demo prices or policies.

---

## 3. Product architecture and technology

Use a maintainable TypeScript-based stack. Preferred baseline:

- **Frontend:** React + Vite + TypeScript.
- **Routing:** React Router (or a comparable well-maintained route solution).
- **Styling:** Tailwind CSS with design tokens and reusable component primitives.
- **Motion:** Motion/Framer Motion or CSS transitions, used selectively and with reduced-motion support.
- **Backend/database/auth:** Supabase (PostgreSQL, Auth, Storage, Row Level Security). Keep database schema and migrations checked into the repo.
- **Forms/validation:** React Hook Form + Zod, or an equivalent typed validation solution.
- **Charts:** Recharts or another accessible React charting library.
- **Icons:** Lucide, consistently sized; do not mix multiple icon styles.
- **Testing:** Vitest + React Testing Library for unit/component tests; Playwright for high-value end-to-end flows.
- **Deployment:** Frontend can be deployed to Vercel/Netlify or another compatible host; Supabase hosts the managed backend. Provide a deployment guide. Do not depend on local-only files for production persistence.

If the current repository is already set up with an equally capable, secure stack, keep it where practical and document the decision. Avoid needless dependencies.

### Environment and configuration

- Add `.env.example` with variable names only. Never commit actual secrets.
- Use browser-safe public Supabase project URL and anon key only where appropriate; privileged service-role credentials must never appear in frontend code.
- Validate required environment configuration on startup and display a friendly setup message if backend configuration is missing.
- The app should run locally using documented commands. If backend credentials are not available, provide an explicitly labeled local-demo mode with local mock data; never represent it as production persistence.
- Add scripts for `dev`, `build`, `lint`, `typecheck`, `test`, and e2e tests if supported.
- Use database migrations or version-controlled SQL scripts for schema changes. Do not rely on undocumented manual table creation.

### Proposed source layout

Use a clear structure similar to this, adapting only when the repository has a better established pattern:

```text
src/
  app/                 # app shell, routing, providers, error boundaries
  components/          # shared UI components and design system
  features/
    public-site/
    enquiries/
    bookings/
    customers/
    operations/
    finance/
    staff/
    vendors/
    maintenance/
    marketing/
    reports/
    ai-copilot/
    settings/
  lib/                  # supabase client, validation, date/time, utilities
  services/             # typed data access and external integrations
  hooks/
  types/
  styles/
  tests/
supabase/
  migrations/
  seed.sql               # demo-only fixtures, marked clearly
public/
  assets/venue/
```

Keep business logic out of giant page components. Use typed models, reusable table/filter/form patterns, explicit states and small components. Do not build one enormous HTML file or an unmaintainable monolithic component.

---

## 4. UI/UX visual system

### Brand direction

- **Mood:** Premium Kerala hospitality, welcoming, refined, trustworthy and calm.
- **Primary palette:** Deep forest green / dark green, warm ivory, champagne gold, muted sand and neutral charcoal. Use burgundy only as a restrained accent if it harmonizes with the existing visual references.
- **Public website:** Elegant editorial layouts, generous white space, real venue photography, subtle gradients, carefully chosen serif display headings paired with a highly legible sans-serif body font, smooth and restrained motion.
- **Management app:** Quiet light-first dashboard with dark-green accents and optional dark mode. Prioritize information density, task completion and legibility over decorative effects. Use glass effects sparingly, not behind small text or data tables.
- **Cards:** Consistent radius, border, shadows, padding and hierarchy. Avoid excessive rounded cards nested inside each other.
- **Buttons:** Clear primary, secondary, tertiary, danger and disabled states. All visible controls must have real actions or be explicitly disabled with an explanation.
- **Status styles:** Use a consistent color and label mapping for enquiry, pending, quoted, confirmed, completed, cancelled, refunded, paid, partially paid and overdue. Never communicate status by color alone.
- **Motion:** Scroll reveals and small micro-interactions only where appropriate. Respect `prefers-reduced-motion`; keep booking and dashboard forms fast.
- **Responsive:** Design mobile-first. On mobile use accessible drawer navigation, large touch targets, compact filters, horizontally scrollable data tables only as a fallback, and responsive card views where appropriate.
- **Accessibility:** Aim for WCAG 2.2 AA: semantic HTML, keyboard navigation, visible focus, adequate contrast, labels, error summaries, alt text, dialog focus management, screen-reader announcements and reduced-motion support.

### Global navigation

**Public site top navigation:** Home | Halls | Facilities | Virtual Tour / Gallery | About / Visit | FAQs | Contact. Primary CTA: **Enquire / Request a Booking**. Add a persistent but unobtrusive call/WhatsApp action on mobile.

**Management sidebar:** Overview, Enquiries, Booking Calendar, Bookings, Customers, Event Operations, Finance, Staff, Vendors, Maintenance, Marketing, Reports & Analytics, Documents, AI Copilot, Venue Content & Settings, Users & Permissions, Audit Log. Hide unauthorized modules and enforce access server-side too.

### Reusable UI components

Build shared components for AppShell, PublicHeader/Footer, Sidebar, MobileNav, Breadcrumbs, PageHeader, KPI cards, charts, date-range filters, searchable/filterable/sortable tables, pagination, empty states, skeleton loaders, toast notifications, confirm dialogs, form fields, validated date/time selectors, status badges, document upload, audit history, and responsive modal/drawer. Keep visual and interaction behavior consistent across modules.

---

## 5. Public/customer website — page-by-page specification

### 5.1 Home page (`/`)

Create an impressive, conversion-focused venue homepage using actual venue photos.

1. Top contact strip: both phone numbers, email and location.
2. Main navigation with venue wordmark/name and a prominent request-booking CTA.
3. Hero section with a strong editorial layout, venue exterior/interior photo, concise factual headline, and two CTAs: **Explore the Halls** and **Check Date / Send Enquiry**. Avoid unsupported promises such as “best venue in Kerala.”
4. A compact trust/info row using verified facts: four halls, up to 100 per hall as stated, best suited to gatherings up to 300, AC information, on-site parking stated as 40–50 cars and location at Market Junction.
5. Four hall cards: Stage, Welcome, Dining and Open, with accurate descriptions, floor, AC status and capacity. CTA opens hall detail, not an invented price page.
6. Facility highlights: wash area, grand staircase, solar hybrid power with battery backup, tested well water, parking and sound information with the Open Hall caveat.
7. Event-type inspiration cards: weddings/receptions, seminars, family gatherings, programmes/ceremonies/cultural events—grounded in brochure wording. Do not suggest unverified catering or decoration packages.
8. Gallery / virtual-tour preview using actual photos.
9. Venue location section with address, directions link or embedded map only if configured, and no inaccurate geolocation.
10. FAQ section based on verified facts; unresolved policies should say “Please contact management to confirm.”
11. Strong enquiry CTA and complete contact footer.

### 5.2 Hall directory (`/halls`)

- Display all four halls with photos and side-by-side comparisons.
- Filters: AC/non-AC, floor, guest count range. Filters must be derived from verified hall properties.
- Show **Up to 100 guests (brochure stated)**, not an exact certified occupancy guarantee.
- Explain in appropriate context that the venue is best suited to gatherings of up to 300 guests overall.
- Do not suggest that all four halls can be combined for a 400-person event.

### 5.3 Hall detail (`/halls/:slug`)

For every hall show actual photos, full description, floor, AC status, features, capacity as worded in brochure, relevant event types, gallery, visit/enquiry CTA, and a link to enquire for a specific date. Include image lightbox, keyboard support and useful alt text. Pricing section should be hidden until the business supplies real rates or configured pricing.

### 5.4 Facilities (`/facilities`)

Present wash area, grand staircase, parking, air-conditioning by hall, solar hybrid power/battery backup, tested well water and soundproofing with caveat. Include rooftop changing rooms only with the explicit note: rooftop not open to guests; changing rooms may be arranged on request. Do not list lift, generator, kitchen, accessibility or catering unless later verified.

### 5.5 Gallery / virtual tour (`/gallery` and/or `/tour`)

- Responsive categorized photo gallery: Exterior, Stage Hall, Welcome Hall, Dining Hall, Open Hall, Wash Area, Grand Staircase and facilities, according to available source photos.
- Lightbox with previous/next controls, thumbnails, close button, keyboard support and descriptive alt text.
- A true 360-degree virtual tour may be enabled only when suitable panoramic images/assets exist. Do not fake a 360 tour using ordinary photographs; if panorama assets are absent, build a polished photo-tour presentation and make the 360 upgrade explicitly optional.
- Admin should be able to manage public photos and captions using secure storage, set cover photo, reorder and mark draft/published.

### 5.6 Enquiry / booking request (`/enquire`)

Use a friendly multi-step form with progress indicator, validation, review screen, and clear privacy text. Collect only necessary details:

- Customer name.
- Phone number and email (allow either contact method as business policy permits; make required fields explicit and configurable).
- Event type (select from supported types plus Other).
- Preferred event date.
- Start and end times, or a proposed duration/slot that management can confirm.
- Desired hall or “Not sure yet.”
- Expected guest count.
- Any accessibility, setup or other requirements in a free-text field; do not promise that requirements can be fulfilled before staff review.
- Permission to contact the customer, with a concise privacy notice.

Workflow:
1. Validate client-side and server-side.
2. Check format and plausible date/time values. Do **not** show date as available unless the backend confirms availability.
3. Save an enquiry (not a confirmed booking), return a unique enquiry reference, and show a confirmation screen.
4. Send email/SMS/WhatsApp notification only if a real provider is configured and delivery succeeds. Otherwise show the reference on screen and tell the customer how to contact the venue.
5. Prevent duplicate accidental submissions with request idempotency or an equivalent double-submit safeguard.
6. Include spam mitigation/rate limits and server-side validation.
7. Avoid requesting or storing card details. A booking enquiry is not a payment transaction.

### 5.7 Contact / visit (`/contact`)

Show address, two numbers, email, location/access statement, directions link using a configured URL, click-to-call and WhatsApp deep links. Do not display opening hours unless supplied. A contact form creates a traceable enquiry.

### 5.8 FAQs (`/faq`)

Suggested topics: hall differences; which halls are AC; guest capacity wording; parking; public transport/location; how to request a booking; how availability is confirmed; rooftop/changing-room rules; soundproofing caveat; facilities. For prices, deposits, cancellation, payment terms, catering, decor, event timings and tax, say the information must be confirmed with management until authoritative policies are configured.

### 5.9 Customer account (optional, implement only if it can be secured end-to-end)

Route `/my` or `/account`: sign in securely, view own enquiries/bookings, quotations and invoices/documents shared with that customer, request a change/cancellation, and manage contact preferences. A customer must never see another customer’s data. If the entire customer portal cannot be completed securely in the first pass, do not expose a partly protected route; mark it as a later phase and keep the public enquiry flow complete.

### Public website footer

Use: **Thekkanath Souparnika · Hall & Events Venue**. Include contact information exactly as listed above, address and primary links. Do not insert an unrelated academic or personal footer. Add privacy notice, terms and accessibility statement pages, with policy placeholders clearly identified for owner review where required.

---

## 6. Authentication, roles and permissions

Use Supabase Auth or a comparably secure identity service. No hard-coded production passwords, shared admin credentials, or client-only role checks.

### Roles

- **Owner / Super Admin:** Full access to all permitted business data, financial summaries, venue settings, team management and audit log.
- **Administrator:** Daily management functions; financial/configuration actions limited by permissions granted by owner.
- **Booking Manager:** Enquiries, customers, quotations, booking calendar, booking workflow and customer communications.
- **Event / Operations Manager:** Confirmed event schedules, checklists, staffing tasks, hall readiness, incidents and maintenance requests.
- **Accounts:** Financial records, receipts, invoices, payments, expenses and financial reports; no unrestricted user-management access.
- **Staff:** Only assigned tasks, relevant schedules and limited customer/event details needed for their duties.
- **Marketing:** Approved venue content, campaign tracking and lead analytics; no unnecessary access to finance or sensitive customer information.
- **Vendor:** Only explicitly shared work orders and the minimum information needed for that work; use vendor accounts only if the workflow is implemented securely.
- **Customer:** Only their own portal records, when portal is implemented.

Implement **least privilege** with granular permissions. Keep authorization logic central and testable. Enforce all important permissions on database/backend operations and with Supabase RLS policies; hiding a button is not sufficient. Protect admin routes, validate sessions, handle logout/expiry, and avoid leaking user/customer details through errors or logs.

The initial owner account must be provisioned via a documented secure procedure or invite flow. Never commit user credentials. Document how to create the first owner safely.

---

## 7. Management dashboard — page-by-page requirements

All records must use shared typed models and persistent storage when the backend is configured. Use clear list/detail/create/edit experiences and provide search, filters, sorting, pagination and export only where appropriate.

### 7.1 Overview (`/admin`)

- Today's events and schedules.
- New/unread enquiries awaiting action.
- Upcoming confirmed bookings.
- Pending quotes and follow-ups.
- Outstanding payment summaries (if payment data exists).
- Revenue, expense and profit widgets only when actual ledger records exist; distinguish actuals from estimates.
- Booking trend, hall utilization, enquiry conversion and payment collection charts.
- Activity/audit feed, quick actions and operational warnings.
- Date-range filter and clear data period on every chart.
- First-run state with setup tasks if no real data exists; if seeded with demo data, display a persistent “Demo data” banner and provide reset instructions.

### 7.2 Enquiries / lead pipeline (`/admin/enquiries`)

- Statuses: New, Contacted, Needs Information, Site Visit Requested/Scheduled, Quotation in Progress, Quoted, Converted to Booking, Lost, Closed. Allow configuration only if transitions remain logically valid.
- Search/filter by date, event type, preferred hall, status and assigned staff.
- Enquiry detail timeline with notes, contact attempts, attachments, next action, follow-up due date and status history.
- Convert enquiry into a booking through a controlled workflow; carry forward details and avoid duplicate customer records.
- Record lost reason for conversion analysis.
- Follow-up reminders, with overdue highlighting. AI may draft text; staff reviews before external sending.

### 7.3 Booking calendar (`/admin/calendar`)

- Day/week/month views; hall lanes or grouped calendars; filter by hall/status/event type.
- Display confirmed bookings distinctly from enquiries, tentative holds and maintenance blocks.
- Detail drawer/modal with booking reference, customer, hall, time, status, payment summary, notes and audit history.
- Create tentative hold only with expiry/owner and clear status; holds must not become permanent conflicts silently.
- Handle time zones explicitly. Venue local timezone should default to **Asia/Kolkata**, unless the owner changes it. Store timestamps consistently (UTC in database) and render in venue timezone.
- Handle overnight events if the business permits them; otherwise disallow with clear validation until policy is configured.
- Prevent conflicts on same hall, including concurrent requests and race conditions. A UI pre-check is helpful but not authoritative.
- Support blocked periods for maintenance/private closures.
- Clearly distinguish hall-level availability from whole-venue availability.

### 7.4 Booking management (`/admin/bookings`)

Suggested booking lifecycle: Enquiry → Reviewing → Tentative hold (optional, time-limited) → Quotation prepared → Quotation sent → Awaiting customer acceptance / advance → Confirmed → Event in progress (optional) → Completed. Alternative endings: Declined, Cancelled, No-show, Refunded (as applicable). Keep stage transitions auditable and prevent invalid jumps.

- Booking reference generated server-side, unique and human-readable.
- Choose one hall by default per booking. Supporting multiple halls for one event may be a later capability; do not overstate combined capacity.
- Store event date, start/end time, hall, customer, event type, headcount, requests, assigned manager, source, status, internal notes and attached approved quote.
- Verify availability before advancing to confirmation.
- Confirmation should require explicit authorized staff action and any configured business conditions. Never invent the required deposit or policy.
- Change/reschedule and cancellation workflows must capture reason and audit history.
- Send customer notifications only through configured providers and only after actual state transitions.

### 7.5 Quotations and document generation

- Create a quote linked to enquiry/booking with a configurable line-item list, quantity, amount, discount and taxes **only after the owner configures these fields/rules**.
- Use INR (₹) as default display currency. Do not add made-up fees, GST percentages or prices.
- Save versioned quotes with status: Draft, Approved Internally, Sent, Accepted, Rejected, Expired.
- Generate downloadable PDF quote only from approved data; show venue identity, customer/event details, line items, totals, terms/policy if configured, validity date and contact details.
- Track who approved/sent each quote and when. Do not claim that email was sent if no delivery provider is connected.
- Store generated documents privately and provide signed/authorized downloads.

### 7.6 Customers / CRM (`/admin/customers`)

- Searchable customer list and detail profile.
- Contact methods, events/enquiries, quotation/booking history, notes, preferred contact method, consent status and follow-up schedule.
- De-duplicate by normalized email/phone carefully; do not merge records automatically when uncertain.
- Restrict access to customer data by staff roles.
- Export customer data only for authorized roles, with audit logging and careful treatment of consent and retention.
- Provide customer data correction/deletion request workflow according to the policy configured by the owner.

### 7.7 Event operations (`/admin/operations`)

- Event run sheet grouped by date/time and hall.
- Event checklist templates: pre-event, setup, event-day, cleanup and post-event. Use editable generic operational tasks, without claiming unconfirmed venue facilities.
- Assign tasks to staff, due dates and priorities; task statuses: To Do, In Progress, Blocked, Done.
- Hall readiness checklist and sign-off.
- Log incidents, damages and follow-up tasks with access limits.
- Attach photos/documents securely.
- Notify staff only if an actual notification adapter is configured; otherwise show in-app tasks.

### 7.8 Finance (`/admin/finance`)

Subsections: Overview, Income/Receipts, Invoices, Payments, Expenses, Suppliers, Refunds/Credits and Reports.

- Store separate concepts for quoted value, amount billed, payments collected, refunds, outstanding receivable, booked revenue and recognized revenue. Do not treat every booking value as cash received or automatically equate receipts with recognized revenue.
- Payment/receipt records should include date, amount, method, reference, linked booking/invoice, recorded by, and status. Cash/manual records need an audit trail and optional attachment.
- Expense records: category, amount, date, vendor, description, payment status/method, recurring flag, linked receipt/document, tax fields only if configured, recorded by and approvals where appropriate.
- Suggested categories, editable by owner: salaries, electricity/utilities, water, cleaning, repairs/maintenance, supplies, marketing, software/telecom, professional services, insurance, taxes/fees and other. Categories are suggestions, not claims about current expenses.
- Distinguish fixed/variable and recurring/one-off expenses when management classifies them.
- Profit-and-loss view must clearly define the calculation and reporting period, avoid double-counting deposits and refunds, and indicate when accounting policies have not been configured.
- Cash-flow view based on actual dated inflows/outflows. Show outstanding balances separately.
- Invoice/receipt PDFs and sequential numbering are configurable. Do not represent generated internal receipts as legally compliant tax invoices without review.
- CSV export restricted to authorized roles; log sensitive exports.
- Support manual data entry first; accounting/tax integrations are optional future integrations.

### 7.9 Staff (`/admin/staff`)

- Staff profile, role, active/inactive status, contact details as necessary, department, assigned tasks and schedule.
- Attendance, shifts and payroll records only when the owner chooses to use them and defines policies. Keep payroll sensitive and role-restricted. Never infer salary values.
- For payroll, create records and reports—not an automatic bank transfer system.

### 7.10 Vendors (`/admin/vendors`)

- Vendor details, service category, contacts, contracts/documents, linked work orders and expense history.
- Do not list vendors publicly by default.
- Vendors should only see work orders explicitly shared with them; implement authenticated vendor access only if authorization is complete.

### 7.11 Maintenance and facility management (`/admin/maintenance`)

- Work requests, priority, affected hall/area, issue description, assigned person/vendor, expected/actual costs, target date, status, before/after attachments and resolution notes.
- Prevent maintenance blocks from conflicting with confirmed bookings unless owner/admin explicitly overrides after conflict resolution.
- Optional utility logs for electricity/water usage only if staff has actual readings; do not invent sensor integrations or automated meter readings.

### 7.12 Marketing (`/admin/marketing`)

- Campaign and referral source tracking; lead-source fields: website, phone, WhatsApp, walk-in, referral, social media, other.
- Track enquiry count, qualified leads, confirmed bookings and observed spend where actual campaign data is entered.
- Calculate conversion and cost metrics with clearly defined formulas and denominators. Do not attribute bookings to campaigns without a tracked source.
- Offer/campaign management only after real offer rules and validity are configured. Do not publish a discount automatically.
- Draft copy with AI if available; human approval required before publishing or sending messages.

### 7.13 Reports & analytics (`/admin/reports`)

Provide filterable period-based reports for:

- Enquiry volume and conversion funnel.
- Booking count and revenue by month/hall/event type/source.
- Hall utilization by available slot/hours, with clearly defined denominator and exclusion of maintenance closures when applicable.
- Average booking value only when quote/booking valuation is consistently recorded.
- Invoices, collections, outstanding balances and aging.
- Income versus expenses and operating margin only after accounting definitions are configured.
- Expense trends by category.
- Cancellation/rescheduling frequency and reasons.
- Marketing campaign performance where data exists.
- Staff task completion and maintenance costs if populated.

Charts must have accessible text summaries, labels, legends, source period and empty states. Every metric needs a documented definition. Add CSV export; PDF export may be provided for key reports. Avoid charts that look impressive but derive from fabricated numbers.

### 7.14 Documents (`/admin/documents`)

- Secure upload with type/size validation, metadata, category, linked customer/booking/vendor, uploader, created time and visibility/access controls.
- Document categories: enquiry attachments, quotations, invoices, receipts, venue assets, vendor documents, maintenance evidence and other.
- Store private business documents in private buckets with RLS or signed URL access. Do not expose public storage links for finance/customer documents.
- Validate mime type and file extension; do not trust client metadata alone.
- Avoid storing unnecessary sensitive identity documents.

### 7.15 Venue content and settings (`/admin/settings`)

Owner/authorized admin can manage:
- Venue name, address, contact numbers, email and configured map/directions link.
- Hall descriptions, floor, capacity wording, AC status, features and photos.
- Site navigation, FAQ content, contact CTA and public site visibility.
- Booking/enquiry settings, timezone, lead statuses, business operating/blocked periods, default slot behavior and temporary-hold expiry.
- Pricing/quote terms only after owner supplies values and approval.
- Tax/accounting settings only after accountant/owner review.
- Email/SMS/WhatsApp/payment/AI provider configuration status (secrets stay in environment or server-side secret store, not editable as plain text in the browser).
- Privacy and retention settings requiring owner review.

Changes to public details should support preview and publish/draft states where practical. Add audit trail for important changes.

### 7.16 Users, permissions and audit log

- Invite users, assign roles and permission presets, suspend access and revoke sessions as supported.
- Log important actions: sign-ins/admin events where appropriate, booking status changes, booking overrides, quotes approved/sent, manual financial entries/adjustments, refunds, exports, permission changes, public content changes and configuration changes.
- Audit event fields: actor, action, target type/id, timestamp, safe metadata/diff, request/correlation ID. Do not log passwords, tokens, complete payment data or sensitive form contents.
- Audit log should be append-only from the app layer and protected against ordinary edits/deletes. Document any database administrator-level limitations.

### 7.17 AI management copilot (`/admin/ai`)

Build the UI and a secure service layer for an optional AI assistant. Suggested questions:
- “Which halls were most used last quarter?”
- “Which expense categories increased this month?”
- “Which enquiries need a follow-up?”
- “Compare weekday and weekend booking conversion.”
- “Model the effect of a proposed marketing budget increase.”

Requirements:
- Use only authorized, relevant data from the application. Enforce the caller's permissions before retrieval/aggregation.
- Use deterministic server-side calculations for amounts, percentages and totals; the language model should explain results, not invent them.
- Show date range, filters, calculation definition and source records/aggregate behind material claims.
- If no real data is available, say so and offer a labelled scenario model; never fabricate historical results.
- Investment scenarios are simulations, not guaranteed outcomes. Show inputs, assumptions, risks and ranges rather than a single guaranteed return.
- Do not send personal customer data or private documents to a third-party model unless the owner has explicitly configured and approved that data flow.
- Apply rate limits, input/output limits, prompt-injection safeguards, allowlisted tools and audit logs.
- The model can suggest actions or prepare drafts; it cannot independently confirm bookings, change prices, issue refunds, send bulk customer messages, change permissions or move money. Require an authorized human approval step for consequential actions.
- When AI provider configuration is absent, render an honest “AI not connected” state and a working, non-AI explainer/demo clearly labeled as such.

---

## 8. Core business workflows

### Workflow A — from enquiry to confirmed booking

1. Visitor submits enquiry on public website.
2. Server validates and saves enquiry with unique reference and timestamp.
3. Enquiry appears in admin queue; authorized staff member owns it.
4. Staff contacts customer and records notes / follow-up.
5. Staff checks hall schedule against confirmed bookings, time-limited holds and maintenance blocks.
6. Staff may create a tentative hold with expiry where policy permits. A hold is not a confirmation.
7. Staff creates a quote from configured pricing/policies; authorized approval is required if configured.
8. Quote is sent only through a configured channel; delivery status is recorded truthfully.
9. Customer acceptance and any configured advance/payment conditions are recorded.
10. Authorized staff confirms booking. Backend rechecks availability atomically before confirmation.
11. Booking appears in calendar and operations schedule; notification is sent only if configured and succeeded.
12. Event is completed; final amounts, refunds/adjustments and feedback can be recorded as supported.

### Workflow B — concurrency/conflict prevention

Database must guarantee that two concurrent requests cannot both confirm overlapping time ranges for the same hall. For PostgreSQL, consider an exclusion constraint on hall ID and a half-open time range (`[start, end)`) using `tstzrange` or an equivalent safe transaction/locking strategy. Document any PostgreSQL extension required and include its migration. If using blocks/holds, include non-expired tentative holds in conflict detection. Expired holds must be ignored/closed predictably. Confirm/override must occur in a single transaction or robust server action, not as separate client requests.

Define overlap rule clearly: `new_start < existing_end AND new_end > existing_start`. Adjacent bookings where new start equals old end do not overlap, unless owner chooses a configured buffer period. Support optional cleanup/setup buffer only after owner configures it. Always validate start < end and block invalid ranges.

### Workflow C — payments and reconciliation

1. Store a payment intent/request only if a real gateway is configured.
2. Verify actual payment state using trusted server-side gateway webhooks or provider verification; never trust a client success redirect.
3. Record successful, pending, failed, refunded and partially refunded events with provider reference, amount and currency.
4. Make webhook processing idempotent.
5. Reconcile against booking/invoice/receipt and keep manual payment entries distinguishable from gateway-collected transactions.
6. Never store raw card numbers, CVV or payment credentials.

The initial version may use manually recorded payments and receipts. Online payment should remain disabled until the owner selects and configures an appropriate provider and verifies refund/accounting behavior.

### Workflow D — notifications

Build an adapter layer for email, SMS or WhatsApp (provider chosen/configured by owner). Store event type, recipient, delivery state, timestamps, retry count and sanitized error. Use background/retry processing if available. Failed sending must not roll back a saved booking or show “sent.” Provide in-app fallback and allow staff to copy a prepared message. Customer marketing messages require appropriate consent and local-law review.

### Workflow E — finance records

1. Authorized staff records a transaction linked to booking/invoice where relevant.
2. Validate amount/date/method and require reference/notes as appropriate.
3. Create an immutable financial transaction/event record; corrections should use reversing/adjustment entries rather than destructive edits for consequential transactions.
4. Aggregate by selected period and clearly distinguish invoiced amount, collected cash, refunds, receivables and modeled/recognized revenue.
5. Record who created or approved it.

---

## 9. Database model and data integrity

Create documented SQL migrations, indexes, constraints and RLS. Normalize where appropriate; do not store all application data in one JSON blob. Use UUID primary keys, `created_at`/`updated_at`, foreign keys, valid status enums or constrained text types, and explicit deletion/archival behavior. Store timestamps consistently and display them in `Asia/Kolkata`.

Required or expected core tables (adjust with reason; include relationships and indexes):

- `profiles` — links authenticated user to profile and role metadata; avoid trusting user-editable role claims.
- `roles`, `permissions`, `role_permissions` or a clear server-side permission model.
- `venue_settings` — configurable venue/public content and policy state, with restricted writes.
- `halls` — slug, name, description, floor, capacity wording/value, AC status, verified features, public visibility, sort order.
- `hall_media` — storage path, caption, alt text, category, order, cover flag, published state.
- `customers` — name/contact/consent and relevant CRM fields.
- `enquiries` — reference, customer, event type, requested date/range, desired hall, headcount, notes, source, status, owner, follow-up and consent metadata.
- `enquiry_activity` — timeline entries, contact attempts, notes, status changes and actor.
- `bookings` — unique reference, hall, customer, event type, start/end, status, headcount, requirements, assignment, source and relevant approved quote linkage.
- `booking_holds` or a unified booking calendar-block model — hold expiry and status; conflict logic includes non-expired holds.
- `calendar_blocks` — maintenance/closure blocks, hall, range, reason and actor.
- `quotes` and `quote_items` — versioned draft/approval/sent/accepted quote records and line items.
- `invoices` and `invoice_items` — only if invoicing workflow is enabled; numbered records, totals and status.
- `payments` — manually recorded and/or provider-backed entries with provider/reference/idempotency data.
- `refunds` or transaction reversals — linked to original payment/transaction.
- `expenses` — amount, category, date, supplier, payment status and attachments.
- `financial_categories` — configurable income/expense categories.
- `vendors` — supplier contacts and status.
- `staff_tasks` / `event_checklists` — event-linked operational tasks.
- `maintenance_requests` — affected area/hall, priority, owner/vendor, dates, status, cost and resolution.
- `campaigns` / `lead_sources` — marketing records, budgets where entered, source attribution.
- `documents` — private file metadata and linked record IDs.
- `notifications` — delivery records for configured adapters.
- `audit_logs` — security and business audit trail.
- `consents` or appropriate consent fields/logs for contact/marketing preferences.
- `ai_runs` or `ai_audit_logs` — sanitized prompt category, action, data range and actor; do not store secrets or unneeded PII.

Use database constraints, foreign keys and server-side validation. Add indexes for hall/date bookings, enquiry statuses, customer search fields, foreign keys, financial periods, task status and audit history. Add safe retention/deletion rules and soft deletion only where appropriate. For essential records, do not cascade-delete financial or booking history accidentally.

### RLS and API safety

- Enable RLS on every table accessible from the client.
- Default deny; grant least privilege based on authenticated identity and database-backed roles.
- Customers see only their own records if a customer portal is implemented.
- Staff see only role-appropriate records; sensitive finance rows are restricted to accounts/authorized roles.
- Public visitors can create an enquiry through a carefully designed restricted server function or API. Do not grant unrestricted public `INSERT`/`SELECT` on customer tables to make the form work.
- Public users can read only published venue/hall/media/FAQ fields.
- Keep privileged/service role keys on the server only.
- Add rate limiting or abuse mitigation to anonymous forms and sensitive endpoints.
- Do not expose internal notes, audit logs, customer lists, financial data, documents or unpublished content through public APIs.
- Add tests attempting cross-customer and cross-role data access.

---

## 10. Search, filtering, validation and UX states

- Tables need working search, column filters, sort and pagination. Preserve filters when returning from record details where reasonable.
- Use server-side pagination/search for large datasets.
- Validate every form on client and server. Provide clear field-level errors and a form-level summary where useful.
- Phone validation must accept Indian numbers without assuming all future customers have the same format. Normalize where safe.
- Dates must reject past dates for new booking enquiries if that is the configured business rule; do not hard-code policy without making it configurable.
- Currency uses INR (`₹`) by default, formatted with the Indian numbering system. Store money as integer paise or a precise numeric database type—never floating-point for ledger calculations.
- Support timezone-aware date/time selection and readable display.
- Every route must have loading, empty, error, success and permission-denied states as applicable.
- Confirm destructive actions. Prefer archive/disable for important entities over accidental permanent deletion.
- Use clear human-readable errors and correlation IDs rather than raw database/provider details.

---

## 11. Security, privacy, reliability and compliance

Implement the following as baseline controls:

- Authenticated, role-based admin access and server-side authorization.
- RLS and least privilege.
- Schema validation, output encoding and safe rendering of user content.
- Prevent SQL injection by using parameterized queries/typed SDK methods.
- Avoid XSS through unsanitized HTML; do not render customer-supplied rich HTML directly.
- CSRF protections when applicable to chosen auth/session approach.
- Rate limiting for public forms, login-sensitive routes and AI usage.
- Secure storage and access control for private documents.
- Environment-managed secrets; never expose secrets in bundles or logs.
- Audit important writes and permission changes.
- Backups and restore guidance for the database and stored documents.
- Sensible session expiry, logout and account invitation procedures.
- Error boundaries, secure generic error messages and server-side diagnostic logs without unnecessary PII.
- Privacy notice and consent capture appropriate to the owner-approved policy; do not claim legal compliance before review.
- Do not store card details. For a payment integration, use provider-hosted checkout and verified webhooks.
- Dependency health, lockfile, no obsolete or suspicious packages, and a clear update process.
- Do not use live customer data or production credentials for local demos/tests.

This app may handle customer and financial information. The owner should review privacy, tax, invoice, payment and retention policies with suitable professionals before production use. The system should support sound practices but not claim to replace legal/accounting review.

---

## 12. Integrations — implement adapters, not fake integrations

### Contact and WhatsApp

Generate correct `tel:` and `mailto:` links. WhatsApp links may open a chat with the listed venue numbers; create prefilled text safely URL-encoded. Never imply a message was sent just because WhatsApp opened.

### Maps

Use the known address as text and use a configurable directions/map link. Do not invent coordinates. If using a map embed, configure it explicitly and ensure it does not block page load.

### Email / SMS

Provide adapter interfaces and environment configuration. Emails should use branded templates for enquiry receipt, enquiry update, quote, booking confirmation, reminder and cancellation, but only send after a successful provider response. Record delivery outcomes honestly.

### Online payment

Optional; keep disabled until chosen provider credentials, supported currencies, webhook verification and refund workflow are configured. Never use a mock payment button in production mode.

### Calendar export

Allow authorized managers to export a calendar event or `.ics` file for a booking. Only include details suitable for the recipient; customer data should not be placed in public calendar feeds.

### AI provider

Server-side adapter only. Use provider keys from environment/secret manager. Add timeouts, safe error states and rate limits. No external AI call if no provider is configured; never silently substitute made-up results.

---

## 13. SEO, performance and content quality

- Set meaningful page titles, meta descriptions, canonical URLs if domain is known, social sharing metadata and favicon/wordmark.
- Structured data for local business/venue only using confirmed facts. Do not insert ratings, prices or opening hours that are not supplied.
- Use descriptive image filenames and alt text.
- Optimize source photos with appropriate dimensions/compression, responsive `srcset` or framework equivalent, lazy-loading below the fold and high-priority loading for the hero image.
- Use code splitting for admin modules and heavy tour/chart libraries.
- Avoid layout shift; reserve image space. Keep animations performant and disable or reduce them when requested by system preferences.
- Meet good Core Web Vitals targets where practical and run a Lighthouse review before release.
- Add a `robots.txt` and sitemap if a production domain is set. Keep admin/customer-private pages out of public indexing.
- No fabricated reviews, testimonials, social proof, “limited slots” pressure tactics or fake notifications.

---

## 14. Test strategy — do not skip

### Unit/component tests

Test utilities and logic including:
- Date range validation and overlap detection.
- Booking status transition rules.
- Currency formatting/precise calculations.
- Financial totals, refunds and outstanding balances.
- Permission predicates and visibility rules.
- Input validation for enquiries, quotes and expenses.
- Form error and success states.

### Integration tests

Test:
- Database access with RLS for each relevant role.
- Public enquiry creation without public access to existing customer/enquiry records.
- Customer record isolation.
- Quote creation/approval state transitions.
- Booking confirmation with concurrent requests for the same hall/time; only one may succeed.
- Holds expire and no longer reserve slots after expiry.
- Maintenance block conflict behavior.
- Payment webhook idempotency if payment integration is enabled.
- Unauthorized financial exports and document access are denied.

### End-to-end tests (Playwright)

At minimum cover:
1. Home page loads and navigation works on desktop and mobile.
2. Visitor explores each hall and submits a valid enquiry.
3. Invalid form values produce helpful validation errors.
4. A duplicate/double click does not create duplicate enquiries.
5. Authorized booking manager signs in and sees the new enquiry.
6. Staff progresses an enquiry, checks availability, creates a quote and only confirms after validation/approval.
7. Same-hall overlapping confirmation is rejected, including a concurrency/race test.
8. Unauthorized user cannot access finance, settings or another customer’s records.
9. Authorized accounts user records payment/expense and summary recalculates accurately.
10. Upload/download permissions work for private documents.
11. Missing external provider config displays a clear disabled state.
12. No critical console errors on the key routes.

Run format/lint/typecheck/tests/build and resolve failures. Do not report a test as passed unless it was actually run. Document anything not run and why.

---

## 15. Implementation order and execution plan

Work in these stages; after each stage run relevant checks and keep the app runnable.

### Stage 1 — Audit and plan

- Inspect repository, mockup, source images and brochure.
- Write `IMPLEMENTATION_PLAN.md`, architecture choices and gaps requiring owner input.
- Create the design tokens and route map.

### Stage 2 — Working frontend foundation

- Set up React/TypeScript/routing/design system/layout/error handling.
- Add public header/footer, responsive shell, management sidebar and shared components.
- Add actual brochure images and verified hall/facility content.
- Build all core public pages, the multi-step enquiry form and responsive layouts.

### Stage 3 — Backend and authentication

- Configure Supabase integration and `.env.example`.
- Add SQL migrations, RLS, core schema, indexes and seed-only demo fixtures.
- Implement sign-in, sign-out, protected routes, role/permission model and first-owner setup guide.
- Never put service-role credentials in client code.

### Stage 4 — Enquiry and booking engine

- Create persisted enquiries, CRM linkage, activity timeline, admin lead queue and customer contact history.
- Implement calendar, tentative holds, maintenance blocks, booking lifecycle and database-level conflict prevention.
- Create quote workflow and PDFs from configured data.

### Stage 5 — Business operations

- Build event operations, tasks/checklists, staff, vendors, maintenance and secure document management.
- Add audit history to important events.

### Stage 6 — Finance and analytics

- Implement payments/receipts and expenses, billing where configured, reconciliation, validated calculations and reporting.
- Add chart metrics only from persisted records or explicitly labelled demo data.

### Stage 7 — External services and AI

- Add provider adapters for email, WhatsApp links/notifications, optional payments, calendar export and AI.
- Keep integrations disabled until configured; test real webhooks safely in sandbox mode.
- Put human approval gates around consequential actions.

### Stage 8 — QA and handover

- Run all test/lint/typecheck/build steps.
- Conduct accessibility, responsive, security and Lighthouse checks.
- Fix broken links, missing image assets, dead buttons, empty modal content, unhandled failures and console errors.
- Produce complete README, env template, database setup, seed/reset instructions, deployment guide, test report and known limitations.

Do not wait for the owner to answer every optional policy question. Build configurable placeholders and clearly list owner decisions needed before the affected feature can be activated. Ask a question only when proceeding safely is genuinely impossible.

---

## 16. Required handover files

Create/update the following:

- `README.md` — prerequisites, setup, environment, dev commands, build, migrations, first-owner creation, demo mode, deployment and troubleshooting.
- `IMPLEMENTATION_PLAN.md` — architecture, routes, modules, milestones and assumptions.
- `.env.example` — variable names with safe placeholders only.
- `supabase/migrations/*.sql` — full schema, extensions, constraints, indexes, RLS policies and safe functions.
- `supabase/seed.sql` — demo-only seed data with a clear label; no fake real-looking financial results in production.
- `docs/DATABASE.md` — ERD or relationship outline, tables and permission model.
- `docs/SECURITY.md` — roles, RLS, secrets, file access, backup/restore and incident notes.
- `docs/DEPLOYMENT.md` — frontend deployment, Supabase deployment, environment setup, domain and post-deploy verification.
- `docs/OWNER_SETUP_CHECKLIST.md` — verified business inputs the owner must provide (prices, policies, hours, payment provider, notification provider, tax configuration, map URL, etc.).
- `docs/TEST_REPORT.md` — exactly what was run, what passed, failures and not-yet-tested items.

If files already exist, update them without destroying user-authored information.

---

## 17. Owner configuration checklist

The following must be flagged as “requires owner input” rather than invented:

- Hall rental rates and package pricing.
- Booking slot definitions, event operating hours and setup/cleanup buffer.
- Hold expiry and what conditions make a booking confirmed.
- Advance payment/deposit amounts, payment deadlines, cancellation/refund policy and no-show rules.
- Whether multiple halls may be linked to one event, with clear maximum occupancy and safety rules.
- Taxes, invoice numbering/legal format and accounting method, reviewed by accountant.
- Authorized management/finance users and permissions.
- Notification/email provider, sender address and approved templates.
- Online payment provider, supported payment/refund flow and verified webhook configuration.
- Google Maps/directions URL and any map API key.
- AI provider, approved data-sharing policy and budget/rate limits.
- Privacy/retention terms, customer consent and business record deletion rules.
- Any additional facilities, accessibility claims, catering, decoration, generator, kitchen or other amenities not listed in the brochure.

App should launch in a useful **pre-configuration state** without exposing invented policy content. Settings pages should identify what is missing and what feature is therefore disabled.

---

## 18. Final acceptance checklist

Before claiming completion, confirm each applicable item:

### Product and UX
- [ ] App runs locally from documented commands.
- [ ] All public routes load, navigate and work responsively.
- [ ] Real brochure photos are used, with correct hall associations and alt text.
- [ ] All four hall descriptions and facilities preserve source nuances.
- [ ] No invented venue details, prices, ratings, policies or fake customer testimonials.
- [ ] Booking form creates an enquiry, not an automatic confirmation.
- [ ] Admin modules have meaningful list/detail/create/edit workflows or are explicitly marked as later/disabled—not fake working controls.
- [ ] Loading, empty, error, success and permission-denied states are implemented.
- [ ] Keyboard navigation, visible focus, labels and reduced-motion support are present.

### Backend and security
- [ ] Database migrations can be applied from a clean environment.
- [ ] RLS is enabled and tested for every client-accessible table.
- [ ] Role permissions are enforced server-side/database-side.
- [ ] Private files are not publicly readable.
- [ ] First-owner account procedure does not use a hard-coded password.
- [ ] Booking overlap protection is enforced transactionally in the backend/database.
- [ ] Holds expire correctly and maintenance blocks are considered.
- [ ] Important actions have audit logs.
- [ ] Secrets never appear in the frontend bundle or Git history.

### Finance and integrations
- [ ] Money calculations avoid floating-point rounding errors.
- [ ] Receipts, outstanding amounts, refunds and forecasts are distinct concepts.
- [ ] No taxes/prices/policies are fabricated.
- [ ] Email/payment/AI states accurately reflect whether the provider is configured and the action succeeded.
- [ ] Payment webhooks (if enabled) are verified and idempotent.
- [ ] Demo mode is visibly distinguished from production and demo fixtures are safely removable.

### Testing and release
- [ ] Lint, typecheck, unit tests and production build have been run.
- [ ] Key Playwright flows have been run or documented as blocked.
- [ ] No critical console errors on main routes.
- [ ] README, deployment guide, security notes, database documentation and test report are included.
- [ ] All owner-dependent decisions are listed in `docs/OWNER_SETUP_CHECKLIST.md`.

At the end, report: (1) modules completed, (2) commands/tests run and their actual results, (3) exact setup instructions, (4) environment variables that still need values, (5) any incomplete features and why, and (6) owner decisions needed before production. Never describe an unimplemented or untested capability as complete.

---

## 19. Start now

Start by inspecting the current workspace and the provided brochure/mockup. Then create the implementation plan and implement the app in this order: design system and real public website → enquiry + authenticated admin foundation → secure booking engine → operations and finance → reports and AI adapters → testing and deployment docs.

**Do not return only a plan or instructions. Make the code changes in the workspace.** Keep the development server/build working as you proceed. Where credentials or policy decisions are missing, implement safe, clearly labelled configuration states and continue with the rest of the application.
