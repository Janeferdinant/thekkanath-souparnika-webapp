/** Literal descriptions of the seven owner-supplied venue photographs. */
export const VENUE_MEDIA = [
  { id: '000', title: 'Event seating', alt: 'Rows of chairs arranged inside a well-lit event room', category: 'interior' },
  { id: '001', title: 'Entrance and lobby', alt: 'Interior entrance corridor with glass doors and chairs along the sides', category: 'interior' },
  { id: '002', title: 'Dining layout', alt: 'Tables and upholstered chairs arranged inside the venue', category: 'interior' },
  { id: '003', title: 'Open interior', alt: 'Bright open tiled interior with chairs along one wall', category: 'interior' },
  { id: '004', title: 'Washbasin area', alt: 'Line of washbasins and mirrors in an interior service area', category: 'details' },
  { id: '005', title: 'Stair access', alt: 'Interior stairway with handrails', category: 'details' },
  { id: '006', title: 'Building frontage', alt: 'Exterior entrance with Thekkanath Souparnika sign', category: 'exterior' },
] as const;

export type VenuePhoto = typeof VENUE_MEDIA[number];

export function venuePhotoForPath(path: string): VenuePhoto | undefined {
  const match = path.match(/venue-(00[0-6])\./);
  return VENUE_MEDIA.find((photo) => photo.id === match?.[1]);
}
