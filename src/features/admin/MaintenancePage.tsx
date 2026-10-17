import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { MaintenanceBlock } from '../../types/models';
import { HALLS } from '../../data/venueData';
import { formatDate, formatTime12h } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const MaintenancePage: React.FC = () => {
  const { success, error } = useToast();
  const [maintenance, setMaintenance] = useState<MaintenanceBlock[]>(() =>
    StorageService.getMaintenanceBlocks()
  );
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [hallId, setHallId] = useState(HALLS[0].id);
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [assignedTo, setAssignedTo] = useState('');

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    const hall = HALLS.find((h) => h.id === hallId);
    const hallName = hall ? hall.name : 'Selected Hall';

    // Conflict check with existing bookings
    const bookings = StorageService.getBookings();
    const hasBookingConflict = bookings.some((b) => {
      if (b.hallId !== hallId) return false;
      if (b.status === 'cancelled') return false;
      if (b.eventDate === startDate) {
        return b.startTime < endTime && b.endTime > startTime;
      }
      return false;
    });

    if (hasBookingConflict) {
      error(
        'Schedule Conflict',
        `A confirmed event is already scheduled in ${hallName} during this time. Please resolve or choose a different slot.`
      );
      return;
    }

    StorageService.createMaintenanceBlock({
      hallId,
      hallName,
      startDate,
      endDate: startDate,
      startTime,
      endTime,
      title: title.trim(),
      reason: reason.trim(),
      status: 'scheduled',
      assignedTo: assignedTo.trim() || undefined,
    });

    setMaintenance(StorageService.getMaintenanceBlocks());
    setModalOpen(false);
    setTitle('');
    setReason('');
    success('Maintenance Block Created', `Hall "${hallName}" is reserved for maintenance on ${startDate}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">
            Facilities & Maintenance
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Scheduled maintenance blocks, facility inspections, and calendar closures
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Schedule Maintenance Block
        </Button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Hall & Maintenance Title</th>
              <th className="px-5 py-3">Scheduled Dates</th>
              <th className="px-5 py-3">Time Window</th>
              <th className="px-5 py-3">Assigned Technician / Vendor</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {maintenance.map((m) => (
              <tr key={m.id} className="hover:bg-cream-50/80">
                <td className="px-5 py-4">
                  <div className="font-bold text-forest-950">{m.title}</div>
                  <div className="text-[11px] text-gold-700 font-semibold mt-0.5">{m.hallName}</div>
                  {m.reason && <p className="text-[11px] text-ink-500 mt-1">{m.reason}</p>}
                </td>

                <td className="px-5 py-4 font-medium text-ink-800">
                  {formatDate(m.startDate)}
                  {m.endDate && m.endDate !== m.startDate && ` to ${formatDate(m.endDate)}`}
                </td>

                <td className="px-5 py-4 text-ink-600">
                  {formatTime12h(m.startTime)} - {formatTime12h(m.endTime)}
                </td>

                <td className="px-5 py-4 text-ink-800">{m.assignedTo || 'Unassigned'}</td>

                <td className="px-5 py-4">
                  <Badge variant={m.status === 'completed' ? 'success' : 'warning'}>
                    {m.status.toUpperCase()}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Facility Maintenance"
        subtitle="This will block the hall from new booking confirmations during the specified slot."
        maxWidth="md"
      >
        <form onSubmit={handleCreateBlock} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-ink-800">Affected Hall *</label>
            <select
              value={hallId}
              onChange={(e) => setHallId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              {HALLS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.floor})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Maintenance Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. AC Filter Deep Cleaning & Gas Check"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Scope / Reason</label>
            <textarea
              rows={2}
              placeholder="Explain required service..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">Assigned Vendor / Staff</label>
              <input
                type="text"
                placeholder="e.g. SunTech Solar"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Start Time *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-800">End Time *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit">
              Verify & Lock Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
