"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AnimatedBackgroundProps {
  mouseX: any; // MotionValue
  mouseY: any; // MotionValue
}

export default function AnimatedBackground({ mouseX, mouseY }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth out the spotlight movement
  const spotlightX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const spotlightY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  // Create background style with radial gradient spotlight
  const spotlightStyle = useTransform(
    [spotlightX, spotlightY],
    ([x, y]: any) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(124, 58, 237, 0.08), transparent 80%)`
  );

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-slate-50/50 pointer-events-none"
    >
      {/* Interactive spotlight */}
      <motion.div 
        className="absolute inset-0 w-full h-full opacity-70"
        style={{ background: spotlightStyle }}
      />

      {/* Morphing Aurora mesh gradients (ambient background) */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-200/20 blur-[130px] animate-[pulse_10s_infinite_alternate]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/20 blur-[150px] animate-[pulse_12s_infinite_alternate_2s]" />
      <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-blue-200/15 blur-[120px] animate-[pulse_8s_infinite_alternate_1s]" />

      {/* Rotating radial light ring */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[30%] left-[20%] w-[700px] h-[700px] border border-dashed border-indigo-200/10 rounded-full opacity-40"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[25%] left-[15%] w-[850px] h-[850px] border border-dashed border-purple-200/10 rounded-full opacity-30"
      />

      {/* Orbiting particles */}
      {[...Array(6)].map((_, i) => {
        const delays = [0, 1.5, 3, 4.5, 6, 7.5];
        const sizes = [6, 8, 5, 7, 9, 6];
        const opacities = [0.25, 0.35, 0.2, 0.4, 0.3, 0.25];
        const durations = [24, 32, 28, 36, 40, 30];
        const radiusX = [200, 280, 240, 320, 180, 350];
        const radiusY = [120, 180, 150, 200, 100, 220];

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500"
            style={{
              width: sizes[i],
              height: sizes[i],
              opacity: opacities[i],
              filter: "blur(0.5px)",
              top: "50%",
              left: "50%",
              boxShadow: "0 0 10px rgba(124, 58, 237, 0.5)",
            }}
            animate={{
              // Elliptical orbit calculation using custom transforms
              x: radiusX[i] ? [
                0, 
                radiusX[i], 
                0, 
                -radiusX[i], 
                0
              ] : 0,
              y: radiusY[i] ? [
                -radiusY[i], 
                0, 
                radiusY[i], 
                0, 
                -radiusY[i]
              ] : 0,
              scale: [1, 1.2, 0.8, 1.2, 1],
            }}
            transition={{
              duration: durations[i],
              repeat: Infinity,
              ease: "linear",
              delay: delays[i]
            }}
          />
        );
      })}
    </div>
  );
}
