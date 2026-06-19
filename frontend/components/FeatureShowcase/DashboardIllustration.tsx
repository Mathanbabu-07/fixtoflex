"use client";

import React, { useEffect } from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { 
  User, 
  BarChart2, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Edit, 
  Send 
} from "lucide-react";

import ProfileStrengthCard from "./ProfileStrengthCard";
import AISuggestionsCard from "./AISuggestionsCard";
import SkillsCard from "./SkillsCard";
import VerificationShield from "./VerificationShield";
import TargetDecoration from "./TargetDecoration";

interface DashboardIllustrationProps {
  mouseX: any;
  mouseY: any;
}

export default function DashboardIllustration({ mouseX, mouseY }: DashboardIllustrationProps) {
  // Main Dashboard Parallax displacement (subtle)
  const dx = useTransform(mouseX, (v: number) => v * 0.012);
  const dy = useTransform(mouseY, (v: number) => v * 0.012);

  // SVG Drawing state for lines (scroll reveal)
  const drawLine: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.6,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.4 },
        opacity: { duration: 0.6, delay: 0.4 }
      }
    }
  };

  return (
    <div className="scale-[0.75] xs:scale-[0.85] sm:scale-[0.9] md:scale-95 lg:scale-100 origin-center transition-all duration-500 w-full flex items-center justify-center overflow-visible">
      <div className="relative w-full aspect-[1.3/1] max-w-[620px] flex items-center justify-center select-none z-10 pt-8 pb-12 overflow-visible">
      
      {/* ========================================================================= */}
      {/* SVG DOTTED CONNECTION LINES WITH FLOWING DASHES */}
      {/* ========================================================================= */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 460"
      >
        {/* Path 1: Verification Shield (top right) to Dashboard */}
        <motion.path 
          d="M 470,60 Q 420,40 380,100" 
          fill="none" 
          stroke="#C7D2FE" 
          strokeWidth="2.5" 
          strokeDasharray="6,6"
          className="animate-[dash_12s_linear_infinite]"
          variants={drawLine}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
        {/* Path 2: Profile Strength (right middle) to Dashboard */}
        <motion.path 
          d="M 520,180 Q 450,150 370,190" 
          fill="none" 
          stroke="#C7D2FE" 
          strokeWidth="2.5" 
          strokeDasharray="6,6"
          className="animate-[dash_10s_linear_infinite_reverse]"
          variants={drawLine}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
        {/* Path 3: AI Suggestions (bottom right) to Dashboard */}
        <motion.path 
          d="M 500,380 Q 430,410 350,330" 
          fill="none" 
          stroke="#C7D2FE" 
          strokeWidth="2.5" 
          strokeDasharray="6,6"
          className="animate-[dash_15s_linear_infinite]"
          variants={drawLine}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
        {/* Path 4: Skills Card (bottom left) to Dashboard */}
        <motion.path 
          d="M 120,410 Q 180,440 240,360" 
          fill="none" 
          stroke="#C7D2FE" 
          strokeWidth="2.5" 
          strokeDasharray="6,6"
          className="animate-[dash_14s_linear_infinite]"
          variants={drawLine}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />

        {/* Curved Path for Paper Plane */}
        <path 
          id="plane-arc"
          d="M 40,70 Q 120,-30 200,80" 
          fill="none" 
          stroke="transparent" 
        />
      </svg>

      {/* ========================================================================= */}
      {/* PAPER PLANE ANIMATED ALONG CURVED SVG PATH */}
      {/* ========================================================================= */}
      <motion.div
        className="absolute top-[-30px] left-[60px] z-20 text-indigo-400 pointer-events-none"
        animate={{
          x: [0, 80, 160],
          y: [0, -45, 10],
          rotate: [0, 25, 45],
          opacity: [0, 0.9, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut"
        }}
      >
        <Send className="w-6 h-6 fill-indigo-50/80 drop-shadow-md" />
      </motion.div>

      {/* ========================================================================= */}
      {/* MAIN BROWSER WINDOW WITH BREEDING SCALE AND PARALLAX */}
      {/* ========================================================================= */}
      <motion.div
        style={{ x: dx, y: dy, willChange: "transform" }}
        animate={{
          scale: [0.99, 1.01, 0.99]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl w-full aspect-[1.36/1] shadow-[0_30px_70px_rgba(30,27,75,0.12)] flex flex-col overflow-hidden"
      >
        {/* A. Browser Window Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/90 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-sm" />
          </div>
          <div className="h-6 w-[200px] bg-slate-100/70 border border-slate-200/30 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 select-none">
            fixtoflex.com/profile
          </div>
          <div className="w-10" />
        </div>

        {/* B. Window Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* 1. Deep Indigo Vertical Sidebar */}
          <div className="w-[52px] sm:w-[60px] bg-[#1E1B4B] flex flex-col items-center justify-between py-6 shrink-0 text-slate-400">
            <div className="flex flex-col items-center gap-5 w-full">
              {/* User profile tab active wrapper */}
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)] shrink-0 cursor-pointer">
                <User className="w-4 h-4" />
              </div>
              <div className="w-full px-3 my-1">
                <div className="h-px bg-white/10 w-full" />
              </div>
              {[BarChart2, Briefcase, GraduationCap, Star].map((Icon, idx) => (
                <div 
                  key={idx} 
                  className="w-8 h-8 rounded-xl hover:bg-white/5 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0"
                >
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. Main Edit Profile Panel */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden bg-slate-50/50">
            {/* User Profile Header details */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                {/* Avatar with ring glow */}
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg--to-tr from-purple-500 to-indigo-500 blur-sm opacity-40 animate-pulse" />
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 flex items-center justify-center font-bold text-indigo-600 text-lg">
                    {/* Premium mock photo representation */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" 
                      alt="Candidate Avatar"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* Status dot */}
                  <span className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>

                {/* Name placeholder & edit indicators */}
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#1E1B4B] flex items-center gap-1.5 leading-tight">
                    Arjun Kumar
                  </h4>
                  <div className="h-3 bg-slate-200/60 rounded-full w-28" />
                </div>
              </div>

              {/* Edit button */}
              <button className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-slate-500 transition-colors shadow-xs">
                <Edit className="w-3 h-3" />
                Edit Profile
              </button>
            </div>

            {/* Dashboard Mini Horizontal Tabs */}
            <div className="flex gap-2 border-b border-slate-200/60 pb-3 mb-5 overflow-x-auto scrollbar-none select-none text-[10px] sm:text-[11px] font-bold text-slate-400">
              <span className="text-purple-600 bg-purple-50 px-3 py-1 rounded-md shrink-0 cursor-pointer">About</span>
              {["Experience", "Education", "Skills", "Projects"].map((t) => (
                <span key={t} className="px-3 py-1 hover:text-[#1E1B4B] shrink-0 cursor-pointer transition-colors">
                  {t}
                </span>
              ))}
            </div>

            {/* Content lines placeholders */}
            <div className="space-y-3.5 flex-1">
              <div className="h-3 bg-slate-200/60 rounded-full w-5/6" />
              <div className="h-3 bg-slate-200/40 rounded-full w-full" />
              <div className="h-3 bg-slate-200/40 rounded-full w-4/5" />
              <div className="h-3 bg-slate-200/40 rounded-full w-11/12" />
              <div className="h-3 bg-slate-200/30 rounded-full w-2/3" />
            </div>
          </div>

        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* DECORATIVE MINIMALIST POTTED PLANT (Bottom Left) */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute bottom-[-16%] left-[-8%] sm:left-[-16%] xl:left-[-12%] w-20 sm:w-24 h-24 sm:h-28 pointer-events-none select-none flex flex-col items-center justify-end z-20"
      >
        {/* Plant leaves (purple) */}
        <div className="relative w-16 h-16 flex items-center justify-center mb-[-4px]">
          {/* Leaf 1 (Left) */}
          <div className="absolute w-8 h-8 bg-purple-400/80 rounded-tl-full rounded-br-full rotate-[-45deg] origin-bottom-right bottom-0 right-1/2 shadow-xs" />
          {/* Leaf 2 (Right) */}
          <div className="absolute w-8 h-8 bg-purple-500/80 rounded-tr-full rounded-bl-full rotate-[45deg] origin-bottom-left bottom-0 left-1/2 shadow-xs" />
          {/* Leaf 3 (Center High) */}
          <div className="absolute w-7 h-10 bg-indigo-500/90 rounded-t-full bottom-2 shadow-sm" />
          {/* Leaf 4 (Far Left) */}
          <div className="absolute w-6 h-6 bg-purple-300/60 rounded-tl-full rounded-br-full rotate-[-75deg] origin-bottom-right bottom-1 right-2/3 shadow-2xs" />
          {/* Leaf 5 (Far Right) */}
          <div className="absolute w-6 h-6 bg-indigo-300/60 rounded-tr-full rounded-bl-full rotate-[75deg] origin-bottom-left bottom-1 left-2/3 shadow-2xs" />
        </div>
        {/* Potted Ceramic Pot */}
        <div className="w-12 h-10 bg-slate-100 border border-slate-200 rounded-b-xl rounded-t-sm shadow-[0_5px_15px_rgba(0,0,0,0.04)] flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-200/50 rounded-full" />
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* FLOATING SUB-COMPONENTS */}
      {/* ========================================================================= */}
      <ProfileStrengthCard mouseX={mouseX} mouseY={mouseY} />
      <AISuggestionsCard mouseX={mouseX} mouseY={mouseY} />
      <SkillsCard mouseX={mouseX} mouseY={mouseY} />
      <VerificationShield mouseX={mouseX} mouseY={mouseY} />
      <TargetDecoration mouseX={mouseX} mouseY={mouseY} />

      {/* Dotted path CSS animation style helper */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -120;
          }
        }
      `}</style>

      </div>
    </div>
  );
}
