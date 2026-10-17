import React, { useState } from 'react';
import {
  Globe,
  MessageCircle,
  Phone,
  Footprints,
  ShieldAlert,
  Gift,
  CheckCircle,
  ArrowRight,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { ReferralRecord, ReferralStatus } from '../../types/models';
import { transitionReferralStatus } from '../../lib/referralEngine';
import { formatINR, formatDate } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const MarketingPage: React.FC = () => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'channels' | 'referrals'>('referrals');
  const [referrals, setReferrals] = useState<ReferralRecord[]>(() =>
    StorageService.getReferrals()
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Payout Modal State
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRecord | null>(null);
  const [txnRef, setTxnRef] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');

  // Lead Source breakdown
  const sources = [
    { label: 'Public Website Submissions', count: 18, conversionRate: '44%', icon: Globe },
    { label: 'Direct WhatsApp Enquiries', count: 14, conversionRate: '50%', icon: MessageCircle },
    { label: 'Direct Telephone Calls', count: 9, conversionRate: '33%', icon: Phone },
    { label: 'Walk-in / Local Referrals', count: 6, conversionRate: '66%', icon: Footprints },
  ];

  const filteredReferrals = referrals.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  // KPI Calculations
  const totalPayablePaise = referrals
    .filter((r) => r.status === 'payable')
    .reduce((sum, r) => sum + r.bonusPaise, 0);

  const totalDisbursedPaise = referrals
    .filter((r) => r.status === 'disbursed')
    .reduce((sum, r) => sum + r.bonusPaise, 0);

  const handleStatusTransition = (record: ReferralRecord, newStatus: ReferralStatus) => {
    if (!transitionReferralStatus(record.status, newStatus)) {
      error(`Invalid transition from ${record.status} to ${newStatus}`);
      return;
    }

    StorageService.updateReferral(record.id, {
      status: newStatus,
    });
    setReferrals(StorageService.getReferrals());
    success(`Referral updated to ${newStatus.toUpperCase()}`);
  };

  const handleOpenPayout = (record: ReferralRecord) => {
    setSelectedReferral(record);
    setTxnRef('');
    setPayoutNotes('');
    setPayoutModalOpen(true);
  };

  const handleConfirmPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral) return;

    if (!txnRef.trim()) {
      error('Please enter a bank/UPI transaction reference number.');
      return;
    }

    StorageService.updateReferral(selectedReferral.id, {
      status: 'disbursed',
      paidAt: new Date().toISOString(),
      transactionRef: txnRef.trim(),
      notes: payoutNotes.trim() || selectedReferral.notes,
    });

    setReferrals(StorageService.getReferrals());
    setPayoutModalOpen(false);
    success(`Disbursed ${formatINR(selectedReferral.bonusPaise)} to ${selectedReferral.referrerName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">Marketing & Lead Channels</h1>
          <p className="text-xs text-ink-500 mt-1">
            Source attribution, conversion metrics, and referral bonus program
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 bg-cream-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'referrals'
                ? 'bg-burgundy-900 text-white shadow-sm'
                : 'text-gray-700 hover:text-black'
            }`}
          >
            Referrals & Commissions
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'channels'
                ? 'bg-burgundy-900 text-white shadow-sm'
                : 'text-gray-700 hover:text-black'
            }`}
          >
            Lead Channels
          </button>
        </div>
      </div>

      {activeTab === 'channels' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sources.map((src, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center">
                    <src.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {src.conversionRate} Conv.
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-forest-950">{src.count}</div>
                  <h4 className="text-xs font-semibold text-ink-800 mt-1">{src.label}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Campaign Policy Notice */}
          <div className="p-6 rounded-2xl bg-forest-900 text-cream-100 border border-forest-800 space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Lead Attribution & Channels</span>
            </div>
            <p className="text-xs text-cream-300 leading-relaxed">
              Inquiries are attributed directly to communication channels (website submissions, direct WhatsApp messages, telephone calls, and in-person walk-ins) to provide management with transparent conversion insights.
            </p>
          </div>
        </div>
      ) : (
        /* Referrals & Commissions Tab */
        <div className="space-y-6">
          {/* Referral KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                Total Tracked Referrals
              </span>
              <div className="text-2xl font-serif font-bold text-forest-950">
                {referrals.length}
              </div>
              <p className="text-[10px] text-ink-400">Enquiries & bookings from repeat contacts</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Bonus Awaiting Payout
              </span>
              <div className="text-2xl font-serif font-bold text-amber-800">
                {formatINR(totalPayablePaise)}
              </div>
              <p className="text-[10px] text-ink-400">Events confirmed & ready for disbursement</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Total Bonuses Disbursed
              </span>
              <div className="text-2xl font-serif font-bold text-emerald-800">
                {formatINR(totalDisbursedPaise)}
              </div>
              <p className="text-[10px] text-ink-400">Successfully settled via UPI / Bank transfer</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-cream-200 shadow-sm flex-wrap">
            <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
              <Gift className="w-4 h-4 text-burgundy-700" />
              <span>Referral Payout Lifecycle:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All Records' },
                { id: 'registered', label: '1. Registered' },
                { id: 'earned', label: '2. Earned' },
                { id: 'payable', label: '3. Payable' },
                { id: 'disbursed', label: '4. Disbursed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-burgundy-900 text-white font-bold'
                      : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Referrer Details</th>
                    <th className="px-5 py-3">Scheme & Valuation</th>
                    <th className="px-5 py-3">Linked Event / Notes</th>
                    <th className="px-5 py-3">Lifecycle Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {filteredReferrals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-ink-500">
                        No referrals found matching the selected status.
                      </td>
                    </tr>
                  ) : (
                    filteredReferrals.map((r) => (
                      <tr key={r.id} className="hover:bg-cream-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-forest-950">{r.referrerName}</div>
                          <div className="text-[11px] text-ink-600 mt-0.5">+91 {r.referrerPhone}</div>
                          {r.upiId && (
                            <div className="text-[10px] text-burgundy-700 font-mono mt-0.5">
                              UPI: {r.upiId}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-bold text-forest-900 text-sm">
                            {formatINR(r.bonusPaise)}
                          </div>
                          <div className="text-[10px] text-ink-500 uppercase font-semibold">
                            {r.scheme === 'flat' ? 'Flat Cash Reward' : '5% Base Rent Commission'}
                          </div>
                        </td>

                        <td className="px-5 py-4 max-w-xs">
                          <div className="text-ink-800 font-medium">{r.notes || 'Direct enquiry referral'}</div>
                          <div className="text-[10px] text-ink-400 mt-0.5">
                            Created: {formatDate(r.createdAt.split('T')[0])}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <Badge
                            variant={
                              r.status === 'disbursed'
                                ? 'success'
                                : r.status === 'payable'
                                ? 'warning'
                                : r.status === 'earned'
                                ? 'primary'
                                : 'default'
                            }
                          >
                            {r.status.toUpperCase()}
                          </Badge>
                          {r.transactionRef && (
                            <div className="text-[10px] text-gray-500 font-mono mt-1">
                              Ref: {r.transactionRef}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {r.status === 'registered' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusTransition(r, 'earned')}
                            >
                              Mark Earned
                            </Button>
                          )}
                          {r.status === 'earned' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusTransition(r, 'payable')}
                            >
                              Approve Payable
                            </Button>
                          )}
                          {r.status === 'payable' && (
                            <Button
                              variant="gold"
                              size="sm"
                              onClick={() => handleOpenPayout(r)}
                              leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                            >
                              Disburse Bonus
                            </Button>
                          )}
                          {r.status === 'disbursed' && (
                            <span className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payout Disbursement Modal */}
      {selectedReferral && (
        <Modal
          isOpen={payoutModalOpen}
          onClose={() => setPayoutModalOpen(false)}
          title="Disburse Referral Bonus Payout"
        >
          <form onSubmit={handleConfirmPayout} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Beneficiary:</span>
                <span className="font-bold text-gray-900">{selectedReferral.referrerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-bold text-gray-900">+91 {selectedReferral.referrerPhone}</span>
              </div>
              {selectedReferral.upiId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">UPI ID:</span>
                  <span className="font-mono font-bold text-burgundy-800">{selectedReferral.upiId}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-cream-300 pt-1.5 mt-1">
                <span className="text-gray-700 font-bold">Disbursement Amount:</span>
                <span className="font-bold text-base text-forest-950">
                  {formatINR(selectedReferral.bonusPaise)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Bank / UPI Transaction Reference Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. UPI-99881230491 or NEFT-HDFC001928"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Accounting / Audit Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Paid via Google Pay on ICICI Bank account"
                value={payoutNotes}
                onChange={(e) => setPayoutNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setPayoutModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="gold" size="md" type="submit">
                Confirm & Record Disbursement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
