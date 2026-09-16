const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  if (file.includes('CvHeroStack.jsx')) return; // skip the one we just made

  let content = fs.readFileSync(file, 'utf8');

  // Simple global replaces for accents and borders
  content = content.replace(/indigo-/g, 'violet-');
  content = content.replace(/border-slate-[789]00/g, 'border-slate-200');
  
  // Shell and background replacements
  content = content.replace(/bg-violet-50 text-slate-800/g, 'bg-white text-slate-900');
  content = content.replace(/bg-slate-900/g, 'bg-white');
  content = content.replace(/bg-slate-950/g, 'bg-slate-50');
  content = content.replace(/bg-slate-850/g, 'bg-slate-50');
  
  // Text colors for non-highlighted areas
  content = content.replace(/text-slate-300/g, 'text-slate-600');
  content = content.replace(/text-slate-100/g, 'text-slate-900');
  
  // Specific App.jsx fixes from the prompt
  if (file.endsWith('App.jsx')) {
    content = content.replace(/<span className="font-bold text-lg text-white/g, '<span className="font-bold text-lg text-slate-900');
    content = content.replace(/<h3 className="font-bold text-white text-base">Extracted Resume Ready<\/h3>/g, '<h3 className="font-bold text-slate-900 text-base">Extracted Resume Ready</h3>');
    content = content.replace(/<span className="font-semibold text-white truncate block">\{currentResume.personal.fullName/g, '<span className="font-semibold text-slate-900 truncate block">{currentResume.personal.fullName');
    content = content.replace(/text-slate-400 hover:text-white/g, 'text-slate-500 hover:text-slate-900');
    // The logo box gradient
    content = content.replace(/from-violet-600 to-violet-600/g, 'from-violet-600 to-violet-400');
  }

  // The smart regex for text-white:
  // If we see text-white, we only keep it if the class string contains 'bg-violet' or 'bg-emerald' or 'bg-gradient' or 'bg-red' etc.
  // Otherwise it should be text-slate-900.
  
  // Let's do it by finding className="..."
  const classRegex = /className="([^"]+)"/g;
  content = content.replace(classRegex, (match, classStr) => {
    if (classStr.includes('text-white')) {
      const hasDarkBg = classStr.includes('bg-violet-') || classStr.includes('bg-emerald-') || classStr.includes('bg-red-') || classStr.includes('bg-gradient-') || classStr.includes('bg-black');
      if (!hasDarkBg) {
        classStr = classStr.replace(/\btext-white\b/g, 'text-slate-900');
      }
    }
    // also fix text-slate-400 hover:text-white if any remain
    if (classStr.includes('hover:text-white')) {
      const hasDarkBg = classStr.includes('bg-violet-') || classStr.includes('bg-emerald-') || classStr.includes('bg-gradient-');
      if (!hasDarkBg) {
        classStr = classStr.replace(/\bhover:text-white\b/g, 'hover:text-slate-900');
      }
    }
    return `className="${classStr}"`;
  });

  fs.writeFileSync(file, content, 'utf8');
});
console.log('done');
