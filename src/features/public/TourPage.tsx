import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { VenueImage } from '../../components/public/VenueImage';
import { VENUE_MEDIA } from '../../data/venueMedia';

export function TourPage() {
  return <div className="lux-page lux-container"><header className="lux-page-heading"><span className="lux-eyebrow">EXPLORE FROM ANYWHERE</span><h1>A photo tour <em>of the venue.</em></h1><p>Explore the seven actual venue photographs while planning your visit. A 360° interactive tour is not available yet; these images are still photographs, not panoramas.</p></header><div className="lux-tour-card lux-tour-page-card"><div className="lux-tour-photo"><VenueImage photo={VENUE_MEDIA[1]} /></div><div className="lux-tour-copy"><span className="lux-eyebrow">ACTUAL VENUE PHOTOGRAPH</span><h2>Start with the <em>entrance.</em></h2><p>This image shows the entry corridor and lobby. The full gallery includes seating, dining setup, interior details and building frontage.</p><Link className="lux-button lux-button-primary" to="/gallery">View the gallery <ArrowUpRight size={17} /></Link><Link className="lux-text-link" to="/contact">Arrange a visit <ArrowUpRight size={17} /></Link></div></div></div>;
}
