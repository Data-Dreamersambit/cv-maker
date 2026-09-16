import React from 'react';
import { FolderGit2, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { generateId } from '../../schema';

export default function ProjectsSection({ projects = [], onChange }) {
  const handleAddProject = () => {
    const newEntry = {
      id: generateId('proj'),
      name: '',
      description: '',
      link: ''
    };
    onChange([...projects, newEntry]);
  };

  const handleUpdateEntry = (id, field, value) => {
    const updated = projects.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDeleteEntry = (id) => {
    onChange(projects.filter(item => item.id !== id));
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const items = [...projects];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Projects ({projects.length})
          </h4>
          <p className="text-xs text-slate-500">Highlight open source, personal, or featured client work</p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-sm hover:border-slate-200 transition"
          >
            {/* Header & Reorder */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-600 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {project.name || 'New Project'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  title="Move project up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === projects.length - 1}
                  onClick={() => handleMove(index, 1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  title="Move project down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteEntry(project.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  value={project.name || ''}
                  onChange={(e) => handleUpdateEntry(project.id, 'name', e.target.value)}
                  placeholder="e.g. Real-Time Chat Engine"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Project URL / Repository</label>
                <input
                  type="url"
                  value={project.link || ''}
                  onChange={(e) => handleUpdateEntry(project.id, 'link', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Description / Key Technologies</label>
                <textarea
                  rows={2}
                  value={project.description || ''}
                  onChange={(e) => handleUpdateEntry(project.id, 'description', e.target.value)}
                  placeholder="Summary of what the project does, problems solved, and tech stack used..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
                />
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400 mb-3">No projects listed yet.</p>
            <button
              type="button"
              onClick={handleAddProject}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Add Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
