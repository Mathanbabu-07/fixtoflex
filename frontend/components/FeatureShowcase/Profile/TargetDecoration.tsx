"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";

interface TargetDecorationProps {
  mouseX: any;
  mouseY: any;
}

export default function TargetDecoration({ mouseX, mouseY }: TargetDecorationProps) {
  // Parallax transforms
  const px = useTransform(mouseX, (v: number) => v * 0.05);
  const py = useTransform(mouseY, (v: number) => v * 0.05);

  return (
    <motion.div
      style={{ x: px, y: py, willChange: "transform" }}
      initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 100 }}
      className="absolute bottom-[-16%] right-[-2%] sm:right-[-6%] xl:right-[-4%] z-20 flex flex-col items-center select-none pointer-events-none"
    >
      {/* Target Stand / Base Platform */}
      <div className="relative w-32 h-6 bg-slate-100/80 border border-slate-200/50 rounded-full shadow-[0_8px_20px_rgba(124,58,237,0.06)] flex items-center justify-center">
        {/* Glow pulsing ring inside base */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            type: "tween",
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-20 h-3 rounded-full bg-purple-400/25 blur-sm"
        />
        
        {/* The 3D target board */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            y: [0, -4, 0]
          }}
          transition={{
            type: "tween",
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[8px] flex items-center justify-center"
        >
          {/* Target Face */}
          <div className="relative w-22 h-22 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-lg transform rotate-x-12 rotate-y-6">
            
            {/* Concentric rings */}
            <div className="w-17 h-17 rounded-full bg-purple-50 border border-purple-200/80 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-purple-200 border border-purple-300/80 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              </div>
            </div>

            {/* Bouncing Arrow in Bullseye */}
            <motion.div
              animate={{
                x: [10, 0, 10],
                y: [-10, 0, -10],
                scale: [0.95, 1, 0.95]
              }}
              transition={{
                type: "tween",
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[-25px] right-[-25px] w-20 h-20 origin-bottom-left"
            >
              <svg className="w-full h-full text-indigo-600 drop-shadow-md" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Arrow Shaft */}
                <line x1="2" y1="22" x2="16" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                {/* Arrow Head */}
                <path d="M12 4H20V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Feathers */}
                <path d="M2 18L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3.5 16.5L6.5 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
