const fs = require('fs');

let content = fs.readFileSync('src/components/preview/ResumePreview.jsx', 'utf8');

// Add useRef to imports
if (!content.includes('useRef')) {
  content = content.replace("import React, { useState }", "import React, { useState, useRef }");
}

// Inside TemplateCoverflow, accept baseScale and apply it
content = content.replace(
  'function TemplateCoverflow({ templates, activeId, onChange, resume, accentColor, zoomLevel }) {',
  'function TemplateCoverflow({ templates, activeId, onChange, resume, accentColor, zoomLevel, baseScale = 1 }) {'
);

content = content.replace(
  /let scale = isActive \? \(zoomLevel \/ 100\) : 0\.6 \* \(zoomLevel \/ 100\);/g,
  'let scale = isActive ? (baseScale * (zoomLevel / 100)) : 0.6 * (baseScale * (zoomLevel / 100));'
);

content = content.replace(
  /scale = \(zoomLevel \/ 100\);/g,
  'scale = (baseScale * (zoomLevel / 100));'
);

// Inside ResumePreview, add ResizeObserver logic
const hookInject = `
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
`;

content = content.replace(
  '  const [zoomLevel, setZoomLevel] = useState(100);',
  '  const [zoomLevel, setZoomLevel] = useState(100);' + hookInject
);

// Attach ref to the container and pass baseScale to Coverflow
const containerRegex = /<div className="flex-1 bg-slate-50\/80[^"]*"[^>]*>/;
const match = content.match(containerRegex);
if (match) {
  const newContainer = match[0].replace('<div', '<div ref={containerRef}');
  content = content.replace(containerRegex, newContainer);
}

content = content.replace(
  /zoomLevel={zoomLevel}/,
  'zoomLevel={zoomLevel}\n          baseScale={baseScale}'
);

// Also set transform origin inside coverflow so it scales from top center correctly
content = content.replace(
  /className="col-start-1 row-start-1 origin-top cursor-grab active:cursor-grabbing pb-8"/,
  'className="col-start-1 row-start-1 origin-top cursor-grab active:cursor-grabbing pb-8" style={{ width: \'210mm\', transformOrigin: \'top center\', zIndex: isActive ? 10 : 0 }}'
);
// Remove the old style object since we just injected it above to merge them cleanly
content = content.replace(/style={{ width: '210mm', zIndex: isActive \? 10 : 0 }}/, '');


fs.writeFileSync('src/components/preview/ResumePreview.jsx', content, 'utf8');

