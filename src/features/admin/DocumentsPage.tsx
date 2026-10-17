import React, { useState } from 'react';
import { FileText, Download, Upload, Lock } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { DocumentRecord } from '../../types/models';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const DocumentsPage: React.FC = () => {
  const { success } = useToast();
  const [documents, setDocuments] = useState<DocumentRecord[]>(() =>
    StorageService.getDocuments()
  );
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentRecord['category']>('brochure');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      name: docName.trim(),
      category: docCategory,
      fileSize: '320 KB',
      uploadedBy: 'Venue Staff',
      createdAt: new Date().toISOString(),
    };

    setDocuments([newDoc, ...documents]);
    setUploadModalOpen(false);
    setDocName('');
    success('Document Uploaded', `File "${newDoc.name}" added to private repository.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-950">Document Repository</h1>
          <p className="text-xs text-ink-500 mt-1">
            Private storage for licenses, water purity certificates, quotations, and official brochures
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setUploadModalOpen(true)}
          leftIcon={<Upload className="w-3.5 h-3.5" />}
        >
          Upload Document
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 border-b border-cream-200 text-ink-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Document Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">File Size</th>
              <th className="px-5 py-3">Uploaded By</th>
              <th className="px-5 py-3">Upload Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {documents.map((d) => (
              <tr key={d.id} className="hover:bg-cream-50/80">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5 font-bold text-forest-950">
                    <FileText className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="gold">{d.category.toUpperCase()}</Badge>
                </td>
                <td className="px-5 py-4 text-ink-600">{d.fileSize}</td>
                <td className="px-5 py-4 text-ink-800">{d.uploadedBy}</td>
                <td className="px-5 py-4 text-ink-600">
                  {new Date(d.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => success('Download Started', `Authorized access granted for ${d.name}`)}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Security Note */}
      <div className="p-5 rounded-2xl bg-forest-900 text-cream-100 border border-forest-800 text-xs flex items-start gap-3">
        <Lock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block text-gold-300 font-serif text-sm">Role-Based Access Control</strong>
          <p className="text-cream-300 leading-relaxed text-[11px]">
            In production mode with Supabase Storage, documents are placed in private buckets protected by Row-Level Security. Unauthenticated public users cannot inspect or download internal invoices or contracts.
          </p>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Business Document"
        subtitle="Upload file to secure storage with role access metadata."
        maxWidth="md"
      >
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-ink-800">Document Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Fire_Safety_Inspection_Certificate_2026.pdf"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800">Category *</label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-white"
            >
              <option value="license">License & Compliance</option>
              <option value="brochure">Brochure & Collateral</option>
              <option value="quotation">Approved Quotation</option>
              <option value="receipt">Payment Receipt</option>
              <option value="maintenance">Maintenance Evidence</option>
              <option value="contract">Vendor Contract</option>
            </select>
          </div>

          <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="md" type="submit">
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
