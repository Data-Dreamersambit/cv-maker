const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const hookInsert = `  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
`;

if (!content.includes('const [isMobile, setIsMobile] = useState')) {
   content = content.replace('const [isSmartParseOpen, setIsSmartParseOpen] = useState(false);', 'const [isSmartParseOpen, setIsSmartParseOpen] = useState(false);\n' + hookInsert);
}

const newBlock = `{/* Form, Live Preview & Smart Parse View */}
        {step === 'form' && currentResume && (
          <div className="space-y-4">
            {/* View Toggle Switcher */}
            <div className="lg:hidden flex rounded-xl bg-white border border-slate-200 p-1 mb-2 no-print relative z-20">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={\`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition \${
                  activeTab === 'edit' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }\`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Form Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={\`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition \${
                  activeTab === 'preview' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }\`}
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
                  className={\`lg:col-span-5 no-print col-start-1 row-start-1 lg:col-start-auto lg:row-start-auto w-full \${(isMobile && activeTab === 'preview') ? 'pointer-events-none' : ''}\`}
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
                  className={\`lg:col-span-7 sticky top-20 col-start-1 row-start-1 lg:col-start-auto lg:row-start-auto w-full \${(isMobile && activeTab === 'edit') ? 'pointer-events-none' : ''}\`}
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

            <PhotoManagerModal`;

const blockRegex = /\{\/\* Form, Live Preview & Smart Parse View \*\/\}[\s\S]*?<PhotoManagerModal/;
content = content.replace(blockRegex, newBlock);
fs.writeFileSync('src/App.jsx', content, 'utf8');
