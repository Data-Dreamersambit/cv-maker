import React from 'react';
import { Award, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { generateId } from '../../schema';

export default function CertificationsSection({ certifications = [], onChange }) {
  const handleAddCert = () => {
    const newEntry = {
      id: generateId('cert'),
      name: '',
      issuer: '',
      date: ''
    };
    onChange([...certifications, newEntry]);
  };

  const handleUpdateEntry = (id, field, value) => {
    const updated = certifications.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDeleteEntry = (id) => {
    onChange(certifications.filter(item => item.id !== id));
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= certifications.length) return;
    const items = [...certifications];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Certifications & Licenses ({certifications.length})
          </h4>
          <p className="text-xs text-slate-500">Add industry credentials, cloud certifications, or diplomas</p>
        </div>
        <button
          type="button"
          onClick={handleAddCert}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-3 shadow-sm hover:border-slate-200 transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-xs font-semibold text-slate-900 truncate max-w-xs">
                {cert.name || 'New Certification'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-800 disabled:opacity-30 transition"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === certifications.length - 1}
                  onClick={() => handleMove(index, 1)}
                  className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-800 disabled:opacity-30 transition"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteEntry(cert.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Certification Name</label>
                <input
                  type="text"
                  value={cert.name || ''}
                  onChange={(e) => handleUpdateEntry(cert.id, 'name', e.target.value)}
                  placeholder="e.g. AWS Solutions Architect"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={cert.issuer || ''}
                  onChange={(e) => handleUpdateEntry(cert.id, 'issuer', e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Date Issued / Year</label>
                <input
                  type="text"
                  value={cert.date || ''}
                  onChange={(e) => handleUpdateEntry(cert.id, 'date', e.target.value)}
                  placeholder="e.g. 2023"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400 mb-2">No certifications added yet.</p>
            <button
              type="button"
              onClick={handleAddCert}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Add Certification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
