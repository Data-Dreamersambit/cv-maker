import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, Award, GraduationCap, Briefcase, Sparkles, FolderGit2, Calendar } from 'lucide-react';
import { formatDate } from '../../../utils/formatDate';

export default function ModernTemplate({ resume, accentColor }) {
  const theme = {
    slate: { bg: 'bg-slate-50/40', border: 'border-slate-100', text: 'text-slate-700', borderB: 'border-slate-200', icon: 'text-slate-300', grad: 'from-slate-600 to-slate-400', bullet: 'text-slate-400', pill: 'bg-slate-600', ring: 'ring-slate-100' },
    indigo: { bg: 'bg-violet-50/40', border: 'border-violet-100', text: 'text-violet-700', borderB: 'border-violet-200', icon: 'text-violet-300', grad: 'from-violet-600 to-violet-300', bullet: 'text-violet-400', pill: 'bg-violet-600', ring: 'ring-violet-100' },
    blue: { bg: 'bg-blue-50/40', border: 'border-blue-100', text: 'text-blue-700', borderB: 'border-blue-200', icon: 'text-blue-300', grad: 'from-blue-600 to-blue-300', bullet: 'text-blue-400', pill: 'bg-blue-600', ring: 'ring-blue-100' },
    emerald: { bg: 'bg-emerald-50/40', border: 'border-emerald-100', text: 'text-emerald-700', borderB: 'border-emerald-200', icon: 'text-emerald-300', grad: 'from-emerald-600 to-emerald-300', bullet: 'text-emerald-400', pill: 'bg-emerald-600', ring: 'ring-emerald-100' },
    rose: { bg: 'bg-rose-50/40', border: 'border-rose-100', text: 'text-rose-700', borderB: 'border-rose-200', icon: 'text-rose-300', grad: 'from-rose-600 to-rose-300', bullet: 'text-rose-400', pill: 'bg-rose-600', ring: 'ring-rose-100' },
    violet: { bg: 'bg-violet-50/40', border: 'border-violet-100', text: 'text-violet-700', borderB: 'border-violet-200', icon: 'text-violet-300', grad: 'from-violet-600 to-violet-300', bullet: 'text-violet-400', pill: 'bg-violet-600', ring: 'ring-violet-100' }
  }[accentColor] || { bg: 'bg-violet-50/40', border: 'border-violet-100', text: 'text-violet-700', borderB: 'border-violet-200', icon: 'text-violet-300', grad: 'from-violet-600 to-violet-300', bullet: 'text-violet-400', pill: 'bg-violet-600', ring: 'ring-violet-100' };
  const { personal = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [] } = resume || {};

  return (
    <div className="bg-white text-slate-800 font-sans text-xs min-h-[1050px] flex shadow-sm">
      {/* Left Sidebar (35%) */}
      <aside className={`w-[34%] ${theme.bg} border-r ${theme.border} p-6 flex flex-col gap-6`}>
        {/* Profile Photo */}
        {resume.photo && (
          <div className="flex justify-center">
            <img
              src={resume.photo}
              alt={personal.fullName || 'Candidate Photo'}
              className={`w-28 h-28 rounded-2xl object-cover shadow-sm border-2 border-white ring-1 ${theme.ring}`}
            />
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2.5">
          <h4 className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} border-b ${theme.borderB} pb-1`}>
            Contact
          </h4>
          <div className="space-y-2 text-[11px] text-slate-600">
            {personal.email && (
              <div className="flex items-center gap-2 break-all min-w-0">
                <Mail className={`w-3.5 h-3.5 ${theme.icon} flex-shrink-0`} />
                <span className="leading-none">{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-2 min-w-0">
                <Phone className={`w-3.5 h-3.5 ${theme.icon} flex-shrink-0`} />
                <span className="leading-none">{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className={`w-3.5 h-3.5 ${theme.icon} flex-shrink-0`} />
                <span className="leading-none">{personal.location}</span>
              </div>
            )}
            {personal.dateOfBirth && (
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-3.5 h-3.5 text-violet-300 flex-shrink-0" />
                <span className="leading-none">{formatDate(personal.dateOfBirth)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        {(personal.links || []).filter(l => l.url).length > 0 && (
          <div className="space-y-2">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} border-b ${theme.borderB} pb-1`}>
              Profiles & Links
            </h4>
            <div className="space-y-1.5 text-[11px]">
              {(personal.links || []).filter(l => l.url).map((link) => (
                <div key={link.id} className="flex items-center gap-1.5 text-slate-600 min-w-0">
                  <span className="flex-shrink-0 flex items-center justify-center">
                    <Globe className={`w-3 h-3 ${theme.icon}`} />
                  </span>
                  <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline truncate leading-none">
                    {link.label || link.url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-2.5">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} border-b ${theme.borderB} pb-1`}>
              Skills & Expertise
            </h4>
            <div className="flex flex-wrap gap-1.5 gap-y-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center leading-none px-2.5 py-1 rounded-full text-[10px] font-medium border bg-violet-50 ${theme.text} border-violet-200`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education (in sidebar for clean balance) */}
        {education.length > 0 && (
          <div className="space-y-3">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} border-b ${theme.borderB} pb-1`}>
              Education
            </h4>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <p className="font-bold text-slate-900 text-[11px] leading-snug">{edu.degree || 'Degree'}</p>
                  <p className="text-slate-600 text-[10px] leading-snug">{edu.institution}</p>
                  {(edu.start || edu.end) && (
                    <p className="text-slate-400 text-[9.5px] leading-snug">
                      {edu.start} {edu.start && edu.end ? '–' : ''} {edu.end}
                    </p>
                  )}
                  {edu.details && (
                    <p className="text-slate-500 text-[9.5px] italic mt-0.5 leading-relaxed">{edu.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-2.5">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} border-b ${theme.borderB} pb-1`}>
              Certifications
            </h4>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-[10px] leading-snug">
                  <p className="font-semibold text-slate-800">{cert.name || 'Certification Name'}</p>
                  <p className="text-slate-500">
                    {cert.issuer} {cert.date ? `(${cert.date})` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Main Content (66%) */}
      <main className="w-[66%] p-7 flex flex-col gap-6">
        {/* Name and Title Header */}
        <div className="pb-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase leading-none">
            {personal.fullName || 'Your Full Name'}
          </h1>
          {personal.title && (
            <h2 className="text-sm font-semibold tracking-wide mt-1.5 text-slate-700 leading-none">
              {personal.title}
            </h2>
          )}
          <div className={`mt-4 h-[3px] w-12 rounded-full bg-gradient-to-r ${theme.grad}`}></div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div className="space-y-1.5">
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} flex items-center gap-1.5 leading-none pb-1`}>
              <span>About Me</span>
            </h3>
            <p className="text-slate-700 leading-relaxed text-[11px] text-justify">
              {summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="space-y-3.5">
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} border-b border-violet-200 pb-1 leading-none`}>
              Work Experience
            </h3>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2 leading-none">
                    <div>
                      <span className="font-bold text-slate-900 text-[11.5px]">{exp.role || 'Position'}</span>
                      {exp.company && (
                        <span className="text-slate-600 font-medium"> • {exp.company}</span>
                      )}
                    </div>
                    {(exp.start || exp.end) && (
                      <span className="text-slate-400 text-[10px] font-medium flex-shrink-0">
                        {exp.start} {exp.start && exp.end ? '–' : ''} {exp.end}
                      </span>
                    )}
                  </div>

                  {exp.location && (
                    <p className="text-[10px] text-slate-400 italic -mt-0.5 leading-none">{exp.location}</p>
                  )}

                  {/* Bullets */}
                  <ul className="space-y-1 text-slate-700 text-[10.5px]">
                    {(exp.bullets || []).filter(Boolean).map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <span className={`text-[12px] leading-none ${theme.bullet} mt-0.5`}>▪</span>
                        <span className="flex-1 leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} border-b border-violet-200 pb-1 leading-none`}>
              Key Projects
            </h3>

            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="flex items-center justify-between min-w-0 leading-none pb-0.5">
                    <span className="font-bold text-slate-900 text-[11px] truncate">{proj.name || 'Project Name'}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className={`text-[10px] ${theme.text} hover:underline flex items-center gap-0.5 flex-shrink-0`}>
                        <span className="leading-none">Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-slate-700 text-[10.5px] leading-relaxed">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
