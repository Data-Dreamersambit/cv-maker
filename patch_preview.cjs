const fs = require('fs');
let content = fs.readFileSync('src/components/preview/ResumePreview.jsx', 'utf8');

// Insert the TemplateCoverflow component above ResumePreview
const coverflowCode = `
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

function TemplateCoverflow({ templates, activeId, onChange, resume, accentColor, zoomLevel }) {
  const prefersReducedMotion = useReducedMotion();
  const activeIndex = templates.findIndex(t => t.id === activeId);

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
    <div className="grid w-full [perspective:1200px]" style={{ placeItems: 'start center', transformStyle: 'preserve-3d' }}>
      {templates.map((t, index) => {
        const isActive = index === activeIndex;
        const offset = index - activeIndex; 
        
        let x = offset * 220; 
        let z = isActive ? 0 : -300;
        let rotateY = isActive ? 0 : offset > 0 ? -35 : 35;
        let opacity = isActive ? 1 : 0.4;
        let scale = isActive ? (zoomLevel / 100) : 0.6 * (zoomLevel / 100);

        if (prefersReducedMotion) {
           if (!isActive) return null;
           x = 0; z = 0; rotateY = 0; opacity = 1; scale = (zoomLevel / 100);
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
            className="col-start-1 row-start-1 origin-top cursor-grab active:cursor-grabbing pb-8"
            style={{ width: '210mm', zIndex: isActive ? 10 : 0 }}
          >
            <div 
              className={\`bg-white shadow-2xl rounded-sm overflow-hidden \${!isActive ? 'pointer-events-none' : ''}\`}
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

`;

if (!content.includes('TemplateCoverflow')) {
  // Add framer-motion import and Coverflow component
  content = content.replace("export default function ResumePreview", coverflowCode + "export default function ResumePreview");
}

// Remove the old select element from the Top Toolbar
const selectRegex = /<select[\s\S]*?<\/select>/;
content = content.replace(selectRegex, `<div className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-default"><Layout className="w-3.5 h-3.5 text-violet-500" /> Swipe / Arrow Keys to change template</div>`);
content = content.replace(/<Layout className="w-4 h-4 text-violet-400" \/>/, ''); // remove old icon since we integrated it

// Replace Live Preview Paper Container body
const previewContainerRegex = /<div\s+className="flex-1 bg-slate-50\/80[^>]*>[\s\S]*?<\/div>\s*<\/div>/;
const newPreviewContainer = `
      <div className="flex-1 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-6 overflow-x-hidden overflow-y-auto flex justify-center shadow-inner min-h-[600px] max-h-[85vh]">
        <TemplateCoverflow 
          templates={TEMPLATES}
          activeId={templateId}
          onChange={onTemplateChange}
          resume={resume}
          accentColor={accentColor}
          zoomLevel={zoomLevel}
        />
      </div>
    </div>
`;
content = content.replace(previewContainerRegex, newPreviewContainer.trim());

fs.writeFileSync('src/components/preview/ResumePreview.jsx', content, 'utf8');
