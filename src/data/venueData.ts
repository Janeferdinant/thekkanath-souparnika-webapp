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
    'Whether you are planning a small family ceremony or a grand reception of up to 400 guests, the entire venue is reserved just for your event. The space is arranged across four connected halls—comfortably suited for 250 to 300 guests—with three air-conditioned halls and a dedicated dining hall seating 100 guests per batch.',
  parkingNotes:
    'Dedicated on-site compound parking accommodates 40–50 cars inside the premises.',
  rooftopPolicy:
    'For everyone’s safety, the 4,000 sq ft rooftop is closed to guests, but private dressing and changing rooms can be arranged on the rooftop floor upon request.',
  googleMapsQuery: 'Thekkanath+Souparnika+Nellikunnu+Thrissur',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Thekkanath+Souparnika+Nellikunnu+Thrissur',
  whatsappUrl:
    'https://wa.me/918129764370?text=Hello%20Thekkanath%20Souparnika%20Team%2C%20I%20would%20like%20to%20enquire%20about%20event%20booking.',
};

export const HALLS: Hall[] = [
  {
    id: 'auditorium',
    slug: 'auditorium',
    name: 'Thekkanath Souparnika (Full Venue)',
    floor: 'Entire Venue (All 4 Halls)',
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
      'We host only one celebration at a time. When you book Thekkanath Souparnika, your family gets exclusive, private use of all four halls: the Stage Hall, Welcome Hall, First-Floor Dining Hall (perfect for traditional sadhya), and the Open Hall. Comfortably accommodates 250 to 300 guests, up to 400.',
    suggestedUses: [
      'Weddings, Receptions & Banquets',
      'Ceremonies & Traditional Sadhya Feasts',
      'Seminars, Conferences & Cultural Gatherings',
    ],
    features: [
      'Entire venue exclusively reserved for your event',
      'Stage Hall with 100 cushioned seats',
      'Welcome Hall with 100 seats arranged',
      'First Floor Dining Hall: 100 seats per sitting',
      'Dedicated on-site parking (40–50 cars)',
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
      'A comfortable, air-conditioned ceremonial hall with 100 cushioned seats, a raised carpeted stage, and soft lighting. Built specifically for wedding ceremonies, engagements, and cultural events.',
    suggestedUses: [
      'Programmes & Cultural Events',
      'Ceremonies & Engagements',
      'Seminars & Presentations',
    ],
    features: [
      'Raised carpeted stage',
      'Fully air-conditioned',
      '100 cushioned seats arranged',
      'Soft ceiling lighting',
      'Ground floor access for elders',
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
      'A welcoming air-conditioned reception foyer on the ground floor with wide glass doors and 100 comfortable seats arranged along the perimeter. Ideal for receiving guests, family meetups, and welcome refreshments before the main program.',
    suggestedUses: [
      'Guest Reception & Welcome Area',
      'Pre-event Gatherings',
      'High-tea & Refreshment Breakouts',
    ],
    features: [
      'Wide glass-door main entrance',
      'Fully air-conditioned',
      '100 cushioned seats arranged',
      'Step-free ground floor access',
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
    capacityText: '100 seats per sitting',
    capacityNumber: 100,
    airConditioned: true,
    coverImage: '/assets/venue/venue-002.jpg',
    galleryImages: [
      '/assets/venue/venue-002.jpg',
      '/assets/venue/venue-004.jpg',
      '/assets/venue/venue-005.jpg',
    ],
    description:
      'A spacious, air-conditioned dining hall on the first floor with 100 seats per sitting, long banquet tables, breezy windows, and direct handwash access. Specially planned for traditional Kerala sadhya and buffet feasts, serving 250 to 300+ guests easily in batches.',
    suggestedUses: [
      'Traditional Kerala Sadhya (Batch Feasts)',
      'Wedding Feasts & Banquets',
      'Post-Ceremony Receptions',
    ],
    features: [
      '100 seats per sitting',
      'Ideal for traditional sadhya & feasts',
      'Fully air-conditioned',
      'Direct access to wash area',
      'Accessible via grand staircase',
    ],
    published: true,
    sortOrder: 3,
  },
  {
    id: 'open-hall',
    slug: 'open-hall',
    name: 'Open Hall',
    floor: 'Ground / Mezzanine Level',
    capacityText: '100 seats arranged',
    capacityNumber: 100,
    airConditioned: false,
    coverImage: '/assets/venue/venue-003.jpg',
    galleryImages: [
      '/assets/venue/venue-003.jpg',
      '/assets/venue/venue-006.jpg',
    ],
    description:
      'A bright, airy open space with 100 seats arranged, polished marble-finish flooring, ceiling fans, and exhaust fans for natural breeze. Flexible for casual mingling, extra seating, or buffet counters.',
    suggestedUses: [
      'Flexible Social Functions',
      'Community & Family Gatherings',
      'Informal Receptions & Exhibits',
    ],
    features: [
      '100 seats arranged',
      'Naturally ventilated with exhaust fans',
      'Polished marble-finish flooring',
      'High-velocity ceiling fans',
      'Open adaptable layout',
    ],
    soundproofingNotes:
      'Please note: Because the Open Hall is naturally ventilated with exhaust fans, sound carries outside, so we follow local municipal sound guidelines for evening functions.',
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
      'A long row of clean stainless and ceramic wash basins with mirrors and continuous running water, placed conveniently right beside the dining hall for smooth feast service.',
    badge: 'Clean & Convenient',
    iconName: 'Droplets',
  },
  {
    id: 'grand-staircase',
    title: 'Grand Staircase',
    category: 'Architecture',
    description:
      'A wide, comfortable staircase with smooth steps and modern glass railings connecting the ground floor to the upper dining hall, equipped with a safety hose reel.',
    badge: 'Safety Equipped',
    iconName: 'Footprints',
  },
  {
    id: 'solar-power',
    title: 'Solar Hybrid Power with Battery',
    category: 'Power Continuity',
    description:
      'An automatic solar-hybrid power system with battery backup, keeping lights, fans, and audio systems running without interruption even during local power cuts.',
    badge: 'Uninterrupted Power',
    iconName: 'Zap',
  },
  {
    id: 'tested-water',
    title: 'Water Authority Tested Well Water',
    category: 'Safety & Health',
    description:
      'Pure well water on tap, tested and certified safe for drinking and cooking by the Kerala Water Authority.',
    badge: 'Certified Safe Water',
    iconName: 'ShieldCheck',
  },
  {
    id: 'on-site-parking',
    title: 'On-Site Parking (40–50 Cars)',
    category: 'Access & Logistics',
    description:
      'Dedicated on-site parking for 40 to 50 cars directly inside the venue compound, with easy entry and exit right at Market Junction.',
    badge: '40–50 Cars Inside',
    iconName: 'Car',
  },
  {
    id: 'rooftop-changing',
    title: 'Dressing & Changing Rooms (On Request)',
    category: 'Special Facilities',
    description:
      'While the rooftop area is kept closed for safety, private dressing and changing rooms can be opened on the rooftop floor whenever requested.',
    badge: 'Available on Request',
    iconName: 'Sparkles',
  },
  {
    id: 'highway-access',
    title: 'PWD Bus Route & Highway Access',
    category: 'Connectivity',
    description:
      'Located right at Market Junction in Nellikunnu, directly on the PWD bus route and opposite RGLP School with quick access to Thrissur town and the highway.',
    badge: 'Easy to Find',
    iconName: 'MapPin',
  },
  {
    id: 'air-conditioning',
    title: 'Air-Conditioned Comfort',
    category: 'Climate Control',
    description:
      'Three dedicated halls (Stage Hall, Welcome Hall, and Dining Hall) are fully air-conditioned to keep your guests cool and comfortable year-round.',
    badge: '3 AC Halls',
    iconName: 'Wind',
  },
];

export const FAQS = [
  {
    question: 'How many guests can Thekkanath Souparnika accommodate?',
    answer:
      'We welcome events of all sizes. The venue is arranged comfortably for gatherings of 250 to 300 guests, and can host up to 400 people across its halls. Each hall has 100 seats, with the First Floor Dining Hall seating 100 guests per batch for traditional sadhya service.',
  },
  {
    question: 'Can individual halls be booked separately?',
    answer:
      'No, we only host one celebration at a time. When you book Thekkanath Souparnika, the entire venue is reserved exclusively for your family. You get private, unrestricted access to all four halls (Stage Hall, Welcome Hall, First Floor Dining Hall, and Open Hall) with no other parties on the property.',
  },
  {
    question: 'Which halls are equipped with air conditioning?',
    answer:
      'Three halls—the Stage Hall, Welcome Hall, and Dining Hall—are fully air-conditioned. The Open Hall is naturally ventilated with ceiling fans and three exhaust fans.',
  },
  {
    question: 'What is the parking capacity?',
    answer:
      'We have dedicated, secure compound parking for 40 to 50 cars directly inside the venue gates.',
  },
  {
    question: 'How do I check date availability and rates?',
    answer:
      'Simply send an enquiry through our website or give us a call. We will check the calendar right away and discuss availability, timing, and pricing directly with you.',
  },
  {
    question: 'Can guests access the rooftop area?',
    answer:
      'For everyone’s safety, the 4,000 sq ft rooftop is closed to guests during events. However, private air-conditioned dressing and changing rooms can be opened on the rooftop floor upon advance request.',
  },
  {
    question: 'Is the Open Hall soundproofed?',
    answer:
      'Our indoor halls are well insulated. Since the Open Hall has exhaust fans for natural airflow, sound carries outside, so we follow local municipal sound guidelines for evening functions.',
  },
  {
    question: 'What power backup is in place?',
    answer:
      'We have an automatic solar-hybrid electrical system with dedicated battery backup, ensuring lights, fans, and audio keep running without a hitch during power interruptions.',
  },
];
