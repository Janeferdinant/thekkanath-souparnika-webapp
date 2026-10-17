import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Search,
  ExternalLink,
  UserCheck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { isDemoMode, StorageService } from '../../lib/storage';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface AdminHeaderProps {
  onSearch?: (query: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onSearch }) => {
  const { currentUser, availableProfiles, loginAs } = useAuth();
  const { info, success } = useToast();
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleResetData = () => {
    StorageService.resetAllDemoData();
    setResetConfirmOpen(false);
    success('Demo Data Reset', 'All enquiries, bookings, and financial records have been restored to default fixtures.');
    // reload to refresh in-memory states
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

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
                Venue Management {isDemoMode() && '· Demo'}
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

        {/* Right: Actions & User Persona Switcher */}
        <div className="flex items-center gap-3">
          {/* Reset Demo Data Button */}
          {isDemoMode() && (
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
              title="Reset sample enquiries, bookings, and finance data"
            >
              <RotateCcw className="w-3 h-3 text-amber-700" />
              <span className="hidden lg:inline">Reset Demo Data</span>
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={() => setNotifModalOpen(true)}
            className="p-2 rounded-full hover:bg-cream-100 text-ink-600 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>

          {/* User Persona Chip */}
          <button
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-cream-100 hover:bg-cream-200 border border-cream-300 text-left transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-forest-800 text-gold-300 font-bold text-xs flex items-center justify-center">
              {currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-forest-950 block leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] text-ink-500 capitalize block leading-none">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-gold-600 hidden sm:block" />
          </button>
        </div>
      </header>

      {/* Role / Persona Switcher Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title="Switch Staff Persona (Role-Based Testing)"
        subtitle="Select a staff profile to view module access and permission restrictions as configured."
        maxWidth="md"
      >
        <div className="space-y-3">
          {availableProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => {
                loginAs(profile.id);
                setRoleModalOpen(false);
                info('Role Switched', `Active view changed to ${profile.fullName} (${profile.role})`);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                currentUser.id === profile.id
                  ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                  : 'bg-white hover:bg-cream-100 border-cream-300 text-ink-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ${
                    currentUser.id === profile.id
                      ? 'bg-gold-500 text-forest-950'
                      : 'bg-cream-200 text-forest-900'
                  }`}
                >
                  {profile.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{profile.fullName}</div>
                  <div
                    className={`text-[10px] uppercase tracking-wider font-semibold ${
                      currentUser.id === profile.id ? 'text-gold-300' : 'text-gold-700'
                    }`}
                  >
                    {profile.role.replace('_', ' ')}
                  </div>
                  <div
                    className={`text-[10px] ${
                      currentUser.id === profile.id ? 'text-cream-300' : 'text-ink-500'
                    }`}
                  >
                    {profile.email}
                  </div>
                </div>
              </div>

              {currentUser.id === profile.id && (
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </Modal>

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
              Enquiry TS-ENQ-2026-1002 (Gopakumar Nair) is pending a scheduled hall tour callback.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-900 block">Upcoming Event Setup</span>
            <p className="text-[11px] text-emerald-800 leading-snug">
              Dr. Radhakrishnan Pillai booking (Stage Hall) on 2026-11-08 has pre-event task checklist assigned.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-cream-100 border border-cream-300 space-y-1">
            <span className="font-bold text-ink-900 block">Maintenance Reminder</span>
            <p className="text-[11px] text-ink-700 leading-snug">
              Semi-annual Open Hall marble buffing scheduled for 2026-11-02.
            </p>
          </div>
        </div>
      </Modal>

      {/* Reset Demo Data Modal */}
      <Modal
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title="Reset All Demo Data?"
        subtitle="This will restore all enquiries, bookings, customers, payments, and tasks back to initial default sample records."
        maxWidth="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleResetData}>
              Yes, Reset Data
            </Button>
          </>
        }
      >
        <p className="text-xs text-ink-700 leading-relaxed">
          Any newly created test bookings or enquiries stored in this browser session will be replaced by the default fixtures.
        </p>
      </Modal>
    </>
  );
};
