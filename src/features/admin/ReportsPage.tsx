import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download } from 'lucide-react';
import { formatINR } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';

export const ReportsPage: React.FC = () => {

  // Hall utilization data
  const hallData = [
    { name: 'Stage Hall', bookings: 5, revenueRupees: 185000 },
    { name: 'Welcome Hall', bookings: 3, revenueRupees: 90000 },
    { name: 'Dining Hall', bookings: 4, revenueRupees: 152000 },
    { name: 'Open Hall', bookings: 2, revenueRupees: 50000 },
  ];

  // Event Type Distribution Data
  const eventDistribution = [
    { name: 'Weddings & Receptions', value: 45, color: '#234435' },
    { name: 'Ceremonies & Rituals', value: 25, color: '#c9a66a' },
    { name: 'Seminars & Conferences', value: 15, color: '#386a54' },
    { name: 'Family Feasts & Gatherings', value: 15, color: '#9ec4b3' },
  ];

  // Export Summary Report
  const handleExport = () => {
    const csv =
      'Hall,Confirmed_Bookings,Valuation_INR\n' +
      hallData.map((h) => `"${h.name}",${h.bookings},${h.revenueRupees}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Thekkanath_Souparnika_Reports_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">
            Reports & Analytics
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Data-grounded visualizations of bookings, hall utilization, and revenue performance
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export Analytics CSV
        </Button>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hall Utilization Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-forest-900">
              Hall Booking Volume
            </h3>
            <p className="text-xs text-ink-500">
              Comparative event bookings across all four halls
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#555' }} />
                <YAxis tick={{ fontSize: 11, fill: '#555' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1b3328',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="bookings" name="Events Booked" fill="#234435" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Type Pie Chart */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-forest-900">
              Event Types Distribution
            </h3>
            <p className="text-xs text-ink-500">
              Proportion of event categories hosted at the venue
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {eventDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1b3328',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hall Performance Table */}
      <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest-900 border-b border-cream-200 pb-3">
          Detailed Hall Utilization Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Hall</th>
                <th className="px-5 py-3">Air Conditioning</th>
                <th className="px-5 py-3">Stated Max Capacity</th>
                <th className="px-5 py-3">Confirmed Bookings</th>
                <th className="px-5 py-3 text-right">Agreed Event Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {hallData.map((h, idx) => (
                <tr key={idx} className="hover:bg-cream-50/80">
                  <td className="px-5 py-4 font-bold text-forest-950">{h.name}</td>
                  <td className="px-5 py-4">
                    {h.name === 'Open Hall' ? 'Natural Airflow & Fans' : 'Air-Conditioned'}
                  </td>
                  <td className="px-5 py-4 text-ink-600">Up to 100 guests</td>
                  <td className="px-5 py-4 font-bold text-forest-900">{h.bookings}</td>
                  <td className="px-5 py-4 text-right font-bold text-emerald-800">
                    {formatINR(h.revenueRupees * 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
