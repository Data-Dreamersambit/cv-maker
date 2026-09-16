import React, { useState } from 'react';
import { Sparkles, Plus, X, Tag } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Tailwind CSS',
  'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Git', 'CI/CD',
  'REST APIs', 'Figma', 'Linux', 'Kubernetes', 'Redux', 'MongoDB'
];

export default function SkillsSection({ skills = [], onChange }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  const addSkill = (val) => {
    const trimmed = val.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;

    // Check if duplicate (case insensitive)
    if (!skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...skills, trimmed]);
    }
    setInputValue('');
  };

  const removeSkill = (indexToRemove) => {
    onChange(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleQuickAdd = (skillName) => {
    if (!skills.some(s => s.toLowerCase() === skillName.toLowerCase())) {
      onChange([...skills, skillName]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Skills & Competencies ({skills.length})
          </h4>
          <p className="text-xs text-slate-500">Type a skill and press Enter or comma to add</p>
        </div>
      </div>

      {/* Input container + Tags pill box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-500 transition">
        <div className="flex flex-wrap items-center gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-100 border border-violet-300 text-violet-800 text-xs font-medium group transition hover:bg-violet-200"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-violet-500 hover:text-violet-900 rounded-full p-0.5 group-hover:opacity-100 transition"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) addSkill(inputValue);
            }}
            placeholder={skills.length === 0 ? "Type skill (e.g. React, Python, Docker) and press Enter..." : "Add another skill..."}
            className="flex-1 min-w-[140px] bg-transparent border-none text-xs text-slate-900 placeholder-slate-500 focus:outline-none py-1"
          />
        </div>
      </div>

      {/* Quick Add Suggestions */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Popular Skills Suggestions:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS.filter(s => !skills.some(existing => existing.toLowerCase() === s.toLowerCase())).slice(0, 10).map((suggested, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickAdd(suggested)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-800 border border-slate-200 text-[11px] text-slate-400 hover:text-violet-300 transition flex items-center gap-1"
            >
              <Plus className="w-2.5 h-2.5 text-violet-400" />
              <span>{suggested}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
