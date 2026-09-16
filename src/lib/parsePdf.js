import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Parses a PDF file and extracts text, line structure, and metadata
 * @param {File | Blob | ArrayBuffer} fileInput 
 * @returns {Promise<{ rawText: string, pageCount: number, pages: Array, pdfDocument: any }>}
 */
export async function parsePdfFile(fileInput) {
  try {
    let arrayBuffer;
    if (fileInput instanceof ArrayBuffer) {
      arrayBuffer = fileInput;
    } else if (fileInput.arrayBuffer) {
      arrayBuffer = await fileInput.arrayBuffer();
    } else {
      throw new Error('Unsupported file input format for PDF');
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });

    const pdfDocument = await loadingTask.promise;
    const pageCount = pdfDocument.numPages;
    const pages = [];
    let combinedTextParts = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Group items by line based on Y coordinate
      const items = textContent.items.filter(item => typeof item.str === 'string');
      
      // Sort items: primarily by Y (descending: top to bottom), then by X (ascending: left to right)
      // Note in PDF coordinate system, Y=0 is bottom, so higher Y is higher on the page.
      const lineMap = new Map();
      
      for (const item of items) {
        if (!item.str.trim() && item.str.length === 0) continue;
        
        // transform: [scaleX, skewY, skewX, scaleY, transformX, transformY]
        const y = Math.round(item.transform[5]);
        const x = Math.round(item.transform[4]);
        
        // Find if an existing line is close enough (within 3 points)
        let matchedY = null;
        for (const existingY of lineMap.keys()) {
          if (Math.abs(existingY - y) <= 3) {
            matchedY = existingY;
            break;
          }
        }
        
        const lineKey = matchedY !== null ? matchedY : y;
        if (!lineMap.has(lineKey)) {
          lineMap.set(lineKey, []);
        }
        lineMap.get(lineKey).push({ x, text: item.str });
      }
      
      // Sort lines by Y descending (top of page first)
      const sortedLineKeys = Array.from(lineMap.keys()).sort((a, b) => b - a);
      
      const pageLines = [];
      let lastY = null;
      
      for (const yKey of sortedLineKeys) {
        const lineItems = lineMap.get(yKey).sort((a, b) => a.x - b.x);
        
        // Join words in the line with appropriate spacing
        let lineText = '';
        for (let i = 0; i < lineItems.length; i++) {
          const item = lineItems[i];
          if (i > 0 && !lineText.endsWith(' ') && !item.text.startsWith(' ')) {
            lineText += ' ';
          }
          lineText += item.text;
        }
        
        const cleanLine = lineText.trim();
        if (cleanLine) {
          // If large gap between lines (> 18 points), add empty line
          if (lastY !== null && Math.abs(lastY - yKey) > 20) {
            pageLines.push('');
          }
          pageLines.push(cleanLine);
          lastY = yKey;
        }
      }
      
      const pageText = pageLines.join('\n');
      pages.push({
        pageNumber: pageNum,
        text: pageText,
        lines: pageLines
      });
      
      combinedTextParts.push(pageText);
    }

    const rawText = combinedTextParts.join('\n\n');

    // Document-level garble check
    const alphabeticChars = rawText.replace(/[^a-zA-Z]/g, '');
    if (alphabeticChars.length > 50) {
      const vowels = rawText.replace(/[^aeiouAEIOU]/g, '');
      const vowelRatio = vowels.length / alphabeticChars.length;
      if (vowelRatio < 0.15 || vowelRatio > 0.6) {
        throw new Error('PDF_GARBLED_ENCODING: The PDF text is garbled due to missing or broken font encoding (ToUnicode CMap). Please upload a standard PDF or DOCX.');
      }
    }

    return {
      rawText,
      pageCount,
      pages,
      pdfDocument // Cached for Phase 4 photo crop canvas rendering
    };
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error(`Failed to parse PDF: ${error.message || error}`);
  }
}
