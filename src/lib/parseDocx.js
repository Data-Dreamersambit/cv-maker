import mammoth from 'mammoth/mammoth.browser.js';

/**
 * Parses a DOCX file and extracts raw text, structured HTML, and embedded images
 * @param {File | Blob | ArrayBuffer} fileInput 
 * @returns {Promise<{ rawText: string, html: string, images: Array<{ contentType: string, dataUrl: string }> }>}
 */
export async function parseDocxFile(fileInput) {
  try {
    let arrayBuffer;
    if (fileInput instanceof ArrayBuffer) {
      arrayBuffer = fileInput;
    } else if (fileInput.arrayBuffer) {
      arrayBuffer = await fileInput.arrayBuffer();
    } else {
      throw new Error('Unsupported file input format for DOCX');
    }

    const images = [];

    // Custom image handler to capture all embedded images as data URLs
    const mammothOptions = {
      convertImage: mammoth.images.imgElement(async (image) => {
        const imageBuffer = await image.read('base64');
        const dataUrl = `data:${image.contentType};base64,${imageBuffer}`;
        images.push({
          contentType: image.contentType,
          dataUrl
        });
        return { src: dataUrl };
      })
    };

    const [htmlResult, textResult] = await Promise.all([
      mammoth.convertToHtml({ arrayBuffer }, mammothOptions),
      mammoth.extractRawText({ arrayBuffer })
    ]);

    // Clean up raw text (mammoth can leave consecutive blank lines)
    const rawText = (textResult.value || '')
      .split('\n')
      .map(line => line.trim())
      .filter((line, i, arr) => line.length > 0 || (i > 0 && arr[i - 1].length > 0))
      .join('\n');

    return {
      rawText,
      html: htmlResult.value || '',
      images,
      messages: [...htmlResult.messages, ...textResult.messages]
    };
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    throw new Error(`Failed to parse DOCX: ${error.message || error}`);
  }
}
