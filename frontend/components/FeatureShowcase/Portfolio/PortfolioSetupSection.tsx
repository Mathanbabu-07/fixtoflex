"use client";

import React, { useRef } from "react";
import { useMotionValue } from "framer-motion";

import PortfolioLeftContent from "./PortfolioLeftContent";
import PortfolioIllustration from "./PortfolioIllustration";
import AnimatedBackground from "../AnimatedBackground";

interface PortfolioSetupSectionProps {
  tabIndexStr?: string;
}

export default function PortfolioSetupSection({ tabIndexStr = "02 / 05" }: PortfolioSetupSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = event;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-[42%_58%] gap-12 lg:gap-10 items-center z-10 overflow-visible"
    >
      {/* Animated Aurora meshes and orbits */}
      <AnimatedBackground mouseX={mouseX} mouseY={mouseY} />

      {/* Left Column (Content) */}
      <PortfolioLeftContent tabIndexStr={tabIndexStr} />

      {/* Right Column (Premium Portfolio Illustration) */}
      <div className="w-full flex justify-center lg:justify-end overflow-visible">
        <PortfolioIllustration mouseX={mouseX} mouseY={mouseY} />
      </div>
    </div>
  );
}
