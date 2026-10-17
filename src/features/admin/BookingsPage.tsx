import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  AlertTriangle,
  Mail,
  ArrowUpDown,
  Sun,
  Moon,
  Calendar,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Booking, BookingStatus, EventType } from '../../types/models';
import { HALLS } from '../../data/venueData';
import { formatDate, formatTime12h, formatINR, generateReference } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { EmailActivityDrawer } from '../../components/admin/EmailActivityDrawer';
import { sortBookingsByEventDate } from '../../lib/adminEngine';

export const BookingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const convertEnquiryId = searchParams.get('convertEnquiryId');
  const { success, error } = useToast();

  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'upcoming' | 'desc' | 'created'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [emailDrawerOpen, setEmailDrawerOpen] = useState(false);

  // New Booking Modal State
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [hallId, setHallId] = useState(HALLS[0].id);
  const [eventType, setEventType] = useState<EventType>('Wedding & Reception');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('14:00');
  const [guestCount, setGuestCount] = useState(80);
  const bookingStatus: BookingStatus = 'confirmed';
  const [totalAgreedRupees, setTotalAgreedRupees] = useState<number>(35000);
  const [advancePaidRupees, setAdvancePaidRupees] = useState<number>(10000);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [creationError, setCreationError] = useState<string | null>(null);

  // Auto-open modal if convertEnquiryId is present
  useEffect(() => {
    if (convertEnquiryId) {
      const enq = StorageService.getEnquiryById(convertEnquiryId);
      if (enq) {
        setCustomerName(enq.customerName);
        setCustomerPhone(enq.customerPhone);
        setCustomerEmail(enq.customerEmail);
        setEventType(enq.eventType);
        setEventDate(enq.preferredDate);
        if (enq.startTime) setStartTime(enq.startTime);
        if (enq.endTime) setEndTime(enq.endTime);
        if (enq.preferredHallId && enq.preferredHallId !== 'any') {
          setHallId(enq.preferredHallId);
        }
        setGuestCount(enq.estimatedGuests);
        setSpecialRequirements(enq.specialRequests || '');
        setNewBookingModalOpen(true);
      }
    }
  }, [convertEnquiryId]);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        b.hallName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortOrder === 'upcoming') {
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    }
    if (sortOrder === 'desc') {
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setCreationError(null);

    const hall = HALLS.find((h) => h.id === hallId);
    const hallName = hall ? hall.name : 'Selected Hall';

    const result = StorageService.createBooking({
      reference: generateReference('TS-BKG'),
      enquiryId: convertEnquiryId || undefined,
      customerId: `cust-${Date.now()}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      hallId,
      hallName,
      eventType,
      eventDate,
      startTime,
      endTime,
      guestCount,
      status: bookingStatus,
      totalAgreedPaise: Math.round(totalAgreedRupees * 100),
      advancePaidPaise: Math.round(advancePaidRupees * 100),
      specialRequirements: specialRequirements.trim(),
    });

    if (!result.success) {
      setCreationError(result.error || 'Failed to create booking.');
      return;
    }

    // If converted from enquiry, mark enquiry converted
    if (convertEnquiryId) {
      StorageService.updateEnquiry(convertEnquiryId, {
        status: 'converted_to_booking',
      });
    }

    setBookings(StorageService.getBookings());
    setNewBookingModalOpen(false);
    success('Booking Confirmed', `Booking ${result.booking?.reference} created successfully with conflict validation.`);
  };

  const handleCancelBooking = (bookingId: string) => {
    const updated = StorageService.updateBooking(bookingId, {
      status: 'cancelled',
      cancellationReason: 'Cancelled by staff request with audit log',
    });

    if (updated.success) {
      setBookings(StorageService.getBookings());
      setSelectedBooking(null);
      success('Booking Cancelled', 'Reservation status updated to CANCELLED and hall freed on calendar.');
    } else {
      error('Error', updated.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">
            Booking Management
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Confirmed reservations, tentative holds, and atomic conflict prevention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setEmailDrawerOpen(true)}
            leftIcon={<Mail className="w-4 h-4 text-burgundy-700" />}
          >
            Email Activity
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setCreationError(null);
              setNewBookingModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Booking
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, customer, or hall..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'tentative_hold', label: 'Holds' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
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

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 bg-cream-50 px-2.5 py-1 rounded-xl border border-cream-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'upcoming' | 'desc' | 'created')}
              className="bg-transparent text-gray-700 font-medium focus:outline-none text-xs cursor-pointer"
            >
              <option value="upcoming">Sort: Upcoming Event (Asc)</option>
              <option value="desc">Sort: Event Date (Desc)</option>
              <option value="created">Sort: Recently Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Reference / Customer</th>
                <th className="px-5 py-3">Hall & Event</th>
                <th className="px-5 py-3">Date & Slot</th>
                <th className="px-5 py-3">Valuation & Advance</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {sortedBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                sortedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-forest-950">{b.customerName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cream-200 text-forest-900 font-medium">
                          {b.allocatedAccount || 'Account 1'}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-500 font-mono mt-0.5">{b.reference}</div>
                      <div className="text-[11px] text-ink-600 font-medium mt-0.5">
                        +91 {b.customerPhone}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-forest-900">{b.hallName}</div>
                      <div className="text-[11px] text-ink-600 mt-0.5">{b.eventType}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">{b.guestCount} guests</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink-900">{formatDate(b.eventDate)}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">
                        {formatTime12h(b.startTime)} - {formatTime12h(b.endTime)}
                      </div>
                      {b.session && (
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              b.session === 'morning'
                                ? 'bg-amber-100 text-amber-900'
                                : b.session === 'evening'
                                ? 'bg-indigo-100 text-indigo-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {b.session === 'morning' ? (
                              <Sun className="w-3 h-3" />
                            ) : b.session === 'evening' ? (
                              <Moon className="w-3 h-3" />
                            ) : (
                              <Calendar className="w-3 h-3" />
                            )}
                            <span>{b.session.replace('_', ' ')}</span>
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {b.totalAgreedPaise ? (
                        <div className="font-semibold text-forest-950">
                          {formatINR(b.totalAgreedPaise)}
                        </div>
                      ) : (
                        <span className="text-ink-400">Quote Pending</span>
                      )}
                      {b.advancePaidPaise ? (
                        <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
                          Adv: {formatINR(b.advancePaidPaise)}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          b.status === 'confirmed'
                            ? 'success'
                            : b.status === 'tentative_hold'
                            ? 'warning'
                            : b.status === 'cancelled'
                            ? 'danger'
                            : 'default'
                        }
                      >
                        {b.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBooking(b)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Details: ${selectedBooking.reference}`}
          subtitle={`Event Date: ${formatDate(selectedBooking.eventDate)}`}
          maxWidth="md"
        >
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-xl bg-cream-100 border border-cream-300 grid grid-cols-2 gap-3">
              <div>
                <span className="text-ink-500">Hall:</span>
                <p className="font-bold text-forest-950 text-sm mt-0.5">{selectedBooking.hallName}</p>
              </div>
              <div>
                <span className="text-ink-500">Status:</span>
                <p className="font-bold text-forest-950 text-sm mt-0.5">
                  {selectedBooking.status.toUpperCase()}
                </p>
              </div>
              <div>
                <span className="text-ink-500">Customer:</span>
                <p className="font-bold text-forest-950 text-sm mt-0.5">
                  {selectedBooking.customerName}
                </p>
              </div>
              <div>
                <span className="text-ink-500">Phone:</span>
                <p className="font-bold text-forest-950 text-sm mt-0.5">
                  +91 {selectedBooking.customerPhone}
                </p>
              </div>
              <div>
                <span className="text-ink-500">Slot Timing:</span>
                <p className="font-semibold text-ink-900 mt-0.5">
                  {formatTime12h(selectedBooking.startTime)} - {formatTime12h(selectedBooking.endTime)}
                </p>
              </div>
              <div>
                <span className="text-ink-500">Guest Count:</span>
                <p className="font-semibold text-ink-900 mt-0.5">{selectedBooking.guestCount} guests</p>
              </div>
            </div>

            {selectedBooking.specialRequirements && (
              <div className="p-3 rounded-xl bg-white border border-cream-200">
                <span className="font-bold text-ink-800">Requirements / Notes:</span>
                <p className="text-ink-600 mt-1">{selectedBooking.specialRequirements}</p>
              </div>
            )}

            {selectedBooking.status !== 'cancelled' && (
              <div className="pt-3 border-t border-cream-200 flex justify-between items-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                >
                  Cancel Booking
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create New Booking Modal with Atomic Conflict Check */}
      <Modal
        isOpen={newBookingModalOpen}
        onClose={() => setNewBookingModalOpen(false)}
        title="Create & Verify Booking"
        subtitle="Backend validation checks for overlapping time slots and maintenance closures before confirmation."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
          {creationError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Booking Conflict Detected:</strong>
                <span>{creationError}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Customer Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Customer Phone *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Select Hall *</label>
              <select
                value={hallId}
                onChange={(e) => setHallId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              >
                {HALLS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.floor} · {h.airConditioned ? 'AC' : 'Non-AC'})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Event Type *</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              >
                <option value="Wedding & Reception">Wedding & Reception</option>
                <option value="Ceremony / Ritual">Ceremony / Ritual</option>
                <option value="Family Gathering">Family Gathering</option>
                <option value="Seminar / Conference">Seminar / Conference</option>
                <option value="Cultural Programme">Cultural Programme</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Event Date *</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Guest Count *</label>
              <input
                type="number"
                min="10"
                max="300"
                required
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Start Time (HH:mm) *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">End Time (HH:mm) *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Initial Agreed Valuation (₹)</label>
              <input
                type="number"
                value={totalAgreedRupees}
                onChange={(e) => setTotalAgreedRupees(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Advance Paid (₹)</label>
              <input
                type="number"
                value={advancePaidRupees}
                onChange={(e) => setAdvancePaidRupees(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Special Requirements & Setup Notes</label>
            <textarea
              rows={2}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setNewBookingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit">
              Verify & Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* In-App Email Activity Drawer */}
      <EmailActivityDrawer isOpen={emailDrawerOpen} onClose={() => setEmailDrawerOpen(false)} />
    </div>
  );
};
