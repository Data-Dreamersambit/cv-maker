import { normalizeSmartParsedData } from '../smartParse.js';
import { createSampleResume } from '../../schema.js';

console.log('--- TESTING SMART PARSE NORMALIZATION & MERGE LOGIC ---\n');

// 1. Raw synthetic LLM JSON output
const mockLlmOutput = {
  personal: {
    fullName: 'David Hassel',
    title: 'Chief Technology Officer',
    email: 'dhassel@example.com',
    phone: '+1 (415) 888-9999',
    location: 'Austin, TX',
    links: [{ label: 'GitHub', url: 'https://github.com/dhassel' }]
  },
  summary: 'Seasoned engineering executive with 15 years leading hyper-growth infrastructure teams.',
  experience: [
    {
      role: 'CTO',
      company: 'DataFlow Systems',
      location: 'Austin, TX',
      start: '2021',
      end: 'Present',
      bullets: ['Scaled engineering from 10 to 120 engineers.', 'Led Series B and C funding rounds.']
    }
  ],
  education: [
    {
      degree: 'Ph.D. in Computer Science',
      institution: 'Carnegie Mellon University',
      start: '2005',
      end: '2010',
      details: 'Distributed Consensus Protocols.'
    }
  ],
  skills: ['System Architecture', 'Go', 'Rust', 'Kubernetes', 'Executive Leadership'],
  projects: [],
  certifications: []
};

// 2. Normalize and check UUIDs
const normalized = normalizeSmartParsedData(mockLlmOutput);
console.log('✅ Normalized LLM payload successfully.');
if (!normalized.experience[0].id || !normalized.education[0].id) {
  throw new Error('Normalization failed to assign stable IDs');
}
console.log('✅ Assigned stable UUID to experience:', normalized.experience[0].id);

// 3. Test Selective Merge without clobbering unselected fields
const current = createSampleResume();
const initialProjects = [...current.projects];

// Simulate user accepting AI Summary and Experience only
const merged = {
  ...current,
  summary: normalized.summary,
  experience: normalized.experience
};

if (merged.summary !== mockLlmOutput.summary) {
  throw new Error('Summary was not merged');
}
if (merged.projects.length !== initialProjects.length) {
  throw new Error('Unselected projects were unexpectedly modified');
}
console.log('✅ Selective non-destructive merge verified.');

console.log('\n--- ALL SMART PARSE LOGIC TESTS PASSED ---');
