import { Hall, Facility } from '../types/models';

export const VENUE_INFO = {
  name: 'Thekkanath Souparnika',
  descriptor: 'Hall & Events Venue',
  tagline: 'Refined celebration spaces in Nellikunnu, Thrissur',
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
  accessNotes: 'On the PWD bus route, at Market Junction bus stop in Nellikunnu, with direct highway access.',
  capacityNotes:
    'Our hall is available for booking for any number of guests; ideally suited for gatherings of 250 to 300 guests (accommodating up to 400). The venue is booked exclusively as a single hall with four coordinated spaces: three air-conditioned halls with 100 seats arranged each, and the dining hall featuring 100 seats in one sitting.',
  parkingNotes:
    'Dedicated on-site parking accommodates 40–50 cars inside the compound.',
  rooftopPolicy:
    'The 4,000 sq ft truss-roofed rooftop is strictly closed to guests. Private dress-change rooms can be arranged there on request.',
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
      'Thekkanath Souparnika is booked exclusively as a single unified hall for your event. Complete private access includes Stage Hall, Welcome Hall, First Floor Dining Hall (ideal for feasts & sadhya), and Upper Open Hall. Available for booking for any number of guests, ideally suited for gatherings of 250 to 300 people.',
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
      'A dedicated ceremonial space with 100 cushioned seats arranged, featuring a raised carpeted stage and warm ambient ceiling lighting. Climate-controlled with central air conditioning for focused ceremonies, presentations, and cultural programmes.',
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
      'The ground floor reception foyer features an inviting glass-door entrance with 100 cushioned seats arranged along the sides, designed to provide a warm and gracious welcome for arriving guests.',
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
      'Spacious air-conditioned first floor dining hall with 100 seats arranged in one sitting at long banquet tables, with large perimeter windows. Recommended for traditional Kerala sadhya and banquet feasts, allowing smooth batch service for 250 to 300+ guests.',
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
      'A wide, bright space with 100 seats arranged, polished marble-finish flooring, ceiling fans, and three exhaust fans for active airflow. Naturally ventilated and highly adaptable for flexible layouts, informal gatherings, and open dining.',
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
    title: 'Dedicated Wash Area',
    category: 'Hygiene & Comfort',
    description:
      'A long row of stainless/ceramic wash basins with wall mirrors, abundant natural light, and cross-ventilation for guest convenience during feasts and events.',
    badge: 'Hygienic Setup',
    iconName: 'Droplets',
  },
  {
    id: 'grand-staircase',
    title: 'Grand Staircase',
    category: 'Architecture',
    description:
      'Wide architectural staircase with polished steps and modern glass railings connecting the ground floor to the upper dining hall. Equipped with a fire-safety hose reel on the landing.',
    badge: 'Safety Equipped',
    iconName: 'Footprints',
  },
  {
    id: 'solar-power',
    title: 'Solar Hybrid Power with Battery',
    category: 'Power Continuity',
    description:
      'Eco-friendly solar hybrid power system with dedicated battery backup, engineered to ensure uninterrupted lighting and critical event operations.',
    badge: 'Eco-Friendly',
    iconName: 'Zap',
  },
  {
    id: 'tested-water',
    title: 'Water Authority Tested Well Water',
    category: 'Safety & Health',
    description:
      'Pure well water supply that has been independently tested and approved by the Kerala Water Authority for hygiene and drinking safety.',
    badge: 'Authority Approved',
    iconName: 'ShieldCheck',
  },
  {
    id: 'on-site-parking',
    title: 'On-Site Parking (40–50 Cars)',
    category: 'Access & Logistics',
    description:
      'Spacious on-site parking for 40 to 50 cars directly within the venue compound. Highway access makes arrival straightforward for out-of-town guests.',
    badge: '40–50 Cars On-Site',
    iconName: 'Car',
  },
  {
    id: 'rooftop-changing',
    title: 'Dress-Change Rooms (On Request)',
    category: 'Special Facilities',
    description:
      'The 4,000 sq ft truss-roofed rooftop is strictly closed to guests; however, dedicated private dress-change rooms can be arranged on the rooftop level upon prior request.',
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
