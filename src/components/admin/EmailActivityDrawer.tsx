import React, { useState, useEffect } from 'react';
import { Mail, Eye, X, RefreshCw, Trash2, CheckCircle, Clock } from 'lucide-react';
import { getEmailLogs, clearEmailLogs, EmailLogEntry } from '../../lib/emailService';

interface EmailActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailActivityDrawer: React.FC<EmailActivityDrawerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<EmailLogEntry[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailLogEntry | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLogs(getEmailLogs());
    }
  }, [isOpen]);

  const handleRefresh = () => {
    setLogs(getEmailLogs());
  };

  const handleClear = () => {
    if (confirm('Clear all logged email records?')) {
      clearEmailLogs();
      setLogs([]);
      setSelectedEmail(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-burgundy-100">
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-wine-900 to-burgundy-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Mail className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-ivory-50 tracking-wide">
                Transactional Email Log
              </h2>
              <p className="text-xs text-rose-200">
                Resend integration & automated customer notifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/10 rounded text-rose-200 hover:text-white transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 hover:bg-white/10 rounded text-rose-200 hover:text-white transition"
              title="Clear Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded text-white transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream-50">
          {logs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30 text-burgundy-900" />
              <p className="text-base font-medium text-gray-600">No email records found</p>
              <p className="text-xs text-gray-500 mt-1">
                Emails sent during enquiry submission and booking confirmation will show here.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedEmail(log)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  selectedEmail?.id === log.id
                    ? 'border-burgundy-600 bg-burgundy-50/40 shadow-sm'
                    : 'border-burgundy-100 bg-white hover:border-rose-300 hover:shadow-subtle'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-burgundy-100 text-burgundy-800">
                    {log.template === 'enquiry_ack' ? 'Enquiry Acknowledgment' : 'Booking Confirmation'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(log.sentAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-sm text-gray-900 mb-1 truncate">{log.subject}</h4>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="truncate">To: {log.to}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {log.status === 'simulated' ? 'Logged (Dev)' : 'Delivered'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Preview Modal Popup if email selected */}
        {selectedEmail && (
          <div className="border-t border-burgundy-200 bg-white p-4 max-h-[50%] flex flex-col shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-burgundy-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-burgundy-800">
                  Live HTML Preview: {selectedEmail.to}
                </span>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-xs text-gray-500 hover:text-gray-800 font-medium"
              >
                Close Preview
              </button>
            </div>
            <div className="flex-1 overflow-y-auto rounded border border-gray-200">
              <iframe
                title="Email Preview"
                srcDoc={selectedEmail.htmlBody}
                className="w-full h-64 border-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
