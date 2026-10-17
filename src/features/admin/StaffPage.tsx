import React, { useState } from 'react';
import { Phone, Mail, ShieldAlert, UserPlus, Trash2, Lock } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { UserProfile, UserRole } from '../../types/models';
import { canManageStaff } from '../../lib/adminEngine';
import { useToast } from '../../context/ToastContext';

export const StaffPage: React.FC = () => {
  const { success, error } = useToast();
  const currentUser = StorageService.getCurrentUser();
  const isSuperAdmin = canManageStaff(currentUser?.role);

  const [profiles, setProfiles] = useState<UserProfile[]>(() =>
    StorageService.getAvailableProfiles()
  );

  // Add Staff Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('booking_manager');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      error('Access Denied: Only Super Admin can add staff members.');
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      error('Please provide full name and email address.');
      return;
    }

    try {
      const created = StorageService.createProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        role,
      });
      setProfiles((prev) => [...prev, created]);
      setAddModalOpen(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setRole('booking_manager');
      success(`Added ${created.fullName} to staff roster.`);
    } catch {
      error('Failed to create staff member.');
    }
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    if (!isSuperAdmin) {
      error('Access Denied: Only Super Admin can change staff roles.');
      return;
    }
    StorageService.updateProfileRole(id, newRole);
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, role: newRole } : p))
    );
    success('Staff role updated successfully.');
  };

  const handleRemoveStaff = (id: string, name: string) => {
    if (!isSuperAdmin) {
      error('Access Denied: Only Super Admin can remove staff.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${name} from the staff roster?`)) {
      StorageService.removeProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      success(`Removed ${name} from roster.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">Staff & Team Roster</h1>
          <p className="text-xs text-ink-500 mt-1">
            Authorized management team, booking managers, and operations staff
          </p>
        </div>

        {isSuperAdmin ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setAddModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Staff Member
          </Button>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Read-Only View (Requires Super Admin)</span>
          </div>
        )}
      </div>

      {/* Role Notice Banner */}
      {!isSuperAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Super Admin Privilege Enforcement</div>
            <p className="text-[11px] text-amber-800 mt-0.5">
              You are signed in as <strong>{currentUser?.fullName || 'Guest'}</strong> (Role:{' '}
              {currentUser?.role || 'viewer'}). Modifying staff permissions, adding members, or altering credentials is restricted strictly to Super Admin.
            </p>
          </div>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-2xl bg-white border border-cream-200 shadow-subtle flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-full bg-forest-800 text-gold-300 font-bold text-sm flex items-center justify-center border border-gold-500">
                  {p.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                {isSuperAdmin ? (
                  <select
                    value={p.role}
                    onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                    className="text-xs font-bold px-2 py-1 rounded-lg border border-cream-300 bg-cream-50 text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
                  >
                    <option value="super_admin">SUPER ADMIN</option>
                    <option value="administrator">ADMINISTRATOR</option>
                    <option value="booking_manager">BOOKING MANAGER</option>
                    <option value="operations_manager">OPERATIONS MANAGER</option>
                    <option value="accounts">ACCOUNTS</option>
                    <option value="staff">OPERATIONS STAFF</option>
                  </select>
                ) : (
                  <Badge variant={p.role === 'super_admin' ? 'gold' : 'default'}>
                    {p.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">{p.fullName}</h3>
                <div className="space-y-1 text-xs text-ink-600 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gold-600" />
                    <span>{p.email}</span>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gold-600" />
                      <span>+91 {p.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-cream-200 text-[10px] text-ink-500 flex items-center justify-between">
              <span>Joined: {new Date(p.createdAt).toLocaleDateString('en-IN')}</span>
              {isSuperAdmin && p.role !== 'super_admin' && (
                <button
                  type="button"
                  onClick={() => handleRemoveStaff(p.id, p.fullName)}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Remove staff"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isSuperAdmin && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add New Staff Member"
        >
          <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. John K. Joseph"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. john@thekkanath.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Contact Phone</label>
              <input
                type="tel"
                placeholder="e.g. 9847000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              >
                <option value="administrator">Administrator</option>
                <option value="booking_manager">Booking Manager</option>
                <option value="operations_manager">Operations Manager</option>
                <option value="accounts">Accounts</option>
                <option value="staff">Operations Staff</option>
              </select>
            </div>

            <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="gold" size="md" type="submit">
                Save & Authorize Staff
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Sensitive Payroll Disclosure */}
      <div className="p-5 rounded-2xl bg-forest-900 text-cream-100 border border-forest-800 text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-gold-400 font-semibold">
          <ShieldAlert className="w-4 h-4" />
          <span>Payroll & Compensation Confidentiality</span>
        </div>
        <p className="text-xs text-cream-300 leading-relaxed">
          Staff attendance and payroll records are restricted to authorized management and accounts personnel. The application records approved operational expenses rather than executing direct bank transfers or estimating employee salaries.
        </p>
      </div>
    </div>
  );
};
