const fs = require('fs');
let content = fs.readFileSync('src/components/UploadDropzone.jsx', 'utf8');

if (!content.includes('import MagneticButton')) {
    content = content.replace("import { parseResumeFromJson", "import MagneticButton from './MagneticButton';\nimport { parseResumeFromJson");
}

// Replace hover states
content = content.replace(/hover:bg-slate-800/g, 'hover:bg-slate-100');
content = content.replace(/text-slate-200/g, 'text-slate-700');
content = content.replace(/border-slate-200\/80/g, 'border-slate-300');
content = content.replace(/hover:border-slate-600/g, 'hover:border-slate-400');

// Replace button with MagneticButton for the three alternatives
content = content.replace(
  /<button([\s\S]*?)onClick={onUseSample}([\s\S]*?)>([\s\S]*?)<\/button>/,
  '<MagneticButton$1onClick={onUseSample}$2>$3</MagneticButton>'
);

content = content.replace(
  /<button([\s\S]*?)onClick={onStartBlank}([\s\S]*?)>([\s\S]*?)<\/button>/,
  '<MagneticButton$1onClick={onStartBlank}$2>$3</MagneticButton>'
);

content = content.replace(
  /<button([\s\S]*?)onClick={\(\) => jsonInputRef.current\?\.click\(\)}([\s\S]*?)>([\s\S]*?)<\/button>/,
  '<MagneticButton$1onClick={() => jsonInputRef.current?.click()}$2>$3</MagneticButton>'
);

fs.writeFileSync('src/components/UploadDropzone.jsx', content, 'utf8');
