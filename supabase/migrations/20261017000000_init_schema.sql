-- Thekkanath Souparnika: PostgreSQL Database Schema & RLS Migrations
-- Authoritative Spec: Thekkanath_Souparnika_Antigravity_Full_App_Build_Prompt.md

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. Profiles & Roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'administrator', 'booking_manager', 'operations_manager', 'accounts', 'staff', 'vendor', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Venue Settings
CREATE TABLE IF NOT EXISTS public.venue_settings (
  id TEXT PRIMARY KEY DEFAULT 'core-settings',
  venue_name TEXT NOT NULL DEFAULT 'Thekkanath Souparnika',
  descriptor TEXT NOT NULL DEFAULT 'Hall & Events Venue',
  street_address TEXT NOT NULL DEFAULT 'Opposite RGLP School, Market Junction',
  locality TEXT NOT NULL DEFAULT 'Nellikunnu',
  city TEXT NOT NULL DEFAULT 'Thrissur',
  pincode TEXT NOT NULL DEFAULT '680005',
  state TEXT NOT NULL DEFAULT 'Kerala',
  country TEXT NOT NULL DEFAULT 'India',
  primary_phone TEXT NOT NULL DEFAULT '8129764370',
  secondary_phone TEXT NOT NULL DEFAULT '9446143165',
  email TEXT NOT NULL DEFAULT 'thekkanathsouparnika@gmail.com',
  maps_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Halls (Verified 4 spaces from brochure)
CREATE TABLE IF NOT EXISTS public.halls (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  floor TEXT NOT NULL,
  capacity_text TEXT NOT NULL DEFAULT 'Up to 100 guests (brochure stated)',
  capacity_number INT NOT NULL DEFAULT 100 CHECK (capacity_number <= 100),
  air_conditioned BOOLEAN NOT NULL DEFAULT true,
  cover_image TEXT NOT NULL,
  description TEXT NOT NULL,
  soundproofing_notes TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Customers (CRM)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  address TEXT,
  total_bookings INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  event_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  preferred_hall_id TEXT REFERENCES public.halls(id) ON DELETE SET NULL,
  estimated_guests INT NOT NULL CHECK (estimated_guests <= 300),
  special_requests TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'needs_info', 'site_visit_scheduled', 'quotation_in_progress', 'quoted', 'converted_to_booking', 'lost', 'closed')),
  lost_reason TEXT,
  assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT NOT NULL UNIQUE,
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  hall_id TEXT NOT NULL REFERENCES public.halls(id) ON DELETE RESTRICT,
  hall_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  guest_count INT NOT NULL CHECK (guest_count <= 300),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('tentative_hold', 'reviewing', 'quotation_sent', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  hold_expires_at TIMESTAMPTZ,
  total_agreed_paise BIGINT,
  advance_paid_paise BIGINT DEFAULT 0,
  special_requirements TEXT,
  assigned_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_booking_time CHECK (start_time < end_time)
);

-- 7. Maintenance Blocks
CREATE TABLE IF NOT EXISTS public.maintenance_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hall_id TEXT NOT NULL REFERENCES public.halls(id) ON DELETE RESTRICT,
  hall_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  title TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  assigned_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_maintenance_dates CHECK (start_date <= end_date AND start_time < end_time)
);

-- 8. Payments & Receipts
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT NOT NULL UNIQUE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  booking_reference TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'upi', 'cheque')),
  transaction_reference TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'refunded')),
  notes TEXT,
  recorded_by TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Expenses
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN (
    'Utilities (Electricity/Water)',
    'Salaries & Wages',
    'Repairs & Maintenance',
    'Cleaning & Housekeeping',
    'Supplies & Consumables',
    'Marketing & Promotion',
    'Software & Telecom',
    'Insurance & Taxes',
    'Other'
  )),
  description TEXT NOT NULL,
  amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
  vendor_name TEXT,
  expense_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending')),
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Staff Tasks
CREATE TABLE IF NOT EXISTS public.staff_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  hall_name TEXT,
  assigned_to TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  stage TEXT NOT NULL DEFAULT 'setup' CHECK (stage IN ('pre_event', 'setup', 'event_day', 'cleanup', 'post_event')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'blocked', 'done')),
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Vendors
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Quotations
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT NOT NULL UNIQUE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  hall_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  subtotal_paise BIGINT NOT NULL,
  discount_paise BIGINT DEFAULT 0,
  tax_paise BIGINT DEFAULT 0,
  total_paise BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved_internally', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until DATE NOT NULL,
  approved_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('quotation', 'receipt', 'contract', 'maintenance', 'brochure', 'license')),
  file_size TEXT NOT NULL,
  storage_path TEXT,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Audit Logs (Immutable business action log)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =========================================================================
-- ATOMIC CONCURRENCY FUNCTION: PREVENT SAME-HALL BOOKING OVERLAPS
-- =========================================================================
CREATE OR REPLACE FUNCTION public.check_hall_booking_conflict(
  p_hall_id TEXT,
  p_event_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INT;
BEGIN
  -- Check overlapping confirmed bookings on the same hall & date
  -- Rule: new_start < existing_end AND new_end > existing_start
  SELECT COUNT(*) INTO conflict_count
  FROM public.bookings
  WHERE hall_id = p_hall_id
    AND event_date = p_event_date
    AND status IN ('confirmed', 'in_progress', 'quotation_sent')
    AND (p_exclude_booking_id IS NULL OR id <> p_exclude_booking_id)
    AND (p_start_time < end_time AND p_end_time > start_time);

  IF conflict_count > 0 THEN
    RETURN TRUE;
  END IF;

  -- Check maintenance blocks
  SELECT COUNT(*) INTO conflict_count
  FROM public.maintenance_blocks
  WHERE hall_id = p_hall_id
    AND start_date <= p_event_date AND end_date >= p_event_date
    AND status <> 'completed'
    AND (p_start_time < end_time AND p_end_time > start_time);

  IF conflict_count > 0 THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Access Policies
CREATE POLICY "Public can view published halls" ON public.halls FOR SELECT USING (published = true);
CREATE POLICY "Public can view venue settings" ON public.venue_settings FOR SELECT USING (true);
CREATE POLICY "Public can insert booking enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Authenticated Staff Policies
CREATE POLICY "Staff can view enquiries" ON public.enquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff can manage bookings" ON public.bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can manage customers" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can manage maintenance" ON public.maintenance_blocks FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can view tasks" ON public.staff_tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can view vendors" ON public.vendors FOR ALL TO authenticated USING (true);
CREATE POLICY "Accounts and admin can view finance" ON public.payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Accounts and admin can view expenses" ON public.expenses FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can view documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Audit logs append only" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Audit logs readable by admin" ON public.audit_logs FOR SELECT TO authenticated USING (true);
