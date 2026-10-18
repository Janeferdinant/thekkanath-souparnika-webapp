import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { AmbientParticles } from '../../components/public/AmbientParticles';
import { VenueImage } from '../../components/public/VenueImage';
import { VENUE_MEDIA } from '../../data/venueMedia';
import { VENUE_INFO } from '../../data/venueData';

const highlights = [VENUE_MEDIA[0], VENUE_MEDIA[2]];
const details = [VENUE_MEDIA[1], VENUE_MEDIA[3], VENUE_MEDIA[4], VENUE_MEDIA[5]];

export function HomePage() {
  return <>
    <section className="lux-hero" aria-labelledby="home-title">
      <picture className="lux-hero-image">
        <source media="(max-width: 650px)" srcSet="/assets/venue/optimized/venue-006.webp" type="image/webp" />
        <source media="(max-width: 650px)" srcSet="/assets/venue/venue-006.jpg" />
        <source srcSet="/assets/venue/optimized/venue-000.webp" type="image/webp" />
        <img src="/assets/venue/venue-000.jpg" alt="Rows of chairs arranged inside a well-lit event room; on small screens, the building frontage and Souparnika sign are shown" width="1364" height="680" fetchPriority="high" />
      </picture>
      <div className="lux-hero-shade" aria-hidden="true" />
      <AmbientParticles variant="hero" className="lux-hero-particles" />
      <div className="lux-container lux-hero-inner">
        <div className="lux-hero-content">
          <span className="lux-eyebrow lux-eyebrow-light">NELLIKUNNU · THRISSUR</span>
          <h1 id="home-title">Where life's <em>beautiful</em> moments begin.</h1>
          <p>Explore photographs of the actual venue in Nellikunnu, Thrissur, and enquire about an event that matters to you.</p>
          <div className="lux-actions"><Link className="lux-button lux-button-primary" to="/halls">Explore the venue <ArrowUpRight size={17} /></Link><Link className="lux-button lux-button-outline" to="/enquire">Plan your event <ArrowUpRight size={17} /></Link></div>
          <div className="lux-hero-location"><MapPin size={15} /> Market Junction, Nellikunnu, Thrissur</div>
        </div>
      </div>
      <div className="lux-hero-bottom"><span>01 / ACTUAL VENUE</span><a href="#story">SCROLL TO DISCOVER <ArrowDown size={15} /></a><span>AUTHENTIC PHOTOGRAPHY</span></div>
    </section>

    <section className="lux-section lux-story" id="story">
      <div className="lux-container lux-story-grid">
        <div><span className="lux-eyebrow">THEKKANATH SOUPARNIKA</span><h2>A space for the <em>moments that matter.</em></h2></div>
        <div className="lux-story-copy"><span className="lux-ornament" aria-hidden="true">✦</span><p>Every celebration begins with a place. Explore the atmosphere, imagine the occasion, and contact the venue team to plan the details that make it yours.</p><Link className="lux-text-link" to="/contact">Connect with the venue <ArrowUpRight size={17} /></Link><figure className="lux-story-photo"><VenueImage photo={VENUE_MEDIA[6]} /><figcaption>The actual venue entrance</figcaption></figure></div>
      </div>
    </section>

    <section className="lux-section lux-spaces" id="spaces"><div className="lux-container">
      <div className="lux-section-heading"><div><span className="lux-eyebrow">01 — INSIDE THE VENUE</span><h2>The venue, <em>as photographed.</em></h2></div><p>See the real seating and table arrangements. Official hall details are available separately, and the team can help you match a space to your event.</p></div>
      <div className="lux-space-grid">{highlights.map((photo, index) => <article className="lux-space-card" key={photo.id}><Link to="/halls" aria-label={`Explore halls and ${photo.title.toLowerCase()}`}><div className="lux-photo-frame"><VenueImage photo={photo} /><span className="lux-photo-tag">ACTUAL VENUE PHOTO · {photo.id}</span></div><div className="lux-space-card-bottom"><div><small>{index === 0 ? 'PHOTOGRAPHED SEATING' : 'PHOTOGRAPHED SETUP'}</small><h3>{photo.title}</h3></div><span className="lux-round-arrow"><ArrowUpRight size={23} /></span></div></Link></article>)}</div>
      <div className="lux-section-tail"><span>Images show existing rooms and furnishings</span><Link className="lux-text-link" to="/halls">View hall information <ArrowUpRight size={17} /></Link></div>
    </div></section>

    <section className="lux-section lux-gallery-preview"><div className="lux-container"><div className="lux-section-heading"><div><span className="lux-eyebrow">02 — A VISUAL JOURNEY</span><h2>A genuine <em>look inside.</em></h2></div><p>Seven photographs from the venue. View every image at full size in the gallery.</p></div><div className="lux-preview-grid">{[VENUE_MEDIA[1], VENUE_MEDIA[3], VENUE_MEDIA[6], VENUE_MEDIA[4], VENUE_MEDIA[5]].map((photo, index) => <Link key={photo.id} to="/gallery" className={index === 0 ? 'lux-preview-tile lux-preview-featured' : 'lux-preview-tile'} aria-label={`Open gallery: ${photo.title}`}><VenueImage photo={photo} small /><span className="lux-photo-tag">{photo.title.toUpperCase()}</span></Link>)}</div><div className="lux-section-tail"><span>All photographs are of the actual venue</span><Link className="lux-text-link" to="/gallery">Explore all seven photographs <ArrowUpRight size={17} /></Link></div></div></section>

    <section className="lux-section lux-facilities-preview"><div className="lux-container lux-facilities-grid"><div><span className="lux-eyebrow">03 — THE PRACTICAL DETAILS</span><h2>Thoughtful spaces, <em>honestly shown.</em></h2><p>These areas are visible in the supplied photographs. Ask the venue team about access and arrangements for your visit.</p><Link className="lux-button lux-button-outline" to="/facilities">Explore facilities <ArrowUpRight size={17} /></Link></div><div className="lux-detail-grid">{details.map(photo => <Link to="/facilities" className="lux-detail-card" key={photo.id}><div><VenueImage photo={photo} small /></div><small>PHOTOGRAPHED AREA</small><h3>{photo.title}</h3></Link>)}</div></div></section>

    <section className="lux-section"><div className="lux-container lux-tour-card"><div className="lux-tour-photo"><VenueImage photo={VENUE_MEDIA[1]} /></div><div className="lux-tour-copy"><span className="lux-eyebrow">04 — EXPLORE FROM ANYWHERE</span><h2>Plan a visit <em>from here.</em></h2><p>Explore the real venue photographs now. A 360° interactive tour is not yet available; these images are ordinary still photos.</p><Link className="lux-button lux-button-primary" to="/tour">About the photo tour <ArrowUpRight size={17} /></Link><small>ACTUAL VENUE STILL IMAGE · NO PANORAMA</small></div></div></section>

    <section className="lux-section lux-enquiry-teaser"><div className="lux-container lux-split"><div><span className="lux-eyebrow">05 — PLAN YOUR EVENT</span><h2>Let's create <em>something memorable.</em></h2></div><div><p>Tell us your preferred date, space and event details, then share your enquiry reference with the venue team to discuss availability.</p><Link className="lux-button lux-button-primary" to="/enquire">Start an enquiry <ArrowUpRight size={17} /></Link></div></div></section>

    <section className="lux-section lux-contact-teaser"><div className="lux-container lux-split"><div><span className="lux-eyebrow">06 — FIND US</span><h2>We'd love to <em>hear from you.</em></h2><p>{VENUE_INFO.address.fullFormatted}</p></div><div className="lux-contact-links"><a href={`tel:${VENUE_INFO.phones[0]}`}><small>TELEPHONE</small>{VENUE_INFO.displayPhones[0]} <ArrowUpRight size={18} /></a><a href={`mailto:${VENUE_INFO.email}`}><small>EMAIL</small>{VENUE_INFO.email} <ArrowUpRight size={18} /></a><a href={VENUE_INFO.googleMapsUrl} target="_blank" rel="noreferrer"><small>LOCATION</small>Get directions <ArrowUpRight size={18} /></a></div></div></section>
  </>;
}
