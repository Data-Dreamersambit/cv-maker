import React, { useState, useRef } from 'react';
import { Upload, FileText, FileCode, AlertCircle, CheckCircle2, Loader2, Sparkles, PlusCircle, FileJson } from 'lucide-react';
import { parsePdfFile } from '../lib/parsePdf';
import { parseDocxFile } from '../lib/parseDocx';
import MagneticButton from './MagneticButton';
import { parseResumeFromJson } from '../lib/storage';

export default function UploadDropzone({ onExtractionComplete, onStartBlank, onUseSample, onImportJson }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'json'].includes(fileType)) {
      setError('Please upload a valid PDF (.pdf), Word document (.docx), or Resume Backup (.json).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (fileType === 'json') {
        const text = await file.text();
        const parsed = parseResumeFromJson(text);
        if (onImportJson) {
          onImportJson(parsed);
          return;
        }
      }

      let result;
      if (fileType === 'pdf') {
        result = await parsePdfFile(file);
        result.fileType = 'pdf';
      } else if (fileType === 'docx') {
        result = await parseDocxFile(file);
        result.fileType = 'docx';
      }

      result.fileName = file.name;
      result.fileSize = file.size;

      if (!result.rawText || result.rawText.trim().length === 0) {
        throw new Error('No text content could be extracted from this document. If this is a scanned PDF image, please use a text-based resume or start with our template.');
      }

      onExtractionComplete(result);
    } catch (err) {
      console.error('File parsing error:', err);
      setError(err.message || 'Failed to parse file. Please try another resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Drag & Drop Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
            : 'border-slate-200 hover:border-violet-400/80 bg-white/60 hover:bg-slate-50/60 shadow-xl'
        } ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.json"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 ring-4 ring-violet-500/20">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {isLoading ? 'Extracting Resume Text...' : 'Upload your Resume'}
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Drag & drop your <span className="text-violet-400 font-medium">PDF</span>, <span className="text-purple-400 font-medium">DOCX</span>, or <span className="text-emerald-400 font-medium">JSON Backup</span> here, or click to browse.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-violet-400" /> PDF
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-purple-400" /> Word (.docx)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileJson className="w-3.5 h-3.5 text-emerald-400" /> JSON Backup
            </span>
            <span>•</span>
            <span>100% Client-Side / Offline</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-200">Extraction Notice</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Quick Start Alternatives */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MagneticButton
          type="button"
          onClick={onUseSample}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors hover:border-slate-400 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Load Sample Resume</span>
        </MagneticButton>
        <MagneticButton
          type="button"
          onClick={onStartBlank}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors hover:border-slate-400 shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-violet-400" />
          <span>Start Blank Template</span>
        </MagneticButton>
        <MagneticButton
          type="button"
          onClick={() => jsonInputRef.current?.click()}
          className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors hover:border-slate-400 shadow-sm"
        >
          <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <FileJson className="w-4 h-4 text-emerald-400" />
          <span>Import JSON Backup</span>
        </MagneticButton>
      </div>
    </div>
  );
}
