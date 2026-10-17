import React, { useState } from 'react';
import { Search, Phone, Mail, MapPin } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Customer } from '../../types/models';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const CustomersPage: React.FC = () => {
  const [customers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">Customer Directory (CRM)</h1>
          <p className="text-xs text-ink-500 mt-1">
            Customer directory, past event history, and preferences
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-2xl bg-white border border-cream-200 shadow-subtle hover:shadow-luxury transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-forest-800 text-gold-400 font-bold text-sm flex items-center justify-center">
                  {c.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cream-100 text-forest-900 border border-cream-300">
                  {c.totalBookings} Event{c.totalBookings === 1 ? '' : 's'}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">{c.name}</h3>
                <div className="space-y-1 text-xs text-ink-600 mt-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold-600" />
                    <span>+91 {c.phone}</span>
                  </div>
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gold-600" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  )}
                  {c.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gold-600" />
                      <span>{c.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {c.notes && (
                <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs text-ink-700">
                  <strong className="block text-ink-900 mb-0.5">Customer Notes:</strong>
                  {c.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-cream-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(c)}>
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          subtitle={`Customer ID: ${selectedCustomer.id}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-cream-100 border border-cream-300 space-y-2">
              <div>
                <span className="text-ink-500">Contact Number:</span>
                <p className="font-bold text-forest-950 text-sm mt-0.5">
                  +91 {selectedCustomer.phone}
                </p>
              </div>
              {selectedCustomer.email && (
                <div>
                  <span className="text-ink-500">Email:</span>
                  <p className="font-bold text-forest-950 text-sm mt-0.5">
                    {selectedCustomer.email}
                  </p>
                </div>
              )}
              {selectedCustomer.address && (
                <div>
                  <span className="text-ink-500">Address:</span>
                  <p className="font-bold text-forest-950 text-sm mt-0.5">
                    {selectedCustomer.address}
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-white border border-cream-200">
              <span className="font-bold text-ink-800">Booking Summary:</span>
              <p className="text-ink-600 mt-1">
                Completed/Active Reservations: {selectedCustomer.totalBookings} event(s)
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
