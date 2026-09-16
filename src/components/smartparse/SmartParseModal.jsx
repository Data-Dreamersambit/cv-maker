import React, { useState, useEffect } from 'react';
import {
  Sparkles, Key, Check, AlertCircle, Loader2, X,
  ArrowRight, ShieldCheck, CheckSquare, Square, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { getSavedAiKeys, saveAiKeys, runSmartParse } from '../../lib/smartParse';

export default function SmartParseModal({
  isOpen,
  onClose,
  rawText,
  currentResume,
  onMerge
}) {
  const [provider, setProvider] = useState('openai'); // 'openai' | 'anthropic' | 'gemini'
  const [keys, setKeys] = useState({ openai: '', anthropic: '', gemini: '' });
  const [model, setModel] = useState('gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Result state
  const [aiResult, setAiResult] = useState(null);
  const [selectedSections, setSelectedSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true
  });

  useEffect(() => {
    const saved = getSavedAiKeys();
    setKeys(saved);
    if (saved.provider) setProvider(saved.provider);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentKey = keys[provider] || '';

  const handleKeyChange = (val) => {
    const updated = { ...keys, [provider]: val, provider };
    setKeys(updated);
    saveAiKeys(updated);
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    if (newProvider === 'openai') setModel('gpt-4o-mini');
    else if (newProvider === 'anthropic') setModel('claude-3-5-sonnet-20241022');
    else if (newProvider === 'gemini') setModel('gemini-1.5-flash');
    saveAiKeys({ ...keys, provider: newProvider });
  };

  const handleRunParse = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await runSmartParse({
        rawText,
        provider,
        apiKey: currentKey,
        model
      });
      setAiResult(result);
    } catch (err) {
      console.error('Smart parse failed:', err);
      setError(err.message || 'AI extraction failed. Please check your API key and connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sec) => {
    setSelectedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleApplyMerge = () => {
    if (!aiResult) return;

    const merged = { ...currentResume };
    if (selectedSections.personal) {
      merged.personal = {
        ...currentResume.personal,
        ...aiResult.personal,
        links: aiResult.personal?.links?.length > 0 ? aiResult.personal.links : currentResume.personal.links
      };
    }
    if (selectedSections.summary) {
      merged.summary = aiResult.summary || currentResume.summary;
    }
    if (selectedSections.experience && aiResult.experience?.length > 0) {
      merged.experience = aiResult.experience;
    }
    if (selectedSections.education && aiResult.education?.length > 0) {
      merged.education = aiResult.education;
    }
    if (selectedSections.skills && aiResult.skills?.length > 0) {
      merged.skills = aiResult.skills;
    }
    if (selectedSections.projects && aiResult.projects?.length > 0) {
      merged.projects = aiResult.projects;
    }
    if (selectedSections.certifications && aiResult.certifications?.length > 0) {
      merged.certifications = aiResult.certifications;
    }

    onMerge(merged);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-600 text-white shadow-md shadow-violet-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Smart Parse (AI Assisted)</h3>
              <p className="text-xs text-slate-400">Upgrade messy or multi-column resumes with high-precision LLM extraction</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!aiResult ? (
            /* Setup & Config View */
            <div className="space-y-5">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  1. Select AI Provider
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'openai', label: 'OpenAI', desc: 'GPT-4o / mini' },
                    { id: 'anthropic', label: 'Anthropic', desc: 'Claude 3.5' },
                    { id: 'gemini', label: 'Google Gemini', desc: 'Gemini 1.5 Flash' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProviderChange(p.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        provider === p.id
                          ? 'bg-violet-600/20 border-violet-500 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-bold text-xs block">{p.label}</span>
                      <span className="text-[11px] text-slate-500">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    2. Enter Your {provider.toUpperCase()} API Key
                  </label>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Saved locally in browser only</span>
                  </span>
                </div>

                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={currentKey}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    placeholder={
                      provider === 'openai' ? 'sk-...' :
                      provider === 'anthropic' ? 'sk-ant-...' : 'AIzaSy...'
                    }
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-10 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Model Choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  3. Model Name
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. gpt-4o-mini"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Error Box */}
              {error && (
                <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 flex items-start gap-3 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-200">Parse Request Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Review & Selective Merge Screen */
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">AI Extraction Complete! Select fields to merge:</span>
                </div>
                <button
                  onClick={() => setAiResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
                >
                  Run Again
                </button>
              </div>

              {/* Section checklist */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'personal',
                    title: 'Personal Info & Links',
                    aiValue: `${aiResult.personal?.fullName} • ${aiResult.personal?.title || 'No title'} • ${aiResult.personal?.email || 'No email'}`
                  },
                  {
                    id: 'summary',
                    title: 'Professional Summary',
                    aiValue: aiResult.summary ? `${aiResult.summary.slice(0, 80)}...` : 'None'
                  },
                  {
                    id: 'experience',
                    title: 'Work Experience',
                    aiValue: `${aiResult.experience?.length || 0} position(s) extracted with bullets`
                  },
                  {
                    id: 'education',
                    title: 'Education',
                    aiValue: `${aiResult.education?.length || 0} degree(s) & institutions`
                  },
                  {
                    id: 'skills',
                    title: 'Skills',
                    aiValue: `${aiResult.skills?.length || 0} skill tags: ${aiResult.skills?.slice(0, 6).join(', ')}...`
                  },
                  {
                    id: 'projects',
                    title: 'Projects',
                    aiValue: `${aiResult.projects?.length || 0} project(s)`
                  },
                  {
                    id: 'certifications',
                    title: 'Certifications',
                    aiValue: `${aiResult.certifications?.length || 0} certificate(s)`
                  }
                ].map((sec) => (
                  <div
                    key={sec.id}
                    onClick={() => toggleSection(sec.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      selectedSections[sec.id]
                        ? 'bg-violet-950/30 border-violet-500/60'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-violet-400">
                        {selectedSections[sec.id] ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-slate-900">{sec.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{sec.aiValue}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                      {selectedSections[sec.id] ? 'Accept AI' : 'Keep Current'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-medium transition"
          >
            Cancel
          </button>

          {!aiResult ? (
            <button
              type="button"
              disabled={loading || !currentKey}
              onClick={handleRunParse}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing with {provider.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Smart Parse</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApplyMerge}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Selected Merges</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
