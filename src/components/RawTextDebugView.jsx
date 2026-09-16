import React, { useState } from 'react';
import { FileText, Code2, Image as ImageIcon, ArrowLeft, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';

export default function RawTextDebugView({ extractionResult, onProceed, onReset }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'html' | 'images'
  const [copied, setCopied] = useState(false);

  if (!extractionResult) return null;

  const { fileName, fileType, fileSize, rawText, html, images = [], pageCount } = extractionResult;
  const lineCount = rawText ? rawText.split('\n').length : 0;
  const charCount = rawText ? rawText.length : 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeTab === 'html' ? (html || '') : rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header card with metadata */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-500/20 text-violet-400 rounded-xl border border-violet-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 truncate max-w-md">{fileName}</h2>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {fileType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {(fileSize / 1024).toFixed(1)} KB • {lineCount} lines • {charCount} characters
                {pageCount ? ` • ${pageCount} page(s)` : ''}
                {images.length > 0 ? ` • ${images.length} embedded image(s)` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change File</span>
            </button>
            {onProceed && (
              <button
                onClick={onProceed}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/25 transition"
              >
                <span>Proceed to Fields</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'text'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-50 text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw Text View</span>
            </button>

            {html && (
              <button
                onClick={() => setActiveTab('html')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'html'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>DOCX HTML Structure</span>
              </button>
            )}

            {images.length > 0 && (
              <button
                onClick={() => setActiveTab('images')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'images'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Extracted Images ({images.length})</span>
              </button>
            )}
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Extracted Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content display */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xl">
        {activeTab === 'text' && (
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-600 overflow-x-auto max-h-[550px] overflow-y-auto leading-relaxed divide-y divide-slate-800/40">
            {rawText.split('\n').map((line, idx) => (
              <div key={idx} className="flex py-0.5 hover:bg-white/60 group">
                <span className="w-10 text-right pr-4 text-slate-600 select-none group-hover:text-slate-400 flex-shrink-0 text-xs">
                  {idx + 1}
                </span>
                <span className="whitespace-pre-wrap break-words flex-1">
                  {line || <span className="opacity-20 text-xs">·</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'html' && (
          <div className="p-6 max-h-[550px] overflow-y-auto">
            <div className="font-mono text-xs text-emerald-400 bg-white p-4 rounded-xl border border-slate-200 mb-4 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{html}</pre>
            </div>
            <div className="prose prose-invert max-w-none text-slate-600 text-sm border-t border-slate-200 pt-4" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}

        {activeTab === 'images' && (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[550px] overflow-y-auto">
            {images.map((img, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-2">
                <img src={img.dataUrl} alt={`Extracted ${idx + 1}`} className="w-full h-40 object-contain rounded-lg bg-black/40" />
                <span className="text-xs text-slate-400 font-mono">{img.contentType}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
