import { generateId } from '../schema.js';

const STORAGE_KEY = 'cvbuilder:resumes';
const ACTIVE_ID_KEY = 'cvbuilder:active_id';

/**
 * Lists all resumes stored in localStorage, sorted by updatedAt descending
 */
export function listResumes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  } catch (e) {
    console.error('Failed to list resumes from localStorage', e);
    return [];
  }
}

/**
 * Saves or updates a resume in localStorage
 */
export function saveResume(resume) {
  if (!resume || !resume.id) return null;
  try {
    const resumes = listResumes();
    const index = resumes.findIndex(r => r.id === resume.id);
    const updated = {
      ...resume,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      resumes[index] = updated;
    } else {
      resumes.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    setActiveResumeId(updated.id);
    return updated;
  } catch (e) {
    console.error('Failed to save resume', e);
    return resume;
  }
}

/**
 * Loads a specific resume by its ID
 */
export function loadResume(id) {
  if (!id) return null;
  const resumes = listResumes();
  return resumes.find(r => r.id === id) || null;
}

/**
 * Deletes a resume by its ID
 */
export function deleteResume(id) {
  try {
    const resumes = listResumes().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    
    // If active ID was deleted, reset active ID
    if (getActiveResumeId() === id) {
      const nextActive = resumes.length > 0 ? resumes[0].id : null;
      setActiveResumeId(nextActive);
    }
    return resumes;
  } catch (e) {
    console.error('Failed to delete resume', e);
    return listResumes();
  }
}

/**
 * Duplicates an existing resume with a new ID
 */
export function duplicateResume(id) {
  const source = loadResume(id);
  if (!source) return null;

  const clone = {
    ...JSON.parse(JSON.stringify(source)),
    id: `resume_${Date.now()}`,
    title: `${source.title || 'Resume'} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return saveResume(clone);
}

/**
 * Gets the active resume ID from localStorage
 */
export function getActiveResumeId() {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY) || null;
  } catch (e) {
    return null;
  }
}

/**
 * Sets the active resume ID in localStorage
 */
export function setActiveResumeId(id) {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_ID_KEY);
    }
  } catch (e) {
    console.error('Failed to set active resume ID', e);
  }
}

/**
 * Exports resume object to downloadable JSON file
 */
export function exportResumeToJson(resume) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `${(resume.personal?.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_data.json`;
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validates and parses JSON string into a resume object
 */
export function parseResumeFromJson(jsonString) {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON format');
  }
  if (!parsed.id) {
    parsed.id = `resume_${Date.now()}`;
  }
  return parsed;
}
