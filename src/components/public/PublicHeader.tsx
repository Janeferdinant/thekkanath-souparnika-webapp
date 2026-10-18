import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { isDemoMode } from '../../lib/storage';

const links = [
  { label: 'Home', path: '/' },
  { label: 'Halls', path: '/halls' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Photo tour', path: '/tour' },
  { label: 'Contact', path: '/contact' },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 981px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return <>
    {isDemoMode() && <div className="public-demo-note" role="status">Interactive demo mode · Enquiries and admin changes are saved in this browser.</div>}
    <div className="public-top-note">ACTUAL VENUE PHOTOGRAPHY <span>/</span> NELLIKUNNU · THRISSUR</div>
    <header className="public-header">
      <div className="public-nav-shell">
        <Link className="public-brand" to="/" aria-label="Thekkanath Souparnika home">
          <img src="/assets/brand/ivory-lotus-crest.png" alt="" width="46" height="46" />
          <span><small>THEKKANATH</small><strong>Souparnika</strong><small>HALL & EVENTS VENUE</small></span>
        </Link>
        <nav className="public-desktop-nav" aria-label="Primary navigation">
          {links.map(({ label, path }) => <Link key={path} to={path} aria-current={location.pathname === path ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <Link className="lux-button lux-button-primary public-header-cta" to="/enquire">Plan an event <ArrowUpRight size={15} aria-hidden="true" /></Link>
        <button className="public-menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="public-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav id="public-mobile-menu" className="public-mobile-nav" aria-label="Mobile navigation">
        {links.map(({ label, path }) => <Link key={path} to={path} aria-current={location.pathname === path ? 'page' : undefined}>{label}</Link>)}
        <Link to="/enquire">Plan an event <ArrowUpRight size={16} /></Link>
        <Link to="/faq">Frequently asked questions</Link>
        <Link to="/admin">Staff studio</Link>
      </nav>}
    </header>
  </>;
}
