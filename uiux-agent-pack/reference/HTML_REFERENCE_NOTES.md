# HTML Reference Notes

The `index.html` file is a static visual reference for human/agent review. It is deliberately not a replacement for the React app.

## Preview
Open `index.html` in a modern browser. An internet connection is needed for the remote Unsplash demonstration images and Google Fonts. Before production, replace all remote sample imagery with approved venue photography hosted locally or from an approved CDN.

## Placeholder content
Cards, facility labels, event categories, venue photos and virtual tour are illustrative. The live site must use verified content from `src/data/venueData.ts` and the business brochure. Keep explicit placeholder labels only in the design/dev environment; do not publish placeholder details.

## Production mapping
- Navigation/header → `src/components/public/PublicHeader.tsx`
- Shared page shell + mobile quick action dock → `src/components/public/PublicLayout.tsx`
- Hero + home sections → `src/features/public/HomePage.tsx`
- Hall cards/details → `src/features/public/HallsPage.tsx` and existing hall detail page
- Facilities → `src/features/public/FacilitiesPage.tsx`
- Gallery/lightbox → `src/features/public/GalleryPage.tsx`
- Enquiry form → `src/features/public/EnquirePage.tsx`
- Contact footer → `src/features/public/ContactPage.tsx`, `src/components/public/PublicFooter.tsx`
- Particle system → `src/components/public/AmbientParticles.tsx`
- Tokens/styles → `src/styles/theme.css`, `src/styles/index.css`, `tailwind.config.js`

## Important differences from production
- The static form does not save data. Connect the live design to the existing enquiry implementation.
- The tour CTA is illustrative; only show a working tour if approved panorama assets/config exist.
- The HTML demonstrates CSS hover zoom in place of real optical refraction. True lens distortion is optional, localized progressive enhancement.
- `luxury-theme.css` is a reference starter. Merge its tokens into the existing styles carefully; do not include competing palettes or inadvertently restyle admin pages.
