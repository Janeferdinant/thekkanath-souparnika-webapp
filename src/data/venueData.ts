import { Hall, Facility } from '../types/models';

export const VENUE_INFO = {
  name: 'Thekkanath Souparnika',
  descriptor: 'Hall & Events Venue',
  tagline: 'A warm, traditional venue for family celebrations in Thrissur',
  address: {
    street: 'Opposite RGLP School, Market Junction',
    locality: 'Nellikunnu',
    city: 'Thrissur',
    pincode: '680005',
    state: 'Kerala',
    country: 'India',
    fullFormatted: 'Opposite RGLP School, Market Junction, Nellikunnu, Thrissur – 680005, Kerala, India',
  },
  phones: ['8129764370', '9446143165'],
  displayPhones: ['+91 81297 64370', '+91 94461 43165'],
  email: 'thekkanathsouparnika@gmail.com',
  emails: ['thekkanathsouparnika@gmail.com', 'nallengara@gmail.com'],
  owner: 'Ferdinant Nallengara',
  ownerTitle: 'Owner | Thekkanath Souparnika',
  accessNotes: 'Located right at the Market Junction bus stop along the PWD bus route in Nellikunnu, with quick highway access.',
  capacityNotes:
    'Whether hosting an intimate gathering or a celebration of up to 400 guests, Thekkanath Souparnika is booked exclusively for your event. The venue is arranged across four coordinated spaces—ideal for 250 to 300 guests—including three air-conditioned halls with 100 seats each, and a dedicated dining hall seating 100 guests per batch.',
  parkingNotes:
    'Dedicated on-site compound parking accommodates 40–50 cars inside the premises.',
  rooftopPolicy:
    'The 4,000 sq ft truss-roofed rooftop is kept closed to guests for safety. Private dress-change rooms can be arranged there upon prior request.',
  googleMapsQuery: 'Thekkanath+Souparnika+Nellikunnu+Thrissur',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Thekkanath+Souparnika+Nellikunnu+Thrissur',
  whatsappUrl:
    'https://wa.me/918129764370?text=Hello%20Thekkanath%20Souparnika%20Team%2C%20I%20would%20like%20to%20enquire%20about%20event%20booking.',
};

export const HALLS: Hall[] = [
  {
    id: 'auditorium',
    slug: 'auditorium',
    name: 'Thekkanath Souparnika (Full Hall)',
    floor: 'Unified Venue (All Levels)',
    capacityText: 'Ideal for 250 to 300 guests (Up to 400)',
    capacityNumber: 400,
    airConditioned: true,
    coverImage: '/assets/venue/venue-000.jpg',
    galleryImages: [
      '/assets/venue/venue-000.jpg',
      '/assets/venue/venue-001.jpg',
      '/assets/venue/venue-002.jpg',
      '/assets/venue/venue-003.jpg',
      '/assets/venue/venue-004.jpg',
    ],
    description:
      'Thekkanath Souparnika is booked exclusively as a single unified venue for your event. Your family enjoys private, complete access to all four spaces: Stage Hall, Welcome Hall, First Floor Dining Hall (ideal for traditional feasts and sadhya), and the Open Hall. Well-suited for any celebration, and ideally arranged for gatherings of 250 to 300 guests.',
    suggestedUses: [
      'Weddings, Receptions & Banquets',
      'Ceremonies & Traditional Sadhya Feasts',
      'Seminars, Conferences & Cultural Gatherings',
    ],
    features: [
      'Exclusive single-hall booking of entire venue',
      'Stage Hall with 100 cushioned seats arranged',
      'Welcome Hall with 100 seats arranged',
      'First Floor Dining Hall: 100 seats in one sitting',
      'Dedicated on-site parking (40-50 cars)',
    ],
    published: true,
    sortOrder: 0,
  },
  {
    id: 'stage-hall',
    slug: 'stage-hall',
    name: 'Stage Hall',
    floor: 'Ground Floor',
    capacityText: '100 seats arranged',
    capacityNumber: 100,
    airConditioned: true,
    coverImage: '/assets/venue/venue-000.jpg',
    galleryImages: [
      '/assets/venue/venue-000.jpg',
      '/assets/venue/venue-001.jpg',
      '/assets/venue/venue-006.jpg',
    ],
    description:
      'A comfortable air-conditioned ceremonial hall with 100 cushioned seats arranged, an elevated carpeted stage, and soft ambient lighting. Designed for wedding ceremonies, engagements, stage rituals, and cultural presentations.',
    suggestedUses: [
      'Programmes & Cultural Events',
      'Ceremonies & Engagements',
      'Seminars & Presentations',
    ],
    features: [
      'Raised carpeted stage',
      'AC Climate Controlled',
      '100 cushioned seats arranged',
      'Soft ceiling lighting',
      'Ground floor access',
    ],
    published: true,
    sortOrder: 1,
  },
  {
    id: 'welcome-hall',
    slug: 'welcome-hall',
    name: 'Welcome Hall',
    floor: 'Ground Floor',
    capacityText: '100 seats arranged',
    capacityNumber: 100,
    airConditioned: true,
    coverImage: '/assets/venue/venue-001.jpg',
    galleryImages: [
      '/assets/venue/venue-001.jpg',
      '/assets/venue/venue-006.jpg',
      '/assets/venue/venue-005.jpg',
    ],
    description:
      'An air-conditioned ground-floor reception area with a glass-door entrance and 100 comfortable seats arranged along the perimeter. Ideal for receiving arriving guests, family introductions, and refreshments before the main program.',
    suggestedUses: [
      'Guest Reception & Welcome Area',
      'Pre-event Gatherings',
      'High-tea & Refreshment Breakouts',
    ],
    features: [
      'Glass-door main entrance',
      'AC Climate Controlled',
      '100 cushioned seats arranged',
      'Ground floor access',
      'Welcoming ambiance',
    ],
    published: true,
    sortOrder: 2,
  },
  {
    id: 'dining-hall',
    slug: 'dining-hall',
    name: 'Dining Hall',
    floor: 'First Floor',
    capacityText: 'In one sitting 100 seats',
    capacityNumber: 100,
    airConditioned: true,
    coverImage: '/assets/venue/venue-002.jpg',
    galleryImages: [
      '/assets/venue/venue-002.jpg',
      '/assets/venue/venue-004.jpg',
      '/assets/venue/venue-005.jpg',
    ],
    description:
      'Air-conditioned first-floor banquet dining hall with 100 seats arranged per sitting at traditional banquet tables, with large breezy windows and direct access to the handwash area. Tailored for traditional Kerala sadhya and buffet dining, ensuring smooth batch service for 250 to 300+ guests.',
    suggestedUses: [
      'Traditional Kerala Sadhya (Batch Feasts)',
      'Wedding Feasts & Banquets',
      'Post-Ceremony Receptions',
    ],
    features: [
      'In one sitting 100 seats',
      'Recommended for Feast / Sadhya',
      'AC Climate Controlled',
      'Direct access to wash area',
      'First floor via grand staircase',
    ],
    published: true,
    sortOrder: 3,
  },
  {
    id: 'open-hall',
    slug: 'open-hall',
    name: 'Open Hall',
    floor: 'Ground / Mezzanine (Terrace Level)',
    capacityText: '100 seats arranged',
    capacityNumber: 100,
    airConditioned: false,
    coverImage: '/assets/venue/venue-003.jpg',
    galleryImages: [
      '/assets/venue/venue-003.jpg',
      '/assets/venue/venue-006.jpg',
    ],
    description:
      'A bright, open gathering space with 100 seats arranged, polished marble-finish flooring, ceiling fans, and three exhaust fans for continuous fresh airflow. Naturally ventilated and flexible for extra seating, buffet counters, or open family mingling.',
    suggestedUses: [
      'Flexible Social Functions',
      'Community & Family Gatherings',
      'Informal Receptions & Exhibits',
    ],
    features: [
      '100 seats arranged',
      'Naturally Ventilated with exhaust airflow',
      'Polished marble-finish flooring',
      'High-velocity ceiling fans',
      'Open plan adaptable layout',
    ],
    soundproofingNotes:
      'Please note: Open Hall is naturally ventilated; sound can pass through the three exhaust fans. Municipal decibel guidelines apply.',
    published: true,
    sortOrder: 4,
  },
];

export const FACILITIES: Facility[] = [
  {
    id: 'wash-area',
    title: 'Dedicated Handwash Area',
    category: 'Hygiene & Comfort',
    description:
      'Multiple stainless and ceramic wash basins with mirrors, natural ventilation, and continuous water supply, positioned right beside the dining hall for smooth feast service.',
    badge: 'Hygienic Setup',
    iconName: 'Droplets',
  },
  {
    id: 'grand-staircase',
    title: 'Grand Staircase',
    category: 'Architecture',
    description:
      'Wide architectural staircase with polished steps and modern glass railings connecting the ground floor to the upper dining hall. Equipped with a safety hose reel on the landing.',
    badge: 'Safety Equipped',
    iconName: 'Footprints',
  },
  {
    id: 'solar-power',
    title: 'Solar Hybrid Power with Battery',
    category: 'Power Continuity',
    description:
      'Reliable solar-hybrid power system with battery backup, ensuring lighting, fans, and sound systems stay uninterrupted even during local grid power cuts.',
    badge: 'Eco-Friendly',
    iconName: 'Zap',
  },
  {
    id: 'tested-water',
    title: 'Water Authority Tested Well Water',
    category: 'Safety & Health',
    description:
      'Naturally fresh well water tested and approved for drinking and cooking safety by the Kerala Water Authority.',
    badge: 'Authority Approved',
    iconName: 'ShieldCheck',
  },
  {
    id: 'on-site-parking',
    title: 'On-Site Parking (40–50 Cars)',
    category: 'Access & Logistics',
    description:
      'Dedicated on-site parking for 40 to 50 cars directly inside the venue compound, with easy entry and exit right at Market Junction.',
    badge: '40–50 Cars On-Site',
    iconName: 'Car',
  },
  {
    id: 'rooftop-changing',
    title: 'Dress-Change Rooms (On Request)',
    category: 'Special Facilities',
    description:
      'While the rooftop area is kept closed to guests for safety, private dress-change rooms can be arranged on the rooftop level upon advance request.',
    badge: 'Arranged on Request',
    iconName: 'Sparkles',
  },
  {
    id: 'highway-access',
    title: 'PWD Route & Highway Access',
    category: 'Connectivity',
    description:
      'Strategically positioned right at Market Junction in Nellikunnu, directly on the PWD bus route and opposite RGLP School with swift access to the Thrissur highway network.',
    badge: 'Central Location',
    iconName: 'MapPin',
  },
  {
    id: 'air-conditioning',
    title: 'Air-Conditioned Comfort',
    category: 'Climate Control',
    description:
      'Three dedicated halls (Stage Hall, Welcome Hall, and Dining Hall) are fully air-conditioned to ensure complete comfort in all Kerala weather conditions.',
    badge: '3 AC Halls',
    iconName: 'Wind',
  },
];

export const FAQS = [
  {
    question: 'How many guests can Thekkanath Souparnika accommodate?',
    answer:
      'Our hall is available for booking for any number of guests. It is ideally arranged for gatherings of 250 to 300 guests, and can comfortably accommodate up to 400 guests across its coordinated spaces. Each hall has 100 seats arranged, with the First Floor Dining Hall providing 100 seats in one sitting for traditional feast service.',
  },
  {
    question: 'Can individual halls be booked separately?',
    answer:
      'No, there are no separate halls for rental. Thekkanath Souparnika is rented exclusively as a single unified hall venue for your event, ensuring full privacy and coordinated access to all spaces (Stage Hall, Welcome Hall, First Floor Dining Hall, and Open Hall).',
  },
  {
    question: 'Which halls are equipped with air conditioning?',
    answer:
      'Three of the halls (Stage Hall, Welcome Hall, and Dining Hall) are fully air-conditioned. The Open Hall is naturally ventilated with ceiling fans and three exhaust fans.',
  },
  {
    question: 'What is the parking capacity?',
    answer:
      'Dedicated on-site parking is available for 40–50 cars directly inside the venue compound.',
  },
  {
    question: 'How do I confirm date availability and rates?',
    answer:
      'Submitting an enquiry via our website or calling our management team initiates a date check. Booking confirmation requires verification of schedule and mutually agreed details with management.',
  },
  {
    question: 'Can guests access the rooftop area?',
    answer:
      'No, the 4,000 sq ft truss-roofed rooftop is strictly closed to event guests for safety. However, private air-conditioned dress-change rooms can be arranged on the rooftop floor upon prior request.',
  },
  {
    question: 'Is the Open Hall soundproofed?',
    answer:
      'All enclosed halls feature acoustic insulation. Please note that sound can pass naturally through the Open Hall’s three exhaust fans, and municipal evening decibel guidelines apply.',
  },
  {
    question: 'What power backup is in place?',
    answer:
      'The venue features an advanced solar hybrid electrical system with dedicated battery backup, ensuring uninterrupted event lighting and continuity.',
  },
];
