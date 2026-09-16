import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { formatDate } from '../../../utils/formatDate';

export default function ClassicTemplate({ resume, accentColor }) {
  const { personal = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [] } = resume || {};

  const colorStyles = {
    slate: { border: 'border-slate-200', text: 'text-slate-800', line: 'bg-white' },
    indigo: { border: 'border-violet-800', text: 'text-violet-900', line: 'bg-violet-800' },
    blue: { border: 'border-blue-900', text: 'text-blue-900', line: 'bg-blue-900' },
    emerald: { border: 'border-emerald-900', text: 'text-emerald-900', line: 'bg-emerald-900' },
    rose: { border: 'border-rose-900', text: 'text-rose-900', line: 'bg-rose-900' },
    violet: { border: 'border-violet-900', text: 'text-violet-900', line: 'bg-violet-900' }
  }[accentColor] || { border: 'border-slate-200', text: 'text-slate-800', line: 'bg-white' };

  return (
    <div className="bg-white text-slate-800 font-serif text-[11.5px] leading-normal p-10 min-h-[1050px] shadow-sm space-y-4">
      {/* Header Section */}
      <div className="text-center space-y-1.5 pb-2 border-b border-violet-200">
        <h1 className="text-2xl font-bold tracking-tight text-violet-700 uppercase font-sans">
          {personal.fullName || 'Your Full Name'}
        </h1>
        {personal.title && (
          <p className="text-xs font-medium text-slate-700 font-sans tracking-wide">
            {personal.title}
          </p>
        )}

        {/* Contact info inline bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] text-slate-600 font-sans pt-1">
          {personal.location && <span>{personal.location}</span>}
          {personal.location && personal.phone && <span>•</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.phone && personal.email && <span>•</span>}
          {personal.email && <span className="font-medium text-slate-800">{personal.email}</span>}

          {(personal.location || personal.phone || personal.email) && personal.dateOfBirth && <span>•</span>}
          {personal.dateOfBirth && <span>DOB: {formatDate(personal.dateOfBirth)}</span>}

          {(personal.links || []).filter(l => l.url).map((link) => (
            <React.Fragment key={link.id}>
              <span>•</span>
              <a href={link.url} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                {link.label || link.url.replace(/^https?:\/\//, '')}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="space-y-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-violet-200 pb-0.5 font-sans">
            Professional Summary
          </h3>
          <p className="text-slate-700 leading-relaxed text-[11px] text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-violet-200 pb-0.5 font-sans">
            Work Experience
          </h3>

          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-sans text-xs">
                  <div>
                    <span className="font-bold text-violet-700">{exp.role || 'Position'}</span>
                    {exp.company && <span className="font-semibold text-slate-800">, {exp.company}</span>}
                    {exp.location && <span className="text-slate-500 font-normal"> — {exp.location}</span>}
                  </div>
                  {(exp.start || exp.end) && (
                    <span className="text-slate-600 text-[10.5px] italic">
                      {exp.start} {exp.start && exp.end ? '–' : ''} {exp.end}
                    </span>
                  )}
                </div>

                <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[10.5px]">
                  {(exp.bullets || []).filter(Boolean).map((b, i) => (
                    <li key={i} className="leading-snug">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-violet-200 pb-0.5 font-sans">
            Education
          </h3>

          <div className="space-y-2 font-sans">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-violet-700">{edu.institution}</span>
                    {edu.degree && <span className="text-slate-800"> — {edu.degree}</span>}
                  </div>
                  {(edu.start || edu.end) && (
                    <span className="text-slate-600 text-[10.5px] italic">
                      {edu.start} {edu.start && edu.end ? '–' : ''} {edu.end}
                    </span>
                  )}
                </div>
                {edu.details && (
                  <p className="text-slate-600 text-[10.5px] italic font-serif">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-violet-200 pb-0.5 font-sans">
            Technical Skills & Competencies
          </h3>
          <p className="text-[10.5px] text-slate-700 font-sans leading-relaxed">
            <span className="font-bold text-slate-800">Skills: </span>
            {skills.join(' • ')}
          </p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-violet-200 pb-0.5 font-sans">
            Key Projects
          </h3>

          <div className="space-y-2 font-sans">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-violet-700">{proj.name || 'Project Name'}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-800 text-[10px] underline">
                      {proj.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-600 text-[10.5px] font-serif leading-snug">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-violet-200 pb-0.5 font-sans">
            Certifications
          </h3>

          <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[10.5px] font-sans">
            {certifications.map((cert) => (
              <li key={cert.id}>
                <span className="font-bold text-slate-800">{cert.name || 'Certification Name'}</span>
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.date && <span className="text-slate-500 italic"> ({cert.date})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
