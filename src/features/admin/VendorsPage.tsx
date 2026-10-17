import React, { useState } from 'react';
import { Phone, Plus, MessageCircle, Star, Utensils } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Vendor } from '../../types/models';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const VendorsPage: React.FC = () => {
  const { success } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>(() => StorageService.getVendors());
  const [modalOpen, setModalOpen] = useState(false);

  // New Vendor State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Vendor['category']>('Electrical');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isPreferredCaterer, setIsPreferredCaterer] = useState(false);
  const [cuisineSpecialties, setCuisineSpecialties] = useState('Traditional Kerala Sadhya, Buffet');

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    StorageService.createVendor({
      name: name.trim(),
      category,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      status: 'active',
      notes: notes.trim(),
      isPreferredCaterer: isPreferredCaterer || category === 'Catering Equipment',
      cuisineSpecialties: cuisineSpecialties.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setVendors(StorageService.getVendors());
    setModalOpen(false);
    setName('');
    setPhone('');
    setIsPreferredCaterer(false);
    success('Vendor Added', `Supplier ${name} saved to vendor directory.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">Vendors & Suppliers</h1>
          <p className="text-xs text-ink-500 mt-1">
            Contracted facility service providers (Solar power, AV/sound, deep cleaning, florals)
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Supplier / Vendor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((v) => (
          <div
            key={v.id}
            className="p-6 rounded-2xl bg-white border border-cream-200 shadow-subtle flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-700 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-300">
                  {v.category}
                </span>
                <Badge variant={v.status === 'active' ? 'success' : 'default'}>
                  {v.status.toUpperCase()}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-forest-950">{v.name}</h3>
                  {v.isPreferredCaterer && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                      <span>Preferred Caterer</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-ink-600 mt-2">
                  <div className="text-ink-800 font-semibold">Contact: {v.contactPerson}</div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${v.phone}`}
                      className="flex items-center gap-1.5 text-forest-800 hover:text-gold-700 font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-600" />
                      <span>+91 {v.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/91${v.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(v.name)}%2C%20regarding%20Thekkanath%20Souparnika%20event%20catering.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {v.cuisineSpecialties && v.cuisineSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {v.cuisineSpecialties.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-cream-100 text-[10px] font-medium text-forest-900"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {v.notes && (
                <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs text-ink-700">
                  {v.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Vendor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Vendor / Contractor"
        subtitle="Save external contractor contacts for facilities maintenance or event support."
        maxWidth="md"
      >
        <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-ink-800">Business / Supplier Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kerala Sound & Lighting"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              <option value="Electrical">Electrical (Solar/Battery)</option>
              <option value="Sound & AV">Sound & AV Systems</option>
              <option value="Cleaning">Cleaning & Housekeeping</option>
              <option value="Florist / Decor">Florist / Decor</option>
              <option value="Catering Equipment">Catering Equipment</option>
              <option value="Plumbing">Plumbing & Water</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Contact Person *</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-ink-800">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Notes / Scope of Work</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit">
              Save Supplier
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
