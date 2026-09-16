const fs = require('fs');

let content = fs.readFileSync('src/components/preview/templates/ModernTemplate.jsx', 'utf8');

// The one line change: remove the "ignored" comment and map the pill color
content = content.replace(
  "// Ignored accentColor since this template uses a fixed white-violet identity",
  `const pillColor = { slate: 'bg-slate-600', indigo: 'bg-violet-600', blue: 'bg-blue-600', emerald: 'bg-emerald-600', rose: 'bg-rose-600', violet: 'bg-violet-600' }[accentColor] || 'bg-violet-600';`
);

// Replace the pill JSX
const oldPill = `<span
                  key={idx}
                  className="inline-flex items-center leading-none px-2.5 py-1 rounded-full text-[10px] font-medium border bg-violet-50 text-violet-700 border-violet-200"
                >
                  {skill}
                </span>`;

const newPill = `<span
                  key={idx}
                  className={\`inline-flex items-center leading-none px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-sm \${pillColor}\`}
                >
                  {skill}
                </span>`;

if (content.includes(oldPill)) {
  content = content.replace(oldPill, newPill);
} else {
  // Try regex if exact whitespace differs
  const pillRegex = /<span\s+key=\{idx\}\s+className="inline-flex items-center leading-none px-2\.5 py-1 rounded-full text-\[10px\] font-medium border bg-violet-50 text-violet-700 border-violet-200"\s*>[\s\S]*?<\/span>/;
  content = content.replace(pillRegex, newPill);
}

fs.writeFileSync('src/components/preview/templates/ModernTemplate.jsx', content, 'utf8');
