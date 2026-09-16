// Mock localStorage in Node environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}
globalThis.localStorage = new LocalStorageMock();

import { listResumes, saveResume, loadResume, deleteResume, duplicateResume, parseResumeFromJson } from '../storage.js';
import { createSampleResume, createEmptyResume } from '../../schema.js';

console.log('--- TESTING LOCALSTORAGE MULTI-RESUME PERSISTENCE ---\n');

// 1. Create and Save Resume 1
const resume1 = createSampleResume();
resume1.id = 'resume_test_1';
resume1.title = 'Frontend Engineer';
resume1.personal.fullName = 'Alice Johnson';
saveResume(resume1);
console.log('1. Saved Resume 1: Alice Johnson');

// 2. Create and Save Resume 2
const resume2 = createSampleResume();
resume2.id = 'resume_test_2';
resume2.title = 'Backend Architect';
resume2.personal.fullName = 'Bob Smith';
saveResume(resume2);
console.log('2. Saved Resume 2: Bob Smith');

// 3. Verify Isolation & List
const all = listResumes();
console.log(`✅ Stored Resumes Count: ${all.length}`);
if (all.length !== 2) throw new Error('Expected 2 resumes in list');

// 4. Update Resume 1 and check Resume 2 is not affected
const loaded1 = loadResume('resume_test_1');
loaded1.personal.fullName = 'Alice Johnson, Staff Eng';
saveResume(loaded1);

const loaded2 = loadResume('resume_test_2');
if (loaded2.personal.fullName !== 'Bob Smith') {
  throw new Error('Resume 2 was unexpectedly mutated!');
}
console.log('✅ Independent multi-resume isolation verified.');

// 5. Test Duplicate
const duplicated = duplicateResume('resume_test_1');
console.log(`✅ Duplicated Resume: "${duplicated.title}" with ID ${duplicated.id}`);
if (listResumes().length !== 3) throw new Error('Expected 3 resumes after duplication');

// 6. Test Delete
deleteResume('resume_test_2');
const remainingAfterDelete = listResumes();
console.log(`✅ Deleted Resume 2. Remaining count: ${remainingAfterDelete.length}`);
if (remainingAfterDelete.some(r => r.id === 'resume_test_2')) {
  throw new Error('Resume 2 was not deleted!');
}

// 7. Test JSON Import / Export schema parsing
const jsonStr = JSON.stringify(duplicated);
const parsed = parseResumeFromJson(jsonStr);
console.log(`✅ Parsed JSON import verified for: ${parsed.personal.fullName}`);

console.log('\n--- ALL LOCALSTORAGE PERSISTENCE TESTS PASSED ---');
