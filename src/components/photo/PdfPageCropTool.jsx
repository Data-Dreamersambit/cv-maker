import React, { useEffect, useRef, useState } from 'react';
import { Crop, Check, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

export default function PdfPageCropTool({ pdfDocument, onCropComplete, onCancel }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Crop rectangle in rendered canvas coordinates { x, y, width, height }
  const [cropBox, setCropBox] = useState({ x: 40, y: 40, size: 140 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1.5);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let active = true;

    async function renderPage1() {
      if (!pdfDocument) {
        setError('No PDF document loaded for cropping.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const page = await pdfDocument.getPage(1);
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setCanvasDimensions({ width: viewport.width, height: viewport.height });

        // Position initial crop box near top-right or top-left (typical photo location)
        setCropBox({
          x: Math.round(viewport.width * 0.65),
          y: Math.round(viewport.height * 0.05),
          size: Math.round(Math.min(viewport.width, viewport.height) * 0.25)
        });

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        if (active) {
          setRendered(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to render PDF page 1:', err);
        if (active) {
          setError('Failed to render PDF page. You can upload a photo file instead.');
          setLoading(false);
        }
      }
    }

    renderPage1();

    return () => {
      active = false;
    };
  }, [pdfDocument, scale]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvasDimensions.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvasDimensions.height / rect.height);

    // Check if clicked inside crop box
    if (
      clickX >= cropBox.x &&
      clickX <= cropBox.x + cropBox.size &&
      clickY >= cropBox.y &&
      clickY <= cropBox.y + cropBox.size
    ) {
      setIsDragging(true);
      setDragOffset({
        x: clickX - cropBox.x,
        y: clickY - cropBox.y
      });
    } else {
      // Center crop box at click position
      const newX = Math.max(0, Math.min(canvasDimensions.width - cropBox.size, clickX - cropBox.size / 2));
      const newY = Math.max(0, Math.min(canvasDimensions.height - cropBox.size, clickY - cropBox.size / 2));
      setCropBox(prev => ({ ...prev, x: newX, y: newY }));
      setIsDragging(true);
      setDragOffset({ x: cropBox.size / 2, y: cropBox.size / 2 });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvasDimensions.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvasDimensions.height / rect.height);

    const newX = Math.max(0, Math.min(canvasDimensions.width - cropBox.size, mouseX - dragOffset.x));
    const newY = Math.max(0, Math.min(canvasDimensions.height - cropBox.size, mouseY - dragOffset.y));

    setCropBox(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSizeChange = (newSize) => {
    const clampedSize = Math.max(60, Math.min(Math.min(canvasDimensions.width, canvasDimensions.height), newSize));
    const clampedX = Math.max(0, Math.min(canvasDimensions.width - clampedSize, cropBox.x));
    const clampedY = Math.max(0, Math.min(canvasDimensions.height - clampedSize, cropBox.y));
    setCropBox({
      x: clampedX,
      y: clampedY,
      size: clampedSize
    });
  };

  const handleCrop = () => {
    if (!canvasRef.current) return;
    const sourceCanvas = canvasRef.current;
    
    // Create offscreen canvas for square avatar
    const outputCanvas = document.createElement('canvas');
    const outSize = 300;
    outputCanvas.width = outSize;
    outputCanvas.height = outSize;
    const ctx = outputCanvas.getContext('2d');

    // Draw cropped region scaled to 300x300
    ctx.drawImage(
      sourceCanvas,
      cropBox.x,
      cropBox.y,
      cropBox.size,
      cropBox.size,
      0,
      0,
      outSize,
      outSize
    );

    const dataUrl = outputCanvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(dataUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Crop Profile Photo from Page 1</h4>
          <p className="text-xs text-slate-400">Drag the crop square over your photo to select it</p>
        </div>

        {/* Size Slider */}
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-400 font-medium">Box Size:</span>
          <input
            type="range"
            min="60"
            max={Math.min(canvasDimensions.width || 300, 300)}
            value={cropBox.size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="w-24 accent-violet-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Canvas Interactive Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative bg-slate-50 border border-slate-200 rounded-2xl overflow-auto max-h-[420px] flex justify-center p-4 cursor-crosshair select-none shadow-inner"
      >
        {loading && (
          <div className="py-20 text-center text-xs text-slate-400">
            Rendering PDF page 1 for crop selector...
          </div>
        )}

        {error && (
          <div className="py-12 text-center text-xs text-rose-400">
            {error}
          </div>
        )}

        <div className="relative inline-block" onMouseDown={handleMouseDown}>
          <canvas
            ref={canvasRef}
            className="max-w-full rounded-lg shadow-2xl block"
          />

          {rendered && canvasDimensions.width > 0 && (
            <div
              style={{
                left: `${(cropBox.x / canvasDimensions.width) * 100}%`,
                top: `${(cropBox.y / canvasDimensions.height) * 100}%`,
                width: `${(cropBox.size / canvasDimensions.width) * 100}%`,
                height: `${(cropBox.size / canvasDimensions.height) * 100}%`
              }}
              className="absolute border-2 border-violet-400 bg-violet-500/20 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] pointer-events-none flex items-center justify-center ring-2 ring-white/60"
            >
              <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-medium transition"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!rendered}
          onClick={handleCrop}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply Cropped Photo</span>
        </button>
      </div>
    </div>
  );
}
