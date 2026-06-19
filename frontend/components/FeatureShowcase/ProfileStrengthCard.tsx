"use client";

import React, { useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ProfileStrengthCardProps {
  mouseX: any;
  mouseY: any;
}

export default function ProfileStrengthCard({ mouseX, mouseY }: ProfileStrengthCardProps) {
  // Translate cursor movement into Parallax displacement
  const px = useTransform(mouseX, (v: number) => v * 0.035);
  const py = useTransform(mouseY, (v: number) => v * 0.035);

  // Animate the gauge on mount
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPercent(82);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <motion.div
      style={{ x: px, y: py, willChange: "transform" }}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.03, rotateY: 5, rotateX: -5 }}
      className="absolute top-[8%] right-[-6%] sm:right-[-10%] lg:right-[-14%] xl:right-[-12%] w-[140px] sm:w-[170px] bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_10px_30px_rgba(124,58,237,0.1)] p-3 sm:p-4 flex flex-col items-center text-center select-none overflow-hidden"
    >
      {/* Decorative gradient border glow */}
      <div className="absolute inset-0 bg-linear-to-tr from-purple-500/10 to-indigo-500/10 opacity-50 -z-10" />
      
      {/* Subtitle / Label */}
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Profile Strength
      </span>

      {/* Radial Progress gauge */}
      <div className="relative flex items-center justify-center mb-3">
        {/* Glow behind the ring */}
        <div className="absolute w-12 h-12 rounded-full bg-purple-500/5 blur-md" />
        
        <svg className="w-[72px] h-[72px] transform -rotate-90">
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
          {/* Track circle */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            stroke="#EEF2F6"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx="36"
            cy="36"
            r={radius}
            stroke="url(#ring-gradient)"
            strokeWidth="5.5"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-sm font-extrabold text-[#1E1B4B]">
          {percent}%
        </span>
      </div>

      {/* Quality Badge */}
      <div className="inline-flex items-center gap-1 bg-purple-50 border border-purple-100/60 px-2 py-0.5 rounded-full mb-3">
        <span className="text-[9px] font-bold text-purple-700">Excellent</span>
        <Sparkles className="w-2.5 h-2.5 text-purple-600 animate-pulse" />
      </div>

      {/* Skeleton placeholders */}
      <div className="w-full space-y-1.5 pt-2 border-t border-slate-100/80">
        <div className="h-1 bg-slate-200/70 rounded-full w-4/5 mx-auto" />
        <div className="h-1 bg-slate-200/50 rounded-full w-2/3 mx-auto" />
      </div>
    </motion.div>
  );
}
