import React from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Calendar,
  IndianRupee,
  Clock,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { formatINR, formatDate, formatTime12h } from '../../lib/formatters';
import { HALLS } from '../../data/venueData';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const OverviewPage: React.FC = () => {
  const enquiries = StorageService.getEnquiries();
  const bookings = StorageService.getBookings();
  const payments = StorageService.getPayments();
  const tasks = StorageService.getStaffTasks();

  const newEnquiries = enquiries.filter((e) => e.status === 'new');
  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalCollectedPaise = payments.reduce((acc, p) => acc + p.amountPaise, 0);
  const pendingTasks = tasks.filter((t) => t.status !== 'done');

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">
            Operations & Venue Overview
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Real-time pipeline, upcoming events, and financial reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/bookings">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New Booking
            </Button>
          </Link>
          <Link to="/admin/finance">
            <Button variant="outline" size="sm" leftIcon={<IndianRupee className="w-3.5 h-3.5" />}>
              Record Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">New Enquiries</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-forest-950">{newEnquiries.length}</div>
          <p className="text-[11px] text-amber-700 font-medium">Awaiting management callback</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Events</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-forest-950">{upcomingBookings.length}</div>
          <p className="text-[11px] text-emerald-700 font-medium">Active confirmed reservations</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Collections Received</span>
            <div className="p-2 rounded-lg bg-gold-50 text-gold-700">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-forest-950">
            {formatINR(totalCollectedPaise)}
          </div>
          <p className="text-[11px] text-ink-500">Actual dated receipts recorded</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Tasks</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-forest-950">{pendingTasks.length}</div>
          <p className="text-[11px] text-ink-500">Setup & hall readiness checklists</p>
        </div>
      </div>

      {/* Main Grid: Upcoming Bookings & New Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Confirmed Bookings */}
        <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <h3 className="font-serif text-lg font-bold text-forest-900">Upcoming Confirmed Events</h3>
            <Link to="/admin/calendar" className="text-xs text-forest-800 hover:text-gold-700 font-semibold inline-flex items-center gap-1">
              <span>View Calendar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingBookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-forest-950">{b.customerName}</div>
                  <div className="text-ink-600 flex items-center gap-2">
                    <span className="font-semibold text-gold-700">{b.hallName}</span>
                    <span>·</span>
                    <span>{formatDate(b.eventDate)}</span>
                    <span>·</span>
                    <span>{formatTime12h(b.startTime)} - {formatTime12h(b.endTime)}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <Badge variant="success">Confirmed</Badge>
                  <div className="text-[10px] text-ink-400 mt-1">{b.reference}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Required: New Enquiries */}
        <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <h3 className="font-serif text-lg font-bold text-forest-900">Enquiries Awaiting Action</h3>
            <Link to="/admin/enquiries" className="text-xs text-forest-800 hover:text-gold-700 font-semibold inline-flex items-center gap-1">
              <span>View Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {newEnquiries.length === 0 ? (
              <p className="text-xs text-ink-500 py-6 text-center">No pending enquiries in queue.</p>
            ) : (
              newEnquiries.slice(0, 4).map((e) => (
                <div
                  key={e.id}
                  className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-forest-950">{e.customerName}</div>
                    <div className="text-ink-600">
                      {e.eventType} · {e.preferredDate} · {e.estimatedGuests} guests
                    </div>
                    <div className="text-[11px] text-ink-500 font-mono">+91 {e.customerPhone}</div>
                  </div>

                  <Link to={`/admin/enquiries?id=${e.id}`}>
                    <Button variant="outline" size="sm">
                      Respond
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Hall Utilization Cards */}
      <div className="p-6 rounded-2xl bg-white border border-cream-200 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest-900 border-b border-cream-200 pb-3">
          Hall Availability & Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HALLS.map((hall) => {
            const hallBookings = bookings.filter((b) => b.hallId === hall.id && b.status === 'confirmed');
            return (
              <div key={hall.id} className="p-4 rounded-xl bg-cream-50 border border-cream-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-forest-950 text-sm">{hall.name}</h4>
                  <Badge variant={hall.airConditioned ? 'gold' : 'default'}>
                    {hall.airConditioned ? 'AC' : 'Non-AC'}
                  </Badge>
                </div>
                <div className="text-xs text-ink-600">{hall.floor} · {hall.capacityText}</div>
                <div className="text-xs text-forest-800 font-semibold pt-1">
                  {hallBookings.length} Upcoming Event{hallBookings.length === 1 ? '' : 's'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
