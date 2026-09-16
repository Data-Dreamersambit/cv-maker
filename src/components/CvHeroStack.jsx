import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useReducedMotion } from 'framer-motion';

const CvHeroScene = lazy(() => import('./CvHeroScene'));

export default function CvHeroStack({ className = '' }) {
  const prefersReducedMotion = useReducedMotion();
  const [isHoverable, setIsHoverable] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 6, y: -8 });
  const containerRef = useRef(null);

  // Default resting angles
  const restingX = 6;
  const restingY = -8;

  useEffect(() => {
    // Check if the device has a fine pointer (mouse)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsHoverable(mediaQuery.matches);

    const handler = (e) => setIsHoverable(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !isHoverable || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize to -1 to 1 range
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    // Map to a ±8deg tilt maximum
    setTilt({
      x: restingX - y * 8, // Pitch (rotateX)
      y: restingY + x * 8  // Yaw (rotateY)
    });
  };

  const handleMouseEnter = () => {
    if (!prefersReducedMotion && isHoverable) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion && isHoverable) {
      setIsHovering(false);
      setTilt({ x: restingX, y: restingY }); // Eases back to resting
    }
  };

  return (
    <div 
      className={`relative w-full max-w-[340px] mx-auto h-[380px] flex items-center justify-center ${className}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-violet-400/20 blur-3xl rounded-full scale-110 pointer-events-none" />

      {/* Lazy-Loaded WebGL Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
             <div className="w-10 h-10 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        }>
          <CvHeroScene 
            isHoverable={isHoverable}
            isHovering={isHovering}
            tilt={tilt}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      </div>
    </div>
  );
}
