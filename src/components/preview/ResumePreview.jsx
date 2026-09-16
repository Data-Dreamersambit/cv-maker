import React, { useState, useRef } from 'react';
import {
  Layout, Palette, ZoomIn, ZoomOut, Maximize2,
  Printer, Download, Sparkles
} from 'lucide-react';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const TEMPLATES = [
  { id: 'modern', name: 'Modern (Two-Column)', component: ModernTemplate },
  { id: 'classic', name: 'Classic (ATS Single-Col)', component: ClassicTemplate },
  { id: 'minimal', name: 'Minimal Executive', component: MinimalTemplate }
];

const ACCENT_COLORS = [
  { id: 'indigo', name: 'Indigo', bg: 'bg-violet-600' },
  { id: 'blue', name: 'Royal Blue', bg: 'bg-blue-600' },
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-600' },
  { id: 'slate', name: 'Slate Gray', bg: 'bg-slate-800' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-600' },
  { id: 'violet', name: 'Violet', bg: 'bg-violet-600' }
];


import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

function TemplateCoverflow({ templates, activeId, onChange, resume, accentColor, zoomLevel, baseScale = 1 }) {
  const prefersReducedMotion = useReducedMotion();
  const activeIndex = templates.findIndex(t => t.id === activeId);
  const activeScale = baseScale * (zoomLevel / 100);
  const [contentHeight, setContentHeight] = useState(1123); // Default A4 px height

  useEffect(() => {
    // Monitor the active template's actual height to adjust the wrapper so the scrollbar perfectly reflects scaled size
    const el = document.getElementById('resume-printable-area');
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeId]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        const newIndex = Math.max(0, activeIndex - 1);
        onChange(templates[newIndex].id);
      } else if (e.key === 'ArrowRight') {
        const newIndex = Math.min(templates.length - 1, activeIndex + 1);
        onChange(templates[newIndex].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, templates, onChange]);

  return (
    <div className="grid w-full [perspective:1200px]" style={{ placeItems: 'start center', transformStyle: 'preserve-3d', height: contentHeight * activeScale }}>
      {templates.map((t, index) => {
        const isActive = index === activeIndex;
        const offset = index - activeIndex; 
        
        let x = offset * 220; 
        let z = isActive ? 0 : -300;
        let rotateY = isActive ? 0 : offset > 0 ? -35 : 35;
        let opacity = isActive ? 1 : 0.4;
        let scale = isActive ? (baseScale * (zoomLevel / 100)) : 0.6 * (baseScale * (zoomLevel / 100));

        if (prefersReducedMotion) {
           if (!isActive) return null;
           x = 0; z = 0; rotateY = 0; opacity = 1; scale = (baseScale * (zoomLevel / 100));
        }

        const TemplateComponent = t.component;

        return (
          <motion.div
            key={t.id}
            onClick={() => !isActive && onChange(t.id)}
            drag={isActive ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset: dragOffset, velocity }) => {
              const swipe = dragOffset.x;
              if (swipe < -50 || velocity.x < -200) {
                 if (activeIndex < templates.length - 1) onChange(templates[activeIndex + 1].id);
              } else if (swipe > 50 || velocity.x > 200) {
                 if (activeIndex > 0) onChange(templates[activeIndex - 1].id);
              }
            }}
            initial={false}
            animate={{ x, z, rotateY, opacity, scale }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="col-start-1 row-start-1 origin-top cursor-grab active:cursor-grabbing pb-8" style={{ width: '210mm', transformOrigin: 'top center', zIndex: isActive ? 10 : 0 }}
            
          >
            <div 
              className={`bg-white shadow-2xl rounded-sm overflow-hidden ${!isActive ? 'pointer-events-none' : ''}`}
              id={isActive ? "resume-printable-area" : undefined}
              style={{ minHeight: '297mm' }}
            >
              <TemplateComponent resume={resume} accentColor={accentColor} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ResumePreview({
  resume,
  onPrint,
  templateId = 'modern',
  onTemplateChange,
  accentColor = 'indigo',
  onAccentColorChange
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [baseScale, setBaseScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // A4 pixel dimensions at 96dpi
        const a4Width = 794; 
        const a4Height = 1123;
        // Calculate fit scale (with a small margin so it looks good)
        const scaleX = width / a4Width;
        const scaleY = height / a4Height;
        const fitScale = Math.min(scaleX, scaleY);
        setBaseScale(Math.min(fitScale, 1.5)); 
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);


  const currentTemplateObj = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const TemplateComponent = currentTemplateObj.component;

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.max(70, Math.min(130, prev + delta)));
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-lg flex flex-wrap items-center justify-between gap-3">
        {/* Template selector */}
        <div className="flex items-center gap-2">
          
          <div className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-default"><Layout className="w-3.5 h-3.5 text-violet-500" /> Swipe / Arrow Keys to change template</div>
        </div>

        {/* Color picker */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onAccentColorChange && onAccentColorChange(c.id)}
              className={`w-5 h-5 rounded-full ${c.bg} transition ${
                accentColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Zoom & Print shortcuts */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-2 py-1 gap-1 text-xs">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              className="text-slate-500 hover:text-slate-900 p-0.5"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-600 w-9 text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => handleZoom(10)}
              className="text-slate-500 hover:text-slate-900 p-0.5"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/25 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Preview Paper Container */}
      <div ref={containerRef} className="flex-1 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-6 overflow-x-hidden overflow-y-auto flex justify-center shadow-inner min-h-[600px] max-h-[85vh]">
        <TemplateCoverflow 
          templates={TEMPLATES}
          activeId={templateId}
          onChange={onTemplateChange}
          resume={resume}
          accentColor={accentColor}
          zoomLevel={zoomLevel}
          baseScale={baseScale}
        />
      </div>
    </div>
  );
}
