import React, { useRef } from 'react';
import {
  FolderOpen, Plus, Trash2, Copy, Download,
  X, Check, Clock, User, Briefcase, FileText, Upload, FileJson
} from 'lucide-react';
import { listResumes, deleteResume, duplicateResume, exportResumeToJson, parseResumeFromJson, saveResume } from '../lib/storage';

export default function ResumeListModal({
  isOpen,
  onClose,
  activeResumeId,
  onSelectResume,
  onNewResume,
  onImportResume
}) {
  const jsonUploadRef = useRef(null);

  if (!isOpen) return null;

  const resumes = listResumes();

  const handleSelect = (id) => {
    onSelectResume(id);
    onClose();
  };

  const handleDuplicate = (e, id) => {
    e.stopPropagation();
    duplicateResume(id);
    onSelectResume(id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this resume? This cannot be undone.')) {
      deleteResume(id);
      const remaining = listResumes();
      if (remaining.length > 0) {
        onSelectResume(remaining[0].id);
      } else {
        onNewResume();
      }
    }
  };

  const handleExport = (e, resume) => {
    e.stopPropagation();
    exportResumeToJson(resume);
  };

  const handleImportJsonFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseResumeFromJson(text);
      saveResume(parsed);
      if (onImportResume) {
        onImportResume(parsed);
      }
      onClose();
    } catch (err) {
      alert(`Failed to import JSON: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Saved Resumes</h3>
              <p className="text-xs text-slate-400">Manage multiple resumes stored safely in your browser</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} Saved
          </span>

          <div className="flex items-center gap-2">
            <input
              ref={jsonUploadRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportJsonFile}
            />
            <button
              type="button"
              onClick={() => jsonUploadRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-800 text-slate-600 border border-slate-200/80 text-xs font-medium transition"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onNewResume();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Resume</span>
            </button>
          </div>
        </div>

        {/* Resume List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {resumes.map((item) => {
            const isActive = item.id === activeResumeId;
            const updatedDate = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Recently';

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-violet-950/30 border-violet-500/60 shadow-md shadow-violet-950/40'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-200 hover:bg-white/60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt="Avatar"
                      className="w-11 h-11 rounded-full object-cover border border-violet-500/40 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900 truncate">
                        {item.title || item.personal?.fullName || 'Untitled Resume'}
                      </h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {item.personal?.fullName || 'No name'} • {item.personal?.title || 'No title'}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{updatedDate}</span>
                      </span>
                      <span>•</span>
                      <span>{(item.experience || []).length} jobs</span>
                      <span>•</span>
                      <span>{(item.skills || []).length} skills</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => handleDuplicate(e, item.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-800 transition"
                    title="Duplicate resume"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleExport(e, item)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-800 transition"
                    title="Export as JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {resumes.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No saved resumes found.</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewResume();
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
              >
                Create First Resume
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-600 text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
