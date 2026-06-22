"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Sparkles, Zap, Send, Briefcase } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

interface HeroProps {
  onGetStartedClick?: () => void;
}

export default function Hero({ onGetStartedClick }: HeroProps) {
  return (
    <section className="relative min-h-screen pt-[96px] pb-12 flex items-center justify-center overflow-hidden bg-linear-to-tr from-[#ffffff] via-[#f7f5ff] to-[#f3f0ff]">
      
      {/* BACKGROUND BLUR ORBS */}
      {/* Blurred purple orb */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full bg-purple-400/10 blur-[100px] top-[15%] left-[-10%] pointer-events-none animate-drift-slow"
      />
      {/* Blurred blue orb */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/8 blur-[120px] bottom-[10%] left-[20%] pointer-events-none animate-drift-slower"
      />
      {/* Blurred green orb */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full bg-emerald-400/8 blur-[100px] top-[10%] right-[-5%] pointer-events-none animate-drift-slowest"
      />

      {/* Grid container */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[53%_47%] gap-12 lg:gap-10 items-start z-10 pt-4 lg:pt-12">
        
        {/* Left Content Column */}
        <div className="flex flex-col items-start text-left space-y-5 max-w-[620px] lg:max-w-none mx-auto lg:mx-0">
          
          {/* Tagline Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100/60 shadow-sm text-purple-700 text-xs font-semibold"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            Next-Gen Job Application Command Centre
          </motion.div>

          {/* Large Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full"
          >
            <h1 className="font-extrabold text-[36px] leading-[1.08] xs:text-[46px] sm:text-[60px] lg:text-[66px] xl:text-[76px] tracking-[-0.03em] flex flex-col gap-2 text-[#1E1B4B]">
              <span className="block lg:whitespace-nowrap">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-[#22C55E] to-[#10B981]">Fix</span>{" "}
                <span className="bg-clip-text text-transparent bg-linear-to-r from-[#7C3AED] to-[#4F46E5]">Your Profile</span>
              </span>
              <span className="block lg:whitespace-nowrap">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-[#6D28D9] to-[#4F46E5]">Flex</span>{" "}
                <span className="bg-clip-text text-transparent bg-linear-to-r from-[#3B82F6] to-[#6366F1]">On Every</span>
              </span>
              <span className="block lg:whitespace-nowrap bg-clip-text text-transparent bg-linear-to-r from-[#3B82F6] to-[#6366F1]">
                Recruiter
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-[560px] text-[18px] sm:text-[22px] leading-[1.65] font-bold text-slate-500"
          >
            FixToFlex is an AI-Powered Job Application Platform that analyzes your resume against any job description, closes your skill gaps, and helps you land the offer.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-row items-center gap-6 w-full xs:w-auto"
          >
            {/* Button 1: Get Started */}
            {onGetStartedClick ? (
              <motion.button
                onClick={onGetStartedClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-[16px] sm:text-[18px] font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-2 group flex-1 xs:flex-initial cursor-pointer focus:outline-none"
              >
                Get Started 
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            ) : (
              <motion.a
                href="#get-started"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-linear-to-r from-[#7C3AED] to-[#4F46E5] text-white text-[16px] sm:text-[18px] font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-2 group flex-1 xs:flex-initial"
              >
                Get Started 
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.a>
            )}

            {/* Button 2: How It Works */}
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white/40 hover:bg-white/60 border border-slate-200/80 backdrop-blur-md text-[#1E1B4B] text-[16px] sm:text-[18px] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2.5 flex-1 xs:flex-initial"
            >
              <Play className="w-5 h-5 fill-[#1E1B4B] text-[#1E1B4B]" />
              How It Works
            </motion.a>
          </motion.div>

          {/* Features List Mini Badge with custom related icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-3 grid grid-cols-2 xs:flex xs:items-center gap-x-6 gap-y-3 border-t border-purple-100/60 w-full"
          >
            {/* 1. Profile Enhancing */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <motion.span
                animate={{
                  scale: [1, 1.18, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex text-[#7C3AED]"
              >
                <Sparkles className="w-4 h-4" />
              </motion.span>
              Profile Enhancing
            </div>

            {/* 2. Resume Booster */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <motion.span
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex text-emerald-500"
              >
                <Zap className="w-4 h-4" />
              </motion.span>
              Resume Booster
            </div>

            {/* 3. Auto Outreach with creative continuous animations */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <motion.span
                animate={{
                  x: [0, 5, 0],
                  y: [0, -4, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex text-indigo-500"
              >
                <Send className="w-4 h-4" />
              </motion.span>
              Auto Outreach
            </div>

            {/* 4. Job Matchmaking */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="inline-flex text-blue-500">
                <Briefcase className="w-4 h-4" />
              </span>
              Job Matchmaking
            </div>
          </motion.div>

        </div>

        {/* Right Dashboard Mockup Column */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex items-start justify-center lg:justify-end lg:pt-2"
        >
          <DashboardMockup />
        </motion.div>

      </div>
    </section>
  );
}
