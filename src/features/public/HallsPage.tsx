import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { HALLS } from '../../data/venueData';
import { VENUE_MEDIA, venuePhotoForPath } from '../../data/venueMedia';
import { VenueImage } from '../../components/public/VenueImage';

export function HallsPage() {
  const [filter, setFilter] = useState<'all' | 'ac' | 'natural'>('all');
  const halls = HALLS.filter(hall => hall.published && (filter === 'all' || (filter === 'ac' ? hall.airConditioned : !hall.airConditioned)));
  return <div className="lux-page lux-container">
    <header className="lux-page-heading"><span className="lux-eyebrow">SPACES & ARRANGEMENTS</span><h1>Explore the <em>halls.</em></h1><p>Browse the venue's published hall information and enquire about the right arrangement for your event. Photographs are shown as venue views; room labels and specifications come from the venue records.</p></header>
    <div className="lux-filter-row" aria-label="Filter halls"><button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All spaces</button><button type="button" aria-pressed={filter === 'ac'} onClick={() => setFilter('ac')}>Air-conditioned</button><button type="button" aria-pressed={filter === 'natural'} onClick={() => setFilter('natural')}>Natural airflow</button></div>
    <div className="lux-hall-grid">{halls.map(hall => { const photo = hall.id === 'auditorium' ? VENUE_MEDIA[6] : venuePhotoForPath(hall.coverImage); return <article className="lux-hall-card" key={hall.id}><div className="lux-hall-image">{photo && <VenueImage photo={photo} small />}<span>VENUE VIEW · {photo?.title.toUpperCase()}</span></div><div className="lux-hall-copy"><small>{hall.floor} · {hall.capacityText}</small><h2>{hall.name}</h2><p>{hall.description}</p><div className="lux-hall-actions"><Link className="lux-text-link" to={`/halls/${hall.slug}`}>Hall information <ArrowUpRight size={17} /></Link><Link className="lux-button lux-button-primary" to={`/enquire?hall=${hall.id}`}>Enquire <ArrowUpRight size={15} /></Link></div></div></article>; })}</div>
    <div className="lux-note-panel"><h2>Planning the right fit</h2><p>{HALLS[0].capacityText} is the venue's published overall guidance. Dates, layouts and event requirements are confirmed by the venue team during enquiry.</p></div>
  </div>;
}
