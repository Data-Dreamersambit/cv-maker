import React, { useState, useEffect } from 'react';
import {
  FileText, Sparkles, RefreshCw, Layers, Edit3,
  ArrowLeft, ArrowRight, Camera, FolderOpen, Plus,
  CheckCircle2, Loader2, HardDrive, Eye, Sliders, Printer,
  Download, FileJson
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import ClassicPdf from './pdf/ClassicPdf';
import MinimalPdf from './pdf/MinimalPdf';
import ModernPdf from './pdf/ModernPdf';
import CvHeroStack from './components/CvHeroStack';
import AmbientBackground from './components/AmbientBackground';
import MagneticButton from './components/MagneticButton';
import UploadDropzone from './components/UploadDropzone';
import RawTextDebugView from './components/RawTextDebugView';
import ResumeForm from './components/form/ResumeForm';
import ResumePreview from './components/preview/ResumePreview';
import PhotoManagerModal from './components/photo/PhotoManagerModal';
import ResumeListModal from './components/ResumeListModal';
import SmartParseModal from './components/smartparse/SmartParseModal';
import { extractResumeFields } from './lib/fieldExtractor';
import { createEmptyResume, createSampleResume } from './schema';
import {
  listResumes, saveResume, loadResume, getActiveResumeId,
  setActiveResumeId, deleteResume, exportResumeToJson
} from './lib/storage';
import { useAutoSave } from './hooks/useAutoSave';


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

export default function App() {
  const [extractionResult, setExtractionResult] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
  const [step, setStep] = useState('upload'); // 'upload' | 'extracted_view' | 'form'
  const [activeTab, setActiveTab] = useState('both'); // 'edit' | 'preview' | 'both'
  const [templateId, setTemplateId] = useState('modern');
  const [accentColor, setAccentColor] = useState('indigo');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isResumeListOpen, setIsResumeListOpen] = useState(false);
  const [isSmartParseOpen, setIsSmartParseOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [savedCount, setSavedCount] = useState(0);

  // Debounced auto-save hook
  const saveStatus = useAutoSave(currentResume, 500);

  // Initialize on page load from localStorage
  useEffect(() => {
    const resumes = listResumes();
    setSavedCount(resumes.length);

    const activeId = getActiveResumeId();
    if (activeId) {
      const activeResume = loadResume(activeId);
      if (activeResume) {
        setCurrentResume(activeResume);
        setStep('form');
        return;
      }
    }

    if (resumes.length > 0) {
      setCurrentResume(resumes[0]);
      setActiveResumeId(resumes[0].id);
      setStep('form');
    }
  }, []);

  useEffect(() => {
    setSavedCount(listResumes().length);
  }, [currentResume, isResumeListOpen]);

  const handleExtractionComplete = (result) => {
    setExtractionResult(result);
    const structured = extractResumeFields(result.rawText, result.html, result.images);
    if (result.fileName) {
      structured.title = result.fileName.replace(/\.[^/.]+$/, '');
    }
    setCurrentResume(structured);
    saveResume(structured);
    setStep('extracted_view');
  };

  const handleUseSample = () => {
    const sample = createSampleResume();
    const sampleRawText = `${sample.personal.fullName}\n${sample.personal.title}\n${sample.personal.email} | ${sample.personal.phone} | ${sample.personal.location}\n\nSUMMARY\n${sample.summary}\n\nEXPERIENCE\n${sample.experience.map(e => `${e.role} at ${e.company} (${e.start} – ${e.end})\n${e.bullets.map(b => `• ${b}`).join('\n')}`).join('\n\n')}\n\nEDUCATION\n${sample.education.map(e => `${e.degree}, ${e.institution} (${e.start} – ${e.end})\n${e.details}`).join('\n')}\n\nSKILLS\n${sample.skills.join(', ')}\n\nPROJECTS\n${sample.projects.map(p => `${p.name} | ${p.link}\n• ${p.description}`).join('\n')}\n\nCERTIFICATIONS\n${sample.certifications.map(c => `${c.name} - ${c.issuer} (${c.date})`).join('\n')}`;
    
    const extraction = {
      fileName: 'alex_morgan_sample_resume.pdf',
      fileType: 'pdf',
      fileSize: 45200,
      pageCount: 1,
      rawText: sampleRawText,
      images: []
    };

    setExtractionResult(extraction);
    setCurrentResume(sample);
    saveResume(sample);
    setStep('form');
  };

  const handleStartBlank = () => {
    const blank = createEmptyResume();
    setCurrentResume(blank);
    saveResume(blank);
    setExtractionResult(null);
    setStep('form');
  };

  const handleImportJson = (parsedResume) => {
    setCurrentResume(parsedResume);
    saveResume(parsedResume);
    setExtractionResult(null);
    setStep('form');
  };

  const handleSelectSavedResume = (id) => {
    const loaded = loadResume(id);
    if (loaded) {
      setCurrentResume(loaded);
      setActiveResumeId(id);
      setExtractionResult(null);
      setStep('form');
    }
  };

  const handleNewResume = () => {
    setExtractionResult(null);
    setCurrentResume(null);
    setActiveResumeId(null);
    setStep('upload');
  };

  const handleSavePhoto = (photoDataUrl) => {
    if (currentResume) {
      const updated = { ...currentResume, photo: photoDataUrl };
      setCurrentResume(updated);
      saveResume(updated);
    }
  };

  const handleRemovePhoto = () => {
    if (currentResume) {
      const updated = { ...currentResume, photo: null };
      setCurrentResume(updated);
      saveResume(updated);
    }
  };

  const handlePrint = async () => {
    const candidateName = currentResume?.personal?.fullName || 'Resume';
    const cleanFileName = `${candidateName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume`;

    try {
      const Template = templateId === 'classic' ? ClassicPdf : templateId === 'minimal' ? MinimalPdf : ModernPdf;
      const blob = await pdf(<Template resume={currentResume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cleanFileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      const originalTitle = document.title;
      document.title = cleanFileName;
      window.print();
      setTimeout(() => { document.title = originalTitle; }, 1000);
    }
  };

  const handleExportJson = () => {
    if (currentResume) {
      exportResumeToJson(currentResume);
    }
  };

  const handleSmartParseMerge = (mergedResume) => {
    setCurrentResume(mergedResume);
    saveResume(mergedResume);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col relative z-0">
      {step === 'upload' && <AmbientBackground />}
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/60 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsResumeListOpen(true)}>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-violet-400 text-white shadow-md shadow-violet-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">CV Extractor</span>
              <span className="text-violet-700 font-bold ml-1">+ Builder</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {step === 'form' && currentResume && (
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-400">
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-violet-700" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-slate-600">Saved</span>
                  </>
                )}
              </div>
            )}

            {/* Smart Parse AI Trigger */}
            {step === 'form' && (
              <button
                type="button"
                onClick={() => setIsSmartParseOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/60 text-xs font-semibold shadow-sm transition"
                title="Use AI to parse messy resumes"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Smart Parse AI</span>
              </button>
            )}

            {/* Export JSON backup */}
            {step === 'form' && currentResume && (
              <button
                type="button"
                onClick={handleExportJson}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium transition"
                title="Export resume data as JSON"
              >
                <FileJson className="w-3.5 h-3.5 text-violet-700" />
                <span>JSON</span>
              </button>
            )}

            {/* Saved Resumes Button */}
            <button
              type="button"
              onClick={() => setIsResumeListOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium transition"
            >
              <FolderOpen className="w-3.5 h-3.5 text-violet-700" />
              <span>Resumes</span>
              {savedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-600 text-[10px] font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Export PDF Header Shortcut */}
            {step === 'form' && currentResume && (
              <MagneticButton
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
              </MagneticButton>
            )}

            {/* New Upload Button */}
            {step === 'form' && (
              <MagneticButton
                type="button"
                onClick={handleNewResume}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New</span>
              </MagneticButton>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
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

        {step === 'extracted_view' && (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            <RawTextDebugView
              extractionResult={extractionResult}
              onProceed={() => setStep('form')}
              onReset={handleNewResume}
            />

            {currentResume && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-violet-700" />
                    <h3 className="font-bold text-slate-900 text-base">Extracted Resume Ready</h3>
                  </div>
                  <MagneticButton
                    onClick={() => setStep('form')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Open in Editor & Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </MagneticButton>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-violet-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Candidate</span>
                    <span className="font-semibold text-slate-900 truncate block">{currentResume.personal.fullName || '—'}</span>
                  </div>
                  <div className="bg-violet-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Persistence</span>
                    <span className="font-semibold text-emerald-400">LocalStorage Synced</span>
                  </div>
                  <div className="bg-violet-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Experience</span>
                    <span className="font-semibold text-violet-700">{currentResume.experience.length} jobs detected</span>
                  </div>
                  <div className="bg-violet-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Skills</span>
                    <span className="font-semibold text-violet-700">{currentResume.skills.length} skills</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form, Live Preview & Smart Parse View */}
        {step === 'form' && currentResume && (
          <div className="space-y-4">
            {/* View Toggle Switcher */}
            <div className="lg:hidden flex rounded-xl bg-white border border-slate-200 p-1 mb-2 no-print relative z-20">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'edit' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Form Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'preview' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            {/* Desktop Side-by-Side OR Mobile 3D Flip */}
            <div className="relative w-full lg:[perspective:none] [perspective:2000px]">
              <motion.div
                initial={false}
                animate={isMobile && !prefersReducedMotion ? { rotateY: activeTab === 'preview' ? 180 : 0 } : { rotateY: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                style={{ transformStyle: isMobile ? 'preserve-3d' : 'flat' }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 items-start"
              >
                
                {/* FRONT FACE: Form Editor (Mobile) / Left Column (Desktop) */}
                <div 
                  className={`lg:col-span-5 no-print col-start-1 row-start-1 lg:col-start-auto lg:row-start-auto w-full ${(isMobile && activeTab === 'preview') ? 'pointer-events-none' : ''}`}
                  style={{ 
                    backfaceVisibility: isMobile ? 'hidden' : 'visible',
                    visibility: (isMobile && activeTab === 'preview') ? 'hidden' : 'visible'
                  }}
                >
                  <ResumeForm
                    resume={currentResume}
                    onChange={(updated) => setCurrentResume(updated)}
                    onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
                    hasExtractedImages={extractionResult?.images?.length > 0}
                  />
                </div>

                {/* BACK FACE: Live Preview (Mobile) / Right Column (Desktop) */}
                <div 
                  className={`lg:col-span-7 sticky top-20 col-start-1 row-start-1 lg:col-start-auto lg:row-start-auto w-full ${(isMobile && activeTab === 'edit') ? 'pointer-events-none' : ''}`}
                  style={{ 
                    backfaceVisibility: isMobile ? 'hidden' : 'visible', 
                    transform: (isMobile && !prefersReducedMotion) ? 'rotateY(180deg)' : 'none',
                    visibility: (isMobile && activeTab === 'edit') ? 'hidden' : 'visible'
                  }}
                >
                  <ResumePreview
                    resume={currentResume}
                    onPrint={handlePrint}
                    templateId={templateId}
                    onTemplateChange={setTemplateId}
                    accentColor={accentColor}
                    onAccentColorChange={setAccentColor}
                  />
                </div>
              </motion.div>
            </div>

            <PhotoManagerModal
              isOpen={isPhotoModalOpen}
              onClose={() => setIsPhotoModalOpen(false)}
              currentPhoto={currentResume.photo}
              onSavePhoto={handleSavePhoto}
              onRemovePhoto={handleRemovePhoto}
              pdfDocument={extractionResult?.pdfDocument}
              extractedImages={extractionResult?.images || []}
            />

            <SmartParseModal
              isOpen={isSmartParseOpen}
              onClose={() => setIsSmartParseOpen(false)}
              rawText={extractionResult?.rawText || JSON.stringify(currentResume)}
              currentResume={currentResume}
              onMerge={handleSmartParseMerge}
            />
          </div>
        )}
      </main>

      {/* Resume List Modal */}
      <ResumeListModal
        isOpen={isResumeListOpen}
        onClose={() => setIsResumeListOpen(false)}
        activeResumeId={currentResume?.id}
        onSelectResume={handleSelectSavedResume}
        onNewResume={handleNewResume}
        onImportResume={handleImportJson}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 no-print">
        100% Client-Side In-Browser Processing • Zero Server Database • Deployable to Vercel / Netlify / GitHub Pages
      </footer>
    </div>
  );
}
