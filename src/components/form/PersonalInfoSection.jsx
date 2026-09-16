import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Link2, Plus, Trash2, Camera, Sparkles, Calendar } from 'lucide-react';
import { generateId } from '../../schema';

export default function PersonalInfoSection({
  personal = {},
  photo = null,
  onChange,
  onOpenPhotoModal,
  hasExtractedImages = false
}) {
  const handleFieldChange = (field, value) => {
    onChange({
      ...personal,
      [field]: value
    });
  };

  const handleLinkChange = (id, field, value) => {
    const updatedLinks = (personal.links || []).map(link => {
      if (link.id === id) {
        return { ...link, [field]: value };
      }
      return link;
    });
    onChange({ ...personal, links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLink = {
      id: generateId('link'),
      label: 'LinkedIn',
      url: ''
    };
    onChange({
      ...personal,
      links: [...(personal.links || []), newLink]
    });
  };

  const handleRemoveLink = (id) => {
    onChange({
      ...personal,
      links: (personal.links || []).filter(link => link.id !== id)
    });
  };

  return (
    <div className="space-y-5">
      {/* Photo & Basic Info Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="relative group">
          {photo ? (
            <img
              src={photo}
              alt="Profile avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-violet-500 shadow-md ring-4 ring-violet-500/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-500 group-hover:border-violet-400 transition">
              <Camera className="w-6 h-6 text-slate-400 group-hover:text-violet-400" />
              <span className="text-[10px] mt-1 font-medium">No Photo</span>
            </div>
          )}

          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg transition"
            title="Edit profile photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h4 className="text-sm font-semibold text-slate-900">Profile Photo</h4>
            {hasExtractedImages && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>DOCX Photo Detected</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {photo
              ? 'Profile photo is active and will appear on your resume.'
              : 'Add an avatar photo, crop one from page 1 of your PDF, or use DOCX embedded image.'}
          </p>
          <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={onOpenPhotoModal}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium transition"
            >
              {photo ? 'Change / Crop Photo' : '+ Add / Extract Photo'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={personal.fullName || ''}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Professional Title
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={personal.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={personal.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={personal.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="e.g. +1 (555) 234-5678 or +91 9876543210"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={personal.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="e.g. San Francisco, CA or London, UK"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={personal.dateOfBirth || ''}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Social & Portfolio Links */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Links & Profiles</span>
          </label>
          <button
            type="button"
            onClick={handleAddLink}
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {(personal.links || []).map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <input
                type="text"
                value={link.label || ''}
                onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                placeholder="Label (e.g. LinkedIn)"
                className="w-28 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <input
                type="url"
                value={link.url || ''}
                onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <button
                type="button"
                onClick={() => handleRemoveLink(link.id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Remove link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {(!personal.links || personal.links.length === 0) && (
            <p className="text-xs text-slate-500 italic">No links added. Click "+ Add Link" to add LinkedIn, GitHub, or Portfolio.</p>
          )}
        </div>
      </div>
    </div>
  );
}
