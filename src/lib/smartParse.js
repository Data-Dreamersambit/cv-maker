import { generateId } from '../schema.js';

const AI_KEYS_STORAGE = 'cvbuilder:ai_keys';

/**
 * Gets saved API keys from localStorage
 */
export function getSavedAiKeys() {
  try {
    const raw = localStorage.getItem(AI_KEYS_STORAGE);
    return raw ? JSON.parse(raw) : { openai: '', anthropic: '', gemini: '', provider: 'openai' };
  } catch (e) {
    return { openai: '', anthropic: '', gemini: '', provider: 'openai' };
  }
}

/**
 * Saves API keys in localStorage
 */
export function saveAiKeys(keys) {
  try {
    localStorage.setItem(AI_KEYS_STORAGE, JSON.stringify(keys));
  } catch (e) {
    console.error('Failed to save AI keys', e);
  }
}

const SYSTEM_PROMPT = `You are a high-precision CV/resume parsing engine.
Your task is to extract structured data from raw resume text into valid JSON matching the exact schema below.

JSON SCHEMA:
{
  "personal": {
    "fullName": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "links": [{ "label": "string", "url": "string" }]
  },
  "summary": "string",
  "experience": [
    {
      "role": "string",
      "company": "string",
      "location": "string",
      "start": "string",
      "end": "string",
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "start": "string",
      "end": "string",
      "details": "string"
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "link": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ]
}

RULES:
1. Return ONLY pure valid JSON. No markdown codeblocks (no \`\`\`json), no prefix, no postfix.
2. If a field is not present in the text, use empty string "" or empty array [].
3. For skills, return an array of individual skill strings (e.g. ["React", "TypeScript", "Node.js"]).
4. For experience and education, retain exact chronological dates and preserve all bullet points.`;

/**
 * Performs AI-assisted extraction using direct client-side fetch calls
 */
export async function runSmartParse({ rawText, provider = 'openai', apiKey, model }) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API Key is required to run Smart Parse.');
  }
  if (!rawText || !rawText.trim()) {
    throw new Error('No resume text available to parse.');
  }

  let rawJsonText = '';

  if (provider === 'openai') {
    const selectedModel = model || 'gpt-4o-mini';
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: selectedModel,
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Here is the resume raw text to parse:\n\n${rawText}` }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    rawJsonText = data.choices?.[0]?.message?.content || '{}';
  } else if (provider === 'anthropic') {
    const selectedModel = model || 'claude-3-5-sonnet-20241022';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: `Here is the resume raw text to parse into JSON:\n\n${rawText}` }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    rawJsonText = data.content?.[0]?.text || '{}';
  } else if (provider === 'gemini') {
    const selectedModel = model || 'gemini-1.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_PROMPT}\n\nHere is the resume text to parse:\n${rawText}` }
            ]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.1
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  // Clean and parse returned JSON
  const cleaned = rawJsonText.replace(/^```json\s*|\s*```$/g, '').trim();
  const parsed = JSON.parse(cleaned);

  // Hydrate with UUIDs to maintain schema consistency
  return normalizeSmartParsedData(parsed);
}

/**
 * Ensures all array items have stable IDs matching schema
 */
export function normalizeSmartParsedData(data) {
  return {
    personal: {
      fullName: data.personal?.fullName || '',
      title: data.personal?.title || '',
      email: data.personal?.email || '',
      phone: data.personal?.phone || '',
      location: data.personal?.location || '',
      links: (data.personal?.links || []).map(l => ({
        id: generateId('link'),
        label: l.label || 'Link',
        url: l.url || ''
      }))
    },
    summary: data.summary || '',
    experience: (data.experience || []).map(e => ({
      id: generateId('exp'),
      role: e.role || '',
      company: e.company || '',
      location: e.location || '',
      start: e.start || '',
      end: e.end || '',
      bullets: Array.isArray(e.bullets) && e.bullets.length > 0 ? e.bullets : ['']
    })),
    education: (data.education || []).map(ed => ({
      id: generateId('edu'),
      degree: ed.degree || '',
      institution: ed.institution || '',
      start: ed.start || '',
      end: ed.end || '',
      details: ed.details || ''
    })),
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: (data.projects || []).map(p => ({
      id: generateId('proj'),
      name: p.name || '',
      description: p.description || '',
      link: p.link || ''
    })),
    certifications: (data.certifications || []).map(c => ({
      id: generateId('cert'),
      name: c.name || '',
      issuer: c.issuer || '',
      date: c.date || ''
    }))
  };
}
