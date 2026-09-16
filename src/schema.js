export function generateId(prefix = 'item') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createEmptyResume(title = 'Untitled Resume') {
  return {
    id: `resume_${Date.now()}`,
    title: title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    photo: null,
    personal: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      dateOfBirth: '',
      links: [
        { id: generateId('link'), label: 'LinkedIn', url: '' },
        { id: generateId('link'), label: 'GitHub', url: '' }
      ]
    },
    summary: '',
    experience: [
      {
        id: generateId('exp'),
        role: '',
        company: '',
        location: '',
        start: '',
        end: '',
        bullets: ['']
      }
    ],
    education: [
      {
        id: generateId('edu'),
        degree: '',
        institution: '',
        start: '',
        end: '',
        details: ''
      }
    ],
    skills: [],
    projects: [
      {
        id: generateId('proj'),
        name: '',
        description: '',
        link: ''
      }
    ],
    certifications: [
      {
        id: generateId('cert'),
        name: '',
        issuer: '',
        date: ''
      }
    ]
  };
}

export function createSampleResume() {
  return {
    id: `resume_${Date.now()}`,
    title: 'Software Engineer Resume',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    photo: null,
    personal: {
      fullName: 'Alex Morgan',
      title: 'Senior Full Stack Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      dateOfBirth: '',
      links: [
        { id: generateId('link'), label: 'LinkedIn', url: 'https://linkedin.com/in/alexmorgan' },
        { id: generateId('link'), label: 'GitHub', url: 'https://github.com/alexmorgan' },
        { id: generateId('link'), label: 'Portfolio', url: 'https://alexmorgan.dev' }
      ]
    },
    summary: 'Experienced Full Stack Engineer with 6+ years building scalable distributed web applications, cloud architectures, and modern React interfaces. Passionate about developer tooling and high-performance frontend systems.',
    experience: [
      {
        id: generateId('exp'),
        role: 'Senior Software Engineer',
        company: 'CloudScale Technologies',
        location: 'San Francisco, CA',
        start: 'Jan 2022',
        end: 'Present',
        bullets: [
          'Architected and led the migration of monolithic dashboard to React + Vite micro-frontends, reducing initial page load time by 45%.',
          'Built high-throughput real-time telemetry streaming service using WebSockets and Node.js handling 100k+ concurrent events.',
          'Mentored 5 junior engineers and established automated CI/CD linting and integration testing pipelines.'
        ]
      },
      {
        id: generateId('exp'),
        role: 'Full Stack Developer',
        company: 'Innovate Labs',
        location: 'Austin, TX',
        start: 'Aug 2019',
        end: 'Dec 2021',
        bullets: [
          'Developed core client-facing analytics portal using React, TypeScript, and GraphQL APIs.',
          'Optimized PostgreSQL query performance resulting in 60% reduction in average reporting latency.'
        ]
      }
    ],
    education: [
      {
        id: generateId('edu'),
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        start: '2015',
        end: '2019',
        details: 'Graduated with Honors. Focus on Distributed Systems & Human-Computer Interaction.'
      }
    ],
    skills: [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Vite', 'Tailwind CSS',
      'Python', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Git'
    ],
    projects: [
      {
        id: generateId('proj'),
        name: 'OpenMetrics Dashboard',
        description: 'Open-source lightweight server monitoring UI with real-time charting.',
        link: 'https://github.com/alexmorgan/openmetrics'
      }
    ],
    certifications: [
      {
        id: generateId('cert'),
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2023'
      }
    ]
  };
}
