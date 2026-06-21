"use client";

import React from "react";
import MailLeftContent from "./MailLeftContent";
import MailDashboard from "./MailDashboard";
import AnimatedBackground from "../AnimatedBackground";
import { useMotionValue } from "framer-motion";

interface MailSectionProps {
  tabIndexStr?: string;
}

export default function MailSection({ tabIndexStr = "05 / 05" }: MailSectionProps) {
  const dummyMouseX = useMotionValue(0);
  const dummyMouseY = useMotionValue(0);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-8 items-start z-10 overflow-visible">
      {/* Dynamic background lighting (stable, subtle mesh) */}
      <AnimatedBackground mouseX={dummyMouseX} mouseY={dummyMouseY} />

      {/* Left Column (Content Panel) */}
      <MailLeftContent tabIndexStr={tabIndexStr} />

      {/* Right Column (Stable Premium AI Email Workspace) */}
      <div className="w-full flex justify-center lg:justify-end overflow-visible lg:mt-14">
        <MailDashboard />
      </div>
    </div>
  );
}
