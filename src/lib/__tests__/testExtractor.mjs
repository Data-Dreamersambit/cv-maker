import { extractResumeFields } from '../fieldExtractor.js';

const testResumes = [
  {
    name: 'Sample 1: Senior Software Engineer (US Format)',
    text: `Sarah Connor
Senior Backend Engineer
sarah.connor@cyberdyne.io | (415) 555-0199 | San Francisco, CA
https://linkedin.com/in/sarah-connor https://github.com/sconnor

PROFESSIONAL SUMMARY
Passionate backend architect specializing in Golang, Kubernetes, and event-driven microservices with 8+ years of production experience.

WORK EXPERIENCE
Principal Engineer at Stripe
San Francisco, CA
Jan 2021 – Present
• Designed and implemented payment idempotency pipeline processing $50M daily transactions.
• Reduced p99 API latency from 180ms to 45ms across core checkout services.
• Mentored 8 software engineers and led cross-functional infrastructure initiatives.

Software Engineer at Uber
Seattle, WA
Mar 2017 – Dec 2020
• Scaled dispatch routing algorithm handling 20,000 requests per second.
• Built automated load shedding framework in Go and Kafka.

EDUCATION
B.S. in Computer Science
Stanford University
2013 – 2017
GPA 3.9/4.0, Magna Cum Laude

SKILLS
Go, Python, Kubernetes, Docker, PostgreSQL, Redis, Apache Kafka, gRPC, AWS, Terraform, CI/CD

PROJECTS
OmniCache - Distributed In-Memory Cache | https://github.com/sconnor/omnicache
High-performance distributed cache supporting Raft consensus and TTL evictions.

CERTIFICATIONS
AWS Certified Solutions Architect - Amazon Web Services (2022)
Certified Kubernetes Administrator (CKA) - Cloud Native Computing Foundation (2021)
`
  },
  {
    name: 'Sample 2: Indian Full Stack Developer (+91 Phone)',
    text: `Rahul Sharma
Full Stack Developer
rahul.sharma99@gmail.com | +91 9876543210 | Bengaluru, India
linkedin.com/in/rahulsharma-dev github.com/rahulsharma

SUMMARY
Full stack developer with 4 years building fintech apps with React, Node.js, and MongoDB.

EXPERIENCE
Frontend Lead - Flipkart
Bengaluru, India
June 2021 – Present
• Spearheaded migration to Next.js resulting in 30% improvement in Core Web Vitals.
• Built reusable component design system used by 40+ frontend engineers.

Junior Software Developer - Infosys
Pune, India
Aug 2019 – May 2021
• Developed responsive client portals in React and Redux.
• Authored REST APIs using Express.js and PostgreSQL.

EDUCATION
B.Tech in Information Technology
National Institute of Technology, Karnataka
2015 – 2019
First Class with Distinction

SKILLS
JavaScript, TypeScript, React.js, Next.js, Node.js, Express, MongoDB, Tailwind CSS, Redux Toolkit, Git

CERTIFICATIONS
Meta Certified Front-End Developer - Meta (2023)
`
  },
  {
    name: 'Sample 3: Product Designer & UI Engineer',
    text: `Elena Rostova
Product Designer & Design Technologist
elena.design@protonmail.com | +44 20 7946 0912 | London, UK
https://elenarostova.design linkedin.com/in/elena-rostova

PROFILE
Product designer combining Figma expertise with React and CSS craftsmanship to deliver accessible design systems.

WORK EXPERIENCE
Senior Product Designer | Deliveroo | London
Jan 2020 - Present
• Led consumer checkout redesign increasing mobile conversion by 14%.
• Built and documented comprehensive Figma token library and React storybook.

UI/UX Designer | Revolut
Oct 2017 - Dec 2019
• Designed wealth and crypto onboarding experiences for 2M+ users.

EDUCATION
Master of Arts in Interaction Design
Royal College of Art
2015 - 2017

SKILLS
Figma, Design Systems, Wireframing, User Research, React, CSS3, HTML5, Storybook, Accessibility (WCAG), Prototyping

PROJECTS
A11yTokens | https://github.com/elena/a11ytokens
Open-source design token accessibility validator for WCAG 2.1 compliance.
`
  }
];

console.log('--- RUNNING FIELD EXTRACTOR ACCURACY BENCHMARK ---\n');

let totalTests = 0;
let passedMetrics = 0;

testResumes.forEach((sample, i) => {
  console.log(`\n================== [ ${sample.name} ] ==================`);
  const extracted = extractResumeFields(sample.text);

  console.log('1. Contact Info:');
  console.log(`   - Name:     "${extracted.personal.fullName}"`);
  console.log(`   - Title:    "${extracted.personal.title}"`);
  console.log(`   - Email:    "${extracted.personal.email}"`);
  console.log(`   - Phone:    "${extracted.personal.phone}"`);
  console.log(`   - Location: "${extracted.personal.location}"`);
  console.log(`   - Links (${extracted.personal.links.length}):`, extracted.personal.links.map(l => `${l.label}: ${l.url}`));

  console.log('2. Summary:');
  console.log(`   - "${extracted.summary.slice(0, 70)}..."`);

  console.log(`3. Experience (${extracted.experience.length} jobs detected):`);
  extracted.experience.forEach((exp, idx) => {
    console.log(`   [${idx + 1}] Role: "${exp.role}", Company: "${exp.company}", Dates: "${exp.start}" -> "${exp.end}", Bullets: ${exp.bullets.length}`);
  });

  console.log(`4. Education (${extracted.education.length} entries):`);
  extracted.education.forEach((edu, idx) => {
    console.log(`   [${idx + 1}] Degree: "${edu.degree}", School: "${edu.institution}", Dates: "${edu.start}" -> "${edu.end}"`);
  });

  console.log(`5. Skills (${extracted.skills.length} skills):`, extracted.skills.join(', '));
  console.log(`6. Projects (${extracted.projects.length} projects):`, extracted.projects.map(p => p.name).join(', '));
  console.log(`7. Certifications (${extracted.certifications.length} certs):`, extracted.certifications.map(c => `${c.name} (${c.issuer})`).join(', '));

  // Evaluation checks
  const hasName = extracted.personal.fullName.length > 0;
  const hasEmail = extracted.personal.email.includes('@');
  const hasPhone = extracted.personal.phone.length > 5;
  const hasExp = extracted.experience.length >= 2;
  const hasEdu = extracted.education.length >= 1;
  const hasSkills = extracted.skills.length >= 5;

  if (hasName) passedMetrics++;
  if (hasEmail) passedMetrics++;
  if (hasPhone) passedMetrics++;
  if (hasExp) passedMetrics++;
  if (hasEdu) passedMetrics++;
  if (hasSkills) passedMetrics++;
  totalTests += 6;
});

console.log(`\n-------------------------------------------------`);
console.log(`Extraction Success Rate: ${passedMetrics} / ${totalTests} core metrics passed (${Math.round((passedMetrics / totalTests) * 100)}%)`);
