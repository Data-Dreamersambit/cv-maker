import React, { useState } from 'react';
import {
  User, AlignLeft, Briefcase, GraduationCap,
  Sparkles, FolderGit2, Award, ChevronDown, ChevronUp,
  Image as ImageIcon, CheckCircle2, Camera
} from 'lucide-react';
import PersonalInfoSection from './PersonalInfoSection';
import SummarySection from './SummarySection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import CertificationsSection from './CertificationsSection';

export default function ResumeForm({
  resume,
  onChange,
  onOpenPhotoModal,
  hasExtractedImages = false
}) {
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: false,
    certifications: false
  });

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const expandAll = () => {
    const allOpen = {
      personal: true,
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true
    };
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    const allClosed = {
      personal: false,
      summary: false,
      experience: false,
      education: false,
      skills: false,
      projects: false,
      certifications: false
    };
    setOpenSections(allClosed);
  };

  const updateField = (field, value) => {
    onChange({
      ...resume,
      [field]: value
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Form Top Utility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={resume.title || 'Untitled Resume'}
            onChange={(e) => updateField('title', e.target.value)}
            className="bg-transparent border-b border-dashed border-slate-200 hover:border-slate-500 focus:border-violet-500 font-bold text-lg text-slate-900 px-1 py-0.5 focus:outline-none transition max-w-xs"
            placeholder="Resume Document Title"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-800 text-slate-600 border border-slate-200/80 text-xs font-medium transition"
          >
            <Camera className="w-3.5 h-3.5 text-violet-400" />
            <span>{resume.photo ? 'Manage Photo' : 'Add Photo'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={expandAll}
              className="text-slate-400 hover:text-violet-400 transition"
            >
              Expand All
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-slate-400 hover:text-violet-400 transition"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Sections Accordion Stack */}
      <div className="space-y-3">
        {/* Personal Info */}
        <SectionCard
          id="personal"
          title="Personal Information"
          icon={User}
          isOpen={openSections.personal}
          onToggle={() => toggleSection('personal')}
          badge={resume.personal?.fullName ? resume.personal.fullName : 'Incomplete'}
        >
          <PersonalInfoSection
            personal={resume.personal || {}}
            photo={resume.photo}
            onChange={(updated) => updateField('personal', updated)}
            onOpenPhotoModal={onOpenPhotoModal}
            hasExtractedImages={hasExtractedImages}
          />
        </SectionCard>

        {/* Summary */}
        <SectionCard
          id="summary"
          title="Professional Summary"
          icon={AlignLeft}
          isOpen={openSections.summary}
          onToggle={() => toggleSection('summary')}
          badge={resume.summary ? `${resume.summary.slice(0, 30)}...` : 'Optional'}
        >
          <SummarySection
            summary={resume.summary || ''}
            onChange={(updated) => updateField('summary', updated)}
          />
        </SectionCard>

        {/* Experience */}
        <SectionCard
          id="experience"
          title="Work Experience"
          icon={Briefcase}
          isOpen={openSections.experience}
          onToggle={() => toggleSection('experience')}
          badge={`${(resume.experience || []).length} positions`}
        >
          <ExperienceSection
            experience={resume.experience || []}
            onChange={(updated) => updateField('experience', updated)}
          />
        </SectionCard>

        {/* Education */}
        <SectionCard
          id="education"
          title="Education"
          icon={GraduationCap}
          isOpen={openSections.education}
          onToggle={() => toggleSection('education')}
          badge={`${(resume.education || []).length} entries`}
        >
          <EducationSection
            education={resume.education || []}
            onChange={(updated) => updateField('education', updated)}
          />
        </SectionCard>

        {/* Skills */}
        <SectionCard
          id="skills"
          title="Skills & Expertise"
          icon={Sparkles}
          isOpen={openSections.skills}
          onToggle={() => toggleSection('skills')}
          badge={`${(resume.skills || []).length} skills`}
        >
          <SkillsSection
            skills={resume.skills || []}
            onChange={(updated) => updateField('skills', updated)}
          />
        </SectionCard>

        {/* Projects */}
        <SectionCard
          id="projects"
          title="Featured Projects"
          icon={FolderGit2}
          isOpen={openSections.projects}
          onToggle={() => toggleSection('projects')}
          badge={`${(resume.projects || []).length} projects`}
        >
          <ProjectsSection
            projects={resume.projects || []}
            onChange={(updated) => updateField('projects', updated)}
          />
        </SectionCard>

        {/* Certifications */}
        <SectionCard
          id="certifications"
          title="Certifications & Awards"
          icon={Award}
          isOpen={openSections.certifications}
          onToggle={() => toggleSection('certifications')}
          badge={`${(resume.certifications || []).length} certs`}
        >
          <CertificationsSection
            certifications={resume.certifications || []}
            onChange={(updated) => updateField('certifications', updated)}
          />
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({ id, title, icon: Icon, isOpen, onToggle, badge, children }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-lg transition-all">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition bg-white"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">{title}</h3>
            {badge && (
              <span className="text-[11px] text-slate-400 font-normal truncate block max-w-xs sm:max-w-md">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="p-1 text-slate-400">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-200/80 bg-white/40">
          {children}
        </div>
      )}
    </div>
  );
}
