import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

function Model({ isHoverable, isHovering, tilt, prefersReducedMotion }) {
  const { scene } = useGLTF('/models/hero.glb');
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    
    if (prefersReducedMotion) {
      // Freeze in resting pose
      group.current.rotation.x = THREE.MathUtils.degToRad(6);
      group.current.rotation.y = THREE.MathUtils.degToRad(-8);
    } else if (isHovering && isHoverable) {
      // Smooth orbit/tilt on mouse follow
      const targetX = THREE.MathUtils.degToRad(tilt.x);
      const targetY = THREE.MathUtils.degToRad(tilt.y);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.1);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.1);
    } else {
      // Ease back to resting rotation
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, THREE.MathUtils.degToRad(6), 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, THREE.MathUtils.degToRad(-8), 0.05);
    }
  });

  // Turn off ambient float when hovering or reduced-motion is on
  const isStatic = prefersReducedMotion || isHovering;
  const floatSpeed = isStatic ? 0 : 2;
  const rotationIntensity = isStatic ? 0 : 0.5;
  const floatIntensity = isStatic ? 0 : 1;

  return (
    <Float speed={floatSpeed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      {/* Model rotated to face camera decently and scaled to fit the 340x380px container */}
      <primitive 
        ref={group} 
        object={scene} 
        scale={5.5} 
        position={[0, 0, 0]} 
        rotation={[THREE.MathUtils.degToRad(70), THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(10)]} 
      />
    </Float>
  );
}

export default function CvHeroScene({ isHoverable, isHovering, tilt, prefersReducedMotion }) {
  // If very low end device, we could conditionally return null, but for this step
  // it degrades well because Canvas itself is lightweight, and Float zeroes out if prefersReducedMotion.
  return (
    <Canvas 
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]} // clamp pixel ratio for performance
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} />
      
      <Model 
        isHoverable={isHoverable}
        isHovering={isHovering}
        tilt={tilt}
        prefersReducedMotion={prefersReducedMotion}
      />
      
      {/* Subtle contact shadow under the floating model */}
      {!prefersReducedMotion && (
        <ContactShadows 
          position={[0, -1.2, 0]} 
          opacity={0.35} 
          scale={5} 
          blur={1.5} 
          far={3} 
          resolution={256}
        />
      )}
    </Canvas>
  );
}

useGLTF.preload('/models/hero.glb');
