const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Replace the form/preview block
const blockRegex = /\{\/\* Form, Live Preview & Smart Parse View \*\/\}[\s\S]*?<PhotoManagerModal/;

const newBlock = `{/* Form, Live Preview & Smart Parse View */}
        {step === 'form' && currentResume && (
          <div className="space-y-4">
            {/* View Toggle Switcher (Visible on small screens, or optionally desktop) */}
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
            <div className="relative w-full [perspective:2000px]">
              <motion.div
                initial={false}
                animate={{ 
                  // Only apply rotation on mobile (activeTab === 'preview'). On desktop, we force 0 so side-by-side isn't rotated.
                  rotateY: (activeTab === 'preview') ? 180 : 0 
                }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                style={{ transformStyle: 'preserve-3d' }}
                // Use flex column on mobile so they stack in the grid, but use CSS grid for desktop side-by-side
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 items-start"
              >
                
                {/* FRONT FACE: Form Editor (Mobile) / Left Column (Desktop) */}
                <div 
                  className={\`lg:col-span-5 no-print col-start-1 row-start-1 lg:col-start-auto lg:row-start-auto w-full \${activeTab === 'preview' ? 'pointer-events-none lg:pointer-events-auto' : ''}\`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    // Hide visibility on mobile when flipped to prevent focus order issues, but keep visible on desktop
                    visibility: (activeTab === 'preview') ? 'hidden' : 'visible'
                  }}
                >
                  <div className="bg-white rounded-2xl lg:bg-transparent">
                    <ResumeForm
                      resume={currentResume}
                      onChange={(updated) => setCurrentResume(updated)}
                      onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
                      hasExtractedImages={extractionResult?.images?.length > 0}
                    />
                  </div>
                </div>

                {/* BACK FACE: Live Preview (Mobile) / Right Column (Desktop) */}
                <div 
                  className={\`lg:col-span-7 sticky top-20 col-start-1 row-start-1 lg:col-start-auto lg:row-start-auto w-full \${activeTab === 'edit' ? 'pointer-events-none lg:pointer-events-auto' : ''}\`}
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    // Rotate the back face 180deg ONLY on mobile, otherwise 0deg for desktop
                    transform: 'rotateY(180deg)',
                    // Same visibility trick for focus order
                    visibility: (activeTab === 'edit') ? 'hidden' : 'visible'
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

content = content.replace(blockRegex, newBlock);
fs.writeFileSync('src/App.jsx', content, 'utf8');
