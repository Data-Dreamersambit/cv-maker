const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const importStatement = `import CvHeroStack from './components/CvHeroStack';\n`;
if (!content.includes('CvHeroStack')) {
    content = content.replace(`import UploadDropzone`, `${importStatement}import UploadDropzone`);
}

const landingSection = `
        {step === 'upload' && (
          <div className="space-y-12 my-auto max-w-6xl mx-auto w-full pb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left space-y-4 order-2 md:order-1">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Turn your resume into an editable, modern CV
                </h1>
                <p className="text-slate-600 text-lg">
                  Upload your PDF or DOCX file to extract text, structure, and photos client-side with zero backend dependencies.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <CvHeroStack />
              </div>
            </div>

            <div className="max-w-3xl mx-auto w-full">
              <UploadDropzone
                onExtractionComplete={handleExtractionComplete}
                onUseSample={handleUseSample}
                onStartBlank={handleStartBlank}
                onImportJson={handleImportJson}
              />
            </div>

            {/* Feature Sections for Step 2 */}
            <div className="grid md:grid-cols-3 gap-6 pt-16 border-t border-slate-200">
              <FeatureCard 
                title="100% Client-Side" 
                desc="Your data never leaves your browser. Zero backend dependencies mean your private information stays private."
                icon="🔒"
              />
              <FeatureCard 
                title="Smart PDF Extraction" 
                desc="Instantly pull work experience, skills, and even your profile photo from existing PDFs or DOCX files."
                icon="📄"
              />
              <FeatureCard 
                title="Live Vector Export" 
                desc="Export beautiful, selectable, ATS-friendly vector PDFs that look exactly like the real-time preview."
                icon="⚡"
              />
            </div>
          </div>
        )}
`;

content = content.replace(/\{step === 'upload' && \([\s\S]*?UploadDropzone[\s\S]*?\/>\s*<\/div>\s*\)\}/, landingSection.trim());

// Add FeatureCard component if not exists
if (!content.includes('function FeatureCard')) {
    const featureCardCode = `
import { motion, useReducedMotion } from 'framer-motion';

function FeatureCard({ title, desc, icon }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div 
      initial={prefersReducedMotion ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/50 flex flex-col gap-3"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <div className="w-12 h-12 bg-violet-50 text-2xl flex items-center justify-center rounded-xl border border-violet-100 mb-2">
        {icon}
      </div>
      <h3 className="text-slate-900 font-bold text-lg">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
`;
    // Insert after imports
    content = content.replace("export default function App", featureCardCode + "\nexport default function App");
}

fs.writeFileSync('src/App.jsx', content, 'utf8');
