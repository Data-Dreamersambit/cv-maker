import { generateId, createEmptyResume } from '../schema.js';

/**
 * Validates if a string looks like readable human text (not garbled).
 * Checks for minimum vowels and consonant run length.
 */
export function looksLikeReadableText(str) {
  if (!str || typeof str !== 'string') return false;
  
  const trimmed = str.trim();
  if (trimmed.length < 2) return true; // Too short to judge, keep it
  
  const alphaChars = trimmed.replace(/[^a-zA-Z]/g, '');
  if (alphaChars.length > 4) {
    const vowels = alphaChars.replace(/[^aeiouAEIOU]/g, '');
    if (vowels.length === 0) return false;
    
    // Check for abnormal consonant run (4+ consecutive consonants, excluding 'y')
    if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(alphaChars)) {
      return false;
    }
  }
  
  return true;
}

// Section header definitions and aliases
const SECTION_PATTERNS = {
  summary: /^(?:professional\s+)?(?:summary|profile|about\s+me|objective|career\s+objective|executive\s+summary|bio)[\s:]*$/i,
  experience: /^(?:work\s+)?(?:experience|employment|work\s+history|professional\s+experience|internships|career\s+history)[\s:]*$/i,
  education: /^(?:education|academic\s+background|qualifications|academic\s+history|degrees)[\s:]*$/i,
  skills: /^(?:technical\s+)?(?:skills|skills\s+&\s+tools|core\s+competencies|technologies|key\s+skills|expertise|proficiencies|tools\s+&\s+technologies)[\s:]*$/i,
  projects: /^(?:personal\s+|key\s+|technical\s+|selected\s+)?(?:projects|portfolio)[\s:]*$/i,
  certifications: /^(?:certifications?|certificates?|licenses?|courses\s+&\s+certifications|awards\s+&\s+certifications)[\s:]*$/i
};

// Date range matching
const DATE_RANGE_REGEX = /(?:(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.,]?\s+)?\b(?:19|20)\d{2}\b)\s*(?:-|–|—|to)\s*(?:(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.,]?\s+)?\b(?:19|20)\d{2}\b|Present|Current|Now)/i;
const SINGLE_DATE_REGEX = /(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.,]?\s+)?\b(?:19|20)\d{2}\b/i;

// Contact Regexes
const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const PHONE_REGEX = /(?:(?:\+91[\-\s]?)?[6-9]\d{9}|(?:\+?1[\-\s]?)?\(?\d{3}\)?[\-\s.]?\d{3}[\-\s.]?\d{4}|\+\d{1,3}[\-\s.]?\(?\d{1,4}\)?[\-\s.]?\d{2,5}[\-\s.]?\d{2,5})/g;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9\-_]+)/i;
const GENERIC_URL_REGEX = /(?:https?:\/\/|www\.)[a-zA-Z0-9.\-_]+\.[a-zA-Z]{2,}(?:\/[^\s,)]*)?/g;

const DEGREE_KEYWORDS = [
  'bachelor', 'b.s.', 'b.sc', 'b.tech', 'b.e.', 'ba', 'b.a.',
  'master', 'm.s.', 'm.sc', 'm.tech', 'm.e.', 'mba', 'm.b.a.',
  'ph.d', 'phd', 'doctorate', 'associate', 'diploma', 'high school'
];

/**
 * Extracts structured resume data from raw text (and optional HTML/images)
 */
export function extractResumeFields(rawText = '', html = '', images = []) {
  const resume = createEmptyResume();
  if (!rawText || typeof rawText !== 'string') return resume;

  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) return resume;

  const fullText = rawText;

  // 1. Extract Contact Information
  // Email
  const emailMatches = fullText.match(EMAIL_REGEX);
  if (emailMatches && emailMatches.length > 0) {
    resume.personal.email = emailMatches[0].trim();
  }

  // Phone
  const phoneMatches = fullText.match(PHONE_REGEX);
  if (phoneMatches && phoneMatches.length > 0) {
    const validPhone = phoneMatches.find(p => p.replace(/\D/g, '').length >= 10);
    if (validPhone) {
      resume.personal.phone = validPhone.trim();
    }
  }

  // Links
  const links = [];
  const linkedinMatch = fullText.match(LINKEDIN_REGEX);
  if (linkedinMatch) {
    links.push({
      id: generateId('link'),
      label: 'LinkedIn',
      url: linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`
    });
  }

  const githubMatch = fullText.match(GITHUB_REGEX);
  if (githubMatch) {
    links.push({
      id: generateId('link'),
      label: 'GitHub',
      url: githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`
    });
  }

  const allUrls = fullText.match(GENERIC_URL_REGEX) || [];
  for (const url of allUrls) {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    if (!links.some(l => l.url.toLowerCase() === cleanUrl.toLowerCase())) {
      if (!cleanUrl.includes('linkedin.com') && !cleanUrl.includes('github.com')) {
        links.push({
          id: generateId('link'),
          label: 'Portfolio',
          url: cleanUrl
        });
        break;
      }
    }
  }
  if (links.length > 0) {
    resume.personal.links = links;
  }

  // 2. Identify Section Boundaries
  const sectionIndices = [];
  lines.forEach((line, index) => {
    if (line.length <= 40) {
      for (const [sectionKey, pattern] of Object.entries(SECTION_PATTERNS)) {
        if (pattern.test(line.replace(/^[#*\-_•\s]+/, '').replace(/[:\-_#*]+$/, '').trim())) {
          sectionIndices.push({ section: sectionKey, lineIndex: index, headerText: line });
          break;
        }
      }
    }
  });

  // 3. Extract Name & Header Info from Top of Document
  const firstSectionLine = sectionIndices.length > 0 ? sectionIndices[0].lineIndex : Math.min(lines.length, 8);
  const headerLines = lines.slice(0, firstSectionLine);

  let nameFound = false;
  for (const line of headerLines) {
    // Check if line contains contact tokens separated by | or ,
    if (line.includes('|') || line.includes('•')) {
      const parts = line.split(/[|•]/).map(p => p.trim());
      for (const part of parts) {
        if (!EMAIL_REGEX.test(part) && !PHONE_REGEX.test(part) && !GENERIC_URL_REGEX.test(part)) {
          if (!resume.personal.location && part.length > 2 && part.length < 40 && looksLikeReadableText(part)) {
            resume.personal.location = part;
          }
        }
      }
    }

    if (
      line.toLowerCase().includes('resume') ||
      line.toLowerCase().includes('curriculum vitae') ||
      line.toLowerCase().includes('page ') ||
      EMAIL_REGEX.test(line) ||
      PHONE_REGEX.test(line) ||
      GENERIC_URL_REGEX.test(line) ||
      line.length > 50 ||
      line.length < 2
    ) {
      continue;
    }

    if (!nameFound && !/[0-9]/.test(line)) {
      const cleanName = line.replace(/^[•*\s]+/, '').trim();
      if (looksLikeReadableText(cleanName)) {
        resume.personal.fullName = cleanName;
        nameFound = true;
      }
      continue;
    }

    if (nameFound && !resume.personal.title && !/[0-9]/.test(line) && line.length < 50) {
      if (line.includes(',') && !line.includes('|')) {
        const cleanLoc = line.trim();
        if (!resume.personal.location && looksLikeReadableText(cleanLoc)) resume.personal.location = cleanLoc;
      } else {
        const cleanTitle = line.replace(/^[|•*\s]+/, '').trim();
        if (looksLikeReadableText(cleanTitle)) resume.personal.title = cleanTitle;
      }
      continue;
    }
  }

  // 4. Extract Section Chunks
  const sectionChunks = {};
  for (let i = 0; i < sectionIndices.length; i++) {
    const current = sectionIndices[i];
    const next = sectionIndices[i + 1];
    const start = current.lineIndex + 1;
    const end = next ? next.lineIndex : lines.length;
    const chunkLines = lines.slice(start, end);
    sectionChunks[current.section] = chunkLines;
  }

  // 5. Parse Summary
  if (sectionChunks.summary && sectionChunks.summary.length > 0) {
    resume.summary = sectionChunks.summary.join(' ').replace(/\s+/g, ' ').trim();
  }

  // 6. Parse Experience
  if (sectionChunks.experience && sectionChunks.experience.length > 0) {
    const expEntries = parseExperienceChunk(sectionChunks.experience);
    if (expEntries.length > 0) {
      resume.experience = expEntries;
    }
  }

  // 7. Parse Education
  if (sectionChunks.education && sectionChunks.education.length > 0) {
    const eduEntries = parseEducationChunk(sectionChunks.education);
    if (eduEntries.length > 0) {
      resume.education = eduEntries;
    }
  }

  // 8. Parse Skills
  if (sectionChunks.skills && sectionChunks.skills.length > 0) {
    resume.skills = parseSkillsChunk(sectionChunks.skills);
  }

  // 9. Parse Projects
  if (sectionChunks.projects && sectionChunks.projects.length > 0) {
    const projectEntries = parseProjectsChunk(sectionChunks.projects);
    if (projectEntries.length > 0) {
      resume.projects = projectEntries;
    }
  }

  // 10. Parse Certifications
  if (sectionChunks.certifications && sectionChunks.certifications.length > 0) {
    const certEntries = parseCertificationsChunk(sectionChunks.certifications);
    if (certEntries.length > 0) {
      resume.certifications = certEntries;
    }
  }

  // 11. Photo attachment
  if (images && images.length > 0) {
    resume.photo = images[0].dataUrl || null;
  }

  // 12. Cleanup garbled fields
  if (resume.personal.fullName && !looksLikeReadableText(resume.personal.fullName)) resume.personal.fullName = '';
  if (resume.personal.title && !looksLikeReadableText(resume.personal.title)) resume.personal.title = '';
  if (resume.personal.location && !looksLikeReadableText(resume.personal.location)) resume.personal.location = '';
  if (resume.summary && !looksLikeReadableText(resume.summary)) resume.summary = '';
  
  resume.experience.forEach(exp => {
    if (exp.role && !looksLikeReadableText(exp.role)) exp.role = '';
    if (exp.company && !looksLikeReadableText(exp.company)) exp.company = '';
    if (exp.location && !looksLikeReadableText(exp.location)) exp.location = '';
  });
  
  resume.education.forEach(edu => {
    if (edu.degree && !looksLikeReadableText(edu.degree)) edu.degree = '';
    if (edu.institution && !looksLikeReadableText(edu.institution)) edu.institution = '';
  });
  
  resume.projects.forEach(proj => {
    if (proj.name && !looksLikeReadableText(proj.name)) proj.name = '';
    if (proj.description && !looksLikeReadableText(proj.description)) proj.description = '';
  });
  
  resume.certifications.forEach(cert => {
    if (cert.name && !looksLikeReadableText(cert.name)) cert.name = '';
    if (cert.issuer && !looksLikeReadableText(cert.issuer)) cert.issuer = '';
  });

  return resume;
}

/**
 * Intelligent helper to parse work experience entries
 */
function parseExperienceChunk(lines) {
  const entries = [];
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(DATE_RANGE_REGEX);
    const isBullet = isBulletLine(line);

    // Case 1: Line is a bullet point -> belongs to current entry
    if (isBullet && current) {
      const clean = cleanBulletText(line);
      if (clean) current.bullets.push(clean);
      continue;
    }

    // Case 2: Line has date range
    if (dateMatch) {
      const fullDateStr = dateMatch[0];
      const dateParts = fullDateStr.split(/\s*(?:-|–|—|to)\s*/i);
      const start = dateParts[0]?.trim() || '';
      const end = dateParts[1]?.trim() || '';
      const nonDateText = line.replace(fullDateStr, '').replace(/^[|–—\s,()]+|[|–—\s,()]+$/g, '').trim();

      // If current entry exists and hasn't received its dates yet
      if (current && (!current.start || current.start === '') && current.bullets.length === 0) {
        current.start = start;
        current.end = end;
        if (nonDateText && !current.location) {
          current.location = nonDateText;
        }
      } else {
        // Starts a brand new entry
        if (current) entries.push(current);
        current = {
          id: generateId('exp'),
          role: '',
          company: '',
          location: '',
          start,
          end,
          bullets: []
        };
        if (nonDateText) {
          parseRoleAndCompany(nonDateText, current);
        }
      }
      continue;
    }

    // Case 3: Line without dates or bullets (could be company/role/location header)
    if (!current || (current.bullets.length > 0)) {
      // Start of a new experience entry
      if (current) entries.push(current);
      current = {
        id: generateId('exp'),
        role: '',
        company: '',
        location: '',
        start: '',
        end: '',
        bullets: []
      };
      parseRoleAndCompany(line, current);
    } else {
      // Refine existing entry header
      if (!current.role || !current.company) {
        parseRoleAndCompany(line, current);
      } else if (!current.location && (line.includes(',') || line.length < 30)) {
        current.location = line.trim();
      } else {
        current.bullets.push(cleanBulletText(line));
      }
    }
  }

  if (current) entries.push(current);

  return entries
    .filter(e => e.role || e.company || e.bullets.length > 0)
    .map(e => ({
      ...e,
      bullets: e.bullets.length > 0 ? e.bullets : ['']
    }));
}

function parseRoleAndCompany(text, entry) {
  if (!text) return;

  // Pattern: "Role at Company"
  if (text.includes(' at ')) {
    const parts = text.split(' at ');
    entry.role = parts[0].trim();
    entry.company = parts[1].trim();
    return;
  }

  // Pattern: "Company | Role | Location" or "Role | Company | Location"
  if (text.includes('|')) {
    const parts = text.split('|').map(p => p.trim());
    if (parts.length >= 2) {
      if (parts[0].toLowerCase().includes('engineer') || parts[0].toLowerCase().includes('lead') || parts[0].toLowerCase().includes('designer') || parts[0].toLowerCase().includes('developer') || parts[0].toLowerCase().includes('manager')) {
        entry.role = parts[0];
        entry.company = parts[1];
      } else {
        entry.company = parts[0];
        entry.role = parts[1];
      }
      if (parts[2]) entry.location = parts[2];
      return;
    }
  }

  // Pattern: "Role - Company" or "Company - Role"
  if (text.includes(' - ') || text.includes(' – ')) {
    const parts = text.split(/\s+[-–]\s+/);
    if (parts.length >= 2) {
      if (parts[0].toLowerCase().includes('engineer') || parts[0].toLowerCase().includes('lead') || parts[0].toLowerCase().includes('designer') || parts[0].toLowerCase().includes('developer') || parts[0].toLowerCase().includes('manager')) {
        entry.role = parts[0].trim();
        entry.company = parts[1].trim();
      } else {
        entry.company = parts[0].trim();
        entry.role = parts[1].trim();
      }
      return;
    }
  }

  // Fallback
  if (!entry.role && !entry.company) {
    if (text.toLowerCase().includes('engineer') || text.toLowerCase().includes('lead') || text.toLowerCase().includes('designer') || text.toLowerCase().includes('developer') || text.toLowerCase().includes('manager')) {
      entry.role = text.trim();
    } else {
      entry.company = text.trim();
    }
  }
}

/**
 * Intelligent helper to parse education entries
 */
function parseEducationChunk(lines) {
  const entries = [];
  let current = null;

  for (const line of lines) {
    const dateMatch = line.match(DATE_RANGE_REGEX) || line.match(SINGLE_DATE_REGEX);
    const hasDegreeWord = DEGREE_KEYWORDS.some(k => line.toLowerCase().includes(k));

    if (hasDegreeWord || (current && current.degree && !current.institution)) {
      if (hasDegreeWord && current && current.degree) {
        entries.push(current);
        current = null;
      }

      if (!current) {
        current = {
          id: generateId('edu'),
          degree: '',
          institution: '',
          start: '',
          end: '',
          details: ''
        };
      }

      if (hasDegreeWord) {
        if (line.includes(',') || line.includes(' - ') || line.includes(' | ')) {
          const parts = line.split(/[,|\-–—]/).map(p => p.trim()).filter(Boolean);
          current.degree = parts.find(p => DEGREE_KEYWORDS.some(k => p.toLowerCase().includes(k))) || parts[0] || '';
          current.institution = parts.find(p => p !== current.degree) || '';
        } else {
          current.degree = line;
        }
      } else if (!current.institution) {
        current.institution = line;
      }
    } else if (dateMatch && current) {
      const fullDateStr = dateMatch[0];
      const dateParts = fullDateStr.split(/\s*(?:-|–|—|to)\s*/i);
      current.start = dateParts[0]?.trim() || '';
      current.end = dateParts[1]?.trim() || (dateParts[0] ? dateParts[0].trim() : '');
    } else if (current) {
      if (!current.institution) {
        current.institution = line;
      } else if (!current.details) {
        current.details = line;
      } else {
        current.details += ' ' + line;
      }
    }
  }

  if (current) entries.push(current);
  return entries.filter(e => e.degree || e.institution);
}

/**
 * Intelligent helper to parse skills
 */
function parseSkillsChunk(lines) {
  // Preserve CI/CD and similar forward-slash tech acronyms before splitting
  const protectedText = lines.join(', ')
    .replace(/CI\/CD/gi, 'CI_CD_PROTECTED')
    .replace(/TCP\/IP/gi, 'TCP_IP_PROTECTED')
    .replace(/I\/O/gi, 'I_O_PROTECTED');

  const rawSkills = protectedText
    .split(/[,•|;*\/–\n]/)
    .map(s => s.trim().replace(/^[-*•\s]+/, '').replace(/[:\-_#*]+$/, '').trim())
    .map(s => s.replace('CI_CD_PROTECTED', 'CI/CD').replace('TCP_IP_PROTECTED', 'TCP/IP').replace('I_O_PROTECTED', 'I/O'))
    .filter(s => s.length > 1 && s.length < 40 && !SECTION_PATTERNS.skills.test(s));

  const seen = new Set();
  const uniqueSkills = [];
  for (const skill of rawSkills) {
    const lower = skill.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueSkills.push(skill);
    }
  }
  return uniqueSkills;
}

/**
 * Intelligent helper to parse projects
 */
function parseProjectsChunk(lines) {
  const projects = [];
  let current = null;

  for (const line of lines) {
    const isBullet = isBulletLine(line);
    const hasUrl = GENERIC_URL_REGEX.test(line);

    if (!isBullet && (line.includes(' | ') || line.includes(' - ') || projects.length === 0 || !current)) {
      if (current) projects.push(current);
      const namePart = line.split(/[|\-–]/)[0].trim();
      current = {
        id: generateId('proj'),
        name: namePart,
        description: '',
        link: ''
      };
      
      const urlMatch = line.match(GENERIC_URL_REGEX);
      if (urlMatch) current.link = urlMatch[0];
    } else if (current) {
      const urlMatch = line.match(GENERIC_URL_REGEX);
      if (urlMatch && !current.link) {
        current.link = urlMatch[0];
      }
      const text = cleanBulletText(line);
      if (current.description) {
        current.description += ' ' + text;
      } else {
        current.description = text;
      }
    }
  }

  if (current) projects.push(current);
  return projects.filter(p => p.name || p.description);
}

/**
 * Intelligent helper to parse certifications
 */
function parseCertificationsChunk(lines) {
  const certs = [];
  for (const line of lines) {
    const clean = cleanBulletText(line);
    if (!clean) continue;

    const dateMatch = clean.match(SINGLE_DATE_REGEX);
    let name = clean;
    let issuer = '';
    let date = '';

    if (dateMatch) {
      date = dateMatch[0];
      name = name.replace(date, '').replace(/^[|–—\s,()]+|[|–—\s,()]+$/g, '').trim();
    }

    if (name.includes(' - ') || name.includes(' | ') || name.includes(' by ')) {
      const parts = name.split(/\s+(?:-|\||by)\s+/i);
      name = parts[0]?.trim() || name;
      issuer = parts[1]?.trim() || '';
    }

    if (name.length > 2) {
      certs.push({
        id: generateId('cert'),
        name,
        issuer,
        date
      });
    }
  }
  return certs;
}

function isBulletLine(line) {
  return /^[\s]*[•*\-–—▪▫\d+\.]/.test(line);
}

function cleanBulletText(line) {
  return line.replace(/^[\s]*[•*\-–—▪▫\d+\.]+\s*/, '').trim();
}
