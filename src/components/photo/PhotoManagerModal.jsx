import React, { useState, useRef } from 'react';
import {
  Camera, Upload, Crop, Trash2, X, Check,
  Image as ImageIcon, Sparkles, UserCheck
} from 'lucide-react';
import PdfPageCropTool from './PdfPageCropTool';

export default function PhotoManagerModal({
  isOpen,
  onClose,
  currentPhoto,
  onSavePhoto,
  onRemovePhoto,
  pdfDocument,
  extractedImages = []
}) {
  const [activeTab, setActiveTab] = useState(
    extractedImages.length > 0 ? 'extracted' : pdfDocument ? 'pdf_crop' : 'upload'
  );
  const [previewUrl, setPreviewUrl] = useState(currentPhoto || null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCurrentPreview = () => {
    onSavePhoto(previewUrl);
    onClose();
  };

  const handleSelectExtracted = (imgUrl) => {
    setPreviewUrl(imgUrl);
    onSavePhoto(imgUrl);
    onClose();
  };

  const handlePdfCropComplete = (croppedDataUrl) => {
    setPreviewUrl(croppedDataUrl);
    onSavePhoto(croppedDataUrl);
    onClose();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onRemovePhoto();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Profile Photo Manager</h3>
              <p className="text-xs text-slate-400">Add, crop, or extract a headshot photo for your resume</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-6 gap-2 pt-2">
          {extractedImages.length > 0 && (
            <button
              onClick={() => setActiveTab('extracted')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'extracted'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extracted Images ({extractedImages.length})</span>
            </button>
          )}

          {pdfDocument && (
            <button
              onClick={() => setActiveTab('pdf_crop')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'pdf_crop'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Crop from PDF</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image File</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'extracted' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Found {extractedImages.length} image(s) inside your uploaded document. Click to use one:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto">
                {extractedImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectExtracted(img.dataUrl)}
                    className="group relative border-2 border-slate-200 hover:border-violet-500 rounded-xl p-2 bg-slate-50 cursor-pointer transition flex flex-col items-center gap-2 hover:scale-[1.02]"
                  >
                    <img
                      src={img.dataUrl}
                      alt={`Extracted ${idx + 1}`}
                      className="w-full h-32 object-contain rounded-lg bg-black/40"
                    />
                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-violet-300 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>Use this image</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pdf_crop' && (
            <PdfPageCropTool
              pdfDocument={pdfDocument}
              onCropComplete={handlePdfCropComplete}
              onCancel={onClose}
            />
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/60 hover:bg-white/60 transition"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-violet-500/20 text-violet-400 rounded-full">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">Click to choose a photo file</h4>
                  <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP</p>
                </div>
              </div>

              {previewUrl && (
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-violet-500 shadow-md"
                  />
                  <div className="flex-1">
                    <h5 className="text-xs font-semibold text-slate-900">Selected Photo Preview</h5>
                    <p className="text-[11px] text-slate-400">Ready to attach to your resume</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCurrentPreview}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Photo</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between">
          <div>
            {currentPhoto && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Current Photo</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
