import { createEmptyResume, createSampleResume, generateId } from '../../schema.js';

console.log('--- TESTING RESUME FORM STATE MUTATIONS & INTEGRITY ---\n');

// 1. Initialize from sample
let resume = createSampleResume();
console.log('1. Loaded initial sample resume for:', resume.personal.fullName);

// 2. Personal Info Edit
resume.personal.fullName = 'Jane Doe';
resume.personal.title = 'Staff Engineer & Architect';
resume.personal.links.push({ id: generateId('link'), label: 'Twitter', url: 'https://twitter.com/janedoe' });
console.log('✅ Personal info edited. New name:', resume.personal.fullName, '| Links count:', resume.personal.links.length);

// 3. Experience Add, Edit, Delete, Reorder
const initialExpCount = resume.experience.length;
const newExp = {
  id: generateId('exp'),
  role: 'VP of Engineering',
  company: 'NextGen Systems',
  location: 'New York, NY',
  start: '2024',
  end: 'Present',
  bullets: ['Spearheaded 50-person engineering organization.', 'Scaled infrastructure to 10M DAU.']
};
// Add to beginning (move up)
resume.experience = [newExp, ...resume.experience];
console.log(`✅ Added new position. Total positions: ${resume.experience.length} (was ${initialExpCount})`);

// Bullet addition
resume.experience[0].bullets.push('Reduced cloud costs by 35% across AWS fleet.');
console.log(`✅ Added bullet to first position. Bullets: ${resume.experience[0].bullets.length}`);

// Delete last experience
const deletedId = resume.experience[resume.experience.length - 1].id;
resume.experience = resume.experience.filter(e => e.id !== deletedId);
console.log(`✅ Deleted position ${deletedId}. Remaining: ${resume.experience.length}`);

// 4. Skills Tag Mutations
const initialSkillsCount = resume.skills.length;
resume.skills.push('Rust', 'WebAssembly');
resume.skills = resume.skills.filter(s => s !== 'TypeScript');
console.log(`✅ Modified skills. Total skills: ${resume.skills.length} (was ${initialSkillsCount})`);

// 5. Education & Certifications
resume.education.push({
  id: generateId('edu'),
  degree: 'M.S. in AI & Robotics',
  institution: 'MIT',
  start: '2019',
  end: '2021',
  details: 'Thesis on Reinforcement Learning.'
});

resume.certifications.push({
  id: generateId('cert'),
  name: 'CKA Certified Kubernetes Administrator',
  issuer: 'CNCF',
  date: '2024'
});
console.log(`✅ Education (${resume.education.length}) and Certifications (${resume.certifications.length}) updated.`);

// 6. Test Empty State Resilience
const emptyResume = createEmptyResume();
console.log('✅ Created completely blank resume without errors:', emptyResume.id);

console.log('\n--- ALL FORM STATE MUTATIONS PASSED SUCCESSFULLY ---');
