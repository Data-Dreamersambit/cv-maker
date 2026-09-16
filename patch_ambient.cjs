const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const importStatement = `import AmbientBackground from './components/AmbientBackground';\n`;
if (!content.includes('AmbientBackground')) {
    content = content.replace("import UploadDropzone", importStatement + "import UploadDropzone");
}

const backgroundUsage = `    <div className="min-h-screen bg-white text-slate-900 flex flex-col relative z-0">
      {step === 'upload' && <AmbientBackground />}
`;
content = content.replace(/<div className="min-h-screen bg-white text-slate-900 flex flex-col[^>]*>/, backgroundUsage.trim());

fs.writeFileSync('src/App.jsx', content, 'utf8');
