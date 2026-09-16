import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Replace PDF generation parts (Phase 1)
pdf_import = """import { pdf } from '@react-pdf/renderer';
import ClassicPdf from './pdf/ClassicPdf';
import MinimalPdf from './pdf/MinimalPdf';
import ModernPdf from './pdf/ModernPdf';"""

content = re.sub(
    r"import html2canvas from 'html2canvas';\nimport { jsPDF } from 'jspdf';",
    pdf_import,
    content
)

handle_print_old = """  const handlePrint = async \(\) => \{
    const candidateName = currentResume\?\.personal\?\.fullName \|\| 'Resume';
    const cleanFileName = `\$\{candidateName\.replace\(/\[\^a-zA-Z0-9_-\]/g, '_'\)\}_Resume`;

    const element = document\.getElementById\('resume-printable-area'\);
    if \(!element\) return;

    try \{
      const originalTransform = element\.style\.transform;
      element\.style\.transform = 'none';

      const canvas = await html2canvas\(element, \{
        scale: 2,
        useCORS: true,
        logging: false
      \}\);

      element\.style\.transform = originalTransform;

      const imgData = canvas\.toDataURL\('image/png'\);
      const pdf = new jsPDF\(\{
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      \}\);

      const pdfWidth = pdf\.internal\.pageSize\.getWidth\(\);
      const pdfHeight = \(canvas\.height \* pdfWidth\) / canvas\.width;
      const pageHeight = pdf\.internal\.pageSize\.getHeight\(\);

      let heightLeft = pdfHeight;
      let position = 0;

      pdf\.addImage\(imgData, 'PNG', 0, position, pdfWidth, pdfHeight\);
      heightLeft -= pageHeight;

      // Small threshold to prevent an extra blank page for a pixel or two
      while \(heightLeft > 2\) \{
        position = heightLeft - pdfHeight;
        pdf\.addPage\(\);
        pdf\.addImage\(imgData, 'PNG', 0, position, pdfWidth, pdfHeight\);
        heightLeft -= pageHeight;
      \}

      pdf\.save\(`\$\{cleanFileName\}\.pdf`\);
    \} catch \(error\) \{
      console\.error\('Error exporting PDF:', error\);
      const originalTitle = document\.title;
      document\.title = cleanFileName;
      window\.print\(\);
      setTimeout\(\(\) => \{ document\.title = originalTitle; \}, 1000\);
    \}
  \};"""

handle_print_new = """  const handlePrint = async () => {
    const candidateName = currentResume?.personal?.fullName || 'Resume';
    const cleanFileName = `${candidateName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume`;

    try {
      const Template = templateId === 'classic' ? ClassicPdf : templateId === 'minimal' ? MinimalPdf : ModernPdf;
      const blob = await pdf(<Template resume={currentResume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cleanFileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      const originalTitle = document.title;
      document.title = cleanFileName;
      window.print();
      setTimeout(() => { document.title = originalTitle; }, 1000);
    }
  };"""

content = re.sub(handle_print_old, handle_print_new, content)

# Replace styling (Phase 2)
# App shell background
content = content.replace('bg-slate-950', 'bg-violet-50')
content = content.replace('bg-slate-900', 'bg-white')
content = content.replace('bg-slate-850', 'bg-slate-50')
# Borders
content = content.replace('border-slate-800', 'border-slate-200')
content = content.replace('border-slate-900', 'border-slate-200')
# Text colors (light-on-dark -> dark-on-white)
content = content.replace('text-slate-100', 'text-slate-800')
content = content.replace('text-slate-300', 'text-slate-600')
content = content.replace('text-slate-400', 'text-slate-500')
content = content.replace('text-slate-500', 'text-slate-400') # shift down
# Accents
content = content.replace('text-indigo-400', 'text-violet-700')
content = content.replace('text-indigo-300', 'text-violet-600')
content = content.replace('bg-indigo-600', 'bg-violet-600')
content = content.replace('hover:bg-indigo-500', 'hover:bg-violet-700')
content = content.replace('from-indigo-600 to-violet-600', 'from-violet-600 to-violet-400')
content = content.replace('shadow-indigo-600', 'shadow-violet-600')
content = content.replace('text-white', 'text-white') # keep text-white on buttons

with open('src/App.jsx', 'w') as f:
    f.write(content)
