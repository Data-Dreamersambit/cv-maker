import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Add import
import_statement = "import CvHeroStack from './components/CvHeroStack';\nimport UploadDropzone"
content = content.replace("import UploadDropzone", import_statement)

old_upload = """        {step === 'upload' && (
          <div className="space-y-6 my-auto max-w-3xl mx-auto w-full">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Turn your resume into an editable, modern CV
              </h1>
              <p className="text-slate-400 text-base">
                Upload your PDF or DOCX file to extract text, structure, and photos client-side with zero backend dependencies.
              </p>
            </div>

            <UploadDropzone
              onExtractionComplete={handleExtractionComplete}
              onUseSample={handleUseSample}
              onStartBlank={handleStartBlank}
              onImportJson={handleImportJson}
            />
          </div>
        )}"""

new_upload = """        {step === 'upload' && (
          <div className="space-y-12 my-auto max-w-5xl mx-auto w-full">
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
          </div>
        )}"""

content = content.replace(old_upload, new_upload)

with open('src/App.jsx', 'w') as f:
    f.write(content)
