import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function MagneticButton({ children, className = '', onClick, as = 'button', ...props }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsHoverable(mediaQuery.matches);
    const handler = (e) => setIsHoverable(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouse = (e) => {
    if (prefersReducedMotion || !isHoverable || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = as === 'div' ? motion.div : motion.button;
  const activeProps = (prefersReducedMotion || !isHoverable) ? {} : {
    whileTap: { scale: 0.94, z: -20 }
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.2 }}
      className={`relative origin-center ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      {...activeProps}
      {...props}
    >
      {children}
    </Component>
  );
}
