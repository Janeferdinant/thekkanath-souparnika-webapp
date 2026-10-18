import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { VENUE_INFO } from '../../data/venueData';

export function PublicFooter() {
  return <footer className="public-footer">
    <div className="lux-container public-footer-grid">
      <div className="public-footer-brand"><img src="/assets/brand/ivory-lotus-crest.png" alt="" width="42" height="42" /><span>THEKKANATH<br /><strong>Souparnika</strong></span><p>Hall & Events Venue<br />Market Junction, Nellikunnu, Thrissur</p></div>
      <div><h2>DISCOVER</h2><Link to="/halls">Halls</Link><Link to="/gallery">Gallery</Link><Link to="/facilities">Facilities</Link><Link to="/tour">Photo tour</Link><Link to="/faq">Questions</Link></div>
      <div><h2>CONNECT</h2><Link to="/enquire">Enquire</Link><Link to="/contact">Contact</Link><a href={`tel:${VENUE_INFO.phones[0]}`}>Call {VENUE_INFO.displayPhones[0]}</a><a href={`mailto:${VENUE_INFO.email}`}>Email us</a><a href={VENUE_INFO.googleMapsUrl} target="_blank" rel="noreferrer">Directions <ArrowUpRight size={13} /></a></div>
      <div className="public-footer-mark" aria-hidden="true">✦</div>
    </div>
    <div className="lux-container public-footer-bottom"><span>© {new Date().getFullYear()} Thekkanath Souparnika</span><Link to="/admin">Staff studio</Link></div>
  </footer>;
}
