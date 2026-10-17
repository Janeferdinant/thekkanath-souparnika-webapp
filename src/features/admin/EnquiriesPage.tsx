import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookmarkCheck,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Enquiry, EnquiryStatus } from '../../types/models';
import { formatDate, formatTime12h } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { QuotationModal } from '../../components/admin/QuotationModal';

export const EnquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => StorageService.getEnquiries());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Note update state
  const [noteText, setNoteText] = useState('');
  const lostReason = 'Customer marked enquiry as lost / not proceeding';

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.customerName.toLowerCase().includes(q) ||
        e.customerPhone.includes(q) ||
        e.reference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    const updated = StorageService.updateEnquiry(selectedEnquiry.id, {
      status: newStatus,
      lostReason: newStatus === 'lost' ? lostReason : undefined,
    });
    if (updated) {
      setEnquiries(StorageService.getEnquiries());
      setSelectedEnquiry(updated);
      success('Status Updated', `Enquiry ${updated.reference} set to ${newStatus.toUpperCase()}`);
    }
  };

  const handleAddNote = () => {
    if (!selectedEnquiry || !noteText.trim()) return;
    const updatedNotes = selectedEnquiry.notes
      ? `${selectedEnquiry.notes}\n[${new Date().toLocaleDateString('en-IN')}] ${noteText.trim()}`
      : `[${new Date().toLocaleDateString('en-IN')}] ${noteText.trim()}`;

    const updated = StorageService.updateEnquiry(selectedEnquiry.id, {
      notes: updatedNotes,
    });
    if (updated) {
      setEnquiries(StorageService.getEnquiries());
      setSelectedEnquiry(updated);
      setNoteText('');
      success('Note Added', 'Internal follow-up note saved.');
    }
  };

  const handleConvertToBooking = (e: Enquiry) => {
    // Navigate to bookings page with query params prefilled
    navigate(`/admin/bookings?convertEnquiryId=${e.id}`);
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="warning">New Lead</Badge>;
      case 'contacted':
        return <Badge variant="info">Contacted</Badge>;
      case 'quoted':
        return <Badge variant="gold">Quoted</Badge>;
      case 'converted_to_booking':
        return <Badge variant="success">Converted to Booking</Badge>;
      case 'lost':
        return <Badge variant="danger">Lost Lead</Badge>;
      default:
        return <Badge variant="default">{status.replace('_', ' ')}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">
            Enquiries & Leads Pipeline
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Track prospective event inquiries from public submissions and direct calls
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full md:w-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'new', label: 'New' },
            { id: 'contacted', label: 'Contacted' },
            { id: 'quoted', label: 'Quoted' },
            { id: 'converted_to_booking', label: 'Converted' },
            { id: 'lost', label: 'Lost' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === tab.id
                  ? 'bg-forest-800 text-white font-bold'
                  : 'bg-cream-100 text-ink-700 hover:bg-cream-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Reference / Name</th>
                <th className="px-5 py-3">Event Details</th>
                <th className="px-5 py-3">Date & Slot</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ink-500">
                    No enquiries match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-forest-950">{e.customerName}</div>
                      <div className="text-[11px] text-ink-500 font-mono mt-0.5">{e.reference}</div>
                      <div className="text-[11px] text-ink-600 font-medium mt-0.5">
                        +91 {e.customerPhone}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink-900">{e.eventType}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">
                        {e.estimatedGuests} guests
                      </div>
                      <div className="text-[11px] text-gold-700 font-medium mt-0.5">
                        {e.preferredHallId === 'any' ? 'Any Hall' : e.preferredHallId}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-ink-900">{formatDate(e.preferredDate)}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">
                        {formatTime12h(e.startTime || '')} - {formatTime12h(e.endTime || '')}
                      </div>
                    </td>

                    <td className="px-5 py-4">{getStatusBadge(e.status)}</td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEnquiry(e)}
                        >
                          Details & Notes
                        </Button>
                        {e.status !== 'converted_to_booking' && (
                          <Button
                            variant="gold"
                            size="sm"
                            onClick={() => handleConvertToBooking(e)}
                            leftIcon={<BookmarkCheck className="w-3.5 h-3.5" />}
                          >
                            Convert
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Drawer Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={Boolean(selectedEnquiry)}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.reference}`}
          subtitle={`Submitted on ${new Date(selectedEnquiry.createdAt).toLocaleDateString('en-IN')}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs">
            {/* Quick Status Bar */}
            <div className="p-4 rounded-xl bg-cream-100 border border-cream-300 flex items-center justify-between gap-3">
              <div>
                <span className="text-ink-500 block text-[10px] uppercase font-bold">Current Status</span>
                <div className="mt-1">{getStatusBadge(selectedEnquiry.status)}</div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setQuoteModalOpen(true)}
                  leftIcon={<FileText className="w-3.5 h-3.5" />}
                >
                  Generate Quotation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('contacted')}
                >
                  Mark Contacted
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('quoted')}
                >
                  Mark Quoted
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange('lost')}
                >
                  Mark Lost
                </Button>
              </div>
            </div>

            {/* Customer & Event Details */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-cream-200">
              <div>
                <span className="text-ink-500">Customer Name:</span>
                <p className="font-bold text-forest-950 text-sm mt-0.5">
                  {selectedEnquiry.customerName}
                </p>
              </div>
              <div>
                <span className="text-ink-500">Phone:</span>
                <p className="font-bold text-forest-950 text-sm mt-0.5">
                  +91 {selectedEnquiry.customerPhone}
                </p>
              </div>
              <div>
                <span className="text-ink-500">Event Type:</span>
                <p className="font-semibold text-ink-900 mt-0.5">{selectedEnquiry.eventType}</p>
              </div>
              <div>
                <span className="text-ink-500">Estimated Guests:</span>
                <p className="font-semibold text-ink-900 mt-0.5">
                  {selectedEnquiry.estimatedGuests} guests
                </p>
              </div>
              <div>
                <span className="text-ink-500">Requested Date:</span>
                <p className="font-semibold text-ink-900 mt-0.5">
                  {formatDate(selectedEnquiry.preferredDate)}
                </p>
              </div>
              <div>
                <span className="text-ink-500">Time Slot:</span>
                <p className="font-semibold text-ink-900 mt-0.5">
                  {formatTime12h(selectedEnquiry.startTime || '')} -{' '}
                  {formatTime12h(selectedEnquiry.endTime || '')}
                </p>
              </div>
            </div>

            {/* Special Requests */}
            {selectedEnquiry.specialRequests && (
              <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 space-y-1">
                <span className="font-bold text-ink-700">Special Notes / Requirements:</span>
                <p className="text-ink-600 leading-relaxed">{selectedEnquiry.specialRequests}</p>
              </div>
            )}

            {/* Internal Staff Notes */}
            <div className="space-y-2">
              <span className="font-bold text-forest-950 block">Follow-Up Notes & History:</span>
              <div className="p-3 rounded-xl bg-white border border-cream-200 max-h-32 overflow-y-auto font-mono text-[11px] text-ink-800 whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.notes || 'No notes added yet.'}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add note (e.g. customer called, invited for site visit)..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-white border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
                <Button variant="primary" size="sm" onClick={handleAddNote}>
                  Save Note
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
              <a
                href={`https://wa.me/91${selectedEnquiry.customerPhone}?text=Hello%20${selectedEnquiry.customerName}%2C%20regarding%20your%20enquiry%20${selectedEnquiry.reference}%20at%20Thekkanath%20Souparnika...`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="sm" leftIcon={<MessageCircle className="w-3.5 h-3.5" />}>
                  WhatsApp Customer
                </Button>
              </a>

              {selectedEnquiry.status !== 'converted_to_booking' && (
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => {
                    handleConvertToBooking(selectedEnquiry);
                    setSelectedEnquiry(null);
                  }}
                  leftIcon={<BookmarkCheck className="w-4 h-4" />}
                >
                  Convert to Booking
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Client Quotation Suite Modal */}
      {selectedEnquiry && (
        <QuotationModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          initialData={{
            customerName: selectedEnquiry.customerName,
            customerPhone: selectedEnquiry.customerPhone,
            customerEmail: selectedEnquiry.customerEmail,
            hallName:
              selectedEnquiry.preferredHallId === 'auditorium' ||
              selectedEnquiry.preferredHallId === 'any'
                ? 'Thekkanath Souparnika (Full Venue)'
                : selectedEnquiry.preferredHallId,
            eventDate: selectedEnquiry.preferredDate,
            session: selectedEnquiry.session || 'morning',
          }}
          onQuoteSaved={() => {
            handleStatusChange('quoted');
          }}
        />
      )}
    </div>
  );
};
