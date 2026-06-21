"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Edit,
  Type,
  ImageIcon,
  Code,
  Settings,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  User,
  Briefcase,
  FolderOpen,
  Mail,
  Send,
  ArrowRight,
  Check,
  Sparkles,
  Download,
} from "lucide-react";

interface PortfolioIllustrationProps {
  mouseX: any;
  mouseY: any;
}

export default function PortfolioIllustration({ mouseX, mouseY }: PortfolioIllustrationProps) {

  const drawLine: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.5,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.4 },
        opacity: { duration: 0.6, delay: 0.4 }
      }
    }
  };

  // Toolbar icons for the left floating sidebar
  const toolbarIcons = [LayoutGrid, Edit, Type, ImageIcon, Code, Settings];

  // Nav tabs for the portfolio browser
  const navItems = ["Home", "About", "Projects", "Skills", "Contact"];

  // Section icons for "Add Sections" card
  const sectionItems = [
    { icon: User, label: "About" },
    { icon: Code, label: "Skills" },
    { icon: FolderOpen, label: "Projects" },
    { icon: Briefcase, label: "Experience" },
    { icon: Mail, label: "Contact" },
  ];

  // Theme colors
  const themeColors = [
    { color: "#7C3AED", active: true },
    { color: "#10B981", active: false },
    { color: "#1E1B4B", active: false },
    { color: "#F59E0B", active: false },
    { color: "#EF4444", active: false },
  ];

  return (
    <div className="scale-[0.7] xs:scale-[0.8] sm:scale-[0.85] md:scale-90 lg:scale-100 origin-center transition-all duration-500 w-full flex items-center justify-center overflow-visible">
      <div className="relative w-full aspect-[1.3/1] max-w-[660px] flex items-center justify-center select-none z-10 pt-6 pb-10 overflow-visible">

        {/* ================================================================== */}
        {/* SVG CONNECTION LINES */}
        {/* ================================================================== */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 660 500"
        >
          <motion.path
            d="M 560,80 Q 500,50 420,100"
            fill="none" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="6,6"
            variants={drawLine} initial="hidden" whileInView="visible" viewport={{ once: true }}
          />
          <motion.path
            d="M 600,260 Q 530,230 460,280"
            fill="none" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="6,6"
            variants={drawLine} initial="hidden" whileInView="visible" viewport={{ once: true }}
          />
          <motion.path
            d="M 300,440 Q 340,420 360,380"
            fill="none" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="6,6"
            variants={drawLine} initial="hidden" whileInView="visible" viewport={{ once: true }}
          />
        </svg>

        {/* ================================================================== */}
        {/* PAPER PLANE */}
        {/* ================================================================== */}
        <div className="absolute top-[-20px] right-[80px] z-30 text-indigo-400 pointer-events-none opacity-80">
          <Send className="w-5 h-5 fill-indigo-50/80 drop-shadow-md" />
        </div>

        
        {/* ================================================================== */}
        {/* LEFT FLOATING TOOLBAR */}
        {/* ================================================================== */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 90 }}
          style={{ willChange: "transform" }}
          className="absolute left-[-2%] sm:left-[0%] top-[14%] z-20"
        >
          <div className="bg-[#39397a] rounded-2xl p-2.5 flex flex-col items-center gap-2.5 shadow-[0_15px_40px_rgba(30,27,75,0.25)] border border-indigo-900/30">
            {toolbarIcons.map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                whileHover={{ scale: 1.15, backgroundColor: "rgba(124,58,237,0.3)" }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-300 ${
                  i === 0 ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================================================================== */}
        {/* MAIN BROWSER WINDOW (PORTFOLIO PREVIEW) */}
        {/* ================================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl w-[82%] aspect-[1.4/1] shadow-[0_25px_60px_rgba(30,27,75,0.1)] flex flex-col overflow-hidden ml-6"
        >
          {/* Browser Chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 shrink-0 bg-white/60">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="h-5 w-[160px] bg-slate-100/70 border border-slate-200/30 rounded-md flex items-center justify-center text-[8px] font-bold text-slate-400 select-none">
              yourname.dev
            </div>
            <div className="w-8" />
          </div>

          {/* Portfolio Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Portfolio Nav */}
            <div className="flex items-center justify-between px-5 py-2 border-b border-slate-100/60">
              {/* Logo */}
              <div className="w-7 h-7 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-[8px] shadow-sm">
                A
              </div>
              {/* Nav Items */}
              <div className="flex items-center gap-3 text-[8px] sm:text-[9px] font-semibold text-slate-500">
                {navItems.map((item, i) => (
                  <span key={item} className={`cursor-pointer transition-colors ${i === 0 ? "text-[#1E1B4B]" : "hover:text-[#1E1B4B]"}`}>
                    {item}
                  </span>
                ))}
                <span className="px-2.5 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md text-[8px] font-bold cursor-pointer">
                  Hire Me
                </span>
              </div>
            </div>

            {/* Hero Section */}
            <div className="flex-1 flex items-center px-5 py-4 gap-5">
              {/* Left Text */}
              <div className="flex-1 space-y-2.5 min-w-0">
                <p className="text-[9px] text-slate-400 font-medium">Hi, I&apos;m</p>
                <h3 className="text-[18px] sm:text-[22px] font-extrabold text-[#1E1B4B] leading-tight">
                  Your Name
                </h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-purple-600">
                  Full Stack Developer
                </p>
                <p className="text-[8px] text-slate-400 leading-relaxed max-w-[200px]">
                  I build modern and responsive web applications that deliver results.
                </p>

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                  <button className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[8px] font-bold rounded-md shadow-sm">
                    View Work
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-[8px] font-bold text-slate-600 rounded-md shadow-xs flex items-center gap-1">
                    <Download className="w-2.5 h-2.5" />
                    Download CV
                  </button>
                </div>

                {/* Social Icons */}
                <div className="flex gap-2.5 pt-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1E1B4B] flex items-center justify-center text-white cursor-pointer hover:bg-[#2d2a5e] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white cursor-pointer hover:bg-[#0d7ee6] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white cursor-pointer">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Right Avatar Placeholder */}
              <div className="w-[130px] h-[140px] sm:w-[150px] sm:h-[160px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50 flex items-center justify-center shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5" />
                {/* Stylized avatar */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-indigo-400 flex items-center justify-center border-2 border-white shadow-md">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="w-20 h-8 bg-gradient-to-r from-indigo-200/60 to-purple-200/60 rounded-lg" />
                  <div className="w-16 h-2 bg-slate-200/50 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================================== */}
        {/* RIGHT PREVIEW PANEL */}
        {/* ================================================================== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 90 }}
          style={{ willChange: "transform" }}
          className="absolute top-[2%] right-[-8%] sm:right-[-6%] xl:right-[-4%] w-[155px] sm:w-[170px] z-20"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_10px_30px_rgba(124,58,237,0.1)] p-3.5 space-y-3">
            {/* Preview label */}
            <span className="text-[10px] font-bold text-slate-800">Preview</span>

            {/* Device switcher */}
            <div className="flex gap-1.5">
              {[
                { Icon: Monitor, active: true },
                { Icon: Tablet, active: false },
                { Icon: Smartphone, active: false },
              ].map(({ Icon, active }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
              ))}
            </div>

            {/* Mini preview card */}
            <div className="bg-slate-50 rounded-lg border border-slate-100 p-2 space-y-1.5">
              <div className="text-[7px] text-slate-400 font-bold">Hi, I&apos;m</div>
              <div className="text-[9px] font-extrabold text-[#1E1B4B]">Your Name</div>
              <div className="text-[7px] font-bold text-purple-600">Full Stack Developer</div>
              <div className="h-1 bg-slate-200/60 rounded-full w-4/5 mt-1" />
              <div className="h-1 bg-slate-200/40 rounded-full w-3/5" />
              <div className="flex gap-1 mt-1.5">
                <div className="w-6 h-3 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-sm" />
                <div className="w-6 h-3 bg-slate-200 rounded-sm" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================================== */}
        {/* THEME CUSTOMIZER CARD */}
        {/* ================================================================== */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 90 }}
          style={{ willChange: "transform" }}
          className="absolute top-[48%] right-[-10%] sm:right-[-8%] xl:right-[-6%] w-[155px] sm:w-[170px] z-20"
        >
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_10px_30px_rgba(124,58,237,0.1)] p-3.5 space-y-3 transition-all duration-300"
          >
            <span className="text-[10px] font-bold text-slate-800">Customize</span>

            {/* Theme selector */}
            <div className="space-y-1.5">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Choose Theme</span>
              <div className="flex gap-1.5">
                {themeColors.map((tc, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
                      tc.active ? "ring-2 ring-offset-1 ring-purple-400" : ""
                    }`}
                    style={{ backgroundColor: tc.color }}
                  >
                    {tc.active && <Check className="w-3 h-3 text-white" />}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Primary Color slider */}
            <div className="space-y-1.5">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Primary Color</span>
              <div className="relative w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-violet-600 rounded-full">
                <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-purple-500 rounded-full shadow-sm cursor-pointer" />
              </div>
            </div>
          </motion.div>
        </motion.div>



        {/* ================================================================== */}
        {/* AI SUGGESTION CARD (Bottom Center-Right) */}
        {/* ================================================================== */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6, type: "spring", stiffness: 90 }}
          style={{ willChange: "transform" }}
          className="absolute bottom-[-12%] right-[16%] sm:right-[18%] z-20 w-[200px] sm:w-[220px]"
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] shadow-[0_10px_25px_rgba(124,58,237,0.12)] overflow-hidden"
          >
            <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-[15px] space-y-2.5">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">AI Suggestion</span>
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
                Add a project showcase section to highlight your best work.
              </p>
              <a
                href="#apply"
                className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 transition-colors group"
              >
                Apply Suggestion
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ================================================================== */}
        {/* BOTTOM RIGHT — DESKTOP MONITOR + PLANT */}
        {/* ================================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 100 }}
          style={{ willChange: "transform" }}
          className="absolute bottom-[-18%] right-[-4%] sm:right-[-2%] z-20 flex items-end gap-2"
        >
          {/* Monitor */}
          <div className="flex flex-col items-center">
            <div className="w-[90px] h-[60px] bg-[#1E1B4B] rounded-lg border border-slate-700/50 p-1.5 shadow-lg flex flex-col overflow-hidden">
              {/* Screen content */}
              <div className="flex-1 bg-white rounded-sm flex flex-col p-1 gap-0.5">
                <div className="h-1 bg-purple-500 rounded-full w-3/4" />
                <div className="h-0.5 bg-slate-200 rounded-full w-full" />
                <div className="h-0.5 bg-slate-200 rounded-full w-5/6" />
                <div className="flex gap-0.5 mt-auto">
                  <div className="w-3 h-2 bg-indigo-100 rounded-sm" />
                  <div className="w-3 h-2 bg-purple-100 rounded-sm" />
                  <div className="w-3 h-2 bg-indigo-100 rounded-sm" />
                </div>
              </div>
            </div>
            {/* Stand */}
            <div className="w-3 h-4 bg-slate-300 rounded-b-sm" />
            <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </div>

          {/* Plant */}
          <div className="flex flex-col items-center mb-1">
            <div className="relative w-10 h-10 flex items-center justify-center mb-[-3px]">
              <div className="absolute w-5 h-5 bg-purple-400/80 rounded-tl-full rounded-br-full rotate-[-45deg] origin-bottom-right bottom-0 right-1/2" />
              <div className="absolute w-5 h-5 bg-indigo-500/80 rounded-tr-full rounded-bl-full rotate-[45deg] origin-bottom-left bottom-0 left-1/2" />
              <div className="absolute w-4 h-6 bg-indigo-600/80 rounded-t-full bottom-1" />
            </div>
            <div className="w-7 h-5 bg-slate-100 border border-slate-200 rounded-b-lg rounded-t-sm" />
          </div>
        </motion.div>

        {/* ================================================================== */}
        {/* RIGHT NAVIGATION ARROW */}
        {/* ================================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="absolute right-[-14%] sm:right-[-10%] top-[45%] z-20"
        >
          <motion.div
            whileHover={{ scale: 1.1, x: 3 }}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-md flex items-center justify-center cursor-pointer text-slate-400 hover:text-purple-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Dot indicators at bottom */}
        <div className="absolute bottom-[-22%] left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === 1
                  ? "w-3 h-3 bg-purple-600"
                  : "w-2 h-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Shimmer keyframe helper */}
        <style jsx global>{`
          @keyframes shimmer {
            to { background-position: 200% center; }
          }
        `}</style>

      </div>
    </div>
  );
}
