import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { FACILITIES } from '../../data/venueData';
import { VENUE_MEDIA } from '../../data/venueMedia';
import { VenueImage } from '../../components/public/VenueImage';

const photographed = [
  { photo: VENUE_MEDIA[1], text: 'Glass doors and seating along the entrance corridor are visible.' },
  { photo: VENUE_MEDIA[2], text: 'Dining-style tables and upholstered chairs appear in this room view.' },
  { photo: VENUE_MEDIA[4], text: 'Multiple washbasins and mirrors appear in the source photograph.' },
  { photo: VENUE_MEDIA[5], text: 'An interior stairway and handrails appear in the source photograph.' },
];

export function FacilitiesPage() {
  return <div className="lux-page lux-container">
    <header className="lux-page-heading"><span className="lux-eyebrow">PRACTICAL DETAILS</span><h1>Thoughtful spaces, <em>honestly shown.</em></h1><p>See the areas captured in the venue photographs, then review the published facility information below. Contact the team about access or specific arrangements before your visit.</p></header>
    <div className="lux-facility-photo-grid">{photographed.map(({ photo, text }) => <article className="lux-facility-photo-card" key={photo.id}><div><VenueImage photo={photo} small /></div><small>PHOTOGRAPHED AREA</small><h2>{photo.title}</h2><p>{text}</p></article>)}</div>
    <section className="lux-facility-facts"><span className="lux-eyebrow">VENUE INFORMATION</span><h2>Facilities in the venue records</h2><div className="lux-facts-grid">{FACILITIES.map(facility => <article key={facility.id}><small>{facility.category}</small><h3>{facility.title}</h3><p>{facility.description}</p></article>)}</div></section>
    <div className="lux-note-panel"><h2>Have a specific requirement?</h2><p>Ask about access, setup or logistics for your event. The venue team can confirm what is available for your date.</p><Link className="lux-button lux-button-primary" to="/enquire">Discuss your event <ArrowUpRight size={17} /></Link></div>
  </div>;
}
