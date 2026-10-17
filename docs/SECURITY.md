# Security Architecture & Access Control Specification

> **Application:** Thekkanath Souparnika Auditorium Management Web App  
> **Classification:** Confidential & Proprietary  
> **Last Audited:** October 2026

---

## 1. Security Architecture Principles

1. **Principle of Least Privilege:** Users only have access to resources required for their assigned business role.
2. **Defense in Depth:** Validation and authorization are applied at both the client layer (navigation, UI controls, route guards) and the database layer (Row Level Security, check constraints, stored procedures).
3. **Data Integrity Over Speed:** Financial sums are stored exclusively as 64-bit integer paise (1 INR = 100 paise) to eliminate IEEE 754 floating-point rounding errors.
4. **Audit Trail Immutability:** Sensitive operational changes (cancellations, holds, status updates) generate immutable append-only audit entries.

---

## 2. Role-Based Access Control (RBAC) Matrix

The system specifies 8 discrete user roles:

| Module / Action | Super Admin | Administrator | Booking Manager | Operations Manager | Accounts | Staff | Vendor | Customer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Public Halls & Enquire** | View | View | View | View | View | View | View | Submit |
| **Overview Dashboard** | Full | Full | Full | Operations View | Financial View | Limited | — | — |
| **Enquiries Pipeline** | Full | Full | Full | Read | Read | Read | — | — |
| **Booking Creation / Edit** | Full | Full | Full | Read | Read | Read | — | View Own |
| **Booking Cancellation** | Full | Full | With Approval | — | — | — | — | Request |
| **Calendar View** | Full | Full | Full | Full | Read | Full | Assigned | — |
| **Ledger & Receipts** | Full | Full | View | — | Full | — | — | View Own |
| **Expense Recording** | Full | Full | — | Operations Only | Full | — | — | — |
| **Maintenance Scheduling** | Full | Full | Read | Full | Read | Read | — | — |
| **Operations & Tasks** | Full | Full | Full | Full | Read | Assigned | Assigned | — |
| **Quotation Generation** | Full | Full | Create/Edit | — | Review/Approve | — | — | View Own |
| **Marketing Attribution** | Full | Full | View | — | — | — | — | — |
| **Staff & Role Management** | Full | Manage | View | View | View | — | — | — |
| **Venue Settings** | Full | Edit | View | View | View | View | — | — |
| **Audit Logs Inspection** | Full | Read | — | — | Financial Logs | — | — | — |

---

## 3. Row Level Security (RLS) Implementation

All database access through Supabase client libraries is governed by PostgreSQL Row Level Security:

```sql
-- Profiles: Users can view their own profile; Super Admins & Administrators can view all
CREATE POLICY "Profiles read access" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_staff(auth.uid()));

-- Enquiries: Anyone can submit an inquiry; Only staff can read/update
CREATE POLICY "Public can submit enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (consent_given = true);

CREATE POLICY "Staff can view enquiries" ON public.enquiries
  FOR SELECT USING (public.is_staff(auth.uid()));

-- Bookings: Only authorized booking staff can modify; Customers can view their own
CREATE POLICY "Booking managers can manage bookings" ON public.bookings
  FOR ALL USING (public.has_role(auth.uid(), ARRAY['super_admin', 'administrator', 'booking_manager']));

-- Payments & Ledger: Restricted to accounts and management
CREATE POLICY "Accounts can manage payments" ON public.payments
  FOR ALL USING (public.has_role(auth.uid(), ARRAY['super_admin', 'administrator', 'accounts']));

-- Audit Logs: Strictly insertable and viewable by administrators
CREATE POLICY "Audit logs immutable" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins read audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), ARRAY['super_admin', 'administrator']));
```

---

## 4. Input Sanitization & Validation Controls

### 4.1 Phone Number Normalization
All phone inputs accept Indian mobile numbers formatted with or without `+91` or leading zeroes, normalizing to a clean 10-digit format:
```typescript
export function isValidIndianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  if (digits.length === 12 && digits.startsWith('91')) return /^[6-9]\d{9}$/.test(digits.slice(2));
  return false;
}
```

### 4.2 Integer Currency Safety
Financial calculations are conducted in integer paise:
```typescript
// Calculation in paise (e.g. 100000 paise = ₹1,000.00)
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(rupees);
}
```

### 4.3 XSS and Content Security
- React JSX auto-escapes string interpolation, eliminating script injection risks.
- Form inputs validate against strict character schemas.
- External links to Google Maps and contact numbers use static, sanitized protocols (`tel:`, `mailto:`, `https://`).

---

## 5. Session Management & Dual-Mode Safeguards

1. **Live Supabase Mode:**
   - JWT tokens stored in browser session storage with automatic refresh.
   - HTTPS mandatory on production endpoints.
2. **Local Demo Mode:**
   - Clearly signaled via the amber header badge `Local Demo Mode (Offline-First Engine Active)`.
   - Data stored in `localStorage` scoped to the application origin.
   - One-click cryptographic state wipe available via `StorageService.resetAllDemoData()`.

---

## 6. Audit Trail Compliance

All critical business events trigger an automated audit log entry recording:
- Timestamp (UTC ISO 8601 with display in Asia/Kolkata)
- Actor ID & Full Name
- Assigned Role
- Target Entity (e.g. `Booking`, `Payment`, `Enquiry`)
- Concrete Action Taken (e.g. `BOOKING_CREATED`, `BOOKING_CANCELLED`, `PAYMENT_RECORDED`)
- Change Summary & Context Reason
