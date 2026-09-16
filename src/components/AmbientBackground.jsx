import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export default function AmbientBackground() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Distinct parallax speeds for each layer
  // If reduced motion is active, we lock the transforms to 0.
  const y1 = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 350]);
  const y2 = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : -250]);
  const y3 = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 150]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Top-left violet blob */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-200/30 blur-[120px]"
      />
      {/* Right-side subtle slate blob */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute top-1/4 -right-20 w-[600px] h-[600px] rounded-full bg-slate-200/50 blur-[100px]"
      />
      {/* Bottom-left soft violet glow */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] rounded-full bg-violet-300/20 blur-[140px]"
      />
    </div>
  );
}
