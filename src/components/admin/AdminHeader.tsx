import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';

interface AdminHeaderProps {
  onSearch?: (query: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onSearch }) => {
  const { currentUser, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      info('Signed Out', 'You have been safely signed out of the Staff Studio.');
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
      navigate('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName = currentUser?.fullName || 'Staff Member';
  const displayRole = currentUser?.role?.replace('_', ' ') || 'Staff';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-cream-200 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-sm">
        {/* Left: Brand / Studio Label */}
        <div className="flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-burgundy-900 to-wine-950 text-gold-300 font-serif font-bold text-sm flex items-center justify-center border border-gold-400/50 shadow-sm">
              TS
            </div>
            <div className="hidden sm:block">
              <span className="font-serif font-bold text-sm text-burgundy-950 block leading-none">
                Souparnika Studio
              </span>
              <span className="text-[9px] uppercase tracking-wider text-rose-700 font-bold block mt-0.5">
                Venue Management
              </span>
            </div>
          </Link>

          <Link
            to="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-ink-600 hover:text-forest-900 bg-cream-100 px-2.5 py-1 rounded-md border border-cream-200 ml-2"
            title="Open customer website in new tab"
          >
            <span>Customer Website</span>
            <ExternalLink className="w-3 h-3 text-gold-600" />
          </Link>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Quick search bookings, enquiries, customers..."
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
        </div>

        {/* Right: Actions & User Persona */}
        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <button
            onClick={() => setNotifModalOpen(true)}
            className="p-2 rounded-full hover:bg-cream-100 text-ink-600 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-cream-100 border border-cream-300 text-left">
            <div className="w-7 h-7 rounded-full bg-burgundy-900 text-gold-300 font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-burgundy-950 block leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-ink-500 capitalize block leading-none flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                {displayRole}
              </span>
            </div>
          </div>

          {/* Real Sign Out Button */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
            title="Sign out of Staff Studio"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Notifications Modal */}
      <Modal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        title="Operational Reminders"
        subtitle="Active automated operational checks and alerts"
        maxWidth="sm"
      >
        <div className="space-y-3 text-xs text-ink-800">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900 block">Enquiry Follow-Up Due</span>
            <p className="text-[11px] text-amber-800 leading-snug">
              Enquiries require follow-up within 24 hours of client submission.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-900 block">Upcoming Event Setup</span>
            <p className="text-[11px] text-emerald-800 leading-snug">
              Verified booking task checklists assigned for upcoming ceremonial dates.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-cream-100 border border-cream-300 space-y-1">
            <span className="font-bold text-ink-900 block">Maintenance Reminder</span>
            <p className="text-[11px] text-ink-700 leading-snug">
              Regular hall air-conditioning filter inspections and marble maintenance scheduled.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
