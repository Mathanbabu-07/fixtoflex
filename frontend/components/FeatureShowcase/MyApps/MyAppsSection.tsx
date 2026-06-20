"use client";

import React from "react";
import MyAppsLeftContent from "./MyAppsLeftContent";
import MyAppsDashboard from "./MyAppsDashboard";
import AnimatedBackground from "../AnimatedBackground";
import { useMotionValue } from "framer-motion";

interface MyAppsSectionProps {
  tabIndexStr?: string;
}

export default function MyAppsSection({ tabIndexStr = "04 / 05" }: MyAppsSectionProps) {
  // We keep motion value initializations to satisfy AnimatedBackground imports
  // but we do not track cursor move coords to prevent dynamic parallax tilts,
  // keeping the dashboard clean, readable and stable as requested.
  const dummyMouseX = useMotionValue(0);
  const dummyMouseY = useMotionValue(0);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-8 items-center z-10 overflow-visible">
      {/* Dynamic background lighting (stable, subtle mesh) */}
      <AnimatedBackground mouseX={dummyMouseX} mouseY={dummyMouseY} />

      {/* Left Column (Content Panel) */}
      <MyAppsLeftContent tabIndexStr={tabIndexStr} />

      {/* Right Column (Stable Premium Applications Dashboard) */}
      <div className="w-full flex justify-center lg:justify-end overflow-visible">
        <MyAppsDashboard />
      </div>
    </div>
  );
}
