import React from 'react';
import { GraduationCap, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { generateId } from '../../schema';

export default function EducationSection({ education = [], onChange }) {
  const handleAddEducation = () => {
    const newEntry = {
      id: generateId('edu'),
      degree: '',
      institution: '',
      start: '',
      end: '',
      details: ''
    };
    onChange([...education, newEntry]);
  };

  const handleUpdateEntry = (id, field, value) => {
    const updated = education.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDeleteEntry = (id) => {
    onChange(education.filter(item => item.id !== id));
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= education.length) return;
    const items = [...education];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Education ({education.length})
          </h4>
          <p className="text-xs text-slate-500">Add degrees, universities, and academic honors</p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {education.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-sm hover:border-slate-200 transition"
          >
            {/* Entry Header & Reorder Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-600 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-900 truncate max-w-xs">
                  {entry.degree || entry.institution ? `${entry.degree || 'Degree'} ${entry.institution ? `• ${entry.institution}` : ''}` : 'New Education Entry'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  title="Move education up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === education.length - 1}
                  onClick={() => handleMove(index, 1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  title="Move education down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1"
                  title="Delete education"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Degree / Certificate</label>
                <input
                  type="text"
                  value={entry.degree || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, 'degree', e.target.value)}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Institution / University</label>
                <input
                  type="text"
                  value={entry.institution || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, 'institution', e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Start Year / Date</label>
                <input
                  type="text"
                  value={entry.start || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, 'start', e.target.value)}
                  placeholder="e.g. 2017"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">End Year / Date</label>
                <input
                  type="text"
                  value={entry.end || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, 'end', e.target.value)}
                  placeholder="e.g. 2021"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Details / Honors / GPA (Optional)</label>
                <input
                  type="text"
                  value={entry.details || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, 'details', e.target.value)}
                  placeholder="e.g. GPA 3.9/4.0, Dean's Honor List, Specialization in Distributed Systems"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400 mb-3">No education entries added yet.</p>
            <button
              type="button"
              onClick={handleAddEducation}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Add Education
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
