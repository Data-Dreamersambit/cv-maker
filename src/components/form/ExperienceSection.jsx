import React from 'react';
import { Briefcase, Plus, Trash2, ArrowUp, ArrowDown, ListPlus, Minus } from 'lucide-react';
import { generateId } from '../../schema';

export default function ExperienceSection({ experience = [], onChange }) {
  const handleAddExperience = () => {
    const newEntry = {
      id: generateId('exp'),
      role: '',
      company: '',
      location: '',
      start: '',
      end: 'Present',
      bullets: ['']
    };
    onChange([...experience, newEntry]);
  };

  const handleUpdateEntry = (id, field, value) => {
    const updated = experience.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDeleteEntry = (id) => {
    onChange(experience.filter(item => item.id !== id));
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= experience.length) return;
    const items = [...experience];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  // Bullet point handlers
  const handleAddBullet = (expId) => {
    const updated = experience.map(item => {
      if (item.id === expId) {
        return { ...item, bullets: [...(item.bullets || []), ''] };
      }
      return item;
    });
    onChange(updated);
  };

  const handleUpdateBullet = (expId, bulletIndex, value) => {
    const updated = experience.map(item => {
      if (item.id === expId) {
        const bullets = [...(item.bullets || [])];
        bullets[bulletIndex] = value;
        return { ...item, bullets };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDeleteBullet = (expId, bulletIndex) => {
    const updated = experience.map(item => {
      if (item.id === expId) {
        const bullets = (item.bullets || []).filter((_, idx) => idx !== bulletIndex);
        return { ...item, bullets: bullets.length > 0 ? bullets : [''] };
      }
      return item;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Work Experience ({experience.length})
          </h4>
          <p className="text-xs text-slate-500">Add, reorder, or edit your roles and accomplishments</p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm hover:border-slate-200 transition"
          >
            {/* Entry Header & Reorder Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-600 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {entry.role || entry.company ? `${entry.role || 'Position'} ${entry.company ? `at ${entry.company}` : ''}` : 'New Position'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  title="Move position up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === experience.length - 1}
                  onClick={() => handleMove(index, 1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  title="Move position down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1"
                  title="Delete position"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Job Title / Role</label>
                <input
                  type="text"
                  value={entry.role || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, 'role', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  value={entry.company || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, 'company', e.target.value)}
                  placeholder="e.g. Stripe"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={entry.location || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, 'location', e.target.value)}
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={entry.start || ''}
                    onChange={(e) => handleUpdateEntry(entry.id, 'start', e.target.value)}
                    placeholder="e.g. Jan 2021"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
                  <input
                    type="text"
                    value={entry.end || ''}
                    onChange={(e) => handleUpdateEntry(entry.id, 'end', e.target.value)}
                    placeholder="e.g. Present"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Bullets List */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">
                  Key Achievements & Responsibilities
                </label>
                <button
                  type="button"
                  onClick={() => handleAddBullet(entry.id)}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Bullet</span>
                </button>
              </div>

              <div className="space-y-2">
                {(entry.bullets || ['']).map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2">
                    <span className="text-violet-400 text-sm mt-1.5">•</span>
                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={(e) => handleUpdateBullet(entry.id, bIdx, e.target.value)}
                      placeholder="Describe what you built, optimized, or delivered (include metrics where possible)..."
                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteBullet(entry.id, bIdx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-md transition mt-1"
                      title="Delete bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400 mb-3">No work experience entries added yet.</p>
            <button
              type="button"
              onClick={handleAddExperience}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Add First Position
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
