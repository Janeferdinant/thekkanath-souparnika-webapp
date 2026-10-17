-- Thekkanath Souparnika: Sample Seed Fixtures
-- Authoritative Spec: Thekkanath_Souparnika_Antigravity_Full_App_Build_Prompt.md
-- All sample records are clearly labeled as sample fixtures.

-- 1. Venue Core Settings (Verified from brochure)
INSERT INTO public.venue_settings (
  id, venue_name, descriptor, street_address, locality, city, pincode, state, country,
  primary_phone, secondary_phone, email, maps_url, timezone
) VALUES (
  'core-settings',
  'Thekkanath Souparnika',
  'Hall & Events Venue',
  'Opposite RGLP School, Market Junction',
  'Nellikunnu',
  'Thrissur',
  '680005',
  'Kerala',
  'India',
  '8129764370',
  '9446143165',
  'thekkanathsouparnika@gmail.com',
  'https://maps.google.com/?q=Thekkanath+Souparnika+Nellikunnu+Thrissur',
  'Asia/Kolkata'
) ON CONFLICT (id) DO UPDATE SET
  venue_name = EXCLUDED.venue_name,
  street_address = EXCLUDED.street_address,
  primary_phone = EXCLUDED.primary_phone,
  secondary_phone = EXCLUDED.secondary_phone,
  email = EXCLUDED.email;

-- 2. Halls (Strictly 4 verified spaces from brochure, up to 100 capacity each)
INSERT INTO public.halls (
  id, slug, name, floor, capacity_text, capacity_number, air_conditioned, cover_image, description, soundproofing_notes, published, sort_order
) VALUES 
(
  'hall-stage',
  'stage-hall',
  'Stage Hall',
  'First Floor',
  'Up to 100 guests (brochure stated)',
  100,
  true,
  '/assets/venue/venue-000.jpg',
  'Prime air-conditioned ceremonial hall featuring an elevated decorative stage with warm architectural LED focus lighting, audio system support, and comfortable guest seating for wedding rituals, engagements, ring ceremonies, and formal conventions.',
  'Well enclosed with glass windows and heavy drapes. Good acoustic containment for speeches, classical instrumental music, and microphone audio.',
  true,
  1
),
(
  'hall-welcome',
  'welcome-hall',
  'Welcome Hall',
  'Ground Floor',
  'Up to 100 guests (brochure stated)',
  100,
  true,
  '/assets/venue/venue-002.jpg',
  'Air-conditioned ground floor reception lounge offering seamless accessibility for senior family members and guests. Ideal for guest welcoming, registration desks, tea and snacks distribution, family networking, and intimate celebrations.',
  'Ground floor quiet foyer insulated from street traffic noise.',
  true,
  2
),
(
  'hall-dining',
  'dining-hall',
  'Dining Hall',
  'First Floor',
  'Up to 100 guests (brochure stated)',
  100,
  true,
  '/assets/venue/venue-005.jpg',
  'Air-conditioned dedicated banquet dining hall with hygienic stainless-steel/granite service tables, orderly batch-wise seating arrangement, wash stations, and direct connectivity to the catering pantry for traditional Kerala Sadya or buffet banquets.',
  'Enclosed dining zone with acoustic separation from the main ceremonial hall.',
  true,
  3
),
(
  'hall-open',
  'open-hall',
  'Open Hall',
  'Top Floor / Terrace Enclosure',
  'Up to 100 guests (brochure stated)',
  100,
  false,
  '/assets/venue/venue-004.jpg',
  'Naturally ventilated open covered terrace pavilion with perimeter railings, high ceilings, ceiling fans, and refreshing ambient breeze. Suitable for informal receptions, buffet overflow, live beverage counters, and open gatherings.',
  'NOTE: Natural airflow design. Sound passes through 3 large industrial exhaust fans. High-decibel amplified audio should adhere to Thrissur municipal residential silence standards.',
  true,
  4
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  capacity_number = EXCLUDED.capacity_number,
  air_conditioned = EXCLUDED.air_conditioned,
  cover_image = EXCLUDED.cover_image,
  description = EXCLUDED.description,
  soundproofing_notes = EXCLUDED.soundproofing_notes;

-- 3. Sample Customers (CRM)
INSERT INTO public.customers (id, name, phone, email, address, total_bookings, notes)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Dr. Radhakrishnan Pillai', '9847012345', 'dr.radhakrishnan@example.com', 'Ayyanthole, Thrissur', 2, 'Prefers Stage Hall and Dining Hall combination. Prompt payer.'),
  ('a0000000-0000-0000-0000-000000000002', 'Anjali Sreedharan', '9447098765', 'anjali.sreedhar@example.com', 'Chembookkavu, Thrissur', 1, 'Inquired for wedding reception. Family requires ground floor welcome hall access.'),
  ('a0000000-0000-0000-0000-000000000003', 'Mathew Varghese', '9895112233', 'mathew.v@example.com', 'Ollur, Thrissur', 1, 'Corporate symposium organizer for medical association.')
ON CONFLICT (phone) DO NOTHING;

-- 4. Sample Enquiries
INSERT INTO public.enquiries (
  id, reference, customer_name, customer_phone, customer_email, event_type,
  preferred_date, start_time, end_time, preferred_hall_id, estimated_guests,
  special_requests, consent_given, status, notes
) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'TS-ENQ-2026-081',
  'Suresh Namboodiri',
  '9847334455',
  'suresh.namboodiri@example.com',
  'Wedding & Reception',
  '2026-11-28',
  '08:30:00',
  '15:00:00',
  'hall-stage',
  180,
  'Traditional vegetarian Sadya serving in 2 batches of 90 guests. Need dressing room access 1 hr before rituals.',
  true,
  'new',
  'Verified contact number. Follow up on stage backdrop floral requirements.'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'TS-ENQ-2026-082',
  'Pooja Nair',
  '9446887766',
  'pooja.nair@example.com',
  'Family Gathering',
  '2026-12-05',
  '10:00:00',
  '16:00:00',
  'hall-open',
  75,
  'Golden jubilee family reunion. Buffet lunch layout in open hall with ceiling fans.',
  true,
  'site_visit_scheduled',
  'Site visit scheduled for coming Saturday 11 AM.'
)
ON CONFLICT (reference) DO NOTHING;

-- 5. Sample Bookings (With verified conflict-free slots)
INSERT INTO public.bookings (
  id, reference, customer_id, customer_name, customer_phone, customer_email,
  hall_id, hall_name, event_type, event_date, start_time, end_time, guest_count,
  status, total_agreed_paise, advance_paid_paise, special_requirements
) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'TS-BKG-2026-104',
  'a0000000-0000-0000-0000-000000000001',
  'Dr. Radhakrishnan Pillai',
  '9847012345',
  'dr.radhakrishnan@example.com',
  'hall-stage',
  'Stage Hall',
  'Wedding & Reception',
  '2026-11-15',
  '08:00:00',
  '14:00:00',
  100,
  'confirmed',
  4500000,
  1500000,
  'Stage floral backdrop, mic podium, and generator standby requested.'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'TS-BKG-2026-105',
  'a0000000-0000-0000-0000-000000000001',
  'Dr. Radhakrishnan Pillai',
  '9847012345',
  'dr.radhakrishnan@example.com',
  'hall-dining',
  'Dining Hall',
  'Wedding & Reception',
  '2026-11-15',
  '11:00:00',
  '15:30:00',
  100,
  'confirmed',
  2500000,
  1000000,
  'Batch-wise Sadya serving. Catering team arrives at 07:00 AM for preparations.'
)
ON CONFLICT (reference) DO NOTHING;

-- 6. Sample Payments & Receipts (INR in Paise)
INSERT INTO public.payments (
  id, reference, booking_id, booking_reference, customer_name, amount_paise,
  payment_method, transaction_reference, status, notes, recorded_by, received_at
) VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  'TS-REC-2026-091',
  'c0000000-0000-0000-0000-000000000001',
  'TS-BKG-2026-104',
  'Dr. Radhakrishnan Pillai',
  1500000,
  'bank_transfer',
  'NEFT-SBI-499210948',
  'completed',
  'Advance booking deposit for Stage Hall',
  'Priya Nair (Accounts)',
  '2026-10-01 11:30:00+05:30'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'TS-REC-2026-092',
  'c0000000-0000-0000-0000-000000000002',
  'TS-BKG-2026-105',
  'Dr. Radhakrishnan Pillai',
  1000000,
  'bank_transfer',
  'NEFT-SBI-499210949',
  'completed',
  'Advance booking deposit for Dining Hall',
  'Priya Nair (Accounts)',
  '2026-10-01 11:35:00+05:30'
)
ON CONFLICT (reference) DO NOTHING;

-- 7. Sample Expenses
INSERT INTO public.expenses (
  id, category, description, amount_paise, vendor_name, expense_date, payment_method, status, recorded_by
) VALUES
(
  'e0000000-0000-0000-0000-000000000001',
  'Utilities (Electricity/Water)',
  'KSEB Monthly Commercial Power Tariff',
  1845000,
  'Kerala State Electricity Board',
  '2026-10-05',
  'Bank Transfer',
  'paid',
  'Priya Nair'
),
(
  'e0000000-0000-0000-0000-000000000002',
  'Repairs & Maintenance',
  'Blue Star AC Preventive Service & Coil Wash (Stage Hall)',
  780000,
  'Kalyan Cool Services',
  '2026-10-08',
  'UPI',
  'paid',
  'Santhosh Kumar'
);

-- 8. Sample Maintenance Blocks
INSERT INTO public.maintenance_blocks (
  id, hall_id, hall_name, start_date, end_date, start_time, end_time, title, reason, status, assigned_to
) VALUES
(
  'f0000000-0000-0000-0000-000000000001',
  'hall-welcome',
  'Welcome Hall',
  '2026-11-20',
  '2026-11-20',
  '08:00:00',
  '13:00:00',
  'Floor Deep Buffing & Marble Polish',
  'Quarterly lobby maintenance and foyer floor polishing',
  'scheduled',
  'Santhosh Kumar'
);

-- 9. Sample Vendors
INSERT INTO public.vendors (
  id, name, category, contact_person, phone, email, status, notes
) VALUES
(
  '90000000-0000-0000-0000-000000000001',
  'Kalyan Cool Services',
  'HVAC Maintenance',
  'Manoj K.',
  '9447112244',
  'kalyancool@example.com',
  'active',
  'Authorized Blue Star technician for all hall chillers'
),
(
  '90000000-0000-0000-0000-000000000002',
  'Thrissur Power Gen Services',
  'Generator Standby',
  'Vijayan P.',
  '9847223366',
  'powergen@example.com',
  'active',
  'Diesel generator standby, monthly load testing, and emergency fuel refill'
);
