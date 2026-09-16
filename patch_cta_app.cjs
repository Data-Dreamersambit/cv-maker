const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

if (!content.includes('import MagneticButton')) {
    content = content.replace("import UploadDropzone", "import MagneticButton from './components/MagneticButton';\nimport UploadDropzone");
}

// 1. Header Export PDF button
content = content.replace(
  /<button([\s\S]*?)onClick={handlePrint}([\s\S]*?)>([\s\S]*?)<\/button>/,
  '<MagneticButton$1onClick={handlePrint}$2>$3</MagneticButton>'
);

// 2. Header New button
content = content.replace(
  /<button([\s\S]*?)onClick={handleNewResume}([\s\S]*?)>([\s\S]*?)<Plus([\s\S]*?)<\/button>/,
  '<MagneticButton$1onClick={handleNewResume}$2>$3<Plus$4</MagneticButton>'
);

// 3. Open in Editor button
content = content.replace(
  /<button([\s\S]*?)onClick={\(\) => setStep\('form'\)}([\s\S]*?)>([\s\S]*?)<Edit3([\s\S]*?)<\/button>/,
  '<MagneticButton$1onClick={() => setStep(\'form\')}$2>$3<Edit3$4</MagneticButton>'
);

fs.writeFileSync('src/App.jsx', content, 'utf8');
