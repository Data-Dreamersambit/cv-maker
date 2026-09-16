const fs = require('fs');
let content = fs.readFileSync('src/components/preview/ResumePreview.jsx', 'utf8');

const hook = `
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
`;

content = content.replace(
  'const activeIndex = templates.findIndex(t => t.id === activeId);',
  'const activeIndex = templates.findIndex(t => t.id === activeId);' + hook
);

content = content.replace(
  /<div className="grid w-full \[perspective:1200px\]" style={{ placeItems: 'start center', transformStyle: 'preserve-3d' }}>/,
  '<div className="grid w-full [perspective:1200px]" style={{ placeItems: \'start center\', transformStyle: \'preserve-3d\', height: contentHeight * activeScale }}>'
);

fs.writeFileSync('src/components/preview/ResumePreview.jsx', content, 'utf8');
