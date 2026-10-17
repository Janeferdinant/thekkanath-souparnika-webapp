import React from 'react';
import { Phone, Mail, ShieldAlert } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Badge } from '../../components/ui/Badge';

export const StaffPage: React.FC = () => {
  const profiles = StorageService.getAvailableProfiles();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">Staff & Team Roster</h1>
          <p className="text-xs text-ink-500 mt-1">
            Authorized management team, booking managers, and operations staff
          </p>
        </div>
      </div>

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
                <Badge variant={p.role === 'super_admin' ? 'gold' : 'default'}>
                  {p.role.replace('_', ' ').toUpperCase()}
                </Badge>
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

            <div className="pt-3 border-t border-cream-200 text-[10px] text-ink-500 flex justify-between">
              <span>Account Active</span>
              <span>Joined: {new Date(p.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>

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
