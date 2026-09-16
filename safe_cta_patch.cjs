const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

if (!app.includes("import MagneticButton")) {
    app = app.replace("import UploadDropzone", "import MagneticButton from './components/MagneticButton';\nimport UploadDropzone");
}

app = app.replace(
  '<button\n                type="button"\n                onClick={handlePrint}',
  '<MagneticButton\n                type="button"\n                onClick={handlePrint}'
);
app = app.replace(
  '<span className="hidden sm:inline">Export PDF</span>\n              </button>',
  '<span className="hidden sm:inline">Export PDF</span>\n              </MagneticButton>'
);

app = app.replace(
  '<button\n                type="button"\n                onClick={handleNewResume}',
  '<MagneticButton\n                type="button"\n                onClick={handleNewResume}'
);
app = app.replace(
  '<span className="hidden sm:inline">New</span>\n              </button>',
  '<span className="hidden sm:inline">New</span>\n              </MagneticButton>'
);

app = app.replace(
  '<button\n                    onClick={() => setStep(\'form\')}',
  '<MagneticButton\n                    onClick={() => setStep(\'form\')}'
);
app = app.replace(
  '<span>Open in Editor & Preview</span>\n                    <ArrowRight className="w-3.5 h-3.5" />\n                  </button>',
  '<span>Open in Editor & Preview</span>\n                    <ArrowRight className="w-3.5 h-3.5" />\n                  </MagneticButton>'
);

fs.writeFileSync('src/App.jsx', app, 'utf8');


let dz = fs.readFileSync('src/components/UploadDropzone.jsx', 'utf8');

if (!dz.includes("import MagneticButton")) {
    dz = dz.replace("import { parseResumeFromJson", "import MagneticButton from './MagneticButton';\nimport { parseResumeFromJson");
}

dz = dz.replace(/hover:bg-slate-800/g, 'hover:bg-slate-100');
dz = dz.replace(/text-slate-200/g, 'text-slate-700');
dz = dz.replace(/border-slate-200\/80/g, 'border-slate-300');
dz = dz.replace(/hover:border-slate-600/g, 'hover:border-slate-400');

dz = dz.replace('<button\n          type="button"\n          onClick={onUseSample}', '<MagneticButton\n          type="button"\n          onClick={onUseSample}');
dz = dz.replace('<span>Load Sample Resume</span>\n        </button>', '<span>Load Sample Resume</span>\n        </MagneticButton>');

dz = dz.replace('<button\n          type="button"\n          onClick={onStartBlank}', '<MagneticButton\n          type="button"\n          onClick={onStartBlank}');
dz = dz.replace('<span>Start Blank Template</span>\n        </button>', '<span>Start Blank Template</span>\n        </MagneticButton>');

dz = dz.replace('<button\n          type="button"\n          onClick={() => jsonInputRef.current?.click()}', '<MagneticButton\n          type="button"\n          onClick={() => jsonInputRef.current?.click()}');
dz = dz.replace('<span>Import JSON Backup</span>\n        </button>', '<span>Import JSON Backup</span>\n        </MagneticButton>');

fs.writeFileSync('src/components/UploadDropzone.jsx', dz, 'utf8');

