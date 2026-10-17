import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { AuditLogEntry } from '../../types/models';
import { Badge } from '../../components/ui/Badge';

export const AuditLogPage: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(() => StorageService.getAuditLogs());
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actorName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.targetType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">
            Security & Audit Trail
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Immutable log of booking confirmations, payment records, and configuration modifications
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, or event description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Timestamp (IST)</th>
              <th className="px-5 py-3">Actor / Staff</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Target Entity</th>
              <th className="px-5 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-cream-50/80">
                <td className="px-5 py-4 text-ink-500 font-mono text-[11px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-5 py-4">
                  <div className="font-bold text-forest-950">{log.actorName}</div>
                  <div className="text-[10px] uppercase font-semibold text-gold-700">
                    {log.actorRole.replace('_', ' ')}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="gold">{log.action}</Badge>
                </td>
                <td className="px-5 py-4 font-semibold text-ink-800">{log.targetType}</td>
                <td className="px-5 py-4 text-ink-700 max-w-md">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
