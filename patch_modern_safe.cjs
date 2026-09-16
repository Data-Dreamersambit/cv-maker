const fs = require('fs');
let content = fs.readFileSync('src/components/preview/templates/ModernTemplate.jsx', 'utf8');

// 1. Remove ignore comment and add theme object
const themeObj = `
  const theme = {
    slate: { bg: 'bg-slate-50/40', border: 'border-slate-100', text: 'text-slate-700', borderB: 'border-slate-200', icon: 'text-slate-300', grad: 'from-slate-600 to-slate-400', bullet: 'text-slate-400', pill: 'bg-slate-600', ring: 'ring-slate-100' },
    indigo: { bg: 'bg-violet-50/40', border: 'border-violet-100', text: 'text-violet-700', borderB: 'border-violet-200', icon: 'text-violet-300', grad: 'from-violet-600 to-violet-300', bullet: 'text-violet-400', pill: 'bg-violet-600', ring: 'ring-violet-100' },
    blue: { bg: 'bg-blue-50/40', border: 'border-blue-100', text: 'text-blue-700', borderB: 'border-blue-200', icon: 'text-blue-300', grad: 'from-blue-600 to-blue-300', bullet: 'text-blue-400', pill: 'bg-blue-600', ring: 'ring-blue-100' },
    emerald: { bg: 'bg-emerald-50/40', border: 'border-emerald-100', text: 'text-emerald-700', borderB: 'border-emerald-200', icon: 'text-emerald-300', grad: 'from-emerald-600 to-emerald-300', bullet: 'text-emerald-400', pill: 'bg-emerald-600', ring: 'ring-emerald-100' },
    rose: { bg: 'bg-rose-50/40', border: 'border-rose-100', text: 'text-rose-700', borderB: 'border-rose-200', icon: 'text-rose-300', grad: 'from-rose-600 to-rose-300', bullet: 'text-rose-400', pill: 'bg-rose-600', ring: 'ring-rose-100' },
    violet: { bg: 'bg-violet-50/40', border: 'border-violet-100', text: 'text-violet-700', borderB: 'border-violet-200', icon: 'text-violet-300', grad: 'from-violet-600 to-violet-300', bullet: 'text-violet-400', pill: 'bg-violet-600', ring: 'ring-violet-100' }
  }[accentColor] || { bg: 'bg-violet-50/40', border: 'border-violet-100', text: 'text-violet-700', borderB: 'border-violet-200', icon: 'text-violet-300', grad: 'from-violet-600 to-violet-300', bullet: 'text-violet-400', pill: 'bg-violet-600', ring: 'ring-violet-100' };
`;

content = content.replace(
  "// Ignored accentColor since this template uses a fixed white-violet identity",
  themeObj.trim()
);

// 2. Safe replace for each specific element to use backticks
content = content.replace(
  /className="w-\[34%\] bg-violet-50\/40 border-r border-violet-100 p-6 flex flex-col gap-6"/,
  "className={`w-[34%] ${theme.bg} border-r ${theme.border} p-6 flex flex-col gap-6`}"
);

content = content.replace(
  /className="w-28 h-28 rounded-2xl object-cover shadow-sm border-2 border-white ring-1 ring-violet-100"/,
  "className={`w-28 h-28 rounded-2xl object-cover shadow-sm border-2 border-white ring-1 ${theme.ring}`}"
);

// Replace headings
content = content.replace(
  /className="text-\[11px\] font-bold uppercase tracking-wider text-violet-700 border-b border-violet-200 pb-1"/g,
  "className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} border-b ${theme.borderB} pb-1`}"
);

content = content.replace(
  /className="text-\[11px\] font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1\.5 leading-none pb-1"/g,
  "className={`text-[11px] font-bold uppercase tracking-wider ${theme.text} flex items-center gap-1.5 leading-none pb-1`}"
);

// Replace icons
content = content.replace(
  /className="([^"]*) text-violet-300([^"]*)"/g,
  "className={`$1 ${theme.icon}$2`}"
);

content = content.replace(
  /className="([^"]*) text-violet-400([^"]*)"/g,
  "className={`$1 ${theme.bullet}$2`}"
);

// Gradient divider
content = content.replace(
  /className="mt-4 h-\[3px\] w-12 rounded-full bg-gradient-to-r from-violet-600 to-violet-300"/,
  "className={`mt-4 h-[3px] w-12 rounded-full bg-gradient-to-r ${theme.grad}`}"
);

// Link text
content = content.replace(
  /className="([^"]*) text-violet-700([^"]*)"/g,
  "className={`$1 ${theme.text}$2`}"
);

// And finally the pill
const oldPill = `<span
                  key={idx}
                  className="inline-flex items-center leading-none px-2.5 py-1 rounded-full text-[10px] font-medium border bg-violet-50 text-violet-700 border-violet-200"
                >
                  {skill}
                </span>`;

const newPill = `<span
                  key={idx}
                  className={\`inline-flex items-center leading-none px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-sm \${theme.pill}\`}
                >
                  {skill}
                </span>`;

if (content.includes(oldPill)) {
  content = content.replace(oldPill, newPill);
} else {
  // Regex fallback
  const pillRegex = /<span\s+key=\{idx\}\s+className="inline-flex items-center leading-none px-2\.5 py-1 rounded-full text-\[10px\] font-medium border bg-violet-50 text-violet-700 border-violet-200"\s*>[\s\S]*?<\/span>/;
  content = content.replace(pillRegex, newPill);
}

fs.writeFileSync('src/components/preview/templates/ModernTemplate.jsx', content, 'utf8');
