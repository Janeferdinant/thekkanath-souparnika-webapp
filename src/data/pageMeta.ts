export const SITE_URL = 'https://www.thekkanathsouparnika.com';

export type MetaRoute = '/' | '/halls' | '/facilities' | '/gallery' | '/enquire' | '/contact' | '/faq';

/**
 * Title and description per public route. The home page keeps the original wording. The others use
 * only facts already on the site, and leave the parking and capacity figures to the pages that own them.
 */
export const PAGE_META: Record<MetaRoute, { title: string; description: string }> = {
  '/': {
    title: 'Thekkanath Souparnika — Hall & Events Venue, Thrissur',
    description:
      'Thekkanath Souparnika is a premier events venue at Nellikunnu Market Junction, Thrissur, Kerala. Featuring four distinct halls, air conditioning, parking, and solar hybrid power.',
  },
  '/halls': {
    title: 'Our Four Halls — Thekkanath Souparnika, Thrissur',
    description:
      'Stage, Welcome, Dining and Open halls at Thekkanath Souparnika, Thrissur. Three are air-conditioned, and the venue hosts one event at a time.',
  },
  '/facilities': {
    title: 'Venue Facilities & Amenities — Thekkanath Souparnika',
    description:
      'Solar hybrid backup power, certified drinking water, on-site compound parking, a dedicated wash area and a grand staircase at Thekkanath Souparnika, Thrissur.',
  },
  '/gallery': {
    title: 'Photo Gallery — Thekkanath Souparnika, Thrissur',
    description:
      'Real photographs of the halls, dining area, staircase, wash facilities and exterior of Thekkanath Souparnika at Nellikunnu, Thrissur.',
  },
  '/enquire': {
    title: 'Booking Enquiry — Thekkanath Souparnika, Thrissur',
    description:
      'Send an enquiry for your preferred date at Thekkanath Souparnika. Our team will check the calendar and get in touch with you.',
  },
  '/contact': {
    title: 'Contact & Directions — Thekkanath Souparnika, Thrissur',
    description:
      'Find Thekkanath Souparnika at Market Junction, Nellikunnu, opposite RGLP School, Thrissur. Phone, email, WhatsApp and map directions.',
  },
  '/faq': {
    title: 'Frequently Asked Questions — Thekkanath Souparnika',
    description:
      'Answers about hall arrangements, capacity, parking, air conditioning, rooftop access and booking at Thekkanath Souparnika, Thrissur.',
  },
};
