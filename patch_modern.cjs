const fs = require('fs');
let content = fs.readFileSync('src/components/preview/templates/ModernTemplate.jsx', 'utf8');

const mapping = `
  const theme = {
    slate: { bg: 'bg-slate-50/40', border: 'border-slate-100', text: 'text-slate-700', borderB: 'border-slate-200', icon: 'text-slate-400', grad: 'from-slate-600 to-slate-400', bullet: 'text-slate-400', pill: 'bg-slate-600' },
    indigo: { bg: 'bg-indigo-50/40', border: 'border-indigo-100', text: 'text-indigo-700', borderB: 'border-indigo-200', icon: 'text-indigo-300', grad: 'from-indigo-600 to-indigo-300', bullet: 'text-indigo-400', pill: 'bg-indigo-600' },
    blue: { bg: 'bg-blue-50/40', border: 'border-blue-100', text: 'text-blue-700', borderB: 'border-blue-200', icon: 'text-blue-300', grad: 'from-blue-600 to-blue-300', bullet: 'text-blue-400', pill: 'bg-blue-600' },
    emerald: { bg: 'bg-emerald-50/40', border: 'border-emerald-100', text: 'text-emerald-700', borderB: 'border-emerald-200', icon: 'text-emerald-300', grad: 'from-emerald-600 to-emerald-300', bullet: 'text-emerald-400', pill: 'bg-emerald-600' },
    rose: { bg: 'bg-rose-50/40', border: 'border-rose-100', text: 'text-rose-700', borderB: 'border-rose-200', icon: 'text-rose-300', grad: 'from-rose-600 to-rose-300', bullet: 'text-rose-400', pill: 'bg-rose-600' },
    violet: { bg: 'bg-violet-50/40', border: 'border-violet-100', text: 'text-violet-700', borderB: 'border-violet-200', icon: 'text-violet-300', grad: 'from-violet-600 to-violet-300', bullet: 'text-violet-400', pill: 'bg-violet-600' }
  }[accentColor] || { bg: 'bg-violet-50/40', border: 'border-violet-100', text: 'text-violet-700', borderB: 'border-violet-200', icon: 'text-violet-300', grad: 'from-violet-600 to-violet-300', bullet: 'text-violet-400', pill: 'bg-violet-600' };
`;

// Inject mapping
content = content.replace(
  /const pillColor = \{[\s\S]*?\} \[accentColor\] \|\| 'bg-violet-600';/,
  mapping.trim()
);

// We need to replace classNames cautiously. We will just re-write the specific elements.
content = content.replace(/bg-violet-50\/40/g, '${theme.bg}');
content = content.replace(/border-violet-100/g, '${theme.border}');
content = content.replace(/ring-violet-100/g, 'ring-${theme.border.replace("border-", "")}');
content = content.replace(/text-violet-700/g, '${theme.text}');
content = content.replace(/border-violet-200/g, '${theme.borderB}');
content = content.replace(/text-violet-300/g, '${theme.icon}');
content = content.replace(/from-violet-600 to-violet-300/g, '${theme.grad}');
content = content.replace(/text-violet-400/g, '${theme.bullet}');
content = content.replace(/\$\{pillColor\}/g, '${theme.pill}');

// Since we replaced inside classNames, we need to convert string literals "..." to backticks `...` if they contain ${theme...}
const classRegex = /className="([^"]*\$\{theme\.[^"]*)[^"]*"/g;
let match;
while ((match = classRegex.exec(content)) !== null) {
  const fullMatch = match[0];
  const replaced = fullMatch.replace(/^className="/, 'className={`').replace(/"$/, '`}');
  content = content.substring(0, match.index) + replaced + content.substring(match.index + fullMatch.length);
  // Reset regex index because we modified the string
  classRegex.lastIndex = 0;
}

fs.writeFileSync('src/components/preview/templates/ModernTemplate.jsx', content, 'utf8');
