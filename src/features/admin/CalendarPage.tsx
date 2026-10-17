import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { HALLS } from '../../data/venueData';
import { Booking, MaintenanceBlock } from '../../types/models';
import { formatDate, formatTime12h, formatINR } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const CalendarPage: React.FC = () => {
  const [selectedHall, setSelectedHall] = useState<string>('all');
  const [viewDate, setViewDate] = useState<Date>(new Date(2026, 10, 1)); // November 2026
  const [selectedItem, setSelectedItem] = useState<{
    type: 'booking' | 'maintenance';
    item: Booking | MaintenanceBlock;
  } | null>(null);

  const bookings = StorageService.getBookings();
  const maintenance = StorageService.getMaintenanceBlocks();

  // Month navigation
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  // Compute days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // Filter bookings for selected hall
  const filteredBookings = bookings.filter((b) => {
    if (selectedHall !== 'all' && b.hallId !== selectedHall) return false;
    return true;
  });

  const filteredMaintenance = maintenance.filter((m) => {
    if (selectedHall !== 'all' && m.hallId !== selectedHall) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">
            Booking & Availability Calendar
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Timezone: Asia/Kolkata · Four halls monitored individually for schedule conflicts
          </p>
        </div>

        {/* Hall Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-600" />
          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-cream-300 bg-white text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="all">All Halls (Stage, Welcome, Dining, Open)</option>
            {HALLS.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.airConditioned ? 'AC' : 'Non-AC'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Controls & Month Header */}
      <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-serif text-xl font-bold text-forest-950">{monthName}</h2>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600"></span>
            <span className="text-ink-700">Confirmed Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span className="text-ink-700">Tentative Hold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-600"></span>
            <span className="text-ink-700">Maintenance Block</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-cream-100/70 border-b border-cream-200 text-center py-2.5 text-xs font-bold text-ink-700 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-cream-200">
          {paddingArray.map((_, idx) => (
            <div key={`pad-${idx}`} className="min-h-[110px] bg-cream-50/40 p-2" />
          ))}

          {daysArray.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayBookings = filteredBookings.filter((b) => b.eventDate === dateStr);
            const dayMaintenance = filteredMaintenance.filter(
              (m) => m.startDate <= dateStr && m.endDate >= dateStr
            );

            return (
              <div
                key={`day-${day}`}
                className="min-h-[110px] p-2 hover:bg-cream-50 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-900">{day}</span>
                  {dayBookings.length + dayMaintenance.length > 0 && (
                    <span className="text-[10px] text-ink-400 font-semibold">
                      {dayBookings.length + dayMaintenance.length} event
                    </span>
                  )}
                </div>

                {/* Day events stack */}
                <div className="space-y-1 mt-1 flex-1">
                  {dayBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedItem({ type: 'booking', item: b })}
                      className={`px-2 py-1 rounded text-[10px] font-semibold truncate cursor-pointer transition-transform hover:scale-[1.02] ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : b.status === 'tentative_hold'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-cream-200 text-ink-700'
                      }`}
                      title={`${b.hallName}: ${b.customerName} (${b.startTime}-${b.endTime})`}
                    >
                      <span className="font-bold">{b.hallName.replace(' Hall', '')}:</span>{' '}
                      {b.customerName} ({b.startTime})
                    </div>
                  ))}

                  {dayMaintenance.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedItem({ type: 'maintenance', item: m })}
                      className="px-2 py-1 rounded text-[10px] font-semibold truncate cursor-pointer bg-rose-100 text-rose-900 border border-rose-300"
                      title={`Maintenance: ${m.title} (${m.startTime}-${m.endTime})`}
                    >
                      <span>Maint:</span> {m.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Item Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={
            selectedItem.type === 'booking'
              ? `Booking: ${(selectedItem.item as Booking).reference}`
              : `Maintenance Block: ${(selectedItem.item as MaintenanceBlock).title}`
          }
          subtitle={`Scheduled for ${
            selectedItem.type === 'booking'
              ? formatDate((selectedItem.item as Booking).eventDate)
              : (selectedItem.item as MaintenanceBlock).startDate
          }`}
          maxWidth="md"
        >
          {selectedItem.type === 'booking' ? (
            (() => {
              const b = selectedItem.item as Booking;
              return (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-cream-100 border border-cream-300 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-ink-500">Hall:</span>
                      <p className="font-bold text-forest-950 text-sm mt-0.5">{b.hallName}</p>
                    </div>
                    <div>
                      <span className="text-ink-500">Status:</span>
                      <div className="mt-0.5">
                        <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'}>
                          {b.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-ink-500">Customer:</span>
                      <p className="font-bold text-forest-950 text-sm mt-0.5">{b.customerName}</p>
                    </div>
                    <div>
                      <span className="text-ink-500">Contact:</span>
                      <p className="font-bold text-forest-950 text-sm mt-0.5">+91 {b.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-ink-500">Event Slot:</span>
                      <p className="font-semibold text-ink-900 mt-0.5">
                        {formatTime12h(b.startTime)} to {formatTime12h(b.endTime)}
                      </p>
                    </div>
                    <div>
                      <span className="text-ink-500">Guest Count:</span>
                      <p className="font-semibold text-ink-900 mt-0.5">{b.guestCount} guests</p>
                    </div>
                    {b.totalAgreedPaise && (
                      <div>
                        <span className="text-ink-500">Total Valuation:</span>
                        <p className="font-bold text-forest-900 text-sm mt-0.5">
                          {formatINR(b.totalAgreedPaise)}
                        </p>
                      </div>
                    )}
                    {b.advancePaidPaise && (
                      <div>
                        <span className="text-ink-500">Advance Paid:</span>
                        <p className="font-bold text-emerald-800 text-sm mt-0.5">
                          {formatINR(b.advancePaidPaise)}
                        </p>
                      </div>
                    )}
                  </div>

                  {b.specialRequirements && (
                    <div className="p-3 rounded-xl bg-white border border-cream-200">
                      <span className="font-bold text-ink-800">Requirements:</span>
                      <p className="text-ink-600 mt-1">{b.specialRequirements}</p>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            (() => {
              const m = selectedItem.item as MaintenanceBlock;
              return (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                    <div>
                      <span className="text-rose-900 font-bold block">Maintenance Reason:</span>
                      <p className="text-rose-800 mt-0.5">{m.reason}</p>
                    </div>
                    <div>
                      <span className="text-rose-900 font-bold block">Assigned Vendor / Staff:</span>
                      <p className="text-rose-800 mt-0.5">{m.assignedTo || 'Unassigned'}</p>
                    </div>
                    <div>
                      <span className="text-rose-900 font-bold block">Time Range:</span>
                      <p className="text-rose-800 mt-0.5">
                        {formatTime12h(m.startTime)} to {formatTime12h(m.endTime)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </Modal>
      )}
    </div>
  );
};
