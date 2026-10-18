import { Outlet, Link } from 'react-router-dom';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { VENUE_INFO } from '../../data/venueData';

export function PublicLayout() {
  return <div className="public-luxury">
    <a href="#public-main" className="public-skip-link">Skip to content</a>
    <PublicHeader />
    <main id="public-main"><Outlet /></main>
    <PublicFooter />
    <nav className="public-mobile-dock" aria-label="Mobile quick actions">
      <a href={`tel:${VENUE_INFO.phones[0]}`}>Call venue</a>
      <Link to="/enquire">Enquire ↗</Link>
    </nav>
  </div>;
}
