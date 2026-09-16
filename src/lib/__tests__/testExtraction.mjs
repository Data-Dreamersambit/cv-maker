import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';

console.log('Testing Mammoth and PDF.js imports...');

if (typeof mammoth.convertToHtml === 'function' && typeof mammoth.extractRawText === 'function') {
  console.log('✅ Mammoth module loaded and exposed functions properly.');
} else {
  console.error('❌ Mammoth functions missing');
}

if (typeof pdfjsLib.getDocument === 'function') {
  console.log('✅ PDF.js getDocument API is available and callable.');
} else {
  console.error('❌ PDF.js getDocument missing');
}
