"use client";

import React, { useRef } from "react";
import { useMotionValue } from "framer-motion";

import JobTrackerLeftContent from "./JobTrackerLeftContent";
import JobTrackerDashboard from "./JobTrackerDashboard";
import AnimatedBackground from "../AnimatedBackground";

interface JobTrackerSectionProps {
  tabIndexStr?: string;
}

export default function JobTrackerSection({ tabIndexStr = "03 / 05" }: JobTrackerSectionProps) {
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
      className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-8 items-start z-10 overflow-visible"
    >
      {/* Animated Aurora meshes and orbits */}
      <AnimatedBackground mouseX={mouseX} mouseY={mouseY} />

      {/* Left Column (Content) */}
      <JobTrackerLeftContent tabIndexStr={tabIndexStr} />

      {/* Right Column (Premium Job Tracker Dashboard) */}
      <div className="w-full flex justify-center lg:justify-end overflow-visible lg:mt-14">
        <JobTrackerDashboard mouseX={mouseX} mouseY={mouseY} />
      </div>
    </div>
  );
}
