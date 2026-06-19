"use client";

import React, { useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

import LeftContent from "./LeftContent";
import DashboardIllustration from "./DashboardIllustration";
import AnimatedBackground from "./AnimatedBackground";

interface UpgradeProfileSectionProps {
  tabIndexStr?: string; // "01 / 05"
}

export default function UpgradeProfileSection({ tabIndexStr = "01 / 05" }: UpgradeProfileSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values to feed the 3D parallax offsets
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = event;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Compute distance from the center of this section
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Reset back to center when cursor exits
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-14 items-center z-10 overflow-visible"
    >
      {/* Animated Aurora meshes and orbits */}
      <AnimatedBackground mouseX={mouseX} mouseY={mouseY} />

      {/* Left Column (Content) */}
      <LeftContent tabIndexStr={tabIndexStr} />

      {/* Right Column (Premium Dashboard Illustration) */}
      <div className="w-full flex justify-center lg:justify-end overflow-visible">
        <DashboardIllustration mouseX={mouseX} mouseY={mouseY} />
      </div>
    </div>
  );
}
