import React from 'react';
import { AlignLeft } from 'lucide-react';

export default function SummarySection({ summary = '', onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Professional Summary / Bio
        </label>
        <span className="text-xs text-slate-500 font-mono">
          {summary ? summary.length : 0} characters
        </span>
      </div>

      <textarea
        rows={4}
        value={summary || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Briefly describe your career focus, core specialties, and standout achievements..."
        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 leading-relaxed transition resize-y"
      />
    </div>
  );
}
