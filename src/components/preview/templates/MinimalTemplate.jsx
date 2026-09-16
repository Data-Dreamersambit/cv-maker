import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, Calendar } from 'lucide-react';
import { formatDate } from '../../../utils/formatDate';

export default function MinimalTemplate({ resume, accentColor = 'violet' }) {
  const { personal = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [] } = resume || {};

  const colorStyles = {
    blue: { accent: 'text-blue-600', dot: 'bg-blue-600', badge: 'bg-blue-50 text-blue-700' },
    emerald: { accent: 'text-emerald-600', dot: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
    slate: { accent: 'text-slate-800', dot: 'bg-slate-800', badge: 'bg-slate-100 text-slate-800' },
    rose: { accent: 'text-rose-600', dot: 'bg-rose-600', badge: 'bg-rose-50 text-rose-700' },
    violet: { accent: 'text-violet-600', dot: 'bg-violet-600', badge: 'bg-violet-50 text-violet-700' }
  }[accentColor] || { accent: 'text-violet-600', dot: 'bg-violet-600', badge: 'bg-violet-50 text-violet-700' };

  return (
    <div className="bg-white text-slate-800 font-sans text-xs p-9 min-h-[1050px] shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 pb-5 border-b border-slate-200">
        <div className="space-y-1 flex-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {personal.fullName || 'Your Full Name'}
          </h1>
          {personal.title && (
            <p className={`text-sm font-semibold tracking-wide ${colorStyles.accent}`}>
              {personal.title}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-2">
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{personal.email}</span>
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{personal.phone}</span>
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{personal.location}</span>
              </span>
            )}
            {personal.dateOfBirth && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{formatDate(personal.dateOfBirth)}</span>
              </span>
            )}
          </div>

          {(personal.links || []).filter(l => l.url).length > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-[10.5px] pt-1">
              {(personal.links || []).filter(l => l.url).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-slate-900 underline flex items-center gap-1"
                >
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>{link.label || link.url.replace(/^https?:\/\//, '')}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Optional Photo */}
        {resume.photo && (
          <img
            src={resume.photo}
            alt={personal.fullName || 'Candidate Photo'}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-sm flex-shrink-0"
          />
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-1.5">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Profile Summary
          </h3>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Experience
          </h3>

          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 text-[11.5px]">{exp.role || 'Position'}</span>
                    {exp.company && <span className="font-medium text-slate-600"> • {exp.company}</span>}
                    {exp.location && <span className="text-slate-400 text-[10.5px]"> ({exp.location})</span>}
                  </div>
                  {(exp.start || exp.end) && (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {exp.start} {exp.start && exp.end ? '–' : ''} {exp.end}
                    </span>
                  )}
                </div>

                <ul className="space-y-1 text-slate-600 text-[10.5px] pt-0.5">
                  {(exp.bullets || []).filter(Boolean).map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${colorStyles.dot} mt-1.5 flex-shrink-0`} />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Grid for Education & Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Education
            </h3>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <p className="font-bold text-slate-900 text-[11px]">{edu.degree || 'Degree'}</p>
                  <p className="text-slate-600 text-[10.5px]">{edu.institution}</p>
                  {(edu.start || edu.end) && (
                    <p className="text-slate-400 text-[9.5px]">
                      {edu.start} {edu.start && edu.end ? '–' : ''} {edu.end}
                    </p>
                  )}
                  {edu.details && (
                    <p className="text-slate-500 text-[9.5px] italic mt-0.5">{edu.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Core Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${colorStyles.badge}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Projects & Certifications */}
      {(projects.length > 0 || certifications.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1 border-t border-slate-100">
          {projects.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Projects
              </h3>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-[11px]">{proj.name || 'Project Name'}</span>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className={`text-[10px] ${colorStyles.accent} hover:underline`}>
                          Link
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-slate-600 text-[10px] leading-snug">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Certifications
              </h3>
              <div className="space-y-1.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-[10.5px]">
                    <p className="font-semibold text-slate-800">{cert.name || 'Certification Name'}</p>
                    <p className="text-slate-500 text-[10px]">
                      {cert.issuer} {cert.date ? `(${cert.date})` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
