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


