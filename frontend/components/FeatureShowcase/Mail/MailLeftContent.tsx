"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail, Coffee } from "lucide-react";

interface MailLeftContentProps {
  tabIndexStr?: string;
}

export default function MailLeftContent({ tabIndexStr = "05 / 05" }: MailLeftContentProps) {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const featureList = [
    "Role-based Email Drafts",
    "Personalized & Professional Tone",
    "Automated Follow-ups",
    "Smart Templates Library",
    "Track Sent & Responses",
    "Save Time, Get More Replies",
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col items-start text-left space-y-7 max-w-[560px] lg:max-w-none w-full relative pb-48 lg:pb-0"
    >
      {/* Badge */}
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100/60 shadow-xs text-purple-700 text-xs font-extrabold select-none"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
        </span>
        {tabIndexStr}
      </motion.div>

      {/* Heading */}
      <motion.h2
        variants={itemVariants}
        className="font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.12] tracking-tight text-[#1E1B4B] w-full"
      >
        Draft Smarter,<br />
        <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-indigo-600 drop-shadow-xs">
          Reach Better
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-[15px] sm:text-[16px] leading-[1.6] text-slate-500 font-medium animate-fade-in"
      >
        Create personalized, professional emails in seconds with AI.
      </motion.p>

      {/* AI Assistant Card */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -3 }}
        className="w-full bg-purple-50/40 hover:bg-purple-50/60 border border-purple-100/50 backdrop-blur-md p-4 rounded-xl shadow-xs transition-all duration-300 relative group overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-purple-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex gap-3">
          <span className="text-lg mt-0.5 shrink-0 select-none">✨</span>
          <div className="space-y-1">
            <h4 className="text-[13px] font-bold text-[#1E1B4B]">
              AI-Powered Email Assistant
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Our AI writes the perfect email tailored to the role, company, recruiter, and context, helping you communicate professionally.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature Checklist */}
      <motion.ul variants={containerVariants} className="w-full space-y-3 pt-2">
        {featureList.map((feature) => (
          <motion.li
            key={feature}
            variants={itemVariants}
            whileHover={{ x: 6 }}
            className="flex items-center gap-3 text-[13px] sm:text-[14px] font-semibold text-slate-600 cursor-pointer select-none group transition-colors hover:text-slate-800"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="w-5 h-5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.div>
            <span className="transition-transform duration-300">{feature}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* CTA Button */}
      <motion.div variants={itemVariants} className="pt-4">
        <motion.button
          whileHover={{
            scale: 1.03,
            y: -2,
            boxShadow: "0 10px 25px rgba(124, 58, 237, 0.25)",
          }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 group shadow-lg transition-all duration-300 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>

      {/* ============================================================ */}
      {/* DECORATIVE OBJECTS (Bottom-left plant, envelope, mug)        */}
      {/* ============================================================ */}
      <div className="absolute bottom-[-180px] left-0 hidden lg:flex items-end gap-3 pointer-events-none select-none z-10">
        {/* Potted Plant */}
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-14 flex items-center justify-center mb-[-2px]">
            <div className="absolute w-5 h-5 bg-purple-400/70 rounded-tl-full rounded-br-full -rotate-45 origin-bottom-right bottom-0 right-1/2" />
            <div className="absolute w-5 h-5 bg-indigo-500/70 rounded-tr-full rounded-bl-full rotate-45 origin-bottom-left bottom-0 left-1/2" />
            <div className="absolute w-4 h-6 bg-indigo-600/70 rounded-t-full bottom-1" />
          </div>
          <div className="w-8 h-5 bg-slate-100 border border-slate-200 rounded-b-lg rounded-t-sm" />
        </div>

        {/* Envelope with @ card */}
        <div className="relative">
          <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-14 h-16 bg-white border border-slate-200 rounded-lg shadow-xs flex items-center justify-center -rotate-6 z-0">
            <span className="text-purple-600 font-extrabold text-[18px]">@</span>
          </div>
          <div className="w-[84px] h-[58px] bg-linear-to-tr from-violet-600 to-indigo-600 rounded-xl relative z-10 flex flex-col p-2.5 shadow-md">
            <div className="w-7 h-2.5 bg-violet-700 rounded-t-md absolute top-[-7px] left-1/2 -translate-x-1/2 z-0" />
            <Mail className="w-4 h-4 text-white mt-auto" />
          </div>
        </div>

        {/* Gmail Coffee Mug */}
        <div className="relative flex flex-col items-center">
          <div className="w-9 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-xs relative z-10">
            {/* Handle */}
            <div className="absolute right-[-6px] top-2 w-3.5 h-5 border-2 border-slate-200 rounded-r-lg z-0 bg-white" />
            {/* Logo */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 z-10">
              <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
              <path fill="#FBBC05" d="M22 6v12c0 1.1-.9 2-2 2h-2V8l-6 4-6-4v12H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4l4 4 4-4h4c1.1 0 2 .9 2 2z" />
              <path fill="#34A853" d="M2 6v12c0 1.1.9 2 2 2h2V8l6 4-10-6.67z" />
              <path fill="#4285F4" d="M22 6v12c0 1.1-.9 2-2 2h-2V8l-6 4 10-6.67z" />
            </svg>
          </div>
          <div className="w-10 h-1 bg-slate-200 rounded-full mt-[-2px]" />
        </div>
      </div>
    </motion.div>
  );
}
